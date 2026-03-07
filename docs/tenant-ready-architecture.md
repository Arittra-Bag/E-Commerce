# Tenant-Ready Architecture

This repository is intentionally `tenant-ready`, not fully shared-runtime multi-tenant.

## Why

Medusa gives strong commerce primitives, but shared multi-tenancy still requires custom isolation for:

- product visibility
- pricing
- carts and orders
- customer access
- admin permissions
- cache keys
- background jobs
- analytics

For an early-stage SaaS product, forcing all tenants through one shared Medusa runtime adds risk faster than it adds leverage.

## What is implemented

- a custom `Tenant` module in [`backend/src/modules/tenant`](/Users/arittrabag/Desktop/E-commerce/backend/src/modules/tenant)
- request-level tenant resolution from:
  - `x-tenant-id`
  - `x-tenant-slug`
  - request host
  - default tenant fallback
- a public debug endpoint at `GET /tenant-context`
- default tenant seed data for local development

## Recommended evolution path

1. Start with one tenant-aware codebase and isolated tenant deployments.
2. Introduce a control-plane for provisioning and billing.
3. Standardize tenant metadata:
   - slug
   - domains
   - status
   - region defaults
   - sales channel mapping
4. Only move to shared-runtime multi-tenancy after tenant isolation rules are fully enforced across products, carts, orders, and admin APIs.
