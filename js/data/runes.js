'use strict';
(function(){
  const BL=window.BuildLab; const D=BL.Data;
  D.SYSTEMS=D.SYSTEMS||{};
  D.SYSTEMS.rune={name:'ルーン',desc:'カード種類へ刻む追加強化。最大3種類まで設定でき、いつでも無料で付け替え可能。'};
  D.RUNES={
    rune_force:{id:'rune_force',name:'剛力のルーン',tags:['攻撃','ルーン'],desc:'攻撃・複合カードなら基本効果+22%。',when:{attackish:true},hit:1.22},
    rune_ward:{id:'rune_ward',name:'護界のルーン',tags:['耐久','ルーン'],desc:'防御・複合カードなら基本効果+24%。',when:{blockish:true},hit:1.24},
    rune_venom:{id:'rune_venom',name:'蝕毒のルーン',tags:['状態異常','ルーン'],desc:'状態異常タグのカードなら基本効果+22%。',when:{tag:'状態異常'},hit:1.22},
    rune_barrage:{id:'rune_barrage',name:'連閃のルーン',tags:['連撃','ルーン'],desc:'3ヒット以上のカードなら基本効果+20%。',when:{hitsMin:3},hit:1.20},
    rune_echo:{id:'rune_echo',name:'残響のルーン',tags:['捨て札','ルーン'],desc:'そのカード実体が一度でも捨てられていれば基本効果+30%。',when:{discarded:true},hit:1.30},
    rune_rebirth:{id:'rune_rebirth',name:'輪廻のルーン',tags:['循環','ルーン'],desc:'山札再構築直後の最初のカードなら基本効果+32%。',when:{recentReshuffle:true},hit:1.32},
    rune_chain:{id:'rune_chain',name:'継鎖のルーン',tags:['連結','ルーン'],desc:'連結コンボ成立時、基本効果+28%。',when:{linkActive:true},hit:1.28,requiresUnlock:true},
    rune_forge:{id:'rune_forge',name:'鍛造のルーン',tags:['成長','ルーン'],desc:'戦闘中に強化済みのカード実体なら基本効果+34%。',when:{upgraded:true},hit:1.34,requiresUnlock:true},
    rune_crisis:{id:'rune_crisis',name:'背水のルーン',tags:['瀕死','ルーン'],desc:'HP50%以下なら基本効果+38%。',when:{lowHp:true},hit:1.38,requiresUnlock:true},
    rune_weave:{id:'rune_weave',name:'混成のルーン',tags:['混成','ルーン'],desc:'2タグ以上のカードなら基本効果+24%。',when:{minTags:2},hit:1.24,requiresUnlock:true},
    rune_focus:{id:'rune_focus',name:'焦点のルーン',tags:['提示操作','ルーン'],desc:'中央枠から使用すると基本効果+30%。',when:{position:'center'},hit:1.30,requiresUnlock:true},
    rune_hunt:{id:'rune_hunt',name:'狩猟のルーン',tags:['特殊個体','ルーン'],desc:'特殊個体特性が2種類以上の敵なら基本効果+26%。',when:{enemyTraitsMin:2},hit:1.26,requiresUnlock:true}
  };
  D.getCardRune=function(state,cardId){const id=state?.cardRunes?.[cardId];return id&&D.RUNES[id]&&state?.unlockedRunes?.[id]?D.RUNES[id]:null;};
})();
