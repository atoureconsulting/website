#!/usr/bin/env python3
"""Decode a base64 payload fetched from Google Drive into an image file here.

Usage:  python3 fetch-from-drive.py <output-name.jpg> <path-to-base64-text>
The base64 comes from the Drive connector's download_file_content response.
"""
import base64, sys, pathlib
if len(sys.argv) != 3:
    sys.exit(__doc__)
out = pathlib.Path(__file__).parent / sys.argv[1]
raw = pathlib.Path(sys.argv[2]).read_text().strip()
if ',' in raw[:120] and raw[:5] == 'data:':
    raw = raw.split(',', 1)[1]
out.write_bytes(base64.b64decode(raw))
print(f"wrote {out} ({out.stat().st_size} bytes)")
