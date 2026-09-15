'use strict';
(function(){
  const BL=window.BuildLab; const D=BL.Data;
  D.SYSTEMS=D.SYSTEMS||{};
  D.SYSTEMS.character_style={name:'キャラクタースタイル',desc:'解放したキャラクターの固有能力を別スタイルへ切り替える。レベル育成ではなく、いつでも無料で原型へ戻せる横方向強化。'};
  D.CHARACTER_STYLES={
    standard_focus:{id:'standard_focus',character:'standard',name:'焦点型',tags:['提示操作','中央'],desc:'中央枠の2回発動を失う代わりに、中央枠の基本効果+80%、左右枠+10%。'},
    standard_wings:{id:'standard_wings',character:'standard',name:'翼展型',tags:['提示操作','左右'],desc:'中央枠の2回発動を失う代わりに、左右枠の基本効果+45%。中央枠は-10%。'},
    combo_catalytic:{id:'combo_catalytic',character:'combo',name:'触媒型',tags:['連撃','状態異常'],desc:'連撃によるランダム状態異常を失う代わりに、3ヒット以上のカード+25%。最終ヒットで毒1・火傷1。'},
    combo_precision:{id:'combo_precision',character:'combo',name:'精密型',tags:['連撃'],desc:'連撃によるランダム状態異常を失う代わりに、5ヒット以上のカード+40%。'},
    tank_forge:{id:'tank_forge',character:'tank',name:'自動鍛造型',tags:['耐久','成長'],desc:'使用カードの強化を失う代わりに、敵ターン終了時に未強化カード実体をランダムに1枚強化する。'},
    tank_tempered:{id:'tank_tempered',character:'tank',name:'焼入型',tags:['耐久','成長'],desc:'原型と同様に使用カードを強化し、強化済みカードの基本効果がさらに+18%。'},
    vector_flux:{id:'vector_flux',character:'vector',name:'流動型',tags:['提示操作'],desc:'左・中央・右の固有効果を失う代わりに、前回と異なる位置を選ぶと基本効果+30%・防御4。'},
    archive_salvage:{id:'archive_salvage',character:'archive',name:'回収型',tags:['捨て札','耐久'],desc:'一度捨てられたカードの補正を+15%へ下げる代わりに、そのカードを使用するたび防御5。'},
    relay_direction:{id:'relay_direction',character:'relay',name:'順送型',tags:['連結'],desc:'連結時の防御を失う。A→Bの順方向連結は追加+40%、B→Aは追加-10%。'},
    risk_crisis:{id:'risk_crisis',character:'risk',name:'臨界型',tags:['自傷','瀕死'],desc:'HP半分以下では全カード+12%。HP半分の境界を跨いだ履歴1回につき自傷カード+5%（最大+15%）。HPを上下させながら危険域へ踏み込む型。'},
    loop_rebirth:{id:'loop_rebirth',character:'loop',name:'再起型',tags:['循環'],desc:'再構築時の防御3を失う代わりに、再構築直後の最初のカード+55%。'},
    catalyst_spectrum:{id:'catalyst_spectrum',character:'catalyst',name:'多相型',tags:['状態異常'],desc:'状態異常カード常時+15%を失う。敵の状態異常が2種類以上なら全カード+25%、3種類以上なら状態異常カードはさらに+15%。'},
    architect_specialist:{id:'architect_specialist',character:'architect',name:'専門設計型',tags:['構築規格','単独'],desc:'構築規格装備中、1タグだけのカード+30%。2タグ以上のカードは+5%。'},
    echo_singleton:{id:'echo_singleton',character:'echo',name:'孤響型',tags:['単独','構築規格'],desc:'同名複数採用への+22%を失い、同名1枚だけのカード+28%。同名2枚以上は-5%。'}
  };
  D.getCharacterStyle=function(state,characterId){
    const id=state?.characterStyles?.[characterId];
    const st=id&&D.CHARACTER_STYLES[id];
    return st&&st.character===characterId&&state?.unlockedCharacterStyles?.[id]?st:null;
  };
})();
