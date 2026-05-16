/**
 * BleBox-wide constants: device families, trigger types and action kinds.
 *
 * Sources are noted per value — "documented" means it appears in a public
 * BleBox OpenAPI spec; "observed" means it was only seen on the live device
 * `192.168.88.200` (a `switchBox`, apiLevel `20220505`).
 */

/** Device `type` values this app understands and surfaces in the UI. */
export const SUPPORTED_DEVICE_TYPES = [
  'switchBox',
  'switchBoxD',
  'buttonBox',
  'wLightBox',
] as const;

export type SupportedDeviceType = (typeof SUPPORTED_DEVICE_TYPES)[number];

/** Narrows an arbitrary device `type` string to a supported family. */
export function isSupportedDeviceType(type: string): type is SupportedDeviceType {
  return (SUPPORTED_DEVICE_TYPES as readonly string[]).includes(type);
}

/**
 * Trigger-type enum. 1–5 are documented in the public buttonBox spec
 * (`GET /t/{inputId}/{triggerType}`); 0 and 19/42/43 are observed on the live
 * device and inferred — see `docs/action-shape.md`.
 */
export const TRIGGER_TYPE_LABELS: Record<number, string> = {
  0: 'Unconfigured', // observed: empty action slot
  1: 'Short click', // documented
  2: 'Long click', // documented
  3: 'Falling edge', // documented
  4: 'Rising edge', // documented
  5: 'Any edge', // documented
  19: 'Device event', // observed/inferred — device-level trigger (input: null)
  42: 'Power above threshold', // observed/inferred — triggerParam = watts (0..3680)
  43: 'Power below threshold', // observed/inferred — triggerParam = watts (0..3680)
};

/** Empty/unconfigured action slot sentinel. */
export const TRIGGER_TYPE_UNCONFIGURED = 0;

/** Returns a human label for a trigger type, falling back to the raw number. */
export function triggerTypeLabel(value: number): string {
  return TRIGGER_TYPE_LABELS[value] ?? `Trigger ${value}`;
}

/**
 * `actionType` 50 is the generic HTTP-GET action (`param` holds the URL).
 * It is the only action type this app writes — both UI "action kinds" below
 * compile down to it. Observed on the live device; not in any public spec.
 */
export const HTTP_GET_ACTION_TYPE = 50;

/** Empty/unconfigured action slot sentinel. */
export const ACTION_TYPE_UNCONFIGURED = 0;

/**
 * UI-level action kinds. Both persist as `actionType: 50`; they differ only in
 * how the `param` URL is constructed in the wizard.
 */
export const ACTION_KINDS = ['blebox-device', 'invoke-url'] as const;
export type ActionKind = (typeof ACTION_KINDS)[number];

export const ACTION_KIND_LABELS: Record<ActionKind, string> = {
  'blebox-device': 'BleBox device action',
  'invoke-url': 'Invoke URL (GET)',
};
