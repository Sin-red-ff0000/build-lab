'use strict';const fs=require('fs'),path=require('path'),assert=require('assert');global.window=global;const mem={};global.localStorage={getItem:k=>mem[k]??null,setItem:(k,v)=>mem[k]=String(v),removeItem:k=>delete mem[k]};const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const m of html.matchAll(/<script src="([^"?]+)/g)){const f=m[1];if(f.includes('/ui/')||f.endsWith('app.js'))continue;require(path.join(root,f));}const D=BuildLab.Data;
assert.equal(D.V55_REDESIGNED_CARD_IDS.length,48);assert.equal(new Set(D.V55_REDESIGNED_CARD_IDS).size,48);
for(const id of D.V55_REDESIGNED_CARD_IDS){const c=D.CARDS[id];assert(c,id);assert(c.desc.length>10,id);assert((c.damage||0)*(c.hits||1)<30,id+' base damage');assert((c.block||0)<20,id+' block');const rr=D.V35_CARD_RULES[id]||[];assert(rr.every(r=>(r.mult||1)<=1.12),id+' old multiplier survived');}
for(const [k,v] of Object.entries(D.V55_FAMILY_BUCKETS))assert.equal(v.length,6,k);
assert(D.CARDS.v35_e_fire.status?.type==='burn');assert(D.CARDS.v35_e_water.heal===2);assert(D.CARDS.v35_e_earth.block>=10);assert(D.CARDS.v35_x_barrage.status?.type==='bleed');
assert(D.CARDS.v35_p_narrow.damage<10 && D.CARDS.v35_p_narrow.block<8,'narrow decree must not return to old generic stat stick');
console.log('PASS balance55_cards_back.test.js');
