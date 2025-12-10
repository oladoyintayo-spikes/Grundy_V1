// ============================================
// GRUNDY — PET DEFINITIONS
// DATA SOURCE: docs/GRUNDY_MASTER_BIBLE.md §3
// ============================================

import { PetDefinition, PetCaptions } from '../types';

export interface FullPetDefinition extends PetDefinition {
  captions: PetCaptions;
}

// All 8 pets per Bible §3.1-3.2
export const PETS: Record<string, FullPetDefinition> = {
  // === STARTER PETS ===
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

  // === UNLOCK PETS ===
  fizz: {
    id: 'fizz',
    name: 'Fizz',
    emoji: '🔵',
    color: '#3b82f6',
    personality: 'Hyper',
    likes: ['sour', 'fizzy', 'cold'],
    dislikes: ['bland', 'dry'],
    captions: {
      idle: ['Fizz bounces off the walls!', 'Fizz vibrates with energy!', "Can't. Stop. Moving!"],
      petting: ['Fizz zaps with excitement!', 'ZING!', 'Fizz sparks happily!'],
      positive: ['WOOOOO!', 'Fizz explodes with joy!', 'MORE MORE MORE!'],
      neutral: ['Fizz buzzes.', 'Okay okay okay!', 'Fizz keeps moving.'],
      negative: ['Fizz deflates...', 'Too boring!', 'Fizz fizzles out...'],
    },
  },
  ember: {
    id: 'ember',
    name: 'Ember',
    emoji: '🟠',
    color: '#f97316',
    personality: 'Fierce',
    likes: ['spicy', 'hot', 'smoky'],
    dislikes: ['sweet', 'cold'],
    captions: {
      idle: ['Ember smolders intensely.', 'Ember strikes a pose.', 'Ember waits... dramatically.'],
      petting: ['Ember allows this.', 'Ember glows warmer.', 'Acceptable tribute.'],
      positive: ['Ember ROARS approval!', "NOW we're cooking!", 'FIRE! 🔥'],
      neutral: ['Ember considers it.', 'Hmm.', 'Ember nods.'],
      negative: ['Ember scoffs.', 'Pathetic.', 'Ember turns away in disgust.'],
    },
  },
  chomper: {
    id: 'chomper',
    name: 'Chomper',
    emoji: '🔴',
    color: '#ef4444',
    personality: 'Hungry',
    likes: ['everything'],
    dislikes: [], // Chomper has NO dislikes per Bible §3.7
    captions: {
      idle: ["Chomper's tummy rumbles...", 'Food? FOOD?!', 'Chomper drools...'],
      petting: ['Chomper looks for snacks.', 'Pet = food soon?', 'Chomper is patient... for now.'],
      positive: ['CHOMP CHOMP CHOMP!', 'Chomper inhales it!', 'NOM NOM NOM!'],
      neutral: ['Chomper eats it anyway.', 'Food is food!', 'More?'],
      negative: ['Chomper eats it anyway.', 'Still food!', 'More?'], // Never truly negative
    },
  },
  whisp: {
    id: 'whisp',
    name: 'Whisp',
    emoji: '⚪',
    color: '#e2e8f0',
    personality: 'Mysterious',
    likes: ['dream', 'magical', 'rare'],
    dislikes: ['common', 'basic'],
    captions: {
      idle: ['Whisp floats silently...', 'Whisp phases in and out...', '...'],
      petting: ['Whisp glows faintly.', '...', 'Whisp drifts closer.'],
      positive: ['Whisp glows brighter!', '✨', 'Whisp hums softly...'],
      neutral: ['Whisp observes.', '...', 'Whisp drifts.'],
      negative: ['Whisp fades slightly.', '...', 'Whisp looks through you.'],
    },
  },
  luxe: {
    id: 'luxe',
    name: 'Luxe',
    emoji: '✨',
    color: '#d4af37', // Gold color (gradient gold→purple in full implementation)
    personality: 'Fabulous',
    likes: ['premium', 'legendary', 'crafted'],
    dislikes: ['common', 'basic'],
    captions: {
      idle: ['Luxe admires their reflection.', 'Luxe poses for no one.', 'Simply fabulous.'],
      petting: ['Luxe permits this.', 'Luxe sparkles approvingly.', 'You may continue.'],
      positive: ['Luxe approves, darling!', 'Exquisite!', 'Luxe blows a kiss 💋'],
      neutral: ['Luxe considers it.', 'Hmm.', 'Luxe shrugs elegantly.'],
      negative: ['Luxe is NOT amused.', 'How pedestrian.', 'Luxe looks away.'],
    },
  },
};

export const STARTER_PETS = ['munchlet', 'grib', 'plompo'];
export const UNLOCK_PETS = ['fizz', 'ember', 'chomper', 'whisp', 'luxe'];

export function getPetById(id: string): FullPetDefinition | undefined {
  return PETS[id];
}

export function getAllPets(): FullPetDefinition[] {
  return Object.values(PETS);
}
