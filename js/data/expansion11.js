'use strict';
(function(){
  const BL=window.BuildLab; const D=BL.Data;
  const before={cards:new Set(Object.keys(D.CARDS)),relics:new Set(Object.keys(D.RELICS)),traits:new Set(Object.keys(D.TRAITS)),protocols:new Set(Object.keys(D.PROTOCOLS))};
  Object.assign(D.CARDS,{
    split_probe:{name:'分裂試験刃',tags:['変換'],desc:'8ダメージ。役割変換中なら18ダメージ。',kind:'damage',hits:1,damage:8,damageIfConverted:18},
    split_guard:{name:'分裂迎撃',tags:['変換','耐久'],desc:'5ダメージ＋防御6。役割変換中なら防御15。',kind:'hybrid',damage:5,block:6,blockIfConverted:15},
    conversion_barrage:{name:'変換連射',tags:['変換','連撃'],desc:'2ダメージ×3。役割変換中なら×6。',kind:'damage',hits:3,damage:2,hitsIfConverted:6},
    conversion_brand:{name:'変換刻印',tags:['変換','状態異常'],desc:'4ダメージ＋毒2。役割変換中なら毒7。',kind:'damage',hits:1,damage:4,status:{type:'poison',amount:2},statusIfConverted:7},
    adaptive_conversion:{name:'適応変成',tags:['変換','万能'],desc:'6ダメージ。役割変換中かつ2タグ以上なら20ダメージ。',kind:'damage',hits:1,damage:6,damageIfConvertedAndHybrid:20},
    conversion_wall:{name:'変成防壁',tags:['変換','耐久'],desc:'防御8。役割変換中なら防御18。',kind:'block',block:8,blockIfConverted:18},

    residue_hammer:{name:'残滓槌',tags:['捨て札','耐久'],desc:'防御7。選ばれず捨てられた時、防御7＋次カード+10%。',kind:'block',block:7,onDiscard:{block:7,buffNext:.10}},
    discarded_volley:{name:'廃棄斉射',tags:['捨て札','連撃'],desc:'2ダメージ×3。一度捨てられていれば1発5ダメージ。',kind:'damage',hits:3,damage:2,damageIfDiscarded:5},
    scar_counter:{name:'瘢痕反撃',tags:['自傷','反撃','耐久'],desc:'HP2を失い防御10。このターン受けたダメージの55%を返す。',kind:'block',block:10,selfDamage:2,counter:.55},
    blood_recycle:{name:'血流再編',tags:['自傷','循環'],desc:'HP2を失う。山札再構築済みなら次カード+55%、未再構築なら+25%。',kind:'utility',selfDamage:2,buffNext:.25,buffNextIfReshuffle:.55},
    ailment_counter:{name:'症状返し',tags:['状態異常','反撃','耐久'],desc:'防御7。敵が状態異常なら反撃率80%。',kind:'block',block:7,counter:.35,counterIfStatus:.8},
    cycle_barrage_plus:{name:'輪転六射',tags:['循環','連撃'],desc:'1ダメージ×4。山札再構築直後なら×8。',kind:'damage',hits:4,damage:1,hitsIfRecentReshuffle:8},

    tuned_conversion_edge:{name:'調律変成刃',tags:['調律','変換'],desc:'7ダメージ。調律中なら13、役割変換中なら13、両方なら24。',kind:'damage',hits:1,damage:7,damageIfTuned:13,damageIfConverted:13,damageIfConvertedAndTuned:24},
    linked_conversion_edge:{name:'連結変成刃',tags:['連結','変換'],desc:'6ダメージ。連結コンボなら14、役割変換中なら14、両方なら25。',kind:'damage',hits:1,damage:6,damageIfLinkedCombo:14,damageIfConverted:14,damageIfConvertedAndLinked:25},
    style_conversion_guard:{name:'様式変成盾',tags:['スタイル','変換','耐久'],desc:'防御7。派生スタイル選択中なら12。役割変換中なら17。',kind:'block',block:7,blockIfStyle:12,blockIfConverted:17},
    doctrine_conversion:{name:'規格変成砲',tags:['構築規格','変換'],desc:'5ダメージ。構築規格装備中なら12。役割変換中なら18。',kind:'damage',hits:1,damage:5,damageIfDoctrine:12,damageIfConverted:18},
    conversion_salvage:{name:'変成回収',tags:['変換','捨て札','循環'],desc:'5ダメージ。一度捨てられていれば13。役割変換中なら最後の捨て札1枚を山札上へ戻す。',kind:'damage',hits:1,damage:5,discardBoostValue:13,effectIfConverted:'recoverLastDiscard'},
    conversion_crisis:{name:'変成臨界',tags:['変換','自傷','瀕死'],desc:'HP2を失い8ダメージ。HP半分以下なら20。役割変換中なら28。',kind:'damage',hits:1,damage:8,lowHpDamage:20,selfDamage:2,damageIfConverted:28},

    toxin_saw:{name:'毒鋸',tags:['連撃','状態異常'],desc:'2ダメージ×4。毒状態なら1発4ダメージ。',kind:'damage',hits:4,damage:2,damageIfStatus:4},
    ember_guard_plus:{name:'焦炎防陣',tags:['状態異常','耐久'],desc:'防御8＋火傷2。敵に火傷があるなら防御15。',kind:'block',block:8,status:{type:'burn',amount:2},blockIfEnemyBurn:15},
    loop_counter:{name:'輪転反射',tags:['循環','反撃','耐久'],desc:'防御6。山札再構築直後なら防御14・反撃率75%。',kind:'block',block:6,blockIfRecentReshuffle:14,counter:.3,counterIfRecentReshuffle:.75},
    last_scrap:{name:'最後の残片',tags:['捨て札','瀕死'],desc:'7ダメージ。一度捨てられ、かつHP半分以下なら26ダメージ。',kind:'damage',hits:1,damage:7,damageIfDiscardedLowHp:26},
    mixed_reactor:{name:'混成反応炉',tags:['万能','状態異常','循環'],desc:'6ダメージ。敵の状態異常2種類以上かつ山札再構築済みなら22ダメージ。',kind:'damage',hits:1,damage:6,damageIfStatusAndReshuffle:22},
    guard_burst:{name:'防壁破裂',tags:['耐久','反撃'],desc:'防御10。次の敵攻撃を完全防御した時、固定12ダメージを返す。',kind:'block',block:10,fixedCounter:12}
  });
  Object.assign(D.RELICS,{
    conversion_core:{name:'変換核',tags:['変換'],desc:'役割変換中のカード+18%。'},
    split_chamber:{name:'分裂薬室',tags:['変換','連撃'],desc:'分裂変換のカード+20%。'},
    bulwark_joint:{name:'攻防継手',tags:['変換','耐久'],desc:'攻防変換のカード+18%、追加防御+2。'},
    counter_hinge:{name:'反撃蝶番',tags:['変換','反撃'],desc:'反撃変換のカード+18%、反撃率+15ポイント。'},
    residue_vat:{name:'残滓槽',tags:['変換','捨て札'],desc:'残滓変換の捨て札時強化を+10ポイント。'},
    detonation_chamber:{name:'起爆室',tags:['変換','状態異常'],desc:'起爆変換の消費率を40%へ上げる。'},
    blood_seal:{name:'血契印',tags:['変換','自傷'],desc:'血契変換のカード+20%。追加自傷を1軽減。'},
    cycle_ribbon:{name:'循環帯',tags:['変換','循環'],desc:'循環変換のカード+18%。'},
    tuned_converter:{name:'調律変換器',tags:['変換','調律'],desc:'調律と役割変換が同時に設定されたカード+22%。'},
    linked_converter:{name:'連結変換器',tags:['変換','連結'],desc:'連結コンボ中かつ役割変換中のカード+22%。'},
    style_converter:{name:'様式変換鏡',tags:['変換','スタイル'],desc:'派生スタイル選択中、役割変換カード+18%。'},
    doctrine_converter:{name:'規格変換器',tags:['変換','構築規格'],desc:'構築規格装備中、役割変換カード+18%。'}
  });
  Object.assign(D.PROTOCOLS,{
    conversion_overdrive:{name:'変換過駆動規格',tags:['変換'],desc:'役割変換中のカード+22%。未変換カード-5%。',effect:'conversion_overdrive'},
    split_matrix:{name:'分裂行列規格',tags:['変換','連撃'],desc:'分裂変換または4ヒット以上のカード+20%。',effect:'split_matrix'},
    conversion_guard:{name:'変換防衛規格',tags:['変換','耐久','反撃'],desc:'攻防変換・反撃変換のカード+22%。通常攻撃カード-5%。',effect:'conversion_guard'},
    residue_converter:{name:'残滓変換規格',tags:['変換','捨て札'],desc:'残滓変換または捨て札タグのカード+18%。',effect:'residue_converter'},
    blood_converter:{name:'血契変換規格',tags:['変換','自傷'],desc:'血契変換または自傷カード+20%。',effect:'blood_converter'},
    conversion_bridge:{name:'変換架橋規格',tags:['変換','万能'],desc:'役割変換中で2タグ以上のカード+25%。',effect:'conversion_bridge'}
  });
  Object.assign(D.TRAITS,{
    glassrush:{name:'硝走個体',short:'硝走',desc:'速度+0.45・攻撃力×1.20・防御力-2。',effect:'glassrush'},
    rotwall:{name:'腐壁個体',short:'腐壁',desc:'防御力+5・再生力+2・状態異常耐性-10%。',effect:'rotwall'},
    bloodshell:{name:'血殻個体',short:'血殻',desc:'HP×1.20・攻撃力×1.15。',effect:'bloodshell'},
    fluxbeast:{name:'流転個体',short:'流転',desc:'速度+0.30・再生力+2・状態異常耐性+8%。',effect:'fluxbeast'}
  });
  D.V11_CARD_IDS=Object.keys(D.CARDS).filter(id=>!before.cards.has(id));
  D.V11_RELIC_IDS=Object.keys(D.RELICS).filter(id=>!before.relics.has(id));
  D.V11_TRAIT_IDS=Object.keys(D.TRAITS).filter(id=>!before.traits.has(id));
  D.V11_PROTOCOL_IDS=Object.keys(D.PROTOCOLS).filter(id=>!before.protocols.has(id));
})();
