import { describe, expect, it } from 'vitest';
import {
  ACTION_KIND_LABELS,
  ACTION_TYPE,
  ACTION_TYPE_LABELS,
  actionTypeLabel,
  isSupportedDeviceType,
  triggerTypeLabel,
  TRIGGER_TYPE_LABELS,
} from './constants';

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

describe('trigger type labels', () => {
  it('maps documented trigger types 1-5', () => {
    expect(TRIGGER_TYPE_LABELS[1]).toBe('Short click');
    expect(TRIGGER_TYPE_LABELS[2]).toBe('Long click');
    expect(TRIGGER_TYPE_LABELS[3]).toBe('Falling edge');
    expect(TRIGGER_TYPE_LABELS[4]).toBe('Rising edge');
    expect(TRIGGER_TYPE_LABELS[5]).toBe('Any edge');
  });

  it('labels the unconfigured slot and observed device triggers', () => {
    expect(TRIGGER_TYPE_LABELS[0]).toBe('Unconfigured');
    expect(TRIGGER_TYPE_LABELS[42]).toMatch(/threshold/i);
  });

  it('falls back to a numeric label for unknown trigger types', () => {
    expect(triggerTypeLabel(123)).toBe('Trigger 123');
  });
});

describe('action kinds', () => {
  it('exposes labels for all UI action kinds', () => {
    expect(ACTION_KIND_LABELS['switch-device']).toBe('Switch this device');
    expect(ACTION_KIND_LABELS['blebox-device']).toBe('BleBox device action');
    expect(ACTION_KIND_LABELS['invoke-url']).toBe('Invoke URL (GET)');
  });
});

describe('action types', () => {
  it('maps the action-type enum to its values', () => {
    expect(ACTION_TYPE.unconfigured).toBe(0);
    expect(ACTION_TYPE.switchOn).toBe(1);
    expect(ACTION_TYPE.switchOff).toBe(2);
    expect(ACTION_TYPE.switchToggle).toBe(3);
    expect(ACTION_TYPE.httpGet).toBe(50);
  });

  it('labels native switch and HTTP GET action types', () => {
    expect(ACTION_TYPE_LABELS[0]).toBe('Unconfigured');
    expect(actionTypeLabel(ACTION_TYPE.switchOn)).toBe('Switch ON');
    expect(actionTypeLabel(ACTION_TYPE.switchOff)).toBe('Switch OFF');
    expect(actionTypeLabel(ACTION_TYPE.switchToggle)).toBe('Toggle');
    expect(actionTypeLabel(ACTION_TYPE.httpGet)).toBe('HTTP GET');
  });

  it('falls back to a numeric label for unknown action types', () => {
    expect(actionTypeLabel(99)).toBe('Action 99');
  });
});
