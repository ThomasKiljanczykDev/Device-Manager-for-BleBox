import {
  Configuration,
  DevicesApi,
  DiscoveryApi,
  HealthApi,
  ResponseError,
} from '@blebox/shared/clients/companion';
import {
  companionErrorSchema,
  discoveryDevicesResponseSchema,
  probeResponseSchema,
  type CompanionError,
  type Device,
  type DiscoveryDevicesResponse,
} from '@blebox/shared';

// Same-origin in dev: Vite proxies `/api` to the companion service.
const config = new Configuration({ basePath: '' });
const discoveryApi = new DiscoveryApi(config);
const devicesApi = new DevicesApi(config);
const healthApi = new HealthApi(config);

/** A structured companion-side error (`{ code, message }`). */
export class CompanionRequestError extends Error {
  readonly code: string;
  constructor(error: CompanionError) {
    super(error.message);
    this.name = 'CompanionRequestError';
    this.code = error.code;
  }
}

/** Re-throws generated-client failures as {@link CompanionRequestError} when possible. */
async function rethrow(err: unknown): Promise<never> {
  if (err instanceof ResponseError) {
    const body = await err.response.json().catch(() => null);
    const parsed = companionErrorSchema.safeParse(body);
    if (parsed.success) throw new CompanionRequestError(parsed.data);
  }
  throw err;
}

export async function startDiscovery(): Promise<void> {
  await discoveryApi.apiDiscoveryStartPost().catch(rethrow);
}

export async function stopDiscovery(): Promise<void> {
  await discoveryApi.apiDiscoveryStopPost().catch(rethrow);
}

export async function getDiscoveredDevices(): Promise<DiscoveryDevicesResponse> {
  const raw = await discoveryApi.apiDiscoveryDevicesGet().catch(rethrow);
  return discoveryDevicesResponseSchema.parse(raw);
}

export async function probeDevice(ip: string): Promise<Device> {
  const raw = await devicesApi
    .apiDevicesProbePost({ apiDevicesProbePostRequest: { ip } })
    .catch(rethrow);
  return probeResponseSchema.parse(raw).device;
}

export async function getCompanionHealth(): Promise<{ status: string; uptimeS: number }> {
  return healthApi.apiHealthGet().catch(rethrow);
}
