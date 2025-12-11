// ============================================
// GRUNDY — NEGLECT INDICATOR COMPONENT
// P7-NEGLECT-SYSTEM: Visual feedback for neglect states
// Bible §9.4.3: Neglect & Withdrawal System (Classic Mode Only)
// ============================================

import React from 'react';
import { useGameStore } from '../../game/store';
import {
  NEGLECT_UI_COPY,
  NEGLECT_RETURN_MESSAGE,
  NEGLECT_CONFIG,
  type NeglectStageId,
} from '../../constants/bible.constants';
import type { NeglectState } from '../../types';

// ============================================
// BADGE CONFIG
// ============================================

interface NeglectBadgeConfig {
  emoji: string;
  label: string;
  bgClass: string;
  textClass: string;
}

const NEGLECT_BADGES: Record<NeglectStageId, NeglectBadgeConfig | null> = {
  normal: null, // No badge for normal state
  worried: {
    emoji: '💭',
    label: 'Worried',
    bgClass: 'bg-yellow-100',
    textClass: 'text-yellow-800',
  },
  sad: {
    emoji: '😢',
    label: 'Sad',
    bgClass: 'bg-blue-100',
    textClass: 'text-blue-800',
  },
  withdrawn: {
    emoji: '💔',
    label: 'Withdrawn',
    bgClass: 'bg-purple-100',
    textClass: 'text-purple-800',
  },
  critical: {
    emoji: '⚠️',
    label: 'Critical',
    bgClass: 'bg-red-100',
    textClass: 'text-red-800',
  },
  runaway: {
    emoji: '🏃',
    label: 'Run Away',
    bgClass: 'bg-gray-100',
    textClass: 'text-gray-800',
  },
};

// ============================================
// NEGLECT BADGE COMPONENT
// ============================================

