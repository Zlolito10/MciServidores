import json,re
from pathlib import Path
base=Path(__file__).resolve().parents[2]/'recovered'
j=json.loads((base/'frontend-contracts.draft.json').read_text(encoding='utf8'))
allowed={m['file']:next((b['local'] for i in m['imports'] if i['source'].startswith('./App-') for b in i['bindings'] if b['imported']=='f'),None) for m in j['modules']}
allowed['App-BPrQ3EPG.js']='O'
calls=[c for c in j.pop('api_calls') if c['callee']==allowed[c['module']]]
def clean(v):
 if isinstance(v,str) and v.startswith('variable:'):return 'dynamic (type not proven)'
 if isinstance(v,dict):return {k:clean(x) for k,x in v.items()}
 if isinstance(v,list):return [clean(x) for x in v]
 return v
for c in calls:
 c['confidence']='confirmed call-site'
 c['transport']='bffFetch'
 c['request_body']=clean(c['request_body'])
 c['method']='GET' if c['method']=='unknown' and c['route'].split('?')[0] in ['/api/dashboard','/api/comments/recent','/api/events/{eventId}/details'] else c['method']
 c['shared_request_policy']='bffFetch'
 c['source_offset_original_utf16']=c.pop('offset')
# Call-site literals stored in local variables or direct fetch, verified in readable source.
def add(module,route,method='GET',body=None,line=None,transport='bffFetch',headers=None):
 calls.append(dict(module=module,route=route,method=method,request_body=body,headers=headers,transport=transport,confidence='confirmed call-site, manually traced local variable',source_readable_line=line,shared_request_policy='bffFetch' if transport=='bffFetch' else None))
for route,line in [('/api/admin/telemetry/latest?limitUsers={limitUsers}&__t={cacheBust}',238),('/api/admin/telemetry/daily?days={days}&limit={limit}&__t={cacheBust}',275),('/api/admin/firestore-reads?hours={hours}&__t={cacheBust}',329),('/api/admin/app-history?limit={limit}&__t={cacheBust}',349),('/api/admin/app-history/meta?__t={cacheBust}',372)]:add('AppHistory-oOipttKZ.js',route,line=line)
for route,line in [('/api/notify/repertoire',763),('/api/notify/materials',983)]:add('EventDetails-CpDlqXqO.js',route,'POST',{'eventId':'string'},line,'fetch',{'Content-Type':'application/json'})
add('Settings-BtbU5gHm.js','/api/notify/user','POST',{'userId':'string','title':'string','body':'string'},244,'fetch local-host fallback',{'Content-Type':'application/json'})
add('Dashboard-DN8eeJDA.js','/comments/react','POST',{'commentId':'string','reaction':'string','action':'toggle'},1149,'fetch',{'Content-Type':'application/json','Authorization':'Bearer <Firebase ID token obtained from current user>'})
add('Dashboard-DN8eeJDA.js','/api/events/{eventId}/assignments/{assignmentId}/attendance/photo','POST',{'multipart_form_data':{'type':'check-in | check-out','attendanceTimeIso':'ISO string','attendanceStatus':'late | present | completed','wasLate':'0 | 1 string','wasCheckOutLate':'0 | 1 string','lat':'number serialized as string','lng':'number serialized as string','accuracyMeters':'optional number serialized as string','capturedAtMs':'number serialized as string','file':'File'}},2040)
add('Dashboard-DN8eeJDA.js','/api/events/{eventId}/assignments/{assignmentId}/attendance','POST',{'type':'check-in | check-out','attendanceTimeIso':'ISO string','attendanceStatus':'late | present | completed','wasLate':'boolean','wasCheckOutLate':'boolean','location':{'lat':'number','lng':'number','accuracyMeters':'optional number','capturedAtMs':'number'}},2052)
add('EventDetails-CpDlqXqO.js','/api/download-material?path={storagePath}&filename={filename}',line=1877,transport='browser download navigation')
add('EventDetails-CpDlqXqO.js','/api/download?path={storagePath}&inline=1',line=255,transport='asset URL generator')
# Request shapes manually reconstructed only when object/form field definitions are explicit.
shapes={
 ('/api/events/image','POST'):{'multipart_form_data':{'file':'File'}},
 ('/api/users/me/photo','POST'):{'multipart_form_data':{'file':'File'}},
 ('/api/events/{eventId}/assignments/{assignmentId}','PUT'):{'id':'string','areaId':'string','areaName':'string','roleName':'string','userId':'string','userName':'string','userPhoto':'string | null'},
 ('/api/events/{eventId}/repertoire/{repertoireId}','PATCH'):{'title':'FormData string | null','key':'string joined with +','link':'FormData string | null','ref1':'FormData string | null','link2':'FormData string | null','ref2':'FormData string | null','notes':'FormData string | null'},
 ('/api/events/{eventId}/repertoire','POST'):{'title':'FormData string | null','key':'string joined with +','link':'FormData string | null','ref1':'FormData string | null','link2':'FormData string | null','ref2':'FormData string | null','notes':'FormData string | null','order':'number'},
 ('/api/events/{eventId}/repertoire/reorder','POST'):{'items':[{'id':'string','order':'number'}]},
 ('/api/events/{eventId}/materials/upload','POST'):{'multipart_form_data':{'title':'string','songId':'optional string','songTitle':'optional string','materialId':'optional string','file':'File'}},
 ('/api/notify/user','POST'):{'userId':'string','title':'string','body':'string'},
}
for c in calls:
 if (c['route'],c['method']) in shapes:c['request_body']=shapes[c['route'],c['method']]
 c['path']=c['route'].split('?')[0]
 q=c['route'].split('?',1)[1] if '?' in c['route'] else ''
 c['query_parameters']=sorted(set(x.split('=')[0] for x in q.split('&') if x and x!='{param}'))
