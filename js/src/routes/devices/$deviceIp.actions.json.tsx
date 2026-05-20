import { useMemo, useRef, useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import Editor, { type Monaco, type OnMount } from '@monaco-editor/react';
import {
  ACTION_TYPE,
  actionsDocumentSchema,
  allowedTriggerTypes,
  buildActionsJsonSchema,
  paramPlaceholders,
} from '@/shared';
import '@/lib/monaco';
import { RouteDialog } from '@/components/route-dialog';
import { Button } from '@/components/ui/button';
import { configuredActions } from '@/features/actions/helpers';
import { actionTypeLabel, triggerTypeLabel } from '@/i18n/labels';
import { useActionsDraftStore } from '@/stores/actions-draft';

export const Route = createFileRoute('/devices/$deviceIp/actions/json')({
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
  const mergeActions = useActionsDraftStore((s) => s.mergeActions);

  // Only the configured actions are shown — the device's empty slots are hidden.
  const [text, setText] = useState(() =>
    JSON.stringify({ actions: configuredActions(working) }, null, 2),
  );
  const [error, setError] = useState<string | null>(null);
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

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
        t('actionsJsonEditor.invalidJson', {
          message: err instanceof Error ? err.message : t('actionsJsonEditor.parseError'),
        }),
      );
      return;
    }
    const result = actionsDocumentSchema.safeParse(parsed);
    if (!result.success) {
      setError(
        t('actionsJsonEditor.schemaError', {
          message: result.error.issues[0]?.message ?? t('actionsJsonEditor.schemaErrorFallback'),
        }),
      );
      return;
    }
    mergeActions(result.data.actions);
    await close();
  };

  return (
    <RouteDialog
      title={t('actionsJsonEditor.title')}
      description={t('actionsJsonEditor.description')}
      onClose={close}
      className="max-w-6xl!"
      onEscapeKeyDown={(event) => {
        // While focus is inside the editor (text, find/suggest widgets), let
        // Monaco own Escape instead of the dialog closing.
        const dom = editorRef.current?.getDomNode();
        if (dom?.contains(event.target as Node)) event.preventDefault();
      }}
    >
      <div className="overflow-hidden rounded-md border">
        <Editor
          height="440px"
          defaultLanguage="json"
          theme="vs-dark"
          value={text}
          beforeMount={configureSchema}
          onMount={(editor) => {
            editorRef.current = editor;
          }}
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
        <Button onClick={apply}>{t('actionsJsonEditor.apply')}</Button>
      </div>
    </RouteDialog>
  );
}
