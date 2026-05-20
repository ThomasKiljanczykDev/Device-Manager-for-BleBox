import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getWifiStatus } from '@/lib/wifi';
import { queryKeys } from '@/lib/query';
import { WifiConnectDialog } from './wifi-connect-dialog';

interface WifiDetailsPanelProps {
  deviceIp: string;
}

/** Maps `station_status` to its i18n label key (literal union for typed t()). */
const STATION_STATUS_KEYS = {
  0: 'wifiDetails.status.notConfigured',
  1: 'wifiDetails.status.connecting',
  2: 'wifiDetails.status.wrongPassword',
  3: 'wifiDetails.status.notFound',
  4: 'wifiDetails.status.commFailed',
  5: 'wifiDetails.status.connected',
} as const;

function stationStatusKey(status: number | undefined) {
  return (
    STATION_STATUS_KEYS[status as keyof typeof STATION_STATUS_KEYS] ??
    'wifiDetails.status.unknown'
  );
}

function statusDotClass(status: number | undefined): string {
  if (status === 5) return 'bg-emerald-500';
  if (status === 2 || status === 3 || status === 4) return 'bg-destructive';
  return 'bg-muted-foreground';
}

/**
 * The device's client connection to the home WiFi: live status + network info,
 * and a button to move it onto a different network.
 */
export function WifiDetailsPanel({ deviceIp }: WifiDetailsPanelProps) {
  const { t } = useTranslation();
  const [connectOpen, setConnectOpen] = useState(false);

  const query = useQuery({
    queryKey: queryKeys.deviceNetwork(deviceIp),
    queryFn: () => getWifiStatus(deviceIp),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{t('wifiDetails.title')}</CardTitle>
        <CardDescription>{t('wifiDetails.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        {query.isError ? (
          <div className="flex flex-col items-start gap-2">
            <p className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="size-4" /> {t('wifiDetails.loadError')}
            </p>
            <Button variant="outline" size="sm" onClick={() => void query.refetch()}>
              {t('wifiDetails.retry')}
            </Button>
          </div>
        ) : !query.data ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> {t('wifiDetails.loading')}
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-foreground">{t('wifiDetails.statusLabel')}</dt>
              <dd className="flex items-center gap-2">
                <span
                  className={cn('size-2 rounded-full', statusDotClass(query.data.station_status))}
                />
                {t(stationStatusKey(query.data.station_status))}
              </dd>

              <dt className="text-muted-foreground">{t('wifiDetails.ipLabel')}</dt>
              <dd className="font-mono">{query.data.ip ?? '—'}</dd>

              <dt className="text-muted-foreground">{t('wifiDetails.ssidLabel')}</dt>
              <dd className="break-all">{query.data.ssid ?? '—'}</dd>

              <dt className="text-muted-foreground">{t('wifiDetails.bssidLabel')}</dt>
              <dd className="font-mono break-all">{query.data.bssid ?? '—'}</dd>

              <dt className="text-muted-foreground">{t('wifiDetails.channelLabel')}</dt>
              <dd className="font-mono">{query.data.channel ?? '—'}</dd>

              <dt className="text-muted-foreground">{t('wifiDetails.macLabel')}</dt>
              <dd className="font-mono break-all">{query.data.mac ?? '—'}</dd>
            </dl>

            <Button size="sm" className="self-start" onClick={() => setConnectOpen(true)}>
              {t('wifiDetails.chooseNetwork')}
            </Button>
          </div>
        )}
      </CardContent>

      <WifiConnectDialog deviceIp={deviceIp} open={connectOpen} onOpenChange={setConnectOpen} />
    </Card>
  );
}
