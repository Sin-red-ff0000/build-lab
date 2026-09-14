'use strict';
const path=require('path');global.window=global;
const root=path.resolve(__dirname,'..');
for(const f of ['js/data/gameData.js','js/data/protocols.js','js/data/tunings.js','js/data/conversions.js','js/data/chapter3.js','js/data/expansion08.js','js/data/expansion09.js','js/data/doctrines.js','js/data/characterStyles.js','js/data/expansion10.js','js/data/expansion11.js','js/data/expansion12.js','js/data/enemyBehaviors.js','js/data/expansion13.js','js/data/expansion14.js','js/data/expansion17.js','js/data/expansion18.js','js/data/expansion19.js','js/data/runes.js','js/data/arcana.js','js/data/expansion20.js','js/data/alchemy.js','js/data/balance22.js'])require(path.join(root,f));
const D=global.BuildLab.Data;
function fail(x){throw new Error(x);}
function canonical(c){const out={};for(const k of Object.keys(c).sort())if(!['name','tags','desc'].includes(k))out[k]=c[k];return JSON.stringify(out);}
const groups={};for(const [id,c] of Object.entries(D.CARDS)){const key=canonical(c);(groups[key]??=[]).push(id);}
const dup=Object.values(groups).filter(a=>a.length>1);if(dup.length)fail('完全同効果カードが残っています: '+dup.map(a=>a.join('/')).join(', '));
if(D.BALANCE22?.audited?.cards!==455||D.BALANCE22?.audited?.relics!==305||D.BALANCE22?.audited?.protocols!==113)fail('監査対象数が不一致');
if((D.BALANCE22.patchedCards||[]).length<50)fail('カード改修数が不足');
if((D.BALANCE22.patchedRelics||[]).length<10)fail('遺物改修数が不足');
if((D.BALANCE22.patchedProtocols||[]).length<15)fail('プロトコル改修数が不足');
if(D.CARDS.toxin_saw.damageIfStatus!=null||D.CARDS.toxin_saw.damageIfPoison!==5)fail('毒鋸の条件分岐が未修正');
if(D.CARDS.flash_chain.v22Route!=='exclude'||D.CARDS.v17_salvage_loop.v22Route!=='bottom')fail('カード使用後ルート分岐が未設定');
if(D.V14_PROTOCOL_RULES.v17_p_discard.double<=D.V14_PROTOCOL_RULES.v17_p_discard.single)fail('IV規格が複合軸化されていない');
if(D.V14_PROTOCOL_RULES.v18_p_discard.miss>=.9)fail('V規格の単一軸リスクが不足');
if(!D.V22_RELIC_RULES?.center_compass||!D.V22_RELIC_RULES?.v20_two_behavior)fail('遺物の条件分岐ルールが不足');
console.log('PASS balance22_audit.test.js',D.BALANCE22);
