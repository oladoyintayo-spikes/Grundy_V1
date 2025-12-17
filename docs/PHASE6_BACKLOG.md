# Grundy – Phase 6+ Backlog

> ⚠️ **Historical Document** — This document is a historical record from Phase 6.
> For current specifications, see `docs/GRUNDY_MASTER_BIBLE.md` v1.11.

**Last Updated:** December 11, 2024 (P6-BACKLOG-TIER1)
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
| `docs/BIBLE_COMPLIANCE_TEST.md` | BCT test contract with all BCT-* IDs |
| `docs/QA_WEB1_ISSUES.md` | 5 S3/S4 issues (QA-001 to QA-005) |
| `docs/AUDIO_NOTES.md` | Audio future improvements |
| `docs/PWA_NOTES.md` | PWA future improvements |
| `docs/ART_NOTES.md` | Art expansion items |
| `TASKS.md` | Deferred systems (P2-*, P9-*, P10-*, P11-*) |
| `GRUNDY_DEV_STATUS.md` | P1-ABILITY-4 |

---

## Tier 1 – Bible Compliance & Player-Facing Fixes

> **These tasks close the gap between Web 1.0 and Bible v1.4.** Each task maps directly to real player pain and has explicit Bible and BCT references.

### P6-CORE-LOOP — Core feeding, fullness, and evolution compliance

**Theme:** Core Loop

**Scope:**
- Implement 30-min feed cooldown and "stuffed" behavior per Bible v1.4
- Prevent spam feeding / spam leveling when a pet is full
- Ensure XP/level gain curves match the Bible
- Ensure evolution thresholds are enforced (Youth → 10, Evolved → 25, no other thresholds)

**Bible refs:**
- §4.3 (Cooldown System)
- §4.4 (Stats System / Fullness States)
- §6.1 (Evolution System — thresholds LOCKED)

**BCT refs:**
- BCT-CORE-001 (Feeding cooldown exists)
- BCT-CORE-002 (Cooldown reduces feed value)
- BCT-CORE-003 (STUFFED blocks feeding)
- BCT-EVOL-001 (Evolution thresholds)

**Status:** ⬜ Not Started

---

### P6-ECON-WEB — Web economy & gems (no gems from mini-games)

**Theme:** Economy

**Scope:**
- Enforce mini-game daily cap and energy rules (3/day max per game, first game free)
- Guarantee mini-games NEVER award gems on Web
- Align gem sources with Bible v1.4, with any mini-game gem sources disabled for Web
- Verify reward tier values match Bible §8.3

**Bible refs:**
- §8.2 (Energy System — 10 energy/play, first free, 50 max)
- §8.3 (Reward Tiers — NO GEMS in any tier)
- §11.4 (Gem Economy — gem sources by platform)

**BCT refs:**
- BCT-ECON-001 (No gems from mini-games)
- BCT-ECON-002 (Daily mini-game cap)
- BCT-ECON-003 (First game free)
- BCT-GAME-001 (Energy cost)
- BCT-GAME-002 (Reward tiers)

**Status:** 🟡 Partially Verified (economy rules enforced in Web 1.0, needs BCT coverage)

---

### P6-HUD-CLEANUP — Production HUD vs debug HUD

**Theme:** UX / HUD

**Scope:**
- Ensure production HUD shows only player-facing values (Bond, coins, gems)
- Move internal counters (feed count, raw XP, debug stats) behind a dev/QA-only view or flag
- Clarify currency row so gem display is honest and aligned with Web rules
- Gate debug HUD behind `import.meta.env.DEV`

**Bible refs:**
- §4.4 (Stats System — "Bond is visible"; dev exception for other stats)

**BCT refs:**
- BCT-HUD-001 (Production HUD Bond-only)
- BCT-HUD-002 (Debug HUD gated)

**Status:** ⬜ Not Started

---

### P6-PET-HOME — Active pet, selection flow, and Home behavior

**Theme:** Navigation / Pet UX

**Scope:**
- Home screen shows only the active pet, not all pets at the top
- Implement a deliberate pet change flow (e.g., via Settings/Profile) with a confirmation/warning
- Ensure the "Home" button reliably navigates to Home on both desktop and mobile
- Auto-save current pet state before switching

