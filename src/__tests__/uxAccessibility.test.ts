// ============================================
// GRUNDY — UX & ACCESSIBILITY TESTS
// Tests for P5-UX-KEYS, P5-UX-CONTRAST, P5-A11Y-LABELS
// Verifies accessibility patterns are implemented
// ============================================

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// Helper to read component file content
function readComponentFile(relativePath: string): string {
  const fullPath = path.resolve(__dirname, '..', relativePath);
  return fs.readFileSync(fullPath, 'utf-8');
}

// ============================================
// FOCUS RING PATTERN TESTS (P5-UX-KEYS)
// ============================================

describe('Focus Ring Pattern (P5-UX-KEYS)', () => {
  const focusRingPattern = /focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/;

  describe('Layout Components', () => {
    it('BottomNav has FOCUS_RING_CLASS defined', () => {
      const content = readComponentFile('components/layout/BottomNav.tsx');
      expect(content).toContain('FOCUS_RING_CLASS');
      expect(content).toMatch(focusRingPattern);
    });

    // Note: AppHeader has no interactive elements (no buttons), so focus ring is not needed
    // It only contains display elements (PetAvatar, currencies)
  });

  describe('Mini-Game Components', () => {
    it('MiniGameHub has FOCUS_RING_CLASS defined', () => {
      const content = readComponentFile('components/MiniGameHub.tsx');
      expect(content).toContain('FOCUS_RING_CLASS');
      expect(content).toMatch(focusRingPattern);
    });

    it('ReadyScreen has FOCUS_RING_CLASS defined', () => {
      const content = readComponentFile('components/ReadyScreen.tsx');
      expect(content).toContain('FOCUS_RING_CLASS');
      expect(content).toMatch(focusRingPattern);
    });

    it('ResultsScreen has FOCUS_RING_CLASS defined', () => {
      const content = readComponentFile('components/ResultsScreen.tsx');
      expect(content).toContain('FOCUS_RING_CLASS');
      expect(content).toMatch(focusRingPattern);
    });
  });

  describe('FTUE Screens', () => {
    it('FtueSplash has FOCUS_RING_CLASS defined', () => {
      const content = readComponentFile('ftue/screens/FtueSplash.tsx');
      expect(content).toContain('FOCUS_RING_CLASS');
      expect(content).toMatch(focusRingPattern);
    });

    it('FtueAgeGate has FOCUS_RING_CLASS defined', () => {
      const content = readComponentFile('ftue/screens/FtueAgeGate.tsx');
      expect(content).toContain('FOCUS_RING_CLASS');
      expect(content).toMatch(focusRingPattern);
    });

    it('FtuePetSelect has FOCUS_RING_CLASS defined', () => {
      const content = readComponentFile('ftue/screens/FtuePetSelect.tsx');
      expect(content).toContain('FOCUS_RING_CLASS');
      expect(content).toMatch(focusRingPattern);
    });

    it('FtueModeSelect has FOCUS_RING_CLASS defined', () => {
      const content = readComponentFile('ftue/screens/FtueModeSelect.tsx');
      expect(content).toContain('FOCUS_RING_CLASS');
      expect(content).toMatch(focusRingPattern);
    });

    it('FtueFirstSession has FOCUS_RING_CLASS defined', () => {
      const content = readComponentFile('ftue/screens/FtueFirstSession.tsx');
      expect(content).toContain('FOCUS_RING_CLASS');
      expect(content).toMatch(focusRingPattern);
    });

    it('FtueWorldIntro has FOCUS_RING_CLASS defined', () => {
      const content = readComponentFile('ftue/screens/FtueWorldIntro.tsx');
      expect(content).toContain('FOCUS_RING_CLASS');
      expect(content).toMatch(focusRingPattern);
    });
  });
});

// ============================================
// ARIA LABELS TESTS (P5-A11Y-LABELS)
// ============================================

