'use strict';
(function(){
  const BL=window.BuildLab; const D=BL.Data;
  const before={cards:new Set(Object.keys(D.CARDS)),relics:new Set(Object.keys(D.RELICS)),protocols:new Set(Object.keys(D.PROTOCOLS))};

  Object.assign(D.CARDS,{
    // 捨て札
    v17_residue_spear:{name:'残滓槍',tags:['捨て札','万能'],desc:'7ダメージ。一度選ばれず捨てられていれば23ダメージ。',kind:'damage',hits:1,damage:7,damageIfDiscarded:23},
    v17_echo_fort:{name:'残響堡',tags:['捨て札','耐久'],desc:'防御8。一度選ばれず捨てられていれば防御20。',kind:'block',block:8,discardBlockBoost:20},
    v17_cinder_cache:{name:'灰毒の置土産',tags:['捨て札','状態異常'],desc:'4ダメージ＋火傷2。選ばれず捨てられた時、毒4。',kind:'damage',hits:1,damage:4,status:{type:'burn',amount:2},onDiscard:{status:'poison',amount:4}},
    v17_reclaim_cut:{name:'回収斬',tags:['捨て札','循環'],desc:'6ダメージ。最後に捨てられたカードを山札の上へ戻す。',kind:'damage',hits:1,damage:6,effect:'recoverLastDiscard'},

    // 連撃
    v17_sixfold_needle:{name:'六連針',tags:['連撃'],desc:'2ダメージ×6。',kind:'damage',hits:6,damage:2},
    v17_venom_fan:{name:'毒扇連射',tags:['連撃','状態異常'],desc:'1ダメージ×6。命中ごとに毒1。',kind:'damage',hits:6,damage:1,perHitStatus:{type:'poison',amount:1}},
    v17_guard_barrage:{name:'防衛掃射',tags:['連撃','耐久'],desc:'2ダメージ×4＋防御6。',kind:'hybrid',hits:4,damage:2,block:6},
    v17_cycle_barrage:{name:'再帰掃射',tags:['連撃','循環'],desc:'2ダメージ×3。山札再構築直後なら×9。',kind:'damage',hits:3,damage:2,hitsIfRecentReshuffle:9},

    // 状態異常
    v17_deep_venom:{name:'深毒刻印',tags:['状態異常'],desc:'4ダメージ＋毒6。',kind:'damage',hits:1,damage:4,status:{type:'poison',amount:6}},
    v17_ember_shell:{name:'熾殻',tags:['状態異常','耐久'],desc:'防御9＋火傷4。',kind:'block',block:9,status:{type:'burn',amount:4}},
    v17_symptom_breaker:{name:'症状破砕',tags:['状態異常','万能'],desc:'8ダメージ。敵の状態異常種類数1つにつき+6ダメージ。',kind:'damage',hits:1,damage:8,damagePerStatusType:6},
    v17_erosion_storm:{name:'侵蝕嵐',tags:['状態異常','連撃'],desc:'2ダメージ×4。敵が状態異常なら×8。',kind:'damage',hits:4,damage:2,conditionalHits:8},

    // 耐久・反撃
    v17_guard_lance:{name:'護槍',tags:['耐久','反撃'],desc:'7ダメージ＋防御8。反撃率20%。',kind:'hybrid',hits:1,damage:7,block:8,counter:.20},
    v17_deep_wall:{name:'深層城壁',tags:['耐久'],desc:'防御9。5ターン目以降なら防御23。',kind:'block',block:9,blockIfTurnMin:{turn:5,value:23}},
    v17_regen_seal:{name:'再生封印盾',tags:['耐久','状態異常'],desc:'防御8。敵の再生力が4以上なら防御20。',kind:'block',block:8,blockIfEnemyRegenMin:{min:4,value:20}},
    v17_last_guard:{name:'背水迎撃',tags:['耐久','瀕死','反撃'],desc:'防御7。HP半分以下なら防御18。反撃率30%。',kind:'block',block:7,lowHpBlock:18,counter:.30},

    // 自傷・瀕死
    v17_blood_cannon:{name:'血脈砲',tags:['自傷'],desc:'HP3を失い22ダメージ。',kind:'damage',hits:1,damage:22,selfDamage:3},
    v17_crisis_fusillade:{name:'臨界斉射',tags:['自傷','瀕死','連撃'],desc:'HP2を失い2ダメージ×5。HP半分以下なら×9。',kind:'damage',hits:5,damage:2,lowHpHits:9,selfDamage:2},
    v17_scar_bulwark:{name:'瘢痕城壁',tags:['自傷','耐久'],desc:'HP2を失い防御14。',kind:'block',block:14,selfDamage:2},
    v17_brink_avalanche:{name:'境界崩撃',tags:['瀕死','万能'],desc:'9ダメージ。HP半分以下なら26ダメージ。',kind:'damage',hits:1,damage:9,lowHpDamage:26},

    // 循環
    v17_return_needle:{name:'再帰穿ち',tags:['循環'],desc:'7ダメージ。山札再構築直後なら24ダメージ。',kind:'damage',hits:1,damage:7,damageIfRecentReshuffle:24},
    v17_return_wall:{name:'再帰大盾',tags:['循環','耐久'],desc:'防御8。山札再構築直後なら防御23。',kind:'block',block:8,blockIfRecentReshuffle:23},
    v17_cycle_poison:{name:'輪毒再編',tags:['循環','状態異常'],desc:'毒3。山札再構築直後なら毒10。',kind:'utility',status:{type:'poison',amount:3},statusIfRecentReshuffle:10},
    v17_salvage_loop:{name:'回収輪転',tags:['循環','捨て札'],desc:'5ダメージ。最後に捨てられたカードを山札の上へ戻す。',kind:'damage',hits:1,damage:5,effect:'recoverLastDiscard'}
  });

  Object.assign(D.RELICS,{
    v17_discard_focus:{name:'残滓観測器',tags:['捨て札'],desc:'捨て札タグのカード基本効果+18%。'},
    v17_multi_focus:{name:'多段観測器',tags:['連撃'],desc:'連撃タグのカード基本効果+18%。'},
    v17_status_focus:{name:'症状観測器',tags:['状態異常'],desc:'状態異常タグのカード基本効果+18%。'},
    v17_guard_focus:{name:'防衛観測器',tags:['耐久'],desc:'耐久タグのカード基本効果+18%。'},
    v17_blood_focus:{name:'血脈観測器',tags:['自傷'],desc:'自傷タグのカード基本効果+20%。'},
    v17_cycle_focus:{name:'循環観測器',tags:['循環'],desc:'循環タグのカード基本効果+18%。'},
    v17_discard_status:{name:'残症変換器',tags:['捨て札','状態異常'],desc:'捨て札＋状態異常の両タグを持つカード基本効果+30%。'},
    v17_multi_cycle:{name:'連環加速器',tags:['連撃','循環'],desc:'連撃＋循環の両タグを持つカード基本効果+30%。'},
    v17_status_guard:{name:'症状防陣器',tags:['状態異常','耐久'],desc:'状態異常＋耐久の両タグを持つカード基本効果+30%。'},
    v17_guard_counter:{name:'重反照板',tags:['耐久','反撃'],desc:'耐久＋反撃の両タグを持つカード基本効果+30%。'},
    v17_blood_guard:{name:'血殻変換器',tags:['自傷','耐久'],desc:'自傷＋耐久の両タグを持つカード基本効果+30%。'},
    v17_cycle_status:{name:'循症触媒',tags:['循環','状態異常'],desc:'循環＋状態異常の両タグを持つカード基本効果+30%。'}
  });

  Object.assign(D.PROTOCOLS,{
    v17_p_discard:{name:'残滓集中規格 IV',tags:['捨て札'],desc:'捨て札タグ+20%。それ以外-6%。',effect:'v17_discard'},
    v17_p_multi:{name:'多段集中規格 IV',tags:['連撃'],desc:'連撃タグ+20%。それ以外-6%。',effect:'v17_multi'},
    v17_p_status:{name:'症状集中規格 IV',tags:['状態異常'],desc:'状態異常タグ+20%。それ以外-6%。',effect:'v17_status'},
    v17_p_guard:{name:'堅守集中規格 IV',tags:['耐久'],desc:'耐久タグ+20%。それ以外-6%。',effect:'v17_guard'},
    v17_p_blood:{name:'血脈集中規格 IV',tags:['自傷'],desc:'自傷タグ+22%。それ以外-6%。',effect:'v17_blood'},
    v17_p_cycle:{name:'循環集中規格 IV',tags:['循環'],desc:'循環タグ+20%。それ以外-6%。',effect:'v17_cycle'}
  });

  D.V14_RELIC_RULES=Object.assign(D.V14_RELIC_RULES||{}, {
    v17_discard_focus:{tag:'捨て札',mult:1.18},v17_multi_focus:{tag:'連撃',mult:1.18},v17_status_focus:{tag:'状態異常',mult:1.18},v17_guard_focus:{tag:'耐久',mult:1.18},v17_blood_focus:{tag:'自傷',mult:1.20},v17_cycle_focus:{tag:'循環',mult:1.18},
    v17_discard_status:{tags:['捨て札','状態異常'],requireAll:true,mult:1.30},v17_multi_cycle:{tags:['連撃','循環'],requireAll:true,mult:1.30},v17_status_guard:{tags:['状態異常','耐久'],requireAll:true,mult:1.30},v17_guard_counter:{tags:['耐久','反撃'],requireAll:true,mult:1.30},v17_blood_guard:{tags:['自傷','耐久'],requireAll:true,mult:1.30},v17_cycle_status:{tags:['循環','状態異常'],requireAll:true,mult:1.30}
  });
  D.V14_PROTOCOL_RULES=Object.assign(D.V14_PROTOCOL_RULES||{}, {
    v17_p_discard:{tags:['捨て札'],single:1.20,double:1.20,miss:.94},v17_p_multi:{tags:['連撃'],single:1.20,double:1.20,miss:.94},v17_p_status:{tags:['状態異常'],single:1.20,double:1.20,miss:.94},v17_p_guard:{tags:['耐久'],single:1.20,double:1.20,miss:.94},v17_p_blood:{tags:['自傷'],single:1.22,double:1.22,miss:.94},v17_p_cycle:{tags:['循環'],single:1.20,double:1.20,miss:.94}
  });

  D.V17_CARD_IDS=Object.keys(D.CARDS).filter(id=>!before.cards.has(id));
  D.V17_RELIC_IDS=Object.keys(D.RELICS).filter(id=>!before.relics.has(id));
  D.V17_PROTOCOL_IDS=Object.keys(D.PROTOCOLS).filter(id=>!before.protocols.has(id));
})();
