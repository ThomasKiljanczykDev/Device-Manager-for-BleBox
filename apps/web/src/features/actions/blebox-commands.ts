/**
 * Curated catalog of BleBox `/s/...` control commands, derived from the public
 * OpenAPI specs (committed under `packages/shared/blebox-specs`). The wizard's
 * "BleBox device action" mode uses this to build a `/s/...` GET URL targeting
 * another device; see `docs/decisions.md` for why a catalog is used instead of
 * driving the generated device clients.
 *
 * Display labels are not stored here — the wizard renders them via i18n
 * (`command.*` / `commandParam.*` keys) from each command `id` and param `name`.
 */

export type CommandParamName = 'relay' | 'hex';

export interface CommandParam {
  name: CommandParamName;
}

export interface BleboxCommand {
  id: string;
  params: CommandParam[];
  /** Builds the device-relative path, e.g. `s/1`. */
  build: (values: { relay: string; hex: string }) => string;
}

const relayParam: CommandParam = { name: 'relay' };
const hexParam: CommandParam = { name: 'hex' };

/** Commands available per target device `type`. buttonBox has no outputs. */
export const COMMAND_CATALOG: Record<string, BleboxCommand[]> = {
  switchBox: [
    { id: 'on', params: [], build: () => 's/1' },
    { id: 'off', params: [], build: () => 's/0' },
    { id: 'toggle', params: [], build: () => 's/2' },
  ],
  switchBoxD: [
    { id: 'on', params: [relayParam], build: (v) => `s/${v.relay || '0'}/1` },
    { id: 'off', params: [relayParam], build: (v) => `s/${v.relay || '0'}/0` },
    { id: 'toggle', params: [relayParam], build: (v) => `s/${v.relay || '0'}/2` },
  ],
  wLightBox: [
    { id: 'color', params: [hexParam], build: (v) => `s/${v.hex || 'FFFFFFFF'}` },
    { id: 'on', params: [], build: () => 's/onlast' },
    { id: 'toggle', params: [], build: () => 's/offon/last' },
  ],
};

/** Device types that can be controlled as an action target. */
export const CONTROLLABLE_TYPES = Object.keys(COMMAND_CATALOG);

export function commandsFor(deviceType: string): BleboxCommand[] {
  return COMMAND_CATALOG[deviceType] ?? [];
}
