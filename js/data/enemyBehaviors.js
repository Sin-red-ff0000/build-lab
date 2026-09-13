'use strict';
(function(){
  const BL=window.BuildLab; const D=BL.Data;
  D.ENEMY_BEHAVIORS={
    bh_brutal_pulse:{name:'暴虐脈動',requires:['giant','berserk'],desc:'HP50%以下になると一度だけ攻撃力+3。',rules:{lowHpAtkOnce:3}},
    bh_mobile_slaughter:{name:'狂奔連鎖',requires:['berserk','fast'],desc:'3ターンごとに追加で1回行動する。',rules:{everyNTurnExtraAction:{turns:3,extra:1}}},
    bh_fortress_mass:{name:'重圧城壁',requires:['giant','armored'],desc:'3ターンごとに敵ターン開始時、障壁12を得る。',rules:{everyNTurnBlock:{turns:3,amount:12}}},
    bh_giant_surge:{name:'巨躯加速',requires:['giant','fast'],desc:'HP50%以下で一度だけ速度+0.45。',rules:{lowHpSpeedOnce:.45}},
    bh_giant_regen:{name:'巨体再生',requires:['giant','regenerative'],desc:'HP50%以下では再生量が2倍になる。',rules:{lowHpRegenMult:2}},
    bh_blood_regen:{name:'血潮再生',requires:['berserk','regenerative'],desc:'前の敵ターンに再生していた場合、次の攻撃+3。',rules:{healNextAttackBonus:3}},
    bh_purge_rage:{name:'浄血反応',requires:['berserk','purifier'],desc:'弱体・脆弱を各1消費して、その敵ターンの攻撃+3。',rules:{consumeDebuffAttackBonus:3}},
    bh_mobile_armor:{name:'機動装甲',requires:['armored','fast'],desc:'1ターンに2回以上行動する敵ターン開始時、障壁6を得る。',rules:{multiActionBlock:6}},
    bh_regen_armor:{name:'再生装甲',requires:['armored','regenerative'],desc:'再生で回復した時、回復量と同じ障壁を最大8得る。',rules:{healBlockRatio:1,healBlockMax:8}},
    bh_white_carapace:{name:'白殻浄化',requires:['armored','purifier'],desc:'敵ターン終了時に毒・火傷を各1減らし、減らした場合は障壁6。',rules:{cleanseEnd:{amount:1,block:6}}},
    bh_adaptive_bloom:{name:'適応増殖',requires:['regenerative','purifier'],desc:'3ターンごとに全状態異常を1ずつ減らし、HP5回復。',rules:{everyNTurnCleanseHeal:{turns:3,amount:1,heal:5}}},
    bh_cleanse_rush:{name:'浄閃反応',requires:['fast','purifier'],desc:'何らかの状態異常を受けている間、攻撃+2。',rules:{statusAttackBonus:2}},
    bh_titan_breaker:{name:'超重粉砕',requires:['titan','berserk'],desc:'3ターンごとに、その敵ターンの攻撃+5。',rules:{everyNTurnAttackBonus:{turns:3,amount:5}}},
    bh_bloodflare_rush:{name:'血炎疾走',requires:['bloodflare','fast'],desc:'前の敵ターンに再生していた場合、次の敵ターンの行動回数+1。',rules:{healNextExtraAction:true}},
    bh_null_purifier:{name:'無影浄化',requires:['nullstep','purifier'],desc:'状態異常を受けている間、攻撃+3。敵ターン終了時に毒・火傷を各1減らす。',rules:{statusAttackBonus:3,cleanseEnd:{amount:1,block:0}}},
    bh_eternal_shell:{name:'永生外殻',requires:['eternal','armored'],desc:'再生で回復した時、回復量と同じ障壁を最大12得る。',rules:{healBlockRatio:1,healBlockMax:12}}
  };
  D.getActiveEnemyBehaviors=function(state){
    return Object.entries(D.ENEMY_BEHAVIORS).filter(([id,b])=>state?.unlockedBehaviors?.[id]&&b.requires.every(t=>state?.unlockedTraits?.[t]&&state?.enemy?.traits?.[t])).map(([id])=>id);
  };
  D.behaviorConditionText=function(id){const b=D.ENEMY_BEHAVIORS[id];return b?`${b.requires.map(t=>D.TRAITS[t]?.name||t).join('＋')}を同時適用して実験開始`:'';};
})();
