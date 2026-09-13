'use strict';
(function(){
  const BL=window.BuildLab; const D=BL.Data;
  D.SYSTEMS=D.SYSTEMS||{};
  D.SYSTEMS.arcana={name:'アルカナ',desc:'ビルド全体へ1枚だけ適用する強化。各アルカナは正位置・逆位置の2効果から選択する。'};
  D.ARCANA={
    arcana_magician:{id:'arcana_magician',name:'魔術師',tags:['調律','役割変換'],upright:{name:'正位置',desc:'調律または役割変換されたカード+22%。',when:{tunedOrConverted:true},mult:1.22},reversed:{name:'逆位置',desc:'調律・役割変換・ルーンがないカード+20%。',when:{plainCard:true},mult:1.20}},
    arcana_chariot:{id:'arcana_chariot',name:'戦車',tags:['連撃','単発'],upright:{name:'正位置',desc:'3ヒット以上のカード+24%。',when:{hitsMin:3},mult:1.24},reversed:{name:'逆位置',desc:'1ヒット以下の攻撃カード+30%。',when:{hitsMax:1,attackish:true},mult:1.30}},
    arcana_strength:{id:'arcana_strength',name:'力',tags:['耐久','自傷'],upright:{name:'正位置',desc:'防御・複合カード+24%。',when:{blockish:true},mult:1.24},reversed:{name:'逆位置',desc:'自傷カードまたはHP50%以下で+30%。',when:{selfDamageOrLowHp:true},mult:1.30}},
    arcana_wheel:{id:'arcana_wheel',name:'運命の輪',tags:['循環','捨て札'],upright:{name:'正位置',desc:'山札再構築直後の最初のカード+32%。',when:{recentReshuffle:true},mult:1.32},reversed:{name:'逆位置',desc:'一度でも捨てられたカード実体+28%。',when:{discarded:true},mult:1.28}},
    arcana_justice:{id:'arcana_justice',name:'正義',tags:['反撃','攻撃'],upright:{name:'正位置',desc:'反撃を持つカード+32%。',when:{counterish:true},mult:1.32},reversed:{name:'逆位置',desc:'攻撃カード+18%。',when:{attackish:true},mult:1.18}},
    arcana_temperance:{id:'arcana_temperance',name:'節制',tags:['混成','単独'],upright:{name:'正位置',desc:'2タグ以上のカード+22%。',when:{minTags:2},mult:1.22},reversed:{name:'逆位置',desc:'1タグだけのカード+28%。',when:{maxTags:1},mult:1.28}},
    arcana_star:{id:'arcana_star',name:'星',tags:['状態異常'],upright:{name:'正位置',desc:'状態異常タグのカード+25%。',when:{tag:'状態異常'},mult:1.25},reversed:{name:'逆位置',desc:'敵に2種類以上の状態異常がある時、全カード+20%。',when:{statusMin:2},mult:1.20},requiresUnlock:true},
    arcana_moon:{id:'arcana_moon',name:'月',tags:['提示操作'],upright:{name:'正位置',desc:'前ターンと異なる位置から使うと+28%。',when:{positionChanged:true},mult:1.28},reversed:{name:'逆位置',desc:'前ターンと同じ位置から使うと+24%。',when:{positionSame:true},mult:1.24},requiresUnlock:true},
    arcana_hermit:{id:'arcana_hermit',name:'隠者',tags:['単独','重複'],upright:{name:'正位置',desc:'デッキに同名1枚だけのカード+28%。',when:{copiesMax:1},mult:1.28},reversed:{name:'逆位置',desc:'デッキに同名2枚以上あるカード+28%。',when:{copiesMin:2},mult:1.28},requiresUnlock:true},
    arcana_world:{id:'arcana_world',name:'世界',tags:['連結'],upright:{name:'正位置',desc:'連結コンボ成立時+30%。',when:{linkActive:true},mult:1.30},reversed:{name:'逆位置',desc:'連結ペアに含まれないカード+20%。',when:{notPairCard:true},mult:1.20},requiresUnlock:true},
    arcana_tower:{id:'arcana_tower',name:'塔',tags:['複合挙動','特殊個体'],upright:{name:'正位置',desc:'複合挙動がある敵へ+30%。',when:{enemyBehaviorsMin:1},mult:1.30},reversed:{name:'逆位置',desc:'特殊個体特性3種類以上の敵へ+30%。',when:{enemyTraitsMin:3},mult:1.30},requiresUnlock:true},
    arcana_sun:{id:'arcana_sun',name:'太陽',tags:['安定','瀕死'],upright:{name:'正位置',desc:'HP50%より上なら+20%。',when:{highHp:true},mult:1.20},reversed:{name:'逆位置',desc:'HP50%以下なら+34%。',when:{lowHp:true},mult:1.34},requiresUnlock:true}
  };
})();
