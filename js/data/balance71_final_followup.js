'use strict';
(function(){
 const D=window.BuildLab.Data,E=D.ENDGAME58,C=D.CARDS;if(!E)return;
 const patch=(id,p)=>{if(C[id])Object.assign(C[id],p);};
 // v0.71 凍傷：恒久デバフではなく「次の敵ターンを買う」短期防御として採用理由を明確化。
 // カード単体の巨大数値化は避け、攻撃・防御・循環の各デッキから凍傷へ入れる入口を整える。
 patch('weakening_mist',{status:{type:'frost',amount:4},tags:['状態異常','凍傷','耐久'],desc:'凍傷4。次の敵ターンの各攻撃を短く鈍らせる。凍傷は敵ターン終了時に1だけ減衰する。'});
 patch('weakening_brand',{damage:5,status:{type:'frost',amount:3},tags:['状態異常','凍傷','単発'],primeSingleHitBuff:.04,desc:'5ダメージ＋凍傷3。次の1ヒット+4%。短期抑制から単発重撃へ接続する。'});
 patch('v41_frost_mark',{damage:4,status:{type:'frost',amount:4},tags:['凍傷','状態異常','単発'],desc:'4ダメージ＋凍傷4。攻撃しながら次の敵ターンの多行動を抑える。'});
 patch('v41_frost_guard',{block:8,status:{type:'frost',amount:3},tags:['凍傷','状態異常','耐久'],desc:'防御8＋凍傷3。現在の一撃を受け、次の敵ターンも短く抑える。'});
 patch('v41_frost_cycle',{status:{type:'frost',amount:4},statusIfRecentReshuffle:6,tags:['凍傷','状態異常','循環'],desc:'凍傷4。山札再構築直後なら凍傷6。循環を次ターンの行動抑制へ変換する。'});
 // 消耗校正は「長期資源戦」を維持したまま、装甲＋再生の二重壁だけを少し緩和。
 // HPを大きく落として瞬間火力試験にはしない。
 Object.assign(E.trials.long_attrition.enemy,{hp:4.3,atk:1.15,def:2.15,spd:1.0,regen:1,resist:22});
 E.trials.long_attrition.pressure='瞬間火力ではなく資源効率を問う。装甲と再生を長期的に越えるため、消失圧縮・復帰・循環・防御運用を使い分ける。';
 E.version='0.71';
 D.V71_FINAL_FOLLOWUP={
  frost:{role:'次の敵ターンの各攻撃を一時抑制',decayPerEnemyTurn:1,penaltyRatio:.40,cards:['weakening_mist','weakening_brand','v41_frost_mark','v41_frost_guard','v41_frost_cycle']},
  attrition:{before:{hp:4.5,atk:1.2,def:2.5,regen:1,resist:25},after:{hp:4.3,atk:1.15,def:2.15,regen:1,resist:22}},
  targetedReaudit:['relay_direction','braid_cycle','converter_spend']
 };
})();
