import { zodToJsonSchema } from 'zod-to-json-schema';
import { actionsDocumentSchema } from './schemas/actions';
import { triggerTypeLabel } from './constants';

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
  /** `param` template placeholders the device supports. */
  placeholders?: string[];
}

/**
 * Builds a JSON Schema for the editable actions document, derived from the Zod
 * schema (`actionsDocumentSchema`) and enriched with device-specific enum
 * values so Monaco can offer labelled autocompletion and inline validation.
 */
export function buildActionsJsonSchema(options: ActionsSchemaOptions = {}): JsonSchemaNode {
  const root = zodToJsonSchema(actionsDocumentSchema, {
    $refStrategy: 'none',
    target: 'jsonSchema7',
  }) as JsonSchemaNode;

  const itemProps = root.properties?.actions?.items?.properties;
  if (!itemProps) return root;

  const { triggerType, actionType, param } = itemProps;

  if (triggerType && options.triggerTypes?.length) {
    triggerType.enum = options.triggerTypes;
    triggerType.enumDescriptions = options.triggerTypes.map(
      (t) => `${t} — ${triggerTypeLabel(t)}`,
    );
    triggerType.description = 'Trigger type (device-specific; 0 = unconfigured)';
  }

  if (actionType && options.actionTypes?.length) {
    actionType.enum = options.actionTypes;
    actionType.description = 'Action type — 50 is the HTTP GET action this app writes';
  }

  if (param && options.placeholders?.length) {
    param.markdownDescription = `HTTP GET URL. Placeholders: ${options.placeholders
      .map((p) => `\`${p}\``)
      .join(', ')}`;
  }

  return root;
}
