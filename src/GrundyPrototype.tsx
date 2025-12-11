import React, { useState, useEffect, useCallback } from 'react';
import { useGameStore, shouldShowFtue } from './game/store';
import { PETS, getAllPets, getPetById } from './data/pets';
import { getAllFoods, getShopFoods } from './data/foods';
import { ReactionType, FoodDefinition, FeedResult, MiniGameId, MiniGameResult, AppView } from './types';
import { getXPForLevel } from './data/config';
import { DEFAULT_VIEW } from './game/navigation';
import { AppHeader } from './components/layout/AppHeader';
import { BottomNav } from './components/layout/BottomNav';
import { DebugHud } from './components/layout/DebugHud';
import { getBackgroundClass, ENVIRONMENT_REFRESH_INTERVAL_MS } from './game/environment';
import { MiniGameHub } from './components/MiniGameHub';
import { MiniGameWrapper } from './components/MiniGameWrapper';
import { SnackCatch } from './components/games/SnackCatch';
import { MemoryMatch } from './components/games/MemoryMatch';
import { RhythmTap } from './components/games/RhythmTap';
import { Pips } from './components/games/Pips';
import { PoopScoop } from './components/games/PoopScoop';
import { FtueFlow } from './ftue/FtueFlow';
import { playPetHappy, playLevelUp, startBackgroundMusic, stopBackgroundMusic, audioManager } from './audio/audioManager';
// P5-ART-PETS + P5-ART-ROOMS imports
import { PetDisplay } from './components/pet/PetAvatar';
import { RoomScene } from './components/environment/RoomScene';
import { getDefaultPoseForState, getPoseForReaction } from './game/petVisuals';
// P6-HUD-CLEANUP: Import fullness/cooldown systems for feedback
import { isStuffed, isOnCooldown, getFullnessState, getCooldownRemaining } from './game/systems';

// ============================================
// SHARED COMPONENTS
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
// P6-HUD-CLEANUP: Added stuffed/cooldown props for Bible §4.4 feedback
const FoodItem = ({ food, count, onFeed, disabled, isFirst, stuffed, onCooldown }: {
  food: FoodDefinition;
  count: number;
  onFeed: () => void;
  disabled: boolean;
  isFirst?: boolean;
  stuffed?: boolean;
  onCooldown?: boolean;
}) => {
  // Bible §4.4: Food tray grays out when stuffed (feeding blocked entirely)
  const isBlocked = stuffed || count <= 0;
  const isReduced = onCooldown && !stuffed;

  return (
    <button
      data-testid={isFirst ? 'feed-button' : `food-item-${food.id}`}
      onClick={onFeed}
      disabled={disabled || isBlocked}
      className={`
        relative p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center min-w-[70px]
        ${stuffed
          ? 'border-red-500/30 bg-red-900/20 opacity-40 cursor-not-allowed'
          : isReduced
            ? 'border-orange-500/50 bg-orange-500/10 hover:bg-orange-500/20 cursor-pointer'
            : count > 0 && !disabled
              ? 'border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20 hover:scale-105 cursor-pointer'
              : 'border-gray-700 bg-gray-800/50 opacity-50 cursor-not-allowed'}
      `}
      aria-label={stuffed ? `${food.name} - Too full to eat` : onCooldown ? `${food.name} - Reduced value (cooldown)` : food.name}
    >
      <span className="text-2xl">{food.emoji}</span>
      <span className="text-[10px] text-gray-400 mt-1">{food.name}</span>
      {/* Cooldown indicator */}
      {onCooldown && !stuffed && (
        <span className="absolute -top-1 -left-1 text-[8px] px-1 py-0.5 rounded bg-orange-500 text-white">
          ⏱
        </span>
      )}
      {/* Stuffed indicator */}
      {stuffed && (
        <span className="absolute -top-1 -left-1 text-[8px] px-1 py-0.5 rounded bg-red-500 text-white">
          🚫
        </span>
      )}
      <span className={`absolute -top-2 -right-2 text-xs px-2 py-0.5 rounded-full font-bold
        ${count > 0 ? 'bg-amber-500 text-black' : 'bg-gray-600 text-gray-300'}`}>
        {count}
      </span>
    </button>
  );
};

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
// VIEW: HOME (Pet Care Screen)
// ============================================
interface HomeViewProps {
  onOpenShop: () => void;
}

