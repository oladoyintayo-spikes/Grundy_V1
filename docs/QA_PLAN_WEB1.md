# Grundy Web 1.0 — QA Plan

---
**Document Version:** 1.11
**Last Updated:** December 16, 2025
**Bible Alignment:** v1.11
**Status:** Current
---

**Version:** 1.0
**Date:** December 10, 2024
**Tasks:** P5-QA-SMOKE, P5-QA-FTUE, P5-QA-MINIGAMES, P5-QA-PWA, P5-QA-REPORT

---

## 1. Scope & Goals

### In Scope

- **Web Edition only** — React + TypeScript + Zustand prototype
- **Core loops:** FTUE, pet care (feeding, mood, XP), mini-games, navigation, audio, PWA shell
- **Target:** Confirm Web 1.0 is release-ready with no S1/S2 blockers

### Out of Scope

- Game economy changes (coins, XP, gems)
- Mini-game reward rule changes
- Pet stats, abilities, or evolution thresholds
- New features or Phase 6 backlog items
- Unity Edition

---

## 2. Environments

### Primary Test Environment

| Property | Value |
|----------|-------|
| Platform | Desktop browser |
| Browser | Latest Chromium-based (Chrome/Edge) |
| Screen Size | 1280x800 and 390x844 (mobile simulation) |
| Mode | Development (`npm run dev`) and Production (`npm run build && npm run preview`) |

### Secondary Test Environment

| Property | Value |
|----------|-------|
| Platform | Mobile simulation via Chrome DevTools |
| Device | iPhone 14 Pro (390x844) emulation |
| Touch | Simulated touch events |
| Network | Online and Offline (via DevTools) |

### Limitations

- No real mobile device testing (simulated only)
- No real screen reader testing (semantic checks only)
- No Safari/Firefox testing (Chromium-only)

---

## 3. Test Matrices

### 3.1 FTUE (P5-QA-FTUE)

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| **New player FTUE** | Clear localStorage → Load app | Splash → Age Gate → World Intro → Pet Select → Mode Select → First Session |
| **Splash auto-advance** | Wait 2s on splash | Auto-advances to Age Gate |
| **Splash tap skip** | Tap splash screen | Advances to Age Gate immediately |
| **Age Gate tap** | Tap "I'm old enough" | Advances to World Intro |
| **World Intro copy** | Read World Intro text | Shows exact LOCKED copy: "Sometimes, when a big feeling is left behind… A tiny spirit called a Grundy wakes up. One of them just found *you*." |
| **World Intro skip** | Tap/wait on World Intro | Advances to Pet Select |
| **Pet Select - starters** | View Pet Select | 3 starter pets visible and selectable (Munchlet, Grib, Plompo) |
| **Pet Select - locked** | View locked pets | 5 locked pets show origin teasers and unlock requirements |
| **Pet Select - confirm** | Select a pet, tap confirm | Advances to Mode Select |
| **Mode Select** | View Mode Select | Cozy and Classic modes with descriptions |
| **Mode Select - choose** | Tap Cozy or Classic | Advances to First Session |
| **First Session** | View First Session | Pet greeting displayed, tips shown |
| **FTUE complete** | Tap to continue | Home view loads, FTUE marked complete |
| **Returning player** | Reload app after FTUE | FTUE skipped, goes directly to Home |
| **FTUE timing** | Time full FTUE | Completes in <60s (target: 30-42s) |

### 3.2 Core Loop / Pet (P5-QA-SMOKE)

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| **Home view loads** | Complete FTUE | Home shows active pet, stats visible |
| **Pet avatar displays** | View Home | Pet sprite shows (not emoji placeholder) |
| **Feed pet** | Tap food item | Hunger increases, happiness may change, XP gained |
| **Feeding reaction** | Feed pet any food | Pet shows reaction (pose changes based on affinity) |
| **XP gain** | Feed pet | XP value increases (check store) |
| **Level up** | Feed until level up | Level increases, appropriate sound plays |
| **Coins display** | View header | Coins shown in header |
| **Energy display** | View header | Energy shown in header (X/50) |
| **Energy regeneration** | Wait or check timer | Energy regenerates over time |
| **Time-of-day background** | Check background colors | Background reflects current system time period |
| **Room scene** | Check Home view | Room scene overlay visible |

### 3.3 Navigation (P5-QA-SMOKE)

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| **Bottom nav visible** | Load app | 3-tab nav at bottom (Home/Games/Settings) |
| **Switch to Games** | Tap Games tab | MiniGameHub displayed |
| **Switch to Settings** | Tap Settings tab | Settings view displayed |
| **Switch to Home** | Tap Home tab | Home view displayed |
| **Tab indicator** | Switch tabs | Active tab highlighted |
| **No soft-lock** | Navigate all tabs | Can always return to Home |

