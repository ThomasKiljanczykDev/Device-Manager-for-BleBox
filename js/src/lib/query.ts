import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5_000,
      refetchOnWindowFocus: false,
    },
  },
});

/** Stable query keys for companion and device data. */
export const queryKeys = {
  discovery: ['discovery'] as const,
  deviceInfo: (ip: string) => ['device', ip, 'info'] as const,
  deviceState: (ip: string) => ['device', ip, 'state'] as const,
  deviceActions: (ip: string) => ['device', ip, 'actions'] as const,
  deviceNetwork: (ip: string) => ['device', ip, 'network'] as const,
  deviceSettings: (ip: string) => ['device', ip, 'settings'] as const,
  deviceWifiScan: (ip: string) => ['device', ip, 'wifi', 'scan'] as const,
};
