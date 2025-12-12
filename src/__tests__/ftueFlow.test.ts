// ============================================
// GRUNDY — FTUE TESTS
// Tests for FTUE state, selectors, and copy
// P4-FTUE-CORE, P4-1 through P4-8
// ============================================

import { describe, it, expect, beforeEach } from 'vitest';
import { shouldShowFtue } from '../game/store';
import {
  WORLD_INTRO_LINES,
  PET_LORE_SNIPPETS,
  STARTER_PET_IDS,
  LOCKED_PET_IDS,
  MODE_DESCRIPTIONS,
  getPetLore,
  PET_UNLOCK_LEVELS,
  FTUE_COPY,
} from '../copy/ftue';
import type { FtueState, PlayMode } from '../types';

// ============================================
// FTUE STATE TESTS
// ============================================

describe('FTUE State', () => {
  describe('shouldShowFtue', () => {
    it('returns true when hasCompletedFtue is false', () => {
      const state: { ftue: FtueState } = {
        ftue: {
          activeStep: null,
          hasCompletedFtue: false,
          selectedPetId: null,
          selectedMode: null,
        },
      };
      expect(shouldShowFtue(state)).toBe(true);
    });

    it('returns false when hasCompletedFtue is true', () => {
      const state: { ftue: FtueState } = {
        ftue: {
          activeStep: 'complete',
          hasCompletedFtue: true,
          selectedPetId: 'munchlet',
          selectedMode: 'cozy',
        },
      };
      expect(shouldShowFtue(state)).toBe(false);
    });

    it('returns true when FTUE is in progress', () => {
      const state: { ftue: FtueState } = {
        ftue: {
          activeStep: 'pet_select',
          hasCompletedFtue: false,
          selectedPetId: null,
          selectedMode: null,
        },
      };
      expect(shouldShowFtue(state)).toBe(true);
    });
  });

  describe('FtueState structure', () => {
    it('has correct initial values', () => {
      const initialFtue: FtueState = {
        activeStep: null,
        hasCompletedFtue: false,
        selectedPetId: null,
        selectedMode: null,
      };

      expect(initialFtue.activeStep).toBeNull();
      expect(initialFtue.hasCompletedFtue).toBe(false);
      expect(initialFtue.selectedPetId).toBeNull();
      expect(initialFtue.selectedMode).toBeNull();
    });

    it('accepts valid FtueStep values', () => {
      const steps = [
        'splash',
        'age_gate',
        'world_intro',
        'pet_select',
        'mode_select',
        'first_session',
        'complete',
      ];

      steps.forEach((step) => {
        const state: FtueState = {
          activeStep: step as any,
          hasCompletedFtue: false,
          selectedPetId: null,
          selectedMode: null,
        };
        expect(state.activeStep).toBe(step);
      });
    });

    it('accepts valid PlayMode values', () => {
      const modes: PlayMode[] = ['cozy', 'classic'];

      modes.forEach((mode) => {
        const state: FtueState = {
          activeStep: null,
          hasCompletedFtue: false,
          selectedPetId: null,
          selectedMode: mode,
        };
        expect(state.selectedMode).toBe(mode);
      });
    });
  });
});

// ============================================
// WORLD INTRO COPY TESTS (Bible §7.4)
// ============================================

describe('World Intro Copy', () => {
  it('contains exactly 3 lines', () => {
    expect(WORLD_INTRO_LINES).toHaveLength(3);
  });

  it('contains the canonical locked text (Bible §7.4)', () => {
    // These are the EXACT locked lines from the Bible
    expect(WORLD_INTRO_LINES[0]).toBe('Sometimes, when a big feeling is left behind…');
    expect(WORLD_INTRO_LINES[1]).toBe('A tiny spirit called a Grundy wakes up.');
    expect(WORLD_INTRO_LINES[2]).toBe('One of them just found *you*.');
  });

  it('has the emphasized word "you" in the last line', () => {
    expect(WORLD_INTRO_LINES[2]).toContain('*you*');
  });

  it('does not contain any line breaks within lines', () => {
    WORLD_INTRO_LINES.forEach((line) => {
      expect(line).not.toContain('\n');
    });
  });
});

// ============================================
// PET LORE SNIPPETS TESTS (P4-3, P4-4)
// ============================================

