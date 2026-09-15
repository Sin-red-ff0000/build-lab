'use strict';
(function(){
  const BL=window.BuildLab,D=BL.Data,U=D.UNLOCKS||[];
  const byId=Object.fromEntries(U.map(u=>[u.id,u]));
  const set=(id,patch)=>{const u=byId[id];if(u)Object.assign(u,patch);};

  // v0.57 / Roadmap 9/10: chapter curriculum recalibration.
  // Boss gates now test the system learned in that chapter, not a future raw-stat wall.
  if(BL.Unlock) BL.Unlock.boss3Available=s=>!!(
    s.boss2Defeated && s.claimedUnlocks?.v07_link_six &&
    s.claimedUnlocks?.v07_link_tuned && s.claimedUnlocks?.v08_link_cycle
  );
  if(BL.Unlock) BL.Unlock.boss4Available=s=>!!(
    s.boss3Defeated && s.claimedUnlocks?.v20_integration_trial &&
    s.claimedUnlocks?.v09_doctrine_compact &&
    s.claimedUnlocks?.v09_doctrine_expanded &&
    s.claimedUnlocks?.v09_doctrine_singleton
  );

  set('boss3',{condition:'第2ボス撃破後、「連結ビルド II」「調律連結」「連結循環実験」を達成。極相個体は第3章の任意高難度課題'});
  set('boss4',{condition:'第3ボス撃破後、圧縮・展開・単独の3構築規格を実戦で運用し、「統合実験」を達成'});

  // Chapter 3 advanced traits become visible only after the chapter-2 boss.
  const c3Traits=['v09_t_bloomwall','v09_t_nullgiant','v09_t_rushbloom','v09_t_apex'];
  for(const id of c3Traits){const u=byId[id];if(!u)continue;u.chapter=3;u.condition=String(u.condition||'').replace(/^第1ボス撃破後、?/,'第2ボス撃破後、');}
  // Their discovery checks are data-driven elsewhere; the text and chapter placement are the visible curriculum.

  // v0.20 extreme/compound discoveries are post-Boss4 endgame, not chapter-2 noise.
  for(const u of U.filter(x=>String(x.id).startsWith('v20_discover_')||String(x.id).startsWith('v20_behavior_'))){
    u.chapter=9;
    if(!String(u.condition||'').startsWith('第4ボス撃破後、'))u.condition='第4ボス撃破後、'+String(u.condition||'').replace(/^第1ボス撃破後、?/,'');
  }
  for(const id of ['v20_trait_paragon','v20_trait_voidskin']){const u=byId[id];if(u)u.chapter=9;}

  // Raw extreme multipliers are explicitly endgame research, never chapter progression gates.
  for(const id of ['u_hp12','u_atk10','u_def10','u_spd4']){const u=byId[id];if(u){u.chapter=10;u.condition=String(u.condition||'').replace(/^第3ボス撃破後、?/,'第4ボス撃破後、');}}
  if(byId.calibration){byId.calibration.chapter=10;byId.calibration.condition=String(byId.calibration.condition||'').replace(/^第4ボス撃破後、?/,'第4ボス撃破後、エンドコンテンツ研究として');}

  // Boss rewards are explicit bridges into the next curriculum.
  set('boss_clear',{title:'第2章導入：提示操作・高度敵パラメータ',condition:'第1ボス「観測体」を撃破。第2章の提示操作と再生・耐性対策を解放'});
  set('boss2_clear',{title:'第3章導入：カード連結・役割変換',condition:'第2ボス「適応体」を撃破。第3章の連結・役割変換を解放'});
  set('boss3_clear',{title:'第4章導入：構築規格',condition:'第3ボス「構築体」を撃破。圧縮・展開・単独規格と基礎規格装備を解放'});
  set('boss4_clear',{title:'クリア後研究：ルーン / アルカナ',condition:'第4ボス「統合体」を撃破。クリア後の横方向研究としてルーンとアルカナを解放'});

  D.PROGRESSION57={
    chapters:{
      1:{learn:['六基礎軸','基本特殊個体'],exam:'第1ボス 観測体',reward:'提示操作・高度敵パラメータ'},
      2:{learn:['提示操作','カード調律','再生/耐性対策'],exam:'第2ボス 適応体',reward:'カード連結・役割変換'},
      3:{learn:['カード連結','役割変換','連結循環'],exam:'第3ボス 構築体',reward:'構築規格'},
      4:{learn:['圧縮規格','展開規格','単独規格','規格横断'],exam:'統合実験',reward:'第4ボス挑戦資格'},
      5:{learn:['既存システム統合運用'],exam:'第4ボス 統合体',reward:'ルーン・アルカナ研究'},
      9:{learn:['高難度特殊個体','複合挙動'],exam:'任意高難度研究',reward:'横方向ビルド拡張'},
      10:{learn:['極端倍率研究','公式エンドコンテンツ'],exam:'全域校正（10/10で再構築）',reward:'なし'}
    },
    bossGatePolicy:'ボス挑戦条件は当該章で学ぶシステムの実運用を要求し、HP×N等の極端な数値個体を必須条件にしない。',
    rewardPolicy:'ボス報酬は次章の新しい操作体系を開く。前章装備の単純な上位数値を報酬にしない。',
    endgamePolicy:'HP×12等とv20複合個体は第4ボス後へ隔離し、通常章の導線を塞がない。'
  };
})();
