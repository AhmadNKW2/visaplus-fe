import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/private/'], // Important to keep the /admin out from Google Search indexing
    },
    sitemap: 'https://www.visaplusjo.com/sitemap.xml',
  };
}
