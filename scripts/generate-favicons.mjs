/**
 * Génère des favicons carrés lisibles à partir de logo.png (script horizontal).
 * Usage: node scripts/generate-favicons.mjs
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "logo.png");
const bg = { r: 15, g: 20, b: 25, alpha: 1 }; // #0f1419 — fond brand

const sizes = [
  { name: "favicon-16.png", size: 16, out: join(root, "public", "favicon-16.png") },
  { name: "favicon-32.png", size: 32, out: join(root, "public", "favicon-32.png") },
  { name: "icon.png (app)", size: 32, out: join(root, "src", "app", "icon.png") },
  { name: "apple-icon.png", size: 180, out: join(root, "src", "app", "apple-icon.png") },
  { name: "icon-192.png", size: 192, out: join(root, "public", "icon-192.png") },
  { name: "icon-512.png", size: 512, out: join(root, "public", "icon-512.png") },
];

async function buildSquarePng(size) {
  const logo = sharp(source);
  const meta = await logo.metadata();
  const pad = Math.round(size * 0.12);
  const maxW = size - pad * 2;
  const maxH = size - pad * 2;
  const scale = Math.min(maxW / meta.width, maxH / meta.height);
  const w = Math.round(meta.width * scale);
  const h = Math.round(meta.height * scale);
  const left = Math.round((size - w) / 2);
  const top = Math.round((size - h) / 2);

  const resized = await logo.resize(w, h, { fit: "inside" }).png().toBuffer();

  return sharp({
    create: { width: size, height: size, channels: 4, background: bg },
  })
    .composite([{ input: resized, left, top }])
    .png()
    .toBuffer();
}

async function main() {
  await mkdir(join(root, "public"), { recursive: true });
  for (const { size, out, name } of sizes) {
    const buf = await buildSquarePng(size);
    await writeFile(out, buf);
    console.log(`✓ ${name} → ${out}`);
  }
  // public/icon.png = 32px pour liens explicites
  await writeFile(join(root, "public", "icon.png"), await buildSquarePng(32));
  console.log("✓ public/icon.png");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
