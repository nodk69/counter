import { useState, useRef, useEffect } from 'react';
import { ClipboardCopy, Undo2, Redo2, Trash2, Upload, Download, Search, Check } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useTextContext } from '@/context/TextContext';
import WritingGoal from '@/components/WritingGoal';
import RecentDocuments from '@/components/RecentDocuments';

export default function Editor() {
  const { text, setText, undo, redo, canUndo, canRedo, reset } = useTextContext();
  const [copied, setCopied] = useState(false);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-save effect
  useEffect(() => {
    if (text.length === 0) return;
    const timer = setTimeout(() => {
      localStorage.setItem('counter-text', text);
      setLastSaved(new Date());
    }, 1500);
    return () => clearTimeout(timer);
  }, [text]);

  // Restore on mount
  useEffect(() => {
    const saved = localStorage.getItem('counter-text');
    if (saved && saved.length > 0 && text.length === 0) {
      reset(saved);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all text?')) {
      reset('');
      localStorage.removeItem('counter-text');
      setLastSaved(null);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) reset(event.target.result as string);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleExport = () => {
    if (!text) return;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'counter-export.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const escapeForRegex = (s: string) => s.replace(/[-[\]/{}()*+?.\\^$|]/g, (c) => `\\${c}`);
  const escapedFind = escapeForRegex(findText);

  const handleReplace = () => {
    if (!findText) return;
    const newText = text.replace(new RegExp(escapedFind, 'i'), replaceText);
    setText(newText);
  };

  const handleReplaceAll = () => {
    if (!findText) return;
    const newText = text.replace(new RegExp(escapedFind, 'gi'), replaceText);
    setText(newText);
  };

  const matchCount = findText ? (text.match(new RegExp(escapedFind, 'gi')) || []).length : 0;

  return (
    <div className="flex flex-col h-full rounded-lg border border-border bg-card overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between p-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={handleCopy} className="p-2 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" aria-label="Copy text">
                {copied ? <Check className="w-4 h-4 text-success" /> : <ClipboardCopy className="w-4 h-4" />}
              </button>
            </TooltipTrigger>
            <TooltipContent>Copy text (⌘C)</TooltipContent>
          </Tooltip>

          <div className="w-px h-4 bg-border mx-1" />

          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={undo} disabled={!canUndo} className="p-2 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors" aria-label="Undo">
                <Undo2 className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Undo (⌘Z)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={redo} disabled={!canRedo} className="p-2 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors" aria-label="Redo">
                <Redo2 className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Redo (⌘Y)</TooltipContent>
          </Tooltip>

          <div className="w-px h-4 bg-border mx-1" />

          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={handleClear} className="p-2 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" aria-label="Clear all">
                <Trash2 className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Clear all</TooltipContent>
          </Tooltip>

          <div className="w-px h-4 bg-border mx-1" />
          <RecentDocuments />
        </div>

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setShowFindReplace(!showFindReplace)}
                className={`p-2 rounded transition-colors ${showFindReplace ? 'bg-muted text-foreground' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
                aria-label="Find & Replace"
              >
                <Search className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Find & Replace</TooltipContent>
          </Tooltip>

          <div className="w-px h-4 bg-border mx-1" />

          <input type="file" ref={fileInputRef} onChange={handleImport} accept=".txt,.md" className="hidden" />
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" aria-label="Import file">
                <Upload className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Import file</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={handleExport} className="p-2 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" aria-label="Export file">
                <Download className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Export as TXT</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Find & Replace Panel */}
      {showFindReplace && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-muted/20 border-b border-border text-sm">
          <div className="flex items-center gap-2 flex-1">
            <input
              type="text"
              placeholder="Find..."
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              className="flex-1 bg-background border border-border rounded px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <span className="text-xs text-muted-foreground whitespace-nowrap w-20">
              {matchCount} match{matchCount !== 1 ? 'es' : ''}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-1">
            <input
              type="text"
              placeholder="Replace with..."
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              className="flex-1 bg-background border border-border rounded px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="flex items-center gap-1">
              <button onClick={handleReplace} disabled={!findText || matchCount === 0} className="px-2 py-1 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 disabled:opacity-50 text-xs">
                Replace
              </button>
              <button onClick={handleReplaceAll} disabled={!findText || matchCount === 0} className="px-2 py-1 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 disabled:opacity-50 text-xs">
                All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Text Area */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start writing here..."
        className="flex-1 w-full p-6 lg:p-8 resize-none bg-transparent outline-none font-lora text-lg leading-relaxed text-foreground placeholder:text-muted-foreground/60 editor-scrollbar"
        spellCheck={false}
      />

      {/* Footer Info */}
      <div className="flex items-center justify-between gap-2 p-3 border-t border-border bg-muted/10 text-xs text-muted-foreground font-sans">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="flex-shrink-0">
            {lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : 'Not yet saved'}
          </span>
          <div className="flex-1 min-w-0">
            <WritingGoal />
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-primary/80 font-medium flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-primary/80 inline-block" />
          100% ad-free
        </div>
      </div>
    </div>
  );
}
