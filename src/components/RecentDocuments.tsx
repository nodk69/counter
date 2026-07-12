import { useState, useRef, useEffect } from 'react';
import { Clock, X, ChevronDown, FileText, Trash2 } from 'lucide-react';
import { useRecentDocuments } from '@/hooks/useRecentDocuments';
import { useTextContext } from '@/context/TextContext';
import { useTextStats } from '@/hooks/useTextStats';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60_000);
  const h = Math.floor(diff / 3_600_000);
  const d = Math.floor(diff / 86_400_000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

export default function RecentDocuments() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { text, reset } = useTextContext();
  const stats = useTextStats(text);
  const { docs, removeDoc, clearAll } = useRecentDocuments(text, stats.words);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  if (docs.length === 0) return null;

  return (
    <div className="relative" ref={panelRef}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setOpen(o => !o)}
            className={`flex items-center gap-1 p-2 rounded text-muted-foreground transition-colors ${
              open ? 'bg-muted text-foreground' : 'hover:bg-muted hover:text-foreground'
            }`}
            aria-label="Recent documents"
          >
            <Clock className="w-4 h-4" />
            <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        </TooltipTrigger>
        <TooltipContent>Recent documents ({docs.length})</TooltipContent>
      </Tooltip>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-72 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
            <span className="text-xs font-semibold text-foreground font-sans flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> Recent Documents
            </span>
            <button
              onClick={() => { clearAll(); setOpen(false); }}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> Clear all
            </button>
          </div>

          <div className="divide-y divide-border">
            {docs.map(doc => (
              <div key={doc.id} className="flex items-start gap-2 px-3 py-2.5 hover:bg-muted/30 group">
                <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <button
                  className="flex-1 text-left min-w-0"
                  onClick={() => {
                    if (text.trim() && text.trim() !== doc.text.trim()) {
                      if (!window.confirm('Replace current text with this document?')) return;
                    }
                    reset(doc.text);
                    setOpen(false);
                  }}
                >
                  <div className="text-xs text-foreground font-sans line-clamp-2 leading-relaxed">
                    {doc.snippet || '(empty)'}
                    {doc.snippet.length >= 80 ? '…' : ''}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-muted-foreground">{doc.wordCount.toLocaleString()} words</span>
                    <span className="text-[10px] text-muted-foreground/60">·</span>
                    <span className="text-[10px] text-muted-foreground">{formatRelative(doc.timestamp)}</span>
                  </div>
                </button>
                <button
                  onClick={() => removeDoc(doc.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all flex-shrink-0"
                  aria-label="Remove"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="px-3 py-2 border-t border-border bg-muted/10 text-[10px] text-muted-foreground text-center font-sans">
            Documents are saved locally — never uploaded
          </div>
        </div>
      )}
    </div>
  );
}
