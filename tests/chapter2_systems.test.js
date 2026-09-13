'use strict';
const path=require('path');global.window=global;
const mem={};global.localStorage={getItem:k=>mem[k]??null,setItem:(k,v)=>mem[k]=String(v),removeItem:k=>delete mem[k]};
const root=path.resolve(__dirname,'..');for(const f of ['js/data/gameData.js','js/data/protocols.js','js/data/tunings.js','js/data/conversions.js','js/data/chapter3.js','js/data/expansion08.js','js/data/expansion09.js','js/data/doctrines.js','js/data/characterStyles.js','js/data/expansion10.js','js/data/expansion11.js','js/data/expansion12.js','js/data/enemyBehaviors.js','js/data/expansion13.js','js/data/expansion14.js','js/core/utils.js','js/core/unlock.js','js/data/unlocks.js','js/data/unlocks07.js','js/data/unlocks08.js','js/data/unlocks09.js','js/data/unlocks10.js','js/data/unlocks11.js','js/data/unlocks12.js','js/data/unlocks13.js','js/data/unlocks14.js','js/core/state.js','js/core/enemy.js','js/core/battle.js'])require(path.join(root,f));
const BL=global.BuildLab,D=BL.Data;const assert=(x,m)=>{if(!x)throw new Error(m);};

// 高度敵パラメータと特殊個体発見
BL.Store.state=BL.Store.defaultState();BL.Store.state.unlockedSystems.advanced_enemy_parameters=true;BL.Store.state.enemy.regen=5;BL.Store.state.enemy.resist=50;
let found=BL.Enemy.detectDiscoveries(BL.Store.state);assert(BL.Store.state.unlockedTraits.regenerative,'再生個体が発見されていません');assert(BL.Store.state.unlockedTraits.purifier,'浄化個体が発見されていません');assert(found.length===2,'第2章特殊個体の発見数が不正');
let eff=BL.Enemy.effective(BL.Store.state,false);assert(eff.regen>=8,'再生個体の再生力補正が反映されていません');assert(eff.resist>=70,'浄化個体の耐性補正が反映されていません');
console.log('PASS chapter2 advanced enemy parameters');

// 状態異常耐性と耐性無視カード
BL.Store.state=BL.Store.defaultState();BL.Store.state.unlockedSystems.advanced_enemy_parameters=true;BL.Store.state.enemy.resist=50;BL.Store.state.enemy.hp=20;BL.Store.state.enemy.atk=1;BL.Store.state.deck=Array(10).fill('poison_needle');
let start=BL.Battle.create(false);assert(!start.error,'resist battle start failed');BL.Battle.play(0);if(BL.Battle.current){assert(BL.Battle.current.enemy.status.poison<=1,'状態異常耐性が毒付与へ反映されていません');BL.Battle.retire();}
BL.Store.state=BL.Store.defaultState();BL.Store.state.unlockedSystems.advanced_enemy_parameters=true;BL.Store.state.enemy.resist=50;BL.Store.state.enemy.hp=20;BL.Store.state.enemy.atk=1;BL.Store.state.deck=Array(10).fill('purity_breach');
start=BL.Battle.create(false);assert(!start.error,'ignore resist battle start failed');BL.Battle.play(0);if(BL.Battle.current){assert(BL.Battle.current.enemy.status.poison>=4,'耐性無視カードが耐性を無視していません');BL.Battle.retire();}
console.log('PASS status resistance and bypass');

// 過負荷調律：使用後は除外へ
BL.Store.state=BL.Store.defaultState();BL.Store.state.unlockedSystems.card_tuning=true;BL.Store.state.cardTunings={wall:'overload'};BL.Store.state.deck=Array(10).fill('wall');BL.Store.state.enemy.hp=20;BL.Store.state.enemy.atk=1;
start=BL.Battle.create(false);assert(!start.error,'overload tuning start failed');const overloadUid=BL.Battle.current.prompt[0].uid;BL.Battle.play(0);if(BL.Battle.current){assert(BL.Battle.current.excluded.some(x=>x.uid===overloadUid),'過負荷調律カードが除外へ移動していません');assert(BL.Battle.invariant().ok,'過負荷調律でカード所有権が崩壊');BL.Battle.retire();}

// 再循環調律：使用後は山札へ
BL.Store.state=BL.Store.defaultState();BL.Store.state.unlockedSystems.card_tuning=true;BL.Store.state.cardTunings={wall:'recycle'};BL.Store.state.deck=Array(10).fill('wall');BL.Store.state.enemy.hp=20;BL.Store.state.enemy.atk=1;
start=BL.Battle.create(false);assert(!start.error,'recycle tuning start failed');const recycleUid=BL.Battle.current.prompt[0].uid;BL.Battle.play(0);if(BL.Battle.current){assert(BL.Battle.current.draw.some(x=>x.uid===recycleUid),'再循環調律カードが山札へ戻っていません');assert(BL.Battle.invariant().ok,'再循環調律でカード所有権が崩壊');BL.Battle.retire();}

// 残滓調律：選ばれなかったカードが次カード強化を残す
BL.Store.state=BL.Store.defaultState();BL.Store.state.unlockedSystems.card_tuning=true;BL.Store.state.cardTunings={wall:'residue'};BL.Store.state.deck=Array(10).fill('wall');BL.Store.state.enemy.hp=20;BL.Store.state.enemy.atk=1;
start=BL.Battle.create(false);assert(!start.error,'residue tuning start failed');BL.Battle.play(0);if(BL.Battle.current){assert(BL.Battle.current.player.nextBuff>=.15,'残滓調律の次カード強化が発生していません');BL.Battle.retire();}
console.log('PASS all card tunings');

// 第2章ビルド条件から新キャラクターを解放
BL.Store.state=BL.Store.defaultState();BL.Store.state.bossDefeated=true;BL.Store.state.deck=['center_lock','hold','double_strike','needle_rain','wall','counter_stance','blood_blade','rebuild','recall','break'];
BL.Unlock.processWinUnlocks(BL.Store.state,{isBoss:false,enemy:{traits:[]}});assert(BL.Store.state.unlockedCharacters.vector,'ベクトルが第2章条件から解放されていません');assert(BL.Store.state.unlockedSystems.card_tuning,'カード調律システムが第2章条件から解放されていません');
console.log('PASS chapter2 unlock path');
