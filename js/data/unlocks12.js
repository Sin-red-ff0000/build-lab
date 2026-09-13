'use strict';
(function(){
  const BL=window.BuildLab; const D=BL.Data;
  const claimed=id=>s=>!!s.claimedUnlocks?.[id];
  const trait=id=>s=>!!s.unlockedTraits?.[id];
  const behavior=id=>s=>!!s.unlockedBehaviors?.[id];
  const win=(id,kind,reward,title,condition,when,chapter=4)=>({id,kind,reward,title,condition,event:'win',when,check:claimed(id),chapter});
  const hasTag=(s,tag,n)=>s.deck.filter(id=>(D.getCardTags?D.getCardTags(s,id):D.CARDS[id]?.tags||[]).includes(tag)).length>=n;
  const hasBehavior=(b,id)=>!!b.enemy.behaviors?.includes(id);
  const behaviorCount=b=>(b.enemy.behaviors||[]).length;

  D.UNLOCKS.push(
    {id:'v12_t_titan',kind:'trait',reward:['titan'],title:'特殊個体：超重',condition:'HP倍率×12以上＋防御倍率×9以上に設定して実験開始',check:trait('titan'),chapter:4},
    {id:'v12_t_bloodflare',kind:'trait',reward:['bloodflare'],title:'特殊個体：血炎',condition:'第1ボス撃破後、攻撃倍率×10以上＋再生力6以上で実験開始',check:trait('bloodflare'),chapter:4},
    {id:'v12_t_nullstep',kind:'trait',reward:['nullstep'],title:'特殊個体：無影',condition:'第1ボス撃破後、速度倍率×4以上＋状態異常耐性70%以上で実験開始',check:trait('nullstep'),chapter:4},
    {id:'v12_t_eternal',kind:'trait',reward:['eternal'],title:'特殊個体：永生',condition:'第1ボス撃破後、HP倍率×8以上＋再生力10以上で実験開始',check:trait('eternal'),chapter:4}
  );

  for(const [id,b] of Object.entries(D.ENEMY_BEHAVIORS||{})){
    D.UNLOCKS.push({id:`v12_behavior_${id}`,kind:'behavior',reward:[id],title:`複合挙動：${b.name}`,condition:D.behaviorConditionText(id),check:behavior(id),chapter:4});
  }

  D.UNLOCKS.push(
    win('v12_brutal_clear','mixed',['behavior_probe','behavior_crisis','behavior_scope'],'暴虐脈動の攻略','「暴虐脈動」が発動した敵を撃破',(s,b)=>hasBehavior(b,'bh_brutal_pulse')),
    win('v12_mobile_clear','mixed',['behavior_barrage','behavior_finish','behavior_hammer'],'狂奔連鎖の攻略','「狂奔連鎖」が発動した敵を撃破',(s,b)=>hasBehavior(b,'bh_mobile_slaughter')),
    win('v12_fortress_clear','mixed',['behavior_guard','behavior_reversal','behavior_wall'],'重圧城壁の攻略','「重圧城壁」が発動した敵を撃破',(s,b)=>hasBehavior(b,'bh_fortress_mass')),
    win('v12_surge_clear','mixed',['behavior_multi','behavior_link','behavior_relay'],'巨躯加速の攻略','「巨躯加速」が発動した敵を撃破',(s,b)=>hasBehavior(b,'bh_giant_surge')),
    win('v12_giant_regen_clear','mixed',['behavior_suppress','behavior_cycle','behavior_cycle_relic'],'巨体再生の攻略','「巨体再生」が発動した敵を撃破',(s,b)=>hasBehavior(b,'bh_giant_regen')),
    win('v12_blood_regen_clear','mixed',['unstable_blood','behavior_convert','behavior_converter'],'血潮再生の攻略','「血潮再生」が発動した敵を撃破',(s,b)=>hasBehavior(b,'bh_blood_regen')),
    win('v12_purge_clear','mixed',['behavior_brand','behavior_anti_resist','behavior_catalyst'],'浄血反応の攻略','「浄血反応」が発動した敵を撃破',(s,b)=>hasBehavior(b,'bh_purge_rage')),
    win('v12_mobile_armor_clear','mixed',['behavior_counter','behavior_tune','behavior_tuner'],'機動装甲の攻略','「機動装甲」が発動した敵を撃破',(s,b)=>hasBehavior(b,'bh_mobile_armor')),
    win('v12_white_clear','mixed',['behavior_pierce','behavior_doctrine','behavior_doctrine_relic'],'白殻浄化の攻略','「白殻浄化」が発動した敵を撃破',(s,b)=>hasBehavior(b,'bh_white_carapace')),
    win('v12_adaptive_clear','mixed',['behavior_status_mix','behavior_discard','behavior_discard_relic'],'適応増殖の攻略','「適応増殖」が発動した敵を撃破',(s,b)=>hasBehavior(b,'bh_adaptive_bloom')),
    win('v12_titan_behavior_clear','mixed',['analysis_guard','savage_break','behavior_style_relic'],'超重粉砕の攻略','「超重粉砕」が発動した敵を撃破',(s,b)=>hasBehavior(b,'bh_titan_breaker')),
    win('v12_eternal_behavior_clear','mixed',['behavior_salvage','behavior_bridge','behavior_crisis_relic'],'永生外殻の攻略','「永生外殻」が発動した敵を撃破',(s,b)=>hasBehavior(b,'bh_eternal_shell')),

    win('v12_protocol_analysis','protocol',['behavior_analysis'],'複合挙動解析規格','複合挙動が発動した敵を、複合挙動タグ3枚以上のデッキで撃破',(s,b)=>behaviorCount(b)>=1&&hasTag(s,'複合挙動',3)),
    win('v12_protocol_assault','protocol',['behavior_assault'],'挙動破砕規格','複合挙動が発動した敵を、連撃タグ5枚以上で撃破',(s,b)=>behaviorCount(b)>=1&&hasTag(s,'連撃',5)),
    win('v12_protocol_fortify','protocol',['behavior_fortify'],'挙動防衛規格','複合挙動が発動した敵を、耐久5枚＋反撃2枚以上で撃破',(s,b)=>behaviorCount(b)>=1&&hasTag(s,'耐久',5)&&hasTag(s,'反撃',2)),
    win('v12_protocol_ailment','protocol',['behavior_ailment'],'挙動侵蝕規格','複合挙動が発動した敵を、状態異常タグ5枚以上で撃破',(s,b)=>behaviorCount(b)>=1&&hasTag(s,'状態異常',5)),
    win('v12_protocol_bridge','protocol',['behavior_bridge_protocol'],'挙動架橋規格','複合挙動が発動した敵を、調律または役割変換を1種類以上設定して撃破',(s,b)=>behaviorCount(b)>=1&&(Object.keys(s.cardTunings||{}).length>=1||Object.keys(s.cardConversions||{}).length>=1)),
    win('v12_protocol_combo','protocol',['behavior_combo_protocol'],'複合対複合規格','2種類以上の複合挙動が同時発動した敵を撃破',(s,b)=>behaviorCount(b)>=2)
  );
})();
