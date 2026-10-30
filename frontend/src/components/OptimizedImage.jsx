// Maintained component reconstructed from the published application's image contract.
import { r as React } from "../vendor/vendor-react-BwINE3B3.js";
import { releaseProtectedImage } from "../services/private-image-client.js";
import { resolveCachedImageUrl } from "../utils/images.js";

/**
 * Protected images are fetched only near the viewport, through the authenticated
 * no-store transport. A thumbnail does not implicitly download its original.
 * Detail/zoom views may opt in with loadFullImage; a lone fullSrc remains usable.
 */
const OptimizedImage = ({
  src,
  fullSrc,
  loadFullImage = false,
  alt,
  className = "",
  placeholderClassName = "",
  fallbackIcon,
  loading = "lazy",
  eager = false,
  fetchPriority,
  imgClassName = "object-cover",
  onImageLoad,
}) => {
  const container = React.useRef(null);
  const source = (loadFullImage && fullSrc) || src || fullSrc || "";
  const visibilityKey = JSON.stringify([src, fullSrc]);
  const requestKey = JSON.stringify([source, src, fullSrc, loadFullImage]);
  const [visibleKey, setVisibleKey] = React.useState("");
  const [image, setImage] = React.useState(null);
  const shouldLoad = eager || loading === "eager" || visibleKey === visibilityKey;

  React.useEffect(() => {
    if (eager || loading === "eager") return;
    if (typeof IntersectionObserver === "undefined") {
      setVisibleKey(visibilityKey);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setVisibleKey(visibilityKey);
        observer.disconnect();
      }
    }, { rootMargin: "100px", threshold: 0.01 });
    if (container.current) observer.observe(container.current);
    return () => observer.disconnect();
  }, [visibilityKey, eager, loading]);

  React.useEffect(() => {
    if (!shouldLoad) return;
    const controller = new AbortController();
    let ownedImage;
    setImage({ key: requestKey, url: "", loaded: false, failed: !source });
    if (source) {
      (async () => {
        try {
          ownedImage = await resolveCachedImageUrl(source, { signal: controller.signal });
          if (controller.signal.aborted) {
            releaseProtectedImage(ownedImage);
            return;
          }
          setImage({ key: requestKey, url: ownedImage, loaded: false, failed: !ownedImage });
        } catch {
          if (!controller.signal.aborted) {
            setImage({ key: requestKey, url: "", loaded: false, failed: true });
          }
        }
      })();
    }
    return () => {
      controller.abort();
      releaseProtectedImage(ownedImage);
    };
  }, [requestKey, source, shouldLoad]);

  const current = image?.key === requestKey ? image : null;
  const failed = current?.failed;
  const loaded = current?.loaded;
  return (
    <div
      ref={container}
      className={`relative overflow-hidden ${className}`}
      aria-busy={shouldLoad && !loaded && !failed}
      data-image-state={!shouldLoad ? "deferred" : failed ? "error" : loaded ? "ready" : "loading"}
    >
      {!loaded && !failed && (
        <div aria-hidden="true" className={`absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 animate-pulse ${placeholderClassName}`} />
      )}
      {failed && fallbackIcon && (
        <div role="img" aria-label={alt} className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-slate-700">
          {fallbackIcon}
        </div>
      )}
      {shouldLoad && current?.url && !failed && (
        <img
          src={current.url}
          alt={alt}
          className={`absolute inset-0 w-full h-full ${imgClassName} transition-opacity duration-300 card-image ${loaded ? "opacity-100" : "opacity-0"}`}
          loading={eager ? "eager" : loading}
          decoding="async"
          {...(fetchPriority ? { fetchPriority } : {})}
          onLoad={(event) => {
            setImage((previous) => previous?.key === requestKey ? { ...previous, loaded: true } : previous);
            const { naturalWidth: width, naturalHeight: height } = event.currentTarget;
            if (width && height) onImageLoad?.({ width, height });
          }}
          onError={() => setImage((previous) => previous?.key === requestKey ? { ...previous, failed: true } : previous)}
        />
      )}
    </div>
  );
};
export { OptimizedImage };