interface NeglectBadgeProps {
  stage: NeglectStageId;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * NeglectBadge - Small badge showing current neglect stage.
 * Bible §9.4.3: Badge displayed on pet card for Withdrawn+ states.
 */
export function NeglectBadge({ stage, size = 'sm', className = '' }: NeglectBadgeProps) {
  const badge = NEGLECT_BADGES[stage];
  if (!badge) return null;

  const sizeClasses = size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-1';

  return (
    <div
      className={`
        inline-flex items-center gap-1 rounded-full font-medium
        ${badge.bgClass} ${badge.textClass} ${sizeClasses} ${className}
      `}
      title={NEGLECT_UI_COPY[stage]}
    >
      <span>{badge.emoji}</span>
      <span>{badge.label}</span>
    </div>
  );
}

// ============================================
// NEGLECT MESSAGE COMPONENT
// ============================================

interface NeglectMessageProps {
  stage: NeglectStageId;
  className?: string;
}

/**
 * NeglectMessage - Full message for current neglect state.
 * Bible §9.4.3: Canonical UI copy for each state.
 */
export function NeglectMessage({ stage, className = '' }: NeglectMessageProps) {
  const message = NEGLECT_UI_COPY[stage];
  if (!message) return null;

  return (
    <p className={`text-sm text-gray-600 italic ${className}`}>
      {message}
    </p>
  );
}

// ============================================
// RUNAWAY SCREEN COMPONENT
// ============================================

interface RunawayScreenProps {
  petId: string;
  neglectState: NeglectState;
  onCallBack?: () => void;
  onPayToCallBack?: () => void;
  className?: string;
}

/**
 * RunawayScreen - Displayed when pet has run away.
 * Bible §9.4.3: Empty pet area with cushion graphic and call back options.
 */
export function RunawayScreen({
  petId,
  neglectState,
  onCallBack,
  onPayToCallBack,
  className = '',
}: RunawayScreenProps) {
  const now = new Date();
  const currencies = useGameStore((state) => state.currencies);

  // Calculate time remaining until free return
  const freeReturnTime = neglectState.canReturnFreeAt
    ? new Date(neglectState.canReturnFreeAt)
    : null;
  const paidReturnTime = neglectState.canReturnPaidAt
    ? new Date(neglectState.canReturnPaidAt)
    : null;

  const canReturnFree = freeReturnTime && now >= freeReturnTime;
  const canReturnPaid = paidReturnTime && now >= paidReturnTime;
  const hasEnoughGems = currencies.gems >= NEGLECT_CONFIG.RUNAWAY_RECOVERY_GEMS;

  // Calculate countdown for free return
  const getCountdown = () => {
    if (!freeReturnTime || canReturnFree) return null;
    const diffMs = freeReturnTime.getTime() - now.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const countdown = getCountdown();

  return (
    <div className={`flex flex-col items-center justify-center p-6 ${className}`}>
      {/* Empty cushion/bed visual */}
      <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4 shadow-inner">
        <span className="text-4xl opacity-50">🛏️</span>
      </div>

      {/* Runaway message */}
      <p className="text-center text-gray-600 mb-4 max-w-xs">
        {NEGLECT_UI_COPY.runaway}
      </p>

      {/* Call back options */}
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {/* Free call back (after 72h) */}
        {canReturnFree && (
          <button
            onClick={onCallBack}
            className="w-full py-2 px-4 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            Call Back (Free)
          </button>
        )}

        {/* Paid call back (after 24h) */}
        {canReturnPaid && !canReturnFree && (
          <button
            onClick={onPayToCallBack}
            disabled={!hasEnoughGems}
            className={`
              w-full py-2 px-4 rounded-lg font-medium transition-colors
              ${hasEnoughGems
                ? 'bg-purple-500 text-white hover:bg-purple-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            Call Back ({NEGLECT_CONFIG.RUNAWAY_RECOVERY_GEMS} 💎)
          </button>
        )}

        {/* Countdown until free return */}
        {countdown && (
          <p className="text-center text-sm text-gray-500">
            Free return available in: {countdown}
          </p>
        )}

        {/* Not enough gems message */}
        {canReturnPaid && !canReturnFree && !hasEnoughGems && (
          <p className="text-center text-xs text-gray-400">
            Not enough gems. Wait for free return.
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================
// WITHDRAWAL RECOVERY PANEL
// ============================================

interface WithdrawalRecoveryProps {
  petId: string;
  neglectState: NeglectState;
  onPayToRecover?: () => void;
  className?: string;
}

/**
 * WithdrawalRecoveryPanel - Options for recovering from withdrawn state.
 * Bible §9.4.3: 7 care days (free) or 15 gems (instant).
 */
export function WithdrawalRecoveryPanel({
  petId,
  neglectState,
  onPayToRecover,
  className = '',
}: WithdrawalRecoveryProps) {
  const currencies = useGameStore((state) => state.currencies);
  const hasEnoughGems = currencies.gems >= NEGLECT_CONFIG.WITHDRAWN_RECOVERY_GEMS;

  const progressPercent = Math.min(
    100,
    (neglectState.recoveryDaysCompleted / NEGLECT_CONFIG.FREE_RECOVERY_CARE_DAYS) * 100
  );

  return (
    <div className={`bg-purple-50 rounded-lg p-4 ${className}`}>
      <h3 className="font-medium text-purple-800 mb-2">Recovery Progress</h3>

      {/* Free recovery progress */}
      <div className="mb-3">
        <div className="flex justify-between text-sm text-purple-600 mb-1">
          <span>Care days: {neglectState.recoveryDaysCompleted}/{NEGLECT_CONFIG.FREE_RECOVERY_CARE_DAYS}</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full h-2 bg-purple-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-purple-500 mt-1">
          Feed or play with your pet daily to recover
        </p>
      </div>

      {/* Paid recovery option */}
      <button
        onClick={onPayToRecover}
        disabled={!hasEnoughGems}
        className={`
          w-full py-2 px-4 rounded-lg font-medium transition-colors text-sm
          ${hasEnoughGems
            ? 'bg-purple-500 text-white hover:bg-purple-600'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }
        `}
      >
        Instant Recovery ({NEGLECT_CONFIG.WITHDRAWN_RECOVERY_GEMS} 💎)
      </button>
    </div>
  );
}

// ============================================
// PET DISPLAY WRAPPER WITH NEGLECT FILTER
// ============================================

interface NeglectPetWrapperProps {
  stage: NeglectStageId;
  children: React.ReactNode;
  className?: string;
}

/**
 * NeglectPetWrapper - Applies visual filters for neglect states.
 * Bible §9.4.3: Withdrawn state uses desaturation filter.
 */
export function NeglectPetWrapper({ stage, children, className = '' }: NeglectPetWrapperProps) {
  // Apply desaturation for withdrawn/critical states
  const isWithdrawnOrCritical = stage === 'withdrawn' || stage === 'critical';

  return (
    <div
      className={`relative ${className}`}
      style={isWithdrawnOrCritical ? {
        filter: 'saturate(0.5) brightness(0.9)',
      } : undefined}
    >
      {children}

      {/* Badge overlay for penalty states */}
      {isWithdrawnOrCritical && (
        <div className="absolute top-0 left-0">
          <NeglectBadge stage={stage} size="sm" />
        </div>
      )}
    </div>
  );
}

// ============================================
// HOOK: USE NEGLECT FOR PET
// ============================================

/**
 * Custom hook to get neglect state and helpers for a pet.
 */
export function useNeglectForPet(petId: string) {
  const playMode = useGameStore((state) => state.playMode);
  const neglectState = useGameStore((state) => state.neglectByPetId[petId]);
  const canInteract = useGameStore((state) => state.canInteractWithPet(petId));
  const recoverWithGems = useGameStore((state) => state.recoverFromWithdrawnWithGems);
  const recoverRunawayWithGems = useGameStore((state) => state.recoverFromRunawayWithGems);
  const callBackPet = useGameStore((state) => state.callBackRunawayPet);

  const isNeglectEnabled = playMode === 'classic';
  const currentStage = neglectState?.currentStage ?? 'normal';
  const isWithdrawn = neglectState?.isWithdrawn ?? false;
  const isRunaway = neglectState?.isRunaway ?? false;

  return {
    isNeglectEnabled,
    neglectState,
    currentStage,
    isWithdrawn,
    isRunaway,
    canInteract,
    recoverWithGems: () => recoverWithGems(petId),
    recoverRunawayWithGems: () => recoverRunawayWithGems(petId),
    callBackPet: (now?: Date) => callBackPet(petId, now),
  };
}

export default NeglectBadge;
