'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..');
const files=[
  'js/data/gameData.js','js/data/protocols.js','js/data/tunings.js','js/data/conversions.js','js/data/chapter3.js','js/data/expansion08.js','js/data/expansion09.js','js/data/doctrines.js','js/data/characterStyles.js','js/data/expansion10.js','js/data/expansion11.js','js/data/expansion12.js','js/data/enemyBehaviors.js','js/data/expansion13.js','js/data/expansion14.js','js/data/expansion17.js','js/data/expansion18.js','js/data/expansion19.js','js/data/runes.js','js/data/arcana.js','js/data/expansion20.js','js/data/balance22.js','js/data/guides.js','js/data/guides20.js'
];
const ctx={window:{},console};ctx.window.BuildLab={Data:{}};vm.createContext(ctx);
for(const f of files)vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f});
const D=ctx.window.BuildLab.Data,assert=(x,m)=>{if(!x)throw new Error(m)};
const refs=D.GUIDE_REFERENCE_GROUPS||{};
assert((refs.tunings||[]).length===Object.keys(D.TUNINGS||{}).length,`tuning guide refs ${(refs.tunings||[]).length}`);
assert((refs.conversions||[]).length===7,`conversion guide refs ${(refs.conversions||[]).length}`);
assert((refs.doctrines||[]).length===6,`doctrine guide refs ${(refs.doctrines||[]).length}`);
assert((refs.styles||[]).length===Object.keys(D.CHARACTER_STYLES||{}).length,`style guide refs ${(refs.styles||[]).length}`);
assert((refs.linkmodes||[]).length===4,`link mode guide refs ${(refs.linkmodes||[]).length}`);
assert((refs.behaviors||[]).length===Object.keys(D.ENEMY_BEHAVIORS||{}).length,`behavior guide refs ${(refs.behaviors||[]).length}`);
for(const r of refs.tunings){assert(r.name&&r.desc,'incomplete tuning ref');assert(r.use&&r.caution,`tuning usage/caution missing ${r.id}`);}
for(const r of refs.conversions){assert(r.name&&r.desc&&r.use&&r.caution,`conversion details missing ${r.id}`);}
assert((D.SYSTEM_GUIDES||[]).some(g=>g.id==='stacking'),'stacking guide missing');
console.log('PASS guide_detail.test.js', {tunings:refs.tunings.length,conversions:refs.conversions.length,styles:refs.styles.length,behaviors:refs.behaviors.length});
