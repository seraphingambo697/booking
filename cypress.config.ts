import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // Frontend Vite dev server
    baseUrl: "http://localhost:5173",

    viewportWidth: 1280,
    viewportHeight: 900,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,

    // Pas de retry en dev pour échouer vite
    retries: { runMode: 1, openMode: 0 },

    specPattern: "cypress/e2e/**/*.cy.ts",
    supportFile: "cypress/support/e2e.ts",

    env: {
      ADMIN_EMAIL: "radmin@akkor.com",
      ADMIN_PASSWORD: "AdminPass123!",
      USER_EMAIL: "daix@gmail.com",
      USER_PASSWORD: "Azerty_225",
    },
  },
});