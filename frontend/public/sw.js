/**
 * DataMboa Progressive Web App (PWA) Service Worker (F3.10, R4, R13, R24)
 * Engineered for low-bandwidth African networks (2G/3G) and resilient offline usage.
 */

const STATIC_CACHE = 'datamboa-static-v1';
const DYNAMIC_CACHE = 'datamboa-dynamic-v1';

const CORE_PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
];

// Install: pre-cache shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(CORE_PRECACHE_URLS).catch((err) => {
        console.warn('[SW] Core precache partially failed:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean obsolete caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-first for dynamic content, Cache-first for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and external third-party origins
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  // Static assets (images, icons, fonts): Cache-First
  if (
    request.destination === 'image' ||
    request.destination === 'font' ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.ico')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              const clone = response.clone();
              caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
            }
            return response;
          })
          .catch(() => cached || Response.error());
      })
    );
    return;
  }

  // Navigation requests (HTML pages) and API GET requests: Network-First with Cache fallback
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
        }
        return networkResponse;
      })
      .catch(() => {
        // Network failed (offline) -> attempt to serve from cache
        return caches.match(request).then((cached) => {
          if (cached) return cached;

          // If navigation request, fallback to root or cached shell
          if (request.mode === 'navigate') {
            return caches.match('/').then((rootCached) => {
              if (rootCached) return rootCached;
              return new Response(
                '<!DOCTYPE html><html><head><meta charset="utf-8"/><title>DataMboa — Hors-ligne</title><style>body{font-family:sans-serif;text-align:center;padding:50px;background:#f8fafc;color:#1e293b}h1{color:#0d9488}</style></head><body><h1>Mode Hors-ligne Actif</h1><p>Vous n\'êtes actuellement pas connecté à Internet. Vos cours et exercices en cache restent accessibles.</p><button onclick="window.location.reload()" style="padding:10px 20px;background:#0d9488;color:#fff;border:none;border-radius:12px;font-weight:bold;cursor:pointer;">Réessayer</button></body></html>',
                { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
              );
            });
          }

          return new Response(JSON.stringify({ error: 'Réseau indisponible. Mode hors-ligne actif.' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          });
        });
      })
  );
});

