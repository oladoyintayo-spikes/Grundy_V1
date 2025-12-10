// ============================================
// GRUNDY — FTUE COPY
// Canonical text for onboarding flow
// Bible §7, GRUNDY_ONBOARDING_FLOW.md
// ============================================

// ============================================
// WORLD INTRO (LOCKED COPY)
// Do NOT modify without deliberate Bible change
// ============================================

export const WORLD_INTRO_LINES = [
  'Sometimes, when a big feeling is left behind…',
  'A tiny spirit called a Grundy wakes up.',
  'One of them just found *you*.',
] as const;

// ============================================
// PET LORE SNIPPETS
// Bible §7.4, §3
// ============================================

export interface PetLoreSnippet {
  id: string;
  name: string;
  title: string;
  shortOrigin: string;
  loves: string;
  hates: string;
  teaser: string; // For locked teaser cards
  greeting: string; // First session greeting (Bible §7.6)
  seesFood: string; // Tutorial step 4.2
  afterFeeding: string; // Tutorial step 4.3 (always positive)
  tutorialEnd: string; // Tutorial step 4.5
}

// All 8 pets with lore from Bible §7.4 / ONBOARDING_FLOW.md
export const PET_LORE_SNIPPETS: PetLoreSnippet[] = [
  // === STARTER PETS (Full lore shown) ===
  {
    id: 'munchlet',
    name: 'Munchlet',
    title: 'The Friendly One',
    shortOrigin: 'Found on a sunny windowsill, humming. Waiting for someone to share warmth with.',
    loves: 'Sweet things',
    hates: 'Being alone',
    teaser: 'Found on a sunny windowsill, humming...',
    greeting: "Hi! I'm so glad you found me!",
    seesFood: 'Ooh, is that food?!',
    afterFeeding: 'Yum! That was perfect!',
    tutorialEnd: "Let's keep exploring together!",
  },
  {
    id: 'grib',
    name: 'Grib',
    title: 'The Mischievous One',
    shortOrigin: 'Appeared in a shadow behind the cupboard, grinning. Not telling how.',
    loves: 'Chaos',
    hates: 'Boredom',
    teaser: 'Appeared in a shadow behind the cupboard, grinning...',
    greeting: 'Took you long enough. This is gonna be fun.',
    seesFood: 'Ooh, what do we have here...',
    afterFeeding: 'Not bad. Do it again.',
    tutorialEnd: "Alright, let's cause some trouble.",
  },
  {
    id: 'plompo',
    name: 'Plompo',
    title: 'The Sleepy One',
    shortOrigin: 'Discovered sleeping in a cloud that drifted too low. Went back to sleep.',
    loves: 'Naps',
    hates: 'Rushing',
    teaser: 'Discovered sleeping in a cloud that drifted too low...',
    greeting: 'Oh... hi... *yawn* ...nice to meet you...',
    seesFood: 'Mmm... that looks... *yawn* ...nice...',
    afterFeeding: 'That was... worth waking up for...',
    tutorialEnd: 'Can we... take a nap soon...?',
  },

  // === UNLOCK PETS (Teaser only shown during FTUE) ===
  {
    id: 'fizz',
    name: 'Fizz',
    title: 'The Electric One',
    shortOrigin: "Sparked into existence during a thunderstorm. Hasn't stopped vibrating.",
    loves: 'Energy',
    hates: 'Stillness',
    teaser: 'Sparked into existence during a thunderstorm...',
    greeting: 'FINALLY! Someone to play with!',
    seesFood: 'FOOD FOOD FOOD!',
    afterFeeding: 'WOOOOO!',
    tutorialEnd: "CAN'T STOP WON'T STOP!",
  },
  {
    id: 'ember',
    name: 'Ember',
    title: 'The Proud One',
    shortOrigin: 'Emerged from the last ember of a dying fire. Refuses to be ignored.',
    loves: 'Respect',
    hates: 'Being overlooked',
    teaser: 'Emerged from the last ember of a dying fire...',
    greeting: 'You may approach.',
    seesFood: 'Hmm. Is this worthy of me?',
    afterFeeding: 'Acceptable. You may continue.',
    tutorialEnd: 'This arrangement will suffice.',
  },
  {
    id: 'chomper',
    name: 'Chomper',
    title: 'The Hungry One',
    shortOrigin: 'First spotted near the kitchen, following the smell of dinner. Loves food. Hates... just loves food.',
    loves: 'Food',
    hates: 'Nothing (just loves food)',
    teaser: 'First spotted near the kitchen, following the smell of dinner...',
    greeting: 'FOOD? FOOD!',
    seesFood: 'FOOOOOOD!',
    afterFeeding: 'NOM NOM NOM!',
    tutorialEnd: 'MORE FOOD?!',
  },
  {
    id: 'whisp',
    name: 'Whisp',
    title: 'The Mysterious One',
    shortOrigin: 'Drifted in through a crack in a dream. Sometimes forgets which world.',
    loves: 'Mystery',
    hates: 'Bright lights',
    teaser: 'Drifted in through a crack in a dream...',
    greeting: '...',
    seesFood: '...?',
    afterFeeding: '✨',
    tutorialEnd: '...',
  },
  {
    id: 'luxe',
    name: 'Luxe',
    title: 'The Fancy One',
    shortOrigin: 'Arrived already posing. Certain they deserve better.',
    loves: 'Luxury',
    hates: 'Common things',
    teaser: 'Arrived already posing. Certain they deserve better.',
    greeting: 'Finally, someone with taste.',
    seesFood: 'Is this... organic?',
    afterFeeding: 'Exquisite, darling.',
    tutorialEnd: 'This will be fabulous.',
  },
];

