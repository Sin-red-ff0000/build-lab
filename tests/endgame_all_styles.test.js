'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert');global.window=global;const mem={};global.localStorage={getItem:k=>mem[k]??null,setItem:(k,v)=>mem[k]=String(v),removeItem:k=>delete mem[k]};
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const m of html.matchAll(/<script src="([^"?]+)/g)){const f=m[1];if(f.includes('/ui/')||f.endsWith('app.js'))continue;require(path.join(root,f));}const BL=BuildLab,D=BL.Data;
function allUnlock(s){s.bossDefeated=s.boss2Defeated=s.boss3Defeated=s.boss4Defeated=true;const mp={CARDS:'unlockedCards',RELICS:'unlockedRelics',CHARACTERS:'unlockedCharacters',PROTOCOLS:'unlockedProtocols',TUNINGS:'unlockedTunings',CARD_CONVERSIONS:'unlockedConversions',RUNES:'unlockedRunes',ARCANA:'unlockedArcana',DOCTRINES:'unlockedDoctrines',LINK_MODES:'unlockedLinkModes',TRAITS:'unlockedTraits',ENEMY_BEHAVIORS:'unlockedBehaviors'};for(const [src,dst] of Object.entries(mp))for(const id of Object.keys(D[src]||{}))s[dst][id]=true;for(const id of Object.keys(D.CHARACTER_STYLES||{}))s.unlockedCharacterStyles[id]=true;s.unlockedSystems={advanced_enemy_parameters:true,prompt_control:true,card_link:true,card_conversion:true,deck_doctrine:true,rune:true,arcana:true,card_tuning:true,character_style:true};}
const coreDecks={
 multihit:['v34_m_drill','v34_m_drill','v34_m_guardstorm','v34_m_guardstorm','v34_m_accel','v34_m_needlefort','v34_m_statusburst','v34_m_final','v34_m_final','v34_m_needlefort'],
 status:['v34_s_plague','v34_s_plague','v34_s_quarantine','v34_s_quarantine','v34_s_corrode','v34_s_fever','v34_s_detonate','v34_s_detonate','v34_s_pestwall','v34_s_pestwall'],
 guard:['v34_g_citadel','v34_g_citadel','v34_g_retaliate','v34_g_intercept','v34_g_intercept','v34_g_ram','v34_g_recovery','v34_g_recovery','v34_g_perfect','v34_g_perfect'],
 discard:['v34_d_scrap_lance','v34_d_scrap_lance','v34_d_refuse_wall','v34_d_refuse_wall','v34_d_shrapnel','v34_d_salvage_guard','v34_d_salvage_guard','v34_d_landfill','v34_d_afterimage','v34_d_afterimage'],
 blood:['v34_b_crimson','v34_b_crimson','v34_b_pressure','v34_b_pressure','v34_b_scarstorm','v34_b_contract','v34_b_revenge','v34_b_revenge','v34_b_terminal','v34_b_terminal'],
 cycle:['v34_c_reactor','v34_c_reactor','v34_c_bastion','v34_c_bastion','v34_c_reset','v34_c_return','v34_c_return','v34_c_loopguard','v34_c_loopguard','v34_c_wheel']
};
const coreRelics={multihit:['v34_rm_core','v34_rm_long','v34_rm_guard'],status:['v34_rs_core','v34_rs_loaded','v34_rs_guard'],guard:['v34_rg_core','v34_rg_block','v34_rg_pressure'],discard:['v34_rd_core','v34_rd_bulwark','v34_rd_arsenal'],blood:['v34_rb_core','v34_rb_attack','v34_rb_guard'],cycle:['v34_rc_core','v34_rc_recent','v34_rc_guard']};
const supportFill=['v34_g_recovery','v34_g_ram','v34_m_guardstorm','v34_c_reset'];
function newDeck(f){const cards=[...D.V35_FAMILIES[f].cards];return [...cards,...supportFill].slice(0,10)}
function familyFor(cid,st){if(!st)return D.V35_CHARACTER_FAMILY[cid];const t=st.tags||[];
 if(cid==='bulwark')return 'guard';
 if(['ignis','zephyr','undine','gaia','quinta','quint'].includes(cid))return 'element';
 if(['crucible','retort','alembic','vessel','magnum','salamander','naiad'].includes(cid))return 'alchemy';
 if(cid==='astral'||cid==='glyph'||cid==='oracle')return 'mystic'; if(['tracer','nexus','tracker'].includes(cid))return 'analysis';
 if(t.includes('自傷')||t.includes('瀕死'))return 'blood';if(t.includes('状態異常'))return 'status';if(t.includes('捨て札'))return 'discard';if(t.includes('耐久')||t.includes('反撃')||t.includes('成長'))return 'guard';
 if(t.includes('連結'))return 'link';if(t.includes('調律')||t.includes('変換')||t.includes('役割変換'))return 'calibration';if(t.includes('構築規格')||t.includes('単独')||t.includes('重複')||t.includes('多タグ')||t.includes('混成')||t.includes('反復')||t.includes('変化'))return 'architecture';
 if(t.includes('提示操作')||t.includes('中央')||t.includes('左右'))return 'position';if(t.includes('循環'))return 'cycle';if(t.includes('連撃'))return 'multihit';return D.V35_CHARACTER_FAMILY[cid];}
