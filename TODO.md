# Pokémon League GM: to-do list

Ideas the user has tabled for later. Not built yet. Remove an item once it ships.

## Doubles format for the Midseason Tournament
Tabled Nov 3, 2026 (at v192).

- **Idea:** Midseason Tournament battles become double battles; gyms, the Elite Four and the Champion stay singles.
- **Work involved:** `battle()` in `game/3-engine-1.js` (~500 lines) assumes one active Pokémon per side. Doubles needs a target tag on every move in `MOVES_RAW` (single / spread / ally, spread at ×0.75), move-and-target AI for two Pokémon, four-way speed order, reworked switch-in and field abilities (Intimidate, weather, Flower Veil, Synchronize, hazards, KO replacement), and a two-slot replay viewer (`battleShell` / `startPlayback` in `game/8-ui-3.js`).
- **Cheaper option:** "lite doubles" (two active each, random foe targets, no spread or ally effects), about a third of the work but loses most of the doubles feel.
- **Expected effect on winners (singles baseline, 8 simmed seasons at v192):** the stronger team wins ~62% of tournament matches; when one side has the better ace and the other the deeper team, the ace side wins ~59%. Doubles should shift this toward deep, balanced teams, favor speed, spread moves and Intimidate, and add some upsets. Re-sim after building to confirm.

## Multi battles (2.0)
Left out of 2.0.1 (Nov 12, 2026). The 2.0 design lists multi battles after the Team Battle Cup, and they need the doubles battle engine described above. Build doubles first; multi battles (two trainers a side) and the doubles Midseason Tournament can then share it.

## Smaller 2.0 follow-ups
- **Party count limit:** still the placeholder (one new party per team every 3 seasons). To be settled after play-testing.
- **AI teams and step-downs:** only the player can ask a chaser to step down; other teams just re-pick their chasers each offseason.
- **Trade desk:** other teams never ask you for a draft pick, because picks can only be added, not taken away.
