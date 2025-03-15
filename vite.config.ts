
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Add base configuration to ensure correct path resolution
  base: '/',
  // Handle SPA routing by serving index.html for 404s
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
}));
