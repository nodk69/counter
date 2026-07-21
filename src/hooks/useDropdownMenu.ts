import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';

export interface DropdownPosition {
  top: number;
  left: number;
  renderAbove: boolean;
}

// Global registry to ensure only one dropdown is open at a time
let activeCloseFn: (() => void) | null = null;

export function useDropdownMenu(align: 'left' | 'right' = 'left') {
  const [open, setOpenState] = useState(false);
  const [position, setPosition] = useState<DropdownPosition>({ top: 0, left: 0, renderAbove: false });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpenState(false);
    if (activeCloseFn === close) {
      activeCloseFn = null;
    }
  }, []);

  const openMenu = useCallback(() => {
    // Close currently active dropdown first
    if (activeCloseFn && activeCloseFn !== close) {
      activeCloseFn();
    }
    activeCloseFn = close;
    setOpenState(true);
  }, [close]);

  const toggle = useCallback(() => {
    if (open) {
      close();
    } else {
      openMenu();
    }
  }, [open, openMenu, close]);

  // Positioning logic
  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Initial default positions
    let top = rect.bottom + window.scrollY + 4;
    let left = align === 'right' 
      ? rect.right + window.scrollX 
      : rect.left + window.scrollX;
    let renderAbove = false;

    // Check size of the dropdown to prevent screen overflow
    const dropdown = dropdownRef.current;
    if (dropdown) {
      const dropdownRect = dropdown.getBoundingClientRect();
      const dropdownWidth = dropdownRect.width;
      const dropdownHeight = dropdownRect.height;
      const margin = 8;

      // Adjust horizontal position if overflowing right edge
      if (align === 'left' && rect.left + dropdownWidth > viewportWidth - margin) {
        left = viewportWidth - dropdownWidth - margin + window.scrollX;
      } else if (align === 'right' && rect.right - dropdownWidth < margin) {
        left = margin + window.scrollX;
      }

      // Adjust vertical position if overflowing bottom edge
      if (rect.bottom + dropdownHeight + margin > viewportHeight) {
        top = rect.top + window.scrollY - dropdownHeight - 4;
        renderAbove = true;
      }

      // Keep inside bounds
      left = Math.max(margin + window.scrollX, left);
      top = Math.max(margin + window.scrollY, top);
    }

    setPosition({ top, left, renderAbove });
  }, [align]);

  // Recalculate position when opening or when window changes
  useLayoutEffect(() => {
    if (open) {
      updatePosition();
    }
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;

    const handleScrollResize = () => {
      updatePosition();
    };

    window.addEventListener('resize', handleScrollResize, { passive: true });
    window.addEventListener('scroll', handleScrollResize, { passive: true, capture: true });

    return () => {
      window.removeEventListener('resize', handleScrollResize);
      window.removeEventListener('scroll', handleScrollResize, { capture: true });
    };
  }, [open, updatePosition]);

  // Pointerdown outside click handler
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (dropdownRef.current?.contains(target)) return;
      close();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [open, close]);

  // Keyboard navigation & accessibility controls
  useEffect(() => {
    if (!open) return;

    const dropdown = dropdownRef.current;
    if (!dropdown) return;

    const focusableItems = Array.from(
      dropdown.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), [tabindex="0"]'
      )
    );

    // Initial focus on first item
    if (focusableItems.length > 0) {
      focusableItems[0].focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        triggerRef.current?.focus();
        return;
      }

      const activeElement = document.activeElement as HTMLElement;
      const index = focusableItems.indexOf(activeElement);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (index + 1) % focusableItems.length;
        focusableItems[nextIndex]?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = (index - 1 + focusableItems.length) % focusableItems.length;
        focusableItems[prevIndex]?.focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        focusableItems[0]?.focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        focusableItems[focusableItems.length - 1]?.focus();
      } else if (e.key === 'Tab') {
        // Tab cycles inside the dropdown only
        e.preventDefault();
        const nextIdx = (index + (e.shiftKey ? -1 : 1) + focusableItems.length) % focusableItems.length;
        focusableItems[nextIdx]?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, close]);

  return {
    open,
    setOpen: setOpenState,
    toggle,
    close,
    triggerRef,
    dropdownRef,
    position,
  };
}
