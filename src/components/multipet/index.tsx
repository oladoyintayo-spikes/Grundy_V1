// ============================================
// GRUNDY — MULTI-PET UI COMPONENTS
// P9-B UI Wiring: Pet badges, welcome back, all pets away
// Bible §11.6.1, §9.4.4-9.4.6, BCT v2.3
// ============================================

import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../game/store';
import { getPetById } from '../../data/pets';
import { ALERT_BADGES, OFFLINE_DECAY_RATES, NEGLECT_CONFIG } from '../../constants/bible.constants';
import type { OfflineReturnSummary, PetStatusBadge, PetInstanceId } from '../../types';

// ============================================
// PET STATUS BADGE (Single Pet)
// Bible §11.6.1: Per-pet badge showing neglect status
// ============================================

interface PetStatusBadgeIconProps {
  badge: '⚠️' | '💔' | '🔒' | null;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Renders the appropriate badge icon for a pet's status.
 * Bible §11.6.1: ⚠️ Warning, 💔 Urgent, 🔒 Locked
 */
export function PetStatusBadgeIcon({ badge, size = 'sm', className = '' }: PetStatusBadgeIconProps) {
  if (!badge) return null;

  const sizeClasses = size === 'sm' ? 'text-xs' : 'text-sm';
  const bgClasses = {
    [ALERT_BADGES.WARNING]: 'bg-yellow-500/20 text-yellow-400',
    [ALERT_BADGES.URGENT]: 'bg-red-500/20 text-red-400',
    [ALERT_BADGES.LOCKED]: 'bg-gray-500/20 text-gray-400',
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-1.5 py-0.5 ${sizeClasses} ${bgClasses[badge]} ${className}`}
      aria-label={badge === ALERT_BADGES.WARNING ? 'Needs attention' : badge === ALERT_BADGES.URGENT ? 'Urgent attention needed' : 'Locked - Runaway'}
    >
      {badge}
    </span>
  );
}

// ============================================
// AGGREGATED BADGE COUNT
// Bible §11.6.1: Badge count on pet selector button
// ============================================

interface AggregatedBadgeCountProps {
  className?: string;
}

/**
 * Shows the count of pets needing attention.
 * Bible §11.6.1: "Pet selector button shows aggregate badge count"
 */
export function AggregatedBadgeCount({ className = '' }: AggregatedBadgeCountProps) {
  const getAggregatedBadgeCount = useGameStore((state) => state.getAggregatedBadgeCount);
  const count = getAggregatedBadgeCount();

  if (count === 0) return null;

  return (
    <span
      data-testid="pet-badge-count"
      className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-xs font-bold rounded-full bg-red-500 text-white ${className}`}
      aria-label={`${count} pet${count > 1 ? 's' : ''} need attention`}
    >
      {count}
    </span>
  );
}

// ============================================
// PET STATUS ROW
// Bible §11.6.1: Individual pet status in selector
// ============================================

interface PetStatusRowProps {
  petId: PetInstanceId;
  badge: PetStatusBadge;
  isActive: boolean;
  onSelect: (petId: PetInstanceId) => void;
}

/**
 * Renders a single pet row in the pet selector with status badge.
 * Bible §11.6.1: Shows per-pet badge and lock state for runaway
 */
export function PetStatusRow({ petId, badge, isActive, onSelect }: PetStatusRowProps) {
  const petsById = useGameStore((state) => state.petsById);
  const pet = petsById[petId];

  if (!pet) return null;

  const petData = getPetById(pet.speciesId);
  const isLocked = badge.badge === ALERT_BADGES.LOCKED;

  return (
    <button
      data-testid={`pet-status-${petId}`}
      onClick={() => onSelect(petId)}
      className={`
        w-full p-3 rounded-xl flex items-center gap-3 transition-colors
        ${isActive
          ? 'bg-green-500/20 border-2 border-green-500'
          : isLocked
            ? 'bg-gray-700/50 border-2 border-gray-600'
            : badge.needsAttention
              ? 'bg-orange-500/10 border-2 border-orange-500/50 hover:bg-orange-500/20'
              : 'bg-slate-700 hover:bg-slate-600 border-2 border-transparent'}
      `}
      aria-label={`${petData?.name || pet.speciesId}${isLocked ? ' (Ran away)' : badge.needsAttention ? ' (Needs attention)' : ''}`}
    >
      {/* Pet icon */}
      <div className={`text-2xl ${isLocked ? 'opacity-50 grayscale' : ''}`}>
        {petData?.emoji || '🐾'}
      </div>

      {/* Pet info */}
      <div className="text-left flex-1">
        <div className="flex items-center gap-2">
          <span className={`font-medium ${isLocked ? 'text-gray-400' : ''}`}>
            {petData?.name || pet.speciesId}
          </span>
          {/* Status badge */}
          {badge.badge && <PetStatusBadgeIcon badge={badge.badge} />}
        </div>
        <span className={`text-xs ${isLocked ? 'text-gray-500' : 'text-slate-400'}`}>
          Lv.{pet.level}
          {isLocked && ' · Ran away'}
          {badge.needsAttention && !isLocked && ` · ${badge.neglectStage}`}
        </span>
      </div>

      {/* Active indicator */}
      {isActive && (
        <span className="text-xs text-green-400 bg-green-500/20 px-2 py-0.5 rounded-full">
          Active
        </span>
      )}

      {/* Lock icon for runaway */}
      {isLocked && !isActive && (
        <span className="text-lg" aria-hidden="true">🔒</span>
      )}
    </button>
  );
}

