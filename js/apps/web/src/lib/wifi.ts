import { zWifiStatus, type ApSettings, type WifiStatus } from '@blebox/shared';
import { proxyUrl } from './blebox';

/**
 * BleBox device WiFi calls, routed through the companion proxy at a device's
 * LAN IP — used by the device detail page's Service Connection panel.
 */

/** `GET /api/device/network` — the device's WiFi state, including its internal AP. */
export async function getWifiStatus(ip: string, signal?: AbortSignal): Promise<WifiStatus> {
  const res = await fetch(proxyUrl(ip, 'api/device/network'), { signal });
  if (!res.ok) throw new Error(`WiFi status failed (${res.status})`);
  return zWifiStatus.parse(await res.json());
}

/**
 * `POST /api/device/set` — updates the device's internal access point
 * (enable/disable, rename). Passing `{ apEnable: false }` turns the AP off.
 */
export async function setApSettings(
  ip: string,
  settings: ApSettings,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch(proxyUrl(ip, 'api/device/set'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ network: settings }),
    signal,
  });
  if (!res.ok) throw new Error(`Updating the device AP failed (${res.status})`);
}
