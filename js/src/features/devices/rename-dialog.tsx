import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
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
import { setDeviceName } from '@/lib/settings';
import { queryKeys } from '@/lib/query';
import { useDevicesStore } from '@/stores/devices';
import type { Device } from '@/shared';

interface RenameDialogProps {
  deviceIp: string;
  device: Device | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** BleBox `deviceName` is constrained to 1–31 characters in the spec. */
const MAX_DEVICE_NAME_LEN = 31;

/**
 * Renames the device via `POST /api/settings/set { settings: { deviceName }}`.
 * Triggered from a Pencil icon in the device-detail header — controlled by the
 * parent, since this isn't a deep-linkable route.
 *
 * The form lives in an inner component so its state lifecycle is tied to the
 * dialog content's mount (Radix unmounts content when closed). That way the
 * input always reflects the *currently active* device's name, even when the
 * user navigates between devices without closing this component.
 */
export function RenameDialog({ deviceIp, device, open, onOpenChange }: RenameDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {device ? (
          <RenameForm
            deviceIp={deviceIp}
            device={device}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

interface RenameFormProps {
  deviceIp: string;
  device: Device;
  onClose: () => void;
}

function RenameForm({ deviceIp, device, onClose }: RenameFormProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  // Mounts when the dialog opens (Radix unmounts content on close), so this
  // initializer always reflects the active device's current name.
  const [value, setValue] = useState(device.deviceName);

  const trimmed = value.trim();
  const lengthValid = trimmed.length >= 1 && trimmed.length <= MAX_DEVICE_NAME_LEN;
  const dirty = trimmed !== device.deviceName;

  const rename = useMutation({
    mutationFn: (name: string) => setDeviceName(deviceIp, name),
    onSuccess: async (_data, name) => {
      useDevicesStore.getState().addDevice(deviceIp, { ...device, deviceName: name });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.deviceInfo(deviceIp) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.deviceSettings(deviceIp) }),
      ]);
      toast.success(t('deviceDetail.rename.toastSaved'));
      onClose();
    },
    onError: () => toast.error(t('deviceDetail.rename.toastError')),
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t('deviceDetail.rename.title')}</DialogTitle>
        <DialogDescription>{t('deviceDetail.rename.description')}</DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-2">
        <Label htmlFor="rename-input">{t('deviceDetail.rename.label')}</Label>
        <Input
          id="rename-input"
          value={value}
          maxLength={MAX_DEVICE_NAME_LEN}
          placeholder={t('deviceDetail.rename.placeholder')}
          autoFocus
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && lengthValid && dirty && !rename.isPending) {
              rename.mutate(trimmed);
            }
          }}
        />
        {!lengthValid ? (
          <p className="text-xs text-destructive">{t('deviceDetail.rename.lengthError')}</p>
        ) : null}
      </div>
      <DialogFooter>
        <Button variant="ghost" disabled={rename.isPending} onClick={onClose}>
          {t('deviceDetail.rename.cancel')}
        </Button>
        <Button
          disabled={!lengthValid || !dirty || rename.isPending}
          onClick={() => rename.mutate(trimmed)}
        >
          {rename.isPending ? <Loader2 className="animate-spin" /> : null}{' '}
          {t('deviceDetail.rename.save')}
        </Button>
      </DialogFooter>
    </>
  );
}
