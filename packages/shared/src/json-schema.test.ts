import { describe, expect, it } from 'vitest';
import { buildActionsJsonSchema } from './json-schema';

describe('buildActionsJsonSchema', () => {
  it('produces an object schema with an actions array', () => {
    const schema = buildActionsJsonSchema();
    expect(schema.type).toBe('object');
    expect(schema.properties?.actions?.type).toBe('array');
  });

  it('injects device-specific trigger-type enums and labels', () => {
    const schema = buildActionsJsonSchema({ triggerTypes: [1, 2, 42] });
    const triggerType = schema.properties?.actions?.items?.properties?.triggerType;
    expect(triggerType?.enum).toEqual([1, 2, 42]);
    expect(triggerType?.enumDescriptions?.[0]).toMatch(/Short click/);
  });

  it('documents param placeholders when provided', () => {
    const schema = buildActionsJsonSchema({ placeholders: ['{power_w.0}'] });
    const param = schema.properties?.actions?.items?.properties?.param;
    expect(param?.markdownDescription).toContain('{power_w.0}');
  });
});
