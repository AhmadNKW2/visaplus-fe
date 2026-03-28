import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.visaplusjo.com';

  // These are the static core routes
  const routes = ['', '/faqs', '/about-us'];

  // Multiply by the languages supported
  const sitemapEntries = routes.flatMap((route) => [
    {
      url: `${baseUrl}/en${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    },
    {
      url: `${baseUrl}/ar${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    },
  ]);

  return sitemapEntries;
}
