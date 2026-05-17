import { useEffect } from 'react';
import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Braces, Loader2, RotateCcw, Save } from 'lucide-react';
import { deriveInputCount } from '@blebox/shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getActionsState, getStateExtended, saveActions } from '@/lib/blebox';
import { queryKeys } from '@/lib/query';
import { isActionsDraftDirty, useActionsDraftStore } from '@/stores/actions-draft';
import { ActionsPanel } from '@/features/actions/actions-panel';
import { deviceInfoQueryOptions } from '@/features/devices/queries';

export const Route = createFileRoute('/devices/$deviceIp')({
  component: DeviceDetail,
});

function DeviceDetail() {
  const { deviceIp } = Route.useParams();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const info = useQuery(deviceInfoQueryOptions(deviceIp));
  const state = useQuery({
    queryKey: queryKeys.deviceState(deviceIp),
    queryFn: () => getStateExtended(deviceIp),
  });
  const actions = useQuery({
    queryKey: queryKeys.deviceActions(deviceIp),
    queryFn: () => getActionsState(deviceIp),
  });

  const working = useActionsDraftStore((s) => s.working);
  const snapshot = useActionsDraftStore((s) => s.snapshot);
  const itemsLimit = useActionsDraftStore((s) => s.itemsLimit);
  const dirty = isActionsDraftDirty({ working, snapshot });

  // Sync the draft from the device whenever fresh data arrives and the user
  // has no pending edits (or has switched devices).
  useEffect(() => {
    if (!actions.data) return;
    const draft = useActionsDraftStore.getState();
    if (draft.ip !== deviceIp || !isActionsDraftDirty(draft)) {
      draft.loadFromDevice(deviceIp, actions.data);
    }
  }, [actions.data, deviceIp]);

  const save = useMutation({
    mutationFn: () => {
      const draft = useActionsDraftStore.getState();
      // Only push slots that actually changed (one upsert request per slot).
      const changed = draft.working
        .map(({ lastCall: _lastCall, ...rest }) => rest)
        .filter((slot, index) => {
          const { lastCall: _prev, ...before } = draft.snapshot[index] ?? {};
          return JSON.stringify(slot) !== JSON.stringify(before);
        });
      return saveActions(deviceIp, changed);
    },
    onSuccess: async () => {
      useActionsDraftStore.getState().commitSnapshot();
      await queryClient.invalidateQueries({ queryKey: queryKeys.deviceActions(deviceIp) });
    },
  });

  const inputCount = actions.data
    ? Math.max(deriveInputCount(actions.data), state.data?.inputs?.length ?? 0, 1)
    : 0;
  const relayCount = state.data?.relays?.length ?? 0;
  const online = info.isSuccess;

  return (
    <div className="flex min-h-full flex-col">
      <header className="flex flex-wrap items-center gap-3 border-b p-6">
        <div className="mr-auto">
          <h2 className="text-lg font-semibold">{info.data?.deviceName ?? deviceIp}</h2>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary">{info.data?.type ?? t('deviceDetail.unknownType')}</Badge>
            {info.data?.apiLevel ? (
              <Badge variant="outline">{t('deviceDetail.apiLevel', { level: info.data.apiLevel })}</Badge>
            ) : null}
            <span>{deviceIp}</span>
            <span className="flex items-center gap-1">
              <span
                className={`size-2 rounded-full ${online ? 'bg-emerald-500' : 'bg-destructive'}`}
              />
              {online ? t('deviceDetail.online') : t('deviceDetail.offline')}
            </span>
          </div>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/devices/$deviceIp/json" params={{ deviceIp }}>
            <Braces /> {t('deviceDetail.editJson')}
          </Link>
        </Button>
        {dirty ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => useActionsDraftStore.getState().revert()}
          >
            <RotateCcw /> {t('common.discard')}
          </Button>
        ) : null}
        <Button size="sm" disabled={!dirty || save.isPending} onClick={() => save.mutate()}>
          {save.isPending ? <Loader2 className="animate-spin" /> : <Save />} {t('common.save')}
        </Button>
      </header>

      {save.isError ? (
        <p className="flex items-center gap-2 border-b bg-destructive/10 px-6 py-2 text-sm text-destructive">
          <AlertCircle className="size-4" /> {t('deviceDetail.saveError')}
        </p>
      ) : null}

      <div className="p-6">
        {actions.isPending ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> {t('deviceDetail.loading', { ip: deviceIp })}
          </p>
        ) : actions.isError ? (
          <div className="flex flex-col items-start gap-2">
            <p className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="size-4" /> {t('deviceDetail.loadError')}
            </p>
            <Button variant="outline" size="sm" onClick={() => actions.refetch()}>
              {t('common.retry')}
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex gap-4 text-xs text-muted-foreground">
              <span>{t('deviceDetail.inputs', { count: inputCount })}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>{t('deviceDetail.relays', { count: relayCount })}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>{t('deviceDetail.slots', { count: itemsLimit })}</span>
            </div>
            <ActionsPanel deviceIp={deviceIp} inputCount={inputCount} />
          </>
        )}
      </div>

      <Outlet />
    </div>
  );
}
