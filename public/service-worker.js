// ============================================
// GRUNDY — SERVICE WORKER
// Shell-focused caching for offline-friendly experience
// P5-PWA-CORE, P5-PWA-SHELL
// ============================================

const CACHE_NAME = 'grundy-shell-v1';

// Shell assets to pre-cache (stable resources only)
// Vite fingerprints built assets, so we only pre-cache the shell
const SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/grundy-192.png',
  './icons/grundy-512.png',
];

// Install event: pre-cache shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(SHELL_ASSETS).catch((error) => {
        // If pre-cache fails, don't block install
        // This is progressive enhancement, not a hard requirement
        console.warn('[SW] Pre-cache failed (non-blocking):', error);
      });
    })
  );
  // Activate immediately without waiting for reload
  self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      )
    )
  );
  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch event: network-first with cache fallback for same-origin GET requests
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Skip API calls, WebSocket, or extension resources
  if (
    url.pathname.startsWith('/api/') ||
    url.protocol === 'chrome-extension:' ||
    url.protocol === 'moz-extension:'
  ) {
    return;
  }

  event.respondWith(
    // Try network first
    fetch(request)
      .then((response) => {
        // If successful, clone and cache the response
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(request).then((cached) => {
          if (cached) {
            return cached;
          }
          // If no cache match and it's a navigation request, return index.html
          if (request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          // Otherwise return a simple offline response
          return new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable',
          });
        });
      })
  );
});

// Message handler for potential future use (e.g., cache invalidation)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
