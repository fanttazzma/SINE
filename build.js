#!/usr/bin/env node
/**
 * Genera dos artefactos de distribución:
 *   dist/Raiz.html     → un solo archivo, se abre con doble clic
 *   dist/raiz/         → carpeta portable para servir o publicar
 *
 * Requiere esbuild solo para construir el HTML único:
 *   npm install
 *   npm run build
 */
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const dist = path.join(root, 'dist');
const portable = path.join(dist, 'raiz');

function read(p) {
  return fs.readFileSync(path.join(root, p), 'utf8');
}

function dataUri(file, mime) {
  return `data:${mime};base64,${fs.readFileSync(path.join(root, file)).toString('base64')}`;
}

let esbuild;
try {
  esbuild = require('esbuild');
} catch {
  console.error('\nFalta esbuild. Ejecuta:  npm install\n');
  process.exit(1);
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(portable, { recursive: true });

const bundle = esbuild.buildSync({
  entryPoints: [path.join(root, 'js/app.js')],
  bundle: true,
  write: false,
  format: 'iife',
  target: ['es2020'],
  minify: false,
}).outputFiles[0].text;

let css = ['css/base.css', 'css/app.css', 'css/lesson.css', 'css/challenge.css'].map(read).join('\n\n');

css = css
  .replace(
    "url('../assets/fonts/Inter.woff2')",
    `url('${dataUri('assets/fonts/Inter.woff2', 'font/woff2')}')`
  )
  .replace(
    "url('../assets/fonts/SpaceGrotesk.woff2')",
    `url('${dataUri('assets/fonts/SpaceGrotesk.woff2', 'font/woff2')}')`
  );

let html = read('index.html');
html = html
  .replace(/\s*<link rel="manifest"[^>]*>/, '')
  .replace(/\s*<link rel="apple-touch-icon"[^>]*>/, '')
  .replace(/\s*<link rel="preload"[^>]*>/g, '')
  .replace(/\s*<link rel="stylesheet"[^>]*>/g, '')
  .replace(
    'href="icons/logo.svg"',
    `href="${dataUri('icons/logo.svg', 'image/svg+xml')}"`
  )
  .replace('</head>', `  <style>\n${css}\n  </style>\n  </head>`)
  .replace(
    /<script type="module" src="js\/app\.js"><\/script>/,
    `<script>\n${bundle}\n  </script>`
  );

fs.writeFileSync(path.join(dist, 'Raiz.html'), html, 'utf8');
fs.copyFileSync(path.join(dist, 'Raiz.html'), path.join(portable, 'Raiz.html'));

const items = [
  'index.html',
  'assets',
  'css',
  'data',
  'icons',
  'js',
  'manifest.webmanifest',
  'sw.js',
  'server.js',
  'start.bat',
  'start.sh',
  'README.md',
  'PITCH.md',
  'DISTRIBUCION.md',
];

for (const item of items) {
  fs.cpSync(path.join(root, item), path.join(portable, item), { recursive: true });
}

fs.writeFileSync(path.join(portable, '.nojekyll'), '');
fs.writeFileSync(
  path.join(portable, 'LEEME.txt'),
  [
    'Raíz · Aprende sin señal',
    '',
    'Windows: doble clic en start.bat',
    'macOS/Linux: chmod +x start.sh && ./start.sh',
    'Navegador: http://localhost:4173',
    '',
    'Sin servidor: abre Raiz.html (funciona con doble clic).',
    'No abras index.html directamente: el navegador bloquea los módulos en file://.',
    'Para publicar en GitHub Pages/Netlify, sube esta carpeta.',
    '',
    'El contenido es un prototipo educativo. Revísalo con docentes antes de usarlo en aula.',
  ].join('\n')
);

console.log('Listo:');
console.log('  dist/Raiz.html   (archivo único, offline)');
console.log('  dist/raiz/       (carpeta portable/PWA)');
