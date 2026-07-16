import { useState, useCallback, useEffect, useRef } from 'react';

const DEBOUNCE_MS = 500;
const MAX_HISTORY = 50;

export function useUndoRedo(initialText = '') {
  const [text, setText] = useState(initialText);
  const historyRef = useRef<string[]>([initialText]);
  const pointerRef = useRef<number>(0);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const history = historyRef.current;
      const pointer = pointerRef.current;

      if (text !== history[pointer]) {
        const newHistory = history.slice(0, pointer + 1);
        newHistory.push(text);
        if (newHistory.length > MAX_HISTORY) {
          newHistory.shift();
        }
        historyRef.current = newHistory;
        pointerRef.current = newHistory.length - 1;

        setCanUndo(pointerRef.current > 0);
        setCanRedo(pointerRef.current < historyRef.current.length - 1);
      }
    }, DEBOUNCE_MS);
    debounceTimerRef.current = timer;
    return () => clearTimeout(timer);
  }, [text]);

  const undo = useCallback(() => {
    if (pointerRef.current > 0) {
      pointerRef.current -= 1;
      setText(historyRef.current[pointerRef.current]);
      setCanUndo(pointerRef.current > 0);
      setCanRedo(pointerRef.current < historyRef.current.length - 1);
    }
  }, []);

  const redo = useCallback(() => {
    if (pointerRef.current < historyRef.current.length - 1) {
      pointerRef.current += 1;
      setText(historyRef.current[pointerRef.current]);
      setCanUndo(pointerRef.current > 0);
      setCanRedo(pointerRef.current < historyRef.current.length - 1);
    }
  }, []);

  const reset = useCallback((newText: string) => {
    // If a debounced history-push was pending (user typed, then called
    // reset() within 500ms — e.g. loading a saved document right after
    // typing a search query into an unrelated field), that pending timer
    // would otherwise fire *after* reset and push the stale pre-reset text
    // onto the fresh history, corrupting it. Cancel it explicitly.
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    setText(newText);
    historyRef.current = [newText];
    pointerRef.current = 0;
    setCanUndo(false);
    setCanRedo(false);
  }, []);

  return { text, setText, undo, canUndo, redo, canRedo, reset };
}