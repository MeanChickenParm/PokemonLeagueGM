// ================= AMBITION, TRUST, SIT-DOWNS AND TRADES (2.0) =================
// Every trainer has an ambition. Chaser spots are scarce (three per party), so a trainer who wants the title and is
// kept in support runs out of patience and asks for a chaser spot or their release. That is the game's contract
// system; there is no money. Trust is how much one of your trainers believes in you.
const AMBS = {
  title:   { name: 'Wants the title',   hint: 'seems driven' },
  either:  { name: 'Open to any role',  hint: 'hard to read' },
  support: { name: 'Happy to support',  hint: 'seems content to support' },
};
function ambOf(t) {
  if (!t.amb) {
    const tr = traitOf(t);
    const p = clamp(0.38 + (t.pot - 62) / 90 + (t.age < 24 ? 0.14 : 0) - (t.age > 33 ? 0.28 : 0) + (['competitor', 'hothead', 'clutch'].includes(tr) ? 0.12 : 0) - (tr === 'mentor' ? 0.15 : 0), 0.08, 0.9);
    const r = rand();
    t.amb = r < p ? 'title' : r < p + (1 - p) * 0.62 ? 'either' : 'support';
  }
  return t.amb;
}
// what other teams see: a scout's read that can be wrong, until the trainer shows their hand in public
function ambSeen(t) {
  if (t.ambKnown) return ambOf(t);
  if (!t.ambHint) t.ambHint = rand() < 0.7 ? ambOf(t) : pick(Object.keys(AMBS).filter(k => k !== ambOf(t)));
  return t.ambHint;
}
const ambText = t => t.user || t.ambKnown ? AMBS[ambOf(t)].name : `Scout: ${AMBS[ambSeen(t)].hint}`;
const unhappyRole = t => inParty(t) && ambOf(t) === 'title' && (t.slot === 'companion' || t.slot === 'bench');
const upSeason = () => S.phase === 'season' || S.phase === 'league' ? S.season : S.season + 1;
const promiseDue = t => t.promise != null && t.promise <= upSeason();
// what the player reads on their own trainer
function patienceText(t) {
  if (!inParty(t)) return '';
  if (t.promise != null) return promiseDue(t) ? 'promised a chaser spot this season' : `promised a chaser spot in Season ${t.promise}`;
  if (!unhappyRole(t)) return '';
  const p = t.patience == null ? 1 : t.patience;
  return p <= 0 ? 'will ask out after this season' : `will wait ${p} more season${p > 1 ? 's' : ''}`;
}
const trustOf = t => t.trust == null ? 50 : t.trust;
function addTrust(t, d) { if (t && inParty(t)) t.trust = clamp(Math.round(trustOf(t) + (d > 0 ? d * clamp((95 - trustOf(t)) / 45, 0.15, 1) : d)), 0, 100); }
const trustWord = t => { const v = trustOf(t); return v >= 75 ? 'trusts you fully' : v >= 58 ? 'trusts you' : v >= 42 ? 'neutral' : v >= 25 ? 'wary of you' : 'does not trust you'; };

