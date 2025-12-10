Grundy Pre-Flight Report
1. Repo vs Docs Alignment
Files Confirmed to Exist
Location	Status
README.md	✅
ORCHESTRATOR.md	✅
CURRENT_SPRINT.md	✅
TASKS.md	✅
FINAL_DOCUMENT_INVENTORY.md	✅
docs/GRUNDY_MASTER_BIBLE.md	✅ (122KB)
docs/ASSET_MANIFEST.md	✅
docs/GRUNDY_LORE_CODEX.md	✅
docs/GRUNDY_ONBOARDING_FLOW.md	✅
package.json	✅
tsconfig.json	✅
index.html	✅
assets/pets/	✅ (~120 sprites for all 8 pets)
Files Expected But MISSING (Critical)
Expected (per README)	Status	Impact
vite.config.ts	❌ MISSING	Build will fail
src/main.tsx	❌ MISSING	App won't render (index.html references this)
src/App.tsx	❌ MISSING	No app shell
src/index.css	❌ MISSING	No Tailwind imports
tailwind.config.js	❌ MISSING	Tailwind won't work
postcss.config.js	❌ MISSING	Tailwind won't work
public/ folder	❌ MISSING	No manifest, no icons
public/manifest.json	❌ MISSING	PWA won't work
specs/ folder	❌ MISSING	No YAML specs
src/__tests__/	❌ MISSING	No tests exist
src/components/ folder	❌ MISSING	All 19 components missing
node_modules/	❌ MISSING	Dependencies not installed
Files Expected But Missing (Components)
README lists 19 components, but NONE exist. Only found:

src/GrundyPrototype.tsx (single-file prototype with inline components)
Missing:

Pet.tsx, ProgressBars.tsx, FoodBag.tsx, FoodItem.tsx
ReactionDisplay.tsx, Shop.tsx, Crafting.tsx, CurrencyDisplay.tsx
LevelUpModal.tsx, MainMenu.tsx, PetSelector.tsx, PetUnlockModal.tsx
WelcomeScreen.tsx, Tutorial.tsx, TutorialSpotlight.tsx
SettingsModal.tsx, DevPanel.tsx
games/MiniGameHub.tsx, games/SnackCatch.tsx
Files Expected But Missing (Game Systems)
README lists 4 separate system files, but only 2 exist:

Expected	Actual
src/game/store.ts	✅ Exists
src/game/FeedingSystem.ts	❌ Missing (merged into systems.ts)
src/game/PetSystem.ts	❌ Missing (merged into systems.ts)
src/game/EconomySystem.ts	❌ Missing
src/game/PetAbilities.ts	❌ Missing
src/game/systems.ts	✅ Exists (not in README)
Surprises & Inconsistencies
GrundyPrototype.tsx uses deprecated pet names:

Uses sprout, ember, ripple
Bible specifies: munchlet, grib, plompo, fizz, ember, chomper, whisp, luxe
store.ts initializes with 'sprout' (line 30) - deprecated name

Currency type mismatch:

types/index.ts defines: 'bites' | 'shinies' | 'eventTokens'
Bible uses: coins and gems
store.ts actually uses: coins, gems, eventTokens
Only 3 pets in src/data/pets.ts - Bible specifies 8 pets

Only 8 foods in src/data/foods.ts - Bible says 10 (missing Dream Treat, Golden Feast)

systems.ts has type errors - References non-existent properties:

food.favoriteFor, food.hatedBy, food.tags (not in FoodDefinition)
pet.favoriteCategory, pet.hatedCategory (not in PetDefinition)
food.category (exists as food.rarity instead)
2. Tooling & Config Health
package.json Findings
Aspect	Status	Notes
React	✅ 18.2.0	Matches README
TypeScript	✅ 5.0.0	Matches README
Zustand	✅ 4.4.0	Matches README
Vite	✅ 4.3.0	Matches README
Tailwind	✅ 3.3.2	Matches README
Vitest	✅ 0.32.0	Matches README
Scripts	✅ Present	dev, build, test, lint, preview
Scripts:

"dev": "vite",
"build": "tsc && vite build",
"test": "vitest",
"lint": "eslint src --ext ts,tsx"