// ============================================
// WELCOME BACK MODAL
// Bible §9.4.6: Show summary if offline > 24h
// ============================================

interface WelcomeBackModalProps {
  summary: OfflineReturnSummary;
  onDismiss: () => void;
}

/**
 * Shows a summary of what happened while the player was away.
 * Bible §9.4.6: "Show Welcome Back summary if > 24h offline"
 */
export function WelcomeBackModal({ summary, onDismiss }: WelcomeBackModalProps) {
  const formatHours = (hours: number): string => {
    if (hours < 24) return `${Math.round(hours)} hour${hours >= 2 ? 's' : ''}`;
    const days = Math.floor(hours / 24);
    const remainingHours = Math.round(hours % 24);
    if (remainingHours === 0) return `${days} day${days > 1 ? 's' : ''}`;
    return `${days} day${days > 1 ? 's' : ''}, ${remainingHours}h`;
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      data-testid="welcome-back-modal"
    >
      <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">👋</div>
          <h2 className="text-xl font-bold text-white">Welcome Back!</h2>
          <p className="text-sm text-slate-400 mt-1">
            You were away for {formatHours(summary.hoursOffline)}
          </p>
        </div>

        {/* Pet changes */}
        {summary.petChanges.length > 0 && (
          <div className="space-y-3 mb-6">
            <h3 className="text-sm font-medium text-slate-300">While you were away:</h3>
            {summary.petChanges.map((change) => (
              <div
                key={change.petId}
                className={`p-3 rounded-lg ${change.becameRunaway ? 'bg-red-500/10 border border-red-500/30' : 'bg-slate-700/50'}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-white">{change.petName}</span>
                  {change.becameRunaway && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
                      🔒 Ran Away
                    </span>
                  )}
                  {change.newNeglectStage && !change.becameRunaway && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400">
                      {change.newNeglectStage}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {change.moodChange !== 0 && (
                    <div className="text-center">
                      <div className="text-slate-400">Mood</div>
                      <div className={change.moodChange < 0 ? 'text-red-400' : 'text-green-400'}>
                        {change.moodChange > 0 ? '+' : ''}{change.moodChange}
                      </div>
                    </div>
                  )}
                  {change.bondChange !== 0 && (
                    <div className="text-center">
                      <div className="text-slate-400">Bond</div>
                      <div className={change.bondChange < 0 ? 'text-red-400' : 'text-green-400'}>
                        {change.bondChange > 0 ? '+' : ''}{change.bondChange}
                      </div>
                    </div>
                  )}
                  {change.hungerChange !== 0 && (
                    <div className="text-center">
                      <div className="text-slate-400">Hunger</div>
                      <div className={change.hungerChange > 0 ? 'text-orange-400' : 'text-green-400'}>
                        {change.hungerChange > 0 ? '+' : ''}{change.hungerChange}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Auto-switch notification */}
        {summary.autoSwitchOccurred && summary.newActivePetId && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-6">
            <div className="flex items-center gap-2 text-blue-300 text-sm">
              <span>🔄</span>
              <span>Your active pet changed automatically</span>
            </div>
          </div>
        )}

        {/* All pets away warning */}
        {summary.allPetsAway && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6">
            <div className="flex items-center gap-2 text-red-300 text-sm">
              <span>⚠️</span>
              <span>All your pets have run away! Visit them to start recovery.</span>
            </div>
          </div>
        )}

        {/* Dismiss button */}
        <button
          onClick={onDismiss}
          data-testid="welcome-back-dismiss"
          className="w-full py-3 px-4 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-colors"
        >
          {summary.allPetsAway ? 'View My Pets' : "Let's Go!"}
        </button>
      </div>
    </div>
  );
}

// ============================================
// ALL PETS AWAY SCREEN
// Bible §9.4.4: Empty state when all pets are runaway
// ============================================

interface AllPetsAwayScreenProps {
  onSelectPet: (petId: PetInstanceId) => void;
}

/**
 * Displayed when all owned pets are in runaway state.
 * Bible §9.4.4: "Show All Pets Away state with recovery prompts"
 */
export function AllPetsAwayScreen({ onSelectPet }: AllPetsAwayScreenProps) {
  const ownedPetIds = useGameStore((state) => state.ownedPetIds);
  const petsById = useGameStore((state) => state.petsById);
  const neglectByPetId = useGameStore((state) => state.neglectByPetId);
  const currencies = useGameStore((state) => state.currencies);

  return (
    <div
      data-testid="all-pets-away-screen"
      className="h-full flex flex-col items-center justify-center text-white p-6"
    >
      {/* Empty state visual */}
      <div className="text-6xl mb-4 opacity-50">🏠</div>
      <h2 className="text-xl font-bold mb-2">All Pets Away</h2>
      <p className="text-sm text-slate-400 text-center mb-6 max-w-xs">
        All your Grundies have run away. They still remember you, but need time to feel safe again.
      </p>

      {/* Per-pet recovery CTAs */}
      <div className="w-full max-w-sm space-y-3">
        <h3 className="text-sm font-medium text-slate-300">Your Grundies:</h3>
        {ownedPetIds.map((petId) => {
          const pet = petsById[petId];
          const neglectState = neglectByPetId[petId];
          const petData = pet ? getPetById(pet.speciesId) : null;

          if (!pet || !neglectState) return null;

          const now = new Date();
          const canReturnFree = neglectState.canReturnFreeAt
            ? now >= new Date(neglectState.canReturnFreeAt)
            : false;
          const canReturnPaid = neglectState.canReturnPaidAt
            ? now >= new Date(neglectState.canReturnPaidAt)
            : false;
          const hasEnoughGems = currencies.gems >= NEGLECT_CONFIG.RUNAWAY_RECOVERY_GEMS;

          // Calculate time remaining
          let timeRemaining = '';
          if (!canReturnFree && neglectState.canReturnFreeAt) {
            const diff = new Date(neglectState.canReturnFreeAt).getTime() - now.getTime();
            const hoursLeft = Math.ceil(diff / (1000 * 60 * 60));
            timeRemaining = hoursLeft > 24
              ? `${Math.floor(hoursLeft / 24)}d ${hoursLeft % 24}h`
              : `${hoursLeft}h`;
          }

          return (
            <button
              key={petId}
              data-testid={`runaway-recovery-${petId}`}
              onClick={() => onSelectPet(petId)}
              className="w-full p-4 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl opacity-50 grayscale">{petData?.emoji || '🐾'}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{petData?.name || pet.speciesId}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-600 text-gray-300">
                      🔒 Away
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {canReturnFree ? (
                      <span className="text-green-400">Ready to return (Free)</span>
                    ) : canReturnPaid ? (
                      <span className="text-purple-400">
                        Early return: {NEGLECT_CONFIG.RUNAWAY_RECOVERY_GEMS}💎
                        {!hasEnoughGems && ' (not enough gems)'}
                      </span>
                    ) : (
                      <span>Free return in: {timeRemaining}</span>
                    )}
                  </div>
                </div>
                <span className="text-slate-400">→</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// AUTO-SWITCH TOAST
// Bible §9.4.4: Notify when active pet runs away
// ============================================

interface AutoSwitchToastProps {
  oldPetName: string;
  newPetName: string;
  onDismiss: () => void;
}

/**
 * Toast notification when the active pet runs away and auto-switch occurs.
 * Bible §9.4.4: "Show toast when auto-switched"
 */
export function AutoSwitchToast({ oldPetName, newPetName, onDismiss }: AutoSwitchToastProps) {
  // Auto-dismiss after 5 seconds
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className="fixed bottom-24 left-4 right-4 bg-slate-800 border border-orange-500/50 rounded-xl p-4 shadow-lg z-50 animate-slide-up"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <span className="text-xl">🔄</span>
        <div className="flex-1">
          <p className="font-medium text-slate-100">Pet Changed</p>
          <p className="text-sm text-slate-400 mt-1">
            Your pet {oldPetName} ran away. You're now caring for {newPetName}.
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-200 p-1"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// ============================================
// MULTI-PET MANAGER HOOK
// Manages welcome back modal and auto-switch toast state
// ============================================

interface MultiPetUIState {
  welcomeBackSummary: OfflineReturnSummary | null;
  autoSwitchInfo: { oldPetName: string; newPetName: string } | null;
  showWelcomeBack: boolean;
  showAutoSwitchToast: boolean;
}

/**
 * Hook to manage multi-pet UI state (welcome back modal, auto-switch toast).
 * Call on app initialization after FTUE complete.
 */
export function useMultiPetUI() {
  const [state, setState] = useState<MultiPetUIState>({
    welcomeBackSummary: null,
    autoSwitchInfo: null,
    showWelcomeBack: false,
    showAutoSwitchToast: false,
  });

  // Session flag to prevent re-showing welcome back
  const [welcomeBackDismissedThisSession, setWelcomeBackDismissedThisSession] = useState(false);

  const applyOfflineFanout = useGameStore((state) => state.applyOfflineFanout);
  const updateLastSeen = useGameStore((state) => state.updateLastSeen);
  const ftueComplete = useGameStore((state) => state.ftue.hasCompletedFtue);
  const getPetDisplayName = (petId: PetInstanceId): string => {
    const pet = useGameStore.getState().petsById[petId];
    const petData = pet ? getPetById(pet.speciesId) : null;
    return petData?.name || pet?.speciesId || 'Unknown';
  };

  // Apply offline fanout on mount (only if FTUE complete and not already dismissed)
  useEffect(() => {
    if (!ftueComplete || welcomeBackDismissedThisSession) return;

    const summary = applyOfflineFanout(new Date());

    if (summary && summary.hoursOffline >= OFFLINE_DECAY_RATES.WELCOME_BACK_THRESHOLD_HOURS) {
      // Show welcome back modal
      setState((s) => ({
        ...s,
        welcomeBackSummary: summary,
        showWelcomeBack: true,
      }));

      // If auto-switch occurred, prepare toast info
      if (summary.autoSwitchOccurred && summary.newActivePetId) {
        // Find the old pet from changes (the one that became runaway)
        const oldPet = summary.petChanges.find((c) => c.becameRunaway);
        if (oldPet) {
          setState((s) => ({
            ...s,
            autoSwitchInfo: {
              oldPetName: oldPet.petName,
              newPetName: getPetDisplayName(summary.newActivePetId!),
            },
          }));
        }
      }
    }

    // Update last seen timestamp
    updateLastSeen();
  }, [ftueComplete, welcomeBackDismissedThisSession, applyOfflineFanout, updateLastSeen]);

  const dismissWelcomeBack = () => {
    setState((s) => ({ ...s, showWelcomeBack: false }));
    setWelcomeBackDismissedThisSession(true);

    // Show auto-switch toast after dismissing welcome back if applicable
    if (state.autoSwitchInfo) {
      setState((s) => ({ ...s, showAutoSwitchToast: true }));
    }
  };

  const dismissAutoSwitchToast = () => {
    setState((s) => ({ ...s, showAutoSwitchToast: false, autoSwitchInfo: null }));
  };

  return {
    welcomeBackSummary: state.welcomeBackSummary,
    showWelcomeBack: state.showWelcomeBack,
    autoSwitchInfo: state.autoSwitchInfo,
    showAutoSwitchToast: state.showAutoSwitchToast,
    dismissWelcomeBack,
    dismissAutoSwitchToast,
  };
}

// ============================================
// DEV-ONLY DIAGNOSTICS
// ============================================

/**
 * DEV-only diagnostic panel for multi-pet debugging.
 * Only renders in development builds.
 */
export function MultiPetDevDiagnostics() {
  const activePetId = useGameStore((state) => state.activePetId);
  const getAggregatedBadgeCount = useGameStore((state) => state.getAggregatedBadgeCount);
  const lastSeenTimestamp = useGameStore((state) => state.lastSeenTimestamp);
  const allPetsAway = useGameStore((state) => state.allPetsAway);
  const ownedPetIds = useGameStore((state) => state.ownedPetIds);

  // Only render in DEV
  if (!import.meta.env.DEV) return null;

  const badgeCount = getAggregatedBadgeCount();
  const lastSeenDate = new Date(lastSeenTimestamp);

  return (
    <div
      className="fixed top-16 left-2 bg-black/80 text-[10px] text-white p-2 rounded-lg font-mono z-40 space-y-1"
      data-testid="multipet-dev-diagnostics"
    >
      <div className="text-yellow-400 font-bold">Multi-Pet Debug</div>
      <div>activePetId: {activePetId}</div>
      <div>badgeCount: {badgeCount}</div>
      <div>lastSeen: {lastSeenDate.toLocaleTimeString()}</div>
      <div>allPetsAway: {allPetsAway ? 'YES' : 'no'}</div>
      <div>ownedPets: {ownedPetIds.length}</div>
    </div>
  );
}

export default {
  PetStatusBadgeIcon,
  AggregatedBadgeCount,
  PetStatusRow,
  WelcomeBackModal,
  AllPetsAwayScreen,
  AutoSwitchToast,
  useMultiPetUI,
  MultiPetDevDiagnostics,
};
