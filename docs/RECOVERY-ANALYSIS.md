> Análisis histórico del frontend público. Para las fuentes de backend, reglas, rewrites e índices recuperados después, consulta [RECOVERY-STATUS.md](RECOVERY-STATUS.md).

# Análisis estático de la aplicación recuperada

Este informe describe contratos y código encontrados en los archivos JavaScript públicos de `mcimachala-servidor`. Se analizaron y formatearon archivos como texto: no se ejecutó la aplicación, no se inició sesión, no se consultó Firestore/Storage ni se llamaron APIs autenticadas durante este análisis. Las observaciones de ejecución hechas por otros procesos no se incluyen aquí.

El inventario estructurado está en `frontend-contracts.json`: 28 módulos propios, 108 referencias de llamadas/URLs HTTP (71 combinaciones de método/ruta), 17 rutas UI y 46 patrones de rutas Firestore. Las repeticiones muestran diferentes call sites y variantes de payload. Una referencia de frontend confirma que el cliente contempla ese contrato; no acredita que el endpoint exista o funcione actualmente.

## Resultado confirmado

La aplicación pública está compilada como ESM con separación de chunks y precarga de Vite. Contiene React, rutas de login/registro y dashboard con módulos de eventos, asignaciones, ministerios, servidores, roles, solicitudes pendientes, asistencia, enseñanza de martes, UDLV, historial de servicio, ajustes e historial de actividad.

`App-BPrQ3EPG.js` contiene los objetos literales vacíos `He = {}` y `Nt = {}`. En esta compilación, las expresiones de `VITE_ENABLE_BFF`, `VITE_BFF_MODE`, `VITE_BFF_STRICT_AUTH` y `VITE_USE_EMULATORS` resultan falsas. El flujo principal usa Firebase cliente y llamadas directas a Firestore/Storage; el BFF existe como rama alternativa. La configuración Firebase pública está embebida, pero sus valores se omiten en los informes de contratos.

Hay URLs explícitas que identifican `api` en `us-central1`, bajo `https://us-central1-mcimachala-servidor.cloudfunctions.net`. Las rutas para notificaciones de repertorio/materiales y una notificación de prueba usan ese origen como alternativa en localhost. Esto confirma referencias a esa función; no recupera el inventario de Functions, su código servidor, runtime, permisos ni configuración.

## Rutas y módulos

| Ruta UI | Módulo público principal |
| --- | --- |
| `/login`, `/register`, `/` | `App-BPrQ3EPG.js`; `/` redirige a `/dashboard` |
| `/pending-assignment` | `PendingAssignment-BisqKKqT.js` |
| `/dashboard` | `Dashboard-DN8eeJDA.js` |
| `/dashboard/events` | `Events-CIOfy-8U.js` |
| `/dashboard/events/:id` | `EventDetails-CpDlqXqO.js` |
| `/dashboard/areas` | `ServiceAreas-CFqvjtqq.js` |
| `/dashboard/volunteers` | `Volunteers-CUDiGEOd.js` |
| `/dashboard/roles` | `Roles-23Dg9NXW.js` |
| `/dashboard/requests` | `PendingRequests-ofGtBucD.js` |
| `/dashboard/attendance` | `Attendance-BoRlsPo1.js` |
| `/dashboard/tuesday-teaching` | `TuesdayTeaching-B3nMLJdY.js` |
| `/dashboard/udlv` | `Udlv-B63vtmB5.js` |
| `/dashboard/my-history` | `ServiceHistory-k07fUeOW.js` |
| `/dashboard/settings` | `Settings-BtbU5gHm.js` |
| `/dashboard/app-history` | `AppHistory-oOipttKZ.js` |

Los imports/export aliases concretos se conservan en el JSON. `index-BU_ZgoWo.js` actúa como entrada y contiene además código empaquetado de dependencias. `CameraModal` y `notifications` también incluyen dependencias embebidas; no se dedujo un contrato servidor a partir del SDK.

## HTTP y sesión

El wrapper exportado como `f` desde `App` (nombre local minificado `O`) ejecuta `fetch` con `credentials: "include"`. Usa GET por defecto y un timeout de 30 segundos. `options.json` produce JSON y `Content-Type: application/json`; `options.body` se transmite sin serialización adicional y permite `FormData`. Añade condicionalmente `x-app-version`, `x-app-path`, `x-xsrf-token` y `Cache-Control`. No añade `Authorization` automáticamente. Conserva respuestas de lectura con ETag y contempla una repetición si recibe 304 sin copia local. Véase la copia legible de `App` en las líneas 587–670.

El cliente contempla `POST /api/sessionLogin {idToken}`, `POST /api/passwordLogin {username,password}`, `POST /api/sessionLogout {}`, `POST /api/session/refresh` y `GET /api/me`. Los valores reales de credenciales no se incluyen ni se obtuvieron. Estas rutas de la rama BFF no demuestran por sí mismas que la versión activa use sesión cookie.

La rama directa de reacciones usa `POST /comments/react`, JSON `{commentId,reaction,action:"toggle"}` y `Authorization: Bearer <ID token del usuario actual>`. Las notificaciones de repertorio/materiales usan fetch directo con JSON `{eventId}`; no pasan por el wrapper BFF. No se deben unificar sus contratos de autenticación sin el código servidor.

