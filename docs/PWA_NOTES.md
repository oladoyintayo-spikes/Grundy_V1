# PWA_NOTES.md

# Grundy PWA Implementation Notes

**Task:** P5-PWA-CORE, P5-PWA-SHELL, P5-PWA-DOC
**Phase:** Web Phase 5 — Polish / Web 1.0

---

## Overview

Grundy is implemented as a Progressive Web App (PWA), providing:

- **Installability** — Can be installed on desktop and mobile devices
- **Offline-friendly** — Basic app shell loads even without network
- **Native-like experience** — Runs in standalone mode with custom theme

---

## Web App Manifest

### Location

`public/manifest.webmanifest`

### Key Configuration

| Property | Value | Notes |
|----------|-------|-------|
| `name` | "Grundy" | Full app name |
| `short_name` | "Grundy" | Shown on home screen |
| `display` | "standalone" | No browser chrome |
| `start_url` | "./" | Relative for GitHub Pages compat |
| `scope` | "./" | Relative for GitHub Pages compat |
| `theme_color` | "#0f172a" | Dark slate theme |
| `background_color` | "#020617" | Match loading screen |
| `orientation` | "portrait-primary" | Mobile-first design |

### Icons

| Size | File | Purpose |
|------|------|---------|
| 192x192 | `icons/grundy-192.png` | Standard icon, maskable |
| 512x512 | `icons/grundy-512.png` | High-res icon, maskable |

**Note:** Placeholder icons are currently in use. Replace with final branding artwork.

---

## Service Worker

### Location

`public/service-worker.js`

### Caching Strategy

**Shell + Network-First with Cache Fallback**

1. **Pre-cached shell assets:**
   - `./` (root)
   - `./index.html`
   - `./manifest.webmanifest`
   - `./icons/grundy-192.png`
   - `./icons/grundy-512.png`

2. **Runtime caching:**
   - Network-first for all same-origin GET requests
   - Successful responses are cached for offline fallback
   - Navigation requests fall back to `index.html` (SPA support)

3. **Not cached:**
   - POST/PUT/DELETE requests
   - Cross-origin requests
   - API calls (if any future `/api/` routes)

### Cache Versioning

Cache name: `grundy-shell-v1`

To invalidate cache:
1. Update `CACHE_NAME` in `service-worker.js`
2. Deploy new version
3. Old caches are automatically deleted on activation

### Behavior

| Scenario | Response |
|----------|----------|
| Online, asset available | Fetch from network, update cache |
| Online, fetch fails | Serve from cache |
| Offline, in cache | Serve from cache |
| Offline, not in cache (navigation) | Serve `index.html` |
| Offline, not in cache (resource) | Return 503 response |

---

## Service Worker Registration

### Location

`src/pwa/serviceWorker.ts` (called from `src/main.tsx`)

### Behavior

- Registration happens after `window.load` to not block initial render
- Uses relative path for GitHub Pages compatibility
- Fails silently — PWA is progressive enhancement, not required
- Listens for updates and logs to console

### Functions Exported

| Function | Purpose |
|----------|---------|
| `registerServiceWorker()` | Register SW on load |
| `unregisterServiceWorker()` | Remove SW (debugging) |
| `isServiceWorkerActive()` | Check if SW is controlling |

---

## Install Prompt

### Location

`src/pwa/installPrompt.ts` (called from `src/main.tsx`)

### Behavior

The `beforeinstallprompt` event is captured and stored for later use. This allows a future "Install Grundy" button in Settings to trigger the native install prompt.

### Functions Exported

| Function | Purpose |
|----------|---------|
| `setupInstallPromptListener()` | Listen for install prompt event |
| `getDeferredInstallPrompt()` | Get the stored event |
| `canInstall()` | Check if install prompt available |
| `isInstalled()` | Check if app is installed |
| `promptInstall()` | Trigger install prompt |

### Future UI Integration

To add an "Install Grundy" button:

```tsx
import { canInstall, promptInstall } from '../pwa';

function InstallButton() {
  if (!canInstall()) return null;

  const handleInstall = async () => {
    const result = await promptInstall();
    console.log('Install result:', result);
  };

  return <button onClick={handleInstall}>Install Grundy</button>;
}
```

---

## HTML Meta Tags

Added to `index.html`:

```html
<meta name="theme-color" content="#0f172a" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="Grundy" />
<link rel="apple-touch-icon" href="icons/grundy-192.png" />
<link rel="manifest" href="manifest.webmanifest" />
```

---

## Limitations

1. **Placeholder icons** — Replace with actual branding artwork
2. **No offline data sync** — Game state is local (Zustand persist)
3. **First load requires network** — Initial JS bundle must be downloaded
4. **No push notifications** — Not implemented
5. **No background sync** — Not needed for current feature set

---

## Testing PWA Features

### Manual Testing

1. **Install prompt:**
   - Open in Chrome/Edge on supported platform
   - Check console for "[PWA] Install prompt captured"
   - Browser may show install icon in address bar

2. **Offline mode:**
   - Open DevTools → Application → Service Workers
   - Enable "Offline" checkbox
   - Reload page — should show cached shell

3. **Lighthouse audit:**
   - DevTools → Lighthouse → Progressive Web App
   - Should pass basic PWA criteria

### Automated Tests

See `src/__tests__/pwaConfig.test.ts` for:
- Manifest validation
- PWA module exports
- Service worker registration logic

---

## Files Reference

| File | Purpose |
|------|---------|
| `public/manifest.webmanifest` | PWA manifest |
| `public/service-worker.js` | Service worker script |
| `public/icons/grundy-192.png` | App icon (192x192) |
| `public/icons/grundy-512.png` | App icon (512x512) |
| `src/pwa/index.ts` | PWA module exports |
| `src/pwa/serviceWorker.ts` | SW registration logic |
| `src/pwa/installPrompt.ts` | Install prompt handler |
| `src/main.tsx` | Calls PWA init functions |
| `index.html` | Contains PWA meta tags |

---

## Future Improvements

- **Install button in Settings** — Use `promptInstall()` to show native prompt
- **Update notification** — Show "New version available" toast
- **Richer offline support** — Pre-cache more assets for offline mini-games
- **Background sync** — Sync game state when online (if server is added)
- **Push notifications** — Daily pet care reminders

---

*This file documents the P5-PWA implementation. See TASKS.md for task status.*
