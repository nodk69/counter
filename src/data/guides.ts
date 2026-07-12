export interface Guide {
  slug: string;
  title: string;
  excerpt: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Quick Reference';
  readTime: number;
  category: string;
  featured?: boolean;
  steps: { title: string; content: string }[];
}

export const GUIDES: Guide[] = [
  {
    slug: 'how-to-use-word-counter',
    title: 'How to Use Word Counter: A Complete Beginner\'s Guide',
    excerpt: 'Everything you need to know to get started with counter. From basic word counting to advanced analytics — master all the features in 10 minutes.',
    difficulty: 'Beginner',
    readTime: 10,
    category: 'Getting Started',
    featured: true,
    steps: [
      { title: 'Type or Paste Your Text', content: 'Start by typing directly into the editor or paste text from your document. Word count updates instantly as you type — no need to click any button.' },
      { title: 'Read Your Statistics', content: 'The stats panel on the right shows all key metrics: words, characters (with and without spaces), sentences, paragraphs, reading time, speaking time, and more.' },
      { title: 'Use the Toolbar', content: 'The toolbar above the editor gives you quick access to copy, undo, redo, clear, import (TXT/MD files), export, and find & replace.' },
      { title: 'Set a Writing Goal', content: 'Click "Set Goal" below the editor to set a word count target. A progress bar will track your progress toward the goal as you write.' },
      { title: 'Explore the Analysis Tabs', content: 'The tabs below the editor show Word Density (top keywords), Readability analysis, Text Stats (sentence lengths), and Export options.' },
      { title: 'Toggle Dark Mode', content: 'Click the moon icon in the top-right corner to switch between light and dark mode. Your preference is saved automatically.' },
    ],
  },
  {
    slug: 'understanding-statistics',
    title: 'Understanding Your Writing Statistics',
    excerpt: 'What does each statistic mean and how should you use it? A deep dive into all the metrics that counter tracks for you.',
    difficulty: 'Intermediate',
    readTime: 8,
    category: 'Writing Tools',
    steps: [
      { title: 'Words vs. Characters', content: 'Words count space-separated tokens. Characters include every character — letters, numbers, punctuation, and spaces. Some platforms (like Twitter) count characters, not words.' },
      { title: 'Reading Time', content: 'Calculated at 238 words per minute — the average adult reading speed. A 1,000-word article takes approximately 4 minutes to read.' },
      { title: 'Speaking Time', content: 'Calculated at 130 words per minute — a comfortable, clear speaking pace for presentations. Allows comfortable pausing and emphasis.' },
      { title: 'Flesch Reading Ease', content: 'A score from 0-100. Above 60 is easy to read. Below 30 is academic/technical. Adjust by shortening sentences and using simpler words.' },
      { title: 'Unique Words', content: 'The count of distinct words used. A high ratio of unique words to total words indicates rich, varied vocabulary.' },
      { title: 'Word Density', content: 'Shows the most frequently used significant words. Useful for checking keyword distribution in SEO content.' },
    ],
  },
  {
    slug: 'seo-writing-fundamentals',
    title: 'SEO Writing Fundamentals for Content Creators',
    excerpt: 'Master the art and science of SEO writing. Learn keyword integration, content structure, and optimization techniques that drive organic traffic.',
    difficulty: 'Advanced',
    readTime: 15,
    category: 'SEO & Content',
    steps: [
      { title: 'Keyword Research First', content: 'Before writing, identify your primary keyword and 3-5 secondary keywords. Use search volume, competition, and intent to choose wisely.' },
      { title: 'Optimize Your Title and H1', content: 'Include your primary keyword in your H1 heading, ideally near the beginning. Keep H1 under 60 characters for SEO title tags.' },
      { title: 'Match Search Intent', content: 'Informational keywords need comprehensive guides. Transactional keywords need product/service pages. Commercial keywords need comparisons and reviews.' },
      { title: 'Structure for Featured Snippets', content: 'Use question-based H2s and answer them directly in 40-50 words immediately after the heading to target position zero.' },
      { title: 'Check Keyword Density', content: 'Aim for 1-2% keyword density. Use our Keyword Density Checker to monitor this as you write.' },
      { title: 'Internal Linking Strategy', content: 'Link to 3-5 relevant pages on your site from each new piece of content. This distributes authority and helps Google understand your site structure.' },
    ],
  },
  {
    slug: 'keyboard-shortcuts',
    title: 'Keyboard Shortcuts: Write Faster with Counter',
    excerpt: 'Master the keyboard shortcuts in counter to dramatically speed up your writing workflow. Every second counts.',
    difficulty: 'Quick Reference',
    readTime: 3,
    category: 'Getting Started',
    steps: [
      { title: 'Text Editing Shortcuts', content: 'Undo: ⌘Z / Ctrl+Z | Redo: ⌘Y / Ctrl+Y | Select All: ⌘A / Ctrl+A | Copy: ⌘C / Ctrl+C | Paste: ⌘V / Ctrl+V' },
      { title: 'Counter Toolbar Shortcuts', content: 'Find & Replace: ⌘F / Ctrl+F | Clear all text: use the toolbar button (with confirmation) | Export: use the download button in the toolbar' },
      { title: 'Navigation', content: 'Jump to start: ⌘Home | Jump to end: ⌘End | Word jump: ⌘→ / Ctrl+→ | Select word: ⌘Shift+→' },
    ],
  },
  {
    slug: 'export-import-guide',
    title: 'Import & Export: Working with Files in Counter',
    excerpt: 'Learn how to import text files, export your work, and integrate counter into your writing workflow.',
    difficulty: 'Beginner',
    readTime: 4,
    category: 'Writing Tools',
    steps: [
      { title: 'Importing Files', content: 'Click the upload icon in the toolbar to import a .txt or .md file. The contents will replace your current text (you\'ll be prompted to confirm if you have existing text).' },
      { title: 'Exporting Your Work', content: 'Click the download icon to export your text as a .txt file. The file is saved directly to your downloads folder.' },
      { title: 'Supported Formats', content: 'Import: .txt, .md (Markdown) | Export: .txt | Coming soon: .docx and .pdf export' },
      { title: 'Auto-Save', content: 'Your text is automatically saved to your browser\'s local storage. If you close the tab and return, your text will be waiting for you — no account required.' },
    ],
  },
  {
    slug: 'setting-writing-goals',
    title: 'Setting & Achieving Writing Goals with Counter',
    excerpt: 'The writing goal feature is one of the most powerful tools for building a consistent writing habit. Here\'s how to use it effectively.',
    difficulty: 'Beginner',
    readTime: 5,
    category: 'Getting Started',
    steps: [
      { title: 'Setting Your Goal', content: 'Click "Set Goal" below the editor. Enter your target word count (e.g., 1000 for a blog post, 500 for daily journaling). The progress bar will appear immediately.' },
      { title: 'Choosing the Right Goal', content: 'Daily journaling: 200-500 words | Blog posts: 800-1,500 words | Academic essays: 1,000-2,000 words | Novel sessions: 1,000-2,500 words' },
      { title: 'Tracking Progress', content: 'The progress bar updates in real time as you write. The display shows your current count vs. your goal (e.g., "820 / 1000 words").' },
      { title: 'Adjusting Goals', content: 'Click the goal number to edit it at any time. Your goal is saved to local storage and persists across sessions.' },
      { title: 'Goal Psychology', content: 'Studies show that specific, measurable goals with visible progress are 40% more likely to be achieved than vague intentions. The progress bar leverages this principle.' },
    ],
  },
  {
    slug: 'readability-optimization',
    title: 'Readability Optimization: A Writer\'s Practical Guide',
    excerpt: 'How to systematically improve your Flesch-Kincaid score and write content that\'s genuinely easier to read and understand.',
    difficulty: 'Intermediate',
    readTime: 9,
    category: 'SEO & Content',
    steps: [
      { title: 'Measure Your Baseline', content: 'Paste your text into counter and check your Readability tab. Note your Flesch score. Under 50 means most readers will struggle.' },
      { title: 'Cut Long Sentences', content: 'Find sentences over 25 words and split them. Each sentence should express one complete idea. This single change can raise your score by 10+ points.' },
      { title: 'Swap Complex Words', content: '"Utilize" → "use" | "Facilitate" → "help" | "Commence" → "start" | "Terminate" → "end" | "Methodology" → "method"' },
      { title: 'Remove Filler Words', content: '"In order to" → "to" | "Due to the fact that" → "because" | "At the present time" → "now" | "In the event that" → "if"' },
      { title: 'Vary Sentence Length', content: 'Alternate between short punchy sentences and longer explanatory ones. This creates rhythm and prevents the monotony of uniformly short or long sentences.' },
      { title: 'Re-measure and Repeat', content: 'Check your score after each revision pass. Aim for 60-70 for general web content. Academic content can be 40-60. Marketing copy: 70-80.' },
    ],
  },
  {
    slug: 'keyword-research-guide',
    title: 'Keyword Research for Content Writers: A Practical Framework',
    excerpt: 'Keyword research doesn\'t have to be complicated. This practical framework helps content writers find the right keywords without expensive tools.',
    difficulty: 'Intermediate',
    readTime: 12,
    category: 'SEO & Content',
    steps: [
      { title: 'Start with Seed Keywords', content: 'Your seed keywords are the core topics your content covers. For a word counter tool, seeds would be "word counter," "character counter," "writing tools."' },
      { title: 'Explore Autocomplete Suggestions', content: 'Type your seed keyword in Google and note the autocomplete suggestions. These are real searches people make — high intent, often low competition.' },
      { title: 'Mine "People Also Ask"', content: 'The PAA boxes in Google reveal exactly what questions your audience has. Each question is a potential H2 or H3 for your content.' },
      { title: 'Analyze Search Intent', content: 'Informational (how, what, why) | Navigational (brand + feature) | Transactional (buy, free, download) | Commercial (best, review, vs)' },
      { title: 'Check Keyword Density in Your Content', content: 'Use our Keyword Density Checker to ensure your primary keyword appears at 1-2% frequency. Secondary keywords at 0.5-1%.' },
      { title: 'Build a Keyword Map', content: 'Create a spreadsheet mapping keywords to pages. Each page should target one primary keyword and 3-5 secondary keywords. Never target the same keyword on multiple pages.' },
    ],
  },
  {
    slug: 'content-planning-template',
    title: 'Content Planning with Word Count Targets',
    excerpt: 'A strategic approach to planning content that includes word count targets, keyword mapping, and editorial calendar management.',
    difficulty: 'Advanced',
    readTime: 10,
    category: 'SEO & Content',
    steps: [
      { title: 'Define Your Content Types', content: 'Map each content type to its optimal word count. Blog posts: 1,500-2,500 | Landing pages: 800-1,200 | Product pages: 500-800 | About page: 300-500' },
      { title: 'Build Your Editorial Calendar', content: 'Plan 4-8 weeks ahead. For each piece, note: keyword, word count target, author, deadline, and publishing date.' },
      { title: 'Use Word Counts for Scoping', content: 'A 2,000-word article takes an experienced writer 3-4 hours. A 500-word page takes 1 hour. Word counts help you estimate production time accurately.' },
      { title: 'Track Performance by Length', content: 'Track organic traffic, backlinks, and engagement by content length category. This data tells you which length performs best for your specific audience.' },
    ],
  },
  {
    slug: 'advanced-analytics',
    title: 'Advanced Text Analytics: Getting More from Your Data',
    excerpt: 'Go beyond basic word counting. Learn how to use advanced metrics to make data-driven decisions about your writing.',
    difficulty: 'Advanced',
    readTime: 11,
    category: 'Writing Tools',
    steps: [
      { title: 'Vocabulary Richness Analysis', content: 'The ratio of unique words to total words (type-token ratio) measures vocabulary diversity. Academic writing: 50-70% unique. Web content: 40-60%. Fiction: 60-80%.' },
      { title: 'Sentence Length Distribution', content: 'Ideal web content has a mix: 30% short (1-10 words), 50% medium (11-20 words), 20% long (21+ words). All-short reads choppy; all-long reads academic.' },
      { title: 'Readability Trend Analysis', content: 'Check readability at 500-word intervals as you draft. If the score drops as you write, you\'re adding complexity. Time to simplify.' },
      { title: 'Keyword Saturation Points', content: 'Word density analysis helps identify when you\'ve used a keyword "enough." If your primary keyword exceeds 3%, you may be over-optimizing.' },
    ],
  },
];

export const GUIDE_CATEGORIES = ['All', 'Getting Started', 'Writing Tools', 'SEO & Content'];

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find(g => g.slug === slug);
}
