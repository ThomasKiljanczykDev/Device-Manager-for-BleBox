import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getDeviceInfo, triggerOtaUpdate } from '@/lib/blebox';
import { queryKeys } from '@/lib/query';

interface FirmwareUpdateDialogProps {
  deviceIp: string;
  currentVersion: string;
  targetVersion: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** How often we re-read `/info` while the update is running. */
const OTA_POLL_INTERVAL_MS = 5_000;
/** Maximum time we wait for the device's `fv` to change. */
const OTA_TIMEOUT_MS = 8 * 60 * 1000;

type Phase =
  | { kind: 'pending' }
  | { kind: 'done'; toVersion: string }
  | { kind: 'error'; message: string };

/**
 * Triggers a firmware update on the device and polls `/info` until the
 * device's `fv` changes (or the safety timeout fires). The dialog blocks
 * the close affordances while the update is in progress; a Close button
 * appears once we transition to done / error.
 *
 * Limitation: there is no documented progress endpoint, so we can't show a
 * percentage — only a spinner. And the update only happens at all if the
 * device's BleBox cloud tunnel is enabled and BleBox has published an
 * `availableFv` for the device (the parent only renders this dialog when
 * `availableFv` is truthy).
 */
export function FirmwareUpdateDialog({
  deviceIp,
  currentVersion,
  targetVersion,
  open,
  onOpenChange,
}: FirmwareUpdateDialogProps) {
  return (
    <Dialog
      open={open}
      // The Close button (rendered after the update finishes) decides when
      // closing is allowed; ESC and outside-clicks are blocked throughout.
      onOpenChange={() => {
        /* no-op */
      }}
    >
      <DialogContent showCloseButton={false}>
        <FirmwareUpdateForm
          deviceIp={deviceIp}
          currentVersion={currentVersion}
          targetVersion={targetVersion}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

interface FirmwareUpdateFormProps {
  deviceIp: string;
  currentVersion: string;
  targetVersion: string;
  onClose: () => void;
}

function FirmwareUpdateForm({
  deviceIp,
  currentVersion,
  targetVersion,
  onClose,
}: FirmwareUpdateFormProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  // Pin the version strings at mount; the outer query may forget them once
  // the device finishes and `availableFv` flips to null.
  const [from] = useState(currentVersion);
  const [target] = useState(targetVersion);
  // Imperatively-set failure cause (trigger rejection / safety timeout).
  // The full `phase` below is derived from this + the query result.
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Step 1 — fire the OTA trigger once. 409 Conflict (an update is already
  // running) is treated as success: we just continue polling.
  useEffect(() => {
    let cancelled = false;
    triggerOtaUpdate(deviceIp).catch((err) => {
      if (cancelled) return;
      const message = err instanceof Error ? err.message : String(err);
      if (!message.includes('DEVICE_ERROR')) {
        setErrorMessage(message);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [deviceIp]);

  // Step 2 — poll `/info` while pending. Errors are tolerated (the device
  // is unreachable during the actual flash + reboot).
  const phaseKindForPolling = errorMessage
    ? 'error'
    : 'pending'; /* polling stops as soon as the derived phase moves on */
  const query = useQuery({
    queryKey: queryKeys.deviceInfo(deviceIp),
    queryFn: () => getDeviceInfo(deviceIp),
    refetchInterval: phaseKindForPolling === 'pending' ? OTA_POLL_INTERVAL_MS : false,
    refetchIntervalInBackground: true,
    retry: false,
  });

  // Phase derives from the query result + the imperative error state.
  const phase: Phase = useMemo(() => {
    if (errorMessage) return { kind: 'error', message: errorMessage };
    const fv = query.data?.fv;
    if (fv && fv !== from) return { kind: 'done', toVersion: fv };
    return { kind: 'pending' };
  }, [errorMessage, query.data?.fv, from]);

  // Step 3 — safety timeout if the device never reports a new version.
  useEffect(() => {
    if (phase.kind !== 'pending') return;
    const timer = setTimeout(() => {
      setErrorMessage(t('firmwareUpdate.errorTimeout'));
    }, OTA_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [phase.kind, t]);

  // Step 4 — once we're out of `pending`, make sure outer caches re-read.
  useEffect(() => {
    if (phase.kind === 'pending') return;
    void queryClient.invalidateQueries({ queryKey: queryKeys.deviceInfo(deviceIp) });
  }, [phase.kind, queryClient, deviceIp]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t('firmwareUpdate.title')}</DialogTitle>
        <DialogDescription>
          {phase.kind === 'pending'
            ? t('firmwareUpdate.descriptionPending')
            : phase.kind === 'done'
              ? t('firmwareUpdate.done', { version: phase.toVersion })
              : t('firmwareUpdate.error', { message: phase.message })}
        </DialogDescription>
      </DialogHeader>

      <div className="flex items-center gap-3 py-4 text-sm">
        {phase.kind === 'pending' ? (
          <>
            <Loader2 className="size-5 animate-spin" aria-hidden />
            <span>{t('firmwareUpdate.inProgress', { from, to: target })}</span>
          </>
        ) : phase.kind === 'done' ? (
          <>
            <CheckCircle2 className="size-5 text-emerald-500" aria-hidden />
            <span>{t('firmwareUpdate.doneShort', { version: phase.toVersion })}</span>
          </>
        ) : (
          <>
            <AlertCircle className="size-5 text-destructive" aria-hidden />
            <span className="text-destructive">{phase.message}</span>
          </>
        )}
      </div>

      <DialogFooter>
        {phase.kind !== 'pending' ? (
          <Button onClick={onClose}>{t('firmwareUpdate.close')}</Button>
        ) : null}
      </DialogFooter>
    </>
  );
}
