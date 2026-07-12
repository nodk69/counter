import { useState, useEffect } from 'react';
import { Target, X } from 'lucide-react';
import { useTextStats } from '@/hooks/useTextStats';
import { useTextContext } from '@/context/TextContext';

export default function WritingGoal() {
  const { text } = useTextContext();
  const stats = useTextStats(text);
  const [goal, setGoal] = useState<number | null>(() => {
    const saved = localStorage.getItem('counter-writing-goal');
    return saved ? parseInt(saved, 10) : null;
  });
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState('');

  useEffect(() => {
    if (goal !== null) {
      localStorage.setItem('counter-writing-goal', String(goal));
    } else {
      localStorage.removeItem('counter-writing-goal');
    }
  }, [goal]);

  const progress = goal ? Math.min((stats.words / goal) * 100, 100) : 0;
  const reached = goal !== null && stats.words >= goal;

  const handleSetGoal = () => {
    const n = parseInt(inputVal, 10);
    if (!isNaN(n) && n > 0) {
      setGoal(n);
      setEditing(false);
      setInputVal('');
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSetGoal();
    if (e.key === 'Escape') setEditing(false);
  };

  if (!goal && !editing) {
    return (
      <button
        onClick={() => { setEditing(true); setInputVal(''); }}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-sans"
      >
        <Target className="w-3.5 h-3.5" />
        Set writing goal
      </button>
    );
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <Target className="w-3.5 h-3.5 text-primary flex-shrink-0" />
        <input
          type="number"
          autoFocus
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKey}
          placeholder="e.g. 1000"
          className="w-24 text-xs px-2 py-1 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
          min={1}
          max={99999}
        />
        <span className="text-xs text-muted-foreground font-sans">words</span>
        <button
          onClick={handleSetGoal}
          className="text-xs px-2 py-1 bg-primary text-white rounded hover:bg-primary/90 transition-colors font-sans"
        >
          Set
        </button>
        <button onClick={() => setEditing(false)} className="text-muted-foreground hover:text-foreground">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5 min-w-0 flex-1">
      <Target className={`w-3.5 h-3.5 flex-shrink-0 ${reached ? 'text-green-600' : 'text-primary'}`} />
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden min-w-[60px]">
          <div
            className={`h-full rounded-full transition-all duration-500 ${reached ? 'bg-green-500' : 'bg-primary'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <button
          onClick={() => { setEditing(true); setInputVal(String(goal)); }}
          className="text-xs text-muted-foreground hover:text-foreground font-mono whitespace-nowrap transition-colors"
        >
          {stats.words.toLocaleString()} / {goal!.toLocaleString()}
        </button>
      </div>
      <button
        onClick={() => setGoal(null)}
        className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
        aria-label="Remove goal"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
