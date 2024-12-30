import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: ["ES6"],
    lib: {
      name: "firebot-text-addons",
      entry: "src/main.ts",
      fileName: "firebot-text-addons",
      formats: ["cjs"],
    },
  },
});