function HomeView({ onOpenShop }: HomeViewProps) {
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
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [isFeeding, setIsFeeding] = useState(false);

  // Get pet display data from canonical pets.ts
  const petData = getPetById(pet.id);
  const petName = petData?.name ?? pet.id;
  const petColor = petData?.color ?? '#888888';

  // P5-ART-PETS: Determine pet pose based on state and reaction
  const currentPose = lastReaction
    ? getPoseForReaction(lastReaction)
    : getDefaultPoseForState({ mood: pet.mood, hunger: pet.hunger });

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
      // Play pet happy sound (P5-AUDIO-HOOKS)
      playPetHappy();

      // Show reaction
      setLastReaction(result.reaction);
      setReactionMessage(
        result.reaction === 'ecstatic' ? `${petName} LOVES it! +${result.xpGained} XP` :
        result.reaction === 'positive' ? `Yummy! +${result.xpGained} XP` :
        result.reaction === 'negative' ? `Ew... +${result.xpGained} XP` :
        `Nom nom! +${result.xpGained} XP`
      );

      // Show level up modal and play level up sound
      if (result.leveledUp && result.newLevel) {
        playLevelUp();
        setTimeout(() => setShowLevelUp(true), 500);
      }
    }

    // Clear reaction after delay
    setTimeout(() => {
      setLastReaction(null);
      setIsFeeding(false);
    }, 1500);

  }, [pet.id, inventory, isFeeding, feed, petName]);

  // Change pet using store
  const changePet = (petId: string) => {
    selectPet(petId);
  };

  return (
    <div className="h-full overflow-y-auto text-white p-4">
      <div className="max-w-md mx-auto">

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

        {/* Pet Display (P5-ART-PETS) */}
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

          {/* Mood Badge - Debug only per BCT-HUD-001: Mood hidden in production */}
          {import.meta.env.DEV && (
            <div className="absolute top-3 right-3 bg-black/50 px-3 py-1 rounded-full text-sm">
              {moodEmoji} {pet.mood}
            </div>
          )}

          {/* Pet Sprite (P5-ART-PETS) */}
          <div
            className={`my-6 transition-transform duration-300 ${isFeeding ? 'scale-110' : ''}`}
            style={{ filter: pet.hunger < 20 ? 'grayscale(50%)' : 'none' }}
          >
            <PetDisplay petId={pet.id} pose={currentPose} breathing={!isFeeding} />
          </div>

          {/* Pet Name */}
          <h2 className="text-2xl font-bold mb-4">{petName}</h2>

          {/* Reaction Display */}
          <div className="h-12 mb-4">
            <ReactionDisplay reaction={lastReaction} message={reactionMessage} />
          </div>

          {/* Stats - Bond only in production per BCT-HUD-001 */}
          <div className="space-y-3">
            {/* XP and Hunger: Debug only per Bible §4.4 */}
            {import.meta.env.DEV && (
              <>
                <ProgressBar value={pet.xp} max={xpForNextLevel} color="#a855f7" label="XP" />
                <ProgressBar value={pet.hunger} max={100} color="#fb923c" label="Hunger" />
              </>
            )}
            {/* Bond: Always visible per Bible §4.4 "Bond is visible" */}
            <ProgressBar value={pet.bond} max={100} color="#ec4899" label="Bond" />
          </div>
        </div>

        {/* Food Bag - P6-HUD-CLEANUP: Fullness/cooldown feedback */}
        {(() => {
          const petStuffed = isStuffed(pet.hunger);
          const petOnCooldown = isOnCooldown(stats.lastFeedCooldownStart);

          return (
            <div className="bg-gray-800/50 rounded-2xl p-4 mb-4" data-testid="food-bag">
              <h3 className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                <span>🎒</span> Food Bag
                {/* Bible §4.4: Contextual UI cues for fullness state */}
                {petStuffed ? (
                  <span className="ml-auto text-xs text-red-400">Too full to eat! 🚫</span>
                ) : petOnCooldown ? (
                  <span className="ml-auto text-xs text-orange-400">Cooldown active ⏱</span>
                ) : (
                  <span className="ml-auto text-xs">Tap to feed!</span>
                )}
              </h3>

              <div className="flex gap-2 overflow-x-auto pb-2">
                {allFoods.map((food, index) => (
                  <FoodItem
                    key={food.id}
                    food={food}
                    count={inventory[food.id] || 0}
                    onFeed={() => handleFeed(food.id)}
                    disabled={isFeeding}
                    isFirst={index === 0}
                    stuffed={petStuffed}
                    onCooldown={petOnCooldown}
                  />
                ))}
              </div>
            </div>
          );
        })()}

        {/* Shop Button */}
        <div className="text-center mb-4">
          <button
            onClick={onOpenShop}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-full font-bold text-sm transition-colors"
          >
            🏪 Open Shop
          </button>
        </div>

        {/* Stats Footer - Debug only per Bible §4.4 */}
        {import.meta.env.DEV && (
          <div className="text-center text-gray-500 text-sm">
            Total feeds: {stats.totalFeeds} | Session started: {new Date(stats.sessionStartTime).toLocaleTimeString()}
          </div>
        )}

        {/* Hint */}
        {pet.hunger < 30 && (
          <div className="mt-4 text-center text-orange-400 text-sm animate-pulse">
            {petName} is getting hungry! Feed them soon!
          </div>
        )}

      </div>

      {/* Level Up Modal */}
      {showLevelUp && (
        <LevelUpModal level={pet.level} onClose={() => setShowLevelUp(false)} />
      )}
    </div>
  );
}

