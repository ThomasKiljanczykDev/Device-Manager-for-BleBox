import { create } from 'zustand';
import {
  ACTION_TYPE_UNCONFIGURED,
  TRIGGER_TYPE_UNCONFIGURED,
  type Action,
  type ActionsState,
  type FieldPreference,
} from '@/shared';

/**
 * A blank action carrying every field the device puts on its actions, zeroed.
 * The device's empty slots are a minimal subset (`id/name/input/triggerType/
 * actionType/param`), but configured actions may carry more (e.g. some
 * switchBox firmware adds `relay`/`forTime`/`ns`) and reject a save that omits
 * them. New actions are built on top of this template so they match the shape
 * the device expects.
 */
function buildActionTemplate(actions: Action[]): Action {
  const template: Record<string, unknown> = {
    id: 0,
    name: '',
    input: 0,
    triggerType: TRIGGER_TYPE_UNCONFIGURED,
    actionType: ACTION_TYPE_UNCONFIGURED,
    param: '',
  };
  for (const action of actions) {
    for (const [key, value] of Object.entries(action)) {
      if (key === 'lastCall' || key in template) continue;
      template[key] = typeof value === 'string' ? '' : 0;
    }
  }
  return template as Action;
}

/** Resets a slot to unconfigured, preserving device-specific fields. */
function clearSlot(slot: Action): Action {
  return {
    ...slot,
    name: '',
    triggerType: TRIGGER_TYPE_UNCONFIGURED,
    actionType: ACTION_TYPE_UNCONFIGURED,
    triggerParam: 0,
    intervalS: 0,
    throttleS: 0,
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
  /** Blank action with the device's full field set — base for new actions. */
  actionTemplate: Action;

  /** Initializes the draft from a fresh device response. */
  loadFromDevice: (ip: string, state: ActionsState) => void;
  /** Replaces a single slot (wizard create/edit). */
  upsertAction: (action: Action) => void;
  /** Clears a slot back to unconfigured (delete). */
  deleteAction: (id: number) => void;
  /**
   * Merges actions edited in the JSON editor back into the fixed slot array,
   * matched by `id`. A slot that was configured but is absent from the edited
   * set is treated as deleted and cleared.
   */
  mergeActions: (edited: Action[]) => void;
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
  actionTemplate: buildActionTemplate([]),

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
      actionTemplate: buildActionTemplate(actions),
    });
  },

  upsertAction: (action) =>
    set((draft) => ({
      working: draft.working.map((slot) => (slot.id === action.id ? action : slot)),
    })),

  deleteAction: (id) =>
    set((draft) => ({
      working: draft.working.map((slot) => (slot.id === id ? clearSlot(slot) : slot)),
    })),

  mergeActions: (edited) =>
    set((draft) => {
      const byId = new Map(edited.map((action) => [action.id, action]));
      return {
        working: draft.working.map((slot) => {
          const next = byId.get(slot.id);
          if (next) return next;
          // A slot configured before but absent from the editor was removed.
          return slot.triggerType === TRIGGER_TYPE_UNCONFIGURED ? slot : clearSlot(slot);
        }),
      };
    }),

  revert: () => set((draft) => ({ working: draft.snapshot })),

  commitSnapshot: () => set((draft) => ({ snapshot: draft.working })),
}));

/** Whether the working copy diverges from the device snapshot. */
export function isActionsDraftDirty(state: Pick<ActionsDraftState, 'working' | 'snapshot'>): boolean {
  return JSON.stringify(state.working) !== JSON.stringify(state.snapshot);
}
