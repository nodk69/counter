export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorTitle: string;
  date: string;
  readTime: number;
  category: string;
  tags: string[];
  featured?: boolean;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'how-to-write-seo-content-that-ranks',
    title: 'How to Write SEO Content That Actually Ranks in 2026',
    excerpt: 'A complete guide to creating content that ranks on Google, drives organic traffic, and converts readers into customers. Learn keyword research, structure, readability, and internal linking.',
    author: 'Sarah Mitchell',
    authorTitle: 'SEO Strategist & Content Writer',
    date: 'July 2, 2026',
    readTime: 8,
    category: 'SEO',
    tags: ['SEO', 'Content Writing', 'Keyword Research'],
    featured: true,
    content: `
## What Makes Content Rank in 2026?

Google's algorithm has evolved dramatically. Today, ranking content must satisfy three pillars: **search intent**, **content depth**, and **user experience signals**.

### 1. Match Search Intent Precisely

Before writing a single word, understand why people search for your keyword. Are they looking to learn (informational), buy (transactional), or navigate to a specific site (navigational)?

Use our [Word Counter](/word-counter) to track your content length as you write — most top-ranking pages for competitive informational keywords contain 1,500-2,500 words.

### 2. Structure for Skimmers and Readers

The reality of online reading: 79% of users scan, only 16% read word for word. Your job is to satisfy both groups.

- Use H2 and H3 headings that answer questions
- Keep paragraphs to 2-4 sentences for web
- Use bullet points and numbered lists liberally
- Bold key phrases (but not more than 5% of text)

### 3. Readability Is a Ranking Factor

Google measures user engagement. If readers bounce because your content is hard to understand, rankings fall. Aim for a Flesch Reading Ease score of 60-70 for general audiences. Use our [Readability Checker](/readability-checker) to measure this instantly.

### 4. Internal Linking Builds Topic Authority

Link generously between related content. Each link passes authority and helps Google understand your site structure. A solid internal linking strategy can dramatically improve rankings without any external backlinks.

### Conclusion

SEO content success in 2026 comes down to serving the reader first, then the algorithm. Write thoroughly, format clearly, and check your metrics with the right tools.
    `,
  },
  {
    slug: '10-common-grammar-mistakes',
    title: '10 Common Grammar Mistakes That Make You Look Unprofessional',
    excerpt: 'Even experienced writers make these grammar errors. Learn the 10 most common mistakes and how to fix them to make your writing more polished and professional.',
    author: 'James Okonkwo',
    authorTitle: 'Copy Editor & Writing Coach',
    date: 'June 25, 2026',
    readTime: 6,
    category: 'Writing',
    tags: ['Grammar', 'Writing Tips', 'Editing'],
    content: `
## The Grammar Mistakes That Undermine Your Credibility

Grammatical errors in professional writing can erode reader trust faster than almost any other factor. Here are the 10 most common mistakes — and how to fix them.

### 1. Its vs. It's
"Its" is possessive (the cat licked its paw). "It's" is a contraction of "it is" (it's raining outside). Test: replace with "it is" — if it makes sense, use "it's."

### 2. Your vs. You're
"Your" shows possession. "You're" means "you are." The apostrophe matters.

### 3. Then vs. Than
"Then" refers to time (first this, then that). "Than" makes comparisons (better than before).

### 4. Passive Voice Overuse
Passive: "The report was written by the team." Active: "The team wrote the report." Active voice is clearer and more engaging. Check your writing with our [Readability Checker](/readability-checker).

### 5. Comma Splices
Joining two independent clauses with just a comma is wrong. Use a period, semicolon, or coordinating conjunction (and, but, so).

### 6. Dangling Modifiers
Wrong: "Walking to the store, the rain started." The rain wasn't walking. Write: "Walking to the store, I got caught in the rain."

### 7. Subject-Verb Disagreement
"The team are playing" (British) vs. "The team is playing" (American). Pick a style and be consistent.

### 8. Apostrophes in Plurals
Plurals don't need apostrophes. "The 1990s" not "the 1990's." Apostrophes show possession or contractions, not plurals.

### 9. Run-On Sentences
Long sentences aren't wrong — unconnected clauses are. Use punctuation correctly or break into two sentences.

### 10. Affect vs. Effect
"Affect" is usually a verb (the weather affects mood). "Effect" is usually a noun (the effect was immediate). Memory trick: Affect = Action, Effect = End result.
    `,
  },
  {
    slug: 'the-science-of-readability',
    title: 'The Science of Readability: Why Some Writing Is Impossible to Put Down',
    excerpt: 'Discover the cognitive science behind readable writing. Learn how sentence length, word choice, and structure affect how your brain processes text.',
    author: 'Dr. Priya Mehta',
    authorTitle: 'Cognitive Linguist & Content Researcher',
    date: 'June 18, 2026',
    readTime: 7,
    category: 'Writing',
    tags: ['Readability', 'Cognitive Science', 'Writing Psychology'],
    content: `
## Why Your Brain Loves (or Hates) Certain Writing

Readable writing isn't just aesthetically pleasing — it's neurologically effortless. When we read, our brains make hundreds of micro-decisions per second. Good writing minimizes that cognitive load.

### The Chunking Principle

Our working memory can hold 7 (±2) chunks of information at once. Sentences that pack too many clauses, parentheticals, and modifiers overwhelm this capacity, causing readers to re-read.

Short sentences allow the brain to "commit" each idea before moving to the next. That's why Hemingway's prose feels so effortless — he rarely exceeded 15 words per sentence.

### Familiarity Breeds Fluency

Research shows that familiar words are processed up to 50ms faster than unfamiliar ones. At scale, using simpler vocabulary significantly reduces reading fatigue.

Use our [Readability Checker](/readability-checker) to see your Flesch-Kincaid score instantly. A score above 60 means most adults can read your text comfortably.

### The Rhythm Effect

Poetry isn't the only place rhythm matters. Varied sentence lengths create a natural cadence that keeps readers engaged. Short. Then longer, building momentum. Then a payoff.

### Conclusion

The best writers aren't just creative — they're cognitively considerate. Write for a brain that's always looking for reasons to stop reading, and you'll keep it reading.
    `,
  },
  {
    slug: 'keyword-density-guide',
    title: 'Keyword Density in 2026: What It Is and How to Get It Right',
    excerpt: 'Is keyword density still relevant for SEO? Yes — but not how you think. Learn the modern approach to keyword frequency that drives rankings without stuffing.',
    author: 'Sarah Mitchell',
    authorTitle: 'SEO Strategist & Content Writer',
    date: 'June 10, 2026',
    readTime: 5,
    category: 'SEO',
    tags: ['Keyword Density', 'SEO', 'Content Optimization'],
    content: `
## Keyword Density: Still Relevant in 2026?

Yes, but with major nuances. The days of hitting an exact "2% keyword density" target are over. What matters now is natural language variation and topic coverage.

### The Modern Approach: Topic Clusters

Instead of repeating one exact phrase, modern SEO uses:
- **Primary keyword**: your main target
- **LSI keywords**: semantically related terms
- **Question variants**: how, what, why versions of your keyword
- **Long-tail variations**: more specific phrases

Use our [Keyword Density Checker](/keyword-density-checker) to analyze your text and find which terms dominate your content.

### Safe Keyword Density Ranges

- **1-2%**: Ideal for primary keywords
- **0.5-1%**: Good for secondary keywords
- **Above 3%**: Risk of over-optimization penalties
- **Below 0.3%**: Possibly under-optimized for target terms

### How to Naturally Include Keywords

1. Use the keyword in your H1 and first paragraph
2. Include it 2-3 times in the body (per 500 words)
3. Use it in at least one H2 or H3
4. Include it in your meta description and title tag
5. Use variations throughout to avoid repetition
    `,
  },
  {
    slug: 'writing-goals-productivity',
    title: 'How Setting Daily Writing Goals Transformed My Productivity',
    excerpt: 'Writing goals aren\'t just about word count — they\'re about building a sustainable writing habit. Here\'s a practical system that works.',
    author: 'Tom Bergström',
    authorTitle: 'Author & Productivity Coach',
    date: 'May 30, 2026',
    readTime: 6,
    category: 'Productivity',
    tags: ['Writing Goals', 'Productivity', 'Writing Habits'],
    content: `
## The Power of a Writing Goal

Stephen King writes 2,000 words every day — no exceptions. John Grisham wrote his first novel during 30-minute morning sessions. The method is less important than the consistency.

### Start Smaller Than You Think

Most aspiring writers set goals that are 3x too ambitious. Starting with 500 words per day is more sustainable than 2,000 words, and sustainable beats ambitious every time.

Use our [Writing Goals](/word-counter) feature to set and track your daily word count target. Watching that progress bar fill up is genuinely motivating.

### The Minimum Effective Dose

Research on habit formation shows that tiny consistent actions beat large sporadic ones. A 200-word daily goal you actually hit is worth more than a 2,000-word goal you abandon by Wednesday.

### Tracking Momentum

Keep a simple streak counter. Once you've written for 7 consecutive days, you'll be reluctant to break the chain. This psychological trick — "don't break the chain" — works remarkably well.

### Goals vs. Targets vs. Limits

- **Goals**: aspirational (write 1,000 words today)
- **Targets**: specific (write until the progress bar hits 100%)
- **Limits**: boundaries (don't exceed 2,000 words in one session)

All three have their place. Word count limits prevent the "editing vortex" that kills first draft momentum.
    `,
  },
  {
    slug: 'perfect-blog-post-length',
    title: 'The Perfect Blog Post Length: Data From 1 Million Posts',
    excerpt: 'How long should a blog post be? The answer depends on your goal, audience, and topic. Here\'s what the data actually shows.',
    author: 'James Okonkwo',
    authorTitle: 'Copy Editor & Writing Coach',
    date: 'May 22, 2026',
    readTime: 5,
    category: 'Blogging',
    tags: ['Blog Posts', 'Content Length', 'SEO', 'Writing'],
    content: `
## The Data on Blog Post Length

Analysis of over 1 million blog posts shows that longer content correlates with more backlinks, higher rankings, and more social shares — but only up to a point.

### Sweet Spots by Goal

- **SEO rankings**: 1,500-2,500 words for competitive keywords
- **Social sharing**: 1,000-2,000 words (long enough to be valuable, short enough to finish)
- **Newsletter**: 400-800 words (respect inbox time)
- **Quick reference**: 300-600 words (scannable, to the point)
- **Comprehensive guides**: 2,500-5,000+ words

### Why Longer Content Ranks Better

1. More words = more opportunities to cover subtopics
2. Longer content earns more backlinks (reference material)
3. More content = more engagement signals (time on page)
4. Comprehensive content satisfies all user intents

Use our [Word Counter](/word-counter) to track your post length in real time as you write.

### When Short Is Better

Breaking news, opinion pieces, and highly niche content can rank with under 500 words when they perfectly match search intent. Length for its own sake is never the answer — depth is.
    `,
  },
  {
    slug: 'social-media-character-limits-guide',
    title: 'The Complete Guide to Social Media Character Limits in 2026',
    excerpt: 'Every major platform has different character limits. Here\'s the definitive guide to Twitter, Instagram, LinkedIn, Facebook, TikTok, YouTube, and more.',
    author: 'Sarah Mitchell',
    authorTitle: 'SEO Strategist & Content Writer',
    date: 'May 15, 2026',
    readTime: 4,
    category: 'Social Media',
    tags: ['Character Limits', 'Social Media', 'Twitter', 'Instagram'],
    content: `
## Social Media Character Limits: The 2026 Guide

Every platform has its own rules. Knowing these limits is the difference between a perfectly crafted post and a frustrating truncation at the worst moment.

### Platform-by-Platform Breakdown

| Platform | Limit | Notes |
|----------|-------|-------|
| Twitter/X | 280 chars | Blue subscribers get 25,000 |
| Instagram | 2,200 chars | Caption (preview: ~125 chars) |
| LinkedIn | 3,000 chars | Posts; articles have no limit |
| Facebook | 63,206 chars | Effectively unlimited |
| TikTok | 2,200 chars | Caption limit |
| YouTube | 5,000 chars | Description |
| Pinterest | 500 chars | Pin description |
| Meta Description | 160 chars | 150-160 for best display |
| SEO Title | 60 chars | 50-60 for full display |

Use our [Character Counter](/character-counter) to check your text against these limits in real time.

### Pro Tips for Each Platform

**Twitter/X**: Lead with the hook. Twitter crops at ~280 chars in feed. Make the first 100 characters irresistible.

**Instagram**: Put the most important content before the "More" fold (≈125 characters). Hashtags at the end don't count against the caption in most feed displays.

**LinkedIn**: Professional context rewards substance. Don't be afraid of 500-800 word posts — they often outperform shorter ones.
    `,
  },
  {
    slug: 'flesch-kincaid-explained',
    title: 'Flesch-Kincaid Readability Explained: What Your Score Really Means',
    excerpt: 'The Flesch-Kincaid formula has been standard for 70 years. Here\'s exactly what it measures, why it matters, and how to improve your score.',
    author: 'Dr. Priya Mehta',
    authorTitle: 'Cognitive Linguist & Content Researcher',
    date: 'May 8, 2026',
    readTime: 6,
    category: 'Writing',
    tags: ['Readability', 'Flesch-Kincaid', 'Writing Grade Level'],
    content: `
## The Flesch-Kincaid Formula: 70 Years and Still Relevant

Rudolf Flesch developed the Reading Ease formula in 1948. With minor modifications by J. Peter Kincaid in 1975, it remains the gold standard for measuring text difficulty.

### The Formula

**Flesch Reading Ease** = 206.835 - (1.015 × ASL) - (84.6 × ASW)

Where:
- ASL = Average Sentence Length (words per sentence)
- ASW = Average Syllables per Word

### Score Interpretation

| Score | Level | Example |
|-------|-------|---------|
| 90-100 | Very Easy | Children's books |
| 80-90 | Easy | Conversational English |
| 70-80 | Fairly Easy | Magazines |
| 60-70 | Standard | Newspapers |
| 50-60 | Fairly Difficult | Academic journals |
| 30-50 | Difficult | Legal documents |
| 0-30 | Very Difficult | Scientific papers |

Check your score instantly with our [Readability Checker](/readability-checker).

### How to Improve Your Score

1. **Shorten sentences**: Each 5-word reduction in average sentence length raises your score by ~5 points
2. **Choose simpler synonyms**: "use" instead of "utilize," "help" instead of "facilitate"
3. **Avoid unnecessary adverbs and qualifiers**: they add syllables without adding meaning
4. **Break up long paragraphs**: even if this doesn't affect the Flesch score directly, it improves perceived readability
    `,
  },
  {
    slug: 'auto-save-writing-workflow',
    title: 'Why Auto-Save Is the Most Underrated Writing Feature',
    excerpt: 'You\'ve lost work before. We all have. Here\'s why auto-save should be a non-negotiable in every writing tool, and how we implemented it in counter.',
    author: 'Tom Bergström',
    authorTitle: 'Author & Productivity Coach',
    date: 'April 28, 2026',
    readTime: 4,
    category: 'Tools',
    tags: ['Auto-Save', 'Writing Tools', 'Productivity'],
    content: `
## The Terror of "Did I Save That?"

Every writer has experienced the sinking feeling of a browser crash, power outage, or accidental close that wiped out an hour of work. It's 2026 and this should never happen — yet it still does on many writing tools.

### How Auto-Save Works in Counter

Our word counter auto-saves your text to your browser's local storage every few seconds. This means:

- Your text is never sent to any server
- You can close the tab and return to find your text waiting
- No account required, no sign-in, no cloud dependency

### The Privacy Advantage

Unlike cloud-based tools, local auto-save keeps your draft completely private. Sensitive documents — legal, medical, personal — stay on your device. Period.

### Building the Auto-Save Habit

Even with auto-save, build the manual save habit (⌘S / Ctrl+S) before major changes. Think of auto-save as your safety net, not your primary system.

### What Gets Saved

Counter saves:
- All your written text
- Your current word count goal
- Your theme preference (dark/light)

Start writing at [counter](/word-counter) and never lose a word again.
    `,
  },
  {
    slug: 'writing-for-web-vs-print',
    title: 'Writing for Web vs. Print: 7 Key Differences You Must Know',
    excerpt: 'Web writing and print writing are fundamentally different disciplines. Adapting your style for the screen can double your engagement metrics.',
    author: 'James Okonkwo',
    authorTitle: 'Copy Editor & Writing Coach',
    date: 'April 20, 2026',
    readTime: 5,
    category: 'Writing',
    tags: ['Web Writing', 'Print Writing', 'Content Strategy'],
    content: `
## Two Mediums, Two Different Rules

The novelist who struggles with web copy and the blogger who can't write a compelling essay — both are failing to adapt their craft to the medium. Here's the fundamental difference: **print readers are committed; web readers are evaluating**.

### 7 Key Differences

**1. Inverted pyramid vs. narrative arc**
Web: most important information first (inverted pyramid). Print: build to the climax.

**2. Paragraph length**
Web: 2-3 sentences max. Print: 5-8 sentences is normal.

**3. Subheadings**
Web: every 150-300 words. Print: chapters and sections only.

**4. Sentence length**
Web: 15-20 words average. Print: 20-30 words is acceptable.

**5. Link integration**
Web: hyperlinks are part of the content structure. Print: footnotes are secondary.

**6. CTA placement**
Web: multiple points throughout. Print: usually at the end.

**7. White space**
Web: generous whitespace improves comprehension by 20%. Print: denser text is standard.

Track your web writing metrics with our [Word Counter](/word-counter) and [Readability Checker](/readability-checker).
    `,
  },
  {
    slug: 'word-count-for-every-format',
    title: 'Word Count Guide: The Ideal Length for Every Type of Writing',
    excerpt: 'From tweets to novels, every writing format has an ideal length. Here\'s the definitive reference guide for word counts across 20+ content types.',
    author: 'Dr. Priya Mehta',
    authorTitle: 'Cognitive Linguist & Content Researcher',
    date: 'April 12, 2026',
    readTime: 5,
    category: 'Writing',
    tags: ['Word Count', 'Writing Formats', 'Content Strategy'],
    content: `
## Word Count Reference: Every Format Covered

Whether you're writing a haiku or a dissertation, knowing the expected length is the first step to planning your project effectively.

### Content Marketing & Blogging
- **Tweet/X post**: up to 280 characters (~50 words)
- **Social media caption**: 150-300 words
- **Email newsletter**: 200-600 words
- **Blog post (basic)**: 800-1,200 words
- **Blog post (SEO optimized)**: 1,500-2,500 words
- **Pillar page/ultimate guide**: 3,000-5,000 words
- **White paper**: 2,500-5,000 words

### Academic Writing
- **Essay (high school)**: 250-1,000 words
- **Essay (university)**: 1,500-5,000 words
- **Research paper**: 4,000-8,000 words
- **Master's thesis**: 15,000-45,000 words
- **Doctoral dissertation**: 70,000-100,000 words

### Fiction Writing
- **Flash fiction**: 100-1,000 words
- **Short story**: 1,000-7,500 words
- **Novella**: 17,500-40,000 words
- **Novel**: 70,000-100,000 words

Use our [Word Counter](/word-counter) to track your progress against any of these targets.
    `,
  },
  {
    slug: 'passive-voice-guide',
    title: 'Passive Voice: When to Use It, When to Avoid It',
    excerpt: 'Passive voice isn\'t always wrong — but it\'s often overused. Learn when passive voice hurts your writing and when it\'s the right choice.',
    author: 'James Okonkwo',
    authorTitle: 'Copy Editor & Writing Coach',
    date: 'April 5, 2026',
    readTime: 4,
    category: 'Writing',
    tags: ['Grammar', 'Passive Voice', 'Writing Style'],
    content: `
## Passive Voice: The Nuanced Truth

Grammar teachers say "avoid passive voice." Style guides say "prefer active voice." But the real answer — like most things in writing — is more nuanced.

### What Is Passive Voice?
Active: "The writer finished the article."
Passive: "The article was finished by the writer."

In passive voice, the subject receives the action rather than performing it. The agent (the writer) may be omitted entirely: "The article was finished."

### When Passive Voice HURTS Your Writing

1. **When the agent is obvious and important**: "The CEO approved the deal" is stronger than "The deal was approved."
2. **In everyday prose**: Overusing passive creates a formal, bureaucratic tone that distances readers.
3. **When it obscures responsibility**: "Mistakes were made" is passive evasion.

### When Passive Voice HELPS Your Writing

1. **When the agent is unknown**: "The window was broken" (we don't know who)
2. **In scientific writing**: "The samples were analyzed at 37°C" (the method matters, not the researcher)
3. **When de-emphasizing the agent is appropriate**: "The plaintiff was awarded $1M" (focus is on the plaintiff)
4. **For stylistic variety**: Occasional passive prevents monotony

Check your writing's readability (passive voice affects it) with our [Readability Checker](/readability-checker).
    `,
  },
];

export const BLOG_CATEGORIES = ['All', 'SEO', 'Writing', 'Blogging', 'Productivity', 'Social Media', 'Tools'];

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(p => p.slug === slug);
}

export function getBlogsByCategory(category: string): BlogPost[] {
  if (category === 'All') return BLOG_POSTS;
  return BLOG_POSTS.filter(p => p.category === category);
}
