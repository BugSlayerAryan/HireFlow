const CACHE_NAME = 'hireflow-static-v2';
const APP_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/vite.svg'
];

// Install Event - Caching basic assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate Event - Cleaning old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Fetch Event - Stale-While-Revalidate Strategy
self.addEventListener('fetch', event => {
    // Skip non-GET requests, API calls, chrome extensions, and LOCALHOST during development
    if (event.request.method !== 'GET' ||
        event.request.url.includes('/api/') ||
        event.request.url.startsWith('chrome-extension') ||
        event.request.url.includes('google-analytics') ||
        event.request.url.includes('localhost') ||
        event.request.url.includes('127.0.0.1')) {
        return;
    }

    event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(event.request).then(response => {
                const fetchPromise = fetch(event.request).then(networkResponse => {
                    if (networkResponse && networkResponse.status === 200) {
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                }).catch(err => {
                    console.warn('[SW] Fetch failed:', err);
                    // Do not return undefined, let the catch handle it or return a fallback
                    return response; // Return the cached response if fetch fails
                });

                // If we have a cached response, return it, otherwise wait for fetch
                // Ensure we ALWAYS return a promise that resolves to a Response or at least doesn't throw
                return response || fetchPromise;
            });
        }).catch(() => {
            // Emergency fallback if cache access fails
            return fetch(event.request);
        })
    );
});
