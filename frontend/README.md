# Ticket System — Frontend

> SPA do sistema de gestão de chamados e downtime industrial. **v2.0.0**
> A documentação completa do sistema (arquitetura, segurança, ambiente/deploy) vive no repositório **ticket-system-backend**, em `README.md` e `docs/`.

Interface em React 19 + TypeScript (strict) + Vite + Chakra UI (dark mode). Consome a API do **ticket-system-backend** e renderiza formulários, departamentos e checklists **dinamicamente a partir de schemas JSON** vindos do banco — mudanças de formulário não exigem redeploy.

---

## Stack

| Tecnologia | Uso |
|---|---|
| React 19 + TypeScript 5.9 (strict) | UI |
| Vite 7 | build/dev server |
| Chakra UI 2 + Emotion + Framer Motion | componentes, tema dark, animações |
| React Router 7 | rotas SPA |
| Axios | HTTP com interceptors (Bearer + `X-Plant-Id`, logout em 401) |
| @microsoft/signalr | tempo real (board de tickets, checklists) |
| Recharts | dashboards de analytics |
| SweetAlert2, html2canvas, react-date-range, date-fns | alertas, recibo de ticket, filtros de período |

## Organização

```
src/
├── pages/        # componentes de rota — tickets, analytics, admin, auth, checklists
├── components/   # por feature — admin/ (builders), dynamic-form/ (renderer), tickets/, analytics/, layout/
├── hooks/        # TODA a lógica de negócio (41 hooks) — componentes só renderizam
├── services/     # api.ts (Axios + interceptors), alertas, mappers
├── helpers/      # formHelpers (renderização progressiva), fieldTreeHelpers (construtor em árvore)
├── types/        # models / api / ui — barrel index.ts; `any` proibido (exceção única: NewAnimatedIcons.tsx)
└── constants/    # endpoints, storage keys, menus
```

## Painel de Calor Andon das linhas

Em `/cockpit-admin/heatmap-builder` (card na seção **Analytics** do Cockpit). Painel ao vivo das linhas de produção como cards que reagem ao volume de tickets em aberto.

- Aba **Conectores** (`ConnectorManager`): liga fontes de linha (todas as linhas da planta ou por prefixo). As linhas viram cards **automaticamente** — sem desenho nem seleção manual.
- Aba **Mapa de Calor** (`BoardCanvas` + `LineCard`): grid sobre fundo quadriculado, botão de tela cheia para TVs. Cor por volume — verde (0) → amarelo (1) → laranja (2–3) → vermelho (4+) — com pulso/brilho neon quando há chamado aberto.
- Lógica em `useHeatmapBoard` (serviço `plantConnectorsService`); atualização em tempo real refazendo `GET /plant-connectors/board` ao receber o evento `TicketCreated` (window event de `useTicketNotifications`).

## Painel Heatmap das linhas

Em `/cockpit-admin/heatmap-lines` (card próprio na seção **Analytics**). Treemap das linhas inspirado no heatmap de ações do TradingView, também pensado para TV.

- **Área** de cada bloco = volume de tickets em aberto da linha (linha sem ticket vira bloco mínimo); **cor** = tempo de linha parada (downtime). Agrupado por prefixo. Mostra **todas as linhas** dos conectores.
- Cor é escala **sequencial** verde→amarelo→vermelho→vermelho crítico (joelho em 8 min, teto em 16 min) — `helpers/heatmapColor.ts`. Treemap squarificado em `helpers/treemap.ts`; medição via `useElementSize` (ResizeObserver).
- **Conectores próprios** (independentes do Andon): toggle Mapa de Calor | Conectores; a aba Conectores reusa o `ConnectorManager` com `panel=Heatmap` (discriminador `PlantConnector.Panel` no backend).
- Componentes `HeatmapTreemap` / `HeatmapTile` / `HeatmapLegend` só renderizam; dados e realtime em `useLineHeatmap` (`GET /plant-connectors/heatmap`, refetch no `TicketCreated` + 30 s, tick de 1 s recolorindo ao vivo). Botão de tela cheia (Fullscreen API).

## Responsividade mobile

O app se adapta aos tamanhos de tela sem virar outro sistema visual. Escopo: telas de operador/técnico (Login, Painel de Ações, Painel de Tickets, Histórico, Checklists, Dashboards, Heatmaps). **Cockpit Admin e construtores ficam fora** (uso desktop por devs/admins).

- **Sidebar → drawer no mobile:** `md+` mantém a sidebar fixa com hover; no mobile um hambúrguer no header abre um `Drawer` com o mesmo menu (extraído em `SidebarMenuList`, reutilizado). Fecha ao navegar.
- **Header:** saudação visível no mobile (truncada com `noOfLines`); ícones de **planta** e **som** movidos para o rodapé do drawer; tema/perfil seguem no header.
- **`100dvh`** (não `vh`) no shell — corrige o footer cortado pela barra de endereço dinâmica.
- **Pílulas de departamento:** container `overflowX="auto"` + itens `flexShrink={0}` `whiteSpace="nowrap"` (tamanho real, sem sobreposição, rola na horizontal).
- **Padrões:** breakpoints do Chakra (`{ base, md, lg }`) em padding/fonte/colunas; tabelas em `TableContainer`; estado vazio com `textAlign="center"` + `maxW`.

## Como rodar

Pré-requisitos: Node 20+ e o backend rodando (`http://localhost:5029` — ver repo ticket-system-backend).

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script | Função |
|---|---|
| `npm run dev` | dev server com HMR |
| `npm run build` | `tsc -b && vite build` (mesmo do pipeline de CI) |
| `npm run lint` | ESLint |
| `npm run preview` | serve o build de produção |

**Env (Vite):** `.env.development` → `VITE_API_BASE_URL=http://localhost:5029/api` · `.env.production` → `/api` (relativo, atrás do reverse proxy).

## Deploy

- **Dockerfile** multi-stage: Node 20-alpine builda → Nginx unprivileged serve a SPA (porta interna 8080; publicada em `8085` via `docker-compose.prod.yaml`).
- **nginx.conf**: SPA routing (`try_files ... /index.html`). O roteamento de `/api` e `/hubs` (WebSocket) é do reverse proxy de host — template em `deploy/host-reverse-proxy.conf.example`.
- **CI** (branch `admin`): build da imagem (injeta `VITE_API_BASE_URL`) → push → `docker compose up -d` no servidor.

## Convenções

- Sem comentários no código (exceto diretivas funcionais); `any` proibido; lógica em hooks/services; barrel `index.ts` por módulo de tipos.
- Fluxo: branch própria + merge request para a `admin` — nunca push direto (a `admin` dispara o deploy).
