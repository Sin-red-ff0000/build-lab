'use strict';
(function(){
 const D=window.BuildLab.Data;if(!D.UNLOCKS||!D.V52_DUAL_FACE_IDS)return;
 const win=(id,reward,title,condition,when)=>({id,kind:'card',reward,title,condition,event:'win',chapter:9,when:(s,b)=>!!b?.win&&when(s,b),check:s=>!!s.claimedUnlocks?.[id]});
 D.UNLOCKS.push(
  win('v52_dual_choice',['v52_dual_patience','v52_dual_center','v52_dual_sides'],'二面：選択履歴','第4ボス撃破後、提示位置または非選択を利用するカードを3枚以上採用して勝利',(s)=>s.boss4Defeated&&s.deck.filter(id=>['非選択','提示位置'].some(t=>(D.CARDS[id]?.tags||[]).includes(t))).length>=3),
  win('v52_dual_zones',['v52_dual_return','v52_dual_reserve','v52_dual_cycle'],'二面：領域遷移','第4ボス撃破後、消失・予約・循環カードを合計4枚以上採用して勝利',(s)=>s.boss4Defeated&&s.deck.filter(id=>['消失','予約','循環'].some(t=>(D.CARDS[id]?.tags||[]).includes(t))).length>=4),
  win('v52_dual_condition',['v52_dual_pulse','v52_dual_poison','v52_dual_burn'],'二面：戦闘状態','第4ボス撃破後、自傷・毒・火傷カードを合計5枚以上採用して勝利',(s)=>s.boss4Defeated&&s.deck.filter(id=>['自傷','毒','火傷'].some(t=>(D.CARDS[id]?.tags||[]).includes(t))).length>=5),
  win('v52_dual_history',['v52_dual_link','v52_dual_record','v52_dual_enemy'],'二面：履歴解析','第4ボス撃破後、連結を設定するか記録カードを採用し、4ターン以上の戦闘に勝利',(s,b)=>s.boss4Defeated&&b.turn>=4&&(!!s.cardLink?.a||s.deck.some(id=>(D.CARDS[id]?.tags||[]).includes('記録'))))
 );
})();
