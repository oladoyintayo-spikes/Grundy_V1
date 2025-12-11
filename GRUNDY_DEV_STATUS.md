# GRUNDY_DEV_STATUS.md

# Grundy Web Prototype — Development Status

**Last Updated:** December 11, 2024 (Phase 6 Audio & PWA Enhancements)
**Current Phase:** Web Phase 6 Tier 2 — DEV COMPLETE (CE Review Required)
**Next Phase:** Phase 7 (Classic Mode / Neglect System Runtime)

---

## Source of Truth

| Resource | Location |
|----------|----------|
| **Design SoT** | `docs/GRUNDY_MASTER_BIBLE.md` v1.5 |
| **Task List** | `TASKS.md` |
| **Agent Workflow** | `ORCHESTRATOR.md` |
| **Bible Update Log** | `BIBLE_UPDATE_BACKLOG.md` |
| **BCT Specs** | `docs/BIBLE_COMPLIANCE_TEST.md` v2.1 |

---

## Web Edition Phase Structure

| Web Phase | Theme | Status | Summary |
|-----------|-------|--------|---------|
| **Web Phase 0** | Setup & Toolchain | ✅ COMPLETE | Infrastructure, toolchain, PWA, GitHub Pages deploy |
| **Web Phase 1** | Core Loop & Data | ✅ COMPLETE | Data layer, core loop, abilities, docs alignment |
| **Web Phase 2** | Mini-Games & Infra | ✅ COMPLETE | All 5 mini-games implemented and tested |
| **Web Phase 3** | Navigation & Environment | 🟡 IN PROGRESS | P3-NAV ✅, P3-ENV ⬜ |
| **Web Phase 4** | FTUE / Onboarding | ✅ COMPLETE | All FTUE screens, state, tests done |
| **Web Phase 5** | Polish / Web 1.0 | ✅ RELEASE COMPLETE | Audio ✅, PWA ✅, Art ✅, UX/A11Y ✅, QA ✅, Release ✅ |
| **Web Phase 6** | Bible v1.4 Compliance | ✅ TIER 1 DEV COMPLETE | Tier 1 implemented; P6-ART-POSES ✅; P6-ABILITY-INTEGRATION ✅; 817 tests (191 BCT); CE Review Required |
| **Web Phase 6** | Bible v1.4 Compliance | ✅ TIER 1 DEV COMPLETE | Tier 1 implemented; P6-ART-POSES ✅; P6-ART-PRODUCTION ✅; P6-ART-TEST ✅; 1214 tests (594 BCT); CE Review Required |
| **Web Phase 6** | Tier 2 Polish | ✅ TIER 2 DEV COMPLETE | P6-AUDIO-ROOM ✅; P6-AUDIO-TOD ✅; P6-PWA-PRECACHE ✅; P6-PWA-UI ✅; P6-PWA-UPDATE ✅; 1224 tests; CE Review Required |

### Post-Web 1.0

| System | Status | Summary |
|--------|--------|---------|
| Art / Sprite States | ⬜ DEFERRED | Connect stats to visual states (getDisplayState) |
| Sound & Vibration | ✅ COMPLETE | Core audio (P5-AUDIO-CORE) + Room ambience (P6-AUDIO-ROOM) + TOD variations (P6-AUDIO-TOD); vibration deferred |
| Shop & Economy | ⬜ NOT STARTED | Shop tabs, gem confirm, milestones |
| Inventory | ⬜ NOT STARTED | Capacity, expansion items |
| Pet Slots | ⬜ NOT STARTED | Multi-pet care system |
| Classic Mode | 📋 SPEC COMPLETE | Bible v1.5 §9.4.3 Neglect & Withdrawal System defined; runtime implementation Phase 7 |

---

## Web Phase 1 — COMPLETE

**Theme:** Complete Data Layer & Core Loop Alignment

### Deliverables

| Area | Status | Details |
|------|--------|---------|
| **Pet Data** | ✅ | 8 pets with unique abilities (Munchlet, Grib, Plompo, Fizz, Ember, Chomper, Whisp, Luxe) |
| **Food Data** | ✅ | 10 foods with complete 80-entry affinity matrix |
| **Pet Unlock System** | ✅ | Starter pets (3) + unlock requirements for 5 premium pets |
| **Ability System** | ✅ | All 8 pet abilities implemented and tested |
| **Store Integration** | ✅ | Zustand store with pet selection, unlocking, feeding |
| **Evolution Thresholds** | ✅ | Aligned: Baby 1-9, Youth 10-24, Evolved 25+ |
| **Documentation** | ✅ | Bible §6.1, README, and backlog all synchronized |
| **Test Coverage** | ✅ | 102 Vitest tests passing |

