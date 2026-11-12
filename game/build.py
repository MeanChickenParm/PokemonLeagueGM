#!/usr/bin/env python3
"""Pokémon League GM build: joins the source pieces into the finished game.

Usage: python3 build.py [source folder] [output folder]   (defaults: this file's folder, ./dist)

Makes:
  Pokémon League GM.html          the whole game in one file (the Pokémon data inline)
  itch/index.html + itch/pokemon-data.js, zipped as pokemon-league-gm-v<N>-itch.zip
  engine-node.js                  data + engine as one script, for running tests in Node
"""
import os, re, sys, zipfile

SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[2] if len(sys.argv) > 2 else 'dist'
PAGE, DATA, END = '1-page.html', '2-pokemon-data.js', '9-end.html'
ENGINE = ['3-engine-1.js', '4-engine-2.js', '4b-engine-2b.js', '5-engine-3.js']
UI = ['6-ui-1.js', '7-ui-2.js', '8-ui-3.js']
# a piece over this size can't be read back whole by a later chat, so the build refuses it
LIMIT = 240_000

def read(name):
    p = os.path.join(SRC, name)
    if os.path.getsize(p) > LIMIT:
        raise SystemExit(f'{name} is {os.path.getsize(p):,} bytes, over the {LIMIT:,} limit. Split it in two (and list the new piece in build.py).')
    s = open(p, encoding='utf-8').read()
    return s[:-1] if s.endswith('\n') else s

page, data, end = read(PAGE), read(DATA), read(END)
engine = '\n'.join(read(f) for f in ENGINE)
ui = '\n'.join(read(f) for f in UI)
_m = re.search(r"const UPDATES = \[\s*\{ id: (\d+)(?:, ver: '([^']+)')?", ui)
ver = _m.group(2) or _m.group(1)

def html(data_tag):
    return f'{page}\n{data_tag}\n<script>\n{engine}\n</script>\n<script>\n{ui}\n</script>\n{end}'

os.makedirs(os.path.join(OUT, 'itch'), exist_ok=True)
single = os.path.join(OUT, 'Pokémon League GM.html')
open(single, 'w', encoding='utf-8').write(html(f'<script>\n{data}\n</script>'))
open(os.path.join(OUT, 'itch', 'index.html'), 'w', encoding='utf-8').write(html('<script src="pokemon-data.js"></script>'))
open(os.path.join(OUT, 'itch', 'pokemon-data.js'), 'w', encoding='utf-8').write(data + '\n')
z = os.path.join(OUT, f'pokemon-league-gm-v{ver}-itch.zip')
with zipfile.ZipFile(z, 'w', zipfile.ZIP_DEFLATED) as zf:
    for f in ('index.html', 'pokemon-data.js'): zf.write(os.path.join(OUT, 'itch', f), f)
open(os.path.join(OUT, 'engine-node.js'), 'w', encoding='utf-8').write(data + '\n' + engine + '\n')
print(f'v{ver}: {single} ({os.path.getsize(single):,} bytes), {z}')
