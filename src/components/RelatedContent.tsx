/**
 * RelatedContent — internal linking engine.
 *
 * Automatically surfaces related tools, articles, and guides based on
 * the current page's category, tags, or explicit related slug list.
 * Drop this into any ToolPage, BlogPostPage, or GuideDetailPage for
 * free SEO-boosting internal links.
 *
 * Usage:
 *   <RelatedContent
 *     currentSlug="word-counter"
 *     type="tool"
 *     category="counting"
 *     relatedSlugs={tool.relatedTools}
 *   />
 */
import { Link } from 'wouter';
import { ArrowRight, Wrench, FileText, BookOpen } from 'lucide-react';
import { TOOLS } from '@/data/tools';
import { BLOG_POSTS } from '@/data/blog';
import { GUIDES } from '@/data/guides';
import type { ToolCategory } from '@/data/tools';

interface RelatedContentProps {
  currentSlug:  string;
  type:         'tool' | 'blog' | 'guide';
  /** Category string used to find related items */
  category?:    string;
  /** Tags used to match related blog posts */
  tags?:        string[];
  /** Explicit related tool slugs (overrides category-based matching for tools) */
  relatedSlugs?: string[];
  maxTools?:    number;
  maxArticles?: number;
  maxGuides?:   number;
}

export default function RelatedContent({
  currentSlug,
  type: _type,
  category,
  tags         = [],
  relatedSlugs = [],
  maxTools     = 4,
  maxArticles  = 3,
  maxGuides    = 2,
}: RelatedContentProps) {

  // ── Related tools ──────────────────────────────────────────────────────────
  const relatedTools = relatedSlugs.length > 0
    ? TOOLS.filter(t => relatedSlugs.includes(t.slug)).slice(0, maxTools)
    : TOOLS
        .filter(t => t.slug !== currentSlug && t.category === (category as ToolCategory))
        .slice(0, maxTools);

  // ── Related articles ───────────────────────────────────────────────────────
  const relatedArticles = BLOG_POSTS
    .filter(p => {
      if (p.slug === currentSlug) return false;
      if (tags.length > 0 && p.tags.some(tag => tags.includes(tag))) return true;
      if (category && p.category.toLowerCase() === category.toLowerCase()) return true;
      return false;
    })
    .slice(0, maxArticles);

  // ── Related guides ─────────────────────────────────────────────────────────
  const matchedGuides = GUIDES
    .filter(g => {
      if (g.slug === currentSlug) return false;
      if (category && g.category.toLowerCase().includes(category.toLowerCase())) return true;
      return false;
    })
    .slice(0, maxGuides);

  // Fall back to first N guides when no category match
  const relatedGuides = matchedGuides.length > 0
    ? matchedGuides
    : GUIDES.filter(g => g.slug !== currentSlug).slice(0, maxGuides);

  if (relatedTools.length === 0 && relatedArticles.length === 0 && relatedGuides.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="related-content-heading" className="py-10 border-t border-border">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2
          id="related-content-heading"
          className="text-xl font-bold text-foreground font-sans mb-6"
        >
          You Might Also Like
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Related Tools */}
          {relatedTools.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5 font-sans">
                <Wrench className="w-3.5 h-3.5" aria-hidden /> Related Tools
              </h3>
              <ul className="space-y-2" aria-label="Related tools">
                {relatedTools.map(t => (
                  <li key={t.slug}>
                    <Link
                      href={`/${t.slug}`}
                      className="flex items-center gap-2.5 p-2.5 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/30 transition-colors group"
                    >
                      <span className="text-xl flex-shrink-0" aria-hidden>{t.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-foreground font-sans group-hover:text-primary transition-colors">
                          {t.name}
                        </div>
                        <div className="text-xs text-muted-foreground font-sans truncate">
                          {t.shortDesc}
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5 font-sans">
                <FileText className="w-3.5 h-3.5" aria-hidden /> Related Articles
              </h3>
              <ul className="space-y-2" aria-label="Related articles">
                {relatedArticles.map(p => (
                  <li key={p.slug}>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="block p-2.5 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/30 transition-colors group"
                    >
                      <div className="text-sm font-medium text-foreground font-sans line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                        {p.title}
                      </div>
                      <div className="text-xs text-muted-foreground font-sans mt-1">
                        {p.readTime} min read · {p.category}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Guides */}
          {relatedGuides.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5 font-sans">
                <BookOpen className="w-3.5 h-3.5" aria-hidden /> Related Guides
              </h3>
              <ul className="space-y-2" aria-label="Related guides">
                {relatedGuides.map(g => (
                  <li key={g.slug}>
                    <Link
                      href={`/guides/${g.slug}`}
                      className="block p-2.5 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/30 transition-colors group"
                    >
                      <div className="text-sm font-medium text-foreground font-sans line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                        {g.title}
                      </div>
                      <div className="text-xs text-muted-foreground font-sans mt-1">
                        {g.readTime} min read · {g.category}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
