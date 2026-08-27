/**
 * seo.js — JSON-LD structured data generators for StudySetu.
 * All functions return plain objects; SEOHead handles JSON.stringify.
 */

const BASE_URL = 'https://studysetu.com';
const LOGO_URL = `${BASE_URL}/studysetu-logo.png`;

// ─── Website + Search ──────────────────────────────────────────────────────
export const generateWebSiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'StudySetu',
  url: BASE_URL,
  description:
    'Find, compare, and connect with tuition classes and computer training institutes in Nagpur.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/browse?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
});

// ─── Organization ──────────────────────────────────────────────────────────
export const generateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'StudySetu',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    url: LOGO_URL,
    width: 230,
    height: 56,
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-93717-42672',
    contactType: 'customer service',
    areaServed: 'IN',
    availableLanguage: ['English', 'Hindi', 'Marathi'],
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Nagpur',
    addressRegion: 'MH',
    addressCountry: 'IN',
  },
  sameAs: [
    'https://twitter.com/studysetu',
    'https://facebook.com/studysetu',
  ],
});

// ─── LocalBusiness / EducationalOrganization ───────────────────────────────
export const generateLocalBusinessSchema = (institute) => ({
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'EducationalOrganization'],
  name: institute.name,
  image: institute.cover_image || LOGO_URL,
  url: `${BASE_URL}/institutes/${institute.slug}`,
  telephone: institute.phone ? `+${institute.phone}` : undefined,
  priceRange: institute.fees || 'Contact for fees',
  hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    (institute.name || '') + ' ' + (institute.address || 'Nagpur')
  )}`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: institute.address || '',
    addressLocality: institute.area || 'Nagpur',
    addressRegion: 'MH',
    postalCode: '440001',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 21.1458,
    longitude: 79.0882,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '08:00',
    closes: '20:00',
  },
});

// ─── AggregateRating ────────────────────────────────────────────────────────
export const generateAggregateRatingSchema = (reviews = []) => {
  if (!reviews || reviews.length === 0) return null;
  const total = reviews.reduce((sum, r) => sum + (r.rating || 5), 0);
  const avg = (total / reviews.length).toFixed(1);
  return {
    '@type': 'AggregateRating',
    ratingValue: avg,
    reviewCount: reviews.length,
    bestRating: 5,
    worstRating: 1,
  };
};

// ─── Review items ───────────────────────────────────────────────────────────
export const generateReviewSchema = (reviews = [], instituteName = '') => {
  if (!reviews || reviews.length === 0) return null;
  return reviews.slice(0, 5).map((r) => ({
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: r.parent || r.parentName || 'Anonymous',
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: r.rating || 5,
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: r.text || '',
    itemReviewed: {
      '@type': 'EducationalOrganization',
      name: instituteName,
    },
  }));
};

// ─── FAQPage ────────────────────────────────────────────────────────────────
export const generateFAQSchema = (faqs) => {
  if (!faqs || faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
};

// ─── BreadcrumbList ─────────────────────────────────────────────────────────
export const generateBreadcrumbSchema = (crumbs) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: crumb.url,
  })),
});

// ─── ContactPage ────────────────────────────────────────────────────────────
export const generateContactPageSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact StudySetu',
  url: `${BASE_URL}/contact`,
  description:
    'Contact StudySetu to list your institute or ask questions about tuition and computer classes in Nagpur.',
  mainEntity: {
    '@type': 'Organization',
    name: 'StudySetu',
    url: BASE_URL,
    email: 'contact@studysetu.in',
    telephone: '+91-93717-42672',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Nagpur',
      addressRegion: 'MH',
      addressCountry: 'IN',
    },
  },
});
