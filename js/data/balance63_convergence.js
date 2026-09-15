'use strict';
(function(){
 const D=window.BuildLab.Data,E=D.ENDGAME58;if(!E)return;
 const C=D.CARDS;
 // v0.63: 散開破片を「何でも出来る捨て札」から、非選択を火傷へ繋ぐ軽量札へ限定する。
 if(C.v34_d_shrapnel)Object.assign(C.v34_d_shrapnel,{damage:6,hits:1,block:0,status:{type:'burn',amount:2},onDiscard:{damage:6},desc:'6ダメージ＋火傷2。選ばれず捨てられた時、敵に6ダメージ。軽い非選択圧力に特化し、防御役は持たない。'});
 if(C.catastrophe_protocol)Object.assign(C.catastrophe_protocol,{hits:4,damage:2,block:0,selfDamage:4,perHitStatus:{type:'burn',amount:1},desc:'HP4を失い、2ダメージ×4。各ヒットで火傷1。自傷・連撃・火傷の接続札で、防御役は持たない。'});
 // ほぼ全員が無調整で通る3校正を、専門回答を要求する帯へ戻す。その他も軽く収束。
 const p={
  opening_storm:{hp:2.8,atk:1.0,def:1.05,spd:1.9,resist:10},
  late_awaken:{hp:3.5,atk:1.0,def:1.5,spd:1.0,regen:1,resist:15},
  action_flood:{hp:3.15,atk:.9,def:1.15,spd:2.35,resist:12},
  long_attrition:{hp:4.5,atk:1.2,def:2.5,spd:1.0,regen:1,resist:25},
  cleansing_field:{hp:3.7,atk:1.15,def:1.65,spd:1.5,resist:32},
  adaptive_matrix:{hp:3.8,atk:1.1,def:1.7,spd:1.4,resist:18},
  void_archive:{hp:3.6,atk:1.1,def:1.4,spd:1.4,resist:15},
  synthesis:{hp:4.0,atk:1.2,def:1.8,spd:1.4,resist:18}
 };
 for(const [id,x] of Object.entries(p))Object.assign(E.trials[id].enemy,x);
 E.version='0.63';
 E.policy='複数シード実戦で万能札と校正の過易化を監査し、各校正が構築変更を要求する難度帯へ収束させる。';
 D.V63_CONVERGENCE={narrowedCards:['v34_d_shrapnel','catastrophe_protocol'],multiSeedRequired:true,seeds:3};
})();
