'use strict';
(function(){
  const D=window.BuildLab.Data;
  const byId=Object.fromEntries((D.UNLOCKS||[]).map(u=>[u.id,u]));
  function gate(id,chapter,prefix,predicate){const u=byId[id];if(!u)return;u.chapter=chapter;if(prefix&&!u.condition.startsWith(prefix))u.condition=`${prefix}${u.condition}`;if(u.event==='win'&&u.when){const old=u.when;u.when=(s,b)=>predicate(s,b)&&old(s,b);}}

  // v0.35 進行校正：第1章に置かれていた終盤試験を、実際に攻略可能になる章へ移動。
  // 基本4特殊個体→第1ボスという導線は維持し、極端倍率は章クリア後の応用課題にする。
  ['u_hp12','u_atk10','u_def10','u_spd4'].forEach(id=>gate(id,4,'第3ボス撃破後、',(s)=>!!s.boss3Defeated));
  ['m_tyrant','m_mobile','tri_gba','tri_gbf','tri_gaf','tri_baf','quad_base'].forEach(id=>gate(id,5,'第3ボス撃破後、',(s)=>!!s.boss3Defeated));
  gate('calibration',10,'第4ボス撃破後、',(s)=>!!s.boss4Defeated);

  // 第1章で見える目標は「基本倍率・基本特殊個体・基礎6軸・第1ボス」に限定する。
  // 後半向けの目標が未達のまま大量に並ぶことを避けるためUI章分類も明示。
  D.PROGRESSION35={
    bossChapters:{boss1:1,boss2:2,boss3:3,boss4:5},
    endgameChapter:10,
    extremeUnlockIds:['u_hp12','u_atk10','u_def10','u_spd4','calibration'],
    philosophy:'各章で解放した仕組みを実際に運用して章ボス/特殊個体へ回答し、極限倍率試験は第4ボス後のエンドコンテンツとして扱う。'
  };
})();
