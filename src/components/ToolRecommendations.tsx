import { useMemo } from 'react';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { TOOLS } from '@/data/tools';
import type { ContentAnalysis, WritingMode } from '@/hooks/useContentAnalysis';
import type { TextStats } from '@/hooks/useTextStats';

interface Rec {
  slug: string;
  name: string;
  icon: string;
  reason: string;
}

// Built once at module load rather than inside every render/call of
// getRecommendations. The original code called `TOOLS.find(t => t.slug
// === slug)` up to ~15 times per invocation — an O(n) scan repeated
// against the same array. For a small TOOLS list the cost is trivial
// today, but it scales linearly with catalog size for no reason; a Map
// lookup is O(1) regardless of how many tools exist.
const TOOLS_BY_SLUG = new Map(TOOLS.map(t => [t.slug, t]));

function getRecommendations(
  analysis: ContentAnalysis,
  stats: TextStats,
  mode: WritingMode
): Rec[] {
  const recs: Rec[] = [];
  const used = new Set<string>();

  function add(slug: string, reason: string) {
    if (used.has(slug)) return;
    const tool = TOOLS_BY_SLUG.get(slug);
    if (!tool) {
      // A recommendation referencing a slug that doesn't exist in TOOLS
      // is a data/config bug (typo, renamed tool, etc.) that previously
      // failed completely silently. Surfacing it in dev makes that
      // mistake visible without affecting the user-facing UI.
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`ToolRecommendations: no tool found for slug "${slug}"`);
      }
      return;
    }
    used.add(slug);
    recs.push({ slug, name: tool.name, icon: tool.icon, reason });
  }

  // No text yet — show universally useful starters
  if (stats.words < 10) {
    add('readability-checker', 'Check how easy your text is to read as you write.');
    add('keyword-density-checker', 'See which words you use most and optimize for your topic.');
    add('reading-time-calculator', 'Estimate how long it takes to read your content.');
    return recs.slice(0, 3);
  }

  // Readability issues
  if (analysis.dimensions.find(d => d.label === 'Readability')?.status !== 'good') {
    add('readability-checker', 'Your readability score needs attention — get a detailed breakdown.');
  }

  // Sentence length issues
  if (analysis.dimensions.find(d => d.label === 'Sentence Length')?.status !== 'good') {
    add('sentence-length-analyzer', 'Analyze your sentence lengths to find which ones need trimming.');
  }

  // Passive voice is high
  if (analysis.passiveRate > 20) {
    add('sentence-counter', 'Review your sentence structure to reduce passive voice.');
  }

  // Low vocabulary diversity
  if (analysis.ttr < 0.45) {
    add('unique-word-counter', 'Measure your vocabulary richness and spot overused words.');
  }

  // Keyword / SEO work
  if (mode === 'seo' || stats.words > 300) {
    add('keyword-density-checker', `Your top keyword appears ${stats.wordDensity[0]?.count ?? 0}× — check if density is on target.`);
  }

  // Word frequency — repeated words found
  if (analysis.repeatedWords.length > 0) {
    add('word-frequency-counter', `"${analysis.repeatedWords[0].word}" repeats ${analysis.repeatedWords[0].count}× — find all overused words.`);
  }

  // Page count helpful for long texts
  if (stats.words > 500) {
    const pages = Math.round(stats.words / 275);
    add('page-counter', `${stats.words.toLocaleString()} words is about ${pages} page${pages !== 1 ? 's' : ''} — verify formatting requirements.`);
  }

  // Reading & speaking time
  if (stats.words > 100) {
    add('reading-time-calculator', `Estimated read time: ${Math.ceil(stats.readingTime)}min — add this to your content.`);
  }

  // Syllable / complexity — academic mode
  if (mode === 'academic') {
    add('syllable-counter', 'Academic texts rely on polysyllabic words — check your syllable count.');
    add('complexity-analyzer', 'Measure the grade-level complexity of your academic writing.');
  }

  // Social mode
  if (mode === 'social') {
    add('character-counter', 'Track character counts for Twitter, Instagram, and LinkedIn limits.');
  }

  // Paragraph structure
  if (analysis.dimensions.find(d => d.label === 'Paragraph Structure')?.status !== 'good') {
    add('paragraph-length-analyzer', 'Your paragraphs may be too long — analyze and break them up.');
  }

  // Weasel words
  if (analysis.weaselWords.length > 3) {
    add('word-density-analyzer', 'See which words dominate your text and where they cluster.');
  }

  // Fill up to 4 with text summarizer / paragraph counter if needed
  if (recs.length < 3) add('text-summarizer', 'Get a full snapshot of your text stats in one view.');
  if (recs.length < 3) add('paragraph-counter', 'Analyze how many paragraphs your content has.');

  return recs.slice(0, 4);
}

export default function ToolRecommendations({
  analysis,
  stats,
  mode,
}: {
  analysis: ContentAnalysis;
  stats: TextStats;
  mode: WritingMode;
}) {
  // Memoized so this fairly involved decision tree only re-runs when the
  // inputs that actually feed it change, not on every parent re-render
  // (e.g. a sibling section toggling open/closed).
  const recs = useMemo(
    () => getRecommendations(analysis, stats, mode),
    [analysis, stats, mode]
  );

  if (recs.length === 0) return null;

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 bg-muted/30">
        <span className="font-sans font-medium text-sm text-foreground">Recommended Tools</span>
      </div>
      <div className="p-4 bg-card space-y-2">
        <p className="text-xs text-muted-foreground font-sans mb-3">
          Based on your analysis, these tools can help next:
        </p>
        {recs.map(rec => (
          <Link
            key={rec.slug}
            href={`/${rec.slug}`}
            className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/30 transition-colors group cursor-pointer"
          >
            <span className="text-lg flex-shrink-0 mt-0.5">{rec.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground font-sans group-hover:text-primary transition-colors">
                {rec.name}
              </div>
              <div className="text-xs text-muted-foreground font-sans mt-0.5 leading-relaxed">
                {rec.reason}
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
          </Link>
        ))}
      </div>
    </div>
  );
}