# Drive: acceso real comprobado y bloqueo pendiente

El 29 de octubre de 2026 se consultó la configuración **actual** de `cleanupOldFiles` mediante Cloud Functions API. La respuesta 200 confirma que ejecuta como `mcimachala-servidor@appspot.gserviceaccount.com`. La carpeta de respaldo procede del código desplegado recuperado. No se cambió esa configuración ni se ejecutó la limpieza sobre datos reales.

Posteriormente se eligió conservar esa carpeta con OAuth del usuario. El procedimiento local, sin rol IAM nuevo ni despliegue, está en [`DRIVE-OWNER-OAUTH.md`](DRIVE-OWNER-OAUTH.md). Este informe conserva los resultados anteriores de la cuenta de servicio; no se convierte su rechazo IAM en un rechazo del nuevo grant de usuario.

La sesión Firebase CLI `apolonetworsyt@gmail.com`, utilizada en la recuperación, pudo leer la función, pero la solicitud de un token breve para esa cuenta de servicio, limitada al scope `drive.readonly`, respondió **403 `PERMISSION_DENIED`**, razón `IAM_PERMISSION_DENIED`, permiso ausente `iam.serviceAccounts.getAccessToken`. El token de la cuenta de servicio no llegó a emitirse y no se pudo realizar `files.get` sobre la carpeta. Ese rechazo corresponde a esta sesión; otras identidades pueden tener permisos diferentes. No se crearon credenciales, archivos Drive ni permisos IAM. La evidencia saneada está en [`recovery/drive-readiness.json`](../recovery/drive-readiness.json).

Los dos ZIP Gen2 conservan únicamente `MCI_FIREBASE_WEB_API_KEY` en `.env`; no contienen una clave privada de la cuenta de servicio. Tampoco estaba configurado `GOOGLE_APPLICATION_CREDENTIALS` ni el archivo ADC local estándar de gcloud. Por tanto, no hay otra credencial local de esa identidad comprobada que sustituya el permiso denegado. La conexión Drive de un usuario humano no acredita los permisos de la identidad que usa Functions.

