#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
npm run build
rm -f dist/Raiz-offline.zip
(cd dist && zip -qr Raiz-offline.zip raiz)
echo "Listo: dist/Raiz.html y dist/Raiz-offline.zip"
