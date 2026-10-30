# Frontend para revisión de producción

Este frontend se recompila desde JavaScript publicado reconstruido en JSX editable. Los JSX/TSX originales no se recuperaron. El build conserva los assets publicados necesarios para sus contratos y genera chunks nuevos; `recovered/` sigue siendo evidencia independiente.

## Artefactos y opciones

El build normal usa el proyecto demo y emuladores. Para preparar una revisión de producción sin sustituir el `dist` local:

```sh
node scripts/build-frontend.mjs --production-services --out-dir dist-production-review
```

Ese comando solo escribe archivos locales. El artefacto apunta a `mcimachala-servidor`, activa el service worker y no emite source maps. BFF continúa desactivado, como en los flags de la publicación recuperada; la sesión híbrida y el cliente Firebase mantienen sus contratos. `--bff` es una variante explícita que habilita BFF y persistencia Auth en memoria, sin activar BFF estricto. `--pwa-test` permite comprobar el worker en un build de emuladores. Las opciones desconocidas, duplicadas o rutas de salida fuera de `dist`/`dist-NAME` se rechazan.

El build usa un directorio temporal dentro del proyecto. Solo sustituye la salida elegida tras compilar, generar el worker y comprobar el inventario. No copia symlinks, credenciales, archivos privados, rutas API/comentarios ni fixtures. Se conserva `.well-known/security.txt`, que formaba parte del Hosting recuperado.

Los botones de notificación recuperados usan ahora un adaptador nuevo que envía el ID token actual de Firebase, o la sesión BFF con su CSRF en la variante explícita. Todas las rutas son del mismo origen; abrir el build demo en localhost no redirige esas notificaciones al proyecto real. Las acciones de usuarios/todos ejecutan el backend también con BFF desactivado, en lugar de mostrar el éxito simulado de la publicación recuperada. El backend sigue comprobando permisos y los emuladores conservan su outbox de prueba. Los cuatro comandos Firestore de replicación/restauración escriben `createdBy` desde el usuario Auth actual y fallan si no hay sesión; no usan un autor `unknown`.

## Manifest verificable

Cada salida contiene `mci-release.json`, con `schemaVersion: 1`, destino `production` o `emulators`, `projectId`, flags de emuladores/BFF/worker, entrada relativa, procedencia reconstruida y estado de source maps. `files` registra `{path, sha256, bytes}` de todos los archivos públicos salvo el propio manifest. Los hashes detectan cambios respecto de ese inventario; no son una firma de autenticidad.

La configuración Firebase de despliegue debe seleccionar el artefacto correcto y comprobar este manifest, su entrada y sus hashes antes de publicar. `firebase.json` usa históricamente `dist`, pero el build predeterminado genera emuladores y `.firebaserc` identifica el proyecto real. Un build local correcto no acredita que sea publicable: el guard de empaquetado debe rechazar la combinación demo/proyecto real. La configuración y el guard de despliegue se mantienen fuera de este script.

## Revisión segura y límites

El build de producción es un artefacto para revisión, no una vista de prueba aislada. Abrirlo en un navegador puede autenticar contra Firebase real, sincronizar perfiles/sesión y registrar notificaciones si existen permisos. No usarlo para CRUD de prueba. Firebase Hosting preview channels también utilizan los servicios reales del proyecto salvo configuración alternativa explícita. Las pruebas de comportamiento con datos ficticios pertenecen al build normal y a los emuladores.

No se desplegó Hosting, Functions, reglas ni índices como parte de esta preparación. La prueba local y el inventario no demuestran que todas las integraciones de producción estén configuradas o autorizadas. Persisten las limitaciones documentadas de recuperación y los permisos externos que requieran intervención del propietario.

`node --test tests/frontend-release.test.mjs` verifica perfiles, argumentos, exclusión de archivos privados, ausencia de symlinks/maps, hashes y la configuración realmente compilada de un build aislado de producción. La única advertencia conocida de esbuild corresponde al `case` duplicado del html2canvas publicado, preservado sin alterar su código de proveedor.

`node --test tests/frontend-authenticated-request.test.mjs` comprueba el token firmado entregado al transporte, rechazo antes de red sin sesión o con refresh fallido, conservación de sesión BFF/CSRF, rutas del mismo origen, fallos explícitos del backend y los contratos de todos los botones/comandos adaptados. Estas pruebas no envían notificaciones reales.
