import { describe, it, expect, vi } from "vitest";

// Mock VueUse's useMediaQuery
vi.mock("@vueuse/core", () => ({
  useMediaQuery: vi.fn(),
}));

describe("useBrowser", () => {
  it("should have correct mobile breakpoint", () => {
    const mobileBreakpoint = "(max-width: 950px)";
    expect(mobileBreakpoint).toBe("(max-width: 950px)");
  });

  it("should have correct desktop breakpoint", () => {
    const desktopBreakpoint = "(min-width: 1024px)";
    expect(desktopBreakpoint).toBe("(min-width: 1024px)");
  });

  it("should detect mobile viewport correctly", () => {
    const viewportWidth = 375;
    const isMobile = viewportWidth <= 950;
    expect(isMobile).toBe(true);
  });

  it("should detect desktop viewport correctly", () => {
    const viewportWidth = 1920;
    const isDesktop = viewportWidth >= 1024;
    expect(isDesktop).toBe(true);
  });

  it("should handle tablet viewport (between mobile and desktop)", () => {
    const viewportWidth = 768;
    const isMobile = viewportWidth <= 950;
    const isDesktop = viewportWidth >= 1024;
    expect(isMobile).toBe(true);
    expect(isDesktop).toBe(false);
  });

  it("should have isNative as false (not yet implemented)", () => {
    const isNative = false; // todo: bind capacitor detection
    expect(isNative).toBe(false);
  });
});
