# GRUNDY — MASTER BIBLE
## Single Source of Truth

**Version:** 1.4
**Last Updated:** December 2024
**Status:** Production Reference
**Platforms:** Web (First Light 1.0) [Current], Android/iOS [Unity Later]
**Engine:** Web (Vite + React + TypeScript) [Current], Unity 2022 LTS [Planned Mobile]

**Changelog:**
- v1.4: Bible Compliance Update — Added platform phase tags (§1.6), navigation structure (§14.5), mobile layout constraints (§14.6), expanded cooldown spec (§4.3), dev HUD exception (§4.4), locked mini-game rules (§8.2-8.3), evolution thresholds locked (§6.1), FTUE fallback (§7.4), art vs emoji rule (§13.7), updated prototype gaps (§15.6)
- v1.3: Added authority statement, web prototype mapping (15.6), and related documents index (16.5)
- v1.2: Added Section 13.6 (Asset Manifest & State System) with stat-to-art mapping, state resolution logic, and ASSET_MANIFEST.md reference
- v1.1: Expanded Section 11 (Economy & Monetization) with complete shop catalog, pet slots, inventory slots, Grundy Plus benefits, season pass structure, advertising specs, and data schemas

> ⚠️ **AUTHORITY STATEMENT**
> 
> **If any other document conflicts with this one, GRUNDY_MASTER_BIBLE.md wins.**
> 
> This document is the canonical source of truth for all Grundy game design, systems, and specifications. Older documents (lore drafts, onboarding scripts, previous GDDs) may contain outdated information. When in doubt, defer to this Bible.

---

## TABLE OF CONTENTS

