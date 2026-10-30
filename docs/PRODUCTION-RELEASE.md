# Candidato de producción

El código y la configuración disponibles están en este repositorio. El backend procede de las fuentes desplegadas recuperadas; el frontend es una reconstrucción editable del JavaScript publicado. No se recuperaron los JSX/TSX originales. Los documentos, usuarios y objetos privados existentes siguen en Firebase: no se incluyen en Git ni se sustituyen al compilar.

## Preparar y verificar

El build habitual conserva el entorno demo. La configuración de producción usa otra carpeta para evitar publicar ese demo por accidente:

```bash
npm run release:prepare
```

Este comando recompila `dist-production/` y Functions y verifica el manifiesto de los archivos públicos. No ejecuta Firebase CLI ni despliega. `mci-release.json` identifica proyecto, entorno, entry point y SHA-256/tamaño de cada archivo. La publicación no incluye source maps, credenciales ni fixtures. El snapshot recuperado sigue separado.

Con los emuladores de `demo-mci-servidores` activos, ejecutar:

```bash
npm run release:verify
npm run release:check
```

`release:verify` vuelve a compilar frontend y backend, ejecuta todas las pruebas Node/Python y ambas suites de integración locales. El resultado se vincula al digest de las fuentes, configuración, reglas, dependencias y backend compilado, y al manifiesto de ese build. Un cambio posterior obliga a validar de nuevo. Los logs de fallos quedan en `recovery/private/`; el informe público no contiene credenciales.

`release:check` escribe `recovery/production-readiness.json`. Devuelve código 2 mientras falte una comprobación obligatoria. Un artefacto compilado puede pasar su control de integridad y seguir bloqueado para publicación por configuración o pruebas externas pendientes. No se cambia el informe para simular éxito.

## Controles antes de publicar

Los hooks de Hosting, Functions, Firestore y Storage ejecutan el control de release. El Hosting predeterminado comprueba al menos que su carpeta contiene un build de producción; el comando normal de build demo no satisface ese control. `firebase.production.json` apunta exclusivamente a `dist-production/` y exige la comprobación completa. El proyecto seleccionado por Firebase CLI se comprueba mediante `GCLOUD_PROJECT`, además del proyecto del manifiesto y `.firebaserc`. [Firebase documenta los hooks y la configuración alternativa](https://firebase.google.com/docs/cli#predeploy_and_postdeploy_scripted_tasks).

Los imports de service worker con nombre fijo llevan `no-cache, must-revalidate`. Las rutas `/api/**` y `/comments/**` conservan el destino real recuperado `serverApi`, región `us-central1`. El frontend mantiene BFF desactivado por defecto, como el despliegue recuperado.

Las pruebas nuevas rechazan escaladas de rol, comandos de otro autor, notificaciones anónimas, cambios de asignación fuera del área autorizada y escrituras Storage sobre recursos ajenos. Los cambios son locales hasta que exista un despliegue autorizado. `docs/PRODUCTION-GAPS.md` distingue correcciones comprobadas y requisitos externos.

## Configuración externa pendiente

- **Drive:** completar OAuth del propietario y una prueba real de archivo sintético en `Respaldo MCI`. Guardar DPAPI en este PC no configura Functions.
- **Runtime:** validar el plan de variables de `cleanupOldFiles` en modo OAuth, las referencias existentes de Secret Manager, su acceso por la identidad del runtime y el binding de los secretos en el código. El informe `recovery/production-runtime-validation.json` requiere `project`, `proposedMode: "oauth"`, `candidateConfigurationValidated`, `secretReferencesVerified` y `runtimeIdentityAccessVerified` verdaderos, respaldados por comprobaciones reales del operador. No implica que ya se haya desplegado ese plan. El módulo `functions/src/backend-release.ts` comprueba la configuración sin imprimir valores.
- **Storage:** las reglas nuevas consultan perfiles y recursos de Firestore. La lectura IAM realizada no encontró el binding incondicional esperado `roles/firebaserules.firestoreServiceAgent`; no se modificó IAM. Se debe verificar o autorizar ese acceso antes de publicar estas reglas. [Documentación de consultas entre servicios](https://firebase.google.com/docs/storage/security/rules-conditions#enhance_with_firestore).
- **Notificaciones y dispositivo:** Google Auth y cámara física ya tienen evidencia real. Quedan la observación de notificación en segundo plano y su clic, GPS físico y entrega de tareas programadas en un entorno Cloud aislado. Las simulaciones de emuladores no sustituyen estas observaciones.
- **Privacidad histórica:** las URLs de descarga antiguas necesitan revisar el tratamiento descrito en `docs/PRODUCTION-GAPS.md` y `docs/BACKEND-ATTENDANCE-PRIVACY.md`. El candidato ya separa el roster, la asistencia privada y el directorio mínimo de los perfiles completos. Debe prepararse también el backfill acotado de `user_directory` y su caché, antes de restringir reglas y publicar consumidores compatibles. Antes de aprobar un rollout se necesita un plan acotado de backfill, rotación de tokens, orden de publicación y rollback. El informe `recovery/production-privacy-validation.json` debe respaldar `candidatePrivacyTestsPassed`, `migrationPlanValidated`, `legacyTokenRotationPlanValidated`, `rosterBackfillPlanValidated` y `directoryBackfillPlanValidated`. No se debe rotar tokens de producción mientras siga publicado el cliente antiguo. La aplicación y la verificación final de esa migración pertenecen al despliegue autorizado; el gate no exige fingir que ya se ejecutó.

Los secretos no se guardan en `.env.example`, GitHub, el artefacto web ni argumentos de comandos. Firebase requiere vincular explícitamente los secretos a cada función que los utiliza; véase [configuración segura de Functions](https://firebase.google.com/docs/functions/config-env#secret_parameters).

Las lecturas históricas PITR del candidato usan la opción real `readTime` del SDK y rechazan respuestas actuales o no verificables antes de restaurar. Esto se comprobó con el transporte del SDK sustituido localmente; la disponibilidad de versiones y permisos Cloud sigue sin verificarse. No se restauraron datos. Detalles en `docs/BACKEND-PITR.md`.

## Despliegue futuro

No se ha ejecutado ningún despliegue. Cuando el control completo devuelva `ready` y exista autorización para publicar, la configuración prevista es `firebase.production.json` con `--project mcimachala-servidor`. La revisión debe incluir juntos frontend, Functions y reglas: publicar solo el frontend dejaría los controles de servidor y reglas anteriores. Conservar antes la versión Hosting previa y las fuentes/configuración recuperadas para poder comparar o revertir. No ejecutar migraciones, backfills o limpiezas de producción como parte de la validación local.

Las optimizaciones de consultas, imágenes, carga inicial y seguridad del 30 de octubre están documentadas en `docs/OPTIMIZATION-2026-10-30.md`. La CSP estricta es Report-Only; App Check y controles Cloud de facturación no se han activado.
