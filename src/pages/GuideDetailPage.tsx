import { useEffect } from 'react';
import { Link } from 'wouter';
import { Clock, CheckCircle, ArrowLeft, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MetaTags from '@/components/MetaTags';
import { getGuideBySlug, GUIDES } from '@/data/guides';

const DIFFICULTY_COLORS: Record<string, string> = {
  'Beginner': 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
  'Intermediate': 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  'Advanced': 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
  'Quick Reference': 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
};

export default function GuideDetailPage({ slug }: { slug: string }) {
  const guide = getGuideBySlug(slug);
  const relatedGuides = GUIDES.filter(g => g.slug !== slug).slice(0, 3);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!guide) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold mb-2">Guide Not Found</h1>
            <Link href="/guides" className="text-primary hover:underline font-sans text-sm">← Back to guides</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MetaTags
        title={guide.title}
        description={guide.excerpt}
      />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 max-w-3xl py-10">
          {/* Breadcrumb */}
          <div className="text-xs font-sans text-muted-foreground mb-6 flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>›</span>
            <Link href="/guides" className="hover:text-primary">Guides</Link>
            <span>›</span>
            <span className="text-foreground">{guide.title}</span>
          </div>

          {/* Meta badges */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className={`text-xs font-sans px-2.5 py-0.5 rounded-full font-medium ${DIFFICULTY_COLORS[guide.difficulty]}`}>
              {guide.difficulty}
            </span>
            <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">{guide.category}</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground font-sans">
              <Clock className="w-3.5 h-3.5" />{guide.readTime} min read
            </span>
            <span className="text-xs text-muted-foreground font-sans">{guide.steps.length} steps</span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-4xl font-bold text-foreground leading-tight mb-3">{guide.title}</h1>
          <p className="text-muted-foreground font-sans mb-8 text-base leading-relaxed">{guide.excerpt}</p>

          {/* Steps */}
          <div className="space-y-6 mb-12">
            {guide.steps.map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-mono text-sm font-bold">
                    {i + 1}
                  </div>
                  {i < guide.steps.length - 1 && (
                    <div className="w-0.5 flex-1 bg-border mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <h2 className="font-serif text-xl font-semibold text-foreground mb-2">{step.title}</h2>
                  <p className="text-muted-foreground font-sans leading-relaxed">{step.content}</p>
                </div>
              </div>
            ))}

            {/* Completion indicator */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div className="flex-1 py-1">
                <p className="font-sans text-sm text-green-700 dark:text-green-400 font-medium">
                  You've completed the guide! Ready to put it into practice?
                </p>
                <Link href="/word-counter" className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-sans mt-1">
                  Open Word Counter <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Back */}
          <Link href="/guides" className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-sans mb-12">
            <ArrowLeft className="w-4 h-4" />
            Back to Guides
          </Link>

          {/* Related guides */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">More Guides</h2>
            <div className="space-y-2">
              {relatedGuides.map(g => (
                <Link key={g.slug} href={`/guides/${g.slug}`}>
                  <div className="group flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer">
                    <div className="flex-1 min-w-0">
                      <div className="font-serif font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">{g.title}</div>
                      <div className="text-xs text-muted-foreground font-sans">{g.difficulty} · {g.readTime} min</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
