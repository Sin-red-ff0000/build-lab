'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const scripts=[...html.matchAll(/<script src="([^"]+)"/g)].map(x=>x[1].split('?')[0]).filter(x=>x.startsWith('js/data/'));
const ctx={window:{BuildLab:{Data:{}}},console};ctx.window.window=ctx.window;vm.createContext(ctx);
for(const s of scripts){const p=path.join(root,s);if(fs.existsSync(p))vm.runInContext(fs.readFileSync(p,'utf8'),ctx,{filename:s});}
const D=ctx.window.BuildLab.Data;
const chars=['vanisher','watcher','scribe','provocateur','reverser','morph'];
for(const id of chars)if(!D.CHARACTERS[id])throw new Error('missing character '+id);
if((D.V53_STYLE_IDS||[]).length!==18)throw new Error('expected 18 new styles');
for(const id of D.V53_STYLE_IDS){const rules=D.V53_STYLE_RULES[id]||[];for(const r of rules)if((r.mult||1)>1.12)throw new Error('inflated style '+id);}
const unlocks=(D.UNLOCKS||[]).filter(x=>String(x.id).startsWith('v53_'));
if(unlocks.length!==6)throw new Error('expected 6 unlock groups');
const battle=fs.readFileSync(path.join(root,'js/core/battle.js'),'utf8');
for(const token of ['D.V53_STYLE_RULES','state().character===\'provocateur\'','state().character===\'reverser\'','state().character===\'morph\''])if(!battle.includes(token))throw new Error('battle integration missing '+token);
console.log('build53_ecology.test.js: PASS',chars.length,'characters',D.V53_STYLE_IDS.length,'styles');
