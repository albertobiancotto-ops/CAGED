const CACHE_NAME = 'caged-trainer-v5'; //
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

// Installazione: scarica i nuovi file e sostituisce la versione precedente
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // Attiva subito la nuova versione del Service Worker
});

// Attivazione: cancella automaticamente la vecchia cache v1
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Intercettazione richieste: serve dalla cache per l'offline, ma aggiorna in background
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
