import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTextContext } from '@/context/TextContext';
import { useTextStats } from '@/hooks/useTextStats';
import { useContentAnalysis } from '@/hooks/useContentAnalysis';
import { Download, FileText, FileJson, FileType, Loader2, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import WritingAssistantTab from '@/components/WritingAssistantTab';
import { exportToPdf } from '@/lib/generateReport';
import { exportJson } from '@/lib/exportFormats';
import { exportDocument } from '@/lib/export/exportService';
import { useCallback, useState } from 'react';

type ExportKind = 'pdf' | 'txt' | 'md' | 'docx' | 'json';

export default function ToolsSection() {
  const { text, htmlContent, mode, setMode } = useTextContext();
  const stats = useTextStats(text);
  const analysis = useContentAnalysis(text, mode);

  const [isOpen, setIsOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem('counter-tools-expanded') === 'true';
    } catch {
      return false;
    }
  });

  const toggleOpen = () => {
    setIsOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('counter-tools-expanded', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const [pendingExport, setPendingExport] = useState<ExportKind | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const densityItems = Array.isArray(stats.wordDensity) ? stats.wordDensity : [];
  const maxDensity = densityItems.length > 0 ? (densityItems[0]?.count ?? 1) : 1;

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

  const currentExportStats = {
    words: stats.words,
    characters: stats.charWithSpaces,
    charactersNoSpaces: stats.charNoSpaces,
    sentences: stats.sentences,
    paragraphs: stats.paragraphs,
    readingTime: stats.readingTime,
    speakingTime: stats.speakingTime,
  };

  const currentHtml = htmlContent || `<p>${(text || '').replace(/\n/g, '<br>')}</p>`;

  const handleExportTxt = () => runExport('txt', () => {
    if (stats.words === 0 && !text) return;
    return exportDocument({
      format: 'txt',
      title: 'counter-export',
      html: currentHtml,
      stats: currentExportStats,
    });
  });

  const handleExportMd = () => runExport('md', () => {
    if (stats.words === 0 && !text) return;
    return exportDocument({
      format: 'markdown',
      title: 'counter-export',
      html: currentHtml,
      stats: currentExportStats,
    });
  });

  const handleExportDocx = () => runExport('docx', () => {
    if (stats.words === 0 && !text) return;
    return exportDocument({
      format: 'docx',
      title: 'counter-export',
      html: currentHtml,
      stats: currentExportStats,
    });
  });

  const handleExportPdf = () => runExport('pdf', () => exportToPdf(text, stats, analysis, mode));
  const handleExportJson = () => runExport('json', () => exportJson(text, stats, analysis, mode));

  if (!isOpen) {
    return (
      <div className="bg-card/70 hover:bg-card border border-border/80 hover:border-primary/30 rounded-xl p-3.5 sm:px-5 sm:py-3.5 transition-all duration-200 shadow-xs" id="tools">
        <button
          type="button"
          onClick={toggleOpen}
          className="w-full flex items-center justify-between gap-4 text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          aria-expanded={false}
          aria-controls="writing-tools-panel"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-200">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">
                  Writing Assistant & Deep Analysis
                </span>
                {stats.words >= 5 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                    Score: {analysis.contentScore}/100 • {analysis.scoreLabel}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                Content score, readability breakdown, passive voice check, keyword density & export options
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 group-hover:bg-primary group-hover:text-white px-3 py-1.5 rounded-lg transition-all flex-shrink-0">
            <span>Show Analysis</span>
            <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-5 sm:p-6 transition-all duration-200 shadow-xs" id="tools">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-primary/10 text-primary flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h2 className="font-semibold text-sm sm:text-base text-foreground font-sans">
            Writing Assistant & Deep Analysis
          </h2>
        </div>
        <button
          type="button"
          onClick={toggleOpen}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground font-sans px-2.5 py-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer"
          aria-expanded={true}
          aria-controls="writing-tools-panel"
        >
          <span>Hide Analysis</span>
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>

      <Tabs defaultValue="assistant" className="w-full" id="writing-tools-panel">
        <TabsList className="w-full justify-start border-b border-border bg-transparent rounded-none p-0 h-auto mb-6 flex-wrap gap-y-0">
          <TabsTrigger value="assistant" className="data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-2 font-medium">Writing Assistant</TabsTrigger>
          <TabsTrigger value="density" className="data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-2 font-medium">Word Density</TabsTrigger>
          <TabsTrigger value="readability" className="data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-2 font-medium">Readability</TabsTrigger>
          <TabsTrigger value="advanced" className="data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-2 font-medium">Text Stats</TabsTrigger>
          <TabsTrigger value="export" className="data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-2 font-medium">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="assistant" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg">
          {/* Pass the already-computed stats/analysis down instead of letting
              WritingAssistantTab compute its own copy from the same text.
              Previously both this component and WritingAssistantTab called
              useTextStats + useContentAnalysis independently, so every
              keystroke ran the entire filler-word/passive-voice/readability
              scan twice. WritingAssistantTab still works standalone if
              these props are omitted — see its own prop typing. */}
          <WritingAssistantTab mode={mode} setMode={setMode} stats={stats} analysis={analysis} />
        </TabsContent>

        <TabsContent value="density" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg">
          <div className="space-y-3">
            {densityItems.length > 0 ? (
              densityItems.map((item, idx) => (
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

        <TabsContent value="readability" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg">
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

        <TabsContent value="advanced" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg">
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

        <TabsContent value="export" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg">
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