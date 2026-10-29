import {r as React} from '../../frontend/src/vendor/vendor-react-BwINE3B3.js';
import {reactDomClient} from '../../frontend/src/vendor/react-dom.js';
import {CameraModal} from '../../frontend/src/components/CameraModal.jsx';

// This harness never obtains a real camera. A test runner must inject both an
// explicit opt-in flag and a non-native getUserMedia replacement before opening.
const state={
  syntheticOnly:true,status:'idle',getUserMediaCalls:0,trackStopCalls:0,
  captureCount:0,closeCount:0,dataUrlCharacters:0,imageBytes:0,mimeType:null,
  trackStates:[],lastError:null,
};
window.__MCI_CAMERA_FIXTURE__=state;
const notify=()=>window.dispatchEvent(new Event('mci-camera-fixture-state'));

function observeSyntheticMedia(){
  const devices=navigator.mediaDevices;
  const supplied=devices?.getUserMedia;
  if(window.__MCI_SYNTHETIC_CAMERA__!==true||typeof supplied!=='function'||Function.prototype.toString.call(supplied).includes('[native code]'))throw new Error('Inyecta una cámara sintética antes de abrir. La cámara real está bloqueada en esta prueba.');
  if(supplied.mciFixtureObserved)return;
  const observed=async constraints=>{
    if(window.__MCI_SYNTHETIC_CAMERA__!==true)throw new Error('La autorización sintética de prueba no está activa.');
    state.getUserMediaCalls++;
    const stream=await supplied.call(devices,constraints);
    for(const track of stream.getTracks()){
      const originalStop=track.stop.bind(track);
      track.stop=()=>{
        originalStop();state.trackStopCalls++;
        state.trackStates=stream.getTracks().map(item=>({kind:item.kind,readyState:item.readyState}));notify();
      };
    }
    state.trackStates=stream.getTracks().map(track=>({kind:track.kind,readyState:track.readyState}));
    notify();return stream;
  };
  observed.mciFixtureObserved=true;
  Object.defineProperty(devices,'getUserMedia',{configurable:true,writable:true,value:observed});
}

function CameraFixture(){
  const [open,setOpen]=React.useState(false);
  const [image,setImage]=React.useState('');
  const [,setRevision]=React.useState(0);
  React.useEffect(()=>{
    const update=()=>setRevision(value=>value+1);
    window.addEventListener('mci-camera-fixture-state',update);
    return ()=>window.removeEventListener('mci-camera-fixture-state',update);
  },[]);
  const openCamera=()=>{
    try{observeSyntheticMedia();state.lastError=null;state.status='open';setOpen(true);notify();}
    catch(error){state.status='blocked';state.lastError=error.message;notify();}
  };
  const closeCamera=()=>{state.closeCount++;state.status=state.captureCount?'captured':'closed';setOpen(false);notify();};
  const capture=dataUrl=>{
    state.captureCount++;state.dataUrlCharacters=dataUrl.length;
    state.mimeType=dataUrl.slice(5,dataUrl.indexOf(';'));
    state.imageBytes=atob(dataUrl.slice(dataUrl.indexOf(',')+1)).length;
    state.status='captured';setImage(dataUrl);notify();
  };
  return <main className="fixture">
    <h1>CameraModal real · prueba con vídeo sintético</h1>
    <p>Esta página exige un flujo generado por el runner. No solicita acceso a una cámara física.</p>
    <button onClick={openCamera}>Abrir cámara</button>
    <p>Estado: <output id="camera-status">{state.status}</output></p>
    {state.lastError&&<p role="alert" className="fixture-error">{state.lastError}</p>}
    <dl>
      <dt>Solicitudes sintéticas</dt><dd><output id="media-request-count">{state.getUserMediaCalls}</output></dd>
      <dt>Llamadas stream.track.stop()</dt><dd><output id="stream-stop-count">{state.trackStopCalls}</output></dd>
      <dt>Capturas recibidas</dt><dd><output id="capture-count">{state.captureCount}</output></dd>
      <dt>Caracteres Data URL</dt><dd><output id="capture-data-url-length">{state.dataUrlCharacters}</output></dd>
      <dt>Bytes de imagen</dt><dd><output id="capture-bytes">{state.imageBytes}</output></dd>
      <dt>Tipo de imagen</dt><dd><output id="capture-mime">{state.mimeType||'pendiente'}</output></dd>
    </dl>
    {image&&<img className="fixture-preview" src={image} alt="Captura de la fuente sintética"/>}
    {open&&<CameraModal isOpen={open} onClose={closeCamera} onCapture={capture} title="Cámara de prueba sintética"/>}
  </main>;
}

reactDomClient.createRoot(document.getElementById('camera-fixture-root')).render(<CameraFixture/>);
