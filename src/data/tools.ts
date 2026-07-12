export type ToolCategory = 'counting' | 'analysis' | 'time' | 'advanced';

export interface Tool {
  name: string;
  slug: string;
  shortDesc: string;
  description: string;
  icon: string;
  category: ToolCategory;
  relatedTools: string[];
  exampleText: string;
  faqs: { q: string; a: string }[];
  uses: string[];
  statFocus: string; // which stat this tool highlights
}

export const TOOLS: Tool[] = [
  {
    name: 'Word Counter',
    slug: 'word-counter',
    shortDesc: 'Count words instantly as you type',
    description: 'The most accurate free online word counter. Count words, characters, sentences, and paragraphs in real time. Perfect for essays, blog posts, social media, and any writing project.',
    icon: '📝',
    category: 'counting',
    statFocus: 'words',
    relatedTools: ['character-counter', 'sentence-counter', 'paragraph-counter', 'reading-time-calculator'],
    exampleText: 'The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once. Writers and typographers have used it for decades to test fonts and keyboards.',
    uses: ['Essays & academic papers', 'Blog posts & articles', 'Social media captions', 'Word limits & targets', 'SEO content planning'],
    faqs: [
      { q: 'What is a word counter?', a: 'A word counter is a tool that automatically counts the number of words in a piece of text. Our free online word counter also provides character counts, sentence counts, readability scores, and reading time estimates.' },
      { q: 'How accurate is this word counter?', a: 'Our word counter is 100% accurate. It counts every word separated by a space, treating contractions (like "don\'t") as one word and hyphenated words as one word.' },
      { q: 'Does it store my text?', a: 'No. All processing happens locally in your browser. We never send your text to any server, ensuring complete privacy.' },
      { q: 'Can I count words offline?', a: 'Yes! Once the page is loaded, the word counter works completely offline. Your text is never sent to our servers.' },
      { q: 'What counts as a word?', a: 'Any sequence of characters separated by whitespace counts as a word. Numbers, hyphenated-words, and contractions each count as single words.' },
    ],
  },
  {
    name: 'Character Counter',
    slug: 'character-counter',
    shortDesc: 'Count characters with and without spaces',
    description: 'Free online character counter that counts characters with and without spaces in real time. Essential for Twitter, Instagram, meta descriptions, SMS messages, and any character-limited content.',
    icon: '🔤',
    category: 'counting',
    statFocus: 'charWithSpaces',
    relatedTools: ['word-counter', 'sentence-counter', 'letter-counter'],
    exampleText: 'Twitter limits tweets to 280 characters. Instagram allows 2,200 characters for captions. Meta descriptions should be 150-160 characters for best SEO results.',
    uses: ['Twitter & X posts', 'Instagram captions', 'Meta descriptions', 'SMS messages', 'LinkedIn posts'],
    faqs: [
      { q: 'What is a character counter?', a: 'A character counter counts every character in your text, including letters, numbers, punctuation, and spaces. Some platforms have character limits, making this tool essential.' },
      { q: 'Does it count spaces?', a: 'Yes. We show two counts: characters with spaces (total characters) and characters without spaces (letters and punctuation only). Most social media platforms count spaces.' },
      { q: 'What are common character limits?', a: 'Twitter/X: 280, SMS: 160, Meta description: 160, Instagram caption: 2,200, LinkedIn post: 3,000, YouTube description: 5,000.' },
    ],
  },
  {
    name: 'Sentence Counter',
    slug: 'sentence-counter',
    shortDesc: 'Count sentences and measure sentence variety',
    description: 'Count sentences in your text instantly. Get sentence length analysis to improve readability and writing flow. Ideal for academic writers, editors, and content creators.',
    icon: '📖',
    category: 'counting',
    statFocus: 'sentences',
    relatedTools: ['word-counter', 'paragraph-counter', 'readability-checker', 'sentence-length-analyzer'],
    exampleText: 'Clear writing uses varied sentence lengths. Short sentences punch. Longer sentences, when used thoughtfully, can add rhythm and depth to your prose. Aim for variety to keep readers engaged.',
    uses: ['Academic essays', 'Content editing', 'Readability improvement', 'Grammar checking', 'Style analysis'],
    faqs: [
      { q: 'How are sentences counted?', a: 'Sentences are counted by detecting end punctuation marks (periods, exclamation marks, question marks) that are followed by a space or end of text. Abbreviations are handled intelligently.' },
      { q: 'Why count sentences?', a: 'Sentence count helps you analyze writing flow and readability. Too many long sentences make text hard to read; too many short ones feel choppy.' },
    ],
  },
  {
    name: 'Paragraph Counter',
    slug: 'paragraph-counter',
    shortDesc: 'Count paragraphs and analyze text structure',
    description: 'Count paragraphs in any text instantly. Analyze your document structure, ideal paragraph length, and content organization. Great for academic writing and blog content.',
    icon: '¶',
    category: 'counting',
    statFocus: 'paragraphs',
    relatedTools: ['word-counter', 'sentence-counter', 'paragraph-length-analyzer'],
    exampleText: 'This is the first paragraph. It introduces the main idea.\n\nThe second paragraph develops the idea further. It adds supporting details and examples.\n\nThe final paragraph wraps up the content with a conclusion.',
    uses: ['Document structure analysis', 'Essay formatting', 'Blog post planning', 'Academic writing', 'Content auditing'],
    faqs: [
      { q: 'How are paragraphs counted?', a: 'Paragraphs are counted by detecting blocks of text separated by one or more blank lines (double line breaks). Each continuous block of text counts as one paragraph.' },
      { q: 'What is the ideal paragraph length?', a: 'For web content, 2-4 sentences per paragraph is ideal. For academic writing, 5-8 sentences. Shorter paragraphs improve online readability.' },
    ],
  },
  {
    name: 'Readability Checker',
    slug: 'readability-checker',
    shortDesc: 'Measure text readability with Flesch-Kincaid',
    description: 'Check the readability of your text using the Flesch-Kincaid reading ease formula. Get an instant score and grade level to ensure your content is accessible to your target audience.',
    icon: '📊',
    category: 'analysis',
    statFocus: 'fleschScore',
    relatedTools: ['word-counter', 'sentence-counter', 'syllable-counter', 'complexity-analyzer'],
    exampleText: 'Good readability means your readers can understand your content easily. Short sentences help. Simple words help even more. Aim for a Flesch score above 60 for general audiences.',
    uses: ['Blog & web content', 'Academic papers', 'Marketing copy', 'Legal documents', 'Educational materials'],
    faqs: [
      { q: 'What is the Flesch-Kincaid reading ease score?', a: 'The Flesch Reading Ease score rates text on a 100-point scale. Higher scores mean easier to read. A score of 60-70 is considered ideal for general audiences.' },
      { q: 'What is a good readability score?', a: 'For general web content: 60-80 (easy). For newspapers: 50-60. For academic papers: 30-50. For technical manuals: 0-30.' },
      { q: 'How can I improve my readability score?', a: 'Use shorter sentences, simpler words, and active voice. Break up long paragraphs. Avoid jargon unless writing for specialists.' },
    ],
  },
  {
    name: 'Keyword Density Checker',
    slug: 'keyword-density-checker',
    shortDesc: 'Analyze keyword frequency for SEO optimization',
    description: 'Check keyword density and word frequency in your text. Optimize your content for SEO by ensuring important keywords appear at the right frequency without keyword stuffing.',
    icon: '🔑',
    category: 'analysis',
    statFocus: 'wordDensity',
    relatedTools: ['word-counter', 'word-frequency-counter', 'word-density-analyzer', 'readability-checker'],
    exampleText: 'SEO content optimization requires strategic keyword placement. Using your primary keyword naturally throughout your content helps search engines understand your topic. Keyword density should typically be 1-2% for best results.',
    uses: ['SEO content writing', 'Keyword optimization', 'Content auditing', 'Blog post optimization', 'Landing page copy'],
    faqs: [
      { q: 'What is keyword density?', a: 'Keyword density is the percentage of times a specific word or phrase appears in your text relative to the total word count. Formula: (keyword occurrences ÷ total words) × 100.' },
      { q: 'What is the ideal keyword density?', a: 'Most SEO experts recommend 1-2% keyword density. Higher percentages risk keyword stuffing, which can hurt rankings.' },
    ],
  },
  {
    name: 'Syllable Counter',
    slug: 'syllable-counter',
    shortDesc: 'Count syllables for poetry and readability',
    description: 'Count syllables in any text for poetry writing, readability analysis, and Flesch-Kincaid calculations. Essential for haiku, sonnets, and any form requiring precise syllable counts.',
    icon: '🎵',
    category: 'time',
    statFocus: 'syllables',
    relatedTools: ['word-counter', 'readability-checker', 'reading-time-calculator'],
    exampleText: 'The sun sets low, painting the sky in gold and red. Nature speaks a language only silence can hear.',
    uses: ['Poetry writing', 'Haiku composition', 'Readability analysis', 'Pronunciation guides', 'Language learning'],
    faqs: [
      { q: 'How are syllables counted?', a: 'Syllables are counted using linguistic rules: each vowel sound in a word represents one syllable. Our algorithm handles common exceptions like silent "e" and vowel combinations.' },
      { q: 'Why count syllables?', a: 'Syllable counting is essential for poetry forms like haiku (5-7-5), sonnets, and limericks. It also feeds into Flesch-Kincaid readability calculations.' },
    ],
  },
  {
    name: 'Reading Time Calculator',
    slug: 'reading-time-calculator',
    shortDesc: 'Estimate how long it takes to read your text',
    description: 'Calculate the estimated reading time for any text based on the average adult reading speed of 238 words per minute. Perfect for blog posts, articles, and presentations.',
    icon: '⏱️',
    category: 'time',
    statFocus: 'readingTime',
    relatedTools: ['word-counter', 'speaking-time-calculator', 'readability-checker'],
    exampleText: 'The average adult reads approximately 238 words per minute. A 1,000-word blog post takes about 4 minutes to read. Longer articles should include estimated reading times to set reader expectations.',
    uses: ['Blog post planning', 'Article publishing', 'Newsletter content', 'Course material design', 'Presentation timing'],
    faqs: [
      { q: 'How is reading time calculated?', a: 'Reading time is calculated by dividing the word count by the average adult reading speed of 238 words per minute (WPM). The result is shown in minutes and seconds.' },
      { q: 'What is the average reading speed?', a: 'The average adult reads 200-250 words per minute for non-technical content. Technical content is slower at 100-150 WPM.' },
    ],
  },
  {
    name: 'Speaking Time Calculator',
    slug: 'speaking-time-calculator',
    shortDesc: 'Calculate speech duration from word count',
    description: 'Calculate how long it will take to deliver a speech or presentation from your script. Based on the average speaking rate of 130 words per minute. Essential for speakers and presenters.',
    icon: '🎤',
    category: 'time',
    statFocus: 'speakingTime',
    relatedTools: ['word-counter', 'reading-time-calculator'],
    exampleText: 'A 5-minute speech contains approximately 650-700 words at normal speaking pace. A 10-minute presentation needs about 1,300 words. Practice your speech to find your natural speaking rhythm.',
    uses: ['Speech preparation', 'TED talks & presentations', 'Wedding toasts', 'Business pitches', 'Podcast scripting'],
    faqs: [
      { q: 'How is speaking time calculated?', a: 'Speaking time is calculated at 130 words per minute, which is a comfortable, clear speaking pace for presentations. This gives you a conservative estimate to avoid running over time.' },
      { q: 'How many words is a 5-minute speech?', a: 'A 5-minute speech is approximately 650-700 words at 130 WPM speaking pace. At a faster conversational pace (150 WPM), it would be about 750 words.' },
    ],
  },
  {
    name: 'Unique Word Counter',
    slug: 'unique-word-counter',
    shortDesc: 'Find unique words and measure vocabulary richness',
    description: 'Count unique words in your text and measure vocabulary richness. A high ratio of unique words indicates a rich, varied vocabulary. Great for academic writing and professional content.',
    icon: '✨',
    category: 'analysis',
    statFocus: 'uniqueWords',
    relatedTools: ['word-counter', 'word-frequency-counter', 'keyword-density-checker'],
    exampleText: 'Vocabulary variety demonstrates sophisticated writing ability. Using diverse words instead of repeating the same terms creates more engaging, professional content that readers enjoy.',
    uses: ['Vocabulary analysis', 'Academic writing', 'Content quality assessment', 'Language learning', 'Writing improvement'],
    faqs: [
      { q: 'What are unique words?', a: 'Unique words are distinct words that appear at least once in your text, counting each word only once regardless of how many times it appears.' },
      { q: 'What is a good unique word ratio?', a: 'A unique word ratio of 40-60% is generally considered good for web content. Academic writing typically shows 50-70%. Higher ratios indicate richer vocabulary.' },
    ],
  },
  {
    name: 'Line Counter',
    slug: 'line-counter',
    shortDesc: 'Count lines of text including blank lines',
    description: 'Count the total number of lines in your text, including blank lines. Useful for code, poetry, scripts, and any line-sensitive document format.',
    icon: '📏',
    category: 'counting',
    statFocus: 'lines',
    relatedTools: ['word-counter', 'paragraph-counter', 'sentence-counter'],
    exampleText: 'Line 1: Introduction\nLine 2: Main Content\nLine 3: Supporting Details\n\nLine 5: Conclusion',
    uses: ['Code files', 'Poetry & verse', 'Script formatting', 'Data files', 'Document structure'],
    faqs: [
      { q: 'How are lines counted?', a: 'Lines are counted by splitting the text on newline characters. Both empty lines and text lines are counted. A blank document has 0 lines.' },
      { q: 'Why count lines?', a: 'Line counting is useful for code files (billing, complexity), poetry (verse structure), scripts (timing), and data files (record counting).' },
    ],
  },
  {
    name: 'Page Counter',
    slug: 'page-counter',
    shortDesc: 'Estimate how many pages your text fills',
    description: 'Estimate the number of pages your text will fill when printed or formatted. Based on standard formatting: 250-275 words per page (double-spaced, Times New Roman 12pt).',
    icon: '📄',
    category: 'counting',
    statFocus: 'pages',
    relatedTools: ['word-counter', 'reading-time-calculator'],
    exampleText: 'A standard double-spaced page contains approximately 250-275 words. A 1,000-word essay is about 4 pages. A 50,000-word novel is approximately 200 pages.',
    uses: ['Essay formatting', 'Academic papers', 'Novel writing', 'Report planning', 'Manuscript submission'],
    faqs: [
      { q: 'How many words per page?', a: 'Standard academic formatting (double-spaced, 12pt Times New Roman, 1-inch margins) fits approximately 250-275 words per page. Single-spaced is roughly 500-550 words per page.' },
      { q: 'How many pages is 1000 words?', a: 'At standard double-spaced formatting (250 words/page), 1,000 words equals approximately 4 pages.' },
      { q: 'How many pages is 500 words?', a: '500 words equals approximately 2 pages at standard double-spaced formatting.' },
    ],
  },
  {
    name: 'Letter Counter',
    slug: 'letter-counter',
    shortDesc: 'Count only alphabetic characters in your text',
    description: 'Count only alphabetic letters in your text, excluding numbers, punctuation, and spaces. Useful for linguistic analysis and any task requiring pure letter counts.',
    icon: '🔡',
    category: 'counting',
    statFocus: 'letters',
    relatedTools: ['character-counter', 'word-counter', 'character-frequency-counter'],
    exampleText: 'Letters only! This text has 123 numbers and some punctuation. The letter counter ignores those and counts only a-z characters.',
    uses: ['Linguistic analysis', 'Cryptography', 'Typography', 'Language learning', 'Text analysis'],
    faqs: [
      { q: 'What is a letter counter?', a: 'A letter counter counts only alphabetic characters (a-z, A-Z), ignoring numbers, spaces, and punctuation. This differs from a character counter, which counts everything.' },
    ],
  },
  {
    name: 'Word Frequency Counter',
    slug: 'word-frequency-counter',
    shortDesc: 'Analyze how often each word appears in your text',
    description: 'Analyze word frequency distribution in your text. See which words appear most often, identify overused words, and improve your writing variety with our free word frequency counter.',
    icon: '📈',
    category: 'analysis',
    statFocus: 'wordDensity',
    relatedTools: ['word-counter', 'keyword-density-checker', 'unique-word-counter'],
    exampleText: 'The analysis shows the most frequent words in your text. The word "the" often tops the frequency list. Writers should watch out for overused words that weaken their prose.',
    uses: ['Content optimization', 'Vocabulary analysis', 'Writing improvement', 'Keyword research', 'Plagiarism detection'],
    faqs: [
      { q: 'What is word frequency?', a: 'Word frequency is how often a specific word appears in a text. The word frequency counter shows you all words ranked by their appearance count.' },
      { q: 'Why analyze word frequency?', a: 'Frequency analysis helps identify overused words, check keyword density, improve vocabulary variety, and understand the main themes in a piece of writing.' },
    ],
  },
  {
    name: 'Character Frequency Counter',
    slug: 'character-frequency-counter',
    shortDesc: 'See how often each character appears in text',
    description: 'Analyze the frequency of each character in your text. Useful for cryptography, linguistics, typography, and understanding the character composition of any text.',
    icon: '🔠',
    category: 'analysis',
    statFocus: 'charWithSpaces',
    relatedTools: ['letter-counter', 'character-counter', 'word-frequency-counter'],
    exampleText: 'In English, the letter E is the most common, followed by T, A, O, I, N, S, H, and R. This text will show the frequency of each character.',
    uses: ['Cryptography & ciphers', 'Linguistic research', 'Typography', 'Language analysis', 'Code analysis'],
    faqs: [
      { q: 'Which letters are most common in English?', a: 'In English, the most frequent letters are E (12.7%), T (9.1%), A (8.2%), O (7.5%), I (7%), N (6.7%), S (6.3%), H (6.1%), R (6%), and D (4.3%).' },
    ],
  },
  {
    name: 'Sentence Length Analyzer',
    slug: 'sentence-length-analyzer',
    shortDesc: 'Analyze average, longest, and shortest sentences',
    description: 'Analyze sentence lengths in your text to improve readability and writing style. Find the average, longest, and shortest sentence lengths. Balance short punchy sentences with longer flowing ones.',
    icon: '📐',
    category: 'analysis',
    statFocus: 'avgSentenceLen',
    relatedTools: ['sentence-counter', 'readability-checker', 'paragraph-length-analyzer'],
    exampleText: 'Short sentences are powerful. They punch. They drive points home clearly. However, longer sentences, when crafted with care and purpose, can build momentum and elaborate complex ideas with nuance.',
    uses: ['Writing style improvement', 'Academic editing', 'Content clarity', 'Readability optimization', 'Copy editing'],
    faqs: [
      { q: 'What is the ideal sentence length?', a: 'For web content, aim for an average of 15-20 words per sentence. Mix short (5-10 words) with longer sentences for rhythm. Academic writing can average 20-25 words.' },
    ],
  },
  {
    name: 'Paragraph Length Analyzer',
    slug: 'paragraph-length-analyzer',
    shortDesc: 'Analyze paragraph structure and length distribution',
    description: 'Analyze paragraph lengths and structure in your document. Find average words per paragraph, identify overly long paragraphs, and optimize your content layout for better readability.',
    icon: '📋',
    category: 'analysis',
    statFocus: 'paragraphs',
    relatedTools: ['paragraph-counter', 'sentence-length-analyzer', 'readability-checker'],
    exampleText: 'Web readers scan content. Keep paragraphs short.\n\nLonger paragraphs work well in academic and literary writing, where readers expect detailed, sustained arguments that build upon each other.\n\nAim for 2-4 sentences per paragraph for most online content.',
    uses: ['Blog optimization', 'Academic writing', 'Content structure', 'UX writing', 'Editorial review'],
    faqs: [
      { q: 'What is the ideal paragraph length for web content?', a: 'For websites and blogs, 2-4 sentences (50-100 words) per paragraph is ideal. Shorter paragraphs are easier to scan and reduce cognitive load for online readers.' },
    ],
  },
  {
    name: 'Complexity Analyzer',
    slug: 'complexity-analyzer',
    shortDesc: 'Measure text complexity and writing grade level',
    description: 'Measure the linguistic complexity and grade level of your text. Combines Flesch-Kincaid grade level, vocabulary sophistication, and sentence complexity into a comprehensive analysis.',
    icon: '🧩',
    category: 'time',
    statFocus: 'fleschScore',
    relatedTools: ['readability-checker', 'sentence-length-analyzer', 'syllable-counter'],
    exampleText: 'Complexity analysis evaluates multisyllabic vocabulary density, syntactic sophistication, and the overall cognitive demands placed upon the reader by the textual composition.',
    uses: ['Academic grade assessment', 'Content targeting', 'Education materials', 'Legal document review', 'Technical writing audit'],
    faqs: [
      { q: 'What is text complexity?', a: 'Text complexity measures how difficult a piece of writing is to understand, considering vocabulary difficulty, sentence length, and conceptual density.' },
    ],
  },
  {
    name: 'Word Density Analyzer',
    slug: 'word-density-analyzer',
    shortDesc: 'Analyze word density and distribution patterns',
    description: 'Analyze the density and distribution of words throughout your text. Identify where important terms cluster and ensure even distribution of key concepts for better readability.',
    icon: '🗺️',
    category: 'analysis',
    statFocus: 'wordDensity',
    relatedTools: ['word-frequency-counter', 'keyword-density-checker', 'word-counter'],
    exampleText: 'Density analysis reveals patterns in writing. Good writing distributes key concepts evenly. Avoid clustering all mentions of a topic in one section when spreading them throughout improves retention.',
    uses: ['SEO optimization', 'Content quality', 'Academic research', 'Marketing copy', 'Topic modeling'],
    faqs: [
      { q: 'What is word density?', a: 'Word density refers to how often specific words appear relative to the total text length, and how they are distributed throughout the document.' },
    ],
  },
  {
    name: 'Text Summarizer',
    slug: 'text-summarizer',
    shortDesc: 'Get key statistics and insights about your text',
    description: 'Get a comprehensive summary of your text with key statistics, readability metrics, top keywords, and writing insights. A complete snapshot of your content in seconds.',
    icon: '🔍',
    category: 'advanced',
    statFocus: 'words',
    relatedTools: ['word-counter', 'readability-checker', 'keyword-density-checker'],
    exampleText: 'Paste any text here to get a comprehensive analysis. The text summarizer shows word count, character count, readability score, top keywords, reading time, and much more at a glance.',
    uses: ['Content overview', 'Quick analysis', 'Research papers', 'Article review', 'Content auditing'],
    faqs: [
      { q: 'What does the text summarizer show?', a: 'Our text summarizer provides a complete snapshot: word/character/sentence counts, readability score, top keywords, reading time, speaking time, vocabulary richness, and writing complexity.' },
    ],
  },
];

export const TOOL_CATEGORIES = {
  counting: {
    label: 'Counting Tools',
    icon: '📊',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  analysis: {
    label: 'Analysis Tools',
    icon: '📈',
    color: 'text-green-700',
    bg: 'bg-green-50',
  },
  time: {
    label: 'Time Tools',
    icon: '⏱️',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
  },
  advanced: {
    label: 'Advanced Tools',
    icon: '✏️',
    color: 'text-purple-700',
    bg: 'bg-purple-50',
  },
};

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find(t => t.slug === slug);
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return TOOLS.filter(t => t.category === category);
}

export function getRelatedTools(slug: string): Tool[] {
  const tool = getToolBySlug(slug);
  if (!tool) return [];
  return tool.relatedTools.map(s => getToolBySlug(s)).filter(Boolean) as Tool[];
}
