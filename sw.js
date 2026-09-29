/**
 * Service Worker com Estratégia Network-First e Auto-Atualização
 */

const CACHE_NAME = 'neuroscreen-tdah-v6';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/themes.js',
  './js/app.js',
  './js/audio.js',
  './js/timer.js',
  './js/metrics.js',
  './js/state.js',
  './js/games/gonogo.js',
  './js/games/cpt.js',
  './js/games/selective.js',
  './js/games/memory.js',
  './js/games/switching.js',
  './js/games/timeest.js',
  './js/ui/onboarding.js',
  './js/ui/tutorial.js',
  './js/ui/report.js'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Estratégia Network-First: busca sempre a versão mais recente do servidor
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).then((response) => {
      if (response && response.status === 200) {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
      }
      return response;
    }).catch(() => caches.match(event.request))
  );
});
