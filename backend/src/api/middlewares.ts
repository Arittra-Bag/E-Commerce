import { defineMiddlewares } from "@medusajs/framework/http"
import { attachTenantContext } from "../lib/tenant/resolve-tenant"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/*",
      middlewares: [attachTenantContext],
    },
    {
      matcher: "/admin/*",
      middlewares: [attachTenantContext],
    },
  ],
})
