// ================= TRADE DESK, STEP-DOWNS AND THE GOD-MODE EDITOR (2.0.1) =================

// ---------- the trade desk: up to three trainers each way ----------
// The other team says yes when what it gets is worth at least what it gives, by its own valuation. Value is
// weighted toward quality, so three fringe trainers don't add up to a star. A side that gives more can ask for an
// extra pick in the next draft to even things out.
const TRADE_MAX = 3;
const deskValue = (t, k) => Math.pow(Math.max(1, tradeValue(t, k) - 40), 1.6);
const DESK_PICK = Math.pow(20, 1.6); // an extra draft pick is worth about a 60-value trainer
const tradeable = t => inParty(t) && t.promise == null;
// where each incoming trainer goes: into the place of the one going the other way, then wherever there is most room
function deskPlan(k, out, inc) {
  const size = {}; for (const i of partyLeagues(k)) size[i] = partyOf(k, i).length;
  for (const t of out) size[lgOf(t)]--;
  const plan = [];
  inc.forEach((t, n) => {
    let i = out[n] ? lgOf(out[n]) : null;
    if (i == null || size[i] >= PARTY_SIZE) i = Object.keys(size).map(Number).filter(j => size[j] < PARTY_SIZE).sort((a, b) => size[a] - size[b])[0];
    if (i == null) return;
    size[i]++; plan.push({ t, i, slot: out[n] ? out[n].slot : null, prole: out[n] ? out[n].prole : null });
  });
  return plan.length === inc.length ? plan : null;
}
// give: your trainers going; get: theirs coming; pick: true to ask for an extra draft pick as well
function tradeCheck(k2, give, get, pick) {
  const k = S.userOrg, A = (give || []).map(T), B = (get || []).map(T);
  if (!canTrade()) return { ok: false, why: 'Trades are made in the offseason.' };
  if (!k || !ORG_KEYS.includes(k2) || k2 === k) return { ok: false, why: 'Pick a team to trade with.' };
  if (!A.length || (!B.length && !pick)) return { ok: false, why: 'Choose at least one trainer to send, and what you want back.' };
  if (A.length > TRADE_MAX || B.length > TRADE_MAX) return { ok: false, why: `At most ${TRADE_MAX} trainers each way.` };
  if (A.some(t => !t || t.org !== k || !inParty(t)) || B.some(t => !t || t.org !== k2 || !inParty(t))) return { ok: false, why: 'Someone in this deal has moved on.' };
  const held = A.concat(B).find(t => !tradeable(t)); if (held) return { ok: false, why: `${dn(held)} has been promised a chaser spot and can't be traded.` };
  const mine = deskPlan(k, A, B), theirs = deskPlan(k2, B, A);
  if (!mine) return { ok: false, why: 'Your parties have no room for that many trainers.' };
  if (!theirs) return { ok: false, why: `${orgName(k2)} has no room for that many trainers.` };
  const gets = A.reduce((a, t) => a + deskValue(t, k2), 0), gives = B.reduce((a, t) => a + deskValue(t, k2), 0) + (pick ? DESK_PICK : 0);
  if (gets < gives) return { ok: false, why: `${orgName(k2)} wants more for that.`, short: Math.round((1 - gets / gives) * 100), mine, theirs };
  return { ok: true, mine, theirs };
}
function tradeMany(k2, give, get, pick) {
  const c = tradeCheck(k2, give, get, pick); if (!c.ok) return c.why;
  const k = S.userOrg, A = give.map(T), B = get.map(T);
  const touched = new Set();
  for (const t of A.concat(B)) touched.add(t.org + ':' + lgOf(t));
  for (const t of A.concat(B)) leaveOrg(t);
  const land = (plan, to) => { for (const p of plan) { joinOrg(p.t, to); if (lgOf(p.t) !== p.i) shiftLeague(p.t, p.i); p.t.slot = p.slot; p.t.prole = p.prole; p.t.promise = null; p.t.forceChase = null; p.t.sit = null; p.t.block = false; if (p.t.slot === 'apprentice' && !canApprentice(p.t)) p.t.slot = null; touched.add(to + ':' + p.i); } };
  land(c.mine, k); land(c.theirs, k2);
  for (const x of touched) { const [o, i] = x.split(':'); inLeague(+i, () => fixParty(o)); }
  if (nLeagues() > 1) for (const t of A.concat(B)) settleLegendClash(t);
  if (pick) (S.compPicks = S.compPicks || []).push({ org: k, from: A.map(dn).join(', ') });
  news(`Trade: ${orgName(k)} sent ${A.map(dn).join(', ')} to ${orgName(k2)} for ${B.map(dn).concat(pick ? ['an extra pick in the next draft'] : []).join(', ')}.`, 'you', A[0].id);
  return null;
}

