// Programmatic SEO page data

export const WORDS_TO_PAGES = [
  { words: 100, pages: 0.2, pagesSingle: 0.1, readTime: 1, speechTime: 1 },
  { words: 250, pages: 0.5, pagesSingle: 0.5, readTime: 1, speechTime: 2 },
  { words: 500, pages: 1, pagesSingle: 1, readTime: 2, speechTime: 4 },
  { words: 750, pages: 1.5, pagesSingle: 1.5, readTime: 3, speechTime: 6 },
  { words: 1000, pages: 2, pagesSingle: 2, readTime: 4, speechTime: 8 },
  { words: 1500, pages: 3, pagesSingle: 3, readTime: 6, speechTime: 12 },
  { words: 2000, pages: 4, pagesSingle: 4, readTime: 8, speechTime: 15 },
  { words: 2500, pages: 5, pagesSingle: 5, readTime: 11, speechTime: 19 },
  { words: 3000, pages: 6, pagesSingle: 6, readTime: 13, speechTime: 23 },
  { words: 4000, pages: 8, pagesSingle: 8, readTime: 17, speechTime: 31 },
  { words: 5000, pages: 10, pagesSingle: 10, readTime: 21, speechTime: 38 },
  { words: 7500, pages: 15, pagesSingle: 15, readTime: 32, speechTime: 58 },
  { words: 10000, pages: 20, pagesSingle: 20, readTime: 42, speechTime: 77 },
];

export const WORDS_TO_PAGES_SLUGS = [
  '100-words-is-how-many-pages',
  '500-words-is-how-many-pages',
  '1000-words-is-how-many-pages',
  '1500-words-is-how-many-pages',
  '2000-words-is-how-many-pages',
  '3000-words-is-how-many-pages',
  '5000-words-is-how-many-pages',
  '10000-words-is-how-many-pages',
];

export const SPEECH_TIMES = [
  { minutes: 5, words: 650, wpm: 130, description: 'short talk, elevator pitch, or toast' },
  { minutes: 10, words: 1300, wpm: 130, description: 'conference talk, class presentation, or team update' },
  { minutes: 15, words: 1950, wpm: 130, description: 'keynote segment, TED-style talk, or departmental presentation' },
  { minutes: 20, words: 2600, wpm: 130, description: 'detailed presentation or university lecture segment' },
  { minutes: 30, words: 3900, wpm: 130, description: 'full conference session or workshop module' },
  { minutes: 45, words: 5850, wpm: 130, description: 'extended keynote, university class, or workshop' },
  { minutes: 60, words: 7800, wpm: 130, description: 'full lecture, seminar, or extended presentation' },
  { minutes: 90, words: 11700, wpm: 130, description: 'half-day workshop segment or long-form keynote' },
];