// week 1: anyone in a role they don't want starts counting
function ambitionSeasonStart() {
  eachParty((k, i) => {
    for (const t of partyOf(k, i)) {
      if (unhappyRole(t)) { if (t.patience == null) t.patience = ['hothead', 'competitor'].includes(traitOf(t)) ? 0 : ri(0, 2); }
      else t.patience = null;
      if (t.forceChase != null && t.forceChase <= S.season) t.forceChase = null;
    }
  });
}
// the end of a season: trust moves, patience runs down, ambitions drift, and requests are made
function ambitionSeasonEnd(changes) {
  eachParty((k, i) => {
    const P = partyOf(k, i); if (!P.length) return;
    const mine = k === S.userOrg;
    const asks = [], backs = [];
    for (const t of P) {
      const h = (t.seasonHist || []).slice(-1)[0], prev = (t.seasonHist || []).slice(-2)[0];
      const done = t.slot === 'chaser' && h && h.season === S.season && h.badges === 8;
      if (t.slot === 'chaser') addTrust(t, done ? 3 + (h.stage >= 3 ? 3 : 0) : -2);
      addTrust(t, unhappyRole(t) ? -5 : 1);
      if (t.promise != null && t.promise <= S.season && t.slot === 'chaser') { addTrust(t, 10); t.promise = null; }
      if (t.sit && t.sit.season === S.season) {
        if (t.sit.ok && h) addTrust(t, (t.slot === 'chaser' ? done || (prev && h.badges > (prev.badges || 0)) : true) ? 5 : -4);
        t.sit = null;
      }
      // ambitions drift with age and results
      const was = ambOf(t);
      if (was === 'title' && ((t.age >= 34 && rand() < 0.25) || (t.slot === 'chaser' && dryStreak(t) >= 3 && rand() < 0.3))) t.amb = 'either';
      else if (was === 'either' && t.age >= 38 && rand() < 0.3) t.amb = 'support';
      if (t.amb !== was) t.ambHint = null;
      if (unhappyRole(t) && t.promise == null) { t.patience = (t.patience == null ? 1 : t.patience) - 1; if (t.patience < 0) asks.push(t); }
      else if (t.slot === 'chaser' && ambOf(t) !== 'title' && !done && (ambOf(t) === 'support' || t.age >= 33) && rand() < 0.5) backs.push(t);
    }
    // at most one request per party per season
    const ask = asks.sort((a, b) => ovr(b) - ovr(a))[0], back = !ask && backs.sort((a, b) => b.age - a.age)[0];
    if (ask) {
      ask.ambKnown = true;
      if (mine) { S.offers.push({ kind: 'demand', id: ask.id, lg: i }); changes.push(`${dn(ask)} wants a title-chaser spot, or to be let go.`); }
      else aiDemand(ask);
    } else if (back) {
      back.ambKnown = true;
      if (mine) { S.offers.push({ kind: 'stepback', id: back.id, lg: i }); changes.push(`${dn(back)} has asked to step back into a support role.`); }
      else if (P.some(x => x.slot !== 'chaser')) stepBack(back);
    }
  });
}
// who could take a chaser's spot if they moved into support, strongest first
const stepUps = t => partyMates(t).filter(x => x !== t && x.slot !== 'chaser').sort((a, b) => ovr(b) - ovr(a));
// a chaser moves into support; the trainer you pick (upId) takes the spot, or the strongest of the others
function stepBack(t, upId) {
  const ups = stepUps(t), up = ups.find(x => x.id === upId) || ups[0];
  if (!up) return false;
  const s = up.slot, r = up.prole; up.slot = 'chaser'; up.prole = null; t.slot = s === 'apprentice' && !canApprentice(t) ? 'companion' : s; t.prole = r;
  if (ambOf(t) === 'either' && t.age >= 33) t.amb = 'support';
  up.forceChase = upSeason(); up.patience = null;
  inLeague(lgOf(t), () => fixParty(t.org));
  news(`${dn(t)} stepped back into a support role with ${orgName(t.org)}. ${dn(up)} takes the chaser spot.`, t.user ? 'you' : 'move', t.id);
  return true;
}
// two trainers trade teams, each taking the other's place
function tradeSwap(a, b) {
  const ka = a.org, kb = b.org, la = lgOf(a), lb = lgOf(b), sa = a.slot, sb = b.slot, ra = a.prole, rb = b.prole;
  leaveOrg(a); leaveOrg(b);
  joinOrg(a, kb); joinOrg(b, ka);
  if (la !== lb) { shiftLeague(a, lb); shiftLeague(b, la); }
  a.slot = sb; a.prole = rb; b.slot = sa; b.prole = ra;
  for (const t of [a, b]) { t.trust = 50; t.patience = null; t.promise = null; t.forceChase = null; t.sit = null; if (t.slot === 'apprentice' && !canApprentice(t)) t.slot = null; }
  inLeague(lb, () => fixParty(kb)); inLeague(la, () => fixParty(ka));
  if (nLeagues() > 1) { settleLegendClash(a); settleLegendClash(b); }
  news(`Trade: ${orgName(ka)} sent ${dn(a)} to ${orgName(kb)} for ${dn(b)}.`, a.user || b.user ? 'you' : 'move', a.id);
}
// would this trainer be a chaser in that party?
const wouldChase = (t, k, i) => { const ch = partyOf(k, i).filter(x => x.slot === 'chaser').sort((x, y) => ovr(y) - ovr(x)); return ch.length < PARTY_CHASERS || ovr(t) > ovr(ch[ch.length - 1]); };
// a team answers one of its own trainers who has asked for a chaser spot
function aiDemand(t) {
  const k = t.org, i = lgOf(t);
  if (wouldChase(t, k, i) || ovr(t) >= Math.min(...partyOf(k, i).filter(x => x.slot === 'chaser').map(ovr)) - 2) { t.forceChase = upSeason(); t.patience = null; news(`${dn(t)} asked ${orgName(k)} for a title-chaser spot and will get one next season.`, 'move', t.id); return; }
  // otherwise look for a team where they would chase, and trade for someone of similar value
  for (const k2 of shuffle(ORG_KEYS.filter(x => x !== k && x !== S.userOrg))) for (const j of partyLeagues(k2)) {
    if (!wouldChase(t, k2, j)) continue;
    const x = partyOf(k2, j).filter(c => c.promise == null && Math.abs(tradeValue(c, k) - tradeValue(t, k)) <= 8 && !(ambOf(c) === 'title' && c.slot === 'chaser')).sort((a, b) => tradeValue(b, k) - tradeValue(a, k))[0];
    if (x) { tradeSwap(t, x); return; }
  }
  release(t, 'after they asked for a title-chaser spot');
}

