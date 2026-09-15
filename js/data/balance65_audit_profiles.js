'use strict';
(function(){
 const D=window.BuildLab.Data;
 // 実戦探索器がスタイル固有の構築制約を破らないための監査プロファイル。
 // ゲーム性能ではなく監査品質だけを定義する。
 D.V65_AUDIT_PROFILE={
   echo_singleton:{singleton:true,reason:'同名1枚だけを要求する孤響型'},
   architect_specialist:{preferSingleTag:true,reason:'1タグ専門カードを主軸にする専門設計型'},
   combo_precision:{minHits:5,reason:'5hit以上を主軸にする精密型'},
   combo_catalytic:{minHits:3,reason:'3hit以上を主軸にする触媒型'},
   catalyst_spectrum:{preferStatus:true,reason:'複数状態異常を成立させる多相型'},
   risk_crisis:{preferSelfDamage:true,reason:'自傷とHP境界往復を利用する臨界型'},
   relay_direction:{preferLink:true,reason:'連結順序を利用する順送型'},
   archive_salvage:{preferDiscard:true,reason:'捨て札回収を利用する回収型'},
   vector_flux:{preferPosition:true,reason:'提示位置変更を利用する流動型'}
 };
 D.V65_AUDIT_INTEGRITY={
   multiSeedRequired:true,seeds:3,
   deckModes:['hybrid','concept','trial'],
   fallbackSearch:true,
   styleProfiles:Object.keys(D.V65_AUDIT_PROFILE),
   status:'final-audit-in-progress'
 };
 if(D.ENDGAME58)D.ENDGAME58.version='0.65';
})();
// v0.70: full 177-variant audit follow-up. These profiles only correct audit deck construction;
// they do not buff the live game.
(function(){
 const D=window.BuildLab.Data,P=D.V65_AUDIT_PROFILE;
 Object.assign(P,{
   braid_cycle:{preferLink:true,preferDiscard:true,reason:'再構築→連結を要求する輪転継電型'},
   converter_spend:{preferBlock:true,preferConversion:true,reason:'防御を蓄積して消費する変換型'}
 });
 D.V70_AUDIT_COMPLETE={variants:177,trials:8,seeds:3,deckModes:['hybrid','concept','trial'],source:'AUDIT_v0.66_MULTISEED_COMPLETE.json',status:'complete-needs-balance-followup'};
})();
