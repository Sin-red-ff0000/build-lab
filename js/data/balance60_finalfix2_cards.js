'use strict';
(function(){
 const D=window.BuildLab.Data;if(!D)return;
 const ids=[];const P=(id,x)=>{if(!D.CARDS[id])throw new Error('v0.60 missing '+id);Object.assign(D.CARDS[id],x);ids.push(id);};
 // Final fix 2: 数字違いテンプレートを、既存の共通イベント/提示/循環/状態異常へ役割分離。
 // 純防御5元素: 数値階段ではなく出口を分ける。
 P('sealed_wall',{block:13,nextBlockFlat:2,tags:['防御','防御継続'],desc:'防御13。使用後、次の防御カードの防御+2。純防御列を継続する。'});
 P('v26_fire_guard',{block:12,nextStatusFlat:1,tags:['防御','火','状態異常'],desc:'防御12。使用後、次に付与する状態異常+1。火系の守りを症状へ接続する。'});
 P('v26_water_guard',{block:12,returnBottom:true,tags:['防御','水','循環'],desc:'防御12。使用後は山札下へ戻る。水系の守りを循環させる。'});
 P('v26_earth_guard',{block:15,stableGuard:true,tags:['防御','土','安定'],desc:'防御15。このカードで得た防御は敵の最初の攻撃に対して2だけ追加で働く。'});
 P('v26_aether_guard',{block:11,primeSingleHitBuff:.05,tags:['防御','エーテル','単発支援'],desc:'防御11。使用後、次の1ヒット攻撃+5%。守りから別軸へ接続する。'});
 // 反撃防御
 P('counter_stance',{block:6,counter:.70,nextBlockFlat:1,desc:'防御6。被ダメージ時70%反撃。使用後、次の防御+1。連続防御向け。'});
 P('revenge_edge',{block:5,counter:1.0,vanishAfterUse:true,tags:['防御','反撃','消失'],desc:'防御5。被ダメージ時100%反撃。使用後は消失する。一度きりの強反撃。'});
 P('revenge_guard',{block:7,counter:.90,returnBottom:true,tags:['防御','反撃','循環'],desc:'防御7。被ダメージ時90%反撃。使用後は山札下へ戻る。'});
 // HP半分以下攻撃: 低HPの数字競争を出口で分離。
 P('blood_return',{selfDamage:4,damage:10,lowHpDamage:16,nextBlockFlat:2,desc:'HP4を失い10ダメージ。HP半分以下なら16ダメージ。使用後、次の防御+2。'});
 P('crimson_peak',{selfDamage:5,damage:14,lowHpDamage:20,primeSingleHitBuff:.06,desc:'HP5を失い14ダメージ。HP半分以下なら20ダメージ。使用後、次の1ヒット攻撃+6%。'});
 P('redline_cut',{selfDamage:3,damage:9,lowHpDamage:15,reserveSelfOnPrevAttack:true,desc:'HP3を失い9ダメージ。HP半分以下なら15ダメージ。直前も攻撃なら自身を次回提示へ予約する。'});
 P('crisis_edge',{selfDamage:3,damage:8,lowHpDamage:14,nextStatusFlat:1,desc:'HP3を失い8ダメージ。HP半分以下なら14ダメージ。使用後、次に付与する状態異常+1。'});
 // 晩成攻撃/防御
 P('endurance_cut',{damage:10,damageIfTurnMin:{turn:4,value:16},nextBlockFlat:1,desc:'10ダメージ。4ターン目以降なら16ダメージ。使用後、次の防御+1。'});
 P('patient_execution',{damage:6,damageIfTurnMin:{turn:5,value:18},vanishAfterUse:true,tags:['晩成','消失'],desc:'6ダメージ。5ターン目以降なら18ダメージ。使用後は消失する。終盤の圧縮札。'});
 P('tempered_edge',{damage:7,damageIfTurnMin:{turn:5,value:17},primeSingleHitBuff:.05,desc:'7ダメージ。5ターン目以降なら17ダメージ。使用後、次の1ヒット攻撃+5%。'});
 P('patient_edge',{damage:5,damageIfTurnMin:{turn:4,value:14},returnBottom:true,desc:'5ダメージ。4ターン目以降なら14ダメージ。使用後は山札下へ戻る。'});
 P('patient_bloom',{block:8,blockIfTurnMin:{turn:4,value:15},nextStatusFlat:1,desc:'防御8。4ターン目以降なら防御15。使用後、次に付与する状態異常+1。'});
 P('forge_guard',{block:9,blockIfTurnMin:{turn:4,value:16},stableGuard:true,desc:'防御9。4ターン目以降なら防御16。このカードの防御は敵の最初の攻撃に2だけ追加で働く。'});
 P('patient_bulwark',{block:8,blockIfTurnMin:{turn:4,value:17},returnBottom:true,desc:'防御8。4ターン目以降なら防御17。使用後は山札下へ戻る。'});
 // 状態異常種類防御
 P('ailment_guard',{block:5,blockPerStatusType:4,nextStatusFlat:1,desc:'防御5。敵の状態異常1種類につき防御+4。使用後、次の状態異常+1。'});
 P('spectrum_guard',{block:6,blockPerStatusType:3,nextBlockFlat:2,desc:'防御6。敵の状態異常1種類につき防御+3。使用後、次の防御+2。'});
 P('spectrum_veil',{block:7,blockPerStatusType:3,returnBottom:true,desc:'防御7。敵の状態異常1種類につき防御+3。使用後は山札下へ戻る。'});
 // 再構築防御/連撃
 P('rebirth_guard',{block:8,blockIfRecentReshuffle:16,nextBlockFlat:1,desc:'防御8。山札再構築直後なら防御16。使用後、次の防御+1。'});
 P('return_wall',{block:7,blockIfRecentReshuffle:15,returnBottom:true,desc:'防御7。山札再構築直後なら防御15。使用後は山札下へ戻る。'});
 P('return_fortress',{block:7,blockIfRecentReshuffle:17,stableGuard:true,desc:'防御7。山札再構築直後なら防御17。敵の最初の攻撃に2だけ追加で働く。'});
 P('v17_return_wall',{block:7,blockIfRecentReshuffle:18,nextStatusFlat:1,desc:'防御7。山札再構築直後なら防御18。使用後、次に付与する状態異常+1。'});
 P('cycle_barrage_plus',{damage:1,hits:4,hitsIfRecentReshuffle:7,nextBlockFlat:1,desc:'1ダメージ×4。山札再構築直後なら×7。使用後、次の防御+1。'});
 P('echo_flurry',{damage:2,hits:3,hitsIfRecentReshuffle:6,nextStatusFlat:1,desc:'2ダメージ×3。山札再構築直後なら×6。使用後、次の状態異常+1。'});
 P('recycle_flurry',{damage:2,hits:3,hitsIfRecentReshuffle:7,returnBottom:true,desc:'2ダメージ×3。山札再構築直後なら×7。使用後は山札下へ戻る。'});
 P('v17_cycle_barrage',{damage:2,hits:3,hitsIfRecentReshuffle:7,reserveSelfOnReshuffle:true,desc:'2ダメージ×3。山札再構築直後なら×7。再構築直後に使うと自身を次回提示へ予約する。'});
 // 単純回収・毒・多段の明確な下位互換候補
 P('recovery_run',{damage:5,recoverLastDiscard:1,nextBlockFlat:2,desc:'5ダメージ。最後に捨てられたカード1枚を山札上へ戻す。使用後、次の防御+2。'});
 P('recycle_dash',{damage:7,recoverLastDiscard:1,primeSingleHitBuff:.05,desc:'7ダメージ。最後に捨てられたカード1枚を山札上へ戻す。使用後、次の1ヒット攻撃+5%。'});
 P('toxic_cascade',{damage:1,hits:5,statusPerHit:{type:'poison',amount:1},poisonAnchor:true,desc:'1ダメージ×5。各ヒットで毒1。使用後、この戦闘では毒の次ターン減衰を一度抑える。'});
 P('swift_toxin',{damage:1,hits:6,statusPerHit:{type:'poison',amount:1},vanishAfterUse:true,tags:['連撃','毒','消失'],desc:'1ダメージ×6。各ヒットで毒1。使用後は消失する。瞬間的に毒を置いて圧縮する。'});
 P('frenzy_guard',{block:6,blockIfPrevMulti:14,nextBlockFlat:1,desc:'防御6。直前が多段攻撃なら防御14。使用後、次の防御+1。'});
 P('rapid_guard',{block:9,blockIfPrevMulti:15,nextStatusFlat:1,desc:'防御9。直前が多段攻撃なら防御15。使用後、次の状態異常+1。'});
 // 位置・非選択・連結のペア
 P('left_guard',{block:7,blockIfPosition:{position:'left',value:13},nextBlockFlat:1,desc:'防御7。左枠なら防御13。使用後、次の防御+1。'});
 P('wing_parry',{block:7,blockIfPosition:{position:'left',value:14},returnBottom:true,desc:'防御7。左枠なら防御14。使用後は山札下へ戻る。'});
 P('residue_bridge',{damage:5,buffNextIfNotChosen:.20,nextBlockFlat:1,desc:'5ダメージ。選ばれず捨てられた時は次カード+20%。使用した場合は次の防御+1。'});
 P('left_residue',{damage:5,buffNextIfNotChosen:.18,nextStatusFlat:1,desc:'5ダメージ。選ばれず捨てられた時は次カード+18%。使用した場合は次の状態異常+1。'});
 P('relay_wall',{block:7,blockIfLinkedCombo:18,nextBlockFlat:1,desc:'防御7。連結コンボなら防御18。使用後、次の防御+1。'});
 P('relay_shield',{block:5,blockIfLinkedCombo:19,nextStatusFlat:1,desc:'防御5。連結コンボなら防御19。使用後、次の状態異常+1。'});
 // v0.59で誤ったプロパティ名を使った消失札を実処理へ接続。
 P('v18_sevenfold_pierce',{vanishAfterUse:true,vanish:false,desc:'3ダメージ×5、防御55%無視。使用後は消失する。高貫通を一度きりの圧縮札として使う。'});
 D.V60_FINALFIX2_CARD_IDS=[...new Set(ids)];
})();
