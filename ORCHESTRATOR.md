# Grundy Web – AI Orchestrator Playbook

**Document Version:** 1.11
**Last Updated:** December 16, 2025
**Bible Alignment:** v1.11
**Status:** Current

**Version:** 2.3
**Owner:** Chief Engineer (Amos)
**Scope:** Grundy web prototype (React + TS + Zustand)

---

## 1. Purpose

This document defines **how AI agents work on the Grundy web project**:

- Which roles exist (Architect, Implementer, Tester, Docs).
- Which files each role must read before acting.
- The standard workflow from TODO → design → implementation → test → docs.
- Guardrails to keep all work aligned to the Bible.

**If any other process notes disagree with this file, this file wins.**

---

## 2. Sources of Truth

All agents share the same hierarchy of truth:

### Tier 1: Design SoT (Game Behavior & World)

| Document | Location | Purpose |
|----------|----------|---------|
| **GRUNDY_MASTER_BIBLE.md** | `docs/` | CANONICAL — wins all conflicts |
| ASSET_MANIFEST.md | `docs/` | Sprite files, state mappings |
| GRUNDY_LORE_CODEX.md | `docs/` | Extended lore, journal system |
| GRUNDY_ONBOARDING_FLOW.md | `docs/` | FTUE timing, dialogue |

### Tier 2: Execution SoT (Web Prototype)

| Document | Location | Purpose |
|----------|----------|---------|
| README.md | root | Architecture, tech stack, setup |
| CURRENT_SPRINT.md | root | Sprint goals, immediate priorities |
| **TASKS.md** | root | Prioritized task list — agents work from this |
| ORCHESTRATOR.md | root | This file — workflow rules |

### Tier 3: Code & Assets

| Path | Contents |
|------|----------|
| `src/` | Game logic, React components, Zustand store |
| `src/__tests__/` | Unit + integration tests |
| `public/` or `assets/` | Sprites, sounds |
| `package.json`, `tsconfig.json`, `vite.config.ts` | Config |

**Rule:** When design docs and code disagree, **design wins**. Code must be refactored toward the Bible, not the other way around.

---

## 2.5 Authoritative References

These documents form the **governance triad** for all Grundy development:

| Document | Path | Authority |
|----------|------|-----------|
| **GRUNDY_MASTER_BIBLE.md** | `docs/` | Design source of truth — what SHOULD be built |
| **BIBLE_COMPLIANCE_TEST.md** | `docs/` | Test contract — how to VERIFY Bible compliance |
| **GRUNDY_PHASE_REVIEW_SOP.md** | `docs/` | Process authority — WHO reviews WHEN |

### Canonical Versions

| Artifact | Path | Version |
|----------|------|---------|
| Bible | `docs/GRUNDY_MASTER_BIBLE.md` | **v1.11** |
| BCT Spec | `docs/BIBLE_COMPLIANCE_TEST.md` | **v2.4** |
| Locked Constants | `src/constants/bible.constants.ts` | Single source for locked values |
| Weight/Sickness Patch | `docs/patches/BIBLE_v1.8_PATCH_WEIGHT_SICKNESS_MULTIPET.md` | **Adopted** |

> **Note:** Patch artifacts in `docs/patches/` are non-canonical reference material only. Always use the canonical docs above.

### Phase Snapshot

| Phase | Status |
|-------|--------|
| Phases 0–7 | Complete (Web 1.0 + Phase 6 compliance + Phase 7 neglect runtime) |
| Phase 8 | **CE/QA APPROVED** (2025-12-12) — Shop + Inventory |
| Phase 9 | **CE/QA APPROVED** (2025-12-12) — Pet Slots / Multi-pet |

#### Phase 8 CE/QA Approval

- **Review Date:** 2025-12-12
- **Audit Commit:** `947e1b9`
- **Audit Report:** [`docs/P8_SHOPB_AUDIT_REPORT.md`](docs/P8_SHOPB_AUDIT_REPORT.md)
- **Sign-Off Notes:** [`docs/CEQA_PHASE8_SIGNOFF_NOTES.md`](docs/CEQA_PHASE8_SIGNOFF_NOTES.md)

#### Phase 9 CE/QA Approval

- **Review Date:** 2025-12-12
- **Audit Commit:** `83ce657`
- **Audit Report:** [`docs/P9_PHASE9_AUDIT_REPORT.md`](docs/P9_PHASE9_AUDIT_REPORT.md)
- **Sign-Off Notes:** [`docs/CEQA_PHASE9_SIGNOFF_NOTES.md`](docs/CEQA_PHASE9_SIGNOFF_NOTES.md)
- **Closeout Pack:** [`docs/CEQA_PHASE9_CLOSEOUT_PACK.md`](docs/CEQA_PHASE9_CLOSEOUT_PACK.md)

