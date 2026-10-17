"""House style and photo check for an AToure .pptx.

    python3 check_deck.py Deck.pptx [--forbid REGEX ...] [--json report.json]

Reads every slide, the speaker notes and the file properties, and reports:

  ERROR  hyphens or dashes in copy (AToure copy never uses them)
  ERROR  "agency" / "agence" describing AToure
  ERROR  the company name written any way other than "AToure Management & Consulting"
  ERROR  Baba Toure described as founder
  ERROR  any --forbid pattern (confidential numbers, internal targets, names)
  ERROR  a photo shown at a different aspect ratio from its source (stretched)
  WARN   a photo cropped by more than 2% on any side
  WARN   placeholders such as [Contact details], TODO, TBD
  WARN   reach or impressions without "estimated" or a source on the same slide
  WARN   Yaounde in any market list (Douala was the only Cameroonian market)
  INFO   theme fonts, slide count

Exit status is 1 when there is any ERROR, so it can gate a delivery.
"""
import argparse, html, io, json, re, sys, zipfile
from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument("deck")
ap.add_argument("--forbid", action="append", default=[], help="regex that must not appear anywhere")
ap.add_argument("--json", help="write the findings to this file")
a = ap.parse_args()

z = zipfile.ZipFile(a.deck)
names = z.namelist()
def read(n): return z.read(n).decode("utf8", "replace")
def texts(xml): return [html.unescape(t) for t in re.findall(r"<a:t>([^<]*)</a:t>", xml)]
def num(n): return int(re.search(r"(\d+)", n).group(1))

slides = sorted([n for n in names if re.match(r"ppt/slides/slide\d+\.xml$", n)], key=num)
notes = {num(n): n for n in names if re.match(r"ppt/notesSlides/notesSlide\d+\.xml$", n)}
findings = []
def add(level, where, msg): findings.append({"level": level, "where": where, "message": msg})

DASH = re.compile(r"[‐-―−]")
def hyphen_hits(s):
    hits = []
    for tok in re.split(r"\s+", s):
        if "@" in tok or tok.lower().startswith(("http", "www.")):
            continue
        if "-" in tok or tok == "-":
            hits.append(tok)
    return hits

RULES = [
    ("ERROR", re.compile(r"\bagenc(y|ies)\b(?! fee)|\bagences?\b", re.I), "describes AToure as an agency; it is a management and consulting company"),
    ("ERROR", re.compile(r"AToure\s+Management\s+(and|et|y|e)\s+Consult|AToure\s+(Gestion|Management\s*&\s*Conseil)|Consultor[ií]a|Beratung", re.I), "company name must stay exactly \"AToure Management & Consulting\", untranslated"),
    ("ERROR", re.compile(r"\b(co\s?founder|founder|fondateur|fondatrice)\b", re.I), "Baba Toure is Director, not founder"),
    ("WARN", re.compile(r"\[[^\]]{2,}\]|\bTODO\b|\bTBD\b|lorem ipsum|\bXXX\b", re.I), "placeholder left in the copy"),
    ("WARN", re.compile(r"Yaound", re.I), "Yaounde does not belong in AToure market lists"),
]
FORBID = [re.compile(p, re.I) for p in a.forbid]

def check_text(where, chunks):
    joined = " ".join(chunks)
    for t in chunks:
        if DASH.search(t):
            add("ERROR", where, f"dash character in: \"{t.strip()[:80]}\"")
        for h in hyphen_hits(t):
            add("ERROR", where, f"hyphen in \"{h}\" (from: \"{t.strip()[:60]}\")")
    for level, rx, msg in RULES:
        for m in rx.finditer(joined):
            add(level, where, f"{msg}: \"{m.group(0)}\"")
    for rx in FORBID:
        for m in rx.finditer(joined):
            add("ERROR", where, f"forbidden pattern /{rx.pattern}/ found: \"{m.group(0)}\"")
    return joined

