import { describe, expect, it } from 'vitest';
import { deviceInfoSchema, stateExtendedSchema } from './device';
import { discoveredDeviceSchema, probeRequestSchema } from './companion';
import { companionEnvSchema } from '../env/companion';
import { webEnvSchema } from '../env/web';

describe('deviceInfoSchema', () => {
  it('parses a real /info payload', () => {
    const result = deviceInfoSchema.safeParse({
      device: {
        deviceName: 'SimonGO Kitchen',
        type: 'switchBox',
        product: 'SimonGOSwitch',
        apiLevel: '20220505',
        id: 'dabc3883d0e0',
        ip: '192.168.88.200',
        availableFv: null,
      },
    });
    expect(result.success).toBe(true);
  });

  it('rejects payloads missing the device id', () => {
    expect(deviceInfoSchema.safeParse({ device: { deviceName: 'x', type: 'y' } }).success).toBe(
      false,
    );
  });
});

describe('stateExtendedSchema', () => {
  it('parses relays and keeps unknown fields', () => {
    const result = stateExtendedSchema.safeParse({
      relays: [{ relay: 0, state: 1 }],
      powerMeasuring: { enabled: 1 },
    });
    expect(result.success).toBe(true);
  });
});

describe('companion contracts', () => {
  it('discoveredDeviceSchema requires ip + device + timestamp', () => {
    expect(
      discoveredDeviceSchema.safeParse({
        ip: '192.168.88.200',
        device: { deviceName: 'x', type: 'switchBox', id: 'abc' },
        discoveredAt: new Date().toISOString(),
      }).success,
    ).toBe(true);
    expect(discoveredDeviceSchema.safeParse({ ip: '192.168.88.200' }).success).toBe(false);
  });

  it('probeRequestSchema requires an ip string', () => {
    expect(probeRequestSchema.safeParse({ ip: '10.0.0.1' }).success).toBe(true);
    expect(probeRequestSchema.safeParse({}).success).toBe(false);
  });
});

describe('env schemas', () => {
  it('companionEnvSchema applies defaults and coerces numbers', () => {
    const parsed = companionEnvSchema.parse({});
    expect(parsed.COMPANION_PORT).toBe(3001);
    expect(parsed.LOG_LEVEL).toBe('info');
    expect(companionEnvSchema.parse({ COMPANION_PORT: '4000' }).COMPANION_PORT).toBe(4000);
  });

  it('companionEnvSchema rejects invalid log levels', () => {
    expect(companionEnvSchema.safeParse({ LOG_LEVEL: 'verbose' }).success).toBe(false);
  });

  it('webEnvSchema defaults the companion port', () => {
    expect(webEnvSchema.parse({}).VITE_COMPANION_PORT).toBe(3001);
  });
});
