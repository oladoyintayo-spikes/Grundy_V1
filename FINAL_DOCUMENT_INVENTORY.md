# FINAL DOCUMENT INVENTORY

**Status:** Ready for Repo Upload  
**Date:** December 2024

---

## ✅ DOCUMENTS READY TO UPLOAD (6 files)

All files have Design SoT reference and are production-ready.

### Root Directory (2 files)

| File | Size | Purpose |
|------|------|---------|
| `README.md` | 10KB | Project overview, tech stack, setup |
| `CURRENT_SPRINT.md` | 11KB | Active tasks, blockers, testing checklist |

### docs/ Directory (4 files)

| File | Size | Purpose |
|------|------|---------|
| `GRUNDY_MASTER_BIBLE.md` | 122KB | **DESIGN SOURCE OF TRUTH** (v1.3) |
| `ASSET_MANIFEST.md` | 4KB | 120 sprite files, 8 pets, state mapping |
| `GRUNDY_LORE_CODEX.md` | 28KB | Full pet lore, journal system, unlocks |
| `GRUNDY_ONBOARDING_FLOW.md` | 35KB | FTUE timing, screens, dialogue tables |

---

## DOCUMENT HIERARCHY

```
GRUNDY_MASTER_BIBLE.md          ← CANONICAL (wins all conflicts)
    │
    ├── ASSET_MANIFEST.md       ← Sprite inventory (subordinate)
    │
    ├── GRUNDY_LORE_CODEX.md    ← Extended lore (subordinate)
    │
    └── GRUNDY_ONBOARDING_FLOW.md ← FTUE detail (subordinate)
```

Every subordinate document includes:
```
> **Design SoT:** `docs/GRUNDY_MASTER_BIBLE.md` — This document is subordinate to the Bible.
```

---

## 📦 ARCHIVE THESE (11 files)

Move to `archive/` folder — reference only, superseded by Bible:

| File | Reason |
|------|--------|
| `grundy_complete_game_bible.md` | Superseded |
| `grundy_complete_game_bible_v3.md` | Superseded |
| `GRUNDY_GAME_BIBLE_v4_ADDENDUM.md` | Consolidated |
| `GRUNDY_HYBRID_MODE_DESIGN.md` | Consolidated |
| `GRUNDY_PWA_MINIGAMES_DESIGN.md` | Consolidated |
| `GRUNDY_SOUND_VIBRATION_DESIGN.md` | Consolidated |
| `GRUNDY_PET_ANIMATION_DESIGN.md` | Consolidated |
| `GRUNDY_MASTER_GDD_v1.md` | Legacy |
| `GRUNDY_COMPLETE_DOCUMENTATION.md` | Superseded |
| `GRUNDY_MASTER_DECISIONS.md` | Historical reference |
| `ORCHESTRATOR.md` | Agent instructions (needs update) |
| `CODEX.md` | Unclear purpose |

---

## 🗑️ DELETE THESE (2 files)

| File | Reason |
|------|--------|
| `CLAUDE_CODE_MASTER_TODO.md` | Will create new task list |
| `grundy_dashboard.html` | Dev tool, not needed |

---

## FINAL REPO STRUCTURE

```
grundy/
├── README.md                      ← Updated
├── CURRENT_SPRINT.md              ← Updated
│
├── docs/
│   ├── GRUNDY_MASTER_BIBLE.md     ← DESIGN SoT (122KB, v1.3)
│   ├── ASSET_MANIFEST.md          ← 120 sprites, state mapping
│   ├── GRUNDY_LORE_CODEX.md       ← Extended lore
│   └── GRUNDY_ONBOARDING_FLOW.md  ← FTUE detail
│
├── game/
│   ├── grundy-game-v5.html        ← Current prototype
│   └── grundy_interactive_mockup.html
│
├── assets/
│   └── sprites/                   ← (Art files per ASSET_MANIFEST)
│
└── archive/                       ← Legacy docs (11 files)
```

---

## UPLOAD COMMANDS

```bash
# 1. Create directories
mkdir -p docs archive

# 2. Upload new/updated files to docs/
# (Upload from outputs folder)
# - GRUNDY_MASTER_BIBLE.md
# - ASSET_MANIFEST.md
# - GRUNDY_LORE_CODEX.md
# - GRUNDY_ONBOARDING_FLOW.md

# 3. Upload root files
# - README.md
# - CURRENT_SPRINT.md

# 4. Move legacy to archive/
mv grundy_complete_game_bible*.md archive/
mv GRUNDY_*_DESIGN.md archive/
mv GRUNDY_GAME_BIBLE*.md archive/
mv GRUNDY_MASTER_GDD*.md archive/
mv GRUNDY_COMPLETE_DOCUMENTATION.md archive/
mv GRUNDY_MASTER_DECISIONS.md archive/
mv ORCHESTRATOR.md archive/
mv CODEX.md archive/

# 5. Delete obsolete
rm CLAUDE_CODE_MASTER_TODO.md
rm grundy_dashboard.html
```

---

## VERIFICATION CHECKLIST

After upload, verify:

- [ ] `docs/GRUNDY_MASTER_BIBLE.md` exists and is 122KB+
- [ ] `README.md` contains "Design SoT: `docs/GRUNDY_MASTER_BIBLE.md`"
- [ ] `CURRENT_SPRINT.md` contains "Design SoT: `docs/GRUNDY_MASTER_BIBLE.md`"
- [ ] All 4 docs files contain subordinate reference
- [ ] `archive/` contains 11 legacy files
- [ ] No legacy GDD files in root

---

## NEXT STEP

After repo is organized:

**Create Claude Code task list** referencing:
- `docs/GRUNDY_MASTER_BIBLE.md` for design specs
- `CURRENT_SPRINT.md` for immediate priorities
- `docs/ASSET_MANIFEST.md` for sprite integration

---

*Ready for upload. All documents have Design SoT references.*
