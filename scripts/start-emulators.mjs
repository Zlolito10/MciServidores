import {spawn} from 'node:child_process';
import {createRequire} from 'node:module';
import {mkdirSync,openSync,existsSync,readdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const require=createRequire(import.meta.url);
if(Number(process.versions.node.split('.')[0])!==22)throw new Error('Run this command with Node.js 22: npm exec --package=node@22 -- node scripts/start-emulators.mjs');
const cli=process.env.FIREBASE_TOOLS_PATH||require.resolve('firebase-tools/lib/bin/firebase.js');
const logPath=path.join(root,'recovery/private/emulators.log');
mkdirSync(path.dirname(logPath),{recursive:true});
const env={...process.env,PATH:path.dirname(process.execPath)+path.delimiter+process.env.PATH};
if(!env.JAVA_HOME){
 const localJava=path.resolve(root,'../.tools/java21');
 if(existsSync(localJava)){
  const folder=readdirSync(localJava).find(n=>existsSync(path.join(localJava,n,'bin/java.exe')));
  if(folder)env.JAVA_HOME=path.join(localJava,folder);
 }
}
if(env.JAVA_HOME)env.PATH=path.join(env.JAVA_HOME,'bin')+path.delimiter+env.PATH;
const log=openSync(logPath,'a');
const child=spawn(process.execPath,[cli,'emulators:start','--config','firebase.emulators.json','--project','demo-mci-servidores','--only','auth,firestore,functions,storage','--non-interactive'],{cwd:root,env,windowsHide:true,stdio:['ignore',log,log]});
console.log('Starting Auth, Firestore, Functions and Storage for demo-mci-servidores. Log: recovery/private/emulators.log');
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));
child.on('exit',code=>process.exit(code??1));
