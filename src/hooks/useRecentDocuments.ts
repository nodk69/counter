import { useState, useEffect, useRef } from 'react';

const KEY         = 'counter-recent-docs';
const MAX_DOCS    = 5;
const MIN_WORDS   = 15;
const SAVE_DELAY  = 20_000; // 20s after last keystroke
const MAX_STORED  = 4000;   // max chars stored per doc
const DEDUPE_COMPARE_LEN = 500; // compare more than just the 80-char snippet

export interface RecentDoc {
  id: string;
  snippet: string;    // first 80 chars, for display
  text: string;       // up to MAX_STORED chars, for restore
  wordCount: number;
  timestamp: number;
}

// SSR guard: this hook's initial state calls loadDocs() synchronously
// inside useState's lazy initializer, which runs during render. If this
// component is ever server-rendered, `localStorage` won't exist and would
// throw before React even has a chance to mount.
function loadDocs(): RecentDoc[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || '[]');
  } catch {
    // Corrupted JSON or storage access denied — start fresh rather than crash.
    return [];
  }
}

function persist(docs: RecentDoc[]): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(docs));
    return true;
  } catch {
    // Quota exceeded, private browsing, etc. — the in-memory list still
    // works for the current session even if it can't be persisted.
    return false;
  }
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

      const trimmed = text.trim();
      const snippet  = trimmed.replace(/\s+/g, ' ').slice(0, 80);
      const stored   = trimmed.slice(0, MAX_STORED);
      const compareKey = trimmed.slice(0, DEDUPE_COMPARE_LEN);

      const doc: RecentDoc = {
        id:        Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
        snippet,
        text:      stored,
        wordCount,
        timestamp: Date.now(),
      };

      setDocs(prev => {
        // Dedupe against a longer prefix than the 80-char display snippet.
        // Two different documents that happen to share their first 80
        // characters (a common template opener, boilerplate heading, etc.)
        // were previously treated as "the same document" and silently
        // dropped instead of both being tracked.
        const prevCompareKey = prev[0]?.text.slice(0, DEDUPE_COMPARE_LEN);
        if (prevCompareKey === compareKey) return prev;

        const updated = [
          doc,
          ...prev.filter(d => d.text.slice(0, DEDUPE_COMPARE_LEN) !== compareKey),
        ].slice(0, MAX_DOCS);
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
    if (typeof window !== 'undefined') {
      try { window.localStorage.removeItem(KEY); } catch { /* ignore */ }
    }
    setDocs([]);
  }

  return { docs, removeDoc, clearAll };
}