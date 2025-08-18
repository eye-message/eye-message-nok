import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    allowedHosts: [
      "host.docker.internal", // Docker 호스트 허용
      "localhost",
    ],
    port: 5174,
  },
});
