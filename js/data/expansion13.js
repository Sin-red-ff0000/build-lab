'use strict';
(function(){
  const BL=window.BuildLab; const D=BL.Data;
  const before={cards:new Set(Object.keys(D.CARDS)),relics:new Set(Object.keys(D.RELICS)),protocols:new Set(Object.keys(D.PROTOCOLS))};

  D.LINK_MODES={
    reciprocal:{id:'reciprocal',name:'双方向連結',desc:'A→B / B→Aのどちらでも連結コンボ。基本効果×1.35。',mult:1.35,default:true},
    forward:{id:'forward',name:'順接連結',desc:'A→Bだけが連結コンボ。成立時の基本効果×1.65。',mult:1.65,direction:'forward'},
    reverse:{id:'reverse',name:'逆接連結',desc:'B→Aだけが連結コンボ。成立時の基本効果×1.65。',mult:1.65,direction:'reverse'},
    bridge:{id:'bridge',name:'異種架橋',desc:'両方向で成立。基本効果×1.30。A/Bに共通タグが無い場合はさらに×1.20。',mult:1.30,bridge:true}
  };

  Object.assign(D.CARDS,{
    forward_lance:{name:'順接槍',tags:['連結','万能'],desc:'7ダメージ。順方向(A→B)の連結コンボなら25ダメージ。',kind:'damage',hits:1,damage:7,damageIfLinkForward:25},
    forward_wall:{name:'順接壁',tags:['連結','耐久'],desc:'防御7。順方向(A→B)の連結コンボなら防御20。',kind:'block',block:7,blockIfLinkForward:20},
    forward_flurry:{name:'順接乱舞',tags:['連結','連撃'],desc:'2ダメージ×3。順方向(A→B)なら×8。',kind:'damage',hits:3,damage:2,hitsIfLinkForward:8},
    reverse_edge:{name:'逆接刃',tags:['連結','万能'],desc:'7ダメージ。逆方向(B→A)の連結コンボなら25ダメージ。',kind:'damage',hits:1,damage:7,damageIfLinkReverse:25},
    reverse_guard:{name:'逆接防陣',tags:['連結','耐久'],desc:'防御7。逆方向(B→A)の連結コンボなら防御20。',kind:'block',block:7,blockIfLinkReverse:20},
    bridge_burst:{name:'架橋砲',tags:['連結','万能'],desc:'8ダメージ。異種架橋モードの連結コンボなら23ダメージ。',kind:'damage',hits:1,damage:8,damageIfLinkBridge:23},

    residue_fang:{name:'残滓牙',tags:['捨て札','万能'],desc:'7ダメージ。一度選ばれず捨てられていれば18ダメージ。',kind:'damage',hits:1,damage:7,damageIfDiscarded:18},
    residue_shell:{name:'残滓殻',tags:['捨て札','耐久'],desc:'防御6。選ばれず捨てられた時、防御6を得る。',kind:'block',block:6,onDiscard:{block:6}},
    residue_needle:{name:'残滓毒針',tags:['捨て札','状態異常'],desc:'3ダメージ＋毒2。選ばれず捨てられた時、毒3を付与。',kind:'damage',hits:1,damage:3,status:{type:'poison',amount:2},onDiscard:{status:'poison',amount:3}},

    v13_sixfold_cut:{name:'六重切',tags:['連撃'],desc:'2ダメージ×6。',kind:'damage',hits:6,damage:2},
    pressure_rush:{name:'圧力連打',tags:['連撃','状態異常'],desc:'2ダメージ×4。敵が状態異常なら×7。',kind:'damage',hits:4,damage:2,conditionalHits:7},
    echo_flurry:{name:'反響連斬',tags:['連撃','循環'],desc:'2ダメージ×3。山札再構築直後なら×7。',kind:'damage',hits:3,damage:2,hitsIfRecentReshuffle:7},

    venom_brand:{name:'毒蝕刻印',tags:['状態異常'],desc:'5ダメージ＋毒4。',kind:'damage',hits:1,damage:5,status:{type:'poison',amount:4}},
    ember_mesh:{name:'火網',tags:['状態異常','耐久'],desc:'防御7＋火傷3。',kind:'block',block:7,status:{type:'burn',amount:3}},
    symptom_edge:{name:'症状刃',tags:['状態異常','万能'],desc:'6ダメージ。敵が状態異常なら17ダメージ。',kind:'damage',hits:1,damage:6,damageIfStatus:17},

    iron_return:{name:'鉄返し',tags:['耐久','反撃'],desc:'防御10・反撃率45%。',kind:'block',block:10,counter:.45},
    sealed_wall:{name:'封鎖壁',tags:['耐久'],desc:'防御13。',kind:'block',block:13},
    patient_edge:{name:'忍耐刃',tags:['耐久','万能'],desc:'5ダメージ。4ターン目以降なら18ダメージ。',kind:'damage',hits:1,damage:5,damageIfTurnMin:{turn:4,value:18}},

    scar_spear:{name:'瘢痕槍',tags:['自傷'],desc:'HP3を失い18ダメージ。',kind:'damage',hits:1,damage:18,selfDamage:3},
    crisis_shell:{name:'臨界殻',tags:['自傷','瀕死','耐久'],desc:'HP2を失い防御9。HP半分以下なら防御19。',kind:'block',block:9,lowHpBlock:19,selfDamage:2},
    blood_rain:{name:'血雨',tags:['自傷','連撃'],desc:'HP3を失い3ダメージ×5。',kind:'damage',hits:5,damage:3,selfDamage:3},

    return_blade:{name:'帰還刃',tags:['循環'],desc:'7ダメージ。山札再構築直後なら19ダメージ。',kind:'damage',hits:1,damage:7,damageIfRecentReshuffle:19},
    return_wall:{name:'帰還壁',tags:['循環','耐久'],desc:'防御7。山札再構築直後なら防御18。',kind:'block',block:7,blockIfRecentReshuffle:18},
    cycle_poison:{name:'輪転毒',tags:['循環','状態異常'],desc:'毒3。山札再構築直後なら毒8。',kind:'utility',status:{type:'poison',amount:3},statusIfRecentReshuffle:8}
  });

  Object.assign(D.RELICS,{
    v13_link_scope:{name:'連結測距器',tags:['連結'],desc:'連結コンボ中のカード基本効果+15%。'},
    v13_forward_core:{name:'順接核',tags:['連結'],desc:'順接連結モードでA→Bを成立させる時、基本効果+20%。'},
    v13_reverse_core:{name:'逆接核',tags:['連結'],desc:'逆接連結モードでB→Aを成立させる時、基本効果+20%。'},
    v13_bridge_core:{name:'架橋核',tags:['連結','万能'],desc:'異種架橋モードかつA/Bに共通タグが無い時、基本効果+20%。'},
    v13_discard_core:{name:'残滓増幅器',tags:['捨て札'],desc:'捨て札タグのカード基本効果+15%。'},
    v13_multi_core:{name:'多段増幅器',tags:['連撃'],desc:'連撃タグのカード基本効果+15%。'},
    v13_status_core:{name:'症状増幅器',tags:['状態異常'],desc:'状態異常タグのカード基本効果+15%。'},
    v13_guard_core:{name:'防衛増幅器',tags:['耐久'],desc:'耐久タグのカード基本効果+15%。'},
    v13_blood_core:{name:'血契増幅器',tags:['自傷'],desc:'自傷タグのカード基本効果+17%。'},
    v13_cycle_core:{name:'循環増幅器',tags:['循環'],desc:'循環タグのカード基本効果+15%。'},
    v13_style_link:{name:'様式継電器',tags:['スタイル','連結'],desc:'派生スタイル使用中の連結カード基本効果+18%。'},
    v13_convert_link:{name:'変換継電器',tags:['変換','連結'],desc:'役割変換中の連結カード基本効果+18%。'}
  });

  Object.assign(D.PROTOCOLS,{
    v13_discard_link:{name:'残滓連結規格',tags:['捨て札','連結'],desc:'捨て札または連結タグのカード+12%。両方なら+28%。',effect:'v13_discard_link'},
    v13_multi_link:{name:'多段連結規格',tags:['連撃','連結'],desc:'連撃または連結タグのカード+12%。両方なら+28%。',effect:'v13_multi_link'},
    v13_status_link:{name:'症状連結規格',tags:['状態異常','連結'],desc:'状態異常または連結タグのカード+12%。両方なら+28%。',effect:'v13_status_link'},
    v13_guard_link:{name:'防衛連結規格',tags:['耐久','連結'],desc:'耐久または連結タグのカード+12%。両方なら+28%。',effect:'v13_guard_link'},
    v13_blood_link:{name:'血契連結規格',tags:['自傷','連結'],desc:'自傷または連結タグのカード+12%。両方なら+28%。',effect:'v13_blood_link'},
    v13_cycle_link:{name:'循環連結規格',tags:['循環','連結'],desc:'循環または連結タグのカード+12%。両方なら+28%。',effect:'v13_cycle_link'}
  });

  D.V13_RELIC_RULES={
    v13_link_scope:{linked:true,mult:1.15},v13_forward_core:{mode:'forward',direction:'forward',mult:1.20},v13_reverse_core:{mode:'reverse',direction:'reverse',mult:1.20},v13_bridge_core:{mode:'bridge',bridgeDisjoint:true,mult:1.20},
    v13_discard_core:{tag:'捨て札',mult:1.15},v13_multi_core:{tag:'連撃',mult:1.15},v13_status_core:{tag:'状態異常',mult:1.15},v13_guard_core:{tag:'耐久',mult:1.15},v13_blood_core:{tag:'自傷',mult:1.17},v13_cycle_core:{tag:'循環',mult:1.15},
    v13_style_link:{tag:'連結',altStyle:true,mult:1.18},v13_convert_link:{tag:'連結',converted:true,mult:1.18}
  };
  D.V13_PROTOCOL_RULES={
    v13_discard_link:{tags:['捨て札','連結']},v13_multi_link:{tags:['連撃','連結']},v13_status_link:{tags:['状態異常','連結']},v13_guard_link:{tags:['耐久','連結']},v13_blood_link:{tags:['自傷','連結']},v13_cycle_link:{tags:['循環','連結']}
  };

  D.V13_CARD_IDS=Object.keys(D.CARDS).filter(id=>!before.cards.has(id));
  D.V13_RELIC_IDS=Object.keys(D.RELICS).filter(id=>!before.relics.has(id));
  D.V13_PROTOCOL_IDS=Object.keys(D.PROTOCOLS).filter(id=>!before.protocols.has(id));
})();
