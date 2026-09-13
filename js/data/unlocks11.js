'use strict';
(function(){
  const BL=window.BuildLab; const D=BL.Data;
  const claimed=id=>s=>!!s.claimedUnlocks?.[id];
  const trait=id=>s=>!!s.unlockedTraits?.[id];
  const win=(id,kind,reward,title,condition,when,chapter=4)=>({id,kind,reward,title,condition,event:'win',when,check:claimed(id),chapter});
  const hasTag=(s,tag,n)=>s.deck.filter(id=>(D.getCardTags?D.getCardTags(s,id):D.CARDS[id]?.tags||[]).includes(tag)).length>=n;
  const convertedCount=s=>Object.keys(s.cardConversions||{}).length;
  const convertedWith=(s,id)=>Object.values(s.cardConversions||{}).includes(id);
  const system=s=>!!s.unlockedSystems?.card_conversion;

  D.UNLOCKS.push(
    {id:'v11_t_glassrush',kind:'trait',reward:['glassrush'],title:'特殊個体：硝走',condition:'攻撃倍率×7以上＋速度倍率×3.5以上＋防御倍率×2以下に設定して実験開始',check:trait('glassrush'),chapter:3},
    {id:'v11_t_rotwall',kind:'trait',reward:['rotwall'],title:'特殊個体：腐壁',condition:'第1ボス撃破後、防御倍率×8以上＋再生力5以上＋状態異常耐性30%以下で実験開始',check:trait('rotwall'),chapter:3},
    {id:'v11_t_bloodshell',kind:'trait',reward:['bloodshell'],title:'特殊個体：血殻',condition:'HP倍率×9以上＋攻撃倍率×7以上で実験開始',check:trait('bloodshell'),chapter:3},
    {id:'v11_t_fluxbeast',kind:'trait',reward:['fluxbeast'],title:'特殊個体：流転',condition:'第1ボス撃破後、速度倍率×3以上＋再生力5以上＋状態異常耐性50%以上で実験開始',check:trait('fluxbeast'),chapter:4},

    win('v11_conversion_counter','conversion',['counter_role','scar_counter','counter_hinge'],'反撃変換','カード役割変換解放後、耐久5枚＋反撃3枚以上で勝利',(s,b)=>system(s)&&hasTag(s,'耐久',5)&&hasTag(s,'反撃',3),4),
    win('v11_conversion_detonate','conversion',['detonate_role','conversion_brand','detonation_chamber'],'起爆変換','カード役割変換解放後、状態異常6枚以上で勝利',(s,b)=>system(s)&&hasTag(s,'状態異常',6),4),
    win('v11_conversion_blood','conversion',['blood_role','conversion_crisis','blood_seal'],'血契変換','カード役割変換解放後、自傷5枚以上を採用しHP半分以下で勝利',(s,b)=>system(s)&&hasTag(s,'自傷',5)&&b.player.hp<=b.player.maxHp/2,4),
    win('v11_conversion_cycle','conversion',['cycle_role','cycle_barrage_plus','cycle_ribbon'],'循環変換','カード役割変換解放後、循環5枚以上を採用し山札を2回以上再構築して勝利',(s,b)=>system(s)&&hasTag(s,'循環',5)&&b.reshuffles>=2,4),

    win('v11_conversion_first','mixed',['split_probe','split_guard','conversion_core'],'最初の役割変換','カード役割変換を1種類以上設定して勝利',(s,b)=>system(s)&&convertedCount(s)>=1,4),
    win('v11_conversion_two','mixed',['conversion_barrage','conversion_wall','conversion_overdrive'],'二重変換実験','異なる2種類のカードへ役割変換を設定して勝利',(s,b)=>system(s)&&convertedCount(s)>=2,4),
    win('v11_split_mastery','mixed',['adaptive_conversion','split_chamber','split_matrix'],'分裂変換の習熟','分裂変換を設定し、連撃タグ5枚以上で勝利',(s,b)=>system(s)&&convertedWith(s,'split')&&hasTag(s,'連撃',5),4),
    win('v11_bulwark_mastery','mixed',['style_conversion_guard','bulwark_joint','conversion_guard'],'攻防変換の習熟','攻防変換を設定し、耐久タグ5枚以上で勝利',(s,b)=>system(s)&&convertedWith(s,'bulwark')&&hasTag(s,'耐久',5),4),
    win('v11_residue_mastery','mixed',['conversion_salvage','residue_vat','residue_converter'],'残滓変換の習熟','残滓変換を設定し、捨て札タグ5枚以上で勝利',(s,b)=>system(s)&&convertedWith(s,'residue_role')&&hasTag(s,'捨て札',5),4),

    win('v11_tuned_conversion','mixed',['tuned_conversion_edge','tuned_converter'],'調律×変換','同じカード種類に調律と役割変換を設定して勝利',(s,b)=>system(s)&&Object.keys(s.cardConversions||{}).some(id=>s.cardTunings?.[id]),4),
    win('v11_linked_conversion','mixed',['linked_conversion_edge','linked_converter'],'連結×変換','連結対象のどちらかに役割変換を設定して勝利',(s,b)=>system(s)&&[s.cardLink?.a,s.cardLink?.b].some(id=>id&&s.cardConversions?.[id]),4),
    win('v11_style_conversion','mixed',['style_converter'],'スタイル×変換','派生キャラクタースタイルを選択し、役割変換を設定して勝利',(s,b)=>system(s)&&!!D.getCharacterStyle?.(s,s.character)&&convertedCount(s)>=1,4),
    win('v11_doctrine_conversion','mixed',['doctrine_conversion','doctrine_converter'],'構築規格×変換','構築規格を装備し、役割変換を設定して勝利',(s,b)=>system(s)&&!!s.doctrine&&convertedCount(s)>=1,4),

    win('v11_discard_bridge','card',['residue_hammer','discarded_volley','last_scrap'],'残滓の再設計','捨て札タグ6枚以上で勝利',(s,b)=>hasTag(s,'捨て札',6),3),
    win('v11_cycle_bridge','card',['blood_recycle','loop_counter','mixed_reactor'],'循環の再設計','循環タグ6枚以上で勝利',(s,b)=>hasTag(s,'循環',6),3),
    win('v11_ailment_bridge','card',['ailment_counter','toxin_saw','ember_guard_plus'],'症状の再設計','状態異常タグ7枚以上で勝利',(s,b)=>hasTag(s,'状態異常',7),3),
    win('v11_guard_bridge','card',['guard_burst'],'防壁の再設計','耐久タグ7枚以上＋反撃タグ3枚以上で勝利',(s,b)=>hasTag(s,'耐久',7)&&hasTag(s,'反撃',3),3),

    win('v11_protocol_counter','protocol',['conversion_guard'],'変換防衛規格','反撃変換を設定して勝利',(s,b)=>convertedWith(s,'counter_role'),4),
    win('v11_protocol_blood','protocol',['blood_converter'],'血契変換規格','血契変換を設定して勝利',(s,b)=>convertedWith(s,'blood_role'),4),
    win('v11_protocol_bridge','protocol',['conversion_bridge'],'変換架橋規格','役割変換中かつ2タグ以上のカードを4種類以上採用して勝利',(s,b)=>system(s)&&s.deck.filter(id=>s.cardConversions?.[id]&&(D.getCardTags(s,id).length>=2)).length>=4,4),

    win('v11_glassrush_kill','mixed',['split_probe','split_chamber'],'硝走個体の初撃破','硝走個体を撃破',(s,b)=>b.enemy.traits.includes('glassrush'),3),
    win('v11_rotwall_kill','mixed',['conversion_brand','detonation_chamber'],'腐壁個体の初撃破','腐壁個体を撃破',(s,b)=>b.enemy.traits.includes('rotwall'),3),
    win('v11_bloodshell_kill','mixed',['conversion_crisis','blood_seal'],'血殻個体の初撃破','血殻個体を撃破',(s,b)=>b.enemy.traits.includes('bloodshell'),3),
    win('v11_fluxbeast_kill','mixed',['conversion_barrage','cycle_ribbon'],'流転個体の初撃破','流転個体を撃破',(s,b)=>b.enemy.traits.includes('fluxbeast'),4)
  );
})();
