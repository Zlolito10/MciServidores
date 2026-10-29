/** Local GIS code-popup bootstrap; no production deployment or auto-launch. */
import http from 'node:http';
import {randomBytes} from 'node:crypto';
import {createRequire} from 'node:module';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {normalizeBootstrapConfig,createAuthorizationAttempt,consumePopupCode,assertLoopbackRequest,verifyOwnerTokens,persistOwnerCredentials,assertPrivateCredentialPath,safeFailure} from './lib/drive-oauth-flow.mjs';
import {renderDriveOAuthPage} from './lib/drive-oauth-page.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const require=createRequire(new URL('../functions/package.json',import.meta.url));

export async function createDriveOAuthBootstrap(raw,{google=require('googleapis').google,archiveClient=require('../functions/lib/drive-archive.js').createArchiveDriveClient,persist=persistOwnerCredentials,workspace=root,render=renderDriveOAuthPage}={}){
 const config=normalizeBootstrapConfig(raw);await assertPrivateCredentialPath(config.outputFile,{root:workspace});
 const sessionId=randomBytes(32).toString('base64url'),csrfToken=randomBytes(32).toString('base64url');
 let attempt,credential,tokens,phase='awaiting-consent',busy=false,lastActivity=Date.now();
 const oauth=new google.auth.OAuth2(config.clientId,config.clientSecret,config.origin);
 const send=(res,status,value)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(value));};
 const server=http.createServer(async(req,res)=>{
  res.setHeader('Cache-Control','no-store');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Frame-Options','DENY');
  // GIS popup uses postMessage across its opener; allow popup cooperation.
  res.setHeader('Cross-Origin-Opener-Policy','same-origin-allow-popups');
  try{
   const url=new URL(req.url,config.origin);if(url.origin!==config.origin||url.search||url.hash)throw safeFailure('QUERY_NOT_ALLOWED');
   assertLoopbackRequest(req,{origin:config.origin,sessionId,csrfToken,requireSession:url.pathname!=='/',requireCsrf:req.method==='POST'});
   if(Date.now()-lastActivity>900000)throw safeFailure('BOOTSTRAP_SESSION_EXPIRED');lastActivity=Date.now();
   if(req.method==='GET'&&url.pathname==='/'){
    res.setHeader('Set-Cookie',`mci_drive_oauth=${sessionId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=900`);
    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(render());return;
   }
   if(req.method==='GET'&&url.pathname==='/api/status'){send(res,200,{clientId:config.clientId,projectNumber:config.projectNumber,publicApiKey:config.publicApiKey,expectedOwnerEmail:config.expectedOwnerEmail,folderId:config.folderId,csrfToken,phase,mode:config.mode,origin:config.origin});return;}
   if(req.method!=='POST'){send(res,405,{error:'METHOD_NOT_ALLOWED'});return;}
   if(req.headers['content-type']?.split(';')[0]!=='application/json')throw safeFailure('JSON_REQUIRED');
   let body='';for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>16384)throw safeFailure('REQUEST_TOO_LARGE');}
   let data;try{data=JSON.parse(body||'{}');}catch{throw safeFailure('INVALID_JSON');}
   if(busy)throw safeFailure('OAUTH_OPERATION_IN_PROGRESS');
   if(url.pathname==='/api/oauth/start'){
    if(phase==='saved')throw safeFailure('OWNER_GRANT_ALREADY_SAVED');attempt=createAuthorizationAttempt();credential=undefined;tokens=undefined;oauth.setCredentials({});phase='awaiting-consent';send(res,200,{state:attempt.state,expiresAt:attempt.expiresAt});return;
   }
   if(url.pathname==='/api/oauth/code'){
    const code=consumePopupCode(attempt,data);busy=true;
    try{
     let exchange;try{exchange=await oauth.getToken({code,redirect_uri:config.origin});}catch{throw safeFailure('OAUTH_CODE_EXCHANGE_FAILED');}
     credential=await verifyOwnerTokens(oauth,exchange.tokens,config);oauth.setCredentials(exchange.tokens);tokens=exchange.tokens;phase='awaiting-folder';send(res,200,{authorized:true,offline:true});
    }finally{busy=false;}return;
   }
   if(url.pathname==='/api/picker-token'){
    if(!credential||!tokens||phase==='saved')throw safeFailure('OWNER_NOT_AUTHORIZED');
    let token;try{token=(await oauth.getAccessToken()).token;}catch{throw safeFailure('PICKER_TOKEN_UNAVAILABLE');}if(!token)throw safeFailure('PICKER_TOKEN_UNAVAILABLE');
    send(res,200,{accessToken:token});return;
   }
   if(url.pathname==='/api/folder'){
    if(!credential||data.folderId!==config.folderId)throw safeFailure('CONFIGURED_FOLDER_NOT_SELECTED');busy=true;
    try{await archiveClient(google,credential).prepareArchive(config.folderId);phase='ready';send(res,200,{ready:true});}finally{busy=false;}return;
   }
   if(url.pathname==='/api/save'){
    if(phase!=='ready'||!credential)throw safeFailure('ARCHIVE_FOLDER_NOT_VERIFIED');busy=true;
    try{const result=await persist(config.outputFile,credential,{root:workspace});phase='saved';tokens=undefined;credential=undefined;oauth.setCredentials({});send(res,200,result);}finally{busy=false;}return;
   }
   send(res,404,{error:'NOT_FOUND'});
  }catch(error){const code=typeof error.code==='string'&&/^[A-Z0-9_]{1,90}$/.test(error.code)?error.code:'OAUTH_OPERATION_FAILED';if(!res.headersSent)send(res,400,{error:code});else res.end();}
 });
 server.requestTimeout=20000;server.headersTimeout=10000;
 const close=()=>new Promise(resolve=>{credential=undefined;tokens=undefined;oauth.setCredentials({});server.close(resolve);});
 return {server,config:{origin:config.origin,port:config.port},listen:()=>new Promise((resolve,reject)=>{server.once('error',reject);server.listen(config.port,'127.0.0.1',()=>resolve(config.origin+'/'));}),close};
}

async function main(){
 const args=process.argv.slice(2);let raw;
 if(args.length===1&&args[0]==='--stdin'){let input='';for await(const chunk of process.stdin){input+=chunk;if(Buffer.byteLength(input)>65536)throw safeFailure('CONFIG_TOO_LARGE');}raw=JSON.parse(input);}
 else if(args.length===2&&args[0]==='--config'){const filename=await assertPrivateCredentialPath(args[1],{root,mustExist:true});raw=JSON.parse(await readFile(filename,'utf8'));}
 else throw safeFailure('USE_CONFIG_PRIVATE_FILE_OR_STDIN');
 const app=await createDriveOAuthBootstrap(raw);const landing=await app.listen();console.log(landing);
 const timer=setTimeout(async()=>{await app.close();},900000);timer.unref();
 for(const signal of ['SIGINT','SIGTERM'])process.once(signal,async()=>{clearTimeout(timer);await app.close();});
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(error=>{console.error(/^[A-Z0-9_]{1,90}$/.test(error.code||'')?error.code:'OAUTH_BOOTSTRAP_FAILED');process.exitCode=1;});
