# Cámara en navegador con medios sintéticos

Ejecuta `node scripts/build-browser-fixtures.mjs` después de compilar el frontend principal. El comando escribe únicamente en `dist/__browser-tests/` y no recompila ni reemplaza el bundle de la aplicación.

Con el preview local activo, abre `/__browser-tests/camera.html`. La fixture usa `CameraModal` y `Modal` reales, el React y ReactDOM recuperados y el mismo puente JSX del build principal. El import de `Modal` a través de su re-export en `App.jsx` se enlaza directamente a `components/Modal.jsx` para no inicializar la aplicación ni sus proveedores. El build falla si incluye `main.jsx` o `app/App.jsx`.

Antes de pulsar **Abrir cámara**, el runner debe reemplazar `navigator.mediaDevices.getUserMedia` por una función JavaScript que devuelva, por ejemplo, `canvas.captureStream(10)`, y establecer `window.__MCI_SYNTHETIC_CAMERA__ = true`. La fixture rechaza la función nativa y no llama a una cámara real. No establece ni solicita permisos de cámara.

Para comprobar el modo manual, bloquea en el runner las peticiones a los tres orígenes de modelos faciales presentes en `CameraModal`. Tras cargarse el vídeo sintético y fallar los modelos debe aparecer **Tomar foto**. El callback muestra una imagen y sus bytes/longitud Data URL. Cerrar con Escape o capturar debe incrementar el marcador `stream-stop-count` y dejar las pistas en estado `ended`.

El estado también se expone en `window.__MCI_CAMERA_FIXTURE__` para una inspección del runner. No contiene medios reales ni credenciales. Una comprobación con esta fixture valida la captura, callback y limpieza del componente; no demuestra permisos ni funcionamiento de hardware físico ni la exactitud del detector facial.

Todo `dist/` permanece excluido de Git. Una recompilación principal borra sus fixtures generadas: vuelve a ejecutar este script cuando haga falta.
