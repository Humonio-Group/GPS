// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: [
    "@nuxtjs/color-mode",
    "@nuxtjs/i18n",
    "shadcn-nuxt",
    "@nuxt/image",
    "@nuxt/eslint",
    "@nuxtjs/google-fonts",
    "@pinia/nuxt",
    "@nuxt/scripts",
  ],
  ssr: false,
  devtools: { enabled: true },
  css: ["./tailwind.css"],
  colorMode: {
    classPrefix: "",
    classSuffix: "",
    preference: "system",
    fallback: "light",
  },
  runtimeConfig: {
    public: {
      env: "",
      brand: {
        name: "",
      },
      api: {
        1: "",
        2: "",
        key: "",
      },
      platform: "",
      urls: {
        lrs: "",
        auth: "",
        coordinator: "",
        facilitate: "",
        coach: "",
        manage: "",
        execute: "",
        develop: "",
      },
      pusher: {
        key: "",
        cluster: "",
      },
    },
  },
  compatibilityDate: "2025-07-15",
  vite: {
    plugins: [tailwindcss()],
  },
  eslint: {
    checker: true,
    config: {
      stylistic: {
        indent: 2,
        semi: true,
        quotes: "double",
      },
    },
  },
  googleFonts: {
    families: {
      Inter: "100..900",
    },
  },
  i18n: {
    defaultLocale: "fr",
    strategy: "no_prefix",
    locales: [
      {
        code: "fr",
        iso: "fr-FR",
        name: "Français",
        file: "fr-FR.json",
      },
    ],
  },
  shadcn: {
    prefix: "ui",
    componentDir: "app/components/ui",
  },
});
