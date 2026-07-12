import { Link } from 'wouter';
import { getToolsByCategory } from '@/data/tools';

interface Category {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  iconBg: string;
  disabled?: boolean;
}

const CATEGORIES: Category[] = [
  {
    id: 'counting',
    icon: '📊',
    title: 'Counting Tools',
    description: 'Word, character, sentence, paragraph, line & page counters',
    color: 'border-blue-200 hover:border-blue-400 dark:border-blue-900 dark:hover:border-blue-600',
    iconBg: 'bg-blue-50 dark:bg-blue-950',
  },
  {
    id: 'analysis',
    icon: '📈',
    title: 'Analysis Tools',
    description: 'Readability, keyword density, frequency & uniqueness analysis',
    color: 'border-green-200 hover:border-green-400 dark:border-green-900 dark:hover:border-green-600',
    iconBg: 'bg-green-50 dark:bg-green-950',
  },
  {
    id: 'time',
    icon: '⏱️',
    title: 'Time Tools',
    description: 'Reading time, speaking time & syllable counting',
    color: 'border-amber-200 hover:border-amber-400 dark:border-amber-900 dark:hover:border-amber-600',
    iconBg: 'bg-amber-50 dark:bg-amber-950',
  },
  {
    id: 'advanced',
    icon: '✏️',
    title: 'Advanced Tools',
    description: 'Text summarizer, complexity analyzer & density mapping',
    color: 'border-purple-200 hover:border-purple-400 dark:border-purple-900 dark:hover:border-purple-600',
    iconBg: 'bg-purple-50 dark:bg-purple-950',
  },
  {
    id: 'seo',
    icon: '🎯',
    title: 'SEO Pages',
    description: 'Character limits, word-to-page conversions & speech times',
    color: 'border-rose-200 hover:border-rose-400 dark:border-rose-900 dark:hover:border-rose-600',
    iconBg: 'bg-rose-50 dark:bg-rose-950',
  },
  {
    id: 'mobile',
    icon: '📱',
    title: 'Mobile Apps',
    description: 'Native iOS & Android apps — coming soon',
    color: 'border-slate-200 hover:border-slate-300 dark:border-slate-700',
    iconBg: 'bg-slate-50 dark:bg-slate-900',
    disabled: true,
  },
];

const CATEGORY_LINKS: Record<string, string> = {
  counting: '/tools',
  analysis: '/tools',
  time: '/tools',
  advanced: '/tools',
  seo: '/twitter-character-limit',
};

export default function ToolCategories() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-1">Explore All Tools</h2>
            <p className="text-muted-foreground font-sans text-sm">20+ free writing tools organized by type</p>
          </div>
          <Link
            href="/tools"
            className="hidden sm:inline-flex items-center text-sm font-medium text-primary hover:underline font-sans"
          >
            View all tools →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => {
            const tools = cat.id === 'seo' || cat.id === 'mobile'
              ? []
              : getToolsByCategory(cat.id as any);

            const href = cat.disabled ? undefined : (CATEGORY_LINKS[cat.id] || '/tools');

            const inner = (
              <div
                className={`group p-6 rounded-xl border-2 bg-card transition-all duration-200 ${cat.color} ${
                  cat.disabled ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-sm cursor-pointer'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`text-2xl p-2 rounded-lg ${cat.iconBg} flex-shrink-0`}>
                    {cat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-serif text-lg font-semibold text-foreground">{cat.title}</h3>
                      {cat.disabled && (
                        <span className="text-xs font-sans px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          Soon
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground font-sans leading-snug mb-3">
                      {cat.description}
                    </p>
                    {tools.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {tools.slice(0, 3).map(t => (
                          <span key={t.slug} className="text-xs font-sans px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                            {t.name}
                          </span>
                        ))}
                        {tools.length > 3 && (
                          <span className="text-xs font-sans px-2 py-0.5 rounded-md bg-muted text-primary font-medium">
                            +{tools.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                    {!cat.disabled && (
                      <div className="mt-3 text-xs font-medium text-primary font-sans opacity-0 group-hover:opacity-100 transition-opacity">
                        View all →
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );

            return cat.disabled ? (
              <div key={cat.id}>{inner}</div>
            ) : (
              <Link key={cat.id} href={href!}>{inner}</Link>
            );
          })}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link href="/tools" className="text-sm font-medium text-primary hover:underline font-sans">
            View all 20+ tools →
          </Link>
        </div>
      </div>
    </section>
  );
}
