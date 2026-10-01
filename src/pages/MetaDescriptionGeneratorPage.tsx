import { useState } from 'react';
import { Copy, Check, RefreshCw, ChevronRight, Search, Lightbulb, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'wouter';

interface MetaResult {
  text: string;
  charCount: number;
  score: number;
  badge: string;
  type: string;
}

const AUDIENCES = ['general readers', 'students', 'bloggers', 'professionals', 'writers', 'SEO specialists'];
const TONES     = ['informational', 'conversational', 'persuasive', 'professional'];

function scoreDesc(desc: string, keyword: string): number {
  let s = 0;
  const d   = desc.toLowerCase();
  const kw  = keyword.toLowerCase();
  const len = desc.length;

  // Length: sweet spot 150-160
  if (len >= 150 && len <= 160) s += 40;
  else if (len >= 140 && len < 150) s += 30;
  else if (len >= 120 && len < 140) s += 20;
  else if (len > 160 && len <= 170) s += 25;
  else s += 10;

  // Keyword present
  if (d.includes(kw)) s += 25;

  // CTA words
  const ctas = ['free', 'try', 'start', 'get', 'learn', 'discover', 'instant', 'now', 'today', 'no signup'];
  if (ctas.some(c => d.includes(c))) s += 20;

  // Emotional / power words
  const power = ['accurate', 'trusted', 'instant', 'easy', 'simple', 'powerful', 'proven', 'best', 'professional'];
  if (power.some(p => d.includes(p))) s += 15;

  return Math.min(100, s);
}

function badge(score: number): string {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Weak';
}

function clamp(text: string, max = 160): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + '…';
}

function generate(keyword: string, topic: string, audience: string, tone: string): MetaResult[] {
  const kw  = keyword.trim() || 'word counter';
  const tp  = topic.trim()   || `use our free ${kw} tool for accurate results`;
  const aud = audience       || 'writers and professionals';

  const variants: { text: string; type: string }[] = [
    {
      type: 'Direct value',
      text: clamp(`${kw.charAt(0).toUpperCase() + kw.slice(1)} — ${tp}. Free, instant, and accurate. No signup required.`),
    },
    {
      type: 'Question hook',
      text: clamp(`Looking for a reliable ${kw}? ${tp}. Trusted by 50,000+ ${aud}. Try it free today.`),
    },
    {
      type: 'How-to',
      text: clamp(`How to get accurate ${kw} results: ${tp}. Works perfectly for ${aud}.`),
    },
    {
      type: 'Benefit-first',
      text: clamp(`Get instant ${kw} results with zero hassle. ${tp.charAt(0).toUpperCase() + tp.slice(1)}. 100% free — start now.`),
    },
    {
      type: 'Social proof',
      text: clamp(`Trusted by 50,000+ ${aud}. Our free ${kw} tool helps you ${tp}. No registration, no limits.`),
    },
  ];

  // Adjust tone
  if (tone === 'professional') {
    variants.push({
      type: 'Professional',
      text: clamp(`Professional-grade ${kw} for ${aud}. ${tp}. Accurate, private, and completely free.`),
    });
  }
  if (tone === 'persuasive') {
    variants.push({
      type: 'Persuasive',
      text: clamp(`Stop guessing — use our ${kw} to ${tp}. Join 50,000+ ${aud} who trust counter.io.`),
    });
  }

  return variants.slice(0, 5).map(v => {
    const sc = scoreDesc(v.text, kw);
    return { text: v.text, charCount: v.text.length, score: sc, badge: badge(sc), type: v.type };
  });
}

