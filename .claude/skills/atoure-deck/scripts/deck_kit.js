// AToure deck toolkit for pptxgenjs: theme roles, layouts, photo placement at native
// aspect ratio, diagram primitives and theme application. See references/design-system.md.
//
//   const kit = require("<skill>/scripts/deck_kit.js");
//   const deck = kit.createDeck({ theme: "atoure", title, subject, footer, assetsDir });
//   await deck.icons({ check: ["LuBadgeCheck", "label"] });
//   deck.layouts();
//   const s = deck.content("CONTENT_LIGHT", "KICKER", "Slide title", "Speaker notes");
//   await deck.save("Deck.pptx");
//
// Run node with NODE_PATH pointing at the node_modules that holds pptxgenjs, sharp, react,
// react-dom and react-icons (scripts/setup.sh installs them into a work folder).
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const sharp = require("sharp");
const React = require("react");
const RDS = require("react-dom/server");
const lu = require("react-icons/lu");

const zlib = require("zlib");

const SKILL_DIR = path.resolve(__dirname, "..");

// Minimal RGBA PNG encoder, so gradients can be made synchronously (sharp is async only) and
// drawn inside the synchronous "behind the title" callbacks of cover() and content().
const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function pngRGBA(w, h, rgba) {
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
    return Buffer.concat([len, td, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6; // 8 bit RGBA
  const raw = Buffer.alloc(h * (w * 4 + 1));
  for (let y = 0; y < h; y++) rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]);
}
const W = 13.333, H = 7.5, M = 0.6, R = W - M, CW = R - M;

// Role -> theme slot. Every colour in a deck is one of these ten roles, so a client
// theme only has to fill the roles and every slide follows.
const ROLE_SLOT = {
  ink: "dk1", paper: "lt1", muted: "dk2", canvas: "lt2", gold: "accent1",
  client: "accent2", label: "accent3", highlight: "accent4", tint: "accent5", panel: "accent6",
};

function loadTheme(theme) {
  let t = theme;
  if (typeof theme === "string") {
    const file = fs.existsSync(theme) ? theme : path.join(SKILL_DIR, "assets", "themes", theme + ".json");
    t = JSON.parse(fs.readFileSync(file, "utf8"));
  }
  const hex = {};
  for (const [role, v] of Object.entries(t.roles)) hex[role] = String(v.hex || v).replace("#", "").toUpperCase();
  for (const role of Object.keys(ROLE_SLOT)) {
    if (!/^[0-9A-F]{6}$/.test(hex[role] || "")) throw new Error(`theme role "${role}" needs a six digit hex colour`);
  }
  const colors = {};
  for (const [role, slot] of Object.entries(ROLE_SLOT)) colors[slot] = hex[role];
  colors.hlink = hex.label; colors.folHlink = hex.muted;
  return {
    name: t.name, description: t.description || "",
    headFontFace: t.headFontFace || "Cormorant Garamond SemiBold",
    bodyFontFace: t.bodyFontFace || "Jost",
    hex, colors,
  };
}

