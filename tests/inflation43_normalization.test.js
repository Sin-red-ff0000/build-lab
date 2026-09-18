'use strict';
const fs=require('fs'),path=require('path');global.window=global;global.localStorage={getItem:()=>null,setItem:()=>{},removeItem:()=>{}};
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const m of html.matchAll(/<script src="([^"?]+)/g)){const f=m[1];if(f.includes('/ui/')||f.endsWith('app.js'))continue;require(path.join(root,f));}
const D=BuildLab.Data, ids=Object.keys(D.CARDS).filter(id=>/^v35_[plcaxmeq]_/.test(id));
function ok(v,msg){if(!v)throw new Error(msg)}
ok(ids.length===48,'expected 48 v35 support cards, got '+ids.length);
for(const id of ids){const c=D.CARDS[id];const d=Number(c.damage||0),b=Number(c.block||0),h=Number(c.hits||1),p=Number(c.armorPierce||0);
  ok(b<=22,id+' unconditional block inflation '+b);
  ok(p<=.25,id+' unconditional pierce inflation '+p);
  if(h>=4)ok(d<=5,id+' multi-hit per-hit inflation '+d+'x'+h); else ok(d<=24,id+' damage inflation '+d);
  if(d>0&&b>0)ok(d<=14 && b<=12,id+' role-compressed attack+block too high '+d+'/'+b);
}
const narrow=D.CARDS.v35_p_narrow;ok(narrow.damage<=14&&narrow.block<=12,'narrow decision must not be unconditional 112/105');
console.log('PASS inflation43_normalization.test.js');
