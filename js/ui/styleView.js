'use strict';
(function(){
  const BL=window.BuildLab,D=BL.Data; BL.UI=BL.UI||{};
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
  }
  BL.UI.renderCharacterStyles=renderCharacterStyles;
})();