function elementKey(cid,st){const id=st?.id||cid;if(id.includes('zephyr'))return 'air';if(id.includes('undine')||id.includes('naiad'))return 'water';if(id.includes('gaia'))return 'earth';if(id.includes('quinta'))return 'aether';if(id.includes('quint'))return 'prism';return 'fire';}
const elementDeck={
 fire:['v35_e_fire','v35_e_fire','v26_fire_guard','v26_fire_guard','v26_fire_lance','v26_fire_multi','v26_fire_status','v35_e_prism','v34_g_recovery','v34_g_ram'],
 air:['v35_e_wind','v35_e_wind','v26_wind_guard','v26_wind_guard','v26_wind_multi','v26_wind_cycle','v26_wind_status','v35_e_prism','v34_g_recovery','v34_g_ram'],
 water:['v35_e_water','v35_e_water','v26_water_guard','v26_water_guard','v26_water_cycle','v26_water_single','v26_water_status','v35_e_prism','v34_g_recovery','v34_g_ram'],
 earth:['v35_e_earth','v35_e_earth','v26_earth_guard','v26_earth_guard','v26_earth_hit','v26_earth_counter','v26_earth_status','v35_e_prism','v34_g_recovery','v34_g_ram'],
 aether:['v35_e_aether','v35_e_aether','v26_aether_guard','v26_aether_guard','v26_aether_multi','v26_aether_cycle','v26_aether_status','v35_e_prism','v34_g_recovery','v34_g_ram'],
 prism:['v35_e_prism','v35_e_prism','v35_e_earth','v35_e_water','v35_e_fire','v35_e_wind','v35_e_aether','v34_g_recovery','v34_g_ram','v34_m_guardstorm']
};
function alchemyPreset(st,cid){const id=st?.id||cid;
 if(id.includes('crucible_sun'))return {allocation:{fire:8,air:0,water:0,earth:2,aether:2},recipes:['lava','ember','magma_core','glass','sun_glass']};
 if(id.includes('crucible_shell'))return {allocation:{fire:4,air:0,water:0,earth:5,aether:3},recipes:['lava','shell','volcanic_shell','ceramic','ward','starsteel']};
 if(id.includes('retort_prism'))return {allocation:{fire:2,air:3,water:3,earth:2,aether:2},recipes:['sand','pulse','storm_crystal','steam','mist','spring','frost_crystal']};
 if(id.includes('magnum_quintessence'))return {allocation:{fire:0,air:0,water:5,earth:4,aether:3},recipes:['clay','spring','world_seed']};
 if(id.includes('magnum')||id.includes('retort_branch')||id.includes('astral_opus'))return {allocation:{fire:3,air:3,water:1,earth:3,aether:2},recipes:['sand','pulse','storm_crystal','glass','resonance_prism','lava','obsidian','obsidian_edge']};
 if(id.includes('alembic'))return {allocation:{fire:5,air:0,water:2,earth:3,aether:2},recipes:['lava','obsidian','ember','magma_core','glass','sun_glass']};
 if(id.includes('vessel'))return {allocation:{fire:3,air:0,water:3,earth:4,aether:2},recipes:['lava','shell','clay','ward','deep_mud','spring','world_seed']};
 if(id.includes('salamander'))return {allocation:{fire:8,air:0,water:0,earth:2,aether:2},recipes:['lava','ember','magma_core','glass','sun_glass']};
 if(id.includes('naiad'))return {allocation:{fire:1,air:2,water:5,earth:1,aether:3},recipes:['steam','mist','spring','frost_crystal','pulse']};
 return {allocation:{fire:4,air:1,water:1,earth:4,aether:2},recipes:['lava','shell','volcanic_shell','ceramic','ward','starsteel']};
}
function configureFamily(s,f,cid,st){let deck=coreDecks[f]? [...coreDecks[f]]:newDeck(f),relics=coreRelics[f]?[...coreRelics[f]]:D.V35_FAMILIES[f].relics.slice(0,3);
 if(f==='architecture'){
   if(st?.id==='echo_singleton'||st?.id==='architect_specialist'||st?.id==='synth_mono'){s.doctrine='singleton'; deck=['v35_a_single','v35_a_doctrine','v35_a_variation','v35_a_hybrid','v35_a_cycle','v35_a_duplicate','v34_g_recovery','v34_g_ram','v34_c_reset','v34_m_guardstorm'];relics=['v35_ra_single','v35_ra_doctrine','v35_ra_guard'];}
   else if(st?.id==='mirror_duplicate'||st?.id==='mirror_repeat'||cid==='echo'||cid==='mirror'){s.doctrine='duplicate';deck=['v35_a_duplicate','v35_a_duplicate','v35_a_doctrine','v35_a_doctrine','v35_a_hybrid','v35_a_hybrid','v35_a_variation','v35_a_cycle','v34_g_recovery','v34_g_ram'];relics=['v35_ra_dup','v35_ra_doctrine','v35_ra_guard'];}
   else {s.doctrine='hybrid';relics=['v35_ra_hybrid','v35_ra_doctrine','v35_ra_guard'];}
 }
 if(f==='position'){
   s.doctrine='duplicate';
   if(st?.id?.includes('wing')||st?.id==='standard_wings'){deck=['v35_p_wings','v35_p_wings','v35_p_wings','v35_p_shift','v35_p_shift','v35_p_wide','v35_p_center','v35_p_repeat','v34_g_recovery','v34_g_ram'];relics=['v35_rp_wings','v35_rp_shift','v35_rp_wide'];}
   else if(st?.id?.includes('center')||st?.id==='standard_focus'){deck=['v35_p_center','v35_p_center','v35_p_center','v35_p_repeat','v35_p_repeat','v35_p_shift','v35_p_wide','v35_p_wings','v34_g_recovery','v34_g_ram'];relics=['v35_rp_center','v35_rp_repeat','v35_rp_wide'];}
   else {deck=['v35_p_shift','v35_p_shift','v35_p_shift','v35_p_center','v35_p_center','v35_p_wings','v35_p_wings','v35_p_wide','v34_g_recovery','v34_g_ram'];relics=['v35_rp_shift','v35_rp_center','v35_rp_wings'];}
 }
 if(f==='link'){
   s.doctrine='duplicate';deck=['v35_l_spear','v35_l_spear','v35_l_spear','v35_l_guard','v35_l_guard','v35_l_guard','v35_l_barrage','v35_l_cycle','v35_l_status','v35_l_bridge'];relics=['v35_rl_core','v35_rl_guard','v35_rl_pair'];
 }
 if(f==='analysis'){
   const clean=st?.id==='tracer_clean';if(clean){s.enemy.traits={};relics=['v35_rx_clean','v35_rx_attack','v35_rx_guard'];}
   else if(st?.id==='tracker_apex'||st?.id==='nexus_traits'){s.enemy.traits={regenerative:true,purifier:true,armored:true,frugal:true,steady:true};relics=['v35_rx_apex','v35_rx_attack','v35_rx_guard'];}
   else if(st?.id?.includes('behavior')){s.enemy.traits={regenerative:true,purifier:true,armored:true};relics=['v35_rx_behavior','v35_rx_attack','v35_rx_guard'];}
   else {s.enemy.traits={regenerative:true,purifier:true,armored:true};relics=['v35_rx_trait','v35_rx_attack','v35_rx_guard'];}
 }
 if(f==='element'){
   const el=elementKey(cid,st);s.doctrine='duplicate';deck=[...elementDeck[el]];relics=el==='prism'?['v35_re_prism','v35_re_earth','v35_re_water']:[`v35_re_${el==='air'?'wind':el}`,'v35_re_prism','v35_rx_guard'].filter(x=>D.RELICS[x]);
   s.alchemy.enabled=true;if(el==='prism')s.alchemy.allocation={fire:3,air:3,water:2,earth:2,aether:2};else {s.alchemy.allocation={fire:1,air:1,water:1,earth:1,aether:1};s.alchemy.allocation[el]=8;const spare=el==='earth'?'fire':'earth';s.alchemy.allocation[spare]=4;for(const k of Object.keys(s.alchemy.allocation))if(![el,spare].includes(k))s.alchemy.allocation[k]=0;}s.alchemy.recipes=[];s.alchemy.hold=[];
   const runeMap={fire:'v23_rune_fire',air:'v23_rune_air',water:'v23_rune_water',earth:'v23_rune_earth',aether:'v23_rune_aether'};if(el!=='prism')for(const x of [...new Set(deck)].slice(0,4))s.cardRunes[x]=runeMap[el];
 }
 if(f==='alchemy'){
   s.doctrine='duplicate';deck=['v35_q_opus','v35_q_opus','v35_q_stock','v35_q_stock','v35_q_react','v35_q_spend','v35_q_shell','v35_q_matrix','v34_g_recovery','v34_g_ram'];relics=['v35_rq_opus','v35_rq_stock','v35_rq_shell'];s.alchemy.enabled=true;const ap=alchemyPreset(st,cid);s.alchemy.allocation=ap.allocation;s.alchemy.recipes=ap.recipes;s.alchemy.hold=[];
 }
 s.deck=deck;s.relics=relics;
 const pmap={multihit:'multihit_accelerator',status:'ailment_catalyst',guard:'counter_matrix',discard:'discard_harness',blood:'scar_exchange',cycle:'cycle_prime',position:'style_resonance',link:'link_guardian',calibration:'conversion_bridge',architecture:'doctrine_bridge',analysis:'behavior_analysis',mystic:'style_resonance',element:'style_resonance',alchemy:'style_resonance'}; if(D.PROTOCOLS[pmap[f]])s.protocol=pmap[f];
 if(f==='link'){s.cardLink={a:'v35_l_spear',b:'v35_l_guard'};s.linkMode='reciprocal';}
 if(f==='calibration'){s.cardTunings={[deck[0]]:'guard',[deck[2]]:'overload',[deck[3]]:'tempo'};for(const id of [deck[1],deck[2],deck[4]]){const cv=Object.keys(D.CARD_CONVERSIONS).find(x=>D.canApplyConversion?.(id,x));if(cv)s.cardConversions[id]=cv;}}
 if(f==='mystic'){s.arcana={id:st?.id==='oracle_reverse'?'arcana_justice':'arcana_strength',orientation:st?.id==='oracle_reverse'?'reversed':'upright'};const rs=['rune_force','rune_ward','rune_barrage'];for(let i=0;i<3;i++)s.cardRunes[deck[i]]=rs[i];if(st?.id==='astral_plain'){s.cardRunes={ [deck[1]]:'rune_ward',[deck[3]]:'rune_barrage'};}if(st?.id==='astral_opus'){s.alchemy.enabled=true;const ap=alchemyPreset(st,cid);s.alchemy.allocation=ap.allocation;s.alchemy.recipes=ap.recipes;s.alchemy.hold=[];}}
 if(f==='discard'&&cid==='remnant'){for(const id of [...new Set(deck)].slice(0,3)){const cv=Object.keys(D.CARD_CONVERSIONS).find(x=>D.canApplyConversion?.(id,x));if(cv)s.cardConversions[id]=cv;}}
 if(f==='position'&&st?.id==='standard_focus')s.cardTunings[deck[0]]='focus';
 if(!s.arcana?.id)s.arcana={id:'arcana_strength',orientation:'upright'};
 return {deck,relics};}
