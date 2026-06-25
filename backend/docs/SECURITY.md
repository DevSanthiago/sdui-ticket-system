# Ticket System — Segurança

> Autenticação, autorização, isolamento multi-tenant, modo kiosk, superfícies anônimas e gestão de secrets.
> Documentos relacionados: [README](../README.md) · [Arquitetura](ARCHITECTURE.md) · [Ambiente e Deploy](ENVIRONMENT.md)

---

## 1. Autenticação

### 1.1 Fluxo de login (usuários)

O Ticket System **não possui banco de usuários próprio**. A identidade vem do **AccessControl API** (provedor externo centralizado de usuários e roles); o Ticket System valida credenciais lá e emite um **JWT próprio**:

```
1. Frontend         POST /api/auth/login { registration, password }
2. ExternalAuthService → POST {AccessControl}/access-control/api/v1/auth
3. AccessControl    valida credenciais, retorna dados do usuário
4. ExternalAuthService → busca roles do usuário no AccessControl
5. Backend          emite JWT interno assinado (Jwt:Key) com as claims
6. Frontend         armazena o token e o envia em todas as requisições
```

**Claims do JWT interno:** `UserId`, `Name`, `Registration`, `Department`, `PlantId` e uma claim `Role` por role do usuário.

**Propriedades importantes:**
- O AccessControl **não é consultado de novo durante a sessão** — o JWT é validado localmente (issuer, audience, lifetime, assinatura simétrica).
- Expiração configurável (`Jwt:ExpireHours`). Tokens de usuário são curtos; apenas o kiosk recebe token longo.
- Se o AccessControl cair: logins novos falham; sessões ativas seguem funcionando.

### 1.2 Autenticação do WebSocket (SignalR)

WebSocket não envia header `Authorization`. O cliente SignalR manda o JWT como query string `access_token`, e o backend o aceita **apenas** para os paths `/hubs/tickets` e `/hubs/checklists` (`JwtBearerEvents.OnMessageReceived`). Implicação operacional: o reverse proxy **não pode descartar a query string** ao rotear `/hubs/`.

### 1.3 Validação de sessão

`GET /api/auth/validate` — confirma o token e retorna `canManageTickets` calculado a partir das roles (usado pelo front para montar a UI).

---

## 2. Autorização

### 2.1 Policies

| Policy | Regra | Protege |
|---|---|---|
| `CanManageSystem` | exige role `admin` | todo o cockpit administrativo: criar/editar departamentos, field templates, checklist templates, linhas, prefixos |
| `CanManageTickets` | `TicketAccessPolicy.CanManage(roles)` | assumir (`start`), resolver (`resolve`) e dar feedback em tickets |

### 2.2 TicketAccessPolicy (blocklist de visualização)

Modelo de **blocklist**: roles "somente visualização" não gerenciam tickets; qualquer outra role gerencia.

- Roles view-only: papéis sem permissão de gestão (somente leitura) e `kiosk-display`.
- Normalização antes da comparação: remove caracteres não alfanuméricos e minusculiza (`Production-Operator` ≡ `productionoperator`).
- `CanManage` retorna `true` se **qualquer** role do usuário estiver fora da blocklist.

### 2.3 Autorização por departamento (camada de domínio)

Além da policy, **assumir um ticket** passa por `Department.CanBeManagedBy(userRoles)`: a role precisa estar em `AllowedRoles` do departamento (ou ser `admin`). Defesa em profundidade — um engenheiro de teste não assume ticket de automação mesmo passando na policy. Violações lançam `DomainException`.

### 2.4 Resumo de superfícies por nível de acesso

| Nível | O que pode |
|---|---|
| Anônimo | login, login kiosk, listar plantas (ver §5) |
| Autenticado (qualquer role) | listar/criar tickets, ver board e histórico, checklists próprios, analytics, listar cadastros |
| Roles fora da blocklist + `AllowedRoles` do depto | assumir/resolver/feedback de tickets |
| `admin` | tudo + cockpit administrativo + alternar plantas |
| `kiosk-display` | somente leitura (enforced por middleware) + hub de tickets |

---

## 3. Multi-tenancy — PlantAccessMiddleware

Isolamento por planta validado a cada requisição:

- **Isenções:** `/api/plants` e `/api/auth` passam direto (necessários antes do contexto existir).
- Usuário autenticado **não-admin**: se o header `X-Plant-Id` vier preenchido e **divergir** da claim `PlantId` do token → `403` ("Somente administradores podem alternar entre filiais").
- `admin`: alterna plantas livremente via header.
- Nos hubs, o agrupamento por `plant-{plantId}` usa a claim (admin pode sobrescrever via query) — eventos de uma planta não vazam para outra.

