// Newly written recovery logic; the CameraModal view is derived from the published application.
import { r as React } from '../vendor/vendor-react-BwINE3B3.js';
import { ct as faceModels, b0 as detectFaces, Wc as TinyFaceDetectorOptions } from '../vendor/face-api.js';
import { createCameraSession, captureVideoFrame, createFaceModelLoader } from '../utils/camera-session.js';

const modelLoader = createFaceModelLoader((base) => faceModels.tinyFaceDetector.loadFromUri(base), {
  bases: [
    'https://justadudewhohacks.github.io/face-api.js/models',
    'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model',
    'https://unpkg.com/@vladmandic/face-api/model',
  ],
});
function vibrate(pattern) {
  try { navigator.vibrate?.(pattern); } catch {}
}

export function useCamera({ isOpen, onCapture, onClose }) {
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const sessionRef = React.useRef(null);
  if (!sessionRef.current) sessionRef.current = createCameraSession();
  const session = sessionRef.current;
  const callbacks = React.useRef({ onCapture, onClose });
  callbacks.current = { onCapture, onClose };
  const [error, setError] = React.useState('');
  const [isStarting, setStarting] = React.useState(true);
  const [modelsReady, setModelsReady] = React.useState(modelLoader.isLoaded());
  const [manualMode, setManualMode] = React.useState(false);
  const [videoReady, setVideoReady] = React.useState(false);
  const [faceDetected, setFaceDetected] = React.useState(false);
  const [countdown, setCountdown] = React.useState(null);
  const [phase, setPhase] = React.useState('loading');

  React.useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    let preferredBase;
    try { preferredBase = localStorage.getItem('face_model_base_url'); } catch {}
    modelLoader.load(preferredBase).then((base) => {
      if (base) try { localStorage.setItem('face_model_base_url', base); } catch {}
      if (!cancelled) { setModelsReady(true); setManualMode(false); }
    }).catch(() => {
      if (!cancelled) { setModelsReady(false); setManualMode(true); }
    });
    return () => { cancelled = true; };
  }, [isOpen]);

  const startCamera = React.useCallback(async () => {
    const token = session.begin();
    setStarting(true);
    setError('');
    setVideoReady(false);
    setFaceDetected(false);
    setCountdown(null);
    setPhase('loading');
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('CAMERA_UNAVAILABLE');
      const media = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      if (!session.attach(token, media, videoRef.current)) return;
      const video = videoRef.current;
      if (!video) {
        session.stop();
        setError('No se pudo iniciar el video. Intenta de nuevo.');
        setStarting(false);
        return;
      }
      let playPending = false;
      const play = async () => {
        if (!session.isCurrent(token) || playPending) return;
        playPending = true;
        try {
          await video.play();
          if (session.isCurrent(token) && video.videoWidth > 0 && video.videoHeight > 0) {
            setVideoReady(true);
            setStarting(false);
            setPhase('scanning');
          }
        } catch (failure) {
          if (session.isCurrent(token) && failure?.name !== 'AbortError') {
            session.stop();
            setError('Error al iniciar el video. Intenta de nuevo.');
            setStarting(false);
          }
        } finally { playPending = false; }
      };
      video.oncanplay = play;
      if (video.readyState >= 2) void play();
      session.timeout(token, play, 3000);
    } catch (failure) {
      if (!session.isCurrent(token)) return;
      session.stop();
      setError(failure?.message === 'CAMERA_UNAVAILABLE'
        ? 'La cámara requiere HTTPS o localhost y un navegador compatible.'
        : 'No se pudo acceder a la cámara. Verifica los permisos.');
      setStarting(false);
    }
  }, [session]);

  React.useEffect(() => {
    if (isOpen) void startCamera();
    return () => session.stop();
  }, [isOpen, session, startCamera]);

  const capturePhoto = React.useCallback(() => {
    if (!session.isCurrent(session.current())) return;
    let photo;
    try { photo = captureVideoFrame(videoRef.current, canvasRef.current); }
    catch {
      session.stop();
      setError('No se pudo capturar la imagen. Reinicia la cámara e intenta de nuevo.');
      return;
    }
    vibrate([100, 50, 100]);
    session.stop();
    callbacks.current.onCapture(photo);
    callbacks.current.onClose();
  }, [session]);

  React.useEffect(() => {
    if (!isOpen || !modelsReady || manualMode || !videoReady || faceDetected) return;
    const token = session.current();
    let consecutiveFrames = 0;
    let pending = false;
    const timer = session.interval(token, async () => {
      if (pending || !videoRef.current) return;
      pending = true;
      try {
        const faces = await detectFaces(videoRef.current, new TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }));
        if (!session.isCurrent(token)) return;
        consecutiveFrames = faces.length > 0 ? consecutiveFrames + 1 : 0;
        if (consecutiveFrames >= 3) {
          session.cancelTimer(timer);
          setFaceDetected(true);
          setPhase('detected');
          vibrate(100);
        }
      } catch {
        if (session.isCurrent(token)) { session.cancelTimer(timer); setManualMode(true); }
      } finally { pending = false; }
    }, 250);
    return () => session.cancelTimer(timer);
  }, [isOpen, modelsReady, manualMode, videoReady, faceDetected, session]);

  React.useEffect(() => {
    if (!isOpen || !faceDetected) return;
    const token = session.current();
    let remaining = 3;
    let captureTimer;
    setCountdown(remaining);
    const timer = session.interval(token, () => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        session.cancelTimer(timer);
        setPhase('capturing');
        captureTimer = session.timeout(token, capturePhoto, 100);
      } else vibrate(50);
    }, 800);
    return () => { session.cancelTimer(timer); session.cancelTimer(captureTimer); };
  }, [isOpen, faceDetected, session, capturePhoto]);

  const closeCamera = React.useCallback(() => {
    session.stop();
    callbacks.current.onClose();
  }, [session]);

  return { videoRef, canvasRef, error, isStarting, modelsReady, manualMode, videoReady, faceDetected, countdown, phase, startCamera, capturePhoto, closeCamera };
}
