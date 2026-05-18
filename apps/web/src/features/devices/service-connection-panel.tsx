import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { queryKeys } from '@/lib/query';
import { getWifiStatus, setApSettings } from '@/lib/wifi';

interface ServiceConnectionPanelProps {
  deviceIp: string;
}

interface ApForm {
  apEnable: boolean;
  apName: string;
}

/**
 * Manages a device's internal WiFi access point ("Service Connection"):
 * enable/disable and rename. The AP is passwordless, so there is no password
 * field. Data comes from `GET /api/device/network`; saves go to
 * `POST /api/device/set` — neither affects the device's home-WiFi connection.
 */
export function ServiceConnectionPanel({ deviceIp }: ServiceConnectionPanelProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.deviceNetwork(deviceIp),
    queryFn: ({ signal }) => getWifiStatus(deviceIp, signal),
  });

  // The device's current AP state. `edited` holds unsaved changes layered on
  // top — `null` means pristine, so the form always reflects fresh data.
  const loaded: ApForm | null = query.data
    ? { apEnable: query.data.apEnable ?? false, apName: query.data.apSSID ?? '' }
    : null;
  const [edited, setEdited] = useState<ApForm | null>(null);
  const form = edited ?? loaded;

  const save = useMutation({
    mutationFn: (next: ApForm) =>
      setApSettings(deviceIp, { apEnable: next.apEnable, apSSID: next.apName }),
    onSuccess: async () => {
      setEdited(null);
      await queryClient.invalidateQueries({ queryKey: queryKeys.deviceNetwork(deviceIp) });
      toast.success(t('serviceConnection.toastSaved'));
    },
    onError: () => toast.error(t('serviceConnection.toastError')),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{t('serviceConnection.title')}</CardTitle>
        <CardDescription>{t('serviceConnection.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        {query.isError ? (
          <div className="flex flex-col items-start gap-2">
            <p className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="size-4" /> {t('serviceConnection.loadError')}
            </p>
            <Button variant="outline" size="sm" onClick={() => void query.refetch()}>
              {t('serviceConnection.retry')}
            </Button>
          </div>
        ) : !form || !loaded ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> {t('serviceConnection.loading')}
          </p>
        ) : (
          <ApFields
            form={form}
            loaded={loaded}
            saving={save.isPending}
            onChange={setEdited}
            onReset={() => setEdited(null)}
            onSave={() => save.mutate(form)}
          />
        )}
      </CardContent>
    </Card>
  );
}

function ApFields({
  form,
  loaded,
  saving,
  onChange,
  onReset,
  onSave,
}: {
  form: ApForm;
  loaded: ApForm;
  saving: boolean;
  onChange: (next: ApForm) => void;
  onReset: () => void;
  onSave: () => void;
}) {
  const { t } = useTranslation();

  const nameValid = form.apName.trim().length >= 1 && form.apName.length <= 32;
  // The AP name is irrelevant while the AP is off, so it can't block a save.
  const valid = !form.apEnable || nameValid;
  const dirty = form.apEnable !== loaded.apEnable || form.apName !== loaded.apName;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Switch
          id="ap-enable"
          checked={form.apEnable}
          onCheckedChange={(apEnable) => onChange({ ...form, apEnable })}
        />
        <Label htmlFor="ap-enable" className="font-normal">
          {t('serviceConnection.enabledLabel')}
        </Label>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ap-name">{t('serviceConnection.nameLabel')}</Label>
        <Input
          id="ap-name"
          value={form.apName}
          disabled={!form.apEnable}
          maxLength={32}
          placeholder={t('serviceConnection.namePlaceholder')}
          onChange={(event) => onChange({ ...form, apName: event.target.value })}
        />
        {form.apEnable && !nameValid ? (
          <p className="text-xs text-destructive">{t('serviceConnection.nameInvalid')}</p>
        ) : null}
      </div>

      <div className="flex gap-2">
        <Button size="sm" disabled={!dirty || !valid || saving} onClick={onSave}>
          {saving ? <Loader2 className="animate-spin" /> : null} {t('serviceConnection.save')}
        </Button>
        {dirty ? (
          <Button size="sm" variant="ghost" disabled={saving} onClick={onReset}>
            {t('serviceConnection.discard')}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
