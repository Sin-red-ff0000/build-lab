'use strict';
const path=require('path');
global.window=global;
const mem={};
global.localStorage={getItem:k=>mem[k]??null,setItem:(k,v)=>{mem[k]=String(v)},removeItem:k=>{delete mem[k]}};
const root=path.resolve(__dirname,'..');
for(const f of [
  'js/data/gameData.js','js/data/protocols.js','js/data/tunings.js','js/data/conversions.js','js/data/chapter3.js','js/data/expansion08.js','js/data/expansion09.js','js/data/doctrines.js','js/data/characterStyles.js','js/data/expansion10.js','js/data/expansion11.js','js/data/expansion12.js','js/data/enemyBehaviors.js','js/data/expansion13.js','js/data/expansion14.js','js/data/expansion17.js','js/data/expansion18.js','js/data/expansion19.js','js/core/utils.js','js/core/unlock.js','js/data/unlocks.js','js/data/unlocks07.js','js/data/unlocks08.js','js/data/unlocks09.js','js/data/unlocks10.js','js/data/unlocks11.js','js/data/unlocks12.js','js/data/unlocks13.js','js/data/unlocks14.js','js/data/unlocks17.js','js/data/unlocks18.js','js/data/unlocks19.js','js/core/state.js','js/core/enemy.js','js/core/battle.js'
]) require(path.join(root,f));
const BL=global.BuildLab,D=BL.Data;
function assert(cond,msg){if(!cond)throw new Error(msg);}

// データ整合性
assert(D.BASE_CARD_IDS.length===90,`初期カード数が90ではありません: ${D.BASE_CARD_IDS.length}`);
assert(D.BASE_RELIC_IDS.length===48,`初期遺物数が48ではありません: ${D.BASE_RELIC_IDS.length}`);
assert(D.UNLOCK_CARD_IDS.length===56,`第1ボス前アンロックカード数が56ではありません: ${D.UNLOCK_CARD_IDS.length}`);
assert(D.UNLOCK_RELIC_IDS.length===30,`第1ボス前アンロック遺物数が30ではありません: ${D.UNLOCK_RELIC_IDS.length}`);
D.BASE_CARD_IDS.forEach(id=>assert(D.CARDS[id],`存在しない初期カード: ${id}`));
D.UNLOCK_CARD_IDS.forEach(id=>assert(D.CARDS[id],`存在しないアンロックカード: ${id}`));
D.BASE_RELIC_IDS.forEach(id=>assert(D.RELICS[id],`存在しない初期遺物: ${id}`));
D.UNLOCK_RELIC_IDS.forEach(id=>assert(D.RELICS[id],`存在しないアンロック遺物: ${id}`));
assert(new Set(D.BASE_CARD_IDS).size===D.BASE_CARD_IDS.length,'初期カードIDに重複があります');
assert(new Set(D.BASE_RELIC_IDS).size===D.BASE_RELIC_IDS.length,'初期遺物IDに重複があります');
assert(D.DEFAULT_DECK.length===10,'初期デッキが10枚ではありません');
D.DEFAULT_DECK.forEach(id=>assert(D.CARDS[id],`初期デッキに存在しないカード: ${id}`));
for(const u of D.UNLOCKS){assert(typeof u.check==='function',`unlock check missing: ${u.id}`);assert(Array.isArray(u.reward),`unlock reward invalid: ${u.id}`);for(const id of u.reward){if(id==='第1ボス挑戦権')continue;assert(D.CARDS[id]||D.RELICS[id]||D.TRAITS[id]||D.PROTOCOLS[id]||D.CHARACTERS[id]||D.CHARACTER_STYLES?.[id]||D.DOCTRINES?.[id]||D.TUNINGS?.[id]||D.CARD_CONVERSIONS?.[id]||D.LINK_MODES?.[id]||D.ENEMY_BEHAVIORS?.[id]||D.SYSTEMS[id],`unlock reward missing: ${u.id} -> ${id}`);}}

// 旧データにv0.4初期要素が追加されること
const migrated=BL.Store.mergeDefaults({version:2,deck:[...D.DEFAULT_DECK],unlockedCards:{double_strike:true},unlockedRelics:{selection_lens:true},flags:{hp5:true},defeatedTraits:{giant:true}});
assert(D.BASE_CARD_IDS.every(id=>migrated.unlockedCards[id]),'移行後にv0.4初期カードが解放されていません');
assert(D.BASE_RELIC_IDS.every(id=>migrated.unlockedRelics[id]),'移行後にv0.4初期遺物が解放されていません');
assert(migrated.claimedUnlocks.u_hp5,'旧hp5進行が移行されていません');
assert(migrated.claimedUnlocks.r_giant,'旧巨躯撃破進行が移行されていません');
assert(migrated.unlockedRelics.late_bloom,'旧巨躯撃破からv0.3追加報酬が補完されていません');