### Evolution Threshold Alignment (P1-DOC-1)

| Stage | Old Bible | Code (SoT) | New Bible |
|-------|-----------|------------|-----------|
| Baby | 1-6 | 1-9 | 1-9 |
| Youth | 7-12 | 10-24 | 10-24 |
| Evolved | 13+ | 25+ | 25+ |

**Rationale:** Code wins for pacing. Slower evolution aligns with "Curved progression — fast early, slow late" design philosophy (Bible §6.2).

### Exit Criteria Met

| Check | Status |
|-------|--------|
| All 8 pets defined | ✅ |
| All 10 foods defined | ✅ |
| Affinity matrix complete (80 entries) | ✅ |
| Default pet is `munchlet` | ✅ |
| All 8 abilities implemented | ✅ |
| All tests pass (`npm test -- --run`) | ✅ |
| Build passes (`npm run build`) | ✅ |
| Bible/Code/README aligned | ✅ |

### Remaining Polish (Low Priority)

| Task | Status | Notes |
|------|--------|-------|
| P1-ABILITY-4 | ✅ | UI indicators for ability triggers (done in P6-ABILITY-UI) |
| P1-ART-1 | ⏸️ | PWA icons (blocked on branding) |

---

## Web Phase 2 — COMPLETE (Mini-Games)

**Theme:** Bible Section 8 — All 5 mini-games implemented.

### Mini-Games Implemented

| Game | Tests | Status | Notes |
|------|-------|--------|-------|
| Snack Catch | 27 | ✅ | 60s arcade catch game |
| Memory Match | 39 | ✅ | 90s card matching game |
| Pips | 38 | ✅ | 120s tile matching game |
| Rhythm Tap | 43 | ✅ | Music/timing rhythm game |
| Poop Scoop | 41 | ✅ | 60s cleanup action game |
| Unified Suite | 40 | ✅ | Cross-game invariants |

### Rules Enforced (LOCKED)

| Rule | Value |
|------|-------|
| Energy cost | 10 per game |
| Daily cap | 3 rewarded plays per game |
| First daily | FREE |
| Gems from mini-games | **NEVER** |
| Rewards | Small helpful gifts only |

---

## FTUE / Narrative

### World Intro Backstory (LOCKED)

The following copy is canonical and used across all onboarding documentation:

> Sometimes, when a big feeling is left behind…
> A tiny spirit called a Grundy wakes up.
> One of them just found *you*.

| Document | Status | Section |
|----------|--------|---------|
| `GRUNDY_ONBOARDING_FLOW.md` | ✅ | Screen 2 – World Intro |
| `GRUNDY_LORE_CODEX.md` | ✅ | Short World Intro (FTUE Copy) |
| `GRUNDY_MASTER_BIBLE.md` | ✅ | §7.4 Screen 2: World Intro |

**Task ID:** P4-FTUE-LORE (completed December 10, 2024)

---

## Build & Test Status

| Command | Status | Notes |
|---------|--------|-------|
| `npm run build` | ✅ PASSING | Production build succeeds |
| `npm test -- --run` | ✅ PASSING | 817 tests passing |
| `npm run test:bible` | ✅ PASSING | 191 BCT tests passing (incl. mood/ability/pet-behaviors/integration) |
| `npm test -- --run` | ✅ PASSING | 1224 tests passing |
| `npm run test:bible` | ✅ PASSING | 594 BCT tests passing (incl. mood/ability/pet-behaviors/art) |
| `npx tsc --noEmit` | ✅ PASSING | No type errors |

---

## Known Issues

*No critical issues at this time.*

### Resolved Issues

| Issue | Resolution | Date |
|-------|------------|------|
| Evolution threshold drift (Bible 7/13 vs Code 10/25) | Bible updated to match code (P1-DOC-1) | 2024-12-10 |
| Evolution stage naming (`adult` vs `evolved`) | Code renamed to `evolved` (P1-CORE-2) | 2024-12-10 |
| README starting gems (showed 0, should be 10) | README updated | 2024-12-10 |
| Mini-game gem reward discrepancy | Bible §8 updated: mini-games never award gems; Rainbow tier = coins/XP/food only (P2-DOC-2) | 2024-12-10 |

