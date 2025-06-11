// ✅ Define the cache name and the files you want to store in cache
const CACHE_NAME = 'gentech-cache-v1';
const urlsToCache = [
  '/',                     // Root path
  'index.html',            // Main HTML page
  'manifest.json',         // Web app manifest
  'icons/icon-192.png',    // Icon for Android/web
  'icons/icon-512.png',    // Larger icon for PWA
  'css/style.css',         // Your CSS file
  'js/script.js'           // Your main JS file
];

// ✅ Install event – triggered when the service worker is first installed
self.addEventListener('install', event => {
  self.skipWaiting(); // Forces the waiting SW to become active immediately
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache)) // Pre-caches all files
  );
});

// ✅ Activate event – removes old cache versions
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => 
      Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME) // Filter out current cache
                  .map(name => caches.delete(name))     // Delete outdated caches
      )
    ).then(() => self.clients.claim()) // Take control of any open clients
  );
});

// ✅ Fetch event – intercepts network requests and serves from cache if possible
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => 
      cache.match(event.request).then(cachedResponse => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone()); // Update cache with new response
          }
          return networkResponse;
        }).catch(() => {
          return cachedResponse; // If fetch fails (offline), return cached version
        });

        return cachedResponse || fetchPromise;
      })
    )
  );
});

// ✅ Message event – listens for 'skipWaiting' command from the page
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting(); // Allows SW to activate immediately when requested
  }
});
