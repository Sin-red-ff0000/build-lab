'use strict';
(function(){
 const BL=window.BuildLab,D=BL.Data;D.UNLOCKS=D.UNLOCKS||[];
 const hasTag=(s,tag,n)=>s.deck.filter(id=>(D.CARDS[id]?.tags||[]).includes(tag)).length>=n;
 const win=(id,axis,reward,name,condition,check)=>({id,chapter:10,kind:'mixed',axis:[axis],reward,name,condition,check:(s,b)=>!!(b&&b.win)&&check(s,b)});
 const axes=[
  ['discard','捨て札','第4ボス撃破後、捨て札タグ6枚以上で勝利',(s)=>hasTag(s,'捨て札',6)],
  ['multihit','連撃','第4ボス撃破後、連撃タグ6枚以上で勝利',(s)=>hasTag(s,'連撃',6)],
  ['status','状態異常','第4ボス撃破後、状態異常タグ6枚以上で勝利',(s)=>hasTag(s,'状態異常',6)],
  ['guard','耐久','第4ボス撃破後、耐久タグ6枚以上で勝利',(s)=>hasTag(s,'耐久',6)],
  ['blood','自傷','第4ボス撃破後、自傷タグ6枚以上で勝利',(s)=>hasTag(s,'自傷',6)],
  ['cycle','循環','第4ボス撃破後、循環タグ6枚以上で勝利',(s)=>hasTag(s,'循環',6)]
 ];
 for(const [id,tag,cond,baseCheck] of axes){const a=D.V34_BUILD_AXES[id];D.UNLOCKS.push(win(`v34_${id}_arsenal`,tag,[...a.cards,...a.relics],`${tag}・極限兵装研究`,cond,(s)=>s.boss4Defeated&&baseCheck(s)));}
})();
