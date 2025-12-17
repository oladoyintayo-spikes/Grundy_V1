# GRUNDY ONBOARDING FLOW
## Lore-Integrated FTUE Design

---
**Document Version:** 1.11
**Last Updated:** December 16, 2025
**Bible Alignment:** v1.11
**Status:** Production Ready
---

**Target Duration:** < 60 seconds to first feeding

> **Design SoT:** `docs/GRUNDY_MASTER_BIBLE.md` v1.11 — This document is subordinate to the Bible.

---

## Table of Contents

1. [Design Goals](#design-goals)
2. [Flow Overview](#flow-overview)
3. [Screen 1: Splash](#screen-1-splash)
4. [Screen 2: World Intro](#screen-2-world-intro)
5. [Screen 3: Pet Selection](#screen-3-pet-selection)
6. [Screen 4: Tutorial + First Play](#screen-4-tutorial--first-play)
7. [Screen 5: Mode Select](#screen-5-mode-select)
8. [Lore Snippet Reference](#lore-snippet-reference)
9. [Personality Dialogue Tables](#personality-dialogue-tables)
10. [Timing Breakdown](#timing-breakdown)
11. [Animation Requirements](#animation-requirements)
12. [Audio Design](#audio-design)
13. [Implementation Checklist](#implementation-checklist)

---

## Design Goals

| Priority | Goal | How |
|----------|------|-----|
| 1 | **Introduce the world** | Lore snippet on intro screen (5 sec) |
| 2 | **Create emotional connection** | Origin stories during pet selection |
| 3 | **Fast to gameplay** | Under 60 seconds total |
| 4 | **Tease locked content** | Mysterious snippets for locked pets |
| 5 | **Personality from moment one** | Pet speaks in-character during tutorial |
| 6 | **No monetization pressure** | Zero shop/IAP during FTUE |

---

## Flow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         ONBOARDING FLOW                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │  SPLASH  │ →  │  WORLD   │ →  │   PET    │ →  │ TUTORIAL │  │
│  │  (2 sec) │    │  INTRO   │    │ SELECTION│    │  + PLAY  │  │
│  └──────────┘    │  (5 sec) │    │ (15 sec) │    │ (30 sec) │  │
│                  └──────────┘    └──────────┘    └──────────┘  │
│                                        │                        │
│                                        ↓                        │
│                              ┌─────────────────┐                │
│                              │   MODE SELECT   │                │
│                              │ (after tutorial)│                │
│                              └─────────────────┘                │
│                                                                 │
│  Total Target: < 60 seconds to first feeding                   │
└─────────────────────────────────────────────────────────────────┘
```

### Quick Reference

| Screen | Duration | User Action | Skip Option |
|--------|----------|-------------|-------------|
| Splash | 2 sec | None (auto) | No |
| World Intro | 5 sec | Tap to continue | Yes (tap) |
| Pet Selection | ~15 sec | Browse + select | No |
| Tutorial | ~30 sec | Follow prompts | No (first time) |
| Mode Select | User choice | Select mode | No |

---

## Screen 1: Splash

**Duration:** 2 seconds (auto-advance)

### Layout

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│                                     │
│                                     │
│            ✨ GRUNDY ✨              │
│                                     │
│         [Logo fades in]             │
│                                     │
│                                     │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

### Specifications

| Element | Spec |
|---------|------|
| Logo | Center screen, fade in over 1s |
| Background | Deep purple gradient (#2D1B4E → #1A1025) |
| Sparkles | Subtle particle effect around logo |
| Audio | Soft chime on appear |
| Transition | Fade to white, 0.5s |

---

## Screen 2: World Intro

**Duration:** 5 seconds (tap to skip OR auto-advance)

### Layout

```
┌─────────────────────────────────────┐
│                                     │
│      ✦  ·  ✧  ·  ✦  ·  ✧           │
│                                     │
│   Sometimes, when a big feeling     │
│   is left behind…                   │
│                                     │
│   A tiny spirit called a Grundy     │
│   wakes up.                         │
│                                     │
│      ✦  ·  ✧  ·  ✦  ·  ✧           │
│                                     │
│   One of them just found *you*.     │
│                                     │
│                                     │
│          [ Continue ]               │
│                                     │
└─────────────────────────────────────┘
```

#### World Intro Copy (LOCKED)

> Sometimes, when a big feeling is left behind…
> A tiny spirit called a Grundy wakes up.
> One of them just found *you*.

This is the canonical 10-second World Intro backstory for the Grundy Web Edition. Lines appear sequentially (fade-in). The Continue button is enabled after line 2 appears.

### Specifications

| Element | Spec |
|---------|------|
| Background | Soft gradient + subtle particle drift |
| Text style | Serif/elegant font, cream color (#FFF8E7) |
| Animation | Fade in line-by-line, 0.8s per line |
| Decorative stars | Gentle twinkle animation |
| Audio | Mystical ambient pad, very soft |
| Button | "Continue" appears after line 2 |
| Auto-advance | 5 seconds after last line appears |

### Animation Sequence

| Time | Action |
|------|--------|
| 0.0s | Screen fades in |
| 0.5s | Line 1 fades in ("Sometimes, when a big feeling is left behind…") |
| 1.5s | Line 2 fades in ("A tiny spirit called a Grundy wakes up.") |
| 2.5s | Line 3 fades in ("One of them just found *you*.") — emphasized |
| 3.0s | Continue button appears (enabled) |
| 5.0s | Auto-advance if no tap |

---

## Screen 3: Pet Selection

**Duration:** ~15 seconds (user-controlled)

### Layout Overview

```
┌─────────────────────────────────────┐
│  ←                    Choose Your   │
│                         Grundy      │
├─────────────────────────────────────┤
│                                     │
│   ┌─────┐   ┌─────┐   ┌─────┐      │
│   │  🟡  │   │  🟢  │   │  🟣  │      │
│   │     │   │     │   │     │      │
│   └─────┘   └─────┘   └─────┘      │
│   Munchlet    Grib     Plompo       │
│     FREE      FREE      FREE        │
│                                     │
│   ┌─────┐   ┌─────┐   ┌─────┐      │
│   │ 🔵🔒 │   │ 🟠🔒 │   │ 🔴🔒 │      │
│   └─────┘   └─────┘   └─────┘      │
│    Fizz      Ember    Chomper      │
│    Lv.10     Lv.15     Lv.20       │
│                                     │
│   ┌─────┐   ┌─────┐                │
│   │ ⚪🔒 │   │ ✨🔒 │                │
│   └─────┘   └─────┘                │
│    Whisp     Luxe                  │
│    Lv.25     Lv.30                 │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  [LORE SNIPPET PANEL - See below]  │
│                                     │
│          [ Choose ]                 │
│                                     │
└─────────────────────────────────────┘
```

### Pet Card States

| State | Visual Treatment |
|-------|------------------|
| Free (unselected) | Full color, subtle idle animation |
| Free (selected) | Glowing border, bounce animation |
| Locked (unselected) | Silhouette, dimmed, lock icon |
| Locked (tapped) | Slight pulse, shows teaser lore |

---

### Free Pet: Munchlet Selected 🟡

```
┌─────────────────────────────────────┐
│                                     │
│            ┌─────────┐              │
│            │         │              │
│            │   🟡    │  ← Bounces   │
│            │  ◠‿◠   │    gently    │
│            └─────────┘              │
│                                     │
│        ✨ Munchlet ✨                │
│       "The Friendly One"            │
│                                     │
│  ┌───────────────────────────────┐  │
│  │                               │  │
│  │  "Found on a sunny windowsill,│  │
│  │   humming. Waiting for        │  │
│  │   someone to share warmth     │  │
│  │   with."                      │  │
│  │                               │  │
│  │  ♡ Loves sweet things         │  │
│  │  ✗ Hates being alone          │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
│         [ Choose Munchlet ]         │
│                                     │
└─────────────────────────────────────┘
```

**Pet Animation:** Gentle bounce, eyes brighten with sparkle
**Audio:** Soft happy hum

---

### Free Pet: Grib Selected 🟢

```
┌─────────────────────────────────────┐
│                                     │
│            ┌─────────┐              │
│            │         │              │
│            │   🟢    │  ← Grin      │
│            │  ≖‿≖   │    widens    │
│            └─────────┘              │
│                                     │
│          ✨ Grib ✨                  │
│     "The Mischievous One"           │
│                                     │
│  ┌───────────────────────────────┐  │
│  │                               │  │
│  │  "Appeared in a shadow behind │  │
│  │   the cupboard, grinning.     │  │
│  │   Not telling how."           │  │
│  │                               │  │
│  │  ♡ Loves chaos                │  │
│  │  ✗ Hates boredom              │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
│           [ Choose Grib ]           │
│                                     │
└─────────────────────────────────────┘
```

**Pet Animation:** Mischievous side-to-side sway, fangs glint
**Audio:** Soft "kekeke" chuckle

---

### Free Pet: Plompo Selected 🟣

```
┌─────────────────────────────────────┐
│                                     │
│            ┌─────────┐              │
│            │         │              │
│            │   🟣    │  ← Slow      │
│            │  ᵕ‿ᵕ   │    yawn      │
│            └─────────┘              │
│                                     │
│         ✨ Plompo ✨                 │
│        "The Sleepy One"             │
│                                     │
│  ┌───────────────────────────────┐  │
│  │                               │  │
│  │  "Discovered sleeping in a    │  │
│  │   cloud that drifted too low. │  │
│  │   Went back to sleep."        │  │
│  │                               │  │
│  │  ♡ Loves naps                 │  │
│  │  ✗ Hates rushing              │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
│          [ Choose Plompo ]          │
│                                     │
└─────────────────────────────────────┘
```

**Pet Animation:** Slow blink, gentle yawn, settles back down
**Audio:** Soft sleepy "mrrrp"

---

### Locked Pet: Fizz 🔵

```
┌─────────────────────────────────────┐
│                                     │
│            ┌─────────┐              │
│            │ ░░░░░░░ │              │
│            │ ░ 🔵🔒 ░ │  ← Silhouette│
│            │ ░░░░░░░ │    + sparks  │
│            └─────────┘              │
│                                     │
│           ✨ Fizz ✨                 │
│       "The Electric One"            │
│                                     │
│  ┌───────────────────────────────┐  │
│  │                               │  │
│  │  "Sparked into existence      │  │
│  │   during a thunderstorm..."   │  │
│  │                               │  │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░   │  │
│  │                               │  │
│  │  🔒 Unlocks at Level 10       │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
│             [ Locked ]              │
│                                     │
└─────────────────────────────────────┘
```

**Silhouette Effect:** Dark blue with electric sparks at edges
**Audio:** Distant thunder rumble

---

### Locked Pet: Ember 🟠

```
┌─────────────────────────────────────┐
│                                     │
│            ┌─────────┐              │
│            │ ░░░░░░░ │              │
│            │ ░ 🟠🔒 ░ │  ← Silhouette│
│            │ ░░░░░░░ │    + flicker │
│            └─────────┘              │
│                                     │
│          ✨ Ember ✨                 │
│        "The Proud One"              │
│                                     │
│  ┌───────────────────────────────┐  │
│  │                               │  │
│  │  "Emerged from the last ember │  │
│  │   of a dying fire..."         │  │
│  │                               │  │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░   │  │
│  │                               │  │
│  │  🔒 Unlocks at Level 15       │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
│             [ Locked ]              │
│                                     │
└─────────────────────────────────────┘
```

**Silhouette Effect:** Dark orange with flickering ember glow
**Audio:** Soft fire crackle

---

### Locked Pet: Chomper 🔴

```
┌─────────────────────────────────────┐
│                                     │
│            ┌─────────┐              │
│            │ ░░░░░░░ │              │
│            │ ░ 🔴🔒 ░ │  ← Silhouette│
│            │ ░░░░░░░ │    + chomp   │
│            └─────────┘              │
│                                     │
│         ✨ Chomper ✨                │
│        "The Hungry One"             │
│                                     │
│  ┌───────────────────────────────┐  │
│  │                               │  │
│  │  "First spotted near the      │  │
│  │   kitchen, following the      │  │
│  │   smell of dinner..."         │  │
│  │                               │  │
│  │  🔒 Unlocks at Level 20       │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
│             [ Locked ]              │
│                                     │
└─────────────────────────────────────┘
```

**Silhouette Effect:** Dark red with occasional jaw movement
**Audio:** Distant stomach growl

---

### Locked Pet: Whisp ⚪

```
┌─────────────────────────────────────┐
│                                     │
│            ┌─────────┐              │
│            │ ░░░░░░░ │              │
│            │ ░ ⚪🔒 ░ │  ← Fades     │
│            │ ░░░░░░░ │    in/out    │
│            └─────────┘              │
│                                     │
│          ✨ Whisp ✨                 │
│      "The Mysterious One"           │
│                                     │
│  ┌───────────────────────────────┐  │
│  │                               │  │
│  │  "Drifted in through a crack  │  │
│  │   in a dream..."              │  │
│  │                               │  │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░   │  │
│  │                               │  │
│  │  🔒 Unlocks at Level 25       │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
│             [ Locked ]              │
│                                     │
└─────────────────────────────────────┘
```

**Silhouette Effect:** Translucent white, fades in/out slowly
**Audio:** Ethereal whisper sound

---

### Locked Pet: Luxe ✨

```
┌─────────────────────────────────────┐
│                                     │
│            ┌─────────┐              │
│            │ ░░░░░░░ │              │
│            │ ░ ✨🔒 ░ │  ← Sparkles  │
│            │ ░░░░░░░ │    anyway    │
│            └─────────┘              │
│                                     │
│           ✨ Luxe ✨                 │
│        "The Fancy One"              │
│                                     │
│  ┌───────────────────────────────┐  │
│  │                               │  │
│  │  "Arrived already posing.     │  │
│  │   Certain they deserve        │  │
│  │   better."                    │  │
│  │                               │  │
│  │  🔒 Unlocks at Level 30       │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
│             [ Locked ]              │
│                                     │
└─────────────────────────────────────┘
```

**Silhouette Effect:** Teal silhouette with gold sparkles (still fancy even locked)
**Audio:** Dismissive "hmph" sound

---

## Screen 4: Tutorial + First Play

**Duration:** ~30 seconds (5 steps, ~6 seconds each)

---

### Step 4.1: Pet Greeting

Pet appears with personality-specific greeting.

#### Munchlet Greeting

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│            ┌─────────┐              │
│            │         │              │
│            │   🟡    │  ← Happy     │
│            │  ◠‿◠   │    bounce    │
│            └─────────┘              │
│                                     │
│        💭 "Hi! I'm so glad         │
│            you found me!"           │
│                                     │
│                                     │
│            [ Continue ]             │
│                                     │
└─────────────────────────────────────┘
```

#### Grib Greeting

```
┌─────────────────────────────────────┐
│                                     │
│            ┌─────────┐              │
│            │         │              │
│            │   🟢    │  ← Mischief  │
│            │  ≖‿≖   │    grin      │
│            └─────────┘              │
│                                     │
│        💭 "Took you long enough.   │
│            This is gonna be fun."   │
│                                     │
│                                     │
│            [ Continue ]             │
│                                     │
└─────────────────────────────────────┘
```

#### Plompo Greeting

```
┌─────────────────────────────────────┐
│                                     │
│            ┌─────────┐              │
│            │         │              │
│            │   🟣    │  ← Sleepy    │
│            │  ᵕ‿ᵕ   │    yawn      │
│            └─────────┘              │
│                                     │
│        💭 "Oh... hi... *yawn*      │
│            ...nice to meet you..."  │
│                                     │
│                                     │
│            [ Continue ]             │
│                                     │
└─────────────────────────────────────┘
```

---

### Step 4.2: Feeding Tutorial

```
┌─────────────────────────────────────┐
│  🪙 100        💎 10               │
├─────────────────────────────────────┤
│                                     │
│            ┌─────────┐              │
│            │         │              │
│            │   🟡    │              │
│            │   👀    │ ← Looks at   │
│            └─────────┘   food       │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  💭 "Ooh, is that food?!"   │    │
│  └─────────────────────────────┘    │
│                                     │
│  ╔═══════════════════════════════╗  │
│  ║   ┌───────────────────────┐   ║  │
│  ║   │    ↓ Tap to feed ↓    │   ║  │
│  ║   └───────────────────────┘   ║  │
│  ║  ┌─────┐  ┌─────┐  ┌─────┐   ║  │
│  ║  │ 🍎  │  │ 🍪  │  │ 🌶️  │   ║  │
│  ║  │ ✨  │  │     │  │     │   ║  │
│  ║  └─────┘  └─────┘  └─────┘   ║  │
│  ╚═══════════════════════════════╝  │
│      ↑ Highlighted area             │
└─────────────────────────────────────┘
```

**Tooltip:** "Try feeding your Grundy!"
**Highlight:** Food panel glows, rest of UI dimmed
**First food has sparkle indicator**

---

### Step 4.3: First Reaction (Guaranteed Positive)

```
┌─────────────────────────────────────┐
│                                     │
│            ✨ ✨ ✨ ✨                 │
│            ┌─────────┐              │
│            │         │              │
│            │   🟡    │  ← Bounce!   │
│            │  ★‿★   │    Hearts!   │
│            └─────────┘              │
│              ♡ ♡ ♡                  │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  💭 "Yum! That was perfect!"│    │
│  └─────────────────────────────┘    │
│                                     │
│        ┌──────────────────┐         │
│        │  +5 XP  │  +3 🪙  │         │
│        └──────────────────┘         │
│                                     │
│            [ Continue ]             │
│                                     │
└─────────────────────────────────────┘
```

**IMPORTANT:** First feeding is ALWAYS positive, regardless of food choice.

**Effects:**
- Hearts burst from pet
- Sparkles around screen
- XP bar animates up
- Coins fly to counter

---

### Step 4.4: HUD Introduction

```
┌─────────────────────────────────────┐
│                                     │
│  ╔═════════════════════════════╗    │
│  ║ 🪙 103  ← "Coins for food   ║    │
│  ║            and care items"  ║    │
│  ╚═════════════════════════════╝    │
│                                     │
│  ╔═════════════════════════════╗    │
│  ║ 💎 10   ← "Gems for pets,   ║    │
│  ║      cosmetics, and special ║    │
│  ║            utility"         ║    │
│  ╚═════════════════════════════╝    │
│                                     │
│  ╔═════════════════════════════╗    │
│  ║ ████░░░░░ ← "XP to grow     ║    │
│  ║  Lv.1        and evolve"    ║    │
│  ╚═════════════════════════════╝    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ 💭 "Feed me, play with me,  │    │
│  │     and I'll grow!"          │    │
│  └─────────────────────────────┘    │
│                                     │
│            [ Got it! ]              │
│                                     │
└─────────────────────────────────────┘
```

**Sequence:** Each element highlights one at a time with tooltip

---

### Step 4.5: Tutorial Complete

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│            ┌─────────┐              │
│            │         │              │
│            │   🟡    │  ← Happy     │
│            │  ◠‿◠   │    wiggle    │
│            └─────────┘              │
│                                     │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  💭 "Let's keep exploring   │    │
│  │      together!"              │    │
│  └─────────────────────────────┘    │
│                                     │
│                                     │
│          [ Start Playing ]          │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

**Transition:** Fade to Mode Select

---

## Screen 5: Mode Select

**Appears after tutorial completion**

```
┌─────────────────────────────────────┐
│                                     │
│         How do you want             │
│           to play?                  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │                               │  │
│  │     ☁️  COZY MODE  ☁️         │  │
│  │                               │  │
│  │  "No consequences. Just fun.  │  │
│  │   Your Grundy is always       │  │
│  │   happy to see you."          │  │
│  │                               │  │
│  │         [ Choose ]            │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │                               │  │
│  │     🔥 CLASSIC MODE 🔥        │  │
│  │                               │  │
│  │  "Your care matters. Neglect  │  │
│  │   has consequences... but     │  │
│  │   bonds run deeper."          │  │
│  │                               │  │
│  │         [ Choose ]            │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
│       (Can change in settings)      │
│                                     │
└─────────────────────────────────────┘
```

### Mode Descriptions

| Mode | Tagline | Details |
|------|---------|---------|
| Cozy | "No consequences. Just fun." | No runaway, no corruption, pet always happy |
| Classic | "Your care matters." | Neglect → sadness → runaway (48h lockout) |

---

## Lore Snippet Reference

### Free Pets — Full Display

| Pet | Line 1 | Line 2 | Loves | Hates |
|-----|--------|--------|-------|-------|
| Munchlet 🟡 | "Found on a sunny windowsill, humming." | "Waiting for someone to share warmth with." | Sweet things | Being alone |
| Grib 🟢 | "Appeared in a shadow behind the cupboard, grinning." | "Not telling how." | Chaos | Boredom |
| Plompo 🟣 | "Discovered sleeping in a cloud that drifted too low." | "Went back to sleep." | Naps | Rushing |

### Locked Pets — Teaser Only

| Pet | Teaser (Shown) | Hidden (Revealed on Unlock) | Unlock |
|-----|----------------|----------------------------|--------|
| Fizz 🔵 | "Sparked into existence during a thunderstorm..." | "Hasn't stopped vibrating." | Level 10 |
| Ember 🟠 | "Emerged from the last ember of a dying fire..." | "Refuses to be ignored." | Level 15 |
| Chomper 🔴 | "First spotted near the kitchen, following the smell of dinner..." | "Loves food. Hates... just loves food." | Level 20 |
| Whisp ⚪ | "Drifted in through a crack in a dream..." | "Sometimes forgets which world." | Level 25 |
| Luxe ✨ | "Arrived already posing. Certain they deserve better." | (Full snippet already short) | Level 30 |

---

## Personality Dialogue Tables

### Greeting (Step 4.1)

| Pet | Dialogue | Animation |
|-----|----------|-----------|
| Munchlet | "Hi! I'm so glad you found me!" | Happy bounce, eyes sparkle |
| Grib | "Took you long enough. This is gonna be fun." | Mischievous sway, grin widens |
| Plompo | "Oh... hi... *yawn* ...nice to meet you..." | Slow blink, yawn, settles |

### Sees Food (Step 4.2)

| Pet | Dialogue | Animation |
|-----|----------|-----------|
| Munchlet | "Ooh, is that food?!" | Eyes widen, bounces toward food |
| Grib | "Ooh, what do we have here..." | Sly look, rubs hands |
| Plompo | "Mmm... that looks... *yawn* ...nice..." | Sleepy interest |

### After Feeding (Step 4.3)

| Pet | Dialogue | Animation |
|-----|----------|-----------|
| Munchlet | "Yum! That was perfect!" | Hearts burst, happy dance |
| Grib | "Not bad. Do it again." | Satisfied smirk |
| Plompo | "That was... worth waking up for..." | Content sigh |

### Tutorial End (Step 4.5)

| Pet | Dialogue | Animation |
|-----|----------|-----------|
| Munchlet | "Let's keep exploring together!" | Excited wiggle |
| Grib | "Alright, let's cause some trouble." | Mischievous bounce |
| Plompo | "Can we... take a nap soon...?" | Sleepy smile |

---

## Timing Breakdown

| Screen | Duration | Cumulative | Notes |
|--------|----------|------------|-------|
| Splash | 2s | 2s | Auto-advance |
| World Intro | 5s | 7s | Tap to skip |
| Pet Selection | 15s avg | 22s | User-controlled |
| Greeting | 4s | 26s | Tap to continue |
| Feeding Tutorial | 8s | 34s | Action required |
| First Reaction | 4s | 38s | Auto-advance |
| HUD Intro | 10s | 48s | 3 highlights |
| Tutorial End | 4s | 52s | Tap to continue |
| Mode Select | 8s | 60s | User choice |
| **TOTAL** | **~60s** | ✅ | On target |

---

## Animation Requirements

### Screen 2: World Intro

| Element | Animation | Duration |
|---------|-----------|----------|
| Background | Slow particle drift | Loop |
| Text lines | Fade in sequentially | 0.8s each |
| Decorative stars | Gentle twinkle | Loop |
| Continue button | Fade in | 0.3s |

### Screen 3: Pet Selection

| Element | Animation | Trigger |
|---------|-----------|---------|
| Free pet (idle) | Gentle breathing | Always |
| Free pet (selected) | Bounce + glow border | On tap |
| Locked pet (idle) | Silhouette pulse | Always |
| Locked pet (tapped) | Shake + lock jiggle | On tap |
| Lore panel | Slide up + fade in | On selection |

### Screen 4: Tutorial

| Element | Animation | Trigger |
|---------|-----------|---------|
| Pet greeting | Personality-specific idle | On appear |
| Speech bubble | Pop in with bounce | On appear |
| Food highlight | Glow pulse | During step 4.2 |
| Feeding reaction | Hearts + sparkles burst | On feed |
| Reward popup | Fly-up animation | After reaction |
| HUD highlights | Sequential glow | During step 4.4 |

---

## Audio Design

### Screen 1: Splash

| Moment | Sound |
|--------|-------|
| Logo appear | Soft chime (C major) |
| Sparkle | Quiet shimmer |

### Screen 2: World Intro

| Moment | Sound |
|--------|-------|
| Background | Mystical ambient pad |
| Text appear | Soft whoosh per line |
| "One found you" | Gentle emphasis tone |

### Screen 3: Pet Selection

| Moment | Sound |
|--------|-------|
| Free pet selected | Soft "pop" + personality sound |
| Munchlet | Gentle hum |
| Grib | Quiet "kekeke" |
| Plompo | Sleepy "mrrrp" |
| Locked pet tapped | Low "locked" thunk |
| Fizz (locked) | Distant thunder |
| Ember (locked) | Fire crackle |
| Chomper (locked) | Stomach growl |
| Whisp (locked) | Ethereal whisper |
| Luxe (locked) | Dismissive "hmph" |

### Screen 4: Tutorial

| Moment | Sound |
|--------|-------|
| Pet greeting | Personality-specific chirp |
| Food tap | Soft select sound |
| Feeding | Munch/chomp |
| Positive reaction | Sparkle chime + happy sound |
| Reward popup | Coin jingle + XP ding |
| Tutorial complete | Achievement flourish |

### Screen 5: Mode Select

| Moment | Sound |
|--------|-------|
| Cozy hover | Soft cloud sound |
| Classic hover | Gentle fire crackle |
| Selection confirm | Satisfying click |

---

## Implementation Checklist

### Assets Required

**Art:**
- [ ] World intro background (starfield)
- [ ] Pet selection grid layout
- [ ] Pet silhouettes (5 locked pets)
- [ ] Lock icon overlay
- [ ] Lore panel background
- [ ] Tutorial highlight overlays
- [ ] Mode select cards (Cozy/Classic)
- [ ] Speech bubble frames

**Animation:**
- [ ] Logo fade + sparkle
- [ ] Text fade-in sequence
- [ ] Pet idle animations (3 starters)
- [ ] Pet selected animations (3 starters)
- [ ] Silhouette pulse (5 locked)
- [ ] Heart burst effect
- [ ] Sparkle burst effect
- [ ] Reward fly-up

**Audio:**
- [ ] Intro chime
- [ ] Mystical ambient loop
- [ ] Pet personality sounds (8 total)
- [ ] Locked thunk
- [ ] Feeding sounds
- [ ] Reaction sounds
- [ ] UI feedback sounds

### Code Tasks

- [ ] FTUE state machine
- [ ] Pet selection controller
- [ ] Lore panel data binding
- [ ] Tutorial sequence manager
- [ ] Highlight/dim system
- [ ] Forced positive first reaction
- [ ] Mode selection persistence
- [ ] Skip tutorial (returning users)
- [ ] Analytics events (see below)

### Analytics Events

| Event | Parameters |
|-------|------------|
| `ftue_started` | timestamp |
| `ftue_world_intro_complete` | skipped: bool |
| `ftue_pet_viewed` | pet_id, is_locked |
| `ftue_pet_selected` | pet_id |
| `ftue_first_feed` | food_id |
| `ftue_tutorial_complete` | duration_seconds |
| `ftue_mode_selected` | mode: cozy/classic |
| `ftue_complete` | total_duration, pet_id, mode |

---

## FTUE Rules (Unchanged)

These rules from Game Bible v3 remain in effect:

1. ❌ No monetization during FTUE
2. ❌ No interstitial ads
3. ❌ No LiveOps popups
4. ❌ No season pass display
5. ❌ No shop prompts
6. ✅ Age gate before FTUE begins
7. ✅ First reaction always positive
8. ✅ Starter resources provided (100 coins, 10 gems)

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Dec 2024 | Initial onboarding flow with lore integration |
| 1.11 | Dec 16, 2025 | Bible v1.11 alignment update |

---

## Related Documents

- **GRUNDY_MASTER_BIBLE.md** v1.11 — Design Source of Truth (Section 7: Onboarding)
- **GRUNDY_LORE_CODEX.md** — Full pet lore and world-building
- **ASSET_MANIFEST.md** — Sprite files and state mappings

---

*"One found you."*

---
**Document Version:** 1.11 | **Bible Alignment:** v1.11 | **Updated:** December 16, 2025
