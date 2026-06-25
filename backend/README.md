# Ticket System

> Sistema de gestão de chamados (tickets) e downtime industrial para linhas de produção. **v2.0.0**

Quando algo para ou apresenta problema em uma linha de produção, um operador abre um chamado. Um técnico do departamento responsável assume, resolve e registra o que foi feito. O sistema mede tempo de resposta e de resolução, alimentando dashboards de eficiência operacional em tempo real e históricos.

---

## Repositórios

| Repositório | Stack | Porta dev | Porta prod |
|---|---|---|---|
| **ticket-system-backend** (este) | ASP.NET Core 8 · EF Core (Pomelo MySQL) · SignalR · QuestPDF | `5029` | `8084` |
| **ticket-system-frontend** | React 19 · TypeScript · Vite · Chakra UI | `5173` | `8085` |

---

## Principais funcionalidades

- **UI server-driven** — departamentos, formulários de abertura de ticket e checklists são definidos por schemas JSON no banco e renderizados dinamicamente pelo frontend. Novos formulários entram em produção **sem redeploy**.
- **Construtor de formulários em árvore** — o admin monta formulários com ramificação condicional por opção de card (`dependsOn`, com amarração a uma ou várias opções), tipos de campo customizados reutilizáveis (presets) e preview ao vivo.
- **Ciclo de vida de tickets** — `Open → InProgress → Resolved`, com transições irreversíveis, validação de permissão por departamento e feedback de resolução.
- **Checklists com gatilho** — templates de checklist vinculados a departamento + campo/valor do formulário; ao resolver um ticket que casa com o gatilho, o checklist é gerado automaticamente para o monitor preencher. Exportável em PDF (QuestPDF).
- **Analytics de downtime** — dashboard ao vivo (buckets temporais, turnos `adm`/`t2`) e histórico (agrupamento por minuto/hora/dia/semana/mês), com séries de volume, resposta, resolução e downtime.
- **Tempo real (SignalR)** — novos tickets notificam o board e os kiosks instantaneamente (`/hubs/tickets`); mudanças de checklist notificam o usuário dono (`/hubs/checklists`).
- **Modo kiosk para TVs** — token de dispositivo de longa duração, somente leitura, escopado a uma planta e com allowlist de IP, para dashboards permanentes no chão de fábrica.
- **Multi-planta (multi-tenant)** — todos os dados pertencem a uma `Plant`; o contexto ativo viaja no header `X-Plant-Id` e é validado por middleware. Usuários comuns ficam restritos à sua planta; `admin` alterna livremente.

---

## Stack

| Camada | Tecnologia |
|---|---|
| API | ASP.NET Core 8, Clean Architecture / DDD |
| ORM | EF Core + Pomelo MySQL 9, snake_case naming convention |
| Banco | MySQL 8.0 |
| Auth | JWT próprio + AccessControl API (identidade externa centralizada) |
| Realtime | SignalR (WebSocket) |
| PDF | QuestPDF (licença Community) |
| Frontend | React 19, TypeScript strict, Vite 7, Chakra UI 2, Recharts, Axios, @microsoft/signalr |
| Infra | Docker multi-stage, Nginx (front), CI/CD |

---

## Documentação

| Documento | Conteúdo |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Arquitetura completa: camadas do backend, modelo de domínio, endpoints, SignalR, analytics, arquitetura do frontend, formulários dinâmicos e construtor em árvore |
| [docs/SECURITY.md](docs/SECURITY.md) | Autenticação, autorização (policies e roles), multi-tenancy, modo kiosk, superfícies anônimas, gestão de secrets e considerações conhecidas |
| [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md) | Pré-requisitos, passo a passo para rodar localmente (Docker + migrations + seeds), perfis de ambiente (local/prod), build, deploy e troubleshooting |

---

## Quick start

```bash
# 1. Banco (MySQL 8 em Docker, porta 3307)
cd TicketSystem.API
docker-compose up -d

# 2. Backend (migra e seeda automaticamente no startup)
dotnet run
# API:     http://localhost:5029
# Swagger: http://localhost:5029/swagger

# 3. Frontend (no repo ticket-system-frontend)
npm install
npm run dev
# App: http://localhost:5173
```

Passo a passo detalhado, perfis de ambiente e troubleshooting: [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md).

---

## Convenções de código

- **Sem comentários** no código, salvo diretivas funcionais (`eslint-disable`, `@ts-expect-error`, magic comments).
- **`any` proibido** no frontend (única exceção: `NewAnimatedIcons.tsx`). TypeScript em modo `strict` com `noUnusedLocals`/`noUnusedParameters`.
- **Lógica em hooks/services** — componentes JSX apenas renderizam.
- **Barrel `index.ts`** por módulo de tipos.
- Backend segue Clean Architecture: controllers finos, regra de negócio em services e métodos de domínio nos models.

## Fluxo de contribuição

Trabalho em **branch própria** + **merge request** para a `admin`. Nunca push direto na `admin` — o pipeline de CI builda e faz deploy a partir dela.

```
Stage 1 (build)  → docker build + push para o registry
Stage 2 (deploy) → docker compose -f docker-compose.prod.yaml up -d no servidor
```
