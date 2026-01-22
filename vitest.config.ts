import { defineVitestConfig } from "@nuxt/test-utils/config";

export default defineVitestConfig({
  test: {
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/tests/e2e/**",
    ],
    environment: "nuxt",
    environmentOptions: {
      nuxt: {
        domEnvironment: "happy-dom",
      },
    },
    setupFiles: ["./tests/mocks/color-mode.ts", "./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/**",
        ".nuxt/**",
        "dist/**",
        "**/*.d.ts",
        "**/*.config.*",
        "**/scripts/**",
      ],
    },
    globals: true,
    silent: false,
    logHeapUsage: false,
  },
});
