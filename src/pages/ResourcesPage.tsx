import { useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Download, FileText, CheckSquare, List, BookOpen, Calculator } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TEMPLATES = [
  { icon: '📄', title: 'Blog Post Template', desc: 'Standard structure for SEO-optimized blog posts with H1, intro, body sections, and CTA.', type: 'TXT', free: true },
  { icon: '📄', title: 'SEO Content Brief', desc: 'Complete brief template for assigning SEO content to writers, with keyword targets and requirements.', type: 'TXT', free: true },
  { icon: '📄', title: 'Essay Outline Template', desc: 'Academic essay structure with intro, thesis, body paragraphs, and conclusion framework.', type: 'TXT', free: true },
  { icon: '📄', title: 'Product Description Template', desc: 'Conversion-focused product copy template with features, benefits, and social proof sections.', type: 'TXT', free: true },
  { icon: '📄', title: 'Press Release Template', desc: 'Standard press release format with dateline, lead, boilerplate, and contact information.', type: 'TXT', free: true },
  { icon: '📄', title: 'Email Newsletter Template', desc: 'Subject line formula, preview text, content blocks, and CTA structure for newsletters.', type: 'TXT', free: true },
];

const CHECKLISTS = [
  { icon: '✅', title: 'SEO Optimization Checklist', desc: '50-point checklist covering on-page SEO, meta tags, content structure, and technical requirements.', items: 50 },
  { icon: '✅', title: 'Blog Post Checklist', desc: 'Pre-publish checklist for blog posts: research, structure, readability, images, and SEO.', items: 30 },
  { icon: '✅', title: 'Content Editing Checklist', desc: 'Comprehensive editing checklist covering grammar, style, clarity, and fact-checking.', items: 25 },
  { icon: '✅', title: 'Social Media Post Checklist', desc: 'Platform-specific checklists for Twitter, LinkedIn, Instagram, and Facebook posts.', items: 20 },
];

const CHEATSHEETS = [
  { icon: '📋', title: 'Grammar Cheatsheet', desc: 'Quick reference for the most common grammar rules, punctuation, and style decisions.', color: 'border-blue-200 bg-blue-50 dark:bg-blue-950/40' },
  { icon: '📋', title: 'SEO Keyword Cheatsheet', desc: 'Keyword types, density guidelines, placement rules, and intent mapping reference.', color: 'border-green-200 bg-green-50 dark:bg-green-950/40' },
  { icon: '📋', title: 'Writing Style Guide', desc: 'AP vs Chicago vs APA — quick reference for citation styles and writing conventions.', color: 'border-amber-200 bg-amber-50 dark:bg-amber-950/40' },
  { icon: '📋', title: 'Character Limits Cheatsheet', desc: 'All major platform character limits at a glance — Twitter, Instagram, LinkedIn, and more.', color: 'border-purple-200 bg-purple-50 dark:bg-purple-950/40' },
];

const CALCULATORS = [
  { icon: '🧮', title: 'Blog Post Length Calculator', desc: 'Input your topic type and target keyword to get a recommended word count range.', href: '/tools' },
  { icon: '🧮', title: 'Reading Time Calculator', desc: 'Paste any text or enter a word count to calculate exact reading time at multiple speeds.', href: '/reading-time-calculator' },
  { icon: '🧮', title: 'Speaking Time Calculator', desc: 'Calculate speech duration from word count at normal, slow, and fast speaking rates.', href: '/speaking-time-calculator' },
  { icon: '🧮', title: 'Word Count Converter', desc: 'Convert word counts to pages, paragraphs, reading time, and speaking time instantly.', href: '/1000-words-is-how-many-pages' },
];

