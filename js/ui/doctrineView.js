'use strict';
(function(){
  const BL=window.BuildLab,D=BL.Data; BL.UI=BL.UI||{};
  function ruleText(d){return `デッキ ${d.deckSize}枚 / 同名 ${d.copyLimit}枚まで${d.promptDelta?` / 提示 ${d.promptDelta>0?'+':''}${d.promptDelta}`:''}`;}
  function renderDoctrines(){
    const s=BL.Store.state,area=document.getElementById('doctrinePool'),summary=document.getElementById('doctrineSelected');
    if(!area||!summary)return;
    const enabled=BL.Unlock.hasSystem(s,'deck_doctrine');
    summary.textContent=s.doctrine?(D.DOCTRINES[s.doctrine]?.name||'なし'):'標準規格';
    const search=document.getElementById('doctrineSearch'),stateFilter=document.getElementById('doctrineStateFilter');
    search.value=s.ui.doctrineSearch||'';stateFilter.value=s.ui.doctrineState||'unlocked';
    search.oninput=()=>{s.ui.doctrineSearch=search.value;BL.Store.save();renderDoctrines();};
    stateFilter.onchange=()=>{s.ui.doctrineState=stateFilter.value;BL.Store.save();renderDoctrines();};
    if(!enabled){area.innerHTML='<div class="hint-box">構築規格システムは未解放です。第3ボス撃破で解放されます。</div>';document.getElementById('doctrineResultCount').textContent='未解放';return;}
    const q=(s.ui.doctrineSearch||'').trim().toLowerCase();
    let entries=Object.entries(D.DOCTRINES).filter(([id,d])=>{const unlocked=!!s.unlockedDoctrines[id],selected=s.doctrine===id;if(q&&!`${d.name} ${d.desc} ${d.tags.join(' ')} ${ruleText(d)}`.toLowerCase().includes(q))return false;if(s.ui.doctrineState==='unlocked'&&!unlocked)return false;if(s.ui.doctrineState==='locked'&&unlocked)return false;if(s.ui.doctrineState==='selected'&&!selected)return false;return true;});
    entries.sort((a,b)=>a[1].name.localeCompare(b[1].name,'ja'));document.getElementById('doctrineResultCount').textContent=`${entries.length}件 / 全${Object.keys(D.DOCTRINES).length}種`;area.innerHTML='';
    entries.forEach(([id,d])=>{const unlocked=!!s.unlockedDoctrines[id],selected=s.doctrine===id,el=document.createElement('div');el.className='relic-card doctrine-card'+(selected?' selected':'')+(!unlocked?' locked':'');el.innerHTML=`<div class="title">${d.name}</div><div class="card-meta">${ruleText(d)}</div><div class="desc">${d.desc}</div><div class="tags">${d.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>`;el.onclick=()=>{if(!unlocked)return BL.UI.toast('この構築規格はまだ未解放です');s.doctrine=selected?null:id;BL.Store.save();BL.UI.renderAll();if(s.doctrine)BL.UI.toast(`${d.name}を適用しました。必要デッキ枚数を確認してください。`);};area.appendChild(el);});
  }
  BL.UI.renderDoctrines=renderDoctrines;
})();
