import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import type { ExecArgs } from "@medusajs/framework/types"

export default async function getPublishableApiKey({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data } = await query.graph({
    entity: "api_key",
    fields: ["id", "token", "type"],
    filters: {
      type: "publishable",
    },
  })

  const publishableKey = data?.[0]?.token

  if (!publishableKey) {
    throw new Error("No publishable API key found")
  }

  console.log(publishableKey)
}
