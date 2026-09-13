'use strict';
(function(){
  const BL=window.BuildLab; BL.UI=BL.UI||{};
  function activateMain(tab){
    document.querySelectorAll('.main-tabs .tab').forEach(x=>x.classList.toggle('active',x.dataset.tab===tab));
    document.querySelectorAll('.mobile-nav-btn').forEach(x=>x.classList.toggle('active',x.dataset.mobileTab===tab));
    document.querySelectorAll('main > .tab-panel').forEach(x=>x.classList.toggle('active',x.id==='tab-'+tab));
    window.scrollTo({top:0,behavior:'smooth'});BL.UI.updateMobileChrome?.();
  }
  BL.UI.activateMainTab=activateMain;
  BL.UI.bindTabs=function(){
    document.querySelectorAll('.main-tabs .tab').forEach(btn=>btn.addEventListener('click',()=>activateMain(btn.dataset.tab)));
    document.querySelectorAll('.mobile-nav-btn').forEach(btn=>btn.addEventListener('click',()=>activateMain(btn.dataset.mobileTab)));
    document.querySelectorAll('.subtabs').forEach(nav=>{
      const group=nav.dataset.group;
      nav.querySelectorAll('.subtab').forEach(btn=>btn.addEventListener('click',()=>{
        nav.querySelectorAll('.subtab').forEach(x=>x.classList.remove('active'));btn.classList.add('active');
        document.querySelectorAll(`[id^="${group}-sub-"]`).forEach(x=>x.classList.remove('active'));
        document.getElementById(`${group}-sub-${btn.dataset.subtab}`).classList.add('active');
        if(group==='deck')BL.Store.state.ui.deckSubtab=btn.dataset.subtab;
        if(group==='enemy')BL.Store.state.ui.enemySubtab=btn.dataset.subtab;
        BL.Store.save();BL.UI.updateMobileChrome?.();
      }));
    });
  };
})();
