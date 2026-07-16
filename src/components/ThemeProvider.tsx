import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

// IMPORTANT: default is `undefined`, not a stand-in state object. The
// original code passed `initialState` (a real, valid-looking object) as
// the context default. That meant `useContext(ThemeProviderContext)`
// outside of a `<ThemeProvider>` never actually returned `undefined` — it
// silently returned working-looking theme state, so the `if (context ===
// undefined) throw` guard below could never fire. A component rendered
// outside the provider by mistake would silently theme itself as
// "system" and any `setTheme` calls would be no-ops, with no error to
// point at the real bug. Making the default genuinely `undefined` makes
// that guard actually do its job.
const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined)

function safeGetTheme(storageKey: string, fallback: Theme): Theme {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = window.localStorage.getItem(storageKey);
    return (stored as Theme) || fallback;
  } catch {
    // Private browsing / storage disabled — fall back rather than crash.
    return fallback;
  }
}

function safeSetTheme(storageKey: string, theme: Theme): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey, theme);
  } catch {
    // Quota exceeded or storage blocked — theme still applies for this
    // session via React state, it just won't persist across reloads.
  }
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => safeGetTheme(storageKey, defaultTheme))

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = window.document.documentElement;

    const applyTheme = (t: Theme) => {
      root.classList.remove("light", "dark");
      if (t === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        root.classList.add(systemTheme);
      } else {
        root.classList.add(t);
      }
    };

    applyTheme(theme);

    // Live-sync with OS theme changes while `theme === 'system'`. The
    // original effect only computed matchMedia().matches once per
    // `theme` change, so if the user had the tab open and toggled their
    // OS-level dark mode, the app's theme silently went stale until
    // something else triggered a re-render.
    if (theme === "system") {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("system");
      mql.addEventListener("change", handleChange);
      return () => mql.removeEventListener("change", handleChange);
    }
  }, [theme]);

  // setTheme is exposed through context to potentially many consumers.
  // Wrapping it in useCallback (and the context value in useMemo below)
  // means components that only read `theme` don't re-render just because
  // a parent re-rendered and recreated a fresh `setTheme` closure.
  const setTheme = useCallback((newTheme: Theme) => {
    safeSetTheme(storageKey, newTheme);
    setThemeState(newTheme);
  }, [storageKey]);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}