import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Device } from '@blebox/shared';

/** A device the user has explicitly kept (manually added or saved from a scan). */
export interface SavedDevice {
  ip: string;
  device: Device;
  addedAt: string;
}

interface DevicesState {
  saved: SavedDevice[];
  addDevice: (ip: string, device: Device) => void;
  removeDevice: (ip: string) => void;
}

/**
 * Known devices, persisted to localStorage. Discovered devices come from the
 * companion and are merged in-memory by the UI; only explicitly saved/added
 * devices live here.
 */
export const useDevicesStore = create<DevicesState>()(
  persist(
    (set) => ({
      saved: [],
      addDevice: (ip, device) =>
        set((state) => ({
          saved: [
            ...state.saved.filter((d) => d.ip !== ip),
            { ip, device, addedAt: new Date().toISOString() },
          ],
        })),
      removeDevice: (ip) =>
        set((state) => ({ saved: state.saved.filter((d) => d.ip !== ip) })),
    }),
    { name: 'blebox.devices' },
  ),
);
