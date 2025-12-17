# Grundy — Phase Review SOP

---
**Document Version:** 1.11
**Last Updated:** December 16, 2025
**Bible Alignment:** v1.11
**Status:** Active
---

## Purpose

This Standard Operating Procedure (SOP) defines the review process for phases, patches, and hotfixes in the Grundy project.

**Key documents:**
- **Design specification:** `docs/GRUNDY_MASTER_BIBLE.md` (v1.11)
- **Test contract:** `docs/BIBLE_COMPLIANCE_TEST.md` (v2.4)
- **Status tracking:** `GRUNDY_DEV_STATUS.md`
- **Task tracking:** `TASKS.md`

> **Bible Compliance tests are defined in `docs/BIBLE_COMPLIANCE_TEST.md` and must be used as the contract for CE and QA review.**

---

## Roles

| Role | Abbreviation | Responsibility |
|------|--------------|----------------|
| **Developer** | Dev | Implements features, writes code, runs tests |
| **Claude Engineer** | CE | Reviews code, validates Bible compliance, approves for QA |
| **Quality Assurance** | QA | Tests functionality, verifies user experience, approves for release |
| **Product Owner** | PO | Final approval for major releases |

### Role Boundaries

- **Dev** can mark implementation work as COMPLETE
- **CE** can approve or request changes to Dev work
- **QA** can approve or block releases
- **Only humans (CE/QA/PO)** can approve phases or patches for release

---

## Status Model

### Status Fields in GRUNDY_DEV_STATUS.md

Each phase/patch has three status fields:

| Field | Values | Who Sets |
|-------|--------|----------|
| **DevStatus** | `PENDING` \| `IN_PROGRESS` \| `COMPLETE` | Dev (or agent) |
| **CEStatus** | `PENDING` \| `APPROVED` \| `CHANGES_REQUESTED` | CE (human only) |
| **QAStatus** | `PENDING` \| `APPROVED` \| `BLOCKED` | QA (human only) |

### Status Definitions

| Status | Meaning |
|--------|---------|
| `PENDING` | Work not started or not submitted for review |
| `IN_PROGRESS` | Work actively being done |
| `COMPLETE` | Dev work finished, ready for CE review |
| `APPROVED` | Reviewer has approved (CE or QA) |
| `CHANGES_REQUESTED` | CE found issues; Dev must address |
| `BLOCKED` | QA found critical issues; cannot proceed |

### Example Status Block

```markdown
## Phase 6.1 — Core Loop Hardening

| Field | Status | Updated | By |
|-------|--------|---------|-----|
| DevStatus | COMPLETE | 2024-12-11 | @dev-agent |
| CEStatus | PENDING | — | — |
| QAStatus | PENDING | — | — |
```

> **Note:** These fields are per-phase or per-patch, not global. Each deliverable tracks its own status.

---

## Review Process

### Phase Review Flow

```
┌──────────────────┐
│   Dev: PENDING   │
└────────┬─────────┘
         │ Dev starts work
         ▼
┌──────────────────┐
│ Dev: IN_PROGRESS │
└────────┬─────────┘
         │ Dev completes + tests pass
         ▼
┌──────────────────┐
│  Dev: COMPLETE   │◄─────────────┐
│  CE: PENDING     │              │
└────────┬─────────┘              │
         │ CE reviews             │
         ▼                        │
    ┌────┴────┐                   │
    │ Issues? │                   │
    └────┬────┘                   │
    Yes  │  No                    │
    │    │                        │
    ▼    ▼                        │
┌────────────────┐  ┌────────────────┐
│ CE: CHANGES_   │  │  CE: APPROVED  │
│   REQUESTED    │──│  QA: PENDING   │
└────────────────┘  └────────┬───────┘
         │                   │ QA tests
         │                   ▼
         │              ┌────┴────┐
         │              │ Issues? │
         │              └────┬────┘
         │              Yes  │  No
         │              │    │
         │              ▼    ▼
         │      ┌────────────────┐  ┌────────────────┐
         │      │  QA: BLOCKED   │  │  QA: APPROVED  │
         │      └────────────────┘  └────────┬───────┘
         │              │                    │
         └──────────────┴────────────────────┘
                        │
                        ▼
                ┌────────────────┐
                │    RELEASE     │
                └────────────────┘
```

### Phase Review Checklist

#### Dev Checklist (Before marking COMPLETE)

- [ ] All code implemented per TASKS.md
- [ ] All unit tests pass (`npm test -- --run`)
- [ ] Build succeeds (`npm run build`)
- [ ] No TypeScript errors
- [ ] Code matches Bible specification
- [ ] Relevant BCT tests pass locally (`npm run test:bible`)

#### CE Checklist (Before APPROVED)

- [ ] Dev work matches Bible v1.7 requirements
- [ ] BCT spec tests pass (`npm run test:bible`)
- [ ] BCT E2E tests pass (`npm run test:bible:e2e`)
- [ ] No regressions from previous phases
- [ ] Code quality acceptable
- [ ] Documentation updated (if applicable)

#### QA Checklist (Before APPROVED)

