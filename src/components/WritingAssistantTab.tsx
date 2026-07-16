import { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import {
  useContentAnalysis,
  WritingMode,
  MODE_CONFIGS,
  BENCHMARKS,
  type ContentAnalysis,
} from '@/hooks/useContentAnalysis';
import { useTextContext } from '@/context/TextContext';
import { useTextStats, type TextStats } from '@/hooks/useTextStats';
import ToolRecommendations from '@/components/ToolRecommendations';

// ─── Score ring ──────────────────────────────────────────────────────────────

function ScoreRing({ score, label }: { score: number; label: string }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 85 ? '#22c55e' : score >= 70 ? '#3b82f6' : score >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col items-center">
      <svg width="120" height="120" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/40" />
        <circle
          cx="50" cy="50" r={r} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
        <text x="50" y="46" textAnchor="middle" fontSize="22" fontWeight="700" fontFamily="monospace" fill={color}>{score}</text>
        <text x="50" y="60" textAnchor="middle" fontSize="9" fill="currentColor" className="text-muted-foreground">/100</text>
      </svg>
      <div className="font-sans text-sm font-semibold" style={{ color }}>{label}</div>
      <div className="text-xs text-muted-foreground font-sans mt-0.5">Content Score</div>
    </div>
  );
}

// ─── Status icon ─────────────────────────────────────────────────────────────

function StatusIcon({ status }: { status: 'good' | 'warn' | 'bad' }) {
  if (status === 'good') return <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" aria-hidden="true" />;
  if (status === 'warn') return <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" aria-hidden="true" />;
  return <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" aria-hidden="true" />;
}

// ─── Collapsible section ──────────────────────────────────────────────────────

