import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { discoveryDevicesResponseSchema, discoveryStatusResponseSchema } from '@blebox/shared';
import type { DiscoveryService } from '../discovery';

/** mDNS + subnet discovery endpoints, backed by a shared {@link DiscoveryService}. */
export function discoveryRoutes(discovery: DiscoveryService): FastifyPluginAsyncZod {
  return async (app) => {
    app.post(
      '/discovery/start',
      {
        schema: {
          tags: ['discovery'],
          summary: 'Start an mDNS + subnet scan',
          response: { 202: discoveryStatusResponseSchema },
        },
      },
      async (_request, reply) => {
        discovery.start();
        reply.code(202);
        return { scanning: discovery.scanning };
      },
    );

    app.post(
      '/discovery/stop',
      {
        schema: {
          tags: ['discovery'],
          summary: 'Stop scanning',
          response: { 200: discoveryStatusResponseSchema },
        },
      },
      async () => {
        discovery.stop();
        return { scanning: discovery.scanning };
      },
    );

    app.get(
      '/discovery/devices',
      {
        schema: {
          tags: ['discovery'],
          summary: 'Currently discovered BleBox devices',
          response: { 200: discoveryDevicesResponseSchema },
        },
      },
      async () => ({ scanning: discovery.scanning, devices: discovery.devices }),
    );
  };
}
