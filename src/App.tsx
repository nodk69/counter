import { useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { ThemeProvider } from '@/components/ThemeProvider';
import { useEditorState } from '@/hooks/useEditorState';
import { TextContext } from '@/context/TextContext';
import HreflangTags from '@/components/HreflangTags';
import CanonicalTag from '@/components/CanonicalTag';
import LanguageBanner from '@/components/LanguageBanner';
import ErrorBoundary from '@/components/ErrorBoundary';
import ErrorFallback from '@/components/ErrorFallback';
import {
  TOOL_SLUGS,
  WORDS_TO_PAGES_SLUGS,
  SPEECH_SLUGS,
  SOCIAL_SLUGS,
  LANDING_SLUGS,
  COMPARISON_SLUGS,
} from '@/config/routes';

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

// Pre-wrap page components at module level so their references are stable across renders.
// Calling withErrorBoundary() inline in JSX creates a new component function every render,
// which causes React to unmount/remount the entire subtree — losing textarea focus on mobile.
const SafeHome = withErrorBoundary(Home);
const SafeToolsPage = withErrorBoundary(ToolsPage);
const SafeBlogPage = withErrorBoundary(BlogPage);
const SafeGuidesPage = withErrorBoundary(GuidesPage);
const SafeAboutPage = withErrorBoundary(AboutPage);
const SafeResourcesPage = withErrorBoundary(ResourcesPage);
const SafeContactPage = withErrorBoundary(ContactPage);
const SafePrivacyPage = withErrorBoundary(PrivacyPage);
const SafeTermsPage = withErrorBoundary(TermsPage);
const SafeMetaDescriptionGeneratorPage = withErrorBoundary(MetaDescriptionGeneratorPage);
const SafeNotFound = withErrorBoundary(NotFound);

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
        <Route path="/" component={SafeHome} />

        {/* Tools index */}
        <Route path="/tools" component={SafeToolsPage} />

        {/* Blog */}
        <Route path="/blog" component={SafeBlogPage} />
        <Route path="/blog/:slug">
          {withErrorBoundaryFn((params) => <BlogPostPage slug={params.slug} />)}
        </Route>

        {/* Guides */}
        <Route path="/guides" component={SafeGuidesPage} />
        <Route path="/guides/:slug">
          {withErrorBoundaryFn((params) => <GuideDetailPage slug={params.slug} />)}
        </Route>

        {/* Static pages */}
        <Route path="/about" component={SafeAboutPage} />
        <Route path="/resources" component={SafeResourcesPage} />
        <Route path="/resources/:category">
          {withErrorBoundaryFn((params) => <ResourcesPage category={params.category} />)}
        </Route>
        <Route path="/contact" component={SafeContactPage} />
        <Route path="/privacy" component={SafePrivacyPage} />
        <Route path="/terms" component={SafeTermsPage} />

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
        <Route path="/meta-description-generator" component={SafeMetaDescriptionGeneratorPage} />

        {/* 404 */}
        <Route component={SafeNotFound} />
      </Switch>
    </>
  );
}

function AppContent() {
  const {
    editor, text, setText, htmlContent,
    canUndo, canRedo, undo, redo, reset,
    saveStatus, versions, restoreVersion, clearVersions,
  } = useEditorState();

  const [mode, setMode] = useState<'general' | 'academic' | 'seo' | 'business' | 'social'>('general');

  const contextValue = useMemo(
    () => ({
      text, setText, htmlContent, editor,
      undo, redo, canUndo, canRedo, reset,
      saveStatus, versions, restoreVersion, clearVersions,
      mode, setMode,
    }),
    [text, setText, htmlContent, editor, undo, redo, canUndo, canRedo, reset,
     saveStatus, versions, restoreVersion, clearVersions, mode]
  );

  return (
    <TextContext.Provider value={contextValue}>
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