import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
const expression = (source) => parse('const adapter=' + source, { sourceType: 'module', plugins: ['jsx'] }).program.body[0].declarations[0].init;
const importNames = (ast, source, names) => ast.program.body.unshift(t.importDeclaration(names.map((name) => typeof name === 'string' ? t.importSpecifier(t.identifier(name), t.identifier(name)) : t.importSpecifier(t.identifier(name[1]), t.identifier(name[0]))), t.stringLiteral(source)));
const within = (path, name) => !!path.findParent((parent) => parent.isVariableDeclarator() && parent.node.id.name === name);
function addDependency(effect, dependency) {
  if (effect?.node.arguments[1]?.type === 'ArrayExpression') effect.node.arguments[1].elements.push(expression(dependency));
}
function photoEffect(source, setSource, setLoading) {
  return expression(`() => {
    const controller=new AbortController(); let resolved;
    ${setSource}(''); ${setLoading}(!!${source});
    if(${source}) resolveCachedImageUrl(${source},{signal:controller.signal}).then(url=>{
      if(controller.signal.aborted) releaseProtectedImage(url);
      else {resolved=url;${setSource}(url||'');}
    }).catch(()=>{if(!controller.signal.aborted)${setSource}('');}).finally(()=>{if(!controller.signal.aborted)${setLoading}(false);});
    return()=>{controller.abort();releaseProtectedImage(resolved);};
  }`);
}