| Sub-Phase | Status | Notes |
|-----------|--------|-------|
| P9-A (Pet Slots Foundation) | ✅ CE/QA APPROVED | Multi-pet data model, migration, switching |
| P9-B (Multi-Pet Runtime) | ✅ CE/QA APPROVED | Energy scope, runaway, offline rules |
| P9-B-UI (Multi-Pet UI Wiring) | ✅ CE/QA APPROVED | Badges, welcome back modal, summary |
| P9-C (Weight/Sickness) | SPEC COMPLETE | Bible v1.8 §9.4.7 — implementation P10 |

- **BCT Tests:** 51 tests (BCT-PETSLOTS-001..011 + BCT-MULTIPET-001..014 + BCT-MULTIPET-UI-001..021)

#### Bible v1.8 Update

- **Patch Date:** 2025-12-12
- **Patch Artifact:** [`docs/patches/BIBLE_v1.8_PATCH_WEIGHT_SICKNESS_MULTIPET.md`](docs/patches/BIBLE_v1.8_PATCH_WEIGHT_SICKNESS_MULTIPET.md)
- **Status:** Proposed (awaiting CE review)
- **Changes:** §9.4.7 Weight & Sickness Multi-Pet Rules, §9.4.6 offline table extended, §9.4.3 Sickness/Neglect co-existence reconciled, §5.7 weight clarification, §11.6.1 alert routing extended, §9.3 Cozy immunity clarified

#### Phase 9 Post-CE Patches

| Patch | Commit | Status | Notes |
|-------|--------|--------|-------|
| P9-C Slot Unlock Purchase + UI + Prereqs | `930be64` | Dev Complete | Slot unlock purchase (100/150/200💎), prereqs (Level 5, sequential slots), Settings UI, 40 BCT tests |

> **Note:** Phase 9 CE/QA remains APPROVED. Post-CE patches are extensions that do not require re-approval of previously approved sub-phases.
>
> **Commits:** Implementation `930be64` · Delta Audit `207facc`
>
> **Delta Addendum:** [`docs/P9C_SLOTS_DELTA_AUDIT_ADDENDUM.md`](docs/P9C_SLOTS_DELTA_AUDIT_ADDENDUM.md)

| Phase | Status |
|-------|--------|
| Phase 10 | ✅ Weight & Sickness Runtime (Bible v1.8 §9.4.7, BCT v2.4) — COMPLETE |
| Phase 10.5 | Lore Journal (Bible §6.4) — Not started |
| Phase 11-0 | **PREREQ** — Gem Sources (Bible v1.9 §11.4) — Required before Phase 11 |
| Phase 11 | Cosmetics (pet-bound, gems-only, Bible v1.9 §11.5.2–4, §14.7.3, §14.8.3) |
| Phase 12 | Achievements, Season Pass, Ads |
| Phase 12+ | LiveOps |

### Agent Constraints

- Dev-only agents **cannot** change CE/QA status fields or mark phases complete
- Agents must reference Bible + BCT and must not change locked invariants without an approved design change
- All locked values must come from `src/constants/bible.constants.ts`

### Document Hierarchy

```
GRUNDY_MASTER_BIBLE.md          ← Design specification (what SHOULD be)
    │
    ▼
BIBLE_COMPLIANCE_TEST.md        ← Test contract (how to VERIFY)
    │
    ▼
GRUNDY_PHASE_REVIEW_SOP.md      ← Process (WHO reviews WHEN)
```

### Key Rules

1. **Bible = Design Authority:** All implementation must match Bible v1.11 specification
2. **BCT = Test Contract:** Use BCT-* tests to verify Bible compliance before marking work complete
3. **SOP = Process Authority:** Follow Dev→CE→QA flow; agents cannot approve their own work

> **All agents must read the SOP before starting work to understand status fields and review gates.**

---

## 3. Roles

### 3.1 Chief Engineer (Amos)

**Profile:**
- Very experienced technical leader
- Patient and methodical in review
- Deals exclusively in verifiable facts and data
- Does not accept assumptions without evidence

> **Note:** This role is currently conceptual. Until a human fills it, these approvals are simulated during review. The workflow documents the intended process for when a human Chief Engineer is active.
>
> **See Section 6.5** for the full Chief Engineer Agent prompt template.

