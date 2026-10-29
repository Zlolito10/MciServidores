import {randomBytes,timingSafeEqual} from 'node:crypto';
import {spawn,spawnSync} from 'node:child_process';
import {lstat,realpath,mkdir,open,readFile} from 'node:fs/promises';
import path from 'node:path';

export const DRIVE_FILE_SCOPE='https://www.googleapis.com/auth/drive.file';
export const BOOTSTRAP_SCOPES=['openid','email',DRIVE_FILE_SCOPE];
export const safeFailure=code=>Object.assign(new Error(code),{code});
const secret=()=>randomBytes(32).toString('base64url');
export function secureEqual(a,b){if(typeof a!=='string'||typeof b!=='string')return false;const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y);}

export function normalizeBootstrapConfig(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw safeFailure('INVALID_BOOTSTRAP_CONFIG');
 const web=raw.web||raw;
 const origin=new URL(raw.origin||'http://localhost:5000');
 if(origin.protocol!=='http:'||!['localhost','127.0.0.1'].includes(origin.hostname)||!origin.port||origin.pathname!=='/'||origin.search||origin.hash||origin.username||origin.password||Number(origin.port)<1024)throw safeFailure('INVALID_LOOPBACK_ORIGIN');
 const origins=web.javascript_origins||raw.authorizedJavaScriptOrigins||[];
 if(!Array.isArray(origins)||!origins.includes(origin.origin))throw safeFailure('OAUTH_ORIGIN_NOT_REGISTERED');
 if(typeof web.client_id!=='string'||!web.client_id||typeof web.client_secret!=='string'||!web.client_secret)throw safeFailure('OAUTH_WEB_CLIENT_CONFIG_INCOMPLETE');
 const expectedOwnerEmail=String(raw.expectedOwnerEmail||'').trim().toLowerCase();
 if(!/^[^@\s]+@[^@\s]+$/.test(expectedOwnerEmail))throw safeFailure('EXPECTED_OWNER_REQUIRED');
 const folderId=String(raw.folderId||'');if(!/^[A-Za-z0-9_-]{1,200}$/.test(folderId))throw safeFailure('ARCHIVE_FOLDER_REQUIRED');
 const projectNumber=String(raw.projectNumber||web.client_id.split('-')[0]);if(!/^\d+$/.test(projectNumber))throw safeFailure('INVALID_PICKER_APP_ID');
 return {clientId:web.client_id,clientSecret:web.client_secret,origin:origin.origin,port:Number(origin.port),expectedOwnerEmail,folderId,projectNumber,publicApiKey:String(raw.publicApiKey||''),outputFile:raw.outputFile||'recovery/private/drive-oauth/owner.dpapi.json',mode:'gis-code-popup'};
}

export function createAuthorizationAttempt({now=Date.now(),lifetimeMs=300000}={}){
 return {state:secret(),createdAt:now,expiresAt:now+Math.min(Math.max(lifetimeMs,1000),300000),used:false};
}
export function consumePopupCode(attempt,{state,code},{now=Date.now()}={}){
 if(!attempt||attempt.used)throw safeFailure('OAUTH_ATTEMPT_ALREADY_USED');
 if(now>=attempt.expiresAt)throw safeFailure('OAUTH_ATTEMPT_EXPIRED');
 if(!secureEqual(state,attempt.state))throw safeFailure('OAUTH_STATE_MISMATCH');
 if(typeof code!=='string'||!code||code.length>4096||/[\s\x00-\x1f]/.test(code))throw safeFailure('INVALID_AUTHORIZATION_CODE');
 attempt.used=true;return code;
}
export function assertLoopbackRequest(request,{origin,sessionId,csrfToken,requireSession=true,requireCsrf=false}){
 const remote=request.socket?.remoteAddress;
 if(!['127.0.0.1','::1','::ffff:127.0.0.1'].includes(remote))throw safeFailure('NON_LOOPBACK_REQUEST');
 if(request.headers.host!==new URL(origin).host)throw safeFailure('INVALID_LOCAL_HOST');
 const cookie=String(request.headers.cookie||'').split(';').map(x=>x.trim()).filter(x=>x.startsWith('mci_drive_oauth='));
 if(requireSession&&(cookie.length!==1||!secureEqual(cookie[0].slice('mci_drive_oauth='.length),sessionId)))throw safeFailure('INVALID_LOCAL_SESSION');
 if(requireCsrf){
  if(request.headers.origin!==origin)throw safeFailure('INVALID_LOCAL_ORIGIN');
  if(request.headers['x-requested-with']!=='XMLHttpRequest')throw safeFailure('MISSING_POPUP_CSRF_HEADER');
  if(!secureEqual(request.headers['x-mci-csrf'],csrfToken))throw safeFailure('INVALID_LOCAL_CSRF');
 }
}

