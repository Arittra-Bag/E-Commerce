import type {
  MedusaRequest,
  MedusaResponse,
  MedusaNextFunction,
} from "@medusajs/framework/http"
import TenantModuleService from "../../modules/tenant/service"
import { TENANT_MODULE } from "../../modules/tenant"

type TenantRecord = {
  id: string
  name: string
  slug: string
  is_active: boolean
  is_default: boolean
  domains?: unknown
  metadata?: Record<string, unknown> | null
}

export type TenantResolutionSource =
  | "header:id"
  | "header:slug"
  | "host"
  | "default"

export type TenantContext = {
  source: TenantResolutionSource
  tenant: {
    id: string
    name: string
    slug: string
    isDefault: boolean
    domains: string[]
    metadata: Record<string, unknown> | null
  }
}

const toDomains = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.toLowerCase())
}

const toContext = (
  tenant: TenantRecord,
  source: TenantResolutionSource
): TenantContext => ({
  source,
  tenant: {
    id: tenant.id,
    name: tenant.name,
    slug: tenant.slug,
    isDefault: tenant.is_default,
    domains: toDomains(tenant.domains),
    metadata: tenant.metadata ?? null,
  },
})

const readHosts = (req: MedusaRequest): string[] => {
  const headers = [req.get("x-forwarded-host"), req.get("host")]

  return headers
    .flatMap((entry) => (entry ? entry.split(",") : []))
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
    .map((entry) => entry.split(":")[0])
}

const listActiveTenants = async (req: MedusaRequest): Promise<TenantRecord[]> => {
  const tenantModuleService: TenantModuleService = req.scope.resolve(TENANT_MODULE)

  return (await tenantModuleService.listTenants({
    is_active: true,
  })) as TenantRecord[]
}

export const resolveTenantContext = async (
  req: MedusaRequest
): Promise<TenantContext | null> => {
  const tenantModuleService: TenantModuleService = req.scope.resolve(TENANT_MODULE)

  const tenantId = req.get("x-tenant-id")?.trim()
  if (tenantId) {
    const [tenant] = (await tenantModuleService.listTenants({
      id: tenantId,
      is_active: true,
    })) as TenantRecord[]

    if (tenant) {
      return toContext(tenant, "header:id")
    }
  }

  const tenantSlug = req.get("x-tenant-slug")?.trim().toLowerCase()
  if (tenantSlug) {
    const [tenant] = (await tenantModuleService.listTenants({
      slug: tenantSlug,
      is_active: true,
    })) as TenantRecord[]

    if (tenant) {
      return toContext(tenant, "header:slug")
    }
  }

  const activeTenants = await listActiveTenants(req)
  const hosts = readHosts(req)
  const hostMatch = activeTenants.find((tenant) =>
    toDomains(tenant.domains).some((domain) => hosts.includes(domain))
  )

  if (hostMatch) {
    return toContext(hostMatch, "host")
  }

  const defaultTenant = activeTenants.find((tenant) => tenant.is_default)
  return defaultTenant ? toContext(defaultTenant, "default") : null
}

export const attachTenantContext = async (
  req: MedusaRequest,
  _res: MedusaResponse,
  next: MedusaNextFunction
) => {
  req.context ??= {}
  req.context.tenant = await resolveTenantContext(req)
  next()
}
