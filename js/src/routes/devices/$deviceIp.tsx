import { useEffect, useState } from 'react';
import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { AlertCircle, Braces, Loader2, Pencil, RotateCcw, Save } from 'lucide-react';
import { deriveInputCount } from '@/shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getActionsState, getStateExtended, saveActions } from '@/lib/blebox';
import { queryKeys } from '@/lib/query';
import { isActionsDraftDirty, useActionsDraftStore } from '@/stores/actions-draft';
import { ActionsPanel } from '@/features/actions/actions-panel';
import { DeviceSettingsPanel } from '@/features/devices/device-settings-panel';
import { DeviceStatePanel } from '@/features/devices/device-state-panel';
import { PowerMeasurementsPanel } from '@/features/devices/power-measurements-panel';
import { RenameDialog } from '@/features/devices/rename-dialog';
import { ServiceConnectionPanel } from '@/features/devices/service-connection-panel';
import { RemoteAccessPanel } from '@/features/devices/remote-access-panel';
import { deviceInfoQueryOptions } from '@/features/devices/queries';

export const Route = createFileRoute('/devices/$deviceIp')({
  component: DeviceDetail,
});

function DeviceDetail() {
  const { deviceIp } = Route.useParams();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [renameOpen, setRenameOpen] = useState(false);

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
      toast.success(t('toast.saveSuccess'));
    },
    onError: () => {
      toast.error(t('toast.saveError'));
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
          <div className="flex items-center gap-1">
            <h2 className="text-lg font-semibold">{info.data?.deviceName ?? deviceIp}</h2>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              aria-label={t('deviceDetail.rename.title')}
              disabled={!info.data}
              onClick={() => setRenameOpen(true)}
            >
              <Pencil className="size-4" />
            </Button>
          </div>
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
        {dirty ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => useActionsDraftStore.getState().revert()}
          >
            <RotateCcw /> {t('common.discard')}
          </Button>
        ) : null}
        {dirty ? (
          <Button size="sm" disabled={save.isPending} onClick={() => save.mutate()}>
            {save.isPending ? <Loader2 className="animate-spin" /> : <Save />} {t('common.save')}
          </Button>
        ) : null}
      </header>

      <Tabs defaultValue="device" className="p-6">
        <TabsList>
          <TabsTrigger value="device">{t('deviceDetail.tabDevice')}</TabsTrigger>
          <TabsTrigger value="actions">{t('deviceDetail.tabActions')}</TabsTrigger>
          <TabsTrigger value="connection">{t('deviceDetail.tabConnection')}</TabsTrigger>
        </TabsList>

        <TabsContent value="device">
          <div className="grid gap-4 md:grid-cols-2 md:items-start">
            <DeviceStatePanel deviceIp={deviceIp} />
            <PowerMeasurementsPanel deviceIp={deviceIp} />
            <div className="md:col-span-2">
              <DeviceSettingsPanel deviceIp={deviceIp} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="actions">
          {actions.isPending ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />{' '}
              {t('deviceDetail.loading', { ip: deviceIp })}
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
              <div className="mb-4 flex flex-wrap items-center gap-4">
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span>{t('deviceDetail.inputs', { count: inputCount })}</span>
                  <Separator orientation="vertical" className="h-4" />
                  <span>{t('deviceDetail.relays', { count: relayCount })}</span>
                  <Separator orientation="vertical" className="h-4" />
                  <span>{t('deviceDetail.slots', { count: itemsLimit })}</span>
                </div>
                <Button asChild variant="outline" size="sm" className="ml-auto">
                  <Link to="/devices/$deviceIp/actions/json" params={{ deviceIp }}>
                    <Braces /> {t('actionsPanel.editJson')}
                  </Link>
                </Button>
              </div>
              <ActionsPanel deviceIp={deviceIp} inputCount={inputCount} />
            </>
          )}
        </TabsContent>

        <TabsContent value="connection">
          <div className="flex flex-col gap-4">
            <RemoteAccessPanel deviceIp={deviceIp} />
            <ServiceConnectionPanel deviceIp={deviceIp} />
          </div>
        </TabsContent>
      </Tabs>

      <RenameDialog
        deviceIp={deviceIp}
        device={info.data}
        open={renameOpen}
        onOpenChange={setRenameOpen}
      />

      <Outlet />
    </div>
  );
}
