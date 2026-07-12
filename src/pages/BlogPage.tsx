import { useState, useCallback } from 'react';
import { Link } from 'wouter';
import { Clock, User, ArrowRight, Copy, Check } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MetaTags from '@/components/MetaTags';
import RssLink from '@/components/RssLink';
import SchemaMarkup from '@/components/SchemaMarkup';
import { BLOG_POSTS, BLOG_CATEGORIES, getBlogsByCategory } from '@/data/blog';

const FEED_URL = 'https://counter.io/feed.xml';

const RSS_ICON = (
  <svg className="w-3.5 h-3.5 fill-current flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/>
  </svg>
);

function RssSubscribeRow({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(FEED_URL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  const px   = size === 'md' ? 'px-4 py-2 text-sm' : 'px-3 py-1.5 text-xs';
  const base = 'flex items-center gap-1.5 font-sans font-medium rounded-lg border transition-colors';
  const rss  = `${base} ${px} border-orange-300 text-orange-600 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-950/40`;
  const cp   = `${base} ${px} border-border text-muted-foreground hover:bg-muted`;

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <a href="/feed.xml" target="_blank" rel="noopener noreferrer" className={rss} aria-label="Open RSS feed">
        {RSS_ICON}
        Subscribe via RSS
      </a>
      <button onClick={copy} className={cp} aria-label="Copy feed URL" title="Copy feed URL">
        {copied
          ? <><Check className="w-3.5 h-3.5 text-green-500" /><span className="text-green-600 dark:text-green-400">Copied!</span></>
          : <><Copy className="w-3.5 h-3.5" /><span>Copy URL</span></>
        }
      </button>
    </div>
  );
}

function PostCard({ post }: { post: typeof BLOG_POSTS[0] }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <div className="group border border-border rounded-xl bg-card overflow-hidden hover:shadow-md hover:border-primary/30 transition-all cursor-pointer h-full flex flex-col">
        {/* Placeholder image */}
        <div className="aspect-[16/9] bg-gradient-to-br from-primary/10 via-muted to-muted/50 flex items-center justify-center">
          <span className="text-4xl opacity-30 select-none">
            {post.category === 'SEO' ? '🔍' : post.category === 'Writing' ? '✍️' : post.category === 'Social Media' ? '📱' : post.category === 'Tools' ? '🛠️' : '📝'}
          </span>
        </div>
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              {post.category}
            </span>
            <span className="text-xs text-muted-foreground font-sans">{post.date}</span>
          </div>
          <h2 className="font-serif text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2 flex-1">
            {post.title}
          </h2>
          <p className="text-sm text-muted-foreground font-sans mb-4 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-3 text-xs text-muted-foreground font-sans">
              <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author.split(' ')[0]}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime} min</span>
            </div>
            <span className="text-xs text-primary font-medium font-sans opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              Read <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function BlogPage() {
  const [category, setCategory] = useState('All');
  const featured = BLOG_POSTS.find(p => p.featured);
  const posts = getBlogsByCategory(category).filter(p => !p.featured || category !== 'All');

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MetaTags
        title="Writing Blog — Tips, Guides & Insights"
        description="Expert writing tips, SEO content guides, and readability insights from the counter.io team. Improve your writing craft with free, actionable advice."
      />
      <SchemaMarkup type="blog" />
      <RssLink title="counter.io — Writing Blog" href="/feed.xml" />
      <Header />
      <main className="flex-1">
        {/* Page hero */}
        <div className="bg-muted/30 border-b border-border py-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-xs font-sans text-muted-foreground mb-2">
              <Link href="/" className="hover:text-primary">Home</Link> › Blog
            </div>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
                  Writing Tips, SEO Guides & Content Strategy
                </h1>
                <p className="text-muted-foreground font-sans">Expert insights for better content creation</p>
              </div>
              <RssSubscribeRow size="sm" />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-6xl py-10">
          {/* Featured post */}
          {featured && category === 'All' && (
            <Link href={`/blog/${featured.slug}`}>
              <div className="group mb-10 border border-border rounded-2xl bg-card overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer">
                <div className="md:grid md:grid-cols-2">
                  <div className="aspect-[16/9] md:aspect-auto bg-gradient-to-br from-primary/15 via-muted to-muted/60 flex items-center justify-center min-h-[200px]">
                    <span className="text-6xl opacity-20 select-none">🔍</span>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs font-sans px-2.5 py-1 rounded-full bg-primary text-white font-medium">
                        🔥 Featured
                      </span>
                      <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                        {featured.category}
                      </span>
                      <span className="text-xs text-muted-foreground font-sans">{featured.readTime} min read</span>
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-muted-foreground font-sans text-sm mb-5 leading-relaxed">
                      {featured.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground font-sans">
                        By {featured.author} · {featured.date}
                      </div>
                      <span className="text-sm text-primary font-medium font-sans flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read More <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {BLOG_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium font-sans transition-colors ${
                  category === cat
                    ? 'bg-primary text-white'
                    : 'border border-border bg-card text-foreground hover:border-primary/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Posts grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map(post => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-16 text-muted-foreground font-sans">
              No posts in this category yet.
            </div>
          )}

          {/* RSS footer CTA */}
          <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm font-sans text-muted-foreground">
              New articles every week — never miss a post.
            </p>
            <RssSubscribeRow size="md" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
