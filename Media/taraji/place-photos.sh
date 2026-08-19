#!/usr/bin/env bash
# Copies the six cinema portraits and the concept portrait out of the session
# upload folder and into this directory under the names the page expects.
# Run from the repository root once the files have been attached to the chat.
set -euo pipefail
UP="${1:-/root/.claude/uploads}"
DEST="$(cd "$(dirname "$0")" && pwd)"
declare -a WANT=(
  "akissi:cinema-akissi-delta.jpg"
  "naky:cinema-naky-sy-savane.jpg"
  "lacote:cinema-philippe-lacote.jpg"
  "gohou:cinema-michel-gohou.jpg"
  "diem:cinema-diem-camille.jpg"
  "toure:cinema-fat-toure.jpg"
  "concept:taraji-concept.jpg"
)
for pair in "${WANT[@]}"; do
  key="${pair%%:*}"; out="${pair##*:}"
  src="$(find "$UP" -type f -iname "*${key}*" \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.webp' \) 2>/dev/null | head -1)"
  if [ -n "$src" ]; then cp "$src" "$DEST/$out"; echo "placed $out"; else echo "missing $out (no upload matching '$key')"; fi
done
