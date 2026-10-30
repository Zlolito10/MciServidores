import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {writeFile} from 'node:fs/promises';
import {parseArgs} from 'node:util';
import {inspectProductionArtifact,inspectProductionReadiness} from './lib/production-release.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
try{
 const {values}=parseArgs({options:{config:{type:'string',default:'firebase.production.json'},'artifact-only':{type:'boolean',default:false},report:{type:'boolean',default:false}},strict:true,allowPositionals:false});
 const result=values['artifact-only']?await inspectProductionArtifact(root,{configFile:values.config}):await inspectProductionReadiness(root,{configFile:values.config});
 if(values.report&&!values['artifact-only'])await writeFile(path.join(root,'recovery/production-readiness.json'),JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify(result,null,2));
 if(!['passed','ready'].includes(result.status))process.exitCode=2;
}catch{console.error('PRODUCTION_RELEASE_CHECK_FAILED');process.exitCode=1;}
