'use strict';
(function(){
  const D=window.BuildLab.Data,U=D.UNLOCKS||[];
  const byId=Object.fromEntries(U.map(u=>[u.id,u]));
  const uniq=a=>[...new Set(a.filter(Boolean))];
  const addReward=(unlockId,ids)=>{const u=byId[unlockId];if(!u)return;u.reward=uniq([...(u.reward||[]),...ids]);};

  // v0.36 章進行再構成。
  // 旧版は「初期」として90カード/48遺物を一括開放しており、章内アンロックの報酬価値を
  // 大きく損ねていた。初期プールは六基礎軸を試せるだけの幅を残し、残りを章内目標へ戻す。
  const starterCards=[
    'discard_blade','parting_gift','embers','selection','double_strike','needle_rain','follow_up','accelerated_slash',
    'poison_needle','brand','break','weakening_mist','wall','counter_stance','parry','last_stand_shield',
    'blood_blade','blood_contract','dying_blow','blood_chain','rebuild','fast_forward','recall','adversity_recovery',
    'cycle_edge','discarded_shell','fading_venom','afterguard','shard_shot','scavenger_cut','triple_cut','puncture_chain',
    'patient_guard','sacrificial_combo','wheel_cut'
  ].filter(id=>D.CARDS[id]);
  const starterRelics=[
    'selection_lens','discard_furnace','multiblade','mixed_vial','burnt_bandage','blood_key','reverse_clock','torn_bookmark',
    'clotting_unit','perfect_wall','discard_capacitor','discard_dagger','chain_reactor','status_prism','venom_siphon',
    'iron_heartbeat','pain_converter','cycle_bearing'
  ].filter(id=>D.RELICS[id]);
  const oldBaseCards=[...(D.BASE_CARD_IDS||[])],oldBaseRelics=[...(D.BASE_RELIC_IDS||[])];
  const lockedCards=oldBaseCards.filter(id=>!starterCards.includes(id));
  const lockedRelics=oldBaseRelics.filter(id=>!starterRelics.includes(id));
  D.BASE_CARD_IDS=[...starterCards];D.BASE_RELIC_IDS=[...starterRelics];

  const promptCards=lockedCards.filter(id=>(D.CARDS[id]?.tags||[]).some(t=>['提示','提示操作'].includes(t)));
  const promptRelics=lockedRelics.filter(id=>(D.RELICS[id]?.tags||[]).some(t=>['提示','提示操作'].includes(t)));
  addReward('boss_clear',[...promptCards,...promptRelics]);

  const axisDefs=[
    {key:'discard',tags:['捨て札'],early:'p_discard',late:'v08_discard_cycle'},
    {key:'multihit',tags:['連撃'],early:'p_multihit',late:'v08_multihit_master'},
    {key:'status',tags:['状態異常'],early:'p_ailment',late:'v08_status_master'},
    {key:'guard',tags:['耐久','反撃'],early:'p_fortify',late:'v08_guard_counter'},
    {key:'blood',tags:['自傷','瀕死'],early:'p_scar',late:'v08_self_cycle'},
    {key:'cycle',tags:['循環'],early:'p_cycle',late:'v08_cycle_master'},
    {key:'hybrid',tags:['万能'],early:'p_hybrid',late:'v08_discard_status'}
  ];
  const unassignedCards=lockedCards.filter(id=>!promptCards.includes(id)),unassignedRelics=lockedRelics.filter(id=>!promptRelics.includes(id));
  function assign(items,table){
    const groups=Object.fromEntries(axisDefs.map(x=>[x.key,[]]));
    for(const id of items){const tags=table[id]?.tags||[];let def=axisDefs.find(x=>x.tags.some(t=>tags.includes(t)));if(!def)def=axisDefs[axisDefs.length-1];groups[def.key].push(id);}
    for(const def of axisDefs){const ids=groups[def.key],cut=Math.ceil(ids.length*.45);addReward(def.early,ids.slice(0,cut));addReward(def.late,ids.slice(cut));}
    return groups;
  }
  const cardGroups=assign(unassignedCards,D.CARDS),relicGroups=assign(unassignedRelics,D.RELICS);

  // 「暴君/機動要塞」は高度敵パラメータ解禁後に扱う複合個体へ移動。
  for(const id of ['c_tyrant','c_mobile']){const u=byId[id];if(!u)continue;u.chapter=2;if(!String(u.condition||'').startsWith('第1ボス撃破後、'))u.condition='第1ボス撃破後、'+u.condition;if(u.event==='win'&&u.when){const old=u.when;u.when=(s,b)=>!!s.bossDefeated&&old(s,b);}}

  // 第1章ボス報酬を「次章を始めるための最低限の提示操作一式」として明示。
  // 旧初期プールから移した提示系もここで渡すため、第2章導入時に選択肢が揃う。
  const bossClear=byId.boss_clear;if(bossClear)bossClear.condition='第1ボス「観測体」を撃破。第2章の提示操作・高度敵パラメータ用の基礎装備を解放';

  // 旧セーブ移行用。既に「無料開放」されていた旧BASE項目だけを一度再ロックし、
  // 実際に達成済みのアンロック報酬は保持する。パッケージ更新後も一度しか実行しない。
  function normalizeState(s){
    s.flags=s.flags||{};if(s.flags.progression36Rebalanced)return;
    const earned=new Set();for(const u of U)if(s.claimedUnlocks?.[u.id])for(const id of u.reward||[])earned.add(id);
    for(const id of lockedCards)if(!earned.has(id))delete s.unlockedCards?.[id];
    for(const id of lockedRelics)if(!earned.has(id))delete s.unlockedRelics?.[id];
    for(const id of starterCards)s.unlockedCards[id]=true;for(const id of starterRelics)s.unlockedRelics[id]=true;
    s.flags.progression36Rebalanced=true;
  }

  D.PROGRESSION36={
    starterCards,starterRelics,lockedCards,lockedRelics,promptCards,promptRelics,cardGroups,relicGroups,normalizeState,
    chapterIntent:{1:'六基礎軸＋基本特殊個体',2:'提示操作・調律・再生/耐性対策',3:'カード連結・役割変換',4:'構築規格',5:'統合運用→第4ボス',10:'極限倍率エンドコンテンツ'},
    philosophy:'各章で得た道具を次の章ボスへの回答として使う。前章装備だけでも戦えるが、章固有システムを使わない場合はボス側の適応補正で明確に不利になる。'
  };
})();