describe('ARIA Labels (P5-A11Y-LABELS)', () => {
  describe('Navigation Components', () => {
    it('BottomNav has navigation role', () => {
      const content = readComponentFile('components/layout/BottomNav.tsx');
      expect(content).toContain('role="navigation"');
    });

    it('BottomNav uses aria-current for active tab', () => {
      const content = readComponentFile('components/layout/BottomNav.tsx');
      expect(content).toContain('aria-current');
    });

    it('BottomNav buttons have aria-label', () => {
      const content = readComponentFile('components/layout/BottomNav.tsx');
      expect(content).toContain('aria-label');
    });
  });

  describe('Header Components', () => {
    it('AppHeader has banner role', () => {
      const content = readComponentFile('components/layout/AppHeader.tsx');
      expect(content).toContain('role="banner"');
    });

    it('AppHeader has screen-reader-only h1', () => {
      const content = readComponentFile('components/layout/AppHeader.tsx');
      expect(content).toContain('sr-only');
      expect(content).toContain('<h1');
    });

    it('AppHeader has status role for resources', () => {
      const content = readComponentFile('components/layout/AppHeader.tsx');
      expect(content).toContain('role="status"');
    });
  });

  describe('Mini-Game Components', () => {
    it('MiniGameHub has group role for game grid', () => {
      const content = readComponentFile('components/MiniGameHub.tsx');
      expect(content).toContain('role="group"');
    });

    it('MiniGameHub has status role for energy display', () => {
      const content = readComponentFile('components/MiniGameHub.tsx');
      expect(content).toContain('role="status"');
    });

    it('MiniGameHub game buttons have aria-label', () => {
      const content = readComponentFile('components/MiniGameHub.tsx');
      expect(content).toContain('aria-label=');
    });

    it('ReadyScreen has main role', () => {
      const content = readComponentFile('components/ReadyScreen.tsx');
      expect(content).toContain('role="main"');
    });

    it('ResultsScreen has region role for rewards', () => {
      const content = readComponentFile('components/ResultsScreen.tsx');
      expect(content).toContain('role="region"');
    });
  });

  describe('FTUE Screens', () => {
    it('FtueSplash is focusable with keyboard', () => {
      const content = readComponentFile('ftue/screens/FtueSplash.tsx');
      expect(content).toContain('tabIndex={0}');
      expect(content).toContain('onKeyDown');
    });

    it('FtueAgeGate has dialog role', () => {
      const content = readComponentFile('ftue/screens/FtueAgeGate.tsx');
      expect(content).toContain('role="dialog"');
    });

    it('FtuePetSelect uses aria-pressed for selection', () => {
      const content = readComponentFile('ftue/screens/FtuePetSelect.tsx');
      expect(content).toContain('aria-pressed');
    });

    it('FtueWorldIntro has article role', () => {
      const content = readComponentFile('ftue/screens/FtueWorldIntro.tsx');
      expect(content).toContain('role="article"');
    });
  });
});

// ============================================
// SEMANTIC HTML TESTS (P5-A11Y-LABELS)
// ============================================

describe('Semantic HTML (P5-A11Y-LABELS)', () => {
  describe('Heading Structure', () => {
    it('MiniGameHub uses h1 for title', () => {
      const content = readComponentFile('components/MiniGameHub.tsx');
      expect(content).toContain('<h1');
    });

    it('ReadyScreen uses h1 for game title', () => {
      const content = readComponentFile('components/ReadyScreen.tsx');
      expect(content).toContain('<h1');
    });

    it('ResultsScreen uses h1 for tier label', () => {
      const content = readComponentFile('components/ResultsScreen.tsx');
      expect(content).toContain('<h1');
    });

    it('ResultsScreen uses h2 for rewards heading', () => {
      const content = readComponentFile('components/ResultsScreen.tsx');
      expect(content).toContain('<h2');
    });

    it('FtuePetSelect uses h1 for title', () => {
      const content = readComponentFile('ftue/screens/FtuePetSelect.tsx');
      expect(content).toContain('<h1');
    });

    it('FtueModeSelect uses h1 for title', () => {
      const content = readComponentFile('ftue/screens/FtueModeSelect.tsx');
      expect(content).toContain('<h1');
    });
  });

  describe('Button Type Attributes', () => {
    it('MiniGameHub buttons have type="button"', () => {
      const content = readComponentFile('components/MiniGameHub.tsx');
      expect(content).toContain('type="button"');
    });

    it('ReadyScreen buttons have type="button"', () => {
      const content = readComponentFile('components/ReadyScreen.tsx');
      expect(content).toContain('type="button"');
    });

    it('ResultsScreen buttons have type="button"', () => {
      const content = readComponentFile('components/ResultsScreen.tsx');
      expect(content).toContain('type="button"');
    });

    it('FtueAgeGate buttons have type="button"', () => {
      const content = readComponentFile('ftue/screens/FtueAgeGate.tsx');
      expect(content).toContain('type="button"');
    });
  });

  describe('Semantic Lists', () => {
    it('ResultsScreen uses dl/dt/dd for rewards', () => {
      const content = readComponentFile('components/ResultsScreen.tsx');
      expect(content).toContain('<dl');
      expect(content).toContain('<dt');
      expect(content).toContain('<dd');
    });
  });
});

