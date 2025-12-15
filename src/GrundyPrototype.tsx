import React, { useState, useEffect, useCallback } from 'react';
import { useGameStore, shouldShowFtue } from './game/store';
import { PETS, getAllPets, getPetById } from './data/pets';
import { getAllFoods, getFoodById } from './data/foods';
import { ReactionType, FoodDefinition, FeedResult, MiniGameId, MiniGameResult, AppView } from './types';
import { getXPForLevel } from './data/config';
import { DEFAULT_VIEW } from './game/navigation';
import { AppHeader } from './components/layout/AppHeader';
// Bible v1.10: ActionBar replaces BottomNav for Menu-first + Action Bar model
import { ActionBar } from './components/layout/ActionBar';
import { MenuOverlay, MenuAction } from './components/layout/MenuOverlay';
import { FoodDrawer } from './components/layout/FoodDrawer';
import { CooldownBanner } from './components/layout/CooldownBanner';
import { DebugHud } from './components/layout/DebugHud';
import { getBackgroundClass, ENVIRONMENT_REFRESH_INTERVAL_MS, ROOM_LABELS } from './game/environment';
import type { RoomId } from './types';
import { MiniGameHub } from './components/MiniGameHub';
import { MiniGameWrapper } from './components/MiniGameWrapper';
import { SnackCatch } from './components/games/SnackCatch';
import { MemoryMatch } from './components/games/MemoryMatch';
import { RhythmTap } from './components/games/RhythmTap';
import { Pips } from './components/games/Pips';
import { PoopScoop } from './components/games/PoopScoop';
import { FtueFlow } from './ftue/FtueFlow';
import {
  playPetHappy,
  playLevelUp,
  startBackgroundMusic,
  stopBackgroundMusic,
  audioManager,
  startRoomAmbience,
  stopRoomAmbience,
  updateTimeOfDay,
} from './audio/audioManager';
// P5-ART-PETS + P5-ART-ROOMS imports
import { PetDisplay, PoopIndicator } from './components/pet/PetAvatar';
import { RoomScene } from './components/environment/RoomScene';
import { getDefaultPoseForState, getPoseForReaction } from './game/petVisuals';
// P6-HUD-CLEANUP: Import fullness/cooldown systems for feedback
import { isStuffed, isOnCooldown, getFullnessState, getCooldownRemaining } from './game/systems';
// P1-ABILITY-4: Ability indicator component
import { AbilityIndicator } from './components/abilities/AbilityIndicator';
// P6-PWA-UI, P6-PWA-UPDATE imports
import { canInstall, promptInstall, isInstalled } from './pwa/installPrompt';
import { onServiceWorkerUpdate, hasServiceWorkerUpdate, applyServiceWorkerUpdate } from './pwa/serviceWorker';
// P8-INV-CORE: Inventory UI
import { InventoryView } from './components/inventory';
// P8-SHOP-CATALOG: Shop UI
import { ShopView } from './components/shop/ShopView';
// P9-C-SLOTS: Slot unlock UI test IDs
import { SLOT_UNLOCK_TEST_IDS } from './constants/bible.constants';
// P9-B: Multi-pet UI components
import {
  AggregatedBadgeCount,
  PetStatusRow,
  WelcomeBackModal,
  AllPetsAwayScreen,
  AutoSwitchToast,
  useMultiPetUI,
  MultiPetDevDiagnostics,
} from './components/multipet';

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

