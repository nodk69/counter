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

function loadStoredContent(): string | null {
  // Try new JSON format first
  const stored = localStorage.getItem(STORAGE_KEY);
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
  const oldText = localStorage.getItem('counter-text');
  if (oldText && oldText.length > 0) {
    localStorage.removeItem('counter-text');
    return null; // Will be set as initial content via text
  }

  return null;
}

function getOldPlainText(): string {
  return localStorage.getItem('counter-text') || '';
}

function loadVersions(): VersionEntry[] {
  try {
    const raw = localStorage.getItem(VERSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveVersions(versions: VersionEntry[]) {
  localStorage.setItem(VERSIONS_KEY, JSON.stringify(versions));
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
  const isResettingRef = useRef(false);

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
    ],
    content: (() => {
      const stored = loadStoredContent();
      if (stored) {
        try { return JSON.parse(stored); } catch { /* fall through */ }
      }
      // Migrate old plain text
      const oldText = getOldPlainText();
      if (oldText) {
        const paragraphs = oldText.split(/\n\n+/).map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
        return paragraphs;
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
        const json = JSON.stringify(ed.getJSON());
        setSaveStatus('saving');
        localStorage.setItem(STORAGE_KEY, json);

        // Save version snapshot
        const wordCount = (plainText.match(/\b[a-zA-Z0-9_]+\b/g) || []).length;
        if (wordCount > 0) {
          setVersions((prev) => {
            const snippet = plainText.slice(0, 80);
            const newEntry: VersionEntry = {
              id: Date.now().toString(36),
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

        // Brief "saving" state for UI feedback
        setTimeout(() => setSaveStatus('saved'), 300);
      }, 3000);
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

  // Cleanup save timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  // ── setText (backward compat — sets content as plain text) ───────────
  const setText = useCallback(
    (newText: string) => {
      if (!editor || editor.isDestroyed) return;
      // Convert plain text to paragraphs
      const html = newText
        .split(/\n\n+/)
        .map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`)
        .join('');
      editor.commands.setContent(html);
    },
    [editor]
  );

  // ── reset (clears history, sets new content) ────────────────────────
  const reset = useCallback(
    (newText: string) => {
      if (!editor || editor.isDestroyed) return;
      isResettingRef.current = true;

      const html = newText
        .split(/\n\n+/)
        .map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`)
        .join('');

      editor.commands.setContent(html);
      editor.commands.focus('start');

      // Update state synchronously
      setTextState(editor.getText());
      setHtmlContent(editor.getHTML());
      setCanUndo(false);
      setCanRedo(false);

      // Save immediately
      localStorage.setItem(STORAGE_KEY, JSON.stringify(editor.getJSON()));
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
        localStorage.setItem(STORAGE_KEY, version.content);
        setSaveStatus('saved');
      } catch (e) {
        console.error('Failed to restore version', e);
      }
    },
    [editor]
  );

  const clearVersions = useCallback(() => {
    setVersions([]);
    localStorage.removeItem(VERSIONS_KEY);
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
