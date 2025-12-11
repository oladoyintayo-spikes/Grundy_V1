/**
 * GRUNDY — BCT-ART TESTS (Bible Compliance Tests - Art)
 *
 * P6-ART-PRODUCTION & P6-ART-TEST: Tests enforcing sprite coverage
 * and "no orb/emoji when sprites exist" guarantee.
 *
 * @see docs/BIBLE_COMPLIANCE_TEST.md - BCT-ART-* tests
 * @see Bible §13.7 - Sprite art requirements
 */

import { describe, it, expect } from 'vitest';
import {
  PET_SPRITES,
  ALL_PET_IDS,
  CORE_POSES,
  EXTENDED_POSES,
  POSE_FALLBACKS,
  PET_SPRITES_BY_STAGE,
  KNOWN_SPRITE_COMBOS,
  resolvePetSprite,
  getStageAwarePetSprite,
  hasSpriteForStage,
  getPetSprite,
  hasPetPose,
  getAvailablePoses,
  type PetId,
  type PetPose,
} from '../art/petSprites';
import type { EvolutionStage } from '../types';

// ============================================
// BCT-ART-01: Asset Coverage Tests
// ============================================

describe('BCT-ART-01: Asset Coverage', () => {
  describe('all pets have idle sprites for all stages', () => {
    const stages: EvolutionStage[] = ['baby', 'youth', 'evolved'];

    ALL_PET_IDS.forEach((petId) => {
      stages.forEach((stage) => {
        it(`BCT-ART-01 – ${petId}/${stage} has idle sprite`, () => {
          const sprite = resolvePetSprite(petId, stage, 'idle');
          expect(sprite).toBeTruthy();
          expect(typeof sprite).toBe('string');
        });
      });
    });
  });

  describe('all pets have core poses', () => {
    ALL_PET_IDS.forEach((petId) => {
      CORE_POSES.forEach((pose) => {
        it(`BCT-ART-01 – ${petId} has ${pose} pose`, () => {
          expect(hasPetPose(petId, pose)).toBe(true);
        });
      });
    });
  });

  describe('sprite registry is fully populated', () => {
    it('has entries for all 8 pets', () => {
      expect(Object.keys(PET_SPRITES)).toHaveLength(8);
    });

    it('stage-aware registry has entries for all 8 pets', () => {
      expect(Object.keys(PET_SPRITES_BY_STAGE)).toHaveLength(8);
    });

    it('KNOWN_SPRITE_COMBOS covers all 24 pet/stage combinations', () => {
      // 8 pets x 3 stages = 24 combinations
      expect(KNOWN_SPRITE_COMBOS).toHaveLength(24);
    });
  });
});

// ============================================
// BCT-ART-02: Fallback Chain Tests
// ============================================

describe('BCT-ART-02: Fallback Chain', () => {
  describe('POSE_FALLBACKS structure', () => {
    it('all poses have fallback chain defined', () => {
      const allPoses: PetPose[] = [...CORE_POSES, ...EXTENDED_POSES];
      allPoses.forEach((pose) => {
        expect(POSE_FALLBACKS[pose]).toBeDefined();
        expect(Array.isArray(POSE_FALLBACKS[pose])).toBe(true);
      });
    });

    it('idle has empty fallback chain (ultimate fallback)', () => {
      expect(POSE_FALLBACKS.idle).toEqual([]);
    });

    it('eating_loved falls back to eating/ecstatic/happy/idle', () => {
      expect(POSE_FALLBACKS.eating_loved).toContain('eating');
      expect(POSE_FALLBACKS.eating_loved).toContain('ecstatic');
      expect(POSE_FALLBACKS.eating_loved).toContain('happy');
      expect(POSE_FALLBACKS.eating_loved).toContain('idle');
    });
  });

  describe('fallback resolution works correctly', () => {
    it('eating_loved resolves to a sprite for munchlet', () => {
      const sprite = resolvePetSprite('munchlet', 'baby', 'eating_loved');
      expect(sprite).toBeTruthy();
    });

    it('whisp eating falls back (whisp has no eating sprite)', () => {
      // whisp has no eating sprite, should fall back
      const sprite = resolvePetSprite('whisp', 'baby', 'eating');
      expect(sprite).toBeTruthy();
      // Should fall back to happy or idle
      expect(sprite).toBeTruthy();
    });

    it('whisp crying falls back (whisp has no crying sprite)', () => {
      // whisp has no crying sprite, should fall back to sad or idle
      const sprite = resolvePetSprite('whisp', 'baby', 'crying');
      expect(sprite).toBeTruthy();
    });
  });
});

// ============================================
// BCT-ART-03: No-Orb Guarantee Tests
// ============================================

