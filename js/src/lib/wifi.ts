import { zWifiStatus, type ApSettings, type WifiStatus } from '@/shared';
import { commands } from '@/bindings';
import { unwrap } from './companion';

/**
 * BleBox device WiFi calls — used by the device detail page's Service
 * Connection panel. Handled by the Rust backend over the LAN.
 *
 * Note: Tauri `invoke()` is not cancellable, so the `AbortSignal` accepted by
 * `getWifiStatus` (passed by TanStack Query) is ignored.
 */

/** `GET /api/device/network` — the device's WiFi state, including its internal AP. */
export async function getWifiStatus(ip: string, _signal?: AbortSignal): Promise<WifiStatus> {
  const json = await unwrap(commands.deviceNetwork(ip));
  return zWifiStatus.parse(JSON.parse(json));
}

/**
 * `POST /api/device/set` — updates the device's internal access point
 * (enable/disable, rename). Passing `{ apEnable: false }` turns the AP off.
 */
export async function setApSettings(ip: string, settings: ApSettings): Promise<void> {
  await unwrap(commands.deviceSetNetwork(ip, JSON.stringify(settings)));
}
