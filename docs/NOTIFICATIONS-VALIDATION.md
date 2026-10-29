# Notificaciones — revisión del 29 de octubre de 2026

La repetición final solicitada por el usuario empleó también el helper foreground real de la aplicación (`d`/`Dn`), además del SDK `onMessage`. FCM aceptó el envío y la interfaz observó **un mensaje recibido y una notificación nativa registrada**. El aviso de prueba fue silencioso y persistente hasta su cierre o limpieza. Esto confirma el camino foreground de la aplicación; no convierte el envío anterior con la pestaña cerrada en una observación positiva de segundo plano ni acredita un clic nativo.

## Evidencia y límites

La API real FCM aceptó con HTTP 200 un `messages:send` con `validate_only:true` y destino de topic sintético único. Esta operación no entregó un aviso ni registró tokens en Firestore. `recovery/fcm-readiness.json` conserva el resultado sin credenciales. La clave VAPID pública recuperada es un punto P-256 válido de 65 bytes; ese análisis por sí solo no prueba su asociación con el proyecto ni la entrega a un navegador.

La primera prueba real del navegador obtuvo permiso nativo y un token FCM, pero el envío dirigido a ese dispositivo devolvió HTTP 404 `NOT_FOUND`. No se confirmó recepción. `recovery/fcm-device-validation.json` conserva la evidencia sin token; el permiso y la existencia de un token no se presentan como entrega correcta. La fixture retiró el registro y el worker después del intento.

Después de retirarlos se generó un registro nuevo: la API aceptó el envío y el callback real `onMessage` recibió un mensaje en primer plano. No había un registro cacheado antes de ese segundo intento. La causa del primer 404 no quedó determinada; no se atribuye a un código `UNREGISTERED` que la primera respuesta no conservó. Este éxito verifica el flujo SDK/navegador/FCM al dispositivo consentido sin dar de alta su token en la aplicación de producción.

Una tercera petición con 15 segundos de retardo también fue aceptada por FCM con HTTP 200. Se cerró la única pestaña de ese origen antes de la entrega. Tras reabrir, la primera inspección enumeró cero avisos; después se perdió la conexión de control del navegador. La visualización nativa en segundo plano queda **sin verificar**: la aceptación de la API no se equipara a una notificación observada ni el primer recuento cero se convierte en una prueba de ausencia de entrega.

Se restableció la sesión de automatización y se repitió la prueba a petición del usuario. Esta cuarta petición obtuvo HTTP 200, un `onMessage` y un aviso nativo registrado, usando el helper foreground de la aplicación. **La limpieza final está verificada**: se retiraron token, instalación y worker, la inspección posterior contó cero avisos, se cerraron las pestañas de prueba y se detuvo el servidor loopback. No se guardó ni se publicó el token del dispositivo. La prueba positiva de primer plano no sustituye la observación pendiente del aviso o clic de segundo plano.

El contrato publicado usa el SDK Messaging recuperado y `getToken`, con la clave VAPID pública y una `ServiceWorkerRegistration` explícita. Se conserva ese contrato; no se cambia silenciosamente a otra API de destinatarios. La [guía oficial de registro de Firebase](https://firebase.google.com/docs/cloud-messaging/web/get-started) explica el permiso y las credenciales web. La [referencia de `messages:send`](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages/send) define la validación sin entrega.

## Correcciones

- El permiso del navegador ya no marca las notificaciones como activadas antes de obtener y guardar el token.
- La activación del worker tiene un límite de 15 segundos y rechaza workers redundantes, evitando esperas indefinidas.
- La renovación pasiva y la desactivación no solicitan permiso de notificación cuando todavía no está concedido.
- La solicitud explícita de permiso termina con un mensaje claro si el navegador no responde en 20 segundos, sin simular una concesión.
- Los consumidores comparten el único callback del SDK recuperado. Desmontar uno no desconecta a los demás y cancelar durante la inicialización no deja un listener huérfano.
- El trigger backend compara tokens anteriores y posteriores: desuscribe los retirados, incluidos documento borrado y lista vacía. Antes, la ruta cliente directa retiraba el token de Firestore pero conservaba sus topics.
- Antes de perder la sesión/cookie, logout retira únicamente el token de este navegador del usuario actual y elimina su registro FCM, metadatos locales y suscripción Push. Conserva otros dispositivos y cuentas. Si la eliminación remota falla o queda pendiente, intenta igualmente la retirada local con esperas acotadas. No solicita permisos ni crea tokens para cerrar sesión. El servicio importa sus dependencias directamente, evitando el re-export circular de `App.jsx`.

Las ocho pruebas de `tests/notification-client.test.mjs` ejercen estas condiciones del cliente, incluido el hook real con registro pendiente o fallido, el callback de logout de `AuthProvider`, el orden de sus pasos y fallos/timeouts remotos. Las pruebas backend de topics verifican el delta y sus límites. La revisión completa pasa 101 pruebas Node. Estos tests no equivalen a una entrega FCM real.

La [guía oficial de recepción](https://firebase.google.com/docs/cloud-messaging/web/receive-messages) distingue primer plano, segundo plano y click. La prueba del worker conserva esa separación: entrega el sobre al SDK en primer plano, muestra el aviso en segundo plano y limita la navegación al mismo origen.

## Prueba real de un único navegador, por interfaz

Ejecuta `node scripts/build-notification-fixture.mjs`. Este build solo escribe `dist/__browser-tests/`, sin compilar ni iniciar la aplicación principal. Usa cinco módulos del SDK/cliente real con la configuración web pública de producción. No inicializa Auth ni Firestore. La fixture se excluye de la caché PWA y todo `dist/` permanece fuera de Git.

Inicia `scripts/serve-notification-test.mjs` con `--account`, `--firebase-cli` y un puerto loopback libre, por ejemplo `--port 5182`. Requiere una sesión CLI ya autorizada; no acepta contraseñas o tokens por argumento. `--delay-ms 15000` permite cerrar la pestaña antes de entregar el único aviso de esa instancia; el límite es 15 segundos. Cerrar la respuesta del navegador no cancela el envío ya solicitado. Abre `http://127.0.0.1:5182/__browser-tests/notifications.html` en un navegador ordinario.

1. **Preparar worker y receptor** activa un worker aislado bajo `/__browser-tests/` y el callback real `onMessage`.
2. Tras marcar el consentimiento, **Registrar navegador y enviar una prueba** solicita el permiso nativo. Obtiene un token para este navegador y llama únicamente al servidor loopback. Este exige origen y nonce, acepta una sola petición y envía un aviso sintético exclusivamente a ese token. No registra el token en el backend de la aplicación.
3. Comprueba `serverAccepted` y `messagesReceived`; en segundo plano, **Inspeccionar avisos** cuenta las notificaciones nativas. El worker de esta fixture fuerza avisos silenciosos.
4. **Retirar token y worker** elimina el registro FCM y la instalación de prueba, retira la suscripción Push, cierra avisos y elimina el worker. Ante fallo remoto, intenta igualmente la limpieza local y muestra un estado incompleto.

No se usa CDP ni se alteran permisos por automatización. El token solo viaja en memoria entre SDK, fixture y servidor loopback; no se imprime, se muestra en el DOM ni se incluye en los informes. El SDK utiliza su IndexedDB normal hasta retirar el registro. El informe privado del servidor conserva solo estado HTTP, contador y tipo de destino. Una aceptación HTTP sin recepción observada se documenta como aceptación del servidor, no como entrega confirmada.
