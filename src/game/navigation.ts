// ============================================
// GRUNDY — NAVIGATION HELPERS
// App view model and navigation utilities
// ============================================

import type { AppView } from '../types';

// Default view on app load
export const DEFAULT_VIEW: AppView = 'home';

// Valid view checker
export function isValidView(view: string): view is AppView {
  return view === 'home' || view === 'games' || view === 'settings';
}

// Tab configuration for bottom navigation
export interface NavTab {
  id: AppView;
  label: string;
  icon: string;
}

export const NAV_TABS: NavTab[] = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'games', label: 'Games', icon: '🎮' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

// Get tab by ID
export function getTabById(id: AppView): NavTab | undefined {
  return NAV_TABS.find((tab) => tab.id === id);
}
