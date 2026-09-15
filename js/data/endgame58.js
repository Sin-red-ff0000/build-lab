'use strict';
(function(){
 const D=window.BuildLab.Data;
 const trials={
  opening_storm:{id:'opening_storm',name:'先陣校正',enemy:{hp:5,atk:5,def:2,spd:3,regen:0,resist:15,traits:{fast:true,berserk:true}},pressure:'序盤の多行動を捌きながら早期に主導権を取る。',answers:['防御','反撃','提示','連撃','敵行動','出血']},
  late_awaken:{id:'late_awaken',name:'覚醒校正',enemy:{hp:7,atk:3,def:3,spd:1,regen:2,resist:25,traits:{regenerative:true,berserk:true}},pressure:'長期戦で強くなる相手。循環・変質・蓄積した履歴を中盤以降の出力へ変える。',answers:['循環','変質','二面','保持','記録','自傷','瀕死','捨て札']},
  action_flood:{id:'action_flood',name:'群動校正',enemy:{hp:5,atk:3,def:2,spd:4,regen:0,resist:20,traits:{fast:true,adaptive:true}},pressure:'行動回数が多い。敵行動・出血・反撃など、速度を逆利用する攻略を許す。',answers:['敵行動','出血','反撃','状態異常','連撃','防御']},
  long_attrition:{id:'long_attrition',name:'消耗校正',enemy:{hp:8,atk:3,def:4,spd:1,regen:2,resist:35,traits:{armored:true,regenerative:true}},pressure:'瞬間火力より資源効率を問う。消失圧縮・復帰・循環・防御運用が有効。',answers:['消失','復帰','循環','捨て札','防御','耐久','回収','錬成']},
  cleansing_field:{id:'cleansing_field',name:'浄化校正',enemy:{hp:6,atk:3,def:3,spd:2,regen:1,resist:55,traits:{purifier:true,adaptive:true}},pressure:'状態異常一本足を拒むが無効化はしない。状態異常の維持・消費や別役割への接続を問う。',answers:['毒','火傷','出血','凍傷','状態異常','役割変換','連結','記録']},
  adaptive_matrix:{id:'adaptive_matrix',name:'適応校正',enemy:{hp:6,atk:4,def:3,spd:2,regen:1,resist:30,traits:{adaptive:true,armored:true}},pressure:'同じ回答だけの反復を嫌う。位置・連結・規格・調律など複数のカード関係を切り替える。',answers:['提示','位置','連結','調律','変換','構築規格','多タグ','非選択']},
  void_archive:{id:'void_archive',name:'空隙校正',enemy:{hp:6,atk:4,def:2,spd:2,regen:0,resist:30,traits:{nullfield:true,purifier:true}},pressure:'カードの領域移動と選択価値を問う。消失・予約・非選択・記録のような直接火力以外の軸を活用する。',answers:['消失','復帰','予約','非選択','提示中','記録','変質','循環']},
  synthesis:{id:'synthesis',name:'統合校正',enemy:{hp:7,atk:4,def:4,spd:2,regen:1,resist:40,traits:{convergence:true,adaptive:true}},pressure:'単一の巨大倍率ではなく複数システムの接続を問う。元素・錬成・ルーン・アルカナ等の横断構築向け。',answers:['元素','錬成','ルーン','アルカナ','記録','連結','調律','役割変換']}
 };
 const text=(cid,st)=>{const c=D.CHARACTERS[cid]||{};return [c.role,c.desc,st?.name,st?.desc,...(st?.tags||[])].filter(Boolean).join(' ');};
 const aliases={
  '捨て札':['循環','非選択'],'連撃':['連撃'],'状態異常':['状態異常'],'耐久':['耐久','防御'],'反撃':['反撃'],'自傷':['自傷'],'瀕死':['瀕死'],'循環':['循環'],'提示':['提示'],'中央':['位置'],'左右':['位置'],'連結':['連結'],'調律':['調律'],'変換':['変換','役割変換'],'構築':['構築規格'],'規格':['構築規格'],'敵行動':['敵行動'],'解析':['敵行動'],'元素':['元素'],'錬成':['錬成'],'ルーン':['ルーン'],'アルカナ':['アルカナ'],'消失':['消失'],'復帰':['復帰'],'非選択':['非選択'],'提示中':['提示中'],'記録':['記録'],'変質':['変質'],'二面':['二面'],'保持':['保持'],'単発':['防御'],'防御消費':['役割変換'],'毒':['毒'],'火傷':['火傷'],'出血':['出血'],'凍傷':['凍傷']
 };
 function concepts(cid,st){const t=text(cid,st),out=new Set();for(const [needle,vals] of Object.entries(aliases))if(t.includes(needle))for(const v of vals)out.add(v);if(!out.size){out.add('防御');out.add('循環');}return [...out];}
 function routes(cid,st){const cs=concepts(cid,st);const scored=Object.values(trials).map(tr=>({id:tr.id,score:tr.answers.filter(a=>cs.includes(a)).length,reasons:tr.answers.filter(a=>cs.includes(a))})).sort((a,b)=>b.score-a.score);let picked=scored.filter(x=>x.score>0).slice(0,3);if(picked.length<2){for(const x of scored){if(!picked.some(p=>p.id===x.id)){picked.push(x);if(picked.length>=2)break;}}}return picked;}
 D.ENDGAME58={version:'0.58',policy:'全スタイルに同一HP×12個体を要求しない。複数の公式校正からコンセプトに合う攻略経路を持たせ、万能構築一択を失敗とする。',trials,concepts,routes,legacyExtreme:{enabled:true,required:false,name:'極限数値研究',note:'HP×12/攻撃×10/防御×10/速度×4は任意の研究プリセットとして残すが、全域校正の合格条件にはしない。'},passRule:'各キャラクター原型・各スタイルに2種類以上の公式校正ルートがあり、そのうち少なくとも1つは自身のコンセプト語と直接一致すること。'};
 if(D.SYSTEM_GUIDES){
  const oldBoss4=D.SYSTEM_GUIDES.find(g=>g.id==='boss4');if(oldBoss4)oldBoss4.unlock='第3ボス撃破後、3構築規格を運用し「統合実験」を達成';
  D.SYSTEM_GUIDES.push({id:'endgame58',category:'進行',title:'全域校正：公式エンドコンテンツ',summary:'第4ボス後の最終研究。単一のHP×12壁ではなく、異なる攻略能力を問う8種類の校正から構成される。',where:'第4ボス後 → エンドコンテンツ研究',unlock:'第4ボス「統合体」撃破後',points:Object.values(trials).map(t=>`${t.name}：${t.pressure}`),example:'自分のキャラクター/スタイルの得意な校正から攻略し、構築を組み替えて別の校正へ挑む。HP×12等の極限数値研究は任意。'});
  D.GUIDE_REFERENCE_GROUPS=D.GUIDE_REFERENCE_GROUPS||{};D.GUIDE_REFERENCE_GROUPS.endgame58=Object.values(trials).map(t=>({id:t.id,name:t.name,desc:t.pressure,tags:t.answers,use:'複数の回答軸から自分のスタイルに合う攻略法を選ぶ。',caution:'全校正を同じ万能構築で突破することは設計上の目標ではない。'}));
 }

})();
