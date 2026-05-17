import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { privateIpv4Schema, type Device } from '@blebox/shared';
import { RouteDialog } from '@/components/route-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CompanionRequestError, probeDevice } from '@/lib/companion';
import { useDevicesStore } from '@/stores/devices';

export const Route = createFileRoute('/devices/add')({
  component: AddDeviceDialog,
});

function AddDeviceDialog() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const addDevice = useDevicesStore((state) => state.addDevice);

  const probe = useMutation({
    mutationFn: probeDevice,
    onSuccess: (device: Device, ip: string) => {
      addDevice(ip, device);
      void navigate({ to: '/devices/$deviceIp', params: { deviceIp: ip } });
    },
  });

  const form = useForm({
    defaultValues: { ip: '' },
    onSubmit: async ({ value }) => {
      await probe.mutateAsync(value.ip.trim());
    },
  });

  const errorMessage =
    probe.error instanceof CompanionRequestError
      ? probe.error.message
      : probe.error
        ? t('manualAdd.companionError')
        : null;

  return (
    <RouteDialog
      title={t('manualAdd.title')}
      description={t('manualAdd.description')}
      onClose={() => navigate({ to: '/devices' })}
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <form.Field
          name="ip"
          validators={{
            onChange: ({ value }) => {
              const result = privateIpv4Schema.safeParse(value.trim());
              return result.success ? undefined : result.error.issues[0]?.message;
            },
          }}
        >
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ip">{t('manualAdd.ipLabel')}</Label>
              <Input
                id="ip"
                placeholder={t('manualAdd.ipPlaceholder')}
                autoFocus
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
              />
              {field.state.meta.isTouched && field.state.meta.errors[0] ? (
                <p className="text-xs text-destructive">{String(field.state.meta.errors[0])}</p>
              ) : null}
            </div>
          )}
        </form.Field>

        {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate({ to: '/devices' })}>
            {t('common.cancel')}
          </Button>
          <form.Subscribe selector={(state) => state.canSubmit}>
            {(canSubmit) => (
              <Button type="submit" disabled={!canSubmit || probe.isPending}>
                {probe.isPending ? <Loader2 className="animate-spin" /> : null}
                {t('manualAdd.submit')}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </RouteDialog>
  );
}
