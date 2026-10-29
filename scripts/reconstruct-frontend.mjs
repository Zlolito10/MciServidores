/** Reconstruct editable JSX from the published runtime. This is not original source recovery. */
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {parse} from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';
import prettier from 'prettier';
import {createHash} from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const src=path.join(root,'frontend/src');
const check=process.argv.includes('--check');
if(!check&&!process.argv.includes('--overwrite')){
 try{await fs.access(path.join(root,'recovery/frontend-reconstruction.json'));throw new Error('Reconstructed sources already exist. Use --check to verify the baseline or --overwrite to explicitly replace later edits.');}catch(error){if(error.code!=='ENOENT')throw error;}
}
const generatedFiles=[];
async function emit(relative,contents){
 const target=path.resolve(root,relative);
 if(!target.startsWith(root+path.sep))throw new Error('Unsafe reconstruction output');
 if(check){if(await fs.readFile(target,'utf8')!==contents)throw new Error('Source differs from the reproducible baseline: '+relative);}
 else {await fs.mkdir(path.dirname(target),{recursive:true});await fs.writeFile(target,contents);}
 generatedFiles.push({path:relative.replaceAll('\\','/'),sha256:createHash('sha256').update(contents).digest('hex')});
}
const names={
 'App-BPrQ3EPG.js':'app/App.jsx','index-BU_ZgoWo.js':'main.jsx',
 'CameraModal-BwvRT9Xn.js':'components/CameraModal.jsx',
 'EventsGrid-BNb5ngU2.js':'components/EventsGrid.jsx',
 'LoadingButton-DoDnirDC.js':'components/LoadingButton.jsx',
 'LoadingSpinner-DQ5LcqWB.js':'components/LoadingSpinner.jsx',
 'ManageMinistriesModal-BO1rzanM.js':'components/ManageMinistriesModal.jsx',
 'SelectPicker-D1mnbmt-.js':'components/SelectPicker.jsx',
 'NotificationsAutoRegister-Dn_C-rjK.js':'components/NotificationsAutoRegister.jsx',
 'notifications-BEtI2pcG.js':'services/notifications.js',
 'optimistic-Pk6VB-2G.js':'services/optimisticAssignments.js',
 'roleUtils-BDLO6O1S.js':'utils/roles.js',
 'useNotifications-fJ3DWoi9.js':'hooks/useNotifications.js',
 'useOptimizedChat-D_A1-F_L.js':'hooks/useOptimizedChat.js',
};
const pageNames=['AppHistory','Attendance','Dashboard','EventDetails','Events','PendingAssignment','PendingRequests','Roles','ServiceAreas','ServiceHistory','Settings','TuesdayTeaching','Udlv','Volunteers'];
const records=await fs.readdir(path.join(root,'recovered/hosting/assets'));
for(const file of records.filter(n=>n.endsWith('.js'))){
 if(names[file])continue;
 const page=pageNames.find(n=>file.startsWith(n+'-'));
 names[file]=page?'pages/'+page+'.jsx':'vendor/'+file;
}
const appFile='App-BPrQ3EPG.js',entryFile='index-BU_ZgoWo.js';
const exportsMap={
 [appFile]:{A:'AppModule',B:'BffError',M:'Modal',O:'OptimizedImage',a:'useGlobalData',b:'useAppDialog',c:'useChangeFeed',d:'firebaseAuth',e:'firestoreDb',f:'bffFetch',g:'getAvatarUrl',h:'isStrictBffAuth',i:'isBffEnabled',j:'dataUrlToBlob',k:'compressImage',l:'hasOtherMinistries',m:'getUdlvMinistryId',n:'normalizeMinistryName',o:'isHybridAuthEnabled',p:'resolveCachedImageUrl',q:'onSnapshot',r:'getUdlvMinistryName',s:'firebaseStorage',t:'hasUdlvAccess',u:'useAuth',v:'firebaseApp'},
 [entryFile]:{j:'jsxRuntime'},
 'EventsGrid-BNb5ngU2.js':{E:'EventsGrid'},
 'LoadingButton-DoDnirDC.js':{L:'LoadingButton'},
 'LoadingSpinner-DQ5LcqWB.js':{P:'LoadingSpinner'},
 'ManageMinistriesModal-BO1rzanM.js':{M:'ManageMinistriesModal'},
 'SelectPicker-D1mnbmt-.js':{S:'SelectPicker'},
 'roleUtils-BDLO6O1S.js':{N:'NO_ROLE_ID',f:'normalizeRoleId',i:'isUnassignedRole'},
 'optimistic-Pk6VB-2G.js':{o:'optimisticAssignments'},
 'useNotifications-fJ3DWoi9.js':{u:'useNotifications'},
 'useOptimizedChat-D_A1-F_L.js':{u:'useOptimizedChat'},
};
const appBindings={Ss:'PublicAuthLayout',ar:'AuthProvider',or:'LoginPage',ir:'RegisterPage',gr:'GlobalDataProvider',Pt:'DashboardLayout',kr:'ProtectedRoute',Nr:'AppDialogProvider',W:'lazyWithReload',Er:'ChunkErrorBoundary',B:'PageLoadingSpinner',$r:'App',Et:'AuthContext',At:'GlobalDataContext',Tt:'AppDialogContext',He:'buildFlags',Us:'firebaseConfig',Fs:'bffMode',Qe:'configuredPersistence',et:'authPersistence',Ae:'authReady',tt:'googleProvider',zs:'cloudFunctions',$s:'emulatorsEnabled',st:'firebaseRuntimeState',ct:'fallbackRolePermissions'};
const reactNames={r:'React',u:'useNavigate',c:'useLocation',L:'Link',N:'Navigate',O:'Outlet',e:'Routes',f:'Route',B:'BrowserRouter',d:'useParams'};
const asts=new Map(),report=[];
const parseJs=(text)=>parse(text,{sourceType:'module',plugins:['jsx']});
function splitDeclarations(ast){
 ast.program.body=ast.program.body.flatMap(n=>t.isVariableDeclaration(n)&&n.declarations.length>1?n.declarations.map(d=>t.variableDeclaration(n.kind,[d])):[n]);
}
function nameOf(node){return t.isIdentifier(node)?node.name:null;}
function statementNames(n){return t.isVariableDeclaration(n)?n.declarations.flatMap(d=>Object.keys(t.getBindingIdentifiers(d.id))):t.isFunctionDeclaration(n)||t.isClassDeclaration(n)?[n.id.name]:[];}
function renamed(programPath,from,to){
 if(from===to||!programPath.scope.hasOwnBinding(from))return;
 if(programPath.scope.hasOwnBinding(to))to='Recovered'+to;
 programPath.scope.rename(from,to);
}
function relative(from,to){let r=path.posix.relative(path.posix.dirname(from),to);return r.startsWith('.')?r:'./'+r;}
function dependencies(ast,selected){
 const moved=new Set(selected);const own=new Set(selected.flatMap(statementNames));const external=new Set();
 traverse(ast,{Program(p){p.scope.crawl();for(const stmt of selected){
   const pathNode=p.get('body').find(b=>b.node===stmt);if(!pathNode)continue;
   pathNode.traverse({ReferencedIdentifier(q){const binding=q.scope.getBinding(q.node.name);if(binding&&binding.scope===p.scope&&!own.has(q.node.name))external.add(q.node.name);}});
  }p.stop();}});return [...external];
}
const header='Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.\n';
for(const file of Object.keys(names)){
 const readable=path.join(root,'recovered/readable-assets',file);
 let text;try{text=await fs.readFile(readable,'utf8');}catch{text=await fs.readFile(path.join(root,'recovered/hosting/assets',file),'utf8');}
 if(file===appFile){text='import { recoveryEnvironment } from "./recovery-environment.js";\n'+text;text=text.replace('const He = {},','const He = recoveryEnvironment.flags,').replace('Nt = {};','Nt = recoveryEnvironment.flags;');const start=text.indexOf('  Us = {'),end=text.indexOf('  Le = Xt(Us),',start);text=text.slice(0,start)+'  Us = recoveryEnvironment.firebase,\n'+text.slice(end);}
 if(file===entryFile){text='import { recoveryEnvironment } from "./recovery-environment.js";\n'+text;text=text.replace('if ("serviceWorker" in navigator) {','if (recoveryEnvironment.enableServiceWorker && "serviceWorker" in navigator) {');text=text.replace('} catch {\n      const D = "chunk_reload";', '} catch (error) {\n      console.error("[MCI] Bootstrap failed", {name:error?.name,message:error?.message});\n      const D = "chunk_reload";');}
 const ast=parseJs(text);splitDeclarations(ast);asts.set(file,ast);
}
// The immutable compiler runtime is isolated so application modules no longer depend on bootstrap side effects.
const entry=asts.get(entryFile),runtimeNames=new Set(['ui','ve','vm','rs','ym','ws','mm']);
entry.program.body=entry.program.body.filter(n=>!statementNames(n).some(name=>runtimeNames.has(name)));
entry.program.body.unshift(t.importDeclaration([t.importSpecifier(t.identifier('mm'),t.identifier('jsxRuntime'))],t.stringLiteral('./__jsx-runtime.js')));
// Separate React DOM's published implementation from the small application entry point.
const reactDomStart=entry.program.body.findIndex(n=>statementNames(n).includes('ei'));
const reactDomEnd=entry.program.body.findIndex(n=>statementNames(n).includes('Is'));
if(reactDomStart<0||reactDomEnd<reactDomStart)throw new Error('Cannot identify published ReactDOM boundary');
const reactDomStatements=entry.program.body.slice(reactDomStart,reactDomEnd+1);
const reactDomDeps=dependencies(entry,reactDomStatements);
const originalEntryImports=entry.program.body.filter(n=>t.isImportDeclaration(n));
const reactDomImports=originalEntryImports.map(n=>t.importDeclaration(n.specifiers.filter(s=>reactDomDeps.includes(s.local.name)),t.cloneNode(n.source))).filter(n=>n.specifiers.length);
const reactDomAst=t.file(t.program([...reactDomImports,...reactDomStatements,t.exportNamedDeclaration(null,[t.exportSpecifier(t.identifier('Is'),t.identifier('reactDomClient'))])]));
entry.program.body.splice(reactDomStart,reactDomEnd-reactDomStart+1);
entry.program.body.unshift(t.importDeclaration([t.importSpecifier(t.identifier('Is'),t.identifier('reactDomClient'))],t.stringLiteral('./__react-dom.js')));
asts.set('__react-dom.js',reactDomAst);names['__react-dom.js']='vendor/react-dom.js';
// Face API / TensorFlow were bundled into CameraModal; preserve that vendor block separately.
const cameraFile='CameraModal-BwvRT9Xn.js',camera=asts.get(cameraFile);
const cameraStart=camera.program.body.findIndex(n=>!t.isImportDeclaration(n));
const cameraEnd=camera.program.body.findIndex(n=>statementNames(n).includes('Ss'));
if(cameraEnd>cameraStart){
 const sdkStatements=camera.program.body.slice(cameraStart,cameraEnd);
 const sdkOwn=new Set(sdkStatements.flatMap(statementNames));
 const rest=camera.program.body.filter(n=>!sdkStatements.includes(n));
 const restFile=t.file(t.program(rest));const referenced=new Set();
 traverse(restFile,{ReferencedIdentifier(p){if(sdkOwn.has(p.node.name))referenced.add(p.node.name);}});
 const sdkDeps=dependencies(camera,sdkStatements);
 const sdkImports=camera.program.body.filter(n=>t.isImportDeclaration(n)).map(n=>t.importDeclaration(n.specifiers.filter(s=>sdkDeps.includes(s.local.name)),t.cloneNode(n.source))).filter(n=>n.specifiers.length);
 const sdk=t.file(t.program([...sdkImports,...sdkStatements,t.exportNamedDeclaration(null,[...referenced].map(n=>t.exportSpecifier(t.identifier(n),t.identifier(n))))]));
 camera.program.body.splice(cameraStart,cameraEnd-cameraStart);
 camera.program.body.unshift(t.importDeclaration([...referenced].map(n=>t.importSpecifier(t.identifier(n),t.identifier(n))),t.stringLiteral('./__face-api.js')));
 asts.set('__face-api.js',sdk);names['__face-api.js']='vendor/face-api.js';
}
const iconNames={};
traverse(asts.get('vendor-ui-CnvYSvQL.js'),{Program(p){for(const node of p.node.body)if(t.isExportNamedDeclaration(node))for(const spec of node.specifiers||[]){const init=p.scope.getBinding(spec.local.name)?.path.node.init;if(t.isCallExpression(init)&&t.isStringLiteral(init.arguments[0]))iconNames[spec.exported.name]=init.arguments[0].value.split('-').map(s=>s[0].toUpperCase()+s.slice(1)).join('')+'Icon';}p.stop();}});
for(const [file,ast] of asts){
 if(file.startsWith('vendor-')||file.startsWith('html2canvas')||file.startsWith('index.es-')||file.startsWith('purify')||file.startsWith('__'))continue;
 traverse(ast,{Program(p){
  for(const node of [...p.node.body])if(t.isExportNamedDeclaration(node))for(const spec of node.specifiers||[]){
   const old=spec.exported.name,semantic=exportsMap[file]?.[old]||(old.length>2?old:null);
   if(semantic&&semantic!=='default'){renamed(p,spec.local.name,semantic);spec.exported=t.identifier(semantic);}
  }
  if(file===appFile)for(const [from,to]of Object.entries(appBindings))renamed(p,from,to);
  for(const node of p.node.body)if(t.isImportDeclaration(node)){
   const basename=node.source.value.split('/').pop();
   for(const spec of node.specifiers){
    if(!t.isImportSpecifier(spec))continue;
    const old=spec.imported.name;const semantic=exportsMap[basename]?.[old]||(basename==='vendor-react-BwINE3B3.js'?reactNames[old]:basename==='vendor-ui-CnvYSvQL.js'?iconNames[old]:null);
    if(semantic){renamed(p,spec.local.name,semantic);if(exportsMap[basename]?.[old])spec.imported=t.identifier(semantic);}
   }
  }
  p.stop();
  for(const node of p.node.body)if(t.isVariableDeclaration(node))for(const declaration of node.declarations){
   if(!t.isIdentifier(declaration.id)||!t.isCallExpression(declaration.init)||declaration.init.callee.name!=='lazyWithReload')continue;
   let page;
   t.traverseFast(declaration.init,n=>{if(n.type==='ImportExpression'&&t.isStringLiteral(n.source)){const old=n.source.value.split('/').pop();if(names[old]?.startsWith('pages/'))page=path.posix.basename(names[old],'.jsx')+'Page';}});
   if(file===appFile&&page)renamed(p,declaration.id.name,page);
  }
  if(file===appFile)for(const [component,mapping]of Object.entries({
   LoginPage:{t:'logoPath',s:'logoFailed',r:'setLogoFailed',n:'versionedLogoSrc',a:'username',l:'setUsername',c:'password',f:'setPassword',h:'showPassword',b:'setShowPassword',p:'error',u:'setError',E:'isSubmitting',v:'setSubmitting',_:'isGoogleSubmitting',k:'setGoogleSubmitting',y:'navigate',L:'location',T:'user',A:'userProfile',N:'refreshUserProfile',I:'infoMessage',i:'setInfoMessage',m:'handlePasswordLogin',g:'handleGoogleLogin'},
   RegisterPage:{t:'logoPath',s:'logoFailed',r:'setLogoFailed',n:'versionedLogoSrc',a:'fullName',l:'setFullName',c:'username',f:'setUsername',h:'password',b:'setPassword',p:'showPassword',u:'setShowPassword',E:'error',v:'setError',_:'isSubmitting',k:'setSubmitting',y:'navigate',L:'user',T:'handleRegister'},
  })){const binding=p.scope.getBinding(component);if(binding){const scope=binding.path.get('init').scope;for(const [from,to]of Object.entries(mapping))if(scope.hasOwnBinding(from))scope.rename(from,to);}}
  p.stop();
 }});
}
// Give every React component expression a valid, traceable JSX tag name.
for(const [file,ast]of asts){if(!names[file].endsWith('.jsx'))continue;
 let index=0;
 traverse(ast,{CallExpression(p){if(!t.isMemberExpression(p.node.callee)||!['jsx','jsxs'].includes(p.node.callee.property.name))return;const type=p.node.arguments[0];if(t.isIdentifier(type)&&!/^[A-Z_$]/.test(type.name)){const binding=p.scope.getBinding(type.name);if(binding)binding.scope.rename(type.name,'RenderComponent'+(++index));}}});
 let converted=0,retained=0;
 function jsxName(node){if(t.isStringLiteral(node)&&/^[a-zA-Z][a-zA-Z0-9:_-]*$/.test(node.value))return t.jsxIdentifier(node.value);if(t.isIdentifier(node)&&/^[A-Z_$]/.test(node.name))return t.jsxIdentifier(node.name);if(t.isMemberExpression(node)&&!node.computed){const left=jsxName(node.object)||t.jsxIdentifier(node.object.name);return t.jsxMemberExpression(left,t.jsxIdentifier(node.property.name));}return null;}
 traverse(ast,{CallExpression:{exit(p){
  const node=p.node;if(!t.isMemberExpression(node.callee)||!['jsx','jsxs'].includes(node.callee.property.name))return;
  const [type,props,key]=node.arguments,tag=jsxName(type);
  if(!tag||!t.isObjectExpression(props)||node.arguments.length>3||key&&(!t.isIdentifier(key)&&!t.isLiteral(key)||props.properties.some(n=>t.isSpreadElement(n)||n.key?.name==='key'||n.key?.value==='key'))){retained++;return;}
  const attrs=[],children=[];const properties=[...props.properties];let child;
  const last=properties.at(-1);if(t.isObjectProperty(last)&&!last.computed&&(last.key.name||last.key.value)==='children'){child=last.value;properties.pop();}
  for(const property of properties){if(t.isSpreadElement(property)){attrs.push(t.jsxSpreadAttribute(property.argument));continue;}
   if(!t.isObjectProperty(property)||property.computed){attrs.push(t.jsxSpreadAttribute(t.objectExpression([property])));continue;}
   const name=property.key.name||property.key.value;if(!/^[A-Za-z_$][A-Za-z0-9_$:-]*$/.test(name)){attrs.push(t.jsxSpreadAttribute(t.objectExpression([property])));continue;}
   const value=t.isStringLiteral(property.value)&&!/[\r\n]/.test(property.value.value)?t.stringLiteral(property.value.value):t.jsxExpressionContainer(property.value);
   attrs.push(t.jsxAttribute(t.jsxIdentifier(name),value));
  }
  if(key)attrs.push(t.jsxAttribute(t.jsxIdentifier('key'),t.jsxExpressionContainer(key)));
  if(child)children.push(t.isJSXElement(child)||t.isJSXFragment(child)?child:t.jsxExpressionContainer(child));
  const element=t.jsxElement(t.jsxOpeningElement(t.cloneNode(tag),attrs,!children.length),children.length?t.jsxClosingElement(t.cloneNode(tag)):null,children,!children.length);
  p.replaceWith(element);converted++;
 }}});
 report.push({publishedFile:file,reconstructedFile:names[file],jsxExpressions:converted,retainedRuntimeCalls:retained});
}
// Rewrite all module references and export-access sites after semantic export renaming.
// Partition the central published chunk into named application boundaries.
const app=asts.get(appFile);
const appOwner=new Map();
const own=(file,bindings)=>{for(const name of bindings)appOwner.set(name,file);};
own('firebase/functions-sdk.js',['Ue','bt','Rs','Is','Ls','Ye','Xe','Ps','Ts','Ms','Ds','Os','yt']);
own('firebase/client.js',['buildFlags','firebaseConfig','firebaseApp','firestoreDb','bffMode','configuredPersistence','authPersistence','firebaseAuth','authReady','googleProvider','firebaseStorage','cloudFunctions','emulatorsEnabled','firebaseRuntimeState']);
own('auth/AuthProvider.jsx',['AuthContext','useAuth','AuthProvider','fallbackRolePermissions']);
own('pages/Login.jsx',['LoginPage']);own('pages/Register.jsx',['RegisterPage']);
own('data/GlobalDataProvider.jsx',['GlobalDataContext','useGlobalData','GlobalDataProvider']);
own('dialogs/AppDialogProvider.jsx',['AppDialogContext','AppDialogProvider','useAppDialog']);
own('app/DashboardLayout.jsx',['DashboardLayout']);own('app/ProtectedRoute.jsx',['ProtectedRoute','De']);
own('components/Modal.jsx',['Modal']);
own('components/OptimizedImage.jsx',['OptimizedImage']);
own('utils/images.js',['lr','cr','dr','getAvatarUrl','compressImage','dataUrlToBlob','Me','br','yr','vr','wr','dt','resolveCachedImageUrl']);
own('utils/ministries.js',['Ct','normalizeMinistryName','pr','St','getUdlvMinistryId','getUdlvMinistryName','hasUdlvAccess','hasOtherMinistries']);
own('app/App.jsx',['App','AppModule','PublicAuthLayout','ChunkErrorBoundary','PageLoadingSpinner','lazyWithReload']);
 for(const node of app.program.body)if(t.isVariableDeclaration(node))for(const d of node.declarations)if(t.isIdentifier(d.id)&&t.isCallExpression(d.init)&&d.init.callee.name==='lazyWithReload')appOwner.set(d.id.name,'app/App.jsx');
