'use strict';
(function(){
  const BL=window.BuildLab,D=BL.Data;
  const claimed=id=>s=>!!s.claimedUnlocks?.[id];
  const win=(id,kind,reward,title,condition,when)=>({id,kind,reward,title,condition,event:'win',when,check:claimed(id),chapter:4});
  const hasTag=(s,tag,n)=>s.deck.filter(id=>(D.getCardTags?D.getCardTags(s,id):D.CARDS[id]?.tags||[]).includes(tag)).length>=n;

  D.UNLOCKS.push(
    win('v17_discard_pack','mixed',['v17_residue_spear','v17_echo_fort','v17_cinder_cache','v17_reclaim_cut','v17_discard_focus','v17_p_discard'],'残滓研究 IV','捨て札タグを6枚以上採用して勝利',(s,b)=>hasTag(s,'捨て札',6)),
    win('v17_multi_pack','mixed',['v17_sixfold_needle','v17_venom_fan','v17_guard_barrage','v17_cycle_barrage','v17_multi_focus','v17_p_multi'],'連撃研究 IV','連撃タグを6枚以上採用して勝利',(s,b)=>hasTag(s,'連撃',6)),
    win('v17_status_pack','mixed',['v17_deep_venom','v17_ember_shell','v17_symptom_breaker','v17_erosion_storm','v17_status_focus','v17_p_status'],'状態異常研究 IV','状態異常タグを6枚以上採用して勝利',(s,b)=>hasTag(s,'状態異常',6)),
    win('v17_guard_pack','mixed',['v17_guard_lance','v17_deep_wall','v17_regen_seal','v17_last_guard','v17_guard_focus','v17_p_guard'],'耐久研究 IV','耐久タグを6枚以上採用して勝利',(s,b)=>hasTag(s,'耐久',6)),
    win('v17_blood_pack','mixed',['v17_blood_cannon','v17_crisis_fusillade','v17_scar_bulwark','v17_brink_avalanche','v17_blood_focus','v17_p_blood'],'自傷研究 IV','自傷タグを6枚以上採用して勝利',(s,b)=>hasTag(s,'自傷',6)),
    win('v17_cycle_pack','mixed',['v17_return_needle','v17_return_wall','v17_cycle_poison','v17_salvage_loop','v17_cycle_focus','v17_p_cycle'],'循環研究 IV','循環タグを6枚以上採用して勝利',(s,b)=>hasTag(s,'循環',6)),

    win('v17_discard_status','relic',['v17_discard_status'],'残症応用','捨て札タグと状態異常タグを各4枚以上採用して勝利',(s,b)=>hasTag(s,'捨て札',4)&&hasTag(s,'状態異常',4)),
    win('v17_multi_cycle','relic',['v17_multi_cycle'],'連環応用','連撃タグと循環タグを各4枚以上採用して勝利',(s,b)=>hasTag(s,'連撃',4)&&hasTag(s,'循環',4)),
    win('v17_status_guard','relic',['v17_status_guard'],'症状防衛応用','状態異常タグと耐久タグを各4枚以上採用して勝利',(s,b)=>hasTag(s,'状態異常',4)&&hasTag(s,'耐久',4)),
    win('v17_guard_counter','relic',['v17_guard_counter'],'重反照応用','耐久タグと反撃タグを各4枚以上採用して勝利',(s,b)=>hasTag(s,'耐久',4)&&hasTag(s,'反撃',4)),
    win('v17_blood_guard','relic',['v17_blood_guard'],'血殻応用','自傷タグと耐久タグを各4枚以上採用して勝利',(s,b)=>hasTag(s,'自傷',4)&&hasTag(s,'耐久',4)),
    win('v17_cycle_status','relic',['v17_cycle_status'],'循症応用','循環タグと状態異常タグを各4枚以上採用して勝利',(s,b)=>hasTag(s,'循環',4)&&hasTag(s,'状態異常',4))
  );
})();
