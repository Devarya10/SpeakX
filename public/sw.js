const CACHE_NAME = 'livetranslate-v1';
const urlsToCache = [
  '/',
  '/client/App.tsx',
  '/client/global.css',
  '/client/pages/Index.tsx',
  '/client/pages/NotFound.tsx',
  '/client/components/ui/button.tsx',
  '/client/components/ui/textarea.tsx',
  '/client/components/ui/select.tsx',
  '/client/components/ui/card.tsx',
  '/client/components/ui/badge.tsx',
  '/manifest.json'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background Sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-translate') {
    event.waitUntil(doBackgroundTranslate());
  }
});

function doBackgroundTranslate() {
  // Handle offline translation requests when back online
  return new Promise((resolve) => {
    // This would connect to your translation API when online
    console.log('Background sync: Translation request');
    resolve();
  });
}

// Push notifications (optional for future features)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'LiveTranslate notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png'
  };

  event.waitUntil(
    self.registration.showNotification('LiveTranslate', options)
  );
});
