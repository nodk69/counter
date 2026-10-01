export interface HowToStep {
  title: string;
  desc: string;
  tip?: string;
}

export interface ToolGuide {
  slug: string;
  heading: string;
  intro: string;
  steps: HowToStep[];
  proTip: string;
  commonMistake: string;
}

export const TOOL_GUIDES: Record<string, ToolGuide> = {
  'word-counter': {
    slug: 'word-counter',
    heading: 'How to Use the Online Word Counter',
    intro: 'Accurately track your word count, character totals, and document volume in real time as you write.',
    steps: [
      {
        title: 'Input Your Text',
        desc: 'Type directly into the editor, paste clipboard content, or upload a .txt / .md document using the toolbar upload button.',
      },
      {
        title: 'Monitor Live Metrics',
        desc: 'Glance at the right sidebar to track total words, characters with/without spaces, sentences, and estimated reading time.',
      },
      {
        title: 'Inspect Deep Analysis',
        desc: 'Click "Show Analysis" beneath the editor to evaluate content score, passive voice percentage, and readability grade level.',
      },
      {
        title: 'Export or Copy',
        desc: 'Download your finalized text along with statistical breakdown as a PDF, DOCX, Markdown, or copy clean text with one click.',
      },
    ],
    proTip: 'For web publishing, aim for concise 15–20 word sentences to maintain high engagement and low bounce rates.',
    commonMistake: 'Relying on word count alone without checking sentence rhythm and paragraph density.',
  },

  'character-counter': {
    slug: 'character-counter',
    heading: 'How to Use the Character Counter',
    intro: 'Keep your social media posts, ads, and metadata strictly within character limits.',
    steps: [
      {
        title: 'Paste Your Draft',
        desc: 'Enter your headline, tweet, meta description, or SMS copy into the workspace.',
      },
      {
        title: 'Check Character Metrics',
        desc: 'Review total characters with spaces (standard platform limit) and characters excluding spaces in the stats panel.',
      },
      {
        title: 'Compare with Platform Benchmarks',
        desc: 'Reference the built-in platform limit table below to ensure your text fits Twitter (280), Meta descriptions (155), or LinkedIn.',
      },
      {
        title: 'Trim and Copy',
        desc: 'Edit words until your character counter hits the green optimal zone, then copy instantly.',
      },
    ],
    proTip: 'Search engines count character pixels, but staying between 150–155 characters guarantees zero truncation on mobile SERPs.',
    commonMistake: 'Forgetting that emojis and special unicode symbols can consume multiple characters on social platforms.',
  },

  'sentence-counter': {
    slug: 'sentence-counter',
    heading: 'How to Use the Sentence Counter',
    intro: 'Analyze sentence volume and pacing to make your writing rhythmic, engaging, and clear.',
    steps: [
      {
        title: 'Load Your Document',
        desc: 'Paste your draft essay, article, or manuscript into the editor.',
      },
      {
        title: 'View Sentence Count & Average Length',
        desc: 'Check total sentences and average words-per-sentence calculated in real time in the sidebar.',
      },
      {
        title: 'Audit Sentence Variety',
        desc: 'Open "Deep Analysis" to see sentence length distribution and identify clusters of monotonous phrasing.',
      },
      {
        title: 'Refine Your Rhythm',
        desc: 'Break up compound run-on sentences with periods and mix short punchy sentences with longer descriptive passages.',
      },
    ],
    proTip: 'Alternate between short (6–10 words) and medium (14–18 words) sentences to give your prose a natural musical cadence.',
    commonMistake: 'Overusing semicolons and coordinating conjunctions, which artificially inflates sentence length.',
  },

  'paragraph-counter': {
    slug: 'paragraph-counter',
    heading: 'How to Use the Paragraph Counter',
    intro: 'Structure your document layout with optimal paragraph breaks for effortless scanning.',
    steps: [
      {
        title: 'Paste Text with Line Breaks',
        desc: 'Input your content into the editor, ensuring double returns between distinct thoughts.',
      },
      {
        title: 'Inspect Paragraph Distribution',
        desc: 'Observe the total paragraph count and average sentences per paragraph in the stats overview.',
      },
      {
        title: 'Optimize for Web Scannability',
        desc: 'Ensure no single paragraph exceeds 3–4 sentences on desktop to avoid intimidating wall-of-text fatigue.',
      },
      {
        title: 'Save or Export',
        desc: 'Export your formatted document with clean spacing intact to Markdown or Word.',
      },
    ],
    proTip: 'On mobile screens, a 3-sentence paragraph fills almost an entire viewport. Keep online paragraphs under 50–70 words.',
    commonMistake: 'Writing single-sentence paragraphs repeatedly, which makes content feel disjointed and shallow.',
  },

  'readability-checker': {
    slug: 'readability-checker',
    heading: 'How to Check Readability Scores',
    intro: 'Calculate Flesch Reading Ease and Flesch-Kincaid Grade level to match your target audience.',
    steps: [
      {
        title: 'Add Your Content',
        desc: 'Type or paste a minimum of 50 words to ensure statistically reliable readability indexing.',
      },
      {
        title: 'Read Your Flesch Score',
        desc: 'View the 0–100 readability gauge in the sidebar. Higher scores (60–80) indicate easy-to-read prose.',
      },
      {
        title: 'Check Multiple Readability Formulas',
        desc: 'Expand the Readability tab in Deep Analysis to see Gunning Fog, Coleman-Liau, Dale-Chall, and SMOG indices.',
      },
      {
        title: 'Simplify Vocabulary & Syntax',
        desc: 'Replace multi-syllable jargon with common words and shorten sentences until your target grade level is reached.',
      },
    ],
    proTip: 'General online articles should target a Flesch score of 60–70 (Grade 7–8) for maximum comprehension and organic reach.',
    commonMistake: 'Writing in passive voice and nominalizations, which rapidly drags readability scores down.',
  },

  'keyword-density-checker': {
    slug: 'keyword-density-checker',
    heading: 'How to Check Keyword Density for SEO',
    intro: 'Measure keyword frequency and prevent search engine over-optimization penalties.',
    steps: [
      {
        title: 'Input Your SEO Draft',
        desc: 'Paste your blog post, landing page, or product description into the editor.',
      },
      {
        title: 'Open the Word Density Tab',
        desc: 'Click "Show Analysis" and select the "Word Density" tab to see top 1-word, 2-word, and 3-word phrases.',
      },
      {
        title: 'Check Primary Keyword Ratios',
        desc: 'Verify that your primary target keyword sits within the safe 1.0% to 2.0% density range.',
      },
      {
        title: 'Adjust Keyword Distribution',
        desc: 'If a keyword exceeds 2.5%, replace repetitive mentions with synonyms (LSI terms) to maintain natural phrasing.',
      },
    ],
    proTip: 'Search algorithms favor topical depth over repetition. Spread semantic variations across headings and body copy.',
    commonMistake: 'Focusing exclusively on single-word density while ignoring 2-word and 3-word phrase repetition.',
  },

  'syllable-counter': {
    slug: 'syllable-counter',
    heading: 'How to Count Syllables for Poetry & Prose',
    intro: 'Calculate exact syllable metrics for poetic meters (Haiku, Sonnets), lyrics, and linguistic analysis.',
    steps: [
      {
        title: 'Enter Words or Lines',
        desc: 'Type your poem, lyrics, or speech passage into the editor.',
      },
      {
        title: 'Review Total Syllables',
        desc: 'Check the syllable total and average syllables per word in the text stats overview.',
      },
      {
        title: 'Verify Line-by-Line Meter',
        desc: 'For structured poetry (e.g. 5-7-5 Haiku), adjust phrasing until each line hits the exact required syllable cadence.',
      },
      {
        title: 'Check Monosyllabic vs Polysyllabic Split',
        desc: 'Inspect the Text Stats panel to see the ratio of simple single-syllable words to complex multi-syllable words.',
      },
    ],
    proTip: 'Words ending in silent "e" or blended diphthongs are dynamically calculated using English linguistic exception tables.',
    commonMistake: 'Relying on letter count rather than phonetic vowel sounds to estimate syllable counts.',
  },

  'reading-time-calculator': {
    slug: 'reading-time-calculator',
    heading: 'How to Calculate Reading Time',
    intro: 'Estimate how long it will take readers to finish your article, newsletter, or chapter.',
    steps: [
      {
        title: 'Paste Full Article Text',
        desc: 'Insert your complete article including headings and bullet points.',
      },
      {
        title: 'Read Estimated Time',
        desc: 'View the instant reading time calculation computed at the standard 238 words-per-minute adult reading pace.',
      },
      {
        title: 'Calibrate by Target Audience',
        desc: 'For technical, medical, or legal content, expect readers to read closer to 130–150 WPM.',
      },
      {
        title: 'Add Read-Time Badge to Meta',
        desc: 'Use the calculated duration in your blog header (e.g., "5 min read") to set clear reader expectations.',
      },
    ],
    proTip: 'Displaying an accurate 3–7 minute read time on your blog increases article click-through and completion rates by up to 40%.',
    commonMistake: 'Assuming speed-readers represent your general audience—always calibrate for average comprehension speeds.',
  },

  'speaking-time-calculator': {
    slug: 'speaking-time-calculator',
    heading: 'How to Calculate Speech Duration',
    intro: 'Time your keynote, wedding toast, podcast script, or presentation to never run over schedule.',
    steps: [
      {
        title: 'Paste Speech Script',
        desc: 'Enter your prepared speech notes or presentation transcript.',
      },
      {
        title: 'Check Speech Duration',
        desc: 'Observe speaking time calculated at 130 words per minute (the standard pacing for clear stage delivery).',
      },
      {
        title: 'Factor in Pauses & Slides',
        desc: 'Add 15–20% buffer time for slide transitions, audience laughter, emphasis pauses, and Q&A.',
      },
      {
        title: 'Rehearse with Live Word Tracking',
        desc: 'Trim content sections if your word count exceeds the allocated slot (e.g., 650 words for a 5-minute talk).',
      },
    ],
    proTip: 'For professional keynotes, write at 120–130 WPM. For casual podcast conversation, write at 150 WPM.',
    commonMistake: 'Speaking too fast during rehearsals to force 1,000 words into a 5-minute presentation window.',
  },

  'unique-word-counter': {
    slug: 'unique-word-counter',
    heading: 'How to Measure Vocabulary Richness',
    intro: 'Identify unique vocabulary words and measure lexical diversity to elevate academic and editorial quality.',
    steps: [
      {
        title: 'Insert Text Sample',
        desc: 'Paste your essay, manuscript chapter, or article into the editor.',
      },
      {
        title: 'Inspect Unique Word Count',
        desc: 'View total unique words vs total words in the text metrics panel.',
      },
      {
        title: 'Check Vocabulary Diversity %',
        desc: 'In Deep Analysis, review your lexical diversity ratio (unique words divided by total words).',
      },
      {
        title: 'Diversify Repetitive Phrasing',
        desc: 'Use the Word Frequency list to spot overused terms and replace them with precise contextual vocabulary.',
      },
    ],
    proTip: 'A vocabulary diversity score of 50–70% is standard for engaging non-fiction, while higher scores indicate rich literary prose.',
    commonMistake: 'Substituting simple words with obscure thesaurus words in ways that sound unnatural to the reader.',
  },

  'line-counter': {
    slug: 'line-counter',
    heading: 'How to Count Lines of Text',
    intro: 'Count total lines, non-empty lines, and verse breaks for code, poetry, and structured scripts.',
    steps: [
      {
        title: 'Paste Multi-line Content',
        desc: 'Insert your script, poetry, code block, or dataset into the workspace.',
      },
      {
        title: 'Check Total Line Count',
        desc: 'View the line count metric computed by newline delimiters in real time.',
      },
      {
        title: 'Format Line Breaks',
        desc: 'Use the editor toolbar to clean up trailing whitespace and normalize paragraph spacing.',
      },
      {
        title: 'Export Formatted Output',
        desc: 'Download your clean line-delimited file as plain text (.txt).',
      },
    ],
    proTip: 'Use Shift + Enter in the editor to create soft line breaks without starting a new paragraph block.',
    commonMistake: 'Confusing visual word wrapping on narrow screens with actual hard newline breaks.',
  },

  'page-counter': {
    slug: 'page-counter',
    heading: 'How to Estimate Page Counts',
    intro: 'Convert word and character counts into estimated standard formatted book or essay pages.',
    steps: [
      {
        title: 'Paste Your Manuscript or Essay',
        desc: 'Input your draft text into the counter.',
      },
      {
        title: 'Review Estimated Pages',
        desc: 'View estimated pages calculated using the industry standard of 250 words per double-spaced page (Times New Roman 12pt).',
      },
      {
        title: 'Compare Single vs Double Spacing',
        desc: 'Reference the page conversion guide below for single-spaced (500 words/page) requirements.',
      },
      {
        title: 'Export to Word (.docx)',
        desc: 'Download a formatted DOCX file with standard 1-inch margins ready for printing or submission.',
      },
    ],
    proTip: 'A 50,000-word novel manuscript is approximately 200 formatted paperback pages.',
    commonMistake: 'Assuming page counts in different word processors match without verifying font size and line spacing.',
  },

  'letter-counter': {
    slug: 'letter-counter',
    heading: 'How to Count Pure Alphabetic Letters',
    intro: 'Filter out spaces, digits, and punctuation marks to count pure alphabetic characters.',
    steps: [
      {
        title: 'Input Your Text',
        desc: 'Paste any alphanumeric text, code string, or passage into the editor.',
      },
      {
        title: 'View Pure Letter Count',
        desc: 'Check the letter count metric, which isolates [A-Z, a-z] and ignores punctuation or spaces.',
      },
      {
        title: 'Compare with Total Characters',
        desc: 'Observe the difference between total character length and pure letter volume.',
      },
      {
        title: 'Copy or Clear',
        desc: 'Copy your text or clear the editor to process another snippet.',
      },
    ],
    proTip: 'Essential for word puzzle games, linguistic ciphers, and acronym constraint verification.',
    commonMistake: 'Using pure letter counts for SMS or Twitter character limits where spaces and punctuation are strictly counted.',
  },

  'word-frequency-counter': {
    slug: 'word-frequency-counter',
    heading: 'How to Analyze Word Frequency',
    intro: 'Identify repetitive words, keyword patterns, and vocabulary habits across your text.',
    steps: [
      {
        title: 'Paste Text Sample',
        desc: 'Enter an article, transcript, or chapter into the workspace.',
      },
      {
        title: 'Inspect Frequency Ranking',
        desc: 'Open "Show Analysis" > "Word Density" to view words ranked from highest to lowest occurrences.',
      },
      {
        title: 'Identify Crutch Words',
        desc: 'Look for overused filler words (e.g., "very", "really", "just", "that") in the top frequency table.',
      },
      {
        title: 'Prune Repetitive Terms',
        desc: 'Edit words directly in the editor and watch frequency bars update in real time.',
      },
    ],
    proTip: 'The stopword filter automatically hides common grammatical glue words (the, a, is) so you can focus on core semantic terms.',
    commonMistake: 'Editing out all repeated words—essential thematic keywords should appear naturally across key sections.',
  },

  'character-frequency-counter': {
    slug: 'character-frequency-counter',
    heading: 'How to Count Character Frequency',
    intro: 'Map character distribution and individual letter occurrences for cryptography and typography.',
    steps: [
      {
        title: 'Input Text or Cipher',
        desc: 'Paste your sample passage into the editor.',
      },
      {
        title: 'Review Letter Distribution',
        desc: 'Inspect character frequency counts to identify the most common vowels and consonants.',
      },
      {
        title: 'Analyze Linguistic Patterns',
        desc: 'Compare your text against standard English letter frequencies (E: ~12.7%, T: ~9.1%, A: ~8.2%).',
      },
      {
        title: 'Export Statistical Summary',
        desc: 'Download your full statistical report as a PDF or JSON data file.',
      },
    ],
    proTip: 'Useful for frequency analysis in classical substitution ciphers and font glyph set audits.',
    commonMistake: 'Overlooking case sensitivity when analyzing cryptographic letter frequency.',
  },

  'sentence-length-analyzer': {
    slug: 'sentence-length-analyzer',
    heading: 'How to Analyze Sentence Length & Variety',
    intro: 'Diagnose run-on sentences, short fragments, and average sentence length for optimal pacing.',
    steps: [
      {
        title: 'Paste Your Prose',
        desc: 'Input an article, essay, or book excerpt into the workspace.',
      },
      {
        title: 'Review Average Sentence Length',
        desc: 'Check the average words-per-sentence metric in the stats overview.',
      },
      {
        title: 'Inspect Sentence Distribution',
        desc: 'In Deep Analysis, check the sentence variety bar to see short (<10 words), medium (10–20 words), and long (>25 words) ratios.',
      },
      {
        title: 'Balance Sentence Cadence',
        desc: 'Shorten overly long sentences exceeding 30 words to prevent reader fatigue.',
      },
    ],
    proTip: 'A great paragraph combines a 6-word opening punch with a 16-word explanatory follow-up and an 8-word conclusion.',
    commonMistake: 'Keeping every sentence at the exact same length (e.g. 15 words each), which creates a robotic reading experience.',
  },

  'paragraph-length-analyzer': {
    slug: 'paragraph-length-analyzer',
    heading: 'How to Optimize Paragraph Length',
    intro: 'Improve mobile readability and content scanning by tracking average paragraph volume.',
    steps: [
      {
        title: 'Paste Your Document',
        desc: 'Insert your formatted draft with clear paragraph breaks.',
      },
      {
        title: 'Check Words per Paragraph',
        desc: 'Review total paragraphs and average words per paragraph in the sidebar.',
      },
      {
        title: 'Break Down Dense Sections',
        desc: 'Split any paragraph with more than 100 words into two smaller conceptual units.',
      },
      {
        title: 'Verify Visual Whitespace',
        desc: 'Ensure consistent whitespace balance between subheadings and text blocks.',
      },
    ],
    proTip: 'Web readers scan the first 3 words of each paragraph. Lead every paragraph with its core point.',
    commonMistake: 'Creating giant 8-sentence academic blocks that force mobile readers to scroll without visual pauses.',
  },

  'complexity-analyzer': {
    slug: 'complexity-analyzer',
    heading: 'How to Measure Text Complexity',
    intro: 'Combine Flesch-Kincaid, Dale-Chall, and vocabulary metrics to ensure your writing matches your audience.',
    steps: [
      {
        title: 'Input Your Text',
        desc: 'Paste a draft of at least 100 words for an accurate linguistic assessment.',
      },
      {
        title: 'View Content Score & Grade Level',
        desc: 'Check the 0–100 Content Score and target grade level calculated in the stats panel.',
      },
      {
        title: 'Audit Passive Voice & Weasel Words',
        desc: 'Open Deep Analysis to see the percentage of passive verbs and vague filler qualifiers.',
      },
      {
        title: 'Refine and Simplify',
        desc: 'Convert passive phrasing to active voice and replace obscure vocabulary until your score hits "Excellent".',
      },
    ],
    proTip: 'Active voice with strong action verbs instantly lowers reading friction without dumbing down your core message.',
    commonMistake: 'Assuming high complexity equals high intelligence—the clearest writers explain deep concepts simply.',
  },

  'word-density-analyzer': {
    slug: 'word-density-analyzer',
    heading: 'How to Analyze Word Density Patterns',
    intro: 'Map keyword distribution to ensure even concept coverage and prevent keyword clustering.',
    steps: [
      {
        title: 'Paste Your Document',
        desc: 'Insert your landing page, article, or marketing copy into the workspace.',
      },
      {
        title: 'Examine Top Word Percentages',
        desc: 'Open the Word Density tab to see frequency bars and exact percentage weights of top terms.',
      },
      {
        title: 'Balance Topic Distribution',
        desc: 'Ensure your primary concepts appear consistently across the intro, body, and conclusion.',
      },
      {
        title: 'Export Density Audit',
        desc: 'Download your keyword analysis as a PDF report or Markdown summary.',
      },
    ],
    proTip: 'Keep your primary keyword between 1.2% and 1.8% for modern semantic SEO balance.',
    commonMistake: 'Clustering all mentions of a keyword into a single section instead of weaving it through the entire document.',
  },

  'text-summarizer': {
    slug: 'text-summarizer',
    heading: 'How to Get a Complete Text Summary',
    intro: 'Get an instant holistic snapshot of word counts, readability indices, top keywords, and reading times in one view.',
    steps: [
      {
        title: 'Paste Any Document',
        desc: 'Insert your article, essay, notes, or report into the editor.',
      },
      {
        title: 'Inspect the Executive Overview',
        desc: 'Instantly view word count, character count, readability grade, reading time, and speaking time.',
      },
      {
        title: 'Review Deep Insights & Tips',
        desc: 'Click "Show Analysis" to see automated writing tips on vocabulary variety, passive voice, and sentence rhythm.',
      },
      {
        title: 'Export Full Summary Report',
        desc: 'Download a publication-ready PDF report or structured Markdown summary for your team or clients.',
      },
    ],
    proTip: 'Use the export feature to generate instant proof-of-work documentation with timestamps and metrics for client billing.',
    commonMistake: 'Overlooking the reading time calculation when planning presentation agendas and speaking time slots.',
  },
};

export function getToolGuide(slug: string): ToolGuide | undefined {
  return TOOL_GUIDES[slug] || TOOL_GUIDES['word-counter'];
}
