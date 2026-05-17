import { networkInterfaces } from 'node:os';
import { Bonjour, type Browser } from 'bonjour-service';
import {
  isSupportedDeviceType,
  isPrivateIpv4,
  parseIpv4,
  type CompanionEnv,
  type DiscoveredDevice,
} from '@blebox/shared';
import { probeDevice } from './blebox';

/** Local /24 prefixes (e.g. `192.168.88`) for every private IPv4 interface. */
function localSubnets(): string[] {
  const prefixes = new Set<string>();
  for (const ifaces of Object.values(networkInterfaces())) {
    for (const iface of ifaces ?? []) {
      if (iface.family !== 'IPv4' || iface.internal) continue;
      if (!isPrivateIpv4(iface.address)) continue;
      const octets = iface.address.split('.');
      prefixes.add(`${octets[0]}.${octets[1]}.${octets[2]}`);
    }
  }
  return [...prefixes];
}

/**
 * Discovers BleBox devices on the LAN.
 *
 * BleBox does not publish an mDNS service name, so discovery combines two
 * strategies (see `docs/decisions.md`):
 *  1. an active sweep of every local /24 — the reliable path;
 *  2. an mDNS `_http._tcp` browse — best-effort, catches devices outside the
 *     swept subnets.
 * Every candidate host is confirmed by probing `GET /info`; only switch/light
 * device types are surfaced.
 */
export class DiscoveryService {
  readonly #env: CompanionEnv;
  #bonjour: Bonjour | null = null;
  #browsers: Browser[] = [];
  #devices = new Map<string, DiscoveredDevice>();
  #probedIps = new Set<string>();
  #scanning = false;
  #stopTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(env: CompanionEnv) {
    this.#env = env;
  }

  get scanning(): boolean {
    return this.#scanning;
  }

  get devices(): DiscoveredDevice[] {
    return [...this.#devices.values()];
  }

  start(): void {
    if (this.#scanning) return;
    this.#scanning = true;
    this.#probedIps.clear();
    this.#sweepSubnets();
    this.#startMdns();
    this.#stopTimer = setTimeout(() => this.stop(), this.#env.DISCOVERY_TIMEOUT_MS);
  }

  stop(): void {
    this.#scanning = false;
    if (this.#stopTimer) {
      clearTimeout(this.#stopTimer);
      this.#stopTimer = null;
    }
    for (const browser of this.#browsers) browser.stop();
    this.#browsers = [];
    this.#bonjour?.destroy();
    this.#bonjour = null;
  }

  dispose(): void {
    this.stop();
  }

  async #probe(ip: string): Promise<void> {
    if (this.#probedIps.has(ip) || !parseIpv4(ip)) return;
    this.#probedIps.add(ip);
    const result = await probeDevice(ip, this.#env.DEVICE_PROBE_TIMEOUT_MS);
    if (!result.ok || !isSupportedDeviceType(result.device.type)) return;
    this.#devices.set(result.device.id, {
      ip,
      device: result.device,
      discoveredAt: new Date().toISOString(),
    });
  }

  #sweepSubnets(): void {
    for (const prefix of localSubnets()) {
      for (let host = 1; host <= 254; host++) {
        void this.#probe(`${prefix}.${host}`);
      }
    }
  }

  #startMdns(): void {
    try {
      this.#bonjour = new Bonjour();
      const browser = this.#bonjour.find({ type: 'http' });
      browser.on('up', (service) => {
        for (const address of service.addresses ?? []) {
          void this.#probe(address);
        }
        const referer = service.referer?.address;
        if (referer) void this.#probe(referer);
      });
      this.#browsers.push(browser);
    } catch {
      // mDNS is best-effort; the subnet sweep is the reliable path.
    }
  }
}
