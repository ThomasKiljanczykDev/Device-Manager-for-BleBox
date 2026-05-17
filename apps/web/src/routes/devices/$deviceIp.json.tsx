import { useMemo, useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
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
import { useActionsDraftStore } from '@/stores/actions-draft';

export const Route = createFileRoute('/devices/$deviceIp/json')({
  component: JsonEditorDialog,
});

function JsonEditorDialog() {
  const { deviceIp } = Route.useParams();
  const navigate = useNavigate();
  const working = useActionsDraftStore((s) => s.working);
  const fieldsPreferences = useActionsDraftStore((s) => s.fieldsPreferences);
  const replaceAll = useActionsDraftStore((s) => s.replaceAll);

  const [text, setText] = useState(() => JSON.stringify({ actions: working }, null, 2));
  const [error, setError] = useState<string | null>(null);

  const schema = useMemo(
    () =>
      buildActionsJsonSchema({
        triggerTypes: allowedTriggerTypes(fieldsPreferences, 999),
        actionTypes: Object.values(ACTION_TYPE),
        placeholders: paramPlaceholders(fieldsPreferences),
      }),
    [fieldsPreferences],
  );

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
      setError(`Invalid JSON: ${err instanceof Error ? err.message : 'parse error'}`);
      return;
    }
    const result = actionsDocumentSchema.safeParse(parsed);
    if (!result.success) {
      setError(`Does not match the action schema: ${result.error.issues[0]?.message ?? 'invalid'}`);
      return;
    }
    replaceAll(result.data.actions);
    await close();
  };

  return (
    <RouteDialog
      title="Edit actions JSON"
      description="Schema-validated editor for the full actions array. Applying updates the in-memory draft; use Save on the device page to persist."
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
          Cancel
        </Button>
        <Button onClick={apply}>Apply changes</Button>
      </div>
    </RouteDialog>
  );
}
