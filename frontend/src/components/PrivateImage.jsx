// Native image shape with authenticated blob transport and deterministic cleanup.
import { r as React } from '../vendor/vendor-react-BwINE3B3.js';
import { resolveProtectedImage, releaseProtectedImage, protectedImageProxy } from '../services/private-image-client.js';
export function PrivateImage({ src, ...props }) {
  const [resolved, setResolved] = React.useState(() => protectedImageProxy(src) ? '' : src);
  React.useEffect(() => {
    const controller = new AbortController();
    let owned;
    setResolved(protectedImageProxy(src) ? '' : src);
    resolveProtectedImage(src, { signal: controller.signal }).then((url) => {
      if (controller.signal.aborted) releaseProtectedImage(url);
      else { owned = url; setResolved(url); }
    }).catch(() => { if (!controller.signal.aborted) setResolved(''); });
    return () => { controller.abort(); releaseProtectedImage(owned); };
  }, [src]);
  return <img {...props} src={resolved || undefined} />;
}
