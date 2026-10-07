import * as React from 'react';
import { TriangleAlert } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="flex min-h-[100dvh] items-center justify-center bg-canvas p-4">
          <div className="w-full max-w-md rounded-[1.75rem] border border-line bg-surface p-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
              <TriangleAlert className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <h2 className="font-display text-xl font-semibold text-ink">
              This section failed to load
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Refresh the page to try again. If the problem continues, call the admissions desk at
              +91 98765 43210.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-strong"
            >
              Refresh page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
