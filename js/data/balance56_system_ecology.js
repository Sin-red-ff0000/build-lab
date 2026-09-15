'use strict';
(function(){
  const BL=window.BuildLab,D=BL.Data;
  const capMult=v=>typeof v==='number'&&v>1.12?1.12:v;
  const floorMiss=v=>typeof v==='number'&&v<0.88?0.88:v;
  const roleOf=x=>{const t=x.tags||[];if(t.some(v=>/錬成|元素/.test(v)))return '資源工程';if(t.some(v=>/提示|捨て札/.test(v)))return '選択・提示';if(t.some(v=>/循環|回収/.test(v)))return '循環・復帰';if(t.some(v=>/状態異常|毒|火傷|出血|凍傷/.test(v)))return '症状運用';if(t.some(v=>/自傷|瀕死/.test(v)))return 'HP履歴';if(t.some(v=>/連結/.test(v)))return '接続履歴';if(t.some(v=>/耐久|反撃/.test(v)))return '防御運用';if(t.some(v=>/調律|変換/.test(v)))return '役割変換';return '条件選択';};
  const normalizeDesc=(x,role)=>{let s=String(x.desc||'');s=s.replace(/\+(\d+)%/g,(m,n)=>`+${Math.min(12,+n)}%`).replace(/\+(\d+)％/g,(m,n)=>`+${Math.min(12,+n)}％`);if(!s.includes('【v0.56役割】'))s+=` 【v0.56役割】${role}。運用焦点：${x.name}。高倍率そのものではなく、この条件を満たす構築経路を選ぶための枠。`;x.desc=s;};
  const audit={relics:0,protocols:0,tunings:0,rulesCapped:0,roles:{}};
  for(const [kind,obj] of [['relics',D.RELICS],['protocols',D.PROTOCOLS],['tunings',D.TUNINGS]])for(const x of Object.values(obj||{})){const role=roleOf(x);x.v56Role=role;normalizeDesc(x,role);audit[kind]++;audit.roles[role]=(audit.roles[role]||0)+1;}
  const maps=Object.keys(D).filter(k=>/^V\d+_(RELIC|PROTOCOL|TUNING)_RULES$/.test(k));
  const walk=o=>{if(!o||typeof o!=='object')return;for(const [k,v] of Object.entries(o)){if(v&&typeof v==='object')walk(v);else if(k==='mult'||k==='hit'||k==='single'||k==='double'){const nv=capMult(v);if(nv!==v){o[k]=nv;audit.rulesCapped++;}}else if(k==='miss'){const nv=floorMiss(v);if(nv!==v){o[k]=nv;audit.rulesCapped++;}}}};
  for(const k of maps)walk(D[k]);
  // Base tuning/protocol descriptions are now truthful to the bounded numerical layer.
  const patch={
    overload:'このカードを使用した時の基本効果+12%。使用後は次の山札再構築まで除外される。',
    rapid:'3ヒット以上なら基本効果+12%。条件外では-8%。',guard:'防御・複合なら基本効果+12%。条件外では-10%。',brink:'HP半分以下なら基本効果+12%。条件外では-10%。',
    fortify_calibration:'防御カードの基本効果+12%。攻撃カードの基本ダメージ-6%。',multihit_accelerator:'3ヒット以上のカードの基本効果+12%。1ヒット攻撃のダメージ-8%。',scar_exchange:'自傷を持つカードの基本効果+12%。戦闘開始時の最大HP-8。',cycle_prime:'山札再構築直後の最初のカードの基本効果+12%。戦闘開始時の最大HP-5。',center_drive:'中央枠で使うカードの基本効果+12%。左右枠では-8%。',narrow_scan:'毎ターン提示枚数-1。選んだカードの基本効果+12%。',reserve_drive:'持ち越しカードの基本効果+12%。通常提示カードは-5%。'
  };
  for(const [id,desc] of Object.entries(patch)){const x=D.TUNINGS[id]||D.PROTOCOLS[id];if(x)x.desc=desc+` 【v0.56役割】${x.v56Role||roleOf(x)}。`;}
  D.V56_SYSTEM_AUDIT=audit;
  D.V56_SYSTEM_ROLE_COUNTS=audit.roles;
})();