// ============================================
// VIEW: GAMES (Mini-Game Hub)
// ============================================
function GamesView() {
  const [selectedGame, setSelectedGame] = useState<MiniGameId | null>(null);

  const handleSelectGame = (gameId: MiniGameId) => {
    setSelectedGame(gameId);
  };

  const handleGameComplete = (result: MiniGameResult) => {
    setSelectedGame(null);
  };

  const handleGameQuit = () => {
    setSelectedGame(null);
  };

  const handleBackToHub = () => {
    setSelectedGame(null);
  };

  // If a game is selected, show the game
  if (selectedGame) {
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
      <div className="h-full">
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

  // Show the hub
  return (
    <div className="h-full">
      <MiniGameHub onSelectGame={handleSelectGame} onBack={handleBackToHub} />
    </div>
  );
}

// ============================================
// VIEW: SETTINGS
// ============================================
function SettingsView() {
  const settings = useGameStore((state) => state.settings);
  const setSoundEnabled = useGameStore((state) => state.setSoundEnabled);
  const setMusicEnabled = useGameStore((state) => state.setMusicEnabled);
  const resetGame = useGameStore((state) => state.resetGame);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    resetGame();
    setShowResetConfirm(false);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center text-slate-200 p-4">
      <div className="max-w-sm w-full space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold mb-2">Settings</h2>
          <p className="text-sm text-slate-400">
            Customize your Grundy experience.
          </p>
        </div>

        {/* Sound Settings (P5-AUDIO-CORE) */}
        <div className="bg-slate-800/50 rounded-xl p-4 space-y-4">
          <button
            onClick={() => setSoundEnabled(!settings.soundEnabled)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🔊</span>
              <span>Sound Effects</span>
            </div>
            <div className={`w-12 h-6 rounded-full relative transition-colors ${settings.soundEnabled ? 'bg-green-500' : 'bg-slate-600'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.soundEnabled ? 'right-1' : 'left-1'}`} />
            </div>
          </button>
          <button
            onClick={() => setMusicEnabled(!settings.musicEnabled)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🎵</span>
              <span>Music</span>
            </div>
            <div className={`w-12 h-6 rounded-full relative transition-colors ${settings.musicEnabled ? 'bg-green-500' : 'bg-slate-600'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.musicEnabled ? 'right-1' : 'left-1'}`} />
            </div>
          </button>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
          <h3 className="text-sm font-medium text-red-400 mb-3">Danger Zone</h3>
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full py-2 px-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
            >
              Reset Game Data
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-red-300">Are you sure? This cannot be undone!</p>
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2 px-4 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Version Info */}
        <div className="text-center text-xs text-slate-500">
          Grundy Web Prototype v0.1.0
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN APP
// ============================================
export default function GrundyPrototype() {
  // FTUE check - show onboarding for new players (P4-7)
  const ftue = useGameStore((state) => state.ftue);
  const showFtue = shouldShowFtue({ ftue });

  // If FTUE is not complete, show the FTUE flow
  // P4-7: No monetization/shop during FTUE
  if (showFtue) {
    return <FtueFlow />;
  }

  // Normal app after FTUE completion
  return <MainApp />;
}

// ============================================
// MAIN APP (Post-FTUE)
// ============================================
function MainApp() {
  // Navigation state
  const [currentView, setCurrentView] = useState<AppView>(DEFAULT_VIEW);

  // Shop modal state (shared across views)
  const [showShop, setShowShop] = useState(false);
  const currencies = useGameStore((state) => state.currencies);
  const inventory = useGameStore((state) => state.inventory);
  const buyFood = useGameStore((state) => state.buyFood);

  // Audio settings (P5-AUDIO)
  const musicEnabled = useGameStore((state) => state.settings.musicEnabled);
  const soundEnabled = useGameStore((state) => state.settings.soundEnabled);

  // Environment state
  const environment = useGameStore((state) => state.environment);
  const syncEnvironmentWithView = useGameStore((state) => state.syncEnvironmentWithView);
  const refreshTimeOfDay = useGameStore((state) => state.refreshTimeOfDay);

  // Initialize audio manager with stored settings and start background music (P5-AUDIO)
  useEffect(() => {
    audioManager.setSoundEnabled(soundEnabled);
    audioManager.setMusicEnabled(musicEnabled);
    if (musicEnabled) {
      startBackgroundMusic();
    }
    return () => {
      stopBackgroundMusic();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle music setting changes (P5-AUDIO)
  useEffect(() => {
    if (musicEnabled) {
      startBackgroundMusic();
    } else {
      stopBackgroundMusic();
    }
  }, [musicEnabled]);

  // Sync environment on mount
  useEffect(() => {
    syncEnvironmentWithView(currentView);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync environment when view changes
  useEffect(() => {
    syncEnvironmentWithView(currentView);
  }, [currentView, syncEnvironmentWithView]);

  // Auto-refresh time-of-day every 15 minutes
  useEffect(() => {
    // Refresh once on mount
    refreshTimeOfDay();

    const interval = setInterval(() => {
      // Use getState() to avoid stale closures
      useGameStore.getState().refreshTimeOfDay();
    }, ENVIRONMENT_REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [refreshTimeOfDay]);

  // Get background class based on environment
  const bgClass = getBackgroundClass(environment.timeOfDay, environment.room);

  // View change handler
  const handleChangeView = useCallback((view: AppView) => {
    setCurrentView(view);
  }, []);

  // Shop handlers
  const handleOpenShop = () => setShowShop(true);
  const handleCloseShop = () => setShowShop(false);
  const handleBuy = useCallback((foodId: string) => {
    buyFood(foodId, 1);
  }, [buyFood]);

  return (
    <div className={`h-screen w-screen flex flex-col bg-gradient-to-b ${bgClass} overflow-hidden`}>
      {/* App Header */}
      <AppHeader />

      {/* Main Content (P5-ART-ROOMS: RoomScene wraps home view) */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {currentView === 'home' && (
          <RoomScene showAccents={true}>
            <HomeView onOpenShop={handleOpenShop} />
          </RoomScene>
        )}
        {currentView === 'games' && (
          <RoomScene showAccents={false}>
            <GamesView />
          </RoomScene>
        )}
        {currentView === 'settings' && (
          <SettingsView />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav currentView={currentView} onChangeView={handleChangeView} />

      {/* Shop Modal (available from any view) */}
      <ShopModal
        isOpen={showShop}
        onClose={handleCloseShop}
        coins={currencies.coins}
        onBuy={handleBuy}
        inventory={inventory}
      />

      {/* Debug HUD - only visible in dev builds (BCT-HUD-002) */}
      <DebugHud />
    </div>
  );
}
