'use strict';
(function(){
  const D=window.BuildLab.Data;
  const C=(name,tags,desc,x)=>({name,tags:['状態異常',...tags],desc,...x});
  const cards={
    v41_venom_inoculation:C('継投毒針',['毒'],'3ダメージ＋毒3。小さく投与を継続する毒の基礎札。',{kind:'damage',hits:1,damage:3,status:{type:'poison',amount:3}}),
    v41_venom_guard:C('毒液防壁',['毒','耐久'],'防御7＋毒2。攻めずに毒を維持する。',{kind:'block',block:7,status:{type:'poison',amount:2}}),
    v41_venom_relay:C('毒脈還流',['毒','循環'],'毒3。直前の捨て札1枚を山札上へ戻す。',{kind:'utility',status:{type:'poison',amount:3},effect:'recoverLastDiscard'}),
    v41_ember_seed:C('火種',['火傷'],'4ダメージ＋火傷3。着火・再点火用の小型札。',{kind:'damage',hits:1,damage:4,status:{type:'burn',amount:3}}),
    v41_ember_guard:C('火床防壁',['火傷','耐久'],'防御6＋火傷3。燃焼を切らさず守る。',{kind:'block',block:6,status:{type:'burn',amount:3}}),
    v41_ember_stoke:C('追い焚き',['火傷'],'火傷5。火傷は高火力だが燃焼後に半減する。',{kind:'utility',status:{type:'burn',amount:5}}),
    v41_bleed_cut:C('裂創',['出血'],'5ダメージ＋出血3。敵が行動するほど出血が作用する。',{kind:'damage',hits:1,damage:5,status:{type:'bleed',amount:3}}),
    v41_bleed_guard:C('逆棘防壁',['出血','耐久'],'防御7＋出血2。高速敵を受けながら傷を広げる。',{kind:'block',block:7,status:{type:'bleed',amount:2}}),
    v41_bleed_rain:C('裂傷雨',['出血','連撃'],'2ダメージ×3。最後に出血3。',{kind:'damage',hits:3,damage:2,status:{type:'bleed',amount:3}}),
    v41_frost_mark:C('凍傷刻印',['凍傷'],'3ダメージ＋凍傷4。凍傷は次の敵ターンの攻撃を一時的に下げる。',{kind:'damage',hits:1,damage:3,status:{type:'frost',amount:4}}),
    v41_frost_guard:C('霜壁',['凍傷','耐久'],'防御8＋凍傷2。短期的な攻撃抑制を重ねる。',{kind:'block',block:8,status:{type:'frost',amount:2}}),
    v41_frost_cycle:C('霜環',['凍傷','循環'],'凍傷3。山札再構築直後なら凍傷5。',{kind:'utility',status:{type:'frost',amount:3},statusIfRecentReshuffle:5})
  };
  Object.assign(D.CARDS,cards);D.V41_STATUS_CARD_IDS=Object.keys(cards);
})();
