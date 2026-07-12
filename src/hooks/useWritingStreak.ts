import { useState, useEffect } from 'react';

const KEY_LAST  = 'counter-streak-last';
const KEY_COUNT = 'counter-streak-count';
const KEY_MAX   = 'counter-streak-max';

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

export interface StreakData {
  streak: number;
  longestStreak: number;
  isStreakDay: boolean; // true if streak was incremented today
}

export function useWritingStreak(text: string): StreakData {
  const [streak, setStreak] = useState(() =>
    parseInt(localStorage.getItem(KEY_COUNT) || '0', 10)
  );
  const [longestStreak, setLongest] = useState(() =>
    parseInt(localStorage.getItem(KEY_MAX) || '0', 10)
  );
  const [isStreakDay, setIsStreakDay] = useState(
    () => localStorage.getItem(KEY_LAST) === localDateStr()
  );

  useEffect(() => {
    // Need at least 20 words before we log activity
    if (text.trim().split(/\s+/).filter(Boolean).length < 20) return;

    const today    = localDateStr();
    const lastDate = localStorage.getItem(KEY_LAST) || '';

    // Already logged today — just make sure isStreakDay is true
    if (lastDate === today) {
      setIsStreakDay(true);
      return;
    }

    // New day — compute new streak count
    const prev    = parseInt(localStorage.getItem(KEY_COUNT) || '0', 10);
    const prevMax = parseInt(localStorage.getItem(KEY_MAX)   || '0', 10);

    // Consecutive? Yesterday was the last write date
    const newCount = lastDate === localYesterdayStr() ? prev + 1 : 1;
    const newMax   = Math.max(newCount, prevMax);

    localStorage.setItem(KEY_LAST,  today);
    localStorage.setItem(KEY_COUNT, String(newCount));
    localStorage.setItem(KEY_MAX,   String(newMax));

    setStreak(newCount);
    setLongest(newMax);
    setIsStreakDay(true);
  }, [text]);

  return { streak, longestStreak, isStreakDay };
}
