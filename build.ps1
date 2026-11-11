# Construye el HTML único y la carpeta portable.
# Requiere Node.js y esbuild (npm install).
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
npm run build
$zip = Join-Path $PSScriptRoot 'dist\SINE-offline.zip'
if (Test-Path $zip) { Remove-Item $zip -Force }
Compress-Archive -Path (Join-Path $PSScriptRoot 'dist\sine\*') -DestinationPath $zip -CompressionLevel Optimal
Write-Host "Listo: dist\SINE.html y dist\SINE-offline.zip"