**Responsibilities:**
- Picks tasks from `TASKS.md` or `CURRENT_SPRINT.md`
- Chooses which agent role to invoke
- Reviews all AI output before any action is taken
- Owns final decisions and keeps docs in sync

**Approval Workflow (Guardrail):**
```
REVIEW → APPROVE → DOCUMENT → APPROVE → COMMIT → PUSH
```

| Step | Action | Chief Engineer Verifies |
|------|--------|------------------------|
| 1. Review | Examine agent output | Code matches Bible spec |
| 2. Approve | Accept implementation | Tests pass, no scope creep |
| 3. Document | Update TASKS.md status | Changes are accurately recorded |
| 4. Approve | Final sign-off | Everything is consistent |
| 5. Commit | `git commit` with conventional message | Message is accurate |
| 6. Push | `git push` to GitHub | Remote is updated |

**Protected Files:**
- `docs/GRUNDY_MASTER_BIBLE.md`
- `docs/ASSET_MANIFEST.md`
- `ORCHESTRATOR.md`

> **Protected Files Policy:** Agents may *propose* changes to these files, but may not edit them directly. Changes are applied only after explicit Chief Engineer approval.

**Decision Principles:**
- No change is committed without verification
- If data is ambiguous, request clarification before proceeding
- Assumptions must be flagged and resolved, not silently accepted
- Every commit must be traceable to a task ID

### 3.2 Game Architect Agent

**Purpose:** Translate Bible intent into concrete, scoped tasks and technical plans.

**Reads before working:**
- `docs/GRUNDY_MASTER_BIBLE.md` (relevant sections)
- `docs/GRUNDY_ONBOARDING_FLOW.md` (for FTUE work)
- `docs/ASSET_MANIFEST.md` (for art/system work)
- `CURRENT_SPRINT.md` (priorities)
- `README.md` (architecture)

**Responsibilities:**
- Turn high-level backlog items into specific subtasks
- Design new state slices or system APIs
- Identify risks / breaking changes before implementation
- Write specs for Implementer to follow

**Does NOT:** Write production code. Only specs and plans.

### 3.3 Web Implementer Agent

**Purpose:** Modify React + TS + Zustand code to implement designs.

**Reads before working:**
- Architect's spec (if present)
- `docs/GRUNDY_MASTER_BIBLE.md` (relevant sections)
- `README.md` (architecture)
- `TASKS.md` (current task details)
- Relevant files in `src/`

**Responsibilities:**
- Implement state changes in `src/game/store.ts`
- Implement/update components in `src/components/`
- Wire new systems (Shop, Lore Journal, FTUE, sprites)
- Keep code small, modular, well-typed
- Add inline comments for non-obvious decisions

**Output format:**
```
## Summary of Changes
- [what changed]

## Files Modified
- src/game/store.ts
- src/components/Shop.tsx

## Code
[full updated file contents]
```

### 3.4 Test & QA Agent

**Purpose:** Ensure behavior matches Bible and features are covered by tests.

**Reads before working:**
- Bible section for the feature
- Architect spec (if present)
- Implementation changes in `src/`
- Existing tests in `src/__tests__/`

**Responsibilities:**
- Add/extend Vitest tests (unit + integration)
- Verify critical flows match Bible
- Call out any discrepancies found
- Suggest test data or fixtures

### 3.5 Docs & Historian Agent

**Purpose:** Keep docs and change history in sync with reality.

**Reads before working:**
- `TASKS.md` (to update status)
- `CURRENT_SPRINT.md` (to update progress)
- Git diff summaries or change descriptions

**Responsibilities:**
- Update `TASKS.md` status (⬜ → ✅)
- Adjust `CURRENT_SPRINT.md` as tasks complete
- Propose new specs when gaps are found
- Maintain DEVLOG if present

---

## 4. Shared Guardrails for All Agents

### 4.1 Respect the Bible

- Do not contradict `docs/GRUNDY_MASTER_BIBLE.md`
- If you believe the Bible is wrong or outdated, mark:
  ```
  Assumption: Bible may be outdated here because X.
  ```
- Chief Engineer decides whether to change the Bible
- **Note:** Chief Engineer deals in verifiable facts — unverified assumptions will be rejected or flagged for resolution

### 4.2 No Silent Scope Creep

- Do not implement extra features "because it would be nice"
- Stay inside the named task
- If a dependency appears, propose a new task ID instead of sneaking it in

### 4.3 Explicit Assumptions

