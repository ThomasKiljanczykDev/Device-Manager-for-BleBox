import { useMemo, useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { useTranslation } from 'react-i18next';
import {
  ACTION_KINDS,
  ACTION_TYPE,
  allowedTriggerTypes,
  triggerParamRange,
  triggerUsesInterval,
  type Action,
  type ActionKind,
} from '@/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  actionKindLabel,
  actionTypeLabel,
  commandLabel,
  commandParamLabel,
  triggerTypeLabel,
} from '@/i18n/labels';
import { useActionsDraftStore } from '@/stores/actions-draft';
import { useDeviceList } from '@/features/devices/queries';
import { commandsFor, CONTROLLABLE_TYPES } from './blebox-commands';

type SwitchOp = 'on' | 'off' | 'toggle';

interface WizardValues {
  name: string;
  triggerType: number;
  triggerParam: number;
  intervalS: number;
  throttleS: number;
  kind: ActionKind;
  switchOp: SwitchOp;
  url: string;
  targetIp: string;
  commandId: string;
  relay: string;
  hex: string;
}

/** UI switch operation -> native device action type. */
const SWITCH_ACTION_TYPE: Record<SwitchOp, number> = {
  on: ACTION_TYPE.switchOn,
  off: ACTION_TYPE.switchOff,
  toggle: ACTION_TYPE.switchToggle,
};

const SWITCH_OP_BY_ACTION_TYPE: Record<number, SwitchOp> = {
  [ACTION_TYPE.switchOn]: 'on',
  [ACTION_TYPE.switchOff]: 'off',
  [ACTION_TYPE.switchToggle]: 'toggle',
};

interface ActionWizardProps {
  deviceIp: string;
  inputId: number;
  actionId: number;
  existing?: Action;
  onClose: () => void;
}

function initialValues(existing: Action | undefined): WizardValues {
  const existingSwitchOp = existing ? SWITCH_OP_BY_ACTION_TYPE[existing.actionType] : undefined;
  // New actions default to the simplest kind; edits open on the matching kind.
  const kind: ActionKind = existingSwitchOp
    ? 'switch-device'
    : existing
      ? 'invoke-url'
      : 'switch-device';
  return {
    name: existing?.name ?? '',
    triggerType: existing?.triggerType ?? 0,
    triggerParam: existing?.triggerParam ?? 0,
    intervalS: existing?.intervalS ?? 0,
    throttleS: existing?.throttleS ?? 0,
    kind,
    switchOp: existingSwitchOp ?? 'on',
    url: existing?.param ?? '',
    targetIp: '',
    commandId: '',
    relay: '0',
    hex: 'FFFFFFFF',
  };
}

const isHttpUrl = (value: string) => /^https?:\/\/.+/i.test(value.trim());

