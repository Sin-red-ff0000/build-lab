'use strict';
(function(){
  const BL=window.BuildLab,D=BL.Data;
  const C=(name,tags,desc,extra)=>({name,tags,desc,...extra});
  const R=(name,tags,desc)=>({name,tags,desc});
  const before={cards:new Set(Object.keys(D.CARDS)),relics:new Set(Object.keys(D.RELICS))};

  // v0.35: 全キャラクター/全スタイルのエンドコンテンツ到達性を支える横断強化。
  // 基礎6軸(v0.34)に対し、後発システム8軸にも各6カード+6遺物の選択肢を用意する。
  Object.assign(D.CARDS,{
    // --- 提示位置 ---
    v35_p_center:C('中枢収束砲',['提示操作','単発'],'10ダメージ＋防御8。中央枠で使うと効果が大きく上がる。',{kind:'hybrid',hits:1,damage:10,block:8,armorPierce:0.12,damagePerCenterChain:{value:2,max:6},blockPerCenterChain:{value:2,max:6}}),
    v35_p_wings:C('双翼掃射',['提示操作','連撃'],'4ダメージ×5＋防御9。左右枠で使うと効果が大きく上がる。',{kind:'hybrid',hits:5,damage:4,block:9,armorPierce:0.16,damagePerSideAlternation:{value:1,max:4}}),
    v35_p_shift:C('転軸防陣',['提示操作','耐久'],'防御20。直前と異なる位置を選ぶとさらに強化。',{kind:'block',block:20,blockPerPositionChange:{value:2,max:8}}),
    v35_p_repeat:C('定点破城槌',['提示操作','耐久'],'13ダメージ＋防御11。同じ位置を維持すると増幅。',{kind:'hybrid',hits:1,damage:13,block:11,armorPierce:0.22,damagePerSamePosition:{value:2,max:6},blockPerSamePosition:{value:1,max:3}}),
    v35_p_wide:C('広域観測列',['提示操作','連撃'],'4ダメージ×6＋防御12。提示4枚以上で増幅。',{kind:'hybrid',hits:6,damage:4,block:12,armorPierce:0.18}),
    v35_p_narrow:C('狭域決裁',['提示操作','単発'],'10ダメージ＋防御8。提示2枚以下で増幅。',{kind:'hybrid',hits:1,damage:10,block:8,armorPierce:0.25}),

    // --- 連結 ---
    v35_l_spear:C('継電破城槍',['連結','単発'],'10ダメージ＋防御8。連結成立時に増幅。',{kind:'hybrid',hits:1,damage:10,block:8,armorPierce:0.12}),
    v35_l_guard:C('双極城壁',['連結','耐久'],'防御18。連結成立時に増幅。',{kind:'block',block:18}),
    v35_l_barrage:C('連鎖六連砲',['連結','連撃'],'5ダメージ×6＋防御10。連結成立時に増幅。',{kind:'hybrid',hits:6,damage:5,block:10,armorPierce:0.2}),
    v35_l_cycle:C('帰還継電器',['連結','循環'],'13ダメージ＋防御11。連結成立時に増幅し、使用後は山札下へ戻る。',{kind:'hybrid',hits:1,damage:13,block:11,returnBottom:true}),
    v35_l_status:C('症状継電杭',['連結','状態異常'],'14ダメージ＋防御12＋毒3。連結成立時に増幅。',{kind:'hybrid',hits:1,damage:14,block:12,status:{type:'poison',amount:3},armorPierce:0.18}),
    v35_l_bridge:C('異種架橋機',['連結','万能'],'10ダメージ＋防御8。3タグ以上かつ連結成立時に大幅増幅。',{kind:'hybrid',hits:1,damage:10,block:8,armorPierce:0.25}),

    // --- 調律・役割変換 ---
    v35_c_tuned:C('校正穿孔刃',['調律','単発'],'10ダメージ＋防御8。調律済みなら増幅。',{kind:'hybrid',hits:1,damage:10,block:8,armorPierce:0.12}),
    v35_c_convert:C('変成隔壁',['変換','耐久'],'防御18。役割変換済みなら増幅。',{kind:'block',block:18}),
    v35_c_dual:C('二重校正炉',['調律','変換','万能'],'12ダメージ＋防御10。調律と役割変換を重ねると大幅増幅。',{kind:'hybrid',hits:1,damage:12,block:10,armorPierce:0.2}),
    v35_c_barrage:C('校正連装砲',['調律','連撃'],'3ダメージ×6＋防御11。調律済みなら増幅。',{kind:'hybrid',hits:6,damage:3,block:11,armorPierce:0.22}),
    v35_c_cycle:C('変成回帰殻',['変換','循環'],'14ダメージ＋防御12。役割変換済みなら増幅し、使用後は山札下へ戻る。',{kind:'hybrid',hits:1,damage:14,block:12,returnBottom:true}),
    v35_c_matrix:C('三層校正行列',['調律','変換','万能'],'10ダメージ＋防御8。強化層2つ以上で増幅。',{kind:'hybrid',hits:1,damage:10,block:8,armorPierce:0.25}),

    // --- 構築規格・重複/単独・多タグ ---
    v35_a_single:C('孤立決裁刃',['構築規格'],'10ダメージ＋防御8。同名1枚だけなら増幅。',{kind:'hybrid',hits:1,damage:10,block:8,armorPierce:0.12}),
    v35_a_duplicate:C('複写四連機',['構築規格','重複','連撃'],'4ダメージ×4＋防御9。同名2枚以上なら増幅。',{kind:'hybrid',hits:4,damage:4,block:9,armorPierce:0.16}),
    v35_a_hybrid:C('多相設計核',['構築規格','万能','混成'],'12ダメージ＋防御10。3タグ以上なら増幅。',{kind:'hybrid',hits:1,damage:12,block:10,armorPierce:0.2}),
    v35_a_doctrine:C('規格城壁',['構築規格'],'防御22。構築規格装備中なら増幅。',{kind:'block',block:22}),
    v35_a_variation:C('変奏処刑器',['構築規格'],'14ダメージ＋防御12。直前と異なるカードなら増幅。',{kind:'hybrid',hits:1,damage:14,block:12,armorPierce:0.18}),
    v35_a_cycle:C('設計循環環',['構築規格','循環'],'10ダメージ＋防御8。構築規格装備中なら増幅し、使用後は山札下へ戻る。',{kind:'hybrid',hits:1,damage:10,block:8,returnBottom:true}),

    // --- 特殊個体・複合挙動解析 ---
    v35_x_trait:C('形質破断砲',['特殊個体','解析'],'10ダメージ＋防御8。特殊個体3種以上で増幅。',{kind:'hybrid',hits:1,damage:10,block:8,armorPierce:0.12}),
    v35_x_behavior:C('挙動封鎖壁',['複合挙動','解析','耐久'],'防御18。複合挙動2種以上で増幅。',{kind:'block',block:18}),
    v35_x_apex:C('頂点観測槍',['特殊個体','複合挙動','解析'],'12ダメージ＋防御10。特殊個体5種以上で大幅増幅。',{kind:'hybrid',hits:1,damage:12,block:10,armorPierce:0.2}),
    v35_x_barrage:C('挙動解体連射',['複合挙動','解析','連撃'],'3ダメージ×7＋防御11。複合挙動があると増幅。',{kind:'hybrid',hits:7,damage:3,block:11,armorPierce:0.22}),
    v35_x_clean:C('無垢試験器',['特殊個体','解析'],'14ダメージ＋防御12。特殊個体なしの標準試験で増幅。',{kind:'hybrid',hits:1,damage:14,block:12,armorPierce:0.18}),
    v35_x_total:C('全相解析行列',['特殊個体','複合挙動','解析'],'10ダメージ＋防御8。特殊個体3種＋複合挙動1種以上で増幅。',{kind:'hybrid',hits:1,damage:10,block:8,armorPierce:0.25}),

    // --- ルーン・アルカナ ---
    v35_m_rune:C('刻印破城刃',['ルーン','単発'],'10ダメージ＋防御8。ルーン付与時に増幅。',{kind:'hybrid',hits:1,damage:10,block:8,armorPierce:0.12}),
    v35_m_arcana:C('秘儀城壁',['アルカナ','耐久'],'防御18。アルカナ装備中に増幅。',{kind:'block',block:18}),
    v35_m_match:C('象意共鳴砲',['アルカナ','万能'],'12ダメージ＋防御10。現在のアルカナ条件と一致すると増幅。',{kind:'hybrid',hits:1,damage:12,block:10,armorPierce:0.2}),
    v35_m_barrage:C('刻印星群',['ルーン','連撃'],'3ダメージ×6＋防御11。ルーン付与時に増幅。',{kind:'hybrid',hits:6,damage:3,block:11,armorPierce:0.22}),
    v35_m_plain:C('白紙大秘儀',['アルカナ','単独'],'14ダメージ＋防御12。未強化カードかつアルカナ一致で大幅増幅。',{kind:'hybrid',hits:1,damage:14,block:12,armorPierce:0.18}),
    v35_m_layered:C('重層秘儀機',['ルーン','アルカナ','万能'],'10ダメージ＋防御8。強化層2つ以上＋アルカナ一致で大幅増幅。',{kind:'hybrid',hits:1,damage:10,block:8,armorPierce:0.25}),

    // --- 元素 ---
    v35_e_fire:C('熾火決裁',['元素','火','単発'],'10ダメージ＋防御8。火が最大配分なら増幅。',{kind:'hybrid',hits:1,damage:10,block:8,armorPierce:0.12,status:{type:'burn',amount:3}}),
    v35_e_wind:C('暴風連装',['元素','風','連撃'],'4ダメージ×7＋防御9。風が最大配分なら増幅。',{kind:'hybrid',hits:7,damage:4,block:9,armorPierce:0.16}),
    v35_e_water:C('深水還流壁',['元素','水','循環'],'12ダメージ＋防御10＋HP4回復。水が最大配分なら増幅。',{kind:'hybrid',hits:1,damage:12,block:10,heal:4,returnBottom:true}),
    v35_e_earth:C('大地圧城',['元素','土','耐久'],'13ダメージ＋防御11。土が最大配分なら増幅。',{kind:'hybrid',hits:1,damage:13,block:11,armorPierce:0.22}),
    v35_e_aether:C('第五相共鳴',['元素','エーテル','万能'],'14ダメージ＋防御12。エーテルが最大配分なら増幅。',{kind:'hybrid',hits:1,damage:14,block:12,armorPierce:0.18}),
    v35_e_prism:C('五相プリズム',['元素','万能'],'10ダメージ＋防御8。3元素以上へ配分すると増幅。',{kind:'hybrid',hits:1,damage:10,block:8,armorPierce:0.25}),

    // --- 錬成 ---
    v35_q_opus:C('大業破城砲',['錬成','上位錬成','単発'],'10ダメージ＋防御8。上位錬成物生成後に増幅。',{kind:'hybrid',hits:1,damage:10,block:8,armorPierce:0.12}),
    v35_q_stock:C('備蓄城塞',['錬成','耐久'],'防御18。在庫3種類以上で増幅。',{kind:'block',block:18}),
    v35_q_react:C('反応連鎖砲',['錬成','連撃'],'5ダメージ×6＋防御10。反応3種類以上で増幅。',{kind:'hybrid',hits:6,damage:5,block:10,armorPierce:0.2}),
    v35_q_spend:C('消費転化刃',['錬成','単発'],'13ダメージ＋防御11。2種類以上の錬成物消費後に増幅。',{kind:'hybrid',hits:1,damage:13,block:11,armorPierce:0.22}),
    v35_q_shell:C('大業隔壁',['錬成','上位錬成','耐久'],'防御16。上位錬成物2種類以上生成後に増幅。',{kind:'block',block:16}),
    v35_q_matrix:C('賢者反応行列',['錬成','万能'],'10ダメージ＋防御8。総反応4回以上で増幅。',{kind:'hybrid',hits:1,damage:10,block:8,armorPierce:0.25})
  });

  Object.assign(D.RELICS,{
    // position
    v35_rp_center:R('中枢照準環',['提示操作','中央'],'中央枠カードを大幅強化。'),v35_rp_wings:R('双翼増幅器',['提示操作','左右'],'左右枠カードを大幅強化。'),v35_rp_shift:R('転軸ジャイロ',['提示操作'],'位置を変えたカードを強化。'),v35_rp_repeat:R('定点基台',['提示操作'],'同じ位置を維持したカードを強化。'),v35_rp_wide:R('広域観測鏡',['提示操作'],'提示4枚以上で強化。'),v35_rp_narrow:R('狭域決裁鏡',['提示操作'],'提示2枚以下で強化。'),
    // link
    v35_rl_core:R('継電主核',['連結'],'連結成立カードを強化。'),v35_rl_guard:R('双極装甲',['連結','耐久'],'連結＋防御カードを強化。'),v35_rl_barrage:R('連鎖弾倉',['連結','連撃'],'連結＋多段カードを強化。'),v35_rl_cycle:R('帰還継電環',['連結','循環'],'連結＋循環カードを強化。'),v35_rl_bridge:R('異種接合子',['連結','万能'],'連結した多タグカードを強化。'),v35_rl_pair:R('対カード記憶体',['連結'],'連結ペアそのものを強化。'),
    // calibration
    v35_rc_tune:R('精密調律核',['調律'],'調律済みカードを強化。'),v35_rc_convert:R('変成支持器',['変換'],'役割変換済みカードを強化。'),v35_rc_dual:R('二重校正器',['調律','変換'],'調律＋変換を重ねたカードを大幅強化。'),v35_rc_attack:R('校正砲身',['調律'],'調律済み攻撃カードを強化。'),v35_rc_guard:R('変成装甲',['変換','耐久'],'変換済み防御カードを強化。'),v35_rc_layer:R('三層測定器',['調律','変換'],'強化層2つ以上のカードを強化。'),
    // architecture
    v35_ra_single:R('孤立設計図',['構築規格','単独'],'同名1枚カードを強化。'),v35_ra_dup:R('複写設計図',['構築規格','重複'],'同名2枚以上を強化。'),v35_ra_hybrid:R('多相設計図',['構築規格','万能'],'3タグ以上を強化。'),v35_ra_doctrine:R('規格中枢',['構築規格'],'構築規格装備時に強化。'),v35_ra_variation:R('変奏設計器',['構築規格'],'直前と異なるカードを強化。'),v35_ra_guard:R('規格外殻',['構築規格','耐久'],'規格＋防御カードを強化。'),
    // analysis
    v35_rx_trait:R('形質照準鏡',['特殊個体','解析'],'特殊個体3種以上で強化。'),v35_rx_behavior:R('挙動照準鏡',['複合挙動','解析'],'複合挙動がある敵で強化。'),v35_rx_apex:R('頂点解析核',['特殊個体','複合挙動'],'特殊個体5種以上で大幅強化。'),v35_rx_clean:R('無垢試験鏡',['特殊個体','解析'],'特殊個体なしで強化。'),v35_rx_attack:R('解析砲架',['解析'],'解析系攻撃カードを強化。'),v35_rx_guard:R('解析外殻',['解析','耐久'],'解析系防御カードを強化。'),
    // mystic
    v35_rm_rune:R('刻印主核',['ルーン'],'ルーン付きカードを強化。'),v35_rm_arcana:R('秘儀主核',['アルカナ'],'アルカナ装備中のカードを強化。'),v35_rm_match:R('象意鏡',['アルカナ'],'アルカナ条件一致カードを強化。'),v35_rm_plain:R('白紙秘儀鏡',['アルカナ','単独'],'未強化＋アルカナ一致を強化。'),v35_rm_layer:R('重層秘儀鏡',['ルーン','アルカナ'],'強化層2つ以上＋アルカナ一致を強化。'),v35_rm_guard:R('秘儀障壁核',['アルカナ','耐久'],'アルカナ系防御カードを強化。'),
    // element
    v35_re_fire:R('熾火増幅核',['元素','火'],'火最大配分を強化。'),v35_re_wind:R('暴風増幅核',['元素','風'],'風最大配分を強化。'),v35_re_water:R('深水増幅核',['元素','水'],'水最大配分を強化。'),v35_re_earth:R('大地増幅核',['元素','土'],'土最大配分を強化。'),v35_re_aether:R('第五相増幅核',['元素','エーテル'],'エーテル最大配分を強化。'),v35_re_prism:R('五相増幅プリズム',['元素','万能'],'3元素以上配分を強化。'),
    // alchemy
    v35_rq_opus:R('大業増幅炉',['錬成','上位錬成'],'上位錬成生成後を強化。'),v35_rq_stock:R('備蓄増幅槽',['錬成'],'在庫3種以上を強化。'),v35_rq_react:R('反応増幅器',['錬成'],'反応3種以上を強化。'),v35_rq_spend:R('消費増幅器',['錬成'],'消費2種以上を強化。'),v35_rq_shell:R('大業外殻',['錬成','上位錬成','耐久'],'上位錬成2種以上＋防御を強化。'),v35_rq_matrix:R('賢者増幅行列',['錬成','万能'],'総反応4回以上を強化。')
  });

  D.V35_CARD_RULES={
    v35_p_center:[{when:{position:'center'},mult:1.65}],v35_p_wings:[{when:{positionSide:true},mult:1.55}],v35_p_shift:[{when:{positionChanged:true},mult:1.55}],v35_p_repeat:[{when:{positionSame:true},mult:1.50}],v35_p_wide:[{when:{promptMin:4},mult:1.55}],v35_p_narrow:[{when:{promptMax:2},mult:1.65}],
    // 連結は初回コンボ前にも「ペアを握る」価値を持たせ、成立後に本領を出す二段階設計。
    v35_l_spear:[{when:{pairCard:true},mult:1.48},{when:{linkActive:true},mult:1.66}],v35_l_guard:[{when:{pairCard:true},mult:1.52},{when:{linkActive:true},mult:1.66}],v35_l_barrage:[{when:{pairCard:true},mult:1.42},{when:{linkActive:true},mult:1.60}],v35_l_cycle:[{when:{pairCard:true},mult:1.46},{when:{linkActive:true},mult:1.60}],v35_l_status:[{when:{pairCard:true},mult:1.44},{when:{linkActive:true},mult:1.60}],v35_l_bridge:[{when:{pairCard:true,minTags:3},mult:1.46},{when:{linkActive:true,minTags:3},mult:1.76}],
    v35_c_tuned:[{when:{tuned:true},mult:1.60}],v35_c_convert:[{when:{converted:true},mult:1.60}],v35_c_dual:[{when:{tuned:true,converted:true},mult:1.80}],v35_c_barrage:[{when:{tuned:true},mult:1.55}],v35_c_cycle:[{when:{converted:true},mult:1.55}],v35_c_matrix:[{when:{augmentationMin:2},mult:1.68}],
    v35_a_single:[{when:{copiesMax:1},mult:1.58}],v35_a_duplicate:[{when:{copiesMin:2},mult:1.58}],v35_a_hybrid:[{when:{minTags:3},mult:1.58}],v35_a_doctrine:[{when:{doctrine:true},mult:1.60}],v35_a_variation:[{when:{differentFromLast:true},mult:1.52}],v35_a_cycle:[{when:{doctrine:true},mult:1.55}],
    v35_x_trait:[{when:{enemyTraitsMin:3},mult:1.62}],v35_x_behavior:[{when:{enemyBehaviorsMin:2},mult:1.65}],v35_x_apex:[{when:{enemyTraitsMin:5},mult:1.80}],v35_x_barrage:[{when:{enemyBehaviorsMin:1},mult:1.58}],v35_x_clean:[{when:{enemyTraitsMax:0},mult:1.70}],v35_x_total:[{when:{enemyTraitsMin:3,enemyBehaviorsMin:1},mult:1.72}],
    v35_m_rune:[{when:{runed:true},mult:1.60}],v35_m_arcana:[{when:{arcanaActive:true},mult:1.55}],v35_m_match:[{when:{arcanaMatch:true},mult:1.68}],v35_m_barrage:[{when:{runed:true},mult:1.55}],v35_m_plain:[{when:{plainCard:true,arcanaMatch:true},mult:1.75}],v35_m_layered:[{when:{augmentationMin:2,arcanaMatch:true},mult:1.78}],
    // 元素/錬成は「システムを有効化しているだけ」の基礎補正＋固有条件の本命補正に分離。
    // 条件未達カードが完全な死に札にならず、達成した面は明確に強い。
    v35_e_fire:[{when:{alchemyEnabled:true},mult:1.22},{when:{elementDominant:'fire'},mult:1.62}],v35_e_wind:[{when:{alchemyEnabled:true},mult:1.24},{when:{elementDominant:'air'},mult:1.68}],v35_e_water:[{when:{alchemyEnabled:true},mult:1.22},{when:{elementDominant:'water'},mult:1.62}],v35_e_earth:[{when:{alchemyEnabled:true},mult:1.22},{when:{elementDominant:'earth'},mult:1.62}],v35_e_aether:[{when:{alchemyEnabled:true},mult:1.22},{when:{elementDominant:'aether'},mult:1.62}],v35_e_prism:[{when:{alchemyEnabled:true},mult:1.20},{when:{elementDiversityMin:3},mult:1.68}],
    // 既存元素札もエンドコンテンツで役割を失わないよう、各属性の防御札を主配分時に補強。
    v26_fire_guard:[{when:{elementDominant:'fire'},mult:1.62}],v26_wind_guard:[{when:{elementDominant:'air'},mult:2.05}],v26_water_guard:[{when:{elementDominant:'water'},mult:1.72}],v26_earth_guard:[{when:{elementDominant:'earth'},mult:1.68}],v26_aether_guard:[{when:{elementDominant:'aether'},mult:1.72}],
    v35_q_opus:[{when:{alchemyEnabled:true},mult:1.45},{when:{advancedMaterialMade:true},mult:1.62}],v35_q_stock:[{when:{alchemyEnabled:true},mult:1.52},{when:{materialStockDiversityMin:3},mult:1.62}],v35_q_react:[{when:{alchemyEnabled:true},mult:1.45},{when:{reactionTypesMin:3},mult:1.62}],v35_q_spend:[{when:{alchemyEnabled:true},mult:1.45},{when:{materialDiversityUsedMin:2},mult:1.62}],v35_q_shell:[{when:{alchemyEnabled:true},mult:1.52},{when:{advancedMaterialDiversityMin:2},mult:1.72}],v35_q_matrix:[{when:{alchemyEnabled:true},mult:1.46},{when:{reactionTotalMin:4},mult:1.68}]
  };

  const clauses={};const add=(id,when,mult)=>clauses[id]=[{when,mult}];
  add('v35_rp_center',{position:'center'},1.52);add('v35_rp_wings',{positionSide:true},1.48);add('v35_rp_shift',{positionChanged:true},1.52);add('v35_rp_repeat',{positionSame:true},1.46);add('v35_rp_wide',{promptMin:4},1.50);add('v35_rp_narrow',{promptMax:2},1.56);
  clauses.v35_rl_core=[{when:{pairCard:true},mult:1.26},{when:{linkActive:true},mult:1.50}];clauses.v35_rl_guard=[{when:{pairCard:true,blockish:true},mult:1.30},{when:{linkActive:true,blockish:true},mult:1.55}];add('v35_rl_barrage',{linkActive:true,hitsMin:4},1.54);add('v35_rl_cycle',{linkActive:true,tag:'循環'},1.54);add('v35_rl_bridge',{linkActive:true,minTags:3},1.60);add('v35_rl_pair',{pairCard:true},1.48);
  add('v35_rc_tune',{tuned:true},1.50);add('v35_rc_convert',{converted:true},1.50);add('v35_rc_dual',{tuned:true,converted:true},1.65);add('v35_rc_attack',{tuned:true,attackish:true},1.54);add('v35_rc_guard',{converted:true,blockish:true},1.54);add('v35_rc_layer',{augmentationMin:2},1.58);
  add('v35_ra_single',{copiesMax:1},1.52);add('v35_ra_dup',{copiesMin:2},1.52);add('v35_ra_hybrid',{minTags:3},1.54);add('v35_ra_doctrine',{doctrine:true},1.50);add('v35_ra_variation',{differentFromLast:true},1.48);add('v35_ra_guard',{doctrine:true,blockish:true},1.54);
  add('v35_rx_trait',{enemyTraitsMin:3},1.55);add('v35_rx_behavior',{enemyBehaviorsMin:1},1.55);add('v35_rx_apex',{enemyTraitsMin:5},1.68);add('v35_rx_clean',{enemyTraitsMax:0},1.60);add('v35_rx_attack',{tag:'解析',attackish:true},1.48);add('v35_rx_guard',{tag:'解析',blockish:true},1.50);
  add('v35_rm_rune',{runed:true},1.52);add('v35_rm_arcana',{arcanaActive:true},1.48);add('v35_rm_match',{arcanaMatch:true},1.58);add('v35_rm_plain',{plainCard:true,arcanaMatch:true},1.62);add('v35_rm_layer',{augmentationMin:2,arcanaMatch:true},1.64);add('v35_rm_guard',{tag:'アルカナ',blockish:true},1.50);
  add('v35_re_fire',{elementDominant:'fire'},1.54);add('v35_re_wind',{elementDominant:'air'},1.60);add('v35_re_water',{elementDominant:'water'},1.54);add('v35_re_earth',{elementDominant:'earth'},1.54);add('v35_re_aether',{elementDominant:'aether'},1.54);add('v35_re_prism',{elementDiversityMin:3},1.58);
  clauses.v35_rq_opus=[{when:{alchemyEnabled:true},mult:1.18},{when:{advancedMaterialMade:true},mult:1.55}];clauses.v35_rq_stock=[{when:{alchemyEnabled:true},mult:1.20},{when:{materialStockDiversityMin:3},mult:1.55}];clauses.v35_rq_react=[{when:{alchemyEnabled:true},mult:1.16},{when:{reactionTypesMin:3},mult:1.55}];clauses.v35_rq_spend=[{when:{alchemyEnabled:true},mult:1.16},{when:{materialDiversityUsedMin:2},mult:1.55}];clauses.v35_rq_shell=[{when:{alchemyEnabled:true,blockish:true},mult:1.20},{when:{advancedMaterialDiversityMin:2,blockish:true},mult:1.62}];clauses.v35_rq_matrix=[{when:{alchemyEnabled:true},mult:1.16},{when:{reactionTotalMin:4},mult:1.60}];
  D.V35_RELIC_RULES=clauses;

  D.V35_FAMILIES={
    position:{name:'提示位置',tag:'提示操作',cards:['v35_p_center','v35_p_wings','v35_p_shift','v35_p_repeat','v35_p_wide','v35_p_narrow'],relics:['v35_rp_center','v35_rp_wings','v35_rp_shift','v35_rp_repeat','v35_rp_wide','v35_rp_narrow']},
    link:{name:'連結',tag:'連結',cards:['v35_l_spear','v35_l_guard','v35_l_barrage','v35_l_cycle','v35_l_status','v35_l_bridge'],relics:['v35_rl_core','v35_rl_guard','v35_rl_barrage','v35_rl_cycle','v35_rl_bridge','v35_rl_pair']},
    calibration:{name:'校正',tag:'調律',cards:['v35_c_tuned','v35_c_convert','v35_c_dual','v35_c_barrage','v35_c_cycle','v35_c_matrix'],relics:['v35_rc_tune','v35_rc_convert','v35_rc_dual','v35_rc_attack','v35_rc_guard','v35_rc_layer']},
    architecture:{name:'構築設計',tag:'構築規格',cards:['v35_a_single','v35_a_duplicate','v35_a_hybrid','v35_a_doctrine','v35_a_variation','v35_a_cycle'],relics:['v35_ra_single','v35_ra_dup','v35_ra_hybrid','v35_ra_doctrine','v35_ra_variation','v35_ra_guard']},
    analysis:{name:'敵解析',tag:'解析',cards:['v35_x_trait','v35_x_behavior','v35_x_apex','v35_x_barrage','v35_x_clean','v35_x_total'],relics:['v35_rx_trait','v35_rx_behavior','v35_rx_apex','v35_rx_clean','v35_rx_attack','v35_rx_guard']},
    mystic:{name:'秘儀刻印',tag:'アルカナ',cards:['v35_m_rune','v35_m_arcana','v35_m_match','v35_m_barrage','v35_m_plain','v35_m_layered'],relics:['v35_rm_rune','v35_rm_arcana','v35_rm_match','v35_rm_plain','v35_rm_layer','v35_rm_guard']},
    element:{name:'元素',tag:'元素',cards:['v35_e_fire','v35_e_wind','v35_e_water','v35_e_earth','v35_e_aether','v35_e_prism'],relics:['v35_re_fire','v35_re_wind','v35_re_water','v35_re_earth','v35_re_aether','v35_re_prism']},
    alchemy:{name:'錬成',tag:'錬成',cards:['v35_q_opus','v35_q_stock','v35_q_react','v35_q_spend','v35_q_shell','v35_q_matrix'],relics:['v35_rq_opus','v35_rq_stock','v35_rq_react','v35_rq_spend','v35_rq_shell','v35_rq_matrix']}
  };

  // キャラクター/スタイルの既存コンセプト条件をそのまま使い、後半環境向けの追加倍率を付ける。
  // 後発スタイルは既存V19/V20/V23/V24/V26/V27ルールのwhenをコピーするので、
  // 元のコンセプトを満たさない限りこの補正も発生しない。
  const styleRules={},charRules={};
  const sourceVersions=[19,20,23,24,26,27];
  for(const [sid,st] of Object.entries(D.CHARACTER_STYLES||{})){
    for(const v of sourceVersions){const src=D[`V${v}_STYLE_RULES`]?.[sid];if(src){styleRules[sid]=src.map(x=>({when:{...(x.when||{})},mult:1.26}));break;}}
  }
  for(const [cid] of Object.entries(D.CHARACTERS||{})){
    for(const v of sourceVersions){const src=D[`V${v}_CHARACTER_RULES`]?.[cid];if(src){charRules[cid]=src.map(x=>({when:{...(x.when||{})},mult:1.18}));break;}}
  }
  Object.assign(styleRules,{
    standard_focus:[{when:{position:'center'},mult:1.36}],standard_wings:[{when:{positionSide:true},mult:1.36}],
    combo_catalytic:[{when:{tag:'状態異常'},mult:1.18},{when:{tag:'状態異常',hitsMin:3},mult:1.60}],combo_precision:[{when:{hitsMin:5},mult:1.42}],
    tank_forge:[{when:{upgraded:true},mult:1.30}],tank_tempered:[{when:{upgraded:true},mult:1.38}],
    vector_flux:[{when:{positionChanged:true},mult:1.38}],archive_salvage:[{when:{discarded:true},mult:1.42}],relay_direction:[{when:{linkActive:true},mult:1.38}],
    risk_crisis:[{when:{lowHp:true,selfDamage:true},mult:1.48}],loop_rebirth:[{when:{recentReshuffle:true},mult:1.48}],catalyst_spectrum:[{when:{tag:'状態異常',statusMin:2},mult:1.40}],
    architect_specialist:[{when:{maxTags:1,doctrine:true},mult:1.42}],echo_singleton:[{when:{copiesMax:1},mult:1.42}]
  });
  Object.assign(charRules,{
    standard:[{when:{position:'center'},mult:1.16}],combo:[{when:{hitsMin:3},mult:1.18}],tank:[{when:{upgraded:true},mult:1.18}],vector:[{when:{positionChanged:true},mult:1.16}],archive:[{when:{discarded:true},mult:1.20}],relay:[{when:{linkActive:true},mult:1.18}],risk:[{when:{selfDamageOrLowHp:true},mult:1.20}],loop:[{when:{recentReshuffle:true},mult:1.20}],catalyst:[{when:{tag:'状態異常'},mult:1.18}],architect:[{when:{doctrine:true},mult:1.18}],echo:[{when:{copiesMin:2},mult:1.18}]
  });
  // 深い錬成スタイルは最終条件が成立するまで長い。コンセプトを保ったまま
  // 「一段手前」の条件にも小さな補正を与え、極端な高速敵相手でも立ち上がりを作る。
  const fallback=(id,when,mult=1.18)=>{styleRules[id]=[...(styleRules[id]||[]),{when,mult}];};
  fallback('crucible_core',{alchemyEnabled:true,attackish:true},1.20);
  fallback('crucible_shell',{alchemyEnabled:true,blockish:true},1.22);
  fallback('crucible_sun',{advancedMaterialMade:true},1.22);
  fallback('retort_chain',{reactionTypesMin:2},1.20);
  fallback('retort_branch',{materialDiversityMadeMin:2},1.20);
  fallback('retort_prism',{advancedMaterialMade:true},1.21);
  fallback('alembic_flow',{materialDiversityUsedMin:1},1.20);
  fallback('alembic_attack',{advancedMaterialMade:true,attackish:true},1.22);
  fallback('alembic_support',{advancedMaterialMade:true,blockish:true},1.22);
  fallback('vessel_store',{materialStockDiversityMin:2},1.20);
  fallback('vessel_cycle',{materialStockDiversityMin:2,recentReshuffle:true},1.22);
  fallback('vessel_hold',{materialStockDiversityMin:2},1.18);
  fallback('magnum_opus',{advancedMaterialDiversityMin:1},1.20);
  fallback('magnum_quintessence',{advancedMaterialMade:true,augmentationMin:1},1.22);
  fallback('magnum_union',{reactionTypesMin:3,materialDiversityUsedMin:1},1.22);
  // 元素スタイルも属性ルーンが揃う前から元素配分そのものを運用すれば最低限機能する。
  fallback('ignis_magma',{elementDominant:'fire'},1.16);fallback('ignis_ash',{elementDominant:'fire',lowHp:true},1.18);
  fallback('zephyr_gale',{elementDominant:'air',positionChanged:true},1.42);fallback('zephyr_sand',{elementDominant:'air'},1.38);fallback('zephyr_mist',{elementDominant:'air',positionSide:true},1.38);
  fallback('undine_tide',{elementDominant:'water'},1.34);fallback('undine_tide',{elementDominant:'water',recentReshuffle:true},1.62);fallback('undine_steam',{elementDominant:'water'},1.34);fallback('undine_spring',{elementDominant:'water'},1.34);
  fallback('gaia_bedrock',{elementDominant:'earth',blockish:true},1.24);fallback('gaia_shell',{elementDominant:'earth',blockish:true},1.28);fallback('gaia_ceramic',{elementDominant:'earth',blockish:true},1.28);
  fallback('quinta_pulse',{elementDominant:'aether'},1.16);fallback('quinta_ward',{elementDominant:'aether',blockish:true},1.18);
  fallback('salamander_core',{elementDominant:'fire'},1.18);fallback('salamander_spend',{materialDiversityUsedMin:1},1.18);
  fallback('naiad_stock',{materialStockDiversityMin:2},1.18);fallback('naiad_frost',{elementDominant:'water'},1.18);
  fallback('quint_tri',{elementDiversityMin:3},1.18);fallback('quint_penta',{elementDiversityMin:4},1.20);fallback('quint_react',{reactionTypesMin:2},1.18);
  // 連結は最初の一手（ペアカード）もコンセプト運用として扱い、コンボ成立までを支える。
  fallback('axis_shift',{positionChanged:true},1.58);fallback('relay_direction',{pairCard:true},1.22);fallback('synth_bridge',{pairCard:true,minTags:2},1.20);fallback('gearbox_link',{pairCard:true},1.20);fallback('gearbox_relay',{pairCard:true,recentReshuffle:true},1.20);fallback('braid_tuned',{pairCard:true,tuned:true},1.22);fallback('braid_cycle',{pairCard:true},1.18);fallback('braid_bridge',{pairCard:true,minTags:2},1.22);
  charRules.axis=[...(charRules.axis||[]),{when:{positionChanged:true},mult:1.58}];charRules.zephyr=[...(charRules.zephyr||[]),{when:{elementDominant:'air'},mult:1.25}];charRules.undine=[...(charRules.undine||[]),{when:{elementDominant:'water'},mult:1.25}];charRules.gaia=[...(charRules.gaia||[]),{when:{elementDominant:'earth',blockish:true},mult:1.24}];charRules.relay=[...(charRules.relay||[]),{when:{pairCard:true},mult:1.24}];charRules.retort=[...(charRules.retort||[]),{when:{alchemyEnabled:true},mult:1.20}];charRules.magnum=[...(charRules.magnum||[]),{when:{alchemyEnabled:true},mult:1.20}];
  D.V35_STYLE_RULES=styleRules;D.V35_CHARACTER_RULES=charRules;

  // 各キャラクター/スタイルがどの「主軸」で最終試験を行うか。テストと設計監査の共通定義。
  const charFamily={
    standard:'position',combo:'multihit',tank:'guard',vector:'position',archive:'discard',relay:'link',risk:'blood',loop:'cycle',catalyst:'status',architect:'architecture',echo:'architecture',
    node:'calibration',synth:'architecture',tracer:'analysis',rhythm:'position',gearbox:'link',bulwark:'guard',palette:'status',mirror:'architecture',glyph:'mystic',oracle:'mystic',braid:'link',remnant:'discard',axis:'position',nexus:'analysis',
    ignis:'element',zephyr:'element',undine:'element',gaia:'element',quinta:'element',crucible:'alchemy',retort:'alchemy',alembic:'alchemy',vessel:'alchemy',magnum:'alchemy',salamander:'alchemy',naiad:'alchemy',quint:'element',astral:'mystic',tracker:'analysis'
  };
  D.V35_CHARACTER_FAMILY=charFamily;
  D.V35_CARD_IDS=Object.keys(D.CARDS).filter(id=>!before.cards.has(id));D.V35_RELIC_IDS=Object.keys(D.RELICS).filter(id=>!before.relics.has(id));
})();