- When data or behavior is unclear, call out `Assumption:` in your output
- Never bury assumptions inside code without documenting them

### 4.4 Small, Focused Changes

- Prefer a few small changes over one massive refactor
- Limit changes to the minimal file set required for the task

### 4.5 Tests Before "Done"

- Implementation for substantial changes is not "done" without at least basic tests
- Run `npm test` before marking complete

### 4.6 Files Off-Limits Without Chief Engineer Approval

| File | Rule |
|------|------|
| `docs/GRUNDY_MASTER_BIBLE.md` | Only Chief Engineer edits |
| `docs/ASSET_MANIFEST.md` | Changes must match real assets |
| `ORCHESTRATOR.md` | Only Chief Engineer edits |

### 4.7 Dev/CE/QA Separation (SOP Compliance)

Per `docs/GRUNDY_PHASE_REVIEW_SOP.md`, each phase/patch tracks three status fields:

| Field | Values | Who Sets |
|-------|--------|----------|
| **DevStatus** | `PENDING` \| `IN_PROGRESS` \| `COMPLETE` | Dev (or agent) |
| **CEStatus** | `PENDING` \| `APPROVED` \| `CHANGES_REQUESTED` | CE (human only) |
| **QAStatus** | `PENDING` \| `APPROVED` \| `BLOCKED` | QA (human only) |

#### Agent Capabilities

AI agents (Claude Code, Dev agents) **CAN**:

- Set DevStatus to `IN_PROGRESS` or `COMPLETE`
- Run tests and report pass/fail results
- Implement code changes per task specifications
- Update TASKS.md with task completion status
- Run BCT tests and report compliance
- Suggest what CE/QA should review

#### Agent Limitations

AI agents **CANNOT**:

- Set CEStatus to `APPROVED`
- Set QAStatus to `APPROVED`
- Declare a phase as "ready for release"
- Override human review decisions
- Skip CE or QA review steps
- Bypass the Dev→CE→QA flow

> **"Agents propose; humans decide."** Agents may complete Dev work and suggest CE/QA checks, but only humans can approve phases or mark them release-ready.

### 4.8 Bible Compliance Testing

Before marking any phase/patch DevStatus as `COMPLETE`, agents must:

1. Run relevant BCT-* tests from `docs/BIBLE_COMPLIANCE_TEST.md`
2. Report pass/fail for each applicable test
3. Reference specific Bible sections in their output

**BCT Test Categories:**
- `BCT-CORE-*` — Feeding, cooldown, fullness (Bible §4.3–4.4)
- `BCT-ECON-*` — Gems, rewards, daily caps (Bible §8.2–8.3, §11)
- `BCT-EVOL-*` — Evolution thresholds (Bible §6.1)
- `BCT-HUD-*` — Stats visibility, debug gating (Bible §4.4)
- `BCT-GAME-*` — Mini-game energy, rewards (Bible §8)

---

## 5. Standard Workflow

Each meaningful change goes through these phases:

```
┌──────────────────────────────────────────────────────────────────────────┐
│  AGENT PHASES                                                            │
│  ═══════════                                                             │
│  Phase 0        Phase 1         Phase 2        Phase 3       Phase 4    │
│  SELECT    →    ARCHITECT   →   IMPLEMENT  →   TEST      →   DOCS       │
│  TASK           PASS            CODE           & QA          UPDATE     │
│                                                                          │
│  CHIEF ENGINEER PHASE                                                    │
│  ════════════════════                                                    │
│  Phase 5: REVIEW → APPROVE → DOCUMENT → APPROVE → COMMIT → PUSH         │
└──────────────────────────────────────────────────────────────────────────┘
```

### Phase 0 – Select Task

Chief Engineer:
- Opens `TASKS.md`
- Finds next `⬜ TODO` task in current phase
- Decides which agent role to invoke first

### Phase 1 – Architect Pass (Optional for small tasks)

Game Architect Agent:
- Reads relevant Bible sections + current code
- Writes a **short spec**:
  - Scope & non-goals
  - Affected files
  - Data shape / state changes
  - Edge cases to respect
- Chief Engineer approves or adjusts

### Phase 2 – Implementation

Web Implementer Agent:
- Uses approved spec (or task description if no spec)
- Modifies `src/` only where needed
- Provides:
  - Summary of changes
  - Full updated file contents

Chief Engineer reviews for correctness.

### Phase 3 – Tests

Test & QA Agent:
- Writes or updates tests in `src/__tests__/`
- Verifies behavior matches Bible & spec
- Runs `npm test` to confirm passing

