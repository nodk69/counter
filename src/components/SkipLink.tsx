/**
 * WCAG 2.1 AA — Skip navigation link.
 * Invisible until focused via keyboard Tab; then jumps to #main-content.
 * Add id="main-content" to the <main> element in each page.
 */
export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className={[
        // Hidden by default
        'sr-only',
        // Visible when focused (keyboard users)
        'focus:not-sr-only',
        'focus:fixed focus:top-4 focus:left-4 focus:z-[10000]',
        'focus:bg-primary focus:text-white',
        'focus:px-4 focus:py-2 focus:rounded-lg',
        'focus:font-semibold focus:text-sm focus:font-sans',
        'focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white',
        'transition-all',
      ].join(' ')}
    >
      Skip to main content
    </a>
  );
}
