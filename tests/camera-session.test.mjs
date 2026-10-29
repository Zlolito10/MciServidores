import test from 'node:test';
import assert from 'node:assert/strict';
import { createCameraSession, captureVideoFrame, createFaceModelLoader } from '../frontend/src/utils/camera-session.js';

function media() {
  const track = { stopped: 0, stop() { this.stopped++; } };
  return { getTracks: () => [track], track };
}
function timers() {
  let id = 0;
  const tasks = new Map();
  return {
    tasks,
    setTimeout(callback) { tasks.set(++id, callback); return id; },
    setInterval(callback) { tasks.set(++id, callback); return id; },
    clearTimeout(handle) { tasks.delete(handle); },
    clearInterval(handle) { tasks.delete(handle); },
  };
}

test('camera restart stops the previous stream and detaches its video', () => {
  const session = createCameraSession();
  const first = media(), video = { oncanplay() {} };
  const oldToken = session.begin();
  assert.equal(session.attach(oldToken, first, video), true);
  const newToken = session.begin();
  assert.equal(first.track.stopped, 1);
  assert.equal(video.srcObject, null);
  assert.equal(video.oncanplay, null);
  assert.equal(session.isCurrent(oldToken), false);
  assert.equal(session.isCurrent(newToken), true);
});

test('late getUserMedia results cannot attach after closing or replace a reopened camera', () => {
  const session = createCameraSession();
  const oldToken = session.begin();
  session.stop();
  const newToken = session.begin(), active = media(), late = media(), video = {};
  session.attach(newToken, active, video);
  assert.equal(session.attach(oldToken, late, video), false);
  assert.equal(late.track.stopped, 1);
  assert.equal(active.track.stopped, 0);
  assert.equal(video.srcObject, active);
  session.stop();
  assert.equal(active.track.stopped, 1);
  assert.equal(session.attach(newToken, media(), video), false);
});

test('closing cancels countdown, detection and fallback timers, including already queued callbacks', () => {
  const clock = timers(), session = createCameraSession(clock), token = session.begin();
  let captures = 0;
  session.timeout(token, () => captures++, 100);
  session.interval(token, () => captures++, 250);
  const queued = [...clock.tasks.values()];
  session.stop();
  assert.equal(clock.tasks.size, 0);
  for (const callback of queued) callback();
  assert.equal(captures, 0);
  assert.equal(session.timeout(token, () => captures++, 1), null);
});

test('capturing preserves real frame dimensions, preview mirror and original JPEG quality', () => {
  const operations = [], video = { videoWidth: 1280, videoHeight: 720, readyState: 2 };
  const context = {
    translate: (...args) => operations.push(['translate', ...args]),
    scale: (...args) => operations.push(['scale', ...args]),
    drawImage: (...args) => operations.push(['drawImage', ...args]),
  };
  const canvas = { getContext: () => context, toDataURL: (...args) => { operations.push(args); return 'data:image/jpeg;base64,fixture'; } };
  assert.equal(captureVideoFrame(video, canvas), 'data:image/jpeg;base64,fixture');
  assert.equal(canvas.width, 1280); assert.equal(canvas.height, 720);
  assert.deepEqual(operations, [['translate', 1280, 0], ['scale', -1, 1], ['drawImage', video, 0, 0, 1280, 720], ['image/jpeg', 0.85]]);
});

test('capturing rejects undecoded or zero size video instead of emitting a blank fallback image', () => {
  let called = false;
  const canvas = { getContext() { called = true; return null; } };
  for (const video of [null, { readyState: 1, videoWidth: 640, videoHeight: 480 }, { readyState: 2, videoWidth: 0, videoHeight: 480 }]) {
    assert.throws(() => captureVideoFrame(video, canvas), /CAMERA_FRAME_NOT_READY/);
  }
  assert.equal(called, false);
  assert.throws(() => captureVideoFrame({ readyState: 2, videoWidth: 640, videoHeight: 480 }, canvas), /CAMERA_CANVAS_UNAVAILABLE/);
});

test('model downloads share one request, use fallback bases and cache a successful result', async () => {
  const attempts = [];
  const loader = createFaceModelLoader(async (base) => { attempts.push(base); if (base === 'preferred') throw Error('network'); }, { bases: ['fallback'] });
  const first = loader.load('preferred'), second = loader.load('preferred');
  assert.equal(first, second);
  assert.equal(await first, 'fallback');
  assert.equal(loader.isLoaded(), true);
  await loader.load();
  assert.deepEqual(attempts, ['preferred', 'fallback']);
});

test('a failed model load is handled by all subscribers and can be retried on reopening', async () => {
  let unavailable = true;
  const loader = createFaceModelLoader(async () => { if (unavailable) throw Error('offline'); }, { bases: ['model'] });
  const first = loader.load(), second = loader.load();
  const results = await Promise.allSettled([first, second]);
  assert.deepEqual(results.map((result) => result.status), ['rejected', 'rejected']);
  assert.equal(loader.isLoaded(), false);
  unavailable = false;
  assert.equal(await loader.load(), 'model');
});

test('model timeouts clear their timer and preserve manual fallback retry', async () => {
  const clock = timers();
  const loader = createFaceModelLoader(() => new Promise(() => {}), { bases: ['model'], timers: clock });
  const pending = loader.load();
  const rejection = assert.rejects(pending, /MODEL_LOAD_TIMEOUT/);
  assert.equal(clock.tasks.size, 1);
  [...clock.tasks.values()][0]();
  await rejection;
  assert.equal(clock.tasks.size, 0);
  assert.equal(loader.isLoaded(), false);
});