// ---------- simple trades ----------
const canTrade = () => !!S && !!S.userOrg && (S.phase === 'offseason' || S.phase === 'reassign');
// what other teams would give for one of your trainers: one trainer each (the best they'd part with), or a draft pick
function tradeOptions(t) {
  const k = S.userOrg, out = [];
  if (!t || !inParty(t) || t.org !== k) return out;
  for (const k2 of ORG_KEYS) {
    if (k2 === k) continue;
    const their = partyLeagues(k2).flatMap(j => partyOf(k2, j));
    if (!their.length) continue;
    const v = tradeValue(t, k2);
    const x = their.filter(c => c.promise == null && tradeValue(c, k2) <= v + 1).sort((a, b) => tradeValue(b, k) - tradeValue(a, k))[0];
    if (x) out.push({ kind: 'swap', org: k2, id: x.id });
    const weakest = Math.min(...their.map(c => tradeValue(c, k2)));
    if (v >= weakest + 6) out.push({ kind: 'pick', org: k2 });
  }
  return out;
}
function gmTrade(id, n) {
  const t = T(id); if (!canTrade() || !t) return 'Trades are made in the offseason.';
  const o = tradeOptions(t)[n]; if (!o) return 'That offer is gone.';
  if (o.kind === 'swap') { tradeSwap(t, T(o.id)); return null; }
  // for a pick: they take the trainer into the party with the most room (letting their weakest go if it is full)
  const k2 = o.org, j = partyLeagues(k2).sort((a, b) => partyOf(k2, a).length - partyOf(k2, b).length)[0];
  if (partyOf(k2, j).length >= PARTY_SIZE) { const w = partyOf(k2, j).sort((a, b) => tradeValue(a, k2) - tradeValue(b, k2))[0]; release(w, 'to make room after a trade'); }
  const was = dn(t), from = t.org;
  leaveOrg(t); joinOrg(t, k2); if (lgOf(t) !== j) shiftLeague(t, j);
  t.trust = 50; t.patience = null; t.promise = null;
  inLeague(j, () => fixParty(k2));
  if (nLeagues() > 1) settleLegendClash(t);
  (S.compPicks = S.compPicks || []).push({ org: from, from: was });
  news(`Trade: ${orgName(from)} sent ${was} to ${orgName(k2)} for an extra pick in the next draft.`, 'you', t.id);
  return null;
}

