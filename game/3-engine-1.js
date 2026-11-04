// ================= HALCYON LEAGUE ENGINE =================
const rand = Math.random;
const ri = (a, b) => a + Math.floor(rand() * (b - a + 1));
const pick = a => a[Math.floor(rand() * a.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

const TYPES = ['Normal','Fire','Water','Electric','Grass','Ice','Fighting','Poison','Ground','Flying','Psychic','Bug','Rock','Ghost','Dragon','Dark','Steel','Fairy'];
const CHART = {
  Normal:[[],['Rock','Steel'],['Ghost']],
  Fire:[['Grass','Ice','Bug','Steel'],['Fire','Water','Rock','Dragon'],[]],
  Water:[['Fire','Ground','Rock'],['Water','Grass','Dragon'],[]],
  Electric:[['Water','Flying'],['Electric','Grass','Dragon'],['Ground']],
  Grass:[['Water','Ground','Rock'],['Fire','Grass','Poison','Flying','Bug','Dragon','Steel'],[]],
  Ice:[['Grass','Ground','Flying','Dragon'],['Fire','Water','Ice','Steel'],[]],
  Fighting:[['Normal','Ice','Rock','Dark','Steel'],['Poison','Flying','Psychic','Bug','Fairy'],['Ghost']],
  Poison:[['Grass','Fairy'],['Poison','Ground','Rock','Ghost'],['Steel']],
  Ground:[['Fire','Electric','Poison','Rock','Steel'],['Grass','Bug'],['Flying']],
  Flying:[['Grass','Fighting','Bug'],['Electric','Rock','Steel'],[]],
  Psychic:[['Fighting','Poison'],['Psychic','Steel'],['Dark']],
  Bug:[['Grass','Psychic','Dark'],['Fire','Fighting','Poison','Flying','Ghost','Steel','Fairy'],[]],
  Rock:[['Fire','Ice','Flying','Bug'],['Fighting','Ground','Steel'],[]],
  Ghost:[['Psychic','Ghost'],['Dark'],['Normal']],
  Dragon:[['Dragon'],['Steel'],['Fairy']],
  Dark:[['Psychic','Ghost'],['Fighting','Dark','Fairy'],[]],
  Steel:[['Ice','Rock','Fairy'],['Fire','Water','Electric','Steel'],[]],
  Fairy:[['Fighting','Dragon','Dark'],['Fire','Poison','Steel'],[]],
  // v184: Missingno's glitch type. Neutral against everything, and everything is neutral against it. It's kept out of
  // TYPES, so it never becomes a gym type, a trainer's specialty or a Delta type.
  Bird:[[],[],[]],
};
// v193: the Midseason Tournament's special rule, set only while its battles run (see TOURNEY_RULES)
let BATTLE_RULE = null;
function effOne(a, d) { const c = CHART[a]; const r = c[2].includes(d) ? 0 : c[0].includes(d) ? 2 : c[1].includes(d) ? 0.5 : 1;
  // Inverse Battle: super effective becomes not very effective, and resisted hits and immunities become super effective
  return BATTLE_RULE === 'inverse' ? (r === 2 ? 0.5 : r === 1 ? 1 : 2) : r; }
function bestMult(atkTypes, defTypes) {
  let best = 0;
  for (const a of atkTypes) { let m = 1; for (const d of defTypes) m *= effOne(a, d); if (m > best) best = m; }
  return best === 0 ? 0.25 : best;
}

// SPECIES_RAW (regular species): in pokemon-data.js

// LEGENDS_RAW (legendaries and mythicals): in pokemon-data.js
// BASE_STATS_RAW (six-stat spreads): in pokemon-data.js
const STAT_KEYS = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
const BASE_STATS = {};
for (const line of BASE_STATS_RAW.split('\n')) { const [n, ...v] = line.split('|'); BASE_STATS[n] = v.map(Number); }
// a species' spread, worked out once (some species are added to SP after this point)
function bsOf(sp) { const s = SP[sp]; return s.bs || (s.bs = spreadFor(sp, s.bst)); }
// a species' base stats scaled to a BST; anything without data gets an even spread
function spreadFor(name, bst) {
  const raw = BASE_STATS[name];
  if (!raw) return Object.fromEntries(STAT_KEYS.map(k => [k, bst / 6]));
  const sum = raw.reduce((a, x) => a + x, 0), k = bst / sum;
  return Object.fromEntries(STAT_KEYS.map((key, i) => [key, raw[i] * k]));
}
const SP = {};
for (const line of SPECIES_RAW.split('\n')) {
  const [name, t1, t2, bst, evo, flags = ''] = line.split('|');
  const s = { name, types: [t1, t2].filter(Boolean), bst: +bst, rare: flags.includes('r'), starter: flags.includes('s') };
  if (evo) { s.evos = evo.split('/').map(e => { const [to, l] = e.split('@'); return { to, lvl: +l }; }); s.evo = s.evos[0]; }
  SP[name] = s;
}
// PARADOX_RAW (Paradox Pokémon): in pokemon-data.js
const PARADOX = [];
const LEGENDS = [];
for (const line of PARADOX_RAW.split('\n')) { const [name, t1, t2, bst] = line.split('|'); SP[name] = { name, types: [t1, t2].filter(Boolean), bst: +bst, paradox: true }; PARADOX.push(name); }
for (const line of LEGENDS_RAW.split('\n')) { const [name, t1, t2, bst] = line.split('|'); SP[name] = { name, types: [t1, t2].filter(Boolean), bst: +bst, legend: true }; LEGENDS.push(name); }
// v184: Missingno. A legendary in every rule (one in the world, a partner for a set time, never traded), but not in
// LEGENDS, so it's never part of any reward, roamer, storm or encounter pool. It only arrives through its own glitch.
SP.Missingno = { name: 'Missingno', types: ['Bird'], bst: 600, legend: true, glitch: true };
// its six stat values (they always add up to 600); every battle deals them out to its six stats at random
const GLITCH_STATS = [160, 136, 110, 84, 70, 40];
const glitchSpread = () => { const v = shuffle(GLITCH_STATS); return Object.fromEntries(STAT_KEYS.map((k, i) => [k, v[i]])); };
const isGlitch = sp => !!(SP[sp] && SP[sp].glitch);
// BABY_RAW (baby legendaries and rare finds): in pokemon-data.js
const BABY_LEGENDS = [];
for (const line of BABY_RAW.split('\n')) {
  const [name, t1, t2, bst, evo, label] = line.split('|');
  SP[name] = { name, types: [t1, t2].filter(Boolean), bst: +bst, baby: true, label: label || (evo ? 'Baby legendary' : 'Mythical') };
  // Calyrex is a legendary that turns up as a rare find instead of in the Champion's reward pool
  if (name === 'Calyrex') SP[name].legend = true;
  if (evo) { SP[name].evos = evo.split('/').map(e => { const [to, l] = e.split('@'); return { to, lvl: +l }; }); SP[name].evo = SP[name].evos[0]; }
}
const EVOLVED = new Set(Object.values(SP).filter(s => s.evos).flatMap(s => s.evos.map(e => e.to)));
for (const n of Object.keys(SP)) if (SP[n].baby && !EVOLVED.has(n)) BABY_LEGENDS.push(n);
const BASES = Object.keys(SP).filter(n => !EVOLVED.has(n) && !SP[n].legend && !SP[n].paradox && !SP[n].baby);
const STARTERS = BASES.filter(n => SP[n].starter);
const LINE = {};
function markLine(name, root) { LINE[name] = root; for (const e of SP[name].evos || []) markLine(e.to, root); }
for (const b of BASES) markLine(b, b);
for (const n of LEGENDS.concat(PARADOX, ['Missingno'])) LINE[n] = n;
// the box-art-level legendaries (BST 660+, Kyurem included) are held back from the Champion's reward pool for their own events
const GREAT_LEGENDS = LEGENDS.filter(n => SP[n].bst >= 660);
const REWARD_LEGENDS = LEGENDS.filter(n => SP[n].bst < 660);
for (const b of BABY_LEGENDS) markLine(b, b);
// v184: legendaries that turn up as finds while exploring (Shaymin only in the first six weeks, its spring)
const FIND_LEGENDS = ['Regirock', 'Regice', 'Registeel', 'Regieleki', 'Regidrago', 'Mew', 'Shaymin', 'Manaphy', 'Zarude', 'Ogerpon', 'Hoopa'];
const LEGEND_FIND = 0.0024; // per explore offer set, plus up to +0.08% from Scouting
const FIND_STORY = {
  Regirock: 'It was sealed in a chamber of stone.', Regice: 'It was sealed in a chamber of ice.', Registeel: 'It was sealed in a chamber of iron.',
  Regieleki: 'It was sealed in a chamber humming with electricity.', Regidrago: 'It was sealed in a chamber shaped like a dragon.',
  Mew: 'It had been watching from the treetops all along.', Shaymin: 'It was resting in a field of Gracidea flowers.', Manaphy: 'It washed up on a beach, far from the sea it came from.',
  Zarude: 'It swung down out of the deep jungle.', Ogerpon: 'It was wearing a mask and hiding in the woods.', Hoopa: 'It came through a ring that opened in the air.',
};
const BABY_CHANCE = 0.0025; // per explore offer set, plus up to +0.15% from Scouting
const babyLine = sp => BABY_LEGENDS.includes(LINE[sp]);
// Pokémon obtained through special conditions: trainers hold on to these ahead of everything else
function isSpecial(m) {
  if (!m) return false;
  const s = SP[m.sp];
  return !!(m.alpha || m.shiny || m.delta || s.legend || s.paradox || s.baby || babyLine(m.sp) || (m.met && (m.met.how === 'wormhole' || m.met.how === 'gift' || m.met.how === 'paradox')));
}
// legendaries (Ultra Beasts and mythicals included) and baby legendaries always start with at least Good IVs
const needsGoodIVs = sp => !!(SP[sp].legend || SP[sp].baby || babyLine(sp));
// Ultra Wormholes: from mid-season, very rarely an Ultra Beast comes through for an exploring trainer, already at full strength.
// Only Ultra Beasts nobody active holds can appear, and one that's caught leaves the Champion's legendary pool until it's free again.
const ULTRA_BEASTS = ['Nihilego', 'Buzzwole', 'Pheromosa', 'Xurkitree', 'Celesteela', 'Kartana', 'Guzzlord', 'Stakataka', 'Blacephalon'];
for (const n of ULTRA_BEASTS) SP[n].ub = true;
// ---------- mass outbreaks ----------
// Most weeks there's a chance that one wild species swarms near a town for the coming week. Everyone who explores
// that week is offered it (at their own level), and outbreak Pokémon are far more often alphas or shinies.
const OUTBREAK_CHANCE = 0.16, OUTBREAK_ALPHA = 4, OUTBREAK_SHINY = 8;
const activeOutbreak = () => S.outbreak && S.outbreak.week === S.week ? S.outbreak : null;
function maybeOutbreak() {
  const ob = S.outbreak;
  if (ob && ob.week < S.week) {
    S.outbreak = null;
    const bits = [`${ob.caught} caught`]; if (ob.alpha) bits.push(`${ob.alpha} alpha${ob.alpha > 1 ? 's' : ''}`); if (ob.shiny) bits.push(`${ob.shiny} shiny`);
    catchNews(`The ${ob.sp} outbreak near ${ob.town} has died down: ${bits.join(', ')}.`, ob.user ? 'you' : 'circuit');
    (S.outbreakLog = S.outbreakLog || []).push({ season: S.season, week: ob.week + 1, sp: ob.sp, town: ob.town, caught: ob.caught, alpha: ob.alpha, shiny: ob.shiny });
    if (S.outbreakLog.length > 60) S.outbreakLog.shift();
  }
  if (!featOn('outbreak') || S.outbreak || S.week < 1 || S.week >= SEASON_WEEKS - 1 || rand() >= OUTBREAK_CHANCE) return;
  // usually a common Pokémon; sometimes something rarer worth chasing
  const pool = BASES.filter(b => !SP[b].starter && SP[b].bst < 420 && (rand() < 0.3 ? SP[b].rare : !SP[b].rare));
  if (!pool.length) return;
  const sp = pick(pool), town = pick(TOWNS);
  S.outbreak = { sp, town, week: S.week, caught: 0, alpha: 0, shiny: 0 };
  catchNews(`Mass outbreak! Wild ${sp} are swarming near ${town} in week ${S.week + 1}. Trainers who explore will find them, with far better odds of an alpha or a shiny.`, 'circuit');
}
// ---------- optional features (chosen when a league is created; all on by default) ----------
const FEATURES = [
  { group: 'Wild Pokémon', items: [
    ['shiny', 'Shiny Pokémon', 'Rare shinies with perfect IVs, arriving on fire.'],
    ['delta', 'Delta Pokémon', 'Rarer than alphas, more common than shinies: an unusual second type and outstanding IVs.'],
    ['shadow', 'Wild Shadow Pokémon', 'About as rare as shinies: a Shadow Pokémon turns up in the wild. Its heart opens as its trainer trains, explores and challenges gyms.'],
    ['alpha', 'Alpha Pokémon', 'Uncommon alphas with outstanding IVs, already hot.'],
    ['outbreak', 'Mass outbreaks', 'One species swarms near a town for a week, with better shiny and alpha odds.'],
    ['wormhole', 'Ultra Wormholes', 'From midseason, an Ultra Beast can come through near a trainer.'],
    ['rarefind', 'Rare finds', 'Meltan, Poipole, Cosmog, Kubfu and the other one-of-a-kind finds.'] ] },
  { group: 'Events', items: [
    ['tourney', 'Midseason Tournament', 'After week 12, every challenger in every League meets in one single-elimination bracket. The winner chooses an alpha of almost any Pokémon.'],
    ['villains', 'Villain team events', 'Rocket, Magma, Aqua, Galactic, Plasma, Flare, Skull and Cipher (with Shadow Pokémon) take over a hideout midseason.'],
    ['pokerus', 'Pokérus', 'A rare, catching virus that makes Pokémon level faster for a few weeks.'],
    ['roamers', 'Roaming legendaries', 'Raikou, Entei, Suicune, Latias, Latios and the Loyal Three roam between towns; challengers exploring nearby may find and catch them.'],
    ['storms', 'Legendary storms', 'The legendary birds (sometimes their Galarian forms), the Forces of Nature, the island guardians and the Treasures of Ruin change battles across the whole region for four weeks, then choose the challenger who won the most battles in it.'],
    ['greatlegends', 'Legendary encounters', 'The box legendaries appear through story events, along with rare encounters (Regigigas, Darkrai, Cresselia, Deoxys), legendaries found while exploring (the Regis, Mew, Shaymin and more), legendaries that choose a trainer by character or season (the Lake trio, the Swords of Justice, Victini and more) and Missingno. A trainer holds one legendary at a time.'],
    ['abilities', 'Abilities', 'Pokémon have their real abilities (a growing set), with gym weather (rain, sun, sand, snow), burns, paralysis, poison and stat changes in battle.'],
    ['items', 'Held items', 'Pokémon hold items: type boosters, Leftovers, Choice items, Life Orb, Focus Sash and more. Earned from gyms, found while exploring, and given for deep League runs.'],
    ['temper', 'Temperaments', 'Each nature also gives a small effect off the field: nerves on the big stage, faster learning, sulking after a trade and more.'],
    ['bond', 'Battle Bond', 'Long-time partners at max friendship can transform after a knockout in League battles.'],
    ['road', 'Road battles and rivalries', 'Challengers run into each other between gyms; rivalries and nemeses grow from it.'],
    ['gymadapt', 'Gym Leaders adapt', 'A Gym Leader on a losing streak swaps a Pokémon to counter what is beating them.'],
    ['meta', 'Meta response', "Elite trainers and new prospects counter the season's top Pokémon."] ] },
  { group: 'World', items: [
    ['trades', 'Road trades', 'Challengers sometimes swap Pokémon when they meet.'],
    ['lucky', 'Lucky Pokémon', 'Traded Pokémon can arrive Lucky, with boosted IVs (needs road trades).'],
    ['legacy', 'Legacy trainers', "Notable retirees' children enter the draft years later."],
    ['extclasses', 'Extended trainer classes', "Trainer classes made for this game that aren't in the Pokémon games, such as Storm Chaser, Lamplighter, Locksmith and Desert Nomad. They're mostly dual-type specialists covering type pairs the games' classes don't. Off: only classes from the games are handed out."],
    ['rotation', 'Gym rotation', 'Gym Leaders are shuffled among the towns each season.'],
    ['banlist', 'League banlists', "Each offseason the teams in a League vote on banning its top performers for the next season. Banned Pokémon go to their team's ranch, and Gym Leaders, the Elite Four and the Champion get replacements."] ] },
];
const featOn = k => !(S && S.cfg && S.cfg.off && S.cfg.off[k]);
const WORMHOLE_WEEK = 12, WORMHOLE_CHANCE = 0.03, WORMHOLE_OPEN = 2; // per week from week 13; open for two weeks
// open a wormhole near one challenger; it stays open for a couple of weeks, and exploring there finds the Ultra Beast
function maybeWormhole() {
  if (S.wormhole && S.week >= S.wormhole.until) { const w = S.wormhole, t = T(w.id); S.wormhole = null; if (t) catchNews(`The Ultra Wormhole near ${t.name} closed, and ${w.sp} went back through it.`, t.user ? 'you' : 'circuit', t.id); }
  if (!featOn('wormhole') || S.wormhole || S.week < WORMHOLE_WEEK || S.week >= SEASON_WEEKS - 1 || rand() >= WORMHOLE_CHANCE) return;
  const held = ownedLegends(), free = ULTRA_BEASTS.filter(n => !held.has(n)); const near = challengers().filter(t => t.team.length);
  if (!free.length || !near.length) return;
  let t = pick(near), sp = pick(free);
  // now and then the wormhole leads into Ultra Space itself, and Solgaleo or Lunala comes through
  const space = featOn('greatlegends') && !legendFull(t) ? ['Solgaleo', 'Lunala', 'Necrozma'].filter(n => !held.has(n) && !legendBlocked(t, n)) : [];
  if (space.length && rand() < 0.15) sp = pick(space);
  S.wormhole = { id: t.id, sp, until: Math.min(SEASON_WEEKS, S.week + WORMHOLE_OPEN) };
  catchNews(`An Ultra Wormhole opened near ${dn(t)}! ${sp} has come through. Exploring in the next ${WORMHOLE_OPEN} weeks gives ${t.name} one chance to catch it.`, t.user ? 'you' : 'circuit', t.id);
}
// a baby legendary line is free when nobody active holds any stage of it
function freeBabies() {
  const held = new Set(); for (const t of leagueTrainers()) if (!['retired', 'prospect'].includes(t.role)) for (const m of t.team) held.add(LINE[m.sp]);
  return BABY_LEGENDS.filter(b => !held.has(b));
}
// For branching lines (Eevee, Tyrogue, Kirlia...) pick the branch that fits the preferred type, else at random
function pickBranch(s, L, pref) {
  const ok = (s.evos || []).filter(e => L >= e.lvl);
  if (!ok.length) return null;
  const fit = pref ? ok.filter(e => SP[e.to].types.includes(pref)) : [];
  const from = fit.length ? fit : ok;
  // with no type to steer it, a regional branch (Alolan Raichu, Hisuian Typhlosion...) is the less common outcome
  const w = e => /^(Alolan|Galarian|Hisuian|Paldean) /.test(e.to) && !/^(Alolan|Galarian|Hisuian|Paldean) /.test(s.name) ? 0.5 : 1;
  let r = rand() * from.reduce((a, e) => a + w(e), 0);
  for (const e of from) { r -= w(e); if (r <= 0) return e.to; }
  return from[from.length - 1].to;
}
function formAt(name, L, pref) { let s = SP[name], nx; while ((nx = pickBranch(s, L, pref))) s = SP[nx]; return s.name; }

// ================= WORLD CONSTANTS =================
const SEASON_WEEKS = 24;
// pacing: levels gained per week from travel, and the bonus from each action
const PACE = { travel: 1.35, trainBase: 0.75, trainPerRating: 1.9, win: 1.1, loss: 0.45, explore: 1.0, catchUpGap: 4, catchUpMult: 2.0 };
const trainGain = t => (PACE.trainBase + t.r.trn / 100 * PACE.trainPerRating) * (hasTrait(t, 'grinder') ? 1.12 : 1);
// each League is one of the Gen 1–4 regions, drawn at random when the world is made (purely names: gym types are
// random and reshuffle). TOWNS follows whichever League is bound (see useLeague)
const LEAGUE_SETS = [
  { name: 'Kanto League', towns: ['Pewter','Cerulean','Vermilion','Celadon','Fuchsia','Saffron','Cinnabar','Viridian'] },
  { name: 'Johto League', towns: ['Violet','Azalea','Goldenrod','Ecruteak','Cianwood','Olivine','Mahogany','Blackthorn'] },
  { name: 'Hoenn League', towns: ['Rustboro','Dewford','Mauville','Lavaridge','Petalburg','Fortree','Mossdeep','Sootopolis'] },
  { name: 'Sinnoh League', towns: ['Oreburgh','Eterna','Veilstone','Pastoria','Hearthome','Canalave','Snowpoint','Sunyshore'] },
];
let TOWNS = LEAGUE_SETS[0].towns.slice();
const GYM_LV = [16, 24, 32, 41, 51, 61, 70, 77];
const GYM_SIZE = [2, 3, 3, 4, 4, 5, 5, 6];
const E4_LV = [77, 80, 83, 85];
const CHAMP_LV = 91;
// v142 (abilities, weather) used Lv 92; named moves (v146) made Champions stronger (title changes ~32%), so Lv 91 (~44%);
// v151: Lv 90 after the v147–v150 abilities drifted it to ~42% (Lv 90: 50.2% over 960 seasons)
// v166: legendaries moving on after 3–5 seasons pushed title changes to 54.6% (multi 53.8%), so back to Lv 91 / 92
// (49.2% / 50.4% over 480 seasons each)
const CHAMP_ACE_BONUS = 0;
// with several Leagues titles changed hands more often in sims (~60% vs ~50%), so their Champions start a level higher
const CHAMP_LV_MULTI = 92;
const champLv = () => nLeagues() > 1 ? CHAMP_LV_MULTI : CHAMP_LV;
const MALE = ['Logan','Doug','Joey','Ben','Calvin','Dennis','Mitch','Wade','Gordon','Ricky','Ted','Hank','Jeff','Lenny','Marty','Owen','Perry','Ray','Stan','Toby','Vince','Wes','Alvin','Brett','Carl','Darren','Eli','Frank','Gil','Herb','Ian','Jack','Kurt','Leon','Miles','Nate','Oscar','Phil','Russ','Sid','Tim','Ulric','Vic','Walt','Zach','Andy','Bert','Chad','Dale','Ernie','Floyd','Glen','Hugh','Jerry','Kenny','Lyle','Mack','Neil','Pete','Rod','Adam','Alec','Arnie','Barney','Barry','Benny','Bobby','Boyd','Brad','Bruce','Bud','Burt','Cal','Cecil','Chet','Chris','Clark','Cliff','Clint','Cody','Colin','Craig','Curt','Cy','Dan','Danny','Dave','Dean','Derek','Dewey','Don','Duane','Dwight','Earl','Ed','Eddie','Edgar','Elmer','Emil','Eric','Ethan','Evan','Felix','Fred','Gabe','Gene','Greg','Gus','Hal','Harvey','Hector','Homer','Howard','Hubert','Irv','Ivan','Jake','Jared','Jay','Jesse','Jim','Joel','Josh','Jude','Karl','Keith','Ken','Kevin','Kirk','Kyle','Lars','Lee','Leo','Lloyd','Lou','Luke','Marc','Mario','Mark','Mel','Mike','Monty','Morgan','Murray','Ned','Nick','Noel','Norm','Ollie','Otis','Pat','Ralph','Randy','Reggie','Rex','Rick','Rob','Roger','Ron','Ross','Rudy','Sam','Scott','Seth','Shane','Sonny','Spencer','Steve','Stu','Terry','Theo','Tom','Tony','Travis','Trent','Troy','Tyler','Vern','Victor','Warren','Wilbur','Woody','Zane','Abe','Alfie','Barton','Basil','Bjorn','Carlos','Dex','Dirk','Dom','Drew','Emmett','Ezra','Fergus','Finn','Garth','Hiro','Hugo','Igor','Jasper','Kai','Kendall','Knox','Lionel','Marco','Mason','Moe','Nico','Omar','Pablo','Quincy','Rafael','Remy','Rocco','Rufus','Sergio','Silas','Wyatt','Yusuf','Zeke','Amos','Angus','Arlo','Axel','Beau','Boris','Bram','Caleb','Casey','Clay','Conrad','Dallas','Dario','Desmond','Diego','Eamon','Enzo','Ford','Gideon','Gunnar','Ike','Jonah','Jules','Kenji','Lorenzo','Malik','Mateo','Mitchell','Nolan','Orson','Rhys','Ronan','Sal','Tariq','Thad','Ulysses','Vaughn','Wendell'];
const FEMALE = ['Abby','Beth','Cara','Dana','Ella','Fay','Gina','Holly','Iris','Jill','Kate','Lori','Megan','Nora','Olive','Paige','Rosa','Sally','Tina','Uma','Vicky','Wendy','Yvonne','Zoe','Amy','Bree','Cindy','Dawn','Erin','Fern','Gwen','Hazel','Ivy','Joan','Kim','Lacey','Mona','Nina','Opal','Penny','Robin','Sue','Tara','Val','April','Becca','Carly','Daisy','Edna','Flora','Grace','Heidi','Jenna','Kara','Liz','Mandy','Nell','Pam','Quinn','Rita','Ada','Agnes','Alice','Alma','Angie','Anna','Annie','Ava','Barb','Bella','Bonnie','Brenda','Bridget','Brooke','Camila','Carmen','Carol','Cassie','Celia','Claire','Clara','Connie','Cora','Debbie','Dee','Delia','Diane','Dina','Dora','Doris','Elaine','Eliza','Ellie','Elsie','Emma','Esther','Eva','Faith','Fiona','Freya','Gail','Georgia','Gloria','Hannah','Harriet','Helen','Hope','Ida','Ingrid','Irene','Isla','Jackie','Jane','Janet','Jean','Jess','Josie','Judy','June','Katie','Kelly','Kit','Laura','Lena','Lily','Linda','Lisa','Lola','Luna','Mabel','Maggie','Mara','Maria','Marie','Martha','Mavis','Maxine','Millie','Molly','Nadia','Nancy','Naomi','Nicole','Norma','Olga','Patty','Pearl','Peggy','Petra','Polly','Rachel','Ramona','Rhea','Rosie','Ruby','Ruth','Sadie','Sara','Selma','Shelby','Sofia','Stella','Susie','Tess','Thea','Trudy','Vera','Violet','Wanda','Willa','Yara','Zelda','Zara','Alicia','Cleo','Della','Elena','Gemma','Imogen','Juno','Lark','Leila','Mira','Noelle','Odette','Priya','Rae','Saffron','Sierra','Tamsin','Una','Wren','Yuki','Adele','Alba','Aurora','Beatrix','Bethany','Blair','Callie','Celeste','Daphne','Delphine','Elise','Esme','Etta','Frida','Gia','Hattie','Ines','Joy','Keiko','Leah','Mae','Marisol','Octavia','Pippa','Rhoda','Talia','Tilly','Ursula','Vivian','Winnie','Ximena','Yolanda','Zadie'];
// Each specialty type has trainer classes drawn from the franchise; gender 'm'/'f' or null for either.
const CLASSES = {
  Normal: [['Youngster','m'],['Lass','f'],['Pokéfan',null]],
  Fire: [['Firebreather','m'],['Kindler',null]],
  Water: [['Swimmer',null],['Fisherman','m'],['Sailor','m']],
  Electric: [['Guitarist',null],['Rocker','m']],
  Grass: [['Aroma Lady','f'],['Gardener',null]],
  Ice: [['Skier',null],['Boarder',null]],
  Fighting: [['Black Belt','m'],['Battle Girl','f']],
  Poison: [['Biker','m'],['Scientist',null]],
  Ground: [['Hiker','m'],['Backpacker',null]],
  Flying: [['Bird Keeper',null]],
  Psychic: [['Psychic',null],['Juggler','m']],
  Bug: [['Bug Catcher',null],['Bug Maniac','m']],
  Rock: [['Ruin Maniac','m'],['Hiker','m'],['Backpacker',null]],
  Ghost: [['Channeler','f'],['Hex Maniac','f'],['Medium',null]],
  Dragon: [['Dragon Tamer',null]],
  Dark: [['Punk',null],['Delinquent',null]],
  Steel: [['Worker','m'],['Engineer',null]],
  Fairy: [['Beauty','f'],['Fairy Tale Girl','f'],['Pokéfan',null]],
};
// Dual-type classes: [name, primary, secondary, gender, extended]. About 1 in 6 typed challengers and prospects gets one.
// Extended classes (5th field true, v198) aren't in the games; the "Extended trainer classes" feature switches them off.
const DUAL_CLASSES = [
  ['Burglar', 'Fire', 'Poison', 'm'], ['Super Nerd', 'Electric', 'Poison', 'm'], ['Cue Ball', 'Fighting', 'Poison', 'm'], ['Ninja Boy', 'Poison', 'Bug', 'm'],
  ['Parasol Lady', 'Water', 'Fairy', 'f'], ['Kimono Girl', 'Psychic', 'Fairy', 'f'], ['Pokémon Ranger', 'Grass', 'Bug', null], ['Triathlete', 'Water', 'Flying', null],
  ['Sky Trainer', 'Flying', 'Dragon', null], ['Scuba Diver', 'Water', 'Dark', null],
  // v198: classes from the games, given a second type
  ['Tuber', 'Water', 'Normal', null], ['Cameraman', 'Normal', 'Electric', 'm'], ['Rancher', 'Normal', 'Ground', null], ['Picnicker', 'Grass', 'Normal', 'f'],
  ['Pokémon Breeder', 'Normal', 'Fairy', null], ['Pilot', 'Flying', 'Steel', null], ['Poké Maniac', 'Ground', 'Poison', 'm'],
  // extended classes
  ['Storm Chaser', 'Electric', 'Flying', null, true], ['Volcanologist', 'Fire', 'Ground', null, true], ['Blacksmith', 'Fire', 'Steel', null, true], ['Mechanic', 'Steel', 'Electric', null, true],
  ['Herbalist', 'Grass', 'Poison', null, true], ['Shrine Maiden', 'Ghost', 'Psychic', 'f', true], ['Gravekeeper', 'Ghost', 'Ground', null, true], ['Spelunker', 'Rock', 'Dark', null, true],
  ['Polar Explorer', 'Ice', 'Ground', null, true], ['Glacier Diver', 'Water', 'Ice', null, true], ['Night Watchman', 'Dark', 'Flying', 'm', true], ['Monk', 'Fighting', 'Psychic', 'm', true],
  ['Astronomer', 'Psychic', 'Rock', null, true], ['Apothecary', 'Poison', 'Fairy', null, true], ['Dragon Rider', 'Dragon', 'Flying', null, true], ['Wrestler', 'Fighting', 'Normal', 'm', true],
  // v198 extended classes, filling type pairs nobody covered
  ['Courier', 'Normal', 'Flying', null, true],
  ['Locksmith', 'Steel', 'Fairy', null, true], ['Samurai', 'Bug', 'Steel', 'm', true], ['Knight', 'Steel', 'Dragon', null, true], ['Fencer', 'Fighting', 'Steel', null, true],
  ['Mercenary', 'Steel', 'Dark', null, true], ['Antique Dealer', 'Ghost', 'Steel', null, true], ['Junk Dealer', 'Poison', 'Steel', null, true],
  ['Jeweler', 'Rock', 'Fairy', null, true], ['Fossil Diver', 'Rock', 'Water', null, true], ['Paleontologist', 'Rock', 'Flying', null, true], ['Stoker', 'Fire', 'Rock', null, true],
  ['Rock Climber', 'Rock', 'Fighting', null, true],
  ['Lamplighter', 'Fire', 'Ghost', null, true], ['Phantom Thief', 'Ghost', 'Dark', null, true], ['Occultist', 'Poison', 'Ghost', null, true],
  ['Paranormal Investigator', 'Ghost', 'Electric', null, true], ['Doll Collector', 'Ghost', 'Fairy', null, true],
  ['Farmer', 'Grass', 'Ground', null, true], ['Lumberjack', 'Grass', 'Fighting', null, true], ['Landscaper', 'Grass', 'Steel', null, true], ['Florist', 'Grass', 'Fairy', null, true],
  ['Bandit', 'Grass', 'Dark', null, true], ['Orchardist', 'Grass', 'Dragon', null, true],
  ['Lighthouse Keeper', 'Water', 'Electric', null, true], ['Lifeguard', 'Water', 'Fighting', null, true], ['Harbor Master', 'Water', 'Steel', null, true], ['Clam Digger', 'Water', 'Ground', null, true],
  ['Falconer', 'Fire', 'Flying', null, true], ['Kickboxer', 'Fire', 'Fighting', null, true], ['Fortune Teller', 'Psychic', 'Fire', null, true], ['Desert Nomad', 'Ground', 'Dragon', null, true],
  ['Street Fighter', 'Fighting', 'Dark', null, true], ['Con Artist', 'Psychic', 'Dark', null, true], ['Trickster', 'Fairy', 'Dark', null, true],
  ['Lepidopterist', 'Bug', 'Flying', null, true], ['Figure Skater', 'Ice', 'Fairy', null, true],
];
const extClassOn = () => featOn('extclasses');
const dualClassesOn = () => extClassOn() ? DUAL_CLASSES : DUAL_CLASSES.filter(d => !d[4]);
const DUAL_CHANCE = 0.17;
// the types a trainer specialises in (none, one, or two)
function specTypes(t) { return t && t.specialty ? (t.spec2 ? [t.specialty, t.spec2] : [t.specialty]) : []; }
// 0 = off-type, 1 = shares a specialty type, 2 = has both of a dual specialist's types
function specFit(t, sp) { const ty = specTypes(t); if (!ty.length) return 0; const n = SP[sp].types.filter(x => ty.includes(x)).length; return n >= 2 ? 2 : n; }
const onSpec = (t, sp) => specFit(t, sp) > 0;
// Generalists carry a mixed team and no type bias
const GENERAL = [['Ace Trainer',null],['Veteran',null]];
const CLASS_TYPE = {};
for (const [ty, list] of Object.entries(CLASSES)) for (const [c] of list) (CLASS_TYPE[c] = CLASS_TYPE[c] || []).push(ty);
const RK = ['str','trn','bnd','sct','nrv'];
const RNAME = { str: 'Strategy', trn: 'Training', bnd: 'Bond', sct: 'Scouting', nrv: 'Nerve' };

let S = null; // the world state

function ovr(t) { const r = t.r; return Math.round(r.str * 0.3 + r.trn * 0.15 + r.bnd * 0.2 + r.sct * 0.1 + r.nrv * 0.25); }
function T(id) { return S.trainers[id]; }
function uid() { return S.nextUid++; }
function news(text, tag = 'league', id = null) { S.news.unshift({ season: S.season, week: S.week, text, tag, id, ...(nLeagues() > 1 && LG_CTX > 0 ? { lg: S.lg || 0 } : {}) }); if (S.news.length > 400) S.news.length = 400; }
// catching news (alphas, shinies, Deltas, baby legendaries, Ultra Wormholes, outbreaks) goes under Catches;
// the player's own catches also keep the Your team label
function catchNews(text, tag, id) { news(text, tag === 'you' ? 'you' : 'catch', id); S.news[0].cat = 'catch'; }
const firstName = n => String(n).split(' ')[0];
// v176: a name only clashes with the same title. There can be one Hiker Ben, and a Swimmer Ben beside him. A title + name is
// never reissued once someone has held it, even after they retire, so the records stay unambiguous.
// (A famous Elite Four member or Champion competing as a challenger shows as an Ace Trainer, so that's the title that counts.)
function titleOf(t) { return t.famous && /^(Elite Four|Champion)$/.test(t.cls) ? 'Ace Trainer' : t.cls; }
function titleNameTaken(title, name, except) {
  for (const x of Object.values(S.trainers)) if (x !== except && x.name === name && titleOf(x) === title) return true;
  return false;
}
// a famous trainer waits only while that exact title + name is held (or has been held) by someone
function famousNameFree(f) { return !titleNameTaken(titleOf({ famous: true, cls: f.cls }), f.name); }
function assignClass(t, age, allowDual) {
  let opts = t.specialty ? CLASSES[t.specialty] : (age >= 28 ? [GENERAL[1]] : [GENERAL[0]]);
  let [cls, g] = pick(opts);
  t.spec2 = null;
  const duals = allowDual && t.specialty ? dualClassesOn().filter(d => d[1] === t.specialty || d[2] === t.specialty) : [];
  if (duals.length && rand() < DUAL_CHANCE) {
    const d = pick(duals); cls = d[0]; g = d[3];
    // keep the asked-for type as the primary one, so counter-type prospects still counter the meta
    t.spec2 = d[1] === t.specialty ? d[2] : d[1];
  }
  t.cls = cls;
  t.gender = g || (rand() < 0.5 ? 'm' : 'f');
  const pool = t.gender === 'm' ? MALE : FEMALE;
  // a name can repeat across titles, but never within one: no two trainers, active or retired, are both "Hiker Ben"
  const taken = new Set(); for (const x of Object.values(S.trainers)) if (x !== t && x.name && titleOf(x) === cls) taken.add(x.name);
  const free = pool.filter(n => !taken.has(n));
  if (free.length) { t.name = pick(free); return; }
  for (let i = 0; i < 400; i++) { const n = pick(pool) + ' ' + String.fromCharCode(65 + ri(0, 25)) + '.'; if (!taken.has(n)) { t.name = n; return; } }
  t.name = pick(pool) + ' ' + String.fromCharCode(65 + ri(0, 25)) + '.';
}
// "Sinnoh " for the League a sitting Elite Four member or Champion serves (empty if it can't be told yet)
function dnLeague(t) { try { const n = S && (nLeagues() > 1 ? leagueName(lgOf(t)) : S.lgName); return n ? n.replace(/ League$/, '') + ' ' : ''; } catch (e) { return ''; } }
// Display name the way the games print it: class + name, or the elite title
function dn(t) {
  if (!t) return '—';
  if (t.role === 'leader') return `${dnLeague(t)}Gym Leader ${t.name}`;
  // v169/v170: sitting Gym Leaders, Elite Four and Champion name their League, so they can't be mistaken for a famous trainer's
  // title (Kalos Champion Diantha) or for another League's (Defending Sinnoh Champion Wally, Kanto Elite Four Bruno)
  if (t.role === 'e4') return `${dnLeague(t)}Elite Four ${t.name}`;
  if (t.role === 'champion') return `Defending ${dnLeague(t)}Champion ${t.name}`;
  // a famous Elite Four member or Champion who's competing as a challenger doesn't carry the title
  if (t.famous && /^(Elite Four|Champion)$/.test(t.cls)) return 'Ace Trainer ' + t.name;
  return t.cls + ' ' + t.name;
}
function dominantType(team) {
  const c = {};
  for (const m of team) for (const ty of SP[m.sp].types) c[ty] = (c[ty] || 0) + monPower(m);
  return Object.keys(c).sort((a, b) => c[b] - c[a])[0] || pick(TYPES);
}
function specOf(t) { return t.specialty || dominantType(t.team); }

// ================= INDIVIDUAL POKÉMON =================
// Natures from the games. Battles here use one attack stat and one defense stat,
// so Sp. Atk folds into Attack and Sp. Def into Defense; a nature whose boost and drop land on the same stat is neutral.
const NATURES = { Hardy: [], Lonely: ['atk', 'def'], Brave: ['atk', 'spe'], Adamant: ['atk', 'spa'], Naughty: ['atk', 'spd'], Bold: ['def', 'atk'], Docile: [], Relaxed: ['def', 'spe'], Impish: ['def', 'spa'], Lax: ['def', 'spd'], Timid: ['spe', 'atk'], Hasty: ['spe', 'def'], Serious: [], Jolly: ['spe', 'spa'], Naive: ['spe', 'spd'], Modest: ['spa', 'atk'], Mild: ['spa', 'def'], Quiet: ['spa', 'spe'], Bashful: [], Rash: ['spa', 'spd'], Calm: ['spd', 'atk'], Gentle: ['spd', 'def'], Sassy: ['spd', 'spe'], Careful: ['spd', 'spa'], Quirky: [] };
// natures raise one stat 10% and lower another 10% (all five non-HP stats are separate now)
function natureFx(n) {
  const fx = { atk: 1, def: 1, spa: 1, spd: 1, spe: 1 }; const nd = NATURES[n] || [];
  if (nd.length && nd[0] !== nd[1]) { fx[nd[0]] = 1.1; fx[nd[1]] = 0.9; }
  return fx;
}
// v197: temperaments. Every nature also shapes how a Pokémon behaves off the field, with small effects in particular
// situations. Grouped by the stat the nature raises: Attack natures are fiery, Defense steady, Speed restless, Sp. Atk
// thinkers, Sp. Def composed, and the neutral natures are wildcards.
const TEMPER = {
  Lonely: { name: 'Loyal', d: 'Friendship grows half again as fast. After a trade it sulks for 4 weeks (−6% damage).' },
  Brave: { name: 'Daring', d: '+5% damage against a team whose top three are 3 or more levels higher on average.' },
  Adamant: { name: 'Driven', d: 'Levels 8% faster, but hates resting: half the usual IV gain from a season at the ranch.' },
  Naughty: { name: 'Mischievous', d: '−4% damage against the first three gyms, +5% against villain teams.' },
  Bold: { name: 'Unshaken', d: 'Losing never cools its form (fainting still does).' },
  Relaxed: { name: 'Laid-back', d: 'Gets half again as much from a season of rest at the ranch, but levels 8% slower.' },
  Impish: { name: 'Spiteful', d: "+5% damage against its trainer's rival." },
  Lax: { name: 'Careless', d: '−4% damage against a team whose top three are 4 or more levels lower on average.' },
  Timid: { name: 'Nervous', d: '−7% damage in its first Elite Four or Championship battle each season, unless a Calm teammate steadies it.' },
  Hasty: { name: 'Impatient', d: 'Levels 15% faster in the first half of the season and 12% slower in the second.' },
  Jolly: { name: 'Cheerful', d: 'While its trainer is on a win streak of 2 or more, the whole team does 3% more damage.' },
  Naive: { name: 'Adaptable', d: 'Levels 25% faster in its first season with a new trainer (after a trade or a ranch handoff).' },
  Modest: { name: 'Studious', d: 'Learns stronger moves and coverage moves 5 levels early.' },
  Mild: { name: 'Easygoing', d: 'A cold streak never lowers its damage; a hot streak still helps.' },
  Quiet: { name: 'Reflective', d: 'Comes back from a season of rest at the ranch 5 levels higher, on top of the better IVs.' },
  Rash: { name: 'Reckless', d: 'Its damage swings from −8% to +8% each battle.' },
  Calm: { name: 'Serene', d: 'Steadies the team: no Timid teammate gets nervous.' },
  Gentle: { name: 'Nurturing', d: 'Teammates 10 or more levels below it level 15% faster.' },
  Sassy: { name: 'Defiant', d: '+5% damage in the battle after one it lost.' },
  Careful: { name: 'Cautious', d: 'Hard to wear down: fainting cools its form half as much.' },
  Hardy: { name: 'Even-keeled', d: 'Never runs hot or cold: streaks have no effect on it.' },
  Docile: { name: 'Agreeable', d: 'Keeps all its friendship when traded.' },
  Serious: { name: 'Focused', d: '+4% damage in Elite Four and Championship battles.' },
  Bashful: { name: 'Shy', d: 'Starts each season at −4% damage and gains 1% for every win it takes part in, up to +4%.' },
  Quirky: { name: 'Unpredictable', d: 'Takes on a different temperament each season.' },
};
const TEMPER_KEYS = Object.keys(TEMPER).filter(k => k !== 'Quirky');
// the temperament in effect (a Quirky Pokémon's changes each season), or null with temperaments switched off
function temperOf(m) {
  if (!m || !m.nat || !TEMPER[m.nat] || !featOn('temper')) return null;
  return m.nat === 'Quirky' ? TEMPER_KEYS[hashStr(String(m.uid ?? m.sp) + ':' + ((S && S.season) || 1)) % TEMPER_KEYS.length] : m.nat;
}
const isTemper = (m, n) => temperOf(m) === n;
// the level a Pokémon counts as for learning moves (Modest learns 5 levels early)
const moveLv = m => Math.floor(m.lvl) + (isTemper(m, 'Modest') ? 5 : 0);
// a Pokémon in its first season with a new trainer: traded this season, or handed over from a ranch for this season
const newToTrainer = m => !!((m.met && m.met.how === 'traded' && m.met.season === S.season) || (m.gift && m.gift === S.season));
// growth from temperament, with team context (Gentle teammates)
function temperGrowth(m, team) {
  const n = temperOf(m); let g = 1;
  if (n === 'Adamant') g *= 1.08;
  if (n === 'Relaxed') g *= 0.92;
  if (n === 'Hasty') g *= S.week < SEASON_WEEKS / 2 ? 1.15 : 0.88;
  if (n === 'Naive' && newToTrainer(m)) g *= 1.25;
  if (team && team.some(x => x !== m && isTemper(x, 'Gentle') && x.lvl - m.lvl >= 10)) g *= 1.15;
  return g;
}
// friendship gains (Lonely bonds faster)
const temperFr = m => isTemper(m, 'Lonely') ? 1.5 : 1;
// a temperament's damage multiplier for one battle: t is the Pokémon's trainer, foe the other side
function temperMul(t, foe, m, stakes, eq, calm) {
  const n = temperOf(m); if (!n) return 1;
  let x = 1;
  const gap = eq || !foe || !foe.team || !foe.team.length ? 0 : topAvg(foe, 3) - topAvg(t, 3);
  const big = stakes === 'league' || stakes === 'title';
  if (n === 'Brave' && gap >= 3) x *= 1.05;
  if (n === 'Lax' && gap <= -4) x *= 0.96;
  if (n === 'Naughty') { if (stakes === 'gym' && t.badges && t.badges.length < 3) x *= 0.96; if (foe && foe.role === 'villain') x *= 1.05; }
  if (n === 'Impish' && foe && isRival(t, foe)) x *= 1.05;
  if (n === 'Timid' && big && m.nerve !== S.season) { m.nerve = S.season; if (!calm) x *= 0.93; }
  if (n === 'Serious' && big) x *= 1.04;
  if (n === 'Sassy' && m.st && m.st.cl > 0) x *= 1.05;
  if (n === 'Bashful') { const w = m.ss && m.ss.season === S.season ? m.ss.w || 0 : 0; x *= 0.96 + 0.01 * Math.min(8, w); }
  if (n === 'Rash') x *= 0.92 + rand() * 0.16;
  if (m.sulk > 0) x *= 0.94;
  return x;
}
// Coverage: attack types a line can learn beyond its own, by the type it belongs to
const COVER = { Bird: [], Normal: ['Fighting', 'Ground', 'Dark', 'Ghost', 'Electric'], Fire: ['Fighting', 'Ground', 'Dragon', 'Rock', 'Flying'], Water: ['Ice', 'Ground', 'Dark', 'Fighting', 'Psychic'], Electric: ['Steel', 'Flying', 'Ice', 'Grass', 'Fairy'], Grass: ['Poison', 'Ground', 'Fairy', 'Fighting', 'Dark'], Ice: ['Water', 'Ground', 'Fighting', 'Rock', 'Psychic'], Fighting: ['Rock', 'Dark', 'Ground', 'Steel', 'Ice'], Poison: ['Ground', 'Dark', 'Grass', 'Fire', 'Bug'], Ground: ['Rock', 'Steel', 'Dragon', 'Bug', 'Fire'], Flying: ['Steel', 'Fighting', 'Dark', 'Ground', 'Normal'], Psychic: ['Fighting', 'Fairy', 'Dark', 'Ghost', 'Electric'], Bug: ['Rock', 'Fighting', 'Poison', 'Steel', 'Flying'], Rock: ['Ground', 'Fighting', 'Steel', 'Dark', 'Fire'], Ghost: ['Dark', 'Fighting', 'Psychic', 'Poison', 'Ice'], Dragon: ['Fire', 'Ground', 'Steel', 'Flying', 'Electric'], Dark: ['Fighting', 'Poison', 'Ghost', 'Steel', 'Fire'], Steel: ['Ground', 'Rock', 'Fighting', 'Dark', 'Electric'], Fairy: ['Psychic', 'Fire', 'Steel', 'Normal', 'Grass'] };
const COVER_POWER = 0.72; // coverage hits without the same-type bonus
function hashStr(x) { let h = 2166136261; for (const c of x) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function lineTypes(sp) { const root = LINE[sp] || sp, out = new Set(), q = [root]; while (q.length) { const n = q.shift(); SP[n].types.forEach(t => out.add(t)); for (const e of SP[n].evos || []) q.push(e.to); } return out; }
// each evolution line has three coverage options, the same for every member of the species; an individual learns two of them
function coverOptions(sp) {
  const own = lineTypes(sp), root = LINE[sp] || sp;
  const pool = [...new Set([...own].flatMap(t => COVER[t]))].filter(t => !own.has(t));
  const h = hashStr(root);
  const picked = [];
  for (let i = 0; picked.length < 3 && i < pool.length * 3; i++) { const t = pool[(h + i * 7 + (h >> (i % 8))) % pool.length]; if (!picked.includes(t)) picked.push(t); }
  return picked.map((t, i) => ({ t, lv: [20, 30, 42][i] + ((h >>> (i * 3)) % 9) }));
}
// fill in anything a Pokémon is missing (also upgrades Pokémon from older saves)
function ensureMon(m, elite) {
  if (!m.iv) { const roll = () => elite ? Math.max(ri(0, 31), ri(0, 31)) : ri(0, 31); m.iv = ivSet(roll);
    if (needsGoodIVs(m.sp)) for (const k of STAT_KEYS) m.iv[k] = Math.max(m.iv[k], ri(16, 31)); }
  // Pokémon from before six-stat spreads: Sp. Atk and Sp. Def take the old combined Attack and Defense
  if (m.iv.spa == null) m.iv.spa = m.iv.atk; if (m.iv.spd == null) m.iv.spd = m.iv.def;
  if (!m.nat) m.nat = pick(Object.keys(NATURES));
  if (!m.abSlot) m.abSlot = rollAbSlot(m);
  if (!m.cov) { const opts = coverOptions(m.sp); m.cov = shuffle(opts).slice(0, 2).sort((a, b) => a.lv - b.lv); }
  if (!m.moves && m.sp && SP[m.sp] && m.lvl != null) refreshMoves(m);
  if (m.fr == null) m.fr = 70;
  if (m.form == null) m.form = 0;
  return m;
}
function learnedCov(m) { const L = moveLv(m); return (m.cov || []).filter(c => L >= c.lv).map(c => c.t); }
// a full set of six IVs from a roll function (or a fixed number)
const ivSet = roll => Object.fromEntries(STAT_KEYS.map(k => [k, typeof roll === 'function' ? roll() : roll]));
function ivTotal(m) { return m.iv ? STAT_KEYS.reduce((a, k) => a + (m.iv[k] ?? m.iv[k === 'spa' ? 'atk' : k === 'spd' ? 'def' : k] ?? 15), 0) : 93; }
const FR_TIERS = [[255, 'Inseparable'], [220, 'Devoted'], [170, 'Close'], [110, 'Friendly'], [60, 'Warming up'], [0, 'Wary']];
const frTier = fr => FR_TIERS.find(([n]) => fr >= n)[1];
const FORM_TIERS = [[2, 'On fire'], [0.75, 'Hot'], [-0.75, 'Steady'], [-2, 'Cold'], [-99, 'Slumping']];
const formTier = f => FORM_TIERS.find(([n]) => f >= n)[1];
function makeMon(sp, lvl, pref) { return ensureMon({ uid: uid(), sp: formAt(sp, lvl, pref), lvl }); }
function evolveMon(m, pref) {
  const out = []; let s = SP[m.sp], nx;
  if (heldItem(m) === 'everstone') return out;
  while ((nx = pickBranch(s, m.lvl, pref))) { out.push([s.name, nx]); (m.evoLog = m.evoLog || []).push({ from: s.name, to: nx, lvl: Math.floor(m.lvl), season: S.season || 1 }); m.sp = nx; s = SP[nx]; }
  return out;
}
function monPower(m) { return Math.floor(m.lvl) * SP[m.sp].bst / 450; }
function topAvg(t, n) { const ls = t.team.map(m => m.lvl).sort((a, b) => b - a).slice(0, n); return ls.reduce((a, b) => a + b, 0) / Math.max(1, ls.length); }
function teamPower(t) { const p = t.team.map(monPower).sort((a, b) => b - a); return p.reduce((a, b) => a + b, 0) / 6; }

// ---------- personality traits ----------
// Most trainers have one trait: a small, readable quirk in how they battle, train, catch or develop.
const TRAITS = {
  clutch:      { name: 'Clutch',       text: 'Raises their game in League and title battles (+4%).' },
  streaky:     { name: 'Streaky',      text: "Their Pokémon run hot and cold: form swings much harder." },
  steady:      { name: 'Steady',       text: 'Form barely moves, win or lose.' },
  grinder:     { name: 'Grinder',      text: 'Training weeks give 12% more levels.' },
  mentor:      { name: 'Mentor',       text: "Teammates' Pokémon level 5% faster." },
  collector:   { name: 'Collector',    text: 'Finds stronger wild Pokémon, and alphas and shinies twice as often.' },
  lateBloomer: { name: 'Late Bloomer', text: 'Keeps improving well into their twenties and early thirties.' },
  competitor:  { name: 'Competitor',   text: 'Seeks out road battles and is fired up against rivals (+5%).' },
  hothead:     { name: 'Hothead',      text: 'Hits a little harder (+2%), but losses rattle their Pokémon.' },
  // v199
  underdog:    { name: 'Underdog',     text: 'Rises to the occasion against a stronger team (+5%).' },
  frontrunner: { name: 'Front-runner', text: 'Dominates weaker teams (+4%), but wilts against stronger ones (−3%).' },
  comeback:    { name: 'Comeback Kid', text: 'Bounces back: the battle after a loss gets +4%.' },
  homeTurf:    { name: 'Home Turf',    text: 'As a Gym Leader, Elite Four member or Champion, defends their seat at +4%.' },
  purist:      { name: 'Purist',       text: 'Battles at +3% when every Pokémon on the team fits their specialty.' },
  hero:        { name: 'Hero',         text: 'Fights villain teams at +6% and opens Shadow Pokémon hearts faster.' },
  globetrotter:{ name: 'Globetrotter', text: 'At their best in the World Championship (+5%), keener to move Leagues and chase the Grand Slam.' },
};
const TRAIT_CHANCE = 0.75;
// famous trainers get the trait that fits them
const FAMOUS_TRAITS = { Ash: 'competitor', Gary: 'competitor', Blue: 'competitor', Silver: 'hothead', Barry: 'hothead', Hau: 'competitor', Gladion: 'hothead', Bianca: 'streaky', Red: 'steady', Wally: 'lateBloomer',
  Cynthia: 'clutch', Lance: 'clutch', Steven: 'collector', Wallace: 'clutch', Alder: 'mentor', Diantha: 'clutch', Kukui: 'mentor', Brock: 'mentor', Misty: 'hothead', Iris: 'competitor', Cilan: 'steady', Clemont: 'grinder',
  Oak: 'mentor', Elm: 'mentor', Birch: 'collector', Rowan: 'mentor', Juniper: 'collector', Sycamore: 'mentor', Magnolia: 'mentor', Sada: 'collector', Turo: 'grinder', Chuck: 'grinder', Bruno: 'grinder', Marshal: 'grinder',
  Hala: 'mentor', Guzma: 'hothead', Giovanni: 'clutch', Lusamine: 'collector', Agatha: 'steady', Pryce: 'steady', Byron: 'steady', Flint: 'hothead', Blaine: 'hothead', Burgh: 'streaky', Tracey: 'collector', May: 'collector', Dawn: 'streaky', Serena: 'lateBloomer', Max: 'lateBloomer',
  Leon: 'clutch', Raihan: 'competitor', Hop: 'lateBloomer', Marnie: 'steady', Bede: 'hothead', Piers: 'steady', Kabu: 'grinder', Bea: 'grinder', Opal: 'mentor', Allister: 'streaky', Sonia: 'mentor', Rose: 'clutch', Goh: 'collector', Chloe: 'lateBloomer',
  Geeta: 'clutch', Nemona: 'competitor', Arven: 'grinder', Penny: 'collector', Kieran: 'hothead', Iono: 'streaky', Larry: 'steady', Grusha: 'steady', Hassel: 'mentor', Poppy: 'competitor', Katy: 'mentor', Liko: 'lateBloomer', Roy: 'competitor', Friede: 'mentor', Dot: 'collector',
  Noland: 'collector', Greta: 'hothead', Tucker: 'clutch', Lucy: 'steady', Spenser: 'mentor', Brandon: 'grinder', Anabel: 'steady', Palmer: 'mentor', Thorton: 'collector', Dahlia: 'streaky', Darach: 'steady', Argenta: 'mentor', Ingo: 'steady', Emmet: 'streaky',
  Maxie: 'grinder', Archie: 'hothead', Cyrus: 'steady', Ghetsis: 'clutch', Lysandre: 'clutch', Volo: 'collector', Archer: 'hothead', Ariana: 'steady', Courtney: 'streaky', Matt: 'hothead', Shelly: 'hothead', Mars: 'streaky', Jupiter: 'steady', Saturn: 'steady', Colress: 'collector',
  Paul: 'grinder', Trip: 'competitor', Alain: 'clutch', Tobias: 'clutch', Sawyer: 'lateBloomer', Ritchie: 'steady', Harrison: 'competitor', Morrison: 'hothead', Cameron: 'streaky',
  // v199
  'Lt. Surge': 'homeTurf', Sabrina: 'homeTurf', Clair: 'homeTurf', Norman: 'homeTurf', Wulfric: 'homeTurf', Drake: 'homeTurf', Lorelei: 'homeTurf', Lucian: 'homeTurf',
  Karen: 'purist', Erika: 'purist', Koga: 'purist', Janine: 'purist', Morty: 'purist', Fantina: 'purist', Phoebe: 'purist', Glacia: 'purist', Bugsy: 'purist',
  Brendan: 'underdog', Ethan: 'underdog', Hilda: 'underdog', Gloria: 'underdog', Florian: 'underdog', Victor: 'underdog', Lucas: 'underdog',
  Michael: 'hero', Hilbert: 'hero', Nate: 'hero', Rosa: 'hero', Elio: 'hero', Selene: 'hero', Calem: 'hero', Lyra: 'hero', Juliana: 'hero',
  Hugh: 'comeback', Kenny: 'comeback', Zoey: 'comeback', Brawly: 'comeback', Cheren: 'comeback', Tierno: 'comeback',
  Chili: 'frontrunner', Drew: 'frontrunner', Ursula: 'frontrunner', Avery: 'frontrunner', Klara: 'frontrunner', Malva: 'frontrunner',
  Peony: 'globetrotter', Kahili: 'globetrotter', Willow: 'globetrotter', Lillie: 'globetrotter', Juan: 'globetrotter' };
function rollTrait() { return rand() < TRAIT_CHANCE ? pick(Object.keys(TRAITS)) : null; }
// trainers from older saves get a trait the first time it's needed
function traitOf(t) { if (!t) return null; if (t.trait === undefined) t.trait = (t.famous && FAMOUS_TRAITS[famBase(t)]) || rollTrait(); return t.trait; }
const hasTrait = (t, k) => traitOf(t) === k;
function newTrainer({ age, quality = 50, role = 'challenger', specialty, seasons = 0, noFamous = false }) {
  const id = S.nextId++;
  const r = {};
  for (const k of RK) r[k] = clamp(Math.round(quality + (rand() - 0.5) * 34), 8, 96);
  const t = {
    id, name: '', cls: '', gender: 'm', age, r, specialty: specialty === undefined ? (rand() < 0.14 && ['challenger', 'prospect'].includes(role) ? null : pick(TYPES)) : specialty, role,
    pot: 0, team: [], badges: [], badgeWeek: null, weekLog: [], seasons,
    career: { badges: 0, gymW: 0, gymL: 0, leagueApps: 0, titles: 0, defenses: 0, e4Wins: 0 },
    seasonHist: [], user: false, formerUser: false, joined: S.season,
  };
  assignClass(t, age, ['challenger', 'prospect', 'free'].includes(role));
  // advanced option: every trainer the game creates is a famous trainer, while any are free
  const f = S.cfg && S.cfg.allFamous && !noFamous ? chooseFamous(role, t.specialty) : null;
  if (f) {
    const ver = chooseFamous.ver || 1;
    t.name = famName(f, ver); t.famKey = f.name; if (ver > 1) t.famVer = ver;
    t.cls = f.cls; t.gender = f.g; t.famous = true; t.famTags = f.tags.slice(); t.spec2 = null; t.age = f.age; t.famousTeam = f.team;
    if (!['leader', 'e4', 'champion'].includes(role) || f.spec) { t.specialty = f.spec; if (role !== 'leader') t.spec2 = f.spec2 || null; }
    S.famousUsed.push(t.name);
  }
  t.trait = (t.famous && (f && f.custom ? TRAITS[f.trait] && f.trait : FAMOUS_TRAITS[famBase(t)])) || rollTrait();
  t.pot = clamp(ovr(t) + Math.max(0, Math.round((22 - t.age) * ri(1, 4) * 0.9)) + ri(-4, 6), ovr(t), 99);
  S.trainers[id] = t;
  return t;
}
// v176: in an all-famous league, once every famous trainer has debuted the whole roster comes round again as V2
// (Kanto Leader Misty V2), then V3 and so on, rather than falling back to generated trainers. Each version is its own
// trainer with its own record; a name is never reused.
const famName = (f, ver) => ver > 1 ? `${f.name} V${ver}` : f.name;
const famBase = t => t.famKey || t.name;
// pick a free famous trainer for a role, preferring a fitting title and type
function chooseFamous(role, spec) {
  ensureCustom();
  S.famousUsed = S.famousUsed || [];
  S.famousGen = S.famousGen || 1;
  const freeAt = ver => FAMOUS.filter(f => famousOn(f) && !S.famousUsed.includes(famName(f, ver)) && famousNameFree({ name: famName(f, ver), cls: f.cls }));
  // fill the earliest round with a free name first: an undrafted prospect leaving frees their name up again
  let ver = 1, free = freeAt(1);
  while (!free.length && ver < S.famousGen) free = freeAt(++ver);
  while (!free.length && S.famousGen < 99 && FAMOUS.some(famousOn)) { ver = ++S.famousGen; free = freeAt(ver); if (free.length) news(`Every famous trainer has now debuted. From here on they return as V${ver}: new trainers carrying a famous name and style, each with a record of their own.`, 'draft'); }
  if (!free.length) return null;
  chooseFamous.ver = ver;
  // a V2 waits for the earlier version to retire where it can, so there's rarely two Mistys on the circuit at once
  if (ver > 1) {
    const prevGone = f => { const prev = famName(f, ver - 1); return !Object.values(S.trainers).some(x => x.famous && x.name === prev && x.role !== 'retired'); };
    const ready = free.filter(prevGone);
    if (ready.length) free = ready;
  }
  const fit = f => {
    let w = 1;
    if (role === 'champion' && /Champion|Master/.test(f.cls)) w += 6;
    if (role === 'e4' && (/Elite Four|Master/.test(f.cls) || f.tags.includes('brain'))) w += 4;
    if (role === 'leader' && f.tags.includes('brain')) w += 2;
    if (role === 'leader' && /Leader|Kahuna|Captain/.test(f.cls)) w += 4;
    if (['prospect', 'challenger', 'free'].includes(role) && f.age <= 25) w += 2;
    if (spec && f.spec === spec) w += 2;
    return w;
  };
  let r = rand() * free.reduce((a, f) => a + fit(f), 0);
  for (const f of free) { r -= fit(f); if (r <= 0) return f; }
  return free[free.length - 1];
}
// a famous trainer's signature picks, one per slot, never two of the same evolution line
function signaturePicks(team) { const used = new Set(); return team.map(sp => { const all = [].concat(sp).filter(x => SP[x]), opts = all.filter(x => !used.has(LINE[x]));
  // v185: a Pokémon this league's Pokédex doesn't have (one of the player's own, in a league without them) is swapped for a common one
  const c = opts.length ? pick(opts) : all.length ? pick(all) : pick(BASES.filter(b => !SP[b].rare && SP[b].bst < 360 && !used.has(b))); used.add(LINE[c]); return c; }); }
function signatureTeam(t, lvl) { return signaturePicks(t.famousTeam).map((sp, i) => stamp(makeMon(sp, Math.max(5, lvl - i * 2), t.specialty), 'starter')); }
function starterTeam(t, lvl) {
  if (t.famousTeam) { t.team = signatureTeam(t, lvl); return; }
  const starterPool = STARTERS.concat(t.r.sct > 70 && rand() < 0.3 ? ['Dratini', 'Bagon', 'Gible', 'Larvitar', 'Beldum', 'Riolu'] : []);
  if (t.specialty) {
    const has = (b, ty) => SP[formAt(b, lvl, t.specialty)].types.includes(ty);
    const fits = b => specTypes(t).some(ty => has(b, ty));
    let spec = BASES.filter(b => fits(b) && SP[b].bst < 360 && !SP[b].rare);
    if (spec.length < 2) spec = spec.concat(BASES.filter(b => fits(b) && SP[b].bst < 360 && SP[b].rare));
    // a dual specialist starts with one Pokémon of each of their types where it can
    const firstPool = t.spec2 ? spec.filter(b => has(b, t.specialty)) : spec;
    const first = pick(firstPool.length ? firstPool : spec.length ? spec : starterPool);
    if (t.spec2) { const sec = spec.filter(b => b !== first && has(b, t.spec2)); if (sec.length) { t.team = [makeMon(first, lvl), makeMon(pick(sec), lvl - 2)]; t.team.forEach(m => stamp(m, 'starter')); return; } }
    const rest = spec.filter(b => b !== first);
    const second = rest.length && rand() < 0.75 ? pick(rest) : pick(BASES.filter(b => SP[b].bst < 330 && b !== first && !SP[b].rare));
    t.team = [makeMon(first, lvl), makeMon(second, lvl - 2)];
  } else {
    const first = pick(starterPool);
    t.team = [makeMon(first, lvl), makeMon(pick(BASES.filter(b => SP[b].bst < 330 && b !== first && !SP[b].rare)), lvl - 2)];
  }
  t.team.forEach(m => stamp(m, 'starter'));
}

// ---------- elite teams ----------
// a post's level and team size, looked up in the trainer's own League (with several Leagues, the other Leagues' gyms and
// Elite Four sit in S.leagues while one is bound; looking in the wrong one gave an undefined level, and every Pokémon on
// that team a broken level and no HP, which crashed the next battle)
function eliteSlot(t) {
  if (t.role === 'champion') return { lvl: champLv(), size: 6 };
  // the League that's loaded first (a trainer's League tag is only refreshed when Leagues switch), then the others
  const places = [S].concat((S.leagues || []).filter(x => x && x !== S));
  for (const L of places) {
    if (t.role === 'e4') { const i = (L.e4 || []).indexOf(t.id); if (i >= 0) return { lvl: E4_LV[i], size: i < 2 ? 5 : 6 }; }
    if (t.role === 'leader') { const i = (L.gyms || []).findIndex(g => g.leader === t.id); if (i >= 0) return { lvl: GYM_LV[i], size: GYM_SIZE[i] }; }
  }
  return null;
}
// mend any Pokémon left with a broken level by the bug above (older saves): post-holders are re-levelled for their post,
// anyone else's Pokémon take their team's typical level
function repairLevels() {
  let fixed = 0;
  for (const t of Object.values(S.trainers)) {
    const bad = (t.team || []).filter(m => !Number.isFinite(m.lvl));
    if (!bad.length) continue;
    fixed += bad.length;
    if (['leader', 'e4', 'champion'].includes(t.role)) inLeague(homeLeague(t), () => relevelElite(t));
    const ok = (t.team || []).map(m => m.lvl).filter(Number.isFinite), base = ok.length ? Math.max(...ok) - 2 : 20;
    for (const m of t.team || []) if (!Number.isFinite(m.lvl)) { m.lvl = Math.max(5, base); m.cap = m.lvl + 2; }
  }
  return fixed;
}
function buildEliteTeam(type, L, size, mixed) {
  let cap = 300 + L * 6.2;
  let pool = [];
  for (let tries = 0; tries < 4 && pool.length < size; tries++) {
    const set = new Set();
    for (const b of BASES) { const f = formAt(b, L, type); const s = SP[f]; if (s.bst <= cap && (mixed || s.types.includes(type)) && !bannedIn(f, S.lg || 0)) set.add(f); }
    pool = [...set]; cap += 60;
  }
  pool.sort((a, b) => SP[b].bst - SP[a].bst);
  let chosen = shuffle(pool.slice(0, Math.max(size + 2, Math.ceil(pool.length * 0.6)))).slice(0, size);
  if (mixed && type) { const spec = pool.filter(p => SP[p].types.includes(type)); if (spec.length && !chosen.some(c => SP[c].types.includes(type))) chosen[0] = spec[0]; }
  while (chosen.length < size) chosen.push(pick(pool.length ? pool : BASES));
  chosen.sort((a, b) => SP[a].bst - SP[b].bst);
  return chosen.map((sp, i) => makeMon(sp, L - (size - 1 - i)));
}
// ---------- gym leaders adapt ----------
// A Gym Leader who loses several challenges in a row rethinks their team before the next challenger: the Pokémon
// doing least for them this season goes, and a different Pokémon of the gym's type comes in, picked to counter
// the types that have been beating them.
const GYM_ADAPT_STREAK = 4, GYM_ADAPT_COOLDOWN = 3;
function gymLost(i, winner) {
  const gym = S.gyms[i];
  if (!featOn('gymadapt')) return;
  gym.streak = (gym.streak || 0) + 1;
  // remember what's been beating them: the types of each winner's strongest Pokémon
  const top = winner.team.slice().sort((a, b) => monPower(b) - monPower(a)).slice(0, 3);
  gym.foes = (gym.foes || []).concat(top.flatMap(m => SP[m.sp].types)).slice(-30);
  if (gym.streak >= GYM_ADAPT_STREAK && (gym.lastSwap == null || S.week - gym.lastSwap >= GYM_ADAPT_COOLDOWN)) adaptGym(i);
}
function adaptGym(i) {
  const gym = S.gyms[i], L = T(gym.leader), slot = L && eliteSlot(L);
  if (!L || !slot || L.team.length < 2) return;
  const foes = {}; for (const ty of gym.foes || []) foes[ty] = (foes[ty] || 0) + 1;
  const n = Object.values(foes).reduce((a, b) => a + b, 0) || 1;
  // how well a Pokémon handles the types that have been winning: hits them hard, and isn't hit hard by them
  const vs = sp => { let sc = 0; for (const [ty, c] of Object.entries(foes)) sc += c / n * (bestMult(SP[sp].types, [ty]) - bestMult([ty], SP[sp].types)); return sc; };
  const lines = new Set(L.team.map(m => LINE[m.sp]));
  const cands = buildEliteTeam(L.specialty, slot.lvl, 8, false).filter(m => !lines.has(LINE[m.sp]));
  if (!cands.length) return;
  const best = cands.sort((a, b) => vs(b.sp) + SP[b.sp].bst / 900 - vs(a.sp) - SP[a.sp].bst / 900)[0];
  // drop the one doing least this season (knockouts minus faints), never their strongest
  const ace = L.team.reduce((a, b) => (monPower(a) > monPower(b) ? a : b));
  const perf = m => { const s = m.ss && m.ss.season === S.season ? m.ss : null; return s ? s.ko - s.f + vs(m.sp) : vs(m.sp); };
  const drop = L.team.filter(m => m !== ace && !isSpecial(m)).sort((a, b) => perf(a) - perf(b))[0];
  if (!drop) return;
  farewell(L, drop, `swapped out after a losing streak at ${TOWNS[i]} Gym`);
  L.team = L.team.filter(m => m !== drop);
  stamp(best, 'swap'); best.fr = 120;
  L.team.push(best); relevelElite(L);
  const streak = gym.streak;
  gym.streak = 0; gym.lastSwap = S.week; gym.swaps = (gym.swaps || 0) + 1;
  const top = Object.entries(foes).sort((a, b) => b[1] - a[1]).slice(0, 2).map(x => x[0]);
  news(`${dn(L)} lost ${streak} straight at ${TOWNS[i]} Gym and shook up the team: ${drop.sp} is out, ${best.sp} is in to deal with the ${top.join(' and ')} types that keep winning.`, 'circuit', L.id);
}
// ---------- gym rotation ----------
// Each new season the Gym Leaders are shuffled among the eight towns (the badge order stays the same), so no one
// is stuck at an early gym that nearly every challenger beats. A leader brings their type and their run of poor
// seasons with them. Early gyms field fewer Pokémon: a leader moving down sets the extras aside (not released),
// and one moving up brings them back first, then fills any gap with new Pokémon of their type.
function fitGymTeam(L) {
  const slot = eliteSlot(L); if (!slot) return;
  const pool = L.team.concat(L.bench || []);
  const v = m => (isSpecial(m) ? 2000 : 0) + (onSpec(L, m.sp) ? 1000 : 0) + monPower(m);
  pool.sort((a, b) => v(b) - v(a));
  L.team = pool.slice(0, slot.size); L.bench = pool.slice(slot.size);
  if (L.team.length < slot.size) {
    const lines = new Set(pool.map(m => LINE[m.sp]));
    const fresh = buildEliteTeam(L.specialty, slot.lvl, slot.size - L.team.length + 3, false).filter(m => !lines.has(LINE[m.sp])).slice(0, slot.size - L.team.length);
    fresh.forEach(m => stamp(m, 'assigned')); L.team.push(...fresh);
  }
  relevelElite(L);
}
function rotateGyms() {
  const was = S.gyms.map(g => ({ id: g.leader, poor: g.poor, poorFor: g.poorFor }));
  if (was.some(x => !x.id || !T(x.id))) return;
  const order = shuffle(was.map((_, i) => i));
  order.forEach((from, to) => { const g = S.gyms[to], x = was[from]; g.leader = x.id; g.poor = x.poorFor === x.id ? x.poor : 0; g.poorFor = x.id; });
  for (let i = 0; i < S.gyms.length; i++) {
    const L = T(S.gyms[i].leader);
    const place = `${TOWNS[i]} Gym`, cur = (L.posts || []).find(p => p.to == null);
    // a move closes last season's stint and starts a new one this season
    if (!cur || cur.place !== place) { if (cur) cur.to = Math.max(cur.from, S.season - 1); (L.posts = L.posts || []).push({ role: 'leader', place, from: S.season, to: null, lg: S.lg || 0 }); }
    fitGymTeam(L);
  }
  news(`New season, new gym order: ${S.gyms.map((g, i) => `${TOWNS[i]} — ${T(g.leader).name} (${T(g.leader).specialty})`).join(', ')}.`, 'move');
}
// ---------- Mega Evolution ----------
// Completing the badge circuit earns a challenger a Key Stone and a Mega Stone for that season only. The Elite Four
// and the Champion hold Key Stones while in their posts. In League battles (the Elite Four, title matches and seat
// challenges) a trainer can Mega Evolve the stone's holder once per battle, as it comes out. Gym Leaders don't.
// MEGA_RAW (Mega forms): in pokemon-data.js
const MEGA = {}; // species -> [{ v, name, types, bst }]
for (const line of MEGA_RAW.split('\n')) {
  const [sp, v, t1, t2, bst] = line.split('|');
  { const name = `Mega ${sp}${v ? ' ' + v : ''}`; (MEGA[sp] = MEGA[sp] || []).push({ v: v || '', name, types: [t1, t2].filter(Boolean), bst: +bst, bs: spreadFor(name, +bst) }); }
}
const megaForms = m => (m && MEGA[m.sp]) || [];
// the Mega form a trainer's stone would give this Pokémon: X or Y by the trainer's type where it matters
function megaFor(t, m) {
  const forms = megaForms(m); if (!forms.length) return null;
  if (t && t.mega && t.mega.uid === m.uid && t.mega.v) { const f = forms.find(x => x.v === t.mega.v); if (f) return f; }
  return forms.slice().sort((a, b) => specTypes(t).filter(ty => b.types.includes(ty)).length - specTypes(t).filter(ty => a.types.includes(ty)).length)[0];
}
const hasMega = t => !!(featOn('mega') && t && t.mega && t.mega.season === S.season);
const megaHolder = t => hasMega(t) ? t.team.find(m => m.uid === t.mega.uid && megaForms(m).length) || null : null;
// give the stone to the best Pokémon that can Mega Evolve right now (null if none)
function assignMegaStone(t, uid, v) {
  if (!hasMega(t)) return null;
  const all = t.team.filter(m => megaForms(m).length && !m.shadow);
  // left to itself, the stone goes to a Pokémon that isn't the trainer's Battle Bond partner, so the team can use both
  const free = all.filter(m => m.bond !== t.id), cands = uid != null || !free.length ? all : free;
  const m = uid != null ? cands.find(x => x.uid === uid) : cands.sort((a, b) => monPower(b) * megaFor(t, b).bst - monPower(a) * megaFor(t, a).bst)[0];
  if (!m) { t.mega.uid = null; t.mega.v = ''; return null; }
  t.mega.uid = m.uid; t.mega.v = v != null ? v : megaFor(t, m).v;
  return m;
}
function earnMega(t) {
  if (!featOn('mega')) return;
  t.mega = { season: S.season, uid: null, v: '' };
  const m = assignMegaStone(t);
  t.career.megaStones = (t.career.megaStones || 0) + 1;
  if (m) news(`${dn(t)} completed the badge circuit and earned a Key Stone and a Mega Stone for ${m.sp}, good for the League this season.`, t.user ? 'you' : 'circuit', t.id);
  else if (t.user) news(`${dn(t)} completed the badge circuit and earned a Key Stone, but has no Pokémon that can Mega Evolve. Catch or evolve one before the League to get its Mega Stone.`, 'you', t.id);
}
// before the League: a trainer whose holder left or who had no eligible Pokémon gets the stone sorted out,
// and the Elite Four and Champion are ready with theirs
function settleMegaStones() {
  for (const t of challengers()) if (hasMega(t) && !megaHolder(t)) assignMegaStone(t);
  for (const id of [...S.e4, S.champion]) { const t = T(id); if (t) eliteMega(t); }
}
// the Elite Four and the Champion Mega Evolve only if one of their own Pokémon can; the League supplies none
function eliteMega(t) {
  const keep = t.mega && t.mega.uid; t.mega = { season: S.season, uid: keep || null, v: (t.mega && t.mega.v) || '' };
  if (megaHolder(t)) return;
  assignMegaStone(t);
}
const megaStakes = s => s === 'league' || s === 'title';
function relevelElite(t) {
  const slot = eliteSlot(t); if (!slot) return;
  const off = Math.round((ovr(t) - 60) / 9);
  const n = t.team.length;
  t.team.sort((a, b) => SP[a.sp].bst - SP[b.sp].bst);
  t.team.forEach((m, i) => { m.lvl = slot.lvl + off - Math.min(4, n - 1 - i) + (t.role === 'champion' && i === n - 1 ? CHAMP_ACE_BONUS : 0); m.cap = m.lvl + 2; evolveMon(m, t.specialty); });
  if (['leader', 'e4', 'champion'].includes(t.role)) eliteItems(t);
  for (const m of t.team) refreshMoves(m);
}
function installElite(t, role, slotIndex) {
  if (t.famousTeam && !t.team.length) t.team = signatureTeam(t, 20);
  t.specialty = specOf(t);
  // a gym has one type, so a dual specialist who takes a gym leads it with their primary type
  if (role === 'leader') t.spec2 = null;
  t.role = role; t.lg = S.lg || 0;
  dropFromCircuits(t.id);
  if (role === 'leader') S.gyms[slotIndex].leader = t.id;
  if (role === 'e4') S.e4[slotIndex] = t.id;
  if (role === 'champion') S.champion = t.id;
  openPost(t, role);
  const slot = eliteSlot(t);
  if (role === 'champion' && t.team.length >= 4) {
    while (t.team.length < 6) t.team.push(stamp(makeMon(pick(BASES), slot.lvl), 'assigned'));
  } else if (role === 'e4' && t.team.length >= 3) {
    // a new Elite Four member keeps the whole team they qualified with; the League only tops up a short team
    if (t.team.length < slot.size) { const have = new Set(t.team.map(m => LINE[m.sp])); buildEliteTeam(t.specialty, slot.lvl, slot.size - t.team.length + 3, false).filter(m => !have.has(LINE[m.sp]) && have.add(LINE[m.sp])).slice(0, slot.size - t.team.length).forEach(m => t.team.push(stamp(m, 'assigned'))); }
  } else {
    const keep = t.team.filter(m => onSpec(t, m.sp) || isSpecial(m)).sort((a, b) => (isSpecial(b) - isSpecial(a)) || monPower(b) - monPower(a)).slice(0, Math.min(2, slot.size - 1));
    const have = new Set(keep.map(m => LINE[m.sp]));
    const fresh = buildEliteTeam(t.specialty, slot.lvl, slot.size - keep.length + 3, role === 'champion').filter(m => !have.has(LINE[m.sp]) && have.add(LINE[m.sp])).slice(0, slot.size - keep.length);
    for (const m of t.team) if (!keep.includes(m)) farewell(t, m, `left behind on becoming ${role === 'e4' ? 'Elite Four' : role === 'leader' ? 'Gym Leader' : 'Champion'}`);
    fresh.forEach(m => stamp(m, 'assigned'));
    t.team = keep.concat(fresh);
  }
  relevelElite(t);
}

// ================= BATTLE =================
// v193: tournament rules that reshape base stats. Scalemons scales every stat but HP so the six add up to 600;
// Flipped reverses them (HP and Speed, Attack and Sp. Def, Defense and Sp. Atk swap places)
function tourneyStats(b) {
  if (BATTLE_RULE === 'scalemons') { const rest = b.atk + b.def + b.spa + b.spd + b.spe, k = rest > 0 ? Math.max(0, 600 - b.hp) / rest : 1;
    return { hp: b.hp, atk: b.atk * k, def: b.def * k, spa: b.spa * k, spd: b.spd * k, spe: b.spe * k }; }
  if (BATTLE_RULE === 'flipped') return { hp: Math.max(1, b.spe), atk: b.spd, def: b.spa, spa: b.def, spd: b.atk, spe: b.hp };
  return b;
}
function battler(m) {
  ensureMon(m);
  const s = SP[m.sp], b = tourneyStats(isGlitch(m.sp) ? glitchSpread() : bsOf(m.sp)), base = s.bst / 6, glitchTop = isGlitch(m.sp) ? STAT_KEYS.reduce((x, k) => (b[k] > b[x] ? k : x), 'hp') : null, L = Math.max(2, Math.floor(m.lvl));
  const nx = natureFx(m.nat), iv = k => 1 + (m.iv[k] - 15.5) / 155; // IVs move a stat by up to ±10%
  const stat = k => (Math.floor(2 * b[k] * L / 100) + 5) * iv(k) * nx[k];
  const hp = Math.round((Math.floor(2 * b.hp * L / 100) + L + 10) * iv('hp'));
  // hot or cold streak: up to ±6% damage (v197: Hardy ignores it, Mild ignores a cold one)
  const fv = isTemper(m, 'Hardy') ? 0 : isTemper(m, 'Mild') ? Math.max(0, clamp(m.form, -3, 3)) : clamp(m.form, -3, 3);
  const form = 1 + fv * 0.02;
  const frx = m.fr / 255;                                            // friendship
  return { sp: m.sp, glitchTop, types: monTypes(m), cov: learnedCov(m), L, base, hp, max: hp, endured: false, shadow: !!m.shadow,
    atk: stat('atk') * (m.shadow ? SHADOW_ATK : 1), spa: stat('spa') * (m.shadow ? SHADOW_ATK : 1), formMul: form, def: stat('def'), spd: stat('spd'), spe: b.spe * iv('spe') * nx.spe,
    critB: frx * 0.04 + (heldItem(m) === 'scopelens' ? 0.06 : 0), endB: frx * 0.12, item: heldItem(m), evolves: !!s.evos,
    ab: abilityOf(m), status: null, st: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }, streak: 0,
    moves: (() => { const list = (m.moves && m.moves.length ? m.moves : idealMoves(m)).map(n => MOVES[n]).filter(Boolean); return list.length ? list : [MOVES.Tackle]; })() };
}
// fixed stat changes from a held item, applied once when the battle starts
function applyItemStats(b) {
  if (b.item === 'assaultvest') b.spd *= 1.4;
  if (b.item === 'eviolite' && b.evolves) { b.def *= 1.5; b.spd *= 1.5; }
  if (b.item === 'choiceband') { b.atk *= 1.3; b.choice = true; }
  if (b.item === 'choicespecs') { b.spa *= 1.3; b.choice = true; }
}
const STAT_NAME_B = { atk: 'Attack', def: 'Defense', spa: 'Sp. Atk', spd: 'Sp. Def', spe: 'Speed' };
// v178 form changes: stat multipliers from the data form to the other form (the data holds Wishiwashi's School Form,
// Palafin's Hero Form, Minior's Meteor Form, Eiscue's Ice Face and Aegislash's Shield Forme)
const FORM_MUL = {
  solo: { atk: 20 / 140, def: 20 / 130, spa: 25 / 140, spd: 25 / 135, spe: 40 / 30 },
  core: { atk: 100 / 60, def: 60 / 100, spa: 100 / 60, spd: 60 / 100, spe: 120 / 60 },
  zero: { atk: 70 / 160, def: 72 / 97, spa: 53 / 106, spd: 62 / 87, spe: 1 },
  noice: { atk: 1, def: 70 / 110, spa: 1, spd: 1, spe: 130 / 50 },
};
function formShift(m, k, back) { const f = FORM_MUL[k]; for (const s of ['atk', 'def', 'spa', 'spd', 'spe']) m[s] = back ? m[s] / f[s] : m[s] * f[s]; }
// abilities that are part of a Pokémon's body: Mummy and Wandering Spirit can't replace them
const UNSWAP = ['Multitype', 'RKS System', 'Stance Change', 'Schooling', 'Shields Down', 'Comatose', 'Disguise', 'Zero to Hero', 'Ice Face', 'Gulp Missile', 'Hunger Switch', 'Wonder Guard', 'Illusion', 'Forecast', 'Mimicry'];
// held items that change a stat for the whole battle (moved by Magician)
function itemStatFx(b, k, sign) {
  const f = k === 'assaultvest' ? [['spd', 1.4]] : k === 'eviolite' && b.evolves ? [['def', 1.5], ['spd', 1.5]] : k === 'choiceband' ? [['atk', 1.3]] : k === 'choicespecs' ? [['spa', 1.3]] : [];
  for (const [s, x] of f) b[s] = sign > 0 ? b[s] * x : b[s] / x;
  if (k === 'choiceband' || k === 'choicespecs') { b.choice = sign > 0; if (sign < 0) b.lock = null; }
}
const ABSORB = { Levitate: { ty: 'Ground' }, 'Flash Fire': { ty: 'Fire', ff: true }, 'Water Absorb': { ty: 'Water', heal: true }, 'Volt Absorb': { ty: 'Electric', heal: true },
  'Sap Sipper': { ty: 'Grass', stat: 'atk' }, 'Lightning Rod': { ty: 'Electric', stat: 'spa' }, 'Storm Drain': { ty: 'Water', stat: 'spa' }, 'Motor Drive': { ty: 'Electric', stat: 'spe' }, 'Dry Skin': { ty: 'Water', heal: true } };
const PINCH = { Blaze: 'Fire', Torrent: 'Water', Overgrow: 'Grass', Swarm: 'Bug' };
// ---------- move combat ----------
const BREAKERS = ['Mold Breaker', 'Teravolt', 'Turboblaze'];
// contact (Long Reach never makes it), moves an ability blocks outright, and Liquid Voice's sound moves turned Water
const contactOf = (a, mv) => mv.flags.includes('c') && a.ab !== 'Long Reach';
const blocksMove = (dAb, mv) => (dAb === 'Soundproof' && mv.flags.includes('s')) || (dAb === 'Bulletproof' && mv.flags.includes('o'));
const LV_MOVES = {}, ATE = { Pixilate: 'Fairy', Refrigerate: 'Ice', Galvanize: 'Electric' };
// Pixilate & co. turn Normal moves into their type (×1.2)
function asUsed(a, mv) {
  if (a.ab === 'Liquid Voice' && mv.flags.includes('s') && mv.type !== 'Water') return LV_MOVES[mv.name] = LV_MOVES[mv.name] || Object.assign({}, mv, { type: 'Water' });
  if (a.ab === 'Hunger Switch' && a.hangry && mv.type === 'Electric') { const k = 'HS' + mv.name; return LV_MOVES[k] = LV_MOVES[k] || Object.assign({}, mv, { type: 'Dark' }); }
  const to = ATE[a.ab]; if (to && mv.type === 'Normal') { const k = a.ab + mv.name; return LV_MOVES[k] = LV_MOVES[k] || Object.assign({}, mv, { type: to, ate: true }); }
  return mv;
}
const AURA = { 'Fairy Aura': 'Fairy', 'Dark Aura': 'Dark' };
const BOUNCES = /^(st:|seed|foe:|hazard)/; // utility moves Magic Bounce reflects
// terrain abilities (adapted): every Pokémon on the holder's team hits harder with that type, all battle
const SURGE = { 'Electric Surge': ['Electric', 1.2], 'Psychic Surge': ['Psychic', 1.2], 'Grassy Surge': ['Grass', 1.2], 'Misty Surge': ['Fairy', 1.2], 'Hadron Engine': ['Electric', 1.33] };
const BEST_STAT = m => ['atk', 'def', 'spa', 'spd', 'spe'].reduce((b, k) => (m[k] > m[b] ? k : b), 'atk');
// type effectiveness of a move on a target, with ability immunities (unless the attacker breaks them) and Scrappy
function moveEff(a, mvType, defTypes, dAb) {
  if (dAb && ABSORB[dAb] && ABSORB[dAb].ty === mvType) return 0;
  let m = 1; for (const d of defTypes) m *= (a.ab === 'Scrappy' || a.ab === "Mind's Eye") && d === 'Ghost' && (mvType === 'Normal' || mvType === 'Fighting') ? 1 : effOne(mvType, d);
  return m;
}
// Protosynthesis / Quark Drive: its best stat, chosen when it entered at full HP
const paraMul = (m, k) => m.pBoost === k ? 1.3 : 1;
// attacking stat over defending stat for this move's category: stages (unless Unaware), weather boosts, Marvel Scale…
function statRatio(a, d, phys, w, dAb) {
  const ua = dAb === 'Unaware', ud = a.ab === 'Unaware';
  const fg = m => w === 'sun' && m.sd && m.sd.mons.some(x => x.hp > 0 && x.ab === 'Flower Gift') ? 1.5 : 1; // Flower Gift: the whole team

  if (phys) {
    const pow = ['Huge Power', 'Pure Power', 'Hustle'].includes(a.ab) ? 1.5 : 1, guts = a.ab === 'Guts' && a.status ? 1.5 : 1;
    const A = a.atk * pow * guts * stageMul(ua ? 0 : a.st.atk) * paraMul(a, 'atk') * (a.ab === 'Gorilla Tactics' ? 1.5 : 1) * (a.ab === 'Orichalcum Pulse' && w === 'sun' ? 1.33 : 1)
      * (a.slowStart > 0 ? 0.5 : 1) * (a.ab === 'Defeatist' && a.hp <= a.max / 2 ? 0.5 : 1) * (dAb === 'Tablets of Ruin' ? 0.75 : 1) * fg(a);
    const D = d.def * stageMul(ud ? 0 : d.st.def) * (w === 'snow' && d.types.includes('Ice') ? 1.5 : 1) * (dAb === 'Marvel Scale' && d.status ? 1.5 : 1) * paraMul(d, 'def') * (a.ab === 'Sword of Ruin' ? 0.75 : 1);
    return A / D;
  }
  const SA = a.spa * stageMul(ua ? 0 : a.st.spa) * (a.ab === 'Solar Power' && w === 'sun' ? 1.5 : 1) * paraMul(a, 'spa') * (a.ab === 'Defeatist' && a.hp <= a.max / 2 ? 0.5 : 1) * (dAb === 'Vessel of Ruin' ? 0.75 : 1);
  const SD = d.spd * stageMul(ud ? 0 : d.st.spd) * (w === 'sand' && d.types.includes('Rock') ? 1.5 : 1) * paraMul(d, 'spd') * (a.ab === 'Beads of Ruin' ? 0.75 : 1) * fg(d);
  return SA / SD;
}
// everything about the attacker and the move that scales its power (same type, abilities, items, weather, the move's own conditions)
function movePower(a, mv, d, w) {
  let p = mv.pw;
  // Missingno's glitch type counts every move it uses as its own
  if (a.types.includes(mv.type) || a.ab === 'Protean' || a.types.includes('Bird')) p *= a.ab === 'Adaptability' ? 2 : STAB;
  p *= weatherMul(w, mv.type);
  if (a.item && ITEMS[a.item] && ITEMS[a.item].type === mv.type) p *= 1.1;
  if (a.item === 'lifeorb') p *= 1.25;
  if (a.flashFire && mv.type === 'Fire') p *= 1.5;
  if (mv.eff === 'hex' && d && d.status) p *= 2;
  if (mv.eff === 'facade' && a.status) p *= 2;
  if (mv.eff === 'knock' && d && d.item) p *= 1.5;
  // Fairy Aura / Dark Aura power up that type for both sides; Aura Break turns them around
  if ((AURA[a.ab] === mv.type) || (d && AURA[d.ab] === mv.type)) p *= (a.ab === 'Aura Break' || (d && d.ab === 'Aura Break')) ? 0.75 : 1.33;
  const ab = a.ab;
  if (ab) {
    if (ab === 'Technician' && mv.pw <= 60) p *= 1.5;
    if (ab === 'Sheer Force' && mv.secondary) p *= 1.3;
    if (ab === 'Tough Claws' && contactOf(a, mv)) p *= 1.3;
    if (ab === 'Iron Fist' && mv.flags.includes('p')) p *= 1.2;
    if (ab === 'Strong Jaw' && mv.flags.includes('b')) p *= 1.5;
    if (ab === 'Mega Launcher' && mv.flags.includes('u')) p *= 1.5;
    if (ab === 'Reckless' && /^recoil/.test(mv.eff)) p *= 1.2;
    if (mv.ate) p *= 1.2;
    if ((ab === 'Steelworker' && mv.type === 'Steel') || (ab === "Dragon's Maw" && mv.type === 'Dragon')) p *= 1.5;
    if (ab === 'Transistor' && mv.type === 'Electric') p *= 1.3;
    if (ab === 'Punk Rock' && mv.flags.includes('s')) p *= 1.3;
    if (ab === 'Sharpness' && mv.flags.includes('x')) p *= 1.5;
    if (PINCH[ab] === mv.type && a.hp <= a.max / 3) p *= 1.5;
    if (ab === 'Sand Force' && w === 'sand' && ['Rock', 'Ground', 'Steel'].includes(mv.type)) p *= 1.3;
  }
  return p;
}
const squeezeAcc = acc => 1 - (1 - acc / 100) * 0.5; // anime battles: moves rarely miss
// expected damage of a move as a fraction of the target's HP (for choosing moves and send-outs)
function estimate(a, mv, d, w) {
  mv = asUsed(a, mv);
  const dAb = BREAKERS.includes(a.ab) ? null : d.ab;
  if (blocksMove(dAb, mv) || (dAb === 'Good as Gold' && mv.utility)) return 0;
  if (dAb === 'Wonder Guard' && moveEff(a, mv.type, d.types, dAb) < 2) return 0;
  let e = moveEff(a, mv.type, d.types, dAb); if (e === 0) return 0;
  if (dAb === 'Tera Shell' && d.hp === d.max && e > 0.5) e = 0.5;
  const phys = mv.cat === 'P';
  const dmg = ((2 * a.L / 5 + 2) * movePower(a, mv, d, w) * MOVE_SCALE * statRatio(a, d, phys, w, dAb) / 50 + 2) * e * defendAbMul(d, dAb, { type: mv.type, e, flags: mv.flags, contact: contactOf(a, mv) }, phys)
    * (a.status === 'brn' && phys && a.ab !== 'Guts' && mv.eff !== 'facade' ? 0.5 : 1) * hitsAvg(mv, a.ab);
  return dmg / d.max * (mv.flags.includes('n') ? 1 : squeezeAcc(mv.acc));
}
// how well this Pokémon would do against that one: its best hit, as a share of the target's HP
const moveVal = (a, b, w) => Math.max(0.01, ...(a.moves || []).map(mv => estimate(a, mv, b, w)));
const statusImmune = (d, st, w) => d.status || (st === 'par' && (d.types.includes('Electric') || d.ab === 'Limber')) || (st === 'brn' && (d.types.includes('Fire') || d.ab === 'Water Veil'))
  || ((st === 'psn' || st === 'tox') && (d.types.includes('Poison') || d.types.includes('Steel') || d.ab === 'Immunity')) || (st === 'slp' && ['Insomnia', 'Vital Spirit', 'Sweet Veil'].includes(d.ab))
  || (d.ab === 'Leaf Guard' && w === 'sun') || d.ab === 'Comatose' || (d.ab === 'Shields Down' && d.hp > d.max / 2);
// the defender's ability (already null if the attacker breaks through it)
function defendAbMul(d, dAb, mv, phys) {
  let m = 1;
  if (d.ab === 'Shadow Shield' && d.hp === d.max) m *= 0.5;
  if (d.ab === 'Prism Armor' && mv.e >= 2) m *= 0.75;
  if (!dAb) return m;
  if (dAb === 'Heavy Metal' && phys) m *= 0.8;
  if (dAb === 'Multiscale' && d.hp === d.max) m *= 0.5;
  if (dAb === 'Thick Fat' && (mv.type === 'Fire' || mv.type === 'Ice')) m *= 0.5;
  if (dAb === 'Heatproof' && mv.type === 'Fire') m *= 0.5;
  if (dAb === 'Dry Skin' && mv.type === 'Fire') m *= 1.25;
  if ((dAb === 'Filter' || dAb === 'Solid Rock') && mv.e >= 2) m *= 0.75;
  if (dAb === 'Fur Coat' && phys) m *= 0.5;
  if (dAb === 'Ice Scales' && !phys) m *= 0.5;
  if (dAb === 'Fluffy') { if (mv.contact) m *= 0.5; if (mv.type === 'Fire') m *= 2; }
  if (dAb === 'Punk Rock' && mv.flags && mv.flags.includes('s')) m *= 0.5;
  return m;
}
// ---- send-out order ----
// Each trainer has a lead style. Rotators spread battles around (less-used Pokémon first), ace-leaders open with their strongest,
// and unpredictable trainers pick at random. Gym Leaders, the Elite Four and the Champion save their ace for last.
const LEAD_STYLES = { rotate: 'Rotates the team, giving less-used Pokémon a turn', ace: 'Leads with their strongest Pokémon', random: 'Unpredictable send-out order', acelast: 'Saves their ace for last' };
function leadStyle(t) {
  if (['leader', 'e4', 'champion'].includes(t.role)) return 'acelast';
  if (!t.leadStyle) { const r = rand(); t.leadStyle = r < 0.5 ? 'rotate' : r < 0.72 ? 'ace' : 'random'; }
  return t.leadStyle;
}
function styledPick(t, av, mons, opening) {
  const style = leadStyle(t);
  const power = i => mons[i].L * mons[i].base;
  const strongest = av.reduce((a, b) => (power(a) >= power(b) ? a : b));
  if (style === 'ace' && opening) return strongest;
  const w = av.map(i => {
    if (style === 'acelast') return i === strongest && av.length > 1 ? 0.04 : 1;
    if (style === 'rotate') {
      const used = av.map(j => { const m = t.team[j]; return m && m.ss && m.ss.season === S.season ? m.ss.b : 0; });
      const mx = Math.max(...used), mine = used[av.indexOf(i)];
      return 1 + 3 * (mx - mine) / (mx + 1);
    }
    return 1;
  });
  let r = rand() * w.reduce((a, b) => a + b, 0);
  for (let k = 0; k < av.length; k++) { r -= w[k]; if (r <= 0) return av[k]; }
  return av[av.length - 1];
}
// how a trainer's trait changes their strength in this battle
// side 1 is the defending side: the Gym Leader, Elite Four member or Champion being challenged
const SEAT_ROLES = { gym: ['leader'], league: ['e4', 'champion'], title: ['e4', 'champion'] };
// v199: a team "stronger" or "weaker" than another by more than this share of its power
const TRAIT_EDGE = 0.05;
function traitMod(t, foe, stakes, opts = {}, side = 0) {
  const tr = traitOf(t);
  if (tr === 'clutch' && (stakes === 'league' || stakes === 'title')) return 1.04;
  if (tr === 'competitor' && (stakes === 'rival' || isRival(t, foe))) return 1.05;
  if (tr === 'hothead') return 1.02;
  if ((tr === 'underdog' || tr === 'frontrunner') && foe && foe.team && foe.team.length && t.team.length) {
    const mine = teamPower(t), theirs = teamPower(foe);
    if (tr === 'underdog') return theirs > mine * (1 + TRAIT_EDGE) ? 1.05 : 1;
    return mine > theirs * (1 + TRAIT_EDGE) ? 1.04 : theirs > mine * (1 + TRAIT_EDGE) ? 0.97 : 1;
  }
  if (tr === 'comeback') return t.r && trainerRec(t).cl > 0 ? 1.04 : 1;
  if (tr === 'homeTurf') return side === 1 && !opts.world && (SEAT_ROLES[stakes] || []).includes(t.role) ? 1.04 : 1;
  if (tr === 'purist') return t.team.length >= 3 && t.team.every(m => onSpec(t, m.sp)) ? 1.03 : 1;
  if (tr === 'hero') return foe && foe.role === 'villain' ? 1.06 : 1;
  if (tr === 'globetrotter') return opts.world ? 1.05 : 1;
  return 1;
}
function battle(tA, tB, stakes, title, opts = {}) {
  // opts.equal: both teams fight at the same level (the higher side's top level), as in an Elite Four title challenge
  // a number fixes the level outright (the tournament's Flat levels rule)
  const EQ = opts.equal === true ? Math.max(...tA.team.concat(tB.team).map(m => Math.floor(m.lvl))) : (+opts.equal || 0);
  const nerveW = stakes === 'gym' ? 0.07 : 0.18;
  const sides = [tA, tB].map((t, i) => ({
    t, mons: t.team.map(m => battler(EQ ? Object.assign({}, m, { lvl: EQ }) : m)), act: -1, megaUid: megaStakes(stakes) && megaHolder(t) ? megaHolder(t).uid : null, megaUsed: false,
    bondUid: megaStakes(stakes) && bondMon(t) ? bondMon(t).uid : null, bondUsed: false,
    mod: (1 + (t.r.nrv - 50) / 100 * nerveW) * traitMod(t, i ? tA : tB, stakes, opts, i),
    crit: 0.03 + t.r.bnd / 1000,
    endure: t.r.bnd / 100 * 0.18,
    smart: 0.15 + t.r.str / 100 * 0.8,
    dodge: clamp((t.r.str - 50) / 1000, -0.03, 0.05), // a sharp trainer calls the dodge
    rocks: false, spikes: false,
  }));
  // held items; the Mega Stone takes the Mega holder's item slot
  for (const sd of sides) sd.mons.forEach((b, i) => { if ((sd.megaUid != null && sd.t.team[i] && sd.t.team[i].uid === sd.megaUid) || BATTLE_RULE === 'noitems') b.item = null; applyItemStats(b);
    b.sd = sd;
    // Multitype / RKS System: the held type item sets its type
    if ((b.ab === 'Multitype' || b.ab === 'RKS System') && b.item && ITEMS[b.item] && ITEMS[b.item].type) { b.baseTypes = b.types; b.types = [ITEMS[b.item].type]; b.plate = true; } });
  // v197: temperaments. A Calm Pokémon steadies Timid teammates; a Jolly one lifts the team during a win streak
  if (featOn('temper')) sides.forEach((sd, si) => {
    const team = sd.t.team || [], foe = sides[1 - si].t;
    const calm = team.some(m => isTemper(m, 'Calm')), jolly = team.some(m => isTemper(m, 'Jolly')) && ((sd.t.rec && sd.t.rec.cs) || 0) >= 2;
    sd.mons.forEach((b, i) => { const m = team[i]; if (m) b.tmp = temperMul(sd.t, foe, m, stakes, !!EQ, calm) * (jolly ? 1.03 : 1); });
  });
  // a legendary encounter: its single Pokémon has raid-sized HP, and starts with whatever damage earlier attempts left
  if (opts.boss) { const b = sides[1].mons[0]; b.max = Math.round(b.max * opts.boss.hpMul); b.hp = Math.max(1, Math.round(b.max * opts.boss.hpFrac));
    // v177: the challenger's luck on the day swings their damage hard, and how hard the legendary hits back a little
    if (opts.boss.luck) { sides[0].mod *= opts.boss.luck; sides[1].mod /= Math.sqrt(opts.boss.luck); } }
  const ev = [];
  const stats = S.stats;
  // per-Pokémon tallies for this battle, by team index
  const tally = sides.map(sd => sd.mons.map(() => ({ out: false, ko: 0, f: 0, dmg: 0 })));
  // the field: a gym's own weather, else the region's (events, legendaries); weather abilities and moves replace it
  let weather = (featOn('abilities') && stakes === 'gym' ? GYM_WEATHER[tB.specialty] : null) || regionWeather();
  if (weather && featOn('abilities')) ev.push({ k: 'note', s: -1, txt: `${WEATHER_NAME[weather]} ${stakes === 'gym' ? 'fills the gym' : 'covers the region'}.`, cls: 'weather' });
  if (opts.ruleNote) ev.push({ k: 'note', s: -1, txt: opts.ruleNote, cls: 'weather' });
  const note = (si, i, txt, extra = {}) => ev.push(Object.assign({ k: 'note', s: si, i, txt }, extra));
  if (opts.boss && opts.boss.luck) { const x = opts.boss.luck; ev.push({ k: 'note', s: -1, cls: 'stat', txt: `${dn(tA)}'s team is having a ${luckWord(x)} day (damage x${x.toFixed(2)}).` }); }
  // terrain abilities power up the whole team from the start
  sides.forEach((sd, si) => { sd.terrain = {}; sd.mons.forEach((m, i) => { const g = SURGE[m.ab]; if (g && (sd.terrain[g[0]] || 1) < g[1]) { sd.terrain[g[0]] = g[1]; note(si, i, `{0}'s ${m.ab}: ${dn(sd.t)}'s team's ${g[0]} moves are powered up!`, { cls: 'ab' }); } }); });
  const breaks = a => BREAKERS.includes(a.ab);
  const abOf = (d, a) => a && breaks(a) ? null : d.ab; // the defender's ability, unless the attacker ignores it
  const active = si => { const sd = sides[si]; return sd.act >= 0 ? sd.mons[sd.act] : null; };
  const airLocked = () => [0, 1].some(k => { const m = active(k); return m && m.hp > 0 && m.ab === 'Air Lock'; });
  function alive(s) { return s.mons.map((m, i) => i).filter(i => s.mons[i].hp > 0); }
  // stat stages, ±6
  // Simple doubles every change; Contrary turns rises into drops and drops into rises
  function bump(si, i, k, n, why) {
    const m = sides[si].mons[i]; const before = m.st[k]; m.st[k] = clamp(before + n, -6, 6);
    if (m.st[k] === before) return;
    const big = Math.abs(n) > 1;
    note(si, i, `${why ? why + ': ' : ''}{0}'s ${STAT_NAME_B[k]} ${n > 0 ? (big ? 'rose sharply' : 'rose') : (big ? 'fell sharply' : 'fell')}!`, { cls: 'stat' });
  }
  const abN = (m, n) => m.ab === 'Simple' ? n * 2 : n;
  function raise(si, i, k, n, why) {
    const m = sides[si].mons[i]; n = abN(m, n);
    bump(si, i, k, m.ab === 'Contrary' ? -n : n, m.ab === 'Contrary' ? `${why ? why + ', ' : ''}Contrary` : why);
  }
  // a stat lowered (by the opponent, unless self); blocking abilities and Defiant / Competitive answer the opponent's drops
  function lower(si, i, k, n, why, self) {
    const m = sides[si].mons[i];
    if (!self && (m.ab === 'Flower Veil' || (m.types.includes('Grass') && sides[si].mons.some(x => x.hp > 0 && x.ab === 'Flower Veil')))) { note(si, i, `Flower Veil stops {0}'s ${STAT_NAME_B[k]} from dropping.`, { cls: 'ab' }); return; }
    if (!self && ((NO_DROP.includes(m.ab) && (m.ab !== 'Hyper Cutter' || k === 'atk')) || (m.ab === 'Big Pecks' && k === 'def'))) { note(si, i, `{0}'s ${m.ab} stops its ${STAT_NAME_B[k]} from dropping.`, { cls: 'ab' }); return; }
    n = abN(m, n);
    if (m.ab === 'Contrary') { bump(si, i, k, n, `${why}, Contrary`); return; }
    bump(si, i, k, -n, why);
    if (self) return;
    if (m.ab === 'Defiant') raise(si, i, 'atk', 2, 'Defiant');
    if (m.ab === 'Competitive') raise(si, i, 'spa', 2, 'Competitive');
  }
  function inflict(si, i, st, srcSi, srcI) {
    const m = sides[si].mons[i]; if (!m || m.hp <= 0) return false;
    const src = srcSi != null ? sides[srcSi].mons[srcI] : null, psnSt = st === 'psn' || st === 'tox';
    // Corrosion poisons Poison and Steel types too
    if (statusImmune(src && src.ab === 'Corrosion' && psnSt ? Object.assign({}, m, { types: [] }) : m, st, weather)) return false;
    m.status = st === 'tox' ? 'psn' : st; m.tox = st === 'tox' ? 1 : 0;
    if (st === 'slp') m.sleep = (m.ab === 'Early Bird' ? 1 : ri(1, 3)) + (S.legend && S.legend.sp === 'Darkrai' && S.phase === 'season' ? 1 : 0);
    note(si, i, st === 'slp' ? `{0} fell asleep!` : st === 'tox' ? `{0} was badly poisoned!` : `{0} was ${STATUS_NAME[st]}!`, { cls: 'status', st });
    if (src && src.ab === 'Poison Puppeteer' && psnSt) { lower(si, i, 'atk', 1, 'Poison Puppeteer'); lower(si, i, 'spa', 1, 'Poison Puppeteer'); }
    if (m.ab === 'Synchronize' && srcSi != null && st !== 'slp') { note(si, i, `{0}'s Synchronize passes it back!`, { cls: 'ab' }); inflict(srcSi, srcI, st); }
    return true;
  }
  function speedOf(m) {
    let v = m.spe * stageMul(m.st.spe) * (m.status === 'par' ? 0.5 : 1) * (m.pBoost === 'spe' ? 1.5 : 1) * (m.slowStart > 0 ? 0.5 : 1);
    if (m.ab === 'Heavy Metal') v *= 0.9;
    if (m.ab === 'Surge Surfer' && m.sd && m.sd.terrain && m.sd.terrain.Electric) v *= 2;
    if ((m.ab === 'Swift Swim' && weather === 'rain') || (m.ab === 'Chlorophyll' && weather === 'sun') || (m.ab === 'Sand Rush' && weather === 'sand') || (m.ab === 'Slush Rush' && weather === 'snow')) v *= 2;
    return v;
  }
  // v178: HP-based forms (Schooling, Shields Down)
  function formCheck(si, i) {
    const m = sides[si].mons[i]; if (!m || m.hp <= 0) return;
    if (m.ab === 'Schooling') { const solo = m.hp <= m.max / 4; if (solo !== !!m.solo) { formShift(m, 'solo', !solo); m.solo = solo; note(si, i, solo ? `{0}'s school broke up!` : `{0} formed a school!`, { cls: 'ab' }); } }
    if (m.ab === 'Shields Down') { const core = m.hp <= m.max / 2; if (core !== !!m.core) { formShift(m, 'core', !core); m.core = core; note(si, i, core ? `{0}'s shell broke away! Its core is exposed!` : `{0}'s shell reformed!`, { cls: 'ab' }); } }
  }
  // Forecast and Mimicry: the active Pokémon's type follows the weather (or its team's Surge)
  const W_TYPE = { sun: 'Fire', rain: 'Water', snow: 'Ice' }, MIM_TYPE = { sun: 'Fire', rain: 'Water', snow: 'Ice', sand: 'Rock' };
  function syncTypes() {
    for (const si of [0, 1]) {
      const m = active(si); if (!m || m.hp <= 0 || (m.ab !== 'Forecast' && m.ab !== 'Mimicry')) continue;
      const base = m.baseTypes || m.types;
      let want = null;
      if (m.ab === 'Forecast') want = W_TYPE[weather];
      else { const tr = Object.keys(m.sd.terrain || {}); want = tr.length ? tr.sort((a, b) => m.sd.terrain[b] - m.sd.terrain[a])[0] : MIM_TYPE[weather]; }
      const next = want ? [want] : base;
      if (next.join('/') !== m.types.join('/')) { m.baseTypes = base; m.types = next; note(si, sides[si].act, `{0}'s ${m.ab}: it became ${next.join('/')} type!`, { cls: 'ab' }); }
    }
  }
  // Illusion: what the opponent believes it is facing
  const seen = m => m && m.ab === 'Illusion' && m.illusion && !m.illusionBroken && m.illusion.hp > 0 ? m.illusion : m;
  // a Pokémon entering: hazards on its side, weather abilities, Intimidate, Pressure
  function enter(si) {
    const sd = sides[si], m = active(si), o = active(1 - si); if (!m) return;
    const i = sd.act;
    const guardM = m.ab === 'Magic Guard';
    if (sd.rocks && !guardM) { const e = SP.Rock ? 1 : moveEff({}, 'Rock', m.types, null); const dmg = Math.max(1, Math.floor(m.max / 8 * e)); m.hp = Math.max(0, m.hp - dmg); note(si, i, `Pointed stones dug into {0}!`, { hp: m.hp, cls: 'chip' }); }
    if (sd.spikes && !guardM && m.hp > 0 && !m.types.includes('Flying') && m.ab !== 'Levitate') { m.hp = Math.max(0, m.hp - Math.max(1, Math.floor(m.max / 8))); note(si, i, `{0} was hurt by the spikes!`, { hp: m.hp, cls: 'chip' }); }
    if (m.hp <= 0) return;
    const setW = { Drizzle: 'rain', Drought: 'sun', 'Sand Stream': 'sand', 'Snow Warning': 'snow', 'Orichalcum Pulse': 'sun' }[m.ab];
    if (m.ab === 'Pressure') note(si, i, `{0} is exerting its Pressure!`, { cls: 'ab' });
    if (m.ab === 'Glitch' && !m.glitchNoted) { m.glitchNoted = true; note(si, i, `{0}'s Glitch scrambled its stats! Its best stat this battle is ${m.glitchTop === 'hp' ? 'HP' : STAT_NAME_B[m.glitchTop]}.`, { cls: 'ab' }); }
    if (m.plate && !m.plateNoted) { m.plateNoted = true; note(si, i, `{0}'s ${m.ab}: it is ${m.types[0]} type!`, { cls: 'ab' }); }
    if (m.ab === 'Illusion' && !m.illusionBroken) { const hide = sd.mons.filter((x, k) => k !== i && x.hp > 0); m.illusion = hide.length ? hide[hide.length - 1] : null; }
    if (m.ab === 'Download' && o && o.hp > 0) { const k = o.def * stageMul(o.st.def) <= o.spd * stageMul(o.st.spd) ? 'atk' : 'spa'; raise(si, i, k, 1, 'Download'); }
    if (m.ab === 'Air Lock') { if (weather) note(si, i, `{0}'s Air Lock: the weather fades away!`, { cls: 'weather' }); weather = null; }
    if (m.ab === 'Slow Start' && m.slowStart == null) { m.slowStart = 5; note(si, i, `{0} can't get it going!`, { cls: 'ab' }); }
    if ((m.ab === 'Intrepid Sword' || m.ab === 'Dauntless Shield') && !m.swordUsed) { m.swordUsed = true; raise(si, i, m.ab === 'Intrepid Sword' ? 'atk' : 'def', 1, m.ab); }
    if ((m.ab === 'Protosynthesis' || m.ab === 'Quark Drive') && m.hp === m.max && !m.pBoost) { m.pBoost = BEST_STAT(m); note(si, i, `{0}'s ${m.ab}: its ${STAT_NAME_B[m.pBoost]} is heightened!`, { cls: 'ab' }); }
    if (setW && weather !== setW && !airLocked()) { weather = setW; note(si, i, `{0}'s ${m.ab}: ${WEATHER_NAME[setW]}!`, { cls: 'weather' }); }
    if (m.ab === 'Intimidate' && o && o.hp > 0) {
      const oi = sides[1 - si].act;
      note(si, i, `{0}'s Intimidate!`, { cls: 'ab' });
      if (NO_INTIMIDATE.includes(o.ab)) note(1 - si, oi, `{0}'s ${o.ab} keeps it from being Intimidated.`, { cls: 'ab' });
      else { lower(1 - si, oi, 'atk', 1, 'Intimidate'); if (o.ab === 'Rattled') raise(1 - si, oi, 'spe', 1, 'Rattled'); }
    }
    formCheck(si, i); syncTypes();
  }
  const opened = [false, false];
  function choose(si, quiet) {
    const s = sides[si], o = sides[1 - si];
    let av = alive(s); if (!av.length) return false;
    // Wimp Out / Emergency Exit: the Pokémon that just retreated sits this pick out
    if (av.some(i => !s.mons[i].benched)) av = av.filter(i => !s.mons[i].benched);
    s.mons.forEach(m => { m.benched = false; });
    const lead = !opened[si];
    let pickI = av[0];
    const opp0 = o.act >= 0 && o.mons[o.act].hp > 0 ? o.mons[o.act] : null, opp = seen(opp0);
    // Shadow Tag drags out anything; Magnet Pull only Steel types; Run Away can't be dragged out
    const trapPool = !opp0 ? [] : opp0.ab === 'Shadow Tag' ? av.filter(i => s.mons[i].ab !== 'Run Away' && s.mons[i].ab !== 'Shadow Tag')
      : opp0.ab === 'Magnet Pull' ? av.filter(i => s.mons[i].ab !== 'Run Away' && s.mons[i].types.includes('Steel')) : [];
    const tagger = trapPool.length > 0;
    if (tagger) {
      // the trapping side drags out the matchup worst for this side
      let worst = Infinity;
      for (const i of trapPool) { const m = s.mons[i]; const sc = Math.log2(moveVal(m, opp, weather)) - 0.7 * Math.log2(moveVal(opp, m, weather)); if (sc < worst) { worst = sc; pickI = i; } }
    } else if (opp && rand() < s.smart) {
      let best = -99;
      for (const i of av) { const m = s.mons[i]; const sc = Math.log2(moveVal(m, opp, weather)) - 0.7 * Math.log2(moveVal(opp, m, weather)) + m.L * m.base / 2500 + (m.hp / m.max) * 0.3 + rand() * 0.25; if (sc > best) { best = sc; pickI = i; } }
    } else pickI = styledPick(s.t, av, s.mons, !opened[si]);
    s.act = pickI;
    tally[si][pickI].out = true;
    if (!opened[si]) { tally[si][pickI].lead = true; opened[si] = true; }
    const m = s.mons[pickI];
    ev.push({ k: 'send', s: si, i: pickI });
    if (tagger) note(1 - si, o.act, `{0}'s ${opp0.ab} drags out {1}!`, { os: si, oi: pickI, cls: 'ab' });
    if (m.ab === 'Zero to Hero' && !m.zthSet) { m.zthSet = true; if (lead) { formShift(m, 'zero'); m.zero = true; note(si, pickI, `{0} starts out in its Zero Form.`, { cls: 'ab' }); } else note(si, pickI, `{0} arrives as the Hero!`, { cls: 'ab' }); }
    if (s.charge) { m.charged = true; note(si, pickI, `{0} is charged up by ${s.charge}!`, { cls: 'ab' }); s.charge = null; }
    if (s.megaUid != null && !s.megaUsed && s.t.team[pickI] && s.t.team[pickI].uid === s.megaUid) {
      const f = megaFor(s.t, s.t.team[pickI]);
      if (f) { const b0 = bsOf(m.sp); for (const k of ['atk', 'def', 'spa', 'spd', 'spe']) m[k] *= f.bs[k] / b0[k]; m.types = f.types; m.mega = f.name; s.megaUsed = true; tally[si][pickI].mega = true;
        ev.push({ k: 'mega', s: si, i: pickI, to: f.name }); }
    }
    for (const ty of m.types) stats.use[ty] = (stats.use[ty] || 0) + 1;
    if (!quiet) { enter(si); if (m.hp <= 0) return fallen(si); }
    return true;
  }
  // knocked out (by anything): the side sends in its next Pokémon; false when it has none left
  function fallen(si) {
    const i = sides[si].act;
    ev.push({ k: 'faint', s: si, i }); tally[si][i].f++;
    // shared pain: when a transformed partner falls, the rest of its trainer's team falters
    if (sides[si].mons[i].bond) { sides[si].mod *= BOND_PAIN; ev.push({ k: 'pain', s: si, i }); }
    const fm = sides[si].mons[i];
    if (fm.ab === 'Battery' || fm.ab === 'Power Spot') sides[si].charge = fm.ab;
    for (const k of [0, 1]) { const x = active(k); if (x && x !== fm && x.hp > 0 && x.ab === 'Soul-Heart') raise(k, sides[k].act, 'spa', 1, 'Soul-Heart'); }
    return choose(si);
  }
  // which move to use: the best expected hit, with utility moves when they make sense, and a little noise for less sharp trainers
  function pickAction(si) {
    const s = sides[si], a = active(si), d = seen(active(1 - si));
    let opts = a.moves; if (a.lock) opts = opts.filter(x => x.name === a.lock);
    if (a.disabled) { const free = opts.filter(x => x.name !== a.disabled.name); if (free.length) opts = free; }
    const dmgOf = mv => estimate(a, mv, d, weather);
    const bestHit = Math.max(0.01, ...opts.filter(x => !x.utility).map(dmgOf));
    const threat = moveVal(d, a, weather) * d.max / a.max; // their best hit on us, as a share of our HP
    const val = mv => {
      const v = dmgOf(mv) * (mv.flags.includes('r') ? 0.6 : 1); if (!mv.utility) return v;
      const e = mv.eff;
      if (d.ab === 'Magic Bounce' && !breaks(a) && BOUNCES.test(e)) return 0.001;
      if (/^st:/.test(e)) { const st = e.split(':')[1]; return statusImmune(d, st, weather) || moveEff(a, mv.type, d.types, abOf(d, a)) === 0 || d.hp < d.max * 0.5 ? v : bestHit * (threat > bestHit * 1.2 ? 1.25 : 0.85); }
      if (mv.setup) { if (a.usedSetup || (a.ab === 'Contrary' && !/^heal/.test(e))) return -1; return /^heal/.test(e) ? (a.hp <= a.max * 0.45 ? bestHit * 1.3 : v * 0.5) : (a.hp >= a.max * 0.7 && threat < 0.35 ? bestHit * 1.05 : v * 0.5); }
      if (/^hazard/.test(e)) { const k = e.split(':')[1]; const fo = sides[1 - si]; return fo[k] || alive(fo).length < 3 ? v : bestHit * 0.95; }
      if (/^weather/.test(e)) { const w = e.split(':')[1]; return weather === w || !a.types.some(ty => weatherMul(w, ty) > 1) ? v : bestHit * 1.0; }
      if (e === 'protect') return a.guard || a.hp > a.max * 0.25 ? v * 0.3 : bestHit * (rand() < 0.3 ? 1.2 : 0.3);
      if (e === 'seed') return d.seeded || d.types.includes('Grass') ? v : bestHit * 0.8;
      return v;
    };
    const noise = 0.3 * (1 - s.smart);
    let best = null, bv = -Infinity;
    for (const mv of opts) { const v = val(mv) * (1 + rand() * noise); if (v > bv) { bv = v; best = mv; } }
    return best || opts[0];
  }
  // one Pokémon using one move on the other
  function useMove(si, mv, first) {
    const s = sides[si], o = sides[1 - si];
    const atk = s.mons[s.act], def = o.mons[o.act], ai = s.act, di = o.act;
    const slot = mv;
    if (mv.glitch) { mv = glitchMove(); note(si, ai, `{0}'s ?????? glitched into ${mv.name}!`, { cls: 'ab' }); }
    mv = asUsed(atk, mv);
    const contact = contactOf(atk, mv);
    // Protean: the user turns into the move's type; Stance Change: attacking means Blade Forme, Protect means Shield Forme
    if (atk.ab === 'Protean' && atk.types.join() !== mv.type) { atk.baseTypes = atk.baseTypes || atk.types; atk.types = [mv.type]; note(si, ai, `{0}'s Protean: it became ${mv.type} type!`, { cls: 'ab' }); }
    if (atk.ab === 'Stance Change' && (mv.eff === 'protect' ? atk.blade : !mv.utility && !atk.blade)) {
      [atk.atk, atk.def] = [atk.def, atk.atk]; [atk.spa, atk.spd] = [atk.spd, atk.spa]; atk.blade = !atk.blade;
      note(si, ai, atk.blade ? `{0} changed to Blade Forme!` : `{0} changed to Shield Forme!`, { cls: 'ab' });
    }
    const dAb = atk.ab === 'Mycelium Might' && mv.utility ? null : abOf(def, atk), phys = mv.cat === 'P', sure = mv.flags.includes('n') || atk.ab === 'No Guard' || def.ab === 'No Guard';
    if ((atk.choice || atk.ab === 'Gorilla Tactics') && !atk.lock) atk.lock = slot.name;
    // accuracy and dodging
    let acc = squeezeAcc(mv.acc);
    if (atk.ab === 'Hustle' && phys) acc *= 0.8;
    if (((dAb === 'Sand Veil' && weather === 'sand') || (dAb === 'Snow Cloak' && weather === 'snow')) && atk.ab !== 'Keen Eye' && atk.ab !== "Mind's Eye") acc *= 0.8;
    if (atk.ab === 'Compound Eyes') acc = Math.min(1, acc * 1.3);
    if (s.mons.some(x => x.hp > 0 && x.ab === 'Victory Star')) acc = Math.min(1, acc * 1.1);
    const guarded = def.guard; def.guard = false;
    if (guarded && !sure && !(atk.ab === 'Unseen Fist' && contact) && atk.ab !== 'Infiltrator') acc *= 0.25;
    if (!sure && rand() > acc) { atk.streak = 0; ev.push({ k: 'miss', s: si, i: ai, ti: di, mn: mv.name, guard: guarded }); return; }
    if (!sure && !mv.utility) {
      const dodge = Math.max(0, clamp((speedOf(def) / speedOf(atk) - 1) * 0.1, 0, 0.12) + o.dodge);
      if (rand() < dodge) { atk.streak = 0; ev.push({ k: 'dodge', s: si, i: ai, ti: di, mn: mv.name }); return; }
    }
    // Magic Bounce: utility moves aimed at it come straight back at the user
    if (dAb === 'Magic Bounce' && mv.utility && BOUNCES.test(mv.eff)) {
      ev.push({ k: 'use', s: si, i: ai, mn: mv.name }); atk.streak = 0;
      note(1 - si, di, `{0}'s Magic Bounce sends ${mv.name} back!`, { cls: 'ab' });
      const [kind, x, y] = mv.eff.split(':');
      if (kind === 'st' && rand() * 100 < +y) { if (!inflict(si, ai, x, 1 - si, di)) note(si, ai, `It had no effect on {0}.`, { cls: 'miss' }); }
      if (kind === 'seed' && !atk.seeded && !atk.types.includes('Grass')) { atk.seeded = 1 - si; note(si, ai, `{0} was seeded!`, { cls: 'status' }); }
      if (kind === 'foe' && rand() * 100 < +y) { const [k, n] = x.split('-'); lower(si, ai, k, +n, mv.name); }
      if (kind === 'hazard' && !s[x]) { s[x] = true; note(si, ai, x === 'rocks' ? `Pointed stones float around {0}'s side!` : `Spikes were scattered on {0}'s side!`, { cls: 'ab' }); }
      return;
    }
    // type-absorbing abilities
    const absorb = ABSORB[dAb];
    if (absorb && absorb.ty === mv.type) {
      ev.push({ k: 'use', s: si, i: ai, mn: mv.name });
      note(1 - si, di, `{0}'s ${dAb} takes the ${mv.type}-type hit!`, { cls: 'ab' });
      if (absorb.heal && def.hp < def.max) { def.hp = Math.min(def.max, def.hp + Math.round(def.max / 4)); note(1 - si, di, `{0} restored HP.`, { hp: def.hp, cls: 'heal' }); }
      if (absorb.stat) raise(1 - si, di, absorb.stat, 1, dAb);
      if (absorb.ff) { def.flashFire = true; note(1 - si, di, `{0}'s Fire moves are powered up!`, { cls: 'ab' }); }
      atk.streak = 0; return;
    }
    if (blocksMove(dAb, mv)) { ev.push({ k: 'use', s: si, i: ai, mn: mv.name }); note(1 - si, di, `{0}'s ${dAb} blocks ${mv.name}!`, { cls: 'ab' }); atk.streak = 0; return; }
    // effects on the user's own side (boosts, heals, Protect, hazards, weather) happen even when the light hit can't touch the target
    const fx0 = mv.eff;
    function selfFx() {
      const fx = fx0;
      if (mv.setup && !atk.usedSetup) {
        atk.usedSetup = true;
        const [kind, list] = fx.split(':');
        const up = kind === 'boost' ? [list] : kind === 'boost2' ? list.split(',') : kind === 'dance' ? [pick(list.split(','))] : [];
        for (const k of up) raise(si, ai, k, 1, mv.name);
        if (up.length && def.hp > 0 && def.ab === 'Dancer') for (const k of up) raise(1 - si, di, k, 1, 'Dancer');
        if (kind === 'heal' && atk.hp < atk.max) { atk.hp = Math.min(atk.max, atk.hp + Math.round(atk.max / 4)); note(si, ai, `{0} restored its HP!`, { hp: atk.hp, cls: 'heal' }); }
      }
      if (/^hazard/.test(fx)) { const k = fx.split(':')[1]; if (!o[k]) { o[k] = true; note(si, ai, k === 'rocks' ? `Pointed stones float around the other side!` : `Spikes were scattered on the other side!`, { cls: 'ab' }); } }
      if (/^weather/.test(fx)) { const w = fx.split(':')[1]; if (weather !== w && !airLocked()) { weather = w; note(si, ai, `${WEATHER_NAME[w]}!`, { cls: 'weather' }); } }
      if (fx === 'protect') { atk.guard = true; note(si, ai, `{0} braced itself!`, { cls: 'ab' }); }
    }
    if (dAb === 'Good as Gold' && mv.utility) { ev.push({ k: 'use', s: si, i: ai, mn: mv.name }); note(1 - si, di, `{0}'s Good as Gold shrugs off ${mv.name}!`, { cls: 'ab' }); atk.streak = 0; selfFx(); return; }
    let e = moveEff(atk, mv.type, def.types, dAb);
    if (dAb === 'Tera Shell' && def.hp === def.max && e > 0.5) { e = 0.5; note(1 - si, di, `{0}'s Tera Shell takes the edge off!`, { cls: 'ab' }); }
    // Wonder Guard: only super-effective hits get through (status moves still land their status)
    if (e > 0 && e < 2 && dAb === 'Wonder Guard') {
      ev.push({ k: 'use', s: si, i: ai, mn: mv.name }); atk.streak = 0;
      const sm = /^st:(\w+):(\d+)/.exec(mv.eff || '');
      if (mv.utility && sm && rand() * 100 < +sm[2]) inflict(1 - si, di, sm[1], si, ai); else note(1 - si, di, `{0}'s Wonder Guard keeps the hit out!`, { cls: 'ab' });
      if (mv.utility) selfFx(); return;
    }
    if (e === 0) { ev.push({ k: 'use', s: si, i: ai, mn: mv.name }); note(1 - si, di, `It doesn't affect {0}…`, { cls: 'miss' }); atk.streak = 0; if (mv.utility) selfFx(); return; }
    // Ice Face: the ice takes the first physical hit, then it fights in its faster, frailer Noice Face
    if (dAb === 'Ice Face' && phys && !def.noice) {
      ev.push({ k: 'use', s: si, i: ai, mn: mv.name }); atk.streak = 0;
      def.noice = true; formShift(def, 'noice'); note(1 - si, di, `{0}'s Ice Face took the hit and shattered!`, { cls: 'ab' });
      if (mv.utility) selfFx(); return;
    }
    const noCrit = dAb === 'Shell Armor' || dAb === 'Battle Armor';
    const crit = !mv.utility && !noCrit && rand() < s.crit + atk.critB + (atk.ab === 'Super Luck' ? 0.06 : 0) + (mv.eff === 'crit' ? 0.1 : 0);
    const burnMul = atk.status === 'brn' && phys && atk.ab !== 'Guts' && mv.eff !== 'facade' ? 0.5 : 1;
    const formMul = dAb === 'Pressure' ? Math.min(1, atk.formMul || 1) : (atk.formMul || 1);
    // anime touches: a solid hit or a glancing blow now and then, and momentum from a run of clean hits
    const r = rand(), feel = mv.utility ? 1 : r < 0.06 ? 1.3 : r < 0.14 ? 0.6 : 1;
    const momentum = atk.streak >= 3 ? 1.1 : atk.streak >= 2 ? 1.05 : 1;
    const expert = atk.item === 'expertbelt' && e >= 2 ? 1.2 : 1;
    let dmg = ((2 * atk.L / 5 + 2) * movePower(atk, mv, def, weather) * MOVE_SCALE * statRatio(atk, def, phys, weather, dAb) / 50 + 2) * e
      * (0.85 + rand() * 0.15) * (crit ? (atk.ab === 'Sniper' ? 2.25 : 1.5) : 1) * s.mod * legendChaos() * stormMul(mv.type, phys) * expert * defendAbMul(def, dAb, { type: mv.type, e, flags: mv.flags, contact }, phys) * (atk.ab === 'Analytic' && !first ? 1.3 : 1) * burnMul * formMul * (atk.tmp || 1) * feel * momentum * (s.terrain[mv.type] || 1) * (atk.charged ? 1.3 : 1);
    dmg = Math.max(1, Math.round(dmg));
    // multi-hit: each hit does the same damage; the hits together get past a Focus Sash or Sturdy
    const hits = rollHits(mv, atk.ab), per = dmg; dmg = per * hits;
    let endured = false, sash = false, sturdy = false, busted = false;
    if (dAb === 'Disguise' && !def.busted) { def.busted = busted = true; dmg = Math.min(per, Math.max(1, Math.floor(def.max / 8))) + per * (hits - 1); }
    if (hits === 1 && dmg >= def.hp && def.hp === def.max && def.item === 'focussash' && !def.sashUsed) { dmg = def.hp - 1; def.sashUsed = true; sash = true; }
    else if (hits === 1 && dmg >= def.hp && def.hp === def.max && dAb === 'Sturdy') { dmg = def.hp - 1; sturdy = true; }
    else if (dmg >= def.hp && def.hp === def.max && !def.endured && rand() < o.endure + def.endB) { dmg = def.hp - 1; def.endured = true; endured = true; }
    const dealt = Math.min(dmg, def.hp);
    tally[si][ai].dmg += dealt;
    def.hp = Math.max(0, def.hp - dmg);
    atk.streak = (atk.streak || 0) + 1;
    ev.push({ k: 'hit', s: si, i: ai, ti: di, dmg, hp: def.hp, mult: e, crit, mt: mv.type, mn: mv.name, feel: feel > 1 ? 'solid' : feel < 1 ? 'glance' : null, mo: momentum > 1 });
    if (hits > 1) note(1 - si, di, `Hit ${hits} times!`, { cls: 'chip' });
    if (endured) ev.push({ k: 'endure', s: 1 - si, i: di });
    if (sash) ev.push({ k: 'item', s: 1 - si, i: di, it: 'focussash' });
    if (sturdy) note(1 - si, di, `Sturdy! {0} hung on!`, { cls: 'ab' });
    if (busted) note(1 - si, di, `{0}'s disguise was busted!`, { cls: 'ab' });
    if (def.ab === 'Illusion' && def.illusion && !def.illusionBroken && dealt > 0) { def.illusionBroken = true; note(1 - si, di, `{0}'s Illusion wore off! It was {0} all along!`, { cls: 'ab' }); }
    if (crit && def.hp > 0 && dAb === 'Anger Point' && def.st.atk < 6) { def.st.atk = 6; note(1 - si, di, `{0}'s Anger Point maxed its Attack!`, { cls: 'stat' }); }
    // the move's own effects
    const veil = s.mons.some(x => x.hp > 0 && x.ab === 'Aroma Veil');
    if (dAb === 'Cursed Body' && veil && atk.hp > 0 && dealt > 0 && rand() < 0.3) note(si, ai, `Aroma Veil keeps {0}'s ${mv.name} from being disabled!`, { cls: 'ab' });
    else if (dAb === 'Cursed Body' && atk.hp > 0 && dealt > 0 && !(atk.disabled && atk.disabled.name === mv.name) && rand() < 0.3) { atk.disabled = { name: mv.name, turns: 3 }; note(si, ai, `{1}'s Cursed Body disabled {0}'s ${mv.name}!`, { os: 1 - si, oi: di, cls: 'ab' }); }
    // Serene Grace doubles the odds of added effects; Shield Dust blocks them (not status moves)
    const fx = mv.eff, sheer = atk.ab === 'Sheer Force' && mv.secondary, sg = atk.ab === 'Serene Grace' ? 2 : 1, shielded = dAb === 'Shield Dust' && !mv.utility;
    const flinch = () => { if (dAb === 'Inner Focus') note(1 - si, di, `{0}'s Inner Focus keeps it from flinching.`, { cls: 'ab' }); else def.flinch = true; };
    if (fx && !sheer && !shielded) {
      const [kind, x, y] = fx.split(':');
      if (kind === 'st' && def.hp > 0 && rand() * 100 < +y * sg) inflict(1 - si, di, x, si, ai);
      if (kind === 'fl' && def.hp > 0 && first && rand() * 100 < +x * sg) flinch();
      if (kind === 'foe' && def.hp > 0 && rand() * 100 < +y * sg) { const [k, n] = x.split('-'); lower(1 - si, di, k, +n, mv.name); }
    }
    if (atk.ab === 'Bad Dreams' && mv.type === 'Dark' && !mv.utility && !shielded && def.hp > 0 && !def.status && rand() < 0.1 * sg) { note(si, ai, `{0}'s Bad Dreams!`, { cls: 'ab' }); inflict(1 - si, di, 'slp', si, ai); }
    if (atk.ab === 'Stench' && !shielded && !mv.utility && def.hp > 0 && first && !def.flinch && !/^fl:/.test(fx || '') && rand() < 0.1 * sg) flinch();
    if (fx === 'knock' && def.item && dAb === 'Sticky Hold') note(1 - si, di, `{0}'s Sticky Hold keeps its ${itemName(def.item)}!`, { cls: 'ab' });
    else if (fx === 'knock' && def.item) { note(1 - si, di, `{0}'s ${itemName(def.item)} was knocked away!`, { cls: 'ab' }); def.item = null; def.choice = false; def.lock = null; }
    if (atk.ab === 'Magician' && atk.hp > 0 && !atk.item && def.item && dealt > 0 && dAb !== 'Sticky Hold') {
      const k = def.item; itemStatFx(def, k, -1); def.item = null; atk.item = k; itemStatFx(atk, k, 1);
      note(si, ai, `{0}'s Magician stole {1}'s ${itemName(k)}!`, { os: 1 - si, oi: di, cls: 'ab' });
    }
    if (/^drain/.test(fx) && atk.hp > 0 && dAb === 'Liquid Ooze') { if (atk.ab !== 'Magic Guard') { atk.hp = Math.max(0, atk.hp - Math.max(1, Math.round(dealt * (+fx.split(':')[1]) / 100))); note(si, ai, `{0} sucked up {1}'s Liquid Ooze!`, { os: 1 - si, oi: di, hp: atk.hp, cls: 'chip' }); } }
    else if (/^drain/.test(fx) && atk.hp > 0 && atk.hp < atk.max) { atk.hp = Math.min(atk.max, atk.hp + Math.max(1, Math.round(dealt * (+fx.split(':')[1]) / 100))); note(si, ai, `{0} drained energy!`, { hp: atk.hp, cls: 'heal' }); }
    if (/^recoil/.test(fx) && atk.hp > 0 && atk.ab !== 'Rock Head' && atk.ab !== 'Magic Guard') { atk.hp = Math.max(0, atk.hp - Math.max(1, Math.round(dealt * (+fx.split(':')[1]) / 100))); note(si, ai, `{0} is hit with recoil!`, { hp: atk.hp, cls: 'chip' }); }
    if (/^self/.test(fx)) for (const part of fx.split(':')[1].split(',')) { const [k, n] = part.split('-'); lower(si, ai, k, +n, mv.name, true); }
    // a raise on the user when the attack lands (Sheer Force trades it for power; Shield Dust can't stop it)
    if (/^up:/.test(fx) && !sheer && atk.hp > 0 && dealt > 0) { const [, list, pct] = fx.split(':'); if (rand() * 100 < +pct * sg) for (const part of list.split(',')) { const [k, n] = part.split('+'); raise(si, ai, k, +n, mv.name); } }
    selfFx();
    if (atk.ab === 'Gulp Missile' && mv.type === 'Water' && !atk.gulp && atk.hp > 0) { atk.gulp = atk.hp > atk.max / 2 ? 'Arrokuda' : 'Pikachu'; note(si, ai, `{0} caught a ${atk.gulp}!`, { cls: 'ab' }); }
    if (fx === 'seed' && def.hp > 0 && !def.seeded && !def.types.includes('Grass')) { def.seeded = si; note(1 - si, di, `{0} was seeded!`, { cls: 'status' }); }
    if (mv.flags.includes('r')) atk.recharge = true;
    // the defender reacts to being hit
    if (def.hp > 0) {
      if (dAb === 'Weak Armor' && phys) { lower(1 - si, di, 'def', 1, 'Weak Armor'); raise(1 - si, di, 'spe', 2, 'Weak Armor'); }
      if (dAb === 'Justified' && mv.type === 'Dark') raise(1 - si, di, 'atk', 1, 'Justified');
      if (dAb === 'Rattled' && ['Bug', 'Dark', 'Ghost'].includes(mv.type)) raise(1 - si, di, 'spe', 1, 'Rattled');
      if (dAb === 'Berserk' && def.hp <= def.max / 2 && def.hp + dealt > def.max / 2) raise(1 - si, di, 'spa', 1, 'Berserk');
      if (def.item === 'sitrus' && !def.berryUsed && def.hp <= def.max / 2) {
        if (atk.ab === 'Unnerve') { if (!def.unnerved) { def.unnerved = true; note(si, ai, `{0}'s Unnerve keeps {1} from eating its berry!`, { os: 1 - si, oi: di, cls: 'ab' }); } }
        else { def.berryUsed = !(def.ab === 'Gluttony' && !def.glut); if (def.ab === 'Gluttony') def.glut = true; def.hp = Math.min(def.max, def.hp + Math.round(def.max / 4)); ev.push({ k: 'item', s: 1 - si, i: di, it: 'sitrus', hp: def.hp }); }
      }
      formCheck(1 - si, di);
    }
    // Gulp Missile: whoever hits it gets the catch spat at them
    if (def.gulp && dealt > 0 && atk.hp > 0) {
      const prey = def.gulp; def.gulp = null;
      note(1 - si, di, `{0} spat out its ${prey}!`, { cls: 'ab' });
      if (atk.ab !== 'Magic Guard') { atk.hp = Math.max(0, atk.hp - Math.ceil(atk.max / 4)); note(si, ai, `{0} was hit by the ${prey}!`, { hp: atk.hp, cls: 'chip' }); }
      if (atk.hp > 0) { if (prey === 'Arrokuda') lower(si, ai, 'def', 1, 'Gulp Missile'); else inflict(si, ai, 'par', 1 - si, di); }
    }
    // contact abilities hurt or afflict the attacker
    if (contact && dAb) {
      if ((dAb === 'Gooey' || dAb === 'Tangling Hair') && atk.hp > 0) lower(si, ai, 'spe', 1, dAb);
      if ((dAb === 'Rough Skin' || dAb === 'Iron Barbs') && atk.hp > 0 && atk.ab !== 'Magic Guard') { atk.hp = Math.max(0, atk.hp - Math.ceil(atk.max / 8)); note(si, ai, `{0} was hurt by {1}'s ${dAb}!`, { os: 1 - si, oi: di, hp: atk.hp, cls: 'ab' }); }
      const st = { Static: 'par', 'Flame Body': 'brn', 'Poison Point': 'psn' }[dAb];
      if (st && atk.hp > 0 && !atk.status && rand() < 0.3) { note(1 - si, di, `{0}'s ${dAb}!`, { cls: 'ab' }); inflict(si, ai, st, 1 - si, di); }
      if (dAb === 'Cute Charm' && atk.hp > 0 && !atk.charm && rand() < 0.3) {
        if (atk.ab === 'Oblivious') note(si, ai, `{0}'s Oblivious keeps it from being charmed.`, { cls: 'ab' });
        else { atk.charm = 3; note(1 - si, di, `{0}'s Cute Charm! {1} is smitten!`, { os: si, oi: ai, cls: 'status' }); }
      }
      if (dAb === 'Mummy' && atk.hp > 0 && atk.ab && atk.ab !== 'Mummy' && !UNSWAP.includes(atk.ab)) { note(si, ai, `{0}'s ${atk.ab} became Mummy!`, { cls: 'ab' }); atk.ab = 'Mummy'; }
      if (dAb === 'Wandering Spirit' && atk.hp > 0 && atk.ab && atk.ab !== 'Wandering Spirit' && !UNSWAP.includes(atk.ab)) {
        note(1 - si, di, `{0} swapped abilities with {1}: it now has ${atk.ab}!`, { os: si, oi: ai, cls: 'ab' }); def.ab = atk.ab; atk.ab = 'Wandering Spirit';
      }
    }
    if (contact && atk.ab === 'Poison Touch' && def.hp > 0 && !def.status && dAb !== 'Shield Dust' && rand() < 0.3) { note(si, ai, `{0}'s Poison Touch!`, { cls: 'ab' }); inflict(1 - si, di, 'psn', si, ai); }
    if (atk.ab === 'Toxic Chain' && !mv.utility && dealt > 0 && def.hp > 0 && !def.status && dAb !== 'Shield Dust' && rand() < 0.3) { note(si, ai, `{0}'s Toxic Chain!`, { cls: 'ab' }); inflict(1 - si, di, 'tox', si, ai); }
    // Life Orb recoil, after the hit lands
    if (atk.item === 'lifeorb' && atk.hp > 0 && atk.ab !== 'Magic Guard') { atk.hp = Math.max(0, atk.hp - Math.ceil(atk.max / 10)); ev.push({ k: 'item', s: si, i: ai, it: 'lifeorb', hp: atk.hp }); }
    if (def.hp > 0 && (def.ab === 'Wimp Out' || def.ab === 'Emergency Exit') && !def.retreated && dealt > 0 && def.hp <= def.max / 2 && def.hp + dealt > def.max / 2 && alive(o).length > 1) {
      def.retreated = true; def.benched = true; def.flinch = false;
      note(1 - si, di, `{0}'s ${def.ab}: it retreats to safety!`, { cls: 'ab' });
      choose(1 - si);
    }
    if (def.hp <= 0) {
      tally[si][ai].ko++;
      for (const ty of atk.types) stats.ko[ty] = (stats.ko[ty] || 0) + 1;
      // Battle Bond: a bonded partner's first knockout transforms it; a Mega-Evolved Pokémon can't also bond
      if (s.bondUid != null && !s.bondUsed && !atk.mega && s.t.team[ai] && s.t.team[ai].uid === s.bondUid) {
        atk.atk *= BOND_ATK; atk.spa *= BOND_ATK; atk.spe *= BOND_SPE; atk.bond = bondName(s.t, s.t.team[ai]); s.bondUsed = true; tally[si][ai].bond = true;
        ev.push({ k: 'bond', s: si, i: ai, to: atk.bond });
      }
      if ((atk.ab === 'Moxie' || atk.ab === 'Chilling Neigh') && atk.hp > 0) raise(si, ai, 'atk', 1, atk.ab);
      if (atk.ab === 'Grim Neigh' && atk.hp > 0) raise(si, ai, 'spa', 1, 'Grim Neigh');
      if (atk.ab === 'Zero to Hero' && atk.zero && atk.hp > 0) { formShift(atk, 'zero', true); atk.zero = false; note(si, ai, `{0} became the Hero!`, { cls: 'ab' }); }
      if (atk.ab === 'Beast Boost' && atk.hp > 0) raise(si, ai, BEST_STAT(atk), 1, 'Beast Boost');
      if (atk.ab === 'Regenerator' && atk.hp > 0 && atk.hp < atk.max) { atk.hp = Math.min(atk.max, atk.hp + Math.round(atk.max / 3)); note(si, ai, `{0}'s Regenerator restored HP!`, { hp: atk.hp, cls: 'heal' }); }
      if (atk.ab === 'Natural Cure' && atk.hp > 0 && atk.status) { atk.status = null; note(si, ai, `{0}'s Natural Cure healed its status!`, { cls: 'ab' }); }
      if (contact && dAb === 'Aftermath' && atk.hp > 0 && atk.ab !== 'Magic Guard') { atk.hp = Math.max(0, atk.hp - Math.ceil(atk.max / 4)); note(si, ai, `{0} was hurt by {1}'s Aftermath!`, { os: 1 - si, oi: di, hp: atk.hp, cls: 'ab' }); }
    }
  }
  // can this Pokémon act this turn? (recharge, flinch, sleep, paralysis, Hyper Mode)
  function canAct(si) {
    const s = sides[si], m = active(si), i = s.act;
    if (m.ab === 'Truant') { m.loaf = !m.loaf; if (!m.loaf) { note(si, i, `{0} is loafing around!`, { cls: 'status' }); return false; } }
    if (m.recharge) { m.recharge = false; note(si, i, `{0} must recharge!`, { cls: 'status' }); return false; }
    if (m.flinch) { m.flinch = false; note(si, i, `{0} flinched!`, { cls: 'status' }); if (m.ab === 'Steadfast') raise(si, i, 'spe', 1, 'Steadfast'); return false; }
    if (m.status === 'slp') { if (--m.sleep > 0) { note(si, i, `{0} is fast asleep.`, { cls: 'status' }); return false; } m.status = null; note(si, i, `{0} woke up!`, { cls: 'status' }); }
    if (m.charm > 0) { m.charm--; if (rand() < 0.5) { note(si, i, `{0} is too smitten to attack!`, { cls: 'status' }); return false; } }
    if (m.status === 'par' && rand() < 0.25) { note(si, i, `{0} is paralyzed! It can't move!`, { cls: 'status' }); return false; }
    if (m.shadow && rand() < HYPER_CHANCE) { ev.push({ k: 'hyper', s: si, i }); return false; }
    return true;
  }
  // leader leads first so the challenger can scout a counter; then both leads' entry abilities
  choose(1, true); choose(0, true);
  enter(1); enter(0);
  let guard = 0, winner = -1;
  if (active(1).hp <= 0 && !fallen(1)) winner = 0;
  if (winner < 0 && active(0).hp <= 0 && !fallen(0)) winner = 1;
  let stall = 0; // turns in a row where nobody lost HP (Wonder Guard, immunities): the battle goes to the judges
  while (winner < 0 && guard++ < 400) {
    const hpNow = () => sides.reduce((a, sd) => a + sd.mons.reduce((b, m) => b + m.hp, 0), 0), hp0 = hpNow();
    // both sides pick a move, then priority moves go first, then the faster Pokémon
    syncTypes();
    const plan = [0, 1].map(si => ({ si, who: sides[si].act, mv: pickAction(si) }));
    const prio = p => { const m = active(p.si), mv = p.mv;
      if (mv.flags.includes('k')) return 1;
      if (m.ab === 'Mycelium Might' && mv.utility) return -1;
      if (m.ab === 'Prankster' && mv.utility && !m.prankUsed) return 1; // once per battle
      if (m.ab === 'Triage' && /^(heal|drain)/.test(mv.eff)) return 1;
      if (m.ab === 'Gale Wings' && mv.type === 'Flying' && m.hp === m.max) return 1;
      return 0; };
    // Trick Room (a tournament rule): the slower Pokémon moves first; a Quick Claw still jumps the queue
    const spd = si => { const m = active(si), v = m.L + speedOf(m) / 4; return (BATTLE_RULE === 'trickroom' ? -v : v) + rand() * 12 + (m.item === 'quickclaw' && rand() < 0.2 ? 1000 : 0); };
    const sp0 = spd(0), sp1 = spd(1);
    const order = prio(plan[0]) !== prio(plan[1]) ? (prio(plan[0]) > prio(plan[1]) ? [0, 1] : [1, 0]) : sp0 >= sp1 ? [0, 1] : [1, 0];
    for (let n = 0; n < 2; n++) {
      const si = order[n], s = sides[si], o = sides[1 - si];
      const atk = active(si), def = active(1 - si);
      if (!atk || !def || atk.hp <= 0 || def.hp <= 0) continue;
      if (s.act !== plan[si].who) continue; // it fell and was replaced this turn: the newcomer waits
      if (!canAct(si)) continue;
      if (atk.ab === 'Prankster' && plan[si].mv.utility && !atk.prankUsed) { atk.prankUsed = true; note(si, s.act, `{0}'s Prankster lets it move first!`, { cls: 'ab' }); }
      useMove(si, plan[si].mv, n === 0);
      if (def.hp <= 0) { if (!fallen(1 - si)) { winner = si; break; } }
      if (atk.hp <= 0) { if (!fallen(si)) { winner = 1 - si; break; } }
    }
    if (winner >= 0) break;
    if (hpNow() === hp0) { if (++stall >= 12) break; } else stall = 0;
    // end of the turn: weather, status, Leech Seed, healing, Speed Boost
    for (const si of order) {
      const sd = sides[si], m = active(si); if (!m || m.hp <= 0) continue;
      m.flinch = false;
      const i = sd.act, hurt = (frac, txt) => { if (m.ab === 'Magic Guard') return; m.hp = Math.max(0, m.hp - Math.max(1, Math.floor(m.max * frac))); note(si, i, txt, { hp: m.hp, cls: 'chip' }); };
      const heal = (frac, txt) => { if (m.hp < m.max) { m.hp = Math.min(m.max, m.hp + Math.max(1, Math.floor(m.max * frac))); note(si, i, txt, { hp: m.hp, cls: 'heal' }); } };
      if (weather === 'sand' && !m.types.some(t => ['Rock', 'Ground', 'Steel'].includes(t)) && !['Sand Force', 'Sand Veil', 'Sand Rush', 'Overcoat'].includes(m.ab) && featOn('abilities')) hurt(1 / 16, `{0} is buffeted by the sandstorm.`);
      if (m.hp > 0 && weather === 'rain' && m.ab === 'Rain Dish') heal(1 / 16, `{0}'s Rain Dish restored HP.`);
      if (m.hp > 0 && weather === 'rain' && m.ab === 'Dry Skin') heal(1 / 8, `{0}'s Dry Skin soaks up the rain.`);
      if (m.hp > 0 && weather === 'snow' && m.ab === 'Ice Body') heal(1 / 16, `{0}'s Ice Body restored HP.`);
      if (m.hp > 0 && weather === 'sun' && (m.ab === 'Solar Power' || m.ab === 'Dry Skin')) hurt(1 / 8, `{0} is hurt by the sunlight.`);
      if (m.hp > 0 && m.status) {
        if ((m.ab === 'Hydration' && weather === 'rain') || (m.ab === 'Shed Skin' && rand() < 0.3)) { m.status = null; note(si, i, `{0}'s ${m.ab} cured its status!`, { cls: 'ab' }); }
        else if (m.status === 'brn') hurt(1 / 16, `{0} is hurt by its burn.`);
        else if (m.status === 'psn') { if (m.ab === 'Poison Heal') heal(1 / 8, `{0}'s Poison Heal restored HP.`); else if (m.tox) { hurt(Math.min(15, m.tox) / 16, `{0} is hurt by the toxic poison.`); m.tox++; } else hurt(1 / 8, `{0} is hurt by poison.`); }
      }
      if (m.hp > 0 && m.seeded != null && m.seeded !== false && m.ab !== 'Magic Guard') { const before = m.hp; hurt(1 / 8, `Leech Seed saps {0}!`); const o = active(1 - si); if (o && o.hp > 0 && o.hp < o.max) { o.hp = Math.min(o.max, o.hp + (before - m.hp)); note(1 - si, sides[1 - si].act, `{0} drained some HP.`, { hp: o.hp, cls: 'heal' }); } }
      if (m.hp > 0 && m.hp < m.max && m.item === 'leftovers') { m.hp = Math.min(m.max, m.hp + Math.max(1, Math.floor(m.max / 16))); ev.push({ k: 'item', s: si, i, it: 'leftovers', hp: m.hp }); }
      if (m.hp > 0 && m.ab === 'Speed Boost') raise(si, i, 'spe', 1, 'Speed Boost');
      if (m.hp > 0 && m.ab === 'Harvest' && m.item === 'sitrus' && m.berryUsed && (weather === 'sun' || rand() < 0.5)) { m.berryUsed = false; note(si, i, `{0}'s Harvest grew a new Sitrus Berry!`, { cls: 'ab' }); }
      if (m.hp > 0 && m.ab === 'Ice Face' && m.noice && weather === 'snow') { m.noice = false; formShift(m, 'noice', true); note(si, i, `The snow rebuilt {0}'s Ice Face!`, { cls: 'ab' }); }
      if (m.hp > 0 && m.ab === 'Hunger Switch') m.hangry = !m.hangry;
      if (m.hp > 0) formCheck(si, i);
      { const o = active(1 - si);
        if (m.hp > 0 && m.ab === 'Bad Dreams' && o && o.hp > 0 && o.status === 'slp' && o.ab !== 'Magic Guard') {
          o.hp = Math.max(0, o.hp - Math.max(1, Math.floor(o.max / 8))); note(1 - si, sides[1 - si].act, `{0} is tormented by Bad Dreams!`, { hp: o.hp, cls: 'chip' });
          if (o.hp <= 0 && !fallen(1 - si)) { winner = si; break; }
        } }
      if (m.disabled && --m.disabled.turns <= 0) { note(si, i, `{0}'s ${m.disabled.name} is no longer disabled.`, { cls: 'ab' }); m.disabled = null; }
      if (m.hp > 0 && m.slowStart > 0 && --m.slowStart === 0) note(si, i, `{0} finally got its act together!`, { cls: 'ab' });
      if (m.hp <= 0 && !fallen(si)) { winner = 1 - si; break; }
    }
  }
  if (winner < 0) winner = sides[0].mons.reduce((a, m) => a + m.hp / m.max, 0) >= sides[1].mons.reduce((a, m) => a + m.hp / m.max, 0) ? 0 : 1;
  ev.push({ k: 'end', w: winner });
  recordBattle(sides.map(sd => sd.t), tally, winner, stakes);
  return {
    title, stakes, winner, ev, legend: !!opts.boss, bossHp: opts.boss ? sides[1].mons[0].hp / sides[1].mons[0].max : undefined,
    sides: sides.map(s => ({ id: s.t.id, name: dn(s.t), team: s.mons.map((m, i) => ({ sp: m.sp, L: m.L, max: m.max, types: m.baseTypes || m.types, ab: m.ab || null, shiny: !!(s.t.team[i] && s.t.team[i].shiny) })), left: s.mons.filter(m => m.hp > 0).length })),
  };
}

// ================= MOVES =================
// A curated move list, not real learnsets: each Pokémon knows up to four moves drawn from its own types and the coverage
// types it learns, with stronger tiers opening as it levels (tier 2 at Lv 22, tier 3 at Lv 40). Moves that don't deal
// damage in the games deal light damage here and keep their effect. Numbers are tuned for this game.
// MOVES_RAW (the move list): in pokemon-data.js
const MOVES = {};
for (const line of MOVES_RAW.split('\n')) {
  const [name, type, cat, pw, acc, tier, flags, eff] = line.split('|');
  const mv = { name, type, cat, pw: +pw, acc: +acc, tier: +tier, flags: flags || '', eff: eff || '' };
  const e = mv.eff;
  mv.utility = /^(st:(par|brn|psn|tox|slp):(7|8)\d|boost|boost2|dance|heal|protect|hazard|weather|seed)/.test(e) && mv.pw <= 35;
  mv.setup = /^(boost|boost2|dance|heal)/.test(e);
  mv.secondary = !mv.utility && /^(st:|fl:|foe:|up:)/.test(e); // an added effect on a damaging move (what Sheer Force trades away)
  mv.sig = mv.flags.includes('g');
  MOVES[name] = mv;
}
// v184: Missingno's glitch slot turns into a random damaging move from the whole list each time it's used
MOVES['??????'].glitch = true;
let GLITCH_POOL = null;
const glitchMove = () => pick(GLITCH_POOL || (GLITCH_POOL = Object.values(MOVES).filter(x => !x.utility && !x.sig && !x.glitch && CHART[x.type])));
// SIG_MOVES (signature moves): in pokemon-data.js
const SIG_OF = {};
for (const [n, list] of Object.entries(SIG_MOVES)) for (const sp of list) (SIG_OF[sp] = SIG_OF[sp] || []).push(n);
const MOVE_TIER_LV = [0, 1, 22, 40];
// multi-hit moves: 2–5 hits (35/35/15/15%), or a fixed 2 or 3; Skill Link always lands five
const HITS_25 = [2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 5, 5, 5];
const isMulti = mv => /[mdt]/.test(mv.flags);
const hitsAvg = (mv, ab) => mv.flags.includes('m') ? (ab === 'Skill Link' ? 5 : 3.1) : mv.flags.includes('t') ? 3 : mv.flags.includes('d') ? 2 : 1;
const rollHits = (mv, ab) => mv.flags.includes('m') ? (ab === 'Skill Link' ? 5 : HITS_25[Math.floor(rand() * HITS_25.length)]) : mv.flags.includes('t') ? 3 : mv.flags.includes('d') ? 2 : 1;
const STAB = 1.5, MOVE_SCALE = 1 / 1.6; // a same-type 75-power move hits like the old type-only attacks
const moveCat = (m, sp) => { const b = bsOf(sp); return b.atk > b.spa * 1.1 ? 'P' : b.spa > b.atk * 1.1 ? 'S' : null; };
// the moves this Pokémon should know at its level: same-type attacks first, then its learned coverage, maybe one utility move
let MOVES_BY_TYPE = null, UTILITY_MOVES = null;
const tierAt = L => MOVE_TIER_LV.filter(x => L >= x).length;
function idealMoves(m) {
  // Missingno always knows the same four, Water Gun twice included
  if (isGlitch(m.sp)) return ['Sky Attack', 'Water Gun', 'Water Gun', '??????'];
  if (!MOVES_BY_TYPE) { MOVES_BY_TYPE = {}; UTILITY_MOVES = [];
    for (const x of Object.values(MOVES)) { if (x.sig) continue; if (x.utility) UTILITY_MOVES.push(x); else (MOVES_BY_TYPE[x.type] = MOVES_BY_TYPE[x.type] || []).push(x); } }
  const L = moveLv(m), types = monTypes(m), pref = moveCat(m, m.sp), h = hashStr(String(m.uid || m.sp) + m.sp), ab = abilityOf(m);
  // Liquid Voice: sound moves count as Water moves
  const avail = ty => (MOVES_BY_TYPE[ty] || []).concat(ab === 'Liquid Voice' && ty === 'Water' ? Object.values(MOVES_BY_TYPE).flat().filter(x => x.flags.includes('s') && x.type !== 'Water') : [], ATE[ab] === ty ? MOVES_BY_TYPE.Normal || [] : []).filter(x => L >= MOVE_TIER_LV[x.tier]);
  // the best attack of a type: highest tier, matching the Pokémon's better attacking stat, ties broken per Pokémon
  const bestOf = (ty, exclude = []) => { const c = avail(ty).filter(x => !exclude.includes(x.name)); if (!c.length) return null;
    const sc = x => x.tier * 100 + (pref ? (x.cat === pref ? 40 : 0) : 20) + x.pw * hitsAvg(x, ab) * x.acc / 1000 + (x.acc < 90 ? -6 : 0) - (/^recoil/.test(x.eff) ? (ab === 'Reckless' ? -8 : ['Rock Head', 'Magic Guard'].includes(ab) ? 0 : +x.eff.split(':')[1] / 4) : 0) - (/^self/.test(x.eff) ? (ab === 'Contrary' ? -10 : 6) : 0)
      + (ab === 'Liquid Voice' && x.flags.includes('s') ? 110 : 0) + (ATE[ab] && x.type === 'Normal' && !x.flags.includes('r') ? 110 : 0) + ((ab === 'Steelworker' && x.type === 'Steel') || (ab === "Dragon's Maw" && x.type === 'Dragon') ? 20 : 0) + (ab === 'Punk Rock' && x.flags.includes('s') ? 110 : 0) + (ab === 'Sharpness' && x.flags.includes('x') ? 110 : 0) + (ab === 'Technician' && x.pw <= 60 ? 8 : 0) + (ab === 'Skill Link' && x.flags.includes('m') ? 110 : 0) - (x.flags.includes('r') ? 25 : 0) + ((h >> (x.name.length % 13)) % 7);
    return c.sort((a, b) => sc(b) - sc(a))[0].name; };
  // signature moves come first once their tier is open; a damaging one takes the slot of its type
  const sigs = (SIG_OF[m.sp] || []).map(n => MOVES[n]).filter(x => x && L >= MOVE_TIER_LV[x.tier]);
  const sigUtil = sigs.find(x => x.utility);
  const out = sigs.filter(x => !x.utility).map(x => x.name).slice(0, 2);
  for (const ty of types) { if (out.some(n => MOVES[n].type === ty)) continue; const n = bestOf(ty, out); if (n) out.push(n); }
  const cov = learnedCov(m);
  if (cov[0] && out.length < 4) { const n = bestOf(cov[0], out); if (n) out.push(n); }
  // a utility move of its own type for about 40% of Pokémon, chosen once per Pokémon (it keeps its slot over a second coverage move)
  if (sigUtil && out.length < 4) out.push(sigUtil.name);
  else if (out.length < 4 && (h % 10) < 4) {
    const u = UTILITY_MOVES.filter(x => (types.includes(x.type) || x.type === 'Normal') && L >= MOVE_TIER_LV[x.tier] && !(x.cat === 'P' && pref === 'S' && /boost:atk|boost2:atk|dance:atk/.test(x.eff)) && !(x.cat === 'S' && pref === 'P' && /boost:spa|boost2:spa|dance:spa/.test(x.eff)) && !(ab === 'Contrary' && /^(boost|dance)/.test(x.eff)));
    if (u.length) out.push(u[h % u.length].name);
  }
  for (const ty of cov.slice(1)) { if (out.length >= 4) break; const n = bestOf(ty, out); if (n) out.push(n); }
  // fill: a second same-type attack, then a Normal-type attack
  for (const ty of types.concat(['Normal'])) { if (out.length >= 4) break; const n = bestOf(ty, out); if (n) out.push(n); }
  return out.slice(0, 4);
}
// bring a Pokémon's moves up to date; returns [learned, replaced] pairs
// the moveset only depends on species, types, coverage and move tier, so skip the work when none of those changed
const MOVE_KEYS = new WeakMap();
const moveKey = (m, mv) => m.sp + '|' + monTypes(m).join('/') + '|' + learnedCov(m).join('/') + '|' + tierAt(moveLv(m)) + '|' + abilityOf(m) + '|' + (mv || []).join(',');
function refreshMoves(m) {
  const key = moveKey(m, m.moves);
  if (m.moves && MOVE_KEYS.get(m) === key) return [];
  const want = idealMoves(m), had = m.moves || [];
  const changes = [];
  const gone = had.filter(x => !want.includes(x));
  for (const x of want) if (!had.includes(x)) changes.push([x, gone.shift() || null]);
  m.moves = want;
  MOVE_KEYS.set(m, moveKey(m, want));
  return changes;
}
const moveOf = n => MOVES[n];

// ================= ABILITIES =================
// ABILITY_RAW (ability slots): in pokemon-data.js
const SPECIES_AB = {};
for (const line of ABILITY_RAW.split('\n')) { const [n, a, b, h] = line.split('|'); SPECIES_AB[n] = { 0: a || null, 1: b || null, H: h || null }; }
const HIDDEN_CHANCE = 0.25, HIDDEN_CHANCE_SPECIAL = 0.5;
const PUNCH_TYPES = ['Fighting', 'Fire', 'Ice', 'Electric'], BITE_TYPES = ['Dark', 'Fire', 'Ice', 'Electric', 'Psychic', 'Poison'], PULSE_TYPES = ['Water', 'Dark', 'Dragon', 'Fighting'];
const NO_DROP = ['Clear Body', 'White Smoke', 'Full Metal Body', 'Hyper Cutter'], NO_INTIMIDATE = ['Own Tempo', 'Oblivious', 'Inner Focus', 'Scrappy'];
// short descriptions (shown on the Pokémon card); "adapted" ones stand in for a mechanic the game doesn't have
const ABILITIES = {
  Glitch: 'Its six stats are dealt out at random at the start of every battle. Its total never changes, but one battle it can be a glass cannon and the next a wall. Every move it uses counts as its own type.',
  Blaze: 'Fire-type hits do 50% more at a third of its HP or less.', Torrent: 'Water-type hits do 50% more at a third of its HP or less.',
  Overgrow: 'Grass-type hits do 50% more at a third of its HP or less.', Swarm: 'Bug-type hits do 50% more at a third of its HP or less.',
  Intimidate: "Lowers the opposing Pokémon's Attack when it enters.", Moxie: 'Attack rises with every knockout.', 'Speed Boost': 'Speed rises every turn.',
  Defiant: 'Attack rises sharply when an opponent lowers its stats.', Competitive: 'Sp. Atk rises sharply when an opponent lowers its stats.',
  'Weak Armor': 'Physical hits lower its Defense but sharply raise its Speed.', Justified: 'Attack rises when hit by a Dark-type move.',
  Rattled: 'Speed rises when hit by Bug, Dark or Ghost moves, or Intimidated.', 'Clear Body': 'Its stats can’t be lowered.', 'White Smoke': 'Its stats can’t be lowered.',
  'Full Metal Body': 'Its stats can’t be lowered.', 'Hyper Cutter': 'Its Attack can’t be lowered.', 'Own Tempo': 'Unaffected by Intimidate.', Oblivious: 'Unaffected by Intimidate.',
  'Inner Focus': 'Unaffected by Intimidate.', Scrappy: 'Unaffected by Intimidate, and its Normal and Fighting moves hit Ghost types.', Unaware: "Ignores the opponent's stat changes.",
  Levitate: 'Immune to Ground-type moves.', 'Flash Fire': 'Immune to Fire; absorbing a Fire move powers up its own Fire moves.',
  'Water Absorb': 'Immune to Water; heals 25% when hit by one.', 'Volt Absorb': 'Immune to Electric; heals 25% when hit by one.', 'Sap Sipper': 'Immune to Grass; Attack rises when hit by one.',
  'Lightning Rod': 'Immune to Electric; Sp. Atk rises when hit by one.', 'Storm Drain': 'Immune to Water; Sp. Atk rises when hit by one.', 'Motor Drive': 'Immune to Electric; Speed rises when hit by one.',
  'Dry Skin': 'Immune to Water (heals 25%); takes 25% more from Fire. Heals in rain, hurts in sun.',
  Sturdy: 'At full HP, survives any single hit with 1 HP.', Multiscale: 'Takes half damage at full HP.', 'Thick Fat': 'Takes half damage from Fire and Ice.', Heatproof: 'Takes half damage from Fire.',
  Filter: 'Super-effective hits do 25% less.', 'Solid Rock': 'Super-effective hits do 25% less.', 'Fur Coat': 'Takes half damage from physical hits.', 'Ice Scales': 'Takes half damage from special hits.',
  'Shell Armor': 'Can’t be hit by critical hits.', 'Battle Armor': 'Can’t be hit by critical hits.', 'Rough Skin': 'Contact moves cost the attacker 1/8 of its HP.', 'Iron Barbs': 'Contact moves cost the attacker 1/8 of its HP.',
  'Huge Power': 'Attack ×1.5.', 'Pure Power': 'Attack ×1.5.', Hustle: 'Attack ×1.5, but its physical moves miss 20% of the time.',
  'Sheer Force': 'Moves with added effects hit 30% harder, but lose those effects.', Technician: 'Moves of 60 power or less hit 50% harder.', 'Skill Link': 'Moves that hit 2–5 times always hit five times.', Adaptability: 'Same-type moves are even stronger (×1.33).',
  Sniper: 'Critical hits do even more damage.', 'Super Luck': 'Lands critical hits more often.', 'Tough Claws': 'Contact moves hit 30% harder.',
  'Iron Fist': 'Punching moves hit 20% harder.', 'Strong Jaw': 'Biting moves hit 50% harder.',
  'Mega Launcher': 'Pulse moves (Water Pulse, Dragon Pulse, Dark Pulse, Aura Sphere) hit 50% harder.', 'Mold Breaker': "Its moves ignore the target's ability.", Teravolt: "Its moves ignore the target's ability.", Turboblaze: "Its moves ignore the target's ability.",
  'Compound Eyes': 'Its moves are more accurate.', 'Keen Eye': "Ignores the opponent's evasion.", 'No Guard': 'Every move it uses or faces hits.',
  Static: 'Contact moves may paralyze the attacker (30%).', 'Flame Body': 'Contact moves may burn the attacker (30%).', 'Poison Point': 'Contact moves may poison the attacker (30%).',
  'Rock Head': 'No recoil damage.', Insomnia: 'Can’t fall asleep.', 'Vital Spirit': 'Can’t fall asleep.', 'Sweet Veil': 'Can’t fall asleep.', 'Early Bird': 'Wakes up quickly.', Steadfast: 'Speed rises when it flinches.',
  Guts: 'Attack ×1.5 while it has a status condition, and burns don’t weaken it.', 'Marvel Scale': 'Defense ×1.5 while it has a status condition.',
  'Shed Skin': 'Sometimes (30%) shakes off a status condition each turn.', Limber: 'Can’t be paralyzed.', 'Water Veil': 'Can’t be burned.', Immunity: 'Can’t be poisoned.',
  Synchronize: 'Passes a status condition back to whoever caused it.', 'Poison Heal': 'Poison heals it instead of hurting it.',
  Drizzle: 'Summons rain when it enters.', Drought: 'Summons harsh sunlight when it enters.', 'Sand Stream': 'Summons a sandstorm when it enters.', 'Snow Warning': 'Summons snow when it enters.',
  'Swift Swim': 'Doubles Speed in rain.', Chlorophyll: 'Doubles Speed in sunlight.', 'Sand Rush': 'Doubles Speed in a sandstorm.', 'Slush Rush': 'Doubles Speed in snow.',
  'Sand Force': 'Rock, Ground and Steel hits do 30% more in a sandstorm; unhurt by sand.', 'Solar Power': 'Sp. Atk ×1.5 in sunlight, but it loses HP each turn.',
  'Rain Dish': 'Heals a little each turn in rain.', 'Ice Body': 'Heals a little each turn in snow.', Hydration: 'Cures its status condition in rain.',
  'Sand Veil': 'Harder to hit (20%) in a sandstorm.', 'Snow Cloak': 'Harder to hit (20%) in snow.', 'Leaf Guard': 'Can’t get a status condition in sunlight.', Overcoat: 'Unhurt by sandstorms.',
  Pickup: 'Its trainer finds items more often while exploring.',
  'Serene Grace': 'Added effects of its moves (flinch, burns, stat drops) happen twice as often.', Reckless: 'Recoil moves hit 20% harder.',
  Prankster: 'The first time it uses a utility move in a battle, it goes first.', Analytic: 'Hits 30% harder when it moves second in a turn.',
  Soundproof: 'Immune to sound moves.', 'Punk Rock': 'Sound moves hit 30% harder, and it takes half damage from them.', 'Liquid Voice': 'Its sound moves become Water-type.',
  'Shield Dust': 'Blocks the added effects of moves that hit it.', Stench: 'Its attacks may make the target flinch (10%).', 'Big Pecks': 'Its Defense can’t be lowered.',
  Simple: 'Its stat changes are doubled.', Contrary: 'Its stat changes are reversed: drops become rises and rises become drops.',
  'Magic Guard': 'Only takes damage from attacks: no recoil, hazards, poison, burn, weather, Leech Seed or Life Orb damage.', 'Sticky Hold': 'Its item can’t be knocked away.',
  'Liquid Ooze': 'Draining moves hurt the attacker instead of healing it.', 'Anger Point': 'Taking a critical hit maxes its Attack.', Triage: 'Its healing and draining moves go first.',
  'Gale Wings': 'Its Flying moves go first while it is at full HP.', 'Poison Touch': 'Its contact moves may poison the target (30%).',
  Aftermath: 'A contact attacker that knocks it out loses 1/4 of its HP.', Gooey: 'Contact attackers lose Speed.', 'Tangling Hair': 'Contact attackers lose Speed.',
  Fluffy: 'Takes half damage from contact moves, but double from Fire.', 'Long Reach': 'Its moves never make contact.', 'Unseen Fist': 'Its contact moves get through Protect.',
  Bulletproof: 'Immune to ball and bomb moves (Shadow Ball, Sludge Bomb, Energy Ball…).', Sharpness: 'Slicing moves (Leaf Blade, Night Slash, X-Scissor…) hit 50% harder.',
  'Beast Boost': 'Its best stat rises with every knockout.', Pixilate: 'Normal moves become Fairy-type and hit 20% harder.', Refrigerate: 'Normal moves become Ice-type and hit 20% harder.',
  Galvanize: 'Normal moves become Electric-type and hit 20% harder.', Steelworker: 'Steel moves hit 50% harder.', "Dragon's Maw": 'Dragon moves hit 50% harder.', Transistor: 'Electric moves hit 30% harder.',
  Truant: 'It can only act every other turn.', 'Slow Start': 'Attack and Speed are halved for its first five turns.', Defeatist: 'Attack and Sp. Atk are halved at half HP or less.',
  'Wonder Guard': 'Only super-effective hits can damage it.', 'Intrepid Sword': 'Attack rises when it enters.', 'Dauntless Shield': 'Defense rises when it enters.',
  'Fairy Aura': 'Fairy moves hit 33% harder, for both sides.', 'Dark Aura': 'Dark moves hit 33% harder, for both sides.', 'Aura Break': 'Turns Fairy Aura and Dark Aura around: those moves hit 25% softer.',
  'Tablets of Ruin': "Lowers the opposing Pokémon's Attack by 25%.", 'Sword of Ruin': "Lowers the opposing Pokémon's Defense by 25%.", 'Vessel of Ruin': "Lowers the opposing Pokémon's Sp. Atk by 25%.", 'Beads of Ruin': "Lowers the opposing Pokémon's Sp. Def by 25%.",
  'Good as Gold': 'Immune to utility moves.', 'Gorilla Tactics': 'Attack ×1.5, but it sticks with its first move.',
  Protosynthesis: 'Sent out at full HP, its best stat rises (×1.3, Speed ×1.5) for the battle (adapted).', 'Quark Drive': 'Sent out at full HP, its best stat rises (×1.3, Speed ×1.5) for the battle (adapted).',
  'Orichalcum Pulse': 'Summons harsh sunlight when it enters; Attack ×1.33 in sunlight.', 'Air Lock': 'Clears the weather when it enters, and no weather can start while it is out.',
  'Electric Surge': "Its whole team's Electric moves hit 20% harder (adapted).", 'Psychic Surge': "Its whole team's Psychic moves hit 20% harder (adapted).",
  'Grassy Surge': "Its whole team's Grass moves hit 20% harder (adapted).", 'Misty Surge': "Its whole team's Fairy moves hit 20% harder (adapted).",
  'Hadron Engine': "Its whole team's Electric moves hit 33% harder (adapted).",
  'Cursed Body': 'A move that hits it may be disabled for 3 turns (30%).', 'Magic Bounce': 'Status moves, Leech Seed, stat drops and hazards aimed at it bounce back at the user.',
  'Shadow Tag': "While it's out, it picks which Pokémon the opponent sends in next: their worst matchup (adapted).",
  Pressure: "Opponents facing it can't run hot: their form bonus counts for nothing (adapted).", Regenerator: 'Restores a third of its HP when it knocks out a foe (adapted).', 'Natural Cure': 'Heals its status condition when it knocks out a foe (adapted).', Unnerve: "The opposing Pokémon can't eat berries.",
  // v178: every species now has at least one ability
  'Run Away': "Can't be dragged out by Shadow Tag or Magnet Pull, and its trainer finds items more often while exploring (adapted).",
  Gluttony: 'Its held Berry works twice per battle (adapted).', Harvest: 'After it eats its Berry, the Berry grows back half the time each turn, every turn in sunlight.',
  Infiltrator: 'Its moves get through Protect (adapted).', Illusion: 'Enters disguised as the last healthy Pokémon on its team: the opponent picks moves against the disguise until a hit breaks it.',
  'Flower Veil': "Its own stats and its Grass-type teammates' stats can't be lowered by the opponent (adapted).", 'Aroma Veil': "Its team's moves can't be disabled by Cursed Body (adapted).",
  'Cute Charm': "Contact moves may charm the attacker (30%): for three turns it's too smitten to attack half the time (adapted).",
  Mummy: 'Contact attackers have their ability turned into Mummy.', 'Wandering Spirit': 'Swaps abilities with a contact attacker.',
  'Mycelium Might': "Its utility moves always go last, but they ignore the target's ability.", 'Toxic Chain': 'Its attacks may badly poison the target (30%).',
  Corrosion: 'It can poison Steel and Poison types.', Protean: 'Becomes the type of the move it uses, so every attack gets the same-type bonus.',
  'Heavy Metal': 'Physical hits do 20% less, but it is a little slower (adapted).', Berserk: 'Sp. Atk rises when a hit drops it to half HP or less.',
  Download: "Raises Attack or Sp. Atk when it enters, whichever hits the opponent's weaker defense.", Magician: "When it hits, it steals the target's held item if it isn't holding one.",
  'Magnet Pull': "While it's out, the opponent must send in a Steel type next if it has one: their worst matchup (adapted).",
  Forecast: 'Its type matches the weather: Fire in sunlight, Water in rain, Ice in snow.', 'Flower Gift': "In sunlight, its whole team's Attack and Sp. Def ×1.5 while it's still standing (adapted).",
  'Stance Change': 'Starts in its bulky Shield Forme; attacking turns it into Blade Forme (attack and defense stats swap), and Protect turns it back.',
  Battery: 'The teammate sent in after it falls hits 30% harder (adapted).', 'Power Spot': 'The teammate sent in after it falls hits 30% harder (adapted).',
  Dancer: "Copies the stat boosts of the opponent's setup moves (adapted).", Schooling: 'Fights as a whole school until it drops to a quarter HP, then the school breaks up and its stats crash.',
  'Wimp Out': 'Once per battle, when a hit drops it to half HP, it retreats and a teammate takes over; it can come back later (adapted).',
  'Emergency Exit': 'Once per battle, when a hit drops it to half HP, it retreats and a teammate takes over; it can come back later (adapted).',
  'Shields Down': 'Above half HP its shell blocks status conditions; below half the shell breaks: Attack, Sp. Atk and Speed soar, defenses drop.',
  Comatose: "It's always half asleep: it can't get any status condition.", Disguise: 'The first hit only busts its disguise, costing it 1/8 of its HP.',
  'Gulp Missile': 'After it uses a Water move, it catches prey: the next attacker to hit it loses 1/4 of its HP, and has its Defense lowered (prey caught above half HP) or is paralyzed (at half HP or less).',
  'Ice Face': 'Its ice face blocks the first physical hit, then it fights faster but frailer; snow rebuilds the ice.',
  'Hunger Switch': 'Gets hungry every other turn: while hangry, its Electric moves become Dark.', 'Zero to Hero': 'Leading off, it fights in its weaker Zero Form until its first knockout; sent in later, it arrives as the Hero (adapted).',
  'Surge Surfer': "Speed doubles while its team's Electric moves are powered up (Electric Surge, Hadron Engine).", Mimicry: "Its type matches its team's Surge, or else the weather.",
  'Bad Dreams': 'Sleeping opponents lose 1/8 of their HP each turn, and its Dark moves may put the target to sleep (10%) (adapted).',
  'Victory Star': "Its team's moves are 10% more accurate while it's still standing (adapted).", Multitype: 'Its type becomes the type of its held type-boosting item (Charcoal makes it Fire).',
  'RKS System': 'Its type becomes the type of its held type-boosting item (Charcoal makes it Fire).', 'Shadow Shield': "Takes half damage at full HP, and nothing can ignore it.",
  'Prism Armor': 'Super-effective hits do 25% less, and nothing can ignore it.', 'Soul-Heart': 'Sp. Atk rises whenever a Pokémon faints.',
  'Chilling Neigh': 'Attack rises with every knockout.', 'Grim Neigh': 'Sp. Atk rises with every knockout.', 'Tera Shell': 'At full HP, every hit on it is not very effective.',
  'Poison Puppeteer': 'Pokémon it poisons also have their Attack and Sp. Atk lowered (adapted).', "Mind's Eye": "Ignores the opponent's evasion, and its Normal and Fighting moves hit Ghost types.",
};
const abilityName = k => k;
// which ability a Pokémon has right now: its slot's ability on its current species, or another built one of the species'
function abilityOf(m) {
  if (!m || !featOn('abilities')) return null;
  if (m.deltaAb && ABILITIES[m.deltaAb]) return m.deltaAb;
  const A = SPECIES_AB[m.sp] || (m.sp && SPECIES_AB[m.sp.replace(/^Mega /, '')]); if (!A) return null;
  const want = A[m.abSlot || 0];
  if (want && ABILITIES[want]) return want;
  for (const k of ['0', '1', 'H']) if (A[k] && ABILITIES[A[k]]) return A[k];
  return null;
}
function rollAbSlot(m) {
  const A = SPECIES_AB[m.sp] || {};
  const special = m.shiny || m.alpha || m.delta;
  if (A.H && rand() < (special ? HIDDEN_CHANCE_SPECIAL : HIDDEN_CHANCE)) return 'H';
  return A[1] && rand() < 0.5 ? '1' : '0';
}
// ---------- battle field: weather, status, stat changes ----------
// Gym battles take their gym's weather; regional events and legendaries set it everywhere; weather abilities override.
const GYM_WEATHER = { Water: 'rain', Fire: 'sun', Rock: 'sand', Ground: 'sand', Ice: 'snow' };
const WEATHER_NAME = { rain: 'Rain', sun: 'Harsh sunlight', sand: 'Sandstorm', snow: 'Snow' };
function regionWeather() {
  if (S.phase === 'season' && eventActive()) { const sc = eventTeam().scheme; if (sc === 'drought') return 'sun'; if (sc === 'rain') return 'rain'; }
  const L = S.legend; if (L && S.phase === 'season') { if (L.sp === 'Groudon') return 'sun'; if (L.sp === 'Kyogre') return 'rain'; }
  const st = stormOn(); if (st && st.wx) return st.wx;
  return null;
}
const weatherMul = (w, ty) => w === 'sun' ? (ty === 'Fire' ? 1.25 : ty === 'Water' ? 0.75 : 1) : w === 'rain' ? (ty === 'Water' ? 1.25 : ty === 'Fire' ? 0.75 : 1) : 1;
const stageMul = n => n >= 0 ? (2 + n) / 2 : 2 / (2 - n);
const STATUS_NAME = { brn: 'burned', par: 'paralyzed', psn: 'poisoned' };

// ================= HELD ITEMS =================
// Each Pokémon can hold one item. Items stay with the Pokémon (trades, farewell gifts); a released Pokémon's item goes
// back to its trainer's bag. The Mega Stone takes the item slot: the season's Mega holder battles without its item.
// Tiers: 1 common, 2 uncommon, 3 rare. Elite trainers are equipped by the League from an unlimited supply.
const TYPE_ITEMS = { Normal: 'Silk Scarf', Fire: 'Charcoal', Water: 'Mystic Water', Electric: 'Magnet', Grass: 'Miracle Seed', Ice: 'Never-Melt Ice', Fighting: 'Black Belt', Poison: 'Poison Barb', Ground: 'Soft Sand', Flying: 'Sharp Beak', Psychic: 'Twisted Spoon', Bug: 'Silver Powder', Rock: 'Hard Stone', Ghost: 'Spell Tag', Dragon: 'Dragon Fang', Dark: 'Black Glasses', Steel: 'Metal Coat', Fairy: 'Fairy Feather' };
const ITEMS = {
  sitrus: { name: 'Sitrus Berry', tier: 1, desc: 'Once per battle, restores 25% HP when it drops to half.' },
  quickclaw: { name: 'Quick Claw', tier: 1, desc: 'Sometimes (20%) lets it move first.' },
  scopelens: { name: 'Scope Lens', tier: 1, desc: 'Raises its critical-hit chance.' },
  soothebell: { name: 'Soothe Bell', tier: 1, desc: 'Friendship grows 50% faster.' },
  everstone: { name: 'Everstone', tier: 1, desc: 'Stops it from evolving.' },
  leftovers: { name: 'Leftovers', tier: 2, desc: 'Restores 1/16 of its HP every turn.' },
  expertbelt: { name: 'Expert Belt', tier: 2, desc: 'Super-effective hits do 20% more.' },
  eviolite: { name: 'Eviolite', tier: 2, desc: 'Defense and Sp. Def ×1.5 while it can still evolve.' },
  focussash: { name: 'Focus Sash', tier: 2, desc: 'At full HP, survives a knockout blow with 1 HP (once).' },
  assaultvest: { name: 'Assault Vest', tier: 2, desc: 'Sp. Def ×1.4.' },
  luckyegg: { name: 'Lucky Egg', tier: 2, desc: 'Gains levels 15% faster.' },
  choiceband: { name: 'Choice Band', tier: 3, desc: 'Attack ×1.3, but it only uses its own types (no coverage moves).' },
  choicespecs: { name: 'Choice Specs', tier: 3, desc: 'Sp. Atk ×1.3, but it only uses its own types (no coverage moves).' },
  lifeorb: { name: 'Life Orb', tier: 3, desc: 'Hits 25% harder, but loses 10% of its HP with each hit.' },
};
for (const [ty, name] of Object.entries(TYPE_ITEMS)) ITEMS['tb' + ty] = { name, tier: 1, type: ty, desc: `${ty}-type hits do 10% more.` };
const BAG_MAX = 8;
const itemName = k => (ITEMS[k] || {}).name || k;
const itemsOn = () => featOn('items');
const heldItem = m => itemsOn() && m && m.item && ITEMS[m.item] ? m.item : null;
// how much a Pokémon wants an item (higher is better); 0 = no use
// how well a move type does against a foe's whole team (average multiplier)
function foeEffAvg(foe, ty) {
  const ms = (foe && foe.team) || []; if (!ms.length) return 1;
  return ms.reduce((a, x) => a + monTypes(x).reduce((p, d) => p * effOne(ty, d), 1), 0) / ms.length;
}
// with a foe (the next Gym Leader, Elite Four member or Champion), items are weighed for that matchup
function itemScore(m, k, t, foe) {
  const it = ITEMS[k]; if (!it) return 0;
  const b = bsOf(m.sp), types = monTypes(m), off = Math.max(b.atk, b.spa), bulk = b.hp + b.def + b.spd;
  const atkTypes = (m.moves || []).map(n => MOVES[n]).filter(x => x && !x.utility).map(x => x.type);
  if (it.type) {
    const knows = atkTypes.length ? atkTypes.includes(it.type) : (types.includes(it.type) || (m.cov || []).some(c => c.t === it.type));
    if (!knows) return 0;
    const base = types.includes(it.type) ? 9 + off / 40 : 4;
    return foe ? base * clamp(foeEffAvg(foe, it.type), 0.4, 1.8) : base;
  }
  if (foe && k === 'expertbelt') return atkTypes.some(ty => foeEffAvg(foe, ty) >= 1.5) ? 13 : 3;
  if (foe && k === 'assaultvest' && b.atk > b.spa) { const ms = foe.team || []; const sp = ms.length ? ms.filter(x => { const fb = bsOf(x.sp); return fb.spa > fb.atk; }).length / ms.length : 0.5; return (4 + b.hp / 30 + (b.spd < b.def ? 2 : 0)) * (0.4 + sp * 1.2); }
  switch (k) {
    case 'choiceband': return b.atk > b.spa * 1.15 ? 8 + b.atk / 18 : 0;
    case 'choicespecs': return b.spa > b.atk * 1.15 ? 8 + b.spa / 18 : 0;
    case 'lifeorb': return 6 + off / 20 - (b.hp < 60 ? 3 : 0);
    case 'expertbelt': return 7 + (m.cov || []).length * 1.5;
    case 'leftovers': return 4 + bulk / 45;
    case 'assaultvest': return b.atk > b.spa ? 4 + b.hp / 30 + (b.spd < b.def ? 2 : 0) : 0;
    case 'eviolite': return SP[m.sp].evos ? 15 : 0;
    case 'focussash': return bulk < 230 ? 10 + b.spe / 30 : 3;
    case 'sitrus': return 6;
    case 'scopelens': return 4 + (m.fr ?? 70) / 120;
    case 'quickclaw': return b.spe < 60 ? 7 : 2;
    case 'luckyegg': { if (!t || t.role !== 'challenger') return 0; const top = Math.max(...t.team.map(x => x.lvl)); return m.lvl < top - 4 ? 12 : 1; }
    case 'soothebell': return t && t.role === 'challenger' && (m.fr ?? 70) < 220 ? 3 : 0;
    default: return 0;
  }
}
function bagAdd(t, k) { if (!k || !ITEMS[k]) return false; t.bag = t.bag || []; t.bag.push(k); trimBag(t); return true; }
// over the limit, the item the team has least use for goes
function trimBag(t) {
  while ((t.bag || []).length > BAG_MAX) {
    // the item whose loss costs the team least, once everything else is shared out as well as possible
    const all = heldPool(t), full = teamItemValue(t, all);
    const val = k => { const i = all.indexOf(k), rest = all.slice(0, i).concat(all.slice(i + 1)); return full - teamItemValue(t, rest) + ITEMS[k].tier * 0.5; };
    const worst = [...new Set(t.bag)].sort((a, b) => val(a) - val(b))[0];
    t.bag.splice(t.bag.indexOf(worst), 1);
    if (t.user) news(`${dn(t)}'s bag was full, so the ${itemName(worst)} was left behind.`, 'you', t.id);
  }
}
// v177: items are shared out to get the most from the whole team, not greedily one Pokémon at a time. If Gengar is the
// only Pokémon that can use a Poison Barb, it takes the Barb and its Focus Sash moves to whoever gets most from that.
// A team can hold any number of type boosters but only one of each other item. Returns, per team slot, the pool index
// of its item (-1 for none), and the total value.
function bestItemPlan(team, pool, t, foe) {
  const n = team.length; if (!n) return { pick: [], total: 0 };
  // one copy of each non-type item is enough to consider (a second could never be held)
  const cand = []; const seen = new Set();
  pool.forEach((k, i) => { if (!ITEMS[k]) return; if (!ITEMS[k].type) { if (seen.has(k)) return; seen.add(k); } cand.push(i); });
  const m = cand.length + n; // each Pokémon also has its own "no item" column
  const val = (r, c) => c < cand.length ? Math.max(0, itemScore(team[r], pool[cand[c]], t, foe)) : (c - cand.length === r ? 0 : -1e6);
  // Hungarian algorithm (maximising), rows = Pokémon, columns = items + "none"
  const INF = 1e18, u = new Array(n + 1).fill(0), v = new Array(m + 1).fill(0), p = new Array(m + 1).fill(0), way = new Array(m + 1).fill(0);
  const cost = (r, c) => -val(r, c);
  for (let i = 1; i <= n; i++) {
    p[0] = i; let j0 = 0; const minv = new Array(m + 1).fill(INF), used = new Array(m + 1).fill(false);
    do {
      used[j0] = true; const i0 = p[j0]; let delta = INF, j1 = 0;
      for (let j = 1; j <= m; j++) if (!used[j]) {
        const cur = cost(i0 - 1, j - 1) - u[i0] - v[j];
        if (cur < minv[j]) { minv[j] = cur; way[j] = j0; }
        if (minv[j] < delta) { delta = minv[j]; j1 = j; }
      }
      for (let j = 0; j <= m; j++) if (used[j]) { u[p[j]] += delta; v[j] -= delta; } else minv[j] -= delta;
      j0 = j1;
    } while (p[j0] !== 0);
    do { const j1 = way[j0]; p[j0] = p[j1]; j0 = j1; } while (j0);
  }
  const pick = new Array(n).fill(-1); let total = 0;
  for (let j = 1; j <= m; j++) if (p[j]) { const r = p[j] - 1, c = j - 1; if (c < cand.length && val(r, c) > 0) { pick[r] = cand[c]; total += val(r, c); } }
  return { pick, total };
}
// how much the team gets from a set of items when they're shared out as well as possible
const teamItemValue = (t, pool, foe) => bestItemPlan(t.team || [], pool, t, foe).total;
const heldPool = t => (t.bag || []).concat((t.team || []).map(m => m.item).filter(Boolean));
// how much a new item adds to the team, given everything it already holds and carries
const itemGain = (t, k) => { const pool = heldPool(t); return teamItemValue(t, pool.concat([k])) - teamItemValue(t, pool) + ITEMS[k].tier * 0.01; };
// put the best items from the bag (and what's already held) on the team; leftovers go back in the bag
// with a foe, the set is chosen for that battle (a gym, an Elite Four member, the Champion)
function autoEquip(t, foe) {
  if (!t || !t.team) return;
  const pool = (t.bag || []).slice(); for (const m of t.team) if (m.item) { pool.push(m.item); m.item = null; }
  const { pick } = bestItemPlan(t.team, pool, t, foe), used = new Set();
  t.team.forEach((m, r) => { if (pick[r] >= 0) { m.item = pool[pick[r]]; used.add(pick[r]); } });
  t.bag = pool.filter((_, i) => !used.has(i));
  trimBag(t);
}
// the League equips its Gym Leaders (from the fourth gym on), Elite Four and Champion
function eliteItems(t) {
  if (!t.team) return;
  for (const m of t.team) m.item = null;
  if (!itemsOn()) return;
  let n = t.team.length;
  if (t.role === 'leader') { const gi = S.gyms.findIndex(g => g.leader === t.id); n = gi < 3 ? 0 : Math.min(t.team.length, gi - 2); }
  const keys = Object.keys(ITEMS).filter(k => k !== 'luckyegg' && k !== 'soothebell' && k !== 'everstone');
  const order = t.team.slice().sort((a, b) => b.lvl - a.lvl || SP[b.sp].bst - SP[a.sp].bst).slice(0, n);
  const held = new Set();
  for (const m of order) {
    const best = keys.filter(k => ITEMS[k].type || !held.has(k)).map(k => [k, itemScore(m, k, t)]).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1])[0];
    if (best) { m.item = best[0]; held.add(best[0]); }
  }
}
// a random item of up to this tier (rarer tiers less often)
function rollItem(maxTier, notType) {
  const keys = Object.keys(ITEMS).filter(k => ITEMS[k].tier <= maxTier && ITEMS[k].type !== notType);
  const w = k => ITEMS[k].type ? 0.35 : ITEMS[k].tier === 1 ? 2 : ITEMS[k].tier === 2 ? 1.4 : 1;
  let r = rand() * keys.reduce((a, k) => a + w(k), 0);
  for (const k of keys) { r -= w(k); if (r <= 0) return k; }
  return keys[keys.length - 1];
}
// beating a gym: pick one of three (that gym's type item plus two others; rarer items at later gyms)
function gymItemOffer(t, g, leader) {
  if (!itemsOn()) return;
  const tier = g < 3 ? 1 : g < 6 ? 2 : 3;
  const opts = [];
  const ty = leader && leader.specialty; if (ty && TYPE_ITEMS[ty]) opts.push('tb' + ty);
  let guard = 0; while (opts.length < 3 && guard++ < 30) { const k = rollItem(tier, ty); if (!opts.includes(k)) opts.push(k); }
  if (t.user) { (t.itemOffers = t.itemOffers || []).push({ opts, from: `${TOWNS[g]} Gym`, season: S.season }); return; }
  const best = opts.slice().sort((a, b) => itemGain(t, b) - itemGain(t, a))[0];
  bagAdd(t, best); autoEquip(t);
}
// the player's pick from a gym reward (i = null takes the first, as when simming)
function takeItemOffer(id, i) {
  const t = T(id); if (!t || !(t.itemOffers || []).length) return null;
  const o = t.itemOffers.shift();
  const k = i == null ? o.opts.slice().sort((a, b) => itemGain(t, b) - itemGain(t, a))[0] : o.opts[i];
  bagAdd(t, k);
  if (!t.itemsManual) autoEquip(t);
  return k;
}
function settleItemOffers(t) { while ((t.itemOffers || []).length) takeItemOffer(t.id, null); }
// exploring sometimes turns up an item
const ITEM_FIND = 0.06;
function exploreFind(t) {
  // a Pokémon with Pickup doubles the chance
  // (Run Away: 1.5x)
  if (!itemsOn() || rand() >= ITEM_FIND * (t.team.some(m => abilityOf(m) === 'Pickup') ? 2 : t.team.some(m => abilityOf(m) === 'Run Away') ? 1.5 : 1)) return null;
  const k = rollItem(S.week >= 16 ? 3 : S.week >= 8 ? 2 : 1);
  bagAdd(t, k); if (!t.itemsManual) autoEquip(t);
  return k;
}
// the player sets an item by hand: k from the bag (null takes the item off)
function setItem(id, uid, k) {
  const t = T(id); if (!t) return; const m = t.team.find(x => x.uid === uid); if (!m) return;
  t.bag = t.bag || [];
  if (k != null) { const i = t.bag.indexOf(k); if (i < 0) return; t.bag.splice(i, 1); }
  if (m.item) t.bag.push(m.item);
  m.item = k || null; t.itemsManual = true; trimBag(t);
}
// v181: what each gym-reward option would do for the team, so the best pick is marked without checking the bag.
// For each option: gain (team value it adds), who would hold it in the best set, and a short reason.
function offerAdvice(t, opts) {
  const pool = heldPool(t), team = t.team || [];
  const out = opts.map(k => {
    const gain = itemGain(t, k);
    const { pick } = bestItemPlan(team, pool.concat([k]), t);
    const r = pick.indexOf(pool.length), holder = r >= 0 ? team[r] : null;
    let note;
    if (gain < 0.05) note = !ITEMS[k].type && pool.includes(k) ? 'You already have one' : 'No one on the team can use it';
    else note = holder ? `Best on ${holder.sp}` : 'A small upgrade';
    return { k, gain, note, useless: gain < 0.05 };
  });
  let bi = -1; out.forEach((o, i) => { if (!o.useless && (bi < 0 || o.gain > out[bi].gain)) bi = i; });
  if (bi >= 0) out[bi].best = true;
  return out;
}
// how much the items currently held are worth vs. the best possible set from everything owned
function itemSetGap(t) {
  const now = (t.team || []).reduce((a, m) => a + (m.item ? Math.max(0, itemScore(m, m.item, t)) : 0), 0);
  return teamItemValue(t, heldPool(t)) - now;
}

