'use strict';
(function(){
  const D=window.BuildLab.Data;
  const elements={fire:'火',air:'風',water:'水',earth:'土',aether:'エーテル'};
  const materials={...elements,lava:'溶岩',steam:'蒸気',clay:'粘土',sand:'砂塵',glass:'ガラス',obsidian:'黒曜石',shell:'岩殻',ceramic:'陶殻',mist:'霧滴',ember:'時限火種',ward:'時限障壁',spring:'貯水結晶',pulse:'周期結晶'};
  const recipes=[
    ['lava','溶融',{fire:3,earth:1},'lava'],
    ['ceramic','焼成',{fire:1,earth:3},'ceramic'],
    ['glass','硝化',{fire:2,earth:2},'glass'],
    ['steam','蒸発',{fire:1,water:2},'steam'],
    ['clay','混泥',{water:1,earth:2},'clay'],
    ['sand','風化',{air:2,earth:1},'sand'],
    ['obsidian','急冷',{lava:1,water:1},'obsidian'],
    ['shell','成岩',{lava:1,earth:2},'shell'],
    ['ceramic_clay','粘土焼成',{clay:1,fire:1},'ceramic'],
    ['glass_sand','砂塵溶融',{sand:1,fire:2},'glass'],
    ['mist','凝結',{steam:1,air:1},'mist'],
    ['ember','遅延燃焼',{aether:1,fire:2},'ember'],
    ['ward','遅延防壁',{aether:1,earth:2},'ward'],
    ['spring','貯水',{aether:1,water:2},'spring'],
    ['pulse','周期形成',{aether:1,air:2},'pulse']
  ].map(([id,name,input,output])=>({id,name,input,output}));
  const effects={
    lava:{event:'attack',damage:3,desc:'攻撃カード選択後、追加攻撃3。敵防御を適用。'},
    steam:{event:'card',block:2,desc:'カード選択前、防御2。'},
    clay:{event:'hold',desc:'加工用素材。粘土焼成で陶殻へ。'},
    sand:{event:'hold',desc:'加工用素材。砂塵溶融でガラスへ。'},
    glass:{event:'attack',bonus:.15,desc:'攻撃カード選択時、そのカードの効果+15%。'},
    obsidian:{event:'single',bonus:.30,desc:'単発攻撃カード選択時、そのカードの効果+30%。'},
    shell:{event:'hit',block:6,desc:'敵の攻撃直前、防御6。1ターン1回。'},
    ceramic:{event:'hit',block:4,desc:'敵の攻撃直前、防御4。1ターン1回。'},
    mist:{event:'card',heal:3,desc:'HP不足時、カード選択前にHP3回復。'},
    ember:{event:'turn',delay:1,damage:8,desc:'ターン開始時に起動、次ターン開始時に攻撃8。敵防御を適用。'},
    ward:{event:'turn',delay:1,block:9,desc:'ターン開始時に起動、次ターン開始時に防御9。'},
    spring:{event:'turn',delay:2,water:1,desc:'ターン開始時に起動、2ターン後に水1。即時再反応はしない。'},
    pulse:{event:'card',period:3,bonus:.25,desc:'3回カードを選ぶごとに1回、そのカードの効果+25%。'}
  };
  const defaults=()=>({enabled:false,allocation:{fire:0,air:0,water:0,earth:0,aether:0},recipes:[],hold:[]});
  function normalize(raw){const c=defaults();raw=raw||{};c.enabled=raw.enabled===true;let left=12;for(const k of Object.keys(elements)){const n=Number(raw.allocation?.[k]);c.allocation[k]=Number.isFinite(n)?Math.min(left,Math.max(0,Math.floor(n))):0;left-=c.allocation[k];}c.recipes=[...new Set(Array.isArray(raw.recipes)?raw.recipes:[])].filter(id=>recipes.some(r=>r.id===id)).slice(0,8);c.hold=[...new Set(Array.isArray(raw.hold)?raw.hold:[])].filter(id=>effects[id]);return c;}
  const presets=[
    {name:'溶岩放出',allocation:{fire:9,earth:3},recipes:['lava'],hold:[]},
    {name:'黒曜石加工',allocation:{fire:6,earth:2,water:4},recipes:['lava','obsidian'],hold:['lava']},
    {name:'岩殻備蓄',allocation:{fire:6,earth:6},recipes:['lava','shell'],hold:['lava']},
    {name:'蒸気と霧滴',allocation:{fire:3,water:6,air:3},recipes:['steam','mist'],hold:['steam']},
    {name:'第五元素・周期',allocation:{aether:4,air:4,earth:4},recipes:['pulse','ward'],hold:[]}
  ];
  D.ALCHEMY={elements,materials,recipes,effects,defaults,normalize,presets};
})();

(function(){
  const D=window.BuildLab.Data,A=D.ALCHEMY;
  if(!D.SYSTEM_GUIDES)return;
  D.SYSTEM_GUIDES.push({id:'alchemy',refGroup:'alchemy',category:'ビルド',title:'四元素・第五元素と自動錬成',summary:'五元素の配分・加工順・備蓄を構築時に設定。戦闘ではカード選択に連動して自動処理。',where:'デッキ → 元素・錬成',unlock:'初期解放',points:['合計12点を火・風・水・土・エーテルへ配分。戦闘開始と再構築時に供給。','元素・中間材料・錬成物はすべてスタック。次の戦闘開始時に在庫を初期化。','最大8工程を上から1巡。上位工程の次の1回分を確保してから下位工程へ進む。','各生成物の自動使用は1ターン1個まで。備蓄指定なら加工用に残す。','エーテルは専用レシピのみ。万能結合・代用・再分解はない。','戦闘中は錬成設定を固定。終了画面で反応回数・使用数・在庫・加工待ちを確認。'],example:'黒曜石加工：火6・土2・水4で溶融→急冷。溶岩を備蓄に指定し、黒曜石を単発攻撃へ自動使用。'});
  D.GUIDE_REFERENCE_GROUPS.alchemy=A.recipes.map(r=>({id:r.id,name:r.name,tags:['錬成',A.materials[r.output]],desc:Object.entries(r.input).map(([id,n])=>A.materials[id]+n).join('＋')+' → '+A.materials[r.output]+'1。'+A.effects[r.output].desc,use:'構築時に工程へ追加し、必要な元素を配分。',caution:'上位工程の確保分は下位工程が使用できない。加工が止まったら不足材料と順番を確認。'}));
})();
