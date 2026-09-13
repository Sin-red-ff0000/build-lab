'use strict';
(function(){
  const BL=window.BuildLab,D=BL.Data;
  const claimed=id=>s=>!!s.claimedUnlocks?.[id];
  const win=(id,kind,reward,title,condition,when,chapter=4)=>({id,kind,reward,title,condition,event:'win',when,check:claimed(id),chapter});
  const hasTag=(s,tag,n)=>s.deck.filter(id=>(D.getCardTags?D.getCardTags(s,id):D.CARDS[id]?.tags||[]).includes(tag)).length>=n;
  const hasAltStyle=s=>!!D.getCharacterStyle?.(s,s.character);
  const hasTune=s=>Object.keys(s.cardTunings||{}).length>0;
  const hasConv=s=>Object.keys(s.cardConversions||{}).length>0;
  const behaviorCount=b=>(b?.enemy?.behaviors||[]).length;

  D.UNLOCKS.push(
    win('v14_discard_pack','mixed',['sediment_blade','residue_bastion','cinder_offcut','salvage_jab','v14_discard_core'],'残滓研究 III','捨て札タグを5枚以上採用して勝利',(s,b)=>hasTag(s,'捨て札',5)),
    win('v14_multi_pack','mixed',['ninefold_beat','v14_toxic_barrage','scarlet_volley','recycle_flurry','v14_multi_core'],'連撃研究 III','連撃タグを5枚以上採用して勝利',(s,b)=>hasTag(s,'連撃',5)),
    win('v14_status_pack','mixed',['venom_pressure','ember_guard','symptom_harvest','erosion_rush','v14_status_core'],'状態異常研究 III','状態異常タグを5枚以上採用して勝利',(s,b)=>hasTag(s,'状態異常',5)),
    win('v14_guard_pack','mixed',['v14_iron_echo','patient_bulwark','counter_edge','regen_guard','v14_guard_core'],'耐久研究 III','耐久タグを5枚以上採用して勝利',(s,b)=>hasTag(s,'耐久',5)),
    win('v14_blood_pack','mixed',['blood_pike','crisis_barrage','scar_guard','brink_strike','v14_blood_core'],'自傷研究 III','自傷タグを5枚以上採用して勝利',(s,b)=>hasTag(s,'自傷',5)),
    win('v14_cycle_pack','mixed',['return_edge_ii','return_fortress','cycle_venom_ii','reclaim_loop','v14_cycle_core'],'循環研究 III','循環タグを5枚以上採用して勝利',(s,b)=>hasTag(s,'循環',5)),

    win('v14_discard_cycle','mixed',['v14_discard_cycle','v14_p_residue_cycle'],'残滓輪転研究','捨て札タグと循環タグを各3枚以上採用して勝利',(s,b)=>hasTag(s,'捨て札',3)&&hasTag(s,'循環',3)),
    win('v14_multi_status','mixed',['v14_multi_status','v14_p_multi_status'],'多段侵蝕研究','連撃タグと状態異常タグを各3枚以上採用して勝利',(s,b)=>hasTag(s,'連撃',3)&&hasTag(s,'状態異常',3)),
    win('v14_guard_counter','mixed',['v14_guard_counter','v14_p_guard_counter'],'反照防衛研究','耐久タグと反撃タグを各3枚以上採用して勝利',(s,b)=>hasTag(s,'耐久',3)&&hasTag(s,'反撃',3)),
    win('v14_blood_multi','mixed',['v14_blood_multi','v14_p_blood_multi'],'血雨加速研究','自傷タグと連撃タグを各3枚以上採用して勝利',(s,b)=>hasTag(s,'自傷',3)&&hasTag(s,'連撃',3)),

    win('v14_style_meta','mixed',['style_edge_ii','v14_style_relay','v14_p_style_bridge'],'スタイル応用 II','派生キャラクタースタイルを使用して勝利',(s,b)=>hasAltStyle(s)),
    win('v14_tune_meta','mixed',['tuning_guard_ii','v14_tuning_relay','v14_p_tune_bridge'],'調律応用 II','カード調律を1種類以上設定して勝利',(s,b)=>hasTune(s)),
    win('v14_conversion_meta','mixed',['conversion_burst_ii','v14_conversion_relay','v14_p_convert_bridge'],'役割変換応用 II','役割変換を1種類以上設定して勝利',(s,b)=>hasConv(s)),
    win('v14_behavior_meta','mixed',['behavior_lance_ii','v14_behavior_relay','v14_p_behavior_bridge'],'複合挙動解析 II','複合挙動を1種類以上持つ敵に勝利',(s,b)=>behaviorCount(b)>=1),
    win('v14_link_card','card',['v14_linked_residue'],'連結残滓','1戦で連結コンボを3回以上成立させて勝利',(s,b)=>(b.linkComboCount||0)>=3),
    win('v14_doctrine_card','card',['doctrine_wall_ii'],'構築規格防衛','構築規格を装備して勝利',(s,b)=>!!s.doctrine)
  );
})();
