import { useMemo } from 'react';

export interface TextStats {
  charWithSpaces: number;
  charNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  readingTime: number;
  speakingTime: number;
  uniqueWords: number;
  longestWord: string;
  shortestWord: string;
  wordDensity: Array<{ word: string; count: number }>;
  fleschKincaid: number;
  avgWordLength: number;
  avgSentenceLength: number;
  totalSyllables: number;
}

const STOP_WORDS = new Set([
  "the","a","an","is","it","in","on","at","to","for","of","and","or","but",
  "as","be","was","were","are","have","has","had","do","does","did","will",
  "would","could","should","may","might","with","from","by","that","this",
  "these","those","not","no","so","if","then","than","its","their","they",
  "them","we","our","us","you","your","he","she","his","her","i","my","me"
]);

function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const match = word.match(/[aeiouy]{1,2}/g);
  return match ? match.length : 1;
}

export function useTextStats(text: string): TextStats {
  return useMemo(() => {
    const charWithSpaces = text.length;
    const charNoSpaces = text.replace(/\s+/g, '').length;
    
    // Words
    const wordMatches = text.match(/\b[a-zA-Z0-9_]+\b/g) || [];
    const words = wordMatches.length;
    
    // Sentences
    const sentenceMatches = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentences = sentenceMatches.length || 0;
    
    // Paragraphs
    const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0).length || 0;
    
    // Times
    const readingTime = Math.ceil(words / 200);
    const speakingTime = Math.ceil(words / 130);
    
    // Words analysis
    const wordCounts = new Map<string, number>();
    let longestWord = "";
    let shortestWord = "";
    let totalSyllables = 0;
    
    for (const w of wordMatches) {
      const lower = w.toLowerCase();
      wordCounts.set(lower, (wordCounts.get(lower) || 0) + 1);
      
      if (!longestWord || w.length > longestWord.length) longestWord = w;
      if (!shortestWord || (w.length < shortestWord.length && w.length > 0)) shortestWord = w;
      
      totalSyllables += countSyllables(w);
    }
    
    const uniqueWords = wordCounts.size;
    
    // Density
    const densityEntries = Array.from(wordCounts.entries())
      .filter(([w]) => !STOP_WORDS.has(w) && isNaN(Number(w)))
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));
      
    // Flesch-Kincaid
    const avgWordLength = words > 0 ? (charNoSpaces / words) : 0;
    const avgSentenceLength = sentences > 0 ? (words / sentences) : 0;
    const avgSyllablesPerWord = words > 0 ? (totalSyllables / words) : 0;
    
    let fleschKincaid = 0;
    if (words > 0 && sentences > 0) {
      fleschKincaid = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
      fleschKincaid = Math.max(0, Math.min(100, Math.round(fleschKincaid)));
    }
    
    return {
      charWithSpaces,
      charNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime,
      speakingTime,
      uniqueWords,
      longestWord,
      shortestWord,
      wordDensity: densityEntries,
      fleschKincaid,
      avgWordLength: Math.round(avgWordLength * 10) / 10,
      avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
      totalSyllables
    };
  }, [text]);
}
