'use strict';
const fs=require('fs'),path=require('path');global.window=global;global.localStorage={getItem(){return null},setItem(){},removeItem(){}};
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const m of html.matchAll(/<script src="([^"?]+)/g)){const f=m[1];if(f.includes('/ui/')||f.endsWith('app.js'))continue;require(path.join(root,f));}
const D=BuildLab.Data,V=D.V71_FINAL_FOLLOWUP;if(!V)throw new Error('v0.71 follow-up missing');
if(V.frost.decayPerEnemyTurn!==1||V.frost.penaltyRatio!==.40)throw new Error('凍傷の短期抑制仕様が不正');
for(const id of V.frost.cards){const c=D.CARDS[id];if(!c||!c.tags.includes('凍傷')||c.status?.type!=='frost')throw new Error('凍傷入口不正 '+id);if((c.damage||0)>12||(c.block||0)>12)throw new Error('凍傷を巨大素数値で救済している '+id);}
const a=D.ENDGAME58.trials.long_attrition.enemy;if(a.hp<4||a.def<2||a.regen<1)throw new Error('消耗校正を通常戦まで過易化している');
for(const id of V.targetedReaudit)if(!D.V65_AUDIT_PROFILE[id])throw new Error('未勝利構成の再監査プロファイル不足 '+id);
const runner=fs.readFileSync(path.join(root,'tools/endgame65_multiseed_audit.js'),'utf8');if(!runner.includes('if(profile.preferLink)')||!runner.includes('s.cardLink={a:pair[0],b:pair[1]}'))throw new Error('連結スタイルの監査器が連結設定を行っていない');
console.log('finalfix71_followup.test.js: PASS');
