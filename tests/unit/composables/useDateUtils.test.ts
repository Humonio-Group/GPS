import { describe, it, expect, beforeEach, vi } from "vitest";
import { useDateUtils } from "~/composables/useDateUtils";

// Mock Nuxt app
vi.mock("#app", () => ({
  useNuxtApp: () => ({
    $i18n: {
      locale: { value: "fr-FR" },
    },
  }),
}));

describe("useDateUtils", () => {
  let dateUtils: ReturnType<typeof useDateUtils>;

  beforeEach(() => {
    dateUtils = useDateUtils();
  });

  describe("explode", () => {
    it("should explode date into components", () => {
      const date = new Date("2024-01-15T14:30:45");
      const result = dateUtils.explode(date);

      expect(result.day).toBe(15);
      expect(result.month).toBe(0); // January is 0
      expect(result.year).toBe(2024);
      expect(result.hours).toBe(14);
      expect(result.minutes).toBe(30);
      expect(result.seconds).toBe(45);
    });

    it("should provide separate date object", () => {
      const date = new Date("2024-01-15T14:30:45");
      const result = dateUtils.explode(date);

      expect(result.date).toEqual({
        day: 15,
        month: 0,
        year: 2024,
      });
    });

    it("should provide separate time object", () => {
      const date = new Date("2024-01-15T14:30:45");
      const result = dateUtils.explode(date);

      expect(result.time).toEqual({
        hours: 14,
        minutes: 30,
        seconds: 45,
      });
    });

    it("should handle midnight correctly", () => {
      const date = new Date("2024-01-15T00:00:00");
      const result = dateUtils.explode(date);

      expect(result.hours).toBe(0);
      expect(result.minutes).toBe(0);
      expect(result.seconds).toBe(0);
    });

    it("should handle end of day correctly", () => {
      const date = new Date("2024-01-15T23:59:59");
      const result = dateUtils.explode(date);

      expect(result.hours).toBe(23);
      expect(result.minutes).toBe(59);
      expect(result.seconds).toBe(59);
    });
  });

  describe("sameDate", () => {
    it("should return true for same date", () => {
      const date1 = new Date("2024-01-15T10:00:00");
      const date2 = new Date("2024-01-15T15:30:00");

      expect(dateUtils.sameDate(date1, date2)).toBe(true);
    });

    it("should return false for different dates", () => {
      const date1 = new Date("2024-01-15T10:00:00");
      const date2 = new Date("2024-01-16T10:00:00");

      expect(dateUtils.sameDate(date1, date2)).toBe(false);
    });

    it("should return false for different months", () => {
      const date1 = new Date("2024-01-15T10:00:00");
      const date2 = new Date("2024-02-15T10:00:00");

      expect(dateUtils.sameDate(date1, date2)).toBe(false);
    });

    it("should return false for different years", () => {
      const date1 = new Date("2024-01-15T10:00:00");
      const date2 = new Date("2025-01-15T10:00:00");

      expect(dateUtils.sameDate(date1, date2)).toBe(false);
    });

    it("should ignore time when comparing", () => {
      const date1 = new Date("2024-01-15T00:00:00");
      const date2 = new Date("2024-01-15T23:59:59");

      expect(dateUtils.sameDate(date1, date2)).toBe(true);
    });
  });

  describe("formatDate", () => {
    it("should create short date formatter", () => {
      const formatter = dateUtils.formatDate("short");
      const date = new Date("2024-01-15");

      expect(typeof formatter(date)).toBe("string");
    });

    it("should create medium date formatter", () => {
      const formatter = dateUtils.formatDate("medium");
      const date = new Date("2024-01-15");

      expect(typeof formatter(date)).toBe("string");
    });

    it("should create long date formatter", () => {
      const formatter = dateUtils.formatDate("long");
      const date = new Date("2024-01-15");

      expect(typeof formatter(date)).toBe("string");
    });

    it("should format date according to locale", () => {
      const formatter = dateUtils.formatDate("short");
      const date = new Date("2024-01-15");
      const formatted = formatter(date);

      // Should contain date elements (exact format depends on locale)
      expect(formatted).toBeTruthy();
      expect(formatted.length).toBeGreaterThan(0);
    });
  });

  describe("isBefore", () => {
    it("should return true when date is before comparison date", () => {
      const date = new Date("2024-01-10");
      const compare = new Date("2024-01-15");

      expect(dateUtils.isBefore(date, compare)).toBe(true);
    });

    it("should return false when date is after comparison date", () => {
      const date = new Date("2024-01-20");
      const compare = new Date("2024-01-15");

      expect(dateUtils.isBefore(date, compare)).toBe(false);
    });

    it("should return false when dates are equal", () => {
      const date = new Date("2024-01-15T10:00:00");
      const compare = new Date("2024-01-15T10:00:00");

      expect(dateUtils.isBefore(date, compare)).toBe(false);
    });

    it("should compare against current date when no comparison provided", () => {
      const pastDate = new Date("2020-01-01");
      expect(dateUtils.isBefore(pastDate)).toBe(true);
    });

    it("should consider time in comparison", () => {
      const date1 = new Date("2024-01-15T10:00:00");
      const date2 = new Date("2024-01-15T11:00:00");

      expect(dateUtils.isBefore(date1, date2)).toBe(true);
    });
  });

  describe("isAfter", () => {
    it("should return true when date is after comparison date", () => {
      const date = new Date("2024-01-20");
      const compare = new Date("2024-01-15");

      expect(dateUtils.isAfter(date, compare)).toBe(true);
    });

    it("should return false when date is before comparison date", () => {
      const date = new Date("2024-01-10");
      const compare = new Date("2024-01-15");

      expect(dateUtils.isAfter(date, compare)).toBe(false);
    });

    it("should return false when dates are equal", () => {
      const date = new Date("2024-01-15T10:00:00");
      const compare = new Date("2024-01-15T10:00:00");

      expect(dateUtils.isAfter(date, compare)).toBe(false);
    });

    it("should compare against current date when no comparison provided", () => {
      const futureDate = new Date("2030-01-01");
      expect(dateUtils.isAfter(futureDate)).toBe(true);
    });

    it("should consider time in comparison", () => {
      const date1 = new Date("2024-01-15T11:00:00");
      const date2 = new Date("2024-01-15T10:00:00");

      expect(dateUtils.isAfter(date1, date2)).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("should handle leap year dates", () => {
      const leapDay = new Date("2024-02-29");
      const result = dateUtils.explode(leapDay);

      expect(result.day).toBe(29);
      expect(result.month).toBe(1); // February
    });

    it("should handle year transitions", () => {
      const date1 = new Date("2023-12-31T23:59:59");
      const date2 = new Date("2024-01-01T00:00:00");

      expect(dateUtils.sameDate(date1, date2)).toBe(false);
      expect(dateUtils.isBefore(date1, date2)).toBe(true);
    });
  });
});
