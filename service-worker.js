const CACHE_VERSION = 'dipseditz-v55';
const CACHE_NAME = CACHE_VERSION;
const APP_SHELL = [
  './index.html',
  './style.css',
  './style.css?v=51',
  './supabase-config.js',
  './script.js',
  './script.js?v=51',
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
      '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Offline</title></head><body style="background:#0B0D10;color:#F5F7FA;font-family:sans-serif;text-align:center;padding:40px"><h1>You are offline</h1><p>The Dips Editz portfolio needs a connection for this content.</p></body></html>',
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

  // HTML navigations: network first, cache fallback.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req, { cache: 'no-store' })
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put('./index.html', copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match('./index.html', { ignoreSearch: true }).then((r) => r || offlineResponse()))
    );
    return;
  }

  const isCoreAsset = url.pathname.endsWith('.css') || url.pathname.endsWith('.js');

  // CSS/JS: network first so theme and logic updates are never stale.
  if (isCoreAsset) {
    event.respondWith(
      fetch(req, { cache: 'no-store' })
        .then((res) => {
          if (res && res.status === 200 && res.type === 'basic') {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || offlineResponse()))
    );
    return;
  }

  // Other same-origin assets: cache first.
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;
      return fetch(req, { cache: 'no-store' }).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => offlineResponse());
    })
  );
});