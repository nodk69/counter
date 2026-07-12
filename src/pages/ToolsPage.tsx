import { useState } from 'react';
import { Link } from 'wouter';
import { Search } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MetaTags from '@/components/MetaTags';
import SchemaMarkup from '@/components/SchemaMarkup';
import { TOOLS, TOOL_CATEGORIES, type ToolCategory } from '@/data/tools';

const CATEGORY_FILTERS: { id: string; label: string }[] = [
  { id: 'all', label: 'All Tools' },
  ...Object.entries(TOOL_CATEGORIES).map(([id, meta]) => ({ id, label: meta.label })),
];

function StarRating({ n }: { n: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`w-3 h-3 ${i<=n?'text-amber-400 fill-amber-400':'text-border fill-border'}`} viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

export default function ToolsPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  const filtered = TOOLS.filter(t => {
    const matchesCategory = category === 'all' || t.category === category;
    const matchesSearch = !query || t.name.toLowerCase().includes(query.toLowerCase()) || t.description.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MetaTags
        title="All Writing Tools — 20+ Free Online Writing Utilities"
        description="Browse 20+ free online writing tools: word counter, character counter, readability checker, keyword density analyzer, and more. All instant, all free."
      />
      <SchemaMarkup type="tools" />
      <Header />
      <main className="flex-1">
        {/* Page header */}
        <div className="bg-muted/30 border-b border-border py-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-xs font-sans text-muted-foreground mb-2">
              <Link href="/" className="hover:text-primary">Home</Link> › Tools
            </div>
            <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
              All Writing Tools & SEO Suite
            </h1>
            <p className="text-muted-foreground font-sans">
              Choose from 20+ professional content tools — free, private, real-time
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-6xl py-10">
          {/* Search + filter bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search tools..."
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm font-sans placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_FILTERS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setCategory(f.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium font-sans transition-colors ${
                    category === f.id
                      ? 'bg-primary text-white'
                      : 'border border-border bg-card text-foreground hover:border-primary/40'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <p className="text-xs text-muted-foreground font-sans mb-4">
            Showing {filtered.length} of {TOOLS.length} tools
          </p>

          {/* Tools grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
            {filtered.map((tool, i) => (
              <Link key={tool.slug} href={`/${tool.slug}`}>
                <div className="group p-5 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer h-full flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{tool.icon}</span>
                    <StarRating n={i < 4 ? 5 : i < 10 ? 4 : 3} />
                  </div>
                  <h2 className="font-serif text-base font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {tool.name}
                  </h2>
                  <p className="text-xs text-muted-foreground font-sans mb-3 leading-snug flex-1">
                    {tool.shortDesc}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-sans px-2 py-0.5 rounded-md bg-muted text-muted-foreground capitalize">
                      {TOOL_CATEGORIES[tool.category as ToolCategory].label}
                    </span>
                    <span className="text-xs font-medium text-primary font-sans opacity-0 group-hover:opacity-100 transition-opacity">
                      Launch →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Comparison table */}
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 bg-muted/30 border-b border-border">
              <h2 className="font-serif text-xl font-semibold text-foreground">Tool Comparison</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-sans">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Tool</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Purpose</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Category</th>
                    <th className="py-3 px-4 text-muted-foreground font-medium text-center">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {TOOLS.slice(0,10).map((tool, i) => (
                    <tr key={tool.slug} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4">
                        <Link href={`/${tool.slug}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                          <span>{tool.icon}</span>
                          <span className="font-medium text-foreground">{tool.name}</span>
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{tool.shortDesc}</td>
                      <td className="py-3 px-4">
                        <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground capitalize">
                          {TOOL_CATEGORIES[tool.category as ToolCategory].label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center">
                          <StarRating n={i < 2 ? 5 : i < 6 ? 4 : 3} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
