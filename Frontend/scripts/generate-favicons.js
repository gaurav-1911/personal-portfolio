/**
 * Favicon Generator Script
 * Generates multi-resolution favicon.ico (16x16, 32x32, 48x48),
 * favicon-32x32.png, and favicon-48x48.png from favicon-512x512.png.
 */
import fs from 'fs';
import zlib from 'zlib';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');

// Precompute CRC32 Table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const buf = Buffer.alloc(12 + data.length);
  buf.writeUInt32BE(data.length, 0);
  buf.write(type, 4, 4);
  data.copy(buf, 8);
  buf.writeUInt32BE(crc32(buf.subarray(4, 8 + data.length)), 8 + data.length);
  return buf;
}

export function generateFavicons() {
  const srcPath = path.join(publicDir, 'favicon-512x512.png');
  const srcBuf = fs.readFileSync(srcPath);

  let offset = 8;
  const idat = [];
  while (offset < srcBuf.length) {
    const len = srcBuf.readUInt32BE(offset);
    const type = srcBuf.subarray(offset + 4, offset + 8).toString();
    if (type === 'IDAT') idat.push(srcBuf.subarray(offset + 8, offset + 8 + len));
    offset += 12 + len;
  }

  const srcRaw = zlib.inflateSync(Buffer.concat(idat));
  const srcW = 512;
  const srcH = 512;
  const srcRowLen = srcW * 4 + 1;

  function getSrcPixel(x, y) {
    x = Math.max(0, Math.min(srcW - 1, Math.floor(x)));
    y = Math.max(0, Math.min(srcH - 1, Math.floor(y)));
    const idx = y * srcRowLen + 1 + x * 4;
    return [srcRaw[idx], srcRaw[idx + 1], srcRaw[idx + 2], srcRaw[idx + 3]];
  }

  function resizeImage(targetW, targetH) {
    const dstRaw = Buffer.alloc(targetH * (targetW * 4 + 1));
    const scaleX = srcW / targetW;
    const scaleY = srcH / targetH;

    for (let dy = 0; dy < targetH; dy++) {
      const rowOffset = dy * (targetW * 4 + 1);
      dstRaw[rowOffset] = 0; // Filter None

      for (let dx = 0; dx < targetW; dx++) {
        const sx0 = dx * scaleX;
        const sx1 = (dx + 1) * scaleX;
        const sy0 = dy * scaleY;
        const sy1 = (dy + 1) * scaleY;

        let sumR = 0;
        let sumG = 0;
        let sumB = 0;
        let sumA = 0;
        let count = 0;
        const startX = Math.floor(sx0);
        const endX = Math.min(srcW, Math.ceil(sx1));
        const startY = Math.floor(sy0);
        const endY = Math.min(srcH, Math.ceil(sy1));

        for (let sy = startY; sy < endY; sy++) {
          for (let sx = startX; sx < endX; sx++) {
            const [r, g, b, a] = getSrcPixel(sx, sy);
            sumR += r;
            sumG += g;
            sumB += b;
            sumA += a;
            count++;
          }
        }

        const pxOffset = rowOffset + 1 + dx * 4;
        dstRaw[pxOffset] = Math.round(sumR / count);
        dstRaw[pxOffset + 1] = Math.round(sumG / count);
        dstRaw[pxOffset + 2] = Math.round(sumB / count);
        dstRaw[pxOffset + 3] = Math.round(sumA / count);
      }
    }
    return dstRaw;
  }

  function encodePng(width, height, rawData) {
    const header = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const ihdrData = Buffer.alloc(13);
    ihdrData.writeUInt32BE(width, 0);
    ihdrData.writeUInt32BE(height, 4);
    ihdrData.writeUInt8(8, 8);
    ihdrData.writeUInt8(6, 9);
    ihdrData.writeUInt8(0, 10);
    ihdrData.writeUInt8(0, 11);
    ihdrData.writeUInt8(0, 12);

    const ihdrChunk = makeChunk('IHDR', ihdrData);
    const compressed = zlib.deflateSync(rawData, { level: 9 });
    const idatChunk = makeChunk('IDAT', compressed);
    const iendChunk = makeChunk('IEND', Buffer.alloc(0));

    return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
  }

  function createIco(pngBuffers) {
    const count = pngBuffers.length;
    const headerLen = 6;
    const dirEntryLen = 16;
    let entryOffset = headerLen + dirEntryLen * count;

    const entries = [];
    for (const img of pngBuffers) {
      const entry = Buffer.alloc(dirEntryLen);
      entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
      entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
      entry.writeUInt8(0, 2);
      entry.writeUInt8(0, 3);
      entry.writeUInt16LE(1, 4);
      entry.writeUInt16LE(32, 6);
      entry.writeUInt32LE(img.buffer.length, 8);
      entry.writeUInt32LE(entryOffset, 12);
      entries.push(entry);
      entryOffset += img.buffer.length;
    }

    const header = Buffer.alloc(headerLen);
    header.writeUInt16LE(0, 0);
    header.writeUInt16LE(1, 2);
    header.writeUInt16LE(count, 4);

    return Buffer.concat([header, ...entries, ...pngBuffers.map((p) => p.buffer)]);
  }

  const png16 = encodePng(16, 16, resizeImage(16, 16));
  const png32 = encodePng(32, 32, resizeImage(32, 32));
  const png48 = encodePng(48, 48, resizeImage(48, 48));

  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), png32);
  fs.writeFileSync(path.join(publicDir, 'favicon-48x48.png'), png48);

  const icoBuf = createIco([
    { width: 16, height: 16, buffer: png16 },
    { width: 32, height: 32, buffer: png32 },
    { width: 48, height: 48, buffer: png48 },
  ]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuf);

  console.log('✔ Generated favicon-32x32.png, favicon-48x48.png, and multi-resolution favicon.ico');
}

if (process.argv[1] && process.argv[1].endsWith('generate-favicons.js')) {
  generateFavicons();
}
