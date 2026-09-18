'use strict';
(function(){
  const BL = window.BuildLab;
  const D = BL.Data;
  const BASE_TRAITS=['giant','berserk','armored','fast'];

  function grant(state,id){
    if(D.CARDS[id]){state.unlockedCards[id]=true;return D.CARDS[id].name;}
    if(D.RELICS[id]){state.unlockedRelics[id]=true;return D.RELICS[id].name;}
    if(D.TRAITS[id]){state.unlockedTraits[id]=true;return D.TRAITS[id].name;}
    if(D.ENEMY_BEHAVIORS?.[id]){state.unlockedBehaviors=state.unlockedBehaviors||{};state.unlockedBehaviors[id]=true;return D.ENEMY_BEHAVIORS[id].name;}
    if(D.PROTOCOLS?.[id]){state.unlockedProtocols[id]=true;return D.PROTOCOLS[id].name;}
    if(D.CHARACTERS?.[id]){state.unlockedCharacters[id]=true;return D.CHARACTERS[id].name;}
    if(D.CHARACTER_STYLES?.[id]){state.unlockedCharacterStyles=state.unlockedCharacterStyles||{};state.unlockedCharacterStyles[id]=true;return D.CHARACTER_STYLES[id].name;}
    if(D.DOCTRINES?.[id]){state.unlockedDoctrines[id]=true;return D.DOCTRINES[id].name;}
    if(D.TUNINGS?.[id]){state.unlockedTunings=state.unlockedTunings||{};state.unlockedTunings[id]=true;return D.TUNINGS[id].name;}
    if(D.CARD_CONVERSIONS?.[id]){state.unlockedConversions=state.unlockedConversions||{};state.unlockedConversions[id]=true;return D.CARD_CONVERSIONS[id].name;}
    if(D.LINK_MODES?.[id]){state.unlockedLinkModes=state.unlockedLinkModes||{reciprocal:true};state.unlockedLinkModes[id]=true;return D.LINK_MODES[id].name;}
    if(D.RUNES?.[id]){state.unlockedRunes=state.unlockedRunes||{};state.unlockedRunes[id]=true;return D.RUNES[id].name;}
    if(D.ARCANA?.[id]){state.unlockedArcana=state.unlockedArcana||{};state.unlockedArcana[id]=true;return D.ARCANA[id].name;}
    if(D.SYSTEMS?.[id]){state.unlockedSystems[id]=true;return D.SYSTEMS[id].name;}
    return id;
  }

  BL.Unlock = {
    bossAvailable(s){return BASE_TRAITS.every(k=>s.defeatedTraits[k]);},
    boss2Available(s){return !!(s.bossDefeated&&s.defeatedTraits.regenerative&&s.defeatedTraits.purifier&&s.claimedUnlocks?.v06_prompt_mastery&&s.claimedUnlocks?.v06_tuning_second);},
    boss3Available(s){return !!(s.boss2Defeated&&s.claimedUnlocks?.v07_link_six&&s.claimedUnlocks?.v07_link_tuned&&s.claimedUnlocks?.v08_link_cycle);},
    boss4Available(s){return !!(s.boss3Defeated&&s.claimedUnlocks?.v20_integration_trial&&s.defeatedTraits?.v19_omega);},
    hasSystem(s,id){return !!(s.unlockedSystems&&s.unlockedSystems[id]);},
    rewardName(id){return D.CARDS[id]?.name||D.RELICS[id]?.name||D.TRAITS[id]?.name||D.PROTOCOLS?.[id]?.name||D.CHARACTERS?.[id]?.name||D.CHARACTER_STYLES?.[id]?.name||D.DOCTRINES?.[id]?.name||D.TUNINGS?.[id]?.name||D.CARD_CONVERSIONS?.[id]?.name||D.LINK_MODES?.[id]?.name||D.RUNES?.[id]?.name||D.ARCANA?.[id]?.name||D.ENEMY_BEHAVIORS?.[id]?.name||D.SYSTEMS?.[id]?.name||id;},
    rewardText(u){return (u.reward||[]).map(id=>this.rewardName(id)).join(' / ');},
    processWinUnlocks(state,battle){
      const got=[];
      if(!battle.isBoss)(battle.enemy.traits||[]).forEach(id=>{if(D.TRAITS[id])state.defeatedTraits[id]=true;});
      for(const u of D.UNLOCKS||[]){
        if(u.event!=='win'||!u.when||state.claimedUnlocks[u.id])continue;
        if(!u.when(state,battle))continue;
        state.claimedUnlocks[u.id]=true;
        for(const id of u.reward||[])got.push(grant(state,id));
      }
      return got;
    },
    grant
  };
})();
