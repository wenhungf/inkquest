// The Kettlebrook Oracle: works offline. Everything is cached on the first visit; a new version replaces the old cache.
const VERSION = '0c04e9bf7f';
const FILES = ["./", "index.html", "manifest.webmanifest", "cards/01-finder.png", "cards/02-brass-door.png", "cards/03-copper-dragon.png", "cards/04-wizards-tower.png", "cards/05-goose.png", "cards/06-moonlit-path.png", "cards/07-teacup-storm.png", "cards/08-minute-sprite.png", "cards/09-sword-and-shield.png", "cards/10-speaking-pipe.png", "cards/11-soggy-boot.png", "cards/12-signed-form.png", "cards/13-kobold-tunnel.png", "cards/14-mayor.png", "cards/15-lost-and-found.png", "cards/16-shapeshift.png", "cards/17-still-pond.png", "cards/18-goblins-gambit.png", "cards/19-cracked-mirror.png", "cards/20-odd-sock.png", "cards/21-five-bells.png", "cards/22-rune-stone.png", "cards/23-claim-ticket.png", "cards/24-clockwork-clerk.png", "cards/25-mimic.png", "cards/26-iron-door.png", "cards/27-waterwheel.png", "cards/28-night-owl.png", "cards/29-rooftop-rogue.png", "cards/30-druids-grove.png", "cards/31-lost-hour.png", "cards/32-ring.png", "cards/33-harp.png", "cards/34-hole-in-the-pocket.png", "cards/35-great-clock.png", "cards/36-golden-key.png", "cards/back.png", "cloth.jpg", "fonts/fraunces-latin-full-normal.woff2", "fonts/fraunces-latin-full-italic.woff2", "fonts/dm-sans-latin-400-normal.woff2", "fonts/dm-sans-latin-500-normal.woff2", "fonts/dm-sans-latin-700-normal.woff2", "fonts/cubic11-deck.woff2", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open('kbo-' + VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('kbo-') && k !== 'kbo-' + VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') { // the page: try the network first so updates arrive, fall back to the cache offline
    e.respondWith(fetch(req).catch(() => caches.match('./index.html', { ignoreSearch: true })));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req)));
});
