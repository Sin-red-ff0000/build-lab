'use strict';
(function(){
  const BL=window.BuildLab, D=BL.Data;
  if(!D)return;
  const patchedCards=[];
  function patchCard(id, patch, deletes=[]){
    const c=D.CARDS[id]; if(!c)return;
    for(const k of deletes)delete c[k];
    Object.assign(c,patch); patchedCards.push(id);
  }

  // v0.22: 完全同効果・単純な数値上位系列を「安定 / 条件大技 / 防御転用 / 循環 / 対装甲 / 代償付き」に分岐。
  // IDは変えず既存セーブ互換を維持する。
  patchCard('residue_shell',{block:5,onDiscard:{block:4,heal:2},desc:'防御5。選ばれず捨てられた時、防御4＋HP2回復。'});
  patchCard('residue_needle',{damage:2,onDiscard:{status:'poison',amount:4},desc:'2ダメージ＋毒2。選ばれず捨てられた時、毒4。'});
  patchCard('salvage_jab',{kind:'hybrid',damage:4,block:4,desc:'4ダメージ＋防御4。最後に捨てられたカードを山札の上へ戻す。'});
  patchCard('v17_salvage_loop',{damage:4,v22Route:'bottom',desc:'4ダメージ。最後に捨てられたカードを山札の上へ戻す。使用後、このカードは山札の一番下へ戻る。'});
  patchCard('venom_lattice',{status:{type:'poison',amount:3},statusIfEnemyHpAbove:{ratio:.5,amount:8},desc:'毒3。敵HPが半分より多いなら毒8。'});

  patchCard('flash_chain',{v22Route:'exclude',desc:'2ダメージ×7。使用後、次の山札再構築まで除外。'});
  patchCard('hyper_chain',{hits:8,damage:1,desc:'1ダメージ×8。ヒット数を最優先する連撃。'});
  patchCard('precise_barrage',{hits:6,damage:2,armorPierce:.35,desc:'2ダメージ×6。防御力を35%無視。'});
  patchCard('ninefold_beat',{hits:9,damage:1,block:4,kind:'hybrid',desc:'1ダメージ×9＋防御4。'});
  patchCard('v18_sevenfold_pierce',{hits:5,damage:3,armorPierce:.55,desc:'3ダメージ×5。防御力を55%無視。'});

  patchCard('bastion_recycle',{block:7,heal:2,desc:'防御7＋HP2回復。直前に捨てられたカード1枚を山札の上へ戻す。'});
  patchCard('scarlet_volley',{hits:6,damage:2,status:{type:'burn',amount:2},desc:'HP2を失い、2ダメージ×6＋火傷2。'});
  patchCard('catalytic_rain',{hits:4,damage:1,ignoreStatusResist:true,desc:'1ダメージ×4。各ヒットで毒1。毒付与は状態異常耐性を無視する。'});
  patchCard('ailment_guard',{block:5,blockPerStatusType:4,desc:'防御5。敵の状態異常1種類につき防御+4。'});
  patchCard('v17_venom_fan',{hits:3,damage:3,perHitStatus:{type:'poison',amount:1},desc:'3ダメージ×3。各ヒットで毒1。直接火力寄りの毒連撃。'});
  patchCard('tuned_multi',{hits:4,damage:1,hitsIfTuned:8,desc:'1ダメージ×4。調律済みなら×8。'});
  patchCard('link_cycle_barrage',{hits:4,damage:1,hitsIfLinkedCombo:8,v22Route:'bottom',desc:'1ダメージ×4。連結コンボなら×8。使用後、このカードは山札の一番下へ戻る。'});
  patchCard('relay_shield',{block:5,blockIfLinkedCombo:20,desc:'防御5。連結コンボなら防御20。'});
  patchCard('toxin_saw',{damageIfPoison:5,desc:'2ダメージ×4。敵が毒状態なら1発5ダメージ。'},['damageIfStatus']);
  patchCard('singular_focus',{damage:5,damageIfUniqueCopy:23,block:3,kind:'hybrid',desc:'5ダメージ＋防御3。同名1枚だけなら23ダメージ。'});
  patchCard('return_edge_ii',{damage:5,damageIfRecentReshuffle:24,v22Route:'bottom',desc:'5ダメージ。山札再構築直後なら24ダメージ。使用後、このカードは山札の一番下へ戻る。'});
  patchCard('v17_sixfold_needle',{hits:7,damage:1,block:5,kind:'hybrid',desc:'1ダメージ×7＋防御5。'});
  patchCard('v18_crisis_storm',{hits:6,damage:1,lowHpHits:11,selfDamage:2,desc:'HP2を失い1ダメージ×6。HP半分以下なら×11。'});

  // 代表的な「後発ほど数字だけ大きい」系列も役割分岐。
  patchCard('blood_pike',{damage:19,armorPierce:.35,desc:'HP3を失い19ダメージ。防御力を35%無視。'});
  patchCard('v17_blood_cannon',{damage:25,selfDamage:4,v22Route:'exclude',desc:'HP4を失い25ダメージ。使用後、次の山札再構築まで除外。'});
  patchCard('v18_blood_breaker',{damage:18,selfDamage:3,armorPierce:.70,desc:'HP3を失い18ダメージ。防御力を70%無視。'});
  patchCard('venom_pressure',{damage:3,status:{type:'poison',amount:6},desc:'3ダメージ＋毒6。直接火力を落として毒へ寄せる。'});
  patchCard('v17_deep_venom',{damage:7,status:{type:'poison',amount:4},ignoreStatusResist:true,desc:'7ダメージ＋毒4。毒付与は状態異常耐性を無視する。'});
  patchCard('v18_toxic_brand',{damage:5,status:{type:'poison',amount:8},v22Route:'exclude',desc:'5ダメージ＋毒8。使用後、次の山札再構築まで除外。'});

  patchCard('scar_guard',{block:11,fixedCounter:5,desc:'HP2を失い、防御11。被ダメージ時に固定5ダメージを返す。'});
  patchCard('v17_scar_bulwark',{block:16,selfDamage:3,desc:'HP3を失い、防御16。高防御・高負荷型。'});
  patchCard('v18_scar_fort',{block:12,selfDamage:1,desc:'HP1を失い、防御12。自傷を最小限に抑える。'});

  patchCard('ember_mesh',{block:6,status:{type:'burn',amount:4},desc:'防御6＋火傷4。'});
  patchCard('v17_ember_shell',{block:7,status:{type:'burn',amount:5},desc:'防御7＋火傷5。症状寄りの火障壁。'});
  patchCard('v18_burning_shell',{block:11,status:{type:'burn',amount:2},desc:'防御11＋火傷2。防御寄りの火障壁。'});

  patchCard('brink_strike',{damage:6,lowHpDamage:26,desc:'6ダメージ。HP半分以下なら26ダメージ。通常時を捨てた臨界型。'});
  patchCard('v17_brink_avalanche',{damage:9,lowHpDamage:23,armorPierce:.45,desc:'9ダメージ。HP半分以下なら23ダメージ。防御力を45%無視。'});

  patchCard('return_blade',{damage:8,damageIfRecentReshuffle:18,block:4,kind:'hybrid',desc:'8ダメージ＋防御4。山札再構築直後なら18ダメージ。'});
  patchCard('v17_return_needle',{damage:6,damageIfRecentReshuffle:25,armorPierce:.35,desc:'6ダメージ。山札再構築直後なら25ダメージ。防御力を35%無視。'});
  patchCard('v18_return_spear',{damage:9,damageIfRecentReshuffle:22,nextBuffAfterUse:.12,desc:'9ダメージ。山札再構築直後なら22ダメージ。使用後、次カード+12%。'});

  patchCard('v17_cycle_poison',{status:{type:'poison',amount:2},statusIfRecentReshuffle:11,desc:'毒2。山札再構築直後なら毒11。'});
  patchCard('cycle_venom_ii',{status:{type:'poison',amount:4},statusIfRecentReshuffle:8,desc:'毒4。山札再構築直後なら毒8。'});

  patchCard('v17_return_wall',{block:7,blockIfRecentReshuffle:24,desc:'防御7。山札再構築直後なら防御24。'});
  patchCard('v18_return_guard',{block:11,blockIfRecentReshuffle:21,heal:1,desc:'防御11＋HP1回復。山札再構築直後なら防御21。'});

  patchCard('v17_deep_wall',{block:7,blockIfTurnMin:{turn:5,value:25},desc:'防御7。5ターン目以降なら防御25。晩成特化。'});
  patchCard('v18_late_bastion',{block:12,blockIfTurnMin:{turn:6,value:24},desc:'防御12。6ターン目以降なら防御24。序盤安定型。'});

  patchCard('v17_symptom_breaker',{damage:5,damagePerStatusType:8,desc:'5ダメージ。敵の状態異常種類数1つにつき+8ダメージ。'});
  patchCard('v18_symptom_hammer',{damage:10,damagePerStatusType:5,armorPierce:.25,desc:'10ダメージ。敵の状態異常種類数1つにつき+5ダメージ。防御力を25%無視。'});

  patchCard('v17_residue_spear',{damage:5,damageIfDiscarded:25,desc:'5ダメージ。一度捨てられていれば25ダメージ。'});
  patchCard('v18_residue_cannon',{damage:11,damageIfDiscarded:22,block:3,kind:'hybrid',desc:'11ダメージ＋防御3。一度捨てられていれば22ダメージ。'});

  patchCard('tuning_guard_ii',{block:5,blockIfTuned:22,desc:'防御5。調律中なら防御22。'});
  patchCard('v18_tuning_bastion',{block:10,blockIfTuned:19,nextBuffAfterUse:.08,desc:'防御10。調律中なら防御19。使用後、次カード+8%。'});
  patchCard('doctrine_wall_ii',{block:5,blockIfDoctrine:21,desc:'防御5。構築規格を装備中なら防御21。'});
  patchCard('v18_doctrine_guard',{block:10,blockIfDoctrine:19,heal:1,desc:'防御10＋HP1回復。構築規格を装備中なら防御19。'});
  patchCard('conversion_burst_ii',{damage:5,damageIfConverted:23,desc:'5ダメージ。役割変換中なら23ダメージ。'});
  patchCard('v18_conversion_lance',{damage:10,damageIfConverted:20,armorPierce:.30,desc:'10ダメージ。役割変換中なら20ダメージ。防御力を30%無視。'});
  patchCard('behavior_lance_ii',{damage:6,damageIfEnemyBehavior:27,desc:'6ダメージ。敵に複合挙動があるなら27ダメージ。'});
  patchCard('v18_behavior_hammer',{damage:12,damageIfEnemyBehavior:23,armorPierceIfEnemyBehavior:.45,desc:'12ダメージ。敵に複合挙動があるなら23ダメージ＋防御力45%無視。'});

  // 遺物：常時の小差を、安定 / 高閾値 / 長期 / 複合条件へ分ける。
  const relicDesc={
    thin_deck_sensor:'山札2枚以下なら+12%。山札再構築直後のカードは+18%。薄い山札と再起動の2経路を持つ。',
    center_compass:'中央枠+12%。前ターンと違う位置から中央へ移った場合はさらに+18%。',
    residue_memory:'一度捨てられたカード+14%。山札再構築直後ならさらに+18%。',
    scar_lens:'自傷カード+10%。HP半分以下の自傷カードはさらに+28%。',
    brink_reactor:'HP半分以下の攻撃カード+30%。防御・補助には乗らない。',
    loop_core:'山札再構築1回につき+5%（最大+40%）。長期戦ほど伸びる。',
    multihit_lens:'4ヒット以上+16%。5ヒット以上だけを狙う遺物より対象が広い。',
    status_matrix:'敵の状態異常1種類につき+9%（最大+27%）。',
    focal_core:'中央枠+12%。前ターンが左右枠ならさらに+22%。',
    v19_extreme_lens:'提示2枚以下で+18%。さらにHP半分以下なら+18%。',
    v20_two_behavior:'複合挙動2種類以上で+18%。3種類以上ならさらに+20%。',
    spill_engine:'このターン捨てられた枚数1枚につき+5%（最大+40%）。大量廃棄向け。'
  };
  for(const [id,desc] of Object.entries(relicDesc))if(D.RELICS[id])D.RELICS[id].desc=desc;
  D.V22_RELIC_RULES={
    thin_deck_sensor:[{when:{recentReshuffle:true},mult:1.18}],
    center_compass:[{when:{position:'center',positionChanged:true},mult:1.18}],
    residue_memory:[{when:{discarded:true,recentReshuffle:true},mult:1.18}],
    scar_lens:[{when:{lowHp:true,selfDamage:true},mult:1.28}],
            focal_core:[{when:{position:'center',positionChanged:true},mult:1.22}],
    v19_extreme_lens:[{when:{promptMax:2,lowHp:true},mult:1.18}],
    v20_two_behavior:[{when:{enemyBehaviorsMin:3},mult:1.20}]
  };

  // 既存の旧倍率を抑えて「追加条件で伸びる」形へするための上書き係数。


  if(D.V19_RELIC_RULES?.v19_extreme_lens?.[0])D.V19_RELIC_RULES.v19_extreme_lens[0].mult=1.18;
  if(D.V20_RELIC_RULES?.v20_two_behavior?.[0])D.V20_RELIC_RULES.v20_two_behavior[0].mult=1.18;

  // プロトコル：IVは橋渡し、Vは単一軸ハイリスクへ再設計。
  const bridges={
    v17_p_discard:['捨て札','循環','残滓架橋規格 IV','捨て札または循環+14%、両方なら+34%。それ以外-4%。'],
    v17_p_multi:['連撃','状態異常','多段侵蝕規格 IV','連撃または状態異常+14%、両方なら+34%。それ以外-4%。'],
    v17_p_status:['状態異常','循環','症状再帰規格 IV','状態異常または循環+14%、両方なら+34%。それ以外-4%。'],
    v17_p_guard:['耐久','反撃','反照堅守規格 IV','耐久または反撃+14%、両方なら+34%。それ以外-4%。'],
    v17_p_blood:['自傷','連撃','血雨架橋規格 IV','自傷または連撃+15%、両方なら+36%。それ以外-5%。'],
    v17_p_cycle:['循環','捨て札','循環残滓規格 IV','循環または捨て札+14%、両方なら+34%。それ以外-4%。']
  };
  for(const [id,[a,b,name,desc]] of Object.entries(bridges)){
    if(D.PROTOCOLS[id])Object.assign(D.PROTOCOLS[id],{name,tags:[a,b],desc});
    if(D.V14_PROTOCOL_RULES?.[id])D.V14_PROTOCOL_RULES[id]={tags:[a,b],single:id==='v17_p_blood'?1.15:1.14,double:id==='v17_p_blood'?1.36:1.34,miss:id==='v17_p_blood'?.95:.96};
  }
  const focusV={
    v18_p_discard:['捨て札',1.27,'残滓集中規格 V','捨て札タグ+27%。それ以外-12%。単一軸へ大きく寄せる。'],
    v18_p_multi:['連撃',1.27,'多段集中規格 V','連撃タグ+27%。それ以外-12%。単一軸へ大きく寄せる。'],
    v18_p_status:['状態異常',1.27,'症状集中規格 V','状態異常タグ+27%。それ以外-12%。単一軸へ大きく寄せる。'],
    v18_p_guard:['耐久',1.27,'堅守集中規格 V','耐久タグ+27%。それ以外-12%。単一軸へ大きく寄せる。'],
    v18_p_blood:['自傷',1.30,'血脈集中規格 V','自傷タグ+30%。それ以外-14%。単一軸へ大きく寄せる。'],
    v18_p_cycle:['循環',1.27,'循環集中規格 V','循環タグ+27%。それ以外-12%。単一軸へ大きく寄せる。']
  };
  for(const [id,[tag,mult,name,desc]] of Object.entries(focusV)){
    if(D.PROTOCOLS[id])Object.assign(D.PROTOCOLS[id],{name,tags:[tag],desc});
    if(D.V14_PROTOCOL_RULES?.[id])D.V14_PROTOCOL_RULES[id]={tags:[tag],single:mult,double:mult,miss:id==='v18_p_blood'?.86:.88};
  }

  // 後発の高倍率規格はさらに狭い条件へ。前世代が完全に不要にならないようにする。
  const pPatch={
    v19_p_multi:{name:'多段専攻規格',desc:'4ヒット以上+32%。3ヒット以下-8%。ヒット数条件に特化。'},
    v19_p_status:{name:'多相症状規格',desc:'状態異常2種類以上で+32%。未達-8%。敵側条件へ特化。'},
    v19_p_guard:{name:'城塞専攻規格',desc:'防御・複合+30%。攻撃専用カード-9%。'},
    v19_p_cycle:{name:'再起増幅規格',desc:'再構築直後+38%。それ以外-9%。一手だけを大きく伸ばす。'},
    v20_p_rune:{name:'刻印集中規格',desc:'ルーン設定カード+34%、未設定-9%。'},
    v20_p_arcana:{name:'秘儀集中規格',desc:'アルカナ条件一致+34%、不一致-9%。'}
  };
  for(const [id,x] of Object.entries(pPatch))if(D.PROTOCOLS[id])Object.assign(D.PROTOCOLS[id],x);
  if(D.V19_PROTOCOL_RULES){
    if(D.V19_PROTOCOL_RULES.v19_p_multi)Object.assign(D.V19_PROTOCOL_RULES.v19_p_multi,{hit:1.32,miss:.92});
    if(D.V19_PROTOCOL_RULES.v19_p_status)Object.assign(D.V19_PROTOCOL_RULES.v19_p_status,{hit:1.32,miss:.92});
    if(D.V19_PROTOCOL_RULES.v19_p_guard)Object.assign(D.V19_PROTOCOL_RULES.v19_p_guard,{hit:1.30,miss:.91});
    if(D.V19_PROTOCOL_RULES.v19_p_cycle)Object.assign(D.V19_PROTOCOL_RULES.v19_p_cycle,{hit:1.38,miss:.91});
  }
  if(D.V20_PROTOCOL_RULES){
    if(D.V20_PROTOCOL_RULES.v20_p_rune)Object.assign(D.V20_PROTOCOL_RULES.v20_p_rune,{hit:1.34,miss:.91});
    if(D.V20_PROTOCOL_RULES.v20_p_arcana)Object.assign(D.V20_PROTOCOL_RULES.v20_p_arcana,{hit:1.34,miss:.91});
  }

  D.BALANCE22={
    audited:{cards:Object.keys(D.CARDS).length,relics:Object.keys(D.RELICS).length,protocols:Object.keys(D.PROTOCOLS).length},
    patchedCards:[...new Set(patchedCards)],
    patchedRelics:Object.keys(relicDesc),
    patchedProtocols:[...Object.keys(bridges),...Object.keys(focusV),...Object.keys(pPatch)]
  };
})();
