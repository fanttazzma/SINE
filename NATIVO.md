# Versiones nativas

Además de la PWA, Raíz se empaqueta como app de Windows y APK de Android.

## Windows

- `SINE.exe`: ejecutable portable autocontenido.
- `www/`: contenido de la aplicación; debe quedar junto al `.exe`.
- Requiere **Microsoft Edge WebView2 Runtime**; Windows 10/11 con Edge normalmente lo incluye.
- El wrapper está en `windows/SineApp/` y usa `Microsoft.Web.WebView2`.

Compilar:

```powershell
dotnet publish windows/SineApp -c Release -r win-x64 --self-contained true `
  -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true `
  -o dist/windows
```

## Android

- Paquete: `mx.sine.raiz`
- Nombre: **Raíz**
- Proyecto Capacitor 6 en `android/`.
- Assets web en `www/`; se copian con `npx cap sync android`.
- TTS nativo: `MainActivity.java` expone `window.NativeTts` y usa `TextToSpeech` en español.
- Botón atrás: `@capacitor/app`.

Compilar:

```bash
npx cap sync android
cd android
./gradlew assembleDebug
```

APK resultante:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

Instalar en un dispositivo conectado:

```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

## Distribución

Los binarios no se guardan en Git porque el `.exe` supera los 100 MB. Se generan localmente y se distribuyen aparte:

- `SINE-Windows.zip`
- `Raiz-Android.apk`

El contenido web sigue funcionando offline; las apps nativas solo empaquetan esos mismos archivos.
