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

  it("should sort products by price ascending (price_asc)", () => {
    const sorted = sortProducts([...mockProducts], "price_asc")
    expect(sorted[0].id).toBe("prod_2") // 50
    expect(sorted[1].id).toBe("prod_1") // 100
    expect(sorted[2].id).toBe("prod_3") // 150
  })

  it("should sort products by price descending (price_desc)", () => {
    const sorted = sortProducts([...mockProducts], "price_desc")
    expect(sorted[0].id).toBe("prod_3") // 150
    expect(sorted[1].id).toBe("prod_1") // 100
    expect(sorted[2].id).toBe("prod_2") // 50
  })

  it("should sort products by latest arrivals (created_at)", () => {
    const sorted = sortProducts([...mockProducts], "created_at")
    expect(sorted[0].id).toBe("prod_2") // 2023-01-03
    expect(sorted[1].id).toBe("prod_3") // 2023-01-02
    expect(sorted[2].id).toBe("prod_1") // 2023-01-01
  })

  it("should handle products with no variants gracefully when sorting by price", () => {
    const pNoVariants = {
      id: "prod_no_var",
      created_at: "2023-01-04T10:00:00Z",
    } as HttpTypes.StoreProduct

    const products = [...mockProducts, pNoVariants]

    // Ascending: missing variants -> Infinity price -> should be at the end
    const sortedAsc = sortProducts([...products], "price_asc")
    expect(sortedAsc[sortedAsc.length - 1].id).toBe("prod_no_var")

    // Descending: missing variants -> Infinity price -> should be at the start
    const sortedDesc = sortProducts([...products], "price_desc")
    expect(sortedDesc[0].id).toBe("prod_no_var")
  })

  it("should handle products with empty variants gracefully when sorting by price", () => {
    const pEmptyVariants = {
      id: "prod_empty_var",
      created_at: "2023-01-05T10:00:00Z",
      variants: []
    } as HttpTypes.StoreProduct

    const products = [...mockProducts, pEmptyVariants]

    // Ascending: empty variants -> Infinity price -> should be at the end
    const sortedAsc = sortProducts([...products], "price_asc")
    expect(sortedAsc[sortedAsc.length - 1].id).toBe("prod_empty_var")

    // Descending: empty variants -> Infinity price -> should be at the start
    const sortedDesc = sortProducts([...products], "price_desc")
    expect(sortedDesc[0].id).toBe("prod_empty_var")
  })

  it("should handle variants with no calculated_price gracefully", () => {
    const pNoPrice = {
      id: "prod_no_price",
      created_at: "2023-01-05T10:00:00Z",
      variants: [{ id: "var_1" }] as any
    } as HttpTypes.StoreProduct

    const products = [p2, pNoPrice] // p2 has min 50, pNoPrice has min 0 (fallback)

    const sortedAsc = sortProducts([...products], "price_asc")
    expect(sortedAsc[0].id).toBe("prod_no_price") // 0
    expect(sortedAsc[1].id).toBe("prod_2") // 50
  })
})
