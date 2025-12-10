// ============================================
// GRUNDY — ART CONFIG TESTS
// P5-ART-DOC: Tests for pet sprites and room scenes
// ============================================

import { describe, it, expect } from 'vitest';
import {
  getPetSprite,
  PET_SPRITES,
  ALL_PET_IDS,
  hasPetPose,
  getAvailablePoses,
  PetPose,
} from '../art/petSprites';
import {
  getRoomSceneSpec,
  ACCENT_ELEMENT_DISPLAY,
  getAccentDisplay,
  getRoomsWithAccent,
} from '../art/roomScenes';
import {
  getDefaultPoseForState,
  getPositivePose,
  getNeutralPose,
  getNegativePose,
  getPoseForReaction,
  getHeaderPose,
} from '../game/petVisuals';
import type { RoomId, TimeOfDay, MoodState, ReactionType } from '../types';

// ============================================
// PET SPRITE CONFIG TESTS
// ============================================

describe('pet sprite config', () => {
  describe('PET_SPRITES registry', () => {
    it('has sprite sets for all 8 pets', () => {
      expect(ALL_PET_IDS).toHaveLength(8);
      expect(ALL_PET_IDS).toContain('munchlet');
      expect(ALL_PET_IDS).toContain('grib');
      expect(ALL_PET_IDS).toContain('plompo');
      expect(ALL_PET_IDS).toContain('fizz');
      expect(ALL_PET_IDS).toContain('ember');
      expect(ALL_PET_IDS).toContain('chomper');
      expect(ALL_PET_IDS).toContain('whisp');
      expect(ALL_PET_IDS).toContain('luxe');
    });

    it('has idle and happy sprites for all pets', () => {
      for (const id of ALL_PET_IDS) {
        expect(PET_SPRITES[id]).toBeTruthy();
        expect(PET_SPRITES[id].idle).toBeTruthy();
        expect(PET_SPRITES[id].happy).toBeTruthy();
        expect(typeof PET_SPRITES[id].idle).toBe('string');
        expect(typeof PET_SPRITES[id].happy).toBe('string');
      }
    });

    it('has sad and sleeping sprites for all pets', () => {
      for (const id of ALL_PET_IDS) {
        expect(PET_SPRITES[id].sad).toBeTruthy();
        expect(PET_SPRITES[id].sleeping).toBeTruthy();
      }
    });
  });

  describe('getPetSprite', () => {
    it('returns idle sprite for idle pose', () => {
      const sprite = getPetSprite('munchlet', 'idle');
      expect(typeof sprite).toBe('string');
      expect(sprite).toBe(PET_SPRITES.munchlet.idle);
    });

    it('returns happy sprite for happy pose', () => {
      const sprite = getPetSprite('grib', 'happy');
      expect(sprite).toBe(PET_SPRITES.grib.happy);
    });

    it('returns sad sprite for sad pose', () => {
      const sprite = getPetSprite('plompo', 'sad');
      expect(sprite).toBe(PET_SPRITES.plompo.sad);
    });

    it('returns sleeping sprite for sleeping pose', () => {
      const sprite = getPetSprite('fizz', 'sleeping');
      expect(sprite).toBe(PET_SPRITES.fizz.sleeping);
    });

    it('falls back to munchlet idle for unknown pet IDs', () => {
      const sprite = getPetSprite('unknown_pet', 'idle');
      expect(sprite).toBe(PET_SPRITES.munchlet.idle);
    });

    it('falls back gracefully for all pet IDs', () => {
      for (const id of ALL_PET_IDS) {
        const sprite = getPetSprite(id, 'sad');
        expect(typeof sprite).toBe('string');
        expect(sprite.length).toBeGreaterThan(0);
      }
    });
  });

  describe('hasPetPose', () => {
    it('returns true for idle pose on all pets', () => {
      for (const id of ALL_PET_IDS) {
        expect(hasPetPose(id, 'idle')).toBe(true);
      }
    });

    it('returns true for happy pose on all pets', () => {
      for (const id of ALL_PET_IDS) {
        expect(hasPetPose(id, 'happy')).toBe(true);
      }
    });

    it('returns false for unknown pet', () => {
      expect(hasPetPose('unknown', 'idle')).toBe(false);
    });
  });

  describe('getAvailablePoses', () => {
    it('returns at least idle and happy for all pets', () => {
      for (const id of ALL_PET_IDS) {
        const poses = getAvailablePoses(id);
        expect(poses).toContain('idle');
        expect(poses).toContain('happy');
      }
    });

    it('returns empty array for unknown pet', () => {
      expect(getAvailablePoses('unknown')).toEqual([]);
    });
  });
});

