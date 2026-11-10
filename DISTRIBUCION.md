# Distribuir Raíz

Raíz es una app estática: no necesita servidor, base de datos ni instalación de dependencias. Se puede distribuir de cuatro formas.

## 1. PWA instalable (recomendada para móvil y escritorio)

La app ya incluye `manifest.webmanifest` y `sw.js`.

1. Sírvela por **HTTPS** o en `localhost`.
2. Ábrela en Chrome, Edge o Safari.
3. Toca el icono de **instalar** en la barra de direcciones, o:
   - Android/Chrome: menú ⋮ → **Instalar aplicación**.
   - iPhone/iPad: Compartir → **Agregar a inicio**.
   - Windows/Mac: icono de instalar de la barra de direcciones.
4. Se abre como app independiente y funciona sin internet después de la primera carga.

> En Android, la instalación PWA requiere HTTPS (o `localhost` en el mismo equipo). Para instalarla en teléfonos de estudiantes, publica `dist/raiz/` en GitHub Pages, Netlify o cualquier hosting HTTPS. Si no tienes hosting, usa el ZIP o el HTML único.

Para probar en local:

```bash
node server.js
```

Abre `http://localhost:4173` y usa el botón de instalar.

## 2. Carpeta portable + ZIP (Windows, macOS, Linux)

La carpeta completa se puede copiar a una USB o compartir por WhatsApp/Drive:

```text
Raiz-offline.zip
```

Dentro:

- Windows: doble clic en `start.bat`.
- macOS/Linux: `chmod +x start.sh && ./start.sh`.
- Sin servidor: abre `Raiz.html` (incluido en el ZIP). No abras `index.html` directamente: el navegador bloquea los módulos JavaScript en `file://`.

El servidor local no requiere internet. Solo necesita Node.js instalado.

## 3. Un solo archivo HTML

`dist/Raiz.html` contiene **todo** (CSS, JavaScript, tipografías y contenido) en un archivo. También se incluye como `Raiz.html` dentro del ZIP portable.

- Se puede abrir con doble clic.
- Se puede enviar por correo o USB.
- Funciona sin internet.
- No instala service worker desde `file://`, pero el contenido, las interacciones, la voz y el progreso local funcionan.

Ideal para computadoras de escuela sin permisos de instalación.

### Reconstruir los artefactos

```bash
npm install
npm run build
```

En Windows también puedes ejecutar `.\build.ps1`; en macOS/Linux, `./build.sh`. Eso genera `dist/Raiz.html`, `dist/raiz/` y `dist/Raiz-offline.zip`.

## 4. Publicar en GitHub Pages o Netlify

Sube el contenido de `dist/raiz/` a un repositorio y activa Pages. Al ser rutas relativas, funciona en:

```text
https://tuusuario.github.io/raiz/
```

Incluye `.nojekyll` para que GitHub no procese los archivos.

En Netlify: arrastra la carpeta `dist/raiz/` al panel. Sin build command.

## ¿Y una app nativa como Wikicarta?

[Wikicarta](https://github.com/singular-state/wikicarta) usa Tauri para escritorio. Es una gran opción si más adelante quieres:

- instalador `.exe` / `.msi`,
- app Android/iOS con Tauri v2 o Capacitor,
- acceso a archivos locales y ZIM.

Para esta etapa, la PWA + HTML único + ZIP cubre móvil, laptop y tablets sin exigir Rust, Android SDK ni permisos de administrador. Si el concurso pide un instalador nativo, el siguiente paso es envolver `dist/raiz/` con Tauri v2; el frontend ya está listo.

## Checklist antes de distribuir

- [ ] Probar en el dispositivo objetivo sin conexión.
- [ ] Revisar el contenido con un docente.
- [ ] Cambiar `theme_color`/iconos si la escuela lo pide.
- [ ] Incluir la licencia de las tipografías (OFL) si redistribuyes los archivos.
- [ ] No incluir datos personales: Raíz no tiene cuentas ni analytics.