export async function verifyOwnerTokens(oauthClient,tokens,config){
 if(!tokens?.access_token||!tokens.refresh_token||!tokens.id_token)throw safeFailure('OFFLINE_OWNER_GRANT_INCOMPLETE');
 let info,payload;
 try{
  info=await oauthClient.getTokenInfo(tokens.access_token);
  const ticket=await oauthClient.verifyIdToken({idToken:tokens.id_token,audience:config.clientId});payload=ticket.getPayload();
 }catch{throw safeFailure('OWNER_TOKEN_VERIFICATION_FAILED');}
 if(info.aud!==config.clientId||!Number.isFinite(info.expiry_date)||info.expiry_date<=Date.now())throw safeFailure('OWNER_ACCESS_TOKEN_INVALID');
 if(!Array.isArray(info.scopes)||!info.scopes.includes(DRIVE_FILE_SCOPE))throw safeFailure('DRIVE_FILE_SCOPE_NOT_GRANTED');
 if(info.scopes.some(scope=>scope.startsWith('https://www.googleapis.com/auth/drive')&&scope!==DRIVE_FILE_SCOPE))throw safeFailure('UNEXPECTED_BROAD_DRIVE_SCOPE');
 const emailVerified=payload?.email_verified===true||payload?.email_verified==='true';
 if(!payload?.sub||!emailVerified||String(payload.email||'').trim().toLowerCase()!==config.expectedOwnerEmail)throw safeFailure('OAUTH_OWNER_MISMATCH');
 return {MCI_DRIVE_AUTH_MODE:'oauth',MCI_DRIVE_OAUTH_CLIENT_ID:config.clientId,MCI_DRIVE_OAUTH_CLIENT_SECRET:config.clientSecret,MCI_DRIVE_OAUTH_REFRESH_TOKEN:tokens.refresh_token,MCI_DRIVE_OAUTH_EXPECTED_EMAIL:config.expectedOwnerEmail,MCI_DRIVE_ARCHIVE_FOLDER_ID:config.folderId};
}

/** Restrict credentials to physically local, git-ignored recovery/private paths. */
export async function assertPrivateCredentialPath(filename,{root,mustExist=false}={}){
 const canonicalRoot=await realpath(root);const privateBase=path.join(canonicalRoot,'recovery','private');
 const target=path.resolve(canonicalRoot,filename);const relative=path.relative(privateBase,target);
 if(!relative||relative.startsWith('..'+path.sep)||relative==='..'||path.isAbsolute(relative))throw safeFailure('CREDENTIAL_PATH_OUTSIDE_PRIVATE');
 let current=canonicalRoot;
 for(const component of path.relative(canonicalRoot,target).split(path.sep)){
  current=path.join(current,component);
  try{if((await lstat(current)).isSymbolicLink())throw safeFailure('SYMLINK_CREDENTIAL_PATH');}
  catch(error){if(error.code!=='ENOENT')throw error;}
 }
 const ignored=spawnSync('git',['check-ignore','--quiet','--',path.relative(canonicalRoot,target)],{cwd:canonicalRoot,windowsHide:true,stdio:'ignore'});
 if(ignored.status!==0)throw safeFailure('CREDENTIAL_PATH_NOT_GIT_IGNORED');
 if(mustExist){const stat=await lstat(target);if(!stat.isFile()||stat.size>131072)throw safeFailure('INVALID_PRIVATE_CREDENTIAL_FILE');}
 return target;
}

