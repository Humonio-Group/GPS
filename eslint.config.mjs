// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  files: ["**/*.{vue,ts}"],
  rules: {},
}).override("nuxt/typescript/rules", {
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
  },
  files: ["tests/**/*.ts"],
});
