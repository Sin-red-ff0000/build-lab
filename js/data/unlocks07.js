'use strict';
(function(){
  const BL=window.BuildLab; const D=BL.Data;
  const claimed=id=>s=>!!(s.claimedUnlocks&&s.claimedUnlocks[id]);
  const trait=id=>s=>!!s.unlockedTraits[id];
  const win=(id,kind,reward,title,condition,when,chapter=2)=>({id,kind,reward,title,condition,event:'win',when,check:claimed(id),chapter});
  const hasTag=(s,tag,n)=>s.deck.filter(id=>D.CARDS[id]?.tags.includes(tag)).length>=n;
  const linkReady=s=>!!(s.cardLink?.a&&s.cardLink?.b&&s.cardLink.a!==s.cardLink.b);

  D.UNLOCKS.push(
    {id:'v07_t_hyperregen',kind:'trait',reward:['hyperregen'],title:'特殊個体：過再生',condition:'第1ボス撃破後、敵の再生力を8以上に設定して実験開始',check:trait('hyperregen'),chapter:2},
    {id:'v07_t_nullfield',kind:'trait',reward:['nullfield'],title:'特殊個体：零域',condition:'第1ボス撃破後、敵の状態異常耐性を70%以上に設定して実験開始',check:trait('nullfield'),chapter:2},
    {id:'v07_t_convergence',kind:'trait',reward:['convergence'],title:'特殊個体：収束',condition:'第1ボス撃破後、再生力6以上＋状態異常耐性60%以上に設定して実験開始',check:trait('convergence'),chapter:2},

    win('v07_hyperregen_kill','mixed',['regen_sever','cautery_wall','regen_clamp'],'過再生個体の初撃破','過再生個体を撃破',(s,b)=>b.enemy.traits.includes('hyperregen'),2),
    win('v07_nullfield_kill','mixed',['sterile_breaker','purity_rain','null_lens'],'零域個体の初撃破','零域個体を撃破',(s,b)=>b.enemy.traits.includes('nullfield'),2),
    win('v07_convergence_kill','mixed',['adaptive_guard','adaptive_edge','convergence_core'],'収束個体の初撃破','収束個体を撃破',(s,b)=>b.enemy.traits.includes('convergence'),2),

    {id:'boss2',kind:'boss',reward:[],title:'第2ボス「適応体」',condition:'再生個体・浄化個体を撃破し、「位置実験 II」「調律実験 II」を達成',check:s=>BL.Unlock.boss2Available(s),chapter:2},
    win('boss2_clear','system',['card_link','card_conversion','link_strike','link_guard','link_barrage','link_poison','link_core','relay_buffer','link_amplifier'],'カード連結システム','第2ボス「適応体」を撃破',(s,b)=>b.bossId==='boss2',3),

    win('v07_link_first','mixed',['relay_blade','relay_wall','pair_memory','relay'],'第3章：最初の連結','カードを2種類連結した状態で勝利',(s,b)=>BL.Unlock.hasSystem(s,'card_link')&&linkReady(s),3),
    win('v07_link_four','mixed',['relay_burn','relay_flurry','linked_bastion','relay_prism','link_guardian'],'第3章：連結ビルド I','連結タグを4枚以上採用し、カード連結を設定して勝利',(s,b)=>linkReady(s)&&hasTag(s,'連結',4),3),
    win('v07_link_six','mixed',['linked_blood','linked_residue','linked_cycle','twin_guard','adaptive_routing'],'第3章：連結ビルド II','連結タグを6枚以上採用し、カード連結を設定して勝利',(s,b)=>linkReady(s)&&hasTag(s,'連結',6),3),
    win('v07_link_tuned','mixed',['tuned_link','linked_tuner','tuned_relay'],'第3章：調律連結','連結した2種類のカードを両方調律した状態で勝利',(s,b)=>linkReady(s)&&!!s.cardTunings?.[s.cardLink.a]&&!!s.cardTunings?.[s.cardLink.b],3),
    win('v07_link_reserve','mixed',['reserve_link','chain_reserve'],'第3章：保留連結','連結タグ3枚＋提示操作タグ3枚以上のデッキで勝利',(s,b)=>linkReady(s)&&hasTag(s,'連結',3)&&hasTag(s,'提示操作',3),3),
    win('v07_link_status','mixed',['link_detonator','twin_needle'],'第3章：症状連結','連結タグ3枚＋状態異常タグ3枚以上のデッキで勝利',(s,b)=>linkReady(s)&&hasTag(s,'連結',3)&&hasTag(s,'状態異常',3),3),
    win('v07_link_guard','mixed',['link_recovery','adaptive_router'],'第3章：防護連結','連結タグ3枚＋耐久タグ4枚以上のデッキで勝利',(s,b)=>linkReady(s)&&hasTag(s,'連結',3)&&hasTag(s,'耐久',4),3)
  );
})();
