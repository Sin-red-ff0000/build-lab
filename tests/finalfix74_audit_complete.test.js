'use strict';
const fs=require('fs'),path=require('path');global.window=global;global.localStorage={getItem(){return null},setItem(){},removeItem(){}};
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const m of html.matchAll(/<script src="([^"?]+)/g)){const f=m[1];if(f.includes('/ui/')||f.endsWith('app.js'))continue;require(path.join(root,f));}
function ok(x,m){if(!x)throw new Error(m)}
const A=BuildLab.Data.V74_FINAL_AUDIT, complete=JSON.parse(fs.readFileSync(path.join(root,'AUDIT_v0.66_MULTISEED_COMPLETE.json'),'utf8')).summary;
ok(A&&A.complete&&A.completedVariants===177,'v0.74 final audit must be complete 177/177');
ok(complete.variants===177&&complete.results===1416&&complete.coverage.variantsWithAnyWin===177,'merged audit coverage mismatch');
ok((complete.failedVariants||[]).length===0,'zero-win variants remain');
ok(complete.statusWins.frost>0,'frost must no longer be zero-use in winning builds');
ok(complete.byTrial.long_attrition.won===11,'long attrition blocker baseline changed unexpectedly');
ok(A.blockingFindings.extremeTrialSkew&&A.followupRequired.length===1&&A.followupRequired[0]==='long_attrition','only local long_attrition blocker should remain');
ok(A.policy.includes('177構成を再リセットしない'),'must freeze full re-audit loop');
console.log('finalfix74 complete audit passed');