def rels(part):
    rp = part.replace("ppt/slides/", "ppt/slides/_rels/") + ".rels"
    if rp not in names: return {}
    return {m.group(1): m.group(2) for m in re.finditer(r'Id="([^"]+)"[^>]*Target="([^"]+)"', read(rp))}

for i, part in enumerate(slides, 1):
    xml = read(part)
    where = f"slide {i}"
    joined = check_text(where, texts(xml))
    if re.search(r"\b(reach|impressions)\b", joined, re.I) and not re.search(r"estimat|source|report|analytics|verified", joined, re.I):
        add("WARN", where, "reach or impressions shown without \"estimated\" or a cited source")
    if i in notes:
        check_text(f"slide {i} notes", [t for t in texts(read(notes[i])) if not re.fullmatch(r"\d+", t.strip())])
    rmap = rels(part)
    for pic in re.findall(r"<p:pic>.*?</p:pic>", xml, re.S):
        emb = re.search(r'r:embed="([^"]+)"', pic)
        ext = re.search(r"<a:ext cx=\"(\d+)\" cy=\"(\d+)\"", pic)
        name = re.search(r'<p:cNvPr[^>]*name="([^"]*)"', pic)
        if not emb or not ext or emb.group(1) not in rmap: continue
        target = rmap[emb.group(1)].replace("../", "ppt/")
        if target not in names: continue
        try:
            iw, ih = Image.open(io.BytesIO(z.read(target))).size
        except Exception:
            continue
        label = name.group(1) if name else target
        if min(iw, ih) < 8 or label.startswith("Fade"):
            continue  # gradient overlays are stretched on purpose
        crop = {k: int(v) / 100000 for k, v in re.findall(r'\b([ltrb])="(-?\d+)"', (re.search(r"<a:srcRect[^>]*/>", pic) or re.match("", "")).group(0))}
        sw = iw * (1 - crop.get("l", 0) - crop.get("r", 0))
        sh = ih * (1 - crop.get("t", 0) - crop.get("b", 0))
        disp = int(ext.group(1)) / int(ext.group(2))
        if sh > 0 and abs(disp / (sw / sh) - 1) > 0.02:
            add("ERROR", where, f"photo \"{label}\" is stretched: shown at {disp:.2f}, source is {sw / sh:.2f}")
        if any(v > 0.02 for v in crop.values()):
            add("WARN", where, f"photo \"{label}\" is cropped ({', '.join(f'{k}={v:.0%}' for k, v in crop.items() if v > 0.02)}); check nothing important is cut")

core = read("docProps/core.xml") if "docProps/core.xml" in names else ""
core_text = " ".join(html.unescape(t) for t in re.findall(r">([^<]+)<", core))
for rx in FORBID:
    for m in rx.finditer(core_text):
        add("ERROR", "file properties", f"forbidden pattern /{rx.pattern}/ found: \"{m.group(0)}\"")

theme = read("ppt/theme/theme1.xml") if "ppt/theme/theme1.xml" in names else ""
major = re.search(r"<a:majorFont><a:latin typeface=\"([^\"]*)\"", theme)
minor = re.search(r"<a:minorFont><a:latin typeface=\"([^\"]*)\"", theme)
info = {"slides": len(slides), "heading_font": major.group(1) if major else None, "body_font": minor.group(1) if minor else None}

errors = [f for f in findings if f["level"] == "ERROR"]
warns = [f for f in findings if f["level"] == "WARN"]
print(f"{a.deck}\n  {info['slides']} slides  |  heading font: {info['heading_font']}  |  body font: {info['body_font']}")
for f in errors + warns:
    print(f"  {f['level']:5} {f['where']}: {f['message']}")
print(f"  {len(errors)} errors, {len(warns)} warnings")
if a.json:
    json.dump({"info": info, "findings": findings, "errors": len(errors), "warnings": len(warns)}, open(a.json, "w"), indent=1, ensure_ascii=False)
sys.exit(1 if errors else 0)
