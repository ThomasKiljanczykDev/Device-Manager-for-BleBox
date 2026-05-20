import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { AlertCircle, Loader2, Lock, RefreshCw, Wifi } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { connectWifi, scanWifiNetworks } from '@/lib/wifi';
import { queryKeys } from '@/lib/query';
import type { WifiNetwork } from '@/shared';

interface WifiConnectDialogProps {
  deviceIp: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Re-scan cadence while the network list is shown. */
const SCAN_REFRESH_INTERVAL_MS = 15_000;

/**
 * Two-step "join a network" flow. Step 1 lists nearby APs (auto-rescans every
 * 15s + manual rescan); picking one advances to step 2 for the password
 * (skipped for open networks). The inner form is mounted inside DialogContent
 * so its state resets each time the dialog opens.
 */
export function WifiConnectDialog({ deviceIp, open, onOpenChange }: WifiConnectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <WifiConnectForm deviceIp={deviceIp} onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function WifiConnectForm({ deviceIp, onClose }: { deviceIp: string; onClose: () => void }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<WifiNetwork | null>(null);
  const [password, setPassword] = useState('');

  const step = selected ? 'password' : 'list';

  const scan = useQuery({
    queryKey: queryKeys.deviceWifiScan(deviceIp),
    queryFn: () => scanWifiNetworks(deviceIp),
    refetchInterval: step === 'list' ? SCAN_REFRESH_INTERVAL_MS : false,
    refetchIntervalInBackground: false,
  });

  const connect = useMutation({
    mutationFn: (network: WifiNetwork) =>
      connectWifi(deviceIp, network.ssid, network.enc === 0 ? null : password),
    onSuccess: async (_data, network) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.deviceNetwork(deviceIp) });
      toast.success(t('wifiDetails.dialog.connectingToast', { ssid: network.ssid }));
      onClose();
    },
    onError: () => toast.error(t('wifiDetails.dialog.connectError')),
  });

  // Dedupe APs by SSID (scans repeat across bands), keep the strongest, drop
  // hidden/empty SSIDs, sort by signal.
  const networks = (() => {
    const byName = new Map<string, WifiNetwork>();
    for (const ap of scan.data ?? []) {
      if (!ap.ssid) continue;
      const existing = byName.get(ap.ssid);
      if (!existing || (ap.rssi ?? -999) > (existing.rssi ?? -999)) byName.set(ap.ssid, ap);
    }
    return [...byName.values()].sort((a, b) => (b.rssi ?? -999) - (a.rssi ?? -999));
  })();

  if (step === 'password' && selected) {
    const isOpenNetwork = selected.enc === 0;
    return (
      <>
        <DialogHeader>
          <DialogTitle>{t('wifiDetails.dialog.step2Title', { ssid: selected.ssid })}</DialogTitle>
          <DialogDescription>
            {isOpenNetwork
              ? t('wifiDetails.dialog.openNote')
              : t('wifiDetails.dialog.passwordPrompt')}
          </DialogDescription>
        </DialogHeader>
        {!isOpenNetwork ? (
          <div className="flex flex-col gap-2">
            <Label htmlFor="wifi-password">{t('wifiDetails.dialog.passwordLabel')}</Label>
            <Input
              id="wifi-password"
              type="password"
              value={password}
              placeholder={t('wifiDetails.dialog.passwordPlaceholder')}
              autoFocus
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && password.length > 0 && !connect.isPending) {
                  connect.mutate(selected);
                }
              }}
            />
          </div>
        ) : null}
        <DialogFooter>
          <Button
            variant="ghost"
            disabled={connect.isPending}
            onClick={() => {
              setSelected(null);
              setPassword('');
            }}
          >
            {t('wifiDetails.dialog.back')}
          </Button>
          <Button
            disabled={connect.isPending || (!isOpenNetwork && password.length === 0)}
            onClick={() => connect.mutate(selected)}
          >
            {connect.isPending ? <Loader2 className="animate-spin" /> : null}{' '}
            {t('wifiDetails.dialog.connect')}
          </Button>
        </DialogFooter>
      </>
    );
  }

  return (
    <>
      <DialogHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-2">
            <DialogTitle>{t('wifiDetails.dialog.title')}</DialogTitle>
            <DialogDescription>{t('wifiDetails.dialog.listDescription')}</DialogDescription>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 shrink-0"
                aria-label={t('wifiDetails.dialog.rescan')}
                disabled={scan.isFetching}
                onClick={() => void scan.refetch()}
              >
                {scan.isFetching ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <RefreshCw className="size-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('wifiDetails.dialog.rescan')}</TooltipContent>
          </Tooltip>
        </div>
      </DialogHeader>

      <div className="max-h-80 overflow-y-auto">
        {scan.isError ? (
          <div className="flex flex-col items-start gap-2 py-2">
            <p className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="size-4" /> {t('wifiDetails.dialog.scanError')}
            </p>
            <Button variant="outline" size="sm" onClick={() => void scan.refetch()}>
              {t('wifiDetails.dialog.retry')}
            </Button>
          </div>
        ) : !scan.data ? (
          <p className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> {t('wifiDetails.dialog.scanning')}
          </p>
        ) : networks.length === 0 ? (
          <p className="py-2 text-sm text-muted-foreground">{t('wifiDetails.dialog.empty')}</p>
        ) : (
          <ul className="flex flex-col">
            {networks.map((ap) => (
              <li key={ap.ssid}>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm hover:bg-accent"
                  onClick={() => {
                    setSelected(ap);
                    setPassword('');
                  }}
                >
                  <Wifi className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <span className="flex-1 truncate">{ap.ssid}</span>
                  {ap.enc !== 0 ? (
                    <Lock
                      className="size-3 shrink-0 text-muted-foreground"
                      aria-label={t('wifiDetails.dialog.secured')}
                    />
                  ) : null}
                  {ap.rssi !== undefined ? (
                    <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                      {ap.rssi} dBm
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <DialogFooter>
        <Button variant="ghost" onClick={onClose}>
          {t('wifiDetails.dialog.cancel')}
        </Button>
      </DialogFooter>
    </>
  );
}
