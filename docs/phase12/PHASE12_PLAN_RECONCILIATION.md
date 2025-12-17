# Phase 12 Plan Reconciliation

**Created:** 2025-12-15
**Branch:** `claude/define-phase-next-slice-l9PwF`
**Purpose:** Determine what Phase 12 is according to canonical docs and recommend the next slice.

---

## 1. What Phase 12 Is (As Written)

### Summary

Phase 12 encompasses: **Season Pass, Achievements, Ads, LiveOps**

### From GRUNDY_DEV_STATUS.md (Line 7)

> **Next Phase:** Phase 12 (Season Pass, Achievements, Ads, LiveOps)

### From TASKS.md (Lines 1241-1246)

| ID | Task | Status | Bible | Acceptance Criteria |
|----|------|--------|-------|---------------------|
| P12-1 | Season Pass design | Paused | 11.9 | 30-tier system |
| P12-2 | Season Pass implementation | Paused | 11.9 | Free + Premium tracks |
| P12-3 | Ad SDK integration | Paused | 11.10 | Interstitials + rewarded |
| P12-4 | Rewarded ad placements | Paused | 11.10 | 6 types |
| P12-5 | LiveOps scheduler | Paused | 10 | Time-based events |
| P12-6 | Achievements system | Paused | — | Full framework |

### From Bible v1.10 (Gap Tracking §15.6, Line 5218)

> | Phase 12 | Achievements, Season Pass, Ads, LiveOps | Deferred | — |

---

## 2. Repo Drift Check

### Reconciliation Table

| Source | What it says Phase 12 is | Confidence | Notes |
|--------|--------------------------|------------|-------|
| Bible v1.10 | Season Pass (§11.9), Ads (§11.10), LiveOps (§10), Achievements (mention only) | **Medium** | Season Pass and Ads tagged "[Unity Later]"; Achievements has no dedicated section |
| GRUNDY_DEV_STATUS.md | Phase 12 (Season Pass, Achievements, Ads, LiveOps) | **High** | Line 7, explicit next phase declaration |
| TASKS.md | P12-1..P12-6: Season Pass design/impl, Ad SDK, Rewarded ads, LiveOps scheduler, Achievements | **High** | Lines 1241-1246, explicit task list |

### VERSION DRIFT DETECTED

| Issue | Bible Says | TASKS/DEV_STATUS Says | Severity |
|-------|------------|----------------------|----------|
| Season Pass Platform | `[Unity Later]` (§11.9, lines 52, 149) | Phase 12 (Web) | **HIGH** |
| Ads Platform | `[Unity Later]` (§11.10, line 150) | Phase 12 (Web) | **HIGH** |
| Achievements Spec | No dedicated section (only mentioned in §11.4 as gem source) | P12-6 with "Full framework" | **HIGH** |

**Impact:** Cannot proceed with implementation until Bible clarifies:
1. Whether Season Pass and Ads are Web Phase 12 scope or truly Unity-only
2. What the Achievements system specification should be

---

## 3. Loose Ends Inventory

### Must-Do (Contractual Gaps / Regression Risk)

| Item | Bible Section | Status | Notes |
|------|---------------|--------|-------|
| None identified | — | — | Phase 11 closeout audit passed |

### Nice-to-Do (Polish)

| Item | Bible Section | Status | Notes |
|------|---------------|--------|-------|
| Lore Journal | §6.4 | Not started | Originally "Phase 10.5" in §15.6 |
| Login Streak Days 1-6 | §10.3 | Not implemented | Tagged "Web Later" in §15.6 |
| Art / Sprite States | §13.6 | Deferred | Connect stats to visual states (getDisplayState) |
| Volume Sliders (vs toggles) | §12.4 | P9-7 deferred | Master, Music, SFX sliders |
| Vibration | §12.3 | P9-6 deferred | Android patterns |

### Blocked (Assets/Spec Missing)

| Item | Blocker | Notes |
|------|---------|-------|
| **Achievements system** | **No Bible spec section** | Only mentioned in §11.4 as gem source (5-50 gems one-time); no unlock conditions, no achievement list, no UI spec |
| **Season Pass (Web)** | Platform scope unclear | Bible tags `[Unity Later]` but TASKS.md shows as Phase 12 |
| **Ads (Web)** | Platform scope unclear | Bible tags `[Unity Later]` but TASKS.md shows as Phase 12 |
| **Skin cosmetic slot** | Asset-blocked | Code scaffold exists (§11.5.3 layer order) but no skin assets |

---

## 4. Recommendation: Phase 12-1

### Decision Applied

Per decision rule: **"If Bible ambiguous → recommend patch delta as Phase 12-1 (doc-only)"**

### Phase 12 Definition (1-3 bullets)

1. **Season Pass** — 30-tier hybrid model with free + premium tracks (§11.9)
2. **Achievements** — One-time gem rewards (5-50 gems) for gameplay milestones
3. **LiveOps** — Time-based events, daily specials, login streak completion (§10)
4. **Ads** — Interstitial + rewarded ad placements for free players (§11.10)

### Phase 12-1 Recommended Slice: **Bible Patch Delta (Doc-Only)**