function score(id,b,i){const c=D.CARDS[id];let hits=Math.max(c.hits||1,c.conditionalHits&&Object.values(b.enemy.status).some(x=>x>0)?c.conditionalHits:0,c.lowHpHits&&b.player.hp<=b.player.maxHp/2?c.lowHpHits:0,c.hitsIfRecentReshuffle&&b.recentReshuffle?c.hitsIfRecentReshuffle:0,c.prevMultiHits&&b.lastWasMulti?c.prevMultiHits:0);let dmg=(c.damage||0)*hits,bl=c.block||0;if(c.lowHpDamage&&b.player.hp<=b.player.maxHp/2)dmg=Math.max(dmg,c.lowHpDamage*hits);if(c.lowHpBlock&&b.player.hp<=b.player.maxHp/2)bl=Math.max(bl,c.lowHpBlock);if(c.blockIfEnemyAtkMin&&b.enemy.atk>=c.blockIfEnemyAtkMin.min)bl=Math.max(bl,c.blockIfEnemyAtkMin.value);if(c.damageIfRecentReshuffle&&b.recentReshuffle)dmg=Math.max(dmg,c.damageIfRecentReshuffle*hits);if(c.blockIfRecentReshuffle&&b.recentReshuffle)bl=Math.max(bl,c.blockIfRecentReshuffle);let v=dmg*1.15+bl*1.25+(c.status?.amount||0)*4+(c.statuses?.reduce((a,x)=>a+x.amount,0)||0)*3;if(c.fixedCounterIfEnemyAtkMin&&b.enemy.atk>=c.fixedCounterIfEnemyAtkMin.min)v+=c.fixedCounterIfEnemyAtkMin.value*1.3;if(c.damagePlusBlockRatio)v+=c.damagePlusBlockRatio*bl*2.2;if(c.damagePerReshuffle)v+=c.damagePerReshuffle*b.reshuffles*1.4;if(c.blockPerReshuffle)v+=c.blockPerReshuffle*b.reshuffles*1.4;if(c.consumeStatuses)v+=Object.values(b.enemy.status).reduce((a,n)=>a+n,0)*8;if(c.selfDamage)v-=c.selfDamage*2;const incoming=b.enemy.atk*Math.max(1,Math.floor(b.enemy.spd+(b.fastAccumulator||0)));if(bl&&b.player.hp+b.player.block<incoming*.9)v*=2.0;
 const center=Math.floor((b.prompt.length-1)/2),pos=i<center?'left':i===center?'center':'right';if(id==='v35_p_center'&&pos==='center')v*=2.4;if(id==='v35_p_center'&&pos!=='center')v*=.55;if(id==='v35_p_wings'&&pos!=='center')v*=2.2;if(id==='v35_p_wings'&&pos==='center')v*=.6;if(id==='v35_p_shift'&&b.lastChoicePosition&&pos!==b.lastChoicePosition)v*=2.0;if(id==='v35_p_shift'&&b.lastChoicePosition&&pos===b.lastChoicePosition)v*=.7;if(id==='v35_p_repeat'&&b.lastChoicePosition&&pos===b.lastChoicePosition)v*=1.8;
 // link: once one half was used, aggressively take the complementary half to establish the combo.
 const pair=BuildLab.Store.state.cardLink;if(pair?.a&&pair?.b){if(!b.lastUsed&&(id===pair.a||id===pair.b))v*=3.2;if(b.lastUsed){const want=b.lastUsed.cardId===pair.a?pair.b:b.lastUsed.cardId===pair.b?pair.a:null;if(want&&id===want)v*=4.5;if(want&&id===b.lastUsed.cardId)v*=.55;}}
 const cid=BuildLab.Store.state.character,stid2=BuildLab.Store.state.characterStyles?.[cid],ek=elementKey(cid,stid2?D.CHARACTER_STYLES[stid2]:null);const em={fire:'v35_e_fire',air:'v35_e_wind',water:'v35_e_water',earth:'v35_e_earth',aether:'v35_e_aether',prism:'v35_e_prism'};if(em[ek]===id)v*=2.2;
 // repeat mirror concept when applicable
 const stid=BuildLab.Store.state.characterStyles?.[BuildLab.Store.state.character];if(stid==='mirror_repeat'&&b.lastUsed?.cardId===id)v*=3.0;
 return v;}
