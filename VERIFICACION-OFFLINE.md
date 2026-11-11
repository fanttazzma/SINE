# Verificación offline de SINE · Raíz

Fecha: 10 de noviembre de 2026.

## Windows

**Artefacto probado:** `SINE-Windows.zip` → `SINE.exe`.

**Método:** se abrió la app desde una copia limpia del ZIP y se bloquearon todas las peticiones externas a nivel de WebView2. Solo se permitieron peticiones a `https://raiz.local/` y recursos `data:`.

**Resultado:**

- La pantalla de inicio cargó correctamente.
- Se abrió una misión de 1º de primaria.
- El botón “Escuchar misión completa” generó 589 caracteres de narración (título, descripción, objetivo, ideas y pasos).
- La voz seleccionada fue **Microsoft Sabina — Spanish (Mexico) (es-MX)**, marcada como local.
- **0 peticiones externas**.
- **0 errores de JavaScript**.

## Android

**Dispositivo:** moto g67 (`ZY22MJ6GDG`).
**APK:** `Raiz-Android.apk`, paquete `mx.sine.raiz`, versión 1.0.

**Método:**

1. Se activó **modo avión** (`airplane_mode_on=1`).
2. Se verificó que no hubiera red: `ping 8.8.8.8` → *Network is unreachable*.
3. Se borraron los datos de la app para forzar un arranque en frío.
4. Se abrió la app y se navegó a una misión.
5. Se pulsó “Escuchar”.

**Resultado:**

- La pantalla de inicio cargó sin red.
- Se abrió la misión “El mercado de los números”.
- El selector mostró: **“Voz del sistema Android · español (México)”**.
- La narración generó 589 caracteres.
- El motor TTS de Android cargó la voz española y `AudioTrack` inició la reproducción.
- **0 errores de JavaScript**.
- La red se restauró al terminar.

## Notas

- En Android el primer arranque en frío puede tardar unos segundos mientras WebView y el motor TTS se inicializan.
- La voz de Android depende de que el sistema tenga instalada una voz en español. En este dispositivo está instalada.
- Windows necesita WebView2 Runtime; está presente en este equipo y suele venir con Windows 10/11.
- Los datos y el progreso se guardan localmente; no se envía nada a internet.
