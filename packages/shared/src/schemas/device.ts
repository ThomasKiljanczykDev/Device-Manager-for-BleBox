import { z } from 'zod';

/**
 * `GET /info` payload (canonical device identification endpoint).
 * Fields beyond `type`/`id` vary by hardware, so most are optional.
 */
export const deviceSchema = z.object({
  deviceName: z.string(),
  type: z.string(),
  product: z.string().optional(),
  hv: z.string().optional(),
  fv: z.string().optional(),
  universe: z.number().optional(),
  apiLevel: z.union([z.string(), z.number()]).optional(),
  categories: z.array(z.number()).optional(),
  id: z.string(),
  ip: z.string().optional(),
  availableFv: z.string().nullable().optional(),
});

export type Device = z.infer<typeof deviceSchema>;

export const deviceInfoSchema = z.object({
  device: deviceSchema,
});

export type DeviceInfo = z.infer<typeof deviceInfoSchema>;

/** A single relay entry from `GET /state/extended` (switchBox / switchBoxD). */
export const relayStateSchema = z
  .object({
    relay: z.number(),
    state: z.number().optional(),
    stateAfterRestart: z.number().optional(),
  })
  .passthrough();

/** A single physical input entry from `GET /state/extended` (buttonBox). */
export const inputStateSchema = z
  .object({
    input: z.number().optional(),
  })
  .passthrough();

/**
 * `GET /state/extended` payload. Intentionally permissive — only `relays`
 * and `inputs` are read by this app; everything else is kept via passthrough.
 */
export const stateExtendedSchema = z
  .object({
    relays: z.array(relayStateSchema).optional(),
    inputs: z.array(inputStateSchema).optional(),
  })
  .passthrough();

export type StateExtended = z.infer<typeof stateExtendedSchema>;
