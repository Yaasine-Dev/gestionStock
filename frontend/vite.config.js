import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/auth": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/products": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/categories": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/suppliers": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/orders": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/stock": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/users": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/stats": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
