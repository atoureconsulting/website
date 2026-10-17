"""Render a review card for a deck theme, to show the client before applying it.

    python3 theme_card.py theme.json out.png

theme.json uses the role format of assets/themes/*.json. The card shows a mini cover on the
theme's dark colour (title, client and AToure nodes, a stat tile) and every role swatch with
its hex and use, plus the font pairing.
"""
import json, os, sys
from PIL import Image, ImageDraw, ImageFont

FONTS = os.path.join(os.path.dirname(__file__), "..", "assets", "fonts")
def f(name, size): return ImageFont.truetype(os.path.join(FONTS, name), size)
HEAD, BODY, BODY_B, BODY_I = "CormorantGaramond-600.ttf", "Jost-400.ttf", "Jost-600.ttf", "Jost-400Italic.ttf"

theme = json.load(open(sys.argv[1], encoding="utf8"))
out = sys.argv[2]
r = {k: "#" + (v["hex"] if isinstance(v, dict) else v).lstrip("#") for k, v in theme["roles"].items()}
meta = {k: v for k, v in theme["roles"].items() if isinstance(v, dict)}

W, H = 1800, 1150
im = Image.new("RGB", (W, H), r["canvas"])
d = ImageDraw.Draw(im)
d.rectangle((0, 0, 720, H), fill=r["ink"])

def wrap(text, font, width):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if d.textlength(t, font=font) <= width: cur = t
        else: lines.append(cur); cur = w
    return lines + [cur] if cur else lines

d.text((70, 80), "THEME", font=f("Jost-700.ttf", 22), fill=r["gold"])
d.text((70, 125), theme["name"], font=f(HEAD, 84), fill=r["paper"])
y = 250
for line in wrap(theme.get("description", ""), f(BODY, 27), 580):
    d.text((70, y), line, font=f(BODY, 27), fill=r["tint"]); y += 40

def node(x, y, w, h, fill, txt):
    d.rounded_rectangle((x, y, x + w, y + h), radius=14, fill=fill)
    fn = f(HEAD, 34); tw = d.textlength(txt, font=fn)
    d.text((x + (w - tw) / 2, y + h / 2 - 22), txt, font=fn, fill=r["ink"])
node(70, 500, 260, 90, r["client"], "Client")
node(390, 500, 260, 90, r["gold"], "AToure")
d.line((330, 545, 382, 545), fill=r["paper"], width=4); d.polygon([(390, 545), (376, 536), (376, 554)], fill=r["paper"])
d.rounded_rectangle((70, 630, 650, 790), radius=14, fill=r["panel"])
d.text((100, 652), "97.3M", font=f(BODY, 64), fill=r["highlight"])
d.text((100, 735), "Example figure on a dark tile", font=f(BODY, 24), fill=r["tint"])
d.text((70, 850), "Headline in the", font=f(HEAD, 60), fill=r["paper"])
d.text((70, 918), "heading font", font=f(HEAD, 60), fill=r["paper"])
d.text((70, 1060), "Cover and dark slides", font=f(BODY_I, 22), fill=r["gold"])

x0, y0 = 790, 60
d.text((x0, y0), "PALETTE", font=f("Jost-700.ttf", 22), fill=r["label"])
for i, role in enumerate(["ink", "canvas", "paper", "client", "gold", "label", "muted", "highlight", "tint", "panel"]):
    yy = y0 + 45 + i * 80
    d.rounded_rectangle((x0, yy, x0 + 110, yy + 62), radius=12, fill=r[role], outline="#C9C9C9", width=2)
    m = meta.get(role, {})
    d.text((x0 + 135, yy + 2), f"{m.get('label', role)}  ({role})", font=f(BODY_B, 26), fill=r["ink"])
    d.text((x0 + 135, yy + 36), f"{r[role].upper()}   {m.get('use', '')}"[:78], font=f(BODY, 21), fill=r["muted"])
yy = y0 + 45 + 10 * 80 + 15
d.text((x0, yy), "TYPOGRAPHY", font=f("Jost-700.ttf", 22), fill=r["label"])
d.text((x0, yy + 38), theme.get("headFontFace", "Cormorant Garamond SemiBold"), font=f(HEAD, 42), fill=r["ink"])
d.text((x0, yy + 95), f"{theme.get('bodyFontFace', 'Jost')} for body text and figures: 0 FCFA, 1.57B", font=f(BODY, 26), fill=r["ink"])
im.save(out)
print(out)
