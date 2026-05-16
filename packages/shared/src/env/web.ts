import { z } from 'zod';

/** Environment contract for the web app (Vite). Parsed in `web/src/env.ts`. */
export const webEnvSchema = z.object({
  VITE_COMPANION_PORT: z.coerce.number().int().positive().max(65535).default(3001),
});

export type WebEnv = z.infer<typeof webEnvSchema>;
