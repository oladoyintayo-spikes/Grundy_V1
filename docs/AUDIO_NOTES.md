# Grundy Audio System Notes

---
**Document Version:** 1.11
**Last Updated:** December 16, 2025
**Bible Alignment:** v1.11
**Status:** Current
---

**Task:** P5-AUDIO-CORE, P5-AUDIO-HOOKS, P5-AUDIO-DOC
**Phase:** Web Phase 5 — Polish / Web 1.0

---

## Overview

The Grundy audio system provides centralized sound effects (SFX) and background music (BGM) management. It is designed to:

- Fail gracefully in non-browser environments (tests, SSR)
- Respect user preferences for sound/music toggles
- Never block gameplay if audio fails to load or play

---

## Architecture

### Files

| File | Purpose |
|------|---------|
| `src/audio/types.ts` | Type definitions for SoundId, MusicTrackId, and configs |
| `src/audio/config.ts` | Sound and music configuration registry |
| `src/audio/audioManager.ts` | Central audio manager with play/stop controls |

### Audio Manager

The `audioManager` singleton handles:

- **SFX playback**: Fire-and-forget sound effects
- **BGM playback**: Looping background music with start/stop controls
- **Settings sync**: Respects `soundEnabled` and `musicEnabled` flags
- **Caching**: Reuses Audio elements for efficiency

---

## Configuration

### Sound Effects (SFX)

Edit `src/audio/config.ts` to add or modify sounds:

```typescript
export const SOUND_CONFIG: Record<SoundId, SoundConfig> = {
  ui_tap: { id: 'ui_tap', src: '/audio/ui_tap.mp3', volume: 0.4 },
  // ... add more
};
```

### Available Sound IDs

| ID | Description | Volume |
|----|-------------|--------|
| `ui_tap` | Generic button tap | 0.4 |
| `ui_confirm` | Primary action confirm | 0.5 |
| `ui_back` | Back/cancel action | 0.4 |
| `mini_bronze` | Mini-game bronze tier | 0.5 |
| `mini_silver` | Mini-game silver tier | 0.6 |
| `mini_gold` | Mini-game gold tier | 0.7 |
| `mini_rainbow` | Mini-game rainbow tier | 0.8 |
| `pet_happy` | Pet fed successfully | 0.5 |
| `pet_level_up` | Pet level up | 0.7 |

### Background Music

| ID | Description | Volume | Loop |
|----|-------------|--------|------|
| `bg_main` | Main background track | 0.35 | Yes |

---

## Events Wired

### UI Events

| Event | Sound | Location |
|-------|-------|----------|
| Tab change (bottom nav) | `ui_tap` | `BottomNav.tsx` |
| Mini-game selection | `ui_tap` | `MiniGameHub.tsx` |
| Play button | `ui_confirm` | `ReadyScreen.tsx` |
| Collect rewards | `ui_confirm` | `ResultsScreen.tsx` |
| Back/cancel | `ui_back` | `MiniGameHub.tsx`, `ReadyScreen.tsx`, `ResultsScreen.tsx` |

### Mini-Game Results

| Tier | Sound | Trigger |
|------|-------|---------|
| Bronze | `mini_bronze` | Results screen mount |
| Silver | `mini_silver` | Results screen mount |
| Gold | `mini_gold` | Results screen mount |
| Rainbow | `mini_rainbow` | Results screen mount |

### Pet Events

| Event | Sound | Location |
|-------|-------|----------|
| Feed success | `pet_happy` | `HomeView` handleFeed |
| Level up | `pet_level_up` | `HomeView` handleFeed |

### Background Music

| Event | Action |
|-------|--------|
| App mounts (post-FTUE) | Start `bg_main` if music enabled |
| Music setting toggled OFF | Stop music |
| Music setting toggled ON | Start music |
| App unmounts | Stop music |

---

## Settings

### Store State

```typescript
interface GameSettings {
  soundEnabled: boolean;  // Default: true
  musicEnabled: boolean;  // Default: true
  autoSave: boolean;      // Default: true
}
```

### Store Actions

- `setSoundEnabled(enabled: boolean)`: Toggle sound effects
- `setMusicEnabled(enabled: boolean)`: Toggle background music

Both actions:
1. Update the store state
2. Sync with the audio manager

### UI

Settings are accessible in the Settings view (`SettingsView`) with toggle buttons for:
- Sound Effects (🔊)
- Music (🎵)

Settings are persisted via Zustand's persist middleware.

---

## Limitations

1. **No actual audio files included** — Placeholder paths (`/audio/*.mp3`) are configured. Designers must provide actual audio assets.

2. **Test environment** — Audio playback is disabled in non-browser environments. The `isAudioEnvironment()` guard prevents errors.

3. **Not all events have sounds** — Only core UI and game events are wired. Additional sounds can be added by:
   - Adding new entries to `SOUND_CONFIG`
   - Adding corresponding type to `SoundId`
   - Calling `audioManager.playSound(id)` at the appropriate location

4. **No volume controls** — Volume is set per-sound in config. Global volume control is not implemented.

5. **Single music track** — Only one track (`bg_main`) plays at a time. Multiple concurrent tracks are not supported.

---

## Adding New Sounds

1. **Add the audio file** to `public/audio/`

2. **Add the type** in `src/audio/types.ts`:
   ```typescript
   export type SoundId =
     | 'ui_tap'
     // ... existing
     | 'my_new_sound';  // Add here
   ```

3. **Add the config** in `src/audio/config.ts`:
   ```typescript
   my_new_sound: {
     id: 'my_new_sound',
     src: '/audio/my_new_sound.mp3',
     volume: 0.5,
   },
   ```

4. **Use it** in your component:
   ```typescript
   import { audioManager } from '../audio/audioManager';
   audioManager.playSound('my_new_sound');
   ```

---

## Future Improvements

- **Volume slider**: Global volume control
- **Room-specific music**: Different tracks per room
- **Time-of-day ambience**: Morning/evening/night variations
- **Spatial audio**: Volume based on pet proximity
- **Sound packs**: Themed sound sets

---

*This file documents the P5-AUDIO-CORE implementation. See TASKS.md for task status.*

---
**Document Version:** 1.11 | **Bible Alignment:** v1.11 | **Updated:** December 16, 2025
