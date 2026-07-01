export default function SEO({ title, description, url, type = 'website', image = 'https://studysetu.com/studysetu-logo.png', schema = null }) {
  const fullTitle = title === 'StudySetu' ? title : `${title} | StudySetu`;
  const canonicalUrl = url ? `https://studysetu.com${url}` : 'https://studysetu.com';

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="StudySetu" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      <link rel="canonical" href={canonicalUrl} />
      
      {schema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      )}
    </>
  );
}
