import {parse} from 'acorn';
import {readFile,writeFile} from 'node:fs/promises';
const base=new URL('../',import.meta.url);
const routes=[];
function walk(node,sourceName){if(!node||typeof node!=='object')return;
 if(node.type==='CallExpression'&&node.callee.type==='MemberExpression'&&node.callee.object.name==='app'&&['get','post','put','patch','delete'].includes(node.callee.property.name)&&typeof node.arguments[0]?.value==='string')routes.push({method:node.callee.property.name.toUpperCase(),path:node.arguments[0].value});
 if(sourceName.endsWith('admin-read-routes.js')&&node.type==='CallExpression'&&node.callee.name==='route'&&typeof node.arguments[0]?.value==='string')routes.push({method:'GET',path:node.arguments[0].value});
 for(const value of Object.values(node)){if(Array.isArray(value))value.forEach(child=>walk(child,sourceName));else if(value&&typeof value==='object')walk(value,sourceName);}
}
const sources=['functions/lib/index.js','functions/lib/admin-read-routes.js'];
for(const sourceName of sources){const source=await readFile(new URL(sourceName,base),'utf8');walk(parse(source,{ecmaVersion:'latest',sourceType:'script'}),sourceName);}
const frontend=JSON.parse(await readFile(new URL('recovered/frontend-contracts.json',base),'utf8'));
const normalized=p=>p.split('?')[0].replace(/\{[^}]+\}|:[^/]+/g,':param').replace(/\/$/,'');
const calls=frontend.api_calls||frontend.http_calls||frontend.calls||[];
const refs=[...new Map(calls.map(c=>[c.method+' '+(c.path||c.route),{method:c.method,path:c.path||c.route}])).values()];
const comparison=refs.map(c=>({...c,registeredInRecoveredBackend:routes.some(r=>r.method===c.method&&normalized(r.path)===normalized(c.path))}));
await writeFile(new URL('recovered/backend-http-contracts.json',base),JSON.stringify({source:sources,registeredRoutes:routes,frontendReferences:comparison,notes:['Static registration comparison; excludes Firestore client operations and does not prove endpoint authorization or response compatibility.','Frontend BFF flags were disabled in the published bundle.','Six admin read contracts were reconstructed from client call sites and are registered through registerAdminReadRoutes.']},null,2)+'\n');
console.log('Recovered backend HTTP registrations:',routes.length,'frontend references compared:',comparison.length);
