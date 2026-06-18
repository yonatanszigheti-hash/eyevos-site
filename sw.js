/* Eyevos service worker — installability + offline shell.
   IMPORTANT: only same-origin GETs are touched. Supabase (auth/data) and CDN
   scripts are cross-origin and pass straight through to the network — never cached,
   so login and live data are always fresh. */
const CACHE = "eyevos-v1";
const SHELL = ["/", "/index.html", "/app-live.html", "/manifest.webmanifest", "/icon.svg"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;                         // never touch writes
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;               // Supabase + CDNs: straight to network

  // HTML: network-first so the app is always up to date; cached copy only offline.
  if (req.mode === "navigate" || req.destination === "document") {
    e.respondWith(
      fetch(req)
        .then((r) => { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(req, cp)); return r; })
        .catch(() => caches.match(req).then((m) => m || caches.match("/app-live.html")))
    );
    return;
  }

  // Other same-origin static: cache-first, fall back to network.
  e.respondWith(
    caches.match(req).then((m) => m || fetch(req).then((r) => {
      const cp = r.clone(); caches.open(CACHE).then((c) => c.put(req, cp)); return r;
    }).catch(() => m))
  );
});
