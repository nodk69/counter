import { useEffect } from 'react';
import { Link } from 'wouter';
import { Mic } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MetaTags from '@/components/MetaTags';
import SchemaMarkup from '@/components/SchemaMarkup';
import { SPEECH_TIMES } from '@/data/seoData';

const SPEECH_MAP: Record<string, typeof SPEECH_TIMES[0]> = {
  '5-minute-speech-word-count': { minutes: 5, words: 650, wpm: 130, description: 'short talk, elevator pitch, or toast' },
  '10-minute-speech-word-count': { minutes: 10, words: 1300, wpm: 130, description: 'conference talk, class presentation, or team update' },
  '15-minute-speech-word-count': { minutes: 15, words: 1950, wpm: 130, description: 'keynote segment, TED-style talk, or departmental presentation' },
  '20-minute-speech-word-count': { minutes: 20, words: 2600, wpm: 130, description: 'detailed presentation or university lecture segment' },
  '30-minute-speech-word-count': { minutes: 30, words: 3900, wpm: 130, description: 'full conference session or workshop module' },
  '45-minute-speech-word-count': { minutes: 45, words: 5850, wpm: 130, description: 'extended keynote, university class, or workshop' },
  '60-minute-speech-word-count': { minutes: 60, words: 7800, wpm: 130, description: 'full lecture, seminar, or extended presentation' },
  '90-minute-speech-word-count': { minutes: 90, words: 11700, wpm: 130, description: 'half-day workshop segment or long-form keynote' },
};

const SPEAKING_RATES = [
  { rate: 100, label: 'Slow (deliberate)' },
  { rate: 120, label: 'Conversational' },
  { rate: 130, label: 'Standard (presentation)' },
  { rate: 150, label: 'Fast (animated)' },
  { rate: 180, label: 'Very fast' },
];

export default function SpeechWordCountPage({ slug }: { slug: string }) {
  const data = SPEECH_MAP[slug];

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold mb-2">Page Not Found</h1>
            <Link href="/" className="text-primary hover:underline text-sm font-sans">← Home</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { minutes, words, description } = data;
  const pageTitle = `${minutes}-Minute Speech Word Count — How Many Words?`;
  const pageDesc = `A ${minutes}-minute speech needs approximately ${words.toLocaleString()} words at 130 WPM. See word counts at different speaking rates with tips for ${description}.`;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MetaTags
        title={pageTitle}
        description={pageDesc}
      />
      <SchemaMarkup
        type="page"
        data={{
          name: `${minutes}-Minute Speech Word Count`,
          description: pageDesc,
          slug,
        }}
      />
      <Header />
      <main className="flex-1">
        <div className="bg-muted/30 border-b border-border py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-xs font-sans text-muted-foreground mb-3 flex items-center gap-1.5">
              <Link href="/" className="hover:text-primary">Home</Link>
              <span>›</span>
              <span>{minutes}-Minute Speech Word Count</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary"><Mic className="w-6 h-6" /></div>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
                {minutes}-Minute Speech Word Count
              </h1>
            </div>
            <p className="text-muted-foreground font-sans text-lg">
              How many words do you need for a {minutes}-minute speech? The complete guide for {description}.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-4xl py-12">
          {/* Answer */}
          <div className="mb-12 p-8 rounded-2xl border-2 border-primary/30 bg-primary/5 text-center">
            <p className="text-muted-foreground font-sans mb-2">A {minutes}-minute speech requires approximately</p>
            <div className="font-mono text-6xl font-bold text-primary mb-2">
              {words.toLocaleString()}
            </div>
            <p className="text-muted-foreground font-sans">words at 130 words per minute (standard presentation pace)</p>
          </div>

          {/* Rate table */}
          <div className="mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Word Count by Speaking Rate</h2>
            <p className="text-muted-foreground font-sans mb-5">
              Speaking pace varies. Here's how many words you need at different speeds:
            </p>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm font-sans">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Speaking Pace</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">WPM</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Words for {minutes} min</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {SPEAKING_RATES.map(r => (
                    <tr key={r.rate} className={`hover:bg-muted/20 transition-colors ${r.rate === 130 ? 'bg-primary/5' : ''}`}>
                      <td className="py-3 px-4 text-foreground">
                        {r.label}
                        {r.rate === 130 && <span className="ml-2 text-xs text-primary font-medium">(recommended)</span>}
                      </td>
                      <td className="py-3 px-4 text-right text-muted-foreground font-mono">{r.rate}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-foreground">
                        {(r.rate * minutes).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tips */}
          <div className="mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Tips for a {minutes}-Minute Speech</h2>
            <div className="space-y-3">
              {[
                { title: 'Practice out loud', desc: 'Reading silently underestimates speaking time. Always practice with your actual voice at your natural pace.' },
                { title: 'Add 10% buffer', desc: `Aim for ${Math.round(words * 0.9).toLocaleString()} words to account for pauses, audience reactions, and natural pacing variations.` },
                { title: 'Know your pace', desc: 'Record yourself speaking for 2 minutes and count the words. This gives you your personal WPM for accurate planning.' },
                { title: 'Slow down for emphasis', desc: 'Important points should be delivered at 80-100 WPM. Budget extra words for sections you\'ll rush through and fewer for key moments.' },
                { title: 'Use our Speaking Time Calculator', desc: `Paste your script into our tool to get the exact speaking time for your specific text.` },
              ].map(tip => (
                <div key={tip.title} className="flex gap-3 p-4 rounded-xl border border-border bg-card">
                  <span className="text-primary font-bold font-sans text-lg leading-none flex-shrink-0">→</span>
                  <div>
                    <div className="font-sans font-semibold text-foreground text-sm">{tip.title}</div>
                    <div className="text-xs text-muted-foreground font-sans">{tip.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mb-12 p-6 rounded-xl bg-muted/30 border border-border text-center">
            <h3 className="font-serif text-xl font-bold text-foreground mb-2">Calculate Your Script's Speaking Time</h3>
            <p className="text-muted-foreground font-sans text-sm mb-4">
              Paste your speech into our free Speaking Time Calculator to know exactly how long it will take.
            </p>
            <Link href="/speaking-time-calculator"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors font-sans">
              Open Speaking Time Calculator →
            </Link>
          </div>

          {/* Related speech times */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Other Speech Durations</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SPEECH_TIMES.filter(s => s.minutes !== minutes).map(s => (
                <Link key={s.minutes} href={`/${s.minutes}-minute-speech-word-count`}>
                  <div className="p-3 rounded-lg border border-border bg-card hover:border-primary/40 text-center cursor-pointer transition-all hover:bg-muted/30">
                    <div className="font-mono font-bold text-foreground">{s.minutes} min</div>
                    <div className="text-xs text-muted-foreground font-sans">~{s.words.toLocaleString()} words</div>
                  </div>
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
