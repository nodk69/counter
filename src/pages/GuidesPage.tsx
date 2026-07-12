import { Link } from 'wouter';
import { BookOpen, Clock, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MetaTags from '@/components/MetaTags';
import { GUIDES, GUIDE_CATEGORIES } from '@/data/guides';
import { useState } from 'react';

const DIFFICULTY_COLORS: Record<string, string> = {
  'Beginner': 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
  'Intermediate': 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  'Advanced': 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
  'Quick Reference': 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
};

export default function GuidesPage() {
  const [category, setCategory] = useState('All');
  const featured = GUIDES.find(g => g.featured);
  const guides = GUIDES.filter(g => {
    if (category === 'All') return true;
    return g.category === category;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MetaTags
        title="Writing Guides — Step-by-Step Tutorials"
        description="In-depth writing guides covering SEO, readability, content strategy, and tool tutorials. Beginner to advanced — all free."
      />
      <Header />
      <main className="flex-1">
        <div className="bg-muted/30 border-b border-border py-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-xs font-sans text-muted-foreground mb-2">
              <Link href="/" className="hover:text-primary">Home</Link> › Guides
            </div>
            <h1 className="font-serif text-4xl font-bold text-foreground mb-2">Comprehensive Writing Guides</h1>
            <p className="text-muted-foreground font-sans">Step-by-step tutorials for better content creation</p>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-6xl py-10">
          {/* Featured guide */}
          {featured && category === 'All' && (
            <Link href={`/guides/${featured.slug}`}>
              <div className="group mb-10 p-6 border-2 border-primary/30 bg-primary/5 rounded-2xl hover:border-primary/50 transition-all cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary flex-shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-primary text-white font-medium">⭐ Featured Guide</span>
                      <span className={`text-xs font-sans px-2.5 py-0.5 rounded-full font-medium ${DIFFICULTY_COLORS[featured.difficulty]}`}>
                        {featured.difficulty}
                      </span>
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-muted-foreground font-sans text-sm mb-3">{featured.excerpt}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-sans">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{featured.readTime} min read</span>
                      <span>{featured.steps.length} steps</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </Link>
          )}

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {GUIDE_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium font-sans transition-colors ${
                  category === cat ? 'bg-primary text-white' : 'border border-border bg-card text-foreground hover:border-primary/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Guides list */}
          <div className="space-y-3">
            {guides.filter(g => !g.featured || category !== 'All').map((guide, i) => (
              <Link key={guide.slug} href={`/guides/${guide.slug}`}>
                <div className="group flex items-center gap-4 p-4 border border-border bg-card rounded-xl hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <span className="font-mono text-sm font-bold text-muted-foreground">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <h3 className="font-serif font-semibold text-foreground group-hover:text-primary transition-colors">{guide.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground font-sans truncate">{guide.excerpt}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-xs font-sans px-2 py-0.5 rounded-full font-medium hidden sm:inline ${DIFFICULTY_COLORS[guide.difficulty]}`}>
                      {guide.difficulty}
                    </span>
                    <span className="text-xs text-muted-foreground font-sans hidden sm:inline">{guide.readTime} min</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
