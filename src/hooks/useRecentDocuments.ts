import { useState, useEffect, useRef } from 'react';

const KEY         = 'counter-recent-docs';
const MAX_DOCS    = 5;
const MIN_WORDS   = 15;
const SAVE_DELAY  = 20_000; // 20s after last keystroke
const MAX_STORED  = 4000;   // max chars stored per doc

export interface RecentDoc {
  id: string;
  snippet: string;    // first 80 chars, for display
  text: string;       // up to MAX_STORED chars, for restore
  wordCount: number;
  timestamp: number;
}

function loadDocs(): RecentDoc[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}

function persist(docs: RecentDoc[]) {
  localStorage.setItem(KEY, JSON.stringify(docs));
}

export function useRecentDocuments(text: string, wordCount: number) {
  const [docs, setDocs] = useState<RecentDoc[]>(loadDocs);
  const timerRef   = useRef<ReturnType<typeof setTimeout>>();
  const lastTextRef = useRef('');

  // Debounced save
  useEffect(() => {
    if (wordCount < MIN_WORDS) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (text === lastTextRef.current) return;
      lastTextRef.current = text;

      const snippet = text.trim().replace(/\s+/g, ' ').slice(0, 80);
      const stored  = text.trim().slice(0, MAX_STORED);

      const doc: RecentDoc = {
        id:        Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
        snippet,
        text:      stored,
        wordCount,
        timestamp: Date.now(),
      };

      setDocs(prev => {
        // Skip if the text is essentially the same as the most recent
        if (prev[0]?.snippet === snippet) return prev;
        const updated = [doc, ...prev.filter(d => d.snippet !== snippet)].slice(0, MAX_DOCS);
        persist(updated);
        return updated;
      });
    }, SAVE_DELAY);

    return () => clearTimeout(timerRef.current);
  }, [text, wordCount]);

  function removeDoc(id: string) {
    setDocs(prev => {
      const updated = prev.filter(d => d.id !== id);
      persist(updated);
      return updated;
    });
  }

  function clearAll() {
    localStorage.removeItem(KEY);
    setDocs([]);
  }

  return { docs, removeDoc, clearAll };
}
