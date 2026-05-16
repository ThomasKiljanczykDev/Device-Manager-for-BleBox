import { createFileRoute, Link } from '@tanstack/react-router';
import { Plus, Radar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDeviceList } from '@/features/devices/queries';

export const Route = createFileRoute('/devices/')({
  component: DevicesIndex,
});

function DevicesIndex() {
  const { entries } = useDeviceList();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <Radar className="size-10 text-muted-foreground" />
      <div>
        <h2 className="text-lg font-semibold">
          {entries.length > 0 ? 'Select a device' : 'No devices yet'}
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          {entries.length > 0
            ? 'Pick a device from the sidebar to view and edit its action configuration.'
            : 'Scan the local network for BleBox switches, or add one manually by IP.'}
        </p>
      </div>
      {entries.length === 0 ? (
        <Button asChild variant="outline">
          <Link to="/devices/add">
            <Plus /> Add manually
          </Link>
        </Button>
      ) : null}
    </div>
  );
}
