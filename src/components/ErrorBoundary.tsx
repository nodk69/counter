import React, { Component, ReactNode, ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  /** Fallback component to render when an error occurs */
  fallback: React.ComponentType<{
    error: Error;
    errorInfo?: ErrorInfo;
    resetError: () => void;
  }>;
  /** Children to wrap */
  children?: ReactNode;
  /** Callback for error reporting (Sentry, Datadog, etc.) */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Keys that should reset the error boundary when they change */
  resetKeys?: any[];
  /** Show error details in fallback (defaults to development only) */
  showErrorDetails?: boolean;
  /** Callback if reset fails */
  onResetFailed?: (error: Error) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Production-Ready Error Boundary
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  private prevResetKeys: any[] | undefined = undefined;
  private errorReported = false;

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    // Enhanced logging
    console.error('ErrorBoundary caught an error:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      location: typeof window !== 'undefined' ? window.location.href : undefined,
    });

    // Report error (once)
    if (this.props.onError && !this.errorReported) {
      try {
        this.props.onError(error, errorInfo);
        this.errorReported = true;
      } catch (loggingError) {
        console.error('Error reporting failed:', loggingError);
      }
    }
  }

  public componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys } = this.props;

    if (
      this.state.hasError &&
      resetKeys &&
      this.hasResetKeysChanged(resetKeys, prevProps.resetKeys)
    ) {
      this.resetError();
      this.prevResetKeys = resetKeys;
    }
  }

  private hasResetKeysChanged(newKeys: any[], prevKeys: any[] | undefined): boolean {
    if (!this.prevResetKeys) return true;
    if (newKeys.length !== this.prevResetKeys.length) return true;

    return newKeys.some((key, index) => key !== this.prevResetKeys?.[index]);
  }

  public resetError = () => {
    try {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      });
      this.errorReported = false;
    } catch (resetError) {
      if (this.props.onResetFailed) {
        this.props.onResetFailed(resetError as Error);
      }
      console.error('Error boundary reset failed:', resetError);
    }
  };

  public render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback;
      const shouldShowDetails = this.props.showErrorDetails ?? import.meta.env?.DEV ?? true;

      return (
        <FallbackComponent
          error={this.state.error}
          errorInfo={this.state.errorInfo || undefined}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;