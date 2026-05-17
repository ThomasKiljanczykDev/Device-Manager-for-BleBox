import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { companionEnvSchema } from '@blebox/shared';
import { buildApp } from './app';

const env = companionEnvSchema.parse({ LOG_LEVEL: 'silent', DEVICE_PROBE_TIMEOUT_MS: 200 });

const deviceInfo = {
  device: {
    deviceName: 'SimonGO Kitchen',
    type: 'switchBox',
    id: 'dabc3883d0e0',
    ip: '192.168.88.200',
  },
};

let app: FastifyInstance;

beforeEach(async () => {
  app = await buildApp(env);
  await app.ready();
});

afterEach(async () => {
  await app.close();
  vi.unstubAllGlobals();
});

describe('GET /api/health', () => {
  it('reports liveness', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/health' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({ status: 'ok' });
  });
});

describe('discovery endpoints', () => {
  it('POST /api/discovery/start returns 202', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('no network')));
    const res = await app.inject({ method: 'POST', url: '/api/discovery/start' });
    expect(res.statusCode).toBe(202);
    expect(res.json()).toEqual({ scanning: true });
  });

  it('POST /api/discovery/stop returns 200 and clears scanning', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/discovery/stop' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ scanning: false });
  });

  it('GET /api/discovery/devices returns the current list', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/discovery/devices' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ scanning: false, devices: [] });
  });
});

describe('POST /api/devices/probe', () => {
  it('returns the device for a reachable BleBox host', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify(deviceInfo), { status: 200 })),
    );
    const res = await app.inject({
      method: 'POST',
      url: '/api/devices/probe',
      payload: { ip: '192.168.88.200' },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({ device: { type: 'switchBox' } });
  });

  it('rejects a non-private IP with 400', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/devices/probe',
      payload: { ip: '8.8.8.8' },
    });
    expect(res.statusCode).toBe(400);
    expect(res.json()).toMatchObject({ code: 'INVALID_IP' });
  });
});

describe('ALL /api/proxy/:ip/*', () => {
  it('forwards a request to a private device', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ relays: [] }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const res = await app.inject({ method: 'GET', url: '/api/proxy/192.168.88.200/state' });
    expect(res.statusCode).toBe(200);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://192.168.88.200/state',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('refuses a non-private target with 400', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/proxy/8.8.8.8/state' });
    expect(res.statusCode).toBe(400);
    expect(res.json()).toMatchObject({ code: 'INVALID_IP' });
  });
});