---

## What's Working

### Core Features
- Pet feeding with affinity-based reactions
- XP gain and level progression
- Mood system with decay
- Currency system (coins/gems)
- Pet selection and switching
- Pet unlock via gems
- Ability trigger indicators (toast notifications when abilities fire)

### Data Layer
- 8 pets with abilities and unlock requirements
- 10 foods with full affinity matrix
- Config-driven evolution thresholds
- XP formula: `20 + (L² × 1.4)`

### Infrastructure
- React 18 + TypeScript (strict mode)
- Zustand state management with persistence
- Vitest test suite
- Vite build system
- PWA (manifest + service worker + install prompt)
- GitHub Pages deployment
- Error boundary
- Audio system (SFX + BGM with settings)

---

## Web Phase 4 — COMPLETE (FTUE / Onboarding)

**Theme:** Bible Section 7 — Complete onboarding flow.

### FTUE Implementation

| Screen | Duration | Features |
|--------|----------|----------|
| Splash | 2s | Auto-advance or tap to skip |
| Age Gate | 3-5s | Single tap verification |
| World Intro | 5s | LOCKED canonical 3-line text |
| Pet Select | 10-15s | 3 starters + 5 locked teasers |
| Mode Select | 5s | Cozy vs Classic with features |
| First Session | 5-10s | Pet greeting + tips |

**Total Time:** 30-42 seconds (well under 60s target)

### Files Implemented

| File | Purpose |
|------|---------|
| `src/copy/ftue.ts` | Canonical FTUE copy source |
| `src/ftue/FtueFlow.tsx` | Main FTUE orchestrator |
| `src/ftue/screens/*.tsx` | 6 FTUE screen components |
| `docs/FTUE_AUDIT.md` | Bible compliance audit |

### Exit Criteria Met

| Check | Status |
|-------|--------|
| FTUE completes in <60s | ✅ (30-42s) |
| Mode selection works | ✅ |
| First feeding always positive | ✅ |
| World Intro shows LOCKED copy | ✅ |
| All tests pass | ✅ (417 tests) |

---

## Web Phase 5 — QA COMPLETE (Ready for Release)

**Theme:** Bible Section 9 — Polish & Web 1.0 Release

### Audio System (P5-AUDIO-CORE)

| Component | Status | Details |
|-----------|--------|---------|
| Audio Manager | ✅ | Central singleton with SFX/BGM controls |
| Sound Config | ✅ | 9 SFX configured (UI, mini-game tiers, pet events) |
| Music Config | ✅ | Background music with loop support |
| Store Integration | ✅ | setSoundEnabled/setMusicEnabled actions |
| Settings UI | ✅ | Toggle buttons in Settings view |
| Event Hooks | ✅ | UI taps, mini-game results, pet happy/level-up |
| Documentation | ✅ | docs/AUDIO_NOTES.md |
| Tests | ✅ | audioConfig.test.ts |

### PWA System (P5-PWA-CORE)

| Component | Status | Details |
|-----------|--------|---------|
| Web Manifest | ✅ | manifest.webmanifest with icons, colors |
| Service Worker | ✅ | Shell-focused caching, network-first strategy |
| SW Registration | ✅ | Progressive enhancement in main.tsx |
| Install Prompt | ✅ | beforeinstallprompt captured for future UI |
| Apple PWA | ✅ | Apple-specific meta tags in index.html |
| Documentation | ✅ | docs/PWA_NOTES.md |
| Tests | ✅ | pwaConfig.test.ts |

### Files Implemented

| File | Purpose |
|------|---------|
| `src/audio/types.ts` | Type definitions for SoundId, MusicTrackId |
| `src/audio/config.ts` | Sound and music configuration registry |
| `src/audio/audioManager.ts` | Central audio manager singleton |
| `docs/AUDIO_NOTES.md` | Audio system documentation |
| `public/manifest.webmanifest` | PWA manifest |
| `public/service-worker.js` | Service worker for shell caching |
| `src/pwa/index.ts` | PWA module exports |
| `src/pwa/serviceWorker.ts` | SW registration logic |
| `src/pwa/installPrompt.ts` | Install prompt handler |
| `docs/PWA_NOTES.md` | PWA documentation |