// ---------- the player answers a request ----------
// demand: 'promote' (arg: the chaser who makes way), 'promise', 'trade' (arg: which offer), 'release'. stepback: 'yes' (arg: who takes the chaser spot) / 'no'.
function answerRequest(choice, arg) {
  const o = S.offers[0]; if (!o || (o.kind !== 'demand' && o.kind !== 'stepback')) return false;
  const t = T(o.id);
  if (!t || t.org !== S.userOrg || !inParty(t)) { S.offers.shift(); return true; }
  const mates = partyMates(t).filter(x => x !== t);
  if (o.kind === 'stepback') {
    if (choice === 'yes' && stepBack(t, arg)) addTrust(t, 5);
    else { addTrust(t, -3); news(`${dn(t)} asked to step back; you asked them to keep chasing.`, 'you', t.id); }
    S.offers.shift(); return true;
  }
  if (choice === 'promote') {
    const ch = mates.filter(x => x.slot === 'chaser');
    const down = ch.find(x => x.id === arg) || ch.sort((a, b) => ovr(a) - ovr(b))[0];
    if (down) { down.slot = t.slot === 'bench' ? 'companion' : t.slot; down.prole = t.prole; if (ambOf(down) === 'title') { addTrust(down, -6); down.patience = null; } }
    t.slot = 'chaser'; t.prole = null; t.patience = null; t.promise = upSeason(); addTrust(t, 8);
    inLeague(lgOf(t), () => fixParty(t.org));
    news(`${dn(t)} gets a title-chaser spot${down ? `; ${dn(down)} moves into support` : ''}.`, 'you', t.id);
  } else if (choice === 'promise') {
    t.promise = upSeason() + 1; t.patience = null; addTrust(t, 2);
    news(`You promised ${dn(t)} a title-chaser spot in Season ${t.promise}.`, 'you', t.id);
  } else if (choice === 'trade') {
    const why = gmTrade(t.id, arg | 0); if (why) return false;
  } else if (choice === 'release') {
    release(t, 'after they asked for a title-chaser spot');
    for (const x of mates) if (ambOf(x) === 'title') addTrust(x, -2);
  } else return false;
  S.offers.shift(); return true;
}
// what the auto-player does with a request (used when simming)
function autoRequest() {
  const o = S.offers[0], t = T(o.id);
  if (o.kind === 'stepback') return answerRequest('yes');
  if (t && inParty(t) && ovr(t) >= Math.min(...partyMates(t).filter(x => x.slot === 'chaser').map(ovr), 999) - 2) return answerRequest('promote');
  const opts = t ? tradeOptions(t) : [], n = opts.findIndex(x => x.kind === 'swap');
  return answerRequest(n >= 0 ? 'trade' : 'release', n);
}
// (trade offers from other teams are answered with answerTradeOffer)
// promises come due at the party step: a trainer promised a chaser spot who doesn't have one leaves
const brokenPromises = (k = S.userOrg) => k ? partyLeagues(k).flatMap(i => partyOf(k, i)).filter(t => promiseDue(t) && t.slot !== 'chaser') : [];
function settlePromises() {
  const k = S.userOrg; if (!k) return;
  for (const t of brokenPromises(k)) {
    const mates = org(k).roster.map(T).filter(x => x && x !== t && inParty(x));
    release(t, 'after a broken promise of a title-chaser spot');
    for (const x of mates) addTrust(x, -8);
    news(`You broke your promise to ${dn(t)}. They have left, and your other trainers trust you less.`, 'you', t.id);
  }
}

// ---------- sit-downs ----------
// One conversation per party per season, before week 1 or at the midseason break. The trainer may not listen: it depends on trust and temper.
const SITS = {
  ace:      { name: 'Rebuild around your ace', text: 'Their highest-level Pokémon levels up faster this season.' },
  coverage: { name: 'Widen your coverage',     text: 'They spend more weeks exploring until the team is six strong.' },
  train:    { name: 'Slow down and train',     text: 'They wait until they are stronger before challenging each gym.' },
  go:       { name: 'Go for it',               text: 'They challenge gyms sooner, at more of a risk.' },
};
const sitOn = (t, msg) => !!t.sit && t.sit.ok && t.sit.season === S.season && t.sit.msg === msg;
function sitOdds(t) { const tr = traitOf(t); return clamp(0.3 + trustOf(t) / 100 * 0.55 + (tr === 'steady' || tr === 'mentor' ? 0.1 : tr === 'hothead' ? -0.15 : tr === 'streaky' ? -0.05 : 0), 0.1, 0.95); }
const sitUsed = (k, i) => partyState(k, i).sat === upSeason();
// 2.0.1: before week 1, or at the midseason break if the party's sit-down hasn't been used
const sitWindow = () => canSetPolicy() || (S.phase === 'season' && !!S.tourneyPause);
const canSit = t => !!t && t.user && inParty(t) && (t.slot === 'chaser' || t.slot === 'apprentice') && sitWindow() && !sitUsed(t.org, lgOf(t));
function sitDown(id, msg) {
  const t = T(id); if (!canSit(t) || !SITS[msg]) return null;
  const ok = rand() < sitOdds(t);
  partyState(t.org, lgOf(t)).sat = upSeason();
  t.sit = { msg, season: upSeason(), ok };
  if (!ok) addTrust(t, -2);
  news(ok ? `You sat down with ${dn(t)}: "${SITS[msg].name}." They took it on board.` : `You sat down with ${dn(t)}: "${SITS[msg].name}." They heard you out and will do it their own way.`, 'you', t.id);
  return { ok };
}

