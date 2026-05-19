import { z } from 'zod';

/** Environment contract for the companion service. Parsed in `companion/src/env.ts`. */
export const companionEnvSchema = z.object({
  COMPANION_HOST: z.string().min(1).default('127.0.0.1'),
  COMPANION_PORT: z.coerce.number().int().positive().max(65535).default(3001),
  DISCOVERY_TIMEOUT_MS: z.coerce.number().int().positive().default(8000),
  DEVICE_PROBE_TIMEOUT_MS: z.coerce.number().int().positive().default(1500),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
    .default('info'),
});

export type CompanionEnv = z.infer<typeof companionEnvSchema>;
