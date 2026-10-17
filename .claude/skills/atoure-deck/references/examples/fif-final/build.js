const pptxgen = require("pptxgenjs");
const sharp = require("sharp");
const React = require("react");
const RDS = require("react-dom/server");
const lu = require("react-icons/lu");
const path = require("path");
const { applyTheme } = require(process.env.SK + "/scripts/apply_theme.js");

const A = (f) => path.join(__dirname, "assets", f);
const MAN = require("./assets/manifest.json");

const THEME = {
  name: "Éléphants d'Or",
  headFontFace: "Cormorant Garamond SemiBold",
  bodyFontFace: "Jost",
  colors: {
    dk1: "0A2A1F", lt1: "FFFDF8", dk2: "4F6158", lt2: "FBF7EF",
    accent1: "C8A951", accent2: "F77F00", accent3: "007A4D",
    accent4: "E0C47A", accent5: "E6EFE9", accent6: "123D2F",
    hlink: "007A4D", folHlink: "4F6158",
  },
};
const HEX = THEME.colors;

const W = 13.333, H = 7.5, M = 0.6, R = W - M, CW = R - M;
const FOOT = "AToure Management & Consulting  ·  Proposal to the Fédération Ivoirienne de Football";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "AToure Management & Consulting";
pres.title = "A Governed Creator and Media Programme for FIF";
pres.subject = "Partnership proposal to the Fédération Ivoirienne de Football";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;
const HEAD = "+mj-lt";

// ---------- helpers ----------
const shadow = () => ({ type: "outer", color: HEX.dk1, opacity: 0.1, blur: 10, offset: 3, angle: 90 });

