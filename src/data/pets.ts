// ============================================
// GRUNDY — PET DEFINITIONS
// DATA SOURCE: docs/GRUNDY_MASTER_BIBLE.md §3
// ============================================

import { PetDefinition, PetCaptions, PetAbility, UnlockRequirement } from '../types';

export interface FullPetDefinition extends PetDefinition {
  captions: PetCaptions;
  ability: PetAbility;
  unlockRequirement: UnlockRequirement;
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
    ability: {
      id: 'comfort_food',
      name: 'Comfort Food',
      description: '+10% bond from feeding',
      effect: { type: 'bond_bonus', value: 0.10 },
    },
    unlockRequirement: { type: 'free' },
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
    ability: {
      id: 'chill_vibes',
      name: 'Chill Vibes',
      description: '-20% mood penalty from neglect',
      effect: { type: 'mood_penalty_reduction', value: 0.20 },
    },
    unlockRequirement: { type: 'free' },
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
    ability: {
      id: 'slow_metabolism',
      name: 'Slow Metabolism',
      description: '-20% hunger/energy decay rate',
      effect: { type: 'decay_reduction', value: 0.20 },
    },
    unlockRequirement: { type: 'free' },
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
    ability: {
      id: 'hyperactive',
      name: 'Hyperactive',
      description: '+25% minigame score bonus',
      effect: { type: 'minigame_bonus', value: 0.25 },
    },
    unlockRequirement: { type: 'bond_level', value: 25, gemSkipCost: 50 },
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
    ability: {
      id: 'spicy_lover',
      name: 'Spicy Lover',
      description: '2× coins from spicy foods',
      effect: { type: 'spicy_coin_bonus', value: 2.0 },
    },
    unlockRequirement: { type: 'bond_level', value: 50, gemSkipCost: 75 },
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
    ability: {
      id: 'iron_stomach',
      name: 'Iron Stomach',
      description: 'No food dislikes (all foods neutral or better)',
      effect: { type: 'no_dislikes', value: 1.0 },
    },
    unlockRequirement: { type: 'minigames_completed', value: 10, gemSkipCost: 100 },
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
    ability: {
      id: 'lucky_nibbles',
      name: 'Lucky Nibbles',
      description: '+50% chance of rare XP drops',
      effect: { type: 'rare_xp_chance', value: 0.50 },
    },
    unlockRequirement: { type: 'bond_level', value: 75, gemSkipCost: 125 },
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
    ability: {
      id: 'golden_touch',
      name: 'Golden Touch',
      description: '+100% gem drops from all sources',
      effect: { type: 'gem_multiplier', value: 2.0 },
    },
    unlockRequirement: { type: 'premium', gemSkipCost: 150 },
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

export function getPetAbility(petId: string): PetAbility | undefined {
  return PETS[petId]?.ability;
}

export function getPetUnlockRequirement(petId: string): UnlockRequirement | undefined {
  return PETS[petId]?.unlockRequirement;
}
