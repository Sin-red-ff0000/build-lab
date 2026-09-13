'use strict';
(function(){
  const BL = window.BuildLab = window.BuildLab || {};
  BL.Util = {
    clamp:(n,min,max)=>Math.max(min,Math.min(max,n)),
    pick:arr=>arr[Math.floor(Math.random()*arr.length)],
    fmt:n=>Math.round(n).toLocaleString('ja-JP'),
    shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;},
    escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
  };
})();
