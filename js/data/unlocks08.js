'use strict';
(function(){
  const BL=window.BuildLab; const D=BL.Data;
  const claimed=id=>s=>!!(s.claimedUnlocks&&s.claimedUnlocks[id]);
  const trait=id=>s=>!!s.unlockedTraits[id];
  const win=(id,kind,reward,title,condition,when,chapter=1)=>({id,kind,reward,title,condition,event:'win',when,check:claimed(id),chapter});
  const hasTag=(s,tag,n)=>s.deck.filter(id=>D.CARDS[id]?.tags.includes(tag)).length>=n;
  const linked=s=>!!(s.cardLink?.a&&s.cardLink?.b&&s.cardLink.a!==s.cardLink.b);
  const tunedCount=s=>Object.keys(s.cardTunings||{}).length;
  const enemyStatusTypes=b=>Object.values(b.enemy?.status||{}).filter(v=>v>0).length;

  D.UNLOCKS.push(
    // 第1章：既存6軸をさらに深くする目標
    win('v08_discard_cycle','mixed',['grave_surge','salvage_wall','memory_cut','residue_memory','spill_engine','residue_cycle'],'残滓循環実験','捨て札タグ4枚＋循環タグ4枚以上のデッキで勝利',(s,b)=>hasTag(s,'捨て札',4)&&hasTag(s,'循環',4),1),
    win('v08_self_cycle','mixed',['crimson_loop','brink_guard','scar_lens','loop_core'],'瘢痕循環実験','自傷タグ4枚＋循環タグ3枚以上のデッキで勝利',(s,b)=>hasTag(s,'自傷',4)&&hasTag(s,'循環',3),1),
    win('v08_self_multi','mixed',['pain_barrage','blood_venom_burst','brink_reactor','critical_maintenance'],'臨界連撃実験','自傷タグ4枚＋連撃タグ4枚以上のデッキで勝利',(s,b)=>hasTag(s,'自傷',4)&&hasTag(s,'連撃',4),1),
    win('v08_cycle_master','mixed',['echo_guard','restart_edge','cycle_barrage','terminal_recall','restart_prism'],'再構築実験 III','循環タグ5枚以上のデッキで、山札を2回以上再構築して勝利',(s,b)=>hasTag(s,'循環',5)&&b.reshuffles>=2,1),
    win('v08_guard_counter','mixed',['armor_pulse','guard_breaker','patient_bloom','retaliate_chain','wall_matrix','counter_battery','guard_counter'],'防反統合実験','耐久タグ5枚＋反撃タグ3枚以上のデッキで勝利',(s,b)=>hasTag(s,'耐久',5)&&hasTag(s,'反撃',3),1),
    win('v08_status_master','mixed',['venom_lattice','cinder_lattice','mixed_feast','ailment_guard','status_matrix','consume_prism','ailment_web'],'複合症状実験','状態異常タグ6枚以上のデッキで勝利',(s,b)=>hasTag(s,'状態異常',6),1),
    win('v08_multihit_master','mixed',['sixfold_cut','combo_accel','drill_guard','chain_shatter','multihit_lens'],'多段実験 III','連撃タグ6枚以上のデッキで勝利',(s,b)=>hasTag(s,'連撃',6),1),
    win('v08_discard_status','mixed',['scatter_mines'],'残滓症状実験','捨て札タグ4枚＋状態異常タグ4枚以上で勝利',(s,b)=>hasTag(s,'捨て札',4)&&hasTag(s,'状態異常',4),1),

    // キャラ：既存軸の専門家
    win('v08_char_risk','character',['risk'],'キャラクター：リスク','自傷タグ5枚以上を採用し、HP半分以下で勝利',(s,b)=>hasTag(s,'自傷',5)&&b.player.hp<=b.player.maxHp/2,1),
    win('v08_char_loop','character',['loop'],'キャラクター：ループ','循環タグ5枚以上を採用し、山札を2回以上再構築して勝利',(s,b)=>hasTag(s,'循環',5)&&b.reshuffles>=2,1),
    win('v08_char_catalyst','character',['catalyst'],'キャラクター：カタリスト','状態異常タグ5枚以上を採用し、敵に2種類以上の状態異常が残った状態で勝利',(s,b)=>hasTag(s,'状態異常',5)&&enemyStatusTypes(b)>=2,1),

    // 第2章：高度敵パラメータから派生する特殊個体
    {id:'v08_t_overgrown',kind:'trait',reward:['overgrown'],title:'特殊個体：繁茂',condition:'第1ボス撃破後、HP倍率×8以上＋再生力5以上に設定して実験開始',check:trait('overgrown'),chapter:2},
    {id:'v08_t_cleanse_rush',kind:'trait',reward:['cleanse_rush'],title:'特殊個体：浄閃',condition:'第1ボス撃破後、速度倍率×2.5以上＋状態異常耐性50%以上に設定して実験開始',check:trait('cleanse_rush'),chapter:2},
    {id:'v08_t_ironroot',kind:'trait',reward:['ironroot'],title:'特殊個体：鉄根',condition:'第1ボス撃破後、防御倍率×6以上＋再生力5以上に設定して実験開始',check:trait('ironroot'),chapter:2},
    {id:'v08_t_purgefang',kind:'trait',reward:['purgefang'],title:'特殊個体：浄牙',condition:'第1ボス撃破後、攻撃倍率×6以上＋状態異常耐性50%以上に設定して実験開始',check:trait('purgefang'),chapter:2},
    {id:'v08_t_redgrowth',kind:'trait',reward:['redgrowth'],title:'特殊個体：血潮',condition:'第1ボス撃破後、攻撃倍率×6以上＋再生力5以上に設定して実験開始',check:trait('redgrowth'),chapter:2},
    {id:'v08_t_allphase',kind:'trait',reward:['allphase'],title:'特殊個体：全相',condition:'第1ボス撃破後、HP×6・攻撃×5・防御×5・速度×2・再生4・耐性40%以上に設定して実験開始',check:trait('allphase'),chapter:2},

    win('v08_overgrown_kill','mixed',['center_recycle','regen_counterwall','regen_guard_lens'],'繁茂個体の初撃破','繁茂個体を撃破',(s,b)=>b.enemy.traits.includes('overgrown'),2),
    win('v08_cleanse_rush_kill','mixed',['right_burn','null_barrage','resist_assault_lens'],'浄閃個体の初撃破','浄閃個体を撃破',(s,b)=>b.enemy.traits.includes('cleanse_rush'),2),
    win('v08_ironroot_kill','mixed',['reserved_counter','sterile_bastion','tuned_counter'],'鉄根個体の初撃破','鉄根個体を撃破',(s,b)=>b.enemy.traits.includes('ironroot'),2),
    win('v08_purgefang_kill','mixed',['tuned_multi','tuned_cycle','tuned_cycle_core'],'浄牙個体の初撃破','浄牙個体を撃破',(s,b)=>b.enemy.traits.includes('purgefang'),2),
    win('v08_redgrowth_kill','mixed',['tuned_blood','tuned_scar'],'血潮個体の初撃破','血潮個体を撃破',(s,b)=>b.enemy.traits.includes('redgrowth'),2),
    win('v08_allphase_kill','mixed',['adaptive_poison','center_archive'],'全相個体の初撃破','全相個体を撃破',(s,b)=>b.enemy.traits.includes('allphase'),2),

    win('v08_prompt_discard','mixed',['left_residue'],'位置残滓実験','提示操作タグ3枚＋捨て札タグ3枚以上のデッキで勝利',(s,b)=>hasTag(s,'提示操作',3)&&hasTag(s,'捨て札',3),2),
    win('v08_tuned_bridge','protocol',['tuned_bridge'],'調律架橋規格','調律済みカード2種類を設定し、2タグ以上のカードを5枚以上採用して勝利',(s,b)=>tunedCount(s)>=2&&s.deck.filter(id=>(D.CARDS[id]?.tags.length||0)>=2).length>=5,2),
    win('v08_rapid_tuning','mixed',['tuned_multi'],'連射調律実験','連射調律を設定したカードを含むデッキで勝利',(s,b)=>Object.values(s.cardTunings||{}).includes('rapid'),2),
    win('v08_guard_tuning','mixed',['tuned_counter'],'防護調律実験','防護調律を設定したカードを含むデッキで勝利',(s,b)=>Object.values(s.cardTunings||{}).includes('guard'),2),
    win('v08_brink_tuning','mixed',['tuned_blood'],'臨界調律実験','臨界調律を設定したカードを含み、HP半分以下で勝利',(s,b)=>Object.values(s.cardTunings||{}).includes('brink')&&b.player.hp<=b.player.maxHp/2,2),

    // 第3章：カード連結と既存軸を橋渡し
    win('v08_link_cycle','mixed',['link_cycle_barrage','link_cycle_core','link_cycle'],'連結循環実験','カード連結を設定し、連結タグ3枚＋循環タグ4枚以上で勝利',(s,b)=>linked(s)&&hasTag(s,'連結',3)&&hasTag(s,'循環',4),3),
    win('v08_link_scar','mixed',['link_scar','link_scar_core'],'連結自傷実験','カード連結を設定し、連結タグ3枚＋自傷タグ4枚以上で勝利',(s,b)=>linked(s)&&hasTag(s,'連結',3)&&hasTag(s,'自傷',4),3),
    win('v08_link_status','mixed',['link_status_guard','link_status_core'],'連結症状実験 II','カード連結を設定し、連結タグ3枚＋状態異常タグ4枚以上で勝利',(s,b)=>linked(s)&&hasTag(s,'連結',3)&&hasTag(s,'状態異常',4),3),
    win('v08_link_discard','mixed',['link_discard_edge','link_discard_core'],'連結残滓実験','カード連結を設定し、連結タグ3枚＋捨て札タグ4枚以上で勝利',(s,b)=>linked(s)&&hasTag(s,'連結',3)&&hasTag(s,'捨て札',4),3),
    win('v08_link_counter','mixed',['link_counterwall'],'連結迎撃実験','カード連結を設定し、連結タグ3枚＋反撃タグ3枚以上で勝利',(s,b)=>linked(s)&&hasTag(s,'連結',3)&&hasTag(s,'反撃',3),3),
    win('v08_link_prompt','mixed',['link_prompt_edge'],'連結観測実験','カード連結を設定し、連結タグ3枚＋提示操作タグ4枚以上で勝利',(s,b)=>linked(s)&&hasTag(s,'連結',3)&&hasTag(s,'提示操作',4),3)
  );
})();