### Art System (P5-ART-PETS/ROOMS/DOC)

| Component | Status | Details |
|-----------|--------|---------|
| Pet Sprites Config | ✅ | `src/art/petSprites.ts` - Maps PetId + PetPose to assets/pets |
| Room Scenes Config | ✅ | `src/art/roomScenes.ts` - Room foreground visuals |
| PetAvatar Component | ✅ | `src/components/pet/PetAvatar.tsx` - Image-based pet display |
| RoomScene Component | ✅ | `src/components/environment/RoomScene.tsx` - Room overlay wrapper |
| Pet Visuals Helper | ✅ | `src/game/petVisuals.ts` - State-to-pose mapping |
| AppHeader Integration | ✅ | Pet avatar with real sprites in header |
| HomeView Integration | ✅ | PetDisplay using sprites instead of emoji |
| Documentation | ✅ | `docs/ART_NOTES.md` |
| Tests | ✅ | `src/__tests__/artConfig.test.ts` |

### UX & Accessibility System (P5-UX-A11Y)

| Component | Status | Details |
|-----------|--------|---------|
| Focus Ring Pattern | ✅ | FOCUS_RING_CLASS with amber-400 ring on all interactive elements |
| Keyboard Navigation | ✅ | tabIndex, keyboard handlers for non-button elements |
| ARIA Labels | ✅ | aria-current, aria-label, aria-pressed, aria-hidden |
| Semantic Roles | ✅ | banner, navigation, main, dialog, status, region, article |
| Heading Hierarchy | ✅ | Proper h1/h2 structure across all screens |
| Contrast Updates | ✅ | slate-400 → slate-300 for secondary text |
| Pet Alt Text | ✅ | petDisplayName + POSE_LABELS for descriptive alt text |
| Documentation | ✅ | docs/UX_A11Y_NOTES.md |
| Tests | ✅ | uxAccessibility.test.ts |

### Files Modified for Accessibility

| File | Changes |
|------|---------|
| `src/components/layout/BottomNav.tsx` | Focus ring, aria-current, navigation role |
| `src/components/layout/AppHeader.tsx` | Banner role, sr-only h1, status role, contrast |
| `src/components/pet/PetAvatar.tsx` | petDisplayName prop, POSE_LABELS, alt text |
| `src/components/MiniGameHub.tsx` | Focus ring, semantic header/footer, aria-labels |
| `src/components/ReadyScreen.tsx` | Focus ring, main role, h1, contrast |
| `src/components/ResultsScreen.tsx` | Focus ring, h1/h2, dl/dt/dd, aria-labels |
| `src/ftue/screens/*.tsx` | Focus ring, roles, headings, keyboard handlers |

### QA System (P5-QA-CORE)

| Component | Status | Details |
|-----------|--------|---------|
| QA Plan | ✅ | `docs/QA_PLAN_WEB1.md` - Scope, environments, test matrices |
| Issues Log | ✅ | `docs/QA_WEB1_ISSUES.md` - All issues documented |
| FTUE Validation | ✅ | New/returning player flows verified |
| Mini-Game Validation | ✅ | All 5 games, daily caps, NO GEMS rule verified |
| PWA Validation | ✅ | Manifest, SW, offline shell verified |
| Smoke Testing | ✅ | Core loop, navigation, audio verified |
| S1/S2 Issues | 0 | No blockers found |
| S3/S4 Issues | 5 | All deferred to Phase 6 |

### Release (P5-RELEASE-1.0)

| Component | Status | Details |
|-----------|--------|---------|
| Version Bump | ✅ | `src/version.ts` - GRUNDY_WEB_VERSION = '1.0.0' |
| Package Version | ✅ | `package.json` - version: "1.0.0" |
| Release Notes | ✅ | `docs/RELEASE_NOTES_WEB1.0.md` - Full feature summary |
| Tag Instructions | ✅ | `docs/RELEASE_TAG_WEB1.0.md` - Git tagging guide |
| Status Updates | ✅ | TASKS.md and GRUNDY_DEV_STATUS.md updated |

### Web Phase 5 Summary

