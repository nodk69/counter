import { Link } from 'wouter';
import { FileText } from 'lucide-react';

const CONVERSIONS = [
  { words: 100, pages: 0.2, slug: '100-words-is-how-many-pages' },
  { words: 500, pages: 1, slug: '500-words-is-how-many-pages' },
  { words: 1000, pages: 2, slug: '1000-words-is-how-many-pages' },
  { words: 1500, pages: 3, slug: '1500-words-is-how-many-pages' },
  { words: 2000, pages: 4, slug: '2000-words-is-how-many-pages' },
  { words: 3000, pages: 6, slug: '3000-words-is-how-many-pages' },
  { words: 5000, pages: 10, slug: '5000-words-is-how-many-pages' },
  { words: 10000, pages: 20, slug: '10000-words-is-how-many-pages' },
];

export default function WordCountConversions() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground">Quick Word Count Conversions</h2>
            <p className="text-sm text-muted-foreground font-sans">Based on standard double-spaced formatting (250 words/page)</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CONVERSIONS.map((c) => (
            <Link key={c.slug} href={`/${c.slug}`}>
              <div className="group p-4 rounded-lg border border-border bg-card hover:border-primary/40 hover:bg-muted/30 transition-all cursor-pointer text-center">
                <div className="font-mono text-xl font-bold text-primary mb-0.5">
                  {c.words.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground font-sans mb-1">words</div>
                <div className="text-xs text-foreground/60 font-sans">≈</div>
                <div className="font-mono text-base font-semibold text-foreground mt-0.5">
                  {c.pages === 0.2 ? '⅕' : c.pages === 0.5 ? '½' : c.pages} page{c.pages !== 1 ? 's' : ''}
                </div>
                <div className="mt-2 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity font-sans">
                  View details →
                </div>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-4 text-xs text-muted-foreground font-sans text-center">
          Times New Roman 12pt, double-spaced, 1-inch margins · <Link href="/1000-words-is-how-many-pages" className="text-primary hover:underline">View all conversions →</Link>
        </p>
      </div>
    </section>
  );
}