/** Three-step wizard for creating/editing an action on an input. */
export function ActionWizard({ deviceIp, inputId, actionId, existing, onClose }: ActionWizardProps) {
  const { t } = useTranslation();
  const fieldsPreferences = useActionsDraftStore((s) => s.fieldsPreferences);
  const upsertAction = useActionsDraftStore((s) => s.upsertAction);
  const { entries } = useDeviceList();
  const [step, setStep] = useState(1);

  const triggerTypes = useMemo(
    () => allowedTriggerTypes(fieldsPreferences, inputId),
    [fieldsPreferences, inputId],
  );
  const targetDevices = useMemo(
    () => entries.filter((e) => CONTROLLABLE_TYPES.includes(e.device.type) && e.ip !== deviceIp),
    [entries, deviceIp],
  );

  const form = useForm({
    defaultValues: initialValues(existing),
    onSubmit: ({ value }) => {
      const usesInterval = triggerUsesInterval(fieldsPreferences, value.triggerType);
      const isSwitch = value.kind === 'switch-device';
      // Layer: device field template (so device-specific fields like
      // relay/forTime/ns are always present, even for a new action filling an
      // empty slot) -> the slot's current values -> the edited fields.
      const draft = useActionsDraftStore.getState();
      const base = draft.working.find((a) => a.id === actionId);
      const action: Action = {
        ...draft.actionTemplate,
        ...base,
        id: actionId,
        name: value.name.trim(),
        input: inputId,
        triggerType: value.triggerType,
        actionType: isSwitch ? SWITCH_ACTION_TYPE[value.switchOp] : ACTION_TYPE.httpGet,
        triggerParam: value.triggerParam,
        intervalS: usesInterval ? value.intervalS : 0,
        throttleS: usesInterval ? value.throttleS : 0,
        // Native switch actions carry no param; HTTP GET carries the URL.
        param: isSwitch ? '' : resolveParam(value, entries),
      };
      upsertAction(action);
      onClose();
    },
  });

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <p className="text-xs font-medium text-muted-foreground">{t('wizard.step', { step })}</p>

      <form.Subscribe selector={(state) => state.values}>
        {(values) => {
          const range = triggerParamRange(fieldsPreferences, values.triggerType);
          const usesInterval = triggerUsesInterval(fieldsPreferences, values.triggerType);
          const param = resolveParam(values, entries);
          const targetType =
            entries.find((e) => e.ip === values.targetIp)?.device.type ?? '';
          const commands = commandsFor(targetType);
          const activeCommand = commands.find((c) => c.id === values.commandId);

          const canAdvance =
            step === 1
              ? values.triggerType !== 0
              : step === 2
                ? values.kind === 'switch-device' || isHttpUrl(param)
                : true;

          return (
            <>
              {step === 1 ? (
                <div className="flex flex-col gap-3">
                  <Field label={t('wizard.triggerTypeLabel')}>
                    <Select
                      value={values.triggerType ? String(values.triggerType) : ''}
                      onValueChange={(v) => form.setFieldValue('triggerType', Number(v))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('wizard.triggerPlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        {triggerTypes.map((tt) => (
                          <SelectItem key={tt} value={String(tt)}>
                            {triggerTypeLabel(t, tt)} ({tt})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  {range ? (
                    <Field
                      label={t('wizard.triggerParam', {
                        min: range.minValue,
                        max: range.maxValue,
                      })}
                    >
                      <Input
                        type="number"
                        min={range.minValue}
                        max={range.maxValue}
                        value={values.triggerParam}
                        onChange={(e) => form.setFieldValue('triggerParam', Number(e.target.value))}
                      />
                    </Field>
                  ) : null}

                  {usesInterval ? (
                    <div className="grid grid-cols-2 gap-3">
                      <Field label={t('wizard.intervalS')}>
                        <Input
                          type="number"
                          min={0}
                          value={values.intervalS}
                          onChange={(e) => form.setFieldValue('intervalS', Number(e.target.value))}
                        />
                      </Field>
                      <Field label={t('wizard.throttleS')}>
                        <Input
                          type="number"
                          min={0}
                          value={values.throttleS}
                          onChange={(e) => form.setFieldValue('throttleS', Number(e.target.value))}
                        />
                      </Field>
                    </div>
                  ) : null}

                  <Field label={t('wizard.nameLabel')}>
                    <Input
                      value={values.name}
                      placeholder={t('wizard.namePlaceholder')}
                      onChange={(e) => form.setFieldValue('name', e.target.value)}
                    />
                  </Field>
                </div>
              ) : null}

              {step === 2 ? (
                <div className="flex flex-col gap-3">
                  <Field label={t('wizard.kindLabel')}>
                    <Select
                      value={values.kind}
                      onValueChange={(v) => form.setFieldValue('kind', v as ActionKind)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ACTION_KINDS.map((kind) => (
                          <SelectItem key={kind} value={kind}>
                            {actionKindLabel(t, kind)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  {values.kind === 'switch-device' ? (
                    <Field label={t('wizard.operationLabel')}>
                      <Select
                        value={values.switchOp}
                        onValueChange={(v) => form.setFieldValue('switchOp', v as SwitchOp)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="on">{actionTypeLabel(t, ACTION_TYPE.switchOn)}</SelectItem>
                          <SelectItem value="off">
                            {actionTypeLabel(t, ACTION_TYPE.switchOff)}
                          </SelectItem>
                          <SelectItem value="toggle">
                            {actionTypeLabel(t, ACTION_TYPE.switchToggle)}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  ) : values.kind === 'invoke-url' ? (
                    <Field label={t('wizard.urlLabel')}>
                      <Input
                        value={values.url}
                        placeholder={t('wizard.urlPlaceholder')}
                        onChange={(e) => form.setFieldValue('url', e.target.value)}
                      />
                    </Field>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Field label={t('wizard.targetLabel')}>
                        <Select
                          value={values.targetIp}
                          onValueChange={(v) => {
                            form.setFieldValue('targetIp', v);
                            form.setFieldValue('commandId', '');
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t('wizard.targetPlaceholder')} />
                          </SelectTrigger>
                          <SelectContent>
                            {targetDevices.map((d) => (
                              <SelectItem key={d.ip} value={d.ip}>
                                {d.device.deviceName} ({d.device.type})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>

                      {values.targetIp ? (
                        <Field label={t('wizard.commandLabel')}>
                          <Select
                            value={values.commandId}
                            onValueChange={(v) => form.setFieldValue('commandId', v)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={t('wizard.commandPlaceholder')} />
                            </SelectTrigger>
                            <SelectContent>
                              {commands.map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                  {commandLabel(t, targetType, c.id)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>
                      ) : null}

                      {activeCommand?.params.map((p) =>
                        p.name === 'relay' ? (
                          <Field key={p.name} label={commandParamLabel(t, p.name)}>
                            <Select
                              value={values.relay}
                              onValueChange={(v) => form.setFieldValue('relay', v)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">Relay 0</SelectItem>
                                <SelectItem value="1">Relay 1</SelectItem>
                              </SelectContent>
                            </Select>
                          </Field>
                        ) : (
                          <Field key={p.name} label={commandParamLabel(t, p.name)}>
                            <Input
                              value={values.hex}
                              onChange={(e) => form.setFieldValue('hex', e.target.value)}
                            />
                          </Field>
                        ),
                      )}
                    </div>
                  )}

                  {values.kind !== 'switch-device' ? (
                    <>
                      {param ? (
                        <p className="rounded-md bg-muted p-2 font-mono text-xs break-all">
                          {param}
                        </p>
                      ) : null}
                      {!isHttpUrl(param) ? (
                        <p className="text-xs text-muted-foreground">
                          {t('wizard.urlRequired')}
                        </p>
                      ) : null}
                    </>
                  ) : null}
                </div>
              ) : null}

              {step === 3 ? (
                <dl className="flex flex-col gap-2 text-sm">
                  <Summary label={t('wizard.summaryInput')} value={String(inputId + 1)} />
                  <Summary
                    label={t('wizard.summaryTrigger')}
                    value={triggerTypeLabel(t, values.triggerType)}
                  />
                  <Summary
                    label={t('wizard.summaryName')}
                    value={values.name || t('wizard.summaryNoName')}
                  />
                  <Summary label={t('wizard.summaryKind')} value={actionKindLabel(t, values.kind)} />
                  {values.kind === 'switch-device' ? (
                    <Summary
                      label={t('wizard.summaryOperation')}
                      value={actionTypeLabel(t, SWITCH_ACTION_TYPE[values.switchOp])}
                    />
                  ) : (
                    <Summary label={t('wizard.summaryUrl')} value={param} mono />
                  )}
                </dl>
              ) : null}

              <div className="flex justify-between gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => (step === 1 ? onClose() : setStep(step - 1))}
                >
                  {step === 1 ? t('common.cancel') : t('common.back')}
                </Button>
                {step < 3 ? (
                  <Button type="button" disabled={!canAdvance} onClick={() => setStep(step + 1)}>
                    {t('common.next')}
                  </Button>
                ) : (
                  <Button type="submit">
                    {existing ? t('wizard.saveAction') : t('wizard.addAction')}
                  </Button>
                )}
              </div>
            </>
          );
        }}
      </form.Subscribe>
    </form>
  );
}

function resolveParam(values: WizardValues, entries: ReturnType<typeof useDeviceList>['entries']) {
  if (values.kind === 'invoke-url') return values.url.trim();
  const target = entries.find((e) => e.ip === values.targetIp);
  if (!target) return '';
  const command = commandsFor(target.device.type).find((c) => c.id === values.commandId);
  if (!command) return '';
  return `http://${values.targetIp}/${command.build({ relay: values.relay, hex: values.hex })}`;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Summary({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={mono ? 'font-mono text-xs break-all text-right' : 'text-right'}>{value}</dd>
    </div>
  );
}