- ✅ P5-AUDIO: Audio manager, SFX/BGM, settings, documentation
- ✅ P5-PWA: Manifest, service worker, install prompt, documentation
- ✅ P5-ART: Pet sprites, room scenes, integration, documentation
- ✅ P5-UX-A11Y: Keyboard navigation, focus styles, ARIA labels, contrast
- ✅ P5-QA: QA plan, execution, issues log, release recommendation
- ✅ P5-RELEASE: Web Edition 1.0.0 versioned and documented

**Web Edition 1.0.0 – COMPLETE** (next focus: Phase 6 optimizations and Unity Edition planning)

---

## Web Phase 6 – Bible v1.4 → v1.5 Compliance

**Goal:** Bring Web 1.0 up to Bible v1.4 specification. Bible updated to v1.5 with Neglect & Withdrawal System (§9.4.3).

**Bible v1.5 Update (December 2024):**
- §9.4.3 Neglect & Withdrawal System (Classic Mode Only) — Full spec added
- 5-stage neglect timeline: Normal → Worried (Day 2) → Sad (Day 4) → Withdrawn (Day 7) → Critical (Day 10) → Runaway (Day 14)
- Protection rules: FTUE protection + 48h new player grace period
- Recovery paths: Free (7 care days / 72h wait) and Paid (15💎 / 25💎)
- 23 BCT-NEGLECT test specifications added to BIBLE_COMPLIANCE_TEST.md
- Runtime implementation planned for Phase 7

**Backlog:** See `docs/PHASE6_BACKLOG.md` for full list of P6-* tasks and sources.

**DevStatus:** COMPLETE — All Tier 1 + Tier 2 + Audio/PWA tasks implemented. 1224 tests passing (598 BCT tests).
**CEStatus:** PENDING REVIEW
**QAStatus:** PENDING REVIEW

### Summary

Dev: Phase 6 Bible v1.5 compliance tasks implemented:
- **Tier 1:** P6-CORE-LOOP, P6-ECON-WEB, P6-HUD-CLEANUP, P6-PET-HOME, P6-ENV-ROOMS, P6-ENV-UI, P6-ENV-TOD, P6-NAV-GROUNDWORK, P6-FTUE-INTRO, P6-MOBILE-LAYOUT, P6-QA-BCT
- **Tier 2 Polish:** P6-ART-POSES, P6-MOOD-SYSTEM, P6-ABILITY-UI, P6-T2-PET-BEHAVIORS, P6-ART-PRODUCTION, P6-ART-TEST
- **Audio & PWA:** P6-AUDIO-ASSETS, P6-AUDIO-ROOM, P6-AUDIO-TOD, P6-PWA-PRECACHE, P6-PWA-UI, P6-PWA-UPDATE

Mood system (§4.5) with numeric moodValue 0-100, decay, and Grib/Plompo abilities. Pet behavior polish with transient eating poses and mood-based expressions. Ability indicators added (P1-ABILITY-4). **Art system: Pet sprites wired per pet/stage/pose with fallback chain; Home active pet uses PNG sprites when assets exist; emoji/orb fallbacks limited to DEV or true missing assets.** BCT suite passing (1224 tests, 598 BCT-specific incl. 401 BCT-ART tests, 23 BCT-NEGLECT specs).

**P6-AUDIO / P6-PWA Implementation (December 2024):**
- Audio: Room-specific ambience with crossfade transitions (Living Room, Kitchen, Bedroom, Playroom, Yard)
- Audio: Time-of-day volume multipliers (morning 0.9, day 1.0, evening 0.8, night 0.6)
- PWA: Service worker precaches shell assets (index.html, manifest, icons, splash)
- PWA: Install CTA in Settings (shows when beforeinstallprompt available, hidden after install)
- PWA: "New version available" toast with user-controlled refresh (no auto-skipWaiting)

**P6-MOOD-SYSTEM / P6-ABILITY-UI Verification (December 2024):**
- Mood tiers (ECSTATIC/HAPPY/CONTENT/LOW/UNHAPPY) match Bible §4.5
- Mood modifiers (+15 loved, +8 liked, +3 neutral, -10 disliked) aligned
- 6 wired abilities emit UI triggers: Munchlet, Grib, Fizz, Ember, Chomper, Luxe
- 2 passive abilities (no UI triggers): Plompo (decay_reduction), Whisp (rare_xp_chance) — intentionally deferred
- AbilityIndicator component added with bounce-in animation for HUD-clean feedback
- BCT-MOOD-01 through BCT-MOOD-07 passing (42 mood/ability tests)

