# CURRENT_SPRINT.md

# Grundy Web Prototype — Current Sprint

**Sprint Goal:** Deploy web prototype for Friend & Family testing

**Sprint Status:** 🟡 In Progress

**Last Updated:** December 2024 (Aligned with ORCHESTRATOR.md + TASKS.md)

---

## Source of Truth

| Resource | Location |
|----------|----------|
| **Design SoT** | `docs/GRUNDY_MASTER_BIBLE.md` |
| **Agent Workflow** | `ORCHESTRATOR.md` |
| **Task List** | `TASKS.md` |
| **Asset List** | `docs/ASSET_MANIFEST.md` |
| **This File** | `CURRENT_SPRINT.md` |

> ⚠️ **Design SoT: `docs/GRUNDY_MASTER_BIBLE.md`**
> 
> If code or other docs conflict with the Bible, the Bible wins.
>
> **For AI Agents:** See `ORCHESTRATOR.md` for workflow, roles, and prompt templates.

---

## 🎯 PRIME DIRECTIVE (The Bottleneck)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   DEPLOY WEB PROTOTYPE FOR FRIEND & FAMILY TESTING                      │
│                                                                         │
│   The codebase is MVP-ready but exists only locally.                    │
│   Real user feedback is blocked until we deploy.                        │
│   Everything else is secondary to getting this live.                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Acceptance Criteria:**
- [ ] Production build succeeds (`npm run build`)
- [ ] All tests pass (`npm test`)
- [ ] Deployed to public URL (GitHub Pages, Vercel, or Netlify)
- [ ] PWA manifest added for mobile "Add to Home Screen"
- [ ] QR code generated for easy mobile access
- [ ] 5+ testers have played the game

---

## 📋 BACKLOG (Ordered by Priority)

> **Note:** These sprint tasks map to `TASKS.md` Phase 0 (Pre-Flight).
> Use `TASKS.md` as the master task list. This section provides sprint-specific context.

| Sprint ID | TASKS.md ID | Mapping |
|-----------|-------------|---------|
| S1 | P0-1, P0-5 | Build + Deploy |
| S2 | P0-3 | Hide DevPanel |
| S3 | P0-4 | PWA Manifest |
| S4 | P0-6 | Loading State |
| S5 | P0-7 | Mobile Viewport |
| S6 | P0-8 | Error Boundary |

### P0 — Must Complete This Sprint

| ID | Task | Status | Assignee | Notes |
|----|------|--------|----------|-------|
| S1 | Production build & deployment | 🔲 TODO | — | GitHub Pages preferred for simplicity |
| S2 | Hide DevPanel in production | 🔲 TODO | — | Wrap in `import.meta.env.DEV` check |
| S3 | Add PWA manifest.json | 🔲 TODO | — | Enable "Add to Home Screen" |

### P1 — Should Complete This Sprint

| ID | Task | Status | Assignee | Notes |
|----|------|--------|----------|-------|
| S4 | Add loading state for initial render | 🔲 TODO | — | Prevents flash of unstyled content |
| S5 | Mobile viewport meta tag verification | 🔲 TODO | — | Ensure proper scaling |
| S6 | Error boundary for crash recovery | 🔲 TODO | — | Graceful degradation |

### P2 — Nice to Have This Sprint

| ID | Task | Status | Assignee | Notes |
|----|------|--------|----------|-------|
| S7 | Implement Mood Match mini-game | 🔲 TODO | — | Memory game, 4 emotion buttons |
| S8 | Implement Snack Sort mini-game | 🔲 TODO | — | Cognitive game, swipe to bins |
| S9 | Add sound effects (Web Audio API) | 🔲 TODO | — | Procedural generation if no assets |
| S10 | Add haptic feedback (Vibration API) | 🔲 TODO | — | Android only |

---

## 🔧 TASK DETAILS

### S1: Production Build & Deployment

**Goal:** Get the game accessible via public URL

**Steps:**
1. Run `npm run build` — verify clean output in `dist/`
2. Choose deployment target:
   - **GitHub Pages** (recommended): Free, simple, custom domain support
   - **Vercel**: Free tier, automatic deploys
   - **Netlify**: Free tier, form handling if needed
3. Configure base path if using GitHub Pages subdirectory
4. Deploy and verify all features work

**Vite Config for GitHub Pages:**
```typescript
// vite.config.ts
export default defineConfig({
  base: '/grundy-web-prototype/', // if deploying to user.github.io/repo-name
  // ...
});
```

### S2: Hide DevPanel in Production

**Goal:** Prevent users from accessing balance testing tools

