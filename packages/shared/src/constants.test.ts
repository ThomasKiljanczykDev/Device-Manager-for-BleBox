import { describe, expect, it } from 'vitest';
import { ACTION_KINDS, ACTION_TYPE, isSupportedDeviceType } from './constants';

describe('device type support', () => {
  it('recognises supported switch / light families', () => {
    expect(isSupportedDeviceType('switchBox')).toBe(true);
    expect(isSupportedDeviceType('switchBoxD')).toBe(true);
    expect(isSupportedDeviceType('buttonBox')).toBe(true);
    expect(isSupportedDeviceType('wLightBox')).toBe(true);
  });

  it('rejects out-of-scope families', () => {
    expect(isSupportedDeviceType('shutterBox')).toBe(false);
    expect(isSupportedDeviceType('gateBox')).toBe(false);
    expect(isSupportedDeviceType('')).toBe(false);
  });
});

describe('action enums', () => {
  it('maps the action-type enum to its values', () => {
    expect(ACTION_TYPE.unconfigured).toBe(0);
    expect(ACTION_TYPE.switchOn).toBe(1);
    expect(ACTION_TYPE.switchOff).toBe(2);
    expect(ACTION_TYPE.switchToggle).toBe(3);
    expect(ACTION_TYPE.httpGet).toBe(50);
  });

  it('exposes the wizard action kinds', () => {
    expect(ACTION_KINDS).toContain('switch-device');
    expect(ACTION_KINDS).toContain('blebox-device');
    expect(ACTION_KINDS).toContain('invoke-url');
  });
});
