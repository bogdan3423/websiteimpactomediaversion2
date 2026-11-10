import { readFileSync } from "node:fs";

/**
 * Reads the pixel size of a JPEG, PNG, WebP or GIF file from its header, so
 * article images always get width/height (no layout shift) without a dependency.
 * JPEG EXIF orientation is honoured (phone photos are often stored rotated and
 * the image optimiser serves them upright).
 */
export function imageSize(file: string): { width: number; height: number } | null {
  let buf: Buffer;
  try {
    buf = readFileSync(/*turbopackIgnore: true*/ file);
  } catch {
    return null;
  }
  if (buf.length < 30) return null;

  // PNG
  if (buf.readUInt32BE(0) === 0x89504e47) return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };

  // GIF
  if (buf.toString("ascii", 0, 4) === "GIF8") return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };

  // WebP
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const chunk = buf.toString("ascii", 12, 16);
    if (chunk === "VP8 ") return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    if (chunk === "VP8L") {
      const bits = buf.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    if (chunk === "VP8X") return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
    return null;
  }

  // JPEG
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let offset = 2;
    let orientation = 1;
    while (offset + 9 < buf.length) {
      if (buf[offset] !== 0xff) return null;
      const marker = buf[offset + 1] as number;
      const length = buf.readUInt16BE(offset + 2);
      if (marker === 0xe1 && buf.toString("ascii", offset + 4, offset + 8) === "Exif") {
        orientation = exifOrientation(buf, offset + 10) ?? orientation;
      }
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        const height = buf.readUInt16BE(offset + 5);
        const width = buf.readUInt16BE(offset + 7);
        return orientation >= 5 ? { width: height, height: width } : { width, height };
      }
      offset += 2 + length;
    }
  }
  return null;
}

function exifOrientation(buf: Buffer, tiff: number): number | null {
  const little = buf.toString("ascii", tiff, tiff + 2) === "II";
  const u16 = (at: number) => (little ? buf.readUInt16LE(at) : buf.readUInt16BE(at));
  const u32 = (at: number) => (little ? buf.readUInt32LE(at) : buf.readUInt32BE(at));
  try {
    const ifd = tiff + u32(tiff + 4);
    const entries = u16(ifd);
    for (let i = 0; i < entries; i++) {
      const entry = ifd + 2 + i * 12;
      if (u16(entry) === 0x0112) return u16(entry + 8);
    }
  } catch {
    return null;
  }
  return null;
}
