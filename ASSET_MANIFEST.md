# GRUNDY PET ART - ORGANIZED ASSETS
*Generated: December 2024*

> **Design SoT:** `docs/GRUNDY_MASTER_BIBLE.md` — This document is subordinate to the Bible.

## Summary
- **Total Images:** 120
- **Pets:** 8
- **Naming Convention:** `{pet}_{state}.png`

## Best Idle Picks (Primary Sprites)
| Pet | File | Description |
|-----|------|-------------|
| Munchlet 🟡 | `munchlet_idle.png` | Clean, simple smile |
| Grib 🟢 | `grib_idle.png` | Sassy fangs, fits personality |
| Plompo 🟣 | `plompo_idle.png` | Sleepy default (on-brand) |
| Fizz 🔵 | `fizz_idle.png` | Electric energy with lightning |
| Ember 🟠 | `ember_idle.png` | Proud flames, sparkle eyes |
| Chomper 🔴 | `chomper_idle.png` | Signature goofy grin |
| Whisp ⚪ | `whisp_idle.png` | Simple ethereal ghost |
| Luxe ✨ | `luxe_idle.png` | Elegant with crown |

## File Organization

### Munchlet (15 files)
- munchlet_idle.png ← PRIMARY
- munchlet_idle_02.png
- munchlet_idle_03.png
- munchlet_happy.png
- munchlet_excited.png (x3)
- munchlet_ecstatic.png
- munchlet_sad.png
- munchlet_crying.png
- munchlet_hungry.png
- munchlet_eating.png
- munchlet_eating_loved.png
- munchlet_satisfied.png
- munchlet_sleeping.png

### Grib (15 files)
- grib_idle.png ← PRIMARY
- grib_idle_02.png
- grib_happy.png
- grib_excited.png
- grib_ecstatic.png
- grib_curious.png
- grib_mischievous.png
- grib_annoyed.png
- grib_sad.png
- grib_crying.png
- grib_hungry.png
- grib_eating.png
- grib_eating_loved.png
- grib_satisfied.png
- grib_sleeping.png

### Plompo (15 files)
- plompo_idle.png ← PRIMARY
- plompo_idle_02.png
- plompo_idle_03.png
- plompo_baby.png ← BABY EVOLUTION
- plompo_happy.png
- plompo_excited.png
- plompo_ecstatic.png
- plompo_sleepy.png
- plompo_sad.png
- plompo_crying.png
- plompo_hungry.png
- plompo_eating.png
- plompo_eating_loved.png
- plompo_satisfied.png
- plompo_sleeping.png

### Fizz (15 files)
- fizz_idle.png ← PRIMARY
- fizz_idle_02.png
- fizz_idle_03.png
- fizz_happy.png
- fizz_excited.png
- fizz_ecstatic.png
- fizz_charged.png
- fizz_shock.png
- fizz_sad.png
- fizz_crying.png
- fizz_hungry.png
- fizz_eating.png
- fizz_eating_loved.png
- fizz_satisfied.png
- fizz_sleeping.png

### Ember (15 files)
- ember_idle.png ← PRIMARY
- ember_idle_02.png
- ember_idle_03.png
- ember_happy.png
- ember_excited.png
- ember_ecstatic.png
- ember_fierce.png
- ember_flaming.png
- ember_sad.png
- ember_crying.png
- ember_hungry.png
- ember_eating.png
- ember_eating_loved.png
- ember_satisfied.png
- ember_sleeping.png

### Chomper (16 files)
- chomper_idle.png ← PRIMARY
- chomper_idle_02.png
- chomper_idle_03.png
- chomper_idle_04.png
- chomper_happy.png
- chomper_excited.png
- chomper_ecstatic.png
- chomper_drool.png
- chomper_nervous.png
- chomper_sad.png
- chomper_crying.png
- chomper_hungry.png
- chomper_eating.png
- chomper_eating_loved.png
- chomper_satisfied.png
- chomper_sleeping.png

### Whisp (14 files)
- whisp_idle.png ← PRIMARY
- whisp_idle_02.png
- whisp_idle_03.png
- whisp_idle_04.png
- whisp_happy.png
- whisp_excited.png (x2)
- whisp_ecstatic.png
- whisp_sad.png
- whisp_hungry.png
- whisp_eating_loved.png (x2)
- whisp_satisfied.png
- whisp_sleeping.png

### Luxe (15 files)
- luxe_idle.png ← PRIMARY
- luxe_idle_02.png
- luxe_happy.png
- luxe_excited.png
- luxe_ecstatic.png
- luxe_regal.png
- luxe_fancy.png
- luxe_sparkle.png
- luxe_sad.png
- luxe_crying.png
- luxe_hungry.png
- luxe_eating.png
- luxe_eating_loved.png
- luxe_satisfied.png
- luxe_sleeping.png

## Unity Import Notes
1. Import all PNGs with transparency
2. Set texture type to "Sprite (2D and UI)"
3. Use PRIMARY idle sprites for default state
4. Map states to game events (hungry→show hungry sprite, etc.)

## State Mapping for Game Logic
```
idle → default display
happy → after positive interaction
excited → minigame start/win
ecstatic → eating loved food
satisfied → post-feeding
hungry → hunger stat low
sad → mood stat low
crying → neglected state
sleeping → sleep time
eating → during feeding animation
eating_loved → feeding favorite food
```
