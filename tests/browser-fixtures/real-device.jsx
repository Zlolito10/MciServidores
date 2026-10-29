import {r as React} from '../../frontend/src/vendor/vendor-react-BwINE3B3.js';
import {reactDomClient} from '../../frontend/src/vendor/react-dom.js';
import {CameraModal} from '../../frontend/src/components/CameraModal.jsx';

// Explicit, local-only hardware check. No media is uploaded, stored or printed.
if(!['localhost','127.0.0.1'].includes(location.hostname))throw new Error('Local fixture only');
const status={secureContext:isSecureContext,mediaApi:!!navigator.mediaDevices?.getUserMedia,source:'native browser camera',requests:0,stopCalls:0,trackStates:[],captures:0,captureBytes:0,captureMime:null,error:null};
const media=navigator.mediaDevices;
const original=media?.getUserMedia;
const streams=new Set();
const stopAll=()=>{for(const stream of streams)for(const track of stream.getTracks())if(track.readyState!=='ended')track.stop();};
const update=()=>window.dispatchEvent(new Event('mci-device-test'));
if(original)media.getUserMedia=async function(constraints){
  if(constraints?.audio!==false)throw new Error('This fixture only authorizes video; audio must be false');
  status.requests++;
  try{
    const stream=await original.call(media,constraints);
    streams.add(stream);
    status.trackStates=stream.getTracks().map(t=>({kind:t.kind,readyState:t.readyState}));
    for(const track of stream.getTracks()){
      const stop=track.stop.bind(track);
      track.stop=()=>{stop();status.stopCalls++;status.trackStates=stream.getTracks().map(t=>({kind:t.kind,readyState:t.readyState}));update();};
    }
    status.error=null;update();return stream;
  }catch(error){status.error=error.name;update();throw error;}
};
window.addEventListener('pagehide',()=>{stopAll();if(media&&original)media.getUserMedia=original;});
function RealDeviceTest(){
  const [open,setOpen]=React.useState(false);
  const [,redraw]=React.useState(0);
  React.useEffect(()=>{const fn=()=>redraw(n=>n+1);window.addEventListener('mci-device-test',fn);return()=>window.removeEventListener('mci-device-test',fn);},[]);
  const capture=data=>{
    status.captures++;
    status.captureBytes=atob(data.slice(data.indexOf(',')+1)).length;
    status.captureMime=data.slice(5,data.indexOf(';'));
    // Deliberately retain only counts, never the Data URL or physical image.
    update();
  };
  return <main><h1>Prueba de cámara física · MCI</h1>
    <p>Solo vídeo local. El micrófono está desactivado. Las fotos no se guardan ni se suben.</p>
    <button onClick={()=>setOpen(true)}>Probar cámara de este equipo</button>
    <button onClick={()=>{stopAll();setOpen(false);}}>Finalizar prueba</button>
    <p>La ventana puede pedir permiso de cámara. Cerrar detiene las pistas.</p>
    <pre id="device-result">{JSON.stringify(status,null,2)}</pre>
    {open&&<CameraModal isOpen={open} onClose={()=>setOpen(false)} onCapture={capture} title="Prueba local de cámara física"/>}
  </main>;
}
reactDomClient.createRoot(document.getElementById('device-test-root')).render(<RealDeviceTest/>);
