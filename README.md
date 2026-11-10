# Raíz · Aprende sin señal

Enciclopedia interactiva **offline** de primaria y secundaria, con contexto chiapaneco. Hecha como prototipo para concurso de programación.

## Qué incluye

- **6 grados de primaria** (1º a 6º) y **3 de secundaria** (1º a 3º).
- **6 materias**: Matemáticas, Ciencias Naturales, Lengua y Literatura, Historia, Geografía y Programación.
- **42 misiones** interactivas de 8–15 minutos, incluidas **9 historias narradas** (una por grado).
- **Modo cuento**: lee cada paso en voz alta y permite escuchar la historia completa.
- Interacciones reales: recta numérica (incluye saltos de 3), fracciones con tortilla, balanza algebraica, plano cartesiano, laboratorio de fuerzas, células, plantas, cuerpo humano, ecosistemas, ciclo del agua, líneas del tiempo, clasificación, toma de decisiones, historias con voz y un laboratorio de código donde se programa a Luci por un tablero.
- **Reto rápido**: 10 preguntas en 60 segundos, con puntos, racha y récord personal. Inspirado en Quiz Battle, pero 100 % offline.
- **Voz**: selección automática de una voz femenina en español (Sabina, Helena, Laura, Paulina…), selector de voz y lectura de la misión completa: descripción, objetivo, ideas clave y pasos. También funciona con `Modo cuento` paso a paso.
- **Sonido** generado con Web Audio API (sin archivos externos).
- **Progreso local**: XP, racha, misiones completadas, logros y cuaderno.
- **100% offline**: sin backend, sin login, sin CDN, sin base de datos remota.
- **PWA instalable** en Android, iPhone, Windows, macOS y Linux.
- **Tres formatos de distribución**: PWA, carpeta/ZIP portable y un solo archivo HTML.

## Cómo correrlo

Necesitas Node.js. Desde esta carpeta:

```bash
node server.js
```

También puedes usar `npm start`, hacer doble clic en `start.bat` (Windows) o ejecutar `./start.sh` (macOS/Linux).

Abre:

```text
http://localhost:4173
```

Para instalar la app, usa el botón de descarga de la barra superior o consulta [`DISTRIBUCION.md`](DISTRIBUCION.md).

## Demo offline

1. Abre la página y navega un par de misiones para que el service worker cachee todo.
2. Desconecta el Wi-Fi.
3. Recarga con `Ctrl + F5` (o cierra y abre la pestaña).
4. Todo debe seguir funcionando: contenido, interacciones, voz y progreso.

> Nota: la voz depende de las voces instaladas en el sistema. En Windows normalmente hay una voz en español; si no, el botón no aparece.

## Estructura

```text
Raiz/
  index.html
  server.js
  sw.js
  manifest.webmanifest
  start.bat / start.sh
  build.js / build.ps1 / build.sh
  css/
    base.css       → tokens, navegación, botones, modales
    app.css        → inicio, grados, materias, cuaderno
    lesson.css     → reproductor de misiones e interacciones
    challenge.css  → reto rápido de 60 segundos
  data/
    curriculum.js  → materias, grados y misiones de secundaria
    primary.js     → grados y misiones de primaria
    programming.js → laboratorio de código de secundaria
    stories.js     → historias narradas por grado
  js/
    app.js         → router, vistas, estado de la shell
    challenge.js   → reto rápido offline
    lesson.js      → motor de misiones e interacciones
    store.js       → progreso, XP, racha, logros
    ui.js          → iconos SVG, escenarios, mascota, confeti
    audio.js       → sonido y voz
    particles.js   → fondo estelar
  icons/
  dist/             → HTML único, carpeta portable y ZIP (generados)
```

## Contenido

Cada misión sigue una estructura pedagógica sencilla:

1. **Intro** con gancho, objetivo y saberes clave.
2. **Interacción** para manipular el concepto.
3. **Reto** de 3 preguntas con retroalimentación inmediata.
4. **Cierre** con ideas clave, XP y logros.

Primaria trabaja Matemáticas, Lengua y Ciencias; secundaria suma Historia, Geografía y Programación. Está alineado conceptualmente al Plan de Estudios 2022 de la SEP, pero **es un prototipo**: antes de usarlo en aula debe revisarse con docentes y contrastarse con los libros de texto oficiales.

## Créditos

- Diseño y desarrollo: prototipo Raíz.
- Tipografías: Inter y Space Grotesk (SIL Open Font License), empaquetadas localmente.
- Ilustraciones: SVG originales generados para este prototipo.
- Contexto: Chiapas, México.

## Siguientes pasos sugeridos

- Revisión curricular con maestros de Chiapas.
- Más misiones por grado y materia; Historia/Geografía para 4º–6º de primaria.
- Versión en tseltal/tsotsil con hablantes nativos.
- Modo docente con reportes de grupo.
- Empaquetado nativo con Tauri v2 para Windows/Android, reutilizando `dist/raiz/`.
