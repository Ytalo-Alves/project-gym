# Project Gym

Monorepo com 3 aplicações: API (Fastify + Prisma), Web (Next.js) e Desktop (Electron + Next.js).

[![GitHub repo size](https://img.shields.io/github/repo-size/Ytalo-Alves/project-gym?style=flat-square)](https://github.com/Ytalo-Alves/project-gym)
[![GitHub last commit](https://img.shields.io/github/last-commit/Ytalo-Alves/project-gym?style=flat-square)](https://github.com/Ytalo-Alves/project-gym)
![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?style=flat-square&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-9-F69220?style=flat-square&logo=pnpm&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-5-000000?style=flat-square&logo=fastify&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square&logo=prisma&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-31-47848F?style=flat-square&logo=electron&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=flat-square&logo=sqlite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?style=flat-square&logo=vitest&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-4-3E67B1?style=flat-square&logo=zod&logoColor=white)

## Estrutura

- `api/` API REST (Node.js, Fastify, Prisma + SQLite)
- `app-web/` App web (Next.js)
- `app-desktop/` App desktop (Electron + Next.js)

## Stack por aplicação

### API

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-000000?style=flat-square&logo=fastify&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=zod&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white)

### Web

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=flat-square&logo=radix-ui&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)

### Desktop

![Electron](https://img.shields.io/badge/Electron-47848F?style=flat-square&logo=electron&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)

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
