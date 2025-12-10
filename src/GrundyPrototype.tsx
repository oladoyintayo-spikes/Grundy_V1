import React, { useState, useEffect, useCallback } from 'react';

// ============================================
// TYPES
// ============================================
type MoodState = 'happy' | 'neutral' | 'sad' | 'ecstatic';
type EvolutionStage = 'baby' | 'youth' | 'evolved';
type ReactionType = 'neutral' | 'positive' | 'negative' | 'ecstatic';
type FoodCategory = 'basic' | 'tasty' | 'rare' | 'premium';

interface PetState {
  id: string;
  name: string;
  level: number;
  xp: number;
  bond: number;
  mood: MoodState;
  hunger: number;
  evolutionStage: EvolutionStage;
}

interface Food {
  id: string;
  name: string;
  emoji: string;
  category: FoodCategory;
  xp: number;
  bond: number;
  cost: number;
  favoriteFor: string[];
  hatedBy: string[];
}

// ============================================
// DATA
// ============================================
const PETS: Record<string, { name: string; emoji: string; color: string }> = {
  sprout: { name: 'Sprout', emoji: '🌱', color: '#4ade80' },
  ember: { name: 'Ember', emoji: '🔥', color: '#fb923c' },
  ripple: { name: 'Ripple', emoji: '💧', color: '#22d3ee' },
};

const FOODS: Food[] = [
  { id: 'apple', name: 'Apple', emoji: '🍎', category: 'basic', xp: 5, bond: 0.5, cost: 10, favoriteFor: [], hatedBy: [] },
  { id: 'biscuit', name: 'Biscuit', emoji: '🍪', category: 'basic', xp: 5, bond: 0.5, cost: 10, favoriteFor: [], hatedBy: [] },
  { id: 'cupcake', name: 'Cupcake', emoji: '🧁', category: 'tasty', xp: 12, bond: 1.2, cost: 25, favoriteFor: ['sprout'], hatedBy: [] },
  { id: 'jelly_pop', name: 'Jelly Pop', emoji: '🍭', category: 'tasty', xp: 10, bond: 1.0, cost: 20, favoriteFor: ['ember'], hatedBy: [] },
  { id: 'honey', name: 'Honey Muffin', emoji: '🍯', category: 'tasty', xp: 11, bond: 1.1, cost: 22, favoriteFor: ['sprout', 'ripple'], hatedBy: [] },
  { id: 'snowflake', name: 'Snowflake', emoji: '❄️', category: 'rare', xp: 20, bond: 2.0, cost: 50, favoriteFor: ['sprout'], hatedBy: ['ember'] },
  { id: 'sour', name: 'Sour Berry', emoji: '🫐', category: 'basic', xp: 5, bond: 0.3, cost: 8, favoriteFor: [], hatedBy: ['sprout'] },
  { id: 'chili', name: 'Chili', emoji: '🌶️', category: 'tasty', xp: 10, bond: 0.8, cost: 20, favoriteFor: ['ember'], hatedBy: ['sprout', 'ripple'] },
];

const XP_TABLE = Array.from({ length: 52 }, (_, i) => Math.round(20 + i * i * 1.4));

// ============================================
// GAME LOGIC
// ============================================
function calculateReaction(petId: string, food: Food): ReactionType {
  if (food.favoriteFor.includes(petId)) return 'ecstatic';
  if (food.hatedBy.includes(petId)) return 'negative';
  if (food.category === 'rare' || food.category === 'premium') return 'positive';
  return 'neutral';
}

function getXPModifier(mood: MoodState, reaction: ReactionType): number {
  let mod = 1;
  if (mood === 'happy') mod *= 1.1;
  if (mood === 'sad') mod *= 0.8;
  if (mood === 'ecstatic') mod *= 1.2;
  if (reaction === 'ecstatic') mod *= 1.5;
  if (reaction === 'positive') mod *= 1.2;
  if (reaction === 'negative') mod *= 0.5;
  return mod;
}

function getCoinReward(reaction: ReactionType): number {
  const rewards = { ecstatic: 15, positive: 10, neutral: 5, negative: 3 };
  return rewards[reaction];
}

function getMoodAfterReaction(current: MoodState, reaction: ReactionType): MoodState {
  const moodOrder: MoodState[] = ['sad', 'neutral', 'happy', 'ecstatic'];
  const idx = moodOrder.indexOf(current);
  if (reaction === 'ecstatic' && idx < 3) return moodOrder[idx + 1];
  if (reaction === 'negative' && idx > 0) return moodOrder[idx - 1];
  return current;
}

