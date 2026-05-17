import { z } from 'zod';
import { deviceSchema } from './device';

/** Companion API request/response contracts (served as OpenAPI at `/docs`). */

export const healthResponseSchema = z.object({
  status: z.literal('ok'),
  uptimeS: z.number(),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;

/** A BleBox device found on the LAN, with its `/info` device object. */
export const discoveredDeviceSchema = z.object({
  ip: z.string(),
  device: deviceSchema,
  discoveredAt: z.string(),
});

export type DiscoveredDevice = z.infer<typeof discoveredDeviceSchema>;

export const discoveryDevicesResponseSchema = z.object({
  scanning: z.boolean(),
  devices: z.array(discoveredDeviceSchema),
});

export type DiscoveryDevicesResponse = z.infer<typeof discoveryDevicesResponseSchema>;

export const discoveryStatusResponseSchema = z.object({
  scanning: z.boolean(),
});

export type DiscoveryStatusResponse = z.infer<typeof discoveryStatusResponseSchema>;

export const probeRequestSchema = z.object({
  ip: z.string(),
});

export type ProbeRequest = z.infer<typeof probeRequestSchema>;

export const probeResponseSchema = z.object({
  device: deviceSchema,
});

export type ProbeResponse = z.infer<typeof probeResponseSchema>;

/** Structured error body returned by companion endpoints. */
export const companionErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
});

export type CompanionError = z.infer<typeof companionErrorSchema>;
