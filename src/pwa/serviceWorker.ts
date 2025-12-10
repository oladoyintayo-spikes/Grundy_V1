// ============================================
// GRUNDY — SERVICE WORKER REGISTRATION
// Registers service worker for PWA functionality
// P5-PWA-CORE
// ============================================

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

        // Check for updates periodically
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            console.log('[SW] Update found, installing...');
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker is installed, but waiting
                console.log('[SW] New version available');
                // Could dispatch event here for UI notification
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
  return 'serviceWorker' in navigator && navigator.serviceWorker.controller !== null;
}
