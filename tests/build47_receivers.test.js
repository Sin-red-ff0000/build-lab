'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert');global.window=global;const mem={};global.localStorage={getItem:k=>mem[k]??null,setItem:(k,v)=>mem[k]=String(v),removeItem:k=>delete mem[k]};
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const m of html.matchAll(/<script src="([^"?]+)/g)){const f=m[1];if(f.includes('/ui/')||f.endsWith('app.js'))continue;require(path.join(root,f));}
const BL=global.BuildLab,D=BL.Data;
assert.deepEqual(D.V47_CHARACTER_IDS.sort(),['breaker','converter','keeper']);assert.equal(D.V47_STYLE_IDS.length,9);
const rewarded=new Set(D.UNLOCKS.flatMap(u=>u.reward||[]));for(const id of [...D.V47_CHARACTER_IDS,...D.V47_STYLE_IDS])assert(rewarded.has(id),'missing unlock '+id);
for(const id of D.V47_STYLE_IDS){const st=D.CHARACTER_STYLES[id];assert(st.requiresUnlock,'style must be unlockable '+id);assert(!/\+([5-9]\d|\d{3,})%/.test(st.desc),'v47 style reintroduced giant percentage '+id);}
assert(/防御を最大6消費/.test(D.CHARACTERS.converter.desc));assert(/1ヒット/.test(D.CHARACTERS.breaker.desc));assert(/保持/.test(D.CHARACTERS.keeper.desc));
// Existing low-output cards are intentional receivers: no card text inflation.
assert.equal(D.CARDS.triple_cut.damage,3);assert.equal(D.CARDS.triple_cut.hits,3);assert.equal(D.CARDS.double_strike.damage,4);assert.equal(D.CARDS.wall.block,9);
console.log('PASS build47_receivers.test.js');
