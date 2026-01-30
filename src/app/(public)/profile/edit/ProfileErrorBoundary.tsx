"use client";

import React, { ErrorInfo } from "react";
import Typography from "@/components/atoms/Typography";
import Button from "@/components/atoms/Button";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ProfileErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ProfileErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-xxl text-center space-y-md">
          <Typography variant="h2" color="main">
            Something went wrong
          </Typography>
          <Typography variant="p" color="sec">
            We encountered an error while loading your profile editor.
          </Typography>
          <Button onClick={() => window.location.reload()} variant="primary">
            Reload Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
