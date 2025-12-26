# Project Gym

Monorepo com 3 aplicações: API (Fastify + Prisma), Web (Next.js) e Desktop (Electron + Next.js).

## Estrutura

- `api/` API REST (Node.js, Fastify, Prisma + SQLite)
- `app-web/` App web (Next.js)
- `app-desktop/` App desktop (Electron + Next.js)

## Requisitos

- Node.js 20+
- pnpm (recomendado) ou npm

## Como rodar

### API

```bash
cd api
pnpm install
pnpm start:dev
```

### Web

```bash
cd app-web
pnpm install
pnpm dev
```

### Desktop

```bash
cd app-desktop
pnpm install
pnpm dev
```

## Variaveis de ambiente (API)

Crie `api/.env` baseado em `api/.env.example`.

Principais chaves:

- `PORT` (default: 3333)
- `JWT_SECRET` (default: api-gym-monster-nodejs)
- `CORS_ORIGINS` (default: http://localhost:3000)
- `APP_URL` (default: http://localhost:3333)
- `UPLOAD_DIR` (default: uploads)

## Funcionalidades principais (API)

- Autenticacao JWT
- Usuarios (criar, atualizar, trocar senha, avatar)
- Alunos (CRUD + foto)
- Planos (CRUD)
- Contratos (criar, listar por aluno)
- Treinos (categorias, treinos, atribuicoes)

## Scripts principais

- `api/` `start:dev`, `test`, `test:unit`, `test:e2e`, `studio`
- `app-web/` `dev`, `build`, `start`
- `app-desktop/` `dev`, `dev:web`, `electron`
