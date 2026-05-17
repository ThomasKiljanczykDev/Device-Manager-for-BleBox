/**
 * BleBox-wide constants: device families, trigger types and action kinds.
 *
 * This package is framework-free and locale-free — it holds the numeric enum
 * values only. Human-readable labels live in the web app's i18n resources.
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
 * Trigger types: 1–5 are documented in the public buttonBox spec
 * (`GET /t/{inputId}/{triggerType}`); 0 and 19/42/43 are observed on the live
 * device — see `docs/action-shape.md`. The full set is device-driven (from
 * `fieldsPreferences`), so only the unconfigured sentinel is fixed here.
 */
export const TRIGGER_TYPE_UNCONFIGURED = 0;

/**
 * Action-type enum. `1/2/3` (native switch, `param: ""`) and `50` (HTTP GET,
 * `param` = URL) are observed on a live switchBox. Device `fieldsPreferences`
 * also lists `7,8,9,10,51,52,53`, not yet handled. See `docs/action-shape.md`.
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

/**
 * UI-level action kinds for the wizard. `switch-device` writes a native switch
 * action (`actionType` 1/2/3); the other two write an HTTP GET (`actionType`
 * 50) and differ only in how the `param` URL is built.
 */
export const ACTION_KINDS = ['switch-device', 'blebox-device', 'invoke-url'] as const;
export type ActionKind = (typeof ACTION_KINDS)[number];
