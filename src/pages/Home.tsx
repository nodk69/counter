import { lazy, Suspense } from 'react';
import MetaTags from '@/components/MetaTags';
import Header from '@/components/Header';
import Editor from '@/components/editor/Editor';
import { StatsPanel } from '@/components/stats';
import ToolsSection from '@/components/ToolsSection';
import SchemaMarkup from '@/components/SchemaMarkup';
import WritingStreak from '@/components/WritingStreak';
import HeroSection from '@/components/sections/HeroSection';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';
import ErrorFallback from '@/components/ErrorFallback';

// Lazy-load below-the-fold homepage sections to optimize initial load bundle size
const SocialMediaLimits = lazy(() => import('@/components/sections/SocialMediaLimits'));
const ToolCategories = lazy(() => import('@/components/sections/ToolCategories'));
const FeaturedTools = lazy(() => import('@/components/sections/FeaturedTools'));
const WhyCounter = lazy(() => import('@/components/sections/WhyCounter'));
const BlogSection = lazy(() => import('@/components/sections/BlogSection'));
const PeopleAlsoAsk = lazy(() => import('@/components/sections/PeopleAlsoAsk'));
const WordCountConversions = lazy(() => import('@/components/sections/WordCountConversions'));
const NewsletterSignup = lazy(() => import('@/components/sections/NewsletterSignup'));
const FAQ = lazy(() => import('@/components/sections/FAQ'));
function SectionSkeleton({ minHeight }: { minHeight: string }) {
  return (
    <div className={`w-full ${minHeight} my-6 flex flex-col justify-center items-center p-8 bg-card/40 rounded-xl border border-border/30 animate-pulse`}>
      <div className="h-6 w-48 bg-muted/30 rounded mb-4" />
      <div className="h-4 w-72 bg-muted/20 rounded" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground transition-colors duration-200">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2.5 focus:bg-primary focus:text-white focus:shadow-lg focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md font-sans text-sm font-medium"
      >
        Skip to content
      </a>

      <MetaTags
        title="Free Word Counter Online — Count Words, Characters & More"
        description="Free online word counter with 20+ real-time writing tools. Count words, characters, and sentences instantly — plus readability analysis and PDF export."
      />
      <SchemaMarkup type="home" />
      <Header />

      <main id="main-content" className="flex-1">
        {/* Hero */}
        <div className="container mx-auto px-4 max-w-6xl">
          <HeroSection />
        </div>

        {/* Editor + Stats - Responsive layout */}
        <div id="editor" className="container mx-auto px-4 max-w-6xl pb-12">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Editor - responsive height */}
            <div className="lg:col-span-8 h-[500px] lg:h-[68vh] lg:min-h-[480px]">
              <ErrorBoundary fallback={({ error, resetError }) => <ErrorFallback
                  error={error}
                  resetError={resetError}
                  title="Editor Error"
                  description="An error occurred in the editor. Please try again or reload the page if the problem persists."
                />}>
                <Editor />
              </ErrorBoundary>
            </div>
            {/* Stats - auto height on mobile, fixed scrollable on desktop */}
            <div className="lg:col-span-4 h-auto lg:h-[68vh] lg:min-h-[480px] overflow-hidden">
              <ErrorBoundary fallback={({ error, resetError }) => <ErrorFallback
                  error={error}
                  resetError={resetError}
                  title="Statistics Error"
                  description="An error occurred while loading statistics. Please try again or reload the page if the problem persists."
                />}>
                <StatsPanel />
              </ErrorBoundary>
            </div>
          </div>

          {/* Streak badge */}
          <div className="flex justify-end mt-2 mb-1">
            <WritingStreak />
          </div>

          {/* Tools tabs */}
          <div className="mt-2">
            <ToolsSection />
          </div>
        </div>

        {/* Why Counter - Trust & Differentiators */}
        <Suspense fallback={<SectionSkeleton minHeight="min-h-[380px]" />}>
          <WhyCounter />
        </Suspense>

        {/* Tool Categories - Comprehensive Directory */}
        <div className="container mx-auto px-4 max-w-6xl">
          <Suspense fallback={<SectionSkeleton minHeight="min-h-[420px]" />}>
            <ToolCategories />
          </Suspense>
        </div>

        {/* Social Media Limits - Platform Cheat Sheet */}
        <Suspense fallback={<SectionSkeleton minHeight="min-h-[380px]" />}>
          <SocialMediaLimits />
        </Suspense>

        {/* Blog - Editorial & Guides */}
        <Suspense fallback={<SectionSkeleton minHeight="min-h-[440px]" />}>
          <BlogSection />
        </Suspense>

        {/* People Also Ask - Search Intent Accordion */}
        <Suspense fallback={<SectionSkeleton minHeight="min-h-[400px]" />}>
          <PeopleAlsoAsk />
        </Suspense>

        {/* Word Count Conversions */}
        <Suspense fallback={<SectionSkeleton minHeight="min-h-[320px]" />}>
          <WordCountConversions />
        </Suspense>

        {/* Newsletter */}
        <Suspense fallback={<SectionSkeleton minHeight="min-h-[260px]" />}>
          <NewsletterSignup />
        </Suspense>

        {/* FAQ */}
        <div className="container mx-auto px-4 max-w-6xl">
          <Suspense fallback={<SectionSkeleton minHeight="min-h-[500px]" />}>
            <FAQ />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}