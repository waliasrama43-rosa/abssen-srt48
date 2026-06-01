/**
 * EduSmart Asrama - Service Worker
 * Handles offline caching and background sync
 */

const CACHE_VERSION = 'edusmart-v1.0.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const API_CACHE = `${CACHE_VERSION}-api`;

const STATIC_ASSETS = [
  '/pwa/index.html',
  '/pwa/css/app.css',
  '/pwa/js/app.js',
  '/pwa/js/auth.js',
  '/pwa/js/api.js',
  '/pwa/js/db.js',
  '/pwa/js/ui.js',
  '/pwa/pages/login.js',
  '/pwa/pages/dashboard.js',
  '/pwa/manifest.json'
];

// Install - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => {
        return Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== API_CACHE)
            .map((key) => caches.delete(key))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch - routing strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API calls: network-first
  if (url.pathname.includes('/exec') || url.hostname.includes('script.google.com')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Static assets: cache-first
  event.respondWith(cacheFirst(request));
});

/**
 * Cache-first strategy for static assets
 */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    return offlineFallback();
  }
}

/**
 * Network-first strategy for API calls
 */
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    return new Response(
      JSON.stringify({ success: false, error: 'offline', message: 'Tidak ada koneksi internet' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Offline fallback page
 */
function offlineFallback() {
  return caches.match('/pwa/index.html');
}

// Listen for messages from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
