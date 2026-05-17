import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Device } from '@blebox/shared';
import { getDiscoveredDevices, startDiscovery, stopDiscovery } from '@/lib/companion';
import { queryKeys } from '@/lib/query';
import { useDevicesStore } from '@/stores/devices';

/** A device shown in the sidebar — known (persisted) and possibly online. */
export interface DeviceListEntry {
  ip: string;
  device: Device;
  /** Present in the latest live discovery result. */
  online: boolean;
  /** Manually added (vs. only seen by discovery). */
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

/**
 * Persists live discovery results into the devices store so they survive a
 * page refresh. Call once, from the always-mounted devices layout.
 */
export function useDiscoverySync(): void {
  const discovery = useDiscoveryQuery();
  const rememberDiscovered = useDevicesStore((state) => state.rememberDiscovered);
  const devices = discovery.data?.devices;

  useEffect(() => {
    if (devices && devices.length > 0) {
      rememberDiscovered(devices);
    }
  }, [devices, rememberDiscovered]);
}

/** Merged device list: persisted (discovered + saved), marked online from the live poll. */
export function useDeviceList(): { entries: DeviceListEntry[]; scanning: boolean } {
  const discovery = useDiscoveryQuery();
  const saved = useDevicesStore((state) => state.saved);
  const discovered = useDevicesStore((state) => state.discovered);

  const live = discovery.data?.devices ?? [];
  const onlineIps = new Set(live.map((d) => d.ip));

  const byIp = new Map<string, DeviceListEntry>();
  for (const entry of discovered) {
    byIp.set(entry.ip, {
      ip: entry.ip,
      device: entry.device,
      online: onlineIps.has(entry.ip),
      saved: false,
    });
  }
  for (const entry of saved) {
    byIp.set(entry.ip, {
      ip: entry.ip,
      device: byIp.get(entry.ip)?.device ?? entry.device,
      online: onlineIps.has(entry.ip),
      saved: true,
    });
  }
  // Fold in any live device not yet persisted (first poll before the sync effect).
  for (const found of live) {
    byIp.set(found.ip, {
      ip: found.ip,
      device: found.device,
      online: true,
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
