// ============================================
// GRUNDY — FTUE FLOW ORCHESTRATOR
// Bible §7 — Complete onboarding flow
// P4-FTUE-CORE: Full FTUE flow in UI
// ============================================

import React, { useEffect, useCallback } from 'react';
import { useGameStore } from '../game/store';
import type { FtueStep, PlayMode } from '../types';

// Screen components
import { FtueSplash } from './screens/FtueSplash';
import { FtueAgeGate } from './screens/FtueAgeGate';
import { FtueWorldIntro } from './screens/FtueWorldIntro';
import { FtuePetSelect } from './screens/FtuePetSelect';
import { FtueModeSelect } from './screens/FtueModeSelect';
import { FtueFirstSession } from './screens/FtueFirstSession';

// FTUE step sequence (Bible §7.2)
const FTUE_SEQUENCE: FtueStep[] = [
  'splash',
  'age_gate',
  'world_intro',
  'pet_select',
  'mode_select',
  'first_session',
  'complete',
];

export function FtueFlow() {
  const ftue = useGameStore((state) => state.ftue);
  const startFtue = useGameStore((state) => state.startFtue);
  const setFtueStep = useGameStore((state) => state.setFtueStep);
  const selectFtuePet = useGameStore((state) => state.selectFtuePet);
  const selectPlayMode = useGameStore((state) => state.selectPlayMode);
  const completeFtue = useGameStore((state) => state.completeFtue);

  // Initialize FTUE if not started
  useEffect(() => {
    if (!ftue.activeStep && !ftue.hasCompletedFtue) {
      startFtue();
    }
  }, [ftue.activeStep, ftue.hasCompletedFtue, startFtue]);

  // Advance to next step in sequence
  const advanceToNextStep = useCallback(() => {
    const currentIndex = FTUE_SEQUENCE.indexOf(ftue.activeStep || 'splash');
    const nextStep = FTUE_SEQUENCE[currentIndex + 1];
    if (nextStep && nextStep !== 'complete') {
      setFtueStep(nextStep);
    } else {
      completeFtue();
    }
  }, [ftue.activeStep, setFtueStep, completeFtue]);

  // Handle pet selection
  const handleSelectPet = useCallback(
    (petId: string) => {
      selectFtuePet(petId);
      setFtueStep('mode_select');
    },
    [selectFtuePet, setFtueStep]
  );

  // Handle mode selection
  const handleSelectMode = useCallback(
    (mode: PlayMode) => {
      selectPlayMode(mode);
      setFtueStep('first_session');
    },
    [selectPlayMode, setFtueStep]
  );

  // Handle FTUE completion
  const handleComplete = useCallback(() => {
    completeFtue();
  }, [completeFtue]);

  // Render current step
  const renderCurrentStep = () => {
    switch (ftue.activeStep) {
      case 'splash':
        return (
          <FtueSplash
            onContinue={() => setFtueStep('age_gate')}
          />
        );

      case 'age_gate':
        return (
          <FtueAgeGate
            onContinue={() => setFtueStep('world_intro')}
          />
        );

      case 'world_intro':
        return (
          <FtueWorldIntro
            onContinue={() => setFtueStep('pet_select')}
          />
        );

      case 'pet_select':
        return (
          <FtuePetSelect
            onSelectPet={handleSelectPet}
          />
        );

      case 'mode_select':
        return (
          <FtueModeSelect
            onSelectMode={handleSelectMode}
          />
        );

      case 'first_session':
        return (
          <FtueFirstSession
            petId={ftue.selectedPetId || 'munchlet'}
            onComplete={handleComplete}
          />
        );

      default:
        // Loading or transitioning
        return (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-b from-[#2D1B4E] to-[#1A1025]">
            <div className="text-white animate-pulse">Loading...</div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden">
      {renderCurrentStep()}
    </div>
  );
}
