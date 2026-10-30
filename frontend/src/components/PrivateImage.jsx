// Native image shape with visibility-gated authenticated transport and cleanup.
import { r as React } from '../vendor/vendor-react-BwINE3B3.js';
import { resolveProtectedImage, releaseProtectedImage } from '../services/private-image-client.js';
export function PrivateImage({ src, loading = 'lazy', eager = false, fetchPriority, style, ref: forwardedRef, ...props }) {
  const element = React.useRef(null);
  const [visibleSource, setVisibleSource] = React.useState(null);
  const [resolved, setResolved] = React.useState(null);
  const shouldLoad = eager || loading === 'eager' || fetchPriority === 'high' || visibleSource === src;

  React.useEffect(() => {
    if (eager || loading === 'eager' || fetchPriority === 'high') return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisibleSource(src);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setVisibleSource(src);
        observer.disconnect();
      }
    }, { rootMargin: '100px', threshold: 0.01 });
    if (element.current) observer.observe(element.current);
    return () => observer.disconnect();
  }, [src, loading, eager, fetchPriority]);

  React.useEffect(() => {
    if (!shouldLoad || !src) return;
    const controller = new AbortController();
    let owned;
    setResolved(null);
    resolveProtectedImage(src, { signal: controller.signal }).then((url) => {
      if (controller.signal.aborted) releaseProtectedImage(url);
      else { owned = url; setResolved({ source: src, url }); }
    }).catch(() => { if (!controller.signal.aborted) setResolved(null); });
    return () => { controller.abort(); releaseProtectedImage(owned); };
  }, [src, shouldLoad]);

  const url = shouldLoad && resolved?.source === src ? resolved.url : undefined;
  // A native <img> without intrinsic dimensions can otherwise have no area for
  // IntersectionObserver. Reserve only a 1px minimum until a URL is available;
  // caller dimensions/styles still take precedence, including display:none.
  const pendingStyle = url ? style : { minWidth: 1, minHeight: 1, ...style };
  return <img
    {...props}
    ref={(node) => {
      element.current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    }}
    style={pendingStyle}
    loading={eager ? 'eager' : loading}
    fetchPriority={fetchPriority}
    src={url || undefined}
  />;
}