async function writeThemeColors(deckPath, theme) {
  const JSZip = require(require.resolve("jszip", { paths: [require.resolve("pptxgenjs")] }));
  const zip = await JSZip.loadAsync(fs.readFileSync(deckPath));
  const part = "ppt/theme/theme1.xml";
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const slots = ["dk1", "lt1", "dk2", "lt2", "accent1", "accent2", "accent3", "accent4", "accent5", "accent6", "hlink", "folHlink"];
  const scheme = `<a:clrScheme name="${esc(theme.name)}">` + slots.map((k) => `<a:${k}><a:srgbClr val="${theme.colors[k]}"/></a:${k}>`).join("") + "</a:clrScheme>";
  let xml = await zip.file(part).async("string");
  xml = xml.replace(/<a:clrScheme\b[\s\S]*?<\/a:clrScheme>/, () => scheme)
    .replace(/(<a:(?:theme|fontScheme)\b[^>]*?\bname=")[^"]*"/g, (_, head) => `${head}${esc(theme.name)}"`);
  zip.file(part, xml);
  for (const name of Object.keys(zip.files)) {
    if (!name.endsWith(".xml")) continue;
    const bad = (await zip.file(name).async("string")).match(/<a:srgbClr val="((?![0-9A-Fa-f]{6}")[^"]*)"/);
    if (bad) throw new Error(`${name}: colour "${bad[1]}" is not hex. A role was passed to a hex only option (shadow, table border, chart grid). Use deck.HEX.<role> there.`);
  }
  fs.writeFileSync(deckPath, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
}

function createDeck(opts = {}) {
  const theme = loadTheme(opts.theme || "atoure");
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.author = opts.author || "AToure Management & Consulting";
  if (opts.title) pres.title = opts.title;
  if (opts.subject) pres.subject = opts.subject;
  pres.theme = { headFontFace: theme.headFontFace, bodyFontFace: theme.bodyFontFace };
  const SC = pres.SchemeColor;
  const C = {
    ink: SC.text1, paper: SC.background1, muted: SC.text2, canvas: SC.background2,
    gold: SC.accent1, client: SC.accent2, label: SC.accent3, highlight: SC.accent4, tint: SC.accent5, panel: SC.accent6,
  };
  const HEX = theme.hex;
  const HEAD = "+mj-lt"; // theme heading font; body text uses the theme body font by default
  const assetsDir = opts.assetsDir;
  const manifest = assetsDir && fs.existsSync(path.join(assetsDir, "manifest.json"))
    ? JSON.parse(fs.readFileSync(path.join(assetsDir, "manifest.json"), "utf8")) : {};
  const footer = opts.footer || "AToure Management & Consulting";
  const lang = opts.lang || "en-GB"; // tags text for the spellchecker; "fr-FR" for French decks
  const ICON = {};
  const col = (c) => C[c] || c;

  const deck = { pres, C, HEX, HEAD, ICON, theme, manifest, W, H, M, R, CW };

  deck.shadow = () => ({ type: "outer", color: HEX.ink, opacity: 0.1, blur: 10, offset: 3, angle: 90 });

  deck.T = (s, text, o = {}) => {
    const opt = Object.assign({ isTextBox: true, margin: 0, valign: "top", color: C.ink, fontSize: 14, lang }, o);
    if (o.color) opt.color = col(o.color);
    s.addText(text, opt);
  };
  deck.kicker = (s, text, x, y, w, color = "label") =>
    deck.T(s, text, { x, y, w, h: 0.28, fontSize: 11, bold: true, charSpacing: 3, color });

  // Photos keep their native aspect ratio. Give x, y and either w or h, or use photoFit to
  // fit inside a box. Neither path crops: trims belong in prep_images.js, where they are visible.
  deck.photo = (s, key, o) => {
    const m = manifest[key];
    if (!m) throw new Error(`no "${key}" in ${assetsDir}/manifest.json; run prep_images.js first`);
    const ar = m.w / m.h;
    let { x, y, w, h } = o;
    if (w && !h) h = w / ar; else if (h && !w) w = h * ar;
    else if (w && h && Math.abs(w / h - ar) > 0.01) throw new Error(`photo "${key}" would be distorted; pass only w or h, or use photoFit`);
    s.addImage({ path: path.join(assetsDir, m.file), x, y, w, h, altText: o.alt || key, objectName: "Photo " + key });
    return { x, y, w, h };
  };
  deck.photoFit = (s, key, box) => {
    const m = manifest[key], ar = m.w / m.h;
    let w = box.w, h = w / ar;
    if (h > box.h) { h = box.h; w = h * ar; }
    const ax = box.align || "center", ay = box.valign || "middle";
    const x = ax === "left" ? box.x : ax === "right" ? box.x + box.w - w : box.x + (box.w - w) / 2;
    const y = ay === "top" ? box.y : ay === "bottom" ? box.y + box.h - h : box.y + (box.h - h) / 2;
    return deck.photo(s, key, { x, y, w, alt: box.alt });
  };

  deck.logo = (s, variant, x, y, w) => {
    const file = { dark: "lockup-on-dark.png", light: "lockup-on-light.png", monogram: "monogram-gold.png" }[variant];
    const ratio = variant === "monogram" ? 200 / 144 : 256 / 1600;
    s.addImage({ path: path.join(SKILL_DIR, "assets", "logos", file), x, y, w, h: w * ratio, altText: "AToure Management & Consulting" });
  };

  // Caption chip for photos: dark translucent pill, small light text.
  deck.chip = (s, text, x, y, o = {}) => {
    const w = o.w || text.length * 0.073 + 0.36;
    const xx = o.alignRight ? x - w : x;
    s.addShape(pres.ShapeType.roundRect, { x: xx, y, w, h: 0.32, rectRadius: 0.06, fill: { color: C.ink, transparency: 30 }, line: { type: "none" } });
    deck.T(s, text, { x: xx, y, w, h: 0.32, fontSize: 10, color: "paper", align: "center", valign: "middle" });
  };

  deck.card = (s, x, y, w, h, o = {}) => {
    s.addShape(pres.ShapeType.roundRect, {
      x, y, w, h, rectRadius: o.r || 0.1,
      fill: o.noFill ? { type: "none" } : { color: col(o.fill || "paper") },
      line: o.dash ? { color: C.muted, width: 1, dashType: "dash", transparency: 30 }
        : o.line ? { color: col(o.line), width: o.lineWidth || 1, dashType: o.lineDash ? "dash" : "solid" }
        : { color: C.muted, width: 0.75, transparency: 72 },
      shadow: o.flat ? undefined : deck.shadow(),
      objectName: o.name,
    });
  };

  // icons({ key: ["LuIconName", role-or-hex] }) renders Lucide icons to PNG once per deck.
  deck.icons = async (map) => {
    for (const [k, [name, colour]] of Object.entries(map)) {
      if (!lu[name]) throw new Error(`react-icons/lu has no ${name}`);
      const hex = HEX[colour] || String(colour).replace("#", "");
      const svg = RDS.renderToStaticMarkup(React.createElement(lu[name], { size: 256, color: "#" + hex, strokeWidth: 1.75 }));
      ICON[k] = "image/png;base64," + (await sharp(Buffer.from(svg)).resize(256, 256).png().toBuffer()).toString("base64");
    }
  };
  deck.icon = (s, key, x, y, d) => s.addImage({ data: ICON[key], x, y, w: d, h: d, altText: "" });
  deck.iconCircle = (s, key, x, y, d, fill = "ink", o = {}) => {
    s.addShape(pres.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: col(fill) }, line: o.line ? { color: col(o.line), width: 1.25 } : { type: "none" } });
    const i = d * (o.scale || 0.52);
    s.addImage({ data: ICON[key], x: x + (d - i) / 2, y: y + (d - i) / 2, w: i, h: i, altText: o.alt || "" });
  };
  deck.numCircle = (s, n, x, y, d, o = {}) => {
    s.addShape(pres.ShapeType.ellipse, {
      x, y, w: d, h: d,
      fill: o.fill ? { color: col(o.fill) } : { type: "none" },
      line: o.line ? { color: col(o.line), width: 1.25, dashType: o.dash ? "dash" : "solid" } : { type: "none" },
    });
    deck.T(s, String(n), { x, y, w: d, h: d, fontSize: o.size || 13, bold: true, color: o.color || "ink", align: "center", valign: "middle" });
  };

  // Diagram node. kind: "client" (the client's colour), "gold" (AToure), "neutral", "ink".
  deck.node = (s, x, y, w, h, kind, text, size = 17) => {
    const fill = { client: C.client, gold: C.gold, neutral: C.paper, ink: C.ink }[kind];
    s.addShape(pres.ShapeType.roundRect, {
      x, y, w, h, rectRadius: 0.08, fill: { color: fill },
      line: kind === "neutral" ? { color: C.muted, width: 0.75, transparency: 45 } : { type: "none" },
      objectName: "Node " + text,
    });
    deck.T(s, text, { x, y, w, h, fontFace: HEAD, fontSize: size, color: kind === "ink" ? "paper" : "ink", align: "center", valign: "middle", margin: 0.04 });
  };
  // Straight arrow from (x1,y1) to (x2,y2). Keep arrows horizontal or vertical where you can.
  deck.arrow = (s, x1, y1, x2, y2, o = {}) => {
    s.addShape(pres.ShapeType.line, {
      x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1),
      flipH: x2 < x1, flipV: y2 < y1,
      line: { color: col(o.color || "gold"), width: o.width || 2, dashType: o.dash ? "dash" : "solid", endArrowType: o.noHead ? undefined : "triangle" },
    });
  };
  deck.line = (s, x, y, w, h, o = {}) =>
    s.addShape(pres.ShapeType.line, { x, y, w, h, line: { color: col(o.color || "gold"), width: o.width || 1, transparency: o.transparency || 0, dashType: o.dash ? "dash" : "solid" } });

  // Stat tile: big figure in the body font (Cormorant's old style numerals misread at size).
  deck.stat = (s, x, y, w, h, num, label, o = {}) => {
    if (o.tile) s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.08, fill: { color: col(o.tile) }, line: { color: C.gold, width: 0.75, transparency: 65 } });
    const pad = o.tile ? 0.25 : 0;
    const size = o.size || 30;
    deck.T(s, num, { x: x + pad, y: y + (o.tile ? 0.1 : 0), w: w - 2 * pad, h: size / 72 * 1.25, fontSize: size, color: o.numColor || (o.dark ? "highlight" : "label") });
    deck.T(s, label, { x: x + pad, y: y + (o.tile ? 0.1 : 0) + size / 72 * 1.3, w: w - 2 * pad, h: 0.42, fontSize: o.labelSize || 11, color: o.labelColor || (o.dark ? "tint" : "muted") });
  };

  // Gradient from the ink colour to transparent, laid over a photo so text can sit on it.
  // dir names where the solid edge is: "ltr" (left), "rtl", "ttb" (top), "btt" (bottom).
  // o.hold keeps it solid for that share of the length, o.power shapes the falloff (below 1
  // fades slowly, above 1 quickly), o.max caps the opacity. A linear fade with a hold shows a
  // visible edge; prefer power 0.6 to 0.8 with no hold for a long soft fade behind text.
  deck.fade = (dir, o = {}) => {
    const DK = [0, 2, 4].map((i) => parseInt(HEX.ink.slice(i, i + 2), 16));
    const vert = dir === "ttb" || dir === "btt", n = 256, w = vert ? 2 : n, h = vert ? n : 2, buf = Buffer.alloc(w * h * 4);
    const power = o.power ?? 1.6, hold = o.hold ?? 0, max = o.max ?? 1;
    for (let i = 0; i < n; i++) {
      const t = (dir === "rtl" || dir === "btt") ? 1 - i / (n - 1) : i / (n - 1);
      const u = t <= hold ? 0 : (t - hold) / (1 - hold);
      const a = Math.round(255 * max * Math.pow(1 - u, power));
      for (let j = 0; j < 2; j++) { const k = (vert ? i * w + j : j * w + i) * 4; buf[k] = DK[0]; buf[k + 1] = DK[1]; buf[k + 2] = DK[2]; buf[k + 3] = a; }
    }
    return "image/png;base64," + pngRGBA(w, h, buf).toString("base64");
  };
  deck.fadeImage = (s, dir, x, y, w, h, o = {}) =>
    s.addImage({ data: deck.fade(dir, o), x, y, w, h, altText: "", objectName: "Fade overlay" });
  // Ink wash over a whole slide photo, so cards and text read on a bright picture.
  deck.overlay = (s, transparency = 32) =>
    s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: W, h: H, fill: { color: C.ink, transparency }, line: { type: "none" }, objectName: "Photo overlay" });
  // Footer and slide number for slides whose full bleed photo hides the layout footer.
  deck.photoFooter = (s, text) => {
    deck.T(s, text || footer, { x: M, y: 7.04, w: 9, h: 0.26, fontSize: 10, color: "highlight", valign: "middle" });
    s.slideNumber = { x: R - 0.6, y: 7.04, w: 0.6, h: 0.26, fontFace: theme.bodyFontFace, fontSize: 10, color: HEX.highlight, align: "right" };
  };

  // Partner logos on white chips with a label to their left, sized by chip height h.
  // logos: [{ path, w, h, alt }] with the image's pixel size. Make them big (h 0.9 to 1.1)
  // when the partnership itself is the proof.
  deck.partnerLogos = (s, logos, x, y, h, o = {}) => {
    deck.T(s, o.label || "OFFICIAL\nPARTNERS", { x, y, w: 1.7, h, fontSize: 11, bold: true, charSpacing: 3, color: o.color || "gold", valign: "middle", lineSpacingMultiple: 1.2 });
    const lh = h * 0.8, pad = (h - lh) / 2;
    let cx = x + 1.8;
    for (const lg of logos) {
      const lw = lh * lg.w / lg.h;
      s.addShape(pres.ShapeType.roundRect, { x: cx, y, w: lw + 2 * pad, h, rectRadius: 0.08, fill: { color: C.paper }, line: { type: "none" } });
      s.addImage({ path: lg.path, x: cx + pad, y: y + pad, w: lw, h: lh, altText: lg.alt || "" });
      cx += lw + 2 * pad + 0.18;
    }
  };

  // "Sponsors  ·  State visas  ·  Permits" with non breaking spaces inside each item, so a
  // wrapped line breaks only at a separator and never starts with a space.
  deck.inlineList = (items) => items.map((t) => t.replace(/ /g, "\u00A0")).join("\u00A0\u00A0·\u00A0 ");

  // Native table with role colours; borders are hex only, so they come from HEX.
  deck.table = (s, header, rows, o) => {
    const border = { type: "solid", pt: 0.75, color: o.borderHex || HEX.tint };
    const B = [border, border, border, border];
    const head = header.map((hc) => ({ text: hc.text, options: { bold: true, fontSize: o.fontSize || 13, fill: { color: col(hc.fill || "ink") }, color: col(hc.color || "paper"), valign: "middle", border: B } }));
    const body = rows.map((r) => r.map((t, j) => ({ text: t, options: { fontSize: o.fontSize || 13, fill: { color: C.paper }, color: j === 0 ? C.ink : C.muted, bold: j === 0, valign: "middle", border: B } })));
    s.addTable([head, ...body], { x: o.x, y: o.y, w: o.w, colW: o.colW, rowH: o.rowH, margin: [0.06, 0.14, 0.06, 0.14], objectName: o.name || "Table" });
  };

  // Layouts: COVER, CONTENT_LIGHT, CONTENT_DARK, SPLIT_DARK (content on the right of a
  // full height photo), CLOSING. Footer and slide number live on the layout.
  deck.layouts = (o = {}) => {
    const content = (name, dark, lo = {}) => {
      const x = lo.x ?? M, w = lo.w ?? CW;
      pres.defineSlideMaster({
        title: name,
        background: { color: dark ? C.ink : C.canvas },
        objects: [
          { placeholder: { options: { name: "kicker", type: "body", x, y: 0.45, w, h: 0.28, fontSize: 11, bold: true, charSpacing: 3, color: dark ? C.gold : C.label, margin: 0, valign: "top", align: "left" }, text: "" } },
          { placeholder: { options: { name: "title", type: "title", x, y: 0.74, w, h: lo.titleH || 0.85, fontSize: 38, color: dark ? C.paper : C.ink, margin: 0, valign: "top", align: "left" }, text: "" } },
          ...(lo.noFooter ? [] : [{ text: { text: lo.foot || footer, options: { x, y: 7.04, w: Math.min(w - 0.7, 9), h: 0.26, fontSize: 10, color: dark ? C.highlight : C.muted, margin: 0, valign: "middle" } } }]),
        ],
        ...(lo.noFooter ? {} : { slideNumber: { x: R - 0.6, y: 7.04, w: 0.6, h: 0.26, fontSize: 10, color: dark ? C.highlight : C.muted, align: "right", margin: 0 } }),
      });
    };
    pres.defineSlideMaster({
      title: "COVER",
      background: { color: C.ink },
      objects: [
        { placeholder: { options: { name: "title", type: "title", x: M, y: 2.6, w: o.coverTitleW || 6.7, h: 1.75, fontSize: o.coverTitleSize || 54, color: C.paper, margin: 0, valign: "top", align: "left", lineSpacingMultiple: 0.95 }, text: "" } },
        { placeholder: { options: { name: "subtitle", type: "body", x: M, y: 4.6, w: 6.3, h: 1.5, fontSize: 16, color: C.tint, margin: 0, valign: "top", align: "left", lineSpacingMultiple: 1.15 }, text: "" } },
      ],
    });
    content("CONTENT_LIGHT", false);
    content("CONTENT_DARK", true);
    content("SPLIT_DARK", true, { x: 6.25, w: R - 6.25, foot: "AToure Management & Consulting" });
    content("CLOSING", true, { w: 5.75, titleH: 1.3, noFooter: true });
    // Full bleed photo slides: the photo hides the layout footer, so add deck.photoFooter.
    content("PHOTO_DARK", true, { noFooter: true });
    content("PHOTO_LEFT", true, { w: 4.1, titleH: 1.45, noFooter: true });
  };

  let currentSection = null;
  deck.section = (title) => { pres.addSection({ title }); currentSection = title; };
  // pre(s) draws anything that must sit behind the title, such as a full bleed photo and its
  // fades. It must be synchronous (every helper here is). Shapes stack in the order added.
  deck.cover = (title, subtitle, notes, pre) => {
    const s = pres.addSlide({ masterName: "COVER", sectionTitle: currentSection || undefined });
    if (pre) pre(s);
    s.addText(title, { placeholder: "title", lang });
    if (subtitle) s.addText(subtitle, { placeholder: "subtitle", lang });
    if (notes) s.addNotes(notes);
    return s;
  };
  deck.content = (master, kicker, title, notes, pre) => {
    const s = pres.addSlide({ masterName: master, sectionTitle: currentSection || undefined });
    if (pre) pre(s);
    if (kicker) s.addText(kicker, { placeholder: "kicker", lang });
    s.addText(title, { placeholder: "title", lang });
    if (notes) s.addNotes(notes);
    return s;
  };

  deck.save = async (outPath) => {
    await pres.writeFile({ fileName: outPath });
    await writeThemeColors(outPath, theme);
    return outPath;
  };
  return deck;
}

module.exports = { createDeck, loadTheme, writeThemeColors, ROLE_SLOT, SKILL_DIR, W, H, M, R, CW };
