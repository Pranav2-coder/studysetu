/**
 * SEOHead — injects all page-level SEO tags into <head> via React 19 document metadata.
 * Usage: place anywhere in the component tree; React will hoist tags to <head>.
 *
 * Props:
 *  title       — page title (do NOT append "| StudySetu"; this component handles it)
 *  description — meta description (50–160 chars)
 *  url         — path, e.g. "/browse" or "/institutes/slug"
 *  type        — OG type, default "website"
 *  image       — absolute OG image URL
 *  robots      — robots meta content, default "index, follow"
 *  schema      — JSON-LD object OR array of objects
 */
export default function SEOHead({
  title,
  description,
  url,
  type = 'website',
  image = 'https://studysetu.com/studysetu-logo.png',
  robots = 'index, follow',
  schema = null,
}) {
  // Never double-append the brand suffix
  const fullTitle =
    !title || title === 'StudySetu'
      ? 'StudySetu'
      : title.includes('StudySetu')
      ? title
      : `${title} | StudySetu`;

  const canonicalUrl = url
    ? `https://studysetu.com${url.startsWith('/') ? url : `/${url}`}`
    : 'https://studysetu.com';

  // Normalise schema: always an array, filter nulls
  const schemaItems = Array.isArray(schema)
    ? schema.filter(Boolean)
    : schema
    ? [schema]
    : [];

  return (
    <>
      {/* Core */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />

      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="StudySetu" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@studysetu" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Structured Data — one <script> per schema object */}
      {schemaItems.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
