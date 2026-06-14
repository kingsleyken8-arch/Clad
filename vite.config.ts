import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Relative base when building for GitHub Pages (served from a /repo/ subpath);
  // root base everywhere else (Netlify/Vercel/local).
  base: process.env.GITHUB_PAGES === "true" ? "./" : "/",
  plugins: [react()],
});
