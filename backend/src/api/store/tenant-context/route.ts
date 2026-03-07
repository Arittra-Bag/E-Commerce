import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { resolveTenantContext } from "../../../lib/tenant/resolve-tenant"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const tenantContext =
    (req.context?.tenant as Awaited<ReturnType<typeof resolveTenantContext>>) ??
    (await resolveTenantContext(req))

  res.json({
    tenant: tenantContext?.tenant ?? null,
    resolution: tenantContext?.source ?? null,
    mode: "tenant-ready",
  })
}
