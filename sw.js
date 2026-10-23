/* Service Worker de Suivi Calorique.
   Rôle : rendre l'app shell utilisable hors connexion.
   Le scan code-barres (Open Food Facts) reste dépendant du réseau ;
   ce fichier ne met en cache que les requêtes same-origin (type 'basic'),
   donc les appels API cross-origin ne sont jamais interceptés ici. */

const CACHE = 'suivi-calorique-v19';

// Fichiers mis en cache dès l'installation (l'app shell : tout ce dont
// l'app a besoin pour démarrer hors connexion). Le moteur OCR
// Tesseract.js (worker, cœur WebAssembly ~4 Mo, modèle de langue
// française ~0,7 Mo — voir lib/tesseract/) n'y figure volontairement
// PAS : ces fichiers ne sont récupérés qu'à la première utilisation
// réelle de la photo d'étiquette (par le gestionnaire "fetch"
// ci-dessous, qui met en cache toute requête same-origin réussie), pour
// ne pas alourdir le tout premier chargement de l'app avec un
// téléchargement dont la plupart des visites n'auront pas besoin.
const FICHIERS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './lib/html5-qrcode.min.js',
  './lib/tesseract/tesseract.min.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './maskable-512.png'
];

// { cache: 'reload' } : chaque fichier est repris sur le serveur, sans
// passer par le petit cache du navigateur (GitHub Pages le garde 10 min).
// Sinon, deux mises à jour publiées coup sur coup pourraient ranger
// d'anciens fichiers sous le nouveau numéro de version.
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(FICHIERS.map((f) => new Request(f, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((cles) => Promise.all(cles.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  // Les appels vers d'autres sites (Open Food Facts) passent directement
  // par le réseau, sans détour par ce fichier.
  if (new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(
    caches.match(e.request).then((enCache) => {
      const surLeReseau = fetch(e.request)
        .then((rep) => {
          if (rep && rep.status === 200 && rep.type === 'basic') {
            const copie = rep.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copie));
          }
          return rep;
        })
        .catch(() => enCache);
      return enCache || surLeReseau;
    })
  );
});

// Phase 5 : la notification de dépassement (déclenchée depuis app.js
// via `registration.showNotification`) doit amener l'utilisateur vers
// l'app quand il appuie dessus, plutôt que de ne rien faire. Si un
// onglet de l'app est déjà ouvert, on le ramène au premier plan (sans
// le recharger) ; sinon on en ouvre un nouveau.
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const dejaOuvert = clients.find((c) => 'focus' in c);
      if (dejaOuvert) return dejaOuvert.focus();
      return self.clients.openWindow('./');
    })
  );
});
