import { resolve } from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

// Single .env lives at the repo root.
const repoRoot = resolve(import.meta.dirname, '../..');

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, repoRoot, 'VITE_');
  const companionPort = env.VITE_COMPANION_PORT || '3001';

  return {
    envDir: repoRoot,
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
      port: 5173,
      // Same-origin access to the companion in dev (discovery + CORS proxy).
      proxy: {
        '/api': { target: `http://127.0.0.1:${companionPort}`, changeOrigin: true },
      },
    },
  };
});
