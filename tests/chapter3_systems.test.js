'use strict';
const path=require('path');global.window=global;
const mem={};global.localStorage={getItem:k=>mem[k]??null,setItem:(k,v)=>mem[k]=String(v),removeItem:k=>delete mem[k]};
const root=path.resolve(__dirname,'..');for(const f of ['js/data/gameData.js','js/data/protocols.js','js/data/tunings.js','js/data/conversions.js','js/data/chapter3.js','js/data/expansion08.js','js/data/expansion09.js','js/data/doctrines.js','js/data/characterStyles.js','js/data/expansion10.js','js/data/expansion11.js','js/data/expansion12.js','js/data/enemyBehaviors.js','js/data/expansion13.js','js/data/expansion14.js','js/core/utils.js','js/core/unlock.js','js/data/unlocks.js','js/data/unlocks07.js','js/data/unlocks08.js','js/data/unlocks09.js','js/data/unlocks10.js','js/data/unlocks11.js','js/data/unlocks12.js','js/data/unlocks13.js','js/data/unlocks14.js','js/core/state.js','js/core/enemy.js','js/core/battle.js'])require(path.join(root,f));
const BL=global.BuildLab,D=BL.Data;const assert=(x,m)=>{if(!x)throw new Error(m);};

// 第2章上位特殊個体の発見
BL.Store.state=BL.Store.defaultState();BL.Store.state.unlockedSystems.advanced_enemy_parameters=true;BL.Store.state.enemy.regen=8;BL.Store.state.enemy.resist=70;
let found=BL.Enemy.detectDiscoveries(BL.Store.state);assert(BL.Store.state.unlockedTraits.hyperregen,'過再生個体が発見されていません');assert(BL.Store.state.unlockedTraits.nullfield,'零域個体が発見されていません');assert(BL.Store.state.unlockedTraits.convergence,'収束個体が発見されていません');assert(found.length>=3,'v0.7特殊個体の発見数が不正');
let eff=BL.Enemy.effective(BL.Store.state,false);assert(eff.regen>=16,'過再生/収束の再生補正が反映されていません');assert(eff.resist>=90,'零域/収束の耐性補正が反映されていません');
console.log('PASS v0.7 advanced traits');

// 第2ボス挑戦条件
BL.Store.state=BL.Store.defaultState();Object.assign(BL.Store.state,{bossDefeated:true});BL.Store.state.defeatedTraits.regenerative=true;BL.Store.state.defeatedTraits.purifier=true;BL.Store.state.claimedUnlocks.v06_prompt_mastery=true;BL.Store.state.claimedUnlocks.v06_tuning_second=true;
assert(BL.Unlock.boss2Available(BL.Store.state),'第2ボス挑戦条件が成立しません');
let start=BL.Battle.create('boss2');assert(!start.error,'第2ボス戦闘開始失敗');assert(BL.Battle.current.bossId==='boss2','第2ボスIDが不正');assert(BL.Battle.current.enemy.maxHp===150,'第2ボスHPが想定値ではありません');BL.Battle.retire();
console.log('PASS boss2 availability/start');

// 第2ボス報酬を実戦経路で付与
BL.Store.state=BL.Store.defaultState();BL.Store.state.bossDefeated=true;BL.Store.state.deck=Array(10).fill('patient_execution');let result=null;BL.Battle.onEnd=r=>result=r;start=BL.Battle.create('boss2');assert(!start.error,'第2ボス報酬テスト開始失敗');BL.Battle.current.enemy.hp=1;BL.Battle.play(0);assert(result?.win,'第2ボス撃破結果が勝利になっていません');assert(BL.Store.state.boss2Defeated,'boss2Defeatedが保存されていません');assert(BL.Store.state.unlockedSystems.card_link,'カード連結システムが解放されていません');for(const id of D.BOSS2_REWARD_CARD_IDS)assert(BL.Store.state.unlockedCards[id],`第2ボス報酬カード不足: ${id}`);for(const id of D.BOSS2_REWARD_RELIC_IDS)assert(BL.Store.state.unlockedRelics[id],`第2ボス報酬遺物不足: ${id}`);for(const id of D.BOSS2_REWARD_PROTOCOL_IDS)assert(BL.Store.state.unlockedProtocols[id],`第2ボス報酬プロトコル不足: ${id}`);
console.log('PASS boss2 reward pipeline');

// カード連結：A→Bでコンボが成立し、カード所有権が崩れない
BL.Store.state=BL.Store.defaultState();BL.Store.state.unlockedSystems.card_link=true;BL.Store.state.cardLink={a:'link_strike',b:'link_guard'};BL.Store.state.deck=['link_strike','link_guard','link_strike','link_guard','link_strike','link_guard','link_strike','link_guard','link_strike','link_guard'];BL.Store.state.enemy.hp=20;BL.Store.state.enemy.atk=.5;
start=BL.Battle.create(false);assert(!start.error,'カード連結テスト開始失敗');
function chooseCard(id){const b=BL.Battle.current;const i=b.prompt.findIndex(x=>x.cardId===id);return i;}
let first=-1,second=-1,tries=0;
while(BL.Battle.current&&tries<12){const b=BL.Battle.current;if(!b.lastUsed){first=chooseCard('link_strike');if(first<0)first=chooseCard('link_guard');BL.Battle.play(first<0?0:first);}else{const partner=b.lastUsed.cardId==='link_strike'?'link_guard':'link_strike';second=chooseCard(partner);if(second>=0){const hp=b.enemy.hp;BL.Battle.play(second);if(BL.Battle.current)assert(BL.Battle.current.enemy.hp<hp||partner==='link_guard','連結コンボが戦闘へ反映されていません');break;}BL.Battle.play(0);}tries++;}
if(BL.Battle.current){assert(BL.Battle.invariant().ok,'カード連結でカード所有権が崩壊');BL.Battle.retire();}
console.log('PASS card link combo/ownership');

// 第2ボス撃破済みセーブから連結報酬が復元される
const migrated=BL.Store.mergeDefaults({version:6,bossDefeated:true,boss2Defeated:true,deck:[...D.DEFAULT_DECK],unlockedCards:{},unlockedRelics:{}});assert(migrated.unlockedSystems.card_link,'旧セーブからカード連結が復元されません');assert(D.BOSS2_REWARD_CARD_IDS.every(id=>migrated.unlockedCards[id]),'旧セーブへ第2ボスカード報酬が補完されません');
console.log('PASS v0.7 migration');
