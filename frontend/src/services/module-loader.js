/** esbuild owns the current chunk graph. Published Vite preload lists refer to
 * old code and must never fetch a second copy of the application. */
export const loadModule = (importer) => importer();
