"""Find faces in a set of photos and offer them as round headshots the user can pick from.

    python3 headshots.py find --prefix S --title "Headshot: pick one" --top 8 sheet.jpg photo1.jpg ...
    python3 headshots.py export sheet.json S6 head.png

find: detects the largest faces (OpenCV 4 Haar cascade), crops a circle around each, and writes a
numbered sheet plus sheet.json (code -> source file and face box). Several faces in the list will
belong to other people; look at the sheet and keep only the creator's (pass --keep 3 7 12 to
renumber a curated set, using the indexes printed by a first run).
export: cuts the chosen code as a 600 px round PNG from the largest file with the same base name
(a .JPG original beside a .webp preview, for example), so the headshot stays sharp.

Needs: python3 -m pip install "opencv-python-headless<5" (OpenCV 5 dropped the cascades).
"""
import argparse, glob, json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HERE, "..", "assets", "fonts")
THUMB = 1400  # face boxes are measured on the photo scaled to this long edge

def open_thumb(f):
    im = ImageOps.exif_transpose(Image.open(f)).convert("RGB"); im.thumbnail((THUMB, THUMB)); return im

def circle(im, box, size, k=1.0):
    x, y, w, h = [v * k for v in box]
    cx, cy, side = x + w / 2, y + h * 0.52, w * 2.3
    sq = im.crop((int(cx - side / 2), int(cy - side / 2), int(cx + side / 2), int(cy + side / 2))).resize((size, size), Image.LANCZOS)
    m = Image.new("L", (size * 4, size * 4), 0); ImageDraw.Draw(m).ellipse((0, 0, size * 4 - 1, size * 4 - 1), fill=255)
    o = Image.new("RGBA", (size, size)); o.paste(sq, (0, 0), m.resize((size, size), Image.LANCZOS)); return o

def find(a):
    import cv2
    casc = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    found = []
    for f in a.files:
        try: im = open_thumb(f)
        except Exception: continue
        g = cv2.cvtColor(np.array(im), cv2.COLOR_RGB2GRAY)
        for (x, y, w, h) in casc.detectMultiScale(g, 1.1, 6, minSize=(50, 50)):
            if w / im.size[0] >= a.min_face: found.append([float(w / im.size[0]), f, [int(x), int(y), int(w), int(h)]])
    found.sort(reverse=True)
    for i, (_, f, _b) in enumerate(found): print(i, os.path.basename(f))
    pick = [found[i] for i in a.keep] if a.keep else found[: a.top]
    big = ImageFont.truetype(os.path.join(FONTS, "Jost-600.ttf"), 34)
    cols, cell = 4, 420
    rows = (len(pick) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * (cell + 40) + 40, rows * (cell + 80) + 110), (251, 247, 239))
    d = ImageDraw.Draw(sheet); d.text((40, 30), a.title, font=big, fill=(10, 42, 31))
    codes = {}
    for i, (_, f, box) in enumerate(pick):
        x, y = 40 + (i % cols) * (cell + 40), 100 + (i // cols) * (cell + 80)
        c = circle(open_thumb(f), box, cell); sheet.paste(c, (x, y), c)
        code = f"{a.prefix}{i + 1}"; codes[code] = {"file": os.path.abspath(f), "box": box}
        d.text((x, y + cell + 8), code, font=big, fill=(0, 122, 77))
    sheet.save(a.out, quality=90)
    json.dump(codes, open(os.path.splitext(a.out)[0] + ".json", "w"), indent=1)
    print("sheet:", a.out)

def export(a):
    codes = json.load(open(a.sheet_json)); c = codes[a.code]; f = c["file"]
    base = os.path.splitext(f)[0]
    sources = [g for g in glob.glob(glob.escape(base) + ".*") if g.lower().endswith((".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"))]
    full = max(sources or [f], key=lambda g: Image.open(g).size[0])
    im = ImageOps.exif_transpose(Image.open(full)).convert("RGB")
    k = im.size[0] / open_thumb(f).size[0]
    circle(im, c["box"], a.size, k).save(a.out)
    print(a.code, "->", a.out, "from", os.path.basename(full))

ap = argparse.ArgumentParser(); sub = ap.add_subparsers(dest="cmd", required=True)
p = sub.add_parser("find"); p.add_argument("--prefix", default="H"); p.add_argument("--title", default="Headshot: pick one")
p.add_argument("--top", type=int, default=8); p.add_argument("--keep", type=int, nargs="*"); p.add_argument("--min-face", type=float, default=0.08)
p.add_argument("out"); p.add_argument("files", nargs="+")
e = sub.add_parser("export"); e.add_argument("sheet_json"); e.add_argument("code"); e.add_argument("out"); e.add_argument("--size", type=int, default=600)
a = ap.parse_args()
find(a) if a.cmd == "find" else export(a)
