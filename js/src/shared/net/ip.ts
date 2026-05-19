import { z } from 'zod';

/** Parses a strict IPv4 literal into its four octets, or `null` if invalid. */
export function parseIpv4(value: string): [number, number, number, number] | null {
  const parts = value.trim().split('.');
  if (parts.length !== 4) return null;
  const octets: number[] = [];
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return null;
    const n = Number(part);
    if (n > 255) return null;
    octets.push(n);
  }
  return [octets[0]!, octets[1]!, octets[2]!, octets[3]!];
}

/**
 * Whether an IPv4 literal is in private / link-local / loopback space:
 * `10/8`, `172.16/12`, `192.168/16`, `169.254/16`, `127/8`. The companion
 * proxy refuses anything outside these ranges.
 */
export function isPrivateIpv4(value: string): boolean {
  const octets = parseIpv4(value);
  if (!octets) return false;
  const [a, b] = octets;
  if (a === 10) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 169 && b === 254) return true;
  if (a === 127) return true;
  return false;
}

/** Zod schema: any valid IPv4 literal. */
export const ipv4Schema = z
  .string()
  .refine((v) => parseIpv4(v) !== null, { message: 'Must be a valid IPv4 address' });

/** Zod schema: a valid IPv4 literal that is also private / link-local. */
export const privateIpv4Schema = z
  .string()
  .refine((v) => parseIpv4(v) !== null, { message: 'Must be a valid IPv4 address' })
  .refine((v) => isPrivateIpv4(v), {
    message: 'Must be a private or link-local address',
  });
