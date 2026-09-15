'use strict';
(function(){
 const D=window.BuildLab.Data; if(!D)return;
 const ids=[]; const patch=(id,x)=>{if(!D.CARDS[id])throw new Error('v0.59 missing '+id);Object.assign(D.CARDS[id],x);ids.push(id);};
 // Final audit fix 1: hit数そのものを採用理由にせず、各連撃を別の「出口」へ接続する。
 patch('sixfold_cut',{tags:['連撃','防御'],damage:1,hits:6,nextBlockFlat:2,desc:'1ダメージ×6。使用後、次の防御カードの防御+2。基礎連撃を守りへ接続する。'});
 patch('v13_sixfold_cut',{tags:['連撃','状態異常'],damage:2,hits:6,nextStatusFlat:1,desc:'2ダメージ×6。使用後、次に付与する状態異常+1。火力連撃を症状準備へ接続する。'});
 patch('hyper_chain',{tags:['連撃','予約'],damage:1,hits:8,reserveSelfOnPrevAttack:true,desc:'1ダメージ×8。直前も攻撃なら自身を次回提示へ予約する。高hitを攻撃継続の提示制御へ使う。'});
 patch('hex_puncture',{tags:['連撃','単発支援'],damage:2,hits:6,armorPierce:.20,primeSingleHitBuff:.08,desc:'2ダメージ×6、防御20%無視。使用後、次の1ヒット攻撃+8%。穿孔連撃を重撃準備へ変える。'});
 patch('precise_barrage',{tags:['連撃','状態異常'],damage:2,hits:6,armorPierce:.35,nextStatusFlat:1,desc:'2ダメージ×6、防御35%無視。使用後、次に付与する状態異常+1。精密射撃を症状へ渡す。'});
 patch('armor_saw',{tags:['連撃','防御'],damage:3,hits:5,armorPierce:.50,nextBlockFlat:2,desc:'3ダメージ×5、防御50%無視。使用後、次の防御カードの防御+2。装甲切断後に守りへ移る。'});
 patch('v18_sevenfold_pierce',{tags:['連撃','消失'],damage:3,hits:5,armorPierce:.55,vanish:true,desc:'3ダメージ×5、防御55%無視。使用後は消失する。高貫通を一度きりの圧縮札として使う。'});
 patch('v34_m_drill',{tags:['連撃','予約'],damage:3,hits:6,armorPierce:.25,reserveSelfOnPrevAttack:true,desc:'3ダメージ×6、防御25%無視。直前も攻撃なら自身を次回提示へ予約する。継続穿孔用。'});

 // 攻防複合系列も「同じ攻防で数値だけ違う」を撤去。
 patch('guard_barrage',{tags:['連撃','耐久','安定'],damage:2,hits:2,block:8,stableGuard:true,desc:'2ダメージ×2＋防御8。このカードで得た防御は敵の最初の攻撃に対して2だけ追加で働く。低hitの安定防御。'});
 patch('drill_guard',{tags:['連撃','耐久','単発支援'],damage:2,hits:3,block:5,primeSingleHitBuff:.06,desc:'2ダメージ×3＋防御5。使用後、次の1ヒット攻撃+6%。防御しながら重撃を準備する。'});
 patch('pulse_guard',{tags:['連撃','耐久','状態異常'],damage:2,hits:3,block:7,nextStatusFlat:1,desc:'2ダメージ×3＋防御7。使用後、次に付与する状態異常+1。防御から症状へ接続する。'});
 patch('v17_guard_barrage',{tags:['連撃','耐久','循環'],damage:2,hits:4,block:6,reserveSelfOnPrevAttack:true,desc:'2ダメージ×4＋防御6。直前も攻撃なら自身を次回提示へ予約する。攻防を提示循環へ繋ぐ。'});
 patch('v18_guard_volley',{tags:['連撃','耐久','防御'],damage:2,hits:4,block:8,nextBlockFlat:2,desc:'2ダメージ×4＋防御8。使用後、次の防御カードの防御+2。防御列を伸ばす弾幕。'});
 patch('v34_m_guardstorm',{tags:['連撃','耐久','敵行動'],damage:3,hits:4,block:8,statusIfEnemyBehavior:{type:'bleed',amount:2},desc:'3ダメージ×4＋防御8。敵が複数行動型なら出血2。高速敵への迎撃用。'});
 patch('v34_m_needlefort',{tags:['連撃','耐久','提示中'],damage:1,hits:8,block:9,presentEffect:{block:2},desc:'1ダメージ×8＋防御9。提示されている間は防御2。選ばなくても守りに寄与する針城。'});

 // v0.34内部正常化後に旧インフレ文章が残った系列を、実処理値と同期する。
 const sync={
  v34_d_scrap_lance:'14ダメージ＋防御10。一度捨てられた実体なら30ダメージ＋防御35%無視。',
  v34_d_refuse_wall:'防御20。このターン捨てられたカード1枚につき防御+70。',
  v34_d_shrapnel:'14ダメージ＋防御10＋火傷4。選ばれず捨てられた時、敵に14ダメージ。',
  v34_d_salvage_guard:'14ダメージ＋防御10。一度捨てられていれば防御14。最後の捨て札を山札上へ戻す。',
  v34_d_landfill:'14ダメージ＋防御10。このターン捨てられたカード1枚につき+6ダメージ。防御25%無視。',
  v34_d_afterimage:'防御20。一度捨てられていれば防御14。使用後は山札下へ戻る。',
  v34_g_citadel:'防御20。敵攻撃力60以上なら防御32。現在防御の22%を攻撃へ転用できる。',
  v34_g_retaliate:'防御20。敵攻撃力60以上なら防御32。このターン被ダメージ時、受けたダメージの90%を返す。',
  v34_g_intercept:'防御20。被ダメージ時に固定10ダメージを返す。敵攻撃力60以上なら固定24ダメージ。',
  v34_g_ram:'14ダメージ＋防御10。現在の防御の55%を追加ダメージに変換。防御25%無視。',
  v34_g_recovery:'防御20＋HP12回復。4ターン目以降は防御30。',
  v34_g_perfect:'防御20。このターン被ダメージ時、受けたダメージの100%を返す。',
  v34_b_crimson:'HP14を失い20ダメージ。HP半分以下なら36ダメージ。防御25%無視。',
  v34_b_pressure:'HP10を失い防御20。HP半分以下なら防御30。',
  v34_b_scarstorm:'HP12を失い4ダメージ×5。HP半分以下なら×7。防御25%無視。',
  v34_b_contract:'HP16を失う。次に使うカードの効果+170%。',
  v34_b_revenge:'HP8を失い防御20。このターン被ダメージ時、受けたダメージの85%を返す。',
  v34_b_terminal:'HP8を失い20ダメージ。HP半分以下なら36ダメージ。防御25%無視。',
  v34_c_reactor:'14ダメージ＋防御10。山札再構築1回につき+6ダメージ。再構築直後は防御35%無視。',
  v34_c_bastion:'防御20。山札再構築1回につき防御+8。',
  v34_c_reset:'防御20。捨て札と除外を再構築し、次カードの効果+30%。',
  v34_c_return:'14ダメージ＋防御10。再構築直後なら34ダメージ＋防御35%無視。',
  v34_c_loopguard:'防御20。再構築直後なら防御30。使用後は山札下へ戻る。',
  v34_c_wheel:'4ダメージ×4＋防御10。再構築直後なら×8＋防御35%無視。'
 };
 for(const [id,desc] of Object.entries(sync)){if(D.CARDS[id]){D.CARDS[id].desc=desc;if(!ids.includes(id))ids.push(id);}}
 D.V59_FINALFIX1_CARD_IDS=[...new Set(ids)];
 D.V59_SYNCED_DESC_IDS=Object.keys(sync);
})();
