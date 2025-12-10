// ============================================
// GRUNDY — PWA CONFIG TESTS
// Tests for PWA manifest, service worker, and install prompt
// P5-PWA-CORE, P5-PWA-SHELL, P5-PWA-DOC
// ============================================

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// Import PWA modules for testing
import {
  setupInstallPromptListener,
  getDeferredInstallPrompt,
  canInstall,
  isInstalled,
  promptInstall,
} from '../pwa/installPrompt';

import {
  registerServiceWorker,
  unregisterServiceWorker,
  isServiceWorkerActive,
} from '../pwa/serviceWorker';

describe('PWA Manifest', () => {
  const manifestPath = path.resolve(__dirname, '../../public/manifest.webmanifest');

  it('manifest file exists', () => {
    expect(fs.existsSync(manifestPath)).toBe(true);
  });

  describe('manifest content', () => {
    let manifest: Record<string, unknown>;

    beforeEach(() => {
      const content = fs.readFileSync(manifestPath, 'utf-8');
      manifest = JSON.parse(content);
    });

    it('has required name fields', () => {
      expect(manifest.name).toBe('Grundy');
      expect(manifest.short_name).toBe('Grundy');
      expect(typeof manifest.name).toBe('string');
      expect(typeof manifest.short_name).toBe('string');
      expect((manifest.name as string).length).toBeGreaterThan(0);
      expect((manifest.short_name as string).length).toBeGreaterThan(0);
    });

    it('has standalone display mode', () => {
      expect(manifest.display).toBe('standalone');
    });

    it('has start_url and scope', () => {
      expect(manifest.start_url).toBeDefined();
      expect(manifest.scope).toBeDefined();
      expect(typeof manifest.start_url).toBe('string');
      expect(typeof manifest.scope).toBe('string');
    });

    it('has theme and background colors', () => {
      expect(manifest.theme_color).toBeDefined();
      expect(manifest.background_color).toBeDefined();
      expect(typeof manifest.theme_color).toBe('string');
      expect(typeof manifest.background_color).toBe('string');
    });

    it('has at least one icon', () => {
      expect(manifest.icons).toBeDefined();
      expect(Array.isArray(manifest.icons)).toBe(true);
      expect((manifest.icons as unknown[]).length).toBeGreaterThan(0);
    });

    it('icons have required properties', () => {
      const icons = manifest.icons as Array<{
        src: string;
        sizes: string;
        type: string;
      }>;

      icons.forEach((icon) => {
        expect(icon.src).toBeDefined();
        expect(icon.sizes).toBeDefined();
        expect(icon.type).toBeDefined();
        expect(typeof icon.src).toBe('string');
        expect(typeof icon.sizes).toBe('string');
        expect(icon.type).toBe('image/png');
      });
    });

    it('has 192x192 and 512x512 icons', () => {
      const icons = manifest.icons as Array<{ sizes: string }>;
      const sizes = icons.map((icon) => icon.sizes);

      expect(sizes).toContain('192x192');
      expect(sizes).toContain('512x512');
    });

    it('has portrait orientation', () => {
      expect(manifest.orientation).toBe('portrait-primary');
    });

    it('has description', () => {
      expect(manifest.description).toBeDefined();
      expect(typeof manifest.description).toBe('string');
      expect((manifest.description as string).length).toBeGreaterThan(0);
    });
  });
});

describe('Service Worker File', () => {
  const swPath = path.resolve(__dirname, '../../public/service-worker.js');

  it('service worker file exists', () => {
    expect(fs.existsSync(swPath)).toBe(true);
  });

  it('service worker contains install event handler', () => {
    const content = fs.readFileSync(swPath, 'utf-8');
    expect(content).toContain("addEventListener('install'");
  });

  it('service worker contains activate event handler', () => {
    const content = fs.readFileSync(swPath, 'utf-8');
    expect(content).toContain("addEventListener('activate'");
  });

  it('service worker contains fetch event handler', () => {
    const content = fs.readFileSync(swPath, 'utf-8');
    expect(content).toContain("addEventListener('fetch'");
  });

  it('service worker has CACHE_NAME defined', () => {
    const content = fs.readFileSync(swPath, 'utf-8');
    expect(content).toContain('CACHE_NAME');
  });
});

