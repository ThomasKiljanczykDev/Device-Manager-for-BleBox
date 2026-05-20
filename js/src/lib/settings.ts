import { zSettingsStateResponse } from '@/shared';
import { commands } from '@/bindings';
import { unwrap } from './companion';

/**
 * BleBox device settings — currently just the cloud-tunnel toggle exposed as
 * "Remote access (cloud)" in the Connection tab. Handled by Rust over the LAN.
 *
 * `POST /api/settings/set` is a partial update: sending `{tunnel: {...}}`
 * leaves the rest of the settings document untouched.
 */

/** Cloud-tunnel state in a friendlier boolean shape. */
export interface RemoteAccess {
  enabled: boolean;
}

/** `GET /api/settings/state` — extracts just the cloud-tunnel toggle. */
export async function getRemoteAccess(ip: string): Promise<RemoteAccess> {
  const json = await unwrap(commands.deviceSettingsState(ip));
  const { settings } = zSettingsStateResponse.parse(JSON.parse(json));
  return { enabled: (settings.tunnel?.enabled ?? 0) === 1 };
}

/** `POST /api/settings/set` — flips just `tunnel.enabled`. */
export async function setRemoteAccess(ip: string, enabled: boolean): Promise<void> {
  await unwrap(
    commands.deviceSettingsSet(
      ip,
      JSON.stringify({ tunnel: { enabled: enabled ? 1 : 0 } }),
    ),
  );
}

/**
 * `POST /api/settings/set` — partial update for the device's display name.
 * BleBox enforces 0–31 characters; callers should clamp before calling.
 */
export async function setDeviceName(ip: string, name: string): Promise<void> {
  await unwrap(
    commands.deviceSettingsSet(ip, JSON.stringify({ deviceName: name })),
  );
}

/**
 * Per-device toggles surfaced in the Device Settings panel. Fields are
 * `undefined` when the device doesn't return them — the UI hides the
 * corresponding switch in that case.
 */
export interface DeviceSettings {
  statusLed?: boolean;
  buttonsBacklight?: boolean;
  powerMeasuring?: boolean;
}

/** Reads the three Device Settings toggles in their friendly boolean shape. */
export async function getDeviceSettings(ip: string): Promise<DeviceSettings> {
  const json = await unwrap(commands.deviceSettingsState(ip));
  const { settings } = zSettingsStateResponse.parse(JSON.parse(json));
  return {
    statusLed: settings.statusLed ? settings.statusLed.enabled === 1 : undefined,
    buttonsBacklight: settings.buttonsBacklight
      ? settings.buttonsBacklight.enabled === 1
      : undefined,
    powerMeasuring: settings.powerMeasuring
      ? settings.powerMeasuring.enabled === 1
      : undefined,
  };
}

/**
 * Writes only the fields explicitly set on `partial` via a partial settings
 * POST. Each sub-object is sent as `{enabled: 0|1}`; sibling fields inside
 * those sub-objects (e.g. `powerMeasuring.safetyValue`) ride along on the
 * device's merge.
 */
export async function setDeviceSettings(
  ip: string,
  partial: DeviceSettings,
): Promise<void> {
  const body: Record<string, { enabled: 0 | 1 }> = {};
  if (partial.statusLed !== undefined) {
    body.statusLed = { enabled: partial.statusLed ? 1 : 0 };
  }
  if (partial.buttonsBacklight !== undefined) {
    body.buttonsBacklight = { enabled: partial.buttonsBacklight ? 1 : 0 };
  }
  if (partial.powerMeasuring !== undefined) {
    body.powerMeasuring = { enabled: partial.powerMeasuring ? 1 : 0 };
  }
  await unwrap(commands.deviceSettingsSet(ip, JSON.stringify(body)));
}
