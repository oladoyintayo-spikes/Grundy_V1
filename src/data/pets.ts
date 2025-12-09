// ============================================
// GRUNDY — PET DEFINITIONS
// DATA SOURCE: grundy_interactive_mockup.html
// ============================================

import { PetDefinition, PetCaptions } from '../types';

export interface FullPetDefinition extends PetDefinition {
  captions: PetCaptions;
}

// Pets from mockup - EXACT VALUES
export const PETS: Record<string, FullPetDefinition> = {
  munchlet: {
    id: 'munchlet',
    name: 'Munchlet',
    emoji: '🟡',
    color: '#fbbf24',
    personality: 'Cheerful',
    likes: ['sweet', 'fruit'],
    dislikes: ['spicy'],
    captions: {
      idle: ['Munchlet wiggles happily!', 'Munchlet looks at you expectantly...', 'Munchlet bounces with joy!'],
      petting: ['Munchlet loves the attention!', 'Munchlet purrs softly~', 'So cozy!'],
      positive: ['Yummy! Munchlet loved that!', 'Delicious! More please!', 'Best food ever!'],
      neutral: ['Munchlet munches thoughtfully.', 'Not bad!', 'Munchlet accepts the offering.'],
      negative: ['Munchlet makes a face...', 'Too spicy!', 'Munchlet pushes it away.'],
    },
  },
  grib: {
    id: 'grib',
    name: 'Grib',
    emoji: '🟢',
    color: '#4ade80',
    personality: 'Mischievous',
    likes: ['spicy', 'exotic'],
    dislikes: ['sweet'],
    captions: {
      idle: ['Grib smirks at you.', 'Grib does a little pose.', 'Grib is ready for action!'],
      petting: ['Grib pretends not to enjoy it...', 'Grib secretly loves this.', 'Cool cool cool.'],
      positive: ['Grib gives a thumbs up!', "Now THAT's flavor!", 'Grib approves!'],
      neutral: ['Grib shrugs.', "It'll do.", 'Acceptable.'],
      negative: ['Grib cringes!', 'Way too sweet!', 'Grib is not impressed.'],
    },
  },
  plompo: {
    id: 'plompo',
    name: 'Plompo',
    emoji: '🟣',
    color: '#a78bfa',
    personality: 'Sleepy',
    likes: ['sweet', 'gooey'],
    dislikes: ['crunchy'],
    captions: {
      idle: ['Plompo yawns softly...', 'Plompo wobbles gently.', 'Plompo is half asleep~'],
      petting: ['Plompo melts into your hand...', 'So... soft...', 'Plompo is in heaven.'],
      positive: ["Plompo's eyes light up!", 'Mmmmm...', 'Plompo wants a nap now.'],
      neutral: ['Plompo slowly chews.', "Plompo doesn't mind.", 'Okay~'],
      negative: ['Plompo shakes slowly.', 'Too crunchy...', 'Plompo is sad.'],
    },
  },
};

export const STARTER_PETS = ['munchlet', 'grib', 'plompo'];

export function getPetById(id: string): FullPetDefinition | undefined {
  return PETS[id];
}

export function getAllPets(): FullPetDefinition[] {
  return Object.values(PETS);
}
