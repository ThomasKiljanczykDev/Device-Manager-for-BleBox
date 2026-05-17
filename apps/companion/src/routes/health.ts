import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { healthResponseSchema } from '@blebox/shared';

/** Liveness endpoint. */
export const healthRoutes: FastifyPluginAsyncZod = async (app) => {
  const startedAt = Date.now();

  app.get(
    '/health',
    {
      schema: {
        tags: ['health'],
        summary: 'Liveness probe',
        response: { 200: healthResponseSchema },
      },
    },
    async () => ({
      status: 'ok' as const,
      uptimeS: Math.round((Date.now() - startedAt) / 1000),
    }),
  );
};
