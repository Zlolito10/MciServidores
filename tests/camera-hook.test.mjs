import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { createCameraSession, captureVideoFrame, createFaceModelLoader } from '../frontend/src/utils/camera-session.js';

const source = (await readFile(new URL('../frontend/src/hooks/useCamera.js', import.meta.url), 'utf8'))
  .replace(/^import .*;\r?\n/gm, '').replace('export function useCamera', 'function useCamera');
const flush = async () => { for (let n = 0; n < 8; n++) await Promise.resolve(); };
function deferred() { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; }
function media() { const track = { stops: 0, stop() { this.stops++; } }; return { track, getTracks: () => [track] }; }

// A minimal hook runner executes the real hook's effects without granting device
// permissions or loading network models. Native device coverage is separate.
function fixture() {
  let index = 0;
  const slots = [], effects = [], requests = [], captured = [], timers = new Map();
  let closed = 0, timerId = 0;
  const clock = {
    setTimeout(callback) { timers.set(++timerId, callback); return timerId; },
    setInterval(callback) { timers.set(++timerId, callback); return timerId; },
    clearTimeout(id) { timers.delete(id); }, clearInterval(id) { timers.delete(id); },
  };
  const same = (a, b) => a && b && a.length === b.length && a.every((value, n) => Object.is(value, b[n]));
  const React = {
    useRef(value) { const at = index++; return slots[at] ||= { current: value }; },
    useState(value) { const at = index++; if (!(at in slots)) slots[at] = value; return [slots[at], (next) => { slots[at] = typeof next === 'function' ? next(slots[at]) : next; }]; },
    useCallback(callback, deps) { const at = index++; if (!same(slots[at]?.deps, deps)) slots[at] = { deps, callback }; return slots[at].callback; },
    useEffect(callback, deps) { const at = index++; if (!same(slots[at]?.deps, deps)) { effects.push(() => { slots[at]?.cleanup?.(); slots[at] = { deps, cleanup: callback() }; }); } },
  };
  const useCamera = vm.runInNewContext(`${source}\nuseCamera`, {
    React,
    faceModels: { tinyFaceDetector: { loadFromUri: async () => {} } },
    detectFaces: async () => [], TinyFaceDetectorOptions: class {},
    createCameraSession: () => createCameraSession(clock), captureVideoFrame, createFaceModelLoader,
    localStorage: { getItem: () => null, setItem() {} },
    navigator: { mediaDevices: { getUserMedia(options) { assert.equal(options.audio, false); const next = deferred(); requests.push(next); return next.promise; } } },
  });
  const video = { readyState: 2, videoWidth: 640, videoHeight: 480, play: async () => {} };
  const canvas = { getContext: () => ({ translate() {}, scale() {}, drawImage() {} }), toDataURL: () => 'data:image/jpeg;base64,test' };
  return {
    requests, captured, timers, video, get closed() { return closed; },
    render(isOpen = true) {
      index = 0;
      const controller = useCamera({ isOpen, onCapture: (photo) => captured.push(photo), onClose: () => closed++ });
      controller.videoRef.current = isOpen ? video : null;
      controller.canvasRef.current = isOpen ? canvas : null;
      while (effects.length) effects.shift()();
      return controller;
    },
  };
}

test('camera hook discards a pending acquisition after closing and reopening', async () => {
  const app = fixture(); app.render(); app.render(false); app.render();
  assert.equal(app.requests.length, 2);
  const active = media(), late = media();
  app.requests[1].resolve(active); await flush();
  app.requests[0].resolve(late); await flush();
  const state = app.render();
  assert.equal(late.track.stops, 1); assert.equal(active.track.stops, 0);
  assert.equal(app.video.srcObject, active); assert.equal(state.videoReady, true);
  app.render(false);
  assert.equal(active.track.stops, 1); assert.equal(app.timers.size, 0);
});

test('camera hook restart releases its stream and capture runs exactly once', async () => {
  const app = fixture(); app.render();
  const first = media(); app.requests[0].resolve(first); await flush();
  let state = app.render();
  const restart = state.startCamera();
  assert.equal(first.track.stops, 1);
  const second = media(); app.requests[1].resolve(second); await restart; await flush();
  state = app.render();
  state.capturePhoto(); state.capturePhoto();
  assert.equal(second.track.stops, 1); assert.equal(app.captured.length, 1);
  assert.equal(app.closed, 1); assert.equal(app.timers.size, 0);
  app.render(false);
});

test('camera hook handles a denied permission and can retry with no audio request', async () => {
  const app = fixture(); app.render();
  app.requests[0].reject(Object.assign(Error('Permission denied'), { name: 'NotAllowedError' })); await flush();
  let state = app.render();
  assert.match(state.error, /permisos/); assert.equal(state.isStarting, false);
  const retry = state.startCamera(), stream = media();
  app.requests[1].resolve(stream); await retry; await flush();
  state = app.render(); assert.equal(state.error, ''); assert.equal(state.videoReady, true);
  app.render(false); assert.equal(stream.track.stops, 1);
});
