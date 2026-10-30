import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { transformSync } from 'esbuild';
import { createPrivateImageLoader } from '../frontend/src/services/private-images.js';

const flush = async () => { for (let step = 0; step < 15; step++) await Promise.resolve(); };
const response = () => ({ ok: true, headers: new Headers({'content-type':'image/jpeg'}), blob: async () => new Blob(['synthetic-photo'], {type:'image/jpeg'}) });
const componentSource = (await readFile(new URL('../frontend/src/components/OptimizedImage.jsx', import.meta.url), 'utf8')).replace(/^import .*;\r?\n/gm, '').replace('export { OptimizedImage };', '');
const code = transformSync(componentSource, {loader:'jsx', jsx:'transform', jsxFactory:'React.createElement'}).code;

function fixture({ request, observerAvailable = true } = {}) {
  const network = [], revoked = [], observers = [];
  const loader = createPrivateImageLoader({
    auth: {currentUser:{getIdToken:async () => 'synthetic-signed-token'}},
    request: async (...args) => { network.push(args); return request ? request(...args) : response(); },
    objectURL: {createObjectURL:() => 'blob:fixture-' + network.length, revokeObjectURL:(url) => revoked.push(url)}
  });
  let hookIndex, effects, dirty = false, props, tree;
  const hooks = [];
  const React = {
    useRef(initial) { const index = hookIndex++; if (!hooks[index]) hooks[index] = {current:initial}; return hooks[index]; },
    useState(initial) {
      const index = hookIndex++;
      if (!hooks[index]) hooks[index] = {value:typeof initial === 'function' ? initial() : initial};
      return [hooks[index].value, (value) => {
        const next = typeof value === 'function' ? value(hooks[index].value) : value;
        if (!Object.is(next, hooks[index].value)) { hooks[index].value = next; dirty = true; }
      }];
    },
    useEffect(callback, dependencies) {
      const index = hookIndex++, previous = hooks[index];
      if (!previous || dependencies.some((value, item) => !Object.is(value, previous.dependencies[item]))) {
        effects.push(() => { previous?.cleanup?.(); hooks[index] = {dependencies, cleanup:callback()}; });
      }
    },
    createElement(type, attributes, ...children) {
      if (attributes?.ref && !attributes.ref.current) attributes.ref.current = {element:type};
      return {type, props:{...attributes, children:children.flat(Infinity)}};
    }
  };
  class Observer {
    constructor(callback, options) { this.callback = callback; this.options = options; observers.push(this); }
    observe(element) { this.element = element; }
    disconnect() { this.disconnected = true; }
  }
  const context = {React, AbortController, resolveCachedImageUrl:(source, options) => loader.load(source, options), releaseProtectedImage:(source) => loader.release(source)};
  if (observerAvailable) context.IntersectionObserver = Observer;
  const component = vm.runInNewContext('(function(){' + code + ';return OptimizedImage;})()', context);
  const render = (next = props) => {
    props = next;
    let rounds = 0;
    do {
      dirty = false; hookIndex = 0; effects = [];
      tree = component(props);
      for (const effect of effects) effect();
      assert.ok(rounds++ < 15, 'component render settles');
    } while (dirty);
    return tree;
  };
  return {
    network, revoked, observers, render,
    get tree() { return tree; },
    async settle() { await flush(); if (dirty) render(); await flush(); if (dirty) render(); },
    visible() { observers.at(-1).callback([{isIntersecting:true}]); render(); },
    unmount() { for (const hook of hooks) hook?.cleanup?.(); },
  };
}
const imageNodes = (node) => !node || typeof node !== 'object' ? [] : [ ...(node.type === 'img' ? [node] : []), ...(node.props?.children || []).flatMap(imageNodes) ];
const thumbnail = 'attendance/event/assignment/thumb.jpg', original = 'attendance/event/assignment/original.jpg';

test('offscreen protected thumbnail and original cause no HTTP request until visibility', async () => {
  const app = fixture();
  app.render({src:thumbnail, fullSrc:original, alt:'Foto privada'});
  await app.settle();
  assert.equal(app.network.length,0);
  assert.equal(imageNodes(app.tree).length,0);
  assert.equal(app.tree.props['data-image-state'],'deferred');
  assert.equal(app.observers[0].options.rootMargin,'100px');
  app.visible(); await app.settle();
  assert.equal(app.network.length,1);
  assert.match(app.network[0][0], /thumb\.jpg/);
  assert.equal(app.network[0][1].cache,'no-store');
  assert.equal(app.network[0][1].credentials,'same-origin');
  assert.equal(app.network[0][1].headers.Authorization,'Bearer synthetic-signed-token');
  assert.equal(imageNodes(app.tree)[0].props.src,'blob:fixture-1');
  app.unmount();
  assert.deepEqual(app.revoked,['blob:fixture-1']);
});

test('explicit full-image mode loads only the original and releases the thumbnail', async () => {
  const app = fixture();
  app.render({src:thumbnail, fullSrc:original, alt:'Foto privada'});
  app.visible(); await app.settle();
  app.render({src:thumbnail, fullSrc:original, loadFullImage:true, alt:'Foto privada'});
  assert.deepEqual(app.revoked,['blob:fixture-1']);
  await app.settle();
  assert.equal(app.network.length,2);
  assert.match(app.network[1][0], /original\.jpg/);
  app.unmount(); assert.deepEqual(app.revoked,['blob:fixture-1','blob:fixture-2']);
});

test('a lone fullSrc remains usable and eager avatars bypass only the visibility wait', async () => {
  const full = fixture();
  full.render({fullSrc:original, alt:'Detalle'});
  assert.equal(full.network.length,0);
  full.visible(); await full.settle();
  assert.match(full.network[0][0], /original\.jpg/);
  full.unmount();
  const avatar = fixture();
  avatar.render({src:'profile-photos/user/avatar.jpg', eager:true, alt:'Perfil'}); await avatar.settle();
  assert.equal(avatar.observers.length,0); assert.equal(avatar.network.length,1);
  avatar.unmount();
});

test('image source replacement does not flash the old photo or fetch a new offscreen photo', async () => {
  const app = fixture();
  app.render({src:thumbnail, alt:'Privada'}); app.visible(); await app.settle();
  app.render({src:'attendance/other/assignment/thumb.jpg', alt:'Privada'});
  await app.settle();
  assert.equal(app.network.length,1); assert.equal(imageNodes(app.tree).length,0);
  assert.deepEqual(app.revoked,['blob:fixture-1']);
  app.unmount();
});

test('unmount aborts a pending visible image request and ignores late response', async () => {
  let complete;
  const app = fixture({request:() => new Promise((resolve) => { complete = resolve; })});
  app.render({src:thumbnail, alt:'Privada'}); app.visible(); await flush();
  assert.equal(app.network.length,1);
  app.unmount(); assert.equal(app.network[0][1].signal.aborted,true);
  complete(response()); await app.settle(); assert.deepEqual(app.revoked,[]);
});

test('browsers without IntersectionObserver load images and report decoding failure safely', async () => {
  const app = fixture({observerAvailable:false});
  app.render({src:thumbnail, alt:'Privada',fallbackIcon:'Sin foto'}); await app.settle();
  assert.equal(app.network.length,1);
  imageNodes(app.tree)[0].props.onError(); app.render();
  assert.equal(app.tree.props['data-image-state'],'error');
  assert.equal(imageNodes(app.tree).length,0);
  app.unmount();
});
