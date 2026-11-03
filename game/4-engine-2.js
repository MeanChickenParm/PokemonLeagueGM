// ================= LEGENDARY PARTNERS (v166) =================
// A legendary or mythical Pokémon is nobody's for good. It stays with a trainer for 3–5 seasons (rolled when it
// joins; a baby legendary counts from its catch), then moves on in the offseason. Between partners it waits in
// the League where it was first found (S.legendPool, one per League), keeping its lifetime stats, awards and IVs.
// The next trainer to find it, catch it or be given it gets that same Pokémon, at their own level. A legendary
// never goes back to a trainer it has already been with. Ultra Beasts and Paradox Pokémon are not covered.
const LEGEND_TENURE = [3, 5];
// v184: Missingno stays longer, and can glitch away mid-season
const GLITCH_TENURE = [6, 10], GLITCH_CHANCE = 0.0005, GLITCH_LEAVE = 0.001;
const LEG_UB_LINES = new Set(BABY_LEGENDS.filter(b => { const q = [b]; while (q.length) { const n = q.shift(); if (SP[n].ub || ULTRA_BEASTS.includes(n)) return true; for (const e of SP[n].evos || []) q.push(e.to); } return false; }));
function isLegendLine(sp) {
  const s = SP[sp]; if (!s || s.ub || s.paradox || ULTRA_BEASTS.includes(sp)) return false;
  if (s.legend) return true;
  const b = LINE[sp] || sp;
  return BABY_LEGENDS.includes(b) && !LEG_UB_LINES.has(b) && SP[b].label !== 'One of a kind';
}
const legendPool = () => S.legendPool || (S.legendPool = []);
const lineOf = sp => LINE[sp] || sp;
// the individual of this line waiting in the bound League (the most experienced, should there ever be two)
function pooledLegend(sp) { const b = lineOf(sp); return legendPool().filter(m => lineOf(m.sp) === b).sort((x, y) => ((y.st && y.st.b) || 0) - ((x.st && x.st.b) || 0))[0] || null; }
const wasPartner = (t, m) => !!(t && m && (m.partners || []).some(p => p.id === t.id));
// a legendary never chooses the same trainer twice
// v194: or it's banned in the trainer's League
const legendBlocked = (t, sp) => (isLegendLine(sp) && wasPartner(t, pooledLegend(sp))) || bannedIn(sp, lgOf(t));
// v184: one legendary at a time. A trainer who already holds a legendary (or has one on its way to them) is passed over by
// any legendary that chooses, and can take part in a contested event (encounter, storm, roamer, rare find) but not win it.
function legendFull(t) {
  if (!t || !t.team) return false;
  if (t.team.some(m => isLegendLine(m.sp))) return true;
  if ((S.legendGifts || []).some(g => g.id === t.id)) return true;
  return !!(S.legendOffers && S.legendOffers[t.id]);
}
const statSnap = m => { const x = m.st || {}; return { b: x.b || 0, w: x.w || 0, l: x.l || 0, ko: x.ko || 0 }; };
// a legendary-line Pokémon joins t: if this League's one is waiting, t gets that one (same Pokémon, t's level and
// the joining details of `fresh`); otherwise `fresh` itself starts its story. Returns the Pokémon to put on the team.
function claimLegend(t, fresh) {
  if (!fresh || !isLegendLine(fresh.sp)) return fresh;
  let m = fresh;
  const p = pooledLegend(fresh.sp);
  if (p && !wasPartner(t, p)) {
    S.legendPool = legendPool().filter(x => x !== p);
    m = p;
    m.lvl = fresh.lvl; m.met = fresh.met; m.metFr = fresh.metFr; m.fr = fresh.fr; m.gift = fresh.gift; m.cap = fresh.cap;
    m.form = 0; m.ss = null; m.item = null; delete m.bond;
    if (fresh.shadow) makeShadow(m); else delete m.shadow;
    if (fresh.wormhole) m.wormhole = true;
    refreshMoves(m);
  }
  if (m.lgHome == null) m.lgHome = S.lg || 0;
  const n = isGlitch(m.sp) ? ri(GLITCH_TENURE[0], GLITCH_TENURE[1]) : ri(LEGEND_TENURE[0], LEGEND_TENURE[1]);
  m.leg = { until: curSeason() + n - 1, n };
  (m.partners = m.partners || []).push({ id: t.id, name: dn(t), from: curSeason(), to: null, at: statSnap(m) });
  if (m !== fresh && m.partners.length > 1) news(`${m.sp} has a new partner: ${dn(t)}. It was last with ${m.partners[m.partners.length - 2].name}.`, t.user ? 'you' : 'title', t.id);
  return m;
}
// a legendary leaves t (moved on, released, or its trainer retired): it goes back to the League it was first found in
function releaseLegend(t, m, why) {
  if (!m || !isLegendLine(m.sp) || !m.partners) return false;
  const p = m.partners.find(x => x.id === t.id && x.to == null);
  if (p) { p.to = S.season || 1; const now = statSnap(m); p.st = { b: now.b - p.at.b, w: now.w - p.at.w, l: now.l - p.at.l, ko: now.ko - p.at.ko }; p.why = why; }
  if (t.mega && t.mega.uid === m.uid) t.mega.uid = null;
  m.leg = null; m.cap = null; m.gift = null;
  const home = m.lgHome != null && m.lgHome < nLeagues() ? m.lgHome : homeLeague(t);
  inLeague(home, () => { if (!legendPool().includes(m)) legendPool().push(m); });
  return true;
}
// offseason: legendaries whose time is up move on (never leaving a trainer with no Pokémon)
function legendDepartures() {
  for (const t of Object.values(S.trainers)) {
    if (['retired', 'prospect'].includes(t.role)) continue;
    for (const m of t.team.slice()) {
      if (!m.leg || m.leg.until > S.season || !isLegendLine(m.sp)) continue;
      if (t.team.length <= 1) { m.leg.until = S.season + 1; continue; }
      const seasons = (S.season || 1) - ((m.partners || []).slice(-1)[0] || { from: S.season }).from + 1;
      farewell(t, m, `moved on after ${seasons} season${seasons === 1 ? '' : 's'}`);
      t.team = t.team.filter(x => x !== m);
      inLeague(homeLeague(t), () => news(`${m.sp} moved on from ${dn(t)} after ${seasons} season${seasons === 1 ? '' : 's'} together. It will wait in the ${leagueName(m.lgHome ?? (S.lg || 0))} for a new partner.`, t.user ? 'you' : 'title', t.id));
      if (['leader', 'e4', 'champion'].includes(t.role)) inLeague(lgOf(t), () => backfillElite(t, m));
    }
  }
}
// v173: when a legendary leaves a Gym Leader, an Elite Four member or the Champion, the empty spot goes to one of
// that trainer's own former Pokémon: first one set aside on their bench, then one from their former Pokémon list
// (left behind on promotion, swapped out, released…) that isn't on anyone's team now and isn't a legendary.
// On-type Pokémon and ones with a longer record come first; nothing from the same evolution line as a teammate.
// Only if they've never had another Pokémon does the League assign a new one, as before.
function backfillElite(t, gone) {
  const slot = eliteSlot(t); if (!slot) return;
  const onTeam = new Set(); for (const x of Object.values(S.trainers)) for (const m of x.team || []) onTeam.add(m.uid);
  while (t.team.length < slot.size) {
    const lines = new Set(t.team.map(m => LINE[m.sp]));
    const fits = sp => SP[sp] && !lines.has(LINE[sp]) && !isLegendLine(sp) && !SP[sp].legend && !SP[sp].ub && !bannedIn(sp, S.lg || 0);
    const score = (sp, st, left) => (onSpec(t, sp) ? 1000 : 0) + Math.min(200, (st && st.b) || 0) + (left || 0) / 100 + SP[sp].bst / 1000;
    let back = null, how = '';
    const bench = (t.bench || []).filter(m => fits(m.sp));
    if (bench.length) {
      back = bench.sort((a, b) => score(b.sp, b.st) - score(a.sp, a.st))[0];
      t.bench = t.bench.filter(m => m !== back); how = 'bench';
    } else {
      const al = (t.alumni || []).filter(a => !a.legendRef && a.uid != null && !onTeam.has(a.uid) && fits(a.sp));
      const a = al.sort((x, y) => score(y.sp, y.st, y.left) - score(x.sp, x.st, x.left))[0];
      if (a) {
        back = { uid: a.uid, sp: a.sp, lvl: a.lvl || slot.lvl, st: a.st || blankStat(), met: a.met, nat: a.nat, iv: a.iv, fr: Math.max(a.fr || 70, 120), cov: a.cov, abSlot: a.abSlot, deltaAb: a.deltaAb,
          evoLog: a.evoLog, best: a.best, sweeps: a.sweeps, megas: a.megas, bonds: a.bonds, awards: a.awards, alpha: a.alpha, shiny: a.shiny, delta: a.delta, lucky: a.lucky, pkrs: a.pkrs };
        for (const k of Object.keys(back)) if (back[k] === undefined) delete back[k];
        ensureMon(back);
        t.alumni = t.alumni.filter(x => x !== a); how = a.why ? `(${a.why} in Season ${a.left})` : '';
      }
    }
    if (back) {
      back.rejoined = (back.rejoined || []).concat({ season: curSeason(), for: gone.sp });
      onTeam.add(back.uid); t.team.push(back);
      news(`${back.sp} is back on ${dn(t)}'s team, taking the spot ${gone.sp} left${how === 'bench' ? ' (it had been set aside)' : how ? ' ' + how : ''}.`, t.user ? 'you' : 'move', t.id);
    } else {
      const fresh = buildEliteTeam(t.specialty, slot.lvl, 4, t.role === 'champion').filter(m => !lines.has(LINE[m.sp]))[0];
      if (!fresh) break;
      stamp(fresh, 'assigned'); t.team.push(fresh);
      news(`${dn(t)} had no former Pokémon to bring back, so the League assigned ${fresh.sp} to fill the spot ${gone.sp} left.`, t.user ? 'you' : 'move', t.id);
    }
  }
  relevelElite(t);
}
// saves from before v166: legendaries already on teams get 1–3 more seasons and their current partner on record
function adoptLegends() {
  if (!S || !S.trainers) return;
  for (const t of Object.values(S.trainers)) {
    if (['retired', 'prospect'].includes(t.role)) continue;
    for (const m of t.team) {
      if (!isLegendLine(m.sp) || m.partners) continue;
      m.lgHome = homeLeague(t);
      const n = ri(1, 3);
      m.leg = { until: (S.season || 0) + n, n, adopted: true };
      m.partners = [{ id: t.id, name: dn(t), from: (m.met && m.met.season) || S.season || 1, to: null, at: { b: 0, w: 0, l: 0, ko: 0 } }];
    }
  }
}

// ================= SEASON =================
function gymAceLevel(i) { const t = T(S.gyms[i].leader); return Math.max(...t.team.map(m => m.lvl)); }
function challengers() { return S.challengers.map(T); }

const SHINY_CHANCE = 0.004; // per wild Pokémon offered
// v183: a wild Shadow Pokémon, as rare as a shiny (Cipher getting away makes them far more common for the season)
const SHADOW_CHANCE = 0.004;
// Delta Pokémon: rarer than alphas but more common than shinies. They keep their primary type but have an unusual secondary type (a
// single-type Pokémon gains one), with outstanding IVs. The Delta type stays through evolution.
const DELTA_CHANCE = 0.008; // twice as common as shinies, about half as common as alphas
function monTypes(m) {
  const base = SP[m.sp].types; if (!m.delta) return base;
  return base[0] === m.delta ? [base[0]] : [base[0], m.delta];
}
// an unusual type: one that appears nowhere in the Pokémon's evolution line
function rollDelta(sp) { const own = lineTypes(sp); const pool = TYPES.filter(t => !own.has(t)); return pick(pool.length ? pool : TYPES); }
function makeDelta(o) { o.delta = rollDelta(o.sp); if (o.moves) refreshMoves(o); if (o.abSlot) o.abSlot = rollAbSlot(o); if (!o.shiny) o.iv = ivSet(() => ri(28, 31)); if (rand() < DELTA_AB_CHANCE) o.deltaAb = rollDeltaAbility(o); return o; }
// A Delta Pokémon sometimes (15%) also has an unusual ability: a strong one its species never has, often one that suits
// its unusual type (a Delta Water type might bring Drizzle). It replaces the Pokémon's own ability.
const DELTA_AB_CHANCE = 0.15;
const DELTA_AB_ANY = ['Adaptability', 'Multiscale', 'Speed Boost', 'Intimidate', 'Moxie', 'Sturdy', 'Regenerator', 'Sheer Force', 'Tough Claws', 'Unaware', 'Mold Breaker', 'Filter'];
const DELTA_AB_TYPE = { Fire: ['Drought', 'Flash Fire'], Water: ['Drizzle', 'Swift Swim', 'Water Absorb'], Electric: ['Volt Absorb', 'Motor Drive', 'Lightning Rod'], Grass: ['Chlorophyll', 'Sap Sipper'],
  Ice: ['Snow Warning', 'Slush Rush'], Ground: ['Sand Stream', 'Sand Force'], Rock: ['Sand Stream', 'Solid Rock'], Steel: ['Filter', 'Sturdy'], Ghost: ['Levitate', 'Unaware'], Psychic: ['Levitate', 'Unaware'],
  Dragon: ['Multiscale', 'Intimidate'], Flying: ['Speed Boost', 'Intimidate'], Bug: ['Technician', 'Speed Boost'], Poison: ['Poison Heal', 'Regenerator'], Dark: ['Moxie', 'Intimidate'], Fighting: ['Guts', 'Moxie'],
  Normal: ['Adaptability', 'Huge Power'], Fairy: ['Regenerator', 'Competitive'] };
