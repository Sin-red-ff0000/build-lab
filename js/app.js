'use strict';
(function(){
  const BL=window.BuildLab; BL.UI=BL.UI||{};
  BL.UI.toast=function(msg){const t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(t._timer);t._timer=setTimeout(()=>t.classList.remove('show'),2200);};
  BL.UI.showModal=function(html){const body=document.getElementById('modalBody'),modal=document.getElementById('modal');if(!body||!modal)return;body.innerHTML=html;modal.classList.remove('hidden');};
  function safeRender(name,fn){try{fn?.();return true;}catch(err){console.error(`[BUILD LAB v0.16] ${name} render failed`,err);return false;}}
  BL.UI.renderAll=function(){
    // 解説はゲーム進行データへの依存が薄いので先に描画する。
    // WEB版で旧セーブや一部画面の描画が失敗しても、説明まで巻き添えで消えないようにする。
    safeRender('guides',BL.UI.renderGuides);
    const jobs=[
      ['characters',BL.UI.renderCharacters],['characterStyles',BL.UI.renderCharacterStyles],['deck',BL.UI.renderDeck],['relics',BL.UI.renderRelics],['protocols',BL.UI.renderProtocols],['tunings',BL.UI.renderTunings],['conversions',BL.UI.renderConversions],['links',BL.UI.renderLinks],['doctrines',BL.UI.renderDoctrines],['experiment',BL.UI.renderExperiment],['unlocks',BL.UI.renderUnlocks],['collection',BL.UI.renderCollection],['battle',BL.UI.renderBattle]
    ];
    let failed=0;for(const [name,fn] of jobs)if(!safeRender(name,fn))failed++;
    try{BL.Store.save();}catch(err){console.error('[BUILD LAB v0.16] save failed',err);}
    if(failed)BL.UI.toast(`一部画面の再構築に失敗しました（${failed}件）。解説・セーブは利用できます。`);
  };

  function startBattle(mode=false){const r=BL.Battle.create(mode);if(r.error)return BL.UI.toast(r.error);document.getElementById('battlePanel')?.classList.remove('hidden');BL.UI.renderAll();document.getElementById('battlePanel')?.scrollIntoView({behavior:'smooth',block:'start'});}
  function bind(){
    BL.UI.bindTabs();
    const save=document.getElementById('saveBtn'),reset=document.getElementById('resetBtn'),start=document.getElementById('startBattleBtn'),b1=document.getElementById('bossBattleBtn'),b2=document.getElementById('boss2BattleBtn'),b3=document.getElementById('boss3BattleBtn'),retire=document.getElementById('retireBattleBtn'),close=document.getElementById('modalClose');
    if(save)save.onclick=()=>{BL.Store.save();BL.UI.toast('保存しました');};
    if(reset)reset.onclick=()=>{if(confirm('進行・アンロック・ビルドをすべて初期化します。よろしいですか？')){BL.Store.reset();BL.Battle.current=null;BL.UI.renderAll();BL.UI.toast('初期化しました');}};
    if(start)start.onclick=()=>startBattle(false);if(b1)b1.onclick=()=>startBattle('boss1');if(b2)b2.onclick=()=>startBattle('boss2');if(b3)b3.onclick=()=>startBattle('boss3');if(retire)retire.onclick=()=>BL.Battle.retire();if(close)close.onclick=()=>document.getElementById('modal')?.classList.add('hidden');
    BL.Battle.onChange=()=>safeRender('battle',BL.UI.renderBattle);
    BL.Battle.onEnd=result=>{BL.UI.renderAll();const title=result.retired?'実験を中止':result.win?'実験成功':'実験失敗',cls=result.win?'result-win':'result-lose',body=`<div class="result-title ${result.retired?'':cls}">${title}</div><div class="result-list"><div>到達ターン：${result.battle.turn}</div><div>敵：${result.battle.enemy.name}</div>${result.newUnlocks.length?`<div class="new-unlock"><strong>新規アンロック</strong><br>${result.newUnlocks.join('<br>')}</div>`:''}</div>`;BL.UI.showModal(body);};
  }
  document.addEventListener('DOMContentLoaded',()=>{bind();BL.UI.renderAll();});
})();
