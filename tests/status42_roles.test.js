'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert');global.window=global;global.localStorage={getItem:()=>null,setItem:()=>{},removeItem:()=>{}};
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const m of html.matchAll(/<script src="([^"?]+)/g)){const f=m[1];if(f.includes('/ui/')||f.endsWith('app.js'))continue;require(path.join(root,f));}
const D=BuildLab.Data;
assert.equal(D.V42_STATUS_ROLE_PATCH_IDS.length,17);
assert.equal(D.CARDS.toxic_barrage.status.type,'bleed');
assert(D.getCardTags({cardConversions:{}},'toxic_barrage').includes('出血'));
assert.equal(D.CARDS.weakening_mist.status.type,'frost');
assert(D.getCardTags({cardConversions:{}},'weakening_mist').includes('凍傷'));
assert.equal(D.CARDS.brand.burnRefresh,2);
assert.equal(D.CARDS.ember_burst.consumeStatus.ratio,1.5);
const battle=fs.readFileSync(path.join(root,'js/core/battle.js'),'utf8');
assert(battle.includes("b.enemy.status.burn-1"),'burn baseline remains progression-safe while re-ignition is introduced');
assert(battle.includes("c.status.type==='burn'&&statusBefore>0&&c.burnRefresh"),'burn cards must support re-ignition');
console.log('PASS status42_roles.test.js');
