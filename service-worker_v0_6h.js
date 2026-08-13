"use strict";
const CACHE_NAME = "stedit-v0_6h-pwa-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest_v0_6h.json",
  "./service-worker_v0_6h.js",
  "./icons/apple-touch-icon_v0_6h.png",
  "./icons/icon-192_v0_6h.png",
  "./icons/icon-512_v0_6h.png",
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match("./index.html")))
  );
});
