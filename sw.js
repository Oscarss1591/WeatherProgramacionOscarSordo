const CACHE_NAME = "weather-app-v1";

const urlsToCache = [
"./",
"./index.html",
"./styles.css",
"./app.js",
"./manifest.json"
];

/* INSTALAR */
self.addEventListener("install", event => {
event.waitUntil(
caches.open(CACHE_NAME)
.then(cache => cache.addAll(urlsToCache))
);
});

/* ACTIVAR */
self.addEventListener("activate", event => {
event.waitUntil(
caches.keys().then(keys => {
return Promise.all(
keys.map(key => {
if(key !== CACHE_NAME){
return caches.delete(key);
}
})
);
})
);
});

/* FETCH (offline support) */
self.addEventListener("fetch", event => {
event.respondWith(
caches.match(event.request)
.then(response => {
return response || fetch(event.request);
})
);
});