import { describe, expect, it } from "vitest";
import { useTimeUtils } from "~/composables/useTimeUtils";

describe("useTimeUtils", () => {
  const { display, difference, fromSeconds, fromMinutes } = useTimeUtils();

  describe("display", () => {
    it("should format time with days, hours, and minutes", () => {
      expect(display(2, 5, 30)).toBe("2d 5h 30m");
    });

    it("should format time with only hours and minutes", () => {
      expect(display(0, 3, 45)).toBe("3h 45m");
    });

    it("should format time with only minutes", () => {
      expect(display(0, 0, 15)).toBe("15m");
    });

    it("should return '-' when all values are zero", () => {
      expect(display(0, 0, 0)).toBe("-");
    });

    it("should format time with only days", () => {
      expect(display(5, 0, 0)).toBe("5d");
    });

    it("should format time with days and minutes", () => {
      expect(display(1, 0, 20)).toBe("1d 20m");
    });
  });

  describe("difference", () => {
    it("should calculate difference between two dates", () => {
      const date1 = new Date("2024-01-01T00:00:00");
      const date2 = new Date("2024-01-02T03:45:00");

      expect(difference(date1, date2)).toBe("1d 3h 45m");
    });

    it("should handle dates as strings", () => {
      expect(difference("2024-01-01T00:00:00", "2024-01-01T05:30:00")).toBe("5h 30m");
    });

    it("should handle dates as timestamps", () => {
      const timestamp1 = new Date("2024-01-01T00:00:00").getTime();
      const timestamp2 = new Date("2024-01-01T02:15:00").getTime();

      expect(difference(timestamp1, timestamp2)).toBe("2h 15m");
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

  describe("fromSeconds", () => {
    it("should convert seconds to formatted time", () => {
      const seconds = 2 * 24 * 60 * 60 + 3 * 60 * 60 + 30 * 60; // 2 days, 3 hours, 30 minutes
      expect(fromSeconds(seconds)).toBe("2d 3h 30m");
    });

    it("should handle only hours and minutes", () => {
      const seconds = 5 * 60 * 60 + 45 * 60; // 5 hours, 45 minutes
      expect(fromSeconds(seconds)).toBe("5h 45m");
    });

    it("should handle only minutes", () => {
      const seconds = 20 * 60; // 20 minutes
      expect(fromSeconds(seconds)).toBe("20m");
    });

    it("should return '-' for zero seconds", () => {
      expect(fromSeconds(0)).toBe("-");
    });

    it("should ignore partial seconds", () => {
      const seconds = 65; // 1 minute 5 seconds
      expect(fromSeconds(seconds)).toBe("1m");
    });
  });

  describe("fromMinutes", () => {
    it("should convert minutes to formatted time", () => {
      const minutes = 2 * 24 * 60 + 3 * 60 + 30; // 2 days, 3 hours, 30 minutes
      expect(fromMinutes(minutes)).toBe("2d 3h 30m");
    });

    it("should handle only hours and minutes", () => {
      const minutes = 5 * 60 + 45; // 5 hours, 45 minutes
      expect(fromMinutes(minutes)).toBe("5h 45m");
    });

    it("should handle only minutes", () => {
      expect(fromMinutes(20)).toBe("20m");
    });

    it("should return '-' for zero minutes", () => {
      expect(fromMinutes(0)).toBe("-");
    });

    it("should handle large values", () => {
      const minutes = 10 * 24 * 60; // 10 days
      expect(fromMinutes(minutes)).toBe("10d");
    });
  });
});