export function adaptAssignmentPrivacy(ast, from) {
  if (from === 'utils/images.js') {
    importNames(ast, '../services/private-image-client.js', ['resolveProtectedImage', 'protectedImageProxy']);
    traverse(ast, { VariableDeclarator(path) {
      if (path.node.id.name === 'resolveCachedImageUrl') path.node.init = expression(`async (source,options) => { if(typeof source!=='string'||!source)return source; return protectedImageProxy(source)?resolveProtectedImage(source,options):source; }`);
    } });
  }
  if (from === 'components/OptimizedImage.jsx') {
    importNames(ast, '../services/private-image-client.js', ['releaseProtectedImage', 'protectedImageProxy']);
    let firstEffect = true;
    traverse(ast, { CallExpression(path) {
      if (!within(path, 'OptimizedImage') || !t.isMemberExpression(path.node.callee)) return;
      if (path.node.callee.object.name === 'React' && path.node.callee.property.name === 'useState') {
        const name = path.node.arguments[0]?.name;
        if (['t', 's'].includes(name)) path.node.arguments[0] = expression(`protectedImageProxy(${name})?'':${name}`);
      }
      if (firstEffect && path.node.callee.object.name === 'React' && path.node.callee.property.name === 'useEffect') {
        firstEffect = false;
        path.node.arguments[0] = expression(`()=>{const controller=new AbortController();let thumbnail,full;y(false);T(false);N(false);i(false);E(protectedImageProxy(t)?'':t);_(protectedImageProxy(s)?'':s);(async()=>{try{if(!t){E('');N(true);y(true);return;}thumbnail=await resolveCachedImageUrl(t,{signal:controller.signal});full=s?await resolveCachedImageUrl(s,{signal:controller.signal}):undefined;if(controller.signal.aborted){releaseProtectedImage(thumbnail);releaseProtectedImage(full);return;}E(thumbnail);_(full);}catch{releaseProtectedImage(thumbnail);releaseProtectedImage(full);if(!controller.signal.aborted){E('');_(undefined);N(true);y(true);}}})();return()=>{controller.abort();releaseProtectedImage(thumbnail);releaseProtectedImage(full);};}`);
      }
    } });
  }
  if (from === 'pages/Dashboard.jsx') {
    traverse(ast, { AssignmentExpression(path) {
      if (path.node.left.name === 'Q' && t.isAwaitExpression(path.node.right) && path.node.right.argument?.callee?.name === 'rs') path.node.right = t.memberExpression(t.identifier('Z'), t.identifier('fullPath'));
    } });
  }
  if (!['pages/Attendance.jsx', 'pages/EventDetails.jsx', 'pages/Events.jsx'].includes(from)) return;
  const component = from.split('/').at(-1).replace('.jsx', '');
  const profile = { Attendance: 're', EventDetails: 'z', Events: 'd' }[component];
  importNames(ast, '../services/assignment-client.js', ['assignmentPrivacyKey', 'assignmentManagedAreas', ...(component === 'Attendance' ? ['readScopedAssignments', 'watchScopedAssignments', ['trackedAssignmentCollection', 'de'], ['trackedAssignmentQuery', 'we'], ['trackedAssignmentWhere', 'ie']] : ['watchAssignmentView', 'prepareAssignmentView'])]);
  if (component !== 'Events') {
    importNames(ast, '../services/private-image-client.js', ['releaseProtectedImage']);
    importNames(ast, '../components/PrivateImage.jsx', ['PrivateImage']);
  }
  if (component === 'Attendance') {
    for (const node of ast.program.body) if (t.isImportDeclaration(node) && node.source.value.endsWith('vendor-firebase-BjYbfC3F.js')) node.specifiers = node.specifiers.filter((specifier) => !['de', 'we', 'ie'].includes(specifier.local.name));
  }
  traverse(ast, {
    VariableDeclarator(path) {
      if (component === 'Attendance' && path.node.id.name === 'ks') path.node.init = expression(`async(eventId,userId,privacyProfile)=>{const snapshot=await readScopedAssignments(we(de(firestoreDb,'events',eventId,'assignments'),ie('userId','==',userId)),privacyProfile);return snapshot.docs;}`);
      if (!within(path, component)) return;
      if (component === 'Attendance' && path.node.id.name === 'n' && t.isTemplateLiteral(path.node.init) && path.node.init.quasis.some((part) => part.value.raw.includes('attendance_peopleStats_'))) path.node.init = t.binaryExpression('+', expression('assignmentPrivacyKey(re)'), path.node.init);
      if (component === 'EventDetails' && path.node.id.name === 'o' && path.node.init?.callee?.name === 'lt' && path.node.init.arguments[0]?.name === 'r') {
        path.node.init = expression(`watchAssignmentView(r,z,rows=>Fe(prepareAssignmentView(rows,z,ue,ge)),error=>console.error('Error listening to authorized assignment view',error))`);
      }
      if (component === 'Events' && path.node.id.name === 'q' && path.node.init?.callee?.name === 'we' && path.node.init.arguments[0]?.name === 'B') path.node.init = expression(`watchAssignmentView(B,d,rows=>{const assignments=prepareAssignmentView(rows,d,P,p).map(row=>({...row,eventId:y}));x(previous=>[...previous.filter(row=>row.eventId!==y),...assignments]);},error=>console.warn('Error listening to authorized assignment view',error))`);
      if (component === 'EventDetails' && path.node.id.name === 't' && t.isConditionalExpression(path.node.init) && path.node.init.test?.callee?.name === 'Q' && path.node.init.alternate?.name === 'q') path.node.init = t.callExpression(t.memberExpression(path.node.init, t.identifier('filter')), [expression('row=>row.attendanceVisible===true')]);
      if (component === 'EventDetails' && path.node.id.name === 'st') path.node.init = expression(`source=>{const value=String(source??'').trim();Cr(value||null);ne('');oe(!!value);}`);
      if (component === 'Attendance' && path.node.id.name === 'Ze') path.node.init = expression(`source=>{const value=String(source??'').trim();ra(value||null);ot('');lt(!!value);}`);
    },
    CallExpression(path) {
      if (!within(path, component)) return;
      const areaGetter = { Attendance: 'le', EventDetails: 'ee', Events: 'c' }[component];
      if (path.node.callee.name === areaGetter) {
        const binding = path.scope.getBinding(areaGetter);
        if (binding?.path.node.init?.callee?.name === 'useAuth') { path.node.callee = t.identifier('assignmentManagedAreas'); path.node.arguments = [t.identifier(profile)]; }
      }
      if (component === 'Attendance' && path.node.callee.name === 'ks') path.node.arguments.push(t.identifier('re'));
      if (component === 'Attendance' && path.node.callee.name === 'ye') { path.node.callee = t.identifier('readScopedAssignments'); path.node.arguments.push(t.identifier('re')); }
      if (component === 'Attendance' && path.node.callee.name === 'gt') { path.node.callee = t.identifier('watchScopedAssignments'); path.node.arguments.splice(1, 0, t.identifier('re')); }
      if (component === 'EventDetails' && path.node.callee.name === 'Fe' && t.isConditionalExpression(path.node.arguments[0])) {
        let assignments = false; t.traverseFast(path.node.arguments[0], (node) => { if (t.isMemberExpression(node) && node.property.name === 'assignments') assignments = true; });
        if (assignments) path.node.arguments[0] = t.callExpression(t.identifier('prepareAssignmentView'), [path.node.arguments[0], t.identifier('z'), t.identifier('ue'), t.identifier('ge')]);
      }
      if (t.isMemberExpression(path.node.callee) && path.node.callee.object.name === 'React' && path.node.callee.property.name === 'useEffect') {
        const dependencies = path.node.arguments[1];
        if (component === 'EventDetails' && dependencies?.elements?.length === 1 && dependencies.elements[0]?.name === 'be') path.node.arguments[0] = photoEffect('be', 'ne', 'oe');
        if (component === 'Attendance' && dependencies?.elements?.length === 1 && dependencies.elements[0]?.name === 'wt') path.node.arguments[0] = photoEffect('wt', 'ot', 'lt');
        if (component === 'Attendance' || component === 'EventDetails' || (component === 'Events' && dependencies?.elements?.some((node) => node?.name === 'H'))) addDependency(path, `assignmentPrivacyKey(${profile})`);
        if (component === 'EventDetails' && dependencies?.elements?.some((node) => node?.name === 'l')) { addDependency(path, 'ue'); addDependency(path, 'ge'); }
        if (component === 'Events' && dependencies?.elements?.some((node) => node?.name === 'H')) { addDependency(path, 'P'); addDependency(path, 'p'); }
      }
      if (component !== 'Events' && t.isStringLiteral(path.node.arguments[0]) && path.node.arguments[0].value === 'img' && t.isMemberExpression(path.node.callee) && ['jsx', 'jsxs'].includes(path.node.callee.property.name)) path.node.arguments[0] = t.identifier('PrivateImage');
    },
    JSXIdentifier(path) { if (component !== 'Events' && path.node.name === 'img') path.node.name = 'PrivateImage'; },
    JSXAttribute(path) {
      if (component === 'Events' || path.node.name.name !== 'href' || !t.isJSXExpressionContainer(path.node.value)) return;
      const value = path.node.value.expression;
      if (t.isLogicalExpression(value) && ((component === 'EventDetails' && value.left.name === 'Tt' && value.right.name === 'be') || (component === 'Attendance' && value.left.name === 'Ss' && value.right.name === 'wt'))) path.node.value.expression = t.logicalExpression('||', value.left, t.identifier('undefined'));
    },
  });
  // Clear any already rendered private rows when the authenticated scope changes.
  traverse(ast, { VariableDeclarator(path) {
    if (path.node.id.name !== component || !t.isArrowFunctionExpression(path.node.init)) return;
    const setter = { Attendance: 'jt', EventDetails: 'Fe', Events: 'x' }[component];
    const body = path.node.init.body.body;
    const index = body.findIndex((statement) => t.isVariableDeclaration(statement) && setter in t.getBindingIdentifiers(statement));
    if (index < 0) throw new Error('Cannot identify private assignment state boundary: ' + component);
    const reset = { Attendance: 'Qt([]);jt({});Xt([]);', EventDetails: 'Fe([]);', Events: 'x([]);' }[component];
    body.splice(index + 1, 0, t.expressionStatement(expression(`React.useEffect(()=>{${reset}},[assignmentPrivacyKey(${profile})])`)));
  } });
}
