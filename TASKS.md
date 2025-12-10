# TASKS.md
## Grundy Development Task List

**Last Updated:** December 2024  
**Design SoT:** `docs/GRUNDY_MASTER_BIBLE.md`

---

## How To Use This File

1. **Find next task** — Look for first `⬜ TODO` in your assigned phase
2. **Read Bible section** — Understand the spec before coding
3. **Implement** — Follow patterns in `ORCHESTRATOR.md`
4. **Test** — All tests must pass
5. **Update status** — Change `⬜ TODO` to `✅ DONE`
6. **Commit** — Use conventional commit format with task ID
7. **Repeat** — Move to next task

### Status Legend

| Symbol | Meaning |
|--------|---------|
| ⬜ | TODO — Not started |
| 🔄 | IN PROGRESS — Being worked on |
| ✅ | DONE — Complete and tested |
| ⏸️ | BLOCKED — Waiting on dependency |
| ❌ | CANCELLED — No longer needed |

---

## GAP ANALYSIS: Code vs Bible

> Last analyzed: December 2024

### System Status Overview

| System | Bible Section | Status | Gap Summary |
|--------|---------------|--------|-------------|
| **FTUE / Onboarding** | 7 | 🟡 PARTIAL | Tutorial exists, but lore intro, mode select, personality dialogue missing |
| **Core Loop (Feeding)** | 4, 5 | 🟡 PARTIAL | Basic feeding works; affinity matrix, weight system, some reactions missing |
| **Lore Journal** | 6.4 | 🔴 MISSING | Not implemented — fragments, unlocks, journal UI all needed |
| **Mini-Games** | 8 | 🟡 PARTIAL | Snack Catch exists; Memory Match, Rhythm Tap, Poop Scoop missing; energy system missing |
| **Shop & Economy** | 11 | 🟡 PARTIAL | Basic shop exists; tabs, categories, bundles, inventory expansion missing |
| **Pet Slots** | 11.6 | 🔴 MISSING | Not implemented — multi-pet care system |
| **Cozy vs Classic** | 9 | 🟡 PARTIAL | Mode toggle exists; sickness, neglect warnings, runaway mechanic missing |
| **Art / Sprite States** | 13.6 | 🟡 PARTIAL | Basic sprites work; state resolution function, weight variants missing |
| **Sound & Vibration** | 12 | 🔴 MISSING | Not implemented — Web Audio, vibration patterns |
| **Pet Abilities** | 3.7 | 🟡 PARTIAL | Some abilities work; need audit for all 8 pets |
| **Progression** | 6 | 🟢 ALIGNED | XP formula, level curve working |
| **PWA / Deploy** | 15 | 🟡 PARTIAL | Manifest exists; needs verification and deployment |

### Gap Legend

| Status | Meaning |
|--------|---------|
| 🟢 ALIGNED | Code matches Bible spec |
| 🟡 PARTIAL | Some features implemented, gaps remain |
| 🔴 MISSING | Not implemented at all |
| 🟠 MISALIGNED | Implemented but conflicts with Bible |

---

## PHASE 0: Pre-Flight (BLOCKING)

> Complete these before any feature work.

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P0-0 | Scaffold missing toolchain | ✅ | — | vite.config.ts, main.tsx, App.tsx, index.css, tailwind/postcss configs exist |
| P0-1 | Verify build compiles | ✅ | — | `npm run build` succeeds with no errors |
| P0-2 | Verify tests pass | ✅ | — | `npm test` passes all existing tests |
| P0-3 | Hide DevPanel in production | ✅ | — | N/A: No DevPanel exists yet; README gems fixed (0→10) |
| P0-4 | Verify PWA manifest exists | ✅ | 15.2 | manifest.json created, index.html linked; icons need replacement |
| P0-5 | Deploy to GitHub Pages | ✅ | — | Workflow created; URL: oladoyintayo-spikes.github.io/Grundy_V1/ |
| P0-6 | Add loading state for initial render | ✅ | — | Spinner + paw emoji shown until React mounts |
| P0-7 | Mobile viewport verification | ⬜ | — | Proper scaling on mobile devices |
| P0-8 | Add error boundary | ⬜ | — | Graceful crash recovery |

---

## PHASE 1: Core Systems Alignment

