// ============================================
// GRUNDY — PWA MODULE INDEX
// Exports for PWA functionality
// P5-PWA-CORE
// ============================================

export {
  setupInstallPromptListener,
  getDeferredInstallPrompt,
  canInstall,
  isInstalled,
  promptInstall,
} from './installPrompt';

export type { BeforeInstallPromptEvent } from './installPrompt';

export {
  registerServiceWorker,
  unregisterServiceWorker,
  isServiceWorkerActive,
} from './serviceWorker';
