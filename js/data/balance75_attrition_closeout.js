'use strict';
(function(){
 const D=window.BuildLab.Data,E=D.ENDGAME58;if(!E)return;
 // v0.75: 消耗校正そのものは v0.71 の再校正値を維持する。
 // 11/177 の主因は「長期資源戦」を20ターンで打ち切る監査条件だったため、
 // 敵をさらに弱体化して数字を合わせるのではなく局所監査の時間窓を修正する。
 E.version='0.75';
 D.V75_ATTRITION_CLOSEOUT={
  scope:'long_attrition only',
  policy:'177構成全件監査は再実行しない。消耗校正だけを長期戦用ターン窓で局所再検証する。',
  enemyKept:{hp:4.3,atk:1.15,def:2.15,spd:1,regen:1,resist:22},
  auditTurnLimit:{normal:20,long_attrition:60},
  passBand:{minWinVariants:25,maxWinVariants:150},
  note:'長期戦を20ターンで打ち切っていた監査バイアスを是正。ゲーム性能を追加弱体化して監査値へ合わせない。'
 };
})();
