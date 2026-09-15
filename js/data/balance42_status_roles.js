'use strict';
(function(){
  const D=window.BuildLab.Data;
  const patch=(id,p)=>{if(D.CARDS[id])Object.assign(D.CARDS[id],p);};
  // 毒：直接火力ではなく、継続投与を維持する侵蝕軸。小型札は投与の継続・別軸接続を担当。
  patch('poison_needle',{damage:3,status:{type:'poison',amount:3},desc:'3ダメージ＋毒3。小さな投与を途切れさせない基礎札。'});
  patch('venom_pressure',{damage:4,status:{type:'poison',amount:4},desc:'4ダメージ＋毒4。単発で濃い投与を行う。'});
  patch('toxic_guard',{block:6,status:{type:'poison',amount:3},desc:'防御6＋毒3。防御を選びながら投与を継続する。'});
  patch('cycle_venom_ii',{status:{type:'poison',amount:3},statusIfRecentReshuffle:6,desc:'毒3。山札再構築直後なら毒6。循環を毒の投与経路に変える。'});
  patch('compact_venom',{status:{type:'poison',amount:3},statusIfDeckSizeMax:{max:8,amount:5},desc:'毒3。デッキが8枚以下なら毒5。少数精鋭で投与を安定させる。'});
  patch('singleton_toxin',{status:{type:'poison',amount:3},statusIfUniqueCopy:5,desc:'毒3。同名が1枚だけなら毒5。単独規格から毒へ接続する。'});
  patch('link_poison',{status:{type:'poison',amount:3},statusIfLinkedCombo:6,desc:'毒3。連結コンボなら毒6。連結を投与経路として利用する。'});

  // 火傷：着火→燃焼→再点火の数ターンサイクル。既に燃えている時の再点火で火勢を維持する。
  patch('brand',{damage:5,status:{type:'burn',amount:3},burnRefresh:2,desc:'5ダメージ＋火傷3。既に火傷中なら再点火し、火勢を2維持する。'});
  patch('burning_guard',{block:6,status:{type:'burn',amount:2},burnRefresh:2,desc:'防御6＋火傷2。既に火傷中なら火勢を2維持し、守りながら再点火する。'});
  patch('ember_burst',{damage:5,consumeStatus:{type:'burn',ratio:1.5},desc:'5ダメージ。敵の火傷をすべて消費し、消費した火傷×1.5を追加ダメージ。燃焼サイクルを終える決着札。'});
  patch('cinder_lattice',{status:{type:'burn',amount:4},burnRefresh:3,desc:'火傷4。既に火傷中なら火勢を3維持する再点火札。'});
  patch('expanded_burn',{status:{type:'burn',amount:3},statusIfDeckSizeMin:{min:12,amount:6},burnRefresh:2,desc:'火傷3。デッキ12枚以上なら火傷6。既に燃えていれば火勢を2維持する。'});
  patch('duplicate_ember',{status:{type:'burn',amount:3},statusIfDuplicateCopy:6,burnRefresh:2,desc:'火傷3。同名2枚以上なら火傷6。重複規格で再点火を安定させる。'});
  patch('relay_burn',{damage:4,status:{type:'burn',amount:2},statusIfLinkedCombo:5,burnRefresh:2,desc:'4ダメージ＋火傷2。連結コンボなら火傷5。既に燃えていれば火勢を2維持する。'});

  // 既存の「色違い状態異常」から、敵行動を利用する出血・短期抑制の凍傷へ再配置。
  patch('toxic_barrage',{damage:2,hits:4,perHitStatus:null,status:{type:'bleed',amount:3},tags:['連撃','状態異常','出血'],desc:'2ダメージ×4＋出血3。多段攻撃で傷口を作り、高速敵の行動を逆利用する。'});
  patch('weakening_mist',{status:{type:'frost',amount:4},tags:['状態異常','凍傷'],desc:'凍傷4。次の敵ターンの攻撃を短時間だけ抑える。'});
  patch('weakening_brand',{damage:4,status:{type:'frost',amount:3},tags:['状態異常','凍傷'],desc:'4ダメージ＋凍傷3。攻撃しながら次の敵ターンを弱める。'});

  D.V42_STATUS_ROLE_PATCH_IDS=['poison_needle','venom_pressure','toxic_guard','cycle_venom_ii','compact_venom','singleton_toxin','link_poison','brand','burning_guard','ember_burst','cinder_lattice','expanded_burn','duplicate_ember','relay_burn','toxic_barrage','weakening_mist','weakening_brand'];
})();
