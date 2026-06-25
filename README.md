# SDUI Ticket System

> Sistema de gestão de chamados (tickets) e downtime industrial com UI server-driven. **v2.0.0**

Monorepo com as duas aplicações do sistema:

| Pasta | Aplicação | Stack | Porta dev / prod |
|---|---|---|---|
| [`backend/`](backend/) | API REST + SignalR | ASP.NET Core 8 · EF Core (MySQL) · Clean Architecture | `5029` / `8084` |
| [`frontend/`](frontend/) | SPA | React 19 · TypeScript · Vite · Chakra UI | `5173` / `8085` |

## Documentação

- [Visão geral do sistema](backend/README.md)
- [Arquitetura](backend/docs/ARCHITECTURE.md) — camadas, domínio, endpoints, SignalR, formulários dinâmicos
- [Segurança](backend/docs/SECURITY.md) — autenticação, policies, multi-tenant, kiosk
- [Ambiente e deploy](backend/docs/ENVIRONMENT.md) — como rodar localmente, Docker, CI/CD, troubleshooting
- [Frontend](frontend/README.md)

## Quick start

```bash
# Banco (MySQL 8 em Docker)
cd backend/TicketSystem.API && docker-compose up -d

# API (migra e seeda sozinha)
dotnet run                # http://localhost:5029/swagger

# Front
cd frontend && npm install && npm run dev   # http://localhost:5173
```

## Fluxo de contribuição

Branch própria + merge request para a `admin`. Cada aplicação mantém seu próprio `Dockerfile`, `docker-compose.prod.yaml` e `.gitlab-ci.yml` dentro da sua pasta.
