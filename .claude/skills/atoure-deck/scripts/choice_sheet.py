"""Numbered choice sheet: show the user a set of photos and let them pick by code.

    python3 choice_sheet.py --prefix T --title "Tour photo: pick one" out.jpg photo1.jpg photo2.jpg ...
    python3 choice_sheet.py --prefix T --captions "Benin" "Ghana" ... out.jpg ...

Each photo is shown whole (never cropped) with a large code under it (T1, T2, ...), so the user
can answer "T2" in chat. Writes out.json next to the sheet mapping each code to its file, so the
pick can be resolved without guessing. For headshots use headshots.py instead.
"""
import argparse, json, os
from PIL import Image, ImageDraw, ImageFont, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HERE, "..", "assets", "fonts")
ap = argparse.ArgumentParser()
ap.add_argument("--prefix", default="P")
ap.add_argument("--title", default="Pick one")
ap.add_argument("--cols", type=int, default=3)
ap.add_argument("--cell", type=int, default=560, help="width of each photo cell in pixels")
ap.add_argument("--captions", nargs="*", default=[])
ap.add_argument("out")
ap.add_argument("files", nargs="+")
a = ap.parse_args()

big = ImageFont.truetype(os.path.join(FONTS, "Jost-600.ttf"), 34)
small = ImageFont.truetype(os.path.join(FONTS, "Jost-400.ttf"), 20)
ch = int(a.cell * 2 / 3)
rows = (len(a.files) + a.cols - 1) // a.cols
sheet = Image.new("RGB", (a.cols * (a.cell + 40) + 40, rows * (ch + 80) + 110), (251, 247, 239))
d = ImageDraw.Draw(sheet)
d.text((40, 30), a.title, font=big, fill=(10, 42, 31))
codes = {}
for i, f in enumerate(a.files):
    x, y = 40 + (i % a.cols) * (a.cell + 40), 100 + (i // a.cols) * (ch + 80)
    im = ImageOps.exif_transpose(Image.open(f)).convert("RGB")
    im.thumbnail((a.cell, ch))
    sheet.paste(im, (x, y))
    code = f"{a.prefix}{i + 1}"; codes[code] = os.path.abspath(f)
    d.text((x, y + ch + 8), code, font=big, fill=(0, 122, 77))
    cap = a.captions[i] if i < len(a.captions) else os.path.basename(f)
    d.text((x + 34 * len(code) // 1.6 + 30, y + ch + 20), cap, font=small, fill=(79, 97, 88))
sheet.save(a.out, quality=90)
json.dump(codes, open(os.path.splitext(a.out)[0] + ".json", "w"), indent=1)
print(json.dumps(codes, indent=1))
