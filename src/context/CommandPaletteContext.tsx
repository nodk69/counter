import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CommandPaletteCtx {
  open:        boolean;
  openPalette: () => void;
  close:       () => void;
}

const CommandPaletteContext = createContext<CommandPaletteCtx>({
  open:        false,
  openPalette: () => {},
  close:       () => {},
});

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  // Global keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Lock body scroll while palette is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const ctx: CommandPaletteCtx = {
    open,
    openPalette: () => setOpen(true),
    close:       () => setOpen(false),
  };

  return (
    <CommandPaletteContext.Provider value={ctx}>
      {children}
    </CommandPaletteContext.Provider>
  );
}

export const useCommandPalette = () => useContext(CommandPaletteContext);
