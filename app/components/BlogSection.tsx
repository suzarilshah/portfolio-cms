'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, BookOpen, Calendar, Tag, Loader2, ExternalLink, Rss } from 'lucide-react';

interface BlogPost {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  categories: string[];
  thumbnail?: string;
}

interface BlogSectionProps {
  content?: {
    title?: string;
    subtitle?: string;
    showCategories?: boolean;
    maxPosts?: number;
  };
}

export default function BlogSection({ content }: BlogSectionProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blogUrl, setBlogUrl] = useState('https://blog.suzarilshah.uk');

  const title = content?.title || 'Latest from the Blog';
  const subtitle = content?.subtitle || 'Thoughts on cloud architecture, DevOps, and engineering leadership.';
  const maxPosts = content?.maxPosts || 3;
  const showCategories = content?.showCategories !== false;

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/blog');
        const data = await response.json();

        if (data.posts && data.posts.length > 0) {
          setPosts(data.posts.slice(0, maxPosts));
        }
        if (data.blogUrl) {
          setBlogUrl(data.blogUrl);
        }
        if (data.error) {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to load blog posts');
        console.error('Error fetching blog posts:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [maxPosts]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <section id="blog" className="py-24 relative">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="w-12 h-[2px] bg-primary-500" />
              <span className="text-primary-600 font-medium text-sm uppercase tracking-wider">Blog</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              {title}
            </h2>
            <p className="text-base md:text-lg text-slate-600 max-w-xl leading-relaxed">
              {subtitle}
            </p>
          </motion.div>

          <motion.a
            href={blogUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group flex items-center gap-3 px-6 py-3 rounded-full border-2 border-slate-200 text-slate-700 font-medium hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 transition-all duration-300"
          >
            <Rss className="w-4 h-4" />
            Visit Blog
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.a>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p>Loading latest posts...</p>
          </div>
        )}

        {/* Error or No Posts State */}
        {!loading && (posts.length === 0 || error) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Check out my blog
            </h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              I write about cloud architecture, DevOps practices, and lessons learned from building scalable systems.
            </p>
            <a
              href={blogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-primary-600 transition-colors"
            >
              Visit blog.suzarilshah.uk
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        )}

        {/* Blog Posts Grid */}
        {!loading && posts.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <motion.a
                key={post.link}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-primary-300 hover:shadow-xl hover:shadow-primary-100/50 transition-all duration-300"
              >
                {/* Thumbnail */}
                {post.thumbnail && (
                  <div className="aspect-video overflow-hidden bg-slate-100">
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Date */}
                  {post.pubDate && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.pubDate)}
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="font-display text-lg font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
                    {post.description}
                  </p>

                  {/* Categories */}
                  {showCategories && post.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.categories.slice(0, 3).map((category) => (
                        <span
                          key={category}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full"
                        >
                          <Tag className="w-3 h-3" />
                          {category}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Read More */}
                  <div className="flex items-center gap-2 text-sm font-medium text-primary-600 group-hover:gap-3 transition-all">
                    Read Article
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>

                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </motion.a>
            ))}
          </div>
        )}

        {/* View All Link */}
        {!loading && posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <a
              href={blogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-primary-600 font-medium transition-colors"
            >
              View all posts on blog.suzarilshah.uk
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
