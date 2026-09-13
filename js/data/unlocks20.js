'use strict';
(function(){
  const BL=window.BuildLab,D=BL.Data;
  const claimed=id=>s=>!!s.claimedUnlocks?.[id];
  const win=(id,kind,reward,title,condition,when,chapter=5)=>({id,kind,reward,title,condition,event:'win',when,check:claimed(id),chapter});
  const tags=(s,id)=>D.getCardTags?D.getCardTags(s,id):(D.CARDS[id]?.tags||[]);
  const tagCount=(s,tag)=>s.deck.filter(id=>tags(s,id).includes(tag)).length;
  const multitag=s=>s.deck.filter(id=>tags(s,id).length>=2).length;
  const runeCount=s=>Object.keys(s.cardRunes||{}).length;
  const behaviorCount=b=>b?.enemy?.behaviors?.length||0;
  const traitCount=b=>(b?.enemy?.traits||[]).filter(id=>D.TRAITS[id]).length;
  const styles={glyph:['glyph_force','glyph_guard','glyph_weave'],oracle:['oracle_upright','oracle_reverse','oracle_turn'],braid:['braid_tuned','braid_cycle','braid_bridge'],remnant:['remnant_residue','remnant_cycle','remnant_blood'],axis:['axis_shift','axis_center','axis_wings'],nexus:['nexus_traits','nexus_behavior','nexus_total']};
  const relics=D.V20_RELIC_IDS||[],protocols=D.V20_PROTOCOL_IDS||[];

  // 新特殊個体の条件は最初から公開。
  for(const id of D.V20_TRAIT_IDS||[]){const cfg=D.V20_TRAIT_CONDITIONS?.[id],t=D.TRAITS[id];D.UNLOCKS.push({id:`v20_discover_${id}`,kind:'trait',reward:[id],title:`特殊個体：${t.name.replace(/個体$/,'')}`,condition:`${cfg?.advanced?'第1ボス撃破後、':''}${cfg?.label||'指定ステータス条件'}に設定して実験開始`,check:s=>!!s.unlockedTraits?.[id],chapter:5});}
  for(const id of D.V20_BEHAVIOR_IDS||[]){const b=D.ENEMY_BEHAVIORS[id];D.UNLOCKS.push({id:`v20_behavior_${id}`,kind:'behavior',reward:[id],title:`複合挙動：${b.name}`,condition:D.behaviorConditionText(id),check:s=>!!s.unlockedBehaviors?.[id],chapter:5});}

  D.UNLOCKS.push(
    win('v20_integration_trial','mixed',['v20_total_core'],'第4ボス前：統合実験','第3ボス撃破後、派生スタイル・構築規格・調律・役割変換・カード連結をすべて有効にした構成で勝利',(s,b)=>s.boss3Defeated&&!!D.getCharacterStyle?.(s,s.character)&&!!s.doctrine&&Object.keys(s.cardTunings||{}).length>=1&&Object.keys(s.cardConversions||{}).length>=1&&!!(s.cardLink?.a&&s.cardLink?.b),5),
    {id:'boss4',kind:'boss',reward:[],title:'第4ボス「統合体」',condition:'第3ボス撃破後、「統合実験」を達成し、極限個体を撃破',check:s=>BL.Unlock.boss4Available(s),chapter:5},
    win('boss4_clear','system',['rune','arcana','rune_force','rune_ward','rune_venom','rune_barrage','rune_echo','rune_rebirth','arcana_magician','arcana_chariot','arcana_strength','arcana_wheel','arcana_justice','arcana_temperance'],'ルーン / アルカナ システム','第4ボス「統合体」を撃破',(s,b)=>b.bossId==='boss4',5),

    // 追加ルーン6種
    win('v20_rune_chain','rune',['rune_chain'],'継鎖のルーン','第4ボス撃破後、ルーン2種類以上を設定しカード連結を成立させて勝利',(s,b)=>s.boss4Defeated&&runeCount(s)>=2&&!!(s.cardLink?.a&&s.cardLink?.b)&&b.linkComboCount>=1),
    win('v20_rune_forge','rune',['rune_forge'],'鍛造のルーン','第4ボス撃破後、フォートまたは鍛造系スタイルで勝利',(s,b)=>s.boss4Defeated&&(s.character==='tank'||D.getCharacterStyle?.(s,s.character)?.tags?.includes('成長'))),
    win('v20_rune_crisis','rune',['rune_crisis'],'背水のルーン','第4ボス撃破後、HP50%以下で勝利',(s,b)=>s.boss4Defeated&&b.player.hp<=b.player.maxHp/2),
    win('v20_rune_weave','rune',['rune_weave'],'混成のルーン','第4ボス撃破後、2タグ以上のカードを7枚以上採用して勝利',(s,b)=>s.boss4Defeated&&multitag(s)>=7),
    win('v20_rune_focus','rune',['rune_focus'],'焦点のルーン','第4ボス撃破後、提示操作タグ5枚以上＋ルーン1種類以上で勝利',(s,b)=>s.boss4Defeated&&tagCount(s,'提示操作')>=5&&runeCount(s)>=1),
    win('v20_rune_hunt','rune',['rune_hunt'],'狩猟のルーン','第4ボス撃破後、特殊個体特性3種類以上の敵を撃破',(s,b)=>s.boss4Defeated&&traitCount(b)>=3),

    // 追加アルカナ6種
    win('v20_arcana_star','arcana',['arcana_star'],'アルカナ：星','第4ボス撃破後、状態異常タグ7枚以上で勝利',(s,b)=>s.boss4Defeated&&tagCount(s,'状態異常')>=7),
    win('v20_arcana_moon','arcana',['arcana_moon'],'アルカナ：月','第4ボス撃破後、提示操作タグ6枚以上で勝利',(s,b)=>s.boss4Defeated&&tagCount(s,'提示操作')>=6),
    win('v20_arcana_hermit','arcana',['arcana_hermit'],'アルカナ：隠者','第4ボス撃破後、同名1枚だけのカードを8種類以上含むデッキで勝利',(s,b)=>s.boss4Defeated&&new Set(s.deck).size>=8),
    win('v20_arcana_world','arcana',['arcana_world'],'アルカナ：世界','第4ボス撃破後、連結コンボを2回以上成立させて勝利',(s,b)=>s.boss4Defeated&&b.linkComboCount>=2),
    win('v20_arcana_tower','arcana',['arcana_tower'],'アルカナ：塔','第4ボス撃破後、複合挙動2種類以上の敵を撃破',(s,b)=>s.boss4Defeated&&behaviorCount(b)>=2),
    win('v20_arcana_sun','arcana',['arcana_sun'],'アルカナ：太陽','第4ボス撃破後、HP50%以上を残して勝利',(s,b)=>s.boss4Defeated&&b.player.hp>b.player.maxHp/2),

    // キャラ6体＋遺物/プロトコル
    win('v20_char_glyph','mixed',['glyph',...relics.slice(0,2),protocols[0]],'グリフ起動','第4ボス撃破後、ルーンを3種類のカードへ設定して勝利',(s,b)=>s.boss4Defeated&&runeCount(s)>=3),
    win('v20_char_oracle','mixed',['oracle',...relics.slice(2,4),protocols[1]],'オラクル起動','第4ボス撃破後、アルカナを装備して勝利',(s,b)=>s.boss4Defeated&&!!s.arcana?.id),
    win('v20_char_braid','mixed',['braid',...relics.slice(4,6),protocols[2]],'ブレイド起動','第4ボス撃破後、調律2種類＋カード連結を設定して勝利',(s,b)=>s.boss4Defeated&&Object.keys(s.cardTunings||{}).length>=2&&!!(s.cardLink?.a&&s.cardLink?.b)),
    win('v20_char_remnant','mixed',['remnant',...relics.slice(6,8),protocols[3]],'レムナント起動','第4ボス撃破後、役割変換2種類＋捨て札タグ4枚以上で勝利',(s,b)=>s.boss4Defeated&&Object.keys(s.cardConversions||{}).length>=2&&tagCount(s,'捨て札')>=4),
    win('v20_char_axis','mixed',['axis',...relics.slice(8,10),protocols[4]],'アクシス起動','第4ボス撃破後、提示操作5枚以上＋2タグ以上カード6枚以上で勝利',(s,b)=>s.boss4Defeated&&tagCount(s,'提示操作')>=5&&multitag(s)>=6),
    win('v20_char_nexus','mixed',['nexus',...relics.slice(10,12),protocols[5]],'ネクサス起動','第4ボス撃破後、特殊個体4種類以上・複合挙動2種類以上の敵を撃破',(s,b)=>s.boss4Defeated&&traitCount(b)>=4&&behaviorCount(b)>=2),

    // 各キャラのスタイル3種＋遺物/プロトコル
    win('v20_style_glyph','mixed',[...styles.glyph,...relics.slice(12,14),protocols[6]],'グリフ・スタイル研究','グリフでルーン3種類を設定して勝利',(s,b)=>s.character==='glyph'&&runeCount(s)>=3),
    win('v20_style_oracle','mixed',[...styles.oracle,...relics.slice(14,16),protocols[7]],'オラクル・スタイル研究','オラクルでアルカナを装備して勝利',(s,b)=>s.character==='oracle'&&!!s.arcana?.id),
    win('v20_style_braid','mixed',[...styles.braid,...relics.slice(16,18),protocols[8]],'ブレイド・スタイル研究','ブレイドで調律＋連結を設定して勝利',(s,b)=>s.character==='braid'&&Object.keys(s.cardTunings||{}).length>=1&&!!(s.cardLink?.a&&s.cardLink?.b)),
    win('v20_style_remnant','mixed',[...styles.remnant,...relics.slice(18,20),protocols[9]],'レムナント・スタイル研究','レムナントで役割変換2種類を設定して勝利',(s,b)=>s.character==='remnant'&&Object.keys(s.cardConversions||{}).length>=2),
    win('v20_style_axis','mixed',[...styles.axis,...relics.slice(20,22),protocols[10]],'アクシス・スタイル研究','アクシスで提示操作タグ6枚以上のデッキで勝利',(s,b)=>s.character==='axis'&&tagCount(s,'提示操作')>=6),
    win('v20_style_nexus','mixed',[...styles.nexus,...relics.slice(22,24),protocols[11]],'ネクサス・スタイル研究','ネクサスで複合挙動2種類以上の敵を撃破',(s,b)=>s.character==='nexus'&&behaviorCount(b)>=2),

    // 調律8種＋残り遺物4＋プロトコル3
    win('v20_tuning_rune','mixed',['v20_rune_tune','v20_link_rune',relics[24],protocols[12]],'刻印・符鎖調律研究','ルーン2種類＋連結を設定して勝利',(s,b)=>s.boss4Defeated&&runeCount(s)>=2&&!!(s.cardLink?.a&&s.cardLink?.b)),
    win('v20_tuning_arcana','mixed',['v20_arcana_tune','v20_fortune',relics[25],protocols[13]],'秘儀・運命調律研究','アルカナ装備＋調律2種類で勝利',(s,b)=>s.boss4Defeated&&!!s.arcana?.id&&Object.keys(s.cardTunings||{}).length>=2),
    win('v20_tuning_enemy','mixed',['v20_boss_tune','v20_deep_behavior',relics[26],protocols[14]],'決戦・深相調律研究','第4ボス再戦または複合挙動2種類以上の敵を撃破',(s,b)=>s.boss4Defeated&&(b.bossId==='boss4'||behaviorCount(b)>=2)),
    win('v20_tuning_integration','mixed',['v20_traitwall','v20_integrated',relics[27]],'群体・統合調律研究','特殊個体4種類以上の敵へ、調律と役割変換を同じカードへ設定して勝利',(s,b)=>s.boss4Defeated&&traitCount(b)>=4&&Object.keys(s.cardTunings||{}).some(id=>!!s.cardConversions?.[id])),

    // 新特殊個体攻略で残り遺物2
    win('v20_trait_paragon','relic',[relics[28]],'極冠個体攻略','極冠個体を撃破',(s,b)=>!!s.defeatedTraits?.v20_paragon),
    win('v20_trait_voidskin','relic',[relics[29]],'虚無皮膜個体攻略','虚無皮膜個体を撃破',(s,b)=>!!s.defeatedTraits?.v20_voidskin)
  );
})();
