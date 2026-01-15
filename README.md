# T3 SaaS Tasks — Full Stack (Next.js App Router + tRPC + Drizzle + Better Auth)

Aplicação full stack (estilo SaaS) com **autenticação**, **dashboard** e **gerenciamento de Tasks**, construída com:
- **tipagem forte ponta a ponta** (tRPC)
- **validação única com Zod** (mesmo schema no front e no backend)
- organização em **camadas inspiradas em Clean Architecture** (DIP/ISP)

---

## ✅ Funcionalidades do case

- **Auth (Better Auth)**: Sign Up, Sign In, Logout (email/senha)
- **Rotas protegidas**: tudo dentro de `src/app/(app)` exige sessão
- **Dashboard** com Sidebar (desktop) + **menu mobile (Sheet)**
- **CRUD completo de Tasks**
  - Tasks associadas ao usuário autenticado
  - Apenas o dono consegue **listar / editar / excluir**
- **Validação com Zod** no backend (tRPC) e no frontend (React Hook Form)

---

## 🧱 Stack

- **Next.js** (App Router) + **React**
- **TypeScript**
- **tRPC** (end-to-end type safety)
- **Drizzle ORM** + **PostgreSQL**
- **Better Auth** (credenciais + adapter Drizzle)
- **Zod** (schemas únicos)
- **Tailwind CSS**
- **shadcn/ui** (Radix + componentes)

---

## ▶️ Rodando localmente

### Pré-requisitos
- Node.js (recomendado **Node 20+**)
- pnpm (via corepack)
- Docker (recomendado para subir Postgres)

```bash
corepack enable
pnpm install
```

### 1) Subir o banco (Postgres)

**Opção A — Docker Compose (recomendado)**
```bash
docker compose up -d
```

**Opção B — script (Mac/Linux)**
```bash
./start-database.sh
```

### 2) Variáveis de ambiente

Crie um `.env` na raiz (ou copie de `.env.example`):

```env
# Drizzle
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/t3_tasks"

# Better Auth
BETTER_AUTH_SECRET="troque-por-uma-chave-forte"

# Better Auth client base URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3) Aplicar schema no DB (Drizzle)

```bash
pnpm db:push
```

### 4) Rodar o app

```bash
pnpm dev
```

Abra: `http://localhost:3000`

---

## 🧪 Scripts úteis

```bash
pnpm dev            # Next dev (turbo)
pnpm build          # build produção
pnpm start          # start produção
pnpm preview        # build + start

pnpm lint           # lint
pnpm typecheck      # typescript (noEmit)
pnpm check          # lint + typecheck

pnpm db:push        # aplica schema no banco
pnpm db:generate    # gera migrations
pnpm db:migrate     # roda migrations
pnpm db:studio      # abre Drizzle Studio
```

---

## 🗂️ Estrutura do projeto

> O objetivo é deixar **domínio desacoplado** (use cases + interfaces) e manter o framework (Next/tRPC/Drizzle) como detalhes de infraestrutura.

```txt
src/
  app/                         # Next App Router (UI + rotas)
    (auth)/                    # rotas públicas (login/register)
    (app)/                     # rotas protegidas (dashboard/tasks/users)
      _components/
        app-sidebar.tsx        # sidebar desktop + mobile (Sheet)
      dashboard/page.tsx
      tasks/
        _components/           # UI modular (SRP)
          task-create-form.tsx
          task-edit-sheet.tsx
          task-list.tsx
        _hooks/
          use-tasks-api.ts      # queries/mutations tRPC
        page.tsx               # página fina, só orquestra UI
      users/page.tsx           # placeholder
    api/
      auth/[...all]/route.ts   # Better Auth handler
      trpc/[trpc]/route.ts     # tRPC handler
  lib/
    auth-client.ts             # Better Auth client (browser-safe)
    utils.ts                   # cn() (shadcn)
  modules/
    auth/
      auth.schemas.ts          # Zod schemas de login/cadastro (front)
    tasks/
      tasks.schemas.ts         # Zod schemas (fonte única do domínio)
      domain/                  # entidades + interfaces (repository)
      application/             # use cases (regras)
      infra/                   # impl Drizzle + factory
  server/
    api/                       # tRPC routers + ctx + procedures
    better-auth/               # config (server) + getSession()
    db/                        # Drizzle db + schema
  trpc/                        # client tRPC (React)
  styles/                      # globals.css (Tailwind v4)
```

---

# 🧩 Arquitetura por camadas (Clean-ish)

## Camadas e responsabilidades

