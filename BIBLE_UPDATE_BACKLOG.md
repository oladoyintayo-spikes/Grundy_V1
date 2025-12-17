# Grundy Bible Update Backlog

---
**Document Version:** 1.11
**Last Updated:** December 16, 2025
**Bible Alignment:** v1.11
**Status:** Current
---

> This file tracks decisions where code/tests are considered correct,
> but `docs/GRUNDY_MASTER_BIBLE.md` still reflects older values.
>
> **Rule:** Do NOT edit the Bible directly. Add entries here first.
> Bible updates happen during dedicated documentation passes.

---

## Status Legend

| Symbol | Meaning |
|--------|---------|
| ⬜ | Pending — Not yet applied to Bible |
| ✅ | Complete — Bible updated |
| ❓ | Needs Review — Requires human decision |

---

## Pending Updates

| ID | Area | Bible Section | Current Bible | Target Value | Decision Source | Status |
|----|------|---------------|---------------|--------------|-----------------|--------|
| — | — | — | — | — | — | — |

*No pending updates at this time.*

---

## Completed Updates

| ID | Area | Updated | By |
|----|------|---------|-----|
| BIB-01 | Evolution youth level (7→10) | 2024-12-10 | P1-DOC-1 |
| BIB-02 | Evolution evolved level (13→25) | 2024-12-10 | P1-DOC-1 |

**Rationale (BIB-01 & BIB-02):** Code wins for pacing. Slower evolution creates more anticipation and aligns with "Curved progression — fast early, slow late" design philosophy (Bible §6.2). Players have longer time in Baby and Youth stages before evolution.

---

## Needs Human Decision

| Area | Bible Says | Code Says | Question |
|------|------------|-----------|----------|
| — | — | — | — |

*No items pending human decision.*

**Resolved (2024-12-10):**
- ✅ Evolution stage naming: Code renamed `'adult'` → `'evolved'` (P1-CORE-2)
- ✅ README starting gems: README updated to show 10 gems

---

## Verified Matches (No Action Needed)

These were checked and confirmed to already match:

| Area | Bible Value | Code Value | Source |
|------|-------------|------------|--------|
| Starting Coins | 100 | 100 | Bible §7.8 line 1626, store.ts:32 |
| Starting Gems | 10 | 10 | Bible §7.8 line 1626, store.ts:33 |
| XP Formula | `20 + (L² × 1.4)` | `20 + (L² × 1.4)` | Bible §6.2, config.ts:11-14 |
| Max Level | 50 | 50 | Bible §6.2, config.ts:10 |

---

## How to Use This File

1. **When code intentionally differs from Bible:** Add entry to Pending Updates
2. **When updating Bible:** Move entry to Completed Updates with date
3. **When unclear:** Add to Needs Human Decision section
4. **Consuming task:** See TASKS.md → P1-DOC-01

---

*Last updated: December 16, 2025 (Bible v1.11 alignment)*

---
**Document Version:** 1.11 | **Bible Alignment:** v1.11 | **Updated:** December 16, 2025
