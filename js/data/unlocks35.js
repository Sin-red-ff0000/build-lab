'use strict';
(function(){
  const D=window.BuildLab.Data;D.UNLOCKS=D.UNLOCKS||[];
  const hasTag=(s,t,n)=>s.deck.filter(id=>(D.CARDS[id]?.tags||[]).includes(t)).length>=n;
  const countObj=o=>Object.keys(o||{}).length;
  const win=(id,chapter,axis,reward,title,condition,check)=>({id,chapter,kind:'mixed',axis:[axis],reward,title,condition,event:'win',when:(s,b)=>!!(b&&b.win)&&check(s,b),check:s=>!!s.claimedUnlocks?.[id]});
  const pushFamily=(family,axis,cond1,check1,cond2,check2)=>{
    const f=D.V35_FAMILIES[family],a=[...f.cards.slice(0,3),...f.relics.slice(0,3)],b=[...f.cards.slice(3),...f.relics.slice(3)];
    D.UNLOCKS.push(win(`v35_${family}_i`,8,axis,a,`${f.name}・終端研究I`,cond1,(s,b)=>s.boss4Defeated&&check1(s,b)));
    D.UNLOCKS.push(win(`v35_${family}_ii`,9,axis,b,`${f.name}・終端研究II`,cond2,(s,b)=>s.boss4Defeated&&s.claimedUnlocks?.[`v35_${family}_i`]&&check2(s,b)));
  };
  pushFamily('position','提示操作','第4ボス撃破後、提示操作タグ6枚以上で勝利',(s)=>hasTag(s,'提示操作',6),'終端研究I解放後、提示操作タグ8枚以上で勝利',(s)=>hasTag(s,'提示操作',8));
  pushFamily('link','連結','第4ボス撃破後、カード連結を設定して連結タグ6枚以上で勝利',(s,b)=>!!(s.cardLink?.a&&s.cardLink?.b)&&hasTag(s,'連結',6),'終端研究I解放後、同一戦闘で連結コンボ3回以上成立させて勝利',(s,b)=>(b.linkComboCount||0)>=3);
  pushFamily('calibration','調律','第4ボス撃破後、調律2枚を設定して勝利',(s)=>countObj(s.cardTunings)>=2,'終端研究I解放後、同じデッキで調律2枚＋役割変換2枚を設定して勝利',(s)=>countObj(s.cardTunings)>=2&&countObj(s.cardConversions)>=2);
  pushFamily('architecture','構築規格','第4ボス撃破後、構築規格を装備して勝利',(s)=>!!s.doctrine,'終端研究I解放後、3タグ以上カードを5枚以上含む規格デッキで勝利',(s)=>!!s.doctrine&&s.deck.filter(id=>(D.CARDS[id]?.tags||[]).length>=3).length>=5);
  pushFamily('analysis','解析','第4ボス撃破後、特殊個体3種以上を同時適用して勝利',(s,b)=>(b.enemy.traits||[]).filter(id=>D.TRAITS[id]).length>=3,'終端研究I解放後、複合挙動2種以上を持つ敵に勝利',(s,b)=>(b.enemy.behaviors||[]).length>=2);
  pushFamily('mystic','アルカナ','第4ボス撃破後、アルカナ装備＋ルーン2枚以上で勝利',(s)=>!!s.arcana?.id&&countObj(s.cardRunes)>=2,'終端研究I解放後、アルカナ装備＋ルーン3枚＋調律1枚以上で勝利',(s)=>!!s.arcana?.id&&countObj(s.cardRunes)>=3&&countObj(s.cardTunings)>=1);
  pushFamily('element','元素','第4ボス撃破後、元素を3種類以上へ配分して勝利',(s)=>Object.values(s.alchemy?.allocation||{}).filter(n=>Number(n)>0).length>=3,'終端研究I解放後、5元素すべてへ配分して勝利',(s)=>Object.values(s.alchemy?.allocation||{}).filter(n=>Number(n)>0).length>=5);
  pushFamily('alchemy','錬成','第4ボス撃破後、戦闘中に3種類以上の錬成反応を成立させて勝利',(s,b)=>Object.values(b.alchemy?.reactions||{}).filter(n=>Number(n)>0).length>=3,'終端研究I解放後、上位錬成物を2種類以上生成して勝利',(s,b)=>(D.V24_ADVANCED_MATERIAL_IDS||[]).filter(id=>Number(b.alchemy?.made?.[id]||0)>0).length>=2);
})();
