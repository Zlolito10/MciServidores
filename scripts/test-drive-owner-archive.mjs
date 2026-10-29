/** Explicit real Drive probe. The Storage source is synthetic memory, never Firebase. */
import {createHash,randomUUID} from 'node:crypto';
import {createRequire} from 'node:module';
import {writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadOwnerCredentials,assertPrivateCredentialPath,safeFailure} from './lib/drive-oauth-flow.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const require=createRequire(new URL('../functions/package.json',import.meta.url));
const {createArchiveDriveClient}=require('../functions/lib/drive-archive.js');
const {archiveOldEventFiles}=require('../functions/lib/cleanup.js');
const hash=(algorithm,bytes)=>createHash(algorithm).update(bytes).digest('hex');

export async function runOwnerArchiveProbe(credential,{google=require('googleapis').google,driveFactory=createArchiveDriveClient,archiver=archiveOldEventFiles,now=new Date(),onArtifactIntent=async()=>{},onArtifactCreated=async()=>{}}={}){
 if(credential?.MCI_DRIVE_AUTH_MODE!=='oauth'||!credential.MCI_DRIVE_OAUTH_EXPECTED_EMAIL||!credential.MCI_DRIVE_ARCHIVE_FOLDER_ID)throw safeFailure('OWNER_OAUTH_CREDENTIAL_REQUIRED');
 const folderId=credential.MCI_DRIVE_ARCHIVE_FOLDER_ID;
 const marker=randomUUID(),name=`MCI-recovery-probe-${now.toISOString().replace(/[:.]/g,'-')}-${marker}.txt`;
 const bytes=Buffer.from(`Synthetic MCI recovery archive probe.\nRun ${marker}.\nNo production Storage data.\n`);
 const md5=hash('md5',bytes),sha256=hash('sha256',bytes);
 const drive=driveFactory(google,credential);let createdId,createAttempted=false,sourceDeleted=false,sourceReads=0;
 const create=drive.files.create.bind(drive.files);
 drive.files.create=async request=>{
  if(createAttempted||request.requestBody?.name!==name||request.requestBody?.parents?.length!==1||request.requestBody.parents[0]!==folderId)throw safeFailure('UNEXPECTED_PROBE_CREATE_BLOCKED');
  createAttempted=true;
  // Persist the private intent before the external write: a lost response can
  // leave a committed Drive file whose id never reached this process.
  await onArtifactIntent({id:null,marker,name,folderId,createAttempted:true});
  const response=await create({...request,fields:'id,size,md5Checksum',requestBody:{...request.requestBody,appProperties:{mciRecoveryProbe:marker}}});
  if(typeof response?.data?.id!=='string'||!response.data.id)throw safeFailure('DRIVE_PROBE_CREATE_UNCONFIRMED');
  createdId=response.data.id;await onArtifactCreated({id:createdId,marker,name,folderId});return response;
 };
 // This object deliberately has no Firebase SDK or production bucket reference.
 const source={name:'events/recovery-probe/'+name,getMetadata:async()=>[{timeCreated:new Date(now.getTime()-30*86400000).toISOString(),generation:'1',contentType:'text/plain'}],download:async()=>{sourceReads++;return [bytes];},delete:async options=>{if(options.ifGenerationMatch!=='1')throw safeFailure('UNGUARDED_SYNTHETIC_DELETE');sourceDeleted=true;}};
 const bucket={getFiles:async options=>{if(options.prefix!=='events/')throw safeFailure('UNEXPECTED_SYNTHETIC_LIST');return [[source]];}};
 const result=await archiver({bucket,drive,folderId,now,logger:{info(){},warn(){}}});
 if(result.archived!==1||result.deleted!==1||result.errors||!sourceDeleted||!createdId)throw safeFailure('DRIVE_PROBE_ARCHIVAL_FAILED');
 let metadata,readback;
 try{
  ({data:metadata}=await drive.files.get({fileId:createdId,supportsAllDrives:true,fields:'id,name,parents,appProperties,size,md5Checksum'}));
  ({data:readback}=await drive.files.get({fileId:createdId,supportsAllDrives:true,alt:'media'},{responseType:'arraybuffer'}));
 }catch{throw safeFailure('DRIVE_PROBE_READBACK_FAILED');}
 const downloaded=Buffer.from(readback);
 // Never remove an unrelated file, even if an API/mock returns an unexpected id.
 if(metadata.id!==createdId||metadata.name!==name||metadata.appProperties?.mciRecoveryProbe!==marker||metadata.parents?.length!==1||metadata.parents[0]!==folderId||String(metadata.size)!==String(bytes.length)||metadata.md5Checksum!==md5||downloaded.length!==bytes.length||hash('sha256',downloaded)!==sha256)throw safeFailure('DRIVE_PROBE_CLEANUP_GUARD_REJECTED');
 try{await drive.files.delete({fileId:createdId,supportsAllDrives:true});}catch{throw safeFailure('DRIVE_PROBE_REMOVE_FAILED');}
 return {verifiedAt:new Date().toISOString(),result:'REAL_OWNER_DRIVE_ARCHIVE_PASSED',usesRecoveredArchiveFunction:true,storageSource:'synthetic-memory-only',productionStorageReads:0,productionStorageDeletes:0,syntheticSourceReads:sourceReads,sourceDeleteGenerationGuardVerified:true,driveFileCreated:true,driveSizeAndMd5Confirmed:true,downloadedSha256Matches:true,createdFileMarkerAndParentVerified:true,onlyCreatedProbeRemoved:true,ownerIdentityInPublicReport:false,credentialInPublicReport:false};
}

async function main(){
 const args=process.argv.slice(2);const index=args.indexOf('--credentials');const file=index>=0?args[index+1]:undefined;
 if(!args.includes('--execute-real-write')){console.log(JSON.stringify({result:'DRY_RUN_NO_CREDENTIAL_ACCESS',operations:['offline owner OAuth preflight','one synthetic text archive in configured Drive folder','readback/hash verification','remove only this run marked file'],productionStorageReads:0,productionStorageDeletes:0},null,2));return;}
 if(!file)throw safeFailure('PRIVATE_CREDENTIAL_FILE_REQUIRED');
 const credential=await loadOwnerCredentials(file,{root});let artifact;
 const artifactPath=await assertPrivateCredentialPath('recovery/private/drive-oauth/probe-artifact.private.json',{root});
 await mkdir(path.dirname(artifactPath),{recursive:true,mode:0o700});
 const reportPath=path.join(root,'recovery/drive-owner-validation.json');
 let report;
 const recordArtifact=async value=>{artifact=value;await writeFile(artifactPath,JSON.stringify(value)+'\n',{mode:0o600});};
 try{report=await runOwnerArchiveProbe(credential,{onArtifactIntent:recordArtifact,onArtifactCreated:recordArtifact});}
 catch(error){const code=/^[A-Z0-9_]{1,90}$/.test(error.code||'')?error.code:'DRIVE_OWNER_PROBE_FAILED';report={verifiedAt:new Date().toISOString(),result:'REAL_OWNER_DRIVE_ARCHIVE_BLOCKED',error:code,productionStorageReads:0,productionStorageDeletes:0,probeArtifactMayRemain:!!artifact};process.exitCode=2;}
 finally{for(const key of Object.keys(credential))credential[key]='';}
 await writeFile(reportPath,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(()=>{console.error('DRIVE_OWNER_PROBE_FAILED');process.exitCode=1;});