export const SOCIAL_MEDIA_LIMITS = [
  {
    slug: 'twitter-character-limit',
    platform: 'Twitter / X',
    limit: 280,
    extendedLimit: 25000,
    extendedNote: 'Twitter Blue / X Premium subscribers',
    unit: 'characters',
    tips: [
      'The first 280 characters must hook the reader completely',
      'Include one clear call-to-action per tweet',
      'Use thread format for longer content (up to 25 tweets)',
      'Images reduce character "cost" by hiding their link characters',
      'Hashtags count toward your 280-character limit',
    ],
    examples: [
      { label: 'Standard tweet', limit: 280 },
      { label: 'X Premium long post', limit: 25000 },
    ],
  },
  {
    slug: 'instagram-character-limit',
    platform: 'Instagram',
    limit: 2200,
    foldLimit: 125,
    unit: 'characters',
    tips: [
      'The first 125 characters show before the "More" fold in feed',
      'Lead with your most engaging hook before the fold',
      'Hashtags at the end don\'t affect caption readability',
      'Line breaks improve caption structure and readability',
      'Stories have no caption limit but very short screen time',
    ],
    examples: [
      { label: 'Caption (max)', limit: 2200 },
      { label: 'Preview (before "More")', limit: 125 },
      { label: 'Bio', limit: 150 },
    ],
  },
  {
    slug: 'linkedin-character-limit',
    platform: 'LinkedIn',
    limit: 3000,
    foldLimit: 210,
    unit: 'characters',
    tips: [
      'First 210 characters show before "See more" in feed',
      'LinkedIn rewards substantive content — don\'t go shorter than needed',
      'Articles have no character limit and perform well for SEO',
      'Comments are limited to 1,250 characters',
      'Connection request message: 300 characters',
    ],
    examples: [
      { label: 'Post', limit: 3000 },
      { label: 'Article', limit: null },
      { label: 'Comment', limit: 1250 },
      { label: 'Headline', limit: 220 },
    ],
  },
  {
    slug: 'facebook-character-limit',
    platform: 'Facebook',
    limit: 63206,
    unit: 'characters',
    tips: [
      'Effectively unlimited — but shorter posts typically get more engagement',
      'Posts under 80 characters get 66% more engagement (studies show)',
      'Facebook News Feed truncates at ~480 characters with "See more"',
      'Page posts: first 477 characters visible without expanding',
      'Group posts support long-form content that reads like articles',
    ],
    examples: [
      { label: 'Personal post (max)', limit: 63206 },
      { label: 'Optimal for engagement', limit: 80 },
      { label: 'Before "See more"', limit: 477 },
    ],
  },
  {
    slug: 'youtube-description-limit',
    platform: 'YouTube',
    limit: 5000,
    foldLimit: 157,
    unit: 'characters',
    tips: [
      'First 157 characters appear in search results — make them count',
      'Include your target keyword in the first 25 characters',
      'Add timestamps to improve navigation and watch time',
      'Include relevant links (channel, social, products) in first 3 lines',
      'Hashtags at the end of description appear as clickable tags',
    ],
    examples: [
      { label: 'Description (max)', limit: 5000 },
      { label: 'Search preview', limit: 157 },
      { label: 'Tags (keyword form)', limit: 500 },
      { label: 'Title', limit: 100 },
    ],
  },
  {
    slug: 'tiktok-character-limit',
    platform: 'TikTok',
    limit: 2200,
    foldLimit: 100,
    unit: 'characters',
    tips: [
      'First line is critical — it appears in feed before any truncation',
      'TikTok captions are secondary to video; keep them supporting, not essential',
      'Hashtags significantly affect discovery on TikTok',
      'Link in bio is the only clickable link for most accounts',
      'Duet and stitch captions inherit from the original video',
    ],
    examples: [
      { label: 'Caption (max)', limit: 2200 },
      { label: 'Bio', limit: 80 },
    ],
  },
  {
    slug: 'meta-description-limit',
    platform: 'Meta Description (SEO)',
    limit: 160,
    optimalLimit: 155,
    unit: 'characters',
    tips: [
      'Google truncates meta descriptions at ~155-160 characters',
      'Include your primary keyword naturally (not stuffed)',
      'Write a compelling CTA — the meta description is your search ad',
      'Mobile snippets truncate earlier (~120 characters)',
      'Unique meta descriptions for every page — duplicates hurt SEO',
    ],
    examples: [
      { label: 'Desktop display', limit: 160 },
      { label: 'Mobile display', limit: 120 },
      { label: 'Optimal length', limit: 155 },
    ],
  },
  {
    slug: 'seo-title-tag-limit',
    platform: 'SEO Title Tag',
    limit: 60,
    optimalLimit: 55,
    unit: 'characters',
    tips: [
      'Google typically displays 50-60 characters of title tags',
      'Include your primary keyword near the beginning of the title',
      'Brand name at the end: "Topic — Brand" format',
      'Pixel width matters more than characters (~600px limit)',
      'Unique, descriptive titles for every page on your site',
    ],
    examples: [
      { label: 'Desktop title display', limit: 60 },
      { label: 'Optimal length', limit: 55 },
      { label: 'Mobile title display', limit: 78 },
    ],
  },
];

