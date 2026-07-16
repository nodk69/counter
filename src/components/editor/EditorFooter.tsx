import { memo } from 'react';
import type { SaveStatus } from '@/hooks/useEditorState';
import WritingGoal from '@/components/WritingGoal';

interface EditorFooterProps {
  saveStatus: SaveStatus;
}

const STATUS_LABEL: Record<SaveStatus, string> = {
  saved: 'Saved',
  saving: 'Saving…',
  unsaved: 'Unsaved',
};

function EditorFooter({ saveStatus }: EditorFooterProps) {
  return (
    <div className="editor-footer">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="editor-save-status flex-shrink-0">
          <span className={`editor-save-dot ${saveStatus}`} />
          {STATUS_LABEL[saveStatus]}
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
  );
}

export default memo(EditorFooter);
