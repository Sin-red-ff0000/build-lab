'use strict';
(function(){
 const D=window.BuildLab.Data;if(!D.UNLOCKS)return;
 const tags=(s,id)=>D.getCardTags?D.getCardTags(s,id):(D.CARDS[id]?.tags||[]),count=(s,t)=>s.deck.filter(id=>tags(s,id).includes(t)).length;
 const win=(id,reward,title,condition,when)=>({id,kind:'card',reward,title,condition,event:'win',when,check:s=>!!s.claimedUnlocks?.[id],chapter:5});
 D.UNLOCKS.push(
  win('v41_poison_cards',['v41_venom_inoculation','v41_venom_guard','v41_venom_relay'],'毒：継続投与','第4ボス撃破後、毒カードを3枚以上採用して勝利',(s)=>s.boss4Defeated&&count(s,'毒')>=3),
  win('v41_burn_cards',['v41_ember_seed','v41_ember_guard','v41_ember_stoke'],'火傷：燃焼管理','第4ボス撃破後、火傷カードを3枚以上採用して勝利',(s)=>s.boss4Defeated&&count(s,'火傷')>=3),
  win('v41_bleed_cards',['v41_bleed_cut','v41_bleed_guard','v41_bleed_rain'],'新状態異常：出血','第4ボス撃破後、連撃カード3枚＋耐久カード3枚以上で勝利',(s)=>s.boss4Defeated&&count(s,'連撃')>=3&&count(s,'耐久')>=3),
  win('v41_frost_cards',['v41_frost_mark','v41_frost_guard','v41_frost_cycle'],'新状態異常：凍傷','第4ボス撃破後、耐久カード3枚＋循環カード3枚以上で勝利',(s)=>s.boss4Defeated&&count(s,'耐久')>=3&&count(s,'循環')>=3)
 );
})();
