'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert');
global.window=global;global.localStorage={getItem(){return null},setItem(){},removeItem(){}};
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const m of html.matchAll(/<script src="([^"?]+)/g)){const f=m[1];if(f.includes('/ui/')||f.endsWith('app.js'))continue;require(path.join(root,f));}
assert(parseFloat(BuildLab.Data.ENDGAME58.version)>=0.64);assert(BuildLab.Data.V64_AUDIT_INTEGRITY.seeds===3);
const src=fs.readFileSync(path.join(root,'tools/endgame64_multiseed_audit.js'),'utf8');
assert(src.includes("st?.id==='echo_singleton'"),'孤響型の1枚制約を探索器が尊重していない');
assert(src.includes('k<3'),'3シード実戦が探索器に固定されていない');
assert(src.includes("version:'0.64-multiseed-audit'"),'監査バージョン不整合');
console.log('PASS finalfix64_audit_integrity.test.js');
