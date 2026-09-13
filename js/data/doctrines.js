'use strict';
(function(){
  const BL=window.BuildLab; const D=BL.Data;
  D.SYSTEMS=D.SYSTEMS||{};
  D.SYSTEMS.deck_doctrine={name:'構築規格システム',desc:'デッキ枚数・同名上限・提示枚数・カード倍率など、デッキ構築そのものの前提を変更する。無料で付け替え可能。'};
  D.DOCTRINES={
    compact:{id:'compact',name:'圧縮規格',tags:['構築規格','少数精鋭'],desc:'デッキ8枚。カードの基本効果+15%。',deckSize:8,copyLimit:2,promptDelta:0,effectMult:1.15},
    expanded:{id:'expanded',name:'展開規格',tags:['構築規格','大量構築'],desc:'デッキ12枚。提示枚数+1。カードの基本効果-8%。',deckSize:12,copyLimit:2,promptDelta:1,effectMult:.92},
    singleton:{id:'singleton',name:'単独規格',tags:['構築規格','単独'],desc:'デッキ10枚・同名1枚まで。カードの基本効果+22%。',deckSize:10,copyLimit:1,promptDelta:0,effectMult:1.22},
    duplicate:{id:'duplicate',name:'複製規格',tags:['構築規格','重複'],desc:'デッキ10枚・同名3枚まで。同名2枚以上採用したカード+18%、1枚だけのカード-8%。',deckSize:10,copyLimit:3,promptDelta:0,effectMult:1,duplicateMult:1.18,uniqueMult:.92},
    hybrid:{id:'hybrid',name:'混成規格',tags:['構築規格','混成'],desc:'デッキ10枚。2タグ以上のカード+20%、1タグのみ-5%。',deckSize:10,copyLimit:2,promptDelta:0,effectMult:1,hybridMult:1.20,singleTagMult:.95},
    spectrum:{id:'spectrum',name:'多様規格',tags:['構築規格','多様性'],desc:'デッキ10枚。デッキ内に6種類以上のタグがあれば全カード+18%、5種類以下なら-5%。',deckSize:10,copyLimit:2,promptDelta:0,effectMult:1,tagDiversityMin:6,diverseMult:1.18,sparseMult:.95}
  };
  D.getDeckRules=function(state){
    const base={deckSize:10,copyLimit:2,promptDelta:0,effectMult:1,id:null,name:'標準規格'};
    const id=state?.doctrine;
    if(!id||!state?.unlockedDoctrines?.[id]||!D.DOCTRINES[id])return base;
    return {...base,...D.DOCTRINES[id],id};
  };
})();
