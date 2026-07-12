import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { ThemeProvider } from '@/components/ThemeProvider';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { TextContext } from '@/context/TextContext';
import HreflangTags from '@/components/HreflangTags';
import CanonicalTag from '@/components/CanonicalTag';
import LanguageBanner from '@/components/LanguageBanner';
import ErrorBoundary from '@/components/ErrorBoundary';
import ErrorFallback from '@/components/ErrorFallback';

// Pages
import Home from '@/pages/Home';
import NotFound from '@/pages/not-found';
import ToolsPage from '@/pages/ToolsPage';
import ToolPage from '@/pages/ToolPage';
import BlogPage from '@/pages/BlogPage';
import BlogPostPage from '@/pages/BlogPostPage';
import GuidesPage from '@/pages/GuidesPage';
import GuideDetailPage from '@/pages/GuideDetailPage';
import AboutPage from '@/pages/AboutPage';
import ResourcesPage from '@/pages/ResourcesPage';
import ContactPage from '@/pages/ContactPage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';
import WordsToPagesPage from '@/pages/WordsToPagesPage';
import SpeechWordCountPage from '@/pages/SpeechWordCountPage';
import SocialMediaLimitPage from '@/pages/SocialMediaLimitPage';
import LandingPage from '@/pages/LandingPage';
import ComparisonPage from '@/pages/ComparisonPage';
import MetaDescriptionGeneratorPage from '@/pages/MetaDescriptionGeneratorPage';

const queryClient = new QueryClient();

// All 20 tool slugs
const TOOL_SLUGS = [
  'word-counter', 'character-counter', 'sentence-counter', 'paragraph-counter',
  'readability-checker', 'keyword-density-checker', 'syllable-counter',
  'reading-time-calculator', 'speaking-time-calculator', 'unique-word-counter',
  'line-counter', 'page-counter', 'letter-counter', 'word-frequency-counter',
  'character-frequency-counter', 'sentence-length-analyzer', 'paragraph-length-analyzer',
  'complexity-analyzer', 'word-density-analyzer', 'text-summarizer',
];

// Programmatic: words-to-pages slugs
const WORDS_TO_PAGES_SLUGS = [
  '100-words-is-how-many-pages', '250-words-is-how-many-pages',
  '500-words-is-how-many-pages', '750-words-is-how-many-pages',
  '1000-words-is-how-many-pages', '1500-words-is-how-many-pages',
  '2000-words-is-how-many-pages', '2500-words-is-how-many-pages',
  '3000-words-is-how-many-pages', '4000-words-is-how-many-pages',
  '5000-words-is-how-many-pages', '7500-words-is-how-many-pages',
  '10000-words-is-how-many-pages',
];

// Speech time slugs
const SPEECH_SLUGS = [
  '5-minute-speech-word-count', '10-minute-speech-word-count',
  '15-minute-speech-word-count', '20-minute-speech-word-count',
  '30-minute-speech-word-count', '45-minute-speech-word-count',
  '60-minute-speech-word-count', '90-minute-speech-word-count',
];

// Social media limit slugs
const SOCIAL_SLUGS = [
  'twitter-character-limit', 'instagram-character-limit', 'facebook-character-limit',
  'linkedin-character-limit', 'youtube-description-limit', 'tiktok-character-limit',
  'meta-description-limit', 'seo-title-tag-limit',
];

// Audience landing page slugs
const LANDING_SLUGS = [
  'word-counter-for-students', 'word-counter-for-essay', 'word-counter-for-book-writing',
  'word-counter-for-seo', 'word-counter-for-bloggers', 'word-counter-for-writers',
  'word-counter-for-copywriters', 'word-counter-for-social-media',
  'word-counter-for-academics', 'word-counter-for-professionals',
];

// Comparison slugs
const COMPARISON_SLUGS = [
  'word-counter-vs-character-counter', 'reading-time-vs-speaking-time',
  'flesch-score-vs-fk-grade', 'word-counter-vs-sentence-counter',
  'paragraph-counter-vs-line-counter',
];

/**
 * Wraps a component with an error boundary for graceful error handling.
 * @param Component The component to wrap
 * @returns A function that returns the wrapped component (suitable for wouter's component prop)
 */
const withErrorBoundary = (Component: React.ComponentType<any>) => {
  return () => (
    <ErrorBoundary fallback={({ error, resetError }) => <ErrorFallback
        error={error}
        resetError={resetError}
        title="Page Error"
        description="Something went wrong while loading this page. Please try going back to the homepage."
      />}>
      <Component />
    </ErrorBoundary>
  );
};

