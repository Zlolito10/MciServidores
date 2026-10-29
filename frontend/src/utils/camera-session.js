/** Session ownership for the reconstructed camera. This is newly written recovery code. */
export function createCameraSession(timers = globalThis) {
  let token = null;
  let stream = null;
  let video = null;
  const scheduled = new Map();
  const stopStream = (media) => media?.getTracks().forEach((track) => track.stop());
  const isCurrent = (candidate) => candidate !== null && candidate === token;

  function cancelTimer(handle) {
    const clear = scheduled.get(handle);
    if (clear) clear(handle);
    scheduled.delete(handle);
  }

  function stop() {
    token = null;
    for (const handle of scheduled.keys()) cancelTimer(handle);
    stopStream(stream);
    if (video) {
      video.oncanplay = null;
      video.srcObject = null;
    }
    stream = null;
    video = null;
  }

  return {
    begin() {
      stop();
      token = Symbol('camera-session');
      return token;
    },
    current: () => token,
    isCurrent,
    stop,
    attach(candidate, media, element) {
      if (!isCurrent(candidate)) {
        stopStream(media);
        return false;
      }
      if (stream && stream !== media) stopStream(stream);
      stream = media;
      video = element;
      if (video) video.srcObject = media;
      return true;
    },
    timeout(candidate, callback, delay) {
      if (!isCurrent(candidate)) return null;
      const handle = timers.setTimeout(() => {
        scheduled.delete(handle);
        if (isCurrent(candidate)) callback();
      }, delay);
      scheduled.set(handle, (id) => timers.clearTimeout(id));
      return handle;
    },
    interval(candidate, callback, delay) {
      if (!isCurrent(candidate)) return null;
      const handle = timers.setInterval(() => {
        if (isCurrent(candidate)) callback();
      }, delay);
      scheduled.set(handle, (id) => timers.clearInterval(id));
      return handle;
    },
    cancelTimer,
  };
}

/** Capture only a real decoded frame, with the same mirror as the published preview. */
export function captureVideoFrame(video, canvas) {
  const width = video?.videoWidth;
  const height = video?.videoHeight;
  if (!canvas || !(video?.readyState >= 2) || !(width > 0) || !(height > 0)) {
    throw new Error('CAMERA_FRAME_NOT_READY');
  }
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('CAMERA_CANVAS_UNAVAILABLE');
  context.translate(width, 0);
  context.scale(-1, 1);
  context.drawImage(video, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', 0.85);
}

/** Share model downloads, but allow a later opening to retry a failed download. */
export function createFaceModelLoader(loadFromUri, { bases, timeoutMs = 15000, timers = globalThis }) {
  let loaded = false;
  let pending = null;
  async function attempt(base) {
    let timeout;
    try {
      await Promise.race([
        Promise.resolve().then(() => loadFromUri(base)),
        new Promise((_, reject) => {
          timeout = timers.setTimeout(() => reject(new Error('MODEL_LOAD_TIMEOUT')), timeoutMs);
        }),
      ]);
    } finally {
      timers.clearTimeout(timeout);
    }
  }
  return {
    isLoaded: () => loaded,
    load(preferredBase) {
      if (loaded) return Promise.resolve();
      if (pending) return pending;
      const candidates = preferredBase ? [preferredBase, ...bases.filter((base) => base !== preferredBase)] : bases;
      pending = (async () => {
        let lastError;
        for (const base of candidates) {
          try {
            await attempt(base);
            loaded = true;
            return base;
          } catch (error) {
            lastError = error;
          }
        }
        throw lastError || new Error('MODEL_LOAD_FAILED');
      })().finally(() => { pending = null; });
      return pending;
    },
  };
}
