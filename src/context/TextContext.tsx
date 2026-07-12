import React, { createContext, useContext, useState } from 'react';
import { useUndoRedo } from '@/hooks/useUndoRedo';

interface TextContextType {
  text: string;
  setText: (text: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  reset: (text: string) => void;
}

export const TextContext = createContext<TextContextType>({
  text: '',
  setText: () => {},
  undo: () => {},
  redo: () => {},
  canUndo: false,
  canRedo: false,
  reset: () => {},
});

export const useTextContext = () => useContext(TextContext);
