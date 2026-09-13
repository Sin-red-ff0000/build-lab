'use strict';
(function(){
  const BL = window.BuildLab;
  const D = BL.Data;
  const claimed=id=>s=>!!(s.claimedUnlocks&&s.claimedUnlocks[id]);
  const trait=id=>s=>!!s.unlockedTraits[id];
  const win=(id,kind,reward,title,condition,when)=>({id,kind,reward,title,condition,event:'win',when,check:claimed(id)});
  D.UNLOCKS = [
    win('u_hp5','card',['long_battle','aged_poison'],'高耐久への回答 I','HP倍率×5以上の敵を撃破',(s,b)=>s.enemy.hp>=5),
    win('u_atk5','card',['intercept','blood_return'],'高火力への回答 I','攻撃力倍率×5以上の敵を撃破',(s,b)=>s.enemy.atk>=5),
    win('u_def5','card',['drill_flurry','corrosion'],'高防御への回答 I','防御力倍率×5以上の敵を撃破',(s,b)=>s.enemy.def>=5),
    win('u_spd2','card',['gale_thrust','recovery_run'],'高速戦への回答 I','速度倍率×2以上の敵を撃破',(s,b)=>s.enemy.spd>=2),

    win('u_hp8','card',['deep_guard','enduring_venom'],'高耐久への回答 II','HP倍率×8以上の敵を撃破',(s,b)=>s.enemy.hp>=8),
    win('u_atk7','card',['revenge_edge','crimson_peak'],'高火力への回答 II','攻撃力倍率×7以上の敵を撃破',(s,b)=>s.enemy.atk>=7),
    win('u_def7','card',['acid_saw','melt_brand'],'高防御への回答 II','防御力倍率×7以上の敵を撃破',(s,b)=>s.enemy.def>=7),
    win('u_spd25','card',['flash_chain','recycle_dash'],'高速戦への回答 II','速度倍率×2.5以上の敵を撃破',(s,b)=>s.enemy.spd>=2.5),

    win('u_hp5atk5','card',['grit_blood','death_drive'],'耐久・火力複合試験','HP倍率×5＋攻撃力倍率×5以上の敵を撃破',(s,b)=>s.enemy.hp>=5&&s.enemy.atk>=5),
    win('u_hp5def5','card',['bastion_poison','recycle_wall'],'耐久・重装複合試験','HP倍率×5＋防御力倍率×5以上の敵を撃破',(s,b)=>s.enemy.hp>=5&&s.enemy.def>=5),
    win('u_atk5spd2','card',['frenzy_chain','hot_blood'],'火力・高速複合試験','攻撃力倍率×5＋速度倍率×2以上の敵を撃破',(s,b)=>s.enemy.atk>=5&&s.enemy.spd>=2),
    win('u_def5spd2','card',['drill_cycle','toxic_turn'],'重装・高速複合試験','防御力倍率×5＋速度倍率×2以上の敵を撃破',(s,b)=>s.enemy.def>=5&&s.enemy.spd>=2),
    win('c_longdrive','card',['long_drive'],'高耐久高速試験','HP倍率×5＋速度倍率×2以上の敵を撃破',(s,b)=>s.enemy.hp>=5&&s.enemy.spd>=2),
    win('c_shatter','card',['shatter_return'],'高火力重装試験','攻撃力倍率×5＋防御力倍率×5以上の敵を撃破',(s,b)=>s.enemy.atk>=5&&s.enemy.def>=5),

    {id:'t_giant',kind:'trait',reward:['giant'],title:'特殊個体：巨躯',condition:'敵HP倍率を×10以上に設定して実験開始',check:trait('giant')},
    {id:'t_berserk',kind:'trait',reward:['berserk'],title:'特殊個体：凶暴',condition:'敵攻撃力倍率を×8以上に設定して実験開始',check:trait('berserk')},
    {id:'t_armored',kind:'trait',reward:['armored'],title:'特殊個体：重装',condition:'敵防御力倍率を×8以上に設定して実験開始',check:trait('armored')},
    {id:'t_fast',kind:'trait',reward:['fast'],title:'特殊個体：高速',condition:'敵速度倍率を×3以上に設定して実験開始',check:trait('fast')},

    win('r_giant','mixed',['long_observation','late_bloom','endurance_cut'],'巨躯個体の初撃破','巨躯個体を撃破',(s,b)=>b.enemy.traits.includes('giant')),
    win('r_berserk','mixed',['reflect_bone','red_mirror','revenge_guard'],'凶暴個体の初撃破','凶暴個体を撃破',(s,b)=>b.enemy.traits.includes('berserk')),
    win('r_armored','mixed',['erosion_sample','corrosion_lens','piercing_poison'],'重装個体の初撃破','重装個体を撃破',(s,b)=>b.enemy.traits.includes('armored')),
    win('r_fast','mixed',['overrotation','tempo_spool','tempo_break'],'高速個体の初撃破','高速個体を撃破',(s,b)=>b.enemy.traits.includes('fast')),

    win('c_tyrant','mixed',['tyrant','blood_wall','tyrant_heart'],'複合個体：暴君','巨躯＋凶暴を同時適用して撃破',(s,b)=>b.enemy.traits.includes('giant')&&b.enemy.traits.includes('berserk')),
    win('c_mobile','mixed',['mobile_fortress','bore_chain','mobile_coil'],'複合個体：機動要塞','高速＋重装を同時適用して撃破',(s,b)=>b.enemy.traits.includes('fast')&&b.enemy.traits.includes('armored')),
    win('r_longdrive','mixed',['swift_giant','long_drive_engine','giant_step','crush_poison','momentum_vessel'],'巨躯高速試験','巨躯＋高速を同時適用して撃破',(s,b)=>b.enemy.traits.includes('giant')&&b.enemy.traits.includes('fast')),
    win('r_pressure','mixed',['breaker','pressure_plate','breaker_edge','breaker_guard','breaker_anvil'],'凶暴重装試験','凶暴＋重装を同時適用して撃破',(s,b)=>b.enemy.traits.includes('berserk')&&b.enemy.traits.includes('armored')),
    win('r_fortresscore','mixed',['bastion','fortress_core','fortress_ram','bastion_recycle','bastion_memory'],'巨躯重装試験','巨躯＋重装を同時適用して撃破',(s,b)=>b.enemy.traits.includes('giant')&&b.enemy.traits.includes('armored')),
    win('r_frenzygear','mixed',['frenzy','frenzy_gear','frenzy_blood','swift_toxin','frenzy_clock'],'凶暴高速試験','凶暴＋高速を同時適用して撃破',(s,b)=>b.enemy.traits.includes('berserk')&&b.enemy.traits.includes('fast')),

    win('u_hp12','mixed',['patient_execution','deep_cycle_guard','endurance_clock'],'極高耐久試験','HP倍率×12以上の敵を撃破',(s,b)=>s.enemy.hp>=12),
    win('u_atk10','mixed',['retaliation_engine','redline_cut','danger_sensor'],'極高火力試験','攻撃力倍率×10以上の敵を撃破',(s,b)=>s.enemy.atk>=10),
    win('u_def10','mixed',['absolute_corrosion','armor_saw','fracture_scope'],'極高防御試験','防御力倍率×10以上の敵を撃破',(s,b)=>s.enemy.def>=10),
    win('u_spd4','mixed',['hyper_chain','rapid_guard','highspeed_core'],'極高速試験','速度倍率×4以上の敵を撃破',(s,b)=>s.enemy.spd>=4),

    win('m_tyrant','mixed',['tyrant_decree','tyrant_crown'],'暴君個体・再検証','解放済みの「暴君個体」を適用して撃破',(s,b)=>b.enemy.traits.includes('tyrant')),
    win('m_mobile','mixed',['mobile_array','mobile_gyro'],'機動要塞個体・再検証','解放済みの「機動要塞個体」を適用して撃破',(s,b)=>b.enemy.traits.includes('mobile_fortress')),
    win('tri_gba','mixed',['triad_ironblood','blood_iron_reactor'],'三重特殊：鉄血','巨躯＋凶暴＋重装を同時適用して撃破',(s,b)=>['giant','berserk','armored'].every(x=>b.enemy.traits.includes(x))),
    win('tri_gbf','mixed',['triad_rush','rush_prism'],'三重特殊：暴走','巨躯＋凶暴＋高速を同時適用して撃破',(s,b)=>['giant','berserk','fast'].every(x=>b.enemy.traits.includes(x))),
    win('tri_gaf','mixed',['triad_citadel','citadel_loop'],'三重特殊：輪転城塞','巨躯＋重装＋高速を同時適用して撃破',(s,b)=>['giant','armored','fast'].every(x=>b.enemy.traits.includes(x))),
    win('tri_baf','mixed',['triad_execution','execution_lens'],'三重特殊：処刑','凶暴＋重装＋高速を同時適用して撃破',(s,b)=>['berserk','armored','fast'].every(x=>b.enemy.traits.includes(x))),
    win('quad_base','mixed',['catastrophe_protocol','adaptive_countermeasure','fourfold_core'],'四重特殊試験','巨躯＋凶暴＋重装＋高速を同時適用して撃破',(s,b)=>['giant','berserk','armored','fast'].every(x=>b.enemy.traits.includes(x))),
    win('calibration','relic',['calibration_core'],'全域校正','HP×12・攻撃×10・防御×10・速度×4以上を同時に満たした敵を撃破',(s,b)=>s.enemy.hp>=12&&s.enemy.atk>=10&&s.enemy.def>=10&&s.enemy.spd>=4),


    win('p_fortify','protocol',['fortify_calibration'],'強化プロトコル：堅守校正','耐久タグを4枚以上採用したデッキで勝利',(s,b)=>s.deck.filter(id=>D.CARDS[id]?.tags.includes('耐久')).length>=4),
    win('p_assault','protocol',['assault_calibration'],'強化プロトコル：強襲校正','攻撃カードを6枚以上採用したデッキで勝利',(s,b)=>s.deck.filter(id=>{const c=D.CARDS[id];return c&&(c.damage!=null||c.hits||c.kind==='hybrid');}).length>=6),
    win('p_discard','protocol',['discard_harness'],'強化プロトコル：残滓利用','捨て札タグを4枚以上採用したデッキで勝利',(s,b)=>s.deck.filter(id=>D.CARDS[id]?.tags.includes('捨て札')).length>=4),
    win('p_multihit','protocol',['multihit_accelerator'],'強化プロトコル：多段加速','連撃タグを4枚以上採用したデッキで勝利',(s,b)=>s.deck.filter(id=>D.CARDS[id]?.tags.includes('連撃')).length>=4),
    win('p_ailment','protocol',['ailment_catalyst'],'強化プロトコル：症状触媒','状態異常タグを4枚以上採用したデッキで勝利',(s,b)=>s.deck.filter(id=>D.CARDS[id]?.tags.includes('状態異常')).length>=4),
    win('p_scar','protocol',['scar_exchange'],'強化プロトコル：瘢痕変換','自傷タグを4枚以上採用したデッキで勝利',(s,b)=>s.deck.filter(id=>D.CARDS[id]?.tags.includes('自傷')).length>=4),
    win('p_cycle','protocol',['cycle_prime'],'強化プロトコル：再循環','循環タグを4枚以上採用したデッキで勝利',(s,b)=>s.deck.filter(id=>D.CARDS[id]?.tags.includes('循環')).length>=4),
    win('p_hybrid','protocol',['hybrid_optimizer'],'強化プロトコル：混成最適化','2タグ以上のカードを6枚以上採用したデッキで勝利',(s,b)=>s.deck.filter(id=>(D.CARDS[id]?.tags.length||0)>=2).length>=6),
    win('p_counter','protocol',['counter_matrix'],'強化プロトコル：反撃演算','反撃タグを3枚以上採用したデッキで勝利',(s,b)=>s.deck.filter(id=>D.CARDS[id]?.tags.includes('反撃')).length>=3),

    {id:'boss',kind:'boss',reward:['第1ボス挑戦権'],title:'第1ボス「観測体」',condition:'基本特殊個体4種（巨躯・凶暴・重装・高速）をそれぞれ撃破',check:s=>BL.Unlock.bossAvailable(s)},
    win('boss_clear','system',['prompt_control','advanced_enemy_parameters','character_style','center_lock','hold','reorder','redraw','phase_exchanger','holding_tank','reroll_terminal','center_drive','wide_scan','narrow_scan'],'提示操作＋高度敵パラメータ','第1ボス「観測体」を撃破',(s,b)=>b.bossId==='boss1')
  ];


  // v0.6: 既存目標を第1章として扱い、第1ボス後に第2章を追加。
  D.UNLOCKS.forEach(u=>{if(!u.chapter)u.chapter=1;});
  const chapter2=(u)=>Object.assign(u,{chapter:2});
  D.UNLOCKS.push(
    chapter2(win('v06_prompt_entry','mixed',['center_guard','center_burst','left_sweep','right_charge','center_compass','left_battery','right_capacitor','vector','position_flux'],'第2章：位置実験 I','第1ボス撃破後、提示操作タグを2枚以上採用したデッキで勝利',(s,b)=>s.bossDefeated&&s.deck.filter(id=>D.CARDS[id]?.tags.includes('提示操作')).length>=2)),
    chapter2(win('v06_prompt_mastery','mixed',['center_counter','left_guard','right_poison','position_cycle','reserve_blade','reserve_guard','reserve_amplifier','position_prism'],'第2章：位置実験 II','第1ボス撃破後、提示操作タグを4枚以上採用したデッキで勝利',(s,b)=>s.bossDefeated&&s.deck.filter(id=>D.CARDS[id]?.tags.includes('提示操作')).length>=4)),
    chapter2(win('v06_prompt_tools','mixed',['redraw_strike','reorder_guard','narrow_guard','wide_barrage','prompt_detonator','discarded_center','reroll_capacitor','second_observer','reserve_drive'],'第2章：提示改造','第1ボス撃破後、提示操作タグを6枚以上採用したデッキで勝利',(s,b)=>s.bossDefeated&&s.deck.filter(id=>D.CARDS[id]?.tags.includes('提示操作')).length>=6)),

    chapter2(win('v06_tuning_system','system',['card_tuning'],'カード調律システム','第1ボス撃破後、提示操作カードを2枚以上採用して勝利',(s,b)=>s.bossDefeated&&s.deck.filter(id=>D.CARDS[id]?.tags.includes('提示操作')).length>=2)),
    chapter2(win('v06_tuning_first','mixed',['tuned_edge','tuned_guard','tuning_core','tuned_overdrive'],'調律実験 I','カード調律を1種類以上設定したデッキで勝利',(s,b)=>BL.Unlock.hasSystem(s,'card_tuning')&&Object.keys(s.cardTunings||{}).length>=1)),
    chapter2(win('v06_tuning_second','mixed',['tuned_barrage','tuned_toxin','residue_bridge','overload_bastion','recycle_lance','overload_sink','recycle_rotor','residue_receiver'],'調律実験 II','カード調律を2種類設定したデッキで勝利',(s,b)=>BL.Unlock.hasSystem(s,'card_tuning')&&Object.keys(s.cardTunings||{}).length>=2)),

    chapter2({id:'v06_t_regen',kind:'trait',reward:['regenerative'],title:'特殊個体：再生',condition:'第1ボス撃破後、敵の再生力を5以上に設定して実験開始',check:trait('regenerative')}),
    chapter2({id:'v06_t_purifier',kind:'trait',reward:['purifier'],title:'特殊個体：浄化',condition:'第1ボス撃破後、敵の状態異常耐性を50%以上に設定して実験開始',check:trait('purifier')}),
    chapter2(win('v06_regen3','card',['regen_breaker','renewal_theft'],'再生対策試験','再生力3以上の敵を撃破',(s,b)=>s.bossDefeated&&s.enemy.regen>=3)),
    chapter2(win('v06_resist30','card',['purity_breach','sterile_wall'],'耐性対策試験','状態異常耐性30%以上の敵を撃破',(s,b)=>s.bossDefeated&&s.enemy.resist>=30)),
    chapter2(win('v06_regen_trait','mixed',['scorched_wound','relentless_cut','regen_hunter','cautery_core','anti_regen'],'再生個体の初撃破','再生個体を撃破',(s,b)=>b.enemy.traits.includes('regenerative'))),
    chapter2(win('v06_purifier_trait','mixed',['resistance_saw','cleanse_bait','sterile_needle','resistance_converter','anti_resist'],'浄化個体の初撃破','浄化個体を撃破',(s,b)=>b.enemy.traits.includes('purifier'))),

    chapter2(win('v06_immortal','mixed',['immortal','adaptive_lens'],'複合個体：不死','巨躯＋再生を同時適用して撃破',(s,b)=>b.enemy.traits.includes('giant')&&b.enemy.traits.includes('regenerative'))),
    chapter2(win('v06_sanctified','mixed',['sanctified','purification_breaker'],'複合個体：聖殻','重装＋浄化を同時適用して撃破',(s,b)=>b.enemy.traits.includes('armored')&&b.enemy.traits.includes('purifier'))),
    chapter2(win('v06_adaptive','mixed',['adaptive','adaptive_build'],'複合個体：適応','再生＋浄化を同時適用して撃破',(s,b)=>b.enemy.traits.includes('regenerative')&&b.enemy.traits.includes('purifier'))),
    chapter2(win('v06_liferush','mixed',['liferush','cycle_reserve'],'複合個体：生命奔流','高速＋再生を同時適用して撃破',(s,b)=>b.enemy.traits.includes('fast')&&b.enemy.traits.includes('regenerative'))),

    chapter2(win('v06_archive','character',['archive'],'新キャラクター：アーカイブ','第1ボス撃破後、捨て札タグ4枚＋循環タグ4枚以上のデッキで勝利',(s,b)=>s.bossDefeated&&s.deck.filter(id=>D.CARDS[id]?.tags.includes('捨て札')).length>=4&&s.deck.filter(id=>D.CARDS[id]?.tags.includes('循環')).length>=4)),
    chapter2(win('v06_position_relic','relic',['cycle_reserve'],'保留再利用試験','第1ボス撃破後、保留または中央固定を含むデッキで3勝目を達成',(s,b)=>s.bossDefeated&&s.stats.wins>=3&&s.deck.some(id=>['hold','center_lock','reserve_blade','reserve_guard'].includes(id))))
  );
})();
