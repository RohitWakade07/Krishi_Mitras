const CACHE_NAME = 'krishi-kavach-v1';
const APP_SHELL = [
  '/',
  '/Krishi_Mitras/index.html',
  '/Krishi_Mitras/dashboard.html',
  '/Krishi_Mitras/advisory.html',
  '/Krishi_Mitras/assets/css/styles.css',
  '/Krishi_Mitras/assets/js/main.js',
  '/Krishi_Mitras/services/weatherService.js',
  '/Krishi_Mitras/services/advisoryEngine.js',
  '/Krishi_Mitras/services/pestModule.js',
  '/Krishi_Mitras/services/voiceBot.js',
  '/Krishi_Mitras/manifest.json'
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


