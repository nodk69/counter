import { createRoot } from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorFallback from './components/ErrorFallback';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary
    fallback={({ error, resetError }) => (
      <ErrorFallback
        error={error}
        resetError={resetError}
        title="Failed to Load Application"
        description="The application could not start. Please refresh the page or try again later."
      />
    )}
  >
    <App />
  </ErrorBoundary>
);