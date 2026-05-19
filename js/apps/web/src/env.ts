import { webEnvSchema, type WebEnv } from '@blebox/shared';

/** Web environment, parsed from Vite's `import.meta.env` through the shared schema. */
function loadEnv(): WebEnv {
  const parsed = webEnvSchema.safeParse(import.meta.env);
  if (!parsed.success) {
    throw new Error(`Invalid web environment: ${parsed.error.message}`);
  }
  return parsed.data;
}

export const env = loadEnv();
