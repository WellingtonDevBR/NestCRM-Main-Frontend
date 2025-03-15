
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Add SPA fallback for proper routing during development
    proxy: {},
    historyApiFallback: true
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
  // Make sure base path is set to root for proper asset loading
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
  // Ensure all paths are properly handled
  preview: {
    host: "::",
    port: 8080,
    strictPort: true,
    // Add SPA fallback for proper routing during preview
    proxy: {},
    historyApiFallback: true
  }
}));
