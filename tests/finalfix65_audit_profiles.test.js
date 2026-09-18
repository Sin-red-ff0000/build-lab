'use strict';
const fs=require('fs'),path=require('path');global.window=global;global.localStorage={getItem(){return null},setItem(){},removeItem(){}};
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const m of html.matchAll(/<script src="([^"?]+)/g)){const f=m[1];if(f.includes('/ui/')||f.endsWith('app.js'))continue;require(path.join(root,f));}
const D=BuildLab.Data, A=D.V65_AUDIT_INTEGRITY, P=D.V65_AUDIT_PROFILE;
function ok(x,msg){if(!x)throw new Error(msg)}
ok(A&&A.multiSeedRequired&&A.seeds===3,'3シード監査が必須');
ok(Array.isArray(A.deckModes)&&A.deckModes.includes('hybrid')&&A.deckModes.includes('concept')&&A.deckModes.includes('trial'),'3探索モード必須');
ok(P.echo_singleton?.singleton,'孤響型のsingleton制約');
ok(P.architect_specialist?.preferSingleTag,'専門設計型の単タグ優先');
ok(P.combo_precision?.minHits===5,'精密型の5hit条件');
ok(P.combo_catalytic?.minHits===3,'触媒型の3hit条件');
ok(P.catalyst_spectrum?.preferStatus,'多相型の状態異常優先');
ok(P.risk_crisis?.preferSelfDamage,'臨界型の自傷優先');
ok(P.relay_direction?.preferLink,'順送型の連結優先');
ok(P.archive_salvage?.preferDiscard,'回収型の捨て札優先');
ok(P.vector_flux?.preferPosition,'流動型の位置優先');
const tool=fs.readFileSync(path.join(root,'tools/endgame65_multiseed_audit.js'),'utf8');
ok(tool.includes("['hybrid','concept','trial']"),'監査器が3構築候補を探索');
ok(tool.includes('V65_AUDIT_PROFILE'),'監査器がスタイルプロファイルを参照');
ok(tool.includes('__v65AuditBonus'),'監査プロファイルがカード選択スコアへ実際に反映される');
console.log('finalfix65 audit profiles passed');
