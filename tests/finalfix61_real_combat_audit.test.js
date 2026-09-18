'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert');const root=path.resolve(__dirname,'..');
const audit=JSON.parse(fs.readFileSync(path.join(root,'AUDIT_v0.61_REAL_COMBAT.json'),'utf8'));
assert.equal(audit.summary.variants,177,'177構成を実戦監査していない');
assert.equal(audit.summary.trials,8,'8校正を実戦監査していない');
assert.equal(audit.results.length,177*8,'177×8の実戦結果が揃っていない');
for(const r of audit.results){assert(r.variant&&r.trial&&Array.isArray(r.deck)&&r.deck.length===10,'実戦監査レコード不正');assert([0,1].includes(r.rate),'一次実戦監査は各組合せ1シードの実勝敗を記録する');}
assert(audit.summary.coverage.variantsWithAnyWin<177,'一次監査で全構成PASS扱いにしてはいけない');
assert(audit.summary.byTrial.long_attrition.won>audit.summary.byTrial.action_flood.won,'校正間格差を検出できていない');
console.log('PASS finalfix61_real_combat_audit.test.js: 177x8 actual battle audit captured');
