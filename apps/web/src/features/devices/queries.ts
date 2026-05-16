import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Device } from '@blebox/shared';
import { getDiscoveredDevices, startDiscovery, stopDiscovery } from '@/lib/companion';
import { queryKeys } from '@/lib/query';
import { useDevicesStore } from '@/stores/devices';

/** A device shown in the sidebar — discovered, saved, or both. */
export interface DeviceListEntry {
  ip: string;
  device: Device;
  discovered: boolean;
  saved: boolean;
}

/** Polls the companion for discovered devices; auto-refetches while scanning. */
export function useDiscoveryQuery() {
  return useQuery({
    queryKey: queryKeys.discovery,
    queryFn: getDiscoveredDevices,
    refetchInterval: (query) => (query.state.data?.scanning ? 2000 : false),
  });
}

/** Merged, deduped device list: persisted devices overlaid with live discovery. */
export function useDeviceList(): { entries: DeviceListEntry[]; scanning: boolean } {
  const discovery = useDiscoveryQuery();
  const saved = useDevicesStore((state) => state.saved);

  const byIp = new Map<string, DeviceListEntry>();
  for (const entry of saved) {
    byIp.set(entry.ip, { ip: entry.ip, device: entry.device, discovered: false, saved: true });
  }
  for (const found of discovery.data?.devices ?? []) {
    byIp.set(found.ip, {
      ip: found.ip,
      device: found.device,
      discovered: true,
      saved: byIp.get(found.ip)?.saved ?? false,
    });
  }

  const entries = [...byIp.values()].sort((a, b) =>
    a.device.deviceName.localeCompare(b.device.deviceName),
  );
  return { entries, scanning: discovery.data?.scanning ?? false };
}

/** Start/stop scan mutations, wired to invalidate the discovery query. */
export function useScanControls() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.discovery });

  const start = useMutation({ mutationFn: startDiscovery, onSuccess: invalidate });
  const stop = useMutation({ mutationFn: stopDiscovery, onSuccess: invalidate });
  return { start, stop };
}
