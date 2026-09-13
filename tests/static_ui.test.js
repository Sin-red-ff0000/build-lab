'use strict';
const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
const jsFiles=[];function walk(dir){for(const n of fs.readdirSync(dir)){const p=path.join(dir,n),st=fs.statSync(p);st.isDirectory()?walk(p):n.endsWith('.js')&&jsFiles.push(p);}}walk(path.join(root,'js'));
const refs=[];for(const f of jsFiles){const s=fs.readFileSync(f,'utf8');for(const m of s.matchAll(/getElementById\(['"]([^'"]+)['"]\)/g))refs.push([m[1],path.relative(root,f)]);}
const missing=refs.filter(([id])=>!ids.has(id));if(missing.length)throw new Error('Missing DOM ids: '+JSON.stringify(missing));
const css=fs.readFileSync(path.join(root,'styles/components.css'),'utf8');if(!/\.deck-chip\{[^}]*color:/s.test(css))throw new Error('deck-chip text color is not explicitly defined');
console.log(`PASS static_ui.test.js (${refs.length} DOM refs checked)`);
