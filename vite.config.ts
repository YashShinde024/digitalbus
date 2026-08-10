// Vite configuration — the @lovable.dev/vite-tanstack-config package already
// bundles TanStack Start, viteReact, tailwindcss, tsConfigPaths, nitro, etc.
// Do NOT add them manually or the app will break with duplicate plugins.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
});
