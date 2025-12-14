// ============================================
// GRUNDY — SERVICE WORKER REGISTRATION
// Registers service worker for PWA functionality
// P5-PWA-CORE, P6-PWA-UPDATE
// ============================================

// P6-PWA-UPDATE: Store the waiting service worker for later activation
let waitingServiceWorker: ServiceWorker | null = null;
let updateCallbacks: Array<() => void> = [];

/**
 * P6-PWA-UPDATE: Subscribe to update notifications.
 * Returns an unsubscribe function.
 */
export function onServiceWorkerUpdate(callback: () => void): () => void {
  updateCallbacks.push(callback);

  // If we already have a waiting worker, notify immediately
  if (waitingServiceWorker) {
    callback();
  }

  // Return unsubscribe function
  return () => {
    updateCallbacks = updateCallbacks.filter(cb => cb !== callback);
  };
}

/**
 * P6-PWA-UPDATE: Check if an update is available.
 */
export function hasServiceWorkerUpdate(): boolean {
  return waitingServiceWorker !== null;
}

/**
 * P6-PWA-UPDATE: Apply the waiting update and reload the page.
 */
export function applyServiceWorkerUpdate(): void {
  if (!waitingServiceWorker) {
    console.log('[SW] No update to apply');
    return;
  }

  // Tell the waiting SW to skip waiting and become active
  waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });

  // Reload the page to use the new SW
  // The controllerchange event will trigger the reload
}

/**
 * Registers the service worker if supported
 * This is a progressive enhancement - failures are silent
 */
export function registerServiceWorker(): void {
  // Check if service workers are supported
  if (!('serviceWorker' in navigator)) {
    console.log('[SW] Service workers not supported');
    return;
  }

  // Register on window load to not block initial render
  window.addEventListener('load', () => {
    // Determine the base path for the service worker
    // In production (GitHub Pages), this will be /Grundy_V1/
    // In development, this will be /
    const swUrl = new URL('service-worker.js', window.location.href).href;

    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        console.log('[SW] Registered successfully:', registration.scope);

        // P6-PWA-UPDATE: Check if there's already a waiting worker
        if (registration.waiting) {
          waitingServiceWorker = registration.waiting;
          console.log('[SW] Update already waiting');
          updateCallbacks.forEach(cb => cb());
        }

        // Check for updates periodically
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            console.log('[SW] Update found, installing...');
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker is installed, but waiting
                console.log('[SW] New version available');
                waitingServiceWorker = newWorker;
                // P6-PWA-UPDATE: Notify all subscribers
                updateCallbacks.forEach(cb => cb());
              }
            });
          }
        });
      })
      .catch((error) => {
        // Fail silently - PWA is optional enhancement
        console.warn('[SW] Registration failed (non-blocking):', error);
      });
  });

  // P6-PWA-UPDATE: Reload when the new SW takes control
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('[SW] Controller changed, reloading...');
    window.location.reload();
  });
}

/**
 * Unregisters all service workers
 * Useful for debugging or forcing a clean state
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const success = await registration.unregister();
    console.log('[SW] Unregistered:', success);
    return success;
  } catch (error) {
    console.warn('[SW] Unregister failed:', error);
    return false;
  }
}

/**
 * Checks if a service worker is currently active
 */
export function isServiceWorkerActive(): boolean {
  if (typeof navigator === 'undefined') return false;
  return 'serviceWorker' in navigator && navigator.serviceWorker.controller !== null;
}
