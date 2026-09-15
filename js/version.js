'use strict';
(function(){
  const BL=window.BuildLab=window.BuildLab||{};
  const VERSION=Object.freeze({number:75,label:'0.75',saveKey:'build_lab_proto_v75'});
  BL.Version=VERSION;
  if(typeof document!=='undefined'){
    document.title=`BUILD LAB - ビルド実験場 v${VERSION.label}`;
    const el=document.getElementById('buildVersionLabel');
    if(el) el.textContent=`BUILD EXPERIMENT GAME / PROTOTYPE ${VERSION.label}`;
  }
})();
