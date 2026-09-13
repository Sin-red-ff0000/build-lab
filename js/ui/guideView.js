'use strict';
(function(){
  const BL=window.BuildLab; BL.UI=BL.UI||{}; const D=BL.Data;
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const refsFor=g=>(D.GUIDE_REFERENCE_GROUPS||{})[g.refGroup]||[];
  function refHay(ref){return [ref.name,ref.desc,ref.use,ref.caution,...(ref.tags||[])].join(' ').toLowerCase();}
  function matches(g,q,cat){
    if(cat!=='all'&&g.category!==cat)return false;
    if(!q)return true;
    const hay=[g.title,g.summary,g.category,g.where,g.unlock,g.example,...(g.points||[])].join(' ').toLowerCase();
    return hay.includes(q)||refsFor(g).some(r=>refHay(r).includes(q));
  }
  function renderReference(g,q){
    const refs=refsFor(g);if(!refs.length)return '';
    return `<div class="guide-reference"><div class="guide-reference-head"><b>個別内容一覧</b><span>${refs.length}件</span></div><div class="guide-reference-grid">${refs.map(r=>`<details class="guide-ref-item" ${q&&refHay(r).includes(q)?'open':''}><summary><span>${esc(r.name)}</span>${r.tags?.length?`<small>${r.tags.map(esc).join(' / ')}</small>`:''}</summary><div class="guide-ref-body"><p>${esc(r.desc)}</p>${r.use?`<div class="guide-ref-note use"><b>向いている使い方</b><span>${esc(r.use)}</span></div>`:''}${r.caution?`<div class="guide-ref-note caution"><b>注意</b><span>${esc(r.caution)}</span></div>`:''}</div></details>`).join('')}</div></div>`;
  }
  function renderCard(g,q){const refHit=!!(q&&refsFor(g).some(r=>refHay(r).includes(q)));return `<article class="panel guide-card" id="guide-${esc(g.id)}"><div class="guide-card-head"><div><span class="guide-category">${esc(g.category)}</span><h3>${esc(g.title)}</h3><p class="guide-summary">${esc(g.summary)}</p></div><button class="ghost guide-jump" data-guide-open="${esc(g.id)}">開く</button></div><details class="guide-details" ${refHit?'open':''}><summary>詳細を見る</summary><div class="guide-meta-grid"><div><b>設定・確認場所</b><span>${esc(g.where)}</span></div><div><b>解放</b><span>${esc(g.unlock)}</span></div></div><ul>${(g.points||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul>${g.example?`<div class="guide-example"><b>例</b><span>${esc(g.example)}</span></div>`:''}${renderReference(g,q)}</details></article>`;}
  function fillCategories(){const sel=document.getElementById('guideCategoryFilter');if(!sel||sel.dataset.ready)return;sel.dataset.ready='1';for(const c of D.GUIDE_CATEGORIES||[]){const o=document.createElement('option');o.value=c;o.textContent=c;sel.appendChild(o);}}
  function render(){
    const list=document.getElementById('guideList');if(!list)return;
    fillCategories();
    const q=(document.getElementById('guideSearch')?.value||'').trim().toLowerCase(),cat=document.getElementById('guideCategoryFilter')?.value||'all';
    const items=(D.SYSTEM_GUIDES||[]).filter(g=>matches(g,q,cat));
    if(!(D.SYSTEM_GUIDES||[]).length){list.innerHTML='<article class="panel guide-load-error"><h3>解説データを読み込めませんでした</h3><p>WEB版で古いファイルがキャッシュされている可能性があります。ページを再読み込みしてください。v0.16以降は更新ごとにキャッシュを自動分離します。</p><button type="button" class="primary" data-guide-reload>再読み込み</button></article>';list.querySelector('[data-guide-reload]')?.addEventListener('click',()=>location.reload());return;}
    list.innerHTML=items.map(g=>renderCard(g,q)).join('')||'<article class="panel empty-guide">条件に一致する解説がありません。</article>';
    const count=document.getElementById('guideResultCount');if(count)count.textContent=`${items.length}項目`;
    const quick=document.getElementById('guideQuickLinks');if(quick)quick.innerHTML=items.map(g=>`<button type="button" class="guide-chip" data-guide-target="${esc(g.id)}">${esc(g.title)}</button>`).join('');
    list.querySelectorAll('[data-guide-open]').forEach(btn=>btn.onclick=()=>{const d=btn.closest('.guide-card')?.querySelector('details');if(d){d.open=true;d.scrollIntoView({behavior:'smooth',block:'center'});}});
    document.querySelectorAll('[data-guide-target]').forEach(btn=>btn.onclick=()=>{const el=document.getElementById('guide-'+btn.dataset.guideTarget);if(!el)return;const d=el.querySelector('details');if(d)d.open=true;el.scrollIntoView({behavior:'smooth',block:'start'});});
  }
  function bind(){for(const id of ['guideSearch','guideCategoryFilter']){const el=document.getElementById(id);if(el&&!el.dataset.bound){el.dataset.bound='1';el.addEventListener(id==='guideSearch'?'input':'change',render);}}}
  BL.UI.renderGuides=function(){bind();render();};
})();
