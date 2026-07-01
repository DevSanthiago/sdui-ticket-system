# Ambiente — Ticket System

> Configuração de **desenvolvimento local**. Este projeto é um portfólio de arquitetura; não há infraestrutura de produção documentada aqui.

## Pré-requisitos

- .NET SDK 8.0+
- Node.js 20+
- Docker (para o MySQL local) — ou um MySQL 8 já instalado

## Banco de dados (local)

`docker-compose.yml` (em `backend/TicketSystem.API/`) sobe um MySQL 8:

| Item | Valor |
|---|---|
| Container | `ticketsystem-db` |
| Database | `ticketsystem_db` |
| Porta (host) | `3307` |
| Usuário / senha | `ticketuser` / `ticketpassword` (dev) |

```bash
cd backend/TicketSystem.API
docker-compose up -d
```

A connection string fica em `appsettings.json` (`ConnectionStrings:DefaultConnection`). As migrations são aplicadas no startup.

## Configuração (`appsettings.json`)

Todos os valores sensíveis vêm como **placeholders** — preencha para rodar:

| Chave | Para quê |
|---|---|
| `Jwt:Key` | chave de assinatura do JWT (mín. 32 caracteres) |
| `Jwt:Issuer` / `Jwt:Audience` | issuer/audience do token interno |
| `Kiosk:ApiKey` | device key do modo kiosk (TV) |
| `AccessControlAPI:BaseUrl` | URL de um provedor de identidade externo (login delegado) — aponte para o seu |
| `GoogleChat:DepartmentWebhooks` | mapa de webhooks do Google Chat **por departamento** (chave = nome do departamento) que recebem os cards do ciclo de vida do ticket |

> **Integração Google Chat (opcional):** em cada transição de status do ticket (abertura, início e encerramento), o backend posta um card (cardsV2) no Google Chat. O envio é **roteado por departamento**: o webhook é escolhido pelo nome do departamento do ticket no mapa `GoogleChat:DepartmentWebhooks`. É **fire-and-forget** — departamento sem entrada no mapa só não envia, sem quebrar a operação do ticket. O backend precisa de saída HTTPS para `chat.googleapis.com`. As URLs são segredo (placeholder no `appsettings`). Exemplo:
>
> ```json
> "GoogleChat": {
>   "DepartmentWebhooks": {
>     "Nome do Departamento": "https://chat.googleapis.com/v1/spaces/<SPACE>/messages?key=<KEY>&token=<TOKEN>"
>   }
> }
> ```

## Rodar

```bash
# Backend (http://localhost:5029, Swagger em /swagger no Development)
cd backend/TicketSystem.API
dotnet run

# Frontend (http://localhost:5173)
cd frontend
npm install
npm run dev
```

## Observação

A UI é **server-driven**: departamentos, formulários e checklists são definidos por schemas no banco. O projeto sobe **sem dados** — cadastre departamentos/linhas/formulários pelo Cockpit Administrativo após o primeiro login.