```mermaid
flowchart TB
  UI[Presentation<br/>Next Pages + Components] --> TRPC[tRPC Routers<br/>Controllers]
  TRPC --> UC[Application<br/>Use Cases]
  UC --> IRepo[Domain<br/>Interfaces]
  IRepo --> RepoImpl[Infrastructure<br/>Drizzle Repositories]
  RepoImpl --> DB[(PostgreSQL)]
```

- **UI**: renderização + forms (RHF + Zod resolver) + chamadas via hooks tRPC
- **tRPC Router**: valida input com Zod (`.input(schema)`) e aplica auth via `protectedProcedure`
- **Use Cases**: regras de negócio (ex.: criar task, editar, deletar)
- **Domain**: contratos (interfaces) e entidades
- **Infra**: implementação concreta do repo usando Drizzle
- **DB**: schema/relations em Drizzle

---

## 🔐 Segurança: “apenas o dono”

A regra é garantida **no servidor**:

- O front **não envia** `userId`.
- O `protectedProcedure` garante sessão.
- O repo executa operações com filtro **`id AND userId`**.

```mermaid
flowchart LR
  A[Request update/delete com id] --> B[protectedProcedure<br/>exige session.user]
  B --> C[Use Case recebe userId do ctx]
  C --> D[Repo executa WHERE id AND userId]
  D -->|não achou| E[NOT_FOUND]
  D -->|achou| F[Atualiza/Remove]
```

---

# 🔁 Fluxos principais

## 1) Auth (Better Auth)

```mermaid
sequenceDiagram
  participant U as Browser
  participant UI as Next.js (Auth Pages)
  participant BA as /api/auth/* (Better Auth)
  participant DB as PostgreSQL (Drizzle)

  U->>UI: Submit Login/Register (Zod + RHF)
  UI->>BA: authClient.signIn/signUp
  BA->>DB: drizzleAdapter (user/session)
  DB-->>BA: ok
  BA-->>UI: cookie/sessão
  UI-->>U: redirect /dashboard
```

> Observação: Better Auth opera naturalmente via **Route Handler**. O domínio (Tasks) fica 100% em tRPC.

---

## 2) Criar Task (tRPC + Use Case + Repo)

```mermaid
sequenceDiagram
  participant U as Browser
  participant UI as /tasks (React)
  participant TRPC as tRPC Router
  participant UC as CreateTaskUseCase
  participant R as TaskRepository (Drizzle)
  participant DB as PostgreSQL

  U->>UI: Preenche form (Zod)
  UI->>TRPC: api.task.create({title, description})
  TRPC->>TRPC: valida Zod + exige sessão
  TRPC->>UC: execute({userId: session.user.id, ...})
  UC->>R: create(...)
  R->>DB: INSERT task com userId
  DB-->>R: task criada
  R-->>UC: task
  UC-->>TRPC: task
  TRPC-->>UI: task
```

---

# 🧠 Decisões técnicas e arquiteturais

## 1) Zod como “fonte única”
- **Tasks**: `src/modules/tasks/tasks.schemas.ts`
  - usado no **backend** (`.input(schema)` no tRPC)
  - usado no **frontend** (`zodResolver(schema)` nos forms)
- Auth pages: `src/modules/auth/auth.schemas.ts` (valida inputs de login/cadastro)

## 2) DIP/ISP via Repositórios
- Use cases dependem de **interfaces** (ex.: `ITaskRepository`)
- Drizzle fica isolado em `infra/` como detalhe de implementação
- O router tRPC é o “composition root” que injeta dependências

## 3) tRPC para o domínio; Better Auth para autenticação
- **Tasks** e dados do produto: via tRPC (tipado, validado, protegido)
- **Auth**: via Better Auth handler (requisito do case)

## 4) UI modular + responsiva (Clean UI)
- `/tasks` foi quebrado em componentes menores (SRP)
- Sidebar desktop + mobile (Sheet) reutiliza os mesmos links e ações

---

## ✅ Checklist do desafio

- [x] Better Auth (credenciais) + logout
- [x] Rotas autenticadas protegidas
- [x] Dashboard com sidebar (desktop + mobile)
- [x] CRUD de Tasks completo
- [x] Tasks associadas ao usuário autenticado
- [x] Somente o dono pode ver/editar/excluir
- [x] Zod como schema único no domínio (front + tRPC)
- [x] Drizzle ORM + Postgres
- [x] Tipagem forte end-to-end (tRPC)
- [x] UI com shadcn/ui + Tailwind responsivo

---

### Licença
Uso livre para fins de avaliação do case.
