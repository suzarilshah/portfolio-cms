import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

interface BlogPost {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  categories: string[];
  thumbnail?: string;
}

// Cache for blog posts (5 minute TTL)
let cachedPosts: BlogPost[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchBlogPosts(): Promise<BlogPost[]> {
  const blogUrl = 'https://blog.suzarilshah.uk';

  // Try multiple RSS feed URLs
  const rssUrls = [
    `${blogUrl}/feed`,
    `${blogUrl}/feed.xml`,
    `${blogUrl}/rss`,
    `${blogUrl}/rss.xml`,
    `${blogUrl}/index.xml`,
    `${blogUrl}/atom.xml`,
  ];

  for (const rssUrl of rssUrls) {
    try {
      const response = await fetch(rssUrl, {
        headers: {
          'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml',
          'User-Agent': 'SuzarilShah-Portfolio/1.0',
        },
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      });

      if (!response.ok) continue;

      const xml = await response.text();
      const $ = cheerio.load(xml, { xml: true });

      const posts: BlogPost[] = [];

      // Parse RSS 2.0 format
      $('item').each((_, element) => {
        const $item = $(element);
        const title = $item.find('title').text().trim();
        const link = $item.find('link').text().trim() || $item.find('guid').text().trim();
        const pubDate = $item.find('pubDate').text().trim();
        const description = $item.find('description').text().trim()
          .replace(/<[^>]*>/g, '') // Strip HTML
          .substring(0, 200) + '...';

        const categories: string[] = [];
        $item.find('category').each((_, cat) => {
          categories.push($(cat).text().trim());
        });

        // Try to extract thumbnail from content or media
        let thumbnail = $item.find('media\\:content, media\\:thumbnail').attr('url') ||
          $item.find('enclosure[type^="image"]').attr('url');

        if (!thumbnail) {
          // Try to extract from content
          const content = $item.find('content\\:encoded').text();
          const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/);
          if (imgMatch) thumbnail = imgMatch[1];
        }

        if (title && link) {
          posts.push({
            title,
            link,
            pubDate,
            description,
            categories,
            thumbnail,
          });
        }
      });

      // If no items found in RSS 2.0, try Atom format
      if (posts.length === 0) {
        $('entry').each((_, element) => {
          const $item = $(element);
          const title = $item.find('title').text().trim();
          const link = $item.find('link').attr('href') || '';
          const pubDate = $item.find('published').text().trim() || $item.find('updated').text().trim();
          const description = ($item.find('summary').text().trim() || $item.find('content').text().trim())
            .replace(/<[^>]*>/g, '')
            .substring(0, 200) + '...';

          const categories: string[] = [];
          $item.find('category').each((_, cat) => {
            categories.push($(cat).attr('term') || $(cat).text().trim());
          });

          if (title && link) {
            posts.push({
              title,
              link,
              pubDate,
              description,
              categories,
            });
          }
        });
      }

      if (posts.length > 0) {
        return posts;
      }
    } catch (error) {
      console.log(`Failed to fetch from ${rssUrl}:`, error);
      continue;
    }
  }

  // Fallback: Try to scrape the blog homepage for posts
  try {
    const response = await fetch(blogUrl, {
      headers: {
        'User-Agent': 'SuzarilShah-Portfolio/1.0',
      },
    });

    if (response.ok) {
      const html = await response.text();
      const $ = cheerio.load(html);
      const posts: BlogPost[] = [];

      // Try common blog post selectors
      const articleSelectors = [
        'article',
        '.post',
        '.blog-post',
        '.entry',
        '[class*="post"]',
        '[class*="article"]',
      ];

      for (const selector of articleSelectors) {
        $(selector).slice(0, 6).each((_, element) => {
          const $article = $(element);
          const $titleLink = $article.find('h1 a, h2 a, h3 a, .title a, .post-title a').first();
          const title = $titleLink.text().trim() || $article.find('h1, h2, h3').first().text().trim();
          const link = $titleLink.attr('href') || $article.find('a').first().attr('href') || '';
          const fullLink = link.startsWith('http') ? link : `${blogUrl}${link.startsWith('/') ? '' : '/'}${link}`;

          const description = $article.find('p, .excerpt, .summary, .description').first().text().trim().substring(0, 200);
          const thumbnail = $article.find('img').first().attr('src');
          const dateText = $article.find('time, .date, .published, [class*="date"]').first().text().trim() ||
            $article.find('[datetime]').attr('datetime') || '';

          if (title && link) {
            posts.push({
              title,
              link: fullLink,
              pubDate: dateText,
              description: description ? description + '...' : 'Read more on the blog...',
              categories: [],
              thumbnail,
            });
          }
        });

        if (posts.length > 0) break;
      }

      if (posts.length > 0) {
        return posts.slice(0, 6);
      }
    }
  } catch (error) {
    console.error('Failed to scrape blog:', error);
  }

  return [];
}

export async function GET() {
  try {
    // Check cache
    const now = Date.now();
    if (cachedPosts && (now - cacheTimestamp) < CACHE_TTL) {
      return NextResponse.json({
        posts: cachedPosts,
        cached: true,
        blogUrl: 'https://blog.suzarilshah.uk',
      });
    }

    const posts = await fetchBlogPosts();

    // Update cache
    cachedPosts = posts;
    cacheTimestamp = now;

    return NextResponse.json({
      posts,
      cached: false,
      blogUrl: 'https://blog.suzarilshah.uk',
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({
      posts: [],
      error: 'Failed to fetch blog posts',
      blogUrl: 'https://blog.suzarilshah.uk',
    });
  }
}