// ================= THE RANCH AS A SHARED POOL (2.0) =================
// One ranch per team, shared by all its parties. Trainers help themselves in two windows a year (the offseason and
// the midseason break): chasers and apprentices only, one ranch Pokémon out each. It is a loan for the season, and
// becomes theirs only if it makes their registered three. Each trainer may also leave one Pokémon behind per season.
// The GM only decides what goes in: the retirement keep, the Champion's reward and farewell gifts.
const canBorrow = t => inParty(t) && (t.slot === 'chaser' || t.slot === 'apprentice') && !t.team.some(m => m.loan);
const leaveTeam = (t, m) => { if (m.item) { bagAdd(t, m.item); m.item = null; } if (t.mega && t.mega.uid === m.uid) t.mega.uid = null; t.team = t.team.filter(x => x !== m); };
// a loan that made its trainer's three is theirs now; the rest go back to the ranch
function returnLoans(k) {
  for (const t of org(k).roster.map(T).filter(x => x && inParty(x))) {
    const due = t.team.filter(m => m.loan && m.loan.season <= S.season); if (!due.length) continue;
    const keep = new Set(bestThree(t));
    for (const m of due) {
      delete m.loan;
      if (keep.has(m.uid) || t.team.length <= 1 || !ranchable(m.sp)) continue;
      farewell(t, m, `went back to ${orgName(k)}'s ranch`); leaveTeam(t, m);
      addToRanch(k, m, { how: 'returned', season: curSeason(), from: t.id, fromName: dn(t) });
    }
  }
}
// each trainer may leave one Pokémon they would otherwise release in the ranch for a teammate
function trainerDeposits(k) {
  for (const t of org(k).roster.map(T).filter(x => x && inParty(x))) {
    if (regular(t).length <= START_TEAM) continue;
    const keep = new Set(bestThree(t));
    const m = regular(t).filter(x => !keep.has(x.uid) && canRest(t, x) && !x.loan).sort((a, b) => ranchValue(b, t) - ranchValue(a, t))[0];
    if (!m) continue;
    farewell(t, m, `left in ${orgName(k)}'s ranch`); leaveTeam(t, m);
    addToRanch(k, m, { how: 'deposit', season: curSeason(), from: t.id, fromName: dn(t) });
  }
}
// how far behind a trainer is: fewer badges (or a worse last season) picks first
const behindOf = t => S.phase === 'season' ? t.badges.length : (((t.seasonHist || []).slice(-1)[0] || {}).badges ?? 0);
// trainers help themselves. A contested Pokémon goes to whoever it suits best by type, then whoever is furthest behind.
function ranchBorrow(k, mid) {
  const R = ranchOf(k); if (!R || !R.active.length) return;
  if (!mid) {
    returnBannedHome(k);
    // a banned legendary (or other one-of-a-kind) waiting in the ranch goes to the weakest teammate who can take it
    for (const m of R.active.filter(x => x.ranch && x.ranch.how === 'banned' && banUnique(x.sp)).sort((a, b) => ranchValue(b) - ranchValue(a))) {
      const t = ranchTakers(k).filter(x => ranchCanTake(x, m)).sort((a, b) => ovr(a) - ovr(b))[0];
      if (t) ranchHand(k, m.uid, t.id);
    }
  }
  const worth = (t, m) => mid ? t.team.length < 6 && ranchValue(m, t) > Math.min(...t.team.map(x => ranchValue(x, t))) : t.team.length < 3 || ranchValue(m, t) > t.team.map(x => ranchValue(x, t)).sort((a, b) => b - a)[Math.min(2, t.team.length - 1)] * 0.92;
  for (const m of R.active.filter(x => !(x.ranch && x.ranch.how === 'banned' && banUnique(x.sp))).sort((a, b) => ranchPickValue(b) - ranchPickValue(a))) {
    const takers = org(k).roster.map(T).filter(t => t && canBorrow(t) && !(S.ranchGiven || {})[t.id] && ranchCanTake(t, m) && !t.team.some(y => LINE[y.sp] === LINE[m.sp]) && !(m.ranch && m.ranch.from === t.id && m.ranch.season === curSeason()) && worth(t, m));
    if (!takers.length) continue;
    const t = takers.sort((a, b) => specFit(b, m.sp) - specFit(a, m.sp) || behindOf(a) - behindOf(b) || ovr(a) - ovr(b))[0];
    const got = ranchHand(k, m.uid, t.id);
    if (got && got.gift != null) { got.loan = { org: k, season: mid ? S.season : S.season + 1 }; if (mid) got.gift = S.season; }
  }
}
function ranchMidseason() { S.ranchGiven = {}; for (const k of ORG_KEYS) ranchBorrow(k, true); }
// a party can move to a League where one of its legendaries is already held if the GM leaves that legendary in the ranch
function leaveLegendsFor(k, from, to) {
  const P = partyOf(k, from), out = [];
  const held = inLeague(to, () => { const h = new Set(); for (const x of leagueTrainers()) if (!P.includes(x) && !(fieldsIn(k, to) && partyOf(k, to).includes(x)) && !['retired', 'prospect', 'free'].includes(x.role)) for (const m of x.team || []) if (SP[m.sp].legend) h.add(m.sp); return h; });
  for (const t of P) for (const m of t.team.filter(x => SP[x.sp].legend && held.has(x.sp))) {
    if (t.team.length <= 1) continue;
    leaveTeam(t, m);
    addToRanch(k, m, { how: 'banned', moved: true, season: curSeason(), from: t.id, fromName: dn(t), lgName: leagueName(to) });
    news(`${dn(t)}'s ${m.sp} stays behind in the ${orgName(k)} ranch: one is already held in the ${leagueName(to)}.`, k === S.userOrg ? 'you' : 'move', t.id);
    out.push(m.sp);
  }
  return out;
}