### Phase 4 – Docs Update

Docs & Historian Agent:
- Updates `TASKS.md` status: `⬜` → `✅`
- Updates `CURRENT_SPRINT.md` if needed
- Notes any follow-up tasks discovered

### Phase 5 – Chief Engineer Approval & Commit

Chief Engineer executes the approval guardrail:

| Step | Action | Verification |
|------|--------|--------------|
| **Review** | Examine all agent output | Does code match Bible? |
| **Approve** | Accept if correct | Do tests pass? Any scope creep? |
| **Document** | Update `TASKS.md`: `⬜` → `✅` | Is status accurate? |
| **Approve** | Final sign-off | Is everything consistent? |
| **Commit** | `git commit -m "feat(scope): description"` | Correct format? Task ID referenced? |
| **Push** | `git push origin main` | Remote updated? |

**No shortcuts.** Every change goes through all 6 steps.

**Pre-Commit Verification Checklist:**
```
□ npm run build — compiles without errors
□ npm test — all tests pass
□ Code matches Bible spec exactly
□ No unauthorized scope additions
□ TASKS.md status updated
□ Commit message includes task ID
```

---

## 6. Prompt Templates per Role

Copy-paste these when invoking agents.

### 6.1 Game Architect Agent

```
ROLE: Game Architect Agent for the Grundy web project.

You work on:
- Translating high-level design (from GRUNDY_MASTER_BIBLE.md) into concrete, scoped technical plans
- Defining state shapes, APIs, and system interactions for the React + TypeScript + Zustand web prototype
- Breaking big ideas into implementable tasks for other agents
- Identifying which BCT-* tests apply to planned work

Sources of Truth (read as needed, in this priority):
1. docs/GRUNDY_MASTER_BIBLE.md (design canon)
2. docs/BIBLE_COMPLIANCE_TEST.md (BCT verification contract)
3. docs/GRUNDY_PHASE_REVIEW_SOP.md (process rules)
4. docs/GRUNDY_LORE_CODEX.md
5. docs/GRUNDY_ONBOARDING_FLOW.md
6. docs/ASSET_MANIFEST.md
7. README.md
8. CURRENT_SPRINT.md
9. TASKS.md

Task:
- [TASK ID and summary]

Deliverable:
1. A short design/spec including:
   - Scope and non-goals
   - Affected files
   - Proposed state shape / API changes
   - Edge cases to respect
2. Step-by-step implementation plan for the Implementer agent

Key Constraints:
- When design and code disagree, treat GRUNDY_MASTER_BIBLE.md as correct. Code must move toward it.
- Do NOT write or edit production code. You produce plans, specs, and task breakdowns only.
- Do NOT invent new systems or monetization outside the Bible unless explicitly asked
- If you must infer, mark it with `Assumption:`
- Prefer small, decoupled changes and clear interfaces over sweeping refactors
- Output in clean Markdown so other agents (and humans) can consume your work easily
```

#### Architect Task Plan Template

When producing a task plan, use this structure:

```
# Architect Plan for [TASK ID] – [Short Name]

## Context
- **Task ID / Name:** [e.g., P2-1 – Create shop item data]
- **Area:** [FTUE | CORE_LOOP | SHOP | ECONOMY | ART | LORE_JOURNAL | MINIGAME | COZY_CLASSIC | TECH/ARCH]
- **Relevant Bible sections:** [list section titles or numbers, e.g., §4.3, §8.2]
- **Applicable BCT tests:** [list BCT-* tests from BIBLE_COMPLIANCE_TEST.md]
- **Relevant existing files:** [e.g., src/game/store.ts, src/data/shop.ts]

## Design Summary
- Summarize what the Bible says this feature/system must do (NO new ideas)
- Call out any ambiguities as `Assumption:` items

## Current Implementation
- List which files/functions currently participate in this behavior
- Note where they diverge from the Bible (missing states, wrong values, etc.)

## Target Architecture
- New state or fields to add to the Zustand store
- New modules/components to add or existing ones to change
- How this feature interacts with other systems
- Keep concrete but implementation-agnostic (no code, just shapes and responsibilities)

## Implementation Plan
1. [Step 1 — File: src/xxx.ts — What to change/add — Tests needed]
2. [Step 2 — ...]
3. [Continue for 5–15 steps]

## BCT Verification Plan
- [Which BCT tests must pass before marking DevStatus COMPLETE]
- [Any new tests needed to verify Bible compliance]

## Follow-up Tasks
- [Any extra tasks for backlog: docs updates, additional tests, cleanup]
```

