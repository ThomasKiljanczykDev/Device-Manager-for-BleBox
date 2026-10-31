import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintReact from '@eslint-react/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/node_modules/**',
      '**/.vite/**',
      '**/routeTree.gen.ts',
      '**/src/bindings.ts',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    ...eslintReact.configs['recommended-typescript'],
    files: ['src/**/*.{ts,tsx}'],
  },
  {
    ...reactHooks.configs.flat.recommended,
    files: ['src/**/*.{ts,tsx}'],
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser },
    },
    plugins: {
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    // shadcn/ui primitives legitimately co-export components and variants.
    files: ['src/components/ui/**/*.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    // TanStack Router route files must export `Route` — the HMR-only rule
    // does not apply to them.
    files: ['src/routes/**/*.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  prettier,
);
