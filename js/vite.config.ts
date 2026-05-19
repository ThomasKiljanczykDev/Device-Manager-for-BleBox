import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

// Tauri serves this dev server; device access goes through Rust commands, not a
// dev proxy. `tauri dev` runs this via `beforeDevCommand`.
export default defineConfig({
  // Tauri's CLI owns the terminal output.
  clearScreen: false,
  plugins: [
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    react(),
    // React Compiler — runs babel-plugin-react-compiler via the preset.
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    alias: { '@': resolve(import.meta.dirname, 'src') },
  },
  server: {
    host: 'localhost',
    port: 5173,
    // Tauri's config pins this port; fail rather than silently pick another.
    strictPort: true,
  },
});
