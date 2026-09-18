'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert');global.window=global;global.localStorage={getItem:()=>null,setItem:()=>{},removeItem:()=>{}};const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const m of html.matchAll(/<script src="([^"?]+)/g)){const f=m[1];if(f.includes('/ui/')||f.endsWith('app.js'))continue;require(path.join(root,f));}const BL=BuildLab;
const ids=['vanishing_edge','vanishing_wall','return_from_void','v50_patient_edge','abandoned_aegis','dormant_ember','watchful_plate','sighting_lens','toxic_observer'];
ids.forEach(id=>assert(BL.Data.CARDS[id],`missing ${id}`));
assert(BL.Data.CARDS.vanishing_edge.vanishAfterUse,'vanish flag missing');
assert(BL.Data.CARDS.v50_patient_edge.damagePerNotChosen,'non-choice growth missing');
assert(BL.Data.CARDS.watchful_plate.presentedBlock,'presented passive missing');
const s=BL.Store.state;const rules=BL.Data.getDeckRules?BL.Data.getDeckRules(s):{deckSize:10};s.deck=Array(rules.deckSize).fill('wall');s.deck[0]='vanishing_edge';s.deck[1]='v50_patient_edge';s.deck[2]='watchful_plate';s.character='standard';
const r=BL.Battle.create(false);assert(!r.error,r.error);const b=BL.Battle.current;
// deterministic direct prompt to verify per-instance notChosen history and vanish pile integrity.
const edge=[...b.draw,...b.prompt].find(x=>x.cardId==='vanishing_edge');assert(edge);
BL.Battle.emitEvent('notChosen',{uid:edge.uid,cardId:edge.cardId});BL.Battle.emitEvent('notChosen',{uid:edge.uid,cardId:edge.cardId});
assert.strictEqual(BL.Battle.eventCount('notChosen',edge.uid),2);
assert(Array.isArray(b.vanished),'vanished pile missing');
assert(BL.Battle.invariant().ok,'pile invariant broken by vanished pile');
// Force a legal prompt containing the vanish card, then verify it leaves the reshuffle cycle.
let ei=b.draw.findIndex(x=>x.cardId==='vanishing_edge');if(ei<0)ei=b.prompt.findIndex(x=>x.cardId==='vanishing_edge');let vx;if(ei>=0&&b.draw[ei]?.cardId==='vanishing_edge')vx=b.draw.splice(ei,1)[0];else {const pi=b.prompt.findIndex(x=>x.cardId==='vanishing_edge');vx=b.prompt.splice(pi,1)[0];}
const fillers=[];while(fillers.length<2&&b.draw.length)fillers.push(b.draw.shift());b.prompt=[vx,...fillers];BL.Battle.play(0);assert(b.vanished.some(x=>x.uid===vx.uid),'used vanish card did not enter vanished pile');assert(BL.Battle.eventCount('vanished',vx.uid)>=1,'vanished event missing');

console.log('PASS mechanics50_vanish_notchosen_presented.test.js');