**Current Code:**
```tsx
// In App.tsx or wherever DevPanel is rendered
<DevPanel />
```

**Fix:**
```tsx
{import.meta.env.DEV && <DevPanel />}
```

**Alternative (keyboard shortcut only in dev):**
```tsx
useEffect(() => {
  if (!import.meta.env.DEV) return;
  const handler = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'd') setShowDevPanel(prev => !prev);
  };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}, []);
```

### S3: Add PWA Manifest

**Goal:** Enable mobile "Add to Home Screen" functionality

**Create `public/manifest.json`:**
```json
{
  "name": "Grundy",
  "short_name": "Grundy",
  "description": "Feed and nurture your virtual pet",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1a1a2e",
  "theme_color": "#6366f1",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Add to `index.html`:**
```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#6366f1">
<meta name="apple-mobile-web-app-capable" content="yes">
```

---

## 🤖 NOTES FOR AI AGENTS

### Critical Naming Conventions

| Context | Convention | Example |
|---------|------------|---------|
| Pet IDs | camelCase, lowercase | `munchlet`, `spicyTaco` |
| Food IDs | camelCase, lowercase | `birthdayCake`, `hotPepper` |
| Components | PascalCase | `FoodBag`, `LevelUpModal` |
| Constants | SCREAMING_SNAKE_CASE | `LEVEL_UP_COIN_REWARD` |
| Types | PascalCase | `PetState`, `FoodDefinition` |

### ⚠️ NEVER Use These Pet Names (Deprecated)

- ❌ `sprout` — Use `munchlet`
- ❌ `ripple` — Use `fizz`
- ❌ Any names from `GrundyPrototype.tsx`

### State Management Rules

1. **ALL game state lives in `store.ts`** — Never use Context or local useState for game data
2. **Pure functions in `/game/*.ts`** — No side effects, no store access
3. **Immutability** — Always spread: `{ ...state, newProp }`
4. **Selector hooks** — Use `usePet()`, `useCurrencies()`, etc.

### Component Patterns

```tsx
// Standard component structure
function MyComponent({ isOpen, onClose }: Props) {
  // 1. Hooks at top
  const pet = usePet();
  const [localState, setLocalState] = useState(false);
  
  // 2. Callbacks next
  const handleClick = useCallback(() => {
    // ...
  }, [dependencies]);
  
  // 3. Early returns for closed/hidden states
  if (!isOpen) return null;
  
  // 4. Render
  return (
    <div>...</div>
  );
}
```

### Modal Pattern

```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function MyModal({ isOpen, onClose }: ModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md">
        {/* Content */}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
```

### Mini-Game State Machine Pattern

```tsx
type GamePhase = 'ready' | 'playing' | 'finished';

interface MiniGameProps {
  petId: PetId;
  onComplete: (result: MiniGameResult) => void;
  onCancel: () => void;
}

function MiniGame({ petId, onComplete, onCancel }: MiniGameProps) {
  const [phase, setPhase] = useState<GamePhase>('ready');
  const [score, setScore] = useState(0);
  
  // Phase-specific rendering
  if (phase === 'ready') return <ReadyScreen onStart={() => setPhase('playing')} />;
  if (phase === 'finished') return <ResultScreen score={score} onContinue={() => onComplete(result)} />;
  
  return <GameplayScreen /* ... */ />;
}
```

### Import Order

```tsx
// 1. React
import React, { useState, useCallback } from 'react';

// 2. Store
import { useGameStore, usePet, useCurrencies } from '../game/store';

// 3. Types
import { PetId, FeedResult } from '../types';

// 4. Data
import { PETS } from '../data/pets';
import { FOODS } from '../data/foods';

// 5. Config
import { AFFINITY_MULTIPLIERS, getMoodTier } from '../data/config';

// 6. Game Systems
import { processFeed } from '../game/FeedingSystem';

