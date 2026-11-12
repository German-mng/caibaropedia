import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-medium text-[var(--text-primary)]">
              {this.props.fallbackTitle || "Раздел временно недоступен"}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] max-w-md leading-relaxed">
              Произошла непредвиденная ошибка при отрисовке компонента.
            </p>
          </div>
          <button
            onClick={this.handleReload}
            className="px-4 py-2 rounded-lg border border-[var(--border-hairline)] hover:bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] font-medium flex items-center gap-2 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Перезагрузить страницу</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