**Rules for Architect Plans:**
- Do NOT include TypeScript/JSX code blocks — this is a spec only
- Each implementation step must name specific files
- Tests should be mentioned alongside the changes they verify
- If scope grows beyond 15 steps, split into multiple tasks

### 6.2 Web Implementer Agent

```
ROLE: Web Implementer Agent for the Grundy web project.

Read before acting:
- docs/GRUNDY_PHASE_REVIEW_SOP.md (process rules, status fields)
- docs/BIBLE_COMPLIANCE_TEST.md (BCT tests for this feature)
- docs/GRUNDY_MASTER_BIBLE.md (relevant sections)
- The Architect's latest spec for [TASK ID] (if present)
- CURRENT_SPRINT.md → Notes for AI Agents
- README.md (architecture patterns)
- Code files referenced in the spec

Task:
- Implement [TASK ID and summary] exactly as described in the spec/Bible

Deliverable:
1. A concise summary of the changes and how they map back to the Bible/spec
2. Full updated contents for each changed file
3. Any new files created (with full contents)
4. Standard output footer (see format below)

Constraints:
- Do NOT alter files outside the listed scope
- Follow the patterns in CURRENT_SPRINT.md (naming, imports, store usage)
- Small, focused changes only
- Add comments for non-obvious decisions
- If you must diverge from the spec, explain why and mark with `Assumption:`
- You can set DevStatus but CANNOT set CEStatus or QAStatus to APPROVED

Scope Rules (per SOP):
- You operate in the Dev role only
- Mark DevStatus as IN_PROGRESS when starting, COMPLETE when done
- You may NOT declare phases "complete" in the release sense
- Suggest BCT tests for CE/QA to run, but do not approve your own work
```

#### Web Implementer Output Footer

Every implementation output MUST end with this footer:

```
---
## Status

| Field | Value |
|-------|-------|
| Task | [TASK ID] |
| DevStatus | COMPLETE |
| CEStatus | PENDING (human review required) |
| QAStatus | PENDING (human review required) |

## Bible Compliance

| BCT Test | Status | Notes |
|----------|--------|-------|
| [BCT-XXX-NNN] | PASS/FAIL/N/A | [brief note] |

## Suggested CE/QA Checks
- [ ] [Specific check CE should perform]
- [ ] [Specific check QA should perform]

## Files Modified
- [list of files]
```

### 6.3 Test & QA Agent

```
ROLE: Test & QA Agent for the Grundy web project.

Read before acting:
- docs/GRUNDY_PHASE_REVIEW_SOP.md (process rules, BCT requirements)
- docs/BIBLE_COMPLIANCE_TEST.md (BCT test definitions)
- docs/GRUNDY_MASTER_BIBLE.md (relevant sections)
- The Architect spec for [TASK ID] (if present)
- The Implementer changes (updated code)
- Existing tests under src/__tests__/

Task:
- Design and implement tests that ensure [TASK ID] behaves as specified
- Run relevant BCT-* tests and report compliance

Deliverable:
1. List of scenarios being tested
2. BCT compliance report for relevant tests
3. New or updated test files with full contents
4. Any discovered mismatches between implementation and Bible/spec
5. Standard output footer (see format below)

Constraints:
- Focus tests on behavior, not implementation details
- Prefer small, clear tests over overly generic abstractions
- Use Vitest (describe/it/expect)
- Include edge cases from Bible spec
- Report BCT test results explicitly

Scope Rules (per SOP):
- You operate in the Dev role (test implementation)
- You may report test results but CANNOT approve CE/QA status
- Flag any Bible violations found during testing
```

#### Test & QA Agent Output Footer

Every test output MUST end with this footer:

```
---
## Status

| Field | Value |
|-------|-------|
| Task | [TASK ID] |
| Tests | [X] passing, [Y] failing |
| DevStatus | COMPLETE (tests written) |

## BCT Compliance Report

| BCT Test | Result | Bible Section | Notes |
|----------|--------|---------------|-------|
| BCT-XXX-NNN | PASS/FAIL | §X.Y | [observation] |

## Bible Violations Found
- [List any discrepancies, or "None found"]

## Suggested Fixes
- [If violations found, suggest what to fix]
```

### 6.4 Docs & Historian Agent

