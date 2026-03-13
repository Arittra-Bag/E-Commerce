import { HttpTypes } from "@medusajs/types"

export function parseAddresses(formData: FormData) {
  const data: any = {
    shipping_address: {},
    billing_address: {}
  }

  for (const [key, value] of formData.entries()) {
    if (key.startsWith("shipping_address.")) {
      data.shipping_address[key.replace("shipping_address.", "")] = value
    } else if (key.startsWith("billing_address.")) {
      data.billing_address[key.replace("billing_address.", "")] = value
    } else {
      data[key] = value
    }
  }

  if (data.same_as_billing === "on") {
    data.billing_address = { ...data.shipping_address }
  }

  return data as HttpTypes.StoreUpdateCart
}
