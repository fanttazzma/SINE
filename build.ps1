# Construye el HTML único y la carpeta portable.
# Requiere Node.js y esbuild (npm install).
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
npm run build
$zip = Join-Path $PSScriptRoot 'dist\Raiz-offline.zip'
if (Test-Path $zip) { Remove-Item $zip -Force }
Compress-Archive -Path (Join-Path $PSScriptRoot 'dist\raiz\*') -DestinationPath $zip -CompressionLevel Optimal
Write-Host "Listo: dist\Raiz.html y dist\Raiz-offline.zip"
