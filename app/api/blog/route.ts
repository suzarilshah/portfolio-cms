import { NextResponse } from 'next/server';

interface BlogPost {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  categories: string[];
  thumbnail?: string;
  readTime?: number;
}

interface ApiBlogPost {
  id: string;
  title: string;
  slug: string;
  url: string;
  summary: string;
  ogImage?: string;
  featuredImage?: string;
  publishedAt: string;
  updatedAt: string;
  readTime?: number;
  tags?: { name: string; slug: string }[];
  author?: {
    name: string;
    title: string;
    avatar: string;
  };
}

interface BlogApiResponse {
  success: boolean;
  data: ApiBlogPost[];
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
    nextOffset: number;
  };
  meta?: {
    fetchedAt: string;
    source: string;
  };
}

// Cache for blog posts (5 minute TTL)
let cachedPosts: BlogPost[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchBlogPosts(): Promise<BlogPost[]> {
  const apiUrl = 'https://blog.suzarilshah.uk/api/public/blog?limit=20';

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'SuzarilShah-Portfolio/1.0',
      },
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok) {
      console.error(`Blog API returned ${response.status}`);
      return [];
    }

    const data: BlogApiResponse = await response.json();

    if (!data.success || !data.data || !Array.isArray(data.data)) {
      console.error('Blog API returned invalid data structure');
      return [];
    }

    // Transform API response to our BlogPost format
    const posts: BlogPost[] = data.data.map((post) => ({
      title: post.title,
      link: post.url, // Use the full URL from API
      pubDate: post.publishedAt,
      description: post.summary || '',
      categories: post.tags?.map(tag => tag.name) || [],
      thumbnail: post.featuredImage || post.ogImage,
      readTime: post.readTime,
    }));

    return posts;
  } catch (error) {
    console.error('Failed to fetch from Blog API:', error);
    return [];
  }
}

export async function GET() {
  try {
    // Check cache
    const now = Date.now();
    if (cachedPosts && cachedPosts.length > 0 && (now - cacheTimestamp) < CACHE_TTL) {
      return NextResponse.json({
        posts: cachedPosts,
        cached: true,
        blogUrl: 'https://blog.suzarilshah.uk',
      });
    }

    const posts = await fetchBlogPosts();

    // Sort posts by date (most recent first)
    posts.sort((a, b) => {
      const dateA = a.pubDate ? new Date(a.pubDate).getTime() : 0;
      const dateB = b.pubDate ? new Date(b.pubDate).getTime() : 0;
      return dateB - dateA; // Descending order (newest first)
    });

    // Update cache only if we got posts
    if (posts.length > 0) {
      cachedPosts = posts;
      cacheTimestamp = now;
    }

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
