import { useCallback, useEffect, useRef, useState } from 'react';
import type { StatBoxProps } from './types';

// Tuned to feel like a single considered gesture, not three competing
// effects: the count finishes right as the ink starts to fade, and the
// delta chip has already begun leaving by the time everything settles.
const COUNT_DURATION_MS = 380;
const INK_HOLD_MS = 220;
const INK_FADE_MS = 480;
const DELTA_HOLD_MS = 700;
const DELTA_LEAVE_MS = 420;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => setReduced(mql.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  return reduced;
}

type InkPhase = 'idle' | 'drawing' | 'fading';
type DeltaPhase = 'entering' | 'visible' | 'leaving';
interface DeltaState { id: number; text: string; phase: DeltaPhase }

export function StatBox({ label, value, isGreen, className = '', sub }: StatBoxProps) {
  const reducedMotion = usePrefersReducedMotion();

  const prevValueRef = useRef(value);
  const rafRef = useRef<number | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const changeIdRef = useRef(0);

  const [displayValue, setDisplayValue] = useState<number | string>(value);
  const [inkPhase, setInkPhase] = useState<InkPhase>('idle');
  const [delta, setDelta] = useState<DeltaState | null>(null);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => {
    const prev = prevValueRef.current;
    prevValueRef.current = value;

    // Nothing changed (e.g. a re-render triggered by an unrelated prop) —
    // don't restart any animation.
    if (prev === value) return;

    // A value can legitimately switch between number and string (e.g. a
    // stat that shows "-" until there's enough text). Trying to "count"
    // between the two doesn't mean anything, so just swap directly.
    if (typeof prev !== 'number' || typeof value !== 'number') {
      setDisplayValue(value);
      setInkPhase('idle');
      setDelta(null);
      return;
    }

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    clearTimers();

    if (reducedMotion) {
      setDisplayValue(value);
      return;
    }

    const from = prev;
    const to = value;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT_DURATION_MS);
      setDisplayValue(Math.round(from + (to - from) * easeOutCubic(t)));
      rafRef.current = t < 1 ? requestAnimationFrame(tick) : null;
    };
    rafRef.current = requestAnimationFrame(tick);

    // Ink underline: draws in as the count settles, holds briefly, fades.
    // Reads as "this number just landed," not an alert.
    setInkPhase('drawing');
    timersRef.current.push(
      setTimeout(() => setInkPhase('fading'), COUNT_DURATION_MS + INK_HOLD_MS),
      setTimeout(() => setInkPhase('idle'), COUNT_DURATION_MS + INK_HOLD_MS + INK_FADE_MS)
    );

    // Floating delta chip — only for an actual change in magnitude, so a
    // toggle-and-back doesn't spam a "+0".
    const diff = to - from;
    if (diff !== 0) {
      const id = ++changeIdRef.current;
      const text = diff > 0 ? `+${diff.toLocaleString()}` : diff.toLocaleString();
      setDelta({ id, text, phase: 'entering' });
      timersRef.current.push(
        setTimeout(() => setDelta(d => (d?.id === id ? { ...d, phase: 'visible' } : d)), 20),
        setTimeout(() => setDelta(d => (d?.id === id ? { ...d, phase: 'leaving' } : d)), DELTA_HOLD_MS),
        setTimeout(() => setDelta(d => (d?.id === id ? null : d)), DELTA_HOLD_MS + DELTA_LEAVE_MS)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reducedMotion]);

  // Unmount cleanup — a fast-changing document (typing, pasting) could
  // leave an in-flight rAF or pending timers if this box unmounts
  // mid-animation (e.g. switching tabs).
  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    clearTimers();
  }, [clearTimers]);

  const isNumeric = typeof value === 'number';
  const useSuccessColor = isNumeric && !!isGreen && (value as number) > 0;
  const accentClass = useSuccessColor ? 'text-success' : 'text-primary';
  const shownValue = typeof displayValue === 'number' ? displayValue.toLocaleString() : (displayValue || '-');
  const fullValueTitle = typeof value === 'number' ? value.toLocaleString() : String(value ?? '');

  return (
    <div
      className={`group relative p-4 flex flex-col items-start gap-1 rounded-md border border-transparent hover:bg-muted/50 hover:border-border/60 transition-colors min-w-0 ${className}`}
    >
      <span
        className="text-xs font-medium text-muted-foreground uppercase tracking-wider truncate w-full"
        title={label}
      >
        {label}
      </span>

      <div className="relative w-full truncate">
        <span
          className={`font-mono text-2xl font-semibold tracking-tight ${useSuccessColor ? 'text-success' : 'text-foreground'}`}
          title={fullValueTitle}
        >
          {shownValue}
        </span>

        {delta && (
          <span
            key={delta.id}
            aria-hidden="true"
            className={`pointer-events-none absolute -top-1 left-full ml-2 text-xs font-mono font-medium whitespace-nowrap transition-all ease-out ${accentClass} ${
              delta.phase === 'entering' ? 'opacity-0 -translate-y-0 duration-0' :
              delta.phase === 'visible'  ? 'opacity-100 -translate-y-2 duration-200' :
                                           'opacity-0 -translate-y-4 duration-[420ms]'
            }`}
          >
            {delta.text}
          </span>
        )}

        {/* Ink underline: a quiet confirmation the value just moved,
            visible even if you weren't looking straight at the digits. */}
        <span
          aria-hidden="true"
          className={`absolute left-0 -bottom-0.5 h-px w-full origin-left bg-current transition-[transform,opacity] ${accentClass} ${
            inkPhase === 'drawing' ? 'scale-x-100 opacity-60 duration-300 ease-out' :
            inkPhase === 'fading'  ? 'scale-x-100 opacity-0 duration-[480ms] ease-in' :
                                     'scale-x-0 opacity-0 duration-0'
          }`}
        />
      </div>

      {sub && (
        <span className="text-xs text-muted-foreground/70 truncate w-full">{sub}</span>
      )}
    </div>
  );
}