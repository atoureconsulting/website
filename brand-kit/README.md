# AToure — Brand Kit

Everything a designer or garment manufacturer needs to produce AToure and Race
Weekend merchandise: logos, typefaces, and colour specifications.

---

## What's in here

```
brand-kit/
├── 01-logos/
│   ├── logo-contact-sheet.png      ← visual index of every logo file
│   ├── atoure/                     ← AToure Management & Consulting
│   └── race-weekend/               ← Race Weekend Abidjan 2026
├── 02-fonts/
│   ├── type-specimen.png           ← what the two faces look like
│   ├── CormorantGaramond-*.ttf     ← 7 weights + italics
│   ├── Jost-*.ttf                  ← 6 weights + italic
│   └── OFL-*.txt                   ← licences (free for commercial use)
└── 03-colours/
    ├── palette.png                 ← visual swatch sheet
    ├── colours.txt                 ← hex / RGB / approx CMYK
    └── atoure-palette.ase          ← Adobe swatch file (Illustrator/Photoshop)
```

---

## Logos

### AToure

| File | Use |
|---|---|
| `atoure-monogram.svg` | **Preferred for garments.** Vector, scales to any size. |
| `atoure-monogram-tight-crop.png` | Highest-resolution raster monogram (306×420). |
| `atoure-monogram-black.png` / `-white.png` | Single-colour, for screen print and embroidery. |
| `atoure-lockup-horizontal-gold.png` | Full lockup — monogram plus wordmark. |
| `atoure-lockup-horizontal-black.png` / `-white.png` | Single-colour lockup. |
| `atoure-icon-on-black.png` | Gold monogram on a black tile — for labels and badges. |

The monogram is the primary mark. It works best on chest, cap fronts, sleeves and
anywhere the lockup would be too wide to read.

### Race Weekend

| File | Use |
|---|---|
| `race-weekend-lockup.svg` | **Preferred.** Vector, scales cleanly. |
| `race-weekend-lockup-black.png` / `-white.png` | 2814×1421 transparent raster. |

The Race Weekend mark carries an intentional distressed texture. Keep it — it is
part of the design. See the production notes below if you're embroidering it.

---

## Colours

Full values are in `03-colours/colours.txt`. The essentials:

| | Hex | RGB |
|---|---|---|
| **AToure Gold** | `#C8A951` | 200, 169, 81 |
| **AToure Black** | `#0D0C0A` | 13, 12, 10 |
| **AToure Cream** | `#FAF6EE` | 250, 246, 238 |
| **Race Weekend Red** | `#D30F1F` | 211, 15, 31 |

The black is deliberately warm — it is not pure black, and it should not be
substituted for one. The same applies to the cream, which carries a warm cast
rather than being white.

The CMYK values in `colours.txt` are a straight mathematical conversion and are
**not press-ready**. Match to the hex/RGB values, or agree a Pantone equivalent
for the gold with your printer before production.

---

## Fonts

**Cormorant Garamond** — display and headline face. All large type.
**Jost** — supporting face. Body copy, labels, small caps.

Both are licensed under the SIL Open Font Licence, which permits commercial use
including on merchandise. The licence text is included; no purchase is required.

---

## Production notes

**Gold on garments.** The brand gold is a mid-tone and can read muddy on black
fabric. `AToure Gold Light` (`#E0C47A`) is the intended alternative where the
primary is too dark — check a physical sample before committing to a run.

**Embroidery.** The monogram has fine serifs and a hairline counter that will
close up below roughly 40 mm wide. Above that it stitches cleanly. The Race
Weekend mark's distressed texture will not survive embroidery at any size — for
stitched applications, ask for a solid-fill version of that logo.

**Single colour.** Black and white versions are supplied for every mark so you
never need to knock a colour out of a gold file.

---

## Known limitations — please read

These are honest constraints in the source material, not things to work around
silently:

1. **The AToure vector is a trace, not an original.** `atoure-monogram.svg` was
   traced from a 306×420 PNG because no vector original exists in the company's
   files. It is clean and scales, but if the original Illustrator or EPS file can
   be recovered from whoever designed the identity, use that instead.

2. **There is no usable vector for the horizontal lockup.** The
   "MANAGEMENT & CONSULTING" line is hairline-thin, and at the source resolution
   it does not trace cleanly. For large-format work, either obtain the original
   file, or re-set that line in Cormorant Garamond — the face is supplied here and
   is a very close match to the original wordmark.

3. **The gold is not consistent across the supplied files.** Three different
   values are in circulation:
   - `#C8A951` — the website's stated brand gold (**recommended as canonical**)
   - `#CFAA5C` — the actual gold in `atoure-monogram-gold.png` and the lockup
   - `#B28B3C` — the darker gold in `atoure-monogram-tight-crop.png`

   Standardise on one before production. `#C8A951` is the value used across the
   website and sits between the two artwork variants.

4. **The Race Weekend vector was traced from a PDF.** It reproduces the mark
   faithfully at 314 paths, but the original design file will be cleaner if it
   can be found.

---

## Not included, deliberately

`Media/logos/` in this repository holds client and partner logos — DAZN, Netflix,
MTN, Canal+, Red Bull and others. Those are third-party trademarks. They are not
part of this kit and must not be applied to merchandise without written
permission from each rights holder.