### 3.4 Mini-Games (P5-QA-MINIGAMES)

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| **Games tab shows hub** | Tap Games | 5 mini-games listed |
| **Game cards display** | View MiniGameHub | Each game shows name, energy cost (10), daily cap |
| **First-play-free works** | Play first game of day | No energy deducted |
| **Energy decreases** | Play second game | 10 energy deducted |
| **Daily cap enforced** | Play 4+ games | 4th play shows no rewards earned |
| **Snack Catch playable** | Start Snack Catch | Game runs, can score points |
| **Memory Match playable** | Start Memory Match | Game runs, cards flip correctly |
| **Pips playable** | Start Pips | Game runs, tiles can be matched |
| **Rhythm Tap playable** | Start Rhythm Tap | Game runs, can tap beats |
| **Poop Scoop playable** | Start Poop Scoop | Game runs, can clean up |
| **Game results** | Complete any game | Results screen shows tier and rewards |
| **Reward tiers** | Score different amounts | Bronze/Silver/Gold/Rainbow tiers work |
| **No gems from games** | Complete mini-game | Rewards are coins/XP/food only, NEVER gems |
| **Fizz bonus** | Use Fizz pet (if unlocked) | +25% bonus applied to rewards |
| **Back from game** | Tap back/cancel | Returns to MiniGameHub without crash |

### 3.5 Audio (P5-QA-SMOKE)

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| **Sound setting visible** | Open Settings | Sound toggle visible |
| **Music setting visible** | Open Settings | Music toggle visible |
| **Sound toggle works** | Toggle sound off/on | Sound disabled/enabled |
| **Music toggle works** | Toggle music off/on | Music disabled/enabled |
| **UI tap sounds** | Tap buttons | ui_tap sound plays (if enabled) |
| **Game result sounds** | Complete mini-game | Tier-appropriate sound plays |
| **Pet feed sound** | Feed pet | pet_happy sound plays |
| **Level up sound** | Level up pet | pet_level_up sound plays |
| **Settings persist** | Toggle off, reload | Settings remain off |

### 3.6 PWA (P5-QA-PWA)

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| **Manifest loads** | Check DevTools → Application | manifest.webmanifest loaded |
| **Service worker registered** | Check DevTools → Application | SW active and controlling |
| **Install prompt** | Load on supported browser | beforeinstallprompt captured (check console) |
| **Offline shell** | Go offline → reload | App shell loads from cache |
| **Offline mini-game** | Go offline → play game | Game still playable (local state) |
| **Icon visible** | Check manifest | 192 and 512 icons configured |
| **Theme color** | Check manifest/meta | #0f172a theme color |

### 3.7 UX/A11Y (P5-QA-SMOKE)

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| **Tab through header** | Press Tab on Home | Focus moves through header elements |
| **Tab through nav** | Press Tab | Focus moves through bottom nav tabs |
| **Focus rings visible** | Tab through UI | Amber focus rings appear on interactive elements |
| **ARIA landmarks** | Inspect with DevTools | navigation, banner, main roles present |
| **Pet avatar alt text** | Inspect pet avatar | Alt text includes pet name and pose |
| **Heading hierarchy** | Check with axe/DevTools | h1 present on each screen |
| **Button types** | Inspect buttons | type="button" on non-submit buttons |
| **Contrast readable** | Visual inspection | Text legible against backgrounds |

---

## 4. Defect Classification

| Severity | Definition | Action |
|----------|------------|--------|
| **S1 – Blocker** | Cannot ship; breaks core flow or causes crash | Must fix before release |
| **S2 – Major** | Ship-blocker unless waived; significant UX issue | Fix if possible, waive with justification |
| **S3 – Minor** | Visual/UX nit; does not block user flow | Fix if low-risk, else defer to Phase 6 |
| **S4 – Trivial** | Nice-to-have polish item | Defer to Phase 6 |

---

## 5. Pass Criteria

Web 1.0 is release-ready when:

- [ ] No S1 issues remain
- [ ] All S2 issues fixed or explicitly waived
- [ ] `npm test -- --run` passes
- [ ] `npm run build` succeeds
- [ ] FTUE completes in <60s for new players
- [ ] Returning players skip FTUE
- [ ] All 5 mini-games playable and reward correctly
- [ ] PWA shell loads offline after first visit

---

*This QA plan covers P5-QA-SMOKE, P5-QA-FTUE, P5-QA-MINIGAMES, and P5-QA-PWA scope.*

---
**Document Version:** 1.11 | **Bible Alignment:** v1.11 | **Updated:** December 16, 2025
