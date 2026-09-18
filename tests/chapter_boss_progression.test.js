'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert');global.window=global;const mem={};global.localStorage={getItem:k=>mem[k]??null,setItem:(k,v)=>mem[k]=String(v),removeItem:k=>delete mem[k]};const root=path.resolve(__dirname,'..'),html=fs.readFileSync(root+'/index.html','utf8');for(const m of html.matchAll(/<script src="([^"?]+)/g)){const f=m[1];if(f.includes('/ui/')||f.endsWith('app.js'))continue;require(path.join(root,f));}const BL=BuildLab,D=BL.Data,U=Object.fromEntries(D.UNLOCKS.map(u=>[u.id,u]));
// v0.57: chapter progression is a curriculum test, not an AI win-rate test tied to obsolete oversized cards.
const bridges=[['boss_clear',2,['prompt_control']],['boss2_clear',3,['card_link','card_conversion']],['boss3_clear',4,['deck_doctrine']],['boss4_clear',5,['rune','arcana']]];
for(const [id,next,rewards] of bridges){assert(U[id],id);for(const r of rewards)assert((U[id].reward||[]).includes(r),`${id} missing bridge ${r}`);assert(U[id].chapter<=next,`${id} chapter mismatch`);}
let s=BL.Store.defaultState();['giant','berserk','armored','fast'].forEach(x=>s.defeatedTraits[x]=true);assert(BL.Unlock.bossAvailable(s));
s.bossDefeated=true;s.defeatedTraits.regenerative=s.defeatedTraits.purifier=true;s.claimedUnlocks.v06_prompt_mastery=s.claimedUnlocks.v06_tuning_second=true;assert(BL.Unlock.boss2Available(s));
s.boss2Defeated=true;s.claimedUnlocks.v07_link_six=s.claimedUnlocks.v07_link_tuned=s.claimedUnlocks.v08_link_cycle=true;assert(BL.Unlock.boss3Available(s));
s.boss3Defeated=true;s.claimedUnlocks.v20_integration_trial=s.claimedUnlocks.v09_doctrine_compact=s.claimedUnlocks.v09_doctrine_expanded=s.claimedUnlocks.v09_doctrine_singleton=true;assert(BL.Unlock.boss4Available(s));
for(const id of ['u_hp12','u_atk10','u_def10','u_spd4'])assert(U[id].chapter>=10,`${id} is still a chapter gate`);
console.log('PASS chapter_boss_progression.test.js — curriculum gates');
