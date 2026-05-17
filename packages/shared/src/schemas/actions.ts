import { z } from 'zod';

/**
 * BleBox action schema — the shape was reverse-engineered from the live device
 * `192.168.88.200` (`GET /api/actions/state`), since the action CRUD surface is
 * not in any public BleBox OpenAPI spec. See `docs/action-shape.md`.
 */

/** Runtime telemetry of an action's last execution. Server-managed, read-only. */
export const lastCallSchema = z.object({
  timeElapsedS: z.number(),
  response: z
    .object({
      status: z.number(),
      errorCode: z.number(),
    })
    .optional(),
});

export type LastCall = z.infer<typeof lastCallSchema>;

/**
 * A single action slot. The device exposes a fixed array of `itemsLimit` slots.
 *
 * Modelled as a **loose** object: the field set varies by device/firmware —
 * e.g. some switchBox hardware adds `relay`, `forTime` and `ns`. Unknown fields
 * are preserved so the action can be round-tripped back to `/api/actions/set`
 * intact; dropping them makes the device reject the save with HTTP 400.
 */
export const actionSchema = z.looseObject({
  id: z.number().int().nonnegative(),
  name: z.string(),
  input: z.number().int().nonnegative(),
  triggerType: z.number().int().nonnegative(),
  actionType: z.number().int().nonnegative(),
  triggerParam: z.number().int().optional(),
  intervalS: z.number().int().nonnegative().optional(),
  throttleS: z.number().int().nonnegative().optional(),
  relay: z.number().int().optional(),
  forTime: z.number().int().optional(),
  ns: z.number().int().optional(),
  param: z.string(),
  lastCall: lastCallSchema.optional(),
});

export type Action = z.infer<typeof actionSchema>;

/** A numeric constraint range (e.g. `triggerParam` bounds for power triggers). */
export const numericRangeSchema = z.object({
  minValue: z.number(),
  maxValue: z.number(),
  multiplier: z.number().optional(),
  specialValues: z.record(z.string(), z.number()).optional(),
});

export type NumericRange = z.infer<typeof numericRangeSchema>;

/**
 * One entry of the `fieldsPreferences` array. This is a polymorphic, name-keyed
 * structure (different keys per `name`), so it is modelled permissively and
 * interpreted by the helper functions below.
 */
export const fieldPreferenceSchema = z
  .looseObject({
    name: z.string(),
    values: z.array(z.number()).optional(),
    placeholders: z.array(z.string()).optional(),
    dependsOn: z.string().optional(),
    dependsOnValues: z.array(z.number()).optional(),
    minValue: z.number().optional(),
    maxValue: z.number().optional(),
    constraints: z.array(z.record(z.string(), z.unknown())).optional(),
  });

export type FieldPreference = z.infer<typeof fieldPreferenceSchema>;

/** `GET /api/actions/state` response. */
export const actionsStateSchema = z.object({
  actions: z.array(actionSchema),
  itemsLimit: z.number().int().optional(),
  fieldsPreferences: z.array(fieldPreferenceSchema).optional(),
});

export type ActionsState = z.infer<typeof actionsStateSchema>;

/**
 * The full actions document as edited in the Monaco JSON editor — the working
 * draft, not a device payload.
 */
export const actionsDocumentSchema = z.object({
  actions: z.array(actionSchema),
});

export type ActionsDocument = z.infer<typeof actionsDocumentSchema>;

/**
 * `POST /api/actions/set` request body — a single-action upsert keyed by `id`.
 * The endpoint takes one action at a time.
 *
 * Verified against the device's own wBox UI bundle (`settings.js` sends
 * `payload: { action: n }`). The action object is round-tripped: the device's
 * object is sent back with only the edited fields changed. See
 * `docs/action-shape.md`.
 */
export const actionSetPayloadSchema = z.object({
  action: actionSchema,
});

export type ActionSetPayload = z.infer<typeof actionSetPayloadSchema>;

// --- fieldsPreferences interpreters ----------------------------------------

function findPreference(prefs: FieldPreference[] | undefined, name: string) {
  return prefs?.find((p) => p.name === name);
}

/** Trigger types valid for a given input, derived from `fieldsPreferences`. */
export function allowedTriggerTypes(
  prefs: FieldPreference[] | undefined,
  input: number | null,
): number[] {
  const pref = findPreference(prefs, 'triggerType');
  if (!pref) return [];
  for (const c of pref.constraints ?? []) {
    if (c.input === input && Array.isArray(c.triggerType)) {
      return c.triggerType as number[];
    }
  }
  return pref.values ?? [];
}

/** Action types valid for a given trigger type, derived from `fieldsPreferences`. */
export function allowedActionTypes(
  prefs: FieldPreference[] | undefined,
  triggerType: number,
): number[] {
  const pref = findPreference(prefs, 'actionType');
  for (const c of pref?.constraints ?? []) {
    if (c.triggerType === triggerType && Array.isArray(c.actionType)) {
      return c.actionType as number[];
    }
  }
  return [];
}

/** `triggerParam` numeric bounds for a trigger type, or `null` if not applicable. */
export function triggerParamRange(
  prefs: FieldPreference[] | undefined,
  triggerType: number,
): NumericRange | null {
  const pref = findPreference(prefs, 'triggerParam');
  for (const c of pref?.constraints ?? []) {
    if (c.triggerType === triggerType) {
      const parsed = numericRangeSchema.safeParse(c.triggerParam);
      if (parsed.success) return parsed.data;
    }
  }
  return null;
}

/** Whether `intervalS`/`throttleS` apply to a trigger type. */
export function triggerUsesInterval(
  prefs: FieldPreference[] | undefined,
  triggerType: number,
): boolean {
  const interval = findPreference(prefs, 'intervalS');
  return interval?.dependsOnValues?.includes(triggerType) ?? false;
}

/** Template placeholders the device accepts inside a `param` URL. */
export function paramPlaceholders(prefs: FieldPreference[] | undefined): string[] {
  return findPreference(prefs, 'param')?.placeholders ?? [];
}

/**
 * Number of physical inputs, derived from the non-null `input` values listed in
 * the `triggerType` constraints. switchBox hardware does not expose `inputs[]`
 * in `/state/extended`, so this is the reliable source.
 */
export function deriveInputCount(state: ActionsState): number {
  const pref = findPreference(state.fieldsPreferences, 'triggerType');
  const inputs = new Set<number>();
  for (const c of pref?.constraints ?? []) {
    if (typeof c.input === 'number') inputs.add(c.input);
  }
  return inputs.size;
}