j['api_calls']=calls
j['request_policies']={'bffFetch':{'confidence':'confirmed implementation; execution branch may be inactive','source':'App-BPrQ3EPG.js:587-670 (readable copy)','credentials':'include','default_method':'GET','default_timeout_ms':30000,'headers':{'Content-Type':'application/json when options.json provided','x-app-version':'optional pwa_app_version from localStorage','x-app-path':'current pathname','x-xsrf-token':'cached XSRF token for non-GET/HEAD/OPTIONS requests when available','Cache-Control':'no-store when bypassCache/no-store/no-cache'},'body':'JSON.stringify(options.json) or raw options.body; FormData supplies its browser-generated content type','response':'JSON response (fallback {raw:text}); non-2xx -> BffError with status/data; read responses cached with ETag; 304 retry when cache absent','authorization':'No Authorization header added by this wrapper. Cookie session transport is configured with credentials:include. Backend validation is unknown.'}}
j['firebase']={'project_id':'mcimachala-servidor','client_configuration_keys':['apiKey','authDomain','projectId','storageBucket','messagingSenderId','appId','measurementId'],'client_configuration_values':'Omitted; use the original public artifact when necessary. These are frontend Firebase configuration, not server credentials.','api_function':{'confidence':'confirmed URL referenced in frontend, not a verified deployed Functions inventory','name':'api','region':'us-central1','origin':'https://us-central1-mcimachala-servidor.cloudfunctions.net','evidence':['Settings-BtbU5gHm.js:244 readable','EventDetails-CpDlqXqO.js:761,981 readable']},'build_flags':{'confidence':'confirmed literal empty objects in this deployed bundle','He':{},'Nt':{},'effective_false_flags':['VITE_BFF_MODE','VITE_USE_EMULATORS','VITE_ENABLE_BFF','VITE_BFF_STRICT_AUTH'],'effective_auth_persistence':'local by default','implication':'Most feature branches use direct client Firestore/Storage. Existing BFF code documents an alternate branch; it does not prove that branch is enabled.'}}
paths=json.loads((base/'firestore-paths.draft.json').read_text(encoding='utf8'))
paths=[x for x in paths if not x['path'].startswith('127.')]
pathlist={}
for x in paths:
 p=x['path'];pathlist.setdefault(p,{'path_template':p,'confidence':'confirmed client-side path construction; existence/access unverified','modules':[],'examples_original_offsets':[]})
 if x['module'] not in pathlist[p]['modules']:pathlist[p]['modules'].append(x['module'])
 if len(pathlist[p]['examples_original_offsets'])<3:pathlist[p]['examples_original_offsets'].append({'module':x['module'],'offset':x['offset']})