describe('Pet Lore Snippets', () => {
  it('contains all 8 pets', () => {
    expect(PET_LORE_SNIPPETS).toHaveLength(8);
  });

  it('has all required fields for each pet', () => {
    PET_LORE_SNIPPETS.forEach((pet) => {
      expect(pet.id).toBeTruthy();
      expect(pet.name).toBeTruthy();
      expect(pet.title).toBeTruthy();
      expect(pet.shortOrigin).toBeTruthy();
      expect(pet.loves).toBeTruthy();
      expect(pet.hates).toBeTruthy();
      expect(pet.teaser).toBeTruthy();
      expect(pet.greeting).toBeTruthy();
      expect(pet.seesFood).toBeTruthy();
      expect(pet.afterFeeding).toBeTruthy();
      expect(pet.tutorialEnd).toBeTruthy();
    });
  });

  it('has non-empty strings for all lore fields', () => {
    PET_LORE_SNIPPETS.forEach((pet) => {
      expect(pet.shortOrigin.length).toBeGreaterThan(10);
      expect(pet.teaser.length).toBeGreaterThan(10);
      expect(pet.greeting.length).toBeGreaterThan(0);
      expect(pet.afterFeeding.length).toBeGreaterThan(0);
    });
  });

  describe('Starter Pets (Full Lore)', () => {
    it('includes munchlet, grib, plompo', () => {
      const starterIds = PET_LORE_SNIPPETS.filter((p) =>
        STARTER_PET_IDS.includes(p.id)
      ).map((p) => p.id);

      expect(starterIds).toContain('munchlet');
      expect(starterIds).toContain('grib');
      expect(starterIds).toContain('plompo');
    });

    it('starter pets have unique personalities', () => {
      const munchlet = getPetLore('munchlet');
      const grib = getPetLore('grib');
      const plompo = getPetLore('plompo');

      // Different greetings
      expect(munchlet?.greeting).not.toBe(grib?.greeting);
      expect(grib?.greeting).not.toBe(plompo?.greeting);

      // Different titles
      expect(munchlet?.title).toBe('The Friendly One');
      expect(grib?.title).toBe('The Mischievous One');
      expect(plompo?.title).toBe('The Sleepy One');
    });
  });

  describe('Locked Pets (Teasers)', () => {
    it('includes fizz, ember, chomper, whisp, luxe', () => {
      const lockedIds = PET_LORE_SNIPPETS.filter((p) =>
        LOCKED_PET_IDS.includes(p.id)
      ).map((p) => p.id);

      expect(lockedIds).toContain('fizz');
      expect(lockedIds).toContain('ember');
      expect(lockedIds).toContain('chomper');
      expect(lockedIds).toContain('whisp');
      expect(lockedIds).toContain('luxe');
    });

    it('locked pets have teaser text that hints at their origin', () => {
      const fizz = getPetLore('fizz');
      const ember = getPetLore('ember');
      const chomper = getPetLore('chomper');

      expect(fizz?.teaser).toContain('thunderstorm');
      expect(ember?.teaser).toContain('fire');
      expect(chomper?.teaser).toContain('kitchen');
    });
  });

  describe('getPetLore helper', () => {
    it('returns lore for valid pet IDs', () => {
      expect(getPetLore('munchlet')).toBeDefined();
      expect(getPetLore('grib')).toBeDefined();
      expect(getPetLore('fizz')).toBeDefined();
    });

    it('returns undefined for invalid pet IDs', () => {
      expect(getPetLore('invalid')).toBeUndefined();
      expect(getPetLore('')).toBeUndefined();
    });
  });
});

// ============================================
// PET UNLOCK LEVELS TESTS
// ============================================

describe('Pet Unlock Levels', () => {
  it('has unlock levels for all locked pets', () => {
    LOCKED_PET_IDS.forEach((petId) => {
      expect(PET_UNLOCK_LEVELS[petId]).toBeDefined();
      expect(PET_UNLOCK_LEVELS[petId]).toBeGreaterThan(0);
    });
  });

  it('has correct unlock levels per Bible §3.2', () => {
    expect(PET_UNLOCK_LEVELS['fizz']).toBe(10);
    expect(PET_UNLOCK_LEVELS['ember']).toBe(15);
    expect(PET_UNLOCK_LEVELS['chomper']).toBe(20);
    expect(PET_UNLOCK_LEVELS['whisp']).toBe(25);
    expect(PET_UNLOCK_LEVELS['luxe']).toBe(30);
  });

  it('does not have unlock levels for starter pets', () => {
    STARTER_PET_IDS.forEach((petId) => {
      expect(PET_UNLOCK_LEVELS[petId]).toBeUndefined();
    });
  });
});

// ============================================
// MODE DESCRIPTIONS TESTS (P4-6, Bible §9)
// ============================================

