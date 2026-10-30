import { createPrivateImageLoader, protectedImageProxy, clearLegacyImageCache } from './private-images.js';
void clearLegacyImageCache();
let loader;
export const resolveProtectedImage = async (source, options) => {
  if (!protectedImageProxy(source)) return source;
  if (!loader) {
    const { firebaseAuth } = await import('../firebase/client.js');
    loader ||= createPrivateImageLoader({ auth: firebaseAuth });
  }
  return loader.load(source, options);
};
export const releaseProtectedImage = (source) => loader?.release(source);
export { protectedImageProxy };
