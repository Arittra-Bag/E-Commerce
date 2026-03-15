import { convertToLocale } from "../money"

describe("convertToLocale", () => {
  it("formats currency correctly with default locale (en-US)", () => {
    const result = convertToLocale({ amount: 1000, currency_code: "USD" })
    expect(result.replaceAll(/\s/g, ' ')).toBe("$1,000.00")
  })

  it("formats currency correctly with a specific locale", () => {
    const result = convertToLocale({ amount: 1000, currency_code: "EUR", locale: "de-DE" })
    // Use generic matching to handle Node.js specific localized spaces and formats
    expect(result.replaceAll(/\s/g, ' ')).toMatch(/1\.000,00.*€/)
  })

  it("falls back to amount.toString() when currency_code is empty", () => {
    const result = convertToLocale({ amount: 1000, currency_code: "" })
    expect(result).toBe("1000")
  })

  it("falls back to amount.toString() when currency_code is undefined", () => {
    const result = convertToLocale({ amount: 1000, currency_code: undefined as any })
    expect(result).toBe("1000")
  })

  it("applies minimumFractionDigits and maximumFractionDigits", () => {
    const result = convertToLocale({
      amount: 1000.1,
      currency_code: "USD",
      minimumFractionDigits: 3,
      maximumFractionDigits: 4,
    })
    expect(result.replaceAll(/\s/g, ' ')).toBe("$1,000.100")

    const result2 = convertToLocale({
      amount: 1000.12345,
      currency_code: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
    expect(result2.replaceAll(/\s/g, ' ')).toBe("$1,000.12")
  })

  it("formats zero amount correctly", () => {
    const result = convertToLocale({ amount: 0, currency_code: "USD" })
    expect(result.replaceAll(/\s/g, ' ')).toBe("$0.00")
  })

  it("formats negative amount correctly", () => {
    const result = convertToLocale({ amount: -50.25, currency_code: "USD" })
    expect(result.replaceAll(/\s/g, ' ')).toBe("-$50.25")
  })
})
