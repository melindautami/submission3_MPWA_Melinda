importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox)
  console.log(`Workbox berhasil dimuat`);
else
  console.log(`Workbox gagal dimuat`);

workbox.precaching.precacheAndRoute([
  { url: '/', revision: '1' },
  { url: '/nav.html', revision: '1' },
  { url: '/index.html', revision: '1' },
  { url: '/matchDetail.html', revision: '1' },
  { url: '/manifest.json', revision: '1' },
  { url: '/icon.png', revision: '1' },
  { url: '/registerSw.js', revision: '1' },
  { url: '/pages/favorite.html', revision: '1' },
  { url: '/pages/home.html', revision: '1' },
  { url: '/pages/matches.html', revision: '1' },
  { url: '/css/materialize.min.css', revision: '1' },
  { url: '/js/materialize.min.js', revision: '1' },
  { url: '/js/nav.js', revision: '1' },
  { url: '/js/api.js', revision: '1' },
  { url: '/js/db.js', revision: '1' },
  { url: '/js/idb.js', revision: '1' },
  { url: '/js/push.js', revision: '1' },
]);


workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.cacheFirst({
      cacheName: 'images',
      plugins: [
          new workbox.expiration.Plugin({
              maxEntries: 60,
              maxAgeSeconds: 30 * 24 * 60 * 60,
          }),
      ],
  }),
);

workbox.routing.registerRoute(
  new RegExp('https://api.football-data.org/v2/'),
  workbox.strategies.staleWhileRevalidate()
);

workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  workbox.strategies.staleWhileRevalidate({
      cacheName: 'google-fonts-stylesheets',
  })
);

workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  workbox.strategies.cacheFirst({
      cacheName: 'google-fonts-webfonts',
      plugins: [
          new workbox.cacheableResponse.Plugin({
              statuses: [0, 200],
          }),
          new workbox.expiration.Plugin({
              maxAgeSeconds: 60 * 60 * 24 * 365,
              maxEntries: 30,
          }),
      ],
  })
);

workbox.routing.registerRoute(
  new RegExp('/css/'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'css'
    })
);

workbox.routing.registerRoute(
  new RegExp('/js/'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'js'
    })
);

workbox.routing.registerRoute(
  new RegExp('/pages/'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'pages'
    })
);

workbox.routing.registerRoute(
  new RegExp('icon.png'),
  workbox.strategies.cacheFirst()
);

workbox.routing.registerRoute(
  new RegExp('/index.html'),
  workbox.strategies.cacheFirst()
);

workbox.routing.registerRoute(
  new RegExp('manifest.json'),
  workbox.strategies.cacheFirst()
);

workbox.routing.registerRoute(
  new RegExp('/matchDetail.html'),
  workbox.strategies.cacheFirst()
);

workbox.routing.registerRoute(
  new RegExp('/nav.html'),
  workbox.strategies.cacheFirst()
);

self.addEventListener('push', function (event) {
  let body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  let options = {
    body: body,
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});