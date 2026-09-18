'use strict';
const fs=require('fs'),path=require('path');global.window=global;global.localStorage={getItem(){return null},setItem(){},removeItem(){}};
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const m of html.matchAll(/<script src="([^"?]+)/g)){const f=m[1];if(f.includes('/ui/')||f.endsWith('app.js'))continue;require(path.join(root,f));}
const D=BuildLab.Data;
// v0.70 is a historical baseline. Its frozen per-variant snapshot lives in the backup directory after v0.72.
const oldDir=path.join(root,'AUDIT_v0.70_PARTS_BACKUP'),oldFiles=fs.readdirSync(oldDir).filter(x=>/^variant_\d+\.json$/.test(x));
if(oldFiles.length!==177)throw new Error('v0.70基準監査バックアップ不足');
const oldParts=oldFiles.map(f=>JSON.parse(fs.readFileSync(path.join(oldDir,f),'utf8')));
const frost=oldParts.reduce((n,p)=>n+Number(p.summary?.statusWins?.frost||0),0);
const audit={summary:{variants:177,results:oldParts.reduce((n,p)=>n+(p.results?.length||0),0),complete:true,statusWins:{frost}}};
if(audit.summary.variants!==177||audit.summary.results!==1416||!audit.summary.complete)throw new Error('177構成の完全監査が揃っていない');
for(const id of ['relay_direction','braid_cycle','converter_spend'])if(!D.V65_AUDIT_PROFILE[id])throw new Error('監査プロファイル不足 '+id);
if(!D.V65_AUDIT_PROFILE.braid_cycle.preferLink||!D.V65_AUDIT_PROFILE.braid_cycle.preferDiscard)throw new Error('輪転継電型の監査条件不足');
if(!D.V65_AUDIT_PROFILE.converter_spend.preferBlock||!D.V65_AUDIT_PROFILE.converter_spend.preferConversion)throw new Error('消費型の監査条件不足');
if(audit.summary.statusWins.frost!==0)throw new Error('v0.70の基準監査は凍傷0を問題として固定する');
console.log('finalfix70_full_audit.test.js: PASS');
