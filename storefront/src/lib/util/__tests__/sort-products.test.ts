import { sortProducts } from "../sort-products"
import { HttpTypes } from "@medusajs/types"

describe("sortProducts", () => {
  const createMockProduct = (id: string, prices: number[], createdAt: string): HttpTypes.StoreProduct => {
    return {
      id,
      created_at: createdAt,
      variants: prices.map(price => ({
        calculated_price: {
          calculated_amount: price
        }
      })) as any
    } as unknown as HttpTypes.StoreProduct
  }

  const p1 = createMockProduct("prod_1", [100, 200], "2023-01-01T10:00:00Z") // min 100
  const p2 = createMockProduct("prod_2", [50], "2023-01-03T10:00:00Z") // min 50
  const p3 = createMockProduct("prod_3", [300, 500, 150], "2023-01-02T10:00:00Z") // min 150

  const mockProducts = [p1, p2, p3]

  it("should return an empty array if empty array is provided", () => {
    expect(sortProducts([], "price_asc")).toEqual([])
  })

  it.each([
    ["price_asc", ["prod_2", "prod_1", "prod_3"]],
    ["price_desc", ["prod_3", "prod_1", "prod_2"]],
    ["created_at", ["prod_2", "prod_3", "prod_1"]],
  ] as const)("should sort products by %s", (sortBy, expectedIds) => {
    const sorted = sortProducts([...mockProducts], sortBy)
    expect(sorted.map(p => p.id)).toEqual(expectedIds)
  })

  it.each([
    {
      description: "no variants",
      product: {
        id: "prod_no_var",
        created_at: "2023-01-04T10:00:00Z",
      } as HttpTypes.StoreProduct,
    },
    {
      description: "empty variants",
      product: {
        id: "prod_empty_var",
        created_at: "2023-01-05T10:00:00Z",
        variants: [],
      } as HttpTypes.StoreProduct,
    },
  ])(
    "should handle products with $description gracefully when sorting by price",
    ({ product }) => {
      const products = [...mockProducts, product]

      // Ascending: Infinity price -> should be at the end
      expect(sortProducts([...products], "price_asc").pop()?.id).toBe(product.id)

      // Descending: Infinity price -> should be at the start
      expect(sortProducts([...products], "price_desc").shift()?.id).toBe(product.id)
    }
  )

  it("should handle variants with no calculated_price gracefully", () => {
    const pNoPrice = {
      id: "prod_no_price",
      created_at: "2023-01-05T10:00:00Z",
      variants: [{ id: "var_1" }] as any
    } as HttpTypes.StoreProduct

    const products = [p2, pNoPrice] // p2 has min 50, pNoPrice has min 0 (fallback)

    expect(sortProducts([...products], "price_asc").map(p => p.id))
      .toEqual(["prod_no_price", "prod_2"])
  })
})
