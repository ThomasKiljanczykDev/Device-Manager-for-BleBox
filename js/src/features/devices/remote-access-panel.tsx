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
import { getRemoteAccess, setRemoteAccess } from '@/lib/settings';

interface RemoteAccessPanelProps {
  deviceIp: string;
}

interface RemoteAccessForm {
  enabled: boolean;
}

/**
 * Toggles the device's cloud tunnel ("Remote access (cloud)" in the wBox app).
 * Reads from `GET /api/settings/state` (`settings.tunnel.enabled`) and writes
 * via `POST /api/settings/set` with `{settings: {tunnel: {enabled: 0|1}}}` —
 * a partial update that leaves the rest of the device's settings alone.
 */
export function RemoteAccessPanel({ deviceIp }: RemoteAccessPanelProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.deviceSettings(deviceIp),
    queryFn: () => getRemoteAccess(deviceIp),
  });

  const loaded: RemoteAccessForm | null = query.data ? { enabled: query.data.enabled } : null;
  const [edited, setEdited] = useState<RemoteAccessForm | null>(null);
  const form = edited ?? loaded;
  const dirty = !!(form && loaded && form.enabled !== loaded.enabled);

  const save = useMutation({
    mutationFn: (next: RemoteAccessForm) => setRemoteAccess(deviceIp, next.enabled),
    onSuccess: async () => {
      setEdited(null);
      await queryClient.invalidateQueries({ queryKey: queryKeys.deviceSettings(deviceIp) });
      toast.success(t('remoteAccess.toastSaved'));
    },
    onError: () => toast.error(t('remoteAccess.toastError')),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{t('remoteAccess.title')}</CardTitle>
        <CardDescription>{t('remoteAccess.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        {query.isError ? (
          <div className="flex flex-col items-start gap-2">
            <p className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="size-4" /> {t('remoteAccess.loadError')}
            </p>
            <Button variant="outline" size="sm" onClick={() => void query.refetch()}>
              {t('remoteAccess.retry')}
            </Button>
          </div>
        ) : !form || !loaded ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> {t('remoteAccess.loading')}
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Switch
                id="remote-access-enable"
                checked={form.enabled}
                onCheckedChange={(enabled) => setEdited({ enabled })}
              />
              <Label htmlFor="remote-access-enable" className="font-normal">
                {t('remoteAccess.enabledLabel')}
              </Label>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                disabled={!dirty || save.isPending}
                onClick={() => save.mutate(form)}
              >
                {save.isPending ? <Loader2 className="animate-spin" /> : null}{' '}
                {t('remoteAccess.save')}
              </Button>
              {dirty ? (
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={save.isPending}
                  onClick={() => setEdited(null)}
                >
                  {t('remoteAccess.discard')}
                </Button>
              ) : null}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
