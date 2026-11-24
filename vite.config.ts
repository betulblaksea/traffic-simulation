/// <reference types="vitest/config" />
import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  publicDir: "public",
  server: { open: true },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