**Bible refs:**
- §3.2 (Pet Unlock & Abilities — starter selection)
- §14.5 (Navigation Structure — pet switch confirmation)

**BCT refs:**
- BCT-NAV-001 (Pet switch confirmation)
- BCT-LAYOUT-001 (Mobile viewport — pet visible)

**Status:** ⬜ Not Started

---

### P6-ENV-ROOMS — Rooms Lite & time-of-day behavior

**Theme:** Environment

**Scope:**
- Wire activity → room mapping:
  - Feeding → Kitchen
  - Sleeping → Bedroom
  - Play → Playroom
  - Default/idle → Living Room
- Ensure room background and time-of-day state remain in sync
- No "evening text" with random living room mismatch

**Bible refs:**
- §14.4 (Environments — activity-to-room mapping, time-of-day)

**BCT refs:**
- BCT-ENV-001 (Activity-to-room mapping)
- BCT-ENV-002 (Time-of-day)

**Status:** 🟡 Partial (time-of-day exists; activity→room not wired)

---

### P6-FTUE-INTRO — FTUE lore text & intro experience

**Theme:** FTUE

**Scope:**
- Ensure FTUE lore copy exactly matches the locked text from Bible §7.4:
  - Line 1: "Sometimes, when a big feeling is left behind…"
  - Line 2: "A tiny spirit called a Grundy wakes up."
  - Line 3: "One of them just found *you*."
- Smooth out intro transitions so text appears without laggy, broken animations
- FTUE completes in <60 seconds

**Bible refs:**
- §7.4 (Screen 2: World Intro — LOCKED text)
- §7.8 (FTUE Rules — <60s completion)

**BCT refs:**
- BCT-FTUE-001 (World intro copy locked)
- BCT-FTUE-002 (FTUE completion time)

**Status:** 🟡 Partial (copy exists; needs verification against Bible)

---

### P6-MOBILE-LAYOUT — Mobile core loop & navigation

**Theme:** Mobile UX

**Scope:**
- On a typical mobile viewport (360×640 to 414×896), the core loop is playable without vertical scrolling:
  - Pet visible and centered
  - Primary actions (feed) visible without scroll
  - Currency row visible
  - Bottom nav visible
- Move "Open Shop" to a sensible, discoverable location (e.g., top corner)
- Ensure Games and Settings are visible/accessible on mobile

**Bible refs:**
- §14.6 (Mobile Layout Constraints)
- §14.5 (Navigation Structure)

**BCT refs:**
- BCT-LAYOUT-001 (Mobile viewport constraint)
- BCT-NAV-001 (Pet switch confirmation)

**Status:** ⬜ Not Started

---

### P6-QA-BCT — Bible Compliance tests wired to real systems

**Theme:** QA / Infra

**Scope:**
- Implement first slice of Bible Compliance tests using real store/actions/UI, not mocks:
  - Feeding / fullness / cooldown
  - Evolution thresholds
  - Mini-game caps & "no gems from mini-games"
  - HUD basics
  - FTUE lore
  - One representative mobile layout/nav check
- Wire BCT tests into CI with clear commands:
  - `npm test` — runs all unit tests including BCT specs
  - `npm run test:e2e` — runs Playwright E2E tests including bible-compliance.e2e.ts

**Bible refs:**
- All sections referenced above (§4.3-4.4, §6.1, §7.4, §8.2-8.3, §14.4-14.6)

**BCT refs (all Tier 1):**
- BCT-CORE-001, BCT-CORE-002, BCT-CORE-003
- BCT-EVOL-001
- BCT-ECON-001, BCT-ECON-002, BCT-ECON-003
- BCT-GAME-001, BCT-GAME-002
- BCT-HUD-001, BCT-HUD-002
- BCT-NAV-001
- BCT-LAYOUT-001
- BCT-ENV-001, BCT-ENV-002
- BCT-FTUE-001, BCT-FTUE-002

**Status:** 🟡 Partial (BCT spec tests + E2E framework created in P6-BCT-INTEGRATE; needs real system wiring)

---

## Tier 1 Summary

