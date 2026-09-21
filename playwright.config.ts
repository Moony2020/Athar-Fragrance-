import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  use: {
    baseURL: process.env.BASE_URL ?? "http://127.0.0.1:3100",
    trace: "retain-on-failure",
  },
});
