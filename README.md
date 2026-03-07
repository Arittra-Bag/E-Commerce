# E-Commerce

This repository is an early Medusa v2 exploration for a B2C commerce SaaS product.

Right now it is not a finished SaaS platform. It is a working local development baseline built from the Medusa backend starter and the Medusa Next.js storefront starter, with a small amount of custom tenancy groundwork added on top.

## What is in this repo

- `backend/`: Medusa backend
- `storefront/`: Medusa Next.js storefront
- `docker-compose.yml`: local PostgreSQL and Redis
- `scripts/`: local dev helper scripts
- `docs/tenant-ready-architecture.md`: notes on the current tenancy direction

## What is actually implemented

- Medusa backend runs locally on port `9000`
- Next.js storefront runs locally on port `8000`
- PostgreSQL runs locally on port `15432`
- Redis runs locally on port `16379`
- Medusa migrations and demo seed work locally
- Medusa admin is available at `http://localhost:9000/app`
- a custom `Tenant` module exists in the backend
- tenant resolution works by:
  - `x-tenant-id`
  - `x-tenant-slug`
  - request host
  - default tenant fallback
- a public debug route exists at `http://localhost:9000/tenant-context`
- GitHub Actions CI checks:
  - backend typecheck
  - storefront typecheck
  - shell script syntax
  - Docker Compose config validity

## What is not built yet

- real tenant isolation across products, carts, orders, customers, and admin
- tenant provisioning flow
- billing
- custom storefront design
- production deployment setup
- search, background jobs, observability, or production hardening

So the current state is: working starter + local infra + initial tenant model, not a production-ready multi-tenant SaaS.

## Running locally

### Prerequisites

- Docker Desktop
- Homebrew `node@22`

On this machine, Homebrew installed Node at:

```bash
/opt/homebrew/opt/node@22/bin
```

If `npm` is not available in your shell, either:

```bash
export PATH="/opt/homebrew/opt/node@22/bin:$PATH"
```

or use the scripts directly:

```bash
./scripts/setup-dev.sh
./scripts/dev.sh
```

### First-time setup

```bash
./scripts/setup-dev.sh
```

This will:

- start Postgres and Redis
- install dependencies if needed
- run migrations
- create the default tenant if missing
- seed demo commerce data if the product catalog is empty

### Start both apps

```bash
./scripts/dev.sh
```

or, if `npm` is on your `PATH`:

```bash
npm run dev
```

### Local URLs

- Storefront: `http://localhost:8000`
- Backend API: `http://localhost:9000`
- Medusa Admin: `http://localhost:9000/app`
- Tenant debug route: `http://localhost:9000/tenant-context`

## Admin login

The seed does not create an admin user automatically.

Create one with:

```bash
source ./scripts/env.sh
cd backend
npx medusa user -e admin@example.com -p StrongPassword123
```

Then log in at `http://localhost:9000/app`.

## Useful commands

```bash
./scripts/backend-dev.sh
./scripts/storefront-dev.sh
./scripts/backend-migrate.sh
./scripts/backend-seed.sh
./scripts/backend-bootstrap-tenant.sh
docker compose up -d
docker compose down
docker compose down -v
```

## Safe to push

Current local-only files are ignored and will not be committed:

- `backend/.env`
- `storefront/.env.local`
- `backend/.medusa/`
- `backend/node_modules/`
- `storefront/node_modules/`
- `storefront/.next/`

So yes, the repo is in a state that you can push as-is.

## Current direction

The chosen direction is `tenant-ready`, not full shared-runtime multi-tenancy.

That means this codebase is being prepared for multi-tenant evolution without pretending that Medusa is already enforcing cross-tenant isolation everywhere. The next serious step would be mapping tenant ownership onto commerce entities and deciding whether tenant isolation should happen by deployment, database, schema, or shared runtime.