tsconfig.json Findings
Setting	Value	Assessment
target	ES2020	✅ Good
strict	true	✅ Good
jsx	react-jsx	✅ Good
moduleResolution	bundler	✅ Vite-compatible
paths	@/* → src/*	✅ Path alias configured
Potential Issues & Risks
Issue	Severity	Impact
No vite.config.ts	🔴 CRITICAL	npm run dev and npm run build will fail
No main.tsx entry	🔴 CRITICAL	App cannot mount to DOM
No tailwind.config.js	🔴 CRITICAL	Tailwind classes won't work
No postcss.config.js	🔴 CRITICAL	PostCSS/Tailwind won't process
No tests	🟡 HIGH	npm test will pass vacuously (nothing to test)
Dependencies not installed	🟡 HIGH	Must run npm install first
Type errors in systems.ts	🔴 CRITICAL	TypeScript compile will fail
3. Code vs Bible – High-Level Check
GAP ANALYSIS Accuracy
System	TASKS.md Says	Actual Status	Assessment
FTUE/Onboarding	🟡 PARTIAL	🔴 MISSING	Incorrect - No FTUE components exist
Core Loop (Feeding)	🟡 PARTIAL	🟡 PARTIAL	Correct - Basic logic in GrundyPrototype.tsx
Lore Journal	🔴 MISSING	🔴 MISSING	Correct
Mini-Games	🟡 PARTIAL	🔴 MISSING	Incorrect - No SnackCatch or hub exists
Shop & Economy	🟡 PARTIAL	🟡 PARTIAL	Correct - Basic shop in prototype
Pet Slots	🔴 MISSING	🔴 MISSING	Correct
Cozy vs Classic	🟡 PARTIAL	🔴 MISSING	Incorrect - No mode system exists
Art/Sprite States	🟡 PARTIAL	🟡 PARTIAL	Correct - Sprites exist, no state logic
Sound & Vibration	🔴 MISSING	🔴 MISSING	Correct
Pet Abilities	🟡 PARTIAL	🔴 MISSING	Incorrect - No abilities implemented
Progression	🟢 ALIGNED	🟡 NEEDS AUDIT	XP formula present but has issues
PWA / Deploy	🟡 PARTIAL	🔴 MISSING	Incorrect - No manifest/public folder
Key Code vs Bible Mismatches
Pet Names: Code uses sprout/ripple, Bible uses munchlet/fizz
Pet Count: Code has 3 pets, Bible has 8
Food Count: Code has 8 foods, Bible has 10
Affinity System: Bible specifies 8×10 matrix (80 entries), code has 3×8 (24 entries)
Mood Tiers: Code has 4 moods, Bible has 5 tiers with specific ranges
Evolution Levels: Code says youth=10, adult=25; Bible says youth=7, evolved=13
Currency Names: Mixed usage of bites/shinies vs coins/gems
4. Recommended First Task (P0)
Task: Create Missing Toolchain Files (Pre-P0-1)
Rationale: P0-1 ("Verify build compiles") cannot pass until essential toolchain files exist.

Why This Must Be First
npm run build will immediately fail - no vite.config.ts
npm run dev will fail - no entry point
TypeScript will fail - systems.ts has type errors
Tailwind won't work - no config files
Files It Will Touch
File	Action
vite.config.ts	Create (standard Vite + React config)
src/main.tsx	Create (ReactDOM.createRoot entry)
src/App.tsx	Create (basic app shell importing GrundyPrototype)
src/index.css	Create (Tailwind directives)
tailwind.config.js	Create (standard config)
postcss.config.js	Create (Tailwind + autoprefixer)
src/game/systems.ts	Fix type errors
src/types/index.ts	Fix currency types (coins/gems)
Sequence
Create toolchain files (vite.config.ts, tailwind.config.js, postcss.config.js)
Create entry files (main.tsx, App.tsx, index.css)
Fix type errors in systems.ts
Run npm install
Run npm run build → verify passes (P0-1)
Run npm test → will pass (no tests, but no failures)
Proceed to P0-2 through P0-8
Assumptions
Assumption: GrundyPrototype.tsx is the intended prototype and should be rendered via App.tsx
Assumption: The deprecated pet names in GrundyPrototype.tsx are legacy and will be fixed in Phase 1
Assumption: We should use the standard Vite + React + Tailwind setup per README
5. Risks / Questions
Blocking Risks
Risk	Impact	Mitigation
No toolchain files	Cannot build/run	Create before P0-1
Type errors in systems.ts	TypeScript compile fails	Fix property references
Mixed currency naming	Confusion, bugs	Standardize to coins/gems
Only 3 pets implemented	Core loop incomplete	Phase 1 will add missing 5
Questions Requiring Clarification
Pet name migration: Should GrundyPrototype.tsx be refactored to use Bible pet names, or is it intended as throwaway code?

store.ts vs GrundyPrototype.tsx: GrundyPrototype.tsx has its own local state (useState). Should it be migrated to use the Zustand store, or are these two separate prototypes?

STARTING_INVENTORY in foods.ts: Has quantities that don't match README (which says starting is 100 coins, 0 gems). Which is correct?

Evolution levels:

types/index.ts says youth=7, evolved=13
config.ts says youth=10, adult=25
Bible says youth=7, evolved=13
Which should we use? Assumption: Bible wins (7/13)
Test framework: TASKS.md assumes tests exist but none do. Should P0-2 be about creating test infrastructure or just verifying existing tests pass?

Summary
The repo has documentation well-organized but code is significantly incomplete. The README describes a full prototype that does not exist - only a single-file GrundyPrototype.tsx with basic functionality.

Before P0-1 can pass:

Must create 6+ missing config/entry files
Must fix type errors
Must run npm install
Recommendation: Insert a "P0-0: Scaffold missing toolchain" task before P0-1, or expand P0-1 to include creating missing files.

