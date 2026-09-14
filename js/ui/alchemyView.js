'use strict';
(function(){
  const BL=window.BuildLab,A=BL.Data.ALCHEMY;BL.UI=BL.UI||{};
  const formula=r=>Object.entries(r.input).map(([id,n])=>A.materials[id]+' '+n).join(' ＋ ')+' → '+A.materials[r.output]+' 1';
  function report(b){const a=b?.alchemy;if(!a?.config.enabled)return '';
    return '<div class="hint-box"><strong>錬成の実験結果</strong><p>'+BL.Alchemy.summary(b)+'</p><p>反応回数：'+(Object.entries(a.reactions).map(([id,n])=>A.recipes.find(r=>r.id===id).name+' '+n).join(' / ')||'なし')+'</p><p>使用数：'+(Object.entries(a.used).map(([id,n])=>A.materials[id]+' '+n).join(' / ')||'なし')+'</p><p>加工待ち（最後の反応判定時）：'+(Object.entries(a.missing).map(([id,m])=>A.recipes.find(r=>r.id===id).name+'：'+m+'不足').join(' / ')||'なし')+'</p><p>起動中：'+(a.pending.map(x=>A.materials[x.id]+' → T'+x.due).join(' / ')||'なし')+'</p></div>';
  }
  function render(){
    const root=document.getElementById('alchemyConfig');if(!root)return;
    const s=BL.Store.state,c=A.normalize(s.alchemy),locked=!!BL.Battle.current,disabled=locked?' disabled':'';
    root.innerHTML='<p>構築時に配分と工程を設定。戦闘中はすべて自動で動きます。初期状態から利用可能です。</p>'+
      (locked?'<p class="hint-box">実験中の錬成設定は固定されています。実験終了後に編集できます。</p>':'')+
      '<label><input type="checkbox" id="alchemyEnabled"'+(c.enabled?' checked':'')+disabled+'> 錬成を使用する</label> <button id="alchemyReset"'+disabled+'>錬成だけリセット</button>'+
      '<h4>構成例</h4><div class="alchemy-presets">'+A.presets.map((p,i)=>'<button data-preset="'+i+'"'+disabled+'>'+p.name+'</button>').join('')+'</div>'+
      '<h4>元素配分：'+Object.values(c.allocation).reduce((a,b)=>a+b,0)+' / 12</h4><div class="alchemy-allocation">'+Object.entries(A.elements).map(([id,name])=>'<label>'+name+'<input type="number" min="0" max="12" step="1" data-element="'+id+'" value="'+c.allocation[id]+'"'+disabled+'></label>').join('')+'</div>'+
      '<p>戦闘開始時と山札再構築時に、この内訳で供給。未配分は供給されません。全素材は戦闘中スタックし、ターン・再構築で消えません。次の戦闘では在庫を初期化します。</p>'+
      '<h4>自動加工の順番：'+c.recipes.length+' / 8</h4><p>供給時に上から1巡し、可能な回数まとめて反応します。上位工程の次の1回分に必要な手持ち材料を確保してから、下位工程へ進みます。後の工程から前の工程への加工は次回供給まで待ちます。</p>'+
      c.recipes.map((id,i)=>{const r=A.recipes.find(r=>r.id===id);return '<div class="hint-box"><strong>'+(i+1)+'. '+r.name+'</strong><p>'+formula(r)+'</p><button data-up="'+i+'"'+(locked||i===0?' disabled':'')+'>↑ 上へ</button> <button data-down="'+i+'"'+(locked||i===c.recipes.length-1?' disabled':'')+'>↓ 下へ</button> <button data-remove="'+i+'"'+disabled+'>外す</button></div>';}).join('')+
      '<label>レシピを追加 <select id="alchemyRecipe"'+(locked||c.recipes.length>=8?' disabled':'')+'><option value="">選択してください</option>'+A.recipes.filter(r=>!c.recipes.includes(r.id)).map(r=>'<option value="'+r.id+'">'+r.name+'：'+formula(r)+'</option>').join('')+'</select></label>'+
      '<h4>生成物の使用・備蓄</h4><p>自動使用は各素材1ターン1個まで。カードの再発動では追加消費しません。「備蓄」にすると自動使用を止め、後続加工用に残せます。加工自体は止まりません。</p>'+
      '<div class="relic-grid">'+Object.entries(A.effects).map(([id,e])=>'<div class="relic-card"><strong>'+A.materials[id]+'</strong><p>'+e.desc+'</p>'+(e.event!=='hold'?'<label><input type="checkbox" data-hold="'+id+'"'+(c.hold.includes(id)?' checked':'')+disabled+'> 備蓄（自動使用しない）</label>':'')+'</div>').join('')+
      '</div><p>第五元素エーテルも12点の共通枠から配分します。専用レシピのみで反応し、元素の代用・万能結合・四元素への再分解は行いません。</p><div id="alchemyPreview"></div>';
    const save=()=>{if(BL.Battle.current)return;s.alchemy=A.normalize(c);BL.Store.save();render();};
    root.querySelector('#alchemyEnabled').onchange=e=>{c.enabled=e.target.checked;save();};
    root.querySelector('#alchemyReset').onclick=()=>{if(locked)return;BL.Store.resetAlchemy();render();};
    root.querySelectorAll('[data-preset]').forEach(el=>el.onclick=()=>{if(locked)return;s.alchemy=A.normalize({...A.presets[Number(el.dataset.preset)],enabled:true});BL.Store.save();render();});
    root.querySelectorAll('[data-element]').forEach(el=>el.onchange=()=>{const id=el.dataset.element,remaining=12-Object.entries(c.allocation).filter(([k])=>k!==id).reduce((n,[,v])=>n+v,0);c.allocation[id]=Math.min(remaining,Math.max(0,Math.floor(Number(el.value)||0)));save();});
    root.querySelector('#alchemyRecipe').onchange=e=>{if(e.target.value)c.recipes.push(e.target.value);save();};
    root.querySelectorAll('[data-remove]').forEach(el=>el.onclick=()=>{c.recipes.splice(Number(el.dataset.remove),1);save();});
    ['up','down'].forEach(dir=>root.querySelectorAll('[data-'+dir+']').forEach(el=>el.onclick=()=>{const i=Number(el.dataset[dir]),j=i+(dir==='up'?-1:1);[c.recipes[i],c.recipes[j]]=[c.recipes[j],c.recipes[i]];save();}));
    root.querySelectorAll('[data-hold]').forEach(el=>el.onchange=()=>{const id=el.dataset.hold;c.hold=c.hold.filter(x=>x!==id);if(el.checked)c.hold.push(id);save();});
    const b={turn:1,log:[],alchemy:BL.Alchemy.create(c)};BL.Alchemy.supply(b);
    root.querySelector('#alchemyPreview').innerHTML='<h4>初回供給・加工の予測（自動使用前）</h4><p>'+BL.Alchemy.summary(b)+'</p>';
  }
  BL.UI.renderAlchemy=render;
  BL.UI.alchemyReport=report;
  BL.UI.renderAlchemyBattle=b=>{
    const el=document.getElementById('alchemyBattle');if(!el)return;
    el.textContent=BL.Alchemy.summary(b)+(b.alchemy?.config.enabled?' ｜ 起動中：'+(b.alchemy.pending.map(p=>A.materials[p.id]+' T'+p.due).join(' / ')||'なし'):'');
  };
})();
