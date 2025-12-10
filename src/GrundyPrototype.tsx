import React, { useState, useEffect, useCallback } from 'react';
import { useGameStore } from './game/store';
import { PETS, getAllPets, getPetById } from './data/pets';
import { getAllFoods, getShopFoods } from './data/foods';
import { ReactionType, FoodDefinition, FeedResult, MiniGameId, MiniGameResult } from './types';
import { getXPForLevel } from './data/config';
import { MiniGameHub } from './components/MiniGameHub';
import { MiniGameWrapper } from './components/MiniGameWrapper';
import { SnackCatch } from './components/games/SnackCatch';
import { MemoryMatch } from './components/games/MemoryMatch';
import { RhythmTap } from './components/games/RhythmTap';
import { Pips } from './components/games/Pips';
import { PoopScoop } from './components/games/PoopScoop';

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
  food: FoodDefinition; count: number; onFeed: () => void; disabled: boolean
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

  const shopFoods = getShopFoods();

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
          {shopFoods.map(food => (
            <button
              key={food.id}
              onClick={() => onBuy(food.id)}
              disabled={coins < food.coinCost}
              className={`p-3 rounded-xl border transition-all text-left
                ${coins >= food.coinCost
                  ? 'border-green-500/50 bg-green-500/10 hover:bg-green-500/20'
                  : 'border-gray-700 bg-gray-900 opacity-50 cursor-not-allowed'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{food.emoji}</span>
                <span className="text-sm text-white">{food.name}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-yellow-400">🪙 {food.coinCost}</span>
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
  // Get state and actions from Zustand store
  const pet = useGameStore((state) => state.pet);
  const currencies = useGameStore((state) => state.currencies);
  const inventory = useGameStore((state) => state.inventory);
  const stats = useGameStore((state) => state.stats);
  const feed = useGameStore((state) => state.feed);
  const buyFood = useGameStore((state) => state.buyFood);
  const tick = useGameStore((state) => state.tick);
  const selectPet = useGameStore((state) => state.selectPet);

  // UI State (local)
  const [lastReaction, setLastReaction] = useState<ReactionType | null>(null);
  const [reactionMessage, setReactionMessage] = useState('');
  const [showShop, setShowShop] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [isFeeding, setIsFeeding] = useState(false);

  // Mini-game state
  const [view, setView] = useState<'main' | 'minigame-hub' | 'minigame-play'>('main');
  const [selectedGame, setSelectedGame] = useState<MiniGameId | null>(null);

  // Get pet display data from canonical pets.ts
  const petData = getPetById(pet.id);
  const petName = petData?.name ?? pet.id;
  const petEmoji = petData?.emoji ?? '🐾';
  const petColor = petData?.color ?? '#888888';

  // Get all foods from canonical foods.ts
  const allFoods = getAllFoods();

  // Get all pets for pet selector
  const allPets = getAllPets();

  // XP calculations
  const xpForNextLevel = getXPForLevel(pet.level + 1);

  // Evolution emoji
  const evolutionEmoji = pet.evolutionStage === 'evolved' ? '🌳' : pet.evolutionStage === 'youth' ? '🌿' : '🌱';

  // Mood emoji
  const moodEmoji = { happy: '😊', neutral: '😐', sad: '😢', ecstatic: '🤩' }[pet.mood];

  // Hunger decay via store
  useEffect(() => {
    const interval = setInterval(() => {
      tick(1 / 6); // ~10 seconds = 1/6 minute, matches demo speed
    }, 10000);
    return () => clearInterval(interval);
  }, [tick]);

  // Feed function using store
  const handleFeed = useCallback((foodId: string) => {
    if (isFeeding) return;

    const foodCount = inventory[foodId] || 0;
    if (foodCount <= 0) return;

    setIsFeeding(true);

    // Use store's feed action
    const result: FeedResult | null = feed(foodId);

    if (result && result.success) {
      // Show reaction
      setLastReaction(result.reaction);
      setReactionMessage(
        result.reaction === 'ecstatic' ? `${petName} LOVES it! +${result.xpGained} XP` :
        result.reaction === 'positive' ? `Yummy! +${result.xpGained} XP` :
        result.reaction === 'negative' ? `Ew... +${result.xpGained} XP` :
        `Nom nom! +${result.xpGained} XP`
      );

      // Show level up modal
      if (result.leveledUp && result.newLevel) {
        setTimeout(() => setShowLevelUp(true), 500);
      }
    }

    // Clear reaction after delay
    setTimeout(() => {
      setLastReaction(null);
      setIsFeeding(false);
    }, 1500);

  }, [pet.id, inventory, isFeeding, feed, petName]);

  // Buy food using store
  const handleBuy = useCallback((foodId: string) => {
    buyFood(foodId, 1);
  }, [buyFood]);

  // Change pet using store
  const changePet = (petId: string) => {
    selectPet(petId);
  };

  // Mini-game handlers
  const handleOpenMiniGames = () => setView('minigame-hub');
  const handleSelectGame = (gameId: MiniGameId) => {
    setSelectedGame(gameId);
    setView('minigame-play');
  };
  const handleGameComplete = (result: MiniGameResult) => {
    setView('minigame-hub');
    setSelectedGame(null);
  };
  const handleGameQuit = () => {
    setView('minigame-hub');
    setSelectedGame(null);
  };
  const handleBackFromHub = () => {
    setView('main');
    setSelectedGame(null);
  };

  // Render mini-game hub
  if (view === 'minigame-hub') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <MiniGameHub onSelectGame={handleSelectGame} onBack={handleBackFromHub} />
      </div>
    );
  }

  // Render active mini-game
  if (view === 'minigame-play' && selectedGame) {
    const renderGame = () => {
      switch (selectedGame) {
        case 'snack_catch':
          return <SnackCatch onGameEnd={() => {}} />;
        case 'memory_match':
          return <MemoryMatch onGameEnd={() => {}} />;
        case 'rhythm_tap':
          return <RhythmTap onGameEnd={() => {}} />;
        case 'pips':
          return <Pips onGameEnd={() => {}} />;
        case 'poop_scoop':
          return <PoopScoop onGameEnd={() => {}} />;
        default:
          return (
            <div className="h-full flex items-center justify-center bg-gray-800">
              <div className="text-center text-white">
                <p className="text-4xl mb-4">🚧</p>
                <p className="text-xl">Coming Soon!</p>
                <button
                  onClick={handleGameQuit}
                  className="mt-4 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30"
                >
                  Back
                </button>
              </div>
            </div>
          );
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <MiniGameWrapper
          gameId={selectedGame}
          onComplete={handleGameComplete}
          onQuit={handleGameQuit}
        >
          {renderGame()}
        </MiniGameWrapper>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white p-4">
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1 rounded-full">
              <span>🪙</span>
              <span className="text-yellow-400 font-bold">{currencies.coins}</span>
            </div>
            <div className="flex items-center gap-1 bg-purple-500/20 px-3 py-1 rounded-full">
              <span>💎</span>
              <span className="text-purple-400 font-bold">{currencies.gems}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleOpenMiniGames}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-full font-bold text-sm transition-colors"
            >
              🎮 Games
            </button>
            <button
              onClick={() => setShowShop(true)}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-full font-bold text-sm transition-colors"
            >
              🏪 Shop
            </button>
          </div>
        </div>

        {/* Pet Selection */}
        <div className="flex justify-center gap-2 mb-4 flex-wrap">
          {allPets.map((p) => (
            <button
              key={p.id}
              onClick={() => changePet(p.id)}
              className={`px-3 py-1 rounded-full text-sm transition-all
                ${pet.id === p.id
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
            background: `linear-gradient(135deg, ${petColor}22, ${petColor}11)`,
            border: `2px solid ${petColor}44`
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
            {petEmoji}
          </div>

          {/* Pet Name */}
          <h2 className="text-2xl font-bold mb-4">{petName}</h2>

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
            {allFoods.map(food => (
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
          Total feeds: {stats.totalFeeds} | Session started: {new Date(stats.sessionStartTime).toLocaleTimeString()}
        </div>

        {/* Hint */}
        {pet.hunger < 30 && (
          <div className="mt-4 text-center text-orange-400 text-sm animate-pulse">
            ⚠️ {petName} is getting hungry! Feed them soon!
          </div>
        )}

      </div>

      {/* Modals */}
      <ShopModal
        isOpen={showShop}
        onClose={() => setShowShop(false)}
        coins={currencies.coins}
        onBuy={handleBuy}
        inventory={inventory}
      />

      {showLevelUp && (
        <LevelUpModal level={pet.level} onClose={() => setShowLevelUp(false)} />
      )}
    </div>
  );
}
