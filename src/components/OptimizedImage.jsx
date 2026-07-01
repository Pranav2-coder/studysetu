export default function OptimizedImage({ src, alt, title, className, priority = false, ...props }) {
  return (
    <img
      src={src}
      alt={alt || "StudySetu Educational Image"}
      title={title || alt || "StudySetu Image"}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      {...props}
    />
  );
}
