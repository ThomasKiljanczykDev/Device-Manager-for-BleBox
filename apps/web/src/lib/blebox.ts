import {
  actionsStateSchema,
  deviceInfoSchema,
  stateExtendedSchema,
  type Action,
  type ActionsState,
  type Device,
  type StateExtended,
} from '@blebox/shared';

/**
 * BleBox device access. Browsers cannot reach LAN devices directly (CORS), so
 * every call is routed through the companion proxy at `/api/proxy/:ip/*`.
 *
 * The action endpoints (`/api/actions/state`, `/api/actions/set`) are not in
 * any public BleBox spec — their shapes come from `@blebox/shared` schemas
 * reverse-engineered from a live device. See `docs/action-shape.md`.
 */
function proxyUrl(ip: string, path: string): string {
  return `/api/proxy/${ip}/${path.replace(/^\/+/, '')}`;
}

async function proxyGet(ip: string, path: string): Promise<unknown> {
  const res = await fetch(proxyUrl(ip, path));
  if (!res.ok) {
    throw new Error(`Device ${ip} returned ${res.status} for /${path}`);
  }
  return res.json();
}

export async function getDeviceInfo(ip: string): Promise<Device> {
  return deviceInfoSchema.parse(await proxyGet(ip, 'info')).device;
}

export async function getStateExtended(ip: string): Promise<StateExtended> {
  return stateExtendedSchema.parse(await proxyGet(ip, 'state/extended'));
}

export async function getActionsState(ip: string): Promise<ActionsState> {
  return actionsStateSchema.parse(await proxyGet(ip, 'api/actions/state'));
}

/**
 * Persists one action via `POST /api/actions/set` — the endpoint takes a single
 * action at a time, wrapped as `{ action }` (matches the device's wBox UI).
 */
export async function saveAction(ip: string, action: Action): Promise<void> {
  const res = await fetch(proxyUrl(ip, 'api/actions/set'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ action }),
  });
  if (!res.ok) {
    throw new Error(`Saving action ${action.id} to ${ip} failed (${res.status})`);
  }
}

/** Persists every given action sequentially (one upsert request each). */
export async function saveActions(ip: string, actions: Action[]): Promise<void> {
  for (const action of actions) {
    await saveAction(ip, action);
  }
}