// ---------- asking a chaser to step down ----------
// In the offseason you can ask a title chaser to take a support role. Someone who doesn't want the title agrees.
// Someone who does goes by how much they trust you: if they agree they make their peace with supporting; if they
// refuse they ask out, and you choose to keep them as a chaser or let them go.
const canAskDown = t => !!t && t.user && inParty(t) && t.slot === 'chaser' && canEditParty() && t.downAsked !== upSeason() && !t.askedOut && t.promise == null && partyMates(t).some(x => x !== t && x.slot !== 'chaser');
function downOdds(t) {
  if (ambOf(t) !== 'title') return 1;
  const tr = traitOf(t);
  return clamp(0.1 + trustOf(t) / 100 * 0.6 + (dryStreak(t) >= 2 ? 0.15 : 0) + (t.age >= 33 ? 0.1 : 0) - (tr === 'competitor' || tr === 'hothead' ? 0.2 : 0), 0.05, 0.9);
}
function askStepDown(id) {
  const t = T(id); if (!canAskDown(t)) return null;
  t.downAsked = upSeason();
  if (rand() < downOdds(t)) {
    const wanted = ambOf(t) === 'title';
    if (wanted) { t.amb = 'either'; t.ambHint = null; addTrust(t, -4); }
    stepBack(t); t.patience = null;
    return { ok: true };
  }
  t.askedOut = true; t.ambKnown = true; addTrust(t, -6);
  news(`You asked ${dn(t)} to step down from chasing the title. They refused, and have asked to leave.`, 'you', t.id);
  return { ok: false };
}
function answerAskOut(id, keep) {
  const t = T(id); if (!t || !t.user || !t.askedOut) return false;
  t.askedOut = false;
  if (keep) { addTrust(t, -3); news(`${dn(t)} stays on as a title chaser after asking to leave.`, 'you', t.id); }
  else { const mates = partyMates(t).filter(x => x !== t); release(t, 'after refusing to step down from chasing the title'); for (const x of mates) if (ambOf(x) === 'title') addTrust(x, -2); }
  return true;
}
const askedOut = (k = S.userOrg) => k ? partyLeagues(k).flatMap(i => partyOf(k, i)).filter(t => t.askedOut) : [];

// ---------- coming home and League invitations go by ambition ----------
// A former trainer who wants the title comes back only if a chaser spot is theirs (held as a promise).
const homeWilling = (t, k) => ambOf(t) !== 'title' || wouldChase(t, k, lgOf(t));
// A trainer unhappy in a support role may take a gym or Elite Four invitation even if you say no.
const INVITE_WALK = 0.6;