export const LANDING_PAGES: Record<string, {
  title: string;
  hero: string;
  audience: string;
  painPoints: string[];
  benefits: string[];
  useCases: string[];
}> = {
  'word-counter-for-students': {
    title: 'Word Counter for Students',
    hero: 'Hit Every Word Count Requirement. Every Time.',
    audience: 'students',
    painPoints: ['Unsure if your essay meets the minimum word count', 'Wasting time manually counting words', 'Getting marked down for length requirements'],
    benefits: ['Instant word count as you type', 'Set essay length goals with a progress bar', 'Character count for bibliography formatting', 'Reading time to estimate your presentation length'],
    useCases: ['High school essays', 'University assignments', 'Dissertation chapters', 'Research papers', 'Personal statements'],
  },
  'word-counter-for-essay': {
    title: 'Word Counter for Essays',
    hero: 'Write Essays That Meet Every Requirement',
    audience: 'essay writers',
    painPoints: ['Essays that run over or under word limits', 'No way to track progress toward a word target', 'Losing count when writing in separate sections'],
    benefits: ['Live word count as you draft', 'Goal tracker for minimum/maximum word limits', 'Paragraph breakdown to check structure', 'Readability score to improve clarity'],
    useCases: ['Admission essays', 'Academic papers', 'Scholarship applications', 'Competitive essays', 'College applications'],
  },
  'word-counter-for-seo': {
    title: 'Word Counter for SEO',
    hero: 'Optimize Your Content Length for Maximum Rankings',
    audience: 'SEO professionals',
    painPoints: ['Unsure how long your content should be to rank', 'No tool to check keyword density while writing', 'Content that\'s too thin to compete in SERPs'],
    benefits: ['Word count optimization for target keywords', 'Keyword density checker built-in', 'Readability scores for audience targeting', 'Export content for CMS upload'],
    useCases: ['Blog posts', 'Landing pages', 'Product descriptions', 'Category pages', 'Pillar content'],
  },
  'word-counter-for-bloggers': {
    title: 'Word Counter for Bloggers',
    hero: 'Write Blog Posts That Rank and Convert',
    audience: 'bloggers',
    painPoints: ['Inconsistent post lengths that hurt SEO', 'No visibility into keyword usage', 'Posts that are too short or too wordy'],
    benefits: ['Live word tracking as you write', 'Reading time estimate for your audience', 'Keyword density analysis', 'Auto-save so you never lose a draft'],
    useCases: ['Blog posts', 'Product reviews', 'Listicles', 'How-to guides', 'Opinion pieces'],
  },
  'word-counter-for-writers': {
    title: 'Word Counter for Writers',
    hero: 'Track Your Daily Writing Progress',
    audience: 'writers',
    painPoints: ['No way to track daily word count progress', 'Losing motivation without visible progress', 'Unsure if your chapter is the right length'],
    benefits: ['Daily writing goal tracker', 'Progress bar that fills as you write', 'Auto-save in the browser', 'Distraction-free writing environment'],
    useCases: ['Novel writing', 'Short stories', 'Screenplays', 'Non-fiction books', 'Journaling'],
  },
  'word-counter-for-copywriters': {
    title: 'Word Counter for Copywriters',
    hero: 'Write Copy That Fits Every Brief',
    audience: 'copywriters',
    painPoints: ['Client briefs with strict word limits', 'No way to check copy length quickly', 'Losing track of character limits across formats'],
    benefits: ['Instant word and character count', 'Multiple character limit references (social, SEO)', 'Find & Replace for quick edits', 'Export in TXT format for handoff'],
    useCases: ['Ad copy', 'Landing page copy', 'Email campaigns', 'Social media posts', 'Website copy'],
  },
  'word-counter-for-social-media': {
    title: 'Word Counter for Social Media',
    hero: 'Stay Inside Every Platform\'s Character Limit',
    audience: 'social media managers',
    painPoints: ['Copy getting cut off on Twitter or LinkedIn', 'Wasting time measuring character counts manually', 'Different limits for every platform'],
    benefits: ['Character count in real time', 'Platform limit reference guide built-in', 'See counts with and without spaces', 'Copy to clipboard in one click'],
    useCases: ['Twitter/X posts', 'LinkedIn posts', 'Instagram captions', 'Facebook updates', 'TikTok captions'],
  },
  'word-counter-for-academics': {
    title: 'Word Counter for Academics',
    hero: 'Precise Word Counts for Research That Demands Precision',
    audience: 'academics and researchers',
    painPoints: ['Journal submissions with strict word limits', 'No accurate count for abstracts and bibliographies', 'Tracking progress across long research papers'],
    benefits: ['Precise word and character counting', 'Separate counts for body text sections', 'Readability analysis for journal targeting', 'Export to plain text for manuscript submission'],
    useCases: ['Journal articles', 'Conference papers', 'Thesis chapters', 'Grant proposals', 'Research abstracts'],
  },
  'word-counter-for-book-writing': {
    title: 'Word Counter for Book Writing',
    hero: 'Track Every Word of Your Book, Chapter by Chapter',
    audience: 'authors and novelists',
    painPoints: ['Losing track of total word count across chapters', 'No way to set daily writing goals and measure progress', 'Unsure if your chapter lengths are consistent'],
    benefits: ['Real-time word count as you draft', 'Daily writing goal tracker with progress bar', 'Auto-save so drafts are never lost', 'Reading time estimate for pacing checks', 'Export chapters as plain text'],
    useCases: ['Novel chapters', 'Non-fiction books', 'Memoirs', 'Short story collections', 'Self-help books', 'Children\'s books'],
  },
  'word-counter-for-professionals': {
    title: 'Word Counter for Professionals',
    hero: 'Write Cleaner, Tighter Business Content — Faster',
    audience: 'business professionals',
    painPoints: ['Reports and proposals that run over the recommended length', 'No quick way to check document word counts before sending', 'Emails and exec summaries that are too long'],
    benefits: ['Instant word and character counting for any document', 'Readability score to ensure clear, professional writing', 'Find & Replace for quick editing', 'Export-ready plain text output', 'Reading time so recipients know what to expect'],
    useCases: ['Business reports', 'Executive summaries', 'Proposals', 'Email drafts', 'Press releases', 'Internal memos'],
  },
};