**Bible v1.5 + BCT v2.1 Audit (P6-QA-BCT-AUDIT):** Verified alignment of core loop, mini-games, Rooms Lite, FTUE, HUD. Nav/env groundwork validated; room selector UI confirmed implemented (P6-ENV-UI). `bible.constants.ts` header updated to v1.5.

### Task Status Overview

| ID | Task | Status | Bible |
|----|------|--------|-------|
| **P6-DOC-BIBLE** | Bible v1.4 merge | ✅ | — |
| **P6-DOC-ALIGN** | Docs alignment to v1.4 | ✅ | — |
| **P6-CORE-LOOP** | Feeding, cooldown, evolution thresholds | ✅ | §4.3-4.4, §6.1 |
| **P6-CORE-COOLDOWN** | 30-min feeding cooldown | ✅ | §4.3 |
| **P6-CORE-STUFFED** | STUFFED blocks feeding | ✅ | §4.4 |
| **P6-ECON-WEB** | Mini-game caps & Web gem rules | ✅ | §8.2-8.3 |
| **P6-HUD-CLEANUP** | Production HUD vs debug HUD | ✅ | §4.4 |
| **P6-HUD-PRODUCTION** | Bond-only production HUD | ✅ | §4.4 |
| **P6-HUD-DEBUG** | Gate debug HUD behind dev flag | ✅ | §4.4 |
| **P6-PET-HOME** | Active pet & Home behavior | ✅ | §14.5 |
| **P6-NAV-CONFIRM** | Pet switch confirmation | ✅ | §14.5 |
| **P6-ENV-ROOMS** | Activity→room mapping | ✅ | §14.4 |
| **P6-ENV-UI** | Room selection UI | ✅ | §14.4 |
| **P6-ENV-TOD** | Time-of-day consistency | ✅ | §14.4 |
| **P6-NAV-GROUNDWORK** | Navigation structure groundwork | ✅ | §14.5 |
| **P6-FTUE-INTRO** | FTUE lore from bible.constants.ts | ✅ | §7.4 |
| **P6-MOBILE-LAYOUT** | Mobile viewport constraints | ✅ | §14.6 |
| **P6-QA-BCT** | Bible Compliance Test suite | ✅ | — |
| **P6-ART-POSES** | Extended pet sprite poses (11 poses) | ✅ | §13.7 |
| **P6-MOOD-SYSTEM** | Full mood decay system | ✅ | §4.5 |
| **P6-ABILITY-UI** | Ability activation indicators | ✅ | §3.7, §4.10 |
| **P6-T2-PET-BEHAVIORS** | Pet pose behavior wiring | ✅ | §4.5, §13.7 |
| **P6-ART-TEST** | BCT-ART tests (sprite coverage, no-orb guarantee) | ✅ | §13.7 |
| **P6-AUDIO-ASSETS** | Audit SFX/BGM assets | ✅ | — |
| **P6-AUDIO-ROOM** | Room-specific ambience | ✅ | — |
| **P6-AUDIO-TOD** | Time-of-day volume variations | ✅ | — |
| **P6-PWA-PRECACHE** | Core asset precaching | ✅ | — |
| **P6-PWA-UI** | Install CTA in Settings | ✅ | — |
| **P6-PWA-UPDATE** | New version toast | ✅ | — |

---

### Chief Engineer Verification Checklist – Phase 6

> Use this checklist to verify Phase 6 Tier 1 implementation before signing off.

**Build & Types:**
- [ ] `npx tsc --noEmit` passes (no type errors)
- [ ] `npm test` passes (full unit/spec suite — 1218 tests)

**Bible Compliance Tests (P6-QA-BCT):**
- [ ] `npm run test:bible` runs and passes all BCT spec tests (598 BCT tests)
- [ ] BCT test files exist in `src/__tests__/bct-*.spec.ts` (12 files incl. mood, ability, pet-behaviors, art, neglect specs)
- [ ] Bible E2E file exists: `e2e/bible-compliance.e2e.ts`

**Core Loop & Economy (Player-side sanity check):**
- [ ] Feeding when STUFFED (91–100 fullness) is blocked as expected
- [ ] Cooldown behavior matches Bible (visible "digesting" state; 25% value during cooldown)
- [ ] Mini-game daily cap (3 plays) works as described in the Bible
- [ ] First daily mini-game is free (no energy cost)
- [ ] No gems are awarded from mini-games on Web

