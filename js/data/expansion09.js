'use strict';
(function(){
  const BL=window.BuildLab; const D=BL.Data;
  const before={cards:new Set(Object.keys(D.CARDS)),relics:new Set(Object.keys(D.RELICS)),characters:new Set(Object.keys(D.CHARACTERS)),traits:new Set(Object.keys(D.TRAITS)),protocols:new Set(Object.keys(D.PROTOCOLS)),tunings:new Set(Object.keys(D.TUNINGS))};

  Object.assign(D.CHARACTERS,{
    architect:{id:'architect',name:'アーキテクト',role:'構築規格・万能',hp:70,desc:'構築規格を装備している間、全カードの基本効果+10%。2タグ以上のカードはさらに+8%。'},
    echo:{id:'echo',name:'エコー',role:'重複・反復',hp:67,desc:'デッキに同名カードを2枚以上採用しているカードの基本効果+22%。同名1枚だけのカードには補正なし。'}
  });

  Object.assign(D.TUNINGS,{
    doctrine_tune:{name:'規格調律',tags:['構築規格','調律'],desc:'構築規格を装備中なら基本効果+25%。規格なしでは-10%。',effect:'doctrine_tune',requiresSystem:'deck_doctrine',requiresUnlock:true},
    singular_tune:{name:'単独調律',tags:['単独','調律'],desc:'デッキ内に同名が1枚だけなら基本効果+30%。2枚以上なら-10%。',effect:'singular_tune',requiresSystem:'deck_doctrine',requiresUnlock:true},
    duplicate_tune:{name:'複製調律',tags:['重複','調律'],desc:'デッキ内に同名が2枚以上なら基本効果+30%。1枚だけなら-10%。',effect:'duplicate_tune',requiresSystem:'deck_doctrine',requiresUnlock:true}
  });

  Object.assign(D.PROTOCOLS,{
    compact_drive:{name:'圧縮駆動規格',tags:['構築規格','少数精鋭'],desc:'デッキ8枚以下なら基本効果+20%。それ以外は-7%。',effect:'compact_drive'},
    expanded_drive:{name:'展開駆動規格',tags:['構築規格','大量構築'],desc:'デッキ12枚以上なら基本効果+18%。それ以外は-7%。',effect:'expanded_drive'},
    singleton_drive:{name:'単独駆動規格',tags:['構築規格','単独'],desc:'同名1枚だけのカード+18%。',effect:'singleton_drive'},
    duplicate_drive:{name:'複製駆動規格',tags:['構築規格','重複'],desc:'同名2枚以上採用したカード+18%。',effect:'duplicate_drive'},
    spectrum_drive:{name:'多様駆動規格',tags:['構築規格','多様性'],desc:'デッキ内タグが6種類以上なら全カード+15%。',effect:'spectrum_drive'},
    doctrine_bridge:{name:'規格架橋規格',tags:['構築規格','混成'],desc:'構築規格装備中、2タグ以上のカード+20%。1タグのみ-5%。',effect:'doctrine_bridge'}
  });

  Object.assign(D.CARDS,{
    compact_edge:{name:'圧縮刃',tags:['構築規格','少数精鋭'],desc:'7ダメージ。デッキが8枚以下なら18ダメージ。',kind:'damage',hits:1,damage:7,damageIfDeckSizeMax:{max:8,value:18}},
    compact_guard:{name:'圧縮防壁',tags:['構築規格','少数精鋭','耐久'],desc:'防御7。デッキが8枚以下なら防御17。',kind:'block',block:7,blockIfDeckSizeMax:{max:8,value:17}},
    compact_barrage:{name:'圧縮連射',tags:['構築規格','少数精鋭','連撃'],desc:'2ダメージ×3。デッキが8枚以下なら×6。',kind:'damage',hits:3,damage:2,hitsIfDeckSizeMax:{max:8,value:6}},
    compact_venom:{name:'圧縮毒',tags:['構築規格','少数精鋭','状態異常'],desc:'毒3。デッキが8枚以下なら毒7。',kind:'utility',status:{type:'poison',amount:3},statusIfDeckSizeMax:{max:8,amount:7}},

    expanded_edge:{name:'展開刃',tags:['構築規格','大量構築'],desc:'8ダメージ。デッキが12枚以上なら20ダメージ。',kind:'damage',hits:1,damage:8,damageIfDeckSizeMin:{min:12,value:20}},
    expanded_guard:{name:'展開防壁',tags:['構築規格','大量構築','耐久'],desc:'防御8。デッキが12枚以上なら防御18。',kind:'block',block:8,blockIfDeckSizeMin:{min:12,value:18}},
    expanded_barrage:{name:'展開斉射',tags:['構築規格','大量構築','連撃'],desc:'2ダメージ×4。デッキが12枚以上なら×7。',kind:'damage',hits:4,damage:2,hitsIfDeckSizeMin:{min:12,value:7}},
    expanded_burn:{name:'展開火網',tags:['構築規格','大量構築','状態異常'],desc:'火傷3。デッキが12枚以上なら火傷8。',kind:'utility',status:{type:'burn',amount:3},statusIfDeckSizeMin:{min:12,amount:8}},

    singleton_edge:{name:'単独刃',tags:['構築規格','単独'],desc:'7ダメージ。同名がデッキに1枚だけなら21ダメージ。',kind:'damage',hits:1,damage:7,damageIfUniqueCopy:21},
    singleton_guard:{name:'単独防壁',tags:['構築規格','単独','耐久'],desc:'防御7。同名がデッキに1枚だけなら防御19。',kind:'block',block:7,blockIfUniqueCopy:19},
    singleton_barrage:{name:'単独連舞',tags:['構築規格','単独','連撃'],desc:'2ダメージ×3。同名が1枚だけなら×6。',kind:'damage',hits:3,damage:2,hitsIfUniqueCopy:6},
    singleton_toxin:{name:'単独毒式',tags:['構築規格','単独','状態異常'],desc:'毒3。同名が1枚だけなら毒8。',kind:'utility',status:{type:'poison',amount:3},statusIfUniqueCopy:8},

    duplicate_edge:{name:'複製刃',tags:['構築規格','重複'],desc:'8ダメージ。同名を2枚以上採用していれば19ダメージ。',kind:'damage',hits:1,damage:8,damageIfDuplicateCopy:19},
    duplicate_guard:{name:'複製防壁',tags:['構築規格','重複','耐久'],desc:'防御8。同名を2枚以上採用していれば防御18。',kind:'block',block:8,blockIfDuplicateCopy:18},
    duplicate_barrage:{name:'複製連射',tags:['構築規格','重複','連撃'],desc:'2ダメージ×3。同名を2枚以上採用していれば×6。',kind:'damage',hits:3,damage:2,hitsIfDuplicateCopy:6},
    duplicate_ember:{name:'複製火種',tags:['構築規格','重複','状態異常'],desc:'火傷3。同名を2枚以上採用していれば火傷7。',kind:'utility',status:{type:'burn',amount:3},statusIfDuplicateCopy:7},

    spectrum_edge:{name:'多様刃',tags:['構築規格','多様性','万能'],desc:'4ダメージ。デッキ内の異なるタグ1種類につき+2ダメージ（最大+14）。',kind:'damage',hits:1,damage:4,damagePerDistinctDeckTag:{value:2,max:14}},
    spectrum_guard:{name:'多様防壁',tags:['構築規格','多様性','耐久'],desc:'防御5。デッキ内の異なるタグ1種類につき防御+2（最大+14）。',kind:'block',block:5,blockPerDistinctDeckTag:{value:2,max:14}},
    spectrum_barrage:{name:'多様連撃',tags:['構築規格','多様性','連撃'],desc:'2ダメージ×3。デッキ内タグ6種類以上なら×6。',kind:'damage',hits:3,damage:2,hitsIfDeckTagMin:{min:6,value:6}},
    spectrum_status:{name:'多様症状',tags:['構築規格','多様性','状態異常'],desc:'毒2＋火傷2。デッキ内タグ6種類以上なら毒4＋火傷4。',kind:'utility',statuses:[{type:'poison',amount:2},{type:'burn',amount:2}],statusesIfDeckTagMin:{min:6,amount:4}},

    doctrine_edge:{name:'規格式刃',tags:['構築規格','万能'],desc:'7ダメージ。構築規格を装備中なら18ダメージ。',kind:'damage',hits:1,damage:7,damageIfDoctrine:18},
    doctrine_guard:{name:'規格式防壁',tags:['構築規格','耐久'],desc:'防御7。構築規格を装備中なら防御17。',kind:'block',block:7,blockIfDoctrine:17},
    doctrine_barrage:{name:'規格式連撃',tags:['構築規格','連撃'],desc:'2ダメージ×3。構築規格を装備中なら×6。',kind:'damage',hits:3,damage:2,hitsIfDoctrine:6},
    doctrine_poison:{name:'規格式毒',tags:['構築規格','状態異常'],desc:'毒3。構築規格を装備中なら毒8。',kind:'utility',status:{type:'poison',amount:3},statusIfDoctrine:8},

    residue_charter:{name:'残滓規約',tags:['構築規格','捨て札'],desc:'6ダメージ。捨てられた時、次カード+15%。構築規格装備中なら14ダメージ。',kind:'damage',hits:1,damage:6,onDiscard:{buffNext:.15},damageIfDoctrine:14},
    scar_charter:{name:'瘢痕規約',tags:['構築規格','自傷'],desc:'HP2を失い9ダメージ。構築規格装備中なら22ダメージ。',kind:'damage',hits:1,damage:9,selfDamage:2,damageIfDoctrine:22},
    cycle_charter:{name:'循環規約',tags:['構築規格','循環'],desc:'6ダメージ。山札再構築直後なら15ダメージ。構築規格装備中ならさらに扱いやすい。',kind:'damage',hits:1,damage:6,damageIfRecentReshuffle:15,damageIfDoctrine:13},
    counter_charter:{name:'迎撃規約',tags:['構築規格','耐久','反撃'],desc:'防御7・40%反撃。構築規格装備中なら防御15。',kind:'block',block:7,counter:.4,blockIfDoctrine:15},
    prompt_charter:{name:'観測規約',tags:['構築規格','提示操作'],desc:'6ダメージ。中央枠なら13ダメージ。構築規格装備中なら16ダメージ。',kind:'damage',hits:1,damage:6,damageIfPosition:{position:'center',value:13},damageIfDoctrine:16},
    link_charter:{name:'連結規約',tags:['構築規格','連結'],desc:'6ダメージ。連結コンボなら16ダメージ。構築規格装備中なら13ダメージ。',kind:'damage',hits:1,damage:6,damageIfLinkedCombo:16,damageIfDoctrine:13},
    tuned_charter:{name:'調律規約',tags:['構築規格','調律'],desc:'6ダメージ。調律済みなら14ダメージ。構築規格装備中なら13ダメージ。',kind:'damage',hits:1,damage:6,damageIfTuned:14,damageIfDoctrine:13},
    hybrid_charter:{name:'混成規約',tags:['構築規格','混成','耐久'],desc:'5ダメージ＋防御5。デッキ内タグ6種類以上なら10ダメージ＋防御10。',kind:'hybrid',hits:1,damage:5,block:5,damageIfDeckTagMin:{min:6,value:10},blockIfDeckTagMin:{min:6,value:10}},

    charter_recall:{name:'規格回収',tags:['構築規格','循環','捨て札'],desc:'防御6。最後に捨てられたカードを山札の上へ戻す。構築規格装備中なら防御12。',kind:'block',block:6,effect:'recoverLastDiscard',blockIfDoctrine:12},
    charter_bloodwall:{name:'規格血壁',tags:['構築規格','自傷','耐久'],desc:'HP2を失い防御9。構築規格装備中なら防御18。',kind:'block',block:9,selfDamage:2,blockIfDoctrine:18},
    charter_chain:{name:'規格連鎖',tags:['構築規格','連結','連撃'],desc:'2ダメージ×3。連結コンボなら×6。構築規格装備中なら×5。',kind:'damage',hits:3,damage:2,hitsIfLinkedCombo:6,hitsIfDoctrine:5},
    charter_reserve:{name:'規格保留',tags:['構築規格','提示操作','循環'],desc:'防御6。持ち越し状態なら防御13。構築規格装備中なら防御11。',kind:'block',block:6,blockIfReserved:13,blockIfDoctrine:11}
  });

  Object.assign(D.RELICS,{
    compact_frame:{name:'圧縮フレーム',tags:['構築規格','少数精鋭'],desc:'デッキ8枚以下なら基本効果+18%。'},
    expanded_bus:{name:'展開バス',tags:['構築規格','大量構築'],desc:'デッキ12枚以上なら基本効果+15%。'},
    singleton_badge:{name:'単独章',tags:['構築規格','単独'],desc:'同名1枚だけのカード+18%。'},
    duplicate_stamp:{name:'複製印',tags:['構築規格','重複'],desc:'同名2枚以上採用したカード+18%。'},
    spectrum_prism:{name:'多様プリズム',tags:['構築規格','多様性'],desc:'デッキ内タグ6種類以上なら基本効果+15%。'},
    doctrine_core:{name:'規格核',tags:['構築規格'],desc:'構築規格を装備中、全カード+12%。'},
    doctrine_guard:{name:'規格装甲',tags:['構築規格','耐久'],desc:'構築規格装備中、防御・複合カード+18%。'},
    doctrine_status:{name:'規格触媒',tags:['構築規格','状態異常'],desc:'構築規格装備中、状態異常タグカード+18%。'},
    doctrine_link:{name:'規格継電器',tags:['構築規格','連結'],desc:'構築規格装備中、連結コンボ+20%。'},
    doctrine_tuning:{name:'規格調律器',tags:['構築規格','調律'],desc:'構築規格装備中、調律済みカード+20%。'},
    compact_residue:{name:'圧縮残滓槽',tags:['構築規格','少数精鋭','捨て札'],desc:'デッキ8枚以下で、一度捨てられたカード+20%。'},
    compact_cycle:{name:'圧縮輪転核',tags:['構築規格','少数精鋭','循環'],desc:'デッキ8枚以下で、山札再構築直後のカード+22%。'},
    expanded_multi:{name:'展開多段器',tags:['構築規格','大量構築','連撃'],desc:'デッキ12枚以上で、3ヒット以上のカード+18%。'},
    expanded_status:{name:'展開症状網',tags:['構築規格','大量構築','状態異常'],desc:'デッキ12枚以上で、状態異常タグカード+18%。'},
    singleton_counter:{name:'単独迎撃板',tags:['構築規格','単独','反撃'],desc:'同名1枚だけの反撃カード+25%。'},
    duplicate_discard:{name:'複製廃棄炉',tags:['構築規格','重複','捨て札'],desc:'同名2枚以上採用した捨て札タグカード+22%。'},
    spectrum_bridge:{name:'多様架橋器',tags:['構築規格','多様性','混成'],desc:'デッキ内タグ6種類以上で、2タグ以上のカード+20%。'},
    architect_compass:{name:'設計羅針盤',tags:['構築規格','万能'],desc:'構築規格装備中、前ターンと異なるタグ構成のカードを使うと基本効果+18%。'}
  });

  Object.assign(D.TRAITS,{
    bloomwall:{name:'繁壁個体',short:'繁壁',desc:'防御力+4、再生力+3。',effect:'bloomwall'},
    nullgiant:{name:'零巨個体',short:'零巨',desc:'最大HP×1.20、状態異常耐性+15%。',effect:'nullgiant'},
    rushbloom:{name:'奔芽個体',short:'奔芽',desc:'速度+0.35、再生力+3。',effect:'rushbloom'},
    apex:{name:'極相個体',short:'極相',desc:'全主要能力を中程度強化する上位特殊個体。',effect:'apex'}
  });

  D.V09_CARD_IDS=Object.keys(D.CARDS).filter(id=>!before.cards.has(id));
  D.V09_RELIC_IDS=Object.keys(D.RELICS).filter(id=>!before.relics.has(id));
  D.V09_CHARACTER_IDS=Object.keys(D.CHARACTERS).filter(id=>!before.characters.has(id));
  D.V09_TRAIT_IDS=Object.keys(D.TRAITS).filter(id=>!before.traits.has(id));
  D.V09_PROTOCOL_IDS=Object.keys(D.PROTOCOLS).filter(id=>!before.protocols.has(id));
  D.V09_TUNING_IDS=Object.keys(D.TUNINGS).filter(id=>!before.tunings.has(id));
})();
