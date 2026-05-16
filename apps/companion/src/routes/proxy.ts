import type { FastifyPluginAsync } from 'fastify';
import { isPrivateIpv4, type CompanionEnv } from '@blebox/shared';

/** Headers dropped in both directions — hop-by-hop plus length/encoding. */
const STRIPPED_HEADERS = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'host',
  'content-length',
  'content-encoding',
]);

const PROXY_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'] as const;

function forwardableRequestHeaders(headers: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    if (STRIPPED_HEADERS.has(key.toLowerCase())) continue;
    if (typeof value === 'string') out[key] = value;
  }
  return out;
}

/**
 * CORS proxy: forwards `ALL /api/proxy/:ip/*` to `http://{ip}/{rest}`.
 * Refuses any non-private IPv4 (or non-IPv4) target. Stateless; payloads are
 * never logged.
 */
export function proxyRoutes(env: CompanionEnv): FastifyPluginAsync {
  return async (app) => {
    // Pass request bodies straight through without parsing.
    app.removeAllContentTypeParsers();
    app.addContentTypeParser('*', { parseAs: 'buffer' }, (_request, body, done) => {
      done(null, body);
    });

    app.route({
      method: [...PROXY_METHODS],
      url: '/:ip/*',
      schema: { hide: true },
      handler: async (request, reply) => {
        const { ip } = request.params as { ip: string; '*': string };
        if (!isPrivateIpv4(ip)) {
          return reply
            .code(400)
            .send({ code: 'INVALID_IP', message: 'Target must be a private IPv4 address' });
        }

        const rest = (request.params as Record<string, string>)['*'] ?? '';
        const queryIndex = request.url.indexOf('?');
        const query = queryIndex >= 0 ? request.url.slice(queryIndex) : '';
        const target = `http://${ip}/${rest}${query}`;

        const hasBody = request.method !== 'GET' && request.method !== 'HEAD';
        try {
          const upstream = await fetch(target, {
            method: request.method,
            headers: forwardableRequestHeaders(request.headers),
            body: hasBody ? (request.body as Buffer | undefined) : undefined,
            signal: AbortSignal.timeout(env.DEVICE_PROBE_TIMEOUT_MS * 4),
          });

          reply.code(upstream.status);
          for (const [key, value] of upstream.headers) {
            if (!STRIPPED_HEADERS.has(key.toLowerCase())) reply.header(key, value);
          }
          return reply.send(Buffer.from(await upstream.arrayBuffer()));
        } catch (err) {
          const timedOut = err instanceof Error && err.name === 'TimeoutError';
          return reply.code(502).send({
            code: timedOut ? 'DEVICE_TIMEOUT' : 'PROXY_FAILED',
            message: timedOut ? 'The device did not respond in time' : 'Could not reach the device',
          });
        }
      },
    });
  };
}
