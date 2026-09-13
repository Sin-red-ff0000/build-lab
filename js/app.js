'use strict';
(function(){
  const BL=window.BuildLab; BL.UI=BL.UI||{};
  BL.UI.toast=function(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(t._timer);t._timer=setTimeout(()=>t.classList.remove('show'),2200);};
  BL.UI.showModal=function(html){document.getElementById('modalBody').innerHTML=html;document.getElementById('modal').classList.remove('hidden');};
  BL.UI.renderAll=function(){BL.UI.renderCharacters();BL.UI.renderCharacterStyles();BL.UI.renderDeck();BL.UI.renderRelics();BL.UI.renderProtocols();BL.UI.renderTunings();BL.UI.renderConversions();BL.UI.renderLinks();BL.UI.renderDoctrines();BL.UI.renderExperiment();BL.UI.renderUnlocks();BL.UI.renderCollection();BL.UI.renderGuides();BL.UI.renderBattle();BL.Store.save();};

  function startBattle(mode=false){const r=BL.Battle.create(mode);if(r.error)return BL.UI.toast(r.error);document.getElementById('battlePanel').classList.remove('hidden');BL.UI.renderAll();document.getElementById('battlePanel').scrollIntoView({behavior:'smooth',block:'start'});}
  function bind(){
    BL.UI.bindTabs();document.getElementById('saveBtn').onclick=()=>{BL.Store.save();BL.UI.toast('保存しました');};document.getElementById('resetBtn').onclick=()=>{if(confirm('進行・アンロック・ビルドをすべて初期化します。よろしいですか？')){BL.Store.reset();BL.Battle.current=null;BL.UI.renderAll();BL.UI.toast('初期化しました');}};document.getElementById('startBattleBtn').onclick=()=>startBattle(false);document.getElementById('bossBattleBtn').onclick=()=>startBattle('boss1');document.getElementById('boss2BattleBtn').onclick=()=>startBattle('boss2');document.getElementById('boss3BattleBtn').onclick=()=>startBattle('boss3');document.getElementById('retireBattleBtn').onclick=()=>BL.Battle.retire();document.getElementById('modalClose').onclick=()=>document.getElementById('modal').classList.add('hidden');
    BL.Battle.onChange=()=>BL.UI.renderBattle();BL.Battle.onEnd=result=>{BL.UI.renderAll();const title=result.retired?'実験を中止':result.win?'実験成功':'実験失敗',cls=result.win?'result-win':'result-lose',body=`<div class="result-title ${result.retired?'':cls}">${title}</div><div class="result-list"><div>到達ターン：${result.battle.turn}</div><div>敵：${result.battle.enemy.name}</div>${result.newUnlocks.length?`<div class="new-unlock"><strong>新規アンロック</strong><br>${result.newUnlocks.join('<br>')}</div>`:''}</div>`;BL.UI.showModal(body);};
  }
  document.addEventListener('DOMContentLoaded',()=>{bind();BL.UI.renderAll();});
})();
