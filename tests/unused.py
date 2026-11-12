# Lists functions and click handlers nothing in the game can reach (the test export list does not count as a use).
# Usage: python3 tests/unused.py   (no output = nothing unused)
import re,sys,os
src=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'game')
files=['1-page.html','3-engine-1.js','4-engine-2.js','4b-engine-2b.js','4c-engine-2c.js','5-engine-3.js','6-ui-1.js','7-ui-2.js','8-ui-3.js']
nodes={}; root=''
for f in files:
    L=open(os.path.join(src,f),encoding='utf-8').read().split('\n')
    i=0
    while i<len(L):
        m=re.match(r'^(?:async )?function\s+([A-Za-z_$][\w$]*)\s*\(',L[i]) or re.match(r"^document\.addEventListener\('(click)', ev => \{$",L[i])
        if m:
            j=i
            if L[i].count('{')!=L[i].count('}'):
                j=i+1
                while j<len(L) and not L[j].startswith('}'): j+=1
            body=L[i:j+1]
            # split cases
            if any(re.match(r"^    case '[\w-]+':",x) for x in body):
                rest=[];k=0
                while k<len(body):
                    cm=re.match(r"^    case '([\w-]+)':",body[k])
                    if cm:
                        e=k+1
                        while e<len(body) and not re.match(r"^    (case |default)|^  \}",body[e]): e+=1
                        # multiple case labels on one line
                        labs=re.findall(r"case '([\w-]+)':",body[k].split('{')[0]) or [cm.group(1)]
                        nodes['case:'+'|'.join(labs)]=(f,i+1+k,i+e,'\n'.join(body[k:e]))
                        k=e
                    else: rest.append(body[k]);k+=1
                nodes[m.group(1)]=(f,i+1,j+1,'\n'.join(rest)); root+=' click ' if m.group(1)=='click' else ''
            else: nodes[m.group(1)]=(f,i+1,j+1,'\n'.join(body))
            i=j+1
        else:
            if 'module.exports' in L[i]:
                while i<len(L) and '}' not in L[i]: i+=1
                i+=1; continue
            root+=L[i]+'\n'; i+=1
nodes.setdefault('click',('',0,0,''));fn=set(k for k in nodes if not k.startswith('case:'))
idre=re.compile(r'[A-Za-z_$][\w$]*')
seen=set(); text=root
changed=True
alive_text=[root]
def acts(t): return set(re.findall(r"data-act=\\?[\"']([\w-]+)",t))|set(re.findall(r"'([\w-]+)'",t))
A=acts(root)
stack=list(set(idre.findall(root))&fn)
while True:
    while stack:
        n=stack.pop()
        if n in seen: continue
        seen.add(n); t=nodes[n][3]
        A|=acts(t) if not n.startswith('case:') else set(re.findall(r"data-act=\\?[\"']([\w-]+)",t))
        stack.extend((set(idre.findall(t))&fn)-seen)
    new=[k for k in nodes if k.startswith('case:') and k not in seen and set(k[5:].split('|'))&A]
    if not new: break
    stack=new
dead=sorted((v[0],v[1],v[2],k) for k,v in nodes.items() if k not in seen)
tot=0
for f,s,e,k in dead: print(f,s,e,k); tot+=e-s+1
print('dead',len(dead),'lines',tot,file=sys.stderr)
