// ================= HALCYON LEAGUE UI =================
const SAVE_KEY = 'halcyon-league-save-v3';
const TYPE_COLOR = { Bird:'#9C8F8F', Normal:'#A8A77A', Fire:'#EE8130', Water:'#6390F0', Electric:'#F7D02C', Grass:'#7AC74C', Ice:'#96D9D6', Fighting:'#C22E28', Poison:'#A33EA1', Ground:'#E2BF65', Flying:'#A98FF3', Psychic:'#F95587', Bug:'#A6B91A', Rock:'#B6A136', Ghost:'#735797', Dragon:'#6F35FC', Dark:'#705746', Steel:'#B7B7CE', Fairy:'#D685AD' };
// Missingno's level shows as ?? (the real level is used underneath)
const lvShow = m => SP[m.sp] && SP[m.sp].glitch ? '??' : Math.floor(m.lvl);
const DARK_TEXT = new Set(['Normal','Electric','Grass','Ice','Ground','Flying','Bug','Rock','Steel','Fairy','Fire']);
let view = 'office';
let newsFilter = 'all';
let modal = null; // {kind, ...}
let player = null; // battle playback timer
let toastTimer = null;
let setupLoadText = '', setupLoadName = '', setupLoadErr = ''; // the advanced page's Load a save box
let draftRelease = null;
let rejoinRelease = null; // roster trainer to release when bringing back a former trainer // roster trainer chosen to release during the draft
let oldSaveFound = false;
let viewLg = 0; // the League the league-wide pages show

const $ = s => document.querySelector(s);
// Saves are deflated with the browser's own CompressionStream (several Leagues make a big world) and packed
// 15 bits per character, so every character is ordinary text. Without CompressionStream it's plain JSON.
const CAN_DEFLATE = typeof CompressionStream !== 'undefined' && typeof DecompressionStream !== 'undefined';
const DF_TAG = 'DF1:';
function bytesToText(bytes) {
  const out = []; let acc = 0, nb = 0;
  for (let i = 0; i < bytes.length; i++) { acc = (acc << 8) | bytes[i]; nb += 8; while (nb >= 15) { nb -= 15; out.push(String.fromCharCode(((acc >> nb) & 0x7fff) + 32)); } acc &= (1 << nb) - 1; }
  if (nb) out.push(String.fromCharCode(((acc << (15 - nb)) & 0x7fff) + 32));
  return bytes.length + ':' + out.join('');
}
function textToBytes(txt) {
  const i = txt.indexOf(':'), n = +txt.slice(0, i), s = txt.slice(i + 1), bytes = new Uint8Array(n);
  let acc = 0, nb = 0, k = 0;
  for (let j = 0; j < s.length && k < n; j++) { acc = (acc << 15) | (s.charCodeAt(j) - 32); nb += 15; while (nb >= 8 && k < n) { nb -= 8; bytes[k++] = (acc >> nb) & 0xff; } acc &= (1 << nb) - 1; }
  return bytes;
}
async function deflateText(str) { const cs = new Blob([str]).stream().pipeThrough(new CompressionStream('deflate-raw')); return bytesToText(new Uint8Array(await new Response(cs).arrayBuffer())); }
// save codes (copy / download): "PLG1:" + base64 of the deflated JSON, about 4× shorter than plain JSON and only
// letters, digits and + / =, so it survives being pasted through other apps. Plain JSON saves still load.
const CODE_TAG = 'PLG1:';
function bytesToB64(bytes) { let bin = ''; for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(bin); }
function b64ToBytes(b64) { const bin = atob(b64); const out = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i); return out; }
async function saveCode() {
  const raw = JSON.stringify(S);
  if (!CAN_DEFLATE) return raw;
  try { const cs = new Blob([raw]).stream().pipeThrough(new CompressionStream('deflate-raw')); return CODE_TAG + bytesToB64(new Uint8Array(await new Response(cs).arrayBuffer())); } catch (e) { return raw; }
}
async function inflateText(txt) { const ds = new Blob([textToBytes(txt)]).stream().pipeThrough(new DecompressionStream('deflate-raw')); return await new Response(ds).text(); }
let saveSeq = 0;
function save() {
  if (!S) return;
  const raw = JSON.stringify(S), seq = ++saveSeq;
  const put = v => { try { localStorage.setItem(SAVE_KEY, v); } catch (e) { if (!save.warned) { save.warned = true; setTimeout(() => toast("This browser couldn't store the save. Use Download save file in the menu to keep it."), 50); } } };
  if (!CAN_DEFLATE) return put(raw);
  deflateText(raw).then(z => { if (seq === saveSeq) put(DF_TAG + z); }, () => { if (seq === saveSeq) put(raw); });
}
function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw && raw.startsWith(DF_TAG)) return { packed: raw.slice(DF_TAG.length) };
    if (raw) { const v = JSON.parse(raw); if (v && v.version === 3) return v; }
    if (localStorage.getItem('halcyon-league-save-v1')) oldSaveFound = true;
  } catch (e) {}
  return null;
}

