"""Make a second language version of a deck from its build script.

    python3 translate.py extract build.js strings.json
    python3 translate.py apply build.js fr.json build-fr.js --lang fr-FR

extract lists every quoted string in the build script that looks like copy (titles, body text,
labels, speaker notes, alt text, file names) into strings.json, one key per string with an empty
value. Fill the values with the translation and save it as fr.json; keep each key exactly as
extracted, including any backslash n. Strings left empty stay in the source language, which is
right for code values such as layout or shape names.

apply writes build-fr.js with every translated string swapped in, then:
  * with --lang, replaces the "en-GB" language tag (pass lang: "en-GB" to createDeck) so the
    spellchecker treats the text as the new language;
  * for French (--lang fr-...), adds a non breaking space before : and ; and between a figure
    and its unit (6,1 Md, 97,3 M), as French typography requires.
It reports copy that has no translation, so nothing ships half translated. Then run the new
build, render it and look at every slide: translations run longer, and lines that overflow are
shortened in the map, never in the source.
"""
import argparse, json, re, sys

NB = " "
LITERAL = re.compile(r'"((?:[^"\\]|\\.)*)"')
CAPS_WORD = re.compile(r"^[A-ZÀ-Ý']{3,}$")  # kicker words such as TODAY are copy


def literals(src):
    out, seen = [], set()
    for m in LITERAL.finditer(src):
        t = m.group(1)
        if t in seen or len(t) < 2 or t.startswith(("Lu", "image/", "+mj")) or re.fullmatch(r"[0-9A-Fa-f]{6}", t):
            continue
        looks_copy = (" " in t or "\\n" in t or CAPS_WORD.match(t) or re.search(r"[À-ÿ]", t)
                      or (t[:1].isupper() and t[1:].islower()) or t.endswith(".pptx"))
        if looks_copy:
            seen.add(t)
            out.append(t)
    return out


def fr_typo(t):
    t = t.replace(" :", NB + ":").replace(" ;", NB + ";")
    return re.sub(r"(\d) (Md|M|k)\b", lambda m: m.group(1) + NB + m.group(2), t)


ap = argparse.ArgumentParser()
sub = ap.add_subparsers(dest="cmd", required=True)
e = sub.add_parser("extract"); e.add_argument("build"); e.add_argument("out")
p = sub.add_parser("apply"); p.add_argument("build"); p.add_argument("map"); p.add_argument("out"); p.add_argument("--lang")
a = ap.parse_args()
src = open(a.build, encoding="utf8").read()

if a.cmd == "extract":
    L = literals(src)
    json.dump({t: "" for t in L}, open(a.out, "w", encoding="utf8"), indent=1, ensure_ascii=False)
    print(f"{len(L)} strings -> {a.out}")
    sys.exit(0)

tr = {k: v for k, v in json.load(open(a.map, encoding="utf8")).items() if v}
french = bool(a.lang and a.lang.lower().startswith("fr"))
original = literals(src)
unused = []
for en in sorted(tr, key=len, reverse=True):
    q = '"' + en + '"'
    if q not in src:
        unused.append(en)
        continue
    src = src.replace(q, '"' + (fr_typo(tr[en]) if french else tr[en]) + '"')
if a.lang:
    src = src.replace('"en-GB"', '"' + a.lang + '"')
open(a.out, "w", encoding="utf8").write(src)
left = [t for t in original if t not in tr and " " in t]
print(f"wrote {a.out}: {len(tr) - len(unused)} strings translated")
if unused:
    print("in the map but not in the build (stale?):\n  " + "\n  ".join(unused[:15]))
if left:
    print("copy with no translation (fine if it is a name or an internal label):\n  " + "\n  ".join(left[:40]))
