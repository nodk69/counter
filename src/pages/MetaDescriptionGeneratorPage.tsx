import { useState } from 'react';
import { Copy, Check, RefreshCw, ChevronRight } from 'lucide-react';
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
            <h1 className="text-3xl font-bold text-foreground mb-3 font-sans">
              🔍 Meta Description Generator
            </h1>
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
                {generated ? <RefreshCw className="w-4 h-4" /> : '✦'}
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

              <p className="text-xs text-muted-foreground font-sans mt-1">
                💡 <strong>Tip:</strong> Choose the variant closest to 160 chars with your keyword in the first half.
              </p>
            </div>
          )}

          {/* Guide */}
          <div className="bg-muted/30 border border-border rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-foreground font-sans mb-4">How to Write the Perfect Meta Description</h2>
            <div className="grid sm:grid-cols-2 gap-6 text-sm text-foreground font-sans">
              <div>
                <h3 className="font-semibold mb-2">✅ Best Practices</h3>
                <ul className="space-y-1.5 text-muted-foreground">
                  <li>• Keep it between <strong className="text-foreground">150–160 characters</strong></li>
                  <li>• Include your <strong className="text-foreground">focus keyword</strong> naturally</li>
                  <li>• Add a <strong className="text-foreground">call-to-action</strong> (try free, learn more)</li>
                  <li>• Match the <strong className="text-foreground">search intent</strong> of the page</li>
                  <li>• Make every page description <strong className="text-foreground">unique</strong></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">❌ Common Mistakes</h3>
                <ul className="space-y-1.5 text-muted-foreground">
                  <li>• Going over 160 chars (gets cut off)</li>
                  <li>• Keyword stuffing</li>
                  <li>• Duplicate descriptions across pages</li>
                  <li>• Generic descriptions ("Welcome to our site")</li>
                  <li>• Leaving meta descriptions blank</li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-foreground font-sans mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {FAQ_ITEMS.map((f, i) => (
                <div key={i} className="border border-border rounded-xl p-4">
                  <h3 className="font-semibold text-foreground font-sans text-sm mb-1">{f.q}</h3>
                  <p className="text-sm text-muted-foreground font-sans leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related tools */}
          <div>
            <h2 className="text-lg font-bold text-foreground font-sans mb-3">Related Tools</h2>
            <div className="flex flex-wrap gap-2">
              {[
                { href: '/keyword-density-checker',  label: 'Keyword Density Checker' },
                { href: '/readability-checker',       label: 'Readability Checker' },
                { href: '/character-counter',         label: 'Character Counter' },
                { href: '/word-counter',              label: 'Word Counter' },
                { href: '/seo-title-tag-limit',       label: 'SEO Title Tag Limit' },
              ].map(t => (
                <Link key={t.href} href={t.href} className="px-3 py-1.5 border border-border rounded-lg text-sm font-sans text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
                  {t.label}
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