// ============================================
// COMPONENTS
// ============================================

// Progress Bar Component
const ProgressBar = ({ value, max, color, label, showText = true }: { 
  value: number; max: number; color: string; label: string; showText?: boolean 
}) => (
  <div className="w-full">
    {showText && (
      <div className="flex justify-between text-xs mb-1 text-gray-400">
        <span>{label}</span>
        <span>{Math.round(value)}/{max}</span>
      </div>
    )}
    <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
      <div 
        className="h-full transition-all duration-500 rounded-full"
        style={{ width: `${Math.min(100, (value / max) * 100)}%`, backgroundColor: color }}
      />
    </div>
  </div>
);

// Food Item Component
const FoodItem = ({ food, count, onFeed, disabled }: { 
  food: Food; count: number; onFeed: () => void; disabled: boolean 
}) => (
  <button
    onClick={onFeed}
    disabled={disabled || count <= 0}
    className={`
      relative p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center min-w-[70px]
      ${count > 0 && !disabled
        ? 'border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20 hover:scale-105 cursor-pointer' 
        : 'border-gray-700 bg-gray-800/50 opacity-50 cursor-not-allowed'}
    `}
  >
    <span className="text-2xl">{food.emoji}</span>
    <span className="text-[10px] text-gray-400 mt-1">{food.name}</span>
    <span className={`absolute -top-2 -right-2 text-xs px-2 py-0.5 rounded-full font-bold
      ${count > 0 ? 'bg-amber-500 text-black' : 'bg-gray-600 text-gray-300'}`}>
      {count}
    </span>
  </button>
);

