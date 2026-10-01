import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig, loadEnv } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = loadEnv("", process.cwd(), "");

export default defineConfig({
  define: {
    "import.meta.env.API_BASE_URL": JSON.stringify(env.API_BASE_URL ?? ""),
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
