# Estado de recuperación — 29 de octubre de 2026

La recuperación inicial del 19 de octubre se conserva como base. Esta continuación añade fuentes JSX reconstruidas, correcciones de backend, más cobertura local y una implementación nueva del worker que faltaba. La web publicada no se desplegó ni se modificó durante estos trabajos.

## Continuidad

Se consultó el historial de «Configurar MciServidores» y se rescataron sus scripts de servidor/build/verificación, el recuperador Python y sus pruebas, y los analizadores/contratos del frontend. La copia `/workspace/MciServidores` del commit `b84d5a7c990ab7963161e2c1c3c200c031233f44` pertenece al entorno de nube anterior; no está montada en este equipo Windows. Su ZIP y Git bundle no se transfirieron. Por ello no se inventa ese commit como padre del historial local ni se afirma haber importado su bundle. El historial anterior sigue siendo una fuente separada, que puede incorporarse cuando se transfiera el bundle.

El proyecto local está en `MciServidores/`, separado del portal Visit Santa Rosa que existía en la carpeta superior. Ese otro proyecto no se reemplazó. El script de recuperación previamente disponible en `MciMachala-servidor/` permitió obtener las fuentes autenticadas antes de integrarlas aquí.

## Accesos comprobados

En la recuperación inicial, el conector GitHub con la identidad `Zlolito10` devolvió permisos `push: true` y `admin: true` para `Zlolito10/MciServidores`. Se seleccionó expresamente esa conexión y no la identidad `BlazeDerk` que produjo el 403 del entorno anterior.

La sesión Google utilizada para recuperar las fuentes devolvió el correo `apolonetworsyt@gmail.com` (esa es su grafía exacta). La API confirmó acceso a `mcimachala-servidor`. No se solicitó un nuevo token ni una contraseña. En la continuación se confirmó mediante lecturas administrativas que la cuenta `AdmMCI` existe activa y tiene el rol `master_admin`; no se inició sesión en producción con su contraseña ni se guardó esa contraseña. Los valores de credenciales y las URLs firmadas no forman parte de este repositorio.

## Backend realmente disponible

Firebase devuelve 28 funciones Gen1 y dos Gen2, todas en `us-central1` con Node.js 22. Los dos ZIP Gen2 contienen el mismo `src/index.ts`, `lib/index.js`, mapa, package.json, lockfile y tsconfig. Las fuentes Gen1 ya no existen en su bucket y sus 28 URLs de descarga responden 404.

Como alternativa se leyeron las imágenes Artifact Registry de `attendanceReminders`, `backfillProfilePhotoThumbs` y `cleanupOldFiles`. Comparten la misma capa de aplicación. Su `src/index.ts` y `lib/index.js` coinciden byte por byte con los ZIP Gen2. Se extrajeron únicamente archivos de la aplicación; no se ejecutaron imágenes ni herramientas de mantenimiento. Las otras 25 imágenes Gen1/versiones consultadas ya no estaban disponibles, por lo que no se afirma haber descargado un ZIP individual de cada despliegue. El paquete recuperado sí declara las 30 exportaciones del inventario activo.

SHA-256 de `src/index.ts` desplegado: `ddf523aa86b12a0e07dd291aaf5a319c735c3b3bceb27bc62131ca828e3cd952`.

SHA-256 de `lib/index.js` desplegado: `116ce8c5dd3dd2ebbd7a8bb52a1f393f6829ba16a8ce6e53304649a7e2a91340`.

Los ZIP incluían `.env`, y la capa Gen1 incluía `.runtimeconfig.json`. Ambos permanecen privados. No se copiaron credenciales a las fuentes publicables. Los snapshots anteriores a las modificaciones permiten contrastar las correcciones.

## Configuración contrastada

Hosting activo reescribe `/api/**` y `/comments/**` a `serverApi` en `us-central1`, y el resto a `/index.html`. Esto sustituye la suposición anterior que apuntaba `/api/**` a `api`. Las cabeceras se exportaron de la misma versión.

Se guardaron 47 archivos de la aplicación. Hay dos entradas adicionales `/__/firebase/init.*`, reservadas y gestionadas por Firebase, cuyas respuestas se conservaron solo como evidencia privada. Los dos archivos adicionales frente al rastreo anterior son `.well-known/security.txt` y `manifest.json.legacy`. Esta última ruta contiene JSON con un MIME HTML erróneo; no se rechazó como fallback porque el contenido es el manifiesto real.

Se recuperaron las reglas activas Firestore/Storage, cinco índices compuestos y el override `assignments.userId` con sus índices de colección y collection group. La API no devolvió instancias Realtime Database; no se creó un archivo de reglas ficticio. También se conservaron privadamente la configuración Auth, las aplicaciones web y los metadatos de buckets. No se copió su contenido.

## Cambios mantenibles

El build compila una reconstrucción nueva en JSX mediante esbuild y recompila Functions mediante TypeScript. Las pantallas, composición de rutas, autenticación, componentes, hooks y servicios tienen carpetas propias. Se reconstruyeron 3.632 expresiones JSX y se asignaron nombres de módulos y exports donde el código publicado permite deducirlos. Se preservan llamadas al runtime cuando su conversión no es segura y nombres locales compilados cuya intención no se puede deducir. React DOM y Face API/TensorFlow se separaron en `frontend/src/vendor/`. **No son los JSX/TSX originales.** `frontend/RECONSTRUCTION.md` y `recovery/frontend-reconstruction.json` describen la transformación y sus hashes.

