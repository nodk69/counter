import { useMemo } from 'react';

// ─── Constants ──────────────────────────────────────────────────────────────

const FILLER_WORDS = [
  'very', 'really', 'actually', 'basically', 'literally', 'just', 'quite',
  'somewhat', 'rather', 'fairly', 'pretty', 'simply', 'truly', 'honestly',
  'definitely', 'certainly', 'absolutely', 'clearly', 'obviously', 'apparently',
  'essentially', 'generally', 'usually', 'needless', 'indeed', 'surely',
];

// Precompile filler-word regexes once at module load instead of on every
// analysis run — FILLER_WORDS is static, so there's no reason to pay the
// RegExp-construction cost inside the hook on every keystroke.
const FILLER_REGEXES: Array<{ word: string; re: RegExp }> = FILLER_WORDS.map((fw) => ({
  word: fw,
  re: new RegExp(`\\b${fw}\\b`, 'gi'),
}));

const PASSIVE_AUX = ['am', 'is', 'are', 'was', 'were', 'be', 'been', 'being'];
// NOTE: this pattern is built fresh inside the hook (see buildPassiveRegex)
// rather than as a shared module-level `g` RegExp. A shared global RegExp
// carries mutable `lastIndex` state; if two analyses ever interleave
// (e.g. this hook is invoked recursively, or an exception aborts a loop
// mid-scan and skips the lastIndex reset), matches silently start from the
// wrong offset. A fresh instance per call sidesteps that entirely.
function buildPassiveRegex(): RegExp {
  return new RegExp(`\\b(${PASSIVE_AUX.join('|')})\\s+(being\\s+)?\\w+(ed|en|n)\\b`, 'gi');
}

const PARAGRAPH_SPLIT_RE = /\n\s*\n+/;

export type WritingMode = 'general' | 'academic' | 'seo' | 'business' | 'social';

interface ModeTargets {
  label: string;
  readabilityMin: number;
  readabilityMax: number;
  avgSentMin: number;
  avgSentMax: number;
  passiveMax: number;     // max % of sentences
  fillerMax: number;      // max % of words
  paragraphSentMax: number;
}

export const MODE_CONFIGS: Record<WritingMode, ModeTargets> = {
  general:  { label: 'General',      readabilityMin: 60, readabilityMax: 80, avgSentMin: 12, avgSentMax: 20, passiveMax: 15, fillerMax: 1.5, paragraphSentMax: 6 },
  academic: { label: 'Academic',     readabilityMin: 30, readabilityMax: 60, avgSentMin: 18, avgSentMax: 30, passiveMax: 40, fillerMax: 1.0, paragraphSentMax: 8 },
  seo:      { label: 'SEO',          readabilityMin: 60, readabilityMax: 75, avgSentMin: 10, avgSentMax: 18, passiveMax: 10, fillerMax: 1.0, paragraphSentMax: 4 },
  business: { label: 'Business',     readabilityMin: 50, readabilityMax: 70, avgSentMin: 12, avgSentMax: 22, passiveMax: 20, fillerMax: 1.2, paragraphSentMax: 5 },
  social:   { label: 'Social Media', readabilityMin: 70, readabilityMax: 90, avgSentMin: 6,  avgSentMax: 14, passiveMax: 5,  fillerMax: 2.0, paragraphSentMax: 3 },
};

// Word count benchmarks
export const BENCHMARKS = [
  { label: 'Tweet / X post',       min: 0,    max: 280,   wpm: true },
  { label: 'LinkedIn post',         min: 150,  max: 300,   wpm: false },
  { label: 'Email newsletter',      min: 200,  max: 600,   wpm: false },
  { label: 'Short blog post',       min: 300,  max: 700,   wpm: false },
  { label: 'Standard blog post',    min: 1000, max: 1500,  wpm: false },
  { label: 'SEO-optimized article', min: 1500, max: 2500,  wpm: false },
  { label: 'Long-form guide',       min: 2500, max: 5000,  wpm: false },
  { label: 'Short essay',           min: 250,  max: 750,   wpm: false },
  { label: 'Standard essay',        min: 500,  max: 1200,  wpm: false },
  { label: 'College essay',         min: 500,  max: 650,   wpm: false },
  { label: 'Short story',           min: 1000, max: 7500,  wpm: false },
  { label: 'Novella',               min: 20000,max: 40000, wpm: false },
  { label: 'Novel chapter',         min: 2000, max: 5000,  wpm: false },
];

// ─── Types ──────────────────────────────────────────────────────────────────

