import { useMemo } from 'react';
import { useLocation } from 'wouter';
import { useTextContext } from '@/context/TextContext';
import { useTextStats } from '@/hooks/useTextStats';
import { useContentAnalysis } from '@/hooks/useContentAnalysis';
import { getToolBySlug } from '@/data/tools';
import {
  WordCountingPanel,
  CharacterPanel,
  SentencePanel,
  ParagraphPanel,
  ReadabilityPanel,
  KeywordPanel,
  SyllablePanel,
  ReadingTimePanel,
  SpeakingTimePanel,
  UniqueWordPanel,
  LinePanel,
  PagePanel,
} from './panels';
import type { PanelProps } from './types';

type PanelComponent = (props: PanelProps) => React.ReactElement;

const SLUG_TO_PANEL: Record<string, PanelComponent> = {
  // Counting — word-focused
  'word-counter':          WordCountingPanel,
  'text-summarizer':       WordCountingPanel,

  // Counting — character/letter
  'character-counter':           CharacterPanel,
  'character-frequency-counter': CharacterPanel,
  'letter-counter':              CharacterPanel,

  // Counting — sentence
  'sentence-counter':         SentencePanel,
  'sentence-length-analyzer': SentencePanel,

  // Counting — paragraph
  'paragraph-counter':          ParagraphPanel,
  'paragraph-length-analyzer':  ParagraphPanel,

  // Analysis — readability / complexity
  'readability-checker': ReadabilityPanel,
  'complexity-analyzer': ReadabilityPanel,

  // Analysis — keyword / density / frequency
  'keyword-density-checker':  KeywordPanel,
  'word-frequency-counter':   KeywordPanel,
  'word-density-analyzer':    KeywordPanel,

  // Time — syllable
  'syllable-counter': SyllablePanel,

  // Time — reading / speaking
  'reading-time-calculator':  ReadingTimePanel,
  'speaking-time-calculator': SpeakingTimePanel,

  // Analysis — unique words
  'unique-word-counter': UniqueWordPanel,

  // Counting — line / page
  'line-counter': LinePanel,
  'page-counter': PagePanel,
};

export default function StatsPanel() {
  const { text, mode } = useTextContext();
  const [location] = useLocation();

  const stats = useTextStats(text);
  const analysis = useContentAnalysis(text, mode);

  const slug = useMemo(() => {
    const parts = location.replace(/^\//, '').split('/');
    return parts[0] || '';
  }, [location]);

  const PanelContent: PanelComponent = SLUG_TO_PANEL[slug] ?? WordCountingPanel;
  const tool = getToolBySlug(slug);
  const panelTitle = tool ? `${tool.name} Stats` : 'Statistics';

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-border bg-muted/30 flex-shrink-0">
        <h2 className="font-sans font-semibold text-foreground">{panelTitle}</h2>
      </div>

      <div
        className="flex-1 overflow-y-auto p-2 editor-scrollbar"
        aria-live="polite"
        aria-label={panelTitle}
        role="region"
      >
        <PanelContent stats={stats} analysis={analysis} />
      </div>
    </div>
  );
}
