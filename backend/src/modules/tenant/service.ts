import { MedusaService } from "@medusajs/framework/utils"
import Tenant from "./models/tenant"

class TenantModuleService extends MedusaService({
  Tenant,
}) {}

export default TenantModuleService
