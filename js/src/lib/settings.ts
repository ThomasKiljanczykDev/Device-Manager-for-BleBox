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
