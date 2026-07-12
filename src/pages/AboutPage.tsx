import { Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MetaTags from '@/components/MetaTags';
import { Shield, Users, Zap, Heart, BookOpen, Target } from 'lucide-react';

const VALUES = [
  { 
    icon: <Shield className="w-5 h-5" />, 
    title: 'Privacy First', 
    desc: 'No data stored. All processing happens locally in your browser. Your words stay yours — always.' 
  },
  { 
    icon: <Users className="w-5 h-5" />, 
    title: 'Built for Writers', 
    desc: 'Every tool is designed by writers, for writers. Clean, fast, and distraction-free.' 
  },
  { 
    icon: <Zap className="w-5 h-5" />, 
    title: 'Always Improving', 
    desc: 'We ship updates regularly based on real user feedback and actual writing needs.' 
  },
  { 
    icon: <Heart className="w-5 h-5" />, 
    title: 'Community Driven', 
    desc: 'Open to suggestions, feature requests, and collaboration. This project grows with you.' 
  },
];

const TIMELINE = [
  { year: '2025', event: 'Idea born from frustration with bloated, privacy-invasive writing tools' },
  { year: '2026', event: 'Official launch of counter.io with a clean word counter and essential writing tools' },
  { year: '2026', event: 'Roadmap: Readability checker, keyword density, speaking time, and more' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MetaTags
        title="About counter.io — Free Writing Tools for Everyone"
        description="counter.io builds free, private writing tools for writers, students, and SEO professionals. No accounts, no data collection, no ads."
      />
      <Header />

      <main className="flex-1">
        {/* Hero - Left Aligned */}
        <div className="bg-muted/30 border-b border-border py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="max-w-2xl">
              <div className="text-xs font-sans text-muted-foreground mb-3">
                <Link href="/" className="hover:text-primary">Home</Link> › About
              </div>

              <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                About counter
              </h1>

              <p className="text-muted-foreground font-sans text-xl leading-relaxed">
                We believe great writing deserves great tools. Built by writers, for writers — with privacy and simplicity at the core.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-4xl py-16">
          {/* Story */}
          <div className="mb-16">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Our Story</h2>
            <div className="prose prose-sm max-w-none text-foreground/80 font-sans space-y-4">
              <p className="text-base leading-relaxed">
                counter.io started as a personal frustration. Every word counter I tried was full of ads, required sign-ups, or sent my text to unknown servers — a privacy risk I wasn’t willing to take.
              </p>
              <p className="text-base leading-relaxed">
                So I decided to build something better: a clean, fast, and truly private writing toolkit that works instantly in your browser. No accounts. No tracking. No nonsense.
              </p>
              <p className="text-base leading-relaxed">
                What began as a simple word counter is now growing into a full suite of tools for writers, students, bloggers, and SEO professionals. Every new feature comes from real writing needs.
              </p>
            </div>
          </div>

          {/* Mission Cards */}
          <div className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-border bg-card">
              <div className="text-primary mb-3"><BookOpen className="w-8 h-8" /></div>
              <h3 className="font-serif font-semibold text-xl mb-2">For Writers</h3>
              <p className="text-muted-foreground">Clear word & character counts, readability scores, and tone analysis — without the clutter.</p>
            </div>
            <div className="p-6 rounded-2xl border border-border bg-card">
              <div className="text-primary mb-3"><Target className="w-8 h-8" /></div>
              <h3 className="font-serif font-semibold text-xl mb-2">For SEO</h3>
              <p className="text-muted-foreground">Keyword density, meta title checkers, and content optimization tools coming soon.</p>
            </div>
            <div className="p-6 rounded-2xl border border-border bg-card">
              <div className="text-primary mb-3"><Zap className="w-8 h-8" /></div>
              <h3 className="font-serif font-semibold text-xl mb-2">For Everyone</h3>
              <p className="text-muted-foreground">Free forever. No login required. Your data never leaves your device.</p>
            </div>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-6">Our Values</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {VALUES.map(v => (
                <div key={v.title} className="p-6 rounded-xl border border-border bg-card">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-primary">{v.icon}</div>
                    <h3 className="font-serif font-semibold text-foreground text-lg">{v.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Journey */}
          <div className="mb-16">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-6">Our Journey</h2>
            <div className="space-y-0">
              {TIMELINE.map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-mono text-xs font-bold flex-shrink-0">
                      {item.year.slice(2)}
                    </div>
                    {i < TIMELINE.length - 1 && (
                      <div className="w-0.5 flex-1 bg-border my-1" style={{ minHeight: 32 }} />
                    )}
                  </div>
                  <div className="pb-8 pt-2">
                    <div className="font-sans text-xs font-semibold text-primary mb-1">{item.year}</div>
                    <p className="font-sans text-sm text-foreground/80">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center py-8">
            <Link 
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors font-sans mr-3"
            >
              Get in Touch
            </Link>
            <Link 
              href="/privacy"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-card text-foreground font-medium text-sm hover:border-primary/40 transition-colors font-sans"
            >
              View Privacy Policy
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}