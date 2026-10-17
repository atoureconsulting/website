// Prepare deck images from a spec file and write manifest.json (file, w, h) for deck_kit.
//
//   node prep_images.js spec.json
//
// spec.json:
// {
//   "outDir": "/path/to/work/assets",
//   "photos": {
//     "cover":  { "src": "/home/user/website/Media/.../photo.JPG" },
//     "mascot": { "src": ".../still.webp", "trim": { "top": 95, "bottom": 8 } }
//   },
//   "logos": { "caf": { "src": ".../caf.png", "trimWhitespace": true } }
// }
//
// Photos are auto rotated from EXIF, resized to fit 2000 px on the long edge and saved as
// JPEG. Their aspect ratio is never changed. "trim" removes explicit pixel strips (top,
// bottom, left, right) for watermarks or frame bars only; keep it small and check that the
// subject is untouched. Logos are saved as PNG with transparency.
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

(async () => {
  const specPath = process.argv[2];
  if (!specPath) { console.error("usage: node prep_images.js spec.json"); process.exit(2); }
  const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
  const out = spec.outDir;
  fs.mkdirSync(out, { recursive: true });
  const manPath = path.join(out, "manifest.json");
  const manifest = fs.existsSync(manPath) ? JSON.parse(fs.readFileSync(manPath, "utf8")) : {};

  for (const [key, p] of Object.entries(spec.photos || {})) {
    let img = sharp(p.src).rotate();
    const meta = await sharp(await img.toBuffer()).metadata();
    if (p.trim) {
      const t = Object.assign({ top: 0, bottom: 0, left: 0, right: 0 }, p.trim);
      const width = meta.width - t.left - t.right, height = meta.height - t.top - t.bottom;
      if (width < meta.width * 0.8 || height < meta.height * 0.8) console.warn(`warning: trim on "${key}" removes more than 20% of one side; check nothing important is lost`);
      img = sharp(await img.toBuffer()).extract({ left: t.left, top: t.top, width, height });
    }
    const edge = p.maxEdge || 2000;
    const file = key + ".jpg";
    const info = await img.resize({ width: edge, height: edge, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(out, file));
    manifest[key] = { file, w: info.width, h: info.height, src: p.src };
    const lowRes = Math.max(info.width, info.height) < 900;
    console.log(`${key}: ${info.width}x${info.height}${lowRes ? "  (low resolution: keep it small on the slide)" : ""}`);
  }

  for (const [key, p] of Object.entries(spec.logos || {})) {
    let img = sharp(p.src);
    if (p.trimWhitespace) img = img.trim({ threshold: 1 });
    const file = key + ".png";
    const info = await img.resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true }).png().toFile(path.join(out, file));
    manifest[key] = { file, w: info.width, h: info.height, src: p.src };
    console.log(`${key}: ${info.width}x${info.height}`);
  }

  fs.writeFileSync(manPath, JSON.stringify(manifest, null, 1));
  console.log("manifest:", manPath);
})().catch((e) => { console.error(e.message); process.exit(1); });
