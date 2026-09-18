'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert');global.window=global;global.localStorage={getItem(){return null},setItem(){},removeItem(){}};const root=path.resolve(__dirname,'..');const html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const m of html.matchAll(/<script src="([^"?]+)/g)){const f=m[1];if(f.includes('/ui/')||f.endsWith('app.js'))continue;require(path.join(root,f));}
const D=BuildLab.Data,E=D.ENDGAME58,a=JSON.parse(fs.readFileSync(path.join(root,'AUDIT_v0.62_REAL_COMBAT.json'),'utf8'));
assert(parseFloat(E.version)>=0.62);assert.equal(a.summary.variants,177);assert.equal(a.summary.battleRuns,1416);assert.equal(a.summary.coverage.variantsWithAnyWin,177,'v0.62一次探索で未勝利構成が残る');
assert(D.CARDS.v34_s_plague.block<=10&&D.CARDS.v34_s_plague.statuses[0].amount<=5,'深層汚染が万能札のまま');assert(D.CARDS.v34_c_reset.buffNext<=.12,'全域再編が巨大循環バフのまま');assert(D.V23_STYLE_RULES.zephyr_mist.length>=2,'霧流型の非錬成時ルートがない');
const rates=Object.values(a.summary.byTrial).map(x=>x.won/x.total);assert(Math.max(...rates)-Math.min(...rates)<.5,'校正間格差がまだ極端すぎる');
console.log('PASS finalfix62_combat_recalibration.test.js');
