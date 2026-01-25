"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import Button from "@/components/atoms/Button";
import Typography from "@/components/atoms/Typography";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Reusable Error Boundary component with "Reload Component" functionality.
 * Catches errors in child components and displays a user-friendly error UI
 * instead of crashing the entire application.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error(
        `[ErrorBoundary${this.props.componentName ? ` (${this.props.componentName})` : ""}] Caught error:`,
        error,
        errorInfo,
      );
    }

    // In production, you could send to error tracking service (Sentry, etc.)
    if (process.env.NODE_ENV === "production") {
      // TODO: Send to error tracking service
      // logErrorToService(error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Call custom reset handler if provided
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="screen flex flex-col items-center justify-center p-xxl text-center space-y-md min-h-screen">
          <div className="flex items-center gap-2 text-brand-warm mb-2">
            <AlertTriangle size={24} />
            <Typography variant="h3" className="text-txt-main">
              Something went wrong
            </Typography>
          </div>

          <Typography variant="p" className="text-txt-sec">
            {this.props.componentName
              ? `An error occurred in ${this.props.componentName}.`
              : "An unexpected error occurred."}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-txt-muted">
                  Error details (dev only)
                </summary>
                <pre className="mt-2 text-xs bg-surface-secondary p-2 rounded overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </Typography>

          <div className="flex gap-sm mt-lg">
            <Button
              onClick={this.handleReset}
              variant="primary"
              className="flex items-center gap-2"
              icon={<RefreshCw size={16} />}
            >
              Reload Component
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="secondary"
            >
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * HOC wrapper for easier usage
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string,
) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary componentName={componentName}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
