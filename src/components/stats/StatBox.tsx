import { useEffect, useState, useRef } from 'react';
import type { StatBoxProps } from './types';

export function StatBox({ label, value, isGreen, className = '', sub }: StatBoxProps) {
  const [pulse, setPulse] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (prevValueRef.current === value) return;
    setPulse(true);
    const timer = setTimeout(() => setPulse(false), 300);
    prevValueRef.current = value;
    return () => clearTimeout(timer);
  }, [value]);

  const valueDisplay =
    typeof value === 'number' && isGreen && value > 0 ? (
      <span
        className={`font-mono text-2xl font-semibold tracking-tight text-success ${pulse ? 'animate-stat-pulse inline-block' : ''}`}
      >
        {value.toLocaleString()}
      </span>
    ) : (
      <span
        className={`font-mono text-2xl font-semibold tracking-tight text-foreground ${pulse ? 'animate-stat-pulse inline-block' : ''}`}
      >
        {typeof value === 'number' ? value.toLocaleString() : value || '-'}
      </span>
    );

  return (
    <div
      className={`p-4 flex flex-col items-start gap-1 rounded-md border border-transparent hover:bg-muted/50 transition-colors min-w-0 ${className}`}
    >
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider truncate w-full">
        {label}
      </span>
      <div className="w-full truncate">{valueDisplay}</div>
      {sub && (
        <span className="text-xs text-muted-foreground/70 truncate w-full">{sub}</span>
      )}
    </div>
  );
}
