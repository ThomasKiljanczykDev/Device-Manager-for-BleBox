import { createFileRoute, Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Plus, Radar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDeviceList } from '@/features/devices/queries';

export const Route = createFileRoute('/devices/')({
  component: DevicesIndex,
});

function DevicesIndex() {
  const { t } = useTranslation();
  const { entries } = useDeviceList();
  const hasDevices = entries.length > 0;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <Radar className="size-10 text-muted-foreground" />
      <div>
        <h2 className="text-lg font-semibold">
          {hasDevices ? t('devicesIndex.selectTitle') : t('devicesIndex.emptyTitle')}
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          {hasDevices ? t('devicesIndex.selectBody') : t('devicesIndex.emptyBody')}
        </p>
      </div>
      {hasDevices ? null : (
        <Button asChild variant="outline">
          <Link to="/devices/add">
            <Plus /> {t('common.addManually')}
          </Link>
        </Button>
      )}
    </div>
  );
}
