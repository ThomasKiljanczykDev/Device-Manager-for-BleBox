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

/** A sensor entry from `GET /state/extended` (e.g. `{type: "activePower", value: 5}`). */
export const sensorSchema = z
  .object({
    type: z.string(),
    value: z.number(),
    trend: z.number().optional(),
    state: z.number().optional(),
  })
  .passthrough();

/** One window of accumulated consumption (kWh) over `periodS` seconds. */
export const powerConsumptionEntrySchema = z
  .object({
    periodS: z.number(),
    value: z.number(),
  })
  .passthrough();

/** `powerMeasuring` sub-object from `GET /state/extended` (switchBox / switchBoxD). */
export const powerMeasuringSchema = z
  .object({
    enabled: z.number().int().optional(),
    powerConsumption: z.array(powerConsumptionEntrySchema).optional(),
  })
  .passthrough();

/**
 * `GET /state/extended` payload. Intentionally permissive — only the listed
 * sub-trees are read by this app; everything else is kept via passthrough.
 */
export const stateExtendedSchema = z
  .object({
    relays: z.array(relayStateSchema).optional(),
    inputs: z.array(inputStateSchema).optional(),
    sensors: z.array(sensorSchema).optional(),
    powerMeasuring: powerMeasuringSchema.optional(),
  })
  .passthrough();

export type StateExtended = z.infer<typeof stateExtendedSchema>;
