'use strict';
(function(){
  const BL=window.BuildLab,D=BL.Data; BL.UI=BL.UI||{};
  function renderQuickPicker(){
    const s=BL.Store.state,charSel=document.getElementById('quickCharacterSelect'),styleSel=document.getElementById('quickStyleSelect'),jump=document.getElementById('jumpStyleListBtn');
    if(!charSel||!styleSel)return;
    const unlockedChars=Object.values(D.CHARACTERS||{}).filter(c=>!!s.unlockedCharacters?.[c.id]);
    charSel.innerHTML=unlockedChars.map(c=>`<option value="${c.id}">${c.name}</option>`).join('');charSel.value=s.character;
    charSel.onchange=()=>{if(!s.unlockedCharacters?.[charSel.value])return;s.character=charSel.value;BL.Store.save();BL.UI.renderAll();BL.UI.toast(`${D.CHARACTERS[s.character]?.name||''}に変更しました`);};
    const enabled=BL.Unlock.hasSystem(s,'character_style'),styles=Object.values(D.CHARACTER_STYLES||{}).filter(st=>st.character===s.character&&!!s.unlockedCharacterStyles?.[st.id]),selected=D.getCharacterStyle?.(s,s.character)||null;
    styleSel.innerHTML='<option value="">原型</option>'+styles.map(st=>`<option value="${st.id}">${st.name}</option>`).join('');styleSel.value=selected?.id||'';styleSel.disabled=!enabled;
    styleSel.onchange=()=>{if(!enabled)return BL.UI.toast('キャラクタースタイルは第1ボス撃破で解放されます');if(styleSel.value)s.characterStyles[s.character]=styleSel.value;else delete s.characterStyles[s.character];BL.Store.save();BL.UI.renderAll();BL.UI.toast(`スタイルを${styleSel.options[styleSel.selectedIndex]?.textContent||'原型'}に変更しました`);};
    if(jump&&!jump.dataset.bound){jump.dataset.bound='1';jump.onclick=()=>document.getElementById('characterStyleList')?.closest('.panel')?.scrollIntoView({behavior:'smooth',block:'start'});}
  }
  function renderCharacterStyles(){
    const s=BL.Store.state,area=document.getElementById('characterStyleList'),summary=document.getElementById('characterStyleSummary');
    if(!area||!summary)return;
    const c=D.CHARACTERS[s.character],enabled=BL.Unlock.hasSystem(s,'character_style');
    const selected=D.getCharacterStyle?.(s,s.character)||null;
    summary.textContent=enabled?`選択中：${selected?selected.name:'原型'}（${c.name}）`:'第1ボス撃破で解放';
    area.innerHTML='';
    const base=document.createElement('div');base.className='char-card style-card'+(!selected?' selected':'');base.innerHTML=`<div class="title">原型</div><div class="subtitle">${c.name} / 基本スタイル</div><div class="desc">${c.desc}</div>`;base.onclick=()=>{if(!enabled)return BL.UI.toast('キャラクタースタイルは第1ボス撃破で解放されます');delete s.characterStyles[s.character];BL.Store.save();BL.UI.renderAll();};area.appendChild(base);
    const styles=Object.values(D.CHARACTER_STYLES||{}).filter(st=>st.character===s.character);
    styles.forEach(st=>{const unlocked=!!s.unlockedCharacterStyles?.[st.id],active=selected?.id===st.id,el=document.createElement('div');el.className='char-card style-card'+(active?' selected':'')+(!unlocked?' locked':'');el.innerHTML=`<div class="title">${unlocked?st.name:'？？？'}</div><div class="subtitle">${unlocked?st.tags.join(' / '):'未解放'}</div><div class="desc">${unlocked?st.desc:'アンロック条件は「アンロック」タブで確認'}</div>`;el.onclick=()=>{if(!enabled)return BL.UI.toast('キャラクタースタイルは第1ボス撃破で解放されます');if(!unlocked)return BL.UI.toast('このスタイルはまだ未解放です');s.characterStyles[s.character]=st.id;BL.Store.save();BL.UI.renderAll();};area.appendChild(el);});
    renderQuickPicker();
  }
  BL.UI.renderCharacterStyles=renderCharacterStyles;BL.UI.renderCharacterQuickPicker=renderQuickPicker;
})();
