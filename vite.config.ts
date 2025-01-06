import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/confluence-api": {
        target: "https://cwpenergy.atlassian.net",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/confluence-api/, ""),
        secure: false,
        headers: {
          "X-Atlassian-Token": "no-check",
          Accept: "application/json",
        },
      },
    },
  },
});
