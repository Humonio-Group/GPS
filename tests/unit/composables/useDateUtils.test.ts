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

  describe("relativeDate", () => {
    it("should return time format for today", () => {
      const now = new Date();
      now.setHours(14, 30, 0, 0);

      const result = dateUtils.relativeDate(now);

      expect(result).toBe("14:30");
    });

    it("should pad hours and minutes with zeros", () => {
      const now = new Date();
      now.setHours(9, 5, 0, 0);

      const result = dateUtils.relativeDate(now);

      expect(result).toBe("09:05");
    });

    it("should return 'Yesterday' for yesterday", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const result = dateUtils.relativeDate(yesterday);

      expect(result).toBe("Yesterday");
    });

    it("should return 'Few days ago' for 2-6 days ago", () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const result = dateUtils.relativeDate(threeDaysAgo);

      expect(result).toBe("Few days ago");
    });

    it("should return '1 week ago' for 7-13 days ago", () => {
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

      const result = dateUtils.relativeDate(tenDaysAgo);

      expect(result).toBe("1 week ago");
    });

    it("should return '2 weeks ago' for 14-20 days ago", () => {
      const fifteenDaysAgo = new Date();
      fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

      const result = dateUtils.relativeDate(fifteenDaysAgo);

      expect(result).toBe("2 weeks ago");
    });

    it("should return '3 weeks ago' for 21-27 days ago", () => {
      const twentyTwoDaysAgo = new Date();
      twentyTwoDaysAgo.setDate(twentyTwoDaysAgo.getDate() - 22);

      const result = dateUtils.relativeDate(twentyTwoDaysAgo);

      expect(result).toBe("3 weeks ago");
    });

    it("should return '4 weeks ago' for 28-29 days ago", () => {
      const twentyNineDaysAgo = new Date();
      twentyNineDaysAgo.setDate(twentyNineDaysAgo.getDate() - 29);

      const result = dateUtils.relativeDate(twentyNineDaysAgo);

      expect(result).toBe("4 weeks ago");
    });

    it("should return 'Last month' for 30-59 days ago", () => {
      const fortyDaysAgo = new Date();
      fortyDaysAgo.setDate(fortyDaysAgo.getDate() - 40);

      const result = dateUtils.relativeDate(fortyDaysAgo);

      expect(result).toBe("Last month");
    });

    it("should return formatted date for dates older than 60 days", () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 90);

      const result = dateUtils.relativeDate(oldDate);

      // Should return a formatted date string (not one of the relative strings)
      expect(result).not.toBe("Yesterday");
      expect(result).not.toBe("Few days ago");
      expect(result).not.toBe("Last week");
      expect(result).not.toBe("Last month");
      expect(result.length).toBeGreaterThan(0);
    });

    it("should accept string date input", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const result = dateUtils.relativeDate(yesterday.toISOString());

      expect(result).toBe("Yesterday");
    });

    it("should accept timestamp input", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const result = dateUtils.relativeDate(yesterday.getTime());

      expect(result).toBe("Yesterday");
    });

    it("should handle edge case at boundary of today/yesterday", () => {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // Just into today
      const result1 = dateUtils.relativeDate(new Date(startOfToday.getTime() + 1000));
      expect(result1).toMatch(/^\d{2}:\d{2}$/);

      // Just before today (yesterday)
      const result2 = dateUtils.relativeDate(new Date(startOfToday.getTime() - 1000));
      expect(result2).toBe("Yesterday");
    });

    it("should handle 6 days ago as 'Few days ago'", () => {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const sixDaysAgo = new Date(startOfToday);
      sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);

      const result = dateUtils.relativeDate(sixDaysAgo);

      expect(result).toBe("Few days ago");
    });

    it("should handle 29 days ago as '4 weeks ago'", () => {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const twentyNineDaysAgo = new Date(startOfToday);
      twentyNineDaysAgo.setDate(twentyNineDaysAgo.getDate() - 29);

      const result = dateUtils.relativeDate(twentyNineDaysAgo);

      expect(result).toBe("4 weeks ago");
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