function rollDeltaAbility(o) {
  const own = new Set(Object.values(SPECIES_AB[o.sp] || {}).filter(Boolean));
  const b = bsOf(o.sp), phys = b.atk >= b.spa;
  const fits = k => ABILITIES[k] && !own.has(k) && !(k === 'Huge Power' && !phys) && !(['Tough Claws', 'Guts', 'Moxie'].includes(k) && !phys);
  const typed = (DELTA_AB_TYPE[o.delta] || []).filter(fits), any = DELTA_AB_ANY.filter(fits);
  return typed.length && rand() < 0.6 ? pick(typed) : any.length ? pick(any) : typed.length ? pick(typed) : null;
}
const ALPHA_CHANCE = 0.015; // per wild Pokémon offered, before the Scouting bonus (up to +1%)
function wildOffers(t) {
  const avg = t.team.length ? t.team.reduce((a, m) => a + m.lvl, 0) / t.team.length : 10;
  const L = Math.max(5, Math.round(avg - 3 + t.r.sct / 40));
  const cap = 300 + (S.week / SEASON_WEEKS) * 190 + t.r.sct * 0.7 + (t.role === 'champion' ? 200 : 0) + (hasTrait(t, 'collector') ? 25 : 0);
  const luck = hasTrait(t, 'collector') ? 2 : 1;
  const items = [];
  for (const b of BASES) {
    const f = formAt(b, L, t.specialty); const s = SP[f];
    if (s.bst > cap || t.team.some(m => LINE[m.sp] === b)) continue;
    let w = SP[b].rare ? 0.12 + t.r.sct / 400 : 1;
    const fit = specFit(t, f); if (fit) w *= fit === 2 ? 7 : t.spec2 ? 2.6 : 4;
    if (SP[b].starter) w *= 0.25;
    items.push([f, w]);
  }
  const out = [];
  const draw = list => {
    if (!list.length) return null;
    let tot = list.reduce((a, x) => a + x[1], 0), r = rand() * tot, j = 0;
    for (; j < list.length - 1; j++) { r -= list[j][1]; if (r <= 0) break; }
    const [f] = list[j];
    const k = items.findIndex(x => x[0] === f); items.splice(k, 1);
    // rarely, an alpha: guaranteed outstanding IVs and it arrives already hot. Scouting makes them a little more common.
    const alpha = featOn('alpha') && rand() < (ALPHA_CHANCE + t.r.sct / 100 * 0.01) * luck;
    // even more rarely, a shiny: perfect IVs and it arrives on fire. It can be an alpha too.
    let o;
    if (featOn('shiny') && rand() < SHINY_CHANCE * luck) o = ensureMon({ sp: f, lvl: L, shiny: true, alpha: alpha || undefined, form: 3, iv: ivSet(31) });
    else if (alpha) o = ensureMon({ sp: f, lvl: L, alpha: true, form: 1.5, iv: ivSet(() => ri(28, 31)) });
    else o = ensureMon({ sp: f, lvl: L });
    if (featOn('delta') && rand() < DELTA_CHANCE * luck) makeDelta(o);
    if (featOn('shadow') && rand() < SHADOW_CHANCE * luck) o.shadow = true;
    return o;
  };
  // specialists mostly find Pokémon of their own type: two on-type slots, one open slot
  const onType = () => items.filter(x => onSpec(t, x[0]));
  // a dual specialist's two on-type slots go one to each type, so a big type like Normal can't crowd out the other
  const ofType = ty => items.filter(x => SP[x[0]].types.includes(ty));
  for (let k = 0; k < 3 && items.length; k++) {
    const pool = t.spec2 && k < 2 ? ofType(k === 0 ? t.specialty : t.spec2) : null;
    const o = pool && pool.length ? draw(pool) : (t.specialty && k < 2 && onType().length) ? draw(onType()) : draw(items);
    if (o) out.push(o);
  }
  // a mass outbreak this week: the open slot is the swarming species, much more often an alpha or a shiny
  const ob = activeOutbreak();
  if (ob && out.length && !t.team.some(m => LINE[m.sp] === LINE[ob.sp])) {
    const f = formAt(ob.sp, L, t.specialty);
    const alpha = featOn('alpha') && rand() < (ALPHA_CHANCE + t.r.sct / 100 * 0.01) * luck * OUTBREAK_ALPHA;
    const shiny = featOn('shiny') && rand() < SHINY_CHANCE * luck * OUTBREAK_SHINY;
    out[out.length - 1] = shiny ? ensureMon({ sp: f, lvl: L, outbreak: true, shiny: true, alpha: alpha || undefined, form: 3, iv: ivSet(31) })
      : alpha ? ensureMon({ sp: f, lvl: L, outbreak: true, alpha: true, form: 1.5, iv: ivSet(() => ri(28, 31)) })
      : ensureMon({ sp: f, lvl: L, outbreak: true });
    if (featOn('delta') && rand() < DELTA_CHANCE * luck * OUTBREAK_ALPHA) makeDelta(out[out.length - 1]);
    if (featOn('shadow') && rand() < SHADOW_CHANCE * luck) out[out.length - 1].shadow = true;
  }
  // Cipher got away this season: Shadow Pokémon are loose in the wild
  if (S.shadowWild === S.season && out.length && rand() < 0.2) out[out.length - 1].shadow = true;
  // very rarely, the open slot is a baby legendary instead
  let rareFind = false;
  if (featOn('rarefind') && out.length && rand() < BABY_CHANCE + t.r.sct / 100 * 0.0015) { const free = legendFull(t) ? [] : freeBabies().filter(b => !legendBlocked(t, b)); if (free.length) { const b0 = pick(free), pb = pooledLegend(b0), b = pb ? pb.sp : b0; out[out.length - 1] = ensureMon({ sp: b, lvl: L, baby: true }); rareFind = true; catchNews(`${t.name} spotted a ${b} while exploring!`, t.user ? 'you' : 'circuit', t.id); } }
  // v184: rarer still, a legendary in the open slot: a sealed chamber, a hidden glade, a ring in the air
  if (featOn('greatlegends') && !rareFind && out.length && !legendFull(t) && rand() < LEGEND_FIND + t.r.sct / 100 * 0.0008) {
    const free = FIND_LEGENDS.filter(sp => greatFree(sp) && !legendBlocked(t, sp) && !(sp === 'Shaymin' && S.week + 1 > 6));
    if (free.length) { const sp0 = pick(free), pl = pooledLegend(sp0), sp = pl ? pl.sp : sp0, lvl = Math.max(L, Math.floor(Math.max(...t.team.map(m => m.lvl), L)));
      out[out.length - 1] = ensureMon({ sp, lvl, legendFind: true, form: 1, iv: ivSet(() => ri(20, 31)) }); rareFind = true; }
  }
  // a roaming legendary near this trainer's route (v182)
  if (featOn('roamers') && S.roamer && !rareFind) roamOffer(t, out, L);
  // an open Ultra Wormhole near this trainer: the Ultra Beast is waiting, at the level of their strongest Pokémon
  if (S.wormhole && S.wormhole.id === t.id && out.length && !ownedLegends().has(S.wormhole.sp)) {
    const lvl = Math.max(L, Math.floor(Math.max(...t.team.map(m => m.lvl), L)));
    out[out.length - 1] = ensureMon({ sp: S.wormhole.sp, lvl, wormhole: true, form: 1 });
  }
  // v194: nothing banned in the trainer's League turns up
  return out.filter(o => !bannedIn(o.sp, lgOf(t)));
}
function addCatch(t, offer, releaseUid) {
  // two trainers can spot the same baby legendary in a week; only the first to catch it gets it
  if (SP[offer.sp].baby && !freeBabies().includes(LINE[offer.sp])) return null;
  if (offer.wormhole && ownedLegends().has(offer.sp)) return null;
  if (bannedIn(offer.sp, lgOf(t))) return null;
  // two challengers can find the roamer in the same week; only the first to catch it gets it
  if (offer.roam && (!S.roamer || S.roamer.sp !== offer.sp || !greatFree(offer.sp))) return null;
  if (legendBlocked(t, offer.sp) || (isLegendLine(offer.sp) && legendFull(t))) return null;
  if (offer.legendFind && !greatFree(offer.sp)) return null;
  let m = stamp(ensureMon({ uid: uid(), sp: offer.sp, lvl: offer.lvl, iv: offer.iv, nat: offer.nat, cov: offer.cov, alpha: offer.alpha || undefined, shiny: offer.shiny || undefined, delta: offer.delta || undefined, form: offer.alpha || offer.shiny ? offer.form : undefined }), 'caught');
  if (t.team.length >= 6) {
    const idx = releaseUid != null ? t.team.findIndex(x => x.uid === releaseUid) : -1;
    if (idx < 0) return null;
    farewell(t, t.team[idx], 'released for a new catch');
    t.team.splice(idx, 1);
  }
  if (t.role === 'champion') m.cap = Math.max(...t.team.map(x => x.cap || x.lvl), m.lvl);
  if (offer.shadow) makeShadow(m);
  m = claimLegend(t, m);
  t.team.push(m);
  if (SP[m.sp].baby) catchNews(`${t.name} caught ${m.sp}! It's the only one in the league.`, t.user ? 'you' : 'circuit', t.id);
  if (offer.wormhole && GREAT_LEGENDS.includes(m.sp)) recordGreat(t, m, 'caught');
  if (offer.roam) roamCaught(t, m);
  if (offer.legendFind) { m.met.how = 'find'; recordGreat(t, m, 'caught'); catchNews(`${dn(t)} found and caught ${m.sp}! ${FIND_STORY[m.sp] || ''}`, t.user ? 'you' : 'title', t.id); logSky(`${dn(t)} found ${m.sp}`); }
  if (offer.wormhole) { m.met.how = 'wormhole'; catchNews(`${t.name} caught ${SP[m.sp].ub ? 'the Ultra Beast ' : ''}${m.sp}!`, t.user ? 'you' : 'title', t.id); }
  return m;
}
// the strongest stat total anywhere in a Pokémon's line from here on: what it can grow into
function linePeak(sp) { let best = SP[sp].bst; const q = [sp]; while (q.length) { const n = q.shift(); best = Math.max(best, SP[n].bst); for (const e of SP[n].evos || []) q.push(e.to); } return best; }
const WILDCARD_PEAK = 500; // an off-type Pokémon this strong (at its peak) is worth a specialist's wildcard slot
// a specialist's wildcard: their best strong off-type Pokémon, if they have one
function wildcardOf(t) {
  if (!t.specialty) return null;
  const off = t.team.filter(m => !onSpec(t, m.sp) && linePeak(m.sp) >= WILDCARD_PEAK);
  return off.length ? off.reduce((a, b) => (monPower(a) * linePeak(a.sp) > monPower(b) * linePeak(b.sp) ? a : b)) : null;
}
function aiCatch(t) {
  // your trainer left to decide picks from the same wild Pokémon you were shown this week
  const offers = (t.user && S.weekOffers && S.weekOffers[t.id]) || wildOffers(t);
  if (!offers.length) return null;
  const onT = sp => onSpec(t, sp);
  const wild = wildcardOf(t);
  // specialists want one strong off-type Pokémon for coverage: until they have one, a strong off-type find rates like an on-type one
  const wildcardFit = o => t.specialty && !onT(o.sp) && !wild && linePeak(o.sp) >= WILDCARD_PEAK;
  const val = o => (o.roam || o.wormhole ? 1000 : SP[o.sp].baby ? 900 : Math.max(SP[o.sp].bst, wildcardFit(o) ? (SP[o.sp].bst + linePeak(o.sp)) / 2 : 0)) * (specFit(t, o.sp) === 2 ? 1.45 : onT(o.sp) || wildcardFit(o) ? 1.35 : 1) * (o.shiny ? 1.4 : 1) * (o.delta ? 1.3 : 1) * (o.alpha ? 1.3 : 1);
  const best = offers.reduce((a, b) => (val(a) > val(b) ? a : b));
  if (t.team.length < 6) return addCatch(t, best);
  // release off-type Pokémon first when the new catch fits the trainer's type, but keep the wildcard
  // AI trainers hang on to special Pokémon (alphas, shinies, Deltas, legendaries...); only a special catch can push one out
  let keepable = t.team.filter(m => !isSpecial(m));
  if (!keepable.length && isSpecial(best)) keepable = t.team.filter(m => !babyLine(m.sp));
  const offT = keepable.filter(m => !onT(m.sp) && m !== wild);
  const releasePool = onT(best.sp) ? (offT.length ? offT : keepable.filter(m => m !== wild)) : wildcardFit(best) ? keepable : keepable.filter(m => m !== wild);
  if (!releasePool.length) return null;
  const weakest = releasePool.reduce((a, b) => (monPower(a) < monPower(b) ? a : b));
  const swapEdge = onT(best.sp) && !onT(weakest.sp) ? 0.85 : wildcardFit(best) ? 0.95 : 1.08;
  // judge a wildcard by what it grows into, since it'll level up fast as a new catch
  const worth = best.roam || best.wormhole ? 1000 : SP[best.sp].baby ? 900 : wildcardFit(best) ? (SP[best.sp].bst + linePeak(best.sp)) / 2 : SP[best.sp].bst;
  if (best.lvl * worth > monPower(weakest) * 450 * swapEdge) return addCatch(t, best, weakest.uid);
  return null;
}
function aiAction(t) {
  if (S.wormhole && S.wormhole.id === t.id) return 'explore';
  if (wantsLegend(t)) return 'seek';
  if (wantsRaid(t)) return 'raid';
  const pickAct = aiActionBase(t);
  return pickAct === 'challenge' && gymClosed(t.badges.length) ? 'train' : pickAct;
}
function aiActionBase(t) {
  const ob = activeOutbreak();
  if (ob && t.role === 'challenger' && !t.team.some(m => LINE[m.sp] === LINE[ob.sp])) {
    const fits = onSpec(t, formAt(ob.sp, 60, t.specialty)) || linePeak(ob.sp) >= 500;
    const time = t.badges.length >= 8 || SEASON_WEEKS - S.week > 8 - t.badges.length + 2;
    if (fits && time && rand() < 0.55) return 'explore';
  }
  if (t.role === 'champion') return t.team.length < 6 || rand() < 0.2 ? 'explore' : 'train';
  const b = t.badges.length, weeksLeft = SEASON_WEEKS - S.week, need = 8 - b;
  const n = t.team.length;
  if (b >= 8) return n < 6 && rand() < 0.6 ? 'explore' : 'train';
  if (weeksLeft <= need + 1) return 'challenge';
  // build the roster first: trainers want five or six Pokémon before the later gyms
  if (n < 4 && rand() < 0.85) return 'explore';
  if (n < 5 && b >= 2 && rand() < 0.7) return 'explore';
  const conf = topAvg(t, 3) - gymAceLevel(b) + (t.r.str - 50) / 18 + (rand() * 4 - 2);
  if (conf >= -2.5) return 'challenge';
  return n < 6 && rand() < 0.5 ? 'explore' : 'train';
}
function gainLevels(t, amt) {
  const evos = [];
  const capOf = m => t.role === 'champion' ? (m.cap || champLv() + 2) : 100;
  // a Mentor on the same team speeds up everyone else's Pokémon
  if (t.org && S.orgs[t.org].roster.some(id => id !== t.id && hasTrait(T(id), 'mentor'))) amt *= 1.05;
  const top = Math.max(...t.team.map(m => m.lvl));
  for (const m of t.team) {
    // newer, lower-level Pokémon catch up faster (shared experience)
    const mult = m.lvl < top - PACE.catchUpGap ? PACE.catchUpMult : 1;
    const before = Math.floor(m.lvl);
    // Pokérus and Lucky Pokémon level faster
    const a = amt * monGrowth(m) * timeWarp();
    // a Shadow Pokémon can't grow until it's purified: the levels it would have gained are stored
    if (m.shadow) {
      // grow a "virtual" level the same way a normal Pokémon would, and keep the difference in reserve
      const v = m.lvl + m.shadow.stored, vm = v < top - PACE.catchUpGap ? PACE.catchUpMult : 1;
      m.shadow.stored = Math.min(capOf(m), vm > 1 ? Math.min(top, v + a * vm) : v + a) - m.lvl;
      continue;
    }
    m.lvl = Math.min(capOf(m), mult > 1 ? Math.min(top, m.lvl + a * mult) : m.lvl + a);
    ensureMon(m);
    for (const e of evolveMon(m, t.specialty)) evos.push(e);
    for (const [n, old] of refreshMoves(m)) (t.learned = t.learned || []).push([m.sp, n, old]);
  }
  return evos;
}
// ================= VILLAIN EVENTS =================
// Some seasons, around midseason, a villain team moves into the region for three weeks. Challengers can spend a week
// confronting them: a shared ladder of Grunts, then Admins, then the Boss. Whoever beats the Boss ends the event. Each
// team runs its own scheme while it's active, and a scheme left unstopped has a consequence when the event ends.
// Cipher (Pokémon XD) fights with Shadow Pokémon; beating any Cipher trainer lets a challenger snag one of them.
const VILLAIN_TEAMS = {
  rocket:   { name: 'Team Rocket', boss: ['Giovanni', 'Team Rocket Boss', 'm'], ace: 'Rhyhorn', grunt: 'Team Rocket Grunt', types: ['Poison', 'Dark', 'Normal'], scheme: 'theft',
              admins: [['Archer', 'Rocket Executive', 'm'], ['Ariana', 'Rocket Executive', 'f'], ['Proton', 'Rocket Executive', 'm'], ['Petrel', 'Rocket Executive', 'm']],
              plan: 'stealing rare Pokémon from trainers out exploring' },
  magma:    { name: 'Team Magma', boss: ['Maxie', 'Magma Leader', 'm'], ace: 'Numel', grunt: 'Team Magma Grunt', types: ['Fire', 'Ground', 'Dark'], scheme: 'drought',
              admins: [['Courtney', 'Magma Admin', 'f'], ['Tabitha', 'Magma Admin', 'm']], plan: 'a drought: Fire attacks hit 25% harder and Water attacks 25% weaker in every battle' },
  aqua:     { name: 'Team Aqua', boss: ['Archie', 'Aqua Leader', 'm'], ace: 'Carvanha', grunt: 'Team Aqua Grunt', types: ['Water', 'Dark', 'Poison'], scheme: 'rain',
              admins: [['Shelly', 'Aqua Admin', 'f'], ['Matt', 'Aqua Admin', 'm']], plan: 'heavy rain: Water attacks hit 25% harder and Fire attacks 25% weaker in every battle' },
  galactic: { name: 'Team Galactic', boss: ['Cyrus', 'Galactic Boss', 'm'], ace: 'Sneasel', grunt: 'Team Galactic Grunt', types: ['Poison', 'Dark', 'Steel'], scheme: 'time',
              admins: [['Mars', 'Galactic Commander', 'f'], ['Jupiter', 'Galactic Commander', 'f'], ['Saturn', 'Galactic Commander', 'm']], plan: 'distorting time and space: level gains swing wildly, from half to well over normal' },
  plasma:   { name: 'Team Plasma', boss: ['Ghetsis', 'Plasma Sage', 'm'], ace: 'Deino', grunt: 'Team Plasma Grunt', types: ['Dark', 'Ice', 'Psychic'], scheme: 'liberation',
              admins: [['Colress', 'Plasma Scientist', 'm'], ['Zinzolin', 'Plasma Sage', 'm']], plan: '"liberating" Pokémon: friendship drops every week, and some trainers give Pokémon up' },
  flare:    { name: 'Team Flare', boss: ['Lysandre', 'Flare Boss', 'm'], ace: 'Litleo', grunt: 'Team Flare Grunt', types: ['Fire', 'Dark', 'Psychic'], scheme: 'weapon',
              admins: [['Xerosic', 'Flare Scientist', 'm'], ['Aliana', 'Flare Scientist', 'f'], ['Celosia', 'Flare Scientist', 'f'], ['Bryony', 'Flare Scientist', 'f'], ['Mable', 'Flare Scientist', 'f']],
              plan: 'readying the ultimate weapon: if no one stops them, every Pokémon in the region goes cold' },
  skull:    { name: 'Team Skull', boss: ['Guzma', 'Team Skull Boss', 'm'], ace: 'Wimpod', grunt: 'Team Skull Grunt', types: ['Bug', 'Poison', 'Dark'], scheme: 'occupy',
              admins: [['Plumeria', 'Team Skull Admin', 'f']], plan: 'occupying a gym: no one can challenge it until they are cleared out' },
  cipher:   { name: 'Cipher', boss: ['Greevil', 'Cipher Grand Master', 'm'], ace: 'Zapdos', grunt: 'Cipher Peon', types: [], scheme: 'shadow',
              admins: [['Ardos', 'Cipher Admin', 'm'], ['Eldes', 'Cipher Admin', 'm'], ['Gorigan', 'Cipher Admin', 'm'], ['Lovrina', 'Cipher Admin', 'f'], ['Snattle', 'Cipher Admin', 'm'], ['Exol', 'Cipher Cmdr', 'm']],
              plan: 'battling with Shadow Pokémon: beat any of them to snag one, and if they are not stopped, Shadow Pokémon get loose in the wild' },
};
const VILLAIN_CHANCE = 0.07;         // per week from week 6 to 14, at most one event a season (about half of seasons)
const VILLAIN_WEEKS = 3, VILLAIN_THEFTS = 3, RAID_AI = 0.2;
const eventActive = () => !!(S.event && !S.event.done && S.phase === 'season');
const eventTeam = () => (S.event ? VILLAIN_TEAMS[S.event.team] : null);
const eventFoe = () => (eventActive() ? S.event.ladder[S.event.stage] || null : null);
const gymClosed = g => !!(eventActive() && S.event.gym === g);
// weather schemes change every battle while they last
function eventWeather(ty) {
  if (!eventActive()) return 1;
  const sc = eventTeam().scheme;
  if (sc === 'drought') return ty === 'Fire' ? 1.25 : ty === 'Water' ? 0.75 : 1;
  if (sc === 'rain') return ty === 'Water' ? 1.25 : ty === 'Fire' ? 0.75 : 1;
  return 1;
}
// Galactic's time distortion: each trainer's level gains swing each time they grow
const timeWarp = () => (eventActive() && eventTeam().scheme === 'time' ? 0.5 + rand() * 1.1 : 1);
// ---------- Shadow Pokémon ----------
// A Shadow Pokémon's heart is closed (m.shadow.heart, 100 = fully closed). It hits 15% harder, but each turn it may go
// into Hyper Mode and ignore its trainer. It can't gain levels: what it would have gained is stored instead. Battles and
// training open its heart a little (down to 0), and a week spent purifying opens it a lot. Purification itself only
// happens on a Purify week, once the heart is fully open (as at the Relic Stone in XD), so keeping a Shadow Pokémon
// is a choice. Once purified it gets all its stored levels at once and trusts its trainer completely.
// v183: no more Purify weeks. A training week opens a Shadow Pokémon's heart most, an exploring week or a gym challenge a
// little less, and every battle a little more on top; it's purified at the end of the week its heart is fully open
// (about 6–8 weeks for a trainer with an average Bond rating).
const SHADOW_ATK = 1.15, HYPER_CHANCE = 0.12, HEART_BATTLE = 4, HEART_TRAIN = 16, HEART_EXPLORE = 12, HEART_GYM = 11;
function makeShadow(m) { m.shadow = { heart: 100, stored: 0 }; m.fr = 0; delete m.bond; return m; }
function openHeart(t, m, amt) { if (!m.shadow) return; m.shadow.heart = Math.max(0, m.shadow.heart - amt * (0.6 + (t.r ? t.r.bnd : 50) / 100 * 0.8)); }
function purify(t, m) {
  const gain = m.shadow ? m.shadow.stored : 0;
  delete m.shadow; m.purified = S.season || 1; m.fr = 220;
  const before = m.sp; m.lvl = Math.min(100, m.lvl + gain); ensureMon(m);
  const evos = evolveMon(m, t.specialty);
  t.career.purified = (t.career.purified || 0) + 1;
  catchNews(`${dn(t)}'s Shadow ${before} was purified! It gained ${Math.round(gain)} level${Math.round(gain) === 1 ? '' : 's'} at once${evos.length ? ' and evolved into ' + m.sp : ''}.`, t.user ? 'you' : 'circuit', t.id);
}
function purifyWeek(t) {
  const out = [];
  for (const m of t.team.slice()) if (m.shadow && m.shadow.heart <= 0) { const sp = m.sp; purify(t, m); out.push(sp); }
  return out;
}
// ---------- the event itself ----------
function villainFoe(v, kind, who, L, size) {
  const q = kind === 'boss' ? 80 : kind === 'admin' ? 64 : 48;
  const f = { id: -(S.nextVid = (S.nextVid || 1) + 1), name: who ? who[0] : '', cls: who ? who[1] : v.grunt, gender: who ? who[2] : (rand() < 0.5 ? 'm' : 'f'), age: 30, role: 'villain', kind, r: {},
    specialty: v.types[0] || null, spec2: null, team: [], badges: [], weekLog: [], career: {}, trait: null, seasons: 0, villain: S.event ? S.event.team : null };
  for (const k of RK) f.r[k] = clamp(Math.round(q + (rand() - 0.5) * 20), 15, 95);
  const lines = new Set();
  const add = m => { if (!m || lines.has(LINE[m.sp])) return false; lines.add(LINE[m.sp]); f.team.push(m); return true; };
  // the Boss's signature Pokémon (Cipher's Boss holds a Shadow legendary bird, if it's free)
  if (kind === 'boss') {
    let ace = v.ace;
    if (v.scheme === 'shadow') { const birds = ['Zapdos', 'Articuno', 'Moltres'].filter(b => !ownedLegends().has(b)); ace = birds.length ? pick(birds) : 'Tauros'; }
    add(makeMon(ace, L + 2, v.types[0]));
  }
  for (let tries = 0; f.team.length < size && tries < 40; tries++) {
    const ty = v.types.length ? v.types[tries % v.types.length] : null;
    add(buildEliteTeam(ty, L, 1, !ty)[0]);
  }
  f.team.forEach((m, i) => { m.lvl = Math.max(5, L - (i ? ri(0, 3) : 0)); evolveMon(m, f.specialty); m.fr = 120; });
  if (v.scheme === 'shadow') f.team.forEach(makeShadow);
  return f;
}
function circuitLevel() {
  const ls = challengers().map(t => topAvg(t, 3)).sort((a, b) => a - b);
  return ls.length ? ls[Math.floor(ls.length / 2)] : 20;
}
function startVillainEvent() {
  const last = (S.eventLog || [])[0];
  const keys = Object.keys(VILLAIN_TEAMS).filter(k => !titleNameTaken(VILLAIN_TEAMS[k].boss[1], VILLAIN_TEAMS[k].boss[0]) && (!last || last.team !== k));
  if (!keys.length) return;
  const key = pick(keys), v = VILLAIN_TEAMS[key];
  const L = Math.round(circuitLevel());
  S.event = { team: key, season: S.season, from: S.week + 1, until: S.week + VILLAIN_WEEKS, town: pick(TOWNS), stage: 0, ladder: [], beaten: [], stolen: [], done: false };
  const admins = shuffle(v.admins.filter(a => !titleNameTaken(a[1], a[0]))).slice(0, 2);
  S.event.ladder.push(villainFoe(v, 'grunt', null, L - 6, 3), villainFoe(v, 'grunt', null, L - 5, 3));
  admins.forEach((a, i) => S.event.ladder.push(villainFoe(v, 'admin', a, L + i, 4)));
  S.event.ladder.push(villainFoe(v, 'boss', v.boss, L + 6, 6));
  if (v.scheme === 'occupy') {
    const need = {}; for (const t of challengers()) if (t.badges.length < 8) need[t.badges.length] = (need[t.badges.length] || 0) + 1;
    const g = +Object.keys(need).sort((a, b) => need[b] - need[a])[0];
    S.event.gym = isNaN(g) ? ri(0, 7) : g;
  }
  news(`${v.name} has moved into a hideout near ${S.event.town}, led by ${v.boss[1]} ${v.boss[0]}. Their plan: ${v.plan}. Challengers have until week ${S.event.until} to stop them.${S.event.gym != null ? ` ${TOWNS[S.event.gym]} Gym is closed while they hold it.` : ''}`, 'circuit');
}
// a week spent confronting the villains: one battle against whoever is next on the ladder
function raidBattle(t, entry) {
  const v = eventTeam(), foe = eventFoe(); if (!foe) return null;
  const res = battle(t, foe, 'raid', `${v.name} hideout · ${dn(foe)}`);
  const won = res.winner === 0;
  entry.raid = { team: S.event.team, vs: dn(foe), kind: foe.kind, won };
  t.career.villainBattles = (t.career.villainBattles || 0) + 1;
  if (won) {
    t.career.villainWins = (t.career.villainWins || 0) + 1;
    S.event.beaten.push({ id: t.id, stage: S.event.stage });
    S.event.stage++;
    if (v.scheme === 'shadow') offerSnag(t, foe);
    if (foe.kind === 'boss') endVillainEvent(t);
    else news(`${dn(t)} beat ${dn(foe)} at the ${v.name} hideout.${S.event.ladder[S.event.stage] ? ` Next up: ${dn(S.event.ladder[S.event.stage])}.` : ''}`, t.user ? 'you' : 'circuit', t.id);
  } else if (t.user) news(`${dn(t)} lost to ${dn(foe)} at the ${v.name} hideout.`, 'you', t.id);
  return res;
}
// after beating a Cipher trainer: snag one of their Shadow Pokémon (or don't)
function offerSnag(t, foe) {
  const mons = foe.team.filter(m => m.shadow && !legendBlocked(t, m.sp) && !(isLegendLine(m.sp) && legendFull(t))).map(m => { const c = JSON.parse(JSON.stringify(m)); c.uid = uid(); c.shadow = { heart: 100, stored: 0 }; c.st = undefined; c.ss = undefined; return c; });
  if (!mons.length) return;
  if (t.user) { S.snagOffers = S.snagOffers || {}; S.snagOffers[t.id] = { from: dn(foe), mons }; news(`${dn(t)} can snag one of ${dn(foe)}'s Shadow Pokémon.`, 'you', t.id); return; }
  const best = mons.slice().sort((a, b) => monPower(b) - monPower(a))[0];
  const weakest = t.team.filter(m => !isSpecial(m) && !(t.mega && t.mega.uid === m.uid) && m.bond !== t.id).sort((a, b) => monPower(a) - monPower(b))[0];
  if (t.team.length < 6) snag(t, best, null);
  else if (weakest && monPower(best) * SHADOW_ATK > monPower(weakest) * 1.15) snag(t, best, weakest.uid);
}
function snag(t, m, releaseUid) {
  if (legendBlocked(t, m.sp) || (isLegendLine(m.sp) && (!greatFree(m.sp) || legendFull(t)))) return null;
  if (t.team.length >= 6) { const i = t.team.findIndex(x => x.uid === releaseUid); if (i < 0) return null; farewell(t, t.team[i], 'replaced by a snagged Shadow Pokémon'); t.team.splice(i, 1); }
  m.met = { how: 'snag', season: S.season, week: S.week + 1 }; m.metFr = 1; m.fr = 0;
  if (t.role === 'champion') m.cap = Math.max(...t.team.map(x => x.cap || x.lvl), m.lvl);
  m = claimLegend(t, m);
  t.team.push(m);
  t.career.snagged = (t.career.snagged || 0) + 1;
  catchNews(`${dn(t)} snagged a Shadow ${m.sp} from Cipher.`, t.user ? 'you' : 'circuit', t.id);
  return m;
}
function answerSnag(id, i, releaseUid) {
  const o = S.snagOffers && S.snagOffers[id]; if (!o) return null;
  const t = T(id); if (!t) return null;
  if (i == null) { delete S.snagOffers[id]; news(`${dn(t)} let ${o.from}'s Shadow Pokémon go.`, 'you', t.id); return null; }
  const m = o.mons[i]; if (!m) return null;
  const r = snag(t, m, releaseUid); if (r) delete S.snagOffers[id];
  return r;
}
function endVillainEvent(hero) {
  const e = S.event, v = eventTeam(); if (!e || e.done) return;
  e.done = true; e.hero = hero ? hero.id : null;
  (S.eventLog = S.eventLog || []).unshift({ team: e.team, season: e.season, hero: e.hero, heroName: hero ? dn(hero) : null, stopped: !!hero });
  if (S.eventLog.length > 40) S.eventLog.length = 40;
  villainLegend(e.team, hero || null);
  if (hero) {
    (hero.villainBosses = hero.villainBosses || []).push({ team: e.team, season: S.season, lg: S.lg || 0 });
    hero.career.villainBosses = (hero.career.villainBosses || 0) + 1;
    gainLevels(hero, 2);
    let extra = '';
    if (e.stolen.length) {
      const boss = e.ladder[e.ladder.length - 1];
      for (const s of e.stolen) { const owner = T(s.from), m = boss.team.find(x => x.uid === s.uid); if (owner && m && owner.role !== 'retired' && owner.team.length < 6) { boss.team = boss.team.filter(x => x !== m); owner.team.push(m); } }
      extra = ' The stolen Pokémon were returned to their trainers.';
    }
    if (e.gym != null) extra += ` ${TOWNS[e.gym]} Gym is open again.`;
    news(`${dn(hero)} defeated ${v.boss[1]} ${v.boss[0]} and drove ${v.name} out of the region!${extra}`, hero.user ? 'you' : 'title', hero.id);
    return;
  }
  // the scheme ran its course
  if (v.scheme === 'weapon') { for (const t of leagueTrainers()) if (t.role !== 'retired' && t.team) for (const m of t.team) m.form = Math.min(m.form || 0, -2); news(`No one stopped ${v.name}. Their ultimate weapon fired, and every Pokémon in the region has gone cold.`, 'circuit'); }
  else if (v.scheme === 'shadow') { S.shadowWild = S.season; news(`No one stopped Cipher. Shadow Pokémon have gotten loose in the wild for the rest of the season.`, 'circuit'); }
  else if (v.scheme === 'theft' && e.stolen.length) news(`${v.name} got away, along with ${e.stolen.length} stolen Pokémon.`, 'circuit');
  else news(`${v.name} left ${e.town} with no one able to stop them.`, 'circuit');
}
// each week while the event runs: the scheme does its damage, and the event ends when time is up
function villainWeek() {
  if (S.phase !== 'season') return;
  if (eventActive()) {
    const v = eventTeam(), e = S.event;
    if (v.scheme === 'theft' && e.stolen.length < VILLAIN_THEFTS) {
      const ex = challengers().filter(t => { const w = t.weekLog[t.weekLog.length - 1]; return w && w.wk === S.week + 1 && w.act === 'explore' && t.team.length > 3; });
      for (const t of shuffle(ex)) {
        if (e.stolen.length >= VILLAIN_THEFTS || rand() >= 0.12) continue;
        const cand = t.team.filter(m => !SP[m.sp].legend && m.bond !== t.id && !(t.mega && t.mega.uid === m.uid));
        const m = cand.find(x => x.shiny || x.delta || x.alpha || x.lucky) || pick(cand); if (!m) continue;
        t.team = t.team.filter(x => x !== m); e.ladder[e.ladder.length - 1].team.push(m); e.stolen.push({ from: t.id, uid: m.uid, sp: m.sp });
        news(`${v.name} stole ${dn(t)}'s ${m.sp}! Beating ${v.boss[0]} would get it back.`, t.user ? 'you' : 'circuit', t.id);
      }
    }
    if (v.scheme === 'liberation') {
      for (const t of challengers()) for (const m of t.team) if (!m.shadow) m.fr = Math.max(0, (m.fr ?? 70) - 6);
      const ai = challengers().filter(t => !t.user && t.team.length >= 5);
      for (const t of shuffle(ai).slice(0, 2)) if (rand() < 0.5) { const m = t.team.filter(x => !isSpecial(x)).sort((a, b) => monPower(a) - monPower(b))[0]; if (m) { farewell(t, m, 'released after listening to Team Plasma'); t.team = t.team.filter(x => x !== m); news(`${dn(t)} was swayed by Team Plasma and released ${m.sp}.`, 'circuit', t.id); } }
    }
    if (S.week + 1 >= e.until) endVillainEvent(null);
  } else if (featOn('villains') && (!S.event || S.event.season !== S.season)) {
    if (S.week + 1 >= 6 && S.week + 1 <= 14 && rand() < VILLAIN_CHANCE) startVillainEvent();
  }
}
// AI: confront the villains when there's time to spare
function wantsRaid(t) {
  if (!eventActive() || t.role !== 'challenger' || !eventFoe()) return false;
  const need = 8 - t.badges.length, weeksLeft = SEASON_WEEKS - S.week;
  if (need > 0 && weeksLeft <= need + 2) return false;
  if (S.event.gym === t.badges.length) return rand() < 0.6;
  let p = RAID_AI * (hasTrait(t, 'competitor') ? 1.6 : 1) * (S.event.stolen.some(s => s.from === t.id) ? 3 : 1) * (t.badges.length >= 8 ? 1.8 : 1);
  if (eventTeam().scheme === 'shadow') p *= 1.3;
  return rand() < p;
}
// ================= SEASON AWARDS =================
// Handed out when the League ends. Trainers and Pokémon keep them (t.awards, m.awards), and each season's winners
// are stored with its history entry (h.awards).
const AWARDS = {
  toy:  { name: 'Trainer of the Year', short: 'Trainer of the Year' },
  roy:  { name: 'Rookie of the Year', short: 'Rookie of the Year' },
  mip:  { name: 'Most Improved Trainer', short: 'Most Improved' },
  gloy: { name: 'Gym Leader of the Year', short: 'Gym Leader of the Year' },
  e4oy: { name: 'Elite Four Member of the Year', short: 'Elite Four of the Year' },
  poy:  { name: 'Pokémon of the Year', short: 'Pokémon of the Year' },
  coy:  { name: 'Catch of the Year', short: 'Catch of the Year' },
};
// a challenger's season, scored: League run and badges (team points), gym record, road and villain wins
function seasonScore(t, L) {
  const wl = t.weekLog || [];
  const gw = wl.filter(w => w.act === 'challenge' && w.won).length, gl = wl.filter(w => w.act === 'challenge' && w.won === false).length;
  const rw = wl.filter(w => w.road && w.road.won).length, vw = wl.filter(w => w.raid && w.raid.won).length;
  const boss = (t.villainBosses || []).some(x => x.season === S.season) ? 4 : 0;
  return trainerPoints(t, L) * 2 + gw - gl * 0.5 + rw * 0.5 + vw * 0.5 + boss;
}
const monYear = m => (m.ss && m.ss.season === S.season && m.ss.b >= 6 ? m.ss.ko * 2 + m.ss.w + m.ss.lw * 3 + (m.ss.dmg || 0) / 2500 : 0);
function giveAward(k, t, m, why) {
  (t.awards = t.awards || []).push({ k, season: S.season, lg: S.lg || 0 });
  if (m) (m.awards = m.awards || []).push({ k, season: S.season, lg: S.lg || 0 });
  return { k, id: t.id, name: dn(t), uid: m ? m.uid : null, sp: m ? m.sp : null, why };
}
function seasonAwards(L) {
  const out = [];
  const cands = [...new Set([...S.challengers, ...L.entries.map(e => e.id)])].map(T).filter(t => t && t.seasonHist && t.seasonHist.length);
  const scored = cands.map(t => ({ t, s: seasonScore(t, L), e: L.entries.find(x => x.id === t.id) })).sort((a, b) => b.s - a.s);
  const res = x => x.e ? (x.e.stage === 5 ? (x.e.interim ? 'Interim Champion' : 'won the title') : x.e.stage === 4 ? 'reached the title match' : `reached Elite Four #${x.e.stage + 1}`) : `${x.t.badges.length} badge${x.t.badges.length === 1 ? '' : 's'}`;
  if (scored[0]) out.push(giveAward('toy', scored[0].t, null, res(scored[0])));
  // no rookie award in the founding season, when everyone is new
  const rook = S.season > 1 && scored.find(x => x.t.seasonHist.length === 1);
  if (rook) out.push(giveAward('roy', rook.t, null, res(rook)));
  const imp = cands.filter(t => t.seasonHist.length >= 2 && t.seasonHist[t.seasonHist.length - 2].season === S.season - 1 && t.seasonHist[t.seasonHist.length - 2].pts != null)
    .map(t => { const h = t.seasonHist, a = h[h.length - 2], b = h[h.length - 1]; return { t, d: (b.pts - a.pts) + (b.ovr - a.ovr) * 0.25, from: a.pts, to: b.pts }; })
    .filter(x => x.d > 0).sort((a, b) => b.d - a.d)[0];
  if (imp) out.push(giveAward('mip', imp.t, null, `${imp.from} → ${imp.to} team points`));
  const gl = S.gyms.map((g, i) => ({ g, i, t: T(g.leader) })).filter(x => x.t && x.g.w + x.g.l >= 5).sort((a, b) => b.g.w / (b.g.w + b.g.l) - a.g.w / (a.g.w + a.g.l) || b.g.w - a.g.w)[0];
  if (gl) out.push(giveAward('gloy', gl.t, null, `${TOWNS[gl.i]} Gym, ${gl.g.w}–${gl.g.l}`));
  const e4 = S.e4.map(id => T(id)).filter(Boolean).map(t => ({ t, w: L.entries.filter(e => e.lostTo === t.id).length })).filter(x => x.w > 0).sort((a, b) => b.w - a.w)[0];
  if (e4) out.push(giveAward('e4oy', e4.t, null, `stopped ${e4.w} challenger${e4.w === 1 ? '' : 's'}`));
  const mons = [];
  // Gym Leaders' Pokémon battle every week and have their own award, so Pokémon of the Year goes to everyone else's
  for (const t of leagueTrainers()) if (!['retired', 'leader'].includes(t.role) && t.team) for (const m of t.team) mons.push({ t, m, v: monYear(m) });
  mons.sort((a, b) => b.v - a.v);
  if (mons[0] && mons[0].v > 0) { const { t, m } = mons[0]; out.push(giveAward('poy', t, m, `${m.ss.ko} KOs, ${m.ss.w}–${m.ss.l}`)); }
  const rare = m => (m.shiny ? 14 : 0) + (m.delta ? 12 : 0) + (m.alpha ? 6 : 0) + (SP[m.sp].legend ? 10 : 0) + (SP[m.sp].baby || babyLine(m.sp) ? 10 : 0) + (m.shadow || (m.met && m.met.how === 'snag') ? 4 : 0);
  const caught = mons.filter(x => x.m.met && x.m.met.season === S.season && ['caught', 'snag', 'wormhole'].includes(x.m.met.how)).map(x => ({ ...x, c: x.v + rare(x.m) })).sort((a, b) => b.c - a.c)[0];
  if (caught) { const { t, m } = caught; const tag = [m.shiny && 'shiny', m.delta && 'Delta', m.alpha && 'alpha', m.met.how === 'snag' && 'snagged'].filter(Boolean).join(' '); out.push(giveAward('coy', t, m, `${tag ? tag + ', ' : ''}caught in week ${m.met.week}`)); }
  return out;
}
// ================= LEGACY TRAINERS =================
// When a notable trainer retires, there's a chance that some seasons later their child enters the draft: same
// specialty, a strong potential, often the same trait, a starter from their parent's signature line, and a soft spot
// for the parent's old team (which values them a little more in the draft).
function legacyChance(t) {
  if (t.famous || t.villain) return 0;
  const aw = t.awards || [];
  let p = 0;
  if (t.career.titles >= 1) p = Math.max(p, 0.65);
  if (aw.some(a => a.k === 'toy')) p = Math.max(p, 0.55);
  if (t.prevRole === 'e4' || (t.career.e4Wins || 0) >= 10) p = Math.max(p, 0.4);
  if ((t.villainBosses || []).length) p = Math.max(p, 0.35);
  if (aw.length || t.prevRole === 'leader' || (t.seasonHist || []).filter(h => h.badges === 8).length >= 3) p = Math.max(p, 0.25);
  return p;
}
function scheduleLegacy(t) {
  const p = featOn('legacy') ? legacyChance(t) : 0; if (!p || rand() >= p) return;
  (S.legacyQueue = S.legacyQueue || []).push({ parent: t.id, at: S.season + ri(2, 10) });
}
// the parent's signature line: the Pokémon that battled most for them, if it's an ordinary line. Legendaries, rare
// finds and other one-of-a-kind Pokémon are never passed down: only one of each can exist at a time.
const legacyTop = p => (p.team || []).concat(p.alumni || []).filter(m => m.st && m.st.b).sort((a, b) => b.st.b - a.st.b)[0] || null;
const oneOfAKind = sp => !!(SP[sp].legend || SP[sp].baby || babyLine(sp) || SP[sp].ub || SP[sp].paradox);
function legacyLine(p) {
  const all = (p.team || []).concat(p.alumni || []).filter(m => m.st && m.st.b);
  all.sort((a, b) => b.st.b - a.st.b);
  for (const m of all) { const base = LINE[m.sp]; if (base && SP[base] && BASES.includes(base) && !SP[base].legend && !SP[base].baby && !babyLine(base)) return base; }
  return null;
}
function makeLegacy(q) {
  const p = T(q.parent); if (!p) return null;
  const age = ri(11, 16);
  const t = newTrainer({ age, quality: ri(46, 58) + Math.max(0, age - 14), role: 'prospect', specialty: p.specialty === undefined ? undefined : p.specialty, noFamous: true });
  if (p.spec2 && t.specialty === p.specialty) t.spec2 = p.spec2;
  if (p.trait && rand() < 0.5) t.trait = p.trait;
  t.pot = clamp(Math.max(t.pot, ovr(t) + ri(16, 26)), ovr(t), 99);
  const org = ((p.teams || []).slice(-1)[0] || {}).org || p.prevOrg || p.homeOrg || ((p.seasonHist || []).slice().reverse().find(h => h.org) || {}).org || null;
  t.legacy = { parent: p.id, name: dn(p), org };
  (p.children = p.children || []).push(t.id);
  starterTeam(t, 9);
  const base = legacyLine(p);
  if (base) {
    const m = stamp(makeMon(base, 9, t.specialty), 'starter'); m.met.how = 'legacy'; m.met.from = p.id;
    if (t.team.length) t.team[0] = m; else t.team.push(m);
  }
  const top = legacyTop(p), skipped = top && oneOfAKind(top.sp) ? top.sp : null;
  if (skipped) t.legacy.skipped = skipped;
  news(`Legacy prospect: ${dn(t)}, child of ${dn(p)}, has entered the draft${base ? ` with a ${t.team[0].sp} from the family line` : ''}.${skipped ? ` ${p.name}'s ${skipped} couldn't be passed down: only one of each legendary can exist at a time.` : ''}`, 'draft', t.id);
  return t;
}
// ================= GREAT LEGENDARY EVENTS =================
// The 22 box-art legendaries (GREAT_LEGENDS) only enter the world through story triggers. Two kinds:
//  - encounters (S.legend): the legendary appears near a town for 5 weeks; any challenger can spend a week seeking it.
//    v177: every attempt is one battle against it at full strength (raid HP), and each trainer's damage adds up to
//    their own total. Once the combined damage reaches LEGEND_BARS full defeats it's worn down, and when that happens,
//    or when its time runs out, it goes to the trainer who did the most damage (a tie is settled by a battle).
//    Each attempt rolls the challenger's luck for the day, so the same team can do brilliantly one week and struggle
//    the next. A failed attempt still earns experience, more the more damage it did. At most one encounter a season.
//  - gifts: the legendary chooses a trainer and joins them with no battle (a reward for something rare).
const LEGEND_HP = 7, LEGEND_WEEKS = 5, LEGEND_AI = 0.22, LEGEND_LV = 18, LEGEND_BARS = 4, LEGEND_LUCK = [0.5, 2];
// the challenger's luck for one attempt: from x0.5 to x2, centred on x1 and usually somewhere in between
function legendLuck() { const lo = Math.log(LEGEND_LUCK[0]), hi = Math.log(LEGEND_LUCK[1]); return Math.exp(lo + (hi - lo) * (rand() + rand()) / 2); }
// damage totals per trainer (an encounter from an older save starts its tally afresh)
function legendState(L) { if (L && !L.dmg) { L.dmg = {}; L.tries = {}; L.total = 0; } return L; }
const legendRank = L => Object.entries(legendState(L).dmg).map(([id, d]) => ({ id: +id, d, n: L.tries[id] || 0 })).sort((a, b) => b.d - a.d);
const greatFree = sp => !ownedLegends().has(sp) && !bannedIn(sp, S.lg || 0);
const everCaught = sp => !!(S.greatCaught && S.greatCaught[sp]);
// the weather Groudon and Kyogre bring stays until they're caught (or the season ends)
function legendWeather(ty) {
  const L = S.legend; if (!L || S.phase !== 'season') return 1;
  if (L.sp === 'Groudon') return ty === 'Fire' ? 1.25 : ty === 'Water' ? 0.75 : 1;
  if (L.sp === 'Kyogre') return ty === 'Water' ? 1.25 : ty === 'Fire' ? 0.75 : 1;
  return 1;
}
// the Darkest Day: every battle swings wildly while Eternatus is loose
const legendChaos = () => (S.legend && S.legend.sp === 'Eternatus' && S.phase === 'season' ? 0.7 + rand() * 0.7 : 1);
function recordGreat(t, m, how) {
  (S.greatCaught = S.greatCaught || {})[m.sp] = { id: t.id, season: S.season, how };
  (t.greatLegends = t.greatLegends || []).push({ sp: m.sp, season: S.season, how, lg: S.lg || 0 });
  noteLegends(t);
}
// every legendary a trainer has ever had on their team (for Arceus)
function noteLegends(t) { const s = new Set(t.legendsEver || []); for (const m of t.team || []) if (SP[m.sp].legend) s.add(m.sp); t.legendsEver = [...s]; }
function legendMon(t, sp) {
  const lvl = Math.max(20, Math.floor(Math.max(...t.team.map(m => m.lvl), 20)) + 2);
  const m = stamp(makeMon(sp, lvl), 'gift'); m.met = { how: isGlitch(sp) ? 'glitch' : 'legend', season: S.season, week: S.week + 1 }; m.fr = 150;
  if (t.role === 'champion') m.cap = Math.max(...t.team.map(x => x.cap || x.lvl), m.lvl);
  return claimLegend(t, m);
}
// a legendary joins a trainer: if the team is full, an AI trainer lets their weakest ordinary Pokémon go; you choose
function joinLegend(t, sp, how, why) {
  if (!greatFree(sp) || legendBlocked(t, sp) || legendFull(t)) return null;
  if (t.user && t.team.length >= 6) { (S.legendOffers = S.legendOffers || {})[t.id] = { sp, how, why }; news(`${sp} has chosen ${dn(t)}! The team is full, so choose who makes room.`, 'you', t.id); return null; }
  if (t.team.length >= 6) {
    const keep = m => (t.mega && t.mega.uid === m.uid) || m.bond === t.id;
    const out = t.team.filter(m => !isSpecial(m) && !keep(m)).sort((a, b) => monPower(a) - monPower(b))[0] || t.team.filter(m => !SP[m.sp].legend && !keep(m)).sort((a, b) => monPower(a) - monPower(b))[0];
    if (!out) return null;
    farewell(t, out, `released to make room for ${sp}`); t.team = t.team.filter(x => x !== out);
  }
  const m = legendMon(t, sp); t.team.push(m); recordGreat(t, m, how);
  news(`${why} ${sp} joined ${dn(t)}!`, t.user ? 'you' : 'title', t.id);
  return m;
}
function answerLegend(id, releaseUid) {
  const o = S.legendOffers && S.legendOffers[id]; const t = T(id); if (!o || !t) return null;
  delete S.legendOffers[id];
  if (releaseUid == null) { news(`${dn(t)} let ${o.sp} go. It may appear again one day.`, 'you', t.id); return null; }
  const i = t.team.findIndex(x => x.uid === releaseUid); if (i < 0 || !greatFree(o.sp) || legendBlocked(t, o.sp)) return null;
  farewell(t, t.team[i], `released to make room for ${o.sp}`); t.team.splice(i, 1);
  const m = legendMon(t, o.sp); t.team.push(m); recordGreat(t, m, o.how);
  news(`${o.why} ${o.sp} joined ${dn(t)}!`, 'you', t.id);
  return m;
}
const LEGEND_STORY = {
  Groudon: 'Team Magma awakened Groudon. The drought will last until someone catches it.',
  Kyogre: 'Team Aqua awakened Kyogre. The rain will last until someone catches it.',
  Rayquaza: 'Rayquaza has descended from Sky Pillar to restore the balance.',
  Dialga: 'Spear Pillar has opened, and Dialga has appeared. Diamond Clan trainers have the better shot.',
  Palkia: 'Spear Pillar has opened, and Palkia has appeared. Pearl Clan trainers have the better shot.',
  Giratina: 'With Spear Pillar disturbed, the Distortion World has torn open, and Giratina has come through.',
  Kyurem: 'Kyurem has stirred in the Giant Chasm.',
  Yveltal: "Team Flare's weapon fired, and Yveltal has awakened.",
  Koraidon: 'An expedition to Area Zero has found Koraidon. Naranja Academy trainers have the better shot.',
  Miraidon: 'An expedition to Area Zero has found Miraidon. Uva Academy trainers have the better shot.',
  Eternatus: 'The Darkest Day has begun: Eternatus is loose, and every battle is chaos until it is caught.',
  Terapagos: 'An expedition to Area Zero has found Terapagos sleeping deep in the crater.',
  Regigigas: 'The great doors of Snowpoint Temple have opened, and Regigigas is stirring.',
  Darkrai: 'A New Moon: Darkrai is loose, and sleep brings nightmares. Pokémon put to sleep stay asleep longer until it is caught.',
  Cresselia: 'A Full Moon: Cresselia has been seen gliding over the region.',
  Deoxys: 'A meteor came down near the region, and something inside it has woken: Deoxys.',
  Heatran: 'A volcano near the region has erupted, and Heatran has crawled out of the magma.',
};
const RARE_ENCOUNTER = 0.002; // v184: per week, each of Regigigas, Darkrai, Cresselia, Deoxys and Heatran, in weeks 5–16
const LEGEND_FALLBACK_CHANCE = 0.0015; // per week, per legendary, in weeks 5–16
const LEGEND_FALLBACK = [
  ['Groudon', 'Groudon stirred deep beneath the earth on its own. The drought will last until someone catches it.'],
  ['Kyogre', 'Kyogre rose from the sea floor on its own. The rain will last until someone catches it.'],
  ['Dialga', 'A tremor shook Spear Pillar, and Dialga appeared. Diamond Clan trainers have the better shot.'],
  ['Palkia', 'A tremor shook Spear Pillar, and Palkia appeared. Pearl Clan trainers have the better shot.'],
  ['Yveltal', 'Yveltal woke from its long sleep on its own.'],
  ['Reshiram', 'With no one to control it, Reshiram, the dragon of truth, sought out the trainer with the deepest bond.'],
  ['Zekrom', 'With no one to control it, Zekrom, the dragon of ideals, sought out the strongest trainer.'],
];
const LEGEND_AFFINITY = { Dialga: 'galactic', Palkia: 'aqua', Koraidon: 'star', Miraidon: 'uva' };
function startLegend(sp, why) {
  if (!featOn('greatlegends') || !greatFree(sp) || S.legend || S.phase !== 'season' || S.legendSeason === S.season) return false;
  const lvl = Math.min(100, Math.round(circuitLevel()) + LEGEND_LV);
  S.legend = { sp, season: S.season, from: S.week + 1, until: ['Groudon', 'Kyogre'].includes(sp) ? SEASON_WEEKS : Math.min(SEASON_WEEKS, S.week + LEGEND_WEEKS), town: pick(TOWNS), lvl, attempts: 0, dmg: {}, tries: {}, total: 0, affinity: LEGEND_AFFINITY[sp] || null };
  S.legendSeason = S.season;
  news(`${why || LEGEND_STORY[sp] || sp + ' has appeared.'} It's near ${S.legend.town}; challengers can seek it until week ${S.legend.until}, and it goes to whoever does the most damage.`, 'title');
  return true;
}
// one week's attempt at the legendary: a full-strength battle; the damage adds to this trainer's total
function legendBattle(t, entry) {
  const L = legendState(S.legend); if (!L) return null;
  const boss = { id: -1, name: L.sp, cls: 'Wild', role: 'villain', kind: 'legend', r: { str: 80, trn: 80, bnd: 50, sct: 50, nrv: 80 }, specialty: SP[L.sp].types[0], spec2: null, team: [makeMon(L.sp, L.lvl)], badges: [], weekLog: [], career: {}, trait: null, seasons: 0 };
  const bonus = L.affinity && t.org === L.affinity ? 1.25 : 1, luck = legendLuck();
  const res = battle(t, boss, 'raid', `${L.sp} · near ${L.town}`, { boss: { hpMul: LEGEND_HP / bonus, hpFrac: 1, luck, who: t } });
  L.attempts++;
  const dealt = clamp(1 - res.bossHp, 0, 1);
  L.dmg[t.id] = (L.dmg[t.id] || 0) + dealt; L.tries[t.id] = (L.tries[t.id] || 0) + 1; L.total += dealt;
  entry.legend = { sp: L.sp, dealt: Math.round(dealt * 100), luck: Math.round(luck * 100) / 100, total: Math.round(L.dmg[t.id] * 100), caught: false };
  const lead = legendRank(L)[0];
  if (L.total >= LEGEND_BARS) {
    const w = settleLegend(`${L.sp} has been worn down!`);
    entry.legend.caught = !!w && w.id === t.id; res.legendCaught = entry.legend.caught;
  } else if (t.user) news(`${dn(t)} did ${entry.legend.dealt}% to ${L.sp}${dealt >= 1 ? ', defeating it outright,' : ''} on a ${luckWord(luck)} day (${entry.legend.total}% in total${lead.id === t.id ? ', the most of anyone' : `; the leader has ${Math.round(lead.d * 100)}%`}).`, 'you', t.id);
  return res;
}
const luckWord = x => x >= 1.45 ? 'brilliant' : x >= 1.12 ? 'good' : x > 0.88 ? 'steady' : x > 0.68 ? 'poor' : 'dreadful';
// the encounter ends (worn down, out of time, or the season over): the trainer who did the most damage gets it.
// A tie at the top is fought out, winner stays on. Returns the trainer it went to, if any.
function settleLegend(reason, force) {
  const L = legendState(S.legend); if (!L) return null;
  S.legend = null;
  const elig = id => { const t = T(id); return t && t.role !== 'retired' && t.team && t.team.length && !legendBlocked(t, L.sp) && !legendFull(t); };
  const rank = legendRank(L).filter(r => r.d > 0 && elig(r.id));
  if (!rank.length || !greatFree(L.sp)) { news(`${reason} ${L.sp} slipped away with no one to claim it. It may return one day.`, 'title'); return null; }
  const top = rank.filter(r => Math.round(r.d * 1000) === Math.round(rank[0].d * 1000));
  let w = T(top[0].id), tie = '';
  if (top.length > 1) {
    for (const r of top.slice(1)) {
      const o = T(r.id), res = battle(w, o, 'rival', `Tiebreak for ${L.sp} · ${dn(o)}`);
      if (w.user || o.user) S.lastBattles.push(res);
      w = res.winner === 0 ? w : o;
    }
    tie = `, tied with ${top.filter(r => r.id !== w.id).map(r => dn(T(r.id))).join(' and ')}, then won the battle to settle it`;
  }
  const r = rank.find(x => x.id === w.id);
  const why = `${reason} ${dn(w)} did the most damage to it (${Math.round(r.d * 100)}% over ${r.n} attempt${r.n === 1 ? '' : 's'})${tie}:`;
  awardLegend(w, L.sp, why, force);
  return w;
}
function awardLegend(t, sp, why, force) {
  // your own trainer with a full team chooses who makes room, unless there's no time left to choose
  if (t.user && t.team.length >= 6 && !force) return joinLegend(t, sp, 'caught', why);
  if (t.team.length >= 6) { const out = t.team.filter(x => !isSpecial(x) && !(t.mega && t.mega.uid === x.uid) && x.bond !== t.id).sort((a, b) => monPower(a) - monPower(b))[0] || t.team.filter(x => !SP[x.sp].legend).sort((a, b) => monPower(a) - monPower(b))[0] || t.team[0]; farewell(t, out, `released to make room for ${sp}`); t.team = t.team.filter(x => x !== out); }
  const m = legendMon(t, sp); t.team.push(m); recordGreat(t, m, 'caught');
  news(`${why} ${sp} joined ${dn(t)}!`, t.user ? 'you' : 'title', t.id);
  return m;
}
// should this trainer spend the week on the legendary? Never if it has already been with them (it won't go back to a
// trainer it has left); not when gyms can't wait; not when they're too far behind the leader to catch up
// a legendary attempt is worth more experience than a lost gym battle, and more the more damage it did: about a third
// of the way from a loss to a training week for a typical attempt, up to most of a training week for a full defeat
const legendXp = (t, dealt) => PACE.loss + Math.max(0, trainGain(t) - PACE.loss) * (0.35 + 0.5 * clamp(dealt, 0, 1));
function wantsLegend(t) {
  const L = legendState(S.legend); if (!L || S.phase !== 'season' || t.role !== 'challenger' || legendBlocked(t, L.sp) || legendFull(t)) return false;
  const need = 8 - t.badges.length, weeksLeft = SEASON_WEEKS - S.week;
  if (need > 0 && weeksLeft <= need + 2) return false;
  if (topAvg(t, 3) < L.lvl - 30) return false;
  const mine = L.dmg[t.id] || 0, rank = legendRank(L), lead = rank.length ? rank[0].d : 0;
  const tries = Math.max(1, L.until - S.week);
  if (lead - mine > tries * 0.6) return false;
  const leading = rank.length && rank[0].id === t.id;
  return rand() < LEGEND_AI * (L.affinity && t.org === L.affinity ? 2 : 1) * (t.badges.length >= 8 ? 1.6 : 1) * (leading ? 1.5 : mine > 0 ? 1.25 : 1) * (L.attempts === 0 ? 1.3 : 1);
}
// each week: an encounter that ran out leaves; scheduled appearances and rare story events may begin
function legendWeek() {
  if (S.phase !== 'season') return;
  const L = S.legend;
  if (L && S.week + 1 >= L.until) settleLegend(`${L.sp} is about to leave ${L.town}!`);
  // gifts due (wings, Mewtwo, Arceus). A legendary only comes to its trainer out on the circuit: if they're the
  // Champion, Elite Four or a Gym Leader it waits for them (a box legendary defending the title tilts the League)
  for (const g of (S.legendGifts || []).filter(g => g.season < S.season || (g.season === S.season && g.week <= S.week + 1))) {
    const t = T(g.id);
    // a trainer who changed Leagues takes the gift with them, if that League has no one holding it yet
    if (!featOn('greatlegends') || !t || t.role === 'retired' || !inLeague(lgOf(t), () => greatFree(g.sp))) { S.legendGifts = S.legendGifts.filter(x => x !== g); continue; }
    if (t.role !== 'challenger') continue;
    S.legendGifts = S.legendGifts.filter(x => x !== g);
    inLeague(lgOf(t), () => joinLegend(t, g.sp, g.how, g.why));
  }
  glitchWeek();
  if (!featOn('greatlegends') || S.legend || S.legendSeason === S.season || S.week + 1 < 5 || S.week + 1 > 16) return;
  if (S.rayquazaDue === S.season && rand() < 0.3) { S.rayquazaDue = null; startLegend('Rayquaza'); return; }
  if ((everCaught('Dialga') || everCaught('Palkia')) && rand() < 0.02) { startLegend('Giratina'); return; }
  if ((everCaught('Reshiram') || everCaught('Zekrom')) && rand() < 0.02) { startLegend('Kyurem'); return; }
  // the villain-tied legendaries can also appear on their own now and then, no villain needed
  for (const [sp, why] of shuffle(LEGEND_FALLBACK.slice())) {
    if (!greatFree(sp) || rand() >= LEGEND_FALLBACK_CHANCE) continue;
    if (sp === 'Reshiram' || sp === 'Zekrom') {
      const key = sp === 'Reshiram' ? 'bnd' : 'str';
      const t = challengers().filter(x => x.team.length && !legendFull(x)).sort((a, b) => b.r[key] - a.r[key])[0];
      if (t) { joinLegend(t, sp, 'chosen', why); return; }
      continue;
    }
    if (startLegend(sp, why)) return;
  }
  if (rand() < 0.012) { const f = ['Koraidon', 'Miraidon', 'Terapagos'].filter(greatFree); if (f.length) { startLegend(pick(f)); return; } }
  if (rand() < 0.003) { startLegend('Eternatus'); return; }
  // v184: rare encounters of their own
  for (const sp of shuffle(['Regigigas', 'Darkrai', 'Cresselia', 'Deoxys', 'Heatran'])) if (rand() < RARE_ENCOUNTER && startLegend(sp)) return;
  // v185: legendaries from this league's own Pokédex, rarer still
  for (const sp of shuffle(DEX_LEGENDS.slice())) if (SP[sp] && SP[sp].dexLegend && rand() < DEX_LEGEND_CHANCE && startLegend(sp, `A legendary Pokémon no one has ever recorded has appeared: ${sp}.`)) return;
}
// v184: Missingno. Very rarely it glitches onto a random challenger's team (weighted toward those having a poor
// season, but anyone can get it). It stays 6–10 seasons, and now and then it glitches away mid-season.
function glitchWeek() {
  if (!featOn('greatlegends') || S.phase !== 'season') return;
  // leaving mid-season: never during the League, never as a trainer's last Pokémon
  for (const t of leagueTrainers()) {
    if (['retired', 'prospect'].includes(t.role) || !t.team || t.team.length <= 1) continue;
    const m = t.team.find(x => isGlitch(x.sp)); if (!m || rand() >= GLITCH_LEAVE) continue;
    const from = ((m.partners || []).slice(-1)[0] || { from: S.season }).from, seasons = (S.season || 1) - from + 1;
    farewell(t, m, `glitched away mid-season`);
    t.team = t.team.filter(x => x !== m);
    news(`${dn(t)}'s Missingno flickered, broke apart into static and was gone, partway through its ${seasons === 1 ? 'first' : glitchOrd(seasons)} season with them.`, t.user ? 'you' : 'title', t.id);
    if (['leader', 'e4', 'champion'].includes(t.role)) backfillElite(t, m);
  }
  if (S.week + 1 < 3 || S.week + 1 > 20 || !greatFree('Missingno') || rand() >= GLITCH_CHANCE) return;
  const pool = challengers().filter(t => t.team.length && !legendBlocked(t, 'Missingno') && !legendFull(t));
  if (!pool.length) return;
  // poor performers weigh up to four times as much: fewest badges, then worst record this season
  const score = t => t.badges.length * 3 + (t.weekLog || []).filter(e => e && e.won).length;
  const hi = Math.max(...pool.map(score)), lo = Math.min(...pool.map(score));
  const w = t => 1 + 3 * (hi === lo ? 0 : (hi - score(t)) / (hi - lo));
  let r = rand() * pool.reduce((a, t) => a + w(t), 0), t = pool[pool.length - 1];
  for (const x of pool) { r -= w(x); if (r <= 0) { t = x; break; } }
  joinLegend(t, 'Missingno', 'glitch', `Something went wrong. ${dn(t)}'s team list flickered, a row of static appeared at the bottom, and`);
}
const glitchOrd = n => n + (n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th');
// villain events that ran their course wake a legendary (or one stopped by a hero rewards them)
function villainLegend(team, hero) {
  if (!featOn('greatlegends')) return;
  if (!hero) {
    if (team === 'magma') startLegend('Groudon');
    else if (team === 'aqua') startLegend('Kyogre');
    else if (team === 'galactic') { const f = ['Dialga', 'Palkia'].filter(greatFree); if (f.length) startLegend(pick(f)); }
    else if (team === 'flare') startLegend('Yveltal');
    else if (team === 'plasma') {
      const f = ['Reshiram', 'Zekrom'].filter(greatFree); if (!f.length) return;
      const sp = pick(f), key = sp === 'Reshiram' ? 'bnd' : 'str';
      const t = challengers().filter(x => x.team.length && !legendFull(x)).sort((a, b) => b.r[key] - a.r[key])[0];
      if (t) joinLegend(t, sp, 'chosen', sp === 'Reshiram' ? `Team Plasma failed to control it: Reshiram, the dragon of truth, sought out the trainer with the deepest bond.` : `Team Plasma failed to control it: Zekrom, the dragon of ideals, sought out the strongest trainer.`);
    }
  } else if (team === 'flare' && greatFree('Xerneas')) { const h = heroFor(hero); if (h) joinLegend(h, 'Xerneas', 'chosen', `For stopping Team Flare, Xerneas appeared to ${h.name}.`); }
  // v184: Genesect for stopping Team Plasma; any other villain team stopped can draw a Sword of Justice (or Keldeo, to a young hero)
  else if (team === 'plasma' && greatFree('Genesect')) { const h = heroFor(hero); if (h) joinLegend(h, 'Genesect', 'chosen', `Team Plasma's revived Genesect broke free when they were stopped, and followed ${h.name}.`); }
  else if (rand() < SWORDS_CHANCE) {
    const h = heroFor(hero); if (!h) return;
    const sword = h.age < 20 && greatFree('Keldeo') ? 'Keldeo' : ({ str: 'Cobalion', trn: 'Terrakion', bnd: 'Virizion' })[['str', 'trn', 'bnd'].sort((a, b) => h.r[b] - h.r[a])[0]];
    if (greatFree(sword)) joinLegend(h, sword, 'chosen', sword === 'Keldeo' ? `Keldeo saw a young trainer stand up to ${VILLAIN_TEAMS[team] ? VILLAIN_TEAMS[team].name : 'a villain team'}, and came to fight beside ${h.name}.` : `For standing up to ${VILLAIN_TEAMS[team] ? VILLAIN_TEAMS[team].name : 'a villain team'}, the Sword of Justice ${sword} came to ${h.name}.`);
  }
}
// the hero a legendary rewards: the one who did it, unless they already have a legendary; then the challenger who did the
// most against the villains this season
const SWORDS_CHANCE = 0.35;
function heroFor(hero) {
  if (hero && !legendFull(hero)) return hero;
  return challengers().filter(x => x.team.length && !legendFull(x)).sort((a, b) => (b.weekLog || []).filter(w => w.raid && w.raid.won).length - (a.weekLog || []).filter(w => w.raid && w.raid.won).length)[0] || null;
}
// rivals: winning a rival battle can draw the heroes of the Slumbering Weald
function weald(w) {
  if (!featOn('greatlegends') || S.wealdSeason === S.season || rand() >= 0.08) return;
  const f = ['Zacian', 'Zamazenta'].filter(greatFree); if (!f.length || legendFull(w)) return;
  S.wealdSeason = S.season;
  joinLegend(w, pick(f), 'chosen', `Drawn by a rivalry fought out in full, the Slumbering Weald stirred.`);
}
// offseason: wings for Lugia and Ho-Oh (never to the same trainer), Mewtwo for a first title, Arceus for a collector
function legendOffseason(L, awards) {
  if (!featOn('greatlegends')) return;
  for (const t of leagueTrainers()) if (t.role !== 'retired' && t.team) noteLegends(t);
  const next = S.season + 1, gifts = S.legendGifts = S.legendGifts || [];
  const pending = sp => gifts.some(g => g.sp === sp);
  const champ = T(S.champion);
  // v184: a trainer already holding a legendary, or with one on its way, is passed over; the gift goes to the next in line
  const field = [...new Set([...S.challengers, ...L.entries.map(e => e.id)])].map(T).filter(x => x && x.role !== 'retired' && x.team && x.team.length);
  const open = x => x && !legendFull(x);
  const bySeason = (except) => field.filter(x => open(x) && !(except || []).includes(x.id)).sort((a, b) => seasonScore(b, L) - seasonScore(a, L));
  const give = (t, sp, how, why, note) => { gifts.push({ id: t.id, sp, how, season: next, week: ri(3, 14), why }); news(note, t.user ? 'you' : 'title', t.id); return t; };
  let silver = null;
  if (greatFree('Lugia') && !pending('Lugia')) {
    const t = open(champ) ? champ : bySeason()[0];
    if (t) silver = give(t, 'Lugia', 'wing', `Drawn by the Silver Wing ${t.name} received${t === champ ? ' as Champion' : ''},`, `${dn(t)} received a Silver Wing${t === champ ? '' : ' (the Champion already has a legendary partner)'}. Lugia may come for its bearer once they're out on the circuit.`);
  }
  if (greatFree('Ho-Oh') && !pending('Ho-Oh') && rand() < RAINBOW_CHANCE) {
    const toy = (awards || []).find(a => a.k === 'toy'); let t = toy && T(toy.id);
    // the wings never go to the same trainer, or to anyone with a legendary already: the Rainbow Wing passes to the next-best season
    if (!open(t) || (silver && t.id === silver.id)) t = bySeason(silver ? [silver.id] : [])[0] || null;
    if (t) give(t, 'Ho-Oh', 'wing', `Drawn by the Rainbow Wing ${t.name} received,`, `${dn(t)} received a Rainbow Wing. Ho-Oh may come for its bearer once they're out on the circuit.`);
  }
  // Mewtwo: Cerulean Cave opens to a challenger who won their first title this season
  if (open(champ) && L.startChamp !== champ.id && (champ.titleSeasons || []).length === 1 && greatFree('Mewtwo') && !pending('Mewtwo') && rand() < 0.5) {
    gifts.push({ id: champ.id, sp: 'Mewtwo', how: 'cave', season: next, week: ri(2, 10), why: `Cerulean Cave opened to the new Champion, and inside,` });
    news(`Rumors say Cerulean Cave has opened to ${dn(champ)}...`, champ.user ? 'you' : 'title', champ.id);
  }
  // Arceus (v184): now and then it appears to the trainer with the finest career who has never had a legendary at all,
  // and only once in a career
  if (greatFree('Arceus') && !pending('Arceus') && rand() < ARCEUS_CHANCE) {
    const career = x => (x.career.titles || 0) * 12 + (x.career.badges || 0) + (x.career.e4Wins || 0) * 2;
    const t = field.filter(x => open(x) && !x.arceusChosen && !(x.legendsEver || []).length && (x.seasons || 0) >= 3).sort((a, b) => career(b) - career(a))[0];
    if (t) { t.arceusChosen = next; gifts.push({ id: t.id, sp: 'Arceus', how: 'chosen', season: next, week: ri(4, 16), why: `After a long career without a single legendary partner, ${t.name} was found worthy:` }); news(`Something stirs at the Hall of Origin. ${dn(t)} has never had a legendary partner...`, t.user ? 'you' : 'title', t.id); }
  }
  // v184: legendaries that choose by character or by how a season went. Each looks for its trainer only some offseasons.
  const pickBy = (f, keep) => { const c = field.filter(x => open(x) && x.role === 'challenger' && (!keep || keep(x))); return c.length ? c.sort((a, b) => f(b) - f(a))[0] : null; };
  const wins = x => (x.weekLog || []).filter(w => (w.act === 'challenge' && w.won) || (w.road && w.road.won) || (w.raid && w.raid.won)).length;
  const kos = x => x.team.reduce((a, m) => a + (m.ss && m.ss.season === S.season ? m.ss.ko : 0), 0);
  for (const g of shuffle(CHARACTER_GIFTS)) {
    if (!greatFree(g.sp) || pending(g.sp) || rand() >= CHARACTER_CHANCE) continue;
    const t = pickBy(g.rank(x => ({ wins: wins(x), kos: kos(x), score: seasonScore(x, L) })), g.keep && (x => g.keep(x, L)));
    if (!t) continue;
    give(t, g.sp, 'chosen', g.why(t), `${g.sign(t)} ${g.sp} may come to ${dn(t)} next season.`);
  }
  // Rayquaza follows a season in which Groudon or Kyogre was caught
  if (S.greatCaught && ['Groudon', 'Kyogre'].some(sp => S.greatCaught[sp] && S.greatCaught[sp].season === S.season) && greatFree('Rayquaza')) S.rayquazaDue = next;
}
// v184: who each of these legendaries chooses. rank scores a challenger (higher is better); keep limits who can be chosen
const ARCEUS_CHANCE = 0.12, CHARACTER_CHANCE = 0.12, RAINBOW_CHANCE = 0.5;
// badges this season against last season's (a first season counts from none)
const improved = x => { const h = (x.seasonHist || []).filter(e => e.badges != null); const now = x.badges.length, before = h.length > 1 ? h[h.length - 2].badges : 0; return now - before + rand() * 0.5; };
const CHARACTER_GIFTS = [
  { sp: 'Uxie', rank: s => x => x.r.str, sign: t => `Uxie, the Being of Knowledge, has taken an interest in ${t.name}'s strategy.`, why: t => `Drawn by ${t.name}'s sharp mind,` },
  { sp: 'Mesprit', rank: s => x => x.r.bnd, sign: t => `Mesprit, the Being of Emotion, was moved by ${t.name}'s bond with their Pokémon.`, why: t => `Drawn by ${t.name}'s bond with their Pokémon,` },
  { sp: 'Azelf', rank: s => x => x.r.nrv, sign: t => `Azelf, the Being of Willpower, has noticed ${t.name}'s nerve.`, why: t => `Drawn by ${t.name}'s nerve,` },
  { sp: 'Glastrier', rank: s => x => x.r.trn, sign: t => `Hoofprints in the frost lead toward ${t.name}, the hardest trainer on the circuit.`, why: t => `Drawn by ${t.name}'s relentless training,` },
  { sp: 'Spectrier', rank: s => x => x.r.sct, sign: t => `Something unseen has been watching ${t.name}, the circuit's sharpest scout.`, why: t => `Drawn by ${t.name}'s keen eye,` },
  { sp: 'Pecharunt', rank: s => x => -x.r.bnd, sign: t => `Pecharunt has its eye on ${t.name}, whose bond with their Pokémon is the weakest on the circuit.`, why: t => `Sensing a weak bond to exploit,` },
  { sp: 'Volcanion', rank: s => x => s(x).kos, sign: t => `Steam rose from the mountains: Volcanion has heard of ${t.name}, who scored the most knockouts this season.`, why: t => `Drawn by ${t.name}'s knockouts,` },
  { sp: 'Victini', rank: s => x => s(x).wins, sign: t => `Victini, the Victory Pokémon, has been following ${t.name}, who won the most battles this season.`, why: t => `Drawn by ${t.name}'s run of victories,` },
  { sp: 'Marshadow', rank: s => x => (x.weekLog || []).filter(w => w.road && w.road.won).length, sign: t => `A shadow has been trailing ${t.name}, the road's top battler this season.`, why: t => `Stepping out of ${t.name}'s shadow,` },
  { sp: 'Zeraora', keep: x => x.badges.length >= 8 && x.badgeWeek, rank: s => x => -(x.badgeWeek || 99), sign: t => `Zeraora was seen racing alongside ${t.name}, the fastest through the badge circuit this season.`, why: t => `Drawn by ${t.name}'s speed,` },
  { sp: 'Magearna', rank: s => x => ovr(x), sign: t => `An old machine has been sent to ${t.name}, the circuit's best-rated challenger.`, why: t => `Built for a trainer like ${t.name},` },
  { sp: 'Meloetta', rank: s => x => s(x).score, sign: t => `A melody follows ${t.name}, who had the best season of any challenger.`, why: t => `Drawn by ${t.name}'s season,` },
  { sp: 'Jirachi', rank: s => x => rand(), sign: t => `The Millennium Comet passed overhead, and ${t.name}'s wish was the one Jirachi heard.`, why: t => `Granting ${t.name}'s wish,` },
  { sp: 'Celebi', rank: s => x => improved(x), sign: t => `Celebi passed through time to see ${t.name}, who came further this season than anyone.`, why: t => `Travelling through time to meet ${t.name},` },
  { sp: 'Diancie', keep: x => x.team.some(m => m.sp === 'Carbink'), rank: s => x => s(x).score, sign: t => `Diancie heard that ${t.name} looks after a Carbink.`, why: t => `Looking for the trainer who cares for Carbink,` },
];
// ================= WILD LEGENDARY EVENTS (v182) =================
// The legendaries below the great ones now come into the world through events that fit them, instead of as the
// Champion's reward. At most one roamer and one storm a season in each League (Landorus can follow a storm).
//  - Roamers (Raikou, Entei, Suicune, Latias, Latios): seen near one town at a time, moving on most weeks. A challenger
//    exploring on the way to that town's gym may find it among the week's wild Pokémon and catch it like any other
//    (v182: no battle). After 7–9 weeks it leaves the region.
//  - Storms (Articuno, Moltres, Zapdos, Tornadus, Thundurus, then Landorus): a front covers the whole region for four
//    weeks, changing the weather in every battle and powering up one type. The legendary inside it chooses the
//    challenger who won the most battles during the storm (at least STORM_MIN), whatever their type.
const ROAMERS = ['Raikou', 'Entei', 'Suicune', 'Latias', 'Latios', 'Okidogi', 'Munkidori', 'Fezandipiti'];
const ROAM_WEEKS = [7, 9], ROAM_CHANCE = 0.6, ROAM_FIRST = 2, ROAM_LAST = 15;
const ROAM_MEET = 0.25; // chance a challenger exploring near its town finds it among the week's wild Pokémon
const ROAM_STORY = {
  Raikou: 'Thunder cracked over {town} out of a clear sky. Raikou is roaming the region.',
  Entei: 'The ground near {town} rumbled like a volcano, and Entei was seen racing past. It is roaming the region.',
  Suicune: 'The water near {town} ran suddenly clear. Suicune is roaming the region.',
  Latias: 'A red-and-white blur streaked low over {town}. Latias is roaming the region.',
  Latios: 'A blue-and-white blur streaked low over {town}. Latios is roaming the region.',
  Okidogi: 'Something big and toxic has been seen prowling near {town}. Okidogi, one of the Loyal Three, is roaming the region.',
  Munkidori: 'A strange monkey was seen leaping between rooftops in {town}. Munkidori, one of the Loyal Three, is roaming the region.',
  Fezandipiti: 'A dazzling bird swept over {town}, leaving a sweet, poisonous scent. Fezandipiti, one of the Loyal Three, is roaming the region.',
};
// the town a challenger is working toward (their next gym); a trainer with all eight badges goes anywhere
const nearTown = t => (t.badges.length < 8 ? t.badges.length : null);
// the odds a challenger exploring this week finds the roamer: full near its town, half one town away, a third with all
// eight badges (they're anywhere on the road), none further off
function roamChance(t) {
  const R = S.roamer; if (!R || t.role !== 'challenger' || !t.team.length || legendBlocked(t, R.sp) || legendFull(t) || !greatFree(R.sp)) return 0;
  const near = nearTown(t), gap = near === null ? null : Math.abs(near - R.town);
  if (gap !== null && gap > 1) return 0;
  return ROAM_MEET * (gap === null ? 0.35 : gap === 1 ? 0.5 : 1);
}
function startRoamer(sp) {
  const town = ri(0, TOWNS.length - 1);
  S.roamer = { sp, town, from: S.week + 2, until: Math.min(SEASON_WEEKS, S.week + 1 + ri(ROAM_WEEKS[0], ROAM_WEEKS[1])), seen: 0, trail: [town] };
  S.roamSeason = S.season;
  news(`${ROAM_STORY[sp].replace('{town}', TOWNS[town])} Challengers exploring on the way to ${TOWNS[town]} Gym may find it among the wild Pokémon.`, 'title');
  logSky(`${sp} began roaming near ${TOWNS[town]}`);
}
// the roamer turns up in a challenger's wild Pokémon: in the open slot, at the level of their strongest Pokémon
function roamOffer(t, out, L) {
  if (!out.length || rand() >= roamChance(t)) return;
  const R = S.roamer, lvl = Math.max(L, Math.floor(Math.max(...t.team.map(m => m.lvl), L)));
  out[out.length - 1] = ensureMon({ sp: R.sp, lvl, roam: true, form: 1, iv: ivSet(() => ri(20, 31)) });
  R.seen++;
}
// a challenger caught the roamer
function roamCaught(t, m) {
  const R = S.roamer; S.roamer = null;
  m.met.how = 'roamer'; recordGreat(t, m, 'caught');
  catchNews(`${dn(t)} caught ${m.sp}, the roaming legendary, near ${TOWNS[R.town]}!`, t.user ? 'you' : 'title', t.id);
  logSky(`${dn(t)} caught ${m.sp} near ${TOWNS[R.town]}`);
}
function roamWeek() {
  if (S.phase !== 'season') return;
  const R = S.roamer;
  if (R) {
    if (S.week + 1 >= R.until || !greatFree(R.sp)) {
      S.roamer = null;
      news(`${R.sp} has left the region${R.seen ? `, after being spotted by ${R.seen} explorer${R.seen === 1 ? '' : 's'}` : ''}. It may roam here again one day.`, 'title');
      logSky(`${R.sp} left the region uncaught`);
      return;
    }
    if (rand() < 0.55) { R.town = pick(TOWNS.map((_, i) => i).filter(i => i !== R.town)); R.trail.push(R.town); }
    return;
  }
  // each season may have one roamer, planned when the season starts (about three seasons in five)
  if (!featOn('roamers') || S.roamSeason === S.season) return;
  if (!S.roamPlan || S.roamPlan.season !== S.season) S.roamPlan = { season: S.season, wk: rand() < ROAM_CHANCE ? ri(ROAM_FIRST, ROAM_LAST) : null };
  if (S.roamPlan.wk == null || S.week + 2 < S.roamPlan.wk) return;
  const free = ROAMERS.filter(greatFree); if (free.length) startRoamer(pick(free)); else S.roamSeason = S.season;
}
// a legendary from a wild event joins t: an AI trainer makes room themselves; you choose, unless the season's ending
function giveWildLegend(t, sp, how, why, force) {
  if (!greatFree(sp) || legendBlocked(t, sp) || legendFull(t)) { news(`${sp} slipped away. It may return one day.`, 'title'); return null; }
  if (t.user && t.team.length >= 6 && !force) return joinLegend(t, sp, how, why.replace(/[.!]$/, ':'));
  if (t.team.length >= 6) {
    const keep = m => (t.mega && t.mega.uid === m.uid) || m.bond === t.id;
    const out = t.team.filter(m => !isSpecial(m) && !keep(m)).sort((a, b) => monPower(a) - monPower(b))[0] || t.team.filter(m => !SP[m.sp].legend && !keep(m)).sort((a, b) => monPower(a) - monPower(b))[0] || t.team[0];
    farewell(t, out, `released to make room for ${sp}`); t.team = t.team.filter(x => x !== out);
  }
  const m = legendMon(t, sp); t.team.push(m); recordGreat(t, m, how);
  news(why, t.user ? 'you' : 'title', t.id);
  return m;
}

// ---------- storms ----------
// wx: the battle weather it brings (or none); type: the type it powers up; mul: the boost
// to that type's moves on top of any weather; at: the weeks it can begin (the season's 24 weeks run spring → winter)
const STORMS = {
  Moltres:   { name: 'Heat wave',     wx: 'sun',  type: 'Fire',     mul: 1,    at: [7, 11],  story: 'A scorching heat wave has settled over the region. Moltres has been seen burning across the sky.' },
  Articuno:  { name: 'Blizzard',      wx: 'snow', type: 'Ice',      mul: 1.15, at: [17, 20], story: 'An early blizzard has swept down from the north. Articuno is said to fly at its heart.' },
  Zapdos:    { name: 'Electric storm', wx: null,  type: 'Electric', mul: 1.2,  at: [2, 6],   story: 'Lightning storms are crackling across the region. Zapdos has been seen among the clouds.' },
  Thundurus: { name: 'Thunderstorm',  wx: 'rain', type: 'Electric', mul: 1.1,  at: [4, 14],  story: 'Thundurus has whipped up thunderstorms over the region, and the rain hasn\'t let up.' },
  Tornadus:  { name: 'Gale',          wx: null,   type: 'Flying',   mul: 1.2,  at: [4, 14],  story: 'Tornadus is loose, and fierce gales are tearing across the region.' },
  Landorus:  { name: 'Bountiful calm', wx: null,  type: 'Ground',   mul: 1.15, at: [8, 20],  story: 'Landorus has come down to calm the skies. The land feels rich and strong.' },
  // v184: Enamorus brings spring; the island guardians lay down terrain; the Treasures of Ruin curse the region; and now
  // and then a bird storm is its Galarian form's instead
  Enamorus:  { name: 'Bloom',         wx: null,   type: 'Fairy',    mul: 1.15, at: [2, 8],   story: 'Flowers burst open everywhere at once. Enamorus has brought spring to the region.' },
  'Tapu Koko': { name: 'Electric Terrain', wx: null, type: 'Electric', mul: 1.2, at: [3, 18], story: 'Tapu Koko, guardian of the islands, has charged the ground with electricity to test the region\'s trainers.' },
  'Tapu Lele': { name: 'Psychic Terrain',  wx: null, type: 'Psychic',  mul: 1.2, at: [3, 18], story: 'Tapu Lele, guardian of the islands, has scattered its strange glowing scales over the region.' },
  'Tapu Bulu': { name: 'Grassy Terrain',   wx: null, type: 'Grass',    mul: 1.2, at: [3, 18], story: 'Tapu Bulu, guardian of the islands, has made grass spring up over every battlefield.' },
  'Tapu Fini': { name: 'Misty Terrain',    wx: null, type: 'Fairy',    mul: 1.2, at: [3, 18], story: 'Tapu Fini, guardian of the islands, has wrapped the region in a dense, glittering mist.' },
  'Wo-Chien':  { name: 'Tablets of Ruin',  wx: null, cat: 'P', mul: 0.85, at: [3, 20], story: 'A stake was pulled from the ground, and Wo-Chien is free. Its curse weakens physical attacks everywhere.' },
  'Chien-Pao': { name: 'Sword of Ruin',    wx: null, cat: 'P', mul: 1.15, at: [3, 20], story: 'A stake was pulled from the ground, and Chien-Pao is free. Its curse shatters defenses everywhere.' },
  'Ting-Lu':   { name: 'Vessel of Ruin',   wx: null, cat: 'S', mul: 0.85, at: [3, 20], story: 'A stake was pulled from the ground, and Ting-Lu is free. Its curse weakens special attacks everywhere.' },
  'Chi-Yu':    { name: 'Beads of Ruin',    wx: null, cat: 'S', mul: 1.15, at: [3, 20], story: 'A stake was pulled from the ground, and Chi-Yu is free. Its curse melts special defenses everywhere.' },
  'Galarian Articuno': { name: 'Psychic haze', wx: null, type: 'Psychic', mul: 1.15, at: [17, 20], galar: 'Articuno', story: 'A cold, strange haze has drifted in. It isn\'t Articuno at its heart, but Galarian Articuno.' },
  'Galarian Zapdos':   { name: 'Stampede',     wx: null, type: 'Fighting', mul: 1.15, at: [2, 6],  galar: 'Zapdos', story: 'Something is running across the region faster than anything should. It isn\'t Zapdos, but Galarian Zapdos.' },
  'Galarian Moltres':  { name: 'Dark blaze',   wx: null, type: 'Dark',     mul: 1.15, at: [7, 11], galar: 'Moltres', story: 'Sinister purple flames are burning across the sky. It isn\'t Moltres, but Galarian Moltres.' },
};
const GALAR_STORM = 0.15; // the chance a bird storm is its Galarian form's
// what a storm does, in words
function stormFx(s) {
  const bits = [s.wx ? `${WEATHER_NAME[s.wx].toLowerCase()} in every battle` : ''];
  if (s.cat) bits.push(`${s.cat === 'P' ? 'physical' : 'special'} attacks do ${Math.round(Math.abs(s.mul - 1) * 100)}% ${s.mul > 1 ? 'more' : 'less'} damage`);
  else if (s.mul !== 1) bits.push(`${s.type} moves hit ${Math.round((s.mul - 1) * 100)}% harder`);
  return bits.filter(Boolean).join(', and ');
}
const STORM_WEEKS = 4, STORM_MIN = 3, STORM_CHANCE = 0.75, LANDORUS_CHANCE = 0.25;
const stormOn = () => S.phase === 'season' && S.storm ? STORMS[S.storm.sp] : null;
// every attack of the storm's type hits harder while it lasts
function stormMul(ty, phys) { const s = stormOn(); if (!s || s.mul === 1) return 1; if (s.cat) return (s.cat === 'P') === !!phys ? s.mul : 1; return ty === s.type ? s.mul : 1; }
function startStorm(sp, why) {
  const s = STORMS[sp];
  S.storm = { sp, type: s.type, from: S.week + 2, until: Math.min(SEASON_WEEKS, S.week + 1 + STORM_WEEKS), w: {}, ko: {} };
  S.stormSeason = S.season;
  if (sp === 'Tornadus' || sp === 'Thundurus') S.forcesStorm = S.season;
  news(`${why || s.story} ${s.name} until week ${S.storm.until}: ${stormFx(s)}. ${sp} will choose the challenger who wins the most battles while it lasts.`, 'title');
  logSky(`${s.name}: ${sp} brought it over the region`);
}
// battles won (and knockouts, to settle ties) by challengers while the storm lasts, every kind of battle counted.
// Whatever their type: a storm's legendary isn't drawn to Pokémon of its own type.
function stormWin(t, won, ko) {
  const st = S.storm; if (!st || S.phase !== 'season' || t.role !== 'challenger' || !inLg(t)) return;
  if (!st.w) { st.w = {}; st.ko = {}; } // a storm from an earlier build of v182 starts its tally afresh
  if (won) st.w[t.id] = (st.w[t.id] || 0) + 1;
  if (ko) st.ko[t.id] = (st.ko[t.id] || 0) + ko;
}
const stormRank = st => Object.keys(Object.assign({}, st.w || {}, st.ko || {})).map(id => ({ id: +id, w: (st.w || {})[id] || 0, k: (st.ko || {})[id] || 0 })).filter(r => { const t = T(r.id); return r.w && t && t.role === 'challenger' && t.team.length && !legendFull(t) && !legendBlocked(t, st.sp); }).sort((a, b) => b.w - a.w || b.k - a.k);
function settleStorm(force) {
  const st = S.storm; if (!st) return;
  S.storm = null;
  const s = STORMS[st.sp], top = stormRank(st)[0];
  if (!top || top.w < STORM_MIN || !greatFree(st.sp)) { news(`The ${s.name.toLowerCase()} has passed, and ${st.sp} went with it. No challenger stood out enough.`, 'title'); logSky(`${s.name} passed; ${st.sp} chose no one`); return; }
  const t = T(top.id);
  logSky(`${st.sp} chose ${dn(t)} (${top.w} wins in the ${s.name.toLowerCase()})`);
  giveWildLegend(t, st.sp, 'chosen', `As the ${s.name.toLowerCase()} passed, ${st.sp} came down to ${dn(t)}, who won ${top.w} battles in it, more than any other challenger.`, force);
}
function stormWeek() {
  if (S.phase !== 'season') return;
  if (S.storm) { if (S.week + 1 >= S.storm.until) settleStorm(S.week + 1 >= SEASON_WEEKS); return; }
  if (!featOn('storms')) return;
  const wk = S.week + 2; // the week it would begin
  // Landorus comes to calm the skies after Tornadus or Thundurus has stormed this season
  if (S.forcesStorm === S.season && S.stormSeason === S.season && S.landorusSeason !== S.season && wk <= STORMS.Landorus.at[1] && greatFree('Landorus') && rand() < LANDORUS_CHANCE) { S.landorusSeason = S.season; startStorm('Landorus'); return; }
  // each season may have one storm (about three seasons in four), planned when the season starts: which one, and a
  // week in its own part of the year, so the winter blizzard is as likely as the spring storms
  if (S.stormSeason === S.season) return;
  if (!S.stormPlan || S.stormPlan.season !== S.season) {
    const ok = Object.keys(STORMS).filter(sp => sp !== 'Landorus' && !STORMS[sp].galar && greatFree(sp));
    let sp = ok.length && rand() < STORM_CHANCE ? pick(ok) : null;
    const gal = sp && Object.keys(STORMS).find(k => STORMS[k].galar === sp);
    if (gal && greatFree(gal) && rand() < GALAR_STORM) sp = gal;
    S.stormPlan = { season: S.season, sp, wk: sp ? ri(Math.max(STORMS[sp].at[0], S.week + 2), Math.max(STORMS[sp].at[1], S.week + 2)) : null };
  }
  const P = S.stormPlan;
  if (P.sp && wk >= P.wk) { if (greatFree(P.sp) && wk <= STORMS[P.sp].at[1] + 1) startStorm(P.sp); else S.stormSeason = S.season; }
}
// a short record of the region's legendary sightings, newest first
function logSky(text) { (S.skyLog = S.skyLog || []).unshift({ season: S.season, week: S.week + 1, text }); S.skyLog.length = Math.min(S.skyLog.length, 40); }
// ================= MIDSEASON TOURNAMENT (v188) =================
// After week 12, every challenger in every League (team trainers and independents; never Gym Leaders, the Elite Four or a
// Champion) meets in one single-elimination bracket. Seeded by strength, so the top seeds get any byes. Battles count
// toward records like any other, on neutral terms (no Mega Evolution, no Battle Bond). Only the semifinals and the final
// keep a replay. The winner chooses an alpha of any Pokémon that isn't one of a kind (no legendaries, mythicals, baby
// legendaries, Ultra Beasts, Paradox Pokémon or one-of-a-kind finds), at the level of their strongest Pokémon.
const TOURNEY_WEEK = 12;
const tourneySpOk = sp => !!SP[sp] && customSpOk(sp) && !SP[sp].baby && !babyLine(sp) && !SP[sp].glitch;
let TOURNEY_SPECIES = null;
const tourneySpecies = () => TOURNEY_SPECIES || (TOURNEY_SPECIES = Object.keys(SP).filter(tourneySpOk).sort());
const tourneyRoundName = n => n === 2 ? 'Final' : n === 4 ? 'Semifinals' : n === 8 ? 'Quarterfinals' : `Round of ${n}`;
// standard bracket order for P slots: seed 1 meets seed P, and the top two seeds can only meet in the final
function seedOrder(P) { let o = [1]; while (o.length < P) { const n = o.length * 2 + 1; o = o.flatMap(x => [x, n - x]); } return o; }
const tourneyStrength = t => topAvg(t, 3) * 2 + teamPower(t) + ovr(t) / 4;
function tourneyField() {
  const out = [];
  for (let i = 0; i < nLeagues(); i++) inLeague(i, () => { for (const t of challengers()) if (t && t.role === 'challenger' && t.team && t.team.length) out.push(t); });
  return [...new Set(out)];
}
// v193: each season's tournament is played under one special rule, drawn when the season starts (or fixed in the
// league's Advanced options) and announced after week 8. Rules only change the tournament's own battles.
const TOURNEY_RULES = {
  inverse: { name: 'Inverse Battle', desc: 'The type chart is flipped: super-effective hits are not very effective, and resisted hits and immunities become super effective.' },
  nolegends: { name: 'Legendaries banned', desc: 'Legendaries, mythicals, Ultra Beasts, Paradox Pokémon and baby legendaries sit out. Trainers fight with the rest of their team.' },
  flat: { name: 'Flat levels', desc: "Every Pokémon fights at Lv 50, so training doesn't matter: species, moves, abilities and the trainer decide it." },
  trickroom: { name: 'Trick Room', desc: 'Slower Pokémon move first all tournament. Priority moves still go first.' },
  noitems: { name: 'Items off', desc: 'No held items: team against team.' },
  bring3: { name: 'Bring 3', desc: "Before each battle, both trainers see the other's team and bring the three Pokémon that match up best. Sharper trainers choose better." },
  scalemons: { name: 'Scalemons', desc: "Every Pokémon's stats are scaled so their base stats add up to 600, with HP left as it is. Weak species hit like strong ones, so typing and moves decide it." },
  flipped: { name: 'Flipped', desc: "Every Pokémon's base stats are reversed: HP swaps with Speed, Attack with Sp. Def, and Defense with Sp. Atk." },
  onevone: { name: '1v1', desc: "Each trainer sees the other's team and sends out the one Pokémon that matches up best. Sharper trainers choose better." },
  underdog: { name: 'Underdog Cup', desc: "Only each trainer's three lowest-level Pokémon battle. The bench decides it." },
};
const TOURNEY_RULE_WEEK = 8; // the drawn rule is announced after this week
const tourneyRuleCfg = () => (S.cfg && S.cfg.tourneyRule) || 'rotate';
const tourneyRulePool = () => Object.keys(TOURNEY_RULES).filter(k => k !== 'noitems' || itemsOn());
function drawTourneyRule() {
  const c = tourneyRuleCfg(); let k = null;
  if (c === 'rotate') { const last = (S.tourneyHist || []).slice(-1)[0], pool = tourneyRulePool().filter(x => !last || x !== last.rule); k = pick(pool.length ? pool : tourneyRulePool()); }
  else if (TOURNEY_RULES[c]) k = c;
  S.tourneyRule = { season: S.season, k };
}
// this season's rule (null: standard battles, or none drawn yet)
const tourneyRule = () => S.tourneyRule && S.tourneyRule.season === S.season ? S.tourneyRule.k : null;
// whether the rule is public yet: a rule fixed in the options always is; a rotating one is from week 8
const tourneyRuleKnown = () => tourneyRuleCfg() !== 'rotate' || S.week >= TOURNEY_RULE_WEEK || S.phase !== 'season';
const tourneyBanned = m => { const s = SP[m.sp]; return !!(s && (s.legend || s.paradox || s.baby || babyLine(m.sp))); };
// Bring 3 (and 1v1): the Pokémon that match up best against the other team (power, type matchups both ways)
function bringThree(t, opp, n = 3) {
  if (t.team.length <= n) return t.team;
  const oppT = opp.map(monTypes), sharp = clamp(((t.r && t.r.str) || 50) / 100, 0, 1);
  const score = m => {
    const atk = [...new Set((m.moves || []).map(n => MOVES[n]).filter(x => x && !x.utility && x.pw > 0).map(x => x.type))];
    if (!atk.length) atk.push(...monTypes(m));
    const off = oppT.reduce((a, d) => a + bestMult(atk, d), 0) / oppT.length, def = oppT.reduce((a, d) => a + bestMult(d, monTypes(m)), 0) / oppT.length;
    return monPower(m) * Math.sqrt(off / def) * (1 + (rand() - 0.5) * (1 - sharp) * 0.4);
  };
  const keep = new Set(t.team.map(m => ({ m, s: score(m) })).sort((x, y) => y.s - x.s).slice(0, n).map(x => x.m));
  return t.team.filter(m => keep.has(m));
}
function tourneyBattle(a, b, round) {
  const rule = tourneyRule(), R = rule ? TOURNEY_RULES[rule] : null;
  return inLeague(lgOf(a), () => {
    for (const t of [a, b]) if (itemsOn() && (!t.user || !t.itemsManual)) autoEquip(t, t === a ? b : a);
    // the rule may field only part of each team for this battle; the full teams come back afterwards
    const full = [a.team, b.team];
    if (rule === 'nolegends') for (const t of [a, b]) { const f = t.team.filter(m => !tourneyBanned(m)); if (f.length) t.team = f; }
    if (rule === 'bring3' || rule === 'onevone') { const n = rule === 'bring3' ? 3 : 1, pa = bringThree(a, full[1], n), pb = bringThree(b, full[0], n); a.team = pa; b.team = pb; }
    // Underdog Cup: the three lowest-level Pokémon, in team order
    if (rule === 'underdog') for (const t of [a, b]) if (t.team.length > 3) { const low = new Set(t.team.slice().sort((x, y) => x.lvl - y.lvl || monPower(x) - monPower(y)).slice(0, 3)); t.team = t.team.filter(m => low.has(m)); }
    let r;
    BATTLE_RULE = rule;
    try { r = battle(a, b, 'tourney', `Midseason Tournament ${round} · ${dn(a)} vs ${dn(b)}`, { equal: rule === 'flat' ? 50 : 0, ruleNote: R ? `Tournament rule: ${R.name}. ${R.desc}` : null }); }
    finally { BATTLE_RULE = null; a.team = full[0]; b.team = full[1]; }
    for (const t of [a, b]) if (itemsOn() && (!t.user || !t.itemsManual)) autoEquip(t);
    return r;
  });
}
function runTourney() {
  const field = tourneyField().sort((x, y) => tourneyStrength(y) - tourneyStrength(x));
  if (field.length < 2) return null;
  let P = 2; while (P < field.length) P *= 2;
  const T0 = S.tourney = { season: S.season, size: field.length, slots: P, entrants: field.map(t => t.id), rounds: [], winner: null, runner: null, semis: [], reward: null, rule: tourneyRule() };
  // round one: seeds in bracket order; a slot past the field is a bye
  let alive = seedOrder(P).map(sd => field[sd - 1] || null);
  while (alive.length > 1) {
    const n = alive.length, name = tourneyRoundName(n), keepLog = n <= 4, matches = [], next = [];
    for (let i = 0; i < n; i += 2) {
      const a = alive[i], b = alive[i + 1];
      if (!a || !b) { const w = a || b; if (w) { matches.push({ a: w.id, b: null, w: w.id, bye: true }); next.push(w); } else next.push(null); continue; }
      const r = tourneyBattle(a, b, name), w = r.winner === 0 ? a : b;
      const m = { a: a.id, b: b.id, w: w.id, left: r.sides[r.winner].left };
      if (keepLog) m.log = r;
      matches.push(m); next.push(w);
      if (n === 4) T0.semis.push(w === a ? b.id : a.id);
    }
    T0.rounds.push({ name, matches });
    alive = next;
  }
  const fin = T0.rounds[T0.rounds.length - 1].matches[0];
  const W = T(fin.w), R = T(fin.a === fin.w ? fin.b : fin.a);
  T0.winner = W.id; T0.runner = R ? R.id : null;
  (W.tourneyWins = W.tourneyWins || []).push(S.season);
  if (R) (R.tourneyFinals = R.tourneyFinals || []).push(S.season);
  const lvl = Math.max(5, Math.floor(Math.max(...W.team.map(m => m.lvl))));
  T0.reward = { id: W.id, lvl, sp: null };
  (S.tourneyHist = S.tourneyHist || []).push({ season: S.season, winner: W.id, winnerName: dn(W), runner: T0.runner, runnerName: R ? dn(R) : null, size: field.length, winnerOrg: W.org || null, sp: null, rule: T0.rule });
  if (S.tourneyHist.length > 200) S.tourneyHist.shift();
  const mine = W.user || (R && R.user) || field.some(t => t.user && T0.semis.includes(t.id));
  inLeague(lgOf(W), () => news(`${dn(W)} won the Season ${S.season} Midseason Tournament${T0.rule ? ` (${TOURNEY_RULES[T0.rule].name})` : ''}, beating ${R ? dn(R) : 'the field'} in the final (${field.length} challengers${nLeagues() > 1 ? ' from every League' : ''}). The prize: an alpha of their choice.`, mine ? 'you' : 'title', W.id));
  if (W.user) { S.tourneyOffer = { id: W.id, lvl }; news(`${dn(W)} won the Midseason Tournament! Choose the alpha Pokémon they receive.`, 'you', W.id); }
  else tourneyPick(W.id, aiTourneyChoice(W));
  return T0;
}
// what an AI winner asks for: a strong Pokémon of their type, from a line they don't already have
function aiTourneyChoice(t) {
  const lines = new Set(t.team.map(m => LINE[m.sp]));
  const sc = sp => SP[sp].bst * (specFit(t, sp) === 2 ? 1.25 : onSpec(t, sp) ? 1.15 : t.specialty ? 0.9 : 1) + rand() * 40;
  return tourneySpecies().filter(sp => !lines.has(LINE[sp]) && !bannedIn(sp, lgOf(t))).sort((a, b) => sc(b) - sc(a))[0] || tourneySpecies()[0];
}
// give the prize: sp must be allowed; with a full team, releaseUid makes room (AI: the weakest ordinary Pokémon)
function tourneyPick(id, sp, releaseUid) {
  const t = T(id), T0 = S.tourney;
  if (!t || !T0 || !T0.reward || T0.reward.id !== id || T0.reward.sp || !tourneySpOk(sp) || bannedIn(sp, lgOf(t))) return null;
  if (t.role === 'retired' || !t.team) { T0.reward.sp = '—'; S.tourneyOffer = null; return null; }
  if (t.team.length >= 6) {
    let out = releaseUid != null ? t.team.find(m => m.uid === releaseUid) : null;
    if (!out && !t.user) out = t.team.filter(m => !isSpecial(m) && !(t.mega && t.mega.uid === m.uid) && m.bond !== t.id).sort((a, b) => monPower(a) - monPower(b))[0] || t.team.filter(m => !isLegendLine(m.sp)).sort((a, b) => monPower(a) - monPower(b))[0];
    if (!out) return null;
    farewell(t, out, `released to make room for the tournament prize`); t.team = t.team.filter(m => m !== out);
  }
  const m = ensureMon({ uid: uid(), sp, lvl: T0.reward.lvl, alpha: true, form: 1.5, iv: ivSet(() => ri(28, 31)) });
  m.met = { how: 'tourney', season: S.season, week: TOURNEY_WEEK }; m.metFr = 1; m.fr = 120;
  if (t.role === 'champion') m.cap = Math.max(...t.team.map(x => x.cap || x.lvl), m.lvl);
  t.team.push(m);
  T0.reward.sp = sp;
  const h = (S.tourneyHist || []).find(x => x.season === T0.season && x.winner === id); if (h) h.sp = sp;
  if (S.tourneyOffer && S.tourneyOffer.id === id) S.tourneyOffer = null;
  inLeague(lgOf(t), () => catchNews(`${dn(t)} chose an alpha ${sp} as the Midseason Tournament prize.`, t.user ? 'you' : 'title', t.id));
  return m;
}
// a prize the player never chose is decided for them when the League starts (or a sim runs past it)
function settleTourneyOffer() {
  const o = S.tourneyOffer; if (!o) return;
  const t = T(o.id); if (!t) { S.tourneyOffer = null; return; }
  if (!tourneyPick(o.id, aiTourneyChoice(t), t.team.length >= 6 ? t.team.filter(m => !isSpecial(m)).sort((a, b) => monPower(a) - monPower(b))[0]?.uid ?? t.team.slice().sort((a, b) => monPower(a) - monPower(b))[0].uid : null)) S.tourneyOffer = null;
}

// ================= TEAMS =================
const ORGS = {
  // sponsors (internal keys kept from the original team names so older saves still load)
  rocket:   { name: 'Silph Co.',          short: 'Silph',     mark: 'S', color: '#B3263A', mascot: 'Porygon',    likes: ['Normal', 'Electric', 'Poison'], blurb: "Kanto's tech giant, makers of the Poké Ball and Porygon. They fund Normal, Electric and Poison specialists." },
  galactic: { name: 'Diamond Clan',       short: 'Diamond',   mark: '◆', color: '#4F6FA3', mascot: 'Dialga',     likes: ['Dragon', 'Steel', 'Psychic'], blurb: "Hisui's devotees of Dialga, who recruit Dragon, Steel and Psychic trainers." },
  magma:    { name: 'Devon Corporation',  short: 'Devon',     mark: 'D', color: '#607D8B', mascot: 'Metagross',  likes: ['Steel', 'Rock', 'Ground'], blurb: "Hoenn's engineering powerhouse, backing Steel, Rock and Ground specialists." },
  aqua:     { name: 'Pearl Clan',         short: 'Pearl',     mark: '●', color: '#9C6FB5', mascot: 'Palkia',     likes: ['Water', 'Ice', 'Flying'], blurb: "Hisui's Palkia-revering clan, at home with Water, Ice and Flying trainers." },
  plasma:   { name: 'Blueberry Academy',  short: 'Blueberry', mark: 'B', color: '#2E86AB', mascot: 'Terapagos',  likes: ['Dragon', 'Ice', 'Water'], blurb: "Unova's battle-mad school by the sea, strongest with Dragon, Ice and Water trainers." },
  flare:    { name: 'Macro Cosmos',       short: 'Macro',     mark: 'M', color: '#B08A2E', mascot: 'Copperajah', likes: ['Fire', 'Psychic', 'Fairy'], blurb: "Galar's energy conglomerate, courting Fire, Psychic and Fairy specialists." },
  skull:    { name: 'Team Yell',          short: 'Yell',      mark: 'Y', color: '#D6336C', mascot: 'Morpeko',    likes: ['Dark', 'Poison', 'Fighting'], blurb: "Marnie's loudest fans, and scrappy backers of Dark, Poison and Fighting trainers." },
  star:     { name: 'Naranja Academy',    short: 'Naranja',   mark: 'N', color: '#E8731A', mascot: 'Koraidon',   likes: ['Fighting', 'Fairy', 'Grass'], blurb: "Paldea's oldest academy, turning out Fighting, Fairy and Grass specialists." },
  // sponsors with no type preference: they draft on ability alone
  galaxy:   { name: 'Galaxy Expedition Team', short: 'Galaxy', mark: 'G', color: '#2C3E50', mascot: 'Arceus',   likes: [], blurb: "Jubilife Village's survey corps. They sign whoever looks strongest, whatever the type." },
  frontier: { name: 'Battle Frontier',  short: 'Frontier', mark: 'F', color: '#8D6E63', mascot: 'Ditto',    likes: [], blurb: 'Collectors of champions who back raw talent over any one type.' },
  uva:      { name: 'Uva Academy',      short: 'Uva',      mark: 'U', color: '#6A1B9A', mascot: 'Miraidon', likes: [], blurb: "Naranja's sister school, judging every prospect on ability alone." },
  fanclub:  { name: 'Pokémon Fan Club', short: 'Fan Club', mark: 'C', color: '#43A047', mascot: 'Eevee',    likes: [], blurb: 'They love every Pokémon equally, and draft the same way.' },
};
const ALL_ORG_KEYS = Object.keys(ORGS);
// league size is chosen at setup: 4 or 8 teams, 1–3 trainers each. These follow the current league (see applyCfg).
let ORG_KEYS = ALL_ORG_KEYS.slice(0, 4);
let ROSTER = 3;
function applyCfg() {
  S.cfg = S.cfg || { teams: 4, roster: 3 };
  S.cfg.leagues = S.cfg.leagues || 1;
  if (!S.leagues) { S.leagues = [null]; S.lg = 0; }
  if (!S.towns) { S.towns = LEAGUE_SETS[S.lg || 0].towns.slice(); S.lgName = LEAGUE_SETS[S.lg || 0].name; }
  TOWNS = S.towns;
  for (const t of Object.values(S.trainers || {})) if (t.role === 'retired' && t.weekLog && t.weekLog.length) compactRetired(t);
  if (S.history && (S.season || 0) < FOUNDER_SEASONS) eachLeague(() => { const h = S.history[0], f = h && T(h.prevChamp); if (f) f.foundingChamp = true; else if (!S.history.length && T(S.champion)) T(S.champion).foundingChamp = true; });
  fixHallOfFame();
  if (S && S.trainers) { repairLeagues(); repairLevels(); backfillLeagueTags(); adoptLegends(); orderOffers(); }
  ORG_KEYS = S.orgKeys || (S.orgKeys = ALL_ORG_KEYS.filter(k => S.orgs && S.orgs[k]));
  ROSTER = S.cfg.roster;
}
// ---------- several Leagues ----------
// Each League keeps its own gyms, Elite Four, Champion, circuit, events and history. The bound League's state sits
// directly on S (so S.gyms is always "this League's gyms"); the others wait in S.leagues until bound.
const LEAGUE_FIELDS = ['gyms', 'e4', 'champion', 'challengers', 'event', 'legend', 'legendSeason', 'legendGifts', 'legendOffers', 'greatCaught', 'rayquazaDue', 'wealdSeason', 'shadowWild', 'outbreak', 'outbreakLog', 'wormhole', 'metaMons', 'meta', 'league', 'history', 'eventLog', 'seatBattles', 'lastBattles', 'snagOffers', 'snagPick', 'tradeOffers', 'stats', 'towns', 'lgName', 'pkrsSeason', 'legendPool', 'roamer', 'roamSeason', 'storm', 'stormSeason', 'forcesStorm', 'landorusSeason', 'skyLog', 'roamPlan', 'stormPlan', 'bans', 'banBallot', 'banLog'];
const nLeagues = () => (S && S.leagues ? S.leagues.length : 1);
const lgOf = t => (t && t.lg) || 0;
// the League that actually lists a trainer (circuit or post); falls back to their tag. Used before anything that
// moves a trainer, so a stale tag can never act on the wrong League (v163)
function dropFromCircuits(id) {
  S.challengers = S.challengers.filter(x => x !== id);
  for (const L of S.leagues || []) if (L && L !== S) L.challengers = L.challengers.filter(x => x !== id);
}
function homeLeague(t) {
  if (!t || !S.leagues || S.leagues.length < 2) return lgOf(t);
  for (let i = 0; i < S.leagues.length; i++) {
    const L = i === (S.lg || 0) ? S : S.leagues[i];
    if (L && (L.champion === t.id || L.e4.includes(t.id) || L.challengers.includes(t.id) || L.gyms.some(g => g.leader === t.id))) return i;
  }
  return lgOf(t);
}
const inLg = t => lgOf(t) === (S.lg || 0);
function useLeague(i) {
  i = i || 0;
  if (!S.leagues || i === (S.lg || 0) || i >= S.leagues.length) return;
  stampLeague();
  const out = {};
  for (const f of LEAGUE_FIELDS) out[f] = S[f];
  S.leagues[S.lg || 0] = out;
  const inn = S.leagues[i];
  for (const f of LEAGUE_FIELDS) S[f] = inn[f];
  S.leagues[i] = null; S.lg = i;
  TOWNS = S.towns;
}
// run fn with League i bound, then put back whichever League was bound before
let LG_CTX = 0; // > 0 while code runs for one League in particular (its news is tagged with that League)
function inLeague(i, fn) { const was = S.lg || 0; useLeague(i); LG_CTX++; try { return fn(); } finally { LG_CTX--; useLeague(was); } }
function eachLeague(fn) { const out = []; for (let i = 0; i < nLeagues(); i++) out.push(inLeague(i, () => fn(i))); return out; }
const leagueName = i => i == null || i === (S.lg || 0) ? S.lgName : (S.leagues[i] ? S.leagues[i].lgName : LEAGUE_SETS[i].name);
const lgShort = i => leagueName(i).replace(' League', '');
// trainers on this League's circuit and in its posts
function leagueTrainers() { return Object.values(S.trainers).filter(inLg); }
// put every trainer the bound League holds on its books
function stampLeague() { for (const id of [...S.challengers, ...S.e4, S.champion, ...S.gyms.map(g => g.leader)]) { const t = T(id); if (t) t.lg = S.lg || 0; } }
// a team's trainers in one League; each League takes ROSTER of them
function lgRoster(k, i = S.lg || 0) { return org(k).roster.filter(id => lgOf(T(id)) === i); }
// the League where a team has room, the emptiest first (null when full everywhere)
function openLeague(k) {
  let best = null, n = Infinity;
  for (let i = 0; i < nLeagues(); i++) { const c = lgRoster(k, i).length; if (c < ROSTER && c < n) { best = i; n = c; } }
  return best;
}
// v163: before this fix a trainer could end up listed in two Leagues at once (a post in one, the circuit of the other)
// or keep a post after being retired by mistake, and be inducted into the Hall of Fame more than once. Older saves
// are put right on load: one place per trainer, retired trainers' posts go to outsiders, one Hall of Fame entry each.
function repairLeagues() {
  if (!S || !S.trainers) return 0;
  S.hof = [...new Set(S.hof || [])];
  if (!S.leagues || S.leagues.length < 2) return 0;
  let fixed = 0;
  const home = S.lg || 0;
  // pass 1: who holds a post where
  const posts = {};
  for (let i = 0; i < S.leagues.length; i++) inLeague(i, () => {
    const add = (id, p) => { if (id != null) (posts[id] = posts[id] || []).push({ i, ...p }); };
    add(S.champion, { k: 'champion' });
    S.e4.forEach((id, j) => add(id, { k: 'e4', j }));
    S.gyms.forEach((g, j) => add(g.leader, { k: 'leader', j }));
  });
  // pass 2: posts held by retired trainers, or held twice, go to outsiders (a Champion is never replaced)
  for (const [id, ps] of Object.entries(posts)) {
    const t = T(id); if (!t) continue;
    let keep = t.role === 'retired' ? null : (ps.find(p => p.k === t.role && p.i === lgOf(t)) || ps.find(p => p.k === t.role) || ps[0]);
    for (const p of ps) {
      if (p === keep) continue;
      if (p.k === 'champion') { if (t.role === 'retired') { t.role = 'champion'; t.retiredSeason = null; keep = p; fixed++; } continue; }
      inLeague(p.i, () => {
        if (p.k === 'e4') outsiderE4(p.j);
        else installElite(newTrainer({ age: ri(26, 44), quality: 52 + p.j * 2, role: 'leader' }), 'leader', p.j);
      });
      fixed++;
    }
    if (keep) { t.lg = keep.i; dropFromCircuits(t.id); if (t.role !== keep.k && t.role !== 'retired') t.role = keep.k; }
  }
  // pass 3: one circuit per challenger; nobody else on a circuit
  const seen = new Set();
  for (let i = 0; i < S.leagues.length; i++) inLeague(i, () => {
    S.challengers = S.challengers.filter(id => {
      const t = T(id), ok = t && t.role === 'challenger' && !seen.has(id);
      if (ok) { seen.add(id); if (t.lg !== i) { t.lg = i; fixed++; } } else fixed++;
      return ok;
    });
  });
  // a challenger listed nowhere goes back to the circuit their tag names
  for (const t of Object.values(S.trainers)) if (t.role === 'challenger' && !seen.has(t.id)) { inLeague(lgOf(t), () => S.challengers.push(t.id)); fixed++; }
  if (home !== (S.lg || 0)) useLeague(home);
  return fixed;
}
// v165: accomplishments name their League. Saves from before v165 get the League filled in wherever the League's
// own records show it: titles and Champion seasons (season history), awards, Gym Leader stints and comebacks (gym
// logs), interim titles (the Champion they beat), your trainers' seasons (your results), and posts still held.
// Anything the records can't place keeps no League.
function backfillLeagueTags() {
  if (!S || !S.trainers || nLeagues() < 2) return;
  const champ = {}, award = {}, start = {}, mine = {}, gym = {}, range = (a, b) => { const o = []; for (let x = a; x <= b; x++) o.push(x); return o; };
  eachLeague(i => {
    for (const h of S.history || []) {
      champ[h.champ + '|' + h.season] = i;
      if (h.prevChamp != null) start[h.prevChamp + '|' + h.season] = i;
      for (const a of h.awards || []) award[a.id + '|' + h.season + '|' + a.k] = i;
      for (const r of h.userResults || []) mine[r.id + '|' + h.season] = i;
    }
    for (const g of S.gyms || []) for (const x of g.hist || []) gym[x.leader + '|' + x.season] = i;
  });
  const now = S.season || 1;
  for (const t of Object.values(S.trainers)) {
    const id = t.id, has = o => o && o.lg != null;
    if ((t.titleSeasons || []).length && (!t.titleLgs || t.titleLgs.length !== t.titleSeasons.length))
      t.titleLgs = t.titleSeasons.map(s => champ[id + '|' + s] ?? null);
    for (const a of t.awards || []) if (!has(a)) { const v = award[id + '|' + a.season + '|' + a.k]; if (v != null) a.lg = v; }
    for (const m of t.team.concat(t.alumni || [])) for (const a of m.awards || []) if (!has(a)) { const v = award[id + '|' + a.season + '|' + a.k]; if (v != null) a.lg = v; }
    for (const c of t.comebacks || []) if (!has(c)) { const v = gym[id + '|' + c.season]; if (v != null) c.lg = v; }
    for (const x of t.interim || []) if (!has(x)) { const v = start[x.beat + '|' + x.season]; if (v != null) x.lg = v; }
    for (const h of t.seasonHist || []) if (!has(h)) { const v = champ[id + '|' + h.season] != null && h.role === 'champion' ? champ[id + '|' + h.season] : mine[id + '|' + h.season]; if (v != null) h.lg = v; }
    const posts = t.posts || [];
    posts.forEach((p, j) => {
      if (has(p)) return;
      const yrs = range(p.from, p.to == null ? now : p.to);
      let v = null;
      if (p.role === 'leader') for (const y of yrs) { if (gym[id + '|' + y] != null) { v = gym[id + '|' + y]; break; } }
      if (p.role === 'champion') for (const y of yrs) { if (champ[id + '|' + y] != null) { v = champ[id + '|' + y]; break; } }
      if (v == null && p.to == null && j === posts.length - 1 && ['leader', 'e4', 'champion'].includes(t.role)) v = homeLeague(t);
      if (v != null) p.lg = v;
    });
  }
}
// the Hall of Fame is for Champions only; older saves may hold trainers inducted under the old rules
function fixHallOfFame() {
  if (!S || !S.trainers) return;
  S.hof = (S.hof || []).filter(id => { const t = S.trainers[id]; const ok = t && t.career.titles >= 1; if (t && !ok) t.hof = false; return ok; });
  for (const t of Object.values(S.trainers)) if (t.role === 'retired' && t.career.titles >= 1 && !S.hof.includes(t.id)) { t.hof = true; S.hof.push(t.id); }
}
// the circuit holds about 20 challengers: independents fill whatever the teams don't (at least 6)
const CIRCUIT_SIZE = 24; // challengers on the circuit: team trainers plus independents
const indieCap = () => Math.max(8, CIRCUIT_SIZE - ORG_KEYS.length * ROSTER);
const draftClassSize = () => Math.max(8, Math.round(ORG_KEYS.length * ROSTER * 0.6) + 4) * nLeagues();
const START_TEAM = 3; // Pokémon a challenger may register at the start of a season
function org(k) { return S.orgs[k]; }
// positions held (Gym Leader, Elite Four, Champion) and team history, for the Trainers tab
function postPlace(t, role) {
  if (role === 'leader') { const i = S.gyms.findIndex(g => g.leader === t.id); return i >= 0 ? `${TOWNS[i]} Gym` : 'Gym'; }
  if (role === 'e4') { const i = S.e4.indexOf(t.id); return i >= 0 ? `Elite Four #${i + 1}` : 'Elite Four'; }
  return 'Champion';
}
const curSeason = () => S.phase === 'season' || S.phase === 'league' ? S.season : S.season + 1;
function closePost(t) { const p = (t.posts || []).find(x => x.to == null); if (p) p.to = Math.max(p.from, S.season || 1); }
function openPost(t, role) { closePost(t); (t.posts = t.posts || []).push({ role, place: postPlace(t, role), from: curSeason(), to: null, lg: S.lg || 0 }); }
function joinOrg(t, k) { (t.teams = t.teams || []).push({ org: k, from: curSeason(), to: null });
  t.org = k; if (!S.orgs[k].roster.includes(t.id)) S.orgs[k].roster.push(t.id); t.user = k === S.userOrg; }
function leaveOrg(t) {
  if (!t.org) return;
  const o = S.orgs[t.org]; o.roster = o.roster.filter(x => x !== t.id);
  const h = (t.teams || []).find(x => x.org === t.org && x.to == null); if (h) h.to = Math.max(h.from, S.season || 1);
  if (t.user) t.formerUser = true;
  t.prevOrg = t.org; t.org = null; t.user = false;
}
function userTrainers() { return S.userOrg ? S.orgs[S.userOrg].roster.map(T) : []; }
function orgName(k) { return k ? ORGS[k].name : 'Independent'; }
// season points: 1 per badge, 3 for reaching the League, 2 per Elite Four win, 10 for the title, 3 per title defense
function trainerPoints(t, L) {
  let p = t.badges ? t.badges.length : 0;
  if (L) {
    const e = L.entries.find(x => x.id === t.id);
    if (e) p += 3 + Math.min(4, e.stage) * 2 + (e.stage === 5 ? (e.interim ? 5 : 10) : 0);
  }
  return p;
}
// title defenses are credited to the team the Champion represented when they won
function defensePoints(k, L) { return L ? (L.entries.filter(e => e.stage === 4 && T(e.lostTo) && T(e.lostTo).champOrg === k).length + (L.e4Shot && !L.e4Shot.won && T(L.startChamp) && T(L.startChamp).champOrg === k ? 1 : 0)) * 3 : 0; }
function orgStandings(L) {
  return ORG_KEYS.map(k => { const legacy = legacyPoints(k); return { key: k, legacy, pts: org(k).roster.filter(id => T(id).role !== 'champion').reduce((a, id) => a + trainerPoints(T(id), L), 0) + defensePoints(k, L) + legacy }; }).sort((a, b) => b.pts - a.pts);
}
// the Team Cup: every League's points added up, plus the World Championship
function cupStandings() {
  if (nLeagues() === 1) return orgStandings(S.league);
  const pts = {};
  eachLeague(i => { const L = S.league; for (const k of ORG_KEYS) pts[k] = (pts[k] || 0) + lgRoster(k, i).filter(id => T(id).role !== 'champion').reduce((a, id) => a + trainerPoints(T(id), L), 0) + defensePoints(k, L); });
  const W = S.worlds;
  return ORG_KEYS.map(k => { const legacy = legacyPoints(k); const world = W ? (W.winnerOrg === k ? WORLD_PTS.win : 0) + (W.runnerOrg === k ? WORLD_PTS.final : 0) : 0; return { key: k, legacy, world, pts: pts[k] + legacy + world }; }).sort((a, b) => b.pts - a.pts);
}
function champOrg() { const c = T(S.champion); return c ? c.champOrg || null : null; }

// ================= SEASON =================
function doAction(t, act, userCatch) {
  // a gym held by Team Skull can't be challenged; a closed plan falls back to training
  if (act === 'challenge' && t.role === 'challenger' && gymClosed(t.badges.length)) act = 'train';
  if (act === 'raid' && (t.role !== 'challenger' || !eventFoe())) act = 'train';
  // v183: there's no Purify week any more; an old saved Purify plan trains instead
  if (act === 'purify') act = 'train';
  if (act === 'seek' && (t.role !== 'challenger' || !S.legend || legendBlocked(t, S.legend.sp))) act = 'train';
  const entry = { wk: S.week + 1, act };
  const lvBefore = new Map(t.team.map(m => [m.uid, m.lvl]));
  const shadows = t.team.filter(m => m.shadow); // Pokémon caught this week don't start opening up until next week
  let evos = [];
  if (act === 'seek') {
    const res = legendBattle(t, entry);
    if (res && t.user) S.lastBattles.push(res);
    evos = gainLevels(t, entry.legend ? legendXp(t, entry.legend.dealt / 100) : PACE.loss);
  } else if (act === 'raid') {
    const res = raidBattle(t, entry);
    if (res && t.user) S.lastBattles.push(res);
    evos = gainLevels(t, entry.raid && entry.raid.won ? PACE.win : PACE.loss);
  } else if (act === 'challenge' && t.role === 'challenger' && t.badges.length < 8) {
    const g = t.badges.length, gym = S.gyms[g], leader = T(gym.leader);
    const autoItems = itemsOn() && (!t.user || !t.itemsManual);
    if (autoItems) autoEquip(t, leader); // items picked for this gym
    const res = battle(t, leader, 'gym', `${TOWNS[g]} Gym · Badge ${g + 1}`);
    if (autoItems) autoEquip(t); // back to the everyday set (Lucky Egg and the like)
    entry.gym = g; entry.won = res.winner === 0; entry.opp = leader.id;
    if (entry.won) {
      t.badges.push(g); t.career.badges++; t.career.gymW++; gym.l++;
      gymLost(g, t);
      if (t.badges.length === 8) { t.badgeWeek = S.week + 1; earnMega(t); }
      gymItemOffer(t, g, leader);
      evos = gainLevels(t, PACE.win);
      if (t.user) news(`${dn(t)} earned the ${TOWNS[g]} Badge, beating ${dn(leader)}.`, 'you', t.id);
    } else {
      t.career.gymL++; gym.w++; gym.streak = 0;
      evos = gainLevels(t, PACE.loss);
    }
    if (t.user) S.lastBattles.push(res);
    entry.left = res.sides[0].left;
    for (const m of shadows) openHeart(t, m, HEART_GYM);
  } else if (act === 'explore') {
    // userCatch undefined = let the trainer decide; null = skipped the catch
    const m = userCatch === undefined ? aiCatch(t) : userCatch ? addCatch(t, userCatch.offer, userCatch.release) : null;
    const ob = activeOutbreak();
    if (m && ob && LINE[m.sp] === LINE[ob.sp]) { ob.caught++; if (m.alpha) ob.alpha++; if (m.shiny) ob.shiny++; if (t.user) ob.user = true; entry.outbreak = true; }
    if (m) { entry.caught = m.sp; if (m.alpha) entry.alpha = true; if (m.shiny) entry.shiny = true; if (m.delta) entry.delta = m.delta;
      if (m.delta) catchNews(`${dn(t)} caught a Delta ${m.sp}, an unusual ${monTypes(m).join('/')} type${m.deltaAb && featOn('abilities') ? ` with an unusual ability, ${m.deltaAb}` : ''}!`, t.user ? 'you' : 'circuit', t.id);
      if (m.shiny) catchNews(`${dn(t)} caught a shiny ${m.alpha ? 'alpha ' : ''}${m.sp}!`, t.user ? 'you' : 'circuit', t.id);
      else if (m.alpha) catchNews(`${dn(t)} caught an alpha ${m.sp}!`, t.user ? 'you' : 'circuit', t.id); }
    { const found = exploreFind(t); if (found) { entry.found = found; if (t.user) news(`${dn(t)} found a ${itemName(found)} while exploring.`, 'you', t.id); } }
    // the wormhole closes once its trainer has explored there, caught or not
    if (S.wormhole && S.wormhole.id === t.id) { const w = S.wormhole; S.wormhole = null; if (!m || m.sp !== w.sp) catchNews(`${w.sp} slipped back through the Ultra Wormhole before ${t.name} could catch it.`, t.user ? 'you' : 'circuit', t.id); }
    for (const m of shadows) openHeart(t, m, HEART_EXPLORE);
    evos = gainLevels(t, PACE.explore);
  } else {
    entry.act = 'train';
    for (const m of t.team) if (m.shadow) openHeart(t, m, HEART_TRAIN); else m.fr = Math.min(255, (m.fr ?? 70) + 1 + Math.round(t.r.bnd / 50));
    evos = gainLevels(t, trainGain(t));
  }
  // v183: a Shadow Pokémon whose heart is fully open is purified at the end of the week, whatever the week was
  { const p = purifyWeek(t); if (p.length) entry.purified = p; }
  evos = evos.concat(gainLevels(t, PACE.travel));
  if (t.user) for (const [a, b] of evos) news(`${dn(t)}'s ${a} evolved into ${b}!`, 'you', t.id);
  entry.learned = (t.learned || []).map(([sp, n, old]) => `${sp}: ${n}${old ? ` (replaced ${old})` : ''}`);
  if (t.user) for (const [sp, n, old] of t.learned || []) news(`${dn(t)}'s ${sp} learned ${n}${old ? `, replacing ${old}` : ''}.`, 'you', t.id);
  t.learned = [];
  entry.evos = evos.length;
  entry.evoNames = evos.map(([a, b]) => a + ' → ' + b);
  const kept = t.team.filter(m => lvBefore.has(m.uid));
  entry.gain = kept.length ? Math.round(kept.reduce((a, m) => a + m.lvl - lvBefore.get(m.uid), 0) / kept.length * 10) / 10 : 0;
  t.weekLog.push(entry);
  return entry;
}
// plans: {trainerId: 'auto'|'challenge'|'train'|'explore'}; catches: {trainerId: {offer, release} | null}
function simWeek(plans = {}, catches = {}) {
  S.tourneyPause = false; // v188: the season stops after the Midseason Tournament until it's continued
  eachLeague(() => leagueWeek(plans, catches));
  // v193: a save from before tournament rules draws this season's rule now, if it's early enough to announce it
  if (featOn('tourney') && !(S.tourneyRule && S.tourneyRule.season === S.season) && S.week < TOURNEY_RULE_WEEK) drawTourneyRule();
  S.week++;
  if (S.week === TOURNEY_RULE_WEEK && featOn('tourney') && tourneyRuleCfg() === 'rotate') { const R = TOURNEY_RULES[tourneyRule()];
    if (R) news(`This season's Midseason Tournament rule, after week ${TOURNEY_WEEK}: ${R.name}. ${R.desc}`, 'league'); }
  if (S.week === TOURNEY_WEEK && featOn('tourney') && runTourney()) S.tourneyPause = true;
  S.weekOffers = {}; S.catchPicks = {};
  eachLeague(() => { maybeWormhole(); maybeOutbreak(); });
  if (S.week >= SEASON_WEEKS) {
    S.phase = 'league';
    const q = eachLeague(() => challengers().filter(t => t.badges.length === 8).length);
    news(nLeagues() > 1 ? `The regular season is over. ${q.map((n, i) => `${lgShort(i)} ${n}`).join(', ')} trainers qualified for their Leagues.` : `The regular season is over. ${q[0]} trainers qualified for the Pokémon League.`, 'league');
  }
}
// one League's week
function leagueWeek(plans, catches) {
  S.lastBattles = [];
  S.snagOffers = {}; S.snagPick = {};
  const run = t => {
    const p = t.user ? (plans[t.id] || 'auto') : 'auto';
    const act = p === 'auto' ? aiAction(t) : p;
    doAction(t, act, p === 'explore' && t.id in catches ? catches[t.id] : undefined);
  };
  for (const id of shuffle(S.challengers)) run(T(id));
  const champ = T(S.champion);
  if (champ.user) run(champ);
  roadBattles();
  roadTrades();
  pokerusWeek();
  checkBonds();
  villainWeek();
  legendWeek();
  roamWeek();
  stormWeek();
  for (const t of challengers()) {
    const last = t.weekLog[t.weekLog.length - 1];
    if (!t.user && last && last.won && t.badges.length === 8) news(`${dn(t)} (${orgName(t.org)}) completed the badge circuit in week ${S.week + 1}.`, 'circuit', t.id);
  }
}

// ================= LEAGUE =================
function runLeague() {
  settleTourneyOffer(); S.tourneyPause = false;
  eachLeague(() => leagueFinals());
  S.worlds = null;
  if (nLeagues() > 1) worldChampionship();
  S.phase = 'offseason';
  offseason();
  orderOffers();
}
// ---------- World Championship: the Champions of every League meet once the Leagues are done ----------
const WORLD_PTS = { win: 6, final: 3 };
function worldBattle(a, b, round, W) {
  // fought on neutral ground: no League's weather or meta stats carry over
  // fought on copies: win or lose, a Champion goes home exactly as they arrived (form, Pokérus, records), so the
  // World Championship never tilts their own League's next title race
  const copy = t => JSON.parse(JSON.stringify(t));
  const A = copy(T(a)), B = copy(T(b));
  const keep = { stats: S.stats, dex: S.dex, dexSeason: S.dexSeason };
  S.stats = { ko: {}, use: {} }; S.dex = {}; S.dexSeason = {};
  let r;
  try { r = inLeague(lgOf(T(a)), () => battle(A, B, 'title', `World Championship ${round} · ${dn(A)} vs ${dn(B)}`, { equal: true })); }
  finally { Object.assign(S, keep); }
  r.world = round;
  const w = r.winner === 0 ? a : b, l = w === a ? b : a;
  W.matches.push({ round, a, b, winner: w, log: r });
  return { w, l };
}
function worldChampionship() {
  const champs = eachLeague(() => S.champion);
  const W = { season: S.season, entrants: champs.slice(), matches: [], winner: null, runner: null };
  let finalists;
  if (champs.length >= 4) {
    const seed = shuffle(champs.slice());
    const s1 = worldBattle(seed[0], seed[1], 'Semifinal', W), s2 = worldBattle(seed[2], seed[3], 'Semifinal', W);
    finalists = [s1.w, s2.w];
  } else finalists = champs.slice(0, 2);
  const f = worldBattle(finalists[0], finalists[1], 'Final', W);
  W.winner = f.w; W.runner = f.l;
  const t = T(f.w);
  t.career.worlds = (t.career.worlds || 0) + 1; (t.worldSeasons = t.worldSeasons || []).push(S.season);
  W.winnerOrg = t.champOrg || null; W.runnerOrg = T(f.l).champOrg || null;
  (S.worldHist = S.worldHist || []).push({ season: S.season, winner: f.w, runner: f.l, winnerName: dn(t), runnerName: dn(T(f.l)), winnerLg: lgOf(t), runnerLg: lgOf(T(f.l)), winnerOrg: W.winnerOrg, runnerOrg: W.runnerOrg, entrants: champs.slice() });
  S.worlds = W;
  (() => news(`${dn(t)}, Champion of the ${leagueName(lgOf(t))}, won the Season ${S.season} World Championship, beating ${dn(T(f.l))} of the ${leagueName(lgOf(T(f.l)))} in the final!`, t.user || T(f.l).user ? 'you' : 'title', t.id));
}
function leagueFinals() {
  for (const t of challengers()) settleItemOffers(t);
  const qs = challengers().filter(t => t.badges.length === 8).sort((a, b) => a.badgeWeek - b.badgeWeek || ovr(b) - ovr(a));
  S.wormhole = null; S.outbreak = null;
  if (S.event && !S.event.done) endVillainEvent(null);
  S.snagOffers = {};
  if (S.legend) settleLegend(`The season is over and ${S.legend.sp} is leaving.`, true);
  if (S.storm) settleStorm(true);
  if (S.roamer) { news(`The season is over, and ${S.roamer.sp} has left the region.`, 'title'); logSky(`${S.roamer.sp} left the region uncaught`); S.roamer = null; }
  S.legendOffers = {};
  settleMegaStones();
  const L = { entries: [], logs: [], startChamp: S.champion, dethroned: [] };
  for (const q of qs) {
    q.career.leagueApps++;
    const e = { id: q.id, stage: 0, lostTo: null };
    let ok = true;
    for (let i = 0; i < 4; i++) {
      const foe = T(S.e4[i]);
      if (itemsOn() && (!q.user || !q.itemsManual)) autoEquip(q, foe);
      const r = battle(q, foe, 'league', `Elite Four · ${dn(foe)}`);
      if (q.user || foe.user) L.logs.push(r);
      if (r.winner === 1) { ok = false; e.stage = i; e.lostTo = foe.id; foe.career.e4Wins++; break; }
    }
    if (ok) e.stage = 4; // through the Elite Four: a title match to come
    e.org = q.org;
    L.entries.push(e);
  }
  // every Elite Four run is done before anyone challenges the Champion; then the finalists go in order of their
  // season's gym record, worst first and best last (more gym losses = worse; ties: finished the circuit later, lower OVR)
  const gymRec = t => { const w = t.weekLog.filter(x => x.won === true).length, l = t.weekLog.filter(x => x.won === false).length; return { w, l }; };
  const finalists = L.entries.filter(e => e.stage === 4).map(e => ({ e, q: T(e.id), r: gymRec(T(e.id)) }))
    .sort((x, y) => (y.r.l - x.r.l) || ((x.r.w / Math.max(1, x.r.w + x.r.l)) - (y.r.w / Math.max(1, y.r.w + y.r.l))) || ((y.q.badgeWeek ?? 99) - (x.q.badgeWeek ?? 99)) || (ovr(x.q) - ovr(y.q)));
  L.titleOrder = finalists.map(f => ({ id: f.q.id, w: f.r.w, l: f.r.l }));
  for (const { e, q } of finalists) {
    const champ = T(S.champion);
    if (itemsOn() && (!q.user || !q.itemsManual)) autoEquip(q, champ);
    const r = battle(q, champ, 'title', `Championship · ${dn(champ)}`);
    L.logs.push(r);
    if (r.winner === 0) {
      e.stage = 5;
      news(`${dn(q)} of ${orgName(q.org)} defeated ${dn(champ)} and is the new Champion of the ${S.lgName}!`, 'title', q.id);
      champ.role = 'exchamp'; champ.dethronedBy = q.id;
      S.challengers = S.challengers.filter(x => x !== q.id);
      q.career.titles++;
      (q.titleSeasons = q.titleSeasons || []).push(S.season); (q.titleLgs = q.titleLgs || []).push(S.lg || 0); (q.titleAges = q.titleAges || []).push({ season: S.season, age: q.age });
      q.champOrg = q.org || null;
      installElite(q, 'champion');
      L.dethroned.push(champ.id);
      (L.titleWins = L.titleWins || []).push({ id: q.id, beat: champ.id, beatName: champ.name, asName: `${q.cls} ${q.name}` });
    } else {
      e.stage = 4; e.lostTo = champ.id; champ.career.defenses++;
      news(`${dn(champ)} defended the title against ${dn(q)}.`, 'title', champ.id);
    }
  }
  // nobody reached the Champion: an unbeaten Elite Four member (at least one League win, no losses) gets the title shot
  if (!L.entries.some(e => e.stage >= 4)) eliteChallenge(L);
  else if (!qs.length) news('Nobody completed the badge circuit, so the Champion kept the title by default.', 'title');
  settleInterimChampions(L);
  // a deep League run (reaching the last Elite Four member or further) earns a rare item
  if (itemsOn()) for (const e of L.entries) {
    const q = T(e.id); if (!q || e.stage < 3 || q.role !== 'challenger') continue;
    let k = rollItem(3); for (let i = 0; i < 20 && ITEMS[k].tier < 2; i++) k = rollItem(3);
    bagAdd(q, k); if (!q.itemsManual) autoEquip(q);
    if (q.user) news(`For their League run, ${dn(q)} received a ${itemName(k)}.`, 'you', q.id);
  }
  S.league = L;
}

// a title only counts if the trainer still holds it when the League ends. Anyone who won it and then lost it
// in the same League is an Interim Champion for that season instead.
function settleInterimChampions(L) {
  for (const w of L.titleWins || []) {
    const t = T(w.id);
    if (w.id === S.champion) continue;
    const lostTo = L.titleWins.find(x => x.beat === w.id);
    t.career.titles = Math.max(0, t.career.titles - 1);
    { const keep = (t.titleSeasons || []).map((s, i) => s !== S.season); t.titleLgs = (t.titleLgs || []).filter((_, i) => keep[i] !== false); t.titleSeasons = (t.titleSeasons || []).filter((_, i) => keep[i]); }
    t.titleAges = (t.titleAges || []).filter(x => x.season !== S.season);
    const by = lostTo ? T(lostTo.id) : T(S.champion);
    (t.interim = t.interim || []).push({ season: S.season, lg: S.lg || 0, beat: w.beat, beatName: w.beatName, lostTo: by.id, lostToName: lostTo ? lostTo.asName : dn(by) });
    const p = (t.posts || []).slice().reverse().find(x => x.role === 'champion'); if (p) p.interim = true;
    const e = L.entries.find(x => x.id === w.id); if (e) e.interim = true;
    news(`${t.name}'s reign was short: they took the title from ${T(w.beat).name} but lost it to ${T(lostTo ? lostTo.id : S.champion).name} in the same League. They go down as Interim Champion for Season ${S.season}.`, t.user || t.formerUser ? 'you' : 'title', t.id);
  }
}
function eliteChallenge(L) {
  const rec = S.e4.map((id, i) => ({ id, i, w: L.entries.filter(e => e.lostTo === id).length, l: L.entries.filter(e => e.stage > i).length }));
  const best = rec.filter(r => r.w > 0 && r.l === 0).sort((a, b) => b.w - a.w || b.i - a.i)[0];
  if (!best) { news(L.entries.length ? 'No challenger reached the Champion, and no Elite Four member went unbeaten, so the Champion kept the title.' : 'Nobody completed the badge circuit, so the Champion kept the title by default.', 'title'); return; }
  const m = T(best.id), c = T(S.champion), seat = best.i;
  news(`No challenger reached the Champion. ${dn(m)} went unbeaten (${best.w}–0) and earned a shot at the title. Both teams fight at the same level, six Pokémon each.`, 'title', m.id);
  // for the challenge the League lends a short team Pokémon of the member's type until they have six; they keep
  // them only if they win (a Champion fields six), otherwise they go back to the League after the battle
  const lent = [];
  if (m.team.length < 6) {
    const lines = new Set(m.team.map(x => LINE[x.sp])), L0 = Math.max(...m.team.map(x => Math.floor(x.lvl)));
    for (const x of buildEliteTeam(m.specialty, L0, 6 - m.team.length + 4, !m.specialty)) { if (m.team.length >= 6) break; if (lines.has(LINE[x.sp])) continue; lines.add(LINE[x.sp]); stamp(x, 'assigned'); m.team.push(x); lent.push(x); }
  }
  const r = battle(m, c, 'title', `Elite Four title challenge · ${dn(c)} · equal level`, { equal: true });
  r.eliteChallenge = true; L.logs.push(r); L.e4Shot = { id: m.id, seat, won: r.winner === 0 };
  if (r.winner !== 0) m.team = m.team.filter(x => !lent.includes(x));
  if (r.winner !== 0) {
    c.career.defenses++;
    news(`${dn(c)} turned back ${dn(m)}'s challenge and kept the title.`, 'title', c.id);
    return;
  }
  const mName = dn(m), cName = dn(c);
  m.career.titles++; (m.titleSeasons = m.titleSeasons || []).push(S.season); (m.titleLgs = m.titleLgs || []).push(S.lg || 0); (m.titleAges = m.titleAges || []).push({ season: S.season, age: m.age }); m.champOrg = null;
  c.champOrg = null; c.dethronedBy = m.id;
  S.e4[seat] = null;
  installElite(m, 'champion');
  if (retiresOnLosingPost(c)) {
    c.role = 'exchamp'; retire(c, 'after losing the title to their own Elite Four');
    const nt = outsiderE4(seat);
    news(`${mName} defeated ${cName} and is the new Champion! ${c.name} retired, and ${nt.name} (${nt.specialty}) fills Elite Four seat #${seat + 1}.`, 'title', m.id);
  } else {
    installElite(c, 'e4', seat);
    news(`${mName} defeated ${cName} and is the new Champion! ${c.name} takes their place in Elite Four seat #${seat + 1}.`, 'title', m.id);
  }
}
// a new Elite Four member from outside the circuit (sometimes a famous trainer)
function outsiderE4(i) {
  const fam = !(S.cfg && S.cfg.allFamous) && rand() < FAMOUS_POST_CHANCE ? famousAvailable(f => f.spec && f.age >= 18 && (/Elite Four|Kahuna|Master/.test(f.cls) || f.tags.includes('brain')) && !S.e4.some((x, j) => j !== i && x && T(x) && T(x).specialty === f.spec)) : [];
  const nt = fam.length ? makeFamous(pick(fam), 'e4', 66, E4_LV[i]) : newTrainer({ age: ri(30, 45), quality: 66, role: 'e4' });
  installElite(nt, 'e4', i);
  return nt;
}

// ================= OFFSEASON / WORLD CHANGES =================
function retire(t, why) { const i = homeLeague(t); t.lg = i; return inLeague(i, () => retireHere(t, why)); }
// a League's founding Champion is guaranteed its first six seasons: whatever would have retired them sends them
// back to the circuit instead (a free agent just stays a free agent)
const FOUNDER_SEASONS = 6;
const founderProtected = t => !!t.foundingChamp && (S.season || 0) < FOUNDER_SEASONS;
// a Gym Leader who came back to the circuit is guaranteed five seasons there, whatever their age
const comebackProtected = t => t.noRetireUntil != null && (S.season || 0) < t.noRetireUntil;
function retireHere(t, why) {
  // the reigning Champion never retires; the title only changes hands in battle
  if (t.id === S.champion && t.role === 'champion') return;
  if (t.role === 'retired') return;
  if (founderProtected(t) || comebackProtected(t)) {
    if (['leader', 'e4', 'exchamp'].includes(t.role)) { closePost(t); t.role = 'challenger'; t.returned = S.season; t.lg = S.lg || 0; if (!S.challengers.includes(t.id)) S.challengers.push(t.id); news(`${dn(t)}, ${founderProtected(t) ? "the League's founding Champion" : 'back from a long run as a Gym Leader'}, isn't ready to retire and returns to the badge circuit.`, 'move', t.id); }
    return;
  }
  const was = dn(t);
  closePost(t);
  if (t.role === 'challenger') S.challengers = S.challengers.filter(x => x !== t.id);
  const ranchK = ranchTeamOf(t);
  leaveOrg(t);
  for (const m of t.team.filter(x => x.partners && isLegendLine(x.sp))) { farewell(t, m, `moved on when ${t.name} retired`); t.team = t.team.filter(x => x !== m); }
  // v189: their team keeps one Pokémon in its ranch; the rest go on display in the historical ranch
  ranchRetire(t, ranchK);
  t.prevRole = t.role; t.role = 'retired'; t.retiredSeason = S.season;
  scheduleLegacy(t);
  compactRetired(t);
  // only Champions are inducted: a full title win (Interim Champions don't count)
  const hof = t.career.titles >= 1;
  if (hof) { t.hof = true; if (!S.hof.includes(t.id)) S.hof.push(t.id); }
  news(`${was} retired${why ? ' ' + why : ''}.${hof ? ' Inducted into the Hall of Fame.' : ''}`, 'move', t.id);
}
// a retired trainer keeps their career, but not last season's week-by-week log or Pokémon that barely battled:
// it keeps saves small enough for the browser with several Leagues
function compactRetired(t) {
  t.weekLog = [];
  t.alumni = (t.alumni || []).filter(m => m.st && m.st.b >= 3).slice(0, 15);
}
// ---- rewards for teams whose trainers are promoted ----
// 1) a compensation pick in the next draft, 2) a farewell gift Pokémon for a teammate, 3) legacy points while the alumnus holds the post
const LEGACY_PTS = { leader: 1, e4: 2 };
const LEGACY_CAP = 4; // most legacy points a team can earn in one season
function paradoxFor(t) {
  const both = PARADOX.filter(n => specFit(t, n) === 2), fit = PARADOX.filter(n => onSpec(t, n));
  return pick(both.length ? both : fit.length ? fit : PARADOX);
}
function grantParadox(t, lvl) {
  const m = makeMon(paradoxFor(t), lvl || Math.max(...t.team.map(x => x.lvl), 50));
  m.met = { how: 'paradox', season: S.season + 1, week: 1 }; m.metFr = 1; m.fr = 100;
  t.team.push(m);
  news(`The League gave ${t.name} ${m.sp}, a Paradox Pokémon, to replace the Pokémon left with their old team.`, t.elevatedFrom === S.userOrg ? 'you' : 'move', t.id);
  return m;
}
function promote(t, role, slot) {
  const k = t.org || null;
  markGmOffer(k);
  t.elevatedFrom = k;
  if (k) t.homeOrg = k;
  if (k) {
    const before = t.team.length;
    farewellGift(t, k);
    if (role === 'e4' && t.team.length < before) { t.specialty = specOf(t); grantParadox(t); }
    (S.compPicks = S.compPicks || []).push({ org: k, from: t.id });
    news(`${orgName(k)} receives a compensation pick in the next draft for losing ${t.name} to ${role === 'e4' ? 'the Elite Four' : TOWNS[slot] + ' Gym'}.`, k === S.userOrg ? 'you' : 'draft', t.id);
  }
  S.challengers = S.challengers.filter(x => x !== t.id);
  leaveOrg(t);
  installElite(t, role, slot);
}
// a team's challengers who could use a farewell gift (any League: since v189 gifts go through the team ranch)
function giftTeammates(t, k) { return org(k).roster.map(T).filter(x => x && x.id !== t.id && x.role === 'challenger'); }
// v168: a farewell gift is decided after the draft, on its own screen: the departing trainer's Pokémon are noted now.
// v189: the gift goes into the team's active ranch, and the team hands it to any of its trainers in the ranch step
function farewellGift(t, k) {
  const mons = t.team.filter(x => typeof ranchable === 'function' ? ranchable(x.sp) : !isLegendLine(x.sp));
  if (!mons.length) return;
  (S.pendingGifts = S.pendingGifts || []).push({ from: t.id, org: k, lg: lgOf(t), mons: JSON.parse(JSON.stringify(mons)) });
}
function giveGift(from, k, m) {
  from.alumni = (from.alumni || []).filter(a => a.uid !== m.uid);
  farewell(from, m, `left in ${orgName(k)}'s ranch`);
  m.alumniOf = from.id;
  addToRanch(k, m, { how: 'farewell', season: S.season + 1, from: from.id, fromName: dn(from) });
  const rec = { season: S.season, org: k, from: from.id, fromName: dn(from), post: from.role, to: null, toName: 'the team ranch', sp: m.sp, lg: lgOf(from) };
  (S.giftLog = S.giftLog || []).push(rec);
  inLeague(lgOf(from), () => { const h = S.history[S.history.length - 1]; if (h && h.season === S.season) (h.gifts = h.gifts || []).push(rec); });
  inLeague(lgOf(from), () => news(`Before leaving, ${from.name} left ${m.sp} in ${orgName(k)}'s ranch as a farewell gift.`, k === S.userOrg ? 'you' : 'move', from.id));
}
// the player's choice for a pending farewell gift (uid null = no gift)
function confirmGift(uidPick) {
  const g = (S.pendingGifts || []).shift(); if (!g || uidPick == null) return;
  const from = T(g.from); if (!from || !ORGS[g.org]) return;
  const snap = g.mons.find(m => m.uid === uidPick); if (!snap || !ranchable(snap.sp)) return;
  // if the promoted trainer kept that Pokémon for their new post, they hand it over and the League fills the slot
  const kept = from.team.findIndex(m => m.uid === uidPick);
  if (kept >= 0) {
    const real = from.team.splice(kept, 1)[0];
    const slot = eliteSlot(from);
    if (slot && from.role === 'e4') { grantParadox(from, slot.lvl); relevelElite(from); }
    else if (slot) { const fill = buildEliteTeam(from.specialty, slot.lvl, 1, from.role === 'champion')[0]; stamp(fill, 'assigned'); from.team.push(fill); relevelElite(from); }
    giveGift(from, g.org, real);
  } else giveGift(from, g.org, snap);
}
// alumni currently holding a post, by the team they were promoted from
function legacyOf(k) { return Object.values(S.trainers).filter(t => t.elevatedFrom === k && LEGACY_PTS[t.role]); }
function legacyPoints(k) { return Math.min(LEGACY_CAP, legacyOf(k).reduce((a, t) => a + LEGACY_PTS[t.role], 0)); }

// ---- Elite Four seat challenges ----
// A seat only changes hands in battle. The loser decides whether to retire or go back to the circuit:
// young trainers almost always try again, older ones usually retire.
// Retiring for age needs both: age 50+ and at least this trainer's career length (15–20 seasons, set once).
// ---------- a crossroads: 10 straight seasons without completing the badge circuit ----------
// A challenger who isn't near retirement age gets a chance each offseason to either retire or reinvent themselves:
// a new type and the class that goes with it, a Pokémon of that type, and a small bump to every rating.
// Your own trainers only ever reinvent (poor results never retire them). The count starts over after a reinvention.
const CROSSROADS_SEASONS = 10, CROSSROADS_CHANCE = 0.3, CROSSROADS_RETIRE = 0.5, CROSSROADS_MAX_AGE = 42;
function dryStreak(t) {
  let n = 0;
  for (const h of (t.seasonHist || []).slice().reverse()) { if (t.reinvented && h.season <= t.reinvented) break; if (h.badges === 8) break; n++; }
  return n;
}
function crossroads(t, changes) {
  if (t.role !== 'challenger' || t.famous || comebackProtected(t) || t.age > CROSSROADS_MAX_AGE || dryStreak(t) < CROSSROADS_SEASONS || rand() >= CROSSROADS_CHANCE) return false;
  if (!t.user && rand() < CROSSROADS_RETIRE) { retire(t, `after ${dryStreak(t)} seasons without completing the badge circuit`); return true; }
  reinvent(t, changes);
  return false;
}
function reinvent(t, changes) {
  const was = dn(t), oldSpec = t.specialty;
  // a new type with a class that suits the trainer
  const types = shuffle(TYPES.filter(ty => ty !== t.specialty && (CLASSES[ty] || []).some(([, g]) => !g || g === t.gender)));
  // the new class can't be one that already has a trainer with this name
  let ty = null, cls = null;
  for (const cand of types) { const opts = CLASSES[cand].filter(([c, g]) => (!g || g === t.gender) && !titleNameTaken(c, t.name, t)); if (opts.length) { ty = cand; cls = pick(opts)[0]; break; } }
  if (!ty) return;
  t.specialty = ty; t.spec2 = null; t.cls = cls;
  for (const k of RK) t.r[k] = clamp(t.r[k] + ri(2, 4), 1, 99);
  t.pot = Math.max(t.pot, ovr(t) + ri(1, 3));
  // a Pokémon of the new type to build around, at the team's level
  const lvl = Math.max(5, Math.floor(Math.max(...t.team.map(m => m.lvl), 10)) - 2);
  const cands = [...new Set(BASES.filter(b => SP[b].types.includes(ty)).map(b => formAt(b, lvl)))].filter(f => SP[f].bst <= 320 + lvl * 6 && !t.team.some(m => LINE[m.sp] === LINE[f]));
  let got = null;
  if (cands.length) {
    got = stamp(makeMon(pick(cands), lvl), 'caught');
    if (t.team.length >= 6) { const out = t.team.filter(m => !isSpecial(m) && !SP[m.sp].legend).sort((a, b) => monPower(a) - monPower(b))[0]; if (out) { farewell(t, out, 'released when ' + t.name + ' changed class'); t.team = t.team.filter(m => m !== out); } else got = null; }
    if (got) t.team.push(got);
  }
  t.reinvented = S.season; (t.classHist = t.classHist || []).push({ season: S.season, from: was, to: dn(t), spec: ty, fromSpec: oldSpec || null });
  const msg = `${was} hit a wall after ${CROSSROADS_SEASONS}+ seasons without completing the badge circuit and reinvented themselves as ${dn(t)}, a ${ty}-type specialist${got ? ` (new partner: ${got.sp})` : ''}. Every rating went up a little.`;
  news(msg, t.user ? 'you' : 'move', t.id);
  if (t.user) changes.push(msg);
}
function careerSpan(t) { if (!t.span) t.span = ri(15, 20); return t.span; }
function ageRetireChance(t) { if (comebackProtected(t) || slamProtected(t) || t.age < 50 || (t.seasons || 0) < careerSpan(t)) return 0; return clamp((t.age - 48) * 0.1, 0.1, 0.9); }
// Losing a post (Champion, Elite Four, or stepping down as a Gym Leader): over 45 with a career of 10+ seasons they retire,
// otherwise they go back to the circuit.
const POST_RETIRE_AGE = 45, POST_RETIRE_CAREER = 10;
// Gym Leader comebacks: after COMEBACK_MIN straight exceptional seasons, these odds per season (then certain); five
// guaranteed seasons on the circuit afterwards
const COMEBACK_MIN = 6, COMEBACK_ODDS = [1 / 3, 1 / 2], COMEBACK_GUARD = 5;
const retiresOnLosingPost = t => !comebackProtected(t) && !slamProtected(t) && t.age > POST_RETIRE_AGE && (t.seasons || 0) >= POST_RETIRE_CAREER;
function retireChance(t) { return retiresOnLosingPost(t) ? 1 : 0; }
function returnToCircuit(t, why) {
  closePost(t);
  if (t.role === 'challenger') return;
  t.role = 'challenger'; t.returned = S.season; t.lg = S.lg || 0;
  if (!S.challengers.includes(t.id)) S.challengers.push(t.id);
  news(`${t.name} ${why} and will return to the badge circuit.`, 'move', t.id);
  offerRejoin(t);
}
// ---------- coming home ----------
// A trainer who left a team for a gym, an Elite Four seat or the title, and later loses that post, can rejoin
// that team. AI teams take them back if there's room, or if they're clearly better than their weakest challenger;
// the player gets an offer on the recap.
function rejoinChoice(t, k) {
  const roster = lgRoster(k, lgOf(t)).map(T);
  if (roster.length < ROSTER) return { ok: true };
  const worst = roster.filter(x => x.role === 'challenger').sort((a, b) => tradeValue(a, k) - tradeValue(b, k))[0];
  return worst && tradeValue(t, k) >= tradeValue(worst, k) + 4 ? { ok: true, release: worst.id } : { ok: false };
}
function rejoin(t, k, releaseId) {
  if (releaseId != null) { const r = T(releaseId); if (r && r.org === k && r.role === 'challenger') release(r, `to bring back ${t.name}`); }
  if (lgRoster(k, lgOf(t)).length >= ROSTER) return false;
  joinOrg(t, k); t.rejoined = (t.rejoined || 0) + 1;
  news(`${orgName(k)} welcomed back ${dn(t)}, their former trainer.`, k === S.userOrg ? 'you' : 'move', t.id);
  return true;
}
function offerRejoin(t) {
  const k = t.homeOrg; t.homeOrg = null;
  if (!k || t.org || t.role !== 'challenger' || !ORG_KEYS.includes(k)) return;
  if (k === S.userOrg) {
    if (!S.offers.some(o => o.kind === 'rejoin' && o.id === t.id)) S.offers.push({ kind: 'rejoin', id: t.id, org: k, lg: S.lg || 0 });
    news(`${dn(t)} is back on the circuit. As their former team, you can bring them back.`, 'you', t.id);
    return;
  }
  const c = rejoinChoice(t, k);
  if (c.ok) rejoin(t, k, c.release);
  else news(`${orgName(k)} passed on bringing back ${dn(t)}, who goes on as an independent.`, 'move', t.id);
}
function retireOrReturn(t, why) {
  if (retiresOnLosingPost(t)) { retire(t, why); return 'retired'; }
  returnToCircuit(t, why);
  return 'returned';
}
// candidate challenges the member in E4 seat `slot`; returns true if the candidate takes the seat
function seatChallenge(cand, slot, changes, how) {
  const inc = T(S.e4[slot]);
  const res = battle(cand, inc, 'league', `Elite Four seat challenge · ${dn(inc)}`);
  res.seat = { slot, cand: cand.id, inc: inc.id };
  (S.seatBattles = S.seatBattles || []).push(res);
  if (S.league) S.league.logs.push(res);
  if (res.winner === 0) {
    const incName = inc.name;
    const fate = retireOrReturn(inc, `lost Elite Four seat #${slot + 1} to ${cand.name}`);
    const from = cand.org ? orgName(cand.org) : null;
    if (cand.org) promote(cand, 'e4', slot);
    else { S.challengers = S.challengers.filter(x => x !== cand.id); installElite(cand, 'e4', slot); }
    changes.push(`${cand.name}${how} won a seat challenge against ${incName} and joins the Elite Four${from ? `, leaving ${from}` : ''}. ${incName} ${fate === 'retired' ? 'retired' : 'is heading back to the badge circuit'}.`);
    news(changes[changes.length - 1], cand.user || cand.formerUser && cand.prevOrg === S.userOrg ? 'you' : 'move', cand.id);
    return true;
  }
  changes.push(`${inc.name} defended Elite Four seat #${slot + 1} against ${cand.name}${how}.`);
  news(changes[changes.length - 1], cand.user ? 'you' : 'move', inc.id);
  return false;
}
function weakestSeat() { let wi = 0; S.e4.forEach((x, i) => { if (ovr(T(x)) - T(x).age / 6 < ovr(T(S.e4[wi])) - T(S.e4[wi]).age / 6) wi = i; }); return wi; }


// a trainer without a team or a circuit place: sits out, stays draftable
function toFreeAgent(t, why) { const i = homeLeague(t); t.lg = i; inLeague(i, () => toFreeAgentHere(t, why)); }
function toFreeAgentHere(t, why) {
  S.challengers = S.challengers.filter(x => x !== t.id);
  t.role = 'free'; t.freeSince = S.season;
  if (!S.freeAgents.includes(t.id)) S.freeAgents.push(t.id);
  news(`${dn(t)} ${why} and is now a free agent.`, 'move', t.id);
}
function independents() { return challengers().filter(t => !t.org); }
function release(t, why) {
  const was = dn(t), from = orgName(t.org);
  leaveOrg(t);
  news(`${from} released ${was}${why ? ' ' + why : ''}. They stay on the circuit as an independent.`, 'move', t.id);
}
// The meta: the five species that performed best this season on the circuit. Only challengers' Pokémon count (Gym
// Leaders and the Elite Four are who has to answer it), and a species needs 8+ battles; ranked by knockouts per
// battle, with wins as a tiebreak.
function metaMons() {
  const agg = {};
  for (const t of challengers()) for (const m of t.team) {
    const ss = m.ss; if (!ss || ss.season !== S.season) continue;
    const a = agg[m.sp] = agg[m.sp] || { sp: m.sp, b: 0, ko: 0, w: 0 };
    a.b += ss.b; a.ko += ss.ko; a.w += ss.w;
  }
  return Object.values(agg).filter(a => a.b >= 8).sort((x, y) => y.ko / y.b - x.ko / x.b || y.w / y.b - x.w / x.b).slice(0, 5).map(a => a.sp);
}
const effVs = (atk, sp) => SP[sp].types.reduce((m, d) => m * effOne(atk, d), 1);
// attacking types that hit the most meta Pokémon super effectively (then by total effectiveness)
function counterTypesFor(mons) {
  if (!mons || !mons.length) return [];
  const sc = TYPES.map(a => ({ a, n: mons.filter(sp => effVs(a, sp) >= 2).length, v: mons.reduce((x, sp) => x + effVs(a, sp), 0) })).filter(x => x.n > 0);
  sc.sort((x, y) => y.n - x.n || y.v - x.v);
  return sc.slice(0, 3).map(x => x.a);
}
// what the current meta counters are (older saves stored a single type in S.meta)
function metaCounters() { if (S.metaMons && S.metaMons.length) return counterTypesFor(S.metaMons); return S.meta && TYPES.includes(S.meta) ? TYPES.filter(a => effOne(a, S.meta) === 2) : []; }
// v186: each GM (team) gets at most one offseason offer per season, across every League: a gym or Elite Four
// invitation for one of its trainers. Former trainers coming home don't count. Once a team has had its offer, the League fills
// other openings from independents who performed well, or appoints a new trainer.
function gmOffered(k) { return !!(k && S.gmOffers && S.gmOffers[k]); }
function markGmOffer(k) { if (k) (S.gmOffers = S.gmOffers || {})[k] = S.season; }
// a Gym Leader back on the circuit for a title run isn't offered a gym again during their guaranteed seasons
function bestCandidate(exclude) {
  return challengers().filter(t => !t.user && !exclude.includes(t.id) && !gmOffered(t.org) && !comebackProtected(t) && t.age >= 17 && t.seasons >= 2 && ovr(t) >= 58).sort((a, b) => ovr(b) + b.career.badges / 4 - ovr(a) - a.career.badges / 4)[0];
}
function offseason() {
  const changes = [];
  S.offers = [];
  S.gmOffers = {};
  S.giftLog = [];
  // team standings use the rosters as they finished the season; with several Leagues the Team Cup adds them all up
  const standings = cupStandings();
  standings.forEach((r, i) => { org(r.key).hist.push({ season: S.season, pts: r.pts, rank: i + 1 }); });
  org(standings[0].key).cups++;
  for (const id of org(standings[0].key).roster) (T(id).cups = T(id).cups || []).push(S.season);
  news(`${orgName(standings[0].key)} won the Season ${S.season} Team Cup with ${standings[0].pts} points.`, standings[0].key === S.userOrg ? 'you' : 'title');
  eachLeague(i => {
    const ch = [];
    leagueOffseason(standings, ch);
    changes.push(...(nLeagues() > 1 ? ch.map(x => `${lgShort(i)}: ${x}`) : ch));
  });
  checkGrandSlams();
  slamReturns(changes);
  legendDepartures();
  // --- aging & progression
  const prog = {};
  for (const t of Object.values(S.trainers)) {
    if (['retired', 'prospect'].includes(t.role)) continue;
    const before = { ...t.r, ovr: ovr(t) };
    t.age++;
    for (const k of RK) {
      let d;
      if (t.age <= 17) d = ri(0, 6) * (ovr(t) < t.pot ? 1 : 0.3);
      else if (t.age <= 24) d = ri(-1, 4) * (ovr(t) < t.pot ? 1 : 0.4);
      else if (t.age <= 34) d = ri(-1, 2);
      else if (t.age <= 44) d = ri(-2, 1);
      else if (t.age <= 52) d = ri(-3, 1);
      else d = ri(-4, 1);
      if (hasTrait(t, 'lateBloomer') && t.age >= 20 && t.age <= 32) d += ri(0, 1);
      t.r[k] = clamp(Math.round(t.r[k] + d), 1, 99);
    }
    if (t.role === 'challenger') {
      const sh = t.seasonHist[t.seasonHist.length - 1];
      if (sh && sh.badges === 8) t.r.nrv = clamp(t.r.nrv + ri(1, 3), 1, 99);
      if (sh && sh.stage != null && sh.stage >= 4) { t.r.nrv = clamp(t.r.nrv + 2, 1, 99); t.r.str = clamp(t.r.str + 1, 1, 99); }
    }
    t.pot = Math.max(t.pot, ovr(t));
    if (t.age > (hasTrait(t, 'lateBloomer') ? 32 : 26)) t.pot = ovr(t);
    prog[t.id] = { before, after: { ...t.r, ovr: ovr(t) } };
  }
  S.progress = prog;
  // --- trainers retire with age (50+ and past their career length) or long-term poor results; poor results never retire your own trainers
  eachLeague(() => {
  for (const t of challengers()) {
    careerSpan(t);
    // age catches up with everyone, including your own trainers; only poor results are left to you
    if (rand() < ageRetireChance(t)) { const mine = t.user; retire(t, `after ${t.seasons} seasons`); if (mine) changes.push(`Your trainer ${t.name} retired at ${t.age} after ${t.seasons} seasons. Their roster spot is open for the draft.`); continue; }
    if (crossroads(t, changes)) continue;
    if (t.user) continue;
    else if (t.seasons >= 5 && ovr(t) < 38 && rand() < 0.25) retire(t, 'from competition');
  }
  // the independent field holds about eight trainers; the weakest lose their place
  // (a Gym Leader back for a title run keeps their place through their guaranteed seasons)
  const indies = independents().filter(t => t.returned !== S.season && !comebackProtected(t)).sort((a, b) => tradeValue(a) - tradeValue(b));
  while (indies.length > indieCap()) toFreeAgent(indies.shift(), 'lost their place on the circuit');
  S.stats = { ko: {}, use: {} };
  S.seatBattles = [];
  });
  for (const id of S.freeAgents.slice()) {
    const t = T(id); if (!t || t.role !== 'free') continue;
    if (rand() < ageRetireChance(t)) retire(t, `after ${t.seasons} seasons`);
    else if (S.season - (t.freeSince || S.season) >= 3 && rand() < 0.5) retire(t, 'after three seasons without a team');
  }
  S.changes = changes;
}
// one League's part of the offseason: champions, gyms, the Elite Four and the meta
function leagueOffseason(standings, changes) {
  const L = S.league;
  S.seatBattles = [];
  const deepest = L.entries.filter(e => e.stage < 5).sort((a, b) => b.stage - a.stage)[0];
  const meta = metaMons();
  buildBanBallot();
  { const c = T(S.champion);
    if (c.org) {
      const k = c.org; c.champOrg = c.champOrg || k; c.homeOrg = k; leaveOrg(c);
      changes.push(`${c.name} now serves the League as Champion and leaves ${orgName(k)}'s roster. ${orgName(k)} keeps the credit: an open roster spot in the draft, 3 points per title defense, and a Paradox Pokémon for its ranch each season the reign lasts.`);
      news(changes[changes.length - 1], k === S.userOrg ? 'you' : 'title', c.id);
    } }
  S.history.push({
    season: S.season, champ: S.champion, champOrg: champOrg(), champWasNew: L.startChamp !== S.champion, prevChamp: L.startChamp,
    runner: deepest ? deepest.id : null, runnerStage: deepest ? deepest.stage : null, runnerOrg: deepest && T(deepest.id) ? T(deepest.id).org || null : null,
    qualifiers: L.entries.length, metaMons: meta, standings, cup: standings[0].key,
    userOrg: S.userOrg, userRank: standings.findIndex(r => r.key === S.userOrg) + 1,
    userResults: userTrainers().filter(inLg).map(t => { const e = L.entries.find(x => x.id === t.id); return { id: t.id, badges: t.badges.length, stage: e ? e.stage : null, role: t.role }; }),
  });
  // v189: a team's trainer who ends the League as Champion puts their title roster in the team's historical ranch
  { const ck = champOrg(), c = T(S.champion); if (ck && c && typeof ranchChampionRoster === 'function') ranchChampionRoster(ck, c, L.startChamp !== S.champion); }
  const ran = new Set([...S.challengers, ...L.entries.map(e => e.id)]);
  for (const id of ran) {
    const t = T(id); const e = L.entries.find(x => x.id === id);
    t.seasonHist.push({ season: S.season, lg: S.lg || 0, org: t.org, badges: t.badges.length, stage: e ? e.stage : null, ovr: ovr(t), pts: trainerPoints(t, L) });
  }
  if (!ran.has(S.champion)) T(S.champion).seasonHist.push({ season: S.season, lg: S.lg || 0, org: T(S.champion).org, role: 'champion', ovr: ovr(T(S.champion)), pts: trainerPoints(T(S.champion), L) });
  // season awards
  { const aw = seasonAwards(L); S.history[S.history.length - 1].awards = aw;
    if (aw.length) news(`Season ${S.season} awards: ${aw.map(a => `${AWARDS[a.k].name}, ${a.sp ? a.name + "'s " + a.sp : a.name}`).join('; ')}.`, 'title');
    for (const a of aw) { const t = T(a.id); if (t && t.user) news(`${dn(t)}${a.sp ? "'s " + a.sp : ''} won ${AWARDS[a.k].name}!`, 'you', t.id); }
    legendOffseason(L, aw); }

  // --- dethroned champions: team trainers go back to their team; others move on
  for (const id of L.dethroned) {
    const c = T(id);
    c.champOrg = null;
    if (retiresOnLosingPost(c)) {
      retire(c, 'after losing the championship');
      changes.push(`Former Champion ${c.name} retired after losing the title.`);
    } else if (c.org || ovr(c) < 62) {
      closePost(c); c.role = 'challenger'; c.lg = S.lg || 0; if (!S.challengers.includes(c.id)) S.challengers.push(c.id);
      changes.push(`${dn(c)} lost the crown and returns to the circuit${c.org ? ' with ' + orgName(c.org) : ''}.`);
      news(changes[changes.length - 1], c.user ? 'you' : 'move', c.id);
      if (!c.org) offerRejoin(c); else c.homeOrg = null;
    } else {
      if (!seatChallenge(c, weakestSeat(), changes, ', the former Champion,')) {
        retireOrReturn(c, 'lost the title and then a seat challenge');
        changes.push(`Former Champion ${c.name} returns to the badge circuit.`);
      }
    }
    if (c.role === 'challenger') (S.slamReturn = S.slamReturn || []).push(c.id);
  }

  // --- gym leaders
  const userPick = () => userTrainers().filter(t => t.role === 'challenger' && S.challengers.includes(t.id) && !comebackProtected(t) && t.badges.length >= 6 && ovr(t) >= 55 && t.age >= 16).sort((a, b) => ovr(b) - ovr(a))[0];
  // gyms ranked by how often they held this season (rotation changes each gym's difficulty, so it's relative)
  const holdOf = g => { const p = g.w + g.l; return p ? g.w / p : 1; }, holdRank = S.gyms.map(holdOf).sort((a, b) => b - a);
  S.gyms.forEach((g, i) => {
    const t = T(g.leader); const played = g.w + g.l; const hold = played ? g.w / played : 1;
    g.hist.push({ season: S.season, w: g.w, l: g.l, leader: t.id });
    let leave = null;
    let stepDown = false;
    // a poor season = the gym held fewer than 30% of 6+ challenges. Only three in a row costs a leader the gym.
    const poor = played >= 6 && hold < 0.3;
    if (g.poorFor !== t.id) { g.poorFor = t.id; g.poor = 0; }
    g.poor = poor ? (g.poor || 0) + 1 : 0;
    // an exceptional season: one of the three best-holding gyms of the season (5+ challenges; v157, was two). After 6–8
    // of them in a row a leader wants another shot at the title (a third of the time after 6, half after 7, always by 8)
    // and returns to the circuit, sharper
    const wall = played >= 5 && holdRank.indexOf(hold) <= 2;
    t.wallStreak = wall ? (t.wallStreak || 0) + 1 : 0;
    let comeback = false;
    // a comeback comes before any age check: they want back in, whatever their age
    if (wall && t.wallStreak >= COMEBACK_MIN && rand() < (COMEBACK_ODDS[t.wallStreak - COMEBACK_MIN] ?? 1)) { leave = 'comeback'; comeback = true; }
    else if (rand() < ageRetireChance(t)) leave = 'after a long career';
    else if (g.poor >= 3) { leave = `after three straight poor seasons at ${TOWNS[i]} Gym (${g.w} of ${played} held this year)`; stepDown = true; }
    if (comeback) {
      const n = t.wallStreak;
      for (const k of RK) t.r[k] = clamp(t.r[k] + ri(3, 6), 1, 99);
      t.noRetireUntil = (S.season || 0) + 1 + COMEBACK_GUARD; t.wallStreak = 0;
      t.comebacks = (t.comebacks || []).concat([{ season: S.season, gym: TOWNS[i], seasons: n, lg: S.lg || 0 }]);
      g.leader = null;
      returnToCircuit(t, `has held ${TOWNS[i]} Gym through ${n} outstanding seasons in a row (${g.w}–${g.l} this year) and wants a shot at the title. They step down`);
      changes.push(`${dn(t)} stepped down from ${TOWNS[i]} Gym after ${n} outstanding seasons to chase the title.`);
    }
    if (!leave) {
      if (played >= 5 && hold >= 0.7) { for (const k of RK) t.r[k] = clamp(t.r[k] + ri(0, 2), 1, 99); changes.push(`${TOWNS[i]} Gym (${dn(t)}) earned a reputation as a wall: ${g.w}–${g.l} this season.`); }
      else if (poor) { for (const k of RK) t.r[k] = clamp(t.r[k] + ri(1, 4), 1, 99); changes.push(`${dn(t)} rebuilt ${TOWNS[i]} Gym's training program after going ${g.w}–${g.l}${g.poor === 2 ? '. One more poor season and the League will replace them' : ''}.`); }
      return;
    }
    if (comeback) { /* already back on the circuit */ }
    else if (stepDown && !retiresOnLosingPost(t)) { g.leader = null; returnToCircuit(t, `stepped down as ${TOWNS[i]} Gym Leader ${leave}`); }
    else retire(t, leave);
    const up = userPick();
    if (up && !gmOffered(S.userOrg) && !S.offers.some(o => o.id === up.id) && rand() < 0.6) {
      markGmOffer(S.userOrg);
      S.offers.push({ kind: 'leader', slot: i, id: up.id, lg: S.lg || 0 });
      S.gyms[i].leader = null;
      changes.push(`${TOWNS[i]} Gym is vacant. The League has invited ${dn(up)} of ${orgName(up.org)} to take it over.`);
      return;
    }
    const cand = bestCandidate([]);
    let nl;
    if (cand && rand() < 0.7) {
      const from = orgName(cand.org);
      changes.push(`${dn(cand)} left ${from} to lead ${TOWNS[i]} Gym (${specOf(cand)}). ${from} has an open roster spot and a compensation pick.${cand.formerUser ? ' One of your former trainers!' : ''}`);
      if (cand.org) promote(cand, 'leader', i); else { S.challengers = S.challengers.filter(x => x !== cand.id); installElite(cand, 'leader', i); }
      nl = cand;
    } else {
      // sometimes the outsider is a famous trainer of the right type
      const fam = !(S.cfg && S.cfg.allFamous) && rand() < FAMOUS_POST_CHANCE ? famousAvailable(f => f.spec && (/Leader|Kahuna|Captain|Elite Four/.test(f.cls) || f.tags.includes('brain')) && f.age >= 14) : [];
      nl = fam.length ? makeFamous(pick(fam), 'leader', 52 + i * 2, GYM_LV[i]) : newTrainer({ age: ri(26, 44), quality: 52 + i * 2, role: 'leader' });
      changes.push(`Outsider ${nl.name} was appointed leader of ${TOWNS[i]} Gym (${nl.specialty}).`);
      installElite(nl, 'leader', i);
    }
    news(changes[changes.length - 1], 'move', nl.id);
  });

  // --- elite four turnover
  if (deepest && deepest.stage >= 3) {
    const r = T(deepest.id);
    const wi = weakestSeat();
    const weak = T(S.e4[wi]);
    // v186: if the deep runner's team has already had its offer this offseason, the League looks to the independents
    const fit = c => c && c.role === 'challenger' && (ovr(c) > ovr(weak) + 2 || weak.age >= 50);
    let cand = fit(r) ? r : null;
    if (cand && gmOffered(cand.org)) {
      const alt = L.entries.filter(e => e.stage >= 2).map(e => T(e.id)).filter(c => c && !c.org && fit(c) && !comebackProtected(c)).sort((a, b) => ovr(b) - ovr(a))[0];
      changes.push(`${dn(cand)} earned an Elite Four look, but ${orgName(cand.org)} has already had its offer this offseason.${alt ? '' : ' No seat challenge this year.'}`);
      cand = alt || null;
    }
    if (cand) {
      if (cand.user) {
        if (!S.offers.some(o => o.id === cand.id)) { markGmOffer(cand.org); S.offers.push({ kind: 'e4', slot: wi, id: cand.id, lg: S.lg || 0 }); changes.push(`The League invited ${dn(cand)} to challenge ${dn(weak)} for Elite Four seat #${wi + 1}.`); }
      } else { markGmOffer(cand.org); seatChallenge(cand, wi, changes, cand === r ? ' (a deep League run)' : ' (a strong independent)'); }
    }
  }
  S.e4.forEach(id => { const t = T(id); if (t.role === 'e4' && rand() < ageRetireChance(t)) { const i = S.e4.indexOf(id); retire(t, 'from the Elite Four'); const fam = !(S.cfg && S.cfg.allFamous) && rand() < FAMOUS_POST_CHANCE ? famousAvailable(f => f.spec && f.age >= 18 && (/Elite Four|Kahuna|Master/.test(f.cls) || f.tags.includes('brain')) && !S.e4.some(x => x !== id && T(x) && T(x).specialty === f.spec)) : []; const nt = fam.length ? makeFamous(pick(fam), 'e4', 66, E4_LV[i]) : newTrainer({ age: ri(30, 45), quality: 66, role: 'e4' }); installElite(nt, 'e4', i); changes.push(`${t.name} stepped down; ${nt.name} (${nt.specialty}) joins the Elite Four.`); } });

  // --- meta shift: elite trainers with nothing that hits one of the season's top Pokémon hard add a counter for it
  if (meta.length) {
    const adapters = [];
    for (const id of featOn('meta') ? S.gyms.map(g => g.leader).filter(Boolean).concat(S.e4) : []) {
      const t = T(id); if (!t || t.team.length < 3) continue;
      const open = meta.filter(sp => !t.team.some(m => monTypes(m).some(ty => effVs(ty, sp) >= 2)));
      if (!open.length || rand() > 0.6) continue;
      const target = pick(open), ctr = TYPES.filter(a => effVs(a, target) >= 2);
      const slot = eliteSlot(t);
      if (!slot) continue;
      const cands = [...new Set(BASES.map(b => formAt(b, slot.lvl)))].filter(f => SP[f].types.some(ty => ctr.includes(ty)) && SP[f].bst <= 320 + slot.lvl * 6 && !t.team.some(m => LINE[m.sp] === LINE[f]));
      if (!cands.length) continue;
      const nm = stamp(makeMon(pick(cands), slot.lvl), 'assigned');
      if (t.team.length >= slot.size) { farewell(t, t.team[0], 'replaced to counter the meta'); t.team.splice(0, 1); }
      t.team.unshift(nm); relevelElite(t);
      adapters.push(`${dn(t)} (${nm.sp}, for ${target})`);
    }
    S.metaMons = meta; S.meta = null;
    changes.push(`Season ${S.season}'s top performers on the circuit: ${meta.join(', ')}.${adapters.length ? ' Adding counters next season: ' + adapters.join(', ') + '.' : ''}`);
    news(`Meta report: ${meta.join(', ')} knocked out the most opponents per battle on the circuit. ${adapters.length} elite trainer${adapters.length === 1 ? ' is' : 's are'} adding counters.`, 'meta');
  }
}

