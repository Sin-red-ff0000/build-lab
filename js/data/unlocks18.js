'use strict';
(function(){
  const BL=window.BuildLab,D=BL.Data;
  const claimed=id=>s=>!!s.claimedUnlocks?.[id];
  const win=(id,kind,reward,title,condition,when)=>({id,kind,reward,title,condition,event:'win',when,check:claimed(id),chapter:4});
  const hasTag=(s,tag,n)=>s.deck.filter(id=>(D.getCardTags?D.getCardTags(s,id):D.CARDS[id]?.tags||[]).includes(tag)).length>=n;

  D.UNLOCKS.push(
    win('v18_discard_pack','mixed',['v18_residue_cannon','v18_ash_guard','v18_salvage_venom','v18_discard_core','v18_p_discard'],'残滓研究 V','捨て札タグを7枚以上採用して勝利',(s,b)=>hasTag(s,'捨て札',7)),
    win('v18_multi_pack','mixed',['v18_sevenfold_pierce','v18_venom_chain','v18_guard_volley','v18_multi_core','v18_p_multi'],'連撃研究 V','連撃タグを7枚以上採用して勝利',(s,b)=>hasTag(s,'連撃',7)),
    win('v18_status_pack','mixed',['v18_toxic_brand','v18_burning_shell','v18_symptom_hammer','v18_status_core','v18_p_status'],'状態異常研究 V','状態異常タグを7枚以上採用して勝利',(s,b)=>hasTag(s,'状態異常',7)),
    win('v18_guard_pack','mixed',['v18_counter_wall','v18_late_bastion','v18_regen_barrier','v18_guard_core','v18_p_guard'],'耐久研究 V','耐久タグを7枚以上採用して勝利',(s,b)=>hasTag(s,'耐久',7)),
    win('v18_blood_pack','mixed',['v18_blood_breaker','v18_crisis_storm','v18_scar_fort','v18_blood_core','v18_p_blood'],'自傷研究 V','自傷タグを7枚以上採用して勝利',(s,b)=>hasTag(s,'自傷',7)),
    win('v18_cycle_pack','mixed',['v18_return_spear','v18_return_guard','v18_cycle_burn','v18_cycle_core','v18_p_cycle'],'循環研究 V','循環タグを7枚以上採用して勝利',(s,b)=>hasTag(s,'循環',7)),

    win('v18_style_bridge','mixed',['v18_style_strike','v18_style_relay'],'様式応用 III','派生キャラスタイルを使用して勝利',(s,b)=>!!D.getCharacterStyle?.(s,s.character)),
    win('v18_tuning_bridge','mixed',['v18_tuning_bastion','v18_tuning_relay'],'調律応用 III','カード調律を2種類設定して勝利',(s,b)=>Object.keys(s.cardTunings||{}).length>=2),
    win('v18_conversion_bridge','mixed',['v18_conversion_lance','v18_conversion_relay'],'変成応用 III','役割変換を2種類設定して勝利',(s,b)=>Object.keys(s.cardConversions||{}).length>=2),
    win('v18_link_bridge','mixed',['v18_link_surge','v18_link_relay'],'連結応用 III','カード連結を設定して勝利',(s,b)=>!!(s.cardLink?.a&&s.cardLink?.b)),
    win('v18_doctrine_bridge','mixed',['v18_doctrine_guard','v18_doctrine_relay'],'規格応用 III','構築規格を使用して勝利',(s,b)=>!!s.doctrine),
    win('v18_behavior_bridge','mixed',['v18_behavior_hammer','v18_behavior_relay'],'異相応用 III','複合挙動が1つ以上発生している敵に勝利',(s,b)=>(b?.enemy?.behaviors?.length||0)>=1)
  );
})();