// ---------- god mode: the trainer and roster editor ----------
function godEdit(id, field, v) {
  if (!godOn()) return 'God mode is off.';
  const t = T(id); if (!t) return 'No such trainer.';
  const num = (lo, hi) => { const n = Math.round(+v); return Number.isFinite(n) ? clamp(n, lo, hi) : null; };
  if (field === 'name') { const s = String(v || '').replace(/[<>&"]/g, '').trim().slice(0, 24); if (!s) return 'A name is needed.'; t.name = s; return null; }
  if (field === 'age') { const n = num(10, 70); if (n == null) return 'Not a number.'; t.age = n; return null; }
  if (field === 'pot') { const n = num(1, 99); if (n == null) return 'Not a number.'; t.pot = Math.max(n, ovr(t)); t.potEst = null; return null; }
  if (field === 'amb') { if (!AMBS[v]) return 'Unknown ambition.'; t.amb = v; t.ambHint = null; t.patience = null; return null; }
  if (field === 'trust') { const n = num(0, 100); if (n == null) return 'Not a number.'; t.trust = n; return null; }
  if (field === 'app') { t.appSeasons = 0; return null; }
  if (RK.includes(field)) { const n = num(1, 99); if (n == null) return 'Not a number.'; t.r[field] = n; if (t.pot < ovr(t)) t.pot = ovr(t); return null; }
  if (field.startsWith('apt:') && PARTY_ROLES[field.slice(4)]) { const n = num(5, 99); if (n == null) return 'Not a number.'; aptOf(t)[field.slice(4)] = n; return null; }
  return 'Unknown field.';
}
const godRosterOpen = () => godOn() && canEditParty() && S.phase !== 'draft';
// move a trainer to a team's party in a League (k = null: release them to travel as an independent)
function godMove(id, k, i) {
  if (!godRosterOpen()) return 'Rosters can be edited in the offseason, outside the draft.';
  const t = T(id); if (!t || t.role !== 'challenger') return 'Only trainers on the badge circuit can be moved.';
  if (k == null) { if (!t.org) return 'They are already independent.'; release(t, 'by the hand of fate'); return null; }
  if (!ORG_KEYS.includes(k) || !fieldsIn(k, i)) return 'That team has no party there.';
  if (t.org === k && lgOf(t) === i) return 'They are already in that party.';
  if (partyOf(k, i).length >= PARTY_SIZE) return 'That party is full. Move someone out first.';
  const from = t.org, fl = lgOf(t);
  if (from !== k) { if (from) leaveOrg(t); joinOrg(t, k); }
  if (lgOf(t) !== i) shiftLeague(t, i);
  t.slot = null; t.prole = null; t.promise = null; t.forceChase = null; t.askedOut = false;
  inLeague(i, () => fixParty(k));
  if (from) inLeague(fl, () => fixParty(from));
  if (nLeagues() > 1) settleLegendClash(t);
  news(`${dn(t)} joined ${orgName(k)}${nLeagues() > 1 ? ` in the ${leagueName(i)}` : ''}.`, k === S.userOrg || from === S.userOrg ? 'you' : 'move', t.id);
  return null;
}
// put a party member in a slot; if the slot is full they trade places with its weakest holder
function godSlot(id, slot) {
  if (!godRosterOpen()) return 'Rosters can be edited in the offseason, outside the draft.';
  const t = T(id); if (!inParty(t)) return 'They are not in a party.';
  const cap = { chaser: PARTY_CHASERS, companion: PARTY_COMPANIONS, apprentice: PARTY_APPRENTICES }[slot]; if (!cap) return 'Unknown slot.';
  if (t.slot === slot) return null;
  return inLeague(lgOf(t), () => {
    const P = partyOf(t.org), there = P.filter(x => x.slot === slot);
    if (slot === 'apprentice') t.appSeasons = Math.min(t.appSeasons || 0, APPRENTICE_SEASONS - 1);
    if (there.length >= cap) { const o = there.sort((a, b) => ovr(a) - ovr(b))[0]; o.slot = t.slot; o.prole = t.prole; if (o.slot === 'apprentice') o.appSeasons = Math.min(o.appSeasons || 0, APPRENTICE_SEASONS - 1); }
    t.slot = slot; t.prole = null; t.patience = null;
    fixParty(t.org);
    return null;
  });
}
function godRole(id, role) {
  if (!godRosterOpen()) return 'Rosters can be edited in the offseason, outside the draft.';
  const t = T(id); if (!inParty(t) || t.slot !== 'companion' || !PARTY_ROLES[role]) return 'Only a companion has a role.';
  const other = partyOf(t.org, lgOf(t)).find(x => x !== t && x.slot === 'companion' && x.prole === role);
  if (other) other.prole = t.prole;
  t.prole = role; return null;
}
