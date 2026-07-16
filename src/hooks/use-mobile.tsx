import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

function getQuery(): string {
  return `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;
}

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Safe initial value for SSR
    if (typeof window === 'undefined') return false;
    // Use matchMedia for the initial read too, not window.innerWidth.
    // The original code computed the initial state from `innerWidth <
    // BREAKPOINT` but the effect's ongoing checks used
    // `matchMedia('max-width: BREAKPOINT-1px')`. Those two conditions are
    // equivalent at the boundary but diverge in edge cases (e.g. a
    // scrollbar included in innerWidth on some platforms, or zoom levels
    // that round differently), causing a one-frame flicker between the
    // initial render and the first effect run. Reading from the same
    // matchMedia query both times removes that inconsistency.
    return window.matchMedia(getQuery()).matches;
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const mql = window.matchMedia(getQuery());

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };

    // Re-sync in case the viewport changed between the initial render
    // (e.g. during hydration) and this effect running.
    setIsMobile(mql.matches);

    mql.addEventListener('change', handleChange);

    return () => {
      mql.removeEventListener('change', handleChange);
    };
  }, []);

  return isMobile;
}