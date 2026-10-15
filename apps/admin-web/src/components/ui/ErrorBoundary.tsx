import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-unisinu-red shadow-sm">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Ocurrió un error al cargar este módulo
          </h2>
          <p className="mt-2 max-w-md text-xs sm:text-sm text-slate-600">
            {this.state.error?.message || 'Se produjo una excepción inesperada durante la visualización.'}
          </p>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-unisinu-red px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-unisinu-red-hover transition"
            >
              <RotateCcw className="h-4 w-4" />
              Recargar página
            </button>
            <a
              href="/dashboard"
              className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Ir al inicio
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
