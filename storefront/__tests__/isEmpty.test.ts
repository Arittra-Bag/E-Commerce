import { isEmpty, isObject, isArray } from "../src/lib/util/isEmpty"

describe("isEmpty utility", () => {
  describe("isObject", () => {
    it("should return true for objects", () => {
      expect(isObject({})).toBe(true)
      expect(isObject({ a: 1 })).toBe(true)
    })

    it("should return true for arrays (since they are instances of Object)", () => {
      expect(isObject([])).toBe(true)
    })

    it("should return false for null", () => {
      expect(isObject(null)).toBe(false)
    })

    it("should return false for primitives", () => {
      expect(isObject("string")).toBe(false)
      expect(isObject(123)).toBe(false)
      expect(isObject(true)).toBe(false)
      expect(isObject(undefined)).toBe(false)
    })
  })

  describe("isArray", () => {
    it("should return true for arrays", () => {
      expect(isArray([])).toBe(true)
      expect(isArray([1, 2, 3])).toBe(true)
    })

    it("should return false for non-arrays", () => {
      expect(isArray({})).toBe(false)
      expect(isArray("string")).toBe(false)
      expect(isArray(null)).toBe(false)
      expect(isArray(undefined)).toBe(false)
    })
  })

  describe("isEmpty", () => {
    it("should return true for null and undefined", () => {
      expect(isEmpty(null)).toBe(true)
      expect(isEmpty(undefined)).toBe(true)
    })

    it("should return true for empty strings", () => {
      expect(isEmpty("")).toBe(true)
    })

    it("should return true for strings with only whitespace", () => {
      expect(isEmpty(" ")).toBe(true)
      expect(isEmpty("  \n\t  ")).toBe(true)
    })

    it("should return false for non-empty strings", () => {
      expect(isEmpty("a")).toBe(false)
      expect(isEmpty(" hello ")).toBe(false)
    })

    it("should return true for empty arrays", () => {
      expect(isEmpty([])).toBe(true)
    })

    it("should return false for non-empty arrays", () => {
      expect(isEmpty([1])).toBe(false)
      expect(isEmpty([undefined])).toBe(false)
    })

    it("should return true for empty objects", () => {
      expect(isEmpty({})).toBe(true)
    })

    it("should return false for non-empty objects", () => {
      expect(isEmpty({ a: 1 })).toBe(false)
      expect(isEmpty({ length: 0 })).toBe(false)
    })

    it("should return false for other types that are not considered empty by the implementation", () => {
      expect(isEmpty(0)).toBe(false)
      expect(isEmpty(false)).toBe(false)
    })
  })
})
