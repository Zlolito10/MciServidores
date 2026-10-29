# Cobertura funcional — 29 de octubre de 2026

La batería `tests/emulator.integration.mjs` pasa **41 comprobaciones de integración** (42 resultados Node contando el contenedor), sin fallos. Los resultados y las peticiones observadas, sin cuerpos, cookies ni credenciales, se guardan en [`recovery/flow-validation.json`](../recovery/flow-validation.json).

Todas las pruebas usan `demo-mci-servidores` en Auth, Firestore, Functions y Storage locales. Los usuarios `recovery-*`, documentos y archivos son sintéticos. El seed no importa ni modifica las cuentas de producción, no elimina todas las cuentas del emulador y conserva cuentas locales creadas por separado.

## Qué significa cada resultado

**Integración emulada** ejecuta los SDK, reglas, HTTP y persistencia reales contra los emuladores de Firebase. **Simulación externa** ejecuta la lógica de aplicación, pero sustituye un servicio externo por un adaptador explícito. Una simulación no demuestra credenciales, permisos, red ni entrega de ese servicio en producción.

| Flujo | Comprobación realizada | Alcance |
| --- | --- | --- |
| Inventario backend | Las exportaciones cargadas coinciden por nombre con las 30 funciones recuperadas. | Carga local del código. |
| Acceso con usuario/contraseña | Auth Emulator, intercambio ID token por cookies de sesión, perfil y rol; el endpoint passwordLogin acepta la contraseña demo y rechaza la incorrecta. | Integración emulada. |
| Registro | Alta de correo en Auth Emulator; creación del perfil `user` y solicitud pendiente mediante reglas cliente; sesión sin privilegios administrativos. | Integración emulada. |
| Acceso Google | `accounts:signInWithIdp` de Auth Emulator con identidad Google sintética; perfil cliente y sesión backend utilizables. | Proveedor emulado; no abre Google real ni verifica consentimiento/popup externo. |
| Sesión y seguridad | CSRF obligatorio, rechazo de roles insuficientes, restauración con custom token aceptado por Auth Emulator, cierre de sesión y borrado de cookies. | Integración emulada. |
| Roles | Crear, leer, editar y borrar; usuario ordinario sin permiso de escritura. | Integración emulada. |
| Eventos | Crear, editar, listar y borrar; detalles incluyen asignaciones, repertorio y materiales. | Integración emulada. |
| Ministerios y plantillas | CRUD de ministerios y plantillas; un responsable solo puede gestionar asignaciones de su área. | Integración emulada. |
| Asignaciones | Guardado, lectura y borrado con permiso por ministerio; usuario distinto no puede marcar la asistencia. | Integración emulada. |
| Repertorio | Crear, editar, reordenar y borrar; los valores y el orden se contrastan en Firestore. | Integración emulada. |
| Materiales y biblioteca | CRUD de enlaces y biblioteca; carga multipart de archivo, descarga con los mismos bytes y borrado. | Integración emulada. |
| Descargas | Rechazo de traversal y prefijos no admitidos; archivos de asistencia solo accesibles al propietario o administrador. | Integración emulada. La firma IAM real de URL no se valida. |
| Perfil y foto | Campos permitidos, rechazo de escalada de rol, preferencias anidadas persistidas, foto válida, rechazo de MIME no imagen y del tamaño mayor de 3 MiB. | Integración emulada. |
| Contraseña y eliminación de cuenta | Cambio y comprobación de acceso; eliminación de Auth y perfil, usando una cuenta desechable creada solo para esa prueba. | Integración emulada. No cambia la cuenta principal. |
| Comentarios | Creación, reacciones añadidas y retiradas, contrato cookie/CSRF y contrato Bearer, permisos de borrado. | Integración emulada. |
| Asistencia | Check-in/check-out, informes de eventos/registros/personas, historial de servicio y campos persistidos. | Integración emulada. |
| Foto y ubicación de asistencia | Imagen generada por Sharp, carga multipart, coordenadas sintéticas `(0,0)`, precisión y captura; propagación a los dos roles del mismo usuario; descarga privada con bytes idénticos y `no-store`. | Integración emulada del contrato. No demuestra una cámara ni una posición GPS reales. |
| Solicitudes y chat | Solicitud propia, lectura administrativa, chat propio/administrador y rechazo de un usuario ajeno. | Reglas y persistencia emuladas. |
| Enseñanza de martes | Sesión y registro de asistencia; lectura autenticada, escritura administrativa/responsable, rechazo al usuario ordinario. | Reglas y persistencia emuladas. |
| U de la Vida | Curso, sección, clase y registro; lectura dentro del ministerio y rechazo fuera de él, con creación/borrado administrativo. | Reglas y persistencia emuladas. |
| Historial de aplicación y telemetría | Los seis GET administrativos rechazan anónimo/usuario, admiten master admin y devuelven registros sintéticos almacenados; filtros inválidos rechazados. | Integración emulada. La ingestión original permanece desactivada. |
| Lecturas facturables Firestore | El endpoint devuelve `METRICS_NOT_COLLECTED`, sin inventar consumo ni equiparar transferencias del navegador a lecturas facturables. | Contrato explícito de indisponibilidad de la métrica. |
| Notificaciones | Registro y retirada de tokens demo; suscripción/desuscripción; el aviso crea una salida local sin guardar los tokens en claro. | FCM simulado mediante `_local_integration_outbox`; no se envía a dispositivos. |
| Recordatorio programado | Se ejecuta el handler real de `attendanceReminders` con un evento y asignación sintéticos en su ventana temporal; se comprueba la salida FCM simulada. | Lógica real con entrega FCM simulada; Cloud Scheduler/PubSub no se ejercita. |
| Limpieza/Drive | Se leen bytes reales del Storage Emulator, se guardan en el archivo local del adaptador Drive y se comprueba su igualdad antes de borrar el archivo de origen. | Storage real emulado y Drive simulado. No verifica IAM/Drive externo. |
| Imágenes | Sharp genera una imagen, la redimensiona y produce WebP, además de las cargas de perfil y asistencia. | Biblioteca real instalada. |

