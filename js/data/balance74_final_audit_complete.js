(function(){
 'use strict';
 const D=window.BuildLab&&window.BuildLab.Data;if(!D)return;
 D.V74_FINAL_AUDIT={
   version:'0.74',baseline:'v0.71',requiredVariants:177,completedVariants:177,
   trials:8,auditModes:['hybrid','concept','trial'],seeds:3,complete:true,
   completionGate:{variantsWithAnyWin:177,failedVariants:0},
   blockingFindings:{
     zeroWinVariants:false,
     extremeSingleOptionConcentration:false,
     majorSystemZeroUse:false,
     extremeTrialSkew:true
   },
   followupRequired:['long_attrition'],
   policy:'全件再監査はここで終了。以後は完成阻害級の該当箇所だけ局所修正・局所再検証し、177構成を再リセットしない。'
 };
 if(D.ENDGAME58)D.ENDGAME58.version='0.74';
})();
