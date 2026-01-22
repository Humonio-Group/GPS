import { describe, expect, it, vi } from "vitest";

// Mock i18n
vi.mock("#app", () => ({
  useNuxtApp: () => ({
    $i18n: {
      t: (key: string, count?: number) => {
        // Return simple format for tests
        if (key.includes("short.months")) return `${count}mo`;
        if (key.includes("short.days")) return `${count}d`;
        if (key.includes("short.hours")) return `${count}h`;
        if (key.includes("short.minutes")) return `${count}m`;
        if (key.includes("long.months")) return `${count} months`;
        if (key.includes("long.days")) return `${count} days`;
        if (key.includes("long.hours")) return `${count} hours`;
        if (key.includes("long.minutes")) return `${count} minutes`;
        if (key === "labels.now") return "Now";
        return key;
      },
      locale: { value: "en" },
    },
  }),
}));

describe("useTimeUtils", async () => {
  const { useTimeUtils } = await import("~/composables/useTimeUtils");
  const { display, difference, daysBetween, fromSeconds, fromMinutes, formatTime } = useTimeUtils();

  describe("display", () => {
    it("should format time with months, days, hours, and minutes", () => {
      const result = display(0, 2, 5, 30, "short");
      // French format: "2j 5h 30min"
      expect(result).toContain("2");
      expect(result).toContain("5");
      expect(result).toContain("30");
      expect(result.length).toBeGreaterThan(5);
    });

    it("should format time with only days and hours", () => {
      const result = display(0, 0, 3, 45, "short");
      // French format: "3h 45min"
      expect(result).toContain("3");
      expect(result).toContain("45");
    });

    it("should format time with only minutes", () => {
      const result = display(0, 0, 0, 15, "short");
      // French format: "15min"
      expect(result).toContain("15");
    });

    it("should return '-' when all values are zero", () => {
      expect(display(0, 0, 0, 0)).toBe("-");
    });

    it("should format time with only days", () => {
      const result = display(0, 5, 0, 0, "short");
      // French format: "5j"
      expect(result).toContain("5");
    });

    it("should format time with days and minutes", () => {
      const result = display(0, 1, 0, 20, "short");
      // French format: "1j 20min"
      expect(result).toContain("1");
      expect(result).toContain("20");
    });
  });

  describe("difference", () => {
    it("should calculate difference between two dates", () => {
      const date1 = new Date("2024-01-01T00:00:00");
      const date2 = new Date("2024-01-02T03:45:00");

      const result = difference(date1, date2);
      expect(result).toBeTruthy();
      expect(result).not.toBe("-");
    });

    it("should handle dates as strings", () => {
      const result = difference("2024-01-01T00:00:00", "2024-01-01T05:30:00");
      expect(result).toBeTruthy();
      expect(result).not.toBe("-");
    });

    it("should handle dates as timestamps", () => {
      const timestamp1 = new Date("2024-01-01T00:00:00").getTime();
      const timestamp2 = new Date("2024-01-01T02:15:00").getTime();

      const result = difference(timestamp1, timestamp2);
      expect(result).toBeTruthy();
      expect(result).not.toBe("-");
    });

    it("should return absolute difference (order doesn't matter)", () => {
      const date1 = "2024-01-01T00:00:00";
      const date2 = "2024-01-02T00:00:00";

      expect(difference(date1, date2)).toBe(difference(date2, date1));
    });

    it("should return '-' when dates are the same", () => {
      const date = "2024-01-01T00:00:00";
      expect(difference(date, date)).toBe("-");
    });
  });

  describe("daysBetween", () => {
    it("should calculate days between two dates", () => {
      const date1 = new Date("2024-01-01");
      const date2 = new Date("2024-01-05");

      expect(daysBetween(date1, date2)).toBe(4);
    });

    it("should return 0 for same day", () => {
      const date = new Date("2024-01-01");
      expect(daysBetween(date, date)).toBe(0);
    });

    it("should handle string dates", () => {
      expect(daysBetween("2024-01-01", "2024-01-10")).toBe(9);
    });
  });

  describe("fromSeconds", () => {
    it("should convert seconds to formatted time", () => {
      const seconds = 2 * 24 * 60 * 60 + 3 * 60 * 60 + 30 * 60;
      const result = fromSeconds(seconds);
      expect(result).toBeDefined();
      expect(result).not.toBe("-");
    });

    it("should handle zero seconds", () => {
      expect(fromSeconds(0)).toBe("-");
    });
  });

  describe("fromMinutes", () => {
    it("should convert minutes to formatted time", () => {
      const minutes = 2 * 24 * 60 + 3 * 60 + 30;
      const result = fromMinutes(minutes);
      expect(result).toBeDefined();
      expect(result).not.toBe("-");
    });

    it("should handle zero minutes", () => {
      expect(fromMinutes(0)).toBe("-");
    });
  });

  describe("formatTime", () => {
    it("should create time formatter", () => {
      const formatter = formatTime("short");
      expect(formatter).toBeDefined();
      expect(typeof formatter).toBe("function");
    });
  });
});