Los grupos HTTP del JSON abarcan usuarios/perfil/foto/contraseña, roles, áreas, eventos, asignaciones, repertorio, materiales/biblioteca, comandos de replicación, comentarios, asistencia, notificaciones, historial y telemetría de administración. Para cada call site se indica método, ruta normalizada, parámetros de consulta, claves de payload, módulo y offset original o línea de copia legible. Los campos marcados `dynamic` no cuentan con tipo comprobable.

Entre los payloads comprobados están:

- Eventos: `title,date,location,serviceTime,time,endTime,type,description,activeMinistries`; al crear añade `imageUrl,imageThumbUrl,status,createdBy` y al editar `updatedBy`.
- Asignaciones: `id,areaId,areaName,roleName,userId,userName,userPhoto`.
- Repertorio: `title,key,link,ref1,link2,ref2,notes`, más `order` al crear; reordenación con `items:[{id,order}]`.
- Archivos: `FormData` con `file` para imagen de evento/foto de perfil; materiales con `title`, opcionales `songId,songTitle,materialId` y `file`.
- Asistencia: `type,attendanceTimeIso,attendanceStatus,wasLate,wasCheckOutLate,location`. La variante multipart de `/attendance/photo` lleva coordenadas, tiempo de captura y archivo; existe un fallback sin foto ante timeout.
- Comandos: `type,sourceEventId,targetEventId`; tipos observados `REPLICATE_ASSIGNMENTS`, `REPLICATE_REPERTOIRE`, `REPLICATE_MATERIALS`. El cliente también escribe comandos Firestore, entre ellos `RESTORE_REPERTOIRE`.

## Firestore, roles y almacenamiento

Las rutas construidas por el cliente incluyen `users`, `roles`, `service_areas`, `pending_assignments`, `comments`, `commands`, `event_templates`, `materials_library`, `app_cache`, `userTokens`, `system/pending_users`, `meta/attendanceSync`, `private_chats/{id}/messages`, `teaching_sessions`, `teaching_attendance_records`, `udlv_courses`, `udlv_sections`, `udlv_classes` y `udlv_class_records`. Para eventos se construyen `events/{id}/assignments`, `/repertoire`, `/materials`, `/replicateBackups` y `/autoBackups`, incluyendo sus contenidos. `ServiceHistory` consulta un grupo de colecciones `assignments`. La presencia de esas rutas en JS no prueba que sus documentos existan o que las reglas autoricen su acceso.

Los roles reconocidos por el frontend son `master_admin`, `admin`, `user`, `ministry_admin`, `ministry_subadmin` y variantes `ministry_admin_{ministryId}` / `ministry_subadmin_{ministryId}`. Se observan permisos de dashboard, usuarios, roles, eventos, ministerios, reportes y sus variantes por ministerio. Los perfiles usan además `assignedMinistries`, `areas`, `ministryRoles` y `permissions`. Estos controles UI no revelan las reglas de autorización del servidor.

Se observan referencias de Storage como `events/{eventId}/materials/{filename}` e imágenes de evento. La app genera `/api/download?path=...&inline=1` y `/api/download-material?path=...&filename=...`. No se exploró el bucket ni se descargaron archivos privados.

## Copias legibles verificadas

Se generaron 28 copias en `readable-assets/` mediante Prettier 3.8.0 (`parser: "babel"`), conservando nombres de archivo, imports, exports y contenido. Los originales de `hosting/assets/` no se modificaron. `readable-validation.json` contiene SHA-256 de cada original/copia y comparación AST con Acorn 8.15.0: **28 de 28 estructuras iguales**, ignorando solamente offsets y representación textual de literales (`start`, `end`, `raw`). El script utilizado está en `/workspace/frontend-analysis-tools/format.cjs`.

Para integrarlas como apoyo de ingeniería, se deben conservar los nombres hash y los restantes vendor chunks, CSS, imágenes, entry HTML y service workers en la misma estructura del runtime recuperado. La carpeta de copias legibles aislada no incluye todos esos assets y no es por sí sola una aplicación ejecutable. Los vendor chunks pueden mantenerse sin cambios.

También se puede usar `esbuild.transform` con `format:"esm"`, `minify:false`, `target:"esnext"` y `legalComments:"inline"`, por archivo y sin bundling; Prettier es la opción ya aplicada y validada. No renombrar imports ni asumir equivalencia del AST tras otra transformación sin comprobarla. No se necesita ejecutar la aplicación para formatearla.

Estas copias siguen siendo JavaScript compilado: no son TSX original. No se pueden recuperar exactamente comentarios, nombres originales, tipos TypeScript, estructura original de módulos ni versiones de dependencias desde estos artefactos. No debe inventarse una estructura TSX y presentarla como recuperación fiel.

## Límites concretos

Permanecen desconocidos el código de Functions/API, reglas e índices Firestore, reglas Storage, IAM, rewrites de Hosting, proveedores y dominios autorizados de Auth, variables/secretos de servidor, dependencias originales y datos existentes. Tampoco se verificaron respuestas de APIs protegidas ni flujos autenticados. Reconstruir el repositorio desde el runtime público es viable como base ejecutable; reconstruir fielmente el servidor exige recuperar sus fuentes o especificar e implementar un reemplazo aparte, con verificación autorizada.
