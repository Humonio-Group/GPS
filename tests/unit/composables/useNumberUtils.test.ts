import { describe, expect, it } from "vitest";
import { useNumberUtils } from "~/composables/useNumberUtils";

describe("useNumberUtils", () => {
  const { parsePercent } = useNumberUtils();

  describe("parsePercent", () => {
    it("should convert decimal to percentage", () => {
      expect(parsePercent(0.5)).toBe("50%");
      expect(parsePercent(0.75)).toBe("75%");
      expect(parsePercent(0.25)).toBe("25%");
    });

    it("should handle values already in percentage format", () => {
      expect(parsePercent(50)).toBe("50%");
      expect(parsePercent(75)).toBe("75%");
      expect(parsePercent(100)).toBe("100%");
    });

    it("should handle edge cases", () => {
      expect(parsePercent(0)).toBe("0%");
      expect(parsePercent(1)).toBe("100%"); // 1 is treated as 100% when <= 1
      expect(parsePercent(0.01)).toBe("1%");
    });

    it("should handle boundary value of 1", () => {
      expect(parsePercent(1)).toBe("100%"); // 1 is <= 1, so it's multiplied by 100
    });

    it("should handle values greater than 1", () => {
      expect(parsePercent(2)).toBe("2%");
      expect(parsePercent(150)).toBe("150%");
    });

    it("should handle decimal values less than 1", () => {
      expect(parsePercent(0.99)).toBe("99%");
      expect(parsePercent(0.1)).toBe("10%");
    });
  });
});
