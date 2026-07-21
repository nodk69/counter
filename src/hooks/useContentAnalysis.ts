import { useMemo } from 'react';
import nlp from 'compromise';
import writeGood from 'write-good';
import readability from 'text-readability';
import readingTimeLib from 'reading-time';
import Sentiment from 'sentiment';

const PARAGRAPH_SPLIT_RE = /\n\s*\n+/;

export type WritingMode = 'general' | 'academic' | 'seo' | 'business' | 'social';

interface ModeTargets {
  label: string;
  readabilityMin: number;
  readabilityMax: number;
  avgSentMin: number;
  avgSentMax: number;
  passiveMax: number;
  fillerMax: number;
  paragraphSentMax: number;
  sentenceVarietyMin: number;
  secondPersonMin: number;
}

export const MODE_CONFIGS: Record<WritingMode, ModeTargets> = {
  general:  { label: 'General',      readabilityMin: 60, readabilityMax: 80, avgSentMin: 12, avgSentMax: 20, passiveMax: 15, fillerMax: 1.5, paragraphSentMax: 6, sentenceVarietyMin: 4, secondPersonMin: 0.05 },
  academic: { label: 'Academic',     readabilityMin: 30, readabilityMax: 60, avgSentMin: 18, avgSentMax: 30, passiveMax: 40, fillerMax: 1.0, paragraphSentMax: 8, sentenceVarietyMin: 3, secondPersonMin: 0.03 },
  seo:      { label: 'SEO',          readabilityMin: 60, readabilityMax: 75, avgSentMin: 10, avgSentMax: 18, passiveMax: 10, fillerMax: 1.0, paragraphSentMax: 4, sentenceVarietyMin: 4, secondPersonMin: 0.05 },
  business: { label: 'Business',     readabilityMin: 50, readabilityMax: 70, avgSentMin: 12, avgSentMax: 22, passiveMax: 20, fillerMax: 1.2, paragraphSentMax: 5, sentenceVarietyMin: 4, secondPersonMin: 0.2 },
  social:   { label: 'Social Media', readabilityMin: 70, readabilityMax: 90, avgSentMin: 6,  avgSentMax: 14, passiveMax: 5,  fillerMax: 2.0, paragraphSentMax: 3, sentenceVarietyMin: 4, secondPersonMin: 0.15 },
};

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

export interface WordCountResult { word: string; count: number }
export interface PhraseResult { phrase: string; count: number }

export interface ScoreDimension {
  label: string;
  score: number;
  weight: number;
  status: 'good' | 'warn' | 'bad';
  tip: string;
}

export interface ContentAnalysis {
  words: number;
  sentences: number;
  paragraphs: number;
  uniqueWords: number;
  readability: {
    fleschReadingEase: number;
    fleschKincaidGrade: number;
    gunningFog: number;
    smogIndex: number;
    colemanLiauIndex: number;
    automatedReadabilityIndex: number;
    consensusGrade: number;
  };
  readingTime: number;
  speakingTime: number;
  passiveCount: number;
  passiveRate: number;
  passiveSamples: string[];
  weaselWords: WordCountResult[];
  weaselDensity: number;
  adverbHits: WordCountResult[];
  adverbDensity: number;
  wordyPhrases: WordCountResult[];
  cliches: WordCountResult[];
  weakOpeners: WordCountResult[];
  ttr: number;
  ttrLabel: string;
  repeatedWords: WordCountResult[];
  posBreakdown: { nouns: number; verbs: number; adjectives: number; adverbs: number; pronouns: number };
  sentimentScore: number;
  sentimentComparative: number;
  sentimentLabel: string;
  shortSentences: number;
  mediumSentences: number;
  longSentences: number;
  avgSentenceWords: number;
  sentenceVarietyScore: number;
  sentenceVarietyLabel: string;
  topPhrases: PhraseResult[];
  properNounDensity: number;
  questionCount: number;
  exclamationCount: number;
  firstPersonRatio: number;
  secondPersonRatio: number;
  contentScore: number;
  dimensions: ScoreDimension[];
  scoreLabel: string;
  matchingBenchmarks: string[];
  audienceLabel: string;
  audienceNote: string;
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

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

function sentenceVarietyToLabel(score: number): string {
  if (score >= 80) return 'Good';
  if (score >= 60) return 'Fair';
  return 'Needs Work';
}

function audienceInfo(fk: number): { label: string; note: string } {
  if (fk >= 90) return { label: '5th Grade / Children', note: 'Very simple — suitable for children or beginners.' };
  if (fk >= 80) return { label: '6th Grade / Young Adult', note: 'Easy reading. Good for casual consumer content.' };
  if (fk >= 70) return { label: '7th Grade / General Public', note: 'Accessible to most adults. Ideal for blogs.' };
  if (fk >= 60) return { label: '8th–9th Grade / Standard', note: 'Plain English — the sweet spot for most web content.' };
  if (fk >= 50) return { label: '10th–12th Grade / High School', note: 'Slightly complex. Fine for informed readers.' };
  if (fk >= 30) return { label: 'College / Professional', note: 'Dense. Best for academic or specialist audiences.' };
  return { label: 'Graduate / Expert', note: 'Very complex. Limit to highly technical fields.' };
}

function buildFrequencyMap(values: string[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const value of values) {
    const key = value.toLowerCase();
    map.set(key, (map.get(key) || 0) + 1);
  }
  return map;
}

function toSortedResults(map: Map<string, number>, limit = 5): WordCountResult[] {
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([word, count]) => ({ word, count }));
}

