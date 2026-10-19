> Se recuperaron las fuentes en esta sesión mediante la CLI local y Artifact Registry. Esta guía conserva el procedimiento anterior de Cloud Shell. Estado actual: [RECOVERY-STATUS.md](RECOVERY-STATUS.md).

# Recuperar mcimachala-servidor desde Google Cloud Shell

Este script usa la sesión de `gcloud` de **tu Google Cloud Shell**. No necesita
que compartas contraseñas, tokens ni archivos de credenciales. Lee el proyecto;
no despliega, no cambia permisos y no descarga datos de Firestore ni usuarios.

1. Abre [Google Cloud Shell del proyecto](https://console.cloud.google.com/home/dashboard?project=mcimachala-servidor&cloudshell=true).
2. En el menú de Cloud Shell, **Subir archivo**, sube `recover_project.py`.
3. Ejecuta una vez:

   ```bash
   python3 recover_project.py --project mcimachala-servidor --download-hosting
   ```

   Si Cloud Shell solicita autorizar su propia sesión de Google, autorízala.
   El script captura el token en memoria; nunca debes copiarlo al chat.
4. El resultado muestra la ruta de un archivo `mcimachala-servidor-recovery-….zip`.
   Descárgalo mediante **Descargar archivo** de Cloud Shell usando esa ruta.
   Es una **copia privada**: antes de adjuntarla o llevarla a GitHub, revisa
   `report.json` y las advertencias de archivos sensibles. Puedes quitar los
   archivos sensibles de los ZIP de fuentes y volver a comprimirlos; conserva
   las demás fuentes y los nombres de las variables para reconstruir el proyecto.

`report.json` enumera qué función se recuperó, qué falló y qué archivos de Hosting
se descargaron. Un código de salida `2` indica errores o recuperación incompleta;
los archivos recuperados correctamente se conservan. Un fallo de permisos se
registra como `HTTP 403`, sin incluir respuestas que pudieran contener secretos.
No concedas permisos adicionales antes de revisar la operación concreta que falló.

Opciones útiles:

```bash
python3 recover_project.py --dry-run
python3 recover_project.py --inventory-only
python3 recover_project.py --regions us-central1,southamerica-east1
```

`--dry-run` no autentica, no hace peticiones y no escribe archivos.
`--inventory-only` sí autentica y guarda metadatos, pero no descarga código.
El listado normalmente usa todas las regiones; `--regions` indica regiones para
el fallback si el servicio no admite el listado global. No cambia la configuración
del proyecto ni selecciona un proyecto global de `gcloud`.

Qué se puede recuperar:

- **Functions Gen1 y Gen2**: ZIP de las fuentes realmente desplegadas, runtime,
  entry point y algunos parámetros de servicio/eventos. No se exportan valores
  de variables de entorno. Un ZIP desplegado puede contener `.env` o claves;
  el script advierte de patrones comunes, pero su inspección tiene límites y no
  certifica que el contenido esté libre de secretos.
- **Hosting**: versiones, versión `live`, lista completa paginada de rutas/hash,
  configuración de rutas sin valores de cabeceras ni parámetros de URL. Con
  `--download-hosting`, descarga los archivos estáticos de la versión publicada,
  incluidos `.map` si se desplegaron. Es código compilado, no necesariamente las
  fuentes originales; los source maps con `sourcesContent` pueden recuperarlas.
- Las versiones históricas de Hosting se inventarían. La API pública no ofrece
  descargar su contenido por hash; publicarlas o clonarlas modificaría el
  proyecto, y este script no hace eso. La web puede cambiar durante la descarga.

El archivo final no se publica ni se sube automáticamente a ningún repositorio.
El token de la sesión y las URL firmadas de descarga nunca se guardan ni se
muestran; los errores HTTP se reducen a su código. Los archivos nuevos usan
permisos privados. Las fuentes permanecen dentro de ZIP separados y no se
extraen automáticamente.

Documentación oficial consultada:

- [Functions v1: generateDownloadUrl](https://cloud.google.com/functions/docs/reference/rest/v1/projects.locations.functions/generateDownloadUrl)
- [Functions v2: generateDownloadUrl](https://cloud.google.com/functions/docs/reference/rest/v2/projects.locations.functions/generateDownloadUrl)
- [Hosting: versions.files.list](https://firebase.google.com/docs/reference/hosting/rest/v1beta1/sites.versions.files/list)
- [Hosting: versions.get](https://firebase.google.com/docs/reference/hosting/rest/v1beta1/sites.versions/get)
- [Hosting: channels.releases.list](https://firebase.google.com/docs/reference/hosting/rest/v1beta1/sites.channels.releases/list)

Pruebas locales sin credenciales:

```bash
python3 -m unittest discover -s . -p 'test_recover_project.py' -v
```
