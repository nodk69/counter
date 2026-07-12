import { useState } from 'react';
import { Link } from 'wouter';
import { ChevronDown } from 'lucide-react';

const PAA_ITEMS = [
  {
    question: 'How many words is a 5-minute speech?',
    answer: 'A 5-minute speech contains approximately 650-700 words at a clear speaking pace of 130 words per minute. At a slightly faster conversational pace (150 WPM), it would be about 750 words.',
    link: '/5-minute-speech-word-count',
  },
  {
    question: 'How many pages is 1,000 words?',
    answer: '1,000 words is approximately 2 pages when double-spaced (500 words/page) or 1 page when single-spaced at standard formatting (12pt Times New Roman, 1-inch margins).',
    link: '/1000-words-is-how-many-pages',
  },
  {
    question: 'What is a good readability score?',
    answer: 'For general web content and blogs, aim for a Flesch Reading Ease score of 60-70 (labeled "Standard" or "Easy to Read"). Academic journals typically score 30-50. For mass-market content, aim for 70-80.',
    link: '/readability-checker',
  },
  {
    question: 'How many characters fit in a tweet?',
    answer: 'Standard Twitter/X accounts can post up to 280 characters per tweet. Twitter Blue (X Premium) subscribers can post up to 25,000 characters in a single post.',
    link: '/twitter-character-limit',
  },
  {
    question: 'How long should a blog post be?',
    answer: 'For SEO purposes, 1,500-2,500 words is the sweet spot for most competitive keywords. Shorter 800-1,200 word posts work for narrow topics. Comprehensive pillar content should be 3,000-5,000+ words.',
    link: '/blog/perfect-blog-post-length',
  },
  {
    question: "What's the ideal SEO title length?",
    answer: 'Google typically displays 50-60 characters of title tags in search results. Aim for 50-60 characters to avoid truncation. Mobile search results can show slightly more (up to 78 characters).',
    link: '/seo-title-tag-limit',
  },
  {
    question: 'How many words can I write in an hour?',
    answer: 'The average writer produces 500-1,000 words per hour when drafting (not editing). Fast typists with pre-planned content can reach 1,500-2,000 words per hour. Editing and research reduce this significantly.',
    link: '/blog/writing-goals-productivity',
  },
  {
    question: "What's the average reading speed?",
    answer: 'The average adult reads approximately 200-250 words per minute for general non-technical content. College-level readers average 300 WPM. Technical content slows most readers to 100-150 WPM.',
    link: '/reading-time-calculator',
  },
];

export default function PeopleAlsoAsk() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-16 bg-card border-y border-border">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🔍</span>
          <h2 className="font-serif text-3xl font-bold text-foreground">People Also Ask</h2>
        </div>
        <p className="text-muted-foreground font-sans text-sm mb-8">Common questions about word counting & writing</p>

        <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
          {PAA_ITEMS.map((item, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
              >
                <span className="font-medium text-foreground font-sans text-sm">{item.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
                    open === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {open === i && (
                <div className="px-5 pb-4 bg-muted/20">
                  <p className="text-muted-foreground font-sans text-sm leading-relaxed mb-2">
                    {item.answer}
                  </p>
                  {item.link && (
                    <Link href={item.link} className="text-xs text-primary hover:underline font-sans">
                      Learn more →
                    </Link>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
