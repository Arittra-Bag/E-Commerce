import { getPercentageDiff } from "../get-percentage-diff"

describe("getPercentageDiff", () => {
  it("should calculate the percentage difference between two numbers", () => {
    expect(getPercentageDiff(100, 80)).toBe("20")
    expect(getPercentageDiff(50, 25)).toBe("50")
  })

  it("should handle cases where there is no difference", () => {
    expect(getPercentageDiff(100, 100)).toBe("0")
  })

  it("should handle cases where calculated is greater than original (negative decrease)", () => {
    expect(getPercentageDiff(100, 120)).toBe("-20")
  })

  it("should correctly round to the nearest whole number", () => {
    expect(getPercentageDiff(100, 80.5)).toBe("20") // 19.5 rounds to 20
    expect(getPercentageDiff(100, 80.6)).toBe("19") // 19.4 rounds to 19
    expect(getPercentageDiff(100, 80.4)).toBe("20") // 19.6 rounds to 20
  })

  it("should handle original value being 0", () => {
    expect(getPercentageDiff(0, 50)).toBe("-Infinity")
  })
})