// ============================================
// ROOM SCENE CONFIG TESTS
// ============================================

describe('room scene config', () => {
  const rooms: RoomId[] = ['living_room', 'kitchen', 'bedroom', 'playroom', 'yard'];
  const times: TimeOfDay[] = ['morning', 'day', 'evening', 'night'];

  describe('getRoomSceneSpec', () => {
    it('returns different specs for different rooms', () => {
      const living = getRoomSceneSpec('living_room', 'day');
      const playroom = getRoomSceneSpec('playroom', 'day');
      expect(living.label).not.toBe(playroom.label);
      expect(living.foregroundClass).not.toBe(playroom.foregroundClass);
    });

    it('handles all room IDs', () => {
      for (const room of rooms) {
        const spec = getRoomSceneSpec(room, 'day');
        expect(spec.label).toBeTruthy();
        expect(spec.foregroundClass).toBeTruthy();
        expect(Array.isArray(spec.accentElements)).toBe(true);
      }
    });

    it('handles all times of day', () => {
      for (const time of times) {
        const spec = getRoomSceneSpec('living_room', time);
        expect(spec).toBeTruthy();
        expect(spec.foregroundClass).toBeTruthy();
      }
    });

    it('returns correct labels for all rooms', () => {
      expect(getRoomSceneSpec('living_room', 'day').label).toBe('Living Room');
      expect(getRoomSceneSpec('kitchen', 'day').label).toBe('Kitchen');
      expect(getRoomSceneSpec('bedroom', 'day').label).toBe('Bedroom');
      expect(getRoomSceneSpec('playroom', 'day').label).toBe('Playroom');
      expect(getRoomSceneSpec('yard', 'day').label).toBe('Yard');
    });

    it('returns accent elements for all rooms', () => {
      for (const room of rooms) {
        const spec = getRoomSceneSpec(room, 'day');
        expect(spec.accentElements.length).toBeGreaterThan(0);
      }
    });

    it('playroom has toys accent', () => {
      const spec = getRoomSceneSpec('playroom', 'day');
      expect(spec.accentElements).toContain('toys');
    });

    it('bedroom has bed and lamp accents', () => {
      const spec = getRoomSceneSpec('bedroom', 'day');
      expect(spec.accentElements).toContain('bed');
      expect(spec.accentElements).toContain('lamp');
    });

    it('yard has tree accent', () => {
      const spec = getRoomSceneSpec('yard', 'day');
      expect(spec.accentElements).toContain('tree');
    });

    it('applies night overlay for night time in some rooms', () => {
      const bedroomNight = getRoomSceneSpec('bedroom', 'night');
      const playroomNight = getRoomSceneSpec('playroom', 'night');
      // At least some rooms should have night overlay
      expect(bedroomNight.nightOverlay || playroomNight.nightOverlay).toBeTruthy();
    });
  });

  describe('ACCENT_ELEMENT_DISPLAY', () => {
    it('has display data for all defined elements', () => {
      const elements = ['plant', 'lamp', 'desk', 'bed', 'tree', 'toys', 'couch', 'rug'];
      for (const elem of elements) {
        expect(ACCENT_ELEMENT_DISPLAY[elem as keyof typeof ACCENT_ELEMENT_DISPLAY]).toBeTruthy();
        expect(ACCENT_ELEMENT_DISPLAY[elem as keyof typeof ACCENT_ELEMENT_DISPLAY].icon).toBeTruthy();
        expect(ACCENT_ELEMENT_DISPLAY[elem as keyof typeof ACCENT_ELEMENT_DISPLAY].label).toBeTruthy();
      }
    });
  });

  describe('getAccentDisplay', () => {
    it('returns icon and label for plant', () => {
      const display = getAccentDisplay('plant');
      expect(display.icon).toBe('🪴');
      expect(display.label).toBe('Plant');
    });
  });

  describe('getRoomsWithAccent', () => {
    it('returns rooms that have plant accent', () => {
      const rooms = getRoomsWithAccent('plant');
      expect(rooms.length).toBeGreaterThan(0);
      expect(rooms).toContain('living_room');
    });

    it('returns rooms that have toys accent', () => {
      const rooms = getRoomsWithAccent('toys');
      expect(rooms).toContain('playroom');
    });
  });
});

