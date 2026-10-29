# Conservar la carpeta actual con OAuth del usuario elegido

Se eligió conservar `Respaldo MCI` mediante OAuth de usuario. El código permite preparar y comprobar ese acceso localmente, sin desplegar ni leer/borrar objetos de Storage de producción. La comprobación IAM de la cuenta de servicio queda como diagnóstico histórico; esta opción no necesita concederle un rol nuevo.

## Consentimiento local con el cliente existente

El cliente web recuperado tiene autorizado el origen `http://localhost:5000`. El bootstrap usa el modelo **GIS authorization code con popup** en ese origen y canjea el código con `redirect_uri` igual al origen. No añade un callback a la configuración OAuth ni crea otro cliente. Este comportamiento está documentado en [GIS Code Model](https://developers.google.com/identity/oauth2/web/guides/use-code-model) y [CodeClientConfig](https://developers.google.com/identity/oauth2/web/reference/js-reference).

El popup GIS no expone parámetros PKCE personalizados. El código no inventa esa opción: comprueba Host, dirección loopback, Origin exacto, cookie HttpOnly/SameSite, encabezado personalizado y CSRF, además de un intento aleatorio de un uso que caduca a los cinco minutos. El servidor solo escucha en `127.0.0.1`; la sesión completa dura quince minutos.

El scope solicitado es `openid email https://www.googleapis.com/auth/drive.file`, con `include_granted_scopes:false`. El servidor verifica firma/audiencia del ID token, identidad esperada y correo verificado, audiencia/caducidad/scopes del access token y presencia del refresh token offline. Rechaza scopes de Drive más amplios inesperados; no hace fallback automático a acceso completo.

`drive.file` necesita que el usuario comparta con esta aplicación la carpeta preexistente mediante Google Picker. Pegar un ID o tener acceso en otro conector no proporciona ese permiso a este cliente. La interfaz solo acepta la selección de la carpeta configurada y el backend vuelve a comprobarla antes de guardar. Google recomienda [drive.file con Picker](https://developers.google.com/workspace/drive/api/guides/api-specific-auth).

Para que esa selección funcione deben estar disponibles Drive API, Picker API y una API key pública admitida por Picker para el proyecto del cliente. La utilidad no habilita APIs ni cambia restricciones de claves automáticamente.

La lectura administrativa del proyecto encontró ambas APIs deshabilitadas y la clave web limitada a otras APIs. Quedó preparada una propuesta concreta: habilitar `drive.googleapis.com` y `picker.googleapis.com` y añadir solo `picker.googleapis.com` a sus destinos permitidos, preservando las restricciones anteriores. Esa modificación espera autorización explícita; no se cambió el cliente OAuth, IAM ni Hosting. La comprobación de la consola encontró el estado OAuth «En producción»; no se publicaron ni modificaron sus pantallas de consentimiento.

## Archivos privados y ejecución

El archivo de configuración combina el cliente web existente con el origen observado, correo esperado, ID de carpeta, número de proyecto, API key pública y ruta privada de salida. Se prepara únicamente en `recovery/private/`, que Git ignora; no se piden secretos por chat. El bootstrap admite `--config` con ese archivo o JSON por stdin. No acepta secretos en argumentos individuales.

```bash
node scripts/drive-oauth-bootstrap.mjs --config recovery/private/drive-oauth/bootstrap.private.json
```

El comando imprime únicamente la página local. El usuario inicia Google, elige la carpeta y confirma guardar desde tres acciones explícitas. El refresh token se guarda cifrado con DPAPI CurrentUser en Windows. En otros sistemas se admite un archivo privado de modo `0600`. La ruta debe permanecer físicamente dentro de `recovery/private/`, estar ignorada por Git y no contener symlinks. No se sobrescriben credenciales anteriores. El access token de Picker solo viaja a la aplicación local mediante POST autenticado y permanece en memoria del navegador/SDK: no se inserta en HTML, DOM, almacenamiento web, logs ni reportes.

## Prueba de archivo real

Después del consentimiento y de guardar el archivo protegido:

```bash
node scripts/test-drive-owner-archive.mjs --credentials recovery/private/drive-oauth/owner.dpapi.json --execute-real-write
```

Sin `--execute-real-write` es un dry run que no lee credenciales ni llama a Google. Con la opción explícita utiliza las mismas funciones `createArchiveDriveClient` y `archiveOldEventFiles`, pero el bucket y archivo de origen son objetos sintéticos en memoria: no se inicializa Firebase Storage.

La prueba crea un único TXT sintético con nombre y marcador propios de la ejecución. Antes de escribir guarda un intento privado con ID desconocido: si Google crea el archivo pero se pierde la respuesta, el informe señala que puede quedar un artefacto. Comprueba tamaño/MD5 de subida y descarga los bytes para contrastar SHA-256. Solo elimina el archivo recién creado cuando ID, nombre, padre, marcador y hashes coinciden. Una discrepancia conserva el artefacto y bloquea el borrado; sus datos de localización quedan únicamente en `recovery/private/drive-oauth/probe-artifact.private.json`. El resultado público `recovery/drive-owner-validation.json` no contiene IDs privados, identidad del usuario, contenido ni credenciales.

La validación local incluye cinco pruebas del preflight OAuth, seis de las guardias del archivo de prueba, nueve de interfaz, diez de seguridad HTTP/DPAPI y dos de exclusión de secretos en Git. El total del proyecto pasa 133 pruebas Node y 15 Python. Esto prueba la implementación y sus barreras; el consentimiento y la prueba real de Google deben completarse por separado antes de afirmar acceso externo verificado. No se actualiza la configuración de Functions en producción al guardar el archivo local.
