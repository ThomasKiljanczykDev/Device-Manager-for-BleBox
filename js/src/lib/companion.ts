import {
  deviceSchema,
  discoveryDevicesResponseSchema,
  type Device,
  type DiscoveryDevicesResponse,
} from '@/shared';
import { commands, type CommandError } from '@/bindings';

/**
 * Discovery and manual-add calls. Formerly HTTP requests to the Fastify
 * companion; now Tauri `invoke()` commands handled by the Rust backend.
 */

/** A tauri-specta Result: `ok` with data, or `error` with a {@link CommandError}. */
type CommandResult<T> = { status: 'ok'; data: T } | { status: 'error'; error: CommandError };

/** A structured backend error (`{ code, message }`). */
export class CompanionRequestError extends Error {
  readonly code: string;
  constructor(error: CommandError) {
    super(error.message);
    this.name = 'CompanionRequestError';
    this.code = error.code;
  }
}

/** Unwraps a command Result, throwing {@link CompanionRequestError} on failure. */
export async function unwrap<T>(result: Promise<CommandResult<T>>): Promise<T> {
  const settled = await result;
  if (settled.status === 'ok') return settled.data;
  throw new CompanionRequestError(settled.error);
}

export async function startDiscovery(): Promise<void> {
  await commands.startDiscovery();
}

export async function stopDiscovery(): Promise<void> {
  await commands.stopDiscovery();
}

export async function getDiscoveredDevices(): Promise<DiscoveryDevicesResponse> {
  const json = await unwrap(commands.getDiscoveredDevices());
  return discoveryDevicesResponseSchema.parse(JSON.parse(json));
}

export async function probeDevice(ip: string): Promise<Device> {
  const json = await unwrap(commands.probeDevice(ip));
  return deviceSchema.parse(JSON.parse(json));
}
