# Grundy – Phase 6+ Backlog

**Last Updated:** December 11, 2024 (P6-DOC-ALIGN)
**Scope:** Bible v1.4 Compliance + Post-Web 1.0 Enhancements

---

## Overview

**Phase 6 = Bring Web 1.0 up to Bible v1.4.**

Web Edition 1.0.0 is released. Bible v1.4 has been merged, defining what the full Grundy experience should be. This backlog bridges the gap between the current Web 1.0 implementation and Bible v1.4 compliance.

**Key Principles:**
- **Bible v1.4 is canonical** — All implementation should converge toward it
- **Core loop hardening first** — Cooldown, fullness, spam prevention
- **HUD cleanup** — Production = Bond-only; debug stats gated
- **Mobile-first** — Viewport constraints from Bible §14.6
- **No breaking changes** — Incremental compliance, not rewrite

---

## Source Inputs

| Source | Items Extracted |
|--------|-----------------|
| `docs/GRUNDY_MASTER_BIBLE.md` (v1.4) | Core loop rules, HUD rules, nav/mobile constraints, Rooms Lite, art rules |
| `docs/QA_WEB1_ISSUES.md` | 5 S3/S4 issues (QA-001 to QA-005) |
| `docs/AUDIO_NOTES.md` | Audio future improvements |
| `docs/PWA_NOTES.md` | PWA future improvements |
| `docs/ART_NOTES.md` | Art expansion items |
| `TASKS.md` | Deferred systems (P2-*, P9-*, P10-*, P11-*) |
| `GRUNDY_DEV_STATUS.md` | P1-ABILITY-4 |

---

## Bible v1.4 Compliance Tasks

### Core Loop Hardening (Bible §4.3–4.4)

> **Goal:** Enforce feeding rules that prevent spam-leveling and preserve "Daily Moments" rhythm.

| ID | Task | Status | Bible | Notes |
|----|------|--------|-------|-------|
| P6-CORE-COOLDOWN | Implement 30-min feeding cooldown | ⬜ | §4.3 | Timer visible, 25% value during cooldown, persists across refresh |
| P6-CORE-STUFFED | Block feeding when STUFFED (91-100) | ⬜ | §4.4 | Pet refuses food entirely at STUFFED state |
| P6-CORE-SPAM | Prevent spam-feed exploitation | ⬜ | §4.3 | Cooldown resets on each feed; spam = diminished returns |

### HUD Cleanup (Bible §4.4)

> **Goal:** Production HUD shows Bond only. Debug stats gated behind dev flag.

| ID | Task | Status | Bible | Notes |
|----|------|--------|-------|-------|
| P6-HUD-PRODUCTION | Production HUD: Bond-only visible | ⬜ | §4.4 | Remove hunger/XP/energy bars from player-facing UI |
| P6-HUD-DEBUG | Gate debug HUD behind dev flag | ⬜ | §4.4 | `import.meta.env.DEV` check; strip in production builds |

### Mobile Layout & Navigation (Bible §14.5–14.6)

> **Goal:** On phone, pet + primary actions + nav + currencies visible without scroll.

| ID | Task | Status | Bible | Notes |
|----|------|--------|-------|-------|
| P6-MOBILE-LAYOUT | Enforce mobile viewport constraints | ⬜ | §14.6 | Pet, actions, nav, currencies visible without scroll |
| P6-NAV-GROUNDWORK | Navigation structure groundwork | ⬜ | §14.5 | Prepare for future menu-based nav; clarify current bottom nav |
| P6-NAV-CONFIRM | Add pet switch confirmation | ⬜ | §14.5 | "Switch to Grib?" modal per Bible design |

### Rooms Lite & Environment (Bible §14.4)

> **Goal:** Time-of-day + activity→room mapping per Bible spec.

| ID | Task | Status | Bible | Notes |
|----|------|--------|-------|-------|
| P6-ENV-ROOMS | Implement activity→room mapping | ⬜ | §14.4 | Feeding=Kitchen, Sleeping=Bedroom, Playing=Playroom |
| P6-ENV-UI | Room selection UI | ⬜ | §14.4 | Explicit room switcher (QA-003) |
| P6-ENV-TOD | Time-of-day consistency | 🟡 | §14.4 | Already partial; verify Bible compliance |

### Economy & Gems (Bible §8.2–8.3)

> **Status:** Already enforced in Web 1.0. Verification only.

| ID | Task | Status | Bible | Notes |
|----|------|--------|-------|-------|
| P6-ECON-GEMS | Verify NO GEMS from mini-games | ✅ | §8.3 | Verified in code and tests |
| P6-ECON-CAP | Verify daily cap (3 plays) | ✅ | §8.2 | Verified in code and tests |
| P6-ECON-FREE | Verify first-game-free | ✅ | §8.2 | Verified in code and tests |

### Art Integration (Bible §13.7)

> **Goal:** Sprite art in production; emoji/orb only in dev placeholders.

