# Pokémon League GM: how to work on this repo

## This is the `v2` branch (Pokémon League GM 2.0)

2.0 is a full rework, built here until it is ready to replace the live game. The plan is the Project doc `claude/game-design-v2.md`. On this branch these rules replace the matching ones below:

- **Work on `v2`, never `main`.** Clone, then `git checkout v2`. Pull, commit and push `v2` only. `main` and the live GitHub Pages site stay at the last 1.x version (v203) until the user says 2.0 goes live.
- **Don't copy the built HTML to the repo root** on this branch. The root `Pokémon League GM.html` and `index.html` are the live 1.x game.
- **Version numbers:** each `UPDATES` entry keeps a whole-number `id` that goes up by one per chat (it orders the changelog and drives the "new updates" dot), plus a `ver` string that players see: `2.0.0`, `2.0.1`… One new `ver` per chat. The build names its files from `ver`.
- **Saves:** 2.0 uses its own save key (`plgm2-save`) and never reads or writes 1.x saves.
- **Build stages** (see the design doc). Built through 2.0.1: 1 hands-off trainers; 2 parties, world structure and party life; 3 ambition, requests, promises, trades; 4 trust, sit-downs, the ranch as a shared pool, the Hall; 5 trading (one-for-one, trade offers, the trade block, and the trade desk for up to three trainers each way); 6 (part) the Team Battle Cup; god mode (Leagues, parties, teams, and the trainer and roster editor). **Not built:** multi battles, which need a doubles battle engine (see `TODO.md`).
- **New engine pieces:** `game/4b-engine-2b.js` (ambition, trust, sit-downs, trades, the ranch pool, the Team Battle Cup) and `game/4c-engine-2c.js` (trade desk, asking a chaser to step down, coming home by ambition, the god-mode editor) sit between `4-engine-2.js` and `5-engine-3.js` in `build.py`. The party and world-structure code is at the end of `4-engine-2.js`.
- **Tests** are in `tests/` (run after a build): `node tests/sim.js <leagues> <teams> <parties> <growth 0/1> <seasons> <god 0/1>` sims seasons while making trades, step-down asks and god-mode edits, and checks every party has at most 3 chasers, 2 companions and 1 apprentice, nobody holds two ranch loans and rosters stay consistent. `python3 tests/browser.py "$PWD/dist/Pokémon League GM.html"` plays three seasons through the real page. `python3 tests/unused.py` lists functions and click handlers nothing can reach; it should print nothing.
- **Balance (first pass done in 2.0.0):** `PARTY_PACE` 0.9 (all level gains), Elite Four 81/84/87/89, Champion 96/97. In sims (2 worlds x 20 seasons each): 4 teams, 1 League about 11 qualifiers, 2.4 reach the Champion, 40% title changes; 8 teams about 19 qualifiers and 60%; 4 teams, 2 Leagues 45%. The 8-team case still runs hot. Re-check after any change to growth, roles or circuit size.
- **Clean-up done in 2.0.1:** the old per-trainer choice screens, handlers and engine paths are gone (weekly plans, catch/item/Mega pickers, registration step, snag/trade/legendary panels, tournament prize picker, ranch hand-out and resting). `simWeek()` takes no arguments now.

This repo is the only master copy of the game. Every chat works the same way: clone, build, change, test, push.

## Layout
- `game/`: the source pieces plus `build.py`. Edit these.
- `tests/`: the checks to run before pushing (see the v2 notes above).
- `Pokémon League GM.html` and `index.html` (root): the built game (two identical copies), rebuilt from `game/` on every push. Never edit them by hand. `index.html` is the live GitHub Pages site; `.nojekyll` tells Pages to serve files as they are.
- `archive/`: old files kept for reference only. Never build from them.
- `TODO.md`: ideas the user has tabled for later. Add tabled ideas here; remove them once built.
- `dist/` (not committed): build output.

