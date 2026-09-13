'use strict';
(function(){
  const BL=window.BuildLab; const D=BL.Data;
  D.TUNINGS={
    overload:{name:'過負荷調律',tags:['火力','調律'],desc:'このカードを使用した時の基本効果+25%。使用後は次の山札再構築まで除外される。',effect:'overload'},
    recycle:{name:'再循環調律',tags:['循環','調律'],desc:'このカードを使用した時の基本効果-10%。使用後は捨て札ではなく山札の一番下へ戻る。',effect:'recycle'},
    residue:{name:'残滓調律',tags:['捨て札','調律'],desc:'このカードを使用した時の基本効果-5%。選ばれず捨てられた時、次に使うカードの効果+15%。',effect:'residue'}
  };
  D.SYSTEMS.card_tuning={name:'カード調律システム',desc:'解放済みカードを派生調律できる。最大2種類のカードを調律し、いつでも無料で付け替え可能。'};
  D.SYSTEMS.advanced_enemy_parameters={name:'高度敵パラメータ',desc:'再生力・状態異常耐性を実験場で編集できる。'};
})();
