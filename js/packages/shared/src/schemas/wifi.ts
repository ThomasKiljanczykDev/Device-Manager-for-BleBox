import { z } from 'zod';

/**
 * BleBox device WiFi contracts, derived from the device OpenAPI specs
 * (`packages/shared/blebox-specs/*.json`). Identical across switchBox /
 * switchBoxD / buttonBox / wLightBox.
 */

/**
 * `GET /api/device/network` payload — local-WiFi connection status and the
 * device's internal access point. Permissive: older firmware may omit fields.
 */
export const zWifiStatus = z.object({
  ssid: z.string().optional(),
  bssid: z.string().optional(),
  ip: z.string().optional(),
  mac: z.string().optional(),
  station_status: z.number().int().optional(),
  tunnel_status: z.number().int().optional(),
  apEnable: z.boolean().optional(),
  apSSID: z.string().optional(),
  apPasswd: z.string().nullable().optional(),
  channel: z.number().int().optional(),
});

export type WifiStatus = z.infer<typeof zWifiStatus>;

/**
 * Internal access-point settings — the `network` object of `POST /api/device/set`.
 * Both fields optional. The BleBox AP is passwordless, so `apPasswd` is
 * intentionally not modelled here.
 */
export const zApSettings = z.object({
  apEnable: z.boolean().optional(),
  apSSID: z.string().min(1).max(32).optional(),
});

export type ApSettings = z.infer<typeof zApSettings>;

/** `POST /api/device/set` request body. */
export const zDeviceSetRequest = z.object({
  network: zApSettings,
});

export type DeviceSetRequest = z.infer<typeof zDeviceSetRequest>;