describe('Mode Descriptions', () => {
  it('contains exactly 2 modes', () => {
    expect(MODE_DESCRIPTIONS).toHaveLength(2);
  });

  it('has cozy and classic modes', () => {
    const modeIds = MODE_DESCRIPTIONS.map((m) => m.id);
    expect(modeIds).toContain('cozy');
    expect(modeIds).toContain('classic');
  });

  // P6-FTUE-MODES: Updated to match Bible §9 accurate copy
  it('cozy mode has correct properties', () => {
    const cozy = MODE_DESCRIPTIONS.find((m) => m.id === 'cozy');
    expect(cozy).toBeDefined();
    expect(cozy?.name).toBe('Cozy Mode');
    expect(cozy?.tagline).toContain('Relax');
    expect(cozy?.features.some((f) => f.toLowerCase().includes('decay'))).toBe(true);
  });

  // P6-FTUE-MODES: Updated to match Bible §9 accurate copy
  it('classic mode has correct properties', () => {
    const classic = MODE_DESCRIPTIONS.find((m) => m.id === 'classic');
    expect(classic).toBeDefined();
    expect(classic?.name).toBe('Classic Mode');
    expect(classic?.tagline).toContain('Your care matters');
    expect(classic?.features.some((f) => f.toLowerCase().includes('neglect'))).toBe(true);
  });

  it('both modes have non-empty features', () => {
    MODE_DESCRIPTIONS.forEach((mode) => {
      expect(mode.features.length).toBeGreaterThan(0);
      mode.features.forEach((feature) => {
        expect(feature.length).toBeGreaterThan(0);
      });
    });
  });
});

// ============================================
// FTUE COPY TESTS
// ============================================

describe('FTUE Copy', () => {
  it('has splash screen copy', () => {
    expect(FTUE_COPY.splash.title).toBe('GRUNDY');
    expect(FTUE_COPY.splash.subtitle).toBeTruthy();
  });

  it('has age gate copy', () => {
    expect(FTUE_COPY.ageGate.title).toBeTruthy();
    expect(FTUE_COPY.ageGate.question).toBeTruthy();
    expect(FTUE_COPY.ageGate.yesButton).toBeTruthy();
    expect(FTUE_COPY.ageGate.noButton).toBeTruthy();
    expect(FTUE_COPY.ageGate.underAgeMessage).toBeTruthy();
  });

  it('has pet select copy', () => {
    expect(FTUE_COPY.petSelect.title).toBeTruthy();
    expect(FTUE_COPY.petSelect.chooseButton).toBeTruthy();
    expect(FTUE_COPY.petSelect.unlockLevel(10)).toContain('10');
  });

  it('has mode select copy', () => {
    expect(FTUE_COPY.modeSelect.title).toBeTruthy();
    expect(FTUE_COPY.modeSelect.subtitle).toBeTruthy();
  });

  it('has first session copy with positive messaging (P4-7)', () => {
    expect(FTUE_COPY.firstSession.title).toBeTruthy();
    expect(FTUE_COPY.firstSession.readyButton).toBeTruthy();
    expect(FTUE_COPY.firstSession.tips.length).toBeGreaterThan(0);
  });
});

// ============================================
// STARTER VS LOCKED PET ARRAYS
// ============================================

describe('Pet ID Arrays', () => {
  it('STARTER_PET_IDS has 3 pets', () => {
    expect(STARTER_PET_IDS).toHaveLength(3);
  });

  it('LOCKED_PET_IDS has 5 pets', () => {
    expect(LOCKED_PET_IDS).toHaveLength(5);
  });

  it('no overlap between starter and locked', () => {
    const overlap = STARTER_PET_IDS.filter((id) => LOCKED_PET_IDS.includes(id));
    expect(overlap).toHaveLength(0);
  });

  it('together they make 8 total pets', () => {
    const allPets = [...STARTER_PET_IDS, ...LOCKED_PET_IDS];
    expect(allPets).toHaveLength(8);
  });
});

// ============================================
// PERSONALITY DIALOGUE TESTS (P4-5)
// ============================================

describe('Personality Dialogue', () => {
  it('starter pets have unique greetings', () => {
    const greetings = STARTER_PET_IDS.map((id) => getPetLore(id)?.greeting);
    const uniqueGreetings = new Set(greetings);
    expect(uniqueGreetings.size).toBe(STARTER_PET_IDS.length);
  });

  it('starter pets have personality-appropriate greetings', () => {
    const munchlet = getPetLore('munchlet');
    const grib = getPetLore('grib');
    const plompo = getPetLore('plompo');

    // Munchlet is friendly
    expect(munchlet?.greeting).toContain('glad');

    // Grib is mischievous
    expect(grib?.greeting).toContain('fun');

    // Plompo is sleepy
    expect(plompo?.greeting).toContain('yawn');
  });

  it('all pets have positive after-feeding messages (P4-7)', () => {
    PET_LORE_SNIPPETS.forEach((pet) => {
      // First reaction is always positive per Bible §7.8
      // None should be explicitly negative
      const text = pet.afterFeeding.toLowerCase();
      expect(text).not.toContain('sad');
      expect(text).not.toContain('awful');
      expect(text).not.toContain('terrible');
      expect(text).not.toContain('hate');
      expect(text).not.toContain('disgusting');
      // Note: "not bad" is positive in context (Grib's personality)
    });
  });
});
