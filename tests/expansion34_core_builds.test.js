'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert');global.window=global;
const mem={};global.localStorage={getItem:k=>mem[k]??null,setItem:(k,v)=>mem[k]=String(v),removeItem:k=>delete mem[k]};
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const m of html.matchAll(/<script src="([^"?]+)/g)){const f=m[1];if(f.includes('/ui/')||f.endsWith('app.js'))continue;require(path.join(root,f));}
const BL=global.BuildLab,D=BL.Data;
const axes=D.V34_BUILD_AXES;assert(axes,'v34 build axes missing');assert.equal(Object.keys(axes).length,6);
for(const [id,a] of Object.entries(axes)){
  assert.equal(a.cards.length,6,`${id}: expected 6 cards`);assert.equal(a.relics.length,6,`${id}: expected 6 relics`);
  assert.equal(new Set(a.cards).size,6,`${id}: duplicate cards`);assert.equal(new Set(a.relics).size,6,`${id}: duplicate relics`);
  for(const x of a.cards){assert(D.CARDS[x],`${id}: missing card ${x}`);assert((D.CARDS[x].tags||[]).includes(a.tag),`${id}: card ${x} lacks axis tag`);}
  for(const x of a.relics){assert(D.RELICS[x],`${id}: missing relic ${x}`);assert((D.RELICS[x].tags||[]).includes(a.tag),`${id}: relic ${x} lacks axis tag`);assert(D.V34_RELIC_RULES[x]?.length,`${id}: relic ${x} has no battle rule`);}
  const roles=new Set(a.cards.map(x=>D.CARDS[x].kind));assert(roles.size>=2,`${id}: six cards collapse to one role`);
  const ruleSigs=new Set(a.relics.map(x=>JSON.stringify(D.V34_RELIC_RULES[x])));assert(ruleSigs.size>=5,`${id}: relic choices are too similar`);
}
assert.equal(D.V34_CARD_IDS.length,36);assert.equal(D.V34_RELIC_IDS.length,36);
const rewarded=new Set(D.UNLOCKS.flatMap(u=>u.reward||[]));for(const id of [...D.V34_CARD_IDS,...D.V34_RELIC_IDS])assert(rewarded.has(id),`v34 item has no unlock route ${id}`);