describe('BCT-ART-03: No-Orb Guarantee', () => {
  const stages: EvolutionStage[] = ['baby', 'youth', 'evolved'];
  const allPoses: PetPose[] = [...CORE_POSES, ...EXTENDED_POSES];

  describe('active pet with known sprite never uses orb fallback', () => {
    ALL_PET_IDS.forEach((petId) => {
      stages.forEach((stage) => {
        it(`BCT-ART-03 – ${petId}/${stage}/idle resolves to sprite`, () => {
          const sprite = resolvePetSprite(petId, stage, 'idle');
          expect(sprite).toBeTruthy();
          expect(sprite).not.toBeNull();
        });
      });
    });
  });

  describe('getStageAwarePetSprite always returns a sprite for known pets', () => {
    ALL_PET_IDS.forEach((petId) => {
      stages.forEach((stage) => {
        allPoses.forEach((pose) => {
          it(`${petId}/${stage}/${pose} resolves to a non-null sprite`, () => {
            const sprite = getStageAwarePetSprite(petId, stage, pose);
            expect(sprite).toBeTruthy();
            expect(typeof sprite).toBe('string');
            // Should not be an orb/emoji fallback marker
            expect(sprite).not.toContain('__ORB_');
          });
        });
      });
    });
  });

  describe('hasSpriteForStage works correctly', () => {
    ALL_PET_IDS.forEach((petId) => {
      stages.forEach((stage) => {
        it(`${petId}/${stage} has sprite`, () => {
          expect(hasSpriteForStage(petId, stage)).toBe(true);
        });
      });
    });
  });
});

// ============================================
// BCT-ART-04: Stage-Aware Resolution Tests
// ============================================

describe('BCT-ART-04: Stage-Aware Resolution', () => {
  describe('PET_SPRITES_BY_STAGE structure', () => {
    it('all pets have baby, youth, evolved entries', () => {
      ALL_PET_IDS.forEach((petId) => {
        const petEntry = PET_SPRITES_BY_STAGE[petId];
        expect(petEntry).toBeDefined();
        expect(petEntry.baby).toBeDefined();
        expect(petEntry.youth).toBeDefined();
        expect(petEntry.evolved).toBeDefined();
      });
    });
  });

  describe('resolvePetSprite handles unknown inputs gracefully', () => {
    it('returns null for unknown pet ID', () => {
      const sprite = resolvePetSprite('unknown_pet', 'baby', 'idle');
      expect(sprite).toBeNull();
    });

    it('getStageAwarePetSprite handles unknown pet by falling back to munchlet', () => {
      const sprite = getStageAwarePetSprite('unknown_pet', 'baby', 'idle');
      expect(sprite).toBeTruthy();
      expect(sprite).toBe(PET_SPRITES.munchlet.idle);
    });
  });
});

// ============================================
// BCT-ART-05: Extended Poses Tests
// ============================================

describe('BCT-ART-05: Extended Poses (P6-ART-POSES)', () => {
  describe('11 poses are defined', () => {
    it('CORE_POSES has 4 poses', () => {
      expect(CORE_POSES).toHaveLength(4);
      expect(CORE_POSES).toContain('idle');
      expect(CORE_POSES).toContain('happy');
      expect(CORE_POSES).toContain('sad');
      expect(CORE_POSES).toContain('sleeping');
    });

    it('EXTENDED_POSES has 7 poses', () => {
      expect(EXTENDED_POSES).toHaveLength(7);
      expect(EXTENDED_POSES).toContain('eating');
      expect(EXTENDED_POSES).toContain('eating_loved');
      expect(EXTENDED_POSES).toContain('ecstatic');
      expect(EXTENDED_POSES).toContain('excited');
      expect(EXTENDED_POSES).toContain('hungry');
      expect(EXTENDED_POSES).toContain('satisfied');
      expect(EXTENDED_POSES).toContain('crying');
    });

    it('total poses = 11', () => {
      const allPoses: PetPose[] = [...CORE_POSES, ...EXTENDED_POSES];
      expect(allPoses).toHaveLength(11);
    });
  });

  describe('most pets have extended poses', () => {
    // Most pets should have most extended poses
    const petsWithFullPoseSet: PetId[] = ['munchlet', 'grib', 'plompo', 'fizz', 'ember', 'chomper', 'luxe'];

    petsWithFullPoseSet.forEach((petId) => {
      it(`${petId} has eating pose`, () => {
        expect(hasPetPose(petId, 'eating')).toBe(true);
      });

      it(`${petId} has crying pose`, () => {
        expect(hasPetPose(petId, 'crying')).toBe(true);
      });
    });

    // Whisp has some missing poses (known gaps)
    it('whisp has limited extended poses (known gap)', () => {
      // whisp is known to be missing eating and crying
      const whispPoses = getAvailablePoses('whisp');
      expect(whispPoses).toContain('idle');
      expect(whispPoses).toContain('happy');
      // But fallback chain should still work
      const eatSprite = resolvePetSprite('whisp', 'baby', 'eating');
      expect(eatSprite).toBeTruthy(); // Falls back to happy or idle
    });
  });
});

// ============================================
// BCT-ART-06: Legacy getPetSprite Compatibility
// ============================================

describe('BCT-ART-06: Legacy API Compatibility', () => {
  it('getPetSprite still works for all pets and poses', () => {
    ALL_PET_IDS.forEach((petId) => {
      CORE_POSES.forEach((pose) => {
        const sprite = getPetSprite(petId, pose);
        expect(sprite).toBeTruthy();
        expect(typeof sprite).toBe('string');
      });
    });
  });

  it('getPetSprite falls back to munchlet for unknown pet', () => {
    const sprite = getPetSprite('unknown', 'idle');
    expect(sprite).toBe(PET_SPRITES.munchlet.idle);
  });

  it('getPetSprite uses fallback chain for missing poses', () => {
    // whisp has no eating sprite
    const sprite = getPetSprite('whisp', 'eating');
    expect(sprite).toBeTruthy();
    // Should be either happy or idle
  });
});
