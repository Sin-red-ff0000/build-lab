'use strict';
(function(){
  const BL=window.BuildLab; const D=BL.Data;

  // v0.7 / 第2章後半〜第3章：第2ボスとカード連結。
  D.SYSTEMS.card_link={name:'カード連結システム',desc:'デッキ内の異なる2種類のカードを1組だけ連結。片方の直後にもう片方を使うと「連結コンボ」となり、基本効果が強化される。無料で付け替え可能。'};

  Object.assign(D.CHARACTERS,{
    relay:{id:'relay',name:'リレー',role:'連結・連鎖',hp:69,desc:'連結コンボ成立時、そのカードの基本効果+20%を追加し、防御3を得る。'}
  });

  Object.assign(D.TUNINGS,{
    focus:{name:'焦点調律',tags:['提示操作','調律'],desc:'中央枠から使用する時の基本効果+30%。左右から使用する時は-10%。',effect:'focus',requiresSystem:'card_link'},
    reserve:{name:'保留調律',tags:['提示操作','循環','調律'],desc:'前ターンから持ち越された状態で使用すると基本効果+35%。通常提示から使う時は-8%。',effect:'reserve',requiresSystem:'card_link'},
    relay:{name:'連結調律',tags:['連結','調律'],desc:'連結コンボ成立時の基本効果+30%。連結コンボでない時は-10%。',effect:'relay',requiresSystem:'card_link'}
  });

  Object.assign(D.PROTOCOLS,{
    link_amplifier:{name:'連結増幅規格',tags:['連結'],desc:'連結コンボ時の基本効果+25%。連結していないカードの基本効果-5%。',effect:'link_amplifier'},
    link_guardian:{name:'連結防護規格',tags:['連結','耐久'],desc:'連結コンボ時の基本効果+15%。さらに連結コンボ成立時、防御3を得る。',effect:'link_guardian'},
    adaptive_routing:{name:'適応経路規格',tags:['提示操作','連結'],desc:'前ターンと異なる位置から連結コンボを成立させると基本効果+35%。',effect:'adaptive_routing'},
    tuned_relay:{name:'調律連結規格',tags:['調律','連結'],desc:'調律済みカードで連結コンボを成立させると基本効果+30%。未調律の連結カードは-5%。',effect:'tuned_relay'}
  });

  Object.assign(D.CARDS,{
    // 第2章後半：高再生・高耐性向け
    regen_sever:{name:'再生断ち',tags:['対再生','連撃'],desc:'3ダメージ×4。敵の再生力5以上なら各ヒット+2。',kind:'damage',hits:4,damage:3,damagePerHitIfEnemyRegenMin:{min:5,value:2}},
    cautery_wall:{name:'焼灼防壁',tags:['対再生','状態異常','耐久'],desc:'防御9＋火傷3。敵の再生力5以上なら防御15。',kind:'block',block:9,status:{type:'burn',amount:3},blockIfEnemyRegenMin:{min:5,value:15}},
    sterile_breaker:{name:'無菌破砕',tags:['対耐性'],desc:'8ダメージ。敵の状態異常耐性50%以上なら22ダメージ。',kind:'damage',hits:1,damage:8,damageIfEnemyResistMin:{min:50,value:22}},
    purity_rain:{name:'純化雨',tags:['対耐性','連撃'],desc:'2ダメージ×5。敵の状態異常耐性50%以上なら防御力を50%無視。',kind:'damage',hits:5,damage:2,armorPierceIfEnemyResistMin:{min:50,value:.5}},
    adaptive_guard:{name:'適応防壁',tags:['対再生','対耐性','耐久'],desc:'防御8。敵に再生力があり、かつ状態異常耐性30%以上なら防御19。',kind:'block',block:8,blockIfAdaptiveEnemy:19},
    adaptive_edge:{name:'適応刃',tags:['対再生','対耐性'],desc:'7ダメージ。敵に再生力があり、かつ状態異常耐性30%以上なら24ダメージ。',kind:'damage',hits:1,damage:7,damageIfAdaptiveEnemy:24},

    // 第3章スターター：連結
    link_strike:{name:'連結刃',tags:['連結'],desc:'8ダメージ。連結コンボなら18ダメージ。',kind:'damage',hits:1,damage:8,damageIfLinkedCombo:18},
    link_guard:{name:'連結防壁',tags:['連結','耐久'],desc:'防御8。連結コンボなら防御17。',kind:'block',block:8,blockIfLinkedCombo:17},
    link_barrage:{name:'連結連射',tags:['連結','連撃'],desc:'2ダメージ×3。連結コンボなら×6。',kind:'damage',hits:3,damage:2,hitsIfLinkedCombo:6},
    link_poison:{name:'連結毒',tags:['連結','状態異常'],desc:'毒3。連結コンボなら毒8。',kind:'utility',status:{type:'poison',amount:3},statusIfLinkedCombo:8},

    relay_blade:{name:'継電刃',tags:['連結','提示操作'],desc:'6ダメージ。連結コンボなら20ダメージ。中央枠ならさらに基本効果が伸びやすい。',kind:'damage',hits:1,damage:6,damageIfLinkedCombo:20},
    relay_wall:{name:'継電壁',tags:['連結','耐久'],desc:'防御7。連結コンボなら防御18。',kind:'block',block:7,blockIfLinkedCombo:18},
    relay_burn:{name:'継電火',tags:['連結','状態異常'],desc:'4ダメージ＋火傷2。連結コンボなら火傷7。',kind:'damage',hits:1,damage:4,status:{type:'burn',amount:2},statusIfLinkedCombo:7},
    relay_flurry:{name:'継電乱舞',tags:['連結','連撃'],desc:'2ダメージ×4。連結コンボなら×7。',kind:'damage',hits:4,damage:2,hitsIfLinkedCombo:7},
    linked_bastion:{name:'双極城壁',tags:['連結','耐久','反撃'],desc:'防御8・割合反撃35%。連結コンボなら防御16・割合反撃75%。',kind:'block',block:8,counter:.35,blockIfLinkedCombo:16,counterIfLinkedCombo:.75},
    linked_blood:{name:'血脈連結',tags:['連結','自傷'],desc:'HP3を失い10ダメージ。連結コンボなら27ダメージ。',kind:'damage',hits:1,damage:10,selfDamage:3,damageIfLinkedCombo:27},
    linked_residue:{name:'残滓連結',tags:['連結','捨て札'],desc:'6ダメージ。選ばれず捨てられた時、次のカード+15%。連結コンボなら17ダメージ。',kind:'damage',hits:1,damage:6,onDiscard:{buffNext:.15},damageIfLinkedCombo:17},
    linked_cycle:{name:'輪転連結',tags:['連結','循環'],desc:'7ダメージ。連結コンボなら16ダメージ。山札再構築直後ならさらに扱いやすい。',kind:'damage',hits:1,damage:7,damageIfLinkedCombo:16,damageIfRecentReshuffle:18},
    tuned_link:{name:'調律連結刃',tags:['連結','調律'],desc:'7ダメージ。調律済みなら12ダメージ、連結コンボかつ調律済みなら24ダメージ。',kind:'damage',hits:1,damage:7,damageIfTuned:12,damageIfLinkedAndTuned:24},
    reserve_link:{name:'保留接続',tags:['連結','提示操作','循環'],desc:'6ダメージ。持ち越し状態なら12ダメージ。連結コンボなら18ダメージ。',kind:'damage',hits:1,damage:6,damageIfReserved:12,damageIfLinkedCombo:18},
    link_detonator:{name:'連結爆砕',tags:['連結','状態異常'],desc:'5ダメージ。連結コンボなら敵の状態異常合計値1につき追加1ダメージ。',kind:'damage',hits:1,damage:5,damagePerTotalStatusIfLinked:1},
    link_recovery:{name:'接続回復',tags:['連結','耐久'],desc:'防御6。連結コンボなら防御12＋HP3回復。',kind:'block',block:6,blockIfLinkedCombo:12,healIfLinkedCombo:3}
  });

  Object.assign(D.RELICS,{
    regen_clamp:{name:'再生クランプ',tags:['対再生'],desc:'敵の再生力が5以上なら、攻撃カードの基本効果+18%。'},
    null_lens:{name:'零域レンズ',tags:['対耐性'],desc:'敵の状態異常耐性70%以上なら、すべてのカードの基本効果+20%。'},
    convergence_core:{name:'収束適応核',tags:['対再生','対耐性'],desc:'敵が再生力と状態異常耐性の両方を持つ時、2タグ以上のカードの基本効果+22%。'},
    link_core:{name:'連結核',tags:['連結'],desc:'連結コンボ時の基本効果+20%。'},
    relay_buffer:{name:'継電バッファ',tags:['連結','耐久'],desc:'連結コンボ成立時、防御4。'},
    pair_memory:{name:'対記憶体',tags:['連結'],desc:'連結コンボ成立時、次に使うカードの効果+10%。'},
    linked_tuner:{name:'連結調律器',tags:['連結','調律'],desc:'調律済みカードで連結コンボを成立させる時、基本効果+18%。'},
    relay_prism:{name:'継電プリズム',tags:['連結','提示操作'],desc:'前ターンと異なる位置から連結コンボを成立させる時、基本効果+20%。'},
    twin_guard:{name:'双極装甲',tags:['連結','耐久'],desc:'連結コンボで防御カードを使う時、追加で防御4。'},
    twin_needle:{name:'双極針',tags:['連結','状態異常'],desc:'連結コンボで状態異常を付与する時、その付与量+2。'},
    chain_reserve:{name:'接続保留環',tags:['連結','循環'],desc:'持ち越しカードで連結コンボを成立させる時、次のカードの効果+20%。'},
    adaptive_router:{name:'適応ルータ',tags:['連結','万能'],desc:'敵が特殊個体を2種類以上持つ時、連結コンボの基本効果+20%。'}
  });

  Object.assign(D.TRAITS,{
    hyperregen:{name:'過再生個体',short:'過再生',desc:'最大HP×1.1、再生力+5。',effect:'hyperregen'},
    nullfield:{name:'零域個体',short:'零域',desc:'防御力+3、状態異常耐性+15%。',effect:'nullfield'},
    convergence:{name:'収束個体',short:'収束',desc:'再生力+3、状態異常耐性+10%、速度+0.20。',effect:'convergence'}
  });

  D.POST_BOSS_CARD_IDS.push(
    'regen_sever','cautery_wall','sterile_breaker','purity_rain','adaptive_guard','adaptive_edge',
    'link_strike','link_guard','link_barrage','link_poison','relay_blade','relay_wall','relay_burn','relay_flurry','linked_bastion','linked_blood','linked_residue','linked_cycle','tuned_link','reserve_link','link_detonator','link_recovery'
  );
  D.POST_BOSS_RELIC_IDS.push('regen_clamp','null_lens','convergence_core','link_core','relay_buffer','pair_memory','linked_tuner','relay_prism','twin_guard','twin_needle','chain_reserve','adaptive_router');

  D.BOSS2_REWARD_CARD_IDS=['link_strike','link_guard','link_barrage','link_poison'];
  D.BOSS2_REWARD_RELIC_IDS=['link_core','relay_buffer'];
  D.BOSS2_REWARD_PROTOCOL_IDS=['link_amplifier'];
})();
