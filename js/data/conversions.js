'use strict';
(function(){
  const BL=window.BuildLab; const D=BL.Data;
  D.SYSTEMS=D.SYSTEMS||{};
  D.SYSTEMS.card_conversion={name:'カード役割変換',desc:'カードの役割を別方向へ変換する。最大2種類のカードへ設定でき、いつでも無料で付け替え可能。'};
  D.CARD_CONVERSIONS={
    split:{name:'分裂変換',tags:['変換','連撃'],addTags:['連撃','変換'],desc:'単発の直接攻撃を3ヒット化。1ヒットは元の36%（合計108%）。多段条件を起動する代わり、単発としての性質を失う。',effect:'split',base:true},
    bulwark:{name:'攻防変換',tags:['変換','耐久'],addTags:['耐久','変換'],desc:'直接攻撃のダメージ-30%。使用時に防御6を追加し、火力の一部を防御へ移す。',effect:'bulwark',base:true},
    residue_role:{name:'残滓変換',tags:['変換','捨て札'],addTags:['捨て札','変換'],desc:'選択使用時の基本効果-18%。選ばれず捨てられた時、次カードの効果+25%。',effect:'residue_role',base:true},
    counter_role:{name:'反撃変換',tags:['変換','反撃','耐久'],addTags:['反撃','耐久','変換'],desc:'防御カードの防御量-20%。そのターン受けたダメージの65%を反撃する。',effect:'counter_role',requiresUnlock:true},
    detonate_role:{name:'起爆変換',tags:['変換','状態異常'],addTags:['状態異常','変換'],desc:'毒・火傷の付与量-30%。使用後、敵の毒か火傷の多い方を30%消費し、消費量×2ダメージ。',effect:'detonate_role',requiresUnlock:true},
    blood_role:{name:'血契変換',tags:['変換','自傷'],addTags:['自傷','変換'],desc:'使用時に追加でHP3を失い、基本効果+25%。',effect:'blood_role',requiresUnlock:true},
    cycle_role:{name:'循環変換',tags:['変換','循環'],addTags:['循環','変換'],desc:'基本効果-10%。使用後は捨て札ではなく山札の一番下へ戻る。',effect:'cycle_role',requiresUnlock:true}
  };
  D.getCardConversion=function(state,cardId){
    const id=state?.cardConversions?.[cardId],cv=id&&D.CARD_CONVERSIONS[id];
    if(!cv)return null;if(cv.requiresUnlock&&!state?.unlockedConversions?.[id])return null;return cv;
  };
  D.getCardTags=function(state,cardId){
    const card=D.CARDS[cardId]||{},base=[...(card.tags||[])],cv=D.getCardConversion(state,cardId);
    const types=[];if(card.status)types.push(card.status.type);if(card.statuses)types.push(...card.statuses.map(x=>x.type));if(card.perHitStatus)types.push(card.perHitStatus.type);if(card.onDiscard?.status)types.push(card.onDiscard.status);
    const statusTags={poison:'毒',burn:'火傷',bleed:'出血',frost:'凍傷'};
    for(const type of types)if(statusTags[type])base.push(statusTags[type]);
    return [...new Set([...base,...(cv?.addTags||[])])];
  };
  D.canApplyConversion=function(cardId,conversionId){
    const c=D.CARDS[cardId],cv=D.CARD_CONVERSIONS[conversionId];if(!c||!cv)return false;
    const hits=Math.max(c.hits||0,c.conditionalHits||0,c.prevAttackHits||0,c.lowHpHits||0,c.hitsIfRecentReshuffle||0,c.hitsIfLinkedCombo||0);
    const direct=!!(c.damage!=null||c.kind==='hybrid');
    if(conversionId==='split')return direct&&hits<=1;
    if(conversionId==='bulwark')return direct;
    if(conversionId==='counter_role')return c.block!=null||c.kind==='block'||c.kind==='hybrid';
    if(conversionId==='detonate_role'){
      const types=[];if(c.status)types.push(c.status.type);if(c.statuses)types.push(...c.statuses.map(x=>x.type));if(c.perHitStatus)types.push(c.perHitStatus.type);if(c.onDiscard?.status)types.push(c.onDiscard.status);
      return types.some(x=>x==='poison'||x==='burn');
    }
    return true;
  };
})();
