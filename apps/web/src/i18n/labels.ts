import type { TFunction } from 'i18next';
import type { ActionKind } from '@blebox/shared';

/**
 * Localised labels for device-driven enum values. Trigger and action types are
 * open-ended (the device may report values beyond those in `en.json`), so a
 * `fallback` key supplies a generic label. The key cast is the single point
 * where a dynamic translation key is used.
 */

export function triggerTypeLabel(t: TFunction, value: number): string {
  return t(`triggerType.${value}` as 'triggerType.0', {
    defaultValue: t('triggerType.fallback', { value }),
  });
}

export function actionTypeLabel(t: TFunction, value: number): string {
  return t(`actionType.${value}` as 'actionType.0', {
    defaultValue: t('actionType.fallback', { value }),
  });
}

export function actionKindLabel(t: TFunction, kind: ActionKind): string {
  return t(`actionKind.${kind}`);
}

export function commandLabel(t: TFunction, deviceType: string, commandId: string): string {
  return t(`command.${deviceType}.${commandId}` as 'command.switchBox.on', {
    defaultValue: commandId,
  });
}

export function commandParamLabel(t: TFunction, name: 'relay' | 'hex'): string {
  return t(`commandParam.${name}`);
}
