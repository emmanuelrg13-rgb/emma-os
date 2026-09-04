/* Emma OS v1.7.1 · 2026-09-03 · OpenAI/ChatGPT · M0/M1/M2 Finanzas + cache network-first. */
const CACHE_NAME = 'emma-os-v1-7-1-cache-001';
const FALLBACK_URL = './index.html';
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
  './apps/dale-una-oportunidad/',
  './apps/dale-una-oportunidad/index.html',
  './apps/finanzas/',
  './apps/finanzas/index.html',
  './apps/finanzas/core/finance-schema.js',
  './apps/finanzas/core/finance-dates.js',
  './apps/finanzas/core/finance-strategies.js',
  './apps/finanzas/core/finance-achievements.js',
  './apps/finanzas/core/finance-core.js',
  './apps/finanzas/repository/finance-repository.js',
  './apps/finanzas/repository/google-sheets-finance-adapter.js',
  './apps/finanzas/service/finance-service.js',
  './apps/finanzas/backend/finance-google-sheets-api-v1-7-1.gs.txt',
  './apps/finanzas/tests/finance-fixtures.js',
  './apps/finanzas/tests/finance-core-tests.html',
  './apps/finanzas/tests/finance-repository-tests.html',
  './apps/botiquin/',
  './apps/botiquin/index.html',
  './apps/respaldo/',
  './apps/respaldo/index.html',
  './apps/sheets-sync/',
  './apps/sheets-sync/index.html',
  './apps/sheets-sync/emma-os-apps-script-v1-6-1.gs.txt',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request, { cache: 'no-store' });
    if (response && response.ok) cache.put(request, response.clone()).catch(() => {});
    return response;
  } catch (error) {
    const cached = await caches.match(request, { ignoreSearch: true });
    if (cached) return cached;
    return caches.match(FALLBACK_URL);
  }
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(networkFirst(event.request));
});
