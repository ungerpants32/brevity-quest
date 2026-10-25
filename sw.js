// Offline cache for Brevity Quest. Bump VER on every publish so phones pick up the new build.
const VER = "bq-mvne8vk1";
const FILES = ["./", "./index.html", "./manifest.json", "./apple-touch-icon.png", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VER).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VER).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
// Network first for the page (so updates land when online), cache fallback offline; cache first for the rest.
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  if (req.mode === "navigate") { e.respondWith(fetch(req).then(r => { const cp = r.clone(); caches.open(VER).then(c => c.put("./index.html", cp)); return r; }).catch(() => caches.match("./index.html"))); return; }
  e.respondWith(caches.match(req).then(r => r || fetch(req)));
});
