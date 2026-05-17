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
 * Action-type enum. `1/2/3` (native switch, `param: ""`) and `50` (HTTP GET,
 * `param` = URL) are observed on a live switchBox. Device `fieldsPreferences`
 * also lists `7,8,9,10,51,52,53` — add them to the labels map below as they
 * are implemented. See `docs/action-shape.md`.
 */
export const ACTION_TYPE = {
  unconfigured: 0,
  switchOn: 1,
  switchOff: 2,
  switchToggle: 3,
  httpGet: 50,
} as const;

/** Empty/unconfigured action slot sentinel. */
export const ACTION_TYPE_UNCONFIGURED = ACTION_TYPE.unconfigured;

export const ACTION_TYPE_LABELS: Record<number, string> = {
  0: 'Unconfigured',
  1: 'Switch ON',
  2: 'Switch OFF',
  3: 'Toggle',
  50: 'HTTP GET',
};

/** Returns a human label for an action type, falling back to the raw number. */
export function actionTypeLabel(value: number): string {
  return ACTION_TYPE_LABELS[value] ?? `Action ${value}`;
}

/**
 * UI-level action kinds for the wizard. `switch-device` writes a native switch
 * action (`actionType` 1/2/3); the other two write an HTTP GET (`actionType`
 * 50) and differ only in how the `param` URL is built.
 */
export const ACTION_KINDS = ['switch-device', 'blebox-device', 'invoke-url'] as const;
export type ActionKind = (typeof ACTION_KINDS)[number];

export const ACTION_KIND_LABELS: Record<ActionKind, string> = {
  'switch-device': 'Switch this device',
  'blebox-device': 'BleBox device action',
  'invoke-url': 'Invoke URL (GET)',
};
