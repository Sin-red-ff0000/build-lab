'use strict';
(function(){
  const BL=window.BuildLab,D=BL.Data;
  if(!D.SYSTEM_GUIDES)return;
  D.SYSTEM_GUIDES.push(
    {id:'runes',refGroup:'runes',category:'ビルド',title:'ルーン',summary:'第4ボス撃破後に解放されるカード強化要素。カード種類ごとに刻み、最大3種類まで同時設定できる。',where:'デッキ → ルーン',unlock:'第4ボス「統合体」撃破',points:['ルーンはカードの役割を変更せず、条件を満たした時の基本効果を追加強化する。','設定できるカード種類は最大3種類。いつでも無料で解除・付け替え可能。','同じカードへ調律・役割変換・連結を重ねられる。','最初は剛力・護界・蝕毒・連閃・残響・輪廻の6種が解放され、残りは第5章の目標で増える。'],example:'《針雨》へ連閃のルーンを刻めば3ヒット以上条件を満たして+20%。さらに連射調律を重ねて多段特化にもできる。'},
    {id:'arcana',refGroup:'arcana',category:'ビルド',title:'アルカナ（正位置 / 逆位置）',summary:'第4ボス撃破後に解放されるビルド全体強化。1枚だけ選び、正位置か逆位置のどちらかを適用する。',where:'デッキ → アルカナ',unlock:'第4ボス「統合体」撃破',points:['同時に装備できるアルカナは1枚。','各アルカナは正位置と逆位置で対象条件が異なる。','どちらが上位という関係ではなく、現在のビルドに合わせて向きを選ぶ。','無料で何度でも切り替え可能。'],example:'「戦車」は正位置なら3ヒット以上を強化、逆位置なら1ヒット攻撃を大きく強化。同じアルカナでも連撃型と単発型の両方に使える。'},
    {id:'boss4',category:'進行',title:'第4ボス「統合体」',summary:'スタイル・構築規格・調律・役割変換・連結をまとめて試す第5章の総合試験。撃破でルーンとアルカナを解放する。',where:'実験場 → 実験準備',unlock:'第3ボス撃破後、「統合実験」達成＋極限個体撃破',points:['同じ強化系統を連続して使うと統合体が適応し、攻撃力上昇と障壁を得る。','調律・変換・連結・混成など、使うレイヤーを切り替えながら戦うと適応を避けやすい。','撃破報酬としてルーン6種・アルカナ6種が初期解放される。'],example:'調律カード→連結コンボ→役割変換カードのように、同じレイヤーだけを連打しない構築が有効。'}
  );
  const ref=(obj)=>Object.entries(obj||{}).map(([id,x])=>({id,name:x.name||id,desc:x.desc||'',tags:x.tags||[],use:'',caution:''}));
  D.GUIDE_REFERENCE_GROUPS=D.GUIDE_REFERENCE_GROUPS||{};
  D.GUIDE_REFERENCE_GROUPS.runes=ref(D.RUNES);
  D.GUIDE_REFERENCE_GROUPS.arcana=Object.entries(D.ARCANA||{}).map(([id,a])=>({id,name:a.name,tags:a.tags||[],desc:`正位置：${a.upright.desc} / 逆位置：${a.reversed.desc}`,use:'正位置と逆位置をビルドに合わせて選択。',caution:'同時に装備できるアルカナは1枚だけ。'}));

  // v0.20追加分も既存の詳細リファレンスへ自動追記。
  for(const r of D.GUIDE_REFERENCE_GROUPS.tunings||[]){if(!r.use)r.use='説明文にある成立条件を満たすカードへ付け、既存の調律・変換・連結などと重ねて使う。';if(!r.caution)r.caution='条件外では減衰する調律が多い。装備中のビルド条件を確認する。';}
  const knownTune=new Set((D.GUIDE_REFERENCE_GROUPS.tunings||[]).map(x=>x.id));
  for(const [id,t] of Object.entries(D.TUNINGS||{}))if(!knownTune.has(id))D.GUIDE_REFERENCE_GROUPS.tunings.push({id,name:t.name,desc:t.desc,tags:t.tags||[],use:'説明文にある成立条件を満たすカードへ付け、既存の調律・変換・連結などと重ねて使う。',caution:'条件外では減衰する調律が多い。装備中のビルド条件を確認する。'});
  const knownStyles=new Set((D.GUIDE_REFERENCE_GROUPS.styles||[]).map(x=>x.id));for(const [id,x] of Object.entries(D.CHARACTER_STYLES||{}))if(!knownStyles.has(id))D.GUIDE_REFERENCE_GROUPS.styles.push({id,name:x.name,desc:x.desc||'',tags:x.tags||[],use:'',caution:''});
  const knownBehaviors=new Set((D.GUIDE_REFERENCE_GROUPS.behaviors||[]).map(x=>x.id));for(const [id,x] of Object.entries(D.ENEMY_BEHAVIORS||{}))if(!knownBehaviors.has(id))D.GUIDE_REFERENCE_GROUPS.behaviors.push({id,name:x.name,desc:x.desc||'',tags:[],use:'',caution:''});

  const bosses=D.SYSTEM_GUIDES.find(g=>g.id==='bosses'); if(bosses){bosses.points=[...bosses.points.filter(x=>!x.startsWith('第4ボス')), '第4ボス：ルーンとアルカナを解放。'];}
})();
