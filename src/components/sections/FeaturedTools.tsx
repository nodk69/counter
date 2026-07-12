import { Link } from 'wouter';
import { TrendingUp } from 'lucide-react';
import { TOOLS } from '@/data/tools';

const FEATURED_SLUGS = [
  'word-counter',
  'readability-checker',
  'keyword-density-checker',
  'character-counter',
  'syllable-counter',
  'reading-time-calculator',
];

const USAGE_COUNTS: Record<string, string> = {
  'word-counter': '50K+',
  'readability-checker': '15K+',
  'keyword-density-checker': '12K+',
  'character-counter': '8K+',
  'syllable-counter': '5K+',
  'reading-time-calculator': '4K+',
};

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`w-3 h-3 ${i <= count ? 'text-amber-400 fill-amber-400' : 'text-border fill-border'}`} viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function FeaturedTools() {
  const featured = FEATURED_SLUGS.map(slug => TOOLS.find(t => t.slug === slug)).filter(Boolean);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-3xl font-bold text-foreground">Most Popular Tools</h2>
            <p className="text-sm text-muted-foreground font-sans">Used by writers and SEO pros every day</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((tool, index) => (
            <Link key={tool!.slug} href={`/${tool!.slug}`}>
              <div className="group p-5 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all duration-200 cursor-pointer h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-2xl">{tool!.icon}</div>
                  {index === 0 && (
                    <span className="text-xs font-sans px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      #1 Tool
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {tool!.name}
                </h3>
                <p className="text-sm text-muted-foreground font-sans mb-3 leading-snug">
                  {tool!.shortDesc}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <StarRating count={index < 2 ? 5 : 4} />
                  </div>
                  <span className="text-xs font-sans text-muted-foreground">
                    {USAGE_COUNTS[tool!.slug]} uses
                  </span>
                </div>
                <div className="mt-3 text-xs font-medium text-primary font-sans opacity-0 group-hover:opacity-100 transition-opacity">
                  Launch tool →
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-card text-foreground font-medium text-sm hover:border-primary/40 hover:bg-muted/40 transition-colors font-sans"
          >
            View all 20+ tools →
          </Link>
        </div>
      </div>
    </section>
  );
}
