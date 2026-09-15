'use strict';
(function(){
 const D=window.BuildLab.Data,E=D.ENDGAME58;if(!E)return;
 // v0.62: real-combat recalibration. Keep trials distinct, but remove impossible/openly trivial stat walls.
 const patch={
  opening_storm:{enemy:{hp:2.5,atk:.9,def:1.0,spd:1.8,regen:0,resist:8,traits:{fast:true}}},
  late_awaken:{enemy:{hp:3.5,atk:1.0,def:1.5,spd:1.0,regen:1,resist:15,traits:{regenerative:true,berserk:true}}},
  action_flood:{enemy:{hp:3.0,atk:.8,def:1.1,spd:2.2,regen:0,resist:10,traits:{fast:true,adaptive:true}}},
  long_attrition:{enemy:{hp:4.5,atk:1.2,def:2.5,spd:1.0,regen:1,resist:25,traits:{armored:true,regenerative:true}}},
  cleansing_field:{enemy:{hp:3.5,atk:1.1,def:1.5,spd:1.4,regen:0,resist:25,traits:{purifier:true}}},
  adaptive_matrix:{enemy:{hp:3.8,atk:1.1,def:1.7,spd:1.4,regen:0,resist:18,traits:{adaptive:true}}},
  void_archive:{enemy:{hp:3.6,atk:1.1,def:1.4,spd:1.4,regen:0,resist:15,traits:{nullfield:true}}},
  synthesis:{enemy:{hp:4.0,atk:1.2,def:1.8,spd:1.4,regen:0,resist:18,traits:{convergence:true}}}
 };
 for(const [id,p] of Object.entries(patch))Object.assign(E.trials[id],p);
 E.version='0.62';
 E.policy='実戦探索で校正間の極端な0%/99%偏りを検出し、各校正を複数の構築回答が成立する難度帯へ再校正する。単一万能構築は合格としない。';
 // The two zero-win concepts found by v0.61 receive rule support, not raw giant numbers.
 if(D.V23_STYLE_RULES?.zephyr_mist){D.V23_STYLE_RULES.zephyr_mist=[{when:{positionSide:true},mult:1.06},{when:{materialMade:'mist',positionSide:true},mult:1.06}];}
 if(D.CHARACTER_STYLES?.zephyr_mist)D.CHARACTER_STYLES.zephyr_mist.desc='左右枠のカード+6%。霧滴を生成済みならさらに+6%。霧滴が無い戦闘でも位置運用が死なない。';
 // v0.61 showed four cards functioning as near-universal engines. Narrow them without deleting their identities.
 const C=D.CARDS;
 if(C.v34_s_plague)Object.assign(C.v34_s_plague,{block:10,statuses:[{type:'poison',amount:5},{type:'burn',amount:3},{type:'weak',amount:1}],desc:'防御10＋毒5＋火傷3＋弱体1。複数症状の起点だが、これ1枚で耐久と蓄積を完結させない。'});
 if(C.v34_d_salvage_guard)Object.assign(C.v34_d_salvage_guard,{damage:8,block:8,discardBlockBoost:12,desc:'8ダメージ＋防御8。一度捨てられていれば防御12。最後の捨て札を山札上へ戻す。'});
 if(C.v34_m_statusburst)Object.assign(C.v34_m_statusburst,{hits:5,damage:3,perHitStatus:{type:'poison',amount:1},armorPierceIfStatus:.25,desc:'3ダメージ×5。各ヒットで毒1。状態異常中なら防御25%無視。連撃と毒の橋渡しに特化。'});
 if(C.v34_c_reset)Object.assign(C.v34_c_reset,{block:11,buffNext:.12,desc:'防御11。捨て札と除外を再構築し、次カードの効果+12%。循環を起こすこと自体を主役にする。'});
 if(C.v34_g_recovery)Object.assign(C.v34_g_recovery,{block:12,heal:6,blockIfTurnMin:{turn:4,value:17},desc:'防御12＋HP6回復。4ターン目以降は防御17。長期戦の維持札。'});
 D.V62_REAL_COMBAT_PATCH={trialIds:Object.keys(patch),universalCards:['v34_s_plague','v34_d_salvage_guard','v34_m_statusburst','v34_c_reset','v34_g_recovery'],rescuedStyles:['zephyr_mist']};
})();