function allUnlock(s){
 s.bossDefeated=s.boss2Defeated=s.boss3Defeated=s.boss4Defeated=true;
 for(const id of Object.keys(D.CARDS))s.unlockedCards[id]=true;for(const id of Object.keys(D.RELICS))s.unlockedRelics[id]=true;
 for(const id of Object.keys(D.CHARACTERS))s.unlockedCharacters[id]=true;for(const id of Object.keys(D.CHARACTER_STYLES||{}))s.unlockedCharacterStyles[id]=true;
 for(const id of Object.keys(D.PROTOCOLS||{}))s.unlockedProtocols[id]=true;for(const id of Object.keys(D.TUNINGS||{}))s.unlockedTunings[id]=true;for(const id of Object.keys(D.CARD_CONVERSIONS||{}))s.unlockedConversions[id]=true;for(const id of Object.keys(D.RUNES||{}))s.unlockedRunes[id]=true;for(const id of Object.keys(D.ARCANA||{}))s.unlockedArcana[id]=true;for(const id of Object.keys(D.DOCTRINES||{}))s.unlockedDoctrines[id]=true;for(const id of Object.keys(D.LINK_MODES||{}))s.unlockedLinkModes[id]=true;for(const id of Object.keys(D.TRAITS||{}))s.unlockedTraits[id]=true;for(const id of Object.keys(D.ENEMY_BEHAVIORS||{}))s.unlockedBehaviors[id]=true;
 s.unlockedSystems={advanced_enemy_parameters:true,prompt_control:true,card_link:true,card_conversion:true,deck_doctrine:true,rune:true,arcana:true};
 // Requirement target: HP×12 / attack×10 / defense×10 / speed×4 simultaneously. Traits remain optional/off.
 s.enemy={hp:12,atk:10,def:10,spd:4,regen:0,resist:0,traits:{}};
}
const builds={
 discard:{character:'archive',deck:['v34_d_scrap_lance','v34_d_scrap_lance','v34_d_refuse_wall','v34_d_refuse_wall','v34_d_shrapnel','v34_d_salvage_guard','v34_d_salvage_guard','v34_d_landfill','v34_d_afterimage','v34_d_afterimage'],relics:['v34_rd_core','v34_rd_bulwark','v34_rd_arsenal'],protocol:'discard_harness',tunes:{v34_d_salvage_guard:'guard',v34_d_scrap_lance:'residue'},runes:{v34_d_salvage_guard:'rune_ward',v34_d_scrap_lance:'rune_echo',v34_d_landfill:'rune_force'},arcana:['arcana_death','upright']},
 multihit:{character:'combo',deck:['v34_m_drill','v34_m_drill','v34_m_guardstorm','v34_m_guardstorm','v34_m_accel','v34_m_needlefort','v34_m_needlefort','v34_m_statusburst','v34_m_final','v34_m_final'],relics:['v34_rm_core','v34_rm_long','v34_rm_guard'],protocol:'multihit_accelerator',tunes:{v34_m_guardstorm:'guard',v34_m_final:'rapid'},runes:{v34_m_guardstorm:'rune_ward',v34_m_final:'rune_barrage',v34_m_drill:'rune_barrage'},arcana:['arcana_chariot','upright']},
 status:{character:'catalyst',deck:['v34_s_plague','v34_s_plague','v34_s_quarantine','v34_s_quarantine','v34_s_corrode','v34_s_fever','v34_s_detonate','v34_s_detonate','v34_s_pestwall','v34_s_pestwall'],relics:['v34_rs_core','v34_rs_loaded','v34_rs_guard'],protocol:'ailment_catalyst',tunes:{v34_s_quarantine:'guard',v34_s_detonate:'overload'},runes:{v34_s_quarantine:'rune_ward',v34_s_plague:'rune_venom',v34_s_detonate:'rune_venom'},arcana:['arcana_star','upright']},
 guard:{character:'bulwark',deck:['v34_g_citadel','v34_g_citadel','v34_g_retaliate','v34_g_intercept','v34_g_intercept','v34_g_ram','v34_g_recovery','v34_g_recovery','v34_g_perfect','v34_g_perfect'],relics:['v34_rg_core','v34_rg_block','v34_rg_pressure'],protocol:'counter_matrix',tunes:{v34_g_intercept:'guard',v34_g_ram:'guard'},runes:{v34_g_intercept:'rune_ward',v34_g_ram:'rune_ward',v34_g_citadel:'rune_ward'},arcana:['arcana_strength','upright']},
 blood:{character:'risk',deck:['v34_b_crimson','v34_b_crimson','v34_b_pressure','v34_b_pressure','v34_b_scarstorm','v34_b_contract','v34_b_revenge','v34_b_revenge','v34_b_terminal','v34_b_terminal'],relics:['v34_rb_core','v34_rb_attack','v34_rb_guard'],protocol:'scar_exchange',tunes:{v34_b_pressure:'guard',v34_b_terminal:'brink'},runes:{v34_b_pressure:'rune_ward',v34_b_terminal:'rune_crisis',v34_b_crimson:'rune_force'},arcana:['arcana_devil','upright']},
 cycle:{character:'loop',deck:['v34_c_reactor','v34_c_reactor','v34_c_bastion','v34_c_bastion','v34_c_reset','v34_c_return','v34_c_return','v34_c_loopguard','v34_c_loopguard','v34_c_wheel'],relics:['v34_rc_core','v34_rc_recent','v34_rc_guard'],protocol:'cycle_prime',tunes:{v34_c_loopguard:'guard',v34_c_return:'recycle'},runes:{v34_c_loopguard:'rune_ward',v34_c_return:'rune_rebirth',v34_c_wheel:'rune_rebirth'},arcana:['arcana_wheel','upright']}
};
function score(name,id,b){const c=D.CARDS[id];let v=0;const incoming=b.enemy.atk*Math.max(1,Math.floor(b.enemy.spd+(b.fastAccumulator||0))),totalStatus=Object.values(b.enemy.status).reduce((a,n)=>a+n,0),hits=c.hits||1;
 v+=(c.damage||0)*hits*1.1+(c.block||0)*1.05+(c.lowHpDamage||0)*.25+(c.lowHpBlock||0)*.35+(c.status?.amount||0)*5+(c.statuses?.reduce((a,x)=>a+x.amount,0)||0)*4;
 if(c.blockIfEnemyAtkMin&&b.enemy.atk>=c.blockIfEnemyAtkMin.min)v+=c.blockIfEnemyAtkMin.value*1.4;if(c.fixedCounterIfEnemyAtkMin&&b.enemy.atk>=c.fixedCounterIfEnemyAtkMin.min)v+=c.fixedCounterIfEnemyAtkMin.value*2;if(c.damagePlusBlockRatio)v+=c.damagePlusBlockRatio*(c.blockIfEnemyAtkMin?.value||c.block||0)*4;
 if(c.blockPerDiscardedThisTurn)v+=c.blockPerDiscardedThisTurn*2.5;if(c.damagePerDiscardedThisTurn)v+=c.damagePerDiscardedThisTurn*2.5;if(c.damageIfRecentReshuffle&&b.recentReshuffle)v+=c.damageIfRecentReshuffle*2;if(c.blockIfRecentReshuffle&&b.recentReshuffle)v+=c.blockIfRecentReshuffle*2;if(c.damagePerReshuffle)v+=c.damagePerReshuffle*b.reshuffles*1.5;if(c.blockPerReshuffle)v+=c.blockPerReshuffle*b.reshuffles*1.5;
 if(c.consumeStatuses)v+=totalStatus*8;if(c.damagePerTotalStatus)v+=totalStatus*c.damagePerTotalStatus;if(name==='blood'&&b.player.hp<=b.player.maxHp/2)v+=(c.lowHpDamage||0)*2+(c.lowHpBlock||0)*2;if((c.block||c.blockIfEnemyAtkMin||c.lowHpBlock||c.blockIfRecentReshuffle)&&b.player.hp<incoming*.7)v*=1.6;return v;}
