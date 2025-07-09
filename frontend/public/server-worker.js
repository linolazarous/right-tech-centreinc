const CACHE_NAME = 'right-tech-centre-v3';
const API_CACHE_NAME = 'right-tech-api-cache-v1';
const ASSET_CACHE_NAME = 'right-tech-assets-v1';

// Core assets to cache immediately
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/css/main.css',
  '/js/main.js',
  '/manifest.json',
  '/favicon.ico',
  '/offline.html',
  '/images/logo.webp',
  '/images/hero-image.webp',
  '/images/bg-image.webp'
];

// Patterns for caching
const STATIC_ASSETS_REGEX = /\.(avif|jpg|jpeg|png|webp|svg|gif|css|js|woff2?)$/i;
const API_ENDPOINTS = /^https:\/\/api\.right-tech\.app\/v1\//;

// Install event - cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching core assets');
        return cache.addAll(CORE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME && 
              cache !== API_CACHE_NAME && 
              cache !== ASSET_CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event handler with multiple strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and chrome-extension
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  // Cache API responses with network-first strategy
  if (API_ENDPOINTS.test(request.url)) {
    event.respondWith(handleApiRequest(event));
    return;
  }

  // Cache static assets with cache-first strategy
  if (STATIC_ASSETS_REGEX.test(url.pathname)) {
    event.respondWith(handleStaticAssetRequest(event));
    return;
  }

  // For HTML documents, use network-first with offline fallback
  if (request.headers.get('accept').includes('text/html')) {
    event.respondWith(handleHtmlRequest(event));
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
    console.log('[Service Worker] Processing background sync');
    event.waitUntil(processFailedRequests());
  }
});

// Strategy handlers
async function handleApiRequest(event) {
  try {
    const networkResponse = await fetch(event.request);
    const cache = await caches.open(API_CACHE_NAME);
    await cache.put(event.request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(event.request);
    return cachedResponse || Response.json(
      { error: 'Offline mode: Data may be outdated' },
      { status: 503, statusText: 'Service Unavailable' }
    );
  }
}

async function handleStaticAssetRequest(event) {
  const cachedResponse = await caches.match(event.request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(event.request);
    const cache = await caches.open(ASSET_CACHE_NAME);
    await cache.put(event.request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    // If we're offline and it's an image, return a placeholder
    if (event.request.url.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)) {
      return caches.match('/images/placeholder.webp');
    }
    throw error;
  }
}

async function handleHtmlRequest(event) {
  try {
    const networkResponse = await fetch(event.request);
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(event.request);
    return cachedResponse || caches.match('/offline.html');
  }
}

async function processFailedRequests() {
  const cache = await caches.open(API_CACHE_NAME);
  const requests = await cache.keys();
  
  return Promise.all(
    requests.map(async request => {
      try {
        const response = await fetch(request);
        await cache.put(request, response.clone());
        console.log('[Service Worker] Re-synced:', request.url);
      } catch (error) {
        console.log('[Service Worker] Failed to re-sync:', request.url);
      }
    })
  );
}

// Push notification handler
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/images/notification-icon.png',
    badge: '/images/badge.png',
    data: {
      url: data.url
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
