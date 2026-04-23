# Roadmap — Gabriel Siqueira
> Arquitetura de Software · 2025–2026

App pessoal para acompanhar o roadmap de estudos com linha do tempo interativa e gestão de entregáveis.

---

## Stack

- **Next.js 14** (App Router)
- **Prisma** (ORM)
- **PostgreSQL** via [Supabase](https://supabase.com) (free tier)
- **Vercel** (deploy)

---

## Setup local

### 1. Clone e instale

```bash
git clone <seu-repo>
cd gabriel-roadmap
npm install
```

### 2. Banco de dados — Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um projeto gratuito
2. Vá em **Project Settings → Database → Connection string**
3. Selecione o modo **URI** e copie a string

### 3. Variáveis de ambiente

```bash
cp .env.example .env
```

Edite `.env` e cole a connection string:

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
```

### 4. Criar as tabelas

```bash
npx prisma db push
```

### 5. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## Deploy no Vercel

### 1. Suba o código no GitHub

```bash
git init
git add .
git commit -m "init"
git remote add origin <url-do-repo>
git push -u origin main
```

### 2. Importe no Vercel

1. Acesse [vercel.com](https://vercel.com) → **New Project**
2. Importe o repositório do GitHub
3. Em **Environment Variables**, adicione:
   - `DATABASE_URL` → sua connection string do Supabase

### 3. Deploy

Vercel detecta Next.js automaticamente. Clique em **Deploy**.

> O comando `prisma generate` roda automaticamente no build via o script `"build"` do `package.json`.

---

## Estrutura do projeto

```
app/
  page.tsx              → Linha do tempo (tópicos + progresso)
  entregas/
    page.tsx            → Gestão de entregáveis (kanban + lista)
  api/
    topics/
      route.ts          → GET /api/topics · POST /api/topics
    deliverables/
      route.ts          → GET /api/deliverables · POST /api/deliverables
      [id]/
        route.ts        → PATCH /api/deliverables/:id · DELETE /api/deliverables/:id
  layout.tsx            → Layout global + navegação
  globals.css           → Estilos globais
  Nav.tsx               → Componente de navegação

lib/
  data.ts               → Dados do roadmap (fonte única da verdade)
  prisma.ts             → Singleton do Prisma client

prisma/
  schema.prisma         → Models: TopicCheck + Deliverable
```

---

## API

### Tópicos

| Método | Rota          | Descrição                         |
|--------|---------------|-----------------------------------|
| GET    | /api/topics   | Retorna `{ "m1-0": true, ... }`   |
| POST   | /api/topics   | `{ key: "m1-0", done: true }`     |

### Entregáveis

| Método | Rota                     | Descrição                            |
|--------|--------------------------|--------------------------------------|
| GET    | /api/deliverables        | Lista todos os entregáveis           |
| POST   | /api/deliverables        | Cria entregável `{ monthId, title }` |
| PATCH  | /api/deliverables/:id    | Atualiza `status`, `notes`, `link`   |
| DELETE | /api/deliverables/:id    | Remove entregável                    |

---

## Scripts úteis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run db:push      # Sincroniza schema com o banco
npm run db:studio    # Abre Prisma Studio (GUI do banco)
```
