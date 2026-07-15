import { memo } from 'react';
import { Clock, RotateCcw, Trash2 } from 'lucide-react';
import type { VersionEntry } from '@/hooks/useEditorState';

interface EditorVersionHistoryProps {
  versions: VersionEntry[];
  onRestore: (version: VersionEntry) => void;
  onClear: () => void;
  onClose: () => void;
}

function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60_000);
  const h = Math.floor(diff / 3_600_000);
  const d = Math.floor(diff / 86_400_000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

function EditorVersionHistory({ versions, onRestore, onClear, onClose }: EditorVersionHistoryProps) {
  if (versions.length === 0) {
    return (
      <div className="absolute top-full right-0 mt-1 w-72 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
          <span className="text-xs font-semibold text-foreground font-sans flex items-center gap-1.5">
            <Clock className="w-3 h-3" /> Version History
          </span>
          <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground">✕</button>
        </div>
        <div className="px-4 py-6 text-center text-xs text-muted-foreground font-sans">
          No saved versions yet.<br />Versions are saved automatically as you type.
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-full right-0 mt-1 w-72 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden max-h-80">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30 sticky top-0 z-10">
        <span className="text-xs font-semibold text-foreground font-sans flex items-center gap-1.5">
          <Clock className="w-3 h-3" /> Version History ({versions.length})
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={onClear}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" /> Clear
          </button>
          <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground">✕</button>
        </div>
      </div>

      <div className="overflow-y-auto max-h-64">
        {versions.map((v) => (
          <button
            key={v.id}
            className="editor-version-item w-full text-left"
            onClick={() => {
              if (window.confirm('Restore this version? Current content will be replaced.')) {
                onRestore(v);
                onClose();
              }
            }}
          >
            <RotateCcw className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-foreground font-sans line-clamp-2 leading-relaxed">
                {v.snippet || '(empty)'}
                {v.snippet.length >= 80 ? '…' : ''}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-muted-foreground">{v.wordCount.toLocaleString()} words</span>
                <span className="text-[10px] text-muted-foreground/60">·</span>
                <span className="text-[10px] text-muted-foreground">{formatRelative(v.timestamp)}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="px-3 py-2 border-t border-border bg-muted/10 text-[10px] text-muted-foreground text-center font-sans">
        Last {versions.length} versions saved locally
      </div>
    </div>
  );
}

export default memo(EditorVersionHistory);
