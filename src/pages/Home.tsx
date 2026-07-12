import MetaTags from '@/components/MetaTags';
import Header from '@/components/Header';
import Editor from '@/components/Editor';
import { StatsPanel } from '@/components/stats';
import ToolsSection from '@/components/ToolsSection';
import SchemaMarkup from '@/components/SchemaMarkup';
import WritingStreak from '@/components/WritingStreak';
import HeroSection from '@/components/sections/HeroSection';
import SocialMediaLimits from '@/components/sections/SocialMediaLimits';
import ToolCategories from '@/components/sections/ToolCategories';
import FeaturedTools from '@/components/sections/FeaturedTools';
import WhyCounter from '@/components/sections/WhyCounter';
import BlogSection from '@/components/sections/BlogSection';
// import Testimonials from '@/components/sections/Testimonials';
import PeopleAlsoAsk from '@/components/sections/PeopleAlsoAsk';
import WordCountConversions from '@/components/sections/WordCountConversions';
import NewsletterSignup from '@/components/sections/NewsletterSignup';
import FAQ from '@/components/sections/FAQ';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';
import ErrorFallback from '@/components/ErrorFallback';

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
        <SocialMediaLimits />

        {/* Tool Categories */}
        <div className="container mx-auto px-4 max-w-6xl">
          <ToolCategories />
        </div>

        {/* Featured Tools */}
        <FeaturedTools />

        {/* Why Counter */}
        <WhyCounter />

        {/* Blog */}
        <BlogSection />

        {/* Testimonials */}
        {/* <Testimonials /> */}

        {/* People Also Ask */}
        <PeopleAlsoAsk />

        {/* Word Count Conversions */}
        <WordCountConversions />

        {/* Newsletter */}
        <NewsletterSignup />

        {/* FAQ */}
        <div className="container mx-auto px-4 max-w-6xl">
          <FAQ />
        </div>
      </main>

      <Footer />
    </div>
  );
}