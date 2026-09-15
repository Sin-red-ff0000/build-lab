'use strict';
(function(){
 const D=window.BuildLab.Data; D.UNLOCKS=D.UNLOCKS||[];
 const count=(s,t)=>s.deck.filter(id=>(D.getCardTags?D.getCardTags(s,id):(D.CARDS[id]?.tags||[])).includes(t)).length;
 const add=(id,ch,title,condition,when)=>D.UNLOCKS.push({id,kind:'mixed',reward:[ch,...D.V53_STYLE_IDS.filter(x=>x.startsWith(ch+'_'))],title,condition,event:'win',chapter:9,when:(s,b)=>!!b?.win&&when(s,b),check:s=>!!s.claimedUnlocks?.[id]});
 add('v53_vanisher','vanisher','新軸：消失生態','第4ボス撃破後、消失カード3枚以上＋復帰または予約カード1枚以上で勝利',(s)=>s.boss4Defeated&&count(s,'消失')>=3&&(count(s,'復帰')+count(s,'予約')>=1));
 add('v53_watcher','watcher','新軸：選択外運用','第4ボス撃破後、非選択・提示中カードを合計4枚以上採用して勝利',(s)=>s.boss4Defeated&&count(s,'非選択')+count(s,'提示中')>=4);
 add('v53_scribe','scribe','新軸：記録再演','第4ボス撃破後、記録カード2枚以上＋循環カード2枚以上で勝利',(s)=>s.boss4Defeated&&count(s,'記録')>=2&&count(s,'循環')>=2);
 add('v53_provocateur','provocateur','新軸：敵行動利用','第4ボス撃破後、敵行動・出血カードを合計4枚以上採用し、4ターン以上の戦闘に勝利',(s,b)=>s.boss4Defeated&&count(s,'敵行動')+count(s,'出血')>=4&&b.turn>=4);
 add('v53_reverser','reverser','新軸：代償反転','第4ボス撃破後、自傷・消失・役割変換カードを合計5枚以上採用して勝利',(s)=>s.boss4Defeated&&count(s,'自傷')+count(s,'消失')+count(s,'役割変換')>=5);
 add('v53_morph','morph','新軸：変質遷移','第4ボス撃破後、二面カード4枚以上を採用し、いずれかを変質させて勝利',(s,b)=>s.boss4Defeated&&count(s,'二面')>=4&&((b.events?.counts?.transformed||0)>=1));
})();
