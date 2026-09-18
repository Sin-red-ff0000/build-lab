'use strict';
// v0.67: parallel resumable wrapper around the v0.66 per-variant checkpoint audit.
// Each worker owns a disjoint contiguous range; variant JSON files remain the source of truth.
const fs=require('fs'),path=require('path'),cp=require('child_process');
const root=path.resolve(__dirname,'..'), parts=path.join(root,'AUDIT_v0.66_PARTS'); fs.mkdirSync(parts,{recursive:true});
const total=177, workers=Math.max(1,Math.min(Number(process.env.WORKERS||4),12));
const missing=[]; for(let i=0;i<total;i++){const f=path.join(parts,`variant_${String(i).padStart(3,'0')}.json`);if(!fs.existsSync(f))missing.push(i);}
if(!missing.length){console.log(JSON.stringify({version:'0.67-parallel-resume',partsPresent:177,complete:true},null,2));process.exit(0);}
const buckets=Array.from({length:workers},()=>[]); missing.forEach((v,i)=>buckets[i%workers].push(v));
const children=buckets.filter(x=>x.length).map((bucket,wi)=>new Promise(resolve=>{
  // Ranges may include completed variants; v0.66 safely skips them.
  const start=Math.min(...bucket), end=Math.max(...bucket)+1;
  const env={...process.env,START:String(start),END:String(end),VARIANT_TIMEOUT_MS:process.env.VARIANT_TIMEOUT_MS||'240000'};
  const p=cp.spawn(process.execPath,[path.join(__dirname,'endgame66_resumable_audit.js')],{cwd:root,env,stdio:['ignore','ignore','pipe']});
  let err=''; p.stderr.on('data',d=>{err+=d; if(err.length>4000)err=err.slice(-4000);});
  p.on('exit',(code,signal)=>resolve({worker:wi,start,end,code,signal,stderr:err.slice(-1000)}));
}));
Promise.all(children).then(rows=>{
 const files=fs.readdirSync(parts).filter(x=>/^variant_\d+\.json$/.test(x));
 const summary={version:'0.67-parallel-resume',generatedAt:new Date().toISOString(),workers,partsPresent:files.length,complete:files.length===total,workersResult:rows};
 fs.writeFileSync(path.join(root,'AUDIT_v0.67_PARALLEL_PROGRESS.json'),JSON.stringify(summary,null,2)); console.log(JSON.stringify(summary,null,2));
 process.exit(rows.some(x=>x.code!==0)?1:0);
});
