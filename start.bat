@echo off
cd /d "%~dp0"
echo.
echo  Raiz - Aprende sin senal
echo  Iniciando servidor en http://localhost:4173 ...
echo.
start "" cmd /c "timeout /t 2 >nul & start http://localhost:4173"
node server.js
pause
