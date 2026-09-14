'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert');global.window=global;const mem={};global.localStorage={getItem:k=>mem[k]??null,setItem:(k,v)=>mem[k]=String(v),removeItem:k=>delete mem[k]};
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const m of html.matchAll(/<script src="([^"?]+)/g)){const f=m[1];if(f.includes('/ui/')||f.endsWith('app.js'))continue;require(path.join(root,f));}
const D=BuildLab.Data;
const core=D.V34_BUILD_AXES,late=D.V35_FAMILIES;assert(core&&late,'build family definitions missing');
assert.equal(Object.keys(core).length,6,'基礎ビルドは6軸');assert.equal(Object.keys(late).length,8,'後発システムビルドは8軸');
const families={...core,...late};const rewarded=new Set(D.UNLOCKS.flatMap(u=>u.reward||[]));
for(const [id,f] of Object.entries(families)){
  assert.equal(f.cards.length,6,`${id}: card choices must be 6`);assert.equal(f.relics.length,6,`${id}: relic choices must be 6`);
  assert.equal(new Set(f.cards).size,6,`${id}: duplicate cards`);assert.equal(new Set(f.relics).size,6,`${id}: duplicate relics`);
  for(const cid of f.cards){assert(D.CARDS[cid],`${id}: missing card ${cid}`);assert(rewarded.has(cid),`${id}: card has no unlock route ${cid}`);}
  for(const rid of f.relics){assert(D.RELICS[rid],`${id}: missing relic ${rid}`);assert(rewarded.has(rid),`${id}: relic has no unlock route ${rid}`);}
  const cardRoles=new Set(f.cards.map(x=>{const c=D.CARDS[x];const q={...c};delete q.name;delete q.desc;delete q.tags;return JSON.stringify(q);}));assert(cardRoles.size>=5,`${id}: six cards lack functional choice diversity`);
}
assert.equal(D.V35_CARD_IDS.length,48,'v35 should add 48 cards');assert.equal(D.V35_RELIC_IDS.length,48,'v35 should add 48 relics');
console.log('PASS expansion35_build_families.test.js: 14 builds × (6 cards + 6 relics)');
