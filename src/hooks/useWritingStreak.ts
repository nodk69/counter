import { useState, useEffect } from 'react';

const KEY_LAST  = 'counter-streak-last';
const KEY_COUNT = 'counter-streak-count';
const KEY_MAX   = 'counter-streak-max';
const MIN_WORDS_FOR_STREAK = 20;

/** Returns YYYY-MM-DD in the user's LOCAL timezone (not UTC). */
function localDateStr(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function localYesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return localDateStr(d);
}

// SSR guard + error containment, same rationale as the other storage-backed
// hooks in this project: useState's lazy initializers below run during
// render, before any effect, so an unguarded localStorage read here would
// throw on the server and on any browser with storage disabled/blocked.
function safeGetItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Quota exceeded or storage disabled — streak just won't persist
    // this update; not worth crashing the editor over.
  }
}

export interface StreakData {
  streak: number;
  longestStreak: number;
  isStreakDay: boolean; // true if streak was incremented today
}

/**
 * @param wordCount pre-computed word count (pass the same value used
 *   elsewhere, e.g. from useTextStats). Previously this hook recomputed
 *   its own word count via `text.trim().split(/\s+/)` on every text
 *   change — duplicate work the app was already doing elsewhere, and a
 *   slightly different tokenization rule (whitespace-split vs. the
 *   \b[a-zA-Z0-9_]+\b regex used by the stats hook), so the two hooks
 *   could disagree near the threshold. Accepting it as a parameter keeps
 *   "how many words are in this doc" defined in exactly one place.
 */
export function useWritingStreak(wordCount: number): StreakData {
  const [streak, setStreak] = useState(() =>
    parseInt(safeGetItem(KEY_COUNT) || '0', 10)
  );
  const [longestStreak, setLongest] = useState(() =>
    parseInt(safeGetItem(KEY_MAX) || '0', 10)
  );
  const [isStreakDay, setIsStreakDay] = useState(
    () => safeGetItem(KEY_LAST) === localDateStr()
  );

  useEffect(() => {
    // Need at least MIN_WORDS_FOR_STREAK words before we log activity
    if (wordCount < MIN_WORDS_FOR_STREAK) return;

    const today    = localDateStr();
    const lastDate = safeGetItem(KEY_LAST) || '';

    // Already logged today — just make sure isStreakDay is true
    if (lastDate === today) {
      setIsStreakDay(true);
      return;
    }

    // New day — compute new streak count
    const prev    = parseInt(safeGetItem(KEY_COUNT) || '0', 10);
    const prevMax = parseInt(safeGetItem(KEY_MAX)   || '0', 10);

    // Consecutive? Yesterday was the last write date
    const newCount = lastDate === localYesterdayStr() ? prev + 1 : 1;
    const newMax   = Math.max(newCount, prevMax);

    safeSetItem(KEY_LAST,  today);
    safeSetItem(KEY_COUNT, String(newCount));
    safeSetItem(KEY_MAX,   String(newMax));

    setStreak(newCount);
    setLongest(newMax);
    setIsStreakDay(true);
  }, [wordCount]);

  return { streak, longestStreak, isStreakDay };
}