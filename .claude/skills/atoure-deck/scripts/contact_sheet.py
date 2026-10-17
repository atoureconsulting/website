"""Labelled contact sheet of images, for choosing photos or reviewing rendered slides.

    python3 contact_sheet.py [--cols 6] [--cell 300] out.jpg img1 img2 ...

Each thumbnail keeps its aspect ratio and is labelled with its index and pixel size, so you
can see at a glance which photos are portrait, landscape or too small to use large.
"""
import argparse
from PIL import Image, ImageDraw, ImageOps

ap = argparse.ArgumentParser()
ap.add_argument("--cols", type=int, default=6)
ap.add_argument("--cell", type=int, default=300)
ap.add_argument("out")
ap.add_argument("files", nargs="+")
a = ap.parse_args()

pad = 24
rows = (len(a.files) + a.cols - 1) // a.cols
sheet = Image.new("RGB", (a.cols * a.cell, rows * (a.cell + pad)), "white")
d = ImageDraw.Draw(sheet)
for i, f in enumerate(a.files):
    x0, y0 = (i % a.cols) * a.cell, (i // a.cols) * (a.cell + pad)
    try:
        im = ImageOps.exif_transpose(Image.open(f))
        w, h = im.size
        im.thumbnail((a.cell - 8, a.cell - 8))
        sheet.paste(im.convert("RGB"), (x0 + (a.cell - im.width) // 2, y0 + (a.cell - im.height) // 2))
        label = f"{i}: {w}x{h}"
    except Exception:
        label = f"{i}: unreadable"
    d.text((x0 + 6, y0 + a.cell + 4), label, fill="black")
sheet.save(a.out, quality=85)
for i, f in enumerate(a.files):
    print(i, f)
