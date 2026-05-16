import { buildApp } from './app';
import { env } from './env';

const app = await buildApp(env);

try {
  await app.listen({ host: env.COMPANION_HOST, port: env.COMPANION_PORT });
  app.log.info(`companion docs at http://${env.COMPANION_HOST}:${env.COMPANION_PORT}/docs`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
