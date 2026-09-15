'use strict';
(function(){
  const D=window.BuildLab.Data;
  const patch=(id,x)=>{if(D.CARDS[id])Object.assign(D.CARDS[id],x);};
  // v0.48 第1次未使用札再設計。
  // 「hit数が違うだけ」「同じ仕事で数値が低いだけ」を避け、後続カードへ役割を渡す基礎部品へ分離する。
  patch('double_strike',{damage:4,hits:2,primeSingleHitBuff:.12,desc:'4ダメージ×2。使用後、次に使う1ヒット攻撃だけ効果+12%。少hit重撃への橋渡し。'});
  patch('triple_cut',{damage:3,hits:3,nextBlockFlat:3,desc:'3ダメージ×3。使用後、次に使う防御カードの防御+3。連撃から守りへ繋ぐ基礎札。'});
  patch('needle_rain',{damage:1,hits:5,nextStatusFlat:2,desc:'1ダメージ×5。5ヒット完遂後、次に付与する状態異常+2。hit数を症状準備へ変える。'});
  patch('combo_guard',{damage:2,hits:2,block:6,blockIfPrevMulti:11,desc:'2ダメージ×2＋防御6。直前が3ヒット以上なら防御11。多段攻撃の後を受け持つ防御札。'});
  patch('crimson_focus',{selfDamage:3,buffNext:0,buffNextSelfDamage:.35,desc:'HP3を失う。次に使う自傷カードだけ効果+35%。汎用強化ではなく再踏込みへ特化。'});
  patch('blood_poison',{selfDamage:2,status:{type:'poison',amount:4},statusIfHpDirectionSwitches:{min:2,amount:7},desc:'HP2を失い毒4。HPの増減方向を2回以上切り替えた戦闘では毒7。自傷の再踏込みを毒投与へ接続する。'});
  patch('sacrificial_combo',{selfDamage:4,damage:4,hits:3,nextSelfDamageBuffAfterMulti:.12,desc:'HP4を失い4ダメージ×3。使用後、次の自傷カード+12%。高負荷の連撃を再踏込みの起点にする。'});
  patch('toxic_needles',{damage:1,hits:4,perHitStatus:{type:'poison',amount:1},poisonAnchor:true,desc:'1ダメージ×4。各ヒットで毒1。このターンの毒は次の敵ターン終了時に減衰しない。継続投与の維持札。'});
  patch('ember_needles',{damage:1,hits:4,perHitStatus:{type:'burn',amount:1},burnRefresh:2,desc:'1ダメージ×4。各ヒットで火傷1。既に火傷中なら再点火し火勢+2。連撃で燃焼サイクルを繋ぐ。'});
  patch('wall',{block:9,stableGuard:true,desc:'防御9。このカードで得た防御は敵の最初の攻撃に対して2だけ追加で働く。条件不要の安定防御。'});
  patch('parry',{block:5,returnIfFullBlock:true,nextBlockFlatOnReturn:2,desc:'防御5。敵攻撃を完全防御すると山札へ戻り、次の防御カードの防御+2。完全防御を循環へ変える。'});
  patch('status_detonator',{damage:4,damagePerTotalStatus:.5,statusPreserveOnUse:1,desc:'4ダメージ。敵の状態異常合計値2につき+1ダメージ。使用後、最も多い状態異常を1だけ維持する。蓄積を全部火力へ置換しない症状利用札。'});
  D.V48_REDESIGNED_CARD_IDS=['double_strike','triple_cut','needle_rain','combo_guard','crimson_focus','blood_poison','sacrificial_combo','toxic_needles','ember_needles','wall','parry','status_detonator'];
})();