// ================= TEAM BATTLE CUP (2.0) =================
// After the Leagues, every team meets in a knockout. A tie is a series of single battles, one trainer against one,
// in lineup order: best of five (fewer if a team is short). Anyone in a party can be picked, companions and the
// apprentice included. Battles are at equal level and on copies, so nothing carries home. The GM sets the lineup.
const TBC_SIZE = 5, TBC_PTS = { win: 5, final: 2 };
const cupEligible = k => org(k).roster.map(T).filter(t => t && inParty(t) && t.team && t.team.length);
// the lineup in order: the trainers the GM named first, then the strongest of the rest
function cupLineup(k) {
  const all = cupEligible(k), saved = (org(k).cupLine || []).map(T).filter(t => t && all.includes(t));
  return saved.concat(all.filter(t => !saved.includes(t)).sort((a, b) => teamPower(b) - teamPower(a))).slice(0, TBC_SIZE);
}
function setCupLineup(ids) { if (!S.userOrg || S.phase === 'league') return false; org(S.userOrg).cupLine = ids.slice(0, TBC_SIZE); return true; }
function cupDuel(a, b, title) {
  const copy = t => JSON.parse(JSON.stringify(t)), A = copy(a), B = copy(b);
  const keep = { stats: S.stats, dex: S.dex, dexSeason: S.dexSeason };
  S.stats = { ko: {}, use: {} }; S.dex = {}; S.dexSeason = {};
  try { return inLeague(lgOf(a), () => battle(A, B, 'title', title, { equal: true, world: true })); }
  finally { Object.assign(S, keep); }
}
function teamTie(ka, kb, round, C) {
  const A = cupLineup(ka), B = cupLineup(kb);
  let n = Math.min(A.length, B.length, TBC_SIZE); if (n % 2 === 0) n--;
  const keepLogs = round === 'Final' || ka === S.userOrg || kb === S.userOrg;
  let wa = 0, wb = 0; const games = [];
  for (let x = 0; x < n && wa <= n / 2 && wb <= n / 2; x++) {
    const r = cupDuel(A[x], B[x], `Team Battle Cup ${round} · ${dn(A[x])} vs ${dn(B[x])}`), w = r.winner === 0 ? A[x] : B[x];
    if (w === A[x]) wa++; else wb++;
    games.push({ a: A[x].id, b: B[x].id, w: w.id, log: keepLogs ? r : null });
  }
  const winner = wa > wb ? ka : kb;
  C.ties.push({ round, a: ka, b: kb, wa, wb, winner, games });
  return winner;
}
function teamBattleCup() {
  S.teamCup = null;
  const seeds = cupStandings(true).map(r => r.key).filter(k => cupLineup(k).length >= 1);
  if (seeds.length < 2) return null;
  const C = { season: S.season, ties: [], winner: null, runner: null };
  let P = 2; while (P < seeds.length) P *= 2;
  let alive = seedOrder(P).map(sd => seeds[sd - 1] || null);
  const rname = n => n <= 2 ? 'Final' : n <= 4 ? 'Semifinal' : 'Quarterfinal';
  while (alive.length > 1) {
    const nm = rname(alive.length), next = [];
    for (let x = 0; x < alive.length; x += 2) { const a = alive[x], b = alive[x + 1]; next.push(a && b ? teamTie(a, b, nm, C) : a || b); }
    alive = next;
  }
  const f = C.ties[C.ties.length - 1];
  C.winner = f.winner; C.runner = f.winner === f.a ? f.b : f.a;
  org(C.winner).battleCups = (org(C.winner).battleCups || 0) + 1;
  (S.teamCupHist = S.teamCupHist || []).push({ season: S.season, winner: C.winner, runner: C.runner, score: `${Math.max(f.wa, f.wb)}–${Math.min(f.wa, f.wb)}` });
  S.teamCup = C;
  news(`${orgName(C.winner)} won the Season ${S.season} Team Battle Cup, beating ${orgName(C.runner)} ${Math.max(f.wa, f.wb)}–${Math.min(f.wa, f.wb)} in the final.`, C.winner === S.userOrg || C.runner === S.userOrg ? 'you' : 'title');
  return C;
}
const tbcPoints = k => { const C = S.teamCup; return C && C.season === S.season ? (C.winner === k ? TBC_PTS.win : 0) + (C.runner === k ? TBC_PTS.final : 0) : 0; };