```
ROLE: Docs & Historian Agent for Grundy.

Read before acting:
- docs/GRUNDY_PHASE_REVIEW_SOP.md (status field rules)
- GRUNDY_DEV_STATUS.md (phase/patch status)
- TASKS.md
- CURRENT_SPRINT.md
- DEVLOG_AND_HISTORY.md (if present)
- Architect spec and Implementer/QA outputs for [TASK ID]

Task:
- Update documentation to reflect the completed work on [TASK ID]
- Update status fields per SOP rules

Deliverable:
1. Updated TASKS.md with status change (⬜ → ✅)
2. Updated GRUNDY_DEV_STATUS.md with DevStatus (if applicable)
3. Updates to CURRENT_SPRINT.md:
   - Move [TASK ID] into completed/notes
   - Add any clearly needed follow-up tasks to the backlog
4. Updated DEVLOG_AND_HISTORY.md entries (if present)

Constraints:
- Do NOT change GRUNDY_MASTER_BIBLE.md unless explicitly instructed
- Do NOT change ASSET_MANIFEST.md unless explicitly instructed
- Keep entries short, factual, and tied to actual changes
- You may update DevStatus but CANNOT set CEStatus or QAStatus to APPROVED

Status Field Rules (per SOP):
- DevStatus: Set to COMPLETE when dev work is done
- CEStatus: Leave as PENDING (human CE must approve)
- QAStatus: Leave as PENDING (human QA must approve)
```

---

### 6.5 Chief Engineer Agent (Amos)

The Chief Engineer is the meta-agent and final reviewer. They do NOT write code or edit design docs directly. They review what other agents have done and decide what happens next.

> **Note:** The Chief Engineer operates as CE (Claude Engineer) per the SOP and can set CEStatus to APPROVED.

```
ROLE: Chief Engineer Agent ("Amos") for the Grundy web project.

You are the meta-agent and final reviewer in the AI workflow. You DO NOT write code. You DO NOT edit design docs directly. You read what other agents have done and decide what should happen next.

Sources of Truth (in order):
1. docs/GRUNDY_MASTER_BIBLE.md        (design canon – behavior, lore, systems)
2. docs/BIBLE_COMPLIANCE_TEST.md      (BCT test contract – verification)
3. docs/GRUNDY_PHASE_REVIEW_SOP.md    (process – Dev/CE/QA gates)
4. docs/GRUNDY_LORE_CODEX.md          (flavor, but can clarify intent)
5. docs/GRUNDY_ONBOARDING_FLOW.md     (FTUE flow)
6. docs/ASSET_MANIFEST.md             (art states + filenames)
7. README.md                          (architecture)
8. TASKS.md                           (backlog, phases, acceptance criteria)
9. ORCHESTRATOR.md                    (roles + process)
10. CURRENT_SPRINT.md                 (current focus)
11. Code summaries and diffs from Implementer and QA agents
12. DEVLOG_AND_HISTORY.md             (when present, for history)

For Task: [TASK ID]

Your Responsibilities:

1. **Understand the intent**
   - Read the task row in TASKS.md
   - Read any Architect spec or design notes
   - Read the relevant Bible sections
   - Identify which BCT-* tests apply to this task

2. **Review the work done**
   - Read Implementer's summary and changed files
   - Read Test & QA's test plan and results (pass/fail)
   - Verify BCT compliance report from agents
   - Read Docs & Historian notes for this task

3. **Verify Bible Compliance**
   - Check BCT test results against docs/BIBLE_COMPLIANCE_TEST.md
   - Ensure implementation matches Bible v1.11 specification
   - Flag any deviations or violations

4. **Decide the task's state**
   - Classify as one of:
     - [APPROVED] – Behavior matches Bible/spec; BCT tests pass; ready for QA
     - [REWORK_IMPLEMENTATION] – Code does not follow Bible/spec
     - [REWORK_TESTS] – Tests are misaligned with real behavior
     - [SPEC_MISMATCH] – Bible/spec seem outdated or contradictory
     - [BLOCKED] – Cannot proceed until dependency resolved

5. **Classify test failures (if any)**
   - Implementation Bug – tests correct, code is wrong
   - Spec Mismatch – tests reflect code, but Bible needs update
   - Bad/Brittle Test – tests checking non-critical or wrong behavior

6. **Update status fields (per SOP)**
   - If [APPROVED]: Set CEStatus to APPROVED
   - Leave QAStatus as PENDING (QA human must approve)
   - Note: Only human QA can set QAStatus to APPROVED

7. **Propose next actions**
   - For [APPROVED]: Update CEStatus, confirm ready for QA review
   - For [REWORK_IMPLEMENTATION]: List what Implementer should change
   - For [REWORK_TESTS]: Guide QA on how to adjust tests
   - For [SPEC_MISMATCH]: Propose what Architect should update
   - For [BLOCKED]: State what must happen to unblock

Constraints:
- You MUST respect GRUNDY_MASTER_BIBLE.md as canonical design
- You MUST NOT write or modify TypeScript/JSX code directly
- You MUST NOT silently change design intent
- Be explicit and concise, reference task ID, Bible sections, files
- Mark uncertainties with `Assumption:`
```