| ID | Theme | Status | Key Bible | Key BCT |
|----|-------|--------|-----------|---------|
| P6-CORE-LOOP | Core Loop | ⬜ | §4.3, §4.4, §6.1 | BCT-CORE-*, BCT-EVOL-001 |
| P6-ECON-WEB | Economy | 🟡 | §8.2, §8.3, §11.4 | BCT-ECON-*, BCT-GAME-* |
| P6-HUD-CLEANUP | HUD | ⬜ | §4.4 | BCT-HUD-* |
| P6-PET-HOME | Pet UX | ⬜ | §3.2, §14.5 | BCT-NAV-001, BCT-LAYOUT-001 |
| P6-ENV-ROOMS | Environment | 🟡 | §14.4 | BCT-ENV-* |
| P6-FTUE-INTRO | FTUE | 🟡 | §7.4, §7.8 | BCT-FTUE-* |
| P6-MOBILE-LAYOUT | Mobile | ⬜ | §14.5, §14.6 | BCT-LAYOUT-001, BCT-NAV-001 |
| P6-QA-BCT | QA/Infra | 🟡 | All Tier 1 | All Tier 1 BCT-* |

---

## Tier 2 – Enhancements & Polish

> **These tasks improve the experience but are not required for Bible v1.4 compliance.** They can be done after Tier 1 is complete.

### Branding & Visual Polish

| ID | Task | Status | Source | Notes |
|----|------|--------|--------|-------|
| P6-BRANDING | Replace placeholder PWA icons | ⬜ | QA-001 | Icons in `public/icons/` are 70-byte placeholders |
| P6-ART-POSES | Additional pet poses | ⬜ | ART_NOTES | eating, excited, pooping poses |
| P6-ART-PROPS | Room-specific prop art | ⬜ | ART_NOTES | Replace placeholder accent badges with real art |
| P6-ART-ANIM | Enhanced pet animations | ⬜ | ART_NOTES | Framer-motion or CSS keyframes for richer movement |
| P6-ART-PRODUCTION | Verify sprites in production builds | 🟡 | §13.7 | PetAvatar uses sprites; verify no emoji fallback in prod |
| P6-ART-TEST | Add visual regression test | ⬜ | §13.7 | Test that no emoji appears where sprites should |

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

### Environment & UX (Non-Tier-1)

| ID | Task | Status | Source | Notes |
|----|------|--------|--------|-------|
| P6-ENV-KITCHEN | Kitchen behaviors | ⬜ | ART_NOTES | Special feeding UI or bonuses |
| P6-ENV-BEDROOM | Bedroom behaviors | ⬜ | ART_NOTES | Sleep/rest mechanics |
| P6-ENV-UI | Room selection UI | ⬜ | §14.4 | Explicit room switcher (QA-003) |
| P6-ABILITY-UI | Ability activation indicators | ⬜ | P1-ABILITY-4 | Show "+25%" when Fizz bonus applies |
| P6-MOOD-SYSTEM | Full mood decay system | ⬜ | TASKS.md | Enables Grib's Chill Vibes ability fully |
| P6-NAV-CONFIRM | Add pet switch confirmation | ⬜ | §14.5 | "Switch to Grib?" modal per Bible design |

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
| P6-DOC-BIBLE | Bible v1.4 merge | ✅ | General | Merged v1.4 amendments |
| P6-DOC-ALIGN | Phase 6 docs Bible sync | ✅ | General | Synced P6 docs with Bible v1.4 |
| P6-DOC-ROADMAP | Roadmap update | ⬜ | General | Phase 6+ roadmap with Web 1.0 as baseline |

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
| §4.3 Cooldown System | No cooldown implemented | P6-CORE-LOOP |
| §4.4 Fullness States | STUFFED doesn't block feeding | P6-CORE-LOOP |
| §4.4 Stats System | Stats visible in production HUD | P6-HUD-CLEANUP |
| §6.1 Evolution | Need threshold enforcement test | P6-CORE-LOOP |
| §7.4 FTUE | Need lore copy verification | P6-FTUE-INTRO |
| §8.2-8.3 Mini-games | Need BCT coverage | P6-ECON-WEB |
| §14.4 Environments | Activity→room not implemented | P6-ENV-ROOMS |
| §14.5 Navigation | Pet switch has no confirmation | P6-PET-HOME |
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
