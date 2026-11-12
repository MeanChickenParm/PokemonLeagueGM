# Plays three seasons through the real page in a headless browser, opening every view in every phase and using the
# trade desk, step-down ask and god-mode editor. Usage: python3 tests/browser.py "$PWD/dist/Pokémon League GM.html"
import asyncio, sys, json
from playwright.async_api import async_playwright
async def run(path):
    errs=[]
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':420,'height':900})
        pg.on('pageerror', lambda e: errs.append('PAGEERR '+str(e)))
        pg.on('console', lambda m: errs.append('CONSOLE '+m.text) if m.type=='error' else None)
        await pg.goto('file://'+path)
        await pg.wait_for_timeout(500)
        # setup: god mode on, 2 leagues
        await pg.evaluate("""() => { setupLeagues=2; setupParties=2; setupGod=true; setupGrowth=true; }""")
        await pg.evaluate("""() => { document.querySelector('[data-act=pickorg]') ? document.querySelector('[data-act=pickorg]').click() : (newWorld(ALL_ORG_KEYS[0],{leagues:2,parties:2,god:true,growth:true,teams:4}), render()); }""")
        await pg.wait_for_timeout(300)
        out=await pg.evaluate("""() => {
          const log=[]; const views=['office','party','trade','god','ranch','circuit','gyms','news','history','records','hof','dex','trainers','tourney','updates'];
          const tour=tag=>{ for(const v of views){ try{ go(v); if(!document.querySelector('#app, main, .wrap')) log.push(tag+' empty '+v); }catch(e){ log.push(tag+' '+v+': '+e.message); } } };
          const click=sel=>{ const el=document.querySelector(sel); if(el){ el.click(); return true;} return false; };
          let guard=0;
          // play 3 seasons through the real UI flows, touring the views in each phase
          const seen={};
          while(S.season<3 && guard++<3000){
            const ph=S.phase+(S.phase==='season'&&S.tourneyPause?'-pause':'');
            if(!seen[ph+S.season]){ seen[ph+S.season]=1; tour(ph);
              if(ph==='offseason'||ph==='reassign'){ go('trade'); const mine=[...document.querySelectorAll('[data-act=deskgive]')], th=[...document.querySelectorAll('[data-act=deskget]')];
                if(mine.length&&th.length){ mine[mine.length-1].click(); document.querySelectorAll('[data-act=deskget]')[th.length-1].click(); click('[data-act=deskpick]'); click('[data-act=deskpick]');
                  const goB=document.querySelector('[data-act=deskgo]'); log.push('desk verdict: '+(goB.disabled?'no':'yes')); if(!goB.disabled) goB.click(); } else log.push('desk rows missing '+mine.length+' '+th.length);
                go('party'); if(click('[data-act=askdown]')) { log.push('asked down'); click('[data-act=askout]'); }
                go('god'); if(click('[data-act=godpick]')){ const n=document.querySelector('#ge-age'); if(n){ n.value='33'; click('[data-act=godsave]'); log.push('god saved'); } click('[data-act=godpick]'); click('[data-act=godslot]');
                  click('[data-act=godpick]'); const mv=[...document.querySelectorAll('[data-act=godmove]')].find(b=>!b.disabled); if(mv){ mv.click(); log.push('god moved'); } }
                click('[data-act=godteamsel][data-k=_ind]'); click('[data-act=godpick]'); }
              if(ph==='season-pause'){ go('party'); if(click('[data-act=sitopen]')){ if(click('[data-act=sit]')) log.push('midseason sit'); } }
            }
            try{ autoStep(); render(); }catch(e){ log.push('autoStep '+S.phase+': '+e.message); break; }
          }
          log.push('season '+S.season+' phase '+S.phase+' ver '+UPDATES[0].ver);
          return log; }""")
        print(json.dumps(out,indent=0)[:3000])
        await pg.screenshot(path='/tmp/shot.png')
        await b.close()
    print('ERRORS',len(errs)); [print(e[:300]) for e in errs[:10]]
asyncio.run(run(sys.argv[1]))