export interface FillerWordResult { word: string; count: number }
export interface PassiveResult    { sentence: string; match: string }

export interface ScoreDimension {
  label: string;
  score: number;   // 0-100
  weight: number;  // percentage weight (0-1)
  status: 'good' | 'warn' | 'bad';
  tip: string;
}

export interface ContentAnalysis {
  // Filler words
  fillerWords: FillerWordResult[];
  fillerWordDensity: number;  // % of total words

  // Passive voice
  passiveCount: number;
  passiveRate: number;  // % of sentences
  passiveSamples: string[];

  // Vocabulary diversity
  ttr: number;             // type-token ratio 0-1
  ttrLabel: string;        // Excellent / Good / Fair / Poor
  repeatedWords: Array<{ word: string; count: number }>;  // top overused words

  // Sentence distribution
  shortSentences: number;
  mediumSentences: number;
  longSentences: number;
  avgSentenceWords: number;

  // Content score
  contentScore: number;    // 0-100
  dimensions: ScoreDimension[];
  scoreLabel: string;      // Excellent / Good / Fair / Needs Work

  // Benchmarks
  matchingBenchmarks: string[];  // content types that fit this word count

  // Audience (from FK score input)
  audienceLabel: string;
  audienceNote: string;
}

// ─── Pure helpers ────────────────────────────────────────────────────────────

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

/**
 * Divides `numerator / denominator`, returning `fallback` (default 0)
 * instead of Infinity/NaN when denominator is zero or non-finite.
 * The original scoring formulas divided by expressions like
 * `(100 - cfg.passiveMax)` or `(5 - cfg.fillerMax)` — safe today because
 * current configs never hit those exact values, but a future config
 * edit (e.g. passiveMax: 100, or fillerMax: 5) would silently produce
 * NaN scores with no error. This makes that failure mode impossible.
 */
function safeDiv(numerator: number, denominator: number, fallback = 0): number {
  if (!Number.isFinite(denominator) || denominator === 0) return fallback;
  const result = numerator / denominator;
  return Number.isFinite(result) ? result : fallback;
}

function scoreLabel(n: number): string {
  if (n >= 85) return 'Excellent';
  if (n >= 70) return 'Good';
  if (n >= 50) return 'Fair';
  return 'Needs Work';
}

function ttrToLabel(ttr: number): string {
  if (ttr >= 0.72) return 'Excellent';
  if (ttr >= 0.55) return 'Good';
  if (ttr >= 0.35) return 'Fair';
  return 'Poor';
}

function audienceInfo(fk: number): { label: string; note: string } {
  if (fk >= 90) return { label: '5th Grade / Children',          note: 'Very simple — suitable for children or beginners.' };
  if (fk >= 80) return { label: '6th Grade / Young Adult',       note: 'Easy reading. Good for casual consumer content.' };
  if (fk >= 70) return { label: '7th Grade / General Public',    note: 'Accessible to most adults. Ideal for blogs.' };
  if (fk >= 60) return { label: '8th–9th Grade / Standard',      note: 'Plain English — the sweet spot for most web content.' };
  if (fk >= 50) return { label: '10th–12th Grade / High School', note: 'Slightly complex. Fine for informed readers.' };
  if (fk >= 30) return { label: 'College / Professional',        note: 'Dense. Best for academic or specialist audiences.' };
  return          { label: 'Graduate / Expert',                  note: 'Very complex. Limit to highly technical fields.' };
}

const IGNORED_REPEAT_WORDS = new Set([
  'that', 'with', 'this', 'from', 'have', 'been', 'were', 'they', 'them',
  'their', 'would', 'could', 'should',
]);

// ─── Main hook ──────────────────────────────────────────────────────────────

