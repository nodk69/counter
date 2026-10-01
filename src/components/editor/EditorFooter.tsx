import { memo, useCallback, useState } from 'react';
import { Sparkles, Check } from 'lucide-react';
import { useLocation } from 'wouter';
import type { SaveStatus } from '@/hooks/useEditorState';
import WritingGoal from '@/components/WritingGoal';
import { useTextContext } from '@/context/TextContext';
import { getToolBySlug, TOOLS } from '@/data/tools';

interface EditorFooterProps {
  saveStatus: SaveStatus;
}

const STATUS_LABEL: Record<SaveStatus, string> = {
  saved: 'Saved',
  saving: 'Saving…',
  unsaved: 'Unsaved',
};

const DEFAULT_EXAMPLE =
  'The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once. Writers, editors, and typographers have used it for decades to test readability, word counts, and typographic rhythm.';

function EditorFooter({ saveStatus }: EditorFooterProps) {
  const { reset } = useTextContext();
  const [location] = useLocation();
  const [justLoaded, setJustLoaded] = useState(false);

  const handleLoadExample = useCallback(() => {
    let exampleToLoad = DEFAULT_EXAMPLE;

    if (location.startsWith('/tools/')) {
      const slug = location.replace('/tools/', '').split('/')[0];
      const currentTool = getToolBySlug(slug);
      if (currentTool?.exampleText) {
        exampleToLoad = currentTool.exampleText;
      }
    } else if (TOOLS[0]?.exampleText) {
      exampleToLoad = TOOLS[0].exampleText;
    }

    reset(exampleToLoad);
    setJustLoaded(true);
    setTimeout(() => setJustLoaded(false), 1800);
  }, [location, reset]);

  return (
    <div className="editor-footer">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="editor-save-status flex-shrink-0">
          <span className={`editor-save-dot ${saveStatus}`} />
          {STATUS_LABEL[saveStatus]}
        </span>
        <div className="flex-1 min-w-0 flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar">
          <WritingGoal />
          <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-border flex-shrink-0" />
          <button
            type="button"
            onClick={handleLoadExample}
            title="Load sample example text into editor"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-sans cursor-pointer flex-shrink-0 active:scale-95"
          >
            {justLoaded ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-500" />
                <span className="text-green-600 dark:text-green-400 font-medium">Loaded!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-primary/80" />
                <span>Load example</span>
              </>
            )}
          </button>
        </div>
      </div> 
      <div className="flex items-center gap-1.5 text-primary/80 font-medium flex-shrink-0 text-xs font-sans">
        <span className="w-1.5 h-1.5 rounded-full bg-primary/80 inline-block" />
        100% ad-free
      </div>
    </div>
  );
}

export default memo(EditorFooter);

