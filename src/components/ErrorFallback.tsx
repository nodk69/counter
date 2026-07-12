import React from 'react';

interface ErrorFallbackProps {
  /** Error that was caught */
  error: Error;
  /** Function to reset the error boundary */
  resetError: () => void;
  /** Title to display */
  title?: string;
  /** Description to display */
  description?: string;
  /** Label for the reset button */
  resetLabel?: string;
  /** Whether to show the reset button */
  showReset?: boolean;
}

/**
 * Generic fallback UI for error boundaries
 */
const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  title = 'Something went wrong',
  description = 'Please try again later or reload the page.',
  resetLabel = 'Try Again',
  showReset = true,
}) => {
  return (
    <div className="flex min-h-[20dvh] flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <svg
          className="w-6 h-6 text-destructive"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h1 className="mb-2 text-2xl font-bold text-destructive">{title}</h1>
      <p className="mb-6 text-muted-foreground">{description}</p>
      {showReset && (
        <button
          onClick={resetError}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors font-medium"
        >
          {resetLabel}
        </button>
      )}
    </div>
  );
};

export default ErrorFallback;