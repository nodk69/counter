import { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, FileText, BookOpen, Wrench } from 'lucide-react';
import { Link } from 'wouter';
import { TOOLS } from '@/data/tools';
import { BLOG_POSTS } from '@/data/blog';
import { GUIDES } from '@/data/guides';
import { useCommandPalette } from '@/context/CommandPaletteContext';

// ─── Search index ─────────────────────────────────────────────────────────────

type ItemType = 'tool' | 'blog' | 'guide';

interface SearchItem {
  type:        ItemType;
  title:       string;
  description: string;
  href:        string;
  icon?:       string;
  category?:   string;
}

const INDEX: SearchItem[] = [
  ...TOOLS.map(t => ({
    type:        'tool'  as const,
    title:       t.name,
    description: t.shortDesc,
    href:        `/${t.slug}`,
    icon:        t.icon,
    category:    t.category,
  })),
  ...BLOG_POSTS.map(p => ({
    type:        'blog'  as const,
    title:       p.title,
    description: p.excerpt,
    href:        `/blog/${p.slug}`,
    category:    p.category,
  })),
  ...GUIDES.map(g => ({
    type:        'guide' as const,
    title:       g.title,
    description: g.excerpt,
    href:        `/guides/${g.slug}`,
    category:    g.category,
  })),
];

const POPULAR = INDEX.filter(i =>
  ['word-counter', 'character-counter', 'readability-checker', 'reading-time-calculator'].some(s =>
    i.href.includes(s)
  )
).slice(0, 5);

function score(item: SearchItem, q: string): number {
  const title = item.title.toLowerCase();
  const desc  = item.description.toLowerCase();
  const query = q.toLowerCase().trim();

  if (!query) return 0;
  if (title === query)                    return 100;
  if (title.startsWith(query))            return 85;
  if (title.includes(query))              return 65;
  if (query.split(' ').some(w => w.length > 2 && title.includes(w))) return 50;
  if (desc.includes(query))               return 25;
  return 0;
}

function search(query: string): SearchItem[] {
  if (!query.trim()) return POPULAR;
  return INDEX
    .map(item => ({ item, s: score(item, query) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 9)
    .map(({ item }) => item);
}

// ─── Component ────────────────────────────────────────────────────────────────

const TYPE_META: Record<ItemType, { label: string; Icon: React.FC<{ className?: string }>; color: string }> = {
  tool:  { label: 'Tool',    Icon: Wrench,   color: 'text-blue-500'   },
  blog:  { label: 'Article', Icon: FileText, color: 'text-orange-500' },
  guide: { label: 'Guide',   Icon: BookOpen, color: 'text-green-500'  },
};

export default function CommandPalette() {
  const { open, close } = useCommandPalette();
  const [query,    setQuery]    = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef  = useRef<HTMLInputElement>(null);
  const results   = search(query);

  // Reset & focus on open
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  // Reset selection when results change
  useEffect(() => setSelected(0), [query]);

  // Arrow-key + Enter navigation
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelected(s => Math.min(s + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelected(s => Math.max(s - 1, 0));
      } else if (e.key === 'Enter' && results[selected]) {
        e.preventDefault();
        // Navigate programmatically via location
        window.location.href = results[selected].href;
        close();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, results, selected, close]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-[14vh] px-4"
      onClick={close}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

      {/* Panel */}
      <div
        className="relative w-full max-w-xl bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search input row */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" aria-hidden />
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={results.length > 0}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tools, articles, guides…"
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none font-sans text-base"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono text-muted-foreground bg-muted border border-border rounded px-1.5 py-0.5">
              ESC
            </kbd>
          )}
        </div>

        {/* Results list */}
        <div role="listbox" aria-label="Search results" className="max-h-80 overflow-y-auto py-1.5">
          {results.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm font-sans">
              No results for "<strong>{query}</strong>"
            </div>
          ) : (
            <>
              {!query && (
                <div className="px-4 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground font-sans">
                  Popular
                </div>
              )}
              {results.map((item, i) => {
                const { label, Icon, color } = TYPE_META[item.type];
                const isSelected = i === selected;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    role="option"
                    aria-selected={isSelected}
                    onClick={close}
                    onMouseEnter={() => setSelected(i)}
                    className={`flex items-center gap-3 px-4 py-2.5 transition-colors cursor-pointer focus:outline-none ${
                      isSelected ? 'bg-muted' : 'hover:bg-muted/60'
                    }`}
                  >
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-muted/50">
                      {item.icon
                        ? <span className="text-lg leading-none">{item.icon}</span>
                        : <Icon className={`w-4 h-4 ${color}`} />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground font-sans truncate">
                        {item.title}
                      </div>
                      <div className="text-xs text-muted-foreground font-sans truncate">
                        {item.description}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className={`text-[10px] font-semibold font-sans ${color}`}>{label}</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground" aria-hidden />
                    </div>
                  </Link>
                );
              })}
            </>
          )}
        </div>

        {/* Footer hints */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/20">
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-sans">
            <span><kbd className="bg-background border border-border rounded px-1 mr-1">↑↓</kbd>navigate</span>
            <span><kbd className="bg-background border border-border rounded px-1 mr-1">↵</kbd>open</span>
            <span><kbd className="bg-background border border-border rounded px-1 mr-1">esc</kbd>close</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">
            {results.length} result{results.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
