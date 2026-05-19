import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildApp } from './app';
import { env } from './env';

/** Emits the companion OpenAPI document for client codegen. */
const app = await buildApp(env);
await app.ready();

const out = resolve(import.meta.dirname, '../../../packages/shared/companion.openapi.json');
writeFileSync(out, `${JSON.stringify(app.swagger(), null, 2)}\n`);
await app.close();

console.log(`[gen:spec] wrote ${out}`);