**Scope:** Resolve Bible ambiguities before implementation begins.

**Deliverables:**

| ID | Task | Type | Notes |
|----|------|------|-------|
| P12-1-A | Clarify Season Pass platform scope | Bible Patch | Change `[Unity Later]` to `[Web Phase 12]` OR explicitly defer |
| P12-1-B | Clarify Ads platform scope | Bible Patch | Change `[Unity Later]` to `[Web Phase 12]` OR explicitly defer |
| P12-1-C | Add Achievements system spec | Bible Patch | New section with achievement list, unlock conditions, gem rewards, UI spec |
| P12-1-D | Update §15.6 gap tracking | Bible Patch | Align with new scope decisions |

**Why This Slice:**
- Bible is SoT. Cannot implement features with ambiguous or missing specs.
- Season Pass and Ads have conflicting platform tags.
- Achievements has zero specification beyond "gives gems."
- This slice costs zero development risk and unlocks correct implementation planning.

### Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| Bible v1.10 | Available | Must patch to v1.11 with clarifications |
| BCT v2.4 | Available | BCT specs TBD pending Achievements spec |
| Phase 11 | Complete | No blockers from cosmetics system |

### BCT Plan

| Spec ID | Description | Status |
|---------|-------------|--------|
| TBD | BCT-ACHIEVE-* | Pending Achievements spec |
| TBD | BCT-SEASON-* | Pending platform scope clarification |
| TBD | BCT-ADS-* | Pending platform scope clarification |
| TBD | BCT-LIVEOPS-* | Pending LiveOps scheduler spec |

**Note:** BCT IDs cannot be assigned until Bible spec sections exist.

---

## 5. If Ambiguous: Proposed Patch Delta Outline

### Bible v1.11 Patch Delta Outline

**New/Modified Sections:**

1. **§X.X Achievements System (NEW)**
   - Achievement categories (Progression, Exploration, Collection, Mastery)
   - Achievement list with unlock conditions
   - Gem reward values per achievement
   - UI spec (Achievements panel location, notification behavior)
   - Data schema (AchievementId, AchievementState)

2. **§11.9 Season Pass (MODIFY)**
   - Change platform tag from `[Unity Later]` to `[Web Phase 12]` OR
   - Explicitly add "Web Edition: Deferred to Unity" section with rationale

3. **§11.10 Advertising (MODIFY)**
   - Change platform tag from `[Unity Later]` to `[Web Phase 12]` OR
   - Explicitly add "Web Edition: Deferred to Unity" section with rationale

4. **§10 Events & LiveOps (MODIFY)**
   - Add implementation status tags per sub-feature
   - Clarify Login Streak Days 1-6 platform scope

5. **§15.6 Gaps (UPDATE)**
   - Sync gap tracking table with new scope decisions

### Questions for Stakeholder/CE

1. **Season Pass for Web?** Should Season Pass be implemented on Web, or is it Unity-only as Bible currently states?
2. **Ads for Web?** Should Ads be implemented on Web (stub SDK?), or is it Unity-only?
3. **Achievements Scope?** What achievements should exist? How many? What unlock conditions?
4. **Login Streak Priority?** Should Days 1-6 be Phase 12 or remain "Web Later"?

---

## 6. Next Prompt Stub (Implementation Prompt Once Confirmed)

```markdown
ROLE: Orchestrator + Compliance Lead
CONTRACT: Bible v1.11 (post-patch) + BCT are SoT
SCOPE: Phase 12-2 — [SYSTEM NAME] Implementation
PREREQUISITE: Phase 12-1 Bible patch merged

## Context
- Bible v1.11 includes [NEW SECTION] spec
- Platform scope: Web Phase 12 (confirmed in patch)

## Tasks
1. Implement [FEATURE] per Bible §X.X
2. Add BCT-[PREFIX]-* tests per spec
3. Update DEV_STATUS.md / TASKS.md
4. CE/QA gate review

## Constraints
- NO invention beyond Bible spec
- NO gems from mini-games (locked)
- Cozy mode exemptions as documented
```

---

## Standard Footer

**STATUS:** PARTIAL

**Reason:** Plan reconciliation complete. Bible patch delta required before implementation can proceed.

**Branch:** `claude/define-phase-next-slice-l9PwF`

**Commit:** (pending)

### Verification

| Check | Status |
|-------|--------|
| rg searches completed | YES |
| File created: `docs/phase12/PHASE12_PLAN_RECONCILIATION.md` | YES |

### Files Changed

| File | Action | Notes |
|------|--------|-------|
| `docs/phase12/PHASE12_PLAN_RECONCILIATION.md` | Created | This document |

### Issues / Follow-Ups

- **VERSION DRIFT:** Season Pass and Ads platform tags conflict between Bible (`[Unity Later]`) and TASKS.md (Phase 12)
- **SPEC MISSING:** Achievements system has no Bible section — cannot implement
- **RECOMMENDATION:** Phase 12-1 should be a doc-only Bible patch to resolve ambiguities
- **STAKEHOLDER INPUT NEEDED:** Questions in Section 5 require CE/stakeholder decisions before proceeding
