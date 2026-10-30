# Optimización del candidato, 30 de octubre de 2026

Cambios locales autorizados sobre `8eb20e5c439d26c37842a088665abda718a0f682`. No se ejecutaron despliegues, cambios IAM, operaciones en datos de producción ni activación de App Check. El frontend sigue siendo una reconstrucción mantenida, no los JSX/TSX originales.

## Consultas y respuesta de las secciones

- Eventos consulta el período seleccionado en Firestore. Empieza con 50 eventos y permite ampliar hasta 200, solicitando un registro adicional para detectar más resultados. Los filtros usan el calendario de Ecuador; la búsqueda identifica que actúa sobre los eventos cargados. No se presentan estos límites crecientes como paginación por cursor.
- Asistencias calcula registros y estadísticas con los snapshots autorizados ya recibidos. Cambiar una asignación no vuelve a ejecutar `getDocs` sobre todo el rango. Las suscripciones de eventos sin cambios se conservan; al cambiar usuario, ámbito o vista se liberan. Los calendarios ya no descargan 500 eventos únicamente para mostrar fechas disponibles.
- Historial limita eventos al período y sus asignaciones al UID autenticado; ambos modos, cliente y BFF, comparten el rango y límite. Algunas asignaciones originales no contienen `eventId` ni `eventDate`; se conserva la lectura por colección del evento para no perderlas. Esto puede requerir más consultas para alguien con poco historial que la antigua consulta vacía única, pero acota el crecimiento histórico. Hasta 200 eventos, después se debe acotar el período. Una futura migración de esos campos permitiría reducir ese fanout; no se hizo en producción.
- Historial administrativo pausa sus sondeos cuando la pestaña no está visible y solicita usuarios recientes como máximo cada cinco minutos. La API resuelve autores de la página en vez de leer 2.000 usuarios por cada refresco; la lista independiente se limita a los 100 más recientes.

## Imágenes, diseño y carga inicial

`OptimizedImage` y `PrivateImage` no inician el transporte protegido hasta que se aproxima el elemento visible, salvo solicitud explícita de carga inmediata. Las tarjetas prefieren miniaturas; el original requiere opt-in o ser la única fuente. Se mantienen autenticación, `no-store`, cancelación y revocación de blobs. Las fotos privadas no se incorporan a la caché pública.

Las tarjetas sin portada no reservan un bloque vacío. Muestran fecha, horario y lugar, un enlace de detalle y un menú secundario accesible para administrar. Las portadas se obtienen de metadatos explícitos: no se listan automáticamente objetos de Storage. Un evento antiguo sin referencia de portada aparece sin imagen hasta que una edición autorizada la corrija. Los filtros móviles se pliegan, mantienen un resumen visible y ofrecen accesos al mes y la semana actuales.

El build elimina del artefacto web los módulos publicados antiguos, conservados íntegros en `recovered/hosting`. Los imports actuales resuelven sus propios chunks; se retiran las listas de preload antiguas y los imports anticipados del generador PDF. Producción minifica sintaxis y espacios. El CSS obtiene un nombre con hash de contenido: mantener el nombre publicado provocaba que un navegador conservara estilos anteriores bajo `immutable`.

El worker instala únicamente el shell anónimo y sus dependencias estáticas de arranque. Las secciones, cámara y PDF se descargan bajo demanda; los recursos públicos visitados se cachean sin cookies, con validación MIME y sin respuestas privadas, cookies, query strings o HTML de fallback bajo una ruta JavaScript. El HTML anónimo de instalación es la única excepción intencionada a `no-store`, para permitir el shell offline. Offline no garantiza acceso a datos privados ni a una sección nunca visitada.

Las cifras de `recovery/optimization-validation.json` comparan bytes locales sin compresión del precache del artefacto anterior y del nuevo. No equivalen a transferencia facturada, tiempos medidos de red ni a un porcentaje de ahorro mensual.

## Seguridad aplicada en el candidato

- `users/{uid}` completo es legible por su propietario o administradores. `app_cache/users` queda reservado a administradores. `user_directory` y su caché contienen una lista explícita de nombre, usuario, fotos, rol, áreas, estado de asignación y elegibilidad acotada `ministryRoles`, sin correo, preferencias, GPS ni campos arbitrarios. El backend mantiene las proyecciones a partir del estado actual, evitando resurrecciones por triggers atrasados.
- Los accesos HTTP de login tienen frenos por IP e identidad por instancia. Notificaciones incorpora una cuota transaccional por actor de 20 intentos aceptados por minuto. La capacidad de dispositivos FCM es diez y el frontend explica ese límite; una lista antigua mayor puede reducirse. La telemetría cliente desactivada no admite nuevas escrituras.
- Los orígenes HTTP se limitan a los dominios Firebase conocidos y orígenes HTTPS explícitos en `MCI_ALLOWED_ORIGINS`. Loopback HTTP sólo se acepta en demo. Esto complementa los guards de identidad, permisos y CSRF.
- Ambos alias HTTP declaran `maxInstances: 10`. Se conserva memoria y timeout hasta medir carga; bajar recursos sin evidencia puede aumentar duración o errores. `googleapis` y `sharp` se cargan cuando su operación los necesita, no al iniciar todas las funciones.
- Una CSP más estricta se prepara como `Report-Only`; no se afirma que ya bloquee recursos. App Check, MFA, presupuestos y topes de gasto no se activaron en Cloud. Las cuotas de código no son un límite absoluto de factura y Firestore cliente queda fuera del límite de instancias HTTP.

## Orden requerido antes de un futuro despliegue

La separación de perfiles requiere un rollout coordinado. Un operador debe revisar un backfill acotado e idempotente de todos los perfiles existentes hacia el directorio y su caché, comprobar que no haya campos privados y que la elegibilidad por ministerio coincida, y verificar recuentos y muestras autorizadas sin exportar datos personales al repositorio. Se preparan primero backend/proyecciones y compatibilidad de consumidores, y sólo después se restringen las reglas y se publica el frontend compatible. El rollback no debe volver a hacer públicos perfiles completos; debe conservar el directorio y un cliente compatible. El historial de asistencia y la rotación de tokens antiguos mantienen su propio plan de orden y rollback.

No hay un backfill de perfiles de producción ejecutado ni aprobado en esta validación. La semilla demo crea las proyecciones determinísticamente sólo en `demo-mci-servidores`. El gate exige también `directoryBackfillPlanValidated` en la evidencia de migración, además de los requisitos externos anteriores de Drive, Storage/IAM, notificaciones, GPS y Scheduler. Subir este commit a GitHub no autoriza desplegarlo.

## Validación

El informe definitivo `recovery/production-validation.json` vincula las pruebas al hash de estas fuentes, al backend compilado y al manifiesto del build. `recovery/flow-validation.json` y `recovery/release-rules-validation.json` documentan los flujos emulados. La revisión visual y sus límites se registran en `recovery/optimization-browser-review.json`. No se sustituyen las pruebas externas pendientes por resultados sintéticos.
