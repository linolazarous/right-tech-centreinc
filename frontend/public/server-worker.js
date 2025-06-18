const CACHE_NAME = 'right-tech-cache-v2';
const API_CACHE_NAME = 'right-tech-api-cache-v1';
const ASSET_CACHE_NAME = 'right-tech-assets-v1';

// Core assets to cache immediately
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/static/js/main.chunk.js',
  '/static/css/main.chunk.css',
  '/static/media/logo.avif',
  '/offline.html'  // Custom offline page
];

// DigitalOcean Spaces assets pattern
const DO_SPACES_REGEX = /\.(avif|jpg|jpeg|png|webp|svg|gif|css|js|woff2?)$/i;
const API_ENDPOINTS = /^https:\/\/api\.right-tech\.app\/v1\//;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME && 
              cache !== API_CACHE_NAME && 
              cache !== ASSET_CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache API responses with network-first strategy
  if (API_ENDPOINTS.test(request.url)) {
    event.respondWith(
      fetch(request)
        .then(networkResponse => {
          const clone = networkResponse.clone();
          caches.open(API_CACHE_NAME)
            .then(cache => cache.put(request, clone));
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request)
            .then(cachedResponse => cachedResponse || Response.json(
              { error: 'Offline mode: Data may be outdated' },
              { status: 503 }
            ));
        })
    );
    return;
  }

  // Cache DigitalOcean Spaces assets with cache-first strategy
  if (DO_SPACES_REGEX.test(url.pathname)) {
    event.respondWith(
      caches.match(request)
        .then(cachedResponse => cachedResponse || fetch(request)
          .then(networkResponse => {
            const clone = networkResponse.clone();
            caches.open(ASSET_CACHE_NAME)
              .then(cache => cache.put(request, clone));
            return networkResponse;
          })
        )
    );
    return;
  }

  // For navigation requests, try network first
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match('/offline.html'))
    );
    return;
  }

  // Default cache-first strategy for other assets
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => cachedResponse || fetch(request))
  );
});

// Background sync for failed API requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-api-requests') {
    event.waitUntil(
      processFailedRequests()
    );
  }
});

async function processFailedRequests() {
  const cache = await caches.open(API_CACHE_NAME);
  const keys = await cache.keys();
  
  return Promise.all(
    keys.map(async request => {
      try {
        const response = await fetch(request);
        await cache.put(request, response.clone());
      } catch (error) {
        // Keep in cache for next attempt
      }
    })
  );
}