---

## 4. Modo kiosk

Identidade de **dispositivo** para TVs de chão de fábrica (dashboards permanentes, sem operador para relogar). Três pilares:

### 4.1 Emissão dedicada
`POST /api/auth/kiosk` recebe a **device key** (`Kiosk:ApiKey` na configuração) e devolve JWT com identidade nomeada, role `kiosk-display`, `PlantId` fixo e expiração longa própria (`Kiosk:ExpireHours`). Sem a device key, ninguém emite. Revogação: rotacionar `Kiosk:ApiKey` e/ou `Jwt:Key`.

### 4.2 Read-only enforced — KioskAccessMiddleware
Para a role `kiosk-display`:
- Qualquer método **fora de GET/HEAD/OPTIONS** → `403` (exceção única: `/hubs/tickets`, necessário para o handshake do SignalR).
- A role também está na blocklist do `CanManageTickets` e fora do `CanManageSystem` — defesa em camadas.
- O frontend kiosk esconde as ações de gestão, mas o **enforcement é do backend**.

### 4.3 Allowlist de IP
Se `Kiosk:AllowedIps` estiver populado, o middleware valida o IP de origem (IPs exatos ou faixas CIDR; normaliza IPv4-mapped-IPv6). Fora da lista → `403`. Atrás de proxy, exige `ForwardedHeaders` corretos (já habilitados no `Program.cs`) e repasse de `X-Forwarded-For` pelo Nginx.

> Token de longa duração é credencial permanente: proteger o dispositivo; a allowlist de IP é o controle compensatório principal.

---

## 5. Superfícies anônimas (mapeamento exato)

| Endpoint | Status | Justificativa / observação |
|---|---|---|
| `POST /api/auth/login` | `[AllowAnonymous]` | login |
| `POST /api/auth/kiosk` | `[AllowAnonymous]` | login de dispositivo — protegido pela device key |
| `GET /api/plants` | `[AllowAnonymous]` | alimenta o seletor de planta nas telas de login/kiosk; expõe apenas nome/slug das plantas ativas |
| `GET /api/tickets-history` | ⚠️ **sem `[Authorize]`** | o controller não possui atributo de autorização — o histórico de tickets (incl. respostas dinâmicas) é acessível **sem token**. Ponto de atenção conhecido: avaliar adicionar `[Authorize]` (o frontend já envia token; o impacto é só fechar acesso direto) |

---

## 6. Gestão de secrets e configuração

| Secret | Onde vive | Observações |
|---|---|---|
| `Jwt:Key` (assinatura dos tokens) | `appsettings.json` | rotacionar invalida todas as sessões (incl. kiosk) |
| `Kiosk:ApiKey` (device key) | `appsettings.json` | rotacionar derruba a emissão de novos tokens kiosk |
| ConnectionString do MySQL | `appsettings.json` / `appsettings.Production.json` | usuário de serviço com privilégios mínimos (CRUD no schema do app) |
| Credenciais do registry / deploy | variáveis de CI  | nunca no repositório |

**Política do repositório:** `.gitignore` exclui `appsettings.json`, `appsettings.*.json` e `.env` — **nenhum secret é versionado**. Em produção, o `appsettings.json` real é montado como volume **read-only** no container (ver [ENVIRONMENT.md](ENVIRONMENT.md)). O mesmo vale para o `.env` do frontend.

---

## 7. CORS

Política `AllowFrontend`: origem dinâmica liberada (`SetIsOriginAllowed(_ => true)`) com credenciais, qualquer método/header. Adequado para intranet + necessidade do SignalR com credenciais; em endurecimento futuro, restringir à(s) origem(ns) do frontend.

---

## 8. Considerações conhecidas (trade-offs aceitos)

1. **JWT em `localStorage`** — acessível por JavaScript (XSS rouba token). Aceito para intranet industrial; alternativa seria cookie `httpOnly` + proteção CSRF.
2. **Revogação não-imediata** — JWT stateless: usuário desligado mantém sessão até o token expirar. Mitigação: expiração curta para usuários; rotação de chave em incidente.
3. **Roles congeladas no login** — mudança de role no AccessControl só reflete no próximo login.
4. **`GET /api/tickets-history` anônimo** — ver §5; candidato a `[Authorize]` em hardening.
5. **CORS aberto** — ver §7.
6. **AccessControl como dependência crítica do login** — indisponibilidade impede novos logins (sessões ativas seguem).
