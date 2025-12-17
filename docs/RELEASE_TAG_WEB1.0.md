# Grundy Web Edition – Tagging Release 1.0.0

> ⚠️ **Historical Document** — This document is a release record from Web 1.0.
> For current specifications, see `docs/GRUNDY_MASTER_BIBLE.md` v1.11.

## Prerequisites

Before tagging the release, verify the following:

- [ ] All Web Phase 5 tasks are marked ✅ in `TASKS.md`
- [ ] QA complete with no open S1/S2 issues (see `docs/QA_WEB1_ISSUES.md`)
- [ ] `npm test -- --run` passes (600+ tests)
- [ ] `npm run build` succeeds
- [ ] `src/version.ts` contains `GRUNDY_WEB_VERSION = '1.0.0'`
- [ ] `package.json` contains `"version": "1.0.0"`
- [ ] `docs/RELEASE_NOTES_WEB1.0.md` exists
- [ ] Local `main` branch is up to date with remote

## Tagging Commands

```bash
# Ensure you're on the main branch and up to date
git checkout main
git pull origin main

# Verify version in source files
grep "GRUNDY_WEB_VERSION" src/version.ts
# Expected output: export const GRUNDY_WEB_VERSION = '1.0.0';

grep '"version"' package.json
# Expected output: "version": "1.0.0",

# Run final verification
npm test -- --run
npm run build

# Create annotated tag
git tag -a web-1.0.0 -m "Grundy Web Edition 1.0.0 - First Light

Features:
- 8 pets with unique abilities
- 5 mini-games with energy/reward system
- Complete FTUE flow
- PWA support with offline shell
- Audio system with SFX/BGM hooks
- Keyboard navigation and accessibility baseline

See docs/RELEASE_NOTES_WEB1.0.md for full details."

# Push tag to remote
git push origin web-1.0.0
```

## Alternative Tag Formats

If your team uses a different tag naming convention:

```bash
# Semantic versioning style
git tag -a v1.0.0 -m "Grundy Web Edition 1.0.0"

# Edition-prefixed style
git tag -a web/v1.0.0 -m "Grundy Web Edition 1.0.0"
```

## Verifying the Tag

After pushing, verify the tag was created:

```bash
# List tags
git tag -l "web-*"

# Show tag details
git show web-1.0.0

# Verify on GitHub (if applicable)
# Navigate to: https://github.com/<org>/<repo>/releases/tag/web-1.0.0
```

## Creating a GitHub Release (Optional)

If using GitHub Releases:

1. Go to the repository's Releases page
2. Click "Draft a new release"
3. Select the `web-1.0.0` tag
4. Set release title: "Grundy Web Edition 1.0.0 - First Light"
5. Copy content from `docs/RELEASE_NOTES_WEB1.0.md` into the description
6. Check "Set as the latest release"
7. Click "Publish release"

## Rollback Instructions

If you need to delete the tag (before or after pushing):

```bash
# Delete local tag
git tag -d web-1.0.0

# Delete remote tag (if already pushed)
git push origin --delete web-1.0.0
```

---

## Post-Release

After tagging:

1. Announce the release to stakeholders
2. Update any external documentation or wikis
3. Begin Phase 6 work on the `main` branch
4. Consider creating a `release/web-1.0.x` branch for hotfixes if needed

---

*This document is for reference only. The actual tagging should be performed by a team member with push access to the repository.*