export function useContentAnalysis(
  text: string,
  fleschKincaid: number,
  words: number,
  sentences: number,
  uniqueWords: number,
  mode: WritingMode = 'general'
): ContentAnalysis {
  return useMemo(() => {
    const cfg = MODE_CONFIGS[mode];

    // ── Tokenise ──
    const wordTokens = text.match(/\b[a-zA-Z]+\b/g) || [];
    const totalWords = wordTokens.length;

    // ── Filler words ──
    const fillerResults: FillerWordResult[] = [];
    for (const { word, re } of FILLER_REGEXES) {
      re.lastIndex = 0; // these ARE shared module-level `g` regexes, so reset explicitly before each use
      const count = (text.match(re) || []).length;
      if (count > 0) fillerResults.push({ word, count });
    }
    fillerResults.sort((a, b) => b.count - a.count);
    const totalFillers = fillerResults.reduce((s, f) => s + f.count, 0);
    const fillerWordDensity = totalWords > 0 ? (totalFillers / totalWords) * 100 : 0;

    // ── Passive voice ──
    const sentenceList = text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 4);
    const passiveSamples: string[] = [];
    let passiveCount = 0;
    const passiveRe = buildPassiveRegex(); // fresh instance — no cross-call lastIndex leakage
    for (const sent of sentenceList) {
      passiveRe.lastIndex = 0;
      if (passiveRe.test(sent)) {
        passiveCount++;
        if (passiveSamples.length < 5) {
          const trimmed = sent.trim().slice(0, 80);
          passiveSamples.push(trimmed.length < sent.trim().length ? trimmed + '…' : trimmed);
        }
      }
    }
    const passiveRate = sentenceList.length > 0 ? (passiveCount / sentenceList.length) * 100 : 0;

    // ── Vocabulary diversity ──
    const wordMap = new Map<string, number>();
    for (const w of wordTokens) {
      const lw = w.toLowerCase();
      wordMap.set(lw, (wordMap.get(lw) || 0) + 1);
    }
    // Guard against uniqueWords being computed elsewhere (e.g. useTextStats,
    // which tokenises alnum+underscore) with a different word set than the
    // alpha-only tokens used here — clamp so ttr can never exceed 1.
    const ttr = totalWords > 0 ? clamp(uniqueWords / totalWords, 0, 1) : 0;
    const ttrLabel = ttrToLabel(ttr);
    const repeatedWords = Array.from(wordMap.entries())
      .filter(([w, c]) => c > 2 && w.length > 3 && !IGNORED_REPEAT_WORDS.has(w))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, count]) => ({ word, count }));

    // ── Sentence distribution ──
    const sentsByLength = sentenceList.map(s => (s.match(/\b\w+\b/g) || []).length);
    const shortSentences  = sentsByLength.filter(l => l < 10).length;
    const mediumSentences = sentsByLength.filter(l => l >= 10 && l <= 20).length;
    const longSentences   = sentsByLength.filter(l => l > 20).length;
    const avgSentenceWords = sentences > 0 ? words / sentences : 0;

    // ── Score dimensions ──
    const empty = totalWords < 30;

    // 1. Readability (25pts)
    let readScore = 0;
    if (!empty) {
      if (fleschKincaid >= cfg.readabilityMin && fleschKincaid <= cfg.readabilityMax) readScore = 100;
      else if (fleschKincaid < cfg.readabilityMin) readScore = clamp(safeDiv(fleschKincaid, cfg.readabilityMin) * 100, 0, 100);
      else readScore = clamp(100 - safeDiv(fleschKincaid - cfg.readabilityMax, 100 - cfg.readabilityMax) * 100, 0, 100);
    }
    const readStatus = readScore >= 70 ? 'good' : readScore >= 40 ? 'warn' : 'bad';
    const readTip = readScore >= 70 ? 'Readability is well-suited for your mode.' :
      fleschKincaid > cfg.readabilityMax ? 'Text is too simple for your mode — add more complexity.' :
      'Shorten sentences and use simpler vocabulary to improve readability.';

    // 2. Sentence length (20pts)
    let sentScore = 0;
    if (!empty && sentences > 0) {
      if (avgSentenceWords >= cfg.avgSentMin && avgSentenceWords <= cfg.avgSentMax) sentScore = 100;
      else if (avgSentenceWords < cfg.avgSentMin) sentScore = clamp(safeDiv(avgSentenceWords, cfg.avgSentMin) * 80, 0, 100);
      else sentScore = clamp(100 - safeDiv(avgSentenceWords - cfg.avgSentMax, 15) * 100, 0, 100);
    }
    const sentStatus = sentScore >= 70 ? 'good' : sentScore >= 40 ? 'warn' : 'bad';
    const sentTip = sentScore >= 70 ? `Average sentence length (${avgSentenceWords.toFixed(0)} words) is on target.` :
      avgSentenceWords > cfg.avgSentMax ? `Sentences average ${avgSentenceWords.toFixed(0)} words — try breaking long ones up.` :
      `Sentences are short (${avgSentenceWords.toFixed(0)} words avg) — aim for ${cfg.avgSentMin}–${cfg.avgSentMax} words.`;

    // 3. Vocabulary diversity (20pts)
    const vocabScore = empty ? 0 : clamp(ttr * 150, 0, 100);
    const vocabStatus = vocabScore >= 70 ? 'good' : vocabScore >= 40 ? 'warn' : 'bad';
    const vocabTip = vocabScore >= 70 ? `${ttrLabel} vocabulary diversity (${(ttr * 100).toFixed(0)}% unique).` :
      `Lexical diversity is ${ttrLabel.toLowerCase()} — vary your word choices to reduce repetition.`;

    // 4. Passive voice (15pts)
    let passiveScore = 100;
    if (!empty && sentences > 0) {
      passiveScore = clamp(100 - Math.max(0, passiveRate - cfg.passiveMax) * safeDiv(100, 100 - cfg.passiveMax), 0, 100);
    }
    const passiveStatus = passiveScore >= 70 ? 'good' : passiveScore >= 40 ? 'warn' : 'bad';
    const passiveTip = passiveScore >= 70 ? `Passive voice is within range (${passiveRate.toFixed(0)}% of sentences).` :
      `${passiveRate.toFixed(0)}% passive voice — aim for under ${cfg.passiveMax}%. Rewrite flagged sentences.`;

    // 5. Filler words (10pts)
    let fillerScore = 100;
    if (!empty) {
      fillerScore = clamp(100 - Math.max(0, fillerWordDensity - cfg.fillerMax) * safeDiv(100, 5 - cfg.fillerMax), 0, 100);
    }
    const fillerStatus = fillerScore >= 70 ? 'good' : fillerScore >= 40 ? 'warn' : 'bad';
    const fillerTip = fillerScore >= 70 ? 'Filler word usage is low — good writing discipline.' :
      `${totalFillers} filler words found (${fillerWordDensity.toFixed(1)}% of text). Remove weak intensifiers.`;

    // 6. Paragraph structure (10pts)
    // Uses the same blank-line paragraph definition as the rest of the app
    // would ideally use everywhere (see useTextStats note) — a single blank
    // line, not a bare newline, delimits a paragraph.
    const paragraphCount = Math.max(1, text.split(PARAGRAPH_SPLIT_RE).filter(p => p.trim()).length);
    const avgSentsPerPara = sentences > 0 && words > 0 ? sentences / paragraphCount : 0;
    const paraScore = empty ? 0 : avgSentsPerPara <= cfg.paragraphSentMax ? 100 : clamp(100 - ((avgSentsPerPara - cfg.paragraphSentMax) / 5) * 100, 0, 100);
    const paraStatus = paraScore >= 70 ? 'good' : paraScore >= 40 ? 'warn' : 'bad';
    const paraTip = paraScore >= 70 ? `Paragraph length looks good (avg ${avgSentsPerPara.toFixed(1)} sentences).` :
      `Paragraphs are long (avg ${avgSentsPerPara.toFixed(1)} sentences) — break them up for readability.`;

    const dimensions: ScoreDimension[] = [
      { label: 'Readability',          score: Math.round(readScore),   weight: 0.25, status: readStatus,   tip: readTip },
      { label: 'Sentence Length',      score: Math.round(sentScore),   weight: 0.20, status: sentStatus,   tip: sentTip },
      { label: 'Vocabulary Diversity', score: Math.round(vocabScore),  weight: 0.20, status: vocabStatus,  tip: vocabTip },
      { label: 'Passive Voice',        score: Math.round(passiveScore),weight: 0.15, status: passiveStatus,tip: passiveTip },
      { label: 'Filler Words',         score: Math.round(fillerScore), weight: 0.10, status: fillerStatus, tip: fillerTip },
      { label: 'Paragraph Structure',  score: Math.round(paraScore),   weight: 0.10, status: paraStatus,   tip: paraTip },
    ];

    const contentScore = empty ? 0 : Math.round(
      dimensions.reduce((sum, d) => sum + d.score * d.weight, 0)
    );

    // ── Word count benchmarks ──
    const matchingBenchmarks = BENCHMARKS
      .filter(b => words >= b.min && words <= b.max)
      .map(b => b.label);

    const audience = audienceInfo(fleschKincaid);

    return {
      fillerWords: fillerResults,
      fillerWordDensity,
      passiveCount,
      passiveRate,
      passiveSamples,
      ttr,
      ttrLabel,
      repeatedWords,
      shortSentences,
      mediumSentences,
      longSentences,
      avgSentenceWords,
      contentScore,
      dimensions,
      scoreLabel: scoreLabel(contentScore),
      matchingBenchmarks,
      audienceLabel: audience.label,
      audienceNote:  audience.note,
    };
  }, [text, fleschKincaid, words, sentences, uniqueWords, mode]);
}