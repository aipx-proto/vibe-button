import { resolve } from "node:path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      name: "VibeButton",
      fileName: "vibe-button",
    },
    sourcemap: "inline",
  },
  base: "vibe-button",
});
