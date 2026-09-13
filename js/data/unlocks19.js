'use strict';
(function(){
  const BL=window.BuildLab,D=BL.Data;
  const claimed=id=>s=>!!s.claimedUnlocks?.[id];
  const win=(id,kind,reward,title,condition,when)=>({id,kind,reward,title,condition,event:'win',when,check:claimed(id),chapter:4});
  const tags=(s,id)=>D.getCardTags?D.getCardTags(s,id):(D.CARDS[id]?.tags||[]);
  const tagCount=(s,tag)=>s.deck.filter(id=>tags(s,id).includes(tag)).length;
  const distinctTags=s=>new Set(s.deck.flatMap(id=>tags(s,id))).size;
  const duplicateGroups=s=>Object.values(s.deck.reduce((m,id)=>(m[id]=(m[id]||0)+1,m),{})).filter(n=>n>=2).length;
  const tripleTagCards=s=>s.deck.filter(id=>tags(s,id).length>=3).length;
  const tunedConvertedSame=s=>Object.keys(s.cardTunings||{}).some(id=>!!s.cardConversions?.[id]);

  // 新特殊個体の発見条件は最初からアンロック一覧で確認できる。
  for(const id of D.V19_TRAIT_IDS||[]){
    const cfg=D.V19_TRAIT_CONDITIONS?.[id],t=D.TRAITS[id];
    D.UNLOCKS.push({id:`v19_discover_${id}`,kind:'trait',reward:[id],title:`特殊個体：${t.name.replace(/個体$/,'')}`,condition:`${cfg?.advanced?'第1ボス撃破後、':''}${cfg?.label||'指定ステータス条件'}に設定して実験開始`,check:s=>!!s.unlockedTraits?.[id],chapter:4});
  }

  D.UNLOCKS.push(
    // 新キャラクター8体
    win('v19_char_node','mixed',['node','v19_tuning_prism','v19_conversion_lens','v19_p_tuning'],'ノード起動','カード調律2種類＋役割変換2種類を設定して勝利',(s,b)=>Object.keys(s.cardTunings||{}).length>=2&&Object.keys(s.cardConversions||{}).length>=2),
    win('v19_char_synth','mixed',['synth','v19_hybrid_core2','v19_triad_core','v19_p_hybrid'],'シンセ起動','デッキ内の異なるタグを8種類以上にして勝利',(s,b)=>distinctTags(s)>=8),
    win('v19_char_tracer','mixed',['tracer','v19_trait_scope','v19_behavior_scope2','v19_p_traits'],'トレーサー起動','特殊個体特性を4種類以上同時適用した敵に勝利',(s,b)=>(b?.enemy?.traits||[]).filter(id=>D.TRAITS[id]).length>=4),
    win('v19_char_rhythm','mixed',['rhythm','v19_center_crystal','v19_shift_gyro','v19_p_shift'],'リズム起動','提示操作タグを5枚以上採用して勝利',(s,b)=>tagCount(s,'提示操作')>=5),
    win('v19_char_gearbox','mixed',['gearbox','v19_link_coil','v19_rebirth_gear','v19_p_link'],'ギア起動','カード連結を設定し、循環タグを4枚以上採用して勝利',(s,b)=>!!(s.cardLink?.a&&s.cardLink?.b)&&tagCount(s,'循環')>=4),
    win('v19_char_bulwark','mixed',['bulwark','v19_guard_core2','v19_counter_core2','v19_p_guard'],'バルワーク起動','耐久7枚以上・反撃3枚以上を採用して勝利',(s,b)=>tagCount(s,'耐久')>=7&&tagCount(s,'反撃')>=3),
    win('v19_char_palette','mixed',['palette','v19_status_core2','v19_poison_lens','v19_p_status'],'パレット起動','状態異常タグを7枚以上採用して勝利',(s,b)=>tagCount(s,'状態異常')>=7),
    win('v19_char_mirror','mixed',['mirror','v19_repeat_mirror','v19_variation_mirror','v19_p_repeat'],'ミラー起動','同名カードを2枚採用した組を3組以上作って勝利',(s,b)=>duplicateGroups(s)>=3),

    // 新キャラのスタイル3種ずつ（計24）
    win('v19_style_node','mixed',['node_tune','node_convert','node_dual','v19_dual_caliper','v19_p_dual'],'ノード・スタイル研究','ノードで調律と役割変換を同じカードへ重ねて勝利',(s,b)=>s.character==='node'&&tunedConvertedSame(s)),
    win('v19_style_synth','mixed',['synth_triad','synth_mono','synth_bridge','v19_mono_core','v19_p_singleton'],'シンセ・スタイル研究','シンセで3タグ以上のカードを3種類以上採用して勝利',(s,b)=>s.character==='synth'&&tripleTagCards(s)>=3),
    win('v19_style_tracer','mixed',['tracer_traits','tracer_behavior','tracer_clean','v19_behavior_array','v19_p_behaviors'],'トレーサー・スタイル研究','トレーサーで複合挙動2種類以上の敵に勝利',(s,b)=>s.character==='tracer'&&(b?.enemy?.behaviors?.length||0)>=2),
    win('v19_style_rhythm','mixed',['rhythm_shift','rhythm_center','rhythm_wings','v19_wing_crystal','v19_p_center'],'リズム・スタイル研究','リズムで提示操作タグを6枚以上採用して勝利',(s,b)=>s.character==='rhythm'&&tagCount(s,'提示操作')>=6),
    win('v19_style_gearbox','mixed',['gearbox_link','gearbox_cycle','gearbox_relay','v19_pair_badge','v19_p_cycle'],'ギア・スタイル研究','ギアでカード連結を設定し、循環タグを5枚以上採用して勝利',(s,b)=>s.character==='gearbox'&&!!(s.cardLink?.a&&s.cardLink?.b)&&tagCount(s,'循環')>=5),
    win('v19_style_bulwark','mixed',['bulwark_counter','bulwark_guard','bulwark_crisis','v19_lowhp_core','v19_p_forge'],'バルワーク・スタイル研究','バルワークで耐久タグ8枚以上を採用して勝利',(s,b)=>s.character==='bulwark'&&tagCount(s,'耐久')>=8),
    win('v19_style_palette','mixed',['palette_poison','palette_burn','palette_spectrum','v19_burn_lens','v19_p_wide'],'パレット・スタイル研究','パレットで状態異常タグ8枚以上を採用して勝利',(s,b)=>s.character==='palette'&&tagCount(s,'状態異常')>=8),
    win('v19_style_mirror','mixed',['mirror_repeat','mirror_variation','mirror_duplicate','v19_duplicate_core','v19_p_duplicate'],'ミラー・スタイル研究','ミラーで同名カードを2枚採用した組を4組以上作って勝利',(s,b)=>s.character==='mirror'&&duplicateGroups(s)>=4),

    // 調律 +12（2種類ずつ）
    win('v19_tune_discard_cycle','mixed',['v19_discard_tune','v19_rebirth_tune','v19_residue_plate'],'残響・再起調律研究','捨て札と循環タグを各4枚以上採用して勝利',(s,b)=>tagCount(s,'捨て札')>=4&&tagCount(s,'循環')>=4),
    win('v19_tune_status_conversion','mixed',['v19_ailment_tune','v19_conversion_tune','v19_conversion_guardian'],'症状・変成調律研究','状態異常タグ5枚以上＋役割変換1種類以上で勝利',(s,b)=>tagCount(s,'状態異常')>=5&&Object.keys(s.cardConversions||{}).length>=1),
    win('v19_tune_enemy','mixed',['v19_behavior_tune','v19_trait_tune','v19_trait_linker'],'異相・個体調律研究','特殊個体3種類以上かつ複合挙動1種類以上の敵に勝利',(s,b)=>(b?.enemy?.traits||[]).filter(id=>D.TRAITS[id]).length>=3&&(b?.enemy?.behaviors?.length||0)>=1),
    win('v19_tune_structure','mixed',['v19_hybrid_tune','v19_mono_tune','v19_style_doctrine'],'混成・単相調律研究','異なるタグ8種類以上のデッキで勝利',(s,b)=>distinctTags(s)>=8),
    win('v19_tune_prompt','mixed',['v19_wide_tune','v19_narrow_tune','v19_wide_scanner'],'広域・狭域調律研究','提示操作システム解放後、提示タグ5枚以上で勝利',(s,b)=>BL.Unlock.hasSystem(s,'prompt_control')&&tagCount(s,'提示')+tagCount(s,'提示操作')>=5),
    win('v19_tune_forge_shift','mixed',['v19_forge_tune','v19_shift_tune','v19_forge_memory2'],'鍛造・転位調律研究','派生スタイルを使用し、調律2種類を設定して勝利',(s,b)=>!!D.getCharacterStyle?.(s,s.character)&&Object.keys(s.cardTunings||{}).length>=2),

    // 新特殊個体の攻略報酬（残りの遺物10・プロトコル4を配布）
    win('v19_trait_ironheart','mixed',['v19_style_emblem','v19_p_style'],'鉄心個体攻略','鉄心個体を撃破',(s,b)=>!!s.defeatedTraits?.v19_ironheart),
    win('v19_trait_ravager','mixed',['v19_multihit_core2','v19_p_multi'],'猛攻個体攻略','猛攻個体を撃破',(s,b)=>!!s.defeatedTraits?.v19_ravager),
    win('v19_trait_afterimage','mixed',['v19_singleton_core','v19_p_conversion'],'残像個体攻略','残像個体を撃破',(s,b)=>!!s.defeatedTraits?.v19_afterimage),
    win('v19_trait_mutant','mixed',['v19_narrow_scanner','v19_p_discard'],'変異個体攻略','変異個体を撃破',(s,b)=>!!s.defeatedTraits?.v19_mutant),
    win('v19_trait_biofortress','relic',['v19_reserve_cell'],'生体要塞個体攻略','生体要塞個体を撃破',(s,b)=>!!s.defeatedTraits?.v19_biofortress),
    win('v19_trait_vengeful','relic',['v19_doctrine_emblem'],'報復個体攻略','報復個体を撃破',(s,b)=>!!s.defeatedTraits?.v19_vengeful),
    win('v19_trait_phantom','relic',['v19_behavior_tuner'],'幽影個体攻略','幽影個体を撃破',(s,b)=>!!s.defeatedTraits?.v19_phantom),
    win('v19_trait_plague','relic',['v19_cycle_linker'],'疫走個体攻略','疫走個体を撃破',(s,b)=>!!s.defeatedTraits?.v19_plague),
    win('v19_trait_absolute','relic',['v19_discard_tuner'],'絶対個体攻略','絶対個体を撃破',(s,b)=>!!s.defeatedTraits?.v19_absolute),
    win('v19_trait_hyperclean','relic',['v19_extreme_lens'],'超浄化個体攻略','超浄化個体を撃破',(s,b)=>!!s.defeatedTraits?.v19_hyperclean)
  );
})();
