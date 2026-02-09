import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Check for chunk loading errors (deployment related)
    if (
      error.message.includes('Failed to fetch dynamically imported module') ||
      error.message.includes('Importing a module script failed') ||
      error.name === 'ChunkLoadError'
    ) {
      const STORAGE_KEY = 'chunk_reload_attempted';
      const hasReloaded = sessionStorage.getItem(STORAGE_KEY);

      if (!hasReloaded) {
        sessionStorage.setItem(STORAGE_KEY, 'true');
        window.location.reload();
      } else {
        // If we already reloaded and still have error, clear parsing
        // so we don't block future legit updates, but show error UI now
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>

            <div className="space-y-2">
              <h1 className="font-display text-2xl font-semibold text-foreground">
                Something went wrong
              </h1>
              <p className="text-muted-foreground">
                We encountered an unexpected error. Please try refreshing the page or go back to the homepage.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={this.handleReload} variant="outline" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh page
              </Button>
              <Button onClick={this.handleGoHome} className="gap-2">
                <Home className="w-4 h-4" />
                Go to homepage
              </Button>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <details className="text-left mt-6 p-4 bg-muted rounded-lg">
                <summary className="text-sm font-medium cursor-pointer">
                  Error details (dev only)
                </summary>
                <pre className="mt-2 text-xs text-muted-foreground overflow-auto">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