## Fallos encontrados y corregidos

Las pruebas detectaron dos errores concretos: las preferencias se guardaban como claves con puntos en lugar de mapas anidados y las descargas consultaban el bucket de producción incluso cuando las cargas usaban el bucket demo. El agente de backend corrigió ambos; las regresiones están cubiertas por las pruebas de perfil y material multipart.

Las pruebas de acceso administrativo también cubren los endpoints que la pantalla recuperada de historial referenciaba pero que no estaban registrados. El backend ahora los implementa como lecturas de registros almacenados, conservando desactivada la ingestión costosa y señalando las métricas no disponibles.

El recorrido de navegador detectó además que las URLs `http://127.0.0.1:9199/v0/b/.../o/...` del Storage Emulator se trataban como enlaces externos. El parser demo ahora extrae su ruta y usa el mismo endpoint autenticado de descarga que las URLs de Storage publicadas. Dos pruebas verifican la extracción y el rechazo de URLs externas, de producción o mal formadas. La transformación reproducible de JSX conserva este ajuste.

## Recorrido adicional de navegador

El agente principal recorrió nueve pantallas del preview local y comprobó la creación de un evento, una asignación, un elemento de repertorio y un material de archivo. La variante BFF mostró el historial administrativo. Estas observaciones se registran aparte de las 41 comprobaciones HTTP en `docs/validation.json`, dentro de `latestValidation.browser`.

La repetición del botón **Descargar** tras corregir el parser emitió el evento de descarga del navegador y guardó los bytes sintéticos esperados, sin avisos ni errores de consola. En detalles de evento, un viewport de 390 px tuvo un ancho de documento de 390 px, sin desbordamiento horizontal.

En una compilación aislada con `--pwa-test`, el worker se activó, devolvió su versión y almacenó 82 recursos estáticos. Una recarga sin red mostró la carcasa y el acceso; no almacenó API, autenticación ni datos privados para uso offline. El agente principal retiró el worker y sus cachés al terminar.

La fixture `tests/browser-fixtures/camera.jsx` usa el `CameraModal` real con un vídeo sintético inyectado por el runner: produjo una captura JPEG de 5.853 bytes, invocó una vez `track.stop()` y dejó la pista en estado `ended`. Esto comprueba el callback y la limpieza del componente sin pedir permisos ni acceder a una cámara física. El procedimiento reproducible está en `tests/browser-fixtures/README.md`.

## Lo que no queda demostrado

Esta batería no demuestra consentimiento OAuth de una cuenta Google real, entrega FCM en un dispositivo, permisos/captura de una cámara, autorización/lectura GPS física, acceso IAM a Google Drive, la entrega de Cloud Scheduler/PubSub ni la recuperación desde PITR y registros históricos de producción. Esos servicios no se ejercitaron sobre el proyecto publicado. Sus límites no se convierten en resultados aprobados por usar adaptadores demo.

Los backfills y migraciones administrativas conservados en las fuentes no se ejecutaron sobre datos reales. Las reglas e índices de producción no fueron publicados ni modificados.

## Repetir

Con Node.js 22, Java 21 y Firebase CLI disponibles, inicia `npm run emulators`. En otra terminal ejecuta `npm run test:integration`. La batería se conecta únicamente a `127.0.0.1` en los puertos Auth `9099`, Firestore `8080`, Functions `5001` y Storage `9199`.

El seed usa un evento del día siguiente al momento de ejecución para que no desaparezca del dashboard al pasar los días. Al ejecutar dentro de un sandbox que bloquee sockets de loopback se necesita permitir los procesos locales; un error `EACCES` de red no se registra como fallo de la lógica de la aplicación.
