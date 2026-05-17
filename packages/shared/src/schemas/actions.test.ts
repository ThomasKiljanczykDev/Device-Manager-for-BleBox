import { describe, expect, it } from 'vitest';
import {
  actionSchema,
  actionSetPayloadSchema,
  actionsDocumentSchema,
  actionsStateSchema,
  allowedActionTypes,
  allowedTriggerTypes,
  deriveInputCount,
  triggerParamRange,
  triggerUsesInterval,
} from './actions';

/** Trimmed but faithful capture of `GET /api/actions/state` from 192.168.88.200. */
const sample = {
  actions: [
    {
      id: 0,
      name: 'IN1 - OUT OFF',
      input: 0,
      triggerType: 1,
      actionType: 50,
      lastCall: { timeElapsedS: 82595, response: { status: 200, errorCode: 0 } },
      triggerParam: 0,
      intervalS: 0,
      throttleS: 0,
      param: 'http://192.168.88.217:8123/api/webhook/example?action=off',
    },
    {
      id: 4,
      name: '',
      input: 0,
      triggerType: 0,
      actionType: 0,
      lastCall: { timeElapsedS: -1 },
      param: '',
    },
  ],
  itemsLimit: 30,
  fieldsPreferences: [
    {
      name: 'triggerType',
      values: [1, 2, 3, 4, 5, 19, 42, 43],
      dependsOn: 'input',
      constraints: [
        { input: null, triggerType: [19, 42, 43] },
        { input: 0, triggerType: [1, 2, 3, 4, 5] },
        { input: 1, triggerType: [1, 2, 3, 4, 5] },
        { input: 2, triggerType: [1, 2, 3, 4, 5] },
        { input: 3, triggerType: [1, 2, 3, 4, 5] },
        { input: 4, triggerType: [1, 2, 3, 4, 5] },
      ],
    },
    {
      name: 'triggerParam',
      dependsOn: 'triggerType',
      constraints: [
        { triggerType: 42, triggerParam: { minValue: 0, maxValue: 3680, multiplier: 1 } },
        { triggerType: 43, triggerParam: { minValue: 0, maxValue: 3680, multiplier: 1 } },
      ],
    },
    {
      name: 'actionType',
      dependsOn: 'triggerType',
      constraints: [
        { triggerType: 1, actionType: [1, 2, 3, 7, 8, 9, 10, 50, 51, 52, 53] },
        { triggerType: 42, actionType: [2, 8, 10, 50, 51, 52, 53] },
      ],
    },
    { name: 'param', placeholders: ['{s_state.0}', '{power_w.0}'] },
    { name: 'intervalS', dependsOn: 'triggerType', dependsOnValues: [42, 43] },
    { name: 'throttleS', dependsOn: 'triggerType', dependsOnValues: [42, 43] },
  ],
};

describe('actionSchema', () => {
  it('accepts a configured action and an empty slot', () => {
    expect(actionSchema.safeParse(sample.actions[0]).success).toBe(true);
    expect(actionSchema.safeParse(sample.actions[1]).success).toBe(true);
  });

  it('rejects invalid actions', () => {
    expect(actionSchema.safeParse({ id: 0, name: 'x' }).success).toBe(false);
    expect(
      actionSchema.safeParse({ ...sample.actions[0], input: -1 }).success,
    ).toBe(false);
    expect(
      actionSchema.safeParse({ ...sample.actions[0], param: 123 }).success,
    ).toBe(false);
  });
});

describe('device-specific fields round-trip', () => {
  it('preserves unknown/extra action fields (e.g. relay/forTime/ns)', () => {
    const withExtras = {
      ...sample.actions[0],
      relay: 0,
      forTime: 0,
      ns: 0,
      hwSpecific: 'keep-me',
    };
    const parsed = actionSchema.parse(withExtras);
    expect(parsed.relay).toBe(0);
    expect(parsed.forTime).toBe(0);
    expect(parsed.ns).toBe(0);
    expect((parsed as Record<string, unknown>).hwSpecific).toBe('keep-me');
  });
});

describe('set / document payloads', () => {
  it('actionSetPayloadSchema wraps a single action', () => {
    const result = actionSetPayloadSchema.safeParse({ action: sample.actions[0] });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.action.id).toBe(0);
  });

  it('actionSetPayloadSchema rejects an array payload', () => {
    expect(actionSetPayloadSchema.safeParse({ actions: [] }).success).toBe(false);
  });

  it('actionsDocumentSchema accepts the full editable document', () => {
    expect(
      actionsDocumentSchema.safeParse({ actions: sample.actions.map((a) => a) }).success,
    ).toBe(true);
  });
});

describe('actionsStateSchema', () => {
  it('parses the full captured payload', () => {
    const result = actionsStateSchema.safeParse(sample);
    expect(result.success).toBe(true);
  });

  it('rejects a payload missing the actions array', () => {
    expect(actionsStateSchema.safeParse({ itemsLimit: 30 }).success).toBe(false);
  });
});

describe('fieldsPreferences interpreters', () => {
  const state = actionsStateSchema.parse(sample);
  const prefs = state.fieldsPreferences;

  it('allowedTriggerTypes resolves per input', () => {
    expect(allowedTriggerTypes(prefs, 0)).toEqual([1, 2, 3, 4, 5]);
    expect(allowedTriggerTypes(prefs, null)).toEqual([19, 42, 43]);
    expect(allowedTriggerTypes(prefs, 99)).toEqual([1, 2, 3, 4, 5, 19, 42, 43]);
  });

  it('allowedActionTypes resolves per trigger type', () => {
    expect(allowedActionTypes(prefs, 1)).toContain(50);
    expect(allowedActionTypes(prefs, 42)).toEqual([2, 8, 10, 50, 51, 52, 53]);
    expect(allowedActionTypes(prefs, 999)).toEqual([]);
  });

  it('triggerParamRange resolves bounds for power triggers only', () => {
    expect(triggerParamRange(prefs, 42)).toEqual({
      minValue: 0,
      maxValue: 3680,
      multiplier: 1,
    });
    expect(triggerParamRange(prefs, 1)).toBeNull();
  });

  it('triggerUsesInterval flags power triggers', () => {
    expect(triggerUsesInterval(prefs, 42)).toBe(true);
    expect(triggerUsesInterval(prefs, 1)).toBe(false);
  });

  it('deriveInputCount counts distinct non-null inputs', () => {
    expect(deriveInputCount(state)).toBe(5);
  });
});
