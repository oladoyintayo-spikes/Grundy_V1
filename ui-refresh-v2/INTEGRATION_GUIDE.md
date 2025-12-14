# UI Integration Guide — Bible v1.10 Navigation Model

**Component Integration Reference** — NOT canonical design
**Canonical Source:** `docs/GRUNDY_MASTER_BIBLE.md` v1.10 (§14.5, §14.6)

---

## Overview

Bible v1.10 adopted a **Menu-first + Action Bar** navigation model, replacing the legacy bottom-tab navigation (Home/Games/Settings).

### Key Changes from Legacy

| Aspect | Legacy | Bible v1.10 |
|--------|--------|-------------|
| Navigation | Bottom tabs (Home/Games/Settings) | Menu Overlay + Action Bar |
| Feed access | Food Bag in HomeView | Feed button → Food Drawer |
| Game access | Games tab | Action Bar Games button OR Menu → Games |
| Settings access | Settings tab | Menu → Settings |
| Shop access | Header button | Header button OR Menu → Shop |

---

## Action Bar (Bottom)

**Component:** `src/components/layout/ActionBar.tsx`

Three required buttons:

| Button | Icon | Action | Test ID |
|--------|------|--------|---------|
| Feed | 🍎 | Opens Food Drawer | `action-bar-feed` |
| Games | 🎮 | Routes to Mini-Game Hub | `action-bar-games` |
| Menu | ☰ | Opens Menu Overlay | `action-bar-menu` |

**Props:**
```tsx
interface ActionBarProps {
  onFeedTap: () => void;
  onGamesTap: () => void;
  onMenuTap: () => void;
  isFoodDrawerOpen?: boolean;
  isMenuOpen?: boolean;
  isOnCooldown?: boolean;
  isStuffed?: boolean;
}
```

---

## Menu Overlay

**Component:** `src/components/layout/MenuOverlay.tsx`

Slide-up overlay panel containing:

| Option | Icon | Action | Test ID |
|--------|------|--------|---------|
| Switch Pet | 🐾 | Opens Pet Selector | `menu-option-switch-pet` |
| Shop | 🛒 | Opens Shop screen | `menu-option-shop` |
| Inventory | 🎒 | Opens Inventory screen | `menu-option-inventory` |
| Games | 🎮 | Routes to Mini-Game Hub | `menu-option-games` |
| Settings | ⚙️ | Opens Settings panel | `menu-option-settings` |
| Home | 🏠 | Returns to home view | `menu-option-home` |

**Note:** Cosmetics is NOT included until Phase 11.

**Dismiss behavior:** Tap scrim, close button, or Escape key.

---

## Food Drawer

**Component:** `src/components/layout/FoodDrawer.tsx`

Bible v1.10 §14.6 requirements:

1. **Feed in ≤1 tap** — Feed button in Action Bar opens drawer immediately
2. **≥4 foods visible** — Grid shows at least 4 food items without scrolling
3. **Empty foods may show** — Disabled state allowed
4. **No permanent obstruction** — Drawer dismisses cleanly

**Props:**
```tsx
interface FoodDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  foods: FoodDefinition[];
  inventory: Record<string, number>;
  onFeed: (foodId: string) => void;
  isFeeding?: boolean;
  isStuffed?: boolean;
  isOnCooldown?: boolean;
  cooldownRemaining?: number;
}
```

---

## Header

**Component:** `src/components/layout/AppHeader.tsx`

Bible v1.10 requirements:

- **Menu icon** — Opens Menu Overlay (same as Action Bar Menu)
- **Coins visible** — Always shown (may be 0)
- **Gems visible** — Always shown (may be 0 if no sources yet)
- **Bond visible** — Per Bible §4.4

**Test IDs:**
- `header-menu-button` — Menu icon
- `hud-coins` — Coins display
- `hud-gems` — Gems display
- `hud-bond` — Bond display

---

## Cooldown Visibility

**Component:** `src/components/layout/CooldownBanner.tsx`

Bible v1.10 §14.6 UI Overlay Safety Rule 2:

> Cooldown timer, when active, should be visible on main view (not hidden behind overlays).

Shows on HomeView when:
- Pet is stuffed (feeding blocked)
- Pet is on cooldown (reduced feed value)

**Test IDs:**
- `cooldown-banner-stuffed` — Stuffed state
- `cooldown-banner-active` — Cooldown active
- `cooldown-timer` — Remaining time display

---

## Overlay Safety Rules

Bible v1.10 §14.6 requires overlays NOT permanently obscure:

1. **Poop Indicator** — Must be accessible after dismissing overlays
2. **Cooldown Timer** — Visible on main view when active
3. **Currency Display** — Coins + Gems in header always visible
4. **Time-of-Day** — Background tint persists, overlays dismiss to TOD-appropriate view

### Verification Checklist

- [ ] Food Drawer scrim is tap-to-dismiss
- [ ] Menu Overlay has close button and scrim dismiss
- [ ] PoopIndicator remains in HomeView after overlay close
- [ ] CooldownBanner shows on HomeView when cooldown active
- [ ] AppHeader shows Coins AND Gems
- [ ] RoomScene applies TOD background

---

## Terminology

| Term | Usage |
|------|-------|
| **Games** | Canonical UI label for buttons and menu items |
| **Mini-Games** | Canonical Bible/design term (equivalent to "Games") |
| **Play** | ❌ NOT a navigation label — ambiguous with "play with pet" |

---

## Test IDs Reference

### Action Bar
- `action-bar` — Container
- `action-bar-feed` — Feed button
- `action-bar-games` — Games button
- `action-bar-menu` — Menu button

### Menu Overlay
- `menu-overlay` — Container
- `menu-overlay-panel` — Panel
- `menu-overlay-scrim` — Scrim (tap to dismiss)
- `menu-overlay-close` — Close button
- `menu-option-{action}` — Menu options

### Food Drawer
- `food-drawer` — Container
- `food-drawer-panel` — Panel
- `food-drawer-grid` — Food grid
- `food-drawer-first-item` — First food item
- `food-drawer-stuffed` — Stuffed indicator
- `food-drawer-cooldown` — Cooldown indicator

### Header
- `app-header` — Container
- `header-menu-button` — Menu icon
- `hud-coins` — Coins display
- `hud-gems` — Gems display

---

## Migration Notes

**None expected** — This is a UI-only change. No persisted state changes.

If you touch persisted UI state (e.g., storing which drawer is open), call it out explicitly in the PR.
