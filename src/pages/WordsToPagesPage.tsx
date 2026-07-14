import { useEffect } from 'react';
import { Link } from 'wouter';
import { FileText, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MetaTags from '@/components/MetaTags';
import SchemaMarkup from '@/components/SchemaMarkup';
import { WORDS_TO_PAGES } from '@/data/seoData';

const WORDS_MAP: Record<string, { words: number; pages: number; pagesSingle: number; readTime: number; speechTime: number }> = {
  '100-words-is-how-many-pages': { words: 100, pages: 0.2, pagesSingle: 0.1, readTime: 1, speechTime: 1 },
  '250-words-is-how-many-pages': { words: 250, pages: 0.5, pagesSingle: 0.5, readTime: 1, speechTime: 2 },
  '500-words-is-how-many-pages': { words: 500, pages: 1, pagesSingle: 1, readTime: 2, speechTime: 4 },
  '750-words-is-how-many-pages': { words: 750, pages: 1.5, pagesSingle: 1.5, readTime: 3, speechTime: 6 },
  '1000-words-is-how-many-pages': { words: 1000, pages: 2, pagesSingle: 2, readTime: 4, speechTime: 8 },
  '1500-words-is-how-many-pages': { words: 1500, pages: 3, pagesSingle: 3, readTime: 6, speechTime: 12 },
  '2000-words-is-how-many-pages': { words: 2000, pages: 4, pagesSingle: 4, readTime: 8, speechTime: 15 },
  '2500-words-is-how-many-pages': { words: 2500, pages: 5, pagesSingle: 5, readTime: 11, speechTime: 19 },
  '3000-words-is-how-many-pages': { words: 3000, pages: 6, pagesSingle: 6, readTime: 13, speechTime: 23 },
  '4000-words-is-how-many-pages': { words: 4000, pages: 8, pagesSingle: 8, readTime: 17, speechTime: 31 },
  '5000-words-is-how-many-pages': { words: 5000, pages: 10, pagesSingle: 10, readTime: 21, speechTime: 38 },
  '7500-words-is-how-many-pages': { words: 7500, pages: 15, pagesSingle: 15, readTime: 32, speechTime: 58 },
  '10000-words-is-how-many-pages': { words: 10000, pages: 20, pagesSingle: 20, readTime: 42, speechTime: 77 },
};

function formatPages(p: number) {
  if (p === 0.2) return '⅕ page';
  if (p === 0.1) return '~⅒ page';
  if (p === 0.5) return '½ page';
  if (p === 1.5) return '1½ pages';
  return `${p} page${p !== 1 ? 's' : ''}`;
}

export default function WordsToPagesPage({ slug }: { slug: string }) {
  const data = WORDS_MAP[slug];

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

  const { words, pages, pagesSingle, readTime, speechTime } = data;
  const pageTitle = `${words.toLocaleString()} Words Is How Many Pages? — Page Count Calculator`;
  const pageDesc = `How many pages is ${words.toLocaleString()} words? Approximately ${formatPages(pages)} double-spaced. See formatting breakdowns, reading time, and speaking time.`;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MetaTags
        title={pageTitle}
        description={pageDesc}
      />
      <SchemaMarkup
        type="page"
        data={{
          name: `${words.toLocaleString()} Words Is How Many Pages?`,
          description: pageDesc,
          slug,
        }}
      />
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <div className="bg-muted/30 border-b border-border py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-xs font-sans text-muted-foreground mb-3 flex items-center gap-1.5">
              <Link href="/" className="hover:text-primary">Home</Link>
              <span>›</span>
              <span>{words.toLocaleString()} Words Is How Many Pages?</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">
              {words.toLocaleString()} Words Is How Many Pages?
            </h1>
            <p className="text-muted-foreground font-sans text-lg max-w-2xl">
              Instantly convert word count to pages for essays, reports, and books. See reading time, speaking time, and formatting variations.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-4xl py-12">
          {/* Answer card */}
          <div className="mb-12 p-8 rounded-2xl border-2 border-primary/30 bg-primary/5 text-center">
            <div className="font-mono text-6xl font-bold text-primary mb-2">{words.toLocaleString()}</div>
            <div className="text-muted-foreground font-sans mb-6">words equals approximately</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="font-mono text-3xl font-bold text-foreground mb-1">{formatPages(pages)}</div>
                <div className="text-xs text-muted-foreground font-sans">double-spaced</div>
                <div className="text-xs text-muted-foreground font-sans">(~250 words/page)</div>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="font-mono text-3xl font-bold text-foreground mb-1">{formatPages(pagesSingle)}</div>
                <div className="text-xs text-muted-foreground font-sans">single-spaced</div>
                <div className="text-xs text-muted-foreground font-sans">(~500 words/page)</div>
              </div>
            </div>
          </div>

          {/* Additional stats */}
          <div className="mb-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Reading Time', value: `~${readTime} min`, note: 'at 238 WPM' },
              { label: 'Speaking Time', value: `~${speechTime} min`, note: 'at 130 WPM' },
              { label: 'Characters', value: `~${(words * 5.1).toFixed(0)}`, note: 'estimated' },
              { label: 'Paragraphs', value: `~${Math.round(words / 75)}`, note: 'at 75 words/para' },
            ].map(s => (
              <div key={s.label} className="p-4 rounded-xl border border-border bg-card text-center">
                <div className="font-mono text-xl font-bold text-foreground mb-0.5">{s.value}</div>
                <div className="text-xs font-medium text-muted-foreground font-sans">{s.label}</div>
                <div className="text-xs text-muted-foreground/60 font-sans">{s.note}</div>
              </div>
            ))}
          </div>

          {/* Context and formatting table */}
          <div className="mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Formatting Breakdown</h2>
            <p className="text-muted-foreground font-sans mb-6">
              The number of pages depends heavily on formatting choices. Here's how {words.toLocaleString()} words looks across common formats:
            </p>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm font-sans">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Format</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Words/Page</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Pages</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { format: 'Academic (Double-spaced, 12pt TNR)', wpp: 250, pages: words / 250 },
                    { format: 'Academic (Single-spaced, 12pt TNR)', wpp: 500, pages: words / 500 },
                    { format: 'Academic (11pt Calibri, double-spaced)', wpp: 270, pages: words / 270 },
                    { format: 'Business Report (11pt Arial, 1.5 spaced)', wpp: 350, pages: words / 350 },
                    { format: 'Novel (standard manuscript format)', wpp: 250, pages: words / 250 },
                    { format: 'Ebook (flowing text, no fixed pages)', wpp: 300, pages: words / 300 },
                  ].map(row => (
                    <tr key={row.format} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 text-foreground/80">{row.format}</td>
                      <td className="py-3 px-4 text-right text-muted-foreground">{row.wpp}</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-foreground">
                        {row.pages < 1 ? `< 1` : row.pages.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Content type context */}
          <div className="mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">What Can You Write in {words.toLocaleString()} Words?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                words >= 100 && { type: 'Social Media Post', desc: `A detailed LinkedIn post or Twitter thread at ${words.toLocaleString()} words would be substantial content.` },
                words >= 200 && { type: 'Email Newsletter', desc: `${words.toLocaleString()} words is ${words < 400 ? 'a short' : words < 800 ? 'a standard' : 'a long'} newsletter section.` },
                words >= 300 && { type: 'Blog Post Section', desc: `A solid introduction or supporting section for a longer article.` },
                words >= 800 && { type: 'Blog Post', desc: `${words >= 1500 ? 'A well-optimized' : 'A basic'} blog post. ${words >= 1500 ? 'Good for SEO.' : 'Consider expanding for better rankings.'}` },
                words >= 2500 && { type: 'Long-Form Article', desc: 'Suitable for in-depth guides, tutorials, and pillar content.' },
                { type: 'Essay', desc: `${words.toLocaleString()} words is ${words <= 500 ? 'a short essay' : words <= 1500 ? 'a standard essay' : 'a long-form essay or research paper'}.` },
                words >= 5000 && { type: 'Short Story', desc: 'Long enough to tell a complete short story with character development.' },
                words >= 40000 && { type: 'Novel', desc: 'Getting into novel territory — typically 70,000-100,000 words for a full novel.' },
              ].filter(Boolean).map((item: any) => (
                <div key={item.type} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                  <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-sans font-semibold text-sm text-foreground">{item.type}</div>
                    <div className="text-xs text-muted-foreground font-sans">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mb-12 p-6 rounded-xl bg-muted/30 border border-border text-center">
            <h3 className="font-serif text-xl font-bold text-foreground mb-2">Check Your Own Word Count</h3>
            <p className="text-muted-foreground font-sans text-sm mb-4">
              Paste your text into our free word counter to see exactly how many pages it fills.
            </p>
            <Link href="/word-counter"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors font-sans">
              Open Word Counter →
            </Link>
          </div>

          {/* Related conversions */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Other Word Count Conversions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {WORDS_TO_PAGES.filter(c => c.words !== words).slice(0, 8).map(c => (
                <Link key={c.words} href={`/${c.words}-words-is-how-many-pages`}>
                  <div className="p-3 rounded-lg border border-border bg-card hover:border-primary/40 text-center cursor-pointer transition-colors hover:bg-muted/30">
                    <div className="font-mono font-bold text-foreground text-sm">{c.words.toLocaleString()} words</div>
                    <div className="text-xs text-muted-foreground font-sans">≈ {c.pages === 0.2 ? '⅕' : c.pages} page{c.pages !== 1 ? 's' : ''}</div>
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