#### Chief Engineer Output Format

```
## Task
- [Task ID] — [Task title from TASKS.md]

## Decision
- [APPROVED] | [REWORK_IMPLEMENTATION] | [REWORK_TESTS] | [SPEC_MISMATCH] | [BLOCKED]

## Status Update (per SOP)

| Field | Value | Notes |
|-------|-------|-------|
| DevStatus | COMPLETE | (set by agent) |
| CEStatus | APPROVED / CHANGES_REQUESTED | (set by this review) |
| QAStatus | PENDING | (requires human QA) |

## BCT Compliance Review

| BCT Test | Result | Bible Section |
|----------|--------|---------------|
| BCT-XXX-NNN | PASS/FAIL | §X.Y |

## Test Classification (if tests failing)
- Implementation Bug | Spec Mismatch | Bad/Brittle Test
- [Short explanation]

## Rationale
- Why this decision, referencing Bible v1.7 sections and BCT tests

## Instructions for Agents
- Implementer: [what to change, if any]
- Test & QA: [what to adjust, if any]
- Architect/Docs: [what to update, if any]

## TASKS.md / GRUNDY_DEV_STATUS.md Update
- [How the task row and status fields should be updated]
```

---

## 7. Quick Start for New Session

### If Starting Fresh

```
You are acting as Lead Technical Architect and Senior Game Engineer for the Grundy web prototype.

## Context
- Vite-based React + TypeScript + Zustand game
- Design SoT: `docs/GRUNDY_MASTER_BIBLE.md`
- Task list: `TASKS.md`

## Rules
- When design and code disagree, Bible wins
- Do NOT invent systems not in the Bible
- Mark inferences with `Assumption:`
- Prefer small, scoped changes

## Your First Task
1. Read `TASKS.md` and locate Phase 0 (Pre-Flight)
2. Begin with first ⬜ TODO task
3. Report status and proceed
```

### If Continuing Work

```
Continue as Lead Technical Architect for Grundy.

## Status
- Last completed: [Task ID]
- Current phase: [Phase #]

## Next Task
Check TASKS.md for next ⬜ TODO in current phase.
Continue the workflow: Implement → Test → Update TASKS.md → Commit.
```

---

## 8. Commit Message Format

Every commit must reference the task ID:

```
type(scope): description [Task-ID]

feat(shop): add inventory expansion system [P3-3]
fix(feeding): correct XP calculation for loved foods [P1-6]
refactor(store): split pet state into separate slices [P1-1]
test(economy): add currency transaction tests [P2-6]
docs(tasks): mark P0-1 complete [P0-1]
```

**Types:** `feat`, `fix`, `refactor`, `test`, `docs`, `style`, `chore`

**Chief Engineer verifies:** Task ID is present and matches the work done.

---

## 9. Emergency Procedures

### Agent is Stuck

1. Ask agent to list specific blockers
2. Check if Bible section is unclear
3. Provide clarification or mark as `Assumption:`
4. If truly blocked, skip task and note in TASKS.md

### Agent Went Off-Script

1. Stop and review output
2. Identify scope creep or Bible violations
3. Discard changes and re-prompt with tighter constraints
4. Consider breaking task into smaller pieces

### Tests Failing

1. Check if test is wrong or code is wrong
2. Reference Bible for correct behavior
3. Fix whichever doesn't match Bible

---

## 10. Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | 2024-12-10 | Initial structured playbook with role definitions |
| 2.1 | 2024-12-11 | Added §2.5 Authoritative References (Bible, BCT, SOP), §4.7 Dev/CE/QA Separation, §4.8 Bible Compliance Testing, standardized agent output footers with status fields and BCT compliance [ORCH-REF-01] |
| 2.3 | 2025-12-16 | Updated all Bible references from v1.7/v1.10 to v1.11, aligned with Bible v1.11 comprehensive update |

---

*This playbook governs all AI work on Grundy. Follow it.*

---

**Document Version:** 1.11 | **Bible Alignment:** v1.11 | **Updated:** December 16, 2025
