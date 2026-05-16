import { describe, expect, it } from 'vitest';
import { isPrivateIpv4, parseIpv4, privateIpv4Schema, ipv4Schema } from './ip';

describe('parseIpv4', () => {
  it('parses valid IPv4 literals', () => {
    expect(parseIpv4('192.168.88.200')).toEqual([192, 168, 88, 200]);
    expect(parseIpv4('0.0.0.0')).toEqual([0, 0, 0, 0]);
    expect(parseIpv4('255.255.255.255')).toEqual([255, 255, 255, 255]);
    expect(parseIpv4('  10.0.0.1  ')).toEqual([10, 0, 0, 1]);
  });

  it('rejects malformed input', () => {
    expect(parseIpv4('192.168.1')).toBeNull();
    expect(parseIpv4('192.168.1.256')).toBeNull();
    expect(parseIpv4('192.168.1.1.1')).toBeNull();
    expect(parseIpv4('a.b.c.d')).toBeNull();
    expect(parseIpv4('device.blebox')).toBeNull();
    expect(parseIpv4('')).toBeNull();
    expect(parseIpv4('192.168.-1.1')).toBeNull();
  });
});

describe('isPrivateIpv4', () => {
  it('accepts private / link-local / loopback ranges', () => {
    expect(isPrivateIpv4('10.1.2.3')).toBe(true);
    expect(isPrivateIpv4('172.16.0.1')).toBe(true);
    expect(isPrivateIpv4('172.31.255.255')).toBe(true);
    expect(isPrivateIpv4('192.168.88.200')).toBe(true);
    expect(isPrivateIpv4('169.254.10.10')).toBe(true);
    expect(isPrivateIpv4('127.0.0.1')).toBe(true);
  });

  it('rejects public and out-of-range addresses', () => {
    expect(isPrivateIpv4('8.8.8.8')).toBe(false);
    expect(isPrivateIpv4('172.15.0.1')).toBe(false);
    expect(isPrivateIpv4('172.32.0.1')).toBe(false);
    expect(isPrivateIpv4('192.169.0.1')).toBe(false);
    expect(isPrivateIpv4('1.2.3.4')).toBe(false);
    expect(isPrivateIpv4('not-an-ip')).toBe(false);
  });
});

describe('ipv4Schema / privateIpv4Schema', () => {
  it('ipv4Schema accepts any valid literal', () => {
    expect(ipv4Schema.safeParse('8.8.8.8').success).toBe(true);
    expect(ipv4Schema.safeParse('999.1.1.1').success).toBe(false);
  });

  it('privateIpv4Schema accepts private only', () => {
    expect(privateIpv4Schema.safeParse('192.168.88.200').success).toBe(true);
    const publicResult = privateIpv4Schema.safeParse('8.8.8.8');
    expect(publicResult.success).toBe(false);
    if (!publicResult.success) {
      expect(publicResult.error.issues[0]?.message).toMatch(/private/i);
    }
  });
});
