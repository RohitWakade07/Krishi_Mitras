const CACHE_NAME = 'krishi-kavach-v1';
const APP_SHELL = [
  'index.html',
  'dashboard.html',
  'advisory.html',
  'assets/css/styles.css',
  'assets/js/main.js',
  'services/weatherService.js',
  'services/advisoryEngine.js',
  'services/pestModule.js',
  'services/voiceBot.js',
  'manifest.json',
  'assets/images/favicon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => k !== CACHE_NAME && caches.delete(k))))
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const isApi = request.url.includes('open-meteo.com');
  if (isApi) {
    // Network-first for API with cache fallback
    event.respondWith(
      fetch(request)
        .then((response) => {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }
  // Cache-first for static assets
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});