function DownloadButton({ label = 'Download Free' }: { label?: string }) {
  return (
    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors font-sans">
      <Download className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

// Define valid category IDs
const VALID_CATEGORIES = ['templates', 'checklists', 'cheatsheets', 'calculators'] as const;
type Category = typeof VALID_CATEGORIES[number];

// ✅ Add props interface
interface ResourcesPageProps {
  category?: string;  // Optional category from route param
}

export default function ResourcesPage({ category }: ResourcesPageProps) {
  const [location] = useLocation();

  // Handle both hash-based navigation (e.g., /resources#templates)
  // and path-based navigation (e.g., /resources/templates)
  useEffect(() => {
    // Determine which category to scroll to
    let targetCategory: string | null = null;

    // 1. Check if category prop was passed from route
    if (category && VALID_CATEGORIES.includes(category as Category)) {
      targetCategory = category;
    }

    // 2. Check for hash in URL (overrides category prop)
    const hash = location.split('#')[1];
    if (hash && VALID_CATEGORIES.includes(hash as Category)) {
      targetCategory = hash;
    }

    // 3. If no hash, check if the path contains a category
    if (!targetCategory) {
      const pathSegments = location.split('/').filter(Boolean);
      const lastSegment = pathSegments[pathSegments.length - 1];
      if (lastSegment && lastSegment !== 'resources' && VALID_CATEGORIES.includes(lastSegment as Category)) {
        targetCategory = lastSegment;
      }
    }

    // Scroll to the target category if found
    if (targetCategory) {
      const element = document.getElementById(targetCategory);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location, category]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <div className="bg-muted/30 border-b border-border py-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-xs font-sans text-muted-foreground mb-2">
              <Link href="/" className="hover:text-primary">Home</Link> › Resources
            </div>
            <h1 className="font-serif text-4xl font-bold text-foreground mb-2">Resources & Discovery Hub</h1>
            <p className="text-muted-foreground font-sans">Everything you need to write better — free templates, checklists, and tools</p>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-6xl py-12 space-y-16">
          {/* Templates */}
          <section id="templates">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10 text-primary"><FileText className="w-5 h-5" /></div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">Free Templates</h2>
                <p className="text-xs text-muted-foreground font-sans">Ready-to-use writing templates — download and start writing</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TEMPLATES.map(t => (
                <div key={t.title} className="p-5 rounded-xl border border-border bg-card flex flex-col">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-xl">{t.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-serif font-semibold text-foreground text-sm mb-1">{t.title}</h3>
                      <p className="text-xs text-muted-foreground font-sans leading-relaxed">{t.desc}</p>
                    </div>
                  </div>
                  <div className="mt-auto pt-3 flex items-center justify-between">
                    <span className="text-xs font-sans px-2 py-0.5 rounded-md bg-muted text-muted-foreground">{t.type}</span>
                    <DownloadButton />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Checklists */}
          <section id="checklists">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400"><CheckSquare className="w-5 h-5" /></div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">Checklists</h2>
                <p className="text-xs text-muted-foreground font-sans">Step-by-step checklists for consistent, high-quality content</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CHECKLISTS.map(c => (
                <div key={c.title} className="p-5 rounded-xl border border-border bg-card flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-xl">{c.icon}</span>
                    <div>
                      <h3 className="font-serif font-semibold text-foreground text-sm mb-1">{c.title}</h3>
                      <p className="text-xs text-muted-foreground font-sans leading-relaxed mb-2">{c.desc}</p>
                      <span className="text-xs font-sans text-muted-foreground">{c.items} items</span>
                    </div>
                  </div>
                  <DownloadButton label="Get PDF" />
                </div>
              ))}
            </div>
          </section>

          {/* Cheatsheets */}
          <section id="cheatsheets">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400"><List className="w-5 h-5" /></div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">Cheatsheets</h2>
                <p className="text-xs text-muted-foreground font-sans">Quick reference guides for writers, editors, and SEO pros</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CHEATSHEETS.map(c => (
                <div key={c.title} className={`p-5 rounded-xl border-2 ${c.color} flex items-start justify-between gap-4`}>
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-xl">{c.icon}</span>
                    <div>
                      <h3 className="font-serif font-semibold text-foreground text-sm mb-1">{c.title}</h3>
                      <p className="text-xs text-muted-foreground font-sans leading-relaxed">{c.desc}</p>
                    </div>
                  </div>
                  <DownloadButton />
                </div>
              ))}
            </div>
          </section>

          {/* Calculators */}
          <section id="calculators">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400"><Calculator className="w-5 h-5" /></div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">Interactive Calculators</h2>
                <p className="text-xs text-muted-foreground font-sans">Tools that calculate writing metrics on demand</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CALCULATORS.map(c => (
                <Link key={c.title} href={c.href}>
                  <div className="group p-5 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{c.icon}</span>
                      <div>
                        <h3 className="font-serif font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{c.title}</h3>
                        <p className="text-xs text-muted-foreground font-sans leading-relaxed">{c.desc}</p>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-primary font-medium font-sans opacity-0 group-hover:opacity-100 transition-opacity">
                      Open calculator →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Guides CTA */}
          <section className="py-8 px-8 rounded-2xl bg-primary/5 border border-primary/20 text-center">
            <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-4"><BookOpen className="w-6 h-6" /></div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Looking for Detailed Guides?</h2>
            <p className="text-muted-foreground font-sans text-sm mb-5 max-w-md mx-auto">
              Our in-depth guides walk you through SEO writing, readability optimization, keyword research, and more.
            </p>
            <Link href="/guides"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors font-sans">
              Browse All Guides →
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}