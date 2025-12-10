// ============================================
// GRUNDY — NAVIGATION MODEL TESTS
// Pure logic tests for navigation helpers
// P3-NAV
// ============================================

import { describe, it, expect } from 'vitest';
import { DEFAULT_VIEW, isValidView, NAV_TABS, getTabById } from '../game/navigation';
import type { AppView } from '../types';

describe('navigation model', () => {
  describe('DEFAULT_VIEW', () => {
    it('uses home as default view', () => {
      expect(DEFAULT_VIEW).toBe('home');
    });
  });

  describe('isValidView', () => {
    it('accepts home as valid view', () => {
      expect(isValidView('home')).toBe(true);
    });

    it('accepts games as valid view', () => {
      expect(isValidView('games')).toBe(true);
    });

    it('accepts settings as valid view', () => {
      expect(isValidView('settings')).toBe(true);
    });

    it('rejects unknown view names', () => {
      expect(isValidView('food')).toBe(false);
      expect(isValidView('whatever')).toBe(false);
      expect(isValidView('shop')).toBe(false);
      expect(isValidView('')).toBe(false);
    });

    it('is case-sensitive', () => {
      expect(isValidView('Home')).toBe(false);
      expect(isValidView('GAMES')).toBe(false);
      expect(isValidView('Settings')).toBe(false);
    });
  });

  describe('NAV_TABS', () => {
    it('has exactly 3 tabs', () => {
      expect(NAV_TABS).toHaveLength(3);
    });

    it('contains home tab', () => {
      const homeTab = NAV_TABS.find((tab) => tab.id === 'home');
      expect(homeTab).toBeDefined();
      expect(homeTab?.label).toBe('Home');
      expect(homeTab?.icon).toBe('🏠');
    });

    it('contains games tab', () => {
      const gamesTab = NAV_TABS.find((tab) => tab.id === 'games');
      expect(gamesTab).toBeDefined();
      expect(gamesTab?.label).toBe('Games');
      expect(gamesTab?.icon).toBe('🎮');
    });

    it('contains settings tab', () => {
      const settingsTab = NAV_TABS.find((tab) => tab.id === 'settings');
      expect(settingsTab).toBeDefined();
      expect(settingsTab?.label).toBe('Settings');
      expect(settingsTab?.icon).toBe('⚙️');
    });

    it('tabs are in correct order (home, games, settings)', () => {
      expect(NAV_TABS[0].id).toBe('home');
      expect(NAV_TABS[1].id).toBe('games');
      expect(NAV_TABS[2].id).toBe('settings');
    });

    it('all tabs have required properties', () => {
      NAV_TABS.forEach((tab) => {
        expect(tab).toHaveProperty('id');
        expect(tab).toHaveProperty('label');
        expect(tab).toHaveProperty('icon');
        expect(typeof tab.id).toBe('string');
        expect(typeof tab.label).toBe('string');
        expect(typeof tab.icon).toBe('string');
      });
    });
  });

  describe('getTabById', () => {
    it('returns home tab when given home', () => {
      const tab = getTabById('home');
      expect(tab).toBeDefined();
      expect(tab?.id).toBe('home');
    });

    it('returns games tab when given games', () => {
      const tab = getTabById('games');
      expect(tab).toBeDefined();
      expect(tab?.id).toBe('games');
    });

    it('returns settings tab when given settings', () => {
      const tab = getTabById('settings');
      expect(tab).toBeDefined();
      expect(tab?.id).toBe('settings');
    });

    it('returns undefined for invalid ids', () => {
      // We need to cast to AppView to test this edge case
      // In practice, TypeScript would prevent this at compile time
      const tab = getTabById('invalid' as AppView);
      expect(tab).toBeUndefined();
    });
  });
});

describe('AppView type coverage', () => {
  it('all valid views are covered by NAV_TABS', () => {
    const validViews: AppView[] = ['home', 'games', 'settings'];
    const tabIds = NAV_TABS.map((tab) => tab.id);

    validViews.forEach((view) => {
      expect(tabIds).toContain(view);
    });
  });

  it('DEFAULT_VIEW is a valid view', () => {
    expect(isValidView(DEFAULT_VIEW)).toBe(true);
  });
});