// ---------- small renderers ----------
const chip = ty => !ty ? `<span class="ty mixed">Mixed</span>` : `<span class="ty" style="--tc:${TYPE_COLOR[ty]};--tt:${DARK_TEXT.has(ty) ? '#1a1a1a' : '#fff'}">${ty}</span>`;
const chips = types => types.map(chip).join('');
const orgMark = (k, big) => k ? `<span class="org${big ? ' big' : ''}" style="--oc:${ORGS[k].color}" title="${ORGS[k].name} · mascot ${ORGS[k].mascot}">${ORGS[k].mark}</span>` : `<span class="org indie${big ? ' big' : ''}" title="Independent">–</span>`;
const orgLabel = k => `<span class="orgl">${orgMark(k)}<span>${k ? ORGS[k].name : 'Independent'}</span></span>`;
// asOrg: show the team the trainer represented at that moment (history rows), not their current team; null = no team
const tname = (id, asOrg) => { const t = T(id); if (!t) return '—'; const mk = asOrg !== undefined ? asOrg : t.org || (t.role === 'champion' && t.champOrg) || null; return `<button class="tlink${t.user ? ' you' : ''}" data-act="profile" data-id="${id}">${mk ? orgMark(mk) : ''}${dn(t)}${t.famous ? '<span class="star" title="Famous trainer">★</span>' : ''}</button>`; };
const babyTag = s => s.baby ? ` <span class="tag legend">${s.label}</span>` : s.ub ? ' <span class="tag ub">Ultra Beast</span>' : '';
// "into Cosmoem at Lv 43, then Solgaleo or Lunala at Lv 53"
function babyChain(sp) { const out = []; let s = sp; while (s.evos) { out.push(`${s.evos.map(e => e.to).join(' or ')} at Lv ${s.evos[0].lvl}`); s = SP[s.evos[0].to]; } return 'into ' + out.join(', then '); }
// Lucky Pokémon and Pokérus
const condTags = m => `${m.shadow ? ` <span class="tag shadow" title="Shadow Pokémon: hits 15% harder but sometimes ignores orders (Hyper Mode). It can't level up until purified (heart ${Math.round(100 - m.shadow.heart)}% open, +${Math.round(m.shadow.stored)} levels stored).">Shadow</span>` : m.purified ? ' <span class="tag purified" title="A purified Shadow Pokémon">Purified</span>' : ''}${m.bond && T(m.bond) && T(m.bond).team.includes(m) && BOND_ROLES.includes(T(m.bond).role) ? ` <span class="tag bond" title="Battle Bond with ${esc(T(m.bond).name)}: in League battles, its first knockout turns it into ${esc(bondName(T(m.bond), m))} (+35% attack, +8% speed)">Battle Bond</span>` : ''}${m.lucky ? ' <span class="tag lucky" title="Lucky Pokémon: arrived in a trade with boosted IVs, and levels 10% faster">★ Lucky</span>' : ''}${m.pkrs > 0 ? ` <span class="tag pkrs" title="Pokérus: levels 25% faster for ${m.pkrs} more week${m.pkrs === 1 ? '' : 's'}, and it can spread">Pokérus</span>` : m.pkrs < 0 ? ' <span class="tag pkrs-cured" title="Had Pokérus and is now immune">☺</span>' : ''}`;
// ---------- moves ----------
const EFFECT_TEXT = { par: 'paralyze', brn: 'burn', psn: 'poison', tox: 'badly poison', slp: 'put to sleep' };
function moveEffectText(mv) {
  const [k, x, y] = mv.eff.split(':');
  if (k === 'st') return +y >= 75 ? `${y}% to ${EFFECT_TEXT[x]}` : `${y}% chance to ${EFFECT_TEXT[x]}`;
  if (k === 'fl') return `${x}% flinch`;
  if (k === 'drain') return `heals ${x}% of damage dealt`;
  if (k === 'recoil') return `${x}% recoil`;
  if (k === 'self') return `lowers its own ${x.split(',').map(p => STAT_NAME_B[p.split('-')[0]]).join(' and ')}`;
  if (k === 'foe') { const [st] = x.split('-'); return `${y === '100' ? '' : y + '% to '}lower ${STAT_NAME_B[st]}`; }
  if (k === 'up') { const parts = x.split(','); const all = parts.length >= 5; return `${y === '100' ? '' : y + '% to '}raise its own ${all ? 'stats' : parts.map(p => STAT_NAME_B[p.split('+')[0]]).join(' and ')}${parts[0].split('+')[1] > 1 ? ` by ${parts[0].split('+')[1]}` : ''}`; }
  if (k === 'crit') return 'high critical-hit ratio';
  if (k === 'facade') return 'doubles when it has a status condition';
  if (k === 'hex') return 'doubles on a target with a status condition';
  if (k === 'knock') return 'knocks away the target’s item';
  if (k === 'boost') return `+1 ${STAT_NAME_B[x]} (once per battle)`;
  if (k === 'boost2') return `+1 ${x.split(',').map(p => STAT_NAME_B[p]).join(' and ')} (once per battle)`;
  if (k === 'dance') return `+1 to one of ${x.split(',').map(p => STAT_NAME_B[p]).join(' / ')} (once per battle)`;
  if (k === 'heal') return `heals 25% (once per battle)`;
  if (k === 'protect') return 'the next attack on it will probably miss';
  if (k === 'hazard') return x === 'rocks' ? 'hurts each Pokémon the foe sends in (Rock-type damage)' : 'hurts each grounded Pokémon the foe sends in';
  if (k === 'weather') return `summons ${WEATHER_NAME[x].toLowerCase()}`;
  if (k === 'seed') return 'drains the target every turn';
  return '';
}
function moveLine(mv, m) {
  const fl = mv.flags;
  const bits = [`${mv.cat === 'P' ? 'Physical' : 'Special'} ${mv.pw}`, fl.includes('n') ? 'never misses' : `${Math.round(squeezeAcc(mv.acc) * 100)}% accurate`];
  if (m && monTypes(m).includes(mv.type)) bits.push('same type');
  if (mv.sig) bits.push('signature move');
  if (isMulti(mv)) bits.push(fl.includes('m') ? (m && abilityOf(m) === 'Skill Link' ? 'hits 5 times (Skill Link)' : 'hits 2–5 times') : fl.includes('t') ? 'hits 3 times' : 'hits twice');
  if (fl.includes('k')) bits.push('moves first');
  if (fl.includes('c') && !(m && abilityOf(m) === 'Long Reach')) bits.push('contact');
  if (fl.includes('s')) bits.push(m && abilityOf(m) === 'Liquid Voice' && mv.type !== 'Water' ? 'sound, Water-type (Liquid Voice)' : 'sound');
  if (fl.includes('o')) bits.push('ball/bomb');
  if (fl.includes('x')) bits.push('slicing');
  if (fl.includes('r')) bits.push('must recharge');
  const fx = moveEffectText(mv); if (fx) bits.push(fx);
  return bits.join(' · ');
}
// ---------- abilities ----------
const abOn = () => featOn('abilities');
function abilityChip(m) { if (!abOn()) return ''; const a = abilityOf(m); return a ? `<span class="abchip${m.deltaAb === a ? ' delta' : m.abSlot === 'H' && SPECIES_AB[m.sp] && SPECIES_AB[m.sp].H === a ? ' hidden' : ''}" title="${esc(ABILITIES[a])}${m.deltaAb === a ? ' (unusual Delta ability)' : ''}">${m.deltaAb === a ? 'Δ ' : ''}${a}</span> ` : ''; }
function abilityBlock(m) {
  if (!abOn()) return '';
  const a = abilityOf(m), A = SPECIES_AB[m.sp] || {};
  const hid = a && A.H === a && m.abSlot === 'H', dab = a && m.deltaAb === a;
  return `<div class="eyebrow">Ability</div><p>${a ? `<b>${a}</b>${dab ? ' <span class="tag delta" title="An ability its species never has, from its Delta nature">Δ Unusual ability</span>' : hid ? ' <span class="tag gold">Hidden ability</span>' : ''} <span class="muted small">· ${ABILITIES[a]}</span>` : `<span class="muted">No ability yet</span> <span class="muted small">(${[A[0], A[1], A.H].filter(Boolean).join(', ') || '—'} not in the game yet)</span>`}</p>`;
}
const gymWeatherTag = L => abOn() && L && GYM_WEATHER[L.specialty] ? ` <span class="tag weather" title="Battles at this gym take place in this weather">${WEATHER_NAME[GYM_WEATHER[L.specialty]]}</span>` : '';
// ---------- held items ----------
const itemTag = m => itemsOn() && m && m.item && ITEMS[m.item] ? ` <span class="tag item" title="${esc(ITEMS[m.item].desc)}">◆ ${ITEMS[m.item].name}</span>` : '';
const itemChip = k => `<span class="itemchip t${ITEMS[k].tier}" title="${esc(ITEMS[k].desc)}">${ITEMS[k].name}</span>`;
// a gym reward waiting for the player's pick
function itemOfferPanel(t) {
  const o = (t.itemOffers || [])[0]; if (!o || !itemsOn()) return '';
  const adv = offerAdvice(t, o.opts);
  return `<div class="itembox"><span class="it-k">Gym reward</span> For beating ${o.from}, ${t.name} can take one item${t.itemOffers.length > 1 ? ` (${t.itemOffers.length} rewards waiting)` : ''}:
    <div class="it-opts">${o.opts.map((k, i) => { const a = adv[i]; return `<button class="it-opt${a.best ? ' best' : ''}${a.useless ? ' nouse' : ''}" data-act="itemtake" data-id="${t.id}" data-i="${i}">${a.best ? '<span class="it-best">★ Best pick</span>' : ''}<b>${ITEMS[k].name}</b><span class="muted small">${ITEMS[k].desc}</span><span class="it-why">${a.note}</span>${ITEMS[k].tier === 3 ? '<span class="tag gold">Rare</span>' : ITEMS[k].tier === 2 ? '<span class="tag">Uncommon</span>' : ''}</button>`; }).join('')}</div>
    <div class="small muted">It goes in the bag${t.itemsManual ? '' : ' and the team is re-equipped automatically'}. If you don't choose, the best fit is taken when the League starts.</div></div>`;
}
let itemOpen = null; // uid of the Pokémon whose item chooser is open
function itemsPanel(t) {
  if (!itemsOn() || !t.user) return '';
  const bag = t.bag || [], mh = hasMega(t) ? megaHolder(t) : null;
  const rows = t.team.map(m => {
    const open = itemOpen === m.uid;
    let choices = '';
    if (open) {
      // v181: mark the bag item that suits this Pokémon best, and dim the ones it can't use
      const keys = [...new Set(bag)], sc = k => itemScore(m, k, t), cur = m.item ? sc(m.item) : 0;
      const top = keys.filter(k => sc(k) > 0 && sc(k) > cur).sort((a, b) => sc(b) - sc(a))[0];
      const btn = k => { const v = sc(k), best = k === top; return `<button class="rel${best ? ' best' : ''}${v <= 0 ? ' nouse' : ''}" data-act="itemset" data-id="${t.id}" data-u="${m.uid}" data-k="${k}" title="${v <= 0 ? `${m.sp} has no use for this` : best ? `Best item in the bag for ${m.sp}` : esc(ITEMS[k].desc)}">${best ? '★ ' : ''}${ITEMS[k].name}</button>`; };
      choices = `<div class="it-choose">${m.item && cur > 0 && !top && keys.length ? `<span class="good small">★ Already holding its best item</span>` : ''}${keys.sort((a, b) => sc(b) - sc(a)).map(btn).join('')}${m.item ? `<button class="rel" data-act="itemset" data-id="${t.id}" data-u="${m.uid}" data-k="">Take it off</button>` : ''}${!bag.length && !m.item ? '<span class="muted small">The bag is empty.</span>' : ''}</div>`;
    }
    return `<li><span>${m.sp}</span><span>${m.item ? itemChip(m.item) : '<span class="muted small">no item</span>'}${mh === m ? ' <span class="tag mega" title="The Mega Stone takes the item slot this season">Mega Stone</span>' : ''}</span><button class="linkbtn" data-act="itemopen" data-u="${m.uid}" aria-expanded="${open}">${open ? 'Done' : 'Change'}</button>${choices}</li>`;
  }).join('');
  return `<section class="panel"><div class="ph"><h3>Items</h3><span class="muted">Bag ${bag.length}/${BAG_MAX}</span></div>
    <ul class="itemlist">${rows}</ul>
    ${bag.length ? `<div class="eyebrow">In the bag</div><div class="it-bag">${bag.map(itemChip).join(' ')}</div>` : ''}
    ${t.itemsManual && itemSetGap(t) > 1 ? `<p class="it-hint">★ Auto-equip would give your team a better set from what you own.</p>` : ''}
    <div class="confirm-row"><button class="btn small${t.itemsManual && itemSetGap(t) > 1 ? ' primary' : ''}" data-act="itemauto" data-id="${t.id}">Auto-equip</button><span class="muted small">${t.itemsManual ? 'You set these by hand, so they stay put. New items go in the bag; Auto-equip hands control back.' : 'Automatic: before each gym (and each League battle) the best items for that opponent go on, then the everyday set comes back.'}</span></div>
    ${mh ? `<p class="fine">${mh.sp} holds the Mega Stone this season, so its own item sits out League battles.</p>` : ''}</section>`;
}
// a trade another challenger offered this week
function tradePanel(t) {
  const o = S.tradeOffers && S.tradeOffers[t.id]; if (!o) return '';
  const them = T(o.with), give = t.team.find(m => m.uid === o.give), get = them && them.team.find(m => m.uid === o.get);
  if (!them || !give || !get) return '';
  const card = (m, who) => `<div class="tr-mon"><div class="eyebrow">${who}</div><b>${m.sp}</b> ${chips(monTypes(m))}<div class="small muted">Lv ${Math.floor(m.lvl)} · BST ${SP[m.sp].bst}${TRADE_EVOS[m.sp] ? ` · <b>evolves into ${TRADE_EVOS[m.sp]} when traded</b>` : ''}</div></div>`;
  return `<div class="tradebox"><span class="tr-k">Trade offer</span> ${tname(them.id)} ${traitChip(them)} ran into ${t.name} on the road and wants to swap.
    <div class="tr-row">${card(give, `${t.name} gives`)}<span class="tr-arrow">⇄</span>${card(get, `${t.name} gets`)}</div>
    <div class="confirm-row"><button class="btn primary" data-act="tradeans" data-id="${t.id}" data-v="1">Accept the trade</button><button class="btn" data-act="tradeans" data-id="${t.id}" data-v="0">Decline</button><span class="muted small">The offer stands until the end of this week. Each Pokémon has a ${Math.round(LUCKY_CHANCE * 100)}% chance to arrive Lucky.</span></div></div>`;
}
// holds this season's Mega Stone
const megaTag = m => { if (!m || !m.uid) return ''; const t = Object.values(S.trainers).find(x => hasMega(x) && x.mega.uid === m.uid); return t && megaFor(t, m) ? ` <span class="tag mega" title="Can become ${megaFor(t, m).name} in League battles this season">Mega Stone</span>` : ''; };
// the Key Stone and Mega Stone a trainer earned by completing the circuit (this season only)
function megaPanel(t) {
  if (!hasMega(t)) return '';
  const h = megaHolder(t), cands = t.team.filter(m => megaForms(m).length);
  const opts = cands.flatMap(m => MEGA[m.sp].map(f => `<button class="rel${h === m && megaFor(t, m).v === f.v ? ' on' : ''}" data-act="megaset" data-id="${t.id}" data-u="${m.uid}" data-v="${f.v}">${m.sp}${f.v ? ' → ' + f.v : ''} <span class="muted">${f.name} · ${f.types.join('/')} · BST ${SP[m.sp].bst} → ${f.bst}</span></button>`)).join('');
  return `<div class="megabox"><span class="mega-k">Key Stone</span> ${h ? `<b>${h.sp}</b> holds the Mega Stone and can become <b>${megaFor(t, h).name}</b> (${megaFor(t, h).types.join('/')}) once per League battle.` : `${t.name} has a Key Stone, but no Pokémon that can Mega Evolve yet. Catch or evolve one before the League and the stone goes to it.`}
    ${cands.length > 1 || cands.some(m => MEGA[m.sp].length > 1) ? `<div class="small muted" style="margin-top:6px">Give the Mega Stone to:</div><div class="release">${opts}</div>` : ''}
    <div class="small muted">Earned for completing the badge circuit. It's handed back when the next season starts.</div></div>`;
}
// this week's mass outbreak, if there is one
// balance notes shown under a feature's switch (from headless sims)
const FEATURE_NOTES = {
  bond: 'Off: titles change hands more often (about 57% of seasons in sims, vs about 51% with everything on), since veteran Elite Four and Champions lose their bonds.',
  villains: 'Off: titles change hands a little more often (about 55% in sims).',
};
// a great legendary loose in the region
function legendBanner(t) {
  const L = legendState(S.legend); if (S.phase !== 'season' || !L) return '';
  const aff = L.affinity ? ` ${ORGS[L.affinity].name} trainers deal 25% more to it.` : '';
  const worn = Math.min(100, Math.round(L.total / LEGEND_BARS * 100)), rank = legendRank(L).slice(0, 3);
  const blocked = t && legendBlocked(t, L.sp) ? `<p class="warn">${L.sp} has already been with ${t.name} and won't go back to them, so ${t.name} won't seek it.</p>` : t && legendFull(t) ? `<p class="warn">${t.name} already has a legendary partner. They can still battle ${L.sp}, but it will go to someone else.</p>` : '';
  const board = rank.length ? `<ul class="mini">${rank.map((r, i) => `<li><span>${i + 1}. ${T(r.id) ? dn(T(r.id)) : '—'}${t && r.id === t.id ? ' <span class="tag gold">You</span>' : ''}</span><span class="num">${Math.round(r.d * 100)}% · ${r.n} attempt${r.n === 1 ? '' : 's'}</span></li>`).join('')}</ul>` : '<p class="small muted">No one has tried yet.</p>';
  return `<div class="legendbox"><span class="lg-k">Legendary</span> <b>${L.sp}</b> ${chips(SP[L.sp].types)} Lv ${L.lvl} is near <b>${L.town}</b> until week ${L.until}.${aff}
    <div class="lg-bar"><i style="width:${worn}%"></i></div><div class="small muted">${worn}% worn down after ${L.attempts} attempt${L.attempts === 1 ? '' : 's'}. Any challenger can spend a week battling it at full strength; their damage adds to their own total. When it's worn down, or its time is up, it goes to whoever did the most (a tie is fought out). Each attempt's luck swings hard, and even a failed one earns experience.${['Groudon', 'Kyogre'].includes(L.sp) ? ` Its ${L.sp === 'Groudon' ? 'drought' : 'rain'} lasts until it's caught.` : L.sp === 'Eternatus' ? ' Every battle is chaos while it is loose.' : ''}</div>${board}${blocked}</div>`;
}
// v182: does this week's exploring hold anything out of the ordinary? (shiny, alpha, Delta, Shadow, a rare find,
// an Ultra Beast or a roaming legendary). The wild Pokémon are rolled when the planner first shows the trainer, so
// the Explore button can be highlighted before you choose it; the same Pokémon are offered if you do.
const specialOffer = o => !!(o && (o.shiny || o.alpha || o.delta || o.shadow || o.roam || o.wormhole || SP[o.sp].baby || SP[o.sp].legend || SP[o.sp].ub));
function exploreSpecials(t) {
  if (S.phase !== 'season' || !t || !t.user || !['challenger', 'champion'].includes(t.role)) return [];
  if (!S.weekOffers[t.id]) { S.weekOffers[t.id] = wildOffers(t); save(); }
  return S.weekOffers[t.id].filter(specialOffer);
}
const specialWord = o => o.roam ? `${o.sp} (roaming legendary)` : o.legendFind ? `${o.sp} (legendary find)` : o.wormhole ? `${o.sp} (Ultra Wormhole)` : SP[o.sp].baby ? `${o.sp} (rare find)` : [o.shiny && 'shiny', o.alpha && 'alpha', o.delta && 'Delta', o.shadow && 'Shadow'].filter(Boolean).join(' ') + ' ' + o.sp;
// v182: a legendary roaming the region
function roamBanner(t) {
  const R = S.roamer; if (S.phase !== 'season' || !R) return '';
  const trail = R.trail.slice(-5).map(i => TOWNS[i]).join(' → ');
  let mine = '';
  if (t && t.role === 'challenger') {
    const found = (S.weekOffers[t.id] || []).some(o => o.roam);
    if (legendBlocked(t, R.sp)) mine = `<p class="warn">${R.sp} has already been with ${t.name} and won't go back to them.</p>`;
    else if (found) mine = `<p class="good"><b>${t.name} has found ${R.sp}!</b> It's among this week's wild Pokémon. Explore and pick it to catch it before it moves on.</p>`;
    else { const c = roamChance(t); mine = c ? `<p class="small"><b>${t.name}</b> is close enough to find it while exploring: about ${Math.round(c * 100)}% a week.</p>` : `<p class="small muted">${t.name} is heading for ${TOWNS[nearTown(t)]}, too far away to find it this week.</p>`; }
  }
  return `<div class="roambox"><span class="rm-k">Roaming</span> <b>${R.sp}</b> ${chips(SP[R.sp].types)} was last seen near <b>${TOWNS[R.town]}</b>. It leaves the region after week ${R.until}.
    <div class="small muted">Challengers exploring on the way to its town (or the next one over) may find it among their wild Pokémon, and catch it like any other. It moves on most weeks. Seen near: ${trail}.</div>${mine}</div>`;
}
// v182: a legendary's storm over the region
function stormBanner(t) {
  const st = S.phase === 'season' && S.storm; if (!st) return '';
  const s = STORMS[st.sp], rank = stormRank(st).slice(0, 3);
  const fx = stormFx(s).replace(/^./, c => c.toUpperCase());
  const board = rank.length ? `<ul class="mini">${rank.map((r, i) => `<li><span>${i + 1}. ${dn(T(r.id))}${t && r.id === t.id ? ' <span class="tag gold">You</span>' : ''}</span><span class="num">${r.w} win${r.w === 1 ? '' : 's'} · ${r.k} KO${r.k === 1 ? '' : 's'}</span></li>`).join('')}</ul>` : '<p class="small muted">No wins yet.</p>';
  const mw = (st.w || {})[t && t.id] || 0;
  const mine = t && t.role === 'challenger' ? (legendBlocked(t, st.sp) ? `<p class="warn">${st.sp} has already been with ${t.name} and won't choose them again.</p>` : legendFull(t) ? `<p class="warn">${t.name} already has a legendary partner, so ${st.sp} won't choose them. Their wins still count toward the standings.</p>` : `<p class="small"><b>${t.name}</b>: ${mw} win${mw === 1 ? '' : 's'} so far.</p>`) : '';
  return `<div class="stormbox"><span class="sm-k">${s.name}</span> <b>${st.sp}</b> ${chips(SP[st.sp].types)} is over the region until week ${st.until}: ${fx}.
    <div class="small muted">When it passes, ${st.sp} chooses the challenger who won the most battles while it lasted (at least ${STORM_MIN}; knockouts settle a tie), whatever their type. Every battle counts.</div>${board}${mine}</div>`;
}
// v182: the region's recent legendary sightings
function skyPanel() {
  const log = (S.skyLog || []).slice(0, 6); if (!log.length) return '';
  return `<section class="panel"><div class="ph"><h3>Legendary sightings</h3><span class="muted">Roamers and storms</span></div><ul class="mini">${log.map(l => `<li><span>${l.text}</span><span class="num muted">S${l.season} · W${l.week}</span></li>`).join('')}</ul></section>`;
}
// a legendary chose one of your trainers, but the team is full
function legendOfferPanel(t) {
  const o = S.legendOffers && S.legendOffers[t.id]; if (!o) return '';
  return `<div class="tradebox"><span class="tr-k">Legendary</span> ${o.why} <b>${o.sp}</b> ${chips(SP[o.sp].types)} wants to join ${t.name}. The team is full: choose who makes room, or let it go.
    <div class="release">${t.team.map(m => `<button class="rel" data-act="legrel" data-id="${t.id}" data-u="${m.uid}">${m.sp} <span class="muted">Lv ${Math.floor(m.lvl)}</span></button>`).join('')}</div>
    <div class="confirm-row"><button class="btn" data-act="legno" data-id="${t.id}">Let ${o.sp} go</button></div></div>`;
}
// a villain team in the region this season
function villainBanner(t) {
  if (S.phase !== 'season' || !eventActive()) return '';
  const e = S.event, v = eventTeam();
  const steps = e.ladder.map((f, i) => `<span class="vl-step${i < e.stage ? ' done' : i === e.stage ? ' now' : ''}">${i < e.stage ? '✓ ' : ''}${dn(f)}</span>`).join('<span class="vl-arrow">›</span>');
  const mine = t && e.stolen.filter(s => s.from === t.id).map(s => s.sp);
  return `<div class="villain"><span class="vl-k">${v.name}</span> has a hideout near <b>${e.town}</b> until week ${e.until}. Their plan: ${v.plan}.${e.gym != null ? ` <b>${TOWNS[e.gym]} Gym is closed</b> while they hold it.` : ''}${mine && mine.length ? ` <b>They stole ${t.name}'s ${mine.join(', ')}.</b>` : ''}
    <div class="vl-ladder">${steps}</div><div class="small muted">Any challenger can spend a week confronting them. Beating the Boss drives them out${v.scheme === 'theft' ? ' and returns what they stole' : ''}.${v.scheme === 'shadow' ? ' Beat any Cipher trainer to snag one of their Shadow Pokémon.' : ''}</div></div>`;
}
// after beating a Cipher trainer: pick a Shadow Pokémon to snag, or let them go
function snagPanel(t) {
  const o = S.snagOffers && S.snagOffers[t.id]; if (!o) return '';
  const pk = (S.snagPick || {})[t.id] || {}; const full = t.team.length >= 6;
  return `<div class="tradebox snag"><span class="tr-k">Snag</span> ${t.name} beat ${o.from}. Snag one of their Shadow Pokémon, or let them go.
    <div class="offers">${o.mons.map((m, i) => `<button class="offer-card${pk.i === i ? ' on' : ''}" data-act="snagsel" data-id="${t.id}" data-i="${i}"><div class="mon-name">${m.sp} <span class="tag shadow">Shadow</span></div><div>${chips(monTypes(m))}</div><div class="muted">Lv ${Math.floor(m.lvl)} · BST ${SP[m.sp].bst}</div><div class="small">IVs: <b>${ivGrade(m)}</b></div></button>`).join('')}</div>
    ${pk.i != null && full ? `<h3 class="rel-h">The team is full. Replace one:</h3><div class="release">${t.team.map(m => `<button class="rel${pk.release === m.uid ? ' on' : ''}" data-act="snagrel" data-id="${t.id}" data-u="${m.uid}">${m.sp} <span class="muted">Lv ${Math.floor(m.lvl)}</span></button>`).join('')}</div>` : ''}
    <div class="confirm-row"><button class="btn primary" data-act="snaggo" data-id="${t.id}" ${pk.i == null || (full && pk.release == null) ? 'disabled' : ''}>Snag it</button><button class="btn" data-act="snagno" data-id="${t.id}">Let them go</button><span class="muted small">Shadow Pokémon hit 20% harder but sometimes ignore orders, and can't level up until purified. The offer lasts until the end of this week.</span></div></div>`;
}
function outbreakBanner(t) {
  const ob = S.phase === 'season' && activeOutbreak(); if (!ob) return '';
  const sp = SP[ob.sp]; const has = t && t.team.some(m => LINE[m.sp] === LINE[ob.sp]);
  return `<div class="outbreak"><span class="ob-k">Mass outbreak</span> <b>${ob.sp}</b> ${chips(sp.types)} swarming near ${ob.town} this week${SP[ob.sp].rare ? ' <span class="tag">rare</span>' : ''}. ${has ? `${t.name} already has one, so it won't show up for them.` : 'Explore to find one in the open slot, with alphas 4× and shinies 8× as likely.'}</div>`;
}
const traitChip = t => { const k = traitOf(t); return k ? ` <span class="trait" title="${TRAITS[k].text}">${TRAITS[k].name}</span>` : ''; };
function rivalLine(t) {
  const bits = [];
  const r = t.rival && T(t.rival); if (r) { const h = h2hOf(t, r); bits.push(`<span class="rv">Rival</span> ${tname(r.id)} <span class="muted">${h.w}–${h.l}${r.role === 'retired' ? ', retired' : ''}</span>`); }
  const n = t.nemesis && T(t.nemesis); if (n) { const h = h2hOf(t, n); bits.push(`<span class="rv nem">Nemesis</span> ${tname(n.id)} <span class="muted">${h.w}–${h.l}</span>`); }
  return bits.length ? `<div class="rivals-line">${bits.join(' ')}</div>` : '';
}
const specChips = t => t.specialty ? chip(t.specialty) + (t.spec2 ? ' ' + chip(t.spec2) : '') : chip(null);
const specName = t => t.specialty ? t.specialty + (t.spec2 ? ' / ' + t.spec2 : '') : 'Mixed';
const specLine = t => t.specialty ? `${specChips(t)} ${t.spec2 ? 'dual-type specialist' : 'specialist'}` : `${chip(null)} team, no type focus`;
function ovrPill(t) { const o = ovr(t); const c = o >= 70 ? 'hi' : o >= 55 ? 'mid' : 'lo'; return `<span class="ovr ${c}">${o}</span>`; }
function roleLabel(t) {
  const r = roleHere(t);
  return nLeagues() > 1 && ['leader', 'e4', 'champion', 'challenger'].includes(t.role) ? `${r} · ${leagueName(lgOf(t))}` : r;
}
function roleHere(t) {
  if (t.role === 'leader') return inLeague(lgOf(t), () => { const i = S.gyms.findIndex(g => g.leader === t.id); return `${TOWNS[i]} Gym Leader`; });
  if (t.role === 'challenger') return t.org ? `${ORGS[t.org].name} challenger` : 'Independent challenger';
  return { e4: 'Elite Four', champion: t.champOrg ? `Champion · represents ${ORGS[t.champOrg].name}` : 'Champion', retired: 'Retired', exchamp: 'Former Champion', prospect: 'Draft prospect', free: 'Free agent' }[t.role] || t.role;
}
function badgeRow(t, big) { return inLeague(lgOf(t), () => badgeRowHere(t, big)); }
function badgeRowHere(t, big) {
  let h = `<div class="badges${big ? ' big' : ''}" aria-label="${t.badges.length} of 8 badges">`;
  for (let i = 0; i < 8; i++) { const has = t.badges.includes(i); h += `<span class="bdg${has ? ' on' : ''}" title="${TOWNS[i]} Badge${has ? '' : ' (not earned)'}">${big ? TOWNS[i][0] : ''}</span>`; }
  return h + '</div>';
}
function stageText(st) {
  if (st == null) return 'Did not qualify';
  if (st === 5) return 'Won the Championship';
  if (st === 4) return 'Lost in the Championship';
  return `Lost to Elite Four #${st + 1}`;
}
function evoText(s) {
  if (!s.evos) return '';
  if (s.evos.length === 1) return `→ ${s.evos[0].to} at Lv ${s.evos[0].lvl}`;
  return `→ ${s.evos.map(e => e.to).join(' / ')} at Lv ${s.evos[0].lvl}`;
}
const stOf = m => m.st || blankStat();
const ssOf = m => (m.ss && m.ss.season === S.season ? m.ss : blankStat());
const pct = st => st.b ? Math.round(st.w / st.b * 100) + '%' : '—';
const wl = st => `${st.w}–${st.l}`;
const STAT_NAME = { hp: 'HP', atk: 'Attack', def: 'Defense', spa: 'Sp. Atk', spd: 'Sp. Def', spe: 'Speed' };
const STAT_SHORT = { hp: 'HP', atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe' };
function natureText(n) {
  const fx = natureFx(n);
  const up = Object.keys(fx).find(k => fx[k] > 1), down = Object.keys(fx).find(k => fx[k] < 1);
  return up ? `+${STAT_NAME[up]}, −${STAT_NAME[down]}` : 'neutral';
}
function ivGrade(m) { const v = ivTotal(m); return v >= 186 ? 'Perfect' : v >= 165 ? 'Outstanding' : v >= 132 ? 'Great' : v >= 93 ? 'Good' : v >= 60 ? 'Decent' : 'Weak'; }
// physical or special, from the species' spread (the battle picks per opponent when the two are close)
function attackStyle(sp) { const b = bsOf(sp); return Math.abs(b.atk - b.spa) <= 0.1 * Math.max(b.atk, b.spa) ? 'Mixed attacker' : b.atk > b.spa ? 'Physical attacker' : 'Special attacker'; }
const FORM_ICON = { 'On fire': '▲▲', Hot: '▲', Steady: '', Cold: '▼', Slumping: '▼▼' };
function formBadge(m) { const f = formTier(m.form || 0); return FORM_ICON[f] ? `<span class="form ${f === 'Hot' || f === 'On fire' ? 'up' : 'down'}" title="Form: ${f}">${FORM_ICON[f]}</span>` : ''; }
const covChip = ty => `<span class="ty cov" style="--tc:${TYPE_COLOR[ty]}" title="Coverage move">${ty}</span>`;
function monRow(m, tid) {
  ensureMon(m);
  const s = SP[m.sp];
  const evo = s.evos ? `<span class="evo">${evoText(s)}</span>` : '';
  const st = stOf(m);
  return `<button class="mon" data-act="mon" data-t="${tid}" data-u="${m.uid}" title="See ${m.sp}'s stats">
    ${monFace(m.sp, m.shiny, 40)}
    <span class="mon-main"><span class="mon-name">${m.sp}${s.legend ? ' <span class="tag legend">Legendary</span>' : ''}${s.paradox ? ' <span class="tag paradox">Paradox</span>' : ''}${babyTag(s)}${megaTag(m)}${itemTag(m)}${m.shiny ? ' <span class="tag shiny">✦ Shiny</span>' : ''}${m.delta ? ' <span class="tag delta" title="Delta Pokémon: an unusual ' + m.delta + ' type">Δ Delta</span>' : ''}${m.alpha ? ' <span class="tag alpha">Alpha</span>' : ''}${condTags(m)}${formBadge(m)}</span><span class="mon-sub">${chips(monTypes(m))} ${abilityChip(m)}<span class="muted">${m.nat}</span> ${evo}</span></span>
    <span class="mon-rec" title="${m.partners ? 'Lifetime record' : 'Career record on this team'}"><b>${wl(st)}</b><small>${st.ko} KO${m.leg && m.leg.until != null ? ` · until S${m.leg.until}` : ''}</small></span>
    <span class="mon-lv"><small>Lv</small>${lvShow(m)}</span>
  </button>`;
}
function teamDots(t) { return `<div class="tdots">${t.team.map(m => { const s = SP[m.sp], u = monImg(m.sp, m.shiny); return u ? `<img class="pic sm" src="${u}" alt="${esc(m.sp)}" title="${m.sp} Lv ${lvShow(m)}" width="22" height="22">` : `<span class="dot sm" title="${m.sp} Lv ${lvShow(m)}" style="--tc:${TYPE_COLOR[s.types[0]]};--tc2:${TYPE_COLOR[s.types[1] || s.types[0]]}"></span>`; }).join('')}${'<span class="dot sm empty"></span>'.repeat(Math.max(0, 6 - t.team.length))}</div>`; }
function ratingBars(t, prog) {
  return `<div class="ratings">${RK.map(k => {
    const v = t.r[k]; let d = '';
    if (prog) { const x = prog.after[k] - prog.before[k]; if (x) d = `<span class="delta ${x > 0 ? 'up' : 'down'}">${x > 0 ? '+' : ''}${x}</span>`; }
    return `<div class="rt"><span class="rt-k">${RNAME[k]}</span><span class="rt-bar"><i style="width:${v}%"></i></span><span class="rt-v">${v}${d}</span></div>`;
  }).join('')}</div>`;
}
const RHELP = { str: 'Picks counters when sending out Pokémon', trn: 'Extra levels on training weeks', bnd: 'Critical hits and holding on at 1 HP', sct: 'Better and rarer Pokémon when exploring', nrv: 'Performance in League and title battles' };
// older saves' catch news has no category yet, so it's recognized by its wording
const CATCH_WORDS = /caught (a|an) (shiny|alpha|Delta)|caught the Ultra Beast|Ultra Wormhole|outbreak|spotted a .+ while exploring|only one in the league/i;
const isCatchNews = n => n.cat === 'catch' || n.tag === 'catch' || CATCH_WORDS.test(n.text);
function newsList(items) {
  if (!items.length) return '<p class="muted">Nothing yet.</p>';
  return `<ul class="news">${items.map(n => `<li class="n-${n.tag}${n.cat ? ' n-' + n.cat : ''}"><span class="n-when">S${n.season}${n.week ? ' · W' + n.week : ''}${n.lg != null && nLeagues() > 1 ? ' · ' + lgShort(n.lg) : ''}</span><span>${n.text}</span></li>`).join('')}</ul>`;
}
function liveStandings() { return orgStandings(S.phase === 'offseason' || S.phase === 'draft' ? null : null); }

// ---------- header & nav ----------
function header() {
  let status = '', btn = '';
  if (S.phase === 'draft') { status = `Season ${S.season + 1} · ${S.draft && S.draft.founding ? 'Founding draft' : 'Draft'}`; btn = view !== 'draft' ? `<button class="btn primary" data-act="nav" data-v="draft">Go to the draft</button>` : ''; }
  if (S.phase === 'reassign') { status = `Season ${S.season + 1} · League reassignment`; btn = view !== 'reassign' ? `<button class="btn primary" data-act="nav" data-v="reassign">Reassign trainers</button>` : ''; }
  if (S.phase === 'banvote') { status = `Season ${S.season + 1} · Banlist vote`; btn = view !== 'banvote' ? `<button class="btn primary" data-act="nav" data-v="banvote">Vote on the banlist</button>` : ''; }
  if (S.phase === 'reward') { status = `Season ${S.season + 1} · Champion's reward`; btn = view !== 'reward' ? `<button class="btn primary" data-act="nav" data-v="reward">Choose the Paradox Pokémon</button>` : ''; }
  if (S.phase === 'ranch') { status = `Season ${S.season + 1} · Team ranch`; btn = view !== 'ranch' ? `<button class="btn primary" data-act="nav" data-v="ranch">Go to the ranch</button>` : ''; }
  if (S.phase === 'register') { status = `Season ${S.season + 1} · Registration`; btn = view !== 'register' ? `<button class="btn primary" data-act="nav" data-v="register">Register teams</button>` : ''; }
  if (S.phase === 'season' && tourneyPaused()) { status = `Season ${S.season} · Midseason Tournament`; btn = `<button class="btn primary" data-act="tourneydone">Continue to week ${S.week + 1}</button>${view !== 'tourney' ? '<button class="btn ghost" data-act="nav" data-v="tourney">See the tournament</button>' : ''}<button class="btn ghost" data-act="autoseasonask">Sim to League</button>`; }
  else if (S.phase === 'season') { status = `Season ${S.season} · Week ${S.week + 1} of ${SEASON_WEEKS}${tourneyNext() ? ' · Midseason Tournament after this week' : ''}`; btn = `<button class="btn primary" data-act="playweek"${tourneyNext() ? ` title="Plays week ${S.week + 1}, then the Midseason Tournament"` : ''}>${playLabel()}</button><button class="btn ghost" data-act="simweek" title="Your trainers make their own calls this week, ignoring the plans you set">Sim week</button><button class="btn ghost" data-act="autoseasonask">Sim to League</button>`; }
  if (S.phase === 'league') { status = `Season ${S.season} · Pokémon League`; btn = `<button class="btn primary" data-act="runleague">Run the Pokémon League</button>`; }
  if (S.phase === 'offseason') { status = `Season ${S.season} · Offseason`; btn = S.offers.length ? (view !== 'offers' ? `<button class="btn primary" data-act="nav" data-v="offers">League offers (${S.offers.length})</button>` : '') : `<button class="btn primary" data-act="todraft">Start the Season ${S.season + 1} draft</button>`; }
  if (S.phase === 'gifts') { status = `Season ${S.season + 1} · Farewell gifts`; btn = view !== 'gifts' ? `<button class="btn primary" data-act="nav" data-v="gifts">${(S.pendingGifts || []).length ? 'Choose the farewell gift' : 'Farewell gifts'}</button>` : ''; }
  return `<header class="top"><div class="top-in">
    <div class="mark"><span class="mark-ball" aria-hidden="true"></span><div><div class="mark-name">Pokémon League GM <span class="mark-ver">v${UPDATES[0].id}</span></div><div class="mark-sub">${orgMark(S.userOrg)} ${ORGS[S.userOrg].name} <span title="Team mascot">(${ORGS[S.userOrg].mascot})</span> · ${status}</div></div></div>
    <div class="top-act">${btn}<button class="btn ghost" data-act="simmany">Sim seasons</button><button class="btn icon" data-act="menu" aria-label="Save and league options${updatesNew() ? ' (new updates)' : ''}">⋯${updatesNew() ? '<span class="newdot"></span>' : ''}</button></div>
  </div></header>`;
}
// the page menu: four groups, each a dropdown (Office / Trainers / League / Stats), plus the Glossary
let navOpen = null;
function navGroups() {
  const office = [['office', 'Office']];
  if (S.phase === 'draft') office.push(['draft', 'Draft']);
  if (S.phase === 'reassign') office.push(['reassign', 'League reassignment']);
  if (S.phase === 'banvote') office.push(['banvote', 'Banlist vote']);
  if (S.phase === 'register') office.push(['register', 'Registration']);
  if (S.phase === 'reward') office.push(['reward', "Champion's reward"]);
  if (S.phase === 'offseason') { office.push(['recap', 'Season recap']); if (S.offers.length) office.push(['offers', 'League offers']); }
  if (S.phase === 'gifts') office.push(['gifts', 'Farewell gifts']);
  office.push(['ranch', S.phase === 'ranch' ? 'Team ranch (handoffs)' : 'Team ranch']);
  office.push(['news', 'News']);
  const mine = userTrainers().map(t => {
    const plan = S.phase === 'season' ? planFor(t) : null;
    const pip = (plan && plan !== 'auto' ? `<span class="tab-plan">${PLAN_SHORT[plan]}</span>` : '') + (plan && plan !== 'explore' && exploreSpecials(t).length ? '<span class="tab-spot" title="Something special in the wild this week">✦</span>' : '');
    return ['t' + t.id, `${orgMark(t.org)}<span class="ttab-n">${t.cls} ${t.name}</span>${pip}`];
  });
  return [
    { k: 'office', label: 'Office', items: office },
    { k: 'trainers', label: 'Trainers', items: mine.length ? [...mine, null, ['trainers', 'All trainers']] : [['trainers', 'All trainers']] },
    { k: 'league', label: 'League', items: [['circuit', 'Standings'], ['gyms', 'Gyms & Elite'], ...(featOn('tourney') || (S.tourneyHist || []).length ? [['tourney', 'Midseason Tournament']] : []), ['history', 'History']] },
    { k: 'stats', label: 'Stats', items: [['records', 'Records'], ['dex', 'Pokémon'], ['hof', 'Hall of Fame']] },
  ];
}
function nav() {
  const groups = navGroups();
  const grp = g => {
    const here = g.items.some(x => x && x[0] === view), open = navOpen === g.k;
    const cur = here && g.k !== 'trainers' ? g.items.find(x => x && x[0] === view)[1] : null;
    return `<div class="navgrp${open ? ' open' : ''}"><button class="tab navbtn${here ? ' on' : ''}" data-act="navgrp" data-k="${g.k}" aria-haspopup="true" aria-expanded="${open}">${g.label}${cur && cur !== g.label ? `<span class="navcur"> · ${cur}</span>` : ''}<span class="navchev" aria-hidden="true">▾</span></button>
      <div class="navmenu" role="menu">${g.items.map(x => x ? `<button class="navitem${view === x[0] ? ' on' : ''}" role="menuitem" data-act="nav" data-v="${x[0]}">${x[1]}</button>` : '<div class="navsep" role="separator"></div>').join('')}</div></div>`;
  };
  return `<nav class="tabs" aria-label="Pages"><div class="tabs-in">${groups.map(grp).join('')}<button class="tab navgloss" data-act="glossary">Glossary</button><button class="tab navgloss${view === 'updates' ? ' on' : ''}" data-act="updates">Updates${updatesNew() ? '<span class="newdot" aria-label="new"></span>' : ''}</button></div></nav>`;
}
const PLAN_LABEL = { auto: 'Let them decide', challenge: 'Challenge the gym', train: 'Train', explore: 'Explore', raid: 'Confront villains', purify: 'Purify', seek: 'Seek the legendary' };
const PLAN_SHORT = { challenge: 'Gym', train: 'Train', explore: 'Explore' };
// v193: the week whose end brings the Midseason Tournament, and the play button's label for it
const tourneyNext = () => !!(S && S.phase === 'season' && featOn('tourney') && S.week === TOURNEY_WEEK - 1 && !tourneyNow());
const playLabel = () => tourneyNext() ? 'Play Midseason Tournament' : `Play week ${S.week + 1}`;
// "Stop before the Midseason Tournament", shared by Sim to League and Sim multiple seasons (remembered for the visit)
let simStopTourney = false;
const tourneyAhead = () => !!(S && S.phase === 'season' && featOn('tourney') && S.week < TOURNEY_WEEK - 1 && !tourneyNow());
const stopTourneyOpt = () => `<button class="adv-opt${simStopTourney ? ' on' : ''}" data-act="simstoptourney" role="switch" aria-checked="${simStopTourney}"><span class="adv-switch" aria-hidden="true"><i></i></span><span class="adv-text"><b>Stop before the Midseason Tournament</b><span class="muted small">The sim stops at the start of week ${TOURNEY_WEEK}, so you can set your plans and play the week that ends with the tournament yourself.</span></span></button>`;
// sim weeks up to the start of the tournament week
function simToTourney() { let g = 0; while (S.phase === 'season' && S.week < TOURNEY_WEEK - 1 && g++ < 60) simWeek({}, {}); }

// ---------- setup ----------
let setupLeagues = 1, setupTeams = 4, setupRoster = 3, setupPage = 'main', setupAdv = { allFamous: false }, setupBaseOff = false, setupPacks = {}, setupPackOpen = {}, setupOff = {}, setupTourneyRule = 'rotate';
// every section on the Advanced page folds; folded sections show a one-line summary
let setupFold = {};
function foldSec(key, title, sub, summary, body, extra = '') {
  const shut = !!setupFold[key];
  return `<section class="panel fold${shut ? ' shut' : ''}"><div class="ph fold-h"><button class="fold-btn" data-act="advfold" data-k="${key}" aria-expanded="${!shut}"><span class="fold-chev" aria-hidden="true">${shut ? '▸' : '▾'}</span><h2>${title}</h2></button><span class="muted">${shut ? summary : sub}</span></div>${shut ? '' : extra + body}</section>`;
}
const tourneyRuleLabel = k => k === 'rotate' ? 'Rotating' : k === 'none' ? 'Standard' : TOURNEY_RULES[k].name;
function viewAdvanced() {
  const opt = (k, title, desc) => `<button class="adv-opt${setupAdv[k] ? ' on' : ''}" data-act="advtoggle" data-k="${k}" role="switch" aria-checked="${setupAdv[k]}">
    <span class="adv-switch" aria-hidden="true"><i></i></span><span class="adv-text"><b>${title}</b><span class="muted small">${desc}</span></span></button>`;
  const packKeys = Object.keys(FAMOUS_PACKS).filter(k => !FAMOUS_PACKS[k].custom), packsOn = packKeys.filter(k => setupPacks[k]).length, allPacks = packsOn === packKeys.length && !setupBaseOff;
  const famousCount = (setupBaseOff ? 0 : BASE_FAMOUS) + Object.keys(setupPacks).filter(k => setupPacks[k] && FAMOUS_PACKS[k]).reduce((a, k) => a + FAMOUS_PACKS[k].trainers.length, 0);
  const offCount = Object.values(setupOff).filter(Boolean).length;
  const groups = FEATURES.map(g => { const gk = 'feat-' + g.group, shut = !!setupFold[gk], off = g.items.filter(i => setupOff[i[0]]).length;
    return `<div class="feat-group fold${shut ? ' shut' : ''}"><button class="fold-btn small" data-act="advfold" data-k="${gk}" aria-expanded="${!shut}"><span class="fold-chev" aria-hidden="true">${shut ? '▸' : '▾'}</span><span class="eyebrow">${g.group}</span><span class="muted small">${off ? off + ' of ' + g.items.length + ' off' : 'all on'}</span></button>${shut ? '' : `<div class="adv-list">${g.items.map(([k, name, desc]) => `<button class="adv-opt${setupOff[k] ? '' : ' on'}" data-act="feattoggle" data-k="${k}" role="switch" aria-checked="${!setupOff[k]}">
        <span class="adv-switch" aria-hidden="true"><i></i></span><span class="adv-text"><b>${name}</b><span class="muted small">${desc}${FEATURE_NOTES[k] ? ` <i>${FEATURE_NOTES[k]}</i>` : ''}</span></span></button>`).join('')}</div>`}</div>`; }).join('');
  const keys = ['rules', 'features', 'packs', 'mypacks', 'dex', 'images', 'load', ...FEATURES.map(g => 'feat-' + g.group)];
  const anyOpen = keys.some(k => !setupFold[k]);
  return `<main class="wrap setup"><section class="panel callout"><div class="eyebrow">New league</div><h1>Advanced options</h1>
    <p>Optional rules for the new league. These aren't balanced; they're here for fun.</p>
    <div class="confirm-row"><button class="btn small" data-act="advfoldall" data-v="${anyOpen ? 1 : 0}">${anyOpen ? 'Collapse all' : 'Expand all'}</button></div></section>
    ${foldSec('rules', 'Rules', 'Optional league rules', [setupAdv.allFamous ? 'All-famous league on' : '', setupTourneyRule !== 'rotate' ? 'Tournament rule: ' + tourneyRuleLabel(setupTourneyRule) : ''].filter(Boolean).join(' · ') || 'Nothing on', `<div class="adv-list">
      ${opt('allFamous', 'All-famous league', `Every trainer is a famous trainer from the games and anime: Gym Leaders, Elite Four, Champions, rivals and draft prospects. Draws from ${famousCount} famous trainers${famousCount ? '' : ' (none are switched on, so the league will use ordinary trainers)'}; once every one has debuted, they come round again as V2 (Kanto Leader Misty V2), then V3, and so on.`)}
    </div>
    <div class="adv-rule"><div class="eyebrow">Midseason Tournament rule</div><p class="muted small">Rotating (the default) draws one rule each season, never the same twice in a row, and announces it after week 8. Pick one to use it every season, or Standard for plain battles.</p>
      <div class="segs wrap-segs">${['rotate', ...Object.keys(TOURNEY_RULES), 'none'].map(k => `<button class="seg${setupTourneyRule === k ? ' on' : ''}" data-act="settourneyrule" data-v="${k}" aria-pressed="${setupTourneyRule === k}">${tourneyRuleLabel(k)}</button>`).join('')}</div>
      <p class="small">${setupTourneyRule === 'rotate' ? 'One of: ' + Object.values(TOURNEY_RULES).map(r => r.name).join(', ') + '.' : setupTourneyRule === 'none' ? 'Every tournament is played with standard battles.' : TOURNEY_RULES[setupTourneyRule].desc}</p></div>`)}
    ${foldSec('features', 'Game features', 'Everything is on by default. Settings are fixed once the league starts.', offCount ? `${offCount} feature${offCount === 1 ? '' : 's'} off` : 'Everything on', groups + (offCount ? '<div class="confirm-row"><button class="btn small" data-act="featreset">Turn everything back on</button></div>' : ''))}
    ${foldSec('packs', 'Famous trainer packs', "The game's own famous trainers, plus extras from outside Pokémon", `${setupBaseOff ? 'Pokémon trainers off' : 'Pokémon trainers on'} · ${packsOn} of ${packKeys.length} other pack${packKeys.length === 1 ? '' : 's'} on`, `<div class="adv-list">
      <button class="adv-opt${setupBaseOff ? '' : ' on'}" data-act="basetoggle" role="switch" aria-checked="${!setupBaseOff}">
        <span class="adv-switch" aria-hidden="true"><i></i></span><span class="adv-text"><b>Pokémon famous trainers</b><span class="muted small">The game's own ${BASE_FAMOUS} famous trainers: Gym Leaders, Elite Four members, Champions, rivals, professors, villains and anime characters. On by default.</span></span></button>
      <div class="pack-more"><button class="linkbtn" data-act="packlist" data-k="base" aria-expanded="${!!setupPackOpen.base}">${setupPackOpen.base ? 'Hide trainers' : `Show the ${BASE_FAMOUS} trainers`}</button> <span class="muted" aria-hidden="true">·</span> <button class="linkbtn" data-act="cfimport" data-k="base">Copy trainers to my packs</button> <span class="muted" aria-hidden="true">·</span> <button class="linkbtn" data-act="cfexport" data-k="base" aria-expanded="${cfExport === 'base'}">Export</button>${cfExport === 'base' ? exportBox('base') : ''}
        ${setupPackOpen.base ? `<div class="pack-names">${FAMOUS.filter(f => !f.pack).map(f => `<span class="tag">${f.name} · ${f.spec || 'Mixed'}${f.spec2 ? '/' + f.spec2 : ''}</span>`).join(' ')}</div>` : ''}</div>
      ${Object.entries(FAMOUS_PACKS).filter(([, p]) => !p.custom).map(([k, p]) => `<button class="adv-opt${setupPacks[k] ? ' on' : ''}" data-act="packtoggle" data-k="${k}" role="switch" aria-checked="${!!setupPacks[k]}">
        <span class="adv-switch" aria-hidden="true"><i></i></span><span class="adv-text"><b>${p.name}</b><span class="muted small">Adds ${p.trainers.length} famous trainers. ${p.desc}</span></span></button>
        <div class="pack-more"><button class="linkbtn" data-act="packlist" data-k="${k}" aria-expanded="${!!setupPackOpen[k]}">${setupPackOpen[k] ? 'Hide trainers' : `Show the ${p.trainers.length} trainers`}</button> <span class="muted" aria-hidden="true">·</span> <button class="linkbtn" data-act="cfimport" data-k="${k}">Copy trainers to my packs</button> <span class="muted" aria-hidden="true">·</span> <button class="linkbtn" data-act="cfexport" data-k="${k}" aria-expanded="${cfExport === k}">Export</button>${cfExport === k ? exportBox(k) : ''}
        ${setupPackOpen[k] ? `<div class="pack-names">${p.trainers.map(f => `<span class="tag">${f.name} · ${f.spec}${f.spec2 ? '/' + f.spec2 : ''}</span>`).join(' ')}</div>` : ''}</div>`).join('')}
    </div>`, `<div class="confirm-row"><button class="btn small" data-act="packall" data-v="${allPacks ? 0 : 1}">${allPacks ? 'Turn all packs off' : 'Turn on all packs'}</button><span class="muted small">${packsOn + (setupBaseOff ? 0 : 1)} of ${packKeys.length + 1} on · ${famousCount} famous trainers in all, counting your own packs</span></div>`)}
    ${myPacksSection()}
    ${dexSection()}
    ${foldSec('images', 'Images', 'Your own Pokémon pictures and trainer portraits, kept in this browser', imgSummary(), imagesBody())}
    ${foldSec('load', 'Load a save', 'Pick up a league you exported earlier', 'Pick up a league you exported earlier', `
      <p class="muted small">Choose a save file from the menu's <b>Download save file</b>, or paste the text from <b>Export save</b>. Loading replaces the league on this device.</p>
      <div class="loadsave"><label class="btn" for="setupfile">Choose a save file</label><input id="setupfile" type="file" accept=".json,.txt,application/json,text/plain" class="sr">
        <span class="muted small" id="setupfilename">${setupLoadName ? esc(setupLoadName) : 'No file chosen'}</span></div>
      <label class="fine" for="setupload">Or paste a save:</label><textarea id="setupload" class="box" rows="4" spellcheck="false">${esc(setupLoadText)}</textarea>
      ${setupLoadErr ? `<p class="warn">${setupLoadErr}</p>` : ''}
      <div class="confirm-row"><button class="btn primary" data-act="setuploadgo">Load this save</button></div>`)}
    <div class="confirm-row"><button class="btn primary" data-act="setuppage" data-v="main">Back to league setup</button></div></main>`;
}
// v176: My trainer packs — the pack editor (a setup page, reached from the My trainer packs section of Advanced options)
const cfBlank = (pack = cfPack) => ({ name: '', cls: '', g: 'm', age: 20, spec: '', spec2: '', trait: '', lead: '', second: ['', '', '', '', '', ''], pack });
let cfPack = null, cfDraft = cfBlank(null), cfEdit = null, cfErrs = [], cfMsg = '', cfDelArm = false, cfNewPackErr = '', cfNewPackName = '';
function cfRead() {
  if (!$('#cf-name')) return;
  const v = id => ($('#' + id) || {}).value || '';
  cfDraft = { name: v('cf-name'), cls: v('cf-cls'), g: v('cf-g'), age: v('cf-age'), spec: v('cf-spec'), spec2: v('cf-spec2'), trait: v('cf-trait'), lead: v('cf-lead'), second: [...document.querySelectorAll('.cf-second')].map(x => x.value), pack: v('cf-pack') || cfPack };
}
function cfFrom(f, pack) { const second = [].concat(f.team[1] || []); while (second.length < 6) second.push(''); return { name: f.name, cls: f.cls, g: f.g, age: f.age, spec: f.spec || '', spec2: f.spec2 || '', trait: f.trait || '', lead: [].concat(f.team[0]).join(' / '), second, pack }; }
function cfOpen(key) { cfPack = key; cfDraft = cfBlank(key); cfEdit = null; cfErrs = []; cfMsg = ''; cfDelArm = false; setupPage = 'custom'; }
// ---- export and import of trainer packs (v176) ----
let cfExport = null; // the pack whose export box is open: a custom pack key, a built-in key ('base', 'mk'...), or '__all'
function exportPacksFor(key) {
  if (key === '__all') return customLib;
  const c = customPack(key); if (c) return [c];
  const b = builtinSource(key); return b ? [b] : [];
}
const packFileName = key => `pokemon-league-gm-${(key === '__all' ? 'my-packs' : (exportPacksFor(key)[0] || {}).name || 'pack').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.json`;
function exportBox(key) {
  const packs = exportPacksFor(key); if (!packs.length) return '';
  const n = packs.reduce((a, p) => a + p.trainers.length, 0);
  return `<div class="cf-export"><p class="muted small">${key === '__all' ? `All ${packs.length} of your packs` : esc(packs[0].name)}: ${n} trainer${n === 1 ? '' : 's'}. Copy the text or download it as a file, then use <b>Import trainers</b> under My trainer packs to bring it in on another device, or share it with a friend.</p>
    <textarea id="cf-exptext" class="box" rows="5" readonly spellcheck="false">${esc(packExportText(packs))}</textarea>
    <div class="confirm-row"><button class="btn small" data-act="cfexpcopy">Copy text</button>${canSaveFile() ? `<button class="btn small" data-act="cfexpfile" data-k="${esc(key)}">Download file</button>` : ''}<button class="btn small" data-act="cfexpclose">Close</button></div></div>`;
}
async function downloadText(filename, data) {
  if (downloadsNs) {
    try { await downloadsNs.save({ filename, data }); toast('File downloaded.'); }
    catch (e) { const c = e && e.code; if (c === 'declined') return; toast(c === 'rate_limited' ? 'A download is already waiting for your answer.' : "Couldn't download here. Use Copy text instead."); }
    return;
  }
  try { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' })); a.download = filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); toast('File downloaded.'); }
  catch (e) { toast("Couldn't download here. Use Copy text instead."); }
}
// the import page: pick a source, tick the trainers to bring in, pick where they go
let cfImp = null;
const cfImpBlank = (src = 'text') => ({ src, text: '', fileName: '', err: '', groups: null, sel: new Set(), q: '', dest: '__new', newName: '' });
function cfImpLoad() {
  const I = cfImp; I.err = ''; I.groups = null; I.sel = new Set(); I.q = '';
  let packs;
  if (I.src === 'text') { if (!I.text.trim()) { I.err = 'Choose a file or paste a pack first.'; return; } const r = parsePackText(I.text); if (r.err) { I.err = r.err; return; } packs = r.packs; }
  else { const b = builtinSource(I.src); if (!b) return; packs = [b]; }
  I.groups = packs.map(p => ({ name: p.name, rows: prepImport(p.trainers) }));
  // a built-in pack starts with nothing ticked, so it's easy to pick a few; a file starts with everything ticked
  if (I.src === 'text') I.groups.forEach((g, gi) => g.rows.forEach((r, i) => { if (r.entry) I.sel.add(gi + ':' + i); }));
  I.dest = I.groups.length > 1 ? '__each' : '__new';
  I.newName = uniquePackName(I.src === 'text' ? I.groups[0].name : (customLib.length ? 'My picks' : 'My Trainers'));
}
const cfImpMatch = (r, q) => !q || [r.raw.name, r.raw.cls, r.raw.spec, r.raw.spec2].filter(Boolean).join(' ').toLowerCase().includes(q.toLowerCase());
function cfImpList() {
  const I = cfImp; if (!I || !I.groups) return '';
  const teamTxt = t => { const tm = Array.isArray(t.team) ? t.team : []; return [tm[0], tm[1]].filter(x => x != null).map(x => [].concat(x).join(' / ')).join(' + '); };
  const out = I.groups.map((g, gi) => {
    const rows = g.rows.map((r, i) => [r, i]).filter(([r]) => cfImpMatch(r, I.q));
    if (!rows.length) return '';
    return `${I.groups.length > 1 ? `<div class="eyebrow cf-imp-h">${esc(g.name)} · ${g.rows.length}</div>` : ''}${rows.map(([r, i]) => { const k = gi + ':' + i, t = r.raw;
      return `<label class="cf-imp-row${r.entry ? '' : ' off'}"><input type="checkbox" class="cf-imp-chk" data-k="${k}"${I.sel.has(k) ? ' checked' : ''}${r.entry ? '' : ' disabled'}>
        <span class="cf-info"><b>${esc(t.cls || '')} ${esc(t.name || '(no name)')}</b> ${TYPES.includes(t.spec) ? chips([t.spec, t.spec2].filter(x => TYPES.includes(x))) : chip(null)}
        <span class="muted small cf-imp-team">${esc(teamTxt(t))}</span>${r.entry ? '' : `<span class="warn small">${esc(r.errs[0])}</span>`}</span></label>`; }).join('')}`;
  }).join('');
  return out || '<p class="muted">No trainers match that search.</p>';
}
const cfImpCount = () => cfImp && cfImp.groups ? cfImp.sel.size : 0;
const cfImpGoLabel = () => { const n = cfImpCount(); return n ? `Import ${n} trainer${n === 1 ? '' : 's'}` : 'Tick the trainers to import'; };
function viewImport() {
  if (!cfImp) cfImp = cfImpBlank();
  const I = cfImp, srcs = [['text', 'A file or pasted text'], ...BUILTIN_SOURCES().map(([k, n]) => [k, `Built-in: ${n}`])];
  const total = I.groups ? I.groups.reduce((a, g) => a + g.rows.length, 0) : 0, ok = I.groups ? I.groups.reduce((a, g) => a + g.rows.filter(r => r.entry).length, 0) : 0;
  const destOpts = [...(I.groups && I.groups.length > 1 ? [['__each', "Keep the file's packs: one new pack each"]] : []), ['__new', 'A new pack'], ...customLib.map(p => [p.key, `Add to ${p.name} (${p.trainers.length})`])];
  return `<main class="wrap setup">
    <section class="panel callout"><div class="eyebrow">My trainer packs</div><h1>Import trainers</h1>
      <p>Bring in a pack someone exported, or a backup of your own. You can also copy trainers from the game's built-in packs into your own, then change their titles, types or teams.</p>
      <div class="confirm-row"><button class="btn" data-act="setuppage" data-v="advanced">Back to Advanced options</button></div></section>
    <section class="panel"><div class="ph"><h2>1. Where from</h2></div>
      <div class="cf-grid"><label class="cf-field wide"><span class="eyebrow">Source</span><select id="cfimpsrc">${srcs.map(([v, l]) => `<option value="${esc(v)}"${v === I.src ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select></label></div>
      ${I.src === 'text' ? `<div class="loadsave"><label class="btn" for="cfimpfile">Choose a pack file</label><input id="cfimpfile" type="file" accept=".json,.txt,application/json,text/plain" class="sr">
          <span class="muted small">${I.fileName ? esc(I.fileName) : 'No file chosen'}</span></div>
        <label class="fine" for="cfimptext">Or paste a pack:</label><textarea id="cfimptext" class="box" rows="4" spellcheck="false">${esc(I.text)}</textarea>
        <div class="confirm-row"><button class="btn primary" data-act="cfimpread">Read the trainers</button></div>` : ''}
      ${I.err ? `<p class="warn">${esc(I.err)}</p>` : ''}
    </section>
    ${I.groups ? `<section class="panel"><div class="ph"><h2>2. Pick trainers</h2><span class="muted">${ok} of ${total} can be imported</span></div>
      <div class="cf-imp-tools"><div class="search"><span class="search-ic" aria-hidden="true">⌕</span><input id="cfimpq" type="search" placeholder="Search by name, title or type" value="${esc(I.q)}" autocomplete="off" aria-label="Search trainers"></div>
        <button class="btn small" data-act="cfimpall" data-v="1">Tick all shown</button><button class="btn small" data-act="cfimpall" data-v="0">Untick all shown</button></div>
      <div id="cfimplist" class="cf-imp-list">${cfImpList()}</div>
    </section>
    <section class="panel"><div class="ph"><h2>3. Where to</h2></div>
      <div class="cf-grid"><label class="cf-field wide"><span class="eyebrow">Put them in</span><select id="cfimpdest">${destOpts.map(([v, l]) => `<option value="${esc(v)}"${v === I.dest ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select></label>
        ${I.dest === '__new' ? `<label class="cf-field wide"><span class="eyebrow">New pack name</span><input id="cfimpname" class="cf-in" maxlength="40" value="${esc(I.newName)}" autocomplete="off"></label>` : ''}</div>
      <p class="muted small">Trainers you import are yours to edit, like any you made. A trainer can share a name with one of the game's built-in famous trainers; if both packs are on, only one of them appears in a league.</p>
      <div class="confirm-row"><button class="btn primary" id="cfimpgo" data-act="cfimpgo">${cfImpGoLabel()}</button></div>
    </section>` : ''}</main>`;
}
// put the ticked trainers in; packs are capped, so a big import spills into "Name (2)"
function cfImpCommit() {
  const I = cfImp; if (!I || !I.groups) return;
  const nm = $('#cfimpname'); if (nm) I.newName = nm.value;
  const picked = I.groups.map((g, gi) => ({ name: g.name, entries: g.rows.map((r, i) => [r, i]).filter(([r, i]) => r.entry && I.sel.has(gi + ':' + i)).map(([r]) => r.entry) })).filter(g => g.entries.length);
  if (!picked.length) { toast('Tick at least one trainer first.'); return; }
  const list = customLib.map(p => ({ ...p, trainers: p.trainers.slice() })), made = [];
  const newPack = name => { if (list.length >= CUSTOM_PACKS_MAX) return null; let key; do key = newCustomKey(); while (list.some(p => p.key === key)); const p = { key, name: uniquePackName(name, list), trainers: [] }; list.push(p); made.push(p); return p; };
  const fill = (pack, entries) => { let p = pack, n = 0; for (const e of entries) { if (!p) break; if (p.trainers.length >= CUSTOM_MAX) p = newPack(p.name); if (!p) break; p.trainers.push(e); n++; } return n; };
  let added = 0, firstKey = null;
  if (I.dest === '__each') for (const g of picked) { const p = newPack(g.name); if (!firstKey && p) firstKey = p.key; added += fill(p, g.entries); }
  else {
    const all = picked.flatMap(g => g.entries);
    let p = I.dest === '__new' ? newPack(checkPackName(I.newName).name || I.newName || picked[0].name) : list.find(x => x.key === I.dest);
    firstKey = p && p.key; added += fill(p, all);
  }
  const wanted = picked.reduce((a, g) => a + g.entries.length, 0);
  const ok = setCustomLib(list);
  for (const p of made) setupPacks[p.key] = true;
  cfImp = null;
  const msg = `Imported ${added} trainer${added === 1 ? '' : 's'}${made.length > 1 ? ` into ${made.length} new packs` : ''}.${added < wanted ? ` ${wanted - added} didn't fit: you can keep up to ${CUSTOM_PACKS_MAX} packs of ${CUSTOM_MAX} trainers.` : ''}${made.length ? ' New packs are switched on.' : ''}${ok ? '' : " This browser couldn't store them, so they'll be gone when the page closes."}`;
  if (firstKey && made.length <= 1) { cfOpen(firstKey); cfMsg = msg; } else { setupPage = 'advanced'; toast(msg); }
}
// the My trainer packs section of Advanced options
function myPacksSection() {
  const packs = customLib, on = packs.filter(p => setupPacks[p.key]).length;
  const body = `<p class="muted small">Make your own packs of famous trainers. Switch a pack on and its trainers turn up like any other famous trainer: in the draft, as Gym Leaders, Elite Four members and Champions, and in all-famous leagues. Saved in this browser; each new league keeps its own copy.</p>
    ${packs.length ? `<div class="adv-list">${packs.map(p => `<button class="adv-opt${setupPacks[p.key] ? ' on' : ''}" data-act="packtoggle" data-k="${esc(p.key)}" role="switch" aria-checked="${!!setupPacks[p.key]}">
        <span class="adv-switch" aria-hidden="true"><i></i></span><span class="adv-text"><b>${esc(p.name)}</b><span class="muted small">${p.trainers.length ? `${p.trainers.length} trainer${p.trainers.length === 1 ? '' : 's'}` : 'No trainers yet'}</span></span></button>
        <div class="pack-more"><button class="linkbtn" data-act="cfopen" data-k="${esc(p.key)}">${p.trainers.length ? 'Edit this pack' : 'Add trainers'}</button>${p.trainers.length ? ` <span class="muted" aria-hidden="true">·</span> <button class="linkbtn" data-act="cfexport" data-k="${esc(p.key)}" aria-expanded="${cfExport === p.key}">Export</button>` : ''}${cfExport === p.key ? exportBox(p.key) : ''}</div>`).join('')}</div>` : '<p class="muted">No packs yet.</p>'}
    <div class="confirm-row"><button class="btn" data-act="cfimport">Import trainers</button>${packs.some(p => p.trainers.length) && packs.length > 1 ? `<button class="btn" data-act="cfexport" data-k="__all" aria-expanded="${cfExport === '__all'}">Export all my packs</button>` : ''}</div>
    ${cfExport === '__all' ? exportBox('__all') : ''}
    <div class="cf-newpack"><label class="cf-field"><span class="eyebrow">New pack</span><input id="cf-newpack" class="cf-in" maxlength="40" placeholder="e.g. Mario &amp; Donkey Kong" value="${esc(cfNewPackName)}" autocomplete="off"></label><button class="btn" data-act="cfnewpack">Create pack</button></div>
    ${cfNewPackErr ? `<p class="warn">${esc(cfNewPackErr)}</p>` : ''}`;
  return foldSec('mypacks', 'My trainer packs', 'Famous trainers you make yourself', packs.length ? `${packs.length} pack${packs.length === 1 ? '' : 's'} · ${on} on` : 'No packs yet', body);
}
function viewCustom() {
  ensureCustom();
  const pack = customPack(cfPack);
  if (!pack) { setupPage = 'advanced'; return viewAdvanced(); }
  const d = cfDraft, sps = customSpecies(), list = pack.trainers;
  const sel = (id, cur, opts) => `<select id="${id}">${opts.map(([v, l]) => `<option value="${esc(v)}"${String(v) === String(cur) ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select>`;
  const field = (label, html, cls = '') => `<label class="cf-field ${cls}"><span class="eyebrow">${label}</span>${html}</label>`;
  const inp = (id, v, extra = '') => `<input id="${id}" class="cf-in" value="${esc(v)}" autocomplete="off" ${extra}>`;
  const tys = none => [['', none], ...TYPES.map(t => [t, t])];
  const teamTxt = f => f.team.map(x => [].concat(x).join(' / ')).join(' + ');
  const editing = cfEdit != null && list[cfEdit];
  return `<main class="wrap setup">
    <section class="panel callout"><div class="eyebrow">My trainer packs</div><h1>${esc(pack.name)}</h1>
      <p class="muted small">Saved in this browser. Each new league keeps its own copy, so changes here don't affect a league you've already started.</p>
      <div class="cf-newpack">${field('Pack name', inp('cf-packname', pack.name, 'maxlength="40"'))}<button class="btn" data-act="cfrename">Rename</button>
        <button class="adv-opt mini${setupPacks[pack.key] ? ' on' : ''}" data-act="packtoggle" data-k="${esc(pack.key)}" role="switch" aria-checked="${!!setupPacks[pack.key]}"><span class="adv-switch" aria-hidden="true"><i></i></span><span class="adv-text"><b>${setupPacks[pack.key] ? 'Pack on' : 'Pack off'}</b></span></button></div>
      ${cfDelArm ? `<div class="cf-confirm"><b>Delete ${esc(pack.name)}${list.length ? ` and its ${list.length} trainer${list.length === 1 ? '' : 's'}` : ''}?</b> This can't be undone. <div class="confirm-row"><button class="btn danger" data-act="cfdelpackyes">Yes, delete it</button><button class="btn" data-act="cfdelpackno">Keep it</button></div></div>`
        : `<div class="confirm-row"><button class="btn" data-act="setuppage" data-v="advanced">Back to Advanced options</button>${list.length ? `<button class="btn small" data-act="cfexport" data-k="${esc(pack.key)}" aria-expanded="${cfExport === pack.key}">Export pack</button>` : ''}<button class="btn small danger" data-act="cfdelpack">Delete pack</button></div>${cfExport === pack.key ? exportBox(pack.key) : ''}`}</section>
    <section class="panel" id="cf-form"><div class="ph"><h2>${editing ? 'Edit ' + esc(editing.cls + ' ' + editing.name) : 'New trainer'}</h2><span class="muted">Shown in the game as title + name, like Kanto Leader Misty</span></div>
      <div class="cf-grid">
        ${field('Name', inp('cf-name', d.name, 'maxlength="30" placeholder="e.g. Mario"'))}
        ${field('Title', inp('cf-cls', d.cls, 'maxlength="30" placeholder="e.g. Plumber Hero"'))}
        ${field('Gender', sel('cf-g', d.g, [['m', 'Male'], ['f', 'Female'], ['n', 'Neither']]))}
        ${field('Age', `<input id="cf-age" class="cf-in" type="number" min="8" max="90" value="${esc(d.age)}">`)}
        ${field('Main type', sel('cf-spec', d.spec, tys('None (mixed team)')))}
        ${field('Second type', sel('cf-spec2', d.spec2, tys('None')))}
        ${field('Trait', sel('cf-trait', d.trait, [['', 'Random'], ...Object.entries(TRAITS).map(([k, t]) => [k, t.name])]))}
        ${customLib.length > 1 ? field('Pack', sel('cf-pack', d.pack || pack.key, customLib.map(p => [p.key, p.name]))) : ''}
      </div>
      ${d.trait && TRAITS[d.trait] ? `<p class="muted small">${TRAITS[d.trait].name}: ${TRAITS[d.trait].text}</p>` : ''}
      <div class="cf-grid">${field('Lead Pokémon', inp('cf-lead', d.lead, 'list="cf-species" placeholder="Start typing a Pokémon" aria-describedby="cf-leadhint"'), 'wide')}</div>
      <div class="eyebrow">Second Pokémon options</div>
      <p class="muted small" id="cf-leadhint">To give the lead a few options, separate them with a slash: Pikachu / Pichu.</p>
      <p class="muted small">One of these is picked each time they debut. Fill in up to 6, or leave them empty to start with just the lead.</p>
      <div class="cf-grid six">${d.second.map((v, i) => `<input class="cf-in cf-second" value="${esc(v)}" list="cf-species" autocomplete="off" aria-label="Second Pokémon option ${i + 1}">`).join('')}</div>
      <p class="muted small">Like the built-in famous trainers, they start with two Pokémon and build the rest of their team as they go. First-stage Pokémon evolve as they level up. Legendaries, mythicals, Paradox Pokémon and Ultra Beasts aren't allowed, and each Pokémon must come from a different evolution line.</p>
      ${cfErrs.length ? `<ul class="warn cf-errs">${cfErrs.map(e => `<li>${esc(e)}</li>`).join('')}</ul>` : ''}
      ${cfMsg ? `<p class="cf-msg">${esc(cfMsg)}</p>` : ''}
      <div class="confirm-row"><button class="btn primary" data-act="cfsave">${editing ? 'Save changes' : 'Add trainer'}</button><button class="btn" data-act="cfclear">${editing ? 'Cancel editing' : 'Clear form'}</button></div>
      <datalist id="cf-species">${sps.map(n => `<option value="${esc(n)}">`).join('')}</datalist>
    </section>
    <section class="panel"><div class="ph"><h2>Trainers in this pack</h2><span class="muted">${list.length} of ${CUSTOM_MAX}</span></div>
      ${list.length ? `<div class="cf-list">${list.map((f, i) => `<div class="cf-row${i === cfEdit ? ' on' : ''}"><div class="cf-info"><b>${esc(f.cls)} ${esc(f.name)}</b> ${f.spec ? chips([f.spec, f.spec2].filter(Boolean)) : chip(null)}${f.trait && TRAITS[f.trait] ? ` <span class="tag">${TRAITS[f.trait].name}</span>` : ''}
        <div class="muted small">Age ${esc(f.age)} · ${esc(teamTxt(f))}</div></div>
        <div class="cf-acts"><button class="btn small" data-act="cfedit" data-v="${i}">Edit</button><button class="btn small danger" data-act="cfdel" data-v="${i}" aria-label="Delete ${esc(f.cls + ' ' + f.name)}">Delete</button></div></div>`).join('')}</div>` : '<p class="muted">No trainers in this pack yet. Fill in the form above to add the first one.</p>'}
    </section>
    <div class="confirm-row"><button class="btn primary" data-act="setuppage" data-v="advanced">Back to Advanced options</button></div></main>`;
}
// v185: the My Pokédex section of Advanced options, and its editor page
let dxMode = null, dxDraft = null, dxWas = null, dxErrs = [], dxMsg = '', dxPickErr = '', dxPickText = '', dxExport = false, dxImpText = '', dxImpOpen = false, dxImpMsg = '', dxClearArm = false;
function dxBlank(isNew) { return { name: '', types: ['Normal', ''], stats: [50, 50, 50, 50, 50, 50], ab: ['', '', ''], from: '', lvl: 30, rare: false, starter: false, legend: false, isNew }; }
// start changing a game species: your saved change if there is one, else the game's own numbers
function dxLoad(n) {
  dexSnapshot();
  const e = dexLib.edits[n], b = DEX_BASE[n], A = b.ab || {};
  dxDraft = e ? { name: n, types: [e.types[0], e.types[1] || ''], stats: e.stats.slice(), ab: e.ab.slice(), isNew: false }
    : { name: n, types: [b.types[0], b.types[1] || ''], stats: dexBaseStats(n), ab: [A[0] || '', A[1] || '', A.H || ''], isNew: false };
  dxMode = 'edit'; dxWas = null; dxErrs = []; dxMsg = '';
}
function dxRead() {
  if (!dxDraft || !$('#dx-t1')) return;
  const v = id => ($('#' + id) || {}).value || '';
  if (dxDraft.isNew) { dxDraft.name = v('dx-name'); dxDraft.from = v('dx-from').trim(); dxDraft.lvl = Math.round(Number(v('dx-lvl'))); dxDraft.rare = !!($('#dx-rare') || {}).checked; dxDraft.starter = !!($('#dx-starter') || {}).checked; dxDraft.legend = !!($('#dx-legend') || {}).checked; }
  dxDraft.types = [v('dx-t1'), v('dx-t2')];
  dxDraft.stats = [0, 1, 2, 3, 4, 5].map(i => { const x = v('dx-st' + i).trim(); return x === '' ? NaN : Number(x); });
  dxDraft.ab = [0, 1, 2].map(i => v('dx-ab' + i));
}
const dxBst = st => st.reduce((a, x) => a + (Number.isFinite(x) ? x : 0), 0);
// v185: a live note under the stats: legendary-level totals on a Pokémon that isn't a legendary, or a legendary encounter that's too weak
function dxWarnText(d, bst) {
  if (!d) return '';
  const legendSp = !d.isNew && SP[d.name] && (SP[d.name].legend || DEX_BASE[d.name] && LEGENDS.includes(d.name));
  if (d.isNew && d.legend) return bst > DEX_LEGEND_BST ? '' : `Legendary encounters need a base stat total over ${DEX_LEGEND_BST}. This one's is ${bst}.`;
  if (bst <= DEX_LEGEND_BST || legendSp) return '';
  return d.isNew ? `A total of ${bst} is box-legendary strength. Unmarked, this Pokémon ${d.from ? 'is reached by evolving, like any other,' : 'is caught in the wild like any other'} and could unbalance the league.${d.from ? '' : ' Tick Legendary encounter to make it a very rare legendary instead.'}`
    : `A total of ${bst} is box-legendary strength for a Pokémon that's caught in the wild or by evolving. It could unbalance the league.`;
}
// an evolution can't be a legendary, and a legendary is never rare-in-the-wild or a starter
function dxSyncChecks() {
  const from = !!(($('#dx-from') || {}).value || '').trim(), lg = $('#dx-legend');
  const set = (k, off) => { const c = $('#' + k); if (c) { c.disabled = off; c.closest('label').classList.toggle('off', off); } };
  set('dx-legend', from); const legend = !!(lg && lg.checked && !from);
  set('dx-rare', from || legend); set('dx-starter', from || legend);
  dxSyncWarn();
}
function dxSyncWarn() {
  const w = $('#dx-warn'); if (!w || !dxDraft) return;
  const lg = $('#dx-legend'), from = $('#dx-from');
  const d = Object.assign({}, dxDraft, { legend: !!(lg && lg.checked), from: from ? from.value.trim() : dxDraft.from });
  const t = dxWarnText(d, dxBst([0, 1, 2, 3, 4, 5].map(i => Number((($('#dx-st' + i) || {}).value) || 0))));
  w.textContent = t; w.hidden = !t;
}
const dxStatLine = st => st.map((x, i) => `${DEX_STAT_SHORT[i]} ${x}`).join(' · ');
function dxSave() {
  dxRead();
  const d = dxDraft, isNew = d.isNew;
  const e = dexNorm({ name: d.name, types: d.types, stats: d.stats, ab: d.ab, from: isNew ? d.from : '', lvl: d.lvl, rare: isNew && !d.from && d.rare, starter: isNew && !d.from && d.starter, legend: isNew && d.legend });
  dxErrs = checkDexEntry(e, isNew, dxWas);
  if (dxErrs.length) return;
  if (isNew) {
    if (dxWas) {
      lib: { const i = dexLib.added.findIndex(x => x.name === dxWas); if (i < 0) break lib; dexLib.added[i] = e;
        // anything that evolved from the old name follows the rename
        if (dxWas !== e.name) for (const x of dexLib.added) if (x.from === dxWas) x.from = e.name; }
    } else dexLib.added.push(e);
    dxMsg = (dxWas ? `Saved ${e.name}.` : `Added ${e.name}.`) + (e.legend ? ' It will only turn up as a very rare legendary encounter.' : '');
  } else {
    // a change that leaves it exactly as the game has it is no change at all
    const b = DEX_BASE[e.name], A = b.ab || {}, same = e.types.join('/') === b.types.join('/') && e.stats.join() === dexBaseStats(e.name).join() && e.ab.join('|') === [A[0] || '', A[1] || '', A.H || ''].join('|');
    if (same) delete dexLib.edits[e.name]; else dexLib.edits[e.name] = dexStrip(e);
    dxMsg = same ? `${e.name} is back to the game's own.` : `Saved your changes to ${e.name}.`;
  }
  { const warn = dxWarnText(Object.assign({}, d, { legend: !!e.legend, from: e.from || '' }), dxBst(e.stats)); if (warn) dxMsg += ' Warning: ' + warn; }
  // making a change switches the Pokédex on for the next league, like a new pack
  dexLib.on = true;
  if (!saveDexLib()) dxMsg += " This browser couldn't store it, so it'll be gone when the page closes.";
  dxMode = null; dxDraft = null; dxWas = null;
}
function dxDeleteNew(n) {
  const kids = dexLib.added.filter(x => x.from === n).map(x => x.name);
  if (kids.length) { dxMsg = `${kids.join(' and ')} ${kids.length === 1 ? 'evolves' : 'evolve'} from ${n}. Delete ${kids.length === 1 ? 'it' : 'them'} or change what ${kids.length === 1 ? 'it evolves' : 'they evolve'} from first.`; return; }
  dexLib.added = dexLib.added.filter(x => x.name !== n); saveDexLib();
  if (dxWas === n) { dxMode = null; dxDraft = null; dxWas = null; }
  dxMsg = `Deleted ${n}.`;
}
function dexSection() {
  const n = dexCount(dexLib), ne = Object.keys(dexLib.edits).length, nn = dexLib.added.length;
  const body = `<p class="muted small">Change any Pokémon's types, base stats and abilities, or add Pokémon of your own. Saved in this browser. A new league takes a copy of your Pokédex when it's created and keeps it for good, so later changes here never touch a league that's already running.</p>
    <div class="adv-list"><button class="adv-opt${dexLib.on ? ' on' : ''}" data-act="dextoggle" role="switch" aria-checked="${dexLib.on}">
      <span class="adv-switch" aria-hidden="true"><i></i></span><span class="adv-text"><b>Use my Pokédex in the new league</b><span class="muted small">${n ? `${ne} Pokémon changed, ${nn} new Pokémon.` : 'No changes yet: the league uses the game\'s own Pokédex.'}</span></span></button></div>
    <div class="confirm-row"><button class="btn" data-act="setuppage" data-v="dex">${n ? 'Edit my Pokédex' : 'Open the Pokédex editor'}</button></div>`;
  return foldSec('dex', 'My Pokédex', 'Change Pokémon or add your own', n ? `${ne} changed · ${nn} new · ${dexLib.on ? 'on' : 'off'}` : 'No changes yet', body);
}
function viewDexEditor() {
  dexSnapshot();
  const field = (label, html, cls = '') => `<label class="cf-field ${cls}"><span class="eyebrow">${label}</span>${html}</label>`;
  const sel = (id, cur, opts) => `<select id="${id}">${opts.map(([v, l]) => `<option value="${esc(v)}"${String(v) === String(cur) ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select>`;
  const abs = dexAbilities();
  const abOpts = (cur, none) => [['', none]].concat(abs.map(a => [a, a])).concat(cur && !ABILITIES[cur] ? [[cur, cur + ' (not in battles yet)']] : []);
  const editable = Object.keys(DEX_BASE).filter(dexEditable).sort();
  const parents = editable.filter(dexParentOk).concat(dexLib.added.map(x => x.name)).filter(x => !dxDraft || x !== dxWas).sort();
  let form = '';
  if (dxDraft) {
    const d = dxDraft, b = !d.isNew && DEX_BASE[d.name], A = b ? b.ab || {} : null;
    const own = b ? `<p class="muted small">The game's own: ${chips(b.types)} ${dxStatLine(dexBaseStats(d.name))} (total ${dexBaseStats(d.name).reduce((a, x) => a + x, 0)}) · ${[A[0], A[1], A.H && A.H + ' (hidden)'].filter(Boolean).join(', ') || 'no abilities'}</p>` : '';
    form = `<section class="panel" id="dx-form"><div class="ph"><h2>${d.isNew ? (dxWas ? 'Edit ' + esc(dxWas) : 'New Pokémon') : 'Change ' + esc(d.name)}</h2><span class="muted">${d.isNew ? 'A Pokémon of your own' : 'Types, base stats and abilities'}</span></div>
      ${own}
      <div class="cf-grid">
        ${d.isNew ? field('Name', `<input id="dx-name" class="cf-in" maxlength="${DEX_NAME_MAX}" value="${esc(d.name)}" placeholder="e.g. Pyroclaw" autocomplete="off">`) : ''}
        ${field('Main type', sel('dx-t1', d.types[0], TYPES.map(t => [t, t])))}
        ${field('Second type', sel('dx-t2', d.types[1] || '', [['', 'None']].concat(TYPES.map(t => [t, t]))))}
      </div>
      <div class="eyebrow">Base stats <span class="muted" id="dx-bst">· total ${dxBst(d.stats)}</span></div>
      <div class="cf-grid six">${d.stats.map((x, i) => field(DEX_STAT_LABEL[i], `<input id="dx-st${i}" class="cf-in dx-stat" type="number" min="1" max="255" step="1" inputmode="numeric" value="${Number.isFinite(x) ? x : ''}">`)).join('')}</div>
      <p class="muted small">Each stat is 1–255. The total is its overall strength: most fully evolved Pokémon are 450–540, pseudo-legendaries 600 and the strongest legendaries 680.</p>
      <p class="warn" id="dx-warn" role="status"${dxWarnText(d, dxBst(d.stats)) ? '' : ' hidden'}>${esc(dxWarnText(d, dxBst(d.stats)))}</p>
      <div class="cf-grid">
        ${field('Ability', sel('dx-ab0', d.ab[0], abOpts(d.ab[0], 'Choose…')))}
        ${field('Second ability', sel('dx-ab1', d.ab[1], abOpts(d.ab[1], 'None')))}
        ${field('Hidden ability', sel('dx-ab2', d.ab[2], abOpts(d.ab[2], 'None')))}
      </div>
      <p class="muted small">Only abilities that work in battles can be chosen. Each Pokémon of this species gets one of its regular abilities, or now and then its hidden one.</p>
      ${d.isNew ? `<div class="cf-grid">
        ${field('Evolves from', `<input id="dx-from" class="cf-in" list="dx-parents" value="${esc(d.from || '')}" placeholder="Nothing: it's found in the wild" autocomplete="off">`, 'wide')}
        ${field('At level', `<input id="dx-lvl" class="cf-in" type="number" min="2" max="100" step="1" inputmode="numeric" value="${esc(d.lvl)}">`)}
      </div>
      <p class="muted small">Leave "Evolves from" empty for a first-stage Pokémon: it's caught in the wild like any other, and anything you add can evolve from it. Something that evolves from a game Pokémon becomes another branch of that line, picked like Eevee's.</p>
      <div class="adv-list">
        <label class="cf-imp-row${d.from ? ' off' : ''}"><input id="dx-legend" type="checkbox"${d.legend ? ' checked' : ''}${d.from ? ' disabled' : ''}><span><b>Legendary encounter</b><span class="muted small cf-imp-team">Very rare: it can take a hundred seasons or more to first appear. It's never found in the wild. It only appears as a legendary encounter that challengers battle for, like Regigigas or Darkrai. Only for a base stat total over ${DEX_LEGEND_BST}. Nothing can evolve from it, and one trainer holds it at a time, as a partner for a few seasons.</span></span></label>
        <label class="cf-imp-row${d.from || d.legend ? ' off' : ''}"><input id="dx-rare" type="checkbox"${d.rare && !d.legend ? ' checked' : ''}${d.from || d.legend ? ' disabled' : ''}><span><b>Rare in the wild</b><span class="muted small cf-imp-team">Turns up as seldom as Dratini or Larvitar.</span></span></label>
        <label class="cf-imp-row${d.from || d.legend ? ' off' : ''}"><input id="dx-starter" type="checkbox"${d.starter && !d.legend ? ' checked' : ''}${d.from || d.legend ? ' disabled' : ''}><span><b>Starter</b><span class="muted small cf-imp-team">New trainers can start with it, like Bulbasaur or Charmander.</span></span></label>
      </div><datalist id="dx-parents">${parents.map(n => `<option value="${esc(n)}">`).join('')}</datalist>` : ''}
      ${dxErrs.length ? `<ul class="warn cf-errs">${dxErrs.map(e => `<li>${esc(e)}</li>`).join('')}</ul>` : ''}
      <div class="confirm-row"><button class="btn primary" data-act="dxsave">${d.isNew && !dxWas ? 'Add Pokémon' : 'Save changes'}</button>
        ${!d.isNew && dexLib.edits[d.name] ? `<button class="btn" data-act="dxreset" data-k="${esc(d.name)}">Back to the game's own</button>` : ''}
        <button class="btn" data-act="dxcancel">Cancel</button></div>
    </section>`;
  }
  const edits = Object.keys(dexLib.edits).sort(), added = dexLib.added;
  const editRow = n => { const e = dexLib.edits[n], b = DEX_BASE[n], was = dexBaseStats(n).reduce((a, x) => a + x, 0), now = e.stats.reduce((a, x) => a + x, 0);
    return `<div class="cf-row${dxDraft && !dxDraft.isNew && dxDraft.name === n ? ' on' : ''}"><div class="cf-info"><b>${esc(n)}</b> ${chips(e.types)}${e.types.join('/') !== b.types.join('/') ? ` <span class="muted small">was ${b.types.join('/')}</span>` : ''}
      <div class="muted small">${dxStatLine(e.stats)} · total ${now}${now !== was ? ` (was ${was})` : ''}</div><div class="muted small">${[e.ab[0], e.ab[1]].filter(Boolean).map(esc).join(', ')}${e.ab[2] ? ' · hidden: ' + esc(e.ab[2]) : ''}</div></div>
      <div class="cf-acts"><button class="btn small" data-act="dxedit" data-k="${esc(n)}">Edit</button><button class="btn small danger" data-act="dxreset" data-k="${esc(n)}" aria-label="Put ${esc(n)} back to the game's own">Reset</button></div></div>`; };
  const newRow = e => `<div class="cf-row${dxWas === e.name ? ' on' : ''}"><div class="cf-info"><b>${esc(e.name)}</b> ${chips(e.types)} <span class="tag gold">New</span>${e.legend ? ' <span class="tag legend">Legendary encounter</span>' : ''}${e.starter && !e.from ? ' <span class="tag">Starter</span>' : ''}${e.rare && !e.from ? ' <span class="tag">Rare</span>' : ''}
      <div class="muted small">${dxStatLine(e.stats)} · total ${e.stats.reduce((a, x) => a + x, 0)}</div>
      <div class="muted small">${e.from ? `Evolves from ${esc(e.from)} at Lv ${e.lvl}` : e.legend ? 'Very rare legendary encounter' : 'Found in the wild'}${added.some(x => x.from === e.name) ? ` · evolves into ${added.filter(x => x.from === e.name).map(x => `${esc(x.name)} (Lv ${x.lvl})`).join(', ')}` : ''} · ${[e.ab[0], e.ab[1]].filter(Boolean).map(esc).join(', ')}${e.ab[2] ? ' · hidden: ' + esc(e.ab[2]) : ''}</div></div>
      <div class="cf-acts"><button class="btn small" data-act="dxeditnew" data-k="${esc(e.name)}">Edit</button><button class="btn small danger" data-act="dxdelnew" data-k="${esc(e.name)}" aria-label="Delete ${esc(e.name)}">Delete</button></div></div>`;
  return `<main class="wrap setup">
    <section class="panel callout"><div class="eyebrow">Advanced options</div><h1>My Pokédex</h1>
      <p class="muted small">Saved in this browser. A new league takes a copy when it's created and keeps it, so changes here never reach a league that's already running.</p>
      <div class="cf-newpack"><button class="adv-opt mini${dexLib.on ? ' on' : ''}" data-act="dextoggle" role="switch" aria-checked="${dexLib.on}"><span class="adv-switch" aria-hidden="true"><i></i></span><span class="adv-text"><b>${dexLib.on ? 'Used in the new league' : 'Not used in the new league'}</b></span></button></div>
      <div class="confirm-row"><button class="btn" data-act="setuppage" data-v="advanced">Back to Advanced options</button></div></section>
    ${dxMsg ? `<p class="cf-msg">${esc(dxMsg)}</p>` : ''}
    <section class="panel"><div class="ph"><h2>Change a Pokémon</h2><span class="muted">${editable.length} Pokémon, legendaries included</span></div>
      <div class="cf-newpack"><label class="cf-field"><span class="eyebrow">Pokémon</span><input id="dx-pick" class="cf-in" list="dx-species" value="${esc(dxPickText)}" placeholder="Start typing a Pokémon" autocomplete="off"></label><button class="btn" data-act="dxpick">Change it</button>
        <button class="btn" data-act="dxnew">Add a new Pokémon</button></div>
      ${dxPickErr ? `<p class="warn">${esc(dxPickErr)}</p>` : ''}
      <datalist id="dx-species">${editable.map(n => `<option value="${esc(n)}">`).join('')}</datalist></section>
    ${form}
    <section class="panel"><div class="ph"><h2>Your changes</h2><span class="muted">${edits.length} changed · ${added.length} of ${DEX_MAX_NEW} new</span></div>
      ${added.length ? `<div class="eyebrow">New Pokémon</div><div class="cf-list">${added.map(newRow).join('')}</div>` : ''}
      ${edits.length ? `<div class="eyebrow">Changed Pokémon</div><div class="cf-list">${edits.map(editRow).join('')}</div>` : ''}
      ${edits.length || added.length ? '' : '<p class="muted">No changes yet. Pick a Pokémon above to change it, or add one of your own.</p>'}
      <div class="confirm-row">${dexCount(dexLib) ? `<button class="btn small" data-act="dxexport" aria-expanded="${dxExport}">Export my Pokédex</button>` : ''}<button class="btn small" data-act="dximport" aria-expanded="${dxImpOpen}">Import</button>${dexCount(dexLib) ? '<button class="btn small danger" data-act="dxclear">Clear everything</button>' : ''}</div>
      ${dxExport ? `<div class="cf-export"><p class="muted small">Copy this text to keep it or share it. Import it on another device to get the same Pokédex.</p><textarea class="box" rows="4" readonly spellcheck="false">${esc(dexExportText())}</textarea></div>` : ''}
      ${dxImpOpen ? `<div class="cf-export"><label class="fine" for="dx-imp">Paste a Pokédex export. Pokémon in it replace yours of the same name.</label><textarea id="dx-imp" class="box" rows="4" spellcheck="false">${esc(dxImpText)}</textarea>
        <div class="confirm-row"><button class="btn" data-act="dximportgo">Import this Pokédex</button></div>${dxImpMsg ? `<p class="${/^Imported/.test(dxImpMsg) ? 'cf-msg' : 'warn'}">${esc(dxImpMsg)}</p>` : ''}</div>` : ''}
      ${dxClearArm ? `<div class="cf-confirm"><b>Clear all ${dexCount(dexLib)} changes?</b> Every Pokémon goes back to the game's own and your new Pokémon are deleted. Leagues already running keep theirs. <div class="confirm-row"><button class="btn danger" data-act="dxclearyes">Yes, clear everything</button><button class="btn" data-act="dxclearno">Keep them</button></div></div>` : ''}
    </section>
    <div class="confirm-row"><button class="btn primary" data-act="setuppage" data-v="advanced">Back to Advanced options</button></div></main>`;
}
// the editor's buttons; true when the action was one of these
function dexAction(a, el) {
  const k = el.dataset.k;
  switch (a) {
    case 'dextoggle': dxRead(); dexLib.on = !dexLib.on; saveDexLib(); return true;
    case 'dxpick': { const v = (($('#dx-pick') || {}).value || '').trim(); dxPickText = v; dexSnapshot();
      const n = Object.keys(DEX_BASE).find(x => x.toLowerCase() === v.toLowerCase());
      if (!v) dxPickErr = 'Type the name of a Pokémon first.'; else if (!n) dxPickErr = `There's no Pokémon called ${v} in the game.`; else if (!dexEditable(n)) dxPickErr = `${n} can't be changed: its stats are scrambled every battle.`;
      else { dxPickErr = ''; dxMsg = ''; dxLoad(n); }
      return true; }
    case 'dxedit': dxMsg = ''; dxLoad(k); return true;
    case 'dxnew': dxMsg = ''; dxErrs = []; dxDraft = dxBlank(true); dxDraft.ab[0] = dexAbilities()[0]; dxMode = 'new'; dxWas = null; return true;
    case 'dxeditnew': { const e = dexLib.added.find(x => x.name === k); if (!e) return true; dxMsg = ''; dxErrs = []; dxDraft = { name: e.name, types: [e.types[0], e.types[1] || ''], stats: e.stats.slice(), ab: e.ab.slice(), from: e.from || '', lvl: e.lvl || 30, rare: !!e.rare, starter: !!e.starter, legend: !!e.legend, isNew: true }; dxMode = 'new'; dxWas = e.name; return true; }
    case 'dxsave': dxSave(); return true;
    case 'dxcancel': dxMode = null; dxDraft = null; dxWas = null; dxErrs = []; return true;
    case 'dxreset': delete dexLib.edits[k]; saveDexLib(); if (dxDraft && !dxDraft.isNew && dxDraft.name === k) { dxDraft = null; dxMode = null; } dxMsg = `${k} is back to the game's own.`; return true;
    case 'dxdelnew': dxDeleteNew(k); return true;
    case 'dxexport': dxExport = !dxExport; return true;
    case 'dximport': dxImpOpen = !dxImpOpen; dxImpMsg = ''; return true;
    case 'dximportgo': { const r = dexImport(dxImpText); if (r.err) { dxImpMsg = r.err; return true; }
      if (!r.ok) { dxImpMsg = `Nothing could be imported${r.bad ? `: ${r.bad} entr${r.bad === 1 ? 'y was' : 'ies were'} broken or clashed with the game's Pokémon` : ''}.`; return true; }
      dexLib = Object.assign(r.lib, { on: true }); const ok = saveDexLib();
      dxImpMsg = `Imported ${r.ok} Pokémon.${r.bad ? ` ${r.bad} couldn't be: broken, or clashing with the game's Pokémon.` : ''}${ok ? '' : " This browser couldn't store it, so it'll be gone when the page closes."}`; dxImpText = ''; return true; }
    case 'dxclear': dxClearArm = true; return true;
    case 'dxclearno': dxClearArm = false; return true;
    case 'dxclearyes': dexLib = { on: false, edits: {}, added: [] }; saveDexLib(); dxClearArm = false; dxDraft = null; dxMode = null; dxWas = null; dxMsg = 'Cleared. The next league uses the game\'s own Pokédex.'; return true;
  }
  return false;
}
function viewSetup() {
  if (setupPage === 'advanced') return viewAdvanced();
  if (setupPage === 'dex') return viewDexEditor();
  if (setupPage === 'custom') return viewCustom();
  if (setupPage === 'import') return viewImport();
  const offNames = FEATURES.flatMap(g => g.items).filter(i => setupOff[i[0]]).map(i => i[1]);
  const advOn = Object.entries(setupAdv).filter(([, v]) => v).map(([k]) => ({ allFamous: 'All-famous league' }[k])).concat(setupBaseOff ? ['Pokémon famous trainers off'] : []).concat(Object.keys(setupPacks).filter(k => setupPacks[k] && FAMOUS_PACKS[k]).map(k => FAMOUS_PACKS[k].name)).concat(offNames.length ? [`${offNames.length} feature${offNames.length === 1 ? '' : 's'} off`] : []).concat(dexLib.on && dexHas(dexLib) ? ['My Pokédex'] : []).concat(setupTourneyRule !== 'rotate' ? ['Tournament rule: ' + tourneyRuleLabel(setupTourneyRule)] : []);
  const keys = ALL_ORG_KEYS;
  const opt = (act, v, cur, label) => `<button class="seg${cur === v ? ' on' : ''}" data-act="${act}" data-v="${v}" aria-pressed="${cur === v}">${label}</button>`;
  const total = setupTeams * setupRoster;
  return `<main class="wrap setup"><section class="panel callout"><div class="eyebrow">New league</div><h1>Set up your league</h1>
    <p>Teams draft trainers and send them through the badge circuit. Every badge, League win and title earns points toward the Team Cup.</p>
    ${oldSaveFound ? '<p class="warn">Your earlier single-trainer league can\'t carry over to the team format, so this starts a fresh league.</p>' : ''}
    <div class="setup-opts">
      <div><div class="eyebrow">Teams</div><div class="segs setup-segs">${opt('setteams', 4, setupTeams, '4 teams')}${opt('setteams', 8, setupTeams, '8 teams')}</div></div>
      <div><div class="eyebrow">Trainers per team${setupLeagues > 1 ? ', per League' : ''}</div><div class="segs setup-segs three">${[1, 2, 3].map(n => opt('setroster', n, setupRoster, n + (n === 1 ? ' trainer' : ' trainers'))).join('')}</div></div>
      <div><div class="eyebrow">Leagues</div><div class="segs setup-segs three">${[1, 2, 4].map(n => opt('setleagues', n, setupLeagues, n + (n === 1 ? ' League' : ' Leagues'))).join('')}</div></div>
    </div>
    <p class="muted small">${setupLeagues > 1 ? `${setupLeagues === 4 ? 'All four regions (Kanto, Johto, Hoenn and Sinnoh)' : `${setupLeagues} regions drawn at random from Kanto, Johto, Hoenn and Sinnoh`}, each with its own gyms, Elite Four and Champion. In each one: ` : 'The region is drawn at random from Kanto, Johto, Hoenn and Sinnoh. '}${total} team trainers plus ${Math.max(8, 24 - total)} independents on the circuit. The founding draft is ${setupRoster * setupLeagues} round${setupRoster * setupLeagues > 1 ? 's' : ''}.${setupLeagues > 1 ? ' The Team Cup counts every League, and the Champions meet in a World Championship after the Leagues. Teams can move trainers between Leagues in the offseason.' : ''}</p>
    <div class="confirm-row"><button class="btn" data-act="setuppage" data-v="advanced">Advanced options</button>${advOn.length ? advOn.map(x => `<span class="tag gold">${x}</span>`).join(' ') : '<span class="muted small">None selected</span>'}</div></section>
    <div class="ph pick-h"><h2>Choose your team</h2><span class="muted">The other ${setupTeams === 8 ? 'seven' : 'three'} teams are picked at random from the rest.</span></div>
    <div class="org-pick">${keys.map(k => `<button class="org-card" data-act="pickorg" data-k="${k}" style="--oc:${ORGS[k].color}">
      <span class="org big" style="--oc:${ORGS[k].color}">${ORGS[k].mark}</span><span class="org-name">${ORGS[k].name}</span>
      <span class="org-blurb">${ORGS[k].blurb}</span><span class="org-mascot">Mascot: <b>${ORGS[k].mascot}</b></span><span>${ORGS[k].likes.length ? ORGS[k].likes.map(chip).join('') : '<span class="muted small">No type preference</span>'}</span></button>`).join('')}</div></main>`;
}
const ordinal = n => n + (n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th');

// ---------- office (team overview) ----------
function viewOffice() {
  const roster = userTrainers();
  let main = '';
  if (S.phase === 'season' && tourneyPaused()) main = `<section class="panel callout"><div class="eyebrow">Season ${S.season} · after week ${TOURNEY_WEEK}</div><h2>The Midseason Tournament is complete</h2><p>${tname(S.tourney.winner)} won it${S.tourney.runner ? `, beating ${tname(S.tourney.runner)} in the final` : ''}. See the bracket and how your trainers did before the season goes on.</p><div class="confirm-row"><button class="btn primary" data-act="nav" data-v="tourney">See the Midseason Tournament</button><button class="btn" data-act="tourneydone">Continue to week ${S.week + 1}</button></div></section>`;
  else if (S.phase === 'season') main = legendBanner() + roamBanner() + stormBanner() + villainBanner() + outbreakBanner() + teamOverview(roster) + skyPanel();
  else if (S.phase === 'league') main = `<section class="panel callout"><h2>The regular season is over</h2><p>${challengers().filter(t => t.badges.length === 8).length} trainers completed the badge circuit. Qualifiers face the four Elite Four members in order, then the Champion. One loss ends the run. If someone takes the title, every challenger after them faces the new Champion.</p><button class="btn primary" data-act="runleague">Run the Pokémon League</button></section>`;
  else if (S.phase === 'offseason') main = `<section class="panel callout"><h2>Season ${S.season} is in the books</h2><p>${orgName(S.history[S.history.length - 1].cup)} won the Team Cup and ${tname(S.champion)} is Champion. Read the recap before the draft.</p><button class="btn primary" data-act="nav" data-v="recap">Read the season recap</button></section>`;
  else if (S.phase === 'gifts') main = `<section class="panel callout"><h2>Farewell gifts</h2><p>The draft is done. Teams that lost a trainer to a post hand over their farewell gifts.</p><button class="btn primary" data-act="nav" data-v="gifts">See the farewell gifts</button></section>`;
  else if (S.phase === 'reassign') main = `<section class="panel callout"><h2>League reassignment</h2><p>The draft is done. Teams can now move their trainers between Leagues before the Champion's reward and registration.</p><button class="btn primary" data-act="nav" data-v="reassign">Reassign trainers</button></section>`;
  else if (S.phase === 'banvote') main = `<section class="panel callout"><h2>Banlist vote</h2><p>The teams vote on banning last season's top performers before the Champion's reward and the ranch.</p><button class="btn primary" data-act="nav" data-v="banvote">Vote on the banlist</button></section>`;
  else if (S.phase === 'ranch') main = `<section class="panel callout"><h2>Team ranch</h2><p>Hand Pokémon from your ranch to your trainers before registration${(S.ranchPicks || []).some(p => p.org === S.userOrg) ? ', and choose what to keep from a retiring trainer' : ''}.</p><button class="btn primary" data-act="nav" data-v="ranch">Go to the ranch</button></section>`;
  else if (S.phase === 'draft') main = `<section class="panel callout"><h2>Draft day</h2><p>The four teams are picking.</p><button class="btn primary" data-act="nav" data-v="draft">Go to the draft</button></section>`;
  return `<div class="grid-office">
    <div class="col">${main}</div>
    <div class="col side">
      ${cupCard()}
      ${banCard()}
      ${tourneyCard()}
      <section class="panel"><div class="ph"><h3>Latest news</h3><button class="link" data-act="nav" data-v="news">All news</button></div>${newsList(S.news.slice(0, 7))}</section>
    </div></div>`;
}
const cupNow = () => S.phase === 'offseason' ? cupStandings() : orgStandings(null);
function cupCard() {
  const st = cupNow();
  const max = Math.max(1, ...st.map(r => r.pts));
  return `<section class="panel"><div class="ph"><h3>Team Cup</h3><span class="muted">Season ${S.season || 1}${S.phase === 'season' ? ', live' : ''}</span></div>
    <div class="cup">${st.map((r, i) => `<div class="cup-row${r.key === S.userOrg ? ' mine' : ''}"><span class="num">${i + 1}</span>${orgMark(r.key)}<span class="cup-n">${ORGS[r.key].short}</span><span class="cup-bar"><i style="width:${r.pts / max * 100}%;background:${ORGS[r.key].color}"></i></span><span class="num">${r.pts}</span></div>`).join('')}</div>
    <p class="fine">${nLeagues() > 1 ? `Every League counts. World Championship: ${WORLD_PTS.win} for the winner's team, ${WORLD_PTS.final} for the runner-up's. ` : ''}1 point per badge, 3 for reaching the League, 2 per Elite Four win, 10 for winning the title. Each title defense earns 3 for the team the Champion represents. Legacy: +1 per Gym Leader and +2 per Elite Four member promoted from the team (up to 4 a season).</p></section>`;
}
// "a shiny alpha Delta", "an alpha", "a Delta"...
function catchWords(e) {
  const w = [e.shiny && 'shiny', e.alpha && 'alpha', e.delta && 'Delta'].filter(Boolean);
  return w.length ? `${/^[aeiou]/i.test(w[0]) ? 'an' : 'a'} <b>${w.join(' ')}</b> ` : '';
}
function lastEntryText(t) {
  const e = t.weekLog[t.weekLog.length - 1];
  if (!e) return '<span class="muted">No weeks played yet.</span>';
  let txt;
  if (e.act === 'challenge') txt = `<span class="${e.won ? 'good' : 'bad'}">${e.won ? 'Won' : 'Lost'}</span> at ${TOWNS[e.gym]} Gym`;
  else if (e.act === 'explore') txt = e.caught ? `Explored, caught ${catchWords(e)}<b>${e.caught}</b>${e.outbreak ? ' from the outbreak' : ''}` : 'Explored, caught nothing';
  else if (e.act === 'raid' && e.raid) txt = `<span class="${e.raid.won ? 'good' : 'bad'}">${e.raid.won ? 'Beat' : 'Lost to'}</span> ${e.raid.vs} at the ${VILLAIN_TEAMS[e.raid.team].name} hideout`;
  else if (e.act === 'seek' && e.legend) txt = e.legend.caught ? `<span class="good">Caught ${e.legend.sp}!</span>` : e.legend.total != null ? `Did ${e.legend.dealt}% to ${e.legend.sp} on a ${luckWord(e.legend.luck)} day (${e.legend.total}% in total)` : `Took ${e.legend.dealt}% off ${e.legend.sp}'s strength`;
  else if (e.act === 'purify') txt = e.purified && e.purified.length ? `Purified ${e.purified.join(', ')} at the Relic Stone` : 'Spent the week purifying at the Relic Stone';
  else txt = 'Trained';
  if (e.purified && e.purified.length && e.act !== 'purify') txt += ` · <span class="good">purified ${e.purified.join(', ')}</span>`;
  if (e.found && ITEMS[e.found]) txt += ` · found a <b>${ITEMS[e.found].name}</b>`;
  if (e.road) { const o = T(e.road.vs); txt += ` · <span class="${e.road.won ? 'good' : 'bad'}">${e.road.won ? 'beat' : 'lost to'}</span> ${e.road.rival ? 'rival ' : ''}${o ? o.name : 'a trainer'} in a road battle`; }
  return `${txt} · +${e.gain} Lv${e.evoNames && e.evoNames.length ? ' · evolved ' + e.evoNames.join(', ') : ''}${e.learned && e.learned.length ? ' · learned ' + e.learned.join('; ') : ''}`;
}
function teamOverview(roster) {
  return `<section class="panel">
    <div class="ph"><h2>Week ${S.week + 1} of ${SEASON_WEEKS}</h2><span class="muted">${SEASON_WEEKS - S.week} weeks until the League</span></div>
    <div class="progress"><i style="width:${S.week / SEASON_WEEKS * 100}%"></i></div>
    <p class="muted">Open a trainer to set their plan and see their team. Then play the week for everyone.</p>
    <div class="ovw">${roster.map(t => inLeague(lgOf(t), () => {
      const b = t.badges.length;
      const plan = planFor(t);
      const status = t.role === 'champion' ? 'Champion · defending the title' : b >= 8 ? 'Qualified for the League' : `Next: ${TOWNS[b]} Gym (ace Lv ${Math.floor(gymAceLevel(b))})`;
      return `<button class="ovw-row" data-act="nav" data-v="t${t.id}">
        <span class="ovw-name"><span class="tlink${t.user ? ' you' : ''}">${dn(t)}</span><span class="muted small">${lgTag(t)}${status}</span></span>
        <span class="ovw-badges">${t.role === 'champion' ? '' : badgeRow(t)}${teamDots(t)}</span>
        <span class="ovw-plan"><span class="eyebrow">This week</span>${PLAN_LABEL[plan]}${plan === 'explore' ? (S.catchPicks[t.id] ? ` · ${S.weekOffers[t.id][S.catchPicks[t.id].i].sp}` : ' · their pick') : ''}</span>
        <span class="ovw-last"><span class="eyebrow">Last week</span>${lastEntryText(t)}</span>
        <span class="ovw-go" aria-hidden="true">›</span></button>`;
    })).join('') || '<p class="muted">No trainers on your roster.</p>'}</div>
    <div class="confirm-row"><button class="btn primary" data-act="playweek">${playLabel()}</button><button class="btn" data-act="simweek">Sim week</button><span class="muted small">${tourneyNext() ? `Week ${S.week + 1} is played with the plans set here, then the Midseason Tournament. ` : ''}Sim week lets your trainers make their own calls instead of the plans set here.</span></div>
  </section>`;
}

// ---------- which League a trainer plays in, and moving them ----------
function leaguePanel(t) {
  if (nLeagues() < 2) return '';
  const here = lgOf(t);
  const fit = i => { const v = leagueFit(t, i); return `<span class="${v > 0.05 ? 'good' : v < -0.05 ? 'bad' : 'muted'}">${v > 0 ? '+' : ''}${v.toFixed(2)}</span>`; };
  const rows = Array.from({ length: nLeagues() }, (_, i) => {
    const champ = inLeague(i, () => T(S.champion));
    let act = '';
    if (i === here) act = '<span class="tag">Competes here</span>';
    else if (canMoveNow() && t.role === 'challenger' && t.org) {
      const block = moveBlock(t, i);
      const room = lgRoster(t.org, i).length < ROSTER;
      const mates = lgRoster(t.org, i).map(T).filter(x => x.role === 'challenger');
      act = block ? `<span class="muted small">${block}</span>` : room ? `<button class="btn small" data-act="lgmove" data-id="${t.id}" data-v="${i}">Move here</button>`
        : mates.length ? mates.map(o => `<button class="btn small" data-act="lgmove" data-id="${t.id}" data-v="${i}" data-w="${o.id}">Swap with ${o.name}</button>`).join(' ') : '<span class="muted small">No open spot</span>';
    }
    return `<tr${i === here ? ' class="you-row"' : ''}><td>${leagueName(i)}</td><td>${champ ? tname(champ.id) + ' ' + specChips(champ) : '—'}</td><td class="num">${fit(i)}</td><td>${act}</td></tr>`;
  }).join('');
  return `<section class="panel"><div class="ph"><h3>League</h3><span class="muted">${t.name} competes in the ${leagueName(here)}</span></div>
    <div class="scroll"><table class="tbl"><thead><tr><th>League</th><th>Champion</th><th title="How ${t.name}'s team lines up against that League's Champion, Elite Four and meta: above zero favours them">Matchup</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>
    <p class="fine">${canMoveNow() ? `League reassignment is open: moves can be made until you confirm. ${ROSTER} trainer${ROSTER > 1 ? 's' : ''} per team in each League, so a full League means a swap. A legendary can't go to a League where someone already holds one.` : 'Teams move trainers between Leagues during League reassignment, right after the draft.'} Matchup: how well this team hits the Champion (counted double), the Elite Four and the meta, minus what hits it back.</p></section>`;
}
// ---------- one trainer's screen ----------
function viewTrainerScreen(id) {
  const t = T(id);
  if (!t || !t.user) return viewOffice();
  const roster = userTrainers(); const idx = roster.findIndex(x => x.id === id);
  const prev = roster[(idx - 1 + roster.length) % roster.length], next = roster[(idx + 1) % roster.length];
  const switcher = roster.length > 1 ? `<div class="tswitch"><button class="btn small" data-act="nav" data-v="t${prev.id}" title="${esc(prev.name)}">‹ <span class="sw-n">${prev.name}</span></button><span class="muted small">Trainer ${idx + 1} of ${roster.length}${nLeagues() > 1 ? ' · ' + leagueName(lgOf(t)) : ''}</span><button class="btn small" data-act="nav" data-v="t${next.id}" title="${esc(next.name)}"><span class="sw-n">${next.name}</span> ›</button></div>` : '';
  if (S.phase !== 'season') {
    const p = S.progress && S.progress[t.id];
    return `${switcher}${leaguePanel(t)}${itemOfferPanel(t)}${itemsPanel(t)}${p ? `<section class="panel"><div class="ph"><h3>Offseason development</h3><span class="muted">Now age ${t.age}</span></div><div class="ovr-change"><span>${p.before.ovr}</span><span class="arrow">→</span><b>${p.after.ovr}</b><small>OVR</small></div>${ratingBars(t, p)}</section>` : ''}${profileBody(t, true)}`;
  }
  const isChamp = t.role === 'champion';
  const b = t.badges.length;
  const plan = planFor(t);
  const sx = exploreSpecials(t);
  const canChallenge = !isChamp && b < 8 && !gymClosed(b);
  const canRaid = !isChamp && t.role === 'challenger' && !!eventFoe(), canPurify = t.team.some(m => m.shadow), canSeek = !isChamp && t.role === 'challenger' && !!S.legend && !legendBlocked(t, S.legend.sp);
  const need = 8 - b, left = SEASON_WEEKS - S.week;
  // the plan's details
  let detail = '';
  if (plan === 'challenge' || (plan === 'auto' && canChallenge)) {
    const L = T(S.gyms[b].leader); const ace = Math.floor(gymAceLevel(b)); const mine = Math.floor(topAvg(t, 3)); const gap = mine - ace;
    detail += `<div class="gymprev"><div class="ph"><h3>${plan === 'auto' ? 'Next gym' : 'This week'}: ${TOWNS[b]} Gym</h3><span>${dn(L)} ${chip(L.specialty)}${gymWeatherTag(L)}</span></div>
      <p class="muted">Ace Lv ${ace}. ${dn(t)}'s top three average Lv ${mine} <span class="${gap >= 0 ? 'good' : 'bad'}">(${gap >= 0 ? '+' : ''}${gap})</span>.</p>
      ${S.gyms[b].swaps && S.gyms[b].lastSwap != null ? `<p class="small muted">${dn(L)} changed the team after a losing streak in week ${S.gyms[b].lastSwap + 1}.</p>` : ''}<ul class="mini">${L.team.slice().reverse().map(m => `<li><span>${m.sp} ${chips(monTypes(m))}${m.met && m.met.how === 'swap' && m.met.season === S.season ? ' <span class="tag ob">new</span>' : ''}</span><span class="num">Lv ${Math.floor(m.lvl)}</span></li>`).join('')}</ul></div>`;
  }
  if (plan === 'train') detail = `<p>Training adds about <b>+${(trainGain(t) + PACE.travel).toFixed(1)} levels</b> to every Pokémon this week (Training ${t.r.trn}). Pokémon well behind the strongest catch up faster.</p>`;
  if (plan === 'explore') {
    if (!S.weekOffers[t.id]) { S.weekOffers[t.id] = wildOffers(t); save(); }
    const offers = S.weekOffers[t.id]; const pk = S.catchPicks[t.id]; const full = t.team.length >= 6;
    detail = `<p class="muted">${offers.length ? `Three wild Pokémon are on the routes. Pick one to catch, or leave it and ${t.name} chooses.` : 'The routes are empty this week.'} Exploring still gives about +${(PACE.explore + PACE.travel).toFixed(1)} levels, and new catches level faster until they reach the team.</p>
      <div class="offers">${offers.map((o, i) => { const sp = SP[o.sp]; return `<button class="offer-card${pk && pk.i === i ? ' on' : ''}${o.alpha ? ' alpha' : ''}${o.shiny ? ' shiny' : ''}${!o.alpha && !o.shiny && specialOffer(o) ? ' special' : ''}" data-act="csel" data-id="${t.id}" data-i="${i}">${monFace(o.sp, o.shiny, 48, 'big')}<div class="mon-name">${o.sp}${o.shadow ? ' <span class="tag shadow">Shadow</span>' : ''}${o.outbreak ? ' <span class="tag ob">Outbreak</span>' : ''}${o.shiny ? ' <span class="tag shiny">✦ Shiny</span>' : ''}${o.delta ? ' <span class="tag delta">Δ Delta</span>' : ''}${o.alpha ? ' <span class="tag alpha">Alpha</span>' : ''}${babyTag(sp)}${sp.legend && !sp.ub ? ' <span class="tag legend">Legendary</span>' : ''}</div>${o.wormhole ? '<div class="small alpha-note">Came through an Ultra Wormhole, already at full strength. Catch it before it\'s gone.</div>' : ''}${o.roam ? '<div class="small alpha-note">The roaming legendary, at full strength. Catch it now: it moves on, and anyone exploring nearby could find it too.</div>' : ''}${sp.baby ? `<div class="small alpha-note">Only one can exist in the league. ${sp.evos ? 'Evolves ' + babyChain(sp) : sp.label === 'Mythical' ? 'A mythical that never evolves' : 'It doesn\'t evolve, and there\'s only ever been one'}</div>` : ''}${o.shadow ? '<div class="small alpha-note">A Shadow Pokémon: hits 15% harder but may ignore orders, and can\'t level up until purified. Its heart opens as it trains, explores and battles.</div>' : ''}${o.delta ? `<div class="small delta-note">Δ An unusual ${o.delta} type, with outstanding IVs</div>` : ''}${o.shiny ? '<div class="small shiny-note">Perfect IVs, and it arrives on fire</div>' : o.alpha ? '<div class="small alpha-note">Outstanding IVs, already on a hot streak</div>' : ''}<div>${chips(monTypes(o))}</div><div class="muted">Lv ${o.lvl} · BST ${sp.bst}</div>${o.nat ? `<div class="small"><b>${o.nat}</b> <span class="muted">${natureText(o.nat)}</span></div><div class="small">IVs: <b>${ivGrade(o)}</b></div><div class="small muted">Learns ${(o.cov || []).map(c => `${c.t} (Lv ${c.lv})`).join(', ')}</div>` : ''}${sp.evos ? `<div class="evo">${evoText(sp)}</div>` : ''}${specFit(t, sp.name) === 2 ? '<div class="tag gold">Fits both their types</div>' : specFit(t, sp.name) ? '<div class="tag gold">Fits their type</div>' : ''}</button>`; }).join('')}</div>
      ${pk && full ? `<h3 class="rel-h">The team is full. Release one to make room:</h3><div class="release">${t.team.map(m => `<button class="rel${pk.release === m.uid ? ' on' : ''}" data-act="crel" data-id="${t.id}" data-u="${m.uid}">${m.sp} <span class="muted">Lv ${Math.floor(m.lvl)}</span></button>`).join('')}</div>${pk.release == null ? '<p class="warn">Choose who to release, or the catch is skipped.</p>' : ''}` : ''}
      ${pk ? `<button class="link" data-act="cclear" data-id="${t.id}">Clear my pick and let ${t.name} choose</button>` : ''}`;
  }
  if (plan === 'raid' && canRaid) {
    const f = eventFoe(), v = eventTeam();
    detail = `<div class="gymprev"><div class="ph"><h3>This week: ${v.name} hideout</h3><span>${dn(f)}${f.kind === 'boss' ? ' <span class="tag gold">Boss</span>' : ''}</span></div>
      <p class="muted">${dn(t)}'s top three average Lv ${Math.floor(topAvg(t, 3))}. A win moves everyone up the ladder${f.kind === 'boss' ? ` and drives ${v.name} out` : ''}.</p>
      <ul class="mini">${f.team.slice().reverse().map(m => `<li><span>${m.sp} ${chips(monTypes(m))}${m.shadow ? ' <span class="tag shadow">Shadow</span>' : ''}</span><span class="num">Lv ${Math.floor(m.lvl)}</span></li>`).join('')}</ul></div>`;
  }
  if (plan === 'seek' && canSeek) { const L = legendState(S.legend), rank = legendRank(L), mine = L.dmg[t.id] || 0, lead = rank[0]; detail = `<div class="gymprev"><div class="ph"><h3>This week: seek ${L.sp}</h3><span>${chips(SP[L.sp].types)} Lv ${L.lvl}</span></div><p class="muted">${dn(t)}'s top three average Lv ${Math.floor(topAvg(t, 3))}. ${t.name} has done ${Math.round(mine * 100)}% to it so far${lead && lead.id !== t.id ? `; the leader, ${dn(T(lead.id))}, has ${Math.round(lead.d * 100)}%` : lead ? ', the most of anyone' : ''}. It fights at full strength every time, and luck on the day can halve or double the damage. A failed attempt still earns up to about +${(legendXp(t, 1) + PACE.travel).toFixed(1)} levels, depending on the damage done.${L.affinity && t.org === L.affinity ? ` As a ${ORGS[L.affinity].name} trainer, ${t.name} deals 25% more to it.` : ''}</p></div>`; }
  if (canPurify) detail += `<div class="villain"><span class="vl-k">Shadow</span> Shadow Pokémon's hearts open as ${t.name} trains (most), explores or challenges a gym, and a little more with every battle. A higher Bond rating opens them faster. Once a heart is fully open, that Pokémon is purified at the end of the week and gets all its held-back levels at once.
    <ul class="mini">${t.team.filter(m => m.shadow).map(m => `<li><span>${m.sp} <span class="tag shadow">Shadow</span></span><span class="num">heart ${Math.round(100 - m.shadow.heart)}% open · +${Math.round(m.shadow.stored)} Lv stored</span></li>`).join('')}</ul></div>`;
  if (plan === 'auto' && !canChallenge) detail = `<p class="muted">${gymClosed(b) ? `${TOWNS[b]} Gym is closed while Team Skull holds it. ` : ''}${t.name} will train or explore as they see fit.</p>`;
  if (sx.length && plan !== 'explore') detail = `<div class="spotted"><span class="sp-k">Spotted</span> Something special is on the routes this week: <b>${sx.map(specialWord).join(', ')}</b>. Choose Explore to see it.</div>` + detail;
  detail = tourneyOfferPanel(t) + itemOfferPanel(t) + legendOfferPanel(t) + snagPanel(t) + tradePanel(t) + megaPanel(t) + legendBanner(t) + roamBanner(t) + stormBanner(t) + villainBanner(t) + outbreakBanner(t) + detail;
  if (S.wormhole && S.wormhole.id === t.id) detail = `<div class="wormhole"><b>An Ultra Wormhole is open nearby.</b> ${S.wormhole.sp} ${chips(SP[S.wormhole.sp].types)} came through. ${plan === 'explore' ? `It's among this week's wild Pokémon, at full strength. Pick it to try to catch it.` : `Explore by the end of week ${S.wormhole.until} for one chance to catch it${plan === 'auto' ? ` (on Auto, ${t.name} will go)` : ''}.`}</div>` + detail;
  const warn = !isChamp && need > 0 && left <= need ? `<p class="warn">${left} week${left > 1 ? 's' : ''} left and ${need} badge${need > 1 ? 's' : ''} to go. Every week from here must be a gym challenge to qualify.</p>` : (!isChamp && t.team.length < 5 && b >= 1 ? `<p class="warn">Only ${t.team.length} Pokémon. Rivals carry five or six by the middle gyms. Explore to fill out the team.</p>` : '');
  const opts = ['auto', 'challenge', 'train', 'explore'].concat(canSeek ? ['seek'] : [], canRaid ? ['raid'] : []).map(p => `<button class="seg${plan === p ? ' on' : ''}${p === 'explore' && sx.length ? ' hot' : ''}" ${p === 'explore' && sx.length ? `title="Something special in the wild this week: ${sx.map(specialWord).join(', ')}"` : ''} data-act="plan" data-id="${t.id}" data-v="${p}" ${p === 'challenge' && !canChallenge ? 'disabled' : ''}>${p === 'raid' ? 'Confront ' + eventTeam().name : p === 'seek' ? 'Seek ' + S.legend.sp : PLAN_LABEL[p]}</button>`).join('');
  // last week
  const e = t.weekLog[t.weekLog.length - 1];
  const lb = (S.lastBattles || []).findIndex(r => r.sides[0].id === t.id || r.sides[1].id === t.id);
  const lastWeek = e ? `<section class="panel result ${e.act === 'challenge' ? (e.won ? 'won' : 'lost') : ''}"><div class="ph"><h3>Week ${e.wk}</h3>${e.act === 'challenge' ? `<span class="res-tag">${e.won ? 'Victory' : 'Defeat'}</span>` : ''}</div>
    <p>${lastEntryText(t)}</p>${lb >= 0 ? `<button class="btn" data-act="watch" data-src="week" data-i="${lb}">Watch the battle</button>` : ''}</section>` : '';
  const strip = Array.from({ length: SEASON_WEEKS }, (_, i) => {
    const w = t.weekLog[i]; let cls = '', lab = '';
    if (w) { if (w.act === 'challenge') { cls = w.won ? 'w' : 'l'; lab = w.won ? 'W' : 'L'; } else if (w.act === 'raid') { cls = 'o v'; lab = 'V'; } else if (w.act === 'seek') { cls = 'o v'; lab = 'L'; } else { cls = 'o'; lab = w.act === 'train' ? 'T' : w.act === 'purify' ? 'P' : 'E'; } }
    if (i === S.week) cls += ' now';
    return `<span class="wk ${cls}" title="Week ${i + 1}${w ? ': ' + w.act + (w.caught ? ', caught ' + w.caught : '') : ''}"><small>${i + 1}</small>${lab}</span>`;
  }).join('');
  return `${switcher}<div class="grid-office"><div class="col">
    <section class="panel tcard"><div class="tcard-top">${trPortrait(t)}<div class="tcard-id"><div class="eyebrow">${roleLabel(t)} · Age ${t.age}</div>${cardName(t)}<div class="spec">${specLine(t)}<span class="muted"> · ${LEAD_STYLES[leadStyle(t)]}</span>${traitChip(t)}</div>${rivalLine(t)}</div>
      <div class="tcard-ovr"><span>${ovr(t)}</span><small>OVR · POT ${t.pot}</small></div></div>
      ${isChamp ? '' : badgeRow(t, true)}</section>
    <section class="panel plan"><div class="ph"><h2>Week ${S.week + 1} plan</h2><span class="muted">${left} weeks until the League</span></div>
      <div class="segs wide" role="group" aria-label="Plan for ${dn(t)}">${opts}</div>${warn}${detail}
      <div class="confirm-row"><button class="btn primary" data-act="playweek">Play week ${S.week + 1} for the team</button><span class="fine">Plans stay set until you change them.</span></div></section>
    ${lastWeek}
    <section class="panel"><div class="ph"><h3>Season so far</h3><span class="muted">${t.weekLog.filter(w => w.won).length}–${t.weekLog.filter(w => w.won === false).length} in gym battles</span></div><div class="strip">${strip}</div></section>
  </div><div class="col side">
    <section class="panel"><div class="ph"><h3>Team</h3><span class="muted">${t.team.length}/6</span></div>${t.team.map(m => monRow(m, t.id)).join('')}</section>
    ${itemsPanel(t)}
    <section class="panel"><div class="ph"><h3>Ratings</h3></div>${ratingBars(t)}</section>
    <section class="panel"><div class="ph"><h3>${t.name}'s news</h3></div>${newsList(S.news.filter(n => n.id === t.id).slice(0, 6))}</section>
  </div></div>`;
}

// ---------- profiles ----------
// the trainers this one has met most often, with records
function h2hList(t) {
  const rows = Object.entries(t.h2h || {}).map(([id, h]) => ({ o: T(+id), h, n: h.w + h.l })).filter(x => x.o && x.n >= 2).sort((a, b) => b.n - a.n || b.h.last - a.h.last).slice(0, 6);
  if (!rows.length) return '<p class="muted small">No repeat opponents yet.</p>';
  return `<ul class="changes">${rows.map(({ o, h }) => `<li>${tname(o.id)} <b class="${h.w > h.l ? 'good' : h.w < h.l ? 'bad' : ''}">${h.w}–${h.l}</b>${t.rival === o.id ? ' <span class="rv">Rival</span>' : t.nemesis === o.id ? ' <span class="rv nem">Nemesis</span>' : ''}</li>`).join('')}</ul>`;
}
// gyms rotate towns every season, so back-to-back gym stints read as one reign as Gym Leader
function postReigns(posts) {
  const out = [];
  for (const p of posts) {
    const last = out[out.length - 1];
    if (p.role === 'leader' && last && last.role === 'leader' && last.lg === p.lg && last.to != null && p.from <= last.to + 1) { last.to = p.to; continue; }
    out.push(Object.assign({}, p));
  }
  return out;
}
function careerExtras(t) {
  const acc = accolades(t);
  const posts = postReigns(t.posts || []);
  const teams = t.teams || [];
  if (!acc.length && !posts.length && !teams.length && !Object.keys(t.h2h || {}).length) return '';
  const span = (a, b) => b == null ? `Season ${a}–present` : a === b ? `Season ${a}` : `Seasons ${a}–${b}`;
  return `<section class="panel"><div class="ph"><h3>Honors &amp; history</h3></div><div class="hist3">
    <div><div class="eyebrow">Honors</div>${acc.length ? `<ul class="changes">${acc.map(x => `<li>${x.text}</li>`).join('')}</ul>` : '<p class="muted small">None yet.</p>'}</div>
    <div><div class="eyebrow">Positions held</div>${posts.length ? `<ul class="changes">${posts.slice().reverse().map(p => `<li><b>${p.role === 'leader' ? 'Gym Leader' : p.interim ? 'Interim Champion' : p.place}</b>${lgIn(p.lg) ? ' · ' + leagueName(p.lg) : ''} · ${span(p.from, p.to)}</li>`).join('')}</ul>` : '<p class="muted small">None.</p>'}</div>
    <div><div class="eyebrow">Head-to-head</div>${h2hList(t)}</div>
    <div><div class="eyebrow">Teams</div>${teams.length ? `<ul class="changes">${teams.slice().reverse().map(h => `<li>${orgMark(h.org)}${ORGS[h.org].name} · ${span(h.from, h.to)}</li>`).join('')}</ul>` : '<p class="muted small">Never signed with a team.</p>'}</div>
  </div></section>`;
}
function profileBody(t, full) {
  const sh = t.seasonHist.slice().reverse();
  const c = t.career;
  const elite = ['leader', 'e4', 'champion'].includes(t.role);
  return `<div class="profile">
    <section class="panel tcard"><div class="tcard-top">${trPortrait(t)}<div class="tcard-id"><div class="eyebrow">${t.famous ? '★ Famous trainer' + (famousTags(t).length ? ' (' + famousTags(t).map(k => FAMOUS_TAG_LABELS[k]).join(', ') + ')' : '') + ' · ' : ''}${roleLabel(t)} · Age ${t.age}${t.hof ? ' · Hall of Fame' : ''}${t.formerUser && !t.user ? ' · Former ' + (t.prevOrg ? ORGS[t.prevOrg].short : 'team') + ' trainer' : ''}</div>${cardName(t)}<div class="spec">${specLine(t)}<span class="muted"> · ${LEAD_STYLES[leadStyle(t)]}</span>${elite ? ` · formerly ${t.cls}` : ''}${traitChip(t)}</div>${rivalLine(t)}</div>
      <div class="tcard-ovr"><span>${ovr(t)}</span><small>OVR${t.role !== 'retired' ? ' · POT ' + (t.user || t.seasons > 0 ? t.pot : (t.potEst ?? t.pot)) : ''}</small></div></div>
      ${t.role === 'challenger' ? badgeRow(t, true) : ''}
      ${ratingBars(t)}
      ${full ? `<dl class="help">${RK.map(k => `<div><dt>${RNAME[k]}</dt><dd>${RHELP[k]}</dd></div>`).join('')}</dl>` : ''}
    </section>
    <section class="panel"><div class="ph"><h3>Team</h3><span class="muted">${t.team.length}/6</span></div>${t.team.map(m => monRow(m, t.id)).join('') || '<p class="muted">No Pokémon.</p>'}</section>
    ${(t.alumni || []).length ? `<section class="panel"><div class="ph"><h3>Former Pokémon</h3><span class="muted">${t.alumni.length}</span></div><div class="scroll"><table class="tbl"><thead><tr><th>Pokémon</th><th>Last Lv</th><th>Record</th><th>KOs</th><th>Left</th></tr></thead><tbody>${t.alumni.map((a, i) => `<tr><td><button class="tlink" data-act="alum" data-t="${t.id}" data-i="${i}">${a.sp}</button></td><td class="num">${a.lvl}</td><td class="num">${wl(a.st)}</td><td class="num">${a.st.ko}</td><td class="muted small">S${a.left} · ${a.why}</td></tr>`).join('')}</tbody></table></div></section>` : ''}
    ${careerExtras(t)}
    <section class="panel"><div class="ph"><h3>Career</h3><span class="muted">${t.role === 'retired' ? `Retired in Season ${t.retiredSeason} after ${t.seasons || 0} seasons` : `Season ${Math.max(1, t.seasons || 0)} of their career${t.age >= 45 ? ` · could retire for age from ${Math.max(50, t.age + Math.max(0, careerSpan(t) - (t.seasons || 0)))}` : ''}`}</span></div>
      <div class="stats">
        <div><b>${recOf(t).w}–${recOf(t).l}</b><small>All battles</small></div><div><b>${recOf(t).lw + recOf(t).tw}–${recOf(t).ll + recOf(t).tl}</b><small>League &amp; title</small></div>
        <div><b>${c.badges}</b><small>Badges</small></div><div><b>${c.gymW}–${c.gymL}</b><small>Gym record as challenger</small></div>
        <div><b>${c.leagueApps}</b><small>League runs</small></div><div><b>${c.titles}</b><small>Titles</small></div>
        <div><b>${c.defenses}</b><small>Title defenses</small></div><div><b>${c.e4Wins}</b><small>Elite Four wins</small></div>
      </div>
      ${sh.length ? `<div class="scroll"><table class="tbl"><thead><tr><th>Season</th>${nLeagues() > 1 ? '<th>League</th>' : ''}<th>Team</th><th>OVR</th><th>Badges</th><th>Result</th><th>Pts</th></tr></thead><tbody>${sh.map(h => `<tr><td>${h.season}</td>${nLeagues() > 1 ? `<td>${lgIn(h.lg) || '<span class="muted">—</span>'}</td>` : ''}<td>${orgMark(h.org)}</td><td class="num">${h.ovr}</td><td class="num">${h.role === 'champion' ? '—' : h.badges}</td><td>${h.role === 'champion' ? 'Reigning Champion' : stageText(h.stage)}</td><td class="num">${h.pts ?? ''}</td></tr>`).join('')}</tbody></table></div>` : ''}
      ${full && t.user && t.role === 'challenger' && S.phase === 'offseason' ? `<div class="confirm-row"><button class="btn danger" data-act="releaseask" data-id="${t.id}">Release ${dn(t)}</button></div>` : ''}
    </section></div>`;
}


// ================= PLAYER IMAGES (v190) =================
// The game ships and loads no Pokémon artwork. Players add their own: one image per species (plus an optional shiny one)
// and one portrait per trainer. Each is stored once at 128 × 128 in this browser's IndexedDB, never in the save file, and
// kept in memory as an object URL so the pages can draw it straight away. Anything without an image keeps its old look.
const IMG_DB = 'plgm-images', IMG_STORE = 'images', IMG_PX = 128, IMG_MAX_FILE = 20 * 1024 * 1024;
const IMGS = new Map(); // key -> { url, blob, at }; keys are p:<species>, s:<species> (shiny), t:<title name>
let imgDbP = null, imgBootDone = false, imgQ = '', imgTab = 'mon', imgMsg = '', imgBusy = false, imgClearArm = false;
function imgDb() {
  if (imgDbP) return imgDbP;
  imgDbP = new Promise(res => {
    try {
      if (!window.indexedDB) return res(null);
      const rq = indexedDB.open(IMG_DB, 1);
      rq.onupgradeneeded = () => { const db = rq.result; if (!db.objectStoreNames.contains(IMG_STORE)) db.createObjectStore(IMG_STORE, { keyPath: 'key' }); };
      rq.onsuccess = () => res(rq.result); rq.onerror = () => res(null); rq.onblocked = () => res(null);
    } catch (e) { res(null); }
  });
  return imgDbP;
}
function imgTx(mode, fn) {
  return imgDb().then(db => db ? new Promise((res, rej) => {
    try { const tx = db.transaction(IMG_STORE, mode), rq = fn(tx.objectStore(IMG_STORE)); tx.oncomplete = () => res(rq ? rq.result : true); tx.onerror = tx.onabort = () => rej(tx.error || new Error('tx')); }
    catch (e) { rej(e); }
  }) : Promise.reject(new Error('no-db')));
}
function imgCache(rec) { const old = IMGS.get(rec.key); if (old) URL.revokeObjectURL(old.url); IMGS.set(rec.key, { url: URL.createObjectURL(rec.blob), blob: rec.blob, at: rec.at || 0 }); }
function imgUncache(key) { const old = IMGS.get(key); if (old) URL.revokeObjectURL(old.url); IMGS.delete(key); }
async function imgLoadAll() {
  try { const all = await imgTx('readonly', st => st.getAll()); for (const r of all || []) if (r && r.key && r.blob) imgCache(r); } catch (e) {}
  if (IMGS.size && imgBootDone) { try { render(); if (modal && modal.kind !== 'battle') renderModal(); } catch (e) {} }
}
// store one image; if this browser won't keep it, it still shows until the page closes
async function imgSet(key, blob) {
  const rec = { key, blob, at: Date.now() }; imgCache(rec);
  try { await imgTx('readwrite', st => st.put(rec)); return true; } catch (e) { return false; }
}
async function imgDel(key) { imgUncache(key); try { await imgTx('readwrite', st => st.delete(key)); } catch (e) {} }
// ---- keys and labels ----
const IMG_SP = sp => 'p:' + sp, IMG_SHINY = sp => 's:' + sp;
const trImgName = t => `${titleOf(t)} ${t.name}`;
const IMG_TR = t => 't:' + trImgName(t);
const imgUrl = k => { const x = IMGS.get(k); return x ? x.url : null; };
const monImg = (sp, shiny) => (shiny && imgUrl(IMG_SHINY(sp))) || imgUrl(IMG_SP(sp));
function imgLabel(k) { return k[0] === 's' ? `Shiny ${k.slice(2)}` : k.slice(2); }
const fmtBytes = n => n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(n < 10240 ? 1 : 0)} KB` : `${(n / 1048576).toFixed(1)} MB`;
// ---- drawing them ----
// a Pokémon's picture at a size, or its type-colored dot when it has none (a Mega, Delta, alpha or Shadow uses the normal image)
function monFace(sp, shiny, px, dotCls = '', flip = false) {
  const u = monImg(sp, shiny);
  if (u) return `<img class="pic${flip ? ' flip' : ''}" src="${u}" alt="" width="${px}" height="${px}" decoding="async">`;
  const s = SP[sp] || { types: ['Normal'] };
  return `<span class="dot${dotCls ? ' ' + dotCls : ''}" style="--tc:${TYPE_COLOR[s.types[0]]};--tc2:${TYPE_COLOR[s.types[1] || s.types[0]]}"></span>`;
}
// a small picture beside a name in tables and lists; nothing at all when there's no image
const monMini = (sp, shiny) => { const u = monImg(sp, shiny); return u ? `<img class="pic mini" src="${u}" alt="" width="22" height="22" decoding="async">` : ''; };
const trInitials = t => String(t.name || '?').replace(/ V\d+$/, '').split(/\s+/).filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase();
function trFace(t, px) {
  const u = t && imgUrl(IMG_TR(t));
  return u ? `<img class="pic tpic" src="${u}" alt="" width="${px}" height="${px}" decoding="async">`
    : `<span class="tpic tinit" style="width:${px}px;height:${px}px;font-size:${Math.round(px * 0.38)}px" aria-hidden="true">${esc(trInitials(t || {}))}</span>`;
}
const trMini = (t, px = 22) => { const u = t && imgUrl(IMG_TR(t)); return u ? `<img class="pic tpic mini" src="${u}" alt="" width="${px}" height="${px}" decoding="async">` : ''; };
const CAM_SVG = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M9 4 7.2 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3.2L15 4H9zm3 4.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/></svg>';
// the portrait square on a trainer's card, with a camera badge to add or change it: the full 128 px image, or 64 px initials
function trPortrait(t) {
  const has = !!imgUrl(IMG_TR(t));
  return `<div class="tport${has ? ' big' : ''}">${trFace(t, has ? IMG_PX : 64)}<button class="tcam" data-act="imgup" data-k="${esc(IMG_TR(t))}" title="${has ? 'Change' : 'Add'} portrait" aria-label="${has ? 'Change' : 'Add'} ${esc(t.name)}'s portrait">${CAM_SVG}</button></div>`;
}
// the Add image / Add shiny image buttons on a Pokémon's page (they apply to the whole species)
function monImgBtns(sp) {
  const n = imgUrl(IMG_SP(sp)), s = imgUrl(IMG_SHINY(sp));
  return `<div class="imgbtns"><button class="btn small" data-act="imgup" data-k="${esc(IMG_SP(sp))}">${n ? 'Change image' : 'Add image'}</button><button class="btn small" data-act="imgup" data-k="${esc(IMG_SHINY(sp))}">${s ? 'Change shiny image' : 'Add shiny image'}</button></div>`;
}
// ---- turning a file into the stored 128 × 128 square ----
async function imgDecode(blob) {
  const url = URL.createObjectURL(blob), img = new Image();
  img.src = url;
  try { await img.decode(); } catch (e) { URL.revokeObjectURL(url); throw e; }
  URL.revokeObjectURL(url);
  if (!img.naturalWidth || !img.naturalHeight) throw new Error('empty');
  return img;
}
// trim fully transparent margins, so sprites with lots of empty space fill the square
function imgBounds(img) {
  const w = img.naturalWidth, h = img.naturalHeight; if (w * h > 4e6) return [0, 0, w, h];
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0);
  let d; try { d = x.getImageData(0, 0, w, h).data; } catch (e) { return [0, 0, w, h]; }
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let y = 0; y < h; y++) for (let i = 0; i < w; i++) if (d[(y * w + i) * 4 + 3] > 8) { if (i < x0) x0 = i; if (i > x1) x1 = i; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  return x1 < 0 ? [0, 0, w, h] : [x0, y0, x1 - x0 + 1, y1 - y0 + 1];
}
// pixel art keeps hard edges (whole-number scaling, saved as PNG); anything else is smoothed and saved as WebP where the browser can
async function imgSquare(img, box, pixel, flip) {
  const [sx, sy, sw, sh] = box, c = document.createElement('canvas'); c.width = c.height = IMG_PX;
  const x = c.getContext('2d');
  let k = IMG_PX / Math.max(sw, sh);
  if (pixel && k >= 1) k = Math.floor(k);
  const dw = Math.max(1, Math.round(sw * k)), dh = Math.max(1, Math.round(sh * k)), dx = Math.floor((IMG_PX - dw) / 2), dy = Math.floor((IMG_PX - dh) / 2);
  x.imageSmoothingEnabled = !pixel || k < 1; x.imageSmoothingQuality = 'high';
  if (flip) { x.translate(IMG_PX, 0); x.scale(-1, 1); }
  x.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
  const toBlob = (type, q) => new Promise(r => { try { c.toBlob(b => r(b), type, q); } catch (e) { r(null); } });
  let b = pixel ? await toBlob('image/png') : await toBlob('image/webp', 0.9);
  if (!b) b = await toBlob('image/png');
  if (!b) throw new Error('encode');
  return b;
}
// redo the preview after a new file or a changed option
async function imgRedraft() {
  const d = modal && modal.kind === 'img' && modal.draft; if (!d) return;
  try { const b = await imgSquare(d.img, d.box, d.pixel, d.flip); if (d.url) URL.revokeObjectURL(d.url); d.blob = b; d.url = URL.createObjectURL(b); modal.err = ''; }
  catch (e) { modal.err = "Couldn't prepare that image in this browser."; }
  renderModal();
}
async function imgPickFile(f) {
  const m = modal; if (!m || m.kind !== 'img' || !f) return;
  if (f.size > IMG_MAX_FILE) { m.err = 'That file is over 20 MB. Choose a smaller image.'; renderModal(); return; }
  try {
    const img = await imgDecode(f);
    const old = m.draft;
    m.draft = { img, box: imgBounds(img), name: f.name || 'image', size: f.size, w: img.naturalWidth, h: img.naturalHeight, pixel: old ? old.pixel : true, flip: old ? old.flip : false };
    if (old && old.url) URL.revokeObjectURL(old.url);
    await imgRedraft();
  } catch (e) { m.err = "That file isn't an image this browser can open."; renderModal(); }
}
function openImgUp(key) {
  const back = modal ? (modal.kind === 'img' ? modal.back : modal) : null;
  modal = { kind: 'img', key, back, draft: null, err: '' };
  renderModal();
}
function imgBody() {
  const m = modal, d = m.draft, cur = IMGS.get(m.key), shown = d ? d.url : cur && cur.url, isTr = m.key[0] === 't';
  const name = esc(imgLabel(m.key)), sp = isTr ? null : m.key.slice(2);
  const sizes = isTr ? [[32, 'In battle'], [64, 'Profile']] : [[22, 'Lists'], [40, 'Team'], [76, 'Battle']];
  const opt = (k, title, desc) => `<button class="adv-opt mini${d[k] ? ' on' : ''}" data-act="imgopt" data-k="${k}" role="switch" aria-checked="${!!d[k]}"><span class="adv-switch" aria-hidden="true"><i></i></span><span class="adv-text"><b>${title}</b><span class="muted small">${desc}</span></span></button>`;
  const note = isTr ? `A portrait belongs to ${name}, in any league on this device.`
    : m.key[0] === 's' ? `Used for every shiny ${esc(sp)}. Shinies without one use the normal image.` : `Used for every ${esc(sp)} (Delta, alpha, Shadow and Mega ${esc(sp)} too), on every team.`;
  return `<div class="mh"><h2>${isTr ? 'Portrait' : 'Image'}: ${name}</h2><button class="btn icon" data-act="close" aria-label="Close">×</button></div>
  <div class="imgup">
    <div class="checker imgprev">${shown ? `<img src="${shown}" alt="Preview of ${name}" width="128" height="128">` : `<span class="muted small">No image yet</span>`}</div>
    <div class="imgup-meta">
      ${d ? `<b class="imgup-file">${esc(d.name)}</b><span class="muted small">${fmtBytes(d.size)} · ${d.w} × ${d.h}</span><span class="small">Saved as ${IMG_PX} × ${IMG_PX}${d.blob ? ` · ${fmtBytes(d.blob.size)}` : ''}</span>`
        : cur ? `<span class="small">Current image · ${IMG_PX} × ${IMG_PX} · ${fmtBytes(cur.blob.size)}</span><span class="muted small">Choose another file to replace it.</span>`
        : `<span class="muted small">PNG, WebP, GIF or JPEG. Empty margins are trimmed, and the picture is centered on a transparent ${IMG_PX} × ${IMG_PX} square.</span>`}
      ${shown ? `<div class="imgsizes">${sizes.map(([px, l]) => `<span class="imgsize"><span class="checker" style="width:${px}px;height:${px}px"><img src="${shown}" alt="" width="${px}" height="${px}"></span><small>${l}</small></span>`).join('')}</div>` : ''}
    </div>
  </div>
  ${d ? `<div class="adv-list">${opt('pixel', 'Pixel art (keep sharp)', 'Scales by whole steps with hard edges and saves as PNG. Turn off for drawings and photos.')}${opt('flip', 'Flip to face right', isTr ? 'Mirror the picture.' : "Your side of a battle shows it as saved; the opponent's side is mirrored automatically.")}</div>` : ''}
  ${m.err ? `<p class="warn">${m.err}</p>` : ''}
  <div class="confirm-row"><label class="btn${d ? '' : ' primary'}" for="imgfile" tabindex="0">${d || cur ? 'Choose another' : 'Choose an image'}</label><input id="imgfile" type="file" accept="image/*" class="sr">
    ${d && d.blob ? '<button class="btn primary" data-act="imgsave">Save image</button>' : ''}
    ${cur && !d ? `<button class="btn danger" data-act="imgdel">Remove</button>` : ''}
    <button class="btn" data-act="close">${d ? 'Cancel' : 'Close'}</button></div>
  <p class="fine">${note} Images stay in this browser on this device and are never part of the save file. Move them with Export pack under Images in the menu.</p>`;
}
async function imgSaveDraft() {
  const m = modal, d = m && m.draft; if (!d || !d.blob) return;
  const ok = await imgSet(m.key, d.blob);
  if (d.url) URL.revokeObjectURL(d.url);
  const label = imgLabel(m.key);
  modal = m.back || null; renderModal(); render();
  toast(ok ? `Saved the image for ${label}.` : `Saved for now, but this browser won't keep images, so it'll be gone when the page closes.`);
}
// ---- the Images manager (Advanced options, and Images in the league menu) ----
function imgCounts() {
  let p = 0, s = 0, t = 0, bytes = 0;
  for (const [k, v] of IMGS) { if (k[0] === 'p') p++; else if (k[0] === 's') s++; else t++; bytes += v.blob.size; }
  return { p, s, t, bytes, all: IMGS.size };
}
function imgSummary() { const c = imgCounts(); return c.all ? `${c.p} Pokémon · ${c.s} shiny · ${c.t} trainer${c.t === 1 ? '' : 's'} · ${fmtBytes(c.bytes)}` : 'No images yet'; }
function imgGrid() {
  const q = fold(imgQ.trim());
  if (imgTab === 'tr') {
    const have = [...IMGS.keys()].filter(k => k[0] === 't').map(k => k.slice(2));
    const live = S ? Object.values(S.trainers).filter(t => t.role !== 'prospect' || t.org) : [];
    const byName = new Map(live.map(t => [trImgName(t), t]));
    let names = q ? [...new Set(have.concat([...byName.keys()]))].filter(n => fold(n).includes(q)) : have;
    names.sort((a, b) => (IMGS.has('t:' + b) - IMGS.has('t:' + a)) || a.localeCompare(b));
    const total = names.length; names = names.slice(0, 60);
    if (!names.length) return `<p class="muted small">${q ? 'No trainer matches that search.' : `No trainer portraits yet. ${S ? 'Search a trainer by name, or add one from a trainer\'s profile.' : 'Add them from a trainer\'s profile once a league is running, or import a pack.'}`}</p>`;
    return `<div class="imggrid">${names.map(n => { const t = byName.get(n);
      return `<button class="imgtile" data-act="imgup" data-k="${esc('t:' + n)}" title="${IMGS.has('t:' + n) ? 'Change' : 'Add'} ${esc(n)}'s portrait">${t ? trFace(t, 48) : `<img class="pic tpic" src="${imgUrl('t:' + n)}" alt="" width="48" height="48">`}<span class="small">${esc(n)}</span></button>`; }).join('')}</div>${total > 60 ? `<p class="fine">Showing 60 of ${total}. Search to narrow it down.</p>` : ''}`;
  }
  let names = q ? Object.keys(SP).filter(sp => fold(sp).includes(q) || SP[sp].types.some(ty => fold(ty) === q)) : Object.keys(SP).filter(sp => IMGS.has(IMG_SP(sp)) || IMGS.has(IMG_SHINY(sp)));
  names.sort((a, b) => a.localeCompare(b));
  const total = names.length; names = names.slice(0, 60);
  if (!names.length) return `<p class="muted small">${q ? 'No Pokémon matches that search.' : 'No Pokémon images yet. Search a Pokémon to add one, or import a pack.'}</p>`;
  return `<div class="imggrid">${names.map(sp => `<div class="imgtile"><button class="imgtile-main" data-act="imgup" data-k="${esc(IMG_SP(sp))}" title="${IMGS.has(IMG_SP(sp)) ? 'Change' : 'Add'} the image for ${esc(sp)}">${monFace(sp, false, 48, 'big')}<span class="small">${esc(sp)}</span></button><button class="imgtile-shiny${IMGS.has(IMG_SHINY(sp)) ? ' on' : ''}" data-act="imgup" data-k="${esc(IMG_SHINY(sp))}" title="${IMGS.has(IMG_SHINY(sp)) ? 'Change' : 'Add'} the shiny image for ${esc(sp)}">${IMGS.has(IMG_SHINY(sp)) ? `<img class="pic" src="${imgUrl(IMG_SHINY(sp))}" alt="" width="20" height="20">` : ''}✦ Shiny</button></div>`).join('')}</div>${total > 60 ? `<p class="fine">Showing 60 of ${total}. Search to narrow it down.</p>` : ''}`;
}
function imagesBody() {
  const c = imgCounts();
  return `<p class="muted small">The game comes with no Pokémon artwork. Add your own pictures: one per Pokémon (plus a shiny one if you like) and a portrait per trainer. They're kept in this browser on this device, never in the save file. Anything without a picture keeps its colored dot or initials.</p>
    <div class="cupsum imgstats"><div><b>${c.p}</b><small>Pokémon</small></div><div><b>${c.s}</b><small>Shiny</small></div><div><b>${c.t}</b><small>Trainers</small></div><div><b>${fmtBytes(c.bytes)}</b><small>Space used</small></div></div>
    <div class="filters"><button class="pill${imgTab === 'mon' ? ' on' : ''}" data-act="imgtab" data-v="mon">Pokémon</button><button class="pill${imgTab === 'tr' ? ' on' : ''}" data-act="imgtab" data-v="tr">Trainers</button></div>
    ${searchBox('imgq', imgQ, imgTab === 'tr' ? 'Search trainers' : 'Search Pokémon', imgTab === 'tr' ? 'Search trainers by name' : 'Search by Pokémon name or type')}
    <div id="imggrid">${imgGrid()}</div>
    <h3 class="imgpack-h">Image packs</h3>
    <p class="muted small">Export pack saves every image as one zip file. Import pack takes a zip or a set of image files and matches them by name: <b>Sprout.png</b> is Sprout, <b>Sprout-shiny.png</b> its shiny image, and files in a <b>trainers</b> folder (or named like <b>Hiker Ben.png</b>) are trainer portraits. Imported images replace ones with the same name.</p>
    <div class="confirm-row"><button class="btn" data-act="imgexport"${c.all && !imgBusy ? '' : ' disabled'}>Export pack</button><label class="btn" for="imgpackfile" tabindex="0">Import pack</label><input id="imgpackfile" type="file" accept="image/*,.zip,application/zip" multiple class="sr">
      ${c.all ? (imgClearArm ? `<span class="small">Remove all ${c.all} images?</span><button class="btn danger small" data-act="imgclearyes">Remove all</button><button class="btn small" data-act="imgclearno">Keep them</button>` : `<button class="btn danger small" data-act="imgclear">Remove all images</button>`) : ''}</div>
    ${imgBusy ? '<p class="fine">Working on it…</p>' : imgMsg ? `<p class="cf-msg">${imgMsg}</p>` : ''}`;
}
function imagesModalBody() { return `<div class="mh"><h2>Images</h2><button class="btn icon" data-act="close" aria-label="Close">×</button></div><p class="small">${imgSummary()}</p>${imagesBody()}`; }
function imgRefresh() { if (modal && modal.kind === 'images') renderModal(); else render(); }
// ---- image packs: a plain zip writer (images are already compressed, so they're stored as they are) and reader ----
const CRC_T = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(b) { let c = 0xFFFFFFFF; for (let i = 0; i < b.length; i++) c = CRC_T[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
function zipStore(files) {
  const enc = new TextEncoder(), parts = [], cd = []; let off = 0;
  for (const f of files) {
    const nm = enc.encode(f.name), crc = crc32(f.data), n = f.data.length, h = new DataView(new ArrayBuffer(30));
    h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(12, 0x21, true);
    h.setUint32(14, crc, true); h.setUint32(18, n, true); h.setUint32(22, n, true); h.setUint16(26, nm.length, true);
    parts.push(h, nm, f.data);
    const c = new DataView(new ArrayBuffer(46));
    c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint16(14, 0x21, true);
    c.setUint32(16, crc, true); c.setUint32(20, n, true); c.setUint32(24, n, true); c.setUint16(28, nm.length, true); c.setUint32(42, off, true);
    cd.push(c, nm); off += 30 + nm.length + n;
  }
  const size = cd.reduce((a, x) => a + x.byteLength, 0), e = new DataView(new ArrayBuffer(22));
  e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true); e.setUint32(12, size, true); e.setUint32(16, off, true);
  return new Blob(parts.concat(cd, [e]), { type: 'application/zip' });
}
async function unzipFiles(buf) {
  const u = new Uint8Array(buf), v = new DataView(buf), dec = new TextDecoder(); let e = -1;
  for (let i = u.length - 22; i >= Math.max(0, u.length - 65557); i--) if (v.getUint32(i, true) === 0x06054b50) { e = i; break; }
  if (e < 0) throw new Error('zip');
  const out = [], n = v.getUint16(e + 10, true); let p = v.getUint32(e + 16, true);
  for (let k = 0; k < n && p + 46 <= u.length; k++) {
    if (v.getUint32(p, true) !== 0x02014b50) break;
    const meth = v.getUint16(p + 10, true), csz = v.getUint32(p + 20, true), nl = v.getUint16(p + 28, true), xl = v.getUint16(p + 30, true), cl = v.getUint16(p + 32, true), lo = v.getUint32(p + 42, true);
    const name = dec.decode(u.subarray(p + 46, p + 46 + nl)); p += 46 + nl + xl + cl;
    if (name.endsWith('/') || /(^|\/)(__MACOSX|\.)/.test(name)) continue;
    const ds = lo + 30 + v.getUint16(lo + 26, true) + v.getUint16(lo + 28, true), raw = u.subarray(ds, ds + csz);
    let data = null;
    if (meth === 0) data = raw;
    else if (meth === 8 && window.DecompressionStream) { try { data = new Uint8Array(await new Response(new Blob([raw]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer()); } catch (er) {} }
    out.push({ name, data });
  }
  return out;
}
const imgFileSafe = s => String(s).replace(/[\\/:*?"<>|]/g, '_');
const imgNorm = s => imgFileSafe(fold(s)).replace(/\s+/g, ' ').trim();
const IMG_EXT = { 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/jpeg': 'jpg' };
const IMG_MIME = { png: 'image/png', webp: 'image/webp', gif: 'image/gif', jpg: 'image/jpeg', jpeg: 'image/jpeg', bmp: 'image/bmp', avif: 'image/avif' };
async function imgExport() {
  if (!IMGS.size) return;
  imgBusy = true; imgMsg = ''; imgRefresh();
  try {
    const files = [], used = new Set();
    for (const [k, v] of [...IMGS].sort((a, b) => a[0].localeCompare(b[0]))) {
      const ext = IMG_EXT[v.blob.type] || 'png', base = k[0] === 't' ? `trainers/${imgFileSafe(k.slice(2))}` : `pokemon/${imgFileSafe(k.slice(2))}${k[0] === 's' ? '-shiny' : ''}`;
      let name = `${base}.${ext}`; for (let i = 2; used.has(name); i++) name = `${base} (${i}).${ext}`; used.add(name);
      files.push({ name, data: new Uint8Array(await v.blob.arrayBuffer()) });
    }
    const blob = zipStore(files), filename = 'pokemon-league-gm-images.zip';
    if (downloadsNs) {
      try { await downloadsNs.save({ filename, data: blob }); imgMsg = `Exported ${files.length} images.`; }
      catch (e) { const c = e && e.code; imgMsg = c === 'declined' ? '' : c === 'rate_limited' ? 'A download is already waiting for your answer.' : "Couldn't download here."; }
    } else {
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      imgMsg = `Exported ${files.length} images (${fmtBytes(blob.size)}).`;
    }
  } catch (e) { imgMsg = "Couldn't build the image pack."; }
  imgBusy = false; imgRefresh();
}
// which key a file in an image pack belongs to, by its name (and folder)
function imgMatcher() {
  const sp = new Map(); for (const n of Object.keys(SP)) sp.set(imgNorm(n), n);
  const tr = new Map(), first = new Map();
  if (S) for (const t of Object.values(S.trainers)) { tr.set(imgNorm(trImgName(t)), trImgName(t)); const k = imgNorm(t.name); first.set(k, first.has(k) && first.get(k) !== trImgName(t) ? null : trImgName(t)); }
  for (const k of IMGS.keys()) if (k[0] === 't') tr.set(imgNorm(k.slice(2)), k.slice(2));
  return path => {
    const parts = String(path).split('/'), file = parts.pop(), dir = fold(parts.pop() || '');
    const em = file.match(/^(.*)\.([a-z0-9]+)$/i); if (!em || !IMG_MIME[em[2].toLowerCase()]) return null;
    let base = em[1].replace(/ \(\d+\)$/, ''), shiny = false; const sm = base.match(/^(.*?)[-_ ]shiny$/i); if (sm) { shiny = true; base = sm[1]; }
    const k = imgNorm(base);
    if (!/^trainers?$/.test(dir) && sp.has(k)) return (shiny ? 's:' : 'p:') + sp.get(k);
    if (shiny) return null;
    if (tr.has(k)) return 't:' + tr.get(k);
    if (first.get(k)) return 't:' + first.get(k);
    if (/^trainers?$/.test(dir)) return 't:' + base.trim();
    return null;
  };
}
async function imgImport(fileList) {
  const files = [...(fileList || [])]; if (!files.length) return;
  imgBusy = true; imgMsg = ''; imgRefresh();
  const items = [];
  for (const f of files) {
    if (/\.zip$/i.test(f.name) || f.type === 'application/zip' || f.type === 'application/x-zip-compressed') {
      try { for (const z of await unzipFiles(await f.arrayBuffer())) items.push(z); } catch (e) { items.push({ name: f.name, bad: true }); }
    } else items.push({ name: f.webkitRelativePath || f.name, blob: f });
  }
  const match = imgMatcher(), done = { p: 0, s: 0, t: 0 }, skipped = [];
  let failed = 0, stored = true;
  for (const it of items) {
    const key = it.bad ? null : match(it.name);
    if (!key) { if (!/\.(txt|md|json)$/i.test(it.name)) skipped.push(it.name.split('/').pop()); continue; }
    try {
      const ext = it.name.split('.').pop().toLowerCase();
      const blob = it.blob || (it.data && new Blob([it.data], { type: IMG_MIME[ext] || 'image/png' })); if (!blob) throw new Error('data');
      const img = await imgDecode(blob), w = img.naturalWidth, h = img.naturalHeight;
      // a pack's own 128 × 128 images are kept as they are; anything else is squared like an upload (small sprites as pixel art)
      const out = w === IMG_PX && h === IMG_PX && ['image/png', 'image/webp'].includes(blob.type) ? blob : await imgSquare(img, imgBounds(img), Math.max(w, h) <= IMG_PX, false);
      if (!(await imgSet(key, out))) stored = false;
      done[key[0]]++;
    } catch (e) { failed++; }
  }
  const n = done.p + done.s + done.t;
  imgMsg = `Imported ${n} image${n === 1 ? '' : 's'}${n ? ` (${done.p} Pokémon, ${done.s} shiny, ${done.t} trainer${done.t === 1 ? '' : 's'})` : ''}.`
    + (skipped.length ? ` ${skipped.length} file${skipped.length === 1 ? '' : 's'} didn't match a Pokémon or trainer: ${skipped.slice(0, 6).map(esc).join(', ')}${skipped.length > 6 ? '…' : ''}.` : '')
    + (failed ? ` ${failed} couldn't be opened.` : '') + (stored ? '' : " This browser won't keep images, so they'll be gone when the page closes.");
  imgBusy = false; imgRefresh();
}
async function imgClearAll() { const keys = [...IMGS.keys()]; for (const k of keys) imgUncache(k); try { await imgTx('readwrite', st => st.clear()); } catch (e) {} imgClearArm = false; imgMsg = `Removed ${keys.length} images.`; imgRefresh(); }
