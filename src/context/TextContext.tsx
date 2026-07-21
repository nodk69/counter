import { createContext, useContext } from 'react';
import type { Editor } from '@tiptap/react';
import type { SaveStatus, VersionEntry } from '@/hooks/useEditorState';
import type { WritingMode } from '@/hooks/useContentAnalysis';

export interface TextContextType {
  /** Plain text extracted from the editor (for stats, analysis, etc.) */
  text: string;
  /** Set plain text content — for backward compat, sets editor content */
  setText: (text: string) => void;
  /** HTML content from the editor */
  htmlContent: string;
  /** Reference to the TipTap editor instance */
  editor: Editor | null;
  /** Undo last action */
  undo: () => void;
  /** Redo last undone action */
  redo: () => void;
  /** Whether undo is available */
  canUndo: boolean;
  /** Whether redo is available */
  canRedo: boolean;
  /** Reset editor with new text content (clears history) */
  reset: (text: string) => void;
  /** Autosave status */
  saveStatus: SaveStatus;
  /** Version history entries */
  versions: VersionEntry[];
  /** Restore a version */
  restoreVersion: (v: VersionEntry) => void;
  /** Clear all versions */
  clearVersions: () => void;
  /** Shared writing mode used by analysis surfaces */
  mode: WritingMode;
  /** Update the shared writing mode */
  setMode: (mode: WritingMode) => void;
}

export const TextContext = createContext<TextContextType>({
  text: '',
  setText: () => {},
  htmlContent: '',
  editor: null,
  undo: () => {},
  redo: () => {},
  canUndo: false,
  canRedo: false,
  reset: () => {},
  saveStatus: 'saved',
  versions: [],
  restoreVersion: () => {},
  clearVersions: () => {},
  mode: 'general',
  setMode: () => {},
});

export const useTextContext = () => useContext(TextContext);