export const COMPARISON_PAGES: Record<string, {
  title: string;
  intro: string;
  tool1: { name: string; slug: string; description: string; bestFor: string[] };
  tool2: { name: string; slug: string; description: string; bestFor: string[] };
  verdict: string;
}> = {
  'word-counter-vs-character-counter': {
    title: 'Word Counter vs. Character Counter: Which Do You Need?',
    intro: 'Both count your text — but they measure very different things. Here\'s when to use each tool and why the difference matters for your writing.',
    tool1: {
      name: 'Word Counter',
      slug: 'word-counter',
      description: 'Counts space-separated tokens in your text. Perfect for meeting word count requirements in essays, blog posts, and submissions.',
      bestFor: ['Academic essays with word limits', 'Blog post planning (target: 1,500+ words for SEO)', 'Daily writing goals', 'NaNoWriMo and novel writing', 'Journalism (column inches ≈ words)'],
    },
    tool2: {
      name: 'Character Counter',
      slug: 'character-counter',
      description: 'Counts every individual character, including spaces and punctuation. Essential for social media, SMS, and any character-limited platform.',
      bestFor: ['Twitter/X posts (280 char limit)', 'Meta descriptions (160 char limit)', 'SMS messages (160 char limit)', 'Instagram captions (2,200 char limit)', 'SEO title tags (60 char limit)'],
    },
    verdict: 'Use Word Counter for documents, essays, and content strategy. Use Character Counter for social media, SEO meta tags, and any platform with a character limit. Both are available simultaneously in our tool — you can monitor both metrics at the same time.',
  },
  'reading-time-vs-speaking-time': {
    title: 'Reading Time vs. Speaking Time: What\'s the Difference?',
    intro: 'Your text will be read differently than it\'s spoken. Understanding both rates helps you write the right length for your medium — whether that\'s a blog post or a conference keynote.',
    tool1: {
      name: 'Reading Time Calculator',
      slug: 'reading-time-calculator',
      description: 'Calculates how long someone will spend reading your text at the average adult reading speed of 238 words per minute.',
      bestFor: ['Blog posts and articles', 'Newsletter content', 'ebooks and guides', 'Product descriptions', 'Any written content'],
    },
    tool2: {
      name: 'Speaking Time Calculator',
      slug: 'speaking-time-calculator',
      description: 'Calculates how long your text takes to deliver out loud at a clear presentation pace of 130 words per minute.',
      bestFor: ['Conference presentations', 'TED-style talks', 'Wedding toasts', 'Podcast scripts', 'Voiceover scripts'],
    },
    verdict: 'Reading is almost twice as fast as speaking. A 1,300-word article takes 5 minutes to read, but 10 minutes to deliver as a speech. Always use the right calculator for your medium to avoid running over time at events or producing content that\'s too long to finish reading.',
  },
  'flesch-score-vs-fk-grade': {
    title: 'Flesch Reading Ease vs. Flesch-Kincaid Grade: What\'s the Difference?',
    intro: 'Both measure readability using the same inputs — but they output completely different numbers for different purposes. Here\'s which one to use and why.',
    tool1: {
      name: 'Flesch Reading Ease',
      slug: 'readability-checker',
      description: 'Outputs a score from 0–100. Higher is easier. A score of 60–70 is considered plain English, suitable for most audiences.',
      bestFor: ['Blog posts and articles targeting general audiences', 'Marketing copy and landing pages', 'Email newsletters', 'Social media bios', 'Product descriptions'],
    },
    tool2: {
      name: 'Flesch-Kincaid Grade Level',
      slug: 'readability-checker',
      description: 'Outputs a US school grade level (e.g. Grade 8). Tells you the minimum education level needed to understand your text.',
      bestFor: ['Academic and research papers (target Grade 12+)', 'Legal and technical documents', 'Educational content calibrated to a grade', 'Government communications', 'Medical writing'],
    },
    verdict: 'Use Flesch Reading Ease when you\'re writing for consumers or a broad audience and want to maximise clarity. Use Flesch-Kincaid Grade Level when your audience is defined by education level — academic journals, K–12 content, or regulated industries. Both scores are shown simultaneously in our Readability Checker.',
  },
  'word-counter-vs-sentence-counter': {
    title: 'Word Counter vs. Sentence Counter: Do You Need Both?',
    intro: 'Word count tells you how much you wrote. Sentence count tells you how you wrote it. Understanding both metrics unlocks better control over pacing, clarity, and structure.',
    tool1: {
      name: 'Word Counter',
      slug: 'word-counter',
      description: 'Counts every word in your text. The essential metric for meeting submission requirements, hitting SEO targets, and tracking daily writing goals.',
      bestFor: ['Meeting minimum/maximum word limits', 'Daily writing goals (NaNoWriMo, journaling)', 'SEO content strategy (target word counts per article type)', 'Academic submissions', 'Freelance writing billing by the word'],
    },
    tool2: {
      name: 'Sentence Counter',
      slug: 'sentence-counter',
      description: 'Counts every sentence. Combined with word count, it reveals average sentence length — a core driver of readability and perceived complexity.',
      bestFor: ['Improving readability by varying sentence length', 'Detecting overly long or complex sentences', 'Academic writing style checks', 'Journalism (short punchy sentences vs long analysis)', 'Writing for voice/audio where sentence length affects delivery'],
    },
    verdict: 'Word count and sentence count work best together. Divide words by sentences to get average sentence length — aim for 15–20 words per sentence for general readability. Both metrics are shown side-by-side in our word counter with no extra steps.',
  },
  'paragraph-counter-vs-line-counter': {
    title: 'Paragraph Counter vs. Line Counter: Which Metric Matters?',
    intro: 'Paragraphs and lines look similar but measure different things. Choosing the right metric depends on your format — prose, code, or structured content.',
    tool1: {
      name: 'Paragraph Counter',
      slug: 'paragraph-counter',
      description: 'Counts blocks of text separated by blank lines. Reveals content structure — how many distinct ideas or sections your document has.',
      bestFor: ['Checking prose structure and flow', 'Academic writing (target 3–5 sentences per paragraph)', 'Blog posts (shorter paragraphs for skimmability)', 'SEO content structure audits', 'Ensuring consistent paragraph lengths'],
    },
    tool2: {
      name: 'Line Counter',
      slug: 'line-counter',
      description: 'Counts every line break in the text, including single-line breaks within paragraphs. Most useful for code, scripts, and formatted documents.',
      bestFor: ['Code and scripts (lines of code metric)', 'Poetry and song lyrics', 'Screenplay formatting', 'Legal documents with numbered lines', 'Any format where each line is a distinct unit'],
    },
    verdict: 'For prose writing, paragraph count is the more meaningful metric — it tells you about structure and idea organisation. For code, scripts, or any line-numbered format, line count is what you need. Both are calculated instantly in our counter with no configuration required.',
  },
};
