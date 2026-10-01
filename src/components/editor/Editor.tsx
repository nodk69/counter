import { useState, useRef, useCallback, memo } from 'react';
import { EditorContent } from '@tiptap/react';
import { useTextContext } from '@/context/TextContext';
import EditorToolbar from './EditorToolbar';
import EditorSearchReplace from './EditorSearchReplace';
import EditorVersionHistory from './EditorVersionHistory';
import EditorFooter from './EditorFooter';
import { importFile } from '@/utils/editor/editorImport';
import { exportDocument } from '@/lib/export/exportService';
import { useTextStats } from '@/hooks/useTextStats';
import { useToast } from '@/hooks/use-toast';
import './editor.css';

function Editor() {
  const {
    editor, text, reset, htmlContent,
    saveStatus, versions, restoreVersion, clearVersions,
  } = useTextContext();

  const [showSearch, setShowSearch] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const versionRef = useRef<HTMLDivElement>(null);

  // ── Import handler ──────────────────────────────────────────────────
  const handleFileImport = useCallback(
    async (file: File) => {
      try {
        const html = await importFile(file);
        if (editor && !editor.isDestroyed) {
          if (text.trim()) {
            if (!window.confirm('Replace current content with imported file?')) return;
          }
          editor.commands.setContent(html);
          editor.commands.focus('start');
        }
      } catch (err) {
        console.error('Import failed:', err);
        alert('Failed to import file. Please try a different format.');
      }
    },
    [editor, text]
  );



  // ── Drag and drop ──────────────────────────────────────────────────
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFileImport(file);
    },
    [handleFileImport]
  );

  const stats = useTextStats(text);

  const getDocTitle = useCallback(() => {
    if (!htmlContent) return 'Untitled Document';
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const heading = doc.querySelector('h1, h2, h3')?.textContent;
    return heading?.trim() || 'Untitled Document';
  }, [htmlContent]);

  const { toast } = useToast();

  // ── Export handlers ────────────────────────────────────────────────
  const runEditorExport = useCallback(
    async (format: 'txt' | 'html' | 'docx' | 'markdown' | 'pdf') => {
      const hasContent = Boolean(text && text.trim());
      if (!hasContent) {
        const proceed = window.confirm('The editor is currently empty. Do you want to export an empty template anyway?');
        if (!proceed) return;
      }

      const title = getDocTitle();
      const formatLabels: Record<string, string> = {
        txt: 'Plain Text (TXT)',
        html: 'HTML Document',
        docx: 'Word Document (DOCX)',
        markdown: 'Markdown (MD)',
        pdf: 'PDF Document',
      };

      try {
        await exportDocument({
          format,
          title,
          html: htmlContent || `<p>${text || ''}</p>`,
          stats: {
            words: stats.words,
            characters: stats.charWithSpaces,
            charactersNoSpaces: stats.charNoSpaces,
            sentences: stats.sentences,
            paragraphs: stats.paragraphs,
            readingTime: stats.readingTime,
            speakingTime: stats.speakingTime,
          },
        });

        toast({
          title: 'Export successful',
          description: `Downloaded ${formatLabels[format] || format.toUpperCase()}.`,
        });
      } catch (err) {
        console.error(`Export (${format}) failed:`, err);
        toast({
          variant: 'destructive',
          title: 'Export failed',
          description: `Could not export as ${format.toUpperCase()}. Please try a different format or check console.`,
        });
      }
    },
    [text, htmlContent, stats, getDocTitle, toast]
  );

  const handleExportTxt = useCallback(() => runEditorExport('txt'), [runEditorExport]);
  const handleExportHtml = useCallback(() => runEditorExport('html'), [runEditorExport]);
  const handleExportDocx = useCallback(() => runEditorExport('docx'), [runEditorExport]);
  const handleExportMd = useCallback(() => runEditorExport('markdown'), [runEditorExport]);
  const handleExportPdf = useCallback(() => runEditorExport('pdf'), [runEditorExport]);

  // ── Clear handler ──────────────────────────────────────────────────
  const handleClear = useCallback(() => {
    if (!text) return;
    if (window.confirm('Are you sure you want to clear all text?')) {
      reset('');
    }
  }, [text, reset]);

  // ── Keyboard shortcuts ─────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setShowSearch((s) => !s);
      }
    },
    []
  );

  if (!editor) return null;

  return (
    <div
      className="flex flex-col h-full rounded-lg border border-border bg-card overflow-hidden"
      onKeyDown={handleKeyDown}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Toolbar */}
      <EditorToolbar
        editor={editor}
        onToggleSearch={() => setShowSearch((s) => !s)}
        showSearch={showSearch}
        onImportFile={handleFileImport}
        onExportTxt={handleExportTxt}
        onExportHtml={handleExportHtml}
        onExportDocx={handleExportDocx}
        onExportMd={handleExportMd}
        onExportPdf={handleExportPdf}
        onClear={handleClear}
        onToggleVersionHistory={() => setShowVersionHistory((s) => !s)}
      />

      {/* Search & Replace */}
      {showSearch && (
        <EditorSearchReplace editor={editor} onClose={() => setShowSearch(false)} />
      )}

      {/* Version History Dropdown */}
      {showVersionHistory && (
        <div className="relative" ref={versionRef}>
          <EditorVersionHistory
            versions={versions}
            onRestore={restoreVersion}
            onClear={clearVersions}
            onClose={() => setShowVersionHistory(false)}
          />
        </div>
      )}

      {/* Editor Content */}
      <div className={`editor-content-area relative ${isDragOver ? 'ring-2 ring-primary ring-inset bg-primary/5' : ''}`}>
        {isDragOver && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-primary/5 pointer-events-none">
            <div className="px-6 py-3 rounded-lg bg-card border-2 border-dashed border-primary text-sm font-medium text-primary shadow-lg">
              Drop file to import
            </div>
          </div>
        )}
        <EditorContent editor={editor} />
      </div>

      {/* Footer */}
      <EditorFooter saveStatus={saveStatus} />
    </div>
  );
}

export default memo(Editor);
