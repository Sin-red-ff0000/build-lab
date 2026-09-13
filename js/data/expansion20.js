'use strict';
(function(){
  const BL=window.BuildLab; const D=BL.Data;
  const before={characters:new Set(Object.keys(D.CHARACTERS||{})),styles:new Set(Object.keys(D.CHARACTER_STYLES||{})),relics:new Set(Object.keys(D.RELICS||{})),protocols:new Set(Object.keys(D.PROTOCOLS||{})),tunings:new Set(Object.keys(D.TUNINGS||{})),traits:new Set(Object.keys(D.TRAITS||{})),behaviors:new Set(Object.keys(D.ENEMY_BEHAVIORS||{}))};

  // v0.20 キャラクター +6。第4ボス後のルーン/アルカナと既存システムを橋渡しする。
  Object.assign(D.CHARACTERS,{
    glyph:{id:'glyph',name:'グリフ',role:'ルーン・カード強化',hp:68,desc:'ルーンを刻んだカードの基本効果+24%。調律も設定されている場合さらに+10%。'},
    oracle:{id:'oracle',name:'オラクル',role:'アルカナ・方針転換',hp:70,desc:'アルカナ装備中は全カード+12%。現在の正位置/逆位置条件を満たすカードはさらに+16%。'},
    braid:{id:'braid',name:'ブレイド',role:'調律・連結',hp:67,desc:'調律済みカード+12%。連結コンボ時+16%。両方が重なるとさらに+12%。'},
    remnant:{id:'remnant',name:'レムナント',role:'捨て札・役割変換',hp:72,desc:'一度捨てられたカード+14%。役割変換済み+12%。両条件を満たすとさらに+14%。'},
    axis:{id:'axis',name:'アクシス',role:'提示位置・混成',hp:69,desc:'前ターンと異なる位置のカード+18%。2タグ以上なら+14%。両条件でさらに+10%。'},
    nexus:{id:'nexus',name:'ネクサス',role:'特殊個体・複合挙動',hp:74,desc:'特殊個体特性3種類以上の敵へ+16%。複合挙動がある敵へ+18%。両方ならさらに+10%。'}
  });
  D.V20_CHARACTER_RULES={
    glyph:[{when:{runed:true},mult:1.24},{when:{runed:true,tuned:true},mult:1.10}],
    oracle:[{when:{arcanaActive:true},mult:1.12},{when:{arcanaMatch:true},mult:1.16}],
    braid:[{when:{tuned:true},mult:1.12},{when:{linkActive:true},mult:1.16},{when:{tuned:true,linkActive:true},mult:1.12}],
    remnant:[{when:{discarded:true},mult:1.14},{when:{converted:true},mult:1.12},{when:{discarded:true,converted:true},mult:1.14}],
    axis:[{when:{positionChanged:true},mult:1.18},{when:{minTags:2},mult:1.14},{when:{positionChanged:true,minTags:2},mult:1.10}],
    nexus:[{when:{enemyTraitsMin:3},mult:1.16},{when:{enemyBehaviorsMin:1},mult:1.18},{when:{enemyTraitsMin:3,enemyBehaviorsMin:1},mult:1.10}]
  };

  const styles={
    glyph_force:{id:'glyph_force',character:'glyph',name:'刻印強襲型',tags:['ルーン','攻撃'],desc:'ルーン付き攻撃カード+42%。それ以外のルーンカード+10%。'},
    glyph_guard:{id:'glyph_guard',character:'glyph',name:'刻印守護型',tags:['ルーン','耐久'],desc:'ルーン付き防御・複合カード+45%。'},
    glyph_weave:{id:'glyph_weave',character:'glyph',name:'刻印編成型',tags:['ルーン','混成'],desc:'ルーン付き2タグ以上カード+48%。'},
    oracle_upright:{id:'oracle_upright',character:'oracle',name:'正位観測型',tags:['アルカナ','正位置'],desc:'アルカナ正位置選択中、正位置条件を満たすカード+38%。'},
    oracle_reverse:{id:'oracle_reverse',character:'oracle',name:'逆位観測型',tags:['アルカナ','逆位置'],desc:'アルカナ逆位置選択中、逆位置条件を満たすカード+38%。'},
    oracle_turn:{id:'oracle_turn',character:'oracle',name:'反転観測型',tags:['アルカナ','転換'],desc:'アルカナ装備中、条件を満たすカード+24%。条件外カードも+10%。'},
    braid_tuned:{id:'braid_tuned',character:'braid',name:'調律継電型',tags:['調律','連結'],desc:'調律済みカードの連結コンボ+55%。'},
    braid_cycle:{id:'braid_cycle',character:'braid',name:'輪転継電型',tags:['循環','連結'],desc:'再構築直後の連結コンボ+55%。'},
    braid_bridge:{id:'braid_bridge',character:'braid',name:'異種継電型',tags:['混成','連結'],desc:'2タグ以上の連結コンボ+48%。'},
    remnant_residue:{id:'remnant_residue',character:'remnant',name:'残滓変成型',tags:['捨て札','役割変換'],desc:'一度捨てられた役割変換カード+55%。'},
    remnant_cycle:{id:'remnant_cycle',character:'remnant',name:'残滓輪転型',tags:['捨て札','循環'],desc:'一度捨てられたカードを再構築直後に使うと+52%。'},
    remnant_blood:{id:'remnant_blood',character:'remnant',name:'血痕変成型',tags:['自傷','役割変換'],desc:'役割変換済み自傷カード+48%。'},
    axis_shift:{id:'axis_shift',character:'axis',name:'転軸型',tags:['提示操作'],desc:'前ターンと異なる位置から使うと+42%。'},
    axis_center:{id:'axis_center',character:'axis',name:'中軸混成型',tags:['中央','混成'],desc:'中央枠の2タグ以上カード+48%。'},
    axis_wings:{id:'axis_wings',character:'axis',name:'両翼混成型',tags:['左右','混成'],desc:'左右枠の2タグ以上カード+40%。'},
    nexus_traits:{id:'nexus_traits',character:'nexus',name:'個体接続型',tags:['特殊個体'],desc:'特殊個体特性4種類以上の敵へ+42%。'},
    nexus_behavior:{id:'nexus_behavior',character:'nexus',name:'異相接続型',tags:['複合挙動'],desc:'複合挙動2種類以上の敵へ+45%。'},
    nexus_total:{id:'nexus_total',character:'nexus',name:'全相接続型',tags:['特殊個体','複合挙動'],desc:'特殊個体3種類以上＋複合挙動1種類以上なら+52%。'}
  };
  Object.assign(D.CHARACTER_STYLES,styles);
  D.V20_STYLE_RULES={
    glyph_force:[{when:{runed:true,attackish:true},mult:1.42},{when:{runed:true},mult:1.10}],glyph_guard:[{when:{runed:true,blockish:true},mult:1.45}],glyph_weave:[{when:{runed:true,minTags:2},mult:1.48}],
    oracle_upright:[{when:{arcanaUpright:true,arcanaMatch:true},mult:1.38}],oracle_reverse:[{when:{arcanaReversed:true,arcanaMatch:true},mult:1.38}],oracle_turn:[{when:{arcanaMatch:true},mult:1.24},{when:{arcanaActive:true},mult:1.10}],
    braid_tuned:[{when:{tuned:true,linkActive:true},mult:1.55}],braid_cycle:[{when:{recentReshuffle:true,linkActive:true},mult:1.55}],braid_bridge:[{when:{minTags:2,linkActive:true},mult:1.48}],
    remnant_residue:[{when:{discarded:true,converted:true},mult:1.55}],remnant_cycle:[{when:{discarded:true,recentReshuffle:true},mult:1.52}],remnant_blood:[{when:{converted:true,tag:'自傷'},mult:1.48}],
    axis_shift:[{when:{positionChanged:true},mult:1.42}],axis_center:[{when:{position:'center',minTags:2},mult:1.48}],axis_wings:[{when:{positionSide:true,minTags:2},mult:1.40}],
    nexus_traits:[{when:{enemyTraitsMin:4},mult:1.42}],nexus_behavior:[{when:{enemyBehaviorsMin:2},mult:1.45}],nexus_total:[{when:{enemyTraitsMin:3,enemyBehaviorsMin:1},mult:1.52}]
  };

  // 調律 +8
  Object.assign(D.TUNINGS,{
    v20_rune_tune:{name:'刻印調律',tags:['ルーン','調律'],desc:'ルーン設定カードなら+32%。未設定では-8%。',effect:'v20_rune_tune',requiresUnlock:true},
    v20_arcana_tune:{name:'秘儀調律',tags:['アルカナ','調律'],desc:'現在のアルカナ条件を満たすカードなら+34%。満たさない場合-8%。',effect:'v20_arcana_tune',requiresUnlock:true},
    v20_boss_tune:{name:'決戦調律',tags:['ボス','調律'],desc:'ボス戦なら+32%。通常実験では-8%。',effect:'v20_boss_tune',requiresUnlock:true},
    v20_deep_behavior:{name:'深相調律',tags:['複合挙動','調律'],desc:'複合挙動2種類以上なら+36%。未達では-8%。',effect:'v20_deep_behavior',requiresUnlock:true},
    v20_traitwall:{name:'群体調律',tags:['特殊個体','調律'],desc:'特殊個体特性4種類以上なら+36%。未達では-8%。',effect:'v20_traitwall',requiresUnlock:true},
    v20_link_rune:{name:'符鎖調律',tags:['ルーン','連結','調律'],desc:'ルーン設定カードの連結コンボなら+40%。未達では-10%。',effect:'v20_link_rune',requiresUnlock:true},
    v20_fortune:{name:'運命調律',tags:['アルカナ','調律'],desc:'アルカナ正逆いずれかの条件を満たすカード+28%。条件外-6%。',effect:'v20_fortune',requiresUnlock:true},
    v20_integrated:{name:'統合調律',tags:['混成','調律'],desc:'調律・変換・ルーンのうち2種類以上が重なったカード+38%。それ以外-8%。',effect:'v20_integrated',requiresUnlock:true}
  });
  D.V20_TUNING_RULES={
    v20_rune_tune:{when:{runed:true},hit:1.32,miss:.92},v20_arcana_tune:{when:{arcanaMatch:true},hit:1.34,miss:.92},v20_boss_tune:{when:{enemyIsBoss:true},hit:1.32,miss:.92},v20_deep_behavior:{when:{enemyBehaviorsMin:2},hit:1.36,miss:.92},v20_traitwall:{when:{enemyTraitsMin:4},hit:1.36,miss:.92},v20_link_rune:{when:{runed:true,linkActive:true},hit:1.40,miss:.90},v20_fortune:{when:{arcanaMatch:true},hit:1.28,miss:.94},v20_integrated:{when:{augmentationMin:2},hit:1.38,miss:.92}
  };

  // 遺物 +30
  const relicDefs={
    v20_rune_core:['刻印核',['ルーン'],'ルーン設定カード+16%。',{runed:true},1.16],v20_rune_tuner:['刻印調律器',['ルーン','調律'],'ルーン＋調律カード+28%。',{runed:true,tuned:true},1.28],v20_rune_converter:['刻印変成器',['ルーン','役割変換'],'ルーン＋役割変換カード+28%。',{runed:true,converted:true},1.28],v20_rune_linker:['刻印継電器',['ルーン','連結'],'ルーンカードの連結コンボ+32%。',{runed:true,linkActive:true},1.32],v20_rune_forge:['刻印鍛造器',['ルーン','成長'],'ルーン＋強化済みカード+32%。',{runed:true,upgraded:true},1.32],v20_rune_hunter:['刻印狩猟器',['ルーン','特殊個体'],'ルーンカードは特殊個体2種類以上の敵へ+28%。',{runed:true,enemyTraitsMin:2},1.28],
    v20_arcana_core:['秘儀核',['アルカナ'],'アルカナ装備中、全カード+10%。',{arcanaActive:true},1.10],v20_arcana_match:['秘儀共鳴鏡',['アルカナ'],'現在のアルカナ条件を満たすカード+22%。',{arcanaMatch:true},1.22],v20_upright_lens:['正位レンズ',['アルカナ','正位置'],'正位置選択中+14%。',{arcanaUpright:true},1.14],v20_reverse_lens:['逆位レンズ',['アルカナ','逆位置'],'逆位置選択中+14%。',{arcanaReversed:true},1.14],v20_arcana_link:['秘儀継電器',['アルカナ','連結'],'アルカナ条件を満たす連結コンボ+30%。',{arcanaMatch:true,linkActive:true},1.30],v20_arcana_style:['秘儀様式器',['アルカナ','スタイル'],'派生スタイル＋アルカナ装備中+20%。',{arcanaActive:true,altStyle:true},1.20],
    v20_boss_scope:['決戦照準器',['ボス'],'ボス戦で+18%。',{enemyIsBoss:true},1.18],v20_four_trait:['四相観測器',['特殊個体'],'特殊個体4種類以上の敵へ+25%。',{enemyTraitsMin:4},1.25],v20_two_behavior:['重相観測器',['複合挙動'],'複合挙動2種類以上の敵へ+28%。',{enemyBehaviorsMin:2},1.28],v20_shift_hybrid:['転軸混成器',['提示操作','混成'],'位置変更＋2タグ以上で+28%。',{positionChanged:true,minTags:2},1.28],v20_center_rune:['中軸刻印器',['中央','ルーン'],'中央枠のルーンカード+30%。',{position:'center',runed:true},1.30],v20_residue_rune:['残滓刻印器',['捨て札','ルーン'],'一度捨てられたルーンカード+32%。',{discarded:true,runed:true},1.32],v20_cycle_arcana:['輪転秘儀器',['循環','アルカナ'],'再構築直後＋アルカナ条件一致で+32%。',{recentReshuffle:true,arcanaMatch:true},1.32],v20_status_arcana:['症状秘儀器',['状態異常','アルカナ'],'状態異常2種類以上＋アルカナ装備で+24%。',{statusMin:2,arcanaActive:true},1.24],
    v20_single_rune:['孤刻核',['単独','ルーン'],'同名1枚だけのルーンカード+30%。',{copiesMax:1,runed:true},1.30],v20_duplicate_rune:['複刻核',['重複','ルーン'],'同名2枚以上のルーンカード+30%。',{copiesMin:2,runed:true},1.30],v20_guard_arcana:['守護秘儀器',['耐久','アルカナ'],'防御・複合＋アルカナ条件一致で+28%。',{blockish:true,arcanaMatch:true},1.28],v20_multi_arcana:['連閃秘儀器',['連撃','アルカナ'],'3ヒット以上＋アルカナ条件一致で+28%。',{hitsMin:3,arcanaMatch:true},1.28],v20_forge_arcana:['鍛造秘儀器',['成長','アルカナ'],'強化済み＋アルカナ条件一致で+32%。',{upgraded:true,arcanaMatch:true},1.32],v20_lowhp_arcana:['背水秘儀器',['瀕死','アルカナ'],'HP半分以下＋アルカナ装備で+28%。',{lowHp:true,arcanaActive:true},1.28],v20_plain_core:['無銘核',['標準'],'調律・変換・ルーンがないカード+22%。',{plainCard:true},1.22],v20_aug_core:['重層核',['混成'],'調律・変換・ルーンのうち2種類以上なら+30%。',{augmentationMin:2},1.30],v20_total_core:['統合核',['混成','連結'],'3種類以上の強化層＋連結コンボで+38%。',{augmentationMin:3,linkActive:true},1.38],v20_orbit:['軌道鏡',['提示操作','アルカナ'],'位置変更＋アルカナ条件一致で+30%。',{positionChanged:true,arcanaMatch:true},1.30]
  };
  D.V20_RELIC_RULES={};for(const [id,[name,tags,desc,when,mult]] of Object.entries(relicDefs)){D.RELICS[id]={name,tags,desc};D.V20_RELIC_RULES[id]=[{when,mult}];}

  // プロトコル +15
  const protocolDefs={
    v20_p_rune:['刻印集中規格',['ルーン'],'ルーン設定カード+30%、未設定-6%。',{runed:true},1.30,.94],v20_p_arcana:['秘儀集中規格',['アルカナ'],'アルカナ条件一致+30%、不一致-6%。',{arcanaMatch:true},1.30,.94],v20_p_upright:['正位専攻規格',['アルカナ','正位置'],'正位置選択中+24%、逆位置-8%。',{arcanaUpright:true},1.24,.92],v20_p_reverse:['逆位専攻規格',['アルカナ','逆位置'],'逆位置選択中+24%、正位置-8%。',{arcanaReversed:true},1.24,.92],v20_p_boss:['決戦規格',['ボス'],'ボス戦+30%、通常実験-8%。',{enemyIsBoss:true},1.30,.92],v20_p_deeptrait:['群体攻略規格',['特殊個体'],'特殊個体4種類以上+32%、未達-7%。',{enemyTraitsMin:4},1.32,.93],v20_p_deepbehavior:['重相攻略規格',['複合挙動'],'複合挙動2種類以上+34%、未達-8%。',{enemyBehaviorsMin:2},1.34,.92],v20_p_aug2:['二層強化規格',['混成'],'調律・変換・ルーンのうち2層以上+32%、未達-8%。',{augmentationMin:2},1.32,.92],v20_p_aug3:['三層強化規格',['混成'],'3層すべて重なったカード+45%、未達-10%。',{augmentationMin:3},1.45,.90],v20_p_runelink:['符鎖規格',['ルーン','連結'],'ルーンカードの連結コンボ+38%、未達-8%。',{runed:true,linkActive:true},1.38,.92],v20_p_arcanalink:['秘鎖規格',['アルカナ','連結'],'アルカナ条件一致の連結コンボ+38%、未達-8%。',{arcanaMatch:true,linkActive:true},1.38,.92],v20_p_plain:['無銘規格',['標準'],'未調律・未変換・未ルーンカード+28%、それ以外-6%。',{plainCard:true},1.28,.94],v20_p_orbit:['転軸秘儀規格',['提示操作','アルカナ'],'位置変更＋アルカナ条件一致+36%、未達-8%。',{positionChanged:true,arcanaMatch:true},1.36,.92],v20_p_forge:['符文鍛造規格',['ルーン','成長'],'強化済みルーンカード+40%、未達-10%。',{runed:true,upgraded:true},1.40,.90],v20_p_total:['統合実験規格',['混成','特殊個体'],'2層以上の強化＋特殊個体3種類以上の敵へ+38%、未達-8%。',{augmentationMin:2,enemyTraitsMin:3},1.38,.92]
  };
  D.V20_PROTOCOL_RULES={};for(const [id,[name,tags,desc,when,hit,miss]] of Object.entries(protocolDefs)){D.PROTOCOLS[id]={name,tags,desc,effect:id};D.V20_PROTOCOL_RULES[id]={when,hit,miss};}

  // 特殊個体 +8
  const traitDefs={
    v20_colossus:{name:'超巨躯個体',short:'超巨',desc:'最大HP×1.22、防御力+4。'},v20_executioner:{name:'処刑個体',short:'処刑',desc:'攻撃力×1.28。'},v20_flash:{name:'閃光個体',short:'閃光',desc:'速度+0.65。'},v20_aegis:{name:'神盾個体',short:'神盾',desc:'防御力+7、状態異常耐性+10%。'},v20_bloom:{name:'増殖個体',short:'増殖',desc:'再生力+5。'},v20_voidskin:{name:'虚無皮膜個体',short:'虚無',desc:'状態異常耐性+30%。'},v20_chimera:{name:'混成個体',short:'混成',desc:'最大HP×1.12、攻撃力×1.12、速度+0.25。'},v20_paragon:{name:'極冠個体',short:'極冠',desc:'全能力を中程度強化する第5章上位個体。'}
  };for(const [id,x] of Object.entries(traitDefs))D.TRAITS[id]={...x,effect:id};
  D.V20_TRAIT_RULES={v20_colossus:{hpMult:1.22,defAdd:4},v20_executioner:{atkMult:1.28},v20_flash:{spdAdd:.65},v20_aegis:{defAdd:7,resistAdd:10},v20_bloom:{regenAdd:5},v20_voidskin:{resistAdd:30},v20_chimera:{hpMult:1.12,atkMult:1.12,spdAdd:.25},v20_paragon:{hpMult:1.16,atkMult:1.16,defAdd:4,spdAdd:.35,regenAdd:3,resistAdd:12}};
  D.V20_TRAIT_CONDITIONS={
    v20_colossus:{advanced:false,label:'HP倍率×14以上＋防御倍率×8以上',check:e=>e.hp>=14&&e.def>=8},v20_executioner:{advanced:false,label:'攻撃倍率×14以上',check:e=>e.atk>=14},v20_flash:{advanced:false,label:'速度倍率×5.5以上',check:e=>e.spd>=5.5},v20_aegis:{advanced:true,label:'防御倍率×13以上＋状態異常耐性60%以上',check:e=>e.def>=13&&e.resist>=60},v20_bloom:{advanced:true,label:'再生力12以上',check:e=>e.regen>=12},v20_voidskin:{advanced:true,label:'状態異常耐性95%以上',check:e=>e.resist>=95},v20_chimera:{advanced:true,label:'HP×11 / 攻撃×10 / 速度×3.5以上',check:e=>e.hp>=11&&e.atk>=10&&e.spd>=3.5},v20_paragon:{advanced:true,label:'HP×12 / 攻撃×11 / 防御×10 / 速度×3.5 / 再生9 / 耐性80%以上',check:e=>e.hp>=12&&e.atk>=11&&e.def>=10&&e.spd>=3.5&&e.regen>=9&&e.resist>=80}
  };
  const hpCfg=D.ENEMY_STAT_CONFIG.find(x=>x.key==='hp'),atkCfg=D.ENEMY_STAT_CONFIG.find(x=>x.key==='atk'),defCfg=D.ENEMY_STAT_CONFIG.find(x=>x.key==='def'),spdCfg=D.ENEMY_STAT_CONFIG.find(x=>x.key==='spd'),regenCfg=D.ENEMY_STAT_CONFIG.find(x=>x.key==='regen');if(hpCfg)hpCfg.max=Math.max(hpCfg.max,24);if(atkCfg)atkCfg.max=Math.max(atkCfg.max,16);if(defCfg)defCfg.max=Math.max(defCfg.max,16);if(spdCfg)spdCfg.max=Math.max(spdCfg.max,6);if(regenCfg)regenCfg.max=Math.max(regenCfg.max,14);

  // 複合挙動 +12
  Object.assign(D.ENEMY_BEHAVIORS,{
    v20_bh_colossus_rage:{name:'巨冠激震',requires:['v20_colossus','berserk'],desc:'2ターンごとにそのターンの攻撃+5。',rules:{everyNTurnAttackBonus:{turns:2,amount:5}}},
    v20_bh_execution_flash:{name:'瞬殺連鎖',requires:['v20_executioner','v20_flash'],desc:'3ターンごとに追加行動+1。',rules:{everyNTurnExtraAction:{turns:3,extra:1}}},
    v20_bh_aegis_bloom:{name:'神盾増殖',requires:['v20_aegis','v20_bloom'],desc:'再生時、回復量と同じ障壁を最大14得る。',rules:{healBlockRatio:1,healBlockMax:14}},
    v20_bh_void_fast:{name:'虚閃反応',requires:['v20_voidskin','fast'],desc:'状態異常中は攻撃+4。',rules:{statusAttackBonus:4}},
    v20_bh_chimera_giant:{name:'混成巨体',requires:['v20_chimera','giant'],desc:'HP半分以下で一度だけ攻撃力+5。',rules:{lowHpAtkOnce:5}},
    v20_bh_paragon_omega:{name:'極冠共鳴',requires:['v20_paragon','v19_omega'],desc:'3ターンごとに攻撃+5、障壁12。',rules:{everyNTurnAttackBonus:{turns:3,amount:5},everyNTurnBlock:{turns:3,amount:12}}},
    v20_bh_bloom_clean:{name:'浄化増殖',requires:['v20_bloom','purifier'],desc:'3ターンごとに状態異常を1減らしHP9回復。',rules:{everyNTurnCleanseHeal:{turns:3,amount:1,heal:9}}},
    v20_bh_aegis_rage:{name:'神盾報復',requires:['v20_aegis','berserk'],desc:'状態異常中は攻撃+4。3ターンごとに障壁10。',rules:{statusAttackBonus:4,everyNTurnBlock:{turns:3,amount:10}}},
    v20_bh_flash_regen:{name:'閃光再生',requires:['v20_flash','regenerative'],desc:'前ターンに再生していた場合、追加行動+1。',rules:{healNextExtraAction:true}},
    v20_bh_void_armor:{name:'虚無装甲',requires:['v20_voidskin','armored'],desc:'敵ターン終了時に毒・火傷を1減らし、除去時は障壁12。',rules:{cleanseEnd:{amount:1,block:12}}},
    v20_bh_execution_giant:{name:'巨躯処刑',requires:['v20_executioner','giant'],desc:'HP半分以下で一度だけ攻撃力+6。',rules:{lowHpAtkOnce:6}},
    v20_bh_paragon_apex:{name:'極冠適応',requires:['v20_paragon','apex'],desc:'3ターンごとに全状態異常を1減らしHP10回復。',rules:{everyNTurnCleanseHeal:{turns:3,amount:1,heal:10}}}
  });

  D.V20_CHARACTER_IDS=Object.keys(D.CHARACTERS).filter(id=>!before.characters.has(id));D.V20_STYLE_IDS=Object.keys(D.CHARACTER_STYLES).filter(id=>!before.styles.has(id));D.V20_RELIC_IDS=Object.keys(D.RELICS).filter(id=>!before.relics.has(id));D.V20_PROTOCOL_IDS=Object.keys(D.PROTOCOLS).filter(id=>!before.protocols.has(id));D.V20_TUNING_IDS=Object.keys(D.TUNINGS).filter(id=>!before.tunings.has(id));D.V20_TRAIT_IDS=Object.keys(D.TRAITS).filter(id=>!before.traits.has(id));D.V20_BEHAVIOR_IDS=Object.keys(D.ENEMY_BEHAVIORS).filter(id=>!before.behaviors.has(id));
})();
