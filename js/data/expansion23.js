'use strict';
(function(){
  const BL=window.BuildLab,D=BL.Data,A=D.ALCHEMY;
  const before={characters:new Set(Object.keys(D.CHARACTERS||{})),styles:new Set(Object.keys(D.CHARACTER_STYLES||{})),relics:new Set(Object.keys(D.RELICS||{})),protocols:new Set(Object.keys(D.PROTOCOLS||{})),tunings:new Set(Object.keys(D.TUNINGS||{})),traits:new Set(Object.keys(D.TRAITS||{})),behaviors:new Set(Object.keys(D.ENEMY_BEHAVIORS||{})),runes:new Set(Object.keys(D.RUNES||{}))};

  D.ELEMENT_INFO={
    fire:{name:'火',tag:'火元素',theme:'攻撃・自傷・瞬間火力'},
    air:{name:'風',tag:'風元素',theme:'連撃・位置変更・速度'},
    water:{name:'水',tag:'水元素',theme:'循環・回復・状態異常'},
    earth:{name:'土',tag:'土元素',theme:'防御・反撃・成長'},
    aether:{name:'エーテル',tag:'第五元素',theme:'ルーン・アルカナ・複合強化'}
  };
  D.getCardElement=function(state,cardId){const r=D.getCardRune?.(state,cardId);return r?.element||null;};
  D.getElementAllocation=function(state,id){return Number(state?.alchemy?.allocation?.[id]||0);};
  D.getDominantElements=function(state){const a=state?.alchemy?.allocation||{},vals=Object.keys(D.ELEMENT_INFO).map(id=>[id,Number(a[id]||0)]),max=Math.max(0,...vals.map(x=>x[1]));return max>0?vals.filter(x=>x[1]===max).map(x=>x[0]):[];};

  // 元素ルーン：既存カードへ元素属性を与える。属性自体は既存タグ数に含めず、元素専用条件から参照する。
  Object.assign(D.RUNES,{
    v23_rune_fire:{id:'v23_rune_fire',name:'火印のルーン',tags:['ルーン','元素','火'],element:'fire',desc:'カードへ火属性を付与。火配分3以上かつ攻撃系なら基本効果+25%。',when:{cardElement:'fire',elementMin:{fire:3},attackish:true},hit:1.25,requiresUnlock:true},
    v23_rune_air:{id:'v23_rune_air',name:'風環のルーン',tags:['ルーン','元素','風'],element:'air',desc:'カードへ風属性を付与。風配分3以上かつ3ヒット以上なら基本効果+24%。',when:{cardElement:'air',elementMin:{air:3},hitsMin:3},hit:1.24,requiresUnlock:true},
    v23_rune_water:{id:'v23_rune_water',name:'水脈のルーン',tags:['ルーン','元素','水'],element:'water',desc:'カードへ水属性を付与。水配分3以上かつ再構築直後なら基本効果+30%。',when:{cardElement:'water',elementMin:{water:3},recentReshuffle:true},hit:1.30,requiresUnlock:true},
    v23_rune_earth:{id:'v23_rune_earth',name:'地脈のルーン',tags:['ルーン','元素','土'],element:'earth',desc:'カードへ土属性を付与。土配分3以上かつ防御・複合カードなら基本効果+27%。',when:{cardElement:'earth',elementMin:{earth:3},blockish:true},hit:1.27,requiresUnlock:true},
    v23_rune_aether:{id:'v23_rune_aether',name:'星幽のルーン',tags:['ルーン','元素','エーテル'],element:'aether',desc:'カードへエーテル属性を付与。エーテル配分2以上かつ強化層2つ以上なら基本効果+28%。',when:{cardElement:'aether',elementMin:{aether:2},augmentationMin:2},hit:1.28,requiresUnlock:true}
  });

  // 元素キャラクター +5
  Object.assign(D.CHARACTERS,{
    ignis:{id:'ignis',name:'イグニス',role:'火元素・瞬間出力',hp:66,desc:'火属性カード+18%。火が最多配分なら攻撃系カードをさらに+12%。'},
    zephyr:{id:'zephyr',name:'ゼファー',role:'風元素・位置連撃',hp:68,desc:'風属性カード+18%。風が最多配分なら位置変更したカードをさらに+12%。'},
    undine:{id:'undine',name:'ウンディーネ',role:'水元素・循環',hp:72,desc:'水属性カード+18%。水が最多配分なら再構築直後のカードをさらに+14%。'},
    gaia:{id:'gaia',name:'ガイア',role:'土元素・耐久',hp:78,desc:'土属性カード+18%。土が最多配分なら防御・複合カードをさらに+12%。'},
    quinta:{id:'quinta',name:'クインタ',role:'第五元素・統合',hp:70,desc:'エーテル属性カード+20%。エーテル配分3以上なら強化層2つ以上のカードをさらに+12%。'}
  });
  D.V23_CHARACTER_RULES={
    ignis:[{when:{cardElement:'fire'},mult:1.18},{when:{elementDominant:'fire',attackish:true},mult:1.12}],
    zephyr:[{when:{cardElement:'air'},mult:1.18},{when:{elementDominant:'air',positionChanged:true},mult:1.12}],
    undine:[{when:{cardElement:'water'},mult:1.18},{when:{elementDominant:'water',recentReshuffle:true},mult:1.14}],
    gaia:[{when:{cardElement:'earth'},mult:1.18},{when:{elementDominant:'earth',blockish:true},mult:1.12}],
    quinta:[{when:{cardElement:'aether'},mult:1.20},{when:{elementMin:{aether:3},augmentationMin:2},mult:1.12}]
  };

  const styles={
    ignis_furnace:{id:'ignis_furnace',character:'ignis',name:'炉心型',tags:['元素','火','攻撃'],desc:'火が最多配分かつ攻撃系カードなら+42%。'},
    ignis_magma:{id:'ignis_magma',character:'ignis',name:'溶岩型',tags:['元素','火','錬成'],desc:'溶岩を1個以上生成済みなら火属性カード+50%。'},
    ignis_ash:{id:'ignis_ash',character:'ignis',name:'灰燼型',tags:['元素','火','瀕死'],desc:'火属性カードはHP半分以下なら+48%。'},
    zephyr_gale:{id:'zephyr_gale',character:'zephyr',name:'疾風型',tags:['元素','風','提示操作'],desc:'風が最多配分かつ前回と異なる位置なら+42%。'},
    zephyr_sand:{id:'zephyr_sand',character:'zephyr',name:'砂塵型',tags:['元素','風','錬成'],desc:'砂塵を生成済みなら風属性カード+48%。'},
    zephyr_mist:{id:'zephyr_mist',character:'zephyr',name:'霧流型',tags:['元素','風','水','錬成'],desc:'霧滴を生成済みなら左右枠のカード+40%。'},
    undine_tide:{id:'undine_tide',character:'undine',name:'潮汐型',tags:['元素','水','循環'],desc:'水が最多配分かつ再構築直後のカード+48%。'},
    undine_steam:{id:'undine_steam',character:'undine',name:'蒸気型',tags:['元素','水','火','錬成'],desc:'蒸気を生成済みなら水属性カード+46%。'},
    undine_spring:{id:'undine_spring',character:'undine',name:'泉脈型',tags:['元素','水','エーテル'],desc:'貯水結晶を生成済みなら水属性カード+50%。'},
    gaia_bedrock:{id:'gaia_bedrock',character:'gaia',name:'岩盤型',tags:['元素','土','耐久'],desc:'土が最多配分かつ防御・複合カード+45%。'},
    gaia_shell:{id:'gaia_shell',character:'gaia',name:'岩殻型',tags:['元素','土','錬成'],desc:'岩殻を生成済みなら土属性カード+50%。'},
    gaia_ceramic:{id:'gaia_ceramic',character:'gaia',name:'焼成型',tags:['元素','土','成長'],desc:'陶殻を生成済みかつ強化済みカードなら+52%。'},
    quinta_pulse:{id:'quinta_pulse',character:'quinta',name:'周期型',tags:['元素','エーテル','錬成'],desc:'周期結晶を生成済みならエーテル属性カード+50%。'},
    quinta_ward:{id:'quinta_ward',character:'quinta',name:'障壁型',tags:['元素','エーテル','耐久'],desc:'時限障壁を生成済みなら防御・複合カード+44%。'},
    quinta_prism:{id:'quinta_prism',character:'quinta',name:'五相型',tags:['元素','エーテル','混成'],desc:'4種類以上の元素へ1点以上配分し、強化層2つ以上なら+48%。'}
  };
  Object.assign(D.CHARACTER_STYLES,styles);
  D.V23_STYLE_RULES={
    ignis_furnace:[{when:{elementDominant:'fire',attackish:true},mult:1.42}],ignis_magma:[{when:{materialMade:'lava',cardElement:'fire'},mult:1.50}],ignis_ash:[{when:{cardElement:'fire',lowHp:true},mult:1.48}],
    zephyr_gale:[{when:{elementDominant:'air',positionChanged:true},mult:1.42}],zephyr_sand:[{when:{materialMade:'sand',cardElement:'air'},mult:1.48}],zephyr_mist:[{when:{materialMade:'mist',positionSide:true},mult:1.40}],
    undine_tide:[{when:{elementDominant:'water',recentReshuffle:true},mult:1.48}],undine_steam:[{when:{materialMade:'steam',cardElement:'water'},mult:1.46}],undine_spring:[{when:{materialMade:'spring',cardElement:'water'},mult:1.50}],
    gaia_bedrock:[{when:{elementDominant:'earth',blockish:true},mult:1.45}],gaia_shell:[{when:{materialMade:'shell',cardElement:'earth'},mult:1.50}],gaia_ceramic:[{when:{materialMade:'ceramic',upgraded:true},mult:1.52}],
    quinta_pulse:[{when:{materialMade:'pulse',cardElement:'aether'},mult:1.50}],quinta_ward:[{when:{materialMade:'ward',blockish:true},mult:1.44}],quinta_prism:[{when:{elementDiversityMin:4,augmentationMin:2},mult:1.48}]
  };

  // 調律 +10：各元素に「属性一致」と「元素らしい運用」の2系統。
  Object.assign(D.TUNINGS,{
    v23_fire_mark:{name:'火印調律',tags:['元素','火','調律'],desc:'火属性カード+34%。火属性でなければ-8%。',effect:'v23_fire_mark',requiresUnlock:true},
    v23_fire_core:{name:'炉心調律',tags:['元素','火','攻撃','調律'],desc:'火が最多配分かつ攻撃系なら+40%。未達-10%。',effect:'v23_fire_core',requiresUnlock:true},
    v23_air_mark:{name:'風環調律',tags:['元素','風','調律'],desc:'風属性カード+34%。風属性でなければ-8%。',effect:'v23_air_mark',requiresUnlock:true},
    v23_air_shift:{name:'流転調律',tags:['元素','風','提示操作','調律'],desc:'風が最多配分かつ前回と異なる位置なら+40%。未達-10%。',effect:'v23_air_shift',requiresUnlock:true},
    v23_water_mark:{name:'水脈調律',tags:['元素','水','調律'],desc:'水属性カード+34%。水属性でなければ-8%。',effect:'v23_water_mark',requiresUnlock:true},
    v23_water_cycle:{name:'潮汐調律',tags:['元素','水','循環','調律'],desc:'水が最多配分かつ再構築直後なら+42%。未達-10%。',effect:'v23_water_cycle',requiresUnlock:true},
    v23_earth_mark:{name:'地脈調律',tags:['元素','土','調律'],desc:'土属性カード+34%。土属性でなければ-8%。',effect:'v23_earth_mark',requiresUnlock:true},
    v23_earth_guard:{name:'岩盤調律',tags:['元素','土','耐久','調律'],desc:'土が最多配分かつ防御・複合なら+40%。未達-10%。',effect:'v23_earth_guard',requiresUnlock:true},
    v23_aether_mark:{name:'星幽調律',tags:['元素','エーテル','調律'],desc:'エーテル属性カード+36%。エーテル属性でなければ-8%。',effect:'v23_aether_mark',requiresUnlock:true},
    v23_aether_weave:{name:'五相調律',tags:['元素','エーテル','混成','調律'],desc:'元素4種類以上へ配分し、強化層2つ以上なら+44%。未達-10%。',effect:'v23_aether_weave',requiresUnlock:true}
  });
  D.V23_TUNING_RULES={
    v23_fire_mark:{when:{cardElement:'fire'},hit:1.34,miss:.92},v23_fire_core:{when:{elementDominant:'fire',attackish:true},hit:1.40,miss:.90},
    v23_air_mark:{when:{cardElement:'air'},hit:1.34,miss:.92},v23_air_shift:{when:{elementDominant:'air',positionChanged:true},hit:1.40,miss:.90},
    v23_water_mark:{when:{cardElement:'water'},hit:1.34,miss:.92},v23_water_cycle:{when:{elementDominant:'water',recentReshuffle:true},hit:1.42,miss:.90},
    v23_earth_mark:{when:{cardElement:'earth'},hit:1.34,miss:.92},v23_earth_guard:{when:{elementDominant:'earth',blockish:true},hit:1.40,miss:.90},
    v23_aether_mark:{when:{cardElement:'aether'},hit:1.36,miss:.92},v23_aether_weave:{when:{elementDiversityMin:4,augmentationMin:2},hit:1.44,miss:.90}
  };

  // 遺物 +30（元素単独20＋元素間反応10）
  const relicDefs={
    v23_fire_core:['火床核',['元素','火'],'火属性カード+18%。',{cardElement:'fire'},1.18],
    v23_fire_lens:['熱圧レンズ',['元素','火','攻撃'],'火配分6以上の攻撃系カード+20%。',{elementMin:{fire:6},attackish:true},1.20],
    v23_fire_lava:['溶岩導管',['元素','火','錬成'],'溶岩生成済みの火属性カード+26%。',{materialMade:'lava',cardElement:'fire'},1.26],
    v23_fire_ash:['灰燼回路',['元素','火','瀕死'],'HP半分以下の火属性カード+30%。',{cardElement:'fire',lowHp:true},1.30],
    v23_air_core:['風路核',['元素','風'],'風属性カード+18%。',{cardElement:'air'},1.18],
    v23_air_lens:['偏流レンズ',['元素','風','提示操作'],'風配分6以上＋位置変更で+22%。',{elementMin:{air:6},positionChanged:true},1.22],
    v23_air_sand:['砂塵羅針盤',['元素','風','錬成'],'砂塵生成済みの風属性カード+26%。',{materialMade:'sand',cardElement:'air'},1.26],
    v23_air_mist:['霧翼',['元素','風','水'],'霧滴生成済みの左右枠カード+24%。',{materialMade:'mist',positionSide:true},1.24],
    v23_water_core:['水脈核',['元素','水'],'水属性カード+18%。',{cardElement:'water'},1.18],
    v23_water_cycle:['潮汐輪',['元素','水','循環'],'水配分6以上＋再構築直後で+23%。',{elementMin:{water:6},recentReshuffle:true},1.23],
    v23_water_steam:['蒸気コイル',['元素','水','火'],'蒸気生成済みの水属性カード+25%。',{materialMade:'steam',cardElement:'water'},1.25],
    v23_water_spring:['泉脈槽',['元素','水','エーテル'],'貯水結晶生成済みの水属性カード+27%。',{materialMade:'spring',cardElement:'water'},1.27],
    v23_earth_core:['地脈核',['元素','土'],'土属性カード+18%。',{cardElement:'earth'},1.18],
    v23_earth_frame:['地殻フレーム',['元素','土','耐久'],'土配分6以上の防御・複合カード+22%。',{elementMin:{earth:6},blockish:true},1.22],
    v23_earth_shell:['岩殻装甲',['元素','土','錬成'],'岩殻生成済みの土属性カード+27%。',{materialMade:'shell',cardElement:'earth'},1.27],
    v23_earth_ceramic:['焼成金床',['元素','土','成長'],'陶殻生成済みの強化済みカード+25%。',{materialMade:'ceramic',upgraded:true},1.25],
    v23_aether_core:['星幽核',['元素','エーテル'],'エーテル属性カード+20%。',{cardElement:'aether'},1.20],
    v23_aether_conduit:['第五導管',['元素','エーテル','混成'],'エーテル配分4以上＋強化層2つ以上で+24%。',{elementMin:{aether:4},augmentationMin:2},1.24],
    v23_aether_pulse:['周期時計',['元素','エーテル','錬成'],'周期結晶生成済みのエーテル属性カード+28%。',{materialMade:'pulse',cardElement:'aether'},1.28],
    v23_aether_ward:['星幽障壁器',['元素','エーテル','耐久'],'時限障壁生成済みの防御・複合カード+24%。',{materialMade:'ward',blockish:true},1.24],
    v23_fire_air:['火嵐共鳴器',['元素','火','風','連撃'],'火・風を各3以上配分した3ヒット以上のカード+25%。',{elementMin:{fire:3,air:3},hitsMin:3},1.25],
    v23_fire_water:['蒸気共鳴器',['元素','火','水','錬成'],'蒸気生成済みで敵に状態異常があれば+24%。',{materialMade:'steam',statusMin:1},1.24],
    v23_fire_earth:['溶融共鳴器',['元素','火','土','錬成'],'溶岩生成済みの防御・複合カード+26%。',{materialMade:'lava',blockish:true},1.26],
    v23_fire_aether:['時限火種炉',['元素','火','エーテル'],'時限火種生成済みかつHP半分以下なら+28%。',{materialMade:'ember',lowHp:true},1.28],
    v23_air_water:['霧流共鳴器',['元素','風','水'],'霧滴生成済み＋位置変更で+26%。',{materialMade:'mist',positionChanged:true},1.26],
    v23_air_earth:['砂塵継電器',['元素','風','土','連結'],'砂塵生成済みの連結コンボ+25%。',{materialMade:'sand',linkActive:true},1.25],
    v23_air_aether:['周期風車',['元素','風','エーテル','連撃'],'周期結晶生成済みの3ヒット以上カード+26%。',{materialMade:'pulse',hitsMin:3},1.26],
    v23_water_earth:['泥相変成器',['元素','水','土','役割変換'],'粘土生成済みの役割変換カード+24%。',{materialMade:'clay',converted:true},1.24],
    v23_water_aether:['貯水輪',['元素','水','エーテル','循環'],'貯水結晶生成済み＋再構築直後で+27%。',{materialMade:'spring',recentReshuffle:true},1.27],
    v23_earth_aether:['時限障壁炉',['元素','土','エーテル','耐久'],'時限障壁生成済みの防御・複合カード+29%。',{materialMade:'ward',blockish:true},1.29]
  };
  D.V23_RELIC_RULES={};for(const [id,[name,tags,desc,when,mult]] of Object.entries(relicDefs)){D.RELICS[id]={name,tags,desc};D.V23_RELIC_RULES[id]=[{when,mult}];}

  // プロトコル +15
  const protocolDefs={
    v23_p_fire_mark:['火印専攻規格',['元素','火'],'火属性カード+36%、それ以外-8%。',{cardElement:'fire'},1.36,.92],
    v23_p_fire_core:['炉心集中規格',['元素','火','攻撃'],'火最多配分＋攻撃系+32%、未達-7%。',{elementDominant:'fire',attackish:true},1.32,.93],
    v23_p_fire_react:['溶融反応規格',['元素','火','錬成'],'溶岩または時限火種を生成済みなら+26%、未生成-6%。',{materialAnyMade:['lava','ember']},1.26,.94],
    v23_p_air_mark:['風環専攻規格',['元素','風'],'風属性カード+36%、それ以外-8%。',{cardElement:'air'},1.36,.92],
    v23_p_air_shift:['流転集中規格',['元素','風','提示操作'],'風最多配分＋位置変更+34%、未達-8%。',{elementDominant:'air',positionChanged:true},1.34,.92],
    v23_p_air_react:['風化反応規格',['元素','風','錬成'],'砂塵または霧滴を生成済みなら+26%、未生成-6%。',{materialAnyMade:['sand','mist']},1.26,.94],
    v23_p_water_mark:['水脈専攻規格',['元素','水'],'水属性カード+36%、それ以外-8%。',{cardElement:'water'},1.36,.92],
    v23_p_water_cycle:['潮汐集中規格',['元素','水','循環'],'水最多配分＋再構築直後+36%、未達-8%。',{elementDominant:'water',recentReshuffle:true},1.36,.92],
    v23_p_water_react:['水相反応規格',['元素','水','錬成'],'蒸気または貯水結晶を生成済みなら+27%、未生成-6%。',{materialAnyMade:['steam','spring']},1.27,.94],
    v23_p_earth_mark:['地脈専攻規格',['元素','土'],'土属性カード+36%、それ以外-8%。',{cardElement:'earth'},1.36,.92],
    v23_p_earth_guard:['岩盤集中規格',['元素','土','耐久'],'土最多配分＋防御・複合+34%、未達-8%。',{elementDominant:'earth',blockish:true},1.34,.92],
    v23_p_earth_react:['成岩反応規格',['元素','土','錬成'],'岩殻または陶殻を生成済みなら+27%、未生成-6%。',{materialAnyMade:['shell','ceramic']},1.27,.94],
    v23_p_aether_mark:['星幽専攻規格',['元素','エーテル'],'エーテル属性カード+38%、それ以外-8%。',{cardElement:'aether'},1.38,.92],
    v23_p_aether_weave:['五相集中規格',['元素','エーテル','混成'],'4元素以上へ配分＋強化層2つ以上+38%、未達-9%。',{elementDiversityMin:4,augmentationMin:2},1.38,.91],
    v23_p_aether_react:['第五反応規格',['元素','エーテル','錬成'],'周期結晶または時限障壁を生成済みなら+30%、未生成-7%。',{materialAnyMade:['pulse','ward']},1.30,.93]
  };
  D.V23_PROTOCOL_RULES={};for(const [id,[name,tags,desc,when,hit,miss]] of Object.entries(protocolDefs)){D.PROTOCOLS[id]={name,tags,desc,effect:id};D.V23_PROTOCOL_RULES[id]={when,hit,miss};}

  // 特殊個体 +10：敵ステータス設定で発見。元素名は行動性の比喩で、プレイヤーの元素配分には依存しない。
  const traitDefs={
    v23_cinder:{name:'熾火個体',short:'熾火',desc:'攻撃力×1.12、再生力+2。'},
    v23_inferno:{name:'業火個体',short:'業火',desc:'攻撃力×1.18、速度+0.25。'},
    v23_gale:{name:'疾風個体',short:'疾風',desc:'速度+0.55、防御力-1。'},
    v23_tempest:{name:'暴風個体',short:'暴風',desc:'攻撃力×1.06、速度+0.35、耐性+12%。'},
    v23_tide:{name:'潮汐個体',short:'潮汐',desc:'最大HP×1.12、再生力+4。'},
    v23_abyss:{name:'深水個体',short:'深水',desc:'最大HP×1.20、再生力+2、速度-0.10。'},
    v23_bedrock:{name:'岩盤個体',short:'岩盤',desc:'最大HP×1.10、防御力+6。'},
    v23_crystal:{name:'晶殻個体',short:'晶殻',desc:'防御力+4、状態異常耐性+22%。'},
    v23_astral:{name:'星幽個体',short:'星幽',desc:'最大HP・攻撃を×1.08、速度+0.20、耐性+10%。'},
    v23_phase:{name:'位相個体',short:'位相',desc:'攻撃力×1.08、速度+0.30、再生力+2、耐性+10%。'}
  };for(const [id,x] of Object.entries(traitDefs))D.TRAITS[id]={...x,effect:id};
  D.V23_TRAIT_RULES={
    v23_cinder:{atkMult:1.12,regenAdd:2},v23_inferno:{atkMult:1.18,spdAdd:.25},v23_gale:{spdAdd:.55,defAdd:-1},v23_tempest:{atkMult:1.06,spdAdd:.35,resistAdd:12},v23_tide:{hpMult:1.12,regenAdd:4},v23_abyss:{hpMult:1.20,regenAdd:2,spdAdd:-.10},v23_bedrock:{hpMult:1.10,defAdd:6},v23_crystal:{defAdd:4,resistAdd:22},v23_astral:{hpMult:1.08,atkMult:1.08,spdAdd:.20,resistAdd:10},v23_phase:{atkMult:1.08,spdAdd:.30,regenAdd:2,resistAdd:10}
  };
  D.V23_TRAIT_CONDITIONS={
    v23_cinder:{advanced:true,label:'攻撃倍率×12以上＋再生力4以上',check:e=>e.atk>=12&&e.regen>=4},
    v23_inferno:{advanced:false,label:'攻撃倍率×14以上＋速度倍率×4.5以上',check:e=>e.atk>=14&&e.spd>=4.5},
    v23_gale:{advanced:false,label:'速度倍率×5以上',check:e=>e.spd>=5},
    v23_tempest:{advanced:true,label:'速度倍率×4.5以上＋状態異常耐性70%以上',check:e=>e.spd>=4.5&&e.resist>=70},
    v23_tide:{advanced:true,label:'HP倍率×7以上＋再生力10以上',check:e=>e.hp>=7&&e.regen>=10},
    v23_abyss:{advanced:true,label:'HP倍率×12以上＋再生力8以上',check:e=>e.hp>=12&&e.regen>=8},
    v23_bedrock:{advanced:false,label:'HP倍率×10以上＋防御倍率×13以上',check:e=>e.hp>=10&&e.def>=13},
    v23_crystal:{advanced:true,label:'防御倍率×11以上＋状態異常耐性85%以上',check:e=>e.def>=11&&e.resist>=85},
    v23_astral:{advanced:true,label:'HP×9 / 攻撃×9 / 速度×3.5 / 耐性75%以上',check:e=>e.hp>=9&&e.atk>=9&&e.spd>=3.5&&e.resist>=75},
    v23_phase:{advanced:true,label:'攻撃×10 / 速度×4 / 再生7 / 耐性65%以上',check:e=>e.atk>=10&&e.spd>=4&&e.regen>=7&&e.resist>=65}
  };

  // 元素系複合挙動 +20。既存の汎用挙動ルールのみで構成し、複数同時発動できる。
  Object.assign(D.ENEMY_BEHAVIORS,{
    v23_bh_firestorm:{name:'火嵐連鎖',requires:['v23_cinder','v23_gale'],desc:'3ターンごとに攻撃+4、追加行動+1。',rules:{everyNTurnAttackBonus:{turns:3,amount:4},everyNTurnExtraAction:{turns:3,extra:1}}},
    v23_bh_inferno_tempest:{name:'爆炎暴風',requires:['v23_inferno','v23_tempest'],desc:'2ターンごとに攻撃+5。',rules:{everyNTurnAttackBonus:{turns:2,amount:5}}},
    v23_bh_steam_pressure:{name:'蒸気圧',requires:['v23_cinder','v23_tide'],desc:'3ターンごとに攻撃+4、障壁8。',rules:{everyNTurnAttackBonus:{turns:3,amount:4},everyNTurnBlock:{turns:3,amount:8}}},
    v23_bh_boiling_abyss:{name:'沸騰深層',requires:['v23_inferno','v23_abyss'],desc:'HP半分以下で一度だけ攻撃+6。',rules:{lowHpAtkOnce:6}},
    v23_bh_magma_shell:{name:'溶岩殻',requires:['v23_cinder','v23_bedrock'],desc:'3ターンごとに障壁12。状態異常中は攻撃+3。',rules:{everyNTurnBlock:{turns:3,amount:12},statusAttackBonus:3}},
    v23_bh_glass_furnace:{name:'硝子炉',requires:['v23_inferno','v23_crystal'],desc:'2ターンごとに障壁8、3ターンごとに攻撃+4。',rules:{everyNTurnBlock:{turns:2,amount:8},everyNTurnAttackBonus:{turns:3,amount:4}}},
    v23_bh_star_fire:{name:'星火共鳴',requires:['v23_cinder','v23_astral'],desc:'状態異常中は攻撃+4。3ターンごとに障壁8。',rules:{statusAttackBonus:4,everyNTurnBlock:{turns:3,amount:8}}},
    v23_bh_phase_burn:{name:'位相燃焼',requires:['v23_inferno','v23_phase'],desc:'3ターンごとに追加行動+1。',rules:{everyNTurnExtraAction:{turns:3,extra:1}}},
    v23_bh_mist_current:{name:'霧流',requires:['v23_gale','v23_tide'],desc:'前ターンに再生していれば追加行動+1。',rules:{healNextExtraAction:true}},
    v23_bh_storm_surge:{name:'暴潮',requires:['v23_tempest','v23_abyss'],desc:'3ターンごとに追加行動+1、障壁7。',rules:{everyNTurnExtraAction:{turns:3,extra:1},everyNTurnBlock:{turns:3,amount:7}}},
    v23_bh_sandstorm:{name:'砂嵐',requires:['v23_gale','v23_bedrock'],desc:'3ターンごとに攻撃+3、障壁10。',rules:{everyNTurnAttackBonus:{turns:3,amount:3},everyNTurnBlock:{turns:3,amount:10}}},
    v23_bh_crystal_gale:{name:'晶風',requires:['v23_tempest','v23_crystal'],desc:'敵ターン終了時に毒・火傷を1減らし、除去時は障壁10。',rules:{cleanseEnd:{amount:1,block:10}}},
    v23_bh_astral_wind:{name:'星風',requires:['v23_gale','v23_astral'],desc:'4ターンごとに追加行動+1、障壁10。',rules:{everyNTurnExtraAction:{turns:4,extra:1},everyNTurnBlock:{turns:4,amount:10}}},
    v23_bh_phase_storm:{name:'位相嵐',requires:['v23_tempest','v23_phase'],desc:'2ターンごとに攻撃+3。3ターンごとに追加行動+1。',rules:{everyNTurnAttackBonus:{turns:2,amount:3},everyNTurnExtraAction:{turns:3,extra:1}}},
    v23_bh_mirewall:{name:'泥濘城壁',requires:['v23_tide','v23_bedrock'],desc:'再生時、回復量と同じ障壁を最大16得る。',rules:{healBlockRatio:1,healBlockMax:16}},
    v23_bh_deep_crystal:{name:'深晶層',requires:['v23_abyss','v23_crystal'],desc:'HP半分以下では再生量×1.6。',rules:{lowHpRegenMult:1.6}},
    v23_bh_star_tide:{name:'星潮',requires:['v23_tide','v23_astral'],desc:'3ターンごとに状態異常を1減らしHP8回復。',rules:{everyNTurnCleanseHeal:{turns:3,amount:1,heal:8}}},
    v23_bh_phase_spring:{name:'位相泉',requires:['v23_abyss','v23_phase'],desc:'前ターンに再生していれば追加行動+1。4ターンごとに障壁10。',rules:{healNextExtraAction:true,everyNTurnBlock:{turns:4,amount:10}}},
    v23_bh_astral_monolith:{name:'星幽岩柱',requires:['v23_bedrock','v23_astral'],desc:'3ターンごとに障壁14。',rules:{everyNTurnBlock:{turns:3,amount:14}}},
    v23_bh_phase_prism:{name:'位相晶殻',requires:['v23_crystal','v23_phase'],desc:'3ターンごとに状態異常を1減らしHP6回復、障壁8。',rules:{everyNTurnCleanseHeal:{turns:3,amount:1,heal:6},everyNTurnBlock:{turns:3,amount:8}}}
  });

  // 説明を一か所に集約。v0.23追加要素も既存の詳細リファレンスへ接続する。
  if(D.SYSTEM_GUIDES){
    D.SYSTEM_GUIDES.push({id:'element_builds',refGroup:'element_builds',category:'ビルド',title:'元素系列ビルド',summary:'四元素＋第五元素を錬成だけでなく、ルーン・キャラ・スタイル・遺物・プロトコル・調律へ横断接続する。',where:'デッキ → 元素・錬成 / ルーン / 各ビルド項目',unlock:'錬成は初期、元素ルーン系列は第4ボス後の目標',points:['火：攻撃・自傷・瞬間火力。','風：連撃・提示位置・行動リズム。','水：循環・回復・状態異常。','土：防御・反撃・成長。','エーテル：ルーン・アルカナ・複数強化層。','元素ルーンで既存カードへ元素属性を与えられる。元素属性は既存のカードタグ数には数えないため、混成タグ系の条件を自動達成しない。','元素配分は戦闘開始時に固定され、元素系キャラ・遺物・調律もその戦闘の配分を参照する。'],example:'《針雨》に風環のルーンを刻み、風6以上＋ゼファー＋流転調律を組み合わせれば、既存の連撃カードを風元素ビルドの中核へ変えられる。'});
    D.GUIDE_REFERENCE_GROUPS.element_builds=Object.entries(D.ELEMENT_INFO).map(([id,x])=>({id,name:x.name,tags:['元素',x.name],desc:`主軸：${x.theme}`,use:`${x.name}配分と元素ルーンを既存ビルドへ重ねる。`,caution:'配分だけではカードに元素属性は付かない。カード属性は元素ルーンで付与する。'}));
    const append=(group,obj,ids,use,caution)=>{D.GUIDE_REFERENCE_GROUPS[group]=D.GUIDE_REFERENCE_GROUPS[group]||[];const known=new Set(D.GUIDE_REFERENCE_GROUPS[group].map(x=>x.id));for(const id of ids||[]){const x=obj[id];if(x&&!known.has(id))D.GUIDE_REFERENCE_GROUPS[group].push({id,name:x.name||id,desc:x.desc||'',tags:x.tags||[],use,caution});}};
    append('styles',D.CHARACTER_STYLES,Object.keys(styles),'対応する元素配分・錬成物を満たす構成で使用。','元素条件が崩れると原型より狭い。配分とレシピを先に確認する。');
    append('tunings',D.TUNINGS,Object.keys(D.V23_TUNING_RULES),'元素属性または元素らしい運用をカード単位で尖らせる。','条件外では減衰するため、元素配分とカード属性を一致させる。');
    append('protocols',D.PROTOCOLS,Object.keys(protocolDefs),'ビルド全体を特定元素・反応へ寄せる。','1つしか装備できないため、元素専攻か既存軸専攻かを選ぶ。');
    append('traits',D.TRAITS,Object.keys(traitDefs),'実験場の指定ステータスで発見し、自由にON/OFFする。','元素名は敵挙動の分類であり、プレイヤーの元素配分による有利不利は固定されない。');
    append('behaviors',D.ENEMY_BEHAVIORS,Object.keys(D.ENEMY_BEHAVIORS).filter(id=>id.startsWith('v23_bh_')),'指定された2特殊個体を同時適用して発見。','複数条件を満たすと複合挙動も複数同時発動する。');
    append('runes',D.RUNES,Object.keys(D.RUNES).filter(id=>id.startsWith('v23_rune_')),'既存カードへ元素属性を付与し、対応する配分・カード特性で追加強化する。','ルーン枠を1つ使う。元素属性だけを目的に刻む選択も成立する。');
  }

  D.V23_CHARACTER_IDS=Object.keys(D.CHARACTERS).filter(id=>!before.characters.has(id));
  D.V23_STYLE_IDS=Object.keys(D.CHARACTER_STYLES).filter(id=>!before.styles.has(id));
  D.V23_RELIC_IDS=Object.keys(D.RELICS).filter(id=>!before.relics.has(id));
  D.V23_PROTOCOL_IDS=Object.keys(D.PROTOCOLS).filter(id=>!before.protocols.has(id));
  D.V23_TUNING_IDS=Object.keys(D.TUNINGS).filter(id=>!before.tunings.has(id));
  D.V23_TRAIT_IDS=Object.keys(D.TRAITS).filter(id=>!before.traits.has(id));
  D.V23_BEHAVIOR_IDS=Object.keys(D.ENEMY_BEHAVIORS).filter(id=>!before.behaviors.has(id));
  D.V23_RUNE_IDS=Object.keys(D.RUNES).filter(id=>!before.runes.has(id));
})();
