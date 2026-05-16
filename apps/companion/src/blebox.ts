import { deviceInfoSchema, type Device } from '@blebox/shared';

/** Outcome of probing `GET http://{ip}/info`. */
export type ProbeResult =
  | { ok: true; device: Device }
  | { ok: false; reason: 'timeout' | 'unreachable' | 'invalid' };

/**
 * Probes a candidate host's `/info` endpoint. Distinguishes a timeout from an
 * unreachable host from a host that responds but is not a BleBox device, so
 * callers can surface a precise message.
 */
export async function probeDevice(ip: string, timeoutMs: number): Promise<ProbeResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`http://${ip}/info`, { signal: controller.signal });
    if (!res.ok) return { ok: false, reason: 'invalid' };
    const parsed = deviceInfoSchema.safeParse(await res.json());
    if (!parsed.success) return { ok: false, reason: 'invalid' };
    return { ok: true, device: parsed.data.device };
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      return { ok: false, reason: 'timeout' };
    }
    return { ok: false, reason: 'unreachable' };
  } finally {
    clearTimeout(timer);
  }
}
