#!/usr/bin/env node
/**
 * Regenerates the web favicon set into apps/web/public/ from the app icon.
 * macOS only — resizing uses the built-in `sips`.
 *
 *   node assets/branding/generate-favicons.mjs
 *
 * Outputs: favicon-{16,32,48}x….png, apple-touch-icon.png (180), icon-{192,512}.png
 * and favicon.ico (an ICO container with the 16/32/48 PNGs embedded).
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, 'app-icon.png');
const outDir = resolve(here, '../../apps/web/public');
mkdirSync(outDir, { recursive: true });

/** @type {[name: string, size: number][]} */
const pngTargets = [
  ['favicon-16x16.png', 16],
  ['favicon-32x32.png', 32],
  ['favicon-48x48.png', 48],
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
];

for (const [name, size] of pngTargets) {
  execFileSync(
    'sips',
    ['-s', 'format', 'png', '-z', String(size), String(size), source, '--out', join(outDir, name)],
    { stdio: 'ignore' },
  );
  console.log(`[favicons] ${name} (${size}x${size})`);
}

// Assemble favicon.ico — a Vista+ ICO containing PNG-encoded images.
const icoSizes = [16, 32, 48];
const images = icoSizes.map((s) => readFileSync(join(outDir, `favicon-${s}x${s}.png`)));

const header = Buffer.alloc(6);
header.writeUInt16LE(1, 2); // image type: icon
header.writeUInt16LE(images.length, 4);

let dataOffset = 6 + images.length * 16;
const entries = images.map((img, i) => {
  const entry = Buffer.alloc(16);
  entry.writeUInt8(icoSizes[i], 0); // width  (<256)
  entry.writeUInt8(icoSizes[i], 1); // height (<256)
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(img.length, 8);
  entry.writeUInt32LE(dataOffset, 12);
  dataOffset += img.length;
  return entry;
});

writeFileSync(join(outDir, 'favicon.ico'), Buffer.concat([header, ...entries, ...images]));
console.log('[favicons] favicon.ico (16/32/48)');
console.log(`[favicons] done -> ${outDir}`);
