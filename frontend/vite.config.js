import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/auth": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/products": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/categories": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/suppliers": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/orders": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/stock": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/users": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/stats": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
});
