import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir,access} from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {parse} from '@babel/parser';
import traverse from '@babel/traverse';
import {jsx} from '../frontend/src/vendor/jsx-runtime.js';
import {normalizeRoleId,isUnassignedRole,NO_ROLE_ID} from '../frontend/src/utils/roles.js';
import {normalizeMinistryName,getUdlvMinistryId,hasUdlvAccess,hasOtherMinistries} from '../frontend/src/utils/ministries.js';
import {dataUrlToBlob,getAvatarUrl} from '../frontend/src/utils/images.js';
const root=fileURLToPath(new URL('../',import.meta.url));
test('reconstructed JSX runtime preserves published key, ref, props and element behavior',async()=>{
 const published=await readFile(path.join(root,'recovered/readable-assets/index-BU_ZgoWo.js'),'utf8');
 const begin=published.indexOf('var ui ='),end=published.indexOf('var mm = ws()');
 assert.ok(begin>=0&&end>begin);
 const original=vm.runInNewContext('(function(){'+published.slice(begin,end)+';return ws().jsx;})()',{Symbol});
 const ref={},type=()=>null,child={id:1};
 const inherited=Object.create({label:'inherited'});inherited.key='own';inherited.children=child;
 for(const [props,key] of [[{},undefined],[{children:'A'},2],[{children:[child,'text',0],ref},undefined],[{key:'explicit',value:false},'fallback'],[inherited,'fallback']]){
  const expected=original(type,props,key),actual=jsx(type,props,key);
  assert.equal(actual.$$typeof,expected.$$typeof);assert.equal(actual.type,expected.type);assert.equal(actual.key,expected.key);assert.equal(actual.ref,expected.ref);
  assert.deepEqual(Object.keys(actual.props),Object.keys(expected.props));for(const name of Object.keys(actual.props))assert.equal(actual.props[name],expected.props[name]);
  if(!('key'in props))assert.equal(actual.props,props);
 }
});
test('every published router path is retained in the reconstructed JSX',async()=>{
 const before=parse(await readFile(path.join(root,'recovered/readable-assets/App-BPrQ3EPG.js'),'utf8'),{sourceType:'module'});
 const after=parse(await readFile(path.join(root,'frontend/src/app/App.jsx'),'utf8'),{sourceType:'module',plugins:['jsx']});
 const original=[],rebuilt=[];
 traverse(before,{CallExpression(p){if(p.node.arguments[0]?.name!=='M')return;const props=p.node.arguments[1];if(props?.type!=='ObjectExpression')return;const route=props.properties.find(n=>n.key?.name==='path');if(route?.value.type==='StringLiteral')original.push(route.value.value);}});
 traverse(after,{JSXOpeningElement(p){if(p.node.name.name!=='Route')return;const route=p.node.attributes.find(n=>n.name?.name==='path');if(route?.value.type==='StringLiteral')rebuilt.push(route.value.value);}});
 assert.ok(original.length>=15);assert.deepEqual(rebuilt.sort(),original.sort());
});
test('all reconstructed relative imports and lazy pages resolve to real files',async()=>{
 const files=[];async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())await walk(f);else if(/\.(jsx?|mjs)$/.test(e.name))files.push(f);}}
 await walk(path.join(root,'frontend/src'));let count=0;
 for(const file of files){const ast=parse(await readFile(file,'utf8'),{sourceType:'module',plugins:['jsx']});const refs=[];traverse(ast,{ImportDeclaration(p){refs.push(p.node.source.value);},ExportNamedDeclaration(p){if(p.node.source)refs.push(p.node.source.value);},ImportExpression(p){if(p.node.source.type==='StringLiteral')refs.push(p.node.source.value);}});for(const ref of refs)if(ref.startsWith('.')){await access(path.resolve(path.dirname(file),ref));count++;}}
 assert.ok(count>100);
});
test('role sentinel and ministry membership preserve published behavior',()=>{
 assert.equal(isUnassignedRole(undefined),true);assert.equal(isUnassignedRole('  '),true);assert.equal(isUnassignedRole(NO_ROLE_ID),true);assert.equal(normalizeRoleId(' admin '),'admin');
 assert.equal(normalizeMinistryName('  Ú DE  LA VIDA  '),'u de la vida');
 const ministries=[{id:'udlv',name:'U de la Vida'},{id:'music',name:'Alabanza'}];
 assert.equal(getUdlvMinistryId(ministries),'udlv');assert.equal(hasUdlvAccess({assignedMinistries:['udlv']},ministries),true);assert.equal(hasUdlvAccess({areas:['u de la vida']},ministries),true);assert.equal(hasUdlvAccess({assignedMinistries:['music']},ministries),false);assert.equal(hasOtherMinistries({assignedMinistries:['udlv','music']},ministries),true);
});
test('image helpers retain Firebase path sanitization and data URL decoding',async()=>{
 assert.equal(await dataUrlToBlob('data:text/plain;base64,SG9sYQ==').text(),'Hola');assert.equal(await dataUrlToBlob('data:text/plain,Hola%20MCI').text(),'Hola MCI');assert.throws(()=>dataUrlToBlob('https://example.com/x'),/INVALID_DATA_URL/);
 assert.equal(getAvatarUrl('https://firebasestorage.googleapis.com/v0/b/demo/o/profile-photos%2Fu%2Fa.png?token=private-token'),'/api/download?path=profile-photos%2Fu%2Fa.png&inline=1');
});
