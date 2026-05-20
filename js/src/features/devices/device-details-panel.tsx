import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { deviceInfoQueryOptions } from '@/features/devices/queries';
import { FirmwareUpdateDialog } from './firmware-update-dialog';

interface DeviceDetailsPanelProps {
  deviceIp: string;
}

/**
 * Read-only identifying info for the device, plus a firmware-update
 * affordance. The Update button only appears when the device itself reports
 * `availableFv` — which in practice requires the cloud tunnel to be enabled.
 */
export function DeviceDetailsPanel({ deviceIp }: DeviceDetailsPanelProps) {
  const { t } = useTranslation();
  const query = useQuery(deviceInfoQueryOptions(deviceIp));
  const [updateOpen, setUpdateOpen] = useState(false);

  const availableFv = query.data?.availableFv ?? null;
  const updateAvailable = !!availableFv;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{t('deviceDetails.title')}</CardTitle>
        <CardDescription>{t('deviceDetails.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        {query.isError ? (
          <div className="flex flex-col items-start gap-2">
            <p className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="size-4" /> {t('deviceDetails.loadError')}
            </p>
            <Button variant="outline" size="sm" onClick={() => void query.refetch()}>
              {t('deviceDetails.retry')}
            </Button>
          </div>
        ) : !query.data ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> {t('deviceDetails.loading')}
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-foreground">{t('deviceDetails.identifier')}</dt>
              <dd className="font-mono break-all">{query.data.id}</dd>

              <dt className="text-muted-foreground">{t('deviceDetails.type')}</dt>
              <dd className="font-mono">{query.data.type}</dd>

              <dt className="text-muted-foreground">{t('deviceDetails.hardware')}</dt>
              <dd className="font-mono break-all">{query.data.hv ?? '—'}</dd>

              <dt className="text-muted-foreground">{t('deviceDetails.firmware')}</dt>
              <dd className="flex flex-wrap items-center gap-2 font-mono">
                <span>{query.data.fv ?? '—'}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6"
                      aria-label={t('deviceDetails.checkForUpdates')}
                      disabled={query.isFetching}
                      onClick={() => void query.refetch()}
                    >
                      {query.isFetching ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <RefreshCw className="size-3" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t('deviceDetails.checkForUpdates')}</TooltipContent>
                </Tooltip>
                {updateAvailable ? (
                  <span className="font-sans text-xs text-amber-500">
                    {t('deviceDetails.updateAvailable', { version: availableFv })}
                  </span>
                ) : null}
              </dd>
            </dl>

            {updateAvailable ? (
              <Button size="sm" className="self-start" onClick={() => setUpdateOpen(true)}>
                {t('deviceDetails.updateButton')}
              </Button>
            ) : null}
          </div>
        )}
      </CardContent>

      {query.data ? (
        <FirmwareUpdateDialog
          deviceIp={deviceIp}
          currentVersion={query.data.fv ?? ''}
          targetVersion={availableFv ?? ''}
          open={updateOpen}
          onOpenChange={setUpdateOpen}
        />
      ) : null}
    </Card>
  );
}
