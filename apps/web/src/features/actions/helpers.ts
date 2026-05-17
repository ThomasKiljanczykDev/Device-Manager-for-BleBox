import {
  ACTION_TYPE,
  actionTypeLabel,
  TRIGGER_TYPE_UNCONFIGURED,
  type Action,
} from '@blebox/shared';

/** A slot is "configured" once it has a non-zero trigger type. */
export function isConfigured(action: Action): boolean {
  return action.triggerType !== TRIGGER_TYPE_UNCONFIGURED;
}

/** The configured actions only, in slot order. */
export function configuredActions(actions: Action[]): Action[] {
  return actions.filter(isConfigured);
}

/** Id of the first empty slot, or `null` if every slot is in use. */
export function firstEmptySlotId(actions: Action[]): number | null {
  return actions.find((a) => !isConfigured(a))?.id ?? null;
}

/** Distinct input indices that appear in configured actions. */
export function inputsInUse(actions: Action[]): number[] {
  return [...new Set(configuredActions(actions).map((a) => a.input))].sort((a, b) => a - b);
}

/** Short human summary of an action's effect. */
export function actionSummary(action: Action): string {
  if (action.actionType === ACTION_TYPE.httpGet) {
    return action.param ? `${actionTypeLabel(action.actionType)} ${action.param}` : '—';
  }
  return actionTypeLabel(action.actionType);
}