// データ駆動アンロック：単一条件と複合特殊個体の報酬が正しく付与される
BL.Store.state=BL.Store.defaultState();
BL.Store.state.enemy.hp=8;BL.Store.state.enemy.atk=7;BL.Store.state.enemy.def=7;BL.Store.state.enemy.spd=2.5;
let got=BL.Unlock.processWinUnlocks(BL.Store.state,{enemy:{traits:[]}});
for(const id of ['deep_guard','enduring_venom','revenge_edge','crimson_peak','acid_saw','melt_brand','flash_chain','recycle_dash'])assert(BL.Store.state.unlockedCards[id],`tier2 unlock missing: ${id}`);
assert(got.length>=8,'tier2 unlock reward list is unexpectedly small');
BL.Store.state=BL.Store.defaultState();
got=BL.Unlock.processWinUnlocks(BL.Store.state,{enemy:{traits:['giant','berserk']}});
assert(BL.Store.state.unlockedTraits.tyrant,'暴君個体が解放されていません');
assert(BL.Store.state.unlockedCards.blood_wall,'暴君報酬カードが解放されていません');
assert(BL.Store.state.unlockedRelics.tyrant_heart,'暴君報酬遺物が解放されていません');
assert(BL.Store.state.defeatedTraits.giant&&BL.Store.state.defeatedTraits.berserk,'基本特殊個体の撃破記録が残っていません');
console.log('PASS data-driven unlock rewards');

// フォート：同名カードが複数あっても使った「1枚だけ」が強化され、カード総数は増えない
BL.Store.state=BL.Store.defaultState();
BL.Store.state.character='tank';
BL.Store.state.deck=Array(10).fill('counter_stance');
BL.Store.state.relics=[];
let start=BL.Battle.create(false);assert(!start.error,'フォート戦闘開始失敗');
assert(BL.Battle.invariant().ok,'戦闘開始時カード所有権が不正');
BL.Battle.play(0);
assert(BL.Battle.current,'1ターンで戦闘が終了してしまいました');
assert(BL.Battle.invariant().ok,'フォート強化後にカード枚数が変化しました');
assert(BL.Battle.upgradedCount()===1,`フォートが同名カードを複数同時強化しています: ${BL.Battle.upgradedCount()}`);
BL.Battle.retire();

// 亀裂の盾：カードを山札へ戻す処理で複製が起きない
BL.Store.state=BL.Store.defaultState();
BL.Store.state.character='standard';
BL.Store.state.deck=Array(10).fill('counter_stance');
BL.Store.state.relics=['cracked_shield'];
start=BL.Battle.create(false);assert(!start.error,'亀裂の盾テスト開始失敗');
BL.Battle.play(0);
assert(BL.Battle.current,'亀裂の盾テストが早期終了');
let inv=BL.Battle.invariant();assert(inv.ok,`亀裂の盾でカード複製: ${JSON.stringify(inv)}`);
BL.Battle.retire();

// 捨て履歴は同名カードではなくカード実体ごとに管理される
BL.Store.state=BL.Store.defaultState();BL.Store.state.deck=Array(10).fill('discard_blade');BL.Store.state.enemy.hp=20;
start=BL.Battle.create(false);assert(!start.error,'捨て履歴テスト開始失敗');
const beforeUids=BL.Battle.current.prompt.map(x=>x.uid);BL.Battle.play(0);if(BL.Battle.current){const owned=BL.Battle.allOwnedInstances();const marked=owned.filter(x=>BL.Battle.current.discardedEver[x.uid]);assert(marked.length>=2&&marked.length<10,`捨て履歴が実体単位ではありません: ${marked.length}`);BL.Battle.retire();}
console.log('PASS per-instance discard history');

// 第1ボスは1行動で、選択位置を実際に記録・反応する
BL.Store.state=BL.Store.defaultState();BL.Store.state.deck=Array(10).fill('wall');BL.Store.state.relics=[];
start=BL.Battle.create(true);assert(!start.error,'boss start failed');assert(BL.Battle.current.enemy.maxHp===160,'boss HP balance mismatch');assert(BL.Battle.current.enemy.spd===1,'boss speed should be 1');
const center=Math.floor((BL.Battle.current.prompt.length-1)/2);BL.Battle.play(center);if(BL.Battle.current){assert(BL.Battle.current.lastChoicePosition==='center','boss did not record center choice');BL.Battle.retire();}
console.log('PASS boss position reaction baseline');

