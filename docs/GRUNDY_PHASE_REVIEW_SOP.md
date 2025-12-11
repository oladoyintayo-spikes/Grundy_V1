# Grundy Phase Review SOP – Dev / CE / QA

**Version:** 1.0  
**Effective:** December 2024  
**Applies To:** Web Phase 6+, future Unity/mobile phases

---

## 1. Purpose

This SOP defines **how work becomes "done"** on Grundy.

It describes how **Developers (Dev)**, the **Chief Engineer (CE)**, and **QA** review each phase, patch, or feature so that:

- Implementation stays aligned with **GRUNDY_MASTER_BIBLE.md v1.4+**.
- Bible Compliance Tests (BCT) are respected.
- No phase/patch is marked complete solely because "tests pass" or "it feels good enough."

**Key Principle:** "Tests pass" is Dev status, not release status.

---

## 2. Roles

### 2.1 Developer (Dev)

- Implements features, fixes, and UI/UX changes.
- Keeps code, types, and state management clean.
- Updates project docs and status files when work is done.

**Primary artifacts:**

- Code changes (src/*)
- Local tests (unit/spec/E2E as applicable)
- Implementation Summary in PR / agent output
- Updates to:
  - `TASKS.md`
  - `docs/GRUNDY_DEV_STATUS.md` (Dev status fields)
  - `docs/PHASE6_BACKLOG.md` (mark completed tasks)

---

### 2.2 Chief Engineer (CE)

- Owns **design integrity** and **architecture**.
- Ensures implementation **matches the Bible**, Roadmap, and invariants.
- Guards against shortcuts, spec drift, and long-term technical debt.

**Primary responsibilities:**

- Review implementation against:
  - `docs/GRUNDY_MASTER_BIBLE.md` (v1.4+)
  - `docs/PHASE6_BACKLOG.md` (or current backlog)
  - Bible Compliance Test doc
- Approve or reject work based on:
  - Design alignment
  - Architectural soundness
  - Consistency with invariants (e.g., no gems from mini-games, cooldown rules, HUD rules)

---

### 2.3 QA (Quality Assurance)

- Confirms behavior matches Bible rules, not just "what the code happens to do."
- Owns **Bible Compliance Test** execution and coverage.
- Specializes in **fuzzy testing** and edge cases.

**Primary responsibilities:**

- Design and maintain:
  - Bible Compliance **spec tests** (unit/logic)
  - Bible Compliance **E2E tests** (flows, UI, mobile layout)
- Run targeted fuzz and stress tests on critical systems:
  - Feeding / cooldown / fullness
  - Evolution thresholds
  - Rewards & economy
  - Navigation and FTUE flows
- Gate releases based on severity:
  - No open S1/S2 issues allowed for phase/patch completion.

---

## 3. Status Model & Phase Gates

Every significant chunk of work (phase, patch, or feature cluster) has **three independent statuses**:

| Role | Statuses |
|------|----------|
| **Dev** | `PENDING` → `IN_PROGRESS` → `COMPLETE` |
| **CE** | `PENDING` → `APPROVED` / `CHANGES_REQUESTED` |
| **QA** | `PENDING` → `APPROVED` / `BLOCKED` |

These should be reflected in `docs/GRUNDY_DEV_STATUS.md` for each phase/patch.

---

### 3.1 Definition of Done (Phase/Patch)

A phase/patch is **only** considered done when:

| Gate | Requirements |
|------|--------------|
| **Dev = COMPLETE** | Code implemented, tests authored/updated, Implementation Summary written, TASKS.md updated |
| **CE = APPROVED** | Implementation matches Bible v1.4+, any deviations documented, follow-up work captured |
| **QA = APPROVED** | BCT tests passing, no open S1/S2 issues, S3/S4s logged and mapped to backlog |

**If ANY of the three is not satisfied, the work is NOT done.**

---

### 3.2 Issue Severity Definitions

| Severity | Definition | Examples | Release Impact |
|----------|------------|----------|----------------|
| **S1 - Critical** | Game-breaking; blocks core loop or causes data loss | Crash on feed, save corruption, infinite XP | **Blocks release** |
| **S2 - Major** | Bible violation; feature doesn't match spec | No cooldown, gems from mini-games, wrong evolution threshold | **Blocks release** |
| **S3 - Minor** | Polish issue; UX friction but functional | Animation jank, badge cutoff, slow transition | Can ship, must fix in next patch |
| **S4 - Trivial** | Cosmetic; typo, minor visual glitch | Typo in tooltip, 1px alignment | Can ship, backlog |

---

### 3.3 Review Turnaround (Recommended)

| Stage | Target Turnaround |
|-------|-------------------|
| Dev → CE Review | 1 business day |
| CE → QA Review | 1 business day |
| QA Blocker → Dev Fix | Same day (S1/S2) |
| Full cycle (no blockers) | 2-3 business days |

---

### 3.4 BCT Test Coverage by Area

| Phase Focus | Required BCT Tests |
|-------------|-------------------|
| Core Loop (feeding/cooldown/fullness) | BCT-FEED-01, 02, 03 |
| Evolution | BCT-EVO-01 |
| Economy/Mini-games | BCT-ECON-01, 02, BCT-GAME-01, 02 |
| HUD/Stats visibility | BCT-HUD-01, 02 |
| Navigation | BCT-NAV-01, BCT-PET-01, 02 |
| Mobile Layout | BCT-MOBILE-01, 02 |
| Environments/Rooms | BCT-ROOMS-01, 02, 03 |
| FTUE | BCT-FTUE-01, 02 |
| Art/Sprites | BCT-ART-01, 02 |

---

## 4. Standard Workflow (Per Phase/Patch)

### Step 0 – Planning

- Product/Design defines scope in:
  - `docs/PHASE6_BACKLOG.md` (or current backlog doc)
  - `docs/GRUNDY_ROADMAP_v*.md`
- Link tasks to Bible sections:
  - e.g., `P6-CORE-LOOP – Enforce feed cooldown & fullness (Bible §4.3–4.4)`

---

### Step 1 – Dev Implementation

1. Dev takes tasks (e.g., `P6-CORE-LOOP`, `P6-HUD-CLEANUP`).

2. Implements changes in code.

3. Adds/updates tests:
   - Unit/spec tests for the logic
   - E2E tests where applicable
   - Notes any new BCT tests needed

4. Runs:
   ```bash
   npm test
   npm run build
   npm run e2e  # if applicable
   ```

5. Updates docs:
   - `TASKS.md` – Mark finished Dev tasks ✅
   - `docs/GRUNDY_DEV_STATUS.md` – Set `Dev: COMPLETE`, add Implementation Summary
   - `docs/PHASE6_BACKLOG.md` – Mark completed tasks
   - Bible Compliance Test doc – Note any new tests needed

6. Outputs **Implementation Summary**:
   ```markdown
   ## Implementation Summary – P6-CORE-LOOP
   
   ### What Was Done
   - Implemented 30-min feeding cooldown (§4.3)
   - Added STUFFED state blocking (§4.4)
   - Cooldown timer persists across refresh
   
   ### Tests Added/Updated
   - bct-core-loop.spec.ts: BCT-FEED-01, 02, 03
   
   ### CE Should Verify
   - Cooldown duration matches Bible (30 min)
   - STUFFED threshold is 91-100
   - Timer UI displays correctly
   
   ### QA Should Test
   - BCT-FEED-01, 02, 03
   - Spam feeding stress test
   - Mobile layout with cooldown timer
   ```

At this point, **Dev is done**, but the phase/patch is **not yet accepted**.

---

### Step 2 – CE Review (Design & Architecture)

CE reviews what Dev implemented, focusing on:

**Bible Alignment Checklist:**
- [ ] Cooldown & fullness rules (§4.3-4.4)
- [ ] Evolution thresholds (§6.1)
- [ ] No-gems-from-mini-games invariant (§8.3)
- [ ] HUD rules — Bond-only in prod (§4.4)
- [ ] Rooms Lite behavior (§14.4)
- [ ] FTUE copy & flow (§7.4)
- [ ] Mobile layout & nav constraints (§14.5-14.6)
- [ ] Pet art rules (§13.7)

**Architecture Checklist:**
- [ ] No hard-coded magic numbers duplicating Bible values
- [ ] Clear separation: production vs dev/debug behavior
- [ ] Extensibility for future phases (P7+)
- [ ] State management is clean and testable

**Outcomes:**

| Outcome | Action |
|---------|--------|
| **APPROVED** | Set `CE: APPROVED`, add CE Review note to DEV_STATUS |
| **CHANGES_REQUESTED** | Set `CE: CHANGES_REQUESTED`, open tasks in backlog, Dev returns to Step 1 |

**CE Review Note Format:**
```markdown
## CE REVIEW – Phase 6 Core Loop

### Verified Against Bible v1.4
- [x] Feeding cooldown 30 min (§4.3) ✅
- [x] STUFFED blocks feeding (§4.4) ✅
- [x] Cooldown timer visible (§4.3) ✅

### Architecture
- [x] Uses COOLDOWN constant from bible.constants.ts ✅
- [x] Timer persists via localStorage ✅

### Status: CE = APPROVED
```

---

### Step 3 – QA Review (Bible Compliance & Fuzz)

Once CE = APPROVED, QA reviews with two lenses:

**1. Bible Compliance Testing**
- Run relevant BCT tests (see §3.4 mapping)
- Confirm behavior matches Bible v1.4+
- Document test results

**2. Fuzzy / Stress Testing**
- Spam feeding (100+ rapid taps)
- Repeated mini-game entries at cap
- Quick nav cycling (Home/Games/Settings)
- FTUE restart / edge cases
- Cross-device: Desktop + mobile viewport

**Outcomes:**

| Outcome | Action |
|---------|--------|
| **APPROVED** | Set `QA: APPROVED`, add QA Review note, 0 open S1/S2 |
| **BLOCKED** | Set `QA: BLOCKED`, log issues with severity, link to task IDs |

**QA Review Note Format:**
```markdown
## QA REVIEW – Phase 6 Core Loop

### Bible Compliance Tests
- [x] BCT-FEED-01: Stuffed blocks feeding ✅
- [x] BCT-FEED-02: Cooldown reduces value ✅
- [x] BCT-FEED-03: No spam leveling ✅

### Fuzz Testing
- [x] 1,000 rapid feed events: No XP leak while stuffed ✅
- [x] Cooldown timer accuracy: ±1 second tolerance ✅

### Cross-Device
- [x] Desktop (1280x800): Layout correct ✅
- [x] Mobile (390x844): No scroll needed ✅

### Issues Found
- None (S1/S2)
- S4: Minor timer flicker on slow devices (logged as P6-POLISH-01)

### Status: QA = APPROVED
```

---

### Step 4 – Release / Phase Acceptance

**Release Criteria:**

| Status | Required |
|--------|----------|
| Dev | COMPLETE |
| CE | APPROVED |
| QA | APPROVED |

When all three are met:

1. Mark in `GRUNDY_DEV_STATUS.md`: **Phase X: COMPLETE**
2. Create release tag (e.g., `web-1.0.1`)
3. Update release notes
4. Progress roadmap to next phase

**If ANY status is not APPROVED, the phase is NOT released.**

---

## 5. Handling Bible Changes

When implementation reveals the Bible needs to change:

### 5.1 Standard Bible Change Process

1. **Propose Change**
   - CE (with owner) proposes change to Bible v1.x
   - Document: Rationale, impact on behavior, impact on tests

2. **Update Bible**
   - Edit `GRUNDY_MASTER_BIBLE.md`
   - Modify relevant section(s)
   - Bump Bible version (e.g., v1.4 → v1.5)
   - Add changelog entry

3. **Update Tests & Docs**
   - Update Bible Compliance Tests
   - Update `bible.constants.ts`
   - Update backlog/status docs

4. **Re-run Process**
   - Dev implements against new Bible
   - CE verifies against new version
   - QA runs updated tests

**Important:** Implementation must NOT "silently" redefine design. Bible and tests must be updated if design truly changes.

---

### 5.2 Emergency Hotfix Process

For S1 issues in production:

| Step | Action | Focus |
|------|--------|-------|
| 1 | Dev implements minimal fix | Smallest change that fixes issue |
| 2 | CE expedited review | "Does it break anything else?" |
| 3 | QA smoke test | Affected BCT tests + basic flow |
| 4 | Ship with abbreviated notes | Document scope limitation |
| 5 | Full review in next patch | Complete Dev/CE/QA cycle |

**Hotfixes do NOT skip CE/QA** — they get expedited review, not bypassed.

---

## 6. Minimal Checklist (Per Phase/Patch)

Before calling a Web phase/patch **done**, confirm:

### Documentation
- [ ] `GRUNDY_MASTER_BIBLE.md` covers behaviors implemented (or was updated)
- [ ] `PHASE6_BACKLOG.md` tasks are clear, scoped, mapped to Bible sections
- [ ] `TASKS.md` Dev tasks listed and correctly marked ✅/in progress
- [ ] `GRUNDY_DEV_STATUS.md` contains:
  - [ ] Implementation Summary
  - [ ] CE Review note
  - [ ] QA Review note
  - [ ] `Dev: COMPLETE, CE: APPROVED, QA: APPROVED`

### Testing
- [ ] Bible Compliance Tests (relevant subset) passing
- [ ] No open S1/S2 issues tied to this phase/patch
- [ ] S3/S4 issues logged and mapped to backlog

### Release
- [ ] All three gates satisfied
- [ ] Release tag created
- [ ] Release notes updated

**If any box is unchecked, phase/patch acceptance is deferred.**

---

## 7. Agent Integration

When implementation agents (e.g., Claude Code) work on Grundy:

### 7.1 Agent Responsibilities

1. **Identify Scope**
   - Which P#-* tasks are being handled
   - Which phase they belong to
   - Which Bible sections apply

2. **Follow SOP Implicitly**
   - Update `TASKS.md` and `GRUNDY_DEV_STATUS.md`
   - Output structured Implementation Summary
   - List CE verification points
   - List QA test requirements

3. **Output Format**

   Every agent task completion should include:

   ```markdown
   ## TASK COMPLETION: P6-CORE-LOOP
   
   ### Dev Status: COMPLETE
   
   ### Implementation Summary
   - [What was done]
   
   ### Files Modified
   - [List of files]
   
   ### Tests Added/Updated
   - [Test files and BCT IDs]
   
   ### CE Verification Required
   - [ ] [Bible section + specific check]
   
   ### QA Testing Required
   - [ ] [BCT test IDs]
   - [ ] [Fuzz/stress tests]
   
   ### Bible Sections Referenced
   - §X.X [Section name]
   ```

### 7.2 Agent Limitations

Agents can set:
- `Dev: COMPLETE`

Agents cannot set:
- `CE: APPROVED` (requires human CE review)
- `QA: APPROVED` (requires human QA verification)

Final authority for acceptance remains with:
- **Owner** (product decisions)
- **CE** (design + architecture)
- **QA** (Bible Compliance & fuzz)

---

## 8. Quick Reference

### Status Flow
```
Dev: PENDING → IN_PROGRESS → COMPLETE
                                ↓
CE:  PENDING ←────────────── CHANGES_REQUESTED
        ↓
     APPROVED
        ↓
QA:  PENDING ←────────────── BLOCKED
        ↓
     APPROVED
        ↓
   PHASE COMPLETE → Release
```

### Severity Quick Guide
| Sev | Blocks Release? | Fix Timeline |
|-----|-----------------|--------------|
| S1 | YES | Immediate |
| S2 | YES | This patch |
| S3 | No | Next patch |
| S4 | No | Backlog |

### Key Bible Sections
| Topic | Section |
|-------|---------|
| Cooldown/Fullness | §4.3-4.4 |
| Evolution | §6.1 |
| Mini-games/Economy | §8.2-8.3 |
| FTUE | §7.4 |
| Navigation | §14.5 |
| Mobile Layout | §14.6 |
| Art | §13.7 |

---

**This SOP exists so the game doesn't quietly drift away from the Bible again.**
