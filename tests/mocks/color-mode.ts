import { vi } from "vitest";

// Mock @nuxtjs/color-mode plugin to prevent initialization errors
vi.mock("@nuxtjs/color-mode", () => ({
  useColorMode: () => ({
    preference: "light",
    value: "light",
    unknown: false,
    forced: false,
  }),
}));