**HUD & Navigation:**
- [ ] Production HUD shows Bond and currencies only; debug stats are hidden in non-dev builds
- [ ] DebugHud component is gated behind `import.meta.env.DEV`
- [ ] Only the active pet appears on Home; pet-switch flow requires explicit confirmation
- [ ] Pet switch confirmation modal shows pet name and reassurance message

**Environment & Mobile Layout:**
- [ ] Feeding → Kitchen, play → Playroom, default → Living Room
- [ ] Time-of-day ranges match Bible v1.5: Morning 6-12, Day 12-17, Evening 17-21, Night 21-6
- [ ] Room selector UI allows manual room selection; activities override manual selection
- [ ] On a typical phone viewport (390×844), pet + actions + currencies + bottom nav are visible without scroll

**FTUE (P6-FTUE-INTRO):**
- [ ] FTUE lore lines come from `src/constants/bible.constants.ts`
- [ ] Line 3 preserves the "*you*" emphasis exactly as in Bible v1.5

**Art / Poses (P6-ART-POSES):**
- [ ] Pets use sprite poses (not generic blobs) in production builds
- [ ] 11 poses wired: idle, happy, sad, sleeping, eating, eating_loved, ecstatic, excited, hungry, satisfied, crying
- [ ] Fullness/mood/eating states visibly change poses as expected

**Mood System (P6-MOOD-SYSTEM):**
- [ ] Mood tiers match Bible §4.5: Ecstatic 85-100, Happy 60-84, Content 40-59, Low 20-39, Unhappy 0-19
- [ ] Feeding affects mood: loved +15, liked +8, neutral +3, disliked -10
- [ ] Grib ability reduces mood penalty from dislikes by 20%
- [ ] Plompo ability reduces mood decay by 20%
- [ ] Mood value syncs with mood state string

**Ability Indicators (P1-ABILITY-4):**
- [ ] AbilityIndicator component shows toast when ability triggers
- [ ] Triggers auto-expire after 3 seconds
- [ ] Each pet's ability is correctly wired per Bible §3.2

**Pet Behaviors (P6-T2-PET-BEHAVIORS):**
- [ ] Feeding sets transient eating pose (~2 seconds)
- [ ] Transient pose takes priority over mood-based pose
- [ ] Pose transitions reflect mood value changes

### Economy Rules (Already Enforced)

| Rule | Status | Verification |
|------|--------|--------------|
| NO GEMS from mini-games | ✅ | Code + tests |
| Daily cap (3 plays) | ✅ | Code + tests |
| First-game-free | ✅ | Code + tests |

### Themes (Non-Bible Tasks)

| Theme | Key Tasks | Source | Status |
|-------|-----------|--------|--------|
| Branding & Visual | P6-BRANDING, P6-ART-POSES, P6-ART-PROPS | QA-001, ART_NOTES | 🟡 P6-BRANDING deferred |
| Audio Assets | P6-AUDIO-ASSETS, P6-AUDIO-ROOM, P6-AUDIO-TOD | QA-002, AUDIO_NOTES | ✅ COMPLETE |
| PWA Enhancements | P6-PWA-PRECACHE, P6-PWA-UI, P6-PWA-UPDATE | QA-005, PWA_NOTES | ✅ COMPLETE |
| FTUE & Modes | P6-FTUE-MODES | General | ⬜ Deferred |

### QA Issue Mapping

All QA S3/S4 issues from Web 1.0 are mapped to Phase 6 tasks:
- QA-001 → P6-BRANDING (deferred)
- QA-002 → P6-AUDIO-ASSETS ✅ (room ambience + TOD variations implemented)
- QA-003 → P6-ENV-ROOMS, P6-ENV-UI ✅
- QA-004 → P9-7 (deferred)
- QA-005 → P6-PWA-UI ✅ (install CTA + update toast implemented)

---

## Future Phases

### Unity Edition

- Port Web 1.0 design to Unity
- Separate versioning track for Unity Edition

### Later Web Phases

- **Phase 10:** Lore Journal (fragment collection)
- **Phase 11:** Cosmetics System
- **Phase 12:** Season Pass, Ads, LiveOps

---

## Verification Commands

```bash
# Build
npm run build

# Test
npm test -- --run

# Development
npm run dev
```

---

*This file is auto-maintained. For task details, see `TASKS.md`.*
