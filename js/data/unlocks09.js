'use strict';
(function(){
  const BL=window.BuildLab; const D=BL.Data;
  const claimed=id=>s=>!!s.claimedUnlocks?.[id];
  const trait=id=>s=>!!s.unlockedTraits?.[id];
  const win=(id,kind,reward,title,condition,when,chapter=3)=>({id,kind,reward,title,condition,event:'win',when,check:claimed(id),chapter});
  const hasTag=(s,tag,n)=>s.deck.filter(id=>D.CARDS[id]?.tags.includes(tag)).length>=n;
  const linked=s=>!!(s.cardLink?.a&&s.cardLink?.b&&s.cardLink.a!==s.cardLink.b);
  const doctrine=s=>s.doctrine&&s.unlockedDoctrines?.[s.doctrine];
  const uniqueCount=s=>new Set(s.deck).size;
  const distinctTags=s=>new Set(s.deck.flatMap(id=>D.CARDS[id]?.tags||[])).size;

  D.UNLOCKS.push(
    // 第3章：既存要素の追加拡充と第3ボスへの導線
    {id:'v09_t_bloomwall',kind:'trait',reward:['bloomwall'],title:'特殊個体：繁壁',condition:'第1ボス撃破後、防御倍率×8以上＋再生力6以上に設定して実験開始',check:trait('bloomwall'),chapter:3},
    {id:'v09_t_nullgiant',kind:'trait',reward:['nullgiant'],title:'特殊個体：零巨',condition:'第1ボス撃破後、HP倍率×8以上＋状態異常耐性70%以上に設定して実験開始',check:trait('nullgiant'),chapter:3},
    {id:'v09_t_rushbloom',kind:'trait',reward:['rushbloom'],title:'特殊個体：奔芽',condition:'第1ボス撃破後、速度倍率×3以上＋再生力6以上に設定して実験開始',check:trait('rushbloom'),chapter:3},
    {id:'v09_t_apex',kind:'trait',reward:['apex'],title:'特殊個体：極相',condition:'第1ボス撃破後、HP×8・攻撃×7・防御×7・速度×2.5・再生6・耐性60%以上に設定して実験開始',check:trait('apex'),chapter:3},

    win('v09_bloomwall_kill','mixed',['charter_recall','compact_cycle'],'繁壁個体の初撃破','繁壁個体を撃破',(s,b)=>b.enemy.traits.includes('bloomwall'),3),
    win('v09_nullgiant_kill','mixed',['charter_bloodwall','expanded_status'],'零巨個体の初撃破','零巨個体を撃破',(s,b)=>b.enemy.traits.includes('nullgiant'),3),
    win('v09_rushbloom_kill','mixed',['charter_chain','expanded_multi'],'奔芽個体の初撃破','奔芽個体を撃破',(s,b)=>b.enemy.traits.includes('rushbloom'),3),
    win('v09_apex_kill','mixed',['charter_reserve','architect_compass'],'極相個体の初撃破','極相個体を撃破',(s,b)=>b.enemy.traits.includes('apex'),3),

    win('v09_link_tuning_mix','mixed',['doctrine_edge','doctrine_guard','doctrine_barrage','doctrine_poison'],'連結・調律複合実験','カード連結を設定し、調律済みカード2種類で勝利',(s,b)=>s.boss2Defeated&&linked(s)&&Object.keys(s.cardTunings||{}).length>=2,3),
    win('v09_six_axis_mix','mixed',['residue_charter','scar_charter','cycle_charter','counter_charter','prompt_charter','link_charter','tuned_charter','hybrid_charter'],'六軸架橋実験','異なるタグを8種類以上含むデッキで勝利',(s,b)=>s.boss2Defeated&&distinctTags(s)>=8,3),

    {id:'boss3',kind:'boss',reward:[],title:'第3ボス「構築体」',condition:'第2ボス撃破後、「連結ビルド II」「調律連結」「連結循環実験」を達成し、極相個体を撃破',check:s=>BL.Unlock.boss3Available(s),chapter:3},
    win('boss3_clear','system',['deck_doctrine','compact','expanded','singleton','compact_edge','compact_guard','expanded_edge','expanded_guard','singleton_edge','singleton_guard','doctrine_core'],'構築規格システム','第3ボス「構築体」を撃破',(s,b)=>b.bossId==='boss3',4),

    // 第4章：構築規格
    win('v09_doctrine_compact','mixed',['compact_barrage','compact_venom','compact_frame','compact_drive','compact_residue'],'圧縮規格実験','圧縮規格を装備し、8枚デッキで勝利',(s,b)=>s.doctrine==='compact'&&s.deck.length===8,4),
    win('v09_doctrine_expanded','mixed',['expanded_barrage','expanded_burn','expanded_bus','expanded_drive'],'展開規格実験','展開規格を装備し、12枚デッキで勝利',(s,b)=>s.doctrine==='expanded'&&s.deck.length===12,4),
    win('v09_doctrine_singleton','mixed',['singleton_barrage','singleton_toxin','singleton_badge','singleton_drive'],'単独規格実験','単独規格を装備し、10種類すべて異なるカードで勝利',(s,b)=>s.doctrine==='singleton'&&uniqueCount(s)===10,4),

    win('v09_doctrine_duplicate_unlock','doctrine',['duplicate'],'複製規格','同名カードを2枚ずつ4組以上採用したデッキで勝利',(s,b)=>s.boss3Defeated&&[...new Set(s.deck)].filter(id=>s.deck.filter(x=>x===id).length>=2).length>=4,4),
    win('v09_doctrine_hybrid_unlock','doctrine',['hybrid'],'混成規格','2タグ以上のカードを8枚以上採用して勝利',(s,b)=>s.boss3Defeated&&s.deck.filter(id=>(D.CARDS[id]?.tags.length||0)>=2).length>=8,4),
    win('v09_doctrine_spectrum_unlock','doctrine',['spectrum'],'多様規格','デッキ内に異なるタグを8種類以上含めて勝利',(s,b)=>s.boss3Defeated&&distinctTags(s)>=8,4),

    win('v09_duplicate_doctrine','mixed',['duplicate_edge','duplicate_guard','duplicate_barrage','duplicate_ember','duplicate_stamp','duplicate_drive'],'複製規格実験','複製規格を装備し、同名3枚のカードを1種類以上含めて勝利',(s,b)=>s.doctrine==='duplicate'&&[...new Set(s.deck)].some(id=>s.deck.filter(x=>x===id).length>=3),4),
    win('v09_hybrid_doctrine','mixed',['hybrid_charter','spectrum_bridge','doctrine_bridge'],'混成規格実験','混成規格を装備し、2タグ以上のカードを8枚以上採用して勝利',(s,b)=>s.doctrine==='hybrid'&&s.deck.filter(id=>(D.CARDS[id]?.tags.length||0)>=2).length>=8,4),
    win('v09_spectrum_doctrine','mixed',['spectrum_edge','spectrum_guard','spectrum_barrage','spectrum_status','spectrum_prism','spectrum_drive'],'多様規格実験','多様規格を装備し、デッキ内タグ8種類以上で勝利',(s,b)=>s.doctrine==='spectrum'&&distinctTags(s)>=8,4),

    win('v09_doctrine_character_architect','character',['architect'],'キャラクター：アーキテクト','いずれかの構築規格を装備し、2タグ以上のカードを7枚以上採用して勝利',(s,b)=>!!doctrine(s)&&s.deck.filter(id=>(D.CARDS[id]?.tags.length||0)>=2).length>=7,4),
    win('v09_doctrine_character_echo','character',['echo'],'キャラクター：エコー','複製規格を装備し、同名カード3枚を含むデッキで勝利',(s,b)=>s.doctrine==='duplicate'&&[...new Set(s.deck)].some(id=>s.deck.filter(x=>x===id).length>=3),4),

    win('v09_doctrine_tuning','mixed',['doctrine_tune','doctrine_tuning'],'規格調律','構築規格を装備し、調律済みカード2種類で勝利',(s,b)=>!!doctrine(s)&&Object.keys(s.cardTunings||{}).length>=2,4),
    win('v09_single_tuning','mixed',['singular_tune','singleton_counter'],'単独調律','同名1枚だけのカードを8種類以上含むデッキで勝利',(s,b)=>s.boss3Defeated&&uniqueCount(s)>=8,4),
    win('v09_duplicate_tuning','mixed',['duplicate_tune','duplicate_discard'],'複製調律','同名2枚以上のカードを3種類以上含むデッキで勝利',(s,b)=>s.boss3Defeated&&[...new Set(s.deck)].filter(id=>s.deck.filter(x=>x===id).length>=2).length>=3,4),

    win('v09_doctrine_guard','relic',['doctrine_guard'],'規格防護実験','構築規格装備中、耐久タグ5枚以上で勝利',(s,b)=>!!doctrine(s)&&hasTag(s,'耐久',5),4),
    win('v09_doctrine_status','relic',['doctrine_status'],'規格症状実験','構築規格装備中、状態異常タグ5枚以上で勝利',(s,b)=>!!doctrine(s)&&hasTag(s,'状態異常',5),4),
    win('v09_doctrine_link','relic',['doctrine_link'],'規格連結実験','構築規格装備中、カード連結を設定して勝利',(s,b)=>!!doctrine(s)&&linked(s),4),
    win('v09_doctrine_protocols','mixed',['singleton_drive','duplicate_drive','spectrum_drive'],'構築駆動群','構築規格を3種類以上解放して勝利',(s,b)=>Object.keys(s.unlockedDoctrines||{}).filter(id=>s.unlockedDoctrines[id]).length>=3,4)
  );
})();
