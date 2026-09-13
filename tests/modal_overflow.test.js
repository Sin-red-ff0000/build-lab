 'use strict';
const fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8'),css=fs.readFileSync(path.join(root,'styles/components.css'),'utf8'),mobile=fs.readFileSync(path.join(root,'styles/mobile.css'),'utf8'),app=fs.readFileSync(path.join(root,'js/app.js'),'utf8');
const assert=(x,m)=>{if(!x)throw new Error(m)};
assert(html.includes('id="modalBody" class="modal-body"'),'modal body scroll container missing');assert(html.includes('class="modal-footer"'),'modal footer missing');
assert(/\.modal-card\{[^}]*display:flex[^}]*flex-direction:column[^}]*overflow:hidden/s.test(css),'desktop modal flex/overflow shell missing');assert(/\.modal-body\{[^}]*overflow-y:auto/s.test(css),'modal body scrolling missing');assert(/\.modal-footer\{[^}]*flex:0 0 auto/s.test(css),'modal fixed footer missing');
assert(mobile.includes('.modal-footer')&&mobile.includes('env(safe-area-inset-bottom)'),'mobile modal safe footer missing');assert(mobile.includes('z-index:120'),'mobile modal must sit above bottom nav');
assert(app.includes('body.scrollTop=0'),'modal scroll reset missing');assert(app.includes("e.key==='Escape'"),'escape close missing');
console.log('PASS modal_overflow.test.js');
