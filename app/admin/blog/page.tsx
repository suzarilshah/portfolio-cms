'use client';

import { useState, useEffect } from 'react';
import SectionEditor from '../components/SectionEditor';
import { ExternalLink, RefreshCw, Loader2, BookOpen, Calendar, Tag, CheckCircle2 } from 'lucide-react';

interface BlogPost {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  categories: string[];
  thumbnail?: string;
}

interface BlogContent {
  title: string;
  subtitle: string;
  showCategories: boolean;
  maxPosts: number;
  blogUrl: string;
}

const defaultBlog: BlogContent = {
  title: "Latest from the Blog",
  subtitle: "Thoughts on cloud architecture, DevOps, and engineering leadership.",
  showCategories: true,
  maxPosts: 3,
  blogUrl: "https://blog.suzarilshah.uk",
};

function BlogPreview() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/blog');
      const data = await response.json();
      if (data.posts) {
        setPosts(data.posts);
        setLastFetched(new Date());
      }
      if (data.error) {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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
    <div className="mt-8 bg-slate-50 rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen size={20} className="text-blue-600" />
            Blog Feed Preview
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Posts from blog.suzarilshah.uk
            {lastFetched && (
              <span className="ml-2 text-xs text-slate-400">
                Last updated: {lastFetched.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={fetchPosts}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <RefreshCw size={16} />
          )}
          Refresh
        </button>
      </div>

      {loading && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p>Fetching latest posts...</p>
        </div>
      )}

      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <p className="text-amber-800 text-sm">
            <strong>Note:</strong> {error}. The blog section will display a link to your blog instead.
          </p>
        </div>
      )}

      {!loading && posts.length === 0 && !error && (
        <div className="text-center py-8 text-slate-500">
          <p>No posts found. Make sure your blog has published content.</p>
          <a
            href="https://blog.suzarilshah.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:underline"
          >
            Visit blog.suzarilshah.uk
            <ExternalLink size={14} />
          </a>
        </div>
      )}

      {posts.length > 0 && (
        <div className="space-y-4">
          {posts.slice(0, 6).map((post, index) => (
            <a
              key={post.link}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-4 bg-white rounded-lg border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all group"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                  {post.title}
                </h4>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                  {post.pubDate && (
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(post.pubDate)}
                    </span>
                  )}
                  {post.categories.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Tag size={12} />
                      {post.categories.slice(0, 2).join(', ')}
                    </span>
                  )}
                </div>
              </div>
              <ExternalLink size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
            </a>
          ))}
        </div>
      )}

      {posts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle2 size={16} />
            <span>{posts.length} posts detected</span>
          </div>
          <a
            href="https://blog.suzarilshah.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            Open Blog
            <ExternalLink size={14} />
          </a>
        </div>
      )}
    </div>
  );
}

export default function BlogPage() {
  return (
    <SectionEditor<BlogContent>
      sectionKey="blog"
      title="Blog Section"
      description="Configure how your blog posts appear on the portfolio. Posts are automatically fetched from blog.suzarilshah.uk"
      defaultContent={defaultBlog}
      renderForm={(content, onChange) => (
        <div className="space-y-8">
          {/* Section Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">Section Title</label>
              <input
                type="text"
                value={content.title}
                onChange={(e) => onChange({ ...content, title: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                placeholder="Latest from the Blog"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">Subtitle</label>
              <input
                type="text"
                value={content.subtitle}
                onChange={(e) => onChange({ ...content, subtitle: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                placeholder="Thoughts on cloud architecture..."
              />
            </div>
          </div>

          {/* Display Options */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Display Options</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <label className="text-sm font-semibold text-slate-900">Show Categories</label>
                  <p className="text-xs text-slate-500 mt-0.5">Display category tags on blog post cards</p>
                </div>
                <button
                  onClick={() => onChange({ ...content, showCategories: !content.showCategories })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    content.showCategories ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      content.showCategories ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <label className="text-sm font-semibold text-slate-900 block mb-2">
                  Maximum Posts to Display
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={content.maxPosts}
                    onChange={(e) => onChange({ ...content, maxPosts: parseInt(e.target.value) })}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <span className="w-8 text-center font-bold text-slate-900">{content.maxPosts}</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Shows up to {content.maxPosts} post{content.maxPosts > 1 ? 's' : ''} on the homepage
                </p>
              </div>
            </div>
          </div>

          {/* Blog URL Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <ExternalLink className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Your Blog</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Posts are automatically fetched from your blog at:
                </p>
                <a
                  href="https://blog.suzarilshah.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-white border border-blue-200 rounded-lg text-blue-600 font-medium hover:bg-blue-50 transition-colors"
                >
                  blog.suzarilshah.uk
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <BlogPreview />
        </div>
      )}
    />
  );
}