function toSortedPhraseResults(map: Map<string, number>, limit = 6): PhraseResult[] {
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([phrase, count]) => ({ phrase, count }));
}

function getStdDev(values: number[]): number {
  if (values.length === 0) return 0;
  const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + (value - avg) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function getNgrams(tokens: string[], size: number): string[] {
  if (tokens.length < size) return [];
  const grams: string[] = [];
  for (let index = 0; index <= tokens.length - size; index += 1) {
    grams.push(tokens.slice(index, index + size).join(' '));
  }
  return grams;
}

type SentenceObject = {
  text?: string;
  terms?: Array<{ text?: string; tags?: string[] }>;
};

const IGNORED_REPEAT_WORDS = new Set([
  'that', 'with', 'this', 'from', 'have', 'been', 'were', 'they', 'them',
  'their', 'would', 'could', 'should', 'about', 'after', 'before', 'while',
]);

const WEASELS = [
  'are a number', 'clearly', 'completely', 'exceedingly', 'excellent',
  'extremely', 'fairly', 'few', 'huge', 'interestingly', 'is a number',
  'largely', 'many', 'mostly', 'obviously', 'quite', 'relatively',
  'remarkably', 'several', 'significantly', 'substantially', 'surprisingly',
  'tiny', 'various', 'vast', 'very'
];

const WEASEL_RE = new RegExp('\\b(' + WEASELS.join('|') + ')\\b', 'gi');
const WEASEL_EXCEPTIONS = ['many', 'few'];

function getWeaselWords(text: string): Array<{ reason: string }> {
  const suggestions: Array<{ reason: string }> = [];
  let match;
  WEASEL_RE.lastIndex = 0;
  while ((match = WEASEL_RE.exec(text)) !== null) {
    const weasel = match[0].toLowerCase();
    const prevFour = text.substring(match.index - 4, match.index);
    if (WEASEL_EXCEPTIONS.indexOf(weasel) === -1 || prevFour !== 'too ') {
      suggestions.push({
        reason: `"${match[0]}" is a weasel word`,
      });
    }
  }
  return suggestions;
}

export function useContentAnalysis(text: string, mode: WritingMode = 'general'): ContentAnalysis {
  return useMemo(() => {
    const safeText = typeof text === 'string' ? text : '';
    const cfg = MODE_CONFIGS[mode];
    const doc = nlp(safeText);
    const sentenceObjects = doc.sentences().json() as SentenceObject[];
    const rawTerms = doc.terms().out('array') as string[];
    const normalizedTerms = rawTerms
      .map(term => term.replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, ''))
      .filter(Boolean)
      .map(term => term.toLowerCase());

    const words = normalizedTerms.length;
    const sentences = sentenceObjects.length;
    const paragraphs = Math.max(1, safeText.split(PARAGRAPH_SPLIT_RE).filter(part => part.trim()).length);
    const uniqueWords = new Set(normalizedTerms).size;

    const sentenceWordCounts = sentenceObjects.map((sentence: SentenceObject) => {
      const sentenceTerms = (sentence.terms ?? [])
        .map((term: { text?: string }) => term.text ?? '')
        .map((term: string) => term.replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, ''))
        .filter(Boolean);
      return sentenceTerms.length;
    });

    const passiveCount = sentenceObjects.filter((sentence: SentenceObject) => (sentence.terms ?? []).some((term: { tags?: string[] }) => term.tags?.includes('Passive'))).length;
    const shortSentences = sentenceWordCounts.filter((count: number) => count < 10).length;
    const mediumSentences = sentenceWordCounts.filter((count: number) => count >= 10 && count <= 20).length;
    const longSentences = sentenceWordCounts.filter((count: number) => count > 20).length;
    const avgSentenceWords = sentences > 0 ? safeDiv(words, sentences) : 0;

    const readabilityMetrics = {
      fleschReadingEase: readability.fleschReadingEase(safeText),
      fleschKincaidGrade: readability.fleschKincaidGrade(safeText),
      gunningFog: readability.gunningFog(safeText),
      smogIndex: readability.smogIndex(safeText),
      colemanLiauIndex: readability.colemanLiauIndex(safeText),
      automatedReadabilityIndex: readability.automatedReadabilityIndex(safeText),
      consensusGrade: readability.textStandard(safeText, true) as number,
    };

    const readTimeResult = readingTimeLib(safeText);
    const readingMinutes = readTimeResult.minutes;
    const speakingTime = safeDiv(words, 130);

    const sentimentAnalyzer = new Sentiment();
    const sentimentResult = sentimentAnalyzer.analyze(safeText);
    const sentimentScore = sentimentResult.score;
    const sentimentComparative = sentimentResult.comparative;
    const sentimentLabel = sentimentScore > 0 ? 'Positive' : sentimentScore < 0 ? 'Negative' : 'Neutral';

    const writeGoodResults = [
      ...writeGood(safeText, { weasel: false, passive: false }),
      ...getWeaselWords(safeText)
    ] as Array<{ reason?: string }>;
    const weaselHits = new Map<string, number>();
    const adverbHits = new Map<string, number>();
    const wordyHits = new Map<string, number>();
    const clicheHits = new Map<string, number>();
    const weakOpenerHits = new Map<string, number>();

    for (const issue of writeGoodResults) {
      const reason = typeof issue.reason === 'string' ? issue.reason.toLowerCase() : '';
      const match = reason.match(/"([^"]+)"/);
      const keyword = match?.[1]?.toLowerCase() ?? '';
      if (!keyword) continue;
      if (reason.includes('weasel') || reason.includes('weaken')) {
        weaselHits.set(keyword, (weaselHits.get(keyword) || 0) + 1);
      }
      if (reason.includes('adverb') || reason.includes('ly')) {
        adverbHits.set(keyword, (adverbHits.get(keyword) || 0) + 1);
      }
      if (reason.includes('wordy') || reason.includes('unneeded')) {
        wordyHits.set(keyword, (wordyHits.get(keyword) || 0) + 1);
      }
      if (reason.includes('cliche') || reason.includes('overused')) {
        clicheHits.set(keyword, (clicheHits.get(keyword) || 0) + 1);
      }
      if (reason.includes('opening') || reason.includes('weak')) {
        weakOpenerHits.set(keyword, (weakOpenerHits.get(keyword) || 0) + 1);
      }
    }

    const weaselWords = toSortedResults(weaselHits);
    const adverbWordHits = toSortedResults(adverbHits);
    const wordyPhrases = toSortedResults(wordyHits);
    const cliches = toSortedResults(clicheHits);
    const weakOpeners = toSortedResults(weakOpenerHits);
    const weaselDensity = safeDiv(weaselWords.reduce((sum, item) => sum + item.count, 0), words) * 100;
    const adverbDensity = safeDiv(adverbWordHits.reduce((sum, item) => sum + item.count, 0), words) * 100;

    const wordMap = buildFrequencyMap(normalizedTerms);
    const repeatedWords = Array.from(wordMap.entries())
      .filter(([word, count]) => count > 2 && word.length > 3 && !IGNORED_REPEAT_WORDS.has(word))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, count]) => ({ word, count }));

    const ttr = words > 0 ? clamp(uniqueWords / words, 0, 1) : 0;
    const ttrLabel = ttrToLabel(ttr);

    const posBreakdown = {
      nouns: doc.nouns().out('array').length,
      verbs: doc.verbs().out('array').length,
      adjectives: doc.adjectives().out('array').length,
      adverbs: doc.adverbs().out('array').length,
      pronouns: doc.pronouns().out('array').length,
    };

    const properNounTerms = [
      ...doc.people().out('array'),
      ...doc.places().out('array'),
      ...doc.organizations().out('array'),
    ];
    const properNounDensity = words > 0 ? safeDiv(properNounTerms.length, words) * 100 : 0;

    const questionCount = sentenceObjects.filter((sentence: SentenceObject) => /[?]$/.test((sentence.text ?? '').trim())).length;
    const exclamationCount = sentenceObjects.filter((sentence: SentenceObject) => /[!]$/.test((sentence.text ?? '').trim())).length;

    const pronouns = doc.pronouns().out('array') as string[];
    const firstPersonPronouns = pronouns.filter((term: string) => ['i','we','my','our','me','us','mine','ours'].includes(term.toLowerCase()));
    const secondPersonPronouns = pronouns.filter((term: string) => ['you','your','yours','yourself','yourselves'].includes(term.toLowerCase()));
    const firstPersonRatio = safeDiv(firstPersonPronouns.length, Math.max(1, pronouns.length)) * 100;
    const secondPersonRatio = safeDiv(secondPersonPronouns.length, Math.max(1, pronouns.length)) * 100;

    const sentenceVarietyScoreValue = clamp(100 - getStdDev(sentenceWordCounts) * 10, 0, 100);
    const sentenceVarietyLabel = sentenceVarietyToLabel(sentenceVarietyScoreValue);

    const phraseCounter = new Map<string, number>();
    const tokens = normalizedTerms.filter(term => /^[a-z]+$/i.test(term));
    const bigrams = getNgrams(tokens, 2);
    const trigrams = getNgrams(tokens, 3);
    for (const phrase of [...bigrams, ...trigrams]) {
      phraseCounter.set(phrase, (phraseCounter.get(phrase) || 0) + 1);
    }
    const topPhrases = toSortedPhraseResults(phraseCounter, 6);

    const empty = words < 30;
    let readabilityScore = 0;
    if (!empty) {
      if (readabilityMetrics.fleschReadingEase >= cfg.readabilityMin && readabilityMetrics.fleschReadingEase <= cfg.readabilityMax) readabilityScore = 100;
      else if (readabilityMetrics.fleschReadingEase < cfg.readabilityMin) readabilityScore = clamp(safeDiv(readabilityMetrics.fleschReadingEase, cfg.readabilityMin) * 100, 0, 100);
      else readabilityScore = clamp(100 - safeDiv(readabilityMetrics.fleschReadingEase - cfg.readabilityMax, 100 - cfg.readabilityMax) * 100, 0, 100);
    }
    const readabilityStatus = readabilityScore >= 70 ? 'good' : readabilityScore >= 40 ? 'warn' : 'bad';
    const readabilityTip = readabilityScore >= 70
      ? 'Readability is well-suited for your mode.'
      : readabilityMetrics.fleschReadingEase > cfg.readabilityMax
        ? 'Text is too simple for your mode — add more complexity.'
        : 'Shorten sentences and use simpler vocabulary to improve readability.';

    let sentenceScore = 0;
    if (!empty && sentences > 0) {
      if (avgSentenceWords >= cfg.avgSentMin && avgSentenceWords <= cfg.avgSentMax) sentenceScore = 100;
      else if (avgSentenceWords < cfg.avgSentMin) sentenceScore = clamp(safeDiv(avgSentenceWords, cfg.avgSentMin) * 80, 0, 100);
      else sentenceScore = clamp(100 - safeDiv(avgSentenceWords - cfg.avgSentMax, 15) * 100, 0, 100);
    }
    const sentenceStatus = sentenceScore >= 70 ? 'good' : sentenceScore >= 40 ? 'warn' : 'bad';
    const sentenceTip = sentenceScore >= 70
      ? `Average sentence length (${avgSentenceWords.toFixed(0)} words) is on target.`
      : avgSentenceWords > cfg.avgSentMax
        ? `Sentences average ${avgSentenceWords.toFixed(0)} words — try breaking long ones up.`
        : `Sentences are short (${avgSentenceWords.toFixed(0)} words avg) — aim for ${cfg.avgSentMin}–${cfg.avgSentMax} words.`;

    const vocabScore = empty ? 0 : clamp(ttr * 150, 0, 100);
    const vocabStatus = vocabScore >= 70 ? 'good' : vocabScore >= 40 ? 'warn' : 'bad';
    const vocabTip = vocabScore >= 70
      ? `${ttrLabel} vocabulary diversity (${(ttr * 100).toFixed(0)}% unique).`
      : `Lexical diversity is ${ttrLabel.toLowerCase()} — vary your word choices to reduce repetition.`;

    let passiveScore = 100;
    if (!empty && sentences > 0) {
      passiveScore = clamp(100 - Math.max(0, safeDiv(passiveCount, sentences) * 100 - cfg.passiveMax) * safeDiv(100, 100 - cfg.passiveMax), 0, 100);
    }
    const passiveStatus = passiveScore >= 70 ? 'good' : passiveScore >= 40 ? 'warn' : 'bad';
    const passiveTip = passiveScore >= 70
      ? `Passive voice is within range (${(safeDiv(passiveCount, sentences) * 100).toFixed(0)}% of sentences).`
      : `${(safeDiv(passiveCount, sentences) * 100).toFixed(0)}% passive voice — aim for under ${cfg.passiveMax}%. Rewrite flagged sentences.`;

    let weaselScore = 100;
    if (!empty) {
      weaselScore = clamp(100 - Math.max(0, weaselDensity - cfg.fillerMax) * safeDiv(100, 5 - cfg.fillerMax), 0, 100);
    }
    const weaselStatus = weaselScore >= 70 ? 'good' : weaselScore >= 40 ? 'warn' : 'bad';
    const weaselTip = weaselScore >= 70
      ? 'Weasel word usage is low — good writing discipline.'
      : `${weaselWords.reduce((sum, item) => sum + item.count, 0)} weasel-word hits found (${weaselDensity.toFixed(1)}% of text). Remove weak intensifiers.`;

    const paragraphCount = Math.max(1, paragraphs);
    const avgSentsPerPara = sentences > 0 && words > 0 ? sentences / paragraphCount : 0;
    const paragraphScore = empty ? 0 : avgSentsPerPara <= cfg.paragraphSentMax ? 100 : clamp(100 - ((avgSentsPerPara - cfg.paragraphSentMax) / 5) * 100, 0, 100);
    const paragraphStatus = paragraphScore >= 70 ? 'good' : paragraphScore >= 40 ? 'warn' : 'bad';
    const paragraphTip = paragraphScore >= 70
      ? `Paragraph length looks good (avg ${avgSentsPerPara.toFixed(1)} sentences).`
      : `Paragraphs are long (avg ${avgSentsPerPara.toFixed(1)} sentences) — break them up for readability.`;

    const sentenceVarietyStatus = sentenceVarietyScoreValue >= 70 ? 'good' : sentenceVarietyScoreValue >= 40 ? 'warn' : 'bad';
    const sentenceVarietyTip = sentenceVarietyScoreValue >= 70
      ? 'Sentence rhythm is varied and engaging.'
      : 'Sentence lengths are too uniform — vary them for a more natural rhythm.';

    const toneScore = (() => {
      if (mode !== 'business' && mode !== 'social') {
        return { score: 100, status: 'good' as const, tip: 'Tone consistency is not scored in this mode.' };
      }
      if (sentimentLabel === 'Negative') {
        return { score: 0, status: 'bad' as const, tip: 'Sentiment is negative — revise to keep the tone constructive.' };
      }
      const secondPersonScore = secondPersonRatio >= cfg.secondPersonMin ? 100 : clamp(safeDiv(secondPersonRatio, cfg.secondPersonMin) * 100, 0, 100);
      const sentimentScoreValue = sentimentLabel === 'Neutral' ? 50 : 100;
      const combinedScore = Math.round((sentimentScoreValue + secondPersonScore) / 2);
      const status: ScoreDimension['status'] = combinedScore >= 70 ? 'good' : combinedScore >= 40 ? 'warn' : 'bad';
      return { score: combinedScore, status, tip: secondPersonRatio < cfg.secondPersonMin ? 'Address the reader more directly to strengthen tone consistency.' : 'Tone is constructive and reader-focused.' };
    })();

    const dimensions: ScoreDimension[] = [
      { label: 'Readability', score: Math.round(readabilityScore), weight: 0.23, status: readabilityStatus, tip: readabilityTip },
      { label: 'Sentence Length', score: Math.round(sentenceScore), weight: 0.19, status: sentenceStatus, tip: sentenceTip },
      { label: 'Vocabulary Diversity', score: Math.round(vocabScore), weight: 0.19, status: vocabStatus, tip: vocabTip },
      { label: 'Passive Voice', score: Math.round(passiveScore), weight: 0.14, status: passiveStatus, tip: passiveTip },
      { label: 'Weasel Words', score: Math.round(weaselScore), weight: 0.10, status: weaselStatus, tip: weaselTip },
      { label: 'Paragraph Structure', score: Math.round(paragraphScore), weight: 0.10, status: paragraphStatus, tip: paragraphTip },
      { label: 'Sentence Variety', score: Math.round(sentenceVarietyScoreValue), weight: 0.05, status: sentenceVarietyStatus, tip: sentenceVarietyTip },
    ];

    if (mode === 'business' || mode === 'social') {
      dimensions.push({ label: 'Tone Consistency', score: toneScore.score, weight: 0.05, status: toneScore.status, tip: toneScore.tip });
    }

    const contentScore = empty ? 0 : Math.round(dimensions.reduce((sum, dimension) => sum + dimension.score * dimension.weight, 0));
    const matchingBenchmarks = BENCHMARKS.filter(benchmark => words >= benchmark.min && words <= benchmark.max).map(benchmark => benchmark.label);
    const audience = audienceInfo(readabilityMetrics.fleschKincaidGrade);

    return {
      words,
      sentences,
      paragraphs,
      uniqueWords,
      readability: readabilityMetrics,
      readingTime: readingMinutes,
      speakingTime,
      passiveCount,
      passiveRate: safeDiv(passiveCount, sentences) * 100,
      passiveSamples: sentenceObjects.filter((sentence: SentenceObject) => (sentence.terms ?? []).some((term: { tags?: string[] }) => term.tags?.includes('Passive'))).slice(0, 5).map(sentence => sentence.text ?? ''),
      weaselWords,
      weaselDensity,
      adverbHits: adverbWordHits,
      adverbDensity,
      wordyPhrases,
      cliches,
      weakOpeners,
      ttr,
      ttrLabel,
      repeatedWords,
      posBreakdown,
      sentimentScore,
      sentimentComparative,
      sentimentLabel,
      shortSentences,
      mediumSentences,
      longSentences,
      avgSentenceWords,
      sentenceVarietyScore: sentenceVarietyScoreValue,
      sentenceVarietyLabel,
      topPhrases,
      properNounDensity,
      questionCount,
      exclamationCount,
      firstPersonRatio,
      secondPersonRatio,
      contentScore,
      dimensions,
      scoreLabel: scoreLabel(contentScore),
      matchingBenchmarks,
      audienceLabel: audience.label,
      audienceNote: audience.note,
    };
  }, [text, mode]);
}