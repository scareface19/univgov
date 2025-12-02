"use client";

import { useEffect } from "react";

export function NoopServiceWorker() {
  useEffect(() => {
    // Désactiver les service workers en développement
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          // Ne pas désactiver si c'est notre service worker
          if (!registration.scope.includes("/service-worker.js")) {
            registration.unregister().catch(() => {
              // Ignorer les erreurs
            });
          }
        });
      });
    }
  }, []);

  return null;
}

