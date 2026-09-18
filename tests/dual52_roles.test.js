'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert');global.window=global;const mem={};global.localStorage={getItem:k=>mem[k]??null,setItem:(k,v)=>mem[k]=String(v),removeItem:k=>delete mem[k]};
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const m of html.matchAll(/<script src="([^"?]+)/g)){const f=m[1];if(f.includes('/ui/')||f.endsWith('app.js'))continue;require(path.join(root,f));}
const BL=global.BuildLab,D=BL.Data,ids=D.V52_DUAL_FACE_IDS;assert.equal(ids.length,12);for(const id of ids){assert(D.CARDS[id]?.dualFace,id);assert(D.DUAL_FACE_CARDS[id]?.front&&D.DUAL_FACE_CARDS[id]?.back,id);}
// 表裏は単純な同役割の数値上昇にしない。
for(const id of ids){const x=D.DUAL_FACE_CARDS[id],a=x.front,b=x.back;const sig=z=>[z.kind,z.hits||0,!!z.status,!!z.vanishAfterUse,!!z.reserveSelfAfterUse,!!z.returnBottom].join('|');assert.notEqual(sig(a),sig(b),id+' front/back role identical');assert((b.damage||0)<30&&(b.block||0)<30,id+' inflated back face');}
assert(D.DUAL_FACE_CARDS.v52_dual_patience.check({events:{byCard:{u:{counts:{notChosen:2}}}}},{uid:'u'}));
assert(D.DUAL_FACE_CARDS.v52_dual_return.check({events:{byCard:{u:{counts:{returnedFromVanish:1}}}}},{uid:'u'}));
assert(D.DUAL_FACE_CARDS.v52_dual_reserve.check({events:{byCard:{u:{counts:{reservationArrived:2}}}}},{uid:'u'}));
assert(D.DUAL_FACE_CARDS.v52_dual_pulse.check({hpHistory:{directionSwitches:2}},{}));
assert(D.DUAL_FACE_CARDS.v52_dual_record.check({events:{counts:{recordReplayed:1}}},{}));
const rewarded=new Set(D.UNLOCKS.flatMap(u=>u.reward||[]));for(const id of ids)assert(rewarded.has(id),'missing unlock '+id);
console.log('dual52_roles.test.js: PASS');
