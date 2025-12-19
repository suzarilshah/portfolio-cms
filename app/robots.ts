import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/_next/', '/debug/', '/handler/'],
    },
    sitemap: 'https://www.suzarilshah.uk/sitemap.xml',
    host: 'https://www.suzarilshah.uk',
  };
}
