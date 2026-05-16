#!/usr/bin/env node
/**
 * Generates typed API clients with openapi-generator-cli:
 *  - companion client  (from the Fastify-emitted OpenAPI document)
 *  - one BleBox device client per committed device spec
 *
 * All clients land in packages/shared/src/clients/ and are committed so the
 * web app builds without re-running codegen.
 *
 * Generated output is post-processed:
 *  - `// @ts-nocheck` is prepended (vendored code, excluded from strict checks);
 *  - a `mapValues` helper is appended to each `runtime.ts` (openapi-generator
 *    7.22 omits it from the typescript-fetch runtime, though models import it).
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const shared = join(root, 'packages', 'shared');
const generatorBin = join(
  root,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'openapi-generator-cli.cmd' : 'openapi-generator-cli',
);

const MAP_VALUES_HELPER = `
export function mapValues(data: any, fn: (item: any) => any) {
  return Object.keys(data).reduce(
    (acc, key) => ({ ...acc, [key]: fn(data[key]) }),
    {} as Record<string, any>,
  );
}
`;

/** @param {string} dir */
function postProcess(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      postProcess(full);
      continue;
    }
    if (!entry.name.endsWith('.ts')) continue;

    let content = readFileSync(full, 'utf8');
    if (entry.name === 'runtime.ts' && !content.includes('export function mapValues')) {
      content += MAP_VALUES_HELPER;
    }
    if (!content.startsWith('// @ts-nocheck')) {
      content = `// @ts-nocheck\n${content}`;
    }
    writeFileSync(full, content);
  }
}

/** @type {{ name: string, input: string, output: string, optional?: boolean }[]} */
const targets = [
  {
    name: 'companion',
    input: join(shared, 'companion.openapi.json'),
    output: join(shared, 'src', 'clients', 'companion'),
    optional: true,
  },
  ...['switchBox', 'switchBoxD', 'buttonBox', 'wLightBox'].map((type) => ({
    name: `blebox/${type}`,
    input: join(shared, 'blebox-specs', `${type}.json`),
    output: join(shared, 'src', 'clients', 'blebox', type),
  })),
];

for (const target of targets) {
  if (!existsSync(target.input)) {
    if (target.optional) {
      console.warn(`[codegen] skipping ${target.name}: ${target.input} not found yet`);
      continue;
    }
    throw new Error(`[codegen] missing spec for ${target.name}: ${target.input}`);
  }

  console.log(`[codegen] ${target.name} -> ${target.output}`);
  rmSync(target.output, { recursive: true, force: true });
  execFileSync(
    generatorBin,
    [
      'generate',
      '-g',
      'typescript-fetch',
      '-i',
      target.input,
      '-o',
      target.output,
      '--skip-validate-spec',
      '--additional-properties=supportsES6=true,withoutRuntimeChecks=false,prefixParameterInterfaces=true',
    ],
    { stdio: 'inherit', cwd: root },
  );
  postProcess(target.output);
}

console.log('[codegen] done');