| Piece | What's in it | Starts at |
|---|---|---|
| `1-page.html` | page head, styles, app container | top of the file |
| `2-pokemon-data.js` | all Pokémon data: SPECIES_RAW, LEGENDS_RAW, BASE_STATS_RAW, PARADOX_RAW, BABY_RAW, MEGA_RAW, MOVES_RAW, SIG_MOVES, ABILITY_RAW | `// ================= POKÉMON DATA =================` |
| `3-engine-1.js` | engine: types, species, world constants, trainers, battle, moves, abilities, items, stats | `// ================= HALCYON LEAGUE ENGINE =================` |
| `4-engine-2.js` | engine: legendary partners, season, villains, awards, legacy, legendary events, Midseason Tournament, teams, League, offseason | `// ================= LEGENDARY PARTNERS (v166) =================` |
| `4b-engine-2b.js` | engine (2.0): ambition, trust, sit-downs, trades, the ranch as a shared pool, the Team Battle Cup | `// ================= AMBITION, TRUST, SIT-DOWNS AND TRADES (2.0) =================` |
| `4c-engine-2c.js` | engine (2.0.1): trade desk, step-downs, the god-mode trainer and roster editor | `// ================= TRADE DESK, STEP-DOWNS AND THE GOD-MODE EDITOR (2.0.1) =================` |
| `5-engine-3.js` | engine: draft, famous trainers, Champion's reward, team ranch, registration, My Pokédex, sim, save/new world; ends with `module.exports` | `// ================= DRAFT =================` |
| `6-ui-1.js` | interface: helpers, header, setup, Advanced options, office, trainer screen, profiles | `// ================= HALCYON LEAGUE UI =================` |
| `7-ui-2.js` | interface: standings, trainers, records, Hall of Fame, recap, reward, registration, gifts, team ranch, draft, glossary, tournament | `// ---------- standings ----------` |
| `8-ui-3.js` | interface: `const UPDATES = [` (the changelog) and everything after it | `const UPDATES = [` |
| `9-end.html` | closing tags | after the last `</script>` |

The build joins 3+4+4b+4c+5 into one script and 6+7+8 into another; the Pokémon data loads first as its own script. A piece over 240 KB makes the build stop: split it at a section comment and update the lists in `build.py` and in this table.

## Start of every chat
1. Clone the repo (or `git pull` if it's already cloned).
2. `python3 game/build.py game dist`. Note the version it prints: that's the current version.
3. If the user attached an HTML file, compare its newest `id:` (first `id:` after `const UPDATES = [`) with the built version. If theirs is newer, ask before doing anything. If it's the same or older, ignore the attachment.

The user should never need to upload the game.

## Making changes
- Edit the pieces in `game/`, never the built HTML.
- New Pokémon, moves and abilities go in `game/2-pokemon-data.js`.
- One chat = one new version number: add one entry at the top of `UPDATES` in `game/8-ui-3.js` (next `id`, the date, and an Eastern Time timestamp). All changes in the chat go into that one entry.

## Testing (before every push)
- `dist/engine-node.js` (data + engine) can be `require`d in Node: `newWorld(ALL_ORG_KEYS[0])`, then `simOneSeason()` several times, with no errors.
- Load `dist/Pokémon League GM.html` and `dist/itch/index.html` in a headless browser (Playwright) and check there are no page errors.

## End of every chat
1. `git pull` first. If someone pushed a newer version in the meantime, merge their changes in and give this chat's work the next version number; never overwrite theirs.
2. Rebuild, copy `dist/Pokémon League GM.html` to the repo root **as both `Pokémon League GM.html` and `index.html`**, and commit `game/` plus both root files with a message naming the version (e.g. `v191: Team ranch fixes`). `index.html` is what GitHub Pages serves at https://meanchickenparm.github.io/PokemonLeagueGM/, so it must always match.
3. Push to `main`.
4. Send the user `Pokémon League GM.html` and `pokemon-league-gm-v<N>-itch.zip` (from `dist/`). The zip holds `index.html` and `pokemon-data.js` side by side at its root.

## Never build from
- `archive/`
- The published artifact "Pokémon League GM" (frozen at v181)
- Any copy of the game in the claude.ai Project (the old ones were deleted on Nov 3, 2026; this repo replaced them)
- Files from an earlier chat's workspace