function charClass(count: number): string {
  if (count >= 150 && count <= 160) return 'text-green-600 dark:text-green-400';
  if (count >= 120 && count < 150)  return 'text-amber-600 dark:text-amber-400';
  if (count > 160)                  return 'text-red-600 dark:text-red-400';
  return 'text-muted-foreground';
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1 px-3 py-1.5 rounded border border-border hover:bg-muted text-xs font-medium text-foreground transition-colors flex-shrink-0"
    >
      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

const FAQ_ITEMS = [
  { q: 'How long should a meta description be?', a: 'Google displays between 150–160 characters. Keep your meta description within this range to avoid truncation in search results.' },
  { q: 'Does the meta description affect SEO ranking?', a: 'Meta descriptions are not a direct ranking factor, but they significantly affect click-through rate (CTR), which does influence organic rankings indirectly.' },
  { q: 'Should I include the target keyword in my meta description?', a: 'Yes. When users search for your keyword, Google bolds matching words in the search snippet, making your result stand out and increasing CTR.' },
  { q: 'What makes a great meta description?', a: 'The best meta descriptions include the target keyword, clearly state the benefit, contain a call-to-action ("try free", "learn more"), and stay within 150–160 characters.' },
  { q: 'Can I use the same meta description for multiple pages?', a: 'No — duplicate meta descriptions are bad for SEO. Each page should have a unique description that accurately reflects its specific content.' },
];

export default function MetaDescriptionGeneratorPage() {
  const [keyword,  setKeyword]  = useState('');
  const [topic,    setTopic]    = useState('');
  const [audience, setAudience] = useState('general readers');
  const [tone,     setTone]     = useState('informational');
  const [results,  setResults]  = useState<MetaResult[]>([]);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    if (!keyword.trim()) return;
    setResults(generate(keyword, topic, audience, tone));
    setGenerated(true);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 max-w-4xl py-10">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground font-sans mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/tools" className="hover:text-foreground transition-colors">Tools</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground">Meta Description Generator</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Search className="w-6 h-6" strokeWidth={2} />
              </div>
              <h1 className="text-3xl font-bold text-foreground font-sans">
                Meta Description Generator
              </h1>
            </div>
            <p className="text-muted-foreground font-sans text-lg leading-relaxed max-w-2xl">
              Generate 5 optimized meta descriptions for any page. Each variant is scored for keyword usage, length, and click-through potential.
            </p>
          </div>

          {/* Generator form */}
          <div className="bg-card border border-border rounded-xl p-6 mb-8 space-y-5">

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-foreground font-sans mb-1.5">
                  Focus Keyword <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  placeholder="e.g. word counter, SEO writing tool, readability checker"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-sans text-sm"
                  onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-foreground font-sans mb-1.5">
                  Page Topic / Main Benefit
                  <span className="text-xs font-normal text-muted-foreground ml-1">(optional — improves results)</span>
                </label>
                <textarea
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="e.g. count words, characters, and sentences in real time — perfect for writers, students, and SEO professionals"
                  rows={2}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-sans text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground font-sans mb-1.5">Target Audience</label>
                <select
                  value={audience}
                  onChange={e => setAudience(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-sans text-sm"
                >
                  {AUDIENCES.map(a => <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground font-sans mb-1.5">Tone</label>
                <select
                  value={tone}
                  onChange={e => setTone(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-sans text-sm"
                >
                  {TONES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleGenerate}
                disabled={!keyword.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 font-sans font-medium text-sm transition-colors"
              >
                {generated ? <RefreshCw className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                {generated ? 'Regenerate' : 'Generate Meta Descriptions'}
              </button>
            </div>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-3 mb-10">
              <h2 className="text-lg font-bold text-foreground font-sans">Generated Descriptions</h2>
              {results.map((r, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-muted-foreground font-sans uppercase tracking-wide">{r.type}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        r.badge === 'Excellent' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        r.badge === 'Good'      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        r.badge === 'Fair'      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                                  'bg-muted text-muted-foreground'
                      }`}>{r.badge}</span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`text-xs font-mono font-bold ${charClass(r.charCount)}`}>
                        {r.charCount}/160
                      </span>
                      <CopyButton text={r.text} />
                    </div>
                  </div>
                  <p className="text-sm text-foreground font-sans leading-relaxed">{r.text}</p>
                  {/* Score bar */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${r.score >= 85 ? 'bg-green-500' : r.score >= 70 ? 'bg-blue-500' : r.score >= 50 ? 'bg-amber-500' : 'bg-muted-foreground'}`}
                        style={{ width: `${r.score}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">{r.score}/100</span>
                  </div>
                </div>
              ))}

              <p className="text-xs text-muted-foreground font-sans mt-1 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span><strong>Tip:</strong> Choose the variant closest to 160 chars with your keyword in the first half.</span>
              </p>
            </div>
          )}

          {/* About this tool */}
          <div className="mb-10 p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                  About Meta Description Generator
                </h2>
                <span className="text-xs font-sans text-muted-foreground uppercase tracking-wider font-semibold">
                  SEO Utility · Real-Time Scoring · 100% Free
                </span>
              </div>
            </div>

            <p className="text-base text-foreground/80 font-sans leading-relaxed mb-6">
              Search engines display up to 160 characters in search results. Our Meta Description Generator creates 5 high-converting, character-counted variants scored for focus keyword density, power words, and click-through appeal.
            </p>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-sans mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Perfect for
              </h3>
              <div className="flex flex-wrap gap-2">
                {['SEO Specialists', 'Content Marketers', 'Bloggers & Publishers', 'E-commerce Stores', 'Agency Copywriters'].map((use) => (
                  <span
                    key={use}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/60 text-foreground font-sans text-xs font-medium border border-border/50 hover:border-primary/30 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {use}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Structured Step-by-Step Guide */}
          <section className="my-10" aria-labelledby="meta-gen-guide-heading">
            <div className="mb-6">
              <h2 id="meta-gen-guide-heading" className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-1">
                How to Generate High-CTR Meta Descriptions
              </h2>
              <p className="text-sm text-muted-foreground font-sans">
                Follow these 4 steps to maximize your organic search click-through rate.
              </p>
            </div>

            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6" aria-label="Step-by-step generator guide">
              {[
                { title: '1. Enter Focus Keyword', desc: 'Input the primary target keyword you want to rank for on Google.' },
                { title: '2. Add Page Benefit / Topic', desc: 'Provide a brief summary of the value your page delivers to searchers.' },
                { title: '3. Select Tone & Audience', desc: 'Customize the voice from informational to persuasive or professional.' },
                { title: '4. Pick the 150–160 Sweet Spot', desc: 'Choose the variant closest to 155 characters and copy with one click.' },
              ].map((step, idx) => (
                <li
                  key={step.title}
                  className="p-5 rounded-xl border border-border bg-card hover:border-primary/30 transition-all duration-200 shadow-xs"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <h3 className="font-sans text-sm sm:text-base font-semibold text-foreground">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed">
                    {step.desc}
                  </p>
                </li>
              ))}
            </ol>

            {/* Best practices & Common Mistakes Callouts */}
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-sans">
                  <CheckCircle2 className="w-4 h-4" /> Best Practices
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground font-sans">
                  <li>• Keep descriptions strictly between <strong className="text-foreground">150–160 characters</strong></li>
                  <li>• Place your <strong className="text-foreground">focus keyword</strong> in the first 80 characters</li>
                  <li>• Include an active <strong className="text-foreground">call to action</strong> (e.g. "Try free", "Learn how")</li>
                  <li>• Ensure every page across your website has a <strong className="text-foreground">unique</strong> snippet</li>
                </ul>
              </div>

              <div className="p-5 rounded-xl border border-red-500/20 bg-red-500/5 dark:bg-red-500/10">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-1.5 text-red-600 dark:text-red-400 font-sans">
                  <XCircle className="w-4 h-4" /> Common Mistakes
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground font-sans">
                  <li>• Exceeding 160 characters (causes mobile SERP truncation & ellipses)</li>
                  <li>• Keyword stuffing (reduces reader trust and lowers CTR)</li>
                  <li>• Using duplicate meta descriptions across multiple URLs</li>
                  <li>• Generic boilerplate copy ("Welcome to our official website")</li>
                </ul>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <div className="mb-10">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {FAQ_ITEMS.map((f, i) => (
                <div key={i} className="border border-border rounded-xl p-4 bg-card">
                  <h3 className="font-semibold text-foreground font-sans text-sm mb-1">{f.q}</h3>
                  <p className="text-sm text-muted-foreground font-sans leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related tools */}
          <div className="mb-8">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Related Writing & SEO Tools</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { href: '/keyword-density-checker',  label: 'Keyword Density' },
                { href: '/readability-checker',       label: 'Readability Checker' },
                { href: '/character-counter',         label: 'Character Counter' },
                { href: '/word-counter',              label: 'Word Counter' },
                { href: '/seo-title-tag-limit',       label: 'SEO Title Tag Limit' },
                { href: '/twitter-character-limit',   label: 'Twitter Char Limit' },
                { href: '/reading-time-calculator',   label: 'Reading Time' },
                { href: '/speaking-time-calculator',  label: 'Speaking Time' },
              ].map(t => (
                <Link key={t.href} href={t.href} className="p-3 border border-border rounded-xl text-center text-xs font-sans font-medium text-foreground bg-card hover:border-primary/40 hover:bg-muted/30 transition-colors">
                  {t.label} →
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
