# Funcionalidades da API Gym Monster

API REST em Node/Fastify com autenticação JWT, validação com Zod e Prisma + SQLite. As rotas abaixo refletem o que está implementado hoje.

## Autenticação
- **POST /authenticate** — Autentica por `email` e `password`; retorna `{ token }` JWT com `sub`, `role`, `name`, `email`, `avatarUrl`.
- Middleware `authenticate` protege rotas sensíveis via `request.jwtVerify()`.

## Usuários
- **POST /create-user** — Cria usuário (`name`, `email`, `password`, `role: admin|trainer|staff`). Valida e bloqueia e-mail duplicado.
- **PUT /update-user/:id** — Atualiza `name`/`email` (checa duplicidade) e retorna dados públicos.
- **PATCH /change-password** (autenticado) — Troca senha com verificação da senha atual; retorna sucesso/mensagem.
- **PATCH /users/avatar** (autenticado, multipart) — Faz upload de avatar; salva arquivo em `/uploads` e retorna `avatarUrl`.

## Alunos (`/students`)
- **POST /** — Cria aluno com dados completos (nome, contato, endereço, `cpf`, `dateOfBirth`, `gender`, contatos de emergência, observação). Bloqueia e-mail e CPF duplicados.
- **GET /** — Lista todos os alunos.
- **GET /:id** — Busca aluno por ID.
- **PUT /:id** — Atualiza campos parciais (mesmas validações de e-mail/CPF).
- **DELETE /:id** — Remove aluno.
- **PATCH /:id/photo** (autenticado, multipart) — Upload de foto; salva em `/uploads/student-photos` e retorna `photoUrl`.

## Planos (`/plans`)
- **POST /** — Cria plano (`name`, `duration` em meses, `price`, `description?`, `status ACTIVE|INACTIVE`).
- **GET /** — Lista planos.
- **GET /:id** — Detalha plano.
- **PUT /:id** — Atualiza campos parciais.
- **DELETE /:id** — Remove plano; bloqueia se existir contrato associado (erro `PlanHasContracts`).

## Contratos
- **POST /contracts** — Cria contrato aluno/plano (`studentId`, `planId`, `pricePaid`, `durationMonths`, `startDate?`). Calcula `endDate`, define `status ACTIVE` e inclui dados do plano no retorno. Valida existência de aluno e plano.
- **GET /contracts/student/:studentId** — Lista contratos de um aluno (inclui `plan`).

## Treinos (`/workouts`)
- **GET /categories** — Lista categorias de treino.
- **GET /category/:categoryId** — Lista treinos de uma categoria (inclui contagem de exercícios).
- **GET /:id** — Detalha treino com exercícios ordenados.
- **POST /students/:studentId/workouts/:workoutId/assign** — Atribui treino a aluno (`notes?`).
- **GET /students/:studentId/assignments** — Lista atribuições do aluno (inclui treino e exercícios).
- **DELETE /assignments/:assignmentId** — Remove atribuição.
- **GET /:workoutId/assignments** — Lista atribuições de um treino (inclui aluno).

## Uploads e Arquivos Estáticos
- Arquivos servidos em `/uploads/**` (avatar e fotos de alunos).
- Multipart habilitado para uploads de avatar e foto de aluno.

## Modelos principais (Prisma)
- `User` (role `admin|trainer|staff`, `avatarUrl`).
- `Student` (dados pessoais/endereço + `photoUrl`).
- `Plan` (`duration`, `price`, `status ACTIVE|INACTIVE`).
- `Contract` (`startDate`, `endDate`, `status ACTIVE|PAUSED|CANCELED|EXPIRED`, `pricePaid`).
- `Payment` (modelado, ainda sem rotas).
- `WorkoutCategory`, `Workout` (com exercícios), `Exercise`, `WorkoutExercise` (ordem, séries/reps/tempo, instruções), `WorkoutAssignment` (status `PENDING|IN_PROGRESS|COMPLETED`, `notes`).

## Notas técnicas rápidas
- Validação: Zod em todas as entradas.
- Autorização: JWT em rotas sensíveis; secret estático `api-gym-monster-nodejs`.
- Uploads usam `@fastify/multipart` + armazenamento local; URLs apontam para `http://localhost:3333/uploads/...`.
- Tratamento de erros central via `ErrorHandler` do Fastify.
