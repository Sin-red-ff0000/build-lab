'use strict';
(function(){
  const BL=window.BuildLab,D=BL.Data; BL.UI=BL.UI||{};
  function availableTunings(s){return Object.entries(D.TUNINGS).filter(([id,t])=>(!t.requiresSystem||BL.Unlock.hasSystem(s,t.requiresSystem))&&(!t.requiresUnlock||!!s.unlockedTunings?.[id]));}
  function ensureTypeOptions(s){const sel=document.getElementById('tuningTypeFilter'),current=s.ui.tuningType||'all',allowed=availableTunings(s);sel.innerHTML='<option value="all">すべての調律</option>'+allowed.map(([id,t])=>`<option value="${id}">${t.name}</option>`).join('');sel.value=allowed.some(([id])=>id===current)?current:'all';if(sel.value!==current)s.ui.tuningType=sel.value;}
  function renderTunings(){
    const s=BL.Store.state,area=document.getElementById('tuningPool'),summary=document.getElementById('tuningSelected');
    if(!area||!summary)return;
    const enabled=BL.Unlock.hasSystem(s,'card_tuning'),count=Object.keys(s.cardTunings||{}).length;
    summary.textContent=`${count}/2`;
    const search=document.getElementById('tuningSearch'),stateFilter=document.getElementById('tuningStateFilter'),typeFilter=document.getElementById('tuningTypeFilter');
    ensureTypeOptions(s);search.value=s.ui.tuningSearch||'';stateFilter.value=s.ui.tuningState||'deck';
    search.oninput=()=>{s.ui.tuningSearch=search.value;BL.Store.save();renderTunings();};
    stateFilter.onchange=()=>{s.ui.tuningState=stateFilter.value;BL.Store.save();renderTunings();};
    typeFilter.onchange=()=>{s.ui.tuningType=typeFilter.value;BL.Store.save();renderTunings();};
    if(!enabled){area.innerHTML='<div class="hint-box">カード調律システムは未解放です。アンロックタブで条件を確認できます。</div>';document.getElementById('tuningResultCount').textContent='未解放';return;}
    const q=(s.ui.tuningSearch||'').trim().toLowerCase(),allowed=new Map(availableTunings(s));
    let entries=Object.entries(D.CARDS).filter(([id,c])=>{
      if(!s.unlockedCards[id])return false;if(q&&!`${c.name} ${c.desc} ${c.tags.join(' ')}`.toLowerCase().includes(q))return false;
      if(s.ui.tuningState==='deck'&&!s.deck.includes(id))return false;if(s.ui.tuningState==='tuned'&&!s.cardTunings[id])return false;
      if(s.ui.tuningType!=='all'&&s.cardTunings[id]!==s.ui.tuningType)return false;return true;
    }).sort((a,b)=>a[1].name.localeCompare(b[1].name,'ja'));
    document.getElementById('tuningResultCount').textContent=`${entries.length}件`;area.innerHTML='';
    entries.forEach(([id,c])=>{const selected=s.cardTunings[id]||null,el=document.createElement('div');el.className='pool-card tuning-card'+(selected?' selected':'');
      const actionButtons=`<button class="tune-btn ${!selected?'active':''}" data-tune="">解除</button>`+[...allowed.entries()].map(([tid,t])=>`<button class="tune-btn ${selected===tid?'active':''}" data-tune="${tid}" title="${t.desc}">${t.name}</button>`).join('');
      el.innerHTML=`<div class="title">${c.name}</div><div class="desc">${c.desc}</div><div class="tags">${c.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div><div class="tuning-current">現在：${selected?D.TUNINGS[selected]?.name||'不明':'未調律'}</div><div class="tuning-actions">${actionButtons}</div>`;
      el.querySelectorAll('.tune-btn').forEach(btn=>btn.onclick=e=>{e.stopPropagation();const tid=btn.dataset.tune;if(!tid){delete s.cardTunings[id];}else{if(!allowed.has(tid))return BL.UI.toast('この調律はまだ未解放です');if(!s.cardTunings[id]&&Object.keys(s.cardTunings).length>=2)return BL.UI.toast('調律できるカード種類は最大2種類です');s.cardTunings[id]=tid;}BL.Store.save();BL.UI.renderAll();});area.appendChild(el);});
  }
  BL.UI.renderTunings=renderTunings;
})();
