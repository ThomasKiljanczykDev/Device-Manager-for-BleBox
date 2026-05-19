import { z } from 'zod';
import { actionsDocumentSchema } from './schemas/actions';
import { TRIGGER_TYPE_UNCONFIGURED } from './constants';

/** Minimal JSON Schema node shape — enough to enrich generated schemas. */
export interface JsonSchemaNode {
  type?: string | string[];
  properties?: Record<string, JsonSchemaNode>;
  items?: JsonSchemaNode;
  enum?: unknown[];
  description?: string;
  markdownDescription?: string;
  enumDescriptions?: string[];
  [key: string]: unknown;
}

export interface ActionsSchemaOptions {
  /** Trigger-type values the target device accepts (from `fieldsPreferences`). */
  triggerTypes?: number[];
  /** Action-type values the target device accepts (from `fieldsPreferences`). */
  actionTypes?: number[];
  /** Localised labels per trigger-type value, for Monaco `enumDescriptions`. */
  triggerTypeLabels?: Record<number, string>;
  /** Localised labels per action-type value, for Monaco `enumDescriptions`. */
  actionTypeLabels?: Record<number, string>;
  /** `param` template placeholders the device supports. */
  placeholders?: string[];
}

/**
 * Builds a JSON Schema for the editable actions document, derived from the Zod
 * schema (`actionsDocumentSchema`) and enriched with device-specific enum
 * values so Monaco can offer labelled autocompletion and inline validation.
 */
export function buildActionsJsonSchema(options: ActionsSchemaOptions = {}): JsonSchemaNode {
  const root = z.toJSONSchema(actionsDocumentSchema, {
    target: 'draft-7',
    reused: 'inline',
  }) as JsonSchemaNode;

  const itemProps = root.properties?.actions?.items?.properties;
  if (!itemProps) return root;

  const { triggerType, actionType, param } = itemProps;

  const label = (labels: Record<number, string> | undefined, value: number) =>
    labels?.[value] ? `${value} — ${labels[value]}` : String(value);

  if (triggerType && options.triggerTypes?.length) {
    // 0 (unconfigured) is always valid — empty action slots use it.
    const values = [...new Set([TRIGGER_TYPE_UNCONFIGURED, ...options.triggerTypes])];
    triggerType.enum = values;
    triggerType.enumDescriptions = values.map((v) => label(options.triggerTypeLabels, v));
    triggerType.description = 'Trigger type (device-specific; 0 = unconfigured)';
  }

  if (actionType && options.actionTypes?.length) {
    actionType.enum = options.actionTypes;
    actionType.enumDescriptions = options.actionTypes.map((v) =>
      label(options.actionTypeLabels, v),
    );
    actionType.description = 'Action type (0 = unconfigured, 50 = HTTP GET)';
  }

  if (param && options.placeholders?.length) {
    param.markdownDescription = `HTTP GET URL. Placeholders: ${options.placeholders
      .map((p) => `\`${p}\``)
      .join(', ')}`;
  }

  return root;
}