// ============================================
// PET VISUALS HELPER TESTS
// ============================================

describe('pet visuals helpers', () => {
  describe('getDefaultPoseForState', () => {
    it('returns sleeping when isSleeping is true', () => {
      const pose = getDefaultPoseForState({ mood: 'happy', hunger: 100, isSleeping: true });
      expect(pose).toBe('sleeping');
    });

    it('returns sad when very hungry (hunger < 20)', () => {
      const pose = getDefaultPoseForState({ mood: 'happy', hunger: 15 });
      expect(pose).toBe('sad');
    });

    it('returns happy when mood is ecstatic', () => {
      const pose = getDefaultPoseForState({ mood: 'ecstatic', hunger: 50 });
      expect(pose).toBe('happy');
    });

    it('returns happy when mood is happy and hunger > 50', () => {
      const pose = getDefaultPoseForState({ mood: 'happy', hunger: 60 });
      expect(pose).toBe('happy');
    });

    it('returns sad when mood is sad', () => {
      const pose = getDefaultPoseForState({ mood: 'sad', hunger: 50 });
      expect(pose).toBe('sad');
    });

    it('returns idle for neutral mood with decent hunger', () => {
      const pose = getDefaultPoseForState({ mood: 'neutral', hunger: 50 });
      expect(pose).toBe('idle');
    });
  });

  describe('simple pose helpers', () => {
    it('getPositivePose returns happy', () => {
      expect(getPositivePose()).toBe('happy');
    });

    it('getPositivePose returns sleeping when sleeping', () => {
      expect(getPositivePose(true)).toBe('sleeping');
    });

    it('getNeutralPose returns idle', () => {
      expect(getNeutralPose()).toBe('idle');
    });

    it('getNegativePose returns sad', () => {
      expect(getNegativePose()).toBe('sad');
    });
  });

  describe('getPoseForReaction', () => {
    it('returns happy for ecstatic reaction', () => {
      expect(getPoseForReaction('ecstatic')).toBe('happy');
    });

    it('returns happy for positive reaction', () => {
      expect(getPoseForReaction('positive')).toBe('happy');
    });

    it('returns sad for negative reaction', () => {
      expect(getPoseForReaction('negative')).toBe('sad');
    });

    it('returns idle for neutral reaction', () => {
      expect(getPoseForReaction('neutral')).toBe('idle');
    });
  });

  describe('getHeaderPose', () => {
    it('returns sad when very hungry', () => {
      expect(getHeaderPose('happy', 20)).toBe('sad');
    });

    it('returns happy for ecstatic mood', () => {
      expect(getHeaderPose('ecstatic', 50)).toBe('happy');
    });

    it('returns happy for happy mood', () => {
      expect(getHeaderPose('happy', 50)).toBe('happy');
    });

    it('returns idle for neutral mood', () => {
      expect(getHeaderPose('neutral', 50)).toBe('idle');
    });
  });
});
