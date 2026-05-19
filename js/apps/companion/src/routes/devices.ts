import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import {
  companionErrorSchema,
  isPrivateIpv4,
  probeRequestSchema,
  probeResponseSchema,
  type CompanionEnv,
} from '@blebox/shared';
import { probeDevice } from '../blebox';

/** Manual device-add endpoint: validates an IP and probes it for `/info`. */
export function deviceRoutes(env: CompanionEnv): FastifyPluginAsyncZod {
  return async (app) => {
    app.post(
      '/devices/probe',
      {
        schema: {
          tags: ['devices'],
          summary: 'Probe a manually entered IP for a BleBox device',
          body: probeRequestSchema,
          response: {
            200: probeResponseSchema,
            400: companionErrorSchema,
            502: companionErrorSchema,
            504: companionErrorSchema,
          },
        },
      },
      async (request, reply) => {
        const { ip } = request.body;

        if (!isPrivateIpv4(ip)) {
          reply.code(400);
          return {
            code: 'INVALID_IP',
            message: 'Address must be a private or link-local IPv4 literal',
          };
        }

        const result = await probeDevice(ip, env.DEVICE_PROBE_TIMEOUT_MS);
        if (result.ok) {
          return { device: result.device };
        }

        if (result.reason === 'timeout') {
          reply.code(504);
          return { code: 'DEVICE_TIMEOUT', message: 'No response from the device in time' };
        }
        if (result.reason === 'invalid') {
          reply.code(502);
          return { code: 'NOT_BLEBOX', message: 'Host responded but is not a BleBox device' };
        }
        reply.code(502);
        return { code: 'DEVICE_UNREACHABLE', message: 'Could not reach a host at this address' };
      },
    );
  };
}
