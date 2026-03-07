# E-Commerce

This repository is an early Medusa v2 exploration for a B2C commerce SaaS product.

## Current Status

This project is a working local development baseline built from the Medusa backend starter and the Medusa Next.js storefront starter, incorporating foundational custom tenancy groundwork. It is not yet a fully finished multi-tenant SaaS platform.

## Repository Structure

```text
backend/                     # Medusa backend
storefront/                  # Medusa Next.js storefront
docker-compose.yml           # Local PostgreSQL and Redis configuration
scripts/                     # Local development helper scripts
docs/tenant-ready-architecture.md # Documentation on the current tenancy direction
```

## Implemented Functionality

The following functionality is currently implemented and verified:

- Local execution of Medusa migrations and demo seed data.
- GitHub Actions CI checks for:
  - Backend typechecking
  - Storefront typechecking
  - Shell script syntax validation
  - Docker Compose configuration validity

## Tenant Foundation / Architecture

A custom `Tenant` module is implemented in the backend. Tenant resolution operates via the following mechanisms:

- `x-tenant-id` header
- `x-tenant-slug` header
- Request host
- Default tenant fallback

## Running Locally

### Prerequisites

- Docker Desktop
- Homebrew with `node@22`

If Node.js is installed via Homebrew at `/opt/homebrew/opt/node@22/bin` and `npm` is not available in the shell, either update the path:

```bash
export PATH="/opt/homebrew/opt/node@22/bin:$PATH"
```

Or execute the provided scripts directly:

```bash
./scripts/setup-dev.sh
./scripts/dev.sh
```

### First-Time Setup

To initialize the development environment, execute:

```bash
./scripts/setup-dev.sh
```

This script automates the following operations:
- Starts PostgreSQL and Redis containers.
- Installs necessary project dependencies.
- Executes database migrations.
- Creates a default tenant if one does not exist.
- Seeds demo commerce data if the product catalog is empty.

### Starting the Development Environment

To start both the backend and storefront applications, run:

```bash
./scripts/dev.sh
```

Alternatively, if `npm` is available in the shell path:

```bash
npm run dev
```

### Local URLs

The local development services are accessible at the following endpoints:

| Service | URL |
|---|---|
| Storefront | `http://localhost:8000` |
| Backend API | `http://localhost:9000` |
| Medusa Admin | `http://localhost:9000/app` |
| Tenant Debug Route | `http://localhost:9000/tenant-context` |

Local infrastructure runs on the following ports:

| Service | Port |
|---|---|
| PostgreSQL | `15432` |
| Redis | `16379` |

### Admin Setup

The initial database seed does not automatically generate an administrator account. To create an admin user, execute the following commands:

```bash
source ./scripts/env.sh
cd backend
npx medusa user -e admin@example.com -p StrongPassword123
```

Following creation, log in to the admin interface at `http://localhost:9000/app`.

### Development Commands

The following helper scripts and Docker commands are available for local development:

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

## Ignored Local Files

The following local development and build artifact directories are safely ignored by version control and will not be committed:

- `backend/.env`
- `storefront/.env.local`
- `backend/.medusa/`
- `backend/node_modules/`
- `storefront/node_modules/`
- `storefront/.next/`

The repository is configured such that it is safe to push current modifications.

## Architectural Direction

The chosen architectural direction is "tenant-ready" rather than a full shared-runtime multi-tenant SaaS.

This codebase is preparing for multi-tenant evolution by establishing a foundational tenant model, but it does not yet enforce tenant isolation across all commerce entities. The current implementation lacks real tenant isolation across products, carts, orders, customers, and the admin interface. Additional capabilities such as a tenant provisioning flow, billing, custom storefront design, production deployment setup, search, background jobs, observability, and production hardening are not yet implemented.

The next evolutionary step involves mapping tenant ownership onto commerce entities and determining whether tenant isolation should be enforced at the deployment, database, schema, or shared runtime level.

## Documentation

For additional details on the architectural direction and multi-tenant strategy, refer to:
- [Tenant-Ready Architecture](docs/tenant-ready-architecture.md)

## License

This project is licensed under the MIT License.
