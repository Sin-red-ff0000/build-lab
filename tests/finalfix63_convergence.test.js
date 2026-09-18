'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert');global.window=global;global.localStorage={getItem(){return null},setItem(){},removeItem(){}};const root=path.resolve(__dirname,'..');const html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const m of html.matchAll(/<script src="([^"?]+)/g)){const f=m[1];if(f.includes('/ui/')||f.endsWith('app.js'))continue;require(path.join(root,f));}
const D=BuildLab.Data,E=D.ENDGAME58,C=D.CARDS;
assert(parseFloat(E.version)>=0.63);
assert(C.v34_d_shrapnel.damage<=6&&C.v34_d_shrapnel.block===0&&C.v34_d_shrapnel.status.amount<=2,'散開破片が万能攻防症状札のまま');
assert(C.catastrophe_protocol.block===0&&C.catastrophe_protocol.damage<=2,'災厄プロトコルが攻防圧縮のまま');
assert(D.V63_CONVERGENCE.multiSeedRequired===true&&D.V63_CONVERGENCE.seeds>=3,'複数シード監査ゲートが未設定');
for(const t of Object.values(E.trials)){assert(t.enemy.hp>=2.8&&t.enemy.hp<=4.5,`${t.name}: HP校正範囲外`);assert(t.enemy.atk<=1.2,`${t.name}: 攻撃が数値壁化`);}
console.log('PASS finalfix63_convergence.test.js');
