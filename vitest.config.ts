import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.ts"],
      exclude: [
        "src/env.d.ts",
        "src/middleware.ts",
        "src/mcp.ts", // MCP SDK transport requires multi-step protocol (init → request); not unit-testable
        "src/pages/mcp.ts",
        "src/pages/tunnel.ts",
        "src/pages/a/script.js.ts",
        "src/pages/a/api/send.ts",
        "src/content.config.ts",
        "src/scripts/**", // Client-side browser scripts; not testable in Node
      ],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
});