> Ensure existing code matches Bible specs.

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P1-1 | Audit pet definitions match Bible | ⬜ | 3.x | All 8 pets have correct abilities, colors, unlock costs per Section 3 |
| P1-2 | Audit food definitions match Bible | ⬜ | 5.x | All foods have correct stats, costs per Section 5.4 |
| P1-3 | Implement complete affinity matrix | ⬜ | 5.5 | All 8 pets × all foods affinity matches Bible table |
| P1-4 | Verify XP formula matches Bible | ⬜ | 6.2 | `XP(L) = 20 + (L² × 1.4)` implemented correctly |
| P1-5 | Verify mood tiers match Bible | ⬜ | 4.2 | 5 mood tiers with correct XP multipliers |
| P1-6 | Verify affinity multipliers | ⬜ | 5.3 | Loved=2×, Liked=1.5×, Neutral=1×, Disliked=0.5× |
| P1-7 | Audit pet abilities implementation | ⬜ | 3.7 | All 8 pet abilities trigger correctly per Bible |
| P1-8 | Implement pet ability indicators | ⬜ | 3.7 | Show "+25% 🎮" style indicators when ability triggers |

### P1-DOC: Documentation Alignment

| ID | Task | Status | Scope | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P1-DOC-01 | Apply Bible Update Backlog | ⬜ | `BIBLE_UPDATE_BACKLOG.md` | All ⬜ entries in backlog are applied to Bible and marked ✅ |

### P1-ART: Asset Creation

| ID | Task | Status | Scope | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P1-ART-01 | Create PWA icons | ⬜ | `public/` | icon-192.png and icon-512.png created with Grundy branding |

---

## PHASE 2: Art / Sprite State System

> Bible Section 13.6 — Connect stats to visual states.

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P2-1 | Create `getDisplayState()` function | ⬜ | 13.6 | Returns correct state based on stats priority |
| P2-2 | Implement transient state handling | ⬜ | 13.6 | Eating, excited, pooping states work |
| P2-3 | Implement need state handling | ⬜ | 13.6 | Hungry, sad, crying states at correct thresholds |
| P2-4 | Implement ambient state handling | ⬜ | 13.6 | Happy, ecstatic based on mood range |
| P2-5 | Connect sprites to display states | ⬜ | 13.6 | Pet component shows correct sprite for state |
| P2-6 | Implement eating reaction states | ⬜ | 13.6 | loved, liked, neutral, disliked eating animations |

---

## PHASE 3: FTUE / Onboarding Alignment

> Bible Section 7 — Complete onboarding flow.

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P3-1 | Audit current FTUE vs Bible | ⬜ | 7.x | Document gaps between implementation and spec |
| P3-2 | Implement world intro screen | ⬜ | 7.3 | 5-second lore snippet with fade-in text |
| P3-3 | Add pet origin snippets to selection | ⬜ | 7.4 | Each pet shows 2-line origin + loves/hates |
| P3-4 | Implement locked pet teasers | ⬜ | 7.4 | Locked pets show partial lore snippets |
| P3-5 | Add personality dialogue to tutorial | ⬜ | 7.6 | Pet-specific greetings, reactions per Bible tables |
| P3-6 | Implement mode select screen | ⬜ | 7.7 | Cozy vs Classic choice after tutorial |
| P3-7 | Enforce FTUE rules | ⬜ | 7.8 | No monetization, first reaction always positive |
| P3-8 | Verify <60 second FTUE timing | ⬜ | 7.1 | Total onboarding under 60 seconds |

---

## PHASE 4: Shop System

> Bible Section 11.5 — Complete shop implementation.

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P4-1 | Audit current shop vs Bible | ⬜ | 11.5 | Document gaps in item catalog, categories |
| P4-2 | Implement shop tabs | ⬜ | 11.5 | Food & Care, Cosmetics, Utility, Bundles, Event tabs |
| P4-3 | Implement tab visibility rules | ⬜ | 11.5 | Utility at Lv5+, Bundles at Lv3+, Event only during events |
| P4-4 | Add all Bible shop items | ⬜ | 11.5 | Complete item catalog from Bible tables |
| P4-5 | Implement item visibility rules | ⬜ | 11.5 | Level-locked grayed, bond-locked grayed, owned shows ✓ |
| P4-6 | Implement "Recommended For You" | ⬜ | 11.5 | Context-aware recommendations |
| P4-7 | Add purchase confirmation for gems | ⬜ | 11.1 | Confirm dialog for purchases ≥50 gems |
| P4-8 | Add shop milestones | ⬜ | 11.5 | "Window Shopper", "Coin Roller", etc. badges |

---

## PHASE 5: Inventory System

> Bible Section 11.7 — Inventory expansion.

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P5-1 | Add inventory capacity to state | ⬜ | 11.7 | `inventoryCapacity` field, default 15 |
| P5-2 | Implement capacity check on acquire | ⬜ | 11.7 | Cannot add food if inventory full |
| P5-3 | Add inventory expansion items | ⬜ | 11.7 | 4 tiers: 25/50/100/150 gems |
| P5-4 | Implement expansion purchase | ⬜ | 11.7 | Purchase increases capacity by 5, max 35 |
| P5-5 | Show capacity in UI | ⬜ | 11.7 | "12/15" style display in food bag |

