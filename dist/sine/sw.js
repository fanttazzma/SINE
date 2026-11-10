const CACHE = 'sine-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/base.css',
  './css/app.css',
  './css/lesson.css',
  './css/challenge.css',
  './assets/fonts/Patria.woff2',
  './assets/fonts/NotoSans-Regular.woff2',
  './assets/fonts/NotoSans-Bold.woff2',
  './data/curriculum.js',
  './data/primary.js',
  './data/programming.js',
  './data/stories.js',
  './js/app.js',
  './js/challenge.js',
  './js/lesson.js',
  './js/store.js',
  './js/ui.js',
  './js/audio.js',
  './js/particles.js',
  './icons/logo.svg',
  './icons/sine-logo.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-180.png',
  './icons/icon-maskable-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put('./index.html', copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match('./index.html').then((r) => r || caches.match('./')))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === 'basic') {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => cached);
    })
  );
});
