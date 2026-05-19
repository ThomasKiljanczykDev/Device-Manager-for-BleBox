import { z } from 'zod';

/**
 * Subset of `/api/settings/state` — only the fields the app reads today.
 * Sibling settings (`relays`, `switch`, `statusLed`, …) are preserved via
 * `looseObject` so the schema doesn't fight a richer device payload.
 */

/** The cloud-tunnel sub-object. `enabled` is `0|1`, not a boolean. */
export const zTunnelSettings = z.object({
  enabled: z.number().int().min(0).max(1),
  logEnabled: z.number().int().optional(),
});

export type TunnelSettings = z.infer<typeof zTunnelSettings>;

export const zSettingsStateResponse = z.object({
  settings: z.looseObject({
    tunnel: zTunnelSettings.optional(),
  }),
});

export type SettingsStateResponse = z.infer<typeof zSettingsStateResponse>;
