import { useState, useCallback, useEffect, memo } from 'react';
import type { Editor } from '@tiptap/react';
import { Search, X, ChevronUp, ChevronDown, Replace, ReplaceAll, CaseSensitive, WholeWord } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { findAll, replaceAt, replaceAll as replaceAllFn, selectResult, type SearchResult, type SearchOptions } from '@/utils/editor/searchReplace';

interface EditorSearchReplaceProps {
  editor: Editor;
  onClose: () => void;
}

function EditorSearchReplace({ editor, onClose }: EditorSearchReplaceProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [currentIdx, setCurrentIdx] = useState(-1);

  const options: SearchOptions = { caseSensitive, wholeWord };

  // Re-search when term or options change
  useEffect(() => {
    if (!searchTerm) {
      setResults([]);
      setCurrentIdx(-1);
      return;
    }
    const found = findAll(editor, searchTerm, options);
    setResults(found);
    setCurrentIdx(found.length > 0 ? 0 : -1);
    if (found.length > 0) {
      selectResult(editor, found[0]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, caseSensitive, wholeWord]);

  const goToResult = useCallback(
    (idx: number) => {
      if (results.length === 0) return;
      const wrapped = ((idx % results.length) + results.length) % results.length;
      setCurrentIdx(wrapped);
      selectResult(editor, results[wrapped]);
    },
    [editor, results]
  );

  const handleNext = useCallback(() => {
    goToResult(currentIdx + 1);
  }, [goToResult, currentIdx]);

  const handlePrev = useCallback(() => {
    goToResult(currentIdx - 1);
  }, [goToResult, currentIdx]);

  const handleReplace = useCallback(() => {
    if (currentIdx < 0 || currentIdx >= results.length) return;
    replaceAt(editor, results[currentIdx], replaceTerm);
    // Re-search
    setTimeout(() => {
      const found = findAll(editor, searchTerm, options);
      setResults(found);
      const newIdx = Math.min(currentIdx, found.length - 1);
      setCurrentIdx(found.length > 0 ? newIdx : -1);
      if (found.length > 0 && newIdx >= 0) {
        selectResult(editor, found[newIdx]);
      }
    }, 50);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, currentIdx, results, replaceTerm, searchTerm]);

  const handleReplaceAll = useCallback(() => {
    if (!searchTerm) return;
    replaceAllFn(editor, searchTerm, replaceTerm, options);
    setResults([]);
    setCurrentIdx(-1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, searchTerm, replaceTerm]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault();
        handlePrev();
      }
    },
    [onClose, handleNext, handlePrev]
  );

  return (
    <div className="editor-search-panel" onKeyDown={handleKeyDown}>
      {/* Search field */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
        <input
          type="text"
          placeholder="Find..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="editor-search-input"
          autoFocus
          aria-label="Search text"
        />
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {results.length > 0 ? `${currentIdx + 1} of ${results.length}` : searchTerm ? '0 results' : ''}
        </span>
      </div>

      {/* Replace field */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <input
          type="text"
          placeholder="Replace..."
          value={replaceTerm}
          onChange={(e) => setReplaceTerm(e.target.value)}
          className="editor-search-input"
          aria-label="Replace text"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-0.5 flex-shrink-0">
        {/* Toggle buttons */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => setCaseSensitive(!caseSensitive)}
              className={`editor-toolbar-btn ${caseSensitive ? 'is-active' : ''}`}
              aria-label="Match case"
              aria-pressed={caseSensitive}
            >
              <CaseSensitive className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Match Case</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => setWholeWord(!wholeWord)}
              className={`editor-toolbar-btn ${wholeWord ? 'is-active' : ''}`}
              aria-label="Whole word"
              aria-pressed={wholeWord}
            >
              <WholeWord className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Whole Word</TooltipContent>
        </Tooltip>

        <div className="editor-toolbar-sep" />

        {/* Navigation */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" onClick={handlePrev} disabled={results.length === 0} className="editor-toolbar-btn" aria-label="Previous match">
              <ChevronUp className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Previous (Shift+Enter)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" onClick={handleNext} disabled={results.length === 0} className="editor-toolbar-btn" aria-label="Next match">
              <ChevronDown className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Next (Enter)</TooltipContent>
        </Tooltip>

        <div className="editor-toolbar-sep" />

        {/* Replace actions */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" onClick={handleReplace} disabled={results.length === 0} className="editor-toolbar-btn" aria-label="Replace current">
              <Replace className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Replace</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" onClick={handleReplaceAll} disabled={results.length === 0} className="editor-toolbar-btn" aria-label="Replace all">
              <ReplaceAll className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Replace All</TooltipContent>
        </Tooltip>

        <div className="editor-toolbar-sep" />

        {/* Close */}
        <button type="button" onClick={onClose} className="editor-toolbar-btn" aria-label="Close search">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default memo(EditorSearchReplace);
