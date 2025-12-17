# UX & Accessibility Notes

---
**Document Version:** 1.11
**Last Updated:** December 16, 2025
**Bible Alignment:** v1.11
**Status:** Current
---

**Task ID:** P5-UX-A11Y
**Sub-task IDs:** P5-UX-KEYS, P5-UX-CONTRAST, P5-A11Y-LABELS, P5-A11Y-DOC
**Date:** 2025-12-10

## Overview

This document describes the UX and accessibility improvements implemented for the Grundy web prototype. These changes focus on keyboard navigation, focus states, color contrast, and ARIA semantics without modifying game economy, mini-game rewards, pet stats, FTUE flow, or navigation structure.

---

## 1. Focus Ring Pattern (P5-UX-KEYS)

### Standard Focus Ring Class

All interactive elements use a consistent focus ring pattern:

```tsx
const FOCUS_RING_CLASS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[background-color]';
```

**Color rationale:**
- `ring-amber-400` provides high visibility against both light and dark backgrounds
- Aligns with Grundy's warm color palette
- `ring-offset-2` creates visual separation from the element

**Files updated:**
- `src/components/layout/BottomNav.tsx`
- `src/components/layout/AppHeader.tsx`
- `src/components/MiniGameHub.tsx`
- `src/components/ReadyScreen.tsx`
- `src/components/ResultsScreen.tsx`
- `src/ftue/screens/FtueSplash.tsx`
- `src/ftue/screens/FtueAgeGate.tsx`
- `src/ftue/screens/FtueWorldIntro.tsx`
- `src/ftue/screens/FtuePetSelect.tsx`
- `src/ftue/screens/FtueModeSelect.tsx`
- `src/ftue/screens/FtueFirstSession.tsx`

### Keyboard Navigation

- **FtueSplash:** Entire screen is focusable with `tabIndex={0}` and responds to Enter/Space keys
- **All buttons:** Include `type="button"` to prevent form submission behavior
- **FtueWorldIntro:** Button only becomes tabbable when visible

---

## 2. Color Contrast Improvements (P5-UX-CONTRAST)

### Text Contrast Updates

| Location | Before | After | Reason |
|----------|--------|-------|--------|
| AppHeader secondary text | `text-slate-400` | `text-slate-300` | Better contrast on dark backgrounds |
| MiniGameHub duration | `text-white/60` | `text-slate-300` | Consistent readability |
| ReadyScreen instructions | `text-white/70` | `text-slate-300` | Improved WCAG compliance |
| ResultsScreen labels | `text-white/70` | `text-slate-300` | Uniform secondary text treatment |
| MiniGameHub timer | `text-white/50` | `text-slate-400` | Minimum readable contrast |

### High Contrast Elements

Critical UI elements maintain high contrast:
- White text (`text-white`) on dark backgrounds for primary content
- `text-amber-400` for emphasized content (world intro "you" emphasis)
- `text-yellow-400` for coins and energy indicators
- `text-green-400` for success states (FREE badges, rewards)

---

## 3. ARIA Semantics (P5-A11Y-LABELS)

### Landmark Roles

| Component | Role | Purpose |
|-----------|------|---------|
| BottomNav | `navigation` | Primary app navigation |
| AppHeader | `banner` | Top-level site header |
| MiniGameHub header | `banner` | Game hub header |
| ReadyScreen | `main` | Main content area |
| ResultsScreen | `main` | Main content area |
| FtueWorldIntro | `article` | Story introduction content |
| FtueAgeGate | `dialog` | Modal-like confirmation |

### Interactive Element Labels

**Navigation:**
- `aria-current="page"` on active BottomNav tab
- `aria-label` on all navigation buttons

**Status Information:**
- `role="status"` on energy display and timers
- `aria-live="polite"` on dynamic content (energy timer)
- `aria-label` with full context (e.g., "Energy: 3 of 5")

**Selection States:**
- `aria-pressed` on pet selection buttons
- `aria-label` with complete descriptions for game cards

