#!/usr/bin/env bash
# One time setup per session: node modules in a work folder, Python QA tools, OpenCV and the brand
# fonts (so LibreOffice renders and embeds Cormorant Garamond and Jost in the PDF).
#
#   bash setup.sh /path/to/work-folder
#   export NODE_PATH=/path/to/work-folder/node_modules
set -euo pipefail
WORK="${1:?usage: setup.sh work-folder}"
HERE="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$WORK"
cd "$WORK"
[ -f package.json ] || npm init -y >/dev/null 2>&1
if ! node -e "require('pptxgenjs');require('sharp');require('react');require('react-dom/server');require('react-icons/lu')" >/dev/null 2>&1; then
  npm install --silent pptxgenjs sharp react react-dom react-icons >/dev/null 2>&1
fi
python3 -c "import PIL, defusedxml, lxml" >/dev/null 2>&1 || python3 -m pip install -q Pillow defusedxml lxml >/dev/null 2>&1
command -v markitdown >/dev/null 2>&1 || python3 -m pip install -q "markitdown[pptx]" >/dev/null 2>&1 || true
# face detection for headshots.py; OpenCV 5 dropped the Haar cascades, so pin 4.x
python3 -c "import cv2; cv2.CascadeClassifier" >/dev/null 2>&1 || python3 -m pip install -q "opencv-python-headless<5" >/dev/null 2>&1 || true

FD=/usr/share/fonts/truetype/atoure
mkdir -p "$FD" 2>/dev/null || { FD="$HOME/.fonts"; mkdir -p "$FD"; }
cp "$HERE/../assets/fonts/"*.ttf "$FD/"
fc-cache -f >/dev/null 2>&1 || true
fc-match "Cormorant Garamond SemiBold" | grep -qi cormorant && echo "fonts: ok" || echo "fonts: NOT installed, PDFs will fall back"
echo "export NODE_PATH=$WORK/node_modules"
