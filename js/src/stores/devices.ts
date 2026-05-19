import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Device, DiscoveredDevice } from '@/shared';

/** A device the user explicitly added by IP. */
export interface SavedDevice {
  ip: string;
  device: Device;
  addedAt: string;
}

interface DevicesState {
  /** Manually-added devices. */
  saved: SavedDevice[];
  /** Devices seen by discovery, kept so they survive a page refresh. */
  discovered: DiscoveredDevice[];
  addDevice: (ip: string, device: Device) => void;
  /** Upserts the latest live discovery results into the persisted list. */
  rememberDiscovered: (devices: DiscoveredDevice[]) => void;
  removeDevice: (ip: string) => void;
}

/**
 * Known devices, persisted to localStorage: manually-added (`saved`) and
 * auto-remembered discovery results (`discovered`). The live discovery poll
 * decides which of them are currently online.
 */
export const useDevicesStore = create<DevicesState>()(
  persist(
    (set) => ({
      saved: [],
      discovered: [],
      addDevice: (ip, device) =>
        set((state) => ({
          saved: [
            ...state.saved.filter((d) => d.ip !== ip),
            { ip, device, addedAt: new Date().toISOString() },
          ],
        })),
      rememberDiscovered: (devices) =>
        set((state) => {
          const liveIps = new Set(devices.map((d) => d.ip));
          // Live sightings replace their entries; previously-seen devices stay.
          return {
            discovered: [...state.discovered.filter((d) => !liveIps.has(d.ip)), ...devices],
          };
        }),
      removeDevice: (ip) =>
        set((state) => ({
          saved: state.saved.filter((d) => d.ip !== ip),
          discovered: state.discovered.filter((d) => d.ip !== ip),
        })),
    }),
    { name: 'blebox.devices' },
  ),
);
