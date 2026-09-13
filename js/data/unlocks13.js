'use strict';
(function(){
  const BL=window.BuildLab,D=BL.Data;
  const claimed=id=>s=>!!s.claimedUnlocks?.[id];
  const win=(id,kind,reward,title,condition,when,chapter=4)=>({id,kind,reward,title,condition,event:'win',when,check:claimed(id),chapter});
  const mode=id=>s=>!!s.unlockedLinkModes?.[id];
  const hasTag=(s,tag,n)=>s.deck.filter(id=>(D.getCardTags?D.getCardTags(s,id):D.CARDS[id]?.tags||[]).includes(tag)).length>=n;
  const pairDisjoint=s=>{const l=s.cardLink||{},a=D.CARDS[l.a],b=D.CARDS[l.b];if(!a||!b)return false;return !a.tags.some(t=>b.tags.includes(t));};

  D.UNLOCKS.push(
    win('v13_link_forward','linkmode',['forward'],'連結方式：順接','1戦で順方向(A→B)連結コンボを3回以上成立させて勝利',(s,b)=>(b.linkForwardCount||0)>=3),
    win('v13_link_reverse','linkmode',['reverse'],'連結方式：逆接','1戦で逆方向(B→A)連結コンボを3回以上成立させて勝利',(s,b)=>(b.linkReverseCount||0)>=3),
    win('v13_link_bridge','linkmode',['bridge'],'連結方式：異種架橋','共通タグの無い2種類を連結して勝利',(s,b)=>pairDisjoint(s)&&!!s.cardLink?.a&&!!s.cardLink?.b),

    win('v13_discard_pack','mixed',['residue_fang','residue_shell','residue_needle','v13_discard_core'],'残滓研究 II','捨て札タグを4枚以上採用して勝利',(s,b)=>hasTag(s,'捨て札',4)),
    win('v13_multi_pack','mixed',['v13_sixfold_cut','pressure_rush','echo_flurry','v13_multi_core'],'連撃研究 II','連撃タグを4枚以上採用して勝利',(s,b)=>hasTag(s,'連撃',4)),
    win('v13_status_pack','mixed',['venom_brand','ember_mesh','symptom_edge','v13_status_core'],'状態異常研究 II','状態異常タグを4枚以上採用して勝利',(s,b)=>hasTag(s,'状態異常',4)),
    win('v13_guard_pack','mixed',['iron_return','sealed_wall','patient_edge','v13_guard_core'],'耐久研究 II','耐久タグを4枚以上採用して勝利',(s,b)=>hasTag(s,'耐久',4)),
    win('v13_blood_pack','mixed',['scar_spear','crisis_shell','blood_rain','v13_blood_core'],'自傷研究 II','自傷タグを4枚以上採用して勝利',(s,b)=>hasTag(s,'自傷',4)),
    win('v13_cycle_pack','mixed',['return_blade','return_wall','cycle_poison','v13_cycle_core'],'循環研究 II','循環タグを4枚以上採用して勝利',(s,b)=>hasTag(s,'循環',4)),

    win('v13_forward_pack','mixed',['forward_lance','forward_wall','forward_flurry','v13_forward_core'],'順接応用','順接連結モードで勝利',(s,b)=>s.linkMode==='forward'),
    win('v13_reverse_pack','mixed',['reverse_edge','reverse_guard','v13_reverse_core'],'逆接応用','逆接連結モードで勝利',(s,b)=>s.linkMode==='reverse'),
    win('v13_bridge_pack','mixed',['bridge_burst','v13_bridge_core','v13_style_link','v13_convert_link'],'異種架橋応用','異種架橋モードで連結コンボを2回以上成立させて勝利',(s,b)=>s.linkMode==='bridge'&&(b.linkComboCount||0)>=2),

    win('v13_p_discard','protocol',['v13_discard_link'],'残滓連結規格','捨て札タグと連結タグを各2枚以上採用して勝利',(s,b)=>hasTag(s,'捨て札',2)&&hasTag(s,'連結',2)),
    win('v13_p_multi','protocol',['v13_multi_link'],'多段連結規格','連撃タグと連結タグを各2枚以上採用して勝利',(s,b)=>hasTag(s,'連撃',2)&&hasTag(s,'連結',2)),
    win('v13_p_status','protocol',['v13_status_link'],'症状連結規格','状態異常タグと連結タグを各2枚以上採用して勝利',(s,b)=>hasTag(s,'状態異常',2)&&hasTag(s,'連結',2)),
    win('v13_p_guard','protocol',['v13_guard_link'],'防衛連結規格','耐久タグと連結タグを各2枚以上採用して勝利',(s,b)=>hasTag(s,'耐久',2)&&hasTag(s,'連結',2)),
    win('v13_p_blood','protocol',['v13_blood_link'],'血契連結規格','自傷タグと連結タグを各2枚以上採用して勝利',(s,b)=>hasTag(s,'自傷',2)&&hasTag(s,'連結',2)),
    win('v13_p_cycle','protocol',['v13_cycle_link'],'循環連結規格','循環タグと連結タグを各2枚以上採用して勝利',(s,b)=>hasTag(s,'循環',2)&&hasTag(s,'連結',2))
  );
})();
