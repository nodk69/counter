import { Link } from 'wouter';
import { BLOG_POSTS } from '@/data/blog';

export default function BlogSection() {
  const articles = BLOG_POSTS.slice(0, 3);

  return (
    <section className="py-20" id="blog">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-baseline mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground">From the blog</h2>
          <Link href="/blog" className="text-primary hover:text-primary/80 font-medium text-sm transition-colors">
            View all →
          </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link key={article.slug} href={`/blog/${article.slug}`} className="block group">
              <div className="h-full bg-card border border-border p-6 rounded-lg transition-colors hover:border-primary/40 flex flex-col">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 font-mono uppercase tracking-wider">
                  <span>{article.readTime} min read</span>
                  <span>·</span>
                  <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="text-sm font-medium text-foreground pt-4 border-t border-border/50 mt-auto">
                  By {article.author}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
