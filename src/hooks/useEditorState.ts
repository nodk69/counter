import { useState, useCallback, useEffect, useRef } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import FontFamily from '@tiptap/extension-font-family';
import FontSize from '@/extensions/FontSize';
import LineHeight from '@/extensions/LineHeight';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';

// ── Version History ─────────────────────────────────────────────────────
export interface VersionEntry {
  id: string;
  timestamp: number;
  content: string; // JSON string of TipTap content
  wordCount: number;
  snippet: string;
}

const STORAGE_KEY = 'counter-editor-content';
const VERSIONS_KEY = 'counter-editor-versions';
const MAX_VERSIONS = 10;
const AUTOSAVE_DELAY = 3000;

// All storage is SSR-guarded: `useEditor` can run during server rendering
// in some frameworks (Next.js app router SSR, static export), where
// `localStorage` doesn't exist and would throw a ReferenceError before
// React even mounts. Every localStorage touch below goes through these
// small wrappers instead of calling the API directly.
function safeGetItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    // Private-browsing Safari, disabled storage, or a corrupted profile
    // can all throw on access — treat as "nothing stored" rather than crash.
    return null;
  }
}

function safeSetItem(key: string, value: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    // Most commonly QuotaExceededError. Swallow it — losing autosave is
    // better than crashing the editor mid-keystroke. Callers that care
    // (autosave status) check the boolean return value.
    return false;
  }
}

function safeRemoveItem(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

function loadStoredContent(): string | null {
  // Try new JSON format first
  const stored = safeGetItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object' && parsed.type === 'doc') {
        return stored; // Valid TipTap JSON
      }
    } catch {
      // Not JSON — might be old plain text format, migrate it
      return null;
    }
  }

  // Try old plain-text format and migrate
  const oldText = safeGetItem('counter-text');
  if (oldText && oldText.length > 0) {
    safeRemoveItem('counter-text');
    return null; // Will be set as initial content via text
  }

  return null;
}

function getOldPlainText(): string {
  return safeGetItem('counter-text') || '';
}

