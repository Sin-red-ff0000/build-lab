'use strict';
const path=require('path');global.window=global;require(path.resolve(__dirname,'../js/data/gameData.js'));
const D=global.BuildLab.Data;function assert(x,m){if(!x)throw new Error(m);}
const core=['捨て札','連撃','状態異常','耐久','自傷','循環'];
for(const tag of core){const n=D.BASE_CARD_IDS.filter(id=>D.CARDS[id].tags.includes(tag)).length;assert(n>=12,`${tag}の初期カードが少なすぎます: ${n}`);}
const bridges=D.BASE_CARD_IDS.filter(id=>D.CARDS[id].tags.length>=2).length;assert(bridges>=48,`橋渡しカードが少なすぎます: ${bridges}`);
for(const tag of core){const n=D.BASE_RELIC_IDS.filter(id=>D.RELICS[id].tags.includes(tag)).length;assert(n>=4,`${tag}の初期遺物が少なすぎます: ${n}`);}
console.log('PASS content_balance.test.js',Object.fromEntries(core.map(tag=>[tag,D.BASE_CARD_IDS.filter(id=>D.CARDS[id].tags.includes(tag)).length])),`bridges=${bridges}`);