function T(s, text, o) {
  s.addText(text, Object.assign({ isTextBox: true, margin: 0, valign: "top", color: C.text1, fontSize: 14 }, o));
}
function kickerLike(s, text, x, y, w, color) {
  T(s, text, { x, y, w, h: 0.28, fontSize: 11, bold: true, charSpacing: 3, color });
}
function photo(s, key, o) {
  const m = MAN[key], ar = m.w / m.h;
  let { x, y, w, h } = o;
  if (w && !h) h = w / ar;
  else if (h && !w) w = h * ar;
  s.addImage({ path: A(key + ".jpg"), x, y, w, h, altText: o.alt || key, objectName: "Photo " + key });
  return { x, y, w, h };
}
function chip(s, text, x, y, o = {}) {
  const w = o.w || text.length * 0.073 + 0.36;
  const xx = o.alignRight ? x - w : x;
  s.addShape(pres.ShapeType.roundRect, { x: xx, y, w, h: 0.32, rectRadius: 0.06, fill: { color: C.text1, transparency: 30 }, line: { type: "none" } });
  T(s, text, { x: xx, y, w, h: 0.32, fontSize: 10, color: C.background1, align: "center", valign: "middle" });
}
function card(s, x, y, w, h, o = {}) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: o.r || 0.1,
    fill: { color: o.fill || C.background1 },
    line: o.dash ? { color: C.text2, width: 1, dashType: "dash", transparency: 30 } : { color: C.text2, width: 0.75, transparency: 72 },
    shadow: o.flat ? undefined : shadow(),
    objectName: o.name,
  });
}
let ICON = {};
function iconCircle(s, key, x, y, d, fill, o = {}) {
  s.addShape(pres.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: fill }, line: o.line ? { color: o.line, width: 1.25 } : { type: "none" } });
  const k = o.scale || 0.52, i = d * k;
  s.addImage({ data: ICON[key], x: x + (d - i) / 2, y: y + (d - i) / 2, w: i, h: i, altText: o.alt || "" });
}
function numCircle(s, n, x, y, d, o = {}) {
  s.addShape(pres.ShapeType.ellipse, {
    x, y, w: d, h: d,
    fill: o.fill ? { color: o.fill } : { type: "none" },
    line: o.line ? { color: o.line, width: 1.25, dashType: o.dash ? "dash" : "solid" } : { type: "none" },
  });
  T(s, String(n), { x, y, w: d, h: d, fontSize: o.size || 13, bold: true, color: o.color || C.text1, align: "center", valign: "middle" });
}
const FILL = { fif: C.accent2, at: C.accent1, neutral: C.background1, dark: C.text1 };
function node(s, x, y, w, h, kind, text, size = 17) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.08, fill: { color: FILL[kind] },
    line: kind === "neutral" ? { color: C.text2, width: 0.75, transparency: 45 } : { type: "none" },
    objectName: "Node " + text,
  });
  T(s, text, { x, y, w, h, fontFace: HEAD, fontSize: size, color: kind === "dark" ? C.background1 : C.text1, align: "center", valign: "middle", margin: 0.04 });
}
function arrow(s, x1, y1, x2, y2, o = {}) {
  s.addShape(pres.ShapeType.line, {
    x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1),
    flipH: x2 < x1, flipV: y2 < y1,
    line: { color: o.color || C.accent1, width: o.width || 2, dashType: o.dash ? "dash" : "solid", endArrowType: o.noHead ? undefined : "triangle" },
  });
}
const DK = [0, 2, 4].map((o) => parseInt(HEX.dk1.slice(o, o + 2), 16));
// dir: ltr / rtl / ttb / btt, named for where the solid edge starts. hold keeps it solid for that
// share of the length, power shapes the falloff, max caps the opacity.
async function gradient(dir, o = {}) {
  const vert = dir === "ttb" || dir === "btt", n = 256, w = vert ? 2 : n, h = vert ? n : 2, buf = Buffer.alloc(w * h * 4);
  const power = o.power ?? 1.6, hold = o.hold ?? 0, max = o.max ?? 1;
  for (let i = 0; i < n; i++) {
    const t = (dir === "rtl" || dir === "btt") ? 1 - i / (n - 1) : i / (n - 1);
    const u = t <= hold ? 0 : (t - hold) / (1 - hold);
    const a = Math.round(255 * max * Math.pow(1 - u, power));
    for (let j = 0; j < 2; j++) { const k = (vert ? i * w + j : j * w + i) * 4; buf[k] = DK[0]; buf[k + 1] = DK[1]; buf[k + 2] = DK[2]; buf[k + 3] = a; }
  }
  return "image/png;base64," + (await sharp(buf, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer()).toString("base64");
}
function fade(s, data, x, y, w, h) { s.addImage({ data, x, y, w, h, altText: "", objectName: "Fade overlay" }); }
// CAF and FRMF logos on white chips, label on the left; h is the chip height
function partnerLogos(s, x, y, h, color) {
  T(s, "OFFICIAL\nPARTNERS", { x, y, w: 1.7, h, fontSize: 11, bold: true, charSpacing: 3, color, valign: "middle", lineSpacingMultiple: 1.2 });
  const lh = h * 0.8, pad = (h - lh) / 2, cafW = lh * 524 / 490, frW = lh * 250 / 341;
  let cx = x + 1.8;
  s.addShape(pres.ShapeType.roundRect, { x: cx, y, w: cafW + 2 * pad, h, rectRadius: 0.08, fill: { color: C.background1 }, line: { type: "none" } });
  s.addImage({ path: A("caf.png"), x: cx + pad, y: y + pad, w: cafW, h: lh, altText: "Confederation of African Football" });
  cx += cafW + 2 * pad + 0.18;
  s.addShape(pres.ShapeType.roundRect, { x: cx, y, w: frW + 2 * pad, h, rectRadius: 0.08, fill: { color: C.background1 }, line: { type: "none" } });
  s.addImage({ path: A("frmf.png"), x: cx + pad, y: y + pad, w: frW, h: lh, altText: "Royal Moroccan Football Federation" });
}
// footer for slides whose photo covers the master footer
function photoFooter(s, text) {
  T(s, text || FOOT, { x: M, y: 7.04, w: 9, h: 0.26, fontSize: 10, color: C.accent4, valign: "middle" });
  s.slideNumber = { x: R - 0.6, y: 7.04, w: 0.6, h: 0.26, fontFace: "Jost", fontSize: 10, color: HEX.accent4, align: "right" };
}
async function renderIcon(name, hex) {
  const svg = RDS.renderToStaticMarkup(React.createElement(lu[name], { size: 256, color: "#" + hex, strokeWidth: 1.75 }));
  return "image/png;base64," + (await sharp(Buffer.from(svg)).resize(256, 256).png().toBuffer()).toString("base64");
}

// ---------- layouts ----------
function contentLayout(name, dark, o = {}) {
  const x = o.x ?? M, w = o.w ?? CW;
  pres.defineSlideMaster({
    title: name,
    background: { color: dark ? C.text1 : C.background2 },
    objects: [
      { placeholder: { options: { name: "kicker", type: "body", x, y: 0.45, w, h: 0.28, fontSize: 11, bold: true, charSpacing: 3, color: dark ? C.accent1 : C.accent3, margin: 0, valign: "top", align: "left" }, text: "" } },
      { placeholder: { options: { name: "title", type: "title", x, y: 0.74, w, h: o.titleH || 0.85, fontSize: 38, color: dark ? C.background1 : C.text1, margin: 0, valign: "top", align: "left" }, text: "" } },
      ...(o.noFooter ? [] : [{ text: { text: o.foot || FOOT, options: { x, y: 7.04, w: Math.min(w - 0.7, 9), h: 0.26, fontSize: 10, color: dark ? C.accent4 : C.text2, margin: 0, valign: "middle" } } }]),
    ],
    ...(o.noFooter ? {} : { slideNumber: { x: R - 0.6, y: 7.04, w: 0.6, h: 0.26, fontSize: 10, color: dark ? C.accent4 : C.text2, align: "right", margin: 0 } }),
  });
}

// pre(s) draws anything that must sit behind the kicker and title, such as a full bleed photo
function addContent(master, section, kicker, title, notes, pre) {
  const s = pres.addSlide({ masterName: master, sectionTitle: section });
  if (pre) pre(s);
  s.addText(kicker, { placeholder: "kicker" });
  s.addText(title, { placeholder: "title" });
  if (notes) s.addNotes(notes);
  return s;
}

(async () => {
  const want = {
    idcard: ["LuIdCard", HEX.accent4], cog: ["LuSettings2", HEX.accent4], bank: ["LuBanknote", HEX.accent4], shield: ["LuShieldCheck", HEX.accent4],
    userx: ["LuUserX", HEX.dk1], shieldoff: ["LuShieldOff", HEX.dk1], eyeoff: ["LuEyeOff", HEX.dk1], coins: ["LuHandCoins", HEX.dk1],
    off: ["LuCircleOff", HEX.dk2], check: ["LuBadgeCheck", HEX.accent3],
    clip: ["LuClipboardCheck", HEX.dk1], ticket: ["LuTicket", HEX.dk1], eye: ["LuEye", HEX.dk1],
    users: ["LuUsers", HEX.accent4], clap: ["LuClapperboard", HEX.accent4], chartg: ["LuChartColumn", HEX.accent4],
    idcard_k: ["LuIdCard", HEX.dk1], cog_k: ["LuSettings2", HEX.dk1], bank_k: ["LuBanknote", HEX.dk1],
    cal: ["LuCalendarDays", HEX.dk1], wallet: ["LuWallet", HEX.accent4],
    g_shield: ["LuShieldCheck", HEX.dk1], g_cam: ["LuCamera", HEX.dk1], g_globe: ["LuGlobe", HEX.dk1], g_trend: ["LuTrendingUp", HEX.dk1], g_chart: ["LuChartColumn", HEX.dk1], g_hand: ["LuHandshake", HEX.dk1],
  };
  for (const [k, [n, hex]] of Object.entries(want)) ICON[k] = await renderIcon(n, hex);
  const fadeLtr = await gradient("ltr");
  const fadeTop = await gradient("ttb", { power: 1.3, max: 0.85 }), fadeBottom = await gradient("btt", { power: 1.4 });
  const fadePass = await gradient("ltr", { power: 1.0, hold: 0.25 }), fadePassTop = await gradient("ttb", { power: 1.2, max: 0.55 });
  const fadeLounge = await gradient("ltr", { power: 1.2, hold: 0.35 });
  const fadeCover = await gradient("ltr", { power: 0.6 });

  pres.defineSlideMaster({
    title: "COVER",
    background: { color: C.text1 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: M, y: 2.6, w: 6.7, h: 1.75, fontSize: 54, color: C.background1, margin: 0, valign: "top", align: "left", lineSpacingMultiple: 0.95 }, text: "" } },
      { placeholder: { options: { name: "subtitle", type: "body", x: M, y: 4.6, w: 5.7, h: 1.5, fontSize: 16, color: C.accent5, margin: 0, valign: "top", align: "left", lineSpacingMultiple: 1.15 }, text: "" } },
    ],
  });
  contentLayout("CONTENT_LIGHT", false);
  contentLayout("CONTENT_DARK", true);
  contentLayout("SPLIT_DARK", true, { x: 6.25, w: R - 6.25, foot: "AToure Management & Consulting" });
  contentLayout("CLOSING", true, { w: 5.75, titleH: 1.3, noFooter: true });
  contentLayout("PHOTO_DARK", true, { noFooter: true });
  contentLayout("PHOTO_LEFT", true, { w: 4.1, titleH: 1.45, noFooter: true });

  // ================= 1. COVER =================
  pres.addSection({ title: "Introduction" });
  {
    const s = pres.addSlide({ masterName: "COVER", sectionTitle: "Introduction" });
    const p = photo(s, "g_stadium", { x: 0, y: 0, w: W, alt: "Illustration: an empty floodlit football stadium at night" });
    fade(s, fadeCover, 0, 0, 9.6, p.h);
    fade(s, fadeBottom, 0, p.h - 2.0, W, 2.02);
    s.addImage({ path: A("lockup_dark.png"), x: M, y: 0.6, w: 2.9, h: 2.9 * 256 / 1600, altText: "AToure Management & Consulting" });
    s.addShape(pres.ShapeType.line, { x: 3.8, y: 0.42, w: 0, h: 0.82, line: { color: C.accent1, width: 0.75, transparency: 30 } });
    s.addImage({ path: A("fif_crest.png"), x: 4.05, y: 0.355, w: 0.95, h: 0.95, altText: "Fédération Ivoirienne de Football" });
    T(s, "PARTNERSHIP PROPOSAL", { x: M, y: 2.2, w: 6, h: 0.3, fontSize: 12, bold: true, charSpacing: 4, color: C.accent1 });
    s.addText("Global creators,\ngoverned by FIF", { placeholder: "title" });
    s.addText("A managed creator and media accreditation programme for the Fédération Ivoirienne de Football. FIF grants access. AToure delivers the talent, the operation, the oversight and the sponsors, at no cost to the Federation.", { placeholder: "subtitle" });
    T(s, "AToure Management & Consulting  ·  October 2026", { x: M, y: 6.75, w: 6.2, h: 0.3, fontSize: 11, color: C.accent4 });
    s.addNotes("Open on the core idea: international creators and media already come to Ivorian football. This proposal puts that activity under FIF's governance, run by AToure, at no cost to the Federation.");
  }

  // ================= 2. AT A GLANCE =================
  {
    const s = addContent("CONTENT_LIGHT", "Introduction", "AT A GLANCE", "Two requests of FIF. AToure delivers the rest",
      "The whole proposal on one page. Orange is FIF, gold is AToure. FIF grants accreditation and names AToure an official partner, and keeps full control. AToure delivers the programme and pays for all of it. The dark band is the scale of the attention on African football after AFCON 2025, and AToure's own part in it.");
    const cw = (CW - 0.4) / 2, top = 1.95, ch = 1.42;
    const cols = [
      { x: M, head: "WHAT FIF PROVIDES AND RECEIVES", fill: C.accent2, tint: "FDEEDC", label: "A85400", cards: [
        ["idcard_k", "FIF PROVIDES", "Accreditation and partner status", "VIP and pitch & media passes for agreed fixtures, and official partner status."],
        ["g_shield", "FIF RECEIVES", "Full control and more revenue", "Approval of every name, official content, and more money from its sponsors."] ] },
      { x: M + cw + 0.4, head: "WHAT ATOURE DELIVERS AND FUNDS", fill: C.accent1, tint: "F7F1E0", label: "806319", cards: [
        ["cog_k", "ATOURE DELIVERS", "The programme", "Talent, sponsors, operations, production and oversight."],
        ["bank_k", "ATOURE FUNDS IT", "0 FCFA to FIF", "No fee and no budget allocation. AToure carries every cost."] ] },
    ];
    cols.forEach((col) => {
      s.addShape(pres.ShapeType.roundRect, { x: col.x, y: top, w: cw, h: 0.42, rectRadius: 0.08, fill: { color: col.fill }, line: { type: "none" }, objectName: col.head });
      T(s, col.head, { x: col.x + 0.3, y: top, w: cw - 0.6, h: 0.42, fontSize: 11, bold: true, charSpacing: 2, valign: "middle" });
      col.cards.forEach(([ic, lab, head, body], i) => {
        const y = top + 0.57 + i * (ch + 0.15), money = lab === "ATOURE FUNDS IT";
        s.addShape(pres.ShapeType.roundRect, { x: col.x, y, w: cw, h: ch, rectRadius: 0.1, fill: { color: col.tint }, line: { color: col.fill, width: 1, transparency: 40 }, objectName: "Card " + lab });
        iconCircle(s, ic, col.x + 0.3, y + 0.3, 0.6, col.fill);
        kickerLike(s, lab, col.x + 1.15, y + 0.22, cw - 1.45, col.label);
        T(s, head, money ? { x: col.x + 1.15, y: y + 0.44, w: cw - 1.45, h: 0.44, fontSize: 24 } : { x: col.x + 1.15, y: y + 0.46, w: cw - 1.45, h: 0.42, fontFace: HEAD, fontSize: 22 });
        T(s, body, { x: col.x + 1.15, y: y + 0.9, w: cw - 1.45, h: 0.48, fontSize: 14, color: C.text2 });
      });
    });
    const by = top + 0.57 + 2 * ch + 0.15 + 0.22, bh = 6.8 - by;
    s.addShape(pres.ShapeType.roundRect, { x: M, y: by, w: CW, h: bh, rectRadius: 0.1, fill: { color: C.text1 }, line: { type: "none" }, objectName: "Visibility band" });
    T(s, "AFCON 2025\nVISIBILITY", { x: M + 0.35, y: by, w: 2.0, h: bh, fontSize: 12, bold: true, charSpacing: 3, color: C.accent1, valign: "middle", lineSpacingMultiple: 1.3 });
    const figs = [
      ["6.1B", "Digital impressions, a record for the tournament"],
      ["5.2B", "Video views on social media"],
      ["285M", "Engagements during the tournament"],
      ["16M", "Live views of AToure's mascot reveal at the Final"],
    ];
    const fx = M + 2.35, pw = (R - fx) / 4;
    figs.forEach(([n, l], i) => {
      const x = fx + i * pw;
      s.addShape(pres.ShapeType.line, { x, y: by + 0.2, w: 0, h: bh - 0.4, line: { color: C.accent1, width: 0.75, transparency: 50 } });
      T(s, n, { x: x + 0.25, y: by + 0.14, w: pw - 0.4, h: 0.46, fontSize: 26, color: i === 3 ? C.accent1 : C.accent4 });
      T(s, l, { x: x + 0.25, y: by + 0.6, w: pw - 0.4, h: 0.42, fontSize: 11, color: C.accent5 });
    });
    T(s, "Sources: CAF, January 2026. YouTube Analytics.", { x: R - 5, y: by + bh + 0.04, w: 5, h: 0.2, fontSize: 9, color: C.text2, align: "right" });
  }

  // ================= 3. AFCON, WHAT ATOURE DID =================
  pres.addSection({ title: "Track record" });
  {
    const s = addContent("CONTENT_DARK", "Track record", "TRACK RECORD  ·  CONFEDERATION LEVEL", "IShowSpeed at the AFCON Final, delivered by AToure",
      "CAF and the Royal Moroccan Football Federation wanted a global creator inside the Final, and came to AToure. Walk the eight things AToure did, from the mascot idea and the experience to the oversight of every stream, kept to what CAF and the FRMF wanted. Every one of them is something FIF would need for an accredited fixture.");
    T(s, "CAF and the Royal Moroccan Football Federation wanted a global creator inside the Final. They came to AToure.", { x: M, y: 1.68, w: CW, h: 0.4, fontSize: 15, color: C.accent5 });
    const top = 2.3, ph = 4.5, lh = (ph - 0.15) / 2;
    const a = photo(s, "m_back", { x: M, y: top, h: ph, alt: "IShowSpeed in the Morocco shirt, number 7, facing the pitch at AFCON 2025" });
    const b = photo(s, "m_smile", { x: a.x + a.w + 0.15, y: top, h: lh, alt: "IShowSpeed in the Morocco shirt under the stadium lights at AFCON 2025" });
    photo(s, "m_stands", { x: b.x, y: top + lh + 0.15, h: lh, alt: "IShowSpeed in the stands above the pitch at AFCON 2025" });
    chip(s, "IShowSpeed at AFCON 2025, Morocco", a.x + 0.15, top + ph - 0.47);
    const rx = b.x + b.w + 0.45, rw = R - rx, colw = (rw - 0.25) / 2;
    [["The mascot concept", "Speed as Assad, signed off by CAF and the FRMF."],
      ["Experience curation", "The whole visit, planned moment by moment."],
      ["Content oversight", "Stream themes aligned with CAF and the FRMF."],
      ["State access", "State visas, border and private jet clearances."],
      ["Permits", "Filming, equipment and drone permits."],
      ["Security", "Private and state security for the whole tour."],
      ["Hotel and logistics", "Hospitality and transport for the full team."],
      ["The Final", "Entry to the Final and the live mascot reveal."]].forEach(([h, t], i) => {
      const x = rx + Math.floor(i / 4) * (colw + 0.25), ry = top + (i % 4) * 0.84;
      numCircle(s, i + 1, x, ry + 0.01, 0.36, { line: C.accent1, color: C.accent1, size: 11 });
      T(s, h, { x: x + 0.5, y: ry, w: colw - 0.5, h: 0.3, fontFace: HEAD, fontSize: 17, color: C.background1 });
      T(s, t, { x: x + 0.5, y: ry + 0.32, w: colw - 0.5, h: 0.52, fontSize: 13, color: C.accent5 });
    });
    partnerLogos(s, rx, 5.8, 1.05, C.accent1);
  }

  // ================= 4. AFCON, THE RESULT =================
  {
    const s = addContent("CONTENT_DARK", "Track record", "TRACK RECORD  ·  THE RESULT", "16 million watched the reveal live",
      "The result of that delivery. IShowSpeed was unveiled as Assad, the official mascot, inside the stadium. 97.3 million watched the final on television, 16 million watched the reveal live, and the tournament set an AFCON record of 6.1 billion digital impressions. The point for FIF: two football institutions trusted AToure with their biggest night.");
    const y = 1.95, h = 3.7;
    const a = photo(s, "mascot_suit", { x: M, y, h, alt: "IShowSpeed in the Assad mascot suit at the AFCON Final" });
    const b = photo(s, "mascot_reveal", { x: a.x + a.w + 0.2, y, h, alt: "IShowSpeed revealed as the mascot at the AFCON Final" });
    chip(s, "Assad, in the suit", a.x + 0.15, y + h - 0.47);
    chip(s, "The reveal", b.x + 0.15, y + h - 0.47);
    const rx = b.x + b.w + 0.55, rw = R - rx;
    T(s, "The stadium erupted as Speed was unveiled as Assad the lion. The moment went viral across Africa and around the world.", { x: rx, y, w: rw, h: 0.85, fontSize: 15, color: C.background1, lineSpacingMultiple: 1.1 });
    const tw = (rw - 0.25) / 2, th = 1.08;
    [["97.3M", "TV audience, final match"], ["16M", "Live stream views of the reveal"], ["6.1B", "AFCON 2025 digital impressions, a tournament record"], ["5.2B", "AFCON 2025 video views on social media"]].forEach(([n, l], i) => {
      const x = rx + (i % 2) * (tw + 0.25), ty = 2.95 + Math.floor(i / 2) * (th + 0.15);
      s.addShape(pres.ShapeType.roundRect, { x, y: ty, w: tw, h: th, rectRadius: 0.08, fill: { color: C.accent6 }, line: { color: C.accent1, width: 0.75, transparency: 65 } });
      T(s, n, { x: x + 0.25, y: ty + 0.1, w: tw - 0.5, h: 0.52, fontSize: 30, color: C.accent4 });
      T(s, l, { x: x + 0.25, y: ty + 0.62, w: tw - 0.5, h: 0.4, fontSize: 11, color: C.accent5 });
    });
    T(s, "Number one trending in Morocco and Senegal. Covered by the Times of India, Gulf News, The New Arab and The Star in Kenya.", { x: rx, y: 5.42, w: rw, h: 0.5, fontSize: 12, color: C.accent5 });
    T(s, "But the numbers never tell the full story. Two football institutions trusted AToure with their biggest night.", { x: rx, y: 5.98, w: rw, h: 0.6, fontFace: HEAD, fontSize: 18, italic: true, color: C.accent4 });
    T(s, "Sources: CAF report and January 2026 figures, YouTube Analytics, broadcast data.", { x: rx, y: 6.62, w: rw, h: 0.22, fontSize: 10, color: C.accent5 });
    partnerLogos(s, M, 5.88, 0.95, C.accent1);
  }

  // ================= 5. ON THE GROUND =================
  {
    const s = addContent("CONTENT_LIGHT", "Track record", "TRACK RECORD  ·  ON THE GROUND", "Full operations, in Abidjan and across Africa",
      "Two more projects, each run end to end by AToure. IShowSpeed in Abidjan: a full market operation built from zero, recognised by the Minister of Tourism. The Ashton Hall Africa Tour: five countries and 1.57 billion views, with one AToure team on the ground.");
    const cw = (CW - 0.35) / 2, top = 1.95, chh = 4.85;
    const projects = [
      { head: "head_speed", name: "IShowSpeed in Abidjan", sub: "Côte d'Ivoire, 2024.",
        photo: "closing", chip: "Abidjan", alt: "IShowSpeed in the Éléphants shirt on a car roof above the crowd, Abidjan",
        stats: [["55.8M", "Instagram views on one reel"], ["10M", "YouTube views"], [null, "Recognised by Côte d'Ivoire's Minister of Tourism."]],
        did: "Sponsors  ·  State visas  ·  Filming permits  ·  Security  ·  Restricted zone access  ·  Cultural moments  ·  Full logistics" },
      { head: "head_ashton", name: "Ashton Hall Africa Tour", sub: "Ghana, Cameroon, Nigeria, Benin and Rwanda, 2026.",
        photo: "ashton_tour", chip: "Cotonou, Benin", alt: "Ashton Hall in a crowd of fans on the street, Cotonou",
        stats: [["1.57B", "total tour views"], ["171M", "biggest single post"], ["262.8M", "views from three posts in Rwanda"]],
        did: "Partnerships and sponsors  ·  Media  ·  Visas and security  ·  Transport  ·  Government meetings  ·  Itinerary in every country" },
    ];
    projects.forEach((p, k) => {
      const x = M + k * (cw + 0.35);
      card(s, x, top, cw, chh, { name: "Project " + p.name });
      s.addImage({ path: A(p.head + ".png"), x: x + 0.3, y: top + 0.25, w: 0.95, h: 0.95, altText: p.name.split(" in ")[0].replace(" Africa Tour", "") + ", headshot" });
      T(s, p.name, { x: x + 1.45, y: top + 0.3, w: cw - 1.75, h: 0.45, fontFace: HEAD, fontSize: 24 });
      T(s, p.sub, { x: x + 1.45, y: top + 0.77, w: cw - 1.75, h: 0.45, fontSize: 12, color: C.text2 });
      s.addShape(pres.ShapeType.line, { x: x + 0.3, y: top + 1.42, w: cw - 0.6, h: 0, line: { color: C.text2, width: 0.75, transparency: 70 } });
      const ph = photo(s, p.photo, { x: x + 0.3, y: top + 1.6, h: 2.0, alt: p.alt });
      chip(s, p.chip, ph.x + 0.12, ph.y + ph.h - 0.44);
      const sx = ph.x + ph.w + 0.3, sw = x + cw - 0.3 - sx;
      p.stats.forEach(([n, l], i) => {
        const sy = ph.y + i * 0.68;
        if (!n) return T(s, l, { x: sx, y: sy + 0.04, w: sw, h: 0.6, fontSize: 12, italic: true, color: C.accent3 });
        T(s, n, { x: sx, y: sy - 0.04, w: sw, h: 0.38, fontSize: 22, color: C.accent3 });
        T(s, l, { x: sx, y: sy + 0.33, w: sw, h: 0.3, fontSize: 11, color: C.text2 });
      });
      kickerLike(s, "WHAT ATOURE DID", x + 0.3, top + 3.82, cw - 0.6, C.accent3);
      // non breaking spaces keep each item whole, so lines wrap only at the separators
      T(s, p.did.split("  ·  ").map((t) => t.replace(/ /g, "\u00A0")).join("\u00A0\u00A0·\u00A0 "), { x: x + 0.3, y: top + 4.08, w: cw - 0.6, h: 0.6, fontSize: 12.5, color: C.text1, lineSpacingMultiple: 1.1 });
    });
  }

  // ================= 6. CONTEXT =================
  pres.addSection({ title: "The case" });
  {
    const s = addContent("CONTENT_LIGHT", "The case", "THE CONTEXT", "Creators already come to Ivorian football",
      "The demand is proven. Creators wear the Éléphants shirt and film around Ivorian football for audiences of millions. They will keep coming. Today nobody vets them, nobody reviews what they publish, and the commercial value goes to them and their brands.");
    const ph = 4.75, pw = ph * MAN.eric.w / MAN.eric.h;
    photo(s, "eric", { x: M, y: 1.95, h: ph, alt: "Creators in the Éléphants orange shirt" });
    const rx = M + pw + 0.55, rw = R - rx;
    T(s, "International creators and media personalities attend fixtures, film around the squad and wear the Éléphants shirt for audiences of millions. Today, it happens with no framework.", { x: rx, y: 1.95, w: rw, h: 0.95, fontSize: 15, color: C.text1, lineSpacingMultiple: 1.1 });
    const gaps = [
      ["userx", "No vetting", "FIF does not choose who gets access, or why."],
      ["shieldoff", "No control of the Federation's image", "FIF's name, crest and players' image go unmanaged."],
      ["eyeoff", "No review before publication", "Content goes live without the Federation seeing it."],
      ["coins", "No commercial return", "Brands pay creators directly. FIF captures none of it."],
    ];
    gaps.forEach(([ic, h, sub], i) => {
      const y = 3.25 + i * 0.86;
      iconCircle(s, ic, rx, y, 0.5, C.accent5);
      T(s, h, { x: rx + 0.7, y: y - 0.02, w: rw - 0.7, h: 0.3, fontSize: 15, bold: true });
      T(s, sub, { x: rx + 0.7, y: y + 0.3, w: rw - 0.7, h: 0.3, fontSize: 14, color: C.text2 });
    });
  }

  // ================= 7. THE SHIFT =================
  {
    const s = addContent("CONTENT_LIGHT", "The case", "THE SHIFT", "From direct deals to a programme FIF governs",
      "Say it plainly. Today FIF gives creators tickets or accreditation, the brands pay the creators directly, and FIF earns nothing and approves nothing. With the programme, FIF accredits AToure as its official partner. AToure distributes the passes, vets and briefs every creator, and brings the brands in through sponsorship that FIF clears.");
    T(s, "Today FIF gives the access and the creators keep the deals. With the programme, FIF keeps control and gains the value.", { x: M, y: 1.68, w: CW, h: 0.4, fontSize: 15, color: C.text2 });
    const py = 2.3, ph = 4.5, pw = (CW - 0.35) / 2, lx = M, rx = M + pw + 0.35;
    card(s, lx, py, pw, ph, { name: "Panel today", flat: true });
    card(s, rx, py, pw, ph, { name: "Panel programme", flat: true });
    kickerLike(s, "TODAY", lx + 0.3, py + 0.22, 4, C.text2);
    kickerLike(s, "WITH THE PROGRAMME", rx + 0.3, py + 0.22, 4, C.accent3);

    node(s, 0.95, 3.55, 1.5, 0.8, "fif", "FIF", 22);
    node(s, 3.85, 2.95, 2.3, 0.7, "neutral", "Creators");
    node(s, 3.85, 4.8, 2.3, 0.7, "neutral", "Brands");
    arrow(s, 2.45, 3.78, 3.85, 3.32, { color: C.text2, width: 1.75 });
    T(s, "tickets or\naccreditation", { x: 1.85, y: 2.78, w: 1.7, h: 0.5, fontSize: 11, italic: true, color: C.text2, align: "center" });
    arrow(s, 5.0, 4.8, 5.0, 3.66, { width: 2.5 });
    T(s, "direct deals", { x: 5.12, y: 4.08, w: 1.25, h: 0.3, fontSize: 11, italic: true, color: C.text2 });
    T(s, "earns nothing", { x: 0.7, y: 4.45, w: 2.0, h: 0.3, fontSize: 11, italic: true, color: C.text2, align: "center" });
    ["FIF gives creators tickets or accreditation", "Brands pay the creators directly", "FIF earns nothing and approves nothing"].forEach((t, i) => {
      const y = 5.72 + i * 0.33;
      s.addImage({ data: ICON.off, x: lx + 0.3, y: y + 0.03, w: 0.22, h: 0.22, altText: "" });
      T(s, t, { x: lx + 0.65, y, w: pw - 0.9, h: 0.3, fontSize: 14, color: C.text2 });
    });

    s.addShape(pres.ShapeType.roundRect, { x: 7.1, y: 2.9, w: 3.8, h: 2.6, rectRadius: 0.12, fill: { type: "none" }, line: { color: C.accent2, width: 1.5, dashType: "dash" }, objectName: "FIF perimeter" });
    s.addShape(pres.ShapeType.roundRect, { x: 7.3, y: 2.76, w: 1.8, h: 0.28, rectRadius: 0.14, fill: { color: C.accent2 }, line: { type: "none" } });
    T(s, "GOVERNED BY FIF", { x: 7.3, y: 2.76, w: 1.8, h: 0.28, fontSize: 10, bold: true, charSpacing: 1, align: "center", valign: "middle" });
    node(s, 7.4, 3.2, 3.2, 0.52, "fif", "FIF");
    node(s, 7.4, 4.0, 3.2, 0.52, "at", "AToure, official partner", 16);
    node(s, 7.4, 4.8, 3.2, 0.52, "neutral", "Accredited creators & media", 15);
    arrow(s, 7.85, 3.72, 7.85, 4.0, { color: C.text1, width: 1.5 });
    arrow(s, 7.85, 4.52, 7.85, 4.8, { color: C.text1, width: 1.5 });
    T(s, "accreditation and partner status", { x: 8.0, y: 3.73, w: 2.85, h: 0.26, fontSize: 10, color: C.text2, valign: "middle" });
    T(s, "distributes passes, vets, briefs", { x: 8.0, y: 4.53, w: 2.85, h: 0.26, fontSize: 10, color: C.text2, valign: "middle" });
    node(s, 11.25, 4.0, 1.25, 0.52, "neutral", "Brands", 15);
    arrow(s, 11.25, 4.26, 10.6, 4.26, { width: 2.5 });
    T(s, "sponsorship,\ncleared by FIF", { x: 10.95, y: 4.62, w: 1.75, h: 0.45, fontSize: 10, italic: true, color: C.accent3, align: "center" });
    ["FIF accredits AToure, its official partner", "Brands pay through AToure, with FIF's approval", "FIF approves every name and post, and gains value"].forEach((t, i) => {
      const y = 5.72 + i * 0.33;
      s.addImage({ data: ICON.check, x: rx + 0.3, y: y + 0.03, w: 0.22, h: 0.22, altText: "" });
      T(s, t, { x: rx + 0.65, y, w: pw - 0.9, h: 0.3, fontSize: 14, color: C.text1 });
    });
  }

  // ================= 8. THE REQUEST =================
  pres.addSection({ title: "The programme" });
  {
    const s = addContent("PHOTO_LEFT", "The programme", "THE REQUEST", "Two requests\nof the Federation",
      "Two requests. First, accreditation: VIP and pitch and media passes for the agreed fixtures. AToure distributes them across its network of creators, media figures and artists, with journalistic creators pitch side and symbolic names in VIP. Second, official partner status, as AToure had with CAF and the Royal Moroccan Football Federation, so brands know they are dealing with an official partner of FIF and not an intermediary.",
      (s) => {
        photo(s, "g_pass", { x: 0, y: 0, w: W, alt: "Illustration: a FIF VIP accreditation pass on a lanyard, above the pitch" });
        fade(s, fadePassTop, 0, 0, W, 2.4);
        fade(s, fadePass, 0, 0, 5.3, H);
      });
    T(s, "Accreditation for the agreed fixtures, and official partner status. FIF issues every pass. AToure distributes them and carries every cost.", { x: M, y: 2.45, w: 3.7, h: 1.4, fontSize: 15, color: C.accent5, lineSpacingMultiple: 1.1 });
    T(s, "Every accreditation remains FIF's to issue, govern and, if needed, withdraw.", { x: M, y: 5.75, w: 3.6, h: 0.9, fontFace: HEAD, fontSize: 19, italic: true, color: C.accent4 });
    photoFooter(s, "AToure Management & Consulting");

    const cx = 7.75, cwid = R - cx, chh = 2.88;
    const asks = [
      ["REQUEST 1", "Accreditation", [["PASSES", "15 to 20 VIP passes, plus pitch & media passes, for creators, media figures and artists."], ["DISTRIBUTION", "Run by AToure: journalistic creators pitch side, symbolic names in VIP."]]],
      ["REQUEST 2", "Official partner status", [["WHAT", "AToure named an official partner of FIF, as it was for CAF and the FRMF."], ["WHY", "Brands deal with an official partner of the Federation, not an intermediary."]]],
    ];
    asks.forEach(([lab, head, rows], i) => {
      const y = 0.74 + i * (chh + 0.3);
      card(s, cx, y, cwid, chh, { name: "Request " + (i + 1) });
      kickerLike(s, lab, cx + 0.35, y + 0.28, 3, C.accent3);
      T(s, head, { x: cx + 0.35, y: y + 0.54, w: cwid - 0.7, h: 0.45, fontFace: HEAD, fontSize: 24 });
      rows.forEach(([k, v], j) => {
        const ry = y + 1.15 + j * 0.86;
        T(s, k, { x: cx + 0.35, y: ry, w: 2.5, h: 0.24, fontSize: 10, bold: true, charSpacing: 2, color: C.accent3 });
        T(s, v, { x: cx + 0.35, y: ry + 0.26, w: cwid - 0.7, h: 0.52, fontSize: 14, color: C.text2 });
      });
    });
  }

  // ================= 9. OPERATING MODEL =================
  {
    const s = addContent("CONTENT_LIGHT", "The programme", "THE OPERATING MODEL", "How the programme runs",
      "Walk the four stages. FIF shares the calendar for the coming season. Before each match FIF confirms, early, which of the requested passes it can allocate: that early answer is what lets AToure's sponsors release budget for travel, accommodation and logistics in time, above all for AFCON. On matchday AToure runs the operation under FIF's protocol. Afterwards AToure oversees the content and the numbers, nothing is published without FIF's approval, and FIF receives a full report.");
    const lx = M, lw = 1.45, x0 = 2.25, gap = 0.18, colw = (R - x0 - 3 * gap) / 4;
    const phases = ["01   CALENDAR", "02   CONFIRMATION", "03   MATCHDAY", "04   REPORT"];
    phases.forEach((p, i) => {
      const x = x0 + i * (colw + gap);
      s.addShape(i === 0 ? pres.ShapeType.homePlate : pres.ShapeType.chevron, { x, y: 1.95, w: colw + (i < 3 ? 0.13 : 0), h: 0.6, fill: { color: C.text1 }, line: { type: "none" }, objectName: "Phase " + (i + 1) });
      T(s, p, { x: x + (i === 0 ? 0.22 : 0.4), y: 1.95, w: colw - 0.5, h: 0.6, fontSize: 11, bold: true, charSpacing: 1, color: C.background1, valign: "middle" });
    });
    const lanes = [
      { kind: "fif", label: "FIF", y: 2.72, h: 1.58, fill: C.accent2, icons: ["cal", "clip", "ticket", "eye"],
        cells: ["Shares the calendar of next season's fixtures.", "Confirms early the passes it can allocate, and approves every name.", "Applies accreditation at every access point, under its own protocol.", "Reviews content before publication and receives the report."] },
      { kind: "at", label: "AToure", y: 4.45, h: 1.62, fill: C.text1, icons: ["users", "wallet", "clap", "chartg"],
        cells: ["Matches each fixture with creators, media figures, artists and sponsors.", "Releases sponsor budget for travel, accommodation and logistics.", "Escorts talent, enforces zones and protocol, runs production.", "Oversees the content and the numbers, and delivers the report."] },
    ];
    lanes.forEach((ln) => {
      node(s, lx, ln.y + ln.h / 2 - 0.3, lw, 0.6, ln.kind, ln.label, 18);
      ln.cells.forEach((txt, i) => {
        const x = x0 + i * (colw + gap);
        card(s, x, ln.y, colw, ln.h, { flat: true, name: ln.label + " cell " + (i + 1) });
        iconCircle(s, ln.icons[i], x + 0.2, ln.y + 0.18, 0.42, ln.fill);
        T(s, txt, { x: x + 0.2, y: ln.y + 0.7, w: colw - 0.35, h: ln.h - 0.78, fontSize: 13, color: C.text2 });
      });
    });
    s.addShape(pres.ShapeType.roundRect, { x: x0, y: 6.22, w: R - x0, h: 0.56, rectRadius: 0.08, fill: { color: C.accent5 }, line: { type: "none" }, objectName: "Rule band" });
    s.addImage({ data: ICON.check, x: x0 + 0.25, y: 6.22 + 0.15, w: 0.26, h: 0.26, altText: "" });
    T(s, "FIF confirms each allocation early, so sponsors can release budget in time, above all for AFCON.", { x: x0 + 0.65, y: 6.22, w: R - x0 - 0.9, h: 0.56, fontSize: 14, bold: true, valign: "middle" });
  }

  // ================= 10. GOVERNANCE =================
  {
    const s = addContent("CONTENT_LIGHT", "The programme", "GOVERNANCE", "FIF keeps every control",
      "The responsibility split. In every area FIF holds the decision and AToure carries the delivery. Note the sponsor clearance row: no programme brand is signed without FIF's approval, so existing partners are always protected. Accreditation stays FIF's, and can be withdrawn at any time.");
    const g = photo(s, "g_gimbal", { x: M, y: 1.95, w: 3.6, alt: "Illustration: a crew member in an orange FIF sleeve filming the pitch on a phone gimbal" });
    T(s, "The Federation sets the rules. AToure is accountable for delivering them.", { x: M, y: g.y + g.h + 0.25, w: 3.6, h: 1.15, fontFace: HEAD, fontSize: 22, lineSpacingMultiple: 1.05 });
    T(s, "Every accredited creator signs a code of conduct, written to FIF's guidelines, before the fixture.", { x: M, y: g.y + g.h + 1.62, w: 3.6, h: 0.8, fontSize: 14, color: C.text2 });
    const tx = 4.55, tw = R - tx, colW = [2.4, (tw - 2.4) / 2, (tw - 2.4) / 2];
    const BORDER = { type: "solid", pt: 0.75, color: "D7E2DA" };
    const hdr = (t, fill, color) => ({ text: t, options: { bold: true, fontSize: 13, fill: { color: fill }, color, valign: "middle", border: [BORDER, BORDER, BORDER, BORDER] } });
    const cell = (t, o = {}) => ({ text: t, options: Object.assign({ fontSize: 13, fill: { color: C.background1 }, color: C.text2, valign: "middle", border: [BORDER, BORDER, BORDER, BORDER] }, o) });
    const rows = [
      ["Who is accredited", "Approves every name", "Proposes and vets the roster"],
      ["Access and protocol", "Sets zones and rules", "Enforces them on site"],
      ["Use of FIF's name, crest and players' image", "Sets the guidelines", "Holds every creator to them"],
      ["Content", "Final approval before publication", "Submits, edits and publishes"],
      ["Programme sponsors", "Clears every brand, protecting existing partners", "Sources and contracts them"],
      ["Accreditation", "Issues it, and may withdraw it at any time", "Distributes passes across its network"],
      ["Cost and operations", "None", "Funds and runs everything"],
    ];
    const data = [[hdr("Area", C.text1, C.background1), hdr("FIF", C.accent2, C.text1), hdr("AToure", C.accent1, C.text1)],
      ...rows.map((r) => [cell(r[0], { bold: true, color: C.text1 }), cell(r[1]), cell(r[2])])];
    s.addTable(data, { x: tx, y: 1.95, w: tw, colW, rowH: [0.5, ...rows.map(() => 0.6)], margin: [0.06, 0.14, 0.06, 0.14], objectName: "Responsibility matrix" });
  }

  // ================= 11. COMMERCIAL MODEL =================
  pres.addSection({ title: "Commercial model" });
  {
    const s = addContent("CONTENT_LIGHT", "Commercial model", "THE COMMERCIAL MODEL", "FIF pays nothing. FIF earns more",
      "Three flows, in plain terms. One: AToure brings its own sponsors and pays the creators and the production itself. Two: FIF sells the creator content made under its banner and asks its own sponsors for more money. Three: AToure takes a commission only on that extra money. FIF's existing budget and contracts are never touched.");
    node(s, 2.15, 1.95, 2.7, 0.72, "neutral", "Brand partners");
    node(s, M, 3.8, 1.85, 0.85, "fif", "FIF", 22);
    node(s, 3.75, 3.8, 2.7, 0.85, "at", "AToure", 22);
    node(s, 3.75, 5.85, 2.7, 0.72, "neutral", "Creators & production", 16);
    arrow(s, 4.45, 2.67, 4.45, 3.8, { width: 2.5 });
    numCircle(s, 1, 4.62, 3.06, 0.34, { fill: C.accent1, size: 12 });
    T(s, "programme sponsorship", { x: 5.04, y: 3.04, w: 1.5, h: 0.42, fontSize: 11, color: C.text2, valign: "middle" });
    arrow(s, 2.6, 2.67, 1.6, 3.8, { color: C.accent2, width: 2.5 });
    numCircle(s, 2, 1.48, 2.98, 0.34, { fill: C.accent2, size: 12 });
    T(s, "more money from FIF's sponsors", { x: M, y: 2.62, w: 0.84, h: 1.0, fontSize: 10, color: C.text2, align: "right", valign: "middle" });
    arrow(s, 2.45, 4.05, 3.75, 4.05, { color: C.text2, width: 1.5 });
    T(s, "accreditation", { x: 2.45, y: 3.77, w: 1.3, h: 0.24, fontSize: 10, color: C.text2, align: "center" });
    arrow(s, 3.75, 4.42, 2.45, 4.42, { width: 2, dash: true });
    numCircle(s, 3, 2.93, 4.55, 0.34, { fill: C.accent1, size: 12 });
    T(s, "commission on the extra only", { x: 2.1, y: 4.94, w: 2.0, h: 0.45, fontSize: 10, color: C.text2, align: "center" });
    arrow(s, 4.4, 4.65, 4.4, 5.85, { width: 2 });
    T(s, "talent fees and production, paid by AToure", { x: 4.55, y: 4.95, w: 1.95, h: 0.5, fontSize: 10, color: C.text2 });

    const rx = 7.05, rw = R - rx;
    [[1, C.accent1, "AToure brings its own sponsors", "Brands sponsor the creator programme directly with AToure, which carries the cost and the risk. Each brand is cleared with FIF first."],
      [2, C.accent2, "FIF earns more from its sponsors", "Creators under the FIF banner give FIF more to sell. FIF adds them to its packages and asks its sponsors for more money."],
      [3, C.accent1, "Commission on the extra only", "AToure takes a share only of the extra money it helps FIF bring in. FIF's existing contracts and budget are never touched."]].forEach(([n, f, h, b], i) => {
      const y = 1.95 + i * 1.25;
      numCircle(s, n, rx, y, 0.45, { fill: f, size: 14 });
      T(s, h, { x: rx + 0.65, y: y + 0.02, w: rw - 0.65, h: 0.4, fontFace: HEAD, fontSize: 19 });
      T(s, b, { x: rx + 0.65, y: y + 0.42, w: rw - 0.65, h: 0.78, fontSize: 14, color: C.text2 });
    });
    s.addShape(pres.ShapeType.roundRect, { x: rx, y: 5.78, w: rw, h: 1.0, rectRadius: 0.1, fill: { color: C.text1 }, line: { type: "none" }, objectName: "Cost callout" });
    kickerLike(s, "COST TO FIF", rx + 0.35, 5.93, 2.2, C.accent1);
    T(s, "0 FCFA", { x: rx + 0.35, y: 6.17, w: 2.4, h: 0.5, fontSize: 30, color: C.background1 });
    T(s, "No fee and no budget. FIF only earns more.", { x: rx + 2.75, y: 5.78, w: rw - 3.0, h: 1.0, fontSize: 14, color: C.accent5, valign: "middle" });
  }

  // ================= 12. WHAT FIF GAINS =================
  {
    const s = addContent("CONTENT_LIGHT", "Commercial model", "THE RETURN FOR FIF", "FIF can ask its sponsors for more",
      "The point in one line: when creators work under the FIF banner, FIF has more to sell, so FIF can ask its sponsors for more money. Around that, five more returns: international visibility, official content, governance, reporting FIF can show its sponsors, and protection of existing partners. All of it at no cost to the Federation.");
    const p = photo(s, "g_crowd", { x: M, y: 1.95, w: 6.4, alt: "Illustration: a packed football stadium under floodlights during a match" });
    s.addShape(pres.ShapeType.roundRect, { x: M, y: p.y + p.h + 0.25, w: 6.4, h: 6.8 - (p.y + p.h + 0.25), rectRadius: 0.1, fill: { color: C.accent2 }, line: { type: "none" }, objectName: "Money message" });
    T(s, "Creators under the FIF banner give FIF more to sell. More to sell means FIF can ask its sponsors for more money.", { x: M + 0.3, y: p.y + p.h + 0.25, w: 5.8, h: 6.8 - (p.y + p.h + 0.25), fontFace: HEAD, fontSize: 21, valign: "middle", lineSpacingMultiple: 1.05 });
    const x0 = 7.45, rw = R - x0;
    [["g_trend", "More money from sponsors", "Creator content sold in FIF's own packages."],
      ["g_globe", "International visibility", "Global names alongside the Éléphants."],
      ["g_cam", "Official content", "Matchday content for FIF's own channels."],
      ["g_shield", "Governance", "FIF approves every name and every post."],
      ["g_chart", "Reporting", "A full report FIF can show its sponsors."],
      ["g_hand", "Partner protection", "Every brand cleared against FIF's partners."]].forEach(([ic, h, b], i) => {
      const y = 1.95 + i * 0.8;
      iconCircle(s, ic, x0, y + 0.05, 0.5, C.accent2);
      T(s, h, { x: x0 + 0.72, y: y, w: rw - 0.72, h: 0.32, fontFace: HEAD, fontSize: 18 });
      T(s, b, { x: x0 + 0.72, y: y + 0.33, w: rw - 0.72, h: 0.3, fontSize: 14, color: C.text2 });
    });
  }

  // ================= 13. ROADMAP =================
  pres.addSection({ title: "Next steps" });
  {
    const s = addContent("PHOTO_DARK", "Next steps", "THE ROADMAP", "Everything builds to AFCON 2027",
      "AFCON is the goal. It starts with a meeting on AFCON and the accreditation situation, then the season's fixtures, qualifiers and friendlies, then a full programme at AFCON 2027, and a multi year partnership beyond it. FIF reviews each phase before the next one begins.",
      (s) => {
        const ph = W * MAN.g_tunnel.h / MAN.g_tunnel.w;
        photo(s, "g_tunnel", { x: 0, y: (H - ph) / 2, w: W, alt: "Illustration: the players' tunnel opening onto a floodlit pitch, with CAF and FIF boards" });
        s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: W, h: H, fill: { color: C.text1, transparency: 32 }, line: { type: "none" }, objectName: "Photo overlay" });
        fade(s, fadeTop, 0, 0, W, 2.4);
      });
    T(s, "Each phase begins only after FIF has reviewed the one before it.", { x: M, y: 1.68, w: CW, h: 0.4, fontSize: 15, color: C.accent5 });
    const cw = (CW - 3 * 0.25) / 4, ly = 2.95;
    s.addShape(pres.ShapeType.line, { x: 1.1, y: ly, w: R - 0.5 - 1.1, h: 0, line: { color: C.accent1, width: 2 } });
    const phases = [
      ["NOW", "Meet on AFCON", "The accreditation situation, the calendar and official partner status."],
      ["THE SEASON", "The season's fixtures", "Accredited creators at the Éléphants' qualifiers and friendlies, reported in full."],
      ["AFCON 2027", "The goal", "Kenya, Tanzania and Uganda, June and July 2027. A full creator programme around the Éléphants."],
      ["BEYOND", "Partnership to 2028", "A multi year programme. Player content is a separate conversation."],
    ];
    phases.forEach(([when, h, b], i) => {
      const x = M + i * (cw + 0.25), cx = x + cw / 2, later = i === 3, goal = i === 2;
      T(s, when, { x: x, y: 2.25, w: cw, h: 0.28, fontSize: 11, bold: true, charSpacing: 2, color: goal ? C.accent2 : C.accent4, align: "center" });
      const d = goal ? 0.72 : 0.6;
      numCircle(s, "0" + (i + 1), cx - d / 2, ly - d / 2, d, later ? { fill: C.text1, line: C.accent5, dash: true, color: C.accent5, size: 14 } : goal ? { fill: C.accent2, color: C.text1, size: 16 } : { fill: C.accent1, color: C.text1, size: 14 });
      if (i < 3) {
        const mx = cx + (cw + 0.25) / 2;
        s.addShape(pres.ShapeType.diamond, { x: mx - 0.11, y: ly - 0.11, w: 0.22, h: 0.22, fill: { color: C.accent2 }, line: { type: "none" } });
        T(s, "FIF review", { x: mx - 0.6, y: ly + 0.17, w: 1.2, h: 0.25, fontSize: 10, italic: true, color: C.accent5, align: "center" });
      }
      s.addShape(pres.ShapeType.roundRect, later
        ? { x, y: 3.55, w: cw, h: 2.25, rectRadius: 0.1, fill: { color: C.text1, transparency: 45 }, line: { color: C.accent5, width: 1, dashType: "dash", transparency: 40 }, objectName: "Phase card 4" }
        : goal ? { x, y: 3.55, w: cw, h: 2.25, rectRadius: 0.1, fill: { color: C.accent2 }, line: { type: "none" }, objectName: "Phase card 3, the goal" }
        : { x, y: 3.55, w: cw, h: 2.25, rectRadius: 0.1, fill: { color: C.text1, transparency: 18 }, line: { color: C.accent1, width: 0.75, transparency: 50 }, objectName: "Phase card " + (i + 1) });
      T(s, h, { x: x + 0.25, y: 3.8, w: cw - 0.5, h: 0.45, fontFace: HEAD, fontSize: 21, color: later ? C.accent5 : goal ? C.text1 : C.background1 });
      T(s, b, { x: x + 0.25, y: 4.35, w: cw - 0.5, h: 1.4, fontSize: 14, color: goal ? C.text1 : C.accent5 });
    });
    s.addShape(pres.ShapeType.roundRect, { x: M, y: 6.1, w: CW, h: 0.62, rectRadius: 0.08, fill: { color: C.background1 }, line: { type: "none" }, objectName: "Commitment band" });
    T(s, "At every phase, FIF commits accreditation and partner status only, and decides whether the next phase goes ahead.", { x: M + 0.35, y: 6.1, w: CW - 0.7, h: 0.62, fontSize: 15, color: C.text1, valign: "middle" });
    photoFooter(s);
  }

  // ================= 14. CLOSING =================
  {
    const s = addContent("CLOSING", "Next steps", "NEXT STEPS", "Three steps\nto AFCON 2027",
      "Close on the decision. We ask for a meeting on AFCON: the accreditation situation, the calendar and the passes available. Then the partnership is signed, with official partner status and FIF's governance terms. Then AToure delivers the season and AFCON, funded by its sponsors and reported in full.",
      (s) => {
        photo(s, "g_lounge", { x: 0, y: 0, w: W, alt: "Illustration: a FIF VIP lounge looking out onto a floodlit pitch" });
        fade(s, fadeLounge, 0, 0, 8.6, H);
      });
    T(s, "The creators are coming.\nFIF decides the terms.", { x: 8.6, y: 6.2, w: R - 8.6, h: 0.85, fontFace: HEAD, fontSize: 22, italic: true, color: C.accent4, align: "right", lineSpacingMultiple: 1.0 });
    [["Meet on AFCON", "The accreditation situation, the calendar and the passes available."],
      ["Sign the partnership", "Official partner status and governance terms, as set by FIF."],
      ["Deliver the season and AFCON", "Run in full by AToure, funded by its sponsors, reported to FIF."]].forEach(([h, b], i) => {
      const y = 2.4 + i * 1.05;
      numCircle(s, i + 1, M, y, 0.5, { line: C.accent1, color: C.accent1, size: 14 });
      T(s, h, { x: M + 0.7, y: y + 0.01, w: 4.9, h: 0.36, fontFace: HEAD, fontSize: 19, color: C.background1 });
      T(s, b, { x: M + 0.7, y: y + 0.4, w: 4.9, h: 0.5, fontSize: 14, color: C.accent5 });
    });
    s.addImage({ path: A("lockup_dark.png"), x: M, y: 5.75, w: 2.8, h: 2.8 * 256 / 1600, altText: "AToure Management & Consulting" });
    T(s, "Baba Toure, Director", { x: M, y: 6.35, w: 5.5, h: 0.3, fontSize: 14, bold: true, color: C.background1 });
    T(s, "baba@atoureconsulting.com  ·  +44 7456 728616", { x: M, y: 6.7, w: 5.5, h: 0.3, fontSize: 13, color: C.accent4 });
  }

  const out = path.join(__dirname, "AToure FIF Partnership Deck.pptx");
  await pres.writeFile({ fileName: out });
  await applyTheme(out, THEME);
  console.log("written", out);
})().catch((e) => { console.error(e); process.exit(1); });
