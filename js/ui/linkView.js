'use strict';
(function(){
  const BL=window.BuildLab,D=BL.Data; BL.UI=BL.UI||{};
  function renderLinks(){
    const s=BL.Store.state,area=document.getElementById('linkPool'),summary=document.getElementById('linkSelected'),clear=document.getElementById('linkClearBtn'),modes=document.getElementById('linkModePool'),modeSummary=document.getElementById('linkModeSelected');
    if(!area||!summary)return;
    const enabled=BL.Unlock.hasSystem(s,'card_link'),link=s.cardLink||{a:null,b:null};
    summary.textContent=link.a&&link.b?`${D.CARDS[link.a]?.name||'?'} ⇄ ${D.CARDS[link.b]?.name||'?'}`:'未設定';
    if(modeSummary)modeSummary.textContent=D.LINK_MODES?.[s.linkMode||'reciprocal']?.name||'双方向連結';
    if(modes){modes.innerHTML='';Object.values(D.LINK_MODES||{}).forEach(m=>{const unlocked=!!s.unlockedLinkModes?.[m.id],btn=document.createElement('button');btn.className='link-mode-btn'+(s.linkMode===m.id?' active':'')+(unlocked?'':' locked');btn.disabled=!enabled||!unlocked;btn.innerHTML=`<strong>${m.name}</strong><small>${m.desc}</small>`;btn.onclick=()=>{s.linkMode=m.id;BL.Store.save();BL.UI.renderAll();};modes.appendChild(btn);});}
    const search=document.getElementById('linkSearch');search.value=s.ui.linkSearch||'';search.oninput=()=>{s.ui.linkSearch=search.value;BL.Store.save();renderLinks();};
    clear.onclick=()=>{s.cardLink={a:null,b:null};s.linkMode='reciprocal';BL.Store.save();BL.UI.renderAll();BL.UI.toast('カード連結を初期状態へ戻しました');};clear.disabled=!enabled||(!link.a&&!link.b);
    if(!enabled){area.innerHTML='<div class="hint-box">カード連結システムは未解放です。第2ボス撃破で解放されます。</div>';document.getElementById('linkResultCount').textContent='未解放';return;}
    const q=(s.ui.linkSearch||'').trim().toLowerCase();
    const ids=[...new Set(s.deck)].filter(id=>s.unlockedCards[id]).filter(id=>{const c=D.CARDS[id];return !q||`${c.name} ${c.desc} ${c.tags.join(' ')}`.toLowerCase().includes(q);});
    document.getElementById('linkResultCount').textContent=`${ids.length}件`;
    area.innerHTML='';
    ids.sort((a,b)=>D.CARDS[a].name.localeCompare(D.CARDS[b].name,'ja')).forEach(id=>{
      const c=D.CARDS[id],slot=link.a===id?'A':link.b===id?'B':'',el=document.createElement('div');el.className='pool-card'+(slot?' selected':'');
      el.innerHTML=`<div class="title">${c.name}</div>${slot?`<div class="count-badge">LINK ${slot}</div>`:''}<div class="desc">${c.desc}</div><div class="tags">${c.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>`;
      el.onclick=()=>{const l=s.cardLink||{a:null,b:null};if(l.a===id){l.a=null;}else if(l.b===id){l.b=null;}else if(!l.a){l.a=id;}else if(!l.b){l.b=id;}else{l.b=id;}if(l.a&&l.b&&l.a===l.b)l.b=null;s.cardLink=l;BL.Store.save();BL.UI.renderAll();};area.appendChild(el);
    });
  }
  BL.UI.renderLinks=renderLinks;
})();
