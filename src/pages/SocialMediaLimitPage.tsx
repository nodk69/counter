import { useEffect } from 'react';
import { Link } from 'wouter';
import { Check } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MetaTags from '@/components/MetaTags';
import SchemaMarkup from '@/components/SchemaMarkup';
import { SOCIAL_MEDIA_LIMITS } from '@/data/seoData';

export default function SocialMediaLimitPage({ slug }: { slug: string }) {
  const data = SOCIAL_MEDIA_LIMITS.find(l => l.slug === slug);

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

  const { platform, limit, tips, examples } = data;
  const pageTitle = `${platform} Character Limit (2026) — Complete Guide`;
  const pageDesc = `The ${platform} character limit is ${limit.toLocaleString()} characters. See limit breakdowns for all content types, optimization tips, and check your text in real time.`;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MetaTags
        title={pageTitle}
        description={pageDesc}
      />
      <SchemaMarkup
        type="page"
        data={{
          name: `${platform} Character Limit`,
          description: pageDesc,
          slug,
        }}
      />
      <Header />
      <main className="flex-1">
        <div className="bg-muted/30 border-b border-border py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-xs font-sans text-muted-foreground mb-3 flex items-center gap-1.5">
              <Link href="/" className="hover:text-primary">Home</Link>
              <span>›</span>
              <span>{platform} Character Limit</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-3">
              {platform} Character Limit: Complete Guide
            </h1>
            <p className="text-muted-foreground font-sans text-lg">
              Everything you need to know about {platform}'s character limits, with real examples and optimization tips.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-4xl py-12">
          {/* Main limit card */}
          <div className="mb-12 p-8 rounded-2xl border-2 border-primary/30 bg-primary/5">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="text-center flex-shrink-0">
                <div className="font-mono text-6xl font-bold text-primary">{limit.toLocaleString()}</div>
                <div className="text-muted-foreground font-sans text-sm mt-1">characters</div>
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-2">{platform} Character Limit</h2>
                {'optimalLimit' in data && data.optimalLimit && (
                  <p className="text-muted-foreground font-sans text-sm mb-2">
                    ✅ Optimal length: <strong className="text-foreground">{(data as any).optimalLimit.toLocaleString()} characters</strong>
                  </p>
                )}
                {'foldLimit' in data && (data as any).foldLimit && (
                  <p className="text-muted-foreground font-sans text-sm mb-2">
                    👁 Visible without clicking "More": <strong className="text-foreground">{(data as any).foldLimit.toLocaleString()} characters</strong>
                  </p>
                )}
                {'extendedLimit' in data && (data as any).extendedLimit && (
                  <p className="text-muted-foreground font-sans text-sm">
                    ⭐ Premium: <strong className="text-foreground">{((data as any).extendedLimit as number).toLocaleString()} characters</strong> — {(data as any).extendedNote}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Examples / limit breakdown */}
          {examples && examples.length > 0 && (
            <div className="mb-12">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Limit Breakdown</h2>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm font-sans">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Content Type</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Character Limit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {examples.map((ex: any) => (
                      <tr key={ex.label} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-4 text-foreground">{ex.label}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-foreground">
                          {ex.limit === null ? 'No limit' : ex.limit.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
              Tips for {platform} Content
            </h2>
            <div className="space-y-3">
              {tips.map((tip: string) => (
                <div key={tip} className="flex gap-3 p-4 rounded-xl border border-border bg-card">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/80 font-sans">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mb-12 p-6 rounded-xl bg-muted/30 border border-border text-center">
            <h3 className="font-serif text-xl font-bold text-foreground mb-2">Check Your Character Count Now</h3>
            <p className="text-muted-foreground font-sans text-sm mb-4">
              Paste your {platform} content into our free character counter to check it against the {limit.toLocaleString()}-character limit in real time.
            </p>
            <Link href="/character-counter"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors font-sans">
              Open Character Counter →
            </Link>
          </div>

          {/* Related pages */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Other Platform Limits</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SOCIAL_MEDIA_LIMITS.filter(l => l.slug !== slug).map(l => (
                <Link key={l.slug} href={`/${l.slug}`}>
                  <div className="p-3 rounded-lg border border-border bg-card hover:border-primary/40 text-center cursor-pointer transition-all hover:bg-muted/30">
                    <div className="font-sans font-semibold text-foreground text-sm">{l.platform}</div>
                    <div className="text-xs text-muted-foreground font-sans font-mono">{l.limit.toLocaleString()} chars</div>
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
