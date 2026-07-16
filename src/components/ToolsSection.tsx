import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTextContext } from '@/context/TextContext';
import { useTextStats } from '@/hooks/useTextStats';
import { useContentAnalysis } from '@/hooks/useContentAnalysis';
import { Download, FileText, FileJson, FileType, Loader2 } from "lucide-react";
import WritingAssistantTab from '@/components/WritingAssistantTab';
import { exportToPdf } from '@/lib/generateReport';
import { exportDocx, exportJson } from '@/lib/exportFormats';
import { useCallback, useState } from 'react';
import type { WritingMode } from '@/hooks/useContentAnalysis';

type ExportKind = 'pdf' | 'txt' | 'md' | 'docx' | 'json';

// Shared file-download helper. Revoking the blob URL synchronously right
// after `a.click()` (as the original code did) is a real cross-browser
// footgun: `click()` only *starts* the download, it doesn't wait for it,
// and Safari/Firefox have both been observed to cancel a download whose
// object URL was revoked before the browser finished reading it. Firefox
// also generally requires the anchor to be attached to the DOM to reliably
// dispatch the synthetic click. Both are fixed here.
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Give the browser a tick to actually start reading the blob before the
  // URL is invalidated.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function ToolsSection() {
  const { text } = useTextContext();
  const stats = useTextStats(text);
  const [mode, setMode] = useState<WritingMode>('general');
  const analysis = useContentAnalysis(
    text,
    stats.fleschKincaid,
    stats.words,
    stats.sentences,
    stats.uniqueWords,
    mode
  );

  // Tracks which export is currently running so buttons can show a busy
  // state and, more importantly, can't be double-fired — exportToPdf in
  // particular can take real time on long documents, and without this a
  // fast double-click kicked off two concurrent PDF generations.
  const [pendingExport, setPendingExport] = useState<ExportKind | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const maxDensity = stats.wordDensity.length > 0 ? stats.wordDensity[0].count : 1;

  const getReadabilityLabel = (score: number) => {
    if (stats.words === 0) return "-";
    if (score >= 90) return "Very Easy (5th Grade)";
    if (score >= 80) return "Easy (6th Grade)";
    if (score >= 70) return "Fairly Easy (7th Grade)";
    if (score >= 60) return "Standard (8th-9th Grade)";
    if (score >= 50) return "Fairly Difficult (10th-12th Grade)";
    if (score >= 30) return "Difficult (College)";
    return "Very Difficult (College Graduate)";
  };

  const runExport = useCallback(async (kind: ExportKind, fn: () => void | Promise<void>) => {
    if (pendingExport) return; // one export at a time
    setExportError(null);
    setPendingExport(kind);
    try {
      await fn();
    } catch (err) {
      console.error(`Export (${kind}) failed`, err);
      setExportError('That export failed. Please try again.');
    } finally {
      setPendingExport(null);
    }
  }, [pendingExport]);

  const handleExportTxt = () => runExport('txt', () => {
    if (stats.words === 0) return;
    downloadBlob(new Blob([text], { type: "text/plain" }), "counter-export.txt");
  });

  const handleExportMd = () => runExport('md', () => {
    if (stats.words === 0) return;
    downloadBlob(new Blob([text], { type: "text/markdown" }), "counter-export.md");
  });

  const handleExportPdf = () => runExport('pdf', () => exportToPdf(text, stats, analysis, mode));
  const handleExportDocx = () => runExport('docx', () => exportDocx(text));
  const handleExportJson = () => runExport('json', () => exportJson(text, stats, analysis, mode));

  return (
    <div className="bg-card rounded-lg border border-border p-6" id="tools">
      <Tabs defaultValue="assistant" className="w-full">
        <TabsList className="w-full justify-start border-b border-border bg-transparent rounded-none p-0 h-auto mb-6 flex-wrap gap-y-0">
          <TabsTrigger value="assistant" className="data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-2 font-medium">Writing Assistant</TabsTrigger>
          <TabsTrigger value="density" className="data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-2 font-medium">Word Density</TabsTrigger>
          <TabsTrigger value="readability" className="data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-2 font-medium">Readability</TabsTrigger>
          <TabsTrigger value="advanced" className="data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-2 font-medium">Text Stats</TabsTrigger>
          <TabsTrigger value="export" className="data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-2 font-medium">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="assistant" className="focus-visible:outline-none focus-visible:ring-0">
          {/* Pass the already-computed stats/analysis down instead of letting
              WritingAssistantTab compute its own copy from the same text.
              Previously both this component and WritingAssistantTab called
              useTextStats + useContentAnalysis independently, so every
              keystroke ran the entire filler-word/passive-voice/readability
              scan twice. WritingAssistantTab still works standalone if
              these props are omitted — see its own prop typing. */}
          <WritingAssistantTab mode={mode} setMode={setMode} stats={stats} analysis={analysis} />
        </TabsContent>

        <TabsContent value="density" className="focus-visible:outline-none focus-visible:ring-0">
          <div className="space-y-3">
            {stats.wordDensity.length > 0 ? (
              stats.wordDensity.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-24 font-mono text-sm truncate text-foreground/80">{item.word}</div>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500 ease-out"
                      style={{ width: `${(item.count / maxDensity) * 100}%` }}
                    />
                  </div>
                  <div className="w-8 text-right font-mono text-sm text-muted-foreground">{item.count}</div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground py-4 text-center">Not enough text to analyze density.</div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="readability" className="focus-visible:outline-none focus-visible:ring-0">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="flex-1 text-center md:text-left">
              <div className="font-mono text-6xl text-success font-semibold tracking-tighter mb-2">
                {stats.words > 0 ? stats.fleschKincaid : "-"}
              </div>
              <div className="text-lg font-medium text-foreground mb-1">
                {getReadabilityLabel(stats.fleschKincaid)}
              </div>
              <p className="text-sm text-muted-foreground">Flesch-Kincaid Reading Ease Score</p>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div className="p-4 bg-muted/30 rounded border border-border">
                <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Avg Word Length</div>
                <div className="font-mono text-xl">{stats.avgWordLength} <span className="text-sm text-muted-foreground">chars</span></div>
              </div>
              <div className="p-4 bg-muted/30 rounded border border-border">
                <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Avg Sentence Length</div>
                <div className="font-mono text-xl">{stats.avgSentenceLength} <span className="text-sm text-muted-foreground">words</span></div>
              </div>
              <div className="p-4 bg-muted/30 rounded border border-border sm:col-span-2">
                <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Syllables per word</div>
                <div className="font-mono text-xl">{stats.words > 0 ? (Math.round((stats.totalSyllables / stats.words) * 10) / 10) : 0}</div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="focus-visible:outline-none focus-visible:ring-0">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Total Syllables</div>
              <div className="font-mono text-2xl">{stats.totalSyllables}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Words</div>
              <div className="font-mono text-2xl">{stats.words}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Avg Word Length</div>
              <div className="font-mono text-2xl">{stats.avgWordLength}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Sentences</div>
              <div className="font-mono text-2xl">{stats.sentences}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Avg Sentence Length</div>
              <div className="font-mono text-2xl">{stats.avgSentenceLength}</div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="export" className="focus-visible:outline-none focus-visible:ring-0">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-foreground font-sans mb-1">Analysis Report</h3>
            <p className="text-xs text-muted-foreground font-sans mb-3">
              Export a formatted PDF report with content score, filler words, passive voice, vocabulary diversity, top keywords, and writing suggestions.
            </p>
            <button
              onClick={handleExportPdf}
              disabled={stats.words < 10 || pendingExport !== null}
              aria-busy={pendingExport === 'pdf'}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 font-sans font-medium text-sm"
            >
              {pendingExport === 'pdf' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              {pendingExport === 'pdf' ? 'Generating…' : 'Download Analysis Report (PDF)'}
            </button>
          </div>

          <div className="border-t border-border pt-5">
            <h3 className="text-sm font-semibold text-foreground font-sans mb-1">Export Text</h3>
            <p className="text-xs text-muted-foreground font-sans mb-3">Download your raw text in a plain format.</p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleExportTxt}
                disabled={stats.words === 0 || pendingExport !== null}
                aria-busy={pendingExport === 'txt'}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded border border-border bg-transparent hover:bg-muted text-foreground transition-colors disabled:opacity-50 text-sm font-sans"
              >
                {pendingExport === 'txt' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                TXT
              </button>
              <button
                onClick={handleExportMd}
                disabled={stats.words === 0 || pendingExport !== null}
                aria-busy={pendingExport === 'md'}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded border border-border bg-transparent hover:bg-muted text-foreground transition-colors disabled:opacity-50 text-sm font-sans"
              >
                {pendingExport === 'md' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Markdown
              </button>
              <button
                onClick={handleExportDocx}
                disabled={stats.words === 0 || pendingExport !== null}
                aria-busy={pendingExport === 'docx'}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded border border-border bg-transparent hover:bg-muted text-foreground transition-colors disabled:opacity-50 text-sm font-sans"
              >
                {pendingExport === 'docx' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileType className="w-4 h-4" />}
                Word (.doc)
              </button>
              <button
                onClick={handleExportJson}
                disabled={stats.words === 0 || pendingExport !== null}
                aria-busy={pendingExport === 'json'}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded border border-border bg-transparent hover:bg-muted text-foreground transition-colors disabled:opacity-50 text-sm font-sans"
              >
                {pendingExport === 'json' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileJson className="w-4 h-4" />}
                JSON
              </button>
            </div>
            {exportError && (
              <p role="alert" className="text-xs text-red-500 font-sans mt-3">{exportError}</p>
            )}
          </div>

          <div className="text-sm font-mono text-muted-foreground border-t border-border mt-5 pt-4">
            Characters: {stats.charWithSpaces} | Words: {stats.words}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}