import React from 'react';
import { Lightbulb, AlertTriangle, ArrowUp, Sparkles, CheckCircle2, Play } from 'lucide-react';
import { useTextContext } from '@/context/TextContext';
import type { Tool } from '@/data/tools';
import type { ToolGuide } from '@/data/toolGuides';

interface HowToUseProps {
  tool: Tool;
  guide: ToolGuide;
}

export default function HowToUse({ tool, guide }: HowToUseProps) {
  const { setText, editor } = useTextContext();

  const handleLoadSample = () => {
    if (tool.exampleText) {
      setText(tool.exampleText);
      if (editor) {
        editor.commands.setContent(tool.exampleText);
      }
    }
    const editorEl = document.getElementById('editor');
    if (editorEl) {
      editorEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section aria-labelledby="how-to-use-heading" className="my-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 id="how-to-use-heading" className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              {guide.heading}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground font-sans">
            {guide.intro}
          </p>
        </div>

        {tool.exampleText && (
          <button
            type="button"
            onClick={handleLoadSample}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white font-medium text-xs font-sans transition-all duration-200 self-start sm:self-auto cursor-pointer shadow-xs group"
          >
            <Play className="w-3.5 h-3.5 fill-current transition-transform group-hover:scale-110" />
            <span>Try with Sample Text ↑</span>
          </button>
        )}
      </div>

      {/* 4-Step Cards (Semantic Ordered List) */}
      <ol className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6" aria-label="Step-by-step instructions">
        {guide.steps.map((step, idx) => (
          <li
            key={step.title}
            className="p-5 rounded-xl border border-border bg-card/80 hover:bg-card hover:border-primary/30 transition-all duration-200 flex flex-col justify-between group shadow-xs"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-200 font-mono">
                  {idx + 1}
                </span>
                <h3 className="font-sans text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed">
                {step.desc}
              </p>
            </div>
          </li>
        ))}
      </ol>

      {/* Pro Tip & Common Mistake Callouts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Pro Tip */}
        <div className="p-4 sm:p-5 rounded-xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10 flex items-start gap-3">
          <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-foreground font-sans mb-1 flex items-center gap-1.5">
              Pro Tip
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed">
              {guide.proTip}
            </p>
          </div>
        </div>

        {/* Common Mistake */}
        <div className="p-4 sm:p-5 rounded-xl border border-red-500/20 bg-red-500/5 dark:bg-red-500/10 flex items-start gap-3">
          <div className="p-1.5 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-foreground font-sans mb-1 flex items-center gap-1.5">
              Common Mistake to Avoid
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed">
              {guide.commonMistake}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
