#!/usr/bin/env node
/**
 * Builds the macOS-flavoured app icon (`rust/icons/icon.icns`) by applying the
 * Apple Big Sur+ squircle template to `app-icon-full-background.png`:
 *
 *   - 1024×1024 canvas
 *   - artwork sits in the 824×824 inner squircle (~10% margin per side)
 *   - shape is a 5th-order superellipse with 4×4 supersampled alpha
 *
 *   node assets/branding/generate-macos-icons.mjs
 *
 * macOS only — uses the system `sips` for resizing and `iconutil` for the
 * .icns container. Windows (.ico) and Linux PNG icons keep their existing
 * (circle) style and are not touched by this script.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync, inflateSync } from 'node:zlib';

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, 'app-icon-full-background.png');
const iconsDir = resolve(here, '../../rust/icons');

// Apple's published macOS template: 824/1024 ≈ 0.805 (≈10% margin per side).
const INSET_RATIO = 100 / 1024;
// Squircle exponent. n=5 closely matches Apple's continuous-corner curve.
const SQUIRCLE_N = 5;
// Supersampling factor for edge antialiasing.
const AA = 4;

const PNG_SIG = Buffer.from('89504e470d0a1a0a', 'hex');

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ buf[i]) & 0xff];
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(data.length, 0);
  head.write(type, 4, 'ascii');
  const tail = Buffer.alloc(4);
  tail.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), data])), 0);
  return Buffer.concat([head, data, tail]);
}

function decodePng(buf) {
  if (!buf.subarray(0, 8).equals(PNG_SIG)) throw new Error('not a PNG');
  let off = 8;
  let ihdr;
  const idat = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString('ascii', off + 4, off + 8);
    const data = buf.subarray(off + 8, off + 8 + len);
    off += 12 + len;
    if (type === 'IHDR') {
      ihdr = {
        width: data.readUInt32BE(0),
        height: data.readUInt32BE(4),
        bitDepth: data[8],
        colorType: data[9],
      };
    } else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
  }
  if (ihdr.bitDepth !== 8 || ihdr.colorType !== 6) {
    throw new Error(`only 8-bit RGBA PNGs are supported (got bd=${ihdr.bitDepth} ct=${ihdr.colorType})`);
  }
  const raw = inflateSync(Buffer.concat(idat));
  const { width: w, height: h } = ihdr;
  const stride = w * 4;
  const pixels = Buffer.alloc(stride * h);
  for (let y = 0; y < h; y++) {
    const filter = raw[y * (stride + 1)];
    const src = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    const dst = pixels.subarray(y * stride, (y + 1) * stride);
    const prev = y > 0 ? pixels.subarray((y - 1) * stride, y * stride) : null;
    for (let x = 0; x < stride; x++) {
      const a = x >= 4 ? dst[x - 4] : 0;
      const b = prev ? prev[x] : 0;
      const c = x >= 4 && prev ? prev[x - 4] : 0;
      let v;
      switch (filter) {
        case 0: v = src[x]; break;
        case 1: v = src[x] + a; break;
        case 2: v = src[x] + b; break;
        case 3: v = src[x] + ((a + b) >> 1); break;
        case 4: {
          const p = a + b - c;
          const pa = Math.abs(p - a);
          const pb = Math.abs(p - b);
          const pc = Math.abs(p - c);
          const pr = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
          v = src[x] + pr;
          break;
        }
        default: throw new Error(`unknown PNG filter ${filter}`);
      }
      dst[x] = v & 0xff;
    }
  }
  return { width: w, height: h, pixels };
}

function encodePng(width, height, pixels) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type: RGBA
  // bytes 10..12 default to 0 (compression, filter, interlace methods)
  const stride = width * 4;
  const filtered = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    filtered[y * (stride + 1)] = 0; // filter type: None
    pixels.copy(filtered, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  return Buffer.concat([
    PNG_SIG,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(filtered, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/**
 * Multiplies the source's alpha channel by squircle coverage.
 * The artwork is also inset so it fits inside Apple's 824/1024 inner tile.
 */
function applySquircleTemplate(width, height, src) {
  const insetPx = INSET_RATIO * width;
  const inner = width - insetPx * 2;
  const half = inner / 2;
  const cx = width / 2;
  const cy = height / 2;
  const out = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Coverage of the squircle at this pixel (4x4 supersampling).
      let hits = 0;
      for (let sy = 0; sy < AA; sy++) {
        for (let sx = 0; sx < AA; sx++) {
          const dx = (x + (sx + 0.5) / AA - cx) / half;
          const dy = (y + (sy + 0.5) / AA - cy) / half;
          if (Math.pow(Math.abs(dx), SQUIRCLE_N) + Math.pow(Math.abs(dy), SQUIRCLE_N) <= 1) hits++;
        }
      }
      const coverage = hits / (AA * AA);
      // Sample the source at the inset-scaled coordinate (nearest neighbour
      // is fine here — we resize from the full-resolution master afterwards).
      const sxImg = Math.min(width - 1, Math.max(0, Math.round(((x - insetPx) / inner) * width)));
      const syImg = Math.min(height - 1, Math.max(0, Math.round(((y - insetPx) / inner) * height)));
      const si = (syImg * width + sxImg) * 4;
      const di = (y * width + x) * 4;
      out[di] = src[si];
      out[di + 1] = src[si + 1];
      out[di + 2] = src[si + 2];
      out[di + 3] = Math.round(src[si + 3] * coverage);
    }
  }
  return out;
}

// --- main ---------------------------------------------------------------

const decoded = decodePng(readFileSync(source));
if (decoded.width !== decoded.height) {
  throw new Error(`expected a square source image, got ${decoded.width}×${decoded.height}`);
}
console.log(`[macos] source ${decoded.width}×${decoded.height}`);

const masked = applySquircleTemplate(decoded.width, decoded.height, decoded.pixels);
const masterPng = encodePng(decoded.width, decoded.height, masked);

const tmp = mkdtempSync(join(tmpdir(), 'blebox-macos-icons-'));
const iconset = join(tmp, 'icon.iconset');
mkdirSync(iconset);
const master = join(tmp, 'master.png');
writeFileSync(master, masterPng);

/** macOS iconset entries: [filename, pixel size] */
const sizes = [
  ['icon_16x16.png', 16],
  ['icon_16x16@2x.png', 32],
  ['icon_32x32.png', 32],
  ['icon_32x32@2x.png', 64],
  ['icon_128x128.png', 128],
  ['icon_128x128@2x.png', 256],
  ['icon_256x256.png', 256],
  ['icon_256x256@2x.png', 512],
  ['icon_512x512.png', 512],
  ['icon_512x512@2x.png', 1024],
];

for (const [name, size] of sizes) {
  execFileSync(
    'sips',
    [
      '-s', 'format', 'png',
      '-z', String(size), String(size),
      master,
      '--out', join(iconset, name),
    ],
    { stdio: 'ignore' },
  );
  console.log(`[macos] ${name} (${size}×${size})`);
}

mkdirSync(iconsDir, { recursive: true });
const icns = join(iconsDir, 'icon.icns');
execFileSync('iconutil', ['-c', 'icns', iconset, '-o', icns], { stdio: 'inherit' });
console.log(`[macos] wrote ${icns}`);

rmSync(tmp, { recursive: true, force: true });
