# Cambios verificables del backend — 29 de octubre de 2026

El paquete original desplegado permanece en `../recovered/backend-snapshots/`. `src/index.ts` conserva las 30 exportaciones y los contratos recuperados; no se desplegó este código sobre Firebase.

Se extrajeron cuatro módulos para mantener y probar los componentes que faltaban:

- `runtime-services.ts`: destino de autenticación REST y adaptadores FCM/Drive. Un adaptador local requiere a la vez proyecto `demo-*`, indicador de emulador y Firestore en loopback. Un proyecto real sigue usando los SDK reales. Si falta un emulador necesario no se hace fallback silencioso a Google.
- `notification-utils.ts`: serialización de payloads FCM y cálculo de fechas/ventanas de recordatorio con la hora de Ecuador. Las fechas inválidas no se normalizan a otro día accidentalmente.
- `cleanup.ts`: archivar archivos antiguos de `events/` antes de eliminarlos. Una excepción o una respuesta sin identificador de archivo de Drive conserva el original. La programación recuperada se mantiene: domingo 03:00 en America/Mexico_City.
- `admin-read-routes.ts`: los seis GET que la pantalla AppHistory referencia pero el backend publicado había desactivado/comentado. Las lecturas están restringidas a `master_admin`, tienen límites y el historial admite cursor. Solo devuelven campos concretos de las colecciones almacenadas; no habilitan la ingestión de telemetría ni la auditoría de mutaciones.

## Flujos corregidos

`POST /api/passwordLogin` usa Auth Emulator en un proyecto demo y devuelve las mismas cookies y CSRF que la ruta de sesión. No necesita una Web API key real en ese modo. Producción conserva el requisito de configuración y su endpoint Identity Toolkit.

`PATCH /api/users/me` guarda `preferences.notifications` y `preferences.darkMode` como un mapa anidado, conservando preferencias existentes. El código recuperado usaba claves de puntos con `set(...,merge:true)`, que se almacenaban literalmente.

Los handlers de descarga y eliminación usan el bucket demo predeterminado durante emulación. El código anterior podía subir al bucket demo y luego intentar descargar el mismo objeto del nombre de bucket de producción. Fuera del modo demo conserva el nombre original.

## Integraciones locales y sus límites

FCM no tiene un emulador de entrega. En el modo demo, `send`, `sendEachForMulticast`, `subscribeToTopic` y `unsubscribeFromTopic` escriben `_local_integration_outbox`. Los registros indican `simulated:true`, conservan los datos de la notificación y cuentan los destinatarios, pero sustituyen los tokens por hashes. No se enviaron notificaciones ni suscripciones reales. Los tokens ficticios que empiezan por `demo-invalid:` permiten verificar la limpieza de registros expirados.

Drive tampoco tiene emulador oficial. En el modo demo, el adaptador conserva los bytes del respaldo en Storage Emulator bajo `_local-drive-archive/` y registra su hash y ruta en el outbox antes de confirmar el archivo. Esto verifica que la limpieza no borre el único ejemplar. No acredita acceso a la carpeta real ni el funcionamiento de OAuth/Drive en producción.

`GET /api/admin/firestore-reads` responde `ok:false`, `METRICS_NOT_COLLECTED`. No se recuperó un medidor de consumo facturable; los bytes/requests del navegador no equivalen a lecturas de Firestore. Las rutas de telemetría leen registros existentes y exponen `collectionEnabled:false`; no inventan valores para llenar la pantalla.

## Dependencias y pruebas

La consulta actual a npm detectó un aviso alto nuevo en body-parser, que se corrigió dentro del rango compatible. Para evitar migrar Firebase Admin a un major que Firebase Functions 7 no admite en sus peer dependencies, se aplicaron overrides limitados: `qs@6.17.1` y `uuid@11.1.1` para google-gax y teeny-request. Ambos consumidores usan únicamente la API CommonJS `v4`; una prueba verifica esa interfaz. La auditoría terminó con cero vulnerabilidades el 29 de octubre de 2026.

`node --test tests/backend-adapters.test.mjs` valida las guardas demo, destino de login, FCM/outbox y redacción de tokens, archivo local Drive, payloads, zona horaria, límites de recordatorios, orden archivar/eliminar, preservación ante errores y compatibilidad de los overrides. La integración contra los emuladores prueba aparte los endpoints reales de la aplicación; estas pruebas de adaptadores no se presentan como entrega real FCM ni copia en Drive de producción.
