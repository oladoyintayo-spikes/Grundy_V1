// ============================================
// GRUNDY — MINI-GAME WRAPPER
// Session lifecycle: Ready -> Play -> Results
// ============================================

import React, { useState, useCallback } from 'react';
import { useGameStore } from '../game/store';
import type { MiniGameId, MiniGameResult } from '../types';
import { createMiniGameResult, ENERGY_COST_PER_GAME } from '../game/miniGameRewards';
import { ReadyScreen } from './ReadyScreen';
import { ResultsScreen } from './ResultsScreen';

type GamePhase = 'ready' | 'playing' | 'results';

interface MiniGameWrapperProps {
  gameId: MiniGameId;
  onComplete: (result: MiniGameResult) => void;
  onQuit: () => void;
  children: React.ReactElement<{ onGameEnd: (score: number) => void }>;
}

export function MiniGameWrapper({
  gameId,
  onComplete,
  onQuit,
  children,
}: MiniGameWrapperProps) {
  const [phase, setPhase] = useState<GamePhase>('ready');
  const [result, setResult] = useState<MiniGameResult | null>(null);
  const [isFree, setIsFree] = useState(false);

  const canPlay = useGameStore((state) => state.canPlay);
  const recordPlay = useGameStore((state) => state.recordPlay);
  const useEnergy = useGameStore((state) => state.useEnergy);
  const completeGame = useGameStore((state) => state.completeGame);
  const activePetId = useGameStore((state) => state.pet.id);

  const handleStart = useCallback(() => {
    const status = canPlay(gameId);
    if (!status.allowed) {
      return;
    }

    // Deduct energy (unless free play)
    if (!status.isFree) {
      const ok = useEnergy(ENERGY_COST_PER_GAME);
      if (!ok) {
        return;
      }
    }

    setIsFree(status.isFree);
    recordPlay(gameId, status.isFree);
    setPhase('playing');
  }, [gameId, canPlay, useEnergy, recordPlay]);

  const handleGameEnd = useCallback((score: number) => {
    const petId = activePetId ?? 'munchlet';

    // Create result with rewards
    const gameResult = createMiniGameResult(gameId, score, petId);

    // Apply rewards via store
    completeGame(gameResult);

    setResult(gameResult);
    setPhase('results');
  }, [gameId, activePetId, completeGame]);

  const handleCollect = useCallback(() => {
    if (result) {
      onComplete(result);
    }
  }, [result, onComplete]);

  const handleBack = useCallback(() => {
    onQuit();
  }, [onQuit]);

  // Ready phase
  if (phase === 'ready') {
    const status = canPlay(gameId);
    return (
      <ReadyScreen
        gameId={gameId}
        isFree={status.isFree}
        energyCost={ENERGY_COST_PER_GAME}
        onStart={handleStart}
        onBack={handleBack}
      />
    );
  }

  // Results phase
  if (phase === 'results' && result) {
    return (
      <ResultsScreen
        result={result}
        onCollect={handleCollect}
        onBack={handleBack}
      />
    );
  }

  // Playing phase - render the game component with onGameEnd callback
  return React.cloneElement(children, {
    onGameEnd: handleGameEnd,
  });
}

export default MiniGameWrapper;
