'use strict';
(function(){
  const BL=window.BuildLab; BL.UI=BL.UI||{};
  BL.UI.toast=function(msg){const t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(t._timer);t._timer=setTimeout(()=>t.classList.remove('show'),2200);};
  BL.UI.showModal=function(html){const body=document.getElementById('modalBody'),modal=document.getElementById('modal'),close=document.getElementById('modalClose');if(!body||!modal)return;body.innerHTML=html;body.scrollTop=0;modal.classList.remove('hidden');requestAnimationFrame(()=>close?.focus());};
  function safeRender(name,fn){try{fn?.();return true;}catch(err){console.error(`[BUILD LAB v0.21] ${name} render failed`,err);return false;}}
  BL.UI.renderAll=function(){
    // 解説はゲーム進行データへの依存が薄いので先に描画する。
    // WEB版で旧セーブや一部画面の描画が失敗しても、説明まで巻き添えで消えないようにする。
    safeRender('guides',BL.UI.renderGuides);
    const jobs=[
      ['characters',BL.UI.renderCharacters],['characterStyles',BL.UI.renderCharacterStyles],['deck',BL.UI.renderDeck],['relics',BL.UI.renderRelics],['protocols',BL.UI.renderProtocols],['tunings',BL.UI.renderTunings],['conversions',BL.UI.renderConversions],['runes',BL.UI.renderRunes],['alchemy',BL.UI.renderAlchemy],['arcana',BL.UI.renderArcana],['links',BL.UI.renderLinks],['doctrines',BL.UI.renderDoctrines],['experiment',BL.UI.renderExperiment],['unlocks',BL.UI.renderUnlocks],['collection',BL.UI.renderCollection],['battle',BL.UI.renderBattle]
    ];
    let failed=0;for(const [name,fn] of jobs)if(!safeRender(name,fn))failed++;
    try{BL.Store.save();}catch(err){console.error('[BUILD LAB v0.21] save failed',err);}
    if(failed)BL.UI.toast(`一部画面の再構築に失敗しました（${failed}件）。解説・セーブは利用できます。`);
  };

  function startBattle(mode=false){const r=BL.Battle.create(mode);if(r.error)return BL.UI.toast(r.error);document.getElementById('battlePanel')?.classList.remove('hidden');BL.UI.renderAll();document.getElementById('battlePanel')?.scrollIntoView({behavior:'smooth',block:'start'});}
  function bind(){
    BL.UI.bindTabs();
    const save=document.getElementById('saveBtn'),reset=document.getElementById('resetBtn'),buildResetHeader=document.getElementById('buildResetHeaderBtn'),buildReset=document.getElementById('buildResetBtn'),start=document.getElementById('startBattleBtn'),b1=document.getElementById('bossBattleBtn'),b2=document.getElementById('boss2BattleBtn'),b3=document.getElementById('boss3BattleBtn'),b4=document.getElementById('boss4BattleBtn'),retire=document.getElementById('retireBattleBtn'),close=document.getElementById('modalClose');
    const confirmBuildReset=()=>{if(confirm('アンロック・勝敗記録・進行状況は残したまま、キャラ・スタイル・デッキ・遺物・プロトコル・調律・役割変換・ルーン・アルカナ・元素錬成・連結・構築規格・敵設定を初期状態へ戻します。よろしいですか？')){BL.Store.resetBuild();BL.Battle.current=null;BL.UI.renderAll();BL.UI.toast('現在の構成を初期状態へ戻しました');}};
    if(save)save.onclick=()=>{BL.Store.save();BL.UI.toast('保存しました');};
    if(buildResetHeader)buildResetHeader.onclick=confirmBuildReset;if(buildReset)buildReset.onclick=confirmBuildReset;
    if(reset)reset.onclick=()=>{if(confirm('アンロック・進行・勝敗記録・ビルドを含む全データを初期化します。この操作は元に戻せません。よろしいですか？')){BL.Store.reset();BL.Battle.current=null;BL.UI.renderAll();BL.UI.toast('全データを初期化しました');}};
    const bindReset=(id,ask,fn,msg)=>{const el=document.getElementById(id);if(el)el.onclick=()=>{if(!ask||confirm(ask)){fn();BL.Battle.current=null;BL.UI.renderAll();BL.UI.toast(msg);}};};
    bindReset('characterResetBtn','キャラクターを初期キャラ「センター」へ戻しますか？',()=>BL.Store.resetCharacter(),'キャラクターを初期状態へ戻しました');
    bindReset('styleResetBtn',null,()=>BL.Store.resetCurrentStyle(),'現在のキャラスタイルを原型へ戻しました');
    bindReset('deckResetBtn','現在の構築規格を維持したまま、デッキを基本構成へ戻しますか？',()=>BL.Store.resetDeck(),'デッキを基本構成へ戻しました');
    bindReset('relicResetBtn',null,()=>BL.Store.resetRelics(),'遺物をすべて外しました');
    bindReset('protocolResetBtn',null,()=>BL.Store.resetProtocol(),'強化プロトコルを解除しました');
    bindReset('tuningResetBtn',null,()=>BL.Store.resetTunings(),'カード調律をすべて解除しました');
    bindReset('conversionResetBtn',null,()=>BL.Store.resetConversions(),'役割変換をすべて解除しました');
    bindReset('runeResetBtn',null,()=>BL.Store.resetRunes(),'ルーンをすべて解除しました');
    bindReset('arcanaResetBtn',null,()=>BL.Store.resetArcana(),'アルカナを解除しました');
    bindReset('doctrineResetBtn','構築規格を標準へ戻し、デッキも標準10枚へ戻しますか？',()=>BL.Store.resetDoctrine(),'構築規格とデッキを標準へ戻しました');
    bindReset('enemyResetBtn',null,()=>BL.Store.resetExperiment(),'敵設定を初期値へ戻しました');
    if(start)start.onclick=()=>startBattle(false);if(b1)b1.onclick=()=>startBattle('boss1');if(b2)b2.onclick=()=>startBattle('boss2');if(b3)b3.onclick=()=>startBattle('boss3');if(b4)b4.onclick=()=>startBattle('boss4');if(retire)retire.onclick=()=>BL.Battle.retire();const dismissModal=()=>document.getElementById('modal')?.classList.add('hidden');if(close)close.onclick=dismissModal;const modal=document.getElementById('modal');if(modal)modal.onclick=e=>{if(e.target===modal)dismissModal();};document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.getElementById('modal')?.classList.contains('hidden'))dismissModal();});
    BL.Battle.onChange=()=>safeRender('battle',BL.UI.renderBattle);
    BL.Battle.onEnd=result=>{BL.UI.renderAll();const title=result.retired?'実験を中止':result.win?'実験成功':'実験失敗',cls=result.win?'result-win':'result-lose',body=`<div class="result-title ${result.retired?'':cls}">${title}</div><div class="result-list"><div>到達ターン：${result.battle.turn}</div><div>敵：${result.battle.enemy.name}</div>${result.newUnlocks.length?`<div class="new-unlock"><strong>新規アンロック</strong><br>${result.newUnlocks.join('<br>')}</div>`:''}</div>`;BL.UI.showModal(body+(BL.UI.alchemyReport?.(result.battle)||''));};
  }
  document.addEventListener('DOMContentLoaded',()=>{bind();BL.UI.renderAll();});
})();
