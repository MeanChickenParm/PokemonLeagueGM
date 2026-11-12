// invariants sim: node sim.js <leagues> <teams> <parties> <growth> <seasons> [god]
const g=require(require('path').join(__dirname, '..', 'dist', 'engine-node.js'));
const [L,Tm,P,G,N,GOD]=process.argv.slice(2).map(Number);
g.newWorld(g.ALL_ORG_KEYS[0],{leagues:L,teams:Tm,parties:P,growth:!!G,god:!!GOD});
const S=()=>g.S; let trades=0,downs=0,gods=0,fail=[];
function check(tag){
  const by={};
  for(const t of Object.values(S().trainers)){ if(t.role!=='challenger'||!t.org) continue; const k=t.org+':'+(t.lg||0); (by[k]=by[k]||[]).push(t);
    if(t.team.filter(m=>m.loan).length>1) fail.push(tag+' two loans '+t.name);
    if(!S().orgs[t.org].roster.includes(t.id)) fail.push(tag+' not in roster '+t.name); }
  for(const [k,P] of Object.entries(by)){ const c=s=>P.filter(t=>t.slot===s).length;
    if(P.length>6||c('chaser')>3||c('companion')>2||c('apprentice')>1) fail.push(tag+' party caps '+k+' '+P.length+' '+c('chaser')+c('companion')+c('apprentice')); }
  for(const [k,o] of Object.entries(S().orgs)) for(const id of o.roster){ const t=S().trainers[id]; if(!t||t.org!==k) fail.push(tag+' roster ghost '+k+' '+id); }
}
const rnd=a=>a[Math.floor(Math.random()*a.length)];
function userActs(){
  const k=S().userOrg, orgs=Object.keys(S().orgs).filter(x=>x!==k);
  const mine=Object.values(S().trainers).filter(t=>t.org===k&&t.role==='challenger');
  // try trades
  for(let n=0;n<6;n++){ const k2=rnd(orgs); const theirs=Object.values(S().trainers).filter(t=>t.org===k2&&t.role==='challenger'); if(!theirs.length||!mine.length) continue;
    const give=[...new Set([rnd(mine),rnd(mine),rnd(mine)].slice(0,1+n%3).map(t=>t.id))], get=[...new Set([rnd(theirs),rnd(theirs)].slice(0,1+n%2).map(t=>t.id))];
    const c=g.tradeCheck(k2,give,get,n%2===0); if(c.ok){ const w=g.tradeMany(k2,give,get,n%2===0); if(w) fail.push('tradeMany '+w); else {trades++; check('trade'); break;} } }
  const ch=Object.values(S().trainers).filter(t=>t.org===k&&t.role==='challenger'&&g.canAskDown(t));
  if(ch.length){ const t=rnd(ch); const r=g.askStepDown(t.id); if(r){downs++; if(!r.ok) g.answerAskOut(t.id, Math.random()<0.5);} check('down'); }
  if(GOD){ const all=Object.values(S().trainers).filter(t=>t.role==='challenger'); const t=rnd(all); const k2=rnd(Object.keys(S().orgs));
    const lgs=(S().orgs[k2].lgs)||[...Array((S().leagues||[1]).length).keys()]; const w=g.godMove(t.id, Math.random()<0.2?null:k2, rnd(lgs)); if(!w) gods++; check('godmove '+w);
    const p=rnd(Object.values(S().trainers).filter(t=>t.role==='challenger'&&t.org)); if(p){ g.godSlot(p.id, rnd(['chaser','companion','apprentice'])); check('godslot'); g.godEdit(p.id,'age',30); g.godEdit(p.id,'str',99); g.godEdit(p.id,'apt:coach',80); g.godEdit(p.id,'amb','title'); }
  }
}
for(let i=0;i<N;i++){
  // step through the offseason by hand so user actions happen in the right phases
  let guard=0; const start=S().season;
  while(S().season===start && guard++<400){ const ph=S().phase;
    if((ph==='offseason'||ph==='reassign') && Math.random()<0.5) userActs();
    g.autoStep ? g.autoStep() : g.simOneSeason(); }
  if(guard>=400) fail.push('stuck '+S().phase);
  check('s'+S().season);
}
console.log(fail.length?'FAIL '+[...new Set(fail)].slice(0,8).join(' | '):'ok',L,Tm,P,G,'season',S().season,'trainers',Object.keys(S().trainers).length,'trades',trades,'downs',downs,'god',gods);
