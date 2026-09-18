'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert');global.window=global;global.localStorage={getItem:()=>null,setItem:()=>{},removeItem:()=>{}};
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const m of html.matchAll(/<script src="([^"?]+)/g)){const f=m[1];if(f.includes('/ui/')||f.endsWith('app.js'))continue;require(path.join(root,f));}
const BL=BuildLab,D=BL.Data,s=BL.Store.state;
// Deterministic legal deck from first available cards.
const rules=D.getDeckRules?D.getDeckRules(s):{deckSize:10};const ids=Object.keys(D.CARDS).filter(id=>BL.Unlock?.isCardUnlocked?BL.Unlock.isCardUnlocked(s,id):true);s.deck=[];for(let i=0;i<rules.deckSize;i++)s.deck.push(ids[i%ids.length]);
const r=BL.Battle.create(false);assert(!r.error,r.error);const b=BL.Battle.current;
assert(b.events&&b.events.counts&&b.events.byCard,'event state missing');
assert.strictEqual(BL.Battle.eventCount('presented'),b.prompt.length,'presented count mismatch');
const shown=[...b.prompt],chosen=shown[0];BL.Battle.play(0);
assert(BL.Battle.eventCount('selected')>=1,'selected event missing');assert(BL.Battle.eventCount('used')>=1,'used event missing');
assert(BL.Battle.eventCount('notChosen')>=Math.max(0,shown.length-1),'notChosen events missing');
assert(BL.Battle.eventCount('presented',chosen.uid)>=1,'per-card presented history missing');assert(BL.Battle.eventCount('selected',chosen.uid)>=1,'per-card selected history missing');
BL.Battle.emitEvent('transform',{uid:chosen.uid,cardId:chosen.cardId,from:'front',to:'back'});assert.strictEqual(BL.Battle.eventCount('transform',chosen.uid),1);
assert(BL.Battle.recentEvents().length>0&&BL.Battle.recentEvents('transform').length===1,'recent event query failed');
for(const type of ['presented','selected','notChosen','used'])assert(b.events.counts[type]>=0);
console.log('PASS events49_core.test.js');
