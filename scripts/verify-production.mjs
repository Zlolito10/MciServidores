/** Executes local tests only. No deployment, real credentials or Cloud API calls. */
import {spawn} from 'node:child_process';
import {writeFile,readdir,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {sourceDigest,backendBuildDigest,inspectProductionArtifact} from './lib/production-release.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
async function run(label,command,args){
 return new Promise(resolve=>{
  const child=spawn(command,args,{cwd:root,windowsHide:true,stdio:['ignore','pipe','pipe']});let output='',settled=false;
  child.stdout.on('data',data=>{output+=data;});child.stderr.on('data',data=>{output+=data;});
  child.once('error',()=>{settled=true;resolve({label,exitCode:1,error:'LOCAL_TEST_PROCESS_UNAVAILABLE'});});
  child.once('close',async code=>{
   if(settled)return;settled=true;
   const metric=name=>{const match=output.match(new RegExp('^# '+name+' (\\d+)\\r?$','m'));return match?Number(match[1]):undefined;};
   const python=output.match(/Ran (\d+) tests?/);
   const pythonSkipped=Number(output.match(/OK\s*\(skipped=(\d+)\)/)?.[1]||0);
   const result={label,exitCode:code??1,...(metric('tests')!==undefined?{tests:metric('tests'),passed:metric('pass'),failed:metric('fail'),skipped:metric('skipped')} : python?{tests:Number(python[1]),skipped:pythonSkipped}: {})};
   if(result.exitCode!==0){result.error='LOCAL_TESTS_FAILED';await writeFile(path.join(root,'recovery/private/release-'+label+'.log'),output);}
   console.log(JSON.stringify(result));resolve(result);
  });
 });
}
try{
 await mkdir(path.join(root,'recovery/private'),{recursive:true});
 const before=await sourceDigest(root),commands=[];let compiledAfterBuild;
 commands.push(await run('frontend-build',process.execPath,['scripts/build-frontend.mjs','--production-services','--out-dir','dist-production']));
 const artifact=await inspectProductionArtifact(root);
 if(artifact.status!=='passed')commands.push({label:'artifact-inspection',exitCode:2,error:'INVALID_PRODUCTION_ARTIFACT'});
 const tests=(await readdir(path.join(root,'tests'))).filter(name=>name.endsWith('.test.mjs')).sort().map(name=>'tests/'+name);
 if(commands.every(command=>command.exitCode===0)&&artifact.status==='passed')commands.push(await run('backend-build',process.execPath,['functions/node_modules/typescript/bin/tsc','-p','functions/tsconfig.json']));
 if(commands.every(command=>command.exitCode===0))compiledAfterBuild=await backendBuildDigest(root);
 if(commands.every(command=>command.exitCode===0))commands.push(await run('node',process.execPath,['--test','--test-reporter=tap',...tests]));
 const pythonCode="import pathlib,tempfile,unittest,sys; p=pathlib.Path('recovery/private/python-release-tmp'); p.mkdir(parents=True,exist_ok=True); tempfile.tempdir=str(p.resolve()); s=unittest.defaultTestLoader.discover('tests',pattern='test_*.py'); r=unittest.TextTestRunner(verbosity=2).run(s); sys.exit(0 if r.wasSuccessful() else 1)";
 if(commands.every(command=>command.exitCode===0))commands.push(await run('python','python',['-c',pythonCode]));
 if(commands.every(command=>command.exitCode===0))commands.push(await run('emulator',process.execPath,['--test','--test-reporter=tap','--test-concurrency=1','tests/emulator.integration.mjs','tests/release-rules.integration.mjs']));
 const after=await sourceDigest(root),currentArtifact=await inspectProductionArtifact(root),compiledAtEnd=await backendBuildDigest(root);
 const status=commands.length===5&&commands.every(command=>command.exitCode===0&&(command.label.endsWith('-build')||command.tests>0)&&(!('failed'in command)||command.failed===0)&&(!('skipped'in command)||command.skipped===0))&&before===after&&!!compiledAfterBuild&&compiledAfterBuild===compiledAtEnd&&currentArtifact.status==='passed'&&currentArtifact.manifestSha256===artifact.manifestSha256?'passed':'blocked';
 const report={schemaVersion:1,checkedAt:new Date().toISOString(),status,sourceDigest:after,backendBuildDigest:compiledAtEnd,backendChangedDuringValidation:compiledAfterBuild!==compiledAtEnd,sourceChangedDuringValidation:before!==after,manifestSha256:currentArtifact.manifestSha256,commands,environment:'local Firebase emulators only',productionServicesUsed:false,productionDeploymentPerformed:false};
 await writeFile(path.join(root,'recovery/production-validation.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({status,report:'recovery/production-validation.json'}));if(status!=='passed')process.exitCode=2;
}catch{
 try{await writeFile(path.join(root,'recovery/production-validation.json'),JSON.stringify({schemaVersion:1,checkedAt:new Date().toISOString(),status:'blocked',error:'PRODUCTION_VALIDATION_FAILED',productionServicesUsed:false,productionDeploymentPerformed:false},null,2)+'\n');}catch{}
 console.error('PRODUCTION_VALIDATION_FAILED');process.exitCode=1;
}
