import { useState, useCallback, useEffect, useRef } from 'react';

export function useUndoRedo(initialText = '') {
  const [text, setText] = useState(initialText);
  const historyRef = useRef<string[]>([initialText]);
  const pointerRef = useRef<number>(0);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const history = historyRef.current;
      const pointer = pointerRef.current;
      
      if (text !== history[pointer]) {
        const newHistory = history.slice(0, pointer + 1);
        newHistory.push(text);
        if (newHistory.length > 50) {
          newHistory.shift();
        }
        historyRef.current = newHistory;
        pointerRef.current = newHistory.length - 1;
        
        setCanUndo(pointerRef.current > 0);
        setCanRedo(pointerRef.current < historyRef.current.length - 1);
      }
    }, 500);
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
    setText(newText);
    historyRef.current = [newText];
    pointerRef.current = 0;
    setCanUndo(false);
    setCanRedo(false);
  }, []);

  return { text, setText, undo, canUndo, redo, canRedo, reset };
}
