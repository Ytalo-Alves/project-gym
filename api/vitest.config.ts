import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: process.env.VITEST_MODE === "e2e"
      ? ["./tests/setup-e2e.ts"]
      : [],
    include: process.env.VITEST_MODE === "e2e"
      ? ["tests/e2e/**/*.spec.ts"]
      : ["tests/unit/**/*.spec.ts"],

    /**
     * Coverage Vitest 2.x
     */
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],

      // substitutos do antigo `all: true`
      include: ["src/**/*.ts"],
      exclude: [
        "src/index.ts",
        "src/http/server.ts",
        "src/**/routes/*.ts",
        "src/**/factories/*.ts",
        "src/**/*.d.ts",
        "src/**/*schema*.ts",
        "src/infra/prisma.ts",
        "tests/**",
        "node_modules/**",
        "coverage/**",
      ],
    },
  },
});
