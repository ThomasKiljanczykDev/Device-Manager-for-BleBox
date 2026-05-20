import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { queryKeys } from '@/lib/query';
import {
  getDeviceSettings,
  setDeviceSettings,
  type DeviceSettings,
} from '@/lib/settings';

interface DeviceSettingsPanelProps {
  deviceIp: string;
}

const FIELDS = ['statusLed', 'buttonsBacklight', 'powerMeasuring'] as const;
type Field = (typeof FIELDS)[number];

/**
 * Three configuration toggles that live in `/api/settings/state`. Each switch
 * is rendered only when the device returns the corresponding sub-object —
 * e.g. `powerMeasuring` is absent on buttonBox / wLightBox, so its switch
 * disappears there. Writes are partial: only changed fields are sent.
 */
export function DeviceSettingsPanel({ deviceIp }: DeviceSettingsPanelProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.deviceSettings(deviceIp),
    queryFn: () => getDeviceSettings(deviceIp),
  });

  const loaded = query.data ?? null;
  const [edited, setEdited] = useState<DeviceSettings | null>(null);
  const form = edited ?? loaded;

  const diff: DeviceSettings = {};
  let dirty = false;
  if (form && loaded) {
    for (const field of FIELDS) {
      if (form[field] !== undefined && form[field] !== loaded[field]) {
        diff[field] = form[field];
        dirty = true;
      }
    }
  }

  const save = useMutation({
    mutationFn: (changes: DeviceSettings) => setDeviceSettings(deviceIp, changes),
    onSuccess: async () => {
      setEdited(null);
      await queryClient.invalidateQueries({ queryKey: queryKeys.deviceSettings(deviceIp) });
      toast.success(t('deviceSettings.toastSaved'));
    },
    onError: () => toast.error(t('deviceSettings.toastError')),
  });

  const labelFor: Record<Field, string> = {
    statusLed: t('deviceSettings.statusLedLabel'),
    buttonsBacklight: t('deviceSettings.buttonsBacklightLabel'),
    powerMeasuring: t('deviceSettings.powerMeasuringLabel'),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{t('deviceSettings.title')}</CardTitle>
        <CardDescription>{t('deviceSettings.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        {query.isError ? (
          <div className="flex flex-col items-start gap-2">
            <p className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="size-4" /> {t('deviceSettings.loadError')}
            </p>
            <Button variant="outline" size="sm" onClick={() => void query.refetch()}>
              {t('deviceSettings.retry')}
            </Button>
          </div>
        ) : !form || !loaded ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> {t('deviceSettings.loading')}
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {FIELDS.map((field) =>
              loaded[field] === undefined ? null : (
                <div key={field} className="flex items-center gap-3">
                  <Switch
                    id={`device-settings-${field}`}
                    checked={!!form[field]}
                    onCheckedChange={(next) =>
                      setEdited({ ...(edited ?? loaded), [field]: next })
                    }
                  />
                  <Label htmlFor={`device-settings-${field}`} className="font-normal">
                    {labelFor[field]}
                  </Label>
                </div>
              ),
            )}

            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                disabled={!dirty || save.isPending}
                onClick={() => save.mutate(diff)}
              >
                {save.isPending ? <Loader2 className="animate-spin" /> : null}{' '}
                {t('deviceSettings.save')}
              </Button>
              {dirty ? (
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={save.isPending}
                  onClick={() => setEdited(null)}
                >
                  {t('deviceSettings.discard')}
                </Button>
              ) : null}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