---

## PHASE 6: Pet Slots (Multi-Pet)

> Bible Section 11.6 — Multi-pet care system.

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P6-1 | Add pet slots to state | ⬜ | 11.6 | `activeSlots: string[]`, `maxSlots: number` |
| P6-2 | Implement slot purchase | ⬜ | 11.6 | 100/150/200 gems for slots 2/3/4 |
| P6-3 | Update pet selector for slots | ⬜ | 11.6 | Can assign pet to slot, swap between slots |
| P6-4 | Implement parallel decay | ⬜ | 11.6 | All slotted pets decay independently |
| P6-5 | Update notifications for slots | ⬜ | 11.6 | Notifications can come from any slotted pet |
| P6-6 | Add slot UI indicator | ⬜ | 11.6 | Show which slot is active, quick-switch |

---

## PHASE 7: Classic Mode

> Bible Section 9 — Full neglect system.

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P7-1 | Implement sickness trigger | ⬜ | 9.4 | Hunger=0 for 4h OR random when overweight/dirty |
| P7-2 | Implement sick state | ⬜ | 9.4 | 2× decay, can't play games, shows sick sprite |
| P7-3 | Implement medicine cure | ⬜ | 9.4 | Medicine item cures instantly |
| P7-4 | Implement weight system | ⬜ | 5.7 | Hidden weight 0-100, visual stages, snack risk |
| P7-5 | Implement neglect warnings | ⬜ | 9.4 | 4-stage warning system before runaway |
| P7-6 | Implement runaway mechanic | ⬜ | 9.4 | Pet leaves after sustained neglect |
| P7-7 | Implement return options | ⬜ | 9.4 | 48h wait OR 25 gems, bond -50% |
| P7-8 | Hide care items in Cozy mode | ⬜ | 9.4 | Medicine, Diet Food not visible in Cozy |

---

## PHASE 8: Mini-Games

> Bible Section 8 — Complete all 4 mini-games.

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P8-1 | Audit Snack Catch matches Bible | ⬜ | 8.3 | Scoring, tiers, rewards match spec |
| P8-2 | Implement energy system | ⬜ | 8.2 | 50 max, 10/game, first daily free, regen 1/3min |
| P8-3 | Implement Memory Match | ⬜ | 8.4 | 4×4 grid, 60s, scoring per Bible |
| P8-4 | Implement Rhythm Tap | ⬜ | 8.5 | Timing game, 30-60s, scoring per Bible |
| P8-5 | Implement Poop Scoop | ⬜ | 8.6 | Tap-to-clean, 60s, scoring per Bible |
| P8-6 | Implement pet ability effects on games | ⬜ | 8.1 | Whisp peek, Plompo slow-mo, Grib 2× poop pts |
| P8-7 | Add daily high score tracking | ⬜ | 8.1 | Track and display daily best per game |

---

## PHASE 9: Sound & Vibration

> Bible Section 12 — Audio feedback.

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P9-1 | Create sound manager | ⬜ | 12.1 | Web Audio API wrapper with mute support |
| P9-2 | Implement UI sounds | ⬜ | 12.1 | Button tap, menu open/close, modal appear |
| P9-3 | Implement feeding sounds | ⬜ | 12.1 | Basic, liked, loved, disliked, full sounds |
| P9-4 | Implement reward sounds | ⬜ | 12.1 | XP gain, coin, gem, level up, unlock |
| P9-5 | Implement pet sounds | ⬜ | 12.1 | Happy, sad, hungry, poop, clean, sleep |
| P9-6 | Implement vibration patterns | ⬜ | 12.3 | Android-only patterns per Bible table |
| P9-7 | Add volume settings | ⬜ | 12.4 | Master, Music, SFX, Vibration toggles |

---

## PHASE 10: Lore Journal

> Bible Section 6.4 — Fragment collection system.

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P10-1 | Create journal data structure | ⬜ | 6.4 | Fragments, unlock states per pet |
| P10-2 | Create journal UI | ⬜ | 6.4 | Codex view, locked/unlocked fragment display |
| P10-3 | Implement fragment unlocks | ⬜ | 6.4 | Bond level triggers per Bible table |
| P10-4 | Implement general lore unlocks | ⬜ | 6.4 | Tutorial complete, 7 days, 3 pets, Bond 50 |
| P10-5 | Add preference notes auto-fill | ⬜ | 6.4 | Discovered preferences recorded |
| P10-6 | Implement completion rewards | ⬜ | 6.4 | Titles and cosmetics per milestone |

---

## PHASE 11: Cosmetics System

