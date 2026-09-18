'use strict';
const fs=require('fs'),path=require('path');global.window=global;global.localStorage={getItem(){return null},setItem(){},removeItem(){}};
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const m of html.matchAll(/<script src="([^"?]+)/g)){const f=m[1];if(f.includes('/ui/')||f.endsWith('app.js'))continue;require(path.join(root,f));}
const D=BuildLab.Data,V=D.V73_REAUDIT_PROGRESS;if(!V||V.requiredVariants!==177||V.completedVariants!==48||V.seeds!==3||!V.partialResultsMayNotTuneBalance||!V.finalPassRequiresCompleteReaudit||V.gameplayBalanceChangedFromPartialResults)throw new Error('v0.73再監査ゲート不正');
const dir=path.join(root,'AUDIT_v0.66_PARTS'),files=fs.readdirSync(dir).filter(x=>/^variant_\d+\.json$/.test(x));if(files.length<48||files.length>177)throw new Error('v0.73以降の監査進捗不一致: '+files.length);
if(!fs.existsSync(path.join(root,'AUDIT_v0.70_PARTS_BACKUP')))throw new Error('旧完全監査の退避がない');
console.log('finalfix73_reaudit_progress.test.js: PASS ('+files.length+'/177)');