// 《受け流し》の完全防御時回収が説明通り機能する
BL.Store.state=BL.Store.defaultState();BL.Store.state.character='tank';BL.Store.state.deck=Array(10).fill('parry');BL.Store.state.enemy.atk=0.5;BL.Store.state.enemy.hp=20;BL.Store.state.relics=[];
start=BL.Battle.create(false);assert(!start.error,'受け流しテスト開始失敗');const parryUid=BL.Battle.current.prompt[0].uid;BL.Battle.play(0);if(BL.Battle.current){assert(!BL.Battle.current.discard.some(x=>x.uid===parryUid),'受け流しが完全防御後も捨て札に残っています');assert(BL.Battle.allOwnedInstances().some(x=>x.uid===parryUid),'受け流しカード実体が消失しています');assert(BL.Battle.invariant().ok,'受け流し回収で所有権が崩壊');BL.Battle.retire();}
console.log('PASS parry full-block return');

// 全カードを最低1回実行し、例外と所有権崩壊を検出
for(const id of Object.keys(D.CARDS)){
  BL.Store.state=BL.Store.defaultState();
  BL.Store.state.character='standard';
  BL.Store.state.enemy.hp=20;BL.Store.state.enemy.atk=1;BL.Store.state.enemy.def=1;BL.Store.state.enemy.spd=1;
  BL.Store.state.deck=Array(10).fill(id);
  BL.Store.state.relics=[];
  start=BL.Battle.create(false);assert(!start.error,`card smoke start failed: ${id}`);
  BL.Battle.play(0);
  if(BL.Battle.current){assert(BL.Battle.invariant().ok,`card smoke invariant fail: ${id}`);BL.Battle.retire();}
}
console.log(`PASS all-card execution smoke (${Object.keys(D.CARDS).length} cards)`);

// 全初期遺物を最低1回装備して実行
for(const id of D.BASE_RELIC_IDS){
  BL.Store.state=BL.Store.defaultState();
  BL.Store.state.character='standard';BL.Store.state.enemy.hp=20;BL.Store.state.enemy.atk=1;
  BL.Store.state.deck=['parting_gift','embers','counter_stance','blood_blade','rebuild','fast_forward','recall','scarlet_bulwark','fading_venom','double_strike'];
  BL.Store.state.relics=[id];
  start=BL.Battle.create(false);assert(!start.error,`relic smoke start failed: ${id}`);
  BL.Battle.play(0);
  if(BL.Battle.current){assert(BL.Battle.invariant().ok,`relic smoke invariant fail: ${id}`);BL.Battle.retire();}
}
console.log(`PASS base-relic execution smoke (${D.BASE_RELIC_IDS.length} relics)`);

// 複数パイル操作の簡易ファズ
for(const relics of [[],['selection_lens'],['echo_stone','torn_bookmark'],['blood_key'],['cracked_shield','discard_furnace'],['recovery_thread','cycle_bearing']]){
  BL.Store.state=BL.Store.defaultState();
  BL.Store.state.character='tank';
  BL.Store.state.enemy.hp=20;
  BL.Store.state.deck=['parting_gift','embers','counter_stance','blood_blade','rebuild','fast_forward','recall','scarlet_bulwark','fading_venom','red_cycle'];
  BL.Store.state.relics=relics;
  start=BL.Battle.create(false);assert(!start.error,`fuzz start failed: ${relics}`);
  let steps=0;
  while(BL.Battle.current&&steps<18){
    assert(BL.Battle.invariant().ok,`play前 invariant fail: ${relics} step=${steps}`);
    BL.Battle.play(0);
    if(BL.Battle.current)assert(BL.Battle.invariant().ok,`play後 invariant fail: ${relics} step=${steps}`);
    steps++;
  }
  if(BL.Battle.current)BL.Battle.retire();
}
console.log('PASS pile ownership fuzz');

