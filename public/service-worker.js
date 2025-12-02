// Service Worker minimal pour éviter les conflits avec NextAuth
// Ne pas intercepter les requêtes API

self.addEventListener('fetch', (event) => {
  // Ne pas intercepter les requêtes API - laisser passer toutes les requêtes
  if (event.request.url.includes('/api/')) {
    return; // Laisser passer les requêtes API sans interception
  }
});

