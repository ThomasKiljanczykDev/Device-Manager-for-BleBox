import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getStateExtended } from '@/lib/blebox';
import { queryKeys } from '@/lib/query';

interface PowerMeasurementsPanelProps {
  deviceIp: string;
}

/**
 * Live power readings sourced from `GET /state/extended`:
 * - Active power from `sensors[type==="activePower"].value` (W)
 * - Recent consumption from `powerMeasuring.powerConsumption[0].value` (kWh)
 *
 * Returns `null` when neither field is present (e.g. on buttonBox).
 */
export function PowerMeasurementsPanel({ deviceIp }: PowerMeasurementsPanelProps) {
  const { t } = useTranslation();

  const query = useQuery({
    queryKey: queryKeys.deviceState(deviceIp),
    queryFn: () => getStateExtended(deviceIp),
  });

  const activePower = query.data?.sensors?.find((s) => s.type === 'activePower')?.value;
  const consumption = query.data?.powerMeasuring?.powerConsumption?.[0]?.value;

  // Hide the card entirely when the device doesn't report power data.
  if (query.data && activePower === undefined && consumption === undefined) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{t('devicePanel.powerTitle')}</CardTitle>
        <CardDescription>{t('devicePanel.powerDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        {query.isError ? (
          <p className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="size-4" /> {t('devicePanel.loadError')}
          </p>
        ) : !query.data ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> {t('devicePanel.loading')}
          </p>
        ) : (
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-xs text-muted-foreground">{t('devicePanel.activePower')}</dt>
              <dd className="font-mono text-lg">
                {activePower !== undefined
                  ? t('devicePanel.watts', { value: activePower })
                  : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">{t('devicePanel.consumption')}</dt>
              <dd className="font-mono text-lg">
                {consumption !== undefined
                  ? t('devicePanel.kwh', { value: consumption.toFixed(3) })
                  : '—'}
              </dd>
            </div>
          </dl>
        )}
      </CardContent>
    </Card>
  );
}
