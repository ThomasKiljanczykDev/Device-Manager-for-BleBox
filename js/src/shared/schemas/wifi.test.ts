import { describe, expect, it } from 'vitest';
import { zApSettings } from './wifi';

describe('zApSettings', () => {
  it('accepts a full AP settings object', () => {
    expect(zApSettings.safeParse({ apEnable: true, apSSID: 'switchBox-abc123' }).success).toBe(
      true,
    );
  });

  it('accepts a partial object with only apEnable', () => {
    expect(zApSettings.safeParse({ apEnable: false }).success).toBe(true);
  });

  it('rejects an empty or over-long apSSID', () => {
    expect(zApSettings.safeParse({ apEnable: true, apSSID: '' }).success).toBe(false);
    expect(zApSettings.safeParse({ apEnable: true, apSSID: 'x'.repeat(33) }).success).toBe(false);
  });
});
