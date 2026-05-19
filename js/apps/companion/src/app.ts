import Fastify, { type FastifyInstance } from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import type { CompanionEnv } from '@blebox/shared';
import { DiscoveryService } from './discovery';
import { healthRoutes } from './routes/health';
import { discoveryRoutes } from './routes/discovery';
import { deviceRoutes } from './routes/devices';
import { proxyRoutes } from './routes/proxy';

/**
 * Builds the companion Fastify instance: a stateless service for mDNS/subnet
 * discovery and a CORS proxy to LAN BleBox devices. Exported separately from
 * the listen bootstrap so tests can drive it with `app.inject()`.
 */
export async function buildApp(env: CompanionEnv): Promise<FastifyInstance> {
  const app = Fastify({ logger: { level: env.LOG_LEVEL } }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'BleBox Companion API',
        version: '0.1.0',
        description: 'Discovery and CORS-proxy service for Device Manager for BleBox.',
      },
    },
    transform: jsonSchemaTransform,
  });
  await app.register(fastifySwaggerUi, { routePrefix: '/docs' });

  const discovery = new DiscoveryService(env);
  app.addHook('onClose', async () => {
    discovery.dispose();
  });

  await app.register(
    async (api) => {
      await api.register(healthRoutes);
      await api.register(discoveryRoutes(discovery));
      await api.register(deviceRoutes(env));
    },
    { prefix: '/api' },
  );

  await app.register(proxyRoutes(env), { prefix: '/api/proxy' });

  return app;
}