### Decorative vs. Informative Content

**Hidden from screen readers (`aria-hidden="true"`):**
- Emoji decorations that repeat visible text
- Decorative stars and sparkles
- Progress dots when covered by aria-label
- Badge text when covered by aria-label

**Exposed with alt text:**
- Pet avatars with pose descriptions
- Game icons with game name
- Tier badges with tier name

---

## 4. Semantic HTML Structure

### Heading Hierarchy

Each screen has a clear heading structure:

```
h1: Page/Screen Title
  h2: Section Heading (if needed)
```

**Examples:**
- MiniGameHub: `<h1>Mini-Games</h1>`
- ReadyScreen: `<h1>{game.name}</h1>`
- ResultsScreen: `<h1>{tier}</h1>` + `<h2>Rewards</h2>`
- FtuePetSelect: `<h1>Choose your Grundy</h1>` + `<h2>Coming Soon</h2>`

### Screen Reader Only Content

The `sr-only` class is used for content that should only be read by screen readers:

```tsx
<h1 className="sr-only">Grundy</h1>
```

Used in:
- AppHeader (site name for context)
- FtueWorldIntro (welcome heading)

### Definition Lists

ResultsScreen uses semantic `<dl>`, `<dt>`, `<dd>` for rewards:

```tsx
<dl>
  <div>
    <dt>Coins</dt>
    <dd>+50</dd>
  </div>
</dl>
```

---

## 5. PetAvatar Accessibility

### Props Added

```tsx
interface PetAvatarProps {
  petDisplayName?: string;  // Human-readable name for alt text
}
```

### Alt Text Generation

```tsx
const POSE_LABELS: Record<PetPose, string> = {
  idle: 'resting',
  happy: 'happy',
  sad: 'sad',
  sleeping: 'sleeping',
};

const altText = `${displayName}, ${poseDescription}`;
// Example: "Munchlet, happy"
```

---

## 6. Testing

Accessibility tests are in `src/__tests__/uxAccessibility.test.ts`:

- Focus ring pattern presence
- ARIA attribute verification
- Semantic HTML structure
- Heading hierarchy
- Button type attributes
- Contrast class usage

Run tests:
```bash
npm test -- uxAccessibility
```

---

## 7. Future Considerations

### Not Implemented (Out of Scope)

- Skip-to-content link (would require layout changes)
- Reduced motion preferences (requires animation audit)
- High contrast mode toggle (requires design system changes)

### Recommendations for Future Work

1. **Motion preferences:** Add `prefers-reduced-motion` media query support
2. **Color themes:** Consider high contrast theme option
3. **Focus trap:** Add focus trap for modal-like FTUE screens
4. **Announcements:** Add live region announcements for game events

---

## 8. File Change Summary

| File | Changes |
|------|---------|
| `BottomNav.tsx` | Focus ring, aria-current, navigation role |
| `AppHeader.tsx` | Banner role, sr-only h1, status role, contrast |
| `PetAvatar.tsx` | petDisplayName prop, POSE_LABELS, alt text |
| `MiniGameHub.tsx` | Focus ring, semantic header/footer, aria-labels |
| `ReadyScreen.tsx` | Focus ring, main role, h1, contrast |
| `ResultsScreen.tsx` | Focus ring, h1/h2, dl/dt/dd, aria-labels |
| `FtueSplash.tsx` | Focus ring, keyboard handlers, h1 |
| `FtueAgeGate.tsx` | Focus ring, dialog role, h1, alert role |
| `FtueWorldIntro.tsx` | Focus ring, article role, sr-only h1 |
| `FtuePetSelect.tsx` | Focus ring, h1/h2, aria-pressed |
| `FtueModeSelect.tsx` | Focus ring, h1, contrast |
| `FtueFirstSession.tsx` | Focus ring, h1/h2, semantic regions |

---
**Document Version:** 1.11 | **Bible Alignment:** v1.11 | **Updated:** December 16, 2025