- [ ] Functional testing complete
- [ ] All BCT tests pass in test environment (`npm run test:bible` + `npm run test:bible:e2e`)
- [ ] No S1/S2 issues found
- [ ] User experience acceptable
- [ ] Edge cases tested

---

## Patch Review Process

Patches are smaller than phases but follow the same flow.

### Patch Scope

| Patch Type | Scope | BCT Tests |
|------------|-------|-----------|
| Feature patch | New functionality | All relevant BCT-* |
| Bug fix patch | Specific fix | Affected BCT-* + regression |
| Hotfix | Emergency fix | Minimum relevant BCT-* |

### Patch Status Tracking

Add patch status to GRUNDY_DEV_STATUS.md under the relevant phase:

```markdown
### Patch 6.1.1 — Cooldown Timer Fix

| Field | Status | Updated | By |
|-------|--------|---------|-----|
| DevStatus | COMPLETE | 2024-12-11 | @dev-agent |
| CEStatus | APPROVED | 2024-12-11 | @ce-reviewer |
| QAStatus | PENDING | — | — |
```

---

## Hotfix / Emergency Patch Process

Hotfixes address critical production issues with compressed timelines.

### Hotfix Rules

1. **Does NOT bypass CE/QA** — Only compresses the timeline
2. **Minimum BCT required** — Run at least the relevant subset:
   - Feeding hotfix → BCT-CORE-001, BCT-CORE-002, BCT-CORE-003
   - Mini-game hotfix → BCT-GAME-001, BCT-GAME-002, BCT-ECON-001
   - HUD hotfix → BCT-HUD-001, BCT-HUD-002
3. **Fast-track review** — CE/QA review can be concurrent, not sequential
4. **Post-hotfix audit** — Full BCT run within 24 hours after deployment

### Hotfix Flow

```
┌────────────────────────────────────────┐
│  CRITICAL ISSUE IDENTIFIED             │
└────────────────┬───────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────┐
│  Dev: Implement fix                    │
│  Run minimum relevant BCT tests        │
└────────────────┬───────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────┐
│  CE + QA: Concurrent review            │
│  (compressed timeline, NOT bypassed)   │
└────────────────┬───────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────┐
│  DEPLOY HOTFIX                         │
└────────────────┬───────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────┐
│  Post-deploy: Full BCT audit (24h)     │
└────────────────────────────────────────┘
```

> **Even for emergency hotfixes, run at least the relevant subset of Bible Compliance tests (e.g., BCT-CORE-* for feeding hotfixes, BCT-GAME-* for mini-game hotfixes) before deploying.**

---

## How Agents Should Use This SOP

### Agent Capabilities

Agents (Claude Code, Dev agents) **CAN**:

- Mark DevStatus as `IN_PROGRESS` or `COMPLETE`
- Run tests and report results
- Implement code changes
- Update TASKS.md with task completion
- Suggest what CE/QA should review
- Run BCT tests and report pass/fail

### Agent Limitations

Agents **CANNOT**:

- Set CEStatus to `APPROVED`
- Set QAStatus to `APPROVED`
- Declare a phase as "COMPLETE" in the sense of "ready for release"
- Mark phases/patches as released
- Override human review decisions
- Skip CE or QA review steps

> **Agents propose; humans decide. Agents may complete Dev work and suggest CE/QA checks, but only humans (you/CE/QA) can approve phases or mark them complete.**

### Agent Workflow Example

```markdown
## Agent completing Phase 6.1

1. Agent implements P6-CORE-COOLDOWN
2. Agent runs tests: `npm test -- --run` ✅
3. Agent runs BCT-CORE-001, BCT-CORE-002, BCT-CORE-003 locally ✅
4. Agent updates TASKS.md: P6-CORE-COOLDOWN ✅
5. Agent updates GRUNDY_DEV_STATUS.md:
   - DevStatus: COMPLETE
   - CEStatus: PENDING (agent cannot change this)
   - QAStatus: PENDING (agent cannot change this)
6. Agent reports: "Dev work complete. Ready for CE review.
   Suggest running BCT-CORE-* tests."
7. Human CE reviews and sets CEStatus: APPROVED
8. Human QA tests and sets QAStatus: APPROVED
```

---

## Document References

| Document | Purpose | Path |
|----------|---------|------|
| Bible (Design SoT) | What should be built | `docs/GRUNDY_MASTER_BIBLE.md` |
| BCT (Test Contract) | How to verify compliance | `docs/BIBLE_COMPLIANCE_TEST.md` |
| Phase Review SOP | Who reviews when | `docs/GRUNDY_PHASE_REVIEW_SOP.md` |
| Dev Status | Current phase/patch status | `GRUNDY_DEV_STATUS.md` |
| Task List | Detailed task tracking | `TASKS.md` |
| Phase 6 Backlog | Phase 6 specific tasks | `docs/PHASE6_BACKLOG.md` |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-12-11 | Initial SOP with explicit BCT reference, status fields, agent limits, hotfix BCT requirements |
| 1.11 | 2025-12-16 | Bible v1.11 alignment update |

---

*This SOP is the process authority for phase reviews. The Bible is the design authority. The BCT is the test authority.*

---
**Document Version:** 1.11 | **Bible Alignment:** v1.11 | **Updated:** December 16, 2025
