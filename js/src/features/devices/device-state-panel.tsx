import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { AlertCircle, Loader2, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { getStateExtended, setRelayState } from '@/lib/blebox';
import { queryKeys } from '@/lib/query';

interface DeviceStatePanelProps {
  deviceIp: string;
}

/**
 * Live relay state with on/off toggles. Hidden when the device exposes no
 * `relays[]` (e.g. buttonBox, wLightBox). Icon is the lucide `Power` glyph —
 * the device's own numeric `iconSet` references wBox's bundled assets, which
 * this app does not ship.
 */
export function DeviceStatePanel({ deviceIp }: DeviceStatePanelProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.deviceState(deviceIp),
    queryFn: () => getStateExtended(deviceIp),
  });

  const toggle = useMutation({
    mutationFn: ({ relay, state }: { relay: number; state: 0 | 1 }) =>
      setRelayState(deviceIp, relay, state),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.deviceState(deviceIp) }),
    onError: () => toast.error(t('devicePanel.toggleError')),
  });

  // Always render the Card while loading / on error so the tab doesn't flicker
  // empty on first render. The relays array gates the live content.
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{t('devicePanel.stateTitle')}</CardTitle>
        <CardDescription>{t('devicePanel.stateDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        {query.isError ? (
          <div className="flex flex-col items-start gap-2">
            <p className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="size-4" /> {t('devicePanel.loadError')}
            </p>
            <Button variant="outline" size="sm" onClick={() => void query.refetch()}>
              {t('common.retry')}
            </Button>
          </div>
        ) : !query.data ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> {t('devicePanel.loading')}
          </p>
        ) : !query.data.relays || query.data.relays.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('devicePanel.noRelays')}</p>
        ) : (
          <div className="flex flex-col gap-4">
            {query.data.relays.map((r) => {
              const on = r.state === 1;
              const id = `relay-toggle-${r.relay}`;
              return (
                <div key={r.relay} className="flex items-center gap-4">
                  <Power
                    className={cn(
                      'size-12 transition-colors duration-300 ease-in-out',
                      on ? 'text-emerald-500' : 'text-muted-foreground',
                    )}
                    aria-hidden
                  />
                  <div className="flex-1">
                    <Label htmlFor={id} className="font-medium">
                      {t('devicePanel.relayLabel', { n: r.relay + 1 })}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {on ? t('devicePanel.on') : t('devicePanel.off')}
                    </p>
                  </div>
                  <Switch
                    id={id}
                    checked={on}
                    disabled={toggle.isPending}
                    onCheckedChange={(next) =>
                      toggle.mutate({ relay: r.relay, state: next ? 1 : 0 })
                    }
                  />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
