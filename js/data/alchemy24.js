'use strict';
(function(){
  const D=window.BuildLab.Data,A=D.ALCHEMY;if(!A)return;
  Object.assign(A.materials,{magma_core:'熔核',storm_crystal:'雷晶',frost_crystal:'霜晶',starsteel:'星鉄',sun_glass:'陽硝子',cloudstone:'浮岩',geyser_core:'噴泉核',obsidian_edge:'黒曜刃',resonance_prism:'共鳴晶',deep_mud:'深層泥',volcanic_shell:'火山殻',world_seed:'世界種'});
  const add=[
    ['magma_core','熔核形成',{lava:1,ember:1},'magma_core'],['storm_crystal','雷晶形成',{sand:1,pulse:1},'storm_crystal'],['frost_crystal','霜晶形成',{mist:1,spring:1},'frost_crystal'],['starsteel','星鉄鍛造',{ceramic:1,ward:1},'starsteel'],['sun_glass','陽硝子焼成',{glass:1,ember:1},'sun_glass'],['cloudstone','浮岩形成',{mist:1,shell:1},'cloudstone'],['geyser_core','噴泉核形成',{steam:1,spring:1},'geyser_core'],['obsidian_edge','黒曜刃形成',{obsidian:1,pulse:1},'obsidian_edge'],['resonance_prism','共鳴晶形成',{glass:1,pulse:1},'resonance_prism'],['deep_mud','深層泥形成',{clay:1,ward:1},'deep_mud'],['volcanic_shell','火山殻形成',{lava:1,shell:1},'volcanic_shell'],['world_seed','世界種形成',{clay:1,spring:1,aether:1},'world_seed']
  ].map(([id,name,input,output])=>({id,name,input,output}));
  for(const r of add)if(!A.recipes.some(x=>x.id===r.id))A.recipes.push(r);
  Object.assign(A.effects,{magma_core:{event:'attack',damage:6,desc:'攻撃カード選択後、追加攻撃6。'},storm_crystal:{event:'attack',bonus:.22,desc:'攻撃カードの効果+22%。'},frost_crystal:{event:'card',heal:4,desc:'HP不足時、カード選択前にHP4回復。'},starsteel:{event:'hit',block:10,desc:'敵攻撃直前、防御10。1ターン1回。'},sun_glass:{event:'single',bonus:.38,desc:'単発攻撃カードの効果+38%。'},cloudstone:{event:'card',block:5,desc:'カード選択前、防御5。'},geyser_core:{event:'turn',delay:1,heal:6,desc:'次ターン開始時にHP6回復。'},obsidian_edge:{event:'attack',bonus:.30,desc:'攻撃カードの効果+30%。'},resonance_prism:{event:'card',period:2,bonus:.20,desc:'2回カードを選ぶごとに、そのカードの効果+20%。'},deep_mud:{event:'hit',block:8,desc:'敵攻撃直前、防御8。1ターン1回。'},volcanic_shell:{event:'hit',block:12,desc:'敵攻撃直前、防御12。1ターン1回。'},world_seed:{event:'turn',delay:2,heal:8,desc:'2ターン後の開始時にHP8回復。'}});
  D.V24_ADVANCED_MATERIAL_IDS=add.map(r=>r.output);
  if(D.GUIDE_REFERENCE_GROUPS?.alchemy){for(const r of add)D.GUIDE_REFERENCE_GROUPS.alchemy.push({id:r.id,name:r.name,tags:['錬成','上位錬成',A.materials[r.output]],desc:Object.entries(r.input).map(([id,n])=>A.materials[id]+n).join('＋')+' → '+A.materials[r.output]+'1。'+A.effects[r.output].desc,use:'中間錬成物をさらに加工する上位工程。',caution:'加工段数が増えるため、工程順と備蓄指定が噛み合わないと停止しやすい。'});}
})();