// 強化プロトコル：ビルド条件で解放され、装備した効果が戦闘へ接続される
BL.Store.state=BL.Store.defaultState();
BL.Store.state.deck=['wall','counter_stance','parry','last_stand_shield','double_strike','needle_rain','poison_needle','blood_blade','rebuild','parting_gift'];
got=BL.Unlock.processWinUnlocks(BL.Store.state,{isBoss:false,enemy:{traits:[]}});
assert(BL.Store.state.unlockedProtocols.fortify_calibration,'耐久プロトコルがビルド条件で解放されていません');
BL.Store.state.protocol='fortify_calibration';BL.Store.state.deck=Array(10).fill('wall');BL.Store.state.enemy.atk=1;BL.Store.state.enemy.hp=20;
start=BL.Battle.create(false);assert(!start.error,'protocol battle start failed');const hp0=BL.Battle.current.player.maxHp;BL.Battle.play(0);if(BL.Battle.current){assert(BL.Battle.invariant().ok,'protocol battle invariant fail');BL.Battle.retire();}assert(hp0===D.CHARACTERS.standard.hp,'堅守校正がHPを不正変更');
console.log('PASS protocol unlock/equip baseline');

// 第1ボス報酬：通常アンロック経路からシステム・カード・遺物・プロトコルを一括付与
BL.Store.state=BL.Store.defaultState();BL.Store.state.deck=Array(10).fill('needle_rain');BL.Store.state.enemy.hp=1;
BL.Store.state.defeatedTraits={giant:true,berserk:true,armored:true,fast:true};
let bossResult=null;BL.Battle.onEnd=r=>bossResult=r;start=BL.Battle.create(true);assert(!start.error,'boss reward start failed');
// テストでは直接アンロック処理を通して報酬経路を検証
BL.Store.state.bossDefeated=true;got=BL.Unlock.processWinUnlocks(BL.Store.state,{isBoss:true,bossId:'boss1',enemy:{traits:['boss']}});
assert(BL.Store.state.claimedUnlocks.boss_clear,'boss_clear が達成済みになっていません');
assert(BL.Store.state.unlockedSystems.prompt_control,'提示操作システムが解放されていません');
for(const id of D.BOSS1_REWARD_CARD_IDS)assert(BL.Store.state.unlockedCards[id],`boss card reward missing: ${id}`);
for(const id of D.BOSS1_REWARD_RELIC_IDS)assert(BL.Store.state.unlockedRelics[id],`boss relic reward missing: ${id}`);
assert(BL.Store.state.unlockedSystems.advanced_enemy_parameters,'高度敵パラメータが解放されていません');
for(const id of ['center_drive','wide_scan','narrow_scan'])assert(BL.Store.state.unlockedProtocols[id],`boss protocol reward missing: ${id}`);
assert(got.includes('提示操作システム'),'boss reward result listにシステム名がありません');
if(BL.Battle.current)BL.Battle.retire();
console.log('PASS unified boss reward pipeline');

// v0.4セーブのボス撃破済みデータは新報酬へ自動移行
const oldBoss=BL.Store.mergeDefaults({version:4,bossDefeated:true,deck:[...D.DEFAULT_DECK],unlockedCards:{},unlockedRelics:{}});
assert(oldBoss.unlockedSystems.prompt_control,'旧bossDefeatedから提示操作システムへ移行されていません');
assert(oldBoss.unlockedProtocols.center_drive&&oldBoss.unlockedProtocols.wide_scan&&oldBoss.unlockedProtocols.narrow_scan,'旧ボス撃破セーブに新プロトコル報酬が補完されていません');
console.log('PASS v0.4 boss reward migration');

// 全プロトコルが戦闘開始・1プレイで例外を起こさない
for(const id of Object.keys(D.PROTOCOLS)){
  BL.Store.state=BL.Store.defaultState();BL.Store.state.unlockedProtocols[id]=true;BL.Store.state.protocol=id;BL.Store.state.enemy.hp=20;BL.Store.state.enemy.atk=1;
  BL.Store.state.deck=['parting_gift','embers','counter_stance','blood_blade','rebuild','fast_forward','recall','scarlet_bulwark','fading_venom','double_strike'];
  start=BL.Battle.create(false);assert(!start.error,`protocol smoke start failed: ${id}`);BL.Battle.play(0);if(BL.Battle.current){assert(BL.Battle.invariant().ok,`protocol smoke invariant fail: ${id}`);BL.Battle.retire();}
}
console.log(`PASS protocol execution smoke (${Object.keys(D.PROTOCOLS).length} protocols)`);

console.log(`Initial cards: ${D.BASE_CARD_IDS.length}, relics: ${D.BASE_RELIC_IDS.length}, pre-boss unlock goals: ${D.UNLOCKS.filter(u=>u.id!=='boss'&&u.id!=='boss_clear').length}`);