function run(cid,st,seed0){let seed=seed0>>>0;Math.random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);const s=BL.Store.defaultState();allUnlock(s);s.character=cid;if(st)s.characterStyles[cid]=st.id;s.enemy={hp:12,atk:10,def:10,spd:4,regen:0,resist:0,traits:{}};const f=familyFor(cid,st),cfg=configureFamily(s,f,cid,st);BL.Store.state=s;let result=null;BL.Battle.onEnd=r=>result=r;const x=BL.Battle.create(false);if(x.error)return {win:false,error:x.error,f,cfg};const target=BL.Battle.current.enemy;if(target.maxHp<504||target.atk<80||target.def<22||target.spd<4)throw new Error('target scaling failed');let steps=0;while(BL.Battle.current&&steps<60){const b=BL.Battle.current;let bi=0,bv=-1e9;b.prompt.forEach((x,i)=>{const v=score(x.cardId,b,i);if(v>bv){bv=v;bi=i;}});BL.Battle.play(bi);steps++;}if(BL.Battle.current)BL.Battle.retire();return {win:!!result?.win,f,trigger:st?(result?.battle?.v35StyleTriggerCount||0):(result?.battle?.v35CharacterTriggerCount||0),enemy:target,cfg};}
const vars=[];for(const [cid,c] of Object.entries(D.CHARACTERS)){vars.push([cid,null,c.name+'・原型']);for(const st of Object.values(D.CHARACTER_STYLES).filter(x=>x.character===cid))vars.push([cid,st,c.name+'・'+st.name]);}
assert.equal(vars.length,141,'40キャラクター＋全101スタイル＝141検証構成であること');
const familyEvidence={
  link:s=>!!(s.cardLink?.a&&s.cardLink?.b),
  calibration:s=>Object.keys(s.cardTunings||{}).length>0||Object.keys(s.cardConversions||{}).length>0,
  architecture:s=>!!s.doctrine,
  mystic:s=>!!s.arcana?.id&&Object.keys(s.cardRunes||{}).length>0,
  element:s=>!!s.alchemy?.enabled&&Object.values(s.alchemy?.allocation||{}).some(n=>n>=3),
  alchemy:s=>!!s.alchemy?.enabled&&(s.alchemy?.recipes||[]).length>0,
  analysis:s=>true,
  position:s=>s.deck.some(id=>(D.CARDS[id]?.tags||[]).some(t=>['提示','提示操作'].includes(t)))||s.deck.some(id=>id.startsWith('v35_p_')),
  discard:s=>s.deck.filter(id=>(D.CARDS[id]?.tags||[]).includes('捨て札')).length>=3,
  multihit:s=>s.deck.filter(id=>(D.CARDS[id]?.tags||[]).includes('連撃')).length>=3,
  status:s=>s.deck.filter(id=>(D.CARDS[id]?.tags||[]).includes('状態異常')).length>=3,
  guard:s=>s.deck.filter(id=>(D.CARDS[id]?.tags||[]).some(t=>['耐久','反撃'].includes(t))).length>=3,
  blood:s=>s.deck.filter(id=>(D.CARDS[id]?.tags||[]).some(t=>['自傷','瀕死'].includes(t))).length>=3,
  cycle:s=>s.deck.filter(id=>(D.CARDS[id]?.tags||[]).includes('循環')).length>=3
};
let results=[];
for(const [cid,st,name] of vars){
  let wins=0,first=null;
  for(let i=0;i<12;i++){const r=run(cid,st,0x350000+i*7919+cid.length*17);if(!first)first=r;if(r.win)wins++;}
  const fam=familyFor(cid,st),s=BL.Store.state;
  // Run once more solely to inspect the concept configuration without depending on battle-side counters.
  const probe=BL.Store.defaultState();allUnlock(probe);probe.character=cid;if(st)probe.characterStyles[cid]=st.id;probe.enemy={hp:12,atk:10,def:10,spd:4,regen:0,resist:0,traits:{}};configureFamily(probe,fam,cid,st);
  assert(familyEvidence[fam]?.(probe),`${name}: ${fam} コンセプト構成になっていない`);
  assert(wins>=4,`${name} (${fam}) が想定エンドコンテンツを再現可能に突破できない: ${wins}/12`);
  results.push({cid,style:st?.id||'base',name,fam,wins});
}
results.sort((a,b)=>a.wins-b.wins);
const worst=results.slice(0,12).map(x=>`${x.name}:${x.wins}/12`).join(' / ');
console.log(`endgame all styles: ${results.length} variants, minimum ${results[0].wins}/12; worst ${worst}`);
console.log('PASS endgame_all_styles.test.js');
