#!/usr/bin/env node
/*
  Generates public/favicon.ico as the app icon: white calculator in a green rounded box on a transparent canvas.
  Dependency (dev): @resvg/resvg-js
*/

import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";
import { Resvg } from "@resvg/resvg-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_PATH = path.resolve(__dirname, "../public/favicon.ico");
const SIZES = [16, 32, 64, 128, 256];
const ICON_URL = "https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/calculator.svg";

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Request failed with status ${res.statusCode}`));
          return;
        }
        let data = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

function buildComposedSvg(sizePx, calculatorSvg) {
  const padding = Math.round(sizePx * 0.0625); // 1/16 of size
  const boxRadius = Math.round(sizePx * 0.125); // 1/8 of size
  const innerSize = sizePx - padding * 2;
  const iconSize = Math.round(innerSize * 0.70); // 70% of inner box

  // Ensure calculator stroke is white and scalable
  const calculatorWhite = calculatorSvg
    .replace(/stroke="currentColor"/g, 'stroke="#FFFFFF"')
    .replace(/color="currentColor"/g, 'color="#FFFFFF"')
    .replace(/stroke-width="([0-9.]+)"/g, 'stroke-width="2.6"')
    .replace(/width="[0-9.]+"/g, "")
    .replace(/height="[0-9.]+"/g, "")
    .replace(/viewBox="([^"]+)"/, (m, vb) => `viewBox="${vb}"`);

  // Wrap calculator paths into a <g> scaled to iconSize and centered
  // We position the icon at the center of the green box
  const scale = iconSize / 24; // lucide default viewBox 0 0 24 24
  const center = sizePx / 2;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${sizePx}" height="${sizePx}" viewBox="0 0 ${sizePx} ${sizePx}">
  <defs>
    <clipPath id="roundedBox">
      <rect x="${padding}" y="${padding}" width="${innerSize}" height="${innerSize}" rx="${boxRadius}" ry="${boxRadius}" />
    </clipPath>
  </defs>
  <rect x="${padding}" y="${padding}" width="${innerSize}" height="${innerSize}" rx="${boxRadius}" ry="${boxRadius}" fill="#10b981" />
  <g transform="translate(${center}, ${center}) scale(${scale}) translate(-12, -12)" stroke="#FFFFFF" fill="none" stroke-linecap="round" stroke-linejoin="round">
    ${calculatorWhite
      .replace(/<\/?svg[^>]*>/g, "")
      .replace(/\n/g, " ")}
  </g>
</svg>`;
}

function encodeICOFromPngs(pngBuffersWithSizes) {
  const images = pngBuffersWithSizes.map(({ buffer, size }) => ({
    data: Buffer.from(buffer),
    width: size,
    height: size,
  }));

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4); // count

  const dirEntries = [];
  let offset = 6 + images.length * 16;
  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width === 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height === 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(0, 4); // planes
    entry.writeUInt16LE(32, 6); // bitCount
    entry.writeUInt32LE(img.data.length, 8); // bytesInRes
    entry.writeUInt32LE(offset, 12); // imageOffset
    dirEntries.push(entry);
    offset += img.data.length;
  }

  return Buffer.concat([header, ...dirEntries, ...images.map((i) => i.data)]);
}

async function main() {
  // Ensure output directory exists
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });

  const calculatorSvg = await fetchText(ICON_URL);

  const pngImages = [];
  for (const size of SIZES) {
    const svg = buildComposedSvg(size, calculatorSvg);
    const resvg = new Resvg(svg, {
      background: "rgba(0,0,0,0)",
      fitTo: { mode: "width", value: size },
    });
    const pngData = resvg.render().asPng();
    pngImages.push({ size, buffer: pngData });
    if (size === 256) {
      const debugPath = path.resolve(__dirname, "../public/favicon-src-256.svg");
      fs.writeFileSync(debugPath, svg);
    }
  }

  const icoBuffer = encodeICOFromPngs(pngImages);
  fs.writeFileSync(OUTPUT_PATH, icoBuffer);
  console.log(`Wrote ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


