// ============================================
// GRUNDY — BOTTOM NAVIGATION BAR
// Tab navigation for home/games/settings
// P3-NAV-3, P5-AUDIO-HOOKS, P5-UX-KEYS, P5-A11Y-LABELS
// ============================================

import React from 'react';
import type { AppView } from '../../types';
import { NAV_TABS } from '../../game/navigation';
import { playUiTap } from '../../audio/audioManager';

// Focus ring classes for consistent keyboard navigation (P5-UX-KEYS)
const FOCUS_RING_CLASS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950';

interface BottomNavProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

export function BottomNav({ currentView, onChangeView }: BottomNavProps) {
  const handleTabClick = (tabId: AppView) => {
    if (tabId !== currentView) {
      playUiTap();
    }
    onChangeView(tabId);
  };

  return (
    <nav
      className="h-16 bg-slate-950/90 border-t border-white/10 flex items-center justify-around safe-area-inset-bottom"
      role="navigation"
      aria-label="Main navigation"
      data-testid="global-nav"
    >
      {NAV_TABS.map((tab) => {
        const isActive = currentView === tab.id;
        // Generate testid based on tab id (e.g., nav-home, nav-games, nav-settings)
        const testId = `nav-${tab.id}`;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabClick(tab.id)}
            aria-label={tab.label}
            aria-current={isActive ? 'page' : undefined}
            data-testid={testId}
            className={[
              'flex flex-col items-center justify-center w-full h-full text-xs transition-all rounded-lg',
              isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200',
              FOCUS_RING_CLASS,
            ].join(' ')}
          >
            <span
              className={`text-xl mb-1 transition-transform ${isActive ? 'scale-110' : ''}`}
              aria-hidden="true"
            >
              {tab.icon}
            </span>
            <span className={isActive ? 'font-medium' : ''}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNav;
