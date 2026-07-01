# Ticket System — Arquitetura

> Visão completa do sistema: backend, frontend, modelo de domínio, formulários dinâmicos, tempo real e analytics.
> Documentos relacionados: [README](../README.md) · [Segurança](SECURITY.md) · [Ambiente e Deploy](ENVIRONMENT.md)

---

## 1. Visão do sistema

```
Usuário (Browser) / TV (Kiosk)
        │
        ▼
Frontend React ──────────────── porta 5173 dev / 8085 prod (Nginx)
        │  Axios (Bearer token + X-Plant-Id)
        │  SignalR WebSocket (/hubs/*, token via query string)
        ▼
Backend ASP.NET Core 8 ───────── porta 5029 dev / 8084 prod (container .NET)
        │                  │
        ▼                  ▼
     MySQL 8         AccessControl API
  (dados do sistema)  (identidade externa — só no login)
```

- **Multi-tenant por planta**: toda entidade pertence a uma `Plant`; o contexto ativo viaja no header `X-Plant-Id`.
- **UI server-driven**: o backend entrega schemas JSON (formulários, departamentos, checklists); o frontend renderiza dinamicamente. Mudança de formulário não exige redeploy.
- Em produção, um reverse proxy de host unifica tudo sob o mesmo domínio: `/` → frontend, `/api/` → backend, `/hubs/` → backend com upgrade WebSocket (ver [ENVIRONMENT.md](ENVIRONMENT.md#produção)).

---

## 2. Backend

### 2.1 Padrão arquitetural — Clean Architecture

```
Controllers     →  ponto de entrada HTTP, validação de request, delegação
Services        →  lógica de negócio, cálculos de analytics, integrações
Models/Domain   →  entidades com comportamento (Create, Start, Resolve...)
Data            →  AppDbContext (EF Core) + Seeders
DTOs            →  contratos explícitos de request/response (40+ DTOs)
```

Complementos transversais:

```
Middleware/     →  PlantAccessMiddleware, KioskAccessMiddleware
Authorization/  →  TicketAccessPolicy (policy CanManageTickets)
Hubs/           →  TicketHub, ChecklistHub (SignalR)
Domain/         →  DomainException (violações de regra de negócio)
Enums/          →  TicketStatus, ChecklistStatus, enums por setor
```

Regras de negócio vivem nos **métodos de domínio** dos models e nos services — controllers permanecem finos. Violações lançam `DomainException`.

### 2.2 Modelo de domínio

| Entidade | Papel | Campos/métodos-chave |
|---|---|---|
| `Plant` | Fronteira de tenant (fábrica) | `Name`, `Slug` (único), `IsActive` |
| `Department` | Área que resolve um tipo de problema | `FormSchema` (JSON), `Badges` (JSON), `AllowedRoles` (JSON), `CanBeManagedBy(roles)` |
| `Ticket` | Incidente reportado (entidade central) | `Create()`, `Start()`, `Resolve()`, `RequireChecklist()`, `SubmitChecklist()`, `AddResolutionFeedback()` |
| `ProductionLine` | Linha física da fábrica | `LineName` (único, uppercase), `Prefix`, auditoria (created/updated by) |
| `LinePrefix` | Agrupador de linhas | `Value` (ex.: `MB`), `Label` |
| `FieldTemplate` | Preset de campo do construtor de formulários | `Schema` (JSON), índice único `(PlantId, Name)` |
| `ChecklistTemplate` | Template de checklist com gatilho | `Schema` (JSON), `TriggerFieldId`/`TriggerFieldValue`, `MatchesTrigger()` |

**Ciclo de vida do ticket (transições irreversíveis):**

```
        operador abre
             ▼
          [ Open ]
             ▼  técnico assume — Start() valida status, WIP e permissão de departamento
        [ InProgress ]   ← startedAt registrado
             ▼  técnico resolve — Resolve() valida status e identidade do técnico
         [ Resolved ]    ← finishedAt registrado; checklist gerado se gatilho casar
```

- `isLineStopped` indica parada total da linha — eleva severidade e alimenta as métricas de downtime.
- `dynamicAnswers` guarda em JSON as respostas do formulário dinâmico do departamento.
- Timestamps em `DateTimeOffset` UTC; exibição em timezone `America/Sao_Paulo`.

**Enums** (`Enums/TicketsEnums.cs`):

```csharp
TicketStatus    { Open = 1, InProgress = 2, Resolved = 3 }
ChecklistStatus { NotRequired = 0, Pending = 1, Completed = 2 }
// + enums de apoio por setor (SoftwareSector, SetupTicketType, AutomationTicketType, ...)
```

### 2.3 Persistência

- **EF Core 9 + Pomelo MySQL**, com `UseSnakeCaseNamingConvention()` — todas as tabelas/colunas em snake_case (`departments`, `production_lines`, `field_templates`...).
  - ⚠️ MySQL em Linux é case-sensitive para nomes de tabela: SQL raw com nomes PascalCase **quebra**.
- Colunas JSON nativas do MySQL para schemas dinâmicos: `form_schema`, `badges`, `allowed_roles`, `dynamic_answers`, `checklist_content`, `schema`.
- FKs com `OnDelete = Restrict` — sem cascade delete.
- **Migrations aplicadas no startup** (`Program.cs`: `context.Database.Migrate()`), seguidas dos seeders.

**Seeders:** os `ProductionLineSeeder`/`DepartmentSeeder`/`FieldTemplateSeeder`/`ChecklistTemplateSeeder` existem como pontos de extensão, mas neste projeto são **no-op** (não populam dados). A UI é server-driven: departamentos, formulários, checklists, prefixos e linhas são cadastrados pelo **Cockpit Administrativo** após o primeiro login. A migration de multi-tenant cria uma planta inicial genérica (`Matriz`) para permitir o contexto `X-Plant-Id`.

### 2.4 Endpoints da API

> Autorização detalhada (policies, roles): [SECURITY.md](SECURITY.md).

| Recurso | Rota base | Endpoints |
|---|---|---|
| Auth | `/api/auth` | `POST /login` (anônimo) · `GET /validate` · `POST /kiosk` (anônimo, device key) |
| Tickets | `/api/tickets` | `GET` lista · `POST` cria · `PUT /{id}/start` assume · `PUT /{id}/resolve` resolve · `PATCH /{id}/feedback` |
| Histórico | `/api/tickets-history` | `GET` paginado com filtros (departamento, datas, busca, filtros dinâmicos, status) |
| Departments | `/api/departments` | `GET` · `GET /{id}` · `POST` · `PUT /{id}` · `PATCH /{id}/toggle-status` |
| Field Templates | `/api/field-templates` | `GET` · `GET /{id}` · `POST` · `PUT /{id}` · `DELETE /{id}` |
| Checklist Templates | `/api/checklist-templates` | `GET` · `GET /{id}` · `POST` · `PUT /{id}` · `PATCH /{id}/toggle-status` |
| Checklists | `/api/checklists` | `GET /pending-status` · `GET /inbox` · `POST /submit` · `GET /{ticketId}/pdf` |
| Production Lines | `/api/production-lines` | `GET` · `GET /by-prefix` · `GET /{id}` · `POST` · `PUT /{id}` · `POST /{id}/activate` · `POST /{id}/deactivate` · `DELETE /{id}` |
| Prefixes | `/api/prefixes` | `GET` · `POST` · `DELETE /{id}` |
| Plant Connectors | `/api/plant-connectors` | `GET ?panel=` · `POST` (admin) · `DELETE /{id}` (admin) · `GET /board` (cards Andon) · `GET /heatmap` (tiles do treemap) — conectores discriminados por `Panel` (Andon/Heatmap) |
| Roles | `/api/roles` | `GET /available` (roles do AccessControl, exclui `admin`) |
| Plants | `/api/plants` | `GET` (anônimo — alimenta o seletor do login/kiosk) |
| Actions Panel | `/api/actions-panel` | `GET` · `GET /{id}` (departamentos como painéis de ação) |
| Analytics live | `/api/analytics/dashboard/live` | `GET` (plantId, departmentId, shift) |
| Analytics histórico | `/api/analytics/historical/range` | `GET` (startDate, endDate, groupBy, shift) |
| Analytics expandido | `/api/analytics/expanded` | `GET /downtime-live` · `GET /downtime-historical` |

### 2.5 Tempo real — SignalR

| Hub | Rota | Evento | Agrupamento | Consumo |
|---|---|---|---|---|
| `TicketHub` | `/hubs/tickets` | `TicketCreated(ticketId, departmentId)` | grupo `plant-{plantId}` (admin pode trocar via query; demais usam a claim) | board e kiosks atualizam em tempo real + alerta sonoro (tocado só para quem atende o departamento do ticket; ver Frontend §3.10) |
| `ChecklistHub` | `/hubs/checklists` | `ChecklistChanged()` | por `UserId` | notifica o usuário quando um checklist é gerado/muda de status |

- WebSocket não envia header `Authorization` — o cliente manda o JWT como query string `access_token`, lido em `JwtBearerEvents.OnMessageReceived` apenas para os paths `/hubs/tickets` e `/hubs/checklists`.
- `TicketNotifier`/`ChecklistNotifier` (services) encapsulam o disparo dos eventos.

### 2.6 Analytics

| Service | Função |
|---|---|
| `LiveDowntimeDashboardService` | Métricas em tempo real: total/abertos, tempo médio de resposta e resolução, downtime total; por turno (`adm` = 07:28–17:28, `t2` = 17:28–07:28); buckets de 30 min ou janela de 24h; breakdown por departamento + série temporal |
| `DowntimeHistoricalService` | Mesmas métricas em períodos arbitrários, com `groupBy` de minuto a mês; séries de volume, abertos, resposta e downtime |
| `LiveExpandedAnalyticsService` / `HistoricalExpandedAnalyticsService` | Visão expandida (KPIs adicionais) live e histórica |

Cálculos em timezone São Paulo.

### 2.7 Checklists com gatilho

1. Admin cria um `ChecklistTemplate` vinculado a um departamento e a um **gatilho** (`TriggerFieldId` + `TriggerFieldValue` — campo e valor do formulário dinâmico).
2. Ao **resolver** um ticket, `ChecklistAssignmentService.FindApplicableTemplateAsync` procura template ativo cujo gatilho case com as `dynamicAnswers` do ticket (comparação case-insensitive).
3. Casou → `Ticket.RequireChecklist()` marca `ChecklistStatus = Pending` e o `ChecklistNotifier` avisa o monitor em tempo real.
4. Monitor preenche e submete (`POST /api/checklists/submit` → `Ticket.SubmitChecklist`, valida dono e conteúdo). PDF disponível via QuestPDF.

### 2.8 Painel Andon das linhas — conectores

Painel de calor (estilo Andon) que exibe as **linhas de produção** como cards e colore cada um pelo volume de **tickets em aberto** (`Open` ou `InProgress`).

- **`PlantConnector`** (entidade, tabela `plant_connectors`): `Source` (enum `ConnectorSource`, hoje só `ProductionLines`), `Prefix?` (filtro opcional — `null` = todas as linhas da planta), por planta. Um conector liga uma fonte de linhas ao painel; sem desenho/coordenadas.
- **`GET /api/plant-connectors/board`** resolve todos os conectores da planta → linhas ativas (todas ou pelos prefixos conectados) → conta tickets em aberto por `ProductionLineId` → devolve `BoardCardDto` (lineId, lineName, prefix, prefixLabel, openCount) ordenado por prefixo+nome. Toda a contagem é server-side.
- **Tempo real:** reaproveita o evento `TicketCreated` do `TicketHub` — o front refaz o `GET /board` a cada evento (não precisou novo evento/payload).
- Escrita (POST/DELETE de conector) exige `admin`; leitura e board exigem apenas autenticação. Multi-tenant por `X-Plant-Id`.

### 2.9 Painel Heatmap das linhas — treemap

Treemap (inspirado no mapa de calor de ações do TradingView) sobre os **mesmos conectores** do Andon: cada linha vira um bloco com **área proporcional ao volume de tickets em aberto** e **cor pelo tempo de linha parada** (downtime).

- **`GET /api/plant-connectors/heatmap`** resolve os conectores **do painel Heatmap** → linhas ativas → agrupa tickets em aberto (`Open`/`InProgress`) por `ProductionLineId` e devolve `HeatmapTileDto` (lineId, lineName, prefix, prefixLabel, **openCount** = tamanho, **oldestOpenStoppedAt** = `min(CreatedAt)` dos tickets em aberto com `IsLineStopped`). **Inclui todas as linhas** (sem ticket = bloco mínimo no front). Ordena por prefixo, depois por `openCount` desc.
- **Painéis independentes (`Panel`):** `PlantConnector.Panel` (enum `ConnectorPanel { Andon, Heatmap }`, migration `AddPanelToPlantConnector`, default DB = Andon) separa os conectores dos dois dashboards. `GET /plant-connectors?panel=` filtra (default Andon); `/board` lê só Andon, `/heatmap` só Heatmap; `POST` grava o painel do DTO; duplicidade considera o painel.
- **Downtime** segue a semântica do dashboard: medido a partir de `CreatedAt`; cresce enquanto o ticket está aberto (`Open` ou `InProgress`) e some quando resolvido. A cor final é calculada no **front** a partir do timestamp (escala sequencial verde→vermelho, joelho em 8 min, teto crítico em 16 min) — o servidor só entrega o timestamp, sem recalcular cor.
- **Tempo real:** mesmo `TicketCreated` do Andon (refetch) + refetch periódico (30 s); o front recolore a cada 1 s a partir do timestamp.
- Leitura exige autenticação; multi-tenant por `X-Plant-Id`.

### 2.10 Integração Google Chat (ciclo de vida do ticket)

O backend envia um card ao Google Chat em **cada transição de status** do ticket — abertura, início do atendimento e encerramento.

- **`GoogleChatNotifier`** (`Services/GoogleChat`, registrado como `IHttpClientFactory` nomeado) expõe três operações — `NotifyTicketCreatedAsync`, `NotifyTicketStartedAsync` e `NotifyTicketResolvedAsync` —, todas convergindo para um `SendAsync` privado que monta o payload **cardsV2** e faz `POST` no webhook do grupo. O card é escolhido pelo evento (`GoogleChatTicketEvent`):
  - **🎫 Novo Ticket** (abertura): número, linha, solicitante, data, status da linha e os campos dinâmicos (resolvidos do `FormSchema`).
  - **🔧 Em Atendimento** (início): enxuto — técnico, data em que assumiu, solicitante.
  - **✅ Atendimento Encerrado** (resolução): técnico, data de encerramento, duração do atendimento (`FinishedAt − StartedAt`) e solicitante.
- **Roteamento por departamento:** `SendAsync` resolve o webhook pelo **nome do departamento** do ticket no mapa `GoogleChat:DepartmentWebhooks`. Cada departamento cai no seu próprio grupo; departamento **sem entrada no mapa não envia card** (no-op).
- Chamado pelo `TicketsController` após `SaveChanges` (na criação, no `start` e no `resolve`), **fire-and-forget**: a falha é logada e nunca quebra a resposta. Sem evento/migration novos.
- As URLs de webhook são segredo e vêm por **configuração** (placeholder no `appsettings`); o backend precisa de saída HTTPS para `chat.googleapis.com`. Ver [ENVIRONMENT.md](ENVIRONMENT.md).

---

## 3. Frontend

### 3.1 Organização (feature-based)

```
src/
├── pages/        # componentes de rota (14)        — admin/, analytics/, auth/, checklists/, tickets/
├── components/   # 63 componentes por feature       — admin/, analytics/, dynamic-form/, tickets/, layout/, ui/...
├── hooks/        # 41 hooks customizados            — TODA a lógica de negócio do front mora aqui
├── services/     # HTTP (Axios), alertas, mappers
├── helpers/      # formHelpers, fieldTreeHelpers, datas, charts
├── types/        # models.types, api.types, ui.types (barrel index.ts)
├── constants/    # endpoints, storage keys, menus, ícones
└── theme.ts      # tema Chakra (dark mode padrão)
```

Princípio central: **componentes JSX só renderizam**; estado, efeitos e regras ficam nos hooks (`useFormBuilder`, `useTicketSubmission`, `useDepartmentBuilder`...).

### 3.2 Roteamento

| Rota | Página | Acesso |
|---|---|---|
| `/login` | Login (usuário + card kiosk) | pública |
| `/` | ActionsPanel — cards de departamentos | privada |
| `/actions/:departmentId/new` | DynamicTicketForm — abertura de ticket | privada |
| `/tickets/board` | TicketBoard (grid/tabela, realtime) | privada |
| `/ticket-history` | Histórico com filtros | privada |
| `/checklists` | Checklists pendentes/recebidos | privada |
| `/analytics/downtime-geral` | Dashboard live | privada |
| `/analytics/downtime-historico` | Dashboard histórico (date-range) | privada |
| `/cockpit-admin` | Cockpit administrativo (stats + ações) | privada (UI admin) |
| `/cockpit-admin/production-lines` · `/prefixes` | CRUDs | privada (UI admin) |
| `/cockpit-admin/department-builder` · `/department-editor` | Construtor/editor de departamentos | privada (UI admin) |
| `/cockpit-admin/checklist-builder` | Construtor de checklists | privada (UI admin) |
| `/cockpit-admin/heatmap-builder` | Painel de Calor Andon das linhas (conectores + board) | privada (UI admin) |
| `/cockpit-admin/heatmap-lines` | Painel Heatmap das linhas (treemap por downtime) | privada (UI admin) |

`PrivateRoute` valida autenticação via `useAuth()` e redireciona para `/login`. O **enforcement real** de permissão é do backend (policies) — a UI apenas esconde o que o usuário não pode usar.

### 3.3 Camada HTTP e estado

- Instância Axios única (`services/api/api.ts`): `baseURL` de `VITE_API_BASE_URL`; request interceptor injeta `Authorization: Bearer` e `X-Plant-Id`; response interceptor trata `401` (limpa storage → `/login`).
- **Sem state manager global** (decisão registrada — ADR-003): os 3 valores globais vivem no `localStorage` e os interceptors resolvem a injeção. Chaves: `ticket_system_auth_token`, `ticket_system_active_plant`, `ticket_user`, `ticket_system_kiosk`, `ticket_system_kiosk_view`, `ticket_system_kiosk_departments`, `ticket_system_sound_alert_*`.
- Realtime: hooks dedicados conectam aos hubs com `accessTokenFactory` (token via query) e reconexão automática.

### 3.4 Formulários dinâmicos (server-driven)

O `formSchema` do departamento é um **array plano** de `FormFieldSchema`:

```typescript
interface FormFieldSchema {
  id: string;            // slug do label — único garantido (ensureUniqueId)
  uid?: string;          // identificador estável — usado SÓ como React key
  type: FormFieldType;   // text | textarea | select | card_radio | dynamic_location | line_stop | setup_material | ...
  label: string;
  required?: boolean;
  options?: FormFieldOption[];
  dependsOn?: { field: string; value: string | string[] };  // condicional — escalar OU multivalor
  templateId?: number;   // proveniência de preset (FieldTemplate)
}
```

- **Renderização progressiva**: `computeProgressiveFields(fields, answers)` filtra os campos visíveis conforme as respostas; `matchesDependency` casa valor escalar (`===`) ou lista (`includes`).
- **Tipos especiais singleton** (id fixo): `dynamic_location` (seletor de linha de produção), `line_stop` (linha parada? + tempo), `setup_material`.
- A obrigatoriedade de Linha de Produção no submit existe **apenas** se um campo `dynamic_location` está visível; caso contrário o ticket vai com `productionLineId: null` (linha é opcional ponta a ponta desde a v2.0.0).
- Performance: `React.memo` por campo com comparador por valor próprio (`areDynamicFieldPropsEqual`), `useMemo`/`useCallback` nos pontos quentes — preview e formulários grandes não travam.

### 3.5 Construtor de formulários em árvore

A **árvore é uma projeção** dos `dependsOn` em tempo de edição — o schema persistido continua sendo o array plano, e renderer/backend não mudam:

- `buildFieldTree(fields)` — raiz = campos sem dependência; filhos agrupados por opção do card pai; recursivo; ramos órfãos preservados e marcados. Campos multivalor aparecem sob **cada** ramo amarrado.
- `flattenFieldTree(tree)` — serializa de volta em **ordem topológica** (pai antes do filho — invariante do sistema), com dedupe por `uid` para campos multivalor.
- `canonicalizeFields = flatten(build(...))` — normalização lossless.
- Edição: acordeão recursivo por card/opção, drag-reorder, remoção em cascata (`collectFieldAndDescendants`), cascata de renomeação (renomear pai reescreve `dependsOn.field` dos filhos).
- **Presets** (`FieldTemplate`): tipo nomeado reutilizável por planta. Modelo **fábrica** — usar um preset copia a config e marca `templateId`; editar/excluir o preset não afeta campos já criados.

### 3.6 Modo kiosk (front)

- Card próprio na tela de login (ou URL `/login?key=...&plant=...&name=...`).
- `useKioskAuth` chama `POST /api/auth/kiosk` com a device key → token de longa duração com role `kiosk-display`; grava flag `ticket_system_kiosk` e navega para `/tickets/board`.
- UI esconde ações de gestão; o backend reforça read-only por middleware (ver [SECURITY.md](SECURITY.md#modo-kiosk)). O `KioskAccessMiddleware` isenta `/api/auth` do bloqueio read-only (senão a própria reativação do kiosk, que vai autenticada pelo interceptor, seria barrada com 403).
- **Seletor de painel + controle unificado:** além do board, o kiosk alterna entre os painéis **Andon** e **Heatmap** (mesmas visualizações do Cockpit, sem o chrome de admin). Os controles ficam num único menu (`KioskControlMenu`) na ordem **escolher painel → alerta sonoro → sair**; a escolha persiste em `ticket_system_kiosk_view` (`useKioskView`).
- **Alerta sonoro por departamento:** na ativação, o kiosk pode ser escopado a um ou mais departamentos (multi-seleção no card de login, populada por `GET /api/departments/public`, ou via query `?departments=1,3` na URL da TV). Os ids ficam em `ticket_system_kiosk_departments` e `useTicketNotifications` toca o alerta só para eles; sem seleção, mantém o padrão de ouvir todos. Escopo puramente client-side (o hub já é por planta) — não altera a auth device-key nem a expiração longa do kiosk.

### 3.7 Painel de Calor Andon das linhas

Página `HeatmapBuilder` (rota `/cockpit-admin/heatmap-builder`), acessível pelo card da seção **Analytics** do Cockpit. Duas abas (pílula deslizante neon, mesmo padrão dos demais toggles):

- **Mapa de Calor** — `BoardCanvas`: grid centralizado de `LineCard` sobre fundo quadriculado, com botão de tela cheia (Fullscreen API) para exibição em TVs. Cada card tem tamanho fixo, mostra prefixo/linha e o nº de tickets em aberto, e muda de cor por volume: **verde (0) → amarelo (1) → laranja (2–3) → vermelho (4+)**, com pulso e brilho neon (`box-shadow` animado em `var(--glow)`) quando há chamado aberto.
- **Conectores** — `ConnectorManager`: adiciona/remove conectores (fonte "Linhas de Produção" + escopo "todas" ou por prefixo). A lista de cards é **automática** — não há posicionamento manual nem caixa de seleção por card.
- Estado e dados em `useHeatmapBoard` (lógica fora do JSX): carrega conectores + board + prefixos; refaz o `GET /board` ao receber o evento `TicketCreated` (window event reaproveitado de `useTicketNotifications`).

### 3.8 Painel Heatmap das linhas

Página `LineHeatmapPanel` (rota `/cockpit-admin/heatmap-lines`), card próprio na seção **Analytics** do Cockpit. Treemap das linhas inspirado no heatmap de ações do TradingView, voltado também a exibição em TV.

- **Layout** — treemap squarificado em 2 níveis (`helpers/treemap.ts`): grupos por prefixo, e dentro de cada grupo um bloco por linha com **área proporcional ao `openCount`** (linha sem ticket recebe peso mínimo → bloco pequeno, não some). `HeatmapTreemap` mede o contêiner via `useElementSize` (ResizeObserver) e posiciona os blocos absolutos; `HeatmapTile` (memo) escala a fonte pelo tamanho do bloco.
- **Conectores próprios** — toggle Mapa de Calor | Conectores; a aba Conectores reaproveita o `ConnectorManager` gerenciando os conectores do painel Heatmap (independentes do Andon).
- **Cor** — `helpers/heatmapColor.ts`: escala sequencial verde→amarelo→vermelho→vermelho crítico interpolada por minuto de downtime (joelho 8 min, teto 16 min). `HeatmapLegend` mostra a barra de gradiente.
- **Dados/realtime** — `useLineHeatmap` (lógica fora do JSX): `GET /plant-connectors/heatmap`; refetch no evento `TicketCreated` + a cada 30 s; tick de 1 s recolore os blocos ao vivo a partir do `oldestOpenStoppedAt`.
- **TV** — botão de tela cheia (Fullscreen API), mesmo padrão do Andon.

### 3.9 Responsividade mobile

O front se adapta aos tamanhos de tela sem segundo sistema visual (breakpoints Chakra). **Escopo:** telas de operador/técnico; **Cockpit Admin e construtores ficam fora** (uso desktop por devs/admins).

- **Sidebar → drawer:** `md+` usa a sidebar fixa (hover); no mobile um hambúrguer abre um `Drawer` com o mesmo menu (`SidebarMenuList` extraído e reutilizado). Os ícones de planta e som migram para o rodapé do drawer no mobile.
- **`100dvh`** (não `vh`) no shell do `Layout` — corrige footer cortado pela barra dinâmica do navegador mobile.
- **Listas de pílulas** (filtros por departamento): `overflowX="auto"` + itens `flexShrink={0}`/`whiteSpace="nowrap"`; tabelas em `TableContainer`; padding/colunas por breakpoint; estados vazios centralizados.

### 3.10 Notificações sonoras e e-ticket (Google Chat)

- **Som por departamento:** `useTicketNotifications` toca o alerta de novo ticket **apenas** quando o `departmentId` do evento `TicketCreated` está entre os departamentos que o usuário atende (roles do usuário ∩ `allowedRoles`, resolvido em `helpers/notificationScope.ts`); `admin` ouve todos. O `kiosk-display` ouve todos por padrão, mas pode ser **escopado por departamento** na ativação (ver §3.6) — quando escopado, toca só os departamentos escolhidos. A atualização do board (refetch) permanece global.
- **E-ticket → Google Chat:** ao abrir o ticket o `TicketSuccessModal` exibe a imagem gerada (html2canvas) e um aviso de que o sistema **enviou o card automaticamente ao Google Chat** (envio é server-side — ver §2.10).

### 3.11 Cockpit — seção Analytics

Os painéis ficam como cards na seção **Analytics** do Cockpit (`CockpitAdminDashboard`): Andon, Heatmap e os atalhos **Downtime Live** e **Downtime Histórico** (rotas `/analytics/downtime-geral` e `/analytics/downtime-historico`). Grid de 4 cards por linha.

---

## 4. Decisões de arquitetura (resumo)

| Decisão | Racional |
|---|---|
| Clean Architecture no backend | Regras de negócio testáveis fora do HTTP; controllers finos; DTOs como contrato |
| JWT local + AccessControl externo | Fonte única de identidade externa; backend stateless; AccessControl só é consultado no login |
| localStorage sem state manager | 3 valores globais que mudam só no login/logout; interceptors resolvem a injeção; zero dependência extra |
| Kiosk como identidade de dispositivo | Token longo só para a TV (read-only + planta fixa + IP allowlist) sem afrouxar a expiração dos usuários |
| Árvore = projeção sobre `dependsOn` | Zero mudança de schema/renderer/backend; formulários antigos continuam válidos |
| Preset = cópia (fábrica), não vínculo vivo | Excluir/editar preset nunca quebra formulários existentes |
| `uid` separado do `id` | React key estável sem abrir mão do `id` legível usado por integrações |
| snake_case no banco | Convenção MySQL; aplicada via `EFCore.NamingConventions` + migration de rename |
| Conector como entidade (`PlantConnector`) | Painel Andon liga fontes de linha de forma persistente/multi-fonte, sem desenho manual nem coordenadas |
| Painel Andon por refetch no evento | Reaproveita o `TicketCreated` existente; o board recalcula via `GET /board` (contagem server-side) sem novo evento/payload |
| Heatmap: cor calculada no front a partir do timestamp | Servidor entrega `oldestOpenStoppedAt`; o front interpola a cor e recolore a cada 1 s sem martelar a API — o vermelho intensifica suave |
| Heatmap: escala sequencial (não divergente) | Downtime só tem um sentido (0 = bom, mais tempo = pior); leitura instantânea na TV |
