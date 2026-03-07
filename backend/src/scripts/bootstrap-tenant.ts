import { ExecArgs } from "@medusajs/framework/types"
import { TENANT_MODULE } from "../modules/tenant"
import TenantModuleService from "../modules/tenant/service"

export default async function bootstrapTenant({ container }: ExecArgs) {
  const tenantModuleService: TenantModuleService = container.resolve(TENANT_MODULE)

  const existingTenants = await tenantModuleService.listTenants({
    slug: "default",
  })

  if (!existingTenants.length) {
    await tenantModuleService.createTenants({
      name: "Default Tenant",
      slug: "default",
      is_default: true,
      domains: ["localhost", "127.0.0.1"],
      metadata: {
        sales_channel_hint: "Default Sales Channel",
      },
    })
  }
}
