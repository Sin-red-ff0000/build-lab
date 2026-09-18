'use strict';
const fs=require('fs'),path=require('path');global.window=global;global.localStorage={getItem(){return null},setItem(){},removeItem(){}};
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const m of html.matchAll(/<script src=\"([^\"?]+)/g)){const f=m[1];if(f.includes('/ui/')||f.endsWith('app.js'))continue;require(path.join(root,f));}
const D=BuildLab.Data,V=D.V75_ATTRITION_CLOSEOUT;if(!V)throw new Error('v0.75 attrition closeout missing');
const a=D.ENDGAME58.trials.long_attrition.enemy;if(a.hp!==4.3||a.def!==2.15||a.regen!==1||a.resist!==22)throw new Error('消耗校正を監査値合わせで追加弱体化している');
if(V.scope!=='long_attrition only'||!V.policy.includes('全件監査は再実行しない'))throw new Error('局所収束方針が不正');
const runner=fs.readFileSync(path.join(root,'tools/endgame65_multiseed_audit.js'),'utf8');if(!runner.includes('ONLY_TRIAL')||!runner.includes("trial.id==='long_attrition'?60:20"))throw new Error('長期戦用局所監査窓がない');
console.log('finalfix75_attrition_closeout.test.js: PASS');
