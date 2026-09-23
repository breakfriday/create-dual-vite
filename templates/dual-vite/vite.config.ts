import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

function normalizeBase(base: string) {
  const segment = base.trim().split("/").filter(Boolean).join("/");
  return segment ? `/${segment}/` : "/";
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isFileLocalBuild = mode === "filelocal";
  return {
    base: isFileLocalBuild ? "./" : normalizeBase(env.VITE_APP_BASE || "/"),
    build: { outDir: isFileLocalBuild ? "dist-filelocal" : "dist" },
    plugins: [tanstackRouter(), react()],
    resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  };
});
