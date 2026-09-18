'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert');global.window=global;const mem={};global.localStorage={getItem:k=>mem[k]??null,setItem:(k,v)=>mem[k]=String(v),removeItem:k=>delete mem[k]};
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(root+'/index.html','utf8');for(const m of html.matchAll(/<script src="([^"?]+)/g)){const f=m[1];if(f.includes('/ui/')||f.endsWith('app.js'))continue;require(path.join(root,f));}const BL=BuildLab,D=BL.Data,U=Object.fromEntries(D.UNLOCKS.map(u=>[u.id,u]));
assert(D.PROGRESSION57,'PROGRESSION57 missing');
let s=BL.Store.defaultState();s.boss2Defeated=true;s.claimedUnlocks.v07_link_six=s.claimedUnlocks.v07_link_tuned=s.claimedUnlocks.v08_link_cycle=true;assert(BL.Unlock.boss3Available(s),'第3章の学習課題達成後にboss3が開かない');assert(!/極相個体を撃破/.test(U.boss3.condition),'boss3が極端数値個体を必須にしている');
s=BL.Store.defaultState();s.boss3Defeated=true;s.claimedUnlocks.v20_integration_trial=true;assert(!BL.Unlock.boss4Available(s),'構築規格未履修でboss4が開く');s.claimedUnlocks.v09_doctrine_compact=s.claimedUnlocks.v09_doctrine_expanded=s.claimedUnlocks.v09_doctrine_singleton=true;assert(BL.Unlock.boss4Available(s),'3規格＋統合実験後もboss4が開かない');
for(const id of ['v09_t_bloomwall','v09_t_nullgiant','v09_t_rushbloom','v09_t_apex']){assert.equal(U[id].chapter,3);assert(/^第2ボス撃破後/.test(U[id].condition),`${id} が第2ボス前に見えている`);}
for(const id of ['u_hp12','u_atk10','u_def10','u_spd4']){assert.equal(U[id].chapter,10,`${id} は通常章から隔離する`);assert(/^第4ボス撃破後/.test(U[id].condition),`${id} が第4ボス前`);}
for(const u of D.UNLOCKS.filter(x=>String(x.id).startsWith('v20_discover_')||String(x.id).startsWith('v20_behavior_'))){assert.equal(u.chapter,9);assert(/^第4ボス撃破後/.test(u.condition),`${u.id} がクリア前に表示`);}
assert(/第2章導入/.test(U.boss_clear.title));assert(/第3章導入/.test(U.boss2_clear.title));assert(/第4章導入/.test(U.boss3_clear.title));assert(/クリア後研究/.test(U.boss4_clear.title));
console.log('PASS progression57_curriculum.test.js');
