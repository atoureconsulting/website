// Worked example: the FIF partnership deck (13 slides, Éléphants d'Or theme), built on
// deck_kit. Read it for patterns; copy the slide you need and change the content.
//
//   cd <work>   # after setup.sh, and prep_images.js with fif-images.json
//   NODE_PATH=<work>/node_modules node <skill>/references/examples/fif-build.js ./assets "FIF Deck.pptx"
//
// Slide map and the pattern each one demonstrates:
//   1  cover: split dark panel, portrait photo full height, edge fade, caption chip
//   2  at a glance: four icon cards plus a dark proof band of three figures
//   3  context: landscape photo at native ratio, four icon rows naming the problem
//   4  the shift: today vs with the programme, two panel node diagram with a governed perimeter
//   5  track record (dark): two portrait photos side by side, 2x2 stat tiles, partner logos
//   6  track record: two case studies on one page, portrait photo plus stacked figures each
//   7  the request: drawn accreditation passes (no photo needed) plus two category cards
//   8  operating model: before / matchday / after swimlane with a rule band
//   9  governance: statement column plus a responsibility table (client vs AToure)
//  10  commercial model: numbered money flow diagram, explanations, "0 FCFA" cost callout
//  11  gains: split dark layout, full height photo, six icon items
//  12  roadmap: timeline with review gates, phase cards, commitment band
//  13  closing: three numbered steps, photo, line of copy, contact block
const path = require("path");
const kit = require(path.join(__dirname, "..", "..", "scripts", "deck_kit.js"));

const assetsDir = path.resolve(process.argv[2] || "./assets");
const out = path.resolve(process.argv[3] || "AToure FIF Partnership Deck.pptx");

const deck = kit.createDeck({
  theme: "elephants-dor",
  title: "A Governed Creator and Media Programme for FIF",
  subject: "Partnership proposal to the Fédération Ivoirienne de Football",
  footer: "AToure Management & Consulting  ·  Proposal to the Fédération Ivoirienne de Football",
  assetsDir,
});
const { pres, C, HEAD, W, H, M, R, CW, T } = deck;
const logoPath = (k) => path.join(assetsDir, deck.manifest[k].file);