| ID | Task | Status | Bible | Notes |
|----|------|--------|-------|-------|
| P6-ART-PRODUCTION | Verify sprites in production builds | 🟡 | §13.7 | PetAvatar uses sprites; verify no emoji fallback in prod |
| P6-ART-TEST | Add visual regression test | ⬜ | §13.7 | Test that no emoji appears where sprites should |

---

## Backlog by Theme (Non-Bible Tasks)

### Branding & Visual Polish

| ID | Task | Status | Source | Notes |
|----|------|--------|--------|-------|
| P6-BRANDING | Replace placeholder PWA icons | ⬜ | QA-001 | Icons in `public/icons/` are 70-byte placeholders |
| P6-ART-POSES | Additional pet poses | ⬜ | ART_NOTES | eating, excited, pooping poses |
| P6-ART-PROPS | Room-specific prop art | ⬜ | ART_NOTES | Replace placeholder accent badges with real art |
| P6-ART-ANIM | Enhanced pet animations | ⬜ | ART_NOTES | Framer-motion or CSS keyframes for richer movement |

### Audio

| ID | Task | Status | Source | Notes |
|----|------|--------|--------|-------|
| P6-AUDIO-ASSETS | Add real audio files | ⬜ | QA-002 | Hook actual SFX/BGM into `public/audio/` |
| P6-AUDIO-ROOM | Room-specific music | ⬜ | AUDIO_NOTES | Different tracks per room |
| P6-AUDIO-TOD | Time-of-day ambience | ⬜ | AUDIO_NOTES | Morning/evening/night variations |
| P6-AUDIO-MIX | Audio mixing & ducking | ⬜ | AUDIO_NOTES | Volume balancing, SFX/BGM ducking |
| P9-3 | Feeding sound variants | ⬜ | TASKS.md | Reaction-specific sounds (loved, liked, disliked) |
| P9-5 | Pet emotional sounds | ⬜ | TASKS.md | sad, hungry sounds (pet_happy done) |
| P9-6 | Vibration feedback | ⬜ | TASKS.md | Android haptic patterns |
| P9-7 | Volume sliders UI | ⬜ | QA-004 | Master, Music, SFX sliders (toggles exist) |

### Environment & UX

> **Note:** Core room/environment tasks are now in "Bible v1.4 Compliance Tasks" section above.

| ID | Task | Status | Source | Notes |
|----|------|--------|--------|-------|
| P6-ENV-KITCHEN | Kitchen behaviors | ⬜ | ART_NOTES | Special feeding UI or bonuses |
| P6-ENV-BEDROOM | Bedroom behaviors | ⬜ | ART_NOTES | Sleep/rest mechanics |
| P6-ABILITY-UI | Ability activation indicators | ⬜ | P1-ABILITY-4 | Show "+25%" when Fizz bonus applies |
| P6-MOOD-SYSTEM | Full mood decay system | ⬜ | TASKS.md | Enables Grib's Chill Vibes ability fully |

### PWA & Offline

| ID | Task | Status | Source | Notes |
|----|------|--------|--------|-------|
| P6-PWA-PRECACHE | vite-plugin-pwa integration | ⬜ | TASKS.md | Richer precache manifest and SW |
| P6-PWA-UI | "Install Grundy" button | ⬜ | QA-005 | Settings UI using existing `promptInstall()` |
| P6-PWA-UPDATE | Update notification | ⬜ | PWA_NOTES | "New version available" toast |
| P6-PWA-OFFLINE | Enhanced offline support | ⬜ | PWA_NOTES | Pre-cache more assets for offline mini-games |

### FTUE & Modes

| ID | Task | Status | Source | Notes |
|----|------|--------|--------|-------|
| P6-FTUE-MODES | Cozy vs Classic differentiation | ⬜ | General | Actual gameplay differences per mode |
| P6-FTUE-A11Y | FTUE accessibility polish | ⬜ | General | Screen reader testing, additional labels |

### Display State System

| ID | Task | Status | Source | Notes |
|----|------|--------|--------|-------|
| P2-1 | Create `getDisplayState()` | ⬜ | TASKS.md | Returns state based on priority |
| P2-2 | Implement transient states | ⬜ | TASKS.md | Eating, excited, pooping |
| P2-3 | Implement need states | ⬜ | TASKS.md | Hungry, sad, crying at thresholds |
| P2-4 | Implement ambient states | ⬜ | TASKS.md | Happy, ecstatic based on mood |
| P2-5 | Connect sprites to states | ⬜ | TASKS.md | Pet shows correct sprite |
| P2-6 | Implement eating reactions | ⬜ | TASKS.md | loved, liked, neutral, disliked visuals |

### Documentation & Bible

| ID | Task | Status | Source | Notes |
|----|------|--------|--------|-------|
| P6-DOC-BIBLE | Bible v1.4 merge | ✅ | General | Merged v1.4 amendments: cooldown/fullness rules, no-gems-from-mini-games, HUD rules, nav/mobile constraints, Rooms Lite notes, FTUE/art clarifications |
| P6-DOC-ROADMAP | Roadmap update | ⬜ | General | Phase 6+ roadmap with Web 1.0 as baseline |