// Helper to get lore by pet ID
export function getPetLore(petId: string): PetLoreSnippet | undefined {
  return PET_LORE_SNIPPETS.find((p) => p.id === petId);
}

// Starter pet IDs for FTUE selection
export const STARTER_PET_IDS = ['munchlet', 'grib', 'plompo'];

// Locked pet IDs (shown as teasers in FTUE)
export const LOCKED_PET_IDS = ['fizz', 'ember', 'chomper', 'whisp', 'luxe'];

// ============================================
// MODE SELECT COPY (Bible §9)
// ============================================

export interface ModeDescription {
  id: 'cozy' | 'classic';
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  features: string[];
}

export const MODE_DESCRIPTIONS: ModeDescription[] = [
  {
    id: 'cozy',
    name: 'Cozy Mode',
    emoji: '☁️',
    tagline: 'No consequences. Just fun.',
    description: 'Your Grundy is always happy to see you.',
    features: [
      'Pet never leaves',
      'No penalties',
      'Gentle reminders',
      'Pure relaxation',
    ],
  },
  {
    id: 'classic',
    name: 'Classic Mode',
    emoji: '🔥',
    tagline: 'Your care matters.',
    description: 'Neglect has consequences... but bonds run deeper.',
    features: [
      'Your care matters',
      'Neglect → sadness → runaway',
      'Evolution branches',
      'Higher stakes, more reward',
    ],
  },
];

// ============================================
// FTUE UI COPY
// ============================================

export const FTUE_COPY = {
  splash: {
    title: 'GRUNDY',
    subtitle: 'Tap to start',
  },
  ageGate: {
    title: 'Before we begin...',
    question: 'Are you 13 years or older?',
    yesButton: 'Yes, I am 13+',
    noButton: 'I am under 13',
    underAgeMessage: 'Please ask a parent or guardian for help.',
  },
  worldIntro: {
    continueButton: 'Continue',
  },
  petSelect: {
    title: 'Choose Your Grundy',
    lockedLabel: 'Locked',
    chooseButton: 'Choose',
    unlockLevel: (level: number) => `Unlocks at Level ${level}`,
  },
  modeSelect: {
    title: 'How do you want to play?',
    subtitle: '(Can change in settings)',
    chooseButton: 'Choose',
  },
  firstSession: {
    title: 'Welcome!',
    readyButton: "I'm Ready!",
    tips: [
      'Feed your Grundy to make them happy',
      'Play mini-games to earn coins',
      'Watch your pet grow and evolve!',
    ],
  },
} as const;

// Pet unlock levels (from Bible §3.2)
export const PET_UNLOCK_LEVELS: Record<string, number> = {
  fizz: 10,
  ember: 15,
  chomper: 20,
  whisp: 25,
  luxe: 30,
};
