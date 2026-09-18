'use strict';
// v0.66: one variant per child process, checkpoint after every completed variant.
// This deliberately trades throughput for audit integrity: a long run can resume without losing completed battles.
const fs=require('fs'),path=require('path'),cp=require('child_process');
const root=path.resolve(__dirname,'..'),parts=path.join(root,'AUDIT_v0.66_PARTS');fs.mkdirSync(parts,{recursive:true});
const start=Math.max(0,Number(process.env.START||0)),end=Math.min(177,Number(process.env.END||177));
let completed=0,skipped=0,failed=[];
for(let i=start;i<end;i++){
 const dst=path.join(parts,`variant_${String(i).padStart(3,'0')}.json`);
 if(fs.existsSync(dst)){skipped++;continue;}
 const env={...process.env,SHARD:String(i),SHARDS:'177'};
 const r=cp.spawnSync(process.execPath,[path.join(__dirname,'endgame65_multiseed_audit.js')],{cwd:root,env,encoding:'utf8',timeout:Number(process.env.VARIANT_TIMEOUT_MS||240000),maxBuffer:16*1024*1024});
 const src=path.join(root,`AUDIT_v0.65_MULTISEED_SHARD${i}.json`);
 if(r.status===0&&fs.existsSync(src)){const data=JSON.parse(fs.readFileSync(src,'utf8'));data.summary.auditRunner='v0.66-resumable';data.summary.globalVariantIndex=i;fs.writeFileSync(dst,JSON.stringify(data,null,2));fs.unlinkSync(src);completed++;console.error(`saved ${i+1}/177`);}else{failed.push({index:i,status:r.status,signal:r.signal,stderr:(r.stderr||'').slice(-1000)});console.error(`failed ${i+1}/177`);}
}
const files=fs.readdirSync(parts).filter(x=>/^variant_\d+\.json$/.test(x)).sort();
const manifest={version:'0.66-resumable-audit',generatedAt:new Date().toISOString(),range:{start,end},partsPresent:files.length,completedThisRun:completed,skippedThisRun:skipped,failed,complete:files.length===177};
fs.writeFileSync(path.join(root,'AUDIT_v0.66_RESUME_MANIFEST.json'),JSON.stringify(manifest,null,2));console.log(JSON.stringify(manifest,null,2));
