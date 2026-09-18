'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert');global.window=global;global.localStorage={getItem:()=>null,setItem:()=>{},removeItem:()=>{}};
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const m of html.matchAll(/<script src="([^"?]+)/g)){const f=m[1];if(f.includes('/ui/')||f.endsWith('app.js'))continue;require(path.join(root,f));}
const D=BuildLab.Data;
assert.equal(D.V41_STATUS_CARD_IDS.length,12);
for(const [id,tag,type] of [['v41_venom_inoculation','毒','poison'],['v41_ember_seed','火傷','burn'],['v41_bleed_cut','出血','bleed'],['v41_frost_mark','凍傷','frost']]){assert(D.getCardTags({cardConversions:{}},id).includes(tag),id+' tag');assert.equal(D.CARDS[id].status.type,type);}
const battle=fs.readFileSync(path.join(root,'js/core/battle.js'),'utf8');assert(battle.includes("Math.ceil(b.enemy.status.poison*1.00)"));assert(battle.includes("dealRawEnemy(b.enemy.status.burn,'火傷')"));assert(battle.includes("b.enemy.status.bleed*.5"));assert(battle.includes("b.enemy.status.frost*.40"));
const deck=fs.readFileSync(path.join(root,'js/ui/deckView.js'),'utf8'),idx=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const x of ['poison','burn','bleed','frost']){assert(deck.includes(x));assert(idx.includes(`value="${x}"`));}
console.log('PASS status41_system.test.js');
