'use strict';
(function(){
  const BL=window.BuildLab; const D=BL.Data;
  const before={cards:new Set(Object.keys(D.CARDS)),relics:new Set(Object.keys(D.RELICS)),protocols:new Set(Object.keys(D.PROTOCOLS))};

  Object.assign(D.CARDS,{
    // 捨て札
    v18_residue_cannon:{name:'残滓砲',tags:['捨て札','万能'],desc:'8ダメージ。一度選ばれず捨てられていれば26ダメージ。',kind:'damage',hits:1,damage:8,damageIfDiscarded:26},
    v18_ash_guard:{name:'灰滓防陣',tags:['捨て札','耐久'],desc:'防御9。選ばれず捨てられた時、防御6。',kind:'block',block:9,onDiscard:{block:6}},
    v18_salvage_venom:{name:'回収毒札',tags:['捨て札','循環','状態異常'],desc:'毒4。最後に捨てられたカードを山札の上へ戻す。',kind:'utility',status:{type:'poison',amount:4},effect:'recoverLastDiscard'},

    // 連撃
    v18_sevenfold_pierce:{name:'七重穿ち',tags:['連撃'],desc:'2ダメージ×7。',kind:'damage',hits:7,damage:2},
    v18_venom_chain:{name:'毒鎖連針',tags:['連撃','状態異常'],desc:'1ダメージ×7。命中ごとに毒1。',kind:'damage',hits:7,damage:1,perHitStatus:{type:'poison',amount:1}},
    v18_guard_volley:{name:'城塞斉射',tags:['連撃','耐久'],desc:'2ダメージ×4＋防御8。',kind:'hybrid',hits:4,damage:2,block:8},

    // 状態異常
    v18_toxic_brand:{name:'劇毒刻印',tags:['状態異常'],desc:'5ダメージ＋毒7。',kind:'damage',hits:1,damage:5,status:{type:'poison',amount:7}},
    v18_burning_shell:{name:'灼殻防壁',tags:['状態異常','耐久'],desc:'防御10＋火傷4。',kind:'block',block:10,status:{type:'burn',amount:4}},
    v18_symptom_hammer:{name:'多症破砕槌',tags:['状態異常','万能'],desc:'7ダメージ。敵の状態異常種類数1つにつき+7ダメージ。',kind:'damage',hits:1,damage:7,damagePerStatusType:7},

    // 耐久・反撃
    v18_counter_wall:{name:'反照城壁',tags:['耐久','反撃'],desc:'防御10。反撃率25%。',kind:'block',block:10,counter:.25},
    v18_late_bastion:{name:'長期要塞',tags:['耐久'],desc:'防御10。5ターン目以降なら防御25。',kind:'block',block:10,blockIfTurnMin:{turn:5,value:25}},
    v18_regen_barrier:{name:'再生遮断壁',tags:['耐久','状態異常'],desc:'防御9。敵の再生力が4以上なら防御22。',kind:'block',block:9,blockIfEnemyRegenMin:{min:4,value:22}},

    // 自傷・瀕死
    v18_blood_breaker:{name:'血脈破城槌',tags:['自傷'],desc:'HP3を失い24ダメージ。',kind:'damage',hits:1,damage:24,selfDamage:3},
    v18_crisis_storm:{name:'臨界暴雨',tags:['自傷','瀕死','連撃'],desc:'HP2を失い2ダメージ×5。HP半分以下なら×9。',kind:'damage',hits:5,damage:2,lowHpHits:9,selfDamage:2},
    v18_scar_fort:{name:'瘢痕要塞',tags:['自傷','耐久'],desc:'HP2を失い防御15。',kind:'block',block:15,selfDamage:2},

    // 循環
    v18_return_spear:{name:'帰環槍',tags:['循環'],desc:'8ダメージ。山札再構築直後なら25ダメージ。',kind:'damage',hits:1,damage:8,damageIfRecentReshuffle:25},
    v18_return_guard:{name:'帰環大盾',tags:['循環','耐久'],desc:'防御9。山札再構築直後なら防御24。',kind:'block',block:9,blockIfRecentReshuffle:24},
    v18_cycle_burn:{name:'輪転火印',tags:['循環','状態異常'],desc:'火傷3。山札再構築直後なら火傷10。',kind:'utility',status:{type:'burn',amount:3},statusIfRecentReshuffle:10},

    // 既存メタ要素との橋渡し
    v18_style_strike:{name:'様式転刃 III',tags:['スタイル','万能'],desc:'8ダメージ。派生スタイル使用中なら24ダメージ。',kind:'damage',hits:1,damage:8,damageIfStyle:24},
    v18_tuning_bastion:{name:'調律城塞 III',tags:['調律','耐久'],desc:'防御8。調律中なら防御23。',kind:'block',block:8,blockIfTuned:23},
    v18_conversion_lance:{name:'変成穿槍 III',tags:['変換','万能'],desc:'8ダメージ。役割変換中なら24ダメージ。',kind:'damage',hits:1,damage:8,damageIfConverted:24},
    v18_link_surge:{name:'連結奔流 III',tags:['連結','連撃'],desc:'2ダメージ×3。連結コンボなら×9。',kind:'damage',hits:3,damage:2,hitsIfLinkedCombo:9},
    v18_doctrine_guard:{name:'規格防衛 III',tags:['構築規格','耐久'],desc:'防御8。構築規格を装備中なら防御22。',kind:'block',block:8,blockIfDoctrine:22},
    v18_behavior_hammer:{name:'異相破砕槌 III',tags:['複合挙動','万能'],desc:'9ダメージ。敵に複合挙動があるなら28ダメージ。',kind:'damage',hits:1,damage:9,damageIfEnemyBehavior:28}
  });

  Object.assign(D.RELICS,{
    v18_discard_core:{name:'残滓増幅核 V',tags:['捨て札'],desc:'捨て札タグのカード基本効果+19%。'},
    v18_multi_core:{name:'多段増幅核 V',tags:['連撃'],desc:'連撃タグのカード基本効果+19%。'},
    v18_status_core:{name:'症状増幅核 V',tags:['状態異常'],desc:'状態異常タグのカード基本効果+19%。'},
    v18_guard_core:{name:'堅守増幅核 V',tags:['耐久'],desc:'耐久タグのカード基本効果+19%。'},
    v18_blood_core:{name:'血脈増幅核 V',tags:['自傷'],desc:'自傷タグのカード基本効果+21%。'},
    v18_cycle_core:{name:'循環増幅核 V',tags:['循環'],desc:'循環タグのカード基本効果+19%。'},
    v18_style_relay:{name:'様式共鳴器 III',tags:['スタイル'],desc:'派生スタイル使用中、全カード基本効果+14%。'},
    v18_tuning_relay:{name:'調律共鳴器 III',tags:['調律'],desc:'調律中カード基本効果+24%。'},
    v18_conversion_relay:{name:'変成共鳴器 III',tags:['変換'],desc:'役割変換中カード基本効果+24%。'},
    v18_link_relay:{name:'連結共鳴器 III',tags:['連結'],desc:'連結ペアのカード基本効果+22%。'},
    v18_doctrine_relay:{name:'規格共鳴器 III',tags:['構築規格'],desc:'構築規格使用中、全カード基本効果+14%。'},
    v18_behavior_relay:{name:'異相共鳴器 III',tags:['複合挙動'],desc:'敵に複合挙動がある時、全カード基本効果+18%。'}
  });

  Object.assign(D.PROTOCOLS,{
    v18_p_discard:{name:'残滓集中規格 V',tags:['捨て札'],desc:'捨て札タグ+21%。それ以外-6%。',effect:'v18_discard'},
    v18_p_multi:{name:'多段集中規格 V',tags:['連撃'],desc:'連撃タグ+21%。それ以外-6%。',effect:'v18_multi'},
    v18_p_status:{name:'症状集中規格 V',tags:['状態異常'],desc:'状態異常タグ+21%。それ以外-6%。',effect:'v18_status'},
    v18_p_guard:{name:'堅守集中規格 V',tags:['耐久'],desc:'耐久タグ+21%。それ以外-6%。',effect:'v18_guard'},
    v18_p_blood:{name:'血脈集中規格 V',tags:['自傷'],desc:'自傷タグ+23%。それ以外-6%。',effect:'v18_blood'},
    v18_p_cycle:{name:'循環集中規格 V',tags:['循環'],desc:'循環タグ+21%。それ以外-6%。',effect:'v18_cycle'}
  });

  D.V14_RELIC_RULES=Object.assign(D.V14_RELIC_RULES||{}, {
    v18_discard_core:{tag:'捨て札',mult:1.19},v18_multi_core:{tag:'連撃',mult:1.19},v18_status_core:{tag:'状態異常',mult:1.19},v18_guard_core:{tag:'耐久',mult:1.19},v18_blood_core:{tag:'自傷',mult:1.21},v18_cycle_core:{tag:'循環',mult:1.19},
    v18_style_relay:{altStyle:true,mult:1.14},v18_tuning_relay:{tuned:true,mult:1.24},v18_conversion_relay:{converted:true,mult:1.24},v18_link_relay:{linkedCard:true,mult:1.22},v18_doctrine_relay:{mult:1.14},v18_behavior_relay:{enemyBehavior:true,mult:1.18}
  });
  // 構築規格共鳴器だけは規格有無を戦闘側で扱えるよう、専用条件を後付けする。
  D.V14_RELIC_RULES.v18_doctrine_relay.doctrine=true;
  D.V14_PROTOCOL_RULES=Object.assign(D.V14_PROTOCOL_RULES||{}, {
    v18_p_discard:{tags:['捨て札'],single:1.21,double:1.21,miss:.94},v18_p_multi:{tags:['連撃'],single:1.21,double:1.21,miss:.94},v18_p_status:{tags:['状態異常'],single:1.21,double:1.21,miss:.94},v18_p_guard:{tags:['耐久'],single:1.21,double:1.21,miss:.94},v18_p_blood:{tags:['自傷'],single:1.23,double:1.23,miss:.94},v18_p_cycle:{tags:['循環'],single:1.21,double:1.21,miss:.94}
  });

  D.V18_CARD_IDS=Object.keys(D.CARDS).filter(id=>!before.cards.has(id));
  D.V18_RELIC_IDS=Object.keys(D.RELICS).filter(id=>!before.relics.has(id));
  D.V18_PROTOCOL_IDS=Object.keys(D.PROTOCOLS).filter(id=>!before.protocols.has(id));
})();
