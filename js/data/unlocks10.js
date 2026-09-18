'use strict';
(function(){
  const BL=window.BuildLab; const D=BL.Data;
  const claimed=id=>s=>!!s.claimedUnlocks?.[id];
  const trait=id=>s=>!!s.unlockedTraits?.[id];
  const win=(id,kind,reward,title,condition,when,chapter=4)=>({id,kind,reward,title,condition,event:'win',when,check:claimed(id),chapter});
  const hasTag=(s,tag,n)=>s.deck.filter(id=>(D.getCardTags?D.getCardTags(s,id):D.CARDS[id]?.tags||[]).includes(tag)).length>=n;
  const uniqueCount=s=>new Set(s.deck).size;
  const styleSelected=(s,id)=>s.characterStyles?.[s.character]===id;
  const styleUnlockedCount=s=>Object.values(s.unlockedCharacterStyles||{}).filter(Boolean).length;
  const system=s=>!!s.unlockedSystems?.character_style;
  const linked=s=>!!(s.cardLink?.a&&s.cardLink?.b&&s.cardLink.a!==s.cardLink.b);
  const doctrine=s=>!!s.doctrine;

  D.UNLOCKS.push(
    {id:'v10_t_crusher',kind:'trait',reward:['crusher'],title:'特殊個体：破砕',condition:'攻撃倍率×9以上＋防御倍率×6以上に設定して実験開始',check:trait('crusher'),chapter:2},
    {id:'v10_t_bloodrush',kind:'trait',reward:['bloodrush'],title:'特殊個体：疾血',condition:'攻撃倍率×7以上＋速度倍率×3以上に設定して実験開始',check:trait('bloodrush'),chapter:2},
    {id:'v10_t_regencarapace',kind:'trait',reward:['regencarapace'],title:'特殊個体：再生装甲',condition:'第1ボス撃破後、HP×7・防御×7・再生力5以上に設定して実験開始',check:trait('regencarapace'),chapter:3},
    {id:'v10_t_mirrorfang',kind:'trait',reward:['mirrorfang'],title:'特殊個体：鏡牙',condition:'第1ボス撃破後、攻撃×6・速度×2.5・状態異常耐性60%以上に設定して実験開始',check:trait('mirrorfang'),chapter:3},

    win('v10_style_standard_focus','style',['standard_focus','focal_lance','focal_core'],'センター：焦点型','キャラクタースタイル解放後、センターで提示操作タグ4枚以上を採用して勝利',(s,b)=>system(s)&&s.character==='standard'&&hasTag(s,'提示操作',4),2),
    win('v10_style_standard_wings','style',['standard_wings','wing_parry','wing_brand','wing_compass'],'センター：翼展型','焦点型を解放し、センターで提示操作タグ6枚以上を採用して勝利',(s,b)=>!!s.unlockedCharacterStyles?.standard_focus&&s.character==='standard'&&hasTag(s,'提示操作',6),2),
    win('v10_style_combo_catalytic','style',['combo_catalytic','catalytic_rain','pulse_guard','catalytic_mesh'],'パルス：触媒型','パルスで連撃5枚＋状態異常3枚以上を採用して勝利',(s,b)=>system(s)&&s.character==='combo'&&hasTag(s,'連撃',5)&&hasTag(s,'状態異常',3),2),
    win('v10_style_combo_precision','style',['combo_precision','precise_barrage','symptom_ripper','precision_barrel'],'パルス：精密型','触媒型を解放し、パルスで連撃7枚以上を採用して勝利',(s,b)=>!!s.unlockedCharacterStyles?.combo_catalytic&&s.character==='combo'&&hasTag(s,'連撃',7),2),
    win('v10_style_tank_forge','style',['tank_forge','forge_guard','forge_memory'],'フォート：自動鍛造型','フォートで耐久5枚以上を採用し、5ターン以上の戦闘に勝利',(s,b)=>system(s)&&s.character==='tank'&&hasTag(s,'耐久',5)&&b.turn>=5,2),
    win('v10_style_tank_tempered','style',['tank_tempered','tempered_edge'],'フォート：焼入型','自動鍛造型を解放し、フォートで耐久7枚以上を採用して勝利',(s,b)=>!!s.unlockedCharacterStyles?.tank_forge&&s.character==='tank'&&hasTag(s,'耐久',7),2),

    win('v10_style_vector_flux','style',['vector_flux','center_salvage','flux_gyro'],'ベクトル：流動型','ベクトルで提示操作タグ5枚以上を採用して勝利',(s,b)=>system(s)&&s.character==='vector'&&hasTag(s,'提示操作',5),3),
    win('v10_style_archive_salvage','style',['archive_salvage','archive_wall','salvage_strike','salvage_binder'],'アーカイブ：回収型','アーカイブで捨て札タグ5枚以上を採用して勝利',(s,b)=>system(s)&&s.character==='archive'&&hasTag(s,'捨て札',5),3),
    win('v10_style_relay_direction','style',['relay_direction','relay_spear','relay_shield','relay_diode'],'リレー：順送型','リレーでカード連結を設定し、連結タグ4枚以上を採用して勝利',(s,b)=>system(s)&&s.character==='relay'&&linked(s)&&hasTag(s,'連結',4),4),
    win('v10_style_risk_crisis','style',['risk_crisis','crisis_edge','crisis_guard','crisis_prism'],'リスク：臨界型','リスクで自傷5枚以上を採用し、HP半分以下で勝利',(s,b)=>system(s)&&s.character==='risk'&&hasTag(s,'自傷',5)&&b.player.hp<=b.player.maxHp/2,3),
    win('v10_style_loop_rebirth','style',['loop_rebirth','rebirth_edge','rebirth_guard','rebirth_spindle'],'ループ：再起型','ループで循環5枚以上を採用し、山札を2回以上再構築して勝利',(s,b)=>system(s)&&s.character==='loop'&&hasTag(s,'循環',5)&&b.reshuffles>=2,3),
    win('v10_style_catalyst_spectrum','style',['catalyst_spectrum','spectrum_blast','spectrum_guard','spectrum_veil','spectrum_cell'],'カタリスト：多相型','カタリストで状態異常6枚以上を採用して勝利',(s,b)=>system(s)&&s.character==='catalyst'&&hasTag(s,'状態異常',6),3),
    win('v10_style_architect_specialist','style',['architect_specialist','singular_focus','hybrid_guardian'],'アーキテクト：専門設計型','アーキテクトで構築規格を装備し、1タグカード7枚以上で勝利',(s,b)=>system(s)&&s.character==='architect'&&doctrine(s)&&s.deck.filter(id=>(D.CARDS[id]?.tags.length||0)===1).length>=7,4),
    win('v10_style_echo_singleton','style',['echo_singleton','duplicate_focus','singleton_mirror'],'エコー：孤響型','エコーで同名1枚だけのカードを8種類以上含めて勝利',(s,b)=>system(s)&&s.character==='echo'&&uniqueCount(s)>=8,4),

    win('v10_residue_link','card',['residue_link'],'残滓と連結の架橋','捨て札タグ4枚＋連結タグ3枚以上で勝利',(s,b)=>s.boss2Defeated&&hasTag(s,'捨て札',4)&&hasTag(s,'連結',3),4),
    win('v10_protocol_style','protocol',['style_resonance'],'スタイル共鳴規格','キャラクタースタイルを3種類以上解放して勝利',(s,b)=>styleUnlockedCount(s)>=3,3),
    win('v10_protocol_focus','protocol',['focus_calibration'],'焦点校正规格','焦点型または翼展型で勝利',(s,b)=>styleSelected(s,'standard_focus')||styleSelected(s,'standard_wings'),3),
    win('v10_protocol_forge','protocol',['forge_calibration'],'鍛造校正规格','自動鍛造型または焼入型で勝利',(s,b)=>styleSelected(s,'tank_forge')||styleSelected(s,'tank_tempered'),3),
    win('v10_protocol_salvage','protocol',['salvage_calibration'],'残滓校正规格','回収型で勝利',(s,b)=>styleSelected(s,'archive_salvage'),3),
    win('v10_protocol_flux','protocol',['flux_calibration'],'流動校正规格','流動型で勝利',(s,b)=>styleSelected(s,'vector_flux'),3),
    win('v10_protocol_spectrum','protocol',['spectrum_calibration'],'多相校正规格','多相型で勝利',(s,b)=>styleSelected(s,'catalyst_spectrum'),3),

    win('v10_crusher_kill','mixed',['focal_lance','relay_spear'],'破砕個体の初撃破','破砕個体を撃破',(s,b)=>b.enemy.traits.includes('crusher'),2),
    win('v10_bloodrush_kill','mixed',['precise_barrage','crisis_edge'],'疾血個体の初撃破','疾血個体を撃破',(s,b)=>b.enemy.traits.includes('bloodrush'),2),
    win('v10_regencarapace_kill','mixed',['forge_guard','rebirth_guard'],'再生装甲個体の初撃破','再生装甲個体を撃破',(s,b)=>b.enemy.traits.includes('regencarapace'),3),
    win('v10_mirrorfang_kill','mixed',['spectrum_blast','hybrid_guardian'],'鏡牙個体の初撃破','鏡牙個体を撃破',(s,b)=>b.enemy.traits.includes('mirrorfang'),3)
  );
})();
