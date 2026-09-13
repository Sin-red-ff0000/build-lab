'use strict';
(function(){
  const BL=window.BuildLab,D=BL.Data; BL.UI=BL.UI||{};
  function unlockedRunes(s){return Object.entries(D.RUNES||{}).filter(([id])=>!!s.unlockedRunes?.[id]);}
  function renderRunes(){
    const s=BL.Store.state,area=document.getElementById('runePool'),summary=document.getElementById('runeSelected');if(!area||!summary)return;
    const enabled=BL.Unlock.hasSystem(s,'rune'),count=Object.keys(s.cardRunes||{}).length;summary.textContent=`${count}/3`;
    const search=document.getElementById('runeSearch'),stateFilter=document.getElementById('runeStateFilter'),typeFilter=document.getElementById('runeTypeFilter');
    const avail=unlockedRunes(s),current=s.ui.runeType||'all';typeFilter.innerHTML='<option value="all">すべてのルーン</option>'+avail.map(([id,r])=>`<option value="${id}">${r.name}</option>`).join('');typeFilter.value=avail.some(([id])=>id===current)?current:'all';s.ui.runeType=typeFilter.value;
    search.value=s.ui.runeSearch||'';stateFilter.value=s.ui.runeState||'deck';
    search.oninput=()=>{s.ui.runeSearch=search.value;BL.Store.save();renderRunes();};stateFilter.onchange=()=>{s.ui.runeState=stateFilter.value;BL.Store.save();renderRunes();};typeFilter.onchange=()=>{s.ui.runeType=typeFilter.value;BL.Store.save();renderRunes();};
    if(!enabled){area.innerHTML='<div class="hint-box">ルーンは第4ボス撃破で解放されます。</div>';document.getElementById('runeResultCount').textContent='未解放';return;}
    const q=(s.ui.runeSearch||'').trim().toLowerCase(),allowed=new Map(avail);
    const entries=Object.entries(D.CARDS).filter(([id,c])=>{if(!s.unlockedCards[id])return false;if(q&&!`${c.name} ${c.desc} ${c.tags.join(' ')}`.toLowerCase().includes(q))return false;if(s.ui.runeState==='deck'&&!s.deck.includes(id))return false;if(s.ui.runeState==='runed'&&!s.cardRunes[id])return false;if(s.ui.runeType!=='all'&&s.cardRunes[id]!==s.ui.runeType)return false;return true;}).sort((a,b)=>a[1].name.localeCompare(b[1].name,'ja'));
    document.getElementById('runeResultCount').textContent=`${entries.length}件`;area.innerHTML='';
    entries.forEach(([id,c])=>{const selected=s.cardRunes[id]||null,el=document.createElement('div');el.className='pool-card tuning-card'+(selected?' selected':'');const buttons=`<button class="rune-btn ${!selected?'active':''}" data-rune="">解除</button>`+[...allowed.entries()].map(([rid,r])=>`<button class="rune-btn ${selected===rid?'active':''}" data-rune="${rid}" title="${r.desc}">${r.name}</button>`).join('');el.innerHTML=`<div class="title">${c.name}</div><div class="desc">${c.desc}</div><div class="tags">${c.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div><div class="tuning-current">現在：${selected?D.RUNES[selected]?.name||'不明':'未刻印'}</div><div class="tuning-actions">${buttons}</div>`;el.querySelectorAll('.rune-btn').forEach(btn=>btn.onclick=e=>{e.stopPropagation();const rid=btn.dataset.rune;if(!rid)delete s.cardRunes[id];else{if(!allowed.has(rid))return BL.UI.toast('このルーンはまだ未解放です');if(!s.cardRunes[id]&&Object.keys(s.cardRunes).length>=3)return BL.UI.toast('ルーンを設定できるカード種類は最大3種類です');s.cardRunes[id]=rid;}BL.Store.save();BL.UI.renderAll();});area.appendChild(el);});
  }
  BL.UI.renderRunes=renderRunes;
})();