> Bible Section 11.5 (Cosmetics category).

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P11-1 | Add cosmetics to state | ⬜ | 11.5 | `ownedCosmetics`, `equippedCosmetics` |
| P11-2 | Create cosmetics data | ⬜ | 11.5 | All cosmetics from Bible with rarity, cost |
| P11-3 | Implement cosmetic purchase | ⬜ | 11.5 | Gems only, shows "Owned ✓" after purchase |
| P11-4 | Implement cosmetic equip | ⬜ | 11.5 | Can equip hat, accessory, aura per pet |
| P11-5 | Render equipped cosmetics | ⬜ | 11.5 | Cosmetics overlay on pet sprite |
| P11-6 | Implement rarity badges | ⬜ | 11.5 | Common/Uncommon/Rare/Epic/Legendary borders |

---

## PHASE 12: Future Systems (Deferred)

> These require additional planning or are post-MVP.

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P12-1 | Season Pass design | ⏸️ | 11.9 | 30-tier hybrid system |
| P12-2 | Season Pass implementation | ⏸️ | 11.9 | Free + Premium tracks, XP gain |
| P12-3 | Ad SDK integration | ⏸️ | 11.10 | Interstitials + rewarded ads |
| P12-4 | Rewarded ad opportunities | ⏸️ | 11.10 | 6 placement types per Bible |
| P12-5 | LiveOps scheduler | ⏸️ | 10 | Time-based events |
| P12-6 | Achievements system | ⏸️ | — | Full achievement framework |

---

## TESTING TASKS

> Run after each phase completion.

| ID | Task | Status | Scope |
|----|------|--------|-------|
| T-1 | Core loop test suite | ⬜ | Feed → XP → Level up → Rewards |
| T-2 | Economy test suite | ⬜ | Buy → Spend → Balance correct |
| T-3 | Multi-pet test suite | ⬜ | Switch pets → State preserved |
| T-4 | Persistence test suite | ⬜ | Refresh → State restored |
| T-5 | Mobile interaction tests | ⬜ | Touch interactions work |
| T-6 | PWA install test | ⬜ | Install to home screen works |
| T-7 | FTUE flow test | ⬜ | Complete onboarding <60s |
| T-8 | Mini-game scoring tests | ⬜ | Rewards match Bible tiers |

---

## TASK DEPENDENCIES

```
PHASE 0 (Pre-Flight) ←── BLOCKING
    ↓
PHASE 1 (Core Alignment)
    ↓
PHASE 2 (Art/Sprite States)
    ↓
┌───┬───┬───┬───┐
↓   ↓   ↓   ↓   ↓
P3  P4  P7  P8  P9
FTUE Shop Classic Mini Sound
        ↓
      P5 (Inventory)
        ↓
      P6 (Pet Slots)
        ↓
┌───────┴───────┐
↓               ↓
P10             P11
Lore Journal    Cosmetics
        ↓
      P12 (Future)
```

---

## QUICK REFERENCE

### Bible Section Lookup

| Topic | Section |
|-------|---------|
| Vision & Pillars | 1 |
| Lore & World | 2 |
| Pet profiles & abilities | 3 |
| Core systems (mood, bond) | 4 |
| Food & feeding | 5 |
| Progression & unlocks | 6 |
| Onboarding (FTUE) | 7 |
| Mini-games | 8 |
| Cozy/Classic modes | 9 |
| Events & LiveOps | 10 |
| Economy & Shop | 11 |
| Sound & Vibration | 12 |
| Animation & Art | 13 |
| UI/UX | 14 |
| Technical specs | 15 |
| Coverage notes | 16 |

### File Lookup

| Feature | Primary File |
|---------|--------------|
| Game state | `src/game/store.ts` |
| Pet data | `src/data/pets.ts` |
| Food data | `src/data/foods.ts` |
| Shop data | `src/data/shop.ts` |
| Types | `src/types/index.ts` |
| Config | `src/data/config.ts` |

---

## Notes

### Assumptions Made

1. `Assumption:` Current prototype has basic feeding loop working — needs verification in P0
2. `Assumption:` Snack Catch mini-game exists but may not match Bible scoring — needs audit in P8-1
3. `Assumption:` Mode toggle exists but Classic consequences not fully implemented — confirmed in Bible 15.6
4. `Assumption:` Test framework is Vitest based on CURRENT_SPRINT.md references

### Sources for This Analysis

- `docs/GRUNDY_MASTER_BIBLE.md` v1.3 (Section 15.6 Known Gaps)
- `docs/ASSET_MANIFEST.md` (120 sprites confirmed)
- `CURRENT_SPRINT.md` (existing sprint tasks merged)
- `docs/GRUNDY_ONBOARDING_FLOW.md` (FTUE detail)
- `docs/GRUNDY_LORE_CODEX.md` (journal fragment content)

---

*Update this file as you complete tasks. Keep it accurate.*
