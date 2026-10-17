#!/usr/bin/env bash
# Render a deck for visual QA: PDF, one JPEG per slide, an overview sheet, validation and a
# font check. The PDF it produces is the one to send to the client.
#
#   bash render.sh Deck.pptx [out_dir] [dpi]
#
# LibreOffice is run on a copy in a fresh /tmp folder: converting straight from some session
# folders fails with "source file could not be loaded".
set -euo pipefail
DECK="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
OUT="${2:-$(dirname "$DECK")/render}"
DPI="${3:-110}"
HERE="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$OUT"
rm -f "$OUT"/slide-*.jpg "$OUT"/deck.pdf "$OUT"/overview.jpg

TMP="$(mktemp -d /tmp/atoure-render.XXXXXX)"
cp "$DECK" "$TMP/deck.pptx"
SOFF="$(find "$HOME/.claude" /root/.claude -path '*/pptx/scripts/office/soffice.py' 2>/dev/null | head -1 || true)"
if [ -n "$SOFF" ]; then
  (cd "$TMP" && timeout 300 python3 "$SOFF" --headless --convert-to pdf deck.pptx >/dev/null 2>&1) || true
else
  (cd "$TMP" && SAL_USE_VCLPLUGIN=svp timeout 300 soffice "-env:UserInstallation=file://$TMP/profile" --headless --convert-to pdf deck.pptx >/dev/null 2>&1) || true
fi
if [ ! -s "$TMP/deck.pdf" ]; then
  echo "ERROR: LibreOffice produced no PDF. Check that soffice is installed and try again." >&2
  exit 1
fi
cp "$TMP/deck.pdf" "$OUT/deck.pdf"
pdftoppm -jpeg -r "$DPI" "$OUT/deck.pdf" "$OUT/slide"
python3 "$HERE/contact_sheet.py" --cols 3 --cell 620 "$OUT/overview.jpg" "$OUT"/slide-*.jpg >/dev/null
rm -rf "$TMP"

echo "== validation"
VAL="$(find "$HOME/.claude" /root/.claude -path '*/pptx/scripts/office/validate.py' 2>/dev/null | head -1 || true)"
if [ -n "$VAL" ]; then python3 "$VAL" "$DECK" | tail -3; else echo "pptx skill validate.py not found: skipped"; fi

echo "== fonts embedded in the PDF"
FONTS="$(pdffonts "$OUT/deck.pdf" | awk 'NR>2{print $1}' | sed 's/^[A-Z]*+//' | sort -u)"
echo "$FONTS" | tr '\n' ' '; echo
if echo "$FONTS" | grep -qiE 'liberation|dejavu|carlito|caladea'; then
  echo "WARNING: fallback fonts in the PDF. Run setup.sh to install the brand fonts, then render again."
fi

echo "== output"
echo "pdf:      $OUT/deck.pdf"
echo "overview: $OUT/overview.jpg"
ls -1 "$OUT"/slide-*.jpg
