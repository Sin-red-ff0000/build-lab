'use strict';
(function(){
 const D=window.BuildLab.Data;D.UNLOCKS=D.UNLOCKS||[];
 const win=(id,reward,title,condition,when)=>({id,kind:'mixed',reward,title,condition,event:'win',chapter:9,when:(s,b)=>!!(b&&b.win)&&when(s,b),check:s=>!!s.claimedUnlocks?.[id]});
 const count=(s,t)=>s.deck.filter(id=>(D.getCardTags?D.getCardTags(s,id):(D.CARDS[id]?.tags||[])).includes(t)).length;
 D.UNLOCKS.push(
  win('v47_keeper',[...D.V47_CHARACTER_IDS.filter(x=>x==='keeper'),...D.V47_STYLE_IDS.filter(x=>x.startsWith('keeper_'))],'新軸：保持運用','第4ボス撃破後、提示操作または循環カードを合計6枚以上採用し、保留系の調律・規格・遺物のいずれかを使用して勝利',(s)=>s.boss4Defeated&&(count(s,'提示操作')+count(s,'循環')>=6)&&((Object.values(s.cardTunings||{}).includes('reserve'))||s.protocol==='reserve_drive'||(s.relics||[]).includes('holding_tank'))),
  win('v47_breaker',[...D.V47_CHARACTER_IDS.filter(x=>x==='breaker'),...D.V47_STYLE_IDS.filter(x=>x.startsWith('breaker_'))],'新軸：単発重撃','第4ボス撃破後、1ヒット攻撃カードを5枚以上採用して勝利',(s)=>s.boss4Defeated&&s.deck.filter(id=>(D.CARDS[id]?.hits||((D.CARDS[id]?.damage!=null)?1:0))===1&&D.CARDS[id]?.damage!=null).length>=5),
  win('v47_converter',[...D.V47_CHARACTER_IDS.filter(x=>x==='converter'),...D.V47_STYLE_IDS.filter(x=>x.startsWith('converter_'))],'新軸：防御消費','第4ボス撃破後、耐久カード4枚以上＋攻撃カード4枚以上を採用して勝利',(s)=>s.boss4Defeated&&count(s,'耐久')>=4&&s.deck.filter(id=>D.CARDS[id]?.damage!=null).length>=4)
 );
})();
