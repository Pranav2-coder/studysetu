import { useEffect } from 'react';

function setMetaTag(property, content, isOg = false) {
  const attr = isOg ? 'property' : 'name';
  let tag = document.querySelector(`meta[${attr}="${property}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, property);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

export default function SEOHead({ title, description, url }) {
  useEffect(() => {
    if (title) {
      document.title = title;
      setMetaTag('og:title', title, true);
    }

    if (description) {
      setMetaTag('description', description);
      setMetaTag('og:description', description, true);
    }

    if (url) {
      setMetaTag('og:url', url, true);
    }
  }, [title, description, url]);

  return null;
}
