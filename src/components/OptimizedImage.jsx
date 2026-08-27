/**
 * OptimizedImage — renders an <img> with sensible SEO/performance defaults.
 * - `priority` maps to `loading="eager"` (use for LCP hero images)
 * - `fetchpriority` should be set to "high" for the first image above the fold
 * - `decoding="async"` is always set
 */
export default function OptimizedImage({
  src,
  alt,
  title,
  className,
  priority = false,
  fetchpriority,
  width,
  height,
  ...props
}) {
  return (
    <img
      src={src}
      alt={alt || 'StudySetu Educational Image'}
      title={title || alt || 'StudySetu Image'}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchpriority={fetchpriority ?? (priority ? 'high' : undefined)}
      width={width}
      height={height}
      {...props}
    />
  );
}