j['firestore_paths']=list(pathlist.values())
j['roles']={'confidence':'confirmed frontend constants and predicates; server authorization unknown','ids':['master_admin','admin','user','ministry_admin','ministry_subadmin'],'dynamic_id_patterns':['ministry_admin_{ministryId}','ministry_subadmin_{ministryId}'],'permissions':['view_dashboard','manage_users','manage_roles','manage_events','view_events','manage_services','view_reports','manage_ministry_events','manage_ministry_users','view_ministry_reports','view_ministry_attendance'],'sentinel_no_role':'__NO_ROLE__','fields_seen':['role','permissions','assignedMinistries','areas','ministryRoles','ministryId','ministryName','roleType']}
j['data_model_examples']={
 'users':{'uid':'string','email':'string','name':'string','role':'string','photoURL':'optional string','photoThumbURL':'optional string','assignedMinistries':'array','areas':'array','permissions':'array','ministryRoles':'object or dynamic','createdAt':'date/timestamp','preferences':{'notifications':'boolean-like dynamic'}},
 'events':{'title':'string','date':'string','location':'string','serviceTime':'string','time':'string','endTime':'string','type':'string (service fallback)','description':'string','activeMinistries':'array','imageUrl':'string','imageThumbUrl':'string','status':'string (scheduled on create, completed action)','createdBy':'user id','updatedBy':'user id'},
 'event_assignments':{'id':'string','areaId':'string','areaName':'string','roleName':'string','userId':'string','userName':'string','userPhoto':'string | null'},
 'udlv_courses':{'name':'string','description':'string','docenteId':'string','tutorId':'string','asistentId':'string (spelling in actual bundle)','teamIds':'array of user ids','createdAt':'date','createdBy':'user id'},
 'note':'Partial client write/read shapes, not an authoritative server schema. No database contents have been accessed.'}
j['routes']=[r for r in j['routes'] if r['route']!='/dashboard/events/']
j['routes'].append({'module':'App-BPrQ3EPG.js','route':'/','behavior':'redirect to /dashboard','confidence':'confirmed route declaration'})
for r in j['routes']:r['confidence']='confirmed frontend route declaration or route literal'
j['readability']={'method':'prettier@3.8.0 babel parser, one output file per original application chunk, exact same filenames/imports/exports','script':'/workspace/frontend-analysis-tools/format.cjs','output_directory':str(base/'readable-assets'),'validation_file':str(base/'readable-validation.json'),'normalized_ast_equal':{'checked':28,'passed':28,'parser':'acorn@8.15.0','ignored_properties':['start','end','raw']},'original_artifacts_modified':False,'typescript_recovery':'Original TS/TSX, symbol names, comments, dependency pins and original module boundaries are not recoverable exactly from these compiled chunks. Do not label formatted JS as original source.','esbuild_alternative':'Transform each chunk as ESM with minify:false, bundle:false, target:esnext, legalComments:preserve. Do not rename hashed import targets or re-bundle vendor chunks. Formatting with prettier is the lower-change choice.'}
j['unknowns']=['Original server/API implementation, complete deployed Functions inventory, runtime generation and service-account permissions.','Firestore/Storage security rules, deployed indexes and bucket IAM.','Actual data contents, installed production roles/users, configured Auth providers and authorized domains.','Original source tree, TypeScript types, original package manifest and exact dependency versions.','Which hosting rewrites route /api/* and /comments/react; frontend links imply these rewrites but do not reveal their deployed definitions.','Whether every API endpoint currently exists or returns the shapes the client expects.','No execution/authenticated validation of protected routes was performed by this analysis.']
j['notes']=['All endpoints are evidence of frontend intent/call sites, not confirmation of backend existence.','No application module was executed; source was parsed/formatted only. No private data was read and no authenticated API was invoked.','Vendor-named bundles, html2canvas, purify and index.es dependency chunks were excluded from contract discovery. Some application chunks embed SDK/dependency code; only application call sites were used.','Query cache-busters may be dynamic expressions. Payload types marked dynamic cannot be inferred safely from a minified variable alone.','Readable copies preserve the public Firebase client configuration present in the original artifact; reports intentionally omit client configuration values.']
(base/'frontend-contracts.json').write_text(json.dumps(j,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(json.dumps({'calls':len(calls),'unique_http_routes':len(set((c['method'],c['path']) for c in calls)),'firestore_paths':len(j['firestore_paths']),'ui_routes':len(j['routes'])}))
