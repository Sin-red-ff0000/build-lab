'use strict';
(function(){
  const BL=window.BuildLab; const D=BL.Data;
  const before={
    characters:new Set(Object.keys(D.CHARACTERS||{})), styles:new Set(Object.keys(D.CHARACTER_STYLES||{})),
    relics:new Set(Object.keys(D.RELICS||{})), protocols:new Set(Object.keys(D.PROTOCOLS||{})), tunings:new Set(Object.keys(D.TUNINGS||{})),
    traits:new Set(Object.keys(D.TRAITS||{})), behaviors:new Set(Object.keys(D.ENEMY_BEHAVIORS||{}))
  };

  // v0.19: 既存システムを横方向に大幅拡張するキャラクター群。
  Object.assign(D.CHARACTERS,{
    node:{id:'node',name:'ノード',role:'調律・役割変換',hp:68,desc:'調律または役割変換されたカードの基本効果+22%。両方が重なったカードはさらに+12%。'},
    synth:{id:'synth',name:'シンセ',role:'多タグ・混成',hp:70,desc:'2タグ以上のカード+18%。3タグ以上ならさらに+12%。'},
    tracer:{id:'tracer',name:'トレーサー',role:'特殊個体・複合挙動',hp:72,desc:'敵の特殊個体特性が2種類以上なら+16%。複合挙動が1つ以上ならさらに+18%。'},
    rhythm:{id:'rhythm',name:'リズム',role:'提示位置・交互選択',hp:66,desc:'前ターンと異なる提示位置を選ぶと+28%。同じ位置を連続で選ぶと-6%。'},
    gearbox:{id:'gearbox',name:'ギア',role:'連結・循環',hp:69,desc:'連結コンボ+20%。山札再構築直後の最初のカード+15%。条件が重なると両方適用。'},
    bulwark:{id:'bulwark',name:'バルワーク',role:'耐久・反撃',hp:88,desc:'防御・複合・反撃カード+22%。HP半分以下ではさらに+12%。'},
    palette:{id:'palette',name:'パレット',role:'状態異常・多相',hp:65,desc:'敵に状態異常があるほど基本効果が上昇。1/2/3種類で段階的に強化される。'},
    mirror:{id:'mirror',name:'ミラー',role:'反復・変化',hp:67,desc:'直前に使ったカードと同名なら+38%。違うカードなら-4%。'}
  });

  // 新キャラクターは汎用ルールで戦闘側へ接続する。
  D.V19_CHARACTER_RULES={
    node:[{when:{tunedOrConverted:true},mult:1.22},{when:{tuned:true,converted:true},mult:1.12}],
    synth:[{when:{minTags:2},mult:1.18},{when:{minTags:3},mult:1.12}],
    tracer:[{when:{enemyTraitsMin:2},mult:1.16},{when:{enemyBehaviorsMin:1},mult:1.18}],
    rhythm:[{when:{positionChanged:true},mult:1.28},{when:{positionSame:true},mult:.94}],
    gearbox:[{when:{linkActive:true},mult:1.20},{when:{recentReshuffle:true},mult:1.15}],
    bulwark:[{when:{blockish:true},mult:1.22},{when:{blockish:true,lowHp:true},mult:1.12}],
    palette:[{when:{statusMin:1},mult:1.12},{when:{statusMin:2},mult:1.12},{when:{statusMin:3},mult:1.10}],
    mirror:[{when:{sameAsLast:true},mult:1.38},{when:{differentFromLast:true},mult:.96}]
  };

  const styles={
    node_tune:{id:'node_tune',character:'node',name:'純調律型',tags:['調律'],desc:'調律済みカード+38%。役割変換だけではボーナスを得ない。'},
    node_convert:{id:'node_convert',character:'node',name:'純変成型',tags:['役割変換'],desc:'役割変換済みカード+38%。調律だけではボーナスを得ない。'},
    node_dual:{id:'node_dual',character:'node',name:'二重校正型',tags:['調律','役割変換'],desc:'調律と役割変換が同時に設定されたカード+55%。'},
    synth_triad:{id:'synth_triad',character:'synth',name:'三相合成型',tags:['混成','多タグ'],desc:'3タグ以上のカード+40%。'},
    synth_mono:{id:'synth_mono',character:'synth',name:'単相濃縮型',tags:['単独'],desc:'1タグだけのカード+35%。'},
    synth_bridge:{id:'synth_bridge',character:'synth',name:'架橋合成型',tags:['混成','連結'],desc:'2タグ以上かつ連結コンボ成立時+45%。'},
    tracer_traits:{id:'tracer_traits',character:'tracer',name:'個体追跡型',tags:['特殊個体'],desc:'敵の特殊個体特性が3種類以上なら+35%。'},
    tracer_behavior:{id:'tracer_behavior',character:'tracer',name:'異相追跡型',tags:['複合挙動'],desc:'複合挙動が1つ以上なら+30%、2つ以上ならさらに+15%。'},
    tracer_clean:{id:'tracer_clean',character:'tracer',name:'無垢試験型',tags:['標準試験'],desc:'特殊個体特性が1つ以下の敵に対して+30%。'},
    rhythm_shift:{id:'rhythm_shift',character:'rhythm',name:'転拍型',tags:['提示操作'],desc:'前ターンと異なる位置を選ぶと+38%。'},
    rhythm_center:{id:'rhythm_center',character:'rhythm',name:'正拍型',tags:['提示操作','中央'],desc:'中央枠から使うカード+35%。'},
    rhythm_wings:{id:'rhythm_wings',character:'rhythm',name:'翼拍型',tags:['提示操作','左右'],desc:'左右枠から使うカード+28%。'},
    gearbox_link:{id:'gearbox_link',character:'gearbox',name:'継電型',tags:['連結'],desc:'連結コンボ+38%。'},
    gearbox_cycle:{id:'gearbox_cycle',character:'gearbox',name:'輪転型',tags:['循環'],desc:'山札再構築直後の最初のカード+40%。'},
    gearbox_relay:{id:'gearbox_relay',character:'gearbox',name:'継電輪転型',tags:['連結','循環'],desc:'連結コンボかつ山札再構築直後なら+55%。'},
    bulwark_counter:{id:'bulwark_counter',character:'bulwark',name:'迎撃型',tags:['反撃','耐久'],desc:'反撃を持つカード+38%。'},
    bulwark_guard:{id:'bulwark_guard',character:'bulwark',name:'城塞型',tags:['耐久'],desc:'防御・複合カード+35%。'},
    bulwark_crisis:{id:'bulwark_crisis',character:'bulwark',name:'背水城塞型',tags:['耐久','瀕死'],desc:'HP半分以下で全カード+25%。防御・複合カードはさらに+15%。'},
    palette_poison:{id:'palette_poison',character:'palette',name:'毒彩型',tags:['状態異常','毒'],desc:'毒を付与するカード+38%。'},
    palette_burn:{id:'palette_burn',character:'palette',name:'火彩型',tags:['状態異常','火傷'],desc:'火傷を付与するカード+38%。'},
    palette_spectrum:{id:'palette_spectrum',character:'palette',name:'多彩型',tags:['状態異常','多相'],desc:'敵に状態異常が2種類以上なら+30%。状態異常タグのカードはさらに+20%。'},
    mirror_repeat:{id:'mirror_repeat',character:'mirror',name:'反復鏡型',tags:['反復'],desc:'直前と同名カードなら+50%。'},
    mirror_variation:{id:'mirror_variation',character:'mirror',name:'変奏鏡型',tags:['変化'],desc:'直前と異なるカードなら+30%。'},
    mirror_duplicate:{id:'mirror_duplicate',character:'mirror',name:'複写鏡型',tags:['重複'],desc:'デッキに同名2枚以上あるカード+32%。'}
  };
  Object.assign(D.CHARACTER_STYLES,styles);
  D.V19_STYLE_RULES={
    node_tune:[{when:{tuned:true},mult:1.38}], node_convert:[{when:{converted:true},mult:1.38}], node_dual:[{when:{tuned:true,converted:true},mult:1.55}],
    synth_triad:[{when:{minTags:3},mult:1.40}], synth_mono:[{when:{maxTags:1},mult:1.35}], synth_bridge:[{when:{minTags:2,linkActive:true},mult:1.45}],
    tracer_traits:[{when:{enemyTraitsMin:3},mult:1.35}], tracer_behavior:[{when:{enemyBehaviorsMin:1},mult:1.30},{when:{enemyBehaviorsMin:2},mult:1.15}], tracer_clean:[{when:{enemyTraitsMax:1},mult:1.30}],
    rhythm_shift:[{when:{positionChanged:true},mult:1.38}], rhythm_center:[{when:{position:'center'},mult:1.35}], rhythm_wings:[{when:{positionSide:true},mult:1.28}],
    gearbox_link:[{when:{linkActive:true},mult:1.38}], gearbox_cycle:[{when:{recentReshuffle:true},mult:1.40}], gearbox_relay:[{when:{linkActive:true,recentReshuffle:true},mult:1.55}],
    bulwark_counter:[{when:{counterish:true},mult:1.38}], bulwark_guard:[{when:{blockish:true},mult:1.35}], bulwark_crisis:[{when:{lowHp:true},mult:1.25},{when:{lowHp:true,blockish:true},mult:1.15}],
    palette_poison:[{when:{cardStatus:'poison'},mult:1.38}], palette_burn:[{when:{cardStatus:'burn'},mult:1.38}], palette_spectrum:[{when:{statusMin:2},mult:1.30},{when:{tag:'状態異常'},mult:1.20}],
    mirror_repeat:[{when:{sameAsLast:true},mult:1.50}], mirror_variation:[{when:{differentFromLast:true},mult:1.30}], mirror_duplicate:[{when:{copiesMin:2},mult:1.32}]
  };

  // カード調律 +12。すべて個別アンロック制。
  Object.assign(D.TUNINGS,{
    v19_discard_tune:{name:'残響調律',tags:['捨て札','調律'],desc:'一度でも捨てられたカード実体なら+35%。未廃棄では-8%。',effect:'v19_discard_tune',requiresUnlock:true},
    v19_rebirth_tune:{name:'再起調律',tags:['循環','調律'],desc:'山札再構築直後の最初のカードなら+40%。それ以外は-8%。',effect:'v19_rebirth_tune',requiresUnlock:true},
    v19_ailment_tune:{name:'症状調律',tags:['状態異常','調律'],desc:'敵の状態異常が2種類以上なら+35%。それ以外は-8%。',effect:'v19_ailment_tune',requiresUnlock:true},
    v19_conversion_tune:{name:'変成調律',tags:['役割変換','調律'],desc:'役割変換済みなら+32%。未変換では-8%。',effect:'v19_conversion_tune',requiresUnlock:true},
    v19_behavior_tune:{name:'異相調律',tags:['複合挙動','調律'],desc:'敵に複合挙動があるなら+32%。ない場合は-8%。',effect:'v19_behavior_tune',requiresUnlock:true},
    v19_trait_tune:{name:'個体調律',tags:['特殊個体','調律'],desc:'敵の特殊個体特性が2種類以上なら+30%。それ以外は-8%。',effect:'v19_trait_tune',requiresUnlock:true},
    v19_hybrid_tune:{name:'混成調律',tags:['混成','調律'],desc:'2タグ以上のカードなら+28%。1タグだけなら-8%。',effect:'v19_hybrid_tune',requiresUnlock:true},
    v19_mono_tune:{name:'単相調律',tags:['単独','調律'],desc:'1タグだけのカードなら+32%。2タグ以上では-8%。',effect:'v19_mono_tune',requiresUnlock:true},
    v19_wide_tune:{name:'広域調律',tags:['提示','調律'],desc:'提示4枚以上なら+30%。3枚以下では-8%。',effect:'v19_wide_tune',requiresUnlock:true},
    v19_narrow_tune:{name:'狭域調律',tags:['提示','調律'],desc:'提示2枚以下なら+36%。3枚以上では-10%。',effect:'v19_narrow_tune',requiresUnlock:true},
    v19_forge_tune:{name:'鍛造調律',tags:['成長','調律'],desc:'戦闘中に強化済みのカード実体なら+42%。未強化では-10%。',effect:'v19_forge_tune',requiresUnlock:true},
    v19_shift_tune:{name:'転位調律',tags:['提示操作','調律'],desc:'前ターンと異なる位置から使うと+32%。同じ位置では-8%。',effect:'v19_shift_tune',requiresUnlock:true}
  });
  D.V19_TUNING_RULES={
    v19_discard_tune:{when:{discarded:true},hit:1.35,miss:.92},
    v19_rebirth_tune:{when:{recentReshuffle:true},hit:1.40,miss:.92},
    v19_ailment_tune:{when:{statusMin:2},hit:1.35,miss:.92},
    v19_conversion_tune:{when:{converted:true},hit:1.32,miss:.92},
    v19_behavior_tune:{when:{enemyBehaviorsMin:1},hit:1.32,miss:.92},
    v19_trait_tune:{when:{enemyTraitsMin:2},hit:1.30,miss:.92},
    v19_hybrid_tune:{when:{minTags:2},hit:1.28,miss:.92},
    v19_mono_tune:{when:{maxTags:1},hit:1.32,miss:.92},
    v19_wide_tune:{when:{promptMin:4},hit:1.30,miss:.92},
    v19_narrow_tune:{when:{promptMax:2},hit:1.36,miss:.90},
    v19_forge_tune:{when:{upgraded:true},hit:1.42,miss:.90},
    v19_shift_tune:{when:{positionChanged:true},hit:1.32,miss:.92}
  };

  // 遺物 +40。すべて既存ビルド条件を横断するデータ駆動ルール。
  const relicDefs={
    v19_tuning_prism:['調律プリズム',['調律'],'調律済みカード+18%。',{tuned:true},1.18],
    v19_conversion_lens:['変成レンズ',['役割変換'],'役割変換済みカード+18%。',{converted:true},1.18],
    v19_dual_caliper:['二重校正器',['調律','役割変換'],'調律＋役割変換が重なったカード+28%。',{tuned:true,converted:true},1.28],
    v19_style_emblem:['様式紋章',['スタイル'],'派生キャラスタイル使用中、全カード+15%。',{altStyle:true},1.15],
    v19_trait_scope:['個体照準鏡',['特殊個体'],'敵の特殊個体特性2種類以上で+18%。',{enemyTraitsMin:2},1.18],
    v19_behavior_scope2:['異相照準鏡',['複合挙動'],'敵に複合挙動があるなら+20%。',{enemyBehaviorsMin:1},1.20],
    v19_behavior_array:['異相多重器',['複合挙動'],'敵の複合挙動2種類以上で+28%。',{enemyBehaviorsMin:2},1.28],
    v19_center_crystal:['中軸結晶',['提示操作','中央'],'中央枠のカード+20%。',{position:'center'},1.20],
    v19_wing_crystal:['翼端結晶',['提示操作','左右'],'左右枠のカード+18%。',{positionSide:true},1.18],
    v19_shift_gyro:['転位ジャイロ',['提示操作'],'前ターンと異なる位置なら+22%。',{positionChanged:true},1.22],
    v19_repeat_mirror:['反復鏡片',['反復'],'直前と同名カードなら+28%。',{sameAsLast:true},1.28],
    v19_variation_mirror:['変奏鏡片',['変化'],'直前と異なるカードなら+18%。',{differentFromLast:true},1.18],
    v19_link_coil:['連結コイル',['連結'],'連結コンボ+20%。',{linkActive:true},1.20],
    v19_pair_badge:['対札章',['連結'],'連結ペアに指定されたカード+14%。',{pairCard:true},1.14],
    v19_rebirth_gear:['再起歯車',['循環'],'山札再構築直後+24%。',{recentReshuffle:true},1.24],
    v19_residue_plate:['残響板',['捨て札'],'一度捨てられたカード実体+20%。',{discarded:true},1.20],
    v19_lowhp_core:['背水核',['瀕死'],'HP半分以下で+20%。',{lowHp:true},1.20],
    v19_guard_core2:['城塞核II',['耐久'],'防御・複合カード+17%。',{blockish:true},1.17],
    v19_counter_core2:['迎撃核II',['反撃'],'反撃を持つカード+22%。',{counterish:true},1.22],
    v19_multihit_core2:['多段核II',['連撃'],'4ヒット以上のカード+20%。',{hitsMin:4},1.20],
    v19_status_core2:['症状核II',['状態異常'],'敵の状態異常2種類以上で+20%。',{statusMin:2},1.20],
    v19_hybrid_core2:['混成核II',['混成'],'2タグ以上のカード+16%。',{minTags:2},1.16],
    v19_triad_core:['三相核',['混成'],'3タグ以上のカード+25%。',{minTags:3},1.25],
    v19_mono_core:['単相核',['単独'],'1タグだけのカード+22%。',{maxTags:1},1.22],
    v19_singleton_core:['孤札核',['単独','構築規格'],'同名1枚だけのカード+20%。',{copiesMax:1},1.20],
    v19_duplicate_core:['複写核',['重複','構築規格'],'同名2枚以上のカード+20%。',{copiesMin:2},1.20],
    v19_wide_scanner:['広域観測器',['提示'],'提示4枚以上で+20%。',{promptMin:4},1.20],
    v19_narrow_scanner:['狭域観測器',['提示'],'提示2枚以下で+26%。',{promptMax:2},1.26],
    v19_forge_memory2:['鍛造記憶II',['成長'],'強化済みカード+25%。',{upgraded:true},1.25],
    v19_reserve_cell:['保留セル',['提示操作'],'持ち越しカード+22%。',{reserved:true},1.22],
    v19_doctrine_emblem:['規格紋章',['構築規格'],'構築規格使用中+14%。',{doctrine:true},1.14],
    v19_poison_lens:['毒彩レンズ',['状態異常','毒'],'毒を付与するカード+24%。',{cardStatus:'poison'},1.24],
    v19_burn_lens:['火彩レンズ',['状態異常','火傷'],'火傷を付与するカード+24%。',{cardStatus:'burn'},1.24],
    v19_trait_linker:['個体継電器',['特殊個体','連結'],'特殊個体特性2種類以上の敵への連結コンボ+30%。',{enemyTraitsMin:2,linkActive:true},1.30],
    v19_behavior_tuner:['異相調律器',['複合挙動','調律'],'複合挙動のある敵へ調律カード+30%。',{enemyBehaviorsMin:1,tuned:true},1.30],
    v19_conversion_guardian:['変成守護器',['役割変換','耐久'],'役割変換済みの防御・複合カード+26%。',{converted:true,blockish:true},1.26],
    v19_cycle_linker:['輪転継電器',['循環','連結'],'再構築直後の連結コンボ+34%。',{recentReshuffle:true,linkActive:true},1.34],
    v19_discard_tuner:['残響調律器',['捨て札','調律'],'一度捨てられた調律カード+30%。',{discarded:true,tuned:true},1.30],
    v19_style_doctrine:['様式規格器',['スタイル','構築規格'],'派生スタイル＋構築規格使用中+24%。',{altStyle:true,doctrine:true},1.24],
    v19_extreme_lens:['極端観測鏡',['提示'],'提示2枚以下または4枚以上を狙う構築向け。提示2枚以下で+22%。',{promptMax:2},1.22]
  };
  D.V19_RELIC_RULES={};
  for(const [id,[name,tags,desc,when,mult]] of Object.entries(relicDefs)){D.RELICS[id]={name,tags,desc};D.V19_RELIC_RULES[id]=[{when,mult}];}

  // 強化プロトコル +20。1つだけ装備するため、長所と弱点を明確化。
  const protocolDefs={
    v19_p_tuning:['調律集中規格',['調律'],'調律済み+28%、未調律-6%。',{tuned:true},1.28,.94],
    v19_p_conversion:['変成集中規格',['役割変換'],'役割変換済み+28%、未変換-6%。',{converted:true},1.28,.94],
    v19_p_dual:['二重校正规格',['調律','役割変換'],'調律＋役割変換が重なれば+42%、それ以外-8%。',{tuned:true,converted:true},1.42,.92],
    v19_p_style:['様式増幅規格',['スタイル'],'派生スタイル使用中+22%、原型では-5%。',{altStyle:true},1.22,.95],
    v19_p_traits:['個体攻略規格',['特殊個体'],'敵特性2種類以上で+24%、それ未満-5%。',{enemyTraitsMin:2},1.24,.95],
    v19_p_behaviors:['異相攻略規格',['複合挙動'],'複合挙動あり+26%、なし-6%。',{enemyBehaviorsMin:1},1.26,.94],
    v19_p_shift:['転拍規格',['提示操作'],'位置変更時+30%、同位置継続では-8%。',{positionChanged:true},1.30,.92],
    v19_p_center:['中軸集中規格',['提示操作','中央'],'中央枠+30%、左右-8%。',{position:'center'},1.30,.92],
    v19_p_link:['連結増幅規格II',['連結'],'連結コンボ+30%、非連結-7%。',{linkActive:true},1.30,.93],
    v19_p_cycle:['再起増幅規格',['循環'],'再構築直後+34%、それ以外-7%。',{recentReshuffle:true},1.34,.93],
    v19_p_discard:['残響増幅規格',['捨て札'],'一度捨てたカード+30%、未廃棄-7%。',{discarded:true},1.30,.93],
    v19_p_status:['多相症状規格',['状態異常'],'状態異常2種類以上で+30%、未達-7%。',{statusMin:2},1.30,.93],
    v19_p_guard:['城塞専攻規格',['耐久'],'防御・複合+28%、その他-7%。',{blockish:true},1.28,.93],
    v19_p_multi:['多段専攻規格',['連撃'],'4ヒット以上+30%、未達-7%。',{hitsMin:4},1.30,.93],
    v19_p_hybrid:['混成専攻規格',['混成'],'2タグ以上+24%、1タグ-6%。',{minTags:2},1.24,.94],
    v19_p_singleton:['孤札専攻規格',['単独'],'同名1枚だけ+30%、重複時-8%。',{copiesMax:1},1.30,.92],
    v19_p_duplicate:['複写専攻規格',['重複'],'同名2枚以上+30%、単独時-8%。',{copiesMin:2},1.30,.92],
    v19_p_wide:['広域提示規格',['提示'],'提示4枚以上+28%、未達-7%。',{promptMin:4},1.28,.93],
    v19_p_forge:['鍛造専攻規格',['成長'],'強化済み+38%、未強化-10%。',{upgraded:true},1.38,.90],
    v19_p_repeat:['反復専攻規格',['反復'],'直前と同名+40%、異なるカード-8%。',{sameAsLast:true},1.40,.92]
  };
  D.V19_PROTOCOL_RULES={};
  for(const [id,[name,tags,desc,when,hit,miss]] of Object.entries(protocolDefs)){D.PROTOCOLS[id]={name,tags,desc,effect:id};D.V19_PROTOCOL_RULES[id]={when,hit,miss};}

  // v0.19の上位浄化個体を試せるよう、既存の耐性スライダー上限を100%へ拡張。
  const v19ResistCfg=(D.ENEMY_STAT_CONFIG||[]).find(x=>x.key==='resist');if(v19ResistCfg)v19ResistCfg.max=Math.max(v19ResistCfg.max||0,100);

  // 特殊個体 +12。発見条件は敵ステータスだけで決まる。
  const traitDefs={
    v19_ironheart:{name:'鉄心個体',short:'鉄心',desc:'最大HP×1.18、防御力+5。'},
    v19_ravager:{name:'猛攻個体',short:'猛攻',desc:'攻撃力×1.25。'},
    v19_afterimage:{name:'残像個体',short:'残像',desc:'速度+0.55。'},
    v19_mutant:{name:'変異個体',short:'変異',desc:'再生力+3、状態異常耐性+15%。'},
    v19_biofortress:{name:'生体要塞個体',short:'生要塞',desc:'最大HP×1.15、防御力+4、再生力+2。'},
    v19_vengeful:{name:'報復個体',short:'報復',desc:'攻撃力×1.15、防御力+4。'},
    v19_phantom:{name:'幽影個体',short:'幽影',desc:'速度+0.35、状態異常耐性+15%。'},
    v19_plague:{name:'疫走個体',short:'疫走',desc:'攻撃力×1.12、再生力+3。'},
    v19_absolute:{name:'絶対個体',short:'絶対',desc:'最大HP×1.15、攻撃力×1.12、防御力+3。'},
    v19_hyperclean:{name:'超浄化個体',short:'超浄',desc:'状態異常耐性+25%。'},
    v19_rapidregen:{name:'高速再生個体',short:'速再',desc:'速度+0.30、再生力+4。'},
    v19_omega:{name:'極限個体',short:'極限',desc:'全能力を小幅強化する最上位複合個体。'}
  };
  for(const [id,x] of Object.entries(traitDefs))D.TRAITS[id]={...x,effect:id};
  D.V19_TRAIT_RULES={
    v19_ironheart:{hpMult:1.18,defAdd:5},v19_ravager:{atkMult:1.25},v19_afterimage:{spdAdd:.55},v19_mutant:{regenAdd:3,resistAdd:15},
    v19_biofortress:{hpMult:1.15,defAdd:4,regenAdd:2},v19_vengeful:{atkMult:1.15,defAdd:4},v19_phantom:{spdAdd:.35,resistAdd:15},v19_plague:{atkMult:1.12,regenAdd:3},
    v19_absolute:{hpMult:1.15,atkMult:1.12,defAdd:3},v19_hyperclean:{resistAdd:25},v19_rapidregen:{spdAdd:.30,regenAdd:4},v19_omega:{hpMult:1.12,atkMult:1.12,defAdd:3,spdAdd:.25,regenAdd:2,resistAdd:10}
  };
  D.V19_TRAIT_CONDITIONS={
    v19_ironheart:{advanced:false,label:'HP倍率×10以上＋防御倍率×10以上',check:e=>e.hp>=10&&e.def>=10},
    v19_ravager:{advanced:false,label:'攻撃倍率×12以上',check:e=>e.atk>=12},
    v19_afterimage:{advanced:false,label:'速度倍率×4.5以上',check:e=>e.spd>=4.5},
    v19_mutant:{advanced:true,label:'再生力9以上＋状態異常耐性70%以上',check:e=>e.regen>=9&&e.resist>=70},
    v19_biofortress:{advanced:true,label:'HP倍率×10以上＋防御倍率×9以上＋再生力6以上',check:e=>e.hp>=10&&e.def>=9&&e.regen>=6},
    v19_vengeful:{advanced:false,label:'攻撃倍率×9以上＋防御倍率×8以上',check:e=>e.atk>=9&&e.def>=8},
    v19_phantom:{advanced:true,label:'速度倍率×4以上＋状態異常耐性60%以上',check:e=>e.spd>=4&&e.resist>=60},
    v19_plague:{advanced:true,label:'攻撃倍率×8以上＋再生力7以上',check:e=>e.atk>=8&&e.regen>=7},
    v19_absolute:{advanced:false,label:'HP倍率×10以上＋攻撃倍率×9以上＋防御倍率×9以上',check:e=>e.hp>=10&&e.atk>=9&&e.def>=9},
    v19_hyperclean:{advanced:true,label:'状態異常耐性85%以上',check:e=>e.resist>=85},
    v19_rapidregen:{advanced:true,label:'速度倍率×3.5以上＋再生力8以上',check:e=>e.spd>=3.5&&e.regen>=8},
    v19_omega:{advanced:true,label:'HP×10 / 攻撃×9 / 防御×9 / 速度×3 / 再生8 / 耐性70%以上',check:e=>e.hp>=10&&e.atk>=9&&e.def>=9&&e.spd>=3&&e.regen>=8&&e.resist>=70}
  };

  // 複合挙動 +20。既存の戦闘ルール語彙だけで構成し、複数同時発動可能。
  Object.assign(D.ENEMY_BEHAVIORS,{
    v19_bh_ironrage:{name:'血鉄反応',requires:['v19_ironheart','berserk'],desc:'3ターンごとにそのターンの攻撃+4。',rules:{everyNTurnAttackBonus:{turns:3,amount:4}}},
    v19_bh_rushkill:{name:'猛攻連鎖',requires:['v19_ravager','fast'],desc:'3ターンごとに追加行動+1。',rules:{everyNTurnExtraAction:{turns:3,extra:1}}},
    v19_bh_afterclean:{name:'無菌残像',requires:['v19_afterimage','purifier'],desc:'状態異常中は攻撃+4。敵ターン終了時に毒・火傷を1減らす。',rules:{statusAttackBonus:4,cleanseEnd:{amount:1,block:0}}},
    v19_bh_mutant_shell:{name:'変異外殻',requires:['v19_mutant','armored'],desc:'再生時、回復量と同じ障壁を最大10得る。',rules:{healBlockRatio:1,healBlockMax:10}},
    v19_bh_bio_mobile:{name:'生体機動',requires:['v19_biofortress','fast'],desc:'複数回行動するターン開始時に障壁8。',rules:{multiActionBlock:8}},
    v19_bh_venge_giant:{name:'報復巨躯',requires:['v19_vengeful','giant'],desc:'HP半分以下で一度だけ攻撃力+4。',rules:{lowHpAtkOnce:4}},
    v19_bh_phantom_rage:{name:'幽影暴走',requires:['v19_phantom','berserk'],desc:'4ターンごとに追加行動+1。',rules:{everyNTurnExtraAction:{turns:4,extra:1}}},
    v19_bh_plague_clean:{name:'疫浄循環',requires:['v19_plague','purifier'],desc:'3ターンごとに状態異常を1減らしHP6回復。',rules:{everyNTurnCleanseHeal:{turns:3,amount:1,heal:6}}},
    v19_bh_absolute_regen:{name:'絶対再生',requires:['v19_absolute','regenerative'],desc:'HP半分以下では再生量2倍。',rules:{lowHpRegenMult:2}},
    v19_bh_hyper_armor:{name:'超浄甲',requires:['v19_hyperclean','armored'],desc:'敵ターン終了時に毒・火傷を1減らし、除去時は障壁10。',rules:{cleanseEnd:{amount:1,block:10}}},
    v19_bh_rapid_rage:{name:'再生狂走',requires:['v19_rapidregen','berserk'],desc:'前ターンに再生していた場合、次の攻撃+4。',rules:{healNextAttackBonus:4}},
    v19_bh_omega_phase:{name:'極限共鳴',requires:['v19_omega','allphase'],desc:'3ターンごとに攻撃+4、同時に障壁10。',rules:{everyNTurnAttackBonus:{turns:3,amount:4},everyNTurnBlock:{turns:3,amount:10}}},
    v19_bh_iron_regen:{name:'鉄心再生',requires:['v19_ironheart','regenerative'],desc:'再生時、回復量の障壁を最大8得る。',rules:{healBlockRatio:1,healBlockMax:8}},
    v19_bh_ravager_giant:{name:'巨殺衝動',requires:['v19_ravager','giant'],desc:'HP半分以下で一度だけ攻撃力+5。',rules:{lowHpAtkOnce:5}},
    v19_bh_after_fast:{name:'超速残像',requires:['v19_afterimage','fast'],desc:'4ターンごとに追加行動+1。',rules:{everyNTurnExtraAction:{turns:4,extra:1}}},
    v19_bh_mutant_clean:{name:'変異浄化',requires:['v19_mutant','purifier'],desc:'4ターンごとに状態異常を1減らしHP7回復。',rules:{everyNTurnCleanseHeal:{turns:4,amount:1,heal:7}}},
    v19_bh_bio_regen:{name:'生体城壁',requires:['v19_biofortress','regenerative'],desc:'3ターンごとに障壁14。',rules:{everyNTurnBlock:{turns:3,amount:14}}},
    v19_bh_venge_armor:{name:'報復装甲',requires:['v19_vengeful','armored'],desc:'状態異常中は攻撃+3。',rules:{statusAttackBonus:3}},
    v19_bh_phantom_null:{name:'虚影連鎖',requires:['v19_phantom','nullstep'],desc:'3ターンごとに追加行動+1。',rules:{everyNTurnExtraAction:{turns:3,extra:1}}},
    v19_bh_omega_apex:{name:'終端適応',requires:['v19_omega','apex'],desc:'3ターンごとに全状態異常を1減らしHP8回復。',rules:{everyNTurnCleanseHeal:{turns:3,amount:1,heal:8}}}
  });

  D.V19_CHARACTER_IDS=Object.keys(D.CHARACTERS).filter(id=>!before.characters.has(id));
  D.V19_STYLE_IDS=Object.keys(D.CHARACTER_STYLES).filter(id=>!before.styles.has(id));
  D.V19_RELIC_IDS=Object.keys(D.RELICS).filter(id=>!before.relics.has(id));
  D.V19_PROTOCOL_IDS=Object.keys(D.PROTOCOLS).filter(id=>!before.protocols.has(id));
  D.V19_TUNING_IDS=Object.keys(D.TUNINGS).filter(id=>!before.tunings.has(id));
  D.V19_TRAIT_IDS=Object.keys(D.TRAITS).filter(id=>!before.traits.has(id));
  D.V19_BEHAVIOR_IDS=Object.keys(D.ENEMY_BEHAVIORS).filter(id=>!before.behaviors.has(id));
})();