// ================= POKÉMON STATS =================
// st = career on this trainer's team, ss = current season (reset each season). League-wide species totals live in S.dex.
const blankStat = () => ({ b: 0, w: 0, l: 0, ko: 0, f: 0, dmg: 0, gw: 0, gl: 0, lw: 0, ll: 0, lead: 0 });
function addStat(st, r, won, stakes) {
  st.b++; st.ko += r.ko; st.f += r.f; st.dmg += r.dmg; if (r.lead) st.lead = (st.lead || 0) + 1;
  if (won) { st.w++; if (stakes === 'gym') st.gw++; else if (stakes !== 'rival' && stakes !== 'raid' && stakes !== 'tourney') st.lw++; } else { st.l++; if (stakes === 'gym') st.gl++; else if (stakes !== 'rival' && stakes !== 'raid' && stakes !== 'tourney') st.ll++; }
}
function monSeason(m) { if (!m.ss || m.ss.season !== S.season) m.ss = Object.assign(blankStat(), { season: S.season }); return m.ss; }
function trainerRec(t) { return t.rec = t.rec || { w: 0, l: 0, gw: 0, gl: 0, lw: 0, ll: 0, tw: 0, tl: 0 }; }
// ---------- rivalries ----------
// every pairing keeps a head-to-head record. Close, repeated meetings make two trainers Rivals;
// losing to the same trainer again and again, without a win, makes them a Nemesis.
const RIVAL_MEETINGS = 4, NEMESIS_LOSSES = 5, NEMESIS_SEASONS = 2;
const h2hOf = (t, o) => (t.h2h && t.h2h[o.id]) || { w: 0, l: 0 };
const isRival = (t, o) => !!(t && o && t.rival === o.id);
function headToHead(t, o, won, stakes) {
  const h = (t.h2h = t.h2h || {})[o.id] = t.h2h[o.id] || { w: 0, l: 0 };
  h[won ? 'w' : 'l']++; h.last = S.season;
  if (!won && !(h.ls || []).includes(S.season)) (h.ls = h.ls || []).push(S.season);
  if (won && t.nemesis === o.id) {
    t.nemesis = null; t.nemesisBeaten = (t.nemesisBeaten || 0) + 1;
    news(`${dn(t)} finally beat their nemesis ${dn(o)}, after ${h.l} straight losses!`, t.user ? 'you' : 'circuit', t.id);
  }
  // only a challenger gets a nemesis, and only after losing to them across more than one season
  if (!won && t.role === 'challenger' && h.w === 0 && h.l >= NEMESIS_LOSSES && (h.ls || []).length >= NEMESIS_SEASONS && t.nemesis !== o.id && !isRival(t, o)) {
    t.nemesis = o.id;
    news(`${dn(t)} has lost to ${dn(o)} ${h.l} times without a win. ${o.name} has become their nemesis.`, t.user ? 'you' : 'circuit', t.id);
  }
  // rivalries grow out of road battles between challengers. Checked once, from the winner's side.
  if (won && stakes === 'rival') maybeRivals(t, o);
}
function maybeRivals(a, b) {
  if (isRival(a, b)) return;
  const h = h2hOf(a, b), n = h.w + h.l;
  if (n < RIVAL_MEETINGS || Math.min(h.w, h.l) < 1 || Math.abs(h.w - h.l) > 2) return;
  // a trainer swaps rivals only for a pairing with more history
  const meet = (t) => { const r = t.rival && T(t.rival); return r && r.role !== 'retired' ? h2hOf(t, r).w + h2hOf(t, r).l : 0; };
  if (meet(a) >= n || meet(b) >= n) return;
  for (const [x, y] of [[a, b], [b, a]]) { const old = x.rival && T(x.rival); if (old && old.rival === x.id) old.rival = null; x.rival = y.id; if (x.nemesis === y.id) x.nemesis = null; }
  news(`A rivalry is born: ${dn(a)} and ${dn(b)} have met ${n} times (${h.w}–${h.l}).`, a.user || b.user ? 'you' : 'circuit', a.id);
}
// ---------- road trades ----------
// Now and then two challengers who meet on the road swap one Pokémon each, when it suits both: usually each gives up
// one outside their own type that fits the other. Special Pokémon are never traded. Trade-evolution Pokémon evolve on the spot.
const TRADE_CHANCE = 0.04;
const TRADE_EVOS = { Kadabra: 'Alakazam', Machoke: 'Machamp', Graveler: 'Golem', Haunter: 'Gengar', Boldore: 'Gigalith', Gurdurr: 'Conkeldurr', Phantump: 'Trevenant', Pumpkaboo: 'Gourgeist', Karrablast: 'Escavalier', Shelmet: 'Accelgor', 'Alolan Graveler': 'Alolan Golem' };
// how much a trainer would want this Pokémon: fits their type, and how strong it is
const tradeWant = (t, m) => monPower(m) * (specFit(t, m.sp) === 2 ? 1.5 : onSpec(t, m.sp) ? 1.35 : 1) * (TRADE_EVOS[m.sp] ? 1.15 : 1);
// the best swap two trainers could make, or null: each must come out ahead, and the Pokémon must be of similar strength
function findTrade(a, b) {
  const tradable = t => t.team.filter(m => !isSpecial(m) && !(t.mega && t.mega.uid === m.uid && hasMega(t)) && t.team.length > 1);
  let best = null;
  for (const x of tradable(a)) for (const y of tradable(b)) {
    if (LINE[x.sp] === LINE[y.sp] || b.team.some(m => LINE[m.sp] === LINE[x.sp]) || a.team.some(m => LINE[m.sp] === LINE[y.sp])) continue;
    const r = monPower(x) / Math.max(1, monPower(y)); if (r < 0.8 || r > 1.25) continue;
    const gainA = tradeWant(a, y) - tradeWant(a, x), gainB = tradeWant(b, x) - tradeWant(b, y);
    if (gainA <= 0.5 || gainB <= 0.5) continue;
    const score = Math.min(gainA, gainB);
    if (!best || score > best.score) best = { give: x.uid, get: y.uid, score };
  }
  return best;
}
function doTrade(a, b, giveUid, getUid) {
  const x = a.team.find(m => m.uid === giveUid), y = b.team.find(m => m.uid === getUid);
  if (!x || !y) return null;
  const lucky = [];
  const move = (m, from, to) => {
    from.team = from.team.filter(z => z !== m);
    (m.trades = m.trades || []).push({ from: from.id, to: to.id, season: S.season, week: S.week + 1 });
    m.met = { how: 'traded', season: S.season, week: S.week + 1, from: from.id };
    delete m.bond;
    if (!isTemper(m, 'Docile')) m.fr = Math.max(70, Math.round((m.fr ?? 70) * 0.5));
    if (isTemper(m, 'Lonely')) m.sulk = 4; // v197: weeks of sulking after leaving its trainer
    // a Lucky Pokémon: some arrive from a trade with boosted IVs, and level a little faster from then on
    if (featOn('lucky') && !m.lucky && !isSpecial(m) && rand() < LUCKY_CHANCE) {
      ensureMon(m); m.lucky = true;
      for (const k of Object.keys(m.iv)) if (m.iv[k] < LUCKY_IV) m.iv[k] = ri(LUCKY_IV, 31);
      lucky.push([to, m]);
    }
    const was = m.sp, evo = TRADE_EVOS[m.sp];
    if (evo && SP[evo]) { m.sp = evo; (m.evoLog = m.evoLog || []).push({ from: was, to: evo, lvl: Math.floor(m.lvl), season: S.season || 1, trade: true }); }
    to.team.push(m);
    return evo && SP[evo] ? `${was}, which evolved into ${evo}` : was;
  };
  const toB = move(x, a, b), toA = move(y, b, a);
  a.career.trades = (a.career.trades || 0) + 1; b.career.trades = (b.career.trades || 0) + 1;
  news(`Trade on the road: ${dn(a)} sent ${toB} to ${dn(b)} for ${toA}.`, a.user || b.user ? 'you' : 'circuit', a.id);
  for (const [t, m] of lucky) { t.career.lucky = (t.career.lucky || 0) + 1; catchNews(`Lucky trade! The ${m.sp} ${dn(t)} received arrived as a Lucky Pokémon, with boosted IVs.`, t.user ? 'you' : 'circuit', t.id); }
  return { a: toA, b: toB, lucky: lucky.map(([t, m]) => m.sp) };
}
// each week: a few pairs of challengers meet and see if a swap suits them both. Your trainers get an offer to accept or decline.
function roadTrades() {
  S.tradeOffers = {};
  if (!featOn('trades')) return;
  const pool = challengers().filter(t => t.team.length >= 2);
  const done = new Set();
  for (const t of shuffle(pool.slice())) {
    if (done.has(t.id) || rand() >= TRADE_CHANCE) continue;
    const others = shuffle(pool.filter(o => o !== t && !done.has(o.id)));
    for (const o of others.slice(0, 6)) {
      const tr = findTrade(t, o); if (!tr) continue;
      done.add(t.id); done.add(o.id);
      if (t.user || o.user) {
        const me = t.user ? t : o, them = t.user ? o : t;
        S.tradeOffers[me.id] = { with: them.id, give: t.user ? tr.give : tr.get, get: t.user ? tr.get : tr.give };
        news(`${dn(them)} ran into ${dn(me)} on the road and offered a trade.`, 'you', me.id);
      } else doTrade(t, o, tr.give, tr.get);
      break;
    }
  }
}
// the player's answer to a trade offer this week
function answerTrade(id, accept) {
  const o = S.tradeOffers && S.tradeOffers[id]; if (!o) return null;
  delete S.tradeOffers[id];
  const me = T(id), them = T(o.with);
  if (!accept || !me || !them) { if (me && them) news(`${dn(me)} turned down ${dn(them)}'s trade.`, 'you', me.id); return null; }
  return doTrade(me, them, o.give, o.get);
}
// ---------- Battle Bond ----------
// Like Ash-Greninja: a Pokémon that's been with its trainer for 4+ seasons at max friendship can form a bond (one per
// trainer, Elite Four and Champions included). In League battles, after its first knockout it transforms into
// "<Trainer>-<Species>" for the rest of the battle: +35% attack and +8% speed, same HP, defense and types. If it
// faints while transformed, the rest of the team falters (their damage drops 6% for that battle).
const BOND_SEASONS = 4, BOND_WEEKLY = 0.006, BOND_FR = 255, BOND_ATK = 1.35, BOND_SPE = 1.08, BOND_PAIN = 0.94;
// only trainers who fight League battles form bonds (Gym Leaders never use one)
const BOND_ROLES = ['challenger', 'e4', 'champion'];
// cover legendaries, and legendaries at their power level (BST 660+), never form a Battle Bond
const BOND_COVER = ['Zygarde', 'Necrozma'];
const bondBlocked = sp => !!(SP[sp] && SP[sp].legend && (SP[sp].bst >= 660 || BOND_COVER.includes(sp) || SP[sp].glitch));
const bondMon = t => (t && t.team ? t.team.find(m => m.bond === t.id && !bondBlocked(m.sp)) : null) || null;
const bondName = (t, m) => `${firstName(t.name)}-${m.sp}`;
function checkBonds() {
  for (const t of leagueTrainers()) {
    if (!BOND_ROLES.includes(t.role) || !t.team || !t.team.length) continue;
    // a bond breaks if the partner changes hands or evolves into a cover-level legendary (Cosmog into Solgaleo, say)
    for (const m of t.team) if (m.bond && (m.bond !== t.id || bondBlocked(m.sp))) delete m.bond;
    if (bondMon(t)) continue;
    const c = t.team.filter(m => !bondBlocked(m.sp) && !m.shadow && (m.fr ?? 70) >= BOND_FR && m.met && S.season - m.met.season >= BOND_SEASONS);
    // even once they qualify, a bond takes its time: a small chance each week (roughly 13% a season)
    if (!c.length || !featOn('bond') || rand() >= BOND_WEEKLY) continue;
    const m = c.sort((a, b) => a.met.season - b.met.season || monPower(b) - monPower(a))[0];
    m.bond = t.id; t.career.bonds = (t.career.bonds || 0) + 1;
    news(`${dn(t)} and ${m.sp} now share a Battle Bond. In League battles, its first knockout turns it into ${bondName(t, m)}.`, t.user ? 'you' : 'circuit', t.id);
  }
}
// ---------- Lucky Pokémon ----------
const LUCKY_CHANCE = 0.2, LUCKY_IV = 24, LUCKY_GROWTH = 1.1;
// ---------- Pokérus ----------
// A rare virus. An exploring trainer's Pokémon sometimes picks it up; it spreads to teammates week by week and
// to the other side in any battle (and travels with a traded Pokémon). While infected (4 weeks) a Pokémon levels
// 25% faster; afterwards it's cured and immune for good. m.pkrs: weeks left (>0), -1 cured, unset never had it.
const PKRS_SPAWN = 0.06, PKRS_WEEKS = 4, PKRS_TEAM = 0.3, PKRS_CONTACT = 0.15, PKRS_GROWTH = 1.25;
const pkrsActive = m => m.pkrs > 0;
const monGrowth = m => (m.pkrs > 0 ? PKRS_GROWTH : 1) * (m.lucky ? LUCKY_GROWTH : 1) * (heldItem(m) === 'luckyegg' ? 1.15 : 1);
function infectPkrs(t, m, extra = 0) { m.pkrs = PKRS_WEEKS + extra; t.career.pkrs = (t.career.pkrs || 0) + 1; S.pkrsSeason = (S.pkrsSeason || 0) + 1; }
// any battle: a team carrying Pokérus can pass it to one Pokémon on the other side
function pkrsContact(a, b) {
  if (!a || !b || !a.team || !b.team) return;
  for (const [x, y] of [[a, b], [b, a]]) {
    if (!x.team.some(pkrsActive) || rand() >= PKRS_CONTACT) continue;
    const open = y.team.filter(m => !m.pkrs); if (!open.length) continue;
    const fresh = !y.team.some(pkrsActive);
    const m = pick(open); infectPkrs(y, m, 1);
    if (fresh && (y.user || x.user || rand() < 0.35)) catchNews(`Pokérus spread from ${dn(x)}'s team to ${dn(y)}'s ${m.sp}.`, y.user ? 'you' : 'circuit', y.id);
  }
}
function pokerusWeek() {
  const active = leagueTrainers().filter(t => t.role !== 'retired' && t.team && t.team.length);
  for (const t of active) {
    const n = t.team.filter(pkrsActive).length; if (!n) continue;
    for (const m of t.team) if (!m.pkrs && rand() < 1 - Math.pow(1 - PKRS_TEAM, n)) infectPkrs(t, m, 1);
  }
  for (const t of active) for (const m of t.team) if (m.pkrs > 0 && --m.pkrs === 0) m.pkrs = -1;
  if (featOn('pokerus') && rand() < PKRS_SPAWN) {
    const ex = challengers().filter(t => { const e = t.weekLog[t.weekLog.length - 1]; return e && e.wk === S.week + 1 && e.act === 'explore' && t.team.some(m => !m.pkrs); });
    if (ex.length) { const t = pick(ex), m = pick(t.team.filter(m => !m.pkrs)); infectPkrs(t, m); catchNews(`Pokérus! ${dn(t)}'s ${m.sp} picked it up while exploring. It levels faster for a few weeks, and it's catching.`, t.user ? 'you' : 'circuit', t.id); }
  }
}
// road battles: challengers run into each other between gyms, like rival battles in the games
const ROAD_CHANCE = 0.08;
function roadBattles() {
  if (!featOn('road')) return;
  const done = new Set();
  const pool = challengers().filter(t => t.team.length >= 2);
  for (const t of shuffle(pool.slice())) {
    if (done.has(t.id)) continue;
    const comp = hasTrait(t, 'competitor');
    if (rand() >= ROAD_CHANCE * (comp ? 2 : 1)) continue;
    const ok = o => o.id !== t.id && !done.has(o.id) && o.team.length >= 2 && (!t.org || o.org !== t.org);
    const rival = t.rival && T(t.rival);
    let foe = rival && rival.role === 'challenger' && inLg(rival) && ok(rival) && rand() < (comp ? 0.75 : 0.5) ? rival : null;
    if (!foe) { const near = pool.filter(o => ok(o) && Math.abs(o.badges.length - t.badges.length) <= 1); if (near.length) foe = pick(near); }
    if (!foe) continue;
    done.add(t.id); done.add(foe.id);
    const rivals = isRival(t, foe);
    const res = battle(t, foe, 'rival', `${rivals ? 'Rival battle' : 'Road battle'} · ${dn(foe)}`);
    const w = res.winner === 0 ? t : foe, l = w === t ? foe : t;
    for (const x of [t, foe]) { const e = x.weekLog[x.weekLog.length - 1]; if (e) e.road = { vs: (x === t ? foe : t).id, won: x === w, rival: rivals }; }
    if (t.user || foe.user) S.lastBattles.push(res);
    if (rivals) { const h = h2hOf(w, l); news(`Rival battle: ${dn(w)} beat ${dn(l)} on the road. Their rivalry stands at ${h.w}–${h.l}.`, t.user || foe.user ? 'you' : 'circuit', w.id); weald(w); }
    else if (t.user || foe.user) news(`Road battle: ${dn(w)} beat ${dn(l)}.`, 'you', w.id);
  }
}
function recordBattle(trainers, tally, winner, stakes) {
  S.dex = S.dex || {}; S.dexSeason = S.dexSeason || {};
  pkrsContact(trainers[0], trainers[1]);
  trainers.forEach((t, si) => {
    // every battle counts toward the trainer's record, whichever side they were on
    const r = trainerRec(t), won = winner === si;
    r[won ? 'w' : 'l']++;
    stormWin(t, won, tally[si].reduce((a, x) => a + x.ko, 0));
    // win streaks, every kind of battle counted
    r.cs = won ? (r.cs || 0) + 1 : 0;
    if (won && r.cs === 1) r.csFrom = S.season || 1;
    if (r.cs > (r.bs || 0)) { r.bs = r.cs; r.bsFrom = r.csFrom || S.season || 1; r.bsTo = S.season || 1; }
    // losing streaks, for the Hall of Shame
    r.cl = won ? 0 : (r.cl || 0) + 1;
    if (!won && r.cl === 1) r.clFrom = S.season || 1;
    if (r.cl > (r.wl || 0)) { r.wl = r.cl; r.wlFrom = r.clFrom || S.season || 1; r.wlTo = S.season || 1; }
    const k = stakes === 'gym' ? 'g' : stakes === 'title' ? 't' : stakes === 'rival' ? 'r' : stakes === 'raid' ? 'v' : stakes === 'tourney' ? 'm' : 'l';
    r[k + (won ? 'w' : 'l')] = (r[k + (won ? 'w' : 'l')] || 0) + 1;
    if (stakes !== 'raid' && t.role !== 'villain' && trainers[1 - si].role !== 'villain') headToHead(t, trainers[1 - si], won, stakes);
    tally[si].forEach((r, i) => {
      if (!r.out) return;
      const m = t.team[i]; if (!m) return;
      const won = winner === si;
      addStat(m.st = m.st || blankStat(), r, won, stakes);
      // a Pokémon's win streak: consecutive battles it took part in that its side won
      m.st.cs = won ? (m.st.cs || 0) + 1 : 0;
      if (m.st.cs > (m.st.bs || 0)) m.st.bs = m.st.cs;
      m.st.cl = won ? 0 : (m.st.cl || 0) + 1;
      if (m.st.cl > (m.st.wl || 0)) m.st.wl = m.st.cl;
      addStat(monSeason(m), r, won, stakes);
      addStat(S.dex[m.sp] = S.dex[m.sp] || blankStat(), r, won, stakes);
      addStat(S.dexSeason[m.sp] = S.dexSeason[m.sp] || blankStat(), r, won, stakes);
      if (won && r.ko >= 3) m.best = Math.max(m.best || 0, r.ko);
      // a 6-0 sweep: this one Pokémon knocked out all six of the opponent's
      if (won && r.ko >= 6) m.sweeps = (m.sweeps || 0) + 1;
      if (r.mega) { m.megas = (m.megas || 0) + 1; t.career.megaEvos = (t.career.megaEvos || 0) + 1; }
      if (r.bond) { m.bonds = (m.bonds || 0) + 1; t.career.bondForms = (t.career.bondForms || 0) + 1; }
      // friendship grows with time in battle, faster for trainers with a high Bond rating
      if (m.shadow) openHeart(t, m, HEART_BATTLE);
      else m.fr = Math.min(255, (m.fr ?? 70) + Math.round((2 + (won ? 2 : 0)) * (0.5 + t.r.bnd / 100) * (heldItem(m) === 'soothebell' ? 1.5 : 1) * temperFr(m)));
      // form: wins and knockouts heat a Pokémon up, fainting cools it down, with some drift
      const tr = traitOf(t), swing = tr === 'streaky' ? 1.5 : tr === 'steady' ? 0.5 : 1;
      // v197: Bold shrugs off a loss, Careful cools half as much from fainting, Hardy never runs hot or cold
      const bold = isTemper(m, 'Bold') && !won, careful = isTemper(m, 'Careful') ? 0.5 : 1;
      const delta = ((won ? 0.35 : bold ? 0 : -0.35) + r.ko * 0.3 - r.f * 0.35 * careful + (rand() - 0.5) * 0.5) * swing - (tr === 'hothead' && !won && !bold ? 0.3 : 0);
      m.form = isTemper(m, 'Hardy') ? 0 : clamp((m.form || 0) * 0.92 + delta, -3, 3);
    });
  });
}
// where a Pokémon came from, shown on its stat card
const FR_START = { starter: 120, caught: 50, gift: 90, assigned: 100 };
function stamp(m, how) { if (!m.metFr) { m.fr = FR_START[how] ?? m.fr; m.metFr = 1;  } if (!m.met) m.met = S.phase === 'season' || S.phase === 'league' ? { how, season: S.season, week: S.week + 1 } : { how, season: S.season + 1, week: 1 }; return m; }
// keep a record of Pokémon that leave a trainer's team after they've battled
function farewell(t, m, why) {
  // a released Pokémon's held item goes back in the bag
  if (m && m.item && t && t.team && t.team.includes(m)) { bagAdd(t, m.item); m.item = null; }
  if (m && m.partners && isLegendLine(m.sp) && t && t.id != null && S.trainers[t.id]) {
    releaseLegend(t, m, why);
    const p = m.partners.find(x => x.id === t.id && x.to != null && x.why === why);
    if (p && p.st && p.st.b) { t.alumni = t.alumni || []; t.alumni.unshift({ uid: m.uid, sp: m.sp, lvl: Math.floor(m.lvl), st: Object.assign(blankStat(), p.st), met: m.met, left: S.season || 1, why, nat: m.nat, iv: m.iv, fr: m.fr, cov: m.cov, legendRef: true, shiny: m.shiny }); }
    return;
  }
  if (!m || !m.st || !m.st.b) return;
  t.alumni = t.alumni || [];
  t.alumni.unshift({ uid: m.uid, sp: m.sp, lvl: Math.floor(m.lvl), st: m.st, met: m.met, left: S.season || 1, why, nat: m.nat, iv: m.iv, fr: m.fr, cov: m.cov, abSlot: m.abSlot, deltaAb: m.deltaAb, evoLog: m.evoLog, best: m.best, sweeps: m.sweeps, megas: m.megas, bonds: m.bonds, awards: m.awards, alpha: m.alpha, shiny: m.shiny, delta: m.delta, lucky: m.lucky, pkrs: m.pkrs });
  // keep the Pokémon that made a mark (3+ battles, up to 25) and the five most recent others
  if (t.alumni.length > 12) { let quiet = 0, kept = 0; t.alumni = t.alumni.filter(a => (a.st && a.st.b >= 3) ? ++kept <= 25 : ++quiet <= 5); }
}

