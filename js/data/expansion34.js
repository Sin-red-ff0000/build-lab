'use strict';
(function(){
  const BL=window.BuildLab,D=BL.Data;
  const before={cards:new Set(Object.keys(D.CARDS)),relics:new Set(Object.keys(D.RELICS))};
  const C=(name,tags,desc,extra)=>({name,tags,desc,...extra});
  const R=(name,tags,desc)=>({name,tags,desc});

  // v0.34: 基礎6ビルド大幅強化。
  // 6枚すべてを同時採用する前提ではなく、役割の違う候補を増やして選択肢を作る。
  Object.assign(D.CARDS,{
    // --- 捨て札 ---
    v34_d_scrap_lance:C('残骸投槍',['捨て札','単発'],'18ダメージ＋防御95。一度捨てられた実体なら58ダメージ＋防御70%無視。',{kind:'hybrid',hits:1,damage:14,block:10,damageIfDiscarded:30,armorPierceIfDiscarded:.35}),
    v34_d_refuse_wall:C('廃材防塁',['捨て札','耐久'],'防御24。このターン捨てられたカード1枚につき防御+30。',{kind:'block',block:20,blockPerDiscardedThisTurn:70}),
    v34_d_shrapnel:C('散開破片',['捨て札','状態異常'],'10ダメージ＋防御95＋火傷4。選ばれず捨てられた時、敵に22ダメージ。',{kind:'hybrid',hits:1,damage:14,block:10,status:{type:'burn',amount:4},onDiscard:{damage:14}}),
    v34_d_salvage_guard:C('回収装甲',['捨て札','耐久','循環'],'16ダメージ＋防御28。一度捨てられていれば防御96。最後の捨て札を山札上へ戻す。',{kind:'hybrid',hits:1,damage:14,block:10,discardBlockBoost:14,effect:'recoverLastDiscard'}),
    v34_d_landfill:C('堆積砲',['捨て札','単発'],'12ダメージ＋防御95。このターン捨てられたカード1枚につき+34ダメージ。',{kind:'hybrid',hits:1,damage:14,block:10,damagePerDiscardedThisTurn:6,armorPierce:.25}),
    v34_d_afterimage:C('残滓残像',['捨て札','循環'],'防御18。一度捨てられていれば防御62。使用後は山札下へ戻る。',{kind:'block',block:20,discardBlockBoost:14,returnBottom:true}),

    // --- 連撃 ---
    v34_m_drill:C('八連穿孔',['連撃'],'18ダメージ×8。防御85%無視。',{kind:'damage',hits:8,damage:4,armorPierce:.25}),
    v34_m_guardstorm:C('迎撃弾幕',['連撃','耐久'],'10ダメージ×6＋防御52。',{kind:'hybrid',hits:6,damage:4,block:10,armorPierce:.25}),
    v34_m_accel:C('加速十二連',['連撃'],'9ダメージ×7。直前も多段攻撃なら×12。',{kind:'damage',hits:7,damage:4,prevMultiHits:12,armorPierce:.25}),
    v34_m_needlefort:C('針城',['連撃','耐久'],'5ダメージ×8＋防御70。',{kind:'hybrid',hits:8,damage:4,block:10,armorPierce:.25}),
    v34_m_statusburst:C('毒火連環',['連撃','状態異常'],'7ダメージ×7。各ヒットで毒1。火傷中なら防御80%無視。',{kind:'damage',hits:7,damage:4,perHitStatus:{type:'poison',amount:1},armorPierceIfStatus:.35}),
    v34_m_final:C('終端連星',['連撃','単発'],'26ダメージ×5。直前も多段攻撃なら1発34ダメージ。',{kind:'damage',hits:5,damage:4,damageIfPrevMulti:34,armorPierce:.25}),

    // --- 状態異常 ---
    v34_s_plague:C('深層汚染',['状態異常','耐久'],'防御95＋毒18＋火傷12＋弱体4。',{kind:'block',block:20,statuses:[{type:'poison',amount:18},{type:'burn',amount:12},{type:'weak',amount:4}]}),
    v34_s_quarantine:C('隔離障壁',['状態異常','耐久'],'防御90＋弱体4。',{kind:'block',block:20,status:{type:'weak',amount:4}}),
    v34_s_corrode:C('腐食穿孔',['状態異常','単発'],'24ダメージ＋脆弱3。状態異常中なら防御を完全無視。',{kind:'hybrid',hits:1,damage:14,block:10,status:{type:'vulnerable',amount:3},armorPierceIfStatus:.35}),
    v34_s_fever:C('症状熱暴走',['状態異常'],'14ダメージ。敵の状態異常合計値1につき+4ダメージ。',{kind:'hybrid',hits:1,damage:14,block:10,damagePerTotalStatus:1,armorPierceIfStatus:.35}),
    v34_s_detonate:C('全症状起爆',['状態異常'],'20ダメージ。毒と火傷をすべて消費し、合計値×7の追加ダメージ。',{kind:'hybrid',hits:1,damage:14,block:10,consumeStatuses:{types:['poison','burn'],ratio:2}}),
    v34_s_pestwall:C('疫障壁',['状態異常','耐久'],'防御38。敵の状態異常1種類につき防御+32。',{kind:'block',block:20,blockPerStatusType:6}),

    // --- 耐久 ---
    v34_g_citadel:C('極圧城塞',['耐久'],'防御118。敵攻撃力60以上なら防御188。',{kind:'block',block:20,blockIfEnemyAtkMin:{min:60,value:32},damagePlusBlockRatio:.22}),
    v34_g_retaliate:C('圧壊反照',['耐久','反撃'],'防御108。敵攻撃力60以上なら防御170。このターン被ダメージ時、受けたダメージの180%を返す。',{kind:'block',block:20,blockIfEnemyAtkMin:{min:60,value:32},counter:.9,damagePlusBlockRatio:.28}),
    v34_g_intercept:C('要塞迎撃',['耐久','反撃'],'防御145。敵攻撃力60以上なら、このターン被ダメージ時に敵へ160ダメージ。',{kind:'block',block:20,fixedCounter:10,fixedCounterIfEnemyAtkMin:{min:60,value:24},damagePlusBlockRatio:.22}),
    v34_g_ram:C('城塞破城槌',['耐久','単発'],'18ダメージ＋防御92。現在の防御の55%を追加ダメージに変換。',{kind:'hybrid',hits:1,damage:14,block:10,damagePlusBlockRatio:.55,armorPierce:.25}),
    v34_g_recovery:C('不落再生壁',['耐久','循環'],'防御105＋HP12回復。4ターン目以降は防御155。',{kind:'block',block:20,heal:12,blockIfTurnMin:{turn:4,value:30},damagePlusBlockRatio:.20}),
    v34_g_perfect:C('完全防衛線',['耐久','反撃'],'防御132。このターン被ダメージ時、受けたダメージの100%を返す。',{kind:'block',block:20,counter:1.0,damagePlusBlockRatio:.22}),

    // --- 自傷 ---
    v34_b_crimson:C('大瀉血刃',['自傷','単発'],'HP14を失い、92ダメージ。HP半分以下なら188ダメージ。',{kind:'damage',hits:1,damage:20,lowHpDamage:36,selfDamage:14,armorPierce:.25}),
    v34_b_pressure:C('血圧防壁',['自傷','耐久'],'HP10を失い、防御112。HP半分以下なら防御190。',{kind:'block',block:20,lowHpBlock:30,selfDamage:10}),
    v34_b_scarstorm:C('瘢痕連射',['自傷','連撃'],'HP12を失い、24ダメージ×5。HP半分以下なら×7。',{kind:'damage',hits:5,damage:4,lowHpHits:7,selfDamage:12,armorPierce:.25}),
    v34_b_contract:C('深紅契約',['自傷','万能'],'HP16を失う。次に使うカードの効果+170%。',{kind:'utility',selfDamage:16,buffNext:1.70}),
    v34_b_revenge:C('失血反照',['自傷','耐久','反撃'],'HP8を失い、防御96。このターン被ダメージ時、受けたダメージの130%を返す。',{kind:'block',block:20,selfDamage:8,counter:.85}),
    v34_b_terminal:C('赤線終端',['自傷','瀕死'],'HP8を失い、70ダメージ。HP半分以下なら240ダメージ＋防御80%無視。',{kind:'damage',hits:1,damage:20,lowHpDamage:36,selfDamage:8,armorPierce:.25}),

    // --- 循環 ---
    v34_c_reactor:C('輪転炉',['循環'],'20ダメージ＋防御95。山札再構築1回につき+42ダメージ。',{kind:'hybrid',hits:1,damage:14,block:10,damagePerReshuffle:6,armorPierceIfRecentReshuffle:.35}),
    v34_c_bastion:C('輪転要塞',['循環','耐久'],'防御54。山札再構築1回につき防御+58。',{kind:'block',block:20,blockPerReshuffle:8}),
    v34_c_reset:C('全域再編',['循環','耐久'],'防御140。捨て札と除外を再構築し、次カードの効果+90%。',{kind:'block',block:20,effect:'rebuild',buffNext:.30}),
    v34_c_return:C('再来大砲',['循環','単発'],'24ダメージ＋防御95。再構築直後なら132ダメージ＋防御80%無視。',{kind:'hybrid',hits:1,damage:14,block:10,damageIfRecentReshuffle:34,armorPierceIfRecentReshuffle:.35}),
    v34_c_loopguard:C('閉路防壁',['循環','耐久'],'防御48。再構築直後なら防御148。使用後は山札下へ戻る。',{kind:'block',block:20,blockIfRecentReshuffle:30,returnBottom:true}),
    v34_c_wheel:C('輪廻連星',['循環','連撃'],'12ダメージ×4＋防御95。再構築直後なら×8。',{kind:'hybrid',hits:4,damage:4,block:10,hitsIfRecentReshuffle:8,armorPierceIfRecentReshuffle:.35})
  });

  Object.assign(D.RELICS,{
    // 捨て札
    v34_rd_core:R('廃棄圧縮核',['捨て札'],'捨て札タグのカード基本効果+38%。'),
    v34_rd_memory:R('残滓記憶盤',['捨て札'],'一度捨てられたカード実体の基本効果+62%。'),
    v34_rd_bulwark:R('廃材構造体',['捨て札','耐久'],'捨て札＋防御系カード+52%。'),
    v34_rd_arsenal:R('破片兵器庫',['捨て札'],'捨て札＋攻撃系カード+50%。'),
    v34_rd_cycle:R('回収圧縮機',['捨て札','循環'],'再構築直後の捨て札カード+58%。'),
    v34_rd_crisis:R('瓦礫非常炉',['捨て札','瀕死'],'HP半分以下の捨て札カード+72%。'),
    // 連撃
    v34_rm_core:R('多段同期核',['連撃'],'連撃タグのカード基本効果+38%。'),
    v34_rm_long:R('長連鎖銃身',['連撃'],'5ヒット以上のカード+48%。'),
    v34_rm_pierce:R('穿孔同期器',['連撃'],'攻撃系の連撃カード+46%。'),
    v34_rm_guard:R('弾幕装甲',['連撃','耐久'],'連撃＋防御系カード+52%。'),
    v34_rm_status:R('症状弾帯',['連撃','状態異常'],'連撃＋状態異常カード+52%。'),
    v34_rm_combo:R('連鎖加速子',['連撃'],'直前も多段攻撃なら連撃カード+58%。'),
    // 状態異常
    v34_rs_core:R('症状培養核',['状態異常'],'状態異常タグのカード基本効果+40%。'),
    v34_rs_loaded:R('多症状増幅槽',['状態異常'],'敵に2種類以上の状態異常がある時+58%。'),
    v34_rs_attack:R('腐食砲架',['状態異常'],'攻撃系の状態異常カード+48%。'),
    v34_rs_guard:R('隔離外殻',['状態異常','耐久'],'状態異常＋防御系カード+55%。'),
    v34_rs_consume:R('起爆触媒槽',['状態異常'],'状態異常がある敵へのカード基本効果+44%。'),
    v34_rs_crisis:R('疫病非常灯',['状態異常','瀕死'],'HP半分以下かつ状態異常タグなら+70%。'),
    // 耐久
    v34_rg_core:R('城塞中枢',['耐久'],'耐久タグのカード基本効果+42%。'),
    v34_rg_block:R('積層装甲',['耐久'],'防御系カード+52%。'),
    v34_rg_counter:R('反照増幅板',['耐久','反撃'],'反撃カード+58%。'),
    v34_rg_pressure:R('高圧支持架',['耐久'],'敵攻撃力60以上で耐久カード+68%。'),
    v34_rg_long:R('不落基礎杭',['耐久','循環'],'4ターン目以降の耐久カード+60%。'),
    v34_rg_hybrid:R('攻防隔壁',['耐久','単発'],'攻防一体カード+50%。'),
    // 自傷
    v34_rb_core:R('血脈圧縮核',['自傷'],'自傷タグのカード基本効果+45%。'),
    v34_rb_low:R('瀕死増幅心臓',['自傷','瀕死'],'HP半分以下の自傷カード+75%。'),
    v34_rb_attack:R('赤刃架',['自傷'],'攻撃系自傷カード+55%。'),
    v34_rb_guard:R('血殻装甲',['自傷','耐久'],'自傷＋防御系カード+58%。'),
    v34_rb_multi:R('瘢痕弾倉',['自傷','連撃'],'自傷＋3ヒット以上カード+58%。'),
    v34_rb_chain:R('血契継電器',['自傷'],'直前も自傷カードなら自傷カード+64%。'),
    // 循環
    v34_rc_core:R('輪廻主軸',['循環'],'循環タグのカード基本効果+40%。'),
    v34_rc_recent:R('再構築残光',['循環'],'再構築直後のカード+68%。'),
    v34_rc_guard:R('輪転装甲',['循環','耐久'],'循環＋防御系カード+54%。'),
    v34_rc_attack:R('輪転砲身',['循環'],'攻撃系循環カード+52%。'),
    v34_rc_deep:R('多重輪廻核',['循環'],'再構築2回以上で循環カード+65%。'),
    v34_rc_bottom:R('底流安定器',['循環'],'循環タグかつ山札下へ戻るカード+58%。')
  });

  const clauses={};
  function add(id,when,mult){clauses[id]=[{when,mult}];}
  // discard
  add('v34_rd_core',{tag:'捨て札'},1.38);add('v34_rd_memory',{tag:'捨て札',discarded:true},1.62);add('v34_rd_bulwark',{tag:'捨て札',blockish:true},1.52);add('v34_rd_arsenal',{tag:'捨て札',attackish:true},1.50);add('v34_rd_cycle',{tag:'捨て札',recentReshuffle:true},1.58);add('v34_rd_crisis',{tag:'捨て札',lowHp:true},1.72);
  // multi
  add('v34_rm_core',{tag:'連撃'},1.38);add('v34_rm_long',{tag:'連撃',hitsMin:5},1.48);add('v34_rm_pierce',{tag:'連撃',attackish:true},1.46);add('v34_rm_guard',{tag:'連撃',blockish:true},1.52);add('v34_rm_status',{tag:'連撃',cardStatus:'poison'},1.52);clauses.v34_rm_status.push({when:{tag:'連撃',cardStatus:'burn'},mult:1.52});add('v34_rm_combo',{tag:'連撃',prevMulti:true},1.58);
  // status
  add('v34_rs_core',{tag:'状態異常'},1.40);add('v34_rs_loaded',{tag:'状態異常',statusMin:2},1.58);add('v34_rs_attack',{tag:'状態異常',attackish:true},1.48);add('v34_rs_guard',{tag:'状態異常',blockish:true},1.55);add('v34_rs_consume',{tag:'状態異常',statusMin:1},1.44);add('v34_rs_crisis',{tag:'状態異常',lowHp:true},1.70);
  // guard
  add('v34_rg_core',{tag:'耐久'},1.42);add('v34_rg_block',{tag:'耐久',blockish:true},1.52);add('v34_rg_counter',{tag:'反撃',counterish:true},1.58);add('v34_rg_pressure',{tag:'耐久',enemyAtkMin:60},1.68);add('v34_rg_long',{tag:'耐久',turnMin:4},1.60);add('v34_rg_hybrid',{tag:'耐久',attackish:true,blockish:true},1.50);
  // blood
  add('v34_rb_core',{tag:'自傷'},1.45);add('v34_rb_low',{tag:'自傷',lowHp:true},1.75);add('v34_rb_attack',{tag:'自傷',attackish:true},1.55);add('v34_rb_guard',{tag:'自傷',blockish:true},1.58);add('v34_rb_multi',{tag:'自傷',hitsMin:3},1.58);add('v34_rb_chain',{tag:'自傷',prevSelfDamage:true},1.64);
  // cycle
  add('v34_rc_core',{tag:'循環'},1.40);add('v34_rc_recent',{tag:'循環',recentReshuffle:true},1.68);add('v34_rc_guard',{tag:'循環',blockish:true},1.54);add('v34_rc_attack',{tag:'循環',attackish:true},1.52);add('v34_rc_deep',{tag:'循環',reshufflesMin:2},1.65);add('v34_rc_bottom',{tag:'循環',returnBottom:true},1.58);
  D.V34_RELIC_RULES=clauses;

  D.V34_BUILD_AXES={
    discard:{name:'捨て札',tag:'捨て札',cards:Object.keys(D.CARDS).filter(id=>!before.cards.has(id)&&D.CARDS[id].tags.includes('捨て札')),relics:Object.keys(D.RELICS).filter(id=>!before.relics.has(id)&&D.RELICS[id].tags.includes('捨て札'))},
    multihit:{name:'連撃',tag:'連撃',cards:Object.keys(D.CARDS).filter(id=>!before.cards.has(id)&&D.CARDS[id].tags.includes('連撃')&&!D.CARDS[id].tags.includes('自傷')),relics:Object.keys(D.RELICS).filter(id=>!before.relics.has(id)&&D.RELICS[id].tags.includes('連撃'))},
    status:{name:'状態異常',tag:'状態異常',cards:Object.keys(D.CARDS).filter(id=>!before.cards.has(id)&&D.CARDS[id].tags.includes('状態異常')&&!D.CARDS[id].tags.includes('連撃')),relics:Object.keys(D.RELICS).filter(id=>!before.relics.has(id)&&D.RELICS[id].tags.includes('状態異常'))},
    guard:{name:'耐久',tag:'耐久',cards:['v34_g_citadel','v34_g_retaliate','v34_g_intercept','v34_g_ram','v34_g_recovery','v34_g_perfect'],relics:['v34_rg_core','v34_rg_block','v34_rg_counter','v34_rg_pressure','v34_rg_long','v34_rg_hybrid']},
    blood:{name:'自傷',tag:'自傷',cards:Object.keys(D.CARDS).filter(id=>!before.cards.has(id)&&D.CARDS[id].tags.includes('自傷')),relics:Object.keys(D.RELICS).filter(id=>!before.relics.has(id)&&D.RELICS[id].tags.includes('自傷'))},
    cycle:{name:'循環',tag:'循環',cards:['v34_c_reactor','v34_c_bastion','v34_c_reset','v34_c_return','v34_c_loopguard','v34_c_wheel'],relics:['v34_rc_core','v34_rc_recent','v34_rc_guard','v34_rc_attack','v34_rc_deep','v34_rc_bottom']}
  };
  // Explicit arrays prevent bridge cards from making an axis exceed/undershoot the requested six.
  D.V34_BUILD_AXES.discard.cards=['v34_d_scrap_lance','v34_d_refuse_wall','v34_d_shrapnel','v34_d_salvage_guard','v34_d_landfill','v34_d_afterimage'];
  D.V34_BUILD_AXES.discard.relics=['v34_rd_core','v34_rd_memory','v34_rd_bulwark','v34_rd_arsenal','v34_rd_cycle','v34_rd_crisis'];
  D.V34_BUILD_AXES.multihit.cards=['v34_m_drill','v34_m_guardstorm','v34_m_accel','v34_m_needlefort','v34_m_statusburst','v34_m_final'];
  D.V34_BUILD_AXES.multihit.relics=['v34_rm_core','v34_rm_long','v34_rm_pierce','v34_rm_guard','v34_rm_status','v34_rm_combo'];
  D.V34_BUILD_AXES.status.cards=['v34_s_plague','v34_s_quarantine','v34_s_corrode','v34_s_fever','v34_s_detonate','v34_s_pestwall'];
  D.V34_BUILD_AXES.status.relics=['v34_rs_core','v34_rs_loaded','v34_rs_attack','v34_rs_guard','v34_rs_consume','v34_rs_crisis'];
  D.V34_BUILD_AXES.blood.cards=['v34_b_crimson','v34_b_pressure','v34_b_scarstorm','v34_b_contract','v34_b_revenge','v34_b_terminal'];
  D.V34_BUILD_AXES.blood.relics=['v34_rb_core','v34_rb_low','v34_rb_attack','v34_rb_guard','v34_rb_multi','v34_rb_chain'];

  D.V34_CARD_IDS=Object.keys(D.CARDS).filter(id=>!before.cards.has(id));
  D.V34_RELIC_IDS=Object.keys(D.RELICS).filter(id=>!before.relics.has(id));
})();
