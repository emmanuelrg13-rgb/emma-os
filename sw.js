const CACHE_NAME = 'emma-os-v1-5-2-cache-001';
const ASSETS = [
  './',
  './index.html',
  './emma-theme.css',
  './emma-shell.js',
  './manifest.webmanifest',
  './apps/pendientes/',
  './apps/pendientes/index.html',
  './apps/arrowverse/',
  './apps/arrowverse/index.html',
  './apps/rutina-atomica/',
  './apps/rutina-atomica/index.html',
  './apps/botiquin/',
  './apps/botiquin/index.html',
  './apps/respaldo/',
  './apps/respaldo/index.html',
  './apps/sheets-sync/',
  './apps/sheets-sync/index.html',
  './apps/sheets-sync/emma-os-apps-script-v1-5-2.gs.txt',
  './icons/icon-192.png',
  './icons/icon-512.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match('./index.html'))));
});
