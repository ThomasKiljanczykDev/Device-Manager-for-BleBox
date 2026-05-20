import {
  zWifiScanResponse,
  zWifiStatus,
  type ApSettings,
  type WifiNetwork,
  type WifiStatus,
} from '@/shared';
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

/** `GET /api/wifi/scan` — nearby access points the device can see. */
export async function scanWifiNetworks(ip: string): Promise<WifiNetwork[]> {
  const json = await unwrap(commands.deviceWifiScan(ip));
  return zWifiScanResponse.parse(JSON.parse(json)).ap;
}

/**
 * `POST /api/wifi/connect` — joins the device to a network. `pwd` is `null`
 * for an open network. The device may move off the current LAN as a result.
 */
export async function connectWifi(
  ip: string,
  ssid: string,
  pwd: string | null,
): Promise<void> {
  await unwrap(commands.deviceWifiConnect(ip, JSON.stringify({ ssid, pwd })));
}
