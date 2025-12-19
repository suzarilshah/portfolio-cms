import { MetadataRoute } from 'next'
import { secureDb } from '@/lib/security/database'

async function getAllUrls(): Promise<{ url: string; lastmod?: string; changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'; priority?: number }[]> {
  const baseUrl = 'https://www.suzarilshah.uk'
  const currentDate = new Date().toISOString().split('T')[0]

  const urls = [
    {
      url: baseUrl,
      lastmod: currentDate,
      changefreq: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}#about`,
      lastmod: currentDate,
      changefreq: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}#experience`,
      lastmod: currentDate,
      changefreq: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}#education`,
      lastmod: currentDate,
      changefreq: 'yearly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}#awards`,
      lastmod: currentDate,
      changefreq: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}#publications`,
      lastmod: currentDate,
      changefreq: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}#community`,
      lastmod: currentDate,
      changefreq: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}#contact`,
      lastmod: currentDate,
      changefreq: 'monthly' as const,
      priority: 0.6,
    },
  ]

  // Add dynamic project URLs from database
  try {
    const projects = await secureDb.query('SELECT id, title, updated_at FROM projects ORDER BY created_at DESC LIMIT 10');
    for (const project of projects) {
      urls.push({
        url: `${baseUrl}#project-${project.id}`,
        lastmod: project.updated_at ? new Date(project.updated_at).toISOString().split('T')[0] : currentDate,
        changefreq: 'monthly' as const,
        priority: 0.7,
      });
    }
  } catch (error) {
    console.log('Could not fetch projects for sitemap');
  }

  return urls
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls = await getAllUrls()
  return urls.map(item => ({
    url: item.url,
    lastModified: item.lastmod ? new Date(item.lastmod) : new Date(),
    changeFrequency: item.changefreq,
    priority: item.priority,
  }))
}
