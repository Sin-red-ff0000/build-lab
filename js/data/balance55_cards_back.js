'use strict';
(function(){
 const D=window.BuildLab.Data; const ids=[];
 const P=(id,x)=>{if(!D.CARDS[id])throw new Error('v0.55 missing '+id);Object.assign(D.CARDS[id],x);ids.push(id);};
 // 7/10 後半: v0.35 の「条件を満たすと同じ攻防札が倍率で伸びる」48枚を役割分離。
 // 提示位置: 位置ごとに次の行動先を変える。
 P('v35_p_center',{tags:['提示操作','中央','単発'],damage:8,block:4,armorPierce:.08,primeSingleHitBuff:.06,desc:'8ダメージ＋防御4。中央履歴を重撃へ渡し、次の1ヒット攻撃+6%。'});
 P('v35_p_wings',{tags:['提示操作','左右','連撃'],damage:3,hits:4,block:3,nextStatusFlat:1,desc:'3ダメージ×4＋防御3。左右から使うと次の状態異常付与+1。'});
 P('v35_p_shift',{tags:['提示操作','位置変更','耐久'],damage:0,hits:1,block:12,nextBlockFlat:1,desc:'防御12。位置変更を続けるための受け札。次の防御+1。'});
 P('v35_p_repeat',{tags:['提示操作','定点','単発'],damage:9,block:5,armorPierce:.12,primeSingleHitBuff:.04,desc:'9ダメージ＋防御5。同じ位置を維持する単発列の中継。次の1ヒット+4%。'});
 P('v35_p_wide',{tags:['提示操作','広域','連撃'],damage:2,hits:5,block:4,nextStatusFlat:1,desc:'2ダメージ×5＋防御4。提示4枚以上を状態異常準備へ変える。'});
 P('v35_p_narrow',{tags:['提示操作','狭域','単発'],damage:8,hits:1,block:5,armorPierce:.10,primeSingleHitBuff:.05,desc:'8ダメージ＋防御5。提示2枚以下を次の1ヒット+5%へ繋ぐ。'});
 // 連結: 成立そのものより、連結後にどの軸へ渡すかを分ける。
 P('v35_l_spear',{tags:['連結','単発'],damage:8,block:4,armorPierce:.10,primeSingleHitBuff:.05,desc:'8ダメージ＋防御4。連結から単発重撃へ繋ぎ、次の1ヒット+5%。'});
 P('v35_l_guard',{tags:['連結','耐久'],damage:0,hits:1,block:13,nextBlockFlat:1,desc:'防御13。連結中の守りを継続し、次の防御+1。'});
 P('v35_l_barrage',{tags:['連結','連撃'],damage:2,hits:5,block:4,nextStatusFlat:1,desc:'2ダメージ×5＋防御4。連結連撃を次の状態異常+1へ渡す。'});
 P('v35_l_cycle',{tags:['連結','循環','予約'],damage:7,hits:1,block:5,returnBottom:true,reserveSelfOnReshuffle:true,desc:'7ダメージ＋防御5。使用後は山札下へ。再構築時は自身を次回提示へ予約する。'});
 P('v35_l_status',{tags:['連結','状態異常','毒'],damage:5,hits:1,block:4,status:{type:'poison',amount:2},poisonAnchor:true,desc:'5ダメージ＋防御4＋毒2。連結ターンでも毒を定着させる。'});
 P('v35_l_bridge',{tags:['連結','混成','記録'],damage:6,hits:1,block:6,nextBlockFlat:1,nextStatusFlat:1,desc:'6ダメージ＋防御6。次の防御+1、次の状態異常+1。多タグを倍率ではなく橋渡しに使う。'});
 // 調律/変換: 強化済みカードをさらに倍率強化せず、役割をずらす。
 P('v35_c_tuned',{tags:['調律','単発'],damage:8,block:4,armorPierce:.08,primeSingleHitBuff:.05,desc:'8ダメージ＋防御4。調律から次の1ヒット+5%へ。'});
 P('v35_c_convert',{tags:['変換','耐久'],damage:0,hits:1,block:13,nextBlockFlat:1,desc:'防御13。役割変換後の防御列を継続し、次の防御+1。'});
 P('v35_c_dual',{tags:['調律','変換','記録'],damage:6,hits:1,block:6,nextStatusFlat:1,desc:'6ダメージ＋防御6。調律と変換を重ねた履歴を状態異常準備へ渡す。'});
 P('v35_c_barrage',{tags:['調律','連撃'],damage:2,hits:5,block:4,nextStatusFlat:1,desc:'2ダメージ×5＋防御4。調律連撃の後、次の状態異常+1。'});
 P('v35_c_cycle',{tags:['変換','循環'],damage:6,hits:1,block:6,returnBottom:true,nextBlockFlat:1,desc:'6ダメージ＋防御6。使用後は山札下へ戻り、次の防御+1。'});
 P('v35_c_matrix',{tags:['調律','変換','混成'],damage:6,hits:1,block:6,primeSingleHitBuff:.03,nextBlockFlat:1,desc:'6ダメージ＋防御6。次の1ヒット+3%、次の防御+1。強化層を万能倍率にしない。'});
 // 構築規格: デッキ条件を直接火力倍率ではなく運用報酬へ。
 P('v35_a_single',{tags:['構築規格','単独','単発'],damage:8,block:4,primeSingleHitBuff:.06,desc:'8ダメージ＋防御4。同名1枚構築で使う単発中継。次の1ヒット+6%。'});
 P('v35_a_duplicate',{tags:['構築規格','重複','連撃'],damage:2,hits:4,block:4,reserveSelfOnPrevAttack:true,desc:'2ダメージ×4＋防御4。直前も攻撃なら自身を次回提示へ予約する。重複構築の回転役。'});
 P('v35_a_hybrid',{tags:['構築規格','混成'],damage:6,hits:1,block:6,nextStatusFlat:1,desc:'6ダメージ＋防御6。多タグ構築を次の状態異常+1へ接続する。'});
 P('v35_a_doctrine',{tags:['構築規格','耐久'],damage:0,hits:1,block:14,nextBlockFlat:1,desc:'防御14。規格構築の純防御枠。次の防御+1。'});
 P('v35_a_variation',{tags:['構築規格','変奏','非選択'],damage:7,hits:1,block:4,onDiscard:{block:3},desc:'7ダメージ＋防御4。見送ると防御3。毎回違う選択を取る構築の逃げ道。'});
 P('v35_a_cycle',{tags:['構築規格','循環'],damage:6,hits:1,block:5,returnBottom:true,desc:'6ダメージ＋防御5。使用後は山札下へ戻る。規格を維持しながら巡回する。'});
 // 敵解析: 特殊個体の数を火力倍率へせず、敵行動への対応手段を変える。
 P('v35_x_trait',{tags:['特殊個体','解析','単発'],damage:8,block:4,armorPierce:.10,desc:'8ダメージ＋防御4。特殊個体向けの安定した単発解析札。'});
 P('v35_x_behavior',{tags:['複合挙動','解析','耐久','敵行動'],damage:0,hits:1,block:12,counter:.20,desc:'防御12、反撃20%。複合挙動の多行動を反応機会へ変える。'});
 P('v35_x_apex',{tags:['特殊個体','複合挙動','解析','記録'],damage:6,hits:1,block:6,nextBlockFlat:1,desc:'6ダメージ＋防御6。頂点個体の観測を次の防御+1へ渡す。'});
 P('v35_x_barrage',{tags:['複合挙動','解析','連撃','出血'],damage:2,hits:5,block:3,status:{type:'bleed',amount:2},desc:'2ダメージ×5＋防御3＋出血2。多行動敵を出血で咎める。'});
 P('v35_x_clean',{tags:['解析','単発','標準試験'],damage:10,hits:1,block:3,primeSingleHitBuff:.04,desc:'10ダメージ＋防御3。特殊個体なしでは素直な単発札として働き、次の1ヒット+4%。'});
 P('v35_x_total',{tags:['特殊個体','複合挙動','解析','混成'],damage:5,hits:1,block:6,nextStatusFlat:1,desc:'5ダメージ＋防御6。複数解析軸を次の状態異常+1へ接続する。'});
 // ルーン/アルカナ: 強化層の重ね掛けを倍率化せず、未強化/重層で別用途。
 P('v35_m_rune',{tags:['ルーン','単発'],damage:8,block:4,primeSingleHitBuff:.05,desc:'8ダメージ＋防御4。ルーン札を次の1ヒット+5%へ繋ぐ。'});
 P('v35_m_arcana',{tags:['アルカナ','耐久'],damage:0,hits:1,block:13,nextBlockFlat:1,desc:'防御13。アルカナ運用中の純防御枠。次の防御+1。'});
 P('v35_m_match',{tags:['アルカナ','記録'],damage:6,hits:1,block:6,nextStatusFlat:1,desc:'6ダメージ＋防御6。象意一致を次の状態異常+1へ渡す。'});
 P('v35_m_barrage',{tags:['ルーン','連撃'],damage:2,hits:5,block:4,nextStatusFlat:1,desc:'2ダメージ×5＋防御4。刻印連撃から次の状態異常+1。'});
 P('v35_m_plain',{tags:['アルカナ','単独','非選択'],damage:9,hits:1,block:3,onDiscard:{block:3},desc:'9ダメージ＋防御3。未強化のまま見送ると防御3。白紙であることを選択余地にする。'});
 P('v35_m_layered',{tags:['ルーン','アルカナ','混成'],damage:5,hits:1,block:6,primeSingleHitBuff:.03,nextBlockFlat:1,desc:'5ダメージ＋防御6。重層化を火力倍率にせず、次の1ヒット+3%と防御+1へ分散する。'});
 // 元素: 五元素を同じ「条件付き攻防倍率」にしない。
 P('v35_e_fire',{tags:['元素','火','火傷','単発'],damage:6,hits:1,block:3,status:{type:'burn',amount:2},burnRefresh:1,desc:'6ダメージ＋防御3＋火傷2。火傷中なら再点火+1。火は燃焼維持。'});
 P('v35_e_wind',{tags:['元素','風','連撃','予約'],damage:2,hits:4,block:3,reserveSelfOnPrevAttack:true,desc:'2ダメージ×4＋防御3。直前も攻撃なら自身を予約。風は提示回転。'});
 P('v35_e_water',{tags:['元素','水','循環','回復'],damage:5,hits:1,block:5,heal:2,returnBottom:true,desc:'5ダメージ＋防御5＋HP2回復。使用後は山札下へ。水は循環と回復。'});
 P('v35_e_earth',{tags:['元素','土','耐久'],damage:4,hits:1,block:11,nextBlockFlat:1,desc:'4ダメージ＋防御11。次の防御+1。土は防御列の維持。'});
 P('v35_e_aether',{tags:['元素','エーテル','記録'],damage:6,hits:1,block:5,nextStatusFlat:1,desc:'6ダメージ＋防御5。次の状態異常+1。エーテルは異軸を接続する。'});
 P('v35_e_prism',{tags:['元素','多元素','変質'],damage:5,hits:1,block:5,primeSingleHitBuff:.03,nextBlockFlat:1,desc:'5ダメージ＋防御5。次の1ヒット+3%、次の防御+1。多元素は万能倍率ではなく分岐補助。'});
 // 錬成: 条件達成前から強い札をやめ、生成/在庫/反応/消費で用途を分離。
 P('v35_q_opus',{tags:['錬成','上位錬成','単発'],damage:8,hits:1,block:3,armorPierce:.10,primeSingleHitBuff:.05,desc:'8ダメージ＋防御3。上位錬成から単発重撃へ繋ぐ。次の1ヒット+5%。'});
 P('v35_q_stock',{tags:['錬成','在庫','耐久'],damage:0,hits:1,block:13,nextBlockFlat:1,desc:'防御13。在庫を温存する構築の受け札。次の防御+1。'});
 P('v35_q_react',{tags:['錬成','反応','連撃','状態異常'],damage:2,hits:5,block:3,nextStatusFlat:1,desc:'2ダメージ×5＋防御3。反応履歴を次の状態異常+1へ渡す。'});
 P('v35_q_spend',{tags:['錬成','消費','防御消費'],damage:7,hits:1,block:4,primeSingleHitBuff:.04,desc:'7ダメージ＋防御4。錬成物を使う構築の単発中継。次の1ヒット+4%。'});
 P('v35_q_shell',{tags:['錬成','上位錬成','耐久'],damage:0,hits:1,block:14,nextBlockFlat:1,desc:'防御14。上位錬成物を作った後の純防御枠。次の防御+1。'});
 P('v35_q_matrix',{tags:['錬成','反応','記録'],damage:5,hits:1,block:6,nextStatusFlat:1,desc:'5ダメージ＋防御6。反応回数を直接倍率にせず、次の状態異常+1へ接続する。'});
 // v0.35 カード固有の旧1.5〜1.7倍ルールを撤去。条件はカードの運用先を選ぶために残し、巨大倍率にはしない。
 const rules={}; for(const id of ids) rules[id]=[{when:{},mult:1.0}]; D.V35_CARD_RULES=rules;
 D.V55_REDESIGNED_CARD_IDS=ids;
 D.V55_FAMILY_BUCKETS={position:ids.filter(x=>x.startsWith('v35_p_')),link:ids.filter(x=>x.startsWith('v35_l_')),calibration:ids.filter(x=>x.startsWith('v35_c_')),architecture:ids.filter(x=>x.startsWith('v35_a_')),analysis:ids.filter(x=>x.startsWith('v35_x_')),mystic:ids.filter(x=>x.startsWith('v35_m_')),element:ids.filter(x=>x.startsWith('v35_e_')),alchemy:ids.filter(x=>x.startsWith('v35_q_'))};
})();
