'use strict';
(function(){
  const BL=window.BuildLab,D=BL.Data;
  const claimed=id=>s=>!!s.claimedUnlocks?.[id];
  const win=(id,kind,reward,title,condition,when,chapter=6)=>({id,kind,reward,title,condition,event:'win',when,check:claimed(id),chapter});
  const alloc=(s,id)=>Number(s?.alchemy?.allocation?.[id]||0);
  const dominant=(s,id)=>D.getDominantElements?.(s).includes(id);
  const hasRune=(s,id)=>Object.values(s.cardRunes||{}).includes(id);
  const made=(b,id)=>Number(b?.alchemy?.made?.[id]||0)>0;
  const reacted=(b,id)=>Number(b?.alchemy?.reactions?.[id]||0)>0;
  const activeStyle=s=>D.getCharacterStyle?.(s,s.character);
  const defeated=(s,...ids)=>ids.some(id=>!!s.defeatedTraits?.[id]);

  const specs={
    fire:{name:'火',rune:'v23_rune_fire',character:'ignis',styles:['ignis_furnace','ignis_magma','ignis_ash'],relics:['v23_fire_core','v23_fire_lens','v23_fire_lava','v23_fire_ash'],protocols:['v23_p_fire_mark','v23_p_fire_core','v23_p_fire_react'],tunings:['v23_fire_mark','v23_fire_core'],recipe:'lava',traits:['v23_cinder','v23_inferno']},
    air:{name:'風',rune:'v23_rune_air',character:'zephyr',styles:['zephyr_gale','zephyr_sand','zephyr_mist'],relics:['v23_air_core','v23_air_lens','v23_air_sand','v23_air_mist'],protocols:['v23_p_air_mark','v23_p_air_shift','v23_p_air_react'],tunings:['v23_air_mark','v23_air_shift'],recipe:'sand',traits:['v23_gale','v23_tempest']},
    water:{name:'水',rune:'v23_rune_water',character:'undine',styles:['undine_tide','undine_steam','undine_spring'],relics:['v23_water_core','v23_water_cycle','v23_water_steam','v23_water_spring'],protocols:['v23_p_water_mark','v23_p_water_cycle','v23_p_water_react'],tunings:['v23_water_mark','v23_water_cycle'],recipe:'steam',traits:['v23_tide','v23_abyss']},
    earth:{name:'土',rune:'v23_rune_earth',character:'gaia',styles:['gaia_bedrock','gaia_shell','gaia_ceramic'],relics:['v23_earth_core','v23_earth_frame','v23_earth_shell','v23_earth_ceramic'],protocols:['v23_p_earth_mark','v23_p_earth_guard','v23_p_earth_react'],tunings:['v23_earth_mark','v23_earth_guard'],recipe:'shell',traits:['v23_bedrock','v23_crystal']},
    aether:{name:'エーテル',rune:'v23_rune_aether',character:'quinta',styles:['quinta_pulse','quinta_ward','quinta_prism'],relics:['v23_aether_core','v23_aether_conduit','v23_aether_pulse','v23_aether_ward'],protocols:['v23_p_aether_mark','v23_p_aether_weave','v23_p_aether_react'],tunings:['v23_aether_mark','v23_aether_weave'],recipe:'pulse',traits:['v23_astral','v23_phase']}
  };

  // 新特殊個体・複合挙動の条件は最初から全公開。
  for(const id of D.V23_TRAIT_IDS||[]){const cfg=D.V23_TRAIT_CONDITIONS?.[id],t=D.TRAITS[id];D.UNLOCKS.push({id:`v23_discover_${id}`,kind:'trait',reward:[id],title:`元素特殊個体：${t.name.replace(/個体$/,'')}`,condition:`${cfg?.advanced?'第1ボス撃破後、':''}${cfg?.label||'指定ステータス条件'}に設定して実験開始`,check:s=>!!s.unlockedTraits?.[id],chapter:6});}
  for(const id of D.V23_BEHAVIOR_IDS||[]){const b=D.ENEMY_BEHAVIORS[id];D.UNLOCKS.push({id:`v23_behavior_${id}`,kind:'behavior',reward:[id],title:`元素複合挙動：${b.name}`,condition:D.behaviorConditionText(id),check:s=>!!s.unlockedBehaviors?.[id],chapter:6});}

  // 各元素：ルーン → キャラ → スタイル群 → 元素熟達の4段階。
  for(const [id,x] of Object.entries(specs)){
    D.UNLOCKS.push(
      win(`v23_${id}_rune`,'rune',[x.rune],`${x.name}元素刻印`,`第4ボス撃破後、${x.name}へ6点以上配分して錬成を有効にした状態で勝利`,(s,b)=>s.boss4Defeated&&s.alchemy?.enabled&&alloc(s,id)>=6),
      win(`v23_${id}_character`,'mixed',[x.character,x.relics[0],x.relics[1],x.protocols[0]],`${x.name}元素適応体`,`「${D.RUNES[x.rune]?.name}」をカードへ設定し、${D.ALCHEMY?.materials?.[D.ALCHEMY?.recipes?.find(r=>r.id===x.recipe)?.output]||x.recipe}を戦闘中に生成して勝利`,(s,b)=>hasRune(s,x.rune)&&(reacted(b,x.recipe)||made(b,D.ALCHEMY?.recipes?.find(r=>r.id===x.recipe)?.output))),
      win(`v23_${id}_style`,'mixed',[...x.styles,x.relics[2],x.relics[3],x.protocols[1],x.tunings[0]],`${x.name}元素スタイル研究`,`${D.CHARACTERS[x.character]?.name}を使用し、${x.name}を8点以上配分して勝利`,(s,b)=>s.character===x.character&&alloc(s,id)>=8),
      win(`v23_${id}_mastery`,'mixed',[x.protocols[2],x.tunings[1]],`${x.name}元素熟達`,`${D.CHARACTERS[x.character]?.name}の派生スタイル＋${D.RUNES[x.rune]?.name}を使用し、${x.name}系列特殊個体を撃破`,(s,b)=>s.character===x.character&&!!activeStyle(s)&&hasRune(s,x.rune)&&defeated(s,...x.traits))
    );
  }

  // 10組の元素間反応。単独元素の上位互換ではなく、配分・加工順の両立を要求する橋渡し遺物。
  const cross=[
    ['fire_air','火×風',['v23_fire_air'],'火4・風4以上を同時配分して勝利',(s,b)=>alloc(s,'fire')>=4&&alloc(s,'air')>=4],
    ['fire_water','火×水',['v23_fire_water'],'蒸気を生成して勝利',(s,b)=>reacted(b,'steam')||made(b,'steam')],
    ['fire_earth','火×土',['v23_fire_earth'],'溶岩を生成して勝利',(s,b)=>reacted(b,'lava')||made(b,'lava')],
    ['fire_aether','火×エーテル',['v23_fire_aether'],'時限火種を生成して勝利',(s,b)=>reacted(b,'ember')||made(b,'ember')],
    ['air_water','風×水',['v23_air_water'],'霧滴を生成して勝利',(s,b)=>reacted(b,'mist')||made(b,'mist')],
    ['air_earth','風×土',['v23_air_earth'],'砂塵を生成して勝利',(s,b)=>reacted(b,'sand')||made(b,'sand')],
    ['air_aether','風×エーテル',['v23_air_aether'],'周期結晶を生成して勝利',(s,b)=>reacted(b,'pulse')||made(b,'pulse')],
    ['water_earth','水×土',['v23_water_earth'],'粘土を生成して勝利',(s,b)=>reacted(b,'clay')||made(b,'clay')],
    ['water_aether','水×エーテル',['v23_water_aether'],'貯水結晶を生成して勝利',(s,b)=>reacted(b,'spring')||made(b,'spring')],
    ['earth_aether','土×エーテル',['v23_earth_aether'],'時限障壁を生成して勝利',(s,b)=>reacted(b,'ward')||made(b,'ward')]
  ];
  for(const [id,name,reward,condition,when] of cross)D.UNLOCKS.push(win(`v23_cross_${id}`,'relic',reward,`元素反応研究：${name}`,`第4ボス撃破後、${condition}`,(s,b)=>s.boss4Defeated&&s.alchemy?.enabled&&when(s,b)));

  D.V23_ELEMENT_SPECS=specs;
})();
