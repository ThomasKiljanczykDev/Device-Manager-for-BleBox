import { create } from 'zustand';
import {
  ACTION_TYPE_UNCONFIGURED,
  TRIGGER_TYPE_UNCONFIGURED,
  type Action,
  type ActionsState,
  type FieldPreference,
} from '@blebox/shared';

/** An empty/unconfigured slot at a given id. */
function emptySlot(id: number): Action {
  return {
    id,
    name: '',
    input: 0,
    triggerType: TRIGGER_TYPE_UNCONFIGURED,
    actionType: ACTION_TYPE_UNCONFIGURED,
    param: '',
  };
}

interface ActionsDraftState {
  ip: string | null;
  /** Working copy edited by the wizard and JSON editor. */
  working: Action[];
  /** Last state loaded from (or saved to) the device — the dirty baseline. */
  snapshot: Action[];
  itemsLimit: number;
  fieldsPreferences: FieldPreference[];

  /** Initializes the draft from a fresh device response. */
  loadFromDevice: (ip: string, state: ActionsState) => void;
  /** Replaces a single slot (wizard create/edit). */
  upsertAction: (action: Action) => void;
  /** Clears a slot back to unconfigured (delete). */
  deleteAction: (id: number) => void;
  /** Replaces the whole working array (JSON editor). */
  replaceAll: (actions: Action[]) => void;
  /** Discards edits, restoring the snapshot. */
  revert: () => void;
  /** Marks the working copy as the new clean baseline (after a successful save). */
  commitSnapshot: () => void;
}

export const useActionsDraftStore = create<ActionsDraftState>((set) => ({
  ip: null,
  working: [],
  snapshot: [],
  itemsLimit: 0,
  fieldsPreferences: [],

  loadFromDevice: (ip, state) => {
    // `lastCall` is server-managed read-only telemetry — keep it out of the
    // editable draft so the JSON editor schema and dirty checks stay clean.
    const actions = state.actions.map(({ lastCall: _lastCall, ...rest }) => rest);
    set({
      ip,
      working: actions,
      snapshot: actions,
      itemsLimit: state.itemsLimit ?? actions.length,
      fieldsPreferences: state.fieldsPreferences ?? [],
    });
  },

  upsertAction: (action) =>
    set((draft) => ({
      working: draft.working.map((slot) => (slot.id === action.id ? action : slot)),
    })),

  deleteAction: (id) =>
    set((draft) => ({
      working: draft.working.map((slot) => (slot.id === id ? emptySlot(id) : slot)),
    })),

  replaceAll: (actions) => set({ working: actions }),

  revert: () => set((draft) => ({ working: draft.snapshot })),

  commitSnapshot: () => set((draft) => ({ snapshot: draft.working })),
}));

/** Whether the working copy diverges from the device snapshot. */
export function isActionsDraftDirty(state: Pick<ActionsDraftState, 'working' | 'snapshot'>): boolean {
  return JSON.stringify(state.working) !== JSON.stringify(state.snapshot);
}

export { emptySlot };
