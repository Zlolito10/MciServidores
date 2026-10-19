# Recuperación comprobada — 19 de octubre de 2026

## Continuidad

Se consultó el historial de «Configurar MciServidores» y se rescataron sus scripts de servidor/build/verificación, el recuperador Python y sus pruebas, y los analizadores/contratos del frontend. La copia `/workspace/MciServidores` del commit `b84d5a7c990ab7963161e2c1c3c200c031233f44` pertenece al entorno de nube anterior; no está montada en este equipo Windows. Su ZIP y Git bundle no se transfirieron. Por ello no se inventa ese commit como padre del historial local ni se afirma haber importado su bundle. El historial anterior sigue siendo una fuente separada, que puede incorporarse cuando se transfiera el bundle.

El proyecto local está en `MciServidores/`, separado del portal Visit Santa Rosa que existía en la carpeta superior. Ese otro proyecto no se reemplazó. El script de recuperación previamente disponible en `MciMachala-servidor/` permitió obtener las fuentes autenticadas antes de integrarlas aquí.

## Accesos comprobados

El conector GitHub con la identidad `Zlolito10` devuelve permisos `push: true` y `admin: true` para `Zlolito10/MciServidores`. Se seleccionó expresamente esa conexión y no la identidad `BlazeDerk` que produjo el 403 del entorno anterior.

La CLI local conserva una sesión Google autorizada con el correo `apolonetworsyt@gmail.com` (esa es la grafía exacta que devuelve la sesión). La API confirmó que tiene acceso a `mcimachala-servidor`. No se solicitó un nuevo token ni una contraseña. Los valores de credenciales y las URLs firmadas no forman parte de este repositorio.

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

El nuevo build recompila JavaScript ESM recuperado mediante esbuild y recompila Functions mediante TypeScript. El modo anterior que solo verifica/copia permanece en `build:snapshot`. Se conservan los nombres de los módulos y las copias originales; no se atribuyen archivos JSX/TSX ni comentarios originales inexistentes.

La adaptación del frontend cambia la configuración Firebase por una configuración explícita de emuladores, dirige los fallbacks de Functions a localhost y desactiva el registro automático del SW en ese modo. Esos cambios se localizan en `recovery-environment.js`, los dos módulos de entrada/App y el script de build. El CSS editable procede del despliegue.

En Functions se sustituyeron las referencias `admin.firestore.FieldValue/FieldPath/Timestamp` por imports explícitos desde `firebase-admin/firestore`. Las primeras pruebas emuladas produjeron errores 500 al usar esos símbolos en el namespace interceptado por la CLI; con el cambio pasan las escrituras y los disparadores observados. No se cambiaron los contratos de negocio.

El lockfile recibió actualizaciones compatibles y Sharp pasó a 0.35.5 para resolver avisos de sus bibliotecas de imágenes. Una prueba genera, redimensiona y convierte una imagen a WebP. Los snapshots conservan las versiones anteriores; `recovered/dependency-review.json` registra la auditoría restante.

## Comprobaciones y límites

Pasaron 9 pruebas Node del servidor, 12 pruebas Python del recuperador y 13 subpruebas de integración (14 resultados Node contando su contenedor). Incluyen las 30 exportaciones, autenticación real del emulador y cookies, CSRF y roles, CRUD de roles, detalles de eventos, repertorio, asistencia, comentarios, validación de comandos, reglas Firestore/Storage, imágenes y cierre de sesión.

La interfaz inicia sesión contra Auth emulado y muestra datos Firestore locales. Se creó un evento desde su formulario y se verificó su ficha. Cargaron Ministerios, Servidores, Solicitudes, Asistencias, Enseñanza de martes, U de la Vida, Roles y Configuración, esperando el encabezado de cada pantalla. Se capturaron vistas de escritorio y móvil; el ancho del documento móvil no excedió el viewport de 390 px. No se observaron errores ni advertencias de consola durante esos recorridos. Todos los datos de prueba son sintéticos.

No se probaron llamadas de pago ni servicios externos, migraciones/backfills, OAuth de Google, notificaciones FCM, Drive, cámara/GPS ni tareas Pub/Sub. No se enviaron notificaciones reales. La lógica SW ausente y los originales JSX/TSX siguen sin estar disponibles. El `case` duplicado de html2canvas permanece como aviso de compilación del vendor original. El código sigue necesitando revisión funcional de esos flujos antes de un despliegue autorizado.

Ningún despliegue a producción fue ejecutado durante esta recuperación.
