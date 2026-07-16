import { useWritingStreak } from '@/hooks/useWritingStreak';
import { useTextContext } from '@/context/TextContext';
import { useTextStats } from '@/hooks/useTextStats';
import { Flame } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function WritingStreak() {
  const { text } = useTextContext();
  const stats = useTextStats(text);
  const { streak, longestStreak, isStreakDay } = useWritingStreak(stats.words);

  if (streak === 0) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold font-sans cursor-default select-none transition-colors ${
            isStreakDay
              ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800'
              : 'bg-muted text-muted-foreground border border-border'
          }`}
        >
          <Flame className={`w-3.5 h-3.5 ${isStreakDay ? 'text-orange-500' : 'text-muted-foreground'}`} />
          {streak} day{streak !== 1 ? 's' : ''}
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <div className="text-center">
          <div className="font-semibold">🔥 {streak}-day writing streak!</div>
          {longestStreak > streak && (
            <div className="text-xs text-muted-foreground mt-0.5">Best: {longestStreak} days</div>
          )}
          {longestStreak === streak && streak > 1 && (
            <div className="text-xs text-muted-foreground mt-0.5">Personal best!</div>
          )}
          <div className="text-xs text-muted-foreground mt-0.5">Write daily to keep it going</div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
