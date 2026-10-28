const CACHE_VERSION = 'dipseditz-v3';
const CACHE_NAME = CACHE_VERSION;
const APP_SHELL = [
  './index.html',
  './style.css',
  './script.js',
  './spiderman-logo.png',
  './app-icon-192.png',
  './app-icon-512.png',
  './manifest.webmanifest',
  './offline.html'
];

const OFFLINE_FALLBACK = './offline.html';

function offlineResponse() {
  return caches.match(OFFLINE_FALLBACK, { ignoreSearch: true })
    .then((r) => r || new Response(
      '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Offline</title></head><body style="background:#07070d;color:#f5f5fa;font-family:sans-serif;text-align:center;padding:40px"><h1>You are offline</h1><p>The Dips Editz portfolio needs a connection for this content.</p></body></html>',
      { status: 503, statusText: 'Service Unavailable', headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    ));
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
      .catch((err) => { console.warn('Install failed:', err); })
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

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (e) { return; }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put('./index.html', copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => offlineResponse())
    );
    return;
  }

  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => offlineResponse());
    })
  );
});