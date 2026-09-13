'use strict';
(function(){
  const BL=window.BuildLab; const D=BL.Data;
  const before={cards:new Set(Object.keys(D.CARDS)),relics:new Set(Object.keys(D.RELICS)),traits:new Set(Object.keys(D.TRAITS)),protocols:new Set(Object.keys(D.PROTOCOLS))};
  Object.assign(D.CARDS,{
    focal_lance:{name:'焦点槍',tags:['提示操作','連撃'],desc:'5ダメージ×2。中央枠なら1発11ダメージ。',kind:'damage',hits:2,damage:5,damageIfPosition:{position:'center',value:11}},
    wing_parry:{name:'翼端受け',tags:['提示操作','耐久'],desc:'防御7。左枠なら防御15。',kind:'block',block:7,blockIfPosition:{position:'left',value:15}},
    wing_brand:{name:'右翼刻印',tags:['提示操作','状態異常'],desc:'4ダメージ＋火傷2。右枠なら火傷7。',kind:'damage',hits:1,damage:4,status:{type:'burn',amount:2},statusIfPosition:{position:'right',amount:7}},
    center_salvage:{name:'中軸回収',tags:['提示操作','循環'],desc:'防御6。中央枠なら防御13。最後に捨てられたカードを山札の上へ戻す。',kind:'block',block:6,blockIfPosition:{position:'center',value:13},effect:'recoverLastDiscard'},

    catalytic_rain:{name:'触媒雨',tags:['連撃','状態異常'],desc:'1ダメージ×5。各ヒットで毒1。',kind:'damage',hits:5,damage:1,perHitStatus:{type:'poison',amount:1}},
    precise_barrage:{name:'精密七射',tags:['連撃'],desc:'2ダメージ×7。',kind:'damage',hits:7,damage:2},
    pulse_guard:{name:'脈動防陣',tags:['連撃','耐久'],desc:'2ダメージ×3＋防御7。',kind:'hybrid',hits:3,damage:2,block:7},
    symptom_ripper:{name:'症状裂き',tags:['連撃','状態異常'],desc:'2ダメージ×4。敵が状態異常なら1発5ダメージ。',kind:'damage',hits:4,damage:2,damageIfStatus:5},

    forge_guard:{name:'鍛造防壁',tags:['耐久','循環'],desc:'防御9。4ターン目以降なら防御19。',kind:'block',block:9,blockIfTurnMin:{turn:4,value:19}},
    tempered_edge:{name:'焼入刃',tags:['耐久'],desc:'7ダメージ。5ターン目以降なら24ダメージ。',kind:'damage',hits:1,damage:7,damageIfTurnMin:{turn:5,value:24}},
    archive_wall:{name:'記録防壁',tags:['捨て札','耐久'],desc:'防御6。このカード実体が一度でも捨てられていれば防御16。',kind:'block',block:6,discardBlockBoost:16},
    salvage_strike:{name:'回収打撃',tags:['捨て札','循環'],desc:'6ダメージ。このカード実体が一度でも捨てられていれば18ダメージ。',kind:'damage',hits:1,damage:6,discardBoostValue:18},

    relay_spear:{name:'順送槍',tags:['連結','連撃'],desc:'4ダメージ×2。連結コンボなら1発10ダメージ。',kind:'damage',hits:2,damage:4,damageIfLinkedCombo:10},
    relay_shield:{name:'順送盾',tags:['連結','耐久'],desc:'防御7。連結コンボなら防御18。',kind:'block',block:7,blockIfLinkedCombo:18},
    crisis_edge:{name:'臨界断',tags:['自傷','瀕死'],desc:'HP3を失い10ダメージ。HP半分以下なら32ダメージ。',kind:'damage',hits:1,damage:10,lowHpDamage:32,selfDamage:3},
    crisis_guard:{name:'臨界装甲',tags:['自傷','瀕死','耐久'],desc:'HP2を失い防御8。HP半分以下なら防御21。',kind:'block',block:8,lowHpBlock:21,selfDamage:2},

    rebirth_edge:{name:'再起刃・改',tags:['循環'],desc:'7ダメージ。山札再構築直後なら22ダメージ。',kind:'damage',hits:1,damage:7,damageIfRecentReshuffle:22},
    rebirth_guard:{name:'再起壁',tags:['循環','耐久'],desc:'防御8。山札再構築直後なら防御18。',kind:'block',block:8,blockIfRecentReshuffle:18},
    spectrum_blast:{name:'多相爆砕',tags:['状態異常'],desc:'5ダメージ。敵の状態異常1種類につき+6ダメージ。',kind:'damage',hits:1,damage:5,damagePerStatusType:6},
    spectrum_guard:{name:'多相障壁',tags:['状態異常','耐久'],desc:'防御6。敵の状態異常1種類につき防御+4。',kind:'block',block:6,blockPerStatusType:4},
    spectrum_veil:{name:'多相の帳',tags:['状態異常','耐久'],desc:'防御7。敵の状態異常1種類につき防御+4。',kind:'block',block:7,blockPerStatusType:4},

    singular_focus:{name:'単独焦点',tags:['構築規格','単独'],desc:'7ダメージ。同名1枚だけなら21ダメージ。',kind:'damage',hits:1,damage:7,damageIfUniqueCopy:21},
    duplicate_focus:{name:'反復焦点',tags:['構築規格','重複'],desc:'6ダメージ。同名2枚以上なら18ダメージ。',kind:'damage',hits:1,damage:6,damageIfDuplicateCopy:18},
    hybrid_guardian:{name:'混成守護',tags:['構築規格','混成','耐久'],desc:'5ダメージ＋防御5。デッキ内タグ6種類以上なら12ダメージ＋防御12。',kind:'hybrid',hits:1,damage:5,block:5,damageIfDeckTagMin:{min:6,value:12},blockIfDeckTagMin:{min:6,value:12}},
    residue_link:{name:'残滓連結刃',tags:['捨て札','連結'],desc:'5ダメージ。連結コンボなら18ダメージ。一度捨てられていれば13ダメージ。',kind:'damage',hits:1,damage:5,damageIfLinkedCombo:18,discardBoostValue:13}
  });

  Object.assign(D.RELICS,{
    focal_core:{name:'焦点核',tags:['提示操作','中央'],desc:'中央枠のカード+22%。'},
    wing_compass:{name:'翼端羅針盤',tags:['提示操作','左右'],desc:'左右枠のカード+18%。'},
    catalytic_mesh:{name:'触媒網',tags:['連撃','状態異常'],desc:'3ヒット以上かつ状態異常タグのカード+22%。'},
    precision_barrel:{name:'精密砲身',tags:['連撃'],desc:'5ヒット以上のカード+24%。'},
    forge_memory:{name:'鍛造記憶板',tags:['耐久','成長'],desc:'フォートで強化済みのカード+20%。'},
    flux_gyro:{name:'流動ジャイロ',tags:['提示操作'],desc:'前回と異なる位置を選ぶと+18%。'},
    salvage_binder:{name:'回収綴じ具',tags:['捨て札','耐久'],desc:'一度捨てられたカード+18%。防御カードならさらに+8%。'},
    relay_diode:{name:'順送ダイオード',tags:['連結'],desc:'A→Bの順方向連結コンボ+25%。'},
    crisis_prism:{name:'臨界プリズム',tags:['瀕死','自傷'],desc:'HP半分以下で、自傷カード+28%。'},
    rebirth_spindle:{name:'再起紡錘',tags:['循環'],desc:'山札再構築直後のカード+28%。'},
    spectrum_cell:{name:'多相セル',tags:['状態異常'],desc:'敵の状態異常が2種類以上なら+20%、3種類以上なら+10%を追加。'},
    singleton_mirror:{name:'孤響鏡',tags:['構築規格','単独'],desc:'同名1枚だけのカード+22%。'}
  });

  Object.assign(D.PROTOCOLS,{
    style_resonance:{name:'スタイル共鳴規格',tags:['スタイル','万能'],desc:'原型以外のキャラクタースタイルを選択中、全カード+15%。',effect:'style_resonance'},
    focus_calibration:{name:'焦点校正规格',tags:['提示操作','中央'],desc:'中央枠+24%。左右枠-6%。',effect:'focus_calibration'},
    forge_calibration:{name:'鍛造校正规格',tags:['耐久','成長'],desc:'強化済みカード+25%。未強化カード-5%。',effect:'forge_calibration'},
    salvage_calibration:{name:'残滓校正规格',tags:['捨て札'],desc:'一度捨てられたカード+25%。未廃棄カード-5%。',effect:'salvage_calibration'},
    flux_calibration:{name:'流動校正规格',tags:['提示操作'],desc:'前回と異なる位置を選ぶと+25%。同じ位置の連続使用-8%。',effect:'flux_calibration'},
    spectrum_calibration:{name:'多相校正规格',tags:['状態異常'],desc:'敵の状態異常2種類以上で+18%、3種類以上でさらに+15%。',effect:'spectrum_calibration'}
  });

  Object.assign(D.TRAITS,{
    crusher:{name:'破砕個体',short:'破砕',desc:'攻撃力×1.18、防御力+3。',effect:'crusher'},
    bloodrush:{name:'疾血個体',short:'疾血',desc:'攻撃力×1.15、速度+0.35。',effect:'bloodrush'},
    regencarapace:{name:'再生装甲個体',short:'再装',desc:'最大HP×1.12、防御力+3、再生力+2。',effect:'regencarapace'},
    mirrorfang:{name:'鏡牙個体',short:'鏡牙',desc:'攻撃力×1.12、速度+0.20、状態異常耐性+10%。',effect:'mirrorfang'}
  });

  D.V10_CARD_IDS=Object.keys(D.CARDS).filter(id=>!before.cards.has(id));
  D.V10_RELIC_IDS=Object.keys(D.RELICS).filter(id=>!before.relics.has(id));
  D.V10_TRAIT_IDS=Object.keys(D.TRAITS).filter(id=>!before.traits.has(id));
  D.V10_PROTOCOL_IDS=Object.keys(D.PROTOCOLS).filter(id=>!before.protocols.has(id));
})();
