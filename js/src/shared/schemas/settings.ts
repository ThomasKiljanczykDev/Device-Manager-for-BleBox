import { z } from 'zod';

/**
 * Subset of `/api/settings/state` — only the fields the app reads today.
 * Sibling settings (`relays`, `switch`, `fieldsPreferences`, …) are preserved
 * via `looseObject` so the schema doesn't fight a richer device payload.
 */

/** The cloud-tunnel sub-object. `enabled` is `0|1`, not a boolean. */
export const zTunnelSettings = z.object({
  enabled: z.number().int().min(0).max(1),
  logEnabled: z.number().int().optional(),
});

export type TunnelSettings = z.infer<typeof zTunnelSettings>;

/** Front-panel status LED toggle. */
export const zStatusLedSettings = z.object({
  enabled: z.number().int().min(0).max(1),
});

/** Physical-button backlight toggle (present on some switchBox firmwares). */
export const zButtonsBacklightSettings = z.object({
  enabled: z.number().int().min(0).max(1),
});

/**
 * Power-measuring on/off, plus `safetyValue` / `factoryCalibration` that
 * ride along untouched. Modelled as `looseObject` so a partial write
 * (`{enabled: N}`) round-trips the siblings cleanly.
 */
export const zPowerMeasuringSettings = z.looseObject({
  enabled: z.number().int().min(0).max(1),
});

export const zSettingsStateResponse = z.object({
  settings: z.looseObject({
    tunnel: zTunnelSettings.optional(),
    statusLed: zStatusLedSettings.optional(),
    buttonsBacklight: zButtonsBacklightSettings.optional(),
    powerMeasuring: zPowerMeasuringSettings.optional(),
  }),
});

export type SettingsStateResponse = z.infer<typeof zSettingsStateResponse>;
