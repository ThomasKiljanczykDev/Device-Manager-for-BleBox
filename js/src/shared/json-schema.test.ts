import { describe, expect, it } from 'vitest';
import { buildActionsJsonSchema } from './json-schema';

describe('buildActionsJsonSchema', () => {
  it('produces an object schema with an actions array', () => {
    const schema = buildActionsJsonSchema();
    expect(schema.type).toBe('object');
    expect(schema.properties?.actions?.type).toBe('array');
  });

  it('injects device-specific trigger-type enums and always allows 0', () => {
    const schema = buildActionsJsonSchema({
      triggerTypes: [1, 2, 42],
      triggerTypeLabels: { 0: 'Unconfigured', 1: 'Short click' },
    });
    const triggerType = schema.properties?.actions?.items?.properties?.triggerType;
    expect(triggerType?.enum).toEqual([0, 1, 2, 42]);
    expect(triggerType?.enumDescriptions?.[0]).toBe('0 — Unconfigured');
    expect(triggerType?.enumDescriptions?.[1]).toBe('1 — Short click');
  });

  it('falls back to the bare value when no label is supplied', () => {
    const schema = buildActionsJsonSchema({ actionTypes: [50] });
    const actionType = schema.properties?.actions?.items?.properties?.actionType;
    expect(actionType?.enumDescriptions).toEqual(['50']);
  });

  it('documents param placeholders when provided', () => {
    const schema = buildActionsJsonSchema({ placeholders: ['{power_w.0}'] });
    const param = schema.properties?.actions?.items?.properties?.param;
    expect(param?.markdownDescription).toContain('{power_w.0}');
  });
});
