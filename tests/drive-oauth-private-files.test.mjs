import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
function ignored(paths){try{return execFileSync('git',['check-ignore','--no-index','--stdin','-z'],{cwd:root,input:paths.join('\0')+'\0',encoding:'utf8'}).split('\0').filter(Boolean);}catch(error){if(error.status===1)return[];throw error;}}

test('Git refuses accidental inclusion of OAuth downloads, local runtime env and private owner credentials',()=>{
 const paths=['client_secret_synthetic.apps.googleusercontent.com.json','nested/client_secret_synthetic.apps.googleusercontent.com.json','recovery/private/drive-owner-oauth.credentials.json','.env.local','functions/.env.local'];
 assert.deepEqual(ignored(paths),paths);
});

test('secret protection keeps documented empty environment templates versionable',()=>{
 assert.deepEqual(ignored(['.env.example','functions/.env.example']),[]);
});