`build:snapshot` conserva el modo de copia exacta. `npm run build:frontend` compila las fuentes editables sin regenerarlas. El script de reconstrucción inicial admite `--check` sin escrituras; regenerar encima de fuentes existentes exige `--overwrite` porque reemplaza ediciones posteriores. Las copias originales de Hosting y los módulos formateados permanecen sin modificar.

La configuración demo se centraliza en `frontend/src/config/` y Firebase en `frontend/src/firebase/`. Auth, Firestore, Storage y Functions apuntan a emuladores, incluidos los fallbacks HTTP. El cliente BFF y el registro automático del worker conservan sus flags explícitos. `--bff --out-dir dist-bff` permite comprobar sesiones BFF en una compilación aparte; `--pwa-test` habilita el worker en demo. El CSS editable procede del despliegue.

En Functions se mantuvieron los imports explícitos de `FieldValue`, `FieldPath` y `Timestamp` que resolvieron errores del emulador. Esta continuación corrigió dos fallos hallados por las nuevas pruebas: preferencias escritas como claves literales con puntos y descargas que consultaban el bucket de producción después de subir al bucket demo. `passwordLogin` ahora se puede ejercer contra Auth Emulator sin una API key real. Se extrajeron adaptadores de integraciones, utilidades de notificaciones, limpieza y rutas administrativas en cuatro módulos. El paquete conserva sus 30 exportaciones.

Se implementaron los seis GET administrativos que AppHistory referenciaba y el paquete desplegado no registraba. Solo `master_admin` puede consultarlos; tienen límites, filtros y cursor para el historial. Leen registros existentes, sin activar ingestión de telemetría ni auditoría de mutaciones. La métrica de lecturas facturables devuelve `METRICS_NOT_COLLECTED` en vez de presentar valores inventados.

El archivo original `firebase-messaging-logic.js` seguía ausente del inventario. Se escribió una implementación nueva en `frontend/public/`, identificada como reconstruida. Los mensajes silenciosos actualizan clientes sin mostrar avisos vacíos; los mensajes Firebase mantienen su envelope foreground; los clics solo navegan dentro del origen. La caché instala archivos estáticos con `credentials:omit` y rechazo de redirecciones, respuestas privadas, cookies y MIME no HTML para el shell. No incluye API, comentarios, rutas privadas ni symlinks. Su versión deriva del release y del hash del shell, assets y fuentes del worker.

El lockfile recibió actualizaciones compatibles y Sharp conserva la versión 0.35.5 ya probada. La consulta npm del 29 de octubre encontró un aviso alto nuevo en body-parser y avisos moderados transitivos. Se corrigieron con versiones compatibles y overrides limitados para `qs` y `uuid`, manteniendo el major de Firebase Admin admitido por Firebase Functions. Las auditorías repetidas del frontend y Functions terminaron ambas con cero vulnerabilidades. `recovered/dependency-review.json` conserva la auditoría histórica anterior; `functions/RECOVERY-CHANGES.md` explica las decisiones actuales.

## Comprobaciones y límites

La revisión consolidada del 29 de octubre pasa **50/50 pruebas Node**: 12 de adaptadores/lógica backend, cinco de reconstrucción JSX, dos de rutas Storage Emulator, tres del alta de administrador demo, nueve del servidor y 19 del service worker. Pasan también **12/12 pruebas Python**, la compilación TypeScript de Functions y la verificación SHA-256/tamaño de los 47 archivos Hosting. El sandbox bloqueó inicialmente sockets loopback y temporales Python; se repitieron con conexiones locales permitidas y un temporal privado dentro del workspace, sin cambiar lógica para ocultar fallos.

La integración ampliada pasó **41/41 subpruebas** (42 resultados Node contando el contenedor). Incluye Auth y proveedores emulados, sesiones/cookies/CSRF/roles, CRUD de eventos/ministerios/plantillas/asignaciones/repertorio/materiales, preferencias/fotos, descargas privadas, asistencia/historial, comentarios/reacciones, solicitudes/chat, Enseñanza y U de la Vida, reglas y los seis GET administrativos. `docs/FLOW-COVERAGE.md` detalla cada flujo y `recovery/flow-validation.json` conserva resultados sin cuerpos, cookies ni credenciales. La revisión consolidada de documentación no volvió a sembrar ni modificó el estado de los emuladores usados por el navegador.

Los recorridos de navegador de la recuperación inicial comprobaron login, dashboard, creación/detalles de un evento y las ocho pantallas administrativas, además del viewport móvil de 390 px sin desbordamiento. No observaron errores ni advertencias de consola durante esos recorridos. Todos los datos de prueba son sintéticos; la cobertura HTTP/reglas ampliada no se confunde con una comprobación visual de cada interacción.

El modo demo usa un outbox explícito para FCM y conserva bytes en Storage Emulator para simular el archivo Drive antes de borrar originales. Se probó la lógica del recordatorio programado y de la limpieza con esos adaptadores. Esto no demuestra entrega FCM en dispositivos, acceso real Drive ni entrega de Cloud Scheduler/PubSub. Google se prueba con identidad emulada, las fotos son generadas y las coordenadas son sintéticas; no demuestran consentimiento OAuth ni cámara/GPS físicos. Los tests del worker son locales y no acreditan recepción Web Push desde FCM real.

No se ejecutaron migraciones/backfills, restauraciones PITR ni llamadas de pago sobre datos reales. Los originales JSX/TSX y la lógica SW original siguen sin estar disponibles. El `case` duplicado de html2canvas permanece como aviso del vendor publicado. El README contiene el comando de alta demo con contraseña por stdin, sin una contraseña real ni persistencia en archivos. Los servicios externos requieren una validación separada antes de un despliegue autorizado.

Ningún despliegue a producción fue ejecutado durante esta recuperación.