La comprobación opcional con esa identidad requiere un operador que **ya tenga** `iam.serviceAccounts.getAccessToken`. No se concedió un rol nuevo para realizar el diagnóstico. Google documenta el permiso y los tokens de corta duración en [generateAccessToken](https://docs.cloud.google.com/iam/docs/reference/credentials/rest/v1/projects.serviceAccounts/generateAccessToken) y [roles de autenticación de cuentas de servicio](https://docs.cloud.google.com/iam/docs/service-account-permissions).

Una vez disponible la identidad se debe consultar `files.get` con `supportsAllDrives=true`, sin descargar el contenido: tipo carpeta, estado de papelera, `driveId` y capacidades `canAddChildren`/`canEdit`. Esa lectura acredita visibilidad y capacidades declaradas, pero una prueba de archivo real sigue siendo una operación aparte. Los campos y el alcance de lectura están definidos en [files.get](https://developers.google.com/workspace/drive/api/reference/rest/v3/files/get).

El conector humano de `lolitocrack10@gmail.com` sí pudo consultar la misma carpeta: `Respaldo MCI`, `shared:true`, `drive_id:null`. La ausencia de `driveId` identifica una carpeta personal compartida, distinta de una unidad compartida. Eso no demuestra acceso de la cuenta de servicio; tampoco se deducen todas sus ACL a partir de permisos directos, porque puede haber grupos o herencia. Google define `driveId` en la [metadata de archivos](https://developers.google.com/workspace/drive/api/reference/rest/v3/files).

Existe, por tanto, otro bloqueo además del diagnóstico IAM: las cuentas de servicio no tienen almacenamiento personal ni pueden ser propietarias de nuevos archivos. Compartirles una carpeta de Mi unidad como editor no les concede cuota. La vía compatible es una unidad compartida accesible al runtime o OAuth en nombre de un usuario humano. Véase [almacenamiento y unidades compartidas](https://developers.google.com/workspace/drive/api/guides/about-shareddrives). Emitir un token de lectura no resuelve este requisito de destino/propiedad.

## Configuración preparada en el código

`drive-archive.ts` comprueba el destino antes de listar o descargar objetos de Storage. Consulta únicamente metadata, exige carpeta activa y `canAddChildren:true`, e identifica el principal ADC. Una cuenta de servicio necesita un `driveId`; si falta o no se pueden verificar identidad/permisos, la limpieza termina con un código seguro antes de tocar archivos. Los `files.create` directos pasan por la misma guardia.

| Variable | Comportamiento |
| --- | --- |
| `MCI_DRIVE_ARCHIVE_FOLDER_ID` | Sobrescribe la carpeta recuperada, sin cambiarla por defecto. |
| `MCI_DRIVE_AUTH_MODE=adc` | Predeterminado: identidad de servicio verificable y carpeta de unidad compartida. |
| `MCI_DRIVE_AUTH_MODE=oauth` | Usa OAuth de usuario previamente autorizado, con acceso offline a Drive. |
| `MCI_DRIVE_OAUTH_CLIENT_ID`, `MCI_DRIVE_OAUTH_CLIENT_SECRET`, `MCI_DRIVE_OAUTH_REFRESH_TOKEN` | Valores completos proporcionados al runtime de forma segura, únicamente en modo OAuth. |

No se configuraron ni se solicitaron nuevas credenciales. El ejemplo contiene valores vacíos. Los secretos futuros deben quedar fuera de Git/chat y la biblioteca los usa solo en memoria. El consentimiento Google usado para iniciar sesión en Firebase no concede por sí mismo acceso de archivo a Drive. Google describe la [resolución de ADC](https://docs.cloud.google.com/docs/authentication/application-default-credentials) y el [OAuth de servidor con acceso offline](https://developers.google.com/identity/protocols/oauth2/web-server).

Seis pruebas de preflight comprueban el rechazo de la carpeta personal con cuenta de servicio antes de listar Storage, la aceptación de unidad compartida, OAuth de usuario explícito, configuración incompleta/identidad desconocida, permisos denegados y validación del destino. Usan credenciales ficticias y SDK dobles; no son una prueba de OAuth/Drive externo.

## Consulta opcional desde Cloud Shell

Desde un checkout del repositorio, un operador con permiso de impersonación existente puede ejecutar una vez:

```bash
python3 scripts/check-drive-readonly-cloudshell.py --account apolonetworsyt@gmail.com
```

La grafía del correo es la de la sesión de recuperación comprobada. El script captura el token de esa sesión gcloud, solicita un token de servicio de 600 segundos con scope `drive.readonly` y consulta la metadata de la carpeta. No concede IAM, inicia sesiones, crea credenciales ni escribe en Drive/Storage. No imprime ni guarda tokens; solo muestra resultados saneados. Si falta permiso, devuelve el bloqueo sin ejecutar la consulta de carpeta. `--dry-run` no lee credenciales ni llama a Google. Tres pruebas cubren esa ausencia de efectos, el flujo limitado a dos peticiones y la redacción de errores. La emisión a través de la CLI y su uso se apoyan en [gcloud auth print-access-token](https://docs.cloud.google.com/sdk/gcloud/reference/auth/print-access-token) y la API IAM citada arriba.

## Correcciones verificadas sin escribir en Drive real

La limpieza ahora declara `supportsAllDrives:true` al subir archivos, como requiere la [compatibilidad con unidades compartidas](https://developers.google.com/workspace/drive/api/guides/enable-shareddrives). Solicita `id,size,md5Checksum` y solo autoriza borrar el original si el tamaño y checksum de la respuesta coinciden con los bytes enviados. Un id aislado, metadata incompleta, error o diferencia conserva el original. Los campos pertenecen a la [metadata de archivos binarios de Drive](https://developers.google.com/workspace/drive/api/reference/rest/v3/files).

El borrado de Storage usa `ifGenerationMatch` con la generación leída antes del respaldo. Si alguien reemplaza el objeto durante la subida, el borrado condicional falla y conserva la nueva versión. El identificador se mantiene como string para no truncar enteros grandes. Este comportamiento sigue las [precondiciones de Cloud Storage](https://docs.cloud.google.com/storage/docs/request-preconditions).

Siete pruebas nuevas ejercen éxito, checksum/tamaño ausentes o incorrectos, cambio concurrente de generación, paso del string completo por el SDK Storage instalado, ausencia de generación, ventanas inválidas y fallo del outbox demo. Junto con las pruebas anteriores, el adaptador local conserva los bytes antes de confirmar el respaldo. Son verificaciones locales; no se presentan como archivo en Drive real ni ejecución real de Cloud Scheduler.