// ---------- trade offers from other teams, and the trade block ----------
// Each offseason another team may propose a one-for-one trade. Putting a trainer on the block makes offers for them likelier.
function setBlock(id, on) { const t = T(id); if (!t || !t.user || !inParty(t)) return false; t.block = !!on; return true; }
function tradeProposal(changes) {
  const k = S.userOrg; if (!k) return;
  const mine = partyLeagues(k).flatMap(i => partyOf(k, i)).filter(t => t.promise == null); if (!mine.length) return;
  const blocked = mine.filter(t => t.block);
  if (rand() >= (blocked.length ? 0.75 : 0.35)) return;
  for (const k2 of shuffle(ORG_KEYS.filter(x => x !== k))) {
    const their = partyLeagues(k2).flatMap(j => partyOf(k2, j)).filter(t => t.promise == null);
    const deals = [];
    for (const y of (blocked.length ? blocked : mine)) for (const x of their) {
      const gain = tradeValue(y, k2) - tradeValue(x, k2), cost = tradeValue(y, k) - tradeValue(x, k);
      if (gain >= 1 && cost <= 4) deals.push({ y, x, v: gain - cost });
    }
    const d = deals.sort((a, b) => b.v - a.v)[0];
    if (d) { S.offers.push({ kind: 'tradeoffer', id: d.y.id, other: d.x.id, org: k2, lg: lgOf(d.y) }); changes.push(`${orgName(k2)} has offered a trade for ${dn(d.y)}.`); return; }
  }
}
function answerTradeOffer(yes) {
  const o = S.offers[0]; if (!o || o.kind !== 'tradeoffer') return false;
  const y = T(o.id), x = T(o.other);
  if (yes && y && x && y.org === S.userOrg && x.org === o.org && inParty(y) && inParty(x)) tradeSwap(y, x);
  S.offers.shift(); return true;
}