// Reaction Display Component
const ReactionDisplay = ({ reaction, message }: { reaction: ReactionType | null; message: string }) => {
  if (!reaction) return null;
  
  const config = {
    ecstatic: { emoji: '🤩', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    positive: { emoji: '😋', color: 'text-green-400', bg: 'bg-green-500/20' },
    neutral: { emoji: '😊', color: 'text-blue-400', bg: 'bg-blue-500/20' },
    negative: { emoji: '😖', color: 'text-red-400', bg: 'bg-red-500/20' },
  };
  
  const c = config[reaction];
  
  return (
    <div className={`${c.bg} ${c.color} px-4 py-2 rounded-xl text-center animate-bounce`}>
      <span className="text-2xl mr-2">{c.emoji}</span>
      <span className="font-medium">{message}</span>
    </div>
  );
};

// Shop Modal
const ShopModal = ({ isOpen, onClose, coins, onBuy, inventory }: {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  onBuy: (foodId: string) => void;
  inventory: Record<string, number>;
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">🏪 Food Shop</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        <div className="flex items-center gap-2 mb-4 p-2 bg-yellow-500/20 rounded-lg">
          <span className="text-xl">🪙</span>
          <span className="text-yellow-400 font-bold">{coins} coins</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {FOODS.filter(f => f.cost > 0).map(food => (
            <button
              key={food.id}
              onClick={() => onBuy(food.id)}
              disabled={coins < food.cost}
              className={`p-3 rounded-xl border transition-all text-left
                ${coins >= food.cost 
                  ? 'border-green-500/50 bg-green-500/10 hover:bg-green-500/20' 
                  : 'border-gray-700 bg-gray-900 opacity-50 cursor-not-allowed'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{food.emoji}</span>
                <span className="text-sm text-white">{food.name}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-yellow-400">🪙 {food.cost}</span>
                <span className="text-gray-400">Own: {inventory[food.id] || 0}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Level Up Modal
const LevelUpModal = ({ level, onClose }: { level: number; onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
    <div className="bg-gradient-to-b from-purple-600 to-purple-900 rounded-2xl p-8 text-center animate-bounce">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="text-3xl font-bold text-white mb-2">LEVEL UP!</h2>
      <div className="text-5xl font-bold text-yellow-400 mb-4">{level}</div>
      <p className="text-purple-200 mb-4">+20 coins bonus!</p>
      <button 
        onClick={onClose}
        className="px-6 py-2 bg-white text-purple-600 rounded-full font-bold hover:bg-yellow-400 transition-colors"
      >
        Awesome!
      </button>
    </div>
  </div>
);

// ============================================
// MAIN APP
// ============================================
export default function GrundyPrototype() {
  // Game State
  const [pet, setPet] = useState<PetState>({
    id: 'sprout',
    name: 'Sprout',
    level: 1,
    xp: 0,
    bond: 0,
    mood: 'neutral',
    hunger: 50,
    evolutionStage: 'baby',
  });
  
  const [coins, setCoins] = useState(100);
  const [gems, setGems] = useState(10);
  const [inventory, setInventory] = useState<Record<string, number>>({
    apple: 5,
    biscuit: 5,
    cupcake: 2,
  });
  
  // UI State
  const [lastReaction, setLastReaction] = useState<ReactionType | null>(null);
  const [reactionMessage, setReactionMessage] = useState('');
  const [showShop, setShowShop] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [isFeeding, setIsFeeding] = useState(false);
  const [totalFeeds, setTotalFeeds] = useState(0);
  
  // Pet display
  const petInfo = PETS[pet.id];
  
  // XP calculations
  const xpForNextLevel = XP_TABLE[pet.level + 1] || 999;
  const xpProgress = (pet.xp / xpForNextLevel) * 100;
  
  // Evolution emoji
  const evolutionEmoji = pet.evolutionStage === 'evolved' ? '🌳' : pet.evolutionStage === 'youth' ? '🌿' : '🌱';
  
  // Mood emoji
  const moodEmoji = { happy: '😊', neutral: '😐', sad: '😢', ecstatic: '🤩' }[pet.mood];
  
  // Hunger decay
  useEffect(() => {
    const interval = setInterval(() => {
      setPet(p => ({
        ...p,
        hunger: Math.max(0, p.hunger - 0.5), // Faster for demo
      }));
    }, 10000); // Every 10 seconds for demo
    return () => clearInterval(interval);
  }, []);
  
  // Feed function
  const handleFeed = useCallback((foodId: string) => {
    if (isFeeding) return;
    
    const food = FOODS.find(f => f.id === foodId);
    if (!food || (inventory[foodId] || 0) <= 0) return;
    
    setIsFeeding(true);
    
    // Calculate reaction
    const reaction = calculateReaction(pet.id, food);
    const xpMod = getXPModifier(pet.mood, reaction);
    const xpGained = Math.round(food.xp * xpMod);
    const coinsGained = getCoinReward(reaction);
    const bondGained = reaction === 'negative' ? -food.bond * 0.5 : food.bond * (reaction === 'ecstatic' ? 1.5 : 1);
    const hungerGain = { ecstatic: 20, positive: 15, neutral: 10, negative: 5 }[reaction];
    
    // Update inventory
    setInventory(inv => ({
      ...inv,
      [foodId]: (inv[foodId] || 0) - 1,
    }));
    
    // Update pet
    const newXP = pet.xp + xpGained;
    const leveledUp = newXP >= xpForNextLevel && pet.level < 50;
    
    setPet(p => {
      const newLevel = leveledUp ? p.level + 1 : p.level;
      const newStage = newLevel >= 25 ? 'evolved' : newLevel >= 10 ? 'youth' : 'baby';
      
      return {
        ...p,
        xp: leveledUp ? newXP - xpForNextLevel : newXP,
        level: newLevel,
        bond: Math.min(100, Math.max(0, p.bond + bondGained)),
        hunger: Math.min(100, p.hunger + hungerGain),
        mood: getMoodAfterReaction(p.mood, reaction),
        evolutionStage: newStage as EvolutionStage,
      };
    });
    
    // Update coins
    let totalCoins = coinsGained;
    if (leveledUp) totalCoins += 20;
    setCoins(c => c + totalCoins);
    
    // Show reaction
    setLastReaction(reaction);
    setReactionMessage(
      reaction === 'ecstatic' ? `${pet.name} LOVES it! +${xpGained} XP` :
      reaction === 'positive' ? `Yummy! +${xpGained} XP` :
      reaction === 'negative' ? `Ew... +${xpGained} XP` :
      `Nom nom! +${xpGained} XP`
    );
    
    setTotalFeeds(t => t + 1);
    
    // Show level up modal
    if (leveledUp) {
      setTimeout(() => setShowLevelUp(true), 500);
    }
    
    // Clear reaction after delay
    setTimeout(() => {
      setLastReaction(null);
      setIsFeeding(false);
    }, 1500);
    
  }, [pet, inventory, isFeeding, xpForNextLevel]);
  
  // Buy food
  const handleBuy = useCallback((foodId: string) => {
    const food = FOODS.find(f => f.id === foodId);
    if (!food || coins < food.cost) return;
    
    setCoins(c => c - food.cost);
    setInventory(inv => ({
      ...inv,
      [foodId]: (inv[foodId] || 0) + 1,
    }));
  }, [coins]);
  
  // Change pet
  const changePet = (petId: string) => {
    setPet(p => ({
      ...p,
      id: petId,
      name: PETS[petId].name,
    }));
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white p-4">
      <div className="max-w-md mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1 rounded-full">
              <span>🪙</span>
              <span className="text-yellow-400 font-bold">{coins}</span>
            </div>
            <div className="flex items-center gap-1 bg-purple-500/20 px-3 py-1 rounded-full">
              <span>💎</span>
              <span className="text-purple-400 font-bold">{gems}</span>
            </div>
          </div>
          <button 
            onClick={() => setShowShop(true)}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-full font-bold text-sm transition-colors"
          >
            🏪 Shop
          </button>
        </div>
        
        {/* Pet Selection */}
        <div className="flex justify-center gap-2 mb-4">
          {Object.entries(PETS).map(([id, p]) => (
            <button
              key={id}
              onClick={() => changePet(id)}
              className={`px-3 py-1 rounded-full text-sm transition-all
                ${pet.id === id 
                  ? 'bg-white text-gray-900 font-bold' 
                  : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              {p.emoji} {p.name}
            </button>
          ))}
        </div>
        
        {/* Pet Display */}
        <div 
          className="relative rounded-3xl p-6 mb-4 text-center"
          style={{ 
            background: `linear-gradient(135deg, ${petInfo.color}22, ${petInfo.color}11)`,
            border: `2px solid ${petInfo.color}44`
          }}
        >
          {/* Level Badge */}
          <div className="absolute top-3 left-3 bg-black/50 px-3 py-1 rounded-full text-sm">
            {evolutionEmoji} Lv.{pet.level}
          </div>
          
          {/* Mood Badge */}
          <div className="absolute top-3 right-3 bg-black/50 px-3 py-1 rounded-full text-sm">
            {moodEmoji} {pet.mood}
          </div>
          
          {/* Pet Emoji */}
          <div 
            className={`text-8xl my-6 transition-transform duration-300 ${isFeeding ? 'scale-110' : ''}`}
            style={{ filter: pet.hunger < 20 ? 'grayscale(50%)' : 'none' }}
          >
            {petInfo.emoji}
          </div>
          
          {/* Pet Name */}
          <h2 className="text-2xl font-bold mb-4">{pet.name}</h2>
          
          {/* Reaction Display */}
          <div className="h-12 mb-4">
            <ReactionDisplay reaction={lastReaction} message={reactionMessage} />
          </div>
          
          {/* Stats */}
          <div className="space-y-3">
            <ProgressBar value={pet.xp} max={xpForNextLevel} color="#a855f7" label="XP" />
            <ProgressBar value={pet.hunger} max={100} color="#fb923c" label="Hunger" />
            <ProgressBar value={pet.bond} max={100} color="#ec4899" label="Bond" />
          </div>
        </div>
        
        {/* Food Bag */}
        <div className="bg-gray-800/50 rounded-2xl p-4 mb-4">
          <h3 className="text-sm text-gray-400 mb-3 flex items-center gap-2">
            <span>🎒</span> Food Bag
            <span className="ml-auto text-xs">Tap to feed!</span>
          </h3>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {FOODS.map(food => (
              <FoodItem
                key={food.id}
                food={food}
                count={inventory[food.id] || 0}
                onFeed={() => handleFeed(food.id)}
                disabled={isFeeding}
              />
            ))}
          </div>
        </div>
        
        {/* Stats Footer */}
        <div className="text-center text-gray-500 text-sm">
          Total feeds: {totalFeeds} | Session started: {new Date().toLocaleTimeString()}
        </div>
        
        {/* Hint */}
        {pet.hunger < 30 && (
          <div className="mt-4 text-center text-orange-400 text-sm animate-pulse">
            ⚠️ {pet.name} is getting hungry! Feed them soon!
          </div>
        )}
        
      </div>
      
      {/* Modals */}
      <ShopModal 
        isOpen={showShop} 
        onClose={() => setShowShop(false)} 
        coins={coins}
        onBuy={handleBuy}
        inventory={inventory}
      />
      
      {showLevelUp && (
        <LevelUpModal level={pet.level} onClose={() => setShowLevelUp(false)} />
      )}
    </div>
  );
}
