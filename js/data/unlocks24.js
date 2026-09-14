'use strict';
(function(){
 const BL=window.BuildLab,D=BL.Data,A=D.ALCHEMY;
 const claimed=id=>s=>!!s.claimedUnlocks?.[id];
 const win=(id,reward,title,condition,when)=>({id,kind:'mixed',reward,title,condition,event:'win',when,check:claimed(id),chapter:7});
 for(const id of D.V24_TRAIT_IDS||[]){const c=D.V24_TRAIT_CONDITIONS[id],t=D.TRAITS[id];D.UNLOCKS.push({id:'v24_discover_'+id,kind:'trait',reward:[id],title:'錬成特殊個体：'+t.name.replace(/個体$/,''),condition:(c.advanced?'第1ボス撃破後、':'')+c.label+'に設定して実験開始',check:s=>!!s.unlockedTraits?.[id],chapter:7});}
 for(const id of D.V24_BEHAVIOR_IDS||[]){const b=D.ENEMY_BEHAVIORS[id];D.UNLOCKS.push({id:'v24_behavior_'+id,kind:'behavior',reward:[id],title:'錬成複合挙動：'+b.name,condition:D.behaviorConditionText(id),check:s=>!!s.unlockedBehaviors?.[id],chapter:7});}
 const player=[...D.V24_CHARACTER_IDS,...D.V24_STYLE_IDS,...D.V24_RELIC_IDS,...D.V24_PROTOCOL_IDS,...D.V24_TUNING_IDS];
 const buckets=Array.from({length:30},()=>[]);player.forEach((id,i)=>buckets[i%30].push(id));
 const mats=D.V24_ADVANCED_MATERIAL_IDS||[];
 const made=(b,id)=>Number(b?.alchemy?.made?.[id]||0)>0, used=(b,id)=>Number(b?.alchemy?.used?.[id]||0)>0;
 for(let i=0;i<30;i++){
   let title,condition,when;
   if(i<12){const m=mats[i];title='上位錬成研究：'+A.materials[m];condition=`第4ボス撃破後、戦闘中に${A.materials[m]}を生成して勝利`;when=(s,b)=>s.boss4Defeated&&made(b,m);}
   else if(i<18){const n=i-9;title=`多反応研究 ${n}`;condition=`第4ボス撃破後、異なる錬成反応を${n}種類以上起こして勝利`;when=(s,b)=>s.boss4Defeated&&Object.values(b?.alchemy?.reactions||{}).filter(x=>Number(x)>0).length>=n;}
   else if(i<24){const n=i-17;title=`錬成物運用研究 ${n}`;condition=`第4ボス撃破後、異なる錬成物を${n}種類以上実際に消費して勝利`;when=(s,b)=>s.boss4Defeated&&Object.values(b?.alchemy?.used||{}).filter(x=>Number(x)>0).length>=n;}
   else {const n=i-20;title=`大錬成研究 ${n}`;condition=`第4ボス撃破後、上位錬成物を${Math.min(4,n-3)}種類以上生成して勝利`;when=(s,b)=>s.boss4Defeated&&mats.filter(id=>made(b,id)).length>=Math.min(4,n-3);}
   D.UNLOCKS.push(win('v24_goal_'+String(i+1).padStart(2,'0'),buckets[i],title,condition,when));
 }
})();
