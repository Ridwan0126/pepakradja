import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      // API Lama
      "/bapenda-api": {
        target: "https://rpp.bapenda.jatengprov.go.id",
        changeOrigin: true,
        secure: false,
        rewrite: (path) =>
          path.replace(/^\/bapenda-api/, "/penatausahaan-dev/api"),
      },

      "/bapenda-obyek": {
        target: "https://rpp.bapenda.jatengprov.go.id",
        changeOrigin: true,
        secure: false,
        rewrite: (path) =>
          path.replace(/^\/bapenda-obyek/, "penatausahaan-dev/api"),
      },
      // API Baru SPTRD
      "/bapenda-sptrd": {
        target: "https://rpp.bapenda.jatengprov.go.id",
        changeOrigin: true,
        secure: false,
        rewrite: (path) =>
          path.replace(/^\/bapenda-sptrd/, "/penatausahaan/api"),
      },
    },
  },
});
