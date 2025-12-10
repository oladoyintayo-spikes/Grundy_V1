# Grundy Bible Update Backlog

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
| BIB-01 | Evolution youth level | §6.1 | 7 | 10 | CE-03 (Amos, 2024-12-10) | ⬜ |
| BIB-02 | Evolution evolved level | §6.1 | 13 | 25 | CE-03 (Amos, 2024-12-10) | ⬜ |

### BIB-01: Evolution Youth Level

**Bible §6.1 Currently Says:**
```
| Stage | Levels | Look |
|-------|--------|------|
| Baby | 1-6 | Simple, small |
| Youth | 7-12 | Growing, developing |
| Evolved | 13+ | Full design |
```

**Code (config.ts:22-25):**
```typescript
evolutionLevels: {
  youth: 10,
  adult: 25,
},
```

**Rationale:** Code wins for pacing. Slower evolution creates more anticipation and aligns with "Curved progression — fast early, slow late" design philosophy (Bible §6.2). Players have longer time in Baby and Youth stages before evolution.

### BIB-02: Evolution Evolved Level

Same as above — Bible says Evolved at 13+, code uses 25 for the same pacing reasons.

---

## Completed Updates

| ID | Area | Updated | By |
|----|------|---------|-----|
| — | — | — | — |

---

## Needs Human Decision

| Area | Bible Says | Code Says | Question |
|------|------------|-----------|----------|
| Evolution stage naming | "Evolved" (§6.1) | `'adult'` (types, config) | Should code rename to 'evolved' or Bible update to 'adult'? Semantic choice. |
| README starting gems | N/A (Bible is correct) | N/A | README.md line 203 says "Starting Gems: 0" but Bible §7.8 and code both say 10. README needs update (not Bible). |

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

*Last updated: 2024-12-10*
