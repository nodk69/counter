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
      <MetaTags
        title="Free Word Counter Online — Count Words, Characters & More"
        description="Free online word counter with 20+ writing tools. Count words, characters, sentences in real time. Readability analysis, content scoring, and PDF export. No signup needed."
      />
      <SchemaMarkup type="home" />
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <div className="container mx-auto px-4 max-w-6xl">
          <HeroSection />
        </div>

        {/* Editor + Stats - Fixed height issues */}
        <div id="editor" className="container mx-auto px-4 max-w-6xl pb-12">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Editor - takes full height */}
            <div className="lg:col-span-8 h-[68vh] min-h-[480px]">
              <ErrorBoundary fallback={({ error, resetError }) => <ErrorFallback
                  error={error}
                  resetError={resetError}
                  title="Editor Error"
                  description="An error occurred in the editor. Please try again or reload the page if the problem persists."
                />}>
                <Editor />
              </ErrorBoundary>
            </div>
            {/* Stats - matches editor height but allows scroll */}
            <div className="lg:col-span-4 h-[68vh] min-h-[480px] overflow-hidden">
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

        {/* Social Media Limits */}
        <Suspense fallback={<SectionSkeleton minHeight="min-h-[380px]" />}>
          <SocialMediaLimits />
        </Suspense>

        {/* Tool Categories */}
        <div className="container mx-auto px-4 max-w-6xl">
          <Suspense fallback={<SectionSkeleton minHeight="min-h-[420px]" />}>
            <ToolCategories />
          </Suspense>
        </div>

        {/* Featured Tools */}
        <Suspense fallback={<SectionSkeleton minHeight="min-h-[480px]" />}>
          <FeaturedTools />
        </Suspense>

        {/* Why Counter */}
        <Suspense fallback={<SectionSkeleton minHeight="min-h-[380px]" />}>
          <WhyCounter />
        </Suspense>

        {/* Blog */}
        <Suspense fallback={<SectionSkeleton minHeight="min-h-[440px]" />}>
          <BlogSection />
        </Suspense>

        {/* Testimonials */}
        {/* <Testimonials /> */}

        {/* People Also Ask */}
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