async function dpapi(bytes,operation){
 if(process.platform!=='win32')throw safeFailure('DPAPI_REQUIRES_WINDOWS');
 const method=operation==='protect'?'Protect':'Unprotect';
 const input=operation==='protect'?Buffer.from(bytes).toString('base64'):Buffer.from(bytes).toString('utf8');
 const command="$ErrorActionPreference='Stop';try{Add-Type -AssemblyName System.Security;$b=[Convert]::FromBase64String([Console]::In.ReadToEnd());$r=[Security.Cryptography.ProtectedData]::"+method+"($b,$null,[Security.Cryptography.DataProtectionScope]::CurrentUser);[Console]::Out.Write([Convert]::ToBase64String($r));[Array]::Clear($b,0,$b.Length);[Array]::Clear($r,0,$r.Length)}catch{exit 1}";
 const executable=path.join(process.env.SystemRoot||'C:\\Windows','System32','WindowsPowerShell','v1.0','powershell.exe');
 return new Promise((resolve,reject)=>{
  const child=spawn(executable,['-NoProfile','-NonInteractive','-Command',command],{windowsHide:true,stdio:['pipe','pipe','ignore']});let output='';
  const timer=setTimeout(()=>{child.kill();reject(safeFailure('CREDENTIAL_PROTECTION_TIMEOUT'));},15000);
  child.stdout.on('data',chunk=>{output+=chunk;if(output.length>262144){child.kill();}});
  child.on('error',()=>{clearTimeout(timer);reject(safeFailure('CREDENTIAL_PROTECTION_FAILED'));});
  child.on('close',code=>{clearTimeout(timer);if(code!==0||!/^[A-Za-z0-9+/]+=*$/.test(output)){reject(safeFailure('CREDENTIAL_PROTECTION_FAILED'));return;}resolve(operation==='protect'?output:Buffer.from(output,'base64'));});
  child.stdin.on('error',()=>{});child.stdin.end(input);
 });
}

export async function persistOwnerCredentials(filename,record,{root,protection=process.platform==='win32'?'dpapi':'private-file',protect=bytes=>dpapi(bytes,'protect')}={}){
 const target=await assertPrivateCredentialPath(filename,{root});await mkdir(path.dirname(target),{recursive:true,mode:0o700});await assertPrivateCredentialPath(target,{root});
 let envelope;
 if(protection==='dpapi')envelope={version:1,protection:'windows-dpapi-current-user',data:await protect(Buffer.from(JSON.stringify(record)))};
 else if(protection==='private-file'&&process.platform!=='win32')envelope={version:1,protection:'private-json',data:record};
 else throw safeFailure('UNSUPPORTED_CREDENTIAL_PROTECTION');
 const file=await open(target,'wx',0o600);
 try{await file.writeFile(JSON.stringify(envelope)+'\n');}finally{await file.close();}
 return {saved:true,protection:envelope.protection};
}

export async function loadOwnerCredentials(filename,{root,unprotect=bytes=>dpapi(bytes,'unprotect')}={}){
 const target=await assertPrivateCredentialPath(filename,{root,mustExist:true});const envelope=JSON.parse(await readFile(target,'utf8'));
 if(envelope.version!==1)throw safeFailure('INVALID_PRIVATE_CREDENTIAL_VERSION');
 if(envelope.protection==='windows-dpapi-current-user')return JSON.parse((await unprotect(envelope.data)).toString('utf8'));
 if(envelope.protection==='private-json'&&process.platform!=='win32'){
  if((await lstat(target)).mode&0o077)throw safeFailure('INSECURE_PRIVATE_CREDENTIAL_MODE');return envelope.data;
 }
 throw safeFailure('UNSUPPORTED_CREDENTIAL_PROTECTION');
}
