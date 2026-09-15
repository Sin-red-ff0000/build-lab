'use strict';
(function(){
  const D=window.BuildLab.Data;
  const before={characters:new Set(Object.keys(D.CHARACTERS)),styles:new Set(Object.keys(D.CHARACTER_STYLES||{}))};
  // 未使用札監査から独立させた「カードの使い方」軸。基礎値を盛らず、既存札の評価軸を増やす。
  Object.assign(D.CHARACTERS,{
    keeper:{id:'keeper',name:'キーパー',role:'保持・手札育成',hp:74,desc:'前ターンから保持したカードを使うと、その実体の保持履歴に応じて小さく効率が上がる。使わない判断を資源にする。'},
    breaker:{id:'breaker',name:'ブレイカー',role:'単発重撃・少hit',hp:72,desc:'1ヒット攻撃を選ぶと防御3。多hitの総火力ではなく、少ないヒット数を選ぶ理由を作る。'},
    converter:{id:'converter',name:'コンバータ',role:'防御消費・攻防転換',hp:80,desc:'攻撃カード使用時、残っている防御を最大6消費し、消費量の半分を追加ダメージへ変える。防御を貯めるだけで終わらせない。'}
  });
  D.V47_CHARACTER_RULES={
    keeper:[{when:{reserved:true},mult:1.08}],
    breaker:[{when:{hitsMax:1,attackish:true},mult:1.08}],
    converter:[]
  };
  D.V47_STYLE_RULES={};
  const styles=[
    ['keeper_archive','keeper','保管型','保持したカードは+10%。同じカード実体を複数回保持しているほど追加+2%（最大+6%）。',{reserved:true},1.10],
    ['keeper_release','keeper','解放型','保持カードを使った直後の次カード+8%。保持札そのものを巨大化させず、次の選択へ価値を渡す。',{reserved:true},1.06],
    ['keeper_guard','keeper','備蓄型','保持した防御カードは+8%し、防御2を追加で得る。',{reserved:true,blockish:true},1.08],
    ['breaker_heavy','breaker','重撃型','1ヒット攻撃+12%。5ヒット以上の攻撃は-8%。',{hitsMax:1,attackish:true},1.12],
    ['breaker_pierce','breaker','穿孔型','1ヒット攻撃は+7%。敵防御が高いほど少hit札の防御無視を補助する。',{hitsMax:1,attackish:true},1.07],
    ['breaker_guarded','breaker','構え型','1ヒット攻撃使用時に防御4。攻撃と防御をカード本文1枚へ詰め込まず、スタイル側で最低限を補う。',{hitsMax:1,attackish:true},1.04],
    ['converter_spend','converter','消費型','攻撃時に残存防御を最大8消費し、消費量の75%を追加ダメージへ変える。',{attackish:true},1.00],
    ['converter_reserve','converter','温存型','防御を消費しない。ターン終了時に防御が8以上残っていれば次カード+8%。',{blockish:true},1.04],
    ['converter_cycle','converter','循環型','防御カード使用後に循環カードを使うと+8%。攻防転換を循環へ接続する。',{tag:'循環'},1.08]
  ];
  for(const [id,ch,name,desc,when,mult] of styles){D.CHARACTER_STYLES[id]={id,character:ch,name,tags:['横方向','役割分化'],desc,requiresUnlock:true};D.V47_STYLE_RULES[id]=[{when,mult}];}
  D.V47_CHARACTER_IDS=Object.keys(D.CHARACTERS).filter(id=>!before.characters.has(id));
  D.V47_STYLE_IDS=Object.keys(D.CHARACTER_STYLES).filter(id=>!before.styles.has(id));
})();
