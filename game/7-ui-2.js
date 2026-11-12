// ---------- standings ----------
function viewCircuit() {
  const st = cupNow();
  const rows = challengers().sort((a, b) => b.badges.length - a.badges.length || (a.badgeWeek || 99) - (b.badgeWeek || 99) || ovr(b) - ovr(a));
  return `<section class="panel"><div class="ph"><h2>Team Cup · Season ${S.season || 1}</h2></div>
  <div class="scroll"><table class="tbl"><thead><tr><th>#</th><th>Team</th><th>Roster</th><th>Badges</th><th>Alumni in office</th><th>Legacy</th><th>Points</th><th>Cups</th></tr></thead><tbody>
  ${st.map((r, i) => { const ro = org(r.key).roster.map(T); const al = legacyOf(r.key); return `<tr${r.key === S.userOrg ? ' class="you-row"' : ''}><td class="num">${i + 1}</td><td>${orgLabel(r.key)}</td><td>${ro.map(t => tname(t.id) + lgTag(t)).join(', ') || '—'}</td><td class="num">${ro.reduce((a, t) => a + t.badges.length, 0)}</td><td class="alumni">${al.map(t => tname(t.id)).join(', ') || '<span class="muted">—</span>'}</td><td class="num">${r.legacy ? '+' + r.legacy : '—'}</td><td class="num"><b>${r.pts}</b></td><td class="num">${org(r.key).cups}</td></tr>`; }).join('')}
  </tbody></table></div></section>
  <section class="panel"><div class="ph"><h2>Badge circuit${nLeagues() > 1 ? ' · ' + S.lgName : ''}</h2><span class="muted">${rows.length} challengers · ${rows.filter(t => !t.org).length} independents</span></div>
  <div class="scroll"><table class="tbl"><thead><tr><th>#</th><th>Trainer</th><th>Team</th><th>OVR</th><th>Age</th><th>Type</th><th>Badges</th><th>Gym W–L</th><th>Top Lv</th><th>Pokémon</th></tr></thead><tbody>
  ${rows.map((t, i) => { const w = t.weekLog.filter(e => e.won === true).length, l = t.weekLog.filter(e => e.won === false).length;
    return `<tr${t.user ? ' class="you-row"' : ''}><td class="num">${i + 1}</td><td>${tname(t.id)}${t.seasons <= 1 ? ' <span class="tag">rookie</span>' : ''}</td><td>${t.org ? ORGS[t.org].short : '<span class="muted">Indep.</span>'}</td><td>${ovrPill(t)}</td><td class="num">${t.age}</td><td>${specChips(t)}</td><td>${badgeRow(t)}</td><td class="num">${w}–${l}</td><td class="num">${Math.floor(topAvg(t, 1))}</td><td>${teamDots(t)}</td></tr>`; }).join('')}
  </tbody></table></div></section>`;
}
function eliteCard(t, label, extra = '') {
  return `<article class="elite"><div class="eyebrow">${label}</div><div class="elite-h">${tname(t.id)} ${ovrPill(t)}</div><div class="elite-s">${specChips(t)} <span class="muted">Age ${t.age}</span> ${extra}</div>
    <ul class="mini">${t.team.slice().reverse().map(m => `<li><span>${monMini(m.sp, m.shiny || m.radiant)}<button class="tlink" data-act="mon" data-t="${t.id}" data-u="${m.uid}">${m.sp}</button></span><span class="num">${stOf(m).b ? wl(stOf(m)) + ' · ' : ''}Lv ${Math.floor(m.lvl)}</span></li>`).join('')}</ul></article>`;
}
function viewGyms() {
  const ch = T(S.champion);
  return `<section class="panel champ"><div class="ph"><h2>Champion</h2><span class="muted">${ch.career.titles} title${ch.career.titles === 1 ? '' : 's'} · ${ch.career.defenses} defenses</span></div>${eliteCard(ch, ch.champOrg ? `${S.lgName} Champion · represents ${ORGS[ch.champOrg].name}` : `${S.lgName} Champion`)}</section>
  <section class="panel"><div class="ph"><h2>Elite Four</h2><span class="muted">Faced in this order</span></div><div class="elite-grid">${S.e4.map((id, i) => eliteCard(T(id), `Elite Four #${i + 1} · ${T(id).career.e4Wins} career wins`)).join('')}</div></section>
  <section class="panel"><div class="ph"><h2>Gyms</h2><span class="muted">Record is the gym's wins–losses this season. A season holding under 30% of 6+ challenges is a poor season; three in a row and the League replaces the leader.</span></div><div class="elite-grid">${S.gyms.map((g, i) => g.leader ? eliteCard(T(g.leader), `Badge ${i + 1} · ${TOWNS[i]}`, `${gymWeatherTag(T(g.leader))}${g.poorFor === g.leader && g.poor ? `<span class="tag notice" title="Three poor seasons in a row and the League replaces the leader">${g.poor} poor season${g.poor > 1 ? 's' : ''}</span>` : ''}<span class="rec">${g.w}–${g.l}</span>`) : `<article class="elite"><div class="eyebrow">Badge ${i + 1} · ${TOWNS[i]}</div><p class="muted">Vacant</p></article>`).join('')}</div></section>`;
}
// ---------- trainers page ----------
const recOf = t => t.rec || { w: 0, l: 0, gw: 0, gl: 0, lw: 0, ll: 0, tw: 0, tl: 0 };
const ROLE_SHORT = { challenger: 'Challenger', leader: 'Gym Leader', e4: 'Elite Four', champion: 'Champion', retired: 'Retired', exchamp: 'Former Champion', free: 'Free agent' };
function positionText(t) {
  const lg = nLeagues() > 1 && ['leader', 'e4', 'champion', 'challenger'].includes(t.role) ? ` · ${lgShort(lgOf(t))}` : '';
  return positionHere(t) + lg;
}
function positionHere(t) {
  if (t.role === 'leader') return inLeague(lgOf(t), () => { const i = S.gyms.findIndex(g => g.leader === t.id); return `${TOWNS[i]} Gym Leader`; });
  if (t.role === 'e4') return inLeague(lgOf(t), () => `Elite Four #${S.e4.indexOf(t.id) + 1}`);
  if (t.role === 'challenger') return t.org ? 'Challenger' : 'Independent';
  return ROLE_SHORT[t.role] || t.role;
}
function circuitWins(t) { return (t.seasonHist || []).filter(h => h.badges === 8).length; }
function bestFinish(t) { let b = null; for (const h of t.seasonHist || []) if (h.stage != null && (b == null || h.stage > b)) b = h.stage; return b; }
// which League an accomplishment happened in (several Leagues only; old records may not know)
const lgIn = lg => nLeagues() > 1 && lg != null && lg < nLeagues() ? lgShort(lg) : '';
// "Season 3, 5" with one League; "Season 3 (Kanto), 5 (Johto)" with several
const seasonsLg = items => {
  const plain = 'Season ' + items.map(x => x.season).join(', ');
  if (nLeagues() < 2) return plain;
  const groups = []; for (const x of items) { const k = lgIn(x.lg); let g = groups.find(y => y.k === k); if (!g) groups.push(g = { k, s: [] }); g.s.push(x.season); }
  if (groups.length === 1) return groups[0].k ? `${plain} · ${groups[0].k}` : plain;
  return groups.map(g => `${g.k ? g.k + ': ' : ''}Season ${g.s.join(', ')}`).join('; ');
};
const titleList = t => (t.titleSeasons || []).map((season, i) => ({ season, lg: (t.titleLgs || [])[i] }));
// "Kanto 2, Johto 1" for a list of { lg }
const lgCounts = items => { if (nLeagues() < 2) return ''; const c = {}; for (const x of items) if (lgIn(x.lg)) c[x.lg] = (c[x.lg] || 0) + 1; const ks = Object.keys(c); return ks.length ? ks.sort().map(k => `${lgShort(+k)} ${c[k]}`).join(', ') : ''; };
// honors shown as tags in the table and listed on the profile
function accolades(t) {
  const a = [];
  const ts = t.titleSeasons || [];
  if (ts.length || t.career.titles) a.push({ k: 'title', tag: `Champion${(ts.length || t.career.titles) > 1 ? ' ×' + (ts.length || t.career.titles) : ''}`, text: `League Champion${ts.length ? ' (' + seasonsLg(titleList(t)) + ')' : ''}` });
  if (nLeagues() > 1) {
    if (isGrandSlam(t)) a.push({ k: 'slam', tag: 'Triple Crown', text: `Triple Crown: Champion of three different Leagues (${[...champLeaguesOf(t)].sort().map(leagueName).join(', ')})${t.grandSlam ? ', completed in Season ' + t.grandSlam : ''}` });
    else { const cl = champLeaguesOf(t), N = nLeagues(); if (cl.size >= 2) a.push({ k: 'multi', tag: `Crown ${cl.size}/${CROWN_LEAGUES}`, text: `Champion of ${cl.size} Leagues: ${[...cl].sort().map(leagueName).join(', ')}. One more League for the Triple Crown${N >= CROWN_LEAGUES ? ': ' + unwonLeagues(t).map(leagueName).join(' or ') : ''}${slamProtected(t) ? '. Chasing the Crown keeps them going 3 seasons past their usual career length' : ''}` }); }
    const wc = (t.worldSeasons || []).length; if (wc) a.push({ k: 'world', tag: `World Champion${wc > 1 ? ' ×' + wc : ''}`, text: `World Champion (Season ${t.worldSeasons.join(', ')})` });
  }
  for (const c of t.comebacks || []) a.push({ k: 'comeback', tag: '', text: `Stepped down from ${c.gym} Gym${lgIn(c.lg) ? ' (' + leagueName(c.lg) + ')' : ''} in Season ${c.season} after ${c.seasons} outstanding seasons in a row, to chase the title` });
  for (const c of t.classHist || []) a.push({ k: 'reinvent', tag: '', text: `Reinvented in Season ${c.season}: was ${c.from}${c.fromSpec ? ' (' + c.fromSpec + ')' : ''}, became a ${c.spec} specialist` });
  const ir = t.interim || [];
  if (ir.length) a.push({ k: 'interim', tag: `Interim Champion${ir.length > 1 ? ' ×' + ir.length : ''}`, text: ir.map(x => `Interim Champion, Season ${x.season}${lgIn(x.lg) ? ', ' + leagueName(x.lg) : ''}: beat Champion ${x.beatName || (T(x.beat) || {}).name || '?'}, then lost the title to ${x.lostToName || (T(x.lostTo) || {}).name || 'a challenger'} in the same League`).join('; ') });
  const byK = {}; for (const x of t.awards || []) (byK[x.k] = byK[x.k] || []).push(x);
  for (const k of Object.keys(AWARDS)) if (byK[k] && !['poy', 'coy'].includes(k)) a.push({ k: 'award', tag: `${AWARDS[k].short}${byK[k].length > 1 ? ' ×' + byK[k].length : ''}`, text: `${AWARDS[k].name} (${seasonsLg(byK[k])})` });
  for (const x of t.greatLegends || []) a.push({ k: 'legend', tag: x.sp, text: x.how === 'glitch' ? `${x.sp} glitched onto the team (${seasonsLg([x])})` : `${x.how === 'caught' ? 'Caught' : 'Chosen by'} ${x.sp} (${seasonsLg([x])})` });
  for (const x of t.villainBosses || []) a.push({ k: 'villain', tag: `Stopped ${VILLAIN_TEAMS[x.team].name}`, text: `Drove ${VILLAIN_TEAMS[x.team].name} out of the ${lgIn(x.lg) ? leagueName(x.lg) + ' region' : 'region'} (Season ${x.season})` });
  if (t.career.defenses) a.push({ k: 'def', tag: `${t.career.defenses} defense${t.career.defenses > 1 ? 's' : ''}`, text: `${t.career.defenses} successful title defense${t.career.defenses > 1 ? 's' : ''}` });
  if ((t.cups || []).length) a.push({ k: 'cup', tag: `Cup${t.cups.length > 1 ? ' ×' + t.cups.length : ''}`, text: `Team Cup winner (Season ${t.cups.join(', ')})` });
  if (t.hof) a.push({ k: 'hof', tag: 'Hall of Fame', text: `Hall of Fame${t.retiredSeason ? ', inducted Season ' + t.retiredSeason : ''}` });
  { const tw = t.tourneyWins || [], tf = t.tourneyFinals || [];
    if (tw.length) a.push({ k: 'tourney', tag: `Midseason Cup${tw.length > 1 ? ' ×' + tw.length : ''}`, text: `Midseason Tournament winner (Season ${tw.join(', ')})` });
    if (tf.length) a.push({ k: 'tourney', tag: '', text: `Midseason Tournament runner-up (Season ${tf.join(', ')})` }); }
  const cw = circuitWins(t); if (cw) { const by = lgCounts((t.seasonHist || []).filter(h => h.badges === 8)); a.push({ k: 'circ', tag: `Circuit ×${cw}`, text: `Completed the badge circuit ${cw} time${cw > 1 ? 's' : ''}${by ? ' (' + by + ')' : ''}` }); }
  const bf = bestFinish(t); if (bf != null && bf < 5) { const where = [...new Set((t.seasonHist || []).filter(h => h.stage === bf && lgIn(h.lg)).map(h => leagueName(h.lg)))]; a.push({ k: 'run', tag: '', text: `Best League finish: ${bf === 4 ? 'Championship match' : 'Elite Four #' + (bf + 1)}${where.length ? ' (' + where.join(', ') + ')' : ''}` }); }
  if (t.career.e4Wins) a.push({ k: 'e4', tag: '', text: `${t.career.e4Wins} wins as an Elite Four member` });
  if (t.legacy) a.push({ k: 'legacy', tag: 'Legacy', text: `Child of ${tname(t.legacy.parent)}${t.legacy.org ? `, a ${ORGS[t.legacy.org].name} star` : ''}${t.legacy.skipped ? ` (their ${t.legacy.skipped} stayed behind: legendaries can't be passed down, since only one of each can exist at a time)` : ''}` });
  if ((t.children || []).length) a.push({ k: 'parent', tag: '', text: `Parent of ${t.children.map(id => tname(id)).join(', ')}` });
  if (t.famous) { const ft = famousTags(t); a.push({ k: 'famous', tag: '', text: `Famous trainer${ft.length ? ' — known as ' + ft.map(k => FAMOUS_TAG_LABELS[k]).join(', ') : ''}` });
    for (const k of ft) a.push({ k: 'fam fam-' + k, tag: '★ ' + FAMOUS_TAG_LABELS[k], text: '' }); }
  return a;
}
const accTags = t => accolades(t).filter(x => x.tag).map(x => `<span class="tag acc-${x.k}">${x.tag}</span>`).join(' ');
let draftSort = { k: 'best', dir: -1 };
let trFam = 'all';
let trScope = 'active', trGroup = 'all', trSort = { k: 'w', dir: -1 }, trQ = '';
const fold = x => String(x).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const esc = x => String(x).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
function searchBox(id, val, label, ph) {
  return `<div class="search"><label class="sr" for="${id}">${label}</label><input id="${id}" type="search" autocomplete="off" spellcheck="false" placeholder="${ph}" value="${esc(val)}"><span class="search-ic" aria-hidden="true">⌕</span></div>`;
}
const TR_COLS = [['name', 'Trainer'], ['org', 'Team'], ['pos', 'Position'], ['age', 'Age'], ['ovr', 'OVR'], ['w', 'W'], ['l', 'L'], ['pct', 'Win %'], ['gym', 'Gym'], ['lg', 'League'], ['badges', 'Badges'], ['titles', 'Titles'], ['mons', 'Pokémon'], ['acc', 'Honors']];
function viewTrainers() {
  const pill = (v, cur, act, l) => `<button class="pill${cur === v ? ' on' : ''}" data-act="${act}" data-v="${v}">${l}</button>`;
  return `<section class="panel"><div class="ph"><h2>Trainers</h2><span class="muted">Records count every battle, gym and League, on either side</span></div>
    ${searchBox('trsearch', trQ, 'Search trainers', 'Search by name, class, team or Pokémon')}
    <div class="filters">${pill('active', trScope, 'trscope', 'Active')}${pill('retired', trScope, 'trscope', 'Retired')}${pill('all', trScope, 'trscope', 'Everyone')}
      <span class="tab-sep" aria-hidden="true"></span>${pill('all', trGroup, 'trgroup', 'All roles')}${pill('chal', trGroup, 'trgroup', 'Challengers')}${pill('elite', trGroup, 'trgroup', 'Leaders, E4 & Champion')}${pill('mine', trGroup, 'trgroup', ORGS[S.userOrg].short + ' (current & former)')}${pill('famous', trGroup, 'trgroup', 'Famous')}</div>
    ${trGroup === 'famous' ? `<div class="filters sub">${pill('all', trFam, 'trfam', 'All famous')}${Object.keys(FAMOUS_TAG_LABELS).filter(k => !FAMOUS_PACKS[k] || packOn(k)).map(k => pill(k, trFam, 'trfam', FAMOUS_TAG_PLURAL[k])).join('')}</div>` : ''}
    <div id="trres">${trainersResults()}</div>
    <p class="fine">Gym = gym battles (as challenger or as leader). League = Elite Four and title battles. Hover a team to see its Pokémon; click a name for the full profile.</p>
  </section>`;
}
function trainersResults() {
  let list = Object.values(S.trainers).filter(t => t.role !== 'prospect');
  if (trScope === 'active') list = list.filter(t => t.role !== 'retired' && t.role !== 'free');
  if (trScope === 'retired') list = list.filter(t => t.role === 'retired');
  if (trGroup === 'mine') list = list.filter(t => t.org === S.userOrg || (t.formerUser));
  if (trGroup === 'chal') list = list.filter(t => t.role === 'challenger');
  if (trGroup === 'elite') list = list.filter(t => ['leader', 'e4', 'champion'].includes(t.role));
  if (trGroup === 'famous') list = list.filter(t => t.famous && (trFam === 'all' || famousTags(t).includes(trFam)));
  const q = fold(trQ.trim());
  if (q) list = list.filter(t => fold([dn(t), t.name, t.cls, t.legacy ? 'legacy' : '', t.org ? ORGS[t.org].name : 'independent', positionText(t), specName(t), t.spec2 ? 'dual' : '', traitOf(t) ? TRAITS[traitOf(t)].name : '', t.rival ? 'rival' : '', t.nemesis ? 'nemesis' : '', ...famousTags(t).map(k => FAMOUS_TAG_LABELS[k]), ...t.team.map(m => m.sp)].join(' ')).includes(q));
  const val = (t, k) => { const r = recOf(t); const b = r.w + r.l;
    return { name: dn(t), org: t.org || 'zz', pos: positionText(t), age: t.age, ovr: ovr(t), w: r.w, l: r.l, pct: b ? r.w / b : -1, gym: r.gw, lg: r.lw + r.tw, badges: t.career.badges, titles: (t.titleSeasons || []).length || t.career.titles, mons: t.team.length + (t.alumni || []).length, acc: accolades(t).length }[k]; };
  list.sort((a, b) => { const x = val(a, trSort.k), y = val(b, trSort.k); const c = typeof x === 'string' ? x.localeCompare(y) : x - y; return c * trSort.dir || recOf(b).w - recOf(a).w; });
  const th = ([k, l]) => `<th><button class="sort${trSort.k === k ? ' on' : ''}" data-act="trsort" data-k="${k}">${l}${trSort.k === k ? (trSort.dir < 0 ? ' ↓' : ' ↑') : ''}</button></th>`;
  const shown = list.slice(0, 200);
  const count = `<p class="muted small">${list.length} trainer${list.length === 1 ? '' : 's'}${q ? ` matching “${esc(trQ.trim())}”` : ''}</p>`;
  if (!shown.length) return count + `<p class="muted">No trainers match${q ? ' that search' : ''}. ${q || trScope !== 'all' || trGroup !== 'all' ? 'Try “Everyone” and “All roles”, or a shorter search.' : ''}</p>`;
  return count + `<div class="scroll"><table class="tbl trainers"><thead><tr>${TR_COLS.map(th).join('')}</tr></thead><tbody>
    ${shown.map(t => { const r = recOf(t); const b = r.w + r.l; return `<tr${t.user ? ' class="you-row"' : ''}>
      <td>${tname(t.id)}</td><td>${t.org ? ORGS[t.org].short : '<span class="muted">—</span>'}</td><td>${positionText(t)}</td><td class="num">${t.age}</td><td>${ovrPill(t)}</td>
      <td class="num">${r.w}</td><td class="num">${r.l}</td><td class="num">${b ? Math.round(r.w / b * 100) + '%' : '—'}</td><td class="num">${r.gw}–${r.gl}</td><td class="num">${r.lw + r.tw}–${r.ll + r.tl}</td>
      <td class="num">${t.career.badges}</td><td class="num">${(t.titleSeasons || []).length || t.career.titles || ''}</td>
      <td title="${t.team.map(m => m.sp + ' Lv ' + Math.floor(m.lvl)).join(', ')}">${teamDots(t)}</td><td class="acc">${accTags(t)}</td></tr>`; }).join('')}
    </tbody></table></div>${list.length > 200 ? `<p class="fine">Showing 200 of ${list.length}. Search, sort or filter to find others.</p>` : ''}`;
}

let dexScope = 'season', dexSort = { k: 'b', dir: -1 }, dexMin = 5, dexQ = '', dexKind = 'all';
// special kinds: legendaries (incl. mythicals and baby legendaries, not Ultra Beasts), Paradox, Ultra Beasts
const DEX_KINDS = [['all', 'All Pokémon'], ['legend', 'Legendary & mythical'], ['paradox', 'Paradox'], ['ub', 'Ultra Beasts']];
const kindOf = sp => { const s = SP[sp]; return s.ub ? 'ub' : s.paradox ? 'paradox' : (s.legend || (s.baby && s.label !== 'One of a kind') || (LINE[sp] && SP[LINE[sp]] && SP[LINE[sp]].baby && SP[LINE[sp]].label !== 'One of a kind')) ? 'legend' : 'all'; };
const kindOk = sp => dexKind === 'all' || kindOf(sp) === dexKind;
// traits of individual Pokémon (not species): filter the roster and league-wide lists
let dexTrait = 'any';
const DEX_TRAITS = [['any', 'Any'], ['radiant', '✧ Radiant'], ['shiny', '✦ Shiny'], ['alpha', 'Alpha'], ['delta', 'Δ Delta'], ['shadow', 'Shadow'], ['purified', 'Purified'], ['lucky', '★ Lucky'], ['pkrs', 'Pokérus'], ['hidden', 'Hidden ability']];
const isHidden = m => { const A = SPECIES_AB[m.sp]; const a = abilityOf(m); return !!(a && A && m.abSlot === 'H' && A.H === a); };
const TRAIT_TEST = { radiant: m => m.radiant, shiny: m => m.shiny, alpha: m => m.alpha, delta: m => m.delta, shadow: m => m.shadow, purified: m => m.purified, lucky: m => m.lucky, pkrs: m => m.pkrs > 0, hidden: isHidden };
const traitOk = m => dexTrait === 'any' || !!TRAIT_TEST[dexTrait](m);
const indivTags = m => `${m.radiant ? ' <span class="tag radiant" title="Radiant: shiny colors, at least Good IVs and a stronger ability than its species ever gets">✧ Radiant</span>' : ''}${m.shiny ? ' <span class="tag shiny">✦ Shiny</span>' : ''}${m.radiant ? ' <span class="tag radiant" title="Radiant: shiny colors, at least Good IVs and a stronger ability than its species ever gets">✧ Radiant</span>' : ''}${m.delta ? ` <span class="tag delta" title="Delta Pokémon: an unusual ${m.delta} type">Δ Delta</span>` : ''}${m.alpha ? ' <span class="tag alpha">Alpha</span>' : ''}${isHidden(m) ? ` <span class="tag gold" title="Hidden ability: ${esc(abilityOf(m))}">Hidden ability</span>` : ''}${condTags(m)}`;
const activeMons = () => { const out = []; for (const t of Object.values(S.trainers)) if (!['retired', 'prospect', 'free'].includes(t.role)) for (const m of t.team) out.push({ t, m }); return out; };
const DEX_COLS = [['sp', 'Pokémon'], ['owned', 'On teams'], ['b', 'Battles'], ['w', 'W'], ['l', 'L'], ['pct', 'Win %'], ['ko', 'KOs'], ['kpb', 'KO / battle']];
const monMatch = (sp, q) => fold(sp + ' ' + SP[sp].types.join(' ')).includes(q);
// v185: Pokémon this league's Pokédex changed or added
const dexTag = sp => SP[sp] && SP[sp].dexMod === 'new' ? ' <span class="tag gold" title="A Pokémon from this league\'s own Pokédex">New</span>' : SP[sp] && SP[sp].dexMod === 'edited' ? ' <span class="tag" title="Its types, stats or abilities were changed in this league\'s Pokédex">Changed</span>' : '';
function dexNote() {
  const d = S.cfg && S.cfg.dex; if (!dexHas(d)) return '';
  const ne = Object.keys(d.edits || {}).length, added = (d.added || []).map(e => e.name).filter(n => SP[n]);
  return `<section class="panel callout"><div class="eyebrow">This league's Pokédex</div><p>${ne ? `${ne} Pokémon ${ne === 1 ? 'has' : 'have'} changed types, stats or abilities` : ''}${ne && added.length ? ', and ' : ''}${added.length ? `${added.length} new Pokémon ${added.length === 1 ? 'is' : 'are'} in the game: ${added.slice(0, 12).map(esc).join(', ')}${added.length > 12 ? '…' : ''}` : ''}. It was set when the league was created and doesn't change. Search a name to see it.</p></section>`;
}
function dexRows(q) {
  const src = dexScope === 'season' ? (S.dexSeason || {}) : (S.dex || {});
  const owned = {};
  for (const t of Object.values(S.trainers)) if (!['retired', 'prospect'].includes(t.role)) for (const m of t.team) owned[m.sp] = (owned[m.sp] || 0) + 1;
  // a search looks up every species in the game, battled or not; otherwise only species with enough battles
  // a special-kind filter lists every one of that kind that's been held or battled, whatever the minimum
  const names = q ? Object.keys(SP).filter(sp => monMatch(sp, q) && kindOk(sp) && (!(SP[sp].legend || SP[sp].paradox || SP[sp].baby) || owned[sp] || src[sp]))
    : dexKind !== 'all' ? Object.keys(SP).filter(sp => kindOk(sp) && (owned[sp] || (src[sp] && src[sp].b)))
    : Object.keys(src).filter(sp => src[sp].b >= dexMin);
  return names.map(sp => { const st = src[sp] || blankStat(); return { sp, st, owned: owned[sp] || 0, b: st.b, w: st.w, l: st.l, ko: st.ko, pct: st.b ? st.w / st.b : 0, kpb: st.b ? st.ko / st.b : 0 }; });
}
function viewDex() {
  return dexNote() + `<section class="panel">${searchBox('dexsearch', dexQ, 'Search Pokémon', 'Search by Pokémon name or type')}
    <div class="filters">${DEX_KINDS.map(([k, l]) => `<button class="pill${dexKind === k ? ' on' : ''}" data-act="dexkind" data-v="${k}">${l}</button>`).join('')}</div>
    <div class="filters"><span class="muted small" style="align-self:center">Individuals:</span>${(() => { const all = activeMons(); return DEX_TRAITS.filter(([k]) => k !== 'hidden' || featOn('abilities')).map(([k, l]) => { const n = k === 'any' ? 0 : all.filter(x => TRAIT_TEST[k](x.m)).length; return `<button class="pill${dexTrait === k ? ' on' : ''}" data-act="dextrait" data-v="${k}"${k !== 'any' && !n ? ' disabled' : ''}>${l}${k !== 'any' ? ` <span class="muted">${n}</span>` : ''}</button>`; }).join(''); })()}</div></section>
  <div id="dexres">${dexResults()}</div>`;
}
function dexResults() {
  const q = fold(dexQ.trim());
  const mine = userTrainers().flatMap(t => t.team.map(m => ({ t, m }))).filter(({ m }) => (!q || monMatch(m.sp, q)) && kindOk(m.sp) && traitOk(m));
  const trait = dexTrait !== 'any', traitLabel = (DEX_TRAITS.find(k => k[0] === dexTrait) || [])[1];
  const special = dexKind !== 'all', kindLabel = (DEX_KINDS.find(k => k[0] === dexKind) || [])[1];
  const rows = dexRows(q).sort((a, b) => { const k = dexSort.k; const x = k === 'sp' ? a.sp.localeCompare(b.sp) : a[k] - b[k]; return x * dexSort.dir || b.b - a.b || a.sp.localeCompare(b.sp); });
  const th = ([k, l]) => `<th><button class="sort${dexSort.k === k ? ' on' : ''}" data-act="dexsort" data-k="${k}">${l}${dexSort.k === k ? (dexSort.dir < 0 ? ' ↓' : ' ↑') : ''}</button></th>`;
  // with a search, also list every individual Pokémon of that kind on an active trainer
  let owners = '';
  if (q || special || trait) {
    const found = activeMons().filter(({ m }) => (!q || monMatch(m.sp, q)) && kindOk(m.sp) && traitOk(m));
    found.sort((a, b) => stOf(b.m).w - stOf(a.m).w);
    owners = `<section class="panel"><div class="ph"><h2>Across the league</h2><span class="muted">${found.length}${trait ? ' ' + traitLabel : ''} on active trainers</span></div>
      ${found.length ? `<div class="scroll"><table class="tbl"><thead><tr><th>Pokémon</th><th>Trainer</th><th>Team</th><th>Lv</th><th>Season</th><th>Career</th><th>Win %</th><th>KOs</th></tr></thead><tbody>
      ${found.slice(0, 80).map(({ t, m }) => { const ss = ssOf(m), st = stOf(m); return `<tr${t.user ? ' class="you-row"' : ''}><td>${monMini(m.sp, m.shiny || m.radiant)}<button class="tlink" data-act="mon" data-t="${t.id}" data-u="${m.uid}">${m.sp}</button> ${chips(monTypes(m))}${indivTags(m)}${(special || trait) && m.met ? ` <span class="muted small">${HOW[m.met.how] || ''}</span>` : ''}</td><td>${tname(t.id)}</td><td>${t.org ? ORGS[t.org].short : '<span class="muted">—</span>'}</td><td class="num">${Math.floor(m.lvl)}</td><td class="num">${wl(ss)}</td><td class="num">${wl(st)}</td><td class="num">${pct(st)}</td><td class="num">${st.ko}</td></tr>`; }).join('')}
      </tbody></table></div>${found.length > 80 ? `<p class="fine">Showing 80 of ${found.length}.</p>` : ''}` : '<p class="muted">No active trainer has one right now.</p>'}</section>`;
  }
  // individual traits don't apply to species stats, so the Pokédex steps aside while one is on
  const dexPanel = trait ? `<section class="panel"><p class="muted">The League Pokédex counts whole species, so it isn't filtered by ${traitLabel}. <button class="link" data-act="dextrait" data-v="any">Show all Pokémon</button></p></section>` : null;
  return `<section class="panel"><div class="ph"><h2>${ORGS[S.userOrg].short} Pokémon</h2><span class="muted">Season ${S.season || 1} and career, on their current trainer</span></div>
    ${mine.length ? `<div class="scroll"><table class="tbl"><thead><tr><th>Pokémon</th><th>Trainer</th><th>Lv</th><th>Season</th><th>Win %</th><th>KOs</th><th>Career</th><th>Career KOs</th></tr></thead><tbody>
    ${mine.sort((a, b) => stOf(b.m).w - stOf(a.m).w).map(({ t, m }) => { const ss = ssOf(m), st = stOf(m); return `<tr><td>${monMini(m.sp, m.shiny || m.radiant)}<button class="tlink" data-act="mon" data-t="${t.id}" data-u="${m.uid}">${m.sp}</button> ${chips(monTypes(m))}${indivTags(m)}</td><td>${tname(t.id)}</td><td class="num">${Math.floor(m.lvl)}</td><td class="num">${wl(ss)}</td><td class="num">${pct(ss)}</td><td class="num">${ss.ko}</td><td class="num">${wl(st)}</td><td class="num">${st.ko}</td></tr>`; }).join('')}
    </tbody></table></div>` : `<p class="muted">${q || trait ? `None of your trainers has a Pokémon matching ${trait && !q ? 'that filter' : 'that search'}.` : 'No Pokémon on your roster.'}</p>`}</section>
  ${owners}
  ${dexPanel || `<section class="panel"><div class="ph"><h2>League Pokédex</h2><span class="muted">${q ? `Every species matching “${esc(dexQ.trim())}”${special ? ' (' + kindLabel + ')' : ''}, battled or not` : special ? `${kindLabel} that have been on a team or in a battle` : 'Every battle by every trainer, gyms and League included'}</span></div>
    <div class="filters"><button class="pill${dexScope === 'season' ? ' on' : ''}" data-act="dexscope" data-v="season">Season ${S.season || 1}</button><button class="pill${dexScope === 'all' ? ' on' : ''}" data-act="dexscope" data-v="all">All time</button>
      ${q || special ? '' : `<span class="muted small">Minimum battles:</span>${[1, 5, 20].map(n => `<button class="pill${dexMin === n ? ' on' : ''}" data-act="dexmin" data-v="${n}">${n}</button>`).join('')}`}</div>
    ${rows.length ? `<div class="scroll"><table class="tbl"><thead><tr>${DEX_COLS.map(th).join('')}</tr></thead><tbody>
    ${rows.slice(0, 120).map(r => `<tr><td>${monMini(r.sp, false)}<b>${r.sp}</b> ${chips(SP[r.sp].types)}${SP[r.sp].legend ? ' <span class="tag legend">Legendary</span>' : ''}${SP[r.sp].paradox ? ' <span class="tag paradox">Paradox</span>' : ''}${babyTag(SP[r.sp])}${dexTag(r.sp)}</td><td class="num">${r.owned || '—'}</td><td class="num">${r.b}</td><td class="num">${r.w}</td><td class="num">${r.l}</td><td class="num">${r.b ? (r.pct * 100).toFixed(0) + '%' : '—'}</td><td class="num">${r.ko}</td><td class="num">${r.b ? r.kpb.toFixed(2) : '—'}</td></tr>`).join('')}
    </tbody></table></div>${rows.length > 120 ? `<p class="fine">Showing the top 120 of ${rows.length}.</p>` : ''}` : `<p class="muted">${q ? 'No Pokémon in the game match that search.' : special ? `No ${kindLabel.toLowerCase()} have been on a team or in a battle ${dexScope === 'season' ? 'this season. Try “All time”.' : 'yet.'}` : `No Pokémon have ${dexMin} or more battles ${dexScope === 'season' ? 'this season' : 'yet'}.`}</p>`}
  </section>`}`;
}
function viewNews() {
  const tags = [['all', 'All'], ['you', 'Your team'], ['title', 'Title & Cup'], ['move', 'Moves'], ['catch', 'Catches'], ['meta', 'Meta'], ['draft', 'Draft'], ['circuit', 'Circuit']];
  // with several Leagues the page shows the chosen League's news plus world-wide news (the draft, the Team Cup)
  const items = S.news.filter(n => (n.lg == null || n.lg === viewLg || nLeagues() < 2) && (newsFilter === 'all' || n.tag === newsFilter || (newsFilter === 'catch' && isCatchNews(n)))).slice(0, 150);
  return `<section class="panel"><div class="ph"><h2>${nLeagues() > 1 ? S.lgName + ' news' : 'League news'}</h2></div><div class="filters">${tags.map(([k, l]) => `<button class="pill${newsFilter === k ? ' on' : ''}" data-act="nf" data-v="${k}">${l}</button>`).join('')}</div>${newsList(items)}</section>`;
}
// ---------- records ----------
// age when a trainer won a given title: stored at the time for new titles, estimated for older ones
function ageAtSeason(t, season) {
  const a = (t.titleAges || []).find(x => x.season === season); if (a) return a.age;
  return t.age - (((t.role === 'retired' ? t.retiredSeason : S.season) || S.season) - season);
}
// 6-0 sweeps; before they were counted, a best of 6 KOs in a battle means at least one
const sweepsOf = m => m.sweeps != null ? m.sweeps : (m.best || 0) >= 6 ? 1 : 0;
// every Pokémon that has battled for anyone, current teams and former ones
// legendaries waiting for a new partner, in every League
function pooledLegends() { const out = []; for (let i = 0; i < nLeagues(); i++) inLeague(i, () => { for (const m of S.legendPool || []) out.push({ m, lg: i }); }); return out; }
// a legendary by its id, wherever it is now: on a team (t) or waiting in a League (lg)
function findLegend(uid) {
  for (const t of Object.values(S.trainers)) { if (t.role === 'prospect') continue; const m = t.team.find(x => x.uid === uid && x.partners); if (m) return { m, t }; }
  const p = pooledLegends().find(x => x.m.uid === uid); return p ? { m: p.m, lg: p.lg } : null;
}
function allMons() {
  const out = [];
  for (const t of Object.values(S.trainers)) {
    for (const m of t.team) if (m.st && m.st.b) out.push({ t, sp: m.sp, st: m.st, best: m.best || 0, sweeps: sweepsOf(m), megas: m.megas || 0, bonds: m.bonds || 0, uid: m.uid, cur: true, shiny: !!m.shiny, radiant: !!m.radiant });
    // a legendary's old partners keep a pointer to it; the Pokémon itself is counted once, wherever it is now
    (t.alumni || []).forEach((m, i) => { if (m.st && m.st.b && !m.legendRef) out.push({ t, sp: m.sp, st: m.st, best: m.best || 0, sweeps: sweepsOf(m), megas: m.megas || 0, bonds: m.bonds || 0, i, shiny: !!m.shiny, radiant: !!m.radiant }); });
  }
  // legendaries waiting for a partner: listed under the last partner they battled with
  for (const { m } of pooledLegends()) {
    if (!m.st || !m.st.b) continue;
    for (const p of (m.partners || []).slice().reverse()) { const t = T(p.id); const i = t ? (t.alumni || []).findIndex(a => a.legendRef && a.uid === m.uid) : -1; if (i >= 0) { out.push({ t, sp: m.sp, st: m.st, best: m.best || 0, sweeps: sweepsOf(m), megas: m.megas || 0, bonds: m.bonds || 0, i, uid: m.uid, pooled: true }); break; } }
  }
  return out;
}
// the longest unbroken runs as the Champion at season's end, from the season history
function reigns() {
  const out = []; let cur = null;
  for (const h of S.history) {
    if (cur && cur.id === h.champ && !h.champWasNew) { cur.to = h.season; cur.n++; }
    else { cur = { id: h.champ, from: h.season, to: h.season, n: 1, org: h.champOrg || null }; out.push(cur); }
  }
  return out;
}
// League runs from a trainer's season history: stage 4 = lost to the Champion, 5 = won the title
const titleMatches = t => (t.seasonHist || []).filter(h => h.stage != null && h.stage >= 4).length;
const e4Beaten = t => (t.seasonHist || []).reduce((a, h) => a + (h.stage != null ? Math.min(4, h.stage) : 0), 0);
// a record board shows the top 5. Boards with a key keep their full list (up to 50) for the Top 50 view.
const REC_LISTS = {};
// a trainer or Pokémon opened from a Top 50 list closes back to that list
const recBack = () => modal && modal.kind === 'recmore' ? { kind: 'recmore', key: modal.key } : modal && modal.back ? modal.back : null;
const recRows = rows => `<ol>${rows.map((r, i) => `<li><span class="rec-rank">${i + 1}</span><span class="rec-who">${r.who}</span><b class="rec-v">${r.v}</b>${r.sub ? `<span class="rec-sub muted">${r.sub}</span>` : ''}</li>`).join('')}</ol>`;
function recBoard(title, rows, note, key) {
  if (key === undefined && /^(tr|pk)-/.test(note || '')) { key = note; note = ''; }
  if (key) REC_LISTS[key] = { title, rows, note };
  const more = key && rows.length > 5 ? `<button class="link rec-more" data-act="recmore" data-k="${key}">Top ${Math.min(50, rows.length)} ›</button>` : '';
  return `<div class="recboard"><div class="rec-h">${title}</div>${rows.length ? recRows(rows.slice(0, 5)) : '<p class="muted small">No one yet.</p>'}${note ? `<p class="fine">${note}</p>` : ''}${more}</div>`;
}
const topBy = (list, val, n = 5, min = 1) => list.map(x => [x, val(x)]).filter(([, v]) => v != null && v >= min).sort((a, b) => b[1] - a[1]).slice(0, n);
const monLink = x => monMini(x.sp, x.shiny || x.radiant) + (x.cur ? `<button class="tlink" data-act="mon" data-t="${x.t.id}" data-u="${x.uid}">${x.sp}</button>` : `<button class="tlink" data-act="alum" data-t="${x.t.id}" data-i="${x.i}">${x.sp}</button>`);
// v195: Records board for the Pokémon banned most often in this League (by species, legendaries included)
function banRecBoard() {
  if (!featOn('banlist') && !(S.banLog || []).length) return '';
  const live = new Set((S.bans || []).map(b => b.sp));
  const seasons = sp => (S.banLog || []).filter(e => e.act === 'ban' && e.sp === sp).map(e => e.season + 1).sort((a, b) => a - b);
  const rows = Object.entries(banCounts()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 50).map(([sp, v]) => { const ss = seasons(sp);
    return { who: `${monMini(sp)} <b>${sp}</b>${live.has(sp) ? ' <span class="tag banned">Banned now</span>' : ''}`, v: v + (v === 1 ? ' ban' : ' bans'), sub: ss.length ? `banned for Season${ss.length > 1 ? 's' : ''} ${ss.join(', ')}` : '' }; });
  return recBoard('Most times banned', rows, 'Each time a League vote bans it. A ban kept in later votes counts once. By species, legendaries included.', 'pk-most-times-banned');
}
function viewRecords() {
  const ts = Object.values(S.trainers).filter(t => t.role !== 'prospect');
  const champs = ts.filter(t => (t.titleSeasons || []).length || t.career.titles);
  const titles = t => (t.titleSeasons || []).length || t.career.titles;
  const pctOf = t => { const r = recOf(t); return r.w + r.l >= 60 ? r.w / (r.w + r.l) : null; };
  const wins = [];
  for (const t of champs) for (const x of titleList(t)) wins.push({ t, s: x.season, lg: x.lg, age: ageAtSeason(t, x.season) });
  const rg = reigns().sort((a, b) => b.n - a.n || a.from - b.from).slice(0, 5);
  // legendary and mythical Pokémon are stat outliers: they get their own boards and stay off the others (v167)
  const allM = allMons(), mons = allM.filter(x => !isLegendLine(x.sp)), legM = allM.filter(x => isLegendLine(x.sp));
  // rivalries: each pair once
  const pairs = [];
  for (const t of ts) if (t.rival && T(t.rival) && t.id < t.rival) { const o = T(t.rival), h = h2hOf(t, o); pairs.push({ t, o, h, n: h.w + h.l }); }
  pairs.sort((a, b) => b.n - a.n);
  const dexAll = Object.entries(S.dex || {}), dex = dexAll.filter(([sp]) => !isLegendLine(sp)), legDex = dexAll.filter(([sp]) => isLegendLine(sp));
  const hist = S.history;
  const titlesBy = {}; for (const h of hist) if (h.champWasNew && h.champOrg) titlesBy[h.champOrg] = (titlesBy[h.champOrg] || 0) + 1;
  const bestCup = hist.map(h => ({ h, r: h.standings[0] })).sort((a, b) => b.r.pts - a.r.pts).slice(0, 5);
  const row = (t, v, sub) => ({ who: tname(t.id), v, sub });
  const champion = `<section class="panel"><div class="ph"><h2>Champions</h2><span class="muted">${champs.length} trainer${champs.length === 1 ? '' : 's'} have won the title</span></div><div class="recgrid">
    ${recBoard('Most titles', topBy(champs, titles).map(([t, v]) => row(t, v, (t.titleSeasons || []).length ? seasonsLg(titleList(t)) : '')))}
    ${recBoard('Longest reign', rg.map(r => ({ who: tname(r.id, r.org), v: `${r.n} season${r.n > 1 ? 's' : ''}`, sub: (r.from === r.to ? `Season ${r.from}` : `Seasons ${r.from}–${r.to}`) + (lgIn(S.lg || 0) ? ' · ' + lgIn(S.lg || 0) : '') })), nLeagues() > 1 ? `Seasons ending as Champion in a row, in the ${S.lgName}.` : 'Seasons ending as Champion in a row.')}
    ${recBoard('Most title defenses', topBy(ts, t => t.career.defenses).map(([t, v]) => row(t, v)))}
    ${recBoard('Youngest Champion', wins.slice().sort((a, b) => a.age - b.age || a.s - b.s).slice(0, 5).map(w => row(w.t, `age ${w.age}`, seasonsLg([{ season: w.s, lg: w.lg }]))))}
    ${nLeagues() >= CROWN_LEAGUES ? recBoard('Triple Crowns', ts.filter(isGrandSlam).sort((a, b) => (a.grandSlam || 999) - (b.grandSlam || 999)).slice(0, 5).map(t => row(t, champLeaguesOf(t).size + ' Leagues', t.grandSlam ? 'completed Season ' + t.grandSlam : '')), 'Champion of three different Leagues across a career.') : ''}
    ${recBoard('Most assists', topBy(ts, t => (t.career && t.career.assists) || 0, 5).map(([t, v]) => row(t, v, t.career.assistTitles ? t.career.assistTitles + ' title' + (t.career.assistTitles > 1 ? 's' : '') : '')), 'Badges won by the chasers a companion or apprentice travelled with.')}
    ${nLeagues() > 1 ? recBoard('Most World Championships', topBy(ts, t => (t.worldSeasons || []).length).map(([t, v]) => row(t, v, 'Season ' + t.worldSeasons.join(', ')))) : ''}
    ${recBoard('Oldest Champion', wins.slice().sort((a, b) => b.age - a.age || a.s - b.s).slice(0, 5).map(w => row(w.t, `age ${w.age}`, seasonsLg([{ season: w.s, lg: w.lg }]))))}
  </div></section>`;
  const trainers = `<section class="panel"><div class="ph"><h2>Trainers</h2><span class="muted">Every trainer, active and retired</span></div><div class="recgrid">
    ${recBoard('Most wins', topBy(ts, t => recOf(t).w, 50).map(([t, v]) => row(t, v, `${recOf(t).w}–${recOf(t).l}`)), 'tr-most-wins')}
    ${recBoard('Best win %', topBy(ts, pctOf, 50, 0).map(([t, v]) => row(t, Math.round(v * 100) + '%', `${recOf(t).w}–${recOf(t).l}`)), 'At least 60 battles.', 'tr-best-win')}
    ${recBoard('Longest win streak', topBy(ts, t => recOf(t).bs || 0, 50).map(([t, v]) => row(t, v + (v === 1 ? ' win' : ' wins'), t.role !== 'retired' && recOf(t).cs === v ? 'ongoing, since Season ' + recOf(t).bsFrom : recOf(t).bsFrom === recOf(t).bsTo ? 'Season ' + recOf(t).bsTo : `Seasons ${recOf(t).bsFrom}–${recOf(t).bsTo}`)), 'Consecutive wins in any battle: gym, road, League and title.', 'tr-longest-win-streak')}
    ${recBoard('Most badges', topBy(ts, t => t.career.badges, 50).map(([t, v]) => row(t, v)), 'tr-most-badges')}
    ${recBoard('Most circuit completions', topBy(ts, circuitWins, 50).map(([t, v]) => row(t, v, 'all 8 badges')), 'tr-most-circuit-completions')}
    ${recBoard('Most title matches', topBy(ts, titleMatches, 50).map(([t, v]) => row(t, v, `won ${(t.seasonHist || []).filter(h => h.stage === 5).length}`)), 'Beat all four of the Elite Four to reach the Champion.', 'tr-most-title-matches')}
    ${recBoard('Most Elite Four members beaten', topBy(ts, e4Beaten, 50).map(([t, v]) => row(t, v, `over ${t.career.leagueApps} League run${t.career.leagueApps === 1 ? '' : 's'}`)), 'Across every League run as a challenger.', 'tr-most-elite-four-beaten')}
    ${recBoard('Most Elite Four wins', topBy(ts, t => t.career.e4Wins, 50).map(([t, v]) => row(t, v, 'as an Elite Four member')), 'tr-most-elite-four-wins')}
    ${recBoard('Longest career', topBy(ts, t => t.seasons, 50).map(([t, v]) => row(t, `${v} seasons`, t.role === 'retired' ? 'retired' : 'active')), 'tr-longest-career')}
    ${recBoard('Most Trainer of the Year awards', topBy(ts, t => (t.awards || []).filter(x => x.k === 'toy').length, 50).map(([t, v]) => row(t, v, seasonsLg(t.awards.filter(x => x.k === 'toy')))), '', 'tr-most-toy')}
    ${recBoard('Legendary encounters', topBy(ts, t => (t.greatLegends || []).length, 50).map(([t, v]) => row(t, v, t.greatLegends.map(x => x.sp + ' (S' + x.season + (lgIn(x.lg) ? ', ' + lgIn(x.lg) : '') + ')').join(', '))), 'Great legendaries caught or chosen by.', 'tr-great-legends')}
    ${recBoard('Villain bosses defeated', topBy(ts, t => (t.villainBosses || []).length, 50).map(([t, v]) => row(t, v, t.villainBosses.map(x => VILLAIN_TEAMS[x.team].name + ' (S' + x.season + (lgIn(x.lg) ? ', ' + lgIn(x.lg) : '') + ')').join(', '))), 'Beat the Boss and drove a villain team out.', 'tr-villain-bosses')}
    ${recBoard('Most road battle wins', topBy(ts, t => recOf(t).rw || 0, 50).map(([t, v]) => row(t, v)), 'tr-most-road-battle-wins')}
    ${recBoard('Most Interim Championships', topBy(ts, t => (t.interim || []).length, 50).map(([t, v]) => row(t, v, seasonsLg(t.interim))), 'Won the title, then lost it in the same League.', 'tr-most-interim-championships')}
    ${recBoard('Most Midseason Tournament wins', topBy(ts, t => (t.tourneyWins || []).length, 50).map(([t, v]) => row(t, v, 'Season ' + t.tourneyWins.join(', '))), 'The single-elimination bracket after week 12.', 'tr-tourney-wins')}
    ${recBoard('Most Midseason Tournament finals', topBy(ts, t => (t.tourneyWins || []).length + (t.tourneyFinals || []).length, 50).map(([t, v]) => row(t, v, `won ${(t.tourneyWins || []).length}`)), '', 'tr-tourney-finals')}
  </div></section>`;
  const pokemon = `<section class="panel"><div class="ph"><h2>Pokémon</h2><span class="muted">Individual Pokémon, on any team they've played for. Legendary and mythical Pokémon have their own boards.</span></div><div class="recgrid">
    ${recBoard('Most knockouts', topBy(mons, x => x.st.ko, 50).map(([x, v]) => ({ who: `${monLink(x)} <span class="muted small">${dn(x.t)}</span>`, v })), 'pk-most-knockouts')}
    ${recBoard('Most HP damage dealt', topBy(mons, x => x.st.dmg || 0, 50).map(([x, v]) => ({ who: `${monLink(x)} <span class="muted small">${dn(x.t)}</span>`, v: Math.round(v).toLocaleString('en-US') + ' HP', sub: `${x.st.b} battles · ${Math.round(v / Math.max(1, x.st.b)).toLocaleString('en-US')} per battle` })), 'Total HP knocked off opponents across every battle.', 'pk-most-hp-damage')}
    ${recBoard('Most wins', topBy(mons, x => x.st.w, 50).map(([x, v]) => ({ who: `${monLink(x)} <span class="muted small">${dn(x.t)}</span>`, v, sub: `${x.st.w}–${x.st.l}` })), 'pk-most-wins')}
    ${recBoard('Longest win streak', topBy(mons, x => x.st.bs || 0, 50).map(([x, v]) => ({ who: `${monLink(x)} <span class="muted small">${dn(x.t)}</span>`, v: v + (v === 1 ? ' win' : ' wins'), sub: x.cur && x.st.cs === v ? 'ongoing' : '' })), 'Consecutive battles it took part in that its side won.', 'pk-longest-win-streak')}
    ${recBoard('Most 6-0 sweeps', topBy(mons, x => x.sweeps, 50).map(([x, v]) => ({ who: `${monLink(x)} <span class="muted small">${dn(x.t)}</span>`, v: v + (v === 1 ? ' sweep' : ' sweeps') })), 'Knocked out all six of the opponent\'s Pokémon alone in one battle.', 'pk-most-6-0-sweeps')}
    ${recBoard('Most Mega Evolutions', topBy(mons, x => x.megas || 0, 50).map(([x, v]) => ({ who: `${monLink(x)} <span class="muted small">${dn(x.t)}</span>`, v })), 'Mega Evolved in a League battle.', 'pk-most-mega')}
    ${recBoard('Most Battle Bond transformations', topBy(mons, x => x.bonds || 0, 50).map(([x, v]) => ({ who: `${monLink(x)} <span class="muted small">${dn(x.t)}</span>`, v })), 'Transformed through Battle Bond in a League battle.', 'pk-most-bond')}
    ${recBoard('Most-used species', dex.map(([sp, st]) => [sp, st.b]).sort((a, b) => b[1] - a[1]).slice(0, 50).map(([sp, v]) => ({ who: `<b>${sp}</b>`, v: v + ' battles' })), 'pk-most-used-species')}
    ${recBoard('Best species win %', dex.filter(([, st]) => st.b >= 300).map(([sp, st]) => [sp, st.w / st.b, st]).sort((a, b) => b[1] - a[1]).slice(0, 50).map(([sp, v, st]) => ({ who: `<b>${sp}</b>`, v: Math.round(v * 100) + '%', sub: `${st.b} battles` })), 'At least 300 battles, all time.', 'pk-best-species-win')}
    ${banRecBoard()}
  </div></section>`;
  const teams = `<section class="panel"><div class="ph"><h2>Teams</h2></div><div class="recgrid">
    ${recBoard('Team Cups', ORG_KEYS.map(k => [k, org(k).cups]).filter(([, v]) => v).sort((a, b) => b[1] - a[1]).map(([k, v]) => ({ who: orgLabel(k), v })))}
    ${recBoard('Titles won', Object.entries(titlesBy).sort((a, b) => b[1] - a[1]).map(([k, v]) => ({ who: orgLabel(k), v })), 'Credited to the team the Champion represented.')}
    ${recBoard('Best Team Cup season', bestCup.map(({ h, r }) => ({ who: orgLabel(r.key), v: r.pts + ' pts', sub: 'Season ' + h.season })))}
    ${recBoard('Most League qualifiers', hist.slice().sort((a, b) => b.qualifiers - a.qualifiers).slice(0, 3).map(h => ({ who: 'Season ' + h.season, v: h.qualifiers })))}
  </div></section>`;
  const rivals = `<section class="panel"><div class="ph"><h2>Rivalries</h2></div><div class="recgrid">
    ${recBoard('Most-played rivalries', pairs.slice(0, 5).map(p => ({ who: `${tname(p.t.id)} <span class="muted">vs</span> ${tname(p.o.id)}`, v: `${p.h.w}–${p.h.l}`, sub: `${p.n} meetings` })))}
    ${recBoard('Nemeses overcome', topBy(ts, t => t.nemesisBeaten || 0).map(([t, v]) => row(t, v)))}
  </div></section>`;
  // ---- Hall of Shame: the other end of every board ----
  const bottomBy = (list, val, n = 50) => list.map(x => [x, val(x)]).filter(([, v]) => v != null).sort((a, b) => a[1] - b[1]).slice(0, n);
  const monWho = x => `${monLink(x)} <span class="muted small">${dn(x.t)}</span>`;
  // Gym Leaders lose most weeks by design (the Leakiest gym board covers them), so they sit out the other boards
  const ledGym = t => t.role === 'leader' || (t.posts || []).some(p => p.role === 'leader');
  const noGym = ts.filter(t => !ledGym(t)), noGymMons = mons.filter(x => !ledGym(x.t));
  const streakSub = t => { const r = recOf(t); return t.role !== 'retired' && r.cl === r.wl ? 'ongoing, since Season ' + r.wlFrom : r.wlFrom === r.wlTo ? 'Season ' + r.wlFrom : `Seasons ${r.wlFrom}–${r.wlTo}`; };
  const interimOnly = ts.filter(t => (t.interim || []).length && !titles(t) && !t.hof);
  const lostFinals = t => (t.seasonHist || []).filter(h => h.stage === 4).length;
  const gymSeasons = []; S.gyms.forEach((g, i) => (g.hist || []).forEach(x => { const n = x.w + x.l; if (n >= 8 && T(x.leader)) gymSeasons.push({ t: T(x.leader), town: TOWNS[i], season: x.season, w: x.w, l: x.l, p: x.w / n }); }));
  const lastPlace = {}; for (const h of hist) { const r = h.standings[h.standings.length - 1]; if (r) lastPlace[r.key] = (lastPlace[r.key] || []).concat(h.season); }
  const worstCup = hist.map(h => ({ h, r: h.standings[h.standings.length - 1] })).filter(x => x.r).sort((a, b) => a.r.pts - b.r.pts).slice(0, 5);
  const shame = `<section class="panel shame"><div class="ph"><h2>Hall of Shame</h2><span class="muted">Someone has to be at the bottom</span></div><div class="recgrid">
    ${recBoard('Worst win %', bottomBy(noGym, pctOf).map(([t, v]) => row(t, Math.round(v * 100) + '%', `${recOf(t).w}–${recOf(t).l}`)), 'At least 60 battles. Gym Leaders not included.', 'tr-worst-win')}
    ${recBoard('Longest losing streak', topBy(noGym, t => recOf(t).wl || 0, 50).map(([t, v]) => row(t, v + (v === 1 ? ' loss' : ' losses'), streakSub(t))), 'Every kind of battle counts. Gym Leaders not included. Tracked from v122 on.', 'tr-losing-streak')}
    ${recBoard('Interim Champions, never Champion', topBy(interimOnly, t => t.interim.length, 50).map(([t, v]) => row(t, v + (v === 1 ? ' interim title' : ' interim titles'), seasonsLg(t.interim))), 'Took the title and lost it in the same League, without ever holding it at the end of a season.', 'tr-interim-only')}
    ${recBoard('So close: title matches lost', topBy(ts, lostFinals, 50).map(([t, v]) => row(t, v, titles(t) ? `won ${titles(t)} title${titles(t) > 1 ? 's' : ''} too` : 'never won the title')), 'Beat all four of the Elite Four, then lost to the Champion.', 'tr-lost-finals')}
    ${recBoard('Most League runs without a title', topBy(ts.filter(t => !titles(t)), t => t.career.leagueApps, 50).map(([t, v]) => row(t, v + ' runs', `${e4Beaten(t)} Elite Four wins`)), 'tr-runs-no-title')}
    ${recBoard('Longest career without a League run', topBy(ts.filter(t => !t.career.leagueApps && !['leader', 'e4', 'champion'].includes(t.role) && !(t.posts || []).length), t => t.seasons, 50).map(([t, v]) => row(t, v + ' seasons', `best: ${Math.max(0, ...(t.seasonHist || []).map(h => h.badges || 0))} badges`)), 'Never completed the badge circuit.', 'tr-no-league')}
    ${recBoard('Most gym losses', topBy(ts.filter(t => t.role !== 'leader' && !(t.posts || []).some(p => p.role === 'leader')), t => recOf(t).gl || 0, 50).map(([t, v]) => row(t, v, `${recOf(t).gw || 0} gym wins`)), 'Challengers who never led a gym.', 'tr-gym-losses')}
    ${recBoard('Most knocked out', topBy(mons, x => x.st.f || 0, 50).map(([x, v]) => ({ who: monWho(x), v: v + ' faints', sub: `${x.st.b} battles` })), 'pk-most-faints')}
    ${recBoard('Worst Pokémon win %', bottomBy(noGymMons.filter(x => x.st.b >= 40), x => x.st.w / x.st.b).map(([x, v]) => ({ who: monWho(x), v: Math.round(v * 100) + '%', sub: `${x.st.w}–${x.st.l}` })), 'At least 40 battles. Gym Leaders\' Pokémon not included.', 'pk-worst-win')}
    ${recBoard('Pokémon losing streak', topBy(noGymMons, x => x.st.wl || 0, 50).map(([x, v]) => ({ who: monWho(x), v: v + (v === 1 ? ' loss' : ' losses'), sub: x.cur && x.st.cl === v ? 'ongoing' : '' })), 'Battles it took part in, in a row, on the losing side. Gym Leaders\' Pokémon not included. Tracked from v122 on.', 'pk-losing-streak')}
    ${recBoard('Leakiest gym season', gymSeasons.sort((a, b) => a.p - b.p || b.l - a.l).slice(0, 5).map(g => ({ who: tname(g.t.id), v: `${g.w}–${g.l}`, sub: `${g.town} Gym, Season ${g.season}${lgIn(S.lg || 0) ? ' · ' + lgIn(S.lg || 0) : ''}` })), 'Lowest share of challenges held, 8+ challenges.')}
    ${recBoard('Most last-place Team Cup finishes', Object.entries(lastPlace).sort((a, b) => b[1].length - a[1].length).map(([k, v]) => ({ who: orgLabel(k), v: v.length, sub: 'Season ' + v.join(', ') })))}
    ${recBoard('Worst Team Cup season', worstCup.map(({ h, r }) => ({ who: orgLabel(r.key), v: r.pts + ' pts', sub: 'Season ' + h.season })))}
  </div></section>`;
  const hofLink = `<section class="panel"><div class="ph"><h2>Hall of Fame</h2><span class="muted">${(S.hof || []).length} inductee${(S.hof || []).length === 1 ? '' : 's'}</span></div><p>Champions are inducted when they retire. <button class="link" data-act="nav" data-v="hof">Open the Hall of Fame ›</button></p></section>`;
  const partnersOf = x => { const f = x.uid != null ? findLegend(x.uid) : null; return f && f.m.partners ? f.m.partners.length : 1; };
  const legWho = x => `${monLink(x)} <span class="muted small">${x.pooled ? 'waiting · last with ' + dn(x.t) : dn(x.t)}</span>`;
  const legends = `<section class="panel"><div class="ph"><h2>Legendary &amp; mythical</h2><span class="muted">Each legendary counted once across all its partners, with its lifetime record</span></div><div class="recgrid">
    ${recBoard('Most knockouts', topBy(legM, x => x.st.ko, 50).map(([x, v]) => ({ who: legWho(x), v })), '', 'lg-most-knockouts')}
    ${recBoard('Most HP damage dealt', topBy(legM, x => x.st.dmg || 0, 50).map(([x, v]) => ({ who: legWho(x), v: Math.round(v).toLocaleString('en-US') + ' HP', sub: `${x.st.b} battles` })), '', 'lg-most-hp-damage')}
    ${recBoard('Most wins', topBy(legM, x => x.st.w, 50).map(([x, v]) => ({ who: legWho(x), v, sub: `${x.st.w}–${x.st.l}` })), '', 'lg-most-wins')}
    ${recBoard('Best win %', topBy(legM.filter(x => x.st.b >= 40), x => x.st.w / x.st.b, 50, 0).map(([x, v]) => ({ who: legWho(x), v: Math.round(v * 100) + '%', sub: `${x.st.w}–${x.st.l}` })), 'At least 40 battles.', 'lg-best-win')}
    ${recBoard('Longest win streak', topBy(legM, x => x.st.bs || 0, 50).map(([x, v]) => ({ who: legWho(x), v: v + (v === 1 ? ' win' : ' wins'), sub: x.cur && x.st.cs === v ? 'ongoing' : '' })), '', 'lg-longest-win-streak')}
    ${recBoard('Most 6-0 sweeps', topBy(legM, x => x.sweeps, 50).map(([x, v]) => ({ who: legWho(x), v: v + (v === 1 ? ' sweep' : ' sweeps') })), '', 'lg-most-sweeps')}
    ${legM.some(x => x.megas) ? recBoard('Most Mega Evolutions', topBy(legM, x => x.megas || 0, 50).map(([x, v]) => ({ who: legWho(x), v })), 'Mega Evolved in a League battle.', 'lg-most-mega') : ''}
    ${recBoard('Most partners', topBy(legM, partnersOf, 50, 2).map(([x, v]) => ({ who: legWho(x), v: v + ' trainers', sub: `${x.st.w}–${x.st.l} lifetime` })), 'Trainers it has moved between.', 'lg-most-partners')}
    ${recBoard('Most-used legendary species', legDex.map(([sp, st]) => [sp, st.b]).sort((a, b) => b[1] - a[1]).slice(0, 50).map(([sp, v]) => ({ who: `<b>${sp}</b>`, v: v + ' battles' })), '', 'lg-most-used-species')}
  </div></section>`;
  return champion + hofLink + trainers + pokemon + legends + teams + rivals + shame;
}
// ---------- Hall of Fame ----------
let hofQ = '', hofSort = 'new', hofLg = 'all'; // hofLg: 'all' or a League index (multi-League saves)
const HOF_SORTS = [['new', 'Newest inductees'], ['titles', 'Most titles'], ['worlds', 'Most World titles'], ['reign', 'Longest reign'], ['winpct', 'Best win %'], ['defenses', 'Most defenses'], ['badges', 'Most badges'], ['seasons', 'Longest career']];
// every reign in every League's history, by trainer: { from, to, n (season-ends held), lg }
function reignsByTrainer() {
  const map = new Map();
  eachLeague(i => { for (const r of reigns()) { if (!map.has(r.id)) map.set(r.id, []); map.get(r.id).push({ ...r, lg: i }); } });
  for (const list of map.values()) list.sort((a, b) => a.from - b.from);
  return map;
}
const reignText = r => `${r.from === r.to ? 'Season ' + r.from : `Seasons ${r.from}–${r.to}`} (${r.n} season${r.n > 1 ? 's' : ''})${nLeagues() > 1 ? ' · ' + lgShort(r.lg) : ''}`;
function hofEntries() {
  const rbt = reignsByTrainer();
  const ids = (S.hof || []).filter(id => T(id));
  const byTrainer = new Map(); for (const x of allMons()) { const cur = byTrainer.get(x.t); if (!cur || x.st.ko > cur.st.ko) byTrainer.set(x.t, x); }
  return ids.map(id => { const t = T(id); return { t, best: byTrainer.get(t), titles: (t.titleSeasons || []).length || t.career.titles, worlds: (t.worldSeasons || []).length, reigns: rbt.get(t.id) || [] }; });
}
// everything a search can match: name, class, famous tags, type, trait, teams, title seasons and Pokémon
function hofText(e) {
  const t = e.t;
  return fold([dn(t), t.name, t.cls, specName(t), traitOf(t) ? TRAITS[traitOf(t)].name : '', ...famousTags(t).map(k => FAMOUS_TAG_LABELS[k]), t.famous ? 'famous' : '',
    ...(t.teams || []).map(h => ORGS[h.org] ? ORGS[h.org].name : ''), ...(t.titleSeasons || []).map(s => 'season ' + s), 'inducted ' + (t.retiredSeason || ''), (t.worldSeasons || []).length ? 'world champion' : '', t.grandSlam ? 'grand slam' : '', ...[...champLeaguesOf(t)].map(leagueName),
    ...t.team.map(m => m.sp), ...(t.alumni || []).map(m => m.sp)].join(' '));
}
function hofCard(e) {
  const t = e.t, c = t.career, b = e.best;
  const teams = [...new Set((t.teams || []).map(h => h.org))].filter(k => ORGS[k]);
  return `<article class="hofcard"><div class="eyebrow">Inducted Season ${t.retiredSeason || '?'}${t.famous ? ' · ★ Famous' : ''}</div><div class="hof-name">${tname(t.id)}</div>
    <div class="hof-stats"><span><b>${e.titles}</b> title${e.titles > 1 ? 's' : ''}</span>${e.worlds ? `<span class="hof-world"><b>${e.worlds}</b> World title${e.worlds > 1 ? 's' : ''}</span>` : ''}${e.reigns.length ? `<span><b>${Math.max(...e.reigns.map(r => r.n))}</b> season${Math.max(...e.reigns.map(r => r.n)) > 1 ? 's' : ''} longest reign</span>` : ''}<span><b>${c.defenses}</b> defense${c.defenses === 1 ? '' : 's'}</span><span><b>${c.badges}</b> badges</span><span><b>${t.seasons}</b> seasons</span>${(() => { const r = recOf(t), n = r.w + r.l; return n ? `<span class="hof-wl"><b>${r.w}–${r.l}</b> career (${Math.round(r.w / n * 100)}%)</span>` : ''; })()}</div>
    ${nLeagues() > 1 && champLeaguesOf(t).size ? `<div class="hof-lgs">${[...champLeaguesOf(t)].sort().map(i => `<span class="tag lg">${lgShort(i)}</span>`).join('')}</div>` : ''}
    ${e.reigns.length ? `<div class="hof-reigns"><span class="eyebrow">Reign${e.reigns.length > 1 ? 's' : ''}</span>${e.reigns.map(r => `<span>${reignText(r)}</span>`).join('')}</div>` : ''}
    <div class="small">${(t.titleSeasons || []).length ? 'Champion in ' + seasonsLg(titleList(t)) : ''}${e.worlds ? ` · World Champion in Season ${t.worldSeasons.join(', ')}` : ''}${t.grandSlam ? ' · Grand Slam' : ''}</div>
    <div class="small muted">${specName(t)}${traitOf(t) ? ' · ' + TRAITS[traitOf(t)].name : ''}${teams.length ? ' · ' + teams.map(k => ORGS[k].short).join(', ') : ' · Independent'}</div>
    ${b ? `<div class="small muted">Best Pokémon: ${monLink(b)} (${b.st.ko} KOs)</div>` : ''}</article>`;
}
function hofResults() {
  const q = fold(hofQ.trim());
  let list = hofEntries();
  // League filter: Champions who finished a season holding that League's title (one who won several shows in each)
  const all = list.length;
  if (hofLg !== 'all' && +hofLg >= nLeagues()) hofLg = 'all';
  const lgOn = nLeagues() > 1 && hofLg !== 'all';
  if (lgOn) list = list.filter(e => champLeaguesOf(e.t).has(+hofLg));
  const total = list.length;
  // a search ending in a number matches that number exactly, so "season 3" doesn't also find Season 30
  if (q) { const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + (/\d$/.test(q) ? '(?!\\d)' : '')); list = list.filter(e => re.test(hofText(e))); }
  const key = { new: e => e.t.retiredSeason || 0, winpct: e => { const r = recOf(e.t), n = r.w + r.l; return n ? r.w / n : -1; }, reign: e => Math.max(0, ...e.reigns.map(r => r.n)) * 1000 + e.reigns.reduce((a, r) => a + r.n, 0), worlds: e => e.worlds * 1e6 + e.titles * 1000 + e.t.career.defenses, titles: e => e.titles * 1000 + e.t.career.defenses, defenses: e => e.t.career.defenses, badges: e => e.t.career.badges, seasons: e => e.t.seasons }[hofSort];
  list.sort((a, b) => key(b) - key(a) || (b.t.retiredSeason || 0) - (a.t.retiredSeason || 0));
  if (!all) return '<p class="muted">No inductees yet. A Champion is inducted when they retire.</p>';
  if (!total) return `<p class="muted">No inductees have been Champion of the ${leagueName(+hofLg)} yet.</p>`;
  if (!list.length) return `<p class="muted">No inductees match “${esc(hofQ.trim())}”. Try a name, a type, a team or a Pokémon.</p>`;
  return `<p class="muted small">${list.length} of ${total} inductee${total === 1 ? '' : 's'}${lgOn ? ` who won the ${leagueName(+hofLg)}` : ''}${q ? ` matching “${esc(hofQ.trim())}”` : ''}</p><div class="hofgrid">${list.map(hofCard).join('')}</div>`;
}
function viewHof() {
  return `<section class="panel"><div class="ph"><h2>Hall of Fame</h2><span class="muted">Champions only, inducted when they retire</span></div>
    ${searchBox('hofsearch', hofQ, 'Search the Hall of Fame', 'Search by name, type, trait, team, season or Pokémon')}
    ${nLeagues() > 1 ? `<div class="filters hof-lgf"><span class="muted small">Champion of:</span>${[['all', 'All Leagues'], ...Array.from({ length: nLeagues() }, (_, i) => [String(i), leagueName(i)])].map(([k, l]) => `<button class="pill${String(hofLg) === k ? ' on' : ''}" data-act="hoflg" data-v="${k}">${l}</button>`).join('')}</div>` : ''}
    <div class="filters">${HOF_SORTS.filter(([k]) => k !== 'worlds' || nLeagues() > 1 || (S.worldHist || []).length).map(([k, l]) => `<button class="pill${hofSort === k ? ' on' : ''}" data-act="hofsort" data-v="${k}">${l}</button>`).join('')}</div>
    <div id="hofres">${hofResults()}</div></section>`;
}
function viewHistory() {
  const h = S.history.slice().reverse();
  return `${worldHistory()}<section class="panel"><div class="ph"><h2>Team Cups</h2></div><div class="cupsum">${ORG_KEYS.map(k => `<div>${orgMark(k, true)}<b>${org(k).cups}</b><small>${ORGS[k].short}</small><small class="muted">${ORGS[k].mascot}</small></div>`).join('')}</div></section>
  <section class="panel"><div class="ph"><h2>Season history${nLeagues() > 1 ? ' · ' + S.lgName : ''}</h2></div>
  ${h.length ? `<div class="scroll"><table class="tbl"><thead><tr><th>Season</th><th>Team Cup</th><th>Champion</th><th>Deepest run</th><th>Qualifiers</th><th>Meta</th><th>${ORGS[S.userOrg].short} finish</th></tr></thead><tbody>
  ${h.map(x => `<tr><td class="num">${x.season}</td><td>${orgLabel(x.cup)}</td><td>${tname(x.champ, x.champOrg || null)} <span class="muted">${x.champOrg ? ORGS[x.champOrg].short : 'No team'}</span>${x.champWasNew ? ' <span class="tag gold">new</span>' : ''}</td><td>${x.runner ? tname(x.runner, 'runnerOrg' in x ? x.runnerOrg : undefined) + ` <span class="muted">(${x.runnerStage === 4 ? 'Final' : 'E4 #' + (x.runnerStage + 1)})</span>` : '—'}</td><td class="num">${x.qualifiers}</td><td>${x.metaMons && x.metaMons.length ? `<span class="small">${x.metaMons.join(', ')}</span>` : x.meta ? chip(x.meta) : '—'}</td><td>${x.userRank ? ordinal(x.userRank) + ` <span class="muted">(${x.standings.find(r => r.key === x.userOrg).pts} pts)</span>` : '—'}</td></tr>`).join('')}
  </tbody></table></div>` : '<p class="muted">The first season has not finished yet.</p>'}</section>
  ${h.some(x => x.awards && x.awards.length) ? `<section class="panel"><div class="ph"><h2>Season awards</h2></div><div class="scroll"><table class="tbl"><thead><tr><th>Season</th>${Object.values(AWARDS).map(a => `<th>${a.short}</th>`).join('')}</tr></thead><tbody>
  ${h.filter(x => x.awards).map(x => `<tr><td class="num">${x.season}</td>${Object.keys(AWARDS).map(k => { const a = x.awards.find(y => y.k === k); return `<td>${a ? awardWho(a) : '<span class="muted">—</span>'}</td>`; }).join('')}</tr>`).join('')}
  </tbody></table></div></section>` : ''}
  ${banHistory()}`;
}
// v195: every banlist vote in this League, newest first: what was banned, kept and lifted, and what was in force after
function banHistory() {
  const log = S.banLog || [];
  if (!log.length) return featOn('banlist') ? `<section class="panel"><div class="ph"><h2>Banlists${nLeagues() > 1 ? ' · ' + S.lgName : ''}</h2></div><p class="muted">No vote has banned anything here yet. The Banlist vote is in the offseason, after the draft.</p></section>` : '';
  const by = {}; for (const e of log) (by[e.season] = by[e.season] || []).push(e);
  const seasons = Object.keys(by).map(Number).sort((a, b) => b - a);
  const inForce = new Set(), forceAt = {};
  for (const sn of seasons.slice().reverse()) { for (const e of by[sn]) { if (e.act === 'ban' || e.act === 'keep') inForce.add(e.sp); else inForce.delete(e.sp); } forceAt[sn] = [...inForce]; }
  const items = (sn, act, f) => by[sn].filter(e => e.act === act).map(e => `<span class="bh-i">${f(e)}</span>`).join(' ');
  const line = (label, html) => html ? `<div><span class="bh-l">${label}</span>${html}</div>` : '';
  return `<section class="panel"><div class="ph"><h2>Banlists${nLeagues() > 1 ? ' · ' + S.lgName : ''}</h2><span class="muted">${Object.keys(banCounts()).length} Pokémon banned in all</span></div>
  <div class="banhist">${seasons.map(sn => `<div class="bh-row"><div class="bh-s">Season ${sn + 1}</div>
    ${line('Banned', items(sn, 'ban', e => `<b>${e.sp}</b> <span class="muted small"${e.tn ? ` title="${e.yes} of ${e.n} teams, ${e.ty} of ${e.tn} trainers"` : ''}>${e.pct != null ? `${e.pct}%` : `${e.yes}/${e.n}`}${e.len ? ` · ${e.len} season${e.len === 1 ? '' : 's'}` : ''}</span>`))}
    ${line('Kept', items(sn, 'keep', e => `${e.sp} <span class="muted small">${e.keep}/${e.n}</span>`))}
    ${line('Lifted', items(sn, 'lift', e => `${e.sp} <span class="muted small">${e.limit ? 'time up' : `${e.keep}/${e.n} kept`}</span>`))}
    ${line('Banlist', forceAt[sn].length ? forceAt[sn].map(sp => `<span class="bh-i">${monMini(sp)}${sp}</span>`).join(' ') : '<span class="muted">none</span>')}</div>`).join('')}</div>
  <p class="fine">Each ban shows its share of the weighted vote (half teams, half trainers; before v203, teams for out of teams voting), then its length. Each ban runs its full length (1 to ${BAN_MAX_SEASONS} seasons), then lifts. Kept: a ban kept in a review vote, before v201.</p></section>`;
}

// ---------- awards ----------
function awardWho(a) {
  if (!a.sp) return tname(a.id);
  const t = T(a.id), m = t && t.team.find(x => x.uid === a.uid);
  return `${m ? `<button class="tlink" data-act="mon" data-t="${t.id}" data-u="${m.uid}">${a.sp}</button>` : `<b>${a.sp}</b>`} <span class="muted small">${tname(a.id)}</span>`;
}
function awardsPanel(h, title) {
  const aw = h && h.awards; if (!aw || !aw.length) return '';
  return `<section class="panel"><div class="ph"><h3>${title || `Season ${h.season} awards`}</h3></div><div class="awards">${aw.map(a => `<div class="award"><span class="aw-k">${AWARDS[a.k].name}</span><span class="aw-who">${awardWho(a)}</span><span class="muted small">${a.why}</span></div>`).join('')}</div></section>`;
}
// ---------- recap ----------
function viewRecap() {
  const L = S.league; if (!L) return viewOffice();
  const h = S.history[S.history.length - 1];
  const offer = S.offers[0];
  const offerHtml = offer ? `<section class="panel callout offer"><div class="eyebrow">Next · League offers</div><h2>${S.offers.length === 1 ? 'An offer is waiting' : S.offers.length + ' offers are waiting'}</h2><p>The League has invitations or a former trainer to decide on before the draft.</p><div class="confirm-row"><button class="btn primary" data-act="nav" data-v="offers">See the League offers</button></div></section>` : '';
  const roster = userTrainers();
  const mine = h.userResults || [];
  return recapBody(L, h, offer, offerHtml, roster, mine, null);
}
// a trainer of yours asking for a chaser spot or their release, or asking to step back into support
function tradeOptRow(t, o, n, act) {
  if (o.kind === 'pick') return `<button class="rel" data-act="${act}" data-id="${t.id}" data-n="${n}">${orgMark(o.org)}${ORGS[o.org].short}: an extra pick in the next draft</button>`;
  const x = T(o.id);
  return `<button class="rel" data-act="${act}" data-id="${t.id}" data-n="${n}">${orgMark(o.org)}${ORGS[o.org].short}: ${dn(x)} <span class="muted">OVR ${ovr(x)}, age ${x.age}, ${SLOT_NAMES[slotOf(x)] || ''} · ${ambText(x)}</span></button>`;
}
function requestPanel(o) {
  const t = T(o.id), n = S.offers.length > 1 ? ` · 1 of ${S.offers.length}` : '';
  const who = `<div class="seatvs"><div>${tname(t.id)} ${ovrPill(t)}<div class="muted small">Age ${t.age} · ${specName(t)} · ${SLOT_NAMES[slotOf(t)] || ''}${t.prole ? ' (' + PARTY_ROLES[t.prole].name + ')' : ''}</div><div class="muted small">${AMBS[ambOf(t)].name} · ${trustWord(t)}</div></div></div>`;
  if (o.kind === 'stepback') return `<section class="panel offer"><div class="eyebrow">A request from your trainer${n}</div><h2>${dn(t)} has asked to step back into a support role.</h2>
    <p>They no longer want to chase the title. If you agree, your strongest companion or apprentice takes the chaser spot. If you ask them to keep chasing, they will, but they'll trust you a little less.</p>${who}
    <div class="confirm-row"><button class="btn primary" data-act="req" data-c="yes">Agree</button><button class="btn" data-act="req" data-c="no">Ask them to keep chasing</button></div></section>`;
  const ch = partyMates(t).filter(x => x !== t && x.slot === 'chaser').sort((a, b) => ovr(a) - ovr(b));
  const opts = tradeOptions(t);
  return `<section class="panel offer"><div class="eyebrow">A request from your trainer${n}</div><h2>${dn(t)} wants a title-chaser spot, or to be let go.</h2>
    <p>They have run out of patience in a support role. Each party has three chaser spots, and this is the only request this party will make this offseason.</p>${who}
    <div class="eyebrow" style="margin-top:10px">Promote them now</div><div class="release">${ch.map(x => `<button class="rel" data-act="req" data-c="promote" data-a="${x.id}">${x.name} makes way <span class="muted">OVR ${ovr(x)}, ${AMBS[ambOf(x)].name.toLowerCase()}</span></button>`).join('') || '<span class="muted small">No chaser to move.</span>'}</div>
    <div class="eyebrow" style="margin-top:10px">Trade them</div><div class="release">${opts.map((x, i) => tradeOptRow(t, x, i, 'reqtrade')).join('') || '<span class="muted small">No team is offering anything for them.</span>'}</div>
    <div class="confirm-row" style="margin-top:10px"><button class="btn" data-act="req" data-c="promise" title="Binding: if they aren't a chaser by then they leave, and your other trainers trust you less">Promise a spot in Season ${S.season + 2}</button><button class="btn" data-act="req" data-c="release">Release them</button></div>
    <p class="fine">A promise is binding. Break it and they leave, and every other trainer of yours trusts you less.</p></section>`;
}
function offerPanel(offer) {
  let offerHtml = '';
  if (offer.kind === 'demand' || offer.kind === 'stepback') return requestPanel(offer);
  {
    const u = T(offer.id);
    if (offer.kind === 'rejoin') {
      const roster = userTrainers().filter(t => t.role === 'challenger' && inLg(t)); const full = lgRoster(S.userOrg).length >= ROSTER;
      const post = (u.posts || []).slice().reverse().find(p => p.to != null);
      const was = post ? (post.role === 'leader' ? post.place + ' Leader' : post.interim ? 'Interim Champion' : post.place) : 'their post';
      offerHtml = `<section class="panel offer"><div class="eyebrow">A former trainer is available${S.offers.length > 1 ? ` · 1 of ${S.offers.length}` : ''}</div><h2>${dn(u)} is no longer ${was} and is back on the circuit. Bring them back to ${ORGS[S.userOrg].name}?</h2>
        <p>They left your team for that post. As their former team, you get first refusal. If you pass, they compete as an independent and any team can draft them.</p>
        <div class="seatvs"><div>${tname(u.id)} ${ovrPill(u)}<div class="muted small">Age ${u.age} · ${specName(u)}${traitOf(u) ? ' · ' + TRAITS[traitOf(u)].name : ''}</div><div class="muted small">${u.team.map(m => m.sp + ' ' + Math.floor(m.lvl)).join(', ')}</div></div></div>
        ${full ? `<p><b>Your roster is full.</b> Choose who to release to make room:</p><div class="release">${roster.map(t => `<button class="rel${rejoinRelease === t.id ? ' on' : ''}" data-act="rejoinrel" data-id="${t.id}">${dn(t)} <span class="muted">OVR ${ovr(t)}, age ${t.age}</span></button>`).join('')}</div>` : ''}
        <div class="confirm-row"><button class="btn primary" data-act="offer" data-v="1"${full && rejoinRelease == null ? ' disabled' : ''}>${full ? (rejoinRelease != null ? `Bring back ${u.name}, release ${T(rejoinRelease).name}` : 'Choose who to release first') : `Bring back ${u.name}`}</button><button class="btn" data-act="offer" data-v="0">Pass</button></div></section>`;
    } else if (offer.kind === 'leader') {
      offerHtml = `<section class="panel offer"><div class="eyebrow">An offer from the League${S.offers.length > 1 ? ` · 1 of ${S.offers.length}` : ''}</div><h2>${dn(u)} has been invited to lead ${TOWNS[offer.slot]} Gym (Badge ${offer.slot + 1}) as its new Gym Leader.</h2><p>Accepting moves ${dn(u)} off your roster for good. They'll defend the gym against future challengers, including your own. You'll fill the open spot in the draft.</p><div class="confirm-row"><button class="btn primary" data-act="offer" data-v="1">Accept the offer</button><button class="btn" data-act="offer" data-v="0">Decline and keep ${dn(u)}</button></div></section>`;
    } else {
      const inc = T(S.e4[offer.slot]);
      offerHtml = `<section class="panel offer"><div class="eyebrow">Elite Four seat challenge${S.offers.length > 1 ? ` · 1 of ${S.offers.length}` : ''}</div><h2>${dn(u)} may challenge ${dn(inc)} for Elite Four seat #${offer.slot + 1}.</h2>
        <p>It's one battle, played now. If ${u.name} wins, they take the seat and leave your roster for good, and you'll fill the spot in the draft. ${inc.name} (age ${inc.age}) would then retire or return to the badge circuit. If ${u.name} loses, they stay on your roster.</p>
        <div class="seatvs"><div>${tname(u.id)} ${ovrPill(u)}<div class="muted small">${u.team.map(m => m.sp + ' ' + Math.floor(m.lvl)).join(', ')}</div></div><span class="vs-s">vs</span><div>${tname(inc.id)} ${ovrPill(inc)}<div class="muted small">${inc.team.map(m => m.sp + ' ' + Math.floor(m.lvl)).join(', ')}</div></div></div>
        <div class="confirm-row"><button class="btn primary" data-act="offer" data-v="1">Challenge for the seat</button><button class="btn" data-act="offer" data-v="0">Decline and keep ${dn(u)}</button></div></section>`;
    }
  }
  if (nLeagues() > 1) offerHtml = offerHtml.replace('<div class="eyebrow">', `<div class="eyebrow">${S.lgName} · `);
  return offerHtml;
}
function recapBody(L, h, offer, offerHtml, roster, mine, gift) {
  return `${offerHtml}${worldPanel()}<div class="grid-office"><div class="col">
    <section class="panel callout"><div class="eyebrow">Season ${S.season} recap${nLeagues() > 1 ? ' · ' + S.lgName : ''}</div><h2>${orgName(h.cup)} won the Team Cup</h2>
      <p>${tname(S.champion)} ${h.champWasNew ? 'took the crown' : 'is still Champion'}. ${h.qualifiers} trainer${h.qualifiers === 1 ? '' : 's'} reached the League.${h.metaMons && h.metaMons.length ? ` The season's top performers on the circuit: ${h.metaMons.join(', ')}.` : h.meta ? ` ${h.meta}-types were the season's dominant force.` : ''}</p>
      <p>${ORGS[S.userOrg].name} finished <b>${ordinal(h.userRank)}</b> with ${h.standings.find(r => r.key === S.userOrg).pts} points.</p></section>
    ${awardsPanel(h)}
    <section class="panel"><div class="ph"><h3>Your trainers this season</h3></div>
      <div class="scroll"><table class="tbl"><thead><tr><th>Trainer</th><th>Badges</th><th>Result</th><th>Pts</th></tr></thead><tbody>${mine.map(r => { const t = T(r.id); return `<tr><td>${tname(r.id)}</td><td class="num">${r.role === 'champion' ? '—' : r.badges}</td><td>${r.role === 'champion' ? (L.dethroned.includes(r.id) ? 'Lost the title' : 'Defended the title') : stageText(r.stage)}</td><td class="num">${trainerPoints(t, L)}</td></tr>`; }).join('')}</tbody></table></div></section>
    <section class="panel"><div class="ph"><h3>League results</h3></div>${L.entries.length ? `<div class="scroll"><table class="tbl"><thead><tr><th>Order</th><th>Trainer</th><th>Team</th><th>E4 #1</th><th>#2</th><th>#3</th><th>#4</th><th>Final</th></tr></thead><tbody>
      ${L.entries.map((e, i) => `<tr${e.org === S.userOrg ? ' class="you-row"' : ''}><td class="num">${i + 1}</td><td>${tname(e.id)}</td><td>${e.org ? ORGS[e.org].short : '<span class="muted">Indep.</span>'}</td>${[0, 1, 2, 3, 4].map(k => `<td class="st ${e.stage > k ? 'w' : e.stage === k ? 'l' : ''}">${e.stage > k ? 'W' : e.stage === k ? 'L' : ''}</td>`).join('')}</tr>`).join('')}
      </tbody></table></div>` : '<p class="muted">No qualifiers this season.</p>'}
      ${(L.titleOrder || []).length > 1 ? `<p class="fine">Title matches came after every Elite Four run, worst gym record first: ${L.titleOrder.map(x => `${tname(x.id)} (${x.w}–${x.l})`).join(' → ')}</p>` : ''}
      ${L.logs.length ? `<div class="logs">${L.logs.map((r, i) => `<button class="btn small" data-act="watch" data-src="league" data-i="${i}">${r.title}: ${r.sides[0].name}</button>`).join('')}</div>` : ''}
    </section>
    <section class="panel"><div class="ph"><h3>How the world changed</h3></div><ul class="changes">${(S.changes || []).map(c => `<li>${c}</li>`).join('') || '<li>A quiet offseason.</li>'}</ul></section>
  </div><div class="col side">
    <section class="panel"><div class="ph"><h3>Final Team Cup</h3></div><div class="cup">${h.standings.map((r, i) => `<div class="cup-row${r.key === S.userOrg ? ' mine' : ''}"><span class="num">${i + 1}</span>${orgMark(r.key)}<span class="cup-n">${ORGS[r.key].short}</span><span></span><span class="num">${r.pts}</span></div>`).join('')}</div></section>
    <section class="panel"><div class="ph"><h3>Development</h3></div>${roster.map(t => { const p = S.progress && S.progress[t.id]; return p ? `<div class="devrow"><div>${tname(t.id)}<div class="muted small">Age ${t.age}</div></div><div class="ovr-change"><span>${p.before.ovr}</span><span class="arrow">→</span><b>${p.after.ovr}</b></div></div>` : ''; }).join('') || '<p class="muted">No trainers.</p>'}
      ${roster[0] ? `<button class="link" data-act="nav" data-v="t${roster[0].id}">Rating details and releases</button>` : ''}</section>
    <section class="panel"><div class="ph"><h3>Next</h3></div><p>${offer ? 'Answer the League offers first.' : `The worst team picks first. Each team gets one pick and may pass; teams with open spots keep picking until they have ${ROSTER}${nLeagues() > 1 ? ' in each League' : ''}. After the draft, teams hand over farewell gifts${nLeagues() > 1 ? ' and can reassign trainers between Leagues' : ''}.${champOrg() ? ` Then ${ORGS[champOrg()].name} gives a Paradox Pokémon to its weakest trainer.` : ''}`}</p>${offer ? '' : `<button class="btn primary" data-act="todraft">Start the Season ${S.season + 1} draft</button>`}</section>
  </div></div>`;
}

// ---------- World Championship ----------
function worldPanel() {
  const W = S.worlds; if (!W || S.phase !== 'offseason') return '';
  const row = m => { const w = m.winner, l = w === m.a ? m.b : m.a; const i = W.matches.indexOf(m);
    return `<li><span class="eyebrow">${m.round}</span> ${tname(w)} <span class="muted small">${leagueName(lgOf(T(w)))}</span> beat ${tname(l)} <span class="muted small">${leagueName(lgOf(T(l)))}</span> <button class="btn small" data-act="watchworld" data-i="${i}">Watch</button></li>`; };
  return `<section class="panel callout world"><div class="eyebrow">World Championship · Season ${W.season}</div><h2>${tname(W.winner)} is World Champion</h2>
    <p>The ${W.entrants.length} League Champions met once the Leagues were done, at equal level. ${W.winnerOrg ? `${orgName(W.winnerOrg)} earns ${WORLD_PTS.win} Team Cup points` : 'No team earns points for the winner'}${W.runnerOrg ? `, ${orgName(W.runnerOrg)} ${WORLD_PTS.final} for the runner-up` : ''}. The titles at home are not at stake.</p>
    <ul class="worldlist">${W.matches.map(row).join('')}</ul></section>`;
}
function worldHistory() {
  const wh = (S.worldHist || []).slice().reverse(); if (!wh.length) return '';
  return `<section class="panel"><div class="ph"><h2>World Championship</h2></div><div class="scroll"><table class="tbl"><thead><tr><th>Season</th><th>World Champion</th><th>League</th><th>Runner-up</th><th>League</th></tr></thead><tbody>
    ${wh.map(x => `<tr><td class="num">${x.season}</td><td>${tname(x.winner, x.winnerOrg || null)}</td><td>${leagueName(x.winnerLg)}</td><td>${tname(x.runner, x.runnerOrg || null)}</td><td>${leagueName(x.runnerLg)}</td></tr>`).join('')}</tbody></table></div></section>`;
}
// ---------- League banlist (v194) ----------
const banPct = (a, b) => b ? Math.round(a / b * 100) : 0;
function banTeamsTxt(x) { return x.voters.map(k => `${orgMark(k)} ${ORGS[k].short}`).join(' '); }
// v203: the trainers' half of the vote on one ballot entry: share for a ban, and why
const BAN_WHY = { lost: 'lost to it', weak: 'weak to it', rival: 'rival uses it', top: 'just too strong', uses: 'use it' };
function banTrainerCell(c) {
  const tr = c.tr; if (!tr || !tr.votes.length) return '<span class="muted small">—</span>';
  const yes = tr.votes.filter(v => v).length, why = Object.entries(tr.why).filter(([w, v]) => v && w !== 'uses' && w !== 'top').sort((a, b) => b[1] - a[1]).slice(0, 2);
  return `<b>${banPct(yes, tr.votes.length)}%</b> <span class="muted small">for</span><div class="muted small">${why.map(([w, v]) => `${v} ${BAN_WHY[w]}`).join(' · ')}${tr.why.uses ? `${why.length ? ' · ' : ''}${tr.why.uses} ${BAN_WHY.uses}` : ''}</div>`;
}
function viewBanVote() {
  const V = S.banVote; if (S.phase !== 'banvote' || !V) return viewOffice();
  const k = S.userOrg;
  // v201: the vote is a length: Allow, or ban for 1 to BAN_MAX_SEASONS seasons
  const lenPick = (i, sp, cur) => `<span class="ban-tog">${Array.from({ length: BAN_MAX_SEASONS + 1 }, (_, v) => `<button class="btn small${cur === v ? ' primary' : ''}" data-act="banset" data-l="${i}" data-sp="${esc(sp)}" data-v="${v}" aria-pressed="${cur === v}" title="${v ? `Ban it for ${v} season${v === 1 ? '' : 's'}` : 'Let it battle'}">${v ? `${v} season${v === 1 ? '' : 's'}` : 'Allow'}</button>`).join('')}</span>`;
  const secs = V.lgs.map(x => {
    const i = x.lg, n = x.voters.length, mine = x.voters.includes(k), tn = x.cands[0] && x.cands[0].tr ? x.cands[0].tr.votes.length : 0;
    const bans = bansIn(i);
    const current = bans.map(b => { const left = banLeft(b);
      return `<tr><td>${monFace(b.sp, false, 28)} <b>${b.sp}</b>${b.members.length > 1 ? ` <span class="muted small">with ${b.members.filter(s => s !== b.sp).join(', ')}</span>` : ''}</td><td class="small">${left} more season${left === 1 ? '' : 's'}</td><td class="small muted">through Season ${banLast(b)}</td></tr>`; }).join('');
    const cands = x.cands.map(c => {
      const cur = banVoteOf(V.ban[banKey(i, c.sp)]), uses = mine && teamUses(k, i, c.members);
      return `<tr><td>${monFace(c.sp, false, 28)} <b>${c.sp}</b>${c.top ? ` <span class="muted small" title="Its place among the season's top ${BAN_POOL} performers">#${c.top}</span>` : ''}${c.leg ? ' <span class="tag legend">Legendary</span>' : ''}${uses ? ' <span class="tag gold" title="One of your trainers in this League uses it">Yours</span>' : ''}<div>${chips(SP[c.sp].types)}${c.members.length > 1 ? ` <span class="muted small">also bans ${c.members.filter(s => s !== c.sp).join(', ')}</span>` : ''}</div></td>
        <td class="num">${c.users}</td><td class="num">${c.b}</td><td class="num">${(c.ko / c.b).toFixed(2)}</td><td class="num">${banPct(c.w, c.b)}%</td>
        <td>${banTrainerCell(c)}</td>
        <td>${mine ? lenPick(i, c.sp, cur) : '<span class="muted small">Other teams vote</span>'}</td></tr>`; }).join('');
    return `<section class="panel"><div class="ph"><h3>${nLeagues() > 1 ? leagueName(i) : 'The ballot'}</h3><span class="muted small">${n} teams${tn ? ` and ${tn} trainers` : ''} vote · over 50% needed</span></div>
      <p class="small muted">Voting: ${banTeamsTxt(x)}${mine ? '' : '. You have no challengers here, so you don\'t vote.'}</p>
      ${current ? `<div class="eyebrow">Still banned (${bans.length} of ${BAN_CAP})</div><div class="scroll"><table class="tbl compact"><thead><tr><th>Pokémon</th><th>Left</th><th></th></tr></thead><tbody>${current}</tbody></table></div>` : ''}
      ${cands ? `<div class="eyebrow">On the ballot from Season ${S.season}'s top ${BAN_POOL}</div><div class="scroll"><table class="tbl compact"><thead><tr><th>Pokémon</th><th class="num" title="Trainers who used it">Users</th><th class="num">Battles</th><th class="num" title="Knockouts per battle">KO/B</th><th class="num">Win %</th><th title="How the League's trainers voted (half the weight)">Trainers</th><th>Your vote</th></tr></thead><tbody>${cands}</tbody></table></div>` : '<p class="muted small">Nothing new is on the ballot.</p>'}
    </section>`;
  }).join('');
  return `<section class="panel callout"><div class="eyebrow">Season ${S.season + 1} · after ${nLeagues() > 1 ? 'League moves' : 'the draft'}</div><h2>Banlist vote</h2>
    <p>Each League's teams vote on banning some of its top performers for the next season: ${BAN_BALLOT} drawn at random from the season's top ${BAN_POOL}, with at most ${BAN_BALLOT_LEGENDS} legendaries. The number by each one is its place in the top ${BAN_POOL}. The vote is weighted: half comes from the teams (one vote each) and half from the League's trainers (challengers, Gym Leaders, the Elite Four and the Champion), who have already voted. Trainers vote with their grudges: against Pokémon that beat them this season, that hit their type or much of their team super effectively, or that their rival uses, and never against Pokémon on their own team. Each team and trainer votes Allow or a ban of 1 to ${BAN_MAX_SEASONS} seasons. A Pokémon is banned when over 50% of the weighted vote backs a ban, for the longest length that still has over 50% (a vote for ${BAN_MAX_SEASONS} seasons also backs the shorter ones). Bans aren't voted on again: each runs its full length, then lifts. Up to ${BAN_MAX_NEW} new bans a season, so a League holds at most ${BAN_CAP} at a time.</p>
    <p class="muted small">A ban covers the Pokémon, what it evolves from and what it evolves into, for everyone in that League: challengers, Gym Leaders, the Elite Four and the Champion. Your trainers' banned Pokémon go to your ranch, where a teammate in another League can take them, or they wait there and go back to their trainer once it's allowed. Legendaries can wait in the ranch too, and a season one can't be used anywhere on your team doesn't count toward its time with you. Gym Leaders, the Elite Four and the Champion get a replacement.</p></section>
    ${secs}
    <section class="panel"><div class="confirm-row"><button class="btn primary" data-act="banconfirm">Cast your votes</button><span class="muted small">Everyone else votes when you do.</span></div></section>`;
}
// office side card: what's banned now, League by League
function banCard() {
  if (!featOn('banlist')) return '';
  const rows = Array.from({ length: nLeagues() }, (_, i) => ({ i, bans: bansIn(i) })).filter(x => x.bans.length);
  if (!rows.length) return '';
  return `<section class="panel"><div class="ph"><h3>Banlist</h3><span class="muted">Season ${curSeason()}</span></div>
    ${rows.map(x => `<p class="small">${nLeagues() > 1 ? `<b>${lgShort(x.i)}</b> · ` : ''}${x.bans.map(b => `${monFace(b.sp, false, 22)} ${b.sp} <span class="muted">(through S${b.season + (b.len || BAN_MAX_SEASONS)})</span>`).join(', ')}</p>`).join('')}
    <p class="fine">Banned for everyone in that League until its season shown. Teams vote on new bans each offseason.</p></section>`;
}
// ---------- League reassignment (after the draft, several Leagues only) ----------
function viewReassign() {
  if (S.phase !== 'reassign') return viewOffice();
  const NL = nLeagues(), k = S.userOrg;
  const mine = userTrainers().filter(t => t.role === 'challenger').sort((a, b) => lgOf(a) - lgOf(b) || ovr(b) - ovr(a));
  const fitCell = (t, i) => { const v = leagueFit(t, i); return `<span class="num ${v > 0.05 ? 'good' : v < -0.05 ? 'bad' : 'muted'}">${v > 0 ? '+' : ''}${v.toFixed(2)}</span>`; };
  const actCell = (t, i) => {
    if (i === lgOf(t)) return '<span class="tag">Here</span>';
    if (!fieldsIn(k, i)) return '<span class="muted small">No party there</span>';
    const block = moveBlock(t, i); if (block) return `<span class="muted small">${block}</span>`;
    if (lgRoster(k, i).length < ROSTER) return `<button class="btn small" data-act="lgmove" data-id="${t.id}" data-v="${i}">Move</button>`;
    const mates = lgRoster(k, i).map(T).filter(x => x.role === 'challenger');
    return mates.length ? mates.map(o => `<button class="btn small" data-act="lgmove" data-id="${t.id}" data-v="${i}" data-w="${o.id}">Swap with ${o.name}</button>`).join(' ') : '<span class="muted small">No open spot</span>';
  };
  const champs = Array.from({ length: NL }, (_, i) => inLeague(i, () => T(S.champion)));
  const summary = Array.from({ length: NL }, (_, i) => `<span><b>${leagueName(i)}</b> · ${lgRoster(k, i).length}/${ROSTER} of yours · ${champs[i] ? tname(champs[i].id) + ' ' + specChips(champs[i]) : '—'}${bansIn(i).length ? ` · <span class="warn">Banned: ${bansIn(i).map(b => b.sp).join(', ')}</span>` : ''}</span>`).join('');
  const slamNote = t => slamChaser(t) ? ` <span class="tag acc-slam" title="Leagues won toward the Triple Crown">Crown ${champLeaguesOf(t).size}/${CROWN_LEAGUES}</span>` : '';
  const unwon = (t, i) => slamChaser(t) && !champLeaguesOf(t).has(i) ? ' <span class="tag gold" title="A League this trainer hasn\'t won yet">Unwon</span>' : '';
  const cards = mine.map(t => `<div class="ra-card"><div class="ra-h">${tname(t.id)} ${ovrPill(t)} <span class="small">${specChips(t)}</span>${slamNote(t)}</div>
    ${Array.from({ length: NL }, (_, i) => `<div class="ra-row${i === lgOf(t) ? ' here' : ''}"><span class="ra-lg">${lgShort(i)}${unwon(t, i)}</span>${fitCell(t, i)}<span class="ra-act">${actCell(t, i)}</span></div>`).join('')}</div>`).join('');
  const moves = (S.reassign && S.reassign.moves) || [];
  const theirs = moves.filter(m => m.org !== k);
  const start = (S.reassign && S.reassign.start) || {};
  const ours = mine.filter(t => start[t.id] != null && start[t.id] !== lgOf(t)).map(t => ({ org: k, id: t.id, from: start[t.id], to: lgOf(t) }));
  const line = m => `<li>${tname(m.id)}: ${leagueName(m.from)} → ${leagueName(m.to)}${m.swap ? `, swapping with ${tname(m.swap)}` : ''}</li>`;
  const parties = lgRange().filter(i => fieldsIn(k, i)).map(i => partyPanel(k, i, true)).join('');
  const probs = partyProblems();
  const partyIntro = `<p>Your trainers in a League travel together as a party of six: three title chasers, two companions and one apprentice. Only chasers take on gyms and the League and score Team Cup points (plus ${PARTY_BONUS} if all three complete the badge circuit). Each companion fills a role that helps the others. The apprentice has road battles and grows from watching, for two seasons at most.</p><p class="muted small">New arrivals have been placed for you. Tap Move on a trainer, then choose who they swap with. The number beside a role is that trainer's aptitude for it.</p>`;
  const owed = brokenPromises();
  const confirmBox = `<section class="panel">${probs.length ? `<ul class="changes">${probs.map(p => `<li class="warn">${p}</li>`).join('')}</ul>` : ''}${owed.length ? `<ul class="changes">${owed.map(t => `<li class="warn">You promised ${dn(t)} a title-chaser spot this season. Confirm without one and they leave, and your other trainers trust you less.</li>`).join('')}</ul>` : ''}<div class="confirm-row"><button class="btn primary" data-act="reassignconfirm" ${probs.length ? 'disabled' : ''}>Confirm ${NL > 1 ? 'parties and Leagues' : 'the party'} and continue</button><span class="muted small">Next: ${champOrgsNext()}</span></div></section>`;
  if (NL < 2) return `<section class="panel callout"><div class="eyebrow">Season ${S.season + 1} · after the draft</div><h2>Set your party</h2>${partyIntro}</section>${parties}${confirmBox}`;
  return `<section class="panel callout"><div class="eyebrow">Season ${S.season + 1} · after the draft</div><h2>Parties and Leagues</h2>${partyIntro}</section>${parties}
  <section class="panel callout"><h2>League reassignment</h2>
    <p>Each team has ${ROSTER} trainer${ROSTER > 1 ? 's' : ''} in every League. Before the season, teams can move trainers to the League where their Pokémon line up best. Moving into a full League means swapping with a teammate there. A legendary can't go to a League where someone already holds one.</p>
    <p class="muted small">Matchup: how well a trainer's team hits that League's Champion (counted double), its Elite Four and the meta, minus what hits it back. Above zero favours them.${mine.some(slamChaser) ? ' <b>Unwon</b> marks a League a former Champion still needs for the Triple Crown.' : ''}</p></section>
  <section class="panel"><div class="ph"><h3>Your trainers</h3><span class="muted">${ours.length ? `${ours.length} move${ours.length > 1 ? 's' : ''} made` : 'No moves yet'}</span></div>
    <div class="ra-sum small">${summary}</div>
    ${mine.length ? `<div class="ra-grid">${cards}</div>` : '<p class="muted">You have no trainers on the circuit.</p>'}
    ${ours.length ? `<ul class="changes">${ours.map(line).join('')}</ul>` : ''}</section>
  <section class="panel"><div class="ph"><h3>Other teams' moves</h3></div>${theirs.length ? `<ul class="changes">${theirs.map(line).join('')}</ul>` : '<p class="muted">No other team moved a trainer this offseason.</p>'}</section>
  ${confirmBox}`;
}
const champOrgsNext = () => eachLeague(() => champOrg()).includes(S.userOrg) ? "the banlist vote, the Champion's reward and the ranch" : 'the banlist vote and the ranch, then the season';
// ---------- champion's reward ----------
function viewReward() {
  const r = S.reward; if (S.phase !== 'reward' || !r) return viewOffice();
  const t = T(r.target), c = T(S.champion);
  return `<section class="panel callout reward"><div class="eyebrow">Champion's reward · Season ${S.season + 1}</div><h2>${ORGS[r.org].name} holds the title</h2>
    <p>${tname(c.id)} won the championship for ${ORGS[r.org].name}. While the reign lasts, the team adds a Paradox Pokémon to its ranch after each draft. From the ranch you can hand it to any of your trainers, in any League. The choices are picked with your weakest trainer, ${tname(t.id)} (OVR ${ovr(t)}), in mind.</p>
    <p class="muted">Once handed over, it's registered on top of the usual three in its first season, and counts as one of the three after that. It's theirs to keep, and other trainers may have the same one. Legendaries come through their own events during the season.</p></section>
  <section class="panel"><div class="ph"><h3>Choose one for ${dn(t)}</h3><span class="muted">${t.specialty ? specName(t) + ' specialist' : 'Mixed team'}</span></div>
    <div class="offers">${r.pool.map(n => { const sp = SP[n]; return `<button class="offer-card legend-card" data-act="rewardpick" data-n="${n}">${monFace(n, false, 48, 'big')}<div class="mon-name">${n}</div><div>${chips(sp.types)}</div><div class="muted">BST ${sp.bst}${sp.paradox ? ` · ${isAncient(n) ? 'Ancient' : 'Future'}` : ''}</div>${(() => { const pm = sp.legend && pooledLegend(n); return pm && pm.partners && pm.partners.length ? `<div class="small">Returning: ${pm.partners.length} past partner${pm.partners.length > 1 ? 's' : ''}, ${wl(pm.st || blankStat())} lifetime</div>` : ''; })()}${specFit(t, sp.name) === 2 ? '<div class="tag gold">Fits both their types</div>' : specFit(t, sp.name) ? '<div class="tag gold">Fits their type</div>' : ''}<span class="btn small primary">Add ${n} to the ranch</span></button>`; }).join('')}</div></section>`;
}

// ---------- registration ----------
function viewRegister() {
  if (S.phase !== 'register' || !S.registration) return viewOffice();
  const ids = Object.keys(S.registration).map(Number);
  const ready = ids.every(id => S.registration[id].length === Math.min(START_TEAM, regular(T(id)).length));
  return `<section class="panel callout"><div class="eyebrow">Season ${S.season + 1} registration</div><h2>Choose three Pokémon for each trainer</h2>
    <p>Every challenger starts the season with at most ${START_TEAM} registered Pokémon. The rest are released back to the wild, so your trainers will need to explore to rebuild. The strongest three are picked for you to start with.</p></section>
  ${ids.map(id => { const t = T(id); const sel = S.registration[id];
    return `<section class="panel"><div class="ph"><h3>${tname(id)}</h3><span class="${sel.length === START_TEAM ? 'good' : 'bad'}">${sel.length} of ${START_TEAM} chosen</span></div>
      ${t.team.filter(isGift).map(m => `<p class="good">${m.sp} is registered automatically (${m.met && m.met.how === 'farewell' ? 'farewell gift' : m.met && m.met.how === 'gift' ? "Champion's reward" : 'from the ranch'}).</p>`).join('')}
      <div class="regs">${regular(t).map(m => { const sp = SP[m.sp]; const on = sel.includes(m.uid); return `<button class="reg${on ? ' on' : ''}" data-act="regtoggle" data-id="${id}" data-u="${m.uid}" aria-pressed="${on}">
        ${monFace(m.sp, m.shiny || m.radiant, 40)}
        <span class="reg-main"><span class="mon-name">${m.sp}${megaTag(m)}${m.shiny ? ' <span class="tag shiny">✦ Shiny</span>' : ''}${m.radiant ? ' <span class="tag radiant" title="Radiant: shiny colors, at least Good IVs and a stronger ability than its species ever gets">✧ Radiant</span>' : ''}${m.delta ? ' <span class="tag delta" title="Delta Pokémon: an unusual ' + m.delta + ' type">Δ Delta</span>' : ''}${m.alpha ? ' <span class="tag alpha">Alpha</span>' : ''}${condTags(m)}${formBadge(m)}</span><span>${chips(monTypes(m))}${learnedCov(ensureMon(m)).map(covChip).join('')}</span><span class="small muted">${m.nat} · IVs ${ivGrade(m)} · ${frTier(m.fr ?? 70)} · ${wl(stOf(m))}</span></span>
        <span class="mon-bst">${sp.bst}<small>BST</small></span><span class="reg-check" aria-hidden="true">${on ? '✓' : ''}</span></button>`; }).join('')}</div></section>`; }).join('')}
  <section class="panel"><div class="confirm-row"><button class="btn primary" data-act="regconfirm" ${ready ? '' : 'disabled'}>Register and start Season ${S.season + 1}</button>${ready ? '' : `<span class="warn">Pick exactly ${START_TEAM} for each trainer.</span>`}</div></section>`;
}

// ---------- League offers (offseason, before the draft) ----------
function viewOffers() {
  if (S.phase !== 'offseason') return viewOffice();
  const offer = S.offers[0];
  if (!offer) return `<section class="panel callout"><div class="eyebrow">Season ${S.season + 1} · League offers</div><h2>No offers left</h2><p>Every offer has been answered.</p><div class="confirm-row"><button class="btn primary" data-act="todraft">Start the Season ${S.season + 1} draft</button><button class="btn" data-act="nav" data-v="recap">Back to the recap</button></div></section>`;
  return `<section class="panel callout"><div class="eyebrow">Season ${S.season + 1} · League offers${nLeagues() > 1 ? ' · ' + leagueName(offer.lg || 0) : ''}</div><h2>League offers</h2><p>Gym and Elite Four invitations for your trainers, and former trainers asking to come back. Each team gets at most one gym or Elite Four invitation per offseason; former trainers coming back don't count toward it. Answer each one before the draft.</p></section>
    ${inLeague(offer.lg || 0, () => offerPanel(offer))}`;
}
// ---------- farewell gifts (after the draft) ----------
function viewGifts() {
  if (S.phase !== 'gifts') return viewOffice();
  const g = (S.pendingGifts || [])[0];
  const log = (S.giftLog || []).slice();
  const line = x => `<li>${x.org ? orgMark(x.org) : ''}${tname(x.from)} ${x.to != null ? `gave <b>${x.sp}</b> to ${tname(x.to)}` : `left <b>${x.sp}</b> in ${x.org ? ORGS[x.org].short + "'s" : 'the team'} ranch`}${nLeagues() > 1 ? ` <span class="tag lg">${lgShort(x.lg)}</span>` : ''}</li>`;
  const next = nLeagues() > 1 ? 'League reassignment' : (eachLeague(() => champOrg()).includes(S.userOrg) ? "the Champion's reward" : (g && g.org === S.userOrg) || ranchOf(S.userOrg).active.length || (S.ranchPicks || []).some(p => p.org === S.userOrg) ? 'the team ranch' : 'registration');
  return `<section class="panel callout"><div class="eyebrow">Season ${S.season + 1} · after the draft</div><h2>Farewell gifts</h2>
    <p>A trainer who leaves a team for a gym, an Elite Four seat or the title leaves one Pokémon in the team's ranch. After the Champion's reward, the team can hand it to any of its trainers, in any League. It keeps its nature, IVs, moves and friendship, and in its first season with its new trainer it's registered on top of the usual three. Legendaries are never given; they move on by themselves.</p></section>
    ${g ? inLeague(g.lg ?? lgOf(T(g.from)), () => giftPanel(g)) : ''}
    <section class="panel"><div class="ph"><h3>This offseason's farewell gifts</h3><span class="muted">${log.length} gift${log.length === 1 ? '' : 's'}</span></div>
      ${log.length ? `<ul class="changes">${log.map(line).join('')}</ul>` : '<p class="muted">No team lost a trainer to a post this offseason, so there were no farewell gifts.</p>'}</section>
    <section class="panel"><div class="confirm-row"><button class="btn primary" data-act="giftsconfirm" ${g ? 'disabled' : ''}>Continue to ${next}</button>${g ? '<span class="warn">Choose your farewell gift first.</span>' : ''}</div></section>`;
}
// ---------- farewell gift ----------
let giftPick = null, giftTo = null;
function giftPanel(g) {
  const from = T(g.from);
  if (giftPick != null && !g.mons.some(m => m.uid === giftPick)) giftPick = null;
  return `<section class="panel offer"><div class="eyebrow">Farewell gift${S.pendingGifts.length > 1 ? ` · 1 of ${S.pendingGifts.length}` : ''}</div>
    <h2>${from.name} is leaving to become ${from.role === 'e4' ? 'an Elite Four member' : 'a Gym Leader'}, and wants to leave a Pokémon with the team.</h2>
    <p>Pick one of ${from.name}'s Pokémon to leave in your ranch. You'll hand it to one of your trainers in the ranch step, after the Champion's reward. It keeps its nature, IVs, moves and friendship, and its past record stays on its stat card.${from.role === 'e4' ? ` ${from.name} keeps the rest of their team, and the League replaces the gift with a Paradox Pokémon of their type.` : ''}</p>
    <div class="regs">${g.mons.map(m => ranchMonBtn(m, giftPick === m.uid, 'giftpick', `Lv ${Math.floor(m.lvl)} · ${natLabel(m)} · IVs ${ivGrade(m)} · ${wl(stOf(m))}, ${stOf(m).ko} KOs`)).join('')}</div>
    <div class="confirm-row"><button class="btn primary" data-act="giftgo" ${giftPick != null ? '' : 'disabled'}>${giftPick != null ? `Leave ${g.mons.find(m => m.uid === giftPick).sp} in the ranch` : 'Pick a Pokémon'}</button><button class="btn" data-act="giftskip">Skip the gift</button></div></section>`;
}

// ---------- team ranch (v189) ----------
let ranchSel = null, ranchTo = null, ranchKeep = null;
function ranchMonBtn(m, on, act, sub) {
  const sp = SP[m.sp];
  return `<button class="reg${on ? ' on' : ''}" data-act="${act}" data-u="${m.uid}" aria-pressed="${on}">
    ${monFace(m.sp, m.shiny || m.radiant, 40)}
    <span class="reg-main"><span class="mon-name">${m.sp}${sp.paradox ? ' <span class="tag paradox">Paradox</span>' : ''}${m.shiny ? ' <span class="tag shiny">✦ Shiny</span>' : ''}${m.radiant ? ' <span class="tag radiant" title="Radiant: shiny colors, at least Good IVs and a stronger ability than its species ever gets">✧ Radiant</span>' : ''}${m.delta ? ' <span class="tag delta" title="Delta Pokémon: an unusual ' + m.delta + ' type">Δ Delta</span>' : ''}${m.alpha ? ' <span class="tag alpha">Alpha</span>' : ''}</span><span>${chips(monTypes(m))}</span><span class="small muted">${sub}</span></span>
    <span class="mon-bst">${sp.bst}<small>BST</small></span><span class="reg-check" aria-hidden="true">${on ? '✓' : ''}</span></button>`;
}
// v191: special conditions shown wherever a ranch Pokémon is listed (resting list, rest picker)
const specialMonTags = m => { const sp = SP[m.sp] || {}; return `${sp.legend && !sp.ub && !sp.baby ? ' <span class="tag legend">Legendary</span>' : ''}${sp.paradox ? ' <span class="tag paradox">Paradox</span>' : ''}${babyTag(sp)}${m.shiny ? ' <span class="tag shiny">✦ Shiny</span>' : ''}${m.radiant ? ' <span class="tag radiant" title="Radiant: shiny colors, at least Good IVs and a stronger ability than its species ever gets">✧ Radiant</span>' : ''}${m.delta ? ' <span class="tag delta" title="Delta Pokémon: an unusual ' + m.delta + ' type">Δ Delta</span>' : ''}${m.alpha ? ' <span class="tag alpha">Alpha</span>' : ''}${condTags(m)}`; };
const ranchSrc = r => r ? (r.how === 'banned' ? `Banned in the ${r.lgName || 'League'} · ${r.fromName}` : r.how === 'reward' ? `Champion's reward · ${r.fromName}` : r.how === 'farewell' ? `Farewell gift from ${r.fromName}` : r.how === 'surplus' ? `Passed on by ${r.fromName}` : r.fromName ? `Kept from ${r.fromName}` : 'From the ranch') : '';
function ranchPickPanel(p, i, n) {
  const t = T(p.from); if (!t) return '';
  const mons = t.team.filter(m => p.uids.includes(m.uid));
  if (ranchKeep != null && !mons.some(m => m.uid === ranchKeep)) ranchKeep = null;
  return `<section class="panel offer"><div class="eyebrow">Retirement${n > 1 ? ` · 1 of ${n}` : ''}</div>
    <h2>${p.fromName} retired. Which Pokémon stays in your ranch?</h2>
    <p>Choose one to keep in your active ranch, where you can hand it to any of your trainers. The rest go to the retired ranch, on display for good.</p>
    <div class="regs">${mons.map(m => ranchMonBtn(m, ranchKeep === m.uid, 'ranchkeep', `Lv ${Math.floor(m.lvl)} · ${natLabel(m)} · IVs ${ivGrade(m)} · ${wl(stOf(m))}, ${stOf(m).ko} KOs`)).join('')}</div>
    <div class="confirm-row"><button class="btn primary" data-act="ranchkeepgo" data-i="${i}" ${ranchKeep != null ? '' : 'disabled'}>${ranchKeep != null ? `Keep ${mons.find(m => m.uid === ranchKeep).sp}` : 'Pick a Pokémon to keep'}</button><button class="btn" data-act="ranchkeepnone" data-i="${i}">Keep none</button></div></section>`;
}
function viewRanch() {
  const k = S.userOrg, R = ranchOf(k); if (!R) return viewOffice();
  const live = S.phase === 'ranch';
  const picks = (S.ranchPicks || []).map((p, i) => ({ p, i })).filter(x => x.p.org === k);
  // v192: a rested Pokémon can always go back to its own trainer, even after their handoff
  const selM = ranchSel != null ? R.active.find(m => m.uid === ranchSel) : null, homeT = selM && selM.ranch && ['rest', 'banned'].includes(selM.ranch.how) ? T(selM.ranch.from) : null;
  // v194: only trainers who can take the selected Pokémon (not into a League where it's banned; one legendary each)
  const takers = live ? ranchTakers(k).concat(homeT && homeT.org === k && homeT.role === 'challenger' && (S.ranchGiven || {})[homeT.id] ? [homeT] : []).filter(t => !selM || ranchCanTake(t, selM)) : [];
  if (ranchSel != null && !R.active.some(m => m.uid === ranchSel)) ranchSel = null;
  if (ranchTo != null && !takers.some(t => t.id === ranchTo)) ranchTo = null;
  const given = (S.ranchLog || []).filter(x => x.org === k && x.season === S.season + 1);
  const head = `<section class="panel callout"><div class="eyebrow">${ORGS[k].name}${live ? ` · Season ${S.season + 1}` : ''}</div><h2>Team ranch</h2>
    <p>Your ranch keeps Pokémon for the team. The <b>active ranch</b> holds Pokémon you can hand to your trainers in any League: the Champion's reward and farewell gifts land here, and when one of your trainers retires you keep one of their Pokémon here. Each offseason, after the Champion's reward, each of your challengers can receive one. It's registered on top of the usual three in its first season. The rest of a retiring trainer's team goes to the <b>retired ranch</b>, on display for good. The roster of every one of your trainers who wins the title goes to the <b>historical ranch</b>. After a season, each of your challengers can also send one Pokémon to <b>rest</b> at the ranch: it sits out the next season, then comes back with better IVs.${featOn('banlist') ? ' Pokémon banned in a trainer\'s League wait here too, even legendaries, and go back to their trainer as soon as they\'re allowed.' : ''}</p>
    ${live ? '' : '<p class="muted small">You can hand Pokémon out each offseason, after the draft and the Champion\'s reward.</p>'}</section>`;
  const pickHtml = live && picks.length ? ranchPickPanel(picks[0].p, picks[0].i, picks.length) : (picks.length ? `<section class="panel"><p class="muted">${picks.length} retirement${picks.length > 1 ? 's' : ''} to settle in the offseason.</p></section>` : '');
  const active = `<section class="panel"><div class="ph"><h3>Active ranch</h3><span class="muted">${R.active.length} Pokémon</span></div>
    ${R.active.length ? `<div class="regs">${R.active.map(m => ranchMonBtn(m, ranchSel === m.uid, 'ranchsel', `${ranchSrc(m.ranch)} · ${natLabel(m)} · IVs ${ivGrade(m)}${ranchLastChance(m) ? ' · <span class="warn">Last offseason here</span>' : ''}${m.ranch && m.ranch.how === 'banned' && m.leg ? ` · with ${m.ranch.fromName} until Season ${m.leg.until}` : ''}${m.ranch && m.ranch.how === 'banned' && !org(k).roster.some(id => ranchCanTake(T(id), m)) ? ' · <span class="muted">Nobody on your team can take it yet</span>' : ''}`)).join('')}</div>
    <p class="muted small">A Pokémon nobody takes in ${RANCH_STEPS} offseasons goes on display in the retired ranch. A season spent resting doesn't count, and Paradox Pokémon get ${RANCH_STEPS_PARADOX}.${featOn('banlist') ? ' A banned Pokémon nobody on the team can take doesn\'t count the season either; a banned legendary leaves when its time with its trainer runs out.' : ''}</p>` : '<p class="muted">Empty. The Champion\'s reward, farewell gifts and your retiring trainers\' Pokémon come here.</p>'}
    ${live && R.active.length ? (selM && !takers.length && ranchTakers(k).length ? `<p class="muted">None of your trainers can take ${selM.sp} right now.</p>` : takers.length ? `<div class="eyebrow">Send it to</div><div class="release">${takers.map(t => `<button class="rel${ranchTo === t.id ? ' on' : ''}" data-act="ranchto" data-id="${t.id}">${dn(t)} ${lgTag(t)}<span class="muted">${specName(t)} · OVR ${ovr(t)}</span></button>`).join('')}</div>
      <div class="confirm-row"><button class="btn primary" data-act="ranchgo" ${ranchSel != null && ranchTo != null ? '' : 'disabled'}>${ranchSel != null && ranchTo != null ? `Send ${R.active.find(m => m.uid === ranchSel).sp} to ${T(ranchTo).name}` : 'Pick a Pokémon and a trainer'}</button></div>` : '<p class="muted">Each of your trainers has had their handoff this offseason.</p>') : ''}
    ${R.active.length ? `<div class="confirm-row"><button class="btn small" data-act="ranchshelf" ${ranchSel != null ? '' : 'disabled'}>Move to the retired ranch</button></div>` : ''}
    ${given.length ? `<ul class="changes">${given.map(x => `<li><b>${x.sp}</b> went to ${tname(x.to)}</li>`).join('')}</ul>` : ''}</section>`;
  const rested = S.ranchRested || {}, resting = R.resting || [];
  const restRows = live ? org(k).roster.map(T).filter(t => t && t.role === 'challenger').map(t => {
    const now = rested[t.id] != null ? resting.find(m => m.uid === rested[t.id]) : null;
    if (now) return `<div class="relpick"><p><b>${dn(t)}</b> ${lgTag(t)} is resting <b>${now.sp}</b>${specialMonTags(now)}. It comes back after Season ${now.rest.back}.</p><div class="confirm-row"><button class="btn small" data-act="ranchunrest" data-id="${t.id}">Keep it on the team instead</button></div></div>`;
    const opts = t.team.filter(m => canRest(t, m));
    return `<div class="relpick"><p><b>${dn(t)}</b> ${lgTag(t)}</p>${opts.length ? `<div class="release">${opts.map(m => `<button class="rel" data-act="ranchrest" data-id="${t.id}" data-u="${m.uid}">${m.sp}${specialMonTags(m)} <span class="muted">IVs ${ivGrade(m)}</span></button>`).join('')}</div>` : '<p class="muted small">Nothing that can rest this offseason.</p>'}</div>`;
  }).join('') : '';
  const restPanel = `<section class="panel"><div class="ph"><h3>Resting</h3><span class="muted">${resting.length} Pokémon</span></div>
    <p class="muted small">One Pokémon per trainer each offseason. A resting Pokémon sits out the whole next season, then comes back to the active ranch with better IVs (and a little more friendship), ready to go back to its trainer. It doesn't count toward registration while it rests.</p>
    ${resting.length ? `<ul class="changes">${resting.map(m => `<li>${monFace(m.sp, m.shiny || m.radiant, 24)} <b>${m.sp}</b>${specialMonTags(m)} · ${m.rest.fromName} <span class="muted">· ${natLabel(m)} · IVs ${ivGrade(m)}</span> <span class="muted">back after Season ${m.rest.back}</span></li>`).join('')}</ul>` : ''}
    ${live ? restRows : (resting.length ? '' : '<p class="muted">Nothing is resting. You can rest a Pokémon in the offseason ranch step.</p>')}</section>`;
  const ret = R.retired, champs = (R.champs || []).filter(c => c.won);
  const monBit = m => `<span class="itemchip">${m.sp}${m.shiny ? ' ✦' : ''}${m.radiant ? ' ✧' : ''}${m.alpha ? ' (alpha)' : ''}${m.delta ? ' (Δ)' : ''} <span class="muted">Lv ${m.lvl}${m.ko ? ` · ${m.ko} KOs` : ''}</span></span>`;
  // v195: the historical ranch holds title rosters, each one collapsible; retired Pokémon have their own retired ranch
  const hist = `<section class="panel"><div class="ph"><h3>Historical ranch</h3><span class="muted">${champs.length} title roster${champs.length === 1 ? '' : 's'}</span></div>
    ${champs.length ? `<p class="muted small">The roster of each of your trainers who won the title. Tap a season to open it.</p><div class="histlist">${champs.slice().sort((a, b) => b.season - a.season).map(c => `<details class="hist"><summary><b>Season ${c.season}</b>${nLeagues() > 1 ? ` <span class="tag lg">${(c.lgName || leagueName(c.lg)).replace(/ League$/, '')}</span>` : ''} · <b>${c.name}</b> <span class="muted">won the title · ${c.mons.length} Pokémon</span></summary><div class="it-bag">${c.mons.map(monBit).join('')}</div></details>`).join('')}</div>` : '<p class="muted">None of your trainers has won the title yet.</p>'}</section>`;
  const retired = `<section class="panel"><div class="ph"><h3>Retired ranch</h3><span class="muted">${ret.length} Pokémon</span></div>
    ${ret.length ? `<p class="muted small">Your top ${Math.min(RANCH_TOP, ret.length)} by knockouts, then wins.</p>${ranchHistTable(ranchTopRetired(ret))}<div class="confirm-row"><button class="btn" data-act="nav" data-v="ranchhist">See all ${ret.length} retired Pokémon</button></div>` : '<p class="muted">Nobody has retired from your team yet.</p>'}</section>`;
  const done = live ? `<section class="panel"><div class="confirm-row"><button class="btn primary" data-act="ranchdone" ${picks.length ? 'disabled' : ''}>Continue to the new season</button>${picks.length ? '<span class="warn">Settle the retirement first.</span>' : ''}</div></section>` : '';
  return head + pickHtml + active + restPanel + hist + retired + done;
}

// ---------- retired ranch (v192; called the historical ranch until v195) ----------
const whyText = w => (w || '').replace('historical ranch', 'retired ranch');
// the ranch screen shows the team's top RANCH_TOP retired Pokémon; the full list has its own screen
const RANCH_TOP = 10;
const retRank = r => (r.st.ko || 0) * 1000 + (r.st.w || 0) * 10 + (r.lvl || 0) / 100;
const ranchTopRetired = ret => ret.slice().sort((a, b) => retRank(b) - retRank(a)).slice(0, RANCH_TOP);
const retTags = r => `${r.shiny ? ' <span class="tag shiny">✦</span>' : ''}${r.radiant ? ' <span class="tag radiant">✧</span>' : ''}${r.alpha ? ' <span class="tag alpha">Alpha</span>' : ''}${r.delta ? ' <span class="tag delta">Δ</span>' : ''}${r.paradox ? ' <span class="tag paradox">Paradox</span>' : ''}`;
const retWho = r => r.from != null && T(r.from) ? tname(r.from) : (r.fromName || '—');
// v192: each retired Pokémon opens its page: the full card when its last trainer still has it among their former
// Pokémon, otherwise a page built from the ranch record (species, level, record and why it's there)
function retLink(r) {
  const t = r.from != null ? T(r.from) : null;
  const i = t && t.alumni ? t.alumni.findIndex(a => a.uid === r.uid) : -1;
  return i >= 0 ? `<button class="tlink" data-act="alum" data-t="${t.id}" data-i="${i}">${r.sp}</button>` : `<button class="tlink" data-act="ranchrec" data-u="${r.uid}" data-s="${r.season}">${r.sp}</button>`;
}
function ranchHistTable(rows, sortable) {
  const th = (k, l, num) => sortable ? `<th${num ? ' class="num"' : ''}><button class="sort${rhSort.k === k ? ' on' : ''}" data-act="rhsort" data-k="${k}">${l}${rhSort.k === k ? (rhSort.dir < 0 ? ' ↓' : ' ↑') : ''}</button></th>` : `<th>${l}</th>`;
  return `<div class="scroll"><table class="tbl compact"><thead><tr>${th('sp', 'Pokémon')}${th('lvl', 'Lv', 1)}${th('from', 'Last with')}${th('season', 'Retired', 1)}${sortable ? th('why', 'Why') : ''}${th('w', 'Record', 1)}${th('ko', 'KOs', 1)}</tr></thead><tbody>${rows.map(r => `<tr><td>${monFace(r.sp, r.shiny || r.radiant, 24)} ${retLink(r)}${retTags(r)}</td><td class="num">${r.lvl}</td><td>${retWho(r)}</td><td class="num">${r.season}</td>${sortable ? `<td class="small muted">${whyText(r.why)}</td>` : ''}<td class="num">${r.st.w}–${r.st.l}</td><td class="num">${r.st.ko}</td></tr>`).join('')}</tbody></table></div>`;
}
let rhSort = { k: 'ko', dir: -1 }, rhShow = 100;
function viewRanchHistory() {
  const k = S.userOrg, R = ranchOf(k); if (!R) return viewOffice();
  const val = (r, key) => key === 'sp' ? r.sp : key === 'from' ? (r.fromName || '') : key === 'why' ? (r.why || '') : key === 'w' ? r.st.w : key === 'ko' ? r.st.ko : r[key] ?? 0;
  const rows = R.retired.slice().sort((a, b) => { const x = val(a, rhSort.k), y = val(b, rhSort.k); const c = typeof x === 'string' ? x.localeCompare(y) : x - y; return c * rhSort.dir || retRank(b) - retRank(a); });
  return `<section class="panel callout"><div class="eyebrow">${ORGS[k].name}</div><h2>Retired Pokémon</h2>
    <p>Every Pokémon in your retired ranch: retired with a trainer, not registered for a new season, or unused in the active ranch for ${RANCH_STEPS} offseasons (${RANCH_STEPS_PARADOX} for Paradox Pokémon). ${R.retired.length} in all.</p>
    <div class="confirm-row"><button class="btn" data-act="nav" data-v="ranch">Back to the ranch</button></div></section>
    <section class="panel">${rows.length ? ranchHistTable(rows.slice(0, rhShow), true) + (rows.length > rhShow ? `<div class="confirm-row"><button class="btn" data-act="rhmore">Show ${Math.min(100, rows.length - rhShow)} more</button><span class="muted small">Showing ${rhShow} of ${rows.length}</span></div>` : '') : '<p class="muted">Nobody has retired from your team yet.</p>'}</section>`;
}

// a retired Pokémon whose full card is gone: what the retired ranch kept
function ranchRecBody() {
  const R = ranchOf(S.userOrg), r = R && R.retired.find(x => x.uid === modal.rec.u && x.season === modal.rec.s);
  if (!r) return `<div class="mh"><h2>Pokémon</h2><button class="btn icon" data-act="close" aria-label="Close">×</button></div><p class="muted">This Pokémon is no longer in the retired ranch.</p>`;
  const s = SP[r.sp], st = r.st || {}, t = r.from != null ? T(r.from) : null;
  return `<div class="mh"><h2>${r.sp}</h2><button class="btn icon" data-act="close" aria-label="Close">×</button></div>
    <div class="moncard"><div class="monpic">${monFace(r.sp, r.shiny || r.radiant, IMG_PX, 'big')}</div>
      <div><div>${s ? chips(monTypes(r)) : ''}${retTags(r)}</div>
        <p>Lv ${r.lvl}${r.nat ? ` · ${r.nat} nature` : ''}</p>
        <p class="muted">In ${ORGS[S.userOrg].name}'s retired ranch since Season ${r.season}${r.why ? `: ${whyText(r.why)}` : ''}.</p></div></div>
    <section class="panel"><div class="ph"><h3>Last with ${t ? tname(t.id) : (r.fromName || 'the team')}</h3></div>
      <div class="stats"><div><b>${st.b || 0}</b><small>Battles</small></div><div><b>${st.w || 0}–${st.l || 0}</b><small>Win–loss</small></div><div><b>${st.ko || 0}</b><small>Knockouts</small></div></div></section>
    <p class="fine">The full stat card isn't kept for this one: trainers keep cards for the Pokémon that made a mark and their most recent others.</p>`;
}
// ---------- draft ----------
function viewDraft() {
  const d = S.draft; if (!d) return viewOffice();
  const q = draftCurrent();
  const mineTurn = q && q.org === S.userOrg;
  const roster = userTrainers();
  const full = teamFull(S.userOrg), cap = ROSTER * nLeagues();
  if (draftRelease && !roster.some(t => t.id === draftRelease)) draftRelease = null;
  const potShown = t => t.seasons > 1 ? null : scoutEst(t);
  const dval = (t, k) => ({ best: ovr(t) + (potShown(t) ?? ovr(t)), name: dn(t), age: t.age, type: t.specialty ? specName(t) : 'zz', trait: traitOf(t) ? TRAITS[traitOf(t)].name : 'zz', ovr: ovr(t), pot: potShown(t) ?? -1, mons: t.team.reduce((a, m) => a + SP[m.sp].bst, 0), ...t.r })[k];
  const avail = draftAvail().map(T).sort((a, b) => { const x = dval(a, draftSort.k), y = dval(b, draftSort.k); const c = typeof x === 'string' ? x.localeCompare(y) : x - y; return c * draftSort.dir || dval(b, 'best') - dval(a, 'best'); });
  const dth = (k, l, title) => `<th${title ? ` title="${title}"` : ''}><button class="sort${draftSort.k === k ? ' on' : ''}" data-act="draftsort" data-k="${k}">${l}${draftSort.k === k ? (draftSort.dir < 0 ? ' ↓' : ' ↑') : ''}</button></th>`;
  const order = d.order.map((k, i) => `${i + 1}. ${ORGS[k].short}`).join(' · ');
  return `<div class="grid-office draftgrid"><div class="col">
  <section class="panel callout"><div class="eyebrow">${d.founding ? `Founding draft · ${ROSTER * nLeagues()} round${ROSTER * nLeagues() > 1 ? 's' : ''}, snake order` : `Season ${S.season + 1} draft`}</div>
    <h2>${mineTurn ? `You're on the clock · ${q.round === 'Comp' ? 'Compensation pick' : 'Pick #' + (d.picks.length + 1)}` : 'Waiting'}</h2>
    ${mineTurn && q.round === 'Comp' && q.from ? `<p class="good">This pick is compensation for losing ${T(q.from).name} to ${T(q.from).role === 'e4' ? 'the Elite Four' : 'a gym'}.</p>` : ''}
    ${d.queue.some(x => x.round === 'Comp') ? `<p class="muted small">Compensation picks go first: ${d.queue.filter(x => x.round === 'Comp').map(x => ORGS[x.org].short).join(', ')}.</p>` : ''}
    <p>Order: ${order}.${d.founding ? '' : ' Independents on the circuit are eligible too.'} Potential is a scout's estimate and can be off by several points.${nLeagues() > 1 ? ` Each pick joins the League where your team has an open spot (${Array.from({ length: nLeagues() }, (_, i) => `${lgShort(i)} ${lgRoster(S.userOrg, i).length}/${ROSTER}`).join(', ')}). You can move trainers between Leagues before the season.` : ''}</p>
    ${mineTurn && full ? `<div class="relpick"><p><b>Your roster is full.</b> Choose who to release if you draft someone. They stay on the circuit as an independent.</p><div class="release">${roster.filter(t => t.role === 'challenger').map(t => `<button class="rel${draftRelease === t.id ? ' on' : ''}" data-act="drel" data-id="${t.id}">${dn(t)} <span class="muted">OVR ${ovr(t)}, age ${t.age}</span></button>`).join('')}</div></div>` : ''}
    ${mineTurn && !q.must ? `<div class="confirm-row"><button class="btn" data-act="draftpass">${full ? 'Keep my roster and pass' : 'Pass on this pick'}</button></div>` : ''}
    ${mineTurn && q.must ? `<p class="warn">You have an open roster spot and must pick.</p>` : ''}
  </section>
  </div>
  <div class="col side">
    <section class="panel"><div class="ph"><h3>Your roster</h3><span class="muted">${roster.length}/${cap}</span></div>${roster.map(t => `<div class="devrow"><div>${tname(t.id)}<div class="muted small">${lgTag(t)}${t.role === 'champion' ? 'Champion' : 'Age ' + t.age}</div></div>${ovrPill(t)}</div>`).join('') || '<p class="muted">Empty.</p>'}</section>
    <section class="panel"><div class="ph"><h3>Picks</h3></div><ol class="picks">${d.picks.map(p => `<li>${orgMark(p.org)} <span>${p.id ? tname(p.id) : '<span class="muted">Passed</span>'}</span><span class="muted small">${p.round === 'Fill' ? 'Fill' : p.round === 'Comp' ? 'Comp' : 'R' + p.round}</span></li>`).join('') || '<li class="muted">No picks yet.</li>'}</ol></section>
  </div></div>
  <section class="panel draftavail"><div class="ph"><h3>Available</h3><span class="muted">${avail.length} · ${draftSort.k === 'best' ? 'sorted by overall value (OVR + potential)' : '<button class="link" data-act="draftsort" data-k="best">Reset to overall value</button>'}</span></div><div class="scroll"><table class="tbl draft"><thead><tr>${dth('name', 'Trainer')}${dth('age', 'Age')}${dth('type', 'Type')}${dth('trait', 'Trait', 'Personality trait: hover a trait for what it does')}${dth('ovr', 'OVR')}${dth('pot', 'POT', "Potential: a scout's estimate, which can be off by several points")}${RK.map(k => dth(k, RNAME[k].slice(0, 3), RNAME[k])).join('')}${dth('mons', 'Pokémon', 'Sorts by the team’s combined base stat total')}<th class="dact"></th></tr></thead><tbody>
  ${avail.map(t => `<tr><td class="dname">${tname(t.id)} <span class="muted small" title="A scout's read on what this trainer wants. It can be wrong.">${AMBS[ambSeen(t)].hint}</span>${t.famous ? ' <span class="tag gold">famous</span>' : ''}${t.legacy ? ` <span class="tag legacy" title="Child of ${esc(t.legacy.name)}${t.legacy.org ? ', who was with ' + ORGS[t.legacy.org].name : ''}. Starts with a Pokémon from the parent's signature line; legendaries and other one-of-a-kind Pokémon can't be passed down.">legacy${t.legacy.org === S.userOrg ? ' · yours' : ''}</span>` : ''}${t.role === 'challenger' ? ' <span class="tag">indep.</span>' : t.role === 'free' ? ' <span class="tag">free agent</span>' : t.seasons > 0 ? ' <span class="tag">veteran</span>' : t.age >= 25 ? ' <span class="tag">late starter</span>' : ''}</td><td class="num">${t.age}</td><td>${specChips(t)}</td><td>${traitChip(t) || '<span class="muted">—</span>'}</td><td>${ovrPill(t)}</td><td class="num">${t.seasons > 1 ? '—' : scoutEst(t)}</td>${RK.map(k => `<td class="num">${t.r[k]}</td>`).join('')}<td class="dmons">${t.team.map(m => monMini(m.sp, m.shiny || m.radiant) + m.sp).join(', ')}</td><td class="dact">${mineTurn ? `<button class="btn small primary" data-act="draftpick" data-id="${t.id}" ${full && !draftRelease ? 'disabled title="Choose who to release first"' : ''}>Draft</button>` : ''}</td></tr>`).join('')}
  </tbody></table></div></section>
`;
}

// ---------- modals ----------
function renderModal() {
  const root = $('#modal');
  if (!modal) { root.hidden = true; root.innerHTML = ''; return; }
  root.hidden = false;
  let body = '';
  if (modal.kind === 'mon') body = monBody();
  if (modal.kind === 'confirmsim') { const left = SEASON_WEEKS - S.week; body = `<div class="mh"><h2>Play to the League?</h2><button class="btn icon" data-act="close" aria-label="Close">×</button></div>
    <p>This plays the remaining <b>${left} week${left === 1 ? '' : 's'}</b> of Season ${S.season} in one go. You can't undo it.</p>
    ${tourneyAhead() ? `<div class="adv-list">${stopTourneyOpt()}</div>` : ''}
    <div class="confirm-row"><button class="btn primary" data-act="autoseason">${tourneyAhead() && simStopTourney ? `Play to week ${TOURNEY_WEEK}` : `Play ${left} week${left === 1 ? '' : 's'}`}</button><button class="btn" data-act="close">Cancel</button></div>`; }
  if (modal.kind === 'profile') body = `<div class="mh"><h2>Trainer profile</h2><button class="btn icon" data-act="close" aria-label="Close">×</button></div>${profileBody(T(modal.id), false)}`;
  if (modal.kind === 'battle') body = battleShell();
  if (modal.kind === 'img') body = imgBody();
  if (modal.kind === 'images') body = imagesModalBody();
  if (modal.kind === 'menu') body = menuBody();
  if (modal.kind === 'updates') body = updatesBody();
  if (modal.kind === 'glossary') body = glossaryBody();
  if (modal.kind === 'simmany') body = simManyBody();
  if (modal.kind === 'recmore') { const L = REC_LISTS[modal.key] || { title: 'Records', rows: [] };
    body = `<div class="mh"><h2>${L.title}</h2><button class="btn icon" data-act="close" aria-label="Close">×</button></div><p class="muted small">${modal.key.startsWith('pk-') ? 'Pokémon' : 'Trainers'} · top ${L.rows.length}${L.note ? ' · ' + L.note : ''}</p><div class="recboard big">${recRows(L.rows)}</div>`; }
  root.innerHTML = `<div class="scrim" data-act="close"></div><div class="sheet sheet-${modal.kind}" role="dialog" aria-modal="true">${body}</div>`;
  applyFolds(root, 'modal-' + modal.kind);
  if (modal.kind === 'battle') startPlayback();
}
const HOW = { glitch: 'Glitched onto the team', starter: 'Starting partner', caught: 'Caught', gift: "Champion's reward", ranch: 'From the team ranch', assigned: 'Assigned by the League', farewell: 'Farewell gift', paradox: 'Paradox Pokémon from the League', wormhole: 'Caught from an Ultra Wormhole', roamer: 'Caught while it roamed the region', swap: 'Brought in after a losing streak', traded: 'Received in a trade', snag: 'Snagged from Cipher', legacy: 'Passed down from a parent', legend: 'A legendary encounter', tourney: 'Midseason Tournament prize' };
function monProfile(m, former) {
  const ivOf = k => m.iv[k] ?? m.iv[k === 'spa' ? 'atk' : k === 'spd' ? 'def' : k] ?? 15;
  const ivRow = (k, l) => `<div class="rt"><span class="rt-k">${l}</span><span class="rt-bar"><i style="width:${ivOf(k) / 31 * 100}%"></i></span><span class="rt-v">${ivOf(k)}</span></div>`;
  const s = SP[m.sp], lv = Math.floor(m.lvl), ml = moveLv(m), early = ml - lv; // v197: Modest learns early
  const moves = (m.moves || []).map(n => MOVES[n]).filter(Boolean).map(mv => `<li>${chip(mv.type)} <b>${mv.name}</b> <span class="muted small">${moveLine(mv, m)}</span></li>`).join('') +
    (m.cov || []).filter(c => ml < c.lv).map(c => `<li class="muted small">${covChip(c.t)} learns ${c.t}-type moves at Lv ${c.lv - early}</li>`).join('') +
    (ml < MOVE_TIER_LV[3] ? `<li class="muted small">Stronger moves at Lv ${(ml < MOVE_TIER_LV[2] ? MOVE_TIER_LV[2] : MOVE_TIER_LV[3]) - early}</li>` : '');
  const f = formTier(m.form || 0);
  return `<section class="panel"><div class="ph"><h3>Profile</h3></div><div class="prof">
    <div>${abilityBlock(m)}${itemsOn() && !former ? `<div class="eyebrow">Held item</div><p>${m.item && ITEMS[m.item] ? `${itemChip(m.item)} <span class="muted small">· ${ITEMS[m.item].desc}</span>` : '<span class="muted">None</span>'}</p>` : ''}<div class="eyebrow">Nature</div><p><b>${m.nat}</b> <span class="muted">· ${natureText(m.nat)}</span></p>${former ? '' : temperLine(m)}
      <div class="eyebrow">Friendship</div><div class="frbar"><i style="width:${(m.fr ?? 70) / 255 * 100}%"></i></div><p class="small"><b>${frTier(m.fr ?? 70)}</b> <span class="muted">· ${m.fr ?? 70} / 255. Raises critical hits and the chance to hang on at 1 HP.</span></p>
      ${former ? '' : `<div class="eyebrow">Form</div><p><b>${f}</b> ${formBadge(m)} <span class="muted small">· ${(m.form || 0) >= 0 ? '+' : '−'}${Math.abs(Math.round((m.form || 0) * 2))}% damage. Wins and knockouts heat it up; fainting cools it down.</span></p>`}</div>
    <div><div class="eyebrow">Base stats · ${SP[m.sp].glitch ? 'scrambled' : attackStyle(m.sp)}</div>${SP[m.sp].glitch ? `<p class="small muted">Every battle deals out ${GLITCH_STATS.join(', ')} to its six stats at random.</p>` : ''}<div class="ratings basestats">${SP[m.sp].glitch ? STAT_KEYS.map(k => `<div class="rt"><span class="rt-k">${STAT_SHORT[k]}</span><span class="rt-bar"><i style="width:0%"></i></span><span class="rt-v">??</span></div>`).join('') : STAT_KEYS.map(k => { const v = Math.round(bsOf(m.sp)[k]); return `<div class="rt"><span class="rt-k">${STAT_SHORT[k]}</span><span class="rt-bar"><i style="width:${Math.min(100, v / 180 * 100)}%"></i></span><span class="rt-v">${v}</span></div>`; }).join('')}</div>
      <div class="eyebrow">IVs · ${ivGrade(m)} (${ivTotal(m)} / 186)</div><div class="ratings">${STAT_KEYS.map(k => ivRow(k, STAT_NAME[k])).join('')}</div>
      <div class="eyebrow">Moves</div><ul class="moves">${moves}</ul></div>
  </div></section>`;
}
function legendPartners(m, here) {
  if (!m.partners || !m.partners.length) return '';
  const now = { b: (m.st && m.st.b) || 0, w: (m.st && m.st.w) || 0, l: (m.st && m.st.l) || 0, ko: (m.st && m.st.ko) || 0 };
  const rows = m.partners.slice().reverse().map(p => { const x = p.st || { b: now.b - p.at.b, w: now.w - p.at.w, l: now.l - p.at.l, ko: now.ko - p.at.ko };
    return `<li>${T(p.id) ? tname(p.id) : p.name} · ${p.to == null ? `Season ${p.from}–now` : p.from === p.to ? `Season ${p.from}` : `Seasons ${p.from}–${p.to}`} · <b>${x.w}–${x.l}</b>, ${x.ko} KOs${p.to != null && p.why ? ` <span class="muted small">(${p.why})</span>` : ''}</li>`; }).join('');
  const where = here.t ? (m.leg && m.leg.until != null ? `With ${tname(here.t.id)} until the end of Season ${m.leg.until}, then it moves on.` : `With ${tname(here.t.id)}.`)
    : `Waiting in the ${leagueName(here.lg)} for a new partner. It won't go back to anyone it has been with.`;
  return `<section class="panel"><div class="ph"><h3>Partners</h3><span class="muted">${m.partners.length} trainer${m.partners.length > 1 ? 's' : ''}</span></div><p class="small">${where}</p><ul class="changes">${rows}</ul></section>`;
}
function monBody() {
  if (modal.rec) return ranchRecBody();
  const t0 = T(modal.t);
  let t = t0;
  let m = modal.alum != null ? t0.alumni[modal.alum] : t0.team.find(x => x.uid === modal.u);
  // an old partner's entry for a legendary opens the legendary itself, wherever it is now
  let here = null;
  if (m && (m.legendRef || m.partners)) { here = findLegend(m.uid); if (here) { m = here.m; if (here.t) t = here.t; } }
  if (!m) return `<div class="mh"><h2>Pokémon</h2><button class="btn icon" data-act="close" aria-label="Close">×</button></div><p class="muted">This Pokémon is no longer on the team.</p>`;
  const s = SP[m.sp], st = m.st || blankStat(), ss = modal.alum != null && !(here && here.t) ? null : ssOf(m);
  const tiles = (x) => `<div class="stats"><div><b>${x.b}</b><small>Battles</small></div><div><b>${wl(x)}</b><small>Win–loss</small></div><div><b>${pct(x)}</b><small>Win rate</small></div><div><b>${x.ko}</b><small>Knockouts</small></div><div><b>${x.f}</b><small>Times fainted</small></div><div><b>${x.b ? (x.ko / x.b).toFixed(2) : '—'}</b><small>KOs per battle</small></div></div>`;
  const met = m.met ? `${HOW[m.met.how] || m.met.how}${m.met.how === 'caught' ? ` in Season ${m.met.season}, week ${m.met.week}` : (m.met.how === 'farewell' || (m.met.how === 'ranch' && m.met.from)) ? ` from ${m.met.from} · Season ${m.met.season}` : ` · Season ${m.met.season}`}` : 'Origin not recorded';
  const metFull = met + (m.rejoined && m.rejoined.length ? m.rejoined.map(r => ` · back on the team in Season ${r.season} (for ${r.for})`).join('') : '');
  return `<div class="mh"><h2>${m.sp}</h2><button class="btn icon" data-act="close" aria-label="Close">×</button></div>
    <div class="moncard"><div class="monpic">${monFace(m.sp, m.shiny || m.radiant, IMG_PX, 'big')}${monImgBtns(m.sp)}</div>
      <div><div>${chips(monTypes(m))}${s.legend ? ' <span class="tag legend">Legendary</span>' : ''}${s.paradox ? ' <span class="tag paradox">Paradox</span>' : ''}${babyTag(s)}${megaTag(m)}${m.shiny ? ' <span class="tag shiny">✦ Shiny</span>' : ''}${m.radiant ? ' <span class="tag radiant" title="Radiant: shiny colors, at least Good IVs and a stronger ability than its species ever gets">✧ Radiant</span>' : ''}${m.delta ? ' <span class="tag delta" title="Delta Pokémon: an unusual ' + m.delta + ' type">Δ Delta</span>' : ''}${m.alpha ? ' <span class="tag alpha">Alpha</span>' : ''}${condTags(m)}</div><div class="muted small">${modal.alum != null ? 'Formerly with' : 'Lv ' + lvShow(m) + ' · with'} ${tname(t.id)} · BST ${s.bst}</div><div class="muted small">${metFull}${modal.alum != null ? ` · left in Season ${m.left} (${m.why})` : ''}</div></div></div>
    ${m.iv ? monProfile(m, modal.alum != null && !here) : ''}
    ${here ? legendPartners(m, here) : ''}
    ${ss ? `<section class="panel"><div class="ph"><h3>Season ${S.season}</h3></div>${tiles(ss)}</section>` : ''}
    <section class="panel"><div class="ph"><h3>${m.partners ? 'Lifetime' : `Career with ${t.name}`}</h3></div>${tiles(st)}
      ${m.prior ? `<p class="small muted">Before the gift: <b>${wl(m.prior.st)}</b> (${pct(m.prior.st)}), ${m.prior.st.ko} KOs with ${m.prior.name}.</p>` : ''}
      <div class="split"><span>Gym battles <b>${st.gw}–${st.gl}</b></span><span>League &amp; title <b>${st.lw}–${st.ll}</b></span><span>Led <b>${st.lead || 0}</b> of ${st.b} battles</span><span>Damage dealt <b>${st.dmg.toLocaleString()}</b> HP</span>${m.best ? `<span>Best battle <b>${m.best} KOs</b></span>` : ''}${sweepsOf(m) ? `<span>6-0 sweeps <b>${sweepsOf(m)}</b></span>` : ''}${m.megas ? `<span>Mega Evolutions <b>${m.megas}</b></span>` : ''}${(m.awards || []).length ? `<span>${m.awards.map(x => `<b>${AWARDS[x.k].name}</b> S${x.season}${lgIn(x.lg) ? ' · ' + lgIn(x.lg) : ''}`).join(', ')}</span>` : ''}${m.bonds ? `<span>Battle Bond transformations <b>${m.bonds}</b></span>` : ''}</div></section>
    ${m.evoLog && m.evoLog.length ? `<section class="panel"><div class="ph"><h3>Evolutions</h3></div><ul class="changes">${m.evoLog.map(e => `<li>${e.from} → <b>${e.to}</b> at Lv ${e.lvl}, Season ${e.season}</li>`).join('')}</ul></section>` : ''}
    ${S.dex && S.dex[m.sp] && S.dex[m.sp].b ? `<p class="fine">Every ${m.sp} in the league: ${wl(S.dex[m.sp])} (${pct(S.dex[m.sp])}) all time.</p>` : ''}`;
}
// ---------- sim multiple seasons ----------
// v192: a league whose save text is past about 6 MB uncompressed (roughly 1.5 MB stored) gets the storage note
const simSaveBig = () => { try { return JSON.stringify(S).length > 6e6; } catch (e) { return false; } };
const SIM_CHOICES = [1, 2, 3, 5, 10, 25];
let simTimer = null;
function simManyBody() {
  const m = modal;
  if (m.running || m.done) {
    const pct = Math.round(m.log.length / m.n * 100);
    const rows = m.log.map(x => `<tr><td class="num">${x.season}</td><td>${orgLabel(x.cup)}</td><td>${tname(x.champ, x.champOrg || null)}${x.champWasNew ? ' <span class="tag gold">new</span>' : ''}</td><td>${x.userRank ? ordinal(x.userRank) : '—'}</td><td class="small">${x.mine}</td></tr>`).join('');
    return `<div class="mh"><h2>${m.done ? `Simulated ${m.log.length} season${m.log.length === 1 ? '' : 's'}` : `Simulating… ${m.log.length} of ${m.n}`}</h2>${m.done ? '<button class="btn icon" data-act="simmanyclose" aria-label="Close">×</button>' : ''}</div>
      <div class="simbar" role="progressbar" aria-valuemin="0" aria-valuemax="${m.n}" aria-valuenow="${m.log.length}"><i style="width:${pct}%"></i></div>
      ${m.stopped ? '<p class="muted small">Stopped early. You pick up at the start of the next season.</p>' : ''}
      ${m.failed ? `<p class="warn">Something went wrong during Season ${m.failed.season}, so the sim stopped. Everything up to that point is saved. If it happens again, please report this message: <span class="small">${esc(m.failed.msg).slice(0, 200)}</span></p>` : ''}
      ${rows ? `<div class="scroll"><table class="tbl"><thead><tr><th>Season</th><th>Team Cup</th><th>Champion</th><th>${ORGS[S.userOrg].short}</th><th>Your trainers</th></tr></thead><tbody>${rows}</tbody></table></div>` : ''}
      <div class="confirm-row">${m.done ? `<button class="btn primary" data-act="simmanyclose">Continue in Season ${S.season}${S.phase === 'season' && S.week ? `, week ${S.week + 1}` : ''}</button><button class="btn" data-act="simmanyrecords">See records</button>` : '<button class="btn" data-act="simmanystop">Stop after this season</button>'}</div>`;
  }
  const n = m.n || 5;
  return `<div class="mh"><h2>Sim multiple seasons</h2><button class="btn icon" data-act="close" aria-label="Close">×</button></div>
    <p>Plays whole seasons, drafts and offseasons in one go, then stops at the start of a season so you can take over. While it runs, your team is managed the way the AI teams are:</p>
    <ul class="mini-list"><li>Your trainers make their own weekly calls and catches.</li><li>Drafts take the best available prospect; a full roster only swaps its weakest trainer for a clearly better one.</li><li>Champion's rewards, registration and farewell gifts use the best fit.</li><li>In the ranch step, each trainer rests their best extra Pokémon, passes the others on to the ranch, and takes one from it. Good Pokémon in their last offseason there are handed out first.</li></ul>
    <div class="eyebrow">Seasons</div><div class="segs setup-segs sim-n">${SIM_CHOICES.map(k => `<button class="seg${n === k ? ' on' : ''}" data-act="simmanyn" data-v="${k}" aria-pressed="${n === k}">${k}</button>`).join('')}</div>
    <div class="eyebrow" style="margin-top:12px">If the League invites one of your trainers to a gym or Elite Four seat</div>
    <div class="segs setup-segs">${[[false, 'Decline and keep them'], [true, 'Accept the invitation']].map(([v, l]) => `<button class="seg${!!m.accept === v ? ' on' : ''}" data-act="simmanyacc" data-v="${v ? 1 : 0}" aria-pressed="${!!m.accept === v}">${l}</button>`).join('')}</div>
    ${featOn('tourney') ? `<div class="adv-list" style="margin-top:12px">${stopTourneyOpt().replace('The sim stops at the start of week', 'After the last season, the sim plays on into the next one and stops at the start of week')}</div>` : ''}
    ${S.phase !== 'season' || S.week > 0 ? `<p class="muted small">${S.phase === 'season' ? `Season ${S.season} is in week ${S.week + 1}, so it finishes first and counts as the first season.` : `The current ${S.phase === 'offseason' ? 'offseason' : S.phase} finishes first.`}</p>` : ''}
    ${n >= 10 || simSaveBig() ? `<p class="warn small">Planning to sim far ahead? Saves grow every season, and browsers only keep a few megabytes per site${simSaveBig() ? ' (this league is already large)' : ''}. If the save gets too big for this browser, the game tells you and stops saving here. Use Download save file in the menu now and then, so a long league is never lost.</p>` : ''}
    <p class="muted small">You can't undo it. Copy your save from the menu first if you might want this point back.</p>
    <div class="confirm-row"><button class="btn primary" data-act="simmanygo">Sim ${n} season${n === 1 ? '' : 's'}</button><button class="btn" data-act="close">Cancel</button></div>`;
}
// your trainers' best result in a season, for the summary
function simLine(h) {
  const r = (h.userResults || []).slice().sort((a, b) => (b.stage ?? -1) - (a.stage ?? -1) || b.badges - a.badges)[0];
  if (!r) return '—';
  const t = T(r.id); const nm = t ? t.name : 'Trainer';
  if (h.champ === r.id && h.champWasNew) return `<b class="good">${nm} won the title!</b>`;
  if (r.role === 'champion') return `${nm} held the title`;
  if (r.stage != null) return `${nm}: ${r.stage === 4 ? 'reached the Champion' : r.stage === 5 ? 'won the title' : 'Elite Four #' + (r.stage + 1)}`;
  return `${nm}: ${r.badges} badge${r.badges === 1 ? '' : 's'}`;
}
function simManyTick() {
  const m = modal; if (!m || m.kind !== 'simmany' || !m.running) return;
  let h;
  // if a season ever fails, stop and say so (progress so far is kept) instead of hanging on "Simulating…"
  try { h = simOneSeason(m.accept); }
  catch (e) { m.running = false; m.done = true; m.failed = { season: S.season, msg: String(e && e.message || e) }; save(); view = 'office'; render(); renderModal(); return; }
  if (h) m.log.push({ ...h, mine: simLine(h) });
  save();
  if (m.log.length >= m.n || m.stopRequested) {
    // v193: Stop before the Midseason Tournament plays on into the new season up to the tournament week
    if (m.stopTourney && !m.failed) { try { simToTourney(); } catch (e) { m.failed = { season: S.season, msg: String(e && e.message || e) }; } save(); }
    m.running = false; m.done = true; m.stopped = m.stopRequested && m.log.length < m.n; view = 'office'; render(); renderModal(); return; }
  renderModal();
  simTimer = setTimeout(simManyTick, 30);
}
// a trainer card's name: the title (class or post) on a small line, the name itself as the heading, so long names fit
function cardName(t) {
  const full = dn(t), nm = t.name || '';
  const title = full.endsWith(nm) ? full.slice(0, full.length - nm.length).trim() : '';
  const len = nm.length;
  return `${title ? `<div class="tcard-cls">${esc(title)}</div>` : ''}<h1 class="tcard-name${len > 22 ? ' xlong' : len > 14 ? ' long' : ''}">${esc(title ? nm : full)}</h1>`;
}
// ---------- glossary ----------
// built from the game's own data (abilities, moves, items, traits), plus hand-written terms
let glossSec = 'all', glossQ = '';
const RATING_TEXT = { str: 'Smarter move choices and send-outs in battle, and calling dodges.', trn: 'How many levels training weeks give.', bnd: 'Friendship, critical hits and hanging on at 1 HP; also opens Shadow Pokémon hearts faster.', sct: 'Finds better wild Pokémon when exploring.', nrv: 'Holds up under pressure, most of all in big battles.' };
const GLOSS_TERMS = {
  plans: [
    ['Challenge', 'Battle the next Gym Leader for a badge.'],
    ['Train', 'Every Pokémon gains levels; ones far behind the strongest catch up faster.'],
    ['Explore', 'Meet wild Pokémon and try to catch one. Sometimes turns up a held item.'],
    ['Seek', 'Battle a legendary that has appeared, at full strength every time. The damage adds up across weeks, and when it is worn down or its five weeks are up it goes to the trainer who did the most (ties are fought out). Luck swings each attempt hard, and a failed attempt still earns experience.'],
    ['Confront', "Fight a villain team's Grunts, Admins and Boss while they're in the region."],
    ['Purification', "Shadow Pokémon's hearts open during training (most), exploring and gym challenges, and with every battle. One whose heart opens fully is purified at the end of that week."],
    ['Who decides', 'Every trainer chooses their own week, yours included. As the GM you shape the team around them.'],
    ['Party', "A team's six trainers in one League, who travel together: three title chasers, two companions and one apprentice. Set in the offseason, after the draft."],
    ['Title chaser', 'A party member who challenges gyms, enters the Midseason Tournament and the League, and scores Team Cup points. If all three of a party complete the badge circuit, the team gets a bonus.'],
    ['Companion', "A party member who supports the others through a role instead of chasing badges. Keeps a full team and fights when villains turn up. Scores no Team Cup points."],
    ['Apprentice', "A party's developing trainer: road battles only, and faster growth from watching the chasers. Two seasons at most, then they must chase, support or move on."],
    ['Aptitude', 'How good a trainer is at each companion role, from 5 to 99. Every trainer has their own; their class makes almost no difference.'],
    ['Ambition', "What a trainer wants: the title, a support role, or either. You see it plainly for your own trainers. For everyone else it's a scout's read that can be wrong, until they show their hand by asking for a chaser spot or stepping back. Ambitions drift with age and results."],
    ['Patience', "How many more seasons a trainer who wants the title will stay in a support role. When it runs out they ask for a chaser spot or their release. Each party makes at most one such request an offseason."],
    ['Request', "A trainer asking for a title-chaser spot (promote them, promise a spot for the season after next, trade them, or release them), or an older chaser asking to step back into support."],
    ['Promise', "Binding. A trainer promised a chaser spot who doesn't have one when that season's party is confirmed leaves, and every other trainer of yours trusts you less."],
    ['Trust', "How much one of your trainers believes in you. It rises when they do well, get the role they want or a promise is kept, and falls when they're kept in a role they don't want, advice goes badly or a promise to a teammate is broken. It sets how likely they are to listen in a sit-down."],
    ['Sit-down', "One conversation per party each season, before week 1, with a chaser or the apprentice. You pick a message: rebuild around your ace, widen your coverage, slow down and train, or go for it. They may not listen; you see the odds first."],
    ['Trade', "In the offseason you can trade a trainer one for one with another team, or for an extra pick in the next draft. Other teams only offer what they think is fair."],
    ['Sparring', 'The weakest chaser in a party and its apprentice level up a little faster from travelling with stronger trainers.'],
    ['Party leader', "One of the three chasers, chosen by the party itself from last season's results, time with the team and personality. Their personality sets the party's mood, which makes role bonuses a little stronger or weaker, and they sometimes bend your gym-loss policy."],
    ['Gym-loss policy', "The one in-season call that is yours, set before week 1. Patient: after any gym loss the other chasers wait a week and help prepare the rematch. Balanced: they wait after a first loss at a gym only. Push on: nobody waits. A rematch the party stayed for gets a small edge."],
    ['Fly', "A late-season party perk, never needed to progress. Once any chaser has six badges and someone in the party has a strong Flying-type, nobody has to wait after a gym loss, rematches still get their edge, and the party is likelier to reach a mass outbreak."],
    ['Walking partner', "A trainer's highest-level Pokémon walks beside them out of its ball, and its friendship grows faster."],
    ['Travel rivals', "The two chasers in a party who are closest in ability. Both level up a little faster. If one finishes three or more badges ahead, the rivalry sours the next season: no bonus, and the party's mood dips."],
    ['Assists', 'Badges and titles won by the chasers a companion or apprentice travelled with. Companions score no Team Cup points; assists are their record.'],
    ['Independent group', 'Two or three independents who travel together for a season and level up a little faster. They have no roles.'],
    ...ROLE_KEYS.map(k => [PARTY_ROLES[k].name + ' (role)', PARTY_ROLES[k].text]),
  ],
  battle: [
    ['Same-type attack', "A move that matches one of the user's types hits 50% harder."],
    ['Super effective', 'Hits a type weak to it for double damage (×4 against two weaknesses); "not very effective" is half.'],
    ['Critical hit', 'A hit that does 50% more. Bond and some moves and abilities make them likelier.'],
    ['Solid hit', 'Now and then (6%) a move lands cleanly and does 30% more.'],
    ['Glancing blow', 'Sometimes (8%) a move only grazes and does 40% less.'],
    ['Momentum', "A Pokémon that lands two hits in a row hits 5% harder, three or more 10% harder, until it's interrupted."],
    ['Miss', 'Moves rarely miss: their accuracy is pulled halfway toward 100% (an 80% move hits 90%).'],
    ['Dodge', "A faster Pokémon can dodge an attack (up to 12%), more often with a sharp trainer's Strategy."],
    ['Priority', 'Moves like Quick Attack go before anything else that turn; otherwise the faster Pokémon moves first.'],
    ['Stat stages', 'Boosts and drops from −6 to +6; each stage up is +50% (so +2 is double), each stage down shrinks the stat.'],
    ['Utility move', 'A move that does no damage in the games. Here it does light damage and keeps its effect. Boosting or healing works once per battle.'],
    ['Flinch', 'A Pokémon hit first by a flinching move may lose its turn.'],
    ['Burn', 'Loses a little HP each turn, and its physical attacks do half damage.'],
    ['Paralysis', "Speed is halved, and a quarter of the time it can't move."],
    ['Poison', 'Loses 1/8 of its HP each turn. Bad poison starts smaller and gets worse every turn.'],
    ['Sleep', "Can't move for 1–3 turns."],
    ['Harsh sunlight', 'Fire moves ×1.25, Water moves ×0.75. Powers Chlorophyll and Solar Power.'],
    ['Rain', 'Water moves ×1.25, Fire moves ×0.75. Powers Swift Swim and Rain Dish.'],
    ['Sandstorm', "Chips HP each turn from anything that isn't Rock, Ground or Steel; Rock types gain Sp. Def."],
    ['Snow', 'Ice types gain Defense. Powers Slush Rush and Ice Body.'],
    ['Gym weather', "Each gym has weather that suits its type (a Fire gym is sunny)."],
    ['Hazards', 'Stealth Rock and Spikes hurt every Pokémon the other side sends in afterwards.'],
    ['Mega Evolution', 'League battles only. A Pokémon holding a Mega Stone Mega Evolves when it comes out: new types and much higher stats.'],
    ['Battle Bond', 'A long-time partner at max friendship can bond with its trainer and transform after its first knockout in League battles. If it falls, the team falters.'],
    ['Hyper Mode', 'A Shadow Pokémon sometimes ignores orders and skips its turn.'],
    ['Stalemate', 'If nobody loses HP for 12 turns in a row, the battle is decided on remaining HP.'],
  ],
  mons: [
    ['IVs', "A Pokémon's hidden potential in each stat, graded from Poor to Perfect."],
    ['Nature', 'Raises one stat by 10% and lowers another, and gives a temperament: a small effect off the field (see Temperaments).'],
    ['Temperament', 'What a nature does off the field: nerves on the big stage, faster learning, sulking after a trade and more. Each one is listed under Temperaments.'],
    ['Friendship', 'Grows with time on a team. High friendship helps in battle and is needed for Battle Bond.'],
    ['Form', 'Recent results make a Pokémon run hot (On fire, Hot) or cold (Cold, Slumping), which nudges its strength.'],
    ['Hidden ability', 'The rarer third ability slot. 25% of Pokémon have it, 50% of shinies, alphas and Deltas.'],
    ['Alpha', 'A bigger, stronger wild Pokémon: outstanding IVs and already on a hot streak.'],
    ['Shiny (✦)', 'A rare wild Pokémon with perfect IVs that arrives on fire.'],
    ['Radiant (✧)', "Rarer than a shiny. It wears its species' shiny colors, always has at least Good IVs, and has an ability its species never gets that's stronger in battle than any it does. The ability stays through evolution."],
    ['Delta (Δ)', 'A rare Pokémon with an unusual second type and outstanding IVs.'],
    ['Shadow', "A Pokémon closed off by Cipher. Snagged from Cipher, or very rarely found in the wild (about as rare as a shiny). Hits harder but can go into Hyper Mode, and can't level until purified."],
    ['Purified', 'A former Shadow Pokémon whose heart opened. It gets its stored levels back at once.'],
    ['Lucky (★)', 'Came in a trade with boosted IVs; levels 10% faster.'],
    ['Pokérus', 'A harmless virus that makes a Pokémon level 25% faster for four weeks, then leaves it immune. It spreads.'],
    ['Legendary / Mythical', "One-of-a-kind Pokémon. The great legendaries appear through story events; others roam the region or come with storms, and more will get events of their own."],
    ['Roaming legendary', "Raikou, Entei, Suicune, Latias or Latios moving between towns for 7–9 weeks. Challengers exploring on the way to its town (or the next one) may find it among their wild Pokémon and catch it like any other."],
    ['Legendary storm', "Four weeks of weather over the whole region, brought by Articuno (blizzard), Moltres (heat wave), Zapdos (electric storm), Thundurus (thunderstorm), Tornadus (gale) or Landorus (who calms the skies after Tornadus or Thundurus). It powers up one type for everyone, and when it passes the legendary chooses the challenger who won the most battles in it, whatever their type."],
    ['Legendary partner', "A legendary or mythical Pokémon stays with a trainer for 3–5 seasons, then moves on in the offseason. It waits in the League where it was first found, keeping its lifetime record, and the next trainer to find or be given it gets that same Pokémon at their own level. It never goes back to a trainer it has already been with. Baby legendaries count from their catch. Ultra Beasts and Paradox Pokémon aren't included."],
    ['Baby legendary / Rare find', 'Pokémon like Cosmog or Meltan that grow into legendaries. Only one exists in the world at a time.'],
    ['Paradox', "Ancient and Future Pokémon. The Champion's team adds one to its ranch each season, and the League gives one when a trainer leaves a team for the Elite Four. They aren't one of a kind: two trainers can have the same one."],
    ['Banlist', "Each offseason, after League moves, the teams with challengers in a League vote on banning five Pokémon drawn at random from the season's top 20 performers (by knockouts and wins per battle, Gym Leaders, the Elite Four and the Champion included; at most two legendaries on the ballot). Half the vote comes from the teams and half from the League's trainers, who vote against Pokémon that beat them, that their team is weak to or that their rival uses (never ones on their own team). Each votes Allow or a ban of one to three seasons; over 50% of the weighted vote bans it, for the longest length that still has over 50%. Up to five new bans a season, so a League holds at most 15 at a time. Bans cover the Pokémon's whole evolution path and apply to everyone in that League, including Gym Leaders, the Elite Four and the Champion, who get replacements. Bans aren't reviewed: each runs its full length, then lifts. A team's banned Pokémon wait in its ranch, legendaries included: a teammate in another League can take one, and it goes back to its trainer once it's allowed. A season a banned legendary can't be used anywhere on the team doesn't count toward its time with its trainer. Can be turned off in Advanced options when creating a league."],
    ['Team ranch', "Every team keeps a ranch. The active ranch holds Pokémon the team can hand to its trainers in any League: the Champion's reward and farewell gifts land there, and when a team's trainer retires, the team keeps one of their Pokémon. The rest go to the retired ranch, on display for good. The roster of each of the team's trainers who wins the title goes to the historical ranch. Each offseason, after the Champion's reward, each challenger can receive one, registered on top of the usual three in its first season. Each challenger can also rest one Pokémon there after a season: it sits out the next season and comes back with better IVs. A Pokémon nobody takes in three offseasons goes on display in the retired ranch (six for Paradox Pokémon; a season spent resting doesn't count), and legendaries only go to a ranch when they're banned in their trainer's League. When simming, extras that can't be registered are passed on to the active ranch for a teammate instead of released."],
    ['Ultra Beast', 'Comes through an Ultra Wormhole. One chance to catch it.'],
    ['Wildcard', "A specialist's one strong Pokémon outside their type, kept for coverage."],
  ],
  league: [
    ['Badge circuit', 'The eight gyms challengers work through each season. Eight badges qualify a trainer for the League.'],
    ['Elite Four', 'Four battles in a row at the League. One loss ends the run.'],
    ['Champion', 'Beat the Champion to take the title. The title only changes hands in battle.'],
    ['Interim Champion', 'Won the title and lost it again in the same League, so it doesn\'t count as a full title.'],
    ['Elite Four title shot', "If no challenger reaches the Champion, the best unbeaten Elite Four member gets a title match."],
    ['Team Cup', 'The season-long team standings: badges, League wins, titles and posts earn points.'],
    ['World Championship', 'With several Leagues, their Champions meet after the season.'],
    ['Triple Crown', 'Champion of three different Leagues across a career (it replaced the Grand Slam). Former Champions chase it: other teams move them toward Leagues they haven\'t won, a dethroned one returns to the circuit in an unwon League when there\'s room, and a trainer with titles in 2+ Leagues gets 3 extra seasons before age can retire them.'],
    ['Midseason Tournament', 'After week 12, every challenger in every League meets in one single-elimination bracket (Gym Leaders, the Elite Four and Champions sit it out). The strongest get any byes. The winner chooses an alpha of any Pokémon that isn\'t one of a kind or a Paradox Pokémon. Each season it\'s played under one special rule, announced after week 8: Inverse Battle, Legendaries banned, Flat levels, Trick Room, Items off, Bring 3, Scalemons, Flipped, 1v1 or Underdog Cup.'],
    ['Hall of Fame', 'Retired Champions.'],
    ['Hall of Shame', "Records nobody wants: worst win rates, longest losing streaks and the like."],
    ['Meta', 'The five best-performing species of the season. Gyms and new prospects adapt to counter them.'],
    ['Rival', 'Two challengers who keep meeting in close road battles.'],
    ['Nemesis', 'Someone a trainer has lost to five times or more without a win.'],
    ['Crossroads', 'After 10 seasons without finishing the circuit, a trainer may retire or reinvent themselves with a new class.'],
    ['Gym Leader comeback', 'A leader with 6–8 outstanding seasons in a row may return to the circuit, sharper, with five guaranteed seasons.'],
    ['Legacy trainer', 'The child of a decorated retiree, entering the draft with their parent\'s type.'],
    ['Famous trainer', 'Characters from the games, anime and optional packs, who keep their own type and signature Pokémon.'],
    ['Season awards', Object.values(AWARDS).map(a => a.name).join(', ') + '.'],
  ],
};
const GLOSS_SECS = [['all', 'All'], ['abilities', 'Abilities'], ['moves', 'Moves'], ['items', 'Items'], ['traits', 'Trainer traits'], ['tempers', 'Temperaments'], ['ratings', 'Ratings'], ['plans', 'What trainers do'], ['battle', 'Battle terms'], ['mons', 'Pokémon terms'], ['league', 'League & careers']];
let glossCache = null;
function glossEntries() {
  if (glossCache) return glossCache;
  const out = { abilities: [], moves: [], items: [], traits: [], ratings: [], tempers: [] };
  const holders = {}; for (const [sp, A] of Object.entries(SPECIES_AB)) for (const k of ['0', '1', 'H']) if (A[k]) (holders[A[k]] = holders[A[k]] || []).push(sp);
  for (const [a, d] of Object.entries(ABILITIES).sort((x, y) => x[0].localeCompare(y[0]))) { const h = (holders[a] || []).filter(sp => SP[sp] && !SP[sp].legend); const eg = (h.length ? h : holders[a] || []).slice(0, 4); out.abilities.push({ n: a, d, x: eg.length ? 'e.g. ' + eg.join(', ') : '' }); }
  for (const mv of Object.values(MOVES).sort((x, y) => x.name.localeCompare(y.name))) out.moves.push({ n: mv.name, d: moveLine(mv, null), chip: chip(mv.type), x: [mv.sig && SIG_MOVES[mv.name] ? 'Signature of ' + SIG_MOVES[mv.name].join(', ') : '', mv.tier >= 3 ? 'learned from Lv 40' : mv.tier === 2 ? 'learned from Lv 22' : ''].filter(Boolean).join(' · ') });
  for (const [k, it] of Object.entries(ITEMS).sort((x, y) => x[1].name.localeCompare(y[1].name))) out.items.push({ n: it.name, d: it.desc, x: it.tier === 3 ? 'Rare' : it.tier === 2 ? 'Uncommon' : 'Common' });
  for (const t of Object.values(TRAITS)) out.traits.push({ n: t.name, d: t.text });
  for (const [n, x] of Object.entries(TEMPER)) out.tempers.push({ n: `${n} · ${x.name}`, d: x.d, x: natureText(n) });
  for (const k of RK) out.ratings.push({ n: RNAME[k], d: RATING_TEXT[k] });
  for (const [sec, list] of Object.entries(GLOSS_TERMS)) out[sec] = list.map(([n, d]) => ({ n, d }));
  return glossCache = out;
}
function glossResults() {
  const all = glossEntries(), q = fold(glossQ.trim());
  const secs = GLOSS_SECS.filter(([k]) => k !== 'all' && (glossSec === 'all' || glossSec === k));
  let total = 0;
  const html = secs.map(([k, label]) => {
    const rows = all[k].filter(e => !q || fold(e.n + ' ' + e.d.replace(/<[^>]+>/g, '') + ' ' + (e.x || '')).includes(q));
    total += rows.length; if (!rows.length) return '';
    const shown = glossSec === 'all' && !q ? rows.slice(0, 6) : rows;
    return `<section class="gl-sec"><div class="gl-h"><h3>${label}</h3><span class="muted small">${rows.length}</span></div>
      <dl class="gl">${shown.map(e => `<div class="gl-row"><dt>${esc(e.n)}${e.chip ? ' ' + e.chip : ''}</dt><dd>${e.d}${e.x ? ` <span class="muted small">· ${esc(e.x)}</span>` : ''}</dd></div>`).join('')}</dl>
      ${shown.length < rows.length ? `<button class="link" data-act="glosssec" data-v="${k}">All ${rows.length} ${label.toLowerCase()} ›</button>` : ''}</section>`;
  }).join('');
  return total ? html : `<p class="muted">Nothing matches “${esc(glossQ.trim())}”.</p>`;
}
function glossaryBody() {
  return `<div class="mh"><h2>Glossary</h2><button class="btn icon" data-act="close" aria-label="Close">×</button></div>
  ${searchBox('glosssearch', glossQ, 'Search the glossary', 'Search abilities, moves, items, terms…')}
  <div class="filters">${GLOSS_SECS.map(([k, l]) => `<button class="pill${glossSec === k ? ' on' : ''}" data-act="glosssec" data-v="${k}">${l}</button>`).join('')}</div>
  <div id="glossres">${glossResults()}</div>`;
}

// ---------- Midseason Tournament (v188) ----------
let tourneyRel = null, tourneyText = '';
const tourneyNow = () => S.tourney && S.tourney.season === S.season ? S.tourney : null;
// v193: this season's tournament rule, as a line for the office card and the tournament page
function tourneyRuleLine(k) {
  if (k === undefined) { if (!tourneyRuleKnown()) return `This season's special rule is announced after week ${TOURNEY_RULE_WEEK}.`; k = tourneyRule(); }
  const R = k && TOURNEY_RULES[k];
  return R ? `<b>Rule: ${R.name}.</b> ${R.desc}` : (k === null && tourneyRuleCfg() === 'none' ? 'Standard battles: no special rule in this league.' : 'Standard battles.');
}
const tourneyPaused = () => !!(S && S.phase === 'season' && S.tourneyPause && tourneyNow());
// how far a trainer got: { text, ok } from the bracket
function tourneyRun(T0, id) {
  if (T0.winner === id) return { text: 'Won the tournament', ok: true };
  for (const rd of T0.rounds) for (const m of rd.matches) if (!m.bye && (m.a === id || m.b === id) && m.w !== id) {
    const o = m.a === id ? m.b : m.a;
    return { text: rd.name === 'Final' ? `Runner-up: lost the final to ${tname(o)}` : `Lost in the ${rd.name.replace(/^Round/, 'round')} to ${tname(o)}`, ok: rd.name === 'Final' || rd.name === 'Semifinals' };
  }
  return { text: '—', ok: false };
}
function tourneyMine(T0) {
  const mine = userTrainers().filter(t => T0.entrants.includes(t.id));
  if (!mine.length) return `<section class="panel"><div class="ph"><h3>Your trainers</h3></div><p class="muted">None of your trainers were challengers this season, so none entered.</p></section>`;
  return `<section class="panel"><div class="ph"><h3>Your trainers</h3><span class="muted">${mine.length} entered</span></div><div class="scroll"><table class="tbl"><thead><tr><th>Trainer</th><th>Result</th></tr></thead><tbody>
    ${mine.map(t => { const r = tourneyRun(T0, t.id); return `<tr class="you-row"><td>${tname(t.id)}${lgTag(t)}</td><td class="${r.ok ? 'good' : ''}">${r.text}</td></tr>`; }).join('')}</tbody></table></div></section>`;
}
// the player's trainer won: choose the alpha
function tourneyOfferPanel(t) {
  const o = S.tourneyOffer; if (!o || o.id !== t.id || !tourneyNow()) return '';
  const full = t.team.length >= 6, sug = aiTourneyChoice(t);
  return `<div class="tourneybox"><span class="tn-k">Midseason Tournament</span> <b>${t.name} won the tournament!</b> The prize is an alpha of any Pokémon you choose (no legendaries, mythicals, Ultra Beasts, Paradox Pokémon or one-of-a-kind finds), at Lv ${o.lvl} with outstanding IVs, already on a hot streak.
    <div class="tn-pick"><label class="cf-field"><span class="eyebrow">Pokémon</span><input id="tp-sp" class="cf-in" list="tp-list" value="${esc(tourneyText)}" placeholder="Start typing any Pokémon" autocomplete="off"></label>
      <button class="btn primary" data-act="tourneypick" data-id="${t.id}">Give it to ${esc(t.name)}</button><button class="btn" data-act="tourneypick" data-id="${t.id}" data-sp="${esc(sug)}">Take ${esc(sug)}</button></div>
    <datalist id="tp-list">${tourneySpecies().map(n => `<option value="${esc(n)}">`).join('')}</datalist>
    ${full ? `<h3 class="rel-h">The team is full. Choose who makes room:</h3><div class="release">${t.team.map(m => `<button class="rel${tourneyRel === m.uid ? ' on' : ''}" data-act="tourneyrel" data-u="${m.uid}">${m.sp} <span class="muted">Lv ${Math.floor(m.lvl)}</span></button>`).join('')}</div>` : ''}
    <div class="small muted">Evolved forms are allowed. ${esc(sug)} is ${t.name}'s own pick. If you don't choose, they take their own pick when the League starts.</div></div>`;
}
// office card: the bracket's status this season
function tourneyCard() {
  if (S.phase !== 'season' || (!featOn('tourney') && !tourneyNow())) return '';
  const T0 = tourneyNow();
  if (!T0) { const n = tourneyField().length, left = TOURNEY_WEEK - S.week;
    return `<section class="panel"><div class="ph"><h3>Midseason Tournament</h3><span class="muted">after week ${TOURNEY_WEEK}</span></div><p class="small">${n} challengers${nLeagues() > 1 ? ' from every League' : ''} will meet in a single-elimination bracket in ${left} week${left === 1 ? '' : 's'}. The winner chooses an alpha of almost any Pokémon.</p><p class="small">${tourneyRuleLine()}</p><button class="link" data-act="nav" data-v="tourney">The tournament ›</button></section>`; }
  const w = T(T0.winner);
  return `<section class="panel"><div class="ph"><h3>Midseason Tournament</h3><span class="muted">Season ${T0.season}</span></div><p class="small">${tname(T0.winner)} won it, beating ${T0.runner ? tname(T0.runner) : 'the field'} in the final.${T0.reward && T0.reward.sp && T0.reward.sp !== '—' ? ` Prize: an alpha <b>${T0.reward.sp}</b>.` : w && w.user ? ' <b class="good">Choose their alpha prize.</b>' : ''}</p><button class="link" data-act="nav" data-v="tourney">The bracket ›</button></section>`;
}
function tourneyMatch(m, ri, mi) {
  if (m.bye) return `<div class="tn-match"><span class="won">${tname(m.a)}${lgTag(T(m.a))}</span><span class="tn-vs">bye</span><span></span><span></span></div>`;
  const side = id => `<span class="${id === m.w ? 'won' : 'lost'}${id === m.b ? ' tn-b' : ''}">${id === m.w ? '✓ ' : ''}${tname(id)}${lgTag(T(id))}</span>`;
  return `<div class="tn-match">${side(m.a)}<span class="tn-vs">vs</span>${side(m.b)}<span>${m.log ? `<button class="btn small" data-act="watchtourney" data-r="${ri}" data-m="${mi}">Watch</button>` : ''}</span></div>`;
}
function viewTourney() {
  const T0 = tourneyNow(), hist = (S.tourneyHist || []).slice().reverse();
  let top;
  if (!T0) {
    const n = S.phase === 'season' ? tourneyField().length : 0;
    top = `<section class="panel callout"><div class="eyebrow">Season ${S.phase === 'season' ? S.season : S.season + 1}</div><h1>Midseason Tournament</h1>
      <p>${featOn('tourney') ? `After week ${TOURNEY_WEEK}, every challenger${nLeagues() > 1 ? ' in every League' : ''} meets in one single-elimination bracket. Gym Leaders, the Elite Four and Champions sit it out. The strongest trainers are seeded so they get any byes, and one loss ends a run.` : 'The Midseason Tournament is switched off in this league.'}</p>
      ${featOn('tourney') ? `<p>The winner chooses an alpha of any Pokémon that isn't one of a kind or a Paradox Pokémon, at the level of their strongest Pokémon. Battles count toward records like any other. Replays are kept for the semifinals and the final.</p>
      <p>${S.phase === 'season' ? tourneyRuleLine() : tourneyRuleCfg() === 'rotate' ? `Each season's tournament is played under one special rule, drawn at random (never the same as the last one) and announced after week ${TOURNEY_RULE_WEEK}: ${Object.values(TOURNEY_RULES).map(r => r.name).join(', ')}.` : tourneyRuleLine(tourneyRuleCfg() === 'none' ? null : tourneyRuleCfg())}</p>
      <p class="muted">${S.phase === 'season' ? (S.week < TOURNEY_WEEK ? `It's played after week ${TOURNEY_WEEK}, in ${TOURNEY_WEEK - S.week} week${TOURNEY_WEEK - S.week === 1 ? '' : 's'}. ${n} challengers would enter today.` : '') : `Next season's tournament is played after week ${TOURNEY_WEEK}.`}</p>` : ''}</section>`;
  } else {
    const r = T0.reward, w = T(T0.winner);
    const paused = tourneyPaused(), contBtn = paused ? `<div class="confirm-row"><button class="btn primary" data-act="tourneydone">Continue to week ${S.week + 1}</button><span class="muted small">The season picks up again from here.</span></div>` : '';
    top = `<section class="panel callout"><div class="eyebrow">Season ${T0.season} · ${paused ? `after week ${TOURNEY_WEEK} · ` : ''}${T0.size} challengers${nLeagues() > 1 ? ' · every League' : ''}</div><h1>Midseason Tournament</h1>
      <p class="small">${tourneyRuleLine(T0.rule || null)}</p>
      <p><b>${tname(T0.winner)} won it</b>, beating ${T0.runner ? tname(T0.runner) : 'the field'} in the final.${T0.semis.length ? ` Semifinalists: ${T0.semis.map(id => tname(id)).join(', ')}.` : ''}</p>
      ${r && r.sp && r.sp !== '—' ? `<p>Prize: an alpha <b>${r.sp}</b> ${chips(SP[r.sp] ? SP[r.sp].types : [])} at Lv ${r.lvl}.</p>` : ''}${contBtn}</section>
      ${w && w.user && S.tourneyOffer && S.tourneyOffer.id === w.id ? `<section class="panel">${tourneyOfferPanel(w)}</section>` : ''}
      ${tourneyMine(T0)}`;
    const rounds = T0.rounds.map((rd, ri) => ({ rd, ri })).reverse();
    top += rounds.map(({ rd, ri }) => { const real = rd.matches.filter(m => !m.bye).length, byes = rd.matches.length - real;
      return `<section class="panel"><div class="ph"><h3>${rd.name}</h3><span class="muted">${real} battle${real === 1 ? '' : 's'}${byes ? ` · ${byes} bye${byes === 1 ? '' : 's'}` : ''}</span></div>${rd.matches.map((m, mi) => tourneyMatch(m, ri, mi)).join('')}</section>`; }).join('');
  }
  const histHtml = hist.length ? `<section class="panel"><div class="ph"><h2>Past winners</h2><span class="muted">${hist.length} tournament${hist.length === 1 ? '' : 's'}</span></div><div class="scroll"><table class="tbl"><thead><tr><th>Season</th><th>Rule</th><th>Winner</th><th>Runner-up</th><th>Field</th><th>Prize</th></tr></thead><tbody>
    ${hist.map(h => `<tr><td class="num">${h.season}</td><td>${h.rule && TOURNEY_RULES[h.rule] ? TOURNEY_RULES[h.rule].name : '<span class="muted">Standard</span>'}</td><td>${T(h.winner) ? tname(h.winner, h.winnerOrg || null) : esc(h.winnerName)}</td><td>${h.runner && T(h.runner) ? tname(h.runner) : esc(h.runnerName || '—')}</td><td class="num">${h.size}</td><td>${h.sp && h.sp !== '—' ? 'Alpha ' + h.sp : '<span class="muted">—</span>'}</td></tr>`).join('')}</tbody></table></div></section>` : '';
  const end = T0 && tourneyPaused() ? `<section class="panel"><div class="confirm-row"><button class="btn primary" data-act="tourneydone">Continue to week ${S.week + 1}</button><span class="muted small">${S.tourneyOffer ? 'Your champion can still choose their alpha later, from their trainer page, until the League starts.' : 'Back to the office to plan the next week.'}</span></div></section>` : '';
  return top + histHtml + end;
}

// ---------- updates ----------
// newest first; add an entry with every published change.
// Versioning rule (from v179 on): every new version gets the next id, a date AND a timestamp (Eastern Time),
// and all changes made in one working session go into that one version's entry.

// ---------- parties (2.0) ----------
let partySel = null; // the trainer being moved on the party editor
function aptLine(t, n = 3) { const a = aptOf(t); return ROLE_KEYS.slice().sort((x, y) => a[y] - a[x]).slice(0, n).map(k => `${PARTY_ROLES[k].name} <span class="num">${a[k]}</span>`).join(' · '); }
function partyPanel(k, i, edit) {
  return inLeague(i, () => {
    const P = partyOf(k, i);
    const sel = edit && partySel != null ? P.find(t => t.id === partySel) : null;
    const row = t => {
      const s = slotOf(t), me = sel === t;
      const act = !edit ? '' : me ? `<button class="btn small" data-act="psel" data-id="${t.id}">Cancel</button>` : sel ? `<button class="btn small primary" data-act="pswap" data-id="${sel.id}" data-w="${t.id}">Swap with ${sel.name}</button>` : `<button class="btn small" data-act="psel" data-id="${t.id}">Move</button>`;
      const roles = edit && s === 'companion' && !sel ? `<div class="pt-roles">${ROLE_KEYS.map(r => `<button class="rel${t.prole === r ? ' on' : ''}" data-act="prole" data-id="${t.id}" data-k="${r}" title="${esc(PARTY_ROLES[r].text)}">${PARTY_ROLES[r].name} <span class="num muted">${aptOf(t)[r]}</span></button>`).join('')}</div>` : '';
      const note = s === 'companion' ? (t.prole ? `<b>${PARTY_ROLES[t.prole].name}</b> <span class="num">${aptOf(t)[t.prole]}</span> · ${PARTY_ROLES[t.prole].text}` : 'No role yet')
        : s === 'apprentice' ? `Season ${(t.appSeasons || 0) + 1} of ${APPRENTICE_SEASONS} as an apprentice · best support roles: ${aptLine(t, 2)}`
        : s === 'bench' ? `<span class="warn">No place in the party${canApprentice(t) ? '' : ': two seasons as an apprentice are up'}</span>`
        : `Best support roles: ${aptLine(t, 2)}`;
      const extra = (leaderOf(k, i) === t ? ' <span class="tag gold">Leader</span>' : '') + (t.trival && T(t.trival) ? ` <span class="tag" title="${t.trivalSour ? 'The rivalry has soured: no growth bonus, and the party\'s mood suffers' : 'Travel rivals level up a little faster'}">${t.trivalSour ? 'Soured rivalry' : 'Travel rival'}: ${T(t.trival).name}</span>` : '') + (s !== 'chaser' && t.career && t.career.assists ? ` <span class="muted small">Assists: ${t.career.assists} badge${t.career.assists === 1 ? '' : 's'}${t.career.assistTitles ? ', ' + t.career.assistTitles + ' title' + (t.career.assistTitles > 1 ? 's' : '') : ''}</span>` : '');
      return `<div class="pt-row${me ? ' sel' : ''}"><div class="pt-id">${tname(t.id)} ${ovrPill(t)} <span class="muted small">age ${t.age} · POT ${t.pot}</span> <span class="small">${specChips(t)}</span>${extra}</div><div class="pt-act">${act}</div><div class="pt-note small muted">${note}</div>${k === S.userOrg ? ambRow(t) : `<div class="pt-note small muted">${ambText(t)}</div>`}${roles}</div>`;
    };
    const grp = (s, cap, label) => {
      const rows = P.filter(t => slotOf(t) === s), open = cap - rows.length;
      const openRow = open <= 0 ? '' : sel && slotOf(sel) !== s ? `<div class="pt-row open"><span class="muted">Open spot</span><div class="pt-act"><button class="btn small primary" data-act="pswap" data-id="${sel.id}" data-s="${s}">Move ${sel.name} here</button></div></div>` : `<div class="pt-row open"><span class="muted">${open} open spot${open > 1 ? 's' : ''}</span></div>`;
      return `<div class="pt-grp"><div class="eyebrow">${label} · ${rows.length}/${cap}</div>${rows.map(row).join('')}${openRow}</div>`;
    };
    const bench = P.filter(t => slotOf(t) === 'bench');
    const cover = ROLE_KEYS.filter(r => P.some(t => t.slot === 'companion' && t.prole === r)).map(r => PARTY_ROLES[r].name);
    return `<section class="panel"><div class="ph"><h3>${nLeagues() > 1 ? leagueName(i) + ' party' : 'Your party'}</h3><span class="muted">${P.length}/${PARTY_SIZE}${cover.length ? ' · ' + cover.join(' + ') : ''}</span></div>${edit ? partyMoveRow(k, i) : ''}${P.length ? partyLifeRow(k, i) : ''}
      ${P.length ? grp('chaser', PARTY_CHASERS, 'Title chasers') + grp('companion', PARTY_COMPANIONS, 'Companions') + grp('apprentice', PARTY_APPRENTICES, 'Apprentice') + (bench.length ? `<div class="pt-grp"><div class="eyebrow">No place · ${bench.length}</div>${bench.map(row).join('')}</div>` : '') : '<p class="muted">No trainers in this League.</p>'}</section>`;
  });
}
function viewParty() {
  const edit = canEditParty();
  return `<section class="panel callout"><div class="eyebrow">${orgName(S.userOrg)}</div><h2>${nLeagues() > 1 ? 'Parties' : 'Party'}</h2>
    <p>Your trainers in a League travel together as a party of six: three title chasers, two companions and one apprentice. Only chasers take on gyms and the League and score Team Cup points (plus ${PARTY_BONUS} if all three complete the badge circuit). Each companion fills a role that helps the others. The apprentice has road battles and grows from watching, for two seasons at most.</p>
    <p class="muted small">${edit ? "Tap Move on a trainer, then choose who they swap with. The number beside a role is that trainer's aptitude for it." : 'Parties are set in the offseason, after the draft.'}</p></section>
    ${S.nextLeague && S.nextLeague.told && nextRegionName() ? `<section class="panel"><p><b>Coming:</b> the ${nextRegionName()} opens in Season ${S.nextLeague.season}. You'll be able to found a party there.</p></section>` : ''}
    ${Array.from({ length: nLeagues() }, (_, i) => fieldsIn(S.userOrg, i) ? partyPanel(S.userOrg, i, edit) : foundPanel(i)).join('')}`;
}
let sitOpen = null, tradeOpen = null;
function ambRow(t) {
  const pt = patienceText(t), sat = sitUsed(t.org, lgOf(t));
  const btns = (canSit(t) ? `<button class="btn small${sitOpen === t.id ? ' primary' : ''}" data-act="sitopen" data-id="${t.id}">Sit down</button>` : '') + (canTrade() ? `<button class="btn small${tradeOpen === t.id ? ' primary' : ''}" data-act="tradeopen" data-id="${t.id}">Trade</button>` : '');
  const sit = sitOpen === t.id && canSit(t) ? `<div class="pt-life"><div class="small">One sit-down per party each season. ${t.name} takes it on board about <b>${Math.round(sitOdds(t) * 100)}%</b> of the time, going by how much they trust you.</div><div class="pt-roles">${Object.keys(SITS).map(k => `<button class="rel" data-act="sit" data-id="${t.id}" data-k="${k}" title="${esc(SITS[k].text)}">${SITS[k].name}</button>`).join('')}</div></div>` : '';
  const opts = tradeOpen === t.id && canTrade() ? tradeOptions(t) : null;
  const tr = opts ? `<div class="pt-life"><div class="small">What other teams would give for ${t.name}, one for one. A trade can't be undone.</div><div class="release">${opts.map((o, i) => tradeOptRow(t, o, i, 'gmtrade')).join('') || '<span class="muted small">No team is offering anything.</span>'}</div></div>` : '';
  const told = t.sit && t.sit.season === upSeason() ? ` · <span class="${t.sit.ok ? 'good' : 'muted'}">${t.sit.ok ? 'following' : 'ignoring'} "${SITS[t.sit.msg].name}"</span>` : '';
  return `<div class="pt-note small">${AMBS[ambOf(t)].name}${pt ? ` · <b class="${unhappyRole(t) ? 'warn' : ''}">${pt}</b>` : ''} · ${trustWord(t)}${told}</div>${btns ? `<div class="pt-act">${btns}${sat && !canSit(t) && (t.slot === 'chaser' || t.slot === 'apprentice') ? '' : ''}</div>` : ''}${sit}${tr}`;
}
// the leader the party chose, and the one in-season call that is yours: what happens after a gym loss
function partyLifeRow(k, i) {
  const st = partyState(k, i), L = leaderOf(k, i), can = k === S.userOrg && canSetPolicy();
  const mood = partyMood(k, i);
  const pol = Object.keys(POLICIES).map(p => `<button class="rel${st.policy === p ? ' on' : ''}" data-act="ppolicy" data-i="${i}" data-k="${p}" ${can ? '' : 'disabled'} title="${esc(POLICIES[p].text)}">${POLICIES[p].name}</button>`).join('');
  return `<div class="pt-life"><div class="small">${L ? `<b>Leader:</b> ${L.name}${traitOf(L) && TRAITS[traitOf(L)] ? ' (' + TRAITS[traitOf(L)].name + ')' : ''} · party mood ${mood > 0.02 ? '<span class="good">good</span>' : mood < -0.02 ? '<span class="bad">tense</span>' : 'steady'}` : '<span class="muted">The party picks its leader when the season starts.</span>'}${partyHasFly(k, i) ? ' · <span class="tag gold">Fly</span>' : ''}</div>
    <div class="pt-roles"><span class="muted small" style="align-self:center">After a gym loss:</span>${pol}</div>
    <div class="small muted">${POLICIES[st.policy].text}${can ? '' : ' Set before week 1.'}</div></div>`;
}
// move a whole party to a League where you have none, or swap two parties
function partyMoveRow(k, i) {
  if (nLeagues() < 2 || (S.phase !== 'offseason' && S.phase !== 'reassign')) return '';
  const btn = j => { const why = movePartyBlock(k, i, j), swap = fieldsIn(k, j); return `<button class="btn small" data-act="pmove" data-f="${i}" data-t="${j}" ${why ? `disabled title="${esc(why)}"` : ''}>${swap ? `Swap with the ${lgShort(j)} party` : `Move to ${lgShort(j)}`}</button>`; };
  return `<div class="confirm-row" style="margin-top:6px"><span class="muted small">Whole party:</span>${lgRange().filter(j => j !== i).map(btn).join('')}</div>`;
}
let foundPick = {}; // League → ids of your trainers chosen to start a new party there
function foundPanel(i) {
  const k = S.userOrg, why = foundBlock(k, i);
  const head = `<div class="ph"><h3>${leagueName(i)}</h3><span class="muted">No party · ${orgsIn(i).length} team${orgsIn(i).length === 1 ? '' : 's'} here</span></div>`;
  if (why) return `<section class="panel">${head}<p class="muted">${S.phase !== 'offseason' ? 'You have no party in this League. One can be founded in the offseason, before the draft.' : why}</p></section>`;
  const mine = userTrainers().filter(t => t.role === 'challenger').sort((a, b) => lgOf(a) - lgOf(b) || (SLOT_RANK[slotOf(a)] ?? 9) - (SLOT_RANK[slotOf(b)] ?? 9));
  const sel = foundPick[i] = (foundPick[i] || []).filter(id => mine.some(t => t.id === id));
  const row = t => { const on = sel.includes(t.id), block = moveBlock(t, i); return `<div class="pt-row${on ? ' sel' : ''}"><div class="pt-id">${tname(t.id)} ${ovrPill(t)} <span class="muted small">${nLeagues() > 1 ? lgShort(lgOf(t)) + ' · ' : ''}${SLOT_NAMES[slotOf(t)] || ''}</span></div><div class="pt-act">${block ? `<span class="muted small">${block}</span>` : `<button class="btn small${on ? ' primary' : ''}" data-act="fsel" data-i="${i}" data-id="${t.id}" ${!on && sel.length >= NEW_PARTY_MOVES ? 'disabled' : ''}>${on ? 'Going' : 'Send'}</button>`}</div></div>`; };
  return `<section class="panel">${head}
    <p>Found a party here and it's yours for good. Send up to ${NEW_PARTY_MOVES} of your own trainers to start it; the draft fills the rest of both parties. You can found one party every ${EXPAND_COOLDOWN} seasons.</p>
    ${mine.map(row).join('')}
    <div class="confirm-row"><button class="btn primary" data-act="found" data-i="${i}">Found a party in the ${leagueName(i)}</button><span class="muted small">${sel.length ? `${sel.length} trainer${sel.length > 1 ? 's' : ''} going` : 'Nobody chosen: the draft fills all six spots'}</span></div></section>`;
}
function expandNote() {
  const k = S.userOrg; if (!k || S.phase !== 'offseason') return '';
  const can = lgRange().filter(i => !fieldsIn(k, i) && !foundBlock(k, i)); if (!can.length) return '';
  const fresh = S.leagueOpened && S.leagueOpened.season === S.season + 1 && can.includes(S.leagueOpened.i);
  return `<section class="panel callout"><h2>${fresh ? `The ${leagueName(S.leagueOpened.i)} is opening` : 'Room to expand'}</h2><p>You can found a party in the ${can.map(leagueName).join(' or the ')} before the draft. You send up to ${NEW_PARTY_MOVES} of your own trainers and the draft fills the rest. A party is permanent once founded.</p><button class="btn primary" data-act="nav" data-v="party">Go to the Party page</button></section>`;
}
// ---------- god mode ----------
function viewGod() {
  if (!godOn()) return viewOffice();
  const off = S.phase === 'offseason';
  const cell = (k, i) => fieldsIn(k, i) ? `<span class="tag gold">Party · ${partyOf(k, i).length}</span>` : off ? `<button class="btn small" data-act="godparty" data-k="${k}" data-i="${i}">Add party</button>` : '<span class="muted small">—</span>';
  const rows = ORG_KEYS.map(k => `<tr><td>${orgMark(k)} ${ORGS[k].short}${k === S.userOrg ? ' <span class="tag">You</span>' : ''}</td>${lgRange().map(i => `<td>${cell(k, i)}</td>`).join('')}</tr>`).join('');
  const out = ALL_ORG_KEYS.filter(k => !ORG_KEYS.includes(k));
  return `<section class="panel callout"><div class="eyebrow">God mode</div><h2>Shape the world by hand</h2>
    <p>Open a League, give any team a party in any League, or bring a new team into the world. These skip the usual limits.${off ? '' : ' <b>They work in the offseason, before the draft</b>, so the draft can fill the new spots.'}</p>
    <p class="muted small">Editing trainers, roles and rosters directly comes in a later version.</p></section>
  <section class="panel"><div class="ph"><h3>Leagues</h3><span class="muted">${nLeagues()} of ${MAX_LEAGUES} regions open</span></div>
    <p>${lgRange().map(leagueName).join(' · ')}${S.nextLeague ? ` · next opening on its own in Season ${S.nextLeague.season}` : ''}</p>
    <div class="confirm-row"><button class="btn primary" data-act="godleague" ${off && nLeagues() < MAX_LEAGUES ? '' : 'disabled'}>${nLeagues() < MAX_LEAGUES ? `Open the ${nextRegionName()} now` : 'Every region is open'}</button></div></section>
  <section class="panel"><div class="ph"><h3>Parties</h3></div><div class="tblwrap"><table class="tbl"><thead><tr><th>Team</th>${lgRange().map(i => `<th>${lgShort(i)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div></section>
  <section class="panel"><div class="ph"><h3>Add a team</h3><span class="muted">${ORG_KEYS.length} in the world</span></div>
    ${out.length ? `<div class="release">${out.map(k => `<button class="rel" data-act="godteam" data-k="${k}" ${off ? '' : 'disabled'}>${ORGS[k].name}</button>`).join('')}</div><p class="fine">A new team starts with no parties. Give it one above.</p>` : '<p class="muted">Every team is already in the world.</p>'}</section>`;
}
