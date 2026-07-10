/* Service worker dasar untuk Nora - Asisten Pribadi.
   Cache file inti biar aplikasi tetap bisa dibuka walau offline. */

const NAMA_CACHE = 'nora-cache-v3';
const FILE_INTI = [
  './',
  './index.html',
  './manifest.json',
  './splash.jpg',
  './favicon-16.png',
  './favicon-32.png',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png',
  './icon-192-maskable.png',
  './icon-512-maskable.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(NAMA_CACHE).then((cache) => cache.addAll(FILE_INTI))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((namaSemua) =>
      Promise.all(
        namaSemua
          .filter((nama) => nama !== NAMA_CACHE)
          .map((nama) => caches.delete(nama))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((respon) => {
          const salinan = respon.clone();
          caches.open(NAMA_CACHE).then((cache) => cache.put(event.request, salinan));
          return respon;
        })
        .catch(() => cached);
    })
  );
});