const groups=new Map();const imports=app.program.body.filter(n=>t.isImportDeclaration(n));
for(const node of app.program.body){
 if(t.isImportDeclaration(node)||t.isExportNamedDeclaration(node))continue;
 const bindings=statementNames(node);let owner=bindings.length?appOwner.get(bindings[0]):null;
 if(!owner&&t.isExpressionStatement(node)&&t.isCallExpression(node.expression)&&node.expression.callee.name==='Ds')owner='firebase/functions-sdk.js';
 if(!owner&&t.isExpressionStatement(node)&&t.isLogicalExpression(node.expression)&&node.expression.left.name==='emulatorsEnabled')owner='firebase/client.js';
 if(!owner&&t.isExpressionStatement(node)&&t.isAssignmentExpression(node.expression)&&node.expression.left.object?.name==='DashboardLayout')owner='app/DashboardLayout.jsx';
 owner||='app/runtime.jsx';for(const name of bindings)appOwner.set(name,owner);
 if(!groups.has(owner))groups.set(owner,[]);groups.get(owner).push(node);
}
const originalAppExports=app.program.body.filter(n=>t.isExportNamedDeclaration(n)).flatMap(n=>n.specifiers);
const moduleToOld=new Map();for(const [file,target]of Object.entries(names))moduleToOld.set(target,file);
for(const [target,statements]of groups){
 const refs=dependencies(app,statements);const ownNames=new Set(statements.flatMap(statementNames));const importNodes=[];
 for(const original of imports){const selected=original.specifiers.filter(s=>refs.includes(s.local.name));if(selected.length)importNodes.push(t.importDeclaration(selected.map(s=>t.cloneNode(s)),t.cloneNode(original.source)));}
 const bySource=new Map();for(const name of refs){if(ownNames.has(name)||!appOwner.has(name)||appOwner.get(name)===target)continue;const owner=appOwner.get(name);if(!bySource.has(owner))bySource.set(owner,[]);bySource.get(owner).push(name);}
 for(const [owner,bindings]of bySource)importNodes.push(t.importDeclaration(bindings.map(n=>t.importSpecifier(t.identifier(n),t.identifier(n))),t.stringLiteral('@reconstructed/'+owner)));
 const exports=[...ownNames].map(n=>t.exportSpecifier(t.identifier(n),t.identifier(n)));
 if(target==='app/App.jsx')for(const spec of originalAppExports){const owner=appOwner.get(spec.local.name);if(owner&&owner!==target)importNodes.push(t.exportNamedDeclaration(null,[t.cloneNode(spec)],t.stringLiteral('@reconstructed/'+owner)));}
 const partition=t.file(t.program([...importNodes,...statements,t.exportNamedDeclaration(null,exports)]));
 if(target==='app/App.jsx')asts.set(appFile,partition);else{const id='__partition__'+target;asts.set(id,partition);names[id]=target;}
}
for(const [file,ast]of asts){
 const from=names[file];
 traverse(ast,{ImportDeclaration(p){const old=p.node.source.value.split('/').pop();if(old==='recovery-environment.js'){p.node.source.value=relative(from,'config/environment.js');return;}if(old==='__jsx-runtime.js'){p.node.source.value=relative(from,'vendor/jsx-runtime.js');return;}if(old===entryFile){p.node.source.value=relative(from,'vendor/jsx-runtime.js');return;}if(names[old])p.node.source.value=relative(from,names[old]);},CallExpression(p){if(p.node.callee.type==='Import'&&t.isStringLiteral(p.node.arguments[0])){const old=p.node.arguments[0].value.split('/').pop();if(names[old])p.node.arguments[0].value=relative(from,names[old]);}},MemberExpression(p){
  // Dynamic App import is the sole namespace access to a renamed export.
  if(file===entryFile&&p.node.property.name==='A')p.node.property=t.identifier('AppModule');
 },ImportExpression(p){if(!t.isStringLiteral(p.node.source))return;const old=p.node.source.value.split('/').pop();if(names[old])p.node.source.value=relative(from,names[old]);}});
 for(const node of ast.program.body)if((t.isImportDeclaration(node)||t.isExportNamedDeclaration(node))&&node.source?.value.startsWith('@reconstructed/'))node.source.value=relative(from,node.source.value.slice('@reconstructed/'.length));
 // A Firebase Storage Emulator URL must follow the authenticated download route,
 // like the production Storage URL. Keep this deliberate demo fix reproducible.
 if(from==='pages/EventDetails.jsx'){
  ast.program.body.unshift(t.importDeclaration([t.importSpecifier(t.identifier('extractEmulatorStoragePath'),t.identifier('extractEmulatorStoragePath'))],t.stringLiteral('../utils/storage-path.js')));
  traverse(ast,{VariableDeclarator(p){if(p.node.id.name==='Gt'&&t.isArrowFunctionExpression(p.node.init)&&t.isBlockStatement(p.node.init.body))p.node.init.body.body.unshift(...parseJs('function adapter(){const emulatorPath = extractEmulatorStoragePath(t); if (emulatorPath) return emulatorPath;}').program.body[0].body.body);}});
 }
 let code=generate(ast,{comments:true,jsescOption:{minimal:true}}).code;
 if(from.endsWith('.jsx'))code=await prettier.format(code,{parser:'babel',filepath:from});
 await emit(path.join('frontend/src',from),'// '+header+code.trimEnd()+'\n');
}
if(!check){await fs.mkdir(path.join(root,'recovery'),{recursive:true});await fs.writeFile(path.join(root,'recovery/frontend-reconstruction.json'),JSON.stringify({originalSourcesRecovered:false,method:'AST reconstruction with semantic module/export names and JSX derived from published calls; dependencies preserved',modules:report,generatedBaseline:generatedFiles,entry:'frontend/src/main.jsx'},null,2)+'\n');}
console.log(check?'Reproducible baseline verified.':'Reconstructed JSX modules:',report.length,'JSX expressions:',report.reduce((n,m)=>n+m.jsxExpressions,0),'files:',generatedFiles.length);
