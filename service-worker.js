const CACHE_VERSION = 'dipseditz-v1';
const CACHE_NAME = CACHE_VERSION;
const APP_SHELL = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './spiderman-logo.png',
  './app-icon-192.png',
  './app-icon-512.png',
  './manifest.webmanifest',
  './offline.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k.startsWith('dipseditz-') && k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // Only handle same-origin requests; let third-party (YouTube, fonts) pass through.
  if (url.origin !== self.location.origin) return;

  // Never cache mailto or non-http(s)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // Navigation requests: network-first, fall back to cache / offline page.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put('./index.html', copy));
          return res;
        })
        .catch(() =>
          caches.match('./index.html').then((r) => r || caches.match('./offline.html'))
        )
    );
    return;
  }

  // Static assets: cache-first.
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => undefined);
    })
  );
});