// Room Selector Component (P6-ENV-UI)
// Bible §14.4: Explicit room switcher for exploring rooms
// Note: Activities (feeding, playing) override manual room selection per Bible precedence rule
const RoomSelector = ({ currentRoom, onSelectRoom }: {
  currentRoom: RoomId;
  onSelectRoom: (room: RoomId) => void;
}) => {
  // Available rooms for manual selection (yard excluded - reserved for future outdoor features)
  const rooms: { id: RoomId; icon: string; label: string }[] = [
    { id: 'living_room', icon: '🏠', label: ROOM_LABELS.living_room },
    { id: 'kitchen', icon: '🍳', label: ROOM_LABELS.kitchen },
    { id: 'bedroom', icon: '🛏️', label: ROOM_LABELS.bedroom },
    { id: 'playroom', icon: '🎮', label: ROOM_LABELS.playroom },
  ];

  return (
    <div
      className="flex justify-center gap-1 shrink-0"
      data-testid="room-selector"
      role="tablist"
      aria-label="Room selection"
    >
      {rooms.map((room) => {
        const isActive = currentRoom === room.id;
        const testIdMap: Record<RoomId, string> = {
          living_room: 'room-tab-living',
          kitchen: 'room-tab-kitchen',
          bedroom: 'room-tab-bedroom',
          playroom: 'room-tab-playroom',
          yard: 'room-tab-yard',
        };
        return (
          <button
            key={room.id}
            onClick={() => onSelectRoom(room.id)}
            className={`
              px-2 py-1 rounded-lg text-xs transition-all flex items-center gap-1
              ${isActive
                ? 'bg-amber-500/30 text-amber-200 border border-amber-500/50'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 border border-transparent'}
            `}
            data-testid={testIdMap[room.id]}
            role="tab"
            aria-selected={isActive}
            aria-label={`Switch to ${room.label}`}
          >
            <span aria-hidden="true">{room.icon}</span>
            <span className="hidden sm:inline">{room.label}</span>
          </button>
        );
      })}
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
// Bible §14.6: Mobile-first layout - no scrolling required for core loop
// ============================================
interface HomeViewProps {
  /** @deprecated Shop is now in AppHeader per Bible §14.6 */
  onOpenShop?: () => void;
  /** P8-INV-CORE: Preselected food from Inventory "Use on Pet" (BCT-INV-017) */
  pendingFeedFoodId?: string | null;
  /** P8-INV-CORE: Callback to clear preselection after feeding or cancel */
  onClearPendingFeed?: () => void;
}

function HomeView({ onOpenShop, pendingFeedFoodId, onClearPendingFeed }: HomeViewProps) {
  // Get state and actions from Zustand store
  const pet = useGameStore((state) => state.pet);
  const currencies = useGameStore((state) => state.currencies);
  const inventory = useGameStore((state) => state.inventory);
  const stats = useGameStore((state) => state.stats);
  const feed = useGameStore((state) => state.feed);
  const buyFood = useGameStore((state) => state.buyFood);
  const tick = useGameStore((state) => state.tick);
  const selectPet = useGameStore((state) => state.selectPet);
  // P6-ENV-UI: Room selector state and action
  const environment = useGameStore((state) => state.environment);
  const setRoom = useGameStore((state) => state.setRoom);
  // P10-B2: Poop state and clean action
  const activePetId = useGameStore((state) => state.activePetId);
  const petsById = useGameStore((state) => state.petsById);
  const cleanPoop = useGameStore((state) => state.cleanPoop);
  const activePet = petsById[activePetId];
  const isPoopDirty = activePet?.isPoopDirty ?? false;
  // P11-C: Cosmetics render layering
  const getPetEquippedCosmetics = useGameStore((state) => state.getPetEquippedCosmetics);
  const equippedCosmetics = getPetEquippedCosmetics(activePetId);

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

  // BCT-INV-017: Get preselected food definition for display
  const preselectedFood = pendingFeedFoodId ? getFoodById(pendingFeedFoodId) : null;
  const preselectedFoodCount = pendingFeedFoodId ? (inventory[pendingFeedFoodId] || 0) : 0;

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

    // BCT-INV-017: Clear preselection after successful feed
    if (onClearPendingFeed) {
      onClearPendingFeed();
    }

  }, [pet.id, inventory, isFeeding, feed, petName, onClearPendingFeed]);

  // Change pet using store
  const changePet = (petId: string) => {
    selectPet(petId);
  };

  // Compute fullness/cooldown states once
  const petStuffed = isStuffed(pet.hunger);
  const petOnCooldown = isOnCooldown(stats.lastFeedCooldownStart);

  return (
    <div
      className="h-full flex flex-col text-white p-2 sm:p-4 overflow-hidden"
      data-testid="home-view"
    >
      {/* Bible §14.6: Mobile-first layout - all core loop elements visible without scroll */}
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full min-h-0">

        {/* Pet Selection - Debug only per BCT-PET-01: Single active pet on Home */}
        {/* Bible §14.5: "Only active pet visible on home screen. No pet bar showing all 8 pets simultaneously." */}
        {import.meta.env.DEV && (
          <div className="flex justify-center gap-1 mb-2 flex-wrap shrink-0" data-testid="debug-pet-selector">
            {allPets.map((p) => (
              <button
                key={p.id}
                onClick={() => changePet(p.id)}
                className={`px-2 py-0.5 rounded-full text-xs transition-all
                  ${pet.id === p.id
                    ? 'bg-white text-gray-900 font-bold'
                    : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                {p.emoji} {p.name}
              </button>
            ))}
          </div>
        )}

        {/* P6-ENV-UI: Room Selector - Bible §14.4 explicit room switcher */}
        {/* Note: Activities (feed→kitchen, play→playroom) override manual selection per Bible precedence */}
        <div className="mb-2">
          <RoomSelector currentRoom={environment.room} onSelectRoom={setRoom} />
        </div>

        {/* Bible v1.10 §14.6: Cooldown banner - player-facing visibility (not dev-only) */}
        {(petStuffed || petOnCooldown) && (
          <div className="mb-2 shrink-0">
            <CooldownBanner
              isOnCooldown={petOnCooldown}
              isStuffed={petStuffed}
              cooldownRemaining={getCooldownRemaining(stats.lastFeedCooldownStart)}
            />
          </div>
        )}

        {/* Pet Display Area - Bible §14.6: Pet visible, 40-50% of viewport height */}
        <div
          className="relative rounded-2xl p-3 sm:p-4 text-center flex-1 min-h-0 flex flex-col justify-center"
          style={{
            background: `linear-gradient(135deg, ${petColor}22, ${petColor}11)`,
            border: `2px solid ${petColor}44`,
            maxHeight: '50vh'
          }}
          data-testid="active-pet-display"
        >
          {/* Your Grundy Label - Bible §14.5 context */}
          <div className="text-[10px] text-slate-400 mb-1 shrink-0">Your Grundy</div>

          {/* Level Badge */}
          <div className="absolute top-2 left-2 bg-black/50 px-2 py-0.5 rounded-full text-xs">
            {evolutionEmoji} Lv.{pet.level}
          </div>

          {/* Mood Badge - Debug only per BCT-HUD-001: Mood hidden in production */}
          {import.meta.env.DEV && (
            <div className="absolute top-2 right-2 bg-black/50 px-2 py-0.5 rounded-full text-xs">
              {moodEmoji} {pet.mood}
            </div>
          )}

          {/* Pet Sprite (P5-ART-PETS, P6-ART-PRODUCTION) - Constrained for mobile */}
          <div
            className={`flex-1 flex items-center justify-center min-h-0 transition-transform duration-300 relative ${isFeeding ? 'scale-110' : ''}`}
            style={{ filter: pet.hunger < 20 ? 'grayscale(50%)' : 'none' }}
          >
            <PetDisplay petId={pet.id} pose={currentPose} stage={pet.evolutionStage} breathing={!isFeeding} equippedCosmetics={equippedCosmetics} />
            {/* P10-B2: Poop indicator - positioned bottom-right of pet area */}
            <PoopIndicator
              isPoopDirty={isPoopDirty}
              onClean={() => cleanPoop(activePetId)}
              className="absolute bottom-0 right-4"
            />
          </div>

          {/* Pet Name */}
          <h2 className="text-lg sm:text-xl font-bold shrink-0">{petName}</h2>

          {/* Reaction Display */}
          <div className="h-8 sm:h-10 shrink-0">
            <ReactionDisplay reaction={lastReaction} message={reactionMessage} />
          </div>

          {/* Bond bar - Always visible per Bible §4.4 */}
          <div className="shrink-0 mt-1">
            <ProgressBar value={pet.bond} max={100} color="#ec4899" label="Bond" showText={false} />
          </div>

          {/* Debug stats - XP and Hunger: Debug only per Bible §4.4 */}
          {import.meta.env.DEV && (
            <div className="shrink-0 mt-1 space-y-1">
              <ProgressBar value={pet.xp} max={xpForNextLevel} color="#a855f7" label="XP" showText={false} />
              <ProgressBar value={pet.hunger} max={100} color="#fb923c" label="Hunger" showText={false} />
            </div>
          )}
        </div>

        {/* Hungry Hint - Compact inline */}
        {pet.hunger < 30 && (
          <div className="text-center text-orange-400 text-xs py-1 shrink-0 animate-pulse">
            {petName} is getting hungry!
          </div>
        )}

        {/* BCT-INV-017: Preselection banner from Inventory "Use on Pet" */}
        {preselectedFood && preselectedFoodCount > 0 && (
          <div
            className="bg-amber-500/20 border border-amber-400/50 rounded-xl p-2 mt-2 shrink-0 flex items-center justify-between"
            data-testid="feed-preselected-banner"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{preselectedFood.emoji}</span>
              <div>
                <span className="text-sm text-amber-300 font-medium">Preselected: {preselectedFood.name}</span>
                <span className="text-xs text-amber-400/70 ml-2">(×{preselectedFoodCount})</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleFeed(pendingFeedFoodId!)}
                disabled={isFeeding || petStuffed || petOnCooldown}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all
                  ${isFeeding || petStuffed || petOnCooldown
                    ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 text-white active:scale-95'
                  }`}
                data-testid="feed-now-button"
              >
                Feed Now
              </button>
              <button
                onClick={onClearPendingFeed}
                className="text-amber-400/70 hover:text-amber-300 text-lg px-1"
                aria-label="Clear preselection"
                data-testid="feed-clear-preselection"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Food Bag - Primary Action Area (Bible §14.6: Feed button visible without scroll) */}
        <div className="bg-gray-800/50 rounded-xl p-2 sm:p-3 mt-2 shrink-0" data-testid="food-bag">
          <h3 className="text-xs text-gray-400 mb-2 flex items-center gap-1">
            <span>🎒</span> Food Bag
            {/* Bible §4.4: Contextual UI cues for fullness state */}
            {petStuffed ? (
              <span className="ml-auto text-[10px] text-red-400">Too full! 🚫</span>
            ) : petOnCooldown ? (
              <span className="ml-auto text-[10px] text-orange-400">Cooldown ⏱</span>
            ) : (
              <span className="ml-auto text-[10px]">Tap to feed!</span>
            )}
          </h3>

          <div className="flex gap-1.5 overflow-x-auto pb-1" data-testid="feed-actions">
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

        {/* Stats Footer - Debug only per Bible §4.4 */}
        {import.meta.env.DEV && (
          <div className="text-center text-gray-500 text-[10px] mt-1 shrink-0">
            Total feeds: {stats.totalFeeds} | Session: {new Date(stats.sessionStartTime).toLocaleTimeString()}
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
// P6-NAV-GROUNDWORK: Added data-testid="games-view" for BCT coverage
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
      <div className="h-full" data-testid="games-view">
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
    <div className="h-full" data-testid="games-view">
      <MiniGameHub onSelectGame={handleSelectGame} onBack={handleBackToHub} />
    </div>
  );
}

// ============================================
// VIEW: SETTINGS
// Bible §14.5: Pet switching via Settings with confirmation
// P6-NAV-GROUNDWORK: Added data-testid="settings-view" for BCT coverage
// P6-PWA-UI: Added Install CTA section
// ============================================
function SettingsView() {
  const settings = useGameStore((state) => state.settings);
  const setSoundEnabled = useGameStore((state) => state.setSoundEnabled);
  const setMusicEnabled = useGameStore((state) => state.setMusicEnabled);
  const resetGame = useGameStore((state) => state.resetGame);
  const pet = useGameStore((state) => state.pet);
  // P9-A: Use multi-pet selectors
  const activePetId = useGameStore((state) => state.activePetId);
  const ownedPets = useGameStore((state) => state.getOwnedPets());
  const setActivePet = useGameStore((state) => state.setActivePet);
  // P9-B: Pet status badges
  const getPetStatusBadges = useGameStore((state) => state.getPetStatusBadges);
  const petStatusBadges = getPetStatusBadges();
  // P9-C-SLOTS: Slot unlock state and actions
  const currencies = useGameStore((state) => state.currencies);
  const getSlotStatuses = useGameStore((state) => state.getSlotStatuses);
  const purchasePetSlot = useGameStore((state) => state.purchasePetSlot);
  const slotStatuses = getSlotStatuses();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showPetSelector, setShowPetSelector] = useState(false);
  const [pendingPetSwitch, setPendingPetSwitch] = useState<string | null>(null);
  // P9-C-SLOTS: Slot unlock confirmation modal
  const [pendingSlotUnlock, setPendingSlotUnlock] = useState<number | null>(null);

  // P6-PWA-UI: Install state
  const [installAvailable, setInstallAvailable] = useState(canInstall());
  const [appInstalled, setAppInstalled] = useState(isInstalled());

  // P6-PWA-UI: Check install availability periodically (beforeinstallprompt may fire late)
  useEffect(() => {
    const checkInterval = setInterval(() => {
      setInstallAvailable(canInstall());
      setAppInstalled(isInstalled());
    }, 1000);

    return () => clearInterval(checkInterval);
  }, []);

  // P6-PWA-UI: Handle install button click
  const handleInstall = async () => {
    const result = await promptInstall();
    if (result === 'accepted') {
      setAppInstalled(true);
      setInstallAvailable(false);
    }
  };

  // Get current pet data
  const currentPetData = getPetById(pet.id);

  const handleReset = () => {
    resetGame();
    setShowResetConfirm(false);
  };

  // P9-A: Pet switching with confirmation using instance IDs
  const handlePetSelect = (instanceId: string) => {
    if (instanceId === activePetId) {
      // Already active, just close selector
      setShowPetSelector(false);
      return;
    }
    // Show confirmation modal
    setPendingPetSwitch(instanceId);
  };

  const confirmPetSwitch = () => {
    if (pendingPetSwitch) {
      setActivePet(pendingPetSwitch);
      setPendingPetSwitch(null);
      setShowPetSelector(false);
    }
  };

  const cancelPetSwitch = () => {
    setPendingPetSwitch(null);
  };

  // P9-A: Get pending pet data for confirmation modal
  const getPendingPetData = () => {
    const pendingPet = ownedPets.find(p => p.instanceId === pendingPetSwitch);
    return pendingPet ? getPetById(pendingPet.speciesId) : null;
  };

  // P9-C-SLOTS: Slot unlock handlers
  const handleSlotUnlockClick = (slotNumber: number) => {
    setPendingSlotUnlock(slotNumber);
  };

  const confirmSlotUnlock = () => {
    if (pendingSlotUnlock) {
      const result = purchasePetSlot(pendingSlotUnlock);
      if (result.success) {
        // Success - modal will close
        setPendingSlotUnlock(null);
      } else {
        // Error handling could show a toast, but for now just log
        console.log(`[Slots] Purchase failed: ${result.error}`);
        setPendingSlotUnlock(null);
      }
    }
  };

  const cancelSlotUnlock = () => {
    setPendingSlotUnlock(null);
  };

  // P9-C-SLOTS: Get pending slot data for confirmation modal
  const pendingSlotStatus = pendingSlotUnlock
    ? slotStatuses.find((s) => s.slotNumber === pendingSlotUnlock)
    : null;

  return (
    <div className="h-full flex flex-col items-center justify-center text-slate-200 p-4" data-testid="settings-view">
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

        {/* Pet Switching - Bible §14.5: Pet selector via Settings with confirmation */}
        <div className="bg-slate-800/50 rounded-xl p-4" data-testid="pet-switch-section">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Your Grundy</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentPetData?.emoji || '🐾'}</span>
              <div>
                <span className="font-medium">{currentPetData?.name || 'Unknown'}</span>
                <span className="text-xs text-slate-400 block">Lv.{pet.level}</span>
              </div>
            </div>
            <button
              onClick={() => setShowPetSelector(true)}
              className="relative px-3 py-1.5 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm transition-colors"
              data-testid="switch-pet-button"
            >
              Switch Pet
              {/* P9-B: Aggregated badge count */}
              <AggregatedBadgeCount />
            </button>
          </div>
        </div>

        {/* P9-A/P9-B: Pet Selector Modal - Shows owned pets with status badges */}
        {showPetSelector && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" data-testid="pet-selector-modal">
            <div className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full">
              <h2 className="text-lg font-bold mb-4">Select Your Grundy</h2>
              <div className="space-y-2 max-h-60 overflow-y-auto" data-testid="pet-switcher">
                {/* P9-B: Use PetStatusRow with badges for each pet */}
                {petStatusBadges.map((badge) => (
                  <PetStatusRow
                    key={badge.petId}
                    petId={badge.petId}
                    badge={badge}
                    isActive={activePetId === badge.petId}
                    onSelect={handlePetSelect}
                  />
                ))}
              </div>
              <button
                onClick={() => setShowPetSelector(false)}
                className="w-full mt-4 py-2 px-4 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* P9-A: Pet Switch Confirmation Modal */}
        {pendingPetSwitch && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" data-testid="pet-switch-confirm-modal">
            <div className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full text-center">
              <div className="text-4xl mb-4">{getPendingPetData()?.emoji || '🐾'}</div>
              <h2 className="text-lg font-bold mb-2">Switch to {getPendingPetData()?.name}?</h2>
              <p className="text-sm text-slate-400 mb-4">Your progress is auto-saved. You can switch back anytime!</p>
              <div className="flex gap-3">
                <button
                  onClick={cancelPetSwitch}
                  className="flex-1 py-2 px-4 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors"
                  data-testid="pet-switch-cancel"
                >
                  Stay
                </button>
                <button
                  onClick={confirmPetSwitch}
                  className="flex-1 py-2 px-4 bg-green-500 hover:bg-green-600 rounded-lg transition-colors font-medium"
                  data-testid="pet-switch-confirm"
                >
                  Switch
                </button>
              </div>
            </div>
          </div>
        )}

        {/* P9-C-SLOTS: Pet Slots Section */}
        <div className="bg-slate-800/50 rounded-xl p-4" data-testid={SLOT_UNLOCK_TEST_IDS.PET_SLOTS_SECTION}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-slate-300">Pet Slots</h3>
            <span className="text-xs text-slate-400">
              <span className="text-purple-400">{currencies.gems}</span> 💎
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {slotStatuses.map((slot) => (
              <div
                key={slot.slotNumber}
                className={`
                  relative p-2 rounded-lg border text-center
                  ${slot.isOwned
                    ? 'bg-green-500/10 border-green-500/30'
                    : slot.canUnlock
                      ? 'bg-purple-500/10 border-purple-500/30 cursor-pointer hover:bg-purple-500/20'
                      : 'bg-slate-700/50 border-slate-600/50'
                  }
                `}
                data-testid={SLOT_UNLOCK_TEST_IDS.SLOT_CONTAINER(slot.slotNumber)}
              >
                <div className="text-lg">
                  {slot.isOwned ? '✓' : slot.canUnlock ? '🔓' : '🔒'}
                </div>
                <div className="text-[10px] text-slate-400">Slot {slot.slotNumber}</div>
                {slot.isOwned ? (
                  <div className="text-[9px] text-green-400 mt-1">Owned</div>
                ) : slot.prereqMet ? (
                  <>
                    <div
                      className="text-[9px] text-purple-300 mt-1"
                      data-testid={SLOT_UNLOCK_TEST_IDS.PRICE_DISPLAY(slot.slotNumber)}
                    >
                      {slot.price} 💎
                    </div>
                    <button
                      onClick={() => handleSlotUnlockClick(slot.slotNumber)}
                      disabled={!slot.canUnlock}
                      className={`
                        mt-1 px-2 py-0.5 text-[9px] rounded transition-colors
                        ${slot.canUnlock
                          ? 'bg-purple-500 hover:bg-purple-600 text-white'
                          : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                        }
                      `}
                      data-testid={SLOT_UNLOCK_TEST_IDS.UNLOCK_CTA(slot.slotNumber)}
                    >
                      {slot.canUnlock ? 'Unlock' : 'Need 💎'}
                    </button>
                  </>
                ) : (
                  <div
                    className="text-[9px] text-amber-400 mt-1"
                    data-testid={SLOT_UNLOCK_TEST_IDS.PREREQ_MESSAGE(slot.slotNumber)}
                  >
                    {slot.prereqReason}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* P9-C-SLOTS: Slot Unlock Confirmation Modal */}
        {pendingSlotUnlock && pendingSlotStatus && (
          <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            data-testid={SLOT_UNLOCK_TEST_IDS.UNLOCK_MODAL}
          >
            <div className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full text-center">
              <div className="text-4xl mb-4">🔓</div>
              <h2 className="text-lg font-bold mb-2">Unlock Slot {pendingSlotUnlock}?</h2>
              <p className="text-sm text-slate-400 mb-4">
                This will cost <span className="text-purple-400 font-bold">{pendingSlotStatus.price} 💎</span>
              </p>
              <p className="text-xs text-slate-500 mb-4">
                Current balance: {currencies.gems} 💎
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelSlotUnlock}
                  className="flex-1 py-2 px-4 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors"
                  data-testid={SLOT_UNLOCK_TEST_IDS.CANCEL_BUTTON}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSlotUnlock}
                  disabled={!pendingSlotStatus.canUnlock}
                  className={`
                    flex-1 py-2 px-4 rounded-lg transition-colors font-medium
                    ${pendingSlotStatus.canUnlock
                      ? 'bg-purple-500 hover:bg-purple-600 text-white'
                      : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                    }
                  `}
                  data-testid={SLOT_UNLOCK_TEST_IDS.CONFIRM_BUTTON}
                >
                  Unlock
                </button>
              </div>
            </div>
          </div>
        )}

        {/* P6-PWA-UI: Install Grundy Section */}
        {(installAvailable || appInstalled) && (
          <div className="bg-slate-800/50 rounded-xl p-4" data-testid="install-section">
            <h3 className="text-sm font-medium text-slate-300 mb-3">Install Grundy</h3>
            {appInstalled ? (
              <div className="flex items-center gap-3 text-green-400">
                <span className="text-xl">✓</span>
                <span className="text-sm">Grundy is installed on this device</span>
              </div>
            ) : (
              <div>
                <p className="text-xs text-slate-400 mb-3">
                  Install Grundy on your device for quick access and offline play.
                </p>
                <button
                  onClick={handleInstall}
                  className="w-full py-2 px-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors font-medium"
                  data-testid="install-button"
                >
                  Install on this device
                </button>
              </div>
            )}
          </div>
        )}

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
// P6-PWA-UPDATE: Added SW update toast
// Bible v1.10: Menu-first + Action Bar navigation model
// ============================================
function MainApp() {
  // Navigation state
  const [currentView, setCurrentView] = useState<AppView>(DEFAULT_VIEW);

  // Shop modal state (shared across views)
  const [showShop, setShowShop] = useState(false);
  // P8-INV-CORE: Inventory modal state
  const [showInventory, setShowInventory] = useState(false);
  // Bible v1.10: Menu Overlay and Food Drawer state
  const [showMenuOverlay, setShowMenuOverlay] = useState(false);
  const [showFoodDrawer, setShowFoodDrawer] = useState(false);
  // P8-INV-CORE: Track food to pre-select for feeding
  const [pendingFeedFoodId, setPendingFeedFoodId] = useState<string | null>(null);
  const currencies = useGameStore((state) => state.currencies);
  const inventory = useGameStore((state) => state.inventory);
  const buyFood = useGameStore((state) => state.buyFood);
  // Bible v1.10: Get stats for cooldown calculation
  const stats = useGameStore((state) => state.stats);
  const feed = useGameStore((state) => state.feed);
  // P8-SHOP-PURCHASE: Shop purchase action
  const purchaseShopItem = useGameStore((state) => state.purchaseShopItem);
  // P8-SHOP-CATALOG: Shop requires pet + mode for recommendations
  const pet = useGameStore((state) => state.pet);
  const playMode = useGameStore((state) => state.playMode);
  const energy = useGameStore((state) => state.energy);

  // P9-B: Multi-pet UI state (welcome back, auto-switch toast)
  const {
    welcomeBackSummary,
    showWelcomeBack,
    autoSwitchInfo,
    showAutoSwitchToast,
    dismissWelcomeBack,
    dismissAutoSwitchToast,
  } = useMultiPetUI();

  // P9-B: All pets away state
  const allPetsAway = useGameStore((state) => state.allPetsAway);
  const setActivePet = useGameStore((state) => state.setActivePet);

  // Audio settings (P5-AUDIO)
  const musicEnabled = useGameStore((state) => state.settings.musicEnabled);
  const soundEnabled = useGameStore((state) => state.settings.soundEnabled);

  // Environment state
  const environment = useGameStore((state) => state.environment);
  const syncEnvironmentWithView = useGameStore((state) => state.syncEnvironmentWithView);
  const refreshTimeOfDay = useGameStore((state) => state.refreshTimeOfDay);

  // P6-PWA-UPDATE: SW update state
  const [showUpdateToast, setShowUpdateToast] = useState(hasServiceWorkerUpdate());

  // P6-PWA-UPDATE: Subscribe to SW update notifications
  useEffect(() => {
    const unsubscribe = onServiceWorkerUpdate(() => {
      setShowUpdateToast(true);
    });
    return unsubscribe;
  }, []);

  // P6-PWA-UPDATE: Handle update button click
  const handleApplyUpdate = useCallback(() => {
    applyServiceWorkerUpdate();
    // The page will reload automatically when the new SW takes control
  }, []);

  // P6-PWA-UPDATE: Handle dismiss toast
  const handleDismissUpdate = useCallback(() => {
    setShowUpdateToast(false);
  }, []);

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

  // P11-0: Process login streak on mount (once per session)
  // Bible §10.3, §11.4: Awards +10💎 on Day 7, runs only on new-day login
  useEffect(() => {
    const result = useGameStore.getState().processLoginStreak();
    if (result.newDayLogin) {
      console.log(`[P11-0] Login streak processed: Day ${result.newStreakDay}${result.day7Claimed ? ' (+10💎 Day 7 reward!)' : ''}`);
    }
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

  // P6-AUDIO-ROOM: Start room ambience when room changes
  useEffect(() => {
    if (musicEnabled) {
      startRoomAmbience(environment.room);
    }
    // Cleanup: stop ambience when component unmounts
    return () => {
      stopRoomAmbience();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [environment.room]);

  // P6-AUDIO-ROOM: Handle music enabled/disabled for ambience
  useEffect(() => {
    if (musicEnabled) {
      startRoomAmbience(environment.room);
    } else {
      stopRoomAmbience();
    }
  }, [musicEnabled, environment.room]);

  // P6-AUDIO-TOD: Update audio manager when time-of-day changes
  useEffect(() => {
    updateTimeOfDay(environment.timeOfDay);
  }, [environment.timeOfDay]);

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

  // P8-INV-CORE: Inventory handlers
  const handleOpenInventory = () => setShowInventory(true);
  const handleCloseInventory = () => setShowInventory(false);
  const handleInventoryToShop = () => {
    setShowInventory(false);
    setShowShop(true);
  };
  // BCT-INV-017: Use on Pet routes to feeding flow
  const handleInventoryToFeed = useCallback((foodId: string) => {
    setShowInventory(false);
    setCurrentView('home');
    setPendingFeedFoodId(foodId);
  }, []);

  // ============================================
  // Bible v1.10: Menu Overlay and Action Bar Handlers
  // ============================================

  // Get badge count for menu (pets needing attention)
  const getAggregatedBadgeCount = useGameStore((state) => state.getAggregatedBadgeCount);
  const badgeCount = getAggregatedBadgeCount();

  // Pet switcher modal state (triggered from menu)
  const [showPetSelector, setShowPetSelector] = useState(false);
  const getPetStatusBadges = useGameStore((state) => state.getPetStatusBadges);
  const petStatusBadges = getPetStatusBadges();
  const activePetId = useGameStore((state) => state.activePetId);

  // Cooldown state for Action Bar and Food Drawer
  const petStuffed = isStuffed(pet.hunger);
  const petOnCooldown = isOnCooldown(stats.lastFeedCooldownStart);
  const cooldownRemaining = getCooldownRemaining(stats.lastFeedCooldownStart);

  // All foods for Food Drawer
  const allFoods = getAllFoods();

  // Menu overlay handlers
  const handleOpenMenu = useCallback(() => {
    setShowMenuOverlay(true);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setShowMenuOverlay(false);
  }, []);

  const handleMenuAction = useCallback((action: MenuAction) => {
    setShowMenuOverlay(false);
    switch (action) {
      case 'switch-pet':
        setShowPetSelector(true);
        break;
      case 'shop':
        setShowShop(true);
        break;
      case 'inventory':
        setShowInventory(true);
        break;
      case 'games':
        setCurrentView('games');
        break;
      case 'settings':
        setCurrentView('settings');
        break;
      case 'home':
        // TODO: Add confirmation dialog before returning to welcome screen
        // For now, just go to home view
        setCurrentView('home');
        break;
    }
  }, []);

  // Food drawer handlers
  const handleOpenFoodDrawer = useCallback(() => {
    if (currentView !== 'home') {
      setCurrentView('home');
    }
    setShowFoodDrawer(true);
  }, [currentView]);

  const handleCloseFoodDrawer = useCallback(() => {
    setShowFoodDrawer(false);
  }, []);

  const handleFeedFromDrawer = useCallback((foodId: string) => {
    const result = feed(foodId);
    if (result?.success) {
      // Close drawer after successful feed
      setShowFoodDrawer(false);
    }
  }, [feed]);

  // Action bar handlers
  const handleActionBarFeed = useCallback(() => {
    handleOpenFoodDrawer();
  }, [handleOpenFoodDrawer]);

  const handleActionBarGames = useCallback(() => {
    setShowFoodDrawer(false);
    setShowMenuOverlay(false);
    setCurrentView('games');
  }, []);

  const handleActionBarMenu = useCallback(() => {
    setShowFoodDrawer(false);
    handleOpenMenu();
  }, [handleOpenMenu]);

  return (
    <div className={`h-screen w-screen flex flex-col bg-gradient-to-b ${bgClass} overflow-hidden`}>
      {/* App Header (Bible v1.10: Menu icon in header, Bible §14.6: currencies visible) */}
      <AppHeader
        onOpenShop={handleOpenShop}
        onOpenInventory={handleOpenInventory}
        onOpenMenu={handleOpenMenu}
        isMenuOpen={showMenuOverlay}
      />

      {/* Main Content (P5-ART-ROOMS: RoomScene wraps home view) */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {currentView === 'home' && (
          <RoomScene showAccents={true}>
            {/* P9-B: Show All Pets Away screen if all pets are runaway */}
            {allPetsAway ? (
              <AllPetsAwayScreen
                onSelectPet={(petId) => {
                  setActivePet(petId);
                  setCurrentView('settings');
                }}
              />
            ) : (
              <>
                {/* Bible §14.6: Shop moved to header - HomeView focuses on core loop */}
                {/* BCT-INV-017: Pass preselection state from Inventory */}
                <HomeView
                  pendingFeedFoodId={pendingFeedFoodId}
                  onClearPendingFeed={() => setPendingFeedFoodId(null)}
                />
              </>
            )}
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

      {/* Bible v1.10: Action Bar (Feed, Games, Menu) replaces legacy BottomNav */}
      <ActionBar
        onFeedTap={handleActionBarFeed}
        onGamesTap={handleActionBarGames}
        onMenuTap={handleActionBarMenu}
        isFoodDrawerOpen={showFoodDrawer}
        isMenuOpen={showMenuOverlay}
        isOnCooldown={petOnCooldown}
        isStuffed={petStuffed}
      />

      {/* P8-SHOP-CATALOG + P8-SHOP-PURCHASE: Shop Modal */}
      <ShopView
        isOpen={showShop}
        onClose={handleCloseShop}
        coins={currencies.coins}
        gems={currencies.gems}
        petLevel={pet.level}
        gameMode={playMode}
        petState={{
          hunger: pet.hunger,
          mood: pet.moodValue ?? 50,
          energy: energy.current,
          weight: 0, // TODO: Add weight tracking in future phase
          isSick: false, // TODO: Add sickness system in future phase
        }}
        inventory={inventory}
        onPurchase={(itemId, quantity) => {
          const result = purchaseShopItem(itemId, quantity);
          // Could add toast/feedback here in future
          return result.success;
        }}
        activePetId={activePetId}
      />

      {/* P8-INV-CORE: Inventory Modal (available from any view via header button) */}
      {showInventory && (
        <InventoryView
          onClose={handleCloseInventory}
          onNavigateToShop={handleInventoryToShop}
          onNavigateToFeed={handleInventoryToFeed}
        />
      )}

      {/* Bible v1.10: Menu Overlay (slide-up navigation panel) */}
      <MenuOverlay
        isOpen={showMenuOverlay}
        onClose={handleCloseMenu}
        onAction={handleMenuAction}
        badgeCount={badgeCount}
      />

      {/* Bible v1.10: Food Drawer (≥4 items visible without scrolling) */}
      <FoodDrawer
        isOpen={showFoodDrawer}
        onClose={handleCloseFoodDrawer}
        foods={allFoods}
        inventory={inventory}
        onFeed={handleFeedFromDrawer}
        isFeeding={false}
        isStuffed={petStuffed}
        isOnCooldown={petOnCooldown}
        cooldownRemaining={cooldownRemaining}
      />

      {/* Bible v1.10: Pet Selector Modal (triggered from Menu → Switch Pet) */}
      {showPetSelector && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" data-testid="pet-selector-modal-main">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4 text-white">Select Your Grundy</h2>
            <div className="space-y-2 max-h-60 overflow-y-auto" data-testid="pet-switcher-main">
              {petStatusBadges.map((badge) => {
                const petData = getPetById(badge.petId.split('-')[0]);
                const isActive = activePetId === badge.petId;
                return (
                  <button
                    key={badge.petId}
                    onClick={() => {
                      if (!isActive) {
                        setActivePet(badge.petId);
                      }
                      setShowPetSelector(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                      isActive
                        ? 'bg-amber-500/20 border-2 border-amber-400'
                        : 'bg-slate-700/50 hover:bg-slate-600/50 border-2 border-transparent'
                    }`}
                  >
                    <span className="text-2xl">{petData?.emoji || '🐾'}</span>
                    <div className="flex-1 text-left">
                      <span className="font-medium text-white">{petData?.name || 'Unknown'}</span>
                      {badge.needsAttention && badge.badge && (
                        <span className="ml-2">{badge.badge}</span>
                      )}
                    </div>
                    {isActive && (
                      <span className="text-xs text-amber-400">Active</span>
                    )}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setShowPetSelector(false)}
              className="w-full mt-4 py-2 px-4 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Debug HUD - only visible in dev builds (BCT-HUD-002) */}
      <DebugHud />

      {/* P1-ABILITY-4: Ability trigger indicators (global overlay) */}
      <AbilityIndicator />

      {/* P6-PWA-UPDATE: New version available toast */}
      {showUpdateToast && (
        <div
          className="fixed bottom-20 left-4 right-4 bg-slate-800 border border-purple-500/50 rounded-xl p-4 shadow-lg z-50 animate-slide-up"
          data-testid="update-toast"
        >
          <div className="flex items-start gap-3">
            <span className="text-xl">✨</span>
            <div className="flex-1">
              <p className="font-medium text-slate-100">New version available</p>
              <p className="text-xs text-slate-400 mt-1">
                A new version of Grundy is ready. Refresh to get the latest features.
              </p>
            </div>
            <button
              onClick={handleDismissUpdate}
              className="text-slate-400 hover:text-slate-200 p-1"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleDismissUpdate}
              className="flex-1 py-2 px-3 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              Later
            </button>
            <button
              onClick={handleApplyUpdate}
              className="flex-1 py-2 px-3 text-sm bg-purple-500 hover:bg-purple-600 font-medium rounded-lg transition-colors"
              data-testid="update-refresh-button"
            >
              Refresh now
            </button>
          </div>
        </div>
      )}

      {/* P9-B: Welcome Back Modal (shown when return gap > 24h) */}
      {showWelcomeBack && welcomeBackSummary && (
        <WelcomeBackModal
          summary={welcomeBackSummary}
          onDismiss={dismissWelcomeBack}
        />
      )}

      {/* P9-B: Auto-switch Toast (shown when active pet runs away) */}
      {showAutoSwitchToast && autoSwitchInfo && (
        <AutoSwitchToast
          oldPetName={autoSwitchInfo.oldPetName}
          newPetName={autoSwitchInfo.newPetName}
          onDismiss={dismissAutoSwitchToast}
        />
      )}

      {/* P9-B: DEV-only multi-pet diagnostics */}
      <MultiPetDevDiagnostics />
    </div>
  );
}
