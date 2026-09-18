'use strict';
const fs=require('fs'),path=require('path');global.window=global;global.localStorage={getItem:()=>null,setItem:()=>{},removeItem:()=>{}};
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const m of html.matchAll(/<script src="([^"?]+)/g)){const f=m[1];if(f.includes('/ui/')||f.endsWith('app.js'))continue;require(path.join(root,f));}
const D=BuildLab.Data,ids=Object.keys(D.CARDS).filter(id=>/^v34_[dmsg bc]_/.test(id.replace('v34_b_','v34_b_'))||/^v34_[dmsgbc]_/.test(id));
function ok(v,m){if(!v)throw new Error(m)}
for(const id of ids){const c=D.CARDS[id],d=+c.damage||0,b=+c.block||0,h=+c.hits||1;ok(b<=20,id+' base block '+b);if(h>=4)ok(d<=4,id+' per-hit '+d);else ok(d<=20,id+' base damage '+d);ok((+c.lowHpDamage||0)<=36,id+' lowHpDamage');ok((+c.lowHpBlock||0)<=30,id+' lowHpBlock');}
console.log('PASS inflation43_core_normalization.test.js ('+ids.length+' v34 cards)');