---

## Priority Recommendations

### Critical (Bible v1.4 Core Loop Compliance)

> These tasks close the gap between Web 1.0 and Bible v1.4 requirements.

1. **P6-CORE-COOLDOWN** — Enforce 30-min feeding cooldown per Bible §4.3
2. **P6-CORE-STUFFED** — Block feeding at STUFFED state per Bible §4.4
3. **P6-HUD-PRODUCTION** — Production HUD: Bond-only per Bible §4.4
4. **P6-HUD-DEBUG** — Gate debug stats behind dev flag

### High Priority (Quick Wins + UX)

5. **P6-BRANDING** — Visual impact, required for store submission
6. **P6-MOBILE-LAYOUT** — Enforce mobile viewport constraints per Bible §14.6
7. **P6-AUDIO-ASSETS** — Noticeable polish, SFX/BGM config already wired
8. **P6-PWA-UI** — Simple Settings button, infrastructure exists

### Medium Priority (UX Polish)

9. **P9-7** — Volume sliders for user control
10. **P6-ABILITY-UI** — Player feedback for abilities
11. **P6-ENV-ROOMS** — Activity→room mapping per Bible §14.4
12. **P6-NAV-CONFIRM** — Pet switch confirmation modals

### Lower Priority (Deeper Features)

13. **P6-ART-POSES** — Requires new art assets
14. **P6-FTUE-MODES** — Gameplay differentiation
15. **P2-*** — Display state system (larger scope)

---

## Not In Scope for Phase 6

The following are explicitly deferred to later phases:

- **P10-*** — Lore Journal (Phase 10)
- **P11-*** — Cosmetics System (Phase 11)
- **P12-*** — Season Pass, Ads, LiveOps (Phase 12)
- **Shop & Economy** — Separate workstream
- **Multi-pet / Pet Slots** — Separate workstream
- **Classic Mode (neglect/runaway)** — Separate workstream

---

## QA Issue Mapping

| QA ID | P6 Task | Severity | Notes |
|-------|---------|----------|-------|
| QA-001 | P6-BRANDING | S4 | PWA icons are placeholders |
| QA-002 | P6-AUDIO-ASSETS | S4 | No actual audio files |
| QA-003 | P6-ENV-UI, P6-ENV-ROOMS | S3 | Room selection UI missing; activity→room mapping needed |
| QA-004 | P9-7 | S4 | Volume sliders (toggles work) |
| QA-005 | P6-PWA-UI | S3 | Install button missing |

All QA S3/S4 issues are mapped to Phase 6 tasks.

### Bible v1.4 Gap Mapping

| Bible Section | Gap | P6 Task |
|---------------|-----|---------|
| §4.3 Cooldown System | No cooldown implemented | P6-CORE-COOLDOWN |
| §4.4 Fullness States | STUFFED doesn't block feeding | P6-CORE-STUFFED |
| §4.4 Stats System | Stats visible in production HUD | P6-HUD-PRODUCTION, P6-HUD-DEBUG |
| §14.4 Environments | Activity→room not implemented | P6-ENV-ROOMS |
| §14.5 Navigation | Pet switch has no confirmation | P6-NAV-CONFIRM |
| §14.6 Mobile Layout | Viewport constraints not enforced | P6-MOBILE-LAYOUT |
| §13.7 Production Art | Need visual regression test | P6-ART-TEST |

---

## Implementation Notes

### Adding Audio Assets

1. Create audio files in `public/audio/` matching `SOUND_CONFIG` paths
2. Test with `audioManager.playSound('id')` in browser console
3. Adjust volumes in `src/audio/config.ts` as needed

### Adding Install Button

```tsx
// In SettingsView.tsx
import { canInstall, promptInstall } from '../pwa';

{canInstall() && (
  <button onClick={promptInstall}>Install Grundy</button>
)}
```

### Adding Volume Sliders

1. Add `soundVolume` and `musicVolume` to store state (0-1 range)
2. Add range inputs in SettingsView
3. Update audioManager to use global volume multiplier

---

## Files to Update

| Task | Primary Files |
|------|---------------|
| P6-BRANDING | `public/icons/*.png` |
| P6-AUDIO-ASSETS | `public/audio/*.mp3` |
| P6-PWA-UI | `src/views/SettingsView.tsx` |
| P9-7 | `src/game/store.ts`, `src/audio/audioManager.ts`, `SettingsView.tsx` |
| P6-ENV-UI | `src/views/HomeView.tsx`, `src/components/environment/` |
| P6-ABILITY-UI | Components that call ability functions |

---

*This document is the single source of truth for Phase 6+ backlog. Phase 6 = Bible v1.4 compliance. See TASKS.md for formal task tracking.*
