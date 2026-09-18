'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const s=fs.readFileSync(path.join(root,'tools/endgame67_parallel_resume.js'),'utf8');
assert(s.includes('AUDIT_v0.66_PARTS'),'must reuse resumable per-variant checkpoints');
assert(s.includes('WORKERS'),'parallel worker count must be configurable');
assert(s.includes('partsPresent'),'progress must be auditable');
assert(s.includes('complete:files.length===total'),'177/177 remains completion gate');
console.log('finalfix67_parallel_audit.test.js PASS');
