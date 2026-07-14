import { useEffect } from 'react';
import { Link } from 'wouter';
import { Check, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MetaTags from '@/components/MetaTags';
import SchemaMarkup from '@/components/SchemaMarkup';
import { COMPARISON_PAGES } from '@/data/seoData';

export default function ComparisonPage({ slug }: { slug: string }) {
  const data = COMPARISON_PAGES[slug];

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold mb-2">Page Not Found</h1>
            <Link href="/" className="text-primary hover:underline text-sm font-sans">← Home</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { title, intro, tool1, tool2, verdict } = data;
  const pageTitle = title;
  const pageDesc = intro.length > 155 ? `${intro.slice(0, 152)}...` : intro;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MetaTags
        title={pageTitle}
        description={pageDesc}
      />
      <SchemaMarkup
        type="page"
        data={{
          name: title,
          description: pageDesc,
          slug,
        }}
      />
      <Header />
      <main className="flex-1">
        <div className="bg-muted/30 border-b border-border py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-xs font-sans text-muted-foreground mb-3">
              <Link href="/" className="hover:text-primary">Home</Link> › Comparisons
            </div>
            <h1 className="font-serif text-4xl font-bold text-foreground mb-3">{title}</h1>
            <p className="text-muted-foreground font-sans text-lg max-w-2xl">{intro}</p>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-4xl py-12">
          {/* Comparison grid */}
          <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[tool1, tool2].map((tool, i) => (
              <div key={tool.slug} className={`p-6 rounded-2xl border-2 ${i === 0 ? 'border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-900' : 'border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-900'}`}>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-3">{tool.name}</h2>
                <p className="text-muted-foreground font-sans text-sm mb-5 leading-relaxed">{tool.description}</p>
                <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Best for</h3>
                <ul className="space-y-2">
                  {tool.bestFor.map(use => (
                    <li key={use} className="flex items-start gap-2 text-sm font-sans text-foreground/80">
                      <Check className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${i === 0 ? 'text-blue-600' : 'text-green-600'}`} />
                      {use}
                    </li>
                  ))}
                </ul>
                <Link href={`/${tool.slug}`}
                  className={`mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium font-sans transition-colors ${i === 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                  Try {tool.name} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>

          {/* Verdict */}
          <div className="mb-12 p-6 rounded-xl border border-border bg-card">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-3">The Verdict</h2>
            <p className="text-foreground/80 font-sans leading-relaxed">{verdict}</p>
          </div>

          {/* Both in one */}
          <div className="p-6 rounded-xl bg-primary/5 border border-primary/20 text-center">
            <h3 className="font-serif text-xl font-bold text-foreground mb-2">Why Choose? Get Both in One Tool</h3>
            <p className="text-muted-foreground font-sans text-sm mb-4">
              counter shows word count, character count, and all other stats simultaneously. No switching between tools required.
            </p>
            <Link href="/word-counter"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors font-sans">
              Try counter Free →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
