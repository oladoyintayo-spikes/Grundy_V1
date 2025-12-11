# Grundy – Phase 6+ Backlog

**Last Updated:** December 10, 2024
**Scope:** Post-Web 1.0 Enhancements

---

## Overview

Web Edition 1.0.0 is locked and released. This backlog consolidates all non-blocking improvements, QA deferrals, and follow-up tasks for Phase 6 and beyond.

**Key Principles:**
- No breaking changes to Web 1.0 core loop
- Focus on polish, assets, and UX refinements
- Prepare foundation for Unity Edition port

---

## Source Inputs

| Source | Items Extracted |
|--------|-----------------|
| `docs/QA_WEB1_ISSUES.md` | 5 S3/S4 issues (QA-001 to QA-005) |
| `docs/AUDIO_NOTES.md` | Audio future improvements |
| `docs/PWA_NOTES.md` | PWA future improvements |
| `docs/ART_NOTES.md` | Art expansion items |
| `TASKS.md` | Deferred systems (P2-*, P9-*, P10-*, P11-*) |
| `GRUNDY_DEV_STATUS.md` | P1-ABILITY-4 |

---

## Backlog by Theme

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

| ID | Task | Status | Source | Notes |
|----|------|--------|--------|-------|
| P6-ENV-UI | Room selection UI | ⬜ | QA-003 | Explicit room switcher in Home view |
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

### High Priority (Quick Wins)

1. **P6-BRANDING** — Visual impact, required for store submission
2. **P6-AUDIO-ASSETS** — Noticeable polish, SFX/BGM config already wired
3. **P6-PWA-UI** — Simple Settings button, infrastructure exists

### Medium Priority (UX Polish)

4. **P9-7** — Volume sliders for user control
5. **P6-ABILITY-UI** — Player feedback for abilities
6. **P6-ENV-UI** — Room selection for variety

### Lower Priority (Deeper Features)

7. **P6-ART-POSES** — Requires new art assets
8. **P6-FTUE-MODES** — Gameplay differentiation
9. **P2-*** — Display state system (larger scope)

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
| QA-003 | P6-ENV-UI | S3 | Room selection UI missing |
| QA-004 | P9-7 | S4 | Volume sliders (toggles work) |
| QA-005 | P6-PWA-UI | S3 | Install button missing |

All QA S3/S4 issues are mapped to Phase 6 tasks.

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

*This document is the single source of truth for Phase 6+ backlog. See TASKS.md for formal task tracking.*
