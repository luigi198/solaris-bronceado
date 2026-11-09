import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": fromRoot("./src"),
      // Tests run as the server; use the package's own server-side no-op entry.
      "server-only": fromRoot("./node_modules/server-only/empty.js"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "scripts/**/*.test.ts"],
    // First run downloads a mongod binary for mongodb-memory-server.
    hookTimeout: 120_000,
    testTimeout: 20_000,
  },
});