/**
 * Wraps a function component (that returns JSX) with an error boundary.
 * @param ComponentFn A function that returns JSX
 * @returns A function that returns the wrapped component (suitable for wouter's component prop)
 */
const withErrorBoundaryFn = (ComponentFn: (props: any) => JSX.Element) => {
  return (props: any) => (
    <ErrorBoundary fallback={({ error, resetError }) => <ErrorFallback
        error={error}
        resetError={resetError}
        title="Page Error"
        description="Something went wrong while loading this page. Please try going back to the homepage."
      />}>
      {ComponentFn(props)}
    </ErrorBoundary>
  );
};

function GlobalMeta() {
  const [location] = useLocation();
  return (
    <>
      <CanonicalTag path={location} />
      <HreflangTags path={location} />
      <LanguageBanner />
    </>
  );
}

function Router() {
  return (
    <>
      <GlobalMeta />
      <Switch>
        {/* Home */}
        <Route path="/" component={withErrorBoundary(Home)} />

        {/* Tools index */}
        <Route path="/tools" component={withErrorBoundary(ToolsPage)} />

        {/* Blog */}
        <Route path="/blog" component={withErrorBoundary(BlogPage)} />
        <Route path="/blog/:slug">
          {withErrorBoundaryFn(({ params }) => <BlogPostPage slug={params.slug} />)}
        </Route>

        {/* Guides */}
        <Route path="/guides" component={withErrorBoundary(GuidesPage)} />
        <Route path="/guides/:slug">
          {withErrorBoundaryFn(({ params }) => <GuideDetailPage slug={params.slug} />)}
        </Route>

        {/* Static pages */}
        <Route path="/about" component={withErrorBoundary(AboutPage)} />
        <Route path="/resources" component={withErrorBoundary(ResourcesPage)} />
        <Route path="/resources/:category">
          {withErrorBoundaryFn(({ params }) => <ResourcesPage category={params.category} />)}
        </Route>
        <Route path="/contact" component={withErrorBoundary(ContactPage)} />
        <Route path="/privacy" component={withErrorBoundary(PrivacyPage)} />
        <Route path="/terms" component={withErrorBoundary(TermsPage)} />

        {/* Tool pages (20 individual routes) */}
        {TOOL_SLUGS.map(slug => (
          <Route key={slug} path={`/${slug}`}>
            {withErrorBoundaryFn(({}) => <ToolPage slug={slug} />)}
          </Route>
        ))}

        {/* Words-to-pages programmatic pages */}
        {WORDS_TO_PAGES_SLUGS.map(slug => (
          <Route key={slug} path={`/${slug}`}>
            {withErrorBoundaryFn(({}) => <WordsToPagesPage slug={slug} />)}
          </Route>
        ))}

        {/* Speech word count pages */}
        {SPEECH_SLUGS.map(slug => (
          <Route key={slug} path={`/${slug}`}>
            {withErrorBoundaryFn(({}) => <SpeechWordCountPage slug={slug} />)}
          </Route>
        ))}

        {/* Social media limit pages */}
        {SOCIAL_SLUGS.map(slug => (
          <Route key={slug} path={`/${slug}`}>
            {withErrorBoundaryFn(({}) => <SocialMediaLimitPage slug={slug} />)}
          </Route>
        ))}

        {/* Audience landing pages */}
        {LANDING_SLUGS.map(slug => (
          <Route key={slug} path={`/${slug}`}>
            {withErrorBoundaryFn(({}) => <LandingPage slug={slug} />)}
          </Route>
        ))}

        {/* Comparison pages */}
        {COMPARISON_SLUGS.map(slug => (
          <Route key={slug} path={`/${slug}`}>
            {withErrorBoundaryFn(({}) => <ComparisonPage slug={slug} />)}
          </Route>
        ))}

        {/* Special tools */}
        <Route path="/meta-description-generator" component={withErrorBoundary(MetaDescriptionGeneratorPage)} />

        {/* 404 */}
        <Route component={withErrorBoundary(NotFound)} />
      </Switch>
    </>
  );
}

function AppContent() {
  const { text, setText, undo, redo, canUndo, canRedo, reset } = useUndoRedo('');

  return (
    <TextContext.Provider value={{ text, setText, undo, redo, canUndo, canRedo, reset }}>
      <TooltipProvider delayDuration={300}>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </TextContext.Provider>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="counter-theme">
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary fallback={({ error, resetError }) => <ErrorFallback
            error={error}
            resetError={resetError}
            title="Application Error"
            description="An unexpected error occurred in the application. Please try again or contact support if the problem persists."
          />}>
          <AppContent />
        </ErrorBoundary>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;