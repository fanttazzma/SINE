#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
npm run build
rm -f dist/SINE-offline.zip
(cd dist && zip -qr SINE-offline.zip sine)
echo "Listo: dist/SINE.html y dist/SINE-offline.zip"
