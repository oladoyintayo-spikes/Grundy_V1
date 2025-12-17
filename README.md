# README.md

**Document Version:** 1.11
**Last Updated:** December 16, 2025
**Bible Alignment:** v1.11
**Status:** Current

# Grundy Web Prototype

> **Elevator Pitch:** A cozy, ethical-monetization virtual pet game where you feed, nurture, and watch your creature evolve through meaningful interactions—built as a React/TypeScript prototype to validate core mechanics before Unity production.

**Live Demo:** [https://oladoyintayo-spikes.github.io/Grundy_V1/](https://oladoyintayo-spikes.github.io/Grundy_V1/)

---

## Source of Truth

| Resource | Location |
|----------|----------|
| **Design SoT** | `docs/GRUNDY_MASTER_BIBLE.md` (v1.11) |
| **BCT Spec** | `docs/BIBLE_COMPLIANCE_TEST.md` (v2.4) |
| **Asset List** | `docs/ASSET_MANIFEST.md` |
| **Current Sprint** | `CURRENT_SPRINT.md` |

> ⚠️ **Design SoT: `docs/GRUNDY_MASTER_BIBLE.md`**
>
> If any document or code conflicts with the Bible, the Bible wins.
> Patch artifacts in `docs/patches/` are non-canonical reference material only.

### Key Design Constraints (Bible v1.11)

| Constraint | Rule | Reference |
|------------|------|-----------|
| Mini-game gems | ❌ NEVER award gems | §8.1.1 |
| Mini-game daily cap | 3 rewarded plays | §8.1.1 |
| After daily cap | Playable for fun (0 rewards) | §8.1.1 |
| Push notifications | [Unity Later] | §12.5-12.8 |
| In-app notifications | ✅ Web Edition | §11.6.2-3 |

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Framework** | React | 18.2.0 |
| **Language** | TypeScript | 5.0.0 (strict mode) |
| **State Management** | Zustand | 4.4.0 |
| **Styling** | Tailwind CSS | 3.3.2 |
| **Build Tool** | Vite | 4.3.0 |
| **Testing** | Vitest | 0.32.0 |
| **Persistence** | localStorage | (native) |

---

## Setup Instructions

### Prerequisites
- Node.js 18+ recommended
- npm or yarn

### Installation

```bash
# Clone repository (if applicable)
# git clone <repo-url>
# cd grundy-web-prototype

# Install dependencies
npm install

# Start development server
npm run dev
# Opens at http://localhost:3000
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | TypeScript compile + production build |
| `npm run preview` | Preview production build locally |
| `npm test` | Run Vitest test suite |
| `npm run lint` | ESLint check on src/ |

---

## Directory Structure

```
grundy-web-prototype/
├── docs/
│   ├── GRUNDY_MASTER_BIBLE.md      # ← DESIGN SOURCE OF TRUTH
│   ├── ASSET_MANIFEST.md           # Sprite/state file list
│   ├── GRUNDY_LORE_CODEX.md        # Extended lore content
│   └── GRUNDY_ONBOARDING_FLOW.md   # Detailed FTUE scripts
│
├── src/
│   ├── main.tsx                    # Entry point (ReactDOM.createRoot)
│   ├── App.tsx                     # Main app shell, routing, modal orchestration
│   ├── index.css                   # Tailwind imports + custom styles
│   │
│   ├── types/
│   │   └── index.ts                # All TypeScript interfaces & types
│   │
│   ├── data/
│   │   ├── config.ts               # Game constants, formulas, tier definitions
│   │   ├── pets.ts                 # 8 pet definitions with abilities & unlock costs
│   │   ├── foods.ts                # 10 food definitions with 8-pet affinity matrix
│   │   └── crafting.ts             # 4 crafting recipes
│   │
│   ├── game/
│   │   ├── store.ts                # Zustand store (central state, persistence, actions)
│   │   ├── FeedingSystem.ts        # Affinity calculation, XP gain, reaction logic
│   │   ├── PetSystem.ts            # Time decay, evolution, level-up detection
│   │   ├── EconomySystem.ts        # Currency CRUD, inventory management
│   │   └── PetAbilities.ts         # Per-pet bonuses (game rewards, XP modifiers)
│   │
│   ├── components/
│   │   ├── Pet.tsx                 # Pet display with mood, level badge, animations
│   │   ├── ProgressBars.tsx        # XP, hunger, mood, bond meters
│   │   ├── FoodBag.tsx             # Food inventory grid
│   │   ├── FoodItem.tsx            # Individual food button
│   │   ├── ReactionDisplay.tsx     # Feeding reaction feedback overlay
│   │   ├── Shop.tsx                # Food purchase modal
│   │   ├── Crafting.tsx            # Recipe crafting UI
│   │   ├── CurrencyDisplay.tsx     # Coins & gems header
│   │   ├── LevelUpModal.tsx        # Level-up celebration
│   │   ├── MainMenu.tsx            # Hamburger menu navigation
│   │   ├── PetSelector.tsx         # Multi-pet grid with unlock states
│   │   ├── PetUnlockModal.tsx      # Gem unlock confirmation
│   │   ├── WelcomeScreen.tsx       # Onboarding flow (splash → story → selection)
│   │   ├── Tutorial.tsx            # First-session 3-step tutorial
│   │   ├── TutorialSpotlight.tsx   # Spotlight overlay component
│   │   ├── SettingsModal.tsx       # Sound toggle, reset progress
│   │   ├── DevPanel.tsx            # Balance testing controls (dev only)
│   │   └── games/
│   │       ├── MiniGameHub.tsx     # Game selection with unlock states
│   │       └── SnackCatch.tsx      # 60s reflex catch game (fully playable)
│   │
│   └── __tests__/
│       ├── config.test.ts          # XP formula, mood tier tests
│       ├── data.test.ts            # Pet/food data validation
│       ├── FeedingSystem.test.ts   # Reaction, XP calculation tests
│       ├── PetSystem.test.ts       # Evolution, decay tests
│       ├── EconomySystem.test.ts   # Currency, inventory tests
│       └── integration.test.ts     # Full flow store tests
│
├── specs/                          # YAML specs (shared with Unity)
│   ├── game_config.yaml
│   ├── pets.yaml
│   ├── foods.yaml
│   └── economy.yaml
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## Core Concepts

### Pets (8 Total)

| Pet | Emoji | Unlock | Special Ability |
|-----|-------|--------|-----------------|
| **Munchlet** | 🟡 | Free (Starter) | +10% bond growth |
| **Grib** | 🟢 | Free (Starter) | -20% negative reactions |
| **Plompo** | 🟣 | Free (Starter) | Slower mood decay |
| **Fizz** | 💧 | 50 💎 | +15% XP from fruits |
| **Ember** | 🔥 | 75 💎 | +25% XP from spicy foods |
| **Chomper** | 🦷 | 75 💎 | +30% hunger restoration |
| **Whisp** | 👻 | 100 💎 | +20% XP from rare foods |
| **Luxe** | ✨ | 150 💎 | +50% coins from games |

### Foods (10 Total)

- **Common** (5🪙): Apple, Banana, Carrot
- **Uncommon** (15🪙): Cookie, Grapes
- **Rare** (25-35🪙): Spicy Taco, Hot Pepper, Dream Treat
- **Epic** (50-100🪙): Birthday Cake, Golden Feast

Each food has an affinity (loved/liked/neutral/disliked) for each of the 8 pets.

### Progression System

**XP Formula:** `XP(L) = 20 + (L² × 1.4)`

| Level Range | Stage | Scale |
|-------------|-------|-------|
| 1-9 | Baby | 1.0× |
| 10-24 | Youth | 1.12× |
| 25+ | Evolved | 1.25× |

### Mood System

| Range | Tier | XP Multiplier |
|-------|------|---------------|
| 0-19 | 😤 Unhappy | 0.5× |
| 20-39 | 😕 Low | 0.75× |
| 40-59 | 😐 Content | 1.0× |
| 60-84 | 😊 Happy | 1.25× |
| 85-100 | 🤩 Ecstatic | 1.5× |

### Affinity Multipliers

| Affinity | XP Multiplier |
|----------|---------------|
| Loved | 2.0× |
| Liked | 1.5× |
| Neutral | 1.0× |
| Disliked | 0.5× |

### Economy

- **Starting Coins:** 100
- **Starting Gems:** 10
- **Level Up Reward:** +50 coins
- **Daily Mini-game Limit:** 3 plays (for rewards)

### Mini-Games

| Game | Unlock | Type | Status |
|------|--------|------|--------|
| Snack Catch | Level 2 | Reflex | ✅ Implemented |
| Mood Match | Level 4 | Memory | 🔲 Defined only |
| Snack Sort | Level 6 | Cognitive | 🔲 Defined only |

**Reward Tiers:** Bronze (0-99) → Silver (100-199) → Gold (200-299) → Rainbow (300+)

---

## Architecture Principles

### 1. Single Source of Truth
All game state lives in `store.ts` via Zustand. Components subscribe to slices they need.

### 2. Pure Functions for Game Logic
Files in `/game/*.ts` are pure functions with no side effects. They receive state, return new state.

### 3. Immutability
State is never mutated directly. Always spread: `{ ...state, newProp }`.

### 4. Component Patterns
- Hooks at top of component
- `useCallback` for event handlers
- Early returns for closed/hidden states
- Props: `isOpen`, `onClose` for modals

### 5. Persistence
Zustand `persist` middleware with versioned migrations (currently v3). Data stored in `localStorage` key: `grundy-save`.

---

## Testing

```bash
# Run all tests
npm test

# Run Bible Compliance Tests (BCT suite)
npm run test:bible

# Run E2E tests (Playwright)
# NOTE: First-time setup requires browser install:
npx playwright install chromium
npm run test:e2e

# Run E2E tests with UI mode
npm run test:e2e:ui

# Run all tests (unit + bible + e2e)
npm run test:all

# Run with watch mode
npm test -- --watch

# Run specific test file
npm test -- FeedingSystem
```

> **E2E Note:** CI environments must preinstall browsers or cache Playwright deps; otherwise `npx playwright install` may fail due to network restrictions.

**Test Coverage Areas:**
- XP formula correctness at various levels
- Affinity multiplier calculations
- Level-up threshold detection
- Evolution stage transitions
- Currency add/spend operations
- Inventory management
- Full feeding flow integration

---

## Mapping to Unity

| Web (TypeScript) | Unity (C#) |
|------------------|------------|
| `store.ts` | `GameManager` + `SaveManager` |
| `FeedingSystem.ts` | `FeedingManager.cs` |
| `PetSystem.ts` | `PetManager.cs` |
| `EconomySystem.ts` | `EconomyManager.cs` |
| `pets.ts` / `foods.ts` | ScriptableObjects |
| React components | Unity UI + Prefabs |
| localStorage | Encrypted file save |
| CSS animations | Unity Animator |

---

## Prototype Goals

1. **Validate core loop is fun** — Is feeding satisfying? Are reactions clear?
2. **Test economy balance** — Can players afford food? Is the grind acceptable?
3. **Verify formulas** — XP curve feels right, hunger decay rate is good

---

## Quick Reference Links

- **Design SoT:** `docs/GRUNDY_MASTER_BIBLE.md` ← START HERE
- **AI Agent Workflow:** `ORCHESTRATOR.md` ← HOW AGENTS WORK ON THIS REPO
- **Task List:** `TASKS.md`
- **Current Sprint:** `CURRENT_SPRINT.md`
- **Design Decisions:** See `GRUNDY_MASTER_DECISIONS.md`

---

## Contributing (AI Agents)

For how AI agents should work on this repo, see `ORCHESTRATOR.md`.

Key rules:
- Read `TASKS.md` for the current task list
- When design and code disagree, `docs/GRUNDY_MASTER_BIBLE.md` wins
- Do not edit protected files directly (Bible, Asset Manifest, Orchestrator)
- Mark any inferences with `Assumption:`

---

*Built to validate mechanics before Unity investment.*

---

**Document Version:** 1.11 | **Bible Alignment:** v1.11 | **Updated:** December 16, 2025
