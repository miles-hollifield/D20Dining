const VERSION_NUMBER = '1.0' ;

function log(...data) {
  console.log(`SWv${VERSION_NUMBER}`, ...data);
}

log("SW Script executing - adding event listeners");

const STATIC_CACHE_NAME = `D20Dining-static-V${VERSION_NUMBER}`;

self.addEventListener('install', event => {
  log('install', event);
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then(cache => {
      return cache.addAll([
        //Pages
        '/offline',
        //CSS
        '/css/common.css',
        '/css/favorites.css',
        '/css/home.css',
        '/css/login.css',
        '/css/profile.css',
        '/css/search.css',
        '/css/sets.css',
        //Images
        '/img/d20dice.png',
        '/img/default-avatar.jpg',
        '/img/parchment-paper.jpg',
        '/img/settings-icon.png',
        //Scripts
        '/js/APIClient.js',
        '/js/common.js',
        '/js/home.js',
        '/js/HTTPClient.js',
        '/js/login.js',
        '/js/profile.js',
        '/js/set.js',
        '/js/signup.js',
        '/js/favorite.js',
        //External Resources
      ]);
    }).catch(err => {
        console.log("SW ERROR: " + err);
    })
  );
});

self.addEventListener('activate', event => {
  log('activate', event);
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('D20Dining-') && cacheName != STATIC_CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});


self.addEventListener('fetch', event => {
  var requestUrl = new URL(event.request.url);
  //Treat API calls (to our API) differently
  if(requestUrl.origin === location.origin && requestUrl.pathname.startsWith('/api')) {
    //If we are here, we are intercepting a call to our API
    if(event.request.method === "GET") {
      //Only intercept (and cache) GET API requests
      event.respondWith(
        networkFirst(event.request)
      );
    }
  }
  else {
    //If we are here, this was not a call to our API
    event.respondWith(
        networkFirst(event.request)
    );
  }
});


function cacheFirst(request) {
  return caches.match(request)
  .then(response => {
    //Return a response if we have one cached. Otherwise, get from the network
    return response || fetchAndCache(request);
  })
  .catch(error => {
    return caches.match('/offline');
  })
}

async function networkFirst(request) {
    try {
        const response = await fetchAndCache(request);
        return response;
    } catch (error) {
        // If we get an error, try to return from cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        return caches.match('/offline');
    }
}

function fetchAndCache(request) {
  return fetch(request).then(response => {
    var requestUrl = new URL(request.url);
    //Cache successful GET requests that are not browser extensions
    if(response.ok && request.method === "GET" && !requestUrl.protocol.startsWith('chrome-extension')) {
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        cache.put(request, response);
      })
    }
    return response.clone();
  });
}



self.addEventListener('message', event => {
  log('message', event.data);
  if(event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
