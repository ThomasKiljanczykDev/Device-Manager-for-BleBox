import {
  actionsStateSchema,
  deviceInfoSchema,
  stateExtendedSchema,
  type Action,
  type ActionsState,
  type Device,
  type StateExtended,
} from '@/shared';
import { commands } from '@/bindings';
import { unwrap } from './companion';

/**
 * BleBox device access via Tauri commands. The Rust backend reaches the device
 * over the LAN and returns its raw JSON; the schemas below validate it.
 *
 * The action endpoints (`/api/actions/state`, `/api/actions/set`) are not in
 * any public BleBox spec — their shapes were reverse-engineered from a live
 * device. See `docs/action-shape.md`.
 */

export async function getDeviceInfo(ip: string): Promise<Device> {
  const json = await unwrap(commands.deviceInfo(ip));
  return deviceInfoSchema.parse(JSON.parse(json)).device;
}

export async function getStateExtended(ip: string): Promise<StateExtended> {
  const json = await unwrap(commands.deviceStateExtended(ip));
  return stateExtendedSchema.parse(JSON.parse(json));
}

export async function getActionsState(ip: string): Promise<ActionsState> {
  const json = await unwrap(commands.deviceActionsState(ip));
  return actionsStateSchema.parse(JSON.parse(json));
}

/**
 * Persists one action via `POST /api/actions/set` — the endpoint takes a single
 * action at a time, wrapped as `{ action }` (matches the device's wBox UI).
 */
export async function saveAction(ip: string, action: Action): Promise<void> {
  await unwrap(commands.deviceSaveAction(ip, JSON.stringify(action)));
}

/** Persists every given action sequentially (one upsert request each). */
export async function saveActions(ip: string, actions: Action[]): Promise<void> {
  for (const action of actions) {
    await saveAction(ip, action);
  }
}

/**
 * Toggles a single relay via `POST /state` — `state` is `0` (off) or `1` (on).
 * (The device also accepts `2` for toggle, which this app never uses.)
 */
export async function setRelayState(
  ip: string,
  relay: number,
  state: 0 | 1,
): Promise<void> {
  await unwrap(
    commands.deviceSetState(
      ip,
      JSON.stringify({ relays: [{ relay, state }] }),
    ),
  );
}

/**
 * Triggers `POST /api/ota/update` — the device begins pulling the new
 * firmware from BleBox's cloud (via its tunnel). The endpoint returns as
 * soon as the device has accepted the request; the actual install runs
 * asynchronously on-device. Callers poll `/info` to detect completion.
 */
export async function triggerOtaUpdate(ip: string): Promise<void> {
  await unwrap(commands.deviceOtaUpdate(ip));
}
