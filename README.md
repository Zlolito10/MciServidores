# MCI Servidores

Recuperación de `mcimachala-servidor`, publicado en <https://mcimachala-servidor.web.app/login>. La recuperación lee Firebase y Google Cloud; no despliega ni modifica la aplicación de producción.

El repositorio contiene 47 archivos de Hosting verificados por SHA-256, 28 copias legibles del JavaScript de la aplicación, un frontend editable que se vuelve a compilar y el paquete de fuentes realmente desplegado del backend con sus 30 exportaciones. Se recuperaron las reglas activas de Firestore y Storage, cinco índices compuestos, una configuración de índices de campo y los rewrites/cabeceras vigentes de Hosting.

El frontend procede de JavaScript compilado. **No se recuperaron los JSX/TSX originales ni el package.json original del frontend.** Los archivos `frontend/src/` permiten mantener y recompilar esa lógica recuperada; no se presentan como los originales. El backend sí incluye `src/index.ts`, package.json, lockfile y tsconfig descargados de Functions. Ese archivo de origen ya contenía CommonJS y `@ts-nocheck` en el paquete desplegado.

## Ejecutar y probar

Usa Node.js 22 para Functions y los emuladores; Node.js 24.5 o superior para las herramientas del frontend. También se necesita Java 21 para Firestore/Storage y Firebase CLI 15.34.0 o compatible.

```bash
npm ci
npm --prefix functions ci --ignore-scripts
npm run build
npm test
npm run test:recovery
```

Para iniciar los emuladores, instala Firebase CLI localmente o proporciona `FIREBASE_TOOLS_PATH` con la ruta de su archivo `lib/bin/firebase.js`. Establece `JAVA_HOME` si Java no está en el PATH. Ejecuta con Node 22:

```bash
npm run emulators
```

En otra terminal:

```bash
node scripts/seed-emulators.mjs
npm run dev
```

Abre <http://127.0.0.1:5176/login>. El usuario de prueba `recoveryadmin` y su contraseña **exclusivamente local** se definen en `scripts/seed-emulators.mjs`. Los datos son sintéticos. El proyecto demo se llama `demo-mci-servidores`; no reutiliza los usuarios ni los documentos de producción.

```bash
npm run test:integration
```

La compilación predeterminada conecta Auth, Firestore, Storage y Functions a emuladores locales. El servidor hace proxy de `/api/**` y `/comments/**` hacia `serverApi` local. Para una comparación que use servicios de producción se requiere `npm run build:frontend -- --production-services`; esto solo compila y no despliega. Las operaciones de esa variante pueden usar los datos reales.

## Qué se conserva

| Carpeta/archivo | Procedencia y uso |
| --- | --- |
| `recovered/hosting/` | Publicación original descargada, sin modificar. |
| `recovered/readable-assets/` | 28 módulos formateados; equivalencia AST comprobada. |
| `frontend/src/`, `frontend/styles/` | JavaScript y CSS editables derivados del despliegue; el build usa esbuild. |
| `recovered/backend-snapshots/` | Fuentes/manifiestos/compilado del backend antes de las correcciones locales. |
| `functions/` | Backend recuperado y correcciones de compatibilidad verificadas. |
| `recovered/cloud-config/` | Configuración pública exportada de la versión de Hosting. |
| `recovered/functions-inventory.json` | Nombres, generaciones, región y runtime de las 30 funciones. |
| `firestore.rules`, `storage.rules`, `firestore.indexes.json` | Reglas e índices activos recuperados. |
| `recovery/private/` | Metadatos administrativos, ZIP, capas de imágenes y logs; excluidos de Git. |
| `docs/RECOVERY-STATUS.md` | Procedencia, comprobaciones, cambios y límites pendientes. |

`npm run verify` comprueba los bytes del snapshot. `npm run build:snapshot` conserva el modo anterior de copia exacta. `npm run build` ahora recompila el frontend editable y el backend TypeScript. El bundle de cámara conserva dos `require()` para Node en ramas que no se ejecutan en el navegador; se mantienen externos al recompilar. html2canvas conserva un aviso de `case` duplicado que ya estaba en el artefacto publicado.

## Validación y límites

Pasaron 9 pruebas del servidor, 12 del recuperador y 13 comprobaciones de integración con Auth, Firestore, Storage y Functions locales. En navegador se comprobaron inicio de sesión, dashboard, creación y detalles de un evento, y las ocho pantallas administrativas. No se observaron errores de consola durante esos recorridos.

Se corrigió el uso de símbolos Firestore mediante imports explícitos para que el runtime de emulación pueda ejecutar las escrituras. Se actualizaron dependencias vulnerables y se probó el procesamiento de imágenes con Sharp 0.35.5. La auditoría deja ocho avisos moderados, cero altos y cero críticos; la migración mayor de los SDK que los resuelve queda pendiente.

El service worker publicado pide `firebase-messaging-logic.js`, ausente del inventario de Hosting. No se inventó ese archivo. La variante local desactiva el registro automático del service worker. Push/FCM, OAuth de Google, cámara/GPS, integraciones Drive y tareas programadas no están validadas de extremo a extremo. Tampoco se han exportado datos de Firestore, usuarios, objetos privados ni secretos.

![Dashboard local con datos sintéticos](docs/images/dashboard-desktop.jpg)
