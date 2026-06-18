import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      // 1. Penanganan /api/set-password (Spesifik)
      "/api/set-password": {
        target: "https://rpp.bapenda.jatengprov.go.id",
        changeOrigin: true,
        secure: false,
        rewrite: (path) =>
          path.replace(
            /^\/api\/set-password/,
            "/penatausahaan/api/pepakraja/wr/set-password",
          ),
        // Menambahkan header untuk menyamai konfigurasi headers di vercel.json
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.setHeader(
              "Referer",
              "https://rpp.bapenda.jatengprov.go.id/",
            );
            proxyReq.setHeader(
              "Origin",
              "https://rpp.bapenda.jatengprov.go.id/",
            );
          });
        },
      },

      // 2. Penanganan /api/pepakraja/
      "/api/pepakraja": {
        target: "https://rpp.bapenda.jatengprov.go.id",
        changeOrigin: true,
        secure: false,
        rewrite: (path) =>
          path.replace(/^\/api\/pepakraja/, "/penatausahaan/api/pepakraja"),
      },

      "/bapenda": {
        target: "https://rpp.bapenda.jatengprov.go.id",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/bapenda/, "/penatausahaan/api"),
      },

      // 4. Catch-all /api (Mengarah ke root domain)
      // Pastikan diletakkan di urutan paling bawah agar tidak membajak path lain
      "^/api/": {
        target: "https://rpp.bapenda.jatengprov.go.id",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