describe('PWA Module Exports', () => {
  describe('installPrompt exports', () => {
    it('exports setupInstallPromptListener function', () => {
      expect(typeof setupInstallPromptListener).toBe('function');
    });

    it('exports getDeferredInstallPrompt function', () => {
      expect(typeof getDeferredInstallPrompt).toBe('function');
    });

    it('exports canInstall function', () => {
      expect(typeof canInstall).toBe('function');
    });

    it('exports isInstalled function', () => {
      expect(typeof isInstalled).toBe('function');
    });

    it('exports promptInstall function', () => {
      expect(typeof promptInstall).toBe('function');
    });
  });

  describe('serviceWorker exports', () => {
    it('exports registerServiceWorker function', () => {
      expect(typeof registerServiceWorker).toBe('function');
    });

    it('exports unregisterServiceWorker function', () => {
      expect(typeof unregisterServiceWorker).toBe('function');
    });

    it('exports isServiceWorkerActive function', () => {
      expect(typeof isServiceWorkerActive).toBe('function');
    });
  });
});

describe('Install Prompt Handler', () => {
  it('setupInstallPromptListener does not throw in test environment', () => {
    // In test environment, window is undefined or limited
    expect(() => setupInstallPromptListener()).not.toThrow();
  });

  it('getDeferredInstallPrompt returns null initially', () => {
    // Before any beforeinstallprompt event, should be null
    expect(getDeferredInstallPrompt()).toBeNull();
  });

  it('canInstall returns false when no prompt available', () => {
    // Without beforeinstallprompt event, should be false
    expect(canInstall()).toBe(false);
  });

  it('isInstalled returns false by default', () => {
    // In test environment, not running as installed app
    expect(isInstalled()).toBe(false);
  });

  it('promptInstall returns null when no prompt available', async () => {
    const result = await promptInstall();
    expect(result).toBeNull();
  });
});

describe('Service Worker Registration', () => {
  it('registerServiceWorker does not throw in test environment', () => {
    // In test environment, navigator.serviceWorker is undefined
    expect(() => registerServiceWorker()).not.toThrow();
  });

  it('isServiceWorkerActive returns false in test environment', () => {
    // No service worker controller in test environment
    expect(isServiceWorkerActive()).toBe(false);
  });

  it('unregisterServiceWorker returns false in test environment', async () => {
    // No service worker in test environment
    const result = await unregisterServiceWorker();
    expect(result).toBe(false);
  });
});

describe('Icon Files', () => {
  const iconsDir = path.resolve(__dirname, '../../public/icons');

  it('icons directory exists', () => {
    expect(fs.existsSync(iconsDir)).toBe(true);
  });

  it('192x192 icon file exists', () => {
    const iconPath = path.join(iconsDir, 'grundy-192.png');
    expect(fs.existsSync(iconPath)).toBe(true);
  });

  it('512x512 icon file exists', () => {
    const iconPath = path.join(iconsDir, 'grundy-512.png');
    expect(fs.existsSync(iconPath)).toBe(true);
  });
});

describe('HTML Meta Tags', () => {
  const htmlPath = path.resolve(__dirname, '../../index.html');

  it('index.html exists', () => {
    expect(fs.existsSync(htmlPath)).toBe(true);
  });

  it('has manifest link', () => {
    const content = fs.readFileSync(htmlPath, 'utf-8');
    expect(content).toContain('rel="manifest"');
    expect(content).toContain('manifest.webmanifest');
  });

  it('has theme-color meta tag', () => {
    const content = fs.readFileSync(htmlPath, 'utf-8');
    expect(content).toContain('name="theme-color"');
  });

  it('has apple-mobile-web-app-capable meta tag', () => {
    const content = fs.readFileSync(htmlPath, 'utf-8');
    expect(content).toContain('name="apple-mobile-web-app-capable"');
  });

  it('has apple-touch-icon link', () => {
    const content = fs.readFileSync(htmlPath, 'utf-8');
    expect(content).toContain('rel="apple-touch-icon"');
  });
});