1. [Vision & Identity](#1-vision--identity)
    - 1.6 Platform & Phase Tags
2. [The World (Lore)](#2-the-world-lore)
3. [The 8 Pets (Complete Profiles)](#3-the-8-pets-complete-profiles)
4. [Core Systems](#4-core-systems)
5. [Food & Feeding](#5-food--feeding)
6. [Progression & Unlocks](#6-progression--unlocks)
7. [Onboarding Flow](#7-onboarding-flow)
8. [Mini-Games](#8-mini-games)
9. [Cozy vs Classic Mode](#9-cozy-vs-classic-mode)
10. [Events & LiveOps](#10-events--liveops)
11. [Economy & Monetization](#11-economy--monetization)
    - 11.1 Currency Types
    - 11.2 Revenue Strategy
    - 11.3 Monetization Model
    - 11.4 Gem Economy
    - 11.5 The Shop (Complete)
    - 11.6 Pet Slots
    - 11.7 Inventory Slots
    - 11.8 Grundy Plus (Subscription)
    - 11.9 Season Pass [Unity Later]
    - 11.10 Advertising [Unity Later]
    - 11.11 Bundles & Starter Packs
    - 11.12 Economy Data Schema
12. [Sound & Vibration](#12-sound--vibration)
13. [Animation & Visuals](#13-animation--visuals)
    - 13.6 Asset Manifest & State System
    - 13.7 Production Art Rule
14. [UI/UX Design](#14-uiux-design)
    - 14.5 Navigation Structure
    - 14.6 Mobile Layout Constraints
15. [Technical Specs](#15-technical-specs)
    - 15.6 Web Prototype Mapping
16. [Coverage Notes](#16-coverage-notes)
    - 16.5 Related Documents

---

# 1. VISION & IDENTITY

## 1.1 Game Overview

Grundy is a cozy virtual-pet feeding game focused on short-session play, expressive pet personalities, fun reactions, and cosmetic progression. Players feed, craft, customize, and nurture their Grundy, unlocking foods, cosmetics, and environments as they grow.

| Attribute | Value |
|-----------|-------|
| **Genre** | Virtual Pet / Casual |
| **Target Audience** | Casual players (age 10+, mobile-friendly) |
| **Session Length** | 1–5 minutes |
| **Tone** | Light, warm, playful, slightly mischievous |
| **Monetization** | Cosmetic-first, player-friendly, ethical |

## 1.2 The Promise

> *"A creature that knows you, surprises you, and grows with you. Play when you want. Your Grundy will be there — genuinely happy to see you."*

## 1.3 Core Pillars

1. **Feed → React → Grow** — Every interaction has visible feedback
2. **Strong Pet Personality** — Each pet has unique preferences and reactions
3. **Short Relaxing Sessions** — Designed for mobile micro-moments
4. **Delight Through Discovery** — Unlock new foods, cosmetics, and reactions
5. **No Punishment, All Comfort** — Positive reinforcement only (Cozy Mode default)

## 1.4 Design Philosophy

| Pillar | Meaning |
|--------|---------|
| **Personality over stats** | The pet's character matters more than numbers |
| **Discovery over completion** | Finding things is more fun than checking boxes |
| **Rhythm over grind** | Play in comfortable patterns, not forced loops |

## 1.5 The Aesthetic

**"Cozy Dark"** — Deep purple backgrounds, warm amber accents, evening warmth. Soft, whimsical, approachable. Zero aggression, zero harsh noise.

## 1.6 Platform & Phase Tags

This Bible describes the **full Grundy design**. Not all features are implemented in every build.

### Tag Definitions

| Tag | Meaning |
|-----|---------|
| **[Web 1.0]** | Implemented in Web Edition 1.0 "First Light" |
| **[Web Phase 6+]** | Design locked, targeted for Web Phase 6 or later |
| **[Unity Later]** | Reserved for Unity/mobile builds |
| **[Future]** | Designed but not yet scheduled |

### How to Read Tagged Sections

When a section or feature includes a tag:

```
## 9.4 Classic Mode Specifics [Web Phase 6+]
```

This means:
- The **design is final** (do not change without approval)
- The **implementation is not yet in Web 1.0**
- It is **targeted for Phase 6 or later**

### Current Implementation Status

| Section | Tag | Status |
|---------|-----|--------|
| §4.3 Cooldown System | [Web Phase 6+] | Not yet implemented |
| §4.4 Fullness States | [Web Phase 6+] | Not yet implemented |
| §9.4 Classic Mode (full) | [Web Phase 6+] | Mode select exists; consequences partial |
| §14.4 Rooms (activity-based) | [Web Phase 6+] | Time-of-day only in Web 1.0 |
| §14.5 Navigation Structure | [Web Phase 6+] | Pet tabs visible; needs menu-based |
| §8 Mini-Games | [Web 1.0] | 5 games implemented |
| §11.9 Season Pass | [Unity Later] | Not in Web |
| §11.10 Rewarded Ads | [Unity Later] | Not in Web |

> **Maintenance Note:** Update these tags as implementations land. The goal is to keep the Bible honest about what exists vs. what's designed.

---

# 2. THE WORLD (Lore)

## 2.1 On the Nature of Grundies

*From the journal of an unnamed naturalist, water-damaged, date unknown:*

> They are not born. They do not hatch. They simply *are*, suddenly, in places where a feeling was strong enough to leave something behind.
>
> I have spent years trying to understand their origins. The closest I can describe: imagine an emotion so pure it forgets to disappear. Joy. Hunger. Peace. Chaos. The feeling passes — but something small remains.
>
> That something opens its eyes.

---

> *"Where do they come from?"*
> *"From the moments we forget to hold onto."*
> — Common folk saying, origin unknown

## 2.2 How Grundies Choose Their Person

They don't explain. They just know. Something in the home calls to them — a need that matches what they can give.

*From a lecture, transcribed poorly:*

> You don't find a Grundy. A Grundy finds you. The question isn't "how do I get one?" The question is "am I ready for one to arrive?"

## 2.3 Can You Have Multiple Grundies?

Yes, but each one remembers being chosen. They don't compete — they coexist.

*Field note:*

> Observed household with three spirits (Munchlet, Grib, Plompo). No territorial behavior. Munchlet seemed pleased by company. Grib occasionally hid Plompo's favorite sleeping spot. Plompo did not notice for three days.

## 2.4 What Happens If Neglected

A Grundy won't die — that's not how spirits work. But they'll fade, grow distant, and eventually leave to find somewhere else. They can be called back with genuine care... but they remember.

*Warning found in margins of the Codex:*

> They forgive. They always forgive.
>
> But they don't forget.
>
> The bond, once broken, takes twice as long to rebuild.

## 2.5 Do They Age?

They evolve, but they don't age the way living things do. A Grundy is as old as the moment that made them, and that moment is eternal.

> A Grundy at Stage 1 is not "younger" than a Grundy at Stage 3. They are simply... less expressed. Evolution is not growth — it is *becoming more themselves*.

## 2.6 The Central Mystery

*Final page of the Codex, handwriting increasingly unsteady:*

> I have studied them for years now.
>
> I understand their categories. Their preferences. Their behaviors.
>
> But the central question remains:
>
> **Why do they choose us?**
>
> They don't need us. Not really. They're spirits — they persist regardless.
>
> And yet they stay. They wait on windowsills. They drift through dream-cracks. They emerge from dying fires.
>
> They find homes that need them.
>
> Or perhaps — homes that they need.

---

# 3. THE 8 PETS (Complete Profiles)

## 3.1 Pet Summary Table

| Pet | Type | Rarity | Forms From | Core Trait | Secret Pain |
|-----|------|--------|------------|------------|-------------|
| Munchlet 🟡 | Hearthspirit | Common | Sustained comfort | Warmth | Fear of abandonment |
| Grib 🟢 | Shadowspirit | Uncommon | Joyful chaos | Mischief | Needs to be chosen |
| Plompo 🟣 | Cloudspirit | Common | Perfect rest | Peace | Dreams of elsewhere |
| Fizz 🔵 | Stormspirit | Uncommon | Peak anticipation | Energy | Fear of stopping |
| Ember 🟠 | Flamespirit | Rare | Refusal to die | Pride | Memory of smallness |
| Chomper 🔴 | Appetitespirit | Common | Simple appetite | Hunger | None (pure) |
| Whisp ⚪ | Dreamspirit | Rare | Liminal space | Mystery | Between worlds |
| Luxe ✨ | Unknown | Rare | Appreciation of quality | Refinement | Constructed identity |

## 3.2 Pet Unlock & Abilities Table

| Pet | Emoji | Color | Unlock | Gem Skip | Hunger Decay | Special Ability |
|-----|-------|-------|--------|----------|--------------|-----------------|
| Munchlet | 🟡 | #fbbf24 | Starter | — | 1.0× Medium | +10% bond growth |
| Grib | 🟢 | #4ade80 | Starter | — | 1.25× Fast | -20% mood penalty from dislikes |
| Plompo | 🟣 | #a78bfa | Starter | — | 0.75× Slow | -20% mood decay rate |
| Fizz | 🔵 | #3b82f6 | Level 10 | 50 💎 | 1.5× Very Fast | +25% mini-game rewards |
| Ember | 🟠 | #f97316 | Level 15 | 100 💎 | 1.25× Fast | 2× coins from spicy foods |
| Chomper | 🔴 | #ef4444 | Level 20 | 150 💎 | 2.0× Fastest | No disliked foods (all neutral+) |
| Whisp | ⚪ | #e2e8f0 | Level 25 | 200 💎 | 0.5× Slowest | +50% XP from rare/epic foods |
| Luxe | ✨ | gradient gold→purple | Level 30 | 300 💎 | 1.0× Medium | +100% gem drops |

---

## 🟡 MUNCHLET — The Friendly One

**Classification:** Hearthspirit, Common  
**First Documented:** Sunny windowsills, kitchen corners, warm places

### Origin Story

*From a child's letter, found pressed in a cookbook:*

> There was something on the windowsill today. Yellow like butter. It was humming even though it has no mouth for humming. Mama says I can keep it.

### Formation

Munchlets crystallize from **sustained comfort** — not a single moment, but accumulated warmth. They are more common in homes with regular meals eaten together, sunlight through south-facing windows, and the smell of baking. They appear to *wait* before revealing themselves. Patience is fundamental to their nature.

### Observed Behaviors
- Hums at frequencies that induce calm in nearby humans
- Physically dims when isolated for extended periods
- Cannot regulate internal temperature; seeks external warmth
- Follows movement with entire body, not just eyes

### The Waiting

*Handwritten addendum, different ink:*

> I asked one how long it had waited on that windowsill before the family noticed.
>
> It didn't answer. They never do.
>
> But something in its eyes suggested: *longer than I want to remember.*

### Origin Snippet (In-Game)
> Found on a sunny windowsill, humming.
> Waiting for someone to share warmth with.

### Preferences

| Attribute | Value |
|-----------|-------|
| **Personality** | Cheerful, bright, expressive |
| **Likes** | Sweets, Fruits |
| **Dislikes** | Spicy |
| **Drawn To** | Sweetness, Company, Warmth |
| **Repelled By** | Solitude, Cold, Spice |

### Secret (Bond Level 50)
> Munchlet remembers being alone before you found them. They don't talk about it, but it's why they light up so bright when you come back.

### Silhouette & Vibe
```
     ╭─────╮
    ╱       ╲
   │  ◕   ◕  │
   │    ◡    │
    ╲       ╱
     ╰─────╯
```
Shape: Circle/oval, soft edges. Big round eyes, simple smile. Approachable, cheerful.

### Captions
| Context | Examples |
|---------|----------|
| Idle | "Munchlet wiggles happily!", "Munchlet looks at you expectantly..." |
| Positive | "Yum! That was perfect!", "Munchlet loved that!" |
| Negative | "Munchlet's face scrunches up...", "Too spicy!" |

### Pet-Specific Animations
| State | Unique Behavior |
|-------|-----------------|
| Idle | Curious head tilts, looks around |
| Happy | Claps hands/arms, big smile |
| Loved | Does a little dance |
| Eating | Savors food, licks lips |

---

## 🟢 GRIB — The Mischievous One

**Classification:** Shadowspirit, Uncommon  
**First Documented:** Cupboard corners, beneath stairs, places adults forget to look

### Origin Story

*Incident report, municipal archive:*

> Homeowner reported "something grinning" in the pantry. Investigation found no intruder. Suggested drafty window causing imagination.
>
> [Marginal note in red: *They never find them when they look. Gribs only appear when they want to.*]

### Formation

Unlike comfort-spirits, Gribs emerge from **disorder with joy** — specifically, the moment when something goes wrong and everyone laughs anyway. A dropped cake at a birthday party. A spectacular failed prank. The crash that precedes relief.

The chaos must be *harmless*. Gribs do not form from true disaster — only from delightful mischief.

### Observed Behaviors
- Relocates small objects; returns them days later
- Emits clicking vocalization ("kekeke") when amused
- Demonstrates preference for elevated vantage points
- Maintains eye contact longer than comfortable

### The Choosing

*Personal correspondence, heavily redacted:*

> People think Gribs are random. That they appear anywhere shadows gather.
>
> They're wrong.
>
> Gribs *watch first*. Sometimes for weeks. They're selecting someone who can handle them. Someone who won't break when things get interesting.
>
> If a Grib chose you — you passed a test you didn't know you were taking.

### Origin Snippet (In-Game)
> Appeared in a shadow behind the cupboard, grinning.
> Not telling how.

### Preferences

| Attribute | Value |
|-----------|-------|
| **Personality** | Mischievous, bold |
| **Likes** | Spicy, Exotic |
| **Dislikes** | Sweets |
| **Drawn To** | Chaos, Spice, Reactions |
| **Repelled By** | Boredom, Predictability, Sweetness |

### Secret (Bond Level 50)
> Grib chose you specifically. They watched from the shadows for a while first. You seemed like someone who could handle a little chaos.

### Silhouette & Vibe
```
       ╱╲
      ╱  ╲
     ╱ ◕◕ ╲
    │  ──  │
     ╲ ▽  ╱
      ╲  ╱
       ╲╱
```
Shape: Diamond/triangle-ish. Sharp angles, sly eyes, fanged grin. Troublemaker, sneaky.

### Captions
| Context | Examples |
|---------|----------|
| Idle | "Grib's eyes dart around...", "Grib snickers quietly" |
| Positive | "Kekeke! More!", "Grib cackles with delight!" |
| Negative | "Grib makes a face...", "Too sweet!" |

### Pet-Specific Animations
| State | Unique Behavior |
|-------|-----------------|
| Idle | Shifty eyes, plotting expression |
| Happy | Mischievous laugh, rubbing hands |
| Loved | Evil cackle pose |
| Eating | Sneaky bite, looks around |

---

## 🟣 PLOMPO — The Sleepy One

**Classification:** Cloudspirit, Common  
**First Documented:** Low-hanging clouds, foggy mornings, recently-vacated warm beds

### Origin Story

*Weather observation log, coastal station:*

> 0600 — Unusual low cloud formation against eastern window.
> 0615 — Cloud appears to contain... something. Purple. Sleeping.
> 0700 — Cloud dissipated. Creature remains. Still sleeping.
> 0900 — Still sleeping.

### Formation

Plompos condense from **perfect rest** — the weighted warmth before sleep, the reluctance to wake, the sacred laziness of a day with no demands. They are, in essence, naps given form.

It is unclear if they are always sleeping or simply always *appear* to be sleeping. Research inconclusive; subjects fell asleep during observation.

### Observed Behaviors
- Terminal velocity significantly lower than expected for mass
- Can sleep in any position, on any surface
- Responds to stimuli on significant delay (2-4 seconds)
- Emits soft vocalizations ("mrrrp") when disturbed

### The Other Place

*Dream journal, anonymous, found in used bookstore:*

> My Plompo mumbles in its sleep. I used to think it was nonsense.
>
> Then I heard it clearly: *"Two moons tonight."*
>
> We only have one moon.
>
> Where do they go when they dream?

### Origin Snippet (In-Game)
> Discovered sleeping in a cloud that drifted too low.
> Went back to sleep.

### Preferences

| Attribute | Value |
|-----------|-------|
| **Personality** | Sleepy, soft, slow |
| **Likes** | Sweets, Gooey foods |
| **Dislikes** | Crunchy/bitter |
| **Drawn To** | Rest, Softness, Quiet |
| **Repelled By** | Haste, Noise, Rough textures |

### Secret (Bond Level 50)
> Plompo dreams vividly and sometimes mumbles about places they've seen — clouds shaped like castles, skies with two moons. They've been somewhere else, once.

### Silhouette & Vibe
```
   ╭───────────╮
  ╱             ╲
 │   ◡     ◡     │
 │      ◡        │
  ╲             ╱
   ╰───────────╯
```
Shape: Wide oval, blob-like. Half-closed eyes, droopy. Lazy, cuddly, slow.

### Captions
| Context | Examples |
|---------|----------|
| Idle | "Plompo yawns...", "Plompo dozes off..." |
| Positive | "That was... worth waking up for...", "*content sigh*" |
| Negative | "Too crunchy...", "Plompo winces" |

### Pet-Specific Animations
| State | Unique Behavior |
|-------|-----------------|
| Idle | Nearly falling asleep, catches self |
| Happy | Sleepy smile, slow wave |
| Loved | Brief energy, then yawn |
| Eating | Slow savoring bites, eyes closed |

---

## 🔵 FIZZ — The Electric One

**Classification:** Stormspirit, Uncommon  
**First Documented:** During electrical storms, near charged equipment, at moments of peak anticipation  
**Unlock:** Level 10 OR 50 💎

### Origin Story

*Emergency services transcript:*

> CALLER: There's something in my living room. It appeared during the lightning.
> DISPATCH: Can you describe it?
> CALLER: Blue. Spiky. It won't stop *moving*.
> DISPATCH: Is it aggressive?
> CALLER: No, it's just — it's so *excited*. About everything. It's exhausting to watch.

### Formation

Fizzes spark into existence at the **peak of anticipation** — not the event itself, but the moment before. The held breath. The crackle of "something's about to happen."

They are literally made of excitement. This explains their inability to remain still. Stillness is antithetical to their composition.

### Observed Behaviors
- Generates measurable static discharge when stimulated
- Vibration frequency correlates with emotional state
- Cannot maintain focus on single subject beyond 10 seconds
- Demonstrates visible distress when required to wait

### The Fear

*Personal journal, stained with what appears to be tears:*

> I finally understood my Fizz today.
>
> It's not just energetic. It's *afraid*.
>
> Afraid of stopping. Afraid that if it slows down, even for a moment, the spark will go out and it won't come back.
>
> So it burns and burns and burns. Just in case.

### Origin Snippet (In-Game)
> Sparked into existence during a thunderstorm.
> Hasn't stopped vibrating.

### Preferences

| Attribute | Value |
|-----------|-------|
| **Personality** | Hyper, bubbly, can't sit still |
| **Likes** | Sour, Fizzy, Cold |
| **Dislikes** | Bland, Dry |
| **Drawn To** | Excitement, Action, Stimulation |
| **Repelled By** | Waiting, Stillness, Quiet |

### Secret (Bond Level 50)
> Fizz is afraid of running out of energy. Not in a game-stat way — they're scared that one day the spark will just... stop. So they burn bright while they can.

### Silhouette & Vibe
```
      ⚡ ⚡
     ╱ ◉◉ ╲
    │ ~~~~ │
     ╲    ╱
      ╲  ╱
       ⚡
```
Shape: Jagged edges, sparks. Small, wide eyes, zigzag outline. Can't sit still, electric.

### Captions
| Context | Examples |
|---------|----------|
| Idle | "Fizz bounces off the walls!", "Fizz vibrates with energy!", "Can't. Stop. Moving!" |
| Positive | "WOOOOO!", "Fizz explodes with joy!", "MORE MORE MORE!" |
| Negative | "Fizz deflates...", "Too boring!", "Fizz fizzles out..." |

### Pet-Specific Animations
| State | Unique Behavior |
|-------|-----------------|
| Idle | Vibrating, sparks flying, can't stop moving |
| Happy | Bouncing off walls animation |
| Loved | Explosion of energy, zaps everywhere |
| Eating | Speed eating, zoom zoom |

### Design Notes
High maintenance (fast hunger) but rewards active players with better mini-game payouts. Appeals to engaged players who play frequently.

---

## 🟠 EMBER — The Proud One

**Classification:** Flamespirit, Rare  
**First Documented:** Dying fires, ceremonial flames, anywhere fire fights to survive  
**Unlock:** Level 15 OR 100 💎

### Origin Story

*Recovered from a burned journal, only page intact:*

> The fire was almost out. One coal left, barely glowing.
>
> I went to add kindling — but something in the ember *looked at me*.
>
> It refused to go dark. Out of spite, I think.
>
> Now it lives in my home and expects to be admired.

### Formation

Embers do not form from fire itself — fire is common and dies easily. Embers form from **the refusal to die**. The last coal. The spark that should have failed but didn't. The stubborn insistence on existing when extinction was certain.

This explains their temperament. They have already survived the end once. They will never be small again.

### Observed Behaviors
- Flame-crown intensity correlates directly with mood
- Requires acknowledgment upon entering spaces
- Physically warmer to the touch when pleased
- Refuses sustenance deemed "beneath standards"

### The Memory

*Fragment, found in fireplace ashes, partly burned:*

> Never ask an Ember about before.
>
> Before, they were almost nothing. A spark. A moment from disappearing.
>
> They built themselves from that nothing into something that demands to be seen.
>
> The pride isn't arrogance.
>
> It's armor.

### Origin Snippet (In-Game)
> Emerged from the last ember of a dying fire.
> Refuses to be ignored.

### Preferences

| Attribute | Value |
|-----------|-------|
| **Personality** | Fierce, proud, dramatic |
| **Likes** | Spicy, Hot, Smoky |
| **Dislikes** | Sweet, Cold |
| **Drawn To** | Attention, Quality, Recognition |
| **Repelled By** | Being ignored, Mediocrity, Cold |

### Secret (Bond Level 50)
> Ember was almost nothing once. A spark that nearly went out. They'll never be that small again — but they remember how it felt.

### Silhouette & Vibe
```
       🔥
      ╱╲
     ╱◕◕╲
    │ ── │
     ╲△╱
```
Shape: Flame silhouette. Fierce eyes, confident stance. Dramatic, proud.

### Captions
| Context | Examples |
|---------|----------|
| Idle | "Ember smolders intensely.", "Ember strikes a pose.", "Ember waits... dramatically." |
| Positive | "Ember ROARS approval!", "NOW we're cooking!", "FIRE! 🔥" |
| Negative | "Ember scoffs.", "Pathetic.", "Ember turns away in disgust." |

### Pet-Specific Animations
| State | Unique Behavior |
|-------|-----------------|
| Idle | Dramatic poses, flames flicker |
| Happy | Triumphant roar pose |
| Loved | Fire burst, phoenix-like spread |
| Eating | Critical evaluation, then approval |

### Design Notes
Spicy food specialist — pairs well with Grib's inventory. Coin multiplier rewards strategic feeding. Appeals to players who stockpile spicy foods.

---

## 🔴 CHOMPER — The Hungry One

**Classification:** Appetitespirit, Common  
**First Documented:** Kitchens, dining rooms, anywhere food is prepared or consumed  
**Unlock:** Level 20 OR 150 💎

### Origin Story

*Domestic incident report:*

> Subject appeared at kitchen threshold approximately 1800 hours, coinciding with dinner preparation. Made no hostile movements. Made no movements at all except *looking at the food*.
>
> Has not left since. (Three weeks.)
>
> Is this an infestation? Please advise.

### Formation

The Chomper is perhaps the purest manifestation documented. It forms from **uncomplicated appetite** — not greed, not desperation, simply the joy of eating and the anticipation of meals.

Researchers initially theorized complex motivations. Further study confirmed: it really is just about food.

### Observed Behaviors
- Responds to food-related sounds from significant distances
- Lacks documented food aversions (unique among all varieties)
- Produces notable gastric vocalizations regardless of satiation state
- Occasionally attempts consumption of non-food items (correctable)

### The Simplicity

*Personal reflection, found in recipe book margins:*

> Everyone overcomplicates Chomper.
>
> "What does it want?" Food.
> "What does it fear?" Not-food.
> "What makes it happy?" Being full.
>
> There's something beautiful about a creature that knows exactly what it wants and feels no shame in wanting it.
>
> We should all be so honest.

### Origin Snippet (In-Game)
> First spotted near the kitchen, following the smell of dinner.
> Loves food. Hates... just loves food.

### Preferences

| Attribute | Value |
|-----------|-------|
| **Personality** | Hungry, goofy, always eating |
| **Likes** | EVERYTHING |
| **Dislikes** | **None** |
| **Drawn To** | Food |
| **Repelled By** | *(See "Drawn To")* |

### Secret (Bond Level 50)
> Chomper can technically survive without eating as much as they do. They're just happiest when full, and they've decided to optimize for happiness.

### Silhouette & Vibe
```
    ╭─────╮
   ╱ ◕   ◕ ╲
  │ ═══════ │
  │ ▀▀▀▀▀▀▀ │
   ╲       ╱
    ╰─────╯
```
Shape: Round with HUGE mouth. Tiny eyes, massive jaw. Hungry, goofy.

### Captions
| Context | Examples |
|---------|----------|
| Idle | "Chomper's tummy rumbles...", "Food? FOOD?!", "Chomper drools..." |
| Positive | "CHOMP CHOMP CHOMP!", "Chomper inhales it!", "NOM NOM NOM!" |
| Neutral | "Chomper eats it anyway.", "Food is food!", "More?" |
| Negative | *(Never triggers — no dislikes)* |

### Pet-Specific Animations
| State | Unique Behavior |
|-------|-----------------|
| Idle | Drooling, eyes tracking food |
| Happy | Mouth opens impossibly wide |
| Loved | Inhales food, doesn't chew |
| Eating | CHOMP CHOMP, food gone instantly |

### Design Notes
No penalties for wrong food, but burns through inventory fast. Great for players with lots of food stockpiled. Relaxing gameplay with no negative reactions.

---

## ⚪ WHISP — The Mysterious One

**Classification:** Dreamspirit, Rare  
**First Documented:** Liminal spaces, twilight hours, beside sleeping humans  
**Unlock:** Level 25 OR 200 💎

### Origin Story

*Sleep study notes, patient 7:*

> Patient reported waking to find entity at bedside. Translucent. White. Patient initially believed still dreaming.
>
> Entity remained after patient confirmed wakefulness.
>
> Entity appeared "confused about which side of the dream it was on."

### Formation

Whisps emerge from **the space between** — not from sleep and not from waking, but from the membrane that separates them. The moment when you cannot be certain which world you're in.

They are partially *here* and partially *elsewhere*. Where "elsewhere" is remains unknown. Whisps do not explain. It is unclear if they can.

### Observed Behaviors
- Opacity fluctuates with emotional state (more solid when content)
- Locomotion is drift-based; does not contact floor
- Occasionally phases through solid matter (appears involuntary)
- Orients toward empty spaces as if perceiving stimuli

### The Other World

*Recording transcript, timestamp corrupted:*

> RESEARCHER: Where did you come from?
> [No audible response]
> RESEARCHER: Can you show me?
> [Subject drifts toward window, stops]
> [Long pause]
> RESEARCHER: What's wrong?
> [Subject turns back. Shakes head slowly.]
>
> *Note: Subject appeared to be choosing. Choosing to stay here.*

### The Thinness

*Handwritten, no attribution:*

> Whisp looked at nothing today. Stared at an empty corner for an hour.
>
> I asked what it saw.
>
> It didn't answer. But it moved closer to me afterward.
>
> I think it's trying to stay anchored.
>
> I think it's afraid of drifting back.

### Origin Snippet (In-Game)
> Drifted in through a crack in a dream.
> Sometimes forgets which world.

### Preferences

| Attribute | Value |
|-----------|-------|
| **Personality** | Mysterious, ethereal, dreamlike |
| **Likes** | Dream foods, Magical, Rare |
| **Dislikes** | Common, Basic |
| **Drawn To** | Quiet, Softness, Gentle routine |
| **Repelled By** | Loud sounds, Chaos, Harsh light |

### Secret (Bond Level 50)
> Whisp isn't sure which world they belong to anymore. Yours or the other one, the one they came from. Most days, they choose yours.

### Silhouette & Vibe
```
     ~ ~ ~
    ╱     ╲
   (  ◯ ◯  )
    ╲     ╱
     ~ ~ ~
```
Shape: Wispy, semi-transparent. Empty circle eyes, wavy edges. Ghostly, mysterious.

### Captions
| Context | Examples |
|---------|----------|
| Idle | "Whisp floats silently...", "Whisp phases in and out...", "..." |
| Positive | "Whisp glows brighter!", "✨", "Whisp hums softly..." |
| Neutral | "Whisp observes.", "...", "Whisp drifts" |
| Negative | "Whisp fades slightly.", "...", "Whisp looks through you." |

### Pet-Specific Animations
| State | Unique Behavior |
|-------|-----------------|
| Idle | Phases in and out, floats |
| Happy | Glows brighter |
| Loved | Rainbow glow, ethereal sparkles |
| Eating | Food dissolves into whisp |

### Design Notes
Premium pet that rewards rare food usage. Low maintenance but needs quality over quantity. Mysterious aesthetic for collectors. Designed as a late-game XP accelerator.

---

## ✨ LUXE — The Fancy One

**Classification:** Unknown, Rare  
**First Documented:** Inexplicably, already present when documentation began  
**Unlock:** Level 30 OR 300 💎

### Origin Story

*Social column clipping, date obscured:*

> A peculiar creature was observed at [LOCATION REDACTED] this evening, positioned near the grand entrance as if awaiting introduction.
>
> When asked its origin, it offered only a look that suggested the question was beneath answering.
>
> It sparkles. It does not explain why.

### Formation

Luxe presents a taxonomic challenge. Most spirits form from emotional moments. Luxe appears to form from **the appreciation of quality itself** — the recognition that some things are simply finer than others.

Alternatively: Luxe may have invented this explanation. We cannot verify. Luxe declines to cooperate with research it deems "tedious."

### Observed Behaviors
- Produces natural luminescence; source unidentified
- Performs non-verbal judgments on surroundings constantly
- Refuses sustenance below perceived quality threshold
- Dispenses approval sparingly; approval highly valued by recipients

### The Backstory

*Interview notes, marked "CONFIDENTIAL":*

> I made the mistake of asking Luxe about its past.
>
> It described a glamorous origin. Crystal towers. Admiring crowds.
>
> Later, I asked again.
>
> Different story. Equally glamorous.
>
> The third time, it simply looked away.
>
> I think the truth is something it has decided not to remember.

### What Luxe Was

*Anonymous submission, found under door:*

> Before Luxe was Luxe, it was small.
>
> Before it sparkled, it was dull.
>
> Before it was certain of its worth, it was lost and afraid and ordinary.
>
> So it decided — *decided* — to become something that would never feel that way again.
>
> The glamour isn't inherited. It's constructed. Deliberately. Defiantly.
>
> That makes it more impressive, not less.

### Origin Snippet (In-Game)
> Arrived already posing.
> Certain they deserve better.

### Preferences

| Attribute | Value |
|-----------|-------|
| **Personality** | Fabulous, royal, extra |
| **Likes** | Premium, Legendary, Crafted |
| **Dislikes** | Common, Basic |
| **Drawn To** | Luxury, Quality, Admiration |
| **Repelled By** | The ordinary, The common, Being overlooked |

### Secret (Bond Level 50)
> Luxe doesn't actually remember where they came from. They invented their own backstory — something suitably glamorous. The truth is they were small and lost once, and they decided to become someone who would never feel that way again.

### Silhouette & Vibe
```
       ♕
     ╭───╮
    ╱ ◕ ◕ ╲
   │   ♡   │
    ╲     ╱
     ╰───╯
     ✨ ✨
```
Shape: Elegant oval with crown. Long lashes, pursed lips. Diva, glamorous.

### Captions
| Context | Examples |
|---------|----------|
| Idle | "Luxe admires their reflection.", "Luxe poses for no one.", "Simply fabulous." |
| Positive | "Luxe approves, darling!", "Exquisite!", "Luxe blows a kiss 💋" |
| Neutral | "Luxe considers it.", "Hmm.", "Luxe shrugs elegantly" |
| Negative | "Luxe is NOT amused.", "How pedestrian.", "Luxe looks away." |

### Pet-Specific Animations
| State | Unique Behavior |
|-------|-----------------|
| Idle | Admiring reflection, posing |
| Happy | Blows kiss, winks |
| Loved | Glamorous spin, sparkle burst |
| Eating | Dainty bites, proper etiquette |

### Design Notes
Ultimate aspirational pet. Doubles gem income for endgame players. Only likes premium foods = gem sink. Flex pet for whales and dedicated players.

---

# 4. CORE SYSTEMS

## 4.1 Core Gameplay Loop

### Minute Loop
```
Open game → Pet reacts to presence → Feed → Mood reaction → XP gain → Optional mini-game → Collect rewards
```

### Session Loop
```
Feed 1–3 foods → Craft recipes → Switch cosmetics → Mini-games for currency
```

### Progression Loop
```
Feed → Earn → Unlock cosmetics → Level up → New content → Come back daily
```

### Visual Loop Diagram
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│    ┌──────┐     ┌───────┐     ┌──────┐     ┌────────┐          │
│    │ FEED │ ──▶ │ REACT │ ──▶ │ EARN │ ──▶ │  GROW  │          │
│    └──────┘     └───────┘     └──────┘     └────────┘          │
│        ▲                                        │              │
│        │                                        │              │
│        └────────────────────────────────────────┘              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 4.2 Daily Moments System

Soft bonuses encourage play at different times without punishment for missing them.

| Moment | Time Window | Bonus |
|--------|-------------|-------|
| Morning | 7-10 AM | +50% bond from feeding |
| Afternoon | 12-2 PM | +25% XP |
| Evening | 6-9 PM | +50% bond from feeding |

## 4.3 Cooldown System [Web Phase 6+]

After feeding, a 30-minute digestion cooldown begins.

| Cooldown State | Feed Value |
|----------------|------------|
| No cooldown | 100% |
| During cooldown | 25% |

### Implementation Requirements

| Requirement | Specification |
|-------------|---------------|
| Timer start | Immediately after ANY feeding action |
| Timer duration | 30 minutes (see Tuning Note) |
| Timer persistence | Survives page refresh/app restart |
| Timer display | Always visible when active |
| Feeding during cooldown | Allowed, but at 25% effectiveness |
| Timer reset | Each feeding restarts the timer |

### UI Display

```
┌─────────────────────────────────────┐
│  ⏱️ Digesting... 24:32              │
│  (Feeding now gives 25% value)      │
└─────────────────────────────────────┘
```

### Tuning Note

> The exact cooldown duration (30 minutes) may be tuned per platform based on session data. However, two rules are **mandatory and non-negotiable**:
>
> 1. **A cooldown MUST exist** — spam-feeding must be prevented
> 2. **STUFFED blocks feeding** — at fullness 91-100, feeding is refused entirely
>
> These constraints preserve the "Daily Moments" rhythm and prevent trivializing progression.

> **Design Intent:** Cooldown prevents spam-feeding. Players can still feed during cooldown (for emergencies) but with reduced benefit.

## 4.4 Stats System

**Bond is visible. Everything else is hidden.** The pet's behavior communicates needs.

### Production HUD Rule

> The player-facing HUD shows **Bond only**. All other stats (hunger, mood, XP, energy) are communicated through:
> - Pet animations and expressions
> - Thought bubbles and icons
> - Contextual UI cues (e.g., food tray grays out when stuffed)
>
> **No raw stat bars or numbers** for hidden stats in production builds.

### Developer/QA Exception

> Developer and QA builds may expose additional debug stats (XP bars, hunger meters, cooldown timers, feed counters, session timers). These **must not appear in player-facing builds**.
>
> Implementation should gate debug HUD behind a dev flag:
> ```typescript
> if (import.meta.env.DEV) {
>   showDebugHUD();
> }
> ```
>
> Production builds must strip or disable all debug UI.

| Need | Pet Behavior |
|------|--------------|
| Hungry | Looks at food, stomach growls |
| Full | Pats belly, turns away |
| Happy | Bouncing, bright eyes |
| Sad | Droopy, slow |
| Tired | Yawning |

### Hidden Stats

| Stat | Range | Purpose |
|------|-------|---------|
| Hunger | 0–100 | Controls mood & feeding need |
| Mood | 0–100 | Affects XP multiplier, reactions |
| Energy | 0–100 | Mini-games resource |
| Bond | 0–100 | Long-term relationship, unlocks (VISIBLE) |
| XP | Per level | Progression tracking |
| Level | 1–50 | Unlock systems, cosmetics |

### Fullness States (Hidden) [Web Phase 6+]

| State | Range | Pet Behavior | Feed Value |
|-------|-------|--------------|------------|
| HUNGRY | 0-20 | Begs | 100% |
| PECKISH | 21-40 | Glances | 75% |
| CONTENT | 41-70 | Ignores | 50% |
| SATISFIED | 71-90 | Shakes head | 25% |
| STUFFED | 91-100 | Turns away | **Blocked** |

> ⚠️ **LOCKED RULE:** When fullness reaches STUFFED (91-100), feeding is **completely blocked**, not just reduced. Pet refuses food entirely. This is mandatory behavior across all platforms.

## 4.5 Mood System

### Mood Tiers

| Tier | Range | Label | Reaction Odds |
|------|-------|-------|---------------|
| 5 | 85-100 | Ecstatic | 80% positive |
| 4 | 60-84 | Happy | 60% positive |
| 3 | 40-59 | Content | 50/50 |
| 2 | 20-39 | Low | 40% negative |
| 1 | 0-19 | Unhappy | 60% negative |

### Mood Modifiers
- Feeding while Mood = Happy → +10% XP
- Feeding a Favorite → triggers **Ecstatic** reaction
- Feeding a Hated → triggers **Negative** reaction
- Feeding when Hunger < 20% → Reaction only, no XP

## 4.6 Energy System

| Tier | Range | Label | Animation Speed |
|------|-------|-------|-----------------|
| High | 70-100 | Energetic | 1.2× |
| Normal | 40-69 | Normal | 1.0× |
| Low | 20-39 | Tired | 0.85× |
| Exhausted | 0-19 | Exhausted | 0.7× |

**Energy for Mini-Games:**
- Maximum: 50
- Cost per game: 10
- Regeneration: 1 per 30 minutes
- First daily game: FREE

## 4.7 Bond System

### Bond Milestones

| Milestone | Unlocks |
|-----------|---------|
| 3 | Preference Journal unlocks |
| 5 | Special greeting, Fizz unlock condition |
| 10 | Unique idle animation |
| 20 | Shop discount 5% |
| 30 | Rare reaction variant |
| 50 | Exclusive cosmetic, Secret Lore Fragment |
| 75 | Premium idle |
| 100 | Unique aura |

### Bond Gains

| Action | Bond Gain |
|--------|-----------|
| Feeding | +0.1 |
| Favorite food | +0.3 |
| Mini-game | +0.3 |
| Daily login | +0.5 |
| Evolution | +2.0 |
| Cleaning poop | +0.1 |

### Time-Away Logic

| Duration | Welcome Back Effect |
|----------|---------------------|
| 6-12 hours | Happy wiggle, +0.3 bond |
| 12-24 hours | Excited jump, +0.5 bond |
| 24+ hours | Sad idle, -3 mood (Cozy: bonus XP instead) |

## 4.8 Preference Discovery

**Hidden. Learn by feeding. Hints after time.**

- Feed → See reaction → Learn
- Day 7+: Pet hints at what they want (thought bubbles)
- Bond Level 3: Preference Journal unlocks (shows discovered preferences)

## 4.9 Pet Communication

**Icons for quick status. Bubbles for personality.**

- 🍎❓ = Hungry
- 💭 "Ooh, is that a cookie?!" = Personality

## 4.10 Pet Special Abilities (Implementation)

Each pet's special ability is applied automatically when that pet is active:

| Pet | Ability | Implementation |
|-----|---------|----------------|
| Munchlet | +10% bond growth | `bondGain = baseBond × 1.1` |
| Grib | -20% mood penalty from dislikes | `moodLoss = baseLoss × 0.8` |
| Plompo | -20% mood decay rate | `decayRate = baseDecay × 0.8` |
| Fizz | +25% mini-game rewards | `rewards = baseRewards × 1.25` |
| Ember | 2× coins from spicy foods | `if (food.isSpicy) coins × 2` |
| Chomper | No disliked foods | `affinity = max(affinity, 'neutral')` |
| Whisp | +50% XP from rare/epic | `if (rarity >= rare) xp × 1.5` |
| Luxe | +100% gem drops | `gems = baseGems × 2` |

When ability triggers, show subtle indicator (icon pulse near pet, floating text like "+25% 🎮" for Fizz).

---

# 5. FOOD & FEEDING

## 5.1 Food Categories

| Category | Effect | Trade-off |
|----------|--------|-----------|
| **Meals** | +Hunger (primary), +small XP | Slow, filling, healthy |
| **Snacks** | +Happiness (primary), +Hunger (small) | Quick fix, but risks |

## 5.2 Food Properties

Each food item defines:
- **Hunger Restore** — How much hunger is restored
- **Mood Impact** — Positive or negative mood effect
- **XP Yield** — Base XP granted
- **Rarity** — Common, Uncommon, Rare, Epic, Legendary
- **Pet Affinity** — Loved, Liked, Neutral, Disliked per pet

## 5.3 Affinity Multipliers

| Affinity | XP Multiplier |
|----------|---------------|
| Loved | 2.0× |
| Liked | 1.5× |
| Neutral | 1.0× |
| Disliked | 0.5× |

## 5.4 Complete Food Table

### Meal Foods

| Food | Emoji | Rarity | Hunger | Mood | XP | Cost |
|------|-------|--------|--------|------|-----|------|
| Apple | 🍎 | Common | +12 | +1 | 2 | 5 |
| Banana | 🍌 | Common | +10 | +1 | 2 | 5 |
| Carrot | 🥕 | Common | +8 | 0 | 1 | 5 |
| Grapes | 🍇 | Uncommon | +14 | +1 | 3 | 15 |
| Spicy Taco | 🌮 | Rare | +20 | +2 | 6 | 25 |
| Birthday Cake | 🎂 | Epic | +25 | +3 | 10 | 50 |
| Golden Feast | 👑 | Legendary | +30 | +5 | 20 | 150 |

### Snack Foods

| Food | Emoji | Rarity | Hunger | Mood | XP | Cost | Risk |
|------|-------|--------|--------|------|-----|------|------|
| Cookie | 🍪 | Uncommon | +5 | +15 | 4 | 15 | +5% weight |
| Candy | 🍬 | Uncommon | +3 | +20 | 3 | 20 | +10% weight |
| Ice Cream | 🍦 | Rare | +5 | +25 | 5 | 30 | +10% weight |
| Hot Pepper | 🌶️ | Rare | +8 | +10 | 5 | 25 | +5% sickness (Classic) |
| Dream Treat | ⭐ | Epic | +10 | +30 | 12 | 75 | No risk |
| Lollipop | 🍭 | Common | +2 | +18 | 2 | 10 | +8% weight |

## 5.5 Complete Affinity Matrix

| Food | Munchlet | Grib | Plompo | Fizz | Ember | Chomper | Whisp | Luxe |
|------|----------|------|--------|------|-------|---------|-------|------|
| Apple 🍎 | Liked | Neutral | Neutral | Liked | Neutral | Neutral | Neutral | Neutral |
| Banana 🍌 | Loved | Neutral | Liked | Liked | Neutral | Neutral | Liked | Liked |
| Cookie 🍪 | Loved | Disliked | Loved | Liked | Neutral | Liked | Liked | Liked |
| Spicy Taco 🌮 | Disliked | Loved | Disliked | Disliked | Loved | Liked | Neutral | Neutral |
| Hot Pepper 🌶️ | Disliked | Loved | Disliked | Disliked | Loved | Liked | Disliked | Disliked |
| Birthday Cake 🎂 | Loved | Neutral | Loved | Loved | Neutral | Liked | Loved | Loved |
| Dream Treat ⭐ | Loved | Liked | Loved | Loved | Liked | Liked | Loved | Loved |
| Golden Feast 👑 | Loved | Loved | Loved | Loved | Loved | Loved | Loved | Loved |

## 5.6 Food Pricing

| Rarity | Coin Cost | Gem Cost |
|--------|-----------|----------|
| Common | 5 | — |
| Uncommon | 15 | — |
| Rare | 25 | — |
| Epic | 50-75 | — |
| Legendary | 100-200 | 5-10 |
| Seasonal | — | 3-5 |
| Boost Food | — | 4-8 |

## 5.7 Weight System (Snack Risk)

```
Weight Level: 0-100 (hidden)

Gain: Each snack adds to hidden weight meter
Decay: -1 weight per hour naturally

Weight Effects:
0-30:   Normal (no effect)
31-60:  Chubby (visual change, pet looks rounder)
61-80:  Overweight (happiness decay 1.5×, sluggish animations)
81-100: Obese (happiness decay 2×, can't play mini-games)

Cure: Don't feed snacks for 24 hours, or use "Diet Food" item
```

### Visual Weight Stages

| Weight | Pet Appearance |
|--------|----------------|
| Normal | Standard sprite |
| Chubby | Slightly rounder, cute |
| Overweight | Noticeably round, slower movement |
| Obese | Very round, sweat drops, wheezing animation |

---

# 6. PROGRESSION & UNLOCKS

## 6.1 Evolution System

**Vector creatures with in-game evolution (3 stages)**

| Stage | Levels | Look |
|-------|--------|------|
| Baby | 1-9 | Simple, small |
| Youth | 10-24 | Growing, developing |
| Evolved | 25+ | Full design |

> ⚠️ **LOCKED THRESHOLDS:** Youth=10, Evolved=25. These values are final.
>
> "Slower reveal, more anticipation" — do not lower thresholds to speed progression. This was an explicit design decision to make evolution feel meaningful.

Care quality affects appearance in Classic mode (see Section 9).

## 6.2 Progression Speed

**Curved — accessible early, prestigious late**

| Milestone | Time |
|-----------|------|
| Level 10 | 1-2 weeks |
| Level 20 | 1-2 months |
| Level 30 | 3-6 months |

### XP Level Curve Formula

```
XP(L) = 20 + (L² × 1.4)
```

| Level | XP Required |
|-------|-------------|
| 1 | 22 |
| 2 | 26 |
| 3 | 34 |
| 5 | 62 |
| 10 | 160 |
| 20 | 580 |
| 30 | 1,280 |
| 50 | 3,520 |

## 6.3 Pet Unlock System

### Unlock Requirements

| Slot | Pet | Free Unlock | Gem Skip | Design Intent |
|------|-----|-------------|----------|---------------|
| 1 | Munchlet 🟡 | Starter | — | Beginner-friendly |
| 2 | Grib 🟢 | Starter | — | Spicy specialist |
| 3 | Plompo 🟣 | Starter | — | Low-maintenance |
| 4 | Fizz 🔵 | Level 10 | 50 💎 | Active player reward |
| 5 | Ember 🟠 | Level 15 | 100 💎 | Mid-game goal |
| 6 | Chomper 🔴 | Level 20 | 150 💎 | Inventory burner |
| 7 | Whisp ⚪ | Level 25 | 200 💎 | Rare food specialist |
| 8 | Luxe ✨ | Level 30 | 300 💎 | Endgame flex |

### Core Rules

- All 3 STARTERS always available (Munchlet, Grib, Plompo)
- Player picks which starter to play FIRST
- Can switch between starters anytime
- Each pet has SEPARATE: Level, XP, Bond, Mood, Hunger
- SHARED across all pets: Coins, Gems, Food Inventory
- Pets 4-8 unlock via level milestone OR gem purchase
- Unlocks are permanent (account-wide)

### Unlock Flow

```
Player reaches Level 10 with ANY pet
         ↓
"NEW PET UNLOCKED!" modal appears
         ↓
Shows Fizz with sparkle animation
         ↓
[Start Playing] → Switch to Fizz
[Maybe Later] → Dismiss, access via Pet Selector
```

## 6.4 Lore Journal System

Players unlock lore fragments through gameplay, building their own copy of the Grundy Codex.

### Journal Structure

```
📖 GRUNDY JOURNAL
├── 📜 The Codex (Lore Fragments)
│   ├── General Knowledge (4 fragments)
│   ├── Munchlet (4 fragments + 1 secret)
│   ├── Grib (4 fragments + 1 secret)
│   ├── Plompo (4 fragments + 1 secret)
│   ├── Fizz (4 fragments + 1 secret)
│   ├── Ember (4 fragments + 1 secret)
│   ├── Chomper (4 fragments + 1 secret)
│   ├── Whisp (5 fragments + 1 secret)
│   └── Luxe (5 fragments + 1 secret)
├── 🍎 Preference Notes (Auto-filled)
└── 📊 Bond History
```

### Fragment Unlock Triggers

| Fragment Type | Unlock Condition |
|---------------|------------------|
| Fragment I (Discovery) | Select pet for first time |
| Fragment II (Formation) | Reach Bond Level 5 |
| Fragment III (Behaviors) | Reach Bond Level 10 |
| Fragment IV (Deep Lore) | Reach Bond Level 20 |
| Fragment V (If exists) | Reach Bond Level 30 |
| Secret Fragment | Reach Bond Level 50 |
| General Lore | Various milestones |

### General Lore Unlocks

| Fragment | Unlock Condition |
|----------|------------------|
| "On the Nature of Grundies" | Complete tutorial |
| "The Folk Saying" | Own any pet for 7 days |
| "How They Choose" | Own 3 different pets |
| "The Central Mystery" | Reach Bond 50 with any pet |

### Completion Rewards

| Milestone | Reward |
|-----------|--------|
| Complete 1 pet's lore | Title: "Keeper of [Pet] Secrets" |
| Complete 4 pets' lore | Cosmetic: Codex Page Background |
| Complete all 8 pets' lore | Title: "Codex Scholar" |
| Unlock all secrets | Cosmetic: Ancient Tome Aura |
| 100% Journal completion | Title: "Archivist" + Unique Frame |

---

# 7. ONBOARDING FLOW

## 7.1 Design Goals

| Priority | Goal | How |
|----------|------|-----|
| 1 | **Introduce the world** | Lore snippet on intro screen (5 sec) |
| 2 | **Create emotional connection** | Origin stories during pet selection |
| 3 | **Fast to gameplay** | Under 60 seconds total |
| 4 | **Tease locked content** | Mysterious snippets for locked pets |
| 5 | **Personality from moment one** | Pet speaks in-character during tutorial |
| 6 | **No monetization pressure** | Zero shop/IAP during FTUE |

## 7.2 Flow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         ONBOARDING FLOW                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │  SPLASH  │ →  │  WORLD   │ →  │   PET    │ →  │ TUTORIAL │  │
│  │  (2 sec) │    │  INTRO   │    │ SELECTION│    │  + PLAY  │  │
│  └──────────┘    │  (5 sec) │    │ (15 sec) │    │ (30 sec) │  │
│                  └──────────┘    └──────────┘    └──────────┘  │
│                                        │                        │
│                                        ↓                        │
│                              ┌─────────────────┐                │
│                              │   MODE SELECT   │                │
│                              │ (after tutorial)│                │
│                              └─────────────────┘                │
│                                                                 │
│  Total Target: < 60 seconds to first feeding                   │
└─────────────────────────────────────────────────────────────────┘
```

### Timing Summary

| Screen | Duration | User Action | Skip Option |
|--------|----------|-------------|-------------|
| Splash | 2 sec | None (auto) | No |
| World Intro | 5 sec | Tap to continue | Yes (tap) |
| Pet Selection | ~15 sec | Browse + select | No |
| Tutorial | ~30 sec | Follow prompts | No (first time) |
| Mode Select | User choice | Select mode | No |

## 7.3 Screen 1: Splash

**Duration:** 2 seconds (auto-advance)

| Element | Spec |
|---------|------|
| Logo | Center screen, fade in over 1s |
| Background | Deep purple gradient (#2D1B4E → #1A1025) |
| Sparkles | Subtle particle effect around logo |
| Audio | Soft chime on appear |
| Transition | Fade to white, 0.5s |

## 7.4 Screen 2: World Intro

**Duration:** ~10 seconds (tap to skip OR auto-advance after line 2)

### Lore Text (LOCKED Copy)

```
Sometimes, when a big feeling is left behind…
A tiny spirit called a Grundy wakes up.
One of them just found *you*.
```

> **Note:** This copy is LOCKED. See `docs/GRUNDY_ONBOARDING_FLOW.md` Screen 2 and `docs/GRUNDY_LORE_CODEX.md` for matching canonical text.

### Animation Sequence

| Time | Action |
|------|--------|
| 0.0s | Screen fades in |
| 0.5s | Line 1 fades in |
| 2.5s | Line 2 fades in |
| 5.0s | Line 3 fades in (emphasized) |
| 6.0s | Continue button appears |
| 10.0s | Auto-advance if no tap |

### Minimum Acceptable Fallback

> If the full staged timing sequence cannot be implemented on a given platform, the **minimum acceptable behavior** is:
>
> 1. Text appears as **one cohesive block** with a smooth fade
> 2. **No stutter or jank** during transitions
> 3. **Copy must remain unchanged** (see Locked Copy below)
>
> The staged fade-in is part of the emotional tone. Implementations should strive for the full sequence, but a graceful fallback is acceptable over a broken animation.

### Locked Copy

The World Intro text is **LOCKED**:

```
Sometimes, when a big feeling is left behind…
A tiny spirit called a Grundy wakes up.
One of them just found *you*.
```

> ⚠️ Do not modify this copy. It is the canonical introduction to the Grundy world.

### Specs

| Element | Spec |
|---------|------|
| Text style | Serif/elegant font, cream color (#FFF8E7) |
| Animation | Fade in line-by-line, 0.8s per line |
| Decorative stars | Gentle twinkle animation |
| Background | Dark purple with soft vignette |
| Audio | Mystical ambient pad, very soft |

## 7.5 Screen 3: Pet Selection

**Duration:** ~15 seconds (user-controlled)

### Layout

```
┌─────────────────────────────────────┐
│  ←                    Choose Your   │
│                         Grundy      │
├─────────────────────────────────────┤
│                                     │
│   ┌─────┐   ┌─────┐   ┌─────┐      │
│   │  🟡  │   │  🟢  │   │  🟣  │      │
│   │     │   │     │   │     │      │
│   └─────┘   └─────┘   └─────┘      │
│   Munchlet    Grib     Plompo       │
│     FREE      FREE      FREE        │
│                                     │
│   ┌─────┐   ┌─────┐   ┌─────┐      │
│   │ 🔵🔒 │   │ 🟠🔒 │   │ 🔴🔒 │      │
│   └─────┘   └─────┘   └─────┘      │
│    Fizz      Ember    Chomper      │
│    Lv.10     Lv.15     Lv.20       │
│                                     │
│   ┌─────┐   ┌─────┐                │
│   │ ⚪🔒 │   │ ✨🔒 │                │
│   └─────┘   └─────┘                │
│    Whisp     Luxe                  │
│    Lv.25     Lv.30                 │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  [LORE SNIPPET PANEL]              │
│                                     │
│          [ Choose ]                 │
│                                     │
└─────────────────────────────────────┘
```

### Pet Card States

| State | Visual Treatment |
|-------|------------------|
| Free (unselected) | Full color, subtle idle animation |
| Free (selected) | Glowing border, bounce animation |
| Locked (unselected) | Silhouette, dimmed, lock icon |
| Locked (tapped) | Slight pulse, shows teaser lore |

### Free Pet: Selected Display

When a free pet is selected, show:
- Pet emoji (bounces gently)
- Name + Title (e.g., "✨ Munchlet ✨" / "The Friendly One")
- Origin snippet (2 lines)
- Loves/Hates

Example (Munchlet):
```
"Found on a sunny windowsill, humming.
 Waiting for someone to share warmth with."

♡ Loves sweet things
✗ Hates being alone
```

### Locked Pet: Teaser Display

| Pet | Teaser (Shown) | Hidden (Revealed on Unlock) |
|-----|----------------|----------------------------|
| Fizz 🔵 | "Sparked into existence during a thunderstorm..." | "Hasn't stopped vibrating." |
| Ember 🟠 | "Emerged from the last ember of a dying fire..." | "Refuses to be ignored." |
| Chomper 🔴 | "First spotted near the kitchen, following the smell of dinner..." | "Loves food. Hates... just loves food." |
| Whisp ⚪ | "Drifted in through a crack in a dream..." | "Sometimes forgets which world." |
| Luxe ✨ | "Arrived already posing. Certain they deserve better." | (Full snippet already short) |

## 7.6 Screen 4: Tutorial + First Play

### Step 4.1: Greeting

Pet appears with personality-specific greeting:

| Pet | Dialogue | Animation |
|-----|----------|-----------|
| Munchlet | "Hi! I'm so glad you found me!" | Happy bounce, eyes sparkle |
| Grib | "Took you long enough. This is gonna be fun." | Mischievous sway, grin widens |
| Plompo | "Oh... hi... *yawn* ...nice to meet you..." | Slow blink, yawn, settles |

### Step 4.2: Sees Food

Spotlight on food bag area:

| Pet | Dialogue | Animation |
|-----|----------|-----------|
| Munchlet | "Ooh, is that food?!" | Eyes widen, bounces toward food |
| Grib | "Ooh, what do we have here..." | Sly look, rubs hands |
| Plompo | "Mmm... that looks... *yawn* ...nice..." | Sleepy interest |

Prompt: "Tap a food to feed your pet!"

### Step 4.3: After First Feeding

**First reaction is ALWAYS positive** (rigged for good experience).

| Pet | Dialogue | Animation |
|-----|----------|-----------|
| Munchlet | "Yum! That was perfect!" | Hearts burst, happy dance |
| Grib | "Not bad. Do it again." | Satisfied smirk |
| Plompo | "That was... worth waking up for..." | Content sigh |

### Step 4.4: HUD Introduction

Spotlight highlights UI elements in sequence:
1. XP bar: "Keep feeding to level up and unlock new pets!"
2. Coins display: "Earn coins to buy more food"
3. Mini-game button: "Play games for extra rewards"

### Step 4.5: Tutorial Complete

| Pet | Dialogue | Animation |
|-----|----------|-----------|
| Munchlet | "Let's keep exploring together!" | Excited wiggle |
| Grib | "Alright, let's cause some trouble." | Mischievous bounce |
| Plompo | "Can we... take a nap soon...?" | Sleepy smile |

## 7.7 Screen 5: Mode Select

**Shown after tutorial completes**

```
┌─────────────────────────────────────────┐
│         CHOOSE YOUR PLAY STYLE          │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │      🌸 COZY MODE 🌸            │   │
│  │                                 │   │
│  │  • Pet never dies              │   │
│  │  • No penalties                │   │
│  │  • Gentle reminders            │   │
│  │  • Pure relaxation             │   │
│  │                                 │   │
│  │  "Your pet will always love    │   │
│  │   you, no matter what!"        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │     🎮 CLASSIC MODE 🎮          │   │
│  │         🔒 Level 10             │   │
│  │                                 │   │
│  │  • Your care matters           │   │
│  │  • Neglect → sadness → runaway │   │
│  │  • Evolution branches          │   │
│  │  • Higher stakes, more reward  │   │
│  │                                 │   │
│  │  "Like the virtual pets of     │   │
│  │   the 90s. Handle with care!"  │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

## 7.8 FTUE Rules

These rules are **mandatory** during onboarding:

1. ❌ No monetization during FTUE
2. ❌ No interstitial ads
3. ❌ No LiveOps popups
4. ❌ No season pass display
5. ❌ No shop prompts
6. ✅ Age gate before FTUE begins
7. ✅ First reaction always positive
8. ✅ Starter resources provided (100 coins, 10 gems)

---

# 8. MINI-GAMES

## 8.0 Mini-Game Design Documents

Detailed specifications for each mini-game are in `docs/Minigames/`:

| Game | Design Doc | Duration | Main Skill |
|------|------------|----------|------------|
| Snack Catch | [GRUNDY_SNACK_CATCH_DESIGN.md](minigames/GRUNDY_SNACK_CATCH_DESIGN.md) | 60s | Reflexes |
| Memory Match | [GRUNDY_MEMORY_MATCH_DESIGN.md](minigames/GRUNDY_MEMORY_MATCH_DESIGN.md) | 60-120s | Memory |
| Rhythm Tap | [GRUNDY_RHYTHM_TAP_DESIGN.md](minigames/GRUNDY_RHYTHM_TAP_DESIGN.md) | 45-60s | Timing |
| Poop Scoop | [GRUNDY_POOP_SCOOP_DESIGN.md](minigames/GRUNDY_POOP_SCOOP_DESIGN.md) | 60s | Speed |

Each design doc includes:
- Complete gameplay rules
- All 8 pet abilities
- Reward tiers (Bronze/Silver/Gold/Rainbow)
- Technical state interfaces
- Animation & sound specs
- Test cases

**See individual design docs for implementation details.**

## 8.1 Overview

| Game | Type | Duration | Main Skill |
|------|------|----------|------------|
| Snack Catch | Arcade | 60s | Reflexes |
| Memory Match | Puzzle | Varies | Memory |
| Rhythm Tap | Music | 30-60s | Timing |
| Poop Scoop | Action | 60s | Speed |

### Universal Rules

- All games cost **10 energy** to play
- Rewards scale with active pet level (+1% per level)
- Fizz gets +25% rewards on ALL mini-games
- Daily high scores tracked
- First daily game is FREE

## 8.2 Energy System [Web 1.0]

| Attribute | Value |
|-----------|-------|
| Maximum | 50 |
| Cost per game | 10 |
| Regeneration | 1 per 30 minutes |
| First daily game | FREE |
| **Daily cap** | **3 plays maximum** |

> ⚠️ **LOCKED RULES:**
> - Daily cap of **3 plays** is a design constraint to preserve session rhythm
> - First game each day is **always free** (costs 0 energy)
> - These rules exist to prevent grinding and maintain the "check-in" design
>
> Do not increase daily cap or remove energy costs without explicit approval.

## 8.3 Reward Tiers [Web 1.0]

| Tier | Coins | XP | Food |
|------|-------|-----|------|
| Bronze | 2-3 | 3 | — |
| Silver | 5-7 | 5 | 40% common |
| Gold | 8-15 | 8 | 75% any |
| Rainbow | 12-22 | 12 | Rare guaranteed |

> ⚠️ **LOCKED INVARIANT — NO GEMS FROM MINI-GAMES**
>
> Mini-games **NEVER** award gems under any circumstances — including Rainbow tier. This is a locked design constraint.
>
> **Gem income comes exclusively from:**
> - Level-up rewards
> - Daily login streaks
> - Achievements
> - Special events
> - Purchases
>
> **Rationale:**
> - Preserves gem value as premium currency
> - Prevents mini-game grinding for premium rewards
> - Maintains ethical monetization balance
>
> **Do not add gem rewards to any mini-game tier, including Rainbow.**

## 8.4 Snack Catch 🍎

> For complete specification, see `docs/Minigames/GRUNDY_SNACK_CATCH_DESIGN.md`

**Concept:** Catch falling food, avoid bad items.

### Rules
- Food falls from top of screen
- Swipe or tap to catch in basket
- Catch favorites = bonus points
- Catch dislikes = lose points
- 60 second timer

### Scoring

| Item | Points |
|------|--------|
| Loved food | +30 |
| Liked food | +20 |
| Neutral food | +10 |
| Disliked food | -15 |
| Bad item (bomb, etc.) | -25 |

## 8.5 Memory Match 🧠

> For complete specification, see `docs/Minigames/GRUNDY_MEMORY_MATCH_DESIGN.md`

**Concept:** Flip cards to find matching food pairs.

### Grid Sizes

| Difficulty | Grid | Pairs | Time |
|------------|------|-------|------|
| Easy | 3×4 | 6 | 60s |
| Medium | 4×4 | 8 | 90s |
| Hard | 4×5 | 10 | 120s |

### Scoring

| Performance | Score | Reward |
|-------------|-------|--------|
| Perfect (min moves) | 500+ | Gold+ |
| Good (<moves×1.5) | 300-499 | Silver |
| Complete | 100-299 | Bronze |

### Pet Abilities

| Pet | Ability |
|-----|---------|
| **Whisp** | Peek: See all cards for 2 seconds at start |
| **Munchlet** | Hint: One pair highlighted after 30s |
| **Plompo** | Slow-Mo: Extra 30 seconds |

## 8.6 Rhythm Tap 🎵

> For complete specification, see `docs/Minigames/GRUNDY_RHYTHM_TAP_DESIGN.md`

**Concept:** Tap notes in time with music.

### Rules
- Notes fall in 4 lanes
- Tap when note reaches target line
- Perfect/Good/Miss timing
- Build combos for multiplier

### Timing Windows

| Timing | Window | Points | Combo |
|--------|--------|--------|-------|
| Perfect | ±50ms | 100 | +1 |
| Good | ±100ms | 50 | +1 |
| OK | ±150ms | 25 | Keep |
| Miss | >150ms | 0 | Reset |

### Songs (Procedural)

| Song | BPM | Duration | Notes |
|------|-----|----------|-------|
| Morning Stretch | 80 | 30s | ~60 |
| Lunch Time | 100 | 45s | ~100 |
| Play Time | 120 | 60s | ~150 |
| Dance Party | 140 | 60s | ~180 |

### Scoring Tiers

| Performance | Accuracy | Tier |
|-------------|----------|------|
| S Rank | 90%+ perfect | Rainbow |
| A Rank | 75%+ perfect | Gold |
| B Rank | 50%+ perfect | Silver |
| C Rank | Complete | Bronze |

Rewards are determined by tier (see §8.3). No gems from mini-games.

### Pet Abilities

| Pet | Ability |
|-----|---------|
| **Fizz** | Double Time: +25% points during fever mode |
| **Ember** | Fire Streak: 10+ combo = notes burn (auto-hit) for 3s |
| **Plompo** | Slow Mo: Notes fall 20% slower |

## 8.7 Poop Scoop 🧹

> For complete specification, see `docs/Minigames/GRUNDY_POOP_SCOOP_DESIGN.md`

**Concept:** Clean up poop before it piles up!

### Rules
- Poop appears randomly on screen
- Tap to clean (sparkle effect)
- Poop accumulates if not cleaned
- Game over if poop level reaches 100%

### Poop Types

| Type | Points | Spawn Rate | Notes |
|------|--------|------------|-------|
| Normal 💩 | +10 | Common | Standard |
| Golden ✨💩 | +50 | Rare (5%) | Bonus! |
| Stinky 💩💚 | +20 or -10 | Medium (15%) | Must clean in 2s |
| Rainbow 🌈💩 | +100 | Very Rare (1%) | Jackpot! |

### Difficulty Curve
- Start: 1 poop every 2 seconds
- Each 15 seconds: +0.5 poops/sec
- Max: 3 poops per second

### Scoring Tiers

| Performance | Score | Tier |
|-------------|-------|------|
| Spotless | 600+ | Rainbow |
| Clean | 400-599 | Gold |
| Tidy | 200-399 | Silver |
| Messy | <200 | Bronze |

Rewards are determined by tier (see §8.3). No gems from mini-games.

### Pet Abilities

| Pet | Ability |
|-----|---------|
| **Grib** | Poop Magnet: Tap once to clear 3 nearby poops |
| **Chomper** | Gross! Eats poop for double points |
| **Luxe** | Diva Rage: Every 20 poops, clear all at once "This is DISGUSTING!" |

---

# 9. COZY VS CLASSIC MODE

## 9.1 Mode Overview

| Aspect | Cozy Mode | Classic Mode |
|--------|-----------|--------------|
| Default | ✅ Yes | No (unlocks at Level 10) |
| Death | ❌ Never | After prolonged neglect |
| Sickness | ❌ Never | Yes |
| Consequences | Gentle | Meaningful |
| Evolution | Always positive | Branches based on care |
| Notifications | Gentle reminders | Urgent when needed |

## 9.2 Mode Selection

- Cozy Mode: Always available (default)
- Classic Mode: Unlocks at Level 10
- Can switch modes from Settings menu
- Switching to Classic: Warning modal explains stakes
- Switching to Cozy: No penalty, but care mistakes reset
- Active pet keeps current stats when switching

## 9.3 Cozy Mode Specifics

### Consequences (Gentle)

| Situation | Cozy Mode Response |
|-----------|-------------------|
| Hunger = 0 | Pet looks sad, gentle notification "Your pet misses you! 💕" |
| Happiness = 0 | Pet looks bored, no penalty |
| Uncleaned poop | Pet uncomfortable, mood decays faster |
| Weight = Obese | Visual change only, no penalties |
| Long absence | Pet extra happy to see you, bonus XP on return |

### "Welcome Back" Bonus

| Time Away | Bonus |
|-----------|-------|
| 6-12 hours | +10 XP, "I missed you!" |
| 12-24 hours | +25 XP, +5 coins |
| 24-48 hours | +50 XP, +10 coins |
| 48+ hours | +100 XP, +20 coins, "You're back!" celebration |

### Core Promise
- Pet cannot die
- Pet cannot get sick
- No care mistakes recorded
- Evolution is always positive
- Notifications are gentle and optional

## 9.4 Classic Mode Specifics

### Care Mistakes System

```
Hidden counter: care_mistakes (per evolution stage)

Triggers:
- Hunger = 0 for 30+ minutes → +1 mistake
- Happiness < 20 for 2+ hours → +1 mistake
- Poop uncleaned for 2+ hours → +1 mistake
- Pet sick and untreated for 1+ hour → +1 mistake

Resets at each evolution (Baby → Youth → Evolved)
```

### Sickness System

```
Sickness Chance Triggers:
- Hunger = 0 for 30+ min: 20% chance
- Uncleaned poop for 2+ hours: 15% chance
- Overfeeding snacks: 5% per snack when overweight
- Hot Pepper food: 5% chance always

Sick State:
- Pet shows sick animation (green face, thermometer)
- All stat decay 2× faster
- Cannot play mini-games
- Must use Medicine item to cure

Medicine:
- Cost: 50 coins OR watch ad
- Cures sickness immediately
- Pet needs feeding after to recover fully
```

### Neglect & Runaway System

**NO permadeath. Pet runs away instead.**

**Neglect path:**
1. Pet sad, warns you
2. Pet sick
3. Pet threatens to leave
4. **Pet runs away** (48h lockout)

**Return options:**
- Wait 48 hours, OR
- Pay 25 gems

**Consequences:**
- Bond -50%
- Rebuild trust over time

### Evolution Branches

Based on care_mistakes per stage:

```
Baby Stage (Lv 1-6):
- 0-1 mistakes → "Perfect Baby" badge
- 2-3 mistakes → Normal
- 4+ mistakes → "Troubled Start" badge

Youth Stage (Lv 7-12):
- 0-1 mistakes → "Model Youth" badge
- 2-3 mistakes → Normal
- 4+ mistakes → "Neglected Youth" badge

Evolution Results (Lv 13):
┌──────────────────────────────────────────────┐
│  Perfect Baby + Model Youth = RARE FORM ✨   │
│  - Unique appearance                         │
│  - +20% all stats                            │
│  - Special animations                        │
│  - Achievement unlocked                      │
├──────────────────────────────────────────────┤
│  Normal + Normal = STANDARD FORM             │
│  - Regular evolved appearance                │
├──────────────────────────────────────────────┤
│  Troubled/Neglected = ALTERED FORM 😔        │
│  - Different (not ugly, just different)      │
│  - -10% happiness decay                      │
│  - Unique "survivor" animations              │
│  - Achievement unlocked                      │
└──────────────────────────────────────────────┘
```

**Corruption healing:** Poor care = "Survivor" evolution variant. Healable with 30 days good care.

### Notifications (Classic Mode)

| Urgency | Message | When |
|---------|---------|------|
| Gentle | "Your pet is getting hungry! 🍽️" | Hunger < 30 |
| Urgent | "Your pet is VERY hungry! ⚠️" | Hunger = 0 |
| Critical | "Your pet is SICK! 🏥" | Sickness triggered |
| Emergency | "Your pet needs you NOW! 💔" | Sick + Hunger = 0 |

## 9.5 Cleaning / Waste System (Both Modes)

### Poop Mechanic

```
After every 3-4 feedings → Pet poops 💩
Visual: Poop emoji appears near pet
Must tap to clean

If not cleaned within:
- 30 min: Pet looks uncomfortable
- 1 hour: Mood decays 2× faster
- 2 hours (Classic): +20% sickness chance
```

### Poop Frequency by Pet

| Pet | Poops Every | Notes |
|-----|-------------|-------|
| Munchlet | 4 feedings | Average |
| Grib | 3 feedings | Messy |
| Plompo | 5 feedings | Efficient |
| Fizz | 3 feedings | Hyper digestion |
| Ember | 4 feedings | Average |
| Chomper | 2 feedings | Constant eating = constant pooping |
| Whisp | 6 feedings | Ethereal, minimal waste |
| Luxe | 4 feedings | Average (but complains more) |

### Cleaning Rewards
- Pet does happy animation
- +2 Happiness
- +0.1 Bond
- Satisfying "sparkle clean" effect

## 9.6 Sleep Cycle (Optional Feature)

```
Set bedtime in Settings (e.g., 10:00 PM)
Set wake time (e.g., 7:00 AM)

During sleep hours:
- Pet shows sleeping animation 😴
- No hunger/happiness decay
- Cannot feed or play
- "Shhh... your pet is sleeping"

Benefits:
- Forces daily "put to bed" ritual
- Protects from overnight neglect (especially Classic mode)
- Realistic day/night cycle
```

---

# 10. EVENTS & LIVEOPS

## 10.1 Daily Events

| Event | Trigger | Reward |
|-------|---------|--------|
| First Feed | First feeding of the day | +1 gem |
| Clean Streak | Clean all poop same day | +5 coins |
| Perfect Day | No hunger/happiness below 50 | +10 coins, +2 gems |

## 10.2 Weekly Events

| Day | Event | Reward |
|-----|-------|--------|
| Monday | Mini-game Monday | 2× mini-game rewards |
| Wednesday | Wisdom Wednesday | +50% XP from feeding |
| Friday | Friendship Friday | +2× bond gain |
| Sunday | Surprise Sunday | Random rare food gift |

## 10.3 Login Streak

| Day | Reward |
|-----|--------|
| 1 | 10 coins |
| 2 | 20 coins |
| 3 | 30 coins |
| 4 | 40 coins |
| 5 | 50 coins |
| 6 | 1 rare food |
| 7 | 10 gems + Mystery Box |

## 10.4 Monthly Events

| Month | Event | Special Content |
|-------|-------|-----------------|
| January | New Year | Firework cosmetics, Party Hat |
| February | Valentine's | Heart effects, Love Letter item |
| March | Spring | Flower cosmetics, Easter Egg hunt |
| April | April Fools | Silly food effects, Joke items |
| May | Mother's Day | Flower bouquet, Thank You card |
| June | Summer | Beach cosmetics, Sunglasses |
| July | Birthday Month | Birthday cake bonus, Party mode |
| October | Halloween | Spooky costumes, Candy overload |
| November | Thanksgiving | Feast foods, Gratitude bonus |
| December | Winter | Snow effects, Holiday cosmetics |

## 10.5 Birthday Event

```
On account anniversary (or set date):

- Birthday banner appears
- Pet wears party hat
- Free Birthday Cake
- +100 coins, +20 gems
- Exclusive "Birthday" cosmetic unlocked
- All feeding gives 2× XP for 24 hours
```

## 10.6 Event Currency

| Season | Currency | Icon |
|--------|----------|------|
| Winter | Snowflakes | ❄️ |
| Spring | Petals | 🌸 |
| Summer | Sunrays | ☀️ |
| Fall | Leaves | 🍂 |
| Halloween | Candy Corn | 🍬 |

---

# 11. ECONOMY & MONETIZATION

## 11.1 Currency Types

| Currency | Icon | Earn From | Spend On |
|----------|------|-----------|----------|
| Coins | 🪙 | Feeding, mini-games, daily login, achievements | Food, care items, common cosmetics |
| Gems | 💎 | Level up, achievements, IAP, daily (Plus) | Pet unlocks, premium cosmetics, utility items |
| Event Currency | Varies by season | Event activities, event mini-games | Event-exclusive items (event shop only) |

### Currency Hierarchy

```
Coins → Common/Uncommon items, Care items, Food
Gems → Rare+ cosmetics, Pet unlocks, Premium bundles, Utility
Event Tokens → Event-exclusive items only (cannot mix)
```

### Currency Protection Rules

| Currency | Protected From |
|----------|----------------|
| **Gems** | Cannot accidentally spend (confirmation required for 50+ gems) |
| **Gems** | Cannot buy Common items (prevents "gem dump" design) |
| **Event Tokens** | Cannot convert to coins/gems (prevents hoarding across events) |
| **Event Tokens** | Hard expire at event end (announced 24h before) |

## 11.2 Revenue Strategy

### Revenue Driver Hierarchy

```
                    △
                   /  \
                  / 💎 \        ← Whales (1-2%): Gem packs, max everything
                 /______\
                /        \
               / GRUNDY+  \     ← Subscribers (5-10%): Predictable monthly
              /____________\
             /              \
            /   COSMETICS    \   ← Spenders (15-25%): Impulse + aspirational
           /__________________\
          /                    \
         /    FREE PLAYERS      \  ← Majority (60-80%): Ads, engagement
        /________________________\
```

### Revenue Streams Ranked

| Rank | Stream | Target ARPU | Notes |
|------|--------|-------------|-------|
| 1 | **Grundy Plus** | $0.75 | Predictable, high LTV |
| 2 | **Cosmetics** | $0.50 | Emotional, infinite SKUs |
| 3 | **Season Pass** | $0.25 | Seasonal engagement |
| 4 | **Gem Packs (IAP)** | $0.30 | Whale capture |
| 5 | **Ad Revenue** | $0.20 | Free player monetization |
| 6 | **Utility Items** | $0.10 | Inventory, pet slots, boosts |
| — | **Total Target ARPU** | **$2.10** | Healthy for cozy F2P |

### The Revenue Flywheel

```
Free Player Journey:
Play free → See cool cosmetics → Buy 1 small cosmetic (10-20💎)
         → Love the game → Consider Grundy Plus
         → Subscribe → Get discount → Buy MORE cosmetics
         → Event happens → Bonus tokens → Engage more
         → Stay subscribed longer
```

## 11.3 Monetization Model

**Hybrid model. Ethical. Player-first.**

| Tier | Price | Gets |
|------|-------|------|
| Free | $0 | 3 pets, full game, ads, free season track |
| Season Pass | $2.99/season | Premium season track (or free with Plus) |
| Grundy Plus | $4.99/mo | See Section 11.7 for full benefits |
| À la carte | $0.99-9.99 | Gem packs, bundles |

### What We DO

✅ Cosmetic-first design
✅ Transparent pricing (no hidden costs)
✅ Generous free track
✅ Grind OR pay options for all unlocks
✅ Clear value propositions
✅ Respect player time and money

### What We DON'T Do

❌ Pay-to-win mechanics (cosmetics never affect stats)
❌ Loot boxes (all purchases show exact contents)
❌ Energy paywalls for core gameplay
❌ Aggressive monetization during FTUE
❌ Dark patterns (no fake urgency, no bait-and-switch)
❌ Predatory timers (limited time = real limited time)

## 11.4 Gem Economy

### Gem Income Sources

| Source | Gems | Frequency | Notes |
|--------|------|-----------|-------|
| Level up | 5 | Per level | Reliable progression |
| First feed daily | 1 | Daily | Free players: 1/day |
| First feed daily (Plus) | 3 | Daily | Plus subscribers: 3/day |
| Mini-game Rainbow tier | 1-3 | Per achievement | Skill reward |
| Daily login (Day 7) | 10 | Weekly | Streak reward |
| Achievements | 5-50 | One-time | Milestone rewards |
| Season Pass (Premium) | ~100 | Per season | Spread across tiers |

### Free Player Gem Math

| Timeframe | Gems Earned |
|-----------|-------------|
| Daily | 1 (first feed) |
| Weekly | 7 + 10 (streak) = 17 |
| Monthly | ~75 |
| To unlock Fizz (50💎) | ~3 weeks |
| To unlock all pets (800💎) | ~11 months |

### Plus Subscriber Gem Math

| Timeframe | Gems Earned |
|-----------|-------------|
| Daily | 3 (first feed) |
| Weekly | 21 + 10 (streak) = 31 |
| Monthly | ~130 |
| To unlock Fizz | Already unlocked |
| All pets | Already unlocked |

### Gem Sinks

| Item | Cost | Category |
|------|------|----------|
| Fizz unlock | 50 💎 | Pet |
| Ember unlock | 100 💎 | Pet |
| Chomper unlock | 150 💎 | Pet |
| Whisp unlock | 200 💎 | Pet |
| Luxe unlock | 300 💎 | Pet |
| Runaway recovery | 25 💎 | Utility |
| Common cosmetics | 10-20 💎 | Cosmetic |
| Uncommon cosmetics | 20-40 💎 | Cosmetic |
| Rare cosmetics | 40-70 💎 | Cosmetic |
| Epic cosmetics | 70-120 💎 | Cosmetic |
| Legendary cosmetics | 120-300 💎 | Cosmetic |
| Pet slot (2nd) | 100 💎 | Utility |
| Pet slot (3rd) | 150 💎 | Utility |
| Pet slot (4th) | 200 💎 | Utility |
| Inventory expansion | 25-150 💎 | Utility |
| Legendary food | 5-10 💎 | Food |

### Gem Packs (IAP)

| Pack | Price | Gems | Bonus | Value/$ |
|------|-------|------|-------|---------|
| Small | $0.99 | 50 | — | 50.5 |
| Medium | $4.99 | 300 | +20% | 60.1 |
| Large | $9.99 | 700 | +40% | 70.1 |
| Mega | $19.99 | 1600 | +60% | 80.0 |

## 11.5 The Shop

### Shop Structure

```
┌─────────────────────────────────────────┐
│              THE SHOP                   │
├─────────────────────────────────────────┤
│  FOOD & CARE │ COSMETICS │ UTILITY │    │
│  BUNDLES │ EVENT (if active) │ GEMS    │
└─────────────────────────────────────────┘
```

### Shop Unlock Timeline

| Milestone | Shop Access |
|-----------|-------------|
| Tutorial complete | Shop icon appears (grayed) |
| First feeding complete | Shop unlocks |
| Bond Level 1 | Full shop access |

### Tab Visibility Rules

| Tab | Visible When | Notes |
|-----|--------------|-------|
| Food & Care | Always | Core tab |
| Cosmetics | Always | Aspirational browsing OK |
| Utility | Level 5+ | Avoid overwhelming new players |
| Bundles | Level 3+ | After basic loop established |
| Event | Event active | Auto-appears during events |
| Gems (IAP) | Level 5+ | Delayed monetization |

### Currency Usage in Shop

| Currency | Can Buy | Cannot Buy |
|----------|---------|------------|
| **Coins** 🪙 | Food, Care items | Rare+ cosmetics, Pet unlocks |
| **Gems** 💎 | Cosmetics, Pet unlocks, Utility, Premium bundles | Common items, Event exclusives |
| **Event Tokens** | Event shop items only | Anything outside event shop |

### Item Visibility Rules

| Condition | Visibility Rule |
|-----------|-----------------|
| Level-locked | Show grayed with "Unlocks at Level X" |
| Bond-locked | Show grayed with "Reach Bond X to unlock" |
| Mode-locked (Classic only) | Hidden entirely in Cozy mode |
| Contextual (e.g., Diet Food) | Only visible when relevant |
| Event items | Only visible during event |
| Already owned cosmetics | Show "Owned ✓" badge, not purchasable |

### "Recommended For You" Logic

| Pet State | Highlighted Items |
|-----------|-------------------|
| Hunger < 30 | Food bundles, balanced meals |
| Mood < 40 | Mood Boost, favorite foods |
| Energy < 20 | Energy Drink, Energy Refill |
| Weight ≥ Chubby | Diet Food |
| Sick (Classic) | Medicine |
| Near level-up | XP Boost |
| Has unspent gems | "You can afford this!" badge |

### Category 1: Food & Care Items

| Item ID | Name | Description | Cost | Unlock | Notes |
|---------|------|-------------|------|--------|-------|
| `food_apple_x5` | Apple Bundle | 5× Apples | 20 🪙 | None | Always available |
| `food_balanced_x5` | Balanced Meal Pack | 5× mixed common foods | 40 🪙 | None | Good starter |
| `food_spicy_x3` | Spicy Sampler | 3× Hot Peppers + 2× Tacos | 60 🪙 | Own Grib/Ember | Pet-contextual |
| `food_sweet_x3` | Sweet Treats | 3× Cookies + 2× Candy | 50 🪙 | Own Munchlet/Plompo | Pet-contextual |
| `food_rare_x1` | Rare Food Box | 1× random Rare food | 75 🪙 | Level 5+ | Introduces rare |
| `food_epic_x1` | Epic Feast | 1× Birthday Cake or Dream Treat | 5 💎 | Level 10+ | Premium food |
| `food_legendary_x1` | Golden Feast | 1× Golden Feast | 10 💎 | Level 15+ | Endgame food |
| `care_medicine` | Medicine 💊 | Cures sickness instantly | 50 🪙 | Classic Mode | Hidden in Cozy |
| `care_diet_food` | Diet Food 🥗 | -20 weight, +5 hunger | 30 🪙 | Weight ≥ Chubby | Contextual |
| `care_energy_drink` | Energy Drink ⚡ | +50 energy instantly | 25 🪙 | None | Mini-game players |
| `care_mood_boost` | Mood Boost 💖 | +30 happiness instantly | 40 🪙 | None | Quick fix |
| `care_cleaning_brush` | Cleaning Brush 🧹 | Auto-clean poop 1 hour | 10 🪙 | None | QoL |
| `care_sleep_potion` | Sleep Potion 😴 | Skip to wake time | 20 🪙 | Sleep cycle on | QoL |
| `care_wake_potion` | Wake Potion ☀️ | Wake pet early | 20 🪙 | Sleep cycle on | QoL |

### Category 2: Cosmetics (Gems Only)

| Item ID | Name | Rarity | Cost | Unlock | Notes |
|---------|------|--------|------|--------|-------|
| `cos_hat_cap_blue` | Blue Cap | Common | 10 💎 | None | Starter cosmetic |
| `cos_hat_bow_pink` | Pink Bow | Uncommon | 20 💎 | None | — |
| `cos_scarf_star` | Star Scarf | Rare | 45 💎 | Bond ≥ 5 | — |
| `cos_hat_moon` | Moon Hat | Epic | 80 💎 | Level 10+ | — |
| `cos_hat_crown` | Royal Crown | Legendary | 150 💎 | Level 20+ | Flex item |
| `cos_aura_sparkle` | Sparkle Aura | Rare | 60 💎 | Bond ≥ 20 | Visual effect |
| `cos_aura_rainbow` | Rainbow Aura | Legendary | 200 💎 | Bond ≥ 50 | Ultimate flex |
| `cos_outfit_cozy` | Cozy Sweater | Uncommon | 30 💎 | Bond ≥ 5 | Any pet |
| `cos_outfit_fancy` | Fancy Vest | Epic | 100 💎 | Level 15+ | — |
| `cos_skin_golden` | Golden Skin | Legendary | 300 💎 | Level 25+ | Ultimate flex |

### Cosmetic Rarity Pricing Guide

| Rarity | Gem Range | Visual Indicator |
|--------|-----------|------------------|
| Common | 10-20 💎 | Gray border |
| Uncommon | 20-40 💎 | Green border |
| Rare | 40-70 💎 | Blue border, subtle glow |
| Epic | 70-120 💎 | Purple border, glow |
| Legendary | 120-300 💎 | Gold gradient, sparkle |

### Category 3: Utility Items (Gems Only)

| Item ID | Name | Description | Cost | Unlock | Limit |
|---------|------|-------------|------|--------|-------|
| `util_pet_slot_2` | 2nd Pet Slot | Care for 2 pets simultaneously | 100 💎 | Level 5+ | 1 |
| `util_pet_slot_3` | 3rd Pet Slot | Care for 3 pets simultaneously | 150 💎 | Own slot 2 | 1 |
| `util_pet_slot_4` | 4th Pet Slot | Care for 4 pets simultaneously | 200 💎 | Own slot 3 | 1 |
| `util_inventory_1` | Inventory +5 | +5 food inventory capacity | 25 💎 | Level 5+ | 1 |
| `util_inventory_2` | Inventory +5 | +5 food inventory capacity | 50 💎 | Own tier 1 | 1 |
| `util_inventory_3` | Inventory +5 | +5 food inventory capacity | 100 💎 | Own tier 2 | 1 |
| `util_inventory_4` | Inventory +5 | +5 food inventory capacity | 150 💎 | Own tier 3 | 1 |
| `util_journal_hint` | Journal Hint | Reveals 1 undiscovered preference | 15 💎 | Bond ≥ 3 | Per preference |
| `util_cooldown_skip` | Digestion Skip | Remove feeding cooldown once | 5 💎 | None | Single use |
| `util_energy_refill` | Full Energy Refill | Restore energy to 50 | 10 💎 | None | Single use |
| `util_bond_boost` | Bond Boost (24h) | +25% bond gain for 24 hours | 25 💎 | Level 10+ | Single use |
| `util_xp_boost` | XP Boost (24h) | +25% XP gain for 24 hours | 25 💎 | Level 10+ | Single use |

### Category 4: Event Items (Example: Winter Event)

| Item ID | Name | Description | Cost | Notes |
|---------|------|-------------|------|-------|
| `event_winter_hat` | Snowflake Hat | Seasonal winter hat | 100 ❄️ | Exclusive |
| `event_winter_scarf` | Cozy Winter Scarf | Warm red scarf | 75 ❄️ | Exclusive |
| `event_winter_bg` | Snowy Background | Winter scene background | 200 ❄️ | Exclusive |
| `event_winter_food` | Hot Cocoa | +15 hunger, +20 mood | 25 ❄️ | Event food |
| `event_winter_aura` | Snowfall Aura | Gentle snow particles | 300 ❄️ | Legendary |

### Shop Hard Rules (Non-Negotiable)

| Rule | Enforcement |
|------|-------------|
| **No pay-to-win** | Cosmetics never affect stats. Ever. |
| **No loot boxes** | All purchases show exact contents before buy |
| **No dark patterns** | No fake urgency, no hidden costs, no bait-and-switch |
| **No aggressive FTUE monetization** | Shop grayed until Bond 1, IAP tab hidden until Level 5 |
| **No predatory timers** | "Limited time" must be real; no fake countdowns |
| **Gem-only items are cosmetic-only** | Utility items always have alternative path |

### Mode-Specific Shop Rules

| Mode | Shop Behavior |
|------|---------------|
| **Cozy Mode** | Care items (Medicine, Diet Food) hidden — not needed |
| **Cozy Mode** | No "Your pet is hungry!" → Shop prompts |
| **Cozy Mode** | Gentle shop — no urgency language |
| **Classic Mode** | Full shop access including care items |
| **Classic Mode** | Contextual prompts allowed (but not pushy) |

### Shop Interaction with Progression

| Question | Answer |
|----------|--------|
| Does buying food affect bond differently? | **No** — same bond/XP gain as earned food |
| Does buying food affect XP differently? | **No** — buying is a time shortcut only |
| Are there shop-related achievements? | **Yes** — see milestones below |

### Shop Milestones

| Milestone | Trigger | Reward |
|-----------|---------|--------|
| Window Shopper | Buy anything from shop | Badge, +10 🪙 back |
| Coin Roller | Spend 500 coins total | Badge |
| Shiny Hunter | Spend 100 gems total | Badge |
| Fashionista | Own 10 cosmetics | Badge, unlock Rare cosmetic |
| Style Icon | Own 25 cosmetics | Badge, unlock Epic cosmetic |
| Event Enthusiast | Buy 5 event items | Event-specific badge |

## 11.6 Pet Slots

### Overview

Base game: 1 active pet at a time (can switch between owned pets, but only actively care for one).

Pet slots allow caring for multiple pets simultaneously — each with their own hunger, mood, bond tracking.

### Pet Slot Pricing

| Slot | Cost | Cumulative | Discount with Plus |
|------|------|------------|-------------------|
| 1st | FREE | — | — |
| 2nd | 100 💎 | 100 💎 | 80 💎 (20% off) |
| 3rd | 150 💎 | 250 💎 | 120 💎 (20% off) |
| 4th | 200 💎 | 450 💎 | 160 💎 (20% off) |

**Grundy Plus:** Includes 1 slot (so subscribers start with 2 slots).

### Why Pet Slots Matter (Revenue)

| Benefit | Effect |
|---------|--------|
| More engagement | More pets = more reasons to open app |
| More cosmetic sales | Players dress up multiple pets |
| Natural progression sink | Long-term goal for dedicated players |
| Collector appeal | "Gotta care for 'em all" |

### Pet Slot Rules

- Each slot is independent (separate hunger, mood, bond)
- Switching between slotted pets is instant
- Notifications can come from any active pet
- All slotted pets share: Coins, Gems, Inventory

## 11.7 Inventory Slots

### Overview

Base inventory: 15 food slots. Players who hoard or play multiple pets may want more.

### Inventory Expansion Pricing

| Purchase | Cost | Slots Added | Total Inventory | Cumulative Spend |
|----------|------|-------------|-----------------|------------------|
| Base | — | 15 | 15 | — |
| 1st | 25 💎 | +5 | 20 | 25 💎 |
| 2nd | 50 💎 | +5 | 25 | 75 💎 |
| 3rd | 100 💎 | +5 | 30 | 175 💎 |
| 4th | 150 💎 | +5 | 35 | 325 💎 |

**Grundy Plus:** Base inventory is 25 (+10 bonus).

### Design Rationale

| Aspect | Reasoning |
|--------|-----------|
| **Low entry (25 💎)** | First purchase feels like a no-brainer |
| **Escalating cost** | Rewards early commitment |
| **Cap at 35 slots** | Enough for hoarders, not infinite whale bait |
| **Total: 325 💎** | ~$6.50 USD equivalent — reasonable "super fan" spend |
| **Base 15 is playable** | Cozy players never *need* to buy |

## 11.8 Grundy Plus (Subscription)

### Price Point

**$4.99/month** — Industry standard for cozy mobile games.

### Benefits Comparison

| Feature | Free | Grundy Plus |
|---------|------|-------------|
| Starter pets | 3 | **All 8 unlocked** |
| Ads | Interstitial + Rewarded | **No interstitials** (rewarded still available) |
| Daily gems | 1 (first feed) | **3 per day** |
| Pet slots | 1 | **2 included** |
| Inventory base | 15 | **25 (+10 bonus)** |
| Cosmetic discount | — | **20% off all cosmetics** |
| Exclusive cosmetics | — | **1 monthly exclusive** |
| Event bonus | — | **+25% event token earn rate** |
| Bond decay (away) | Normal | **50% slower decay** |
| Mini-game energy | 50 max | **75 max** |
| Welcome back gifts | Small | **2× welcome back rewards** |
| Season Pass premium | $2.99/season | **Included free** |

### Value Breakdown

| Benefit | Approximate Value |
|---------|-------------------|
| All 8 pets unlocked | 800 💎 = $16 (one-time) |
| 90 gems/month (3/day) | ~$1.80/month |
| Season Pass included | $2.99/month |
| 2nd pet slot | 100 💎 = $2 (one-time) |
| +10 inventory | 75 💎 = $1.50 (one-time) |
| 20% cosmetic discount | Varies |
| **Monthly ongoing value** | **~$4.79+** |

### Subscription Psychology

| Factor | Implementation |
|--------|----------------|
| **Instant gratification** | All pets unlock immediately |
| **Ongoing value** | Daily gems, monthly cosmetic |
| **Fear of loss** | "Keep your benefits" retention |
| **Social proof** | Plus badge visible to... self (single-player, but feels good) |

### Cancellation Behavior

| When Cancelled | What Happens |
|----------------|--------------|
| Immediately | Retain benefits until period ends |
| Period ends | Lose: Extra gems, discount, event bonus, season premium |
| Period ends | Keep: Unlocked pets, cosmetics, inventory, pet slots |

## 11.9 Season Pass

### Structure: Hybrid Model

```
SEASON PASS STRUCTURE

┌─────────────────────────────────────────────────────────────┐
│                    SEASON PASS                              │
│                  "Winter Wonderland"                        │
│                   28 days remaining                         │
├─────────────────────────────────────────────────────────────┤
│  TIER    FREE TRACK           PREMIUM TRACK                │
├─────────────────────────────────────────────────────────────┤
│   1      10 🪙                 + Snowflake Background       │
│   2      Common Food           + 20 💎                      │
│   3      15 🪙                 + Winter Scarf 🧣            │
│   5      20 🪙                 + 30 💎                      │
│   7      Rare Food             + Exclusive Hat 🎿           │
│  10      25 🪙 + 5 💎          + Seasonal Outfit (Rare)     │
│  15      Rare Food             + 50 💎                      │
│  20      50 🪙                 + Seasonal Aura (Epic)       │
│  25      10 💎                 + 75 💎                      │
│  30      100 🪙 + Badge        + LEGENDARY Exclusive ❄️     │
├─────────────────────────────────────────────────────────────┤
│  [ UNLOCK PREMIUM - $2.99 ]   or   ✓ Included with Plus    │
└─────────────────────────────────────────────────────────────┘
```

### Access Methods

| Player Type | Premium Track Access |
|-------------|---------------------|
| Free player | $2.99 one-time per season |
| Grundy Plus subscriber | Included automatically |

### Season Duration

- **28 days** per season (monthly)
- **4 seasons per year** (aligned with real seasons/holidays)
- Seasons announced 1 week before start

### Progression

XP earned from:
- Feeding (+5-15 per feed)
- Mini-games (+10-30 per game)
- Daily missions (+20-40)
- Event bonuses (during events)

**Formula:**
```
Tier XP Required = 100 + (TierIndex × 5)
```

### Season Pass Tier Template

| Tier | Free Track | Premium Track |
|------|------------|---------------|
| 1 | 10 🪙 | Seasonal Background |
| 2 | 5 🪙 | 15 💎 |
| 3 | Common Food ×2 | Seasonal Accessory (Common) |
| 5 | 15 🪙 | 25 💎 |
| 7 | Uncommon Food | Seasonal Accessory (Uncommon) |
| 10 | 25 🪙 + 5 💎 | Seasonal Outfit (Rare) |
| 15 | Rare Food | 50 💎 |
| 20 | 50 🪙 | Seasonal Aura (Epic) |
| 25 | 10 💎 | 75 💎 |
| 30 | 100 🪙 + Badge | **LEGENDARY Seasonal Exclusive** |

### Season Pass Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Free track is meaningful** | Real rewards — players feel valued |
| **Premium track is aspirational** | Exclusive cosmetics unavailable elsewhere |
| **Earnable by playing** | XP from normal gameplay — not pay-to-progress |
| **28-day seasons** | Monthly refresh, manageable commitment |
| **No harsh FOMO** | Missed tiers catchable with play |
| **Clear end date** | Players know when season ends |

### Premium Track Total Value

| Reward Type | Approximate Value |
|-------------|-------------------|
| ~100 💎 across tiers | $2 |
| 4-5 exclusive cosmetics | $4-6 (if sold individually) |
| Seasonal badge | Priceless (completionist appeal) |
| **Total** | **~$6-8 value for $2.99** |

## 11.10 Advertising

### Ad Philosophy

Ads are for free players. They should be:
- **Non-intrusive** — Never interrupt gameplay
- **Predictable** — Players know when to expect them
- **Optional when possible** — Rewarded > Forced
- **Removable** — Grundy Plus removes interstitials

### Ad Types

| Type | Description | Frequency |
|------|-------------|-----------|
| **Interstitial** | Full-screen, skippable after 5s | Between sessions |
| **Rewarded** | Opt-in for bonus | Player-initiated |
| **Banner** | ❌ NOT USED | — |

### Interstitial Ad Triggers

| Trigger | Frequency | Rules |
|---------|-----------|-------|
| After mini-game ends | Every 3rd game | Not after first daily game |
| Returning to app (>5 min background) | Once per return | Max 3 per day |
| After evolution | **Never** | Don't interrupt celebration |
| After purchase | **Never** | Don't punish spenders |
| During FTUE | **Never** | No ads until Bond 1 |
| After level up | **Never** | Don't interrupt celebration |
| After pet unlock | **Never** | Don't interrupt celebration |

**Daily Cap:** Maximum 6 interstitials per day.

**Grundy Plus:** No interstitials ever.

### Rewarded Ad Opportunities

| Reward | What Player Gets | Daily Limit |
|--------|------------------|-------------|
| Energy refill | +25 energy | 2 |
| Bonus coins | +25 🪙 after mini-game | 3 |
| Double XP | 2× XP on next feeding | 1 |
| Daily wheel spin | Extra spin on reward wheel | 1 |
| Mini-game revive | Continue after fail | 1 per game |
| Medicine (Classic) | Cure sickness free | 1 |

**Grundy Plus:** Rewarded ads still available (opt-in bonuses are player-friendly).

### Ad Placement Rules

| Rule | Enforcement |
|------|-------------|
| Never interrupt gameplay | Ads only at natural breaks |
| Never during emotional moments | No ads after reactions, level-ups, unlocks |
| Clear "Skip" timing | 5-second skip, always visible |
| No misleading close buttons | X button is real, not fake |
| Frequency cap | Max 6 interstitials per day |
| Always show ad indicator | "Ad" label visible before playing |

## 11.11 Bundles & Starter Packs

### Starter Pack (One-Time)

| Bundle | Price | Contents | Value |
|--------|-------|----------|-------|
| Starter Pack | $2.99 | 100 💎 + Fizz unlock + Rare Food ×3 | ~$4.50 |

**Rules:**
- Only available to accounts < 7 days old
- One purchase per account
- Appears as gentle prompt after Level 3

### Seasonal Bundles

| Bundle | Price | Contents | When |
|--------|-------|----------|------|
| Season Kickoff | $4.99 | 200 💎 + Season Pass + Exclusive cosmetic | Season start |
| Event Bundle | $2.99 | 150 Event Tokens + Event cosmetic | During events |
| Holiday Special | $9.99 | 500 💎 + 3 Exclusive cosmetics | Major holidays |

### Value Bundle Rules

- Bundles must offer minimum 30% bonus vs. buying separately
- Limited-time bundles have real end dates (no fake timers)
- All bundle contents shown before purchase
- No "mystery" bundles (no loot boxes)

## 11.12 Economy Data Schema

```typescript
interface ShopItem {
  id: string;                    // e.g., "food_apple_x5"
  category: 'food' | 'care' | 'cosmetic' | 'utility' | 'event' | 'bundle';
  name: string;
  description: string;
  cost: { currency: 'coins' | 'gems' | 'event'; amount: number };
  unlockCondition?: {
    type: 'level' | 'bond' | 'mode' | 'event' | 'owns_pet' | 'owns_item';
    value: number | string;
  };
  visibility: 'always' | 'conditional' | 'event_only' | 'mode_specific';
  contextualTrigger?: string;    // e.g., "hunger < 30"
  maxPurchases?: number;         // for limited items
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  plusDiscount?: number;         // e.g., 0.2 for 20% off
}

interface Subscription {
  id: 'grundy_plus';
  price: number;                 // 4.99
  billingPeriod: 'monthly';
  benefits: string[];
  activeUntil: Date;
}

interface SeasonPass {
  seasonId: string;              // e.g., "winter_2024"
  startDate: Date;
  endDate: Date;
  currentTier: number;
  tierXP: number;
  hasPremium: boolean;
  premiumSource: 'purchased' | 'plus' | null;
}
```

---

# 12. SOUND & VIBRATION

## 12.1 Sound Categories

### UI Sounds

| Trigger | Sound Name | Description | Duration |
|---------|------------|-------------|----------|
| Button tap | `ui_tap` | Soft, rounded click | 50ms |
| Button disabled | `ui_blocked` | Muted thud | 80ms |
| Menu open | `ui_menu_open` | Gentle whoosh up | 200ms |
| Menu close | `ui_menu_close` | Gentle whoosh down | 150ms |
| Modal appear | `ui_modal` | Soft pop | 100ms |

### Feeding Sounds

| Trigger | Sound Name | Description | Duration |
|---------|------------|-------------|----------|
| Feed (neutral) | `feed_basic` | Simple "nom" | 300ms |
| Feed (liked) | `feed_liked` | Happy "nom nom" | 400ms |
| Feed (loved) | `feed_loved` | Excited "NOM!" + sparkle | 500ms |
| Feed (disliked) | `feed_disliked` | Sad "bleh" + sputter | 400ms |
| Stomach full | `feed_full` | Burp + satisfied sigh | 500ms |

### Reward Sounds

| Trigger | Sound Name | Description | Duration |
|---------|------------|-------------|----------|
| XP gain | `reward_xp` | Soft ascending chime | 300ms |
| Coin gain | `reward_coin` | Coin clink | 200ms |
| Gem gain | `reward_gem` | Crystal shimmer | 400ms |
| Level up | `reward_levelup` | Triumphant jingle | 1500ms |
| Pet unlock | `reward_unlock` | Magical reveal fanfare | 2000ms |

### Pet Sounds

| Trigger | Sound Name | Description | Duration |
|---------|------------|-------------|----------|
| Pet happy idle | `pet_happy` | Content humming/purr | 800ms |
| Pet sad idle | `pet_sad` | Quiet whimper | 600ms |
| Pet hungry | `pet_hungry` | Tummy rumble | 500ms |
| Pet poop | `pet_poop` | Comedic plop | 300ms |
| Pet clean | `pet_clean` | Sparkle sweep | 400ms |
| Pet sleep | `pet_sleep` | Soft snore/zzz | 1000ms |

### Mini-Game Sounds

| Trigger | Sound Name | Description |
|---------|------------|-------------|
| Game start | `game_start` | Ready set go jingle |
| Catch good | `game_catch` | Satisfying pop |
| Miss food | `game_miss` | Soft buzz/thud |
| Combo increase | `game_combo` | Rising chime |
| Timer warning | `game_timer` | Tick tock (last 10s) |
| Game win | `game_win` | Tier-appropriate fanfare |

## 12.2 Background Music

| Track | Screen/Context | BPM | Duration | Loop |
|-------|----------------|-----|----------|------|
| `bgm_main` | Main gameplay | 90 | 120s | Yes |
| `bgm_shop` | Shop screen | 100 | 60s | Yes |
| `bgm_minigame` | Mini-games | 130 | 90s | Yes |
| `bgm_sleep` | Sleep mode | 60 | 180s | Yes |
| `bgm_event` | Special events | 110 | 90s | Yes |
| `bgm_sad` | Low mood/sick | 70 | 60s | Yes |

### Music Style Guide

| Attribute | Direction |
|-----------|-----------|
| Genre | Casual/cozy, chiptune-inspired but soft |
| Instruments | Soft synths, music box, gentle piano, light percussion |
| Mood | Warm, playful, not intrusive |
| Volume | Background level, doesn't compete with SFX |

## 12.3 Vibration Patterns

**Note:** Vibration only works on Android. iOS does not support web vibration API.

| Trigger | Pattern (ms) | Feel |
|---------|--------------|------|
| Button tap | `[10]` | Micro tick |
| Feed success | `[50]` | Soft thump |
| Feed loved | `[30, 30, 50]` | Happy double |
| Feed disliked | `[80]` | Dull thud |
| Level up | `[100, 50, 100, 50, 200]` | Celebration |
| Pet unlock | `[200, 100, 200]` | Fanfare |
| Coin gain | `[20]` | Light tap |
| Gem gain | `[30, 30]` | Sparkle double |
| Poop appear | `[40]` | Plop |
| Poop clean | `[20, 20, 20]` | Sweep |
| Error/blocked | `[50, 50, 50]` | Triple warning |
| Mini-game catch | `[15]` | Quick tap |
| Game win | `[100, 50, 100, 50, 150]` | Victory |

## 12.4 Audio Settings

| Setting | Options | Default |
|---------|---------|---------|
| Master Volume | 0-100% | 80% |
| Music Volume | 0-100% | 60% |
| SFX Volume | 0-100% | 100% |
| Vibration | On/Off | On |
| Mute All | On/Off | Off |

---

# 13. ANIMATION & VISUALS

## 13.1 Art Style Overview

### Style Keywords
- Soft, Whimsical, Approachable
- Expressive, Colorful without being childish
- Simple shapes, elegant polish

### Influences
- Pokémon idle animations (Gen 8–9)
- Alto's Adventure palette discipline
- Nintendo pet/creature games (Nintendogs, Miitopia)
- Modern hyper-casual shading (simple highlights + AO)

### Tone
- Warm, cozy, friendly
- Zero aggression
- Zero harsh noise or chaotic particles

## 13.2 Color Palette

### Primary Palette (UI + Characters)

| Color | Hex | Usage |
|-------|-----|-------|
| Warm Peach | #F4BFA0 | Characters, warmth |
| Sky Teal | #8EE0D1 | Accents, gems |
| Sunshine Yellow | #F2E38A | Highlights, rewards |
| Soft Purple | #C6B6F3 | Premium, XP |
| Coral Pink | #FF8A8A | Hearts, affection |
| Cream White | #FFF7ED | Backgrounds |

### Neutral/Support

| Color | Hex | Usage |
|-------|-----|-------|
| Charcoal | #3A3A3C | Text, outlines |
| Soft Gray | #CACCCD | Disabled states |
| Off-Black | #212121 | Primary text |

### Pet Colors

| Pet | Primary Color |
|-----|---------------|
| Munchlet | #fbbf24 (Golden Yellow) |
| Grib | #4ade80 (Green) |
| Plompo | #a78bfa (Purple) |
| Fizz | #3b82f6 (Blue) |
| Ember | #f97316 (Orange) |
| Chomper | #ef4444 (Red) |
| Whisp | #e2e8f0 (Silver/White) |
| Luxe | Gradient #fbbf24 → #a855f7 |

## 13.3 Animation States

### Universal States (All Pets)

| State | Trigger | Duration | Description |
|-------|---------|----------|-------------|
| Idle | No interaction | 2-3s loop | Gentle up/down breathing, occasional blink |
| Happy | Mood > 70 | 1s loop | Side-to-side wiggle, happy eyes |
| Sad | Mood < 30 | 3s loop | Droop down, slow sway |
| Hungry | Hunger < 30 | 2s loop | Look left/right, tummy pulses |
| Eating | On feed | 0.8s | Open mouth, chomp chomp, slight grow |
| Loved Reaction | Feed loved food | 1.2s | Jump up, spin 360°, hearts burst |
| Liked Reaction | Feed liked food | 0.8s | Small hop, single heart |
| Neutral Reaction | Feed neutral food | 0.6s | Simple nod, munch |
| Disliked Reaction | Feed disliked food | 1s | Shake head, tongue out |
| Sick | Sick state (Classic) | 2s loop | Shiver, green tint |
| Sleeping | Sleep mode | 4s loop | Eyes closed, slow breathing, "Zzz" |
| Excited | Level up, unlock | 1.5s | Rapid bouncing, sparkles |
| Stuffed | Stomach 5/5 | 1s | Belly expands, satisfied burp |
| Pooping | Poop event | 1.5s | Squat, strain face, pop/relief |

## 13.4 Expression System

### Eye States

| Expression | Symbol | When |
|------------|--------|------|
| Normal | ◕ | Default |
| Happy | ◠ | Mood > 70 |
| Sad | ◡ | Mood < 30 |
| Sleepy | ─ | Energy low |
| Closed | ● | Eating, sleeping |
| Hearts | ♥ | Loved food |
| Surprised | ◎ | Level up, unlock |
| Dizzy | @ | Sick |

### Mouth States

| Expression | Shape | When |
|------------|-------|------|
| Neutral | ─ | Default |
| Smile | ◡ | Happy |
| Frown | ◠ | Sad |
| Open | O | Eating, surprised |
| Tongue out | :P | Disliked food |

## 13.5 CSS Animation Examples

### Idle Bounce
```css
@keyframes idle-bounce {
  0%, 100% { transform: translateY(0) scale(1, 1); }
  50% { transform: translateY(-5px) scale(1.02, 0.98); }
}
.pet-idle { animation: idle-bounce 2s ease-in-out infinite; }
```

### Happy Wiggle
```css
@keyframes happy-wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}
.pet-happy { animation: happy-wiggle 0.5s ease-in-out infinite; }
```

### Loved Jump
```css
@keyframes loved-jump {
  0% { transform: translateY(0) rotate(0deg); }
  30% { transform: translateY(-30px) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(360deg); }
  100% { transform: translateY(0) rotate(360deg); }
}
.pet-loved { animation: loved-jump 1s ease-out; }
```

### Weight Visual Modifiers
```css
.pet-normal { transform: scale(1, 1); }
.pet-chubby { transform: scale(1.1, 1.05); }
.pet-overweight { transform: scale(1.2, 1.1); animation-duration: 1.5x; }
.pet-obese { transform: scale(1.3, 1.15); animation-duration: 2x; }
```

## 13.6 Asset Manifest & State System

### Art Style Requirements

| Requirement | Specification |
|-------------|---------------|
| **Primary aesthetic** | Cute, kawaii-inspired, approachable |
| **Mobile readability** | Clear silhouettes at 48-96px; no fine details that disappear on small screens |
| **Color philosophy** | Pastel-forward with one saturated accent per pet |
| **Line weight** | Consistent 2-3px outlines; no hairlines |
| **Expression clarity** | Emotions readable at a glance; exaggerated features |
| **File format** | PNG with transparency; 2x resolution for retina |

### Per-Pet Visual Identity

| Pet | Visual Identity | Key Traits |
|-----|-----------------|------------|
| **Munchlet** 🟡 | Warm golden yellow (#fbbf24), round/soft body | Big friendly eyes, perpetual slight smile, "huggable" proportions |
| **Grib** 🟢 | Vibrant green (#4ade80), angular/diamond shape | Sharp fanged grin, mischievous slit eyes, pointy silhouette |
| **Plompo** 🟣 | Soft purple (#a78bfa), wide blob shape | Half-lidded sleepy eyes, cloud-like edges, droopy posture |
| **Fizz** 🔵 | Electric blue (#3b82f6), jagged/spiky outline | Wide hyperactive eyes, lightning bolt accents, vibrating pose |
| **Ember** 🟠 | Warm orange (#f97316), flame silhouette | Fierce proud eyes, flame crown, confident stance |
| **Chomper** 🔴 | Bold red (#ef4444), round with huge mouth | Tiny eyes, massive jaw (60% of face), always slightly drooling |
| **Whisp** ⚪ | Silvery white (#e2e8f0), wispy/transparent edges | Empty circle eyes, fading edges, floats slightly off ground |
| **Luxe** ✨ | Gold-to-purple gradient, elegant oval with crown | Long lashes, pursed lips, permanent "judging you" expression |

### Primary Idle Sprites

| Pet | Primary Sprite | Notes |
|-----|----------------|-------|
| Munchlet | `munchlet_idle.png` | Clean, simple smile; gentle breathing animation |
| Grib | `grib_idle.png` | Sassy fanged grin; shifty eye movement |
| Plompo | `plompo_idle.png` | Half-asleep expression; slow drift motion |
| Fizz | `fizz_idle.png` | Vibrating in place; spark particles |
| Ember | `ember_idle.png` | Proud stance; flame flickers |
| Chomper | `chomper_idle.png` | Drooling; eyes tracking (looking for food) |
| Whisp | `whisp_idle.png` | Phasing opacity; gentle float |
| Luxe | `luxe_idle.png` | Posing; occasional hair flip |

### Display State System

The game computes a **display state** from the pet's current stats to determine which sprite/animation to show. Stats are evaluated in priority order — the first matching condition wins.

#### State Priority Order

```
1. Transient states (highest priority — triggered by actions)
   → eating, eating_loved, eating_liked, eating_disliked
   → excited (level up, unlock)
   → pooping
   
2. Status states (temporary conditions)
   → sick (Classic mode only)
   → sleeping (sleep cycle active)
   → stuffed (just fed to max)
   
3. Need states (stat-driven)
   → hungry (hunger < 30)
   → sad / crying (mood < 30, or neglect in Classic)
   
4. Ambient states (default fallbacks)
   → happy (mood > 70)
   → idle (default)
```

#### Stat-to-Art Mapping

| Game State | Stat Condition | Art State | Sprite Pattern |
|------------|----------------|-----------|----------------|
| **Hungry** | `hunger < 30` | `hungry` | `{pet}_hungry.png` |
| **Very Hungry** | `hunger < 15` | `hungry_urgent` | `{pet}_hungry_urgent.png` |
| **Sad** | `mood < 30` | `sad` | `{pet}_sad.png` |
| **Crying** | `mood < 15` OR neglect warning | `crying` | `{pet}_crying.png` |
| **Happy** | `mood > 70` | `happy` | `{pet}_happy.png` |
| **Ecstatic** | `mood > 90` OR loved food reaction | `ecstatic` | `{pet}_ecstatic.png` |
| **Sick** | `isSick === true` (Classic) | `sick` | `{pet}_sick.png` |
| **Sleeping** | `isSleeping === true` | `sleeping` | `{pet}_sleeping.png` |
| **Stuffed** | `hunger > 95` (just fed) | `stuffed` | `{pet}_stuffed.png` |

#### Feeding Reaction States

| Trigger | Art State | Duration | Sprite Pattern |
|---------|-----------|----------|----------------|
| Feed any food | `eating` | 0.8s | `{pet}_eating.png` |
| Feed loved food | `eating_loved` | 1.2s | `{pet}_eating_loved.png` |
| Feed liked food | `eating_liked` | 0.8s | `{pet}_eating_liked.png` |
| Feed disliked food | `eating_disliked` | 1.0s | `{pet}_eating_disliked.png` |

#### Event Reaction States

| Trigger | Art State | Duration | Sprite Pattern |
|---------|-----------|----------|----------------|
| Level up | `excited` | 1.5s | `{pet}_excited.png` |
| Pet unlock | `excited` | 2.0s | `{pet}_excited.png` |
| Mini-game win (Gold+) | `ecstatic` | 1.5s | `{pet}_ecstatic.png` |
| Bond milestone | `happy` | 1.0s | `{pet}_happy.png` |
| Poop event | `pooping` | 1.5s | `{pet}_pooping.png` |

#### State Resolution Logic

```typescript
function getDisplayState(pet: PetState): DisplayState {
  // 1. Transient states (check flags first)
  if (pet.isEating) return pet.eatingReaction; // 'eating_loved', etc.
  if (pet.isExcited) return 'excited';
  if (pet.isPooping) return 'pooping';
  
  // 2. Status states
  if (pet.isSick) return 'sick';
  if (pet.isSleeping) return 'sleeping';
  if (pet.hunger > 95 && pet.justFed) return 'stuffed';
  
  // 3. Need states (priority: hunger > mood)
  if (pet.hunger < 15) return 'hungry_urgent';
  if (pet.hunger < 30) return 'hungry';
  if (pet.mood < 15) return 'crying';
  if (pet.mood < 30) return 'sad';
  
  // 4. Ambient states
  if (pet.mood > 90) return 'ecstatic';
  if (pet.mood > 70) return 'happy';
  
  // 5. Default
  return 'idle';
}
```

#### Weight Modifier (Applied on Top of State)

Weight affects sprite scale, not sprite selection:

| Weight Level | Scale Modifier | Animation Speed |
|--------------|----------------|-----------------|
| Normal (0-30) | 1.0× | 1.0× |
| Chubby (31-60) | 1.1× | 1.0× |
| Overweight (61-80) | 1.2× | 0.85× |
| Obese (81-100) | 1.3× | 0.7× |

### Canonical Asset Reference

For the full list of sprite files, state mappings, and asset specifications, see `ASSET_MANIFEST.md`. That document is the canonical reference for:

- Complete filename list for all pets × all states
- Resolution and format specifications
- Animation frame counts and timing
- Expression component breakdowns (eyes, mouth, effects)
- Evolution stage sprite variants
- Cosmetic overlay specifications

**The Bible defines the system. The Asset Manifest defines the files.**

## 13.7 Production Art Rule

> ⚠️ **EMOJI/ORB ARE PLACEHOLDERS ONLY**
>
> | Build Type | Pet Display | Acceptable |
> |------------|-------------|------------|
> | Development/Testing | Colored orb or emoji (🟡🟢🟣) | ✅ Temporary |
> | Production/Release | Full sprites from `assets/pets/<petId>/` | ✅ Required |
> | App Store Build | Complete sprite set for all states | ✅ Mandatory |
>
> **Production builds must use the defined sprite set and display-state system.**
>
> A visual regression test should verify that NO emoji or placeholder orb appears where pet art should display.

### Test Requirement

```typescript
// Production build check
test('no emoji placeholders in production', () => {
  const petDisplay = render(<PetAvatar petId="munchlet" />);
  expect(petDisplay).not.toContainEmoji();
  expect(petDisplay).toHaveSprite('munchlet_idle.png');
});
```

---

# 14. UI/UX DESIGN

## 14.1 Orientation

**Portrait only.**

- One-handed casual play
- Pet large and centered
- Quick "Daily Moments" check-ins
- Differentiates from competitors

## 14.2 Shape Language

### Primary Shapes
- **Rounds & curves** dominate (no sharp angles)
- Pet silhouettes must be recognizable at 48–96px size
- Foods are simple, chunky, and stylized

### Proportion Rules
- Pets: 65% head, 35% body → increases expressiveness
- Eyes: large, oval, soft corners
- Limbs: simplified, abstracted (2–4 simple segments)
- No hyper-realistic textures

## 14.3 UI Art Direction

### Iconography
- Rounded-corner squares
- Slight outline (1–2px)
- No pure black edges

### Currency Icons
- Coins: warm golden, embossed edge
- Gems: teal polygon, soft facets
- Event Currency: themed per event (snowflake, leaf, sun)

### Card/Panel Style
- 2D flat with soft card dropshadows
- Opacity: 15–20%
- Blur: 8–12px
- Offset: 0, 2px

## 14.4 Environments [Web Phase 6+]

**Activity-based backgrounds (Rooms Lite)**

| Activity | Background |
|----------|------------|
| Feeding | Kitchen |
| Sleeping | Bedroom |
| Playing | Playroom |
| Default | Living room + time-of-day |

Not navigable. Context switches automatically based on activity.

### Platform Status Note

> **Web 1.0** ships a simplified version of Rooms Lite:
> - Static living room background
> - Time-of-day tint (morning/day/evening/night)
> - No activity-based room switching yet
>
> Full activity-based switching (Feeding→Kitchen, Sleeping→Bedroom, Playing→Playroom) is required for the "complete" implementation and is targeted for **Web Phase 6+**.

## 14.5 Navigation Structure [Web Phase 6+]

> **Current State:** Web 1.0 uses a bottom navigation bar (Home / Games / Settings). This section describes the **future menu-based structure** that will replace it in Phase 6+.

### Main Screen Layout

- **Only active pet visible** on home screen
- No "pet bar" showing all 8 pets simultaneously
- Pet selector accessed via Menu only

### Menu Button

- Hamburger icon (☰) in top-left corner
- Always visible during gameplay
- Tap to open slide-out menu

### Menu Options

| Option | Icon | Action |
|--------|------|--------|
| Switch Pet | 🐾 | Opens Pet Selector modal |
| Shop | 🛒 | Opens Shop screen |
| Mini-Games | 🎮 | Opens Mini-Game Hub |
| Settings | ⚙️ | Opens Settings panel |
| Home | 🏠 | Return to welcome (with confirmation) |

### Pet Switching UX

Switching Grundies is a **deliberate action**. Implementations must:

1. **Show lock status** — Clearly distinguish locked vs available pets
2. **Auto-save first** — Save current pet's state before switching
3. **Confirm switch** — Show confirmation when leaving current pet

```
┌─────────────────────────────────────┐
│        Switch to Grib?              │
│                                     │
│  Munchlet's progress will be saved. │
│  You can return anytime!            │
│                                     │
│     [Stay]        [Switch]          │
└─────────────────────────────────────┘
```

### Home Button Behavior

```
┌─────────────────────────────────────┐
│        Return to Home?              │
│                                     │
│  Your progress is auto-saved.       │
│  You can continue anytime!          │
│                                     │
│     [Stay]        [Go Home]         │
└─────────────────────────────────────┘
```

### Reset Progress (in Settings)

```
┌─────────────────────────────────────┐
│     ⚠️ Reset ALL Progress?          │
│                                     │
│  This will delete ALL pets, items,  │
│  and progress! Cannot be undone!    │
│                                     │
│     [Cancel]       [Reset]          │
└─────────────────────────────────────┘
```

### Save Model

Primary save model is **auto-save on significant actions**. Manual "Reset / New Save" flows must use clear confirmation UI.

> **Design Intent:** Navigation should feel deliberate. Switching pets or resetting requires confirmation to prevent accidental loss.

## 14.6 Mobile Layout Constraints [Web 1.0]

### Viewport Rule

On a typical phone viewport (360×640 to 414×896), the following must be visible **without vertical scrolling**:

| Element | Required | Notes |
|---------|----------|-------|
| Pet (main display) | ✅ Yes | Large, centered, 40-50% of viewport height |
| Primary actions | ✅ Yes | Feed button, at least one mini-game entry |
| Global nav | ✅ Yes | Home / Games / Settings accessible |
| Currency display | ✅ Yes | Coins and gems visible |
| Food tray | ✅ Yes | At least 4 food items visible |

### Prohibited in Main View

The following must **NOT** appear in the main scrollable area:

| Element | Where It Belongs |
|---------|------------------|
| Session stats / timers | Behind a drawer or panel |
| Detailed logs | Secondary screen |
| Debug counters | Dev builds only (see §4.4) |
| Extended inventory | Dedicated inventory screen |

### Design Intent

> Grundy is designed for **one-handed, quick check-in** mobile play. If the user has to scroll to see their pet or tap a button, the layout has failed.
>
> Extra dashboards, stats, and logs are welcome — but they must live in **drawers, panels, or secondary screens**, not the main column.

---

# 15. TECHNICAL SPECS

## 15.1 Platform Requirements

| Platform | Minimum |
|----------|---------|
| Android | 8.0+ |
| iOS | 14+ |
| Engine | Unity 2022 LTS |

## 15.2 PWA Support (Web Prototype)

### What PWA Adds

| Feature | Benefit |
|---------|---------|
| Install to Home Screen | App icon like native apps |
| Offline Support | Play without internet |
| Full Screen | No browser UI, immersive |
| Fast Loading | Cached assets |

### Platform Support

| Platform | Vibration | PWA Install |
|----------|-----------|-------------|
| Android Chrome | ✅ Full | ✅ Full |
| Android Firefox | ✅ Full | ✅ Full |
| iOS Safari | ❌ None | ✅ Add to Home Screen |
| Desktop | ❌ None | ✅ Chrome |

## 15.3 Data Structure

### Per-Pet State (Separate for Each Pet)

```typescript
interface PetState {
  level: number;
  xp: number;
  bond: number;
  mood: number;
  hunger: number;
  evolutionStage: 'baby' | 'youth' | 'evolved';
}
```

### Global State (Shared Across All Pets)

```typescript
interface GlobalState {
  activePetId: string;
  unlockedPets: string[];
  coins: number;
  gems: number;
  inventory: Record<string, number>;
  onboardingComplete: boolean;
  tutorialComplete: boolean;
  lastLoginDate: string;
  dailyFeedingDone: boolean;
  gameMode: 'cozy' | 'classic';
}
```

### Switching Pets Flow

```
1. Player taps Pet Selector
2. Current pet state auto-saved
3. Player selects new pet
4. Load selected pet's state
5. UI updates to reflect new pet
6. If locked, show unlock modal instead
```

## 15.4 Sound File Specs

| Attribute | Requirement |
|-----------|-------------|
| Format | MP3 (web), OGG backup |
| Sample rate | 44.1 kHz |
| Bit rate | 128 kbps (SFX), 192 kbps (music) |
| Channels | Stereo (music), Mono (SFX) |
| Loudness | Normalized to -14 LUFS |

## 15.5 Features to Wait for Unity

| Feature | Why Wait |
|---------|----------|
| Skeletal animation | Spine/DragonBones better in Unity |
| Physics-based motion | Secondary motion, jiggle physics |
| Blend trees | Smooth state transitions |
| Complex particle FX | Unity particle system |
| iOS Haptic Engine | Not available in web |
| Advanced audio mixing | Unity audio mixer |
| Adaptive music layers | Unity implementation |
| 3D spatial audio | If ever needed |

## 15.6 Web Prototype Mapping

### Current Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 |
| Language | TypeScript |
| State Management | Zustand |
| Styling | Tailwind CSS |
| Build | Single HTML file (inline bundle) |
| Deployment | GitHub Pages |

### File Structure

```
game/
├── App.tsx                 # Main app shell, routing
├── store.ts                # Zustand store (GameState)
├── components/
│   ├── Pet.tsx             # Pet display + animations
│   ├── FoodTray.tsx        # Food selection UI
│   ├── HUD.tsx             # Currency, stats display
│   ├── Shop.tsx            # Shop screens
│   ├── MiniGame.tsx        # Mini-game wrapper
│   └── Settings.tsx        # Settings panel
├── data/
│   ├── pets.ts             # Pet definitions
│   ├── foods.ts            # Food database
│   └── shop.ts             # Shop item catalog
├── utils/
│   ├── gameLogic.ts        # Core game calculations
│   ├── stateMapping.ts     # Stat → display state
│   └── sound.ts            # Audio manager
└── assets/
    └── sprites/            # Pet sprites (see ASSET_MANIFEST.md)
```

### Store Shape (Zustand)

```typescript
interface GameState {
  // Active pet
  activePetId: string;
  pets: Record<string, PetState>;
  
  // Economy
  coins: number;
  gems: number;
  inventory: Record<string, number>;
  
  // Progression
  unlockedPets: string[];
  achievements: string[];
  
  // Session
  gameMode: 'cozy' | 'classic';
  lastFeedTime: number;
  dailyFeedingDone: boolean;
  
  // Actions
  feedPet: (foodId: string) => void;
  switchPet: (petId: string) => void;
  playMiniGame: (gameId: string) => void;
  purchaseItem: (itemId: string) => void;
}
```

### Bible vs. Prototype Authority

> **When code and design disagree, this Bible describes intent.**
> 
> The web prototype may lag behind this specification and should be refactored toward it. Agents and developers should:
> 
> 1. **Read the Bible first** — understand intended behavior
> 2. **Check the prototype** — see current implementation
> 3. **If they conflict** — the Bible is correct; update the code
> 4. **If the Bible is silent** — check the prototype, then propose a Bible addition

### Known Prototype Gaps (Updated December 2024)

| Feature | Bible Spec | Web 1.0 Status | Target Phase |
|---------|------------|----------------|--------------|
| Pet Slots (multi-pet) | 1-4 slots | ✅ Implemented | — |
| Mini-Games | 4+ games | ✅ 5 games | — |
| FTUE | Full onboarding | ✅ Implemented | — |
| Audio System | SFX + music | ✅ Implemented | — |
| PWA Support | Installable | ✅ Implemented | — |
| **Feeding cooldown** | 30-min timer | ❌ Not implemented | Phase 6 |
| **Fullness states** | 5 states, STUFFED blocks | ❌ Not implemented | Phase 6 |
| **Navigation** | Menu-based pet select | ❌ Not implemented | Phase 6 |
| **Room switching** | Activity-based | ⚠️ Partial (time-of-day only) | Phase 6 |
| Classic Mode | Full neglect system | ⚠️ Partial | Phase 6+ |
| Shop categories | 4 tabs + event | ⚠️ Basic only | Phase 6+ |
| Season Pass | 30-tier hybrid | ❌ Not implemented | Unity |
| Inventory expansion | 15→35 slots | ❌ Not implemented | Unity |
| Rewarded ads | 6 opportunities | ❌ Not implemented | Unity |

*This table should be updated as the prototype catches up.*

### Critical Gaps (Phase 6 Priority)

The following gaps break core Bible requirements and are the **first priority for Phase 6**:

| Gap | Bible Section | Impact |
|-----|---------------|--------|
| No cooldown | §4.3 | Players can spam-feed, trivializing progression |
| No fullness block | §4.4 | STUFFED state doesn't prevent feeding |
| All pets at top | §14.5 | Violates "deliberate switching" design |
| Home button broken | §14.5 | Navigation dead end |

> **Note:** These are tagged [Web Phase 6+] throughout the Bible. Phase 6.0.1 (the first Phase 6 patch) should prioritize these core loop fixes before other Phase 6 features.

---

# 16. COVERAGE NOTES

## 16.1 GAP Sections

No sections in this Bible were created without source material. All content was consolidated from the 9 source documents.

## 16.2 Unmapped Source Content (Deliberately Excluded)

| Source Doc | Section | Reason |
|------------|---------|--------|
| grundy_complete_game_bible_v3.md | 32. Analytics & Events | Implementation-specific; belongs in separate analytics doc |
| grundy_complete_game_bible_v3.md | 33. Notification System | Implementation-specific; belongs in separate notification doc |
| grundy_complete_game_bible_v3.md | 34. Development Backlog | Ephemeral; belongs in separate TODO list |
| grundy_complete_game_bible_v3.md | 35. QA Protocol | Implementation-specific; belongs in separate QA doc |
| grundy_complete_game_bible_v3.md | 36. Soft Launch Plan | Business planning; belongs in separate launch doc |
| grundy_complete_game_bible_v3.md | 37. Post-Launch Roadmap | Business planning; belongs in separate roadmap doc |
| All ticket sections (WEB-XXX) | Development tickets | Ephemeral; belongs in separate TODO/Jira |
| All test case sections | QA test cases | QA-specific; belongs in separate test doc |
| GRUNDY_LORE_CODEX.md | Implementation Notes (writing style guide) | Meta-documentation for writers, not game content |

## 16.3 Source Documents Consolidated

| # | Document | Primary Contribution |
|---|----------|---------------------|
| 1 | GRUNDY_LORE_CODEX.md | All pet lore, world rules, journal system |
| 2 | GRUNDY_ONBOARDING_FLOW.md | Complete FTUE specification |
| 3 | GRUNDY_MASTER_DECISIONS.md | Locked design decisions, core identity |
| 4 | grundy_complete_game_bible_v3.md | Systems, economy, art direction |
| 5 | GRUNDY_GAME_BIBLE_v4_ADDENDUM.md | 5 new pets, abilities, unlock system |
| 6 | GRUNDY_HYBRID_MODE_DESIGN.md | Cozy/Classic modes, events |
| 7 | GRUNDY_PWA_MINIGAMES_DESIGN.md | All 4 mini-games, PWA specs |
| 8 | GRUNDY_SOUND_VIBRATION_DESIGN.md | Audio/haptic specifications |
| 9 | GRUNDY_PET_ANIMATION_DESIGN.md | Animation states, visual design |

## 16.4 Post-Consolidation Additions

The following sections were expanded beyond the original 9 source documents through design discussion:

| Section | Addition | Rationale |
|---------|----------|-----------|
| 11.5 The Shop | Complete item catalog with IDs, categories, unlock conditions, contextual visibility | Original sources lacked item-level specificity for implementation |
| 11.6 Pet Slots | Multi-pet care system (1-4 slots, escalating pricing) | New monetization feature not in original docs |
| 11.7 Inventory Slots | Escalating expansion pricing (25→150💎) | New monetization feature not in original docs |
| 11.8 Grundy Plus | Expanded benefits table, value breakdown, cancellation behavior | Original docs had basic tier only |
| 11.9 Season Pass | Hybrid model (free track + premium via $2.99 OR Plus) | Original docs lacked pass structure |
| 11.10 Advertising | Interstitial triggers, rewarded ad opportunities, placement rules | Original docs referenced ads but lacked specifics |
| 11.11 Bundles | Starter pack, seasonal bundles, value rules | New content for implementation |
| 11.12 Economy Data Schema | TypeScript interfaces for ShopItem, Subscription, SeasonPass | New technical spec for implementation |
| 13.6 Asset Manifest & State System | Per-pet visual identity, primary sprites table, stat-to-art mapping, state resolution logic | Bridges design intent to implementation; references ASSET_MANIFEST.md |

### Design Decisions Made

| Decision | Choice | Reasoning |
|----------|--------|-----------|
| Cosmetics currency | Gems only | Protects gem value, makes cosmetics aspirational |
| Event token expiration | Hard expire at event end | Prevents hoarding, drives engagement |
| Grundy Plus price | $4.99/month | Industry standard for cozy mobile |
| Pet slots in Plus | 1 included + 20% discount on more | Balanced value without giving everything |
| Season Pass model | Hybrid (standalone $2.99 OR included in Plus) | Captures both segments |
| Ad types | Interstitial + Rewarded (no banners) | Non-intrusive, player-friendly |

## 16.5 Related Documents

The following documents support this Bible but are **subordinate** to it. If conflicts exist, this Bible wins.

| Document | Purpose | When to Use |
|----------|---------|-------------|
| `ASSET_MANIFEST.md` | Complete sprite/state file list | Art production, sprite implementation |
| `GRUNDY_LORE_CODEX.md` | Raw lore source, extended flavor text | Writing pet dialogue, lore journal content |
| `GRUNDY_ONBOARDING_FLOW.md` | Detailed FTUE scripting, exact timing | Implementing tutorial sequence |
| `GRUNDY_MASTER_DECISIONS.md` | Historical decision log | Understanding "why" behind locked decisions |
| `grundy_complete_game_bible_v3.md` | Legacy GDD (superseded) | Historical reference only |
| `GRUNDY_GAME_BIBLE_v4_ADDENDUM.md` | Legacy addendum (superseded) | Historical reference only |

### Document Hierarchy

```
GRUNDY_MASTER_BIBLE.md          ← CANONICAL (wins all conflicts)
    │
    ├── ASSET_MANIFEST.md       ← Detailed file inventory
    │
    ├── GRUNDY_LORE_CODEX.md    ← Extended lore content
    │
    ├── GRUNDY_ONBOARDING_FLOW.md ← Detailed FTUE scripts
    │
    └── [Legacy docs]           ← Reference only, do not implement from
```

---

# END OF MASTER BIBLE

**Prepared by:** Consolidation from 9 source documents + design expansion
**For:** Development, Art, QA, and Production Teams
**Status:** Single Source of Truth
**Last Updated:** December 2024 (v1.4)

---

*"Some questions aren't meant to be answered. Only lived."*