function run(name,cfg,seed0){let seed=seed0>>>0;Math.random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);const s=BL.Store.defaultState();allUnlock(s);s.character=cfg.character;s.deck=[...cfg.deck];s.relics=[...cfg.relics];s.protocol=cfg.protocol;s.cardTunings={...cfg.tunes};s.cardRunes={...cfg.runes};s.arcana={id:cfg.arcana[0],orientation:cfg.arcana[1]};BL.Store.state=s;let result=null;BL.Battle.onEnd=r=>result=r;const start=BL.Battle.create(false);assert(!start.error,start.error);
 const e=BL.Battle.current.enemy;assert(e.maxHp>=42*12&&e.atk>=8*10&&e.def>=2.5*(10-1)&&e.spd>=4,`${name}: target enemy scaling not met`);
 let steps=0;while(BL.Battle.current&&steps<45){const b=BL.Battle.current;let bi=0,bv=-Infinity;b.prompt.forEach((x,i)=>{const sv=score(name,x.cardId,b);if(sv>bv){bv=sv;bi=i;}});BL.Battle.play(bi);steps++;}if(BL.Battle.current)BL.Battle.retire();return result;}
const rates={};for(const [name,cfg] of Object.entries(builds)){let wins=0;const N=80;for(let i=1;i<=N;i++){const r=run(name,cfg,0x34B17D+i*977);if(r?.win)wins++;}rates[name]=wins/N;assert(rates[name]>=.70,`${name}: extreme target win rate ${(rates[name]*100).toFixed(1)}% < 70%`);}
console.log('PASS expansion34_core_builds.test.js',Object.fromEntries(Object.entries(rates).map(([k,v])=>[k,`${(v*100).toFixed(1)}%`])));