// 7. Components
import { Pet } from './Pet';
import { FoodBag } from './FoodBag';
```

### Testing Pattern

```typescript
describe('Feature', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it('should do something', () => {
    // Arrange
    const store = useGameStore.getState();
    
    // Act
    const result = store.someAction();
    
    // Assert
    expect(result).toBe(expected);
    expect(useGameStore.getState().someProp).toBe(newValue);
  });
});
```

### Critical Don'ts

| ❌ Don't | ✅ Do Instead |
|----------|---------------|
| Use class components | Use functional components with hooks |
| Use Redux | Use Zustand (already configured) |
| Use Context for game state | Use `useGameStore` hook |
| Mutate state directly | Spread: `{ ...state, newProp }` |
| Use `any` type | Define proper interfaces |
| Use magic numbers | Use constants from config.ts |
| Access localStorage directly | Use store persistence |

---

## 📊 CURRENT METRICS

| Metric | Value |
|--------|-------|
| TypeScript Lines | ~4,500+ |
| Component Count | 19 |
| Test Suites | 6 |
| Build Status | ✅ Clean |
| Test Status | ✅ Passing |
| Deploy Status | 🔴 Not Deployed |

---

## 🧪 TESTING CHECKLIST (Pre-Deploy)

### Core Loop
- [ ] Feed pet → XP increases
- [ ] Feed favorite food → 2× XP (loved)
- [ ] Level up at correct threshold
- [ ] Evolution at levels 7 and 13
- [ ] Coins awarded on level up (+50)

### Economy
- [ ] Buy food → Coins deducted
- [ ] Can't buy if insufficient coins
- [ ] Inventory updates correctly
- [ ] Crafting consumes ingredients

### Multi-Pet
- [ ] Select starter pet works
- [ ] Switch between unlocked pets
- [ ] Unlock pet with gems
- [ ] Each pet maintains separate state

### Onboarding
- [ ] Welcome screen displays
- [ ] Story screen (skippable)
- [ ] Pet selection works
- [ ] Tutorial completes (3 steps)
- [ ] Skip works for returning users

### Mini-Games
- [ ] Snack Catch playable
- [ ] Scoring matches spec
- [ ] Rewards match tier table
- [ ] Daily limit enforced (3 plays)

### Persistence
- [ ] Refresh preserves state
- [ ] Reset clears all data
- [ ] Migration handles old saves

---

## 📅 SPRINT TIMELINE

| Day | Focus |
|-----|-------|
| 1 | Deploy to GitHub Pages |
| 2 | Mobile testing, bug fixes |
| 3-5 | Friend & Family distribution |
| 6-7 | Collect feedback, prioritize fixes |

---

## 🔗 REFERENCES

| Document | Location | Purpose |
|----------|----------|---------|
| **Design SoT** | `docs/GRUNDY_MASTER_BIBLE.md` | ← START HERE — Canonical design |
| **Agent Workflow** | `ORCHESTRATOR.md` | Roles, prompts, approval workflow |
| **Task List** | `TASKS.md` | 89 tasks, 13 phases, gap analysis |
| **Asset Manifest** | `docs/ASSET_MANIFEST.md` | 120 sprites, state mapping |
| **Lore Codex** | `docs/GRUNDY_LORE_CODEX.md` | Extended lore fragments |
| **Onboarding Flow** | `docs/GRUNDY_ONBOARDING_FLOW.md` | FTUE detail |

**Archived (Legacy):**
- `GRUNDY_MASTER_DECISIONS.md` → moved to `archive/`
- `TICKETS_WEB.yaml` → superseded by `TASKS.md`
- `ORCHESTRATOR_WEB.md` → renamed to `ORCHESTRATOR.md`
- `CLAUDE_CODE_MASTER_TODO.md` → superseded by `TASKS.md`

---

## 🤖 NOTES FOR AI AGENTS

**Before starting any task:**
1. Read `ORCHESTRATOR.md` — Understand your role and workflow
2. Read `TASKS.md` — Find your assigned task and acceptance criteria
3. Read relevant Bible section — Understand the spec

**Key Rules:**
- When design and code disagree, Bible wins
- Do NOT invent systems not in the Bible
- Mark inferences with `Assumption:`
- Small, focused changes only

**This Sprint Focus:**
- Phase 0 tasks are BLOCKING — complete before feature work
- Primary goal: Deploy to GitHub Pages for testing
- No mini-games or advanced features until P0 complete

**Protected Files (Do NOT edit without Chief Engineer approval):**
- `docs/GRUNDY_MASTER_BIBLE.md`
- `docs/ASSET_MANIFEST.md`
- `ORCHESTRATOR.md`

---

## 📝 ASSUMPTIONS MADE IN THIS DOCUMENT

1. **Assumption:** GitHub Pages is available for deployment
2. **Assumption:** No CI/CD pipeline exists yet (manual deploy)
3. **Assumption:** PWA icons will be placeholder until art is final
4. **Assumption:** Sound effects will use Web Audio procedural generation initially

---

*Sprint priorities live here. Design SoT: `docs/GRUNDY_MASTER_BIBLE.md` | Agent Workflow: `ORCHESTRATOR.md` | Tasks: `TASKS.md`*
