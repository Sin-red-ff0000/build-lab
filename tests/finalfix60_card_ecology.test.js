'use strict';const fs=require('fs'),path=require('path'),assert=require('assert');global.window=global;const mem={};global.localStorage={getItem:k=>mem[k]??null,setItem:(k,v)=>mem[k]=String(v),removeItem:k=>delete mem[k]};const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const m of html.matchAll(/<script src="([^"?]+)/g)){const f=m[1];if(f.includes('/ui/')||f.endsWith('app.js'))continue;require(path.join(root,f));}const D=BuildLab.Data;
assert(D.V60_FINALFIX2_CARD_IDS.length>=40,'v0.60 must cover a broad second-pass set');
assert.equal(D.CARDS.v18_sevenfold_pierce.vanishAfterUse,true,'sevenfold pierce must really vanish in battle engine');
const sig=c=>JSON.stringify({nb:c.nextBlockFlat||0,ns:c.nextStatusFlat||0,one:c.primeSingleHitBuff||0,bottom:!!c.returnBottom,van:!!c.vanishAfterUse,resPrev:!!c.reserveSelfOnPrevAttack,resShuffle:!!c.reserveSelfOnReshuffle,stable:!!c.stableGuard,anchor:!!c.poisonAnchor});
for(const group of [
 ['sealed_wall','v26_fire_guard','v26_water_guard','v26_earth_guard','v26_aether_guard'],
 ['blood_return','crimson_peak','redline_cut','crisis_edge'],
 ['endurance_cut','patient_execution','tempered_edge','patient_edge'],
 ['rebirth_guard','return_wall','return_fortress','v17_return_wall'],
 ['cycle_barrage_plus','echo_flurry','recycle_flurry','v17_cycle_barrage'],
 ['recovery_run','recycle_dash'],['toxic_cascade','swift_toxin'],['frenzy_guard','rapid_guard'],['left_guard','wing_parry'],['residue_bridge','left_residue'],['relay_wall','relay_shield']
]){const xs=group.map(id=>sig(D.CARDS[id]));assert.equal(new Set(xs).size,xs.length,'role exits collide: '+group.join(','));}
for(const id of D.V60_FINALFIX2_CARD_IDS){const c=D.CARDS[id];assert(c.desc&&c.desc.length>8,id+' missing desc');const raw=(c.damage||0)*(c.hits||1);assert(raw<=24,id+' raw damage inflation '+raw);assert((c.block||0)<=20,id+' raw block inflation');}
console.log('PASS finalfix60_card_ecology.test.js');