function loadVersions(): VersionEntry[] {
  try {
    const raw = safeGetItem(VERSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    // Corrupted JSON in storage shouldn't take down version history.
    return [];
  }
}

function saveVersions(versions: VersionEntry[]) {
  safeSetItem(VERSIONS_KEY, JSON.stringify(versions));
}

function textToHtml(newText: string): string {
  return newText
    .split(/\n\n+/)
    .map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`)
    .join('');
}

function makeVersionId(): string {
  // Date.now().toString(36) alone can collide if two versions are created
  // within the same millisecond (unlikely here given the 3s debounce, but
  // cheap to make collision-proof).
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// ── Save Status ─────────────────────────────────────────────────────────
export type SaveStatus = 'saved' | 'saving' | 'unsaved';

// ── Hook ────────────────────────────────────────────────────────────────
export function useEditorState() {
  const [text, setTextState] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [versions, setVersions] = useState<VersionEntry[]>(loadVersions);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savingIndicatorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isResettingRef = useRef(false);
  const lastSavedContentRef = useRef<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        undoRedo: {
          depth: 100,
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Color,
      TextStyle,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer nofollow',
          class: 'editor-link',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing here…',
      }),
      CharacterCount,
      FontFamily,
      FontSize,
      LineHeight,
      Superscript,
      Subscript,
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: (() => {
      const stored = loadStoredContent();
      if (stored) {
        try { return JSON.parse(stored); } catch { /* fall through */ }
      }
      // Migrate old plain text
      const oldText = getOldPlainText();
      if (oldText) {
        return textToHtml(oldText);
      }
      return '';
    })(),
    editorProps: {
      attributes: {
        class: 'tiptap-editor',
        'aria-label': 'Text editor',
        role: 'textbox',
        'aria-multiline': 'true',
      },
      // Paste as plain text handler
      handlePaste: (view, event) => {
        // If user holds Shift, paste as plain text
        if ((event as any).shiftKey) {
          const text = event.clipboardData?.getData('text/plain');
          if (text) {
            const { from, to } = view.state.selection;
            const tr = view.state.tr.insertText(text, from, to);
            view.dispatch(tr);
            return true;
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor: ed }) => {
      if (isResettingRef.current) return;

      const plainText = ed.getText();
      const html = ed.getHTML();

      setTextState(plainText);
      setHtmlContent(html);
      setSaveStatus('unsaved');

      // Update undo/redo state
      setCanUndo(ed.can().undo());
      setCanRedo(ed.can().redo());

      // Debounced autosave (3 seconds)
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      saveTimerRef.current = setTimeout(() => {
        // The editor can be destroyed (component unmounted, navigation,
        // fast-refresh in dev) while this timeout is in flight. Calling
        // ed.getJSON()/getText() on a destroyed editor instance throws.
        if (ed.isDestroyed) return;

        const json = JSON.stringify(ed.getJSON());
        setSaveStatus('saving');
        const persisted = safeSetItem(STORAGE_KEY, json);

        // Skip writing a new version snapshot if content is identical to
        // the last saved version (e.g. user typed then undid everything) —
        // avoids burning through the 10-slot version history with no-ops.
        if (persisted && json !== lastSavedContentRef.current) {
          lastSavedContentRef.current = json;
          const wordCount = (plainText.match(/\b[a-zA-Z0-9_]+\b/g) || []).length;
          if (wordCount > 0) {
            setVersions((prev) => {
              const snippet = plainText.slice(0, 80);
              const newEntry: VersionEntry = {
                id: makeVersionId(),
                timestamp: Date.now(),
                content: json,
                wordCount,
                snippet,
              };
              const updated = [newEntry, ...prev].slice(0, MAX_VERSIONS);
              saveVersions(updated);
              return updated;
            });
          }
        }

        // Brief "saving" state for UI feedback
        if (savingIndicatorTimerRef.current) clearTimeout(savingIndicatorTimerRef.current);
        savingIndicatorTimerRef.current = setTimeout(() => setSaveStatus('saved'), 300);
      }, AUTOSAVE_DELAY);
    },
    onSelectionUpdate: ({ editor: ed }) => {
      setCanUndo(ed.can().undo());
      setCanRedo(ed.can().redo());
    },
  });

  // Extract initial text on mount
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      setTextState(editor.getText());
      setHtmlContent(editor.getHTML());
    }
  }, [editor]);

  // Flush any pending autosave on unmount instead of just clearing the
  // timer. Without this, closing the tab or navigating away within the
  // 3s debounce window silently discards the last few seconds of edits —
  // a real data-loss bug in an editor that markets itself as autosaving.
  useEffect(() => {
    return () => {
      if (savingIndicatorTimerRef.current) clearTimeout(savingIndicatorTimerRef.current);
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        if (editor && !editor.isDestroyed) {
          try {
            const json = JSON.stringify(editor.getJSON());
            safeSetItem(STORAGE_KEY, json);
          } catch {
            // best-effort flush only
          }
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── setText (backward compat — sets content as plain text) ───────────
  const setText = useCallback(
    (newText: string) => {
      if (!editor || editor.isDestroyed) return;
      editor.commands.setContent(textToHtml(newText));
    },
    [editor]
  );

  // ── reset (clears history, sets new content) ────────────────────────
  const reset = useCallback(
    (newText: string) => {
      if (!editor || editor.isDestroyed) return;
      isResettingRef.current = true;

      // Cancel any in-flight autosave — it holds a stale plainText closure
      // from before the reset and would otherwise overwrite the fresh
      // content a few seconds later.
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }

      editor.commands.setContent(textToHtml(newText));
      editor.commands.focus('start');

      // Update state synchronously
      setTextState(editor.getText());
      setHtmlContent(editor.getHTML());
      setCanUndo(false);
      setCanRedo(false);

      // Save immediately
      const json = JSON.stringify(editor.getJSON());
      safeSetItem(STORAGE_KEY, json);
      lastSavedContentRef.current = json;
      setSaveStatus('saved');

      isResettingRef.current = false;
    },
    [editor]
  );

  // ── undo / redo ─────────────────────────────────────────────────────
  const undo = useCallback(() => {
    if (!editor || editor.isDestroyed) return;
    editor.commands.undo();
  }, [editor]);

  const redo = useCallback(() => {
    if (!editor || editor.isDestroyed) return;
    editor.commands.redo();
  }, [editor]);

  // ── Version restore ─────────────────────────────────────────────────
  const restoreVersion = useCallback(
    (version: VersionEntry) => {
      if (!editor || editor.isDestroyed) return;
      try {
        const content = JSON.parse(version.content);
        editor.commands.setContent(content);
        setTextState(editor.getText());
        setHtmlContent(editor.getHTML());
        safeSetItem(STORAGE_KEY, version.content);
        lastSavedContentRef.current = version.content;
        setSaveStatus('saved');
      } catch (e) {
        console.error('Failed to restore version', e);
      }
    },
    [editor]
  );

  const clearVersions = useCallback(() => {
    setVersions([]);
    safeRemoveItem(VERSIONS_KEY);
  }, []);

  return {
    editor,
    text,
    setText,
    htmlContent,
    canUndo,
    canRedo,
    undo,
    redo,
    reset,
    saveStatus,
    versions,
    restoreVersion,
    clearVersions,
  };
}