(async () => {
  await deck.icons({
    idcard: ["LuIdCard", "highlight"], cog: ["LuSettings2", "highlight"], bank: ["LuBanknote", "highlight"], shield: ["LuShieldCheck", "highlight"],
    userx: ["LuUserX", "ink"], shieldoff: ["LuShieldOff", "ink"], eyeoff: ["LuEyeOff", "ink"], coins: ["LuHandCoins", "ink"],
    off: ["LuCircleOff", "muted"], check: ["LuBadgeCheck", "label"],
    clip: ["LuClipboardCheck", "ink"], ticket: ["LuTicket", "ink"], eye: ["LuEye", "ink"],
    users: ["LuUsers", "highlight"], clap: ["LuClapperboard", "highlight"], chartg: ["LuChartColumn", "highlight"],
    g_shield: ["LuShieldCheck", "ink"], g_cam: ["LuCamera", "ink"], g_globe: ["LuGlobe", "ink"], g_trend: ["LuTrendingUp", "ink"], g_chart: ["LuChartColumn", "ink"], g_hand: ["LuHandshake", "ink"],
    landmark: ["LuLandmark", "highlight"], user: ["LuUser", "label"],
  });
  deck.layouts();

  // 1. COVER
  deck.section("Introduction");
  {
    const s = deck.cover("Global creators,\ngoverned by FIF",
      "A managed creator and media accreditation programme for the Fédération Ivoirienne de Football. FIF grants access. AToure delivers the talent, the operation, the oversight and the sponsors, at no cost to the Federation.",
      "Open on the core idea: international creators and media already come to Ivorian football. This proposal puts that activity under FIF's governance, run by AToure, at no cost to the Federation.");
    const p = deck.photo(s, "cover", { x: W - H * 0.75, y: 0, h: H, alt: "IShowSpeed in the Éléphants shirt, facing a crowd in Abidjan" });
    await deck.fadeImage(s, "ltr", p.x, 0, 1.6, H);
    deck.logo(s, "dark", M, 0.6, 2.9);
    T(s, "PARTNERSHIP PROPOSAL", { x: M, y: 2.2, w: 6, h: 0.3, fontSize: 12, bold: true, charSpacing: 4, color: "gold" });
    T(s, "AToure Management & Consulting  ·  October 2026", { x: M, y: 6.75, w: 6.2, h: 0.3, fontSize: 11, color: "highlight" });
    deck.chip(s, "IShowSpeed in the Éléphants shirt, Abidjan", W - 0.3, 6.88, { alignRight: true });
  }

  // 2. AT A GLANCE
  {
    const s = deck.content("CONTENT_LIGHT", "AT A GLANCE", "One request of FIF. AToure delivers the rest",
      "The whole proposal in one page. FIF grants accreditation; AToure brings the talent, the sponsors and the operation, and is paid only from new revenue.");
    T(s, "FIF grants accreditation. AToure brings everything else, and is paid only from new revenue the programme creates.", { x: M, y: 1.68, w: CW, h: 0.4, fontSize: 15, color: "muted" });
    const cw = (CW - 0.9) / 4, cy = 2.3, ch = 3.1;
    [["idcard", "FIF PROVIDES", "Accreditation", "VIP and pitch & media passes for agreed fixtures, on FIF's terms."],
      ["cog", "ATOURE DELIVERS", "The programme", "Talent, sponsors, matchday operations, production and oversight."],
      ["bank", "COST TO FIF", "0 FCFA", "No fee and no budget allocation. AToure funds the operation."],
      ["shield", "FIF RECEIVES", "Full control", "Approval of every name, official content and new sponsorship value."]].forEach(([ic, lab, head, body], i) => {
      const x = M + i * (cw + 0.3);
      deck.card(s, x, cy, cw, ch, { name: "Card " + lab });
      deck.iconCircle(s, ic, x + 0.3, cy + 0.3, 0.62, "ink");
      deck.kicker(s, lab, x + 0.3, cy + 1.12, cw - 0.6);
      T(s, head, i === 2 ? { x: x + 0.3, y: cy + 1.36, w: cw - 0.6, h: 0.52, fontSize: 28 } : { x: x + 0.3, y: cy + 1.38, w: cw - 0.6, h: 0.5, fontFace: HEAD, fontSize: 24 });
      T(s, body, { x: x + 0.3, y: cy + 1.95, w: cw - 0.6, h: 1.0, color: "muted" });
    });
    const by = 5.68, bh = 1.12, pw = CW / 3;
    s.addShape(pres.ShapeType.roundRect, { x: M, y: by, w: CW, h: bh, rectRadius: 0.1, fill: { color: C.ink }, line: { type: "none" }, objectName: "Proof band" });
    [["97.3M", "AFCON 2025 Final TV audience, delivered with CAF and the FRMF"], ["600+", "Security personnel mobilised by AToure in Abidjan"], ["1.57B", "Views across AToure's five country Africa tour"]].forEach(([n, l], i) => {
      const x = M + i * pw;
      if (i) deck.line(s, x, by + 0.22, 0, bh - 0.44, { transparency: 50, width: 0.75 });
      T(s, n, { x: x + 0.35, y: by, w: 1.55, h: bh, fontSize: 30, color: "highlight", valign: "middle" });
      T(s, l, { x: x + 1.95, y: by, w: pw - 2.2, h: bh, fontSize: 12, color: "tint", valign: "middle" });
    });
  }

  // 3. CONTEXT
  deck.section("The case");
  {
    const s = deck.content("CONTENT_LIGHT", "THE CONTEXT", "Creators already come to Ivorian football",
      "The demand is proven. Creators and media will keep coming. Today nobody vets them, nobody reviews what they publish, and the commercial value goes to them and their brands.");
    deck.photo(s, "context", { x: M, y: 1.9, w: 6.3, alt: "IShowSpeed filming above a crowd in Abidjan" });
    T(s, "IShowSpeed in the Éléphants shirt, Abidjan. One reel from the visit reached 55.8M views.", { x: M, y: 6.6, w: 6.3, h: 0.3, fontSize: 11, italic: true, color: "muted" });
    const rx = 7.25, rw = R - rx;
    T(s, "International creators and media personalities attend fixtures, film around the squad and wear the Éléphants shirt for audiences of millions. Today, it happens with no framework.", { x: rx, y: 1.9, w: rw, h: 1.25, fontSize: 15, lineSpacingMultiple: 1.1 });
    [["userx", "No vetting", "FIF does not choose who gets access, or why."],
      ["shieldoff", "No control of the Federation's image", "FIF's name, crest and players' image go unmanaged."],
      ["eyeoff", "No review before publication", "Content goes live without the Federation seeing it."],
      ["coins", "No commercial return", "Brands pay creators directly. FIF captures none of it."]].forEach(([ic, h, sub], i) => {
      const y = 3.3 + i * 0.88;
      deck.iconCircle(s, ic, rx, y, 0.5, "tint");
      T(s, h, { x: rx + 0.7, y: y - 0.02, w: rw - 0.7, h: 0.3, fontSize: 15, bold: true });
      T(s, sub, { x: rx + 0.7, y: y + 0.3, w: rw - 0.7, h: 0.5, color: "muted" });
    });
  }

  // 4. THE SHIFT
  {
    const s = deck.content("CONTENT_LIGHT", "THE SHIFT", "From informal access to a governed programme",
      "Left: creators get informal access and deal with brands directly; FIF sits outside the loop. Right: FIF sets the rules, AToure operates inside them, brands come in through sponsorship FIF clears.");
    T(s, "The attention exists with or without the Federation. The programme brings it inside FIF's governance.", { x: M, y: 1.68, w: CW, h: 0.4, fontSize: 15, color: "muted" });
    const py = 2.3, ph = 4.5, pw = (CW - 0.35) / 2, lx = M, rx = M + pw + 0.35;
    deck.card(s, lx, py, pw, ph, { flat: true, name: "Panel today" });
    deck.card(s, rx, py, pw, ph, { flat: true, name: "Panel programme" });
    deck.kicker(s, "TODAY", lx + 0.3, py + 0.22, 4, "muted");
    deck.kicker(s, "WITH THE PROGRAMME", rx + 0.3, py + 0.22, 4);
    deck.node(s, 0.95, 3.55, 1.5, 0.8, "client", "FIF", 22);
    deck.node(s, 3.85, 2.95, 2.3, 0.7, "neutral", "Creators & media");
    deck.node(s, 3.85, 4.8, 2.3, 0.7, "neutral", "Brands");
    deck.arrow(s, 2.45, 3.78, 3.85, 3.32, { color: "muted", width: 1.5, dash: true });
    T(s, "informal access", { x: 2.05, y: 3.06, w: 1.6, h: 0.25, fontSize: 11, italic: true, color: "muted", align: "center" });
    deck.arrow(s, 5.0, 4.8, 5.0, 3.66, { width: 2.5 });
    T(s, "direct deals", { x: 5.12, y: 4.08, w: 1.25, h: 0.3, fontSize: 11, italic: true, color: "muted" });
    T(s, "outside the loop", { x: 0.7, y: 4.45, w: 2.0, h: 0.3, fontSize: 11, italic: true, color: "muted", align: "center" });
    ["Access granted without vetting", "Content published without review", "Commercial value captured by others"].forEach((t, i) => {
      const y = 5.72 + i * 0.33;
      deck.icon(s, "off", lx + 0.3, y + 0.03, 0.22);
      T(s, t, { x: lx + 0.65, y, w: pw - 0.9, h: 0.3, color: "muted" });
    });
    deck.card(s, 7.1, 2.9, 3.8, 2.6, { noFill: true, flat: true, line: "client", lineWidth: 1.5, lineDash: true, r: 0.12, name: "FIF perimeter" });
    s.addShape(pres.ShapeType.roundRect, { x: 7.3, y: 2.76, w: 1.8, h: 0.28, rectRadius: 0.14, fill: { color: C.client }, line: { type: "none" } });
    T(s, "GOVERNED BY FIF", { x: 7.3, y: 2.76, w: 1.8, h: 0.28, fontSize: 10, bold: true, charSpacing: 1, align: "center", valign: "middle" });
    deck.node(s, 7.4, 3.2, 3.2, 0.52, "client", "FIF");
    deck.node(s, 7.4, 4.0, 3.2, 0.52, "gold", "AToure");
    deck.node(s, 7.4, 4.8, 3.2, 0.52, "neutral", "Accredited creators & media", 15);
    deck.arrow(s, 7.85, 3.72, 7.85, 4.0, { color: "ink", width: 1.5 });
    deck.arrow(s, 7.85, 4.52, 7.85, 4.8, { color: "ink", width: 1.5 });
    T(s, "accreditation and rules", { x: 8.0, y: 3.73, w: 2.8, h: 0.26, fontSize: 10, color: "muted", valign: "middle" });
    T(s, "vetting, briefing, management", { x: 8.0, y: 4.53, w: 2.8, h: 0.26, fontSize: 10, color: "muted", valign: "middle" });
    deck.node(s, 11.25, 4.0, 1.25, 0.52, "neutral", "Brands", 15);
    deck.arrow(s, 11.25, 4.26, 10.6, 4.26, { width: 2.5 });
    T(s, "sponsors cleared by FIF", { x: 10.95, y: 4.62, w: 1.75, h: 0.45, fontSize: 10, italic: true, color: "label", align: "center" });
    ["Every name approved by FIF", "Every post reviewed before it goes live", "New value inside FIF's own packages"].forEach((t, i) => {
      const y = 5.72 + i * 0.33;
      deck.icon(s, "check", rx + 0.3, y + 0.03, 0.22);
      T(s, t, { x: rx + 0.65, y, w: pw - 0.9, h: 0.3 });
    });
  }

  // 5. AFCON FINAL (dark)
  deck.section("Track record");
  {
    const s = deck.content("CONTENT_DARK", "TRACK RECORD  ·  CONFEDERATION LEVEL", "The AFCON 2025 Final, Rabat",
      "AToure's idea, approved by CAF and the Royal Moroccan Football Federation: IShowSpeed appointed as Assad, the official mascot of the Final. AToure delivered all of it.");
    const y = 1.95, h = 4.6;
    const a = deck.photo(s, "mascot_suit", { x: M, y, h, alt: "IShowSpeed in the Assad mascot suit at the AFCON Final" });
    const b = deck.photo(s, "mascot_reveal", { x: a.x + a.w + 0.2, y, h, alt: "IShowSpeed revealed as the mascot at the AFCON Final" });
    deck.chip(s, "In the suit", a.x + 0.15, y + h - 0.47);
    deck.chip(s, "The reveal", b.x + 0.15, y + h - 0.47);
    const rx = 6.95, rw = R - rx;
    T(s, "AToure conceived the appointment of IShowSpeed as Assad, the official mascot of the Final. CAF and the Royal Moroccan Football Federation approved the concept. AToure delivered all of it: state visas, permits, security and the live reveal in the stadium.", { x: rx, y, w: rw, h: 1.4, color: "paper", lineSpacingMultiple: 1.1 });
    const tw = (rw - 0.25) / 2, th = 1.08;
    [["97.3M", "TV audience, final match"], ["16M", "Live stream views of the reveal"], ["300K+", "New subscribers in 24 hours"], ["6.1B", "AFCON 2025 digital impressions, a tournament record"]].forEach(([n, l], i) => {
      deck.stat(s, rx + (i % 2) * (tw + 0.25), 3.5 + Math.floor(i / 2) * (th + 0.15), tw, th, n, l, { tile: "panel", dark: true });
    });
    T(s, "Sources: CAF report, YouTube Analytics, broadcast data.", { x: rx, y: 5.95, w: rw, h: 0.25, fontSize: 10, color: "tint" });
    deck.kicker(s, "IN PARTNERSHIP WITH", rx, 6.4, 2.75, "gold");
    [["caf", 9.75, 0.62, 0.45], ["frmf", 10.5, 0.56, 0.44 * 250 / 341]].forEach(([k, x, cw, lw]) => {
      s.addShape(pres.ShapeType.roundRect, { x, y: 6.24, w: cw, h: 0.56, rectRadius: 0.06, fill: { color: C.paper }, line: { type: "none" } });
      const m = deck.manifest[k], lh = lw * m.h / m.w;
      s.addImage({ path: logoPath(k), x: x + (cw - lw) / 2, y: 6.24 + (0.56 - lh) / 2, w: lw, h: lh, altText: k.toUpperCase() });
    });
  }

  // 6. ON THE GROUND
  {
    const s = deck.content("CONTENT_LIGHT", "TRACK RECORD  ·  ON THE GROUND", "Full operations, in Abidjan and across Africa",
      "In Abidjan, a full market operation from zero. Across five countries, the Ashton Hall tour reached 1.57 billion views with one AToure team on the ground.");
    const colW = (CW - 0.45) / 2, y = 1.95, h = 4.3;
    [{ x: M, key: "ivory", alt: "IShowSpeed in the Éléphants shirt with press and security, Abidjan", name: "Côte d'Ivoire",
      sub: "IShowSpeed in Abidjan. A full market operation built from zero.",
      stats: [["600+", "security personnel mobilised"], ["15", "state visas secured"], ["2", "national sponsors closed: MTN and Solibra"]],
      note: "Recognised by Côte d'Ivoire's Minister of Tourism." },
    { x: M + colW + 0.45, key: "ashton", alt: "Ashton Hall playing football with local children, Accra", name: "Ashton Hall Africa Tour",
      sub: "Ghana, Cameroon, Nigeria, Benin and Rwanda in 2026.",
      stats: [["1.57B", "total tour views"], ["171M", "biggest single post"], ["5", "countries, one team on the ground"]],
      note: "Also in Abidjan: Race Weekend, AToure's own event, with nine partner brands." }].forEach((c) => {
      const p = deck.photo(s, c.key, { x: c.x, y, h, alt: c.alt });
      const tx = p.x + p.w + 0.25, tw = c.x + colW - tx;
      T(s, c.name, { x: tx, y: y - 0.04, w: tw, h: 0.8, fontFace: HEAD, fontSize: 21, lineSpacingMultiple: 0.95 });
      T(s, c.sub, { x: tx, y: y + 0.82, w: tw, h: 0.95, fontSize: 12, color: "muted" });
      c.stats.forEach(([n, l], i) => deck.stat(s, tx, y + 1.72 + i * 0.82, tw, 0.8, n, l, { size: 26 }));
      T(s, c.note, { x: c.x, y: 6.42, w: colW, h: 0.42, fontSize: 12, italic: true, color: "label" });
    });
  }

  // 7. THE REQUEST
  deck.section("The programme");
  {
    const s = deck.content("CONTENT_LIGHT", "THE REQUEST", "Two categories of accreditation",
      "This is the only thing we ask of FIF. VIP accreditation for a curated roster of international names, every one approved by the Federation, and pitch and media accreditation for AToure's crew.");
    const pass = (x, y, cat, catSize) => {
      const w = 2.5, h = 3.85;
      deck.card(s, x, y, w, h, { r: 0.14, name: "Pass " + cat });
      s.addShape(pres.ShapeType.roundRect, { x, y, w, h: 1.0, rectRadius: 0.14, fill: { color: C.client }, line: { type: "none" } });
      s.addShape(pres.ShapeType.rect, { x, y: y + 0.6, w, h: 0.4, fill: { color: C.client }, line: { type: "none" } });
      s.addShape(pres.ShapeType.roundRect, { x: x + w / 2 - 0.32, y: y + 0.15, w: 0.64, h: 0.11, rectRadius: 0.05, fill: { color: C.paper }, line: { type: "none" } });
      T(s, "FIF", { x, y: y + 0.32, w, h: 0.4, fontFace: HEAD, fontSize: 24, align: "center" });
      T(s, "ACCRÉDITATION", { x, y: y + 0.7, w, h: 0.22, fontSize: 10, bold: true, charSpacing: 3, align: "center" });
      s.addShape(pres.ShapeType.roundRect, { x: x + w / 2 - 0.42, y: y + 1.2, w: 0.84, h: 0.84, rectRadius: 0.08, fill: { color: C.tint }, line: { type: "none" } });
      deck.icon(s, "user", x + w / 2 - 0.25, y + 1.37, 0.5);
      T(s, cat, { x, y: y + 2.1, w, h: 0.85, fontFace: HEAD, fontSize: catSize, align: "center", valign: "middle", lineSpacingMultiple: 0.9 });
      T(s, "MATCHS OFFICIELS", { x, y: y + 3.03, w, h: 0.22, fontSize: 10, bold: true, charSpacing: 2, color: "label", align: "center" });
      const bars = [2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 2, 1, 3, 1, 2, 1, 1, 2];
      let bx = x + 0.45; const unit = (w - 0.9) / bars.reduce((t, v) => t + v + 1, 0);
      bars.forEach((v, i) => { if (i % 2 === 0) s.addShape(pres.ShapeType.rect, { x: bx, y: y + h - 0.44, w: v * unit, h: 0.24, fill: { color: C.ink }, line: { type: "none" } }); bx += (v + 1) * unit; });
    };
    pass(0.75, 1.95, "VIP", 56);
    pass(3.5, 1.95, "PITCH\n& MÉDIA", 27);
    T(s, "Every accreditation remains FIF's to issue, govern and, if needed, withdraw.", { x: 0.75, y: 6.05, w: 5.25, h: 0.6, italic: true, color: "label" });
    const cx = 6.45, cwid = R - cx, chh = 2.3;
    [["CATEGORY 1", "VIP passes", [["FOR", "International creators, media figures and artists, each one approved by FIF."], ["REQUESTED", "15 to 20 passes. Fixtures and duration to be agreed."]]],
      ["CATEGORY 2", "Pitch & media passes", [["FOR", "AToure's crew, covering arrivals, training and matchday for FIF's own channels."], ["REQUESTED", "Passes, fixtures and duration to be agreed."]]]].forEach(([lab, head, rows], i) => {
      const y = 1.95 + i * (chh + 0.2);
      deck.card(s, cx, y, cwid, chh, { name: "Category " + (i + 1) });
      deck.kicker(s, lab, cx + 0.35, y + 0.25, 3);
      T(s, head, { x: cx + 0.35, y: y + 0.5, w: cwid - 0.7, h: 0.45, fontFace: HEAD, fontSize: 24 });
      rows.forEach(([k, v], j) => {
        const ry = y + 1.08 + j * 0.58;
        T(s, k, { x: cx + 0.35, y: ry + 0.03, w: 1.15, h: 0.25, fontSize: 10, bold: true, charSpacing: 2, color: "label" });
        T(s, v, { x: cx + 1.55, y: ry, w: cwid - 1.9, h: 0.52, color: "muted" });
      });
    });
  }

  // 8. OPERATING MODEL
  {
    const s = deck.content("CONTENT_LIGHT", "THE OPERATING MODEL", "How every fixture runs",
      "FIF approves and reviews; AToure does the work. Nothing is published without FIF's approval, and FIF receives a full report.");
    const x0 = 2.25, gap = 0.2, colw = (R - x0 - 2 * gap) / 3;
    ["01   BEFORE THE FIXTURE", "02   MATCHDAY", "03   AFTER THE FIXTURE"].forEach((p, i) => {
      const x = x0 + i * (colw + gap);
      s.addShape(i === 0 ? pres.ShapeType.homePlate : pres.ShapeType.chevron, { x, y: 1.95, w: colw + (i < 2 ? 0.14 : 0), h: 0.62, fill: { color: C.ink }, line: { type: "none" }, objectName: "Phase " + (i + 1) });
      T(s, p, { x: x + (i === 0 ? 0.25 : 0.42), y: 1.95, w: colw - 0.6, h: 0.62, fontSize: 12, bold: true, charSpacing: 1, color: "paper", valign: "middle" });
    });
    [{ kind: "client", label: "FIF", y: 2.8, h: 1.35, fill: "client", icons: ["clip", "ticket", "eye"],
      cells: ["Approves the roster and the access zones for the fixture.", "Applies accreditation at every access point, under its own protocol.", "Reviews content before publication and receives the full report."] },
    { kind: "gold", label: "AToure", y: 4.35, h: 1.6, fill: "ink", icons: ["users", "clap", "chartg"],
      cells: ["Proposes and vets every name, clears sponsors with FIF and briefs each creator on FIF's guidelines.", "Escorts talent, enforces zones and protocol, and runs production and logistics.", "Submits content for approval, publishes on schedule and delivers the reach report."] }].forEach((ln) => {
      deck.node(s, M, ln.y + ln.h / 2 - 0.3, 1.45, 0.6, ln.kind, ln.label, 18);
      ln.cells.forEach((txt, i) => {
        const x = x0 + i * (colw + gap);
        deck.card(s, x, ln.y, colw, ln.h, { flat: true, name: ln.label + " cell " + (i + 1) });
        deck.iconCircle(s, ln.icons[i], x + 0.22, ln.y + 0.22, 0.44, ln.fill);
        T(s, txt, { x: x + 0.82, y: ln.y + 0.24, w: colw - 1.02, h: ln.h - 0.4, color: "muted" });
      });
    });
    s.addShape(pres.ShapeType.roundRect, { x: x0, y: 6.2, w: R - x0, h: 0.56, rectRadius: 0.08, fill: { color: C.tint }, line: { type: "none" }, objectName: "Rule band" });
    deck.icon(s, "check", x0 + 0.25, 6.35, 0.26);
    T(s, "Nothing is published without FIF's approval, and every fixture is reported in full.", { x: x0 + 0.65, y: 6.2, w: R - x0 - 0.9, h: 0.56, bold: true, valign: "middle" });
  }

  // 9. GOVERNANCE
  {
    const s = deck.content("CONTENT_LIGHT", "GOVERNANCE", "FIF keeps every control",
      "In every area FIF holds the decision and AToure carries the delivery. No programme brand is signed without FIF's approval, so existing partners are protected.");
    deck.iconCircle(s, "landmark", M, 1.95, 0.9, "ink");
    T(s, "The Federation sets the rules. AToure is accountable for delivering them.", { x: M, y: 3.05, w: 3.35, h: 1.35, fontFace: HEAD, fontSize: 22, lineSpacingMultiple: 1.05 });
    T(s, "Every accredited creator signs a code of conduct, written to FIF's guidelines, before the fixture.", { x: M, y: 4.95, w: 3.35, h: 1.0, color: "muted" });
    const tx = 4.35, tw = R - tx;
    const rows = [
      ["Who is accredited", "Approves every name", "Proposes and vets the roster"],
      ["Access and protocol", "Sets zones and rules", "Enforces them on site"],
      ["Use of FIF's name, crest and players' image", "Sets the guidelines", "Holds every creator to them"],
      ["Content", "Final approval before publication", "Submits, edits and publishes"],
      ["Programme sponsors", "Clears every brand, protecting existing partners", "Sources and contracts them"],
      ["Accreditation", "Issues it, and may withdraw it at any time", "Administers requests"],
      ["Cost and operations", "None", "Funds and runs everything"],
    ];
    deck.table(s, [{ text: "Area", fill: "ink", color: "paper" }, { text: "FIF", fill: "client", color: "ink" }, { text: "AToure", fill: "gold", color: "ink" }], rows,
      { x: tx, y: 1.95, w: tw, colW: [2.45, (tw - 2.45) / 2, (tw - 2.45) / 2], rowH: [0.5, ...rows.map(() => 0.6)], borderHex: "D7E2DA", name: "Responsibility matrix" });
  }

  // 10. COMMERCIAL MODEL
  deck.section("Commercial model");
  {
    const s = deck.content("CONTENT_LIGHT", "THE COMMERCIAL MODEL", "No budget from FIF. Paid only from new value",
      "Three flows: AToure's own programme sponsors, larger FIF sponsorship packages, and a commission on that increase only.");
    deck.node(s, 2.15, 1.95, 2.7, 0.72, "neutral", "Brand partners");
    deck.node(s, M, 3.8, 1.85, 0.85, "client", "FIF", 22);
    deck.node(s, 3.75, 3.8, 2.7, 0.85, "gold", "AToure", 22);
    deck.node(s, 3.75, 5.85, 2.7, 0.72, "neutral", "Creators & production", 16);
    deck.arrow(s, 4.45, 2.67, 4.45, 3.8, { width: 2.5 });
    deck.numCircle(s, 1, 4.62, 3.06, 0.34, { fill: "gold", size: 12 });
    T(s, "programme sponsorship", { x: 5.04, y: 3.04, w: 1.5, h: 0.42, fontSize: 11, color: "muted", valign: "middle" });
    deck.arrow(s, 2.6, 2.67, 1.6, 3.8, { color: "client", width: 2.5 });
    deck.numCircle(s, 2, 1.48, 2.98, 0.34, { fill: "client", size: 12 });
    T(s, "larger sponsorship packages", { x: M, y: 2.72, w: 0.84, h: 0.86, fontSize: 10, color: "muted", align: "right", valign: "middle" });
    deck.arrow(s, 2.45, 4.05, 3.75, 4.05, { color: "muted", width: 1.5 });
    T(s, "accreditation", { x: 2.45, y: 3.77, w: 1.3, h: 0.24, fontSize: 10, color: "muted", align: "center" });
    deck.arrow(s, 3.75, 4.42, 2.45, 4.42, { width: 2, dash: true });
    deck.numCircle(s, 3, 2.93, 4.55, 0.34, { fill: "gold", size: 12 });
    T(s, "commission on the increase only", { x: 2.1, y: 4.94, w: 2.0, h: 0.45, fontSize: 10, color: "muted", align: "center" });
    deck.arrow(s, 4.4, 4.65, 4.4, 5.85, { width: 2 });
    T(s, "talent fees and production, paid by AToure", { x: 4.55, y: 4.95, w: 1.95, h: 0.5, fontSize: 10, color: "muted" });
    const rx = 7.05, rw = R - rx;
    [[1, "gold", "AToure brings its own sponsors", "Brands sponsor the creator programme directly with AToure, which carries the cost and the risk. Each brand is cleared with FIF first."],
      [2, "client", "FIF's packages grow", "Creator and media content becomes official inventory that FIF can include in its own sponsorship packages."],
      [3, "gold", "Commission on the increase only", "AToure receives a share of the additional revenue it helps FIF secure. Existing contracts and budgets are never touched."]].forEach(([n, f, h, b], i) => {
      const y = 1.95 + i * 1.25;
      deck.numCircle(s, n, rx, y, 0.45, { fill: f, size: 14 });
      T(s, h, { x: rx + 0.65, y: y + 0.02, w: rw - 0.65, h: 0.4, fontFace: HEAD, fontSize: 19 });
      T(s, b, { x: rx + 0.65, y: y + 0.42, w: rw - 0.65, h: 0.78, color: "muted" });
    });
    s.addShape(pres.ShapeType.roundRect, { x: rx, y: 5.78, w: rw, h: 1.0, rectRadius: 0.1, fill: { color: C.ink }, line: { type: "none" }, objectName: "Cost callout" });
    deck.kicker(s, "COST TO FIF", rx + 0.35, 5.93, 2.2, "gold");
    T(s, "0 FCFA", { x: rx + 0.35, y: 6.17, w: 2.4, h: 0.5, fontSize: 30, color: "paper" });
    T(s, "No fee. No budget allocation. Accreditation only.", { x: rx + 2.75, y: 5.78, w: rw - 3.0, h: 1.0, color: "tint", valign: "middle" });
  }

  // 11. GAINS (split dark)
  {
    const s = deck.content("SPLIT_DARK", "THE RETURN FOR FIF", "What the Federation gains",
      "Six concrete returns for a single act of accreditation.");
    const p = deck.photo(s, "gains", { x: 0, y: 0, h: H, alt: "IShowSpeed in traditional dress and the Éléphants shirt, Abidjan" });
    await deck.fadeImage(s, "rtl", p.w - 1.3, 0, 1.32, H);
    deck.chip(s, "Abidjan, during IShowSpeed's visit", 0.3, 6.88);
    const x0 = 6.25, colw = (R - x0 - 0.35) / 2;
    [["g_shield", "Governance", "Control over who is accredited and what is published."],
      ["g_cam", "Official content", "Arrivals, training and matchday content for FIF's channels."],
      ["g_globe", "International visibility", "Global names and personalities alongside the Éléphants."],
      ["g_trend", "New sponsorship inventory", "Creator content FIF can sell inside its own packages."],
      ["g_chart", "Reporting", "A reach and audience report after every fixture."],
      ["g_hand", "Partner protection", "Every programme brand cleared against FIF's partners."]].forEach(([ic, h, b], i) => {
      const x = x0 + (i % 2) * (colw + 0.35), y = 1.95 + Math.floor(i / 2) * 1.6;
      deck.iconCircle(s, ic, x, y, 0.5, "gold");
      T(s, h, { x, y: y + 0.62, w: colw, h: 0.36, fontFace: HEAD, fontSize: 18, color: "paper" });
      T(s, b, { x, y: y + 0.98, w: colw, h: 0.55, color: "tint" });
    });
  }

  // 12. ROADMAP
  deck.section("Next steps");
  {
    const s = deck.content("CONTENT_LIGHT", "THE ROADMAP", "Start with one fixture. Build to 2028",
      "The commitment is gradual and FIF controls the pace.");
    T(s, "Each phase begins only after FIF has reviewed the one before it.", { x: M, y: 1.68, w: CW, h: 0.4, fontSize: 15, color: "muted" });
    const cw = (CW - 3 * 0.25) / 4, ly = 2.95;
    deck.line(s, 1.1, ly, R - 0.5 - 1.1, 0, { width: 2 });
    [["FIRST FIXTURE", "Pilot fixture", "One official fixture, agreed passes, full governance and a full report to FIF."],
      ["THE SEASON", "Season programme", "Extended to the season's fixtures once FIF has reviewed the pilot."],
      ["2027 TO 2028", "Partnership to 2028", "A multi year programme across AFCON and FIF's fixtures and events, with international names alongside the Federation."],
      ["LATER", "Later phase", "Structured player content and commercial activation. A separate conversation."]].forEach(([when, h, b], i) => {
      const x = M + i * (cw + 0.25), cx = x + cw / 2, later = i === 3;
      T(s, when, { x, y: 2.25, w: cw, h: 0.28, fontSize: 11, bold: true, charSpacing: 2, color: "label", align: "center" });
      deck.numCircle(s, "0" + (i + 1), cx - 0.3, ly - 0.3, 0.6, later ? { fill: "canvas", line: "muted", dash: true, color: "muted", size: 14 } : { fill: "ink", color: "paper", size: 14 });
      if (i < 3) {
        const mx = cx + (cw + 0.25) / 2;
        s.addShape(pres.ShapeType.diamond, { x: mx - 0.11, y: ly - 0.11, w: 0.22, h: 0.22, fill: { color: C.client }, line: { type: "none" } });
        T(s, "FIF review", { x: mx - 0.6, y: ly + 0.17, w: 1.2, h: 0.25, fontSize: 10, italic: true, color: "muted", align: "center" });
      }
      deck.card(s, x, 3.55, cw, 2.25, later ? { fill: "canvas", dash: true, flat: true, name: "Phase card 4" } : { name: "Phase card " + (i + 1) });
      T(s, h, { x: x + 0.25, y: 3.8, w: cw - 0.5, h: 0.45, fontFace: HEAD, fontSize: 21, color: later ? "muted" : "ink" });
      T(s, b, { x: x + 0.25, y: 4.35, w: cw - 0.5, h: 1.4, color: "muted" });
    });
    s.addShape(pres.ShapeType.roundRect, { x: M, y: 6.1, w: CW, h: 0.62, rectRadius: 0.08, fill: { color: C.ink }, line: { type: "none" }, objectName: "Commitment band" });
    T(s, "At every phase, FIF commits accreditation only, and decides whether the next phase goes ahead.", { x: M + 0.35, y: 6.1, w: CW - 0.7, h: 0.62, fontSize: 15, color: "paper", valign: "middle" });
  }

  // 13. CLOSING
  {
    const s = deck.content("CLOSING", "NEXT STEPS", "Three steps to the first accredited fixture",
      "Close on the decision: a meeting, a memorandum of understanding, then the first fixture.");
    const p = deck.photo(s, "closing", { x: R - 6.2, y: 0.95, w: 6.2, alt: "IShowSpeed above a crowd in Abidjan" });
    deck.chip(s, "Abidjan, Côte d'Ivoire", p.x + 0.15, p.y + p.h - 0.47);
    T(s, "The creators are coming. FIF decides the terms.", { x: p.x, y: p.y + p.h + 0.3, w: p.w, h: 0.5, fontFace: HEAD, fontSize: 22, italic: true, color: "highlight" });
    [["Meet to agree the scope", "Pilot fixture, number of passes and access zones."],
      ["Sign a memorandum of understanding", "Governance terms and code of conduct, as set by FIF."],
      ["Deliver the first fixture", "Run in full by AToure and reported to FIF."]].forEach(([h, b], i) => {
      const y = 2.4 + i * 1.05;
      deck.numCircle(s, i + 1, M, y, 0.5, { line: "gold", color: "gold", size: 14 });
      T(s, h, { x: M + 0.7, y: y + 0.01, w: 4.75, h: 0.36, fontFace: HEAD, fontSize: 19, color: "paper" });
      T(s, b, { x: M + 0.7, y: y + 0.4, w: 4.75, h: 0.5, color: "tint" });
    });
    deck.logo(s, "dark", M, 5.75, 2.8);
    T(s, "Baba Toure, Director", { x: M, y: 6.35, w: 5.5, h: 0.3, bold: true, color: "paper" });
    T(s, "baba@atoureconsulting.com  ·  +44 7456 728616", { x: M, y: 6.7, w: 5.5, h: 0.3, fontSize: 13, color: "highlight" });
  }

  await deck.save(out);
  console.log("written", out);
})().catch((e) => { console.error(e); process.exit(1); });
