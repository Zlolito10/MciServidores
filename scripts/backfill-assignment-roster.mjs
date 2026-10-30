/** Local-only projection backfill. Production credentials, inventory and mutations are deliberately unsupported. */
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
const require=createRequire(new URL('../functions/package.json',import.meta.url));
const {publicAssignmentRoster,syncAssignmentRoster}=require('../functions/lib/assignment-roster.js');

export function assertRosterDemoTarget({project,firestoreHost}){
 let url;try{url=new URL('http://'+firestoreHost);}catch{throw Error('DEMO_FIRESTORE_LOOPBACK_REQUIRED');}
 if(typeof project!=='string'||!/^demo-[a-z0-9-]+$/.test(project))throw Error('DEMO_PROJECT_REQUIRED');
 if(!['127.0.0.1','localhost','[::1]'].includes(url.hostname)||!url.port||url.username||url.password||url.pathname!=='/'||url.search||url.hash)throw Error('DEMO_FIRESTORE_LOOPBACK_REQUIRED');
}

export async function backfillAssignmentRoster({db,project,firestoreHost,execute=false,limit=1000}){
 assertRosterDemoTarget({project,firestoreHost});
 if(!Number.isInteger(limit)||limit<1||limit>10000)throw Error('INVALID_ROSTER_SCAN_LIMIT');
 const report={mode:execute?'DEMO_EMULATOR_EXECUTION':'DEMO_EMULATOR_DRY_RUN',scanned:0,projectable:0,projected:0,recordsWithPrivateFields:0,skippedOtherPaths:0,limitReached:false,originalAssignmentsModified:0,productionReads:0,productionWrites:0,privateFieldValuesIncluded:false};
 let cursor;
 while(report.scanned<limit){
  let query=db.collectionGroup('assignments').orderBy(require('firebase-admin/firestore').FieldPath.documentId()).limit(Math.min(100,limit-report.scanned));if(cursor)query=query.startAfter(cursor);
  const snapshot=await query.get();if(snapshot.empty)break;
  for(const doc of snapshot.docs){
   report.scanned++;const parts=doc.ref.path.split('/');
   if(parts.length!==4||parts[0]!=='events'||parts[2]!=='assignments'){report.skippedOtherPaths++;continue;}
   const data=doc.data();publicAssignmentRoster(data,parts[1]);report.projectable++;
   if(['checkInPhoto','checkOutPhoto','checkInLocation','checkOutLocation'].some(key=>data[key]!==undefined))report.recordsWithPrivateFields++;
   if(execute){const result=await syncAssignmentRoster({db,eventId:parts[1],assignmentId:parts[3]});if(result.projected)report.projected++;}
  }
  cursor=snapshot.docs.at(-1);if(snapshot.docs.length<100)break;
 }
 report.limitReached=report.scanned===limit;
 return report;
}

async function main(){
 const args=process.argv.slice(2);const execute=args.includes('--execute');
 const project=process.env.GCLOUD_PROJECT||process.env.GOOGLE_CLOUD_PROJECT;
 const firestoreHost=process.env.FIRESTORE_EMULATOR_HOST;
 if(!project&&!firestoreHost&&!execute){console.log(JSON.stringify({mode:'DRY_RUN_NO_DATABASE_ACCESS',requiredTarget:'explicit demo-* project and loopback Firestore Emulator',operations:['scan local assignments','project scheduling whitelist only'],productionSupported:false}));return;}
 assertRosterDemoTarget({project,firestoreHost});
 const admin=require('firebase-admin');const app=admin.initializeApp({projectId:project},'assignment-roster-backfill');
 try{console.log(JSON.stringify(await backfillAssignmentRoster({db:app.firestore(),project,firestoreHost,execute}),null,2));}finally{await app.delete();}
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)main().catch(error=>{console.error(/^[A-Z_]{1,90}$/.test(error.message)?error.message:'ROSTER_DEMO_BACKFILL_FAILED');process.exitCode=1;});
