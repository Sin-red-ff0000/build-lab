'use strict';
(function(){
 const D=window.BuildLab.Data;
 const before={characters:new Set(Object.keys(D.CHARACTERS)),styles:new Set(Object.keys(D.CHARACTER_STYLES||{}))};
 Object.assign(D.CHARACTERS,{
  vanisher:{id:'vanisher',name:'ヴァニッシャー',role:'消失・復帰',hp:76,desc:'カードを戦闘から外すことを圧縮と将来資源の両方にする。消失札を単純な高性能一回札にしない。'},
  watcher:{id:'watcher',name:'ウォッチャー',role:'非選択・提示中',hp:75,desc:'選んだ1枚だけでなく、提示されたのに選ばなかったカードや横にいるカードまで判断材料にする。'},
  scribe:{id:'scribe',name:'スクライブ',role:'記録・再現',hp:73,desc:'直前のカードの役割や履歴を記録し、別の小型札へ再利用する。強カードそのものの複製は行わない。'},
  provocateur:{id:'provocateur',name:'プロヴォーカー',role:'敵行動利用',hp:82,desc:'敵が動くことを観測資源にする。高速敵を単なる不利ではなく構築対象へ変える。'},
  reverser:{id:'reverser',name:'リバーサー',role:'デメリット反転',hp:78,desc:'自傷・消失・防御消費などの代償を消すのではなく、支払った後の別行動へ小さな価値を渡す。'},
  morph:{id:'morph',name:'モーフ',role:'変質・二面遷移',hp:77,desc:'変質前後の役割差を利用する。裏面を単純上位として扱わず、変わるタイミングそのものを構築判断にする。'}
 });
 D.V53_CHARACTER_RULES={
  vanisher:[{when:{tag:'消失'},mult:1.06}],watcher:[{when:{tag:'非選択'},mult:1.05},{when:{tag:'提示中'},mult:1.05}],scribe:[{when:{tag:'記録'},mult:1.06}],provocateur:[{when:{tag:'敵行動'},mult:1.06}],reverser:[{when:{tag:'自傷'},mult:1.05}],morph:[{when:{tag:'二面'},mult:1.05}]
 };
 D.V53_STYLE_RULES={};
 const S=[
 ['vanisher_thin','vanisher','圧縮型','消失札+8%。消した枚数そのものを火力倍率にはせず、山札を細くする価値を主役にする.',{tag:'消失'},1.08],
 ['vanisher_return','vanisher','帰還型','復帰・予約札+8%。消失→復帰という領域移動を繰り返す中継型。',{tag:'復帰'},1.08],
 ['vanisher_echo','vanisher','残響型','消失札+4%。消失後の次の非消失札へ防御を渡す運用型。',{tag:'消失'},1.04],
 ['watcher_pass','watcher','見送り型','非選択札+8%。見送って育てるカードを主役にする。',{tag:'非選択'},1.08],
 ['watcher_presence','watcher','同席型','提示中札+7%。選ばないカードが横にいる価値を重視。',{tag:'提示中'},1.07],
 ['watcher_choice','watcher','選別型','提示操作札+6%。見送り回数と実際の選択を往復する。',{tag:'提示操作'},1.06],
 ['scribe_copy','scribe','転写型','記録札+8%。記録した役割を小型効果へ転写する。',{tag:'記録'},1.08],
 ['scribe_archive','scribe','編纂型','循環札+6%。記録と回収・再構築を接続する。',{tag:'循環'},1.06],
 ['scribe_blank','scribe','白紙型','防御札+4%。記録前の準備を防御で行う安定型。',{blockish:true},1.04],
 ['provocateur_counter','provocateur','反応型','敵行動札+8%。敵の行動回数を反応機会へ変える。',{tag:'敵行動'},1.08],
 ['provocateur_bleed','provocateur','裂創型','出血札+7%。多行動敵へ出血を合わせる。',{tag:'出血'},1.07],
 ['provocateur_guard','provocateur','観測型','防御札+4%。長く観測するための防御を確保する。',{blockish:true},1.04],
 ['reverser_wound','reverser','反転自傷型','自傷札+7%。自傷後の立て直しへ価値を渡す。',{tag:'自傷'},1.07],
 ['reverser_void','reverser','反転消失型','消失札+6%。消える代償を次の行動へ接続する。',{tag:'消失'},1.06],
 ['reverser_spend','reverser','反転消費型','防御消費・役割変換札+6%。支払った防御を別用途へ回す。',{tag:'役割変換'},1.06],
 ['morph_patience','morph','遅延変質型','二面札+5%。表面を長く使うことにも価値を残す。',{tag:'二面'},1.05],
 ['morph_shift','morph','遷移型','二面札+7%。変質発生後に小さな防御を得る。',{tag:'二面'},1.07],
 ['morph_cycle','morph','輪廻型','二面＋循環のカード+8%。変質した実体を再び巡回させる。',{tag:'循環'},1.08]
 ];
 for(const [id,ch,name,desc,when,mult] of S){D.CHARACTER_STYLES[id]={id,character:ch,name,tags:['横方向','学習輸入','役割分化'],desc,requiresUnlock:true};D.V53_STYLE_RULES[id]=[{when,mult}];}
 D.V53_CHARACTER_IDS=Object.keys(D.CHARACTERS).filter(x=>!before.characters.has(x));
 D.V53_STYLE_IDS=Object.keys(D.CHARACTER_STYLES).filter(x=>!before.styles.has(x));
})();
