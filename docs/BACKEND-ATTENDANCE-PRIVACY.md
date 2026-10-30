# Privacidad del registro de asistencia

La recuperación encontró fotos de asistencia y coordenadas en los mismos documentos de asignaciones que el roster consultaba completo. Firestore permite o deniega el documento entero; las reglas no pueden ocultar campos. También evalúa el conjunto potencial de una consulta, por lo que cambiar reglas sin ajustar consultas rompería el roster. Véanse [lecturas por documento](https://firebase.google.com/docs/firestore/security/rules-fields) y [consultas y reglas](https://firebase.google.com/docs/firestore/security/rules-query).

## Contrato preparado localmente

`events/{eventId}/assignments/{assignmentId}` conserva el registro completo. Su lectura requiere propietario (`userId`), administrador o responsable del área. Los roles `ministry_admin_ID` y `ministry_subadmin_ID` administran únicamente ese sufijo, aunque un array legado diga otra cosa; los roles genéricos usan los IDs de `assignedMinistries`. Un usuario normal no obtiene permisos administrativos por tener áreas en su perfil.

`events/{eventId}/assignment_roster/{assignmentId}` contiene una proyección de planificación legible para usuarios autenticados. Solo permite `eventId`, `userId`, `areaId`, `roleId`, `roleName`, `status`, `createdAt` y `updatedAt`. Se validan los tipos; no se copian objetos anidados arbitrarios. `roleName` conserva etiquetas legadas válidas de hasta 120 caracteres; si falta `roleId`, no se inventa. El ID del documento identifica la fila. Foto, ubicación, notas, estado detallado y horas de asistencia no forman parte de esta proyección.

`onAssignmentWritten` mantiene la proyección antes de sus retornos silenciosos, mediante una transacción que lee el estado actual. Reemplaza el documento para retirar campos antiguos y lo elimina cuando ya no existe la asignación. Una entrega atrasada del trigger no restaura la proyección de un registro borrado ni vuelve a publicar el propietario anterior. La limpieza de un evento incluye esta subcolección. Se conservan los 30 exports recuperados; no se añade una función pública de migración.

Los dos handlers de `/api/events/:id/details` y el bundle `/api/dashboard` proyectan cada asignación según el actor: registro completo para quien puede leerlo y roster para los demás. Estas respuestas usan `private, no-store`; el ETag inicial del Dashboard distingue también el rol y las áreas del actor. El historial de servicio conserva su filtro por `userId`. Los endpoints de asistencia, diagnóstico y recuperación que entregan registros completos exigen administrador. Los caches de aplicación reconstruidos usan `users`, `roles`, `service_areas` y los años de `events_meta`; no hay un cache de asignaciones completas.

Los dos proxies de descarga comprueban el propietario o responsable de área antes de abrir una foto de `attendance/`. Admiten una sesión verificada o un ID token Bearer verificado con revocación, para el cliente Firebase normal. Las fotos se transmiten con `private, no-store`, sin redirección ni URL firmada, incluso si se solicita `mode=url`. Las mutaciones con sesión siguen requiriendo CSRF. El frontend debe obtener las fotos como bytes autenticados y liberar sus object URLs, sin convertirlas en URLs de descarga compartibles.

## Backfill y límites

La utilidad `scripts/backfill-assignment-roster.mjs` no admite producción. Sin destino ni `--execute` muestra un plan sin abrir la base de datos. Para consultar o ejecutar exige un proyecto `demo-*` explícito y `FIRESTORE_EMULATOR_HOST` en loopback con puerto. El modo por defecto con ese destino solo cuenta asignaciones y presencia de campos privados; no imprime sus valores. `--execute` escribe únicamente las proyecciones en el emulador y nunca modifica los originales. La exploración es limitada; `limitReached` señala que debe revisarse el alcance.

```powershell
$env:GCLOUD_PROJECT = 'demo-mci-servidores'
$env:FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080'
node scripts/backfill-assignment-roster.mjs
node scripts/backfill-assignment-roster.mjs --execute
```

Estos cambios y pruebas locales no migran el proyecto publicado. Antes de un despliegue futuro se necesita un procedimiento aprobado que prepare y compruebe el roster existente, coordine frontend/reglas/backend y trate las URLs de descarga legadas. Cambiar reglas no revoca una URL de descarga previamente entregada; no se rotaron tokens, inventariaron datos ni modificaron objetos de producción. El acceso directo mediante bytes permite aplicar reglas con más precisión que una URL descargable, como explica [Firebase Storage](https://firebase.google.com/docs/storage/web/download-files#download_data_directly_from_the_sdk).
