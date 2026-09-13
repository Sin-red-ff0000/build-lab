'use strict';
(function(){
  const BL=window.BuildLab; const D=BL.Data;
  const before={cards:new Set(Object.keys(D.CARDS)),relics:new Set(Object.keys(D.RELICS)),characters:new Set(Object.keys(D.CHARACTERS)),traits:new Set(Object.keys(D.TRAITS)),protocols:new Set(Object.keys(D.PROTOCOLS)),tunings:new Set(Object.keys(D.TUNINGS))};

  // v0.8: 新システムを増やさず、既存の6軸・提示操作・調律・連結・特殊個体を横に拡充。
  Object.assign(D.CHARACTERS,{
    risk:{id:'risk',name:'リスク',role:'自傷・瀕死',hp:66,desc:'自傷を持つカードの基本効果+20%。HPが半分以下なら、さらにすべてのカードの基本効果+15%。'},
    loop:{id:'loop',name:'ループ',role:'循環・再構築',hp:74,desc:'山札再構築直後の最初のカードの基本効果+30%。山札を再構築するたび防御3を得る。'},
    catalyst:{id:'catalyst',name:'カタリスト',role:'状態異常・複合症状',hp:68,desc:'状態異常タグのカードの基本効果+15%。敵に新しい種類の状態異常を付与した時、次のカードの効果+10%。'}
  });

  Object.assign(D.TUNINGS,{
    rapid:{name:'連射調律',tags:['連撃','調律'],desc:'3ヒット以上のカードなら基本効果+30%。2ヒット以下では-8%。',effect:'rapid'},
    guard:{name:'防護調律',tags:['耐久','調律'],desc:'防御・複合カードなら基本効果+30%。それ以外は-10%。',effect:'guard'},
    brink:{name:'臨界調律',tags:['瀕死','自傷','調律'],desc:'HP半分以下なら基本効果+40%。HP半分より上では-10%。',effect:'brink'}
  });

  Object.assign(D.PROTOCOLS,{
    residue_cycle:{name:'残滓循環規格',tags:['捨て札','循環'],desc:'捨て札または循環タグのカード+12%。両方を持つカードは合計+30%。',effect:'residue_cycle'},
    critical_maintenance:{name:'臨界維持規格',tags:['瀕死','自傷'],desc:'HP半分以下ではすべてのカード+25%。HP半分より上では-8%。',effect:'critical_maintenance'},
    ailment_web:{name:'症状網規格',tags:['状態異常'],desc:'状態異常タグのカード+12%。敵に状態異常が2種類以上ある時はさらに+20%。',effect:'ailment_web'},
    guard_counter:{name:'防反統合規格',tags:['耐久','反撃'],desc:'防御カード・反撃カード+20%。純攻撃カードは-8%。',effect:'guard_counter'},
    link_cycle:{name:'連結循環規格',tags:['連結','循環'],desc:'連結コンボ時、循環タグまたは山札再構築直後なら基本効果+30%。',effect:'link_cycle'},
    tuned_bridge:{name:'調律架橋規格',tags:['調律','万能'],desc:'調律済みかつ2タグ以上のカード+25%。未調律カードは-5%。',effect:'tuned_bridge'}
  });

  Object.assign(D.CARDS,{
    // 第1章系：既存6軸の厚みを追加
    grave_surge:{name:'残滓奔流',tags:['捨て札'],desc:'6ダメージ。選ばれず捨てられた時、次のカードの効果+15%。',kind:'damage',hits:1,damage:6,onDiscard:{buffNext:.15}},
    salvage_wall:{name:'回収防壁',tags:['捨て札','循環','耐久'],desc:'防御6。使用時、最後に捨てられたカードを山札の上へ戻す。',kind:'block',block:6,effect:'recoverLastDiscard'},
    scatter_mines:{name:'廃棄機雷',tags:['捨て札','状態異常'],desc:'3ダメージ。選ばれず捨てられた時、敵に4ダメージ＋火傷1。',kind:'damage',hits:1,damage:3,onDiscard:{damage:4,status:'burn',amount:1}},
    memory_cut:{name:'記憶切断',tags:['捨て札','循環'],desc:'5ダメージ。このカード実体が一度でも捨てられていれば15ダメージ。',kind:'damage',hits:1,damage:5,discardBoostValue:15},

    crimson_loop:{name:'紅循環',tags:['自傷','循環'],desc:'HP2を失い8ダメージ。山札再構築直後なら18ダメージ。',kind:'damage',hits:1,damage:8,selfDamage:2,damageIfRecentReshuffle:18},
    brink_guard:{name:'臨界防壁',tags:['自傷','瀕死','耐久'],desc:'HP2を失い防御7。HP半分以下なら防御18。',kind:'block',block:7,selfDamage:2,lowHpBlock:18},
    pain_barrage:{name:'痛撃連射',tags:['自傷','連撃'],desc:'HP3を失い2ダメージ×5。',kind:'damage',hits:5,damage:2,selfDamage:3},
    blood_venom_burst:{name:'血毒注入',tags:['自傷','状態異常'],desc:'HP2を失い毒5。',kind:'utility',selfDamage:2,status:{type:'poison',amount:5}},

    echo_guard:{name:'反響防壁',tags:['循環','耐久'],desc:'防御7。山札再構築1回につき防御+2。',kind:'block',block:7,blockPerReshuffle:2},
    restart_edge:{name:'再起刃',tags:['循環'],desc:'6ダメージ。山札再構築1回につき+2ダメージ。',kind:'damage',hits:1,damage:6,damagePerReshuffle:2},
    cycle_barrage:{name:'輪転連射',tags:['循環','連撃'],desc:'2ダメージ×3。山札再構築直後なら1発4ダメージ。',kind:'damage',hits:3,damage:2,damageIfRecentReshuffle:4},
    terminal_recall:{name:'終端回収',tags:['循環','捨て札'],desc:'最後に捨てられたカードを山札の上へ戻す。',kind:'utility',effect:'recoverLastDiscard'},

    armor_pulse:{name:'装甲脈動',tags:['耐久','反撃'],desc:'防御8。このターン被ダメージ時、敵に5ダメージ。',kind:'block',block:8,fixedCounter:5},
    guard_breaker:{name:'防壁転換',tags:['耐久','万能'],desc:'4ダメージ＋防御8。さらに現在の防御値の50%を敵に与える。',kind:'hybrid',hits:1,damage:4,block:8,damagePlusBlockRatio:.5},
    patient_bloom:{name:'耐久熟成',tags:['耐久'],desc:'防御8。4ターン目以降なら防御18。',kind:'block',block:8,blockIfTurnMin:{turn:4,value:18}},
    retaliate_chain:{name:'連続迎撃',tags:['耐久','反撃','連撃'],desc:'2ダメージ×2＋防御5。被ダメージ時に50%反撃。',kind:'hybrid',hits:2,damage:2,block:5,counter:.5},

    venom_lattice:{name:'毒格子',tags:['状態異常'],desc:'毒4。敵HPが半分より上なら毒7。',kind:'utility',status:{type:'poison',amount:4},statusIfEnemyHpAbove:{ratio:.5,amount:7}},
    cinder_lattice:{name:'火格子',tags:['状態異常'],desc:'火傷4。',kind:'utility',status:{type:'burn',amount:4}},
    mixed_feast:{name:'複合捕食',tags:['状態異常'],desc:'毒と火傷をすべて消費し、合計値×1.5のダメージ。',kind:'utility',consumeStatuses:{types:['poison','burn'],ratio:1.5}},
    ailment_guard:{name:'症状防壁',tags:['状態異常','耐久'],desc:'防御6。敵の状態異常1種類につき防御+3。',kind:'block',block:6,blockPerStatusType:3},

    sixfold_cut:{name:'六連斬',tags:['連撃'],desc:'1ダメージ×6。',kind:'damage',hits:6,damage:1},
    combo_accel:{name:'加速追撃',tags:['連撃'],desc:'2ダメージ×3。直前も攻撃カードなら×5。',kind:'damage',hits:3,damage:2,prevAttackHits:5},
    drill_guard:{name:'穿孔防陣',tags:['連撃','耐久'],desc:'2ダメージ×3＋防御5。',kind:'hybrid',hits:3,damage:2,block:5},
    chain_shatter:{name:'連鎖破砕',tags:['連撃','状態異常'],desc:'2ダメージ×4。敵が状態異常なら1発4ダメージ。',kind:'damage',hits:4,damage:2,damageIfStatus:4},

    // 第2章：提示操作・調律・対再生/耐性を拡張
    center_recycle:{name:'中軸循環刃',tags:['提示操作','循環'],desc:'6ダメージ。中央枠なら16ダメージ。',kind:'damage',hits:1,damage:6,damageIfPosition:{position:'center',value:16}},
    left_residue:{name:'左翼残滓',tags:['提示操作','捨て札'],desc:'5ダメージ。選ばれず捨てられた時、次のカード+18%。',kind:'damage',hits:1,damage:5,onDiscard:{buffNext:.18}},
    right_burn:{name:'右翼焼灼',tags:['提示操作','状態異常'],desc:'4ダメージ＋火傷2。右枠なら火傷6。',kind:'damage',hits:1,damage:4,status:{type:'burn',amount:2},statusIfPosition:{position:'right',amount:6}},
    reserved_counter:{name:'保留迎撃',tags:['提示操作','耐久','反撃'],desc:'4ダメージ＋防御6。持ち越し状態なら12ダメージ。被ダメージ時40%反撃。',kind:'hybrid',hits:1,damage:4,block:6,damageIfReserved:12,counter:.4},

    tuned_blood:{name:'調律血刃',tags:['調律','自傷'],desc:'HP3を失い8ダメージ。調律済みなら20ダメージ。',kind:'damage',hits:1,damage:8,selfDamage:3,damageIfTuned:20},
    tuned_cycle:{name:'調律輪転',tags:['調律','循環'],desc:'6ダメージ。調律済みなら13ダメージ、山札再構築直後なら18ダメージ。',kind:'damage',hits:1,damage:6,damageIfTuned:13,damageIfRecentReshuffle:18},
    tuned_counter:{name:'調律迎撃',tags:['調律','耐久','反撃'],desc:'防御7・40%反撃。調律済みなら防御15。',kind:'block',block:7,counter:.4,blockIfTuned:15},
    tuned_multi:{name:'調律多段',tags:['調律','連撃'],desc:'2ダメージ×3。調律済みなら×6。',kind:'damage',hits:3,damage:2,hitsIfTuned:6},

    regen_counterwall:{name:'再生迎撃壁',tags:['対再生','耐久','反撃'],desc:'防御8。敵の再生力5以上なら防御17。被ダメージ時35%反撃。',kind:'block',block:8,blockIfEnemyRegenMin:{min:5,value:17},counter:.35},
    null_barrage:{name:'零域連射',tags:['対耐性','連撃'],desc:'2ダメージ×4。敵の状態異常耐性50%以上なら1発4ダメージ。',kind:'damage',hits:4,damage:2,damageIfEnemyResistMin:{min:50,value:4}},
    adaptive_poison:{name:'適応毒',tags:['対再生','対耐性','状態異常'],desc:'毒3。敵が再生力を持ち、耐性30%以上なら毒8。',kind:'utility',status:{type:'poison',amount:3},statusIfAdaptiveEnemy:8},
    sterile_bastion:{name:'無菌城壁',tags:['対耐性','耐久'],desc:'防御8。敵の耐性50%以上なら防御18。',kind:'block',block:8,blockIfEnemyResistMin:{min:50,value:18}},

    // 第3章：連結を6軸へ橋渡し
    link_cycle_barrage:{name:'連結輪転射',tags:['連結','循環','連撃'],desc:'2ダメージ×3。連結コンボなら×6。',kind:'damage',hits:3,damage:2,hitsIfLinkedCombo:6},
    link_scar:{name:'連結血刃',tags:['連結','自傷'],desc:'HP3を失い9ダメージ。連結コンボなら25ダメージ。',kind:'damage',hits:1,damage:9,selfDamage:3,damageIfLinkedCombo:25},
    link_status_guard:{name:'連結症状壁',tags:['連結','状態異常','耐久'],desc:'防御7＋毒2。連結コンボなら防御15＋毒6。',kind:'block',block:7,blockIfLinkedCombo:15,status:{type:'poison',amount:2},statusIfLinkedCombo:6},
    link_discard_edge:{name:'連結残滓刃',tags:['連結','捨て札'],desc:'6ダメージ。捨てられた時、次カード+15%。連結コンボなら18ダメージ。',kind:'damage',hits:1,damage:6,onDiscard:{buffNext:.15},damageIfLinkedCombo:18},
    link_counterwall:{name:'連結迎撃壁',tags:['連結','耐久','反撃'],desc:'防御7・35%反撃。連結コンボなら防御15・80%反撃。',kind:'block',block:7,counter:.35,blockIfLinkedCombo:15,counterIfLinkedCombo:.8},
    link_prompt_edge:{name:'連結観測刃',tags:['連結','提示操作'],desc:'6ダメージ。連結コンボなら18ダメージ。',kind:'damage',hits:1,damage:6,damageIfLinkedCombo:18}
  });

  Object.assign(D.RELICS,{
    residue_memory:{name:'残滓記憶板',tags:['捨て札'],desc:'一度でも捨てられたカード実体の基本効果+18%。'},
    spill_engine:{name:'廃棄駆動器',tags:['捨て札'],desc:'そのターンに捨てたカード1枚につき、選択カードの基本効果+6%（最大+24%）。'},
    scar_lens:{name:'瘢痕レンズ',tags:['自傷'],desc:'自傷を持つカードの基本効果+18%。'},
    brink_reactor:{name:'臨界炉',tags:['瀕死','自傷'],desc:'HP半分以下なら基本効果+22%。'},
    loop_core:{name:'輪転核',tags:['循環'],desc:'山札再構築1回につき基本効果+6%（最大+24%）。'},
    restart_prism:{name:'再起プリズム',tags:['循環'],desc:'山札再構築直後の最初のカード+25%。'},
    wall_matrix:{name:'防壁行列',tags:['耐久'],desc:'防御・複合カードの基本効果+15%。'},
    counter_battery:{name:'迎撃蓄電池',tags:['反撃','耐久'],desc:'反撃を持つカードの基本効果+20%。'},
    multihit_lens:{name:'多段収束鏡',tags:['連撃'],desc:'5ヒット以上のカードの基本効果+18%。'},
    status_matrix:{name:'症状行列',tags:['状態異常'],desc:'敵に状態異常が2種類以上ある時、基本効果+18%。'},
    consume_prism:{name:'症状消費器',tags:['状態異常'],desc:'状態異常を消費するカードの基本効果+25%。'},
    center_archive:{name:'中央残滓記録',tags:['提示操作','捨て札'],desc:'一度捨てられたカードを中央枠から使う時、基本効果+25%。'},
    tuned_scar:{name:'調律瘢痕器',tags:['調律','自傷'],desc:'調律済みかつ自傷を持つカード+25%。'},
    tuned_cycle_core:{name:'調律輪転核',tags:['調律','循環'],desc:'調律済みカードを山札再構築直後に使う時+25%。'},
    regen_guard_lens:{name:'再生防壁観測器',tags:['対再生','耐久'],desc:'再生力を持つ敵に対して防御カード+18%。'},
    resist_assault_lens:{name:'耐性突破照準器',tags:['対耐性'],desc:'状態異常耐性50%以上の敵に対して攻撃カード+18%。'},
    link_cycle_core:{name:'連結輪転核',tags:['連結','循環'],desc:'連結コンボを山札再構築直後に成立させると+25%。'},
    link_scar_core:{name:'連結瘢痕核',tags:['連結','自傷'],desc:'自傷カードで連結コンボを成立させる時+25%。'},
    link_discard_core:{name:'連結残滓核',tags:['連結','捨て札'],desc:'一度捨てられたカードで連結コンボを成立させる時+20%。'},
    link_status_core:{name:'連結症状核',tags:['連結','状態異常'],desc:'敵が状態異常中に連結コンボを成立させる時+20%。'}
  });

  Object.assign(D.TRAITS,{
    overgrown:{name:'繁茂個体',short:'繁茂',desc:'最大HP×1.15、再生力+2。',effect:'overgrown'},
    cleanse_rush:{name:'浄閃個体',short:'浄閃',desc:'速度+0.25、状態異常耐性+10%。',effect:'cleanse_rush'},
    ironroot:{name:'鉄根個体',short:'鉄根',desc:'防御力+3、再生力+2。',effect:'ironroot'},
    purgefang:{name:'浄牙個体',short:'浄牙',desc:'攻撃力×1.15、状態異常耐性+10%。',effect:'purgefang'},
    redgrowth:{name:'血潮個体',short:'血潮',desc:'攻撃力×1.10、再生力+2。',effect:'redgrowth'},
    allphase:{name:'全相個体',short:'全相',desc:'HP・攻撃・防御・速度・再生・耐性を少しずつ強化。',effect:'allphase'}
  });

  D.V08_CARD_IDS=Object.keys(D.CARDS).filter(id=>!before.cards.has(id));
  D.V08_RELIC_IDS=Object.keys(D.RELICS).filter(id=>!before.relics.has(id));
  D.V08_CHARACTER_IDS=Object.keys(D.CHARACTERS).filter(id=>!before.characters.has(id));
  D.V08_TRAIT_IDS=Object.keys(D.TRAITS).filter(id=>!before.traits.has(id));
  D.V08_PROTOCOL_IDS=Object.keys(D.PROTOCOLS).filter(id=>!before.protocols.has(id));
  D.V08_TUNING_IDS=Object.keys(D.TUNINGS).filter(id=>!before.tunings.has(id));
})();
