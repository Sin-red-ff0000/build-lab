'use strict';
(function(){
  const BL=window.BuildLab; const D=BL.Data;
  const before={cards:new Set(Object.keys(D.CARDS)),relics:new Set(Object.keys(D.RELICS)),protocols:new Set(Object.keys(D.PROTOCOLS))};

  Object.assign(D.CARDS,{
    // 捨て札
    sediment_blade:{name:'沈殿刃',tags:['捨て札'],desc:'6ダメージ。一度選ばれず捨てられていれば20ダメージ。',kind:'damage',hits:1,damage:6,damageIfDiscarded:20},
    residue_bastion:{name:'残滓堡',tags:['捨て札','耐久'],desc:'防御7。一度選ばれず捨てられていれば防御18。',kind:'block',block:7,discardBlockBoost:18},
    cinder_offcut:{name:'焼け残り',tags:['捨て札','状態異常'],desc:'4ダメージ＋火傷2。選ばれず捨てられた時、火傷4。',kind:'damage',hits:1,damage:4,status:{type:'burn',amount:2},onDiscard:{status:'burn',amount:4}},
    salvage_jab:{name:'回収突き',tags:['捨て札','循環'],desc:'5ダメージ。最後に捨てられたカードを山札の上へ戻す。',kind:'damage',hits:1,damage:5,effect:'recoverLastDiscard'},

    // 連撃
    ninefold_beat:{name:'九節打',tags:['連撃'],desc:'2ダメージ×7。',kind:'damage',hits:7,damage:2},
    v14_toxic_barrage:{name:'毒雨連射',tags:['連撃','状態異常'],desc:'2ダメージ×4。命中ごとに毒1。',kind:'damage',hits:4,damage:2,perHitStatus:{type:'poison',amount:1}},
    scarlet_volley:{name:'紅蓮連射',tags:['連撃','自傷'],desc:'HP2を失い3ダメージ×5。',kind:'damage',hits:5,damage:3,selfDamage:2},
    recycle_flurry:{name:'輪転乱舞',tags:['連撃','循環'],desc:'2ダメージ×3。山札再構築直後なら×8。',kind:'damage',hits:3,damage:2,hitsIfRecentReshuffle:8},

    // 状態異常
    venom_pressure:{name:'毒圧',tags:['状態異常'],desc:'5ダメージ＋毒5。',kind:'damage',hits:1,damage:5,status:{type:'poison',amount:5}},
    ember_guard:{name:'熾火防陣',tags:['状態異常','耐久'],desc:'防御8＋火傷3。',kind:'block',block:8,status:{type:'burn',amount:3}},
    symptom_harvest:{name:'症状収穫',tags:['状態異常','万能'],desc:'7ダメージ。敵の状態異常種類数1つにつき+5ダメージ。',kind:'damage',hits:1,damage:7,damagePerStatusType:5},
    erosion_rush:{name:'侵蝕連斬',tags:['状態異常','連撃'],desc:'2ダメージ×3。敵が状態異常なら×7。',kind:'damage',hits:3,damage:2,conditionalHits:7},

    // 耐久・反撃
    v14_iron_echo:{name:'鉄響盾',tags:['耐久','反撃'],desc:'防御11・反撃率40%。',kind:'block',block:11,counter:.40},
    patient_bulwark:{name:'忍耐城壁',tags:['耐久'],desc:'防御8。4ターン目以降なら防御20。',kind:'block',block:8,blockIfTurnMin:{turn:4,value:20}},
    counter_edge:{name:'返刃',tags:['耐久','反撃','万能'],desc:'6ダメージ＋防御6。',kind:'hybrid',hits:1,damage:6,block:6,counter:.25},
    regen_guard:{name:'再生封鎖',tags:['耐久','状態異常'],desc:'防御7。敵の再生力が5以上なら防御19。',kind:'block',block:7,blockIfEnemyRegenMin:{min:5,value:19}},

    // 自傷・瀕死
    blood_pike:{name:'血脈槍',tags:['自傷'],desc:'HP3を失い20ダメージ。',kind:'damage',hits:1,damage:20,selfDamage:3},
    crisis_barrage:{name:'臨界掃射',tags:['自傷','瀕死','連撃'],desc:'HP2を失い2ダメージ×4。HP半分以下なら×8。',kind:'damage',hits:4,damage:2,lowHpHits:8,selfDamage:2},
    scar_guard:{name:'瘢痕防壁',tags:['自傷','耐久'],desc:'HP2を失い防御13。',kind:'block',block:13,selfDamage:2},
    brink_strike:{name:'境界撃',tags:['瀕死','万能'],desc:'8ダメージ。HP半分以下なら24ダメージ。',kind:'damage',hits:1,damage:8,lowHpDamage:24},

    // 循環
    return_edge_ii:{name:'再帰刃',tags:['循環'],desc:'7ダメージ。山札再構築直後なら22ダメージ。',kind:'damage',hits:1,damage:7,damageIfRecentReshuffle:22},
    return_fortress:{name:'再帰城壁',tags:['循環','耐久'],desc:'防御7。山札再構築直後なら防御21。',kind:'block',block:7,blockIfRecentReshuffle:21},
    cycle_venom_ii:{name:'再帰毒',tags:['循環','状態異常'],desc:'毒3。山札再構築直後なら毒9。',kind:'utility',status:{type:'poison',amount:3},statusIfRecentReshuffle:9},
    reclaim_loop:{name:'回収循環',tags:['循環','捨て札'],desc:'4ダメージ。最後に捨てられたカードを山札の上へ戻す。',kind:'damage',hits:1,damage:4,effect:'recoverLastDiscard'},

    // 既存メタ要素との橋渡し
    style_edge_ii:{name:'様式刃 II',tags:['スタイル','万能'],desc:'7ダメージ。派生スタイル使用中なら20ダメージ。',kind:'damage',hits:1,damage:7,damageIfStyle:20},
    tuning_guard_ii:{name:'調律防陣 II',tags:['調律','耐久'],desc:'防御7。調律中なら防御20。',kind:'block',block:7,blockIfTuned:20},
    conversion_burst_ii:{name:'変成砲 II',tags:['変換','万能'],desc:'7ダメージ。役割変換中なら21ダメージ。',kind:'damage',hits:1,damage:7,damageIfConverted:21},
    v14_linked_residue:{name:'連結残滓',tags:['連結','捨て札'],desc:'6ダメージ。連結コンボなら14。一度捨てられていればさらに20ダメージ。',kind:'damage',hits:1,damage:6,damageIfLinkedCombo:14,damageIfDiscarded:20},
    doctrine_wall_ii:{name:'規格城壁 II',tags:['構築規格','耐久'],desc:'防御7。構築規格を装備中なら防御19。',kind:'block',block:7,blockIfDoctrine:19},
    behavior_lance_ii:{name:'異相槍 II',tags:['複合挙動','万能'],desc:'8ダメージ。敵に複合挙動があるなら25ダメージ。',kind:'damage',hits:1,damage:8,damageIfEnemyBehavior:25}
  });

  Object.assign(D.RELICS,{
    v14_discard_core:{name:'残滓圧縮器',tags:['捨て札'],desc:'捨て札タグのカード基本効果+16%。'},
    v14_multi_core:{name:'連撃共振器',tags:['連撃'],desc:'連撃タグのカード基本効果+16%。'},
    v14_status_core:{name:'症状濃縮器',tags:['状態異常'],desc:'状態異常タグのカード基本効果+16%。'},
    v14_guard_core:{name:'堅守増幅器',tags:['耐久'],desc:'耐久タグのカード基本効果+16%。'},
    v14_blood_core:{name:'血脈増幅器',tags:['自傷'],desc:'自傷タグのカード基本効果+18%。'},
    v14_cycle_core:{name:'再帰増幅器',tags:['循環'],desc:'循環タグのカード基本効果+16%。'},
    v14_discard_cycle:{name:'残滓輪転器',tags:['捨て札','循環'],desc:'捨て札＋循環の両タグを持つカード基本効果+28%。'},
    v14_multi_status:{name:'連症触媒',tags:['連撃','状態異常'],desc:'連撃＋状態異常の両タグを持つカード基本効果+28%。'},
    v14_guard_counter:{name:'反照装甲',tags:['耐久','反撃'],desc:'耐久＋反撃の両タグを持つカード基本効果+28%。'},
    v14_blood_multi:{name:'血雨機関',tags:['自傷','連撃'],desc:'自傷＋連撃の両タグを持つカード基本効果+28%。'},
    v14_style_relay:{name:'様式増幅継電器',tags:['スタイル'],desc:'派生スタイル使用中、全カード基本効果+12%。'},
    v14_tuning_relay:{name:'調律増幅継電器',tags:['調律'],desc:'調律中のカード基本効果+22%。'},
    v14_conversion_relay:{name:'変成増幅継電器',tags:['変換'],desc:'役割変換中のカード基本効果+22%。'},
    v14_behavior_relay:{name:'異相解析継電器',tags:['複合挙動'],desc:'敵に複合挙動がある時、全カード基本効果+16%。'}
  });

  Object.assign(D.PROTOCOLS,{
    v14_p_residue_cycle:{name:'残滓再帰規格',tags:['捨て札','循環'],desc:'捨て札または循環タグ+13%。両方なら+31%。',effect:'v14_residue_cycle'},
    v14_p_multi_status:{name:'多段侵蝕規格',tags:['連撃','状態異常'],desc:'連撃または状態異常タグ+13%。両方なら+31%。',effect:'v14_multi_status'},
    v14_p_guard_counter:{name:'反照防衛規格',tags:['耐久','反撃'],desc:'耐久または反撃タグ+13%。両方なら+31%。',effect:'v14_guard_counter'},
    v14_p_blood_multi:{name:'血雨加速規格',tags:['自傷','連撃'],desc:'自傷または連撃タグ+13%。両方なら+31%。',effect:'v14_blood_multi'},
    v14_p_style_bridge:{name:'様式共鳴規格 II',tags:['スタイル','万能'],desc:'派生スタイル使用中は全カード+18%。原型では-5%。',effect:'v14_style_bridge'},
    v14_p_tune_bridge:{name:'調律共鳴規格 II',tags:['調律','万能'],desc:'調律中カード+25%。非調律カード-4%。',effect:'v14_tune_bridge'},
    v14_p_convert_bridge:{name:'変成共鳴規格 II',tags:['変換','万能'],desc:'役割変換中カード+25%。非変換カード-4%。',effect:'v14_convert_bridge'},
    v14_p_behavior_bridge:{name:'異相適応規格 II',tags:['複合挙動','万能'],desc:'敵に複合挙動があるなら全カード+22%。無いなら-5%。',effect:'v14_behavior_bridge'}
  });

  D.V14_RELIC_RULES={
    v14_discard_core:{tag:'捨て札',mult:1.16},v14_multi_core:{tag:'連撃',mult:1.16},v14_status_core:{tag:'状態異常',mult:1.16},v14_guard_core:{tag:'耐久',mult:1.16},v14_blood_core:{tag:'自傷',mult:1.18},v14_cycle_core:{tag:'循環',mult:1.16},
    v14_discard_cycle:{tags:['捨て札','循環'],requireAll:true,mult:1.28},v14_multi_status:{tags:['連撃','状態異常'],requireAll:true,mult:1.28},v14_guard_counter:{tags:['耐久','反撃'],requireAll:true,mult:1.28},v14_blood_multi:{tags:['自傷','連撃'],requireAll:true,mult:1.28},
    v14_style_relay:{altStyle:true,mult:1.12},v14_tuning_relay:{tuned:true,mult:1.22},v14_conversion_relay:{converted:true,mult:1.22},v14_behavior_relay:{enemyBehavior:true,mult:1.16}
  };
  D.V14_PROTOCOL_RULES={
    v14_p_residue_cycle:{tags:['捨て札','循環'],single:1.13,double:1.31,miss:.95},
    v14_p_multi_status:{tags:['連撃','状態異常'],single:1.13,double:1.31,miss:.95},
    v14_p_guard_counter:{tags:['耐久','反撃'],single:1.13,double:1.31,miss:.95},
    v14_p_blood_multi:{tags:['自傷','連撃'],single:1.13,double:1.31,miss:.95},
    v14_p_style_bridge:{altStyle:true,hit:1.18,miss:.95},v14_p_tune_bridge:{tuned:true,hit:1.25,miss:.96},v14_p_convert_bridge:{converted:true,hit:1.25,miss:.96},v14_p_behavior_bridge:{enemyBehavior:true,hit:1.22,miss:.95}
  };

  D.V14_CARD_IDS=Object.keys(D.CARDS).filter(id=>!before.cards.has(id));
  D.V14_RELIC_IDS=Object.keys(D.RELICS).filter(id=>!before.relics.has(id));
  D.V14_PROTOCOL_IDS=Object.keys(D.PROTOCOLS).filter(id=>!before.protocols.has(id));
})();
