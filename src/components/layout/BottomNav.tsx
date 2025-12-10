// ============================================
// GRUNDY — BOTTOM NAVIGATION BAR
// Tab navigation for home/games/settings
// P3-NAV-3
// ============================================

import React from 'react';
import type { AppView } from '../../types';
import { NAV_TABS } from '../../game/navigation';

interface BottomNavProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

export function BottomNav({ currentView, onChangeView }: BottomNavProps) {
  return (
    <nav className="h-16 bg-slate-950/90 border-t border-white/10 flex items-center justify-around safe-area-inset-bottom">
      {NAV_TABS.map((tab) => {
        const isActive = currentView === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChangeView(tab.id)}
            className={`flex flex-col items-center justify-center w-full h-full text-xs transition-all ${
              isActive ? 'text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span className={`text-xl mb-1 transition-transform ${isActive ? 'scale-110' : ''}`}>
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
