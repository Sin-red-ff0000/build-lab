'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert');global.window=global;global.localStorage={getItem:()=>null,setItem:()=>{},removeItem:()=>{}};
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const m of html.matchAll(/<script src="([^"?]+)/g)){const f=m[1];if(f.includes('/ui/')||f.endsWith('app.js'))continue;require(path.join(root,f));}
const D=BuildLab.Data;
const c=D.CARDS.v35_p_center,w=D.CARDS.v35_p_wings,sh=D.CARDS.v35_p_shift,r=D.CARDS.v35_p_repeat;
assert(c.damage<=14&&c.block<=12,'中枢収束砲は素の数値を巨大化させない');
assert(c.damagePerCenterChain?.max<=8&&c.blockPerCenterChain?.max<=8,'中央継続は小さな積み上げ');
assert(w.damagePerSideAlternation&&sh.blockPerPositionChange&&r.damagePerSamePosition,'提示位置6択のうち主要4系統が位置履歴を利用する');
const battle=fs.readFileSync(path.join(root,'js/core/battle.js'),'utf8');
for(const key of ['positionHistory','centerChain','sideAlternations','damagePerCenterChain','blockPerPositionChange'])assert(battle.includes(key),key+' が戦闘エンジンに存在');
console.log('PASS position44_mastery.test.js');
