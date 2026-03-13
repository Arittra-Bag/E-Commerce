import { resolveTenantContext, attachTenantContext } from "../resolve-tenant"

const TENANT_MODULE = "tenant"

type TenantRecord = {
  id: string
  name: string
  slug: string
  is_active: boolean
  is_default: boolean
  domains?: string[]
  metadata?: Record<string, unknown> | null
}

const buildReq = (opts: {
  headers?: Record<string, string | undefined>
  tenants: TenantRecord[]
  authContext?: Record<string, unknown>
}) => {
  const headers = Object.fromEntries(
    Object.entries(opts.headers ?? {}).map(([k, v]) => [k.toLowerCase(), v])
  )

  return {
    get: (name: string) => headers[name.toLowerCase()],
    scope: {
      resolve: (key: string) => {
        if (key !== TENANT_MODULE) {
          throw new Error(`Unexpected module key: ${key}`)
        }

        return {
          listTenants: async (filter: Record<string, unknown>) =>
            opts.tenants.filter((tenant) => {
              if (filter.is_active && !tenant.is_active) {
                return false
              }

              if (filter.id && tenant.id !== filter.id) {
                return false
              }

              if (filter.slug && tenant.slug !== filter.slug) {
                return false
              }

              return true
            }),
        }
      },
    },
    auth_context: opts.authContext,
  }
}

const tenants: TenantRecord[] = [
  {
    id: "tenant_alpha",
    name: "Alpha",
    slug: "alpha",
    is_active: true,
    is_default: false,
    domains: ["alpha.example.com"],
  },
  {
    id: "tenant_beta",
    name: "Beta",
    slug: "beta",
    is_active: true,
    is_default: true,
    domains: ["beta.example.com"],
  },
]

describe("resolveTenantContext", () => {
  it("ignores unauthenticated tenant headers and resolves from host", async () => {
    const req = buildReq({
      headers: {
        "x-tenant-id": "tenant_beta",
        host: "alpha.example.com",
      },
      tenants,
    })

    const result = await resolveTenantContext(req as any)

    expect(result?.source).toBe("host")
    expect(result?.tenant.id).toBe("tenant_alpha")
  })

  it("uses header tenant id when authenticated claim matches", async () => {
    const req = buildReq({
      headers: {
        "x-tenant-id": "tenant_alpha",
      },
      tenants,
      authContext: {
        auth_identity_id: "auth_123",
        claims: {
          tenant_id: "tenant_alpha",
        },
      },
    })

    const result = await resolveTenantContext(req as any)

    expect(result?.source).toBe("header:id")
    expect(result?.tenant.slug).toBe("alpha")
  })

  it("falls back to default tenant when authenticated claim does not match header", async () => {
    const req = buildReq({
      headers: {
        "x-tenant-id": "tenant_alpha",
      },
      tenants,
      authContext: {
        auth_identity_id: "auth_123",
        claims: {
          tenant_id: "tenant_beta",
        },
      },
    })

    const result = await resolveTenantContext(req as any)

    expect(result?.source).toBe("default")
    expect(result?.tenant.id).toBe("tenant_beta")
  })
})

describe("attachTenantContext", () => {
  it("attaches tenant context to request and calls next", async () => {
    const req = buildReq({
      headers: {
        "x-tenant-id": "tenant_alpha",
      },
      tenants,
      authContext: {
        auth_identity_id: "auth_123",
        claims: {
          tenant_id: "tenant_alpha",
        },
      },
    })
    const next = jest.fn()

    await attachTenantContext(req as any, {} as any, next)

    expect((req as any).context).toBeDefined()
    expect((req as any).context.tenant).toBeDefined()
    expect((req as any).context.tenant.source).toBe("header:id")
    expect((req as any).context.tenant.tenant.slug).toBe("alpha")
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith()
  })

  it("preserves existing req.context properties", async () => {
    const req = buildReq({
      headers: {
        "x-tenant-id": "tenant_alpha",
      },
      tenants,
      authContext: {
        auth_identity_id: "auth_123",
        claims: {
          tenant_id: "tenant_alpha",
        },
      },
    })
    ;(req as any).context = { existing: true }
    const next = jest.fn()

    await attachTenantContext(req as any, {} as any, next)

    expect((req as any).context.existing).toBe(true)
    expect((req as any).context.tenant).toBeDefined()
    expect(next).toHaveBeenCalledTimes(1)
  })
})
