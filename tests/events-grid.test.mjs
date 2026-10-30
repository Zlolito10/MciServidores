import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { transformSync } from 'esbuild';

const source = (await readFile(new URL('../frontend/src/components/EventsGrid.jsx', import.meta.url), 'utf8')).replace(/^import[\s\S]*?;\r?\n/gm, '').replace('export { EventsGrid };', '');
const code = transformSync(source, {loader:'jsx', jsx:'transform', jsxFactory:'React.createElement',jsxFragment:'React.Fragment'}).code;
const element = (type, props, ...children) => ({type, props:{...props, children:children.flat(Infinity)}});
function components(overrides = {}, globals = {}) {
  const React = {createElement:element, Fragment:'fragment',useRef:(value) => ({current:value}),useState:(value) => [value,()=>{}],useEffect:()=>{},...overrides};
  return vm.runInNewContext('(function(){' + code + ';return {EventsGrid, EventActions};})()', {
    React, OptimizedImage:'OptimizedImage', CalendarIcon:'CalendarIcon', ClockIcon:'ClockIcon', MapPinIcon:'MapPinIcon', SquarePenIcon:'SquarePenIcon',Trash2Icon:'Trash2Icon',...globals,
  });
}
function nodes(node, predicate) {
  if (!node || typeof node !== 'object') return [];
  return [...(predicate(node) ? [node] : []), ...(node.props?.children || []).flatMap((child) => nodes(child,predicate))];
}
function text(node) {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node !== 'object') return String(node);
  return (node.props?.children || []).map(text).join('');
}
const event = {id:'synthetic-event', title:'Servicio local',date:'2026-10-31',time:'10:00',endTime:'12:00',serviceTime:'10:00',location:'Entorno local',type:'service'};

test('events without explicit covers stay compact and display date, time and location', () => {
  const {EventsGrid} = components();
  const rendered = EventsGrid({events:[event],navigate:()=>{},variant:'detailed'});
  const articles = nodes(rendered,(node) => node.type === 'article');
  assert.equal(articles.length,1);
  assert.match(articles[0].props.className,/mci-event-card--compact/);
  assert.equal(nodes(rendered,(node) => node.type === 'OptimizedImage').length,0);
  assert.equal(nodes(rendered,(node) => node.props.className === 'mci-event-cover').length,0);
  assert.match(text(rendered),/Servicio local/);
  assert.match(text(rendered),/10:00 – 12:00/);
  assert.match(text(rendered),/Entorno local/);
  assert.equal(text(rendered).includes('Servicio: 10:00'),false);
});

test('event metadata chooses the thumbnail without eager downloading or probing Storage', () => {
  const {EventsGrid} = components();
  const rendered = EventsGrid({events:[{...event,imageThumbUrl:'event-images/synthetic/thumb.jpg',imageUrl:'event-images/synthetic/original.jpg'}],navigate:()=>{}});
  const images = nodes(rendered,(node) => node.type === 'OptimizedImage');
  assert.equal(images.length,1);
  assert.equal(images[0].props.src,'event-images/synthetic/thumb.jpg');
  assert.equal(images[0].props.fullSrc,undefined);
  assert.equal(images[0].props.eager,undefined);
});

test('detail actions are real links that preserve modified-click browser behavior', () => {
  const navigation = [], {EventsGrid} = components();
  const rendered = EventsGrid({events:[event],navigate:(route) => navigation.push(route)});
  const link = nodes(rendered,(node) => node.type === 'a' && node.props.className === 'mci-event-details')[0];
  assert.equal(link.props.href,'/dashboard/events/synthetic-event');
  let prevented = false;
  link.props.onClick({button:0,preventDefault:() => {prevented=true;}});
  assert.equal(prevented,true); assert.deepEqual(navigation,['/dashboard/events/synthetic-event']);
  prevented=false;
  link.props.onClick({button:0,ctrlKey:true,preventDefault:() => {prevented=true;}});
  assert.equal(prevented,false); assert.equal(navigation.length,1);
});

test('administrative actions retain the caller confirmation and Escape returns focus to the summary', () => {
  let focused = false, editCalled = false, deleteCalled = false;
  const menu = {open:true,querySelector:() => ({focus:() => {focused=true;}}),contains:()=>true};
  const {EventActions} = components({useRef:() => ({current:menu})});
  const rendered = EventActions({event,onEdit:(value) => {assert.equal(value,event);editCalled=true;},onDelete:(value) => {assert.equal(value,event);deleteCalled=true;}});
  assert.equal(rendered.type,'details');
  assert.equal(nodes(rendered,(node) => node.type === 'summary')[0].props['aria-label'],'Administrar Servicio local');
  let prevented = false, stopped = false;
  rendered.props.onKeyDown({key:'Escape',preventDefault:() => {prevented=true;},stopPropagation:() => {stopped=true;}});
  assert.equal(menu.open,false); assert.equal(focused,true); assert.equal(prevented,true); assert.equal(stopped,true);
  const buttons = nodes(rendered,(node) => node.type === 'button');
  buttons[0].props.onClick(); assert.equal(editCalled,true); assert.equal(deleteCalled,false);
  buttons[1].props.onClick(); assert.equal(deleteCalled,true);
});

test('empty filtered results explain the next action without adding placeholder cards', () => {
  const rendered = components().EventsGrid({events:[],navigate:()=>{}});
  assert.equal(nodes(rendered,(node) => node.type === 'article').length,0);
  assert.match(text(rendered),/No hay eventos en este periodo/);
  assert.match(text(rendered),/Prueba otra fecha o cambia los filtros/);
});

test('open administration menu closes on an outside pointer and removes its listener on cleanup', () => {
  const inside = {}, outside = {}, listeners = [], removed = [], cleanups = [];
  const menu = {open:true,contains:(target) => target === inside};
  const {EventActions} = components({
    useRef:() => ({current:menu}),
    useState:() => [true,()=>{}],
    useEffect:(effect) => cleanups.push(effect()),
  }, {document:{addEventListener:(type,listener) => listeners.push([type,listener]),removeEventListener:(type,listener) => removed.push([type,listener])}});
  EventActions({event,onEdit:()=>{}});
  assert.equal(listeners.length,1); assert.equal(listeners[0][0],'pointerdown');
  listeners[0][1]({target:inside}); assert.equal(menu.open,true);
  listeners[0][1]({target:outside}); assert.equal(menu.open,false);
  cleanups.forEach((cleanup) => cleanup?.());
  assert.deepEqual(removed,listeners);
});
