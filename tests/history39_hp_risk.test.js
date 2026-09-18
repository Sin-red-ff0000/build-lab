'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert');global.window=global;global.localStorage={getItem:()=>null,setItem:()=>{},removeItem:()=>{}};
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const m of html.matchAll(/<script src="([^"?]+)/g)){const f=m[1];if(f.includes('/ui/')||f.endsWith('app.js'))continue;require(path.join(root,f));}
const BL=BuildLab,D=BL.Data;
assert(D.CARDS.blood_blade.damage<=12 && D.CARDS.blood_blade.damageIfRecovered===18);
assert(D.CARDS.blood_contract.buffNext<=.25 && D.CARDS.blood_contract.buffNextIfRecovered===.35);
assert.deepEqual(D.CARDS.blood_chain.hitsIfHpDirectionSwitches,{min:2,value:4});
assert(!D.CHARACTER_STYLES.risk_crisis.desc.includes('+35%'));
const src=fs.readFileSync(path.join(root,'js/core/battle.js'),'utf8');
for(const token of ['hpHistory','directionSwitches','halfCrossings','recoveries','recordHpChange'])assert(src.includes(token),`missing ${token}`);
console.log('PASS history39_hp_risk.test.js');
