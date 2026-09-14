'use strict';
(function(){
  const BL=window.BuildLab,A=BL.Data.ALCHEMY;
  const add=(obj,k,n)=>obj[k]=(obj[k]||0)+n;
  function create(config){return {config:A.normalize(config),stock:Object.fromEntries(Object.keys(A.materials).map(k=>[k,0])),made:{},used:{},reactions:{},missing:{},pending:[],cards:0,spent:{}};}
  function note(b,s){b.log.push('T'+b.turn+'：錬成・'+s);}
  function react(b){const a=b.alchemy;if(!a?.config.enabled)return;
    const reserved={};a.missing={};
    for(const id of a.config.recipes){const r=A.recipes.find(x=>x.id===id);const count=Math.min(...Object.entries(r.input).map(([k,n])=>Math.floor(Math.max(0,a.stock[k]-(reserved[k]||0))/n)));
      if(count>0){for(const [k,n] of Object.entries(r.input))a.stock[k]-=n*count;add(a.stock,r.output,count);add(a.made,r.output,count);add(a.reactions,id,count);note(b,r.name+' ×'+count+' → '+A.materials[r.output]+' +'+count);}
      const missing=[];for(const [k,n] of Object.entries(r.input)){const free=Math.max(0,a.stock[k]-(reserved[k]||0));if(free<n)missing.push(A.materials[k]+(n-free));add(reserved,k,Math.min(n,free));}if(missing.length)a.missing[id]=missing.join('・');
    }
  }
  function supply(b){const a=b.alchemy;if(!a?.config.enabled)return;for(const [k,n] of Object.entries(a.config.allocation))add(a.stock,k,n);note(b,'配分に応じて元素を供給');react(b);}
  function apply(b,id,e,api){if(e.damage)api.damage(e.damage);if(e.block)b.player.block+=e.block;if(e.heal)api.heal(e.heal);if(e.water)add(b.alchemy.stock,'water',e.water);note(b,A.materials[id]+' 発動');}
  function consume(b,id,event){const a=b.alchemy;if(a.config.hold.includes(id)||a.stock[id]<1||a.spent[id]===b.turn)return false;const e=A.effects[id];if(e.event!==event)return false;if(e.heal&&b.player.hp>=b.player.maxHp)return false;if(e.period&&a.cards%e.period!==0)return false;a.stock[id]--;a.spent[id]=b.turn;add(a.used,id,1);return true;}
  function turn(b,api){const a=b.alchemy;if(!a?.config.enabled)return;
    const ready=a.pending.filter(p=>p.due<=b.turn);a.pending=a.pending.filter(p=>p.due>b.turn);for(const p of ready){apply(b,p.id,A.effects[p.id],api);if(b.enemy.hp<=0)return;}
    for(const [id,e] of Object.entries(A.effects))if(consume(b,id,'turn'))a.pending.push({id,due:b.turn+e.delay});
  }
  function beforeCard(b,c,api){const a=b.alchemy;if(!a?.config.enabled)return 0;a.cards++;let bonus=0;const hits=c.hits||0;
    for(const [id,e] of Object.entries(A.effects)){const match=e.event==='card'||(hits>0&&e.event==='attack'&&!e.damage)||(hits===1&&e.event==='single');if(match&&consume(b,id,e.event)){bonus+=e.bonus||0;apply(b,id,e,api);}}
    return bonus;
  }
  function afterCard(b,c,api){const a=b.alchemy;if(!a?.config.enabled||!(c.hits>0||c.damage!=null))return;for(const [id,e] of Object.entries(A.effects))if(e.event==='attack'&&e.damage&&consume(b,id,'attack'))apply(b,id,e,api);}
  function beforeHit(b,api){const a=b.alchemy;if(!a?.config.enabled)return;for(const [id,e] of Object.entries(A.effects))if(consume(b,id,'hit'))apply(b,id,e,api);}
  function summary(b){const a=b?.alchemy;if(!a?.config.enabled)return '錬成：未使用';return Object.entries(a.stock).filter(([,n])=>n>0).map(([id,n])=>A.materials[id]+' '+n).join(' / ')||'材料・錬成物なし';}
  BL.Alchemy={create,react,supply,turn,beforeCard,afterCard,beforeHit,summary};
})();
