import { model } from "@medusajs/framework/utils"

const Tenant = model.define("tenant", {
  id: model.id().primaryKey(),
  name: model.text().searchable(),
  slug: model.text().searchable().unique(),
  is_active: model.boolean().default(true),
  is_default: model.boolean().default(false),
  domains: model.array().default([]),
  metadata: model.json().nullable(),
})

export default Tenant