// ============================================
// ARIA-HIDDEN FOR DECORATIVE ELEMENTS
// ============================================

describe('Decorative Elements (P5-A11Y-LABELS)', () => {
  it('MiniGameHub hides decorative emoji with aria-hidden', () => {
    const content = readComponentFile('components/MiniGameHub.tsx');
    expect(content).toContain('aria-hidden="true"');
  });

  it('ReadyScreen hides decorative elements with aria-hidden', () => {
    const content = readComponentFile('components/ReadyScreen.tsx');
    expect(content).toContain('aria-hidden="true"');
  });

  it('ResultsScreen hides decorative emoji with aria-hidden', () => {
    const content = readComponentFile('components/ResultsScreen.tsx');
    expect(content).toContain('aria-hidden="true"');
  });

  it('FtueWorldIntro hides decorative stars with aria-hidden', () => {
    const content = readComponentFile('ftue/screens/FtueWorldIntro.tsx');
    expect(content).toContain('aria-hidden="true"');
  });

  it('FtueFirstSession hides decorative emoji with aria-hidden', () => {
    const content = readComponentFile('ftue/screens/FtueFirstSession.tsx');
    expect(content).toContain('aria-hidden="true"');
  });
});

// ============================================
// PET AVATAR ACCESSIBILITY (P5-A11Y-LABELS)
// ============================================

describe('PetAvatar Accessibility (P5-A11Y-LABELS)', () => {
  it('PetAvatar supports petDisplayName prop', () => {
    const content = readComponentFile('components/pet/PetAvatar.tsx');
    expect(content).toContain('petDisplayName');
  });

  it('PetAvatar has POSE_LABELS for alt text', () => {
    const content = readComponentFile('components/pet/PetAvatar.tsx');
    expect(content).toContain('POSE_LABELS');
  });

  it('PetDisplay supports petDisplayName prop', () => {
    const content = readComponentFile('components/pet/PetAvatar.tsx');
    // Check both PetAvatar and PetDisplay have the prop
    const displayNameOccurrences = (content.match(/petDisplayName/g) || []).length;
    expect(displayNameOccurrences).toBeGreaterThanOrEqual(4); // At least in interface and usage for both components
  });

  it('PetAvatar generates descriptive alt text', () => {
    const content = readComponentFile('components/pet/PetAvatar.tsx');
    expect(content).toContain('altText');
    expect(content).toContain('poseDescription');
  });
});

// ============================================
// CONTRAST IMPROVEMENTS (P5-UX-CONTRAST)
// ============================================

describe('Contrast Improvements (P5-UX-CONTRAST)', () => {
  it('AppHeader uses improved text contrast', () => {
    const content = readComponentFile('components/layout/AppHeader.tsx');
    // Should use slate-300 or better for secondary text (not slate-400)
    expect(content).toContain('text-slate-300');
  });

  it('MiniGameHub uses improved text contrast for duration', () => {
    const content = readComponentFile('components/MiniGameHub.tsx');
    // Should use slate-300 for better contrast
    expect(content).toContain('text-slate-300');
  });

  it('ResultsScreen uses improved text contrast', () => {
    const content = readComponentFile('components/ResultsScreen.tsx');
    expect(content).toContain('text-slate-300');
  });

  it('ReadyScreen uses improved text contrast for instructions', () => {
    const content = readComponentFile('components/ReadyScreen.tsx');
    expect(content).toContain('text-slate-300');
  });
});
