'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert');global.window=global;const mem={};global.localStorage={getItem:k=>mem[k]??null,setItem:(k,v)=>mem[k]=String(v),removeItem:k=>delete mem[k]};
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const m of html.matchAll(/<script src="([^"?]+)/g)){const f=m[1];if(f.includes('/ui/')||f.endsWith('app.js'))continue;require(path.join(root,f));}
const BL=BuildLab,D=BL.Data,P=D.PROGRESSION36,U=D.UNLOCKS;
assert(P,'PROGRESSION36 missing');
assert.equal(P.starterCards.length,35,'初期カードは35枚へ絞る');assert.equal(P.starterRelics.length,18,'初期遺物は18種へ絞る');
const fresh=BL.Store.defaultState();for(const id of P.starterCards)assert(fresh.unlockedCards[id],`初期カード未解放 ${id}`);for(const id of P.starterRelics)assert(fresh.unlockedRelics[id],`初期遺物未解放 ${id}`);
assert.equal(Object.keys(fresh.unlockedCards).filter(id=>fresh.unlockedCards[id]).length,35,'新規ゲーム初期カード数が想定外');assert.equal(Object.keys(fresh.unlockedRelics).filter(id=>fresh.unlockedRelics[id]).length,18,'新規ゲーム初期遺物数が想定外');
const byId=Object.fromEntries(U.map(u=>[u.id,u]));
const rewardSet=new Set(U.flatMap(u=>u.reward||[]));for(const id of P.lockedCards)assert(rewardSet.has(id),`旧無料カードに再解放経路がない: ${id}`);for(const id of P.lockedRelics)assert(rewardSet.has(id),`旧無料遺物に再解放経路がない: ${id}`);
function validReward(id){return !!(D.CARDS[id]||D.RELICS[id]||D.TRAITS[id]||D.ENEMY_BEHAVIORS?.[id]||D.PROTOCOLS?.[id]||D.CHARACTERS?.[id]||D.CHARACTER_STYLES?.[id]||D.DOCTRINES?.[id]||D.TUNINGS?.[id]||D.CARD_CONVERSIONS?.[id]||D.LINK_MODES?.[id]||D.RUNES?.[id]||D.ARCANA?.[id]||D.SYSTEMS?.[id]);}
for(const u of U)for(const id of u.reward||[])if(u.id!=='boss')assert(validReward(id),`${u.id}: 存在しない報酬 ${id}`);
assert.equal(byId.calibration.chapter,10,'全域校正はエンドコンテンツ章へ置く');assert(/第4ボス撃破後/.test(byId.calibration.condition),'全域校正は第4ボス撃破後であること');
for(const id of ['u_hp12','u_atk10','u_def10','u_spd4']){assert(byId[id].chapter>=4,`${id} が早期章に残っている`);assert(/第3ボス撃破後/.test(byId[id].condition),`${id} は第3ボス後であること`);}
for(const id of ['c_tyrant','c_mobile']){assert.equal(byId[id].chapter,2,`${id} は第2章`);assert(/第1ボス撃破後/.test(byId[id].condition),`${id} は第1ボス後`);}
assert((byId.boss_clear.reward||[]).some(id=>P.promptCards.includes(id)||P.promptRelics.includes(id)),'第1ボス報酬に第2章提示操作の導入報酬がない');
const impossible=/ルーン|アルカナ|構築規格|カード連結|連結コンボ|役割変換/;for(const u of U.filter(x=>x.chapter===1))assert(!impossible.test(u.condition||''),`第1章に後続章システムを要求する条件: ${u.id} ${u.condition}`);
const axes=[
 ['discard',['捨て札'],'p_discard','v08_discard_cycle'],['multihit',['連撃'],'p_multihit','v08_multihit_master'],['status',['状態異常'],'p_ailment','v08_status_master'],['guard',['耐久','反撃'],'p_fortify','v08_guard_counter'],['blood',['自傷','瀕死'],'p_scar','v08_self_cycle'],['cycle',['循環'],'p_cycle','v08_cycle_master']
];
for(const [name,tags,early,late] of axes){const starter=P.starterCards.filter(id=>tags.some(t=>(D.CARDS[id]?.tags||[]).includes(t)));assert(starter.length>=4,`${name}: 初期段階で構築開始できるカードが不足 ${starter.length}`);assert(byId[early]?.chapter===1&&byId[early]?.reward?.length,`${name}: 第1段階報酬がない`);assert(byId[late]?.chapter===1&&byId[late]?.reward?.length,`${name}: 習熟報酬がない`);}
// Boss gate is intentionally chapter-system gated rather than raw stat gated.
const s=BL.Store.defaultState();['giant','berserk','armored','fast'].forEach(id=>s.defeatedTraits[id]=true);assert(BL.Unlock.bossAvailable(s),'第1ボス解放条件が壊れている');
s.bossDefeated=true;s.defeatedTraits.regenerative=s.defeatedTraits.purifier=true;assert(!BL.Unlock.boss2Available(s),'第2章システム未習得で第2ボスへ進めてしまう');s.claimedUnlocks.v06_prompt_mastery=s.claimedUnlocks.v06_tuning_second=true;assert(BL.Unlock.boss2Available(s),'第2章システム習得後も第2ボスが開かない');
s.boss2Defeated=true;s.defeatedTraits.apex=true;assert(!BL.Unlock.boss3Available(s),'第3章連結課題未達で第3ボスへ進めてしまう');s.claimedUnlocks.v07_link_six=s.claimedUnlocks.v07_link_tuned=s.claimedUnlocks.v08_link_cycle=true;assert(BL.Unlock.boss3Available(s),'連結課題後も第3ボスが開かない');
s.boss3Defeated=true;s.defeatedTraits.v19_omega=true;assert(!BL.Unlock.boss4Available(s),'統合課題未達で第4ボスへ進めてしまう');s.claimedUnlocks.v20_integration_trial=true;assert(BL.Unlock.boss4Available(s),'統合課題後も第4ボスが開かない');
console.log(`progression36: starter ${P.starterCards.length} cards / ${P.starterRelics.length} relics; relocked ${P.lockedCards.length}/${P.lockedRelics.length}`);console.log('PASS progression36_chapters.test.js');
