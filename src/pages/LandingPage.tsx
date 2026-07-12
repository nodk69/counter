import { useEffect } from 'react';
import { Link } from 'wouter';
import { Check, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LANDING_PAGES } from '@/data/seoData';
import { TOOLS } from '@/data/tools';

export default function LandingPage({ slug }: { slug: string }) {
  const data = LANDING_PAGES[slug];

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

  const { title, hero, audience, painPoints, benefits, useCases } = data;
  const relatedTools = TOOLS.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <div className="py-16 bg-primary/5 border-b border-primary/10">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <div className="text-xs font-sans text-muted-foreground mb-4">
              <Link href="/" className="hover:text-primary">Home</Link> › {title}
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">{hero}</h1>
            <p className="text-muted-foreground font-sans text-lg max-w-2xl mx-auto mb-8">
              The free word counter built for {audience}. Real-time statistics, writing goals, and 20+ tools — all private, all free.
            </p>
            <Link href="/word-counter"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-primary text-white font-medium text-base hover:bg-primary/90 transition-colors font-sans shadow-sm">
              Start Counting Free <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="mt-3 text-xs text-muted-foreground font-sans">No account required · No data stored · 100% free</p>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-4xl py-16 space-y-16">
          {/* Pain points */}
          <section>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-6">Sound Familiar?</h2>
            <div className="space-y-3">
              {painPoints.map(p => (
                <div key={p} className="flex gap-3 p-4 rounded-xl border border-border bg-card">
                  <span className="text-muted-foreground font-sans text-2xl leading-none flex-shrink-0">😔</span>
                  <p className="text-foreground font-sans">{p}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
              <p className="text-primary font-sans text-sm font-medium">
                ✅ counter solves all of this — for free, instantly, without signing up.
              </p>
            </div>
          </section>

          {/* Benefits */}
          <section>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-6">Everything You Need as a {title.split(' for ')[1] ? title.split(' for ')[1].charAt(0).toUpperCase() + title.split(' for ')[1].slice(1) : audience}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map(b => (
                <div key={b} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground font-sans">{b}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Use cases */}
          <section>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-6">Built for Your Work</h2>
            <div className="flex flex-wrap gap-2">
              {useCases.map(u => (
                <span key={u} className="px-4 py-2 rounded-full border border-border bg-card text-sm font-sans text-foreground">
                  {u}
                </span>
              ))}
            </div>
          </section>

          {/* Related tools */}
          <section>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-6">Tools You'll Love</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedTools.map(tool => (
                <Link key={tool.slug} href={`/${tool.slug}`}>
                  <div className="group flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer">
                    <span className="text-2xl">{tool.icon}</span>
                    <div>
                      <div className="font-serif font-semibold text-foreground group-hover:text-primary transition-colors">{tool.name}</div>
                      <div className="text-xs text-muted-foreground font-sans">{tool.shortDesc}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-10 px-8 rounded-2xl bg-foreground text-background text-center">
            <h2 className="font-serif text-3xl font-bold mb-3">Ready to Start?</h2>
            <p className="text-background/70 font-sans mb-6">
              Join 50,000+ {audience} using counter every day. No sign-up, no ads, no limits.
            </p>
            <Link href="/word-counter"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-primary text-white font-medium text-base hover:bg-primary/90 transition-colors font-sans">
              Try Word Counter Free <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
