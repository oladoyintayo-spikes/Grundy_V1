// ============================================
// GRUNDY — PWA INSTALL PROMPT HANDLER
// Captures beforeinstallprompt for future install UI
// P5-PWA-CORE
// ============================================

/**
 * BeforeInstallPromptEvent interface (not in standard TypeScript libs)
 */
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Store the deferred install prompt event
let deferredInstallPrompt: BeforeInstallPromptEvent | null = null;

// Track if app is already installed
let isAppInstalled = false;

/**
 * Sets up the beforeinstallprompt event listener
 * Call this once at app initialization
 */
export function setupInstallPromptListener(): void {
  if (typeof window === 'undefined') return;

  // Listen for the beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (event: Event) => {
    // Prevent the default mini-infobar from appearing on mobile
    event.preventDefault();
    // Stash the event for later use
    deferredInstallPrompt = event as BeforeInstallPromptEvent;
    console.log('[PWA] Install prompt captured');
  });

  // Listen for app installed event
  window.addEventListener('appinstalled', () => {
    isAppInstalled = true;
    deferredInstallPrompt = null;
    console.log('[PWA] App installed successfully');
  });

  // Check if already running as installed PWA
  if (window.matchMedia('(display-mode: standalone)').matches) {
    isAppInstalled = true;
    console.log('[PWA] Running as installed app');
  }
}

/**
 * Returns the deferred install prompt event if available
 */
export function getDeferredInstallPrompt(): BeforeInstallPromptEvent | null {
  return deferredInstallPrompt;
}

/**
 * Checks if the app can be installed (install prompt available)
 */
export function canInstall(): boolean {
  return deferredInstallPrompt !== null && !isAppInstalled;
}

/**
 * Checks if the app is already installed
 */
export function isInstalled(): boolean {
  return isAppInstalled;
}

/**
 * Triggers the install prompt
 * Returns the user's choice or null if not available
 */
export async function promptInstall(): Promise<'accepted' | 'dismissed' | null> {
  if (!deferredInstallPrompt) {
    console.log('[PWA] No install prompt available');
    return null;
  }

  try {
    // Show the install prompt
    await deferredInstallPrompt.prompt();
    // Wait for the user's choice
    const { outcome } = await deferredInstallPrompt.userChoice;
    console.log('[PWA] Install prompt outcome:', outcome);

    // Clear the deferred prompt (can only be used once)
    deferredInstallPrompt = null;

    return outcome;
  } catch (error) {
    console.warn('[PWA] Install prompt failed:', error);
    return null;
  }
}
