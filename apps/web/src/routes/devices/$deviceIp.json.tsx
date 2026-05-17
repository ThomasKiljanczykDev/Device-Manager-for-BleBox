import { useMemo, useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import Editor, { type Monaco } from '@monaco-editor/react';
import {
  ACTION_TYPE,
  actionsDocumentSchema,
  allowedTriggerTypes,
  buildActionsJsonSchema,
  paramPlaceholders,
} from '@blebox/shared';
import '@/lib/monaco';
import { RouteDialog } from '@/components/route-dialog';
import { Button } from '@/components/ui/button';
import { actionTypeLabel, triggerTypeLabel } from '@/i18n/labels';
import { useActionsDraftStore } from '@/stores/actions-draft';

export const Route = createFileRoute('/devices/$deviceIp/json')({
  component: JsonEditorDialog,
});

function labelMap(values: number[], label: (value: number) => string): Record<number, string> {
  return Object.fromEntries(values.map((value) => [value, label(value)]));
}

function JsonEditorDialog() {
  const { deviceIp } = Route.useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const working = useActionsDraftStore((s) => s.working);
  const fieldsPreferences = useActionsDraftStore((s) => s.fieldsPreferences);
  const replaceAll = useActionsDraftStore((s) => s.replaceAll);

  const [text, setText] = useState(() => JSON.stringify({ actions: working }, null, 2));
  const [error, setError] = useState<string | null>(null);

  const schema = useMemo(() => {
    const triggerTypes = allowedTriggerTypes(fieldsPreferences, 999);
    const actionTypes = Object.values(ACTION_TYPE);
    return buildActionsJsonSchema({
      triggerTypes,
      actionTypes,
      triggerTypeLabels: labelMap([0, ...triggerTypes], (v) => triggerTypeLabel(t, v)),
      actionTypeLabels: labelMap(actionTypes, (v) => actionTypeLabel(t, v)),
      placeholders: paramPlaceholders(fieldsPreferences),
    });
  }, [fieldsPreferences, t]);

  const close = () => navigate({ to: '/devices/$deviceIp', params: { deviceIp } });

  const configureSchema = (monaco: Monaco) => {
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      enableSchemaRequest: false,
      schemas: [{ uri: 'blebox://actions.json', fileMatch: ['*'], schema }],
    });
  };

  const apply = async () => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      setError(
        t('jsonEditor.invalidJson', {
          message: err instanceof Error ? err.message : t('jsonEditor.parseError'),
        }),
      );
      return;
    }
    const result = actionsDocumentSchema.safeParse(parsed);
    if (!result.success) {
      setError(
        t('jsonEditor.schemaError', {
          message: result.error.issues[0]?.message ?? t('jsonEditor.schemaErrorFallback'),
        }),
      );
      return;
    }
    replaceAll(result.data.actions);
    await close();
  };

  return (
    <RouteDialog
      title={t('jsonEditor.title')}
      description={t('jsonEditor.description')}
      onClose={close}
      className="max-w-3xl"
    >
      <div className="overflow-hidden rounded-md border">
        <Editor
          height="440px"
          defaultLanguage="json"
          theme="vs-dark"
          value={text}
          beforeMount={configureSchema}
          onChange={(value) => {
            setText(value ?? '');
            setError(null);
          }}
          options={{
            minimap: { enabled: false },
            fontSize: 12,
            scrollBeyondLastLine: false,
            tabSize: 2,
          }}
        />
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={close}>
          {t('common.cancel')}
        </Button>
        <Button onClick={apply}>{t('jsonEditor.apply')}</Button>
      </div>
    </RouteDialog>
  );
}
