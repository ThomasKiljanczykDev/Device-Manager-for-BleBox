import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { Loader2, Plus, Radar, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useDeviceList, useScanControls } from '@/features/devices/queries';

export const Route = createFileRoute('/devices')({
  component: DevicesLayout,
});

function DevicesLayout() {
  const { entries, scanning } = useDeviceList();
  const { start, stop } = useScanControls();

  return (
    <div className="flex h-screen">
      <aside className="flex w-72 shrink-0 flex-col border-r bg-card">
        <div className="p-4">
          <h1 className="text-sm font-semibold tracking-tight">BleBox Device Manager</h1>
          <p className="text-xs text-muted-foreground">Action configuration</p>
        </div>
        <Separator />
        <div className="flex flex-col gap-2 p-3">
          {scanning ? (
            <Button variant="secondary" size="sm" onClick={() => stop.mutate()}>
              <Square /> Stop scan
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => start.mutate()}
              disabled={start.isPending}
            >
              {start.isPending ? <Loader2 className="animate-spin" /> : <Radar />} Start scan
            </Button>
          )}
          <Button asChild variant="outline" size="sm">
            <Link to="/devices/add">
              <Plus /> Add manually
            </Link>
          </Button>
        </div>
        <Separator />
        <nav className="flex-1 overflow-y-auto p-2">
          {entries.length === 0 ? (
            <p className="px-2 py-6 text-center text-xs text-muted-foreground">
              {scanning ? 'Scanning the local network…' : 'No devices yet.'}
            </p>
          ) : (
            <ul className="flex flex-col gap-1">
              {entries.map((entry) => (
                <li key={entry.ip}>
                  <Link
                    to="/devices/$deviceIp"
                    params={{ deviceIp: entry.ip }}
                    className="block rounded-md px-3 py-2 text-sm transition-colors duration-150 hover:bg-accent"
                    activeProps={{ className: 'bg-accent' }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'size-2 shrink-0 rounded-full',
                          entry.discovered ? 'bg-emerald-500' : 'bg-muted-foreground/40',
                        )}
                        title={entry.discovered ? 'Online' : 'Not seen in last scan'}
                      />
                      <span className="truncate font-medium">{entry.device.deviceName}</span>
                    </div>
                    <div className="pl-4 text-xs text-muted-foreground">
                      {entry.device.type} · {entry.ip}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
