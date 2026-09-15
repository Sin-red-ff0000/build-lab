'use strict';
(function(){
  const BL = window.BuildLab = window.BuildLab || {};
  const D = BL.Data = {};

  D.CHARACTERS = {
    standard:{id:'standard',name:'センター',role:'スタンダード',hp:70,desc:'提示された中央枠のカードを選ぶと、そのカードを2回発動する。'},
    combo:{id:'combo',name:'パルス',role:'連撃・状態異常',hp:62,desc:'1枚のカードが2回目以降のダメージを与えるたび、ランダムな状態異常を1付与する。'},
    tank:{id:'tank',name:'フォート',role:'耐久・成長',hp:86,desc:'敵ターン終了時に生存していた場合、そのターン使用したカード1枚を戦闘中だけ強化版へ変化させる。同じ実体のカードは1度まで。'}
  };

  D.CARDS = {
    discard_blade:{name:'捨て身の刃',tags:['捨て札'],desc:'8ダメージ。以前「選ばれず捨てられていた」なら16ダメージ。',kind:'damage',hits:1,damage:8,discardBoost:true},
    parting_gift:{name:'置き土産',tags:['捨て札','防御'],desc:'防御7。選ばれず捨てられた時、防御4を得る。',kind:'block',block:7,onDiscard:{block:4}},
    embers:{name:'埋火',tags:['捨て札','状態異常'],desc:'5ダメージ。選ばれず捨てられた時、敵に火傷2。',kind:'damage',hits:1,damage:5,onDiscard:{status:'burn',amount:2}},
    selection:{name:'選別',tags:['捨て札','循環'],desc:'捨て札から最後の1枚を次ターンの提示へ予約する。',kind:'utility',effect:'selection'},
    double_strike:{name:'双撃',tags:['連撃'],desc:'4ダメージ×2。',kind:'damage',hits:2,damage:4},
    needle_rain:{name:'針雨',tags:['連撃'],desc:'2ダメージ×5。',kind:'damage',hits:5,damage:2},
    follow_up:{name:'追撃',tags:['連撃','状態異常'],desc:'3ダメージ×2。敵が状態異常なら×4。',kind:'damage',hits:2,damage:3,conditionalHits:4},
    accelerated_slash:{name:'加速連斬',tags:['連撃'],desc:'3ダメージ×3。前ターンも攻撃カードなら×5。',kind:'damage',hits:3,damage:3,prevAttackHits:5},
    poison_needle:{name:'毒針',tags:['状態異常'],desc:'4ダメージ＋毒3。',kind:'damage',hits:1,damage:4,status:{type:'poison',amount:3}},
    brand:{name:'焼印',tags:['状態異常'],desc:'6ダメージ＋火傷3。',kind:'damage',hits:1,damage:6,status:{type:'burn',amount:3}},
    break:{name:'崩し',tags:['状態異常'],desc:'4ダメージ＋脆弱1。脆弱中は次のカードの与ダメージ+50%。',kind:'damage',hits:1,damage:4,status:{type:'vulnerable',amount:1}},
    weakening_mist:{name:'衰弱の霧',tags:['状態異常','耐久'],desc:'敵に弱体1。次の敵行動の攻撃力-30%。',kind:'utility',status:{type:'weak',amount:1}},
    wall:{name:'防壁',tags:['耐久'],desc:'防御9。',kind:'block',block:9},
    counter_stance:{name:'反撃姿勢',tags:['耐久','反撃'],desc:'防御6。このターン被ダメージ時、受けたダメージの70%を返す。',kind:'block',block:6,counter:.7},
    parry:{name:'受け流し',tags:['耐久','循環'],desc:'防御5。敵攻撃を完全防御すると、このカードを山札へ戻す。',kind:'block',block:5,returnIfFullBlock:true},
    last_stand_shield:{name:'背水の盾',tags:['耐久','瀕死'],desc:'防御5。HP半分以下なら防御12。',kind:'block',block:5,lowHpBlock:12},
    blood_blade:{name:'血刃',tags:['自傷'],desc:'HP3を失い12ダメージ。この戦闘で一度でもHPを回復していれば18ダメージ。',kind:'damage',hits:1,damage:12,damageIfRecovered:18,selfDamage:3},
    blood_contract:{name:'血の契約',tags:['自傷','万能'],desc:'HP3を失う。次に使うカードの効果+25%。この戦闘で一度でもHPを回復していれば+35%。',kind:'utility',selfDamage:3,buffNext:.25,buffNextIfRecovered:.35},
    dying_blow:{name:'瀕死の一撃',tags:['瀕死'],desc:'7ダメージ。HP半分以下なら18ダメージ。',kind:'damage',hits:1,damage:7,lowHpDamage:18},
    blood_chain:{name:'血の連鎖',tags:['自傷','連撃'],desc:'HP2を失い3ダメージ×3。HPの増減方向を2回以上切り替えた戦闘では×4。',kind:'damage',hits:3,damage:3,selfDamage:2,hitsIfHpDirectionSwitches:{min:2,value:4}},
    rebuild:{name:'再編',tags:['循環'],desc:'捨て札を山札へ戻して再構築。次のカードの効果+35%。',kind:'utility',effect:'rebuild',buffNext:.35},
    fast_forward:{name:'早回し',tags:['循環','捨て札'],desc:'山札からランダムに2枚を捨て札へ送る。',kind:'utility',effect:'mill2'},
    recall:{name:'呼び戻し',tags:['循環'],desc:'最後に捨てられたカードを次ターンの提示へ予約。',kind:'utility',effect:'recall'},
    adversity_recovery:{name:'逆境回収',tags:['循環','瀕死'],desc:'HP半分以下なら、捨て札2枚を山札へ戻す。',kind:'utility',effect:'adversity'},

    // v0.2: 初期カード追加（+12）
    scarlet_bulwark:{name:'鮮血防壁',tags:['自傷','耐久'],desc:'HP2を失い、防御8。この戦闘で一度でもHPを回復していれば防御12。',kind:'block',block:8,blockIfRecovered:12,selfDamage:2},
    toxic_barrage:{name:'毒散弾',tags:['連撃','状態異常'],desc:'2ダメージ×3＋毒2。',kind:'damage',hits:3,damage:2,status:{type:'poison',amount:2}},
    searing_flurry:{name:'焦熱乱舞',tags:['連撃','状態異常'],desc:'2ダメージ×4＋火傷2。',kind:'damage',hits:4,damage:2,status:{type:'burn',amount:2}},
    cycle_edge:{name:'循環刃',tags:['循環'],desc:'6ダメージ。直前ターンに山札を再構築していたなら14ダメージ。',kind:'damage',hits:1,damage:6,damageIfRecentReshuffle:14},
    discarded_shell:{name:'捨殻',tags:['捨て札','耐久'],desc:'防御6。選ばれず捨てられた時も防御6を得る。',kind:'block',block:6,onDiscard:{block:6}},
    fading_venom:{name:'残毒',tags:['捨て札','状態異常'],desc:'5ダメージ。選ばれず捨てられた時、毒2。',kind:'damage',hits:1,damage:5,onDiscard:{status:'poison',amount:2}},
    adversity_wall:{name:'逆境防壁',tags:['耐久','瀕死'],desc:'防御7。HP半分以下なら防御15。',kind:'block',block:7,lowHpBlock:15},
    venom_burst:{name:'毒爆',tags:['状態異常'],desc:'6ダメージ。敵の毒をすべて消費し、消費した毒×2を追加ダメージ。',kind:'damage',hits:1,damage:6,consumeStatus:{type:'poison',ratio:2}},
    ember_burst:{name:'灰燼爆破',tags:['状態異常'],desc:'6ダメージ。敵の火傷をすべて消費し、消費した火傷×2を追加ダメージ。',kind:'damage',hits:1,damage:6,consumeStatus:{type:'burn',ratio:2}},
    narrow_shot:{name:'狭窄射',tags:['提示'],desc:'6ダメージ。提示枚数が2枚以下なら18ダメージ。',kind:'damage',hits:1,damage:6,damageIfPromptMax:{max:2,value:18}},
    spread_shot:{name:'展開射',tags:['提示'],desc:'7ダメージ。提示枚数が4枚以上なら15ダメージ。',kind:'damage',hits:1,damage:7,damageIfPromptMin:{min:4,value:15}},
    afterguard:{name:'残心',tags:['耐久','連撃'],desc:'防御8。直前に攻撃カードを使っていたなら防御12。',kind:'block',block:8,blockIfPrevAttack:12},


    // v0.3: 初期カード大量追加（+36）
    shard_shot:{name:'破片射ち',tags:['捨て札'],desc:'7ダメージ。選ばれず捨てられた時、敵に5ダメージ。',kind:'damage',hits:1,damage:7,onDiscard:{damage:5}},
    emergency_cache:{name:'非常備蓄',tags:['捨て札','耐久'],desc:'防御6。選ばれず捨てられた時、HP2回復。',kind:'block',block:6,onDiscard:{heal:2}},
    volatile_ash:{name:'爆ぜる灰',tags:['捨て札','状態異常'],desc:'3ダメージ＋火傷2。選ばれず捨てられた時、火傷3。',kind:'damage',hits:1,damage:3,status:{type:'burn',amount:2},onDiscard:{status:'burn',amount:3}},
    toxin_residue:{name:'毒の残滓',tags:['捨て札','状態異常'],desc:'3ダメージ＋毒2。選ばれず捨てられた時、毒3。',kind:'damage',hits:1,damage:3,status:{type:'poison',amount:2},onDiscard:{status:'poison',amount:3}},
    scavenger_cut:{name:'拾い刃',tags:['捨て札'],desc:'6ダメージ。このカードが一度でも捨てられていれば14ダメージ。',kind:'damage',hits:1,damage:6,discardBoostValue:14},
    abandoned_guard:{name:'置き去りの盾',tags:['捨て札','耐久'],desc:'防御5。このカードが一度でも捨てられていれば防御13。',kind:'block',block:5,discardBlockBoost:13},

    triple_cut:{name:'三段斬り',tags:['連撃'],desc:'3ダメージ×3。',kind:'damage',hits:3,damage:3},
    echo_barrage:{name:'残響連射',tags:['連撃'],desc:'2ダメージ×4。直前も多段攻撃なら1発3ダメージ。',kind:'damage',hits:4,damage:2,damageIfPrevMulti:3},
    puncture_chain:{name:'穿孔連鎖',tags:['連撃'],desc:'2ダメージ×5。防御力を30%無視。',kind:'damage',hits:5,damage:2,armorPierce:.3},
    toxic_needles:{name:'毒針連射',tags:['連撃','状態異常'],desc:'1ダメージ×4。各ヒットで毒1。',kind:'damage',hits:4,damage:1,perHitStatus:{type:'poison',amount:1}},
    ember_needles:{name:'火針連射',tags:['連撃','状態異常'],desc:'1ダメージ×4。各ヒットで火傷1。',kind:'damage',hits:4,damage:1,perHitStatus:{type:'burn',amount:1}},
    combo_guard:{name:'連防',tags:['連撃','耐久'],desc:'2ダメージ×2＋防御6。',kind:'hybrid',hits:2,damage:2,block:6},

    contamination:{name:'複合汚染',tags:['状態異常'],desc:'敵に毒2と火傷2。',kind:'utility',statuses:[{type:'poison',amount:2},{type:'burn',amount:2}]},
    plague_blade:{name:'疫刃',tags:['状態異常'],desc:'5ダメージ。敵に付いている状態異常の種類1つにつき+5ダメージ。',kind:'damage',hits:1,damage:5,damagePerStatusType:5},
    toxic_guard:{name:'毒障壁',tags:['状態異常','耐久'],desc:'防御7＋毒2。',kind:'block',block:7,status:{type:'poison',amount:2}},
    burning_guard:{name:'火障壁',tags:['状態異常','耐久'],desc:'防御7＋火傷2。',kind:'block',block:7,status:{type:'burn',amount:2}},
    weakening_brand:{name:'衰弱の刻印',tags:['状態異常'],desc:'5ダメージ＋弱体1。',kind:'damage',hits:1,damage:5,status:{type:'weak',amount:1}},
    status_detonator:{name:'症状爆砕',tags:['状態異常'],desc:'4ダメージ。敵の状態異常合計値1につき+1ダメージ。',kind:'damage',hits:1,damage:4,damagePerTotalStatus:1},

    fortress_strike:{name:'城塞打ち',tags:['耐久','反撃'],desc:'6ダメージ＋防御7。このターン被ダメージ時、受けたダメージの25%を返す。',kind:'hybrid',damage:6,block:7,counter:.25},
    iron_echo:{name:'鉄響',tags:['耐久'],desc:'防御7。直前も防御カードなら防御13。',kind:'block',block:7,blockIfPrevBlock:13},
    counter_cut:{name:'返し刃',tags:['耐久','反撃'],desc:'4ダメージ＋防御4。このターン被ダメージ時、受けたダメージの50%を返す。',kind:'hybrid',damage:4,block:4,counter:.5},
    patient_guard:{name:'待ち構え',tags:['耐久','反撃'],desc:'防御8。4ターン目以降なら防御15。このターン被ダメージ時、受けたダメージの30%を返す。',kind:'block',block:8,blockIfTurnMin:{turn:4,value:15},counter:.3},
    blood_armor:{name:'血鎧',tags:['自傷','耐久','反撃'],desc:'HP2を失い、防御9。このターン被ダメージ時、敵に4ダメージ。危険域から一度復帰していれば防御12・迎撃6。',kind:'block',block:9,blockIfHpRecovery:12,selfDamage:2,fixedCounter:4,fixedCounterIfHpRecovery:6},
    recovery_guard:{name:'生還姿勢',tags:['耐久','瀕死','自傷'],desc:'防御6。HP半分以下ならHP4回復。自傷を経験してから回復した場合、次の自傷カードの効果+12%。',kind:'block',block:6,healIfLowHp:4,buffNextSelfDamageAfterHeal:.12},

    sacrificial_combo:{name:'供犠連撃',tags:['自傷','連撃'],desc:'HP4を失い、5ダメージ×3。',kind:'damage',hits:3,damage:5,selfDamage:4},
    crimson_focus:{name:'紅の集中',tags:['自傷','万能'],desc:'HP3を失う。次に使うカードの効果+80%。',kind:'utility',selfDamage:3,buffNext:.8},
    brink_blast:{name:'臨界撃',tags:['自傷','瀕死'],desc:'HP2を失い10ダメージ。HP半分以下なら26ダメージ。',kind:'damage',hits:1,damage:10,lowHpDamage:26,selfDamage:2},
    pain_reflex:{name:'痛覚反射',tags:['自傷','耐久'],desc:'HP2を失い、防御7。直前にHPを回復していれば防御11。次の自傷カードの効果+18%。',kind:'block',block:7,blockIfLastHpDirectionUp:11,selfDamage:2,buffNextSelfDamage:.18},
    blood_poison:{name:'血毒',tags:['自傷','状態異常'],desc:'HP3を失い、毒6。',kind:'utility',selfDamage:3,status:{type:'poison',amount:6}},
    red_cycle:{name:'赤い循環',tags:['自傷','循環'],desc:'HP2を失う。捨て札から1枚を山札の上へ戻す。HPの増減方向を2回以上切り替えた戦闘では最大2枚を戻す。',kind:'utility',selfDamage:2,effect:'recoverBloodDiscard'},

    wheel_cut:{name:'輪転斬',tags:['循環'],desc:'6ダメージ。山札再構築1回につき+5ダメージ。',kind:'damage',hits:1,damage:6,damagePerReshuffle:5},
    cycle_guard:{name:'循環防壁',tags:['循環','耐久'],desc:'防御7。山札再構築1回につき防御+4。',kind:'block',block:7,blockPerReshuffle:4},
    bottom_feed:{name:'底さらい',tags:['循環'],desc:'5ダメージ。山札が2枚以下なら16ダメージ。',kind:'damage',hits:1,damage:5,damageIfDrawMax:{max:2,value:16}},
    recycle_guard:{name:'回生盾',tags:['循環','耐久'],desc:'防御7。直前に捨てられたカード1枚を山札の上へ戻す。',kind:'block',block:7,effect:'recoverLastDiscard'},
    rapid_rebuild:{name:'急速再編',tags:['循環'],desc:'捨て札と除外中のカードを山札へ戻して再構築する。',kind:'utility',effect:'rebuild'},
    echo_return:{name:'再来撃',tags:['循環','連撃'],desc:'5ダメージ。直前ターンに山札再構築していたなら2回攻撃。',kind:'damage',hits:1,damage:5,hitsIfRecentReshuffle:2},

    long_battle:{name:'長期戦',tags:['耐久','循環'],desc:'防御8。山札を一度以上再構築済みならHP3回復。',kind:'block',block:8,healIfReshuffle:3},
    aged_poison:{name:'熟成毒',tags:['状態異常','循環'],desc:'毒3。山札を一度以上再構築済みなら毒7。',kind:'utility',status:{type:'poison',amount:3},reshuffleStatus:7},
    intercept:{name:'迎撃',tags:['耐久','反撃'],desc:'防御6。このターン被ダメージ時、敵に10ダメージ。',kind:'block',block:6,fixedCounter:10},
    blood_return:{name:'血の返礼',tags:['自傷','瀕死'],desc:'HP4を失い12ダメージ。HP半分以下なら20ダメージ。',kind:'damage',hits:1,damage:12,lowHpDamage:20,selfDamage:4},
    drill_flurry:{name:'穿孔乱舞',tags:['連撃','状態異常'],desc:'2ダメージ×4。敵が状態異常なら防御力の50%を無視。',kind:'damage',hits:4,damage:2,armorPierceIfStatus:.5},
    corrosion:{name:'腐蝕',tags:['状態異常'],desc:'4ダメージ＋毒3。既に毒なら攻撃部分が防御無視。',kind:'damage',hits:1,damage:4,status:{type:'poison',amount:3},ignoreArmorIfPoison:true},
    gale_thrust:{name:'疾風刺し',tags:['連撃'],desc:'2ダメージ×5。直前も多段攻撃なら×7。',kind:'damage',hits:5,damage:2,prevMultiHits:7},
    recovery_run:{name:'回収走法',tags:['循環','捨て札'],desc:'5ダメージ。直前に捨てられたカード1枚を山札の上へ戻す。',kind:'damage',hits:1,damage:5,effect:'recoverLastDiscard'},
    blood_wall:{name:'血壁',tags:['自傷','耐久'],desc:'HP3を失い、防御14。',kind:'block',block:14,selfDamage:3},
    bore_chain:{name:'削孔連鎖',tags:['連撃','状態異常'],desc:'1ダメージ×6。状態異常中なら2発目以降の威力が1ずつ上昇。',kind:'damage',hits:6,damage:1,rampingIfStatus:true},
    long_drive:{name:'長駆',tags:['耐久','循環'],desc:'防御6。直前ターンに山札再構築なら防御14。',kind:'block',block:6,blockIfRecentReshuffle:14},
    shatter_return:{name:'破砕返し',tags:['反撃','状態異常'],desc:'7ダメージ＋防御5。敵が状態異常なら12ダメージ。',kind:'hybrid',damage:7,block:5,damageIfStatus:12},


    // v0.3: 第1ボス前アンロック追加（+20）
    deep_guard:{name:'深層防壁',tags:['耐久','循環'],desc:'防御12。山札を一度以上再構築済みならHP4回復。',kind:'block',block:12,healIfReshuffle:4},
    enduring_venom:{name:'持続毒',tags:['状態異常','耐久'],desc:'毒4。敵HPが半分より多いなら毒7。',kind:'utility',status:{type:'poison',amount:4},statusIfEnemyHpAbove:{ratio:.5,amount:7}},
    revenge_edge:{name:'報復の構え',tags:['耐久','反撃'],desc:'防御5。このターン被ダメージ時、受けたダメージの100%を返す。',kind:'block',block:5,counter:1},
    crimson_peak:{name:'紅蓮峰',tags:['自傷','瀕死'],desc:'HP5を失い24ダメージ。HP半分以下なら34ダメージ。',kind:'damage',hits:1,damage:24,lowHpDamage:34,selfDamage:5},
    acid_saw:{name:'酸鋸',tags:['連撃','状態異常'],desc:'3ダメージ×4。敵が状態異常なら防御力を70%無視。',kind:'damage',hits:4,damage:3,armorPierceIfStatus:.7},
    melt_brand:{name:'融解刻印',tags:['状態異常'],desc:'5ダメージ＋火傷4＋脆弱1。',kind:'damage',hits:1,damage:5,statuses:[{type:'burn',amount:4},{type:'vulnerable',amount:1}]},
    flash_chain:{name:'閃光連鎖',tags:['連撃'],desc:'2ダメージ×7。',kind:'damage',hits:7,damage:2},
    recycle_dash:{name:'回生疾走',tags:['循環','捨て札'],desc:'7ダメージ。直前に捨てられたカード1枚を山札の上へ戻す。',kind:'damage',hits:1,damage:7,effect:'recoverLastDiscard'},
    grit_blood:{name:'血気の壁',tags:['自傷','耐久'],desc:'HP3を失い、10ダメージ＋防御8。',kind:'hybrid',damage:10,block:8,selfDamage:3},
    death_drive:{name:'死線駆動',tags:['瀕死','連撃'],desc:'4ダメージ×4。HP半分以下なら×6。',kind:'damage',hits:4,damage:4,lowHpHits:6},
    bastion_poison:{name:'籠城毒',tags:['耐久','状態異常'],desc:'防御9＋毒3。',kind:'block',block:9,status:{type:'poison',amount:3}},
    recycle_wall:{name:'循環城壁',tags:['耐久','循環'],desc:'防御9。直前に捨てられたカード1枚を山札の上へ戻す。',kind:'block',block:9,effect:'recoverLastDiscard'},
    frenzy_chain:{name:'狂騒連鎖',tags:['自傷','連撃'],desc:'HP2を失い、3ダメージ×5。',kind:'damage',hits:5,damage:3,selfDamage:2},
    hot_blood:{name:'熱血',tags:['自傷','状態異常'],desc:'HP2を失い、8ダメージ＋火傷4。',kind:'damage',hits:1,damage:8,selfDamage:2,status:{type:'burn',amount:4}},
    drill_cycle:{name:'循環穿孔',tags:['循環','連撃'],desc:'3ダメージ×4。直前ターンに山札再構築なら防御力を75%無視。',kind:'damage',hits:4,damage:3,armorPierceIfRecentReshuffle:.75},
    toxic_turn:{name:'毒の還流',tags:['状態異常','循環'],desc:'毒3。直前に捨てられたカード1枚を山札の上へ戻す。',kind:'utility',status:{type:'poison',amount:3},effect:'recoverLastDiscard'},
    endurance_cut:{name:'持久斬',tags:['耐久'],desc:'10ダメージ。4ターン目以降なら22ダメージ。',kind:'damage',hits:1,damage:10,damageIfTurnMin:{turn:4,value:22}},
    revenge_guard:{name:'復讐盾',tags:['耐久','反撃'],desc:'防御7。このターン被ダメージ時、受けたダメージの90%を返す。',kind:'block',block:7,counter:.9},
    piercing_poison:{name:'貫毒',tags:['状態異常'],desc:'6ダメージ＋毒4。既に毒状態なら防御力を無視。',kind:'damage',hits:1,damage:6,status:{type:'poison',amount:4},ignoreArmorIfPoison:true},
    tempo_break:{name:'テンポ崩し',tags:['耐久','状態異常'],desc:'防御5＋弱体2。',kind:'block',block:5,status:{type:'weak',amount:2}},

    center_lock:{name:'中央固定',tags:['提示操作'],desc:'6ダメージ。選ばなかったカード1枚を次ターン中央に予約。',kind:'damage',hits:1,damage:6,effect:'centerReserve'},
    hold:{name:'保留',tags:['提示操作','耐久'],desc:'防御7。選ばなかったカード1枚を次ターンへ持ち越す。',kind:'block',block:7,effect:'holdOne'},
    reorder:{name:'再配列',tags:['提示操作'],desc:'5ダメージ。次ターン、カード選択前に中央へ1枚移動できる。',kind:'damage',hits:1,damage:5,effect:'reorderNext'},
    redraw:{name:'再提示',tags:['提示操作','状態異常'],desc:'敵に弱体1。次ターン、提示1枠を一度引き直せる。',kind:'utility',status:{type:'weak',amount:1},effect:'redrawNext'},

    // v0.50 / roadmap 2/10: 消失・非選択・提示中
    vanishing_edge:{name:'消失刃',tags:['消失','単発'],desc:'13ダメージ。使用後、この戦闘では山札へ戻らず消失する。',kind:'damage',hits:1,damage:13,vanishAfterUse:true},
    vanishing_wall:{name:'消失障壁',tags:['消失','耐久'],desc:'防御18。使用後、この戦闘では山札へ戻らず消失する。',kind:'block',block:18,vanishAfterUse:true},
    return_from_void:{name:'空隙回帰',tags:['消失','循環'],desc:'消失領域のカード1枚を山札の下へ復帰させる。このカード自身は消失する。',kind:'utility',effect:'recoverVanished',vanishAfterUse:true},
    v50_patient_edge:{name:'伏せた刃',tags:['非選択','単発'],desc:'5ダメージ。このカード実体が選ばれなかった回数1回につき+3ダメージ（最大+9）。',kind:'damage',hits:1,damage:5,damagePerNotChosen:{value:3,max:9}},
    abandoned_aegis:{name:'見送る盾',tags:['非選択','耐久'],desc:'防御6。提示されたターンに選ばれなかった時、防御2を得る。',kind:'block',block:6,onNotChosen:{block:2}},
    dormant_ember:{name:'眠り火',tags:['非選択','火傷'],desc:'3ダメージ＋火傷1。2回以上選ばれなかった実体なら火傷3。',kind:'damage',hits:1,damage:3,status:{type:'burn',amount:1},statusIfNotChosen:{min:2,type:'burn',amount:3}},
    watchful_plate:{name:'監視板',tags:['提示中','耐久'],desc:'提示されているターン、選択前に防御2を得る。',kind:'block',block:5,presentedBlock:2},
    sighting_lens:{name:'照準待機',tags:['提示中','単発'],desc:'提示されているターン、次に選ぶ1hit攻撃を+6%する。自身を選ぶと7ダメージ。',kind:'damage',hits:1,damage:7,presentedSingleHitBuff:.06},
    toxic_observer:{name:'毒見の標',tags:['提示中','毒'],desc:'提示されているターン、敵に毒があれば防御1。自身を選ぶと毒2を付与。',kind:'utility',status:{type:'poison',amount:2},presentedBlockIfStatus:'poison'},

    // v0.51 / roadmap 3/10: 記録・予約・変質・復帰
    role_recorder:{name:'役割記録器',tags:['記録','循環'],desc:'直前に使ったカードの役割・hit構成・状態異常種を記録する。',kind:'utility',effect:'recordPrevious'},
    record_replay:{name:'記録再演',tags:['記録'],desc:'最後に記録したカードの役割を小さな効果として再演する。攻撃は8（多段なら6）、防御は8、状態異常は同種2。',kind:'utility',effect:'replayRecord'},
    route_marker:{name:'航路標',tags:['予約','循環'],desc:'防御5。直前に捨て札へ送られたカード1枚を次回提示へ予約する。',kind:'block',block:5,effect:'reserveLastDiscard'},
    returning_probe:{name:'帰投探針',tags:['予約','単発'],desc:'6ダメージ。使用後、捨て札へ行かず次回提示へ1度予約される。',kind:'damage',hits:1,damage:6,reserveSelfAfterUse:true},
    rough_edge:{name:'粗削りの刃',tags:['変質','非選択','単発'],desc:'6ダメージ。同じ実体が2回選ばれなかった時、《研磨された刃》へ変質する。',kind:'damage',hits:1,damage:6,transformAfterEvent:{type:'notChosen',count:2,into:'polished_edge'}},
    polished_edge:{name:'研磨された刃',tags:['変質','単発'],desc:'10ダメージ。変質後は非選択による成長を失い、安定した単発札になる。',kind:'damage',hits:1,damage:10},
    void_cocoon:{name:'空隙の繭',tags:['消失','変質'],desc:'防御7。使用後に消失する。消失領域から復帰した時、《孵化殻》へ変質する。',kind:'block',block:7,vanishAfterUse:true,transformOnReturn:'hatched_shell'},
    hatched_shell:{name:'孵化殻',tags:['復帰','耐久'],desc:'防御11。消失から帰還した後だけ利用できる安定防御札。',kind:'block',block:11},
    recall_beacon:{name:'帰還標識',tags:['復帰','消失'],desc:'消失領域で最も古いカード1枚を山札の上へ復帰させる。自身は消失する。',kind:'utility',effect:'recoverVanishedOldest',vanishAfterUse:true}
  };

  D.BASE_CARD_IDS = [
    'discard_blade','parting_gift','embers','selection','double_strike','needle_rain','follow_up','accelerated_slash','poison_needle','brand','break','weakening_mist','wall','counter_stance','parry','last_stand_shield','blood_blade','blood_contract','dying_blow','blood_chain','rebuild','fast_forward','recall','adversity_recovery','scarlet_bulwark','toxic_barrage','searing_flurry','cycle_edge','discarded_shell','fading_venom','adversity_wall','venom_burst','ember_burst','narrow_shot','spread_shot','afterguard','shard_shot','emergency_cache','volatile_ash','toxin_residue','scavenger_cut','abandoned_guard','triple_cut','echo_barrage','puncture_chain','toxic_needles','ember_needles','combo_guard','contamination','plague_blade','toxic_guard','burning_guard','weakening_brand','status_detonator','fortress_strike','iron_echo','counter_cut','patient_guard','blood_armor','recovery_guard','sacrificial_combo','crimson_focus','brink_blast','pain_reflex','blood_poison','red_cycle','wheel_cut','cycle_guard','bottom_feed','recycle_guard','rapid_rebuild','echo_return'
  ];
  D.UNLOCK_CARD_IDS = ['long_battle','aged_poison','intercept','blood_return','drill_flurry','corrosion','gale_thrust','recovery_run','blood_wall','bore_chain','long_drive','shatter_return','deep_guard','enduring_venom','revenge_edge','crimson_peak','acid_saw','melt_brand','flash_chain','recycle_dash','grit_blood','death_drive','bastion_poison','recycle_wall','frenzy_chain','hot_blood','drill_cycle','toxic_turn','endurance_cut','revenge_guard','piercing_poison','tempo_break'];
  D.POST_BOSS_CARD_IDS = ['center_lock','hold','reorder','redraw','vanishing_edge','vanishing_wall','return_from_void','v50_patient_edge','abandoned_aegis','dormant_ember','watchful_plate','sighting_lens','toxic_observer','role_recorder','record_replay','route_marker','returning_probe','rough_edge','void_cocoon','recall_beacon'];

  D.RELICS = {
    selection_lens:{name:'選別のレンズ',tags:['提示'],desc:'毎ターン提示枚数+1。選ばれなかったカードは次の山札再構築まで候補から外れる。'},
    empty_crown:{name:'空席の王冠',tags:['提示'],desc:'提示枚数-1。選んだカードの基本効果+25%。'},
    echo_stone:{name:'残響石',tags:['循環'],desc:'前ターン最後に捨てられたカードが次の提示に出やすい。'},
    discard_furnace:{name:'廃棄炉',tags:['捨て札'],desc:'「捨てられた時」効果を50%強化。'},
    multiblade:{name:'多刃の紋章',tags:['連撃'],desc:'2回以上攻撃するカードの最終ヒット+3ダメージ。'},
    tainted_needle:{name:'汚染された針',tags:['連撃','状態異常'],desc:'複数回攻撃カードの最終ヒット時、ランダム状態異常1。'},
    mixed_vial:{name:'混成薬瓶',tags:['状態異常'],desc:'異なる種類の状態異常を追加した時、敵に4ダメージ。'},
    burnt_bandage:{name:'焼けた包帯',tags:['耐久'],desc:'HP半分以下の間、防御カードの防御+3。'},
    cracked_shield:{name:'亀裂の盾',tags:['耐久','循環'],desc:'防御カード使用ターンにダメージを受けると、そのカードを山札へ戻す。'},
    blood_key:{name:'血染めの鍵',tags:['自傷'],desc:'自傷カードの効果+30%。使用後は次の山札再構築まで候補から外れる。'},
    reverse_clock:{name:'逆流時計',tags:['循環'],desc:'山札再構築直後、最初に使うカードの効果+50%。'},
    torn_bookmark:{name:'破れた栞',tags:['循環'],desc:'山札再構築時、捨て札から1枚を次ターンの提示へ予約する。'},

    // v0.2: 初期遺物追加（+6）
    center_amplifier:{name:'中央増幅器',tags:['提示'],desc:'中央枠から選んだカードの基本効果+20%。'},
    clotting_unit:{name:'血液凝固器',tags:['自傷','耐久'],desc:'自傷カードを使うたび防御4を得る。'},
    toxic_ash_catalyst:{name:'毒火触媒',tags:['状態異常'],desc:'毒状態の敵へ火傷、または火傷状態の敵へ毒を付与した時、敵に4ダメージ。'},
    perfect_wall:{name:'完全防壁',tags:['耐久'],desc:'敵の攻撃を完全に防いだ時、1回の敵ターンにつきHP2回復。'},
    discard_capacitor:{name:'廃棄蓄電器',tags:['捨て札'],desc:'「捨てられた時」効果が発動したら、次に使うカードの効果+20%。重複しない。'},
    last_page:{name:'終端頁',tags:['循環'],desc:'カード使用時に山札が2枚以下なら、そのカードの基本効果+25%。'},


    // v0.3: 初期遺物大量追加（+18）
    discard_dagger:{name:'廃棄短剣',tags:['捨て札'],desc:'カードの「捨てられた時」効果が発動するたび、敵に3ダメージ。'},
    salvage_mesh:{name:'回収網',tags:['捨て札','耐久'],desc:'カードの「捨てられた時」効果が発動するたび、防御2を得る。'},
    ash_collector:{name:'灰収集器',tags:['捨て札','状態異常'],desc:'「捨てられた時」に付与する毒・火傷の量+1。'},
    crowded_table:{name:'満席卓',tags:['提示'],desc:'提示枚数が4枚以上なら、選んだカードの基本効果+20%。'},
    narrow_focus:{name:'狭域焦点',tags:['提示'],desc:'提示枚数が2枚以下なら、選んだカードの基本効果+30%。'},
    chain_reactor:{name:'連鎖反応炉',tags:['連撃'],desc:'多段攻撃の3ヒット目以降は、ヒット順に追加ダメージが増える。'},
    status_prism:{name:'症状プリズム',tags:['状態異常'],desc:'敵に2種類以上の状態異常がある間、選んだカードの基本効果+20%。'},
    venom_siphon:{name:'毒吸管',tags:['状態異常','耐久'],desc:'毒を消費する効果を使った時、HP4回復。'},
    cinder_shield:{name:'灰盾',tags:['状態異常','耐久'],desc:'火傷を消費する効果を使った時、防御6を得る。'},
    iron_heartbeat:{name:'鉄の鼓動',tags:['耐久'],desc:'敵の攻撃を完全に防いだ時、次に使うカードの効果+25%。'},
    counter_core:{name:'反撃核',tags:['反撃'],desc:'割合反撃のダメージ+40%。'},
    wounded_engine:{name:'負傷機関',tags:['瀕死','提示'],desc:'HP半分以下の間、提示枚数+1。'},
    red_gear:{name:'紅歯車',tags:['自傷'],desc:'自傷カードを使うたび、次に使うカードの効果+15%。'},
    pain_converter:{name:'疼痛変換器',tags:['自傷','耐久'],desc:'自傷で失ったHPと同じだけ防御を得る。'},
    cycle_bearing:{name:'循環軸受',tags:['循環','耐久'],desc:'山札を再構築するたび、防御6を得る。'},
    circular_blade:{name:'環状刃',tags:['循環'],desc:'山札再構築直後の最初の攻撃カードの効果+25%。'},
    thin_deck_sensor:{name:'薄層センサー',tags:['循環'],desc:'カード使用時に山札が2枚以下なら、そのカードの基本効果+20%。'},
    recovery_thread:{name:'回収糸',tags:['循環','耐久'],desc:'捨て札からカードを山札へ戻すたび、HP2回復。'},

    long_observation:{name:'長期観測槽',tags:['耐久'],desc:'戦闘中最初の山札再構築時、失っているHPの25%を回復。'},
    reflect_bone:{name:'反射骨',tags:['反撃'],desc:'各敵ターン最初の被ダメージの50%を敵へ返す。'},
    erosion_sample:{name:'侵蝕標本',tags:['状態異常'],desc:'状態異常中の敵は防御力の効果が30%低下。'},
    overrotation:{name:'過回転輪',tags:['連撃','提示'],desc:'3回以上攻撃するカードを使った次ターン、提示枚数+1。'},
    long_drive_engine:{name:'長駆機関',tags:['循環','提示'],desc:'山札再構築直後のターンは提示枚数+1。'},
    pressure_plate:{name:'圧返板',tags:['反撃','状態異常'],desc:'敵攻撃ダメージを半分以上防いだ時、敵に脆弱1。'},

    // v0.3: 第1ボス前アンロック遺物追加（+8）
    late_bloom:{name:'晩成核',tags:['耐久'],desc:'4ターン目以降、選んだカードの基本効果+25%。'},
    red_mirror:{name:'赤鏡',tags:['反撃'],desc:'割合反撃のダメージ+30%。'},
    corrosion_lens:{name:'腐食レンズ',tags:['状態異常'],desc:'状態異常中の敵への攻撃は、さらに防御力を20%無視。'},
    tempo_spool:{name:'テンポ巻線',tags:['連撃'],desc:'直前に多段攻撃を使っていたら、次に選ぶカードの基本効果+15%。'},
    fortress_core:{name:'要塞核',tags:['耐久'],desc:'敵の攻撃を完全に防いだ時、次に使うカードの効果+30%。'},
    frenzy_gear:{name:'狂奔歯車',tags:['連撃','瀕死'],desc:'敵速度が2以上なら、選んだカードの基本効果+20%。'},
    tyrant_heart:{name:'暴君心臓',tags:['自傷'],desc:'自傷カードの基本効果+20%。'},
    mobile_coil:{name:'機動コイル',tags:['連撃'],desc:'多段攻撃は防御力を15%無視。'},

    phase_exchanger:{name:'位相交換器',tags:['提示操作'],desc:'毎ターン1回、カード選択前に中央と左右どちらかを交換できる。'},
    holding_tank:{name:'保留槽',tags:['提示操作'],desc:'毎ターン、選ばなかったカード1枚を次ターンへ持ち越せる。'},
    reroll_terminal:{name:'再抽選端末',tags:['提示操作'],desc:'戦闘中1回、提示されたカード1枚を引き直せる。'}
  };

  D.BASE_RELIC_IDS = ['selection_lens','empty_crown','echo_stone','discard_furnace','multiblade','tainted_needle','mixed_vial','burnt_bandage','cracked_shield','blood_key','reverse_clock','torn_bookmark','center_amplifier','clotting_unit','toxic_ash_catalyst','perfect_wall','discard_capacitor','last_page','discard_dagger','salvage_mesh','ash_collector','crowded_table','narrow_focus','chain_reactor','status_prism','venom_siphon','cinder_shield','iron_heartbeat','counter_core','wounded_engine','red_gear','pain_converter','cycle_bearing','circular_blade','thin_deck_sensor','recovery_thread'];
  D.UNLOCK_RELIC_IDS = ['long_observation','reflect_bone','erosion_sample','overrotation','long_drive_engine','pressure_plate','late_bloom','red_mirror','corrosion_lens','tempo_spool','fortress_core','frenzy_gear','tyrant_heart','mobile_coil'];
  D.POST_BOSS_RELIC_IDS = ['phase_exchanger','holding_tank','reroll_terminal'];

  D.TRAITS = {
    giant:{name:'巨躯個体',short:'巨躯',desc:'最大HP×1.75。',effect:'giant'},
    berserk:{name:'凶暴個体',short:'凶暴',desc:'攻撃力×1.6。',effect:'berserk'},
    armored:{name:'重装個体',short:'重装',desc:'防御力+8、さらに被ダメージ10%軽減。',effect:'armored'},
    fast:{name:'高速個体',short:'高速',desc:'速度+0.75。',effect:'fast'},
    tyrant:{name:'暴君個体',short:'暴君',desc:'最大HP×1.4、攻撃力×1.4。',effect:'tyrant'},
    mobile_fortress:{name:'機動要塞個体',short:'機動要塞',desc:'防御力+6、速度+0.5。',effect:'mobile_fortress'}
  };

  D.ENEMY_STAT_CONFIG = [
    {key:'hp',label:'HP倍率',min:1,max:20,step:1},
    {key:'atk',label:'攻撃力倍率',min:1,max:12,step:1},
    {key:'def',label:'防御力倍率',min:1,max:12,step:1},
    {key:'spd',label:'速度倍率',min:1,max:5,step:.5}
  ];


  // v0.4: ビルド軸の穴を埋める初期カード +18 / 第1ボス前カード +24
  Object.assign(D.CARDS, {
    discard_salvo:{name:'廃棄掃射',tags:['捨て札','連撃'],desc:'2ダメージ×3。このターン選ばれず捨てられたカード1枚につき、各ヒット+1ダメージ。',kind:'damage',hits:3,damage:2,damagePerDiscardedThisTurn:1},
    scrap_bastion:{name:'廃材防壁',tags:['捨て札','耐久'],desc:'防御5。このターン選ばれず捨てられたカード1枚につき防御+3。',kind:'block',block:5,blockPerDiscardedThisTurn:3},
    latent_charge:{name:'伏せた蓄電',tags:['捨て札','万能'],desc:'使用時、次のカードの効果+15%。選ばれず捨てられた時、次のカードの効果+30%。',kind:'utility',buffNext:.15,onDiscard:{buffNext:.30}},
    discard_counter:{name:'廃棄迎撃',tags:['捨て札','反撃','耐久'],desc:'防御5・割合反撃40%。選ばれず捨てられた時、防御3。',kind:'block',block:5,counter:.4,onDiscard:{block:3}},
    hex_puncture:{name:'六連穿ち',tags:['連撃'],desc:'2ダメージ×6。防御力を20%無視。',kind:'damage',hits:6,damage:2,armorPierce:.2},
    guard_barrage:{name:'護身連射',tags:['連撃','耐久'],desc:'2ダメージ×2＋防御8。',kind:'hybrid',hits:2,damage:2,block:8},
    toxic_cascade:{name:'毒瀑',tags:['連撃','状態異常'],desc:'1ダメージ×5。各ヒットで毒1。',kind:'damage',hits:5,damage:1,perHitStatus:{type:'poison',amount:1}},
    frenzy_guard:{name:'連動防壁',tags:['連撃','耐久'],desc:'防御6。直前に多段攻撃を使っていたなら防御14。',kind:'block',block:6,blockIfPrevMulti:14},
    blight_wall:{name:'病蝕防壁',tags:['状態異常','耐久'],desc:'防御8＋弱体1。',kind:'block',block:8,status:{type:'weak',amount:1}},
    dual_detonation:{name:'毒火爆轟',tags:['状態異常'],desc:'4ダメージ。敵の毒と火傷をすべて消費し、合計値×1.5の追加ダメージ。',kind:'damage',hits:1,damage:4,consumeStatuses:{types:['poison','burn'],ratio:1.5}},
    plague_cycle:{name:'輪毒',tags:['状態異常','循環'],desc:'毒3。山札再構築1回につき毒+2。',kind:'utility',status:{type:'poison',amount:3},statusPerReshuffle:2},
    symptom_shell:{name:'症状殻',tags:['状態異常','耐久'],desc:'防御6。敵の状態異常の種類1つにつき防御+3。',kind:'block',block:6,blockPerStatusType:3},
    shield_ram:{name:'盾衝',tags:['耐久','反撃'],desc:'防御6＋3ダメージ。さらに現在の防御値の50%を追加ダメージ。',kind:'hybrid',block:6,damage:3,hits:1,damagePlusBlockRatio:.5},
    brace_focus:{name:'構え直し',tags:['耐久','万能'],desc:'防御9。次に使うカードの効果+20%。',kind:'block',block:9,buffNext:.2},
    scar_strike:{name:'瘢痕打ち',tags:['自傷','耐久'],desc:'HP2を失い、8ダメージ＋防御8。',kind:'hybrid',hits:1,damage:8,block:8,selfDamage:2},
    brink_fury:{name:'背水乱舞',tags:['自傷','瀕死','連撃'],desc:'HP2を失い、3ダメージ×2。HP半分以下なら×5。',kind:'damage',hits:2,lowHpHits:5,damage:3,selfDamage:2},
    recursive_edge:{name:'再帰刃',tags:['循環','連撃'],desc:'3ダメージ×2。直前ターンに山札再構築していたなら×4。',kind:'damage',hits:2,hitsIfRecentReshuffle:4,damage:3},
    terminal_guard:{name:'終端防壁',tags:['循環','耐久'],desc:'防御7。カード使用時に山札が2枚以下なら防御15。',kind:'block',block:7,blockIfDrawMax:{max:2,value:15}},

    patient_execution:{name:'晩成処刑',tags:['耐久'],desc:'6ダメージ。5ターン目以降なら22ダメージ。',kind:'damage',hits:1,damage:6,damageIfTurnMin:{turn:5,value:22}},
    deep_cycle_guard:{name:'深層輪盾',tags:['耐久','循環'],desc:'防御8。山札再構築1回につき防御+5。',kind:'block',block:8,blockPerReshuffle:5},
    retaliation_engine:{name:'報復機関',tags:['耐久','反撃'],desc:'5ダメージ＋防御7。被ダメージ時、受けたダメージの75%を返す。',kind:'hybrid',hits:1,damage:5,block:7,counter:.75},
    redline_cut:{name:'赤線斬り',tags:['自傷','瀕死'],desc:'HP3を失い10ダメージ。HP半分以下なら30ダメージ。',kind:'damage',hits:1,damage:10,lowHpDamage:30,selfDamage:3},
    absolute_corrosion:{name:'絶対腐食',tags:['状態異常'],desc:'4ダメージ＋毒5。防御力を60%無視。',kind:'damage',hits:1,damage:4,status:{type:'poison',amount:5},armorPierce:.6},
    armor_saw:{name:'装甲鋸',tags:['連撃'],desc:'3ダメージ×5。防御力を50%無視。',kind:'damage',hits:5,damage:3,armorPierce:.5},
    hyper_chain:{name:'超速連鎖',tags:['連撃'],desc:'2ダメージ×7。',kind:'damage',hits:7,damage:2},
    rapid_guard:{name:'瞬動防壁',tags:['連撃','耐久'],desc:'防御9。直前に多段攻撃を使っていたなら防御16。',kind:'block',block:9,blockIfPrevMulti:16},
    giant_step:{name:'巨歩',tags:['耐久','循環'],desc:'防御10。山札を一度以上再構築済みならHP4回復。',kind:'block',block:10,healIfReshuffle:4},
    crush_poison:{name:'圧毒',tags:['状態異常'],desc:'6ダメージ＋毒4。敵が状態異常なら16ダメージ。',kind:'damage',hits:1,damage:6,damageIfStatus:16,status:{type:'poison',amount:4}},
    breaker_edge:{name:'破城刃',tags:['反撃','状態異常'],desc:'8ダメージ＋脆弱1。敵防御力を35%無視。',kind:'damage',hits:1,damage:8,armorPierce:.35,status:{type:'vulnerable',amount:1}},
    breaker_guard:{name:'破城受け',tags:['耐久','反撃'],desc:'防御9。敵が状態異常なら割合反撃80%。',kind:'block',block:9,counter:.45,counterIfStatus:.8},
    fortress_ram:{name:'要塞衝角',tags:['耐久','反撃'],desc:'防御10＋4ダメージ。現在の防御値の70%を追加ダメージ。',kind:'hybrid',block:10,damage:4,hits:1,damagePlusBlockRatio:.7},
    bastion_recycle:{name:'城壁再生',tags:['耐久','循環'],desc:'防御9。直前に捨てられたカード1枚を山札の上へ戻す。',kind:'block',block:9,effect:'recoverLastDiscard'},
    frenzy_blood:{name:'狂奔血刃',tags:['自傷','連撃'],desc:'HP4を失い、4ダメージ×4。',kind:'damage',hits:4,damage:4,selfDamage:4},
    swift_toxin:{name:'疾毒連射',tags:['連撃','状態異常'],desc:'1ダメージ×6。各ヒットで毒1。',kind:'damage',hits:6,damage:1,perHitStatus:{type:'poison',amount:1}},
    tyrant_decree:{name:'暴君の勅令',tags:['自傷','耐久','反撃'],desc:'HP3を失い、防御14。被ダメージ時、敵に12ダメージ。',kind:'block',block:14,selfDamage:3,fixedCounter:12},
    mobile_array:{name:'機動配列',tags:['連撃','循環'],desc:'3ダメージ×3。直前ターンに山札再構築していたなら×6。',kind:'damage',hits:3,hitsIfRecentReshuffle:6,damage:3},
    triad_ironblood:{name:'鉄血三重奏',tags:['自傷','耐久','反撃'],desc:'HP3を失い、8ダメージ＋防御12。被ダメージ時50%反撃。',kind:'hybrid',hits:1,damage:8,block:12,selfDamage:3,counter:.5},
    triad_rush:{name:'暴走三重奏',tags:['自傷','連撃','瀕死'],desc:'HP3を失い、3ダメージ×4。HP半分以下なら×7。',kind:'damage',hits:4,lowHpHits:7,damage:3,selfDamage:3},
    triad_citadel:{name:'輪転城塞',tags:['耐久','循環','連撃'],desc:'2ダメージ×2＋防御10。山札再構築1回につき防御+4。',kind:'hybrid',hits:2,damage:2,block:10,blockPerReshuffle:4},
    triad_execution:{name:'疾患処刑',tags:['連撃','状態異常','反撃'],desc:'2ダメージ×5。敵の状態異常が2種類以上なら各ヒット+2。',kind:'damage',hits:5,damage:2,damagePerHitIfStatusTypes:{min:2,value:2}},
    catastrophe_protocol:{name:'災厄プロトコル',tags:['自傷','連撃','状態異常','耐久'],desc:'HP4を失い、3ダメージ×4＋防御8。各ヒットで火傷1。',kind:'hybrid',hits:4,damage:3,block:8,selfDamage:4,perHitStatus:{type:'burn',amount:1}},
    adaptive_countermeasure:{name:'適応対策',tags:['捨て札','循環','耐久'],desc:'防御8。このターン捨てられたカード1枚につき防御+3。直前の捨て札1枚を山札の上へ戻す。',kind:'block',block:8,blockPerDiscardedThisTurn:3,effect:'recoverLastDiscard'}
  });

  Object.assign(D.RELICS, {
    offcut_engine:{name:'端材機関',tags:['捨て札'],desc:'そのターン選ばれず捨てられたカード1枚につき、選んだカードの基本効果+8%（最大24%）。'},
    discard_memory:{name:'廃棄記憶体',tags:['捨て札','循環'],desc:'そのカード実体が一度でも捨てられていたなら、選んだ時の基本効果+25%。'},
    multi_core:{name:'多段核',tags:['連撃'],desc:'4ヒット以上のカードの基本効果+20%。'},
    impact_mesh:{name:'衝撃網',tags:['連撃','耐久'],desc:'多段攻撃カードを使うたび、ヒット数に応じて最大6防御を得る。'},
    ailment_shell:{name:'症状外殻',tags:['状態異常','耐久'],desc:'状態異常を付与するたび防御1。1ターン最大6。'},
    triage_prism:{name:'三症プリズム',tags:['状態異常'],desc:'敵の状態異常が3種類以上なら、選んだカードの基本効果+30%。'},
    steadfast_frame:{name:'不動骨格',tags:['耐久'],desc:'4ターン目以降、防御カードの防御+4。'},
    last_breath_lens:{name:'背水レンズ',tags:['瀕死'],desc:'HP半分以下なら、選んだカードの基本効果+25%。'},
    scar_engine:{name:'瘢痕機関',tags:['自傷'],desc:'自傷を持つカードの基本効果+20%。'},
    cycle_meter:{name:'循環計',tags:['循環'],desc:'山札再構築1回につき選んだカードの基本効果+7%（最大28%）。'},
    restart_capsule:{name:'再起カプセル',tags:['循環','耐久'],desc:'山札を再構築するたびHP2回復。'},
    hybrid_coupler:{name:'混成カプラ',tags:['万能'],desc:'タグを2種類以上持つカードの基本効果+15%。'},

    endurance_clock:{name:'持久時計',tags:['耐久','循環'],desc:'最初の山札再構築時、次に使うカードの効果+40%。'},
    danger_sensor:{name:'危険感知器',tags:['反撃','耐久'],desc:'敵攻撃力が30以上なら、防御カードの防御+25%。'},
    fracture_scope:{name:'破断照準器',tags:['連撃','状態異常'],desc:'敵防御力が15以上なら、すべての攻撃が防御力を追加で25%無視。'},
    highspeed_core:{name:'高速演算核',tags:['連撃','提示'],desc:'敵速度が3以上なら提示枚数+1。'},
    momentum_vessel:{name:'巨走槽',tags:['連撃','耐久'],desc:'3ヒット以上のカードを使うと、次のカードの効果+20%。'},
    breaker_anvil:{name:'破城金床',tags:['反撃','状態異常'],desc:'状態異常中の敵への割合反撃ダメージ+35%。'},
    bastion_memory:{name:'城塞記憶',tags:['耐久'],desc:'敵攻撃を完全防御した時、1敵ターンにつきHP3回復。'},
    frenzy_clock:{name:'狂奔時計',tags:['連撃'],desc:'直前が多段攻撃なら、次の多段攻撃の基本効果+20%。'},
    blood_iron_reactor:{name:'鉄血炉',tags:['自傷','耐久'],desc:'自傷カードを使うたび防御3を得て、次のカードの効果+10%。'},
    rush_prism:{name:'暴走プリズム',tags:['自傷','連撃'],desc:'HP半分以下で3ヒット以上のカードを使う時、基本効果+30%。'},
    citadel_loop:{name:'城塞環',tags:['耐久','循環'],desc:'山札再構築時、防御10を得る。'},
    execution_lens:{name:'処刑レンズ',tags:['連撃','状態異常'],desc:'状態異常中の敵へ多段攻撃を使う時、基本効果+25%。'},
    fourfold_core:{name:'四象核',tags:['万能'],desc:'タグを3種類以上持つカードの基本効果+35%。'},
    tyrant_crown:{name:'暴君冠',tags:['自傷','瀕死'],desc:'自傷カード使用時、HP半分以下なら基本効果+35%。'},
    mobile_gyro:{name:'機動ジャイロ',tags:['連撃','循環'],desc:'直前が多段攻撃または山札再構築直後なら、選んだカードの基本効果+20%。'},
    calibration_core:{name:'全域校正核',tags:['万能'],desc:'すべてのカードの基本効果+10%。'}
  });

  Object.assign(D.TRAITS, {
    swift_giant:{name:'疾駆巨体個体',short:'疾駆巨体',desc:'最大HP×1.25、速度+0.35。',effect:'swift_giant'},
    breaker:{name:'破城個体',short:'破城',desc:'攻撃力×1.2、防御力+4。',effect:'breaker'},
    bastion:{name:'城塞個体',short:'城塞',desc:'最大HP×1.2、防御力+4。',effect:'bastion'},
    frenzy:{name:'狂奔個体',short:'狂奔',desc:'攻撃力×1.2、速度+0.35。',effect:'frenzy'}
  });

  D.BASE_CARD_IDS.push(
    'discard_salvo','scrap_bastion','latent_charge','discard_counter','hex_puncture','guard_barrage','toxic_cascade','frenzy_guard','blight_wall','dual_detonation','plague_cycle','symptom_shell','shield_ram','brace_focus','scar_strike','brink_fury','recursive_edge','terminal_guard'
  );
  D.UNLOCK_CARD_IDS.push(
    'patient_execution','deep_cycle_guard','retaliation_engine','redline_cut','absolute_corrosion','armor_saw','hyper_chain','rapid_guard',
    'giant_step','crush_poison','breaker_edge','breaker_guard','fortress_ram','bastion_recycle','frenzy_blood','swift_toxin',
    'tyrant_decree','mobile_array','triad_ironblood','triad_rush','triad_citadel','triad_execution','catastrophe_protocol','adaptive_countermeasure'
  );
  D.BASE_RELIC_IDS.push(
    'offcut_engine','discard_memory','multi_core','impact_mesh','ailment_shell','triage_prism','steadfast_frame','last_breath_lens','scar_engine','cycle_meter','restart_capsule','hybrid_coupler'
  );
  D.UNLOCK_RELIC_IDS.push(
    'endurance_clock','danger_sensor','fracture_scope','highspeed_core','momentum_vessel','breaker_anvil','bastion_memory','frenzy_clock',
    'blood_iron_reactor','rush_prism','citadel_loop','execution_lens','fourfold_core','tyrant_crown','mobile_gyro','calibration_core'
  );


  // v0.6: 第1ボス後の第2章コンテンツ
  Object.assign(D.CHARACTERS, {
    vector:{id:'vector',name:'ベクトル',role:'提示位置・操作',hp:68,desc:'左枠を選ぶと防御5。中央枠は基本効果+10%。右枠を選ぶと次に使うカードの効果+25%。'},
    archive:{id:'archive',name:'アーカイブ',role:'捨て札・再利用',hp:72,desc:'一度でも選ばれず捨てられたカード実体を使用する時、そのカードの基本効果+30%。'}
  });

  Object.assign(D.CARDS, {
    center_guard:{name:'中心防壁',tags:['提示操作','耐久'],desc:'防御7。中央枠から使用した場合、防御15。',kind:'block',block:7,blockIfPosition:{position:'center',value:15}},
    center_burst:{name:'中心破砕',tags:['提示操作'],desc:'7ダメージ。中央枠から使用した場合18ダメージ。',kind:'damage',hits:1,damage:7,damageIfPosition:{position:'center',value:18}},
    left_sweep:{name:'左旋斬',tags:['提示操作','連撃'],desc:'3ダメージ×2。左枠から使用した場合×5。',kind:'damage',hits:2,damage:3,hitsIfPosition:{position:'left',value:5}},
    right_charge:{name:'右端突貫',tags:['提示操作'],desc:'6ダメージ。右枠から使用した場合17ダメージ。',kind:'damage',hits:1,damage:6,damageIfPosition:{position:'right',value:17}},
    center_counter:{name:'中軸迎撃',tags:['提示操作','耐久','反撃'],desc:'防御6・割合反撃40%。中央枠なら防御12・割合反撃80%。',kind:'block',block:6,counter:.4,blockIfPosition:{position:'center',value:12},counterIfPosition:{position:'center',value:.8}},
    left_guard:{name:'左翼防壁',tags:['提示操作','耐久'],desc:'防御7。左枠なら防御13。',kind:'block',block:7,blockIfPosition:{position:'left',value:13}},
    right_poison:{name:'右翼毒針',tags:['提示操作','状態異常'],desc:'4ダメージ＋毒2。右枠なら毒5。',kind:'damage',hits:1,damage:4,status:{type:'poison',amount:2},statusIfPosition:{position:'right',amount:5}},
    position_cycle:{name:'位置循環',tags:['提示操作','循環'],desc:'5ダメージ。左枠なら直前の捨て札を山札上へ戻し、右枠なら次のカード+25%。',kind:'damage',hits:1,damage:5,effect:'positionCycle'},
    reserve_blade:{name:'保留刃',tags:['提示操作','循環'],desc:'8ダメージ。選ばなかったカード1枚を次ターンへ持ち越す。',kind:'damage',hits:1,damage:8,effect:'holdOne'},
    reserve_guard:{name:'保留防壁',tags:['提示操作','耐久'],desc:'防御8。選ばなかったカード1枚を次ターン中央へ予約する。',kind:'block',block:8,effect:'centerReserve'},
    redraw_strike:{name:'再抽選打撃',tags:['提示操作'],desc:'6ダメージ。次ターン、提示1枠を一度引き直せる。',kind:'damage',hits:1,damage:6,effect:'redrawNext'},
    reorder_guard:{name:'配列防壁',tags:['提示操作','耐久'],desc:'防御8。次ターン、カード選択前に中央へ1枚移動できる。',kind:'block',block:8,effect:'reorderNext'},
    narrow_guard:{name:'狭域防壁',tags:['提示','耐久'],desc:'防御6。提示枚数が2枚以下なら防御16。',kind:'block',block:6,blockIfPromptMax:{max:2,value:16}},
    wide_barrage:{name:'広域掃射',tags:['提示','連撃'],desc:'2ダメージ×4。提示枚数が4枚以上なら各ヒット4ダメージ。',kind:'damage',hits:4,damage:2,damageIfPromptMin:{min:4,value:4}},
    prompt_detonator:{name:'提示爆砕',tags:['提示','状態異常'],desc:'5ダメージ。提示枚数1枚につき+3ダメージ。',kind:'damage',hits:1,damage:5,damagePerPromptCard:3},
    discarded_center:{name:'捨て札の中心',tags:['捨て札','提示操作'],desc:'6ダメージ。このカード実体が一度でも捨てられていれば、中央枠以外でも中央扱いの追加+10ダメージ。',kind:'damage',hits:1,damage:6,discardedPositionBonus:10},

    regen_breaker:{name:'再生破り',tags:['対再生'],desc:'9ダメージ。敵の再生力が1以上なら20ダメージ。',kind:'damage',hits:1,damage:9,damageIfEnemyRegenMin:{min:1,value:20}},
    renewal_theft:{name:'再生奪取',tags:['対再生','耐久'],desc:'6ダメージ。敵に再生力がある場合HP5回復。',kind:'damage',hits:1,damage:6,healIfEnemyRegen:5},
    scorched_wound:{name:'焼灼傷',tags:['対再生','状態異常'],desc:'7ダメージ＋火傷4。敵の再生力をこのターンのみ半減する。',kind:'damage',hits:1,damage:7,status:{type:'burn',amount:4},effect:'suppressRegen'},
    relentless_cut:{name:'断続斬',tags:['対再生','連撃'],desc:'3ダメージ×4。敵がこの戦闘で一度でも回復していれば各ヒット+2。',kind:'damage',hits:4,damage:3,damagePerHitIfEnemyHealed:2},
    purity_breach:{name:'純化突破',tags:['対耐性','状態異常'],desc:'毒5。このカードの状態異常付与は敵の状態異常耐性を無視する。',kind:'utility',status:{type:'poison',amount:5},ignoreStatusResist:true},
    resistance_saw:{name:'耐性鋸',tags:['対耐性','連撃'],desc:'2ダメージ×5。敵の状態異常耐性10%につき各ヒット+1。',kind:'damage',hits:5,damage:2,damagePerEnemyResistStep:1},
    cleanse_bait:{name:'浄化誘発',tags:['対耐性','状態異常'],desc:'弱体2。敵の状態異常耐性が50%以上なら、さらに脆弱2。',kind:'utility',status:{type:'weak',amount:2},extraStatusIfEnemyResistMin:{min:50,type:'vulnerable',amount:2}},
    sterile_wall:{name:'無菌防壁',tags:['対耐性','耐久'],desc:'防御8。敵の状態異常耐性が50%以上なら防御16。',kind:'block',block:8,blockIfEnemyResistMin:{min:50,value:16}},

    tuned_edge:{name:'調律刃',tags:['調律','万能'],desc:'8ダメージ。このカードが調律されている場合16ダメージ。',kind:'damage',hits:1,damage:8,damageIfTuned:16},
    tuned_guard:{name:'調律防壁',tags:['調律','耐久'],desc:'防御8。このカードが調律されている場合防御16。',kind:'block',block:8,blockIfTuned:16},
    tuned_barrage:{name:'調律連射',tags:['調律','連撃'],desc:'2ダメージ×3。このカードが調律されている場合×6。',kind:'damage',hits:3,damage:2,hitsIfTuned:6},
    tuned_toxin:{name:'調律毒',tags:['調律','状態異常'],desc:'毒3。このカードが調律されている場合毒7。',kind:'utility',status:{type:'poison',amount:3},statusIfTuned:7},
    residue_bridge:{name:'残滓架橋',tags:['調律','捨て札'],desc:'5ダメージ。選ばれず捨てられた時、次のカード+20%。',kind:'damage',hits:1,damage:5,onDiscard:{buffNext:.20}},
    overload_bastion:{name:'過負荷城壁',tags:['調律','耐久'],desc:'防御10。次の山札再構築まで除外中のカード1枚につき防御+2。',kind:'block',block:10,blockPerExcluded:2},
    recycle_lance:{name:'再循環槍',tags:['調律','循環'],desc:'7ダメージ。山札の残りが3枚以下なら15ダメージ。',kind:'damage',hits:1,damage:7,damageIfDrawMax:{max:3,value:15}}
  });

  D.POST_BOSS_CARD_IDS.push(
    'center_guard','center_burst','left_sweep','right_charge','center_counter','left_guard','right_poison','position_cycle',
    'reserve_blade','reserve_guard','redraw_strike','reorder_guard','narrow_guard','wide_barrage','prompt_detonator','discarded_center',
    'regen_breaker','renewal_theft','scorched_wound','relentless_cut','purity_breach','resistance_saw','cleanse_bait','sterile_wall',
    'tuned_edge','tuned_guard','tuned_barrage','tuned_toxin','residue_bridge','overload_bastion','recycle_lance'
  );

  Object.assign(D.RELICS, {
    center_compass:{name:'中央羅針',tags:['提示操作'],desc:'中央枠から選んだカードの基本効果+15%。'},
    left_battery:{name:'左翼蓄電池',tags:['提示操作','耐久'],desc:'左枠からカードを選ぶたび防御4。'},
    right_capacitor:{name:'右翼コンデンサ',tags:['提示操作'],desc:'右枠からカードを選ぶたび、次に使うカードの効果+15%。'},
    reserve_amplifier:{name:'保留増幅器',tags:['提示操作','循環'],desc:'前ターンから持ち越されたカードを使う時、基本効果+30%。'},
    reroll_capacitor:{name:'再抽選蓄電器',tags:['提示操作'],desc:'カードを引き直した後、次に使うカードの効果+20%。'},
    position_prism:{name:'位置プリズム',tags:['提示操作'],desc:'左・中央・右を連続で重複せず選ぶほど基本効果が上昇する（最大+20%）。'},
    regen_hunter:{name:'再生狩り',tags:['対再生'],desc:'再生力を持つ敵への攻撃カードの基本効果+20%。'},
    cautery_core:{name:'焼灼核',tags:['対再生','状態異常'],desc:'火傷中の敵の再生量をさらに50%低下させる。'},
    sterile_needle:{name:'無菌針',tags:['対耐性','状態異常'],desc:'カードによる状態異常付与時、敵の状態異常耐性を20ポイント低いものとして計算する。'},
    resistance_converter:{name:'耐性変換器',tags:['対耐性','万能'],desc:'敵の状態異常耐性20%につき、選んだカードの基本効果+6%。'},
    tuning_core:{name:'調律核',tags:['調律'],desc:'調律済みカードの基本効果+12%。'},
    overload_sink:{name:'過負荷吸収槽',tags:['調律','耐久'],desc:'過負荷調律カードを使用した時、防御5。'},
    recycle_rotor:{name:'再循環ローター',tags:['調律','循環'],desc:'再循環調律カードを使用した時、次のカードの効果+10%。'},
    residue_receiver:{name:'残滓受信器',tags:['調律','捨て札'],desc:'残滓調律カードが選ばれず捨てられた時、防御4。'},
    adaptive_lens:{name:'適応レンズ',tags:['万能'],desc:'敵が再生力または状態異常耐性を持つ場合、タグ2種類以上のカードの基本効果+18%。'},
    second_observer:{name:'第二観測器',tags:['提示操作','調律'],desc:'調律済みカードが中央枠に提示された時、そのカードの基本効果+15%。'},
    cycle_reserve:{name:'保留環',tags:['提示操作','循環'],desc:'持ち越しカードを使った後、そのカードを捨て札ではなく山札の下へ戻す。'},
    purification_breaker:{name:'浄化破砕器',tags:['対耐性','連撃'],desc:'状態異常耐性50%以上の敵への多段攻撃は防御力を20%無視する。'}
  });
  D.POST_BOSS_RELIC_IDS.push(
    'center_compass','left_battery','right_capacitor','reserve_amplifier','reroll_capacitor','position_prism','regen_hunter','cautery_core','sterile_needle','resistance_converter','tuning_core','overload_sink','recycle_rotor','residue_receiver','adaptive_lens','second_observer','cycle_reserve','purification_breaker'
  );

  Object.assign(D.TRAITS, {
    regenerative:{name:'再生個体',short:'再生',desc:'再生力+3。敵ターン終了時にHPを回復する。',effect:'regenerative'},
    purifier:{name:'浄化個体',short:'浄化',desc:'状態異常耐性+20%。',effect:'purifier'},
    immortal:{name:'不死個体',short:'不死',desc:'最大HP×1.25、再生力+4。',effect:'immortal'},
    sanctified:{name:'聖殻個体',short:'聖殻',desc:'防御力+4、状態異常耐性+20%。',effect:'sanctified'},
    adaptive:{name:'適応個体',short:'適応',desc:'再生力+2、状態異常耐性+15%。',effect:'adaptive'},
    liferush:{name:'生命奔流個体',short:'生命奔流',desc:'再生力+2、速度+0.35。',effect:'liferush'}
  });

  D.ENEMY_STAT_CONFIG.push(
    {key:'regen',label:'再生力',min:0,max:10,step:1,requiresSystem:'advanced_enemy_parameters',format:'flat'},
    {key:'resist',label:'状態異常耐性',min:0,max:70,step:10,requiresSystem:'advanced_enemy_parameters',format:'percent'}
  );

  D.BOSS1_REWARD_CARD_IDS=['center_lock','hold','reorder','redraw'];
  D.BOSS1_REWARD_RELIC_IDS=['phase_exchanger','holding_tank','reroll_terminal'];

  D.DEFAULT_DECK = ['double_strike','needle_rain','poison_needle','wall','counter_stance','blood_blade','rebuild','recall','break','parting_gift'];
})();
