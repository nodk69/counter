import { useEffect } from 'react';
import { Link } from 'wouter';
import Header from '@/components/Header';
import MetaTags from '@/components/MetaTags';
import SchemaMarkup from '@/components/SchemaMarkup';
import Editor from '@/components/editor/Editor';
import { StatsPanel } from '@/components/stats';
import ToolsSection from '@/components/ToolsSection';
import Footer from '@/components/Footer';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { getToolBySlug, getRelatedTools } from '@/data/tools';
import { useTextContext } from '@/context/TextContext';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';
import ErrorFallback from '@/components/ErrorFallback';

function FAQAccordion({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
      {faqs.map((faq, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full text-left px-5 py-4 flex items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
          >
            <span className="font-medium text-foreground font-sans text-sm">{faq.q}</span>
            <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
          </button>
          {open === i && (
            <div className="px-5 pb-4 bg-muted/20">
              <p className="text-muted-foreground font-sans text-sm leading-relaxed">{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function ToolPage({ slug }: { slug: string }) {
  const tool = getToolBySlug(slug);
  const relatedTools = getRelatedTools(slug);
  const { reset } = useTextContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!tool) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold mb-2">Tool Not Found</h1>
            <Link href="/tools" className="text-primary hover:underline font-sans text-sm">
              ← Back to all tools
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const CONVERSIONS = [
    { words: 100, pages: 0.2 },
    { words: 500, pages: 1 },
    { words: 1000, pages: 2 },
    { words: 1500, pages: 3 },
    { words: 2000, pages: 4 },
    { words: 3000, pages: 6 },
    { words: 5000, pages: 10 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MetaTags
        title={`${tool.name} — Free Online Tool`}
        description={tool.description}
      />
      <SchemaMarkup
        type="tool"
        data={{
          name: tool.name,
          description: tool.description,
          slug: tool.slug,
          faqItems: (tool.faqs || []).map(f => ({ question: f.q, answer: f.a })),
        }}
      />
      <Header />
      <main className="flex-1">
        {/* Minimal hero with breadcrumb */}
        <div className="container mx-auto px-4 max-w-6xl pt-6 pb-2">
          {/* Breadcrumb - Left aligned */}
          <div className="mb-3">
            <Breadcrumb>
              <BreadcrumbList className="text-xs">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/tools">Tools</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{tool.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Title - Centered */}
          <div className="text-center">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              {tool.name}
            </h1>
            <p className="text-sm text-muted-foreground font-sans mt-1 max-w-xl mx-auto">
              {tool.shortDesc}
            </p>
          </div>
        </div>

        {/* Editor */}
        <div className="container mx-auto px-4 max-w-6xl py-6">
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 h-[65vh] min-h-[460px]">
              <ErrorBoundary
                fallback={({ error, resetError }) => (
                  <ErrorFallback
                    error={error}
                    resetError={resetError}
                    title="Editor Error"
                    description="An error occurred in the editor. Please try again or reload the page if the problem persists."
                  />
                )}
              >
                <Editor />
              </ErrorBoundary>
            </div>
            <div className="lg:col-span-4 h-[65vh] min-h-[460px] overflow-hidden">
              <ErrorBoundary
                fallback={({ error, resetError }) => (
                  <ErrorFallback
                    error={error}
                    resetError={resetError}
                    title="Statistics Error"
                    description="An error occurred while loading statistics. Please try again or reload the page if the problem persists."
                  />
                )}
              >
                <StatsPanel />
              </ErrorBoundary>
            </div>
          </div>
          <div className="mt-2">
            <ToolsSection />
          </div>
        </div>

        {/* Try example + About section */}
        <div className="container mx-auto px-4 max-w-4xl pb-12">
          {/* Example text */}
          {tool.exampleText && (
            <div className="mb-10 p-5 rounded-xl border border-dashed border-border bg-muted/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-sans text-sm font-semibold text-foreground">
                  Try with example text
                </h3>
                <button
                  onClick={() => reset(tool.exampleText)}
                  className="text-xs px-3 py-1.5 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors font-sans"
                >
                  Load example
                </button>
              </div>
              <p className="text-sm text-muted-foreground font-sans italic leading-relaxed line-clamp-2">
                {tool.exampleText}
              </p>
            </div>
          )}

          {/* About this tool */}
          <div className="mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
              About This Tool
            </h2>
            <div className="prose prose-sm max-w-none text-foreground/80 font-sans space-y-4">
              <p className="text-base leading-relaxed">{tool.description}</p>
              <h3 className="font-serif text-xl font-semibold text-foreground">
                Who is this tool for?
              </h3>
              <ul className="space-y-2">
                {tool.uses.map((use) => (
                  <li key={use} className="flex items-center gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {use}
                  </li>
                ))}
              </ul>
              <h3 className="font-serif text-xl font-semibold text-foreground">
                How to use the {tool.name}
              </h3>
              <p>
                Simply paste or type your text into the editor above. The {tool.name.toLowerCase()} will automatically
                calculate all statistics in real time — no need to click any buttons. All processing happens locally in
                your browser, so your text is never sent to any server.
              </p>
            </div>
          </div>

          {/* Popular conversions */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
              Popular Word Count Conversions
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CONVERSIONS.map((c) => (
                <Link key={c.words} href={`/${c.words}-words-is-how-many-pages`}>
                  <div className="p-3 rounded-lg border border-border bg-card hover:border-primary/40 text-center text-sm font-sans hover:bg-muted/30 transition-all cursor-pointer">
                    <div className="font-mono font-bold text-foreground">
                      {c.words.toLocaleString()} words
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {'≈ ' + (c.pages === 0.2 ? '⅕' : c.pages) + ' page' + (c.pages !== 1 ? 's' : '')}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Related tools */}
          {relatedTools.length > 0 && (
            <div className="mb-12">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                Related Tools
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedTools.map((related) => (
                  <Link key={related.slug} href={`/${related.slug}`}>
                    <div className="group flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer">
                      <span className="text-2xl">{related.icon}</span>
                      <div>
                        <div className="font-serif font-semibold text-foreground group-hover:text-primary transition-colors">
                          {related.name}
                        </div>
                        <div className="text-xs text-muted-foreground font-sans">
                          {related.shortDesc}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* FAQ */}
          <div>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <FAQAccordion faqs={tool.faqs} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}