function Section({ title, badge, children, defaultOpen = false }: {
  title: string; badge?: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        // aria-expanded lets screen readers announce whether the section
        // is currently open — without it, a collapsible region built out
        // of a plain <button>/<div> pair reads identically in either
        // state, which is a real accessibility gap for anyone not
        // looking at the chevron icon.
        aria-expanded={open}
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-sans font-medium text-sm text-foreground">{title}</span>
          {badge}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" aria-hidden="true" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" aria-hidden="true" />}
      </button>
      {open && <div className="p-4 bg-card">{children}</div>}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

interface Props {
  mode: WritingMode;
  setMode: (m: WritingMode) => void;
  // Optional precomputed values. When a parent (e.g. ToolsSection) has
  // already run useTextStats/useContentAnalysis for the same text and
  // mode, passing them in here avoids re-running the full content-scan
  // (filler words, passive voice, tokenization) a second time on every
  // keystroke. If omitted, this component computes them itself so it
  // still works as a fully standalone drop-in, exactly as before.
  stats?: TextStats;
  analysis?: ContentAnalysis;
}

export default function WritingAssistantTab({ mode, setMode, stats: statsProp, analysis: analysisProp }: Props) {
  const { text } = useTextContext();
  const computedStats = useTextStats(statsProp ? '' : text);
  const stats = statsProp ?? computedStats;
  const computedAnalysis = useContentAnalysis(
    analysisProp ? '' : text,
    stats.fleschKincaid,
    stats.words,
    stats.sentences,
    stats.uniqueWords,
    mode
  );
  const analysis = analysisProp ?? computedAnalysis;

  const empty = stats.words < 30;

  return (
    <div className="space-y-5 h-full overflow-y-auto custom-scrollbar pr-2">
      {/* Mode selector + Score */}
      <div className="flex flex-col sm:flex-row items-center gap-5">
        <ScoreRing score={analysis.contentScore} label={analysis.scoreLabel} />

        <div className="flex-1 w-full space-y-3">
          {/* Mode selector */}
          <div>
            <div className="text-xs font-medium text-muted-foreground font-sans mb-1.5 uppercase tracking-wider">Writing Mode</div>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Writing mode">
              {(Object.keys(MODE_CONFIGS) as WritingMode[]).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  aria-pressed={mode === m}
                  className={`px-3 py-1 rounded-full text-xs font-medium font-sans transition-colors ${
                    mode === m ? 'bg-primary text-white' : 'border border-border bg-transparent text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  }`}
                >
                  {MODE_CONFIGS[m].label}
                </button>
              ))}
            </div>
          </div>

          {/* Dimension summary */}
          <div className="space-y-1.5">
            {analysis.dimensions.map(d => (
              <div key={d.label} className="flex items-center gap-2">
                <StatusIcon status={d.status} />
                <span className="text-xs font-sans text-foreground/80 flex-1">{d.label}</span>
                <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      d.status === 'good' ? 'bg-green-500' : d.status === 'warn' ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${d.score}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-muted-foreground w-7 text-right">{d.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {empty && (
        <div className="text-center py-3 text-sm text-muted-foreground font-sans bg-muted/20 rounded-xl border border-border">
          Type at least 30 words to see a full content analysis.
        </div>
      )}

      {/* Dimension tips */}
      {!empty && (
        <Section title="Insights & Tips" defaultOpen>
          <div className="space-y-2">
            {analysis.dimensions.map(d => (
              <div key={d.label} className="flex gap-2.5">
                <StatusIcon status={d.status} />
                <div>
                  <span className="text-xs font-semibold text-foreground font-sans">{d.label}: </span>
                  <span className="text-xs text-muted-foreground font-sans">{d.tip}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Filler words */}
      <Section
        title="Filler Words"
        badge={
          analysis.fillerWords.length > 0
            ? <span className="text-xs px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-sans">{analysis.fillerWords.reduce((s, f) => s + f.count, 0)} found</span>
            : <span className="text-xs px-1.5 py-0.5 rounded-md bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 font-sans">None</span>
        }
      >
        {analysis.fillerWords.length === 0 ? (
          <p className="text-xs text-muted-foreground font-sans">No filler words found. Great writing discipline!</p>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-sans mb-3">
              These words weaken your writing. Cut or replace them where possible.
            </p>
            <div className="flex flex-wrap gap-2">
              {analysis.fillerWords.map(f => (
                <span key={f.word} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-xs font-sans">
                  <span className="font-medium text-foreground">"{f.word}"</span>
                  <span className="text-amber-600 dark:text-amber-400 font-mono">×{f.count}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* Passive voice */}
      <Section
        title="Passive Voice"
        badge={
          analysis.passiveRate > (MODE_CONFIGS[mode].passiveMax)
            ? <span className="text-xs px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-sans">{analysis.passiveCount} detected</span>
            : <span className="text-xs px-1.5 py-0.5 rounded-md bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 font-sans">{analysis.passiveRate.toFixed(0)}%</span>
        }
      >
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${analysis.passiveRate > MODE_CONFIGS[mode].passiveMax ? 'bg-amber-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min(100, analysis.passiveRate)}%` }}
              />
            </div>
            <span className="text-xs font-mono text-muted-foreground">{analysis.passiveRate.toFixed(0)}% of sentences</span>
          </div>
          <p className="text-xs text-muted-foreground font-sans">
            Target: under {MODE_CONFIGS[mode].passiveMax}% for {MODE_CONFIGS[mode].label} writing.
          </p>
          {analysis.passiveSamples.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-xs font-medium text-foreground font-sans">Examples:</div>
              {analysis.passiveSamples.map((s, i) => (
                <div key={i} className="text-xs font-sans text-muted-foreground pl-3 border-l-2 border-amber-300 dark:border-amber-700 italic">
                  "{s}"
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Vocabulary diversity */}
      <Section
        title="Vocabulary Diversity"
        badge={
          <span className={`text-xs px-1.5 py-0.5 rounded-md font-sans ${
            analysis.ttrLabel === 'Excellent' ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400' :
            analysis.ttrLabel === 'Good'      ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400' :
            analysis.ttrLabel === 'Fair'      ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' :
                                                'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400'
          }`}>{analysis.ttrLabel}</span>
        }
      >
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2 rounded-lg bg-muted/40">
              <div className="font-mono text-lg font-bold text-foreground">{stats.uniqueWords.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground font-sans">Unique words</div>
            </div>
            <div className="p-2 rounded-lg bg-muted/40">
              <div className="font-mono text-lg font-bold text-foreground">{stats.words.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground font-sans">Total words</div>
            </div>
            <div className="p-2 rounded-lg bg-muted/40">
              <div className="font-mono text-lg font-bold text-primary">{(analysis.ttr * 100).toFixed(0)}%</div>
              <div className="text-xs text-muted-foreground font-sans">Diversity</div>
            </div>
          </div>
          {analysis.repeatedWords.length > 0 && (
            <div>
              <div className="text-xs font-medium text-foreground font-sans mb-1.5">Most repeated words:</div>
              <div className="flex flex-wrap gap-1.5">
                {analysis.repeatedWords.map(w => (
                  <span key={w.word} className="px-2 py-0.5 rounded-md bg-muted text-xs font-sans text-foreground/80">
                    {w.word} <span className="font-mono text-muted-foreground">×{w.count}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Sentence length distribution */}
      <Section title="Sentence Length Distribution">
        <div className="space-y-3">
          {[
            { label: 'Short (< 10 words)',    count: analysis.shortSentences,  color: 'bg-green-500' },
            { label: 'Medium (10–20 words)',  count: analysis.mediumSentences, color: 'bg-blue-500' },
            { label: 'Long (> 20 words)',     count: analysis.longSentences,   color: 'bg-amber-500' },
          ].map(row => {
            const total = Math.max(1, stats.sentences);
            const pct = (row.count / total) * 100;
            return (
              <div key={row.label} className="flex items-center gap-3">
                <div className="w-32 text-xs font-sans text-muted-foreground flex-shrink-0">{row.label}</div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${row.color} transition-all`} style={{ width: `${pct}%` }} />
                </div>
                <div className="text-xs font-mono text-muted-foreground w-6 text-right">{row.count}</div>
              </div>
            );
          })}
          <p className="text-xs text-muted-foreground font-sans pt-1">
            Average sentence: <strong className="text-foreground">{analysis.avgSentenceWords.toFixed(1)} words</strong>.
            Aim for a mix of short, medium, and long sentences for natural rhythm.
          </p>
        </div>
      </Section>

      {/* Reading audience */}
      {!empty && (
        <Section title="Reading Audience">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-lg" aria-hidden="true">🎯</span>
              <div>
                <div className="font-sans font-semibold text-sm text-foreground">{analysis.audienceLabel}</div>
                <div className="text-xs text-muted-foreground font-sans">{analysis.audienceNote}</div>
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* Word count benchmarks */}
      {stats.words > 0 && (
        <Section title="Word Count Benchmarks">
          {analysis.matchingBenchmarks.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-sans mb-2">
                Your <strong className="text-foreground">{stats.words.toLocaleString()} words</strong> fits these content types:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.matchingBenchmarks.map(b => (
                  <span key={b} className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-sans font-medium border border-primary/20">
                    ✓ {b}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-sans">Common benchmarks to aim for:</p>
              <div className="space-y-1">
                {BENCHMARKS.slice(0, 5).map(b => (
                  <div key={b.label} className="flex items-center justify-between text-xs font-sans">
                    <span className="text-foreground/80">{b.label}</span>
                    <span className="text-muted-foreground font-mono">{b.min.toLocaleString()}–{b.max.toLocaleString()} words</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Section>
      )}

      {/* Tool Recommendations */}
      <ToolRecommendations analysis={analysis} stats={stats} mode={mode} />
    </div>
  );
}