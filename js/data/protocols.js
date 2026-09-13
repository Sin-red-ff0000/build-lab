'use strict';
(function(){
  const BL=window.BuildLab; const D=BL.Data;
  D.SYSTEMS = {
    prompt_control:{name:'提示操作システム',desc:'カード位置交換・持ち越し・再提示など、提示そのものへ干渉できる。'}
  };
  D.PROTOCOLS = {
    fortify_calibration:{name:'堅守校正',tags:['耐久'],desc:'防御カードの基本効果+18%。攻撃カードの基本ダメージ-6%。',effect:'fortify'},
    assault_calibration:{name:'強襲校正',tags:['連撃','万能'],desc:'攻撃カードの基本ダメージ+14%。防御カードの基本防御-8%。',effect:'assault'},
    discard_harness:{name:'残滓利用規格',tags:['捨て札'],desc:'「選ばれず捨てられた時」の効果+50%。選択して使うカードの基本効果-5%。',effect:'discard'},
    multihit_accelerator:{name:'多段加速規格',tags:['連撃'],desc:'3ヒット以上のカードの基本効果+18%。1ヒット攻撃のダメージ-8%。',effect:'multihit'},
    ailment_catalyst:{name:'症状触媒規格',tags:['状態異常'],desc:'カードによる毒・火傷・脆弱・弱体の付与量+1。直接ダメージ-8%。',effect:'ailment'},
    scar_exchange:{name:'瘢痕変換規格',tags:['自傷','瀕死'],desc:'自傷を持つカードの基本効果+25%。戦闘開始時の最大HP-8。',effect:'scar'},
    cycle_prime:{name:'再循環規格',tags:['循環'],desc:'山札再構築直後の最初のカードの基本効果+30%。戦闘開始時の最大HP-5。',effect:'cycle'},
    hybrid_optimizer:{name:'混成最適化規格',tags:['万能'],desc:'タグを2種類以上持つカードの基本効果+18%。タグ1種類だけのカードは-5%。',effect:'hybrid'},
    counter_matrix:{name:'反撃演算規格',tags:['反撃','耐久'],desc:'割合反撃・固定反撃のダメージ+30%。通常攻撃カードの基本ダメージ-5%。',effect:'counter'},
    center_drive:{name:'中央駆動規格',tags:['提示操作'],desc:'中央枠で使うカードの基本効果+22%。左右枠で使うカードは-8%。',effect:'center'},
    wide_scan:{name:'広域走査規格',tags:['提示','提示操作'],desc:'毎ターン提示枚数+1。選んだカードの基本効果-10%。',effect:'wide'},
    narrow_scan:{name:'狭域収束規格',tags:['提示','提示操作'],desc:'毎ターン提示枚数-1。選んだカードの基本効果+20%。',effect:'narrow'}
  };

  Object.assign(D.PROTOCOLS, {
    position_flux:{name:'位置流動規格',tags:['提示操作'],desc:'左・中央・右のうち前ターンと異なる位置を選ぶと基本効果+18%。',effect:'position_flux'},
    reserve_drive:{name:'保留駆動規格',tags:['提示操作','循環'],desc:'前ターンから持ち越されたカードの基本効果+25%。通常提示カードは-5%。',effect:'reserve_drive'},
    anti_regen:{name:'再生阻害規格',tags:['対再生'],desc:'再生力を持つ敵への攻撃カードの基本効果+20%。それ以外では-5%。',effect:'anti_regen'},
    anti_resist:{name:'耐性突破規格',tags:['対耐性','状態異常'],desc:'状態異常付与時、敵耐性を15ポイント低く扱う。直接ダメージ-5%。',effect:'anti_resist'},
    tuned_overdrive:{name:'調律過駆動規格',tags:['調律'],desc:'調律済みカードの基本効果+18%。未調律カードの基本効果-5%。',effect:'tuned_overdrive'},
    adaptive_build:{name:'適応構築規格',tags:['万能'],desc:'敵が再生力か状態異常耐性を持つ時、2タグ以上のカードの基本効果+20%。',effect:'adaptive_build'}
  });
})();
