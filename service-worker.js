
const CACHE_NAME = 'prosty-timer-cache-v2';
const urlsToCache = [
  `${self.registration.scope}`,
  `${self.registration.scope}manifest.json`,
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', event => {
  // Dla żądań nawigacyjnych (np. odświeżenie strony), użyj strategii "sieć najpierw",
  // aby użytkownik zawsze otrzymywał najnowszą wersję HTML, jeśli jest online.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Jeśli sieć zawiedzie, zwróć główną stronę z pamięci podręcznej.
        return caches.match('/');
      })
    );
    return;
  }

  // Dla innych zasobów (CSS, JS, obrazy), użyj strategii "cache najpierw" dla maksymalnej prędkości.
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Zwróć z pamięci podręcznej, jeśli zasób jest dostępny.
        if (response) {
          return response;
        }

        // Jeśli nie ma w pamięci podręcznej, pobierz z sieci.
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Sprawdź, czy otrzymano poprawną odpowiedź.
            if (!response || response.status !== 200 || (response.type !== 'basic' && response.type !== 'cors')) {
              return response;
            }

            const responseToCache = response.clone();

            // Zapisz pobraną odpowiedź w pamięci podręcznej na przyszłość.
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Usuń stare wersje pamięci podręcznej.
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});
