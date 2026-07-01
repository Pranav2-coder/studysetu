export const generateWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "StudySetu",
  "url": "https://studysetu.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://studysetu.com/browse?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
});

export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "StudySetu",
  "url": "https://studysetu.com",
  "logo": "https://studysetu.com/studysetu-logo.png",
  "sameAs": [
    "https://twitter.com/studysetu",
    "https://facebook.com/studysetu"
  ]
});

export const generateLocalBusinessSchema = (institute) => {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "EducationalOrganization"],
    "name": institute.name,
    "image": institute.cover_image || "https://studysetu.com/studysetu-logo.png",
    "url": `https://studysetu.com/institutes/${institute.slug}`,
    "telephone": institute.phone || "",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": institute.address || "",
      "addressLocality": institute.area || "Nagpur",
      "addressRegion": "MH",
      "postalCode": "440001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 21.1458,
      "longitude": 79.0882
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "08:00",
      "closes": "20:00"
    }
  };
};

export const generateFAQSchema = (faqs) => {
  if (!faqs || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

export const generateBreadcrumbSchema = (crumbs) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": crumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": crumb.url
  }))
});
