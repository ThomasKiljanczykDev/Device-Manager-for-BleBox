import { resolve } from 'node:path';
import { config } from 'dotenv';
import { companionEnvSchema, type CompanionEnv } from '@blebox/shared';

// Single .env lives at the repo root (src -> companion -> apps -> root).
config({ path: resolve(import.meta.dirname, '../../../.env') });

function loadEnv(): CompanionEnv {
  const parsed = companionEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('\n');
    console.error(`Invalid companion environment:\n${details}`);
    process.exit(1);
  }
  return parsed.data;
}

export const env = loadEnv();
